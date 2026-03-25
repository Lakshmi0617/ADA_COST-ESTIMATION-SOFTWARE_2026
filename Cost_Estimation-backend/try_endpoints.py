import io
import json
import math
import os
import random
import tempfile

import uuid

import numpy as np
import trimesh
from OCP.BRep import BRep_Tool
from OCP.BRepBndLib import BRepBndLib
from OCP.BRepMesh import BRepMesh_IncrementalMesh
from OCP.Bnd import Bnd_Box

from OCP.IFSelect import IFSelect_RetDone
from OCP.RWGltf import RWGltf_CafWriter
from OCP.STEPControl import STEPControl_Reader
from OCP.TDocStd import TDocStd_Document
from OCP.TopAbs import TopAbs_SOLID, TopAbs_FACE
from OCP.TopExp import TopExp_Explorer

from pathlib import Path
import shutil
import cadquery as cq
from OCP.XCAFApp import XCAFApp_Application
from OCP.XCAFDoc import XCAFDoc_DocumentTool
from OCP.gp import gp_Ax1, gp_Pnt, gp_Dir, gp_Trsf
from cadquery import Workplane
from cadquery.occ_impl import importers
from pydantic import BaseModel

from pytz import timezone
from fastapi import  Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
import models
from db import get_db
from fastapi import APIRouter
import sys
sys.path.append(r"C:\Program Files\FreeCAD 1.0\bin")
import FreeCAD, Part

router = APIRouter()




#to get macid
@router.get("/mac-id")
def get_mac_id():
    # Get MAC as integer
    mac_int = uuid.getnode()
    # Format as standard MAC address (XX:XX:XX:XX:XX:XX)
    mac_str = ':'.join([f'{(mac_int >> ele) & 0xff:02x}' for ele in range(40, -1, -8)])
    return {"mac_id": mac_str}




#below code is used for extracting the bounding box of multiple step files present in a single folder by pasting the path of the folder

@router.post("/analyze-step-folder/")
async def analyze_step_folder(
    folder_path: str = Form(...),   # e.g. G:\GOKUL\ADA\All step files\Turning-stepfiles
    material_id: int = Form(...),
    quantity: int = Form(1),
    db: Session = Depends(get_db)
):
    folder = Path(folder_path)
    if not folder.exists() or not folder.is_dir():
        raise HTTPException(status_code=400, detail="Invalid folder path")

    results = []
    for file_path in folder.rglob("*.step"):   # ✅ recursive, handles subfolders too
        try:
            model = cq.importers.importStep(str(file_path))
            shape = model.val()
            bb = shape.BoundingBox()

            x_dim = bb.xmax - bb.xmin
            y_dim = bb.ymax - bb.ymin
            z_dim = bb.zmax - bb.zmin

            dims_sorted = sorted([(x_dim, 'X'), (y_dim, 'Y'), (z_dim, 'Z')], reverse=True, key=lambda x: x[0])
            length, breadth, height = dims_sorted[0][0], dims_sorted[1][0], dims_sorted[2][0]

            volume_mm3 = shape.Volume()
            volume_m3 = volume_mm3 / 1e9

            results.append({
                "filename": file_path.name,
                "length": round(length, 2),
                "breadth": round(breadth, 2),
                "height": round(height, 2),
                "volume_mm3": round(volume_mm3),
                "volume_m3": round(volume_m3, 10)
            })
        except Exception as e:
            results.append({"filename": file_path.name, "error": str(e)})

    return {"results": results}



def save_upload_to_disk(uploaded_file: UploadFile, upload_dir: Path) -> Path:
    """Save uploaded file to disk and return path."""
    saved_path = upload_dir / uploaded_file.filename
    with saved_path.open("wb") as f:
        f.write(uploaded_file.file.read())
    return saved_path

def detect_forming_direction_and_largest_face(cq_shape):
    """Dummy forming direction logic (replace with actual algorithm)."""
    return (0, 0, 1), cq_shape.faces().size()

def compute_sheet_thickness(cq_shape):
    """Dummy thickness calculation (replace with real logic)."""
    return 1.0

