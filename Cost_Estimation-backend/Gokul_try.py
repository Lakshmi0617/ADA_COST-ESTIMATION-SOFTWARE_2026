import cadquery as cq
from OCP.BRepGProp import BRepGProp
from OCP.GProp import GProp_GProps
from OCP.gp import gp_Pnt, gp_Trsf, gp_Vec, gp_Ax3, gp_Dir
import numpy as np



# import sys
# sys.path.append(r"C:\Program Files\FreeCAD 1.0\bin")
# import FreeCAD, Part




# --- Load your STEP part ---
part = cq.importers.importStep("stepfiles/Female Tool 1.stp")
bb = part.val().BoundingBox()
print(bb.xlen, bb.ylen, bb.zlen)

# --- Compute mass properties ---
props = GProp_GProps()
BRepGProp.VolumeProperties_s(part.val().wrapped, props)

# --- Get center of mass ---
com = props.CentreOfMass()
com_vec = np.array([com.X(), com.Y(), com.Z()])

# --- Get inertia tensor ---
inertia = props.MatrixOfInertia()
I = np.array([
    [inertia.Value(1,1), inertia.Value(1,2), inertia.Value(1,3)],
    [inertia.Value(2,1), inertia.Value(2,2), inertia.Value(2,3)],
    [inertia.Value(3,1), inertia.Value(3,2), inertia.Value(3,3)]
])

# --- Eigen decomposition ---
eigvals, eigvecs = np.linalg.eigh(I)
eigvecs = eigvecs / np.linalg.norm(eigvecs, axis=0)  # normalize columns
print(eigvecs)


# --- Create rotation matrix to align principal axes to global XYZ ---
R = eigvecs.T   # Transpose = inverse since it’s orthogonal

# --- Apply translation: move COM to origin ---
translated = part.translate((-com.X(), -com.Y(), -com.Z()))



trsf = gp_Trsf()

# Set translation (to move COM to origin)
trsf.SetTranslation(gp_Vec(-com.X(), -com.Y(), -com.Z()))

# Set rotation axes using gp_Ax3 and eigvecs
# Principal X, Y, Z directions
dir_x = gp_Dir(*eigvecs[:,0])
dir_y = gp_Dir(*eigvecs[:,1])
dir_z = gp_Dir(*eigvecs[:,2])

# Construct new local coordinate system
local_cs = gp_Ax3(gp_Pnt(0,0,0), dir_z, dir_x)
trsf.SetTransformation(local_cs)

# # Apply transformation
from OCP.TopLoc import TopLoc_Location

location = TopLoc_Location(trsf)
aligned_shape = part.val().wrapped.Moved(location)
aligned_part = cq.Workplane("ZX").newObject([cq.Shape(aligned_shape)])

bb = aligned_part.val().BoundingBox()

# --- Compute the center point of the bounding box ---
center = (
    (bb.xmin + bb.xmax) / 2,
    (bb.ymin + bb.ymax) / 2,
    (bb.zmin + bb.zmax) / 2
)

# --- Translate the part so that its center is at the origin ---
aligned_part = aligned_part.translate((-center[0], -center[1], -center[2]))
print(bb.xlen, bb.ylen, bb.zlen)
# show_object(aligned_part)

# cq.exporters.export(aligned_part, "Assem1_aligned_20.STEP")
# print("✅ Exported aligned part to Assem1_aligned.STEP")


















#sheet metal

