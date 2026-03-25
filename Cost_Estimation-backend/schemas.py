import re
from typing import List, Optional, Dict
from datetime import datetime

from pydantic import BaseModel, Field


# Pydantic schema for creating new material
# class MaterialCreate(BaseModel):
#     material: str
#     material_specification: str
#     density: float
#
#     class Config:
#         schema_extra = {
#             "example": {
#                 "material": "Aluminum",
#                 "material_specification": "6061-T6",
#                 "density": 2700.0
#             }
#         }

class MaterialCreate(BaseModel):
    material: str
    material_specification: str
    density: float
    mrr: float
    material_cost: float

    class Config:
        schema_extra = {
            "example": {
                "material": "Aluminum",
                "material_specification": "6061-T6",
                "density": 2700.0,
                "mrr": 2.5,
                "material_cost": 1700.0
            }
        }


class UserCreate(BaseModel):
    username: str
    password: str
    role: str  # still required, you can send 'admin' from frontend

class UserOut(BaseModel):
    id: int
    username: str
    role: str

    class Config:
        orm_mode = True

class PasswordUpdateRequest(BaseModel):
        username: str
        new_password: str
        secret_key: str

class UserLoginSchema(BaseModel):
    username: str
    password: str
    role: str


class PasswordUpdateRequest_1(BaseModel):
    username: str
    role: str
    new_password: str


class UserResponse(BaseModel):
    id: int
    username: str
    role: str

    class Config:
        orm_mode = True


class UserDeleteRequest(BaseModel):
    username: str
    role: str


class MaterialResponse(BaseModel):
    id: int
    material: str
    material_specification: str
    density: float
    mrr: float
    material_cost: float

    class Config:
        orm_mode = True


class MaterialUpdateResponse(BaseModel):
    message: str
    data: MaterialResponse


class MachineRateResponse(BaseModel):
    id: int
    machine_type: str
    volume_limit: int
    hourly_rate: int
    size: str

    class Config:
        orm_mode = True

class RateBracket(BaseModel):
    volume_limit: int
    hourly_rate: int
    size: str

class MachineRateCreate(BaseModel):
    machine_type: str
    rates: List[RateBracket]





class TurningParameterCreate(BaseModel):
    diameter_range: str
    roughing_depth_of_cut: float
    roughing_feed_rate: float
    roughing_cutting_speed: float
    finishing_depth_of_cut: float
    finishing_feed_rate: float
    finishing_cutting_speed: float

class TurningMHRCreate(BaseModel):
    diameter_condition: str
    turning_rate: float
    boring_rate: float
    threading_rate: float
    milling_rate: float

class TurningMaterialCreate(BaseModel):
    material: str
    material_specification: str
    density: float
    material_cost: float
    parameters: List[TurningParameterCreate]
    mhr_rates: List[TurningMHRCreate]

class MaterialCostUpdate(BaseModel):
    id: int
    material: str
    material_specification: str
    new_cost: float

# class TurningParameterUpdate(BaseModel):
#     material_id: int
#     diameter_range: str
#     roughing_depth_of_cut: Optional[float] = None
#     roughing_feed_rate: Optional[float] = None
#     roughing_cutting_speed: Optional[float] = None
#     finishing_depth_of_cut: Optional[float] = None
#     finishing_feed_rate: Optional[float] = None
#     finishing_cutting_speed: Optional[float] = None
class TurningParameterUpdate(BaseModel):
    material: str
    old_diameter_range: str
    new_diameter_range: str
    roughing_depth_of_cut: float
    roughing_feed_rate: float
    roughing_cutting_speed: float
    finishing_depth_of_cut: float
    finishing_feed_rate: float
    finishing_cutting_speed: float

class TurningMaterialDelete(BaseModel):
    material: str
    material_specification: str
    density: float
    material_cost: float

class TurningParameterCreate(BaseModel):
    material_id: int
    diameter_range: str
    roughing_depth_of_cut: float
    roughing_feed_rate: float
    roughing_cutting_speed: float
    finishing_depth_of_cut: float
    finishing_feed_rate: float
    finishing_cutting_speed: float


