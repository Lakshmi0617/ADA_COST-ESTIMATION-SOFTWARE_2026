import base64
import io
import os
from datetime import datetime

from fastapi import APIRouter, UploadFile, File, HTTPException, Form, Depends, Body, Query
from starlette.responses import StreamingResponse

import models
from db import get_db
from schemas import SheetmetalMaterialCreateInput, SheetmetalMaterialDeleteInput, SheetMetalHistoryResponse

router = APIRouter()

from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from pathlib import Path
import shutil
import uuid
import cadquery as cq
import trimesh
from typing import List, Dict
from models import SheetmetalParameters, Sheet_metal_Materials, SheetmetalMachineHourRate, SheetmetalToolingCost, \
    SheetmetalPercentages, SheetmetalManufacturingPercentage, SheetMetalHistory, SheetmetalCalculationResult

router = APIRouter()


# new change

# @router.post("/analyze-single-step-files/")
# async def analyze_single_step_file(
#         file: UploadFile = File(...),
#         material_id: int = Form(...),
#         quantity: int = Form(1),
#         db: Session = Depends(get_db)
# ):
#     # -------------------------------
#     # Step 1: Fetch Material Info
#     # -------------------------------
#     material_obj = db.query(models.Sheet_metal_Materials).filter(
#         models.Sheet_metal_Materials.id == material_id
#     ).first()
#
#     if not material_obj or material_obj.density is None:
#         raise HTTPException(status_code=404, detail="Sheetmetal material not found or invalid density")
#
#     material_name = material_obj.material.strip()
#     material_density = material_obj.density
#     material_cost = material_obj.material_cost
#
#     # -------------------------------
#     # Step 2: Save STEP File
#     # -------------------------------
#     unique_filename = f"{uuid.uuid4()}_{file.filename}"
#     file_path = Path("uploads") / unique_filename
#
#     with file_path.open("wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)
#
#     try:
#         # -------------------------------
#         # Step 3: Load STEP and Extract Geometry
#         # -------------------------------
#         model = cq.importers.importStep(str(file_path))
#         shape = model.val()
#         bb = shape.BoundingBox()
#
#         x_dim = bb.xmax - bb.xmin
#         y_dim = bb.ymax - bb.ymin
#         z_dim = bb.zmax - bb.zmin
#
#         dims_sorted = sorted([(x_dim, 'X'), (y_dim, 'Y'), (z_dim, 'Z')],
#                              reverse=True, key=lambda x: x[0])
#
#         length = dims_sorted[0][0]
#         breadth = dims_sorted[1][0]
#         height = dims_sorted[2][0]
#
#         # Part actual CAD volume
#         part_volume_mm3 = shape.Volume()
#         part_volume_m3 = part_volume_mm3 / 1e9
#
#         # -------------------------------
#         # Step 4: Male & Female Tool Calculations
#         # -------------------------------
#         TOOL_HEIGHT = 50
#         TOOL_FACTOR = 0.7
#         length = round(length, 2)
#         length = int(length)
#         breadth = round(breadth, 2)
#         breadth = int(breadth)
#
#         tool_volume_mm3 = length * breadth * TOOL_HEIGHT * TOOL_FACTOR
#         tool_volume_m3 = tool_volume_mm3 / 1e9
#
#         # -------------------------------
#         # Step 5: Prepare Saved JSON Objects
#         # -------------------------------
#         part_simple = {
#             "filename": file.filename,
#             "length": round(length, 2),
#             "breadth": round(breadth, 2),
#             "height": round(height, 2),
#             "volume_mm3": round(part_volume_mm3, 2),
#             "volume_m3": round(part_volume_m3, 10)
#         }
#
#         male_tool_simple = {
#             "filename": file.filename,  # use part filename
#             "length": round(length, 3),
#             "breadth": round(breadth, 3),
#             "height": TOOL_HEIGHT,
#             "volume_mm3": round(tool_volume_mm3, 2),
#             "volume_m3": round(tool_volume_m3, 10)
#         }
#
#         female_tool_simple = {
#             "filename": file.filename,  # use part filename
#             "length": round(length, 2),
#             "breadth": round(breadth, 2),
#             "height": TOOL_HEIGHT,
#             "volume_mm3": round(tool_volume_mm3, 2),
#             "volume_m3": round(tool_volume_m3, 10)
#         }
#
#         # -------------------------------
#         # Step 6: Save Into Database
#         # -------------------------------
#         history_entry = models.SheetMetalHistory(
#             filename_female=file.filename,
#             filename_male=file.filename,
#             filename_part=file.filename,
#             female_tool=female_tool_simple,
#             male_tool=male_tool_simple,
#             part=part_simple,
#             material_id=material_id,
#             material_name=material_name,
#             material_density=material_density,
#             material_cost=material_cost,
#             quantity=quantity,
#             created_at=datetime.utcnow()
#         )
#
#         db.add(history_entry)
#         db.commit()
#         db.refresh(history_entry)
#
#         # -------------------------------
#         # Step 7: Return Response
#         # -------------------------------
#         return {
#             "history_id": history_entry.id,
#             "material": {
#                 "id": material_id,
#                 "name": material_name,
#                 "density": material_density,
#                 "cost": material_cost
#             },
#             "quantity": quantity,
#             "part": part_simple,
#             "male_tool": male_tool_simple,
#             "female_tool": female_tool_simple
#         }
#
#     finally:
#         file_path.unlink(missing_ok=True)

#
# @router.post("/analyze-step-files/")
# async def analyze_step_files(
#         files: list[UploadFile] = File(...),
#         material_id: int = Form(...),
#         quantity: int = Form(1),
#         db: Session = Depends(get_db)
# ):
#     if len(files) != 3:
#         raise HTTPException(status_code=400, detail="Please upload exactly 3 STEP files: female, male, part.")
#
#     # --- Fetch material info ---
#     material_obj = db.query(models.Sheet_metal_Materials).filter(
#         models.Sheet_metal_Materials.id == material_id
#     ).first()
#
#     if not material_obj or material_obj.density is None:
#         raise HTTPException(status_code=404, detail="Sheetmetal material not found or invalid density")
#
#     material_name = material_obj.material.strip()
#     material_density = material_obj.density
#     material_cost = material_obj.material_cost
#
#     def round_to_nearest(value, base):
#         return int(base * round(float(value) / base))
#
#     analyzed = []
#
#     for file in files:
#         unique_filename = f"{uuid.uuid4()}_{file.filename}"
#         file_path = Path("uploads") / unique_filename
#         with file_path.open("wb") as buffer:
#             shutil.copyfileobj(file.file, buffer)
#
#         try:
#             model = cq.importers.importStep(str(file_path))
#             shape = model.val()
#             bb = shape.BoundingBox()
#
#             x_dim = bb.xmax - bb.xmin
#             y_dim = bb.ymax - bb.ymin
#             z_dim = bb.zmax - bb.zmin
#
#             dims_sorted = sorted([(x_dim, 'X'), (y_dim, 'Y'), (z_dim, 'Z')],
#                                  reverse=True, key=lambda x: x[0])
#             length, breadth, height = dims_sorted[0][0], dims_sorted[1][0], dims_sorted[2][0]
#
#             volume_mm3 = shape.Volume()
#             volume_m3 = volume_mm3 / 1e9
#
#             analyzed.append({
#                 "filename": file.filename,
#                 "dims_sorted": dims_sorted,
#                 "x_dim": x_dim,
#                 "y_dim": y_dim,
#                 "z_dim": z_dim,
#                 "length": length,
#                 "breadth": breadth,
#                 "height": height,
#                 "volume_mm3": volume_mm3,
#                 "volume_m3": volume_m3
#             })
#         finally:
#             file_path.unlink(missing_ok=True)
#
#     # classify female/male/part by volume
#     analyzed.sort(key=lambda r: r["volume_m3"], reverse=True)
#     female_tool = analyzed[0]
#     male_tool = analyzed[1]
#     part = analyzed[2]
#
#     def simplify_tool(tool):
#         return {
#             "filename": tool["filename"],
#             "length": round(tool["length"], 2),
#             "breadth": round(tool["breadth"], 2),
#             "height": round(tool["height"], 2),
#             "volume_mm3": round(tool["volume_mm3"]),
#             "volume_m3": round(tool["volume_m3"], 10)
#         }
#
#     female_tool_simple = simplify_tool(female_tool)
#     male_tool_simple = simplify_tool(male_tool)
#     part_simple = simplify_tool(part)
#
#     # --- Store in DB ---
#     history_entry = models.SheetMetalHistory(
#         filename_female=female_tool["filename"],
#         filename_male=male_tool["filename"],
#         filename_part=part["filename"],
#         female_tool=female_tool_simple,
#         male_tool=male_tool_simple,
#         part=part_simple,
#         material_id=material_id,
#         material_name=material_name,
#         material_density=material_density,
#         material_cost=material_cost,
#         quantity=quantity,
#         created_at=datetime.utcnow()
#     )
#
#     db.add(history_entry)
#     db.commit()
#     db.refresh(history_entry)
#
#     return {
#         "history_id": history_entry.id,
#         "material": {
#             "id": material_id,
#             "name": material_name,
#             "density": material_density,
#             "cost": material_cost
#         },
#         "quantity": quantity,
#         "female_tool": female_tool_simple,
#         "male_tool": male_tool_simple,
#         "part": part_simple
#     }



@router.post("/analyze-step-files/")
async def analyze_step_files(
        files: list[UploadFile] = File(...),
        material_id: int = Form(...),
        quantity: int = Form(1),
        db: Session = Depends(get_db)
):
    # =====================================================
    # COMMON: Fetch Material Info (UNCHANGED)
    # =====================================================
    material_obj = db.query(models.Sheet_metal_Materials).filter(
        models.Sheet_metal_Materials.id == material_id
    ).first()

    if not material_obj or material_obj.density is None:
        raise HTTPException(
            status_code=404,
            detail="Sheetmetal material not found or invalid density"
        )

    material_name = material_obj.material.strip()
    material_density = material_obj.density
    material_cost = material_obj.material_cost

    # =====================================================
    # CASE 1: SINGLE FILE  → use analyze-single-step-files logic
    # =====================================================
    if len(files) == 1:
        file = files[0]

        unique_filename = f"{uuid.uuid4()}_{file.filename}"
        file_path = Path("uploads") / unique_filename

        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        try:
            # ---- File Type Detection and Processing ----
            file_extension = file.filename.lower().split('.')[-1]
            print(f"Sheet Metal Analysis - Processing file: {file.filename} (type: {file_extension})")
            
            if file_extension in ['step', 'stp']:
                # ---- STEP Processing ----
                print("Processing STEP file with CadQuery...")
                model = cq.importers.importStep(str(file_path))
                shape = model.val()
                bb = shape.BoundingBox()

                x_dim = bb.xmax - bb.xmin
                y_dim = bb.ymax - bb.ymin
                z_dim = bb.zmax - bb.zmin

                part_volume_mm3 = shape.Volume()
                part_volume_m3 = part_volume_mm3 / 1e9
                
                print(f"STEP dimensions: X={x_dim:.2f}, Y={y_dim:.2f}, Z={z_dim:.2f}, Volume={part_volume_mm3:.2f} mm³")
                
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
                elif max_raw_dim > 10000:  # Too large, might need scaling down
                    scale_factor = 0.1
                    print(f"Applying scale factor: {scale_factor} (dimensions too large)")
                else:
                    print(f"No scaling needed (scale factor: {scale_factor})")
                    
                # Apply scaling if needed
                x_dim = raw_x_dim * scale_factor
                y_dim = raw_y_dim * scale_factor
                z_dim = raw_z_dim * scale_factor
                
                print(f"Scaled dimensions: X={x_dim:.3f}, Y={y_dim:.3f}, Z={z_dim:.3f}")
                
                # Calculate volume using trimesh with proper scaling
                part_volume_mm3 = mesh.volume * (scale_factor ** 3)
                part_volume_m3 = part_volume_mm3 / 1e9
                
                # Convert numpy types to regular Python types if needed
                x_dim = float(x_dim)
                y_dim = float(y_dim)
                z_dim = float(z_dim)
                part_volume_mm3 = float(part_volume_mm3)
                
                print(f"STL dimensions: X={x_dim:.2f}, Y={y_dim:.2f}, Z={z_dim:.2f}, Volume={part_volume_mm3:.2f} mm³")
                
            else:
                raise HTTPException(status_code=400, detail="Only STEP, STP, and STL files are supported")

            # ---- Common Processing for All File Types ----
            dims_sorted = sorted(
                [(x_dim, 'X'), (y_dim, 'Y'), (z_dim, 'Z')],
                reverse=True,
                key=lambda x: x[0]
            )

            length = dims_sorted[0][0]
            breadth = dims_sorted[1][0]
            height = dims_sorted[2][0]

            # ---- TOOL LOGIC (UNCHANGED) ----
            TOOL_HEIGHT = 50
            TOOL_FACTOR = 0.7

            length = int(round(length, 2))
            breadth = int(round(breadth, 2))

            tool_volume_mm3 = length * breadth * TOOL_HEIGHT * TOOL_FACTOR
            tool_volume_m3 = tool_volume_mm3 / 1e9

            part_simple = {
                "filename": file.filename,
                "length": round(length, 2),
                "breadth": round(breadth, 2),
                "height": round(height, 2),
                "volume_mm3": round(part_volume_mm3, 2),
                "volume_m3": round(part_volume_m3, 10)
            }

            male_tool_simple = {
                "filename": file.filename,
                "length": round(length, 3),
                "breadth": round(breadth, 3),
                "height": TOOL_HEIGHT,
                "volume_mm3": round(tool_volume_mm3, 2),
                "volume_m3": round(tool_volume_m3, 10)
            }

            female_tool_simple = {
                "filename": file.filename,
                "length": round(length, 2),
                "breadth": round(breadth, 2),
                "height": TOOL_HEIGHT,
                "volume_mm3": round(tool_volume_mm3, 2),
                "volume_m3": round(tool_volume_m3, 10)
            }

            history_entry = models.SheetMetalHistory(
                filename_female=file.filename,
                filename_male=file.filename,
                filename_part=file.filename,
                female_tool=female_tool_simple,
                male_tool=male_tool_simple,
                part=part_simple,
                material_id=material_id,
                material_name=material_name,
                material_density=material_density,
                material_cost=material_cost,
                quantity=quantity,
                created_at=datetime.utcnow()
            )

            db.add(history_entry)
            db.commit()
            db.refresh(history_entry)

            return {
                "history_id": history_entry.id,
                "material": {
                    "id": material_id,
                    "name": material_name,
                    "density": material_density,
                    "cost": material_cost
                },
                "quantity": quantity,
                "part": part_simple,
                "male_tool": male_tool_simple,
                "female_tool": female_tool_simple
            }

        finally:
            file_path.unlink(missing_ok=True)

    # =====================================================
    # CASE 2: THREE FILES → use analyze-step-files logic
    # =====================================================
    if len(files) != 3:
        raise HTTPException(
            status_code=400,
            detail="Please upload either 1 STEP/STL file or exactly 3 STEP/STL files."
        )

    analyzed = []

    for file in files:
        unique_filename = f"{uuid.uuid4()}_{file.filename}"
        file_path = Path("uploads") / unique_filename

        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        try:
            # ---- File Type Detection and Processing ----
            file_extension = file.filename.lower().split('.')[-1]
            print(f"Sheet Metal Analysis - Processing file: {file.filename} (type: {file_extension})")
            
            if file_extension in ['step', 'stp']:
                # ---- STEP Processing ----
                print("Processing STEP file with CadQuery...")
                model = cq.importers.importStep(str(file_path))
                shape = model.val()
                bb = shape.BoundingBox()

                x_dim = bb.xmax - bb.xmin
                y_dim = bb.ymax - bb.ymin
                z_dim = bb.zmax - bb.zmin

                volume_mm3 = shape.Volume()
                volume_m3 = volume_mm3 / 1e9
                
                print(f"STEP dimensions: X={x_dim:.2f}, Y={y_dim:.2f}, Z={z_dim:.2f}, Volume={volume_mm3:.2f} mm³")
                
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
                
                if max_raw_dim < 100:  # Likely in mm, need to scale up
                    scale_factor = 10.0  # Convert to proper scale
                    print(f"Applying scale factor: {scale_factor} (dimensions too small)")
                elif max_raw_dim > 1000:  # Too large, might need scaling down
                    scale_factor = 0.1
                    print(f"Applying scale factor: {scale_factor} (dimensions too large)")
                else:
                    print(f"No scaling needed (scale factor: {scale_factor})")
                    
                # Apply scaling if needed
                x_dim = raw_x_dim * scale_factor
                y_dim = raw_y_dim * scale_factor
                z_dim = raw_z_dim * scale_factor
                
                print(f"Scaled dimensions: X={x_dim:.3f}, Y={y_dim:.3f}, Z={z_dim:.3f}")
                
                # Calculate volume using trimesh with proper scaling
                volume_mm3 = mesh.volume * (scale_factor ** 3)
                volume_m3 = volume_mm3 / 1e9
                
                # Convert numpy types to regular Python types if needed
                x_dim = float(x_dim)
                y_dim = float(y_dim)
                z_dim = float(z_dim)
                volume_mm3 = float(volume_mm3)
                
                print(f"STL dimensions: X={x_dim:.2f}, Y={y_dim:.2f}, Z={z_dim:.2f}, Volume={volume_mm3:.2f} mm³")
                
            else:
                raise HTTPException(status_code=400, detail="Only STEP, STP, and STL files are supported")

            # ---- Common Processing for All File Types ----

            dims_sorted = sorted(
                [(x_dim, 'X'), (y_dim, 'Y'), (z_dim, 'Z')],
                reverse=True,
                key=lambda x: x[0]
            )

            length = dims_sorted[0][0]
            breadth = dims_sorted[1][0]
            height = dims_sorted[2][0]

            volume_mm3 = shape.Volume()
            volume_m3 = volume_mm3 / 1e9

            analyzed.append({
                "filename": file.filename,
                "length": length,
                "breadth": breadth,
                "height": height,
                "volume_mm3": volume_mm3,
                "volume_m3": volume_m3
            })
        finally:
            file_path.unlink(missing_ok=True)

    analyzed.sort(key=lambda r: r["volume_m3"], reverse=True)

    female_tool = analyzed[0]
    male_tool = analyzed[1]
    part = analyzed[2]

    def simplify(tool):
        return {
            "filename": tool["filename"],
            "length": round(tool["length"], 2),
            "breadth": round(tool["breadth"], 2),
            "height": round(tool["height"], 2),
            "volume_mm3": round(tool["volume_mm3"]),
            "volume_m3": round(tool["volume_m3"], 10)
        }

    female_tool_simple = simplify(female_tool)
    male_tool_simple = simplify(male_tool)
    part_simple = simplify(part)

    history_entry = models.SheetMetalHistory(
        filename_female=female_tool["filename"],
        filename_male=male_tool["filename"],
        filename_part=part["filename"],
        female_tool=female_tool_simple,
        male_tool=male_tool_simple,
        part=part_simple,
        material_id=material_id,
        material_name=material_name,
        material_density=material_density,
        material_cost=material_cost,
        quantity=quantity,
        created_at=datetime.utcnow()
    )

    db.add(history_entry)
    db.commit()
    db.refresh(history_entry)

    return {
        "history_id": history_entry.id,
        "material": {
            "id": material_id,
            "name": material_name,
            "density": material_density,
            "cost": material_cost
        },
        "quantity": quantity,
        "female_tool": female_tool_simple,
        "male_tool": male_tool_simple,
        "part": part_simple
    }


