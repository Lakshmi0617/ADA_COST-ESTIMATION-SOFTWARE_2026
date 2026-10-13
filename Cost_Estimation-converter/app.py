import json
import math
import subprocess
import uuid
from collections import defaultdict
from datetime import datetime
import concurrent.futures
from typing import List

import numpy as np

from flask import Flask, request, send_from_directory, jsonify, after_this_request
from flask_cors import CORS
import os
import time
import tempfile

from sqlalchemy.orm import Session
from werkzeug.utils import secure_filename

import model
from model import Base,Sheet_metal_Materials

from db import get_db, engine, SessionLocal
from flasgger import Swagger
import cadquery as cq

import trimesh
import FreeCAD, Part, Mesh


import numpy as np

# --- Configuration ---
UPLOAD_FOLDER = 'input'
OUTPUT_FOLDER = 'output'
ALLOWED_EXTENSIONS = {'step', 'stp','stl','igs', 'iges'}




app = Flask(__name__)
swagger = Swagger(app)
CORS(app) # Enable CORS for all routes


# Ensure input and output directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS




# for colour change




def obj_to_glb_bytes(obj_path: str) -> bytes:
    """Convert OBJ → GLB with materials (in-memory)"""
    mesh = trimesh.load(obj_path, process=False, maintain_order=True)

    # ✅ Preserve materials and colors
    return mesh.export(
        file_type='glb',
        include_normals=True
    )


def obj_to_draco_bytes(obj_path: str) -> bytes:
    """Convert OBJ → Draco-compressed GLB with color preservation"""
    with tempfile.NamedTemporaryFile(suffix='.glb', delete=False) as temp_input, \
            tempfile.NamedTemporaryFile(suffix='.glb', delete=False) as temp_output:
        try:
            # ✅ Convert OBJ to GLB first with material preservation
            mesh = trimesh.load(obj_path, process=False, maintain_order=True)
            mesh.export(
                temp_input.name,
                file_type='glb',
                include_normals=True
            )

            # ✅ Compress using gltf-pipeline with Draco
            # Draco compression preserves vertex colors
            process = subprocess.run(
                ['npx', 'gltf-pipeline',
                 '-i', temp_input.name,
                 '-o', temp_output.name,
                 '--draco.compressionLevel=1'],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                timeout=300
            )

            if process.returncode != 0:
                error_msg = process.stderr.decode()
                print(f"gltf-pipeline warning: {error_msg}")
                # Still try to return the uncompressed GLB if Draco fails
                with open(temp_input.name, 'rb') as f:
                    return f.read()

            # Read and return compressed GLB with colors
            with open(temp_output.name, 'rb') as f:
                draco_bytes = f.read()

            return draco_bytes

        finally:
            # Clean up temp files
            try:
                if os.path.exists(temp_input.name):
                    os.remove(temp_input.name)
                if os.path.exists(temp_output.name):
                    os.remove(temp_output.name)
            except OSError as e:
                print(f"Warning: Could not clean temp files: {e}")


def convert_all_formats(obj_path: str):
    """Convert OBJ → (GLB, Draco) in parallel with color preservation"""
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        future_glb = executor.submit(obj_to_glb_bytes, obj_path)
        future_draco = executor.submit(obj_to_draco_bytes, obj_path)

        try:
            glb_bytes = future_glb.result(timeout=300)
            draco_bytes = future_draco.result(timeout=300)
        except concurrent.futures.TimeoutError as e:
            print(f"Conversion timeout: {e}")
            raise

    return glb_bytes, draco_bytes


def convert_iges_to_obj(input_path):
    """
    Convert IGES → OBJ using FreeCAD (no extra install needed)
    """
    try:
        shape = Part.Shape()
        shape.read(input_path)

        if shape.isNull():
            raise Exception("Invalid IGES file")

        # Convert shape → mesh
        mesh = Mesh.Mesh()
        mesh.addFacets(shape.tessellate(0.1))

        obj_path = input_path + ".obj"
        mesh.write(obj_path)

        return obj_path

    except Exception as e:
        print(f"IGES conversion failed: {e}")
        raise



@app.route('/convert-turning', methods=['POST'])
def handle_convert_turning():
    Base.metadata.create_all(bind=engine)

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    history_id = request.form.get('history_id')
    if not history_id:
        return jsonify({"error": "Missing history_id"}), 400

    if file and allowed_file(file.filename):
        original_filename = file.filename.strip()
        safe_filename = secure_filename(original_filename)

        timestamp = str(int(time.time() * 1000))
        unique_input_filename = f"{timestamp}_{safe_filename}"
        input_path = os.path.join(UPLOAD_FOLDER, unique_input_filename)

        try:
            file.save(input_path)
            print(f"File saved to: {input_path}")

            file_ext = original_filename.lower().split('.')[-1]
            conversion_input_path = input_path

            # 🔥 IGES handling
            if file_ext in ['igs', 'iges']:
                print("IGES detected → converting to OBJ")

                try:
                    conversion_input_path = convert_iges_to_obj(input_path)
                    print(f"Converted IGES → OBJ: {conversion_input_path}")
                except Exception as e:
                    return jsonify({"error": "IGES conversion failed"}), 500

            # ✅ Convert to other formats
            glb_data = None
            draco_data = None
            try:
                glb_data, draco_data = convert_all_formats(conversion_input_path)
                print("Converted to GLB and Draco formats")
            except Exception as conv_err:
                print(f"Format conversion warning: {conv_err}")

            # ✅ Read original file as bytes
            obj_data = open(input_path, 'rb').read()

            db = SessionLocal()
            try:
                # ✅ Fetch record based on provided history_id
                record = db.query(model.TurningMachiningCost).filter(
                    model.TurningMachiningCost.history_id  == history_id
                ).first()

                if record:
                    print(f"Found record with ID: {history_id}")

                    # ✅ Directly update files (no filename check)
                    record.obj_file = obj_data
                    record.glb_file = glb_data
                    record.draco_glb_file = draco_data
                    db.commit()
                    db.refresh(record)

                    response = {
                        "success": True,
                        "message": "Conversion and storage successful",
                        "model_id": record.id,
                        "formats_available": {
                            "obj": obj_data is not None,
                            "glb": glb_data is not None,
                            "draco": draco_data is not None
                        }
                    }
                    print(f"Updated record with ID: {record.id}")
                else:
                    print(f"No record found with ID: {history_id}")
                    response = {
                        "success": False,
                        "message": f"No record found with ID {history_id}"
                    }

            except Exception as db_err:
                db.rollback()
                print(f"Database update failed: {db_err}")
                raise
            finally:
                db.close()

            # ✅ Clean up temporary file
            try:
                os.remove(input_path)
                print(f"Cleaned up input file: {input_path}")
            except OSError as e:
                print(f"Error cleaning OBJ file: {e}")

            if conversion_input_path != input_path:
                try:
                    os.remove(conversion_input_path)
                    print(f"Cleaned OBJ file: {conversion_input_path}")
                except OSError as e:
                    print(f"Error cleaning OBJ file: {e}")

            return jsonify(response)

        except Exception as e:
            print(f"An error occurred: {e}")
            if os.path.exists(input_path):
                try:
                    os.remove(input_path)
                    print(f"Cleaned up input file after exception: {input_path}")
                except OSError as oe:
                    print(f"Error removing file {input_path}: {oe}")
            return jsonify({"error": "An internal server error occurred"}), 500

    else:
        return jsonify({"error": "File type not allowed"}), 400


