
//'''this below code is correct working and based on quantity increase cost is updating correctly only donwload pdf button to donwload report is missing in

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useParams, useLocation, useNavigate } from 'react-router-dom';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { Layout, Card, Typography, Row, Col, Button, Tabs, Progress, message, Select, Input } from 'antd';
// import { ArrowLeftOutlined, ExpandOutlined, SaveOutlined } from '@ant-design/icons';

// const { Content } = Layout;
// const { Title, Text } = Typography;
// const { Option } = Select;

// const theme = {
//   primary: '#246679',
//   secondary: '#73b6ca',
//   background: '#f0f2f5',
//   cardBg: '#ffffff',
//   textPrimary: '#000000',
//   textSecondary: '#666666',
//   borderColor: '#d9d9d9',
//   shadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
//   modelBg: '#f8f9fa',
//   cubeColors: {
//     front: '#B0B0B0',
//     back: '#888888',
//     top: '#D3D3D3',
//     bottom: '#6E6E6E',
//     left: '#A9A9A9',
//     right: '#505050'
//   }
// };

// function SheetMetalViewerPage() {
//   const { id } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const canvasRef = useRef(null);
//   const cubeCanvasRef = useRef(null);
//   const controlsRef = useRef(null);
//   const cameraRef = useRef(null);
//   const sceneRef = useRef(null);
//   const modelRef = useRef(null);
//   const rendererRef = useRef(null);
//   const loadingAbortControllerRef = useRef(null);

//   const [isModelLoaded, setIsModelLoaded] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const [loadingMessage, setLoadingMessage] = useState('Loading 3D model...');
//   const [loadingProgress, setLoadingProgress] = useState(0);
//   const [activeModel, setActiveModel] = useState('male');
//   const [machineRates, setMachineRates] = useState([]);
//   const [selectedMachine, setSelectedMachine] = useState(null);
//   const [isUpdatingCost, setIsUpdatingCost] = useState(false);
//   const [cubeRotation, setCubeRotation] = useState({ x: 0, y: 0 });
//   const [updatedCalculationData, setUpdatedCalculationData] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [isUpdatingDimensions, setIsUpdatingDimensions] = useState(false);
//   const [isEditingDimensions, setIsEditingDimensions] = useState(true);
//   const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);

//   const ANALYZE_API_URL = 'http://localhost:5678';

//   const { analysisData, calculationData: initialCalculationData, conversionData, historyId } = location.state || {};
//   const actualHistoryId = historyId || location.state?.historyId;

//   const calculationData = updatedCalculationData || initialCalculationData;

//   // Stock dimension state
//   const [stockDimensions, setStockDimensions] = useState({
//     female_stock_length: 0,
//     female_stock_breadth: 0,
//     female_stock_height: 0,
//     male_stock_length: 0,
//     male_stock_breadth: 0,
//     male_stock_height: 0
//   });

//   // Initialize stock dimensions from calculation data
//   useEffect(() => {
//     if (calculationData?.classification) {
//       setStockDimensions({
//         female_stock_length: calculationData.classification.female_tool?.stock_dimensions?.stock_length || 0,
//         female_stock_breadth: calculationData.classification.female_tool?.stock_dimensions?.stock_breadth || 0,
//         female_stock_height: calculationData.classification.female_tool?.stock_dimensions?.stock_height || 0,
//         male_stock_length: calculationData.classification.male_tool?.stock_dimensions?.stock_length || 0,
//         male_stock_breadth: calculationData.classification.male_tool?.stock_dimensions?.stock_breadth || 0,
//         male_stock_height: calculationData.classification.male_tool?.stock_dimensions?.stock_height || 0
//       });
//     }
//   }, [calculationData]);

//   useEffect(() => {
//     if (calculationData?.quantity) {
//       setQuantity(calculationData.quantity);
//     }
//   }, [calculationData]);

//   useEffect(() => {
//     const fetchMachineRates = async () => {
//       try {
//         const response = await fetch(`${ANALYZE_API_URL}/sheetmetal-machine-hour-rates`);
//         const data = await response.json();

//         if (data.success && Array.isArray(data.data)) {
//           setMachineRates(data.data);

//           if (calculationData?.classification?.female_tool?.mhr_machine_type && 
//               calculationData?.classification?.female_tool?.mhr_machine_size) {
//             const initialMachine = `${calculationData.classification.female_tool.mhr_machine_type}-${calculationData.classification.female_tool.mhr_machine_size}`;
//             setSelectedMachine(initialMachine);
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching machine rates:', error);
//         message.error('Failed to load machine rates');
//       }
//     };

//     fetchMachineRates();
//   }, [calculationData]);

//   // Function to update quantity and recalculate costs
//   const handleQuantityUpdate = async () => {
//     if (!actualHistoryId) {
//       message.error('No history ID available');
//       return;
//     }

//     setIsUpdatingQuantity(true);

//     try {
//       const formData = new URLSearchParams();
//       formData.append('history_id', actualHistoryId);
//       formData.append('new_quantity', quantity);

//       const response = await fetch(`${ANALYZE_API_URL}/update-quantity-cost/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           'accept': 'application/json'
//         },
//         body: formData
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || errorData.message || 'Failed to update quantity');
//       }

//       const result = await response.json();

//       console.log('Quantity Update Response:', result);

//       // Build comprehensive updated data structure
//       const updatedData = {
//         ...calculationData,
//         quantity: result.new_quantity,
//         total_cost: result.updated_values?.total_cost,
//         total_cost_per_unit: result.updated_values?.total_cost_per_unit,
//         material: {
//           name: result.material?.name,
//           density: result.material?.density,
//           cost: result.material?.cost_per_kg,
//           id: result.material?.id
//         },
//         tool_design: {
//           total_design_cost: result.updated_values?.total_design_cost
//         },
//         part_forming: {
//           part_forming_cost: result.updated_values?.part_forming_cost,
//           part_forming_cost_per_unit: result.updated_values?.part_forming_cost_per_unit
//         },
//         classification: {
//           female_tool: {
//             ...calculationData.classification?.female_tool,
//             filename: result.Actual_dimensions?.female_tool?.filename || calculationData.classification?.female_tool?.filename,
//             actual_dimensions: {
//               length: result.Actual_dimensions?.female_tool?.length || calculationData.classification?.female_tool?.actual_dimensions?.length || 0,
//               breadth: result.Actual_dimensions?.female_tool?.breadth || calculationData.classification?.female_tool?.actual_dimensions?.breadth || 0,
//               height: result.Actual_dimensions?.female_tool?.height || calculationData.classification?.female_tool?.actual_dimensions?.height || 0,
//               volume_mm3: result.Actual_dimensions?.female_tool?.volume_mm3 || calculationData.classification?.female_tool?.actual_dimensions?.volume_mm3 || 0,
//               volume_m3: result.Actual_dimensions?.female_tool?.volume_m3 || calculationData.classification?.female_tool?.actual_dimensions?.volume_m3 || 0
//             },
//             stock_dimensions: result.Stock_and_cost?.female?.stock_dimensions || calculationData.classification?.female_tool?.stock_dimensions,
//             manufacturing_cost: result.Stock_and_cost?.female?.manufacturing_cost || calculationData.classification?.female_tool?.manufacturing_cost,
//             volume_removed_m3: calculationData.classification?.female_tool?.volume_removed_m3,
//             mhr: calculationData.classification?.female_tool?.mhr,
//             mhr_machine_type: calculationData.classification?.female_tool?.mhr_machine_type,
//             mhr_machine_size: calculationData.classification?.female_tool?.mhr_machine_size,
//             manufacturing_time_hr: calculationData.classification?.female_tool?.manufacturing_time_hr
//           },
//           male_tool: {
//             ...calculationData.classification?.male_tool,
//             filename: result.Actual_dimensions?.male_tool?.filename || calculationData.classification?.male_tool?.filename,
//             actual_dimensions: {
//               length: result.Actual_dimensions?.male_tool?.length || calculationData.classification?.male_tool?.actual_dimensions?.length || 0,
//               breadth: result.Actual_dimensions?.male_tool?.breadth || calculationData.classification?.male_tool?.actual_dimensions?.breadth || 0,
//               height: result.Actual_dimensions?.male_tool?.height || calculationData.classification?.male_tool?.actual_dimensions?.height || 0,
//               volume_mm3: result.Actual_dimensions?.male_tool?.volume_mm3 || calculationData.classification?.male_tool?.actual_dimensions?.volume_mm3 || 0,
//               volume_m3: result.Actual_dimensions?.male_tool?.volume_m3 || calculationData.classification?.male_tool?.actual_dimensions?.volume_m3 || 0
//             },
//             stock_dimensions: result.Stock_and_cost?.male?.stock_dimensions || calculationData.classification?.male_tool?.stock_dimensions,
//             manufacturing_cost: result.Stock_and_cost?.male?.manufacturing_cost || calculationData.classification?.male_tool?.manufacturing_cost,
//             volume_removed_m3: calculationData.classification?.male_tool?.volume_removed_m3,
//             mhr: calculationData.classification?.male_tool?.mhr,
//             mhr_machine_type: calculationData.classification?.male_tool?.mhr_machine_type,
//             mhr_machine_size: calculationData.classification?.male_tool?.mhr_machine_size,
//             manufacturing_time_hr: calculationData.classification?.male_tool?.manufacturing_time_hr
//           },
//           part: {
//             filename: result.Actual_dimensions?.part?.filename || calculationData.classification?.part?.filename,
//             actual_dimensions: {
//               length: result.Actual_dimensions?.part?.length || calculationData.classification?.part?.actual_dimensions?.length || 0,
//               breadth: result.Actual_dimensions?.part?.breadth || calculationData.classification?.part?.actual_dimensions?.breadth || 0,
//               height: result.Actual_dimensions?.part?.height || calculationData.classification?.part?.actual_dimensions?.height || 0,
//               volume_mm3: result.Actual_dimensions?.part?.volume_mm3 || calculationData.classification?.part?.actual_dimensions?.volume_mm3 || 0,
//               volume_m3: result.Actual_dimensions?.part?.volume_m3 || calculationData.classification?.part?.actual_dimensions?.volume_m3 || 0
//             }
//           }
//         }
//       };

//       setUpdatedCalculationData(updatedData);
//       message.success(`Quantity updated to ${result.new_quantity}! All costs recalculated.`);

//     } catch (error) {
//       console.error('Error updating quantity:', error);
//       message.error(`Failed to update quantity: ${error.message}`);
//     } finally {
//       setIsUpdatingQuantity(false);
//     }
//   };

//   // Function to update stock dimensions
//   const handleUpdateDimensions = async () => {
//     if (!actualHistoryId) {
//       message.error('No history ID available');
//       return;
//     }

//     setIsUpdatingDimensions(true);

//     try {
//       const formData = new URLSearchParams();
//       formData.append('history_id', actualHistoryId);
//       formData.append('female_stock_length', stockDimensions.female_stock_length);
//       formData.append('female_stock_breadth', stockDimensions.female_stock_breadth);
//       formData.append('female_stock_height', stockDimensions.female_stock_height);
//       formData.append('male_stock_length', stockDimensions.male_stock_length);
//       formData.append('male_stock_breadth', stockDimensions.male_stock_breadth);
//       formData.append('male_stock_height', stockDimensions.male_stock_height);

//       const response = await fetch(`${ANALYZE_API_URL}/recalculate-stock/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           'accept': 'application/json'
//         },
//         body: formData
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || errorData.message || 'Failed to update stock dimensions');
//       }

//       const result = await response.json();

//       console.log('API Response:', result);

//       const updatedData = {
//         ...calculationData,
//         ...result,
//         material: result.material || calculationData.material,
//         quantity: result.quantity || calculationData.quantity,
//         total_cost: result.total_cost,
//         total_cost_per_unit: result.total_cost_per_unit,
//         tool_design: result.tool_design || calculationData.tool_design,
//         part_forming: result.part_forming || calculationData.part_forming,
//         classification: {
//           female_tool: {
//             ...result.classification?.female_tool,
//             filename: result.classification?.female_tool?.filename || calculationData.classification?.female_tool?.filename,
//             actual_dimensions: {
//               length: result.actual_female_dimensions?.length || 0,
//               breadth: result.actual_female_dimensions?.breadth || 0,
//               height: result.actual_female_dimensions?.height || 0,
//               volume_mm3: result.actual_female_dimensions?.volume_mm3 || 0,
//               volume_m3: result.actual_female_dimensions?.volume_m3 || 0
//             },
//             stock_dimensions: result.classification?.female_tool?.stock_dimensions,
//             manufacturing_cost: result.classification?.female_tool?.manufacturing_cost,
//             volume_removed_m3: result.classification?.female_tool?.volume_removed_m3,
//             mhr: result.classification?.female_tool?.mhr,
//             mhr_machine_type: result.classification?.female_tool?.mhr_machine_type,
//             mhr_machine_size: result.classification?.female_tool?.mhr_machine_size,
//             manufacturing_time_hr: result.classification?.female_tool?.manufacturing_time_hr
//           },
//           male_tool: {
//             ...result.classification?.male_tool,
//             filename: result.classification?.male_tool?.filename || calculationData.classification?.male_tool?.filename,
//             actual_dimensions: {
//               length: result.actual_male_dimensions?.length || 0,
//               breadth: result.actual_male_dimensions?.breadth || 0,
//               height: result.actual_male_dimensions?.height || 0,
//               volume_mm3: result.actual_male_dimensions?.volume_mm3 || 0,
//               volume_m3: result.actual_male_dimensions?.volume_m3 || 0
//             },
//             stock_dimensions: result.classification?.male_tool?.stock_dimensions,
//             manufacturing_cost: result.classification?.male_tool?.manufacturing_cost,
//             volume_removed_m3: result.classification?.male_tool?.volume_removed_m3,
//             mhr: result.classification?.male_tool?.mhr,
//             mhr_machine_type: result.classification?.male_tool?.mhr_machine_type,
//             mhr_machine_size: result.classification?.male_tool?.mhr_machine_size,
//             manufacturing_time_hr: result.classification?.male_tool?.manufacturing_time_hr
//           },
//           part: {
//             filename: result.classification?.part?.filename || result.actual_part_dimensions?.filename || calculationData.classification?.part?.filename,
//             actual_dimensions: {
//               length: result.actual_part_dimensions?.length || 0,
//               breadth: result.actual_part_dimensions?.breadth || 0,
//               height: result.actual_part_dimensions?.height || 0,
//               volume_mm3: result.actual_part_dimensions?.volume_mm3 || 0,
//               volume_m3: result.actual_part_dimensions?.volume_m3 || 0
//             }
//           }
//         }
//       };

//       console.log('Updated Data:', updatedData);

//       setUpdatedCalculationData(updatedData);
//       message.success('Stock dimensions updated successfully!');

//     } catch (error) {
//       console.error('Error updating stock dimensions:', error);
//       message.error(`Failed to update stock dimensions: ${error.message}`);
//     } finally {
//       setIsUpdatingDimensions(false);
//     }
//   };

//   const handleMachineChange = async (value) => {
//     const selectedRate = machineRates.find(rate => 
//       `${rate.machine_type}-${rate.size}` === value
//     );

//     if (!selectedRate || !actualHistoryId) return;

//     setSelectedMachine(value);
//     setIsUpdatingCost(true);

//     try {
//       const formData = new URLSearchParams();
//       formData.append('history_id', actualHistoryId);
//       formData.append('machine_type', selectedRate.machine_type);
//       formData.append('size', selectedRate.size);

//       const response = await fetch(`${ANALYZE_API_URL}/update-manufacturing-cost/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: formData
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || 'Failed to update manufacturing cost');
//       }

//       const result = await response.json();

//       if (result.total_cost !== undefined) {
//         const updatedData = {
//           ...calculationData,
//           total_cost: result.total_cost,
//           classification: {
//             ...calculationData.classification,
//             female_tool: {
//               ...calculationData.classification?.female_tool,
//               manufacturing_cost: result.female_manufacturing_cost_per_unit
//             },
//             male_tool: {
//               ...calculationData.classification?.male_tool,
//               manufacturing_cost: result.male_manufacturing_cost_per_unit
//             }
//           }
//         };

//         setUpdatedCalculationData(updatedData);
//         message.success(`Manufacturing cost updated! New Total: ₹${result.total_cost.toFixed(2)}`);
//       }

//     } catch (error) {
//       console.error('Error updating cost:', error);
//       message.error(`Failed to update manufacturing cost: ${error.message}`);
//     } finally {
//       setIsUpdatingCost(false);
//     }
//   };

//   const loadModelFromServer = useCallback(async (historyId, modelType = 'male') => {
//     if (!historyId || historyId === 'undefined' || historyId === 'null') {
//       setIsError(true);
//       setLoadingMessage('Invalid history ID. Please upload files again.');
//       message.error('No history ID found');
//       return;
//     }

//     if (loadingAbortControllerRef.current) {
//       loadingAbortControllerRef.current.abort();
//     }

//     setIsModelLoaded(false);
//     setIsError(false);
//     setLoadingProgress(0);
//     setLoadingMessage(`Loading ${modelType} model...`);

//     const abortController = new AbortController();
//     loadingAbortControllerRef.current = abortController;

//     try {
//       setLoadingProgress(20);

//       const url = `${ANALYZE_API_URL}/sheetmetal/all-draco-glb/${historyId}?download=${modelType}`;

//       const response = await fetch(url, {
//         signal: abortController.signal,
//         method: 'GET',
//         headers: {
//           'Accept': 'model/gltf-binary, application/octet-stream, */*',
//           'Cache-Control': 'no-cache'
//         }
//       });

//       const contentType = response.headers.get('content-type');

//       if (contentType && contentType.includes('text/html')) {
//         throw new Error('Backend returned HTML instead of GLB file.');
//       }

//       if (contentType && contentType.includes('application/json')) {
//         const jsonError = await response.json();
//         throw new Error(jsonError.detail || jsonError.error || 'Server returned an error');
//       }

//       if (!response.ok) {
//         throw new Error(`Server error: ${response.status}`);
//       }

//       setLoadingProgress(50);

//       const arrayBuffer = await response.arrayBuffer();

//       if (!arrayBuffer || arrayBuffer.byteLength === 0) {
//         throw new Error('Empty GLB model data received');
//       }

//       setLoadingProgress(75);

//       const dracoLoader = new DRACOLoader();
//       dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

//       const loader = new GLTFLoader();
//       loader.setDRACOLoader(dracoLoader);

//       return new Promise((resolve, reject) => {
//         const timeoutId = setTimeout(() => {
//           reject(new Error('Model loading timeout'));
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
//             setLoadingProgress(95);
//             resolve(gltf);
//           },
//           (error) => {
//             clearTimeout(timeoutId);
//             reject(new Error(`Failed to parse GLB: ${error.message}`));
//           }
//         );
//       });

//     } catch (error) {
//       if (abortController.signal.aborted) return;

//       console.error('Error loading model:', error);
//       setIsError(true);
//       setLoadingMessage(`Error: ${error.message}`);
//       message.error(`Failed to load model: ${error.message}`);
//     }
//   }, []);

//   const processAndAddModel = useCallback((gltfScene) => {
//     if (!sceneRef.current) return;

//     if (modelRef.current && sceneRef.current) {
//       sceneRef.current.remove(modelRef.current);
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
//       controlsRef.current.update();
//     }

//     if (cameraRef.current) {
//       const distance = 4 * 1.5;
//       cameraRef.current.position.set(distance, distance, distance);
//       cameraRef.current.lookAt(0, 0, 0);
//     }

//     gltfScene.traverse((child) => {
//       if (child instanceof THREE.Mesh) {
//         child.material = new THREE.MeshStandardMaterial({
//           color: new THREE.Color('#b0b0b0'),
//           roughness: 0.6,
//           metalness: 0.4
//         });
//       }
//     });

//     sceneRef.current.add(modelGroup);
//     setIsModelLoaded(true);
//     setLoadingProgress(100);
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

//     const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
//     const cube = new THREE.Mesh(cubeGeometry, materials);
//     scene.add(cube);

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
//     scene.add(ambientLight);

//     return { scene, camera, cube, renderer };
//   }, [createTextTexture]);

//   const moveCamera = useCallback((direction) => {
//     if (!controlsRef.current || !cameraRef.current) return;

//     const controls = controlsRef.current;
//     const camera = cameraRef.current;
//     const target = controls.target;

//     const offset = camera.position.clone().sub(target);
//     const angle = Math.PI / 12;

//     const spherical = new THREE.Spherical().setFromVector3(offset);

//     if (direction === 'up' || direction === 'down') {
//       const rotationAngle = direction === 'up' ? angle : -angle;
//       spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi + rotationAngle));
//     } else if (direction === 'left' || direction === 'right') {
//       const rotationAngle = direction === 'left' ? angle : -angle;
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

//   const handleFaceClick = useCallback((face) => {
//     if (!controlsRef.current || !cameraRef.current) return;

//     const cam = cameraRef.current;
//     const controls = controlsRef.current;
//     const distance = cam.position.distanceTo(controls.target);

//     let targetPosition = new THREE.Vector3();
//     let targetUp = new THREE.Vector3(0, 1, 0);

//     switch (face) {
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
//     if (!canvasRef.current) return;

//     let scene, camera, renderer, controls;
//     let cubeScene;
//     let frameId = null;

//     const init = () => {
//       scene = new THREE.Scene();
//       scene.background = new THREE.Color('#f8f9fa');
//       sceneRef.current = scene;

//       const width = canvasRef.current.clientWidth;
//       const height = canvasRef.current.clientHeight;

//       camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
//       camera.position.set(5, 5, 5);
//       cameraRef.current = camera;

//       renderer = new THREE.WebGLRenderer({ 
//         canvas: canvasRef.current,
//         antialias: true 
//       });
//       renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//       renderer.setSize(width, height);
//       renderer.shadowMap.enabled = true;
//       rendererRef.current = renderer;

//       controls = new OrbitControls(camera, renderer.domElement);
//       controls.enableDamping = true;
//       controls.dampingFactor = 0.05;
//       controls.enableZoom = true;
//       controls.zoomSpeed = 2.5;
//       controls.target.set(0, 0, 0);
//       controlsRef.current = controls;

//       const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
//       scene.add(ambientLight);

//       const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x888888, 0.7);
//       scene.add(hemisphereLight);

//       cubeScene = initCubeScene();

//       if (actualHistoryId) {
//         loadModelFromServer(actualHistoryId, activeModel).then((gltf) => {
//           if (gltf) {
//             processAndAddModel(gltf.scene);
//           }
//         });
//       } else {
//         setIsError(true);
//         setLoadingMessage('No history ID provided. Please upload files again.');
//         message.error('Missing history ID');
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
//         cancelAnimationFrame(frameId);
//         window.removeEventListener('resize', handleResize);
//         if (renderer) renderer.dispose();
//         if (cubeScene && cubeScene.renderer) cubeScene.renderer.dispose();
//       };
//     };

//     return init();
//   }, [actualHistoryId, activeModel, loadModelFromServer, processAndAddModel, cubeRotation, initCubeScene]);

//   const handleModelSwitch = async (modelType) => {
//     setActiveModel(modelType);
//     setIsModelLoaded(false);

//     if (!actualHistoryId) {
//       setIsError(true);
//       setLoadingMessage('No history ID available');
//       return;
//     }

//     try {
//       const gltf = await loadModelFromServer(actualHistoryId, modelType);
//       if (gltf) {
//         processAndAddModel(gltf.scene);
//       }
//     } catch (error) {
//       console.error('Error switching model:', error);
//       setIsError(true);
//     }
//   };

//   const handleFullscreen = () => {
//     const elem = document.documentElement;
//     if (!document.fullscreenElement) {
//       elem.requestFullscreen();
//     } else {
//       document.exitFullscreen();
//     }
//   };

//   const handleDimensionChange = (field, value) => {
//     setStockDimensions(prev => ({
//       ...prev,
//       [field]: parseFloat(value) || 0
//     }));
//   };

//   const cancelEditingDimensions = () => {
//     if (calculationData?.classification) {
//       setStockDimensions({
//         female_stock_length: calculationData.classification.female_tool?.stock_dimensions?.stock_length || 0,
//         female_stock_breadth: calculationData.classification.female_tool?.stock_dimensions?.stock_breadth || 0,
//         female_stock_height: calculationData.classification.female_tool?.stock_dimensions?.stock_height || 0,
//         male_stock_length: calculationData.classification.male_tool?.stock_dimensions?.stock_length || 0,
//         male_stock_breadth: calculationData.classification.male_tool?.stock_dimensions?.stock_breadth || 0,
//         male_stock_height: calculationData.classification.male_tool?.stock_dimensions?.stock_height || 0
//       });
//     }
//   };

//   const renderToolDetails = (toolData, toolType) => {
//     if (!toolData) return null;

//     const currentDimensions = toolType === 'female' ? {
//       length: stockDimensions.female_stock_length,
//       breadth: stockDimensions.female_stock_breadth,
//       height: stockDimensions.female_stock_height
//     } : {
//       length: stockDimensions.male_stock_length,
//       breadth: stockDimensions.male_stock_breadth,
//       height: stockDimensions.male_stock_height
//     };

//     const materialCost = (
//       (currentDimensions.length * currentDimensions.breadth * currentDimensions.height * 
//       0.000000001) * 
//       (calculationData?.material?.density || 0) *
//       (calculationData?.material?.cost || 0)
//     );

//     return (
//       <div style={{ fontSize: '12px' }}>
//         <div style={{ marginBottom: '12px' }}>
//           <Text strong>Filename:</Text> {toolData.filename}
//         </div>

//         <Row gutter={8} style={{ marginBottom: '12px' }}>
//           <Col span={12}>
//             <div style={{ 
//               padding: '12px', 
//               background: '#e6f7ff66',
//               border: `1px solid ${theme.primary}22`,
//               borderRadius: '6px',
//               height: '100%'
//             }}>
//               <Text strong style={{ display: 'block', marginBottom: '8px', color: '#0050b3', fontSize: '13px' }}>
//                 ACTUAL DIMENSIONS
//               </Text>

