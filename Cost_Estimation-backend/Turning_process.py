import base64
import math
import io
from typing import List

from fastapi import APIRouter, UploadFile, File, HTTPException, Form, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from trimesh.util import jsonify

import models
from db import get_db, SessionLocal
from models import TurningMaterials, TurningPercentages, TurningParameters, TurningHistoryDetails, \
    TurningMachineHourRate, TurningMachiningCost, ManufacturingPercentage
from schemas import TurningMaterialCreate, MaterialCostUpdate, TurningParameterUpdate, TurningParameterCreate, \
    UpdateTurningPercentages, CreateMachineHourRate, UpdateMachineHourRate, UpdateManufacturingPercentage, \
    TurningMaterialDelete, TurningHistoryDetailsResponse, TurningHistoryCostResponse

router = APIRouter()

from pathlib import Path
import shutil
import uuid
import cadquery as cq
import trimesh


# below used to extract dimension and also calculate material cost and which all possible parameters and stored in db
@router.post("/bounding-box/")
async def get_bounding_box(
        file: UploadFile = File(...),
        material_id: int = Form(...),
        db: Session = Depends(get_db)
):
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = Path("uploads") / unique_filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # ---- File Type Detection and Processing ----
        file_extension = file.filename.lower().split('.')[-1]
        print(f"Turning Analysis - Processing file: {file.filename} (type: {file_extension})")
        
        if file_extension in ['step', 'stp']:
            # ---- STEP Processing ----
            print("Processing STEP file with CadQuery...")
            model = cq.importers.importStep(str(file_path))
            shape = model.val()
            bb = shape.BoundingBox()

            x_dim = bb.xmax - bb.xmin
            y_dim = bb.ymax - bb.ymin
            z_dim = bb.zmax - bb.zmin

            volume_mm3 = round(shape.Volume(), 2)  # mm³
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
            volume_mm3 = mesh.volume * (scale_factor ** 3)
            
            # Convert numpy types to regular Python types if needed
            x_dim = float(x_dim)
            y_dim = float(y_dim)
            z_dim = float(z_dim)
            
            print(f"STL dimensions: X={x_dim:.2f}, Y={y_dim:.2f}, Z={z_dim:.2f}, Volume={volume_mm3:.2f} mm³")
            
        else:
            raise HTTPException(status_code=400, detail="Only STEP, STP, and STL files are supported")

        # ---- Common Processing for All File Types ----

        dims_sorted = sorted(
            [(x_dim, "X"), (y_dim, "Y"), (z_dim, "Z")],
            reverse=True, key=lambda x: x[0]
        )

        length, breadth, height = (
            round(dims_sorted[0][0], 2),
            round(dims_sorted[1][0], 2),
            round(dims_sorted[2][0], 2),
        )

        # ---- Volume ----
        volume_m3 = round(volume_mm3 / 1e9, 10)  # m³

        # ---- Fetch Material ----
        material = db.query(TurningMaterials).filter(TurningMaterials.id == material_id).first()
        if not material:
            raise HTTPException(status_code=404, detail=f"Material with id {material_id} not found")

        # ---- Derived parameters (diameter, axis_length) ----
        diameter = None
        axis_length = None
        if length == breadth or length == height:
            diameter = length
            axis_length = breadth if length == height else height
        elif breadth == height:
            diameter = breadth
            axis_length = length
        else:
            threshold = 20
            diffs = [
                (abs(length - breadth), (length, breadth, height)),
                (abs(length - height), (length, height, breadth)),
                (abs(breadth - height), (breadth, height, length)),
            ]
            close_pair = min(diffs, key=lambda x: x[0])
            if close_pair[0] <= threshold:
                a, b, other = close_pair[1]
                diameter = max(a, b)
                axis_length = other

        # ---- Stock Dimensions ----
        diameter = math.floor(diameter + 0.5)
        print(diameter)
        stock_length = axis_length + 50
        stock_diameter = diameter + 10

        # ---- Stock Volume ----
        stock_volume_mm3 = round(math.pi * (stock_diameter ** 2) * stock_length / 4, 2)
        stock_volume_m3 = round(stock_volume_mm3 / 1e9, 10)

        density = material.density
        cost_per_kg = material.material_cost

        material_removed_m3 = stock_volume_m3 - volume_m3
        material_removed_mm3 = stock_volume_mm3 - volume_mm3
        stock_weight = stock_volume_m3 * density
        actual_mass = volume_m3 * density
        material_cost = stock_weight * cost_per_kg

        # ---- Fetch Percentages ----
        percentages = db.query(TurningPercentages).first()
        if not percentages:
            raise HTTPException(status_code=404, detail="Percentages table is empty")

        # Now you can directly use
        roughing_percentage = percentages.roughing_percentage
        finishing_percentage = percentages.finishing_percentage

        # ---- Fetch Parameters ----
        all_params = db.query(TurningParameters).filter(TurningParameters.material_id == material_id).all()
        if not all_params:
            raise HTTPException(status_code=404, detail=f"No parameters found for material {material_id}")

        # ---- Match stock_diameter with correct range ----
        selected_params = None
        for param in all_params:
            if "-" in param.diameter_range:
                # e.g. "20-50"
                low, high = map(float, param.diameter_range.split("-"))
                if low <= stock_diameter <= high:
                    selected_params = param
                    break
            elif ">" in param.diameter_range:
                # e.g. ">100"
                threshold = float(param.diameter_range.replace(">", ""))
                if stock_diameter > threshold:
                    selected_params = param
                    break
            elif "<" in param.diameter_range:
                # e.g. "<20"
                threshold = float(param.diameter_range.replace("<", ""))
                if stock_diameter < threshold:
                    selected_params = param
                    break

        if not selected_params:
            raise HTTPException(
                status_code=400,
                detail=f"No matching parameter range found for stock_diameter {stock_diameter}"
            )

        # ---- Calculate Roughing MRR ----
        roughing_mrr_mm3_min = (
                    selected_params.roughing_feed_rate * selected_params.roughing_depth_of_cut * selected_params.roughing_cutting_speed * 1000)

        # ---- Calculate Finishing MRR ----
        finishing_mrr_mm3_min = (
                    selected_params.finishing_feed_rate * selected_params.finishing_depth_of_cut * selected_params.finishing_cutting_speed * 1000)

        # roughing_mrr_kg_hr = roughing_mrr_mm3_min * density * 6e-8
        # finishing_mrr_kg_hr = finishing_mrr_mm3_min * density * 6e-8

        # ---- Machining Times ----
        roughing_time = ((material_removed_mm3 * (roughing_percentage / 100)) / roughing_mrr_mm3_min) / 60
        finishing_time = (material_removed_mm3 * (finishing_percentage / 100)) / finishing_mrr_mm3_min / 60
        machining_hours = (roughing_time + finishing_time)

        # ---- Convert all numpy types to regular Python types before database storage ----
        length = float(length)
        breadth = float(breadth)
        height = float(height)
        volume_mm3 = float(volume_mm3)
        volume_m3 = float(volume_m3)
        diameter = float(diameter)
        axis_length = float(axis_length)
        stock_length = float(stock_length)
        stock_diameter = float(stock_diameter)
        stock_volume_mm3 = float(stock_volume_mm3)
        stock_volume_m3 = float(stock_volume_m3)
        material_removed_m3 = float(material_removed_m3)
        stock_weight = float(stock_weight)
        material_cost = float(material_cost)
        roughing_mrr_mm3_min = float(roughing_mrr_mm3_min)
        finishing_mrr_mm3_min = float(finishing_mrr_mm3_min)
        roughing_time = float(roughing_time)
        finishing_time = float(finishing_time)
        machining_hours = float(machining_hours)

        history = TurningHistoryDetails(
            filename=file.filename,
            length=length,
            breadth=breadth,
            height=height,
            volume_mm3=volume_mm3,
            volume_m3=volume_m3,
            material_id=material.id,
            material_name=material.material,
            material_specification=material.material_specification,
            density=material.density,
            material_cost=material.material_cost,
            diameter=diameter,
            axis_length=axis_length,
            stock_length=stock_length,
            stock_diameter=stock_diameter,
            stock_volume_mm3=stock_volume_mm3,
            stock_volume_m3=stock_volume_m3,
            material_removed_m3=material_removed_m3,
            stock_weight_kg=stock_weight,
            Material_cost=material_cost,
            roughing_mrr=roughing_mrr_mm3_min,
            finishing_mrr=finishing_mrr_mm3_min,
            roughing_time=roughing_time,
            finishing_time=finishing_time,
            machining_hours=machining_hours,
            diameter_range=selected_params.diameter_range,
            roughing_depth_of_cut=selected_params.roughing_depth_of_cut,
            roughing_feed_rate=selected_params.roughing_feed_rate,
            roughing_cutting_speed=selected_params.roughing_cutting_speed,
            finishing_depth_of_cut=selected_params.finishing_depth_of_cut,
            finishing_feed_rate=selected_params.finishing_feed_rate,
            finishing_cutting_speed=selected_params.finishing_cutting_speed,
        )
        db.add(history)
        db.commit()
        db.refresh(history)

        return {
            "id": history.id,  # ✅ Return the history ID
            "filename": file.filename,
            "bounding_box": {
                "length": length,
                "breadth": breadth,
                "height": height,
            },
            "volume": {
                "mm3": volume_mm3,
                "m3": volume_m3,
                "actual_mass": actual_mass
            },
            "material": {
                "id": material.id,
                "name": material.material,
                "specification": material.material_specification,
                "density": material.density,
                "material_cost": material.material_cost
            },
            "derived_parameters": {
                "diameter": diameter,
                "axis_length": axis_length,
            },
            "stock": {
                "stock_length": stock_length,
                "stock_diameter": stock_diameter,
                "stock_volume_mm3": stock_volume_mm3,
                "stock_volume_m3": stock_volume_m3,
                "material_removed_m3": material_removed_m3,
                "stock_weight_kg": stock_weight,
                "Material_cost": material_cost
            },
            "machining": {
                "roughing_mrr": roughing_mrr_mm3_min,
                "finishing_mrr": finishing_mrr_mm3_min,
                "roughing_time": roughing_time,
                "finishing_time": finishing_time,
                "machining_hours": machining_hours
            },
            "selected_parameters": {
                "diameter_range": selected_params.diameter_range,
                "roughing_depth_of_cut": selected_params.roughing_depth_of_cut,
                "roughing_feed_rate": selected_params.roughing_feed_rate,
                "roughing_cutting_speed": selected_params.roughing_cutting_speed,
                "finishing_depth_of_cut": selected_params.finishing_depth_of_cut,
                "finishing_feed_rate": selected_params.finishing_feed_rate,
                "finishing_cutting_speed": selected_params.finishing_cutting_speed,
            }
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing STEP file: {str(e)}")

    finally:
        file_path.unlink(missing_ok=True)


# it stores the total cost with material cost included and also has machining cost seperately
# @router.post("/calculate-machining-cost/")
# def calculate_machining_cost(
#     turning_history_id: int = Form(...),
#     turning_percentage: float = Form(...),
#     boring_percentage: float = Form(...),
#     threading_percentage: float = Form(...),
#     milling_percentage: float = Form(...),
#     quantity: int = Form(1),
#     db: Session = Depends(get_db)
# ):
#     # 1️⃣ Fetch the history record
#     history = db.query(TurningHistoryDetails).filter(TurningHistoryDetails.id == turning_history_id).first()
#     if not history:
#         raise HTTPException(status_code=404, detail="Turning history record not found")
#
#     manufacturing_percentage_row = db.query(ManufacturingPercentage).first()
#     if not manufacturing_percentage_row:
#         raise HTTPException(status_code=404, detail="Manufacturing percentage not found")
#
#     percentage_of_manufacturing = manufacturing_percentage_row.percentage_of_manufacturing_time
#
#     machining_hours = history.machining_hours
#     Manufacturing_hours = (100 / percentage_of_manufacturing) * machining_hours
#     material_id = history.material_id
#     stock_diameter = history.stock_diameter
#     stock_length = history.stock_length
#     longest = max(stock_diameter, stock_length)
#     Material_cost=history.Material_cost
#     filename=history.filename
#     print(Material_cost)
#
#     # 2️⃣ Fetch all rates for this material
#     rates_list = db.query(TurningMachineHourRate).filter(TurningMachineHourRate.material_id == material_id).all()
#     if not rates_list:
#         raise HTTPException(status_code=404, detail="Machine rates not found for this material")
#
#     selected_rate = None
#     for rate in rates_list:
#         # Parse diameter_condition: "Dia<200*400"
#         try:
#             dia_part, len_part = rate.diameter_condition.replace("Dia<", "").split("*")
#             dia_limit = float(dia_part)
#             len_limit = float(len_part)
#         except Exception:
#             continue  # skip malformed entries
#
#         # Choose the limit to compare based on the longest dimension
#         limit_to_check = dia_limit if stock_diameter >= stock_length else len_limit
#
#         if longest <= limit_to_check:
#             selected_rate = rate
#             print(selected_rate)
#             break
#
#     if not selected_rate:
#         raise HTTPException(status_code=400, detail="No matching machine rate found for the stock size")
#     print(selected_rate.turning_rate)
#     print(selected_rate.boring_rate)
#     print(selected_rate.threading_rate)
#     print(selected_rate.milling_rate)
#
#     # 3️⃣ Calculate cost
#     cost_turning = Manufacturing_hours * (turning_percentage / 100) * selected_rate.turning_rate
#
#     cost_boring = Manufacturing_hours * (boring_percentage / 100) * selected_rate.boring_rate
#     cost_threading = Manufacturing_hours * (threading_percentage / 100) * selected_rate.threading_rate
#     cost_milling = Manufacturing_hours * (milling_percentage / 100) * selected_rate.milling_rate
#
#     Material_cost_per_unit=Material_cost
#     Total_material_cost=Material_cost*quantity
#
#     total_Machining_cost_per_unit= cost_turning + cost_boring + cost_threading + cost_milling
#     print(total_Machining_cost_per_unit)
#     total_cost_without_material_cost = total_Machining_cost_per_unit*quantity
#     total_cost_with_material_cost=(total_Machining_cost_per_unit + Material_cost)*quantity
#     total_machining_cost=total_Machining_cost_per_unit*quantity
#
#     machining_cost_record = TurningMachiningCost(
#         history_id=turning_history_id,
#         filename=filename,
#         turning_percentage=turning_percentage,
#         boring_percentage=boring_percentage,
#         threading_percentage=threading_percentage,
#         milling_percentage=milling_percentage,
#         turning_cost=cost_turning,
#         boring_cost=cost_boring,
#         threading_cost=cost_threading,
#         milling_cost=cost_milling,
#         total_machining_cost_per_unit=total_Machining_cost_per_unit,
#         Material_cost_per_unit=Material_cost_per_unit ,
#         total_material_cost=Total_material_cost,
#         total_cost_without_material_cost=total_cost_without_material_cost,
#         total_Manufacturing_time=Manufacturing_hours,
#         quantity=quantity,
#         total_cost_with_material_cost=total_cost_with_material_cost,
#         total_machining_cost=total_machining_cost
#     )
#
#     db.add(machining_cost_record)
#     db.commit()
#     db.refresh(machining_cost_record)
#
#     # 5️⃣ Return response
#     return {
#         "id": machining_cost_record.id,
#         "history_id": turning_history_id,
#         "quantity": quantity,
#         "turning_cost": cost_turning,
#         "boring_cost": cost_boring,
#         "threading_cost": cost_threading,
#         "milling_cost": cost_milling,
#         "total_machining_cost_per_unit": total_Machining_cost_per_unit,
#         "total_Machining_cost":total_machining_cost,
#
#         "total_cost_without_material_cost": total_cost_with_material_cost,
#         "total_cost_with_material_cost":total_cost_with_material_cost,
#         "Material_cost_per_unit":Material_cost,
#         "total_material_cost":Total_material_cost
#     }





# both dia and length checked



@router.post("/calculate-machining-cost/")
def calculate_machining_cost(
        turning_history_id: int = Form(...),
        turning_percentage: float = Form(...),
        boring_percentage: float = Form(...),
        threading_percentage: float = Form(...),
        milling_percentage: float = Form(...),
        quantity: int = Form(1),
        db: Session = Depends(get_db)
):
    # 1️⃣ Fetch the history record
    history = db.query(TurningHistoryDetails).filter(
        TurningHistoryDetails.id == turning_history_id
    ).first()
    if not history:
        raise HTTPException(status_code=404, detail="Turning history record not found")

    manufacturing_percentage_row = db.query(ManufacturingPercentage).first()
    if not manufacturing_percentage_row:
        raise HTTPException(status_code=404, detail="Manufacturing percentage not found")

    percentage_of_manufacturing = manufacturing_percentage_row.percentage_of_manufacturing_time

    machining_hours = history.machining_hours
    Manufacturing_hours = (100 / percentage_of_manufacturing) * machining_hours
    material_id = history.material_id
    stock_diameter = history.stock_diameter
    stock_length = history.stock_length
    Material_cost = history.Material_cost
    filename = history.filename

    # 2️⃣ Fetch all rates for this material
    rates_list = db.query(TurningMachineHourRate).filter(
        TurningMachineHourRate.material_id == material_id
    ).all()
    if not rates_list:
        raise HTTPException(status_code=404, detail="Machine rates not found for this material")

    # ✅ Select the correct rate by checking BOTH diameter and length
    selected_rate = None
    selected_condition = None
    for rate in rates_list:
        try:
            # Example: "Dia<200*400"
            dia_part, len_part = rate.diameter_condition.replace("Dia<", "").split("*")
            dia_limit = float(dia_part)
            len_limit = float(len_part)
        except Exception:
            continue  # Skip malformed entries safely

        # ✅ Check both diameter and length
        if stock_diameter <= dia_limit and stock_length <= len_limit:
            selected_rate = rate
            selected_condition = rate.diameter_condition
            print(f"✅ Selected rate: {rate.diameter_condition}")
            break

    if not selected_rate:
        raise HTTPException(status_code=400, detail="No matching machine rate found for the stock size")

    # Debug prints (optional)
    print(f"Turning Rate: {selected_rate.turning_rate}")
    print(f"Boring Rate: {selected_rate.boring_rate}")
    print(f"Threading Rate: {selected_rate.threading_rate}")
    print(f"Milling Rate: {selected_rate.milling_rate}")

    # 3️⃣ Calculate cost
    cost_turning = Manufacturing_hours * (turning_percentage / 100) * selected_rate.turning_rate
    cost_boring = Manufacturing_hours * (boring_percentage / 100) * selected_rate.boring_rate
    cost_threading = Manufacturing_hours * (threading_percentage / 100) * selected_rate.threading_rate
    cost_milling = Manufacturing_hours * (milling_percentage / 100) * selected_rate.milling_rate

    Material_cost_per_unit = Material_cost
    Total_material_cost = Material_cost * quantity

    total_Machining_cost_per_unit = cost_turning + cost_boring + cost_threading + cost_milling
    total_Machining_cost_per_unit=total_Machining_cost_per_unit * manufacturing_percentage_row.Correction_factor
    total_cost_without_material_cost = total_Machining_cost_per_unit * quantity
    total_cost_with_material_cost = (total_Machining_cost_per_unit + Material_cost) * quantity
    total_machining_cost = total_Machining_cost_per_unit * quantity
    total_cost_per_unit_with_materials = total_Machining_cost_per_unit + Material_cost_per_unit

    # 4️⃣ Store record in DB
    machining_cost_record = TurningMachiningCost(
        history_id=turning_history_id,
        filename=filename,
        turning_percentage=turning_percentage,
        boring_percentage=boring_percentage,
        threading_percentage=threading_percentage,
        milling_percentage=milling_percentage,
        turning_cost=cost_turning,
        boring_cost=cost_boring,
        threading_cost=cost_threading,
        milling_cost=cost_milling,
        total_machining_cost_per_unit=total_Machining_cost_per_unit,
        Material_cost_per_unit=Material_cost_per_unit,
        total_material_cost=Total_material_cost,
        total_cost_without_material_cost=total_cost_without_material_cost,
        total_Manufacturing_time=Manufacturing_hours,
        quantity=quantity,
        total_cost_with_material_cost=total_cost_with_material_cost,
        total_machining_cost=total_machining_cost,

        turning_size=selected_condition,
        milling_size=selected_condition,
        boring_size=selected_condition,
        threading_size=selected_condition,

    )

    db.add(machining_cost_record)
    db.commit()
    db.refresh(machining_cost_record)

    # 5️⃣ Return response
    return {
        "id": machining_cost_record.id,
        "history_id": turning_history_id,
        "quantity": quantity,
        "turning_cost": cost_turning,
        "boring_cost": cost_boring,
        "threading_cost": cost_threading,
        "milling_cost": cost_milling,
        "total_machining_cost_per_unit": total_Machining_cost_per_unit,
        "total_machining_cost": total_machining_cost,
        # "total_cost_without_material_cost": total_cost_without_material_cost,

        "Material_cost_per_unit": Material_cost,
        "total_material_cost": Total_material_cost,
        "turning_size": selected_condition,
        "milling_size": selected_condition,
        "boring_size": selected_condition,
        "threading_size": selected_condition,
        "total_cost_per_unit_with_materials": total_cost_per_unit_with_materials,
        "total_cost_with_material_cost": total_cost_with_material_cost

    }


# to get  all the materials available in the table
@router.get('/turning-materials')
def get_all_turning_materials(db: Session = Depends(get_db)):
    try:
        materials = db.query(TurningMaterials).all()

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
        print(f"Error fetching TurningMaterials: {e}")
        return {"success": False, "error": "Internal server error"}


# below code to create new material with all details
# @router.post("/materials/")
# def create_material(material_data: TurningMaterialCreate, db: Session = Depends(get_db)):
#     # 1️⃣ Create the material
#     material = TurningMaterials(
#         material=material_data.material,
#         material_specification=material_data.material_specification,
#         density=material_data.density,
#         material_cost=material_data.material_cost
#     )
#     db.add(material)
#     db.commit()
#     db.refresh(material)  # to get the ID
#
#     # 2️⃣ Add Turning Parameters
#     for param in material_data.parameters:
#         turning_param = TurningParameters(
#             material_id=material.id,
#             diameter_range=param.diameter_range,
#             roughing_depth_of_cut=param.roughing_depth_of_cut,
#             roughing_feed_rate=param.roughing_feed_rate,
#             roughing_cutting_speed=param.roughing_cutting_speed,
#             finishing_depth_of_cut=param.finishing_depth_of_cut,
#             finishing_feed_rate=param.finishing_feed_rate,
#             finishing_cutting_speed=param.finishing_cutting_speed
#         )
#         db.add(turning_param)
#
#     # 3️⃣ Add Machine Hour Rates
#     for rate in material_data.mhr_rates:
#         mhr = TurningMachineHourRate(
#             material_id=material.id,
#             diameter_condition=rate.diameter_condition,
#             turning_rate=rate.turning_rate,
#             boring_rate=rate.boring_rate,
#             threading_rate=rate.threading_rate,
#             milling_rate=rate.milling_rate
#         )
#         db.add(mhr)
#
#     db.commit()
#     return {"message": "Material and related data created successfully", "material_id": material.id}
@router.post("/turning_create_materials/")
def create_material(material_data: TurningMaterialCreate, db: Session = Depends(get_db)):
    # 1️⃣ Check for duplicate material (exact match)
    existing = db.query(models.TurningMaterials).filter(
        models.TurningMaterials.material == material_data.material,
        models.TurningMaterials.material_specification == material_data.material_specification,
        models.TurningMaterials.density == material_data.density,
        models.TurningMaterials.material_cost == material_data.material_cost
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Material already present with identical details")

    # 2️⃣ Create the new material
    material = models.TurningMaterials(
        material=material_data.material,
        material_specification=material_data.material_specification,
        density=material_data.density,
        material_cost=material_data.material_cost
    )
    db.add(material)
    db.commit()
    db.refresh(material)  # ✅ to get material.id

    # 3️⃣ Add Turning Parameters — include material name
    for param in material_data.parameters:
        turning_param = models.TurningParameters(
            material_id=material.id,
            material=material.material,  # ✅ Store material name
            diameter_range=param.diameter_range,
            roughing_depth_of_cut=param.roughing_depth_of_cut,
            roughing_feed_rate=param.roughing_feed_rate,
            roughing_cutting_speed=param.roughing_cutting_speed,
            finishing_depth_of_cut=param.finishing_depth_of_cut,
            finishing_feed_rate=param.finishing_feed_rate,
            finishing_cutting_speed=param.finishing_cutting_speed
        )
        db.add(turning_param)

    # 4️⃣ Add Machine Hour Rates — include material name
    for rate in material_data.mhr_rates:
        mhr = models.TurningMachineHourRate(
            material_id=material.id,
            material=material.material,  # ✅ Store material name
            diameter_condition=rate.diameter_condition,
            turning_rate=rate.turning_rate,
            boring_rate=rate.boring_rate,
            threading_rate=rate.threading_rate,
            milling_rate=rate.milling_rate
        )
        db.add(mhr)

    db.commit()

    return {
        "message": "Material and related data created successfully",
        "material_id": material.id,
        "material": material.material,
        "parameters_added": len(material_data.parameters),
        "mhr_rates_added": len(material_data.mhr_rates)
    }


# below is used to update cost of existing material
@router.put("/materials/update-cost/")
def update_material_cost(update_data: MaterialCostUpdate, db: Session = Depends(get_db)):
    # 1️⃣ Fetch the material with exact match
    material = db.query(TurningMaterials).filter(
        TurningMaterials.id == update_data.id,
        TurningMaterials.material == update_data.material,
        TurningMaterials.material_specification == update_data.material_specification
    ).first()

    # 2️⃣ If no match, raise 404
    if not material:
        raise HTTPException(status_code=404, detail="Material not found with given details")

    # 3️⃣ Update the cost
    material.material_cost = update_data.new_cost
    db.commit()
    db.refresh(material)

    return {"message": "Material cost updated successfully", "material_id": material.id,
            "new_cost": material.material_cost}


# below endpoint use for when they wanna update value for existing by passing the dia range and material_id
# old working one'''
# @router.put("/turning-parameters/update/")
# def update_turning_parameter(update_data: TurningParameterUpdate, db: Session = Depends(get_db)):
#     # 1️⃣ Find the matching row
#     param_row = db.query(TurningParameters).filter(
#         TurningParameters.material_id == update_data.material_id,
#         TurningParameters.diameter_range == update_data.diameter_range
#     ).first()
#
#     if not param_row:
#         raise HTTPException(status_code=404, detail="Turning parameter not found for given material_id and diameter_range")
#
#     # 2️⃣ Update only the fields provided
#     for field, value in update_data.dict(exclude={"material_id", "diameter_range"}).items():
#         if value is not None:
#             setattr(param_row, field, value)
#
#     db.commit()
#     db.refresh(param_row)
#
#     return {"message": "Turning parameter updated successfully", "id": param_row.id}


# ''''new one''''
@router.put("/turning-parameters/update/")
def update_turning_parameter(
        update_data: TurningParameterUpdate,
        db: Session = Depends(get_db)
):
    """
    Update turning parameters using material name and old_diameter_range.
    Also allows changing the diameter_range itself.
    """

    # 1️⃣ Find the matching row using material and old diameter range
    param_row = db.query(models.TurningParameters).filter(
        models.TurningParameters.material == update_data.material,
        models.TurningParameters.diameter_range == update_data.old_diameter_range
    ).first()

    if not param_row:
        raise HTTPException(status_code=404,
                            detail="Turning parameter not found for given material and old diameter range")

    # 2️⃣ Validate new_diameter_range format
    import re
    # Allowed patterns: 51-100, >101, <20 (numbers can vary)
    range_pattern = r'^(?:\d+-\d+|>\d+|<\d+)$'
    if not re.match(range_pattern, update_data.new_diameter_range.strip()):
        raise HTTPException(
            status_code=400,
            detail="Invalid new_diameter_range format. Allowed formats: '51-100', '>101', '<20' (numbers can vary)"
        )

    # 3️⃣ Check for overlapping or conflicting diameter_range for this material (excluding current record)
    existing_rows = db.query(models.TurningParameters).filter(
        models.TurningParameters.material == update_data.material,
        models.TurningParameters.id != param_row.id  # Exclude current record
    ).all()

    new_range = update_data.new_diameter_range.strip()
    
    for existing in existing_rows:
        existing_range = existing.diameter_range.strip()
        
        # Exact match check
        if new_range == existing_range:
            raise HTTPException(status_code=400, detail="Diameter range already exists for this material")
        
        # Overlap check for range formats (e.g., "30-60" vs "40-50")
        if '-' in new_range and '-' in existing_range:
            try:
                new_start, new_end = map(int, new_range.split('-'))
                existing_start, existing_end = map(int, existing_range.split('-'))
                
                # Check if ranges overlap
                if not (new_end < existing_start or new_start > existing_end):
                    raise HTTPException(
                        status_code=400, 
                        detail=f"Diameter range {new_range} overlaps with existing range {existing_range}"
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
                            detail=f"Diameter range {new_range} falls within existing range {existing_range}"
                        )
                elif new_range.startswith('<'):
                    new_val = int(new_range[1:])
                    if new_val >= existing_start and new_val <= existing_end:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Diameter range {new_range} falls within existing range {existing_range}"
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
                            detail=f"Diameter range {new_range} conflicts with existing range {existing_range}"
                        )
                elif new_range.startswith('>'):
                    new_val = int(new_range[1:])
                    if new_val >= existing_min:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Diameter range {new_range} is covered by existing range {existing_range}"
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
                            detail=f"Diameter range {new_range} conflicts with existing range {existing_range}"
                        )
                elif new_range.startswith('<'):
                    new_val = int(new_range[1:])
                    if new_val <= existing_max:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Diameter range {new_range} is covered by existing range {existing_range}"
                        )
            except ValueError:
                continue

    # 4️⃣ Update all fields (including diameter_range)
    param_row.diameter_range = update_data.new_diameter_range.strip()
    param_row.roughing_depth_of_cut = update_data.roughing_depth_of_cut
    param_row.roughing_feed_rate = update_data.roughing_feed_rate
    param_row.roughing_cutting_speed = update_data.roughing_cutting_speed
    param_row.finishing_depth_of_cut = update_data.finishing_depth_of_cut
    param_row.finishing_feed_rate = update_data.finishing_feed_rate
    param_row.finishing_cutting_speed = update_data.finishing_cutting_speed

    # 5️⃣ Commit the update
    db.commit()
    db.refresh(param_row)

    return {
        "message": "Turning parameter updated successfully",
        "id": param_row.id,
        "material": param_row.material,
        "old_diameter_range": update_data.old_diameter_range,
        "new_diameter_range": param_row.diameter_range
    }


