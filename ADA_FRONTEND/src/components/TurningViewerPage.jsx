// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useParams, useLocation, useNavigate } from 'react-router-dom';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { Layout, Card, Typography, Row, Col, Button, message, Spin } from 'antd';
// import { FiArrowLeft, FiDownload, FiRefreshCw } from 'react-icons/fi';
// import TurningCostReport from './TurningCostReport';

// const { Content } = Layout;
// const { Title, Text } = Typography;

// const theme = {
//   primary: '#246679',
//   secondary: '#73b6ca',
//   textPrimary: '#000000',
//   textSecondary: '#666666',
//   background: '#f5f5f5',
//   cardBg: '#ffffff',
//   modelBg: '#f0f0f0',
//   buttonPrimary: '#246679',
//   buttonSecondary: '#73b6ca',
//   white: '#ffffff',
//   shadow: '0 2px 12px rgba(36, 102, 121, 0.15)',
//   glowShadow: '0 0 10px rgba(36, 102, 121, 0.2)',
//   borderColor: '#246679',
//   error: '#ff4d4f',
//   warning: '#faad14',
//   success: '#52c41a'
// };

// function TurningViewerPage() {
//   const location = useLocation();
//   const { id } = useParams();
//   const canvasRef = useRef(null);
//   const cubeCanvasRef = useRef(null);
//   const controlsRef = useRef(null);
//   const cameraRef = useRef(null);
//   const sceneRef = useRef(null);
//   const rendererRef = useRef(null);
//   const modelRef = useRef(null);
//   const loadingAbortControllerRef = useRef(null);
//   const modelCacheRef = useRef(new Map()); // Cache for loaded models
  
//   const [isModelLoaded, setIsModelLoaded] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const [loadingMessage, setLoadingMessage] = useState('Waiting for calculation ID...');
//   const [cubeRotation, setCubeRotation] = useState({ x: 0, y: 0 });
//   const [loadingProgress, setLoadingProgress] = useState(0);
//   const navigate = useNavigate();
  
//   // Get costCalculationId with validation
//   const [costCalculationId] = useState(() => {
//     const possibleId = id || 
//                       location.state?.costCalculationId || 
//                       localStorage.getItem('currentCalculationId');
    
//     // Validate ID format (assuming it should be a non-empty string/number)
//     return possibleId && possibleId !== 'undefined' && possibleId !== 'null' 
//       ? possibleId 
//       : null;
//   });

//   const { analysisData } = location.state || {};

//   // Debounced model loading to prevent multiple rapid calls
//   const [loadingTimeout, setLoadingTimeout] = useState(null);

//   // Enhanced model loading with Draco GLB format support (compressed for faster loading)
//   const loadModelFromDatabase = useCallback(async (calcId) => {
//     // Validate calcId before making any API calls
//     if (!calcId || calcId === 'undefined' || calcId === 'null' || calcId.toString().trim() === '') {
//       console.log('Invalid calculation ID provided:', calcId);
//       setIsError(true);
//       setLoadingMessage('Invalid calculation ID. Please try again.');
//       return;
//     }

//     // Cancel any ongoing loading operation
//     if (loadingAbortControllerRef.current) {
//       loadingAbortControllerRef.current.abort();
//     }

//     // Check cache first
//     if (modelCacheRef.current.has(calcId)) {
//       console.log('Loading model from cache');
//       const cachedModel = modelCacheRef.current.get(calcId);
//       processAndAddModel(cachedModel.scene.clone());
//       setIsModelLoaded(true);
//       return;
//     }

//     console.log('Loading Draco-compressed GLB model from database with validated ID:', calcId);
//     setIsModelLoaded(false);
//     setIsError(false);
//     setLoadingProgress(0);
//     setLoadingMessage('Connecting to server...');
    
//     // Create new abort controller for this request
//     const abortController = new AbortController();
//     loadingAbortControllerRef.current = abortController;
    
//     try {
//       setLoadingMessage('Downloading compressed 3D model (Draco GLB format)...');
      
//       // Use Turning Draco GLB endpoint
//       const response = await fetch(`http://172.18.100.156:8004/turning/download-draco-glb/${calcId}`, {
//         signal: abortController.signal,
//         method: 'GET',
//         headers: {
//           'Accept': 'model/gltf-binary, application/octet-stream, */*',
//           'Cache-Control': 'no-cache'
//         }
//       });
      
//       if (abortController.signal.aborted) {
//         return;
//       }
      
//       if (!response.ok) {
//         // Fallback to regular GLB if Draco is not available
//         if (response.status === 404) {
//           console.log('Draco GLB not found, falling back to regular GLB...');
//           await loadRegularGlbFallback(calcId, abortController);
//           return;
//         } else {
//           throw new Error(`Server error: ${response.status} - ${response.statusText}`);
//         }
//       }
      
//       // Check content type
//       const contentType = response.headers.get('content-type');
//       console.log('Response content type:', contentType);
      
//       if (abortController.signal.aborted) {
//         return;
//       }
      
//       setLoadingMessage('Processing compressed 3D model...');
//       setLoadingProgress(30);
      
//       // Get the response as ArrayBuffer
//       const arrayBuffer = await response.arrayBuffer();
      
//       if (abortController.signal.aborted) {
//         return;
//       }
      
//       if (arrayBuffer.byteLength === 0) {
//         throw new Error('Received empty file from server');
//       }
      
//       setLoadingMessage('Loading 3D model into viewer...');
//       setLoadingProgress(70);
      
//       // Load the model from ArrayBuffer
//       await loadModelFromArrayBuffer(arrayBuffer, calcId, abortController, 'draco');
      
//     } catch (error) {
//       if (abortController.signal.aborted) {
//         console.log('Model loading was aborted');
//         return;
//       }
      
//       console.error('Error loading model from database:', error);
//       setIsError(true);
//       setLoadingMessage(`Failed to load 3D model: ${error.message}`);
//     }
//   }, []);

//   // Fallback to regular GLB loading
//   const loadRegularGlbFallback = async (calcId, abortController) => {
//     try {
//       setLoadingMessage('Loading regular GLB model...');
//       setLoadingProgress(50);
      
//       const response = await fetch(`http://172.18.100.156:8004/turning/download-glb/${calcId}`, {
//         signal: abortController.signal,
//         method: 'GET',
//         headers: {
//           'Accept': 'model/gltf-binary, application/octet-stream, */*',
//           'Cache-Control': 'no-cache'
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error(`Regular GLB also not found: ${response.status}`);
//       }
      
//       const arrayBuffer = await response.arrayBuffer();
//       await loadModelFromArrayBuffer(arrayBuffer, calcId, abortController, 'regular');
      
//     } catch (error) {
//       console.error('Regular GLB fallback also failed:', error);
//       throw error;
//     }
//   };

//   // Load model from ArrayBuffer
//   const loadModelFromArrayBuffer = async (arrayBuffer, calcId, abortController, format = 'draco') => {
//     if (abortController.signal.aborted) return;

//     try {
//       setLoadingMessage(`Loading ${format} 3D model...`);
//       setLoadingProgress(80);

//       // Configure Draco loader
//       const dracoLoader = new DRACOLoader();
//       dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
      
//       const loader = new GLTFLoader();
//       loader.setDRACOLoader(dracoLoader);

//       // Parse the GLB data
//       const gltf = await new Promise((resolve, reject) => {
//         loader.parse(arrayBuffer, '', resolve, reject);
//       });

//       if (abortController.signal.aborted) return;

//       // Cache the model
//       modelCacheRef.current.set(calcId, gltf);
      
//       // Process and add to scene
//       processAndAddModel(gltf.scene);
      
//       setLoadingProgress(100);
//       setLoadingMessage('3D model loaded successfully!');
      
//       // Small delay to show completion
//       setTimeout(() => {
//         setIsModelLoaded(true);
//         setLoadingMessage('');
//       }, 500);
      
//     } catch (error) {
//       console.error(`Error loading ${format} model:`, error);
//       throw error;
//     }
//   };

//   // Process and add model to scene
//   const processAndAddModel = (model) => {
//     if (!sceneRef.current) return;

//     // Clear existing models
//     const objectsToRemove = [];
//     sceneRef.current.traverse((child) => {
//       if (child.isMesh) {
//         objectsToRemove.push(child);
//       }
//     });
//     objectsToRemove.forEach(obj => {
//       sceneRef.current.remove(obj);
//       if (obj.geometry) obj.geometry.dispose();
//       if (obj.material) {
//         if (Array.isArray(obj.material)) {
//           obj.material.forEach(material => material.dispose());
//         } else {
//           obj.material.dispose();
//         }
//       }
//     });

//     // Configure the model
//     model.traverse((child) => {
//       if (child.isMesh) {
//         child.castShadow = true;
//         child.receiveShadow = true;
//         child.material.metalness = 0.3;
//         child.material.roughness = 0.7;
//       }
//     });

//     // Center and scale the model
//     const box = new THREE.Box3().setFromObject(model);
//     const center = box.getCenter(new THREE.Vector3());
//     const size = box.getSize(new THREE.Vector3());
//     const maxDim = Math.max(size.x, size.y, size.z);
//     const scale = 4 / maxDim;
    
//     model.scale.setScalar(scale);
//     model.position.sub(center.multiplyScalar(scale));
//     model.position.y = -box.min.y * scale;

//     sceneRef.current.add(model);
//     modelRef.current = model;

//     // Adjust camera to fit the model
//     const distance = maxDim * 2;
//     if (controlsRef.current) {
//       controlsRef.current.target.copy(center);
//       controlsRef.current.update();
//     }
//     cameraRef.current?.position.set(distance, distance, distance);
//     cameraRef.current?.lookAt(center);
//   };

//   // Camera movement functions
//   const moveCamera = (direction) => {
//     if (!cameraRef.current || !controlsRef.current) return;

//     const distance = 2;
//     const currentPosition = cameraRef.current.position.clone();
//     const target = controlsRef.current.target.clone();

//     switch (direction) {
//       case 'up':
//         cameraRef.current.position.set(currentPosition.x, currentPosition.y + distance, currentPosition.z);
//         break;
//       case 'down':
//         cameraRef.current.position.set(currentPosition.x, currentPosition.y - distance, currentPosition.z);
//         break;
//       case 'left':
//         cameraRef.current.position.set(currentPosition.x - distance, currentPosition.y, currentPosition.z);
//         break;
//       case 'right':
//         cameraRef.current.position.set(currentPosition.x + distance, currentPosition.y, currentPosition.z);
//         break;
//     }

//     controlsRef.current.target.copy(target);
//     controlsRef.current.update();
//   };

//   // Handle face clicks for cube navigation
//   const handleFaceClick = (face) => {
//     if (!cameraRef.current || !controlsRef.current) return;

//     const distance = 5;
//     const target = controlsRef.current.target.clone();

//     switch (face) {
//       case 'front':
//         cameraRef.current.position.set(0, 0, distance);
//         break;
//       case 'back':
//         cameraRef.current.position.set(0, 0, -distance);
//         break;
//       case 'left':
//         cameraRef.current.position.set(-distance, 0, 0);
//         break;
//       case 'right':
//         cameraRef.current.position.set(distance, 0, 0);
//         break;
//       case 'top':
//         cameraRef.current.position.set(0, distance, 0);
//         break;
//       case 'bottom':
//         cameraRef.current.position.set(0, -distance, 0);
//         break;
//     }

//     controlsRef.current.target.copy(target);
//     controlsRef.current.update();
//   };

//   // Initialize Three.js scene
//   const initThreeJS = () => {
//     if (!canvasRef.current) return;

//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0xf0f0f0);
    
//     const camera = new THREE.PerspectiveCamera(
//       75,
//       canvasRef.current.clientWidth / canvasRef.current.clientHeight,
//       0.1,
//       1000
//     );
//     camera.position.set(5, 5, 5);

//     const renderer = new THREE.WebGLRenderer({ 
//       canvas: canvasRef.current,
//       antialias: true,
//       alpha: true
//     });
//     renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
//     renderer.shadowMap.enabled = true;
//     renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     renderer.outputColorSpace = THREE.SRGBColorSpace;
//     renderer.toneMapping = THREE.ACESFilmicToneMapping;
//     renderer.toneMappingExposure = 1.2;

//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.dampingFactor = 0.05;
//     controls.screenSpacePanning = false;
//     controls.minDistance = 1;
//     controls.maxDistance = 50;
//     controls.maxPolarAngle = Math.PI;

//     // Add lighting
//     const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//     directionalLight.position.set(10, 10, 5);
//     directionalLight.castShadow = true;
//     directionalLight.shadow.mapSize.width = 2048;
//     directionalLight.shadow.mapSize.height = 2048;
//     directionalLight.shadow.camera.near = 0.5;
//     directionalLight.shadow.camera.far = 50;
//     directionalLight.shadow.camera.left = -10;
//     directionalLight.shadow.camera.right = 10;
//     directionalLight.shadow.camera.top = 10;
//     directionalLight.shadow.camera.bottom = -10;
//     scene.add(directionalLight);

//     // Add grid helper
//     const gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0x888888);
//     gridHelper.position.y = -2;
//     scene.add(gridHelper);

//     sceneRef.current = scene;
//     cameraRef.current = camera;
//     rendererRef.current = renderer;
//     controlsRef.current = controls;
//   };

//   // Animation loop
//   const animate = () => {
//     if (!controlsRef.current || !rendererRef.current) return;

//     controlsRef.current.update();
//     rendererRef.current.render(sceneRef.current, cameraRef.current);
//     requestAnimationFrame(animate);
//   };

//   // Handle resize
//   const handleResize = () => {
//     if (!canvasRef.current || !rendererRef.current) return;

//     const canvas = canvasRef.current;
//     const width = canvas.clientWidth;
//     const height = canvas.clientHeight;

//     if (cameraRef.current) {
//       cameraRef.current.aspect = width / height;
//       cameraRef.current.updateProjectionMatrix();
//     }
//     rendererRef.current.setSize(width, height);
//   };