#
#
# import cadquery as cq
# from OCP.BRepGProp import BRepGProp
# from OCP.GProp import GProp_GProps
# from OCP.gp import gp_Pnt, gp_Trsf, gp_Vec, gp_Ax3, gp_Dir
# from OCP.TopLoc import TopLoc_Location
# import numpy as np
#
# # --- Load part ---
# part = cq.importers.importStep("stepfiles/Sheet Metal Part 1.stp")
# print("✅ Loaded STEP file")
#
# # --- Bounding box info ---
# bb = part.val().BoundingBox()
# print(f"Original BB: X={bb.xlen:.2f}, Y={bb.ylen:.2f}, Z={bb.zlen:.2f}")
#
# # --- Compute mass properties ---
# props = GProp_GProps()
# BRepGProp.VolumeProperties_s(part.val().wrapped, props)
#
# # Center of mass
# com = props.CentreOfMass()
# com_vec = np.array([com.X(), com.Y(), com.Z()])
#
# # Inertia matrix
# inertia = props.MatrixOfInertia()
# I = np.array([[inertia.Value(i+1, j+1) for j in range(3)] for i in range(3)])
# eigvals, eigvecs = np.linalg.eigh(I)
# eigvecs = eigvecs / np.linalg.norm(eigvecs, axis=0)
#
# # --- Build transformation (move COM to origin + align principal axes) ---
# trsf = gp_Trsf()
# trsf.SetTranslation(gp_Vec(-com.X(), -com.Y(), -com.Z()))
# dir_x = gp_Dir(*eigvecs[:, 0])
# dir_z = gp_Dir(*eigvecs[:, 2])
# local_cs = gp_Ax3(gp_Pnt(0, 0, 0), dir_z, dir_x)
# trsf.SetTransformation(local_cs)
#
# # --- Apply transformation ---
# location = TopLoc_Location(trsf)
# aligned_shape = part.val().wrapped.Moved(location)
# aligned_part = cq.Workplane("XY").newObject([cq.Shape(aligned_shape)])
#
# # --- Center bounding box ---
# bb = aligned_part.val().BoundingBox()
# center = ((bb.xmin + bb.xmax) / 2, (bb.ymin + bb.ymax) / 2, (bb.zmin + bb.zmax) / 2)
# aligned_part = aligned_part.translate((-center[0], -center[1], -center[2]))
#
# # --- Export aligned part ---
# cq.exporters.export(aligned_part, "SheetMetal_Aligned.STEP")
# print("✅ Exported aligned sheet metal part to SheetMetal_Aligned.STEP")
#
# # --- Print new bounding box ---
# bb2 = aligned_part.val().BoundingBox()
# print(f"Aligned BB: X={bb2.xlen:.2f}, Y={bb2.ylen:.2f}, Z={bb2.zlen:.2f}")
#
#