# this is use to create new row but before inserting it will check whether materal is present inside the material table based on material id
# @router.post("/turning-parameters/add/")
# def add_turning_parameter(param_data: TurningParameterCreate, db: Session = Depends(get_db)):
#     # 1️⃣ Check if material exists
#     material = db.query(TurningMaterials).filter(TurningMaterials.id == param_data.material_id).first()
#     if not material:
#         raise HTTPException(status_code=404, detail="Material not found for the given material_id")
#
#     # 2️⃣ Create new TurningParameters row
#     new_param = TurningParameters(
#         material_id=param_data.material_id,
#         diameter_range=param_data.diameter_range,
#         roughing_depth_of_cut=param_data.roughing_depth_of_cut,
#         roughing_feed_rate=param_data.roughing_feed_rate,
#         roughing_cutting_speed=param_data.roughing_cutting_speed,
#         finishing_depth_of_cut=param_data.finishing_depth_of_cut,
#         finishing_feed_rate=param_data.finishing_feed_rate,
#         finishing_cutting_speed=param_data.finishing_cutting_speed
#     )
#
#     db.add(new_param)
#     db.commit()
#     db.refresh(new_param)
#
#     return {"message": "New turning parameter added successfully", "id": new_param.id}


@router.post("/turning-parameters/add/")
def add_turning_parameter(param_data: TurningParameterCreate, db: Session = Depends(get_db)):
    """
    Add a new turning parameter. Fetch material name using material_id
    and store it in the local 'material' column.
    """

    # 1️⃣ Check if material exists
    material = db.query(models.TurningMaterials).filter(
        models.TurningMaterials.id == param_data.material_id
    ).first()

    if not material:
        raise HTTPException(status_code=404, detail="Material not found for the given material_id")

    # 2️⃣ Validate diameter_range format
    import re
    # Allowed patterns: 51-100, >101, <20 (numbers can vary)
    range_pattern = r'^(?:\d+-\d+|>\d+|<\d+)$'
    if not re.match(range_pattern, param_data.diameter_range.strip()):
        raise HTTPException(
            status_code=400,
            detail="Invalid diameter_range format. Allowed formats: '51-100', '>101', '<20' (numbers can vary)"
        )

    # 3️⃣ Check for overlapping or conflicting diameter_range for this material
    existing_rows = db.query(models.TurningParameters).filter(
        models.TurningParameters.material_id == param_data.material_id
    ).all()

    new_range = param_data.diameter_range.strip()
    
    for existing in existing_rows:
        existing_range = existing.diameter_range.strip()
        
        # Exact match check
        if new_range == existing_range:
            raise HTTPException(status_code=400, detail="Diameter range already exists for this material")
        
        # Overlap check for range formats (e.g., "30-60" vs "40-50")
        if '-' in new_range and '-' in existing_range:
            try:
                new_start, new_end = map(int, new_range.split('-'))
                existing_start, existing_end = map(int, existing_range.split('-'))
                
                # Check if ranges overlap
                if not (new_end < existing_start or new_start > existing_end):
                    raise HTTPException(
                        status_code=400, 
                        detail=f"Diameter range {new_range} overlaps with existing range {existing_range}"
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
                            detail=f"Diameter range {new_range} falls within existing range {existing_range}"
                        )
                elif new_range.startswith('<'):
                    new_val = int(new_range[1:])
                    if new_val >= existing_start and new_val <= existing_end:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Diameter range {new_range} falls within existing range {existing_range}"
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
                            detail=f"Diameter range {new_range} conflicts with existing range {existing_range}"
                        )
                elif new_range.startswith('>'):
                    new_val = int(new_range[1:])
                    if new_val >= existing_min:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Diameter range {new_range} is covered by existing range {existing_range}"
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
                            detail=f"Diameter range {new_range} conflicts with existing range {existing_range}"
                        )
                elif new_range.startswith('<'):
                    new_val = int(new_range[1:])
                    if new_val <= existing_max:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Diameter range {new_range} is covered by existing range {existing_range}"
                        )
            except ValueError:
                continue

    # 4️⃣ Create new TurningParameters row (include local 'material' column)
    new_param = models.TurningParameters(
        material_id=param_data.material_id,
        material=material.material,  # ✅ store material name here
        diameter_range=param_data.diameter_range.strip(),
        roughing_depth_of_cut=param_data.roughing_depth_of_cut,
        roughing_feed_rate=param_data.roughing_feed_rate,
        roughing_cutting_speed=param_data.roughing_cutting_speed,
        finishing_depth_of_cut=param_data.finishing_depth_of_cut,
        finishing_feed_rate=param_data.finishing_feed_rate,
        finishing_cutting_speed=param_data.finishing_cutting_speed
    )

    db.add(new_param)
    db.commit()
    db.refresh(new_param)

    return {
        "message": "New turning parameter added successfully",
        "id": new_param.id,
        "material": new_param.material,
        "diameter_range": new_param.diameter_range
    }