@app.route('/convert-milling', methods=['POST'])
def handle_convert_milling():
    Base.metadata.create_all(bind=engine)

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # ✅ Get history_id from form data
    history_id = request.form.get('history_id')
    if not history_id:
        return jsonify({"error": "Missing history_id"}), 400

    if file and allowed_file(file.filename):
        original_filename = file.filename.strip()
        safe_filename = secure_filename(original_filename)
        print(f"Normalized uploaded filename: {safe_filename}")

        timestamp = str(int(time.time() * 1000))
        unique_input_filename = f"{timestamp}_{safe_filename}"
        input_path = os.path.join(UPLOAD_FOLDER, unique_input_filename)

        try:
            # ✅ Save uploaded file temporarily
            file.save(input_path)
            print(f"File saved to: {input_path}")

            # ✅ Convert to GLB and Draco
            glb_data = None
            draco_data = None
            file_ext = original_filename.lower().split('.')[-1]

            conversion_input_path = input_path

            # 🔥 Only for IGES
            if file_ext in ['igs', 'iges']:
                print("IGES detected → converting to OBJ")

                try:
                    conversion_input_path = convert_iges_to_obj(input_path)
                    print(f"Converted IGES → OBJ: {conversion_input_path}")
                except Exception as e:
                    return jsonify({"error": "IGES conversion failed"}), 500
            try:
                glb_data, draco_data = convert_all_formats(conversion_input_path)
                print("Converted to GLB and Draco formats")
            except Exception as conv_err:
                print(f"Format conversion warning: {conv_err}")

            obj_data = open(input_path, 'rb').read()

            db = SessionLocal()
            try:
                # ✅ Fetch record based on provided history_id
                record = (
                    db.query(model.MillingCost)
                    .filter(model.MillingCost.milling_history_id == history_id)
                    .first()
                )

                if record:
                    print(f"Found MillingCost record with history ID: {history_id}")

                    # ✅ Update the binary file columns
                    record.obj_file = obj_data
                    record.glb_file = glb_data
                    record.draco_glb_file = draco_data
                    db.commit()
                    db.refresh(record)

                    response = {
                        "success": True,
                        "message": "Milling file conversion and storage successful",
                        "milling_cost_id": record.id,
                        "history_id": record.milling_history_id,
                        "formats_available": {
                            "obj": obj_data is not None,
                            "glb": glb_data is not None,
                            "draco": draco_data is not None
                        }
                    }
                    print(f"Updated record with ID: {record.id}")
                else:
                    print(f"No record found with ID: {history_id}")
                    response = {
                        "success": False,
                        "message": f"No record found with ID {history_id}"
                    }

            except Exception as db_err:
                db.rollback()
                print(f"Database update failed: {db_err}")
                raise
            finally:
                db.close()

            # ✅ Clean up temporary input file
            try:
                os.remove(input_path)
                print(f"Cleaned up input file: {input_path}")
            except OSError as e:
                print(f"Error cleaning input file: {e}")

            if conversion_input_path != input_path:
                try:
                    os.remove(conversion_input_path)
                    print(f"Cleaned OBJ file: {conversion_input_path}")
                except OSError as e:
                    print(f"Error cleaning OBJ file: {e}")

            return jsonify(response)

        except Exception as e:
            print(f"An error occurred: {e}")
            if os.path.exists(input_path):
                try:
                    os.remove(input_path)
                    print(f"Cleaned up input file after exception: {input_path}")
                except OSError as oe:
                    print(f"Error removing file {input_path}: {oe}")
            return jsonify({"error": "An internal server error occurred"}), 500

    else:
        return jsonify({"error": "File type not allowed"}), 400









# 🔥 HELPER FUNCTION (ADDED - no existing logic removed)
def process_file(data):
    conversion_input_path = data['step_path']

    if data['file_ext'] in ['igs', 'iges']:
        conversion_input_path = convert_iges_to_obj(data['step_path'])

    elif data['file_ext'] == 'stl':
        import trimesh
        mesh = trimesh.load(data['step_path'])
        obj_path = data['step_path'] + ".obj"
        mesh.export(obj_path)
        conversion_input_path = obj_path

    glb_bytes, draco_bytes = convert_all_formats(conversion_input_path)

    with open(conversion_input_path, 'rb') as f:
        step_bytes = f.read()

    return {
        "original_filename": data['original_filename'],
        "step_bytes": step_bytes,
        "glb_bytes": glb_bytes,
        "draco_bytes": draco_bytes
    }