class UpdateTurningPercentages(BaseModel):
    roughing_percentage: float
    finishing_percentage: float


class CreateMachineHourRate(BaseModel):
    material_id: int
    diameter_condition: str
    turning_rate: float
    boring_rate: float
    threading_rate: float
    milling_rate: float



# class UpdateMachineHourRate(BaseModel):
#     turning_rate: float
#     boring_rate: float
#     threading_rate: float
#     milling_rate: float


class UpdateMachineHourRate(BaseModel):
    material: str
    old_diameter_condition: str
    new_diameter_condition: Optional[str] = None
    turning_rate: float
    boring_rate: float
    threading_rate: float
    milling_rate: float


class UpdateManufacturingPercentage(BaseModel):
    percentage_of_manufacturing_time: float
    Correction_factor: Optional[float] = None


class MachineDistributionInput(BaseModel):
    history_id: int
    machine_distribution: Dict[str, float]


class MillingMachineDistributionInput(BaseModel):
    history_id: int
    machine_distribution: Dict[str, dict]

class MaterialSchema(BaseModel):
    id: int
    material: str
    material_specification: Optional[str] = None
    density: Optional[float] = None
    material_cost: Optional[float] = None

    class Config:
        orm_mode = True


class UpdateMaterialCostInput(BaseModel):
    material: str
    material_specification: str
    density: float
    material_cost: float



class MillingParameterInput(BaseModel):
    length_range: str
    roughing_feed_rate: float
    roughing_depth_of_cut: float
    roughing_radial_woc: float
    finishing_feed_rate: float
    finishing_depth_of_cut: float
    finishing_radial_woc: float

class MachineRateInput(BaseModel):
    machine_type: str
    hourly_rate: int
    size: str

class MaterialInput(BaseModel):
    material: str
    material_specification: str
    density: float
    material_cost: float
    parameters: List[MillingParameterInput]
    machine_rates: List[MachineRateInput]

class DeleteMaterialInput(BaseModel):
    material: str
    material_specification: str
    density: float
    material_cost: float

# class UpdateMachineRateInput(BaseModel):
#     material_id: int
#     machine_type: str
#     size: str
#     hourly_rate: int
class UpdateMachineRateInput(BaseModel):
    material: str                # material name (instead of ID)
    machine_type: str
    old_size: str                # old size to match
    new_size: str                # new size to update
    hourly_rate: int

class AddMachineRateInput(BaseModel):
    material_id: int
    machine_type: str
    size: str
    hourly_rate: int


# class UpdateMillingParametersInput(BaseModel):
#     material_id: int
#     length_range: str
#     roughing_feed_rate: float
#     roughing_depth_of_cut: float
#     roughing_radial_woc: float
#     finishing_feed_rate: float
#     finishing_depth_of_cut: float
#     finishing_radial_woc: float
class UpdateMillingParametersInput(BaseModel):
    material: str
    old_length_range: str
    new_length_range: str
    roughing_feed_rate: float
    roughing_depth_of_cut: float
    roughing_radial_woc: float
    finishing_feed_rate: float
    finishing_depth_of_cut: float
    finishing_radial_woc: float

class UpdateMillingPercentagesInput(BaseModel):
    roughing_percentage: float
    finishing_percentage: float


class UpdateManufacturingPercentageInput(BaseModel):
    percentage_of_manufacturing_time: float


class AddMillingParametersInput(BaseModel):
    material_id: int
    length_range: str
    roughing_feed_rate: float
    roughing_depth_of_cut: float
    roughing_radial_woc: float
    finishing_feed_rate: float
    finishing_depth_of_cut: float
    finishing_radial_woc: float


# schema related to sheet metal models
class SheetmetalParameterInput(BaseModel):
    length_range: str
    roughing_feed_rate: float
    roughing_axial_depth_of_cut: float
    roughing_radial_width_of_cut: float
    finishing_feed_rate: float
    finishing_axial_depth_of_cut: float
    finishing_radial_width_of_cut: float