def get_part_size_condition(length_mm, db: Session):
    """
    Dynamically find the correct part_size category for a given length based on Sheetmetal_Tooling_Cost table.
    """
    all_sizes = db.query(models.SheetmetalToolingCost.part_size).distinct().all()
    all_sizes = [s[0].strip() for s in all_sizes]

    for size in all_sizes:
        size = size.replace("mm", "").replace(" ", "")
        if '-' in size:
            min_val, max_val = map(int, size.split('-'))
            if min_val <= length_mm <= max_val:
                return size
        elif '<' in size:
            max_val = int(size.replace('<', ''))
            if length_mm < max_val:
                return size
        elif '>' in size:
            min_val = int(size.replace('>', ''))
            if length_mm > min_val:
                return size
    return None


def get_raw_extra(x, y, z):
    max_dim = max(x, y, z)
    if max_dim <= 50:
        return 20, 20, 5
    elif max_dim <= 100:
        return 30, 30, 5
    elif max_dim <= 200:
        return 30, 30, 5
    elif max_dim <= 500:
        return 50, 50, 10
    else:
        return 100, 100, 10


@router.post("/calculate-sheetmetal-from-history/")
async def calculate_sheetmetal_from_history(
        history_id: int = Form(...),
        db: Session = Depends(get_db)
):
    # --- Fetch history entry ---
    history_entry = db.query(models.SheetMetalHistory).filter(
        models.SheetMetalHistory.id == history_id
    ).first()

    if not history_entry:
        raise HTTPException(status_code=404, detail="History entry not found")

    # --- Extract stored data ---
    material_id = history_entry.material_id
    material_name = history_entry.material_name
    density = history_entry.material_density
    material_cost = history_entry.material_cost
    quantity = history_entry.quantity

    female = history_entry.female_tool
    male = history_entry.male_tool
    part = history_entry.part

    def round_to_nearest(value, base):
        return int(base * round(float(value) / base))

    def get_raw_extra(x, y, z):
        max_dim = max(x, y, z)
        if max_dim <= 50:
            return 20, 20, 5
        elif max_dim <= 100:
            return 30, 30, 5
        elif max_dim <= 200:
            return 30, 30, 5
        elif max_dim <= 500:
            return 50, 50, 10
        else:
            return 100, 100, 10

    def get_part_size_condition(length_mm, db: Session):
        """
        Dynamically find the correct part_size category for a given length based on Sheetmetal_Tooling_Cost table.
        """
        all_sizes = db.query(models.SheetmetalToolingCost.part_size).distinct().all()
        all_sizes = [s[0].strip() for s in all_sizes]

        for size in all_sizes:
            size = size.replace("mm", "").replace(" ", "")
            if '-' in size:
                min_val, max_val = map(int, size.split('-'))
                if min_val <= length_mm <= max_val:
                    return size
            elif '<' in size:
                max_val = int(size.replace('<', ''))
                if length_mm < max_val:
                    return size
            elif '>' in size:
                min_val = int(size.replace('>', ''))
                if length_mm > min_val:
                    return size
        return None

    def compute_stock_and_cost(tool):
        L, B, H = tool["length"], tool["breadth"], tool["height"]

        δX, δY, δZ = get_raw_extra(L, B, H)
        stock_L = round_to_nearest(L + δX, 10)
        stock_B = round_to_nearest(B + δY, 10)
        stock_H = round_to_nearest(H + δZ, 5)

        stock_volume_mm3 = stock_L * stock_B * stock_H
        stock_volume_m3 = stock_volume_mm3 / 1e9
        volume_removed_m3 = stock_volume_m3 - tool["volume_m3"]
        volume_removed_mm3 = stock_volume_mm3 - tool["volume_mm3"]

        # --- Determine part size category ---

        # --- Fetch SheetmetalParameters for MRR ---
        param = db.query(models.SheetmetalParameters).filter(
            models.SheetmetalParameters.material_id == material_id
        ).all()

        roughing_mrr = finishing_mrr = None
        for p in param:
            lr = p.length_range.replace(" ", "")
            match = False
            if '-' in lr:
                min_val, max_val = map(float, lr.split('-'))
                if min_val <= L <= max_val:
                    match = True
            elif '<' in lr:
                max_val = float(lr.replace('<', ''))
                if L < max_val:
                    match = True
            elif '>' in lr:
                min_val = float(lr.replace('>', ''))
                if L > min_val:
                    match = True

            if match:
                roughing_mrr = (
                        p.roughing_feed_rate * p.roughing_axial_depth_of_cut * p.roughing_radial_width_of_cut
                )
                finishing_mrr = (
                        p.finishing_feed_rate * p.finishing_axial_depth_of_cut * p.finishing_radial_width_of_cut
                )
                break

        # --- Fetch Roughing & Finishing Percentages ---
        percentage_obj = db.query(models.SheetmetalPercentages).first()
        if percentage_obj:
            roughing_percentage = percentage_obj.roughing_percentage or 0
            finishing_percentage = percentage_obj.finishing_percentage or 0
        else:
            roughing_percentage = finishing_percentage = 0

        print(roughing_percentage)
        print(finishing_percentage)

        # --- Calculate Times ---
        if roughing_mrr and finishing_mrr and volume_removed_mm3 > 0:
            roughing_time_hr = ((volume_removed_mm3 / roughing_mrr) * (roughing_percentage / 100)) / 60
            finishing_time_hr = ((volume_removed_mm3 / finishing_mrr) * (finishing_percentage / 100)) / 60
            total_machining_time_hr = roughing_time_hr + finishing_time_hr
        else:
            roughing_time_hr = finishing_time_hr = total_machining_time_hr = None

        # --- Fetch Manufacturing Percentage ---
        manufacturing_percentage_obj = db.query(models.SheetmetalManufacturingPercentage).first()
        if manufacturing_percentage_obj and manufacturing_percentage_obj.percentage_of_manufacturing_time:
            manufacturing_percentage = manufacturing_percentage_obj.percentage_of_manufacturing_time
        else:
            manufacturing_percentage = 100

        # --- Calculate Manufacturing Time ---
        if total_machining_time_hr:
            manufacturing_time_hr = (total_machining_time_hr * 100) / manufacturing_percentage
        else:
            manufacturing_time_hr = None

        mhr_entries = db.query(models.SheetmetalMachineHourRate).filter(
            models.SheetmetalMachineHourRate.machine_type == "3 Axis"
        ).all()

        mhr_entries = sorted(
            mhr_entries,
            key=lambda e: (
                float(e.size.lower().replace("mm", "").replace(" ", "").split('*')[0])
                if '*' in e.size else float('inf')
            )
        )

        mhr_value = None
        mhr_machine_type = None
        mhr_machine_size = None

        # ✅ Use part’s actual dimensions instead of stock
        # part_L = part["length"]
        # part_B = part["breadth"]
        # part_H = part["height"]
        #
        # if mhr_entries:
        #     for entry in mhr_entries:
        #         try:
        #             lbh = entry.size.lower().replace("mm", "").replace(" ", "")
        #             parts = lbh.split("*")
        #             if len(parts) == 3:
        #                 mL, mB, mH = map(float, parts)
        #                 # ✅ Check if part fits within machine size in all three dimensions
        #                 if part_L <= mL and part_B <= mB and part_H <= mH:
        #                     mhr_value = entry.hourly_rate
        #                     mhr_machine_type = entry.machine_type
        #                     mhr_machine_size = entry.size
        #                     break
        #             else:
        #                 print(f"❌ Invalid format for size: {entry.size}")
        #         except Exception as e:
        #             print(f"⚠️ Error parsing {entry.size}: {e}")
        #             continue
        tool_L = L
        tool_B = B
        tool_H = H

        if mhr_entries:
            for entry in mhr_entries:
                try:
                    lbh = entry.size.lower().replace("mm", "").replace(" ", "")
                    parts = lbh.split("*")

                    if len(parts) == 3:
                        mL, mB, mH = map(float, parts)

                        # Check if THIS TOOL fits inside machine workspace
                        if tool_L <= mL and tool_B <= mB and tool_H <= mH:
                            mhr_value = entry.hourly_rate
                            mhr_machine_type = entry.machine_type
                            mhr_machine_size = entry.size
                            break

                except Exception as e:
                    print(f"⚠️ Error parsing {entry.size}: {e}")
                    continue

        # --- Calculate Manufacturing Cost ---
        if manufacturing_time_hr and mhr_value:
            manufacturing_cost = manufacturing_time_hr * mhr_value
        else:
            manufacturing_cost = None

        stock_weight_kg = stock_volume_m3 * density
        total_material_cost = stock_weight_kg * material_cost

        return {
            "filename": tool["filename"],
            "actual_dimensions": {
                "length": round(L, 2),
                "breadth": round(B, 2),
                "height": round(H, 2),
                "volume_mm3": round(tool["volume_mm3"]),
                "volume_m3": round(tool["volume_m3"], 10)
            },
            "stock_dimensions": {
                "stock_length": stock_L,
                "stock_breadth": stock_B,
                "stock_height": stock_H,
                "stock_volume_mm3": round(stock_volume_mm3),
                "stock_volume_m3": round(stock_volume_m3, 10),
                "stock_weight_kg": round(stock_weight_kg, 3),
                "material_cost_per_kg": round(material_cost, 2),
                "total_material_cost": round(total_material_cost, 2)
            },
            "volume_removed_m3": round(volume_removed_m3, 10),
            # "part_size_category": part_size_condition,
            "roughing_mrr": round(roughing_mrr, 5) if roughing_mrr else None,
            "finishing_mrr": round(finishing_mrr, 5) if finishing_mrr else None,
            "roughing_time_hr": round(roughing_time_hr, 5) if roughing_time_hr else None,
            "finishing_time_hr": round(finishing_time_hr, 5) if finishing_time_hr else None,
            "total_machining_time_hr": round(total_machining_time_hr, 5) if total_machining_time_hr else None,
            "manufacturing_percentage": manufacturing_percentage,
            "manufacturing_time_hr": round(manufacturing_time_hr, 5) if manufacturing_time_hr else None,
            "mhr": mhr_value,
            "mhr_machine_type": mhr_machine_type,
            "mhr_machine_size": mhr_machine_size,
            "manufacturing_cost": round(manufacturing_cost, 2) if manufacturing_cost else None,
            "roughing_percentage": roughing_percentage,
            "finishing_percentage": finishing_percentage
        }

    female_metrics = compute_stock_and_cost(female)
    male_metrics = compute_stock_and_cost(male)

    male_total_material_cost_per_unit = male_metrics["stock_dimensions"]["total_material_cost"]
    female_total_material_cost_per_unit = female_metrics["stock_dimensions"]["total_material_cost"]

    # --- Combined total material cost per unit ---
    total_material_cost_per_unit = (
            (male_total_material_cost_per_unit or 0) +
            (female_total_material_cost_per_unit or 0)
    )

    # part info (only actual volume)
    part_info = {
        "filename": part["filename"],
        "actual_dimensions": {
            "length": round(part["length"], 2),
            "breadth": round(part["breadth"], 2),
            "height": round(part["height"], 2),
            "volume_mm3": round(part["volume_mm3"]),
            "volume_m3": round(part["volume_m3"], 10)
        }
    }

    # --- Calculate Tool Design Cost based on PART dimensions ---
    part_length = part["length"]
    part_size_category = get_part_size_condition(part_length, db)

    # Fetch tooling cost from DB based on part size
    tooling_cost = db.query(models.SheetmetalToolingCost).filter(
        models.SheetmetalToolingCost.part_size == part_size_category
    ).first()

    if tooling_cost:
        design_hours = tooling_cost.design_hours
        cost_per_hour = tooling_cost.cost_per_hour
        total_design_cost = design_hours * cost_per_hour
    else:
        design_hours = cost_per_hour = total_design_cost = None

    # Fetch forming percentage from SheetmetalToolingCost for the identified part size
    if tooling_cost and tooling_cost.forming_cost_percentage:
        forming_percentage = tooling_cost.forming_cost_percentage
    else:
        forming_percentage = 0

    # --- Compute total tool-related costs ---
    male_total_cost = (male_metrics["manufacturing_cost"] or 0) + (
            male_metrics["stock_dimensions"]["total_material_cost"] or 0)
    female_total_cost = (female_metrics["manufacturing_cost"] or 0) + (
            female_metrics["stock_dimensions"]["total_material_cost"] or 0)

    # --- Compute Part Forming Cost ---
    part_forming_cost = (forming_percentage / 100) * (male_total_cost + female_total_cost)

    # --- Calculate Total Cost using design cost from part ---
    total_cost = (
            male_total_cost +
            female_total_cost +
            part_forming_cost +
            (total_design_cost or 0)
    )
    manufacturing_percentage_record = db.query(models.SheetmetalManufacturingPercentage).first()

    if manufacturing_percentage_record and manufacturing_percentage_record.Correction_factor:
        correction_factor = manufacturing_percentage_record.Correction_factor
    else:
        correction_factor = 1

    total_cost  = total_cost * correction_factor

    female_total_material = female_total_material_cost_per_unit * quantity
    female_manufacturing_cost = female_metrics["manufacturing_cost"] * quantity

    male_total_material_cost = male_total_material_cost_per_unit * quantity
    male_manufacturing_cost = male_metrics["manufacturing_cost"] * quantity

    part_forming_cost = part_forming_cost
    total_material_cost = total_material_cost_per_unit * quantity
    total_cost = total_cost * quantity

    # --- Store calculation results in database ---
    calculation_result = models.SheetmetalCalculationResult(
        history_id=history_id,

        # Female tool data
        female_stock_dimensions=female_metrics["stock_dimensions"],
        female_volume_removed_m3=female_metrics["volume_removed_m3"],

        female_roughing_mrr=female_metrics["roughing_mrr"],
        female_finishing_mrr=female_metrics["finishing_mrr"],
        female_roughing_time_hr=female_metrics["roughing_time_hr"],
        female_finishing_time_hr=female_metrics["finishing_time_hr"],
        female_total_machining_time_hr=female_metrics["total_machining_time_hr"],
        female_manufacturing_percentage=female_metrics["manufacturing_percentage"],
        female_manufacturing_time_hr=female_metrics["manufacturing_time_hr"],
        female_mhr=female_metrics["mhr"],
        female_manufacturing_cost_per_unit=female_metrics["manufacturing_cost"],
        female_manufacturing_cost=round(female_metrics["manufacturing_cost"] * quantity, 2),
        female_roughing_percentage=female_metrics["roughing_percentage"],
        female_finishing_percentage=female_metrics["finishing_percentage"],
        female_total_material_cost_per_unit=round(female_total_material_cost_per_unit, 2),
        female_total_material=round(female_total_material_cost_per_unit * quantity, 2),

        # Male tool data
        male_stock_dimensions=male_metrics["stock_dimensions"],
        male_volume_removed_m3=male_metrics["volume_removed_m3"],

        male_roughing_mrr=male_metrics["roughing_mrr"],
        male_finishing_mrr=male_metrics["finishing_mrr"],
        male_roughing_time_hr=male_metrics["roughing_time_hr"],
        male_finishing_time_hr=male_metrics["finishing_time_hr"],
        male_total_machining_time_hr=male_metrics["total_machining_time_hr"],
        male_manufacturing_percentage=male_metrics["manufacturing_percentage"],
        male_manufacturing_time_hr=male_metrics["manufacturing_time_hr"],
        male_mhr=male_metrics["mhr"],
        male_manufacturing_cost_per_unit=male_metrics["manufacturing_cost"],
        male_manufacturing_cost=round(male_metrics["manufacturing_cost"] * quantity, 2),
        male_roughing_percentage=male_metrics["roughing_percentage"],
        male_finishing_percentage=male_metrics["finishing_percentage"],
        male_total_material_cost_per_unit=round(male_total_material_cost_per_unit, 2),
        male_total_material_cost=round(male_total_material_cost_per_unit * quantity, 2),

        # Forming data
        forming_percentage=forming_percentage,
        part_forming_cost_per_unit=round(part_forming_cost, 2),
        part_forming_cost=round(part_forming_cost * quantity, 2),

        tool_design_data={
            "part_size_category": part_size_category,
            "design_hours": design_hours,
            "cost_per_hour": cost_per_hour,
            "total_design_cost": round(total_design_cost, 2) if total_design_cost else None
        },

        # Total costs
        male_total_cost_mfg_mat=round(male_total_cost, 2),
        female_total_cost_mfg_mat=round(female_total_cost, 2),

        total_material_cost_per_unit=round(total_material_cost_per_unit, 2),
        total_material_cost=round(total_material_cost_per_unit * quantity, 2),

        total_cost_per_unit=round(total_cost, 2) if quantity else None,
        total_cost=round(total_cost, 2),

        calculated_at=datetime.utcnow()
    )

    db.add(calculation_result)
    db.commit()
    db.refresh(calculation_result)

    return {
        "calculation_id": calculation_result.id,
        "history_id": history_id,
        "material": {
            "id": material_id,
            "name": material_name,
            "density": density,
            "cost": material_cost
        },
        "quantity": quantity,
        "classification": {
            "female_tool": female_metrics,
            "male_tool": male_metrics,
            "part": part_info
        },
        "tool_design": {
            "part_size_category": part_size_category,
            "design_hours": design_hours,
            "cost_per_hour": cost_per_hour,
            "total_design_cost": round(total_design_cost, 2) if total_design_cost else None
        },
        "part_forming": {
            "part_size_category": part_size_category,
            "forming_percentage": forming_percentage,
            "part_forming_cost": round(part_forming_cost, 2),
            "part_forming_cost_per_unit": round(part_forming_cost, 2)
        },
        "material_costs": {
            "male_total_material_cost_per_unit": round(male_total_material_cost_per_unit, 2),
            "female_total_material_cost_per_unit": round(female_total_material_cost_per_unit, 2),
            "total_material_cost_per_unit": round(total_material_cost_per_unit, 2),
            "total_material_cost": round(total_material_cost, 2)
        },
        "total_cost": round(total_cost, 2),
        "total_cost_per_unit": round(total_cost, 2)
    }


