import io
import tempfile
from collections import defaultdict
import random
import numpy as np
import trimesh
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form
from pathlib import Path as FilePath, Path
import uuid
import shutil
from cadquery import importers
from sqlalchemy.orm import Session
from starlette.responses import StreamingResponse

from db import get_db
from models import CompositesPrepregCost, MasterToolCost, CompositeAnalysisResult, MasterToolHourTable, \
    CompositesPartToolCost, PartToolLayupHourTable, PartToolHourTable, CompositesPartFabricationCost, \
    PartFabricationLayupHourTable, PartFabricationHourTable, CompositeMasterModelCost, CompositeToolCost, \
    CompositePartToolFinalCost, CompositeStepfileDetails, CompositeCorrectionFactor,CompositeCorrectionFactor1,CompositeCorrectionFactor2,CompositeCorrectionFactor3

from schemas import UpdatePrepregCostInput, CreatePrepregCostInput, MasterToolCostUpdate, CompositesPartToolCostUpdate, \
    CompositesPartFabricationCostUpdate, MasterToolHourUpdateRange, MasterToolHourCreate, PartToolHourUpdateRange, \
    PartToolHourCreate, PartToolLayupHourCreate, PartToolLayupHourUpdateRange, PartFabricationHourUpdateRange, \
    PartFabricationHourCreate, PartFabricationLayupHourCreate, PartFabricationLayupHourUpdateRange, StockOverrideInput, \
    QuantityUpdateRequest

router = APIRouter()






#
# @router.post("/extract-composite-shell/")
# async def extract_composite_shell(file: UploadFile = File(...)):
#     upload_dir = FilePath("uploads")
#     upload_dir.mkdir(exist_ok=True)
#     file_path = upload_dir / f"{uuid.uuid4()}_{file.filename}"
#
#     try:
#         # ---------------------------
#         # Save STEP
#         # ---------------------------
#         with file_path.open("wb") as f:
#             shutil.copyfileobj(file.file, f)
#
#         solid = importers.importStep(str(file_path)).val()
#
#         faces = solid.Faces()
#
#         if not faces:
#             raise HTTPException(400, "No faces found in STEP")
#
#         # =================================================
#         # PART A: THICKNESS (OLD, WORKING LOGIC)
#         # =================================================
#         # Cluster faces by SIGNED normal
#         clusters = defaultdict(list)
#
#         for f in faces:
#             try:
#                 n = f.normalAt()
#                 v = np.array([n.x, n.y, n.z])
#                 v /= np.linalg.norm(v)
#                 key = tuple(np.round(v, 2))
#                 clusters[key].append(f)
#             except:
#                 pass
#
#         if len(clusters) < 2:
#             raise HTTPException(400, "Unable to cluster shell faces")
#
#         # Sort clusters by total area
#         cluster_list = []
#         for k, fs in clusters.items():
#             area = sum(f.Area() for f in fs)
#             cluster_list.append((k, fs, area))
#
#         cluster_list.sort(key=lambda x: x[2], reverse=True)
#
#         # Outer skin = largest area cluster
#         outer_key, outer_faces_for_thickness, _ = cluster_list[0]
#
#         # Find opposite cluster = inner skin
#         inner_faces_for_thickness = None
#         for k, fs, _ in cluster_list[1:]:
#             if np.dot(np.array(k), np.array(outer_key)) < -0.9:
#                 inner_faces_for_thickness = fs
#                 break
#
#         if not inner_faces_for_thickness:
#             raise HTTPException(400, "Inner shell not detected")
#
#         # Thickness calculation
#         n = np.array(outer_key)
#         n /= np.linalg.norm(n)
#
#         outer_proj = [
#             np.dot([f.Center().x, f.Center().y, f.Center().z], n)
#             for f in outer_faces_for_thickness
#         ]
#
#         inner_proj = [
#             np.dot([f.Center().x, f.Center().y, f.Center().z], n)
#             for f in inner_faces_for_thickness
#         ]
#
#         thickness_mm = round(abs(np.mean(outer_proj) - np.mean(inner_proj)), 3)
#
#         # =================================================
#         # PART B: SURFACE AREA (NEW, CORRECT LOGIC)
#         # =================================================
#         # Use centroid + normal direction to classify outer faces
#         bb = solid.BoundingBox()
#         part_center = np.array([
#             (bb.xmin + bb.xmax) / 2,
#             (bb.ymin + bb.ymax) / 2,
#             (bb.zmin + bb.zmax) / 2
#         ])
#
#         outer_faces_for_area = []
#
#         for f in faces:
#             try:
#                 c = f.Center()
#                 c_vec = np.array([c.x, c.y, c.z])
#
#                 n = f.normalAt()
#                 n_vec = np.array([n.x, n.y, n.z])
#                 n_vec /= np.linalg.norm(n_vec)
#
#                 if np.dot(c_vec - part_center, n_vec) > 0:
#                     outer_faces_for_area.append(f)
#             except:
#                 pass
#
#         if not outer_faces_for_area:
#             raise HTTPException(400, "Failed to detect outer skin for area")
#
#         ply_area_mm2 = sum(f.Area() for f in outer_faces_for_area)
#         ply_area_m2 = round(ply_area_mm2 / 1e6, 3)
#
#         # =================================================
#         # RESPONSE
#         # =================================================
#         return {
#             "filename": file.filename,
#             "bounding_box_mm": {
#                 "length": round(bb.xlen, 2),
#                 "breadth": round(bb.ylen, 2),
#                 "height": round(bb.zlen, 2)
#             },
#             "composite_properties": {
#                 "thickness_mm": thickness_mm,
#                 "one_ply_surface_area_m2": ply_area_m2
#             }
#         }
#
#     except Exception as e:
#         raise HTTPException(400, str(e))
#
#     finally:
#         file_path.unlink(missing_ok=True)
#


@router.get("/composites/prepregs/")
def get_all_composites_prepregs(db: Session = Depends(get_db)):
    rows = db.query(CompositesPrepregCost).all()

    if not rows:
        return {
            "count": 0,
            "data": []
        }

    return {
        "count": len(rows),
        "data": [
            {
                "id": row.id,
                "material": row.material,
                "spec": row.spec,
                "density_kg_m3": row.density_kg_m3,
                "thickness_mm": row.thickness_mm,
                "prepreg_cost_per_kg": row.prepreg_cost_per_kg
            }
            for row in rows
        ]
    }



@router.put("/composites/prepregs/update/")
def update_composites_prepreg_cost(
    data: UpdatePrepregCostInput,
    db: Session = Depends(get_db)
):
    # -----------------------------------
    # Fetch matching row
    # -----------------------------------
    row = db.query(CompositesPrepregCost).filter(
        CompositesPrepregCost.material == data.material,
        CompositesPrepregCost.spec == data.spec
    ).first()

    if not row:
        raise HTTPException(
            status_code=404,
            detail=f"No prepreg found for material='{data.material}' and spec='{data.spec}'"
        )

    # -----------------------------------
    # Update fields (only if provided)
    # -----------------------------------
    if data.thickness_mm is not None:
        row.thickness_mm = data.thickness_mm

    if data.prepreg_cost_per_kg is not None:
        row.prepreg_cost_per_kg = data.prepreg_cost_per_kg

    db.commit()
    db.refresh(row)

    return {
        "message": "Prepreg cost updated successfully",
        "data": {
            "id": row.id,
            "material": row.material,
            "spec": row.spec,
            "density_kg_m3": row.density_kg_m3,
            "thickness_mm": row.thickness_mm,
            "prepreg_cost_per_kg": row.prepreg_cost_per_kg
        }
    }


@router.post("/composites/prepregs/create/")
def create_composites_prepreg_cost(
    data: CreatePrepregCostInput,
    db: Session = Depends(get_db)
):
    # -----------------------------------
    # Create new row
    # -----------------------------------
    new_row = CompositesPrepregCost(
        material=data.material,
        spec=data.spec,
        density_kg_m3=data.density_kg_m3,
        thickness_mm=data.thickness_mm,
        prepreg_cost_per_kg=data.prepreg_cost_per_kg
    )

    db.add(new_row)
    db.commit()
    db.refresh(new_row)

    return {
        "message": "Prepreg cost created successfully",
        "data": {
            "id": new_row.id,
            "material": new_row.material,
            "spec": new_row.spec,
            "density_kg_m3": new_row.density_kg_m3,
            "thickness_mm": new_row.thickness_mm,
            "prepreg_cost_per_kg": new_row.prepreg_cost_per_kg
        }
    }



@router.post("/convert-step-to-part-face-areas/")
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


#   1

# @router.post("/composites/analyze-step-with-prepreg/")
# async def analyze_step_with_prepreg(
#     file: UploadFile = File(...),
#     material_id: int = Form(...),
#     db: Session = Depends(get_db)
# ):
#     upload_dir = FilePath("uploads")
#     upload_dir.mkdir(exist_ok=True)
#     file_path = upload_dir / f"{uuid.uuid4()}_{file.filename}"
#
#     try:
#         # =================================================
#         # 1. Fetch prepreg material from DB
#         # =================================================
#         prepreg = db.query(CompositesPrepregCost).filter(
#             CompositesPrepregCost.id == material_id
#         ).first()
#
#         if not prepreg:
#             raise HTTPException(
#                 status_code=404,
#                 detail=f"Prepreg material with id={material_id} not found"
#             )
#
#         # =================================================
#         # 2. Save STEP file
#         # =================================================
#         with file_path.open("wb") as f:
#             shutil.copyfileobj(file.file, f)
#
#         # =================================================
#         # 3. Load STEP
#         # =================================================
#         solid = importers.importStep(str(file_path)).val()
#         faces = solid.Faces()
#
#         if not faces:
#             raise HTTPException(400, "No faces found in STEP file")
#
#         # =================================================
#         # PART A: THICKNESS (OLD, WORKING LOGIC) – UNCHANGED
#         # =================================================
#         clusters = defaultdict(list)
#
#         for f in faces:
#             try:
#                 n = f.normalAt()
#                 v = np.array([n.x, n.y, n.z])
#                 v /= np.linalg.norm(v)
#                 key = tuple(np.round(v, 2))
#                 clusters[key].append(f)
#             except:
#                 pass
#
#         if len(clusters) < 2:
#             raise HTTPException(400, "Unable to cluster shell faces")
#
#         cluster_list = []
#         for k, fs in clusters.items():
#             area = sum(f.Area() for f in fs)
#             cluster_list.append((k, fs, area))
#
#         cluster_list.sort(key=lambda x: x[2], reverse=True)
#
#         outer_key, outer_faces, _ = cluster_list[0]
#
#         inner_faces = None
#         for k, fs, _ in cluster_list[1:]:
#             if np.dot(np.array(k), np.array(outer_key)) < -0.9:
#                 inner_faces = fs
#                 break
#
#         if not inner_faces:
#             raise HTTPException(400, "Inner shell not detected")
#
#         n = np.array(outer_key)
#         n /= np.linalg.norm(n)
#
#         outer_proj = [
#             np.dot([f.Center().x, f.Center().y, f.Center().z], n)
#             for f in outer_faces
#         ]
#
#         inner_proj = [
#             np.dot([f.Center().x, f.Center().y, f.Center().z], n)
#             for f in inner_faces
#         ]
#
#         geometric_thickness_mm = round(abs(np.mean(outer_proj) - np.mean(inner_proj)), 3)
#
#         # =================================================
#         # PART B: SURFACE AREA (UNCHANGED)
#         # =================================================
#         bb = solid.BoundingBox()
#         part_center = np.array([
#             (bb.xmin + bb.xmax) / 2,
#             (bb.ymin + bb.ymax) / 2,
#             (bb.zmin + bb.zmax) / 2
#         ])
#
#         outer_faces_for_area = []
#
#         for f in faces:
#             try:
#                 c = f.Center()
#                 c_vec = np.array([c.x, c.y, c.z])
#
#                 n = f.normalAt()
#                 n_vec = np.array([n.x, n.y, n.z])
#                 n_vec /= np.linalg.norm(n_vec)
#
#                 if np.dot(c_vec - part_center, n_vec) > 0:
#                     outer_faces_for_area.append(f)
#             except:
#                 pass
#
#         if not outer_faces_for_area:
#             raise HTTPException(400, "Failed to detect outer skin for area")
#
#         ply_area_mm2 = sum(f.Area() for f in outer_faces_for_area)
#         ply_area_m2 = round(ply_area_mm2 / 1e6, 3)
#
#         raw_dims = [
#             round(bb.xlen, 2),
#             round(bb.ylen, 2),
#             round(bb.zlen, 2)
#         ]
#
#         # Sort: largest → length, second → width, smallest → height
#         raw_dims_sorted = sorted(raw_dims, reverse=True)
#
#         global_length = raw_dims_sorted[0]
#         global_width = raw_dims_sorted[1]
#         global_height = raw_dims_sorted[2]
#
#         # Stock dimensions
#         stock_length = global_length + 100
#         stock_width = global_width + 100
#         stock_height = global_height  # unchanged
#
#         number_of_layers = geometric_thickness_mm / prepreg.thickness_mm
#
#         total_surface_area_m2=number_of_layers*ply_area_m2
#
#         volume_of_part_m3=(geometric_thickness_mm*ply_area_m2)/1000
#
#         mass_in_kg=prepreg.density_kg_m3*volume_of_part_m3
#
#         volume_of_composite_tool_in_m3=(stock_length*stock_width*stock_height)/1000000000
#
#         master_tool = db.query(MasterToolCost).first()
#
#         if not master_tool:
#             raise HTTPException(
#                 status_code=404,
#                 detail="Master tool cost table is empty"
#             )
#
#
#         Tool_Stock_weight_Kg = (
#                 master_tool.epoxy_block_density * volume_of_composite_tool_in_m3
#         )
#
#         print(master_tool.epoxy_block_density)
#
#         analysis_row = CompositeAnalysisResult(
#             filename=file.filename,
#
#             prepreg_material_id=prepreg.id,
#             material=prepreg.material,
#             spec=prepreg.spec,
#
#             density_kg_m3=float(prepreg.density_kg_m3) if prepreg.density_kg_m3 is not None else None,
#             design_thickness_mm=float(prepreg.thickness_mm),
#             prepreg_cost_per_kg=float(prepreg.prepreg_cost_per_kg),
#
#             stock_length_mm=float(stock_length),
#             stock_width_mm=float(stock_width),
#             stock_height_mm=float(stock_height),
#
#             geometric_thickness_mm=float(geometric_thickness_mm),
#             one_ply_surface_area_m2=float(ply_area_m2),
#
#             number_of_layers=float(number_of_layers),
#             total_surface_area_m2=float(total_surface_area_m2),
#
#             volume_of_part_m3=float(volume_of_part_m3),
#             mass_in_kg=float(mass_in_kg),
#
#             volume_of_composite_tool_in_m3=float(volume_of_composite_tool_in_m3),
#             tool_stock_weight_kg=float(Tool_Stock_weight_Kg)
#         )
#
#         db.add(analysis_row)
#         db.commit()
#         db.refresh(analysis_row)
#
#         # =================================================
#         # RESPONSE
#         # =================================================
#         return {
#             "filename": file.filename,
#
#             "material": {
#                 "id": prepreg.id,
#                 "material": prepreg.material,
#                 "spec": prepreg.spec,
#                 "density_kg_m3": prepreg.density_kg_m3,
#                 "design_thickness_mm": prepreg.thickness_mm,
#                 "prepreg_cost_per_kg": prepreg.prepreg_cost_per_kg
#             },
#
#             "geometry": {
#                 "global_dimensions_mm": {
#                     "length": global_length,
#                     "width": global_width,
#                     "height": global_height
#                 },
#                 "stock_dimensions_mm": {
#                     "stock_length": stock_length,
#                     "stock_width": stock_width,
#                     "stock_height": stock_height
#                 },
#                 "geometric_thickness_mm": geometric_thickness_mm,
#                 "one_ply_surface_area_m2": ply_area_m2
#             },
#             "number_of_layers":number_of_layers,
#             "total_surface_area_m2":total_surface_area_m2,
#             "volume_of_part_m3":volume_of_part_m3,
#             "mass_in_kg":mass_in_kg,
#             "volume_of_composite_tool_in_m3":volume_of_composite_tool_in_m3,
#             "Tool_Stock_weight_Kg":Tool_Stock_weight_Kg,
#             "analysis_id": analysis_row.id
#
#         }
#
#
#
#
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))
#
#     finally:
#         file_path.unlink(missing_ok=True)



#rectified surface area