//   // Initialize component
//   useEffect(() => {
//     if (!costCalculationId) {
//       setIsError(true);
//       setLoadingMessage('No calculation ID provided');
//       return;
//     }

//     // Initialize Three.js
//     initThreeJS();

//     // Start animation loop
//     animate();

//     // Add resize listener
//     window.addEventListener('resize', handleResize);

//     // Load 3D model
//     loadModelFromDatabase(costCalculationId);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       if (loadingAbortControllerRef.current) {
//         loadingAbortControllerRef.current.abort();
//       }
//       if (rendererRef.current) {
//         rendererRef.current.dispose();
//       }
//     };
//   }, [costCalculationId, loadModelFromDatabase]);

//   const handleBackToUpload = () => {
//     navigate('/turning');
//   };

//   const handleDownloadModel = async () => {
//     try {
//       const response = await fetch(`http://172.18.100.156:8004/turning/download-draco-glb/${costCalculationId}`);
//       if (response.ok) {
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `turning-model-${costCalculationId}.glb`;
//         document.body.appendChild(a);
//         a.click();
//         window.URL.revokeObjectURL(url);
//         document.body.removeChild(a);
//         message.success('Model downloaded successfully!');
//       } else {
//         throw new Error('Download failed');
//       }
//     } catch (error) {
//       console.error('Download error:', error);
//       message.error('Failed to download model');
//     }
//   };

//   const handleReloadModel = () => {
//     if (costCalculationId) {
//       loadModelFromDatabase(costCalculationId);
//     }
//   };

//   return (
//     <Layout style={{ 
//       minHeight: '100vh', 
//       width: '100vw',
//       background: theme.background,
//       overflow: 'hidden'
//     }}>
//       {/* Header */}
//       <div style={{ 
//         height: '80px',
//         background: `#246679`,
//         padding: '0 40px', 
//         display: 'flex', 
//         alignItems: 'center', 
//         justifyContent: 'space-between',
//         boxShadow: '0 8px 32px rgba(20, 93, 160, 0.3), 0 0 0 1px rgba(20, 93, 160, 0.2)',
//         borderBottom: `4px solid #246679`,
//         position: 'sticky',
//         top: 0,
//         zIndex: 1000
//       }}>
//         <button 
//           onClick={() => navigate('/home')}
//           style={{
//             position: 'absolute',
//             left: '16px',
//             padding: '8px',
//             borderRadius: '8px',
//             background: 'transparent',
//             border: 'none',
//             cursor: 'pointer',
//             transition: 'all 0.3s ease',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center'
//           }}
//           onMouseEnter={(e) => {
//             e.target.style.background = 'rgba(255, 255, 255, 0.2)';
//           }}
//           onMouseLeave={(e) => {
//             e.target.style.background = 'transparent';
//           }}
//           title="Back to Home"
//         >
//           <FiArrowLeft style={{ 
//             width: '24px', 
//             height: '24px', 
//             color: '#ffffff',
//             transition: 'color 0.3s ease'
//           }} />
//         </button>

//         <div style={{  
//           position: 'absolute', 
//           left: '50%', 
//           transform: 'translateX(-50%)',
//           display: 'flex', 
//           alignItems: 'center' 
//         }}>
//           <Title level={3} style={{ 
//             margin: 0, 
//             color: '#ffffff', 
//             fontWeight: 600, 
//             fontSize: '24px',
//             textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
//           }}>
//             TURNING PROCESS VIEWER
//           </Title>
//         </div>
//       </div>

//       <Content style={{ 
//         padding: '30px 40px',
//         height: 'calc(100vh - 80px)',
//         overflow: 'auto'
//       }}>
//         <div style={{ 
//           maxWidth: '100%', 
//           margin: '0 auto',
//           height: '100%'
//         }}>
//           <Row gutter={[30, 30]} style={{ height: '100%' }}>
//             {/* 3D Viewer Section */}
//             <Col xs={24} lg={12} style={{ height: '100%' }}>
//               <Card 
//                 title="" 
//                 style={{ 
//                   height: '100%', 
//                   boxShadow: theme.shadow,
//                   borderRadius: '8px',
//                   overflow: 'hidden',
//                   background: theme.cardBg,
//                   border: `1px solid ${theme.borderColor}`
//                 }}
//                 styles={{ 
//                   body: { 
//                     padding: '0', 
//                     height: 'calc(100% - 65px)', 
//                     position: 'relative',
//                     background: theme.modelBg
//                   }
//                 }}
//               >
//                 <div style={{ position: 'relative', width: '100%', height: '100%' }}>
//                   <canvas 
//                     ref={canvasRef} 
//                     style={{
//                       width: '100%',
//                       height: '100%',
//                       display: 'block'
//                     }}
//                   />
                  
//                   {/* Enhanced 3D Navigation Controls */}
//                   <div style={{
//                     position: 'absolute',
//                     top: '10px',
//                     right: '10px',
//                     width: '240px',
//                     height: '240px',
//                     display: isModelLoaded ? 'block' : 'none'
//                   }}>
//                     {/* Top Arrow - Move Camera Up */}
//                     <button
//                       onClick={() => moveCamera('up')}
//                       style={{
//                         position: 'absolute',
//                         left: '50%',
//                         top: '5px',
//                         transform: 'translateX(-50%)',
//                         background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
//                         border: '2px solid rgba(20, 93, 160, 0.3)',
//                         borderRadius: '50%',
//                         width: '36px',
//                         height: '36px',
//                         cursor: 'pointer',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         boxShadow: '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
//                         fontSize: '16px',
//                         fontWeight: 'bold',
//                         color: '#145da0',
//                         zIndex: 10,
//                         transition: 'all 0.2s ease',
//                         backdropFilter: 'blur(10px)'
//                       }}
//                       title="Move Camera Up"
//                     >
//                       ↑
//                     </button>

//                     {/* Left Arrow - Move Camera Left */}
//                     <button
//                       onClick={() => moveCamera('left')}
//                       style={{
//                         position: 'absolute',
//                         left: '20px',
//                         top: '50%',
//                         transform: 'translateY(-50%)',
//                         background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
//                         border: '2px solid rgba(20, 93, 160, 0.3)',
//                         borderRadius: '50%',
//                         width: '36px',
//                         height: '36px',
//                         cursor: 'pointer',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         boxShadow: '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
//                         fontSize: '16px',
//                         fontWeight: 'bold',
//                         color: '#145da0',
//                         zIndex: 10,
//                         transition: 'all 0.2s ease',
//                         backdropFilter: 'blur(10px)'
//                       }}
//                       title="Move Camera Left"
//                     >
//                       ←
//                     </button>

//                     {/* Cube Container with Rounded Corners */}
//                     <div style={{
//                       position: 'absolute',
//                       left: '50%',
//                       top: '50%',
//                       transform: 'translate(-50%, -50%)',
//                       width: '150px',
//                       height: '150px',
//                       overflow: 'hidden',
//                       pointerEvents: 'none'
//                     }}>
//                       <canvas 
//                         ref={cubeCanvasRef} 
//                         style={{
//                           width: '100%',
//                           height: '100%',
//                           display: 'block'
//                         }}
//                       />
                      
//                       {/* Clickable Face Buttons */}
//                       <div style={{
//                         position: 'absolute',
//                         top: 0,
//                         left: 0,
//                         right: 0,
//                         bottom: 0,
//                         display: 'grid',
//                         gridTemplateColumns: 'repeat(3, 1fr)',
//                         gridTemplateRows: 'repeat(3, 1fr)',
//                         pointerEvents: 'auto'
//                       }}>
//                         {/* Top */}
//                         <div 
//                           onClick={() => handleFaceClick('top')}
//                           style={{ 
//                             gridColumn: 2, 
//                             gridRow: 1, 
//                             cursor: 'pointer',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center'
//                           }}
//                           title="Top View"
//                         />
//                         {/* Left */}
//                         <div 
//                           onClick={() => handleFaceClick('left')}
//                           style={{ 
//                             gridColumn: 1, 
//                             gridRow: 2, 
//                             cursor: 'pointer',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center'
//                           }}
//                           title="Left View"
//                         />
//                         {/* Front */}
//                         <div 
//                           onClick={() => handleFaceClick('front')}
//                           style={{ 
//                             gridColumn: 2, 
//                             gridRow: 2, 
//                             cursor: 'pointer',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center'
//                           }}
//                           title="Front View"
//                         />
//                         {/* Right */}
//                         <div 
//                           onClick={() => handleFaceClick('right')}
//                           style={{ 
//                             gridColumn: 3, 
//                             gridRow: 2, 
//                             cursor: 'pointer',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center'
//                           }}
//                           title="Right View"
//                         />
//                         {/* Bottom */}
//                         <div 
//                           onClick={() => handleFaceClick('bottom')}
//                           style={{ 
//                             gridColumn: 2, 
//                             gridRow: 3, 
//                             cursor: 'pointer',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center'
//                           }}
//                           title="Bottom View"
//                         />
//                       </div>
//                     </div>

//                     {/* Right Arrow - Move Camera Right */}
//                     <button
//                       onClick={() => moveCamera('right')}
//                       style={{
//                         position: 'absolute',
//                         right: '20px',
//                         top: '50%',
//                         transform: 'translateY(-50%)',
//                         background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
//                         border: '2px solid rgba(20, 93, 160, 0.3)',
//                         borderRadius: '50%',
//                         width: '36px',
//                         height: '36px',
//                         cursor: 'pointer',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         boxShadow: '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
//                         fontSize: '16px',
//                         fontWeight: 'bold',
//                         color: '#145da0',
//                         zIndex: 10,
//                         transition: 'all 0.2s ease',
//                         backdropFilter: 'blur(10px)'
//                       }}
//                       title="Move Camera Right"
//                     >
//                       →
//                     </button>

//                     {/* Bottom Arrow - Move Camera Down */}
//                     <button
//                       onClick={() => moveCamera('down')}
//                       style={{
//                         position: 'absolute',
//                         left: '50%',
//                         bottom: '5px',
//                         transform: 'translateX(-50%)',
//                         background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
//                         border: '2px solid rgba(20, 93, 160, 0.3)',
//                         borderRadius: '50%',
//                         width: '36px',
//                         height: '36px',
//                         cursor: 'pointer',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         boxShadow: '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
//                         fontSize: '16px',
//                         fontWeight: 'bold',
//                         color: '#145da0',
//                         zIndex: 10,
//                         transition: 'all 0.2s ease',
//                         backdropFilter: 'blur(10px)'
//                       }}
//                       title="Move Camera Down"
//                     >
//                       ↓
//                     </button>
//                   </div>
//                 </div>
                
//                 {/* Enhanced Loading/Error states with progress */}
//                 {!isModelLoaded && !isError && (
//                   <div style={{
//                     position: 'absolute',
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     bottom: 0,
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     background: 'rgba(255, 255, 255, 0.95)',
//                     backdropFilter: 'blur(5px)'
//                   }}>
//                     <div style={{ textAlign: 'center', maxWidth: '300px' }}>
//                       {/* Loading Spinner */}
//                       <div style={{
//                         border: `4px solid ${theme.primary}33`,
//                         borderTop: `4px solid ${theme.primary}`,
//                         borderRadius: '50%',
//                         width: '48px',
//                         height: '48px',
//                         animation: 'spin 1s linear infinite',
//                         margin: '0 auto 20px'
//                       }} />
                      
//                       {/* Progress Bar */}
//                       {loadingProgress > 0 && (
//                         <div style={{
//                           width: '200px',
//                           height: '8px',
//                           background: '#f0f0f0',
//                           borderRadius: '4px',
//                           margin: '0 auto 16px',
//                           overflow: 'hidden'
//                         }}>
//                           <div style={{
//                             width: `${loadingProgress}%`,
//                             height: '100%',
//                             background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
//                             borderRadius: '4px',
//                             transition: 'width 0.3s ease'
//                           }} />
//                         </div>
//                       )}
                      
//                       <Text style={{ 
//                         color: theme.primary, 
//                         fontSize: '16px',
//                         fontWeight: '500'
//                       }}>
//                         {loadingMessage}
//                       </Text>
                      
//                       {loadingProgress > 0 && (
//                         <div style={{ marginTop: '8px' }}>
//                           <Text style={{ 
//                             color: theme.warning, 
//                             fontSize: '14px'
//                           }}>
//                             Loading turning process model...
//                           </Text>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}
                
//                 {/* Enhanced Error State */}
//                 {isError && (
//                   <div style={{
//                     position: 'absolute',
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     bottom: 0,
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     background: 'rgba(255, 255, 255, 0.95)',
//                     backdropFilter: 'blur(5px)'
//                   }}>
//                     <div style={{ textAlign: 'center', maxWidth: '350px' }}>
//                       <div style={{
//                         width: '48px',
//                         height: '48px',
//                         background: theme.error,
//                         borderRadius: '50%',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         margin: '0 auto 20px',
//                         color: 'white',
//                         fontSize: '24px',
//                         fontWeight: 'bold'
//                       }}>
//                         !
//                       </div>
                      
//                       <Text style={{ 
//                         color: theme.error, 
//                         fontSize: '16px',
//                         fontWeight: '500',
//                         marginBottom: '16px',
//                         display: 'block'
//                       }}>
//                         {loadingMessage}
//                       </Text>
                      
//                       <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
//                         {costCalculationId && (
//                           <button
//                             onClick={() => {
//                               setIsError(false);
//                               setLoadingProgress(0);
//                               loadModelFromDatabase(costCalculationId);
//                             }}
//                             style={{
//                               background: theme.primary,
//                               color: 'white',
//                               border: 'none',
//                               padding: '10px 20px',
//                               borderRadius: '6px',
//                               cursor: 'pointer',
//                               fontSize: '14px',
//                               fontWeight: '500',
//                               transition: 'all 0.2s ease',
//                               boxShadow: '0 2px 8px rgba(20, 93, 160, 0.3)'
//                             }}
//                             onMouseEnter={(e) => {
//                               e.target.style.background = theme.secondary;
//                             }}
//                             onMouseLeave={(e) => {
//                               e.target.style.background = theme.primary;
//                             }}
//                           >
//                             Retry Loading
//                           </button>
//                         )}
                        