@router.put("/recalculate-stock/")
async def recalculate_sheetmetal_from_history(
        history_id: int = Form(...),
        female_stock_length: float = Form(...),
        female_stock_breadth: float = Form(...),
        female_stock_height: float = Form(...),
        male_stock_length: float = Form(...),
        male_stock_breadth: float = Form(...),
        male_stock_height: float = Form(...),
        db: Session = Depends(get_db)
):
    """
    Recalculate sheetmetal cost using custom stock dimensions for male and female tools.
    Updates the existing SheetmetalCalculationResult record using the same logic as calculation endpoint.
    """

    # --- Fetch history entry ---
    history_entry = db.query(models.SheetMetalHistory).filter(
        models.SheetMetalHistory.id == history_id
    ).first()

    if not history_entry:
        raise HTTPException(status_code=404, detail="History entry not found")

    # --- Fetch existing calculation record ---
    existing_calc = db.query(models.SheetmetalCalculationResult).filter(
        models.SheetmetalCalculationResult.history_id == history_id
    ).first()

    if not existing_calc:
        raise HTTPException(status_code=404, detail="No existing calculation found to update")

    # --- Extract stored data ---
    material_id = history_entry.material_id
    material_name = history_entry.material_name
    density = history_entry.material_density
    material_cost = history_entry.material_cost
    quantity = history_entry.quantity

    female = history_entry.female_tool.copy()
    male = history_entry.male_tool.copy()
    part = history_entry.part.copy()

    # Inject manual stock overrides
    female["stock_override"] = {
        "length": female_stock_length,
        "breadth": female_stock_breadth,
        "height": female_stock_height
    }
    male["stock_override"] = {
        "length": male_stock_length,
        "breadth": male_stock_breadth,
        "height": male_stock_height
    }

    # --- Utility functions (same as in main calculation) ---
    def round_to_nearest(value, base):
        return int(base * round(float(value) / base))

    def get_raw_extra(x, y, z):
        max_dim = max(x, y, z)
        if max_dim <= 50:
            return 20, 20, 5
        elif max_dim <= 100:
            return 30, 30, 5
        elif max_dim <= 200:
            return 30, 30, 5
        elif max_dim <= 500:
            return 50, 50, 10
        else:
            return 100, 100, 10

    def get_part_size_condition(length_mm, db: Session):
        all_sizes = db.query(models.SheetmetalToolingCost.part_size).distinct().all()
        all_sizes = [s[0].strip() for s in all_sizes]
        for size in all_sizes:
            size = size.replace("mm", "").replace(" ", "")
            if '-' in size:
                min_val, max_val = map(int, size.split('-'))
                if min_val <= length_mm <= max_val:
                    return size
            elif '<' in size:
                max_val = int(size.replace('<', ''))
                if length_mm < max_val:
                    return size
            elif '>' in size:
                min_val = int(size.replace('>', ''))
                if length_mm > min_val:
                    return size
        return None

    def get_machine_details_from_mhr(mhr_value):
        if not mhr_value:
            return None, None

        entry = db.query(models.SheetmetalMachineHourRate).filter(
            models.SheetmetalMachineHourRate.hourly_rate == mhr_value
        ).first()

        if entry:
            return entry.machine_type, entry.size

        return None, None

    # --- Main compute function (with override support) ---
    def compute_stock_and_cost(tool):
        L, B, H = tool["length"], tool["breadth"], tool["height"]

        tool_name = tool.get("filename", "").lower()

        if "female" in tool_name:
            mhr_value = existing_calc.female_mhr
            mhr_machine_type, mhr_machine_size = get_machine_details_from_mhr(mhr_value)
        else:
            mhr_value = existing_calc.male_mhr
            mhr_machine_type, mhr_machine_size = get_machine_details_from_mhr(mhr_value)

        if "stock_override" in tool:
            stock_L = float(tool["stock_override"]["length"])
            stock_B = float(tool["stock_override"]["breadth"])
            stock_H = float(tool["stock_override"]["height"])
        else:
            δX, δY, δZ = get_raw_extra(L, B, H)
            stock_L = round_to_nearest(L + δX, 10)
            stock_B = round_to_nearest(B + δY, 10)
            stock_H = round_to_nearest(H + δZ, 5)

        stock_volume_mm3 = stock_L * stock_B * stock_H
        stock_volume_m3 = stock_volume_mm3 / 1e9
        volume_removed_m3 = stock_volume_m3 - tool["volume_m3"]
        volume_removed_mm3 = stock_volume_mm3 - tool["volume_mm3"]

        part_size_condition = get_part_size_condition(L, db)

        param = db.query(models.SheetmetalParameters).filter(
            models.SheetmetalParameters.material_id == material_id
        ).all()

        roughing_mrr = finishing_mrr = None
        for p in param:
            lr = p.length_range.replace(" ", "")
            match = False
            if '-' in lr:
                min_val, max_val = map(float, lr.split('-'))
                if min_val <= L <= max_val:
                    match = True
            elif '<' in lr:
                max_val = float(lr.replace('<', ''))
                if L < max_val:
                    match = True
            elif '>' in lr:
                min_val = float(lr.replace('>', ''))
                if L > min_val:
                    match = True
            if match:
                roughing_mrr = (
                        p.roughing_feed_rate *
                        p.roughing_axial_depth_of_cut *
                        p.roughing_radial_width_of_cut
                )
                finishing_mrr = (
                        p.finishing_feed_rate *
                        p.finishing_axial_depth_of_cut *
                        p.finishing_radial_width_of_cut
                )
                break

        percentage_obj = db.query(models.SheetmetalPercentages).first()
        roughing_percentage = percentage_obj.roughing_percentage if percentage_obj else 0
        finishing_percentage = percentage_obj.finishing_percentage if percentage_obj else 0

        if roughing_mrr and finishing_mrr and volume_removed_mm3 > 0:
            print(volume_removed_mm3,roughing_percentage,roughing_mrr)

            roughing_time_hr = ((volume_removed_mm3 * (roughing_percentage / 100))/ roughing_mrr)/60
            print(roughing_time_hr)
            finishing_time_hr = ((volume_removed_mm3 * (finishing_percentage / 100))/finishing_mrr) / 60
            total_machining_time_hr = roughing_time_hr + finishing_time_hr
            print(total_machining_time_hr)
        else:
            roughing_time_hr = finishing_time_hr = total_machining_time_hr = None

        manufacturing_percentage_obj = db.query(models.SheetmetalManufacturingPercentage).first()
        manufacturing_percentage = (
            manufacturing_percentage_obj.percentage_of_manufacturing_time
            if manufacturing_percentage_obj else 100
        )

        if total_machining_time_hr:
            manufacturing_time_hr = (total_machining_time_hr * 100) / manufacturing_percentage
        else:
            manufacturing_time_hr = None

        # mhr_entries = db.query(models.SheetmetalMachineHourRate).filter(
        #     models.SheetmetalMachineHourRate.machine_type == "3 Axis"
        # ).all()
        # mhr_entries = sorted(mhr_entries, key=lambda e: float(e.size.split('*')[0]))
        # mhr_value = None
        # mhr_machine_type = None
        # mhr_machine_size = None
        # for entry in mhr_entries:
        #     try:
        #         lbh = entry.size.lower().replace("mm", "").replace(" ", "")
        #         parts = lbh.split("*")
        #         if len(parts) == 3:
        #             l, b, h = map(float, parts)
        #             if stock_L <= l:
        #                 mhr_value = entry.hourly_rate
        #                 mhr_machine_type = entry.machine_type
        #                 mhr_machine_size = entry.size
        #                 break
        #     except Exception:
        #         continue
        tool_name = tool.get("filename", "").lower()
        if "female" in tool_name:
            mhr_value = existing_calc.female_mhr
        else:
            mhr_value = existing_calc.male_mhr

        # Optional — you can keep these fields if other parts of the code expect them
        # mhr_machine_type = "3 Axis"
        # mhr_machine_size = None

        if manufacturing_time_hr and mhr_value:
            manufacturing_cost = manufacturing_time_hr * mhr_value
        else:
            manufacturing_cost = None

        stock_weight_kg = stock_volume_m3 * density
        total_material_cost = stock_weight_kg * material_cost

        return {
            "filename": tool["filename"],
            "stock_dimensions": {
                "stock_length": stock_L,
                "stock_breadth": stock_B,
                "stock_height": stock_H,
                "stock_volume_mm3": round(stock_volume_mm3),
                "stock_volume_m3": round(stock_volume_m3, 10),
                "stock_weight_kg": round(stock_weight_kg, 3),
                "material_cost_per_kg": round(material_cost, 2),
                "total_material_cost": round(total_material_cost, 2)
            },

            "roughing_time_hr": roughing_time_hr,
            "finishing_time_hr": finishing_time_hr,
            "total_machining_time_hr": total_machining_time_hr,
            "manufacturing_time_hr": manufacturing_time_hr,


            "volume_removed_m3": round(volume_removed_m3, 10),
            "manufacturing_cost": round(manufacturing_cost, 2) if manufacturing_cost else None,
            "mhr": mhr_value,
            "mhr_machine_type": mhr_machine_type,
            "mhr_machine_size": mhr_machine_size,
            "manufacturing_time_hr": manufacturing_time_hr,
        }

    # --- Recalculate both tools ---
    female_metrics = compute_stock_and_cost(female)
    male_metrics = compute_stock_and_cost(male)

    # --- Calculate forming & total costs ---
    part_length = part["length"]
    part_size_category = get_part_size_condition(part_length, db)

    tooling_cost = db.query(models.SheetmetalToolingCost).filter(
        models.SheetmetalToolingCost.part_size == part_size_category
    ).first()

    design_hours = cost_per_hour = total_design_cost = 0
    forming_percentage = 0
    if tooling_cost:
        design_hours = tooling_cost.design_hours
        cost_per_hour = tooling_cost.cost_per_hour
        total_design_cost = design_hours * cost_per_hour
        forming_percentage = tooling_cost.forming_cost_percentage or 0

    male_total_cost = (male_metrics["manufacturing_cost"] or 0) + (
            male_metrics["stock_dimensions"]["total_material_cost"] or 0)
    female_total_cost = (female_metrics["manufacturing_cost"] or 0) + (
            female_metrics["stock_dimensions"]["total_material_cost"] or 0)

    part_forming_cost = (forming_percentage / 100) * (male_total_cost + female_total_cost)

    manufacturing_percentage_record = db.query(models.SheetmetalManufacturingPercentage).first()

    if manufacturing_percentage_record and manufacturing_percentage_record.Correction_factor:
        correction_factor = manufacturing_percentage_record.Correction_factor
    else:
        correction_factor = 1
    total_cost = male_total_cost + female_total_cost + part_forming_cost + (total_design_cost or 0)
    total_cost = total_cost*correction_factor

    female_total_material = female_metrics["stock_dimensions"]["total_material_cost"]
    female_manufacturing_cost_total = (female_metrics["manufacturing_cost"] or 0)

    male_total_material_cost = male_metrics["stock_dimensions"]["total_material_cost"]
    male_manufacturing_cost_total = (male_metrics["manufacturing_cost"] or 0)

    part_forming_cost_total = part_forming_cost * quantity
    total_cost_total = male_total_cost + female_total_cost + part_forming_cost_total + (total_design_cost or 0)
    total_cost_total = total_cost_total * correction_factor

    # --- Update the existing record ---
    existing_calc.female_stock_dimensions = female_metrics["stock_dimensions"]
    existing_calc.male_stock_dimensions = male_metrics["stock_dimensions"]

    existing_calc.female_volume_removed_m3 = female_metrics["volume_removed_m3"]
    existing_calc.male_volume_removed_m3 = male_metrics["volume_removed_m3"]

    # --- Female ---
    existing_calc.female_total_material_cost_per_unit = round(female_metrics["stock_dimensions"]["total_material_cost"],
                                                              2)
    existing_calc.female_total_material = round(female_total_material, 2)
    existing_calc.female_manufacturing_cost_per_unit = round(female_metrics["manufacturing_cost"], 2) if female_metrics[
        "manufacturing_cost"] else None
    existing_calc.female_manufacturing_cost = round(female_manufacturing_cost_total, 2)





    existing_calc.female_roughing_time_hr = female_metrics["roughing_time_hr"]
    existing_calc.female_finishing_time_hr = female_metrics["finishing_time_hr"]
    existing_calc.female_total_machining_time_hr = female_metrics["total_machining_time_hr"]
    existing_calc.female_manufacturing_time_hr = female_metrics["manufacturing_time_hr"]

    # --- Male ---
    existing_calc.male_total_material_cost_per_unit = round(male_metrics["stock_dimensions"]["total_material_cost"], 2)
    existing_calc.male_total_material_cost = round(male_total_material_cost, 2)
    existing_calc.male_manufacturing_cost_per_unit = round(male_metrics["manufacturing_cost"], 2) if male_metrics[
        "manufacturing_cost"] else None
    existing_calc.male_manufacturing_cost = round(male_manufacturing_cost_total, 2)

    existing_calc.male_roughing_time_hr = male_metrics["roughing_time_hr"]
    existing_calc.male_finishing_time_hr = male_metrics["finishing_time_hr"]
    existing_calc.male_total_machining_time_hr = male_metrics["total_machining_time_hr"]
    existing_calc.male_manufacturing_time_hr = male_metrics["manufacturing_time_hr"]

    # --- Forming & totals ---
    existing_calc.forming_percentage = forming_percentage
    existing_calc.part_forming_cost_per_unit = round(part_forming_cost, 2)
    existing_calc.part_forming_cost = round(part_forming_cost_total, 2)

    existing_calc.male_total_cost_mfg_mat = round(male_total_cost, 2)
    existing_calc.female_total_cost_mfg_mat = round(female_total_cost, 2)

    existing_calc.total_material_cost_per_unit = round(
        female_metrics["stock_dimensions"]["total_material_cost"] + male_metrics["stock_dimensions"][
            "total_material_cost"], 2
    )
    existing_calc.total_material_cost = round(
        female_total_material + male_total_material_cost, 2
    )

    existing_calc.total_cost_per_unit = round(total_cost, 2)
    existing_calc.total_cost = round(total_cost_total, 2)

    existing_calc.tool_design_data = {
        "part_size_category": part_size_category,
        "design_hours": design_hours,
        "cost_per_hour": cost_per_hour,
        "total_design_cost": round(total_design_cost, 2)
    }

    existing_calc.calculated_at = datetime.utcnow()

    db.commit()
    db.refresh(existing_calc)

    # --- Return full updated data ---
    return {
        "message": "Recalculation successful — existing record updated.",
        "calculation_id": existing_calc.id,
        "history_id": history_id,
        "material": {
            "id": material_id,
            "name": material_name,
            "density": density,
            "cost": material_cost
        },

        "actual_female_dimensions": history_entry.female_tool,
        "actual_male_dimensions": history_entry.male_tool,
        "actual_part_dimensions": history_entry.part,
        "quantity": quantity,
        "classification": {
            "female_tool": female_metrics,
            "male_tool": male_metrics,
            "part": part
        },
        "tool_design": existing_calc.tool_design_data,
        "part_forming": {
            "part_size_category": part_size_category,
            "forming_percentage": forming_percentage,
            "part_forming_cost": round(part_forming_cost_total, 2),
            "part_forming_cost_per_unit": part_forming_cost
        },
        "total_cost_per_unit": round(total_cost, 2),
        "total_cost": total_cost_total
    }


