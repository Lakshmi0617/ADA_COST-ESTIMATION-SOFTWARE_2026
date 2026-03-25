import cadquery as cq
from OCP.BRepGProp import BRepGProp
from OCP.GProp import GProp_GProps
from OCP.gp import gp_Pnt, gp_Trsf, gp_Vec, gp_Ax3, gp_Dir
import numpy as np

# --- Load your STEP part ---
part = cq.importers.importStep("stepfiles/Sheet Metal Part 1.stp")
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
aligned_part = part.translate((-center[0], -center[1], -center[2]))
print(bb.xlen, bb.ylen, bb.zlen)


# cq.exporters.export(aligned_part, "Assem1_aligned_1.STEP")
# print("✅ Exported aligned part to Assem1_aligned.STEP")