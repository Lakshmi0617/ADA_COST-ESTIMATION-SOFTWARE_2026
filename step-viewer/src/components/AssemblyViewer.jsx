





import React, { useState, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function PartMesh({ url, isSelected, highlight, mode, position, partIndex, onPositionChange, draggedPart }) {
  useGLTF.preload(url);
  const { scene } = useGLTF(url, true);
  const meshRef = useRef();
  const [localDragging, setLocalDragging] = useState(false);
  const { raycaster, mouse, camera } = useThree();
  const dragOffsetRef = useRef(new THREE.Vector3());
  const dragPlaneRef = useRef(new THREE.Plane());
  const dragPointRef = useRef(new THREE.Vector3());

  const opacity = mode === "merged" && !isSelected && highlight ? 0.2 : 1;
  const color = mode === "merged" 
    ? (isSelected ? "#ff6b6b" : "#999999")
    : mode === "separated"
    ? "#4444ff"
    : "#ff4444";

  scene.traverse((obj) => {
    if (obj.isMesh) {
      obj.material = obj.material.clone();
      obj.material.color.set(color);
      obj.material.opacity = opacity;
      obj.material.transparent = true;
      obj.material.emissive.set(isSelected ? "#ff3333" : "#000000");
      obj.material.emissiveIntensity = isSelected ? 0.6 : 0;
    }
  });

  const handlePointerDown = (e) => {
    if (mode !== "separated" || e.button !== 0) return;
    e.stopPropagation();
    
    setLocalDragging(true);
    onPositionChange(partIndex, "START_DRAG");
    
    dragPlaneRef.current.setFromNormalAndCoplanarPoint(
      camera.getWorldDirection(new THREE.Vector3()),
      meshRef.current.position
    );
    
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(dragPlaneRef.current, dragPointRef.current);
    
    dragOffsetRef.current.copy(dragPointRef.current).sub(meshRef.current.position);
  };

  const handlePointerMove = (e) => {
    if (!localDragging || !meshRef.current) return;
    
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(dragPlaneRef.current, dragPointRef.current);
    
    const newPos = dragPointRef.current.clone().sub(dragOffsetRef.current);
    meshRef.current.position.copy(newPos);
    onPositionChange(partIndex, [newPos.x, newPos.y, newPos.z]);
  };

  const handlePointerUp = () => {
    if (localDragging) {
      setLocalDragging(false);
      onPositionChange(partIndex, "END_DRAG");
    }
  };

  React.useEffect(() => {
    if (localDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };
    }
  }, [localDragging]);

  return (
    <primitive
      ref={meshRef}
      object={scene}
      scale={0.001}
      position={position}
      onPointerDown={handlePointerDown}
      style={{ cursor: mode === "separated" && draggedPart === null ? "grab" : draggedPart === partIndex ? "grabbing" : "default" }}
    />
  );
}

