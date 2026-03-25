// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { useLocation, useParams } from 'react-router-dom';
// import { Layout, Typography, Card, Row, Col } from 'antd';
// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { useNavigate } from 'react-router-dom';
// import { FiArrowLeft } from 'react-icons/fi';
// import CompositesCostreport from './CompositesCostreport';
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

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

// function CompositesViewerPage() {
//   const location = useLocation();
//   const { id } = useParams();
//   const canvasRef = useRef(null);
//   const cubeCanvasRef = useRef(null);
//   const controlsRef = useRef(null);
//   const cameraRef = useRef(null);
//   const sceneRef = useRef(null);
//   const modelRef = useRef(null);
//   const loadingAbortControllerRef = useRef(null);
//   const modelCacheRef = useRef(new Map());
  
//   const [isModelLoaded, setIsModelLoaded] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const [loadingMessage, setLoadingMessage] = useState('Loading 3D model...');
//   const [cubeRotation, setCubeRotation] = useState({ x: 0, y: 0 });
//   const [loadingProgress, setLoadingProgress] = useState(0);
//   const navigate = useNavigate();
  
//   const [analysisId, setAnalysisId] = useState(() => {
//     const possibleId = id || 
//                       location.state?.analysisId || 
//                       localStorage.getItem('currentCalculationId');
    
//     return possibleId && possibleId !== 'undefined' && possibleId !== 'null' 
//       ? possibleId 
//       : null;
//   });

//   const { analysisData, prepregMaterial, masterToolData, rawData } = location.state || {};
//   const [loadingTimeout, setLoadingTimeout] = useState(null);

//   const loadModelFromDatabase = useCallback(async (calcId) => {
//     if (!calcId || calcId === 'undefined' || calcId === 'null' || calcId.toString().trim() === '') {
//       console.log('Invalid analysis ID provided:', calcId);
//       setIsError(true);
//       setLoadingMessage('Invalid analysis ID. Please try again.');
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

//     console.log('Loading 3D model for prepreg composite with ID:', calcId);
//     setIsModelLoaded(false);
//     setIsError(false);
//     setLoadingProgress(0);
//     setLoadingMessage('Connecting to server...');
    
//     const abortController = new AbortController();
//     loadingAbortControllerRef.current = abortController;
    
//     try {
//       setLoadingMessage('Downloading 3D model...');
      
//       const response = await fetch(`http://172.18.100.156:8004/composites/download-glb/${calcId}`, {
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
//         throw new Error(`Server error: ${response.status} - ${response.statusText}`);
//       }
      
//       setLoadingMessage('Processing 3D model...');
      
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
          
//           console.log(`Downloaded GLB: ${(receivedLength / 1024).toFixed(1)} KB`);
          
//         } catch (streamError) {
//           console.warn('Stream reading failed, using arrayBuffer fallback:', streamError);
//           arrayBuffer = await response.arrayBuffer();
//         }
//       } else {
//         setLoadingProgress(40);
//         arrayBuffer = await response.arrayBuffer();
//       }
      
//       if (abortController.signal.aborted) {
//         return;
//       }
      
//       await loadModelFromArrayBuffer(arrayBuffer, calcId, abortController);
      
//     } catch (error) {
//       if (abortController.signal.aborted) {
//         console.log('Model loading was cancelled');
//         return;
//       }
      
//       console.error('Error fetching 3D model:', error);
//       setIsError(true);
      
//       if (error.name === 'TypeError' && error.message.includes('fetch')) {
//         setLoadingMessage('Connection failed. Please check your network connection.');
//       } else if (error.message.includes('404')) {
//         setLoadingMessage('3D model not found. The analysis may still be processing.');
//       } else if (error.message.includes('500')) {
//         setLoadingMessage('Server error. Please try again later.');
//       } else {
//         setLoadingMessage(`Failed to load 3D model: ${error.message}`);
//       }
//     }
//   }, []);

//   const loadModelFromArrayBuffer = async (arrayBuffer, calcId, abortController) => {
//     try {
//       if (abortController.signal.aborted) {
//         return;
//       }

