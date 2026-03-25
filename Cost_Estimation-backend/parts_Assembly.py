#


import os
import uuid
import tempfile
import shutil
from pathlib import Path
import numpy as np
import trimesh

import cadquery as cq
from OCP.BRepAdaptor import BRepAdaptor_Surface
from OCP.BRepGProp import BRepGProp_Face, BRepGProp

from OCP.Bnd import Bnd_Box
from OCP.GProp import GProp_GProps
from OCP.GeomLProp import GeomLProp_SLProps
from OCP.TopoDS import TopoDS, TopoDS_Face
from cadquery import importers

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from trimesh.exchange.gltf import export_glb

# OCCT imports (from cadquery-ocp 7.7.2)
from OCP.TopoDS import TopoDS
from OCP.BRepMesh import BRepMesh_IncrementalMesh
from OCP.BRep import BRep_Tool
from OCP.TopExp import TopExp_Explorer
from OCP.TopAbs import TopAbs_FACE
from OCP.TopoDS import TopoDS_Face


UPLOAD_DIR = "uploads"
MESH_DIR = "meshes"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(MESH_DIR, exist_ok=True)

app = FastAPI(title="STEP → Per-Part GLB Exporter (OCCT Stable Version)")

# Allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve GLB files
app.mount("/meshes", StaticFiles(directory=MESH_DIR), name="meshes")


# ---------------------------------------------------------
#  🔥 Correct OCCT Triangulation for your installation
# ---------------------------------------------------------
def cast_to_face(shape):
    tshape = shape.TShape()

    if tshape.ShapeType() != TopAbs_FACE:
        return None

    face = TopoDS_Face()
    face.TShape(tshape)
    face.Location(shape.Location())
    face.Orientation(shape.Orientation())

    return face

def triangulate_solid_occt(solid):
    shape = solid.wrapped

    # Generate triangulation
    mesher = BRepMesh_IncrementalMesh(shape, 0.5, False)
    mesher.Perform()

    vertices = []
    faces = []
    vmap = {}

    exp = TopExp_Explorer(shape, TopAbs_FACE)

    while exp.More():
        orig = exp.Current()
        face = cast_to_face(orig)
        if face is None:
            exp.Next()
            continue

        loc = face.Location()
        tri = BRep_Tool.Triangulation_s(face, loc)
        if tri is None:
            exp.Next()
            continue

        nb_nodes = tri.NbNodes()
        nb_tris = tri.NbTriangles()

        # Extract nodes (old OCCT API: Node(i))
        node_cache = {}
        for i in range(1, nb_nodes + 1):
            pnt = tri.Node(i).Transformed(loc.Transformation())
            key = (pnt.X(), pnt.Y(), pnt.Z())
            if key not in vmap:
                vmap[key] = len(vertices)
                vertices.append([pnt.X(), pnt.Y(), pnt.Z()])
            node_cache[i] = key

        # Extract triangles (old OCCT API: Triangle(i))
        for i in range(1, nb_tris + 1):
            tri_indices = tri.Triangle(i).Get()
            n1, n2, n3 = tri_indices

            faces.append([
                vmap[node_cache[n1]],
                vmap[node_cache[n2]],
                vmap[node_cache[n3]]
            ])

        exp.Next()

    return vertices, faces
# ---------------------------------------------------------
#  🔥 STEP → PART → GLB Export Route
# ---------------------------------------------------------
@app.post("/convert-step-to-meshes/")
async def convert_step_to_meshes(step_file: UploadFile = File(...)):
    # Save temp input STEP
    with tempfile.NamedTemporaryFile(delete=False, suffix=".step") as tmp:
        shutil.copyfileobj(step_file.file, tmp)
        tmp_path = Path(tmp.name)

    try:
        model = importers.importStep(str(tmp_path))
        shape = model.val()

        results = []
        part_index = 1

        # Extract solids
        for solid in shape.Solids():

            # ---- Triangulate using OCCT ----
            vertices, faces = triangulate_solid_occt(solid)

            if len(vertices) == 0 or len(faces) == 0:
                continue

            mesh = trimesh.Trimesh(
                vertices=np.array(vertices),
                faces=np.array(faces),
                process=False
            )

            # Clean mesh
            mesh.remove_degenerate_faces()
            mesh.remove_duplicate_faces()
            mesh.rezero()
            mesh.process(validate=True)

            # Export binary GLB
            filename = f"part_{part_index}_{uuid.uuid4().hex[:6]}.glb"
            output_path = Path(MESH_DIR) / filename

            glb_bytes = export_glb(mesh)
            with open(output_path, "wb") as f:
                f.write(glb_bytes)

            results.append({
                "part_index": part_index,
                "mesh_url": f"/meshes/{filename}",
                "vertex_count": len(vertices),
                "triangle_count": len(faces)
            })

            part_index += 1

        return {
            "filename": step_file.filename,
            "total_parts": len(results),
            "parts": results
        }

    finally:
        if tmp_path.exists():
            tmp_path.unlink()