//               <Row gutter={8} style={{ marginBottom: '8px' }}>
//                 <Col span={8}>
//                   <Text style={{ fontSize: '15px', display: 'block' }}>Length:</Text>
//                   <Text strong style={{ fontSize: '14px' }}>{toolData.actual_dimensions?.length?.toFixed(2)} mm</Text>
//                 </Col>
//                 <Col span={8}>
//                   <Text style={{ fontSize: '15px', display: 'block' }}>Breadth:</Text>
//                   <Text strong style={{ fontSize: '14px' }}>{toolData.actual_dimensions?.breadth?.toFixed(2)} mm</Text>
//                 </Col>
//                 <Col span={8}>
//                   <Text style={{ fontSize: '15px', display: 'block' }}>Height:</Text>
//                   <Text strong style={{ fontSize: '14px' }}>{toolData.actual_dimensions?.height?.toFixed(2)} mm</Text>
//                 </Col>
//               </Row>

//               <Row gutter={8}>
//                 <Col span={12}>
//                   <Text style={{ fontSize: '15px', display: 'block' }}>Volume:</Text>
//                   <Text strong style={{ fontSize: '14px' }}>{toolData.actual_dimensions?.volume_mm3?.toLocaleString()} mm³</Text>
//                 </Col>
//                 <Col span={12}>
//                   <Text style={{ fontSize: '15px', display: 'block' }}>Mass:</Text>
//                   <Text strong style={{ fontSize: '14px' }}>{(toolData.actual_dimensions?.volume_m3 * (calculationData?.material?.density || 0))?.toFixed(4)} kg</Text>
//                 </Col>
//               </Row>
//             </div>
//           </Col>

//           <Col span={12}>
//             <div style={{ 
//               padding: '12px', 
//               background: '#f6ffed',
//               borderRadius: '6px',
//               height: '100%',
//               border: '1px solid #a7f3d0',
//               position: 'relative'
//             }}>
//               <Text strong style={{ display: 'block', marginBottom: '8px', color: '#22c55e', fontSize: '13px' }}>
//                 STOCK DIMENSIONS
//               </Text>

//               <Row gutter={8} style={{ marginBottom: '8px' }}>
//                 <Col span={8}>
//                   <Text style={{ fontSize: '15px', display: 'block' }}>Length:</Text>
//                   <Input
//                     type="number"
//                     value={currentDimensions.length}
//                     onChange={(e) => handleDimensionChange(
//                       toolType === 'female' ? 'female_stock_length' : 'male_stock_length', 
//                       e.target.value
//                     )}
//                     size="small"
//                     style={{ fontSize: '14px', fontWeight: 'bold' }}
//                   />
//                 </Col>
//                 <Col span={8}>
//                   <Text style={{ fontSize: '15px', display: 'block' }}>Breadth:</Text>
//                   <Input
//                     type="number"
//                     value={currentDimensions.breadth}
//                     onChange={(e) => handleDimensionChange(
//                       toolType === 'female' ? 'female_stock_breadth' : 'male_stock_breadth', 
//                       e.target.value
//                     )}
//                     size="small"
//                     style={{ fontSize: '14px', fontWeight: 'bold' }}
//                   />
//                 </Col>
//                 <Col span={8}>
//                   <Text style={{ fontSize: '15px', display: 'block' }}>Height:</Text>
//                   <Input
//                     type="number"
//                     value={currentDimensions.height}
//                     onChange={(e) => handleDimensionChange(
//                       toolType === 'female' ? 'female_stock_height' : 'male_stock_height', 
//                       e.target.value
//                     )}
//                     size="small"
//                     style={{ fontSize: '14px', fontWeight: 'bold' }}
//                   />
//                 </Col>
//               </Row>

//               <Row gutter={8}>
//                 <Col span={12}>
//                   <Text style={{ fontSize: '15px', display: 'block' }}>Volume:</Text>
//                   <Text strong style={{ fontSize: '14px' }}>
//                     {(
//                       currentDimensions.length * 
//                       currentDimensions.breadth * 
//                       currentDimensions.height
//                     )?.toLocaleString()} mm³
//                   </Text>
//                 </Col>
//                 <Col span={12}>
//                   <Text style={{ fontSize: '15px', display: 'block' }}>Mass:</Text>
//                   <Text strong style={{ fontSize: '14px' }}>
//                     {(
//                       (currentDimensions.length * currentDimensions.breadth * currentDimensions.height * 
//                       0.000000001) * 
//                       (calculationData?.material?.density || 0)
//                     )?.toFixed(4)} kg
//                   </Text>
//                 </Col>
//               </Row>

//               <div style={{ marginTop: '12px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
//                 <Button 
//                   size="small" 
//                   onClick={cancelEditingDimensions}
//                 >
//                   Cancel
//                 </Button>
//                 <Button 
//                   type="primary" 
//                   size="small" 
//                   icon={<SaveOutlined />}
//                   loading={isUpdatingDimensions}
//                   onClick={handleUpdateDimensions}
//                 >
//                   Update
//                 </Button>
//               </div>
//             </div>
//           </Col>
//         </Row>

//         <Row gutter={8} style={{ marginBottom: '8px' }}>
//           <Col span={24}>
//             <div style={{ 
//               padding: '10px', 
//               background: '#fff2e666',
//               borderRadius: '6px',
//               marginBottom: '8px',
//               border: `1px solid #fa8c1622`
//             }}>
//               <Text strong style={{ fontSize: '15px', color: 'black' }}>Total Design Cost:</Text>
//               <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>
//                 ₹{calculationData?.tool_design?.total_design_cost?.toFixed(2)}
//               </div>
//             </div>
//           </Col>
//         </Row>

//         <Row gutter={8} style={{ marginBottom: '8px' }}>
//           <Col span={12}>
//             <div style={{ 
//               padding: '10px', 
//               background: '#e6f7ff66',
//               borderRadius: '6px',
//               border: `1px solid ${theme.primary}22`,
//             }}>
//               <Text strong style={{ fontSize: '15px', color: 'black' }}>Manufacturing Cost:</Text>
//               <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>
//                 ₹{toolData.manufacturing_cost?.toFixed(2)}
//               </div>
//             </div>
//           </Col>
//           <Col span={12}>
//             <div style={{ 
//               padding: '10px', 
//               background: '#e6f7ff66',
//               borderRadius: '6px',
//               border: `1px solid ${theme.primary}22`,
//             }}>
//               <Text strong style={{ fontSize: '15px', color: 'black' }}>Material Cost:</Text>
//               <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>
//                 ₹{materialCost?.toFixed(2)}
//               </div>
//             </div>
//           </Col>
//         </Row>
//       </div>
//     );
//   };

//   return (
//     <Layout style={{ minHeight: '100vh', background: theme.background }}>

//       <div style={{
//         height: '80px',
//         background: theme.primary,
//         padding: '0 40px',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         boxShadow: theme.shadow,
//         position: 'sticky',
//         top: 0,
//         zIndex: 1000
//       }}>
//         <div>
//           <button
//             onClick={() => navigate('/home/sheet-metal/upload')}
//             style={{
//               padding: '8px 16px',
//               borderRadius: '8px',
//               border: 'none',
//               cursor: 'pointer',
//               color: theme.cardBg,
//               display: 'flex',
//               alignItems: 'center',
//               gap: '8px',
//               fontSize: '14px',
//               fontWeight: '500',
//               transition: 'all 0.3s ease'
//             }}
//             onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
//             onMouseLeave={(e) => e.target.style.background = 'transparent'}
//           >
//             <ArrowLeftOutlined /> Back to Upload
//           </button>
//         </div>

//         <Title level={3} style={{ margin: 0, color: theme.cardBg, fontSize: '25px', fontWeight: '600', justifyContent: 'center' }}>
//           COST ESTIMATION SOFTWARE
//         </Title>

//         <div></div>
//       </div>

//       <Content style={{ padding: '30px 40px', height: 'calc(100vh - 140px)', overflow: 'auto' }}>

//         <div style={{ maxWidth: '100%', height: '100%' }}>
//           <Row gutter={[30, 30]} style={{ height: '100%' }}>
//             <Col xs={24} lg={12} style={{ height: '100%' }}>
//               <Card
//                 title="3D Model Viewer"
//                 style={{
//                   height: '95%',
//                   boxShadow: theme.shadow,
//                   borderRadius: '8px',
//                   background: theme.cardBg,
//                   border: `1px solid ${theme.borderColor}`
//                 }}
//                 bodyStyle={{
//                   padding: '0',
//                   height: 'calc(100% - 65px)',
//                   position: 'relative',
//                   background: theme.modelBg
//                 }}
//                 extra={
//                   <Button
//                     icon={<ExpandOutlined />}
//                     onClick={handleFullscreen}
//                     size="small"
//                   />
//                 }
//               >
//                 <div style={{ position: 'relative', width: '100%', height: '100%' }}>
//                   <canvas
//                     ref={canvasRef}
//                     style={{ width: '100%', height: '100%', display: 'block' }}
//                   />

//                   <div style={{
//                     position: 'absolute',
//                     top: '10px',
//                     right: '10px',
//                     width: '240px',
//                     height: '240px',
//                     display: isModelLoaded ? 'block' : 'none'
//                   }}>
//                     <button onClick={() => moveCamera('up')} style={{
//                       position: 'absolute', left: '50%', top: '5px', transform: 'translateX(-50%)',
//                       background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
//                       border: '2px solid rgba(36, 102, 121, 0.3)', borderRadius: '50%',
//                       width: '36px', height: '36px', cursor: 'pointer',
//                       display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontSize: '16px',
//                       fontWeight: 'bold', color: '#246679', zIndex: 10
//                     }}>↑</button>

//                     <button onClick={() => moveCamera('left')} style={{
//                       position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
//                       background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
//                       border: '2px solid rgba(36, 102, 121, 0.3)', borderRadius: '50%',
//                       width: '36px', height: '36px', cursor: 'pointer',
//                       display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontSize: '16px',
//                       fontWeight: 'bold', color: '#246679', zIndex: 10
//                     }}>←</button>

//                     <div style={{
//                       position: 'absolute', left: '50%', top: '50%',
//                       transform: 'translate(-50%, -50%)', width: '150px', height: '150px',
//                       overflow: 'hidden', pointerEvents: 'none'
//                     }}>
//                       <canvas ref={cubeCanvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

//                       <div style={{
//                         position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
//                         display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
//                         gridTemplateRows: 'repeat(3, 1fr)', pointerEvents: 'auto'
//                       }}>
//                         <div onClick={() => handleFaceClick('top')} style={{ gridColumn: 2, gridRow: 1, cursor: 'pointer' }} />
//                         <div onClick={() => handleFaceClick('left')} style={{ gridColumn: 1, gridRow: 2, cursor: 'pointer' }} />
//                         <div onClick={() => handleFaceClick('front')} style={{ gridColumn: 2, gridRow: 2, cursor: 'pointer' }} />
//                         <div onClick={() => handleFaceClick('right')} style={{ gridColumn: 3, gridRow: 2, cursor: 'pointer' }} />
//                         <div onClick={() => handleFaceClick('bottom')} style={{ gridColumn: 2, gridRow: 3, cursor: 'pointer' }} />
//                       </div>
//                     </div>

//                     <button onClick={() => moveCamera('right')} style={{
//                       position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
//                       background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
//                       border: '2px solid rgba(36, 102, 121, 0.3)', borderRadius: '50%',
//                       width: '36px', height: '36px', cursor: 'pointer',
//                       display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontSize: '16px',
//                       fontWeight: 'bold', color: '#246679', zIndex: 10
//                     }}>→</button>

//                     <button onClick={() => moveCamera('down')} style={{
//                       position: 'absolute', left: '50%', bottom: '5px', transform: 'translateX(-50%)',
//                       background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
//                       border: '2px solid rgba(36, 102, 121, 0.3)', borderRadius: '50%',
//                       width: '36px', height: '36px', cursor: 'pointer',
//                       display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontSize: '16px',
//                       fontWeight: 'bold', color: '#246679', zIndex: 10
//                     }}>↓</button>
//                   </div>

//                   <div style={{
//                     position: 'absolute',
//                     bottom: '20px',
//                     right: '20px',
//                     display: 'flex',
//                     gap: '8px',
//                     flexWrap: 'wrap',
//                     justifyContent: 'flex-end'
//                   }}>
//                     {['female', 'male', 'part'].map((type) => (
//                       <Button
//                         key={type}
//                         size="small"
//                         type={activeModel === type ? 'primary' : 'default'}
//                         onClick={() => handleModelSwitch(type)}
//                         style={{
//                           borderRadius: '6px',
//                           textTransform: 'capitalize',
//                           background: activeModel === type ? theme.primary : 'white',
//                           borderColor: activeModel === type ? theme.primary : theme.borderColor,
//                           color: activeModel === type ? 'white' : theme.textPrimary
//                         }}
//                       >
//                         {type}
//                       </Button>
//                     ))}
//                   </div>

//                   <div style={{
//                     position: 'absolute',
//                     bottom: '20px',
//                     left: '20px'
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
//                         boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
//                       }}
//                     >
//                       ISO
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
//                     <div style={{ textAlign: 'center' }}>
//                       <div style={{
//                         border: `4px solid ${theme.primary}33`,
//                         borderTop: `4px solid ${theme.primary}`,
//                         borderRadius: '50%',
//                         width: '48px',
//                         height: '48px',
//                         animation: 'spin 1s linear infinite',
//                         margin: '0 auto 20px'
//                       }} />
//                       <Text style={{ color: theme.primary, fontSize: '16px', fontWeight: '500' }}>
//                         {loadingMessage}
//                       </Text>
//                       {loadingProgress > 0 && (
//                         <div style={{ marginTop: '16px', width: '200px', margin: '16px auto 0' }}>
//                           <Progress percent={loadingProgress} status="active" />
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
//                     background: 'rgba(255, 255, 255, 0.95)'
//                   }}>
//                     <div style={{ textAlign: 'center' }}>
//                       <div style={{
//                         width: '48px',
//                         height: '48px',
//                         background: '#f5222d',
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
//                       <Text style={{ color: '#f5222d', fontSize: '16px', fontWeight: '500' }}>
//                         {loadingMessage}
//                       </Text>
//                     </div>
//                   </div>
//                 )}
//               </Card>
//             </Col>

//             <Col xs={24} lg={12} style={{ height: '100%' }}>
//               <Card
//                 title="Analysis & Cost Data"
//                 style={{
//                   height: '95%',
//                   boxShadow: theme.shadow,
//                   borderRadius: '8px',
//                   background: theme.cardBg,
//                   border: `1px solid ${theme.borderColor}`,
//                   overflow: 'hidden'
//                 }}
//                 bodyStyle={{
//                   padding: '0',
//                   height: 'calc(100% - 65px)',
//                   overflow: 'auto'
//                 }}
//               >
//                 {calculationData ? (
//                   <div style={{ padding: '16px' }}>
//                     <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: `1px solid ${theme.borderColor}` }}>
//                       <Text style={{ fontSize: '12px', color: theme.textSecondary, fontWeight: '500' }}>
//                         MATERIAL
//                       </Text>
//                       <Title level={4} style={{ margin: '8px 0 0' }}>
//                         {calculationData.material?.name}
//                       </Title>
//                       <Text style={{ fontSize: '12px', color: theme.textSecondary }}>
//                         Density: {calculationData.material?.density} kg/m³
//                       </Text>
//                       <br />
//                       <Text style={{ fontSize: '12px', color: theme.textSecondary }}>
//                         Cost: ₹{calculationData.material?.cost}/kg
//                       </Text>
//                     </div>

//                     <Row gutter={16} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: `1px solid ${theme.borderColor}` }}>
//                       <Col span={12}>
//                         <Text style={{ fontSize: '12px', color: theme.textSecondary, fontWeight: '500', display: 'block', marginBottom: '8px' }}>
//                           MACHINE TYPE
//                         </Text>
//                         <Select
//                           placeholder="Select machine type"
//                           style={{ width: '100%' }}
//                           onChange={handleMachineChange}
//                           value={selectedMachine}
//                           loading={isUpdatingCost}
//                         >
//                           {machineRates.map((rate) => (
//                             <Option 
//                               key={`${rate.machine_type}-${rate.size}`} 
//                               value={`${rate.machine_type}-${rate.size}`}
//                             >
//                               {rate.machine_type} - {rate.size} (₹{rate.hourly_rate}/hr)
//                             </Option>
//                           ))}
//                         </Select>
//                       </Col>

//                       <Col span={12}>
//                         <Text style={{ fontSize: '12px', color: theme.textSecondary, fontWeight: '500', display: 'block', marginBottom: '8px' }}>
//                           QUANTITY
//                         </Text>
//                         <div style={{ display: 'flex', gap: '8px' }}>
//                           <Input
//                             type="number"
//                             min={1}
//                             value={quantity}
//                             onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
//                             style={{ flex: 1 }}
//                             placeholder="Enter quantity"
//                           />
//                           <Button
//                             type="primary"
//                             loading={isUpdatingQuantity}
//                             onClick={handleQuantityUpdate}
//                             style={{
//                               background: theme.primary,
//                               borderColor: theme.primary
//                             }}
//                           >
//                             Update
//                           </Button>
//                         </div>
//                       </Col>
//                     </Row>

//                     <Tabs defaultActiveKey="female">
//                       <Tabs.TabPane tab="Female Tool" key="female">
//                         {renderToolDetails(calculationData.classification?.female_tool, 'female')}
//                       </Tabs.TabPane>

//                       <Tabs.TabPane tab="Male Tool" key="male">
//                         {renderToolDetails(calculationData.classification?.male_tool, 'male')}
//                       </Tabs.TabPane>

//                       <Tabs.TabPane tab="Part" key="part">
//                         <div style={{ fontSize: '12px' }}>
//                           <div style={{ marginBottom: '12px' }}>
//                             <Text strong style={{ fontSize: '13px' }}>Filename:</Text> 
//                             <Text style={{ fontSize: '13px' }}> {calculationData.classification?.part?.filename}</Text>
//                           </div>

//                           <div style={{ 
//                             marginTop: '25px', 
//                             padding: '12px', 
//                             background: '#e6f7ff66',
//                             border: `1px solid ${theme.primary}22`,
//                             borderRadius: '6px'
//                           }}>
//                             <Text strong style={{ display: 'block', marginBottom: '8px', color: '#0050b3', fontSize: '13px' }}>
//                               ACTUAL DIMENSIONS
//                             </Text>

//                             <Row gutter={8} style={{ marginBottom: '8px' }}>
//                               <Col span={8}>
//                                 <Text style={{ fontSize: '15px', display: 'block' }}>Length:</Text>
//                                 <Text strong style={{ fontSize: '14px' }}>{calculationData.classification?.part?.actual_dimensions?.length?.toFixed(2)} mm</Text>
//                               </Col>
//                               <Col span={8}>
//                                 <Text style={{ fontSize: '15px', display: 'block' }}>Breadth:</Text>
//                                 <Text strong style={{ fontSize: '14px' }}>{calculationData.classification?.part?.actual_dimensions?.breadth?.toFixed(2)} mm</Text>
//                               </Col>
//                               <Col span={8}>
//                                 <Text style={{ fontSize: '15px', display: 'block' }}>Height:</Text>
//                                 <Text strong style={{ fontSize: '14px' }}>{calculationData.classification?.part?.actual_dimensions?.height?.toFixed(2)} mm</Text>
//                               </Col>
//                             </Row>

//                             <Row gutter={8}>
//                               <Col span={12}>
//                                 <Text style={{ fontSize: '15px', display: 'block' }}>Volume:</Text>
//                                 <Text strong style={{ fontSize: '14px' }}>{calculationData.classification?.part?.actual_dimensions?.volume_mm3?.toLocaleString()} mm³</Text>
//                               </Col>
//                               {calculationData.classification?.part?.actual_dimensions?.volume_m3 && (
//                                 <Col span={12}>
//                                   <Text style={{ fontSize: '15px', display: 'block' }}>Mass:</Text>
//                                   <Text strong style={{ fontSize: '14px' }}>{(calculationData.classification?.part?.actual_dimensions?.volume_m3 * (calculationData?.material?.density || 0))?.toFixed(4)} kg</Text>
//                                 </Col>
//                               )}
//                             </Row>
//                           </div>

//                           <Row gutter={8} style={{ marginTop: '25px' }}>
//                             <Col span={12}>
//                               <div style={{ 
//                                 padding: '10px', 
//                                 background: '#e6f7ff66',
//                                 border: `1px solid ${theme.primary}22`,
//                                 borderRadius: '6px'
//                               }}>
//                                 <Text strong style={{ fontSize: '15px', color: 'black' }}>Part Forming Cost:</Text>
//                                 <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>
//                                   ₹{calculationData.part_forming?.part_forming_cost?.toFixed(2)}
//                                 </div>
//                               </div>
//                             </Col>
//                             <Col span={12}>
//                               <div style={{ 
//                                 padding: '10px',
//                                 background: '#e6f7ff66',
//                                 border: `1px solid ${theme.primary}22`,
//                                 borderRadius: '6px'
//                               }}>
//                                 <Text strong style={{ fontSize: '15px', color: 'black' }}>Part Forming Cost Per Unit:</Text>
//                                 <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>
//                                   ₹{calculationData.part_forming?.part_forming_cost_per_unit?.toFixed(2)}
//                                 </div>
//                               </div>
//                             </Col>
//                           </Row>
//                         </div>
//                       </Tabs.TabPane>

//                       <Tabs.TabPane tab="Cost Breakdown" key="costs">
//                         <div style={{ fontSize: '12px' }}>
//                           <div style={{ 
//                             marginBottom: '12px',
//                             padding: '12px', 
//                             background: '#e6f7ff66',
//                             border: `1px solid ${theme.primary}22`,
//                             borderRadius: '6px'
//                           }}>
//                             <Text strong style={{ fontSize: '15px', color: 'black' }}>Total Design Cost:</Text>
//                             <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>
//                               ₹{calculationData.tool_design?.total_design_cost?.toFixed(2)}
//                             </div>
//                           </div>

//                           <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: `1px solid ${theme.borderColor}` }}>
//                             <Text strong style={{ display: 'block', marginBottom: '8px', color: theme.primary }}>
//                               FEMALE TOOL
//                             </Text>
//                             <Row gutter={8} style={{ marginBottom: '8px' }}>
//                               <Col span={12}>
//                                 <div style={{ 
//                                   padding: '10px', 
//                                   background: '#e6f7ff66',
//                                   border: `1px solid ${theme.primary}22`,
//                                   borderRadius: '6px'
//                                 }}>
//                                   <Text strong style={{ fontSize: '15px', color: 'black' }}>Material Cost:</Text>
//                                   <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>
//                                     ₹{(
//                                       (stockDimensions.female_stock_length * stockDimensions.female_stock_breadth * stockDimensions.female_stock_height * 
//                                       0.000000001) * 
//                                       (calculationData?.material?.density || 0) *
//                                       (calculationData?.material?.cost || 0)
//                                     )?.toFixed(2)}
//                                   </div>
//                                 </div>
//                               </Col>
//                               <Col span={12}>
//                                 <div style={{ 
//                                   padding: '10px', 
//                                   background: '#e6f7ff66',
//                                   border: `1px solid ${theme.primary}22`,
//                                   borderRadius: '6px'
//                                 }}>
//                                   <Text strong style={{ fontSize: '15px', color: 'black' }}>Manufacturing Cost:</Text>
//                                   <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>
//                                     ₹{calculationData.classification?.female_tool?.manufacturing_cost?.toFixed(2)}
//                                   </div>
//                                 </div>
//                               </Col>
//                             </Row>
//                           </div>

//                           <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: `1px solid ${theme.borderColor}` }}>
//                             <Text strong style={{ display: 'block', marginBottom: '8px', color: theme.primary }}>
//                               MALE TOOL
//                             </Text>
//                             <Row gutter={8} style={{ marginBottom: '8px' }}>
//                               <Col span={12}>
//                                 <div style={{ 
//                                   padding: '10px', 
//                                   background: '#e6f7ff66',
//                                   border: `1px solid ${theme.primary}22`,
//                                   borderRadius: '6px'
//                                 }}>
//                                   <Text strong style={{ fontSize: '15px', color: 'black' }}>Material Cost:</Text>
//                                   <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>
//                                     ₹{(
//                                       (stockDimensions.male_stock_length * stockDimensions.male_stock_breadth * stockDimensions.male_stock_height * 
//                                       0.000000001) * 
//                                       (calculationData?.material?.density || 0) *
//                                       (calculationData?.material?.cost || 0)
//                                     )?.toFixed(2)}
//                                   </div>
//                                 </div>
//                               </Col>
//                               <Col span={12}>
//                                 <div style={{ 
//                                   padding: '10px', 
//                                   background: '#e6f7ff66',
//                                   border: `1px solid ${theme.primary}22`,
//                                   borderRadius: '6px'
//                                 }}>
//                                   <Text strong style={{ fontSize: '15px', color: 'black' }}>Manufacturing Cost:</Text>
//                                   <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>
//                                     ₹{calculationData.classification?.male_tool?.manufacturing_cost?.toFixed(2)}
//                                   </div>
//                                 </div>
//                               </Col>
//                             </Row>
//                           </div>

