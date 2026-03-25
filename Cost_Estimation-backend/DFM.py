# import json
# import tempfile
# import numpy as np
# from fastapi import FastAPI, UploadFile, File, HTTPException
#
# from OCP.STEPControl import STEPControl_Reader
# from OCP.TopExp import TopExp_Explorer
# from OCP.TopAbs import TopAbs_FACE, TopAbs_EDGE, TopAbs_VERTEX
# from OCP.BRep import BRep_Tool
# from OCP.BRepAdaptor import BRepAdaptor_Surface, BRepAdaptor_Curve
# from OCP.GeomAbs import GeomAbs_Cylinder
# from OCP.gp import gp_Pnt
#
#
# # ===================================================================
# #                  DFM FEATURE EXTRACTION FUNCTION
# # ===================================================================
#
# def extract_dfm_features(step_path):
#
#     reader = STEPControl_Reader()
#     if reader.ReadFile(step_path) != 1:
#         raise Exception("Failed to read STEP file")
#
#     reader.TransferRoots()
#     shape = reader.OneShape()
#
#     # ----------- 1. Count Faces -------------
#     face_count = 0
#     exp = TopExp_Explorer(shape, TopAbs_FACE)
#     while exp.More():
#         face_count += 1
#         exp.Next()
#
#     # ----------- 2. Hole Detection -------------
#     hole_diameters = []
#     exp = TopExp_Explorer(shape, TopAbs_FACE)
#
#     while exp.More():
#         face = exp.Current()  # THIS IS A REAL FACE (no casting needed)
#
#         try:
#             surf = BRepAdaptor_Surface(face)
#
#             if surf.GetType() == GeomAbs_Cylinder:
#                 cyl = surf.Cylinder()
#                 hole_diameters.append(float(cyl.Radius() * 2))
#         except:
#             pass
#
#         exp.Next()
#
#     min_hole_diameter = min(hole_diameters) if hole_diameters else None
#
#     # ----------- 3. Internal Radius (Circular Edges) -------------
#     min_internal_radius = None
#     exp = TopExp_Explorer(shape, TopAbs_EDGE)
#
#     while exp.More():
#         edge = exp.Current()
#
#         try:
#             curve = BRepAdaptor_Curve(edge)
#             circle = curve.Circle()
#             r = float(circle.Radius())
#
#             if min_internal_radius is None or r < min_internal_radius:
#                 min_internal_radius = r
#         except:
#             pass
#
#         exp.Next()
#
#     # ----------- 4. Vertex Distances (Wall Thickness) -------------
#     vertices = []
#     exp = TopExp_Explorer(shape, TopAbs_VERTEX)
#
#     while exp.More():
#         vertex = exp.Current()
#
#         try:
#             p: gp_Pnt = BRep_Tool.Pnt(vertex)
#             vertices.append([p.X(), p.Y(), p.Z()])
#         except:
#             pass
#
#         exp.Next()
#
#     min_wall = None
#     if len(vertices) > 2:
#         pts = np.array(vertices)
#         dist = np.linalg.norm(pts[:, None] - pts[None, :], axis=2)
#         np.fill_diagonal(dist, np.inf)
#         min_wall = float(np.min(dist))
#
#     # ----------- 5. Pocket Depth -------------
#     max_pocket_depth = None
#     if vertices:
#         zs = [v[2] for v in vertices]
#         max_pocket_depth = float(max(zs) - min(zs))
#
#     # ----------- 6. Undercut check -------------
#     has_undercut = False
#     if min_hole_diameter and max_pocket_depth:
#         if max_pocket_depth / min_hole_diameter > 3:
#             has_undercut = True
#
#     return {
#         "face_count": face_count,
#         "min_hole_diameter": min_hole_diameter,
#         "min_internal_radius": min_internal_radius,
#         "min_wall_thickness": min_wall,
#         "max_pocket_depth": max_pocket_depth,
#         "has_undercut": has_undercut
#     }
#
#
# # ===================================================================
# #                         FASTAPI SERVER
# # ===================================================================
#
# app = FastAPI()
# RULES_FILE = "machinability_rules.json"
#
#
# def load_rules():
#     with open(RULES_FILE, "r") as f:
#         return json.load(f)
#
#
# @app.post("/analyze-stepfile")
# async def analyze_stepfile(file: UploadFile = File(...)):
#
#     if not file.filename.lower().endswith((".step", ".stp")):
#         raise HTTPException(400, "Upload a STEP/STP file")
#
#     with tempfile.NamedTemporaryFile(delete=False, suffix=".step") as tmp:
#         tmp.write(await file.read())
#         step_path = tmp.name
#
#     rules = load_rules()
#     features = extract_dfm_features(step_path)
#
#     issues = []
#     gr = rules["global_rules"]
#
#     if features["min_wall_thickness"] and features["min_wall_thickness"] < gr["min_wall_thickness_mm"]:
#         issues.append("Wall too thin")
#
#     if features["min_hole_diameter"] and features["min_hole_diameter"] < gr["min_hole_diameter_mm"]:
#         issues.append("Hole too small")
#
#     if features["min_internal_radius"] and features["min_internal_radius"] < gr["min_internal_radius_mm"]:
#         issues.append("Fillet radius too small")
#
#     if features["max_pocket_depth"] and features["min_hole_diameter"]:
#         if features["max_pocket_depth"] / features["min_hole_diameter"] > gr["max_pocket_depth_ratio"]:
#             issues.append("Pocket too deep")
#
#     if features["has_undercut"] and not gr["undercuts_allowed"]:
#         issues.append("Undercut detected")
#
#     score = max(0, 100 - len(issues) * 10)
#
#     return {
#         "file": file.filename,
#         "features": features,
#         "issues_found": issues,
#         "machinability_score": score
#     }