//       setLoadingMessage('Parsing 3D model...');
//       setLoadingProgress(75);
      
//       if (!arrayBuffer || arrayBuffer.byteLength === 0) {
//         throw new Error('Received empty or invalid model data');
//       }
      
//       console.log('ArrayBuffer size:', (arrayBuffer.byteLength / 1024).toFixed(1), 'KB');
      
//       const loader = new GLTFLoader();
//       const dracoLoader = new DRACOLoader();
//       dracoLoader.setDecoderPath('/draco/');
//       dracoLoader.setDecoderConfig({ type: 'js' });
//       loader.setDRACOLoader(dracoLoader);
      
//       const loadModel = new Promise((resolve, reject) => {
//         const timeoutId = setTimeout(() => {
//           reject(new Error('Model loading timeout (30 seconds)'));
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
//             console.log('✅ Model loaded successfully');
//             resolve(gltf);
//           },
//           (error) => {
//             clearTimeout(timeoutId);
//             console.error('GLTFLoader error:', error);
//             reject(new Error(`Failed to parse model: ${error.message || 'Unknown error'}`));
//           }
//         );
//       });
      
//       const gltf = await loadModel;
      
//       if (abortController.signal.aborted) {
//         return;
//       }
      
//       console.log('✅ Model loaded from database');
//       setLoadingProgress(95);
      
//       if (!gltf || !gltf.scene) {
//         throw new Error('Loaded model is empty or invalid');
//       }
      
//       try {
//         modelCacheRef.current.set(calcId, {
//           scene: gltf.scene.clone(),
//           animations: gltf.animations,
//           userData: gltf.userData,
//         });
//         console.log('✅ Model cached successfully');
//       } catch (cacheError) {
//         console.warn('Failed to cache model:', cacheError);
//       }
      
//       processAndAddModel(gltf.scene);
      
//       setIsModelLoaded(true);
//       setLoadingProgress(100);
      
//     } catch (error) {
//       if (abortController.signal.aborted) {
//         return;
//       }
      
//       console.error('Error processing ArrayBuffer:', error);
//       throw error;
//     }
//   };

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
    
//     gltfScene.traverse((child) => {
//       if (child instanceof THREE.Mesh && child.material) {
//         if (Array.isArray(child.material)) {
//           child.material.forEach(mat => {
//             mat.side = THREE.DoubleSide;
//             if (mat.emissive) {
//               if (mat.color) {
//                 const brightness = (mat.color.r + mat.color.g + mat.color.b) / 3;
//                 if (brightness < 0.3) {
//                   mat.emissive = new THREE.Color(mat.color);
//                   mat.emissiveIntensity = 0.3;
//                 }
//               }
//             }
//             if (mat.roughness !== undefined) mat.roughness = Math.min(mat.roughness || 0.5, 0.8);
//             if (mat.metalness !== undefined) mat.metalness = Math.min(mat.metalness || 0, 0.2);
//           });
//         } else {
//           child.material.side = THREE.DoubleSide;
//           if (child.material.emissive) {
//             if (child.material.color) {
//               const brightness = (child.material.color.r + child.material.color.g + child.material.color.b) / 3;
//               if (brightness < 0.3) {
//                 child.material.emissive = new THREE.Color(child.material.color);
//                 child.material.emissiveIntensity = 0.3;
//               }
//             }
//           }
//           if (child.material.roughness !== undefined) child.material.roughness = Math.min(child.material.roughness || 0.5, 0.8);
//           if (child.material.metalness !== undefined) child.material.metalness = Math.min(child.material.metalness || 0, 0.2);
//         }
//       }
//     });
    
//     sceneRef.current.add(modelGroup);
//     console.log('✅ Model added to scene - COLORS PRESERVED');
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
//     const spherical = new THREE.Spherical().setFromVector3(offset);
    
//     const angle = Math.PI / 12;
    