//                         <button
//                           onClick={handleBackToUpload}
//                           style={{
//                             background: 'transparent',
//                             color: theme.primary,
//                             border: `2px solid ${theme.primary}`,
//                             padding: '10px 20px',
//                             borderRadius: '6px',
//                             cursor: 'pointer',
//                             fontSize: '14px',
//                             fontWeight: '500',
//                             transition: 'all 0.2s ease'
//                           }}
//                           onMouseEnter={(e) => {
//                             e.target.style.background = theme.primary;
//                             e.target.style.color = 'white';
//                           }}
//                           onMouseLeave={(e) => {
//                             e.target.style.background = 'transparent';
//                             e.target.style.color = theme.primary;
//                           }}
//                         >
//                           Back to Upload
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </Card>
//             </Col>

//             {/* Cost Report Section */}
//             <Col xs={24} lg={12} style={{ height: '100%' }}>
//               <Card 
//                 title="Turning Process Cost Analysis" 
//                 style={{ 
//                   height: '100%', 
//                   boxShadow: theme.shadow,
//                   borderRadius: '8px',
//                   background: theme.cardBg,
//                   border: `1px solid ${theme.borderColor}`
//                 }}
//                 styles={{ 
//                   body: { 
//                     padding: '20px', 
//                     height: 'calc(100% - 65px)', 
//                     overflow: 'auto'
//                   }
//                 }}
//                 extra={
//                   <div style={{ display: 'flex', gap: '8px' }}>
//                     <Button 
//                       icon={<FiDownload />}
//                       onClick={handleDownloadModel}
//                       size="small"
//                       style={{ 
//                         background: theme.primary,
//                         borderColor: theme.primary,
//                         color: 'white'
//                       }}
//                     >
//                       Get Report
//                     </Button>
//                     <Button 
//                       icon={<FiRefreshCw />}
//                       onClick={handleReloadModel}
//                       size="small"
//                       loading={!isModelLoaded && !isError}
//                     >
//                       Reload
//                     </Button>
//                   </div>
//                 }
//               >
//                 {analysisData ? (
//                   <TurningCostReport 
//                     analysisData={analysisData} 
//                     theme={theme} 
//                     objUrl={location.state?.objUrl}
//                     onCostCalculationComplete={(id) => {
//                       console.log('Cost calculation completed with ID:', id);
//                     }}
//                     initialCostData={location.state?.initialCostData}
//                   />
//                 ) : (
//                   <div style={{ textAlign: 'center', padding: '40px', color: theme.textSecondary }}>
//                     <Text>No analysis data available</Text>
//                   </div>
//                 )}
//               </Card>
//             </Col>
//           </Row>
//         </div>
//       </Content>
//     </Layout>
//   );
// }

// export default TurningViewerPage;




//'''''this is the correct working code''''''''//
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useParams, useLocation, useNavigate } from 'react-router-dom';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { Layout, Card, Typography, Row, Col, Button } from 'antd';
// import { FiArrowLeft, FiDownload } from 'react-icons/fi';
// import TurningCostReport from './TurningCostReport';

// const { Content } = Layout;
// const { Title, Text } = Typography;

// const theme = {
//   primary: '#145da0',
//   secondary: '#246679',
//   success: '#52c41a',
//   warning: '#faad14',
//   error: '#f5222d',
//   background: '#f0f2f5',
//   cardBg: '#ffffff',
//   textPrimary: '#262626',
//   textSecondary: '#8c8c8c',
//   borderColor: '#d9d9d9',
//   shadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
//   lightBlue: '#e6f7ff',
//   darkBlue: '#001d66',
//   accent: '#145da0',
//   inputBg: '#ffffff',
//   inputBorder: '#d9d9d9',
//   modelBg: '#f8f9fa',
//   buttonColor: '#246679',
//   headerBg: '#145da0',
//   cubeColors: {
//     front: '#B0B0B0',
//     back: '#888888',
//     top: '#D3D3D3',
//     bottom: '#6E6E6E',
//     left: '#A9A9A9',
//     right: '#505050'
//   }
// };

// function TurningViewerPage() {
//   const location = useLocation();
//   const { id } = useParams();
//   const canvasRef = useRef(null);
//   const cubeCanvasRef = useRef(null);
//   const controlsRef = useRef(null);
//   const cameraRef = useRef(null);
//   const sceneRef = useRef(null);
//   const modelRef = useRef(null);
//   const rendererRef = useRef(null);
//   const loadingAbortControllerRef = useRef(null);
//   const modelCacheRef = useRef(new Map());
  
//   const [isModelLoaded, setIsModelLoaded] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const [loadingMessage, setLoadingMessage] = useState('Waiting for calculation ID...');
//   const [cubeRotation, setCubeRotation] = useState({ x: 0, y: 0 });
//   const [loadingProgress, setLoadingProgress] = useState(0);
//   const navigate = useNavigate();
  
//   const [costCalculationId, setCostCalculationId] = useState(() => {
//     const possibleId = id || 
//                       location.state?.costCalculationId || 
//                       localStorage.getItem('currentTurningCalculationId');
    
//     return possibleId && possibleId !== 'undefined' && possibleId !== 'null' 
//       ? possibleId 
//       : null;
//   });

//   const { analysisData } = location.state || {};
//   const [loadingTimeout, setLoadingTimeout] = useState(null);
//   const reportActionRef = useRef(null);

//   const loadModelFromDatabase = useCallback(async (calcId) => {
//     if (!calcId || calcId === 'undefined' || calcId === 'null' || calcId.toString().trim() === '') {
//       console.log('Invalid calculation ID provided:', calcId);
//       setIsError(true);
//       setLoadingMessage('Invalid calculation ID. Please try again.');
//       return;
//     }

//     if (loadingAbortControllerRef.current) {
//       loadingAbortControllerRef.current.abort();
//     }

//     if (modelCacheRef.current.has(calcId)) {
//       console.log('Loading model from cache');
//       const cachedModel = modelCacheRef.current.get(calcId);
//       processAndAddModel(cachedModel.scene.clone());
//       setIsModelLoaded(true);
//       return;
//     }

//     console.log('Loading Draco GLB model from database with validated ID:', calcId);
//     setIsModelLoaded(false);
//     setIsError(false);
//     setLoadingProgress(0);
//     setLoadingMessage('Connecting to server...');
    
//     const abortController = new AbortController();
//     loadingAbortControllerRef.current = abortController;
    
//     try {
//       setLoadingMessage('Downloading 3D model (Draco GLB format)...');
      
//       const response = await fetch(`http://172.18.100.156:8004/turning/download-draco-glb/${calcId}`, {
//         signal: abortController.signal,
//         method: 'GET',
//         headers: {
//           'Accept': 'model/gltf-binary, application/octet-stream, */*',
//           'Cache-Control': 'no-cache'
//         }
//       });
      
//       if (abortController.signal.aborted) return;
      
//       if (!response.ok) {
//         if (response.status === 404) {
//           console.log('Draco GLB not found, trying regular GLB...');
//           await loadRegularGlbFallback(calcId, abortController);
//           return;
//         }
//         throw new Error(`Server error: ${response.status} - ${response.statusText}`);
//       }
      
//       const contentType = response.headers.get('content-type');
//       console.log('Response content type:', contentType);
      
//       setLoadingMessage('Processing GLB model...');
//       const contentLength = +response.headers.get('content-length') || 0;
//       let arrayBuffer;
      
//       if (contentLength > 0 && response.body && response.body.getReader) {
//         try {
//           const reader = response.body.getReader();
//           let receivedLength = 0;
//           let chunks = [];
          
//           while (true) {
//             const { done, value } = await reader.read();
            
//             if (abortController.signal.aborted) {
//               reader.releaseLock();
//               return;
//             }
            
//             if (done) break;
            
//             chunks.push(value);
//             receivedLength += value.length;
            
//             const progress = Math.round((receivedLength / contentLength) * 70);
//             setLoadingProgress(progress);
//           }
          
//           const uint8Array = new Uint8Array(receivedLength);
//           let position = 0;
//           for (let chunk of chunks) {
//             uint8Array.set(chunk, position);
//             position += chunk.length;
//           }
//           arrayBuffer = uint8Array.buffer;
//           reader.releaseLock();
          
//         } catch (streamError) {
//           console.warn('Stream reading failed, falling back to arrayBuffer():', streamError);
//           arrayBuffer = await response.arrayBuffer();
//         }
//       } else {
//         setLoadingProgress(40);
//         arrayBuffer = await response.arrayBuffer();
//       }
      
//       if (abortController.signal.aborted) return;
      
//       await loadModelFromArrayBuffer(arrayBuffer, calcId, abortController);
      
//     } catch (error) {
//       if (abortController.signal.aborted) {
//         console.log('Model loading was cancelled');
//         return;
//       }
      
//       console.error('Error fetching GLB model from database:', error);
//       setIsError(true);
      
//       if (error.name === 'TypeError' && error.message.includes('fetch')) {
//         setLoadingMessage('Connection failed. Please check your network connection.');
//       } else if (error.message.includes('404')) {
//         setLoadingMessage('GLB model not found. The calculation may still be processing.');
//       } else if (error.message.includes('500')) {
//         setLoadingMessage('Server error. Please try again later.');
//       } else {
//         setLoadingMessage(`Failed to load GLB model: ${error.message}`);
//       }
//     }
//   }, []);

//   const loadRegularGlbFallback = async (calcId, abortController) => {
//     try {
//       setLoadingMessage('Loading regular GLB model...');
//       setLoadingProgress(50);
      
//       const response = await fetch(`http://172.18.100.156:8004/turning/download-glb/${calcId}`, {
//         signal: abortController.signal,
//         method: 'GET',
//         headers: {
//           'Accept': 'model/gltf-binary, application/octet-stream, */*',
//           'Cache-Control': 'no-cache'
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error(`Regular GLB not found: ${response.status}`);
//       }
      
//       const arrayBuffer = await response.arrayBuffer();
//       await loadModelFromArrayBuffer(arrayBuffer, calcId, abortController);
      
//     } catch (error) {
//       console.error('Regular GLB fallback failed:', error);
//       throw error;
//     }
//   };

//   const loadModelFromArrayBuffer = async (arrayBuffer, calcId, abortController) => {
//     try {
//       if (abortController.signal.aborted) return;

//       setLoadingMessage('Parsing GLB model...');
//       setLoadingProgress(75);
      
//       if (!arrayBuffer || arrayBuffer.byteLength === 0) {
//         throw new Error('Received empty or invalid GLB model data');
//       }
      
//       console.log('GLB ArrayBuffer size:', arrayBuffer.byteLength, 'bytes');
      
//       const dracoLoader = new DRACOLoader();
//       dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
      
//       const loader = new GLTFLoader();
//       loader.setDRACOLoader(dracoLoader);
      
//       const loadModel = new Promise((resolve, reject) => {
//         const timeoutId = setTimeout(() => {
//           reject(new Error('GLB model loading timeout (30 seconds)'));
//         }, 30000);
        
//         loader.parse(
//           arrayBuffer,
//           '',
//           (gltf) => {
//             clearTimeout(timeoutId);
//             if (abortController.signal.aborted) {
//               reject(new Error('Loading cancelled'));
//               return;
//             }
//             console.log('GLTFLoader completed successfully');
//             resolve(gltf);
//           },
//           (error) => {
//             clearTimeout(timeoutId);
//             console.error('GLTFLoader error:', error);
//             reject(new Error(`Failed to parse GLB model: ${error.message || 'Unknown parsing error'}`));
//           }
//         );
//       });
      
//       const gltf = await loadModel;
      
//       if (abortController.signal.aborted) return;
      
//       console.log('GLB model loaded successfully from database');
//       setLoadingProgress(95);
      
//       if (!gltf || !gltf.scene) {
//         throw new Error('Loaded GLB model is empty or invalid');
//       }
      
//       try {
//         modelCacheRef.current.set(calcId, {
//           scene: gltf.scene.clone(),
//           animations: gltf.animations,
//           userData: gltf.userData
//         });
//         console.log('GLB model cached successfully');
//       } catch (cacheError) {
//         console.warn('Failed to cache GLB model:', cacheError);
//       }
      
//       processAndAddModel(gltf.scene);
//       setIsModelLoaded(true);
//       setLoadingProgress(100);
      
//     } catch (error) {
//       if (abortController.signal.aborted) return;
      
//       console.error('Error processing GLB ArrayBuffer:', error);
//       setIsError(true);
      
//       if (error.message.includes('timeout')) {
//         setLoadingMessage('GLB model loading timed out. The file might be too large.');
//       } else if (error.message.includes('parse') || error.message.includes('invalid')) {
//         setLoadingMessage('Failed to process GLB model. The file may be corrupted.');
//       } else if (error.message.includes('empty')) {
//         setLoadingMessage('The GLB model file appears to be empty. Please try regenerating it.');
//       } else {
//         setLoadingMessage(`GLB model processing failed: ${error.message}`);
//       }
//     }
//   };

//   const handleCostCalculationComplete = useCallback((calculationId) => {
//     console.log('Cost calculation completed with ID:', calculationId);
    
//     if (!calculationId || calculationId === 'undefined' || calculationId === 'null') {
//       console.error('Invalid calculation ID received:', calculationId);
//       setIsError(true);
//       setLoadingMessage('Invalid calculation ID received.');
//       return;
//     }
    
//     setCostCalculationId(calculationId);
//     localStorage.setItem('currentTurningCalculationId', calculationId);
    
//     if (loadingTimeout) {
//       clearTimeout(loadingTimeout);
//     }
    
//     const timeout = setTimeout(() => {
//       loadModelFromDatabase(calculationId);
//     }, 500);
    
//     setLoadingTimeout(timeout);
//   }, [loadModelFromDatabase, loadingTimeout]);

//   const processAndAddModel = useCallback((gltfScene) => {
//     if (!sceneRef.current) return;