@router.post("/composites/analyze-step-with-prepreg/")
async def analyze_step_with_prepreg(
    file: UploadFile = File(...),
    material_id: int = Form(...),
    db: Session = Depends(get_db)
):
    upload_dir = FilePath("uploads")
    upload_dir.mkdir(exist_ok=True)
    file_path = upload_dir / f"{uuid.uuid4()}_{file.filename}"

    try:
        # =================================================
        # 1. Fetch prepreg material from DB
        # =================================================
        prepreg = db.query(CompositesPrepregCost).filter(
            CompositesPrepregCost.id == material_id
        ).first()

        if not prepreg:
            raise HTTPException(
                status_code=404,
                detail=f"Prepreg material with id={material_id} not found"
            )

        # =================================================
        # 2. Save file and detect type
        # =================================================
        with file_path.open("wb") as f:
            shutil.copyfileobj(file.file, f)

        # =================================================
        # 3. Load file based on type
        # =================================================
        file_extension = file.filename.lower().split('.')[-1]
        print(f"Composite Analysis - Processing file: {file.filename} (type: {file_extension})")
        
        if file_extension in ['step', 'stp']:
            # ---- STEP Processing ----
            print("Processing STEP file with CadQuery...")
            solid = importers.importStep(str(file_path)).val()
            faces = solid.Faces()

            if not faces:
                raise HTTPException(400, "No faces found in STEP file")
                
            # Get bounding box from CadQuery
            bb = solid.BoundingBox()
            raw_dims = [
                round(bb.xlen, 2),
                round(bb.ylen, 2),
                round(bb.zlen, 2)
            ]
            
        elif file_extension == 'stl':
            # ---- STL Processing ----
            print("Processing STL file with Trimesh...")
            mesh = trimesh.load(str(file_path))
            
            # Get bounding box from trimesh
            bounds = mesh.bounds
            raw_x_dim = bounds[1][0] - bounds[0][0]  # max_x - min_x
            raw_y_dim = bounds[1][1] - bounds[0][1]  # max_y - min_y  
            raw_z_dim = bounds[1][2] - bounds[0][2]  # max_z - min_z
            
            # Auto-detect if units need scaling (if max dimension < 100, likely needs scaling)
            max_raw_dim = max(raw_x_dim, raw_y_dim, raw_z_dim)
            scale_factor = 1.0
            
            print(f"STL Analysis Debug:")
            print(f"Raw dimensions: X={raw_x_dim:.3f}, Y={raw_y_dim:.3f}, Z={raw_z_dim:.3f}")
            print(f"Max raw dimension: {max_raw_dim:.3f}")
            
            if max_raw_dim < 10:  # Likely in mm, need to scale up
                scale_factor = 10.0  # Convert to proper scale
                print(f"Applying scale factor: {scale_factor} (dimensions too small)")
            elif max_raw_dim > 100000:  # Too large, might need scaling down
                scale_factor = 1.0  
                print(f"Applying scale factor: {scale_factor} (dimensions too large)")
            else:
                print(f"No scaling needed (scale factor: {scale_factor})")
                
            # Apply scaling if needed
            scaled_x_dim = raw_x_dim * scale_factor
            scaled_y_dim = raw_y_dim * scale_factor
            scaled_z_dim = raw_z_dim * scale_factor
            
            print(f"Scaled dimensions: X={scaled_x_dim:.3f}, Y={scaled_y_dim:.3f}, Z={scaled_z_dim:.3f}")
            
            raw_dims = [
                round(scaled_x_dim, 2),
                round(scaled_y_dim, 2),
                round(scaled_z_dim, 2)
            ]
            
            # For STL files, we need to create a simple solid-like object for face processing
            # Since trimesh doesn't have the same face structure as CadQuery, we'll use the mesh vertices
            # to simulate face processing for thickness calculation
            faces = []  # We'll handle this differently for STL
            
        else:
            raise HTTPException(status_code=400, detail="Only STEP, STP, and STL files are supported")

        # =================================================
        # PART A: THICKNESS CALCULATION - ADAPTED FOR STL
        # =================================================
        
        if file_extension in ['step', 'stp']:
            # ---- STEP Face-based Thickness Calculation ----
            clusters = defaultdict(list)

            for f in faces:
                try:
                    n = f.normalAt()
                    v = np.array([n.x, n.y, n.z])
                    v /= np.linalg.norm(v)
                    key = tuple(np.round(v, 2))
                    clusters[key].append(f)
                except:
                    pass

            if len(clusters) < 2:
                raise HTTPException(400, "Unable to cluster shell faces")

            cluster_list = []
            for k, fs in clusters.items():
                area = sum(f.Area() for f in fs)
                cluster_list.append((k, fs, area))

            cluster_list.sort(key=lambda x: x[2], reverse=True)

            outer_key, outer_faces, _ = cluster_list[0]

            inner_faces = None
            for k, fs, _ in cluster_list[1:]:
                if np.dot(np.array(k), np.array(outer_key)) < -0.9:
                    inner_faces = fs
                    break

            if not inner_faces:
                raise HTTPException(400, "Inner shell not detected")

            n = np.array(outer_key)
            n /= np.linalg.norm(n)

            outer_proj = [
                np.dot([f.Center().x, f.Center().y, f.Center().z], n)
                for f in outer_faces
            ]

            inner_proj = [
                np.dot([f.Center().x, f.Center().y, f.Center().z], n)
                for f in inner_faces
            ]

            geometric_thickness_mm = round(abs(np.mean(outer_proj) - np.mean(inner_proj)), 3)
            
        elif file_extension == 'stl':
            # ---- STL Mesh-based Thickness Calculation ----
            print("Calculating thickness from STL mesh...")
            
            # For STL files, we'll use a simplified approach based on mesh properties
            # Calculate thickness as the difference between max and min Z coordinates
            # This is a simplified approach suitable for most composite parts
            
            # Get mesh face normals and Z coordinates
            face_normals = mesh.face_normals
            vertices = mesh.vertices
            normals = mesh.vertex_normals

            samples = min(200, len(vertices))
            thickness_values = []
            
            indices = np.linspace(0, len(vertices) - 1, samples, dtype=int)
            for i in indices:
                origin = vertices[i]
                direction = -normals[i]

                locations, index_ray, index_tri = mesh.ray.intersects_location(
                    ray_origins=[origin],
                    ray_directions=[direction]
                )

                if len(locations) > 0:
                    dist = np.linalg.norm(locations[0] - origin)
                    if dist > 0:
                        thickness_values.append(dist)

            if not thickness_values:
                raise Exception("Unable to compute thickness from STL")

            geometric_thickness_mm = round(np.median(thickness_values), 3)

            print(f"STL thickness (ray-based): {geometric_thickness_mm}")
            
            # Find the dominant direction (most common normal orientation)
            # This helps us identify the "thickness" direction
            
        
            
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type for thickness calculation")

        # =================================================
        # PART B: SURFACE AREA CALCULATION - ADAPTED FOR STL
        # =================================================
        
        if file_extension in ['step', 'stp']:
            # ---- STEP Face-based Surface Area Calculation ----
            bb = solid.BoundingBox()

            shape = importers.importStep(str(file_path)).val()
            solids = shape.Solids()

            if not solids:
                raise HTTPException(400, "No solids found in STEP file")

            first_part = solids[0]
            faces = first_part.Faces()

            face_centers = []
            face_data = []

            for face in faces:
                area_mm2 = face.Area()
                c = face.Center()
                center = np.array([c.x, c.y, c.z])

                n = face.normalAt()
                normal = np.array([n.x, n.y, n.z])
                normal /= np.linalg.norm(normal)

                face_centers.append(center)
                face_data.append((center, normal, area_mm2))

            part_center = np.mean(face_centers, axis=0)

            inner_area_mm2 = 0.0

            for center, normal, area in face_data:
                if np.dot(normal, center - part_center) < 0:
                    inner_area_mm2 += area

            ply_area_m2 = round(inner_area_mm2 / 1e6, 3)
            
        elif file_extension == 'stl':
            # ---- STL Mesh-based Surface Area Calculation ----
            print("Calculating surface area from STL mesh...")
            
            # For STL files, use the mesh area directly
            # Calculate total surface area and estimate inner surface area
            total_area_mm2 = mesh.area  # Total surface area in mm²
            
            # For composite parts, we typically use about 50% of total area as inner surface area
            # This is a reasonable approximation for hollow/thin-walled parts
            triangles = mesh.triangles
            normals = mesh.face_normals
            areas = mesh.area_faces

            centroids = triangles.mean(axis=1)
            part_center = centroids.mean(axis=0)

            inner_area_mm2 = 0.0
            for i in range(len(triangles)):
                center = centroids[i]
                normal = normals[i]
                area = areas[i]

    # same logic as STEP
                direction = center - part_center
                direction = direction / np.linalg.norm(direction)

                dot_val = np.dot(normal, direction)
                if dot_val < -0.19:
                    inner_area_mm2 += area

            ply_area_m2 = round(inner_area_mm2 / 1e6, 3)

            print(f"STL inner surface area: {ply_area_m2} m²")

            
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type for surface area calculation")

        # Use the raw_dims that were already calculated above
        # Sort: largest → length, second → width, smallest → height
        raw_dims_sorted = sorted(raw_dims, reverse=True)

        global_length = raw_dims_sorted[0]
        global_width = raw_dims_sorted[1]
        global_height = raw_dims_sorted[2]

        # Stock dimensions
        stock_length = global_length + 100
        stock_width = global_width + 100
        stock_height = global_height  # unchanged

        number_of_layers = geometric_thickness_mm / prepreg.thickness_mm

        total_surface_area_m2=number_of_layers*ply_area_m2

        volume_of_part_m3=(geometric_thickness_mm*ply_area_m2)/1000

        mass_in_kg=prepreg.density_kg_m3*volume_of_part_m3

        volume_of_composite_tool_in_m3=(stock_length*stock_width*stock_height)/1000000000

        # Debug prints for verification
        print(f"=== Composite Analysis Results ===")
        print(f"File type: {file_extension}")
        print(f"Global dimensions: L={global_length:.2f}, W={global_width:.2f}, H={global_height:.2f} mm")
        print(f"Geometric thickness: {geometric_thickness_mm:.3f} mm")
        print(f"Ply area: {ply_area_m2:.3f} m²")
        print(f"Number of layers: {number_of_layers:.1f}")
        print(f"Total surface area: {total_surface_area_m2:.3f} m²")
        print(f"Part volume: {volume_of_part_m3:.6f} m³")
        print(f"Part mass: {mass_in_kg:.3f} kg")
        print(f"Stock volume: {volume_of_composite_tool_in_m3:.6f} m³")
        print("=" * 35)

        master_tool = db.query(MasterToolCost).first()

        if not master_tool:
            raise HTTPException(
                status_code=404,
                detail="Master tool cost table is empty"
            )


        Tool_Stock_weight_Kg = (
                master_tool.epoxy_block_density * volume_of_composite_tool_in_m3
        )

        print(master_tool.epoxy_block_density)

        analysis_row = CompositeAnalysisResult(
            filename=file.filename,

            prepreg_material_id=prepreg.id,
            material=prepreg.material,
            spec=prepreg.spec,

            density_kg_m3=float(prepreg.density_kg_m3) if prepreg.density_kg_m3 is not None else None,
            design_thickness_mm=float(prepreg.thickness_mm),
            prepreg_cost_per_kg=float(prepreg.prepreg_cost_per_kg),

            stock_length_mm=float(stock_length),
            stock_width_mm=float(stock_width),
            stock_height_mm=float(stock_height),

            geometric_thickness_mm=float(geometric_thickness_mm),
            one_ply_surface_area_m2=float(ply_area_m2),

            number_of_layers=float(number_of_layers),
            total_surface_area_m2=float(total_surface_area_m2),

            volume_of_part_m3=float(volume_of_part_m3),
            mass_in_kg=float(mass_in_kg),

            volume_of_composite_tool_in_m3=float(volume_of_composite_tool_in_m3),
            tool_stock_weight_kg=float(Tool_Stock_weight_Kg)
        )

        db.add(analysis_row)
        db.commit()
        db.refresh(analysis_row)

        # =================================================
        # RESPONSE
        # =================================================
        return {
            "filename": file.filename,

            "material": {
                "id": prepreg.id,
                "material": prepreg.material,
                "spec": prepreg.spec,
                "density_kg_m3": prepreg.density_kg_m3,
                "design_thickness_mm": prepreg.thickness_mm,
                "prepreg_cost_per_kg": prepreg.prepreg_cost_per_kg
            },

            "geometry": {
                "global_dimensions_mm": {
                    "length": global_length,
                    "width": global_width,
                    "height": global_height
                },
                "stock_dimensions_mm": {
                    "stock_length": stock_length,
                    "stock_width": stock_width,
                    "stock_height": stock_height
                },
                "geometric_thickness_mm": geometric_thickness_mm,
                "one_ply_surface_area_m2": ply_area_m2
            },
            "number_of_layers":number_of_layers,
            "total_surface_area_m2":total_surface_area_m2,
            "volume_of_part_m3":volume_of_part_m3,
            "mass_in_kg":mass_in_kg,
            "volume_of_composite_tool_in_m3":volume_of_composite_tool_in_m3,
            "Tool_Stock_weight_Kg":Tool_Stock_weight_Kg,
            "analysis_id": analysis_row.id

        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    finally:
        file_path.unlink(missing_ok=True)




#  2


@router.get("/composites/analysis/{analysis_id}/master-tool-hours/")
def get_master_tool_hours_by_analysis_id(
    analysis_id: int,
    db: Session = Depends(get_db)
):
    # =================================================
    # 1. Fetch analysis result
    # =================================================
    analysis = db.query(CompositeAnalysisResult).filter(
        CompositeAnalysisResult.id == analysis_id
    ).first()

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail=f"Analysis result with id={analysis_id} not found"
        )

    tool_volume = analysis.volume_of_composite_tool_in_m3

    # =================================================
    # 2. Fetch all master tool hour rows
    # =================================================
    rows = db.query(MasterToolHourTable).all()

    if not rows:
        raise HTTPException(
            status_code=404,
            detail="Master tool hour table is empty"
        )

    # =================================================
    # 3. Match volume with range
    # =================================================
    matched_row = None

    for row in rows:
        try:
            low, high = map(float, row.volume_range_m3.split("-"))
            if low <= tool_volume <= high:
                matched_row = row
                break
        except ValueError:
            continue

    if not matched_row:
        raise HTTPException(
            status_code=400,
            detail=f"No matching volume range found for volume {tool_volume:.3f} m3"
        )

    master_tool = db.query(MasterToolCost).first()

    if not master_tool:
        raise HTTPException(
            status_code=404,
            detail="Master tool cost table is empty"
        )

    Design_cost=master_tool.design_cost_per_hr*matched_row.design_hours

    frame_fabrication_cost=analysis.volume_of_composite_tool_in_m3*master_tool.frame_fabrication_cost

    EPOXY_BLOCK_Bonding_cost=(analysis.volume_of_composite_tool_in_m3*master_tool.epoxy_block_material_cost)+master_tool.epoxy_block_bonding_cost

    Machining_cost = master_tool.machining_cost_per_hr * matched_row.machining_hours

    Assembly_cost=master_tool.assembly_cost_per_hr*matched_row.assembly_hours

    finishing_cost=master_tool.finishing_cost_per_hr*matched_row.finishing_hours

    Inspection_cost=master_tool.inspection_cost_per_hr*matched_row.inspection_hours

    correction_row = db.query(CompositeCorrectionFactor1).first()

    if not correction_row:
        raise HTTPException(
            status_code=404,
            detail="Correction factor not found"
        )

    correction_factor = correction_row.correction

    Total_master_model_cost=(Design_cost+frame_fabrication_cost+EPOXY_BLOCK_Bonding_cost+Machining_cost+Assembly_cost+finishing_cost+Inspection_cost)*correction_factor

    existing = db.query(CompositeMasterModelCost).filter(
        CompositeMasterModelCost.analysis_id == analysis_id
    ).first()

    if not existing:
        master_model_record = CompositeMasterModelCost(
            analysis_id=analysis_id,

            # Hours
            design_hours=matched_row.design_hours,
            machining_hours=matched_row.machining_hours,
            assembly_hours=matched_row.assembly_hours,
            finishing_hours=matched_row.finishing_hours,
            inspection_hours=matched_row.inspection_hours,

            # Costs
            design_cost=Design_cost,
            frame_fabrication_cost=frame_fabrication_cost,
            epoxy_block_bonding_cost=EPOXY_BLOCK_Bonding_cost,
            machining_cost=Machining_cost,
            assembly_cost=Assembly_cost,
            finishing_cost=finishing_cost,
            inspection_cost=Inspection_cost,

            total_master_model_cost=Total_master_model_cost
        )

        db.add(master_model_record)
        db.commit()
        db.refresh(master_model_record)




    # =================================================
    # 4. Return matched hours
    # =================================================
    return {
        "analysis_id": analysis_id,
        "volume_of_composite_tool_in_m3": tool_volume,
        "matched_volume_range_m3": matched_row.volume_range_m3,
        "hours": {
            "design_hours": matched_row.design_hours,
            "machining_hours": matched_row.machining_hours,
            "assembly_hours": matched_row.assembly_hours,
            "finishing_hours": matched_row.finishing_hours,
            "inspection_hours": matched_row.inspection_hours
        },
        "Design_cost":Design_cost,
        "frame_fabrication_cost":frame_fabrication_cost,
        "EPOXY_BLOCK_Bonding_cost":EPOXY_BLOCK_Bonding_cost,
        "Machining_cost":Machining_cost,
        "Assembly_cost":Assembly_cost,
        "finishing_cost":finishing_cost,
        "Inspection_cost":Inspection_cost,
        "Total_master_model_cost":Total_master_model_cost


    }




#  3