#
#
#
#
#
#
# import cadquery as cq
# from OCP.BRepGProp import BRepGProp
# from OCP.GProp import GProp_GProps
# from OCP.gp import gp_Pnt, gp_Trsf, gp_Vec, gp_Ax3, gp_Dir
# from OCP.TopLoc import TopLoc_Location
# import numpy as np
#
# # ==================================================
# # STEP 1: Load and Align the Sheet Metal Part
# # ==================================================
# input_file = "stepfiles/Sheet Metal Part 1.stp"
# aligned_file = "SheetMetal_Aligned.STEP"
#
# part = cq.importers.importStep(input_file)
# print("✅ Loaded STEP file")
#
# # --- Compute bounding box ---
# bb = part.val().BoundingBox()
# print(f"Original BB: X={bb.xlen:.2f}, Y={bb.ylen:.2f}, Z={bb.zlen:.2f}")
#
# # --- Compute mass properties ---
# props = GProp_GProps()
# BRepGProp.VolumeProperties_s(part.val().wrapped, props)
#
# # Center of mass
# com = props.CentreOfMass()
# com_vec = np.array([com.X(), com.Y(), com.Z()])
#
# # Inertia matrix (for principal axes)
# inertia = props.MatrixOfInertia()
# I = np.array([[inertia.Value(i + 1, j + 1) for j in range(3)] for i in range(3)])
# eigvals, eigvecs = np.linalg.eigh(I)
# eigvecs = eigvecs / np.linalg.norm(eigvecs, axis=0)
#
# # --- Create transformation ---
# trsf = gp_Trsf()
# trsf.SetTranslation(gp_Vec(-com.X(), -com.Y(), -com.Z()))
# dir_x = gp_Dir(*eigvecs[:, 0])
# dir_z = gp_Dir(*eigvecs[:, 2])
# local_cs = gp_Ax3(gp_Pnt(0, 0, 0), dir_z, dir_x)
# trsf.SetTransformation(local_cs)
#
# # --- Apply transformation ---
# location = TopLoc_Location(trsf)
# aligned_shape = part.val().wrapped.Moved(location)
# aligned_part = cq.Workplane("XY").newObject([cq.Shape(aligned_shape)])
#
# # --- Center bounding box ---
# bb = aligned_part.val().BoundingBox()
# center = ((bb.xmin + bb.xmax) / 2, (bb.ymin + bb.ymax) / 2, (bb.zmin + bb.zmax) / 2)
# aligned_part = aligned_part.translate((-center[0], -center[1], -center[2]))
#
# # --- Export aligned part ---
# # cq.exporters.export(aligned_part, aligned_file)
# # print(f"✅ Exported aligned sheet metal part → {aligned_file}")
#
#
# # ==================================================
# # STEP 2: Create Tools using Fixed Silhouette Method
# # ==================================================
# def create_tools_by_silhouette(part, extrude_dist=50):
#     """
#     Create male and female tools that exactly match the part's footprint
#     """
#     bb = part.val().BoundingBox()
#
#     print(f"📦 Part BB for silhouette: X={bb.xlen:.2f}, Y={bb.ylen:.2f}, Z={bb.zlen:.2f}")
#     print(f"📏 Part Z-range: {bb.zmin:.2f} to {bb.zmax:.2f}")
#
#     # Method 1: Create tools using box method (more reliable)
#     # Male tool: box above the part
#     male_tool = (cq.Workplane("XY")
#                  .box(bb.xlen, bb.ylen, extrude_dist)
#                  .translate((0, 0, bb.zmax + extrude_dist / 2)))
#
#     # Female tool: box below the part
#     female_tool = (cq.Workplane("XY")
#                    .box(bb.xlen, bb.ylen, extrude_dist)
#                    .translate((0, 0, bb.zmin - extrude_dist / 2)))
#
#     return male_tool, female_tool
#
#
# # Alternative method using face extrusion (if you need exact face matching)
# def create_tools_by_face_extrusion(part, extrude_dist=50):
#     """
#     Alternative: Create tools by finding the largest top/bottom faces and extruding them
#     """
#     shape = part.val()
#     faces = shape.Faces()
#
#     # Group faces by their Z position
#     face_groups = {}
#     for face in faces:
#         bb_face = face.BoundingBox()
#         z_center = (bb_face.zmin + bb_face.zmax) / 2
#         z_key = round(z_center, 2)  # Group by Z position
#
#         if z_key not in face_groups:
#             face_groups[z_key] = []
#         face_groups[z_key].append(face)
#
#     # Find top and bottom Z positions
#     z_positions = sorted(face_groups.keys())
#     bottom_z = z_positions[0]
#     top_z = z_positions[-1]
#
#     print(f"🔍 Top face Z: {top_z:.2f}, Bottom face Z: {bottom_z:.2f}")
#
#     # Get the largest face at top and bottom (by area)
#     def get_largest_face(faces_list):
#         largest_face = None
#         max_area = 0
#         for face in faces_list:
#             props = GProp_GProps()
#             BRepGProp.SurfaceProperties_s(face.wrapped, props)
#             area = props.Mass()
#             if area > max_area:
#                 max_area = area
#                 largest_face = face
#         return largest_face
#
#     top_face = get_largest_face(face_groups[top_z])
#     bottom_face = get_largest_face(face_groups[bottom_z])
#
#     # Create tools by extruding these faces
#     male_tool = cq.Workplane(obj=top_face).extrude(extrude_dist)
#     female_tool = cq.Workplane(obj=bottom_face).extrude(-extrude_dist)
#
#     return male_tool, female_tool
#
#
# # ==================================================
# # STEP 3: Generate and Export Tools
# # ==================================================
# extrude_dist = 50
#
# print("\n🛠️ Creating tools using Silhouette Method...")
#
# # Try the box method first (most reliable)
# try:
#     male_tool, female_tool = create_tools_by_silhouette(aligned_part, extrude_dist)
#     print("✅ Used box-based silhouette method")
# except Exception as e:
#     print(f"❌ Box method failed: {e}")
#     print("🔄 Trying face extrusion method...")
#     try:
#         male_tool, female_tool = create_tools_by_face_extrusion(aligned_part, extrude_dist)
#         print("✅ Used face extrusion method")
#     except Exception as e2:
#         print(f"❌ All methods failed: {e2}")
#         # Fallback: simple bounding box tools
#         print("🔄 Using fallback bounding box method...")
#         bb = aligned_part.val().BoundingBox()
#         male_tool = (cq.Workplane("XY")
#                      .box(bb.xlen + 20, bb.ylen + 20, extrude_dist)
#                      .translate((0, 0, bb.zmax + extrude_dist / 2)))
#         female_tool = (cq.Workplane("XY")
#                        .box(bb.xlen + 20, bb.ylen + 20, extrude_dist)
#                        .translate((0, 0, bb.zmin - extrude_dist / 2)))
#
# # Export tools
# # cq.exporters.export(male_tool, "Male_Tool_Silhouette.step", exportType='STEP')
# # cq.exporters.export(female_tool, "Female_Tool_Silhouette.step", exportType='STEP')
#
# # Get bounding boxes for verification
# male_bb = male_tool.val().BoundingBox()
# female_bb = female_tool.val().BoundingBox()
# part_bb = aligned_part.val().BoundingBox()
#
# print(f"\n✅ Male Tool Saved → Male_Tool_Silhouette.step")
# print(f"📦 Male Tool BB: X={male_bb.xlen:.2f}, Y={male_bb.ylen:.2f}, Z={male_bb.zlen:.2f}")
# print(f"📍 Male Tool Position: Z={male_bb.zmin:.2f} to {male_bb.zmax:.2f}")
#
# print(f"\n✅ Female Tool Saved → Female_Tool_Silhouette.step")
# print(f"📦 Female Tool BB: X={female_bb.xlen:.2f}, Y={female_bb.ylen:.2f}, Z={female_bb.zlen:.2f}")
# print(f"📍 Female Tool Position: Z={female_bb.zmin:.2f} to {female_bb.zmax:.2f}")
#
# print(f"\n📊 Part BB for comparison: X={part_bb.xlen:.2f}, Y={part_bb.ylen:.2f}, Z={part_bb.zlen:.2f}")
# print(f"📍 Part Position: Z={part_bb.zmin:.2f} to {part_bb.zmax:.2f}")
#
# # Verify tool-part relationship
# print(f"\n🔍 Verification:")
# print(f"Male tool contacts part: {abs(male_bb.zmin - part_bb.zmax) < 1.0} (Z gap: {male_bb.zmin - part_bb.zmax:.2f}mm)")
# print(
#     f"Female tool contacts part: {abs(female_bb.zmax - part_bb.zmin) < 1.0} (Z gap: {female_bb.zmax - part_bb.zmin:.2f}mm)")
#
# print("\n🎯 Done: Male & Female tools created successfully!")
#
#
#
#
#
#