//     if (modelRef.current && sceneRef.current) {
//       sceneRef.current.remove(modelRef.current);
//       modelRef.current.traverse((child) => {
//         if (child instanceof THREE.Mesh) {
//           if (child.geometry) child.geometry.dispose();
//           if (child.material) {
//             if (Array.isArray(child.material)) {
//               child.material.forEach(material => material.dispose());
//             } else {
//               child.material.dispose();
//             }
//           }
//         }
//       });
//     }

//     const box = new THREE.Box3().setFromObject(gltfScene);
//     const center = box.getCenter(new THREE.Vector3());
//     const size = box.getSize(new THREE.Vector3());
    
//     const modelGroup = new THREE.Group();
//     gltfScene.position.copy(center.negate());
//     modelGroup.add(gltfScene);
    
//     const maxDim = Math.max(size.x, size.y, size.z);
//     const scale = 4 / maxDim;
//     modelGroup.scale.set(scale, scale, scale);
    
//     modelRef.current = modelGroup;
    
//     if (controlsRef.current) {
//       controlsRef.current.target.set(0, 0, 0);
//     }
    
//     if (cameraRef.current) {
//       const distance = 4 * 1.5;
//       cameraRef.current.position.set(distance, distance, distance);
//       cameraRef.current.lookAt(0, 0, 0);
      
//       if (controlsRef.current) {
//         controlsRef.current.minDistance = 2.5;
//         controlsRef.current.maxDistance = 100;
//         controlsRef.current.update();
//       }
//     }
    
//     const sharedMaterial = new THREE.MeshStandardMaterial({
//       color: new THREE.Color(theme.cubeColors.top),
//       roughness: 0.6,
//       metalness: 0.4
//     });
    
//     gltfScene.traverse((child) => {
//       if (child instanceof THREE.Mesh) {
//         child.material = sharedMaterial;
//       }
//     });
    
//     sceneRef.current.add(modelGroup);
//     console.log('GLB model added to scene successfully');
//   }, []);

//   const createTextTexture = useCallback((text, color = '#000000', bgColor = '#ffffff') => {
//     const canvas = document.createElement('canvas');
//     const context = canvas.getContext('2d');
//     canvas.width = 256;
//     canvas.height = 256;
    
//     context.fillStyle = bgColor;
//     context.fillRect(0, 0, canvas.width, canvas.height);
    
//     context.fillStyle = color;
//     context.font = 'bold 24px Arial';
//     context.textAlign = 'center';
//     context.textBaseline = 'middle';
//     context.fillText(text, canvas.width / 2, canvas.height / 2);
    
//     const texture = new THREE.CanvasTexture(canvas);
//     texture.needsUpdate = true;
//     texture.minFilter = THREE.LinearFilter;
//     return texture;
//   }, []);

//   const createRoundedCubeGeometry = useCallback((size, radius, segments) => {
//     const geometry = new THREE.BoxGeometry(size, size, size, segments, segments, segments);
//     const positionAttribute = geometry.getAttribute('position');
    
//     for (let i = 0; i < positionAttribute.count; i++) {
//       const vertex = new THREE.Vector3();
//       vertex.fromBufferAttribute(positionAttribute, i);
      
//       const maxCoord = Math.max(Math.abs(vertex.x), Math.abs(vertex.y), Math.abs(vertex.z));
//       const factor = (maxCoord - radius) / maxCoord;
//       vertex.multiplyScalar(Math.max(factor, 0.8));
      
//       positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
//     }
    
//     geometry.computeVertexNormals();
//     return geometry;
//   }, []);

//   const initCubeScene = useCallback(() => {
//     if (!cubeCanvasRef.current) return null;

//     const width = 150;
//     const height = 150;

//     const scene = new THREE.Scene();
//     scene.background = null;

//     const aspect = width / height;
//     const frustumSize = 4;
//     const camera = new THREE.OrthographicCamera(
//       frustumSize * aspect / -2,
//       frustumSize * aspect / 2,
//       frustumSize / 2,
//       frustumSize / -2,
//       0.1,
//       1000
//     );
//     camera.position.set(3, 3, 3);
//     camera.lookAt(0, 0, 0);

//     const renderer = new THREE.WebGLRenderer({
//       canvas: cubeCanvasRef.current,
//       antialias: false,
//       alpha: true,
//       powerPreference: "high-performance"
//     });
//     renderer.setSize(width, height);
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//     const materials = [
//       new THREE.MeshBasicMaterial({ 
//         color: new THREE.Color(theme.cubeColors.right),
//         map: createTextTexture('RIGHT', '#ffffff', theme.cubeColors.right)
//       }),
//       new THREE.MeshBasicMaterial({ 
//         color: new THREE.Color(theme.cubeColors.left),
//         map: createTextTexture('LEFT', '#ffffff', theme.cubeColors.left)
//       }),
//       new THREE.MeshBasicMaterial({ 
//         color: new THREE.Color(theme.cubeColors.top),
//         map: createTextTexture('TOP', '#000000', theme.cubeColors.top)
//       }),
//       new THREE.MeshBasicMaterial({ 
//         color: new THREE.Color(theme.cubeColors.bottom),
//         map: createTextTexture('BOTTOM', '#ffffff', theme.cubeColors.bottom)
//       }),
//       new THREE.MeshBasicMaterial({ 
//         color: new THREE.Color(theme.cubeColors.front),
//         map: createTextTexture('FRONT', '#000000', theme.cubeColors.front)
//       }),
//       new THREE.MeshBasicMaterial({ 
//         color: new THREE.Color(theme.cubeColors.back),
//         map: createTextTexture('BACK', '#ffffff', theme.cubeColors.back)
//       })
//     ];

//     const cubeGeometry = createRoundedCubeGeometry(2, 0.1, 6);
//     const cube = new THREE.Mesh(cubeGeometry, materials);
//     scene.add(cube);

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
//     directionalLight.position.set(1, 1, 1);
//     scene.add(directionalLight);

//     return { scene, camera, cube, renderer };
//   }, [createTextTexture, createRoundedCubeGeometry]);

//   const moveCamera = useCallback((direction) => {
//     if (!controlsRef.current || !cameraRef.current) return;
    
//     const controls = controlsRef.current;
//     const camera = cameraRef.current;
//     const target = controls.target;
    
//     const offset = camera.position.clone().sub(target);
//     const radius = offset.length();
    
//     const angle = Math.PI / 12;
//     let rotationAngle = 0;
    
//     const spherical = new THREE.Spherical().setFromVector3(offset);
    
//     if (direction === 'up' || direction === 'down') {
//       rotationAngle = direction === 'up' ? angle : -angle;
//       spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi + rotationAngle));
//     } else if (direction === 'left' || direction === 'right') {
//       rotationAngle = direction === 'left' ? angle : -angle;
//       spherical.theta += rotationAngle;
//     }
    
//     const newPosition = new THREE.Vector3().setFromSpherical(spherical).add(target);
    
//     const startPos = camera.position.clone();
//     const duration = 300;
//     const startTime = performance.now();
    
//     const animateCamera = (currentTime) => {
//       const elapsed = currentTime - startTime;
//       const progress = Math.min(elapsed / duration, 1);
      
//       const easeProgress = progress < 0.5 
//         ? 2 * progress * progress 
//         : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
//       camera.position.lerpVectors(startPos, newPosition, easeProgress);
//       camera.lookAt(target);
//       controls.update();
      
//       if (progress < 1) {
//         requestAnimationFrame(animateCamera);
//       }
//     };
    
//     requestAnimationFrame(animateCamera);
//   }, []);

//   useEffect(() => {
//     if (!canvasRef.current) return;

//     let scene, camera, renderer, controls;
//     let cubeScene;
//     let frameId = null;

//     const init = () => {
//       scene = new THREE.Scene();
//       sceneRef.current = scene;
      
//       const width = canvasRef.current.clientWidth;
//       const height = canvasRef.current.clientHeight;
      
//       camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
//       camera.position.set(5, 5, 5);
//       cameraRef.current = camera;
      
//       renderer = new THREE.WebGLRenderer({ 
//         antialias: true, 
//         canvas: canvasRef.current,
//         alpha: true,
//         preserveDrawingBuffer: true,
//         powerPreference: "high-performance"
//       });
//       renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//       renderer.setSize(width, height);
//       renderer.shadowMap.enabled = true;
//       renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//       rendererRef.current = renderer;
      
//       controls = new OrbitControls(camera, renderer.domElement);
//       controls.enableDamping = true;
//       controls.dampingFactor = 0.05;
//       controls.enableZoom = true;
//       controls.zoomSpeed = 2.5;
//       controls.enablePan = false;
//       controls.target.set(0, 0, 0);
//       controls.autoRotate = false;
//       controls.enableRotate = true;
//       controlsRef.current = controls;
      
//       const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
//       scene.add(ambientLight);

//       const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x888888, 0.7);
//       scene.add(hemisphereLight);
      
//       cubeScene = initCubeScene();

//       if (costCalculationId && costCalculationId !== 'undefined' && costCalculationId !== 'null') {
//         console.log('Loading GLB model with validated calculation ID:', costCalculationId);
//         loadModelFromDatabase(costCalculationId);
//       } else {
//         console.log('No valid calculation ID available, waiting...');
//         setLoadingMessage('Waiting for calculation to complete...');
//       }
      
//       const animate = () => {
//         frameId = requestAnimationFrame(animate);
        
//         if (cubeScene && cubeScene.cube) {
//           cubeScene.cube.rotation.x = cubeRotation.x;
//           cubeScene.cube.rotation.y = cubeRotation.y;
          
//           if (cameraRef.current) {
//             const mainCam = cameraRef.current;
//             const cubeCamPos = mainCam.position.clone().normalize().multiplyScalar(4);
//             cubeScene.camera.position.copy(cubeCamPos);
//             cubeScene.camera.lookAt(0, 0, 0);
//           }
          
//           cubeScene.renderer.render(cubeScene.scene, cubeScene.camera);
//         }
        
//         controls.update();
//         renderer.render(scene, camera);
//       };
      
//       animate();
      
//       const handleResize = () => {
//         if (!canvasRef.current) return;
        
//         const width = canvasRef.current.clientWidth;
//         const height = canvasRef.current.clientHeight;
        
//         camera.aspect = width / height;
//         camera.updateProjectionMatrix();
//         renderer.setSize(width, height);
//       };
      
//       window.addEventListener('resize', handleResize);
      
//       return () => {
//         if (loadingAbortControllerRef.current) {
//           loadingAbortControllerRef.current.abort();
//         }
        
//         if (loadingTimeout) {
//           clearTimeout(loadingTimeout);
//         }
        
//         cancelAnimationFrame(frameId);
//         window.removeEventListener('resize', handleResize);
//         if (renderer) {
//           renderer.dispose();
//         }
//         if (cubeScene && cubeScene.renderer) {
//           cubeScene.renderer.dispose();
//         }
//       };
//     };
    
//     return init();
//   }, [costCalculationId, initCubeScene, loadModelFromDatabase, cubeRotation, loadingTimeout]);

//   useEffect(() => {
//     if (costCalculationId && costCalculationId !== 'undefined' && costCalculationId !== 'null') {
//       localStorage.setItem('currentTurningCalculationId', costCalculationId);
//       console.log('Updated localStorage with validated costCalculationId:', costCalculationId);
      
//       if (sceneRef.current && !isModelLoaded) {
//         setTimeout(() => {
//           loadModelFromDatabase(costCalculationId);
//         }, 100);
//       }
//     } else {
//       localStorage.removeItem('currentTurningCalculationId');
//       console.log('Removed invalid costCalculationId from localStorage');
//     }
//   }, [costCalculationId, isModelLoaded, loadModelFromDatabase]);

//   const handleFaceClick = useCallback((face) => {
//     if (!controlsRef.current || !cameraRef.current) return;
    
//     const cam = cameraRef.current;
//     const controls = controlsRef.current;
//     const distance = cam.position.distanceTo(controls.target);
    
//     let targetPosition = new THREE.Vector3();
//     let targetUp = new THREE.Vector3(0, 1, 0);
    
//     switch (face) {
//       case 'front':
//         targetPosition.set(0, 0, distance);
//         break;
//       case 'back':
//         targetPosition.set(0, 0, -distance);
//         break;
//       case 'right':
//         targetPosition.set(distance, 0, 0);
//         break;
//       case 'left':
//         targetPosition.set(-distance, 0, 0);
//         break;
//       case 'top':
//         targetPosition.set(0, distance, 0);
//         targetUp.set(0, 0, -1);
//         break;
//       case 'bottom':
//         targetPosition.set(0, -distance, 0);
//         targetUp.set(0, 0, 1);
//         break;
//       case 'isometric':
//         targetPosition.set(distance, distance, distance).normalize().multiplyScalar(distance);
//         break;
//       default:
//         return;
//     }
    
//     targetPosition.add(controls.target);
    
//     const startPos = cam.position.clone();
//     const startUp = cam.up.clone();
//     const duration = 500;
//     const startTime = performance.now();
    
//     const animateCamera = (currentTime) => {
//       const elapsed = currentTime - startTime;
//       const progress = Math.min(elapsed / duration, 1);
      
//       const easeProgress = progress < 0.5 
//         ? 2 * progress * progress 
//         : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
//       cam.position.lerpVectors(startPos, targetPosition, easeProgress);
//       cam.up.lerpVectors(startUp, targetUp, easeProgress);
      
//       cam.lookAt(controls.target);
//       controls.update();
      
//       if (progress < 1) {
//         requestAnimationFrame(animateCamera);
//       }
//     };
    
//     requestAnimationFrame(animateCamera);
//   }, []);

//   useEffect(() => {
//     return () => {
//       if (loadingAbortControllerRef.current) {
//         loadingAbortControllerRef.current.abort();
//       }
      
//       if (loadingTimeout) {
//         clearTimeout(loadingTimeout);
//       }
      
//       modelCacheRef.current.clear();
//     };
//   }, [loadingTimeout]);