@app.route('/convert-sheetmetal', methods=['POST'])
def handle_convert_sheetmetal():
    Base.metadata.create_all(bind=engine)

    if 'files' not in request.files:
        return jsonify({"error": "No files part"}), 400

    files = request.files.getlist('files')

    if len(files) not in (1, 3):
        return jsonify({
            "error": "Please upload either 1 or exactly 3 files"
        }), 400

    history_id = request.form.get('history_id', type=int)
    if not history_id:
        return jsonify({"error": "History ID is required"}), 400

    analyzed_files = []
    temp_step_paths = []

    try:
        # ========================= ANALYSIS =========================
        for file in files:
            if file.filename == '':
                return jsonify({"error": "One or more files have no filename"}), 400

            if not allowed_file(file.filename):
                return jsonify({"error": "File type not allowed"}), 400

            original_filename = file.filename.strip()
            safe_filename = secure_filename(original_filename)
            file_ext = original_filename.lower().split('.')[-1]

            timestamp = str(int(time.time() * 1000))
            unique_step_filename = f"{timestamp}_{safe_filename}"
            step_path = os.path.join(UPLOAD_FOLDER, unique_step_filename)

            file.save(step_path)
            temp_step_paths.append(step_path)

            # STEP
            if file_ext in ['step', 'stp']:
                cad_model = cq.importers.importStep(step_path)
                shape = cad_model.val()
                bb = shape.BoundingBox()
                volume_mm3 = shape.Volume()

            # IGES
            elif file_ext in ['igs', 'iges']:
                shape = Part.Shape()
                shape.read(step_path)
                if shape.isNull():
                    return jsonify({"error": f"Invalid IGES file: {original_filename}"}), 400
                bb = shape.BoundBox
                volume_mm3 = shape.Volume

            # STL
            elif file_ext == 'stl':
                import trimesh
                mesh = trimesh.load(step_path)
                volume_mm3 = mesh.volume

            else:
                return jsonify({"error": "Unsupported file format"}), 400

            volume_m3 = volume_mm3 / 1e9

            analyzed_files.append({
                "original_filename": original_filename,
                "safe_filename": safe_filename,
                "step_path": step_path,
                "volume_m3": volume_m3,
                "file_ext": file_ext
            })

        # ========================= CASE 1: SINGLE FILE =========================
        if len(analyzed_files) == 1:
            data = analyzed_files[0]

            # 🔥 ONLY ONE CONVERSION (OPTIMIZED)
            result = process_file(data)

            db = SessionLocal()
            try:
                stepfile_details = model.SheetMetalStepfileDetails(
                    history_id=history_id,

                    male_obj_filename=result['original_filename'],
                    male_obj_file=result['step_bytes'],
                    male_glb_file=result['glb_bytes'],
                    male_draco_glb_file=result['draco_bytes'],

                    female_obj_filename=result['original_filename'],
                    female_obj_file=result['step_bytes'],
                    female_glb_file=result['glb_bytes'],
                    female_draco_glb_file=result['draco_bytes'],

                    parts_obj_filename=result['original_filename'],
                    parts_obj_file=result['step_bytes'],
                    parts_glb_file=result['glb_bytes'],
                    parts_draco_glb_file=result['draco_bytes'],

                    created_at=datetime.utcnow()
                )

                db.add(stepfile_details)
                db.commit()
                db.refresh(stepfile_details)

                return jsonify({
                    "success": True,
                    "message": "Single file converted (optimized)",
                    "history_id": history_id,
                    "stepfile_details_id": stepfile_details.id
                })

            finally:
                db.close()

        # ========================= CASE 2: THREE FILES =========================
        analyzed_files.sort(key=lambda r: r["volume_m3"], reverse=True)

        female_data = analyzed_files[0]
        male_data = analyzed_files[1]
        part_data = analyzed_files[2]

        # 🔥 PARALLEL PROCESSING (OPTIMIZED)
        import concurrent.futures
        with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
            results = list(executor.map(process_file, [female_data, male_data, part_data]))

        female_res, male_res, part_res = results

        conversion_results = {
            "female": female_res,
            "male": male_res,
            "part": part_res
        }

        db = SessionLocal()
        try:
            stepfile_details = model.SheetMetalStepfileDetails(
                history_id=history_id,

                male_obj_filename=conversion_results['male']['original_filename'],
                male_obj_file=conversion_results['male']['step_bytes'],
                male_glb_file=conversion_results['male']['glb_bytes'],
                male_draco_glb_file=conversion_results['male']['draco_bytes'],

                female_obj_filename=conversion_results['female']['original_filename'],
                female_obj_file=conversion_results['female']['step_bytes'],
                female_glb_file=conversion_results['female']['glb_bytes'],
                female_draco_glb_file=conversion_results['female']['draco_bytes'],

                parts_obj_filename=conversion_results['part']['original_filename'],
                parts_obj_file=conversion_results['part']['step_bytes'],
                parts_glb_file=conversion_results['part']['glb_bytes'],
                parts_draco_glb_file=conversion_results['part']['draco_bytes'],

                created_at=datetime.utcnow()
            )

            db.add(stepfile_details)
            db.commit()
            db.refresh(stepfile_details)

            return jsonify({
                "success": True,
                "message": "Conversion successful (parallel optimized)",
                "history_id": history_id,
                "stepfile_details_id": stepfile_details.id
            })

        finally:
            db.close()

    finally:
        for step_path in temp_step_paths:
            try:
                if os.path.exists(step_path):
                    os.remove(step_path)

                obj_path = step_path + ".obj"
                if os.path.exists(obj_path):
                    os.remove(obj_path)

            except OSError:
                pass
#for composites

@app.route('/convert-composites', methods=['POST'])
def handle_convert_composites():
    Base.metadata.create_all(bind=engine)

    # -------------------------------------------------
    # Validate file
    # -------------------------------------------------
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    analysis_id = request.form.get('analysis_id')
    if not analysis_id:
        return jsonify({"error": "Missing analysis_id"}), 400

    if file and allowed_file(file.filename):
        original_filename = file.filename.strip()
        safe_filename = secure_filename(original_filename)

        timestamp = str(int(time.time() * 1000))
        unique_input_filename = f"{timestamp}_{safe_filename}"
        input_path = os.path.join(UPLOAD_FOLDER, unique_input_filename)

        try:
            # -------------------------------------------------
            # Save STEP file
            # -------------------------------------------------
            file.save(input_path)
            print(f"STEP file saved to: {input_path}")

            file_ext = original_filename.lower().split('.')[-1]
            conversion_input_path = input_path

            # 🔥 IGES handling
            if file_ext in ['igs', 'iges']:
                print("IGES detected → converting to OBJ")

                try:
                    conversion_input_path = convert_iges_to_obj(input_path)
                    print(f"Converted IGES → OBJ: {conversion_input_path}")
                except Exception as e:
                    return jsonify({"error": "IGES conversion failed"}), 500

            # -------------------------------------------------
            # Convert formats
            # -------------------------------------------------
            glb_data = None
            draco_data = None
            try:
                glb_data, draco_data = convert_all_formats(conversion_input_path)
                print("Converted STEP → GLB & Draco")
            except Exception as conv_err:
                print(f"Format conversion warning: {conv_err}")

            # -------------------------------------------------
            # Read OBJ (original STEP stored as OBJ-equivalent blob)
            # -------------------------------------------------
            # obj_data = open(input_path, 'rb').read()
            obj_data = open(conversion_input_path, 'rb').read()

            db = SessionLocal()
            try:
                # -------------------------------------------------
                # Fetch existing composite step record
                # -------------------------------------------------
                record = db.query(model.CompositeStepfileDetails).filter(
                    model.CompositeStepfileDetails.analysis_id == analysis_id
                ).first()

                if record:
                    print(f"Updating existing composite stepfile for analysis_id={analysis_id}")

                    record.step_filename = original_filename
                    record.obj_file = obj_data
                    record.glb_file = glb_data
                    record.draco_glb_file = draco_data
                else:
                    print(f"Creating new composite stepfile for analysis_id={analysis_id}")

                    record = model.CompositeStepfileDetails(
                        analysis_id=analysis_id,
                        step_filename=original_filename,
                        obj_file=obj_data,
                        glb_file=glb_data,
                        draco_glb_file=draco_data
                    )
                    db.add(record)

                db.commit()
                db.refresh(record)

                response = {
                    "success": True,
                    "message": "Composite STEP conversion and storage successful",
                    "analysis_id": analysis_id,
                    "record_id": record.id,
                    "formats_available": {
                        "obj": obj_data is not None,
                        "glb": glb_data is not None,
                        "draco": draco_data is not None
                    }
                }

            except Exception as db_err:
                db.rollback()
                print(f"Database error: {db_err}")
                raise
            finally:
                db.close()

            # -------------------------------------------------
            # Cleanup temporary file
            # -------------------------------------------------
            try:
                os.remove(input_path)
                print(f"Cleaned up STEP file: {input_path}")
            except OSError as e:
                print(f"Cleanup error: {e}")

            if conversion_input_path != input_path:
                try:
                    os.remove(conversion_input_path)
                    print(f"Cleaned OBJ file: {conversion_input_path}")
                except OSError as e:
                    print(f"Cleanup error: {e}")

            return jsonify(response)

        except Exception as e:
            print(f"Unhandled error: {e}")
            if os.path.exists(input_path):
                try:
                    os.remove(input_path)
                except OSError:
                    pass
            return jsonify({"error": "Internal server error"}), 500

    else:
        return jsonify({"error": "File type not allowed"}), 400