@app.post("/convert-step-to-part-face-areas/")
async def convert_step_to_part_face_areas(
    step_file: UploadFile = File(...)
):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".step") as tmp:
        shutil.copyfileobj(step_file.file, tmp)
        tmp_path = Path(tmp.name)

    try:
        model = importers.importStep(str(tmp_path))
        shape = model.val()

        parts_output = []

        # =================================================
        # Iterate PARTS
        # =================================================
        for part_index, solid in enumerate(shape.Solids(), start=1):

            faces = solid.Faces()
            if not faces:
                continue

            face_centers = []
            face_data = []

            # ---------------------------------------------
            # FIRST PASS: face area + center + normal
            # ---------------------------------------------
            for idx, face in enumerate(faces, start=1):

                area_mm2 = face.Area()
                com = face.Center()
                face_center = np.array([com.x, com.y, com.z])
                face_centers.append(face_center)

                normal = face.normalAt()
                normal_vec = np.array([normal.x, normal.y, normal.z])
                normal_vec /= np.linalg.norm(normal_vec)

                face_data.append({
                    "face_index": idx,
                    "center": face_center,
                    "normal": normal_vec,
                    "area_mm2": area_mm2
                })

            # ---------------------------------------------
            # PART CENTER
            # ---------------------------------------------
            part_center = np.mean(face_centers, axis=0)

            outer_area_sum_mm2 = 0.0
            inner_area_sum_mm2 = 0.0

            largest_outer = {"face_index": -1, "area_mm2": 0.0}
            largest_inner = {"face_index": -1, "area_mm2": 0.0}

            # ---------------------------------------------
            # SECOND PASS: OUTER / INNER classification
            # ---------------------------------------------
            for f in face_data:
                dot_val = np.dot(f["normal"], f["center"] - part_center)

                if dot_val > 0:
                    outer_area_sum_mm2 += f["area_mm2"]

                    if f["area_mm2"] > largest_outer["area_mm2"]:
                        largest_outer = {
                            "face_index": f["face_index"],
                            "area_mm2": f["area_mm2"]
                        }
                else:
                    inner_area_sum_mm2 += f["area_mm2"]

                    if f["area_mm2"] > largest_inner["area_mm2"]:
                        largest_inner = {
                            "face_index": f["face_index"],
                            "area_mm2": f["area_mm2"]
                        }

            parts_output.append({
                "part_index": part_index,

                "outer_faces": {
                    "total_area_m2": round(outer_area_sum_mm2 / 1e6, 4),
                    "largest_face": {
                        "face_index": largest_outer["face_index"],
                        "area_m2": round(largest_outer["area_mm2"] / 1e6, 4)
                    }
                },

                "inner_faces": {
                    "total_area_m2": round(inner_area_sum_mm2 / 1e6, 4),
                    "largest_face": {
                        "face_index": largest_inner["face_index"],
                        "area_m2": round(largest_inner["area_mm2"] / 1e6, 4)
                    }
                }
            })

        return {
            "filename": step_file.filename,
            "total_parts": len(parts_output),
            "parts": parts_output
        }

    finally:
        if tmp_path.exists():
            tmp_path.unlink()



# Manual run
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("parts_Assembly:app", host="0.0.0.0", port=8001, reload=True)



#
# Package           Version
# ----------------- -------
# annotated-types   0.7.0
# anyio             4.9.0
# bcrypt            4.3.0
# bleach            6.2.0
# cadquery          2.5.2
# cadquery-ocp      7.7.2
# casadi            3.7.0
# cement            3.0.4
# cffi              1.17.1
# click             8.2.1
# colorama          0.4.6
# colorlog          6.9.0
# cryptography      45.0.5
# Deprecated        1.2.18
# ecdsa             0.19.1
# ezdxf             1.4.3
# fastapi           0.116.0
# fonttools         4.58.5
# greenlet          3.2.3
# h11               0.16.0
# idna              3.10
# itsdangerous      2.2.0
# Jinja2            3.1.6
# limits            5.4.0
# MarkupSafe        3.0.2
# multimethod       1.12
# networkx          3.6
# nlopt             2.9.1
# numpy             2.3.5
# packaging         25.0
# passlib           1.7.4
# path              17.1.0
# pip               25.3
# psycopg2-binary   2.9.9
# pyasn1            0.6.1
# pycparser         2.22
# pydantic          2.11.7
# pydantic_core     2.33.2
# PyJWT             2.10.1
# pyparsing         3.2.3
# python-jose       3.5.0
# python-multipart  0.0.20
# pytz              2025.2
# PyYAML            6.0.2
# rsa               4.9.1
# scipy             1.16.3
# setuptools        80.9.0
# six               1.17.0
# slowapi           0.1.9
# sniffio           1.3.1
# SQLAlchemy        2.0.30
# starlette         0.46.2
# trimesh           4.8.2
# typing_extensions 4.14.1
# typing-inspection 0.4.1
# typish            1.9.3
# uvicorn           0.35.0
# webencodings      0.5.1
# wrapt             1.17.2