//   //added new useEffect for capturing 3d display in ISO view 
// useEffect(() => {
//   const handleRequestTurningIsometricCapture = async (event) => {
//     try {
//       console.log('TurningViewerPage received isometric capture request');
      
//       // Validate required references
//       if (!cameraRef.current || !controlsRef.current || !canvasRef.current) {
//         console.error('Required THREE.js references not available');
//         window.dispatchEvent(new CustomEvent('turningIsometricCaptureComplete', {
//           detail: null
//         }));
//         return;
//       }
      
//       const camera = cameraRef.current;
//       const controls = controlsRef.current;
//       const canvas = canvasRef.current;
      
//       // Store original camera and control states
//       const originalPosition = camera.position.clone();
//       const originalUp = camera.up.clone();
//       const originalTarget = controls.target.clone();
//       const originalZoom = camera.zoom;
      
//       console.log('Original camera state saved');
      
//       try {
//         // Calculate isometric view position
//         // For isometric: equal angle from all three axes (typically 45° horizontal, 35.26° vertical)
//         const distance = originalPosition.distanceTo(originalTarget);
        
//         // Isometric view: position camera at equal distance on all three axes
//         const isometricDistance = distance * 0.866; // Adjust for proper scaling
//         const isoX = isometricDistance / Math.sqrt(3);
//         const isoY = isometricDistance / Math.sqrt(3);
//         const isoZ = isometricDistance / Math.sqrt(3);
        
//         const isoPosition = new THREE.Vector3(isoX, isoY, isoZ).add(originalTarget);
        
//         console.log('Setting isometric view position for turning model:', isoPosition);
        
//         // Apply isometric view
//         camera.position.copy(isoPosition);
//         camera.up.set(0, 1, 0); // Ensure up vector is normalized
//         camera.lookAt(originalTarget);
//         controls.update();
        
//         console.log('Isometric view applied');
        
//         // Wait for multiple render frames to ensure the view is properly rendered
//         await new Promise(resolve => {
//           let frameCount = 0;
//           const maxFrames = 3;
          
//           const waitForRender = () => {
//             frameCount++;
//             if (frameCount >= maxFrames) {
//               resolve();
//             } else {
//               requestAnimationFrame(waitForRender);
//             }
//           };
          
//           requestAnimationFrame(waitForRender);
//         });
        
//         console.log('Render frames completed, capturing canvas');
        
//         // Capture the canvas in isometric view
//         const tempCanvas = document.createElement('canvas');
//         tempCanvas.width = canvas.width;
//         tempCanvas.height = canvas.height;
        
//         const tempCtx = tempCanvas.getContext('2d', {
//           willReadFrequently: true,
//           alpha: true
//         });
        
//         if (!tempCtx) {
//           throw new Error('Could not get 2D context from temporary canvas');
//         }
        
//         // Draw the WebGL canvas content to temporary canvas
//         tempCtx.drawImage(canvas, 0, 0);
        
//         // Ensure WebGL rendering is complete
//         const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
//         if (gl) {
//           gl.finish();
//         }
        
//         // Convert to data URL
//         const dataUrl = tempCanvas.toDataURL('image/png', 1.0);
        
//         if (!dataUrl || dataUrl.length < 100) {
//           console.warn('Canvas capture produced invalid or empty image');
//           throw new Error('Canvas capture invalid');
//         }
        
//         console.log('Turning isometric view captured successfully, size:', (dataUrl.length / 1024).toFixed(2), 'KB');
        
//         // Send captured image back to TurningCostReport
//         window.dispatchEvent(new CustomEvent('turningIsometricCaptureComplete', {
//           detail: dataUrl
//         }));
        
//       } catch (captureError) {
//         console.error('Error during turning isometric capture:', captureError);
        
//         // Send null on error
//         window.dispatchEvent(new CustomEvent('turningIsometricCaptureComplete', {
//           detail: null
//         }));
        
//       } finally {
//         // ALWAYS restore original camera state
//         console.log('Restoring original camera state');
        
//         camera.position.copy(originalPosition);
//         camera.up.copy(originalUp);
//         camera.zoom = originalZoom;
//         camera.updateProjectionMatrix();
        
//         controls.target.copy(originalTarget);
//         controls.update();
        
//         console.log('Original camera state restored');
//       }
      
//     } catch (error) {
//       console.error('Fatal error in turning isometric capture handler:', error);
      
//       // Send error event
//       window.dispatchEvent(new CustomEvent('turningIsometricCaptureComplete', {
//         detail: null
//       }));
//     }
//   };
  
//   // Register listener
//   window.addEventListener('requestTurningIsometricCapture', handleRequestTurningIsometricCapture);
  
//   console.log('Turning isometric capture handler registered on TurningViewerPage');
  
//   // Cleanup on unmount
//   return () => {
//     window.removeEventListener('requestTurningIsometricCapture', handleRequestTurningIsometricCapture);
//     console.log('Turning isometric capture handler removed');
//   };
  
// }, []);  

//   return (
//     <Layout style={{ 
//       minHeight: '100vh', 
//       width: '100vw',
//       background: theme.background,
//       overflow: 'hidden'
//     }}>
//       <div style={{ 
//         height: '80px',
//         background: `#246679`,
//         padding: '0 40px', 
//         display: 'flex', 
//         alignItems: 'center', 
//         justifyContent: 'space-between',
//         boxShadow: '0 8px 32px rgba(20, 93, 160, 0.3), 0 0 0 1px rgba(20, 93, 160, 0.2)',
//         borderBottom: `4px solid #246679`,
//         position: 'sticky',
//         top: 0,
//         zIndex: 1000
//       }}>
//         <button 
//           onClick={() => navigate('/home/machine/grinding')}
//           style={{
//             position: 'absolute',
//             left: '16px',
//             padding: '8px',
//             borderRadius: '8px',
//             background: 'transparent',
//             border: 'none',
//             cursor: 'pointer',
//             transition: 'all 0.3s ease',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center'
            
//           }}
//           onMouseEnter={(e) => {
//             e.target.style.background = 'rgba(255, 255, 255, 0.2)';
//           }}
//           onMouseLeave={(e) => {
//             e.target.style.background = 'transparent';
//           }}
//           title="Back to Upload"
//         >
//           <FiArrowLeft style={{ 
//             width: '24px', 
//             height: '24px', 
//             color: '#ffffff',
//             transition: 'color 0.3s ease'
//           }} />
//         </button>

//         <div style={{  
//           position: 'absolute', 
//           left: '50%', 
//           transform: 'translateX(-50%)',
//           display: 'flex', 
//           alignItems: 'center' 
//         }}>
//           <Title level={3} style={{ 
//             margin: 0, 
//             color: '#ffffff', 
//             fontWeight: 600, 
//             fontSize: '24px',
//             textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
//           }}>
//            COST ESTIMATION SOFTWARE
//           </Title>
//         </div>
//       </div>

//       <Content style={{ 
//         padding: '30px 40px',
//         height: 'calc(100vh - 80px)',
//         overflow: 'auto'
//       }}>
//         <div style={{ 
//           maxWidth: '100%', 
//           margin: '0 auto',
//           height: '100%'
//         }}>
//           <Row gutter={[30, 30]} style={{ height: '100%' }}>
//             <Col xs={24} lg={12} style={{ height: '100%' }}>
//               <Card 
//                 title="" 
//                 style={{ 
//                   height: '100%', 
//                   boxShadow: theme.shadow,
//                   borderRadius: '8px',
//                   overflow: 'hidden',
//                   background: theme.cardBg,
//                   border: `1px solid ${theme.borderColor}`
//                 }}
//                 bodyStyle={{ 
//                   padding: '0', 
//                   height: 'calc(100% - 65px)', 
//                   position: 'relative',
//                   background: theme.modelBg
//                 }}
//               >
//                 <div style={{ position: 'relative', width: '100%', height: '100%' }}>
//                   <canvas 
//                     ref={canvasRef} 
//                     style={{
//                       width: '100%',
//                       height: '100%',
//                       display: 'block'
//                     }}
//                   />
                  
//                   <div style={{
//                     position: 'absolute',
//                     top: '10px',
//                     right: '10px',
//                     width: '240px',
//                     height: '240px',
//                     display: isModelLoaded ? 'block' : 'none'
//                   }}>
//                     <button
//                       onClick={() => moveCamera('up')}
//                       style={{
//                         position: 'absolute',
//                         left: '50%',
//                         top: '5px',
//                         transform: 'translateX(-50%)',
//                         background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
//                         border: '2px solid rgba(20, 93, 160, 0.3)',
//                         borderRadius: '50%',
//                         width: '36px',
//                         height: '36px',
//                         cursor: 'pointer',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         boxShadow: '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
//                         fontSize: '16px',
//                         fontWeight: 'bold',
//                         color: '#145da0',
//                         zIndex: 10,
//                         transition: 'all 0.2s ease',
//                         backdropFilter: 'blur(10px)'
//                       }}
//                       title="Move Camera Up"
//                     >
//                       ↑
//                     </button>

//                     <button
//                       onClick={() => moveCamera('left')}
//                       style={{
//                         position: 'absolute',
//                         left: '20px',
//                         top: '50%',
//                         transform: 'translateY(-50%)',
//                         background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
//                         border: '2px solid rgba(20, 93, 160, 0.3)',
//                         borderRadius: '50%',
//                         width: '36px',
//                         height: '36px',
//                         cursor: 'pointer',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         boxShadow: '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
//                         fontSize: '16px',
//                         fontWeight: 'bold',
//                         color: '#145da0',
//                         zIndex: 10,
//                         transition: 'all 0.2s ease',
//                         backdropFilter: 'blur(10px)'
//                       }}
//                       title="Move Camera Left"
//                     >
//                       ←
//                     </button>

//                     <div style={{
//                       position: 'absolute',
//                       left: '50%',
//                       top: '50%',
//                       transform: 'translate(-50%, -50%)',
//                       width: '150px',
//                       height: '150px',
//                       overflow: 'hidden',
//                       pointerEvents: 'none'
//                     }}>
//                       <canvas 
//                         ref={cubeCanvasRef} 
//                         style={{
//                           width: '100%',
//                           height: '100%',
//                           display: 'block'
//                         }}
//                       />
                      
//                       <div style={{
//                         position: 'absolute',
//                         top: 0,
//                         left: 0,
//                         right: 0,
//                         bottom: 0,
//                         display: 'grid',
//                         gridTemplateColumns: 'repeat(3, 1fr)',
//                         gridTemplateRows: 'repeat(3, 1fr)',
//                         pointerEvents: 'auto'
//                       }}>
//                         <div 
//                           onClick={() => handleFaceClick('top')}
//                           style={{ 
//                             gridColumn: 2, 
//                             gridRow: 1, 
//                             cursor: 'pointer',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center'
//                           }}
//                           title="Top View"
//                         />
//                         <div 
//                           onClick={() => handleFaceClick('left')}
//                           style={{ 
//                             gridColumn: 1, 
//                             gridRow: 2, 
//                             cursor: 'pointer',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center'
//                           }}
//                           title="Left View"
//                         />
//                         <div 
//                           onClick={() => handleFaceClick('front')}
//                           style={{ 
//                             gridColumn: 2, 
//                             gridRow: 2, 
//                             cursor: 'pointer',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center'
//                           }}
//                           title="Front View"
//                         />
//                         <div 
//                           onClick={() => handleFaceClick('right')}
//                           style={{ 
//                             gridColumn: 3, 
//                             gridRow: 2, 
//                             cursor: 'pointer',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center'
//                           }}
//                           title="Right View"
//                         />
//                         <div 
//                           onClick={() => handleFaceClick('bottom')}
//                           style={{ 
//                             gridColumn: 2, 
//                             gridRow: 3, 
//                             cursor: 'pointer',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center'
//                           }}
//                           title="Bottom View"
//                         />
//                       </div>
//                     </div>

//                     <button
//                       onClick={() => moveCamera('right')}
//                       style={{
//                         position: 'absolute',
//                         right: '20px',
//                         top: '50%',
//                         transform: 'translateY(-50%)',
//                         background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
//                         border: '2px solid rgba(20, 93, 160, 0.3)',
//                         borderRadius: '50%',
//                         width: '36px',
//                         height: '36px',
//                         cursor: 'pointer',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         boxShadow: '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
//                         fontSize: '16px',
//                         fontWeight: 'bold',
//                         color: '#145da0',
//                         zIndex: 10,
//                         transition: 'all 0.2s ease',
//                         backdropFilter: 'blur(10px)'
//                       }}
//                       title="Move Camera Right"
//                     >
//                       →
//                     </button>

//                     <button
//                       onClick={() => moveCamera('down')}
//                       style={{
//                         position: 'absolute',
//                         left: '50%',
//                         bottom: '5px',
//                         transform: 'translateX(-50%)',
//                         background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
//                         border: '2px solid rgba(20, 93, 160, 0.3)',
//                         borderRadius: '50%',
//                         width: '36px',
//                         height: '36px',
//                         cursor: 'pointer',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         boxShadow: '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
//                         fontSize: '16px',
//                         fontWeight: 'bold',
//                         color: '#145da0',
//                         zIndex: 10,
//                         transition: 'all 0.2s ease',
//                         backdropFilter: 'blur(10px)'
//                       }}
//                       title="Move Camera Down"
//                     >
//                       ↓
//                     </button>
//                   </div>

