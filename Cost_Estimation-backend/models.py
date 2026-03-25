from datetime import datetime

from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime, func, UniqueConstraint, LargeBinary, \
    BigInteger, JSON
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from pytz import timezone

from db import Base


def ist_now():
    return datetime.now(timezone("Asia/Kolkata"))




class TurningMaterials(Base):
    __tablename__ = "Turning_Materials"
    id = Column(Integer, primary_key=True, index=True)
    material = Column(String)
    material_specification = Column(String)
    density = Column(Float)
    material_cost = Column(Float)

    parameters = relationship("TurningParameters", back_populates="material_obj")
    mhr_rates = relationship("TurningMachineHourRate", back_populates="material_ref")



class TurningParameters(Base):
    __tablename__ = "Turning_Parameters"

    id = Column(Integer, primary_key=True, index=True)

    # Link to Turning_Materials (foreign key)
    material_id = Column(Integer, ForeignKey("Turning_Materials.id"))

    # Common fields
    diameter_range = Column(String)  # e.g. "20-50", "51-100", ">101"

    # Roughing parameters
    roughing_depth_of_cut = Column(Float)   # (mm)
    roughing_feed_rate = Column(Float)      # (mm/rev)
    roughing_cutting_speed = Column(Float)  # (m/min)

    # Finishing parameters
    finishing_depth_of_cut = Column(Float)   # (mm)
    finishing_feed_rate = Column(Float)      # (mm/rev)
    finishing_cutting_speed = Column(Float)  # (m/min)
    material = Column(String)
    # Relationship
    material_obj = relationship("TurningMaterials", back_populates="parameters")



class TurningPercentages(Base):
    __tablename__ = "Turning_Percentages"

    id = Column(Integer, primary_key=True, index=True)
    roughing_percentage = Column(Float)   # e.g. 70.0 (%)
    finishing_percentage = Column(Float)  # e.g. 30.0 (%)

    # Relationship

class TurningMachineHourRate(Base):
    __tablename__ = "Turning_Machine_Hour_Rates"

    id = Column(Integer, primary_key=True, index=True)
    material_id = Column(Integer, ForeignKey("Turning_Materials.id"), nullable=False)

    diameter_condition = Column(String, nullable=False)  # e.g. "<100", ">100"
    turning_rate = Column(Float, nullable=False)
    boring_rate = Column(Float, nullable=False)
    threading_rate = Column(Float, nullable=False)
    milling_rate = Column(Float, nullable=False)
    material = Column(String)
    # Relationship back to materials
    material_ref = relationship("TurningMaterials", back_populates="mhr_rates")





class TurningHistoryDetails(Base):
    __tablename__ = "Turning_History_Details"

    id = Column(Integer, primary_key=True, index=True)

    filename = Column(String)

    # Bounding Box
    length = Column(Float)
    breadth = Column(Float)
    height = Column(Float)

    # Volume
    volume_mm3 = Column(Float)
    volume_m3 = Column(Float)

    # Material Info
    material_id = Column(Integer, ForeignKey("Turning_Materials.id"))
    material_name = Column(String)
    material_specification = Column(String)
    density = Column(Float)
    material_cost = Column(Float)

    # Derived Parameters
    diameter = Column(Float, nullable=True)
    axis_length = Column(Float, nullable=True)

    # Stock
    stock_length = Column(Float)
    stock_diameter = Column(Float)
    stock_volume_mm3 = Column(Float)
    stock_volume_m3 = Column(Float)
    material_removed_m3 = Column(Float)
    stock_weight_kg = Column(Float)
    Material_cost = Column(Float)

    # Machining
    roughing_mrr = Column(Float)
    finishing_mrr = Column(Float)
    roughing_time = Column(Float)
    finishing_time = Column(Float)
    machining_hours = Column(Float)

    # Selected Parameters
    diameter_range = Column(String)
    roughing_depth_of_cut = Column(Float)
    roughing_feed_rate = Column(Float)
    roughing_cutting_speed = Column(Float)
    finishing_depth_of_cut = Column(Float)
    finishing_feed_rate = Column(Float)
    finishing_cutting_speed = Column(Float)

    created_at = Column(DateTime, default=datetime.utcnow)
    machining_costs = relationship("TurningMachiningCost", back_populates="history")

