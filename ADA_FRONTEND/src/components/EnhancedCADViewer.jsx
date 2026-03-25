import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const EnhancedCADViewer = ({ modelId, onFeatureClick }) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  
  const [isLoading, setIsLoading] = useState(true);
  const [modelData, setModelData] = useState(null);
  const [hoveredFace, setHoveredFace] = useState(null);
  const [selectedFaces, setSelectedFaces] = useState(new Set());
  const [faceObjects, setFaceObjects] = useState(new Map());
  
  // Theme colors for different feature types
  const featureColors = {
    planar: new THREE.Color(0x4a90e2),      // Blue
    cylindrical: new THREE.Color(0xf5a623), // Orange  
    spherical: new THREE.Color(0x7ed321),   // Green
    freeform: new THREE.Color(0xd0021b),    // Red
    default: new THREE.Color(0x888888)      // Grey
  };
  
  const highlightColors = {
    hover: new THREE.Color(0xffff00),       // Yellow
    selected: new THREE.Color(0xff6b6b)     // Light Red
  };

  // Load model with enhanced features
  const loadEnhancedModel = useCallback(async (modelId) => {
    try {
      setIsLoading(true);
      
      // Fetch GLB with metadata
      const response = await fetch(`http://172.18.100.156:8004/download-glb-with-features/${modelId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch model: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.glb_data) {
        throw new Error('No GLB data available');
      }
      
      // Convert hex string back to ArrayBuffer
      const glbBuffer = new Uint8Array(
        data.glb_data.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
      ).buffer;
      
      // Load GLB using GLTFLoader
      const loader = new GLTFLoader();
      
      return new Promise((resolve, reject) => {
        loader.parse(glbBuffer, '', (gltf) => {
          const enhancedData = {
            scene: gltf.scene,
            metadata: data.metadata,
            hasFeatures: data.has_features
          };
          
          setModelData(enhancedData);
          resolve(enhancedData);
        }, reject);
      });
      
    } catch (error) {
      console.error('Failed to load enhanced model:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize 3D scene
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(5, 5, 5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    // Mouse interaction for face selection
    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Raycasting for hover detection
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(scene.children, true);
      
      if (intersects.length > 0) {
        const intersected = intersects[0].object;
        const faceId = intersected.userData.faceId;
        
        if (faceId !== undefined && faceId !== hoveredFace) {
          // Remove previous hover
          if (hoveredFace !== null) {
            const prevObject = faceObjects.get(hoveredFace);
            if (prevObject && !selectedFaces.has(hoveredFace)) {
              restoreOriginalColor(prevObject);
            }
          }
          
          // Apply hover color
          if (!selectedFaces.has(faceId)) {
            setObjectColor(intersected, highlightColors.hover);
          }
          
          setHoveredFace(faceId);
          canvas.style.cursor = 'pointer';
        }
      } else {
        // No intersection
        if (hoveredFace !== null) {
          const prevObject = faceObjects.get(hoveredFace);
          if (prevObject && !selectedFaces.has(hoveredFace)) {
            restoreOriginalColor(prevObject);
          }
        }
        setHoveredFace(null);
        canvas.style.cursor = 'default';
      }
    };

    const handleClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(scene.children, true);
      
      if (intersects.length > 0) {
        const intersected = intersects[0].object;
        const faceId = intersected.userData.faceId;
        
        if (faceId !== undefined) {
          const newSelected = new Set(selectedFaces);
          
          if (selectedFaces.has(faceId)) {
            // Deselect
            newSelected.delete(faceId);
            restoreOriginalColor(intersected);
          } else {
            // Select
            newSelected.add(faceId);
            setObjectColor(intersected, highlightColors.selected);
          }
          
          setSelectedFaces(newSelected);
          
          // Callback with face information
          if (onFeatureClick && modelData?.metadata) {
            const faceInfo = modelData.metadata.features.faces[faceId];
            onFeatureClick(faceId, faceInfo, newSelected.has(faceId));
          }
        }
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [hoveredFace, selectedFaces, faceObjects, modelData, onFeatureClick]);

  // Helper functions for color management
  const setObjectColor = (object, color) => {
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach(mat => mat.color.copy(color));
      } else {
        object.material.color.copy(color);
      }
    }
  };

  const restoreOriginalColor = (object) => {
    const faceId = object.userData.faceId;
    if (faceId !== undefined && modelData?.metadata) {
      const faceData = modelData.metadata.face_mapping?.find(f => f.face_id === faceId);
      if (faceData) {
        const originalColor = new THREE.Color().fromArray(faceData.color.slice(0, 3));
        setObjectColor(object, originalColor);
      }
    }
  };

  // Process and add model to scene
  const processModelWithFeatures = useCallback((modelData) => {
    if (!sceneRef.current || !modelData) return;

    const scene = sceneRef.current;
    const { scene: gltfScene, metadata } = modelData;

    // Clear existing objects
    while (scene.children.length > 0) {
      const child = scene.children[0];
      scene.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    }

    // Re-add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Process GLTF scene
    const newFaceObjects = new Map();
    
    gltfScene.traverse((child) => {
      if (child.isMesh) {
        // Extract face ID from node name
        const match = child.name.match(/face_(\d+)/);
        if (match) {
          const faceId = parseInt(match[1]);
          child.userData.faceId = faceId;
          
          // Set original color based on feature type
          if (metadata?.face_mapping) {
            const faceData = metadata.face_mapping.find(f => f.face_id === faceId);
            if (faceData) {
              const featureType = faceData.feature_type;
              const color = featureColors[featureType] || featureColors.default;
              
              // Create new material to avoid shared references
              child.material = new THREE.MeshLambertMaterial({ 
                color: color.clone(),
                transparent: true,
                opacity: 0.9
              });
              
              child.userData.originalColor = color.clone();
              child.userData.featureType = featureType;
            }
          }
          
          newFaceObjects.set(faceId, child);
        }
        
        // Enable interaction
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    setFaceObjects(newFaceObjects);

    // Center and scale the model
    const box = new THREE.Box3().setFromObject(gltfScene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    gltfScene.position.sub(center);
    
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 4 / maxDim;
    gltfScene.scale.set(scale, scale, scale);

    scene.add(gltfScene);

    // Update camera position
    if (cameraRef.current && controlsRef.current) {
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      
      camera.position.set(6, 6, 6);
      controls.target.set(0, 0, 0);
      controls.update();
    }

    console.log(`Loaded model with ${newFaceObjects.size} interactive faces`);
  }, []);

  // Load model when modelId changes
  useEffect(() => {
    if (modelId) {
      loadEnhancedModel(modelId)
        .then(processModelWithFeatures)
        .catch(error => {
          console.error('Failed to load model:', error);
        });
    }
  }, [modelId, loadEnhancedModel, processModelWithFeatures]);

  // Feature control functions
  const highlightFeatureType = (featureType) => {
    faceObjects.forEach((object, faceId) => {
      if (object.userData.featureType === featureType) {
        setObjectColor(object, highlightColors.hover);
      } else {
        restoreOriginalColor(object);
      }
    });
  };

  const clearAllHighlights = () => {
    faceObjects.forEach((object) => {
      if (!selectedFaces.has(object.userData.faceId)) {
        restoreOriginalColor(object);
      }
    });
    setSelectedFaces(new Set());
  };

  const selectFeatureType = (featureType) => {
    const newSelected = new Set();
    
    faceObjects.forEach((object, faceId) => {
      if (object.userData.featureType === featureType) {
        newSelected.add(faceId);
        setObjectColor(object, highlightColors.selected);
      } else {
        restoreOriginalColor(object);
      }
    });
    
    setSelectedFaces(newSelected);
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas 
        ref={canvasRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          display: 'block',
          cursor: hoveredFace !== null ? 'pointer' : 'default'
        }} 
      />
      
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255,255,255,0.9)',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          Loading enhanced CAD model...
        </div>
      )}

      {/* Feature Controls Panel */}
      {modelData?.hasFeatures && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(255,255,255,0.95)',
          padding: '15px',
          borderRadius: '8px',
          minWidth: '200px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <h4 style={{ margin: '0 0 10px', fontSize: '14px' }}>CAD Features</h4>
          
          <div style={{ marginBottom: '10px' }}>
            <button 
              onClick={() => highlightFeatureType('planar')}
              style={{
                background: '#4a90e2',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                margin: '2px',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Planar
            </button>
            <button 
              onClick={() => highlightFeatureType('cylindrical')}
              style={{
                background: '#f5a623',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                margin: '2px',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Cylindrical
            </button>
            <button 
              onClick={() => highlightFeatureType('spherical')}
              style={{
                background: '#7ed321',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                margin: '2px',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Spherical
            </button>
          </div>
          
          <div>
            <button 
              onClick={clearAllHighlights}
              style={{
                background: '#666',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Clear Selection
            </button>
          </div>
          
          {selectedFaces.size > 0 && (
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              Selected: {selectedFaces.size} face{selectedFaces.size > 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}

      {/* Feature Information Panel */}
      {hoveredFace !== null && modelData?.metadata && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '6px',
          fontSize: '12px',
          maxWidth: '250px'
        }}>
          {(() => {
            const faceInfo = modelData.metadata.features.faces[hoveredFace];
            return (
              <div>
                <div><strong>Face {hoveredFace}</strong></div>
                <div>Type: {faceInfo?.feature_type || 'Unknown'}</div>
                <div>Area: {faceInfo?.area?.toFixed(2) || 'N/A'} units²</div>
                <div>Surface: {faceInfo?.surface_type || 'N/A'}</div>
                {faceInfo?.is_planar && <div>✓ Planar surface</div>}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default EnhancedCADViewer;