//                           <div style={{ marginBottom: '12px' }}>
//                             <Row gutter={8}>
//                               <Col span={12}>
//                                 <div style={{ 
//                                   padding: '10px', 
//                                   background: '#e6f7ff66',
//                                   border: `1px solid ${theme.primary}22`,
//                                   borderRadius: '6px'
//                                 }}>
//                                   <Text strong style={{ fontSize: '15px', color: 'black' }}>Part Forming Cost:</Text>
//                                   <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>
//                                     ₹{calculationData.part_forming?.part_forming_cost?.toFixed(2)}
//                                   </div>
//                                 </div>
//                               </Col>
//                               <Col span={12}>
//                                 <div style={{ 
//                                   padding: '10px', 
//                                   background: '#e6f7ff66',
//                                   border: `1px solid ${theme.primary}22`,
//                                   borderRadius: '6px'
//                                 }}>
//                                   <Text strong style={{ fontSize: '15px', color: 'black' }}>Part Forming Cost Per Unit:</Text>
//                                   <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>
//                                     ₹{calculationData.part_forming?.part_forming_cost_per_unit?.toFixed(2)}
//                                   </div>
//                                 </div>
//                               </Col>
//                             </Row>
//                           </div>

//                           <div style={{ 
//                             marginTop: '16px', 
//                             paddingTop: '12px', 
//                             borderTop: `2px solid ${theme.primary}`
//                           }}>
//                             <Row gutter={8}>
//                               <Col span={12}>
//                                 <div style={{ 
//                                   padding: '12px', 
//                                   background: theme.primary,
//                                   borderRadius: '6px'
//                                 }}>
//                                   <Text strong style={{ fontSize: '15px', color: 'white' }}>Total Cost:</Text>
//                                   <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginTop: '4px' }}>
//                                     ₹{calculationData.total_cost?.toFixed(2)}
//                                   </div>
//                                 </div>
//                               </Col>
//                               <Col span={12}>
//                                 <div style={{ 
//                                   padding: '12px', 
//                                   background: theme.primary,
//                                   borderRadius: '6px'
//                                 }}>
//                                   <Text strong style={{ fontSize: '15px', color: 'white' }}>Total Cost Per Unit:</Text>
//                                   <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginTop: '4px' }}>
//                                     ₹{calculationData.total_cost_per_unit?.toFixed(2)}
//                                   </div>
//                                 </div>
//                               </Col>
//                             </Row>
//                           </div>
//                         </div>
//                       </Tabs.TabPane>
//                     </Tabs>
//                   </div>
//                 ) : (
//                   <div style={{ padding: '16px', textAlign: 'center', color: theme.textSecondary }}>
//                     No calculation data available
//                   </div>
//                 )}
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

// export default SheetMetalViewerPage;










//''''this below code is the correct working code even iso view of 3d display  only downloading in report '''''''''''''

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useParams, useLocation, useNavigate } from 'react-router-dom';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { Layout, Card, Typography, Row, Col, Button, Tabs, Progress, message, Select, Input, Modal } from 'antd';
// import { ArrowLeftOutlined, ExpandOutlined, SaveOutlined, DownloadOutlined } from '@ant-design/icons';
// import jsPDF from 'jspdf';

// const { Content } = Layout;
// const { Title, Text } = Typography;
// const { Option } = Select;

// const theme = {
//   primary: '#246679',
//   secondary: '#73b6ca',
//   background: '#f0f2f5',
//   cardBg: '#ffffff',
//   textPrimary: '#000000',
//   textSecondary: '#666666',
//   borderColor: '#d9d9d9',
//   shadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
//   modelBg: '#f8f9fa',
//   cubeColors: {
//     front: '#B0B0B0',
//     back: '#888888',
//     top: '#D3D3D3',
//     bottom: '#6E6E6E',
//     left: '#A9A9A9',
//     right: '#505050'
//   }
// };

// function SheetMetalViewerPage() {
//   const { id } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const canvasRef = useRef(null);
//   const cubeCanvasRef = useRef(null);
//   const controlsRef = useRef(null);
//   const cameraRef = useRef(null);
//   const sceneRef = useRef(null);
//   const modelRef = useRef(null);
//   const rendererRef = useRef(null);
//   const loadingAbortControllerRef = useRef(null);

//   const [isModelLoaded, setIsModelLoaded] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const [loadingMessage, setLoadingMessage] = useState('Loading 3D model...');
//   const [loadingProgress, setLoadingProgress] = useState(0);
//   const [activeModel, setActiveModel] = useState('male');
//   const [machineRates, setMachineRates] = useState([]);
//   const [selectedMachine, setSelectedMachine] = useState(null);
//   const [isUpdatingCost, setIsUpdatingCost] = useState(false);
//   const [cubeRotation, setCubeRotation] = useState({ x: 0, y: 0 });
//   const [updatedCalculationData, setUpdatedCalculationData] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [isUpdatingDimensions, setIsUpdatingDimensions] = useState(false);
//   const [isEditingDimensions, setIsEditingDimensions] = useState(true);
//   const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
//   const [isPdfModalVisible, setIsPdfModalVisible] = useState(false);

//   const ANALYZE_API_URL = 'http://localhost:5678';

//   const { analysisData, calculationData: initialCalculationData, conversionData, historyId } = location.state || {};
//   const actualHistoryId = historyId || location.state?.historyId;

//   const calculationData = updatedCalculationData || initialCalculationData;

//   // Stock dimension state
//   const [stockDimensions, setStockDimensions] = useState({
//     female_stock_length: 0,
//     female_stock_breadth: 0,
//     female_stock_height: 0,
//     male_stock_length: 0,
//     male_stock_breadth: 0,
//     male_stock_height: 0
//   });

//   // Initialize stock dimensions from calculation data
//   useEffect(() => {
//     if (calculationData?.classification) {
//       setStockDimensions({
//         female_stock_length: calculationData.classification.female_tool?.stock_dimensions?.stock_length || 0,
//         female_stock_breadth: calculationData.classification.female_tool?.stock_dimensions?.stock_breadth || 0,
//         female_stock_height: calculationData.classification.female_tool?.stock_dimensions?.stock_height || 0,
//         male_stock_length: calculationData.classification.male_tool?.stock_dimensions?.stock_length || 0,
//         male_stock_breadth: calculationData.classification.male_tool?.stock_dimensions?.stock_breadth || 0,
//         male_stock_height: calculationData.classification.male_tool?.stock_dimensions?.stock_height || 0
//       });
//     }
//   }, [calculationData]);

//   useEffect(() => {
//     if (calculationData?.quantity) {
//       setQuantity(calculationData.quantity);
//     }
//   }, [calculationData]);

//   useEffect(() => {
//     const fetchMachineRates = async () => {
//       try {
//         const response = await fetch(`${ANALYZE_API_URL}/sheetmetal-machine-hour-rates`);
//         const data = await response.json();

//         if (data.success && Array.isArray(data.data)) {
//           setMachineRates(data.data);

//           if (calculationData?.classification?.female_tool?.mhr_machine_type && 
//               calculationData?.classification?.female_tool?.mhr_machine_size) {
//             const initialMachine = `${calculationData.classification.female_tool.mhr_machine_type}-${calculationData.classification.female_tool.mhr_machine_size}`;
//             setSelectedMachine(initialMachine);
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching machine rates:', error);
//         message.error('Failed to load machine rates');
//       }
//     };

//     fetchMachineRates();
//   }, [calculationData]);

//   // PDF Download Functions
//   const showPdfPreview = () => {
//     // setIsPdfModalVisible(true);
//     generatePdfReport();

//   };

//   const handlePdfCancel = () => {
//     setIsPdfModalVisible(false);
//   };

//   const handlePdfDownload = () => {
//     generatePdfReport();
//     setIsPdfModalVisible(false);
//     message.success('PDF report downloaded successfully!');
//   };


// // '''''''this above function is helper function to capture 3d display in ISO view in report'''''''''''''''''''''''''
//   const captureIsometricView = () => {
//   return new Promise((resolve) => {
//     try {
//       let callbackExecuted = false;

//       const handleIsometricCapture = (event) => {
//         if (!callbackExecuted) {
//           callbackExecuted = true;
//           const dataUrl = event.detail;
//           window.removeEventListener('sheetmetalIsometricCaptureComplete', handleIsometricCapture);
//           console.log('Sheet Metal isometric capture received successfully');
//           resolve(dataUrl);
//         }
//       };

//       window.addEventListener('sheetmetalIsometricCaptureComplete', handleIsometricCapture);

//       const captureEvent = new CustomEvent('requestSheetmetalIsometricCapture', {
//         detail: { timestamp: Date.now() }
//       });

//       window.dispatchEvent(captureEvent);
//       console.log('Sheet Metal isometric capture request sent');

//       const timeoutId = setTimeout(() => {
//         if (!callbackExecuted) {
//           callbackExecuted = true;
//           window.removeEventListener('sheetmetalIsometricCaptureComplete', handleIsometricCapture);
//           console.warn('Sheet Metal isometric capture timeout after 5 seconds, returning null');
//           resolve(null);
//         }
//       }, 5000);

//       return () => clearTimeout(timeoutId);

//     } catch (error) {
//       console.error('Error in captureIsometricView:', error);
//       resolve(null);
//     }
//   });
// };


// useEffect(() => {
//   const handleRequestSheetmetalIsometricCapture = async (event) => {
//     try {
//       console.log('SheetMetalViewerPage received isometric capture request');

//       if (!cameraRef.current || !controlsRef.current || !canvasRef.current) {
//         console.error('Required THREE.js references not available');
//         window.dispatchEvent(new CustomEvent('sheetmetalIsometricCaptureComplete', {
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
//         const distance = originalPosition.distanceTo(originalTarget);
//         const isometricDistance = distance * 0.866;
//         const isoX = isometricDistance / Math.sqrt(3);
//         const isoY = isometricDistance / Math.sqrt(3);
//         const isoZ = isometricDistance / Math.sqrt(3);

//         const isoPosition = new THREE.Vector3(isoX, isoY, isoZ).add(originalTarget);

//         console.log('Setting isometric view position for sheet metal model:', isoPosition);

//         // Apply isometric view
//         camera.position.copy(isoPosition);
//         camera.up.set(0, 1, 0);
//         camera.lookAt(originalTarget);
//         controls.update();

//         console.log('Isometric view applied');

//         // Wait for multiple render frames
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

//         tempCtx.drawImage(canvas, 0, 0);

//         // Ensure WebGL rendering is complete
//         const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
//         if (gl) {
//           gl.finish();
//         }

//         const dataUrl = tempCanvas.toDataURL('image/png', 1.0);

//         if (!dataUrl || dataUrl.length < 100) {
//           console.warn('Canvas capture produced invalid or empty image');
//           throw new Error('Canvas capture invalid');
//         }

//         console.log('Sheet Metal isometric view captured successfully, size:', (dataUrl.length / 1024).toFixed(2), 'KB');

//         // Send captured image back
//         window.dispatchEvent(new CustomEvent('sheetmetalIsometricCaptureComplete', {
//           detail: dataUrl
//         }));

//       } catch (captureError) {
//         console.error('Error during sheet metal isometric capture:', captureError);
//         window.dispatchEvent(new CustomEvent('sheetmetalIsometricCaptureComplete', {
//           detail: null
//         }));

//       } finally {
//         // Always restore original camera state
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
//       console.error('Fatal error in sheet metal isometric capture handler:', error);
//       window.dispatchEvent(new CustomEvent('sheetmetalIsometricCaptureComplete', {
//         detail: null
//       }));
//     }
//   };

//   window.addEventListener('requestSheetmetalIsometricCapture', handleRequestSheetmetalIsometricCapture);
//   console.log('Sheet Metal isometric capture handler registered');

//   return () => {
//     window.removeEventListener('requestSheetmetalIsometricCapture', handleRequestSheetmetalIsometricCapture);
//     console.log('Sheet Metal isometric capture handler removed');
//   };

// }, []);
// // '''''''this above function is helper function to capture 3d display in ISO view in report'''''''''''''''''''''''''


// const generatePdfReport = async () => {
//   try {
//     message.loading('Generating PDF report...', 0);

//     const loadImageAsBase64 = (src) => {
//       return new Promise((resolve, reject) => {
//         const img = new Image();
//         img.crossOrigin = 'anonymous';
//         img.onload = function() {
//           const canvas = document.createElement('canvas');
//           const ctx = canvas.getContext('2d');
//           canvas.width = this.width;
//           canvas.height = this.height;
//           ctx.drawImage(this, 0, 0);
//           resolve(canvas.toDataURL('image/png'));
//         };
//         img.onerror = reject;
//         img.src = src;
//       });
//     };

//     const safeString = (value) => {
//       if (value === null || value === undefined) return 'N/A';
//       return String(value);
//     };

//     const formatCurrencyForPDF = (value) => {
//       if (value === null || value === undefined) return 'N/A';
//       const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
//       if (isNaN(numValue)) return 'N/A';
//       // Format as Rs.XXXXX.XXX without commas
//       return `Rs.${numValue.toFixed(3)}`;
//     };

//     let adaLogo = null;
//     let companyLogo = null;

//     try {
//       adaLogo = await loadImageAsBase64('/ADA_LOGO1.png');
//     } catch (error) {
//       console.warn('Could not load ADA logo:', error);
//     }

//     try {
//       companyLogo = await loadImageAsBase64('/kk.png');
//     } catch (error) {
//       console.warn('Could not load company logo:', error);
//     }

//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const pageHeight = pdf.internal.pageSize.getHeight();
//     const margin = 20;
//     const contentWidth = pageWidth - (2 * margin);

//     pdf.setFont('georgia', 'normal');

//     // Header with blue background
//     pdf.setFillColor(20, 93, 160);
//     pdf.rect(0, 10, pageWidth, 25, 'F');

//     if (adaLogo) {
//       pdf.addImage(adaLogo, 'JPEG', margin, 12, 20, 20);
//     }

//     if (companyLogo) {
//       pdf.setFillColor(255, 255, 255);
//       pdf.setDrawColor(200, 200, 200);
//       pdf.roundedRect(pageWidth - margin - 22, 12, 24, 18, 1, 1, 'FD');
//       pdf.addImage(companyLogo, 'PNG', pageWidth - margin - 20, 13, 20, 16);
//     }

//     pdf.setTextColor(255, 255, 255);
//     pdf.setFontSize(22);
//     pdf.setFont('georgia', 'bold');
//     pdf.text('COST ESTIMATION REPORT', pageWidth / 2, 25, { align: 'center' });

//     let yPosition = 45;

//     pdf.setTextColor(0, 0, 0);
//     pdf.setFontSize(14);
//     pdf.setFont('times', 'bold');
//     pdf.text(`Filename: ${safeString(calculationData?.classification?.part?.filename || 'Sheet Metal Part')}`, margin, yPosition);
//     pdf.setFontSize(10);
//     pdf.setFont('times', 'normal');
//     pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, yPosition, { align: 'right' });

//     yPosition += 15;

//     // Capture 3D model screenshot
//     const capture3DModelScreenshot = () => {
//       return new Promise((resolve) => {
//         requestAnimationFrame(() => {
//           try {
//             const canvases = document.querySelectorAll('canvas');
//             let targetCanvas = null;

//             canvases.forEach(canvas => {
//               if (canvas.width > 200 && canvas.height > 200) {
//                 if (!targetCanvas || (canvas.width * canvas.height) > (targetCanvas.width * targetCanvas.height)) {
//                   targetCanvas = canvas;
//                 }
//               }
//             });

//             if (targetCanvas && targetCanvas.width > 0 && targetCanvas.height > 0) {
//               try {
//                 const gl = targetCanvas.getContext('webgl') || targetCanvas.getContext('experimental-webgl');
//                 if (gl) {
//                   gl.finish();
//                 }

//                 const dataURL = targetCanvas.toDataURL('image/png', 1.0);

//                 if (dataURL && dataURL.length > 100) {
//                   console.log('Successfully captured 3D model screenshot');
//                   resolve(dataURL);
//                 } else {
//                   console.warn('Canvas capture returned empty image');
//                   resolve(null);
//                 }
//               } catch (captureError) {
//                 console.warn('Error capturing canvas:', captureError);
//                 resolve(null);
//               }
//             } else {
//               console.warn('No suitable canvas found for screenshot');
//               resolve(null);
//             }
//           } catch (error) {
//             console.warn('Error in screenshot capture:', error);
//             resolve(null);
//           }
//         });
//       });
//     };

//     // const modelScreenshot = await capture3DModelScreenshot();//'''befor capturing 3d displaying in ISO view this line was there replaced with the below line to capture 3d display in ISO view
//      const modelScreenshot = await captureIsometricView();

//     if (modelScreenshot) {
//       const imgWidth = contentWidth * 0.6;
//       const imgHeight = imgWidth * 0.6;
//       const imgX = margin + (contentWidth - imgWidth) / 2;

//       pdf.setDrawColor(200, 200, 200);
//       pdf.setLineWidth(1);
//       pdf.rect(imgX - 2, yPosition - 2, imgWidth + 4, imgHeight + 4);

//       pdf.addImage(modelScreenshot, 'PNG', imgX, yPosition, imgWidth, imgHeight);

//       pdf.setFontSize(10);
//       pdf.setTextColor(100, 100, 100);
//       pdf.setFont('georgia', 'normal');
//       pdf.text('3D Model View', pageWidth / 2, yPosition + imgHeight + 10, { align: 'center' });

//       yPosition += imgHeight + 20;
//     } else {
//       const imgWidth = contentWidth * 0.6;
//       const imgHeight = imgWidth * 0.6;
//       const imgX = margin + (contentWidth - imgWidth) / 2;

//       pdf.setFillColor(240, 240, 240);
//       pdf.setDrawColor(200, 200, 200);
//       pdf.rect(imgX, yPosition, imgWidth, imgHeight, 'FD');

//       pdf.setFontSize(14);
//       pdf.setTextColor(150, 150, 150);
//       pdf.setFont('georgia', 'normal');
//       pdf.text('3D Model Preview', pageWidth / 2, yPosition + imgHeight / 2, { align: 'center' });
//       pdf.text('(Screenshot not available)', pageWidth / 2, yPosition + imgHeight / 2 + 10, { align: 'center' });

//       yPosition += imgHeight + 20;
//     }

//     yPosition += 1;
//     const tableData = [];

//     // Calculate material costs
//     const femaleMaterialCost = (
//       (stockDimensions.female_stock_length * stockDimensions.female_stock_breadth * stockDimensions.female_stock_height * 
//       0.000000001) * 
//       (calculationData?.material?.density || 0) *
//       (calculationData?.material?.cost || 0)
//     );

//     const maleMaterialCost = (
//       (stockDimensions.male_stock_length * stockDimensions.male_stock_breadth * stockDimensions.male_stock_height * 
//       0.000000001) * 
//       (calculationData?.material?.density || 0) *
//       (calculationData?.material?.cost || 0)
//     );

//     tableData.push(['', '']);
//     tableData.push(['MODULE: Sheet Metal Module', '']);

//     tableData.push(['MATERIAL DATA', '']);
//     tableData.push(['Material', safeString(calculationData?.material?.name || 'N/A')]);
//     tableData.push(['Density', calculationData?.material?.density ? `${safeString(calculationData.material.density)} kg/m³` : 'N/A']);
//     tableData.push(['Cost per kg', calculationData?.material?.cost ? `Rs.${calculationData.material.cost.toFixed(3)}` : 'N/A']);

//     tableData.push(['', '']);
//     tableData.push(['MANUFACTURING SETTINGS', '']);
//     tableData.push(['Selected Machine', safeString(selectedMachine || 'N/A')]);
//     tableData.push(['Quantity', safeString(quantity)]);

//     if (calculationData?.classification?.female_tool) {
//       tableData.push(['', '']);
//       tableData.push(['FEMALE TOOL DATA', '']);
//       tableData.push(['Filename', safeString(calculationData.classification.female_tool.filename || 'N/A')]);
//       tableData.push(['Actual Dimensions', 
//         `${calculationData.classification.female_tool.actual_dimensions?.length?.toFixed(2) || '0'} × ${calculationData.classification.female_tool.actual_dimensions?.breadth?.toFixed(2) || '0'} × ${calculationData.classification.female_tool.actual_dimensions?.height?.toFixed(2) || '0'} mm`]);
//       tableData.push(['Actual Volume', safeString(calculationData.classification.female_tool.actual_dimensions?.volume_mm3?.toLocaleString() || '0') + ' mm³']);
//       tableData.push(['Stock Dimensions', 
//         `${stockDimensions.female_stock_length} × ${stockDimensions.female_stock_breadth} × ${stockDimensions.female_stock_height} mm`]);
//       tableData.push(['Stock Volume', safeString((stockDimensions.female_stock_length * stockDimensions.female_stock_breadth * stockDimensions.female_stock_height).toLocaleString()) + ' mm³']);
//     }

//     if (calculationData?.classification?.male_tool) {
//       tableData.push(['', '']);
//       tableData.push(['MALE TOOL DATA', '']);
//       tableData.push(['Filename', safeString(calculationData.classification.male_tool.filename || 'N/A')]);
//       tableData.push(['Actual Dimensions', 
//         `${calculationData.classification.male_tool.actual_dimensions?.length?.toFixed(2) || '0'} × ${calculationData.classification.male_tool.actual_dimensions?.breadth?.toFixed(2) || '0'} × ${calculationData.classification.male_tool.actual_dimensions?.height?.toFixed(2) || '0'} mm`]);
//       tableData.push(['Actual Volume', safeString(calculationData.classification.male_tool.actual_dimensions?.volume_mm3?.toLocaleString() || '0') + ' mm³']);
//       tableData.push(['Stock Dimensions', 
//         `${stockDimensions.male_stock_length} × ${stockDimensions.male_stock_breadth} × ${stockDimensions.male_stock_height} mm`]);
//       tableData.push(['Stock Volume', safeString((stockDimensions.male_stock_length * stockDimensions.male_stock_breadth * stockDimensions.male_stock_height).toLocaleString()) + ' mm³']);
//     }

//     if (calculationData?.classification?.part) {
//       tableData.push(['', '']);
//       tableData.push(['PART DATA', '']);
//       tableData.push(['Filename', safeString(calculationData.classification.part.filename || 'N/A')]);
//       tableData.push(['Actual Dimensions', 
//         `${calculationData.classification.part.actual_dimensions?.length?.toFixed(2) || '0'} × ${calculationData.classification.part.actual_dimensions?.breadth?.toFixed(2) || '0'} × ${calculationData.classification.part.actual_dimensions?.height?.toFixed(2) || '0'} mm`]);
//       tableData.push(['Actual Volume', safeString(calculationData.classification.part.actual_dimensions?.volume_mm3?.toLocaleString() || '0') + ' mm³']);
//       tableData.push(['Mass', calculationData.classification.part.actual_dimensions?.volume_m3 ? 
//         `${(calculationData.classification.part.actual_dimensions.volume_m3 * (calculationData?.material?.density || 0))?.toFixed(4)} kg` : 'N/A']);
//     }

//     if (calculationData) {
//       tableData.push(['', '']);
//       tableData.push(['COST SUMMARY', '']);
//       tableData.push(['Total Design Cost', formatCurrencyForPDF(calculationData.tool_design?.total_design_cost)]);

//       tableData.push([null, null]);
//       tableData.push(['FEMALE TOOL COST', '']);
//       tableData.push(['Material Cost', formatCurrencyForPDF(femaleMaterialCost)]);
//       tableData.push(['Manufacturing Cost', formatCurrencyForPDF(calculationData.classification?.female_tool?.manufacturing_cost)]);

//       tableData.push(['', '']);
//       tableData.push(['MALE TOOL COST', '']);
//       tableData.push(['Material Cost', formatCurrencyForPDF(maleMaterialCost)]);
//       tableData.push(['Manufacturing Cost', formatCurrencyForPDF(calculationData.classification?.male_tool?.manufacturing_cost)]);

//       tableData.push(['', '']);
//       tableData.push(['PART FORMING COST', '']);
//       tableData.push(['Part Forming Cost', formatCurrencyForPDF(calculationData.part_forming?.part_forming_cost)]);
//       tableData.push(['Part Forming Cost Per Unit', formatCurrencyForPDF(calculationData.part_forming?.part_forming_cost_per_unit)]);

//       tableData.push(['', '']);
//       tableData.push(['TOTAL COSTS', '']);
//       tableData.push(['Total Cost', formatCurrencyForPDF(calculationData.total_cost)]);
//       tableData.push(['Total Cost Per Unit', formatCurrencyForPDF(calculationData.total_cost_per_unit)]);
//     }

//     const startY = yPosition;
//     const rowHeight = 5;
//     const col1Width = contentWidth * 0.55;
//     const bottomMargin = 15;

//     let currentY = startY;

//     tableData.forEach((row) => {
//       const [label, value] = row;

//       const isSectionHeader = label && !value && (label.includes('DATA') || label.includes('SETTINGS') || label.includes('SUMMARY') || label.includes('COST') || label.includes('MODULE:') || label.includes('MATERIAL'));
//       const isEmptyRow = !label && !value;
//       const isSubSection = label && !value && (label.includes('TOOL') || label.includes('FORMING') || label.includes('TOTAL'));

//       if (isEmptyRow) {
//         currentY += rowHeight / 2;
//         return;
//       }

//       // Add page break if content would exceed page height
//       if (currentY + rowHeight + bottomMargin > pageHeight) {
//         pdf.addPage();
//         currentY = margin;
//       }

//       const getBackgroundColor = (label) => {
//         if (isSectionHeader) {
//           return [41, 128, 185];
//         }
//         if (isSubSection) {
//           return [52, 152, 219];
//         }
//         if (label.includes('Material') || label.includes('Density') || label.includes('Cost per kg')) {
//           return [217, 237, 247];
//         }
//         if (label.includes('Machine') || label.includes('Quantity') || label.includes('Selected')) {
//           return [236, 236, 236];
//         }
//         if (label.includes('Cost') || label.includes('Volume') || label.includes('Dimensions') || label.includes('Mass') || label.includes('Filename')) {
//           return [245, 245, 245];
//         }
//         return [255, 255, 255];
//       };

//       const bgColor = getBackgroundColor(label);
//       pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
//       pdf.rect(margin, currentY - 1, contentWidth, rowHeight, 'F');