def make_offset_solid(shape: cq.Workplane, offset: float):
    """Offset the solid safely and return new Workplane."""
    solid = shape.val()
    moved = solid.translate((0, 0, offset))
    return cq.Workplane().add(moved)

@router.post("/auto-generate-tools111/")
async def auto_generate_tools(
    file: UploadFile = File(...),
    tool_depth: float = 50.0,
    extra_clearance: float = 0.2
):
    uploads_dir = Path("uploads")
    uploads_dir.mkdir(exist_ok=True)

    saved = save_upload_to_disk(file, uploads_dir)

    try:
        # Import STEP file
        part = cq.importers.importStep(str(saved))
        cq_shape = part
        solid = cq_shape.val()

        forming_dir, _ = detect_forming_direction_and_largest_face(cq_shape)
        thickness = compute_sheet_thickness(cq_shape)

        male_offset_amt = -(thickness + extra_clearance)
        female_offset_amt = +extra_clearance

        # Safe offsetting
        try:
            male_ref = make_offset_solid(cq_shape, male_offset_amt)
        except Exception:
            male_ref = cq_shape

        try:
            female_ref = make_offset_solid(cq_shape, female_offset_amt)
        except Exception:
            female_ref = cq_shape

        # Bounding box of part
        occ_bb = solid.BoundingBox()
        x_len, y_len, z_len = occ_bb.xlen, occ_bb.ylen, occ_bb.zlen
        cx = (occ_bb.xmin + occ_bb.xmax) / 2
        cy = (occ_bb.ymin + occ_bb.ymax) / 2
        zmax = occ_bb.zmax

        # Create tool blocks
        offset_block = max(10.0, max(x_len, y_len) * 0.05)
        male_box_x = x_len + 2 * offset_block
        male_box_y = y_len + 2 * offset_block
        male_box_z = tool_depth

        female_box_x = x_len + 4 * offset_block
        female_box_y = y_len + 4 * offset_block
        female_box_z = tool_depth

        male_block = Workplane("XY").box(male_box_x, male_box_y, male_box_z).translate(
            (cx, cy, zmax - male_box_z / 2)
        )
        female_block = Workplane("XY").box(female_box_x, female_box_y, female_box_z).translate(
            (cx, cy, zmax - female_box_z / 2)
        )

        # Generate male and female tools
        female_die = female_block.cut(male_ref)
        male_punch = male_block.intersect(male_ref)

        # ✅ Compute bounding boxes properly
        male_bb = male_punch.val().BoundingBox()
        female_bb = female_die.val().BoundingBox()

        return {
            "filename": file.filename,
            "forming_direction": {
                "x": round(forming_dir[0], 6),
                "y": round(forming_dir[1], 6),
                "z": round(forming_dir[2], 6),
            },
            "parameters": {
                "thickness_mm": round(thickness, 6),
                "extra_clearance_mm": round(extra_clearance, 6),
                "tool_depth_mm": round(tool_depth, 6),
            },
            "male_tool_bounding_box": {
                "xlen": round(male_bb.xlen, 3),
                "ylen": round(male_bb.ylen, 3),
                "zlen": round(male_bb.zlen, 3),
            },
            "female_tool_bounding_box": {
                "xlen": round(female_bb.xlen, 3),
                "ylen": round(female_bb.ylen, 3),
                "zlen": round(female_bb.zlen, 3),
            },
        }

    except Exception as e:
        return {"detail": f"Error generating tool bounding boxes: {str(e)}"}

    finally:
        try:
            saved.unlink(missing_ok=True)
        except Exception:
            pass