@router.get("/composites/analysis/{analysis_id}/details/")
def get_composite_analysis_details(
    analysis_id: int,
    db: Session = Depends(get_db)
):
    # =================================================
    # Fetch analysis result
    # =================================================
    analysis = db.query(CompositeAnalysisResult).filter(
        CompositeAnalysisResult.id == analysis_id
    ).first()

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail=f"Composite analysis result with id={analysis_id} not found"
        )
    part_tool_cost = db.query(CompositesPartToolCost).first()

    if not part_tool_cost:
        raise HTTPException(
            status_code=404,
            detail="Composites part tool cost table is empty"
        )



    Increased_thickness_tool=part_tool_cost.added_thickness_mm + analysis.geometric_thickness_mm
    print("Increased_thickness_tool",Increased_thickness_tool)
    print('analysis.design_thickness_mm',analysis.design_thickness_mm)
    print("analysis.one_ply_surface_area_m2",analysis.one_ply_surface_area_m2)

    Total_surface_area=(Increased_thickness_tool/analysis.design_thickness_mm)*analysis.one_ply_surface_area_m2
    print(Total_surface_area)
    print(part_tool_cost.Percentage_of_surface_area_to_be_increased)
    Increased_surface_area=Total_surface_area*((100+part_tool_cost.Percentage_of_surface_area_to_be_increased)/100)

    COST_DRYCARBON_FABRIC=Increased_surface_area*part_tool_cost.COST_OF_DRY_CARBON_FABRIC

    layup_rows = db.query(PartToolLayupHourTable).all()

    if not layup_rows:
        raise HTTPException(
            status_code=404,
            detail="Part tool layup hour table is empty"
        )

    matched_layup_row = None

    for row in layup_rows:
        try:
            low, high = map(float, row.surface_area_range.split("-"))
            if low <= Increased_surface_area <= high:
                matched_layup_row = row
                break
        except ValueError:
            continue

    if not matched_layup_row:
        raise HTTPException(
            status_code=400,
            detail=f"No matching surface area range found for {Increased_surface_area:.2f} m2"
        )

    number_of_manhrs=matched_layup_row.layup_man_hours
    layup_cost=number_of_manhrs*part_tool_cost.LAYUP_COST

    volume_rows = db.query(PartToolHourTable).all()

    if not volume_rows:
        raise HTTPException(
            status_code=404,
            detail="Part tool hour table is empty"
        )

    matched_volume_row = None
    tool_volume = analysis.volume_of_composite_tool_in_m3

    for row in volume_rows:
        try:
            low, high = map(float, row.volume_range_m3.split("-"))
            if low <= tool_volume <= high:
                matched_volume_row = row
                break
        except ValueError:
            continue

    if not matched_volume_row:
        raise HTTPException(
            status_code=400,
            detail=f"No matching volume range found for tool volume {tool_volume:.3f} m3"
        )

    curing_hours = matched_volume_row.curing_hours
    trimming_inspection_hours = matched_volume_row.trimming_inspection_hours


    oven_curing_cost=curing_hours*part_tool_cost.OVEN_CURING_COST

    Lt_inspection_cost=part_tool_cost.Number_of_Inspection_time*part_tool_cost.LT_INSPECTION_COST

    Trimming_inspection=trimming_inspection_hours*part_tool_cost.TRIMMING_INSPECTION

    cost_fabrication_CFC_tubes=Total_surface_area*part_tool_cost.COST_FOR_FABRICATION_CFC_TUBES

    cost_bonding_reviting=Total_surface_area*part_tool_cost.COST_FOR_BONDING_AND_RIVETING

    correction_row = db.query(CompositeCorrectionFactor2).first()

    if not correction_row:
        raise HTTPException(
            status_code=404,
            detail="Correction factor not found"
        )

    correction_factor = correction_row.correction

    Total_tool_cost=(COST_DRYCARBON_FABRIC+layup_cost+oven_curing_cost+Lt_inspection_cost+Trimming_inspection+cost_fabrication_CFC_tubes+cost_bonding_reviting)*correction_factor

    existing_tool_cost = db.query(CompositeToolCost).filter(
        CompositeToolCost.analysis_id == analysis_id
    ).first()

    if not existing_tool_cost:
        tool_cost_record = CompositeToolCost(
            analysis_id=analysis_id,

            increased_thickness_tool_mm=Increased_thickness_tool,
            total_surface_area_m2=Total_surface_area,
            increased_surface_area_m2=Increased_surface_area,

            cost_dry_carbon_fabric=COST_DRYCARBON_FABRIC,

            layup_man_hours=number_of_manhrs,
            layup_cost=layup_cost,

            curing_hours=curing_hours,
            oven_curing_cost=oven_curing_cost,

            lt_inspection_hours=part_tool_cost.Number_of_Inspection_time,
            lt_inspection_cost=Lt_inspection_cost,

            trimming_inspection_hours=trimming_inspection_hours,
            trimming_inspection_cost=Trimming_inspection,

            cost_fabrication_cfc_tubes=cost_fabrication_CFC_tubes,
            cost_bonding_riveting=cost_bonding_reviting,

            total_tool_cost=Total_tool_cost
        )

        db.add(tool_cost_record)
        db.commit()
        db.refresh(tool_cost_record)


    # =================================================
    # Return all table fields
    # =================================================
    return {
        "id": analysis.id,

        # -------------------------
        # File & Material Info
        # -------------------------
        "filename": analysis.filename,
        "prepreg_material_id": analysis.prepreg_material_id,
        "material": analysis.material,
        "spec": analysis.spec,
        "density_kg_m3": analysis.density_kg_m3,
        "design_thickness_mm": analysis.design_thickness_mm,
        "prepreg_cost_per_kg": analysis.prepreg_cost_per_kg,

        # -------------------------
        # Stock Geometry
        # -------------------------
        "stock_length_mm": analysis.stock_length_mm,
        "stock_width_mm": analysis.stock_width_mm,
        "stock_height_mm": analysis.stock_height_mm,
        "geometric_thickness_mm": analysis.geometric_thickness_mm,
        "one_ply_surface_area_m2": analysis.one_ply_surface_area_m2,

        # -------------------------
        # Laminate Calculations
        # -------------------------
        "number_of_layers": analysis.number_of_layers,
        "total_surface_area_m2": analysis.total_surface_area_m2,
        "volume_of_part_m3": analysis.volume_of_part_m3,
        "mass_in_kg": analysis.mass_in_kg,

        # -------------------------
        # Tooling Calculations
        # -------------------------
        "volume_of_composite_tool_in_m3": analysis.volume_of_composite_tool_in_m3,
        "tool_stock_weight_kg": analysis.tool_stock_weight_kg,


        "Increased_thickness_tool":Increased_thickness_tool,
        "Total_surface_area":Total_surface_area,
        "Increased_surface_area":Increased_surface_area,
        "COST_DRYCARBON_FABRIC":COST_DRYCARBON_FABRIC,

        "matched_surface_area_range": matched_layup_row.surface_area_range,

        "number_of_manhrs":number_of_manhrs,
        "layup_cost":layup_cost,

        "curing_hours":curing_hours,
        "oven_curing_cost":oven_curing_cost,

        "Lt_inspection_hrs":part_tool_cost.Number_of_Inspection_time,
        "Lt_inspection_cost":Lt_inspection_cost,

        "trimming_inspection_hours":trimming_inspection_hours,
        "Trimming_inspection_cost":Trimming_inspection,

        "cost_fabrication_CFC_tubes":cost_fabrication_CFC_tubes,
        "cost_bonding_reviting":cost_bonding_reviting,
        "Total_tool_cost":Total_tool_cost



    }




#   4


@router.get("/composites/analysis/{analysis_id}/raw/")
def get_composite_analysis_raw_details(
    analysis_id: int,
    db: Session = Depends(get_db)
):
    # =================================================
    # Fetch analysis result
    # =================================================
    analysis = db.query(CompositeAnalysisResult).filter(
        CompositeAnalysisResult.id == analysis_id
    ).first()

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail=f"Composite analysis result with id={analysis_id} not found"
        )

    part_fabrication_cost = db.query(CompositesPartFabricationCost).first()

    if not part_fabrication_cost:
        raise HTTPException(
            status_code=404,
            detail="part_fabrication_cost table is empty"
        )

    fabrication_layup_rows = db.query(PartFabricationLayupHourTable).all()

    if not fabrication_layup_rows:
        raise HTTPException(
            status_code=404,
            detail="Part fabrication layup hour table is empty"
        )

    matched_fabrication_layup_row = None
    part_surface_area = analysis.total_surface_area_m2

    for row in fabrication_layup_rows:
        try:
            low, high = map(float, row.surface_area_range.split("-"))
            if low <= part_surface_area <= high:
                matched_fabrication_layup_row = row
                break
        except ValueError:
            continue

    if not matched_fabrication_layup_row:
        raise HTTPException(
            status_code=400,
            detail=f"No matching fabrication layup range found for surface area {part_surface_area:.2f} m2"
        )

    part_layup_man_hours = matched_fabrication_layup_row.layup_man_hours



    Extra_composite_part=analysis.mass_in_kg*((100+part_fabrication_cost.extra_prepreg_weight_percent)/100)

    preprag_cost=Extra_composite_part*analysis.prepreg_cost_per_kg

    part_layup_cost=part_layup_man_hours * part_fabrication_cost.layup_cost_per_hr

    consumable_cost=(preprag_cost*part_fabrication_cost.consumable_cost_percent)/100

    fabrication_hour_rows = db.query(PartFabricationHourTable).all()

    if not fabrication_hour_rows:
        raise HTTPException(
            status_code=404,
            detail="Part fabrication hour table is empty"
        )

    matched_fabrication_hour_row = None
    part_volume = analysis.volume_of_composite_tool_in_m3

    for row in fabrication_hour_rows:
        try:
            low, high = map(float, row.volume_range_m3.split("-"))
            if low <= part_volume <= high:
                matched_fabrication_hour_row = row
                break
        except ValueError:
            continue

    if not matched_fabrication_hour_row:
        raise HTTPException(
            status_code=400,
            detail=f"No matching fabrication volume range found for volume {part_volume:.3f} m3"
        )

    correction_row = db.query(CompositeCorrectionFactor3).first()

    if not correction_row:
        raise HTTPException(
            status_code=404,
            detail="Correction factor not found"
        )

    correction_factor = correction_row.correction

    # Extract hours
    curing_hours = matched_fabrication_hour_row.curing_hours
    trimming_inspection_hours = matched_fabrication_hour_row.trimming_inspection_hours
    ndts_hours = matched_fabrication_hour_row.ndts_hours


    autoclave_curing_cost=curing_hours*part_fabrication_cost.autoclave_curing_cost_per_hr
    trimming_inspection_cost=trimming_inspection_hours*part_fabrication_cost.trimming_inspection_cost_per_hr
    NDT_cost=ndts_hours*part_fabrication_cost.ndts_cost_per_hr

    Total_part_cost=(preprag_cost+part_layup_cost+consumable_cost+autoclave_curing_cost+trimming_inspection_cost+NDT_cost)*correction_factor

    tool_cost_row = db.query(CompositeToolCost).filter(
        CompositeToolCost.analysis_id == analysis_id
    ).first()

    if not tool_cost_row:
        raise HTTPException(
            status_code=404,
            detail="Tool cost not found for this analysis_id. Please calculate & store tool cost first."
        )

    total_tool_cost = tool_cost_row.total_tool_cost

    Total_tool_and_part_cost=Total_part_cost+total_tool_cost

    import_and_export_cost=Total_tool_and_part_cost*0.05

    contigency_cost=Total_tool_and_part_cost*0.1

    GST=Total_tool_and_part_cost*0.18

    

    Total_cost=(Total_tool_and_part_cost+import_and_export_cost+contigency_cost+GST)

    existing_final_cost = db.query(CompositePartToolFinalCost).filter(
        CompositePartToolFinalCost.analysis_id == analysis_id
    ).first()

    if not existing_final_cost:
        final_cost_record = CompositePartToolFinalCost(
            analysis_id=analysis_id,

            # -------------------------
            # PART COST DETAILS
            # -------------------------
            extra_composite_part_kg=Extra_composite_part,
            prepreg_cost=preprag_cost,

            part_layup_man_hours=part_layup_man_hours,
            part_layup_cost=part_layup_cost,

            consumable_cost=consumable_cost,

            autoclave_curing_cost=autoclave_curing_cost,
            trimming_inspection_cost=trimming_inspection_cost,
            ndt_cost=NDT_cost,

            total_part_cost=Total_part_cost,

            # -------------------------
            # TOOL COST (already stored)
            # -------------------------
            total_tool_cost=total_tool_cost,

            # -------------------------
            # ADDERS
            # -------------------------
            import_and_export_cost=import_and_export_cost,
            contingency_cost=contigency_cost,
            gst_cost=GST,

            # -------------------------
            # FINAL
            # -------------------------
            total_cost=Total_cost,
            total_cost_per_unit=Total_cost,
            quantity=1
        )

        db.add(final_cost_record)
        db.commit()
        db.refresh(final_cost_record)







    # =================================================
    # Return raw stored values only
    # =================================================
    return {
        "id": analysis.id,

        # -------------------------
        # File & Material Info
        # -------------------------
        "filename": analysis.filename,
        "prepreg_material_id": analysis.prepreg_material_id,
        "material": analysis.material,
        "spec": analysis.spec,
        "density_kg_m3": analysis.density_kg_m3,
        "design_thickness_mm": analysis.design_thickness_mm,
        "prepreg_cost_per_kg": analysis.prepreg_cost_per_kg,

        # -------------------------
        # Stock Geometry
        # -------------------------
        "stock_length_mm": analysis.stock_length_mm,
        "stock_width_mm": analysis.stock_width_mm,
        "stock_height_mm": analysis.stock_height_mm,
        "geometric_thickness_mm": analysis.geometric_thickness_mm,
        "one_ply_surface_area_m2": analysis.one_ply_surface_area_m2,

        # -------------------------
        # Laminate Calculations
        # -------------------------
        "number_of_layers": analysis.number_of_layers,
        "total_surface_area_m2": analysis.total_surface_area_m2,
        "volume_of_part_m3": analysis.volume_of_part_m3,
        "mass_in_kg": analysis.mass_in_kg,

        # -------------------------
        # Tooling Calculations
        # -------------------------
        "volume_of_composite_tool_in_m3": analysis.volume_of_composite_tool_in_m3,
        "tool_stock_weight_kg": analysis.tool_stock_weight_kg,

        # -------------------------
        # Metadata
        # -------------------------


        "Extra_composite_part":Extra_composite_part,
        "preprag_cost":preprag_cost,
        "part_layup_man_hours":part_layup_man_hours,
        "part_layup_cost":part_layup_cost,
        "consumable_cost":consumable_cost,
        "autoclave_curing_cost":autoclave_curing_cost,
        "trimming_inspection_cost":trimming_inspection_cost,
        "NDT_cost":NDT_cost,
        'Total_part_cost':Total_part_cost,
        "Total_tool_and_part_cost":Total_tool_and_part_cost,
        "import_and_export_cost":import_and_export_cost,
        "contigency_cost":contigency_cost,
        "GST":GST,
        "Total_cost":Total_cost,
        "total_cost_per_unit":Total_cost,
        "quantity":1,


        "created_at": analysis.created_at
    }




@router.get("/composites/master-tool-cost/")
def get_master_tool_cost(db: Session = Depends(get_db)):
    rows = db.query(MasterToolCost).all()

    if not rows:
        raise HTTPException(
            status_code=404,
            detail="No master tool cost data found"
        )

    return {
        "count": len(rows),
        "data": [
            {
                "id": row.id,
                "epoxy_block_material_cost": row.epoxy_block_material_cost,
                "epoxy_block_density": row.epoxy_block_density,
                "epoxy_block_bonding_cost": row.epoxy_block_bonding_cost,
                "design_cost_per_hr": row.design_cost_per_hr,
                "machining_cost_per_hr": row.machining_cost_per_hr,
                "assembly_cost_per_hr": row.assembly_cost_per_hr,
                "finishing_cost_per_hr": row.finishing_cost_per_hr,
                "inspection_cost_per_hr": row.inspection_cost_per_hr,
                "frame_fabrication_cost": row.frame_fabrication_cost,
            }
            for row in rows
        ]
    }



@router.put("/composites/master-tool-cost/")
def update_master_tool_cost(
    data: MasterToolCostUpdate,
    db: Session = Depends(get_db)
):
    # -----------------------------------
    # Fetch the only row
    # -----------------------------------
    row = db.query(MasterToolCost).first()

    if not row:
        # Optional: create row if not exists
        row = MasterToolCost(**data.dict())
        db.add(row)
    else:
        # Update existing row
        for key, value in data.dict().items():
            setattr(row, key, value)

    db.commit()
    db.refresh(row)

    return {
        "message": "Master tool cost updated successfully",
        "data": {
            "id": row.id,
            **data.dict()
        }
    }




@router.get("/composites/part-tool-cost/")
def get_composites_part_tool_cost(db: Session = Depends(get_db)):
    rows = db.query(CompositesPartToolCost).all()

    if not rows:
        raise HTTPException(
            status_code=404,
            detail="No composites part tool cost data found"
        )

    return {
        "count": len(rows),
        "data": [
            {
                "id": row.id,
                "added_thickness_mm": row.added_thickness_mm,
                "Percentage_of_surface_area_to_be_increased": row.Percentage_of_surface_area_to_be_increased,

                "COST_OF_DRY_CARBON_FABRIC": row.COST_OF_DRY_CARBON_FABRIC,
                "LAYUP_COST": row.LAYUP_COST,
                "OVEN_CURING_COST": row.OVEN_CURING_COST,

                "LT_INSPECTION_COST": row.LT_INSPECTION_COST,
                "Number_of_Inspection_time": row.Number_of_Inspection_time,
                "TRIMMING_INSPECTION": row.TRIMMING_INSPECTION,

                "COST_FOR_FABRICATION_CFC_TUBES": row.COST_FOR_FABRICATION_CFC_TUBES,
                "COST_FOR_BONDING_AND_RIVETING": row.COST_FOR_BONDING_AND_RIVETING
            }
            for row in rows
        ]
    }



@router.put("/composites/part-tool-cost/")
def update_composites_part_tool_cost(
    data: CompositesPartToolCostUpdate,
    db: Session = Depends(get_db)
):
    # ---------------------------------------
    # Fetch the single master row
    # ---------------------------------------
    row = db.query(CompositesPartToolCost).first()

    if not row:
        # Create row if it doesn't exist
        row = CompositesPartToolCost(**data.dict())
        db.add(row)
    else:
        # Update existing row
        for key, value in data.dict().items():
            setattr(row, key, value)

    db.commit()
    db.refresh(row)

    return {
        "message": "Composites part tool cost updated successfully",
        "data": {
            "id": row.id,
            **data.dict()
        }
    }


@router.get("/composites/part-fabrication-cost/")
def get_composites_part_fabrication_cost(
    db: Session = Depends(get_db)
):
    rows = db.query(CompositesPartFabricationCost).all()

    if not rows:
        raise HTTPException(
            status_code=404,
            detail="No composites part fabrication cost data found"
        )

    return {
        "count": len(rows),
        "data": [
            {
                "id": row.id,
                "extra_prepreg_weight_percent": row.extra_prepreg_weight_percent,
                "consumable_cost_percent": row.consumable_cost_percent,

                "layup_cost_per_hr": row.layup_cost_per_hr,
                "autoclave_curing_cost_per_hr": row.autoclave_curing_cost_per_hr,
                "trimming_inspection_cost_per_hr": row.trimming_inspection_cost_per_hr,
                "ndts_cost_per_hr": row.ndts_cost_per_hr
            }
            for row in rows
        ]
    }



@router.put("/composites/part-fabrication-cost/")
def update_composites_part_fabrication_cost(
    data: CompositesPartFabricationCostUpdate,
    db: Session = Depends(get_db)
):
    # ---------------------------------------
    # Fetch the single master row
    # ---------------------------------------
    row = db.query(CompositesPartFabricationCost).first()

    if not row:
        # Create row if it doesn't exist
        row = CompositesPartFabricationCost(**data.dict())
        db.add(row)
    else:
        # Update existing row
        for key, value in data.dict().items():
            setattr(row, key, value)

    db.commit()
    db.refresh(row)

    return {
        "message": "Composites part fabrication cost updated successfully",
        "data": {
            "id": row.id,
            **data.dict()
        }
    }


@router.get("/composites/master-tool-hours/")
def get_master_tool_hours(
    db: Session = Depends(get_db)
):
    rows = db.query(MasterToolHourTable).all()

    if not rows:
        raise HTTPException(
            status_code=404,
            detail="No master tool hour data found"
        )

    return {
        "count": len(rows),
        "data": [
            {
                "id": row.id,
                "volume_range_m3": row.volume_range_m3,
                "design_hours": row.design_hours,
                "machining_hours": row.machining_hours,
                "assembly_hours": row.assembly_hours,
                "finishing_hours": row.finishing_hours,
                "inspection_hours": row.inspection_hours
            }
            for row in rows
        ]
    }