class TurningMachiningCost(Base):
    __tablename__ = "Turning_Machining_Costs"

    id = Column(Integer, primary_key=True, index=True)
    history_id = Column(Integer, ForeignKey("Turning_History_Details.id"), nullable=False)
    filename = Column(String, nullable=False)
    obj_file = Column(LargeBinary, nullable=True)
    glb_file = Column(LargeBinary, nullable=True )
    draco_glb_file = Column(LargeBinary, nullable=True)

    turning_percentage = Column(Float, nullable=False)
    boring_percentage = Column(Float, nullable=False)
    threading_percentage = Column(Float, nullable=False)
    milling_percentage = Column(Float, nullable=False)

    turning_cost = Column(Float, nullable=False)
    boring_cost = Column(Float, nullable=False)
    threading_cost = Column(Float, nullable=False)
    milling_cost = Column(Float, nullable=False)
    total_Manufacturing_time = Column(Float, nullable=True)
    total_machining_cost_per_unit= Column(Float, nullable=False)
    total_machining_cost = Column(Float, nullable=False)
    Material_cost_per_unit = Column(Float, nullable=False)
    total_material_cost= Column(Float, nullable=False )
    total_cost_without_material_cost = Column(Float, nullable=False )
    total_cost_with_material_cost = Column(Float, nullable=True)
    quantity=Column(Integer,nullable=False)

    turning_size = Column(String, nullable=True)
    milling_size = Column(String, nullable=True)
    boring_size = Column(String, nullable=True)
    threading_size = Column(String, nullable=True)


    history = relationship("TurningHistoryDetails", back_populates="machining_costs")


class ManufacturingPercentage(Base):
    __tablename__ = "Turning_Manufacturing_Percentage"

    id = Column(Integer, primary_key=True, index=True)
    percentage_of_manufacturing_time = Column(Float, nullable=False)
    Correction_factor = Column(Float, nullable=True)

#milling_Process

class Materials(Base):
    __tablename__ = "Milling_Materials"
    id = Column(Integer, primary_key=True, index=True)
    material = Column(String)
    material_specification = Column(String)
    density = Column(Float)
    material_cost = Column(Float)
    # history = relationship("HistoryDetails", back_populates="material_ref")
    machine_rates = relationship("MachineRates", back_populates="material_ref")
    parameters = relationship("MillingParameters", back_populates="material_obj")

#

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    hashed_password = Column(String)
    role = Column(String)

    __table_args__ = (
        UniqueConstraint("username", "role", name="uix_username_role"),
    )



class MachineRates(Base):
    __tablename__ = "Milling_MachineRates"

    id = Column(Integer, primary_key=True, index=True,autoincrement=True)

    machine_type = Column(String, nullable=False)  # e.g. "5 Axis"

    hourly_rate = Column(Integer, nullable=False)
    size = Column(String, nullable=False)
    material_id = Column(Integer, ForeignKey("Milling_Materials.id"), nullable=True)
    material = Column(String)


    material_ref = relationship("Materials", back_populates="machine_rates")



class MillingParameters(Base):
    __tablename__ = "Milling_Parameters"

    id = Column(Integer, primary_key=True, index=True )

    # Link to Turning_Materials (foreign key)
    material_id = Column(Integer, ForeignKey("Milling_Materials.id"))


    # Common fields
    length_range  = Column(String)  # e.g. "20-50", "51-100", ">101"

    # Roughing parameters
    roughing_feed_rate = Column(Float) # mm/min
    roughing_depth_of_cut = Column(Float)   # (mm)
    roughing_radial_woc= Column(Float)  # mm

    # Finishing parameters
    finishing_feed_rate = Column(Float)
    finishing_depth_of_cut= Column(Float)
    finishing_radial_woc = Column(Float)
    material = Column(String)

    # Relationship
    material_obj = relationship("Materials", back_populates="parameters")


class MillingPercentages(Base):
    __tablename__ = "Milling_Percentages"

    id = Column(Integer, primary_key=True, index=True)
    roughing_percentage = Column(Float)   # e.g. 70.0 (%)
    finishing_percentage = Column(Float)  # e.g. 30.0 (%)