# @app.route('/analyze-iges-freecad', methods=['POST'])
# def analyze_iges_freecad():
#     # Validate file
#     if 'file' not in request.files:
#         return jsonify({"error": "No file uploaded"}), 400

#     file = request.files['file']
#     material_id = request.form.get('material_id', type=int)
#     quantity = request.form.get('quantity', default=1, type=int)

#     if not file.filename.lower().endswith((".igs", ".iges")):
#         return jsonify({"error": "Please upload a valid IGES file (.igs or .iges)"}), 400

#     # Save file
#     unique_filename = f"{uuid.uuid4()}_{file.filename}"
#     file_path = os.path.join("uploads", unique_filename)
#     os.makedirs("uploads", exist_ok=True)

#     with open(file_path, "wb") as buffer:
#         buffer.write(file.read())

#     db = SessionLocal()

#     try:
#         # --- Fetch material ---
#         material_obj = db.query(model.Materials).filter(
#             model.Materials.id == material_id
#         ).first()

#         if not material_obj or material_obj.density is None:
#             return jsonify({"error": "Material not found or invalid density"}), 404

#         density = material_obj.density
#         material_name = material_obj.material.strip()

#         # --- FreeCAD IGES Analysis ---
#         try:
#             shape = Part.Shape()
#             shape.read(file_path)

#             if shape.isNull():
#                 raise Exception("Failed to read IGES file or file is empty")

#             bbox = shape.BoundBox

#             x_dim = bbox.XLength
#             y_dim = bbox.YLength
#             z_dim = bbox.ZLength

#             dims_sorted = sorted(
#                 [(x_dim, 'X'), (y_dim, 'Y'), (z_dim, 'Z')],
#                 reverse=True,
#                 key=lambda x: x[0]
#             )

#             length, breadth, height = dims_sorted[0][0], dims_sorted[1][0], dims_sorted[2][0]

#             volume_mm3 = shape.Volume
#             volume_m3 = volume_mm3 / 1e9

#             # --- Stock sizing ---
#             def round_to_nearest(value, base):
#                 return int(base * round(float(value) / base))

#             def get_raw_extra(L, B, H):
#                 if L <= 50: delta_L = 20
#                 elif L <= 100: delta_L = 30
#                 elif L <= 200: delta_L = 30
#                 elif L <= 500: delta_L = 50
#                 elif L <= 1000: delta_L = 100
#                 elif L <= 2000: delta_L = 100
#                 else: delta_L = 100

#                 if B <= 50: delta_B = 20
#                 elif B <= 100: delta_B = 30
#                 elif B <= 200: delta_B = 30
#                 elif B <= 500: delta_B = 50
#                 elif B <= 1000: delta_B = 100
#                 elif B <= 2000: delta_B = 100
#                 else: delta_B = 100

#                 if H <= 50: delta_H = 5
#                 elif H <= 100: delta_H = 5
#                 elif H <= 200: delta_H = 5
#                 elif H <= 500: delta_H = 10
#                 elif H <= 1000: delta_H = 10
#                 elif H <= 2000: delta_H = 10
#                 else: delta_H = 10

#                 return delta_L, delta_B, delta_H

#             delta_X, delta_Y, delta_Z = get_raw_extra(length, breadth, height)

#             stock_L = round_to_nearest(length + delta_X, 10)
#             stock_B = round_to_nearest(breadth + delta_Y, 10)
#             stock_H = round_to_nearest(height + delta_Z, 5)

#             stock_volume_mm3 = stock_L * stock_B * stock_H
#             stock_volume_m3 = stock_volume_mm3 / 1e9

#             # --- Store in DB ---
#             history = model.MillingHistoryDetails(
#                 filename=file.filename,
#                 material_id=material_id,
#                 material_name=material_name,
#                 density=density,
#                 quantity=quantity,
#                 actual_length=round(length, 2),
#                 actual_breadth=round(breadth, 2),
#                 actual_height=round(height, 2),
#                 actual_volume_mm3=round(volume_mm3),
#                 actual_volume_m3=round(volume_m3, 10),
#                 stock_length=stock_L,
#                 stock_breadth=stock_B,
#                 stock_height=stock_H,
#                 stock_volume_mm3=round(stock_volume_mm3),
#                 stock_volume_m3=round(stock_volume_m3, 10),
#                 delta_x=delta_X,
#                 delta_y=delta_Y,
#                 delta_z=delta_Z,
#             )

#             db.add(history)
#             db.commit()
#             db.refresh(history)

#             print(f"IGES analysis completed for {file.filename}")