@router.put("/composites/master-tool-hours/update-range")
def update_master_tool_hours_with_range_change(
    data: MasterToolHourUpdateRange,
    db: Session = Depends(get_db)
):
    # ---------------------------------------
    # 1. Fetch row using OLD range
    # ---------------------------------------
    row = db.query(MasterToolHourTable).filter(
        MasterToolHourTable.volume_range_m3 == data.old_volume_range_m3
    ).first()

    if not row:
        raise HTTPException(
            status_code=404,
            detail=f"No row found for volume range '{data.old_volume_range_m3}'"
        )

    # ---------------------------------------
    # 2. Validate volume range format
    # ---------------------------------------
    import re
    # Allowed patterns: 4-10, 2-4, 0-2 (numbers can vary but must be range format)
    range_pattern = r'^\d+-\d+$'
    if not re.match(range_pattern, data.new_volume_range_m3.strip()):
        raise HTTPException(
            status_code=400,
            detail="Invalid volume_range_m3 format. Must be in format: '4-10', '2-4', '0-2' (numbers can vary but must be range format)"
        )

    # ---------------------------------------
    # 3. Check for overlapping or conflicting ranges
    # ---------------------------------------
    if data.old_volume_range_m3 != data.new_volume_range_m3:
        existing_rows = db.query(MasterToolHourTable).filter(
            MasterToolHourTable.volume_range_m3 != data.old_volume_range_m3  # Exclude current record
        ).all()

        new_range = data.new_volume_range_m3.strip()
        
        for existing in existing_rows:
            existing_range = existing.volume_range_m3.strip()
            
            # Exact match check
            if new_range == existing_range:
                raise HTTPException(
                    status_code=400,
                    detail=f"Volume range '{new_range}' already exists"
                )
            
            # Overlap check for range formats (e.g., "2-4" vs "3-5")
            if '-' in new_range and '-' in existing_range:
                try:
                    new_start, new_end = map(float, new_range.split('-'))
                    existing_start, existing_end = map(float, existing_range.split('-'))
                    
                    # Check if ranges overlap
                    if not (new_end < existing_start or new_start > existing_end):
                        raise HTTPException(
                            status_code=400,
                            detail=f"Volume range '{new_range}' overlaps with existing range '{existing_range}'"
                        )
                except ValueError:
                    continue

    # ---------------------------------------
    # 4. Prevent duplicate ranges (additional check)
    # ---------------------------------------
    if data.old_volume_range_m3 != data.new_volume_range_m3:
        existing = db.query(MasterToolHourTable).filter(
            MasterToolHourTable.volume_range_m3 == data.new_volume_range_m3
        ).first()

        if existing:
            raise HTTPException(
                status_code=400,
                detail=f"Volume range '{data.new_volume_range_m3}' already exists"
            )

    # ---------------------------------------
    # 5. Update values
    # ---------------------------------------
    row.volume_range_m3 = data.new_volume_range_m3.strip()
    row.design_hours = data.design_hours
    row.machining_hours = data.machining_hours
    row.assembly_hours = data.assembly_hours
    row.finishing_hours = data.finishing_hours
    row.inspection_hours = data.inspection_hours

    db.commit()
    db.refresh(row)

    return {
        "message": "Master tool hours updated successfully",
        "data": {
            "volume_range_m3": row.volume_range_m3,
            "design_hours": row.design_hours,
            "machining_hours": row.machining_hours,
            "assembly_hours": row.assembly_hours,
            "finishing_hours": row.finishing_hours,
            "inspection_hours": row.inspection_hours
        }
    }



@router.post("/composites/master-tool-hours/")
def create_master_tool_hours(
    data: MasterToolHourCreate,
    db: Session = Depends(get_db)
):
    # ---------------------------------------
    # 1. Parse incoming range
    # ---------------------------------------
    try:
        new_min, new_max = MasterToolHourCreate.parse_range(
            data.volume_range_m3
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # ---------------------------------------
    # 2. Prevent duplicate exact range
    # ---------------------------------------
    if db.query(MasterToolHourTable).filter(
        MasterToolHourTable.volume_range_m3 == data.volume_range_m3
    ).first():
        raise HTTPException(
            status_code=400,
            detail=f"Volume range '{data.volume_range_m3}' already exists"
        )

    # ---------------------------------------
    # 3. Prevent overlapping ranges
    # ---------------------------------------
    existing_rows = db.query(MasterToolHourTable).all()

    for row in existing_rows:
        try:
            old_min, old_max = MasterToolHourCreate.parse_range(
                row.volume_range_m3
            )
        except ValueError:
            continue

        # overlap check
        if not (new_max <= old_min or new_min >= old_max):
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Volume range {data.volume_range_m3} overlaps "
                    f"with existing range {row.volume_range_m3}"
                )
            )

    # ---------------------------------------
    # 4. Create row
    # ---------------------------------------
    row = MasterToolHourTable(
        volume_range_m3=data.volume_range_m3,
        design_hours=data.design_hours,
        machining_hours=data.machining_hours,
        assembly_hours=data.assembly_hours,
        finishing_hours=data.finishing_hours,
        inspection_hours=data.inspection_hours
    )

    db.add(row)
    db.commit()
    db.refresh(row)

    return {
        "message": "Master tool hour range added successfully",
        "data": {
            "volume_range_m3": row.volume_range_m3,
            "design_hours": row.design_hours,
            "machining_hours": row.machining_hours,
            "assembly_hours": row.assembly_hours,
            "finishing_hours": row.finishing_hours,
            "inspection_hours": row.inspection_hours
        }
    }




@router.delete("/composites/master-tool-hours/{volume_range}")
def delete_master_tool_hours(
    volume_range: str,
    db: Session = Depends(get_db)
):
    # ---------------------------------------
    # Fetch row by volume range
    # ---------------------------------------
    row = db.query(MasterToolHourTable).filter(
        MasterToolHourTable.volume_range_m3 == volume_range
    ).first()

    if not row:
        raise HTTPException(
            status_code=404,
            detail=f"No master tool hour data found for range '{volume_range}'"
        )

    # ---------------------------------------
    # Delete row
    # ---------------------------------------
    db.delete(row)
    db.commit()

    return {
        "message": "Master tool hour range deleted successfully",
        "deleted_range": volume_range
    }




@router.get("/composites/part-tool-hours/")
def get_part_tool_hours(
    db: Session = Depends(get_db)
):
    rows = db.query(PartToolHourTable).all()

    if not rows:
        raise HTTPException(
            status_code=404,
            detail="No part tool hour data found"
        )

    return {
        "count": len(rows),
        "data": [
            {
                "id": row.id,
                "volume_range_m3": row.volume_range_m3,
                "curing_hours": row.curing_hours,
                "trimming_inspection_hours": row.trimming_inspection_hours
            }
            for row in rows
        ]
    }


@router.put("/composites/part-tool-hours/update-range")
def update_part_tool_hours_with_range_change(
    data: PartToolHourUpdateRange,
    db: Session = Depends(get_db)
):
    # ---------------------------------------
    # 1. Fetch row using OLD range
    # ---------------------------------------
    row = db.query(PartToolHourTable).filter(
        PartToolHourTable.volume_range_m3 == data.old_volume_range_m3
    ).first()

    if not row:
        raise HTTPException(
            status_code=404,
            detail=f"No part tool hour data found for range '{data.old_volume_range_m3}'"
        )

    # ---------------------------------------
    # 2. Validate volume range format
    # ---------------------------------------
    import re
    # Allowed patterns: 4-10, 2-4, 0-2 (numbers can vary but must be range format)
    range_pattern = r'^\d+-\d+$'
    if not re.match(range_pattern, data.new_volume_range_m3.strip()):
        raise HTTPException(
            status_code=400,
            detail="Invalid volume_range_m3 format. Must be in format: '4-10', '2-4', '0-2' (numbers can vary but must be range format)"
        )

    # ---------------------------------------
    # 3. Check for overlapping or conflicting ranges
    # ---------------------------------------
    if data.old_volume_range_m3 != data.new_volume_range_m3:
        existing_rows = db.query(PartToolHourTable).filter(
            PartToolHourTable.volume_range_m3 != data.old_volume_range_m3  # Exclude current record
        ).all()

        new_range = data.new_volume_range_m3.strip()
        
        for existing in existing_rows:
            existing_range = existing.volume_range_m3.strip()
            
            # Exact match check
            if new_range == existing_range:
                raise HTTPException(
                    status_code=400,
                    detail=f"Volume range '{new_range}' already exists"
                )
            
            # Overlap check for range formats (e.g., "2-4" vs "3-5")
            if '-' in new_range and '-' in existing_range:
                try:
                    new_start, new_end = map(float, new_range.split('-'))
                    existing_start, existing_end = map(float, existing_range.split('-'))
                    
                    # Check if ranges overlap
                    if not (new_end < existing_start or new_start > existing_end):
                        raise HTTPException(
                            status_code=400,
                            detail=f"Volume range '{new_range}' overlaps with existing range '{existing_range}'"
                        )
                except ValueError:
                    continue

    # ---------------------------------------
    # 4. Prevent duplicate new range (additional check)
    # ---------------------------------------
    if data.old_volume_range_m3 != data.new_volume_range_m3:
        existing = db.query(PartToolHourTable).filter(
            PartToolHourTable.volume_range_m3 == data.new_volume_range_m3
        ).first()

        if existing:
            raise HTTPException(
                status_code=400,
                detail=f"Volume range '{data.new_volume_range_m3}' already exists"
            )

    # ---------------------------------------
    # 5. Update values
    # ---------------------------------------
    row.volume_range_m3 = data.new_volume_range_m3.strip()
    row.curing_hours = data.curing_hours
    row.trimming_inspection_hours = data.trimming_inspection_hours

    db.commit()
    db.refresh(row)

    return {
        "message": "Part tool hours updated successfully",
        "data": {
            "volume_range_m3": row.volume_range_m3,
            "curing_hours": row.curing_hours,
            "trimming_inspection_hours": row.trimming_inspection_hours
        }
    }




@router.post("/composites/part-tool-hours/")
def create_part_tool_hours(
    data: PartToolHourCreate,
    db: Session = Depends(get_db)
):
    # ---------------------------------------
    # 1. Parse incoming range
    # ---------------------------------------
    try:
        new_min, new_max = PartToolHourCreate.parse_range(
            data.volume_range_m3
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # ---------------------------------------
    # 2. Prevent duplicate exact range
    # ---------------------------------------
    if db.query(PartToolHourTable).filter(
        PartToolHourTable.volume_range_m3 == data.volume_range_m3
    ).first():
        raise HTTPException(
            status_code=400,
            detail=f"Volume range '{data.volume_range_m3}' already exists"
        )

    # ---------------------------------------
    # 3. Prevent overlapping ranges
    # ---------------------------------------
    existing_rows = db.query(PartToolHourTable).all()

    for row in existing_rows:
        try:
            old_min, old_max = PartToolHourCreate.parse_range(
                row.volume_range_m3
            )
        except ValueError:
            continue

        if not (new_max <= old_min or new_min >= old_max):
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Volume range {data.volume_range_m3} overlaps "
                    f"with existing range {row.volume_range_m3}"
                )
            )

    # ---------------------------------------
    # 4. Create row
    # ---------------------------------------
    row = PartToolHourTable(
        volume_range_m3=data.volume_range_m3,
        curing_hours=data.curing_hours,
        trimming_inspection_hours=data.trimming_inspection_hours
    )

    db.add(row)
    db.commit()
    db.refresh(row)

    return {
        "message": "Part tool hour range added successfully",
        "data": {
            "volume_range_m3": row.volume_range_m3,
            "curing_hours": row.curing_hours,
            "trimming_inspection_hours": row.trimming_inspection_hours
        }
    }




@router.delete("/composites/part-tool-hours/{volume_range}")
def delete_part_tool_hours(
    volume_range: str,
    db: Session = Depends(get_db)
):
    # ---------------------------------------
    # Fetch row by volume range
    # ---------------------------------------
    row = db.query(PartToolHourTable).filter(
        PartToolHourTable.volume_range_m3 == volume_range
    ).first()

    if not row:
        raise HTTPException(
            status_code=404,
            detail=f"No part tool hour data found for range '{volume_range}'"
        )

    # ---------------------------------------
    # Delete row
    # ---------------------------------------
    db.delete(row)
    db.commit()

    return {
        "message": "Part tool hour range deleted successfully",
        "deleted_range": volume_range
    }


@router.get("/composites/part-tool-layup-hours/")
def get_part_tool_layup_hours(db: Session = Depends(get_db)):
    rows = db.query(PartToolLayupHourTable).all()

    if not rows:
        raise HTTPException(status_code=404, detail="No layup hour data found")

    return {
        "count": len(rows),
        "data": [
            {
                "surface_area_range": row.surface_area_range,
                "layup_man_hours": row.layup_man_hours
            }
            for row in rows
        ]
    }



@router.post("/composites/part-tool-layup-hours/")
def create_part_tool_layup_hours(
    data: PartToolLayupHourCreate,
    db: Session = Depends(get_db)
):
    # Validate range
    try:
        new_min, new_max = data.parse_range(data.surface_area_range)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Prevent duplicate
    if db.query(PartToolLayupHourTable).filter(
        PartToolLayupHourTable.surface_area_range == data.surface_area_range
    ).first():
        raise HTTPException(
            status_code=400,
            detail=f"Surface area range '{data.surface_area_range}' already exists"
        )

    row = PartToolLayupHourTable(
        surface_area_range=data.surface_area_range,
        layup_man_hours=data.layup_man_hours
    )

    db.add(row)
    db.commit()
    db.refresh(row)

    return {
        "message": "Layup hour range added successfully",
        "data": {
            "surface_area_range": row.surface_area_range,
            "layup_man_hours": row.layup_man_hours
        }
    }


@router.put("/composites/part-tool-layup-hours/update-range")
def update_part_tool_layup_hours(
    data: PartToolLayupHourUpdateRange,
    db: Session = Depends(get_db)
):
    row = db.query(PartToolLayupHourTable).filter(
        PartToolLayupHourTable.surface_area_range == data.old_surface_area_range
    ).first()

    if not row:
        raise HTTPException(
            status_code=404,
            detail=f"No row found for range '{data.old_surface_area_range}'"
        )

    # ---------------------------------------
    # 2. Validate surface area range format
    # ---------------------------------------
    import re
    # Allowed patterns: 4-10, 2-4, 0-2 (numbers can vary but must be range format)
    range_pattern = r'^\d+-\d+$'
    if not re.match(range_pattern, data.new_surface_area_range.strip()):
        raise HTTPException(
            status_code=400,
            detail="Invalid surface_area_range format. Must be in format: '4-10', '2-4', '0-2' (numbers can vary but must be range format)"
        )

    # ---------------------------------------
    # 3. Check for overlapping or conflicting ranges
    # ---------------------------------------
    if data.old_surface_area_range != data.new_surface_area_range:
        existing_rows = db.query(PartToolLayupHourTable).filter(
            PartToolLayupHourTable.surface_area_range != data.old_surface_area_range  # Exclude current record
        ).all()

        new_range = data.new_surface_area_range.strip()
        
        for existing in existing_rows:
            existing_range = existing.surface_area_range.strip()
            
            # Exact match check
            if new_range == existing_range:
                raise HTTPException(
                    status_code=400,
                    detail=f"Surface area range '{new_range}' already exists"
                )
            
            # Overlap check for range formats (e.g., "2-4" vs "3-5")
            if '-' in new_range and '-' in existing_range:
                try:
                    new_start, new_end = map(float, new_range.split('-'))
                    existing_start, existing_end = map(float, existing_range.split('-'))
                    
                    # Check if ranges overlap
                    if not (new_end < existing_start or new_start > existing_end):
                        raise HTTPException(
                            status_code=400,
                            detail=f"Surface area range '{new_range}' overlaps with existing range '{existing_range}'"
                        )
                except ValueError:
                    continue

    # ---------------------------------------
    # 4. Prevent duplicate new range (additional check)
    # ---------------------------------------
    if data.old_surface_area_range != data.new_surface_area_range:
        if db.query(PartToolLayupHourTable).filter(
            PartToolLayupHourTable.surface_area_range == data.new_surface_area_range
        ).first():
            raise HTTPException(
                status_code=400,
                detail=f"Surface area range '{data.new_surface_area_range}' already exists"
            )

    row.surface_area_range = data.new_surface_area_range.strip()
    row.layup_man_hours = data.layup_man_hours

    db.commit()
    db.refresh(row)

    return {
        "message": "Layup hour range updated successfully",
        "data": {
            "surface_area_range": row.surface_area_range,
            "layup_man_hours": row.layup_man_hours
        }
    }


@router.delete("/composites/part-tool-layup-hours/{surface_area_range}")
def delete_part_tool_layup_hours(
    surface_area_range: str,
    db: Session = Depends(get_db)
):
    row = db.query(PartToolLayupHourTable).filter(
        PartToolLayupHourTable.surface_area_range == surface_area_range
    ).first()

    if not row:
        raise HTTPException(
            status_code=404,
            detail=f"No layup hour data found for range '{surface_area_range}'"
        )

    db.delete(row)
    db.commit()

    return {
        "message": "Layup hour range deleted successfully",
        "deleted_range": surface_area_range
    }


@router.get("/composites/part-fabrication-hours/")
def get_part_fabrication_hours(db: Session = Depends(get_db)):
    rows = db.query(PartFabricationHourTable).all()

    if not rows:
        raise HTTPException(
            status_code=404,
            detail="No part fabrication hour data found"
        )

    return {
        "count": len(rows),
        "data": [
            {
                "volume_range_m3": row.volume_range_m3,
                "curing_hours": row.curing_hours,
                "trimming_inspection_hours": row.trimming_inspection_hours,
                "ndts_hours": row.ndts_hours
            }
            for row in rows
        ]
    }

@router.post("/composites/part-fabrication-hours/")
def create_part_fabrication_hours(
    data: PartFabricationHourCreate,
    db: Session = Depends(get_db)
):
    # ---------------------------------------
    # 1. Parse new range
    # ---------------------------------------
    try:
        new_min, new_max = data.parse_range(data.volume_range_m3)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # ---------------------------------------
    # 2. Check overlap with existing ranges
    # ---------------------------------------
    existing_rows = db.query(PartFabricationHourTable).all()

    for row in existing_rows:
        try:
            old_min, old_max = data.parse_range(row.volume_range_m3)
        except ValueError:
            continue

        # Overlap condition
        if not (new_max <= old_min or new_min >= old_max):
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Volume range {data.volume_range_m3} overlaps "
                    f"with existing range {row.volume_range_m3}"
                )
            )

    # ---------------------------------------
    # 3. Create row (safe now)
    # ---------------------------------------
    row = PartFabricationHourTable(
        volume_range_m3=data.volume_range_m3,
        curing_hours=data.curing_hours,
        trimming_inspection_hours=data.trimming_inspection_hours,
        ndts_hours=data.ndts_hours
    )

    db.add(row)
    db.commit()
    db.refresh(row)

    return {
        "message": "Part fabrication hour range added successfully",
        "data": {
            "volume_range_m3": row.volume_range_m3,
            "curing_hours": row.curing_hours,
            "trimming_inspection_hours": row.trimming_inspection_hours,
            "ndts_hours": row.ndts_hours
        }
    }