# this is used to get all rows from the existing table
# @router.get("/turning-parameters/")
# def get_all_turning_parameters(db: Session = Depends(get_db)):
#     # 1️⃣ Query all rows
#     params = db.query(TurningParameters).all()
#
#     # 2️⃣ Convert to list of dictionaries
#     result = []
#     for p in params:
#         result.append({
#             "id": p.id,
#             "material_id": p.material_id,
#             "diameter_range": p.diameter_range,
#             "roughing_depth_of_cut": p.roughing_depth_of_cut,
#             "roughing_feed_rate": p.roughing_feed_rate,
#             "roughing_cutting_speed": p.roughing_cutting_speed,
#             "finishing_depth_of_cut": p.finishing_depth_of_cut,
#             "finishing_feed_rate": p.finishing_feed_rate,
#             "finishing_cutting_speed": p.finishing_cutting_speed
#         })
#
#     return result


@router.get("/turning-parameters/")
def get_all_turning_parameters(db: Session = Depends(get_db)):
    # 1️⃣ Query all rows from Turning_Parameters
    params = db.query(models.TurningParameters).all()

    # 2️⃣ Convert to list of dictionaries
    result = []
    for p in params:
        result.append({
            "id": p.id,
            "material_id": p.material_id,
            "material": p.material,  # ✅ Fetch directly from local column
            "diameter_range": p.diameter_range,
            "roughing_depth_of_cut": p.roughing_depth_of_cut,
            "roughing_feed_rate": p.roughing_feed_rate,
            "roughing_cutting_speed": p.roughing_cutting_speed,
            "finishing_depth_of_cut": p.finishing_depth_of_cut,
            "finishing_feed_rate": p.finishing_feed_rate,
            "finishing_cutting_speed": p.finishing_cutting_speed
        })

    return result


# this is used  to get all values in this table
@router.get("/turning-percentages/")
def get_all_turning_percentages(db: Session = Depends(get_db)):
    # 1️⃣ Fetch all rows
    percentages = db.query(TurningPercentages).all()

    # 2️⃣ Convert to list of dicts
    result = []
    for p in percentages:
        result.append({
            "id": p.id,
            "roughing_percentage": p.roughing_percentage,
            "finishing_percentage": p.finishing_percentage
        })

    return result


# to update the value of the any percentage but it will check before inserting whether total percentage crosses 100
@router.put("/turning-percentages/")
def update_turning_percentages(data: UpdateTurningPercentages, db: Session = Depends(get_db)):
    # Validation: Ensure total <= 100
    if data.roughing_percentage + data.finishing_percentage > 100:
        raise HTTPException(
            status_code=400,
            detail="Total percentage exceeds 100. Please adjust values."
        )

    percentages = db.query(TurningPercentages).first()

    # If no row exists, create one
    if not percentages:
        percentages = TurningPercentages(
            roughing_percentage=data.roughing_percentage,
            finishing_percentage=data.finishing_percentage
        )
        db.add(percentages)
    else:
        percentages.roughing_percentage = data.roughing_percentage
        percentages.finishing_percentage = data.finishing_percentage

    db.commit()
    db.refresh(percentages)

    return {
        "message": "Turning percentages updated successfully",
        "data": {
            "roughing_percentage": percentages.roughing_percentage,
            "finishing_percentage": percentages.finishing_percentage
        }
    }


# used to update the existing row  machine hour rate  by checking the dia and material_id
# @router.put("/turning-machine-hour-rate/{material_id}/{diameter_condition}")
# def update_machine_hour_rate(
#     material_id: int,
#     diameter_condition: str,
#     data: UpdateMachineHourRate,
#     db: Session = Depends(get_db)
# ):
#     # Find the row based on material_id + diameter_condition
#     rate_entry = (
#         db.query(TurningMachineHourRate)
#         .filter(
#             TurningMachineHourRate.material_id == material_id,
#             TurningMachineHourRate.diameter_condition == diameter_condition,
#         )
#         .first()
#     )
#
#     if not rate_entry:
#         raise HTTPException(
#             status_code=404,
#             detail=f"No rate found for material_id={material_id} and diameter_condition='{diameter_condition}'"
#         )
#
#     # Update the values
#     rate_entry.turning_rate = data.turning_rate
#     rate_entry.boring_rate = data.boring_rate
#     rate_entry.threading_rate = data.threading_rate
#     rate_entry.milling_rate = data.milling_rate
#
#     db.commit()
#     db.refresh(rate_entry)
#
#     return {
#         "message": "Machine hour rate updated successfully",
#         "data": {
#             "material_id": rate_entry.material_id,
#             "diameter_condition": rate_entry.diameter_condition,
#             "turning_rate": rate_entry.turning_rate,
#             "boring_rate": rate_entry.boring_rate,
#             "threading_rate": rate_entry.threading_rate,
#             "milling_rate": rate_entry.milling_rate,
#         }
#     }


@router.put("/turning-machine-hour-rate/update/")
def update_machine_hour_rate(
        data: UpdateMachineHourRate,
        db: Session = Depends(get_db)
):
    """
    Update a turning machine hour rate entry using material name and old diameter_condition.
    Also allows changing the diameter_condition itself.
    """
    # 1️⃣ Find the material_id using the material name
    material_obj = db.query(TurningMaterials).filter(
        TurningMaterials.material == data.material
    ).first()

    if not material_obj:
        raise HTTPException(status_code=404, detail=f"Material '{data.material}' not found")

    # 2️⃣ Find the existing entry using material_id + old_diameter_condition
    rate_entry = db.query(TurningMachineHourRate).filter(
        TurningMachineHourRate.material_id == material_obj.id,
        TurningMachineHourRate.diameter_condition == data.old_diameter_condition
    ).first()

    if not rate_entry:
        raise HTTPException(
            status_code=404,
            detail=f"No rate found for material '{data.material}' and diameter_condition '{data.old_diameter_condition}'"
        )

    # 3️⃣ Validate new_diameter_condition format
    if data.new_diameter_condition:
        import re
        # Format must be: Dia<number>*<number> (e.g., Dia<200*400)
        condition_pattern = r'^Dia<\d+\*\d+$'
        if not re.match(condition_pattern, data.new_diameter_condition.strip()):
            raise HTTPException(
                status_code=400,
                detail="Invalid diameter_condition format. Must be in format: 'Dia<200*400' (numbers can vary)"
            )

        # Check if new_diameter_condition already exists for this material (excluding current record)
        existing_rate = db.query(TurningMachineHourRate).filter(
            TurningMachineHourRate.material_id == material_obj.id,
            TurningMachineHourRate.diameter_condition == data.new_diameter_condition.strip(),
            TurningMachineHourRate.id != rate_entry.id  # Exclude current record
        ).first()

        if existing_rate:
            raise HTTPException(
                status_code=400,
                detail=f"Diameter condition '{data.new_diameter_condition}' already exists for material '{data.material}'"
            )

    # 4️⃣ Update all editable fields
    if data.new_diameter_condition:
        rate_entry.diameter_condition = data.new_diameter_condition.strip()
    rate_entry.turning_rate = data.turning_rate
    rate_entry.boring_rate = data.boring_rate
    rate_entry.threading_rate = data.threading_rate
    rate_entry.milling_rate = data.milling_rate

    # 5️⃣ Ensure material column is always updated to match
    rate_entry.material = material_obj.material

    db.commit()
    db.refresh(rate_entry)

    return {
        "message": "Machine hour rate updated successfully",
        "data": {
            "id": rate_entry.id,
            "material": rate_entry.material,
            "diameter_condition": rate_entry.diameter_condition,
            "turning_rate": rate_entry.turning_rate,
            "boring_rate": rate_entry.boring_rate,
            "threading_rate": rate_entry.threading_rate,
            "milling_rate": rate_entry.milling_rate,
        }
    }