class MillingManufacturingPercentage(Base):
    __tablename__ = "Milling_Manufacturing_Percentage"

    id = Column(Integer, primary_key=True, index=True)
    percentage_of_manufacturing_time = Column(Float, nullable=False)
    Correction_factor = Column(Float, nullable=True)


class MillingHistoryDetails(Base):
    __tablename__ = "Milling_History_Details"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=True)
    material_id = Column(Integer, ForeignKey("Milling_Materials.id"), nullable=True)
    material_name = Column(String, nullable=True)
    density = Column(Float, nullable=True)
    quantity = Column(Integer, nullable=True)

    actual_length = Column(Float, nullable=True)
    actual_breadth = Column(Float, nullable=True)
    actual_height = Column(Float, nullable=True)
    actual_volume_mm3 = Column(Float, nullable=True)
    actual_volume_m3 = Column(Float, nullable=True)

    stock_length = Column(Float, nullable=True)
    stock_breadth = Column(Float, nullable=True)
    stock_height = Column(Float, nullable=True)
    stock_volume_mm3 = Column(Float, nullable=True)
    stock_volume_m3 = Column(Float, nullable=True)

    delta_x = Column(Float, nullable=True)
    delta_y = Column(Float, nullable=True)
    delta_z = Column(Float, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

class MillingCost(Base):
    __tablename__ = "Milling_Costs"

    id = Column(Integer, primary_key=True, index=True)

    milling_history_id = Column(Integer, ForeignKey("Milling_History_Details.id"), nullable=False)
    filename = Column(String, nullable=True)
    obj_file = Column(LargeBinary, nullable=True)
    glb_file = Column(LargeBinary, nullable=True)  # Optimized GLB format
    draco_glb_file = Column(LargeBinary, nullable=True )
    material_id = Column(Integer, ForeignKey("Milling_Materials.id"), nullable=False)
    quantity = Column(Integer, nullable=False )

    stock_weight_kg = Column(Float, nullable=True)
    actual_weight = Column(Float, nullable=True)
    material_removed_mm3 = Column(Float, nullable=True)

    roughing_mrr = Column(Float, nullable=True)
    finishing_mrr = Column(Float, nullable=True)

    roughing_time_min = Column(Float, nullable=True)
    finishing_time_min = Column(Float, nullable=True)
    total_machining_time_hr = Column(Float, nullable=True)
    manufacturing_time_hr = Column(Float, nullable=True)

    manufacturing_cost_perunit = Column(Float, nullable=True)
    material_cost_perunit = Column(Float, nullable=True)
    manufacturing_cost_without_materialcost = Column(Float, nullable=True)
    Total_material_cost = Column(Float, nullable=True)
    manufacturing_cost_with_material_cost = Column(Float, nullable=True)

    machine_cost_breakup = Column(JSON, nullable=True)  # store machine_type -> cost as JSON

    created_at = Column(DateTime, default=datetime.utcnow)





# ''''''sheet metals related models part of code

class Sheet_metal_Materials(Base):
    __tablename__ = "Sheetmetal_Materials"
    id = Column(Integer, primary_key=True, index=True)
    material = Column(String)
    material_specification = Column(String)
    density = Column(Float)
    material_cost = Column(Float)

    parameters = relationship("SheetmetalParameters", back_populates="material_ref")
    machine_hour_rates = relationship("SheetmetalMachineHourRate", back_populates="material_obj")




class SheetmetalParameters(Base):
    __tablename__ = "Sheetmetal_Parameters"

    id = Column(Integer, primary_key=True, index=True)

    # Link to Turning_Materials (foreign key)
    material_id = Column(Integer, ForeignKey("Sheetmetal_Materials.id"))

    # Common fields
    length_range = Column(String)  # e.g. "20-50", "51-100", ">101"

    # Roughing parameters
    roughing_feed_rate = Column(Float)
    roughing_axial_depth_of_cut = Column(Float)   # (mm)
    roughing_radial_width_of_cut = Column(Float)  # (m/min)

    # Finishing parameters
    finishing_feed_rate = Column(Float)  # (mm/rev)
    finishing_axial_depth_of_cut = Column(Float)   # (mm)
    finishing_radial_width_of_cut= Column(Float)  # (m/min)
    material = Column(String)

    material_ref = relationship("Sheet_metal_Materials", back_populates="parameters")


class SheetmetalPercentages(Base):
    __tablename__ = "Sheetmetal_Percentages"

    id = Column(Integer, primary_key=True, index=True)
    roughing_percentage = Column(Float)   # e.g. 70.0 (%)
    finishing_percentage = Column(Float)  # e.g. 30.0 (%)

class SheetmetalManufacturingPercentage(Base):
    __tablename__ = "Sheetmetal_Manufacturing_Percentage"

    id = Column(Integer, primary_key=True, index=True)
    percentage_of_manufacturing_time = Column(Float, nullable=False)
    Correction_factor = Column(Float, nullable=True)


class SheetmetalMachineHourRate(Base):
    __tablename__ = "Sheetmetal_Machine_Hour_Rates"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    machine_type = Column(String, nullable=False)  # e.g. "5 Axis"

    hourly_rate = Column(Integer, nullable=False)
    size = Column(String, nullable=False)
    material_id = Column(Integer, ForeignKey("Sheetmetal_Materials.id"), nullable=True )
    material = Column(String)

    material_obj = relationship("Sheet_metal_Materials", back_populates="machine_hour_rates")


class SheetmetalToolingCost(Base):
    __tablename__ = "Sheetmetal_Tooling_Cost"

    id = Column(Integer, primary_key=True, index=True,autoincrement=True)

    # Tool Design Hourly Rate section
    part_size = Column(String, nullable=False)  # e.g. "<500mm", "501 to 1000mm", ">1000mm"
    type_of_tool = Column(String, nullable=False)  # e.g. "Simple Rubber Pad Form Tool"
    number_of_tools = Column(String, nullable=False)  # e.g. "2 No. (Male & Female)"
    design_hours = Column(Float, nullable=False)  # e.g. 40, 60, 80
    cost_per_hour = Column(Float, nullable=False)  # e.g. 1500

    # Part Forming Cost section
    forming_cost_percentage = Column(Float, nullable=False)

class SheetMetalHistory(Base):
    __tablename__ = "Sheetmetal_history"

    id = Column(Integer, primary_key=True, index=True)

    # --- Filenames ---
    filename_female = Column(String, nullable=False)
    filename_male = Column(String, nullable=False)
    filename_part = Column(String, nullable=False)

    # --- Tool/Part data ---
    female_tool = Column(JSON, nullable=False)  # store dims, volume, stock dims, etc.
    male_tool = Column(JSON, nullable=False)
    part = Column(JSON, nullable=False)

    # --- Material info ---
    material_id = Column(Integer, nullable=False )
    material_name = Column(String, nullable=False)
    material_density = Column(Float, nullable=False)
    material_cost = Column(Float, nullable=False)

    # --- Quantity ---
    quantity = Column(Integer, nullable=False, default=1)

    # --- Timestamps ---
    created_at = Column(DateTime, default=datetime.utcnow)


class SheetmetalCalculationResult(Base):
    __tablename__ = "Sheetmetal_calculation_results"

    id = Column(Integer, primary_key=True, index=True)

    # --- Link to history ---
    history_id = Column(Integer, ForeignKey("Sheetmetal_history.id"), nullable=False, index=True )

    # --- Female Tool Calculations ---

    female_stock_dimensions = Column(JSON, nullable=True)  # stock_L, stock_B, stock_H, volumes, weight, costs
    female_volume_removed_m3 = Column(Float, nullable=True)


    female_roughing_mrr = Column(Float, nullable=True)
    female_finishing_mrr = Column(Float, nullable=True)
    female_roughing_time_hr = Column(Float, nullable=True)
    female_finishing_time_hr = Column(Float, nullable=True)
    female_total_machining_time_hr = Column(Float, nullable=True)
    female_manufacturing_percentage = Column(Float, nullable=True)
    female_manufacturing_time_hr = Column(Float, nullable=True)
    female_mhr = Column(Float, nullable=True)

    female_roughing_percentage = Column(Float, nullable=True)
    female_finishing_percentage = Column(Float, nullable=True)




    # --- Male Tool Calculations ---

    male_stock_dimensions = Column(JSON, nullable=True)
    male_volume_removed_m3 = Column(Float, nullable=True)


    male_roughing_mrr = Column(Float, nullable=True)
    male_finishing_mrr = Column(Float, nullable=True)
    male_roughing_time_hr = Column(Float, nullable=True)
    male_finishing_time_hr = Column(Float, nullable=True)
    male_total_machining_time_hr = Column(Float, nullable=True)
    male_manufacturing_percentage = Column(Float, nullable=True)
    male_manufacturing_time_hr = Column(Float, nullable=True)
    male_mhr = Column(Float, nullable=True)

    male_roughing_percentage = Column(Float, nullable=True)
    male_finishing_percentage = Column(Float, nullable=True)


    # --- Part Forming Calculations ---
    forming_percentage = Column(Float, nullable=True)

    # --- Total Costs ---
    male_total_cost_mfg_mat = Column(Float, nullable=True)
    female_total_cost_mfg_mat = Column(Float, nullable=True)

    tool_design_data = Column(JSON, nullable=True)


    female_manufacturing_cost_per_unit = Column(Float, nullable=True)
    female_manufacturing_cost = Column(Float, nullable=True)
    female_total_material_cost_per_unit = Column(Float)
    female_total_material = Column(Float)

    male_manufacturing_cost_per_unit = Column(Float, nullable=True)
    male_manufacturing_cost = Column(Float, nullable=True)
    male_total_material_cost_per_unit = Column(Float)
    male_total_material_cost = Column(Float)

    part_forming_cost_per_unit = Column(Float, nullable=True)
    part_forming_cost = Column(Float, nullable=True)

    total_material_cost_per_unit = Column(Float)
    total_material_cost = Column(Float)

    total_cost_per_unit = Column(Float, nullable=True)
    total_cost = Column(Float, nullable=True )
    # --- Timestamps ---
    calculated_at = Column(DateTime, default=datetime.utcnow)

    # --- Relationship ---
    history = relationship("SheetMetalHistory", backref="calculation_results")


class SheetMetalStepfileDetails(Base):
    __tablename__ = "Sheetmetal_stepfile_details"

    id = Column(Integer, primary_key=True, index=True )

    # --- Link to history ---
    history_id = Column(Integer, ForeignKey("Sheetmetal_history.id"), nullable=False, index=True)

    # --- Male Files ---

    male_obj_filename = Column(String, nullable=True)
    male_obj_file = Column(LargeBinary, nullable=True)
    male_glb_file = Column(LargeBinary, nullable=True)
    male_draco_glb_file = Column(LargeBinary, nullable=True)


    # --- Female Files ---

    female_obj_filename = Column(String, nullable=True)
    female_obj_file = Column(LargeBinary, nullable=True)
    female_glb_file = Column(LargeBinary, nullable=True)
    female_draco_glb_file = Column(LargeBinary, nullable=True)


    # --- Parts Files ---
    parts_obj_filename = Column(String, nullable=True)
    parts_obj_file = Column(LargeBinary, nullable=True)
    parts_glb_file = Column(LargeBinary, nullable=True)
    parts_draco_glb_file = Column(LargeBinary, nullable=True)


    # --- Timestamps ---
    created_at = Column(DateTime, default=datetime.utcnow)





#composites

class CompositesPrepregCost(Base):
    __tablename__ = "composites_prepregs_cost"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)



    material = Column(String, nullable=False)
    spec = Column(String, nullable=False)

    density_kg_m3 = Column(Float, nullable=True)
    thickness_mm = Column(Float, nullable=True)

    prepreg_cost_per_kg = Column(Float, nullable=False)