#             return jsonify({
#                 "id": history.id,
#                 "filename": file.filename,
#                 "material_id": material_id,
#                 "material_name": material_name,
#                 "density": density,
#                 "quantity": quantity,
#                 "file_type": "IGES",
#                 "analysis_type": "freecad_part_shape",
#                 "actual_dimensions": {
#                     "length": round(length, 2),
#                     "breadth": round(breadth, 2),
#                     "height": round(height, 2),
#                     "volume_mm3": round(volume_mm3),
#                     "volume_m3": round(volume_m3, 10)
#                 },
#                 "stock_dimensions": {
#                     "length": stock_L,
#                     "breadth": stock_B,
#                     "height": stock_H,
#                     "volume_mm3": round(stock_volume_mm3),
#                     "volume_m3": round(stock_volume_m3, 10)
#                 },
#                 "raw_extra": {
#                     "delta_X": delta_X,
#                     "delta_Y": delta_Y,
#                     "delta_Z": delta_Z
#                 }
#             })

#         except Exception as e:
#             print(f"Error analyzing IGES file: {e}")
#             return jsonify({"error": f"Failed to analyze IGES file: {str(e)}"}), 500

#     finally:
#         db.close()
#         try:
#             os.remove(file_path)
#         except:
#             pass


# @app.route('/bounding-box-iges', methods=['POST'])
# def get_bounding_box_iges():
#     # ---- Validate file ----
#     if 'file' not in request.files:
#         return jsonify({"error": "No file uploaded"}), 400

#     file = request.files['file']
#     material_id = request.form.get('material_id', type=int)

#     if not file.filename.lower().endswith((".igs", ".iges")):
#         return jsonify({"error": "Please upload IGES file"}), 400

#     # ---- Save file ----
#     unique_filename = f"{uuid.uuid4()}_{file.filename}"
#     file_path = os.path.join("uploads", unique_filename)
#     os.makedirs("uploads", exist_ok=True)

#     file.save(file_path)

#     db = SessionLocal()

#     try:
#         # ---- IGES Processing (FreeCAD) ----
#         shape = Part.Shape()
#         shape.read(file_path)

#         if shape.isNull():
#             return jsonify({"error": "Invalid IGES file"}), 400

#         bbox = shape.BoundBox

#         x_dim = bbox.XLength
#         y_dim = bbox.YLength
#         z_dim = bbox.ZLength

#         dims_sorted = sorted(
#             [(x_dim, "X"), (y_dim, "Y"), (z_dim, "Z")],
#             reverse=True,
#             key=lambda x: x[0]
#         )

#         length, breadth, height = (
#             round(dims_sorted[0][0], 2),
#             round(dims_sorted[1][0], 2),
#             round(dims_sorted[2][0], 2),
#         )

#         # ---- Volume ----
#         volume_mm3 = round(shape.Volume, 2)
#         volume_m3 = round(volume_mm3 / 1e9, 10)

#         # ---- Fetch Material ----
#         material = db.query(model.TurningMaterials).filter(
#             model.TurningMaterials.id == material_id
#         ).first()

#         if not material:
#             return jsonify({"error": f"Material with id {material_id} not found"}), 404

#         # ---- Derived parameters ----
#         diameter = None
#         axis_length = None

#         if length == breadth or length == height:
#             diameter = length
#             axis_length = breadth if length == height else height
#         elif breadth == height:
#             diameter = breadth
#             axis_length = length
#         else:
#             threshold = 20
#             diffs = [
#                 (abs(length - breadth), (length, breadth, height)),
#                 (abs(length - height), (length, height, breadth)),
#                 (abs(breadth - height), (breadth, height, length)),
#             ]
#             close_pair = min(diffs, key=lambda x: x[0])
#             if close_pair[0] <= threshold:
#                 a, b, other = close_pair[1]
#                 diameter = max(a, b)
#                 axis_length = other

#         # ---- Stock Dimensions ----
#         diameter = math.floor(diameter + 0.5)
#         stock_length = axis_length + 50
#         stock_diameter = diameter + 10

#         # ---- Stock Volume ----
#         stock_volume_mm3 = round(math.pi * (stock_diameter ** 2) * stock_length / 4, 2)
#         stock_volume_m3 = round(stock_volume_mm3 / 1e9, 10)

#         density = material.density
#         cost_per_kg = material.material_cost

#         material_removed_m3 = stock_volume_m3 - volume_m3
#         material_removed_mm3 = stock_volume_mm3 - volume_mm3
#         stock_weight = stock_volume_m3 * density
#         actual_mass = volume_m3 * density
#         material_cost = stock_weight * cost_per_kg

#         # ---- Fetch Percentages ----
#         percentages = db.query(model.TurningPercentages).first()
#         if not percentages:
#             return jsonify({"error": "Percentages table is empty"}), 404

#         roughing_percentage = percentages.roughing_percentage
#         finishing_percentage = percentages.finishing_percentage

#         # ---- Fetch Parameters ----
#         all_params = db.query(model.TurningParameters).filter(
#             model.TurningParameters.material_id == material_id
#         ).all()

#         if not all_params:
#             return jsonify({"error": f"No parameters found for material {material_id}"}), 404

#         # ---- Match parameter range ----
#         selected_params = None
#         for param in all_params:
#             if "-" in param.diameter_range:
#                 low, high = map(float, param.diameter_range.split("-"))
#                 if low <= stock_diameter <= high:
#                     selected_params = param
#                     break
#             elif ">" in param.diameter_range:
#                 threshold = float(param.diameter_range.replace(">", ""))
#                 if stock_diameter > threshold:
#                     selected_params = param
#                     break
#             elif "<" in param.diameter_range:
#                 threshold = float(param.diameter_range.replace("<", ""))
#                 if stock_diameter < threshold:
#                     selected_params = param
#                     break

#         if not selected_params:
#             return jsonify({
#                 "error": f"No matching parameter range for diameter {stock_diameter}"
#             }), 400

#         # ---- MRR ----
#         roughing_mrr_mm3_min = (
#             selected_params.roughing_feed_rate *
#             selected_params.roughing_depth_of_cut *
#             selected_params.roughing_cutting_speed * 1000
#         )

#         finishing_mrr_mm3_min = (
#             selected_params.finishing_feed_rate *
#             selected_params.finishing_depth_of_cut *
#             selected_params.finishing_cutting_speed * 1000
#         )

#         # ---- Machining Time ----
#         roughing_time = ((material_removed_mm3 * (roughing_percentage / 100)) / roughing_mrr_mm3_min) / 60
#         finishing_time = (material_removed_mm3 * (finishing_percentage / 100)) / finishing_mrr_mm3_min / 60
#         machining_hours = roughing_time + finishing_time