@router.get('/sheetmetal-materials')
def get_all_sheetmetal_materials(db: Session = Depends(get_db)):
    try:
        materials = db.query(models.Sheet_metal_Materials).all()

        # Convert to list of dictionaries
        result = [
            {
                "id": mat.id,
                "material": mat.material,
                "material_specification": mat.material_specification,
                "density": mat.density,
                "material_cost": mat.material_cost
            }
            for mat in materials
        ]

        return {
            "success": True,
            "data": result,
            "count": len(result)
        }

    except Exception as e:
        print(f"Error fetching Sheetmetal_Materials: {e}")
        return {"success": False, "error": "Internal server error"}


@router.put("/sheetmetal-materials/update-cost")
def update_material_cost(
        material: str = Form(...),
        material_specification: str = Form(...),
        density: float = Form(...),
        new_cost: float = Form(...),
        db: Session = Depends(get_db)
):
    try:
        # Find the row that matches all three attributes
        mat = (
            db.query(models.Sheet_metal_Materials)
                .filter(
                models.Sheet_metal_Materials.material == material,
                models.Sheet_metal_Materials.material_specification == material_specification,
                models.Sheet_metal_Materials.density == density
            )
                .first()
        )

        if not mat:
            raise HTTPException(status_code=404, detail="Material not found")

        # Update the cost
        mat.material_cost = new_cost
        db.commit()
        db.refresh(mat)

        return {
            "success": True,
            "message": "Material cost updated successfully",
            "data": {
                "id": mat.id,
                "material": mat.material,
                "material_specification": mat.material_specification,
                "density": mat.density,
                "updated_material_cost": mat.material_cost
            }
        }

    except Exception as e:
        print(f"Error updating material cost: {e}")
        db.rollback()
        return {"success": False, "error": "Internal server error"}


@router.get("/sheetmetal-parameters")
def get_all_sheetmetal_parameters(db: Session = Depends(get_db)):
    try:
        parameters = db.query(models.SheetmetalParameters).all()

        result = [
            {
                "id": param.id,
                "material_id": param.material_id,
                "material": param.material,
                "length_range": param.length_range,
                "roughing_feed_rate": param.roughing_feed_rate,
                "roughing_axial_depth_of_cut": param.roughing_axial_depth_of_cut,
                "roughing_radial_width_of_cut": param.roughing_radial_width_of_cut,
                "finishing_feed_rate": param.finishing_feed_rate,
                "finishing_axial_depth_of_cut": param.finishing_axial_depth_of_cut,
                "finishing_radial_width_of_cut": param.finishing_radial_width_of_cut,
            }
            for param in parameters
        ]

        return {
            "success": True,
            "data": result,
            "count": len(result)
        }

    except Exception as e:
        print(f"Error fetching Sheetmetal_Parameters: {e}")
        return {"success": False, "error": "Internal server error"}


#
# @router.put("/sheetmetal-parameters/update")
# def update_sheetmetal_parameters(
#     material: str = Form(...),
#     length_range: str = Form(...),
#     roughing_feed_rate: float = Form(...),
#     roughing_axial_depth_of_cut: float = Form(...),
#     roughing_radial_width_of_cut: float = Form(...),
#     finishing_feed_rate: float = Form(...),
#     finishing_axial_depth_of_cut: float = Form(...),
#     finishing_radial_width_of_cut: float = Form(...),
#     db: Session = Depends(get_db)
# ):
#     try:
#         # Find the matching row by material name and length_range
#         param = (
#             db.query(SheetmetalParameters)
#             .filter(
#                 SheetmetalParameters.material == material,
#                 SheetmetalParameters.length_range == length_range
#             )
#             .first()
#         )
#
#         if not param:
#             raise HTTPException(status_code=404, detail="Parameter record not found")
#
#         # Update values
#         param.roughing_feed_rate = roughing_feed_rate
#         param.roughing_axial_depth_of_cut = roughing_axial_depth_of_cut
#         param.roughing_radial_width_of_cut = roughing_radial_width_of_cut
#         param.finishing_feed_rate = finishing_feed_rate
#         param.finishing_axial_depth_of_cut = finishing_axial_depth_of_cut
#         param.finishing_radial_width_of_cut = finishing_radial_width_of_cut
#
#         db.commit()
#         db.refresh(param)
#
#         return {
#             "success": True,
#             "message": "Sheetmetal parameters updated successfully",
#             "updated_data": {
#                 "material": param.material,
#                 "length_range": param.length_range,
#                 "roughing_feed_rate": param.roughing_feed_rate,
#                 "roughing_axial_depth_of_cut": param.roughing_axial_depth_of_cut,
#                 "roughing_radial_width_of_cut": param.roughing_radial_width_of_cut,
#                 "finishing_feed_rate": param.finishing_feed_rate,
#                 "finishing_axial_depth_of_cut": param.finishing_axial_depth_of_cut,
#                 "finishing_radial_width_of_cut": param.finishing_radial_width_of_cut
#             }
#         }
#
#     except Exception as e:
#         print(f"Error updating Sheetmetal_Parameters: {e}")
#         db.rollback()
#         return {"success": False, "error": "Internal server error"}