//                   <div style={{
//                     position: 'absolute',
//                     bottom: '10px',
//                     right: '10px',
//                     display: 'flex',
//                     gap: '8px'
//                   }}>
//                     <button
//                       onClick={() => handleFaceClick('isometric')}
//                       style={{
//                         background: 'rgba(255,255,255,0.9)',
//                         border: '2px solid #ddd',
//                         borderRadius: '6px',
//                         padding: '8px 12px',
//                         cursor: 'pointer',
//                         fontSize: '12px',
//                         fontWeight: 'bold',
//                         boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
//                         transition: 'all 0.2s ease'
//                       }}
//                       onMouseEnter={(e) => {
//                         e.target.style.background = 'rgba(20, 93, 160, 0.1)';
//                       }}
//                       onMouseLeave={(e) => {
//                         e.target.style.background = 'rgba(255,255,255,0.9)';
//                       }}
//                       title="Isometric View"
//                     >
//                       ISO
//                     </button>
//                     <button
//                       onClick={() => {
//                         const elem = document.documentElement;
//                         if (!document.fullscreenElement) {
//                           elem.requestFullscreen();
//                         } else {
//                           document.exitFullscreen();
//                         }
//                       }}
//                       style={{
//                         background: 'rgba(255,255,255,0.9)',
//                         border: '2px solid #ddd',
//                         borderRadius: '6px',
//                         padding: '8px',
//                         cursor: 'pointer',
//                         transition: 'all 0.2s ease'
//                       }}
//                       onMouseEnter={(e) => {
//                         e.target.style.background = 'rgba(20, 93, 160, 0.1)';
//                       }}
//                       onMouseLeave={(e) => {
//                         e.target.style.background = 'rgba(255,255,255,0.9)';
//                       }}
//                       title="Toggle Fullscreen"
//                     >
//                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                         <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
//                       </svg>
//                     </button>
//                   </div>
//                 </div>
                
//                 {!isModelLoaded && !isError && (
//                   <div style={{
//                     position: 'absolute',
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     bottom: 0,
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     background: 'rgba(255, 255, 255, 0.95)',
//                     backdropFilter: 'blur(5px)'
//                   }}>
//                     <div style={{ textAlign: 'center', maxWidth: '300px' }}>
//                       <div style={{
//                         border: `4px solid ${theme.primary}33`,
//                         borderTop: `4px solid ${theme.primary}`,
//                         borderRadius: '50%',
//                         width: '48px',
//                         height: '48px',
//                         animation: 'spin 1s linear infinite',
//                         margin: '0 auto 20px'
//                       }} />
                      
//                       {loadingProgress > 0 && (
//                         <div style={{
//                           width: '200px',
//                           height: '8px',
//                           background: '#f0f0f0',
//                           borderRadius: '4px',
//                           margin: '0 auto 16px',
//                           overflow: 'hidden'
//                         }}>
//                           <div style={{
//                             width: `${loadingProgress}%`,
//                             height: '100%',
//                             background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
//                             borderRadius: '4px',
//                             transition: 'width 0.3s ease'
//                           }} />
//                         </div>
//                       )}
                      
//                       <Text style={{ 
//                         color: theme.primary, 
//                         fontSize: '16px',
//                         fontWeight: '500'
//                       }}>
//                         {loadingMessage}
//                       </Text>
                      
//                       {loadingProgress > 0 && (
//                         <div style={{ marginTop: '8px' }}>
//                           <Text style={{ 
//                             color: theme.textSecondary, 
//                             fontSize: '14px'
//                           }}>
//                             {loadingProgress}% complete
//                           </Text>
//                         </div>
//                       )}
                      
//                       {!costCalculationId && (
//                         <div style={{ 
//                           marginTop: '16px',
//                           padding: '12px',
//                           background: 'rgba(250, 173, 20, 0.1)',
//                           borderRadius: '6px',
//                           border: '1px solid rgba(250, 173, 20, 0.3)'
//                         }}>
//                           <Text style={{ 
//                             color: theme.warning, 
//                             fontSize: '14px'
//                           }}>
//                             Waiting for cost calculation to complete...
//                           </Text>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}
                
//                 {isError && (
//                   <div style={{
//                     position: 'absolute',
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     bottom: 0,
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     background: 'rgba(255, 255, 255, 0.95)',
//                     backdropFilter: 'blur(5px)'
//                   }}>
//                     <div style={{ textAlign: 'center', maxWidth: '350px' }}>
//                       <div style={{
//                         width: '48px',
//                         height: '48px',
//                         background: theme.error,
//                         borderRadius: '50%',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         margin: '0 auto 20px',
//                         color: 'white',
//                         fontSize: '24px',
//                         fontWeight: 'bold'
//                       }}>
//                         !
//                       </div>
                      
//                       <Text style={{ 
//                         color: theme.error, 
//                         fontSize: '16px',
//                         fontWeight: '500',
//                         marginBottom: '16px',
//                         display: 'block'
//                       }}>
//                         {loadingMessage}
//                       </Text>
                      
//                       <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
//                         {costCalculationId && (
//                           <button
//                             onClick={() => {
//                               setIsError(false);
//                               setLoadingProgress(0);
//                               loadModelFromDatabase(costCalculationId);
//                             }}
//                             style={{
//                               background: theme.primary,
//                               color: 'white',
//                               border: 'none',
//                               padding: '10px 20px',
//                               borderRadius: '6px',
//                               cursor: 'pointer',
//                               fontSize: '14px',
//                               fontWeight: '500',
//                               transition: 'all 0.2s ease',
//                               boxShadow: '0 2px 8px rgba(20, 93, 160, 0.3)'
//                             }}
//                             onMouseEnter={(e) => {
//                               e.target.style.background = theme.secondary;
//                             }}
//                             onMouseLeave={(e) => {
//                               e.target.style.background = theme.primary;
//                             }}
//                           >
//                             Retry Loading
//                           </button>
//                         )}
                        
//                         <button
//                           onClick={() => {
//                             setIsError(false);
//                             setIsModelLoaded(false);
//                             setLoadingMessage('Waiting for calculation ID...');
//                           }}
//                           style={{
//                             background: 'transparent',
//                             color: theme.textSecondary,
//                             border: `1px solid ${theme.borderColor}`,
//                             padding: '10px 20px',
//                             borderRadius: '6px',
//                             cursor: 'pointer',
//                             fontSize: '14px',
//                             transition: 'all 0.2s ease'
//                           }}
//                           onMouseEnter={(e) => {
//                             e.target.style.borderColor = theme.primary;
//                             e.target.style.color = theme.primary;
//                           }}
//                           onMouseLeave={(e) => {
//                             e.target.style.borderColor = theme.borderColor;
//                             e.target.style.color = theme.textSecondary;
//                           }}
//                         >
//                           Reset
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </Card>
//             </Col>

//             <Col xs={24} lg={12} style={{ height: '100%' }}>
//               <Card 
//                 title="Manufacturing Cost Report" 
//                 style={{ 
//                   height: '100%', 
//                   boxShadow: theme.shadow,
//                   borderRadius: '8px',
//                   background: theme.cardBg,
//                   border: `1px solid ${theme.borderColor}`
//                 }}
//                 bodyStyle={{ 
//                   padding: '0', 
//                   height: 'calc(100% - 65px)', 
//                   overflow: 'hidden'
//                 }}
//                 extra={
//                   <Button 
//                     icon={<FiDownload />}
//                     onClick={() => reportActionRef.current && reportActionRef.current()}
//                     style={{ 
//                       borderRadius: '6px', 
//                       height: '40px', 
//                       fontWeight: 500, 
//                       backgroundColor: '#246679',
//                       borderColor: '#246679',
//                       color: 'white'
//                     }}
//                   >
//                     Download PDF Report
//                   </Button>
//                 }
//               >
                // <TurningCostReport 
                //   analysisData={analysisData} 
                //   theme={theme} 
                //   onCostCalculationComplete={handleCostCalculationComplete}
                //   costCalculationId={costCalculationId}
                //   initialCostData={location.state?.initialCostData}
                //   onRegisterReport={(action) => { reportActionRef.current = action; }}
                // />
//               </Card>
//             </Col>
//           </Row>
//         </div>
//       </Content>

//       <style jsx global>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </Layout>
//   );
// }

// export default TurningViewerPage;





// '''''this is the new code which if stepfiel has it color that color will display in 3d displaying if color doesnt conatined by step file then it will display in white color
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Layout, Card, Typography, Row, Col, Button } from 'antd';
import { FiArrowLeft, FiDownload } from 'react-icons/fi';
import TurningCostReport from './TurningCostReport';

const { Content } = Layout;
const { Title, Text } = Typography;

const theme = {
  primary: '#145da0',
  secondary: '#246679',
  success: '#52c41a',
  warning: '#faad14',
  error: '#f5222d',
  background: '#f0f2f5',
  cardBg: '#ffffff',
  textPrimary: '#262626',
  textSecondary: '#8c8c8c',
  borderColor: '#d9d9d9',
  shadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  lightBlue: '#e6f7ff',
  darkBlue: '#001d66',
  accent: '#145da0',
  inputBg: '#ffffff',
  inputBorder: '#d9d9d9',
  modelBg: '#f8f9fa',
  buttonColor: '#246679',
  headerBg: '#145da0',
  cubeColors: {
    front: '#B0B0B0',
    back: '#888888',
    top: '#D3D3D3',
    bottom: '#6E6E6E',
    left: '#A9A9A9',
    right: '#505050'
  }
};