@router.put("/composites/part-fabrication-hours/update-range")
def update_part_fabrication_hours(
    data: PartFabricationHourUpdateRange,
    db: Session = Depends(get_db)
):
    row = db.query(PartFabricationHourTable).filter(
        PartFabricationHourTable.volume_range_m3 == data.old_volume_range_m3
    ).first()

    if not row:
        raise HTTPException(
            status_code=404,
            detail=f"No row found for range '{data.old_volume_range_m3}'"
        )

    # ---------------------------------------
    # 2. Validate volume range format
    # ---------------------------------------
    import re
    # Allowed patterns: 4-10, 2-4, 0-2 (numbers can vary but must be range format)
    range_pattern = r'^\d+-\d+$'
    if not re.match(range_pattern, data.new_volume_range_m3.strip()):
        raise HTTPException(
            status_code=400,
            detail="Invalid volume_range_m3 format. Must be in format: '4-10', '2-4', '0-2' (numbers can vary but must be range format)"
        )

    # ---------------------------------------
    # 3. Check for overlapping or conflicting ranges
    # ---------------------------------------
    if data.old_volume_range_m3 != data.new_volume_range_m3:
        existing_rows = db.query(PartFabricationHourTable).filter(
            PartFabricationHourTable.volume_range_m3 != data.old_volume_range_m3  # Exclude current record
        ).all()

        new_range = data.new_volume_range_m3.strip()
        
        for existing in existing_rows:
            existing_range = existing.volume_range_m3.strip()
            
            # Exact match check
            if new_range == existing_range:
                raise HTTPException(
                    status_code=400,
                    detail=f"Volume range '{new_range}' already exists"
                )
            
            # Overlap check for range formats (e.g., "2-4" vs "3-5")
            if '-' in new_range and '-' in existing_range:
                try:
                    new_start, new_end = map(float, new_range.split('-'))
                    existing_start, existing_end = map(float, existing_range.split('-'))
                    
                    # Check if ranges overlap
                    if not (new_end < existing_start or new_start > existing_end):
                        raise HTTPException(
                            status_code=400,
                            detail=f"Volume range '{new_range}' overlaps with existing range '{existing_range}'"
                        )
                except ValueError:
                    continue

    # ---------------------------------------
    # 4. Prevent duplicate new range (additional check)
    # ---------------------------------------
    # Prevent duplicate new range
    if data.old_volume_range_m3 != data.new_volume_range_m3:
        if db.query(PartFabricationHourTable).filter(
            PartFabricationHourTable.volume_range_m3 == data.new_volume_range_m3
        ).first():
            raise HTTPException(
                status_code=400,
                detail=f"Volume range '{data.new_volume_range_m3}' already exists"
            )

    row.volume_range_m3 = data.new_volume_range_m3.strip()
    row.curing_hours = data.curing_hours
    row.trimming_inspection_hours = data.trimming_inspection_hours
    row.ndts_hours = data.ndts_hours

    db.commit()
    db.refresh(row)

    return {
        "message": "Part fabrication hours updated successfully",
        "data": {
            "volume_range_m3": row.volume_range_m3,
            "curing_hours": row.curing_hours,
            "trimming_inspection_hours": row.trimming_inspection_hours,
            "ndts_hours": row.ndts_hours
        }
    }


@router.delete("/composites/part-fabrication-hours/{volume_range}")
def delete_part_fabrication_hours(
    volume_range: str,
    db: Session = Depends(get_db)
):
    row = db.query(PartFabricationHourTable).filter(
        PartFabricationHourTable.volume_range_m3 == volume_range
    ).first()

    if not row:
        raise HTTPException(
            status_code=404,
            detail=f"No part fabrication hour data found for range '{volume_range}'"
        )

    db.delete(row)
    db.commit()

    return {
        "message": "Part fabrication hour range deleted successfully",
        "deleted_range": volume_range
    }


@router.get("/composites/part-fabrication-layup-hours/")
def get_part_fabrication_layup_hours(db: Session = Depends(get_db)):
    rows = db.query(PartFabricationLayupHourTable).all()

    if not rows:
        raise HTTPException(
            status_code=404,
            detail="No part fabrication layup hour data found"
        )

    return {
        "count": len(rows),
        "data": [
            {
                "surface_area_range": row.surface_area_range,
                "layup_man_hours": row.layup_man_hours
            }
            for row in rows
        ]
    }


@router.post("/composites/part-fabrication-layup-hours/")
def create_part_fabrication_layup_hours(
    data: PartFabricationLayupHourCreate,
    db: Session = Depends(get_db)
):
    # 1. Parse new range
    try:
        new_min, new_max = data.parse_range(data.surface_area_range)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # 2. Overlap check
    existing_rows = db.query(PartFabricationLayupHourTable).all()
    for row in existing_rows:
        try:
            old_min, old_max = data.parse_range(row.surface_area_range)
        except ValueError:
            continue

        if not (new_max <= old_min or new_min >= old_max):
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Surface area range {data.surface_area_range} overlaps "
                    f"with existing range {row.surface_area_range}"
                )
            )

    # 3. Create row
    row = PartFabricationLayupHourTable(
        surface_area_range=data.surface_area_range,
        layup_man_hours=data.layup_man_hours
    )

    db.add(row)
    db.commit()
    db.refresh(row)

    return {
        "message": "Part fabrication layup hour range added successfully",
        "data": {
            "surface_area_range": row.surface_area_range,
            "layup_man_hours": row.layup_man_hours
        }
    }


@router.put("/composites/part-fabrication-layup-hours/update-range")
def update_part_fabrication_layup_hours(
    data: PartFabricationLayupHourUpdateRange,
    db: Session = Depends(get_db)
):
    row = db.query(PartFabricationLayupHourTable).filter(
        PartFabricationLayupHourTable.surface_area_range == data.old_surface_area_range
    ).first()

    if not row:
        raise HTTPException(
            status_code=404,
            detail=f"No row found for range '{data.old_surface_area_range}'"
        )

    # ---------------------------------------
    # 2. Validate surface area range format
    # ---------------------------------------
    import re
    # Allowed patterns: 4-10, 2-4, 0-2 (numbers can vary but must be range format)
    range_pattern = r'^\d+-\d+$'
    if not re.match(range_pattern, data.new_surface_area_range.strip()):
        raise HTTPException(
            status_code=400,
            detail="Invalid surface_area_range format. Must be in format: '4-10', '2-4', '0-2' (numbers can vary but must be range format)"
        )

    # ---------------------------------------
    # 3. Check for overlapping or conflicting ranges
    # ---------------------------------------
    if data.old_surface_area_range != data.new_surface_area_range:
        existing_rows = db.query(PartFabricationLayupHourTable).filter(
            PartFabricationLayupHourTable.surface_area_range != data.old_surface_area_range  # Exclude current record
        ).all()

        new_range = data.new_surface_area_range.strip()
        
        for existing in existing_rows:
            existing_range = existing.surface_area_range.strip()
            
            # Exact match check
            if new_range == existing_range:
                raise HTTPException(
                    status_code=400,
                    detail=f"Surface area range '{new_range}' already exists"
                )
            
            # Overlap check for range formats (e.g., "2-4" vs "3-5")
            if '-' in new_range and '-' in existing_range:
                try:
                    new_start, new_end = map(float, new_range.split('-'))
                    existing_start, existing_end = map(float, existing_range.split('-'))
                    
                    # Check if ranges overlap
                    if not (new_end < existing_start or new_start > existing_end):
                        raise HTTPException(
                            status_code=400,
                            detail=f"Surface area range '{new_range}' overlaps with existing range '{existing_range}'"
                        )
                except ValueError:
                    continue

    # ---------------------------------------
    # 4. Prevent duplicate new range (additional check)
    # ---------------------------------------
    # Prevent duplicate new range
    if data.old_surface_area_range != data.new_surface_area_range:
        if db.query(PartFabricationLayupHourTable).filter(
            PartFabricationLayupHourTable.surface_area_range == data.new_surface_area_range
        ).first():
            raise HTTPException(
                status_code=400,
                detail=f"Surface area range '{data.new_surface_area_range}' already exists"
            )

    row.surface_area_range = data.new_surface_area_range.strip()
    row.layup_man_hours = data.layup_man_hours

    db.commit()
    db.refresh(row)

    return {
        "message": "Part fabrication layup hour range updated successfully",
        "data": {
            "surface_area_range": row.surface_area_range,
            "layup_man_hours": row.layup_man_hours
        }
    }


@router.delete("/composites/part-fabrication-layup-hours/{surface_area_range}")
def delete_part_fabrication_layup_hours(
    surface_area_range: str,
    db: Session = Depends(get_db)
):
    row = db.query(PartFabricationLayupHourTable).filter(
        PartFabricationLayupHourTable.surface_area_range == surface_area_range
    ).first()

    if not row:
        raise HTTPException(
            status_code=404,
            detail=f"No layup hour data found for range '{surface_area_range}'"
        )

    db.delete(row)
    db.commit()

    return {
        "message": "Part fabrication layup hour range deleted successfully",
        "deleted_range": surface_area_range
    }




#tocheck recalculate stock

#
# @router.post("/composites/analysis/{analysis_id}/recalculate-with-stock1")
# def recalculate_with_custom_stock(
#     analysis_id: int,
#     data: StockOverrideInput,
#     db: Session = Depends(get_db)
# ):
#     # =================================================
#     # 1. Fetch analysis
#     # =================================================
#     analysis = db.query(CompositeAnalysisResult).filter(
#         CompositeAnalysisResult.id == analysis_id
#     ).first()
#
#     if not analysis:
#         raise HTTPException(404, f"Analysis {analysis_id} not found")
#
#     # =================================================
#     # 2. OVERRIDE STOCK
#     # =================================================
#     stock_length = data.stock_length_mm
#     stock_width = data.stock_width_mm
#     stock_height = data.stock_height_mm
#
#     tool_volume = (stock_length * stock_width * stock_height) / 1e9
#
#     # =================================================
#     # 3. MASTER TOOL COST
#     # =================================================
#     master_tool = db.query(MasterToolCost).first()
#     if not master_tool:
#         raise HTTPException(404, "Master tool cost table empty")
#
#     tool_stock_weight = master_tool.epoxy_block_density * tool_volume
#
#     # ---- Match master tool hours
#     tool_hour_rows = db.query(MasterToolHourTable).all()
#     matched_tool_row = next(
#         (r for r in tool_hour_rows
#          if float(r.volume_range_m3.split("-")[0]) <= tool_volume <= float(r.volume_range_m3.split("-")[1])),
#         None
#     )
#
#     if not matched_tool_row:
#         raise HTTPException(400, "No matching master tool hour range")
#
#     Design_cost = master_tool.design_cost_per_hr * matched_tool_row.design_hours
#     frame_fabrication_cost = tool_volume * master_tool.frame_fabrication_cost
#     epoxy_block_cost = (tool_volume * master_tool.epoxy_block_material_cost) + master_tool.epoxy_block_bonding_cost
#     machining_cost = master_tool.machining_cost_per_hr * matched_tool_row.machining_hours
#     assembly_cost = master_tool.assembly_cost_per_hr * matched_tool_row.assembly_hours
#     finishing_cost = master_tool.finishing_cost_per_hr * matched_tool_row.finishing_hours
#     inspection_cost = master_tool.inspection_cost_per_hr * matched_tool_row.inspection_hours
#
#     total_master_tool_cost = (
#         Design_cost + frame_fabrication_cost + epoxy_block_cost +
#         machining_cost + assembly_cost + finishing_cost + inspection_cost
#     )
#
#     # =================================================
#     # 4. TOOL COST (Part Tool)
#     # =================================================
#     part_tool_cost = db.query(CompositesPartToolCost).first()
#     if not part_tool_cost:
#         raise HTTPException(404, "Part tool cost table empty")
#
#     Increased_thickness_tool = (
#         part_tool_cost.added_thickness_mm + analysis.geometric_thickness_mm
#     )
#
#     Total_surface_area = (
#         Increased_thickness_tool / analysis.design_thickness_mm
#     ) * analysis.one_ply_surface_area_m2
#
#     Increased_surface_area = Total_surface_area * (
#         (100 + part_tool_cost.Percentage_of_surface_area_to_be_increased) / 100
#     )
#
#     COST_DRYCARBON_FABRIC = (
#         Increased_surface_area * part_tool_cost.COST_OF_DRY_CARBON_FABRIC
#     )
#
#     # ---- Layup hours by surface area
#     layup_rows = db.query(PartToolLayupHourTable).all()
#     matched_layup = next(
#         (r for r in layup_rows
#          if float(r.surface_area_range.split("-")[0]) <= Increased_surface_area <= float(r.surface_area_range.split("-")[1])),
#         None
#     )
#
#     if not matched_layup:
#         raise HTTPException(400, "No matching layup surface range")
#
#     layup_cost = matched_layup.layup_man_hours * part_tool_cost.LAYUP_COST
#
#     # ---- Volume based tool hours
#     volume_rows = db.query(PartToolHourTable).all()
#     matched_volume = next(
#         (r for r in volume_rows
#          if float(r.volume_range_m3.split("-")[0]) <= tool_volume <= float(r.volume_range_m3.split("-")[1])),
#         None
#     )
#
#     if not matched_volume:
#         raise HTTPException(400, "No matching part tool volume range")
#
#     oven_curing_cost = matched_volume.curing_hours * part_tool_cost.OVEN_CURING_COST
#     trimming_cost = matched_volume.trimming_inspection_hours * part_tool_cost.TRIMMING_INSPECTION
#     lt_inspection_cost = part_tool_cost.Number_of_Inspection_time * part_tool_cost.LT_INSPECTION_COST
#
#     cost_fab_cfc = Total_surface_area * part_tool_cost.COST_FOR_FABRICATION_CFC_TUBES
#     cost_bond_rivet = Total_surface_area * part_tool_cost.COST_FOR_BONDING_AND_RIVETING
#
#     total_tool_cost = (
#         COST_DRYCARBON_FABRIC + layup_cost + oven_curing_cost +
#         trimming_cost + lt_inspection_cost +
#         cost_fab_cfc + cost_bond_rivet
#     )
#
#     # =================================================
#     # 5. PART FABRICATION COST
#     # =================================================
#     part_fab_cost = db.query(CompositesPartFabricationCost).first()
#     if not part_fab_cost:
#         raise HTTPException(404, "Part fabrication cost table empty")
#
#     fabrication_layup_rows = db.query(PartFabricationLayupHourTable).all()
#     matched_part_layup = next(
#         (r for r in fabrication_layup_rows
#          if float(r.surface_area_range.split("-")[0]) <= analysis.total_surface_area_m2 <= float(r.surface_area_range.split("-")[1])),
#         None
#     )
#
#     part_layup_cost = matched_part_layup.layup_man_hours * part_fab_cost.layup_cost_per_hr
#
#     fabrication_hour_rows = db.query(PartFabricationHourTable).all()
#     matched_part_fab = next(
#         (r for r in fabrication_hour_rows
#          if float(r.volume_range_m3.split("-")[0]) <= tool_volume <= float(r.volume_range_m3.split("-")[1])),
#         None
#     )
#
#     autoclave_cost = matched_part_fab.curing_hours * part_fab_cost.autoclave_curing_cost_per_hr
#     trimming_inspection_cost = matched_part_fab.trimming_inspection_hours * part_fab_cost.trimming_inspection_cost_per_hr
#     ndt_cost = matched_part_fab.ndts_hours * part_fab_cost.ndts_cost_per_hr
#
#     Extra_composite_part = analysis.mass_in_kg * (
#         (100 + part_fab_cost.extra_prepreg_weight_percent) / 100
#     )
#     print("Extra_composite_part",Extra_composite_part)
#     print("mass_in_kg",analysis.mass_in_kg)
#
#     prepreg_cost = Extra_composite_part * analysis.prepreg_cost_per_kg
#     print(prepreg_cost)
#     consumable_cost = (prepreg_cost * part_fab_cost.consumable_cost_percent) / 100
#
#     total_part_cost = (
#         prepreg_cost + part_layup_cost + consumable_cost +
#         autoclave_cost + trimming_inspection_cost + ndt_cost
#     )
#
#     # =================================================
#     # 6. FINAL COST
#     # =================================================
#     total_tool_and_part = total_tool_cost + total_part_cost
#     import_export = total_tool_and_part * 0.05
#     contingency = total_tool_and_part * 0.1
#     gst = total_tool_and_part * 0.18
#
#     final_cost = total_tool_and_part + import_export + contingency + gst
#
#     # =================================================
#     # RETURN ONLY (NO DB INSERT)
#     # =================================================
#     return {
#         "analysis_id": analysis_id,
#         "stock_override_mm": data.dict(),
#         "tool_volume_m3": tool_volume,
#         "tool_stock_weight_kg": tool_stock_weight,
#         "total_master_tool_cost": total_master_tool_cost,
#         "total_tool_cost": total_tool_cost,
#         "total_part_cost": total_part_cost,
#         "total_tool_and_part_cost": total_tool_and_part,
#         "final_cost": final_cost
#     }