@router.post("/bounding-box_try/")
async def get_bounding_box(file: UploadFile = File(...)):
    # Validate file extension
    if not file.filename.endswith((".step", ".stp")):
        raise HTTPException(status_code=400, detail="Please upload a valid STEP file (.step or .stp)")

    try:
        # Save file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".step") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        # Load STEP file with CadQuery
        model = importers.importStep(tmp_path)
        shape = model.val()
        bb = shape.BoundingBox()

        # Extract dimensions
        x_dim = bb.xmax - bb.xmin
        y_dim = bb.ymax - bb.ymin
        z_dim = bb.zmax - bb.zmin

        dims_sorted = sorted([(x_dim, 'X'), (y_dim, 'Y'), (z_dim, 'Z')],
                             reverse=True, key=lambda x: x[0])
        length, breadth, height = dims_sorted[0][0], dims_sorted[1][0], dims_sorted[2][0]

        # Response
        return {
            "filename": file.filename,
            "bounding_box": {
                "length": round(length, 3),
                "breadth": round(breadth, 3),
                "height": round(height, 3),
                "x_dim": round(x_dim, 3),
                "y_dim": round(y_dim, 3),
                "z_dim": round(z_dim, 3),
                "xmin": round(bb.xmin, 3),
                "xmax": round(bb.xmax, 3),
                "ymin": round(bb.ymin, 3),
                "ymax": round(bb.ymax, 3),
                "zmin": round(bb.zmin, 3),
                "zmax": round(bb.zmax, 3)
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting bounding box: {e}")
#below code is used to extract multiple parts boundingbox dimension present in one single file like assembly files

@router.post("/analyze-step-assembly/")
async def analyze_step_assembly(
    step_file: UploadFile = File(...),   # Upload assembly STEP file
    material_id: int = Form(...),
    quantity: int = Form(1),
    db: Session = Depends(get_db)
):
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".step") as tmp:
        shutil.copyfileobj(step_file.file, tmp)
        tmp_path = Path(tmp.name)

    try:
        # Import STEP assembly
        model = cq.importers.importStep(str(tmp_path))
        shape = model.val()

        results = []
        # Iterate through all solids in the assembly
        for idx, solid in enumerate(shape.Solids()):
            try:
                bb = solid.BoundingBox()

                x_dim = bb.xmax - bb.xmin
                y_dim = bb.ymax - bb.ymin
                z_dim = bb.zmax - bb.zmin

                dims_sorted = sorted([(x_dim, 'X'), (y_dim, 'Y'), (z_dim, 'Z')],
                                     reverse=True, key=lambda x: x[0])
                length, breadth, height = dims_sorted[0][0], dims_sorted[1][0], dims_sorted[2][0]

                volume_mm3 = solid.Volume()
                volume_m3 = volume_mm3 / 1e9

                results.append({
                    "part_index": idx + 1,
                    "length": round(length, 2),
                    "breadth": round(breadth, 2),
                    "height": round(height, 2),
                    "volume_mm3": round(volume_mm3),
                    "volume_m3": round(volume_m3, 10)
                })
            except Exception as e:
                results.append({
                    "part_index": idx + 1,
                    "error": str(e)
                })

        return {"filename": step_file.filename, "parts": results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process STEP assembly: {str(e)}")

    finally:
        # Clean up temp file
        if tmp_path.exists():
            tmp_path.unlink()


async def analyze_step_assembly(
    step_file: UploadFile = File(...),
    material_id: int = Form(...),
    quantity: int = Form(1),
    db: Session = Depends(get_db)
):
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".step") as tmp:
        shutil.copyfileobj(step_file.file, tmp)
        tmp_path = Path(tmp.name)

    try:
        results = []

        # Load STEP with OCC reader
        step_reader = STEPControl_Reader()
        status = step_reader.ReadFile(str(tmp_path))

        if status != IFSelect_RetDone:
            raise HTTPException(status_code=400, detail="Failed to read STEP file")

        step_reader.TransferRoots()
        shape = step_reader.OneShape()

        # Explore solids in the shape
        exp = TopExp_Explorer(shape, TopAbs_SOLID)
        idx = 1
        while exp.More():
            solid = exp.Current()
            part_name = step_reader.StepModel().Value(idx).Name().ToCString() if step_reader.StepModel().Value(idx).HasName() else f"Part_{idx}"

            # Bounding Box
            bbox = Bnd_Box()
            BRepBndLib.Add(solid, bbox)
            xmin, ymin, zmin, xmax, ymax, zmax = bbox.Get()

            x_dim = xmax - xmin
            y_dim = ymax - ymin
            z_dim = zmax - zmin

            dims_sorted = sorted([(x_dim, 'X'), (y_dim, 'Y'), (z_dim, 'Z')],
                                 reverse=True, key=lambda x: x[0])
            length, breadth, height = dims_sorted[0][0], dims_sorted[1][0], dims_sorted[2][0]

            # Use cadquery for volume
            cq_solid = cq.Shape.cast(solid)
            volume_mm3 = cq_solid.Volume()
            volume_m3 = volume_mm3 / 1e9

            results.append({
                "part_index": idx,
                "part_name": part_name,
                "length": round(length, 2),
                "breadth": round(breadth, 2),
                "height": round(height, 2),
                "volume_mm3": round(volume_mm3),
                "volume_m3": round(volume_m3, 10)
            })

            idx += 1
            exp.Next()

        return {"filename": step_file.filename, "parts": results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process STEP assembly: {str(e)}")

    finally:
        if tmp_path.exists():
            tmp_path.unlink()


#below two codes are added for testing face detection and i stored metadata of faces using below code








@router.post("/generate-sheetmetal-tools/")
async def generate_sheetmetal_tools(file: UploadFile = File(...)):
    """
    Generate approximate male and female tool bounding boxes
    from a given sheet metal part STEP file.
    """
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = Path("uploads") / unique_filename
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # --- Load STEP file ---
        try:
            part = cq.importers.importStep(str(file_path))
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to read STEP file: {str(e)}")

        shape = part.val()
        bb_part = shape.BoundingBox()

        # --- Part dimensions ---
        x_len = round(bb_part.xlen, 3)
        y_len = round(bb_part.ylen, 3)
        z_len = round(bb_part.zlen, 3)

        # --- Approximation parameters ---
        offset_value = 5.0      # Tool clearance around sheet (mm)
        extrusion_depth = 50.0  # Tool block depth (mm)

        # --- Male tool (slightly smaller in X/Y, thicker Z) ---
        bb_male = {
            "x_length": round(x_len + 2 * offset_value, 3),
            "y_length": round(y_len + 2 * offset_value, 3),
            "z_length": round(z_len + extrusion_depth, 3)
        }

        # --- Female tool (slightly larger in X/Y, thicker Z) ---
        bb_female = {
            "x_length": round(x_len + 4 * offset_value, 3),
            "y_length": round(y_len + 4 * offset_value, 3),
            "z_length": round(z_len + extrusion_depth, 3)
        }

        # --- Prepare bounding box data ---
        bb_part_dict = {
            "x_length": x_len,
            "y_length": y_len,
            "z_length": z_len,
            "x_min": round(bb_part.xmin, 3),
            "x_max": round(bb_part.xmax, 3),
            "y_min": round(bb_part.ymin, 3),
            "y_max": round(bb_part.ymax, 3),
            "z_min": round(bb_part.zmin, 3),
            "z_max": round(bb_part.zmax, 3),
        }

        return {
            "filename": file.filename,
            "part_bounding_box": bb_part_dict,
            "male_tool_bounding_box": bb_male,
            "female_tool_bounding_box": bb_female,
            "approximation_parameters": {
                "offset_mm": offset_value,
                "extrusion_depth_mm": extrusion_depth
            }
        }

    finally:
        file_path.unlink(missing_ok=True)

def save_upload_to_disk(upload: UploadFile, dest_dir: Path) -> Path:
    dest_dir.mkdir(parents=True, exist_ok=True)
    unique = f"{uuid.uuid4()}_{upload.filename}"
    dest = dest_dir / unique
    with dest.open("wb") as f:
        shutil.copyfileobj(upload.file, f)
    return dest

def face_normal_and_area(face):
    try:
        n = face.normalAt(0.5, 0.5)
        nx, ny, nz = float(n.X()), float(n.Y()), float(n.Z())
    except Exception:
        nx, ny, nz = 0.0, 0.0, 1.0

    try:
        area = float(face.Area())
    except Exception:
        area = 0.0

    try:
        c = face.Center()
        cx, cy, cz = float(c.x), float(c.y), float(c.z)
    except Exception:
        cx, cy, cz = 0.0, 0.0, 0.0

    return (nx, ny, nz), area, (cx, cy, cz)

def detect_forming_direction_and_largest_face(shape):
    faces = list(shape.faces().vals())
    if not faces:
        return (0.0, 0.0, 1.0), None

    max_area = -1.0
    best_face = None
    best_normal = (0.0, 0.0, 1.0)
    for f in faces:
        normal, area, _ = face_normal_and_area(f)
        if area > max_area:
            max_area = area
            best_face = f
            best_normal = normal

    nx, ny, nz = best_normal
    if nz < 0:
        nx, ny, nz = -nx, -ny, -nz

    return (nx, ny, nz), best_face

def compute_sheet_thickness(shape, tol_dot=0.999, max_pairs=2000):
    faces = list(shape.faces().vals())
    n = len(faces)
    if n < 2:
        raise ValueError("Not enough faces to compute thickness.")

    face_data = []
    for f in faces:
        normal, area, center = face_normal_and_area(f)
        face_data.append({"face": f, "normal": normal, "area": area, "center": center})

    min_dist = float("inf")
    pairs_checked = 0

    for i in range(n):
        ni = face_data[i]["normal"]
        ci = face_data[i]["center"]
        for j in range(i + 1, n):
            pairs_checked += 1
            if pairs_checked > max_pairs:
                break

            nj = face_data[j]["normal"]
            dot = ni[0]*nj[0] + ni[1]*nj[1] + ni[2]*nj[2]
            if dot < -tol_dot:
                cj = face_data[j]["center"]
                vx, vy, vz = cj[0]-ci[0], cj[1]-ci[1], cj[2]-ci[2]
                proj = abs(vx*ni[0] + vy*ni[1] + vz*ni[2])
                if 1e-6 < proj < min_dist:
                    min_dist = proj
        if pairs_checked > max_pairs:
            break

    if min_dist == float("inf"):
        bb = shape.val().BoundingBox()
        fallback = max(0.1, round(bb.zlen, 6))
        return fallback
    return float(min_dist)

def make_offset_solid(shape, offset, tol=1e-3):
    try:
        from OCP.BRepOffsetAPI import BRepOffsetAPI_MakeOffsetShape
        occ_shape = shape.val()
        offset_builder = BRepOffsetAPI_MakeOffsetShape()
        offset_builder.Perform(occ_shape, offset, tol, True, True, True, 0.0)
        res_shape = offset_builder.Shape()
        return cq.Workplane(cq.Shape.cast(res_shape))
    except Exception as e:
        raise RuntimeError(f"Offset failed: {e}")

@router.post("/auto-generate-tools/")
async def auto_generate_tools(file: UploadFile = File(...),
                              tool_depth: float = 50.0,
                              extra_clearance: float = 0.2):
    uploads_dir = Path("uploads")
    outputs_dir = Path("generated_tools")
    uploads_dir.mkdir(exist_ok=True)
    outputs_dir.mkdir(exist_ok=True)

    saved = save_upload_to_disk(file, uploads_dir)

    try:
        part = cq.importers.importStep(str(saved))
        cq_shape = part
        solid = cq_shape.val()

        forming_dir, _ = detect_forming_direction_and_largest_face(cq_shape)
        thickness = compute_sheet_thickness(cq_shape)

        male_offset_amt = -(thickness + extra_clearance)
        female_offset_amt = +extra_clearance

        try:
            male_ref = make_offset_solid(cq_shape, male_offset_amt)
        except Exception:
            male_ref = cq_shape

        try:
            female_ref = make_offset_solid(cq_shape, female_offset_amt)
        except Exception:
            female_ref = cq_shape

        occ_bb = solid.BoundingBox()
        x_len, y_len, z_len = occ_bb.xlen, occ_bb.ylen, occ_bb.zlen
        cx = (occ_bb.xmin + occ_bb.xmax) / 2
        cy = (occ_bb.ymin + occ_bb.ymax) / 2
        zmax = occ_bb.zmax

        offset_block = max(10.0, max(x_len, y_len) * 0.05)
        male_box_x = x_len + 2 * offset_block
        male_box_y = y_len + 2 * offset_block
        male_box_z = z_len + tool_depth

        female_box_x = x_len + 4 * offset_block
        female_box_y = y_len + 4 * offset_block
        female_box_z = z_len + tool_depth

        male_block = Workplane("XY").box(male_box_x, male_box_y, male_box_z).translate((cx, cy, zmax - male_box_z / 2))
        female_block = Workplane("XY").box(female_box_x, female_box_y, female_box_z).translate((cx, cy, zmax - female_box_z / 2))

        female_die = female_block.cut(male_ref)
        male_punch = male_block.intersect(male_ref)

        # ✅ Bounding boxes of generated tools
        male_bb = male_punch.val().BoundingBox()
        female_bb = female_die.val().BoundingBox()

        base_name = Path(file.filename).stem
        part_out = outputs_dir / f"{base_name}_part.step"
        male_out = outputs_dir / f"{base_name}_male_tool.step"
        female_out = outputs_dir / f"{base_name}_female_tool.step"

        cq.exporters.export(cq_shape, str(part_out))
        cq.exporters.export(male_punch, str(male_out))
        cq.exporters.export(female_die, str(female_out))

        return {
            "filename": file.filename,
            "detected_thickness_mm": round(thickness, 6),
            "forming_direction_vector": {
                "x": round(forming_dir[0], 6),
                "y": round(forming_dir[1], 6),
                "z": round(forming_dir[2], 6),
            },
            "bounding_boxes": {
                "male_tool": {
                    "x_length": round(male_bb.xlen, 6),
                    "y_length": round(male_bb.ylen, 6),
                    "z_length": round(male_bb.zlen, 6),
                    "x_min": round(male_bb.xmin, 6),
                    "x_max": round(male_bb.xmax, 6),
                    "y_min": round(male_bb.ymin, 6),
                    "y_max": round(male_bb.ymax, 6),
                    "z_min": round(male_bb.zmin, 6),
                    "z_max": round(male_bb.zmax, 6),
                },
                "female_tool": {
                    "x_length": round(female_bb.xlen, 6),
                    "y_length": round(female_bb.ylen, 6),
                    "z_length": round(female_bb.zlen, 6),
                    "x_min": round(female_bb.xmin, 6),
                    "x_max": round(female_bb.xmax, 6),
                    "y_min": round(female_bb.ymin, 6),
                    "y_max": round(female_bb.ymax, 6),
                    "z_min": round(female_bb.zmin, 6),
                    "z_max": round(female_bb.zmax, 6),
                }
            },
            "exported_files": {
                "part_step": str(part_out),
                "male_tool_step": str(male_out),
                "female_tool_step": str(female_out),
            }
        }

    finally:
        try:
            saved.unlink(missing_ok=True)
        except Exception:
            pass



def shape_to_mesh(shape):
    """Triangulate OCCT shape → vertices & faces (numpy arrays)."""

    # Run OCCT mesh generator
    BRepMesh_IncrementalMesh(shape, 0.5, True)

    vertices = []
    faces = []

    exp = TopExp_Explorer(shape, TopAbs_FACE)
    vert_offset = 0

    while exp.More():
        face = exp.Current()
        loc = face.Location()

        triangulation = BRep_Tool.Triangulation_s(face, loc)

        if triangulation is None:
            exp.Next()
            continue

        # Extract nodes
        nodes = triangulation.Nodes()
        tri = triangulation.Triangles()

        local_verts = []
        for i in range(1, nodes.Size() + 1):
            p = nodes.Value(i)
            local_verts.append([p.X(), p.Y(), p.Z()])

        local_faces = []
        for i in range(1, tri.Size() + 1):
            t = tri.Value(i)
            # OBJ-style indices (1-based) → convert to 0-based
            local_faces.append([t.Value(1) - 1 + vert_offset,
                                t.Value(2) - 1 + vert_offset,
                                t.Value(3) - 1 + vert_offset])

        vertices.extend(local_verts)
        faces.extend(local_faces)

        vert_offset += len(local_verts)
        exp.Next()

    return np.array(vertices), np.array(faces)