//       if (isSectionHeader || isSubSection) {
//         pdf.setFont('georgia', 'bold');
//         pdf.setFontSize(isSectionHeader ? 9 : 8);
//         pdf.setTextColor(255, 255, 255);
//       } else {
//         pdf.setFont('georgia', 'normal');
//         pdf.setFontSize(8);
//         pdf.setTextColor(0, 0, 0);
//       }

//       pdf.setDrawColor(0, 0, 0);
//       pdf.setLineWidth(0.15);
//       pdf.rect(margin, currentY - 1, contentWidth, rowHeight);

//       if (!isSectionHeader && !isSubSection) {
//         pdf.line(margin + col1Width, currentY - 1, margin + col1Width, currentY + rowHeight - 1);
//       }

//       if (isSectionHeader || isSubSection) {
//         pdf.text(safeString(label), margin + 2, currentY + 2.5);
//       } else {
//         // Truncate long labels to fit in column
//         let displayLabel = safeString(label);
//         if (displayLabel.length > 35) {
//           displayLabel = displayLabel.substring(0, 32) + '...';
//         }
//         pdf.text(displayLabel, margin + 2, currentY + 2.5);

//         const isCostValue = (label.includes('Cost') || label.includes('Price')) && !label.includes('DATA') && !label.includes('SUMMARY');

//         if (isCostValue) {
//           // Right align currency values with padding
//           const valueStr = safeString(value);
//           const textWidth = pdf.getStringUnitWidth(valueStr) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
//           const rightPadding = 2;
//           pdf.text(valueStr, margin + contentWidth - rightPadding, currentY + 2.5, { align: 'right' });
//         } else {
//           // Left align other values in right column
//           let displayValue = safeString(value);
//           const maxValueLength = 30;
//           if (displayValue.length > maxValueLength) {
//             displayValue = displayValue.substring(0, maxValueLength - 2) + '..';
//           }
//           pdf.text(displayValue, margin + col1Width + 2, currentY + 2.5);
//         }
//       }

//       currentY += rowHeight;
//     });

//     pdf.setFontSize(8);
//     pdf.setTextColor(150, 150, 150);
//     pdf.setFont('georgia', 'normal');
//     pdf.text(`Report generated on ${new Date().toLocaleString()}`, margin, pageHeight - 10);

//     message.destroy();

//     Modal.confirm({
//       title: 'PDF Preview - Cost Estimation Report',
//       width: '80%',
//       icon: null,
//       content: (
//         <div style={{ height: '70vh', overflowY: 'auto' }}>
//           <iframe 
//             src={pdf.output('bloburl')} 
//             style={{ 
//               width: '100%', 
//               height: '100%', 
//               border: 'none',
//               borderRadius: '8px'
//             }}
//             title="PDF Preview"
//           />
//         </div>
//       ),
//       okText: 'Download PDF',
//       cancelText: 'Cancel',
//       onOk: () => {
//         const filename = `SheetMetal_Cost_Report_${calculationData?.classification?.part?.filename?.replace(/\.[^/.]+$/, '') || 'Model'}_${new Date().getTime()}.pdf`;
//         pdf.save(filename);
//         message.success('PDF report downloaded successfully!');
//       }
//     });

//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     message.destroy();
//     message.error('Failed to generate PDF report');
//   }
// };
//   // Function to update quantity and recalculate costs
//   const handleQuantityUpdate = async () => {
//     if (!actualHistoryId) {
//       message.error('No history ID available');
//       return;
//     }

//     setIsUpdatingQuantity(true);

//     try {
//       const formData = new URLSearchParams();
//       formData.append('history_id', actualHistoryId);
//       formData.append('new_quantity', quantity);

//       const response = await fetch(`${ANALYZE_API_URL}/update-quantity-cost/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           'accept': 'application/json'
//         },
//         body: formData
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || errorData.message || 'Failed to update quantity');
//       }

//       const result = await response.json();

//       console.log('Quantity Update Response:', result);

//       // Build comprehensive updated data structure
//       const updatedData = {
//         ...calculationData,
//         quantity: result.new_quantity,
//         total_cost: result.updated_values?.total_cost,
//         total_cost_per_unit: result.updated_values?.total_cost_per_unit,
//         material: {
//           name: result.material?.name,
//           density: result.material?.density,
//           cost: result.material?.cost_per_kg,
//           id: result.material?.id
//         },
//         tool_design: {
//           total_design_cost: result.updated_values?.total_design_cost
//         },
//         part_forming: {
//           part_forming_cost: result.updated_values?.part_forming_cost,
//           part_forming_cost_per_unit: result.updated_values?.part_forming_cost_per_unit
//         },
//         classification: {
//           female_tool: {
//             ...calculationData.classification?.female_tool,
//             filename: result.Actual_dimensions?.female_tool?.filename || calculationData.classification?.female_tool?.filename,
//             actual_dimensions: {
//               length: result.Actual_dimensions?.female_tool?.length || calculationData.classification?.female_tool?.actual_dimensions?.length || 0,
//               breadth: result.Actual_dimensions?.female_tool?.breadth || calculationData.classification?.female_tool?.actual_dimensions?.breadth || 0,
//               height: result.Actual_dimensions?.female_tool?.height || calculationData.classification?.female_tool?.actual_dimensions?.height || 0,
//               volume_mm3: result.Actual_dimensions?.female_tool?.volume_mm3 || calculationData.classification?.female_tool?.actual_dimensions?.volume_mm3 || 0,
//               volume_m3: result.Actual_dimensions?.female_tool?.volume_m3 || calculationData.classification?.female_tool?.actual_dimensions?.volume_m3 || 0
//             },
//             stock_dimensions: result.Stock_and_cost?.female?.stock_dimensions || calculationData.classification?.female_tool?.stock_dimensions,
//             manufacturing_cost: result.Stock_and_cost?.female?.manufacturing_cost || calculationData.classification?.female_tool?.manufacturing_cost,
//             volume_removed_m3: calculationData.classification?.female_tool?.volume_removed_m3,
//             mhr: calculationData.classification?.female_tool?.mhr,
//             mhr_machine_type: calculationData.classification?.female_tool?.mhr_machine_type,
//             mhr_machine_size: calculationData.classification?.female_tool?.mhr_machine_size,
//             manufacturing_time_hr: calculationData.classification?.female_tool?.manufacturing_time_hr
//           },
//           male_tool: {
//             ...calculationData.classification?.male_tool,
//             filename: result.Actual_dimensions?.male_tool?.filename || calculationData.classification?.male_tool?.filename,
//             actual_dimensions: {
//               length: result.Actual_dimensions?.male_tool?.length || calculationData.classification?.male_tool?.actual_dimensions?.length || 0,
//               breadth: result.Actual_dimensions?.male_tool?.breadth || calculationData.classification?.male_tool?.actual_dimensions?.breadth || 0,
//               height: result.Actual_dimensions?.male_tool?.height || calculationData.classification?.male_tool?.actual_dimensions?.height || 0,
//               volume_mm3: result.Actual_dimensions?.male_tool?.volume_mm3 || calculationData.classification?.male_tool?.actual_dimensions?.volume_mm3 || 0,
//               volume_m3: result.Actual_dimensions?.male_tool?.volume_m3 || calculationData.classification?.male_tool?.actual_dimensions?.volume_m3 || 0
//             },
//             stock_dimensions: result.Stock_and_cost?.male?.stock_dimensions || calculationData.classification?.male_tool?.stock_dimensions,
//             manufacturing_cost: result.Stock_and_cost?.male?.manufacturing_cost || calculationData.classification?.male_tool?.manufacturing_cost,
//             volume_removed_m3: calculationData.classification?.male_tool?.volume_removed_m3,
//             mhr: calculationData.classification?.male_tool?.mhr,
//             mhr_machine_type: calculationData.classification?.male_tool?.mhr_machine_type,
//             mhr_machine_size: calculationData.classification?.male_tool?.mhr_machine_size,
//             manufacturing_time_hr: calculationData.classification?.male_tool?.manufacturing_time_hr
//           },
//           part: {
//             filename: result.Actual_dimensions?.part?.filename || calculationData.classification?.part?.filename,
//             actual_dimensions: {
//               length: result.Actual_dimensions?.part?.length || calculationData.classification?.part?.actual_dimensions?.length || 0,
//               breadth: result.Actual_dimensions?.part?.breadth || calculationData.classification?.part?.actual_dimensions?.breadth || 0,
//               height: result.Actual_dimensions?.part?.height || calculationData.classification?.part?.actual_dimensions?.height || 0,
//               volume_mm3: result.Actual_dimensions?.part?.volume_mm3 || calculationData.classification?.part?.actual_dimensions?.volume_mm3 || 0,
//               volume_m3: result.Actual_dimensions?.part?.volume_m3 || calculationData.classification?.part?.actual_dimensions?.volume_m3 || 0
//             }
//           }
//         }
//       };

//       setUpdatedCalculationData(updatedData);
//       message.success(`Quantity updated to ${result.new_quantity}! All costs recalculated.`);

//     } catch (error) {
//       console.error('Error updating quantity:', error);
//       message.error(`Failed to update quantity: ${error.message}`);
//     } finally {
//       setIsUpdatingQuantity(false);
//     }
//   };

//   // Function to update stock dimensions
//   const handleUpdateDimensions = async () => {
//     if (!actualHistoryId) {
//       message.error('No history ID available');
//       return;
//     }

//     setIsUpdatingDimensions(true);

//     try {
//       const formData = new URLSearchParams();
//       formData.append('history_id', actualHistoryId);
//       formData.append('female_stock_length', stockDimensions.female_stock_length);
//       formData.append('female_stock_breadth', stockDimensions.female_stock_breadth);
//       formData.append('female_stock_height', stockDimensions.female_stock_height);
//       formData.append('male_stock_length', stockDimensions.male_stock_length);
//       formData.append('male_stock_breadth', stockDimensions.male_stock_breadth);
//       formData.append('male_stock_height', stockDimensions.male_stock_height);

//       const response = await fetch(`${ANALYZE_API_URL}/recalculate-stock/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           'accept': 'application/json'
//         },
//         body: formData
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || errorData.message || 'Failed to update stock dimensions');
//       }

//       const result = await response.json();

//       console.log('API Response:', result);

//       const updatedData = {
//         ...calculationData,
//         ...result,
//         material: result.material || calculationData.material,
//         quantity: result.quantity || calculationData.quantity,
//         total_cost: result.total_cost,
//         total_cost_per_unit: result.total_cost_per_unit,
//         tool_design: result.tool_design || calculationData.tool_design,
//         part_forming: result.part_forming || calculationData.part_forming,
//         classification: {
//           female_tool: {
//             ...result.classification?.female_tool,
//             filename: result.classification?.female_tool?.filename || calculationData.classification?.female_tool?.filename,
//             actual_dimensions: {
//               length: result.actual_female_dimensions?.length || 0,
//               breadth: result.actual_female_dimensions?.breadth || 0,
//               height: result.actual_female_dimensions?.height || 0,
//               volume_mm3: result.actual_female_dimensions?.volume_mm3 || 0,
//               volume_m3: result.actual_female_dimensions?.volume_m3 || 0
//             },
//             stock_dimensions: result.classification?.female_tool?.stock_dimensions,
//             manufacturing_cost: result.classification?.female_tool?.manufacturing_cost,
//             volume_removed_m3: result.classification?.female_tool?.volume_removed_m3,
//             mhr: result.classification?.female_tool?.mhr,
//             mhr_machine_type: result.classification?.female_tool?.mhr_machine_type,
//             mhr_machine_size: result.classification?.female_tool?.mhr_machine_size,
//             manufacturing_time_hr: result.classification?.female_tool?.manufacturing_time_hr
//           },
//           male_tool: {
//             ...result.classification?.male_tool,
//             filename: result.classification?.male_tool?.filename || calculationData.classification?.male_tool?.filename,
//             actual_dimensions: {
//               length: result.actual_male_dimensions?.length || 0,
//               breadth: result.actual_male_dimensions?.breadth || 0,
//               height: result.actual_male_dimensions?.height || 0,
//               volume_mm3: result.actual_male_dimensions?.volume_mm3 || 0,
//               volume_m3: result.actual_male_dimensions?.volume_m3 || 0
//             },
//             stock_dimensions: result.classification?.male_tool?.stock_dimensions,
//             manufacturing_cost: result.classification?.male_tool?.manufacturing_cost,
//             volume_removed_m3: result.classification?.male_tool?.volume_removed_m3,
//             mhr: result.classification?.male_tool?.mhr,
//             mhr_machine_type: result.classification?.male_tool?.mhr_machine_type,
//             mhr_machine_size: result.classification?.male_tool?.mhr_machine_size,
//             manufacturing_time_hr: result.classification?.male_tool?.manufacturing_time_hr
//           },
//           part: {
//             filename: result.classification?.part?.filename || result.actual_part_dimensions?.filename || calculationData.classification?.part?.filename,
//             actual_dimensions: {
//               length: result.actual_part_dimensions?.length || 0,
//               breadth: result.actual_part_dimensions?.breadth || 0,
//               height: result.actual_part_dimensions?.height || 0,
//               volume_mm3: result.actual_part_dimensions?.volume_mm3 || 0,
//               volume_m3: result.actual_part_dimensions?.volume_m3 || 0
//             }
//           }
//         }
//       };

//       console.log('Updated Data:', updatedData);

//       setUpdatedCalculationData(updatedData);
//       message.success('Stock dimensions updated successfully!');

//     } catch (error) {
//       console.error('Error updating stock dimensions:', error);
//       message.error(`Failed to update stock dimensions: ${error.message}`);
//     } finally {
//       setIsUpdatingDimensions(false);
//     }
//   };

//   const handleMachineChange = async (value) => {
//     const selectedRate = machineRates.find(rate => 
//       `${rate.machine_type}-${rate.size}` === value
//     );

//     if (!selectedRate || !actualHistoryId) return;

//     setSelectedMachine(value);
//     setIsUpdatingCost(true);

//     try {
//       const formData = new URLSearchParams();
//       formData.append('history_id', actualHistoryId);
//       formData.append('machine_type', selectedRate.machine_type);
//       formData.append('size', selectedRate.size);

//       const response = await fetch(`${ANALYZE_API_URL}/update-manufacturing-cost/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: formData
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || 'Failed to update manufacturing cost');
//       }

//       const result = await response.json();

//       if (result.total_cost !== undefined) {
//         const updatedData = {
//           ...calculationData,
//           total_cost: result.total_cost,
//           classification: {
//             ...calculationData.classification,
//             female_tool: {
//               ...calculationData.classification?.female_tool,
//               manufacturing_cost: result.female_manufacturing_cost_per_unit
//             },
//             male_tool: {
//               ...calculationData.classification?.male_tool,
//               manufacturing_cost: result.male_manufacturing_cost_per_unit
//             }
//           }
//         };

//         setUpdatedCalculationData(updatedData);
//         message.success(`Manufacturing cost updated! New Total: ₹${result.total_cost.toFixed(2)}`);
//       }

//     } catch (error) {
//       console.error('Error updating cost:', error);
//       message.error(`Failed to update manufacturing cost: ${error.message}`);
//     } finally {
//       setIsUpdatingCost(false);
//     }
//   };

//   const loadModelFromServer = useCallback(async (historyId, modelType = 'male') => {
//     if (!historyId || historyId === 'undefined' || historyId === 'null') {
//       setIsError(true);
//       setLoadingMessage('Invalid history ID. Please upload files again.');
//       message.error('No history ID found');
//       return;
//     }

//     if (loadingAbortControllerRef.current) {
//       loadingAbortControllerRef.current.abort();
//     }

//     setIsModelLoaded(false);
//     setIsError(false);
//     setLoadingProgress(0);
//     setLoadingMessage(`Loading ${modelType} model...`);

//     const abortController = new AbortController();
//     loadingAbortControllerRef.current = abortController;

//     try {
//       setLoadingProgress(20);

//       const url = `${ANALYZE_API_URL}/sheetmetal/all-draco-glb/${historyId}?download=${modelType}`;

//       const response = await fetch(url, {
//         signal: abortController.signal,
//         method: 'GET',
//         headers: {
//           'Accept': 'model/gltf-binary, application/octet-stream, */*',
//           'Cache-Control': 'no-cache'
//         }
//       });

//       const contentType = response.headers.get('content-type');

//       if (contentType && contentType.includes('text/html')) {
//         throw new Error('Backend returned HTML instead of GLB file.');
//       }

//       if (contentType && contentType.includes('application/json')) {
//         const jsonError = await response.json();
//         throw new Error(jsonError.detail || jsonError.error || 'Server returned an error');
//       }

//       if (!response.ok) {
//         throw new Error(`Server error: ${response.status}`);
//       }

//       setLoadingProgress(50);

//       const arrayBuffer = await response.arrayBuffer();

//       if (!arrayBuffer || arrayBuffer.byteLength === 0) {
//         throw new Error('Empty GLB model data received');
//       }

//       setLoadingProgress(75);

//       const dracoLoader = new DRACOLoader();
//       dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

//       const loader = new GLTFLoader();
//       loader.setDRACOLoader(dracoLoader);

//       return new Promise((resolve, reject) => {
//         const timeoutId = setTimeout(() => {
//           reject(new Error('Model loading timeout'));
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
//             setLoadingProgress(95);
//             resolve(gltf);
//           },
//           (error) => {
//             clearTimeout(timeoutId);
//             reject(new Error(`Failed to parse GLB: ${error.message}`));
//           }
//         );
//       });

//     } catch (error) {
//       if (abortController.signal.aborted) return;

//       console.error('Error loading model:', error);
//       setIsError(true);
//       setLoadingMessage(`Error: ${error.message}`);
//       message.error(`Failed to load model: ${error.message}`);
//     }
//   }, []);

//   const processAndAddModel = useCallback((gltfScene) => {
//     if (!sceneRef.current) return;

//     if (modelRef.current && sceneRef.current) {
//       sceneRef.current.remove(modelRef.current);
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
//       controlsRef.current.update();
//     }

//     if (cameraRef.current) {
//       const distance = 4 * 1.5;
//       cameraRef.current.position.set(distance, distance, distance);
//       cameraRef.current.lookAt(0, 0, 0);
//     }

//     gltfScene.traverse((child) => {
//       if (child instanceof THREE.Mesh) {
//         child.material = new THREE.MeshStandardMaterial({
//           color: new THREE.Color('#b0b0b0'),
//           roughness: 0.6,
//           metalness: 0.4
//         });
//       }
//     });

//     sceneRef.current.add(modelGroup);
//     setIsModelLoaded(true);
//     setLoadingProgress(100);
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

//     const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
//     const cube = new THREE.Mesh(cubeGeometry, materials);
//     scene.add(cube);

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
//     scene.add(ambientLight);

//     return { scene, camera, cube, renderer };
//   }, [createTextTexture]);

//   const moveCamera = useCallback((direction) => {
//     if (!controlsRef.current || !cameraRef.current) return;

//     const controls = controlsRef.current;
//     const camera = cameraRef.current;
//     const target = controls.target;

//     const offset = camera.position.clone().sub(target);
//     const angle = Math.PI / 12;

//     const spherical = new THREE.Spherical().setFromVector3(offset);

//     if (direction === 'up' || direction === 'down') {
//       const rotationAngle = direction === 'up' ? angle : -angle;
//       spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi + rotationAngle));
//     } else if (direction === 'left' || direction === 'right') {
//       const rotationAngle = direction === 'left' ? angle : -angle;
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

//   const handleFaceClick = useCallback((face) => {
//     if (!controlsRef.current || !cameraRef.current) return;

//     const cam = cameraRef.current;
//     const controls = controlsRef.current;
//     const distance = cam.position.distanceTo(controls.target);

//     let targetPosition = new THREE.Vector3();
//     let targetUp = new THREE.Vector3(0, 1, 0);

//     switch (face) {
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
//     if (!canvasRef.current) return;

//     let scene, camera, renderer, controls;
//     let cubeScene;
//     let frameId = null;

//     const init = () => {
//       scene = new THREE.Scene();
//       scene.background = new THREE.Color('#f8f9fa');
//       sceneRef.current = scene;

//       const width = canvasRef.current.clientWidth;
//       const height = canvasRef.current.clientHeight;

//       camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
//       camera.position.set(5, 5, 5);
//       cameraRef.current = camera;

//       renderer = new THREE.WebGLRenderer({ 
//         canvas: canvasRef.current,
//         antialias: true 
//       });
//       renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//       renderer.setSize(width, height);
//       renderer.shadowMap.enabled = true;
//       rendererRef.current = renderer;

//       controls = new OrbitControls(camera, renderer.domElement);
//       controls.enableDamping = true;
//       controls.dampingFactor = 0.05;
//       controls.enableZoom = true;
//       controls.zoomSpeed = 2.5;
//       controls.target.set(0, 0, 0);
//       controlsRef.current = controls;

//       const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
//       scene.add(ambientLight);

//       const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x888888, 0.7);
//       scene.add(hemisphereLight);

//       cubeScene = initCubeScene();

//       if (actualHistoryId) {
//         loadModelFromServer(actualHistoryId, activeModel).then((gltf) => {
//           if (gltf) {
//             processAndAddModel(gltf.scene);
//           }
//         });
//       } else {
//         setIsError(true);
//         setLoadingMessage('No history ID provided. Please upload files again.');
//         message.error('Missing history ID');
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
//         cancelAnimationFrame(frameId);
//         window.removeEventListener('resize', handleResize);
//         if (renderer) renderer.dispose();
//         if (cubeScene && cubeScene.renderer) cubeScene.renderer.dispose();
//       };
//     };

//     return init();
//   }, [actualHistoryId, activeModel, loadModelFromServer, processAndAddModel, cubeRotation, initCubeScene]);

//   const handleModelSwitch = async (modelType) => {
//     setActiveModel(modelType);
//     setIsModelLoaded(false);

//     if (!actualHistoryId) {
//       setIsError(true);
//       setLoadingMessage('No history ID available');
//       return;
//     }

//     try {
//       const gltf = await loadModelFromServer(actualHistoryId, modelType);
//       if (gltf) {
//         processAndAddModel(gltf.scene);
//       }
//     } catch (error) {
//       console.error('Error switching model:', error);
//       setIsError(true);
//     }
//   };

//   const handleFullscreen = () => {
//     const elem = document.documentElement;
//     if (!document.fullscreenElement) {
//       elem.requestFullscreen();
//     } else {
//       document.exitFullscreen();
//     }
//   };

//   const handleDimensionChange = (field, value) => {
//     setStockDimensions(prev => ({
//       ...prev,
//       [field]: parseFloat(value) || 0
//     }));
//   };

//   const cancelEditingDimensions = () => {
//     if (calculationData?.classification) {
//       setStockDimensions({
//         female_stock_length: calculationData.classification.female_tool?.stock_dimensions?.stock_length || 0,
//         female_stock_breadth: calculationData.classification.female_tool?.stock_dimensions?.stock_breadth || 0,
//         female_stock_height: calculationData.classification.female_tool?.stock_dimensions?.stock_height || 0,
//         male_stock_length: calculationData.classification.male_tool?.stock_dimensions?.stock_length || 0,
//         male_stock_breadth: calculationData.classification.male_tool?.stock_dimensions?.stock_breadth || 0,
//         male_stock_height: calculationData.classification.male_tool?.stock_dimensions?.stock_height || 0
//       });
//     }
//   };

//   const renderToolDetails = (toolData, toolType) => {
//     if (!toolData) return null;

//     const currentDimensions = toolType === 'female' ? {
//       length: stockDimensions.female_stock_length,
//       breadth: stockDimensions.female_stock_breadth,
//       height: stockDimensions.female_stock_height
//     } : {
//       length: stockDimensions.male_stock_length,
//       breadth: stockDimensions.male_stock_breadth,
//       height: stockDimensions.male_stock_height
//     };

//     const materialCost = (
//       (currentDimensions.length * currentDimensions.breadth * currentDimensions.height * 
//       0.000000001) * 
//       (calculationData?.material?.density || 0) *
//       (calculationData?.material?.cost || 0)
//     );

//     return (
//       <div style={{ fontSize: '12px' }}>
//         <div style={{ marginBottom: '12px' }}>
//           <Text strong>Filename:</Text> {toolData.filename}
//         </div>

//         <Row gutter={8} style={{ marginBottom: '12px' }}>
//           <Col span={12}>
//             <div style={{ 
//               padding: '12px', 
//               background: '#e6f7ff66',
//               border: `1px solid ${theme.primary}22`,
//               borderRadius: '6px',
//               height: '100%'
//             }}>
//               <Text strong style={{ display: 'block', marginBottom: '8px', color: '#0050b3', fontSize: '13px' }}>
//                 ACTUAL DIMENSIONS
//               </Text>

//               <Row gutter={8} style={{ marginBottom: '8px' }}>
//                 <Col span={8}>
//                   <Text style={{ fontSize: '15px', display: 'block' }}>Length:</Text>
//                   <Text strong style={{ fontSize: '14px' }}>{toolData.actual_dimensions?.length?.toFixed(2)} mm</Text>
//                 </Col>
//                 <Col span={8}>
//                   <Text style={{ fontSize: '15px', display: 'block' }}>Breadth:</Text>
//                   <Text strong style={{ fontSize: '14px' }}>{toolData.actual_dimensions?.breadth?.toFixed(2)} mm</Text>
//                 </Col>
//                 <Col span={8}>
//                   <Text style={{ fontSize: '15px', display: 'block' }}>Height:</Text>
//                   <Text strong style={{ fontSize: '14px' }}>{toolData.actual_dimensions?.height?.toFixed(2)} mm</Text>
//                 </Col>
//               </Row>