class MasterToolCost(Base):
    __tablename__ = "composites_master_tool_cost"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # Material properties
    epoxy_block_material_cost = Column(Float, nullable=False)   # Rs/m3
    epoxy_block_density = Column(Float, nullable=False)         # kg/m3
    epoxy_block_bonding_cost = Column(Float, nullable=False)    # Rs

    # Hourly costs
    design_cost_per_hr = Column(Float, nullable=False)          # Rs/hr
    machining_cost_per_hr = Column(Float, nullable=False)       # Rs/hr
    assembly_cost_per_hr = Column(Float, nullable=False)        # Rs/hr
    finishing_cost_per_hr = Column(Float, nullable=False)       # Rs/hr
    inspection_cost_per_hr = Column(Float, nullable=False)      # Rs/hr

    # Fabrication
    frame_fabrication_cost = Column(Float, nullable=False)      # Rs/m3



class CompositesPartToolCost(Base):
    __tablename__ = "composites_part_tool_cost"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # Geometry adjustments
    added_thickness_mm = Column(Float, nullable=False)                 # mm
    Percentage_of_surface_area_to_be_increased = Column(Float, nullable=False)     # %

    # Material costs
    COST_OF_DRY_CARBON_FABRIC = Column(Float, nullable=False)             # Rs/sq.m
    LAYUP_COST = Column(Float, nullable=False)          # Rs/sq.m
    OVEN_CURING_COST = Column(Float, nullable=False)              # Rs/sq.m

    # Process costs
    LT_INSPECTION_COST = Column(Float, nullable=False)                  # Rs/hr
    Number_of_Inspection_time = Column(Float, nullable=False)            # Rs/hr
    TRIMMING_INSPECTION = Column(Float, nullable=False)    # Rs/hr

    # Inspection
    COST_FOR_FABRICATION_CFC_TUBES = Column(Float, nullable=False)        # Rs/Part
    COST_FOR_BONDING_AND_RIVETING = Column(Integer, nullable=False)            # No. of times


