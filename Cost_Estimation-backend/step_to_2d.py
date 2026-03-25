from fastapi import FastAPI, UploadFile, File, HTTPException
from pathlib import Path
import shutil
import uuid

from OCC.Core.STEPControl import STEPControl_Reader
from OCC.Core.IFSelect import IFSelect_RetDone
from OCC.Core.BRepProj import BRepProj_Projection
from OCC.Core.gp import gp_Pln, gp_Dir, gp_Pnt
from OCC.Core.TopExp import TopExp_Explorer
from OCC.Core.TopAbs import TopAbs_EDGE
from OCC.Core.BRep import BRep_Tool
from OCC.Core.BRepBuilderAPI import BRepBuilderAPI_MakeEdge

app = FastAPI()

OUTPUT_DIR = Path("generated_drawings")
OUTPUT_DIR.mkdir(exist_ok=True)


@app.post("/convert-step-to-2d-diagram/")
async def convert_step_to_2d_diagram(step_file: UploadFile = File(...)):
    job_id = uuid.uuid4().hex
    work_dir = OUTPUT_DIR / job_id
    work_dir.mkdir()

    step_path = work_dir / "input.step"
    svg_path = work_dir / "drawing.svg"

    with step_path.open("wb") as f:
        shutil.copyfileobj(step_file.file, f)

    # -------------------------------
    # Load STEP
    # -------------------------------
    reader = STEPControl_Reader()
    status = reader.ReadFile(str(step_path))

    if status != IFSelect_RetDone:
        raise HTTPException(400, "Failed to read STEP file")

    reader.TransferRoots()
    shape = reader.OneShape()

    # -------------------------------
    # Projection plane (TOP view)
    # -------------------------------
    plane = gp_Pln(gp_Pnt(0, 0, 0), gp_Dir(0, 0, 1))

    proj = BRepProj_Projection(shape, plane)

    # -------------------------------
    # Write SVG manually
    # -------------------------------
    svg_lines = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-200 -200 400 400" stroke="black" fill="none">'
    ]

    exp = TopExp_Explorer(proj.Current(), TopAbs_EDGE)

    while exp.More():
        edge = exp.Current()
        curve, first, last = BRep_Tool.Curve(edge)

        p1 = curve.Value(first)
        p2 = curve.Value(last)

        svg_lines.append(
            f'<line x1="{p1.X()}" y1="{-p1.Y()}" x2="{p2.X()}" y2="{-p2.Y()}" />'
        )

        exp.Next()

    svg_lines.append("</svg>")

    svg_path.write_text("\n".join(svg_lines))


    return {
        "message": "2D diagram generated successfully",
        "output_svg": str(svg_path)
    }

#
# conda activate occ
# cd /d G:\New_ADA_Updated_Code\3dto2d
# python -m uvicorn generate:app --reload