class SheetmetalMachineRateInput(BaseModel):
    machine_type: str
    hourly_rate: int
    size: str

class SheetmetalMaterialCreateInput(BaseModel):
    material: str
    material_specification: str
    density: float
    material_cost: float
    parameters: List[SheetmetalParameterInput]
    machine_rates: List[SheetmetalMachineRateInput]

class SheetmetalMaterialDeleteInput(BaseModel):
    material_id: int

# Schema for combined sheet metal history and calculation results
class SheetMetalHistoryResponse(BaseModel):
    # SheetMetalHistory fields
    id: int
    filename_female: str
    filename_male: str
    filename_part: str
    female_tool: dict
    male_tool: dict
    part: dict
    material_id: int
    material_name: str
    material_density: float
    material_cost: float
    quantity: int
    created_at: datetime
    
    # SheetmetalCalculationResult fields (optional)
    calculation_id: Optional[int] = None
    history_id_calc: Optional[int] = None
    female_stock_dimensions: Optional[dict] = None
    female_volume_removed_m3: Optional[float] = None
    female_roughing_mrr: Optional[float] = None
    female_finishing_mrr: Optional[float] = None
    female_roughing_time_hr: Optional[float] = None
    female_finishing_time_hr: Optional[float] = None
    female_total_machining_time_hr: Optional[float] = None
    female_manufacturing_percentage: Optional[float] = None
    female_manufacturing_time_hr: Optional[float] = None
    female_mhr: Optional[float] = None
    female_roughing_percentage: Optional[float] = None
    female_finishing_percentage: Optional[float] = None
    male_stock_dimensions: Optional[dict] = None
    male_volume_removed_m3: Optional[float] = None
    male_roughing_mrr: Optional[float] = None
    male_finishing_mrr: Optional[float] = None
    male_roughing_time_hr: Optional[float] = None
    male_finishing_time_hr: Optional[float] = None
    male_total_machining_time_hr: Optional[float] = None
    male_manufacturing_percentage: Optional[float] = None
    male_manufacturing_time_hr: Optional[float] = None
    male_mhr: Optional[float] = None
    male_roughing_percentage: Optional[float] = None
    male_finishing_percentage: Optional[float] = None
    forming_percentage: Optional[float] = None
    male_total_cost_mfg_mat: Optional[float] = None
    female_total_cost_mfg_mat: Optional[float] = None
    tool_design_data: Optional[dict] = None
    female_manufacturing_cost_per_unit: Optional[float] = None
    female_manufacturing_cost: Optional[float] = None
    female_total_material_cost_per_unit: Optional[float] = None
    female_total_material: Optional[float] = None
    male_manufacturing_cost_per_unit: Optional[float] = None
    male_manufacturing_cost: Optional[float] = None
    male_total_material_cost_per_unit: Optional[float] = None
    male_total_material_cost: Optional[float] = None
    part_forming_cost_per_unit: Optional[float] = None
    part_forming_cost: Optional[float] = None
    total_material_cost_per_unit: Optional[float] = None
    total_material_cost: Optional[float] = None
    total_cost_per_unit: Optional[float] = None
    total_cost: Optional[float] = None
    calculated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


#composites


class UpdatePrepregCostInput(BaseModel):
    material: str
    spec: str
    thickness_mm: Optional[float] = None
    prepreg_cost_per_kg: Optional[float] = None

class CreatePrepregCostInput(BaseModel):
    material: str
    spec: str
    density_kg_m3: Optional[float] = None
    thickness_mm: Optional[float] = None
    prepreg_cost_per_kg: float



class MasterToolCostUpdate(BaseModel):
    epoxy_block_material_cost: float
    epoxy_block_density: float
    epoxy_block_bonding_cost: float

    design_cost_per_hr: float
    machining_cost_per_hr: float
    assembly_cost_per_hr: float
    finishing_cost_per_hr: float
    inspection_cost_per_hr: float

    frame_fabrication_cost: float