function TurningViewerPage() {
  const location = useLocation();
  const { id } = useParams();
  const canvasRef = useRef(null);
  const cubeCanvasRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const modelRef = useRef(null);
  const rendererRef = useRef(null);
  const loadingAbortControllerRef = useRef(null);
  const modelCacheRef = useRef(new Map());
  
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Waiting for calculation ID...');
  const [cubeRotation, setCubeRotation] = useState({ x: 0, y: 0 });
  const [loadingProgress, setLoadingProgress] = useState(0);
  const navigate = useNavigate();
  
  const [costCalculationId, setCostCalculationId] = useState(() => {
    const possibleId = id || 
                      location.state?.costCalculationId || 
                      localStorage.getItem('currentTurningCalculationId');
    
    return possibleId && possibleId !== 'undefined' && possibleId !== 'null' 
      ? possibleId 
      : null;
  });

  const { analysisData } = location.state || {};
  const [loadingTimeout, setLoadingTimeout] = useState(null);
  const reportActionRef = useRef(null);

  const loadModelFromDatabase = useCallback(async (calcId) => {
    if (!calcId || calcId === 'undefined' || calcId === 'null' || calcId.toString().trim() === '') {
      console.log('Invalid calculation ID provided:', calcId);
      setIsError(true);
      setLoadingMessage('Invalid calculation ID. Please try again.');
      return;
    }

    if (loadingAbortControllerRef.current) {
      loadingAbortControllerRef.current.abort();
    }

    if (modelCacheRef.current.has(calcId)) {
      console.log('Loading model from cache');
      const cachedModel = modelCacheRef.current.get(calcId);
      processAndAddModel(cachedModel.scene.clone());
      setIsModelLoaded(true);
      return;
    }

    console.log('Loading Draco GLB model from database with validated ID:', calcId);
    setIsModelLoaded(false);
    setIsError(false);
    setLoadingProgress(0);
    setLoadingMessage('Connecting to server...');
    
    const abortController = new AbortController();
    loadingAbortControllerRef.current = abortController;
    
    try {
      setLoadingMessage('Downloading 3D model (Draco GLB format)...');
      
      const response = await fetch(`http://172.18.100.156:8004/turning/download-draco-glb/${calcId}`, {
        signal: abortController.signal,
        method: 'GET',
        headers: {
          'Accept': 'model/gltf-binary, application/octet-stream, */*',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (abortController.signal.aborted) return;
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('Draco GLB not found, trying regular GLB...');
          await loadRegularGlbFallback(calcId, abortController);
          return;
        }
        throw new Error(`Server error: ${response.status} - ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      console.log('Response content type:', contentType);
      
      setLoadingMessage('Processing GLB model...');
      const contentLength = +response.headers.get('content-length') || 0;
      let arrayBuffer;
      
      if (contentLength > 0 && response.body && response.body.getReader) {
        try {
          const reader = response.body.getReader();
          let receivedLength = 0;
          let chunks = [];
          
          while (true) {
            const { done, value } = await reader.read();
            
            if (abortController.signal.aborted) {
              reader.releaseLock();
              return;
            }
            
            if (done) break;
            
            chunks.push(value);
            receivedLength += value.length;
            
            const progress = Math.round((receivedLength / contentLength) * 70);
            setLoadingProgress(progress);
          }
          
          const uint8Array = new Uint8Array(receivedLength);
          let position = 0;
          for (let chunk of chunks) {
            uint8Array.set(chunk, position);
            position += chunk.length;
          }
          arrayBuffer = uint8Array.buffer;
          reader.releaseLock();
          
        } catch (streamError) {
          console.warn('Stream reading failed, falling back to arrayBuffer():', streamError);
          arrayBuffer = await response.arrayBuffer();
        }
      } else {
        setLoadingProgress(40);
        arrayBuffer = await response.arrayBuffer();
      }
      
      if (abortController.signal.aborted) return;
      
      await loadModelFromArrayBuffer(arrayBuffer, calcId, abortController);
      
    } catch (error) {
      if (abortController.signal.aborted) {
        console.log('Model loading was cancelled');
        return;
      }
      
      console.error('Error fetching GLB model from database:', error);
      setIsError(true);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setLoadingMessage('Connection failed. Please check your network connection.');
      } else if (error.message.includes('404')) {
        setLoadingMessage('GLB model not found. The calculation may still be processing.');
      } else if (error.message.includes('500')) {
        setLoadingMessage('Server error. Please try again later.');
      } else {
        setLoadingMessage(`Failed to load GLB model: ${error.message}`);
      }
    }
  }, []);

  const loadRegularGlbFallback = async (calcId, abortController) => {
    try {
      setLoadingMessage('Loading regular GLB model...');
      setLoadingProgress(50);
      
      const response = await fetch(`http://172.18.100.156:8004/turning/download-glb/${calcId}`, {
        signal: abortController.signal,
        method: 'GET',
        headers: {
          'Accept': 'model/gltf-binary, application/octet-stream, */*',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Regular GLB not found: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      await loadModelFromArrayBuffer(arrayBuffer, calcId, abortController);
      
    } catch (error) {
      console.error('Regular GLB fallback failed:', error);
      throw error;
    }
  };

  const loadModelFromArrayBuffer = async (arrayBuffer, calcId, abortController) => {
    try {
      if (abortController.signal.aborted) return;

      setLoadingMessage('Parsing GLB model...');
      setLoadingProgress(75);
      
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error('Received empty or invalid GLB model data');
      }
      
      console.log('GLB ArrayBuffer size:', arrayBuffer.byteLength, 'bytes');
      
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('/draco/');
      
      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);
      
      const loadModel = new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('GLB model loading timeout (30 seconds)'));
        }, 30000);
        
        loader.parse(
          arrayBuffer,
          '',
          (gltf) => {
            clearTimeout(timeoutId);
            if (abortController.signal.aborted) {
              reject(new Error('Loading cancelled'));
              return;
            }
            console.log('GLTFLoader completed successfully');
            resolve(gltf);
          },
          (error) => {
            clearTimeout(timeoutId);
            console.error('GLTFLoader error:', error);
            reject(new Error(`Failed to parse GLB model: ${error.message || 'Unknown parsing error'}`));
          }
        );
      });
      
      const gltf = await loadModel;
      
      if (abortController.signal.aborted) return;
      
      console.log('GLB model loaded successfully from database');
      setLoadingProgress(95);
      
      if (!gltf || !gltf.scene) {
        throw new Error('Loaded GLB model is empty or invalid');
      }
      
      try {
        modelCacheRef.current.set(calcId, {
          scene: gltf.scene.clone(),
          animations: gltf.animations,
          userData: gltf.userData
        });
        console.log('GLB model cached successfully');
      } catch (cacheError) {
        console.warn('Failed to cache GLB model:', cacheError);
      }
      
      processAndAddModel(gltf.scene);
      setIsModelLoaded(true);
      setLoadingProgress(100);
      
    } catch (error) {
      if (abortController.signal.aborted) return;
      
      console.error('Error processing GLB ArrayBuffer:', error);
      setIsError(true);
      
      if (error.message.includes('timeout')) {
        setLoadingMessage('GLB model loading timed out. The file might be too large.');
      } else if (error.message.includes('parse') || error.message.includes('invalid')) {
        setLoadingMessage('Failed to process GLB model. The file may be corrupted.');
      } else if (error.message.includes('empty')) {
        setLoadingMessage('The GLB model file appears to be empty. Please try regenerating it.');
      } else {
        setLoadingMessage(`GLB model processing failed: ${error.message}`);
      }
    }
  };

  const handleCostCalculationComplete = useCallback((calculationId) => {
    console.log('Cost calculation completed with ID:', calculationId);
    
    if (!calculationId || calculationId === 'undefined' || calculationId === 'null') {
      console.error('Invalid calculation ID received:', calculationId);
      setIsError(true);
      setLoadingMessage('Invalid calculation ID received.');
      return;
    }
    
    setCostCalculationId(calculationId);
    localStorage.setItem('currentTurningCalculationId', calculationId);
    
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }
    
    const timeout = setTimeout(() => {
      loadModelFromDatabase(calculationId);
    }, 500);
    
    setLoadingTimeout(timeout);
  }, [loadModelFromDatabase, loadingTimeout]);

  // ✅ PRESERVE ORIGINAL GLB COLORS - Enhanced for Turning
  const processAndAddModel = useCallback((gltfScene) => {
    if (!sceneRef.current) return;

    if (modelRef.current && sceneRef.current) {
      sceneRef.current.remove(modelRef.current);
      modelRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
    }

    const box = new THREE.Box3().setFromObject(gltfScene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    const modelGroup = new THREE.Group();
    gltfScene.position.copy(center.negate());
    modelGroup.add(gltfScene);
    
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 4 / maxDim;
    modelGroup.scale.set(scale, scale, scale);
    
    modelRef.current = modelGroup;
    
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
    }
    
    if (cameraRef.current) {
      const distance = 4 * 1.5;
      cameraRef.current.position.set(distance, distance, distance);
      cameraRef.current.lookAt(0, 0, 0);
      
      if (controlsRef.current) {
        controlsRef.current.minDistance = 2.5;
        controlsRef.current.maxDistance = 100;
        controlsRef.current.update();
      }
    }
    
    // ✅ PRESERVE ORIGINAL GLB COLORS - ENHANCE VISIBILITY
    gltfScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => {
            mat.side = THREE.DoubleSide;
            
            // Ensure material is visible
            if (mat.emissive) {
              // If material has very dark color, boost it with emissive
              if (mat.color) {
                const brightness = (mat.color.r + mat.color.g + mat.color.b) / 3;
                if (brightness < 0.3) {
                  // Material is dark, boost visibility
                  mat.emissive = new THREE.Color(mat.color);
                  mat.emissiveIntensity = 0.3;
                }
              }
            }
            
            // Improve lighting response
            if (mat.name !== 'LineBasicMaterial' && mat.name !== 'PointsMaterial') {
              if (mat.roughness !== undefined) mat.roughness = Math.min(mat.roughness || 0.5, 0.8);
              if (mat.metalness !== undefined) mat.metalness = Math.min(mat.metalness || 0, 0.2);
            }
          });
        } else {
          child.material.side = THREE.DoubleSide;
          
          // Ensure material is visible
          if (child.material.emissive) {
            if (child.material.color) {
              const brightness = (child.material.color.r + child.material.color.g + child.material.color.b) / 3;
              if (brightness < 0.3) {
                child.material.emissive = new THREE.Color(child.material.color);
                child.material.emissiveIntensity = 0.3;
              }
            }
          }
          
          // Improve lighting response
          if (child.material.roughness !== undefined) child.material.roughness = Math.min(child.material.roughness || 0.5, 0.8);
          if (child.material.metalness !== undefined) child.material.metalness = Math.min(child.material.metalness || 0, 0.2);
        }
      }
    });
    
    sceneRef.current.add(modelGroup);
    console.log('✅ GLB model added to scene - COLORS PRESERVED FROM FILE');
  }, []);

  const createTextTexture = useCallback((text, color = '#000000', bgColor = '#ffffff') => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 256;
    
    context.fillStyle = bgColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.fillStyle = color;
    context.font = 'bold 24px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }, []);

  const createRoundedCubeGeometry = useCallback((size, radius, segments) => {
    const geometry = new THREE.BoxGeometry(size, size, size, segments, segments, segments);
    const positionAttribute = geometry.getAttribute('position');
    
    for (let i = 0; i < positionAttribute.count; i++) {
      const vertex = new THREE.Vector3();
      vertex.fromBufferAttribute(positionAttribute, i);
      
      const maxCoord = Math.max(Math.abs(vertex.x), Math.abs(vertex.y), Math.abs(vertex.z));
      const factor = (maxCoord - radius) / maxCoord;
      vertex.multiplyScalar(Math.max(factor, 0.8));
      
      positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  const initCubeScene = useCallback(() => {
    if (!cubeCanvasRef.current) return null;

    const width = 150;
    const height = 150;

    const scene = new THREE.Scene();
    scene.background = null;

    const aspect = width / height;
    const frustumSize = 4;
    const camera = new THREE.OrthographicCamera(
      frustumSize * aspect / -2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    );
    camera.position.set(3, 3, 3);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: cubeCanvasRef.current,
      antialias: false,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const materials = [
      new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(theme.cubeColors.right),
        map: createTextTexture('RIGHT', '#ffffff', theme.cubeColors.right)
      }),
      new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(theme.cubeColors.left),
        map: createTextTexture('LEFT', '#ffffff', theme.cubeColors.left)
      }),
      new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(theme.cubeColors.top),
        map: createTextTexture('TOP', '#000000', theme.cubeColors.top)
      }),
      new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(theme.cubeColors.bottom),
        map: createTextTexture('BOTTOM', '#ffffff', theme.cubeColors.bottom)
      }),
      new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(theme.cubeColors.front),
        map: createTextTexture('FRONT', '#000000', theme.cubeColors.front)
      }),
      new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(theme.cubeColors.back),
        map: createTextTexture('BACK', '#ffffff', theme.cubeColors.back)
      })
    ];

    const cubeGeometry = createRoundedCubeGeometry(2, 0.1, 6);
    const cube = new THREE.Mesh(cubeGeometry, materials);
    scene.add(cube);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    return { scene, camera, cube, renderer };
  }, [createTextTexture, createRoundedCubeGeometry]);

  const moveCamera = useCallback((direction) => {
    if (!controlsRef.current || !cameraRef.current) return;
    
    const controls = controlsRef.current;
    const camera = cameraRef.current;
    const target = controls.target;
    
    const offset = camera.position.clone().sub(target);
    const radius = offset.length();
    
    const angle = Math.PI / 12;
    let rotationAngle = 0;
    
    const spherical = new THREE.Spherical().setFromVector3(offset);
    
    if (direction === 'up' || direction === 'down') {
      rotationAngle = direction === 'up' ? angle : -angle;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi + rotationAngle));
    } else if (direction === 'left' || direction === 'right') {
      rotationAngle = direction === 'left' ? angle : -angle;
      spherical.theta += rotationAngle;
    }
    
    const newPosition = new THREE.Vector3().setFromSpherical(spherical).add(target);
    
    const startPos = camera.position.clone();
    const duration = 300;
    const startTime = performance.now();
    
    const animateCamera = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      camera.position.lerpVectors(startPos, newPosition, easeProgress);
      camera.lookAt(target);
      controls.update();
      
      if (progress < 1) {
        requestAnimationFrame(animateCamera);
      }
    };
    
    requestAnimationFrame(animateCamera);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    let scene, camera, renderer, controls;
    let cubeScene;
    let frameId = null;

    const init = () => {
      scene = new THREE.Scene();
      sceneRef.current = scene;
      
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(5, 5, 5);
      cameraRef.current = camera;
      
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        canvas: canvasRef.current,
        alpha: true,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance"
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current = renderer;
      
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = true;
      controls.zoomSpeed = 2.5;
      controls.enablePan = false;
      controls.target.set(0, 0, 0);
      controls.autoRotate = false;
      controls.enableRotate = true;
      controlsRef.current = controls;
      
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);

      const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xaaaaaa, 1.0);
      scene.add(hemisphereLight);
      
      // Add additional directional light for better color visibility
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 10, 7);
      scene.add(directionalLight);
      
      cubeScene = initCubeScene();

      if (costCalculationId && costCalculationId !== 'undefined' && costCalculationId !== 'null') {
        console.log('Loading GLB model with validated calculation ID:', costCalculationId);
        loadModelFromDatabase(costCalculationId);
      } else {
        console.log('No valid calculation ID available, waiting...');
        setLoadingMessage('Waiting for calculation to complete...');
      }
      
      const animate = () => {
        frameId = requestAnimationFrame(animate);
        
        if (cubeScene && cubeScene.cube) {
          cubeScene.cube.rotation.x = cubeRotation.x;
          cubeScene.cube.rotation.y = cubeRotation.y;
          
          if (cameraRef.current) {
            const mainCam = cameraRef.current;
            const cubeCamPos = mainCam.position.clone().normalize().multiplyScalar(4);
            cubeScene.camera.position.copy(cubeCamPos);
            cubeScene.camera.lookAt(0, 0, 0);
          }
          
          cubeScene.renderer.render(cubeScene.scene, cubeScene.camera);
        }
        
        controls.update();
        renderer.render(scene, camera);
      };
      
      animate();
      
      const handleResize = () => {
        if (!canvasRef.current) return;
        
        const width = canvasRef.current.clientWidth;
        const height = canvasRef.current.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        if (loadingAbortControllerRef.current) {
          loadingAbortControllerRef.current.abort();
        }
        
        if (loadingTimeout) {
          clearTimeout(loadingTimeout);
        }
        
        cancelAnimationFrame(frameId);
        window.removeEventListener('resize', handleResize);
        if (renderer) {
          renderer.dispose();
        }
        if (cubeScene && cubeScene.renderer) {
          cubeScene.renderer.dispose();
        }
      };
    };
    
    return init();
  }, [costCalculationId, initCubeScene, loadModelFromDatabase, cubeRotation, loadingTimeout]);

  useEffect(() => {
    if (costCalculationId && costCalculationId !== 'undefined' && costCalculationId !== 'null') {
      localStorage.setItem('currentTurningCalculationId', costCalculationId);
      console.log('Updated localStorage with validated costCalculationId:', costCalculationId);
      
      if (sceneRef.current && !isModelLoaded) {
        setTimeout(() => {
          loadModelFromDatabase(costCalculationId);
        }, 100);
      }
    } else {
      localStorage.removeItem('currentTurningCalculationId');
      console.log('Removed invalid costCalculationId from localStorage');
    }
  }, [costCalculationId, isModelLoaded, loadModelFromDatabase]);

  const handleFaceClick = useCallback((face) => {
    if (!controlsRef.current || !cameraRef.current) return;
    
    const cam = cameraRef.current;
    const controls = controlsRef.current;
    const distance = cam.position.distanceTo(controls.target);
    
    let targetPosition = new THREE.Vector3();
    let targetUp = new THREE.Vector3(0, 1, 0);
    
    switch (face) {
      case 'front':
        targetPosition.set(0, 0, distance);
        break;
      case 'back':
        targetPosition.set(0, 0, -distance);
        break;
      case 'right':
        targetPosition.set(distance, 0, 0);
        break;
      case 'left':
        targetPosition.set(-distance, 0, 0);
        break;
      case 'top':
        targetPosition.set(0, distance, 0);
        targetUp.set(0, 0, -1);
        break;
      case 'bottom':
        targetPosition.set(0, -distance, 0);
        targetUp.set(0, 0, 1);
        break;
      case 'isometric':
        targetPosition.set(distance, distance, distance).normalize().multiplyScalar(distance);
        break;
      default:
        return;
    }
    
    targetPosition.add(controls.target);
    
    const startPos = cam.position.clone();
    const startUp = cam.up.clone();
    const duration = 500;
    const startTime = performance.now();
    
    const animateCamera = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      cam.position.lerpVectors(startPos, targetPosition, easeProgress);
      cam.up.lerpVectors(startUp, targetUp, easeProgress);
      
      cam.lookAt(controls.target);
      controls.update();
      
      if (progress < 1) {
        requestAnimationFrame(animateCamera);
      }
    };
    
    requestAnimationFrame(animateCamera);
  }, []);

  useEffect(() => {
    return () => {
      if (loadingAbortControllerRef.current) {
        loadingAbortControllerRef.current.abort();
      }
      
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
      
      modelCacheRef.current.clear();
    };
  }, [loadingTimeout]);

  useEffect(() => {
    const handleRequestTurningIsometricCapture = async (event) => {
      try {
        console.log('TurningViewerPage received isometric capture request');
        
        if (!cameraRef.current || !controlsRef.current || !canvasRef.current) {
          console.error('Required THREE.js references not available');
          window.dispatchEvent(new CustomEvent('turningIsometricCaptureComplete', {
            detail: null
          }));
          return;
        }
        
        const camera = cameraRef.current;
        const controls = controlsRef.current;
        const canvas = canvasRef.current;
        
        const originalPosition = camera.position.clone();
        const originalUp = camera.up.clone();
        const originalTarget = controls.target.clone();
        const originalZoom = camera.zoom;
        
        console.log('Original camera state saved');
        
        try {
          const distance = originalPosition.distanceTo(originalTarget);
          const isometricDistance = distance * 0.866;
          const isoX = isometricDistance / Math.sqrt(3);
          const isoY = isometricDistance / Math.sqrt(3);
          const isoZ = isometricDistance / Math.sqrt(3);
          
          const isoPosition = new THREE.Vector3(isoX, isoY, isoZ).add(originalTarget);
          
          console.log('Setting isometric view position for turning model:', isoPosition);
          
          camera.position.copy(isoPosition);
          camera.up.set(0, 1, 0);
          camera.lookAt(originalTarget);
          controls.update();
          
          console.log('Isometric view applied');
          
          await new Promise(resolve => {
            let frameCount = 0;
            const maxFrames = 3;
            
            const waitForRender = () => {
              frameCount++;
              if (frameCount >= maxFrames) {
                resolve();
              } else {
                requestAnimationFrame(waitForRender);
              }
            };
            
            requestAnimationFrame(waitForRender);
          });
          
          console.log('Render frames completed, capturing canvas');
          
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          
          const tempCtx = tempCanvas.getContext('2d', {
            willReadFrequently: true,
            alpha: true
          });
          
          if (!tempCtx) {
            throw new Error('Could not get 2D context from temporary canvas');
          }
          
          tempCtx.drawImage(canvas, 0, 0);
          
          const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
          if (gl) {
            gl.finish();
          }
          
          const dataUrl = tempCanvas.toDataURL('image/png', 1.0);
          
          if (!dataUrl || dataUrl.length < 100) {
            console.warn('Canvas capture produced invalid or empty image');
            throw new Error('Canvas capture invalid');
          }
          
          console.log('Turning isometric view captured successfully, size:', (dataUrl.length / 1024).toFixed(2), 'KB');
          
          window.dispatchEvent(new CustomEvent('turningIsometricCaptureComplete', {
            detail: dataUrl
          }));
          
        } catch (captureError) {
          console.error('Error during turning isometric capture:', captureError);
          
          window.dispatchEvent(new CustomEvent('turningIsometricCaptureComplete', {
            detail: null
          }));
          
        } finally {
          console.log('Restoring original camera state');
          
          camera.position.copy(originalPosition);
          camera.up.copy(originalUp);
          camera.zoom = originalZoom;
          camera.updateProjectionMatrix();
          
          controls.target.copy(originalTarget);
          controls.update();
          
          console.log('Original camera state restored');
        }
        
      } catch (error) {
        console.error('Fatal error in turning isometric capture handler:', error);
        
        window.dispatchEvent(new CustomEvent('turningIsometricCaptureComplete', {
          detail: null
        }));
      }
    };
    
    window.addEventListener('requestTurningIsometricCapture', handleRequestTurningIsometricCapture);
    
    console.log('Turning isometric capture handler registered on TurningViewerPage');
    
    return () => {
      window.removeEventListener('requestTurningIsometricCapture', handleRequestTurningIsometricCapture);
      console.log('Turning isometric capture handler removed');
    };
    
  }, []);

  return (
    <Layout style={{ 
      minHeight: '100vh', 
      width: '100vw',
      background: theme.background,
      overflow: 'hidden'
    }}>
      <div style={{ 
        height: '80px',
        background: `#246679`,
        padding: '0 40px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        boxShadow: '0 8px 32px rgba(20, 93, 160, 0.3), 0 0 0 1px rgba(20, 93, 160, 0.2)',
        borderBottom: `4px solid #246679`,
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <button 
          onClick={() => navigate('/home/machine/grinding')}
          style={{
            position: 'absolute',
            left: '16px',
            padding: '8px',
            borderRadius: '8px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
          }}
          title="Back to Upload"
        >
          <FiArrowLeft style={{ 
            width: '24px', 
            height: '24px', 
            color: '#ffffff',
            transition: 'color 0.3s ease'
          }} />
        </button>

        <div style={{  
          position: 'absolute', 
          left: '50%', 
          transform: 'translateX(-50%)',
          display: 'flex', 
          alignItems: 'center' 
        }}>
          <Title level={3} style={{ 
            margin: 0, 
            color: '#ffffff', 
            fontWeight: 600, 
            fontSize: '24px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
          }}>
           COST ESTIMATION SOFTWARE
          </Title>
        </div>
      </div>

      <Content style={{ 
        padding: '30px 40px',
        height: 'calc(100vh - 80px)',
        overflow: 'auto'
      }}>
        <div style={{ 
          maxWidth: '100%', 
          margin: '0 auto',
          height: '100%'
        }}>
          <Row gutter={[30, 30]} style={{ height: '100%' }}>
            <Col xs={24} lg={12} style={{ height: '100%' }}>
              <Card 
                title="" 
                style={{ 
                  height: '100%', 
                  boxShadow: theme.shadow,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: theme.modelBg,
                  border: `1px solid ${theme.borderColor}`
                }}
                bodyStyle={{ 
                  padding: '0', 
                  height: 'calc(100% - 65px)', 
                  position: 'relative',
                  background: theme.modelBg
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <canvas 
                    ref={canvasRef} 
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'block'
                    }}
                  />
                  
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '240px',
                    height: '240px',
                    display: isModelLoaded ? 'block' : 'none'
                  }}>
                    <button
                      onClick={() => moveCamera('up')}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '5px',
                        transform: 'translateX(-50%)',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
                        border: '2px solid rgba(20, 93, 160, 0.3)',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#145da0',
                        zIndex: 10,
                        transition: 'all 0.2s ease',
                        backdropFilter: 'blur(10px)'
                      }}
                      title="Move Camera Up"
                    >
                      ↑
                    </button>

                    <button
                      onClick={() => moveCamera('left')}
                      style={{
                        position: 'absolute',
                        left: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
                        border: '2px solid rgba(20, 93, 160, 0.3)',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#145da0',
                        zIndex: 10,
                        transition: 'all 0.2s ease',
                        backdropFilter: 'blur(10px)'
                      }}
                      title="Move Camera Left"
                    >
                      ←
                    </button>

                    <div style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '150px',
                      height: '150px',
                      overflow: 'hidden',
                      pointerEvents: 'none'
                    }}>
                      <canvas 
                        ref={cubeCanvasRef} 
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'block'
                        }}
                      />
                      
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gridTemplateRows: 'repeat(3, 1fr)',
                        pointerEvents: 'auto'
                      }}>
                        <div 
                          onClick={() => handleFaceClick('top')}
                          style={{ 
                            gridColumn: 2, 
                            gridRow: 1, 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Top View"
                        />
                        <div 
                          onClick={() => handleFaceClick('left')}
                          style={{ 
                            gridColumn: 1, 
                            gridRow: 2, 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Left View"
                        />
                        <div 
                          onClick={() => handleFaceClick('front')}
                          style={{ 
                            gridColumn: 2, 
                            gridRow: 2, 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Front View"
                        />
                        <div 
                          onClick={() => handleFaceClick('right')}
                          style={{ 
                            gridColumn: 3, 
                            gridRow: 2, 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Right View"
                        />
                        <div 
                          onClick={() => handleFaceClick('bottom')}
                          style={{ 
                            gridColumn: 2, 
                            gridRow: 3, 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Bottom View"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => moveCamera('right')}
                      style={{
                        position: 'absolute',
                        right: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
                        border: '2px solid rgba(20, 93, 160, 0.3)',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#145da0',
                        zIndex: 10,
                        transition: 'all 0.2s ease',
                        backdropFilter: 'blur(10px)'
                      }}
                      title="Move Camera Right"
                    >
                      →
                    </button>

                    <button
                      onClick={() => moveCamera('down')}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        bottom: '5px',
                        transform: 'translateX(-50%)',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
                        border: '2px solid rgba(20, 93, 160, 0.3)',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#145da0',
                        zIndex: 10,
                        transition: 'all 0.2s ease',
                        backdropFilter: 'blur(10px)'
                      }}
                      title="Move Camera Down"
                    >
                      ↓
                    </button>
                  </div>

                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <button
                      onClick={() => handleFaceClick('isometric')}
                      style={{
                        background: 'rgba(255,255,255,0.9)',
                        border: '2px solid #ddd',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(20, 93, 160, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255,255,255,0.9)';
                      }}
                      title="Isometric View"
                    >
                      ISO
                    </button>
                    <button
                      onClick={() => {
                        const elem = document.documentElement;
                        if (!document.fullscreenElement) {
                          elem.requestFullscreen();
                        } else {
                          document.exitFullscreen();
                        }
                      }}
                      style={{
                        background: 'rgba(255,255,255,0.9)',
                        border: '2px solid #ddd',
                        borderRadius: '6px',
                        padding: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(20, 93, 160, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255,255,255,0.9)';
                      }}
                      title="Toggle Fullscreen"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {!isModelLoaded && !isError && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(5px)'
                  }}>
                    <div style={{ textAlign: 'center', maxWidth: '300px' }}>
                      <div style={{
                        border: `4px solid ${theme.primary}33`,
                        borderTop: `4px solid ${theme.primary}`,
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                      }} />
                      
                      {loadingProgress > 0 && (
                        <div style={{
                          width: '200px',
                          height: '8px',
                          background: '#f0f0f0',
                          borderRadius: '4px',
                          margin: '0 auto 16px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${loadingProgress}%`,
                            height: '100%',
                            background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
                            borderRadius: '4px',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                      )}
                      
                      <Text style={{ 
                        color: theme.primary, 
                        fontSize: '16px',
                        fontWeight: '500'
                      }}>
                        {loadingMessage}
                      </Text>
                      
                      {loadingProgress > 0 && (
                        <div style={{ marginTop: '8px' }}>
                          <Text style={{ 
                            color: theme.textSecondary, 
                            fontSize: '14px'
                          }}>
                            {loadingProgress}% complete
                          </Text>
                        </div>
                      )}
                      
                      {!costCalculationId && (
                        <div style={{ 
                          marginTop: '16px',
                          padding: '12px',
                          background: 'rgba(250, 173, 20, 0.1)',
                          borderRadius: '6px',
                          border: '1px solid rgba(250, 173, 20, 0.3)'
                        }}>
                          <Text style={{ 
                            color: theme.warning, 
                            fontSize: '14px'
                          }}>
                            Waiting for cost calculation to complete...
                          </Text>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {isError && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(5px)'
                  }}>
                    <div style={{ textAlign: 'center', maxWidth: '350px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        background: theme.error,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold'
                      }}>
                        !
                      </div>
                      
                      <Text style={{ 
                        color: theme.error, 
                        fontSize: '16px',
                        fontWeight: '500',
                        marginBottom: '16px',
                        display: 'block'
                      }}>
                        {loadingMessage}
                      </Text>
                      
                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        {costCalculationId && (
                          <button
                            onClick={() => {
                              setIsError(false);
                              setLoadingProgress(0);
                              loadModelFromDatabase(costCalculationId);
                            }}
                            style={{
                              background: theme.primary,
                              color: 'white',
                              border: 'none',
                              padding: '10px 20px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '500',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 2px 8px rgba(20, 93, 160, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = theme.secondary;
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = theme.primary;
                            }}
                          >
                            Retry Loading
                          </button>
                        )}
                        
                        <button
                          onClick={() => {
                            setIsError(false);
                            setIsModelLoaded(false);
                            setLoadingMessage('Waiting for calculation ID...');
                          }}
                          style={{
                            background: 'transparent',
                            color: theme.textSecondary,
                            border: `1px solid ${theme.borderColor}`,
                            padding: '10px 20px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.borderColor = theme.primary;
                            e.target.style.color = theme.primary;
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.borderColor = theme.borderColor;
                            e.target.style.color = theme.textSecondary;
                          }}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </Col>

            <Col xs={24} lg={12} style={{ height: '100%' }}>
              <Card 
                title="Manufacturing Cost Report" 
                style={{ 
                  height: '100%', 
                  boxShadow: theme.shadow,
                  borderRadius: '8px',
                  background: theme.cardBg,
                  border: `1px solid ${theme.borderColor}`
                }}
                bodyStyle={{ 
                  padding: '0', 
                  height: 'calc(100% - 65px)', 
                  overflow: 'hidden'
                }}
                extra={
                  <Button 
                    icon={<FiDownload />}
                    onClick={() => reportActionRef.current && reportActionRef.current()}
                    style={{ 
                      borderRadius: '6px', 
                      height: '40px', 
                      fontWeight: 500, 
                      backgroundColor: '#246679',
                      borderColor: '#246679',
                      color: 'white'
                    }}
                  >
                    Download PDF Report
                  </Button>
                }
              >
                             <TurningCostReport 
                  analysisData={analysisData} 
                  theme={theme} 
                  onCostCalculationComplete={handleCostCalculationComplete}
                  costCalculationId={costCalculationId}
                  initialCostData={location.state?.initialCostData}
                  onRegisterReport={(action) => { reportActionRef.current = action; }}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </Content>

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Layout>
  );
}

export default TurningViewerPage;