//               <Row gutter={8}>
//                 <Col span={12}>
//                   <Text style={{ fontSize: '15px', display: 'block' }}>Volume:</Text>
//                   <Text strong style={{ fontSize: '14px' }}>{toolData.actual_dimensions?.volume_mm3?.toLocaleString()} mm³</Text>
//                 </Col>
//                 <Col span={12}>
//                   <Text style={{ fontSize: '15px', display: 'block' }}>Mass:</Text>
//                   <Text strong style={{ fontSize: '14px' }}>{(toolData.actual_dimensions?.volume_m3 * (calculationData?.material?.density || 0))?.toFixed(4)} kg</Text>
//                 </Col>
//               </Row>
//             </div>
//           </Col>

//           <Col span={12}>
//             <div style={{ 
//               padding: '12px', 
//               background: '#f6ffed',
//               borderRadius: '6px',
//               height: '100%',
//               border: '1px solid #a7f3d0',
//               position: 'relative'
//             }}>
//               <Text strong style={{ display: 'block', marginBottom: '8px', color: '#22c55e', fontSize: '13px' }}>
//                 STOCK DIMENSIONS
//               </Text>

//               <Row gutter={8} style={{ marginBottom: '8px' }}>
//                 <Col span={8}>
//                   <Text style={{ fontSize: '15px', display: 'block' }}>Length:</Text>
//                   <Input
//                     type="number"
//                     value={currentDimensions.length}
//                     onChange={(e) => handleDimensionChange(
//                       toolType === 'female' ? 'female_stock_length' : 'male_stock_length', 
//                       e.target.value
//                     )}
//                     size="small"
//                     style={{ fontSize: '14px', fontWeight: 'bold' }}
//                   />
//                 </Col>
//                 <Col span={8}>
//                   <Text style={{ fontSize: '15px', display: 'block' }}>Breadth:</Text>
//                   <Input
//                     type="number"
//                     value={currentDimensions.breadth}
//                     onChange={(e) => handleDimensionChange(
//                       toolType === 'female' ? 'female_stock_breadth' : 'male_stock_breadth', 
//                       e.target.value
//                     )}
//                     size="small"
//                     style={{ fontSize: '14px', fontWeight: 'bold' }}
//                   />
//                 </Col>
//                 <Col span={8}>
//                   <Text style={{ fontSize: '15px', display: 'block' }}>Height:</Text>
//                   <Input
//                     type="number"
//                     value={currentDimensions.height}
//                     onChange={(e) => handleDimensionChange(
//                       toolType === 'female' ? 'female_stock_height' : 'male_stock_height', 
//                       e.target.value
//                     )}
//                     size="small"
//                     style={{ fontSize: '14px', fontWeight: 'bold' }}
//                   />
//                 </Col>
//               </Row>

//               <Row gutter={8}>
//                 <Col span={12}>
//                   <Text style={{ fontSize: '15px', display: 'block' }}>Volume:</Text>
//                   <Text strong style={{ fontSize: '14px' }}>
//                     {(
//                       currentDimensions.length * 
//                       currentDimensions.breadth * 
//                       currentDimensions.height
//                     )?.toLocaleString()} mm³
//                   </Text>
//                 </Col>
//                 <Col span={12}>
//                   <Text style={{ fontSize: '15px', display: 'block' }}>Mass:</Text>
//                   <Text strong style={{ fontSize: '14px' }}>
//                     {(
//                       (currentDimensions.length * currentDimensions.breadth * currentDimensions.height * 
//                       0.000000001) * 
//                       (calculationData?.material?.density || 0)
//                     )?.toFixed(4)} kg
//                   </Text>
//                 </Col>
//               </Row>

//               <div style={{ marginTop: '12px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
//                 <Button 
//                   size="small" 
//                   onClick={cancelEditingDimensions}
//                 >
//                   Cancel
//                 </Button>
//                 <Button 
//                   type="primary" 
//                   size="small" 
//                   icon={<SaveOutlined />}
//                   loading={isUpdatingDimensions}
//                   onClick={handleUpdateDimensions}
//                 >
//                   Update
//                 </Button>
//               </div>
//             </div>
//           </Col>
//         </Row>

//         <Row gutter={8} style={{ marginBottom: '8px' }}>
//           <Col span={24}>
//             <div style={{ 
//               padding: '10px', 
//               background: '#fff2e666',
//               borderRadius: '6px',
//               marginBottom: '8px',
//               border: `1px solid #fa8c1622`
//             }}>
//               <Text strong style={{ fontSize: '15px', color: 'black' }}>Total tool Design Cost:</Text>
//               <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>
//                 ₹{calculationData?.tool_design?.total_design_cost?.toFixed(2)}
//               </div>
//             </div>
//           </Col>
//         </Row>

//         <Row gutter={8} style={{ marginBottom: '8px' }}>
//           <Col span={12}>
//             <div style={{ 
//               padding: '10px', 
//               background: '#e6f7ff66',
//               borderRadius: '6px',
//               border: `1px solid ${theme.primary}22`,
//             }}>
//               <Text strong style={{ fontSize: '15px', color: 'black' }}>Manufacturing Cost:</Text>
//               <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>
//                 ₹{toolData.manufacturing_cost?.toFixed(2)}
//               </div>
//             </div>
//           </Col>
//           <Col span={12}>
//             <div style={{ 
//               padding: '10px', 
//               background: '#e6f7ff66',
//               borderRadius: '6px',
//               border: `1px solid ${theme.primary}22`,
//             }}>
//               <Text strong style={{ fontSize: '15px', color: 'black' }}>Material Cost:</Text>
//               <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>
//                 ₹{materialCost?.toFixed(2)}
//               </div>
//             </div>
//           </Col>
//         </Row>
//       </div>
//     );
//   };

//   return (
//     <Layout style={{ minHeight: '100vh', background: theme.background }}>

//       <div style={{
//         height: '80px',
//         background: theme.primary,
//         padding: '0 40px',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         boxShadow: theme.shadow,
//         position: 'sticky',
//         top: 0,
//         zIndex: 1000
//       }}>
//         <div>
//           <button
//             onClick={() => navigate('/home/sheet-metal/upload')}
//             style={{
//               padding: '8px 16px',
//               borderRadius: '8px',
//               border: 'none',
//               cursor: 'pointer',
//               color: theme.cardBg,
//               display: 'flex',
//               alignItems: 'center',
//               gap: '8px',
//               fontSize: '14px',
//               fontWeight: '500',
//               transition: 'all 0.3s ease'
//             }}
//             onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
//             onMouseLeave={(e) => e.target.style.background = 'transparent'}
//           >
//             <ArrowLeftOutlined /> Back to Upload
//           </button>
//         </div>

//         <Title level={3} style={{ margin: 0, color: theme.cardBg, fontSize: '25px', fontWeight: '600', justifyContent: 'center' }}>
//           COST ESTIMATION SOFTWARE
//         </Title>


//       </div>

//       <Content style={{ padding: '30px 40px', height: 'calc(100vh - 140px)', overflow: 'auto' }}>

//         <div style={{ maxWidth: '100%', height: '100%' }}>
//           <Row gutter={[30, 30]} style={{ height: '100%' }}>
//             <Col xs={24} lg={12} style={{ height: '100%' }}>
//               <Card
//                 title="3D Model Viewer"
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
//                   position: 'relative',
//                   background: theme.modelBg
//                 }}
//                 extra={
//                   <Button
//                     icon={<ExpandOutlined />}
//                     onClick={handleFullscreen}
//                     size="small"
//                   />
//                 }
//               >
//                 <div style={{ position: 'relative', width: '100%', height: '100%' }}>
//                   <canvas
//                     ref={canvasRef}
//                     style={{ width: '100%', height: '100%', display: 'block' }}
//                   />

//                   <div style={{
//                     position: 'absolute',
//                     top: '10px',
//                     right: '10px',
//                     width: '240px',
//                     height: '240px',
//                     display: isModelLoaded ? 'block' : 'none'
//                   }}>
//                     <button onClick={() => moveCamera('up')} style={{
//                       position: 'absolute', left: '50%', top: '5px', transform: 'translateX(-50%)',
//                       background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
//                       border: '2px solid rgba(36, 102, 121, 0.3)', borderRadius: '50%',
//                       width: '36px', height: '36px', cursor: 'pointer',
//                       display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontSize: '16px',
//                       fontWeight: 'bold', color: '#246679', zIndex: 10
//                     }}>↑</button>

//                     <button onClick={() => moveCamera('left')} style={{
//                       position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
//                       background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
//                       border: '2px solid rgba(36, 102, 121, 0.3)', borderRadius: '50%',
//                       width: '36px', height: '36px', cursor: 'pointer',
//                       display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontSize: '16px',
//                       fontWeight: 'bold', color: '#246679', zIndex: 10
//                     }}>←</button>

//                     <div style={{
//                       position: 'absolute', left: '50%', top: '50%',
//                       transform: 'translate(-50%, -50%)', width: '150px', height: '150px',
//                       overflow: 'hidden', pointerEvents: 'none'
//                     }}>
//                       <canvas ref={cubeCanvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

//                       <div style={{
//                         position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
//                         display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
//                         gridTemplateRows: 'repeat(3, 1fr)', pointerEvents: 'auto'
//                       }}>
//                         <div onClick={() => handleFaceClick('top')} style={{ gridColumn: 2, gridRow: 1, cursor: 'pointer' }} />
//                         <div onClick={() => handleFaceClick('left')} style={{ gridColumn: 1, gridRow: 2, cursor: 'pointer' }} />
//                         <div onClick={() => handleFaceClick('front')} style={{ gridColumn: 2, gridRow: 2, cursor: 'pointer' }} />
//                         <div onClick={() => handleFaceClick('right')} style={{ gridColumn: 3, gridRow: 2, cursor: 'pointer' }} />
//                         <div onClick={() => handleFaceClick('bottom')} style={{ gridColumn: 2, gridRow: 3, cursor: 'pointer' }} />
//                       </div>
//                     </div>

//                     <button onClick={() => moveCamera('right')} style={{
//                       position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
//                       background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
//                       border: '2px solid rgba(36, 102, 121, 0.3)', borderRadius: '50%',
//                       width: '36px', height: '36px', cursor: 'pointer',
//                       display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontSize: '16px',
//                       fontWeight: 'bold', color: '#246679', zIndex: 10
//                     }}>→</button>

//                     <button onClick={() => moveCamera('down')} style={{
//                       position: 'absolute', left: '50%', bottom: '5px', transform: 'translateX(-50%)',
//                       background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
//                       border: '2px solid rgba(36, 102, 121, 0.3)', borderRadius: '50%',
//                       width: '36px', height: '36px', cursor: 'pointer',
//                       display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontSize: '16px',
//                       fontWeight: 'bold', color: '#246679', zIndex: 10
//                     }}>↓</button>
//                   </div>

//                   <div style={{
//                     position: 'absolute',
//                     bottom: '20px',
//                     right: '20px',
//                     display: 'flex',
//                     gap: '8px',
//                     flexWrap: 'wrap',
//                     justifyContent: 'flex-end'
//                   }}>
//                     {['female', 'male', 'part'].map((type) => (
//                       <Button
//                         key={type}
//                         size="small"
//                         type={activeModel === type ? 'primary' : 'default'}
//                         onClick={() => handleModelSwitch(type)}
//                         style={{
//                           borderRadius: '6px',
//                           textTransform: 'capitalize',
//                           background: activeModel === type ? theme.primary : 'white',
//                           borderColor: activeModel === type ? theme.primary : theme.borderColor,
//                           color: activeModel === type ? 'white' : theme.textPrimary
//                         }}
//                       >
//                         {type}
//                       </Button>
//                     ))}
//                   </div>

//                   <div style={{
//                     position: 'absolute',
//                     bottom: '20px',
//                     left: '20px'
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
//                         boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
//                       }}
//                     >
//                       ISO
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
//                     <div style={{ textAlign: 'center' }}>
//                       <div style={{
//                         border: `4px solid ${theme.primary}33`,
//                         borderTop: `4px solid ${theme.primary}`,
//                         borderRadius: '50%',
//                         width: '48px',
//                         height: '48px',
//                         animation: 'spin 1s linear infinite',
//                         margin: '0 auto 20px'
//                       }} />
//                       <Text style={{ color: theme.primary, fontSize: '16px', fontWeight: '500' }}>
//                         {loadingMessage}
//                       </Text>
//                       {loadingProgress > 0 && (
//                         <div style={{ marginTop: '16px', width: '200px', margin: '16px auto 0' }}>
//                           <Progress percent={loadingProgress} status="active" />
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
//                     background: 'rgba(255, 255, 255, 0.95)'
//                   }}>
//                     <div style={{ textAlign: 'center' }}>
//                       <div style={{
//                         width: '48px',
//                         height: '48px',
//                         background: '#f5222d',
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
//                       <Text style={{ color: '#f5222d', fontSize: '16px', fontWeight: '500' }}>
//                         {loadingMessage}
//                       </Text>
//                     </div>
//                   </div>
//                 )}
//               </Card>
//             </Col>

//             <Col xs={24} lg={12} style={{ height: '100%' }}>
//                      <Card
//     title={
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
//         <span style={{ color: theme.primary, fontSize: '16px', fontWeight: 600 }}>
//           Analysis & Cost Data
//         </span>
//         <Button
//           type="primary"
//           icon={<DownloadOutlined />}
//           onClick={showPdfPreview}
//           style={{
//             background: theme.primary,
//             borderColor: theme.primary,
//             color: '#fff',
//             fontWeight: 'bold',
//             borderRadius: '6px'
//           }}
//         >
//           Download PDF Report
//         </Button>
//       </div>
//     }
//     style={{
//       height: '100%',
//       boxShadow: theme.shadow,
//       borderRadius: '8px',
//       background: theme.cardBg,
//       border: `1px solid ${theme.borderColor}`,
//       overflow: 'hidden'
//     }}
//     bodyStyle={{
//       padding: '1px',
//       height: 'calc(100% - 50px)',
//       overflow: 'auto'
//     }}
//   >

//                 {calculationData ? (
//                   <div style={{ padding: '10px' }}>
//                     <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: `1px solid ${theme.borderColor}` }}>
//                       <Text style={{ fontSize: '12px', color: theme.textSecondary, fontWeight: '500' }}>
//                         MATERIAL
//                       </Text>
//                       <Title level={4} style={{ margin: '8px 0 0' }}>
//                         {calculationData.material?.name}
//                       </Title>
//                       <Text style={{ fontSize: '12px', color: theme.textSecondary }}>
//                         Density: {calculationData.material?.density} kg/m³
//                       </Text>
//                       <br />
//                       <Text style={{ fontSize: '12px', color: theme.textSecondary }}>
//                         Cost: ₹{calculationData.material?.cost}/kg
//                       </Text>
//                     </div>

//                     <Row gutter={16} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: `1px solid ${theme.borderColor}` }}>
//                       <Col span={12}>
//                         <Text style={{ fontSize: '12px', color: theme.textSecondary, fontWeight: '500', display: 'block', marginBottom: '8px' }}>
//                           MACHINE TYPE
//                         </Text>
//                         <Select
//                           placeholder="Select machine type"
//                           style={{ width: '100%' }}
//                           onChange={handleMachineChange}
//                           value={selectedMachine}
//                           loading={isUpdatingCost}
//                         >
//                           {machineRates.map((rate) => (
//                             <Option 
//                               key={`${rate.machine_type}-${rate.size}`} 
//                               value={`${rate.machine_type}-${rate.size}`}
//                             >
//                               {rate.machine_type} - {rate.size} (₹{rate.hourly_rate}/hr)
//                             </Option>
//                           ))}
//                         </Select>
//                       </Col>

//                       <Col span={12}>
//                         <Text style={{ fontSize: '12px', color: theme.textSecondary, fontWeight: '500', display: 'block', marginBottom: '8px' }}>
//                           QUANTITY
//                         </Text>
//                         <div style={{ display: 'flex', gap: '8px' }}>
//                           <Input
//                             type="number"
//                             min={1}
//                             value={quantity}
//                             onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
//                             style={{ flex: 1 }}
//                             placeholder="Enter quantity"
//                           />
//                           <Button
//                             type="primary"
//                             loading={isUpdatingQuantity}
//                             onClick={handleQuantityUpdate}
//                             style={{
//                               background: theme.primary,
//                               borderColor: theme.primary
//                             }}
//                           >
//                             Update
//                           </Button>
//                         </div>
//                       </Col>
//                     </Row>

//                     <Tabs defaultActiveKey="female">
//                       <Tabs.TabPane tab="Female Tool" key="female">
//                         {renderToolDetails(calculationData.classification?.female_tool, 'female')}
//                       </Tabs.TabPane>

//                       <Tabs.TabPane tab="Male Tool" key="male">
//                         {renderToolDetails(calculationData.classification?.male_tool, 'male')}
//                       </Tabs.TabPane>

//                       <Tabs.TabPane tab="Part" key="part">
//                         <div style={{ fontSize: '12px' }}>
//                           <div style={{ marginBottom: '12px' }}>
//                             <Text strong style={{ fontSize: '13px' }}>Filename:</Text> 
//                             <Text style={{ fontSize: '13px' }}> {calculationData.classification?.part?.filename}</Text>
//                           </div>

//                           <div style={{ 
//                             marginTop: '25px', 
//                             padding: '12px', 
//                             background: '#e6f7ff66',
//                             border: `1px solid ${theme.primary}22`,
//                             borderRadius: '6px'
//                           }}>
//                             <Text strong style={{ display: 'block', marginBottom: '8px', color: '#0050b3', fontSize: '13px' }}>
//                               ACTUAL DIMENSIONS
//                             </Text>

//                             <Row gutter={8} style={{ marginBottom: '8px' }}>
//                               <Col span={8}>
//                                 <Text style={{ fontSize: '15px', display: 'block' }}>Length:</Text>
//                                 <Text strong style={{ fontSize: '14px' }}>{calculationData.classification?.part?.actual_dimensions?.length?.toFixed(2)} mm</Text>
//                               </Col>
//                               <Col span={8}>
//                                 <Text style={{ fontSize: '15px', display: 'block' }}>Breadth:</Text>
//                                 <Text strong style={{ fontSize: '14px' }}>{calculationData.classification?.part?.actual_dimensions?.breadth?.toFixed(2)} mm</Text>
//                               </Col>
//                               <Col span={8}>
//                                 <Text style={{ fontSize: '15px', display: 'block' }}>Height:</Text>
//                                 <Text strong style={{ fontSize: '14px' }}>{calculationData.classification?.part?.actual_dimensions?.height?.toFixed(2)} mm</Text>
//                               </Col>
//                             </Row>

//                             <Row gutter={8}>
//                               <Col span={12}>
//                                 <Text style={{ fontSize: '15px', display: 'block' }}>Volume:</Text>
//                                 <Text strong style={{ fontSize: '14px' }}>{calculationData.classification?.part?.actual_dimensions?.volume_mm3?.toLocaleString()} mm³</Text>
//                               </Col>
//                               {calculationData.classification?.part?.actual_dimensions?.volume_m3 && (
//                                 <Col span={12}>
//                                   <Text style={{ fontSize: '15px', display: 'block' }}>Mass:</Text>
//                                   <Text strong style={{ fontSize: '14px' }}>{(calculationData.classification?.part?.actual_dimensions?.volume_m3 * (calculationData?.material?.density || 0))?.toFixed(4)} kg</Text>
//                                 </Col>
//                               )}
//                             </Row>
//                           </div>

//                           <Row gutter={8} style={{ marginTop: '25px' }}>
//                             <Col span={12}>
//                               <div style={{ 
//                                 padding: '10px', 
//                                 background: '#e6f7ff66',
//                                 border: `1px solid ${theme.primary}22`,
//                                 borderRadius: '6px'
//                               }}>
//                                 <Text strong style={{ fontSize: '15px', color: 'black' }}>Part Forming Cost:</Text>
//                                 <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>
//                                   ₹{calculationData.part_forming?.part_forming_cost?.toFixed(2)}
//                                 </div>
//                               </div>
//                             </Col>
//                             <Col span={12}>
//                               <div style={{ 
//                                 padding: '10px',
//                                 background: '#e6f7ff66',
//                                 border: `1px solid ${theme.primary}22`,
//                                 borderRadius: '6px'
//                               }}>
//                                 <Text strong style={{ fontSize: '15px', color: 'black' }}>Part Forming Cost Per Unit:</Text>
//                                 <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>
//                                   ₹{calculationData.part_forming?.part_forming_cost_per_unit?.toFixed(2)}
//                                 </div>
//                               </div>
//                             </Col>
//                           </Row>
//                         </div>
//                       </Tabs.TabPane>

//                       <Tabs.TabPane tab="Cost Breakdown" key="costs">
//                         <div style={{ fontSize: '12px' }}>
//                           <div style={{ 
//                             marginBottom: '12px',
//                             padding: '12px', 
//                             background: '#e6f7ff66',
//                             border: `1px solid ${theme.primary}22`,
//                             borderRadius: '6px'
//                           }}>
//                             <Text strong style={{ fontSize: '15px', color: 'black' }}>Total Design Cost:</Text>
//                             <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>
//                               ₹{calculationData.tool_design?.total_design_cost?.toFixed(2)}
//                             </div>
//                           </div>

//                           <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: `1px solid ${theme.borderColor}` }}>
//                             <Text strong style={{ display: 'block', marginBottom: '8px', color: theme.primary }}>
//                               FEMALE TOOL
//                             </Text>
//                             <Row gutter={8} style={{ marginBottom: '8px' }}>
//                               <Col span={12}>
//                                 <div style={{ 
//                                   padding: '10px', 
//                                   background: '#e6f7ff66',
//                                   border: `1px solid ${theme.primary}22`,
//                                   borderRadius: '6px'
//                                 }}>
//                                   <Text strong style={{ fontSize: '15px', color: 'black' }}>Material Cost:</Text>
//                                   <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>
//                                     ₹{(
//                                       (stockDimensions.female_stock_length * stockDimensions.female_stock_breadth * stockDimensions.female_stock_height * 
//                                       0.000000001) * 
//                                       (calculationData?.material?.density || 0) *
//                                       (calculationData?.material?.cost || 0)
//                                     )?.toFixed(2)}
//                                   </div>
//                                 </div>
//                               </Col>
//                               <Col span={12}>
//                                 <div style={{ 
//                                   padding: '10px', 
//                                   background: '#e6f7ff66',
//                                   border: `1px solid ${theme.primary}22`,
//                                   borderRadius: '6px'
//                                 }}>
//                                   <Text strong style={{ fontSize: '15px', color: 'black' }}>Manufacturing Cost:</Text>
//                                   <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>
//                                     ₹{calculationData.classification?.female_tool?.manufacturing_cost?.toFixed(2)}
//                                   </div>
//                                 </div>
//                               </Col>
//                             </Row>
//                           </div>

//                           <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: `1px solid ${theme.borderColor}` }}>
//                             <Text strong style={{ display: 'block', marginBottom: '8px', color: theme.primary }}>
//                               MALE TOOL
//                             </Text>
//                             <Row gutter={8} style={{ marginBottom: '8px' }}>
//                               <Col span={12}>
//                                 <div style={{ 
//                                   padding: '10px', 
//                                   background: '#e6f7ff66',
//                                   border: `1px solid ${theme.primary}22`,
//                                   borderRadius: '6px'
//                                 }}>
//                                   <Text strong style={{ fontSize: '15px', color: 'black' }}>Material Cost:</Text>
//                                   <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>
//                                     ₹{(
//                                       (stockDimensions.male_stock_length * stockDimensions.male_stock_breadth * stockDimensions.male_stock_height * 
//                                       0.000000001) * 
//                                       (calculationData?.material?.density || 0) *
//                                       (calculationData?.material?.cost || 0)
//                                     )?.toFixed(2)}
//                                   </div>
//                                 </div>
//                               </Col>
//                               <Col span={12}>
//                                 <div style={{ 
//                                   padding: '10px', 
//                                   background: '#e6f7ff66',
//                                   border: `1px solid ${theme.primary}22`,
//                                   borderRadius: '6px'
//                                 }}>
//                                   <Text strong style={{ fontSize: '15px', color: 'black' }}>Manufacturing Cost:</Text>
//                                   <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>
//                                     ₹{calculationData.classification?.male_tool?.manufacturing_cost?.toFixed(2)}
//                                   </div>
//                                 </div>
//                               </Col>
//                             </Row>
//                           </div>

//                           <div style={{ marginBottom: '12px' }}>
//                             <Row gutter={8}>
//                               <Col span={12}>
//                                 <div style={{ 
//                                   padding: '10px', 
//                                   background: '#e6f7ff66',
//                                   border: `1px solid ${theme.primary}22`,
//                                   borderRadius: '6px'
//                                 }}>
//                                   <Text strong style={{ fontSize: '15px', color: 'black' }}>Part Forming Cost:</Text>
//                                   <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>
//                                     ₹{calculationData.part_forming?.part_forming_cost?.toFixed(2)}
//                                   </div>
//                                 </div>
//                               </Col>
//                               <Col span={12}>
//                                 <div style={{ 
//                                   padding: '10px', 
//                                   background: '#e6f7ff66',
//                                   border: `1px solid ${theme.primary}22`,
//                                   borderRadius: '6px'
//                                 }}>
//                                   <Text strong style={{ fontSize: '15px', color: 'black' }}>Part Forming Cost Per Unit:</Text>
//                                   <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>
//                                     ₹{calculationData.part_forming?.part_forming_cost_per_unit?.toFixed(2)}
//                                   </div>
//                                 </div>
//                               </Col>
//                             </Row>
//                           </div>