@router.post("/composites/analysis/{analysis_id}/recalculate-with-stock")
def recalculate_with_custom_stock(
    analysis_id: int,
    data: StockOverrideInput,
    db: Session = Depends(get_db)
):
    try:
        # =================================================
        # 1. FETCH ANALYSIS
        # =================================================
        analysis = db.query(CompositeAnalysisResult).filter(
            CompositeAnalysisResult.id == analysis_id
        ).first()

        if not analysis:
            raise HTTPException(404, f"Analysis {analysis_id} not found")

        # =================================================
        # 2. OVERRIDE STOCK
        # =================================================
        stock_length = data.stock_length_mm
        stock_width = data.stock_width_mm
        stock_height = data.stock_height_mm

        tool_volume = (stock_length * stock_width * stock_height) / 1e9

        # =================================================
        # 3. MASTER TOOL COST
        # =================================================
        master_tool = db.query(MasterToolCost).first()
        if not master_tool:
            raise HTTPException(404, "Master tool cost table empty")

        tool_stock_weight = master_tool.epoxy_block_density * tool_volume

        tool_hour_rows = db.query(MasterToolHourTable).all()
        matched_tool_row = next(
            (
                r for r in tool_hour_rows
                if float(r.volume_range_m3.split("-")[0])
                <= tool_volume
                <= float(r.volume_range_m3.split("-")[1])
            ),
            None
        )

        if not matched_tool_row:
            raise HTTPException(400, "No matching master tool hour range")

        correction_row_1 = db.query(CompositeCorrectionFactor1).first()
        if not correction_row_1:
            raise HTTPException(
                status_code=404,
                detail="Correction factor not found"
                )

        correction_factor_1 = correction_row_1.correction


        

        

        Design_cost = master_tool.design_cost_per_hr * matched_tool_row.design_hours
        frame_fabrication_cost = tool_volume * master_tool.frame_fabrication_cost
        epoxy_block_cost = (
            tool_volume * master_tool.epoxy_block_material_cost
            + master_tool.epoxy_block_bonding_cost
        )
        machining_cost = master_tool.machining_cost_per_hr * matched_tool_row.machining_hours
        assembly_cost = master_tool.assembly_cost_per_hr * matched_tool_row.assembly_hours
        finishing_cost = master_tool.finishing_cost_per_hr * matched_tool_row.finishing_hours
        inspection_cost = master_tool.inspection_cost_per_hr * matched_tool_row.inspection_hours

        total_master_tool_cost = (
            Design_cost
            + frame_fabrication_cost
            + epoxy_block_cost
            + machining_cost
            + assembly_cost
            + finishing_cost
            + inspection_cost
        )*correction_factor_1

        # =================================================
        # 4. TOOL COST (PART TOOL)
        # =================================================
        part_tool_cost = db.query(CompositesPartToolCost).first()
        if not part_tool_cost:
            raise HTTPException(404, "Part tool cost table empty")

        Increased_thickness_tool = (
            part_tool_cost.added_thickness_mm + analysis.geometric_thickness_mm
        )

        Total_surface_area = (
            Increased_thickness_tool / analysis.design_thickness_mm
        ) * analysis.one_ply_surface_area_m2

        Increased_surface_area = Total_surface_area * (
            (100 + part_tool_cost.Percentage_of_surface_area_to_be_increased) / 100
        )

        COST_DRYCARBON_FABRIC = (
            Increased_surface_area * part_tool_cost.COST_OF_DRY_CARBON_FABRIC
        )

        layup_rows = db.query(PartToolLayupHourTable).all()
        matched_layup = next(
            (
                r for r in layup_rows
                if float(r.surface_area_range.split("-")[0])
                <= Increased_surface_area
                <= float(r.surface_area_range.split("-")[1])
            ),
            None
        )

        if not matched_layup:
            raise HTTPException(400, "No matching layup surface range")

        layup_cost = matched_layup.layup_man_hours * part_tool_cost.LAYUP_COST

        volume_rows = db.query(PartToolHourTable).all()
        matched_volume = next(
            (
                r for r in volume_rows
                if float(r.volume_range_m3.split("-")[0])
                <= tool_volume
                <= float(r.volume_range_m3.split("-")[1])
            ),
            None
        )

        if not matched_volume:
            raise HTTPException(400, "No matching part tool volume range")

        correction_row_2 = db.query(CompositeCorrectionFactor2).first()
        if not correction_row_2:
            raise HTTPException(
                status_code=404,
                detail="Correction factor not found"
                )

        correction_factor_2 = correction_row_2.correction

        

        oven_curing_cost = matched_volume.curing_hours * part_tool_cost.OVEN_CURING_COST
        trimming_cost = matched_volume.trimming_inspection_hours * part_tool_cost.TRIMMING_INSPECTION
        lt_inspection_cost = (
            part_tool_cost.Number_of_Inspection_time
            * part_tool_cost.LT_INSPECTION_COST
        )

        cost_fab_cfc = Total_surface_area * part_tool_cost.COST_FOR_FABRICATION_CFC_TUBES
        cost_bond_rivet = Total_surface_area * part_tool_cost.COST_FOR_BONDING_AND_RIVETING

        total_tool_cost = (
            COST_DRYCARBON_FABRIC
            + layup_cost
            + oven_curing_cost
            + trimming_cost
            + lt_inspection_cost
            + cost_fab_cfc
            + cost_bond_rivet
        )*correction_factor_2

        # =================================================
        # 5. PART FABRICATION COST
        # =================================================
        part_fab_cost = db.query(CompositesPartFabricationCost).first()
        if not part_fab_cost:
            raise HTTPException(404, "Part fabrication cost table empty")

        fabrication_layup_rows = db.query(PartFabricationLayupHourTable).all()
        matched_part_layup = next(
            (
                r for r in fabrication_layup_rows
                if float(r.surface_area_range.split("-")[0])
                <= analysis.total_surface_area_m2
                <= float(r.surface_area_range.split("-")[1])
            ),
            None
        )

        if not matched_part_layup:
            raise HTTPException(400, "No matching fabrication layup surface range")

        part_layup_cost = (
            matched_part_layup.layup_man_hours
            * part_fab_cost.layup_cost_per_hr
        )

        fabrication_hour_rows = db.query(PartFabricationHourTable).all()
        matched_part_fab = next(
            (
                r for r in fabrication_hour_rows
                if float(r.volume_range_m3.split("-")[0])
                <= tool_volume
                <= float(r.volume_range_m3.split("-")[1])
            ),
            None
        )

        if not matched_part_fab:
            raise HTTPException(400, "No matching fabrication volume range")

        correction_row_3= db.query(CompositeCorrectionFactor3).first()
        if not correction_row_3:
            raise HTTPException(
                status_code=404,
                detail="Correction factor not found"
                )

        correction_factor_3 = correction_row_3.correction

        autoclave_cost = (
            matched_part_fab.curing_hours
            * part_fab_cost.autoclave_curing_cost_per_hr
        )
        trimming_inspection_cost = (
            matched_part_fab.trimming_inspection_hours
            * part_fab_cost.trimming_inspection_cost_per_hr
        )
        ndt_cost = (
            matched_part_fab.ndts_hours
            * part_fab_cost.ndts_cost_per_hr
        )

        part_mass_kg = analysis.mass_in_kg

        Extra_composite_part = part_mass_kg * (
            (100 + part_fab_cost.extra_prepreg_weight_percent) / 100
        )

        prepreg_cost = Extra_composite_part * analysis.prepreg_cost_per_kg
        consumable_cost = (
            prepreg_cost * part_fab_cost.consumable_cost_percent / 100
        )

        total_part_cost = (
            prepreg_cost
            + part_layup_cost
            + consumable_cost
            + autoclave_cost
            + trimming_inspection_cost
            + ndt_cost
        )*correction_factor_3

        # =================================================
        # 6. FINAL COST
        # =================================================

        final_cost_row = db.query(CompositePartToolFinalCost).filter(
            CompositePartToolFinalCost.analysis_id == analysis_id
        ).first()
        if not final_cost_row:
            final_cost_row = CompositePartToolFinalCost(analysis_id=analysis_id)
            db.add(final_cost_row)


        total_tool_and_part = total_tool_cost + total_part_cost
        import_export = total_tool_and_part * 0.05
        contingency = total_tool_and_part * 0.1
        gst = total_tool_and_part * 0.18
        final_cost = total_tool_and_part + import_export + contingency + gst
        total_cost_per_unit=final_cost
        total_cost=final_cost*final_cost_row.quantity

        # =================================================
        # 7. PERSIST UPDATES (ANALYSIS + COST TABLES)
        # =================================================

        # ---- CompositeAnalysisResult
        analysis.stock_length_mm = stock_length
        analysis.stock_width_mm = stock_width
        analysis.stock_height_mm = stock_height
        analysis.volume_of_composite_tool_in_m3 = tool_volume
        analysis.tool_stock_weight_kg = tool_stock_weight

        # ---- CompositeMasterModelCost
        master_cost = db.query(CompositeMasterModelCost).filter(
            CompositeMasterModelCost.analysis_id == analysis_id
        ).first()
        if not master_cost:
            master_cost = CompositeMasterModelCost(analysis_id=analysis_id)
            db.add(master_cost)

        master_cost.design_hours = matched_tool_row.design_hours
        master_cost.machining_hours = matched_tool_row.machining_hours
        master_cost.assembly_hours = matched_tool_row.assembly_hours
        master_cost.finishing_hours = matched_tool_row.finishing_hours
        master_cost.inspection_hours = matched_tool_row.inspection_hours

        master_cost.design_cost = Design_cost
        master_cost.frame_fabrication_cost = frame_fabrication_cost
        master_cost.epoxy_block_bonding_cost = epoxy_block_cost
        master_cost.machining_cost = machining_cost
        master_cost.assembly_cost = assembly_cost
        master_cost.finishing_cost = finishing_cost
        master_cost.inspection_cost = inspection_cost
        master_cost.total_master_model_cost = total_master_tool_cost

        # ---- CompositeToolCost
        tool_cost_row = db.query(CompositeToolCost).filter(
            CompositeToolCost.analysis_id == analysis_id
        ).first()
        if not tool_cost_row:
            tool_cost_row = CompositeToolCost(analysis_id=analysis_id)
            db.add(tool_cost_row)

        tool_cost_row.increased_thickness_tool_mm = Increased_thickness_tool
        tool_cost_row.total_surface_area_m2 = Total_surface_area
        tool_cost_row.increased_surface_area_m2 = Increased_surface_area
        tool_cost_row.cost_dry_carbon_fabric = COST_DRYCARBON_FABRIC
        tool_cost_row.layup_man_hours = matched_layup.layup_man_hours
        tool_cost_row.layup_cost = layup_cost
        tool_cost_row.curing_hours = matched_volume.curing_hours
        tool_cost_row.oven_curing_cost = oven_curing_cost
        tool_cost_row.lt_inspection_hours = part_tool_cost.Number_of_Inspection_time
        tool_cost_row.lt_inspection_cost = lt_inspection_cost
        tool_cost_row.trimming_inspection_hours = matched_volume.trimming_inspection_hours
        tool_cost_row.trimming_inspection_cost = trimming_cost
        tool_cost_row.cost_fabrication_cfc_tubes = cost_fab_cfc
        tool_cost_row.cost_bonding_riveting = cost_bond_rivet
        tool_cost_row.total_tool_cost = total_tool_cost

        # ---- CompositePartToolFinalCost
        # final_cost_row = db.query(CompositePartToolFinalCost).filter(
        #     CompositePartToolFinalCost.analysis_id == analysis_id
        # ).first()
        # if not final_cost_row:
        #     final_cost_row = CompositePartToolFinalCost(analysis_id=analysis_id)
        #     db.add(final_cost_row)

        final_cost_row.extra_composite_part_kg = Extra_composite_part
        final_cost_row.prepreg_cost = prepreg_cost
        final_cost_row.part_layup_man_hours = matched_part_layup.layup_man_hours
        final_cost_row.part_layup_cost = part_layup_cost
        final_cost_row.consumable_cost = consumable_cost
        final_cost_row.autoclave_curing_cost = autoclave_cost
        final_cost_row.trimming_inspection_cost = trimming_inspection_cost
        final_cost_row.ndt_cost = ndt_cost
        final_cost_row.total_part_cost = total_part_cost
        final_cost_row.total_tool_cost = total_tool_and_part
        final_cost_row.import_and_export_cost = import_export
        final_cost_row.contingency_cost = contingency
        final_cost_row.gst_cost = gst
        final_cost_row.total_cost = total_cost
        final_cost_row.total_cost_per_unit=total_cost_per_unit


        # =================================================
        # COMMIT ONCE
        # =================================================
        db.commit()

        # =================================================
        # RESPONSE
        # =================================================
        return {
            "analysis_id": analysis_id,
            "stock_override_mm": data.dict(),
            "tool_volume_m3": tool_volume,
            "tool_stock_weight_kg": tool_stock_weight,
            "total_master_tool_cost": total_master_tool_cost,
            "total_tool_cost": total_tool_cost,
            "total_part_cost": total_part_cost,
            "total_tool_and_part_cost": total_tool_and_part,
            "total_cost_per_unit": total_cost_per_unit,
            "total_cost":total_cost,
            "quantity":final_cost_row.quantity,
            "status": "updated_successfully"
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))





@router.get("/composites/analysis/{analysis_id}/download-draco-glb")
def download_composites_draco_glb(
    analysis_id: int,
    db: Session = Depends(get_db)
):
    """
    Download the Draco-compressed GLB file stored in composites_stepfile_details
    for a given analysis_id.
    """

    # Fetch only the draco_glb_file column
    draco_glb_data = db.query(
        CompositeStepfileDetails.draco_glb_file
    ).filter(
        CompositeStepfileDetails.analysis_id == analysis_id
    ).scalar()

    if not draco_glb_data:
        raise HTTPException(
            status_code=404,
            detail="No Draco GLB data found for this analysis_id."
        )

    # Convert binary to stream
    draco_glb_stream = io.BytesIO(draco_glb_data)

    return StreamingResponse(
        draco_glb_stream,
        media_type="model/gltf-binary",
        headers={
            "Content-Disposition": f"attachment; filename=composites_draco_{analysis_id}.glb"
        }
    )


@router.get("/composites/correction-factors/")
def get_all_composite_correction_factors(
    db: Session = Depends(get_db)
):
    rows = db.query(CompositeCorrectionFactor).order_by(
        CompositeCorrectionFactor.created_at.desc()
    ).all()

    if not rows:
        raise HTTPException(
            status_code=404,
            detail="No correction factors found"
        )

    return [
        {
            "id": row.id,
            "correction": row.correction,
            "created_at": row.created_at
        }
        for row in rows
    ]




@router.put("/composites/correction-factor/update/")
def update_composite_correction_factor(
    correction: float = Form(...),
    db: Session = Depends(get_db)
):
    # -------------------------------------------------
    # 1. Fetch existing row (single-row table)
    # -------------------------------------------------
    row = db.query(CompositeCorrectionFactor).first()

    if not row:
        raise HTTPException(
            status_code=404,
            detail="Composite correction factor not found"
        )

    # -------------------------------------------------
    # 2. Update value (in-memory)
    # -------------------------------------------------
    row.correction = correction

    # -------------------------------------------------
    # 3. Commit & refresh
    # -------------------------------------------------
    db.commit()
    db.refresh(row)

    # -------------------------------------------------
    # 4. Response
    # -------------------------------------------------
    return {
        "message": "Composite correction factor updated successfully",
        "id": row.id,
        "correction": row.correction,
        "created_at": row.created_at
    }



@router.post("/composites/analysis/{analysis_id}/quantity/")
def update_quantity_and_total_cost(
    analysis_id: int,
    payload: QuantityUpdateRequest,
    db: Session = Depends(get_db)
):
    # -----------------------------------------
    # Fetch final cost row
    # -----------------------------------------
    final_cost = db.query(CompositePartToolFinalCost).filter(
        CompositePartToolFinalCost.analysis_id == analysis_id
    ).first()

    if not final_cost:
        raise HTTPException(
            status_code=404,
            detail="Final cost not found. Please calculate raw cost first."
        )

    if payload.quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than zero"
        )

    # -----------------------------------------
    # Update quantity & total cost
    # -----------------------------------------
    final_cost.quantity = payload.quantity
    final_cost.total_cost = final_cost.total_cost_per_unit * payload.quantity

    db.commit()
    db.refresh(final_cost)

    # -----------------------------------------
    # Fetch analysis for response completeness
    # -----------------------------------------
    analysis = db.query(CompositeAnalysisResult).filter(
        CompositeAnalysisResult.id == analysis_id
    ).first()

    # -----------------------------------------
    # Return same structure as raw endpoint
    # -----------------------------------------
    return {
        "analysis_id": analysis_id,
        "quantity": final_cost.quantity,

        # -------------------------
        # PART COST DETAILS
        # -------------------------
        "extra_composite_part_kg": final_cost.extra_composite_part_kg,
        "prepreg_cost": final_cost.prepreg_cost,

        "part_layup_man_hours": final_cost.part_layup_man_hours,
        "part_layup_cost": final_cost.part_layup_cost,

        "consumable_cost": final_cost.consumable_cost,

        "autoclave_curing_cost": final_cost.autoclave_curing_cost,
        "trimming_inspection_cost": final_cost.trimming_inspection_cost,
        "ndt_cost": final_cost.ndt_cost,

        "total_part_cost": final_cost.total_part_cost,

        # -------------------------
        # TOOL COST
        # -------------------------
        "total_tool_cost": final_cost.total_tool_cost,

        # -------------------------
        # ADDERS
        # -------------------------
        "import_and_export_cost": final_cost.import_and_export_cost,
        "contingency_cost": final_cost.contingency_cost,
        "gst_cost": final_cost.gst_cost,

        # -------------------------
        # FINAL
        # -------------------------
        "total_cost_per_unit": final_cost.total_cost_per_unit,
        "total_cost": final_cost.total_cost,

        "created_at": final_cost.created_at
    }


@router.get("/composites/analysis-results/")
def get_all_composite_analysis_results(db: Session = Depends(get_db)):
    """
    Fetch all rows from CompositeAnalysisResult table along with 
    all values from CompositePartToolFinalCost using foreign key relationship
    """
    # =================================================
    # 1. Fetch all analysis results
    # =================================================
    analysis_results = db.query(CompositeAnalysisResult).all()

    if not analysis_results:
        return {
            "count": 0,
            "data": []
        }

    # =================================================
    # 2. Build response with related data
    # =================================================
    results_data = []
    
    for analysis in analysis_results:
        # Fetch related final cost data using foreign key
        final_cost = db.query(CompositePartToolFinalCost).filter(
            CompositePartToolFinalCost.analysis_id == analysis.id
        ).first()

        # Build the analysis result object
        analysis_data = {
            # -------------------------
            # ANALYSIS RESULT FIELDS
            # -------------------------
            "id": analysis.id,
            "filename": analysis.filename,
            
            "prepreg_material_id": analysis.prepreg_material_id,
            "material": analysis.material,
            "spec": analysis.spec,
            
            "density_kg_m3": analysis.density_kg_m3,
            "design_thickness_mm": analysis.design_thickness_mm,
            "prepreg_cost_per_kg": analysis.prepreg_cost_per_kg,
            
            "stock_length_mm": analysis.stock_length_mm,
            "stock_width_mm": analysis.stock_width_mm,
            "stock_height_mm": analysis.stock_height_mm,
            
            "geometric_thickness_mm": analysis.geometric_thickness_mm,
            "one_ply_surface_area_m2": analysis.one_ply_surface_area_m2,
            
            "number_of_layers": analysis.number_of_layers,
            "total_surface_area_m2": analysis.total_surface_area_m2,
            
            "volume_of_part_m3": analysis.volume_of_part_m3,
            "mass_in_kg": analysis.mass_in_kg,
            
            "volume_of_composite_tool_in_m3": analysis.volume_of_composite_tool_in_m3,
            "tool_stock_weight_kg": analysis.tool_stock_weight_kg,
            
            "created_at": analysis.created_at,
            
            # -------------------------
            # FINAL COST DATA (if exists)
            # -------------------------
            "final_cost": None
        }

        # Add final cost data if it exists
        if final_cost:
            analysis_data["final_cost"] = {
                "id": final_cost.id,
                "analysis_id": final_cost.analysis_id,
                
                # PART COST DETAILS
                "extra_composite_part_kg": final_cost.extra_composite_part_kg,
                "prepreg_cost": final_cost.prepreg_cost,
                
                "part_layup_man_hours": final_cost.part_layup_man_hours,
                "part_layup_cost": final_cost.part_layup_cost,
                
                "consumable_cost": final_cost.consumable_cost,
                
                "autoclave_curing_cost": final_cost.autoclave_curing_cost,
                "trimming_inspection_cost": final_cost.trimming_inspection_cost,
                "ndt_cost": final_cost.ndt_cost,
                
                "total_part_cost": final_cost.total_part_cost,
                
                # TOOL COST
                "total_tool_cost": final_cost.total_tool_cost,
                
                # ADDERS
                "import_and_export_cost": final_cost.import_and_export_cost,
                "contingency_cost": final_cost.contingency_cost,
                "gst_cost": final_cost.gst_cost,
                
                # FINAL
                "total_cost": final_cost.total_cost,
                "quantity": final_cost.quantity,
                "total_cost_per_unit": final_cost.total_cost_per_unit,
                
                "created_at": final_cost.created_at
            }

        results_data.append(analysis_data)

    return {
        "count": len(results_data),
        "data": results_data
    }


