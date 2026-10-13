from flask import Flask, request, render_template, redirect, url_for, send_from_directory
import os
import subprocess
import shutil

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'input'
app.config['OUTPUT_FOLDER'] = 'output'

@app.route('/')
def index():
    return render_template('index.html', model=None)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return redirect(request.url)
    
    file = request.files['file']
    if file.filename == '':
        return redirect(request.url)
    
    if file and (file.filename.endswith('.step') or file.filename.endswith('.stp')):
        input_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(input_path)

        # Run the Docker command to convert the file
        output_file = os.path.splitext(file.filename)[0] + '.obj'
        output_path = os.path.join(app.config['OUTPUT_FOLDER'], output_file)
        
        subprocess.run(['docker', 'run', '--rm', '-v', f"{os.getcwd()}/{app.config['UPLOAD_FOLDER']}:/app/input", 
                        '-v', f"{os.getcwd()}/{app.config['OUTPUT_FOLDER']}:/app/output", 
                        'step-to-obj-converter', f"/app/input/{file.filename}", f"-o", f"/app/output/{output_file}"])

        # Move the converted file to the static/models directory
        static_model_path = os.path.join('static', 'models', output_file)
        shutil.move(output_path, static_model_path)

        return render_template('index.html', model=output_file)

# **Add this route to serve OBJ files from static/models**
@app.route('/static/models/<filename>')
def serve_model(filename):
    return send_from_directory('static/models', filename)

if __name__ == '__main__':
    app.run(debug=True)