//     if (direction === 'up' || direction === 'down') {
//       const rotation = direction === 'up' ? angle : -angle;
//       spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi + rotation));
//     } else if (direction === 'left' || direction === 'right') {
//       const rotation = direction === 'left' ? angle : -angle;
//       spherical.theta += rotation;
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
      
//       const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
//       scene.add(ambientLight);

//       const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xaaaaaa, 1.0);
//       scene.add(hemisphereLight);
      
//       const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//       directionalLight.position.set(5, 10, 7);
//       scene.add(directionalLight);
      
//       cubeScene = initCubeScene();

//       if (analysisId && analysisId !== 'undefined' && analysisId !== 'null') {
//         console.log('Loading 3D model with analysis ID:', analysisId);
//         loadModelFromDatabase(analysisId);
//       } else {
//         console.log('No valid analysis ID available');
//         setLoadingMessage('Waiting for analysis data...');
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
//   }, [analysisId, initCubeScene, loadModelFromDatabase, cubeRotation, loadingTimeout]);

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
//           onClick={() => navigate('/home/composites')}
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
//           title="Back to Composites"
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
//             COMPOSITE COST ESTIMATION
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
//                   background: theme.modelBg,
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
                  
//                   {!isModelLoaded && !isError && (
//                     <div style={{
//                       position: 'absolute',
//                       top: 0,
//                       left: 0,
//                       right: 0,
//                       bottom: 0,
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       background: 'rgba(255, 255, 255, 0.95)',
//                       backdropFilter: 'blur(5px)'
//                     }}>
//                       <div style={{ textAlign: 'center', maxWidth: '300px' }}>
//                         <div style={{
//                           border: `4px solid ${theme.primary}33`,
//                           borderTop: `4px solid ${theme.primary}`,
//                           borderRadius: '50%',
//                           width: '48px',
//                           height: '48px',
//                           animation: 'spin 1s linear infinite',
//                           margin: '0 auto 20px'
//                         }} />
                        
//                         <Text style={{ 
//                           color: theme.primary, 
//                           fontSize: '16px',
//                           fontWeight: '500'
//                         }}>
//                           {loadingMessage}
//                         </Text>
//                       </div>
//                     </div>
//                   )}
                  
//                   {isError && (
//                     <div style={{
//                       position: 'absolute',
//                       top: 0,
//                       left: 0,
//                       right: 0,
//                       bottom: 0,
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       background: 'rgba(255, 255, 255, 0.95)',
//                       backdropFilter: 'blur(5px)'
//                     }}>
//                       <div style={{ textAlign: 'center', maxWidth: '350px' }}>
//                         <div style={{
//                           width: '48px',
//                           height: '48px',
//                           background: theme.error,
//                           borderRadius: '50%',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           margin: '0 auto 20px',
//                           color: 'white',
//                           fontSize: '24px',
//                           fontWeight: 'bold'
//                         }}>
//                           !
//                         </div>
                        
//                         <Text style={{ 
//                           color: theme.error, 
//                           fontSize: '16px',
//                           fontWeight: '500',
//                           marginBottom: '16px',
//                           display: 'block'
//                         }}>
//                           {loadingMessage}
//                         </Text>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             </Col>

//             <Col xs={24} lg={12} style={{ height: '100%' }}>
//               <CompositesCostreport 
//                 analysisData={analysisData} 
//                 analysisId={analysisId}
//                 prepregMaterial={prepregMaterial}
//                 masterToolData={masterToolData}
//                 rawData={rawData}
//                 theme={theme}
//               />
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

// export default CompositesViewerPage;






import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Layout, Typography, Card, Row, Col } from 'antd';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import CompositesCostreport from './CompositesCostreport';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

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