class CompositesPartToolCostUpdate(BaseModel):
    added_thickness_mm: float
    Percentage_of_surface_area_to_be_increased: float

    COST_OF_DRY_CARBON_FABRIC: float
    LAYUP_COST: float
    OVEN_CURING_COST: float

    LT_INSPECTION_COST: float
    Number_of_Inspection_time: float
    TRIMMING_INSPECTION: float

    COST_FOR_FABRICATION_CFC_TUBES: float
    COST_FOR_BONDING_AND_RIVETING: int


class CompositesPartFabricationCostUpdate(BaseModel):
    extra_prepreg_weight_percent: float
    consumable_cost_percent: float

    layup_cost_per_hr: float
    autoclave_curing_cost_per_hr: float
    trimming_inspection_cost_per_hr: float
    ndts_cost_per_hr: float



class MasterToolHourUpdateRange(BaseModel):
    old_volume_range_m3: str
    new_volume_range_m3: str

    design_hours: float
    machining_hours: float
    assembly_hours: float
    finishing_hours: float
    inspection_hours: float



class MasterToolHourCreate(BaseModel):
    volume_range_m3: str = Field(
        ...,
        example="4-6",
        description="Volume range in m3, format: min-max"
    )

    design_hours: float
    machining_hours: float
    assembly_hours: float
    finishing_hours: float
    inspection_hours: float

    @staticmethod
    def parse_range(range_str: str):
        match = re.match(r"^\s*(\d+(\.\d+)?)\s*-\s*(\d+(\.\d+)?)\s*$", range_str)
        if not match:
            raise ValueError("volume_range_m3 must be in 'min-max' format")

        min_v = float(match.group(1))
        max_v = float(match.group(3))

        if min_v >= max_v:
            raise ValueError("Range min must be less than max")

        return min_v, max_v


class PartToolHourUpdateRange(BaseModel):
    old_volume_range_m3: str
    new_volume_range_m3: str

    curing_hours: float
    trimming_inspection_hours: float


class PartToolHourCreate(BaseModel):
    volume_range_m3: str = Field(
        ...,
        example="4-6",
        description="Volume range in m3, format: min-max"
    )

    curing_hours: float
    trimming_inspection_hours: float

    @staticmethod
    def parse_range(range_str: str):
        match = re.match(r"^\s*(\d+(\.\d+)?)\s*-\s*(\d+(\.\d+)?)\s*$", range_str)
        if not match:
            raise ValueError("volume_range_m3 must be in 'min-max' format")

        min_v = float(match.group(1))
        max_v = float(match.group(3))

        if min_v >= max_v:
            raise ValueError("Range min must be less than max")

        return min_v, max_v



class PartToolLayupHourCreate(BaseModel):
    surface_area_range: str = Field(example="150-300")
    layup_man_hours: float

    @staticmethod
    def parse_range(range_str: str):
        match = re.match(r"^\s*(\d+(\.\d+)?)\s*-\s*(\d+(\.\d+)?)\s*$", range_str)
        if not match:
            raise ValueError("surface_area_range must be in 'min-max' format")

        min_v = float(match.group(1))
        max_v = float(match.group(3))

        if min_v >= max_v:
            raise ValueError("Range min must be less than max")

        return min_v, max_v


class PartToolLayupHourUpdateRange(BaseModel):
    old_surface_area_range: str
    new_surface_area_range: str
    layup_man_hours: float



class PartFabricationHourCreate(BaseModel):
    volume_range_m3: str = Field(example="4-6")

    curing_hours: float
    trimming_inspection_hours: float
    ndts_hours: float

    @staticmethod
    def parse_range(range_str: str):
        match = re.match(r"^\s*(\d+(\.\d+)?)\s*-\s*(\d+(\.\d+)?)\s*$", range_str)
        if not match:
            raise ValueError("volume_range_m3 must be in 'min-max' format")

        min_v = float(match.group(1))
        max_v = float(match.group(3))

        if min_v >= max_v:
            raise ValueError("Range min must be less than max")

        return min_v, max_v