@router.put("/sheetmetal-parameters/update")
def update_sheetmetal_parameters(
        material: str = Form(...),
        old_length_range: str = Form(...),  # old value to locate row
        new_length_range: str = Form(...),  # new value to update
        roughing_feed_rate: float = Form(...),
        roughing_axial_depth_of_cut: float = Form(...),
        roughing_radial_width_of_cut: float = Form(...),
        finishing_feed_rate: float = Form(...),
        finishing_axial_depth_of_cut: float = Form(...),
        finishing_radial_width_of_cut: float = Form(...),
        db: Session = Depends(get_db)
):
    try:
        # Find row using material + old_length_range
        param = (
            db.query(SheetmetalParameters)
                .filter(
                SheetmetalParameters.material == material,
                SheetmetalParameters.length_range == old_length_range
            )
                .first()
        )

        if not param:
            raise HTTPException(status_code=404, detail="Parameter record not found")

        # Validate new_length_range format
        import re
        # Allowed patterns: 51-100, >101, <20 (numbers can vary)
        range_pattern = r'^(?:\d+-\d+|>\d+|<\d+)$'
        if not re.match(range_pattern, new_length_range.strip()):
            raise HTTPException(
                status_code=400,
                detail="Invalid new_length_range format. Allowed formats: '51-100', '>101', '<20' (numbers can vary)"
            )

        # Check for overlapping or conflicting length_range for this material (excluding current record)
        existing_rows = db.query(SheetmetalParameters).filter(
            SheetmetalParameters.material == material,
            SheetmetalParameters.id != param.id  # Exclude current record
        ).all()

        new_range = new_length_range.strip()
        
        for existing in existing_rows:
            existing_range = existing.length_range.strip()
            
            # Exact match check
            if new_range == existing_range:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Length range '{new_range}' already exists for material '{material}' - cannot update to duplicate entry"
                )
            
            # Overlap check for range formats (e.g., "30-60" vs "40-50")
            if '-' in new_range and '-' in existing_range:
                try:
                    new_start, new_end = map(int, new_range.split('-'))
                    existing_start, existing_end = map(int, existing_range.split('-'))
                    
                    # Check if ranges overlap
                    if not (new_end < existing_start or new_start > existing_end):
                        raise HTTPException(
                            status_code=400, 
                            detail=f"Length range '{new_range}' overlaps with existing range '{existing_range}' for material '{material}' - cannot update to overlapping entry"
                        )
                except ValueError:
                    continue
            
            # Check if new range falls within an existing range
            if '-' in existing_range:
                try:
                    existing_start, existing_end = map(int, existing_range.split('-'))
                    
                    if new_range.startswith('>'):
                        new_val = int(new_range[1:])
                        if new_val >= existing_start and new_val <= existing_end:
                            raise HTTPException(
                                status_code=400,
                                detail=f"Length range '{new_range}' falls within existing range '{existing_range}' for material '{material}' - cannot update to conflicting entry"
                            )
                    elif new_range.startswith('<'):
                        new_val = int(new_range[1:])
                        if new_val >= existing_start and new_val <= existing_end:
                            raise HTTPException(
                                status_code=400,
                                detail=f"Length range '{new_range}' falls within existing range '{existing_range}' for material '{material}' - cannot update to conflicting entry"
                            )
                except ValueError:
                    continue
            
            # Check if new range conflicts with existing >value or <value ranges
            if existing_range.startswith('>'):
                try:
                    existing_min = int(existing_range[1:])
                    
                    if '-' in new_range:
                        new_start, new_end = map(int, new_range.split('-'))
                        if new_start > existing_min:
                            raise HTTPException(
                                status_code=400,
                                detail=f"Length range '{new_range}' conflicts with existing range '{existing_range}' for material '{material}' - cannot update to conflicting entry"
                            )
                    elif new_range.startswith('>'):
                        new_val = int(new_range[1:])
                        if new_val >= existing_min:
                            raise HTTPException(
                                status_code=400,
                                detail=f"Length range '{new_range}' is covered by existing range '{existing_range}' for material '{material}' - cannot update to redundant entry"
                            )
                except ValueError:
                    continue
                    
            elif existing_range.startswith('<'):
                try:
                    existing_max = int(existing_range[1:])
                    
                    if '-' in new_range:
                        new_start, new_end = map(int, new_range.split('-'))
                        if new_end < existing_max:
                            raise HTTPException(
                                status_code=400,
                                detail=f"Length range '{new_range}' conflicts with existing range '{existing_range}' for material '{material}' - cannot update to conflicting entry"
                            )
                    elif new_range.startswith('<'):
                        new_val = int(new_range[1:])
                        if new_val <= existing_max:
                            raise HTTPException(
                                status_code=400,
                                detail=f"Length range '{new_range}' is covered by existing range '{existing_range}' for material '{material}' - cannot update to redundant entry"
                            )
                except ValueError:
                    continue

        # Update all values including length_range
        param.length_range = new_length_range.strip()
        param.roughing_feed_rate = roughing_feed_rate
        param.roughing_axial_depth_of_cut = roughing_axial_depth_of_cut
        param.roughing_radial_width_of_cut = roughing_radial_width_of_cut
        param.finishing_feed_rate = finishing_feed_rate
        param.finishing_axial_depth_of_cut = finishing_axial_depth_of_cut
        param.finishing_radial_width_of_cut = finishing_radial_width_of_cut

        db.commit()
        db.refresh(param)

        return {
            "success": True,
            "message": "Sheetmetal parameters updated successfully",
            "updated_data": {
                "material": param.material,
                "length_range": param.length_range,
                "roughing_feed_rate": param.roughing_feed_rate,
                "roughing_axial_depth_of_cut": param.roughing_axial_depth_of_cut,
                "roughing_radial_width_of_cut": param.roughing_radial_width_of_cut,
                "finishing_feed_rate": param.finishing_feed_rate,
                "finishing_axial_depth_of_cut": param.finishing_axial_depth_of_cut,
                "finishing_radial_width_of_cut": param.finishing_radial_width_of_cut
            }
        }

    except HTTPException:
        # Re-raise HTTPException to let FastAPI handle it properly
        raise
    except Exception as e:
        print(f"Error updating Sheetmetal_Parameters: {e}")
        db.rollback()
        return {"success": False, "error": "Internal server error"}


@router.post("/sheetmetal-parameters/add")
def add_sheetmetal_parameter(
        material: str = Form(...),
        length_range: str = Form(...),
        roughing_feed_rate: float = Form(...),
        roughing_axial_depth_of_cut: float = Form(...),
        roughing_radial_width_of_cut: float = Form(...),
        finishing_feed_rate: float = Form(...),
        finishing_axial_depth_of_cut: float = Form(...),
        finishing_radial_width_of_cut: float = Form(...),
        db: Session = Depends(get_db)
):
    # Check if material exists
    material_obj = db.query(Sheet_metal_Materials).filter(
        Sheet_metal_Materials.material == material
    ).first()

    if not material_obj:
        raise HTTPException(
            status_code=400,
            detail=f"Material '{material}' not found in Sheetmetal_Materials"
        )

    # Validate length_range format
    import re
    # Allowed patterns: 51-100, >101, <20 (numbers can vary)
    range_pattern = r'^(?:\d+-\d+|>\d+|<\d+)$'
    if not re.match(range_pattern, length_range.strip()):
        raise HTTPException(
            status_code=400,
            detail="Invalid length_range format. Allowed formats: '51-100', '>101', '<20' (numbers can vary)"
        )

    # Check for overlapping or conflicting length_range for this material
    existing_rows = db.query(SheetmetalParameters).filter(
        SheetmetalParameters.material_id == material_obj.id
    ).all()

    new_range = length_range.strip()
    
    for existing in existing_rows:
        existing_range = existing.length_range.strip()
        
        # Exact match check
        if new_range == existing_range:
            raise HTTPException(
                status_code=400, 
                detail=f"Length range '{new_range}' already exists for material '{material}' - cannot save duplicate entry"
            )
        
        # Overlap check for range formats (e.g., "30-60" vs "40-50")
        if '-' in new_range and '-' in existing_range:
            try:
                new_start, new_end = map(int, new_range.split('-'))
                existing_start, existing_end = map(int, existing_range.split('-'))
                
                # Check if ranges overlap
                if not (new_end < existing_start or new_start > existing_end):
                    raise HTTPException(
                        status_code=400, 
                        detail=f"Length range '{new_range}' overlaps with existing range '{existing_range}' for material '{material}' - cannot save overlapping entry"
                    )
            except ValueError:
                continue
        
        # Check if new range falls within an existing range
        if '-' in existing_range:
            try:
                existing_start, existing_end = map(int, existing_range.split('-'))
                
                if new_range.startswith('>'):
                    new_val = int(new_range[1:])
                    if new_val >= existing_start and new_val <= existing_end:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Length range '{new_range}' falls within existing range '{existing_range}' for material '{material}' - cannot save entry"
                        )
                elif new_range.startswith('<'):
                    new_val = int(new_range[1:])
                    if new_val >= existing_start and new_val <= existing_end:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Length range '{new_range}' falls within existing range '{existing_range}' for material '{material}' - cannot save entry"
                        )
            except ValueError:
                continue
        
        # Check if new range conflicts with existing >value or <value ranges
        if existing_range.startswith('>'):
            try:
                existing_min = int(existing_range[1:])
                
                if '-' in new_range:
                    new_start, new_end = map(int, new_range.split('-'))
                    if new_start > existing_min:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Length range '{new_range}' conflicts with existing range '{existing_range}' for material '{material}' - cannot save entry"
                        )
                elif new_range.startswith('>'):
                    new_val = int(new_range[1:])
                    if new_val >= existing_min:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Length range '{new_range}' is covered by existing range '{existing_range}' for material '{material}' - cannot save entry"
                        )
            except ValueError:
                continue
                
        elif existing_range.startswith('<'):
            try:
                existing_max = int(existing_range[1:])
                
                if '-' in new_range:
                    new_start, new_end = map(int, new_range.split('-'))
                    if new_end < existing_max:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Length range '{new_range}' conflicts with existing range '{existing_range}' for material '{material}' - cannot save entry"
                        )
                elif new_range.startswith('<'):
                    new_val = int(new_range[1:])
                    if new_val <= existing_max:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Length range '{new_range}' is covered by existing range '{existing_range}' for material '{material}' - cannot save entry"
                        )
            except ValueError:
                continue

    try:
        # Create new SheetmetalParameters row
        new_param = SheetmetalParameters(
            material_id=material_obj.id,
            material=material,
            length_range=length_range.strip(),
            roughing_feed_rate=roughing_feed_rate,
            roughing_axial_depth_of_cut=roughing_axial_depth_of_cut,
            roughing_radial_width_of_cut=roughing_radial_width_of_cut,
            finishing_feed_rate=finishing_feed_rate,
            finishing_axial_depth_of_cut=finishing_axial_depth_of_cut,
            finishing_radial_width_of_cut=finishing_radial_width_of_cut
        )

        db.add(new_param)
        db.commit()
        db.refresh(new_param)

        return {
            "success": True,
            "message": "Sheetmetal parameter added successfully",
            "data": {
                "id": new_param.id,
                "material_id": new_param.material_id,
                "material": new_param.material,
                "length_range": new_param.length_range,
                "roughing_feed_rate": new_param.roughing_feed_rate,
                "roughing_axial_depth_of_cut": new_param.roughing_axial_depth_of_cut,
                "roughing_radial_width_of_cut": new_param.roughing_radial_width_of_cut,
                "finishing_feed_rate": new_param.finishing_feed_rate,
                "finishing_axial_depth_of_cut": new_param.finishing_axial_depth_of_cut,
                "finishing_radial_width_of_cut": new_param.finishing_radial_width_of_cut
            }
        }

    except Exception as e:
        print(f"Error adding Sheetmetal_Parameter: {e}")
        db.rollback()
        return {"success": False, "error": "Internal server error"}


@router.get("/sheetmetal-machine-hour-rates")
def get_all_machine_hour_rates(db: Session = Depends(get_db)):
    try:
        records = db.query(SheetmetalMachineHourRate).all()

        result = [
            {
                "id": r.id,
                "machine_type": r.machine_type,
                "hourly_rate": r.hourly_rate,
                "size": r.size,
                "material_id": r.material_id,
                "material": r.material,
            }
            for r in records
        ]

        return {
            "success": True,
            "count": len(result),
            "data": result
        }

    except Exception as e:
        print(f"Error fetching SheetmetalMachineHourRate: {e}")
        return {"success": False, "error": "Internal server error"}


@router.put("/sheetmetal-machine-hour-rates/update")
def update_machine_hour_rate(
        material: str = Form(...),
        machine_type: str = Form(...),
        old_size: str = Form(...),  # current size to locate the row
        new_size: str = Form(...),  # new size to update
        hourly_rate: int = Form(...),  # new hourly rate
        db: Session = Depends(get_db)
):
    # Find the row first
    record = (
        db.query(SheetmetalMachineHourRate)
            .filter(
            SheetmetalMachineHourRate.material == material,
            SheetmetalMachineHourRate.machine_type == machine_type,
            SheetmetalMachineHourRate.size == old_size
        )
            .first()
    )

    if not record:
        return {
            "success": False,
            "error": f"No details found for material '{material}', machine_type '{machine_type}', size '{old_size}'"
        }

    # Validate new_size format (must be like 3000*1500*800)
    import re
    size_pattern = r'^\d+\*\d+\*\d+$'
    if not re.match(size_pattern, new_size.strip()):
        return {
            "success": False,
            "error": "Invalid new_size format. Size must be in format: '3000*1500*800' (numbers can vary but must be * separated)"
        }

    # Check if new_size already exists for this material (excluding current record)
    existing_record = db.query(SheetmetalMachineHourRate).filter(
        SheetmetalMachineHourRate.material == material,
        SheetmetalMachineHourRate.size == new_size.strip(),
        SheetmetalMachineHourRate.id != record.id  # Exclude current record
    ).first()

    if existing_record:
        return {
            "success": False,
            "error": f"Size '{new_size}' already exists for material '{material}' - cannot update to duplicate entry"
        }

    try:
        # Update fields
        record.size = new_size.strip()
        record.hourly_rate = hourly_rate

        db.commit()
        db.refresh(record)

        return {
            "success": True,
            "message": "Machine hour rate updated successfully",
            "updated_data": {
                "id": record.id,
                "machine_type": record.machine_type,
                "material": record.material,
                "size": record.size,
                "hourly_rate": record.hourly_rate
            }
        }

    except Exception as e:
        print(f"Error updating SheetmetalMachineHourRate: {e}")
        db.rollback()
        return {"success": False, "error": "Internal server error"}


@router.post("/sheetmetal-machine-hour-rates/add")
def add_machine_hour_rate(
        machine_type: str = Form(...),
        size: str = Form(...),
        hourly_rate: int = Form(...),
        material: str = Form(...),
        db: Session = Depends(get_db)
):
    # Check if material exists
    material_obj = db.query(Sheet_metal_Materials).filter(
        Sheet_metal_Materials.material == material
    ).first()

    if not material_obj:
        return {
            "success": False,
            "error": f"Material '{material}' not found in Sheetmetal_Materials"
        }

    # Validate size format (must be like 3000*1500*800)
    import re
    size_pattern = r'^\d+\*\d+\*\d+$'
    if not re.match(size_pattern, size.strip()):
        return {
            "success": False,
            "error": "Invalid size format. Size must be in format: '3000*1500*800' (numbers can vary but must be * separated)"
        }

    # Check if size already exists for this material
    existing_record = db.query(SheetmetalMachineHourRate).filter(
        SheetmetalMachineHourRate.material == material,
        SheetmetalMachineHourRate.size == size.strip()
    ).first()

    if existing_record:
        return {
            "success": False,
            "error": f"Size '{size}' already exists for material '{material}' - cannot add duplicate entry"
        }

    try:
        # Create new row
        new_record = SheetmetalMachineHourRate(
            machine_type=machine_type,
            size=size.strip(),
            hourly_rate=hourly_rate,
            material=material,
            material_id=material_obj.id
        )

        db.add(new_record)
        db.commit()
        db.refresh(new_record)

        return {
            "success": True,
            "message": "Machine hour rate added successfully",
            "data": {
                "id": new_record.id,
                "machine_type": new_record.machine_type,
                "size": new_record.size,
                "hourly_rate": new_record.hourly_rate,
                "material": new_record.material,
                "material_id": new_record.material_id
            }
        }

    except Exception as e:
        print(f"Error adding SheetmetalMachineHourRate: {e}")
        db.rollback()
        return {"success": False, "error": "Internal server error"}


@router.get("/sheetmetal-tooling-cost")
def get_all_tooling_costs(db: Session = Depends(get_db)):
    try:
        records = db.query(SheetmetalToolingCost).all()

        result = [
            {
                "id": r.id,
                "part_size": r.part_size,
                "type_of_tool": r.type_of_tool,
                "number_of_tools": r.number_of_tools,
                "design_hours": r.design_hours,
                "cost_per_hour": r.cost_per_hour,
                "forming_cost_percentage": r.forming_cost_percentage
            }
            for r in records
        ]

        return {
            "success": True,
            "count": len(result),
            "data": result
        }

    except Exception as e:
        print(f"Error fetching SheetmetalToolingCost: {e}")
        return {"success": False, "error": "Internal server error"}