//                           <div style={{ 
//                             marginTop: '16px', 
//                             paddingTop: '12px', 
//                             borderTop: `2px solid ${theme.primary}`
//                           }}>
//                             <Row gutter={8}>
//                               <Col span={12}>
//                                 <div style={{ 
//                                   padding: '12px', 
//                                   background: theme.primary,
//                                   borderRadius: '6px'
//                                 }}>
//                                   <Text strong style={{ fontSize: '15px', color: 'white' }}>Total Cost:</Text>
//                                   <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginTop: '4px' }}>
//                                     ₹{calculationData.total_cost?.toFixed(2)}
//                                   </div>
//                                 </div>
//                               </Col>
//                               <Col span={12}>
//                                 <div style={{ 
//                                   padding: '12px', 
//                                   background: theme.primary,
//                                   borderRadius: '6px'
//                                 }}>
//                                   <Text strong style={{ fontSize: '15px', color: 'white' }}>Total Cost Per Unit:</Text>
//                                   <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginTop: '4px' }}>
//                                     ₹{calculationData.total_cost_per_unit?.toFixed(2)}
//                                   </div>
//                                 </div>
//                               </Col>
//                             </Row>
//                           </div>
//                         </div>
//                       </Tabs.TabPane>
//                     </Tabs>
//                   </div>
//                 ) : (
//                   <div style={{ padding: '16px', textAlign: 'center', color: theme.textSecondary }}>
//                     No calculation data available
//                   </div>
//                 )}
//               </Card>
//             </Col>
//           </Row>
//         </div>
//       </Content>

//       {/* PDF Preview Modal */}
//       <Modal
//         title="PDF Preview - Cost Estimation Report"
//         open={isPdfModalVisible}
//         onCancel={handlePdfCancel}
//         footer={[
//           <Button key="cancel" onClick={handlePdfCancel}>
//             Cancel
//           </Button>,
//           <Button key="download" type="primary" onClick={handlePdfDownload}>
//             Download PDF
//           </Button>,
//         ]}
//         width="90%"
//         style={{ top: 20 }}
//         bodyStyle={{ height: 'calc(100vh - 200px)', overflow: 'auto' }}
//       >
//         <div style={{ 
//           padding: '20px', 
//           background: 'white',
//           border: '1px solid #d9d9d9',
//           borderRadius: '6px'
//         }}>
//           <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #246679', paddingBottom: '20px' }}>
//             <h1 style={{ color: '#246679', marginBottom: '10px' }}>COST ESTIMATION REPORT</h1>
//             <h3 style={{ color: '#666' }}>Sheet Metal Module</h3>
//             <p style={{ color: '#999' }}>Generated: {new Date().toLocaleDateString()}, {new Date().toLocaleTimeString()}</p>
//             <p style={{ color: '#999' }}>Filename: {calculationData?.classification?.part?.filename || 'Sheet Metal Part'}</p>
//           </div>

//           <div style={{ marginBottom: '25px' }}>
//             <h3 style={{ background: '#246679', color: 'white', padding: '8px 12px', borderRadius: '4px' }}>MODEL VIEW</h3>
//             <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9fa', borderRadius: '6px', marginTop: '15px' }}>
//               <p><strong>3D Model Display</strong></p>
//               <p><em>Active Model: {activeModel.toUpperCase()}</em></p>
//               <div style={{ 
//                 width: '100%', 
//                 height: '200px', 
//                 background: 'linear-gradient(135deg, #e6f7ff 0%, #f0f2f5 100%)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 borderRadius: '6px',
//                 border: '1px dashed #246679'
//               }}>
//                 <span style={{ color: '#246679', fontSize: '16px' }}>3D Model Visualization</span>
//               </div>
//             </div>
//           </div>

//           <Row gutter={[16, 16]} style={{ marginBottom: '25px' }}>
//             <Col span={8}>
//               <div style={{ padding: '15px', background: '#e6f7ff', borderRadius: '6px', height: '100%' }}>
//                 <h4 style={{ color: '#0050b3', marginBottom: '15px' }}>Female Tool Data</h4>
//                 <p><strong>Filename:</strong> {calculationData?.classification?.female_tool?.filename || 'N/A'}</p>
//                 <p><strong>Dimensions:</strong> {calculationData?.classification?.female_tool?.actual_dimensions?.length?.toFixed(2) || '0'} × {calculationData?.classification?.female_tool?.actual_dimensions?.breadth?.toFixed(2) || '0'} × {calculationData?.classification?.female_tool?.actual_dimensions?.height?.toFixed(2) || '0'} mm</p>
//                 <p><strong>Volume:</strong> {calculationData?.classification?.female_tool?.actual_dimensions?.volume_mm3?.toLocaleString() || '0'} mm³</p>
//               </div>
//             </Col>
//             <Col span={8}>
//               <div style={{ padding: '15px', background: '#f6ffed', borderRadius: '6px', height: '100%' }}>
//                 <h4 style={{ color: '#22c55e', marginBottom: '15px' }}>Male Tool Data</h4>
//                 <p><strong>Filename:</strong> {calculationData?.classification?.male_tool?.filename || 'N/A'}</p>
//                 <p><strong>Dimensions:</strong> {calculationData?.classification?.male_tool?.actual_dimensions?.length?.toFixed(2) || '0'} × {calculationData?.classification?.male_tool?.actual_dimensions?.breadth?.toFixed(2) || '0'} × {calculationData?.classification?.male_tool?.actual_dimensions?.height?.toFixed(2) || '0'} mm</p>
//                 <p><strong>Volume:</strong> {calculationData?.classification?.male_tool?.actual_dimensions?.volume_mm3?.toLocaleString() || '0'} mm³</p>
//               </div>
//             </Col>
//             <Col span={8}>
//               <div style={{ padding: '15px', background: '#fff2e6', borderRadius: '6px', height: '100%' }}>
//                 <h4 style={{ color: '#fa8c16', marginBottom: '15px' }}>Part Data</h4>
//                 <p><strong>Filename:</strong> {calculationData?.classification?.part?.filename || 'N/A'}</p>
//                 <p><strong>Dimensions:</strong> {calculationData?.classification?.part?.actual_dimensions?.length?.toFixed(2) || '0'} × {calculationData?.classification?.part?.actual_dimensions?.breadth?.toFixed(2) || '0'} × {calculationData?.classification?.part?.actual_dimensions?.height?.toFixed(2) || '0'} mm</p>
//                 <p><strong>Volume:</strong> {calculationData?.classification?.part?.actual_dimensions?.volume_mm3?.toLocaleString() || '0'} mm³</p>
//               </div>
//             </Col>
//           </Row>

//           <div style={{ marginBottom: '25px' }}>
//             <h3 style={{ background: '#246679', color: 'white', padding: '8px 12px', borderRadius: '4px' }}>COST SUMMARY</h3>
//             <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '6px', marginTop: '15px' }}>
//               <Row gutter={[16, 16]}>
//                 <Col span={12}>
//                   <div style={{ marginBottom: '15px' }}>
//                     <h4 style={{ color: '#0050b3' }}>Female Tool Cost</h4>
//                     <p>Material Cost: ₹{(
//                       (stockDimensions.female_stock_length * stockDimensions.female_stock_breadth * stockDimensions.female_stock_height * 
//                       0.000000001) * 
//                       (calculationData?.material?.density || 0) *
//                       (calculationData?.material?.cost || 0)
//                     )?.toFixed(2)}</p>
//                     <p>Manufacturing Cost: ₹{calculationData?.classification?.female_tool?.manufacturing_cost?.toFixed(2) || '0.00'}</p>
//                   </div>
//                 </Col>
//                 <Col span={12}>
//                   <div style={{ marginBottom: '15px' }}>
//                     <h4 style={{ color: '#22c55e' }}>Male Tool Cost</h4>
//                     <p>Material Cost: ₹{(
//                       (stockDimensions.male_stock_length * stockDimensions.male_stock_breadth * stockDimensions.male_stock_height * 
//                       0.000000001) * 
//                       (calculationData?.material?.density || 0) *
//                       (calculationData?.material?.cost || 0)
//                     )?.toFixed(2)}</p>
//                     <p>Manufacturing Cost: ₹{calculationData?.classification?.male_tool?.manufacturing_cost?.toFixed(2) || '0.00'}</p>
//                   </div>
//                 </Col>
//               </Row>

//               <div style={{ background: '#246679', color: 'white', padding: '15px', borderRadius: '6px', marginTop: '15px' }}>
//                 <Row gutter={16}>
//                   <Col span={12}>
//                     <h4 style={{ margin: 0 }}>Total Cost</h4>
//                     <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px 0 0 0' }}>₹{calculationData?.total_cost?.toFixed(2) || '0.00'}</p>
//                   </Col>
//                   <Col span={12}>
//                     <h4 style={{ margin: 0 }}>Cost Per Unit</h4>
//                     <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px 0 0 0' }}>₹{calculationData?.total_cost_per_unit?.toFixed(2) || '0.00'}</p>
//                   </Col>
//                 </Row>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Modal>

//       <style jsx global>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </Layout>
//   );
// }

// export default SheetMetalViewerPage;





//''''this is correct working code december/24/2025'''''''''''''//
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useParams, useLocation, useNavigate } from 'react-router-dom';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { Layout, Card, Typography, Row, Col, Button, Progress, message } from 'antd';
// import { ArrowLeftOutlined, ExpandOutlined } from '@ant-design/icons';
// import AnalysisCostData from './SheetMetalCostReport';

// const { Content } = Layout;
// const { Title, Text } = Typography;

// const theme = {
//   primary: '#246679',
//   secondary: '#73b6ca',
//   background: '#f0f2f5',
//   cardBg: '#ffffff',
//   textPrimary: '#000000',
//   textSecondary: '#666666',
//   borderColor: '#d9d9d9',
//   shadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
//   modelBg: '#f8f9fa',
//   cubeColors: {
//     front: '#B0B0B0',
//     back: '#888888',
//     top: '#D3D3D3',
//     bottom: '#6E6E6E',
//     left: '#A9A9A9',
//     right: '#505050'
//   }
// };

// function SheetMetalViewerPage() {
//   const { id } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const canvasRef = useRef(null);
//   const cubeCanvasRef = useRef(null);
//   const controlsRef = useRef(null);
//   const cameraRef = useRef(null);
//   const sceneRef = useRef(null);
//   const modelRef = useRef(null);
//   const rendererRef = useRef(null);
//   const loadingAbortControllerRef = useRef(null);

//   const [isModelLoaded, setIsModelLoaded] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const [loadingMessage, setLoadingMessage] = useState('Loading 3D model...');
//   const [loadingProgress, setLoadingProgress] = useState(0);
//   const [activeModel, setActiveModel] = useState('male');
//   const [machineRates, setMachineRates] = useState([]);
//   const [selectedMachine, setSelectedMachine] = useState(null);
//   const [isUpdatingCost, setIsUpdatingCost] = useState(false);
//   const [cubeRotation, setCubeRotation] = useState({ x: 0, y: 0 });
//   const [updatedCalculationData, setUpdatedCalculationData] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [isUpdatingDimensions, setIsUpdatingDimensions] = useState(false);
//   const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
//   const [stockDimensions, setStockDimensions] = useState({
//     female_stock_length: 0,
//     female_stock_breadth: 0,
//     female_stock_height: 0,
//     male_stock_length: 0,
//     male_stock_breadth: 0,
//     male_stock_height: 0
//   });

//   const ANALYZE_API_URL = 'http://localhost:5678';

//   const { analysisData, calculationData: initialCalculationData, conversionData, historyId } = location.state || {};
//   const actualHistoryId = historyId || location.state?.historyId;

//   const calculationData = updatedCalculationData || initialCalculationData;

//   // Initialize stock dimensions from calculation data
//   useEffect(() => {
//     if (calculationData?.classification) {
//       setStockDimensions({
//         female_stock_length: calculationData.classification.female_tool?.stock_dimensions?.stock_length || 0,
//         female_stock_breadth: calculationData.classification.female_tool?.stock_dimensions?.stock_breadth || 0,
//         female_stock_height: calculationData.classification.female_tool?.stock_dimensions?.stock_height || 0,
//         male_stock_length: calculationData.classification.male_tool?.stock_dimensions?.stock_length || 0,
//         male_stock_breadth: calculationData.classification.male_tool?.stock_dimensions?.stock_breadth || 0,
//         male_stock_height: calculationData.classification.male_tool?.stock_dimensions?.stock_height || 0
//       });
//     }
//   }, [calculationData]);

//   useEffect(() => {
//     if (calculationData?.quantity) {
//       setQuantity(calculationData.quantity);
//     }
//   }, [calculationData]);

//   useEffect(() => {
//   const fetchMachineRates = async () => {
//     try {
//       const response = await fetch(`${ANALYZE_API_URL}/sheetmetal-machine-hour-rates`);
//       const data = await response.json();

//       if (data.success && Array.isArray(data.data)) {
//         setMachineRates(data.data);

//         if (calculationData?.classification?.female_tool?.mhr_machine_type && 
//             calculationData?.classification?.female_tool?.mhr_machine_size) {
//           const machineType = calculationData.classification.female_tool.mhr_machine_type.trim();
//           const machineSize = calculationData.classification.female_tool.mhr_machine_size.trim();
//           const initialMachine = `${machineType}-${machineSize}`;
//           console.log('Setting initial machine:', initialMachine);
//           setSelectedMachine(initialMachine);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching machine rates:', error);
//       message.error('Failed to load machine rates');
//     }
//   };

//   fetchMachineRates();
// }, [calculationData]);

//   const captureIsometricView = () => {
//     return new Promise((resolve) => {
//       try {
//         let callbackExecuted = false;

//         const handleIsometricCapture = (event) => {
//           if (!callbackExecuted) {
//             callbackExecuted = true;
//             const dataUrl = event.detail;
//             window.removeEventListener('sheetmetalIsometricCaptureComplete', handleIsometricCapture);
//             console.log('Sheet Metal isometric capture received successfully');
//             resolve(dataUrl);
//           }
//         };

//         window.addEventListener('sheetmetalIsometricCaptureComplete', handleIsometricCapture);

//         const captureEvent = new CustomEvent('requestSheetmetalIsometricCapture', {
//           detail: { timestamp: Date.now() }
//         });

//         window.dispatchEvent(captureEvent);
//         console.log('Sheet Metal isometric capture request sent');

//         const timeoutId = setTimeout(() => {
//           if (!callbackExecuted) {
//             callbackExecuted = true;
//             window.removeEventListener('sheetmetalIsometricCaptureComplete', handleIsometricCapture);
//             console.warn('Sheet Metal isometric capture timeout after 5 seconds, returning null');
//             resolve(null);
//           }
//         }, 5000);

//         return () => clearTimeout(timeoutId);

//       } catch (error) {
//         console.error('Error in captureIsometricView:', error);
//         resolve(null);
//       }
//     });
//   };

//   useEffect(() => {
//     const handleRequestSheetmetalIsometricCapture = async (event) => {
//       try {
//         console.log('SheetMetalViewerPage received isometric capture request');

//         if (!cameraRef.current || !controlsRef.current || !canvasRef.current) {
//           console.error('Required THREE.js references not available');
//           window.dispatchEvent(new CustomEvent('sheetmetalIsometricCaptureComplete', {
//             detail: null
//           }));
//           return;
//         }

//         const camera = cameraRef.current;
//         const controls = controlsRef.current;
//         const canvas = canvasRef.current;

//         const originalPosition = camera.position.clone();
//         const originalUp = camera.up.clone();
//         const originalTarget = controls.target.clone();
//         const originalZoom = camera.zoom;

//         console.log('Original camera state saved');

//         try {
//           const distance = originalPosition.distanceTo(originalTarget);
//           const isometricDistance = distance * 0.866;
//           const isoX = isometricDistance / Math.sqrt(3);
//           const isoY = isometricDistance / Math.sqrt(3);
//           const isoZ = isometricDistance / Math.sqrt(3);

//           const isoPosition = new THREE.Vector3(isoX, isoY, isoZ).add(originalTarget);

//           console.log('Setting isometric view position for sheet metal model:', isoPosition);

//           camera.position.copy(isoPosition);
//           camera.up.set(0, 1, 0);
//           camera.lookAt(originalTarget);
//           controls.update();

//           console.log('Isometric view applied');

//           await new Promise(resolve => {
//             let frameCount = 0;
//             const maxFrames = 3;

//             const waitForRender = () => {
//               frameCount++;
//               if (frameCount >= maxFrames) {
//                 resolve();
//               } else {
//                 requestAnimationFrame(waitForRender);
//               }
//             };

//             requestAnimationFrame(waitForRender);
//           });

//           console.log('Render frames completed, capturing canvas');

//           const tempCanvas = document.createElement('canvas');
//           tempCanvas.width = canvas.width;
//           tempCanvas.height = canvas.height;

//           const tempCtx = tempCanvas.getContext('2d', {
//             willReadFrequently: true,
//             alpha: true
//           });

//           if (!tempCtx) {
//             throw new Error('Could not get 2D context from temporary canvas');
//           }

//           tempCtx.drawImage(canvas, 0, 0);

//           const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
//           if (gl) {
//             gl.finish();
//           }

//           const dataUrl = tempCanvas.toDataURL('image/png', 1.0);

//           if (!dataUrl || dataUrl.length < 100) {
//             console.warn('Canvas capture produced invalid or empty image');
//             throw new Error('Canvas capture invalid');
//           }

//           console.log('Sheet Metal isometric view captured successfully, size:', (dataUrl.length / 1024).toFixed(2), 'KB');

//           window.dispatchEvent(new CustomEvent('sheetmetalIsometricCaptureComplete', {
//             detail: dataUrl
//           }));

//         } catch (captureError) {
//           console.error('Error during sheet metal isometric capture:', captureError);
//           window.dispatchEvent(new CustomEvent('sheetmetalIsometricCaptureComplete', {
//             detail: null
//           }));

//         } finally {
//           console.log('Restoring original camera state');

//           camera.position.copy(originalPosition);
//           camera.up.copy(originalUp);
//           camera.zoom = originalZoom;
//           camera.updateProjectionMatrix();

//           controls.target.copy(originalTarget);
//           controls.update();

//           console.log('Original camera state restored');
//         }

//       } catch (error) {
//         console.error('Fatal error in sheet metal isometric capture handler:', error);
//         window.dispatchEvent(new CustomEvent('sheetmetalIsometricCaptureComplete', {
//           detail: null
//         }));
//       }
//     };

//     window.addEventListener('requestSheetmetalIsometricCapture', handleRequestSheetmetalIsometricCapture);
//     console.log('Sheet Metal isometric capture handler registered');

//     return () => {
//       window.removeEventListener('requestSheetmetalIsometricCapture', handleRequestSheetmetalIsometricCapture);
//       console.log('Sheet Metal isometric capture handler removed');
//     };

//   }, []);

//   const handleQuantityUpdate = async () => {
//     if (!actualHistoryId) {
//       message.error('No history ID available');
//       return;
//     }

//     setIsUpdatingQuantity(true);

//     try {
//       const formData = new URLSearchParams();
//       formData.append('history_id', actualHistoryId);
//       formData.append('new_quantity', quantity);

//       const response = await fetch(`${ANALYZE_API_URL}/update-quantity-cost/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           'accept': 'application/json'
//         },
//         body: formData
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || errorData.message || 'Failed to update quantity');
//       }

//       const result = await response.json();

//       console.log('Quantity Update Response:', result);

//       const updatedData = {
//         ...calculationData,
//         quantity: result.new_quantity,
//         total_cost: result.updated_values?.total_cost,
//         total_cost_per_unit: result.updated_values?.total_cost_per_unit,
//         material: {
//           name: result.material?.name,
//           density: result.material?.density,
//           cost: result.material?.cost_per_kg,
//           id: result.material?.id
//         },
//         tool_design: {
//           total_design_cost: result.updated_values?.total_design_cost
//         },
//         part_forming: {
//           part_forming_cost: result.updated_values?.part_forming_cost,
//           part_forming_cost_per_unit: result.updated_values?.part_forming_cost_per_unit
//         },
//         classification: {
//           female_tool: {
//             ...calculationData.classification?.female_tool,
//             filename: result.Actual_dimensions?.female_tool?.filename || calculationData.classification?.female_tool?.filename,
//             actual_dimensions: {
//               length: result.Actual_dimensions?.female_tool?.length || calculationData.classification?.female_tool?.actual_dimensions?.length || 0,
//               breadth: result.Actual_dimensions?.female_tool?.breadth || calculationData.classification?.female_tool?.actual_dimensions?.breadth || 0,
//               height: result.Actual_dimensions?.female_tool?.height || calculationData.classification?.female_tool?.actual_dimensions?.height || 0,
//               volume_mm3: result.Actual_dimensions?.female_tool?.volume_mm3 || calculationData.classification?.female_tool?.actual_dimensions?.volume_mm3 || 0,
//               volume_m3: result.Actual_dimensions?.female_tool?.volume_m3 || calculationData.classification?.female_tool?.actual_dimensions?.volume_m3 || 0
//             },
//             stock_dimensions: result.Stock_and_cost?.female?.stock_dimensions || calculationData.classification?.female_tool?.stock_dimensions,
//             manufacturing_cost: result.Stock_and_cost?.female?.manufacturing_cost || calculationData.classification?.female_tool?.manufacturing_cost,
//             volume_removed_m3: calculationData.classification?.female_tool?.volume_removed_m3,
//             mhr: calculationData.classification?.female_tool?.mhr,
//             mhr_machine_type: calculationData.classification?.female_tool?.mhr_machine_type,
//             mhr_machine_size: calculationData.classification?.female_tool?.mhr_machine_size,
//             manufacturing_time_hr: calculationData.classification?.female_tool?.manufacturing_time_hr
//           },
//           male_tool: {
//             ...calculationData.classification?.male_tool,
//             filename: result.Actual_dimensions?.male_tool?.filename || calculationData.classification?.male_tool?.filename,
//             actual_dimensions: {
//               length: result.Actual_dimensions?.male_tool?.length || calculationData.classification?.male_tool?.actual_dimensions?.length || 0,
//               breadth: result.Actual_dimensions?.male_tool?.breadth || calculationData.classification?.male_tool?.actual_dimensions?.breadth || 0,
//               height: result.Actual_dimensions?.male_tool?.height || calculationData.classification?.male_tool?.actual_dimensions?.height || 0,
//               volume_mm3: result.Actual_dimensions?.male_tool?.volume_mm3 || calculationData.classification?.male_tool?.actual_dimensions?.volume_mm3 || 0,
//               volume_m3: result.Actual_dimensions?.male_tool?.volume_m3 || calculationData.classification?.male_tool?.actual_dimensions?.volume_m3 || 0
//             },
//             stock_dimensions: result.Stock_and_cost?.male?.stock_dimensions || calculationData.classification?.male_tool?.stock_dimensions,
//             manufacturing_cost: result.Stock_and_cost?.male?.manufacturing_cost || calculationData.classification?.male_tool?.manufacturing_cost,
//             volume_removed_m3: calculationData.classification?.male_tool?.volume_removed_m3,
//             mhr: calculationData.classification?.male_tool?.mhr,
//             mhr_machine_type: calculationData.classification?.male_tool?.mhr_machine_type,
//             mhr_machine_size: calculationData.classification?.male_tool?.mhr_machine_size,
//             manufacturing_time_hr: calculationData.classification?.male_tool?.manufacturing_time_hr
//           },
//           part: {
//             filename: result.Actual_dimensions?.part?.filename || calculationData.classification?.part?.filename,
//             actual_dimensions: {
//               length: result.Actual_dimensions?.part?.length || calculationData.classification?.part?.actual_dimensions?.length || 0,
//               breadth: result.Actual_dimensions?.part?.breadth || calculationData.classification?.part?.actual_dimensions?.breadth || 0,
//               height: result.Actual_dimensions?.part?.height || calculationData.classification?.part?.actual_dimensions?.height || 0,
//               volume_mm3: result.Actual_dimensions?.part?.volume_mm3 || calculationData.classification?.part?.actual_dimensions?.volume_mm3 || 0,
//               volume_m3: result.Actual_dimensions?.part?.volume_m3 || calculationData.classification?.part?.actual_dimensions?.volume_m3 || 0
//             }
//           }
//         }
//       };

//       setUpdatedCalculationData(updatedData);
//       message.success(`Quantity updated to ${result.new_quantity}! All costs recalculated.`);

//     } catch (error) {
//       console.error('Error updating quantity:', error);
//       message.error(`Failed to update quantity: ${error.message}`);
//     } finally {
//       setIsUpdatingQuantity(false);
//     }
//   };

//   const handleUpdateDimensions = async () => {
//     if (!actualHistoryId) {
//       message.error('No history ID available');
//       return;
//     }

//     setIsUpdatingDimensions(true);

//     try {
//       const formData = new URLSearchParams();
//       formData.append('history_id', actualHistoryId);
//       formData.append('female_stock_length', stockDimensions.female_stock_length);
//       formData.append('female_stock_breadth', stockDimensions.female_stock_breadth);
//       formData.append('female_stock_height', stockDimensions.female_stock_height);
//       formData.append('male_stock_length', stockDimensions.male_stock_length);
//       formData.append('male_stock_breadth', stockDimensions.male_stock_breadth);
//       formData.append('male_stock_height', stockDimensions.male_stock_height);

//       const response = await fetch(`${ANALYZE_API_URL}/recalculate-stock/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           'accept': 'application/json'
//         },
//         body: formData
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || errorData.message || 'Failed to update stock dimensions');
//       }

//       const result = await response.json();

//       console.log('API Response:', result);

