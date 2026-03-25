import io

from OCP.ShapeFix import ShapeFix_Shape

import uuid
from _operator import and_, or_

from pydantic import BaseModel
from pytz import timezone
from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pathlib import Path
import shutil
import cadquery as cq
import math

from starlette.requests import Request
from starlette.responses import StreamingResponse, JSONResponse

from db import get_db, engine, SessionLocal

import models

from models import Materials
from models import User

from schemas import UserCreate, UserOut, PasswordUpdateRequest, UserLoginSchema, PasswordUpdateRequest_1, \
    MaterialResponse, MaterialCreate, UserResponse, UserDeleteRequest, MaterialUpdateResponse, MachineRateResponse, \
    MachineRateCreate, MachineDistributionInput, MaterialSchema, UpdateMaterialCostInput, MaterialInput, \
    DeleteMaterialInput, UpdateMachineRateInput, AddMachineRateInput, UpdateMillingParametersInput, \
    UpdateMillingPercentagesInput, UpdateManufacturingPercentageInput, AddMillingParametersInput, \
    MillingMachineDistributionInput, MillingCostResponse, MillingHistoryCostResponse
from utils import get_password_hash, verify_password

from fastapi import APIRouter

router = APIRouter()
import cadquery as cq
import numpy as np
import shutil, uuid
from pathlib import Path
from OCP.BRepGProp import BRepGProp
from OCP.GProp import GProp_GProps
from OCP.gp import gp_Pnt, gp_Trsf, gp_Vec, gp_Ax3, gp_Dir
from OCP.TopLoc import TopLoc_Location


#

# import sys
# sys.path.append(r"C:\Program Files\FreeCAD 1.0\bin")
# import FreeCAD, Part