@router.put("/sheetmetal-tooling-cost/update")
def update_tooling_cost(
        type_of_tool: str = Form(...),  # identifier to locate row
        part_size: str = Form(...),
        number_of_tools: str = Form(...),
        design_hours: float = Form(...),
        cost_per_hour: float = Form(...),
        forming_cost_percentage: float = Form(...),
        db: Session = Depends(get_db)
):
    # Find the row by type_of_tool
    record = db.query(SheetmetalToolingCost).filter(
        SheetmetalToolingCost.type_of_tool == type_of_tool
    ).first()

    if not record:
        return {
            "success": False,
            "error": f"No record found for type_of_tool '{type_of_tool}'"
        }

    # Validate part_size format
    import re
    # Allowed patterns: <500, 501-1000, >1000 (numbers can vary)
    size_pattern = r'^(?:\d+-\d+|>\d+|<\d+)$'
    if not re.match(size_pattern, part_size.strip()):
        return {
            "success": False,
            "error": "Invalid part_size format. Allowed formats: '<500', '501-1000', '>1000' (numbers can vary)"
        }

    # Check for overlapping or conflicting part_size (excluding current record)
    existing_sizes = db.query(SheetmetalToolingCost).filter(
        SheetmetalToolingCost.id != record.id  # Exclude current record
    ).all()
    new_size = part_size.strip()
    
    for existing in existing_sizes:
        existing_size = existing.part_size.strip()
        
        # Exact match check
        if new_size == existing_size:
            return {
                "success": False,
                "error": f"Part size '{new_size}' already exists - cannot update to duplicate entry"
            }
        
        # Overlap check for range formats (e.g., "501-1000" vs "600-800")
        if '-' in new_size and '-' in existing_size:
            try:
                new_start, new_end = map(int, new_size.split('-'))
                existing_start, existing_end = map(int, existing_size.split('-'))
                
                # Check if ranges overlap
                if not (new_end < existing_start or new_start > existing_end):
                    return {
                        "success": False,
                        "error": f"Part size '{new_size}' overlaps with existing size '{existing_size}' - cannot update to overlapping entry"
                    }
            except ValueError:
                continue
        
        # Check if new size falls within an existing range
        if '-' in existing_size:
            try:
                existing_start, existing_end = map(int, existing_size.split('-'))
                
                if new_size.startswith('>'):
                    new_val = int(new_size[1:])
                    if new_val >= existing_start and new_val <= existing_end:
                        return {
                            "success": False,
                            "error": f"Part size '{new_size}' falls within existing size '{existing_size}' - cannot update to conflicting entry"
                        }
                elif new_size.startswith('<'):
                    new_val = int(new_size[1:])
                    if new_val >= existing_start and new_val <= existing_end:
                        return {
                            "success": False,
                            "error": f"Part size '{new_size}' falls within existing size '{existing_size}' - cannot update to conflicting entry"
                        }
            except ValueError:
                continue
        
        # Check if new size conflicts with existing >value or <value sizes
        if existing_size.startswith('>'):
            try:
                existing_min = int(existing_size[1:])
                
                if '-' in new_size:
                    new_start, new_end = map(int, new_size.split('-'))
                    if new_start > existing_min:
                        return {
                            "success": False,
                            "error": f"Part size '{new_size}' conflicts with existing size '{existing_size}' - cannot update to conflicting entry"
                        }
                elif new_size.startswith('>'):
                    new_val = int(new_size[1:])
                    if new_val >= existing_min:
                        return {
                            "success": False,
                            "error": f"Part size '{new_size}' is covered by existing size '{existing_size}' - cannot update to redundant entry"
                        }
            except ValueError:
                continue
                
        elif existing_size.startswith('<'):
            try:
                existing_max = int(existing_size[1:])
                
                if '-' in new_size:
                    new_start, new_end = map(int, new_size.split('-'))
                    if new_end < existing_max:
                        return {
                            "success": False,
                            "error": f"Part size '{new_size}' conflicts with existing size '{existing_size}' - cannot update to conflicting entry"
                        }
                elif new_size.startswith('<'):
                    new_val = int(new_size[1:])
                    if new_val <= existing_max:
                        return {
                            "success": False,
                            "error": f"Part size '{new_size}' is covered by existing size '{existing_size}' - cannot update to redundant entry"
                        }
            except ValueError:
                continue

    try:
        # Update all fields
        record.part_size = part_size.strip()
        record.number_of_tools = number_of_tools
        record.design_hours = design_hours
        record.cost_per_hour = cost_per_hour
        record.forming_cost_percentage = forming_cost_percentage

        db.commit()
        db.refresh(record)

        return {
            "success": True,
            "message": f"Tooling cost updated successfully for '{type_of_tool}'",
            "updated_data": {
                "id": record.id,
                "type_of_tool": record.type_of_tool,
                "part_size": record.part_size,
                "number_of_tools": record.number_of_tools,
                "design_hours": record.design_hours,
                "cost_per_hour": record.cost_per_hour,
                "forming_cost_percentage": record.forming_cost_percentage
            }
        }

    except Exception as e:
        print(f"Error updating SheetmetalToolingCost: {e}")
        db.rollback()
        return {"success": False, "error": "Internal server error"}


@router.post("/sheetmetal-tooling-cost/add")
def add_tooling_cost(
        part_size: str = Form(...),
        type_of_tool: str = Form(...),
        number_of_tools: str = Form(...),
        design_hours: float = Form(...),
        cost_per_hour: float = Form(...),
        forming_cost_percentage: float = Form(...),
        db: Session = Depends(get_db)
):
    try:
        # Validate part_size format
        import re
        # Allowed patterns: <500, 501-1000, >1000 (numbers can vary)
        size_pattern = r'^(?:\d+-\d+|>\d+|<\d+)$'
        if not re.match(size_pattern, part_size.strip()):
            return {
                "success": False,
                "error": "Invalid part_size format. Allowed formats: '<500', '501-1000', '>1000' (numbers can vary)"
            }

        # Check for overlapping or conflicting part_size
        existing_sizes = db.query(SheetmetalToolingCost).all()
        new_size = part_size.strip()
        
        for existing in existing_sizes:
            existing_size = existing.part_size.strip()
            
            # Exact match check
            if new_size == existing_size:
                return {
                    "success": False,
                    "error": f"Part size '{new_size}' already exists - cannot add duplicate entry"
                }
            
            # Overlap check for range formats (e.g., "501-1000" vs "600-800")
            if '-' in new_size and '-' in existing_size:
                try:
                    new_start, new_end = map(int, new_size.split('-'))
                    existing_start, existing_end = map(int, existing_size.split('-'))
                    
                    # Check if ranges overlap
                    if not (new_end < existing_start or new_start > existing_end):
                        return {
                            "success": False,
                            "error": f"Part size '{new_size}' overlaps with existing size '{existing_size}' - cannot add overlapping entry"
                        }
                except ValueError:
                    continue
            
            # Check if new size falls within an existing range
            if '-' in existing_size:
                try:
                    existing_start, existing_end = map(int, existing_size.split('-'))
                    
                    if new_size.startswith('>'):
                        new_val = int(new_size[1:])
                        if new_val >= existing_start and new_val <= existing_end:
                            return {
                                "success": False,
                                "error": f"Part size '{new_size}' falls within existing size '{existing_size}' - cannot add entry"
                            }
                    elif new_size.startswith('<'):
                        new_val = int(new_size[1:])
                        if new_val >= existing_start and new_val <= existing_end:
                            return {
                                "success": False,
                                "error": f"Part size '{new_size}' falls within existing size '{existing_size}' - cannot add entry"
                            }
                except ValueError:
                    continue
            
            # Check if new size conflicts with existing >value or <value sizes
            if existing_size.startswith('>'):
                try:
                    existing_min = int(existing_size[1:])
                    
                    if '-' in new_size:
                        new_start, new_end = map(int, new_size.split('-'))
                        if new_start > existing_min:
                            return {
                                "success": False,
                                "error": f"Part size '{new_size}' conflicts with existing size '{existing_size}' - cannot add entry"
                            }
                    elif new_size.startswith('>'):
                        new_val = int(new_size[1:])
                        if new_val >= existing_min:
                            return {
                                "success": False,
                                "error": f"Part size '{new_size}' is covered by existing size '{existing_size}' - cannot add redundant entry"
                            }
                except ValueError:
                    continue
                    
            elif existing_size.startswith('<'):
                try:
                    existing_max = int(existing_size[1:])
                    
                    if '-' in new_size:
                        new_start, new_end = map(int, new_size.split('-'))
                        if new_end < existing_max:
                            return {
                                "success": False,
                                "error": f"Part size '{new_size}' conflicts with existing size '{existing_size}' - cannot add entry"
                            }
                    elif new_size.startswith('<'):
                        new_val = int(new_size[1:])
                        if new_val <= existing_max:
                            return {
                                "success": False,
                                "error": f"Part size '{new_size}' is covered by existing size '{existing_size}' - cannot add redundant entry"
                            }
                except ValueError:
                    continue

        # Optional: check if type_of_tool already exists to prevent duplicates
        existing = db.query(SheetmetalToolingCost).filter(
            SheetmetalToolingCost.type_of_tool == type_of_tool
        ).first()
        if existing:
            return {
                "success": False,
                "error": f"Tool '{type_of_tool}' already exists"
            }

        # Create new row
        new_record = SheetmetalToolingCost(
            part_size=part_size.strip(),
            type_of_tool=type_of_tool,
            number_of_tools=number_of_tools,
            design_hours=design_hours,
            cost_per_hour=cost_per_hour,
            forming_cost_percentage=forming_cost_percentage
        )

        db.add(new_record)
        db.commit()
        db.refresh(new_record)

        return {
            "success": True,
            "message": "Tooling cost added successfully",
            "data": {
                "id": new_record.id,
                "part_size": new_record.part_size,
                "type_of_tool": new_record.type_of_tool,
                "number_of_tools": new_record.number_of_tools,
                "design_hours": new_record.design_hours,
                "cost_per_hour": new_record.cost_per_hour,
                "forming_cost_percentage": new_record.forming_cost_percentage
            }
        }

    except Exception as e:
        print(f"Error adding SheetmetalToolingCost: {e}")
        db.rollback()
        return {"success": False, "error": "Internal server error"}


@router.delete("/sheetmetal-tooling-cost/delete")
def delete_tooling_cost(
        type_of_tool: str = Form(...),
        db: Session = Depends(get_db)
):
    try:
        # Find the row
        record = db.query(SheetmetalToolingCost).filter(
            SheetmetalToolingCost.type_of_tool == type_of_tool
        ).first()

        if not record:
            return {
                "success": False,
                "error": f"No record found for type_of_tool '{type_of_tool}'"
            }

        # Delete the row
        db.delete(record)
        db.commit()

        return {
            "success": True,
            "message": f"Record for '{type_of_tool}' deleted successfully"
        }

    except Exception as e:
        print(f"Error deleting SheetmetalToolingCost: {e}")
        db.rollback()
        return {"success": False, "error": "Internal server error"}


@router.get("/sheetmetal-percentages")
def get_sheetmetal_percentages(db: Session = Depends(get_db)):
    try:
        records = db.query(SheetmetalPercentages).all()
        result = [
            {
                "id": r.id,
                "roughing_percentage": r.roughing_percentage,
                "finishing_percentage": r.finishing_percentage
            }
            for r in records
        ]
        return {
            "success": True,
            "count": len(result),
            "data": result
        }
    except Exception as e:
        print(f"Error fetching SheetmetalPercentages: {e}")
        return {"success": False, "error": "Internal server error"}


@router.put("/sheetmetal-percentages/update")
def update_sheetmetal_percentages(
        roughing_percentage: float = Form(...),
        finishing_percentage: float = Form(...),
        db: Session = Depends(get_db)
):
    total = roughing_percentage + finishing_percentage

    # Check that sum is exactly 100
    if total != 100:
        return {
            "success": False,
            "error": "Sum of roughing and finishing percentages must be exactly 100"
        }

    try:
        # Usually only one row exists
        record = db.query(SheetmetalPercentages).first()

        if not record:
            return {
                "success": False,
                "error": "No percentage record found to update"
            }

        # Update values
        record.roughing_percentage = roughing_percentage
        record.finishing_percentage = finishing_percentage

        db.commit()
        db.refresh(record)

        return {
            "success": True,
            "message": "Sheetmetal percentages updated successfully",
            "updated_data": {
                "id": record.id,
                "roughing_percentage": record.roughing_percentage,
                "finishing_percentage": record.finishing_percentage
            }
        }

    except Exception as e:
        print(f"Error updating SheetmetalPercentages: {e}")
        db.rollback()
        return {"success": False, "error": "Internal server error"}

#
# @router.get("/sheetmetal-manufacturing-percentage")
# def get_manufacturing_percentage(db: Session = Depends(get_db)):
#     try:
#         record = db.query(SheetmetalManufacturingPercentage).first()
#         if not record:
#             return {
#                 "success": False,
#                 "error": "No manufacturing percentage record found"
#             }
#
#         return {
#             "success": True,
#             "data": {
#                 "id": record.id,
#                 "percentage_of_manufacturing_time": record.percentage_of_manufacturing_time
#             }
#         }
#
#     except Exception as e:
#         print(f"Error fetching SheetmetalManufacturingPercentage: {e}")
#         return {"success": False, "error": "Internal server error"}


@router.get("/sheetmetal-manufacturing-percentage")
def get_manufacturing_percentage(db: Session = Depends(get_db)):
    try:
        records = db.query(SheetmetalManufacturingPercentage).all()

        if not records:
            return {
                "success": False,
                "error": "No manufacturing percentage records found"
            }

        return {
            "success": True,
            "data": [
                {
                    "id": record.id,
                    "percentage_of_manufacturing_time": record.percentage_of_manufacturing_time,
                    "correction_factor": record.Correction_factor
                }
                for record in records
            ]
        }

    except Exception as e:
        print(f"Error fetching SheetmetalManufacturingPercentage: {e}")
        return {"success": False, "error": "Internal server error"}


#
# @router.put("/sheetmetal-manufacturing-percentage/update")
# def update_manufacturing_percentage(
#         percentage_of_manufacturing_time: float = Form(...),
#         db: Session = Depends(get_db)
# ):
#     try:
#         record = db.query(SheetmetalManufacturingPercentage).first()
#         if not record:
#             return {
#                 "success": False,
#                 "error": "No manufacturing percentage record found to update"
#             }
#
#         record.percentage_of_manufacturing_time = percentage_of_manufacturing_time
#         db.commit()
#         db.refresh(record)
#
#         return {
#             "success": True,
#             "message": "Manufacturing percentage updated successfully",
#             "updated_data": {
#                 "id": record.id,
#                 "percentage_of_manufacturing_time": record.percentage_of_manufacturing_time
#             }
#         }
#
#     except Exception as e:
#         print(f"Error updating SheetmetalManufacturingPercentage: {e}")
#         db.rollback()
#         return {"success": False, "error": "Internal server error"}



@router.put("/sheetmetal-manufacturing-percentage/update")
def update_manufacturing_percentage(
        percentage_of_manufacturing_time: float = Form(...),
        correction_factor: float = Form(...),
        db: Session = Depends(get_db)
):
    try:
        # --- Validation ---
        if percentage_of_manufacturing_time <= 0:
            return {"success": False, "error": "Percentage must be greater than 0"}

        if correction_factor <= 0:
            return {"success": False, "error": "Correction factor must be greater than 0"}

        # --- Fetch the FIRST record ---
        record = db.query(SheetmetalManufacturingPercentage).first()

        if not record:
            return {
                "success": False,
                "error": "No manufacturing percentage record found to update"
            }

        # --- Update values ---
        record.percentage_of_manufacturing_time = percentage_of_manufacturing_time
        record.Correction_factor = correction_factor

        db.commit()
        db.refresh(record)

        return {
            "success": True,
            "message": "Manufacturing percentage updated successfully",
            "updated_data": {
                "id": record.id,
                "percentage_of_manufacturing_time": record.percentage_of_manufacturing_time,
                "correction_factor": record.Correction_factor
            }
        }

    except Exception as e:
        print(f"Error updating SheetmetalManufacturingPercentage: {e}")
        db.rollback()
        return {"success": False, "error": "Internal server error"}