class CompositesPartFabricationCost(Base):
    __tablename__ = "composites_part_fabrication_cost"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # Percentage factors
    extra_prepreg_weight_percent = Column(Float, nullable=False)   # %
    consumable_cost_percent = Column(Float, nullable=False)        # %

    # Process costs
    layup_cost_per_hr = Column(Float, nullable=False)              # Rs/hr
    autoclave_curing_cost_per_hr = Column(Float, nullable=False)   # Rs/hr
    trimming_inspection_cost_per_hr = Column(Float, nullable=False) # Rs/hr
    ndts_cost_per_hr = Column(Float, nullable=False)               # Rs/hr



class MasterToolHourTable(Base):
    __tablename__ = "composites_master_tool_hours"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    volume_range_m3 = Column(String, nullable=False)   # e.g. "0-2", "2-4", "4-10"

    design_hours = Column(Float, nullable=False)
    machining_hours = Column(Float, nullable=False)
    assembly_hours = Column(Float, nullable=False)
    finishing_hours = Column(Float, nullable=False)
    inspection_hours = Column(Float, nullable=False)


class PartToolHourTable(Base):
    __tablename__ = "composites_part_tool_hours"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    volume_range_m3 = Column(String, nullable=False)   # e.g. "0-2", "2-4", "4-10"

    curing_hours = Column(Float, nullable=False)
    trimming_inspection_hours = Column(Float, nullable=False)