function CompositesViewerPage() {
  const location = useLocation();
  const { id } = useParams();
  const canvasRef = useRef(null);
  const cubeCanvasRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const modelRef = useRef(null);
  const loadingAbortControllerRef = useRef(null);
  const modelCacheRef = useRef(new Map());
  
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading 3D model...');
  const [cubeRotation, setCubeRotation] = useState({ x: 0, y: 0 });
  const [loadingProgress, setLoadingProgress] = useState(0);
  const navigate = useNavigate();
  
  const [analysisId, setAnalysisId] = useState(() => {
    const possibleId = id || 
                      location.state?.analysisId || 
                      localStorage.getItem('currentCalculationId');
    
    return possibleId && possibleId !== 'undefined' && possibleId !== 'null' 
      ? possibleId 
      : null;
  });

  const { analysisData, prepregMaterial, masterToolData, rawData } = location.state || {};
  const [loadingTimeout, setLoadingTimeout] = useState(null);

  const loadModelFromDatabase = useCallback(async (calcId) => {
    if (!calcId || calcId === 'undefined' || calcId === 'null' || calcId.toString().trim() === '') {
      console.log('Invalid analysis ID provided:', calcId);
      setIsError(true);
      setLoadingMessage('Invalid analysis ID. Please try again.');
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

    console.log('Loading 3D model for composite analysis with ID:', calcId);
    setIsModelLoaded(false);
    setIsError(false);
    setLoadingProgress(0);
    setLoadingMessage('Connecting to server...');
    
    const abortController = new AbortController();
    loadingAbortControllerRef.current = abortController;
    
    try {
      setLoadingMessage('Downloading converted 3D model...');
      
      // Attempt to load Draco-compressed GLB first
      const response = await fetch(`http://172.18.100.156:8004/composites/analysis/${calcId}/download-draco-glb`, {
        signal: abortController.signal,
        method: 'GET',
        headers: {
          'Accept': 'model/gltf-binary, application/octet-stream, */*',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (abortController.signal.aborted) {
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} - ${response.statusText}`);
      }
      
      setLoadingMessage('Processing 3D model...');
      
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
          
          console.log(`Downloaded Draco GLB: ${(receivedLength / 1024).toFixed(1)} KB`);
          
        } catch (streamError) {
          console.warn('Stream reading failed, using arrayBuffer fallback:', streamError);
          arrayBuffer = await response.arrayBuffer();
        }
      } else {
        setLoadingProgress(40);
        arrayBuffer = await response.arrayBuffer();
      }
      
      if (abortController.signal.aborted) {
        return;
      }
      
      await loadModelFromArrayBuffer(arrayBuffer, calcId, abortController);
      
    } catch (error) {
      if (abortController.signal.aborted) {
        console.log('Model loading was cancelled');
        return;
      }
      
      console.error('Error fetching 3D model:', error);
      setIsError(true);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setLoadingMessage('Connection failed. Please check your network connection.');
      } else if (error.message.includes('404')) {
        setLoadingMessage('3D model not found. Please ensure the file was converted successfully.');
      } else if (error.message.includes('500')) {
        setLoadingMessage('Server error. Please try again later.');
      } else {
        setLoadingMessage(`Failed to load 3D model: ${error.message}`);
      }
    }
  }, []);

  const loadModelFromArrayBuffer = async (arrayBuffer, calcId, abortController) => {
    try {
      if (abortController.signal.aborted) {
        return;
      }

      setLoadingMessage('Parsing 3D model...');
      setLoadingProgress(75);
      
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error('Received empty or invalid model data');
      }
      
      console.log('ArrayBuffer size:', (arrayBuffer.byteLength / 1024).toFixed(1), 'KB');
      
      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('/draco/');
      dracoLoader.setDecoderConfig({ type: 'js' });
      loader.setDRACOLoader(dracoLoader);
      
      const loadModel = new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Model loading timeout (30 seconds)'));
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
            console.log('✅ Model loaded successfully');
            resolve(gltf);
          },
          (error) => {
            clearTimeout(timeoutId);
            console.error('GLTFLoader error:', error);
            reject(new Error(`Failed to parse model: ${error.message || 'Unknown error'}`));
          }
        );
      });
      
      const gltf = await loadModel;
      
      if (abortController.signal.aborted) {
        return;
      }
      
      console.log('✅ Model loaded from database');
      setLoadingProgress(95);
      
      if (!gltf || !gltf.scene) {
        throw new Error('Loaded model is empty or invalid');
      }
      
      try {
        modelCacheRef.current.set(calcId, {
          scene: gltf.scene.clone(),
          animations: gltf.animations,
          userData: gltf.userData,
        });
        console.log('✅ Model cached successfully');
      } catch (cacheError) {
        console.warn('Failed to cache model:', cacheError);
      }
      
      processAndAddModel(gltf.scene);
      
      setIsModelLoaded(true);
      setLoadingProgress(100);
      
    } catch (error) {
      if (abortController.signal.aborted) {
        return;
      }
      
      console.error('Error processing ArrayBuffer:', error);
      throw error;
    }
  };

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
  controlsRef.current.minDistance = 0.5;  // Much closer zoom allowed
  controlsRef.current.maxDistance = 200;  // Much farther zoom allowed
  controlsRef.current.update();
}
    }
    
    gltfScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => {
            mat.side = THREE.DoubleSide;
            if (mat.emissive) {
              if (mat.color) {
                const brightness = (mat.color.r + mat.color.g + mat.color.b) / 3;
                if (brightness < 0.3) {
                  mat.emissive = new THREE.Color(mat.color);
                  mat.emissiveIntensity = 0.3;
                }
              }
            }
            if (mat.roughness !== undefined) mat.roughness = Math.min(mat.roughness || 0.5, 0.8);
            if (mat.metalness !== undefined) mat.metalness = Math.min(mat.metalness || 0, 0.2);
          });
        } else {
          child.material.side = THREE.DoubleSide;
          if (child.material.emissive) {
            if (child.material.color) {
              const brightness = (child.material.color.r + child.material.color.g + child.material.color.b) / 3;
              if (brightness < 0.3) {
                child.material.emissive = new THREE.Color(child.material.color);
                child.material.emissiveIntensity = 0.3;
              }
            }
          }
          if (child.material.roughness !== undefined) child.material.roughness = Math.min(child.material.roughness || 0.5, 0.8);
          if (child.material.metalness !== undefined) child.material.metalness = Math.min(child.material.metalness || 0, 0.2);
        }
      }
    });
    
    sceneRef.current.add(modelGroup);
    console.log('✅ Model added to scene');
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
    const spherical = new THREE.Spherical().setFromVector3(offset);
    
    const angle = Math.PI / 12;
    
    if (direction === 'up' || direction === 'down') {
      const rotation = direction === 'up' ? angle : -angle;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi + rotation));
    } else if (direction === 'left' || direction === 'right') {
      const rotation = direction === 'left' ? angle : -angle;
      spherical.theta += rotation;
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

  // Add this useEffect to CompositesViewerPage.jsx
useEffect(() => {
  const handleRequestIsometricCapture = async (event) => {
    try {
      console.log('ViewerPage received isometric capture request');
      
      if (!cameraRef.current || !controlsRef.current || !canvasRef.current) {
        console.error('Required THREE.js references not available');
        window.dispatchEvent(new CustomEvent('isometricCaptureComplete', {
          detail: null
        }));
        return;
      }
      
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      const canvas = canvasRef.current;
      
      // Save current camera state
      const originalPosition = camera.position.clone();
      const originalUp = camera.up.clone();
      const originalTarget = controls.target.clone();
      const originalZoom = camera.zoom;
      
      console.log('Original camera state saved');
      
      try {
        // Calculate isometric position
        const distance = originalPosition.distanceTo(originalTarget);
        const isometricDistance = distance * 0.866; // Adjust for better framing
        const isoX = isometricDistance / Math.sqrt(3);
        const isoY = isometricDistance / Math.sqrt(3);
        const isoZ = isometricDistance / Math.sqrt(3);
        
        const isoPosition = new THREE.Vector3(isoX, isoY, isoZ).add(originalTarget);
        
        console.log('Setting isometric view position:', isoPosition);
        
        // Move camera to isometric position
        camera.position.copy(isoPosition);
        camera.up.set(0, 1, 0);
        camera.lookAt(originalTarget);
        controls.update();
        
        console.log('Isometric view applied');
        
        // Wait for THREE.js to render the new view (multiple frames)
        await new Promise(resolve => {
          let frameCount = 0;
          const maxFrames = 3; // Wait for 3 frames to ensure render is complete
          
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
        
        // Capture the canvas
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
        
        // Draw the THREE.js canvas onto our temporary canvas
        tempCtx.drawImage(canvas, 0, 0);
        
        // Force WebGL to finish rendering
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
          gl.finish();
        }
        
        // Convert to data URL
        const dataUrl = tempCanvas.toDataURL('image/png', 1.0);
        
        if (!dataUrl || dataUrl.length < 100) {
          console.warn('Canvas capture produced invalid or empty image');
          throw new Error('Canvas capture invalid');
        }
        
        console.log('Isometric view captured successfully, size:', (dataUrl.length / 1024).toFixed(2), 'KB');
        
        // Send the captured image back
        window.dispatchEvent(new CustomEvent('isometricCaptureComplete', {
          detail: dataUrl
        }));
        
      } catch (captureError) {
        console.error('Error during isometric capture:', captureError);
        
        // Send null to indicate failure
        window.dispatchEvent(new CustomEvent('isometricCaptureComplete', {
          detail: null
        }));
        
      } finally {
        // Always restore original camera state
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
      console.error('Fatal error in isometric capture handler:', error);
      
      // Send null to indicate failure
      window.dispatchEvent(new CustomEvent('isometricCaptureComplete', {
        detail: null
      }));
    }
  };
  
  window.addEventListener('requestIsometricCapture', handleRequestIsometricCapture);
  
  console.log('Isometric capture handler registered on ViewerPage');
  
  return () => {
    window.removeEventListener('requestIsometricCapture', handleRequestIsometricCapture);
    console.log('Isometric capture handler removed');
  };
  
}, []); // Empty dependency array - only register once

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
      
   camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 2000);
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
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 10, 7);
      scene.add(directionalLight);
      
      cubeScene = initCubeScene();

      if (analysisId && analysisId !== 'undefined' && analysisId !== 'null') {
        console.log('Loading 3D model with analysis ID:', analysisId);
        loadModelFromDatabase(analysisId);
      } else {
        console.log('No valid analysis ID available');
        setLoadingMessage('Waiting for analysis data...');
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
  }, [analysisId, initCubeScene, loadModelFromDatabase, cubeRotation, loadingTimeout]);

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
          onClick={() => navigate('/home/composites')}
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
          title="Back to Composites"
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
            COMPOSITE COST ESTIMATION
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
                    backdropFilter: 'blur(5px)',
                    zIndex: 100
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
                      
                      <Text style={{ 
                        color: theme.primary, 
                        fontSize: '16px',
                        fontWeight: '500'
                      }}>
                        {loadingMessage}
                      </Text>
                      
                      {loadingProgress > 0 && (
                        <div style={{ marginTop: '16px', maxWidth: '200px', margin: '16px auto 0' }}>
                          <div style={{
                            width: '100%',
                            height: '6px',
                            background: '#e0e0e0',
                            borderRadius: '3px',
                            overflow: 'hidden',
                            marginBottom: '8px'
                          }}>
                            <div style={{
                              width: `${loadingProgress}%`,
                              height: '100%',
                              background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
                              borderRadius: '3px',
                              transition: 'width 0.3s ease'
                            }} />
                          </div>
                          <Text style={{ 
                            color: theme.textSecondary, 
                            fontSize: '12px'
                          }}>
                            {loadingProgress}%
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
                    backdropFilter: 'blur(5px)',
                    zIndex: 100
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
                    </div>
                  </div>
                )}
              </Card>
            </Col>

            <Col xs={24} lg={12} style={{ height: '100%' }}>
              <CompositesCostreport 
                analysisData={analysisData} 
                analysisId={analysisId}
                prepregMaterial={prepregMaterial}
                masterToolData={masterToolData}
                rawData={rawData}
                theme={theme}
              />
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

export default CompositesViewerPage