@router.post("/sheetmetal-materials/add")
def add_sheetmetal_material(
        data: SheetmetalMaterialCreateInput,
        db: Session = Depends(get_db)
):
    try:
        # Check if material already exists
        existing = db.query(Sheet_metal_Materials).filter(
            Sheet_metal_Materials.material == data.material,
            Sheet_metal_Materials.material_specification == data.material_specification,
            Sheet_metal_Materials.density == data.density
        ).first()

        if existing:
            raise HTTPException(status_code=400, detail=f"Material '{data.material}' already exists.")

        # Create new material
        new_material = Sheet_metal_Materials(
            material=data.material,
            material_specification=data.material_specification,
            density=data.density,
            material_cost=data.material_cost
        )
        db.add(new_material)
        db.flush()  # get ID for foreign keys

        # Add parameters
        for p in data.parameters:
            param = SheetmetalParameters(
                material_id=new_material.id,
                length_range=p.length_range,
                roughing_feed_rate=p.roughing_feed_rate,
                roughing_axial_depth_of_cut=p.roughing_axial_depth_of_cut,
                roughing_radial_width_of_cut=p.roughing_radial_width_of_cut,
                finishing_feed_rate=p.finishing_feed_rate,
                finishing_axial_depth_of_cut=p.finishing_axial_depth_of_cut,
                finishing_radial_width_of_cut=p.finishing_radial_width_of_cut,
                material=data.material
            )
            db.add(param)

        # Add machine rates
        for m in data.machine_rates:
            machine = SheetmetalMachineHourRate(
                machine_type=m.machine_type,
                hourly_rate=m.hourly_rate,
                size=m.size,
                material_id=new_material.id,
                material=data.material
            )
            db.add(machine)

        db.commit()
        db.refresh(new_material)

        return {
            "success": True,
            "message": f"Material '{data.material}' added successfully",
            "material_id": new_material.id
        }

    except Exception as e:
        print(f"Error adding material: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error")


@router.delete("/sheetmetal-materials/delete")
def delete_sheetmetal_material(
        data: SheetmetalMaterialDeleteInput,
        db: Session = Depends(get_db)
):
    try:
        # Fetch the material
        material = db.query(Sheet_metal_Materials).filter(
            Sheet_metal_Materials.id == data.material_id
        ).first()

        if not material:
            raise HTTPException(status_code=404, detail="Material not found")

        # Delete all related parameters
        db.query(SheetmetalParameters).filter(
            SheetmetalParameters.material_id == data.material_id
        ).delete(synchronize_session=False)

        # Delete all related machine rates
        db.query(SheetmetalMachineHourRate).filter(
            SheetmetalMachineHourRate.material_id == data.material_id
        ).delete(synchronize_session=False)

        # Delete the material itself
        db.delete(material)

        db.commit()

        return {"success": True,
                "message": f"Material ID {data.material_id} and all related records deleted successfully"}

    except Exception as e:
        print(f"Error deleting material: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error")


@router.put("/update-quantity-cost/")
async def update_quantity_and_recalculate(
        history_id: int = Form(...),
        new_quantity: int = Form(...),
        db: Session = Depends(get_db)
):
    # --- Fetch history record ---
    history_obj = db.query(SheetMetalHistory).filter(SheetMetalHistory.id == history_id).first()
    if not history_obj:
        raise HTTPException(status_code=404, detail="History record not found")

    # --- Fetch calculation result record ---
    calc_obj = db.query(SheetmetalCalculationResult).filter(
        SheetmetalCalculationResult.history_id == history_id
    ).first()
    if not calc_obj:
        raise HTTPException(status_code=404, detail="Calculation result not found")

    # --- Update quantity ---
    old_quantity = history_obj.quantity
    history_obj.quantity = new_quantity

    # --- Extract total design cost from tool_design_data (JSON) ---
    total_design_cost = 0.0
    if calc_obj.tool_design_data and isinstance(calc_obj.tool_design_data, dict):
        total_design_cost = calc_obj.tool_design_data.get("total_design_cost", 0.0)

    # --- Update part forming cost ---
    if calc_obj.part_forming_cost_per_unit is not None:
        calc_obj.part_forming_cost = calc_obj.part_forming_cost_per_unit * new_quantity
    else:
        calc_obj.part_forming_cost = 0.0

    # --- Compute total cost ---
    male_total_cost = calc_obj.male_total_cost_mfg_mat or 0.0
    female_total_cost = calc_obj.female_total_cost_mfg_mat or 0.0
    part_forming_cost = calc_obj.part_forming_cost or 0.0

    manufacturing_percentage_record = db.query(models.SheetmetalManufacturingPercentage).first()

    if manufacturing_percentage_record and manufacturing_percentage_record.Correction_factor:
        correction_factor = manufacturing_percentage_record.Correction_factor
    else:
        correction_factor = 1

    calc_obj.total_cost = (male_total_cost + female_total_cost + part_forming_cost + total_design_cost)*correction_factor

    # --- Update timestamp ---
    calc_obj.calculated_at = datetime.utcnow()

    # --- Commit changes ---
    db.commit()
    db.refresh(history_obj)
    db.refresh(calc_obj)

    return {
        "message": "Quantity and costs updated successfully.",
        "history_id": history_id,
        "new_quantity": new_quantity,
        "material": {
            "id": history_obj.material_id,
            "name": history_obj.material_name,
            "density": history_obj.material_density,
            "cost_per_kg": history_obj.material_cost,
        },
        "Actual_dimensions": {
            "female_tool": history_obj.female_tool,
            "male_tool": history_obj.male_tool,
            "part": history_obj.part
        },
        "Stock_and_cost": {
            "female": {
                "stock_dimensions": calc_obj.female_stock_dimensions,
                "total_material_cost": calc_obj.female_total_material_cost_per_unit,
                "manufacturing_cost": calc_obj.female_manufacturing_cost_per_unit,
            },
            "male": {
                "stock_dimensions": calc_obj.male_stock_dimensions,
                "total_material_cost": calc_obj.male_total_material_cost_per_unit,
                "manufacturing_cost": calc_obj.male_manufacturing_cost_per_unit,
            },
        },
        "updated_values": {
            "part_forming_cost": calc_obj.part_forming_cost,
            "part_forming_cost_per_unit": calc_obj.part_forming_cost_per_unit,
            "total_cost": calc_obj.total_cost,
            "total_cost_per_unit": calc_obj.total_cost_per_unit,
            "total_material_cost": calc_obj.total_material_cost,

            "total_design_cost": total_design_cost
        }
    }


@router.put("/update-manufacturing-cost/")
async def update_manufacturing_cost(
        history_id: int = Form(...),
        machine_type: str = Form(...),
        size: str = Form(...),
        db: Session = Depends(get_db)
):
    # --- Fetch calculation row ---
    calc_row = db.query(models.SheetmetalCalculationResult).filter(
        models.SheetmetalCalculationResult.history_id == history_id
    ).first()
    if not calc_row:
        raise HTTPException(status_code=404, detail="Calculation result not found")

    # --- Fetch history row for quantity and material ---
    history_row = db.query(models.SheetMetalHistory).filter(
        models.SheetMetalHistory.id == history_id
    ).first()
    if not history_row:
        raise HTTPException(status_code=404, detail="History entry not found")

    quantity = history_row.quantity
    material_cost_per_kg = history_row.material_cost
    material_density = history_row.material_density

    # --- Fetch MHR for the given machine type and size ---
    mhr_entry = db.query(models.SheetmetalMachineHourRate).filter(
        models.SheetmetalMachineHourRate.machine_type == machine_type,
        models.SheetmetalMachineHourRate.size == size
    ).first()
    if not mhr_entry:
        raise HTTPException(status_code=404, detail="MHR not found")
    mhr = mhr_entry.hourly_rate

    # --- Calculate new manufacturing costs ---
    female_manufacturing_time_hr = calc_row.female_manufacturing_time_hr or 0
    male_manufacturing_time_hr = calc_row.male_manufacturing_time_hr or 0

    calc_row.female_manufacturing_cost_per_unit = female_manufacturing_time_hr * mhr
    calc_row.male_manufacturing_cost_per_unit = male_manufacturing_time_hr * mhr

    # --- Update total manufacturing cost per tool ---
    calc_row.female_manufacturing_cost = calc_row.female_manufacturing_cost_per_unit
    calc_row.male_manufacturing_cost = calc_row.male_manufacturing_cost_per_unit

    # --- Recalculate total cost ---
    female_total_cost = (calc_row.female_manufacturing_cost or 0) + (calc_row.female_total_material or 0)
    male_total_cost = (calc_row.male_manufacturing_cost or 0) + (calc_row.male_total_material_cost or 0)

    # Part forming cost based on previous forming_percentage
    part_forming_cost = ((calc_row.forming_percentage or 0) / 100) * (female_total_cost + male_total_cost)
    calc_row.part_forming_cost = round((part_forming_cost * quantity), 2)
    calc_row.part_forming_cost_per_unit = round(part_forming_cost, 2)
    part_forming_cost_per_unit = part_forming_cost
    total_design_cost = 0
    if calc_row.tool_design_data:
        total_design_cost = calc_row.tool_design_data.get("total_design_cost", 0)
    # Total cost
    calc_row.male_total_cost_mfg_mat = male_total_cost
    calc_row.female_total_cost_mfg_mat = female_total_cost

    manufacturing_percentage_record = db.query(models.SheetmetalManufacturingPercentage).first()

    if manufacturing_percentage_record and manufacturing_percentage_record.Correction_factor:
        correction_factor = manufacturing_percentage_record.Correction_factor
    else:
        correction_factor = 1

    calc_row.total_cost_per_unit = (female_total_cost + male_total_cost + part_forming_cost_per_unit + total_design_cost)*correction_factor
    calc_row.total_cost = (calc_row.total_cost_per_unit * quantity)*correction_factor

    # --- Update MHR values ---
    calc_row.female_mhr = mhr
    calc_row.male_mhr = mhr
    calc_row.calculated_at = datetime.utcnow()

    db.commit()
    db.refresh(calc_row)

    return {
        "message": "Manufacturing cost updated successfully",
        "history_id": history_id,
        "female_manufacturing_cost_per_unit": calc_row.female_manufacturing_cost_per_unit,
        "part_forming_cost_per_unit": calc_row.part_forming_cost_per_unit,
        'part_forming_cost': calc_row.part_forming_cost,
        "total_design_cost": total_design_cost,

        "male_manufacturing_cost_per_unit": calc_row.male_manufacturing_cost_per_unit,
        "total_cost": calc_row.total_cost,
        "total_cost_per_unit": calc_row.total_cost_per_unit
    }