class PartToolLayupHourTable(Base):
    __tablename__ = "composites_part_tool_layup_hours"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    surface_area_range = Column(String, nullable=False)   # e.g. "0-50", "50-150"

    layup_man_hours = Column(Float, nullable=False)


class PartFabricationHourTable(Base):
    __tablename__ = "composites_part_fabrication_hours"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    volume_range_m3 = Column(String, nullable=False)   # e.g. "0-2", "2-4", "4-10"

    curing_hours = Column(Float, nullable=False)
    trimming_inspection_hours = Column(Float, nullable=False)
    ndts_hours = Column(Float, nullable=False)


class PartFabricationLayupHourTable(Base):
    __tablename__ = "composites_part_fabrication_layup_hours"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    surface_area_range = Column(String, nullable=False)   # e.g. "0-30", "30-80", "80-150"

    layup_man_hours = Column(Float, nullable=False)


class CompositeAnalysisResult(Base):
    __tablename__ = "composites_analysis_results"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # -------------------------
    # File & Material Info
    # -------------------------
    filename = Column(String, nullable=False)

    prepreg_material_id = Column(Integer, nullable=False)
    material = Column(String, nullable=False)
    spec = Column(String, nullable=False)

    density_kg_m3 = Column(Float, nullable=True)
    design_thickness_mm = Column(Float, nullable=True)
    prepreg_cost_per_kg = Column(Float, nullable=False)

    # -------------------------
    # Stock Geometry ONLY
    # -------------------------
    stock_length_mm = Column(Float, nullable=False)
    stock_width_mm = Column(Float, nullable=False)
    stock_height_mm = Column(Float, nullable=False)

    geometric_thickness_mm = Column(Float, nullable=False)
    one_ply_surface_area_m2 = Column(Float, nullable=False)

    # -------------------------
    # Laminate Calculations
    # -------------------------
    number_of_layers = Column(Float, nullable=False)
    total_surface_area_m2 = Column(Float, nullable=False)

    volume_of_part_m3 = Column(Float, nullable=False)
    mass_in_kg = Column(Float, nullable=False)

    # -------------------------
    # Tooling Calculations
    # -------------------------
    volume_of_composite_tool_in_m3 = Column(Float, nullable=False)
    tool_stock_weight_kg = Column(Float, nullable=False)

    # -------------------------
    # Metadata
    # -------------------------
    created_at = Column(DateTime, default=datetime.utcnow)