class PartFabricationHourUpdateRange(BaseModel):
    old_volume_range_m3: str
    new_volume_range_m3: str

    curing_hours: float
    trimming_inspection_hours: float
    ndts_hours: float



class PartFabricationLayupHourCreate(BaseModel):
    surface_area_range: str = Field(example="150-250")
    layup_man_hours: float

    @staticmethod
    def parse_range(range_str: str):
        match = re.match(r"^\s*(\d+(\.\d+)?)\s*-\s*(\d+(\.\d+)?)\s*$", range_str)
        if not match:
            raise ValueError("surface_area_range must be in 'min-max' format")

        min_v = float(match.group(1))
        max_v = float(match.group(3))

        if min_v >= max_v:
            raise ValueError("Range min must be less than max")

        return min_v, max_v


class PartFabricationLayupHourUpdateRange(BaseModel):
    old_surface_area_range: str
    new_surface_area_range: str
    layup_man_hours: float


class StockOverrideInput(BaseModel):
    stock_length_mm: float
    stock_width_mm: float
    stock_height_mm: float


class QuantityUpdateRequest(BaseModel):
    quantity: int


class MillingCostResponse(BaseModel):
    id: int
    milling_history_id: int
    filename: Optional[str] = None
    material_id: int
    material_name: Optional[str] = None
    quantity: int
    stock_weight_kg: Optional[float] = None
    actual_weight: Optional[float] = None
    material_removed_mm3: Optional[float] = None
    roughing_mrr: Optional[float] = None
    finishing_mrr: Optional[float] = None
    roughing_time_min: Optional[float] = None
    finishing_time_min: Optional[float] = None
    total_machining_time_hr: Optional[float] = None
    manufacturing_time_hr: Optional[float] = None
    manufacturing_cost_perunit: Optional[float] = None
    material_cost_perunit: Optional[float] = None
    manufacturing_cost_without_materialcost: Optional[float] = None
    Total_material_cost: Optional[float] = None
    manufacturing_cost_with_material_cost: Optional[float] = None
    machine_cost_breakup: Optional[Dict] = None
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class MillingHistoryCostResponse(BaseModel):
    # MillingHistoryDetails fields
    history_id: int
    filename: Optional[str] = None
    material_id: Optional[int] = None
    material_name: Optional[str] = None
    density: Optional[float] = None
    quantity: Optional[int] = None
    actual_length: Optional[float] = None
    actual_breadth: Optional[float] = None
    actual_height: Optional[float] = None
    actual_volume_mm3: Optional[float] = None
    actual_volume_m3: Optional[float] = None
    stock_length: Optional[float] = None
    stock_breadth: Optional[float] = None
    stock_height: Optional[float] = None
    stock_volume_mm3: Optional[float] = None
    stock_volume_m3: Optional[float] = None
    delta_x: Optional[float] = None
    delta_y: Optional[float] = None
    delta_z: Optional[float] = None
    history_created_at: Optional[str] = None

    # MillingCost fields
    cost_id: Optional[int] = None
    milling_history_id: Optional[int] = None
    cost_filename: Optional[str] = None
    cost_material_id: Optional[int] = None
    cost_quantity: Optional[int] = None
    stock_weight_kg: Optional[float] = None
    actual_weight: Optional[float] = None
    material_removed_mm3: Optional[float] = None
    roughing_mrr: Optional[float] = None
    finishing_mrr: Optional[float] = None
    roughing_time_min: Optional[float] = None
    finishing_time_min: Optional[float] = None
    total_machining_time_hr: Optional[float] = None
    manufacturing_time_hr: Optional[float] = None
    manufacturing_cost_perunit: Optional[float] = None
    material_cost_perunit: Optional[float] = None
    manufacturing_cost_without_materialcost: Optional[float] = None
    Total_material_cost: Optional[float] = None
    manufacturing_cost_with_material_cost: Optional[float] = None
    machine_cost_breakup: Optional[Dict] = None
    cost_created_at: Optional[str] = None

    class Config:
        from_attributes = True