export default function AssemblyViewer({ parts = [] }) {
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState("merged");
  const [partPositions, setPartPositions] = useState({});
  const [draggedPart, setDraggedPart] = useState(null);

  const sampleParts = parts.length > 0 ? parts : [
    { part_index: 1, vertex_count: 5929, triangle_count: 12054, mesh_url: "/part1.glb" },
    { part_index: 2, vertex_count: 3367, triangle_count: 6757, mesh_url: "/part2.glb" },
    { part_index: 3, vertex_count: 2346, triangle_count: 4706, mesh_url: "/part3.glb" },
  ];

  const separatedPositions = useMemo(() => {
    const totalParts = sampleParts.length;
    const spacing = 0.2;
    
    return sampleParts.map((p, i) => {
      if (partPositions[p.part_index]) {
        return partPositions[p.part_index];
      }
      const centerOffset = (totalParts - 1) * spacing / 2;
      const xPos = (i * spacing) - centerOffset;
      return [xPos, 0, 0];
    });
  }, [sampleParts.length, partPositions]);

  const handlePositionChange = (partIndex, newPos) => {
    if (newPos === "START_DRAG") {
      setDraggedPart(partIndex);
    } else if (newPos === "END_DRAG") {
      setDraggedPart(null);
    } else {
      setPartPositions(prev => ({
        ...prev,
        [partIndex]: newPos
      }));
    }
  };

  const resetPositions = () => {
    setPartPositions({});
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", background: "#1a1a1a" }}>

      {/* LEFT PANEL */}
      <div
        style={{
          width: "300px",
          padding: "15px",
          borderRight: "2px solid #444",
          overflowY: "auto",
          background: "#2a2a2a",
          color: "#fff"
        }}
      >
        <h2 style={{ color: "#fff", marginTop: 0 }}>Assembly Parts</h2>

        {/* VIEW MODE BUTTONS */}
        <button
          onClick={() => setMode("merged")}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "8px",
            background: mode === "merged" ? "#ff6b6b" : "#444",
            borderRadius: "6px",
            border: "1px solid #666",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          🔴 Merged View
        </button>

        <button
          onClick={() => setMode("separated")}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "8px",
            background: mode === "separated" ? "#51cf66" : "#444",
            borderRadius: "6px",
            border: "1px solid #666",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          🟢 Separated View
        </button>

        <button
          onClick={() => setMode("single")}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "16px",
            background: mode === "single" ? "#4dabf7" : "#444",
            borderRadius: "6px",
            border: "1px solid #666",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          🔵 Single Part View
        </button>

        {mode === "separated" && (
          <button
            onClick={resetPositions}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "16px",
              background: "#666",
              borderRadius: "6px",
              border: "1px solid #888",
              color: "#fff",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            Reset Positions
          </button>
        )}

        <div style={{ fontSize: "12px", color: "#aaa", marginBottom: "16px", padding: "10px", background: "#333", borderRadius: "6px" }}>
          {mode === "separated" ? (
            <>
              <strong>💡 Drag to Move Parts</strong>
              <br />Click and drag parts to reposition them freely in 3D space
            </>
          ) : mode === "merged" ? (
            <>
              <strong>💡 Click to Highlight</strong>
              <br />Selected part glows red, others become transparent
            </>
          ) : (
            <>
              <strong>💡 Single Part View</strong>
              <br />Select a part from the list to view it individually
            </>
          )}
        </div>

        <h4 style={{ color: "#aaa", marginTop: "20px" }}>Parts List:</h4>

        {/* PART LIST */}
        {sampleParts.map((p) => (
          <div
            key={p.part_index}
            onClick={() => setSelected(p.part_index)}
            style={{
              padding: "12px",
              marginBottom: "8px",
              background: selected === p.part_index ? "#ff6b6b" : "#333",
              cursor: "pointer",
              borderRadius: "6px",
              color: "#fff",
              border: selected === p.part_index ? "2px solid #ff4444" : "1px solid #555",
              transition: "all 0.2s"
            }}
          >
            <strong>Part {p.part_index}</strong>
            <br />
            <span style={{ fontSize: "12px", color: "#bbb" }}>
              V: {p.vertex_count} | T: {p.triangle_count}
            </span>
          </div>
        ))}
      </div>

      {/* 3D VIEWER RIGHT SIDE */}
      <div style={{ flex: 1, background: "#ffffff", position: "relative" }}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          style={{ background: "#ffffff" }}
        >
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 10]} intensity={1.5} />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#4488ff" />

          {/* MERGED VIEW */}
          {mode === "merged" &&
            sampleParts.map((p, i) => (
              <PartMesh
                key={p.part_index}
                url={"http://localhost:8001" + p.mesh_url}
                isSelected={selected === p.part_index}
                highlight={selected !== null}
                mode="merged"
                position={[0, 0, 0]}
                partIndex={p.part_index}
                onPositionChange={handlePositionChange}
              />
            ))}

          {/* SEPARATED VIEW */}
          {mode === "separated" &&
            sampleParts.map((p, i) => (
              <PartMesh
                key={p.part_index}
                url={"http://localhost:8001" + p.mesh_url}
                isSelected={selected === p.part_index}
                highlight={false}
                mode="separated"
                position={separatedPositions[i]}
                partIndex={p.part_index}
                onPositionChange={handlePositionChange}
                draggedPart={draggedPart}
              />
            ))}

          {/* SINGLE PART VIEW */}
          {mode === "single" &&
            sampleParts
              .filter((p) => p.part_index === selected)
              .map((p) => (
                <PartMesh
                  key={p.part_index}
                  url={"http://localhost:8001" + p.mesh_url}
                  isSelected={true}
                  highlight={false}
                  mode="single"
                  position={[0, 0, 0]}
                  partIndex={p.part_index}
                  onPositionChange={handlePositionChange}
                />
              ))}

          <OrbitControls makeDefault />
        </Canvas>
      </div>
    </div>
  );
}