#         # ---- Store ----
#         history = model.TurningHistoryDetails(
#             filename=file.filename,
#             length=length,
#             breadth=breadth,
#             height=height,
#             volume_mm3=volume_mm3,
#             volume_m3=volume_m3,
#             material_id=material.id,
#             material_name=material.material,
#             material_specification=material.material_specification,
#             density=material.density,
#             material_cost=material.material_cost,
#             diameter=diameter,
#             axis_length=axis_length,
#             stock_length=stock_length,
#             stock_diameter=stock_diameter,
#             stock_volume_mm3=stock_volume_mm3,
#             stock_volume_m3=stock_volume_m3,
#             material_removed_m3=material_removed_m3,
#             stock_weight_kg=stock_weight,
#             Material_cost=material_cost,
#             roughing_mrr=roughing_mrr_mm3_min,
#             finishing_mrr=finishing_mrr_mm3_min,
#             roughing_time=roughing_time,
#             finishing_time=finishing_time,
#             machining_hours=machining_hours,
#             diameter_range=selected_params.diameter_range,
#             roughing_depth_of_cut=selected_params.roughing_depth_of_cut,
#             roughing_feed_rate=selected_params.roughing_feed_rate,
#             roughing_cutting_speed=selected_params.roughing_cutting_speed,
#             finishing_depth_of_cut=selected_params.finishing_depth_of_cut,
#             finishing_feed_rate=selected_params.finishing_feed_rate,
#             finishing_cutting_speed=selected_params.finishing_cutting_speed,
#         )

#         db.add(history)
#         db.commit()
#         db.refresh(history)


#         return jsonify({
#             "id": history.id,  # ✅ Return the history ID
#             "filename": file.filename,
#             "bounding_box": {
#                 "length": length,
#                 "breadth": breadth,
#                 "height": height,
#             },
#             "volume": {
#                 "mm3": volume_mm3,
#                 "m3": volume_m3,
#                 "actual_mass": actual_mass
#             },
#             "material": {
#                 "id": material.id,
#                 "name": material.material,
#                 "specification": material.material_specification,
#                 "density": material.density,
#                 "material_cost": material.material_cost
#             },
#             "derived_parameters": {
#                 "diameter": diameter,
#                 "axis_length": axis_length,
#             },
#             "stock": {
#                 "stock_length": stock_length,
#                 "stock_diameter": stock_diameter,
#                 "stock_volume_mm3": stock_volume_mm3,
#                 "stock_volume_m3": stock_volume_m3,
#                 "material_removed_m3": material_removed_m3,
#                 "stock_weight_kg": stock_weight,
#                 "Material_cost": material_cost
#             },
#             "machining": {
#                 "roughing_mrr": roughing_mrr_mm3_min,
#                 "finishing_mrr": finishing_mrr_mm3_min,
#                 "roughing_time": roughing_time,
#                 "finishing_time": finishing_time,
#                 "machining_hours": machining_hours
#             },
#             "selected_parameters": {
#                 "diameter_range": selected_params.diameter_range,
#                 "roughing_depth_of_cut": selected_params.roughing_depth_of_cut,
#                 "roughing_feed_rate": selected_params.roughing_feed_rate,
#                 "roughing_cutting_speed": selected_params.roughing_cutting_speed,
#                 "finishing_depth_of_cut": selected_params.finishing_depth_of_cut,
#                 "finishing_feed_rate": selected_params.finishing_feed_rate,
#                 "finishing_cutting_speed": selected_params.finishing_cutting_speed,
#             }
#         })

#     except Exception as e:
#         return jsonify({"error": f"Error processing IGES file: {str(e)}"}), 500

#     finally:
#         db.close()
#         if os.path.exists(file_path):
#             os.remove(file_path)






# @app.route('/analyze-iges-sheetmetal', methods=['POST'])
# def analyze_iges_sheetmetal():

#     # ---- Validate files ----
#     files = request.files.getlist("files")

#     if not files:
#         return jsonify({"error": "No files uploaded"}), 400

#     material_id = request.form.get('material_id', type=int)
#     quantity = request.form.get('quantity', default=1, type=int)

#     db = SessionLocal()

#     try:
#         # ---- Fetch Material ----
#         material = db.query(model.Sheet_metal_Materials).filter(
#             model.Sheet_metal_Materials.id == material_id
#         ).first()

#         if not material or material.density is None:
#             return jsonify({"error": "Invalid material"}), 404

#         material_name = material.material.strip()
#         material_density = material.density
#         material_cost = material.material_cost

#         # =====================================================
#         # CASE 1: SINGLE FILE
#         # =====================================================
#         if len(files) == 1:
#             file = files[0]

#             if not file.filename.lower().endswith((".igs", ".iges")):
#                 return jsonify({"error": "Upload IGES file"}), 400

#             unique_filename = f"{uuid.uuid4()}_{file.filename}"
#             file_path = os.path.join("uploads", unique_filename)
#             os.makedirs("uploads", exist_ok=True)

#             file.save(file_path)

#             try:
#                 # ---- IGES Processing ----
#                 shape = Part.Shape()
#                 shape.read(file_path)

#                 if shape.isNull():
#                     return jsonify({"error": "Invalid IGES file"}), 400

#                 bb = shape.BoundBox

#                 x_dim = bb.XLength
#                 y_dim = bb.YLength
#                 z_dim = bb.ZLength

#                 dims_sorted = sorted(
#                     [(x_dim, 'X'), (y_dim, 'Y'), (z_dim, 'Z')],
#                     reverse=True,
#                     key=lambda x: x[0]
#                 )

#                 length = dims_sorted[0][0]
#                 breadth = dims_sorted[1][0]
#                 height = dims_sorted[2][0]

#                 part_volume_mm3 = shape.Volume
#                 part_volume_m3 = part_volume_mm3 / 1e9

#                 # ---- TOOL LOGIC ----
#                 TOOL_HEIGHT = 50
#                 TOOL_FACTOR = 0.7

#                 length = int(round(length, 2))
#                 breadth = int(round(breadth, 2))

#                 tool_volume_mm3 = length * breadth * TOOL_HEIGHT * TOOL_FACTOR
#                 tool_volume_m3 = tool_volume_mm3 / 1e9

#                 part_simple = {
#                     "filename": file.filename,
#                     "length": round(length, 2),
#                     "breadth": round(breadth, 2),
#                     "height": round(height, 2),
#                     "volume_mm3": round(part_volume_mm3, 2),
#                     "volume_m3": round(part_volume_m3, 10)
#                 }

#                 male_tool_simple = {
#                     "filename": file.filename,
#                     "length": round(length, 3),
#                     "breadth": round(breadth, 3),
#                     "height": TOOL_HEIGHT,
#                     "volume_mm3": round(tool_volume_mm3, 2),
#                     "volume_m3": round(tool_volume_m3, 10)
#                 }