#trying logics shravan


# import cadquery as cq
# from OCP.BRep import BRep_Tool
# from OCP.Geom import Geom_Plane
# from OCP.gp import gp_Pnt, gp_Dir
# from OCP.BRepGProp import BRepGProp
# from OCP.GProp import GProp_GProps
# from OCP.BRepExtrema import BRepExtrema_DistShapeShape
# import os
#
#
# def classify_plane(normal, tol=1e-3):
#     """Classify face orientation (XY, YZ, XZ) and return opposite axis."""
#     nx, ny, nz = abs(normal.X()), abs(normal.Y()), abs(normal.Z())
#     if nz > nx and nz > ny:
#         return "XY Plane", "Z Axis", "-Z Axis"
#     elif ny > nx and ny > nz:
#         return "XZ Plane", "Y Axis", "-Y Axis"
#     elif nx > ny and nx > nz:
#         return "YZ Plane", "X Axis", "-X Axis"
#     else:
#         return "Unknown", "Unknown", "Unknown"
#
#
# def find_largest_planar_face(step_file):
#     """Find the largest planar face and its orientation."""
#     if not os.path.exists(step_file):
#         raise FileNotFoundError(f"File not found: {step_file}")
#
#     # --- Load STEP file
#     part = cq.importers.importStep(step_file)
#     shape = part.val()
#     faces = shape.Faces()
#
#     largest_face = None
#     max_area = 0
#     plane_type = None
#     normal_axis = None
#     opposite_axis = None
#     normal = None
#
#     for face in faces:
#         surf = BRep_Tool.Surface_s(face.wrapped)
#         if isinstance(surf, Geom_Plane):
#             props = GProp_GProps()
#             BRepGProp.SurfaceProperties_s(face.wrapped, props)
#             area = props.Mass()  # Surface area
#
#             if area > max_area:
#                 max_area = area
#                 largest_face = face
#                 normal = surf.Axis().Direction()
#                 plane_type, normal_axis, opposite_axis = classify_plane(normal)
#
#     if largest_face is None:
#         print("❌ No planar faces detected in this STEP file.")
#         return None
#
#     print(f"✅ Largest planar face found!")
#     print(f"📏 Area: {max_area:.2f} mm²")
#     print(f"📐 Lies on: {plane_type}")
#     print(f"🧭 Normal direction: {normal_axis}")
#     print(f"↔️ Opposite direction: {opposite_axis}")
#
#     # --- Find the opposite (parallel) face and compute thickness
#     min_distance = None
#     for face in faces:
#         if face == largest_face:
#             continue
#
#         surf = BRep_Tool.Surface_s(face.wrapped)
#         if isinstance(surf, Geom_Plane):
#             dir_other = surf.Axis().Direction()
#
#             # Check if it is parallel and opposite
#             dot = normal.Dot(dir_other)
#             if abs(abs(dot) - 1.0) < 1e-3 and dot < 0:
#                 # Compute distance between faces
#                 dist_calc = BRepExtrema_DistShapeShape(largest_face.wrapped, face.wrapped)
#                 dist_calc.Perform()
#                 if dist_calc.IsDone():
#                     distance = dist_calc.Value()
#                     if min_distance is None or distance < min_distance:
#                         min_distance = distance
#
#     if min_distance is not None:
#         print(f"📏 Estimated thickness between faces: {min_distance:.3f} mm")
#     else:
#         print("⚠️ Could not find a clear opposite parallel face for thickness calculation.")
#
#     return largest_face
#
#
# # =====================================================
# # Example usage
# # =====================================================
# if __name__ == "__main__":
#     step_path = "SheetMetal_Aligned.STEP"  # 👈 Replace with your file
#     find_largest_planar_face(step_path)