class CompositeMasterModelCost(Base):
    __tablename__ = "composites_master_model_cost"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # -------------------------
    # Reference
    # -------------------------
    analysis_id = Column(
        Integer,
        ForeignKey("composites_analysis_results.id"),
        nullable=False,
        index=True
    )

    # -------------------------
    # Hours
    # -------------------------
    design_hours = Column(Float, nullable=False)
    machining_hours = Column(Float, nullable=False)
    assembly_hours = Column(Float, nullable=False)
    finishing_hours = Column(Float, nullable=False)
    inspection_hours = Column(Float, nullable=False)

    # -------------------------
    # Costs
    # -------------------------
    design_cost = Column(Float, nullable=False)
    frame_fabrication_cost = Column(Float, nullable=False)
    epoxy_block_bonding_cost = Column(Float, nullable=False)
    machining_cost = Column(Float, nullable=False)
    assembly_cost = Column(Float, nullable=False)
    finishing_cost = Column(Float, nullable=False)
    inspection_cost = Column(Float, nullable=False)

    total_master_model_cost = Column(Float, nullable=False)

    # -------------------------
    # Metadata
    # -------------------------
    created_at = Column(DateTime, default=datetime.utcnow)




class CompositeToolCost(Base):
    __tablename__ = "composites_tool_cost"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # -------------------------------------------------
    # Reference
    # -------------------------------------------------
    analysis_id = Column(
        Integer,
        ForeignKey("composites_analysis_results.id"),
        nullable=False,
        index=True
    )

    # -------------------------------------------------
    # Geometry / Surface Calculations
    # -------------------------------------------------
    increased_thickness_tool_mm = Column(Float, nullable=False)
    total_surface_area_m2 = Column(Float, nullable=False)
    increased_surface_area_m2 = Column(Float, nullable=False)

    # -------------------------------------------------
    # Material Cost
    # -------------------------------------------------
    cost_dry_carbon_fabric = Column(Float, nullable=False)

    # -------------------------------------------------
    # Layup
    # -------------------------------------------------
    layup_man_hours = Column(Float, nullable=False)
    layup_cost = Column(Float, nullable=False)

    # -------------------------------------------------
    # Oven Curing
    # -------------------------------------------------
    curing_hours = Column(Float, nullable=False)
    oven_curing_cost = Column(Float, nullable=False)

    # -------------------------------------------------
    # LT Inspection
    # -------------------------------------------------
    lt_inspection_hours = Column(Float, nullable=False)
    lt_inspection_cost = Column(Float, nullable=False)

    # -------------------------------------------------
    # Trimming & Inspection
    # -------------------------------------------------
    trimming_inspection_hours = Column(Float, nullable=False)
    trimming_inspection_cost = Column(Float, nullable=False)

    # -------------------------------------------------
    # Sub-Structure Cost
    # -------------------------------------------------
    cost_fabrication_cfc_tubes = Column(Float, nullable=False)
    cost_bonding_riveting = Column(Float, nullable=False)

    # -------------------------------------------------
    # Total
    # -------------------------------------------------
    total_tool_cost = Column(Float, nullable=False)

    # -------------------------------------------------
    # Metadata
    # -------------------------------------------------
    created_at = Column(DateTime, default=datetime.utcnow)