#                 female_tool_simple = {
#                     "filename": file.filename,
#                     "length": round(length, 2),
#                     "breadth": round(breadth, 2),
#                     "height": TOOL_HEIGHT,
#                     "volume_mm3": round(tool_volume_mm3, 2),
#                     "volume_m3": round(tool_volume_m3, 10)
#                 }

#                 history = model.SheetMetalHistory(
#                     filename_female=file.filename,
#                     filename_male=file.filename,
#                     filename_part=file.filename,
#                     female_tool=female_tool_simple,
#                     male_tool=male_tool_simple,
#                     part=part_simple,
#                     material_id=material_id,
#                     material_name=material_name,
#                     material_density=material_density,
#                     material_cost=material_cost,
#                     quantity=quantity,
#                     created_at=datetime.utcnow()
#                 )

#                 db.add(history)
#                 db.commit()
#                 db.refresh(history)

#                 return jsonify({
#                     "history_id": history.id,
#                     "material": {
#                         "id": material_id,
#                         "name": material_name,
#                         "density": material_density,
#                         "cost": material_cost
#                     },
#                     "quantity": quantity,
#                     "part": part_simple,
#                     "male_tool": male_tool_simple,
#                     "female_tool": female_tool_simple
#                 })

#             finally:
#                 if os.path.exists(file_path):
#                     os.remove(file_path)

#         # =====================================================
#         # CASE 2: THREE FILES
#         # =====================================================
#         if len(files) != 3:
#             return jsonify({
#                 "error": "Upload either 1 or exactly 3 IGES files"
#             }), 400

#         analyzed = []

#         for file in files:

#             if not file.filename.lower().endswith((".igs", ".iges")):
#                 return jsonify({"error": "Only IGES files allowed"}), 400

#             unique_filename = f"{uuid.uuid4()}_{file.filename}"
#             file_path = os.path.join("uploads", unique_filename)
#             os.makedirs("uploads", exist_ok=True)

#             file.save(file_path)

#             try:
#                 shape = Part.Shape()
#                 shape.read(file_path)

#                 if shape.isNull():
#                     return jsonify({"error": f"Invalid file: {file.filename}"}), 400

#                 bb = shape.BoundBox

#                 x_dim = bb.XLength
#                 y_dim = bb.YLength
#                 z_dim = bb.ZLength

#                 volume_mm3 = shape.Volume

#                 analyzed.append({
#                     "filename": file.filename,
#                     "length": x_dim,
#                     "breadth": y_dim,
#                     "height": z_dim,
#                     "volume_mm3": volume_mm3,
#                     "volume_m3": volume_mm3 / 1e9
#                 })

#             finally:
#                 if os.path.exists(file_path):
#                     os.remove(file_path)

#         analyzed.sort(key=lambda r: r["volume_m3"], reverse=True)

#         female_tool = analyzed[0]
#         male_tool = analyzed[1]
#         part = analyzed[2]

#         def simplify(tool):
#             return {
#                 "filename": tool["filename"],
#                 "length": round(tool["length"], 2),
#                 "breadth": round(tool["breadth"], 2),
#                 "height": round(tool["height"], 2),
#                 "volume_mm3": round(tool["volume_mm3"]),
#                 "volume_m3": round(tool["volume_m3"], 10)
#             }

#         female_tool_simple = simplify(female_tool)
#         male_tool_simple = simplify(male_tool)
#         part_simple = simplify(part)

#         history = model.SheetMetalHistory(
#             filename_female=female_tool["filename"],
#             filename_male=male_tool["filename"],
#             filename_part=part["filename"],
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

#         db.add(history)
#         db.commit()
#         db.refresh(history)

#         return jsonify({
#             "history_id": history.id,
#             "material": {
#                 "id": material_id,
#                 "name": material_name,
#                 "density": material_density,
#                 "cost": material_cost
#             },
#             "quantity": quantity,
#             "female_tool": female_tool_simple,
#             "male_tool": male_tool_simple,
#             "part": part_simple
#         })

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

#     finally:
#         db.close()
# #----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# # didnt fetch surface area for some iges files


# @app.route('/analyze-iges-composites', methods=['POST'])
# def analyze_iges_composites():

#     file = request.files.get("file")
#     material_id = request.form.get("material_id", type=int)

#     if not file:
#         return jsonify({"error": "No file uploaded"}), 400

#     if not file.filename.lower().endswith((".igs", ".iges")):
#         return jsonify({"error": "Upload IGES file"}), 400

#     db = SessionLocal()

#     try:
#         # =================================================
#         # 1. Fetch prepreg material
#         # =================================================
#         prepreg = db.query(model.CompositesPrepregCost).filter(
#             model.CompositesPrepregCost.id == material_id
#         ).first()

#         if not prepreg:
#             return jsonify({"error": f"Prepreg material with id={material_id} not found"}), 404

#         # =================================================
#         # 2. Save file
#         # =================================================
#         unique_filename = f"{uuid.uuid4()}_{file.filename}"
#         file_path = os.path.join("uploads", unique_filename)

#         os.makedirs("uploads", exist_ok=True)
#         file.save(file_path)

#         try:
#             # =================================================
#             # 3. LOAD IGES USING FREECAD
#             # =================================================
#             shape = Part.Shape()
#             shape.read(file_path)

#             if shape.isNull():
#                 return jsonify({"error": "Invalid IGES file"}), 400

#             solids = shape.Solids

#             if not solids:
#                 return jsonify({"error": "No solids found in IGES file"}), 400

#             solid = solids[0]
#             faces = solid.Faces

#             if not faces:
#                 return jsonify({"error": "No faces found in IGES file"}), 400

#             # =================================================
#             # PART A: THICKNESS
#             # =================================================
#             clusters = defaultdict(list)

#             for f in faces:
#                 try:
#                     n = f.normalAt(0, 0)
#                     v = np.array([n.x, n.y, n.z])
#                     v /= np.linalg.norm(v)
#                     key = tuple(np.round(v, 2))
#                     clusters[key].append(f)
#                 except:
#                     pass

#             if len(clusters) < 2:
#                 return jsonify({"error": "Unable to cluster shell faces"}), 400

#             cluster_list = []
#             for k, fs in clusters.items():
#                 area = sum(f.Area for f in fs)
#                 cluster_list.append((k, fs, area))

#             cluster_list.sort(key=lambda x: x[2], reverse=True)

#             outer_key, outer_faces, _ = cluster_list[0]

#             inner_faces = None
#             for k, fs, _ in cluster_list[1:]:
#                 if np.dot(np.array(k), np.array(outer_key)) < -0.9:
#                     inner_faces = fs
#                     break