@router.post("/admin/fix-sequence")
def fix_materials_sequence(db: Session = Depends(get_db)):
    try:
        # Get the maximum ID currently in the table
        max_id = db.query(db.func.max(Materials.id)).scalar() or 0

        # Reset the sequence to the correct value
        db.execute(f'ALTER SEQUENCE "Materials_id_seq" RESTART WITH {max_id + 1}')
        db.commit()

        return {"message": f"Sequence reset to {max_id + 1}"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to fix sequence: {str(e)}")


@router.post("/create-initial-admin", response_model=UserOut)
def create_initial_admin(user: UserCreate, db: Session = Depends(get_db)):
    # Check if any user already exists
    existing_user = db.query(models.User).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Admin already exists")

    # Check if username is taken
    username_check = db.query(models.User).filter(models.User.username == user.username).first()
    if username_check:
        raise HTTPException(status_code=400, detail="Username already taken")

    # Create the admin user
    hashed_pw = get_password_hash(user.password)
    new_user = models.User(
        username=user.username,
        hashed_password=hashed_pw,
        role="admin"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


SECRET_ADMIN_KEY = "ADA"


@router.put("/admin/update-password")
def update_admin_password(request: PasswordUpdateRequest, db: Session = Depends(get_db)):
    if request.secret_key != SECRET_ADMIN_KEY:
        raise HTTPException(status_code=401, detail="Invalid secret key")

    user = db.query(User).filter(User.username == request.username, User.role == "admin").first()
    if not user:
        raise HTTPException(status_code=404, detail="Admin user not found")

    user.hashed_password = get_password_hash(request.new_password)
    db.commit()

    return {"message": "Password updated successfully"}


@router.post("/login")
def login(user: UserLoginSchema, request: Request, db: Session = Depends(get_db)):
    # Step 1: Fetch the exact user matching username and role
    db_user = db.query(User).filter(
        User.username == user.username,
        User.role == user.role
    ).first()

    # Step 2: Validate user exists with that username+role
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid username or role")

    # Step 3: Validate password for that user
    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid password")

    # Step 4: Set session and return success
    request.session["user_id"] = db_user.id
    request.session["role"] = db_user.role

    return {
        "message": "Login successful",
        "user_id": db_user.id,
        "role": db_user.role
    }


@router.post("/create-user")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if a user with the same username *and* role already exists
    existing_user = db.query(User).filter(
        User.username == user.username,
        User.role == user.role
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail=f"Username '{user.username}' already exists for role '{user.role}'")

    new_user = User(
        username=user.username,
        hashed_password=get_password_hash(user.password),
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully", "user_id": new_user.id}


@router.put("/update-password")
def update_password(payload: PasswordUpdateRequest_1, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        User.username == payload.username,
        User.role == payload.role
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.role == "admin":
        raise HTTPException(status_code=403, detail="Admin password cannot be updated here")

    user.hashed_password = get_password_hash(payload.new_password)
    db.commit()

    return {"message": "Password updated successfully"}


@router.get("/users", response_model=list[UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users


@router.delete("/users/delete")
def delete_user(request: UserDeleteRequest, db: Session = Depends(get_db)):
    # Find the user with matching username and role
    user = db.query(User).filter(
        User.username == request.username,
        User.role == request.role
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Delete the user
    db.delete(user)
    db.commit()

    return {"message": f"User '{request.username}' with role '{request.role}' deleted successfully"}


# the component is alligned to origin

@router.post("/analyze-steptry/")
async def analyze_step_file(
        file: UploadFile = File(...),
        material_id: int = Form(...),
        quantity: int = Form(1),
        db: Session = Depends(get_db)
):
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = Path("uploads") / unique_filename
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # --- Fetch material ---
        material_obj = db.query(models.Materials).filter(models.Materials.id == material_id).first()
        if not material_obj or material_obj.density is None:
            raise HTTPException(status_code=404, detail="Material not found or invalid density")

        density = material_obj.density
        material_name = material_obj.material.strip()

        # --- STEP file analysis ---
        part = cq.importers.importStep(str(file_path))

        # --- Compute mass properties ---
        props = GProp_GProps()
        BRepGProp.VolumeProperties_s(part.val().wrapped, props)

        # --- Get center of mass ---
        com = props.CentreOfMass()
        com_vec = np.array([com.X(), com.Y(), com.Z()])

        # --- Get inertia tensor ---
        inertia = props.MatrixOfInertia()
        I = np.array([
            [inertia.Value(1, 1), inertia.Value(1, 2), inertia.Value(1, 3)],
            [inertia.Value(2, 1), inertia.Value(2, 2), inertia.Value(2, 3)],
            [inertia.Value(3, 1), inertia.Value(3, 2), inertia.Value(3, 3)]
        ])

        # --- Eigen decomposition ---
        eigvals, eigvecs = np.linalg.eigh(I)
        eigvecs = eigvecs / np.linalg.norm(eigvecs, axis=0)  # normalize

        # --- Apply translation: move COM to origin ---
        trsf = gp_Trsf()
        trsf.SetTranslation(gp_Vec(-com.X(), -com.Y(), -com.Z()))

        # --- Set rotation using principal axes ---
        dir_x = gp_Dir(*eigvecs[:, 0])
        dir_y = gp_Dir(*eigvecs[:, 1])
        dir_z = gp_Dir(*eigvecs[:, 2])
        local_cs = gp_Ax3(gp_Pnt(0, 0, 0), dir_z, dir_x)
        trsf.SetTransformation(local_cs)

        location = TopLoc_Location(trsf)
        aligned_shape = part.val().wrapped.Moved(location)
        aligned_part = cq.Workplane("ZX").newObject([cq.Shape(aligned_shape)])

        # --- Center the part around origin (BB center to 0,0,0) ---
        bb = aligned_part.val().BoundingBox()
        center = (
            (bb.xmin + bb.xmax) / 2,
            (bb.ymin + bb.ymax) / 2,
            (bb.zmin + bb.zmax) / 2
        )
        aligned_part = aligned_part.translate((-center[0], -center[1], -center[2]))

        # --- Bounding box dimensions (aligned) ---
        bb = aligned_part.val().BoundingBox()
        x_dim = bb.xlen
        y_dim = bb.ylen
        z_dim = bb.zlen

        # --- Determine length, breadth, height ---
        dims_sorted = sorted([(x_dim, 'X'), (y_dim, 'Y'), (z_dim, 'Z')],
                             reverse=True, key=lambda x: x[0])
        length, breadth, height = dims_sorted[0][0], dims_sorted[1][0], dims_sorted[2][0]

        # --- Volume calculations ---
        shape = aligned_part.val()
        volume_mm3 = shape.Volume()

        volume_m3 = volume_mm3 / 1e9

        # --- Helper functions ---
        def round_to_nearest(value, base):
            return int(base * round(float(value) / base))

        # def get_raw_extra(x, y, z):
        #     max_dim = max(x, y, z)
        #     if max_dim <= 50:
        #         return 20, 20, 5
        #     elif max_dim <= 100:
        #         return 30, 30, 5
        #     elif max_dim <= 200:
        #         return 30, 30, 5
        #     elif max_dim <= 500:
        #         return 50, 50, 10
        #     else:
        #         return 100, 100, 10

        def get_raw_extra(L, B, H):
            """Return δL, δB, δH individually based on each dimension."""
            # For Length
            if L <= 50:
                δL = 20
            elif L <= 100:
                δL = 30
            elif L <= 200:
                δL = 30
            elif L <= 500:
                δL = 50
            elif L <= 1000:
                δL = 100
            elif L <= 2000:
                δL = 100
            else:
                δL = 100

            # For Breadth
            if B <= 50:
                δB = 20
            elif B <= 100:
                δB = 30
            elif B <= 200:
                δB = 30
            elif B <= 500:
                δB = 50
            elif B <= 1000:
                δB = 100
            elif B <= 2000:
                δB = 100
            else:
                δB = 100

            # For Height
            if H <= 50:
                δH = 5
            elif H <= 100:
                δH = 5
            elif H <= 200:
                δH = 5
            elif H <= 500:
                δH = 10
            elif H <= 1000:
                δH = 10
            elif H <= 2000:
                δH = 10
            else:
                δH = 10

            return δL, δB, δH

        δX, δY, δZ = get_raw_extra(length, breadth, height)

        stock_L = round_to_nearest(length + δX, 10)
        stock_B = round_to_nearest(breadth + δY, 10)
        stock_H = round_to_nearest(height + δZ, 5)

        # stock_L = round(length + δX, 2)
        # stock_B = round(breadth + δY, 2)
        # stock_H = round(height + δZ, 2)

        stock_volume_mm3 = stock_L * stock_B * stock_H
        stock_volume_m3 = stock_volume_mm3 / 1e9

        # --- Store results ---
        history = models.MillingHistoryDetails(
            filename=file.filename,
            material_id=material_id,
            material_name=material_name,
            density=density,
            quantity=quantity,
            actual_length=round(length, 2),
            actual_breadth=round(breadth, 2),
            actual_height=round(height, 2),
            actual_volume_mm3=round(volume_mm3),
            actual_volume_m3=round(volume_m3, 10),
            stock_length=stock_L,
            stock_breadth=stock_B,
            stock_height=stock_H,
            stock_volume_mm3=round(stock_volume_mm3),
            stock_volume_m3=round(stock_volume_m3, 10),
            delta_x=δX,
            delta_y=δY,
            delta_z=δZ,
        )
        db.add(history)
        db.commit()
        db.refresh(history)

        print(f"✅ Inserted MillingHistoryDetails with history_id={history.id}")

        return {
            "id": history.id,
            "filename": file.filename,
            "material_id": material_id,
            "material_name": material_name,
            "density": density,
            "quantity": quantity,
            "actual_dimensions": {
                "length": round(length, 2),
                "breadth": round(breadth, 2),
                "height": round(height, 2),
                "volume_mm3": round(volume_mm3),
                "volume_m3": round(volume_m3, 10)
            },
            "stock_dimensions": {
                "length": stock_L,
                "breadth": stock_B,
                "height": stock_H,
                "volume_mm3": round(stock_volume_mm3),
                "volume_m3": round(stock_volume_m3, 10)
            },
            "raw_extra": {"δX": δX, "δY": δY, "δZ": δZ}
        }

    finally:
        file_path.unlink(missing_ok=True)


# not oriented below
# @router.post("/analyze-steptry/")
# async def analyze_step_file(
#     file: UploadFile = File(...),
#     material_id: int = Form(...),
#     quantity: int = Form(1),
#     db: Session = Depends(get_db)
# ):
#     unique_filename = f"{uuid.uuid4()}_{file.filename}"
#     file_path = Path("uploads") / unique_filename
#     with file_path.open("wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)
#
#     try:
#         # --- Fetch material ---
#         material_obj = db.query(models.Materials).filter(models.Materials.id == material_id).first()
#         if not material_obj or material_obj.density is None:
#             raise HTTPException(status_code=404, detail="Material not found or invalid density")
#
#         density = material_obj.density
#         material_name = material_obj.material.strip()
#
#         # --- STEP file analysis ---
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
#         length, breadth, height = dims_sorted[0][0], dims_sorted[1][0], dims_sorted[2][0]
#
#         volume_mm3 = shape.Volume()
#         volume_m3 = volume_mm3 / 1e9
#
#         def round_to_nearest(value, base):
#             return int(base * round(float(value) / base))
#
#         def get_raw_extra(x, y, z):
#             max_dim = max(x, y, z)
#             if max_dim <= 50:
#                 return 20, 20, 5
#             elif max_dim <= 100:
#                 return 30, 30, 5
#             elif max_dim <= 200:
#                 return 30, 30, 5
#             elif max_dim <= 500:
#                 return 50, 50, 10
#             else:
#                 return 100, 100, 10
#
#         δX, δY, δZ = get_raw_extra(length, breadth, height)
#
#         stock_L = round_to_nearest(length + δX, 10)
#         stock_B = round_to_nearest(breadth + δY, 10)
#         stock_H = round_to_nearest(height + δZ, 5)
#
#         stock_volume_mm3 = stock_L * stock_B * stock_H
#         stock_volume_m3 = stock_volume_mm3 / 1e9
#
#         # --- Always insert new row ---
#         history = models.MillingHistoryDetails(
#             filename=file.filename,
#             material_id=material_id,
#             material_name=material_name,
#             density=density,
#             quantity=quantity,
#             actual_length=round(length, 2),
#             actual_breadth=round(breadth, 2),
#             actual_height=round(height, 2),
#             actual_volume_mm3=round(volume_mm3),
#             actual_volume_m3=round(volume_m3, 10),
#             stock_length=stock_L,
#             stock_breadth=stock_B,
#             stock_height=stock_H,
#             stock_volume_mm3=round(stock_volume_mm3),
#             stock_volume_m3=round(stock_volume_m3, 10),
#             delta_x=δX,
#             delta_y=δY,
#             delta_z=δZ,
#         )
#         db.add(history)
#         db.commit()
#         db.refresh(history)
#
#         return {
#             "id": history.id,
#             "filename": file.filename,
#             "material_id": material_id,
#             "material_name": material_name,
#             "density": density,
#             "quantity": quantity,
#             "actual_dimensions": {
#                 "length": round(length, 2),
#                 "breadth": round(breadth, 2),
#                 "height": round(height, 2),
#                 "volume_mm3": round(volume_mm3),
#                 "volume_m3": round(volume_m3, 10)
#             },
#             "stock_dimensions": {
#                 "length": stock_L,
#                 "breadth": stock_B,
#                 "height": stock_H,
#                 "volume_mm3": round(stock_volume_mm3),
#                 "volume_m3": round(stock_volume_m3, 10)
#             },
#             "raw_extra": {"δX": δX, "δY": δY, "δZ": δZ}
#         }
#
#     finally:
#         file_path.unlink(missing_ok=True)


# changet to check length breadth and height

@router.post("/Milling_calculate-material-costtry/")
async def calculate_material_cost(
        data: MachineDistributionInput,
        db: Session = Depends(get_db)
):
    history_id = data.history_id
    machine_distribution = data.machine_distribution

    # --- Fetch milling history record ---
    record = db.query(models.MillingHistoryDetails).filter(
        models.MillingHistoryDetails.id == history_id
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Milling history record not found")

    # --- Fetch material details ---
    material = db.query(models.Materials).filter(models.Materials.id == record.material_id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")

    # --- Material Cost ---
    stock_mass = record.stock_volume_m3 * material.density
    Actual_weight = record.actual_volume_m3 * material.density
    material_cost_per_unit = stock_mass * material.material_cost
    quantity = record.quantity

    # --- Material Removed ---
    if record.stock_volume_mm3 is None or record.actual_volume_mm3 is None:
        raise HTTPException(status_code=400, detail="Stock or actual volume not defined")

    material_removed = record.stock_volume_mm3 - record.actual_volume_mm3

    # --- Milling Parameters (MRR) ---
    stock_length = record.stock_length  # assumes stock_length in mm
    params_list = db.query(models.MillingParameters).filter(
        models.MillingParameters.material_id == material.id
    ).all()

    if not params_list:
        raise HTTPException(status_code=404, detail="No milling parameters found for this material")

    def length_in_range(length_range: str, length: float) -> bool:
        length_range = length_range.strip()
        if '-' in length_range:
            start, end = map(float, length_range.split('-'))
            return start <= length <= end
        elif length_range.startswith('>'):
            return length > float(length_range[1:])
        elif length_range.startswith('<'):
            return length < float(length_range[1:])
        else:
            return False

    matched_param = None
    for param in params_list:
        if length_in_range(param.length_range, stock_length):
            matched_param = param
            break

    if not matched_param:
        raise HTTPException(status_code=404, detail="No matching milling parameters for stock length")

    roughing_mrr = (
            matched_param.roughing_feed_rate *
            matched_param.roughing_depth_of_cut *
            matched_param.roughing_radial_woc
    )
    finishing_mrr = (
            matched_param.finishing_feed_rate *
            matched_param.finishing_depth_of_cut *
            matched_param.finishing_radial_woc
    )

    # --- Roughing & Finishing Machine Time ---
    milling_percentage = db.query(models.MillingPercentages).first()
    if not milling_percentage:
        raise HTTPException(status_code=404, detail="Milling percentages not defined")

    roughing_time = (
            (material_removed * (milling_percentage.roughing_percentage / 100)) / roughing_mrr
    )
    finishing_time = (
            (material_removed * (milling_percentage.finishing_percentage / 100)) / finishing_mrr
    )

    total_machining_time_min = roughing_time + finishing_time
    total_machining_time_hr = total_machining_time_min / 60

    # --- Manufacturing Time ---
    manufacturing_percentage = db.query(models.MillingManufacturingPercentage).first()
    if not manufacturing_percentage:
        raise HTTPException(status_code=404, detail="Manufacturing percentage not defined")

    manufacturing_time_hr = (
            total_machining_time_hr * (100 / manufacturing_percentage.percentage_of_manufacturing_time)
    )

    # --- Machining Cost (L×B×H-based check) ---
    def parse_dimensions(size_str: str):
        """Extract L, B, H as floats from 'L*B*H' or 'LxBxH' format."""
        try:
            parts = size_str.lower().replace('x', '*').split('*')
            if len(parts) != 3:
                raise ValueError
            L, B, H = map(float, parts)
            return L, B, H
        except Exception:
            raise HTTPException(status_code=400, detail=f"Invalid size format in MachineRates: {size_str}")

    machining_cost = 0
    machine_cost_breakup = {}

    for machine_type, percentage in machine_distribution.items():
        rows = db.query(models.MachineRates).filter(
            models.MachineRates.material_id == material.id,
            models.MachineRates.machine_type == machine_type
        ).all()

        if not rows:
            raise HTTPException(status_code=404, detail=f"No machine rates defined for {machine_type}")

        possible_rates = []

        for row in rows:
            try:
                machine_L, machine_B, machine_H = parse_dimensions(row.size)
            except HTTPException as e:
                raise e

            # ✅ Compare all 3 dimensions (L, B, H)
            if (
                    record.stock_length <= machine_L and
                    record.stock_breadth <= machine_B and
                    record.stock_height <= machine_H
            ):
                possible_rates.append(((machine_L, machine_B, machine_H), row))

        if not possible_rates:
            raise HTTPException(
                status_code=404,
                detail=f"No matching machine size found for {machine_type} with stock size "
                       f"{record.stock_length}×{record.stock_breadth}×{record.stock_height}"
            )

        # ✅ Pick smallest suitable machine (based on volume)
        possible_rates.sort(key=lambda x: x[0][0] * x[0][1] * x[0][2])
        matched_rate = possible_rates[0][1]

        cost = manufacturing_time_hr * matched_rate.hourly_rate * (percentage / 100)
        machining_cost += cost
        machining_cost=machining_cost*manufacturing_percentage.Correction_factor
        machining_cost_per_unit = machining_cost
        Manufacturing_cost_without_materialcost = machining_cost_per_unit * quantity
        manufacuring_cost_with_material_cost = (machining_cost_per_unit + material_cost_per_unit) * quantity
        machine_cost_breakup[machine_type] = {
            "input_percentage": percentage,
            "matched_machine_size": matched_rate.size,
            "calculated_cost": round(cost, 2)
        }
        total_cost_per_unit_with_materials = machining_cost_per_unit + material_cost_per_unit

        Total_material_cost = material_cost_per_unit * quantity

    # --- Save result into Milling_Material_Costs table ---
    new_cost_record = models.MillingCost(
        milling_history_id=record.id,
        material_id=record.material_id,
        stock_weight_kg=round(stock_mass, 4),
        filename=record.filename,
        actual_weight=Actual_weight,
        material_removed_mm3=round(material_removed, 2),
        roughing_mrr=round(roughing_mrr, 2),
        finishing_mrr=round(finishing_mrr, 2),
        roughing_time_min=round(roughing_time, 2),
        finishing_time_min=round(finishing_time, 2),
        total_machining_time_hr=round(total_machining_time_hr, 2),
        manufacturing_time_hr=manufacturing_time_hr,
        manufacturing_cost_perunit=round(machining_cost, 2),
        material_cost_perunit=round(material_cost_per_unit, 2),
        manufacturing_cost_without_materialcost=Manufacturing_cost_without_materialcost,
        manufacturing_cost_with_material_cost=manufacuring_cost_with_material_cost,
        machine_cost_breakup=machine_cost_breakup,
        quantity=record.quantity,
        Total_material_cost=Total_material_cost

    )

    db.add(new_cost_record)
    db.commit()
    db.refresh(new_cost_record)

    # --- Final Response ---
    return {
        "message": "Material cost calculated and stored successfully",
        "stored_id": new_cost_record.id,
        "milling_history_id": record.id,
        "material_id": record.material_id,
        "material_name": material.material,

        # Material cost
        "stock_weight_kg": round(stock_mass, 4),
        "Actual_weight": Actual_weight,

        # Material removed
        "material_removed_mm3": round(material_removed, 2),

        # MRR values
        "roughing_mrr_mm3_per_min": round(roughing_mrr, 2),
        "finishing_mrr_mm3_per_min": round(finishing_mrr, 2),

        # Machine times
        "roughing_time_min": round(roughing_time, 2),
        "finishing_time_min": round(finishing_time, 2),
        "total_machining_time_hr": round(total_machining_time_hr, 2),
        "manufacturing_time_hr": manufacturing_time_hr,

        # Machining costs
        "manufacturing_cost_perunit": round(machining_cost, 2),
        "Material_cost_perunit": round(material_cost_per_unit, 2),
        "machine_cost_breakup": machine_cost_breakup,
        "Manufacturing_cost_without_materialcost": Manufacturing_cost_without_materialcost,
        "Manufacuring_cost_with_material_cost": manufacuring_cost_with_material_cost,
        "Total_material_cost": Total_material_cost,
        "total_cost_per_unit_with_materials": total_cost_per_unit_with_materials
    }


@router.get("/Milling_getmaterials/", response_model=List[MaterialSchema])
async def get_all_materials(db: Session = Depends(get_db)):
    return db.query(models.Materials).all()


@router.get("/milling-costs/", response_model=List[MillingCostResponse])
async def get_all_milling_costs(db: Session = Depends(get_db)):
    """
    Fetch all records from the Milling_Costs table with material names
    """
    # Join with Materials table to get material names
    milling_costs = db.query(
        models.MillingCost,
        models.Materials.material.label('material_name')
    ).outerjoin(
        models.Materials, 
        models.MillingCost.material_id == models.Materials.id
    ).all()
    
    if not milling_costs:
        return []
    
    # Format the response to match the schema
    result = []
    for cost, material_name in milling_costs:
        cost_data = MillingCostResponse(
            id=cost.id,
            milling_history_id=cost.milling_history_id,
            filename=cost.filename,
            material_id=cost.material_id,
            material_name=material_name,  # Add material name from the join
            quantity=cost.quantity,
            stock_weight_kg=cost.stock_weight_kg,
            actual_weight=cost.actual_weight,
            material_removed_mm3=cost.material_removed_mm3,
            roughing_mrr=cost.roughing_mrr,
            finishing_mrr=cost.finishing_mrr,
            roughing_time_min=cost.roughing_time_min,
            finishing_time_min=cost.finishing_time_min,
            total_machining_time_hr=cost.total_machining_time_hr,
            manufacturing_time_hr=cost.manufacturing_time_hr,
            manufacturing_cost_perunit=cost.manufacturing_cost_perunit,
            material_cost_perunit=cost.material_cost_perunit,
            manufacturing_cost_without_materialcost=cost.manufacturing_cost_without_materialcost,
            Total_material_cost=cost.Total_material_cost,
            manufacturing_cost_with_material_cost=cost.manufacturing_cost_with_material_cost,
            machine_cost_breakup=cost.machine_cost_breakup,
            created_at=cost.created_at.isoformat() if cost.created_at else None
        )
        result.append(cost_data)
    
    return result


@router.put("/Miling_materials/update-costtry/")
async def update_material_cost(
        data: UpdateMaterialCostInput,
        db: Session = Depends(get_db)
):
    # Find the material row
    material_record = db.query(models.Materials).filter(
        models.Materials.material == data.material,
        models.Materials.material_specification == data.material_specification,
        models.Materials.density == data.density
    ).first()

    if not material_record:
        raise HTTPException(status_code=404, detail="Material not found with given details")

    # Update the material cost
    material_record.material_cost = data.material_cost
    db.commit()
    db.refresh(material_record)

    return {
        "message": "Material cost updated successfully",
        "id": material_record.id,
        "material": material_record.material,
        "material_specification": material_record.material_specification,
        "density": material_record.density,
        "updated_material_cost": material_record.material_cost
    }


@router.delete("/Milling_materials/delete/")
async def delete_material(
        data: DeleteMaterialInput,
        db: Session = Depends(get_db)
):
    # Step 1: Find the material row
    material_record = db.query(models.Materials).filter(
        models.Materials.material == data.material,
        models.Materials.material_specification == data.material_specification,
        models.Materials.density == data.density,
        models.Materials.material_cost == data.material_cost
    ).first()

    if not material_record:
        raise HTTPException(status_code=404, detail="Material not found with given details")

    material_id = material_record.id

    # Step 2: Delete related MillingParameters
    deleted_params = db.query(models.MillingParameters).filter(
        models.MillingParameters.material_id == material_id
    ).delete(synchronize_session=False)

    # Step 3: Delete related MachineRates
    deleted_rates = db.query(models.MachineRates).filter(
        models.MachineRates.material_id == material_id
    ).delete(synchronize_session=False)

    # Step 4: Delete the material itself
    db.delete(material_record)

    # Commit all changes
    db.commit()

    return {
        "message": "Material and all linked rows deleted successfully",
        "material_id": material_id,
        "material": material_record.material,
        "parameters_deleted": deleted_params,
        "machine_rates_deleted": deleted_rates
    }


@router.get("/Milling_getmachine-rates/", response_model=List[dict])
async def get_all_machine_rates(db: Session = Depends(get_db)):
    # Fetch all rows
    rows = db.query(models.MachineRates).all()
    if not rows:
        raise HTTPException(status_code=404, detail="No machine rates found")

    result = []
    for row in rows:
        # Try to fetch related material name via relationship
        material_name = None
        if row.material_ref:
            material_name = getattr(row.material_ref, "material", None)
        else:
            # fallback to column if directly stored
            material_name = row.material

        result.append({
            "id": row.id,
            "machine_type": row.machine_type,
            "hourly_rate": row.hourly_rate,
            "size": row.size,
            "material_id": row.material_id,
            "material": material_name
        })

    return result


@router.put("/Milling_machine-rates/update/")
async def update_machine_rate(
        data: UpdateMachineRateInput,
        db: Session = Depends(get_db)
):
    # --- Find matching row by material, machine type, and old size ---
    machine_rate = db.query(models.MachineRates).filter(
        models.MachineRates.material == data.material,
        models.MachineRates.machine_type == data.machine_type,
        models.MachineRates.size == data.old_size
    ).first()

    if not machine_rate:
        raise HTTPException(status_code=404, detail="Machine rate not found for given details")

    # --- Validate new_size format (must be like 500*500*300) ---
    import re
    size_pattern = r'^\d+\*\d+\*\d+$'
    if not re.match(size_pattern, data.new_size.strip()):
        raise HTTPException(
            status_code=400,
            detail="Invalid size format. Size must be in format: '500*500*300' (numbers can vary but must be * separated)"
        )

    # --- Check if new_size already exists for the same material and machine_type ---
    existing_machine_rate = db.query(models.MachineRates).filter(
        models.MachineRates.material == data.material,
        models.MachineRates.machine_type == data.machine_type,
        models.MachineRates.size == data.new_size.strip(),
        models.MachineRates.id != machine_rate.id  # Exclude current record
    ).first()

    if existing_machine_rate:
        raise HTTPException(
            status_code=400, 
            detail=f"Size '{data.new_size}' already exists for material '{data.material}' and machine type '{data.machine_type}'"
        )

    # --- Update fields ---
    machine_rate.size = data.new_size.strip()
    machine_rate.hourly_rate = data.hourly_rate

    db.commit()
    db.refresh(machine_rate)

    return {
        "message": "Machine rate updated successfully",
        "updated_record": {
            "id": machine_rate.id,
            "material": machine_rate.material,
            "machine_type": machine_rate.machine_type,
            "size": machine_rate.size,
            "hourly_rate": machine_rate.hourly_rate
        }
    }


@router.post("/Milling_machine-rates/add/")
async def add_machine_rate(
        data: AddMachineRateInput,
        db: Session = Depends(get_db)
):
    # Step 1: Check if the material exists
    material = db.query(models.Materials).filter(
        models.Materials.id == data.material_id
    ).first()

    if not material:
        raise HTTPException(status_code=404, detail="Material details not available")

    # Step 2: Validate size format (must be like 500*500*300)
    import re
    size_pattern = r'^\d+\*\d+\*\d+$'
    if not re.match(size_pattern, data.size.strip()):
        raise HTTPException(
            status_code=400,
            detail="Invalid size format. Size must be in format: '500*500*300' (numbers can vary but must be * separated)"
        )

    # Step 3: Check if the combination already exists
    existing_rate = db.query(models.MachineRates).filter(
        models.MachineRates.material_id == data.material_id,
        models.MachineRates.machine_type == data.machine_type,
        models.MachineRates.size == data.size.strip()
    ).first()

    if existing_rate:
        raise HTTPException(
            status_code=400,
            detail="Machine rate already exists for this material and size"
        )

    # Step 4: Add new MachineRates row (store both material_id and material name)
    new_rate = models.MachineRates(
        material_id=data.material_id,
        material=material.material,  # ✅ store material name here
        machine_type=data.machine_type,
        size=data.size.strip(),
        hourly_rate=data.hourly_rate
    )

    db.add(new_rate)
    db.commit()
    db.refresh(new_rate)

    return {
        "message": "New machine rate added successfully",
        "id": new_rate.id,
        "material_id": new_rate.material_id,
        "material": new_rate.material,
        "machine_type": new_rate.machine_type,
        "size": new_rate.size,
        "hourly_rate": new_rate.hourly_rate
    }


@router.get("/milling-parameters/", response_model=List[dict])
async def get_all_milling_parameters(db: Session = Depends(get_db)):
    # Fetch all rows
    rows = db.query(models.MillingParameters).all()
    if not rows:
        raise HTTPException(status_code=404, detail="No milling parameters found")

    result = []
    for row in rows:
        # ✅ Priority 1: use local column
        material_name = row.material

        # ✅ Priority 2: if null, get from linked table
        if not material_name and row.material_obj:
            material_name = getattr(row.material_obj, "material", None)

        result.append({
            "id": row.id,
            "material_id": row.material_id,
            "material": material_name,
            "length_range": row.length_range,
            "roughing_feed_rate": row.roughing_feed_rate,
            "roughing_depth_of_cut": row.roughing_depth_of_cut,
            "roughing_radial_woc": row.roughing_radial_woc,
            "finishing_feed_rate": row.finishing_feed_rate,
            "finishing_depth_of_cut": row.finishing_depth_of_cut,
            "finishing_radial_woc": row.finishing_radial_woc
        })

    return result


@router.put("/milling-parameters/update/")
async def update_milling_parameters(
        data: UpdateMillingParametersInput,
        db: Session = Depends(get_db)
):
    """
    Update milling parameters based on material name and old length range.
    Uses local 'material' column if present, otherwise checks linked material table.
    """

    # Step 1: Find matching record
    param_row = (
        db.query(models.MillingParameters)
            .filter(
            or_(
                models.MillingParameters.material == data.material,
                and_(
                    models.MillingParameters.material == None,
                    models.MillingParameters.material_obj.has(material=data.material)
                )
            ),
            models.MillingParameters.length_range == data.old_length_range
        )
            .first()
    )

    if not param_row:
        raise HTTPException(status_code=404,
                            detail="Milling parameters not found for given material and old length range")

    # Step 2: Validate new_length_range format
    import re
    # Allowed patterns: 51-100, >101, <20 (numbers can vary)
    range_pattern = r'^(?:\d+-\d+|>\d+|<\d+)$'
    if not re.match(range_pattern, data.new_length_range.strip()):
        raise HTTPException(
            status_code=400,
            detail="Invalid new_length_range format. Allowed formats: '51-100', '>101', '<20' (numbers can vary)"
        )

    # Step 3: Check for overlapping or conflicting length_range for this material (excluding current record)
    existing_rows = db.query(models.MillingParameters).filter(
        models.MillingParameters.material == data.material,
        models.MillingParameters.id != param_row.id  # Exclude current record
    ).all()

    new_range = data.new_length_range.strip()
    
    for existing in existing_rows:
        existing_range = existing.length_range.strip()
        
        # Exact match check
        if new_range == existing_range:
            raise HTTPException(status_code=400, detail="Length range already exists for this material")
        
        # Overlap check for range formats (e.g., "30-60" vs "40-50")
        if '-' in new_range and '-' in existing_range:
            try:
                new_start, new_end = map(int, new_range.split('-'))
                existing_start, existing_end = map(int, existing_range.split('-'))
                
                # Check if ranges overlap
                if not (new_end < existing_start or new_start > existing_end):
                    raise HTTPException(
                        status_code=400, 
                        detail=f"Length range {new_range} overlaps with existing range {existing_range}"
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
                            detail=f"Length range {new_range} falls within existing range {existing_range}"
                        )
                elif new_range.startswith('<'):
                    new_val = int(new_range[1:])
                    if new_val >= existing_start and new_val <= existing_end:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Length range {new_range} falls within existing range {existing_range}"
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
                            detail=f"Length range {new_range} conflicts with existing range {existing_range}"
                        )
                elif new_range.startswith('>'):
                    new_val = int(new_range[1:])
                    if new_val >= existing_min:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Length range {new_range} is covered by existing range {existing_range}"
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
                            detail=f"Length range {new_range} conflicts with existing range {existing_range}"
                        )
                elif new_range.startswith('<'):
                    new_val = int(new_range[1:])
                    if new_val <= existing_max:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Length range {new_range} is covered by existing range {existing_range}"
                        )
            except ValueError:
                continue

    # Step 4: Update all editable fields (including range)
    param_row.length_range = data.new_length_range.strip()
    param_row.roughing_feed_rate = data.roughing_feed_rate
    param_row.roughing_depth_of_cut = data.roughing_depth_of_cut
    param_row.roughing_radial_woc = data.roughing_radial_woc
    param_row.finishing_feed_rate = data.finishing_feed_rate
    param_row.finishing_depth_of_cut = data.finishing_depth_of_cut
    param_row.finishing_radial_woc = data.finishing_radial_woc

    # Step 5: Commit & return
    db.commit()
    db.refresh(param_row)

    return {
        "message": "Milling parameters updated successfully",
        "id": param_row.id,
        "material": data.material,
        "old_length_range": data.old_length_range,
        "new_length_range": param_row.length_range,
        "roughing_feed_rate": param_row.roughing_feed_rate,
        "roughing_depth_of_cut": param_row.roughing_depth_of_cut,
        "roughing_radial_woc": param_row.roughing_radial_woc,
        "finishing_feed_rate": param_row.finishing_feed_rate,
        "finishing_depth_of_cut": param_row.finishing_depth_of_cut,
        "finishing_radial_woc": param_row.finishing_radial_woc
    }


@router.post("/milling-parameters/add/")
async def add_milling_parameters(
        data: AddMillingParametersInput,
        db: Session = Depends(get_db)
):
    # Step 1: Check if material exists
    material = db.query(models.Materials).filter(models.Materials.id == data.material_id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")

    # Step 2: Validate length_range format
    import re
    # Allowed patterns: 51-100, >101, <20 (numbers can vary)
    range_pattern = r'^(?:\d+-\d+|>\d+|<\d+)$'
    if not re.match(range_pattern, data.length_range.strip()):
        raise HTTPException(
            status_code=400,
            detail="Invalid length_range format. Allowed formats: '51-100', '>101', '<20' (numbers can vary)"
        )

    # Step 3: Check for overlapping or duplicate length_range for this material
    existing_rows = db.query(models.MillingParameters).filter(
        models.MillingParameters.material_id == data.material_id
    ).all()

    new_range = data.length_range.strip()
    
    for existing in existing_rows:
        existing_range = existing.length_range.strip()
        
        # Exact match check
        if new_range == existing_range:
            raise HTTPException(status_code=400, detail="Length range already exists for this material")
        
        # Overlap check for range formats (e.g., "30-60" vs "40-50")
        if '-' in new_range and '-' in existing_range:
            try:
                new_start, new_end = map(int, new_range.split('-'))
                existing_start, existing_end = map(int, existing_range.split('-'))
                
                # Check if ranges overlap
                if not (new_end < existing_start or new_start > existing_end):
                    raise HTTPException(
                        status_code=400, 
                        detail=f"Length range {new_range} overlaps with existing range {existing_range}"
                    )
            except ValueError:
                # If parsing fails, skip overlap check for this pair
                continue
        
        # Check if new range falls within an existing range
        if '-' in existing_range:
            try:
                existing_start, existing_end = map(int, existing_range.split('-'))
                
                # Check if new single value range falls within existing range
                if new_range.startswith('>'):
                    new_val = int(new_range[1:])
                    if new_val >= existing_start and new_val <= existing_end:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Length range {new_range} falls within existing range {existing_range}"
                        )
                elif new_range.startswith('<'):
                    new_val = int(new_range[1:])
                    if new_val >= existing_start and new_val <= existing_end:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Length range {new_range} falls within existing range {existing_range}"
                        )
            except ValueError:
                continue
        
        # Check if new range conflicts with existing >value or <value ranges
        if existing_range.startswith('>'):
            try:
                existing_min = int(existing_range[1:])
                
                if '-' in new_range:
                    # Check if new range starts after existing >value
                    new_start, new_end = map(int, new_range.split('-'))
                    if new_start > existing_min:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Length range {new_range} conflicts with existing range {existing_range}"
                        )
                elif new_range.startswith('>'):
                    # Check if new >value is redundant with existing >value
                    new_val = int(new_range[1:])
                    if new_val >= existing_min:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Length range {new_range} is covered by existing range {existing_range}"
                        )
            except ValueError:
                continue
                
        elif existing_range.startswith('<'):
            try:
                existing_max = int(existing_range[1:])
                
                if '-' in new_range:
                    # Check if new range ends before existing <value
                    new_start, new_end = map(int, new_range.split('-'))
                    if new_end < existing_max:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Length range {new_range} conflicts with existing range {existing_range}"
                        )
                elif new_range.startswith('<'):
                    # Check if new <value is redundant with existing <value
                    new_val = int(new_range[1:])
                    if new_val <= existing_max:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Length range {new_range} is covered by existing range {existing_range}"
                        )
            except ValueError:
                continue

    # Step 4: Add new row and store material name from material table
    new_param = models.MillingParameters(
        material_id=data.material_id,
        material=material.material,  # ✅ store material name here
        length_range=data.length_range.strip(),
        roughing_feed_rate=data.roughing_feed_rate,
        roughing_depth_of_cut=data.roughing_depth_of_cut,
        roughing_radial_woc=data.roughing_radial_woc,
        finishing_feed_rate=data.finishing_feed_rate,
        finishing_depth_of_cut=data.finishing_depth_of_cut,
        finishing_radial_woc=data.finishing_radial_woc
    )

    db.add(new_param)
    db.commit()
    db.refresh(new_param)

    return {
        "message": "New milling parameters added successfully",
        "id": new_param.id,
        "material_id": new_param.material_id,
        "material": new_param.material,  # ✅ return material name
        "length_range": new_param.length_range,
        "roughing_feed_rate": new_param.roughing_feed_rate,
        "roughing_depth_of_cut": new_param.roughing_depth_of_cut,
        "roughing_radial_woc": new_param.roughing_radial_woc,
        "finishing_feed_rate": new_param.finishing_feed_rate,
        "finishing_depth_of_cut": new_param.finishing_depth_of_cut,
        "finishing_radial_woc": new_param.finishing_radial_woc
    }


@router.get("/milling-percentages/", response_model=List[dict])
async def get_milling_percentages(db: Session = Depends(get_db)):
    rows = db.query(models.MillingPercentages).all()
    if not rows:
        raise HTTPException(status_code=404, detail="No milling percentages found")

    result = []
    for row in rows:
        result.append({
            "id": row.id,
            "roughing_percentage": row.roughing_percentage,
            "finishing_percentage": row.finishing_percentage
        })
    return result


@router.put("/milling-percentages/update/")
async def update_milling_percentages(
        data: UpdateMillingPercentagesInput,
        db: Session = Depends(get_db)
):
    # Validate total percentage
    total = data.roughing_percentage + data.finishing_percentage
    if total > 100:
        raise HTTPException(status_code=400, detail="Sum of roughing and finishing percentages cannot exceed 100")

    # Usually only one row exists, fetch it
    row = db.query(models.MillingPercentages).first()
    if not row:
        raise HTTPException(status_code=404, detail="Milling percentages not found")

    # Update values
    row.roughing_percentage = data.roughing_percentage
    row.finishing_percentage = data.finishing_percentage

    db.commit()
    db.refresh(row)

    return {
        "message": "Milling percentages updated successfully",
        "id": row.id,
        "roughing_percentage": row.roughing_percentage,
        "finishing_percentage": row.finishing_percentage
    }


# @router.get("/milling-manufacturing-percentage/")
# async def get_manufacturing_percentage(db: Session = Depends(get_db)):
#     row = db.query(models.MillingManufacturingPercentage).first()
#     if not row:
#         raise HTTPException(status_code=404, detail="Manufacturing percentage not found")
#
#     return {
#         "id": row.id,
#         "percentage_of_manufacturing_time": row.percentage_of_manufacturing_time
#     }

@router.get("/milling-manufacturing-percentage/")
async def get_manufacturing_percentage(db: Session = Depends(get_db)):
    rows = db.query(models.MillingManufacturingPercentage).all()

    if not rows:
        raise HTTPException(status_code=404, detail="No manufacturing percentage records found")

    return [
        {
            "id": row.id,
            "percentage_of_manufacturing_time": row.percentage_of_manufacturing_time,
            "correction_factor": row.Correction_factor
        }
        for row in rows
    ]

#
# @router.put("/milling-manufacturing-percentage/update/")
# async def update_manufacturing_percentage(
#         data: UpdateManufacturingPercentageInput,
#         db: Session = Depends(get_db)
# ):
#     row = db.query(models.MillingManufacturingPercentage).first()
#     if not row:
#         raise HTTPException(status_code=404, detail="Manufacturing percentage not found")
#
#     row.percentage_of_manufacturing_time = data.percentage_of_manufacturing_time
#     db.commit()
#     db.refresh(row)
#
#     return {
#         "message": "Manufacturing percentage updated successfully",
#         "id": row.id,
#         "percentage_of_manufacturing_time": row.percentage_of_manufacturing_time
#     }
#





@router.put("/milling-manufacturing-percentage/update/")
async def update_manufacturing_percentage(
        percentage_of_manufacturing_time: float = Form(...),
        Correction_factor: float = Form(...),
        db: Session = Depends(get_db)
):
    # Validate percentage range
    if percentage_of_manufacturing_time <= 0:
        raise HTTPException(status_code=400, detail="Percentage must be greater than 0")
    if percentage_of_manufacturing_time > 100:
        raise HTTPException(status_code=400, detail="Percentage must be less than or equal to 100")

    row = db.query(models.MillingManufacturingPercentage).first()
    if not row:
        raise HTTPException(status_code=404, detail="Manufacturing percentage not found")

    row.percentage_of_manufacturing_time = percentage_of_manufacturing_time
    row.Correction_factor = Correction_factor

    db.commit()
    db.refresh(row)

    return {
        "message": "Manufacturing percentage updated successfully",
        "id": row.id,
        "percentage_of_manufacturing_time": row.percentage_of_manufacturing_time,
        "Correction_factor": row.Correction_factor
    }


@router.get("/milling/history-costs/")
def get_milling_history_with_costs(db: Session = Depends(get_db)):
    # Fetch all history rows
    histories = db.query(models.MillingHistoryDetails).all()

    if not histories:
        raise HTTPException(status_code=404, detail="No milling history records found")

    result = []
    for history in histories:
        # Fetch related milling cost (can be multiple rows, but usually one per history)
        costs = db.query(models.MillingCost).filter(
            models.MillingCost.milling_history_id == history.id
        ).all()

        # Convert costs into list of dicts
        cost_data = [
            {
                "id": cost.id,
                "material_id": cost.material_id,
                "stock_weight_kg": cost.stock_weight_kg,
                "actual_weight": cost.actual_weight,
                "material_removed_mm3": cost.material_removed_mm3,
                "roughing_mrr": cost.roughing_mrr,
                "finishing_mrr": cost.finishing_mrr,
                "roughing_time_min": cost.roughing_time_min,
                "finishing_time_min": cost.finishing_time_min,
                "total_machining_time_hr": cost.total_machining_time_hr,
                "manufacturing_time_hr": cost.manufacturing_time_hr,
                "manufacturing_cost_perunit": cost.manufacturing_cost_perunit,
                "material_cost_perunit": cost.material_cost_perunit,
                "manufacturing_cost_without_materialcost": cost.manufacturing_cost_without_materialcost,
                "manufacturing_cost_with_material_cost": cost.manufacturing_cost_with_material_cost,
                "machine_cost_breakup": cost.machine_cost_breakup,
                "created_at": cost.created_at
            }
            for cost in costs
        ]

        # Merge history + cost
        result.append({
            "history": {
                "id": history.id,
                "filename": history.filename,
                "material_id": history.material_id,
                "material_name": history.material_name,
                "density": history.density,
                "quantity": history.quantity,
                "actual_length": history.actual_length,
                "actual_breadth": history.actual_breadth,
                "actual_height": history.actual_height,
                "actual_volume_mm3": history.actual_volume_mm3,
                "actual_volume_m3": history.actual_volume_m3,
                "stock_length": history.stock_length,
                "stock_breadth": history.stock_breadth,
                "stock_height": history.stock_height,
                "stock_volume_mm3": history.stock_volume_mm3,
                "stock_volume_m3": history.stock_volume_m3,
                "delta_x": history.delta_x,
                "delta_y": history.delta_y,
                "delta_z": history.delta_z,
                "created_at": history.created_at
            },
            "costs": cost_data
        })

    return result


@router.put("/milling/update-quantity/{history_id}")
def update_milling_cost_by_history(history_id: int, quantity: int, db: Session = Depends(get_db)):
    # --- Fetch cost record by history_id ---
    cost_record = db.query(models.MillingCost).filter(
        models.MillingCost.milling_history_id == history_id
    ).first()

    if not cost_record:
        raise HTTPException(status_code=404, detail="Milling cost record not found for given history_id")

    # --- Fetch per unit costs ---
    manufacturing_cost_perunit = cost_record.manufacturing_cost_perunit
    material_cost_perunit = cost_record.material_cost_perunit
    total_cost_per_unit_with_materials = manufacturing_cost_perunit + material_cost_perunit

    if manufacturing_cost_perunit is None or material_cost_perunit is None:
        raise HTTPException(status_code=400, detail="Cost record missing per unit values")

    # --- Update calculations ---
    manufacturing_cost_without_materialcost = manufacturing_cost_perunit * quantity
    total_material_cost = material_cost_perunit * quantity
    manufacturing_cost_with_material_cost = (manufacturing_cost_perunit + material_cost_perunit) * quantity

    # --- Update MillingCost record ---
    cost_record.quantity = quantity
    cost_record.manufacturing_cost_without_materialcost = manufacturing_cost_without_materialcost
    cost_record.manufacturing_cost_with_material_cost = manufacturing_cost_with_material_cost
    cost_record.Total_material_cost = total_material_cost

    # --- Update MillingHistoryDetails quantity as well ---
    history_record = db.query(models.MillingHistoryDetails).filter(
        models.MillingHistoryDetails.id == history_id
    ).first()

    if history_record:
        history_record.quantity = quantity

    db.commit()
    db.refresh(cost_record)
    if history_record:
        db.refresh(history_record)

    return {
        "message": "Milling cost and history quantity updated successfully",
        "milling_history_id": cost_record.milling_history_id,
        "quantity": quantity,
        "manufacturing_cost_perunit": manufacturing_cost_perunit,
        "material_cost_perunit": material_cost_perunit,
        "manufacturing_cost_without_materialcost": manufacturing_cost_without_materialcost,
        "manufacturing_cost_with_material_cost": manufacturing_cost_with_material_cost,
        "total_material_cost": total_material_cost,
        "total_cost_per_unit_with_materials": total_cost_per_unit_with_materials
    }


# check length breadth height below code

@router.put("/Milling_update-stock_cost/")
async def update_material_cost(
        history_id: int = Form(...),
        stock_length: float = Form(...),
        stock_breadth: float = Form(...),
        stock_height: float = Form(...),
        db: Session = Depends(get_db)
):
    # --- Fetch history record ---
    record = db.query(models.MillingHistoryDetails).filter(
        models.MillingHistoryDetails.id == history_id
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Milling history record not found")

    # --- Update stock dimensions ---
    record.stock_length = stock_length
    record.stock_breadth = stock_breadth
    record.stock_height = stock_height
    record.stock_volume_mm3 = stock_length * stock_breadth * stock_height
    record.stock_volume_m3 = record.stock_volume_mm3 / 1e9
    db.commit()
    db.refresh(record)

    # --- Fetch material details ---
    material = db.query(models.Materials).filter(models.Materials.id == record.material_id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")

    density = material.density
    quantity = record.quantity

    # --- Material cost recalculation ---
    stock_mass = record.stock_volume_m3 * density
    actual_weight = record.actual_volume_m3 * density
    material_cost_per_unit = stock_mass * material.material_cost
    material_removed = record.stock_volume_mm3 - record.actual_volume_mm3
    print(material.density)

    # --- Milling Parameters ---
    params_list = db.query(models.MillingParameters).filter(
        models.MillingParameters.material_id == material.id
    ).all()
    if not params_list:
        raise HTTPException(status_code=404, detail="No milling parameters found for this material")

    def length_in_range(length_range: str, length: float) -> bool:
        length_range = length_range.strip()
        if '-' in length_range:
            start, end = map(float, length_range.split('-'))
            return start <= length <= end
        elif length_range.startswith('>'):
            return length > float(length_range[1:])
        elif length_range.startswith('<'):
            return length < float(length_range[1:])
        else:
            return False

    matched_param = None
    for param in params_list:
        if length_in_range(param.length_range, stock_length):
            matched_param = param
            break
    if not matched_param:
        raise HTTPException(status_code=404, detail="No matching milling parameters for stock length")

    roughing_mrr = (
            matched_param.roughing_feed_rate *
            matched_param.roughing_depth_of_cut *
            matched_param.roughing_radial_woc
    )
    finishing_mrr = (
            matched_param.finishing_feed_rate *
            matched_param.finishing_depth_of_cut *
            matched_param.finishing_radial_woc
    )

    milling_percentage = db.query(models.MillingPercentages).first()
    if not milling_percentage:
        raise HTTPException(status_code=404, detail="Milling percentages not defined")

    roughing_time = (material_removed * (milling_percentage.roughing_percentage / 100)) / roughing_mrr
    finishing_time = (material_removed * (milling_percentage.finishing_percentage / 100)) / finishing_mrr

    total_machining_time_min = roughing_time + finishing_time
    total_machining_time_hr = total_machining_time_min / 60

    manufacturing_percentage = db.query(models.MillingManufacturingPercentage).first()
    if not manufacturing_percentage:
        raise HTTPException(status_code=404, detail="Manufacturing percentage not defined")

    manufacturing_time_hr = total_machining_time_hr * (100 / manufacturing_percentage.percentage_of_manufacturing_time)

    # --- Fetch existing MillingCost row ---
    existing_cost_record = db.query(models.MillingCost).filter(
        models.MillingCost.milling_history_id == history_id
    ).first()
    if not existing_cost_record:
        raise HTTPException(status_code=404, detail="Cost record not found for this history_id")

    # --- Reuse machine distribution from stored machine_cost_breakup ---
    machine_distribution = existing_cost_record.machine_cost_breakup or {}
    machining_cost = 0
    machine_cost_breakup = {}

    def parse_dimensions(size_str: str):
        """Extract L, B, H as floats from 'L*B*H' or 'LxBxH' format."""
        try:
            parts = size_str.lower().replace('x', '*').split('*')
            if len(parts) != 3:
                raise ValueError
            L, B, H = map(float, parts)
            return L, B, H
        except Exception:
            raise HTTPException(status_code=400, detail=f"Invalid size format in MachineRates: {size_str}")

    # --- Updated logic: check L, B, H instead of only length ---
    for machine_type, old_data in machine_distribution.items():
        if not isinstance(old_data, dict) or "input_percentage" not in old_data:
            continue

        input_percentage = old_data["input_percentage"]

        # Find machine rate rows for this machine type
        rows = db.query(models.MachineRates).filter(
            models.MachineRates.material_id == material.id,
            models.MachineRates.machine_type == machine_type
        ).all()
        if not rows:
            continue

        possible_rates = []
        for row in rows:
            try:
                machine_L, machine_B, machine_H = parse_dimensions(row.size)
            except HTTPException as e:
                raise e

            # ✅ Compare all 3 dimensions
            if (
                    stock_length <= machine_L and
                    stock_breadth <= machine_B and
                    stock_height <= machine_H
            ):
                possible_rates.append(((machine_L, machine_B, machine_H), row))

        if not possible_rates:
            continue

        # ✅ Pick smallest suitable machine (based on total volume)
        possible_rates.sort(key=lambda x: x[0][0] * x[0][1] * x[0][2])
        matched_rate = possible_rates[0][1]

        cost = manufacturing_time_hr * matched_rate.hourly_rate * (input_percentage / 100)
        machining_cost += cost
        machining_cost = machining_cost * manufacturing_percentage.Correction_factor


        machine_cost_breakup[machine_type] = {
            "input_percentage": input_percentage,
            "matched_machine_size": matched_rate.size,
            "calculated_cost": round(cost, 2)
        }

    # --- Cost updates ---
    manufacturing_cost_per_unit = machining_cost
    manufacturing_cost_without_material = manufacturing_cost_per_unit * quantity
    manufacturing_cost_with_material = (manufacturing_cost_per_unit + material_cost_per_unit) * quantity
    total_material_cost = material_cost_per_unit * quantity
    total_cost_per_unit_with_materials = manufacturing_cost_per_unit + material_cost_per_unit

    # --- Update MillingCost row ---
    existing_cost_record.stock_weight_kg = round(stock_mass, 4)
    existing_cost_record.actual_weight = actual_weight
    existing_cost_record.material_removed_mm3 = round(material_removed, 2)
    existing_cost_record.roughing_mrr = round(roughing_mrr, 2)
    existing_cost_record.finishing_mrr = round(finishing_mrr, 2)
    existing_cost_record.roughing_time_min = round(roughing_time, 2)
    existing_cost_record.finishing_time_min = round(finishing_time, 2)
    existing_cost_record.total_machining_time_hr = round(total_machining_time_hr, 2)
    existing_cost_record.manufacturing_time_hr = manufacturing_time_hr
    existing_cost_record.manufacturing_cost_perunit = round(machining_cost, 2)
    existing_cost_record.material_cost_perunit = round(material_cost_per_unit, 2)
    existing_cost_record.manufacturing_cost_without_materialcost = manufacturing_cost_without_material
    existing_cost_record.manufacturing_cost_with_material_cost = manufacturing_cost_with_material
    existing_cost_record.machine_cost_breakup = machine_cost_breakup
    existing_cost_record.quantity = record.quantity
    existing_cost_record.Total_material_cost = total_material_cost

    db.commit()
    db.refresh(existing_cost_record)

    return {
        "message": "Material cost updated successfully",
        "milling_history_id": history_id,
        "updated_cost_id": existing_cost_record.id,
        "new_stock_dimensions": {
            "length": stock_length,
            "breadth": stock_breadth,
            "height": stock_height
        },
        "stock_volume_mm3": record.stock_volume_mm3,
        "stock_weight_kg": round(stock_mass, 4),
        "actual_weight": actual_weight,
        "material_removed_mm3": round(material_removed, 2),
        "roughing_mrr": round(roughing_mrr, 2),
        "finishing_mrr": round(finishing_mrr, 2),
        "roughing_time_min": round(roughing_time, 2),
        "finishing_time_min": round(finishing_time, 2),
        "total_machining_time_hr": round(total_machining_time_hr, 2),
        "manufacturing_time_hr": manufacturing_time_hr,
        "manufacturing_cost_perunit": round(machining_cost, 2),
        "material_cost_perunit": round(material_cost_per_unit, 2),
        "Manufacturing_cost_without_materialcost": manufacturing_cost_without_material,
        "Manufacturing_cost_with_material_cost": manufacturing_cost_with_material,
        "machine_cost_breakup": machine_cost_breakup,
        "Total_material_cost": total_material_cost,
        "total_cost_per_unit_with_materials": total_cost_per_unit_with_materials
    }


@router.get("/milling/download-draco-glb/{history_id}")
def download_milling_draco_glb(history_id: int, db: Session = Depends(get_db)):
    """
    Download the Draco-compressed GLB file stored in Milling_Costs table for a given history_id.
    """

    # Fetch only the draco_glb_file column from Milling_Costs table
    draco_glb_data = db.query(models.MillingCost.draco_glb_file).filter(
        models.MillingCost.milling_history_id == history_id
    ).scalar()

    if not draco_glb_data:
        raise HTTPException(
            status_code=404,
            detail="No Draco GLB data stored for this milling record."
        )

    # Create a binary stream for download
    draco_glb_stream = io.BytesIO(draco_glb_data)

    return StreamingResponse(
        draco_glb_stream,
        media_type="model/gltf-binary",
        headers={
            "Content-Disposition": f"attachment; filename=milling_draco_{history_id}.glb"
        }
    )


@router.post("/Milling_update-size-cost-try/")
async def update_material_cost(
        data: MillingMachineDistributionInput,
        db: Session = Depends(get_db)
):
    history_id = data.history_id
    machine_distribution = data.machine_distribution

    # --- Fetch milling history record ---
    record = db.query(models.MillingHistoryDetails).filter(
        models.MillingHistoryDetails.id == history_id
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Milling history record not found")

    # --- Fetch material details ---
    material = db.query(models.Materials).filter(models.Materials.id == record.material_id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")

    # --- Material Cost ---
    stock_mass = record.stock_volume_m3 * material.density
    Actual_weight = record.actual_volume_m3 * material.density
    material_cost_per_unit = stock_mass * material.material_cost
    quantity = record.quantity

    # --- Material Removed ---
    if record.stock_volume_mm3 is None or record.actual_volume_mm3 is None:
        raise HTTPException(status_code=400, detail="Stock or actual volume not defined")

    material_removed = record.stock_volume_mm3 - record.actual_volume_mm3

    # --- Milling Parameters (MRR) ---
    stock_length = record.stock_length
    params_list = db.query(models.MillingParameters).filter(
        models.MillingParameters.material_id == material.id
    ).all()

    if not params_list:
        raise HTTPException(status_code=404, detail="No milling parameters found for this material")

    def length_in_range(length_range: str, length: float) -> bool:
        length_range = length_range.strip()
        if '-' in length_range:
            start, end = map(float, length_range.split('-'))
            return start <= length <= end
        elif length_range.startswith('>'):
            return length > float(length_range[1:])
        elif length_range.startswith('<'):
            return length < float(length_range[1:])
        else:
            return False

    matched_param = None
    for param in params_list:
        if length_in_range(param.length_range, stock_length):
            matched_param = param
            break

    if not matched_param:
        raise HTTPException(status_code=404, detail="No matching milling parameters for stock length")

    roughing_mrr = (
            matched_param.roughing_feed_rate *
            matched_param.roughing_depth_of_cut *
            matched_param.roughing_radial_woc
    )
    finishing_mrr = (
            matched_param.finishing_feed_rate *
            matched_param.finishing_depth_of_cut *
            matched_param.finishing_radial_woc
    )

    # --- Roughing & Finishing Machine Time ---
    milling_percentage = db.query(models.MillingPercentages).first()
    if not milling_percentage:
        raise HTTPException(status_code=404, detail="Milling percentages not defined")

    roughing_time = (
            (material_removed * (milling_percentage.roughing_percentage / 100)) / roughing_mrr
    )
    finishing_time = (
            (material_removed * (milling_percentage.finishing_percentage / 100)) / finishing_mrr
    )

    total_machining_time_min = roughing_time + finishing_time
    total_machining_time_hr = total_machining_time_min / 60

    # --- Manufacturing Time ---
    manufacturing_percentage = db.query(models.MillingManufacturingPercentage).first()
    if not manufacturing_percentage:
        raise HTTPException(status_code=404, detail="Manufacturing percentage not defined")

    manufacturing_time_hr = (
            total_machining_time_hr * (100 / manufacturing_percentage.percentage_of_manufacturing_time)
    )

    # --- Calculate Cost for Each Machine (based on its own size & percentage) ---
    machining_cost = 0
    machine_cost_breakup = {}

    for machine_type, details in machine_distribution.items():
        size = details.get("size")
        percentage = details.get("percentage")

        if not size or percentage is None:
            raise HTTPException(status_code=400, detail=f"Missing size or percentage for {machine_type}")

        row = db.query(models.MachineRates).filter(
            models.MachineRates.material_id == material.id,
            models.MachineRates.machine_type == machine_type,
            models.MachineRates.size == size
        ).first()

        if not row:
            raise HTTPException(
                status_code=404,
                detail=f"No machine rate found for {machine_type} with size {size}"
            )

        cost = manufacturing_time_hr * row.hourly_rate * (percentage / 100)
        machining_cost += cost
        machining_cost = machining_cost * manufacturing_percentage.Correction_factor

        machine_cost_breakup[machine_type] = {
            "size": size,
            "input_percentage": percentage,
            "hourly_rate": row.hourly_rate,
            "calculated_cost": round(cost, 2)
        }

    machining_cost_per_unit = machining_cost
    Manufacturing_cost_without_materialcost = machining_cost_per_unit * quantity
    manufacuring_cost_with_material_cost = (machining_cost_per_unit + material_cost_per_unit) * quantity
    Total_material_cost = material_cost_per_unit * quantity
    total_cost_per_unit_with_materials = machining_cost_per_unit + material_cost_per_unit

    # --- Check if record already exists ---
    existing_record = db.query(models.MillingCost).filter(
        models.MillingCost.milling_history_id == record.id
    ).first()

    if existing_record:
        # --- Update existing record ---
        existing_record.stock_weight_kg = round(stock_mass, 4)
        existing_record.filename = record.filename
        existing_record.actual_weight = Actual_weight
        existing_record.material_removed_mm3 = round(material_removed, 2)
        existing_record.roughing_mrr = round(roughing_mrr, 2)
        existing_record.finishing_mrr = round(finishing_mrr, 2)
        existing_record.roughing_time_min = round(roughing_time, 2)
        existing_record.finishing_time_min = round(finishing_time, 2)
        existing_record.total_machining_time_hr = round(total_machining_time_hr, 2)
        existing_record.manufacturing_time_hr = manufacturing_time_hr
        existing_record.manufacturing_cost_perunit = round(machining_cost, 2)
        existing_record.material_cost_perunit = round(material_cost_per_unit, 2)
        existing_record.manufacturing_cost_without_materialcost = Manufacturing_cost_without_materialcost
        existing_record.manufacturing_cost_with_material_cost = manufacuring_cost_with_material_cost
        existing_record.machine_cost_breakup = machine_cost_breakup
        existing_record.quantity = record.quantity
        existing_record.Total_material_cost = Total_material_cost
        db.commit()
        db.refresh(existing_record)
        updated_record_id = existing_record.id
        msg = "Material cost updated successfully (existing record)"
    else:
        # --- Insert new record ---
        new_cost_record = models.MillingCost(
            milling_history_id=record.id,
            material_id=record.material_id,
            stock_weight_kg=round(stock_mass, 4),
            filename=record.filename,
            actual_weight=Actual_weight,
            material_removed_mm3=round(material_removed, 2),
            roughing_mrr=round(roughing_mrr, 2),
            finishing_mrr=round(finishing_mrr, 2),
            roughing_time_min=round(roughing_time, 2),
            finishing_time_min=round(finishing_time, 2),
            total_machining_time_hr=round(total_machining_time_hr, 2),
            manufacturing_time_hr=manufacturing_time_hr,
            manufacturing_cost_perunit=round(machining_cost, 2),
            material_cost_perunit=round(material_cost_per_unit, 2),
            manufacturing_cost_without_materialcost=Manufacturing_cost_without_materialcost,
            manufacturing_cost_with_material_cost=manufacuring_cost_with_material_cost,
            machine_cost_breakup=machine_cost_breakup,
            quantity=record.quantity,
            Total_material_cost=Total_material_cost
        )
        db.add(new_cost_record)
        db.commit()
        db.refresh(new_cost_record)
        updated_record_id = new_cost_record.id
        msg = "Material cost inserted successfully (new record)"

    # --- Final Response ---
    return {
        "message": msg,
        "stored_id": updated_record_id,
        "history_id": record.id,
        "material_id": record.material_id,
        "material_name": material.material,
        "stock_weight_kg": round(stock_mass, 4),
        "actual_weight": round(Actual_weight, 4),
        "material_removed_mm3": round(material_removed, 2),
        "roughing_mrr": round(roughing_mrr, 2),
        "finishing_mrr": round(finishing_mrr, 2),
        "roughing_time_min": round(roughing_time, 2),
        "finishing_time_min": round(finishing_time, 2),
        "total_machining_time_hr": round(total_machining_time_hr, 2),
        "manufacturing_time_hr": round(manufacturing_time_hr, 2),
        "material_cost_perunit": round(material_cost_per_unit, 2),
        "manufacturing_cost_perunit": round(machining_cost, 2),
        "manufacturing_cost_without_materialcost": round(Manufacturing_cost_without_materialcost, 2),
        "manufacturing_cost_with_material_cost": round(manufacuring_cost_with_material_cost, 2),
        "Total_material_cost": round(Total_material_cost, 2),
        "machine_cost_breakup": machine_cost_breakup,
        "quantity": record.quantity,
        "filename": record.filename,
        "milling_percentage_used": {
            "roughing_percentage": milling_percentage.roughing_percentage,
            "finishing_percentage": milling_percentage.finishing_percentage
        },
        "manufacturing_percentage_used": manufacturing_percentage.percentage_of_manufacturing_time,
        "total_cost_per_unit_with_materials": total_cost_per_unit_with_materials,
        "matched_parameter": {
            "length_range": matched_param.length_range,
            "roughing_feed_rate": matched_param.roughing_feed_rate,
            "roughing_depth_of_cut": matched_param.roughing_depth_of_cut,
            "roughing_radial_woc": matched_param.roughing_radial_woc,
            "finishing_feed_rate": matched_param.finishing_feed_rate,
            "finishing_depth_of_cut": matched_param.finishing_depth_of_cut,
            "finishing_radial_woc": matched_param.finishing_radial_woc

        }
    }


@router.post("/Milling_materials/add/")
async def add_material(
        data: MaterialInput,
        db: Session = Depends(get_db)
):
    # --- Step 0: Check for exact duplicate material ---
    existing_material = db.query(models.Materials).filter(
        models.Materials.material == data.material,
        models.Materials.material_specification == data.material_specification,
        models.Materials.density == data.density,
        models.Materials.material_cost == data.material_cost
    ).first()

    if existing_material:
        raise HTTPException(status_code=400, detail="Material already present")

    # --- Step 1: Create Material ---
    new_material = models.Materials(
        material=data.material,
        material_specification=data.material_specification,
        density=data.density,
        material_cost=data.material_cost,
    )
    db.add(new_material)
    db.commit()
    db.refresh(new_material)

    # --- Step 2: Create Milling Parameters ---
    for param in data.parameters:
        new_param = models.MillingParameters(
            material_id=new_material.id,
            material=new_material.material,  # store material name
            length_range=param.length_range,
            roughing_feed_rate=param.roughing_feed_rate,
            roughing_depth_of_cut=param.roughing_depth_of_cut,
            roughing_radial_woc=param.roughing_radial_woc,
            finishing_feed_rate=param.finishing_feed_rate,
            finishing_depth_of_cut=param.finishing_depth_of_cut,
            finishing_radial_woc=param.finishing_radial_woc,
        )
        db.add(new_param)

    # --- Step 3: Create Machine Rates ---
    for rate in data.machine_rates:
        new_rate = models.MachineRates(
            material_id=new_material.id,
            material=new_material.material,  # store material name
            machine_type=rate.machine_type,
            hourly_rate=rate.hourly_rate,
            size=rate.size
        )
        db.add(new_rate)

    # --- Step 4: Commit all rows ---
    db.commit()

    return {
        "message": "Material, parameters, and machine rates added successfully",
        "material_id": new_material.id,
        "material": new_material.material,
        "parameters_added": len(data.parameters),
        "machine_rates_added": len(data.machine_rates)
    }


@router.get("/milling-history-cost/{milling_history_id}", response_model=MillingHistoryCostResponse)
async def get_milling_history_cost_by_id(milling_history_id: int, db: Session = Depends(get_db)):
    """
    Fetch combined data from MillingHistoryDetails and MillingCost tables by milling_history_id
    """
    # Fetch data from MillingHistoryDetails
    history_details = db.query(models.MillingHistoryDetails).filter(
        models.MillingHistoryDetails.id == milling_history_id
    ).first()
    
    if not history_details:
        raise HTTPException(status_code=404, detail="Milling history details not found")
    
    # Fetch data from MillingCost
    cost_details = db.query(models.MillingCost).filter(
        models.MillingCost.milling_history_id == milling_history_id
    ).first()
    
    # Combine the data
    combined_data = MillingHistoryCostResponse(
        # MillingHistoryDetails fields
        history_id=history_details.id,
        filename=history_details.filename,
        material_id=history_details.material_id,
        material_name=history_details.material_name,
        density=history_details.density,
        quantity=history_details.quantity,
        actual_length=history_details.actual_length,
        actual_breadth=history_details.actual_breadth,
        actual_height=history_details.actual_height,
        actual_volume_mm3=history_details.actual_volume_mm3,
        actual_volume_m3=history_details.actual_volume_m3,
        stock_length=history_details.stock_length,
        stock_breadth=history_details.stock_breadth,
        stock_height=history_details.stock_height,
        stock_volume_mm3=history_details.stock_volume_mm3,
        stock_volume_m3=history_details.stock_volume_m3,
        delta_x=history_details.delta_x,
        delta_y=history_details.delta_y,
        delta_z=history_details.delta_z,
        history_created_at=history_details.created_at.isoformat() if history_details.created_at else None,
        
        # MillingCost fields (will be None if no cost data exists)
        cost_id=cost_details.id if cost_details else None,
        milling_history_id=cost_details.milling_history_id if cost_details else None,
        cost_filename=cost_details.filename if cost_details else None,
        cost_material_id=cost_details.material_id if cost_details else None,
        cost_quantity=cost_details.quantity if cost_details else None,
        stock_weight_kg=cost_details.stock_weight_kg if cost_details else None,
        actual_weight=cost_details.actual_weight if cost_details else None,
        material_removed_mm3=cost_details.material_removed_mm3 if cost_details else None,
        roughing_mrr=cost_details.roughing_mrr if cost_details else None,
        finishing_mrr=cost_details.finishing_mrr if cost_details else None,
        roughing_time_min=cost_details.roughing_time_min if cost_details else None,
        finishing_time_min=cost_details.finishing_time_min if cost_details else None,
        total_machining_time_hr=cost_details.total_machining_time_hr if cost_details else None,
        manufacturing_time_hr=cost_details.manufacturing_time_hr if cost_details else None,
        manufacturing_cost_perunit=cost_details.manufacturing_cost_perunit if cost_details else None,
        material_cost_perunit=cost_details.material_cost_perunit if cost_details else None,
        manufacturing_cost_without_materialcost=cost_details.manufacturing_cost_without_materialcost if cost_details else None,
        Total_material_cost=cost_details.Total_material_cost if cost_details else None,
        manufacturing_cost_with_material_cost=cost_details.manufacturing_cost_with_material_cost if cost_details else None,
        machine_cost_breakup=cost_details.machine_cost_breakup if cost_details else None,
        cost_created_at=cost_details.created_at.isoformat() if cost_details and cost_details.created_at else None
    )
    
    return combined_data