@router.get("/composites/analysis/{analysis_id}/complete-data/")
def get_complete_analysis_data_by_id(
    analysis_id: int,
    db: Session = Depends(get_db)
):
    """
    Fetch all data related to a specific analysis_id from all related tables:
    - CompositeAnalysisResult
    - CompositeMasterModelCost
    - CompositeToolCost
    - CompositePartToolFinalCost
    """
    # =================================================
    # 1. Fetch main analysis result
    # =================================================
    analysis = db.query(CompositeAnalysisResult).filter(
        CompositeAnalysisResult.id == analysis_id
    ).first()

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail=f"Analysis result with id={analysis_id} not found"
        )

    # =================================================
    # 2. Fetch related data from all tables
    # =================================================
    master_model_cost = db.query(CompositeMasterModelCost).filter(
        CompositeMasterModelCost.analysis_id == analysis_id
    ).first()

    tool_cost = db.query(CompositeToolCost).filter(
        CompositeToolCost.analysis_id == analysis_id
    ).first()

    final_cost = db.query(CompositePartToolFinalCost).filter(
        CompositePartToolFinalCost.analysis_id == analysis_id
    ).first()

    # =================================================
    # 3. Build comprehensive response
    # =================================================
    response_data = {
        # -------------------------
        # MAIN ANALYSIS RESULT
        # -------------------------
        "analysis_result": {
            "id": analysis.id,
            "filename": analysis.filename,
            
            "prepreg_material_id": analysis.prepreg_material_id,
            "material": analysis.material,
            "spec": analysis.spec,
            
            "density_kg_m3": analysis.density_kg_m3,
            "design_thickness_mm": analysis.design_thickness_mm,
            "prepreg_cost_per_kg": analysis.prepreg_cost_per_kg,
            
            "stock_length_mm": analysis.stock_length_mm,
            "stock_width_mm": analysis.stock_width_mm,
            "stock_height_mm": analysis.stock_height_mm,
            
            "geometric_thickness_mm": analysis.geometric_thickness_mm,
            "one_ply_surface_area_m2": analysis.one_ply_surface_area_m2,
            
            "number_of_layers": analysis.number_of_layers,
            "total_surface_area_m2": analysis.total_surface_area_m2,
            
            "volume_of_part_m3": analysis.volume_of_part_m3,
            "mass_in_kg": analysis.mass_in_kg,
            
            "volume_of_composite_tool_in_m3": analysis.volume_of_composite_tool_in_m3,
            "tool_stock_weight_kg": analysis.tool_stock_weight_kg,
            
            "created_at": analysis.created_at
        },

        # -------------------------
        # MASTER MODEL COST (if exists)
        # -------------------------
        "master_model_cost": None,

        # -------------------------
        # TOOL COST (if exists)
        # -------------------------
        "tool_cost": None,

        # -------------------------
        # FINAL COST (if exists)
        # -------------------------
        "final_cost": None
    }

    # Add master model cost data if it exists
    if master_model_cost:
        response_data["master_model_cost"] = {
            "id": master_model_cost.id,
            "analysis_id": master_model_cost.analysis_id,
            
            # Hours
            "design_hours": master_model_cost.design_hours,
            "machining_hours": master_model_cost.machining_hours,
            "assembly_hours": master_model_cost.assembly_hours,
            "finishing_hours": master_model_cost.finishing_hours,
            "inspection_hours": master_model_cost.inspection_hours,
            
            # Costs
            "design_cost": master_model_cost.design_cost,
            "frame_fabrication_cost": master_model_cost.frame_fabrication_cost,
            "epoxy_block_bonding_cost": master_model_cost.epoxy_block_bonding_cost,
            "machining_cost": master_model_cost.machining_cost,
            "assembly_cost": master_model_cost.assembly_cost,
            "finishing_cost": master_model_cost.finishing_cost,
            "inspection_cost": master_model_cost.inspection_cost,
            
            "total_master_model_cost": master_model_cost.total_master_model_cost,
            
            "created_at": master_model_cost.created_at
        }

    # Add tool cost data if it exists
    if tool_cost:
        response_data["tool_cost"] = {
            "id": tool_cost.id,
            "analysis_id": tool_cost.analysis_id,
            
            # Geometry / Surface Calculations
            "increased_thickness_tool_mm": tool_cost.increased_thickness_tool_mm,
            "total_surface_area_m2": tool_cost.total_surface_area_m2,
            "increased_surface_area_m2": tool_cost.increased_surface_area_m2,
            
            # Material Cost
            "cost_dry_carbon_fabric": tool_cost.cost_dry_carbon_fabric,
            
            # Layup
            "layup_man_hours": tool_cost.layup_man_hours,
            "layup_cost": tool_cost.layup_cost,
            
            # Oven Curing
            "curing_hours": tool_cost.curing_hours,
            "oven_curing_cost": tool_cost.oven_curing_cost,
            
            # LT Inspection
            "lt_inspection_hours": tool_cost.lt_inspection_hours,
            "lt_inspection_cost": tool_cost.lt_inspection_cost,
            
            # Trimming & Inspection
            "trimming_inspection_hours": tool_cost.trimming_inspection_hours,
            "trimming_inspection_cost": tool_cost.trimming_inspection_cost,
            
            # Sub-Structure Cost
            "cost_fabrication_cfc_tubes": tool_cost.cost_fabrication_cfc_tubes,
            "cost_bonding_riveting": tool_cost.cost_bonding_riveting,
            
            "total_tool_cost": tool_cost.total_tool_cost,
            
            "created_at": tool_cost.created_at
        }

    # Add final cost data if it exists
    if final_cost:
        response_data["final_cost"] = {
            "id": final_cost.id,
            "analysis_id": final_cost.analysis_id,
            
            # PART COST DETAILS
            "extra_composite_part_kg": final_cost.extra_composite_part_kg,
            "prepreg_cost": final_cost.prepreg_cost,
            
            "part_layup_man_hours": final_cost.part_layup_man_hours,
            "part_layup_cost": final_cost.part_layup_cost,
            
            "consumable_cost": final_cost.consumable_cost,
            
            "autoclave_curing_cost": final_cost.autoclave_curing_cost,
            "trimming_inspection_cost": final_cost.trimming_inspection_cost,
            "ndt_cost": final_cost.ndt_cost,
            
            "total_part_cost": final_cost.total_part_cost,
            
            # TOOL COST (FETCHED)
            "total_tool_cost": final_cost.total_tool_cost,
            
            # ADDERS
            "import_and_export_cost": final_cost.import_and_export_cost,
            "contingency_cost": final_cost.contingency_cost,
            "gst_cost": final_cost.gst_cost,
            
            # FINAL
            "total_cost": final_cost.total_cost,
            "quantity": final_cost.quantity,
            "total_cost_per_unit": final_cost.total_cost_per_unit,
            
            "created_at": final_cost.created_at
        }

    return response_data


@router.put("/composites/analysis/{analysis_id}/update-geometry/")
def update_composite_geometry_and_recalculate(
    analysis_id: int,
    geometric_thickness_mm: float = Form(...),
    one_ply_surface_area_m2: float = Form(...),
    db: Session = Depends(get_db)
):
    """
    Update geometric values and recalculate all costs for a composite analysis.
    This endpoint combines the logic from all 4 existing endpoints:
    1. analyze_step_with_prepreg (geometry calculations)
    2. get_master_tool_hours_by_analysis_id (master model cost)
    3. get_composite_analysis_details (tool cost)
    4. get_composite_analysis_raw_details (part fabrication cost)
    """
    # =================================================
    # 1. Fetch existing analysis result
    # =================================================
    analysis = db.query(CompositeAnalysisResult).filter(
        CompositeAnalysisResult.id == analysis_id
    ).first()

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail=f"Analysis result with id={analysis_id} not found"
        )

    # =================================================
    # 2. Fetch prepreg material from DB
    # =================================================
    prepreg = db.query(CompositesPrepregCost).filter(
        CompositesPrepregCost.id == analysis.prepreg_material_id
    ).first()

    if not prepreg:
        raise HTTPException(
            status_code=404,
            detail=f"Prepreg material with id={analysis.prepreg_material_id} not found"
        )

    # =================================================
    # 3. Update geometric calculations with new values
    # =================================================
    # Use the new geometric values provided
    new_geometric_thickness_mm = geometric_thickness_mm
    new_one_ply_surface_area_m2 = one_ply_surface_area_m2

    # Recalculate derived values
    new_number_of_layers = new_geometric_thickness_mm / prepreg.thickness_mm
    new_total_surface_area_m2 = new_number_of_layers * new_one_ply_surface_area_m2
    new_volume_of_part_m3 = (new_geometric_thickness_mm * new_one_ply_surface_area_m2) / 1000
    new_mass_in_kg = prepreg.density_kg_m3 * new_volume_of_part_m3

    # Stock dimensions remain the same (from original analysis)
    new_volume_of_composite_tool_in_m3 = (
        analysis.stock_length_mm * analysis.stock_width_mm * analysis.stock_height_mm
    ) / 1000000000

    # =================================================
    # 4. Update CompositeAnalysisResult table
    # =================================================
    analysis.geometric_thickness_mm = float(new_geometric_thickness_mm)
    analysis.one_ply_surface_area_m2 = float(new_one_ply_surface_area_m2)
    analysis.number_of_layers = float(new_number_of_layers)
    analysis.total_surface_area_m2 = float(new_total_surface_area_m2)
    analysis.volume_of_part_m3 = float(new_volume_of_part_m3)
    analysis.mass_in_kg = float(new_mass_in_kg)
    analysis.volume_of_composite_tool_in_m3 = float(new_volume_of_composite_tool_in_m3)

    db.commit()
    db.refresh(analysis)

    # =================================================
    # 5. Recalculate Master Model Cost (from endpoint 2)
    # =================================================
    tool_volume = analysis.volume_of_composite_tool_in_m3

    # Fetch master tool hour rows
    rows = db.query(MasterToolHourTable).all()
    if not rows:
        raise HTTPException(
            status_code=404,
            detail="Master tool hour table is empty"
        )

    # Match volume with range
    matched_row = None
    for row in rows:
        try:
            low, high = map(float, row.volume_range_m3.split("-"))
            if low <= tool_volume <= high:
                matched_row = row
                break
        except ValueError:
            continue

    if not matched_row:
        raise HTTPException(
            status_code=400,
            detail=f"No matching volume range found for volume {tool_volume:.3f} m3"
        )

    master_tool = db.query(MasterToolCost).first()
    if not master_tool:
        raise HTTPException(
            status_code=404,
            detail="Master tool cost table is empty"
        )

    # Calculate master model costs
    Design_cost = master_tool.design_cost_per_hr * matched_row.design_hours
    frame_fabrication_cost = analysis.volume_of_composite_tool_in_m3 * master_tool.frame_fabrication_cost
    EPOXY_BLOCK_Bonding_cost = (
        analysis.volume_of_composite_tool_in_m3 * master_tool.epoxy_block_material_cost
    ) + master_tool.epoxy_block_bonding_cost
    Machining_cost = master_tool.machining_cost_per_hr * matched_row.machining_hours
    Assembly_cost = master_tool.assembly_cost_per_hr * matched_row.assembly_hours
    finishing_cost = master_tool.finishing_cost_per_hr * matched_row.finishing_hours
    Inspection_cost = master_tool.inspection_cost_per_hr * matched_row.inspection_hours

    correction_row = db.query(CompositeCorrectionFactor1).first()
    if not correction_row:
        raise HTTPException(
            status_code=404,
            detail="Correction factor not found"
        )

    correction_factor_1 = correction_row.correction
    Total_master_model_cost = (
        Design_cost + frame_fabrication_cost + EPOXY_BLOCK_Bonding_cost + 
        Machining_cost + Assembly_cost + finishing_cost + Inspection_cost
    ) * correction_factor_1

    # Update or create master model cost record
    existing_master_model = db.query(CompositeMasterModelCost).filter(
        CompositeMasterModelCost.analysis_id == analysis_id
    ).first()

    if existing_master_model:
        # Update existing record
        existing_master_model.design_hours = matched_row.design_hours
        existing_master_model.machining_hours = matched_row.machining_hours
        existing_master_model.assembly_hours = matched_row.assembly_hours
        existing_master_model.finishing_hours = matched_row.finishing_hours
        existing_master_model.inspection_hours = matched_row.inspection_hours

        existing_master_model.design_cost = Design_cost
        existing_master_model.frame_fabrication_cost = frame_fabrication_cost
        existing_master_model.epoxy_block_bonding_cost = EPOXY_BLOCK_Bonding_cost
        existing_master_model.machining_cost = Machining_cost
        existing_master_model.assembly_cost = Assembly_cost
        existing_master_model.finishing_cost = finishing_cost
        existing_master_model.inspection_cost = Inspection_cost
        existing_master_model.total_master_model_cost = Total_master_model_cost
    else:
        # Create new record
        master_model_record = CompositeMasterModelCost(
            analysis_id=analysis_id,
            design_hours=matched_row.design_hours,
            machining_hours=matched_row.machining_hours,
            assembly_hours=matched_row.assembly_hours,
            finishing_hours=matched_row.finishing_hours,
            inspection_hours=matched_row.inspection_hours,
            design_cost=Design_cost,
            frame_fabrication_cost=frame_fabrication_cost,
            epoxy_block_bonding_cost=EPOXY_BLOCK_Bonding_cost,
            machining_cost=Machining_cost,
            assembly_cost=Assembly_cost,
            finishing_cost=finishing_cost,
            inspection_cost=Inspection_cost,
            total_master_model_cost=Total_master_model_cost
        )
        db.add(master_model_record)

    db.commit()

    # =================================================
    # 6. Recalculate Tool Cost (from endpoint 3)
    # =================================================
    part_tool_cost = db.query(CompositesPartToolCost).first()
    if not part_tool_cost:
        raise HTTPException(
            status_code=404,
            detail="Composites part tool cost table is empty"
        )

    Increased_thickness_tool = part_tool_cost.added_thickness_mm + new_geometric_thickness_mm
    Total_surface_area = (Increased_thickness_tool / analysis.design_thickness_mm) * new_one_ply_surface_area_m2
    Increased_surface_area = Total_surface_area * ((100 + part_tool_cost.Percentage_of_surface_area_to_be_increased) / 100)
    COST_DRYCARBON_FABRIC = Increased_surface_area * part_tool_cost.COST_OF_DRY_CARBON_FABRIC

    # Match layup hours
    layup_rows = db.query(PartToolLayupHourTable).all()
    if not layup_rows:
        raise HTTPException(
            status_code=404,
            detail="Part tool layup hour table is empty"
        )

    matched_layup_row = None
    for row in layup_rows:
        try:
            low, high = map(float, row.surface_area_range.split("-"))
            if low <= Increased_surface_area <= high:
                matched_layup_row = row
                break
        except ValueError:
            continue

    if not matched_layup_row:
        raise HTTPException(
            status_code=400,
            detail=f"No matching surface area range found for {Increased_surface_area:.2f} m2"
        )

    number_of_manhrs = matched_layup_row.layup_man_hours
    layup_cost = number_of_manhrs * part_tool_cost.LAYUP_COST

    # Match volume for curing and trimming
    volume_rows = db.query(PartToolHourTable).all()
    if not volume_rows:
        raise HTTPException(
            status_code=404,
            detail="Part tool hour table is empty"
        )

    matched_volume_row = None
    for row in volume_rows:
        try:
            low, high = map(float, row.volume_range_m3.split("-"))
            if low <= tool_volume <= high:
                matched_volume_row = row
                break
        except ValueError:
            continue

    if not matched_volume_row:
        raise HTTPException(
            status_code=400,
            detail=f"No matching volume range found for tool volume {tool_volume:.3f} m3"
        )

    correction_row_2 = db.query(CompositeCorrectionFactor2).first()
    if not correction_row_2:
        raise HTTPException(
            status_code=404,
            detail="Correction factor not found"
        )

    correction_factor_2 = correction_row_2.correction

    curing_hours = matched_volume_row.curing_hours
    trimming_inspection_hours = matched_volume_row.trimming_inspection_hours

    oven_curing_cost = curing_hours * part_tool_cost.OVEN_CURING_COST
    Lt_inspection_cost = part_tool_cost.Number_of_Inspection_time * part_tool_cost.LT_INSPECTION_COST
    Trimming_inspection = trimming_inspection_hours * part_tool_cost.TRIMMING_INSPECTION
    cost_fabrication_CFC_tubes = Total_surface_area * part_tool_cost.COST_FOR_FABRICATION_CFC_TUBES
    cost_bonding_reviting = Total_surface_area * part_tool_cost.COST_FOR_BONDING_AND_RIVETING

    Total_tool_cost = (
        COST_DRYCARBON_FABRIC + layup_cost + oven_curing_cost + Lt_inspection_cost + 
        Trimming_inspection + cost_fabrication_CFC_tubes + cost_bonding_reviting
    ) * correction_factor_2

    # Update or create tool cost record
    existing_tool_cost = db.query(CompositeToolCost).filter(
        CompositeToolCost.analysis_id == analysis_id
    ).first()

    if existing_tool_cost:
        # Update existing record
        existing_tool_cost.increased_thickness_tool_mm = Increased_thickness_tool
        existing_tool_cost.total_surface_area_m2 = Total_surface_area
        existing_tool_cost.increased_surface_area_m2 = Increased_surface_area
        existing_tool_cost.cost_dry_carbon_fabric = COST_DRYCARBON_FABRIC
        existing_tool_cost.layup_man_hours = number_of_manhrs
        existing_tool_cost.layup_cost = layup_cost
        existing_tool_cost.curing_hours = curing_hours
        existing_tool_cost.oven_curing_cost = oven_curing_cost
        existing_tool_cost.lt_inspection_hours = part_tool_cost.Number_of_Inspection_time
        existing_tool_cost.lt_inspection_cost = Lt_inspection_cost
        existing_tool_cost.trimming_inspection_hours = trimming_inspection_hours
        existing_tool_cost.trimming_inspection_cost = Trimming_inspection
        existing_tool_cost.cost_fabrication_cfc_tubes = cost_fabrication_CFC_tubes
        existing_tool_cost.cost_bonding_riveting = cost_bonding_reviting
        existing_tool_cost.total_tool_cost = Total_tool_cost
    else:
        # Create new record
        tool_cost_record = CompositeToolCost(
            analysis_id=analysis_id,
            increased_thickness_tool_mm=Increased_thickness_tool,
            total_surface_area_m2=Total_surface_area,
            increased_surface_area_m2=Increased_surface_area,
            cost_dry_carbon_fabric=COST_DRYCARBON_FABRIC,
            layup_man_hours=number_of_manhrs,
            layup_cost=layup_cost,
            curing_hours=curing_hours,
            oven_curing_cost=oven_curing_cost,
            lt_inspection_hours=part_tool_cost.Number_of_Inspection_time,
            lt_inspection_cost=Lt_inspection_cost,
            trimming_inspection_hours=trimming_inspection_hours,
            trimming_inspection_cost=Trimming_inspection,
            cost_fabrication_cfc_tubes=cost_fabrication_CFC_tubes,
            cost_bonding_riveting=cost_bonding_reviting,
            total_tool_cost=Total_tool_cost
        )
        db.add(tool_cost_record)

    db.commit()

    # =================================================
    # 7. Recalculate Part Fabrication Cost (from endpoint 4)
    # =================================================
    part_fabrication_cost = db.query(CompositesPartFabricationCost).first()
    if not part_fabrication_cost:
        raise HTTPException(
            status_code=404,
            detail="part_fabrication_cost table is empty"
        )

    # Match fabrication layup hours
    fabrication_layup_rows = db.query(PartFabricationLayupHourTable).all()
    if not fabrication_layup_rows:
        raise HTTPException(
            status_code=404,
            detail="Part fabrication layup hour table is empty"
        )

    matched_fabrication_layup_row = None
    part_surface_area = new_total_surface_area_m2

    for row in fabrication_layup_rows:
        try:
            low, high = map(float, row.surface_area_range.split("-"))
            if low <= part_surface_area <= high:
                matched_fabrication_layup_row = row
                break
        except ValueError:
            continue

    if not matched_fabrication_layup_row:
        raise HTTPException(
            status_code=400,
            detail=f"No matching fabrication layup range found for surface area {part_surface_area:.2f} m2"
        )

    part_layup_man_hours = matched_fabrication_layup_row.layup_man_hours
    Extra_composite_part = new_mass_in_kg * ((100 + part_fabrication_cost.extra_prepreg_weight_percent) / 100)
    preprag_cost = Extra_composite_part * analysis.prepreg_cost_per_kg
    part_layup_cost = part_layup_man_hours * part_fabrication_cost.layup_cost_per_hr
    consumable_cost = (preprag_cost * part_fabrication_cost.consumable_cost_percent) / 100

    # Match fabrication hours
    fabrication_hour_rows = db.query(PartFabricationHourTable).all()
    if not fabrication_hour_rows:
        raise HTTPException(
            status_code=404,
            detail="Part fabrication hour table is empty"
        )

    matched_fabrication_hour_row = None
    part_volume = analysis.volume_of_composite_tool_in_m3

    for row in fabrication_hour_rows:
        try:
            low, high = map(float, row.volume_range_m3.split("-"))
            if low <= part_volume <= high:
                matched_fabrication_hour_row = row
                break
        except ValueError:
            continue

    if not matched_fabrication_hour_row:
        raise HTTPException(
            status_code=400,
            detail=f"No matching fabrication volume range found for volume {part_volume:.3f} m3"
        )

    correction_row_3 = db.query(CompositeCorrectionFactor3).first()
    if not correction_row:
        raise HTTPException(
            status_code=404,
            detail="Correction factor not found"
        )

    correction_factor_3 = correction_row_3.correction

    curing_hours = matched_fabrication_hour_row.curing_hours
    trimming_inspection_hours = matched_fabrication_hour_row.trimming_inspection_hours
    ndts_hours = matched_fabrication_hour_row.ndts_hours

    autoclave_curing_cost = curing_hours * part_fabrication_cost.autoclave_curing_cost_per_hr
    trimming_inspection_cost = trimming_inspection_hours * part_fabrication_cost.trimming_inspection_cost_per_hr
    NDT_cost = ndts_hours * part_fabrication_cost.ndts_cost_per_hr

    Total_part_cost = (preprag_cost + part_layup_cost + consumable_cost + autoclave_curing_cost + trimming_inspection_cost + NDT_cost) * correction_factor_3
    Total_tool_and_part_cost = Total_part_cost + Total_tool_cost
    import_and_export_cost = Total_tool_and_part_cost * 0.05
    contigency_cost = Total_tool_and_part_cost * 0.1
    GST = Total_tool_and_part_cost * 0.18
    
    # Fetch quantity from existing final cost record or use default
    quantity = 1
    existing_final_cost_for_quantity = db.query(CompositePartToolFinalCost).filter(
        CompositePartToolFinalCost.analysis_id == analysis_id
    ).first()
    
    if existing_final_cost_for_quantity and existing_final_cost_for_quantity.quantity:
        quantity = existing_final_cost_for_quantity.quantity
    
    total_cost_per_unit = (Total_tool_and_part_cost + import_and_export_cost + contigency_cost + GST) 
    Total_cost = total_cost_per_unit * quantity

    # Update or create final cost record
    existing_final_cost = db.query(CompositePartToolFinalCost).filter(
        CompositePartToolFinalCost.analysis_id == analysis_id
    ).first()

    if existing_final_cost:
        # Update existing record
        existing_final_cost.extra_composite_part_kg = Extra_composite_part
        existing_final_cost.prepreg_cost = preprag_cost
        existing_final_cost.part_layup_man_hours = part_layup_man_hours
        existing_final_cost.part_layup_cost = part_layup_cost
        existing_final_cost.consumable_cost = consumable_cost
        existing_final_cost.autoclave_curing_cost = autoclave_curing_cost
        existing_final_cost.trimming_inspection_cost = trimming_inspection_cost
        existing_final_cost.ndt_cost = NDT_cost
        existing_final_cost.total_part_cost = Total_part_cost
        existing_final_cost.total_tool_cost = Total_tool_cost
        existing_final_cost.import_and_export_cost = import_and_export_cost
        existing_final_cost.contingency_cost = contigency_cost
        existing_final_cost.gst_cost = GST
        existing_final_cost.total_cost_per_unit = total_cost_per_unit
        existing_final_cost.total_cost = Total_cost
        existing_final_cost.quantity = quantity
    else:
        # Create new record
        final_cost_record = CompositePartToolFinalCost(
            analysis_id=analysis_id,
            extra_composite_part_kg=Extra_composite_part,
            prepreg_cost=preprag_cost,
            part_layup_man_hours=part_layup_man_hours,
            part_layup_cost=part_layup_cost,
            consumable_cost=consumable_cost,
            autoclave_curing_cost=autoclave_curing_cost,
            trimming_inspection_cost=trimming_inspection_cost,
            ndt_cost=NDT_cost,
            total_part_cost=Total_part_cost,
            total_tool_cost=Total_tool_cost,
            import_and_export_cost=import_and_export_cost,
            contingency_cost=contigency_cost,
            gst_cost=GST,
            total_cost_per_unit=total_cost_per_unit,
            total_cost=Total_cost,
            quantity=quantity
        )
        db.add(final_cost_record)

    db.commit()

    # =================================================
    # 8. Return success response
    # =================================================
    return {
        "message": "Geometry updated and all costs recalculated successfully",
        "analysis_id": analysis_id,
        "updated_values": {
            "geometric_thickness_mm": new_geometric_thickness_mm,
            "one_ply_surface_area_m2": new_one_ply_surface_area_m2,
            "number_of_layers": new_number_of_layers,
            "total_surface_area_m2": new_total_surface_area_m2,
            "volume_of_part_m3": new_volume_of_part_m3,
            "mass_in_kg": new_mass_in_kg
        },
        "calculated_costs": {
            "total_master_model_cost": Total_master_model_cost,
            "total_tool_cost": Total_tool_cost,
            "total_part_cost": Total_part_cost,
            "total_cost": Total_cost
        }
    }