#
#
#
# import cadquery as cq
# from OCP.BRep import BRep_Tool
# from OCP.Geom import Geom_Plane
# from OCP.gp import gp_Pnt, gp_Trsf, gp_Vec, gp_Ax3, gp_Dir
# from OCP.BRepGProp import BRepGProp
# from OCP.GProp import GProp_GProps
# from OCP.TopLoc import TopLoc_Location
# from OCP.BRepExtrema import BRepExtrema_DistShapeShape
# import numpy as np
# import os
#
#
# # --------------------------------------------------------
# # Helper: Classify plane orientation based on its normal
# # --------------------------------------------------------
# def classify_plane(normal, tol=1e-3):
#     nx, ny, nz = abs(normal.X()), abs(normal.Y()), abs(normal.Z())
#     if nz > nx and nz > ny:
#         return "XY Plane", "Z Axis", "-Z Axis"
#     elif ny > nx and ny > nz:
#         return "XZ Plane", "Y Axis", "-Y Axis"
#     elif nx > ny and nx > nz:
#         return "YZ Plane", "X Axis", "-X Axis"
#     else:
#         return "Unknown", "Unknown", "Unknown"
#
#
# # --------------------------------------------------------
# # Helper: Compute volume and bounding box
# # --------------------------------------------------------
# def get_volume_and_bbox(part):
#     bb = part.val().BoundingBox()
#     props = GProp_GProps()
#     BRepGProp.VolumeProperties_s(part.val().wrapped, props)
#     vol = props.Mass()
#     bbox_dims = (bb.xlen, bb.ylen, bb.zlen)
#     return vol, bbox_dims
#
#
# # --------------------------------------------------------
# # Step 1: Align to origin using principal axes
# # --------------------------------------------------------
# def align_part_to_origin(part):
#     props = GProp_GProps()
#     BRepGProp.VolumeProperties_s(part.val().wrapped, props)
#
#     # --- Center of mass
#     com = props.CentreOfMass()
#
#     # --- Inertia tensor
#     inertia = props.MatrixOfInertia()
#     I = np.array([
#         [inertia.Value(1,1), inertia.Value(1,2), inertia.Value(1,3)],
#         [inertia.Value(2,1), inertia.Value(2,2), inertia.Value(2,3)],
#         [inertia.Value(3,1), inertia.Value(3,2), inertia.Value(3,3)]
#     ])
#
#     eigvals, eigvecs = np.linalg.eigh(I)
#     eigvecs = eigvecs / np.linalg.norm(eigvecs, axis=0)
#
#     # --- Transformation
#     trsf = gp_Trsf()
#     trsf.SetTranslation(gp_Vec(-com.X(), -com.Y(), -com.Z()))
#
#     dir_x = gp_Dir(*eigvecs[:, 0])
#     dir_y = gp_Dir(*eigvecs[:, 1])
#     dir_z = gp_Dir(*eigvecs[:, 2])
#     local_cs = gp_Ax3(gp_Pnt(0, 0, 0), dir_z, dir_x)
#     trsf.SetTransformation(local_cs)
#
#     location = TopLoc_Location(trsf)
#     aligned_shape = part.val().wrapped.Moved(location)
#     aligned_part = cq.Workplane("XY").newObject([cq.Shape(aligned_shape)])
#
#     # --- Move bounding box center to origin
#     bb = aligned_part.val().BoundingBox()
#     center = (
#         (bb.xmin + bb.xmax) / 2,
#         (bb.ymin + bb.ymax) / 2,
#         (bb.zmin + bb.zmax) / 2,
#     )
#     aligned_part = aligned_part.translate((-center[0], -center[1], -center[2]))
#     return aligned_part
#
#
# # --------------------------------------------------------
# # Step 2: Find largest planar face and its plane orientation
#
# # --------------------------------------------------------
#
#
# def find_largest_planar_face_with_parallel_faces(part):
#     faces = part.val().Faces()
#
#     largest_face = None
#     max_area = 0
#     normal = None
#     plane_type = normal_axis = opposite_axis = None
#
#     # --- Step 1: Find largest planar face
#     for face in faces:
#         surf = BRep_Tool.Surface_s(face.wrapped)
#         if isinstance(surf, Geom_Plane):
#             props = GProp_GProps()
#             BRepGProp.SurfaceProperties_s(face.wrapped, props)
#             area = props.Mass()
#
#             if area > max_area:
#                 max_area = area
#                 largest_face = face
#                 normal = surf.Axis().Direction()
#                 plane_type, normal_axis, opposite_axis = classify_plane(normal)
#
#     if largest_face is None:
#         print("❌ No planar faces found.")
#         return
#
#     print(f"✅ Largest planar face:")
#     print(f"📏 Area = {max_area:.2f} mm²")
#     print(f"📐 Lies on {plane_type}")
#     print(f"🧭 Normal = {normal_axis}, Opposite = {opposite_axis}")
#
#     # --- Step 2: Find all parallel faces along same plane
#     parallel_faces = []
#     for face in faces:
#         if face == largest_face:
#             continue
#         surf = BRep_Tool.Surface_s(face.wrapped)
#         if isinstance(surf, Geom_Plane):
#             dir_other = surf.Axis().Direction()
#             dot = normal.Dot(dir_other)
#             # Consider faces parallel if their normals are same or opposite
#             if abs(abs(dot) - 1.0) < 1e-3:
#                 parallel_faces.append(face)
#
#     print(f"\n🔍 Found {len(parallel_faces)} faces parallel to the largest face.")
#
#     # --- Step 3: Compute distance from largest face to each parallel face
#     distances = []
#     for idx, face in enumerate(parallel_faces, 1):
#         dist_calc = BRepExtrema_DistShapeShape(largest_face.wrapped, face.wrapped)
#         dist_calc.Perform()
#         if dist_calc.IsDone():
#             distance = dist_calc.Value()
#             distances.append((idx, distance))
#             print(f"   ↳ Face {idx}: Distance = {distance:.3f} mm")
#         else:
#             print(f"   ⚠️ Face {idx}: Distance calculation failed.")
#
#     if not distances:
#         print("⚠️ No valid distances calculated between faces.")
#     else:
#         sorted_dist = sorted(distances, key=lambda x: x[1])
#         print("\n📊 Distance summary (sorted):")
#         for idx, d in sorted_dist:
#             print(f"   • Face {idx}: {d:.3f} mm away from largest face")
#
#     print("-----------------------------------------------------")
#
#
# def find_largest_planar_face(part):
#     faces = part.val().Faces()
#
#     largest_face = None
#     max_area = 0
#     plane_type = normal_axis = opposite_axis = None
#     normal = None
#
#     for face in faces:
#         surf = BRep_Tool.Surface_s(face.wrapped)
#         if isinstance(surf, Geom_Plane):
#             props = GProp_GProps()
#             BRepGProp.SurfaceProperties_s(face.wrapped, props)
#             area = props.Mass()
#
#             if area > max_area:
#                 max_area = area
#                 largest_face = face
#                 normal = surf.Axis().Direction()
#                 plane_type, normal_axis, opposite_axis = classify_plane(normal)
#
#     if largest_face is None:
#         print("❌ No planar faces found.")
#         return
#
#     print(f"✅ Largest planar face:")
#     print(f"📏 Area = {max_area:.2f} mm²")
#     print(f"📐 Lies on {plane_type}")
#     print(f"🧭 Normal = {normal_axis}, Opposite = {opposite_axis}")
#
#     # Find opposite parallel face
#     min_distance = None
#     for face in faces:
#         if face == largest_face:
#             continue
#         surf = BRep_Tool.Surface_s(face.wrapped)
#         if isinstance(surf, Geom_Plane):
#             dir_other = surf.Axis().Direction()
#             dot = normal.Dot(dir_other)
#             if abs(abs(dot) - 1.0) < 1e-3 and dot < 0:
#                 dist_calc = BRepExtrema_DistShapeShape(largest_face.wrapped, face.wrapped)
#                 dist_calc.Perform()
#                 if dist_calc.IsDone():
#                     distance = dist_calc.Value()
#                     if min_distance is None or distance < min_distance:
#                         min_distance = distance
#
#     if min_distance:
#         print(f"📏 Estimated thickness between faces: {min_distance:.3f} mm")
#     else:
#         print("⚠️ Opposite parallel face not clearly found.")
#
#
# # --------------------------------------------------------
# # Main execution
# # --------------------------------------------------------
# if __name__ == "__main__":
#     step_path = "stepfiles/Sheet Metal Part 1.stp"  # Replace this path
#
#     if not os.path.exists(step_path):
#         raise FileNotFoundError(f"File not found: {step_path}")
#
#     print("\n================= ORIGINAL PART =================")
#     part = cq.importers.importStep(step_path)
#     vol, bbox_dims = get_volume_and_bbox(part)
#     print(f"📦 Bounding Box (X,Y,Z): {bbox_dims}")
#     print(f"📐 Volume: {vol:.3f} mm³")
#
#     print("\n================= ALIGNING TO ORIGIN =================")
#     aligned_part = align_part_to_origin(part)
#     vol_aligned, bbox_dims_aligned = get_volume_and_bbox(aligned_part)
#     print(f"📦 Aligned Bounding Box (X,Y,Z): {bbox_dims_aligned}")
#     print(f"📐 Aligned Volume: {vol_aligned:.3f} mm³")
#
#     print("\n================= LARGEST FACE (ORIGINAL) =================")
#     # find_largest_planar_face(part)
#     find_largest_planar_face_with_parallel_faces(part)
#
#     print("\n================= LARGEST FACE (ALIGNED) =================")
#     # find_largest_planar_face(aligned_part)
#     find_largest_planar_face_with_parallel_faces(aligned_part)