@router.get("/sheetmetal/all-draco-glb/{history_id}")
def get_all_sheetmetal_draco_glb(
        history_id: int,
        download: str = Query(None, description="File type to download: male, female, or part"),
        db: Session = Depends(get_db)
):
    """
    Get all three Draco-compressed GLB files info or download a specific file.
    """
    record = db.query(models.SheetMetalStepfileDetails).filter(
        models.SheetMetalStepfileDetails.history_id == history_id
    ).first()

    if not record:
        raise HTTPException(status_code=404, detail="No sheetmetal record found for this history_id.")

    # If download parameter is provided, return the specific file
    if download and download in ["male", "female", "part"]:
        file_mapping = {
            "male": (record.male_draco_glb_file, record.male_obj_filename, f"male_{history_id}.glb"),
            "female": (record.female_draco_glb_file, record.female_obj_filename, f"female_{history_id}.glb"),
            "part": (record.parts_draco_glb_file, record.parts_obj_filename, f"part_{history_id}.glb")
        }

        file_data, original_filename, default_filename = file_mapping[download]

        if not file_data:
            raise HTTPException(status_code=404, detail=f"{download.capitalize()} Draco GLB file not found")

        filename = original_filename or default_filename
        if not filename.lower().endswith('.glb'):
            filename = f"{os.path.splitext(filename)[0]}.glb"

        file_stream = io.BytesIO(file_data)
        return StreamingResponse(
            file_stream,
            media_type="model/gltf-binary",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

    # Otherwise return file information (original behavior)
    response = {"history_id": history_id, "files": {}}

    for file_type, file_data, original_filename in [
        ("male", record.male_draco_glb_file, record.male_obj_filename),
        ("female", record.female_draco_glb_file, record.female_obj_filename),
        ("part", record.parts_draco_glb_file, record.parts_obj_filename)
    ]:
        if file_data:
            filename = original_filename or f"{file_type}_{history_id}.glb"
            if not filename.lower().endswith('.glb'):
                filename = f"{os.path.splitext(filename)[0]}.glb"

            response["files"][file_type] = {
                "filename": filename,
                "download_url": f"/sheetmetal/all-draco-glb/{history_id}?download={file_type}",
                "size": len(file_data)
            }

    if not response["files"]:
        raise HTTPException(status_code=404, detail="No Draco GLB files found for this record.")

    return response


@router.get("/sheetmetal-history-details/", response_model=List[SheetMetalHistoryResponse])
async def get_sheetmetal_history_details(db: Session = Depends(get_db)):
    """
    Fetch all sheet metal history records combined with their calculation results
    """
    try:
        # Fetch all records from SheetMetalHistory with outer join to SheetmetalCalculationResult
        history_records = db.query(models.SheetMetalHistory, models.SheetmetalCalculationResult)\
            .outerjoin(models.SheetmetalCalculationResult, models.SheetMetalHistory.id == models.SheetmetalCalculationResult.history_id)\
            .order_by(models.SheetMetalHistory.created_at.desc())\
            .all()
        
        result = []
        
        for history_record, calc_record in history_records:
            # Combine data from both tables
            history_data = SheetMetalHistoryResponse(
                # SheetMetalHistory fields
                id=history_record.id,
                filename_female=history_record.filename_female,
                filename_male=history_record.filename_male,
                filename_part=history_record.filename_part,
                female_tool=history_record.female_tool,
                male_tool=history_record.male_tool,
                part=history_record.part,
                material_id=history_record.material_id,
                material_name=history_record.material_name,
                material_density=history_record.material_density,
                material_cost=history_record.material_cost,
                quantity=history_record.quantity,
                created_at=history_record.created_at,
                
                # SheetmetalCalculationResult fields (optional)
                calculation_id=calc_record.id if calc_record else None,
                history_id_calc=calc_record.history_id if calc_record else None,
                female_stock_dimensions=calc_record.female_stock_dimensions if calc_record else None,
                female_volume_removed_m3=calc_record.female_volume_removed_m3 if calc_record else None,
                female_roughing_mrr=calc_record.female_roughing_mrr if calc_record else None,
                female_finishing_mrr=calc_record.female_finishing_mrr if calc_record else None,
                female_roughing_time_hr=calc_record.female_roughing_time_hr if calc_record else None,
                female_finishing_time_hr=calc_record.female_finishing_time_hr if calc_record else None,
                female_total_machining_time_hr=calc_record.female_total_machining_time_hr if calc_record else None,
                female_manufacturing_percentage=calc_record.female_manufacturing_percentage if calc_record else None,
                female_manufacturing_time_hr=calc_record.female_manufacturing_time_hr if calc_record else None,
                female_mhr=calc_record.female_mhr if calc_record else None,
                female_roughing_percentage=calc_record.female_roughing_percentage if calc_record else None,
                female_finishing_percentage=calc_record.female_finishing_percentage if calc_record else None,
                male_stock_dimensions=calc_record.male_stock_dimensions if calc_record else None,
                male_volume_removed_m3=calc_record.male_volume_removed_m3 if calc_record else None,
                male_roughing_mrr=calc_record.male_roughing_mrr if calc_record else None,
                male_finishing_mrr=calc_record.male_finishing_mrr if calc_record else None,
                male_roughing_time_hr=calc_record.male_roughing_time_hr if calc_record else None,
                male_finishing_time_hr=calc_record.male_finishing_time_hr if calc_record else None,
                male_total_machining_time_hr=calc_record.male_total_machining_time_hr if calc_record else None,
                male_manufacturing_percentage=calc_record.male_manufacturing_percentage if calc_record else None,
                male_manufacturing_time_hr=calc_record.male_manufacturing_time_hr if calc_record else None,
                male_mhr=calc_record.male_mhr if calc_record else None,
                male_roughing_percentage=calc_record.male_roughing_percentage if calc_record else None,
                male_finishing_percentage=calc_record.male_finishing_percentage if calc_record else None,
                forming_percentage=calc_record.forming_percentage if calc_record else None,
                male_total_cost_mfg_mat=calc_record.male_total_cost_mfg_mat if calc_record else None,
                female_total_cost_mfg_mat=calc_record.female_total_cost_mfg_mat if calc_record else None,
                tool_design_data=calc_record.tool_design_data if calc_record else None,
                female_manufacturing_cost_per_unit=calc_record.female_manufacturing_cost_per_unit if calc_record else None,
                female_manufacturing_cost=calc_record.female_manufacturing_cost if calc_record else None,
                female_total_material_cost_per_unit=calc_record.female_total_material_cost_per_unit if calc_record else None,
                female_total_material=calc_record.female_total_material if calc_record else None,
                male_manufacturing_cost_per_unit=calc_record.male_manufacturing_cost_per_unit if calc_record else None,
                male_manufacturing_cost=calc_record.male_manufacturing_cost if calc_record else None,
                male_total_material_cost_per_unit=calc_record.male_total_material_cost_per_unit if calc_record else None,
                male_total_material_cost=calc_record.male_total_material_cost if calc_record else None,
                part_forming_cost_per_unit=calc_record.part_forming_cost_per_unit if calc_record else None,
                part_forming_cost=calc_record.part_forming_cost if calc_record else None,
                total_material_cost_per_unit=calc_record.total_material_cost_per_unit if calc_record else None,
                total_material_cost=calc_record.total_material_cost if calc_record else None,
                total_cost_per_unit=calc_record.total_cost_per_unit if calc_record else None,
                total_cost=calc_record.total_cost if calc_record else None,
                calculated_at=calc_record.calculated_at if calc_record else None
            )
            result.append(history_data)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching sheet metal history details: {str(e)}")


@router.get("/sheetmetal-history-cost/{history_id}", response_model=SheetMetalHistoryResponse)
async def get_sheetmetal_history_cost_by_id(history_id: int, db: Session = Depends(get_db)):
    """
    Fetch combined data from SheetMetalHistory and SheetmetalCalculationResult tables by history_id
    """
    try:
        # Fetch data from SheetMetalHistory
        history_details = db.query(models.SheetMetalHistory).filter(
            models.SheetMetalHistory.id == history_id
        ).first()
        
        if not history_details:
            raise HTTPException(status_code=404, detail="Sheet metal history details not found")
        
        # Fetch data from SheetmetalCalculationResult
        cost_details = db.query(models.SheetmetalCalculationResult).filter(
            models.SheetmetalCalculationResult.history_id == history_id
        ).first()
        
        # Combine the data
        combined_data = SheetMetalHistoryResponse(
            # SheetMetalHistory fields
            id=history_details.id,
            filename_female=history_details.filename_female,
            filename_male=history_details.filename_male,
            filename_part=history_details.filename_part,
            female_tool=history_details.female_tool,
            male_tool=history_details.male_tool,
            part=history_details.part,
            material_id=history_details.material_id,
            material_name=history_details.material_name,
            material_density=history_details.material_density,
            material_cost=history_details.material_cost,
            quantity=history_details.quantity,
            created_at=history_details.created_at,
            
            # SheetmetalCalculationResult fields (optional)
            calculation_id=cost_details.id if cost_details else None,
            history_id_calc=cost_details.history_id if cost_details else None,
            female_stock_dimensions=cost_details.female_stock_dimensions if cost_details else None,
            female_volume_removed_m3=cost_details.female_volume_removed_m3 if cost_details else None,
            female_roughing_mrr=cost_details.female_roughing_mrr if cost_details else None,
            female_finishing_mrr=cost_details.female_finishing_mrr if cost_details else None,
            female_roughing_time_hr=cost_details.female_roughing_time_hr if cost_details else None,
            female_finishing_time_hr=cost_details.female_finishing_time_hr if cost_details else None,
            female_total_machining_time_hr=cost_details.female_total_machining_time_hr if cost_details else None,
            female_manufacturing_percentage=cost_details.female_manufacturing_percentage if cost_details else None,
            female_manufacturing_time_hr=cost_details.female_manufacturing_time_hr if cost_details else None,
            female_mhr=cost_details.female_mhr if cost_details else None,
            female_roughing_percentage=cost_details.female_roughing_percentage if cost_details else None,
            female_finishing_percentage=cost_details.female_finishing_percentage if cost_details else None,
            male_stock_dimensions=cost_details.male_stock_dimensions if cost_details else None,
            male_volume_removed_m3=cost_details.male_volume_removed_m3 if cost_details else None,
            male_roughing_mrr=cost_details.male_roughing_mrr if cost_details else None,
            male_finishing_mrr=cost_details.male_finishing_mrr if cost_details else None,
            male_roughing_time_hr=cost_details.male_roughing_time_hr if cost_details else None,
            male_finishing_time_hr=cost_details.male_finishing_time_hr if cost_details else None,
            male_total_machining_time_hr=cost_details.male_total_machining_time_hr if cost_details else None,
            male_manufacturing_percentage=cost_details.male_manufacturing_percentage if cost_details else None,
            male_manufacturing_time_hr=cost_details.male_manufacturing_time_hr if cost_details else None,
            male_mhr=cost_details.male_mhr if cost_details else None,
            male_roughing_percentage=cost_details.male_roughing_percentage if cost_details else None,
            male_finishing_percentage=cost_details.male_finishing_percentage if cost_details else None,
            forming_percentage=cost_details.forming_percentage if cost_details else None,
            male_total_cost_mfg_mat=cost_details.male_total_cost_mfg_mat if cost_details else None,
            female_total_cost_mfg_mat=cost_details.female_total_cost_mfg_mat if cost_details else None,
            tool_design_data=cost_details.tool_design_data if cost_details else None,
            female_manufacturing_cost_per_unit=cost_details.female_manufacturing_cost_per_unit if cost_details else None,
            female_manufacturing_cost=cost_details.female_manufacturing_cost if cost_details else None,
            female_total_material_cost_per_unit=cost_details.female_total_material_cost_per_unit if cost_details else None,
            female_total_material=cost_details.female_total_material if cost_details else None,
            male_manufacturing_cost_per_unit=cost_details.male_manufacturing_cost_per_unit if cost_details else None,
            male_manufacturing_cost=cost_details.male_manufacturing_cost if cost_details else None,
            male_total_material_cost_per_unit=cost_details.male_total_material_cost_per_unit if cost_details else None,
            male_total_material_cost=cost_details.male_total_material_cost if cost_details else None,
            part_forming_cost_per_unit=cost_details.part_forming_cost_per_unit if cost_details else None,
            part_forming_cost=cost_details.part_forming_cost if cost_details else None,
            total_material_cost_per_unit=cost_details.total_material_cost_per_unit if cost_details else None,
            total_material_cost=cost_details.total_material_cost if cost_details else None,
            total_cost_per_unit=cost_details.total_cost_per_unit if cost_details else None,
            total_cost=cost_details.total_cost if cost_details else None,
            calculated_at=cost_details.calculated_at if cost_details else None
        )
        
        return combined_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching sheet metal history cost details: {str(e)}")



@router.post("/analyze-iges-sheetmetal/")
async def analyze_iges_sheetmetal(
    files: list[UploadFile] = File(...),
    material_id: int = Form(...),
    quantity: int = Form(1),
    db: Session = Depends(get_db)
):
    import os
    import uuid
    import shutil
    from datetime import datetime
    import cadquery as cq

    from OCP.IGESControl import IGESControl_Reader
    from OCP.TopExp import TopExp_Explorer
    from OCP.TopAbs import TopAbs_SOLID
    from OCP.GProp import GProp_GProps
    from OCP.BRepGProp import BRepGProp

    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")

    material = db.query(models.Sheet_metal_Materials).filter(
        models.Sheet_metal_Materials.id == material_id
    ).first()

    if not material or material.density is None:
        raise HTTPException(status_code=404, detail="Invalid material")

    material_name = material.material.strip()
    material_density = material.density
    material_cost = material.material_cost

    # =====================================================
    # 🔹 FUNCTION: LOAD + BBOX USING OCP + CADQUERY
    # =====================================================
    def process_iges(file_path):
        reader = IGESControl_Reader()
        status = reader.ReadFile(file_path)

        if status != 1:
            raise Exception("Failed to read IGES")

        reader.TransferRoots()
        shape = reader.OneShape()

        if shape.IsNull():
            raise Exception("Invalid IGES")

        # Extract solid
        explorer = TopExp_Explorer(shape, TopAbs_SOLID)
        solids = []
        while explorer.More():
            solids.append(explorer.Current())
            explorer.Next()

        if not solids:
            raise Exception("No solid found")

        shape = solids[0]

        # 🔥 BOUNDING BOX (CadQuery)
        cq_shape = cq.Shape(shape)
        part = cq.Workplane("XY").newObject([cq_shape])
        bb = part.val().BoundingBox()

        x_dim = bb.xlen
        y_dim = bb.ylen
        z_dim = bb.zlen

        dims_sorted = sorted(
            [(x_dim, 'X'), (y_dim, 'Y'), (z_dim, 'Z')],
            reverse=True,
            key=lambda x: x[0]
        )

        length = dims_sorted[0][0]
        breadth = dims_sorted[1][0]
        height = dims_sorted[2][0]

        # Volume
        props = GProp_GProps()
        BRepGProp.VolumeProperties_s(shape, props)
        volume_mm3 = props.Mass()

        return {
            "length": length,
            "breadth": breadth,
            "height": height,
            "volume_mm3": volume_mm3,
            "volume_m3": volume_mm3 / 1e9
        }

    try:
        # =====================================================
        # 🔷 CASE 1: SINGLE FILE
        # =====================================================
        if len(files) == 1:
            file = files[0]

            if not file.filename.lower().endswith((".igs", ".iges")):
                raise HTTPException(status_code=400, detail="Upload IGES file")

            file_path = f"uploads/{uuid.uuid4()}_{file.filename}"
            os.makedirs("uploads", exist_ok=True)

            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            try:
                result = process_iges(file_path)

                length = int(round(result["length"], 2))
                breadth = int(round(result["breadth"], 2))
                height = round(result["height"], 2)

                part_volume_mm3 = result["volume_mm3"]
                part_volume_m3 = result["volume_m3"]

                # TOOL LOGIC (same)
                TOOL_HEIGHT = 50
                TOOL_FACTOR = 0.7

                tool_volume_mm3 = length * breadth * TOOL_HEIGHT * TOOL_FACTOR
                tool_volume_m3 = tool_volume_mm3 / 1e9

                part_simple = {
                    "filename": file.filename,
                    "length": length,
                    "breadth": breadth,
                    "height": height,
                    "volume_mm3": round(part_volume_mm3, 2),
                    "volume_m3": round(part_volume_m3, 10)
                }

                male_tool_simple = {
                    "filename": file.filename,
                    "length": length,
                    "breadth": breadth,
                    "height": TOOL_HEIGHT,
                    "volume_mm3": round(tool_volume_mm3, 2),
                    "volume_m3": round(tool_volume_m3, 10)
                }

                female_tool_simple = male_tool_simple

                history = models.SheetMetalHistory(
                    filename_female=file.filename,
                    filename_male=file.filename,
                    filename_part=file.filename,
                    female_tool=female_tool_simple,
                    male_tool=male_tool_simple,
                    part=part_simple,
                    material_id=material_id,
                    material_name=material_name,
                    material_density=material_density,
                    material_cost=material_cost,
                    quantity=quantity,
                    created_at=datetime.utcnow()
                )

                db.add(history)
                db.commit()
                db.refresh(history)

                return {
                    "history_id": history.id,
                    "material": {
                        "id": material_id,
                        "name": material_name,
                        "density": material_density,
                        "cost": material_cost
                    },
                    "quantity": quantity,
                    "part": part_simple,
                    "male_tool": male_tool_simple,
                    "female_tool": female_tool_simple
                }

            finally:
                if os.path.exists(file_path):
                    os.remove(file_path)

        # =====================================================
        # 🔷 CASE 2: THREE FILES
        # =====================================================
        if len(files) != 3:
            raise HTTPException(status_code=400, detail="Upload 1 or 3 IGES files")

        analyzed = []

        for file in files:
            if not file.filename.lower().endswith((".igs", ".iges")):
                raise HTTPException(status_code=400, detail="Only IGES files allowed")

            file_path = f"uploads/{uuid.uuid4()}_{file.filename}"

            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            try:
                result = process_iges(file_path)

                analyzed.append({
                    "filename": file.filename,
                    "length": result["length"],
                    "breadth": result["breadth"],
                    "height": result["height"],
                    "volume_mm3": result["volume_mm3"],
                    "volume_m3": result["volume_m3"]
                })

            finally:
                if os.path.exists(file_path):
                    os.remove(file_path)

        analyzed.sort(key=lambda r: r["volume_m3"], reverse=True)

        female_tool = analyzed[0]
        male_tool = analyzed[1]
        part = analyzed[2]

        def simplify(tool):
            return {
                "filename": tool["filename"],
                "length": round(tool["length"], 2),
                "breadth": round(tool["breadth"], 2),
                "height": round(tool["height"], 2),
                "volume_mm3": round(tool["volume_mm3"]),
                "volume_m3": round(tool["volume_m3"], 10)
            }

        female_tool_simple = simplify(female_tool)
        male_tool_simple = simplify(male_tool)
        part_simple = simplify(part)

        history = models.SheetMetalHistory(
            filename_female=female_tool["filename"],
            filename_male=male_tool["filename"],
            filename_part=part["filename"],
            female_tool=female_tool_simple,
            male_tool=male_tool_simple,
            part=part_simple,
            material_id=material_id,
            material_name=material_name,
            material_density=material_density,
            material_cost=material_cost,
            quantity=quantity,
            created_at=datetime.utcnow()
        )

        db.add(history)
        db.commit()
        db.refresh(history)

        return {
            "history_id": history.id,
            "material": {
                "id": material_id,
                "name": material_name,
                "density": material_density,
                "cost": material_cost
            },
            "quantity": quantity,
            "female_tool": female_tool_simple,
            "male_tool": male_tool_simple,
            "part": part_simple
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        db.close()