class TurningHistoryDetailsResponse(BaseModel):
    id: int
    filename: Optional[str] = None
    length: Optional[float] = None
    breadth: Optional[float] = None
    height: Optional[float] = None
    volume_mm3: Optional[float] = None
    volume_m3: Optional[float] = None
    material_id: Optional[int] = None
    material_name: Optional[str] = None
    material_specification: Optional[str] = None
    density: Optional[float] = None
    material_cost: Optional[float] = None
    diameter: Optional[float] = None
    axis_length: Optional[float] = None
    stock_length: Optional[float] = None
    stock_diameter: Optional[float] = None
    stock_volume_mm3: Optional[float] = None
    stock_volume_m3: Optional[float] = None
    material_removed_m3: Optional[float] = None
    stock_weight_kg: Optional[float] = None
    Material_cost: Optional[float] = None
    roughing_mrr: Optional[float] = None
    finishing_mrr: Optional[float] = None
    roughing_time: Optional[float] = None
    finishing_time: Optional[float] = None
    machining_hours: Optional[float] = None
    diameter_range: Optional[str] = None
    roughing_depth_of_cut: Optional[float] = None
    roughing_feed_rate: Optional[float] = None
    roughing_cutting_speed: Optional[float] = None
    finishing_depth_of_cut: Optional[float] = None
    finishing_feed_rate: Optional[float] = None
    finishing_cutting_speed: Optional[float] = None
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class TurningHistoryCostResponse(BaseModel):
    # TurningHistoryDetails fields
    history_id: int
    filename: Optional[str] = None
    length: Optional[float] = None
    breadth: Optional[float] = None
    height: Optional[float] = None
    volume_mm3: Optional[float] = None
    volume_m3: Optional[float] = None
    material_id: Optional[int] = None
    material_name: Optional[str] = None
    material_specification: Optional[str] = None
    density: Optional[float] = None
    material_cost: Optional[float] = None
    diameter: Optional[float] = None
    axis_length: Optional[float] = None
    stock_length: Optional[float] = None
    stock_diameter: Optional[float] = None
    stock_volume_mm3: Optional[float] = None
    stock_volume_m3: Optional[float] = None
    material_removed_m3: Optional[float] = None
    stock_weight_kg: Optional[float] = None
    Material_cost: Optional[float] = None
    roughing_mrr: Optional[float] = None
    finishing_mrr: Optional[float] = None
    roughing_time: Optional[float] = None
    finishing_time: Optional[float] = None
    machining_hours: Optional[float] = None
    diameter_range: Optional[str] = None
    roughing_depth_of_cut: Optional[float] = None
    roughing_feed_rate: Optional[float] = None
    roughing_cutting_speed: Optional[float] = None
    finishing_depth_of_cut: Optional[float] = None
    finishing_feed_rate: Optional[float] = None
    finishing_cutting_speed: Optional[float] = None
    history_created_at: Optional[str] = None

    # TurningMachiningCost fields
    cost_id: Optional[int] = None
    cost_filename: Optional[str] = None
    turning_percentage: Optional[float] = None
    boring_percentage: Optional[float] = None
    threading_percentage: Optional[float] = None
    milling_percentage: Optional[float] = None
    turning_cost: Optional[float] = None
    boring_cost: Optional[float] = None
    threading_cost: Optional[float] = None
    milling_cost: Optional[float] = None
    total_Manufacturing_time: Optional[float] = None
    total_machining_cost_per_unit: Optional[float] = None
    total_machining_cost: Optional[float] = None
    Material_cost_per_unit: Optional[float] = None
    total_material_cost: Optional[float] = None
    total_cost_without_material_cost: Optional[float] = None
    total_cost_with_material_cost: Optional[float] = None
    quantity: Optional[int] = None
    turning_size: Optional[str] = None
    milling_size: Optional[str] = None
    boring_size: Optional[str] = None
    threading_size: Optional[str] = None

    class Config:
        from_attributes = True