@router.get("/composites/master-tool-correction-factor/")
def get_master_tool_correction_factors(db: Session = Depends(get_db)):
    rows = db.query(CompositeCorrectionFactor1).all()
    return [
        {
            "id": row.id,
            "correction": row.correction,
            "created_at": row.created_at,
        }
        for row in rows
    ]


@router.get("/composites/part-tool-correction-factor/")
def get_part_tool_correction_factors(db: Session = Depends(get_db)):
    rows = db.query(CompositeCorrectionFactor2).all()
    return [
        {
            "id": row.id,
            "correction": row.correction,
            "created_at": row.created_at,
        }
        for row in rows
    ]


@router.get("/composites/part-fabrication-correction-factor/")
def get_part_fabrication_correction_factors(db: Session = Depends(get_db)):
    rows = db.query(CompositeCorrectionFactor3).all()
    return [
        {
            "id": row.id,
            "correction": row.correction,
            "created_at": row.created_at,
        }
        for row in rows
    ]


@router.put("/composites/master-tool-correction-factor/update/")
def update_master_tool_correction_factor(
    correction: float = Form(...),
    db: Session = Depends(get_db)
):
    row = db.query(CompositeCorrectionFactor1).first()

    if not row:
        raise HTTPException(
            status_code=404,
            detail="Composite master tool correction factor not found"
        )

    row.correction = correction

    db.commit()
    db.refresh(row)

    return {
        "message": "Composite master tool correction factor updated successfully",
        "id": row.id,
        "correction": row.correction,
        "created_at": row.created_at
    }


@router.put("/composites/part-tool-correction-factor/update/")
def update_part_tool_correction_factor(
    correction: float = Form(...),
    db: Session = Depends(get_db)
):
    row = db.query(CompositeCorrectionFactor2).first()

    if not row:
        raise HTTPException(
            status_code=404,
            detail="Composite part tool correction factor not found"
        )

    row.correction = correction

    db.commit()
    db.refresh(row)

    return {
        "message": "Composite part tool correction factor updated successfully",
        "id": row.id,
        "correction": row.correction,
        "created_at": row.created_at
    }


@router.put("/composites/part-fabrication-correction-factor/update/")
def update_part_fabrication_correction_factor(
    correction: float = Form(...),
    db: Session = Depends(get_db)
):
    row = db.query(CompositeCorrectionFactor3).first()

    if not row:
        raise HTTPException(
            status_code=404,
            detail="Composite part fabrication correction factor not found"
        )

    row.correction = correction

    db.commit()
    db.refresh(row)

    return {
        "message": "Composite part fabrication correction factor updated successfully",
        "id": row.id,
        "correction": row.correction,
        "created_at": row.created_at
    }




@router.post("/analyze-iges-composites/")
async def analyze_iges_with_prepreg(
    file: UploadFile = File(...),
    material_id: int = Form(...),
    db: Session = Depends(get_db)
):
    import uuid, shutil, numpy as np
    from collections import defaultdict
    import cadquery as cq

    from OCP.IGESControl import IGESControl_Reader
    from OCP.TopExp import TopExp_Explorer
    from OCP.TopAbs import TopAbs_SOLID

    upload_dir = FilePath("uploads")
    upload_dir.mkdir(exist_ok=True)
    file_path = upload_dir / f"{uuid.uuid4()}_{file.filename}"

    try:
        # =================================================
        # 1. MATERIAL FETCH (SAME AS STEP)
        # =================================================
        prepreg = db.query(CompositesPrepregCost).filter(
            CompositesPrepregCost.id == material_id
        ).first()

        if not prepreg:
            raise HTTPException(
                status_code=404,
                detail=f"Prepreg material with id={material_id} not found"
            )

        # =================================================
        # 2. SAVE FILE
        # =================================================
        with file_path.open("wb") as f:
            shutil.copyfileobj(file.file, f)

        # =================================================
        # 3. LOAD IGES (ONLY CHANGE)
        # =================================================
        reader = IGESControl_Reader()
        status = reader.ReadFile(str(file_path))

        if status != 1:
            raise HTTPException(400, "Failed to read IGES")

        reader.TransferRoots()
        shape = reader.OneShape()

        explorer = TopExp_Explorer(shape, TopAbs_SOLID)
        solids = []
        while explorer.More():
            solids.append(explorer.Current())
            explorer.Next()

        if not solids:
            raise HTTPException(400, "No solid found")

        shape = solids[0]

        solid = cq.Shape(shape)

        # =================================================
        # 🔥 BOUNDING BOX (SAME AS YOUR WORKING IGES LOGIC)
        # =================================================
        bb = solid.BoundingBox()
        raw_dims = [
            round(bb.xlen, 2),
            round(bb.ylen, 2),
            round(bb.zlen, 2)
        ]

        faces = solid.Faces()

        if not faces:
            raise HTTPException(400, "No faces found")

        # =================================================
        # THICKNESS (UNCHANGED)
        # =================================================
        clusters = defaultdict(list)

        for f in faces:
            try:
                n = f.normalAt()
                v = np.array([n.x, n.y, n.z])
                v /= np.linalg.norm(v)
                key = tuple(np.round(v, 2))
                clusters[key].append(f)
            except:
                pass

        if len(clusters) < 2:
            raise HTTPException(400, "Unable to cluster shell faces")

        cluster_list = []
        for k, fs in clusters.items():
            area = sum(f.Area() for f in fs)
            cluster_list.append((k, fs, area))

        cluster_list.sort(key=lambda x: x[2], reverse=True)

        outer_key, outer_faces, _ = cluster_list[0]

        inner_faces = None
        for k, fs, _ in cluster_list[1:]:
            if np.dot(np.array(k), np.array(outer_key)) < -0.9:
                inner_faces = fs
                break

        if not inner_faces:
            raise HTTPException(400, "Inner shell not detected")

        n = np.array(outer_key)
        n /= np.linalg.norm(n)

        outer_proj = [
            np.dot([f.Center().x, f.Center().y, f.Center().z], n)
            for f in outer_faces
        ]

        inner_proj = [
            np.dot([f.Center().x, f.Center().y, f.Center().z], n)
            for f in inner_faces
        ]

        geometric_thickness_mm = round(abs(np.mean(outer_proj) - np.mean(inner_proj)), 3)

        # =================================================
        # SURFACE AREA (UNCHANGED)
        # =================================================
        face_centers = []
        face_data = []

        for face in faces:
            area_mm2 = face.Area()
            c = face.Center()
            center = np.array([c.x, c.y, c.z])

            n = face.normalAt()
            normal = np.array([n.x, n.y, n.z])
            normal /= np.linalg.norm(normal)

            face_centers.append(center)
            face_data.append((center, normal, area_mm2))

        part_center = np.mean(face_centers, axis=0)

        inner_area_mm2 = 0.0
        for center, normal, area in face_data:
            if np.dot(normal, center - part_center) < 0:
                inner_area_mm2 += area

        ply_area_m2 = round(inner_area_mm2 / 1e6, 3)

        # =================================================
        # DIMENSIONS
        # =================================================
        raw_dims_sorted = sorted(raw_dims, reverse=True)

        global_length = raw_dims_sorted[0]
        global_width = raw_dims_sorted[1]
        global_height = raw_dims_sorted[2]

        # =================================================
        # STOCK + CALCULATIONS (SAME)
        # =================================================
        stock_length = global_length + 100
        stock_width = global_width + 100
        stock_height = global_height

        number_of_layers = geometric_thickness_mm / prepreg.thickness_mm
        total_surface_area_m2 = number_of_layers * ply_area_m2
        volume_of_part_m3 = (geometric_thickness_mm * ply_area_m2) / 1000
        mass_in_kg = prepreg.density_kg_m3 * volume_of_part_m3
        volume_of_composite_tool_in_m3 = (stock_length * stock_width * stock_height) / 1e9

        master_tool = db.query(MasterToolCost).first()

        if not master_tool:
            raise HTTPException(404, "Master tool cost table is empty")

        Tool_Stock_weight_Kg = (
            master_tool.epoxy_block_density * volume_of_composite_tool_in_m3
        )

        # =================================================
        # 🔥 TYPE SAFETY (CRITICAL)
        # =================================================
        geometric_thickness_mm = float(geometric_thickness_mm)
        ply_area_m2 = float(ply_area_m2)
        number_of_layers = float(number_of_layers)
        total_surface_area_m2 = float(total_surface_area_m2)
        volume_of_part_m3 = float(volume_of_part_m3)
        mass_in_kg = float(mass_in_kg)
        volume_of_composite_tool_in_m3 = float(volume_of_composite_tool_in_m3)
        Tool_Stock_weight_Kg = float(Tool_Stock_weight_Kg)

        # =================================================
        # DB INSERT (IDENTICAL TO STEP)
        # =================================================
        analysis_row = CompositeAnalysisResult(
            filename=file.filename,
            prepreg_material_id=prepreg.id,
            material=prepreg.material,
            spec=prepreg.spec,
            density_kg_m3=float(prepreg.density_kg_m3),
            design_thickness_mm=float(prepreg.thickness_mm),
            prepreg_cost_per_kg=float(prepreg.prepreg_cost_per_kg),
            stock_length_mm=float(stock_length),
            stock_width_mm=float(stock_width),
            stock_height_mm=float(stock_height),
            geometric_thickness_mm=geometric_thickness_mm,
            one_ply_surface_area_m2=ply_area_m2,
            number_of_layers=number_of_layers,
            total_surface_area_m2=total_surface_area_m2,
            volume_of_part_m3=volume_of_part_m3,
            mass_in_kg=mass_in_kg,
            volume_of_composite_tool_in_m3=volume_of_composite_tool_in_m3,
            tool_stock_weight_kg=Tool_Stock_weight_Kg
        )

        db.add(analysis_row)
        db.commit()
        db.refresh(analysis_row)

        # =================================================
        # 🔥 RESPONSE (NOW MATCHES STEP ENDPOINT)
        # =================================================
        return {
            "filename": file.filename,

            "material": {
                "id": prepreg.id,
                "material": prepreg.material,
                "spec": prepreg.spec,
                "density_kg_m3": prepreg.density_kg_m3,
                "design_thickness_mm": prepreg.thickness_mm,
                "prepreg_cost_per_kg": prepreg.prepreg_cost_per_kg
            },

            "geometry": {
                "global_dimensions_mm": {
                    "length": global_length,
                    "width": global_width,
                    "height": global_height
                },
                "stock_dimensions_mm": {
                    "stock_length": stock_length,
                    "stock_width": stock_width,
                    "stock_height": stock_height
                },
                "geometric_thickness_mm": geometric_thickness_mm,
                "one_ply_surface_area_m2": ply_area_m2
            },

            "number_of_layers": number_of_layers,
            "total_surface_area_m2": total_surface_area_m2,
            "volume_of_part_m3": volume_of_part_m3,
            "mass_in_kg": mass_in_kg,
            "volume_of_composite_tool_in_m3": volume_of_composite_tool_in_m3,
            "Tool_Stock_weight_Kg": Tool_Stock_weight_Kg,
            "analysis_id": analysis_row.id
        }

    finally:
        file_path.unlink(missing_ok=True)