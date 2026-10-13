FROM ubuntu:22.04

# Avoid interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Install FreeCAD, Python, pip, xvfb and necessary build tools
# Added git as FreeCAD via apt might need it, or for other dependencies
# Added libopengl0 for potential GUI dependencies needed by FreeCAD even in headless mode
RUN apt-get update && apt-get install -y --no-install-recommends \
    freecad \
    python3 \
    python3-pip \
    git \
    libopengl0 \
    curl \

    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g gltf-pipeline

WORKDIR /app



# Copy requirements first to leverage Docker cache
COPY requirements.txt ./
# Install Python dependencies
# Ensure pip is up-to-date and install from requirements
RUN python3 -m pip install --no-cache-dir --upgrade pip && \
    python3 -m pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code

COPY app.py ./
COPY model.py ./
COPY db.py ./

# Create directories for input and output files within the WORKDIR
# These will be mounted over by docker-compose volumes later
RUN mkdir -p input output

# Ensure correct line endings for scripts (optional but good practice)
# RUN sed -i 's/\r$//' step_to_obj_converter.py app.py

# Expose the port the app runs on
EXPOSE 5000

# Set the Python path for FreeCAD libraries
# Note: The exact path might differ slightly depending on the FreeCAD version/installation method
ENV PYTHONPATH=/usr/lib/freecad/lib:$PYTHONPATH

# Command to run the application
CMD ["python3", "app.py"]

# Removed old script-running specific parts like run.sh and chmod