class CompositePartToolFinalCost(Base):
    __tablename__ = "composites_part_tool_final_cost"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # -------------------------------------------------
    # Reference
    # -------------------------------------------------
    analysis_id = Column(
        Integer,
        ForeignKey("composites_analysis_results.id"),
        nullable=False,
        index=True
    )

    # -------------------------------------------------
    # PART COST DETAILS
    # -------------------------------------------------
    extra_composite_part_kg = Column(Float, nullable=False)
    prepreg_cost = Column(Float, nullable=False)

    part_layup_man_hours = Column(Float, nullable=False)
    part_layup_cost = Column(Float, nullable=False)

    consumable_cost = Column(Float, nullable=False)

    autoclave_curing_cost = Column(Float, nullable=False)
    trimming_inspection_cost = Column(Float, nullable=False)
    ndt_cost = Column(Float, nullable=False)

    total_part_cost = Column(Float, nullable=False)

    # -------------------------------------------------
    # TOOL COST (FETCHED)
    # -------------------------------------------------
    total_tool_cost = Column(Float, nullable=False)

    # -------------------------------------------------
    # ADDERS
    # -------------------------------------------------
    import_and_export_cost = Column(Float, nullable=False)
    contingency_cost = Column(Float, nullable=False)
    gst_cost = Column(Float, nullable=False)

    # -------------------------------------------------
    # FINAL
    # -------------------------------------------------
    total_cost = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=True)
    total_cost_per_unit = Column(Float, nullable=False)

    # -------------------------------------------------
    # Metadata
    # -------------------------------------------------
    created_at = Column(DateTime, default=datetime.utcnow)




class CompositeStepfileDetails(Base):
    __tablename__ = "composites_stepfile_details"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # -------------------------------------------------
    # Reference
    # -------------------------------------------------
    analysis_id = Column(
        Integer,
        ForeignKey("composites_analysis_results.id"),
        nullable=False,
        index=True
    )

    # -------------------------------------------------
    # File Metadata
    # -------------------------------------------------
    step_filename = Column(String, nullable=False)

    # -------------------------------------------------
    # Converted Formats
    # -------------------------------------------------
    obj_file = Column(LargeBinary, nullable=True)
    glb_file = Column(LargeBinary, nullable=True)
    draco_glb_file = Column(LargeBinary, nullable=True)

    # -------------------------------------------------
    # Metadata
    # -------------------------------------------------
    created_at = Column(DateTime, default=datetime.utcnow)


class CompositeCorrectionFactor(Base):
    __tablename__ = "composite_correction_factor"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # -------------------------------------------------
    # Correction Factor
    # -------------------------------------------------
    correction = Column(Float, nullable=False)

    # -------------------------------------------------
    # Metadata
    # -------------------------------------------------
    created_at = Column(DateTime, default=datetime.utcnow)


class CompositeCorrectionFactor1(Base):
    __tablename__ = "composite_Master_tool_correction_factor"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # -------------------------------------------------
    # Correction Factor
    # -------------------------------------------------
    correction = Column(Float, nullable=False)

    # -------------------------------------------------
    # Metadata
    # -------------------------------------------------
    created_at = Column(DateTime, default=datetime.utcnow)

class CompositeCorrectionFactor2(Base):
    __tablename__ = "composite_part_tool_correction_factor"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # -------------------------------------------------
    # Correction Factor
    # -------------------------------------------------
    correction = Column(Float, nullable=False)

    # -------------------------------------------------
    # Metadata
    # -------------------------------------------------
    created_at = Column(DateTime, default=datetime.utcnow)


class CompositeCorrectionFactor3(Base):
    __tablename__ = "composite_part_fabrication_correction_factor"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # -------------------------------------------------
    # Correction Factor
    # -------------------------------------------------
    correction = Column(Float, nullable=False)

    # -------------------------------------------------
    # Metadata
    # -------------------------------------------------
    created_at = Column(DateTime, default=datetime.utcnow)