#             if not inner_faces:
#                 return jsonify({"error": "Inner shell not detected"}), 400

#             n = np.array(outer_key)
#             n /= np.linalg.norm(n)

#             outer_proj = [
#                 np.dot([f.CenterOfMass.x, f.CenterOfMass.y, f.CenterOfMass.z], n)
#                 for f in outer_faces
#             ]

#             inner_proj = [
#                 np.dot([f.CenterOfMass.x, f.CenterOfMass.y, f.CenterOfMass.z], n)
#                 for f in inner_faces
#             ]

#             geometric_thickness_mm = round(abs(np.mean(outer_proj) - np.mean(inner_proj)), 3)

#             # =================================================
#             # PART B: SURFACE AREA
#             # =================================================
#             bb = shape.BoundBox

#             face_centers = []
#             face_data = []

#             for face in faces:
#                 area_mm2 = face.Area
#                 c = face.CenterOfMass
#                 center = np.array([c.x, c.y, c.z])

#                 # n = face.normalAt(0, 0)
#                 # normal = np.array([n.x, n.y, n.z])
#                 # normal /= np.linalg.norm(normal)
#                 #
#                 # face_centers.append(center)
#                 # face_data.append((center, normal, area_mm2))
#                 try:
#                     n = face.normalAt(0, 0)
#                     normal = np.array([n.x, n.y, n.z])

#                     norm_val = np.linalg.norm(normal)
#                     if norm_val == 0:
#                         continue

#                     normal = normal / norm_val

#                     face_centers.append(center)
#                     face_data.append((center, normal, area_mm2))

#                 except Exception as e:
#                     print(f"⚠️ normalAt failed for a face: {e}")
#                     continue

#             part_center = np.mean(face_centers, axis=0)

#             inner_area_mm2 = 0.0

#             for center, normal, area in face_data:
#                 if np.dot(normal, center - part_center) < 0:
#                     inner_area_mm2 += area

#             ply_area_m2 = round(inner_area_mm2 / 1e6, 3)

#             raw_dims = [
#                 round(bb.XLength, 2),
#                 round(bb.YLength, 2),
#                 round(bb.ZLength, 2)
#             ]

#             raw_dims_sorted = sorted(raw_dims, reverse=True)

#             global_length = raw_dims_sorted[0]
#             global_width = raw_dims_sorted[1]
#             global_height = raw_dims_sorted[2]

#             # =================================================
#             # REMAINING LOGIC (UNCHANGED)
#             # =================================================
#             stock_length = global_length + 100
#             stock_width = global_width + 100
#             stock_height = global_height

#             number_of_layers = geometric_thickness_mm / prepreg.thickness_mm
#             total_surface_area_m2 = number_of_layers * ply_area_m2

#             volume_of_part_m3 = (geometric_thickness_mm * ply_area_m2) / 1000
#             mass_in_kg = prepreg.density_kg_m3 * volume_of_part_m3

#             volume_of_composite_tool_in_m3 = (
#                 stock_length * stock_width * stock_height
#             ) / 1000000000

#             master_tool = db.query(model.MasterToolCost).first()

#             if not master_tool:
#                 return jsonify({"error": "Master tool cost table is empty"}), 404

#             Tool_Stock_weight_Kg = (
#                 master_tool.epoxy_block_density * volume_of_composite_tool_in_m3
#             )

#             # =================================================
#             # SAVE TO DB
#             # =================================================
#             analysis_row = model.CompositeAnalysisResult(
#                 filename=file.filename,
#                 prepreg_material_id=prepreg.id,
#                 material=prepreg.material,
#                 spec=prepreg.spec,

#                 density_kg_m3=float(prepreg.density_kg_m3),
#                 design_thickness_mm=float(prepreg.thickness_mm),
#                 prepreg_cost_per_kg=float(prepreg.prepreg_cost_per_kg),

#                 stock_length_mm=float(stock_length),
#                 stock_width_mm=float(stock_width),
#                 stock_height_mm=float(stock_height),

#                 geometric_thickness_mm=float(geometric_thickness_mm),
#                 one_ply_surface_area_m2=float(ply_area_m2),

#                 number_of_layers=float(number_of_layers),
#                 total_surface_area_m2=float(total_surface_area_m2),

#                 volume_of_part_m3=float(volume_of_part_m3),
#                 mass_in_kg=float(mass_in_kg),

#                 volume_of_composite_tool_in_m3=float(volume_of_composite_tool_in_m3),
#                 tool_stock_weight_kg=float(Tool_Stock_weight_Kg)
#             )

#             db.add(analysis_row)
#             db.commit()
#             db.refresh(analysis_row)

#             # =================================================
#             # RESPONSE (EXACT SAME AS STEP)
#             # =================================================
#             return jsonify({
#                 "filename": file.filename,

#                 "material": {
#                     "id": prepreg.id,
#                     "material": prepreg.material,
#                     "spec": prepreg.spec,
#                     "density_kg_m3": prepreg.density_kg_m3,
#                     "design_thickness_mm": prepreg.thickness_mm,
#                     "prepreg_cost_per_kg": prepreg.prepreg_cost_per_kg
#                 },

#                 "geometry": {
#                     "global_dimensions_mm": {
#                         "length": global_length,
#                         "width": global_width,
#                         "height": global_height
#                     },
#                     "stock_dimensions_mm": {
#                         "stock_length": stock_length,
#                         "stock_width": stock_width,
#                         "stock_height": stock_height
#                     },
#                     "geometric_thickness_mm": geometric_thickness_mm,
#                     "one_ply_surface_area_m2": ply_area_m2
#                 },

#                 "number_of_layers": number_of_layers,
#                 "total_surface_area_m2": total_surface_area_m2,
#                 "volume_of_part_m3": volume_of_part_m3,
#                 "mass_in_kg": mass_in_kg,
#                 "volume_of_composite_tool_in_m3": volume_of_composite_tool_in_m3,
#                 "Tool_Stock_weight_Kg": Tool_Stock_weight_Kg,
#                 "analysis_id": analysis_row.id
#             })

#         finally:
#             if os.path.exists(file_path):
#                 os.remove(file_path)

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

#     finally:
#         db.close()




if __name__ == '__main__':
    # Listen on all interfaces (0.0.0.0) which is important for Docker

    app.run(host='0.0.0.0', port=5000, debug=True)# Use port 5000 commonly for Flask



# docker build -t converter .   (to build the docker image this is the command after build run the above command )

#docker run -it --rm -p 5000:5000 -v "%cd%\input:/app/input" -v "%cd%\output:/app/output" converter  (TO THE RUN THE CODE)


