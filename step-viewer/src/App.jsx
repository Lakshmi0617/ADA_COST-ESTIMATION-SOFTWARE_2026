import React, { useState } from "react";
import AssemblyViewer from "./components/AssemblyViewer";

function App() {
  const [parts, setParts] = useState([]);

  const uploadStep = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("step_file", file);

    const response = await fetch(
      "http://localhost:8001/convert-step-to-meshes/",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    setParts(data.parts);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>STEP Assembly 3D Viewer</h1>

      <input type="file" accept=".step,.stp" onChange={uploadStep} />

      {parts.length > 0 && <AssemblyViewer parts={parts} />}
    </div>
  );
}

export default App;