# to create new row with new dia and material id but before inserting it will check material exist are not using id
# @router.post("/turning-machine-hour-rate/")
# def create_machine_hour_rate(data: CreateMachineHourRate, db: Session = Depends(get_db)):
#     # Check if the material exists
#     material = db.query(TurningMaterials).filter(TurningMaterials.id == data.material_id).first()
#     if not material:
#         raise HTTPException(
#             status_code=404,
#             detail=f"Material with id {data.material_id} not found"
#         )
#
#     # Optional: Check if the same material_id + diameter_condition already exists to prevent duplicates
#     existing_entry = (
#         db.query(TurningMachineHourRate)
#         .filter(
#             TurningMachineHourRate.material_id == data.material_id,
#             TurningMachineHourRate.diameter_condition == data.diameter_condition
#         )
#         .first()
#     )
#     if existing_entry:
#         raise HTTPException(
#             status_code=400,
#             detail=f"A rate for material_id={data.material_id} and diameter_condition='{data.diameter_condition}' already exists"
#         )
#
#     # Create new rate entry
#     new_rate = TurningMachineHourRate(
#         material_id=data.material_id,
#         diameter_condition=data.diameter_condition,
#         turning_rate=data.turning_rate,
#         boring_rate=data.boring_rate,
#         threading_rate=data.threading_rate,
#         milling_rate=data.milling_rate
#     )
#
#     db.add(new_rate)
#     db.commit()
#     db.refresh(new_rate)
#
#     return {
#         "message": "Machine hour rate added successfully",
#         "data": {
#             "id": new_rate.id,
#             "material_id": new_rate.material_id,
#             "diameter_condition": new_rate.diameter_condition,
#             "turning_rate": new_rate.turning_rate,
#             "boring_rate": new_rate.boring_rate,
#             "threading_rate": new_rate.threading_rate,
#             "milling_rate": new_rate.milling_rate,
#         }
#     }


@router.post("/turning-machine-hour-rate/")
def create_machine_hour_rate(data: CreateMachineHourRate, db: Session = Depends(get_db)):
    # 1️⃣ Check if the material exists
    material = db.query(TurningMaterials).filter(TurningMaterials.id == data.material_id).first()
    if not material:
        raise HTTPException(
            status_code=404,
            detail=f"Material with id {data.material_id} not found"
        )

    # 2️⃣ Validate diameter_condition format
    import re
    # Format must be: Dia<number>*<number> (e.g., Dia<200*400)
    condition_pattern = r'^Dia<\d+\*\d+$'
    if not re.match(condition_pattern, data.diameter_condition.strip()):
        raise HTTPException(
            status_code=400,
            detail="Invalid diameter_condition format. Must be in format: 'Dia<200*400' (numbers can vary)"
        )

    # 3️⃣ Prevent duplicate entry for same material_id + diameter_condition
    existing_entry = (
        db.query(TurningMachineHourRate)
            .filter(
            TurningMachineHourRate.material_id == data.material_id,
            TurningMachineHourRate.diameter_condition == data.diameter_condition.strip()
        )
            .first()
    )
    if existing_entry:
        raise HTTPException(
            status_code=400,
            detail=f"A rate for material_id={data.material_id} and diameter_condition='{data.diameter_condition}' already exists"
        )

    # 4️⃣ Create new rate entry (insert material name from TurningMaterials)
    new_rate = TurningMachineHourRate(
        material_id=data.material_id,
        material=material.material,  # ✅ insert material name
        diameter_condition=data.diameter_condition.strip(),
        turning_rate=data.turning_rate,
        boring_rate=data.boring_rate,
        threading_rate=data.threading_rate,
        milling_rate=data.milling_rate
    )

    db.add(new_rate)
    db.commit()
    db.refresh(new_rate)

    return {
        "message": "Machine hour rate added successfully",
        "data": {
            "id": new_rate.id,
            "material_id": new_rate.material_id,
            "material": new_rate.material,  # ✅ include material in response
            "diameter_condition": new_rate.diameter_condition,
            "turning_rate": new_rate.turning_rate,
            "boring_rate": new_rate.boring_rate,
            "threading_rate": new_rate.threading_rate,
            "milling_rate": new_rate.milling_rate,
        }
    }


# to get all the rows present in the table
# @router.get("/turning-machine-hour-rates/")
# def get_all_machine_hour_rates(db: Session = Depends(get_db)):
#     rates = db.query(TurningMachineHourRate).all()
#
#     # Convert to list of dictionaries
#     result = []
#     for rate in rates:
#         result.append({
#             "id": rate.id,
#             "material_id": rate.material_id,
#             "diameter_condition": rate.diameter_condition,
#             "turning_rate": rate.turning_rate,
#             "boring_rate": rate.boring_rate,
#             "threading_rate": rate.threading_rate,
#             "milling_rate": rate.milling_rate
#         })
#
#     return {"data": result}


@router.get("/turning-machine-hour-rates/")
def get_all_machine_hour_rates(db: Session = Depends(get_db)):
    rates = db.query(TurningMachineHourRate).all()

    result = []
    for rate in rates:
        result.append({
            "id": rate.id,
            "material_id": rate.material_id,
            "material": rate.material,
            "diameter_condition": rate.diameter_condition,
            "turning_rate": rate.turning_rate,
            "boring_rate": rate.boring_rate,
            "threading_rate": rate.threading_rate,
            "milling_rate": rate.milling_rate
        })

    return {"data": result}


# to get all the row of a table
# @router.get("/turning-manufacturing-percentage/")
# def get_manufacturing_percentages(db: Session = Depends(get_db)):
#     percentages = db.query(ManufacturingPercentage).all()
#
#     result = []
#     for row in percentages:
#         result.append({
#             "id": row.id,
#             "percentage_of_manufacturing_time": row.percentage_of_manufacturing_time
#         })
#
#     return {"data": result}




@router.get("/turning-manufacturing-percentage/")
def get_manufacturing_percentages(db: Session = Depends(get_db)):
    percentages = db.query(ManufacturingPercentage).all()

    result = []
    for row in percentages:
        result.append({
            "id": row.id,
            "percentage_of_manufacturing_time": row.percentage_of_manufacturing_time,
            "Correction_factor": row.Correction_factor
        })

    return {"data": result}


# it is used to update the percentage
#
# @router.put("/turning-manufacturing-percentage/")
# def update_manufacturing_percentage(data: UpdateManufacturingPercentage, db: Session = Depends(get_db)):
#     # Fetch the first row
#     percentage_row = db.query(ManufacturingPercentage).first()
#
#     if not percentage_row:
#         # If no row exists, create one
#         percentage_row = ManufacturingPercentage(
#             percentage_of_manufacturing_time=data.percentage_of_manufacturing_time
#         )
#         db.add(percentage_row)
#     else:
#         # Update existing row
#         percentage_row.percentage_of_manufacturing_time = data.percentage_of_manufacturing_time
#
#     db.commit()
#     db.refresh(percentage_row)
#
#     return {
#         "message": "Manufacturing percentage updated successfully",
#         "data": {
#             "id": percentage_row.id,
#             "percentage_of_manufacturing_time": percentage_row.percentage_of_manufacturing_time
#         }
#     }




@router.put("/turning-manufacturing-percentage/")
def update_manufacturing_percentage(data: UpdateManufacturingPercentage, db: Session = Depends(get_db)):
    # Validate percentage range
    if data.percentage_of_manufacturing_time <= 0:
        raise HTTPException(status_code=400, detail="Percentage must be greater than 0")
    if data.percentage_of_manufacturing_time > 100:
        raise HTTPException(status_code=400, detail="Percentage must be less than or equal to 100")

    # Fetch the first row
    percentage_row = db.query(ManufacturingPercentage).first()

    if not percentage_row:
        # If no row exists, create one
        percentage_row = ManufacturingPercentage(
            percentage_of_manufacturing_time=data.percentage_of_manufacturing_time,
            Correction_factor=data.Correction_factor
        )
        db.add(percentage_row)
    else:
        # Update existing row
        percentage_row.percentage_of_manufacturing_time = data.percentage_of_manufacturing_time
        percentage_row.Correction_factor = data.Correction_factor

    db.commit()
    db.refresh(percentage_row)

    return {
        "message": "Manufacturing percentage updated successfully",
        "data": {
            "id": percentage_row.id,
            "percentage_of_manufacturing_time": percentage_row.percentage_of_manufacturing_time,
            "Correction_factor": percentage_row.Correction_factor
        }
    }



# checks both dia and length
# @router.put("/turning/update-stock/")
# def turning_update_stock(
#     turning_history_id: int = Form(...),
#     stock_diameter: float = Form(...),
#     stock_length: float = Form(...),
#     db: Session = Depends(get_db)
# ):
#     import math
#     from fastapi import HTTPException, Form
#     from sqlalchemy.orm import Session
#
#     # Fetch turning history record
#     history = db.query(TurningHistoryDetails).filter(TurningHistoryDetails.id == turning_history_id).first()
#     if not history:
#         raise HTTPException(status_code=404, detail="Turning history record not found")
#
#     try:
#         # ---- STEP 1: Compute Stock Volumes ----
#         stock_volume_mm3 = round(math.pi * (stock_diameter ** 2) * stock_length / 4, 2)
#         stock_volume_m3 = round(stock_volume_mm3 / 1e9, 10)
#
#         # ---- STEP 2: Get Material Details ----
#         material = db.query(TurningMaterials).filter(TurningMaterials.id == history.material_id).first()
#         if not material:
#             raise HTTPException(status_code=404, detail="Material not found for history")
#
#         density = material.density
#         cost_per_kg = material.material_cost
#
#         material_removed_m3 = stock_volume_m3 - history.volume_m3
#         material_removed_mm3 = stock_volume_mm3 - history.volume_mm3
#         stock_weight = stock_volume_m3 * density
#         material_cost = stock_weight * cost_per_kg
#
#         # ---- STEP 3: Fetch Parameters Based on Diameter ----
#         params = db.query(TurningParameters).filter(TurningParameters.material_id == material.id).all()
#         selected_params = None
#         for p in params:
#             if "-" in p.diameter_range:
#                 low, high = map(float, p.diameter_range.split("-"))
#                 if low <= stock_diameter <= high:
#                     selected_params = p
#                     break
#             elif ">" in p.diameter_range:
#                 thr = float(p.diameter_range.replace(">", ""))
#                 if stock_diameter > thr:
#                     selected_params = p
#                     break
#             elif "<" in p.diameter_range:
#                 thr = float(p.diameter_range.replace("<", ""))
#                 if stock_diameter < thr:
#                     selected_params = p
#                     break
#         if not selected_params:
#             raise HTTPException(status_code=400, detail="No matching parameter range for new stock diameter")
#
#         # ---- STEP 4: Compute MRRs ----
#         roughing_mrr_mm3_min = (
#             selected_params.roughing_feed_rate *
#             selected_params.roughing_depth_of_cut *
#             selected_params.roughing_cutting_speed *
#             1000
#         )
#         finishing_mrr_mm3_min = (
#             selected_params.finishing_feed_rate *
#             selected_params.finishing_depth_of_cut *
#             selected_params.finishing_cutting_speed *
#             1000
#         )
#
#         # ---- STEP 5: Get Percentage Distribution ----
#         percentages = db.query(TurningPercentages).first()
#         if not percentages:
#             raise HTTPException(status_code=404, detail="Percentages table is empty")
#
#         roughing_time = ((material_removed_mm3 * (percentages.roughing_percentage / 100)) / roughing_mrr_mm3_min) / 60
#         finishing_time = ((material_removed_mm3 * (percentages.finishing_percentage / 100)) / finishing_mrr_mm3_min) / 60
#         machining_hours = (roughing_time + finishing_time)
#
#         # ---- STEP 6: Update History Table ----
#         history.stock_diameter = stock_diameter
#         history.stock_length = stock_length
#         history.stock_volume_mm3 = stock_volume_mm3
#         history.stock_volume_m3 = stock_volume_m3
#         history.material_removed_m3 = material_removed_m3
#         history.stock_weight_kg = stock_weight
#         history.Material_cost = material_cost
#         history.roughing_mrr = roughing_mrr_mm3_min
#         history.finishing_mrr = finishing_mrr_mm3_min
#         history.roughing_time = roughing_time
#         history.finishing_time = finishing_time
#         history.machining_hours = machining_hours
#         db.commit()
#
#         # ---- STEP 7: Fetch Last Cost Record ----
#         last_cost = (
#             db.query(TurningMachiningCost)
#             .filter(TurningMachiningCost.history_id == turning_history_id)
#             .order_by(TurningMachiningCost.id.desc())
#             .first()
#         )
#
#         turning_pct = last_cost.turning_percentage if last_cost else 100
#         boring_pct = last_cost.boring_percentage if last_cost else 0
#         threading_pct = last_cost.threading_percentage if last_cost else 0
#         milling_pct = last_cost.milling_percentage if last_cost else 0
#         quantity = last_cost.quantity if last_cost else 1
#         filename = last_cost.filename if last_cost else "Unknown"
#
#         # ---- STEP 8: ✅ Updated Machine Rate Logic ----
#         rates_list = db.query(TurningMachineHourRate).filter(TurningMachineHourRate.material_id == material.id).all()
#         if not rates_list:
#             raise HTTPException(status_code=404, detail="Machine rates not found for this material")
#
#         selected_rate = None
#         for rate in rates_list:
#             try:
#                 # Example: "Dia<200*400"
#                 dia_part, len_part = rate.diameter_condition.replace("Dia<", "").split("*")
#                 dia_limit = float(dia_part)
#                 len_limit = float(len_part)
#             except Exception:
#                 continue
#
#             # ✅ New logic — check BOTH diameter and length
#             if stock_diameter <= dia_limit and stock_length <= len_limit:
#                 selected_rate = rate
#                 break
#
#         if not selected_rate:
#             raise HTTPException(
#                 status_code=400,
#                 detail=f"No matching machine rate found for Dia={stock_diameter}, Len={stock_length}"
#             )
#
#         # ---- STEP 9: Manufacturing Percentage ----
#         manufacturing_percentage_row = db.query(ManufacturingPercentage).first()
#         if not manufacturing_percentage_row:
#             raise HTTPException(status_code=404, detail="Manufacturing percentage not found")
#
#         percentage_of_manufacturing = manufacturing_percentage_row.percentage_of_manufacturing_time
#         Manufacturing_hours = (100 / percentage_of_manufacturing) * machining_hours
#
#         # ---- STEP 10: Compute Costs ----
#         cost_turning = Manufacturing_hours * (turning_pct / 100) * selected_rate.turning_rate
#         cost_boring = Manufacturing_hours * (boring_pct / 100) * selected_rate.boring_rate
#         cost_threading = Manufacturing_hours * (threading_pct / 100) * selected_rate.threading_rate
#         cost_milling = Manufacturing_hours * (milling_pct / 100) * selected_rate.milling_rate
#
#         total_machining_cost_per_unit = cost_turning + cost_boring + cost_threading + cost_milling
#         total_machining_cost = total_machining_cost_per_unit * quantity
#         total_material_cost = material_cost * quantity
#         total_cost_without_material_cost = total_machining_cost
#         total_cost_with_material_cost = total_machining_cost + total_material_cost
#
#         # ---- STEP 11: Store Updated Costs ----
#         updated_cost = TurningMachiningCost(
#             history_id=turning_history_id,
#             filename=filename,
#             obj_file=last_cost.obj_file if last_cost else None,
#             glb_file=last_cost.glb_file if last_cost else None,
#             draco_glb_file=last_cost.draco_glb_file if last_cost else None,
#             turning_percentage=turning_pct,
#             boring_percentage=boring_pct,
#             threading_percentage=threading_pct,
#             milling_percentage=milling_pct,
#             turning_cost=cost_turning,
#             boring_cost=cost_boring,
#             threading_cost=cost_threading,
#             milling_cost=cost_milling,
#             total_Manufacturing_time=Manufacturing_hours,
#             total_machining_cost_per_unit=total_machining_cost_per_unit,
#             total_machining_cost=total_machining_cost,
#             Material_cost_per_unit=material_cost,
#             total_material_cost=total_material_cost,
#             total_cost_without_material_cost=total_cost_without_material_cost,
#             total_cost_with_material_cost=total_cost_with_material_cost,
#             quantity=quantity
#         )
#         db.add(updated_cost)
#         db.commit()
#
#         return {
#             "message": "Stock and cost successfully updated",
#             "history_id": turning_history_id,
#             "stock_diameter": stock_diameter,
#             "stock_length": stock_length,
#             "Material_cost_per_unit": material_cost,
#             "total_machining_cost_per_unit": total_machining_cost_per_unit,
#             "total_machining_cost": total_machining_cost,
#             "total_material_cost": total_material_cost,
#             "total_cost_with_material_cost": total_cost_with_material_cost,
#             "total_cost_without_material_cost": total_cost_without_material_cost,
#             "stock_volume_mm3": stock_volume_mm3,
#             "stock_weight_kg": round(stock_weight, 4),
#         }
#
#     except Exception as e:
#         db.rollback()
#         raise HTTPException(status_code=400, detail=str(e))