//       const updatedData = {
//         ...calculationData,
//         ...result,
//         material: result.material || calculationData.material,
//         quantity: result.quantity || calculationData.quantity,
//         total_cost: result.total_cost,
//         total_cost_per_unit: result.total_cost_per_unit,
//         tool_design: result.tool_design || calculationData.tool_design,
//         part_forming: result.part_forming || calculationData.part_forming,
//         classification: {
//           female_tool: {
//             ...result.classification?.female_tool,
//             filename: result.classification?.female_tool?.filename || calculationData.classification?.female_tool?.filename,
//             actual_dimensions: {
//               length: result.actual_female_dimensions?.length || 0,
//               breadth: result.actual_female_dimensions?.breadth || 0,
//               height: result.actual_female_dimensions?.height || 0,
//               volume_mm3: result.actual_female_dimensions?.volume_mm3 || 0,
//               volume_m3: result.actual_female_dimensions?.volume_m3 || 0
//             },
//             stock_dimensions: result.classification?.female_tool?.stock_dimensions,
//             manufacturing_cost: result.classification?.female_tool?.manufacturing_cost,
//             volume_removed_m3: result.classification?.female_tool?.volume_removed_m3,
//             mhr: result.classification?.female_tool?.mhr,
//             mhr_machine_type: result.classification?.female_tool?.mhr_machine_type,
//             mhr_machine_size: result.classification?.female_tool?.mhr_machine_size,
//             manufacturing_time_hr: result.classification?.female_tool?.manufacturing_time_hr
//           },
//           male_tool: {
//             ...result.classification?.male_tool,
//             filename: result.classification?.male_tool?.filename || calculationData.classification?.male_tool?.filename,
//             actual_dimensions: {
//               length: result.actual_male_dimensions?.length || 0,
//               breadth: result.actual_male_dimensions?.breadth || 0,
//               height: result.actual_male_dimensions?.height || 0,
//               volume_mm3: result.actual_male_dimensions?.volume_mm3 || 0,
//               volume_m3: result.actual_male_dimensions?.volume_m3 || 0
//             },
//             stock_dimensions: result.classification?.male_tool?.stock_dimensions,
//             manufacturing_cost: result.classification?.male_tool?.manufacturing_cost,
//             volume_removed_m3: result.classification?.male_tool?.volume_removed_m3,
//             mhr: result.classification?.male_tool?.mhr,
//             mhr_machine_type: result.classification?.male_tool?.mhr_machine_type,
//             mhr_machine_size: result.classification?.male_tool?.mhr_machine_size,
//             manufacturing_time_hr: result.classification?.male_tool?.manufacturing_time_hr
//           },
//           part: {
//             filename: result.classification?.part?.filename || result.actual_part_dimensions?.filename || calculationData.classification?.part?.filename,
//             actual_dimensions: {
//               length: result.actual_part_dimensions?.length || 0,
//               breadth: result.actual_part_dimensions?.breadth || 0,
//               height: result.actual_part_dimensions?.height || 0,
//               volume_mm3: result.actual_part_dimensions?.volume_mm3 || 0,
//               volume_m3: result.actual_part_dimensions?.volume_m3 || 0
//             }
//           }
//         }
//       };

//       console.log('Updated Data:', updatedData);

//       setUpdatedCalculationData(updatedData);
//       message.success('Stock dimensions updated successfully!');

//     } catch (error) {
//       console.error('Error updating stock dimensions:', error);
//       message.error(`Failed to update stock dimensions: ${error.message}`);
//     } finally {
//       setIsUpdatingDimensions(false);
//     }
//   };


//   const handleMachineChange = async (value) => {
//   console.log('Machine changed to:', value);

//   const selectedRate = machineRates.find(rate => {
//     const rateKey = `${rate.machine_type.trim()}-${rate.size.trim()}`;
//     return rateKey === value;
//   });

//   if (!selectedRate || !actualHistoryId) {
//     console.log('Selected rate not found or no history ID');
//     return;
//   }

//   setSelectedMachine(value);
//   setIsUpdatingCost(true);

//   try {
//     const formData = new URLSearchParams();
//     formData.append('history_id', actualHistoryId);
//     formData.append('machine_type', selectedRate.machine_type);
//     formData.append('size', selectedRate.size);

//     console.log('Updating with:', {
//       machine_type: selectedRate.machine_type,
//       size: selectedRate.size
//     });

//     const response = await fetch(`${ANALYZE_API_URL}/update-manufacturing-cost/`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: formData
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.detail || 'Failed to update manufacturing cost');
//     }

//     const result = await response.json();

//     if (result.total_cost !== undefined) {
//       const updatedData = {
//         ...calculationData,
//         total_cost: result.total_cost,
//         classification: {
//           ...calculationData.classification,
//           female_tool: {
//             ...calculationData.classification?.female_tool,
//             manufacturing_cost: result.female_manufacturing_cost_per_unit,
//             mhr_machine_type: selectedRate.machine_type,
//             mhr_machine_size: selectedRate.size
//           },
//           male_tool: {
//             ...calculationData.classification?.male_tool,
//             manufacturing_cost: result.male_manufacturing_cost_per_unit
//           }
//         }
//       };

//       setUpdatedCalculationData(updatedData);
//       message.success(`Manufacturing cost updated! New Total: ₹${result.total_cost.toFixed(2)}`);
//     }

//   } catch (error) {
//     console.error('Error updating cost:', error);
//     message.error(`Failed to update manufacturing cost: ${error.message}`);
//     // Revert selection on error
//     if (calculationData?.classification?.female_tool?.mhr_machine_type && 
//         calculationData?.classification?.female_tool?.mhr_machine_size) {
//       const revertMachine = `${calculationData.classification.female_tool.mhr_machine_type}-${calculationData.classification.female_tool.mhr_machine_size}`;
//       setSelectedMachine(revertMachine);
//     }
//   } finally {
//     setIsUpdatingCost(false);
//   }
// };

//   const loadModelFromServer = useCallback(async (historyId, modelType = 'male') => {
//     if (!historyId || historyId === 'undefined' || historyId === 'null') {
//       setIsError(true);
//       setLoadingMessage('Invalid history ID. Please upload files again.');
//       message.error('No history ID found');
//       return;
//     }

//     if (loadingAbortControllerRef.current) {
//       loadingAbortControllerRef.current.abort();
//     }

//     setIsModelLoaded(false);
//     setIsError(false);
//     setLoadingProgress(0);
//     setLoadingMessage(`Loading ${modelType} model...`);

//     const abortController = new AbortController();
//     loadingAbortControllerRef.current = abortController;

//     try {
//       setLoadingProgress(20);

//       const url = `${ANALYZE_API_URL}/sheetmetal/all-draco-glb/${historyId}?download=${modelType}`;

//       const response = await fetch(url, {
//         signal: abortController.signal,
//         method: 'GET',
//         headers: {
//           'Accept': 'model/gltf-binary, application/octet-stream, */*',
//           'Cache-Control': 'no-cache'
//         }
//       });

//       const contentType = response.headers.get('content-type');

//       if (contentType && contentType.includes('text/html')) {
//         throw new Error('Backend returned HTML instead of GLB file.');
//       }

//       if (contentType && contentType.includes('application/json')) {
//         const jsonError = await response.json();
//         throw new Error(jsonError.detail || jsonError.error || 'Server returned an error');
//       }

//       if (!response.ok) {
//         throw new Error(`Server error: ${response.status}`);
//       }

//       setLoadingProgress(50);

//       const arrayBuffer = await response.arrayBuffer();

//       if (!arrayBuffer || arrayBuffer.byteLength === 0) {
//         throw new Error('Empty GLB model data received');
//       }

//       setLoadingProgress(75);

//       const dracoLoader = new DRACOLoader();
//       dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

//       const loader = new GLTFLoader();
//       loader.setDRACOLoader(dracoLoader);

//       return new Promise((resolve, reject) => {
//         const timeoutId = setTimeout(() => {
//           reject(new Error('Model loading timeout'));
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
//             setLoadingProgress(95);
//             resolve(gltf);
//           },
//           (error) => {
//             clearTimeout(timeoutId);
//             reject(new Error(`Failed to parse GLB: ${error.message}`));
//           }
//         );
//       });

//     } catch (error) {
//       if (abortController.signal.aborted) return;

//       console.error('Error loading model:', error);
//       setIsError(true);
//       setLoadingMessage(`Error: ${error.message}`);
//       message.error(`Failed to load model: ${error.message}`);
//     }
//   }, []);

//   const processAndAddModel = useCallback((gltfScene) => {
//     if (!sceneRef.current) return;

//     if (modelRef.current && sceneRef.current) {
//       sceneRef.current.remove(modelRef.current);
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
//       controlsRef.current.update();
//     }

//     if (cameraRef.current) {
//       const distance = 4 * 1.5;
//       cameraRef.current.position.set(distance, distance, distance);
//       cameraRef.current.lookAt(0, 0, 0);
//     }

//     gltfScene.traverse((child) => {
//       if (child instanceof THREE.Mesh) {
//         child.material = new THREE.MeshStandardMaterial({
//           color: new THREE.Color('#b0b0b0'),
//           roughness: 0.6,
//           metalness: 0.4
//         });
//       }
//     });

//     sceneRef.current.add(modelGroup);
//     setIsModelLoaded(true);
//     setLoadingProgress(100);
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

//     const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
//     const cube = new THREE.Mesh(cubeGeometry, materials);
//     scene.add(cube);

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
//     scene.add(ambientLight);

//     return { scene, camera, cube, renderer };
//   }, [createTextTexture]);

//   const moveCamera = useCallback((direction) => {
//     if (!controlsRef.current || !cameraRef.current) return;

//     const controls = controlsRef.current;
//     const camera = cameraRef.current;
//     const target = controls.target;

//     const offset = camera.position.clone().sub(target);
//     const angle = Math.PI / 12;

//     const spherical = new THREE.Spherical().setFromVector3(offset);

//     if (direction === 'up' || direction === 'down') {
//       const rotationAngle = direction === 'up' ? angle : -angle;
//       spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi + rotationAngle));
//     } else if (direction === 'left' || direction === 'right') {
//       const rotationAngle = direction === 'left' ? angle : -angle;
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

//   const handleFaceClick = useCallback((face) => {
//     if (!controlsRef.current || !cameraRef.current) return;

//     const cam = cameraRef.current;
//     const controls = controlsRef.current;
//     const distance = cam.position.distanceTo(controls.target);

//     let targetPosition = new THREE.Vector3();
//     let targetUp = new THREE.Vector3(0, 1, 0);

//     switch (face) {
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
//     if (!canvasRef.current) return;

//     let scene, camera, renderer, controls;
//     let cubeScene;
//     let frameId = null;

//     const init = () => {
//       scene = new THREE.Scene();
//       scene.background = new THREE.Color('#f8f9fa');
//       sceneRef.current = scene;

//       const width = canvasRef.current.clientWidth;
//       const height = canvasRef.current.clientHeight;

//       camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
//       camera.position.set(5, 5, 5);
//       cameraRef.current = camera;

//       renderer = new THREE.WebGLRenderer({ 
//         canvas: canvasRef.current,
//         antialias: true 
//       });
//       renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//       renderer.setSize(width, height);
//       renderer.shadowMap.enabled = true;
//       rendererRef.current = renderer;

//       controls = new OrbitControls(camera, renderer.domElement);
//       controls.enableDamping = true;
//       controls.dampingFactor = 0.05;
//       controls.enableZoom = true;
//       controls.zoomSpeed = 2.5;
//       controls.target.set(0, 0, 0);
//       controlsRef.current = controls;

//       const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
//       scene.add(ambientLight);

//       const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x888888, 0.7);
//       scene.add(hemisphereLight);

//       cubeScene = initCubeScene();

//       if (actualHistoryId) {
//         loadModelFromServer(actualHistoryId, activeModel).then((gltf) => {
//           if (gltf) {
//             processAndAddModel(gltf.scene);
//           }
//         });
//       } else {
//         setIsError(true);
//         setLoadingMessage('No history ID provided. Please upload files again.');
//         message.error('Missing history ID');
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
//         cancelAnimationFrame(frameId);
//         window.removeEventListener('resize', handleResize);
//         if (renderer) renderer.dispose();
//         if (cubeScene && cubeScene.renderer) cubeScene.renderer.dispose();
//       };
//     };

//     return init();
//   }, [actualHistoryId, activeModel, loadModelFromServer, processAndAddModel, cubeRotation, initCubeScene]);

//   const handleModelSwitch = async (modelType) => {
//     setActiveModel(modelType);
//     setIsModelLoaded(false);

//     if (!actualHistoryId) {
//       setIsError(true);
//       setLoadingMessage('No history ID available');
//       return;
//     }

//     try {
//       const gltf = await loadModelFromServer(actualHistoryId, modelType);
//       if (gltf) {
//         processAndAddModel(gltf.scene);
//       }
//     } catch (error) {
//       console.error('Error switching model:', error);
//       setIsError(true);
//     }
//   };

//   const handleFullscreen = () => {
//     const elem = document.documentElement;
//     if (!document.fullscreenElement) {
//       elem.requestFullscreen();
//     } else {
//       document.exitFullscreen();
//     }
//   };


//   //''''this below function to capture only part 3d display in the report'''''//

// //   const capturePartIsometricView = async () => {
// //   return new Promise(async (resolve) => {
// //     try {
// //       // Store current model
// //       const currentModel = activeModel;

// //       // Temporarily switch to part without updating UI state
// //       if (currentModel !== 'part') {
// //         const gltf = await loadModelFromServer(actualHistoryId, 'part');
// //         if (gltf) {
// //           processAndAddModel(gltf.scene);

// //           // Wait for render
// //           await new Promise(r => setTimeout(r, 500));
// //         }
// //       }

// //       // Capture isometric view
// //       const dataUrl = await captureIsometricView();

// //       // Restore original model if needed
// //       if (currentModel !== 'part') {
// //         const originalGltf = await loadModelFromServer(actualHistoryId, currentModel);
// //         if (originalGltf) {
// //           processAndAddModel(originalGltf.scene);
// //         }
// //       }

// //       resolve(dataUrl);
// //     } catch (error) {
// //       console.error('Error capturing part model:', error);
// //       resolve(null);
// //     }
// //   });
// // };
//   return (
//     <Layout style={{ minHeight: '100vh', background: theme.background }}>
//        <div style={{
//         height: '80px',
//         background: theme.primary,
//         padding: '0 40px',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         boxShadow: theme.shadow,
//         position: 'sticky',
//         top: 0,
//         zIndex: 1000,
//         position: 'relative'
//       }}>
//         <div style={{ position: 'absolute', left: '40px' }}>
//           <button
//             onClick={() => navigate('/home/sheet-metal/upload')}
//             style={{
//               padding: '8px 16px',
//               borderRadius: '8px',
//               border: 'none',
//               cursor: 'pointer',
//               color: theme.cardBg,
//               display: 'flex',
//               alignItems: 'center',
//               gap: '8px',
//               fontSize: '14px',
//               fontWeight: '500',
//               transition: 'all 0.3s ease',
//               background: 'transparent'
//             }}
//             onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
//             onMouseLeave={(e) => e.target.style.background = 'transparent'}
//           >
//             <ArrowLeftOutlined /> Back to Upload
//           </button>
//         </div>

//         <Title level={3} style={{ margin: 0, color: theme.cardBg, fontSize: '25px', fontWeight: '600' }}>
//           COST ESTIMATION SOFTWARE
//         </Title>
//       </div>
//       <Content style={{ padding: '30px 40px', height: 'calc(100vh - 140px)', overflow: 'auto' }}>
//         <div style={{ maxWidth: '100%', height: '100%' }}>
//           <Row gutter={[30, 30]} style={{ height: '100%' }}>
//             <Col xs={24} lg={12} style={{ height: '100%' }}>
//               <Card
//                 title="3D Model Viewer"
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
//                   position: 'relative',
//                   background: theme.modelBg
//                 }}
//                 extra={
//                   <Button
//                     icon={<ExpandOutlined />}
//                     onClick={handleFullscreen}
//                     size="small"
//                   />
//                 }
//               >
//                 <div style={{ position: 'relative', width: '100%', height: '100%' }}>
//                   <canvas
//                     ref={canvasRef}
//                     style={{ width: '100%', height: '100%', display: 'block' }}
//                   />

//                   <div style={{
//                     position: 'absolute',
//                     top: '10px',
//                     right: '10px',
//                     width: '240px',
//                     height: '240px',
//                     display: isModelLoaded ? 'block' : 'none'
//                   }}>
//                     <button onClick={() => moveCamera('up')} style={{
//                       position: 'absolute', left: '50%', top: '5px', transform: 'translateX(-50%)',
//                       background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
//                       border: '2px solid rgba(36, 102, 121, 0.3)', borderRadius: '50%',
//                       width: '36px', height: '36px', cursor: 'pointer',
//                       display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontSize: '16px',
//                       fontWeight: 'bold', color: '#246679', zIndex: 10
//                     }}>↑</button>

//                     <button onClick={() => moveCamera('left')} style={{
//                       position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
//                       background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
//                       border: '2px solid rgba(36, 102, 121, 0.3)', borderRadius: '50%',
//                       width: '36px', height: '36px', cursor: 'pointer',
//                       display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontSize: '16px',
//                       fontWeight: 'bold', color: '#246679', zIndex: 10
//                     }}>←</button>

//                     <div style={{
//                       position: 'absolute', left: '50%', top: '50%',
//                       transform: 'translate(-50%, -50%)', width: '150px', height: '150px',
//                       overflow: 'hidden', pointerEvents: 'none'
//                     }}>
//                       <canvas ref={cubeCanvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

//                       <div style={{
//                         position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
//                         display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
//                         gridTemplateRows: 'repeat(3, 1fr)', pointerEvents: 'auto'
//                       }}>
//                         <div onClick={() => handleFaceClick('top')} style={{ gridColumn: 2, gridRow: 1, cursor: 'pointer' }} />
//                         <div onClick={() => handleFaceClick('left')} style={{ gridColumn: 1, gridRow: 2, cursor: 'pointer' }} />
//                         <div onClick={() => handleFaceClick('front')} style={{ gridColumn: 2, gridRow: 2, cursor: 'pointer' }} />
//                         <div onClick={() => handleFaceClick('right')} style={{ gridColumn: 3, gridRow: 2, cursor: 'pointer' }} />
//                         <div onClick={() => handleFaceClick('bottom')} style={{ gridColumn: 2, gridRow: 3, cursor: 'pointer' }} />
//                       </div>
//                     </div>

//                     <button onClick={() => moveCamera('right')} style={{
//                       position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
//                       background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
//                       border: '2px solid rgba(36, 102, 121, 0.3)', borderRadius: '50%',
//                       width: '36px', height: '36px', cursor: 'pointer',
//                       display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontSize: '16px',
//                       fontWeight: 'bold', color: '#246679', zIndex: 10
//                     }}>→</button>

//                     <button onClick={() => moveCamera('down')} style={{
//                       position: 'absolute', left: '50%', bottom: '5px', transform: 'translateX(-50%)',
//                       background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
//                       border: '2px solid rgba(36, 102, 121, 0.3)', borderRadius: '50%',
//                       width: '36px', height: '36px', cursor: 'pointer',
//                       display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontSize: '16px',
//                       fontWeight: 'bold', color: '#246679', zIndex: 10
//                     }}>↓</button>
//                   </div>

//                   <div style={{
//                     position: 'absolute',
//                     bottom: '20px',
//                     right: '20px',
//                     display: 'flex',
//                     gap: '8px',
//                     flexWrap: 'wrap',
//                     justifyContent: 'flex-end'
//                   }}>
//                     {['female', 'male', 'part'].map((type) => (
//                       <Button
//                         key={type}
//                         size="small"
//                         type={activeModel === type ? 'primary' : 'default'}
//                         onClick={() => handleModelSwitch(type)}
//                         style={{
//                           borderRadius: '6px',
//                           textTransform: 'capitalize',
//                           background: activeModel === type ? theme.primary : 'white',
//                           borderColor: activeModel === type ? theme.primary : theme.borderColor,
//                           color: activeModel === type ? 'white' : theme.textPrimary
//                         }}
//                       >
//                         {type}
//                       </Button>
//                     ))}
//                   </div>

//                   <div style={{
//                     position: 'absolute',
//                     bottom: '20px',
//                     left: '20px'
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
//                         boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
//                       }}
//                     >
//                       ISO
//                     </button>
//                   </div>

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
//                       <div style={{ textAlign: 'center' }}>
//                         <div style={{
//                           border: `4px solid ${theme.primary}33`,
//                           borderTop: `4px solid ${theme.primary}`,
//                           borderRadius: '50%',
//                           width: '48px',
//                           height: '48px',
//                           animation: 'spin 1s linear infinite',
//                           margin: '0 auto 20px'
//                         }} />
//                         <Text style={{ color: theme.primary, fontSize: '16px', fontWeight: '500' }}>
//                           {loadingMessage}
//                         </Text>
//                         {loadingProgress > 0 && (
//                           <div style={{ marginTop: '16px', width: '200px', margin: '16px auto 0' }}>
//                             <Progress percent={loadingProgress} status="active" />
//                           </div>
//                         )}
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
//                       background: 'rgba(255, 255, 255, 0.95)'
//                     }}>
//                       <div style={{ textAlign: 'center' }}>
//                         <div style={{
//                           width: '48px',
//                           height: '48px',
//                           background: '#f5222d',
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
//                         <Text style={{ color: '#f5222d', fontSize: '16px', fontWeight: '500' }}>
//                           {loadingMessage}
//                         </Text>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             </Col>

// <Col xs={24} lg={12} style={{ height: '100%' }}>
//   <AnalysisCostData
//     calculationData={calculationData}
//     updatedCalculationData={updatedCalculationData}
//     stockDimensions={stockDimensions}
//     setStockDimensions={setStockDimensions}
//     quantity={quantity}
//     setQuantity={setQuantity}
//     selectedMachine={selectedMachine}
//     machineRates={machineRates}
//     isUpdatingCost={isUpdatingCost}
//     isUpdatingQuantity={isUpdatingQuantity}
//     isUpdatingDimensions={isUpdatingDimensions}
//     activeModel={activeModel}
//     handleQuantityUpdate={handleQuantityUpdate}
//     handleUpdateDimensions={handleUpdateDimensions}
//     handleMachineChange={handleMachineChange}
//     captureIsometricView={captureIsometricView}
//     //  captureIsometricView={capturePartIsometricView} //this line added to capture only part 3d display blob in download report
//   />
// </Col>
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

// export default SheetMetalViewerPage;




// ''''''see this below code is correct working code but not therir correction_factor column so added that column in below next
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Layout, Card, Typography, Row, Col, Button, Progress, message } from 'antd';
import { ArrowLeftOutlined, ExpandOutlined } from '@ant-design/icons';
import AnalysisCostData from './SheetMetalCostReport';

const { Content } = Layout;
const { Title, Text } = Typography;

const theme = {
  primary: '#246679',
  secondary: '#73b6ca',
  background: '#f0f2f5',
  cardBg: '#ffffff',
  textPrimary: '#000000',
  textSecondary: '#666666',
  borderColor: '#d9d9d9',
  shadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  modelBg: '#f8f9fa',
  cubeColors: {
    front: '#B0B0B0',
    back: '#888888',
    top: '#D3D3D3',
    bottom: '#6E6E6E',
    left: '#A9A9A9',
    right: '#505050'
  }
};

function SheetMetalViewerPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const cubeCanvasRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const modelRef = useRef(null);
  const rendererRef = useRef(null);
  const loadingAbortControllerRef = useRef(null);

  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading 3D model...');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeModel, setActiveModel] = useState('male');
  const [machineRates, setMachineRates] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [isUpdatingCost, setIsUpdatingCost] = useState(false);
  const [cubeRotation, setCubeRotation] = useState({ x: 0, y: 0 });
  const [updatedCalculationData, setUpdatedCalculationData] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isUpdatingDimensions, setIsUpdatingDimensions] = useState(false);
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
  const [stockDimensions, setStockDimensions] = useState({
    female_stock_length: 0,
    female_stock_breadth: 0,
    female_stock_height: 0,
    male_stock_length: 0,
    male_stock_breadth: 0,
    male_stock_height: 0
  });

  const ANALYZE_API_URL = 'http://localhost:5678';

  const { analysisData, calculationData: initialCalculationData, conversionData, historyId } = location.state || {};
  const actualHistoryId = historyId || location.state?.historyId;

  const calculationData = updatedCalculationData || initialCalculationData;

  useEffect(() => {
    if (calculationData?.classification) {
      setStockDimensions({
        female_stock_length: calculationData.classification.female_tool?.stock_dimensions?.stock_length || 0,
        female_stock_breadth: calculationData.classification.female_tool?.stock_dimensions?.stock_breadth || 0,
        female_stock_height: calculationData.classification.female_tool?.stock_dimensions?.stock_height || 0,
        male_stock_length: calculationData.classification.male_tool?.stock_dimensions?.stock_length || 0,
        male_stock_breadth: calculationData.classification.male_tool?.stock_dimensions?.stock_breadth || 0,
        male_stock_height: calculationData.classification.male_tool?.stock_dimensions?.stock_height || 0
      });
    }
  }, [calculationData]);

  useEffect(() => {
    if (calculationData?.quantity) {
      setQuantity(calculationData.quantity);
    }
  }, [calculationData]);

  useEffect(() => {
    const fetchMachineRates = async () => {
      try {
        const response = await fetch(`${ANALYZE_API_URL}/sheetmetal-machine-hour-rates`);
        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          setMachineRates(data.data);

          if (calculationData?.classification?.female_tool?.mhr_machine_type &&
            calculationData?.classification?.female_tool?.mhr_machine_size) {
            const machineType = calculationData.classification.female_tool.mhr_machine_type.trim();
            const machineSize = calculationData.classification.female_tool.mhr_machine_size.trim();
            const initialMachine = `${machineType}-${machineSize}`;
            console.log('Setting initial machine:', initialMachine);
            setSelectedMachine(initialMachine);
          }
        }
      } catch (error) {
        console.error('Error fetching machine rates:', error);
        message.error('Failed to load machine rates');
      }
    };

    fetchMachineRates();
  }, [calculationData]);

  const captureIsometricView = () => {
    return new Promise((resolve) => {
      try {
        let callbackExecuted = false;

        const handleIsometricCapture = (event) => {
          if (!callbackExecuted) {
            callbackExecuted = true;
            const dataUrl = event.detail;
            window.removeEventListener('sheetmetalIsometricCaptureComplete', handleIsometricCapture);
            console.log('Sheet Metal isometric capture received successfully');
            resolve(dataUrl);
          }
        };

        window.addEventListener('sheetmetalIsometricCaptureComplete', handleIsometricCapture);

        const captureEvent = new CustomEvent('requestSheetmetalIsometricCapture', {
          detail: { timestamp: Date.now() }
        });

        window.dispatchEvent(captureEvent);
        console.log('Sheet Metal isometric capture request sent');

        const timeoutId = setTimeout(() => {
          if (!callbackExecuted) {
            callbackExecuted = true;
            window.removeEventListener('sheetmetalIsometricCaptureComplete', handleIsometricCapture);
            console.warn('Sheet Metal isometric capture timeout after 5 seconds, returning null');
            resolve(null);
          }
        }, 5000);

        return () => clearTimeout(timeoutId);

      } catch (error) {
        console.error('Error in captureIsometricView:', error);
        resolve(null);
      }
    });
  };

  const handleQuantityUpdate = async () => {
    if (!actualHistoryId) {
      message.error('No history ID available');
      return;
    }

    setIsUpdatingQuantity(true);

    try {
      const formData = new URLSearchParams();
      formData.append('history_id', actualHistoryId);
      formData.append('new_quantity', quantity);

      const response = await fetch(`${ANALYZE_API_URL}/update-quantity-cost/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'accept': 'application/json'
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || 'Failed to update quantity');
      }

      const result = await response.json();

      console.log('Quantity Update Response:', result);

      const updatedData = {
        ...calculationData,
        quantity: result.new_quantity,
        total_cost: result.updated_values?.total_cost,
        total_cost_per_unit: result.updated_values?.total_cost_per_unit,
        material: {
          name: result.material?.name,
          density: result.material?.density,
          cost: result.material?.cost_per_kg,
          id: result.material?.id
        },
        tool_design: {
          total_design_cost: result.updated_values?.total_design_cost
        },
        part_forming: {
          part_forming_cost: result.updated_values?.part_forming_cost,
          part_forming_cost_per_unit: result.updated_values?.part_forming_cost_per_unit
        },
        classification: {
          female_tool: {
            ...calculationData.classification?.female_tool,
            filename: result.Actual_dimensions?.female_tool?.filename || calculationData.classification?.female_tool?.filename,
            actual_dimensions: {
              length: result.Actual_dimensions?.female_tool?.length || calculationData.classification?.female_tool?.actual_dimensions?.length || 0,
              breadth: result.Actual_dimensions?.female_tool?.breadth || calculationData.classification?.female_tool?.actual_dimensions?.breadth || 0,
              height: result.Actual_dimensions?.female_tool?.height || calculationData.classification?.female_tool?.actual_dimensions?.height || 0,
              volume_mm3: result.Actual_dimensions?.female_tool?.volume_mm3 || calculationData.classification?.female_tool?.actual_dimensions?.volume_mm3 || 0,
              volume_m3: result.Actual_dimensions?.female_tool?.volume_m3 || calculationData.classification?.female_tool?.actual_dimensions?.volume_m3 || 0
            },
            stock_dimensions: result.Stock_and_cost?.female?.stock_dimensions || calculationData.classification?.female_tool?.stock_dimensions,
            manufacturing_cost: result.Stock_and_cost?.female?.manufacturing_cost || calculationData.classification?.female_tool?.manufacturing_cost,
            volume_removed_m3: calculationData.classification?.female_tool?.volume_removed_m3,
            mhr: calculationData.classification?.female_tool?.mhr,
            mhr_machine_type: calculationData.classification?.female_tool?.mhr_machine_type,
            mhr_machine_size: calculationData.classification?.female_tool?.mhr_machine_size,
            manufacturing_time_hr: calculationData.classification?.female_tool?.manufacturing_time_hr
          },
          male_tool: {
            ...calculationData.classification?.male_tool,
            filename: result.Actual_dimensions?.male_tool?.filename || calculationData.classification?.male_tool?.filename,
            actual_dimensions: {
              length: result.Actual_dimensions?.male_tool?.length || calculationData.classification?.male_tool?.actual_dimensions?.length || 0,
              breadth: result.Actual_dimensions?.male_tool?.breadth || calculationData.classification?.male_tool?.actual_dimensions?.breadth || 0,
              height: result.Actual_dimensions?.male_tool?.height || calculationData.classification?.male_tool?.actual_dimensions?.height || 0,
              volume_mm3: result.Actual_dimensions?.male_tool?.volume_mm3 || calculationData.classification?.male_tool?.actual_dimensions?.volume_mm3 || 0,
              volume_m3: result.Actual_dimensions?.male_tool?.volume_m3 || calculationData.classification?.male_tool?.actual_dimensions?.volume_m3 || 0
            },
            stock_dimensions: result.Stock_and_cost?.male?.stock_dimensions || calculationData.classification?.male_tool?.stock_dimensions,
            manufacturing_cost: result.Stock_and_cost?.male?.manufacturing_cost || calculationData.classification?.male_tool?.manufacturing_cost,
            volume_removed_m3: calculationData.classification?.male_tool?.volume_removed_m3,
            mhr: calculationData.classification?.male_tool?.mhr,
            mhr_machine_type: calculationData.classification?.male_tool?.mhr_machine_type,
            mhr_machine_size: calculationData.classification?.male_tool?.mhr_machine_size,
            manufacturing_time_hr: calculationData.classification?.male_tool?.manufacturing_time_hr
          },
          part: {
            filename: result.Actual_dimensions?.part?.filename || calculationData.classification?.part?.filename,
            actual_dimensions: {
              length: result.Actual_dimensions?.part?.length || calculationData.classification?.part?.actual_dimensions?.length || 0,
              breadth: result.Actual_dimensions?.part?.breadth || calculationData.classification?.part?.actual_dimensions?.breadth || 0,
              height: result.Actual_dimensions?.part?.height || calculationData.classification?.part?.actual_dimensions?.height || 0,
              volume_mm3: result.Actual_dimensions?.part?.volume_mm3 || calculationData.classification?.part?.actual_dimensions?.volume_mm3 || 0,
              volume_m3: result.Actual_dimensions?.part?.volume_m3 || calculationData.classification?.part?.actual_dimensions?.volume_m3 || 0
            }
          }
        }
      };

      setUpdatedCalculationData(updatedData);
      message.success(`Quantity updated to ${result.new_quantity}! All costs recalculated.`);

    } catch (error) {
      console.error('Error updating quantity:', error);
      message.error(`Failed to update quantity: ${error.message}`);
    } finally {
      setIsUpdatingQuantity(false);
    }
  };

  const handleUpdateDimensions = async () => {
    if (!actualHistoryId) {
      message.error('No history ID available');
      return;
    }

    setIsUpdatingDimensions(true);

    try {
      const formData = new URLSearchParams();
      formData.append('history_id', actualHistoryId);
      formData.append('female_stock_length', stockDimensions.female_stock_length);
      formData.append('female_stock_breadth', stockDimensions.female_stock_breadth);
      formData.append('female_stock_height', stockDimensions.female_stock_height);
      formData.append('male_stock_length', stockDimensions.male_stock_length);
      formData.append('male_stock_breadth', stockDimensions.male_stock_breadth);
      formData.append('male_stock_height', stockDimensions.male_stock_height);

      const response = await fetch(`${ANALYZE_API_URL}/recalculate-stock/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'accept': 'application/json'
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || 'Failed to update stock dimensions');
      }

      const result = await response.json();

      console.log('API Response:', result);

      const updatedData = {
        ...calculationData,
        ...result,
        material: result.material || calculationData.material,
        quantity: result.quantity || calculationData.quantity,
        total_cost: result.total_cost,
        total_cost_per_unit: result.total_cost_per_unit,
        tool_design: result.tool_design || calculationData.tool_design,
        part_forming: result.part_forming || calculationData.part_forming,
        classification: {
          female_tool: {
            ...result.classification?.female_tool,
            filename: result.classification?.female_tool?.filename || calculationData.classification?.female_tool?.filename,
            actual_dimensions: {
              length: result.actual_female_dimensions?.length || 0,
              breadth: result.actual_female_dimensions?.breadth || 0,
              height: result.actual_female_dimensions?.height || 0,
              volume_mm3: result.actual_female_dimensions?.volume_mm3 || 0,
              volume_m3: result.actual_female_dimensions?.volume_m3 || 0
            },
            stock_dimensions: result.classification?.female_tool?.stock_dimensions,
            manufacturing_cost: result.classification?.female_tool?.manufacturing_cost,
            volume_removed_m3: result.classification?.female_tool?.volume_removed_m3,
            mhr: result.classification?.female_tool?.mhr,
            mhr_machine_type: result.classification?.female_tool?.mhr_machine_type,
            mhr_machine_size: result.classification?.female_tool?.mhr_machine_size,
            manufacturing_time_hr: result.classification?.female_tool?.manufacturing_time_hr
          },
          male_tool: {
            ...result.classification?.male_tool,
            filename: result.classification?.male_tool?.filename || calculationData.classification?.male_tool?.filename,
            actual_dimensions: {
              length: result.actual_male_dimensions?.length || 0,
              breadth: result.actual_male_dimensions?.breadth || 0,
              height: result.actual_male_dimensions?.height || 0,
              volume_mm3: result.actual_male_dimensions?.volume_mm3 || 0,
              volume_m3: result.actual_male_dimensions?.volume_m3 || 0
            },
            stock_dimensions: result.classification?.male_tool?.stock_dimensions,
            manufacturing_cost: result.classification?.male_tool?.manufacturing_cost,
            volume_removed_m3: result.classification?.male_tool?.volume_removed_m3,
            mhr: result.classification?.male_tool?.mhr,
            mhr_machine_type: result.classification?.male_tool?.mhr_machine_type,
            mhr_machine_size: result.classification?.male_tool?.mhr_machine_size,
            manufacturing_time_hr: result.classification?.male_tool?.manufacturing_time_hr
          },
          part: {
            filename: result.classification?.part?.filename || result.actual_part_dimensions?.filename || calculationData.classification?.part?.filename,
            actual_dimensions: {
              length: result.actual_part_dimensions?.length || 0,
              breadth: result.actual_part_dimensions?.breadth || 0,
              height: result.actual_part_dimensions?.height || 0,
              volume_mm3: result.actual_part_dimensions?.volume_mm3 || 0,
              volume_m3: result.actual_part_dimensions?.volume_m3 || 0
            }
          }
        }
      };

      console.log('Updated Data:', updatedData);

      setUpdatedCalculationData(updatedData);
      message.success('Stock dimensions updated successfully!');

    } catch (error) {
      console.error('Error updating stock dimensions:', error);
      message.error(`Failed to update stock dimensions: ${error.message}`);
    } finally {
      setIsUpdatingDimensions(false);
    }
  };

  const handleMachineChange = async (value) => {
    console.log('Machine changed to:', value);

    const selectedRate = machineRates.find(rate => {
      const rateKey = `${rate.machine_type.trim()}-${rate.size.trim()}`;
      return rateKey === value;
    });

    if (!selectedRate || !actualHistoryId) {
      console.log('Selected rate not found or no history ID');
      return;
    }

    setSelectedMachine(value);
    setIsUpdatingCost(true);

    try {
      const formData = new URLSearchParams();
      formData.append('history_id', actualHistoryId);
      formData.append('machine_type', selectedRate.machine_type);
      formData.append('size', selectedRate.size);

      console.log('Updating with:', {
        machine_type: selectedRate.machine_type,
        size: selectedRate.size
      });

      const response = await fetch(`${ANALYZE_API_URL}/update-manufacturing-cost/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update manufacturing cost');
      }

      const result = await response.json();

      if (result.total_cost !== undefined) {
        const updatedData = {
          ...calculationData,
          total_cost: result.total_cost,
          classification: {
            ...calculationData.classification,
            female_tool: {
              ...calculationData.classification?.female_tool,
              manufacturing_cost: result.female_manufacturing_cost_per_unit,
              mhr_machine_type: selectedRate.machine_type,
              mhr_machine_size: selectedRate.size
            },
            male_tool: {
              ...calculationData.classification?.male_tool,
              manufacturing_cost: result.male_manufacturing_cost_per_unit
            }
          }
        };

        setUpdatedCalculationData(updatedData);
        message.success(`Manufacturing cost updated! New Total: ₹${result.total_cost.toFixed(2)}`);
      }

    } catch (error) {
      console.error('Error updating cost:', error);
      message.error(`Failed to update manufacturing cost: ${error.message}`);
      // Revert selection on error
      if (calculationData?.classification?.female_tool?.mhr_machine_type &&
        calculationData?.classification?.female_tool?.mhr_machine_size) {
        const revertMachine = `${calculationData.classification.female_tool.mhr_machine_type}-${calculationData.classification.female_tool.mhr_machine_size}`;
        setSelectedMachine(revertMachine);
      }
    } finally {
      setIsUpdatingCost(false);
    }
  };

  const loadModelFromServer = useCallback(async (historyId, modelType = 'male') => {
    if (!historyId || historyId === 'undefined' || historyId === 'null') {
      setIsError(true);
      setLoadingMessage('Invalid history ID. Please upload files again.');
      message.error('No history ID found');
      return;
    }

    if (loadingAbortControllerRef.current) {
      loadingAbortControllerRef.current.abort();
    }

    setIsModelLoaded(false);
    setIsError(false);
    setLoadingProgress(0);
    setLoadingMessage(`Loading ${modelType} model...`);

    const abortController = new AbortController();
    loadingAbortControllerRef.current = abortController;

    try {
      setLoadingProgress(20);

      const url = `${ANALYZE_API_URL}/sheetmetal/all-draco-glb/${historyId}?download=${modelType}`;

      const response = await fetch(url, {
        signal: abortController.signal,
        method: 'GET',
        headers: {
          'Accept': 'model/gltf-binary, application/octet-stream, */*',
          'Cache-Control': 'no-cache'
        }
      });

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('text/html')) {
        throw new Error('Backend returned HTML instead of GLB file.');
      }

      if (contentType && contentType.includes('application/json')) {
        const jsonError = await response.json();
        throw new Error(jsonError.detail || jsonError.error || 'Server returned an error');
      }

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      setLoadingProgress(50);

      const arrayBuffer = await response.arrayBuffer();

      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error('Empty GLB model data received');
      }

      setLoadingProgress(75);

      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('/draco/');

      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);

      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Model loading timeout'));
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
            setLoadingProgress(95);
            resolve(gltf);
          },
          (error) => {
            clearTimeout(timeoutId);
            reject(new Error(`Failed to parse GLB: ${error.message}`));
          }
        );
      });

    } catch (error) {
      if (abortController.signal.aborted) return;

      console.error('Error loading model:', error);
      setIsError(true);
      setLoadingMessage(`Error: ${error.message}`);
      message.error(`Failed to load model: ${error.message}`);
    }
  }, []);

  // ✅ PRESERVE ORIGINAL GLB COLORS - Enhanced for Sheet Metal
  const processAndAddModel = useCallback((gltfScene) => {
    if (!sceneRef.current) return;

    if (modelRef.current && sceneRef.current) {
      sceneRef.current.remove(modelRef.current);
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
      controlsRef.current.update();
    }

    if (cameraRef.current) {
      const distance = 4 * 1.5;
      cameraRef.current.position.set(distance, distance, distance);
      cameraRef.current.lookAt(0, 0, 0);
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
    setIsModelLoaded(true);
    setLoadingProgress(100);
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

    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const cube = new THREE.Mesh(cubeGeometry, materials);
    scene.add(cube);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    return { scene, camera, cube, renderer };
  }, [createTextTexture]);

  const moveCamera = useCallback((direction) => {
    if (!controlsRef.current || !cameraRef.current) return;

    const controls = controlsRef.current;
    const camera = cameraRef.current;
    const target = controls.target;

    const offset = camera.position.clone().sub(target);
    const angle = Math.PI / 12;

    const spherical = new THREE.Spherical().setFromVector3(offset);

    if (direction === 'up' || direction === 'down') {
      const rotationAngle = direction === 'up' ? angle : -angle;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi + rotationAngle));
    } else if (direction === 'left' || direction === 'right') {
      const rotationAngle = direction === 'left' ? angle : -angle;
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

  const handleFaceClick = useCallback((face) => {
    if (!controlsRef.current || !cameraRef.current) return;

    const cam = cameraRef.current;
    const controls = controlsRef.current;
    const distance = cam.position.distanceTo(controls.target);

    let targetPosition = new THREE.Vector3();
    let targetUp = new THREE.Vector3(0, 1, 0);

    switch (face) {
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
    if (!canvasRef.current) return;

    let scene, camera, renderer, controls;
    let cubeScene;
    let frameId = null;

    const init = () => {
      scene = new THREE.Scene();
      scene.background = new THREE.Color('#f8f9fa');
      sceneRef.current = scene;

      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;

      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(5, 5, 5);
      cameraRef.current = camera;

      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = true;
      rendererRef.current = renderer;

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = true;
      controls.zoomSpeed = 2.5;
      controls.target.set(0, 0, 0);
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

      if (actualHistoryId) {
        loadModelFromServer(actualHistoryId, activeModel).then((gltf) => {
          if (gltf) {
            processAndAddModel(gltf.scene);
          }
        });
      } else {
        setIsError(true);
        setLoadingMessage('No history ID provided. Please upload files again.');
        message.error('Missing history ID');
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
        cancelAnimationFrame(frameId);
        window.removeEventListener('resize', handleResize);
        if (renderer) renderer.dispose();
        if (cubeScene && cubeScene.renderer) cubeScene.renderer.dispose();
      };
    };

    return init();
  }, [actualHistoryId, activeModel, loadModelFromServer, processAndAddModel, cubeRotation, initCubeScene]);

  const handleModelSwitch = async (modelType) => {
    setActiveModel(modelType);
    setIsModelLoaded(false);

    if (!actualHistoryId) {
      setIsError(true);
      setLoadingMessage('No history ID available');
      return;
    }

    try {
      const gltf = await loadModelFromServer(actualHistoryId, modelType);
      if (gltf) {
        processAndAddModel(gltf.scene);
      }
    } catch (error) {
      console.error('Error switching model:', error);
      setIsError(true);
    }
  };

  const handleFullscreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleRequestSheetmetalIsometricCapture = async (event) => {
      try {
        console.log('SheetMetalViewerPage received isometric capture request');

        if (!cameraRef.current || !controlsRef.current || !canvasRef.current) {
          console.error('Required THREE.js references not available');
          window.dispatchEvent(new CustomEvent('sheetmetalIsometricCaptureComplete', {
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

          console.log('Setting isometric view position for sheet metal model:', isoPosition);

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

          console.log('Sheet Metal isometric view captured successfully, size:', (dataUrl.length / 1024).toFixed(2), 'KB');

          window.dispatchEvent(new CustomEvent('sheetmetalIsometricCaptureComplete', {
            detail: dataUrl
          }));

        } catch (captureError) {
          console.error('Error during sheet metal isometric capture:', captureError);
          window.dispatchEvent(new CustomEvent('sheetmetalIsometricCaptureComplete', {
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
        console.error('Fatal error in sheet metal isometric capture handler:', error);
        window.dispatchEvent(new CustomEvent('sheetmetalIsometricCaptureComplete', {
          detail: null
        }));
      }
    };

    window.addEventListener('requestSheetmetalIsometricCapture', handleRequestSheetmetalIsometricCapture);
    console.log('Sheet Metal isometric capture handler registered');

    return () => {
      window.removeEventListener('requestSheetmetalIsometricCapture', handleRequestSheetmetalIsometricCapture);
      console.log('Sheet Metal isometric capture handler removed');
    };

  }, []);

  return (
    <Layout style={{ minHeight: '100vh', background: theme.background }}>
      <div style={{
        height: '80px',
        background: theme.primary,
        padding: '0 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: theme.shadow,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', left: '40px' }}>
          <button
            onClick={() => navigate('/home/sheet-metal/upload')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              color: theme.cardBg,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              background: 'transparent'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            <ArrowLeftOutlined /> Back to Upload
          </button>
        </div>

        <Title level={3} style={{ margin: 0, color: theme.cardBg, fontSize: '25px', fontWeight: '600' }}>
          COST ESTIMATION SOFTWARE
        </Title>
      </div>
      <Content style={{ padding: '30px 40px', height: 'calc(100vh - 140px)', overflow: 'auto' }}>
        <div style={{ maxWidth: '100%', height: '100%' }}>
          <Row gutter={[30, 30]} style={{ height: '100%' }}>
            <Col xs={24} lg={12} style={{ height: '100%' }}>
              <Card
                title="3D Model Viewer"
                style={{
                  height: '100%',
                  boxShadow: theme.shadow,
                  borderRadius: '8px',
                  background: theme.modelBg,
                  border: `1px solid ${theme.borderColor}`
                }}
                bodyStyle={{
                  padding: '0',
                  height: 'calc(100% - 65px)',
                  position: 'relative',
                  background: theme.modelBg
                }}
                extra={
                  <Button
                    icon={<ExpandOutlined />}
                    onClick={handleFullscreen}
                    size="small"
                  />
                }
              >
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <canvas
                    ref={canvasRef}
                    style={{ width: '100%', height: '100%', display: 'block' }}
                  />

                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '240px',
                    height: '240px',
                    display: isModelLoaded ? 'block' : 'none'
                  }}>
                    <button onClick={() => moveCamera('up')} style={{
                      position: 'absolute', left: '50%', top: '5px', transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
                      border: '2px solid rgba(36, 102, 121, 0.3)', borderRadius: '50%',
                      width: '36px', height: '36px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontSize: '16px',
                      fontWeight: 'bold', color: '#246679', zIndex: 10
                    }}>↑</button>

                    <button onClick={() => moveCamera('left')} style={{
                      position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
                      border: '2px solid rgba(36, 102, 121, 0.3)', borderRadius: '50%',
                      width: '36px', height: '36px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontSize: '16px',
                      fontWeight: 'bold', color: '#246679', zIndex: 10
                    }}>←</button>

                    <div style={{
                      position: 'absolute', left: '50%', top: '50%',
                      transform: 'translate(-50%, -50%)', width: '150px', height: '150px',
                      overflow: 'hidden', pointerEvents: 'none'
                    }}>
                      <canvas ref={cubeCanvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

                      <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                        gridTemplateRows: 'repeat(3, 1fr)', pointerEvents: 'auto'
                      }}>
                        <div onClick={() => handleFaceClick('top')} style={{ gridColumn: 2, gridRow: 1, cursor: 'pointer' }} />
                        <div onClick={() => handleFaceClick('left')} style={{ gridColumn: 1, gridRow: 2, cursor: 'pointer' }} />
                        <div onClick={() => handleFaceClick('front')} style={{ gridColumn: 2, gridRow: 2, cursor: 'pointer' }} />
                        <div onClick={() => handleFaceClick('right')} style={{ gridColumn: 3, gridRow: 2, cursor: 'pointer' }} />
                        <div onClick={() => handleFaceClick('bottom')} style={{ gridColumn: 2, gridRow: 3, cursor: 'pointer' }} />
                      </div>
                    </div>

                    <button onClick={() => moveCamera('right')} style={{
                      position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
                      border: '2px solid rgba(36, 102, 121, 0.3)', borderRadius: '50%',
                      width: '36px', height: '36px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontSize: '16px',
                      fontWeight: 'bold', color: '#246679', zIndex: 10
                    }}>→</button>

                    <button onClick={() => moveCamera('down')} style={{
                      position: 'absolute', left: '50%', bottom: '5px', transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
                      border: '2px solid rgba(36, 102, 121, 0.3)', borderRadius: '50%',
                      width: '36px', height: '36px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontSize: '16px',
                      fontWeight: 'bold', color: '#246679', zIndex: 10
                    }}>↓</button>
                  </div>

                  <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end'
                  }}>
                    {['female', 'male', 'part'].map((type) => (
                      <Button
                        key={type}
                        size="small"
                        type={activeModel === type ? 'primary' : 'default'}
                        onClick={() => handleModelSwitch(type)}
                        style={{
                          borderRadius: '6px',
                          textTransform: 'capitalize',
                          background: activeModel === type ? theme.primary : 'white',
                          borderColor: activeModel === type ? theme.primary : theme.borderColor,
                          color: activeModel === type ? 'white' : theme.textPrimary
                        }}
                      >
                        {type}
                      </Button>
                    ))}
                  </div>

                  <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px'
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
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                      }}
                    >
                      ISO
                    </button>
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
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          border: `4px solid ${theme.primary}33`,
                          borderTop: `4px solid ${theme.primary}`,
                          borderRadius: '50%',
                          width: '48px',
                          height: '48px',
                          animation: 'spin 1s linear infinite',
                          margin: '0 auto 20px'
                        }} />
                        <Text style={{ color: theme.primary, fontSize: '16px', fontWeight: '500' }}>
                          {loadingMessage}
                        </Text>
                        {loadingProgress > 0 && (
                          <div style={{ marginTop: '16px', width: '200px', margin: '16px auto 0' }}>
                            <Progress percent={loadingProgress} status="active" />
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
                      background: 'rgba(255, 255, 255, 0.95)'
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          background: '#f5222d',
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
                        <Text style={{ color: '#f5222d', fontSize: '16px', fontWeight: '500' }}>
                          {loadingMessage}
                        </Text>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={12} style={{ height: '100%' }}>
              <AnalysisCostData
                calculationData={calculationData}
                updatedCalculationData={updatedCalculationData}
                stockDimensions={stockDimensions}
                setStockDimensions={setStockDimensions}
                quantity={quantity}
                setQuantity={setQuantity}
                selectedMachine={selectedMachine}
                machineRates={machineRates}
                isUpdatingCost={isUpdatingCost}
                isUpdatingQuantity={isUpdatingQuantity}
                isUpdatingDimensions={isUpdatingDimensions}
                activeModel={activeModel}
                handleQuantityUpdate={handleQuantityUpdate}
                handleUpdateDimensions={handleUpdateDimensions}
                handleMachineChange={handleMachineChange}
                captureIsometricView={captureIsometricView}
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

export default SheetMetalViewerPage;