import json
import tempfile
import math
from fastapi import FastAPI, UploadFile, File, HTTPException
import numpy as np
import cadquery as cq

app = FastAPI()
RULES_FILE = "machinability_rules.json"


def load_rules():
    # If rules file missing, return defaults
    try:
        with open(RULES_FILE, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {
            "global_rules": {
                "min_wall_thickness_mm": 1.0,
                "min_hole_diameter_mm": 1.5,
                "min_internal_radius_mm": 0.5,
                "max_pocket_depth_ratio": 4.0,
                "undercuts_allowed": False
            }
        }


def import_step_with_cq(path):
    """
    Try a few possible CadQuery import ways. Return CadQuery object (Workplane or Compound-like).
    """
    # Try cadquery importers
    try:
        imp = getattr(cq.importers, "importStep", None)
        if callable(imp):
            part = imp(path)
            return part
    except Exception:
        pass

    # Try cadquery.occ_impl.importers if present
    try:
        imp2 = getattr(cq, "importers", None)
        if imp2:
            imp = getattr(imp2, "importStep", None)
            if callable(imp):
                return imp(path)
    except Exception:
        pass

    # Try using cq.Workplane.fromCompound (fallback: load using cadquery's OCC bridge)
    try:
        # Some CadQuery builds expose cadquery.occ_impl.importers.importStep
        occ_imp = None
        if hasattr(cq, "occ_impl"):
            occ_imp = getattr(cq.occ_impl.importers, "importStep", None)
        if occ_imp and callable(occ_imp):
            return occ_imp(path)
    except Exception:
        pass

    raise RuntimeError("Could not import STEP using CadQuery importers")


def get_face_list(part):
    """
    Return a list-like of face wrappers. Support multiple CadQuery versions:
    - part.faces().objects
    - part.faces().vals()
    - part.faces()
    """
    faces = []
    try:
        # Preferred: .faces().objects (each element is a Face wrapper)
        faces_col = part.faces()
        if hasattr(faces_col, "objects"):
            faces = faces_col.objects
            return faces
        if hasattr(faces_col, "vals"):
            # .vals() returns underlying OCC shapes - but still useful.
            vals = faces_col.vals()
            # Wrap minimal interface around vals (we'll treat each element as "face_obj")
            return vals
        # If faces_col itself is iterable
        try:
            if hasattr(faces_col, "__iter__"):
                return list(faces_col)
        except Exception:
            pass
    except Exception:
        # fallback: try direct attribute
        try:
            return list(part.faces)
        except Exception:
            pass

    return faces


def get_edge_list_from_face(face):
    """Return list-like of edge wrappers for a face; supports multiple APIs."""
    try:
        fe = face.edges()
        if hasattr(fe, "objects"):
            return fe.objects
        if hasattr(fe, "vals"):
            return fe.vals()
        if hasattr(fe, "__iter__"):
            return list(fe)
    except Exception:
        # Some faces are OCC shapes; try cadquery.Face(face).edges()
        try:
            # wrap into cadquery Face wrapper
            fwrap = cq.Face.makeFromOCC(face) if hasattr(cq.Face, "makeFromOCC") else None
            if fwrap is not None:
                fe = fwrap.edges()
                if hasattr(fe, "objects"):
                    return fe.objects
                if hasattr(fe, "vals"):
                    return fe.vals()
            # last fallback: try part.edges() globally (handled elsewhere)
        except Exception:
            pass
    return []


def get_vertex_list(part):
    """
    Try several ways to obtain all vertex coordinates from the part.
    Returns list of (x,y,z) floats.
    """
    verts = []
    # Try part.vertices().objects
    try:
        vcol = part.vertices()
        if hasattr(vcol, "objects"):
            for v in vcol.objects:
                try:
                    p = v.toTuple() if hasattr(v, "toTuple") else None
                    if p:
                        verts.append([float(p[0]), float(p[1]), float(p[2])])
                        continue
                except Exception:
                    pass
                # try other ways
                try:
                    vv = v.val() if hasattr(v, "val") else v
                    coords = vv.X(), vv.Y(), vv.Z()
                    verts.append([float(coords[0]), float(coords[1]), float(coords[2])])
                except Exception:
                    pass
            if verts:
                return verts
        if hasattr(vcol, "vals"):
            vals = vcol.vals()
            for vv in vals:
                try:
                    p = vv.Coord() if hasattr(vv, "Coord") else None
                    if p:
                        verts.append([float(p.X()), float(p.Y()), float(p.Z())])
                        continue
                except Exception:
                    pass
                try:
                    coords = vv.X(), vv.Y(), vv.Z()
                    verts.append([float(coords[0]), float(coords[1]), float(coords[2])])
                except Exception:
                    pass
            if verts:
                return verts
    except Exception:
        pass

    # Try part.val().Vertices() via underlying OCC
    try:
        comp = part.val() if hasattr(part, "val") else part
        # iterate using cadquery helper
        try:
            for v in cq.Face(comp).vertices().vals():
                p = v.Coord()
                verts.append([float(p.X()), float(p.Y()), float(p.Z())])
            if verts:
                return verts
        except Exception:
            pass
    except Exception:
        pass

    # As a last resort, try tessellation to get mesh vertices (slower)
    try:
        # export a rough STL mesh and use numpy from that
        stl_str = cq.Workplane("XY").add(part).val().tessellate(1e-2)  # may fail silently
    except Exception:
        stl_str = None

    if stl_str:
        # can't rely on this; skip
        pass

    return verts


def safe_edge_radius(edge):
    """
    Try to extract a radius from an edge wrapper.
    Many CadQuery Edge wrappers expose .radius() or .radius; otherwise attempt sampling.
    Returns radius (float) or None.
    """
    # try direct method
    try:
        if hasattr(edge, "radius"):
            r = edge.radius() if callable(edge.radius) else edge.radius
            if r is not None and r > 0:
                return float(r)
    except Exception:
        pass

    # try to get curve type or geometry and compute radius
    try:
        # edge.val() may give OCC edge; use CadQuery wrapper to compute circle if arc
        if hasattr(edge, "val"):
            e = edge.val()
            # try to get circle via underlying evaluator (best-effort)
            try:
                # many minimal builds don't expose geometry; wrap in try
                circ = getattr(edge, "circle", None)
                if callable(circ):
                    r = circ()
                    if r:
                        return float(r)
            except Exception:
                pass
    except Exception:
        pass

    return None


def analyze_with_cadquery(step_path):
    """
    Main analysis using CadQuery high-level API.
    Returns feature dict.
    """
    # Load STEP into CadQuery object
    part = import_step_with_cq(step_path)

    # Face count
    faces = get_face_list(part)
    face_count = len(faces) if faces is not None else 0

    # Hole detection: look for cylindrical faces or circular edges.
    hole_diameters = []
    # Fillet radii (internal circular edges)
    fillet_radii = []

    # For vertices/wall thickness
    vertices = []

    # Loop faces
    if faces:
        for face in faces:
            # Determine face type via high-level API if available
            face_type = None
            try:
                if hasattr(face, "geomType") and callable(face.geomType):
                    face_type = face.geomType().upper()
                elif hasattr(face, "geomType"):
                    face_type = str(face.geomType()).upper()
            except Exception:
                face_type = None

            # If it's a cylinder face, try to get radius
            if face_type and "CYLIND" in face_type.upper():
                try:
                    # Some face wrappers expose .radius()
                    r = None
                    if hasattr(face, "radius"):
                        r = face.radius() if callable(face.radius) else face.radius
                    # fallback: get circular edge on this face
                    if r is None:
                        edges = get_edge_list_from_face(face)
                        for ed in edges:
                            rr = safe_edge_radius(ed)
                            if rr:
                                r = rr
                                break
                    if r:
                        hole_diameters.append(float(r * 2))
                except Exception:
                    pass

            # If face not cylinder, still check edges for circular loops (holes)
            try:
                edges = get_edge_list_from_face(face)
                for ed in edges:
                    rr = safe_edge_radius(ed)
                    if rr:
                        # treat small circular edges as possible holes or fillets
                        # Decide whether it's a fillet or a hole edge by checking edge length vs radius
                        try:
                            # many edge wrappers provide length()
                            length = None
                            if hasattr(ed, "length"):
                                length = ed.length() if callable(ed.length) else ed.length
                            if length is None and hasattr(ed, "Length"):
                                length = ed.Length() if callable(ed.Length) else ed.Length
                            # if length is relatively large (circumference ~ 2*pi*r) -> hole/circle
                            if length and length > 2.5 * rr:
                                hole_diameters.append(float(rr * 2))
                            else:
                                # small radius -> fillet
                                fillet_radii.append(float(rr))
                        except Exception:
                            # fallback: add as fillet
                            fillet_radii.append(float(rr))
            except Exception:
                pass

    # Vertex extraction (for wall thickness and pocket depth)
    verts = get_vertex_list(part)
    if verts:
        vertices = verts

    # Compute min wall thickness approx (min distance between vertices)
    min_wall = None
    if len(vertices) > 2:
        pts = np.array(vertices, dtype=float)
        dist = np.linalg.norm(pts[:, None] - pts[None, :], axis=2)
        np.fill_diagonal(dist, np.inf)
        min_wall = float(np.min(dist))

    # Pocket depth heuristic (z-range)
    max_pocket_depth = None
    if vertices:
        zs = [v[2] for v in vertices]
        max_pocket_depth = float(max(zs) - min(zs))

    # min hole diameter and min internal radius
    min_hole_diameter = float(min(hole_diameters)) if hole_diameters else None
    min_internal_radius = float(min(fillet_radii)) if fillet_radii else None

    # Undercut heuristic: pocket depth vs smallest hole diameter
    has_undercut = False
    if min_hole_diameter and max_pocket_depth:
        if max_pocket_depth / min_hole_diameter > 3:
            has_undercut = True

    return {
        "face_count": int(face_count),
        "min_hole_diameter": min_hole_diameter,
        "min_internal_radius": min_internal_radius,
        "min_wall_thickness": float(min_wall) if min_wall else None,
        "max_pocket_depth": float(max_pocket_depth) if max_pocket_depth else None,
        "has_undercut": bool(has_undercut)
    }


@app.post("/analyze-stepfile")
async def analyze_stepfile(file: UploadFile = File(...)):
    # Validate filename
    if not file.filename.lower().endswith((".step", ".stp")):
        raise HTTPException(status_code=400, detail="Upload a STEP/STP file")

    # Save to temp
    with tempfile.NamedTemporaryFile(delete=False, suffix=".step") as tmp:
        tmp.write(await file.read())
        step_path = tmp.name

    # Load rules and analyze
    rules = load_rules()
    try:
        features = analyze_with_cadquery(step_path)
    except Exception as e:
        # If analysis fails, return helpful error message
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

    # Apply rules
    issues = []
    gr = rules["global_rules"]

    if features["min_wall_thickness"] and features["min_wall_thickness"] < gr["min_wall_thickness_mm"]:
        issues.append("Wall too thin")

    if features["min_hole_diameter"] and features["min_hole_diameter"] < gr["min_hole_diameter_mm"]:
        issues.append("Hole too small")

    if features["min_internal_radius"] and features["min_internal_radius"] < gr["min_internal_radius_mm"]:
        issues.append("Fillet radius too small")

    if features["max_pocket_depth"] and features["min_hole_diameter"]:
        ratio = features["max_pocket_depth"] / features["min_hole_diameter"]
        if ratio > gr["max_pocket_depth_ratio"]:
            issues.append("Pocket too deep")

    if features["has_undercut"] and not gr["undercuts_allowed"]:
        issues.append("Undercut detected")

    score = max(0, 100 - len(issues) * 10)

    return {
        "file": file.filename,
        "features": features,
        "issues_found": issues,
        "machinability_score": score
    }








#uvicorn DFM:app --host 0.0.0.0 --port 9000