# below avoids insertion of new row in turnincost table

@router.put("/turning/update-stock/")
def turning_update_stock(
        turning_history_id: int = Form(...),
        stock_diameter: float = Form(...),
        stock_length: float = Form(...),
        db: Session = Depends(get_db)
):
    import math
    from fastapi import HTTPException, Form
    from sqlalchemy.orm import Session

    # Fetch turning history record
    history = db.query(TurningHistoryDetails).filter(TurningHistoryDetails.id == turning_history_id).first()
    if not history:
        raise HTTPException(status_code=404, detail="Turning history record not found")

    try:
        # ---- STEP 1: Compute Stock Volumes ----
        stock_volume_mm3 = round(math.pi * (stock_diameter ** 2) * stock_length / 4, 2)
        stock_volume_m3 = round(stock_volume_mm3 / 1e9, 10)

        # ---- STEP 2: Get Material Details ----
        material = db.query(TurningMaterials).filter(TurningMaterials.id == history.material_id).first()
        if not material:
            raise HTTPException(status_code=404, detail="Material not found for history")

        density = material.density
        cost_per_kg = material.material_cost

        material_removed_m3 = stock_volume_m3 - history.volume_m3
        material_removed_mm3 = stock_volume_mm3 - history.volume_mm3
        stock_weight = stock_volume_m3 * density
        material_cost = stock_weight * cost_per_kg

        # ---- STEP 3: Fetch Parameters Based on Diameter ----
        params = db.query(TurningParameters).filter(TurningParameters.material_id == material.id).all()
        selected_params = None
        for p in params:
            if "-" in p.diameter_range:
                low, high = map(float, p.diameter_range.split("-"))
                if low <= stock_diameter <= high:
                    selected_params = p
                    break
            elif ">" in p.diameter_range:
                thr = float(p.diameter_range.replace(">", ""))
                if stock_diameter > thr:
                    selected_params = p
                    break
            elif "<" in p.diameter_range:
                thr = float(p.diameter_range.replace("<", ""))
                if stock_diameter < thr:
                    selected_params = p
                    break
        if not selected_params:
            raise HTTPException(status_code=400, detail="No matching parameter range for new stock diameter")

        # ---- STEP 4: Compute MRRs ----
        roughing_mrr_mm3_min = (
                selected_params.roughing_feed_rate *
                selected_params.roughing_depth_of_cut *
                selected_params.roughing_cutting_speed *
                1000
        )
        finishing_mrr_mm3_min = (
                selected_params.finishing_feed_rate *
                selected_params.finishing_depth_of_cut *
                selected_params.finishing_cutting_speed *
                1000
        )

        # ---- STEP 5: Get Percentage Distribution ----
        percentages = db.query(TurningPercentages).first()
        if not percentages:
            raise HTTPException(status_code=404, detail="Percentages table is empty")

        roughing_time = ((material_removed_mm3 * (percentages.roughing_percentage / 100)) / roughing_mrr_mm3_min) / 60
        finishing_time = ((material_removed_mm3 * (
                    percentages.finishing_percentage / 100)) / finishing_mrr_mm3_min) / 60
        machining_hours = (roughing_time + finishing_time)

        # ---- STEP 6: Update History Table ----
        history.stock_diameter = stock_diameter
        history.stock_length = stock_length
        history.stock_volume_mm3 = stock_volume_mm3
        history.stock_volume_m3 = stock_volume_m3
        history.material_removed_m3 = material_removed_m3
        history.stock_weight_kg = stock_weight
        history.Material_cost = material_cost
        history.roughing_mrr = roughing_mrr_mm3_min
        history.finishing_mrr = finishing_mrr_mm3_min
        history.roughing_time = roughing_time
        history.finishing_time = finishing_time
        history.machining_hours = machining_hours
        db.commit()

        # ---- STEP 7: Fetch Last Cost Record ----
        last_cost = (
            db.query(TurningMachiningCost)
                .filter(TurningMachiningCost.history_id == turning_history_id)
                .order_by(TurningMachiningCost.id.desc())
                .first()
        )

        turning_pct = last_cost.turning_percentage if last_cost else 100
        boring_pct = last_cost.boring_percentage if last_cost else 0
        threading_pct = last_cost.threading_percentage if last_cost else 0
        milling_pct = last_cost.milling_percentage if last_cost else 0
        quantity = last_cost.quantity if last_cost else 1
        filename = last_cost.filename if last_cost else "Unknown"

        # ---- STEP 8: ✅ Updated Machine Rate Logic ----
        rates_list = db.query(TurningMachineHourRate).filter(TurningMachineHourRate.material_id == material.id).all()
        if not rates_list:
            raise HTTPException(status_code=404, detail="Machine rates not found for this material")

        selected_rate = None
        for rate in rates_list:
            try:
                dia_part, len_part = rate.diameter_condition.replace("Dia<", "").split("*")
                dia_limit = float(dia_part)
                len_limit = float(len_part)
            except Exception:
                continue

            if stock_diameter <= dia_limit and stock_length <= len_limit:
                selected_rate = rate
                break

        if not selected_rate:
            raise HTTPException(
                status_code=400,
                detail=f"No matching machine rate found for Dia={stock_diameter}, Len={stock_length}"
            )

        # ---- STEP 9: Manufacturing Percentage ----
        manufacturing_percentage_row = db.query(ManufacturingPercentage).first()
        if not manufacturing_percentage_row:
            raise HTTPException(status_code=404, detail="Manufacturing percentage not found")

        percentage_of_manufacturing = manufacturing_percentage_row.percentage_of_manufacturing_time
        Manufacturing_hours = (100 / percentage_of_manufacturing) * machining_hours

        # ---- STEP 10: Compute Costs ----
        cost_turning = Manufacturing_hours * (turning_pct / 100) * selected_rate.turning_rate
        cost_boring = Manufacturing_hours * (boring_pct / 100) * selected_rate.boring_rate
        cost_threading = Manufacturing_hours * (threading_pct / 100) * selected_rate.threading_rate
        cost_milling = Manufacturing_hours * (milling_pct / 100) * selected_rate.milling_rate

        total_machining_cost_per_unit = cost_turning + cost_boring + cost_threading + cost_milling
        total_machining_cost_per_unit = total_machining_cost_per_unit * manufacturing_percentage_row.Correction_factor
        print(total_machining_cost_per_unit)
        total_machining_cost = total_machining_cost_per_unit * quantity
        total_material_cost = material_cost * quantity
        # total_cost_without_material_cost = total_machining_cost
        total_cost_with_material_cost = total_machining_cost + total_material_cost
        total_cost_with_material_cost_per_unit=total_machining_cost_per_unit+material_cost

        # ---- STEP 11: ✅ UPDATE EXISTING COST RECORD ----
        if last_cost:
            last_cost.turning_cost = cost_turning
            last_cost.boring_cost = cost_boring
            last_cost.threading_cost = cost_threading
            last_cost.milling_cost = cost_milling
            last_cost.total_Manufacturing_time = Manufacturing_hours
            last_cost.total_machining_cost_per_unit = total_machining_cost_per_unit
            last_cost.total_machining_cost = total_machining_cost
            last_cost.Material_cost_per_unit = material_cost
            last_cost.total_material_cost = total_material_cost
            # last_cost.total_cost_without_material_cost = total_cost_without_material_cost
            last_cost.total_cost_with_material_cost = total_cost_with_material_cost
            last_cost.quantity = quantity
        else:
            raise HTTPException(status_code=404, detail="Machining cost record not found to update")

        db.commit()

        return {
            "message": "Stock and machining cost successfully updated",
            "history_id": turning_history_id,
            "stock_diameter": stock_diameter,
            "stock_length": stock_length,

            "total_machining_cost_per_unit": total_machining_cost_per_unit,
            "total_machining_cost": total_machining_cost,
            "Material_cost_per_unit": material_cost,
            "total_material_cost": total_material_cost,

            # "total_cost_without_material_cost": total_cost_without_material_cost,
            "total_cost_with_material_cost_per_unit":total_cost_with_material_cost_per_unit,
            "total_cost_with_material_cost": total_cost_with_material_cost,
            "stock_volume_mm3": stock_volume_mm3,
            "stock_weight_kg": round(stock_weight, 4),
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


# below added to display size also

# @router.put("/turning/update-stock/")
# def turning_update_stock(
#     turning_history_id: int = Form(...),
#     stock_diameter: float = Form(...),
#     stock_length: float = Form(...),
#     db: Session = Depends(get_db)
# ):
#     import math
#     from fastapi import HTTPException, Form
#     from sqlalchemy.orm import Session
#
#     # Fetch turning history record
#     history = db.query(TurningHistoryDetails).filter(TurningHistoryDetails.id == turning_history_id).first()
#     if not history:
#         raise HTTPException(status_code=404, detail="Turning history record not found")
#
#     try:
#         # ---- STEP 1: Compute Stock Volumes ----
#         stock_volume_mm3 = round(math.pi * (stock_diameter ** 2) * stock_length / 4, 2)
#         stock_volume_m3 = round(stock_volume_mm3 / 1e9, 10)
#
#         # ---- STEP 2: Get Material Details ----
#         material = db.query(TurningMaterials).filter(TurningMaterials.id == history.material_id).first()
#         if not material:
#             raise HTTPException(status_code=404, detail="Material not found for history")
#
#         density = material.density
#         cost_per_kg = material.material_cost
#
#         material_removed_m3 = stock_volume_m3 - history.volume_m3
#         material_removed_mm3 = stock_volume_mm3 - history.volume_mm3
#         stock_weight = stock_volume_m3 * density
#         material_cost = stock_weight * cost_per_kg
#
#         # ---- STEP 3: Fetch Parameters Based on Diameter ----
#         params = db.query(TurningParameters).filter(TurningParameters.material_id == material.id).all()
#         selected_params = None
#         for p in params:
#             if "-" in p.diameter_range:
#                 low, high = map(float, p.diameter_range.split("-"))
#                 if low <= stock_diameter <= high:
#                     selected_params = p
#                     break
#             elif ">" in p.diameter_range:
#                 thr = float(p.diameter_range.replace(">", ""))
#                 if stock_diameter > thr:
#                     selected_params = p
#                     break
#             elif "<" in p.diameter_range:
#                 thr = float(p.diameter_range.replace("<", ""))
#                 if stock_diameter < thr:
#                     selected_params = p
#                     break
#         if not selected_params:
#             raise HTTPException(status_code=400, detail="No matching parameter range for new stock diameter")
#
#         # ---- STEP 4: Compute MRRs ----
#         roughing_mrr_mm3_min = (
#             selected_params.roughing_feed_rate *
#             selected_params.roughing_depth_of_cut *
#             selected_params.roughing_cutting_speed *
#             1000
#         )
#         finishing_mrr_mm3_min = (
#             selected_params.finishing_feed_rate *
#             selected_params.finishing_depth_of_cut *
#             selected_params.finishing_cutting_speed *
#             1000
#         )
#
#         # ---- STEP 5: Get Percentage Distribution ----
#         percentages = db.query(TurningPercentages).first()
#         if not percentages:
#             raise HTTPException(status_code=404, detail="Percentages table is empty")
#
#         roughing_time = ((material_removed_mm3 * (percentages.roughing_percentage / 100)) / roughing_mrr_mm3_min) / 60
#         finishing_time = ((material_removed_mm3 * (percentages.finishing_percentage / 100)) / finishing_mrr_mm3_min) / 60
#         machining_hours = (roughing_time + finishing_time)
#
#         # ---- STEP 6: Update History Table ----
#         history.stock_diameter = stock_diameter
#         history.stock_length = stock_length
#         history.stock_volume_mm3 = stock_volume_mm3
#         history.stock_volume_m3 = stock_volume_m3
#         history.material_removed_m3 = material_removed_m3
#         history.stock_weight_kg = stock_weight
#         history.Material_cost = material_cost
#         history.roughing_mrr = roughing_mrr_mm3_min
#         history.finishing_mrr = finishing_mrr_mm3_min
#         history.roughing_time = roughing_time
#         history.finishing_time = finishing_time
#         history.machining_hours = machining_hours
#         db.commit()
#
#         # ---- STEP 7: Fetch Last Cost Record ----
#         last_cost = (
#             db.query(TurningMachiningCost)
#             .filter(TurningMachiningCost.history_id == turning_history_id)
#             .order_by(TurningMachiningCost.id.desc())
#             .first()
#         )
#
#         turning_pct = last_cost.turning_percentage if last_cost else 100
#         boring_pct = last_cost.boring_percentage if last_cost else 0
#         threading_pct = last_cost.threading_percentage if last_cost else 0
#         milling_pct = last_cost.milling_percentage if last_cost else 0
#         quantity = last_cost.quantity if last_cost else 1
#         filename = last_cost.filename if last_cost else "Unknown"
#
#         rates_list = db.query(TurningMachineHourRate).filter(
#             TurningMachineHourRate.material_id == material.id
#         ).all()
#         if not rates_list:
#             raise HTTPException(status_code=404, detail="Machine rates not found for this material")
#
#         # Get operation sizes from last_cost record
#         turning_size = last_cost.turning_size
#         boring_size = last_cost.boring_size
#         threading_size = last_cost.threading_size
#         milling_size = last_cost.milling_size
#
#         # Helper function to find rate based on size condition
#         def get_rate_for_size(size_value: str, operation_type: str):
#             if not size_value or size_value.strip() == "":
#                 return None  # Skip operation if no size given
#
#             # Normalize for comparison
#             size_value = size_value.strip().replace(" ", "")
#             for rate in rates_list:
#                 rate_condition = (rate.diameter_condition or "").strip().replace(" ", "")
#                 if not rate_condition:
#                     continue
#
#                 # Direct string match (exact same condition)
#                 if size_value == rate_condition:
#                     return rate
#
#             # If still not found, try to interpret numerically
#             try:
#                 # Extract number if format is like "Dia<300"
#                 import re
#                 size_num = float(re.findall(r"\d+\.?\d*", size_value)[0])
#                 for rate in rates_list:
#                     cond = (rate.diameter_condition or "").strip()
#                     if not cond:
#                         continue
#                     if "-" in cond:
#                         low, high = map(float, cond.replace("Dia", "").split("-"))
#                         if low <= size_num <= high:
#                             return rate
#                     elif ">" in cond:
#                         thr = float(cond.replace("Dia>", "").strip())
#                         if size_num > thr:
#                             return rate
#                     elif "<" in cond:
#                         thr = float(cond.replace("Dia<", "").strip())
#                         if size_num < thr:
#                             return rate
#             except Exception:
#                 pass
#
#             raise HTTPException(status_code=400, detail=f"No matching machine rate found for {operation_type} size {size_value}")
#
#         # Fetch rates for each operation (skip if no size)
#         turning_rate = get_rate_for_size(turning_size, "Turning")
#         boring_rate = get_rate_for_size(boring_size, "Boring")
#         threading_rate = get_rate_for_size(threading_size, "Threading")
#         milling_rate = get_rate_for_size(milling_size, "Milling")
#
#         # ---- STEP 9: Manufacturing Percentage ----
#         manufacturing_percentage_row = db.query(ManufacturingPercentage).first()
#         if not manufacturing_percentage_row:
#             raise HTTPException(status_code=404, detail="Manufacturing percentage not found")
#
#         percentage_of_manufacturing = manufacturing_percentage_row.percentage_of_manufacturing_time
#         Manufacturing_hours = (100 / percentage_of_manufacturing) * machining_hours
#
#         # ---- STEP 10: Compute Costs (Skip Null Sizes) ----
#         cost_turning = (
#             Manufacturing_hours * (turning_pct / 100) * turning_rate.turning_rate
#             if turning_rate else 0
#         )
#         cost_boring = (
#             Manufacturing_hours * (boring_pct / 100) * boring_rate.boring_rate
#             if boring_rate else 0
#         )
#         cost_threading = (
#             Manufacturing_hours * (threading_pct / 100) * threading_rate.threading_rate
#             if threading_rate else 0
#         )
#         cost_milling = (
#             Manufacturing_hours * (milling_pct / 100) * milling_rate.milling_rate
#             if milling_rate else 0
#         )
#
#         total_machining_cost_per_unit = cost_turning + cost_boring + cost_threading + cost_milling
#         total_machining_cost = total_machining_cost_per_unit * quantity
#         total_material_cost = material_cost * quantity
#         total_cost_without_material_cost = total_machining_cost
#         total_cost_with_material_cost = total_machining_cost + total_material_cost
#         total_cost_per_unit_with_materials = total_machining_cost_per_unit + material_cost
#
#         # ---- STEP 11: ✅ UPDATE EXISTING COST RECORD ----
#         if last_cost:
#             last_cost.turning_cost = cost_turning
#             last_cost.boring_cost = cost_boring
#             last_cost.threading_cost = cost_threading
#             last_cost.milling_cost = cost_milling
#             last_cost.total_Manufacturing_time = Manufacturing_hours
#             last_cost.total_machining_cost_per_unit = total_machining_cost_per_unit
#             last_cost.total_machining_cost = total_machining_cost
#             last_cost.Material_cost_per_unit = material_cost
#             last_cost.total_material_cost = total_material_cost
#             last_cost.total_cost_without_material_cost = total_cost_without_material_cost
#             last_cost.total_cost_with_material_cost = total_cost_with_material_cost
#             last_cost.quantity = quantity
#         else:
#             raise HTTPException(status_code=404, detail="Machining cost record not found to update")
#
#         db.commit()
#
#         return {
#             "message": "Stock and machining cost successfully updated",
#             "history_id": turning_history_id,
#             "stock_diameter": stock_diameter,
#             "stock_length": stock_length,
#             "Material_cost_per_unit": material_cost,
#             "total_machining_cost_per_unit": total_machining_cost_per_unit,
#             "total_machining_cost": total_machining_cost,
#             "total_material_cost": total_material_cost,
#             "total_cost_with_material_cost": total_cost_with_material_cost,
#             "total_cost_without_material_cost": total_cost_without_material_cost,
#             "stock_volume_mm3": stock_volume_mm3,
#             "stock_weight_kg": round(stock_weight, 4),
#             "total_cost_per_unit_with_materials": total_cost_per_unit_with_materials
#         }
#
#
#     except Exception as e:
#         db.rollback()
#         raise HTTPException(status_code=400, detail=str(e))


# this is use to update the quantity
@router.put("/update-quantity")
def update_machining_cost(
        turning_history_id: int = Form(...),
        quantity: int = Form(...),
        db: Session = Depends(get_db)
):
    # 1️⃣ Fetch the machining cost record
    machining_cost_record = (
        db.query(TurningMachiningCost)
            .filter(TurningMachiningCost.history_id == turning_history_id)
            .first()
    )
    if not machining_cost_record:
        raise HTTPException(status_code=404, detail="Machining cost record not found")

    # 2️⃣ Extract existing per-unit values
    total_machining_cost_per_unit = machining_cost_record.total_machining_cost_per_unit
    material_cost_per_unit = machining_cost_record.Material_cost_per_unit
    total_cost_per_unit_with_materials = total_machining_cost_per_unit + material_cost_per_unit

    total_material_cost = material_cost_per_unit * quantity
    # 3️⃣ Recalculate totals with new quantity
    total_cost_without_material_cost = total_machining_cost_per_unit * quantity
    total_cost_with_material_cost = (total_machining_cost_per_unit + material_cost_per_unit) * quantity

    # 4️⃣ Update record
    machining_cost_record.quantity = quantity
    machining_cost_record.total_cost_without_material_cost = total_cost_without_material_cost
    machining_cost_record.total_cost_with_material_cost = total_cost_with_material_cost
    machining_cost_record.total_material_cost = total_material_cost
    machining_cost_record.total_machining_cost = total_cost_without_material_cost

    db.commit()
    db.refresh(machining_cost_record)

    # 5️⃣ Return updated response
    return {
        "id": machining_cost_record.id,
        "history_id": machining_cost_record.history_id,
        "quantity": machining_cost_record.quantity,
        "turning_cost": machining_cost_record.turning_cost,
        "boring_cost": machining_cost_record.boring_cost,
        "threading_cost": machining_cost_record.threading_cost,
        "milling_cost": machining_cost_record.milling_cost,
        "total_machining_cost_per_unit": machining_cost_record.total_machining_cost_per_unit,
        "total_machining_cost": total_cost_without_material_cost,
        "Material_cost_per_unit": machining_cost_record.Material_cost_per_unit,
        "total_material_cost": total_material_cost,
        # "total_cost_without_material_cost": machining_cost_record.total_cost_without_material_cost,
        "total_cost_with_material_cost": machining_cost_record.total_cost_with_material_cost,
        "total_cost_per_unit_with_materials": total_cost_per_unit_with_materials

    }


# this is for history to get all rows of the table with binary columns
@router.get("/machining-costs")
def get_all_machining_costs(db: Session = Depends(get_db)):
    records = db.query(TurningMachiningCost).all()

    if not records:
        raise HTTPException(status_code=404, detail="No machining cost records found")

    result = []
    for record in records:
        result.append({
            "id": record.id,
            "history_id": record.history_id,
            "filename": record.filename,
            "obj_file": base64.b64encode(record.obj_file).decode("utf-8") if record.obj_file else None,
            "glb_file": base64.b64encode(record.glb_file).decode("utf-8") if record.glb_file else None,
            "draco_glb_file": base64.b64encode(record.draco_glb_file).decode(
                "utf-8") if record.draco_glb_file else None,
            "turning_percentage": record.turning_percentage,
            "boring_percentage": record.boring_percentage,
            "threading_percentage": record.threading_percentage,
            "milling_percentage": record.milling_percentage,
            "turning_cost": record.turning_cost,
            "boring_cost": record.boring_cost,
            "threading_cost": record.threading_cost,
            "milling_cost": record.milling_cost,
            "total_Manufacturing_time": record.total_Manufacturing_time,
            "total_machining_cost_per_unit": record.total_machining_cost_per_unit,
            "Material_cost_per_unit": record.Material_cost_per_unit,
            "total_cost_without_material_cost": record.total_cost_without_material_cost,
            "total_cost_with_material_cost": record.total_cost_with_material_cost,
            "quantity": record.quantity,
        })

    return result


@router.get("/turning/download-draco-glb/{history_id}")
def download_turning_draco_glb(history_id: int, db: Session = Depends(get_db)):
    """
    Download the Draco-compressed GLB file stored in Turning_Machining_Costs table for a given history_id.
    """

    # Fetch only the draco_glb_file column from Turning_Machining_Costs table
    draco_glb_data = db.query(TurningMachiningCost.draco_glb_file).filter(
        TurningMachiningCost.history_id == history_id
    ).scalar()

    if not draco_glb_data:
        raise HTTPException(
            status_code=404,
            detail="No Draco GLB data stored for this turning record."
        )

    # Create a binary stream for download
    draco_glb_stream = io.BytesIO(draco_glb_data)

    return StreamingResponse(
        draco_glb_stream,
        media_type="model/gltf-binary",
        headers={
            "Content-Disposition": f"attachment; filename=turning_draco_{history_id}.glb"
        }
    )


@router.delete("/materials/delete/")
def delete_turning_material(data: TurningMaterialDelete, db: Session = Depends(get_db)):
    # 1️⃣ Find the material using all details
    material = db.query(models.TurningMaterials).filter(
        models.TurningMaterials.material == data.material,
        models.TurningMaterials.material_specification == data.material_specification,
        models.TurningMaterials.density == data.density,
        models.TurningMaterials.material_cost == data.material_cost
    ).first()

    if not material:
        raise HTTPException(status_code=404, detail="Material not found with the given details")

    # 2️⃣ Delete related TurningParameters
    deleted_params = db.query(models.TurningParameters).filter(
        models.TurningParameters.material_id == material.id
    ).delete(synchronize_session=False)

    # 3️⃣ Delete related MachineHourRates
    deleted_mhrs = db.query(models.TurningMachineHourRate).filter(
        models.TurningMachineHourRate.material_id == material.id
    ).delete(synchronize_session=False)

    # 4️⃣ Delete the material itself
    db.delete(material)
    db.commit()

    return {
        "message": "Material and all related data deleted successfully",
        "material": data.material,
        "deleted_parameters": deleted_params,
        "deleted_mhr_rates": deleted_mhrs
    }

#
# @router.post("/turning_update_machining_cost/")
# def calculate_machining_cost(
#         turning_history_id: int = Form(...),
#         turning_percentage: float = Form(...),
#         boring_percentage: float = Form(...),
#         threading_percentage: float = Form(...),
#         milling_percentage: float = Form(...),
#         db: Session = Depends(get_db)
# ):
#     # 1️⃣ Fetch the history record
#     history = db.query(TurningHistoryDetails).filter(
#         TurningHistoryDetails.id == turning_history_id
#     ).first()
#     if not history:
#         raise HTTPException(status_code=404, detail="Turning history record not found")
#
#     # 2️⃣ Fetch manufacturing percentage
#     manufacturing_percentage_row = db.query(ManufacturingPercentage).first()
#     if not manufacturing_percentage_row:
#         raise HTTPException(status_code=404, detail="Manufacturing percentage not found")
#
#     percentage_of_manufacturing = manufacturing_percentage_row.percentage_of_manufacturing_time
#
#     machining_hours = history.machining_hours
#     Manufacturing_hours = (100 / percentage_of_manufacturing) * machining_hours
#     material_id = history.material_id
#     stock_diameter = history.stock_diameter
#     stock_length = history.stock_length
#     longest = max(stock_diameter, stock_length)
#     Material_cost = history.Material_cost
#     filename = history.filename
#
#     # 3️⃣ Fetch existing machining cost record (for quantity)
#     existing_record = db.query(TurningMachiningCost).filter(
#         TurningMachiningCost.history_id == turning_history_id
#     ).first()
#
#     if not existing_record:
#         raise HTTPException(status_code=404, detail="Machining cost record not found for this history ID")
#
#     # Fetch quantity from existing record
#     quantity = existing_record.quantity
#     print(quantity)
#     if not quantity or quantity <= 0:
#         raise HTTPException(status_code=400, detail="Invalid or missing quantity in machining cost record")
#
#     # 4️⃣ Fetch machine hour rates for the material
#     rates_list = db.query(TurningMachineHourRate).filter(
#         TurningMachineHourRate.material_id == material_id
#     ).all()
#     if not rates_list:
#         raise HTTPException(status_code=404, detail="Machine rates not found for this material")
#
#     selected_rate = None
#     for rate in rates_list:
#         try:
#             dia_part, len_part = rate.diameter_condition.replace("Dia<", "").split("*")
#             dia_limit = float(dia_part)
#             len_limit = float(len_part)
#         except Exception:
#             continue  # skip malformed entries
#
#         limit_to_check = dia_limit if stock_diameter >= stock_length else len_limit
#         if longest <= limit_to_check:
#             selected_rate = rate
#             break
#
#     if not selected_rate:
#         raise HTTPException(status_code=400, detail="No matching machine rate found for the stock size")
#
#     # 5️⃣ Calculate costs
#     cost_turning = Manufacturing_hours * (turning_percentage / 100) * selected_rate.turning_rate
#     cost_boring = Manufacturing_hours * (boring_percentage / 100) * selected_rate.boring_rate
#     cost_threading = Manufacturing_hours * (threading_percentage / 100) * selected_rate.threading_rate
#     cost_milling = Manufacturing_hours * (milling_percentage / 100) * selected_rate.milling_rate
#
#     Material_cost_per_unit = Material_cost
#     Total_material_cost = Material_cost * quantity
#     total_Machining_cost_per_unit = cost_turning + cost_boring + cost_threading + cost_milling
#     total_Machining_cost_per_unit=total_Machining_cost_per_unit * manufacturing_percentage_row.Correction_factor
#     # total_cost_without_material_cost = total_Machining_cost_per_unit * quantity
#     total_cost_with_material_cost = (total_Machining_cost_per_unit + Material_cost) * quantity
#     total_machining_cost = total_Machining_cost_per_unit * quantity
#     total_cost_with_material_cost_per_unit=total_Machining_cost_per_unit+Material_cost_per_unit
#
#     # 6️⃣ Update existing record
#     existing_record.filename = filename
#     existing_record.turning_percentage = turning_percentage
#     existing_record.boring_percentage = boring_percentage
#     existing_record.threading_percentage = threading_percentage
#     existing_record.milling_percentage = milling_percentage
#     existing_record.turning_cost = cost_turning
#     existing_record.boring_cost = cost_boring
#     existing_record.threading_cost = cost_threading
#     existing_record.milling_cost = cost_milling
#     existing_record.total_machining_cost_per_unit = total_Machining_cost_per_unit
#     existing_record.Material_cost_per_unit = Material_cost_per_unit
#     existing_record.total_material_cost = Total_material_cost
#     # existing_record.total_cost_without_material_cost = total_cost_without_material_cost
#     existing_record.total_Manufacturing_time = Manufacturing_hours
#     existing_record.total_cost_with_material_cost = total_cost_with_material_cost
#     existing_record.total_machining_cost = total_machining_cost
#
#     db.commit()
#     db.refresh(existing_record)
#
#     # 7️⃣ Return response
#     return {
#         "message": f"Machining cost record updated for history_id {turning_history_id}",
#         "id": existing_record.id,
#         "history_id": turning_history_id,
#         "quantity": quantity,
#         "turning_cost": cost_turning,
#         "boring_cost": cost_boring,
#         "threading_cost": cost_threading,
#         "milling_cost": cost_milling,
#         "total_machining_cost_per_unit": total_Machining_cost_per_unit,
#         "total_machining_cost": total_machining_cost,
#         # "total_cost_without_material_cost": total_cost_without_material_cost,
#         "total_cost_with_material_cost_per_unit":total_cost_with_material_cost_per_unit,
#         "total_cost_with_material_cost": total_cost_with_material_cost,
#         "Material_cost_per_unit": Material_cost,
#         "total_material_cost": Total_material_cost
#     }

# below added to display size also



@router.post("/turning_update_machining_cost/")
def calculate_machining_cost(
    turning_history_id: int = Form(...),
    turning_percentage: float = Form(...),
    boring_percentage: float = Form(...),
    threading_percentage: float = Form(...),
    milling_percentage: float = Form(...),
    turning_size: str = Form(""),
    boring_size: str = Form(""),
    threading_size: str = Form(""),
    milling_size: str = Form(""),
    db: Session = Depends(get_db)
):
    # 1️⃣ Fetch history record
    history = db.query(TurningHistoryDetails).filter(
        TurningHistoryDetails.id == turning_history_id
    ).first()
    if not history:
        raise HTTPException(status_code=404, detail="Turning history record not found")

    # 2️⃣ Fetch manufacturing percentage
    manufacturing_percentage_row = db.query(ManufacturingPercentage).first()
    if not manufacturing_percentage_row:
        raise HTTPException(status_code=404, detail="Manufacturing percentage not found")

    percentage_of_manufacturing = manufacturing_percentage_row.percentage_of_manufacturing_time
    machining_hours = history.machining_hours
    Manufacturing_hours = (100 / percentage_of_manufacturing) * machining_hours
    material_id = history.material_id
    Material_cost = history.Material_cost
    filename = history.filename

    # 3️⃣ Fetch machining cost record
    existing_record = db.query(TurningMachiningCost).filter(
        TurningMachiningCost.history_id == turning_history_id
    ).first()
    if not existing_record:
        raise HTTPException(status_code=404, detail="Machining cost record not found for this history ID")

    quantity = existing_record.quantity
    if not quantity or quantity <= 0:
        raise HTTPException(status_code=400, detail="Invalid or missing quantity in machining cost record")

    # 4️⃣ Fetch machine hour rates for material
    rates_list = db.query(TurningMachineHourRate).filter(
        TurningMachineHourRate.material_id == material_id
    ).all()
    if not rates_list:
        raise HTTPException(status_code=404, detail="Machine rates not found for this material")

    def find_rate_for_size(size_condition: str):
        for rate in rates_list:
            if rate.diameter_condition.strip() == size_condition.strip():
                return rate
        return None

    # 5️⃣ Compute cost safely (skip if percentage == 0 or size empty)
    def safe_cost_calc(percentage, size, rate_attr):
        if percentage <= 0 or not size.strip():
            return 0.0, None
        rate_obj = find_rate_for_size(size)
        if not rate_obj:
            raise HTTPException(
                status_code=400,
                detail=f"No rate found for size '{size}' in {rate_attr} operation"
            )
        rate_value = getattr(rate_obj, rate_attr)
        return Manufacturing_hours * (percentage / 100) * rate_value, rate_obj

    cost_turning, turning_rate_obj = safe_cost_calc(turning_percentage, turning_size, "turning_rate")
    cost_boring, boring_rate_obj = safe_cost_calc(boring_percentage, boring_size, "boring_rate")
    cost_threading, threading_rate_obj = safe_cost_calc(threading_percentage, threading_size, "threading_rate")
    cost_milling, milling_rate_obj = safe_cost_calc(milling_percentage, milling_size, "milling_rate")

    # 6️⃣ Total calculations
    Material_cost_per_unit = Material_cost
    Total_material_cost = Material_cost * quantity
    total_Machining_cost_per_unit = cost_turning + cost_boring + cost_threading + cost_milling
    total_Machining_cost_per_unit = total_Machining_cost_per_unit * manufacturing_percentage_row.Correction_factor
    total_cost_without_material_cost = total_Machining_cost_per_unit * quantity
    total_cost_with_material_cost = (total_Machining_cost_per_unit + Material_cost) * quantity
    total_machining_cost = total_Machining_cost_per_unit * quantity
    total_cost_per_unit_with_materials=total_Machining_cost_per_unit+Material_cost_per_unit
    total_cost_with_material_cost_per_unit = total_Machining_cost_per_unit + Material_cost_per_unit

    # 7️⃣ Update record
    existing_record.filename = filename
    existing_record.turning_percentage = turning_percentage
    existing_record.boring_percentage = boring_percentage
    existing_record.threading_percentage = threading_percentage
    existing_record.milling_percentage = milling_percentage
    existing_record.turning_cost = cost_turning
    existing_record.boring_cost = cost_boring
    existing_record.threading_cost = cost_threading
    existing_record.milling_cost = cost_milling
    existing_record.total_machining_cost_per_unit = total_Machining_cost_per_unit
    existing_record.Material_cost_per_unit = Material_cost_per_unit
    existing_record.total_material_cost = Total_material_cost
    existing_record.total_cost_without_material_cost = total_cost_without_material_cost
    existing_record.total_Manufacturing_time = Manufacturing_hours
    existing_record.total_cost_with_material_cost = total_cost_with_material_cost
    existing_record.total_machining_cost = total_machining_cost
    existing_record.turning_size = turning_size
    existing_record.boring_size = boring_size
    existing_record.threading_size = threading_size
    existing_record.milling_size = milling_size

    db.commit()
    db.refresh(existing_record)

    # 8️⃣ Return result
    return {
        "message": f"Machining cost record updated for history_id {turning_history_id}",
        "id": existing_record.id,
        "history_id": turning_history_id,
        "quantity": quantity,
        "turning_cost": cost_turning,
        "boring_cost": cost_boring,
        "threading_cost": cost_threading,
        "milling_cost": cost_milling,
        "total_machining_cost_per_unit": total_Machining_cost_per_unit,
        "total_machining_cost": total_machining_cost,
        "total_cost_without_material_cost": total_cost_without_material_cost,
        "total_cost_with_material_cost": total_cost_with_material_cost,
        "total_cost_with_material_cost_per_unit": total_cost_with_material_cost_per_unit,
        "Material_cost_per_unit": Material_cost,
        "total_material_cost": Total_material_cost,
        "turning_size": turning_size,
        "boring_size": boring_size,
        "threading_size": threading_size,
        "milling_size": milling_size,
        "total_cost_per_unit_with_materials": total_cost_per_unit_with_materials
    }


@router.get("/turning-history-details/", response_model=List[TurningHistoryCostResponse])
async def get_all_turning_history_details(db: Session = Depends(get_db)):
    """
    Fetch all records from Turning_History_Details table with combined data from Turning_Machining_Costs
    """
    try:
        # Query all records from TurningHistoryDetails table with left join to TurningMachiningCost
        history_details = db.query(models.TurningHistoryDetails, models.TurningMachiningCost).outerjoin(
            models.TurningMachiningCost,
            models.TurningHistoryDetails.id == models.TurningMachiningCost.history_id
        ).all()
        
        # Convert to response format
        result = []
        for history_record, cost_record in history_details:
            history_data = TurningHistoryCostResponse(
                # TurningHistoryDetails fields
                history_id=history_record.id,
                filename=history_record.filename,
                length=history_record.length,
                breadth=history_record.breadth,
                height=history_record.height,
                volume_mm3=history_record.volume_mm3,
                volume_m3=history_record.volume_m3,
                material_id=history_record.material_id,
                material_name=history_record.material_name,
                material_specification=history_record.material_specification,
                density=history_record.density,
                material_cost=history_record.material_cost,
                diameter=history_record.diameter,
                axis_length=history_record.axis_length,
                stock_length=history_record.stock_length,
                stock_diameter=history_record.stock_diameter,
                stock_volume_mm3=history_record.stock_volume_mm3,
                stock_volume_m3=history_record.stock_volume_m3,
                material_removed_m3=history_record.material_removed_m3,
                stock_weight_kg=history_record.stock_weight_kg,
                Material_cost=history_record.Material_cost,
                roughing_mrr=history_record.roughing_mrr,
                finishing_mrr=history_record.finishing_mrr,
                roughing_time=history_record.roughing_time,
                finishing_time=history_record.finishing_time,
                machining_hours=history_record.machining_hours,
                diameter_range=history_record.diameter_range,
                roughing_depth_of_cut=history_record.roughing_depth_of_cut,
                roughing_feed_rate=history_record.roughing_feed_rate,
                roughing_cutting_speed=history_record.roughing_cutting_speed,
                finishing_depth_of_cut=history_record.finishing_depth_of_cut,
                finishing_feed_rate=history_record.finishing_feed_rate,
                finishing_cutting_speed=history_record.finishing_cutting_speed,
                history_created_at=history_record.created_at.isoformat() if history_record.created_at else None,
                
                # TurningMachiningCost fields (will be None if no cost record exists)
                cost_id=cost_record.id if cost_record else None,
                cost_filename=cost_record.filename if cost_record else None,
                turning_percentage=cost_record.turning_percentage if cost_record else None,
                boring_percentage=cost_record.boring_percentage if cost_record else None,
                threading_percentage=cost_record.threading_percentage if cost_record else None,
                milling_percentage=cost_record.milling_percentage if cost_record else None,
                turning_cost=cost_record.turning_cost if cost_record else None,
                boring_cost=cost_record.boring_cost if cost_record else None,
                threading_cost=cost_record.threading_cost if cost_record else None,
                milling_cost=cost_record.milling_cost if cost_record else None,
                total_Manufacturing_time=cost_record.total_Manufacturing_time if cost_record else None,
                total_machining_cost_per_unit=cost_record.total_machining_cost_per_unit if cost_record else None,
                total_machining_cost=cost_record.total_machining_cost if cost_record else None,
                Material_cost_per_unit=cost_record.Material_cost_per_unit if cost_record else None,
                total_material_cost=cost_record.total_material_cost if cost_record else None,
                total_cost_without_material_cost=cost_record.total_cost_without_material_cost if cost_record else None,
                total_cost_with_material_cost=cost_record.total_cost_with_material_cost if cost_record else None,
                quantity=cost_record.quantity if cost_record else None,
                turning_size=cost_record.turning_size if cost_record else None,
                milling_size=cost_record.milling_size if cost_record else None,
                boring_size=cost_record.boring_size if cost_record else None,
                threading_size=cost_record.threading_size if cost_record else None
            )
            result.append(history_data)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching turning history details: {str(e)}")


@router.get("/turning-history-cost/{history_id}", response_model=TurningHistoryCostResponse)
async def get_turning_history_cost_by_id(history_id: int, db: Session = Depends(get_db)):
    """
    Fetch combined data from TurningHistoryDetails and TurningMachiningCost tables by history_id
    """
    try:
        # Fetch data from TurningHistoryDetails
        history_details = db.query(models.TurningHistoryDetails).filter(
            models.TurningHistoryDetails.id == history_id
        ).first()
        
        if not history_details:
            raise HTTPException(status_code=404, detail="Turning history details not found")
        
        # Fetch data from TurningMachiningCost
        cost_details = db.query(models.TurningMachiningCost).filter(
            models.TurningMachiningCost.history_id == history_id
        ).first()
        
        # Combine the data
        combined_data = TurningHistoryCostResponse(
            # TurningHistoryDetails fields
            history_id=history_details.id,
            filename=history_details.filename,
            length=history_details.length,
            breadth=history_details.breadth,
            height=history_details.height,
            volume_mm3=history_details.volume_mm3,
            volume_m3=history_details.volume_m3,
            material_id=history_details.material_id,
            material_name=history_details.material_name,
            material_specification=history_details.material_specification,
            density=history_details.density,
            material_cost=history_details.material_cost,
            diameter=history_details.diameter,
            axis_length=history_details.axis_length,
            stock_length=history_details.stock_length,
            stock_diameter=history_details.stock_diameter,
            stock_volume_mm3=history_details.stock_volume_mm3,
            stock_volume_m3=history_details.stock_volume_m3,
            material_removed_m3=history_details.material_removed_m3,
            stock_weight_kg=history_details.stock_weight_kg,
            Material_cost=history_details.Material_cost,
            roughing_mrr=history_details.roughing_mrr,
            finishing_mrr=history_details.finishing_mrr,
            roughing_time=history_details.roughing_time,
            finishing_time=history_details.finishing_time,
            machining_hours=history_details.machining_hours,
            diameter_range=history_details.diameter_range,
            roughing_depth_of_cut=history_details.roughing_depth_of_cut,
            roughing_feed_rate=history_details.roughing_feed_rate,
            roughing_cutting_speed=history_details.roughing_cutting_speed,
            finishing_depth_of_cut=history_details.finishing_depth_of_cut,
            finishing_feed_rate=history_details.finishing_feed_rate,
            finishing_cutting_speed=history_details.finishing_cutting_speed,
            history_created_at=history_details.created_at.isoformat() if history_details.created_at else None,
            
            # TurningMachiningCost fields (will be None if no cost record exists)
            cost_id=cost_details.id if cost_details else None,
            cost_filename=cost_details.filename if cost_details else None,
            turning_percentage=cost_details.turning_percentage if cost_details else None,
            boring_percentage=cost_details.boring_percentage if cost_details else None,
            threading_percentage=cost_details.threading_percentage if cost_details else None,
            milling_percentage=cost_details.milling_percentage if cost_details else None,
            turning_cost=cost_details.turning_cost if cost_details else None,
            boring_cost=cost_details.boring_cost if cost_details else None,
            threading_cost=cost_details.threading_cost if cost_details else None,
            milling_cost=cost_details.milling_cost if cost_details else None,
            total_Manufacturing_time=cost_details.total_Manufacturing_time if cost_details else None,
            total_machining_cost_per_unit=cost_details.total_machining_cost_per_unit if cost_details else None,
            total_machining_cost=cost_details.total_machining_cost if cost_details else None,
            Material_cost_per_unit=cost_details.Material_cost_per_unit if cost_details else None,
            total_material_cost=cost_details.total_material_cost if cost_details else None,
            total_cost_without_material_cost=cost_details.total_cost_without_material_cost if cost_details else None,
            total_cost_with_material_cost=cost_details.total_cost_with_material_cost if cost_details else None,
            quantity=cost_details.quantity if cost_details else None,
            turning_size=cost_details.turning_size if cost_details else None,
            milling_size=cost_details.milling_size if cost_details else None,
            boring_size=cost_details.boring_size if cost_details else None,
            threading_size=cost_details.threading_size if cost_details else None
        )
        
        return combined_data
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching turning history cost: {str(e)}")


@router.post("/bounding-box-iges-turning/")
async def get_bounding_box_iges(
    file: UploadFile = File(...),
    material_id: int = Form(...),
    db: Session = Depends(get_db)
):
    import os
    import uuid
    import math
    import shutil

    from pathlib import Path
    from fastapi import HTTPException

    import cadquery as cq

    from OCP.IGESControl import IGESControl_Reader
    from OCP.GProp import GProp_GProps
    from OCP.BRepGProp import BRepGProp
    from OCP.TopExp import TopExp_Explorer
    from OCP.TopAbs import TopAbs_SOLID

    # ---------------------------
    # VALIDATION
    # ---------------------------
    if not file.filename.lower().endswith((".igs", ".iges")):
        raise HTTPException(status_code=400, detail="Upload IGES file")

    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = Path("uploads") / unique_filename
    file_path.parent.mkdir(exist_ok=True)

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # ---------------------------
        # LOAD IGES (OCP)
        # ---------------------------
        reader = IGESControl_Reader()
        status = reader.ReadFile(str(file_path))

        if status != 1:
            raise HTTPException(status_code=500, detail="Failed to read IGES")

        reader.TransferRoots()
        shape = reader.OneShape()

        if shape.IsNull():
            raise HTTPException(status_code=400, detail="Invalid IGES file")

        # ---------------------------
        # EXTRACT SOLID (same as before)
        # ---------------------------
        explorer = TopExp_Explorer(shape, TopAbs_SOLID)
        solids = []

        while explorer.More():
            solids.append(explorer.Current())
            explorer.Next()

        if not solids:
            raise HTTPException(status_code=400, detail="No solid found in IGES")

        shape = solids[0]

        # ---------------------------
        # 🔥 FIXED BOUNDING BOX (CadQuery)
        # ---------------------------
        cq_shape = cq.Shape(shape)
        part = cq.Workplane("XY").newObject([cq_shape])

        bb = part.val().BoundingBox()

        x_dim = bb.xlen
        y_dim = bb.ylen
        z_dim = bb.zlen

        dims_sorted = sorted(
            [(x_dim, "X"), (y_dim, "Y"), (z_dim, "Z")],
            reverse=True,
            key=lambda x: x[0]
        )

        length = round(dims_sorted[0][0], 2)
        breadth = round(dims_sorted[1][0], 2)
        height = round(dims_sorted[2][0], 2)

        # ---------------------------
        # VOLUME (same)
        # ---------------------------
        props = GProp_GProps()
        BRepGProp.VolumeProperties_s(shape, props)
        volume_mm3 = round(props.Mass(), 2)
        volume_m3 = round(volume_mm3 / 1e9, 10)

        # ---------------------------
        # MATERIAL FETCH (same as old)
        # ---------------------------
        material = db.query(models.TurningMaterials).filter(
            models.TurningMaterials.id == material_id
        ).first()

        if not material:
            raise HTTPException(status_code=404, detail="Material not found")

        # ---------------------------
        # DERIVED PARAMETERS (same)
        # ---------------------------
        diameter = None
        axis_length = None

        if length == breadth or length == height:
            diameter = length
            axis_length = breadth if length == height else height
        elif breadth == height:
            diameter = breadth
            axis_length = length
        else:
            threshold = 20
            diffs = [
                (abs(length - breadth), (length, breadth, height)),
                (abs(length - height), (length, height, breadth)),
                (abs(breadth - height), (breadth, height, length)),
            ]
            close_pair = min(diffs, key=lambda x: x[0])
            if close_pair[0] <= threshold:
                a, b, other = close_pair[1]
                diameter = max(a, b)
                axis_length = other

        diameter = math.floor(diameter + 0.5)

        # ---------------------------
        # STOCK CALCULATION (same)
        # ---------------------------
        stock_length = axis_length + 50
        stock_diameter = diameter + 10

        stock_volume_mm3 = round(math.pi * (stock_diameter ** 2) * stock_length / 4, 2)
        stock_volume_m3 = round(stock_volume_mm3 / 1e9, 10)

        density = material.density
        cost_per_kg = material.material_cost

        material_removed_m3 = stock_volume_m3 - volume_m3
        material_removed_mm3 = stock_volume_mm3 - volume_mm3
        stock_weight = stock_volume_m3 * density
        actual_mass = volume_m3 * density
        material_cost = stock_weight * cost_per_kg

        # ---------------------------
        # PERCENTAGES
        # ---------------------------
        percentages = db.query(models.TurningPercentages).first()
        if not percentages:
            raise HTTPException(status_code=404, detail="Percentages missing")

        roughing_percentage = percentages.roughing_percentage
        finishing_percentage = percentages.finishing_percentage

        # ---------------------------
        # PARAMETER MATCHING (FULL OLD LOGIC)
        # ---------------------------
        all_params = db.query(models.TurningParameters).filter(
            models.TurningParameters.material_id == material_id
        ).all()

        selected_params = None

        for param in all_params:
            if "-" in param.diameter_range:
                low, high = map(float, param.diameter_range.split("-"))
                if low <= stock_diameter <= high:
                    selected_params = param
                    break
            elif ">" in param.diameter_range:
                threshold = float(param.diameter_range.replace(">", ""))
                if stock_diameter > threshold:
                    selected_params = param
                    break
            elif "<" in param.diameter_range:
                threshold = float(param.diameter_range.replace("<", ""))
                if stock_diameter < threshold:
                    selected_params = param
                    break

        if not selected_params:
            raise HTTPException(status_code=400, detail="No matching parameter")

        # ---------------------------
        # MRR
        # ---------------------------
        roughing_mrr_mm3_min = (
            selected_params.roughing_feed_rate *
            selected_params.roughing_depth_of_cut *
            selected_params.roughing_cutting_speed * 1000
        )

        finishing_mrr_mm3_min = (
            selected_params.finishing_feed_rate *
            selected_params.finishing_depth_of_cut *
            selected_params.finishing_cutting_speed * 1000
        )

        # ---------------------------
        # MACHINING TIME
        # ---------------------------
        roughing_time = ((material_removed_mm3 * (roughing_percentage / 100)) / roughing_mrr_mm3_min) / 60
        finishing_time = (material_removed_mm3 * (finishing_percentage / 100)) / finishing_mrr_mm3_min / 60
        machining_hours = roughing_time + finishing_time

        # ---------------------------
        # DATABASE INSERT (FULL OLD FIELDS)
        # ---------------------------
        history = models.TurningHistoryDetails(
            filename=file.filename,
            length=length,
            breadth=breadth,
            height=height,
            volume_mm3=volume_mm3,
            volume_m3=volume_m3,
            material_id=material.id,
            material_name=material.material,
            material_specification=material.material_specification,
            density=material.density,
            material_cost=material.material_cost,
            diameter=diameter,
            axis_length=axis_length,
            stock_length=stock_length,
            stock_diameter=stock_diameter,
            stock_volume_mm3=stock_volume_mm3,
            stock_volume_m3=stock_volume_m3,
            material_removed_m3=material_removed_m3,
            stock_weight_kg=stock_weight,
            Material_cost=material_cost,
            roughing_mrr=roughing_mrr_mm3_min,
            finishing_mrr=finishing_mrr_mm3_min,
            roughing_time=roughing_time,
            finishing_time=finishing_time,
            machining_hours=machining_hours,
            diameter_range=selected_params.diameter_range,
            roughing_depth_of_cut=selected_params.roughing_depth_of_cut,
            roughing_feed_rate=selected_params.roughing_feed_rate,
            roughing_cutting_speed=selected_params.roughing_cutting_speed,
            finishing_depth_of_cut=selected_params.finishing_depth_of_cut,
            finishing_feed_rate=selected_params.finishing_feed_rate,
            finishing_cutting_speed=selected_params.finishing_cutting_speed,
        )

        db.add(history)
        db.commit()
        db.refresh(history)

        # ---------------------------
        # RESPONSE (FULL OLD STRUCTURE)
        # ---------------------------
        return {
            "id": history.id,
            "filename": file.filename,
            "bounding_box": {
                "length": length,
                "breadth": breadth,
                "height": height,
            },
            "volume": {
                "mm3": volume_mm3,
                "m3": volume_m3,
                "actual_mass": actual_mass
            },
            "material": {
                "id": material.id,
                "name": material.material,
                "specification": material.material_specification,
                "density": material.density,
                "material_cost": material.material_cost
            },
            "derived_parameters": {
                "diameter": diameter,
                "axis_length": axis_length,
            },
            "stock": {
                "stock_length": stock_length,
                "stock_diameter": stock_diameter,
                "stock_volume_mm3": stock_volume_mm3,
                "stock_volume_m3": stock_volume_m3,
                "material_removed_m3": material_removed_m3,
                "stock_weight_kg": stock_weight,
                "Material_cost": material_cost
            },
            "machining": {
                "roughing_mrr": roughing_mrr_mm3_min,
                "finishing_mrr": finishing_mrr_mm3_min,
                "roughing_time": roughing_time,
                "finishing_time": finishing_time,
                "machining_hours": machining_hours
            },
            "selected_parameters": {
                "diameter_range": selected_params.diameter_range,
                "roughing_depth_of_cut": selected_params.roughing_depth_of_cut,
                "roughing_feed_rate": selected_params.roughing_feed_rate,
                "roughing_cutting_speed": selected_params.roughing_cutting_speed,
                "finishing_depth_of_cut": selected_params.finishing_depth_of_cut,
                "finishing_feed_rate": selected_params.finishing_feed_rate,
                "finishing_cutting_speed": selected_params.finishing_cutting_speed,
            }
        }

    finally:
        file_path.unlink(missing_ok=True)