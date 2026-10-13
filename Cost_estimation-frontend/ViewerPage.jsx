// import React, { useEffect, useRef, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { Layout, Typography, Card, Row, Col, Divider, Statistic, Button } from 'antd';
// import * as THREE from 'three';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// const { Content } = Layout;
// const { Title, Text } = Typography;

// // Modern theme colors
// const theme = {
//   primary: '#0066FF',
//   secondary: '#00AAFF',
//   success: '#00C853',
//   warning: '#FFB300',
//   error: '#FF3D00',
//   background: '#F7F9FC',
//   cardBg: '#FFFFFF',
//   textPrimary: '#2C3E50',
//   textSecondary: '#7F8C9A',
//   borderColor: '#E5E9F2',
//   shadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
//   lightBlue: '#EBF5FF',
//   darkBlue: '#1A365D',
// };

// function ViewerPage() {
//   const location = useLocation();
//   const canvasRef = useRef(null);
//   const [isModelLoaded, setIsModelLoaded] = useState(false);
//   const [isError, setIsError] = useState(false);

//   // Extract data from location state
//   const { 
//     objUrl, 
//     originalFilename, 
//     materialName, 
//     quantity, 
//     density,
//     costingData 
//   } = location.state || {};

//   // Set up the Three.js scene
//   useEffect(() => {
//     if (!objUrl || !canvasRef.current) {
//       setIsError(true);
//       return;
//     }

//     let scene, camera, renderer, controls;
//     let frameId = null;

//     const init = () => {
//       // Scene
//       scene = new THREE.Scene();
//       scene.background = new THREE.Color(0xf0f0f0);

//       // Canvas dimensions
//       const width = canvasRef.current.clientWidth;
//       const height = canvasRef.current.clientHeight;

//       // Camera
//       camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
//       camera.position.z = 5;

//       // Renderer
//       renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.current });
//       renderer.setSize(width, height);

//       // Controls
//       controls = new OrbitControls(camera, renderer.domElement);
//       controls.enableDamping = true;

//       // Lights
//       const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//       scene.add(ambientLight);

//       const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//       directionalLight.position.set(1, 1, 1);
//       scene.add(directionalLight);

//       // Load the OBJ model
//       const loader = new OBJLoader();
//       loader.load(
//         objUrl,
//         (object) => {
//           // Center the object
//           const box = new THREE.Box3().setFromObject(object);
//           const center = box.getCenter(new THREE.Vector3());
//           const size = box.getSize(new THREE.Vector3());

//           object.position.x = -center.x;
//           object.position.y = -center.y;
//           object.position.z = -center.z;

//           // Set camera distance based on object size
//           const maxDim = Math.max(size.x, size.y, size.z);
//           camera.position.z = maxDim * 2.5;

//           // Apply material to all meshes
//           object.traverse((child) => {
//             if (child instanceof THREE.Mesh) {
//               child.material = new THREE.MeshStandardMaterial({
//                 color: 0x9bc8eb,
//                 roughness: 0.5,
//                 metalness: 0.2
//               });
//             }
//           });

//           scene.add(object);
//           setIsModelLoaded(true);
//         },
//         undefined,
//         (error) => {
//           console.error('Error loading model:', error);
//           setIsError(true);
//         }
//       );

//       // Handle window resize
//       const handleResize = () => {
//         if (!canvasRef.current) return;

//         const width = canvasRef.current.clientWidth;
//         const height = canvasRef.current.clientHeight;

//         camera.aspect = width / height;
//         camera.updateProjectionMatrix();
//         renderer.setSize(width, height);
//       };

//       window.addEventListener('resize', handleResize);

//       return { scene, camera, renderer, controls, handleResize };
//     };

//     const animate = () => {
//       frameId = requestAnimationFrame(animate);

//       controls.update();
//       renderer.render(scene, camera);
//     };

//     const { handleResize } = init();
//     animate();

//     // Cleanup function
//     return () => {
//       cancelAnimationFrame(frameId);
//       window.removeEventListener('resize', handleResize);

//       // Dispose of Three.js resources
//       if (renderer) {
//         renderer.dispose();
//       }
//     };
//   }, [objUrl]);

//   // Handle print report
//   const handlePrintReport = () => {
//     window.print();
//   };

//   return (
//     <Layout style={{ minHeight: '100vh', background: theme.background }}>
//       {/* Header - dark blue background */}
//       <div style={{ 
//         height: '72px',
//         background: theme.darkBlue, 
//         padding: '0 32px', 
//         display: 'flex', 
//         alignItems: 'center', 
//         justifyContent: 'space-between',
//         boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
//         position: 'sticky',
//         top: 0,
//         zIndex: 1000
//       }}>
//         {/* Company Logo on the left */}
//         <div>
//           <img src="/company.png" alt="cmti Logo" style={{ width: '88px', height: '40px' }} />
//         </div>

//         {/* Title in the middle */}
//         <div style={{ 
//           position: 'absolute', 
//           left: '50%', 
//           transform: 'translateX(-50%)',
//           display: 'flex', 
//           alignItems: 'center' 
//         }}>
//           <Title level={4} style={{ margin: 0, color: '#FFFFFF', fontWeight: 600, fontSize: '18px' }}>Automated Costing Engine</Title>
//         </div>
//       </div>

//       <Content style={{ padding: '24px' }}>
//         <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
//           <Row gutter={[24, 24]}>
//             {/* 3D Viewer Section */}
//             <Col xs={24} lg={12}>
//               <Card 
//                 title="3D Model Viewer" 
//                 style={{ 
//                   height: '600px', 
//                   boxShadow: theme.shadow,
//                   borderRadius: '12px',
//                   overflow: 'hidden'
//                 }}
//                 bodyStyle={{ 
//                   padding: '0', 
//                   height: 'calc(100% - 57px)', 
//                   position: 'relative',
//                   background: '#f0f0f0'
//                 }}
//               >
//                 {isError ? (
//                   <div style={{ 
//                     display: 'flex', 
//                     alignItems: 'center', 
//                     justifyContent: 'center', 
//                     height: '100%',
//                     flexDirection: 'column',
//                     padding: '20px'
//                   }}>
//                     <Text type="danger" style={{ fontSize: '16px', marginBottom: '8px' }}>
//                       Error loading the 3D model
//                     </Text>
//                     <Text type="secondary">
//                       There was a problem loading the 3D model. Please try again or contact support.
//                     </Text>
//                   </div>
//                 ) : (
//                   <canvas 
//                     ref={canvasRef} 
//                     style={{ 
//                       width: '100%', 
//                       height: '100%' 
//                     }}
//                   />
//                 )}
//                 {!isModelLoaded && !isError && (
//                   <div style={{ 
//                     position: 'absolute', 
//                     top: '50%', 
//                     left: '50%', 
//                     transform: 'translate(-50%, -50%)',
//                     textAlign: 'center'
//                   }}>
//                     <div style={{
//                       border: '4px solid rgba(0, 102, 255, 0.2)',
//                       borderTop: '4px solid #0066FF',
//                       borderRadius: '50%',
//                       width: '50px',
//                       height: '50px',
//                       animation: 'spin 1s linear infinite',
//                       margin: '0 auto 16px'
//                     }} />
//                     <Text style={{ color: theme.textSecondary }}>
//                       Loading 3D model...
//                     </Text>
//                     <style>{`
//                       @keyframes spin {
//                         0% { transform: rotate(0deg); }
//                         100% { transform: rotate(360deg); }
//                       }
//                     `}</style>
//                   </div>
//                 )}
//               </Card>
//             </Col>

//             {/* Cost Report Section */}
//             <Col xs={24} lg={12}>
//               <Card 
//                 title={
//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <span>Manufacturing Cost Report</span>
//                     <Button type="primary" onClick={handlePrintReport} icon={
//                       <span role="img" aria-label="print" className="anticon anticon-printer">
//                         <svg viewBox="64 64 896 896" focusable="false" data-icon="printer" width="1em" height="1em" fill="currentColor" aria-hidden="true">
//                           <path d="M820 436h-40c-4.4 0-8 3.6-8 8v40c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-40c0-4.4-3.6-8-8-8zm32-104H732V120c0-4.4-3.6-8-8-8H300c-4.4 0-8 3.6-8 8v212H172c-44.2 0-80 35.8-80 80v328c0 17.7 14.3 32 32 32h168v132c0 4.4 3.6 8 8 8h424c4.4 0 8-3.6 8-8V772h168c17.7 0 32-14.3 32-32V412c0-44.2-35.8-80-80-80zM360 180h304v152H360V180zm304 664H360V568h304v276zm200-140H732V500H292v204H160V412c0-6.6 5.4-12 12-12h680c6.6 0 12 5.4 12 12v292z"></path>
//                         </svg>
//                       </span>
//                     }>
//                       Print Report
//                     </Button>
//                   </div>
//                 }
//                 style={{ 
//                   height: '600px', 
//                   boxShadow: theme.shadow,
//                   borderRadius: '12px',
//                   overflow: 'auto'
//                 }}
//               >
//                 <div style={{ overflow: 'auto' }}>
//                   {costingData ? (
//                     <>
//                       {/* File and Material Information */}
//                       <div style={{ marginBottom: '24px' }}>
//                         <Title level={5} style={{ color: theme.textPrimary, marginBottom: '16px' }}>
//                           File Information
//                         </Title>
//                         <Row gutter={[16, 16]}>
//                           <Col span={12}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text type="secondary">Filename:</Text>
//                               <div style={{ fontWeight: 500, color: theme.textPrimary }}>
//                                 {costingData.filename || originalFilename}
//                               </div>
//                             </div>
//                           </Col>
//                           <Col span={12}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text type="secondary">Material:</Text>
//                               <div style={{ fontWeight: 500, color: theme.textPrimary }}>
//                                 {costingData.material_name || materialName}
//                               </div>
//                             </div>
//                           </Col>
//                           <Col span={12}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text type="secondary">Density:</Text>
//                               <div style={{ fontWeight: 500, color: theme.textPrimary }}>
//                                 {costingData.density || `${density} kg/m³`}
//                               </div>
//                             </div>
//                           </Col>
//                           <Col span={12}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text type="secondary">Quantity:</Text>
//                               <div style={{ fontWeight: 500, color: theme.textPrimary }}>
//                                 {costingData.quantity || quantity}
//                               </div>
//                             </div>
//                           </Col>
//                         </Row>
//                       </div>

//                       <Divider style={{ margin: '12px 0' }} />

//                       {/* Model Dimensions */}
//                       <div style={{ marginBottom: '24px' }}>
//                         <Title level={5} style={{ color: theme.textPrimary, marginBottom: '16px' }}>
//                           Model Dimensions
//                         </Title>
//                         <Row gutter={[16, 16]}>
//                           <Col span={24}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text type="secondary">Actual Volume:</Text>
//                               <div style={{ fontWeight: 500, color: theme.textPrimary }}>
//                                 {costingData.actual_model?.Actual_volume || 'N/A'}
//                               </div>
//                             </div>
//                           </Col>
//                           <Col span={12}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text type="secondary">Bounding Box Dimentions(Stock mass):</Text>
//                               <div style={{ fontWeight: 500, color: theme.textPrimary }}>
//                                 {costingData.recommended_stock_size?.Actual_dimensions || 'N/A'}
//                               </div>
//                             </div>
//                           </Col>
//                           <Col span={12}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text type="secondary">Recommended Dimensions:</Text>
//                               <div style={{ fontWeight: 500, color: theme.textPrimary }}>
//                                 {costingData.recommended_stock_size?.recommended_dimensions || 'N/A'}
//                               </div>
//                             </div>
//                           </Col>
//                           <Col span={24}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text type="secondary">Stock Volume:</Text>
//                               <div style={{ fontWeight: 500, color: theme.textPrimary }}>
//                                 {costingData.recommended_stock_size?.Stock_volume || 'N/A'}
//                               </div>
//                             </div>
//                           </Col>
//                         </Row>
//                       </div>

//                       <Divider style={{ margin: '12px 0' }} />

//                       {/* Material Information */}
//                       <div style={{ marginBottom: '24px' }}>
//                         <Title level={5} style={{ color: theme.textPrimary, marginBottom: '16px' }}>
//                           Material Information
//                         </Title>
//                         <Row gutter={[16, 16]}>
//                           <Col span={12}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text type="secondary">Stock Mass:</Text>
//                               <div style={{ fontWeight: 500, color: theme.textPrimary }}>
//                                 {costingData.stock_mass || 'N/A'}
//                               </div>
//                             </div>
//                           </Col>
//                           <Col span={12}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text type="secondary">Weight of Finished Product:</Text>
//                               <div style={{ fontWeight: 500, color: theme.textPrimary }}>
//                                 {costingData.weight_finished_product || 'N/A'}
//                               </div>
//                             </div>
//                           </Col>
//                           <Col span={24}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text type="secondary">Material Removed:</Text>
//                               <div style={{ fontWeight: 500, color: theme.textPrimary }}>
//                                 {costingData.material_removed || 'N/A'}
//                               </div>
//                             </div>
//                           </Col>
//                         </Row>
//                       </div>

//                       <Divider style={{ margin: '12px 0' }} />

//                       {/* Manufacturing Details */}
//                       <div style={{ marginBottom: '24px' }}>
//                         <Title level={5} style={{ color: theme.textPrimary, marginBottom: '16px' }}>
//                           Manufacturing Details
//                         </Title>
//                         <Row gutter={[16, 16]}>
//                           <Col span={12}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text type="secondary">Final MRR:</Text>
//                               <div style={{ fontWeight: 500, color: theme.textPrimary }}>
//                                 {costingData.final_MRR || 'N/A'}
//                               </div>
//                             </div>
//                           </Col>
//                           <Col span={12}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text type="secondary">Machining Hours:</Text>
//                               <div style={{ fontWeight: 500, color: theme.textPrimary }}>
//                                 {costingData.machining_hours || 'N/A'}
//                               </div>
//                             </div>
//                           </Col>
//                         </Row>
//                       </div>

//                       <Divider style={{ margin: '12px 0' }} />

//                       {/* Cost Summary */}
//                       <div>
//                         <Title level={5} style={{ color: theme.textPrimary, marginBottom: '16px' }}>
//                           Cost Summary
//                         </Title>
//                         <Row gutter={[16, 16]}>
//                           <Col span={12}>
//                             <Statistic 
//                               title="Cost Per Unit" 
//                               value={costingData.cost_per_unit || 'N/A'} 
//                               valueStyle={{ color: theme.primary, fontWeight: 600 }}
//                             />
//                           </Col>
//                           <Col span={12}>
//                             <Statistic 
//                               title="Total Cost" 
//                               value={costingData.total_cost || 'N/A'} 
//                               valueStyle={{ color: theme.primary, fontWeight: 600, fontSize: '24px' }}
//                             />
//                           </Col>
//                         </Row>
//                       </div>
//                     </>
//                   ) : (
//                     <div style={{ textAlign: 'center', padding: '40px 0' }}>
//                       <Text type="secondary">No costing data available</Text>
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             </Col>
//           </Row>
//         </div>
//       </Content>
//     </Layout>
//   );
// }

// export default ViewerPage;


// import React, { useEffect, useRef, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { Layout, Typography, Card, Row, Col, Divider, Statistic, Button, Input } from 'antd';
// import * as THREE from 'three';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// const { Content } = Layout;
// const { Title, Text } = Typography;

// // Updated lighter theme for better visibility
// const theme = {
//   primary: '#1890ff', // Standard blue
//   secondary: '#096dd9',
//   success: '#52c41a', // Green
//   warning: '#faad14',
//   error: '#f5222d',
//   background: '#f0f2f5', // Light gray background
//   cardBg: '#ffffff', // White card background
//   textPrimary: '#262626', // Dark text
//   textSecondary: '#8c8c8c', // Gray text
//   borderColor: '#d9d9d9',
//   shadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
//   lightBlue: '#e6f7ff',
//   darkBlue: '#001d66', // Header background
//   accent: '#1890ff',
//   inputBg: '#ffffff',
//   inputBorder: '#d9d9d9',
//   modelBg: '#f8f9fa' // Light background for 3D viewer
// };

// function ViewerPage() {
//   const location = useLocation();
//   const canvasRef = useRef(null);
//   const [isModelLoaded, setIsModelLoaded] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const [quantity, setQuantity] = useState(1);

//   // Extract data from location state
//   const { 
//     objUrl, 
//     originalFilename, 
//     materialName, 
//     density,
//     costingData 
//   } = location.state || {};

//   // Set up the Three.js scene
//   useEffect(() => {
//     if (!objUrl || !canvasRef.current) {
//       setIsError(true);
//       return;
//     }

//     let scene, camera, renderer, controls;
//     let frameId = null;

//     const init = () => {
//       // Scene with light background
//       scene = new THREE.Scene();
//       scene.background = new THREE.Color(0xf8f9fa); // Light gray background

//       // Canvas dimensions
//       const width = canvasRef.current.clientWidth;
//       const height = canvasRef.current.clientHeight;

//       // Camera
//       camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
//       camera.position.z = 5;

//       // Renderer
//       renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.current });
//       renderer.setSize(width, height);
//       renderer.shadowMap.enabled = true;
//       renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//       // Controls
//       controls = new OrbitControls(camera, renderer.domElement);
//       controls.enableDamping = true;
//       controls.dampingFactor = 0.05;

//       // Enhanced lighting setup
//       const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//       scene.add(ambientLight);

//       const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
//       directionalLight.position.set(5, 5, 5);
//       directionalLight.castShadow = true;
//       directionalLight.shadow.mapSize.width = 2048;
//       directionalLight.shadow.mapSize.height = 2048;
//       scene.add(directionalLight);

//       // Additional lights for better visibility
//       const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
//       directionalLight2.position.set(-5, 5, -5);
//       scene.add(directionalLight2);

//       const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.4);
//       directionalLight3.position.set(0, -5, 0);
//       scene.add(directionalLight3);

//       // Load the OBJ model
//       const loader = new OBJLoader();
//       loader.load(
//         objUrl,
//         (object) => {
//           // Center the object
//           const box = new THREE.Box3().setFromObject(object);
//           const center = box.getCenter(new THREE.Vector3());
//           const size = box.getSize(new THREE.Vector3());

//           object.position.x = -center.x;
//           object.position.y = -center.y;
//           object.position.z = -center.z;

//           // Set camera distance based on object size
//           const maxDim = Math.max(size.x, size.y, size.z);
//           camera.position.z = maxDim * 2.5;

//           // Apply light gray material to all meshes
//           object.traverse((child) => {
//             if (child instanceof THREE.Mesh) {
//               child.material = new THREE.MeshStandardMaterial({
//                 color: 0xb8b8b8, // Light gray color
//                 roughness: 0.25,
//                 metalness: 0.5,
//                 emissive: 0x0f0f0f, // Very subtle glow
//                 emissiveIntensity: 0.03
//               });
//               child.castShadow = true;
//               child.receiveShadow = true;
//             }
//           });

//           scene.add(object);
//           setIsModelLoaded(true);
//         },
//         undefined,
//         (error) => {
//           console.error('Error loading model:', error);
//           setIsError(true);
//         }
//       );

//       // Handle window resize
//       const handleResize = () => {
//         if (!canvasRef.current) return;

//         const width = canvasRef.current.clientWidth;
//         const height = canvasRef.current.clientHeight;

//         camera.aspect = width / height;
//         camera.updateProjectionMatrix();
//         renderer.setSize(width, height);
//       };

//       window.addEventListener('resize', handleResize);

//       return { scene, camera, renderer, controls, handleResize };
//     };

//     const animate = () => {
//       frameId = requestAnimationFrame(animate);

//       controls.update();
//       renderer.render(scene, camera);
//     };

//     const { handleResize } = init();
//     animate();

//     // Cleanup function
//     return () => {
//       cancelAnimationFrame(frameId);
//       window.removeEventListener('resize', handleResize);

//       // Dispose of Three.js resources
//       if (renderer) {
//         renderer.dispose();
//       }
//     };
//   }, [objUrl]);

//   // Handle print report
//   const handlePrintReport = () => {
//     window.print();
//   };

//   return (
//     <Layout style={{ 
//       minHeight: '100vh', 
//       width: '100vw',
//       background: theme.background,
//       overflow: 'hidden'
//     }}>
//       {/* Header - Updated with gradient background */}
//       <div style={{ 
//         height: '80px',
//         background: 'linear-gradient(to right, #0f172a, #111827, #0f172a)',
//         padding: '0 40px', 
//         display: 'flex', 
//         alignItems: 'center', 
//         justifyContent: 'space-between',
//         boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(6, 182, 212, 0.2)',
//         borderBottom: '4px solid #06b6d4',
//         position: 'sticky',
//         top: 0,
//         zIndex: 1000
//       }}>
//         {/* Company Logo on the left */}
//         {/* <div>
//           <img src="/ADA_LOGO.jpg" alt="ADA Logo" style={{ width: '80px', height: 'px' }} />
//         </div> */}

//         {/* Title in the middle */}
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
//             COST ESTIMATION
//           </Title>
//         </div>

//         <div style={{ 
//           color: '#ffffff', 
//           fontSize: '14px',
//           textAlign: 'right',
//           opacity: 0.9,
//           textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
//         }}>

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
//                 title={
//                   <span style={{ 
//                     color: theme.primary, 
//                     fontSize: '18px',
//                     fontWeight: 600
//                   }}>
//                     3D Model Viewer
//                   </span>
//                 }
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
//                 {isError ? (
//                   <div style={{ 
//                     display: 'flex', 
//                     alignItems: 'center', 
//                     justifyContent: 'center', 
//                     height: '100%',
//                     flexDirection: 'column',
//                     padding: '20px'
//                   }}>
//                     <Text style={{ 
//                       fontSize: '16px', 
//                       marginBottom: '8px',
//                       color: theme.error
//                     }}>
//                       Error loading the 3D model
//                     </Text>
//                     <Text style={{ color: theme.textSecondary }}>
//                       There was a problem loading the 3D model. Please try again or contact support.
//                     </Text>
//                   </div>
//                 ) : (
//                   <canvas 
//                     ref={canvasRef} 
//                     style={{ 
//                       width: '100%', 
//                       height: '100%',
//                       borderRadius: '0 0 8px 8px'
//                     }}
//                   />
//                 )}
//                 {!isModelLoaded && !isError && (
//                   <div style={{ 
//                     position: 'absolute', 
//                     top: '50%', 
//                     left: '50%', 
//                     transform: 'translate(-50%, -50%)',
//                     textAlign: 'center'
//                   }}>
//                     <div style={{
//                       border: `4px solid ${theme.primary}33`,
//                       borderTop: `4px solid ${theme.primary}`,
//                       borderRadius: '50%',
//                       width: '60px',
//                       height: '60px',
//                       animation: 'spin 1s linear infinite',
//                       margin: '0 auto 20px'
//                     }} />
//                     <Text style={{ 
//                       color: theme.primary,
//                       fontSize: '16px',
//                       fontWeight: 500
//                     }}>
//                       Loading 3D model...
//                     </Text>
//                     <style>{`
//                       @keyframes spin {
//                         0% { transform: rotate(0deg); }
//                         100% { transform: rotate(360deg); }
//                       }
//                     `}</style>
//                   </div>
//                 )}
//               </Card>
//             </Col>

//             {/* Cost Report Section */}
//             <Col xs={24} lg={12} style={{ height: '100%' }}>
//               <Card 
//                 title={
//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <span style={{ 
//                       color: theme.primary, 
//                       fontSize: '18px',
//                       fontWeight: 600
//                     }}>
//                       Manufacturing Cost Report
//                     </span>
//                     <Button 
//                       type="primary" 
//                       onClick={handlePrintReport}
//                       style={{
//                         borderRadius: '6px',
//                         height: '40px',
//                         fontWeight: 500
//                       }}
//                       icon={
//                         <span role="img" aria-label="print" className="anticon anticon-printer">
//                           <svg viewBox="64 64 896 896" focusable="false" data-icon="printer" width="1em" height="1em" fill="currentColor" aria-hidden="true">
//                             <path d="M820 436h-40c-4.4 0-8 3.6-8 8v40c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-40c0-4.4-3.6-8-8-8zm32-104H732V120c0-4.4-3.6-8-8-8H300c-4.4 0-8 3.6-8 8v212H172c-44.2 0-80 35.8-80 80v328c0 17.7 14.3 32 32 32h168v132c0 4.4 3.6 8 8 8h424c4.4 0 8-3.6 8-8V772h168c17.7 0 32-14.3 32-32V412c0-44.2-35.8-80-80-80zM360 180h304v152H360V180zm304 664H360V568h304v276zm200-140H732V500H292v204H160V412c0-6.6 5.4-12 12-12h680c6.6 0 12 5.4 12 12v292z"></path>
//                           </svg>
//                         </span>
//                       }
//                     >
//                       Print Report
//                     </Button>
//                   </div>
//                 }
//                 style={{ 
//                   height: '100%', 
//                   boxShadow: theme.shadow,
//                   borderRadius: '8px',
//                   overflow: 'hidden',
//                   background: theme.cardBg,
//                   border: `1px solid ${theme.borderColor}`
//                 }}
//                 bodyStyle={{ 
//                   background: theme.cardBg,
//                   color: theme.textPrimary,
//                   height: 'calc(100% - 65px)',
//                   overflow: 'auto'
//                 }}
//               >
//                 <div style={{ overflow: 'auto', height: '100%' }}>
//                   {costingData ? (
//                     <>
//                       {/* File Information */}
//                       <div style={{ marginBottom: '24px' }}>
//                         <Title level={5} style={{ 
//                           color: theme.primary, 
//                           marginBottom: '16px',
//                           fontSize: '16px',
//                           fontWeight: 600
//                         }}>
//                           File Information
//                         </Title>
//                         <div style={{ marginBottom: '12px' }}>
//                           <Text style={{ color: theme.textSecondary }}>Filename:</Text>
//                           <div style={{ 
//                             fontWeight: 500, 
//                             color: theme.textPrimary,
//                             fontSize: '14px'
//                           }}>
//                             {costingData.filename || originalFilename}
//                           </div>
//                         </div>
//                       </div>

//                       <Divider style={{ 
//                         margin: '20px 0',
//                         borderColor: theme.borderColor
//                       }} />

//                       {/* Material Information */}
//                       <div style={{ marginBottom: '24px' }}>
//                         <Title level={5} style={{ 
//                           color: theme.primary, 
//                           marginBottom: '16px',
//                           fontSize: '16px',
//                           fontWeight: 600
//                         }}>
//                           Material Information
//                         </Title>
//                         <Row gutter={[16, 16]}>
//                           <Col span={12}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text style={{ color: theme.textSecondary }}>Material:</Text>
//                               <div style={{ 
//                                 fontWeight: 500, 
//                                 color: theme.textPrimary,
//                                 fontSize: '14px'
//                               }}>
//                                 {costingData.material_name || materialName}
//                               </div>
//                             </div>
//                           </Col>
//                           <Col span={12}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text style={{ color: theme.textSecondary }}>Density:</Text>
//                               <div style={{ 
//                                 fontWeight: 500, 
//                                 color: theme.textPrimary,
//                                 fontSize: '14px'
//                               }}>
//                                 {costingData.density || `${density} kg/m³`}
//                               </div>
//                             </div>
//                           </Col>
//                           <Col span={12}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text style={{ color: theme.textSecondary }}>Stock Mass:</Text>
//                               <div style={{ 
//                                 fontWeight: 500, 
//                                 color: theme.textPrimary,
//                                 fontSize: '14px'
//                               }}>
//                                 {costingData.stock_mass || 'N/A'}
//                               </div>
//                             </div>
//                           </Col>
//                           <Col span={12}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text style={{ color: theme.textSecondary }}>Weight of Finished Product:</Text>
//                               <div style={{ 
//                                 fontWeight: 500, 
//                                 color: theme.textPrimary,
//                                 fontSize: '14px'
//                               }}>
//                                 {costingData.weight_finished_product || 'N/A'}
//                               </div>
//                             </div>
//                           </Col>
//                           <Col span={24}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text style={{ color: theme.textSecondary }}>Material Removed:</Text>
//                               <div style={{ 
//                                 fontWeight: 500, 
//                                 color: theme.textPrimary,
//                                 fontSize: '14px'
//                               }}>
//                                 {costingData.material_removed || 'N/A'}
//                               </div>
//                             </div>
//                           </Col>
//                         </Row>
//                       </div>

//                       <Divider style={{ 
//                         margin: '20px 0',
//                         borderColor: theme.borderColor
//                       }} />

//                       {/* Model Dimensions */}
//                       <div style={{ marginBottom: '24px' }}>
//                         <Title level={5} style={{ 
//                           color: theme.primary, 
//                           marginBottom: '16px',
//                           fontSize: '16px',
//                           fontWeight: 600
//                         }}>
//                           Model Dimensions
//                         </Title>
//                         <Row gutter={[16, 16]}>
//                           <Col span={24}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text style={{ color: theme.textSecondary }}>Actual Volume:</Text>
//                               <div style={{ 
//                                 fontWeight: 500, 
//                                 color: theme.textPrimary,
//                                 fontSize: '14px'
//                               }}>
//                                 {costingData.actual_model?.Actual_volume || 'N/A'}
//                               </div>
//                             </div>
//                           </Col>
//                           <Col span={12}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text style={{ color: theme.textSecondary }}>Bounding Box Dimensions (Stock mass):</Text>
//                               <div style={{ 
//                                 fontWeight: 500, 
//                                 color: theme.textPrimary,
//                                 fontSize: '14px'
//                               }}>
//                                 {costingData.recommended_stock_size?.Actual_dimensions || 'N/A'}
//                               </div>
//                             </div>
//                           </Col>
//                           <Col span={12}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text style={{ color: theme.textSecondary }}>Recommended Dimensions:</Text>
//                               <div style={{ 
//                                 fontWeight: 500, 
//                                 color: theme.textPrimary,
//                                 fontSize: '14px'
//                               }}>
//                                 {costingData.recommended_stock_size?.recommended_dimensions || 'N/A'}
//                               </div>
//                             </div>
//                           </Col>
//                           <Col span={24}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text style={{ color: theme.textSecondary }}>Stock Volume:</Text>
//                               <div style={{ 
//                                 fontWeight: 500, 
//                                 color: theme.textPrimary,
//                                 fontSize: '14px'
//                               }}>
//                                 {costingData.recommended_stock_size?.Stock_volume || 'N/A'}
//                               </div>
//                             </div>
//                           </Col>
//                         </Row>
//                       </div>

//                       <Divider style={{ 
//                         margin: '20px 0',
//                         borderColor: theme.borderColor
//                       }} />

//                       {/* Manufacturing Details */}
//                       <div style={{ marginBottom: '24px' }}>
//                         <Title level={5} style={{ 
//                           color: theme.primary, 
//                           marginBottom: '16px',
//                           fontSize: '16px',
//                           fontWeight: 600
//                         }}>
//                           Manufacturing Details
//                         </Title>
//                         <Row gutter={[16, 16]}>
//                           <Col span={12}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text style={{ color: theme.textSecondary }}>Quantity:</Text>
//                               <Input
//                                 type="number"
//                                 value={quantity}
//                                 onChange={(e) => setQuantity(e.target.value)}
//                                 style={{
//                                   marginTop: '4px',
//                                   borderRadius: '6px'
//                                 }}
//                                 min={1}
//                               />
//                             </div>
//                           </Col>
//                           <Col span={12}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text style={{ color: theme.textSecondary }}>Final MRR:</Text>
//                               <div style={{ 
//                                 fontWeight: 500, 
//                                 color: theme.textPrimary,
//                                 fontSize: '14px'
//                               }}>
//                                 {costingData.final_MRR || 'N/A'}
//                               </div>
//                             </div>
//                           </Col>
//                           <Col span={12}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text style={{ color: theme.textSecondary }}>Machining Hours:</Text>
//                               <div style={{ 
//                                 fontWeight: 500, 
//                                 color: theme.textPrimary,
//                                 fontSize: '14px'
//                               }}>
//                                 {costingData.machining_hours || 'N/A'}
//                               </div>
//                             </div>
//                           </Col>
//                         </Row>
//                       </div>

//                       <Divider style={{ 
//                         margin: '20px 0',
//                         borderColor: theme.borderColor
//                       }} />

//                       {/* Cost Summary */}
//                       <div>
//                         <Title level={5} style={{ 
//                           color: theme.primary, 
//                           marginBottom: '16px',
//                           fontSize: '16px',
//                           fontWeight: 600
//                         }}>
//                           Cost Summary
//                         </Title>
//                         <Row gutter={[16, 16]}>
//                           <Col span={12}>
//                             <div style={{
//                               padding: '16px',
//                               background: theme.lightBlue,
//                               borderRadius: '8px',
//                               border: `1px solid ${theme.primary}33`
//                             }}>
//                               <Statistic 
//                                 title={<span style={{ color: theme.textSecondary }}>Cost Per Unit</span>} 
//                                 value={costingData.cost_per_unit || 'N/A'} 
//                                 valueStyle={{ 
//                                   color: theme.primary, 
//                                   fontWeight: 600,
//                                   fontSize: '20px'
//                                 }}
//                               />
//                             </div>
//                           </Col>
//                           <Col span={12}>
//                             <div style={{
//                               padding: '16px',
//                               background: '#f6ffed',
//                               borderRadius: '8px',
//                               border: `1px solid ${theme.success}33`
//                             }}>
//                               <Statistic 
//                                 title={<span style={{ color: theme.textSecondary }}>Total Cost</span>} 
//                                 value={costingData.total_cost || (costingData.cost_per_unit && quantity ? (parseFloat(costingData.cost_per_unit.replace(/[^\d.]/g, '')) * quantity).toFixed(2) : 'N/A')} 
//                                 valueStyle={{ 
//                                   color: theme.success, 
//                                   fontWeight: 600, 
//                                   fontSize: '24px'
//                                 }}
//                               />
//                             </div>
//                           </Col>
//                         </Row>
//                       </div>
//                     </>
//                   ) : (
//                     <div style={{ 
//                       textAlign: 'center', 
//                       padding: '40px 0',
//                       color: theme.textSecondary
//                     }}>
//                       <Text style={{ color: theme.textSecondary, fontSize: '16px' }}>
//                         No costing data available
//                       </Text>
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             </Col>
//           </Row>
//         </div>
//       </Content>
//     </Layout>
//   );
// }

// export default ViewerPage;





// import React, { useEffect, useRef, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { Layout, Typography, Card, Row, Col, Divider, Statistic, Button, Input, Select, message } from 'antd';
// import * as THREE from 'three';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// const { Content } = Layout;
// const { Title, Text } = Typography;
// const { Option } = Select;

// // Updated lighter theme for better visibility
// const theme = {
//   primary: '#1890ff',
//   secondary: '#096dd9',
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
//   accent: '#1890ff',
//   inputBg: '#ffffff',
//   inputBorder: '#d9d9d9',
//   modelBg: '#f8f9fa'
// };

// function ViewerPage() {
//   const location = useLocation();
//   const canvasRef = useRef(null);
//   const [isModelLoaded, setIsModelLoaded] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const [quantity, setQuantity] = useState(1);
//   const [machineType, setMachineType] = useState('5 Axis');
//   const [costData, setCostData] = useState(null);
//   const [isCalculating, setIsCalculating] = useState(false);

//   // Extract data from location state
//   const { 
//     objUrl, 
//     originalFilename, 
//     materialName, 
//     density,
//     analysisData // This contains the response from the analyze endpoint
//   } = location.state || {};

//   // Machine type options
//   const machineTypes = [
//     '2 Axis',
//     '3 Axis',
//     '4 Axis',
//     '5 Axis',
//     'Multi-Axis'
//   ];

//   // Function to calculate cost
//   const calculateCost = async () => {
//     if (!analysisData) {
//       message.error('No analysis data available');
//       return;
//     }

//     setIsCalculating(true);

//     try {
//       // Prepare form data for the calculate-cost endpoint
//       const formData = new FormData();
//       formData.append('filename', analysisData.filename);
//       formData.append('material_id', analysisData.material_id);
//       formData.append('material_name', analysisData.material_name);
//       formData.append('density', analysisData.density);
//       formData.append('quantity', quantity);
//       formData.append('actual_length', analysisData.actual_dimensions.length);
//       formData.append('actual_breadth', analysisData.actual_dimensions.breadth);
//       formData.append('actual_height', analysisData.actual_dimensions.height);
//       formData.append('actual_volume_mm3', analysisData.actual_dimensions.volume_mm3);
//       formData.append('actual_volume_m3', analysisData.actual_dimensions.volume_m3);
//       formData.append('stock_length', analysisData.stock_dimensions.length);
//       formData.append('stock_breadth', analysisData.stock_dimensions.breadth);
//       formData.append('stock_height', analysisData.stock_dimensions.height);
//       formData.append('stock_volume_mm3', analysisData.stock_dimensions.volume_mm3);
//       formData.append('stock_volume_m3', analysisData.stock_dimensions.volume_m3);
//       formData.append('delta_x', analysisData.raw_extra.δX);
//       formData.append('delta_y', analysisData.raw_extra.δY);
//       formData.append('delta_z', analysisData.raw_extra.δZ);
//       formData.append('machine_type', machineType);

//       const response = await fetch('http://localhost:5678/calculate-cost/', {
//         method: 'POST',
//         body: formData
//       });

//       if (!response.ok) {
//         throw new Error('Failed to calculate cost');
//       }

//       const result = await response.json();
//       setCostData(result);
//       message.success('Cost calculated successfully');
//     } catch (error) {
//       console.error('Error calculating cost:', error);
//       message.error('Failed to calculate cost');
//     } finally {
//       setIsCalculating(false);
//     }
//   };

//   // Auto-calculate cost when component mounts or when machine type changes
//   useEffect(() => {
//     if (analysisData && machineType) {
//       calculateCost();
//     }
//   }, [analysisData, machineType]);

//   // Set up the Three.js scene
//   useEffect(() => {
//     if (!objUrl || !canvasRef.current) {
//       setIsError(true);
//       return;
//     }

//     let scene, camera, renderer, controls;
//     let frameId = null;

//     const init = () => {
//       scene = new THREE.Scene();
//       scene.background = new THREE.Color(0xf8f9fa);

//       const width = canvasRef.current.clientWidth;
//       const height = canvasRef.current.clientHeight;

//       camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
//       camera.position.z = 5;

//       renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.current });
//       renderer.setSize(width, height);
//       renderer.shadowMap.enabled = true;
//       renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//       controls = new OrbitControls(camera, renderer.domElement);
//       controls.enableDamping = true;
//       controls.dampingFactor = 0.05;

//       const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//       scene.add(ambientLight);

//       const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
//       directionalLight.position.set(5, 5, 5);
//       directionalLight.castShadow = true;
//       directionalLight.shadow.mapSize.width = 2048;
//       directionalLight.shadow.mapSize.height = 2048;
//       scene.add(directionalLight);

//       const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
//       directionalLight2.position.set(-5, 5, -5);
//       scene.add(directionalLight2);

//       const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.4);
//       directionalLight3.position.set(0, -5, 0);
//       scene.add(directionalLight3);

//       const loader = new OBJLoader();
//       loader.load(
//         objUrl,
//         (object) => {
//           const box = new THREE.Box3().setFromObject(object);
//           const center = box.getCenter(new THREE.Vector3());
//           const size = box.getSize(new THREE.Vector3());

//           object.position.x = -center.x;
//           object.position.y = -center.y;
//           object.position.z = -center.z;

//           const maxDim = Math.max(size.x, size.y, size.z);
//           camera.position.z = maxDim * 2.5;

//           object.traverse((child) => {
//             if (child instanceof THREE.Mesh) {
//               child.material = new THREE.MeshStandardMaterial({
//                 color: 0xb8b8b8,
//                 roughness: 0.25,
//                 metalness: 0.5,
//                 emissive: 0x0f0f0f,
//                 emissiveIntensity: 0.03
//               });
//               child.castShadow = true;
//               child.receiveShadow = true;
//             }
//           });

//           scene.add(object);
//           setIsModelLoaded(true);
//         },
//         undefined,
//         (error) => {
//           console.error('Error loading model:', error);
//           setIsError(true);
//         }
//       );

//       const handleResize = () => {
//         if (!canvasRef.current) return;

//         const width = canvasRef.current.clientWidth;
//         const height = canvasRef.current.clientHeight;

//         camera.aspect = width / height;
//         camera.updateProjectionMatrix();
//         renderer.setSize(width, height);
//       };

//       window.addEventListener('resize', handleResize);

//       return { scene, camera, renderer, controls, handleResize };
//     };

//     const animate = () => {
//       frameId = requestAnimationFrame(animate);

//       controls.update();
//       renderer.render(scene, camera);
//     };

//     const { handleResize } = init();
//     animate();

//     return () => {
//       cancelAnimationFrame(frameId);
//       window.removeEventListener('resize', handleResize);

//       if (renderer) {
//         renderer.dispose();
//       }
//     };
//   }, [objUrl]);

//   const handlePrintReport = () => {
//     window.print();
//   };

//   const calculateTotalCost = () => {
//     if (!costData?.cost_per_unit || !quantity) return 'N/A';

//     const costPerUnit = parseFloat(costData.cost_per_unit.toString().replace(/[^\d.]/g, ''));
//     if (isNaN(costPerUnit)) return 'N/A';

//     return `₹${(costPerUnit * quantity).toFixed(2)}`;
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
//         background: 'linear-gradient(to right, #0f172a, #111827, #0f172a)',
//         padding: '0 40px', 
//         display: 'flex', 
//         alignItems: 'center', 
//         justifyContent: 'space-between',
//         boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(6, 182, 212, 0.2)',
//         borderBottom: '4px solid #06b6d4',
//         position: 'sticky',
//         top: 0,
//         zIndex: 1000
//       }}>
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
//             COST ESTIMATION
//           </Title>
//         </div>

//         <div style={{ 
//           color: '#ffffff', 
//           fontSize: '14px',
//           textAlign: 'right',
//           opacity: 0.9,
//           textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
//         }}>

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
//                 title={
//                   <span style={{ 
//                     color: theme.primary, 
//                     fontSize: '18px',
//                     fontWeight: 600
//                   }}>
//                     3D Model Viewer
//                   </span>
//                 }
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
//                 {isError ? (
//                   <div style={{ 
//                     display: 'flex', 
//                     alignItems: 'center', 
//                     justifyContent: 'center', 
//                     height: '100%',
//                     flexDirection: 'column',
//                     padding: '20px'
//                   }}>
//                     <Text style={{ 
//                       fontSize: '16px', 
//                       marginBottom: '8px',
//                       color: theme.error
//                     }}>
//                       Error loading the 3D model
//                     </Text>
//                     <Text style={{ color: theme.textSecondary }}>
//                       There was a problem loading the 3D model. Please try again or contact support.
//                     </Text>
//                   </div>
//                 ) : (
//                   <canvas 
//                     ref={canvasRef} 
//                     style={{ 
//                       width: '100%', 
//                       height: '100%',
//                       borderRadius: '0 0 8px 8px'
//                     }}
//                   />
//                 )}
//                 {!isModelLoaded && !isError && (
//                   <div style={{ 
//                     position: 'absolute', 
//                     top: '50%', 
//                     left: '50%', 
//                     transform: 'translate(-50%, -50%)',
//                     textAlign: 'center'
//                   }}>
//                     <div style={{
//                       border: `4px solid ${theme.primary}33`,
//                       borderTop: `4px solid ${theme.primary}`,
//                       borderRadius: '50%',
//                       width: '60px',
//                       height: '60px',
//                       animation: 'spin 1s linear infinite',
//                       margin: '0 auto 20px'
//                     }} />
//                     <Text style={{ 
//                       color: theme.primary,
//                       fontSize: '16px',
//                       fontWeight: 500
//                     }}>
//                       Loading 3D model...
//                     </Text>
//                     <style>{`
//                       @keyframes spin {
//                         0% { transform: rotate(0deg); }
//                         100% { transform: rotate(360deg); }
//                       }
//                     `}</style>
//                   </div>
//                 )}
//               </Card>
//             </Col>

//             {/* Cost Report Section */}
//             <Col xs={24} lg={12} style={{ height: '100%' }}>
//               <Card 
//                 title={
//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <span style={{ 
//                       color: theme.primary, 
//                       fontSize: '18px',
//                       fontWeight: 600
//                     }}>
//                       Manufacturing Cost Report
//                     </span>
//                     <Button 
//                       type="primary" 
//                       onClick={handlePrintReport}
//                       style={{
//                         borderRadius: '6px',
//                         height: '40px',
//                         fontWeight: 500
//                       }}
//                     >
//                       Print Report
//                     </Button>
//                   </div>
//                 }
//                 style={{ 
//                   height: '100%', 
//                   boxShadow: theme.shadow,
//                   borderRadius: '8px',
//                   overflow: 'hidden',
//                   background: theme.cardBg,
//                   border: `1px solid ${theme.borderColor}`
//                 }}
//                 bodyStyle={{ 
//                   background: theme.cardBg,
//                   color: theme.textPrimary,
//                   height: 'calc(100% - 65px)',
//                   overflow: 'auto'
//                 }}
//               >
//                 <div style={{ overflow: 'auto', height: '100%' }}>
//                   {analysisData ? (
//                     <>
//                       {/* File Information */}
//                       <div style={{ marginBottom: '24px' }}>
//                         <Title level={5} style={{ 
//                           color: theme.primary, 
//                           marginBottom: '16px',
//                           fontSize: '16px',
//                           fontWeight: 600
//                         }}>
//                           File Information
//                         </Title>
//                         <div style={{ marginBottom: '12px' }}>
//                           <Text style={{ color: theme.textSecondary }}>Filename:</Text>
//                           <div style={{ 
//                             fontWeight: 500, 
//                             color: theme.textPrimary,
//                             fontSize: '14px'
//                           }}>
//                             {analysisData.filename || 'N/A'}
//                           </div>
//                         </div>
//                       </div>

//                       <Divider style={{ 
//                         margin: '20px 0',
//                         borderColor: theme.borderColor
//                       }} />

//                       {/* Material Information */}
//                       <div style={{ marginBottom: '24px' }}>
//                         <Title level={5} style={{ 
//                           color: theme.primary, 
//                           marginBottom: '16px',
//                           fontSize: '16px',
//                           fontWeight: 600
//                         }}>
//                           Material Information
//                         </Title>
//                         <Row gutter={[16, 16]}>
//                           <Col span={12}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text style={{ color: theme.textSecondary }}>Material:</Text>
//                               <div style={{ 
//                                 fontWeight: 500, 
//                                 color: theme.textPrimary,
//                                 fontSize: '14px'
//                               }}>
//                                 {analysisData.material_name || 'N/A'}
//                               </div>
//                             </div>
//                           </Col>
//                           <Col span={12}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text style={{ color: theme.textSecondary }}>Density:</Text>
//                               <div style={{ 
//                                 fontWeight: 500, 
//                                 color: theme.textPrimary,
//                                 fontSize: '14px'
//                               }}>
//                                 {analysisData.density ? `${analysisData.density} kg/m³` : 'N/A'}
//                               </div>
//                             </div>
//                           </Col>
//                         </Row>
//                       </div>

//                       <Divider style={{ 
//                         margin: '20px 0',
//                         borderColor: theme.borderColor
//                       }} />

//                       {/* Model Dimensions */}
//                       <div style={{ marginBottom: '24px' }}>
//                         <Title level={5} style={{ 
//                           color: theme.primary, 
//                           marginBottom: '16px',
//                           fontSize: '16px',
//                           fontWeight: 600
//                         }}>
//                           Model Dimensions
//                         </Title>
//                         <Row gutter={[16, 16]}>
//                           <Col span={24}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text style={{ color: theme.textSecondary }}>Volume (m³):</Text>
//                               <div style={{ 
//                                 fontWeight: 500, 
//                                 color: theme.textPrimary,
//                                 fontSize: '14px'
//                               }}>
//                                 {analysisData.actual_dimensions?.volume_m3 || 'N/A'}
//                               </div>
//                             </div>
//                           </Col>
//                           <Col span={8}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text style={{ color: theme.textSecondary }}>Length:</Text>
//                               <div style={{ 
//                                 fontWeight: 500, 
//                                 color: theme.textPrimary,
//                                 fontSize: '14px'
//                               }}>
//                                 {analysisData.stock_dimensions?.length ? `${analysisData.stock_dimensions.length} mm` : 'N/A'}
//                               </div>
//                             </div>
//                           </Col>
//                           <Col span={8}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text style={{ color: theme.textSecondary }}>Breadth:</Text>
//                               <div style={{ 
//                                 fontWeight: 500, 
//                                 color: theme.textPrimary,
//                                 fontSize: '14px'
//                               }}>
//                                 {analysisData.stock_dimensions?.breadth ? `${analysisData.stock_dimensions.breadth} mm` : 'N/A'}
//                               </div>
//                             </div>
//                           </Col>
//                           <Col span={8}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text style={{ color: theme.textSecondary }}>Height:</Text>
//                               <div style={{ 
//                                 fontWeight: 500, 
//                                 color: theme.textPrimary,
//                                 fontSize: '14px'
//                               }}>
//                                 {analysisData.stock_dimensions?.height ? `${analysisData.stock_dimensions.height} mm` : 'N/A'}
//                               </div>
//                             </div>
//                           </Col>
//                           <Col span={12}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text style={{ color: theme.textSecondary }}>Stock Volume (mm³):</Text>
//                               <div style={{ 
//                                 fontWeight: 500, 
//                                 color: theme.textPrimary,
//                                 fontSize: '14px'
//                               }}>
//                                 {analysisData.stock_dimensions?.volume_mm3 || 'N/A'}
//                               </div>
//                             </div>
//                           </Col>
//                           <Col span={12}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text style={{ color: theme.textSecondary }}>Stock Volume (m³):</Text>
//                               <div style={{ 
//                                 fontWeight: 500, 
//                                 color: theme.textPrimary,
//                                 fontSize: '14px'
//                               }}>
//                                 {analysisData.stock_dimensions?.volume_m3 || 'N/A'}
//                               </div>
//                             </div>
//                           </Col>
//                         </Row>
//                       </div>

//                       <Divider style={{ 
//                         margin: '20px 0',
//                         borderColor: theme.borderColor
//                       }} />

//                       {/* Manufacturing Settings */}
//                       <div style={{ marginBottom: '24px' }}>
//                         <Title level={5} style={{ 
//                           color: theme.primary, 
//                           marginBottom: '16px',
//                           fontSize: '16px',
//                           fontWeight: 600
//                         }}>
//                           Manufacturing Settings
//                         </Title>
//                         <Row gutter={[16, 16]}>
//                           <Col span={12}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text style={{ color: theme.textSecondary }}>Machine Type:</Text>
//                               <Select
//                                 value={machineType}
//                                 onChange={setMachineType}
//                                 style={{ 
//                                   width: '100%', 
//                                   marginTop: '4px' 
//                                 }}
//                                 loading={isCalculating}
//                               >
//                                 {machineTypes.map(type => (
//                                   <Option key={type} value={type}>{type}</Option>
//                                 ))}
//                               </Select>
//                             </div>
//                           </Col>
//                           <Col span={12}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text style={{ color: theme.textSecondary }}>Quantity:</Text>
//                               <Input
//                                 type="number"
//                                 value={quantity}
//                                 onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
//                                 style={{
//                                   marginTop: '4px',
//                                   borderRadius: '6px'
//                                 }}
//                                 min={1}
//                               />
//                             </div>
//                           </Col>
//                         </Row>
//                       </div>

//                       <Divider style={{ 
//                         margin: '20px 0',
//                         borderColor: theme.borderColor
//                       }} />

//                       {/* Cost Summary */}
//                       <div>
//                         <Title level={5} style={{ 
//                           color: theme.primary, 
//                           marginBottom: '16px',
//                           fontSize: '16px',
//                           fontWeight: 600
//                         }}>
//                           Cost Summary
//                         </Title>

//                         {isCalculating ? (
//                           <div style={{ 
//                             textAlign: 'center', 
//                             padding: '40px 0',
//                             color: theme.textSecondary
//                           }}>
//                             <div style={{
//                               border: `4px solid ${theme.primary}33`,
//                               borderTop: `4px solid ${theme.primary}`,
//                               borderRadius: '50%',
//                               width: '40px',
//                               height: '40px',
//                               animation: 'spin 1s linear infinite',
//                               margin: '0 auto 16px'
//                             }} />
//                             <Text style={{ color: theme.primary, fontSize: '16px' }}>
//                               Calculating cost...
//                             </Text>
//                           </div>
//                         ) : costData ? (
//                           <Row gutter={[16, 16]}>
//                             <Col span={12}>
//                               <div style={{
//                                 padding: '16px',
//                                 background: theme.lightBlue,
//                                 borderRadius: '8px',
//                                 border: `1px solid ${theme.primary}33`
//                               }}>
//                                 <Statistic 
//                                   title={<span style={{ color: theme.textSecondary }}>Cost Per Hour</span>} 
//                                   value={costData.cost_per_hour || 'N/A'} 
//                                   valueStyle={{ 
//                                     color: theme.primary, 
//                                     fontWeight: 600,
//                                     fontSize: '18px'
//                                   }}
//                                 />
//                               </div>
//                             </Col>
//                             <Col span={12}>
//                               <div style={{
//                                 padding: '16px',
//                                 background: theme.lightBlue,
//                                 borderRadius: '8px',
//                                 border: `1px solid ${theme.primary}33`
//                               }}>
//                                 <Statistic 
//                                   title={<span style={{ color: theme.textSecondary }}>Cost Per Unit</span>} 
//                                   value={costData.cost_per_unit || 'N/A'} 
//                                   valueStyle={{ 
//                                     color: theme.primary, 
//                                     fontWeight: 600,
//                                     fontSize: '18px'
//                                   }}
//                                 />
//                               </div>
//                             </Col>
//                             <Col span={24}>
//                               <div style={{
//                                 padding: '16px',
//                                 background: '#f6ffed',
//                                 borderRadius: '8px',
//                                 border: `1px solid ${theme.success}33`
//                               }}>
//                                 <Statistic 
//                                   title={<span style={{ color: theme.textSecondary }}>Total Cost</span>} 
//                                   value={costData.total_cost || 'N/A'} 
//                                   valueStyle={{ 
//                                     color: theme.success, 
//                                     fontWeight: 600, 
//                                     fontSize: '24px'
//                                   }}
//                                 />
//                               </div>
//                             </Col>
//                           </Row>
//                         ) : (
//                           <div style={{ 
//                             textAlign: 'center', 
//                             padding: '40px 0',
//                             color: theme.textSecondary
//                           }}>
//                             <Text style={{ color: theme.textSecondary, fontSize: '16px' }}>
//                               No cost data available
//                             </Text>
//                           </div>
//                         )}
//                       </div>
//                     </>
//                   ) : (
//                     <div style={{ 
//                       textAlign: 'center', 
//                       padding: '40px 0',
//                       color: theme.textSecondary
//                     }}>
//                       <Text style={{ color: theme.textSecondary, fontSize: '16px' }}>
//                         No analysis data available
//                       </Text>
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             </Col>
//           </Row>
//         </div>
//       </Content>
//     </Layout>
//   );
// }

// export default ViewerPage;


import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout, Typography, Card, Row, Col, Divider, Statistic, Button, Input, Select, message } from 'antd';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { toPng, toJpeg } from 'html-to-image';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;



const theme = {
  primary: '#1890ff',
  secondary: '#096dd9',
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
  accent: '#1890ff',
  inputBg: '#ffffff',
  inputBorder: '#d9d9d9',
  modelBg: '#f8f9fa'
};

function ViewerPage() {
  const location = useLocation();
  const canvasRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [machineType, setMachineType] = useState('5 Axis');
  const [costData, setCostData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const {
    objUrl,
    analysisData
  } = location.state || {};

  const machineTypes = [
    '2 Axis',
    '3 Axis',
    '4 Axis',
    '5 Axis',
    'Multi-Axis'
  ];

  const calculateCost = async () => {
    if (!analysisData) {
      message.error('No analysis data available');
      return;
    }

    setIsCalculating(true);

    try {
      const formData = new FormData();
      formData.append('filename', analysisData.filename);
      formData.append('material_id', analysisData.material_id);
      formData.append('material_name', analysisData.material_name);
      formData.append('density', analysisData.density);
      formData.append('quantity', quantity);
      formData.append('actual_length', analysisData.actual_dimensions.length);
      formData.append('actual_breadth', analysisData.actual_dimensions.breadth);
      formData.append('actual_height', analysisData.actual_dimensions.height);
      formData.append('actual_volume_mm3', analysisData.actual_dimensions.volume_mm3);
      formData.append('actual_volume_m3', analysisData.actual_dimensions.volume_m3);
      formData.append('stock_length', analysisData.stock_dimensions.length);
      formData.append('stock_breadth', analysisData.stock_dimensions.breadth);
      formData.append('stock_height', analysisData.stock_dimensions.height);
      formData.append('stock_volume_mm3', analysisData.stock_dimensions.volume_mm3);
      formData.append('stock_volume_m3', analysisData.stock_dimensions.volume_m3);
      formData.append('delta_x', analysisData.raw_extra.δX);
      formData.append('delta_y', analysisData.raw_extra.δY);
      formData.append('delta_z', analysisData.raw_extra.δZ);
      formData.append('machine_type', machineType);

      const response = await fetch('http://localhost:5678/calculate-cost/', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to calculate cost');
      }

      const result = await response.json();
      setCostData(result);
      message.success('Cost calculated successfully');
    } catch (error) {
      console.error('Error calculating cost:', error);
      message.error('Failed to calculate cost');
    } finally {
      setIsCalculating(false);
    }
  };

  // const updateMaterialCost = async () => {
  //   if (!costData?.id) {
  //     message.error('No cost data available');
  //     return;
  //   }

  //   setIsCalculating(true);

  //   try {
  //     const response = await fetch(`http://localhost:5678/update-material-cost/${costData.id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'accept': 'application/json'
  //       }
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to update material cost');
  //     }

  //     const result = await response.json();
  //     setCostData(prev => ({
  //       ...prev,
  //       with_material_cost: result.with_material_cost || prev.with_material_cost,
  //       total_cost: prev.total_cost,
  //       material_cost: result.material_cost || prev.material_cost
  //     }));
  //     message.success('Material cost updated successfully');
  //   } catch (error) {
  //     console.error('Error updating material cost:', error);
  //     message.error('Failed to update material cost');
  //   } finally {
  //     setIsCalculating(false);
  //   }
  // };

  const updateMaterialCost = async () => {
    if (!costData?.id) {
      message.error('No cost data available');
      return;
    }

    setIsCalculating(true);

    try {
      const response = await fetch(`http://localhost:5678/update-material-cost/${costData.id}`, {
        method: 'PUT',
        headers: {
          'accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to update material cost');
      }

      const result = await response.json();
      setCostData(prev => ({
        ...prev,
        total_cost: result.total_cost_without_material || prev.total_cost,
        with_material_cost: result.with_material_cost || prev.with_material_cost,
        material_cost: result.material_cost || prev.material_cost,
        material_name: result.material_name || prev.material_name,
        stock_mass_kg: result.stock_mass_kg || prev.stock_mass_kg,
        material_cost_per_kg: result.material_cost_per_kg || prev.material_cost_per_kg
      }));
      message.success('Material cost updated successfully');
    } catch (error) {
      console.error('Error updating material cost:', error);
      message.error('Failed to update material cost');
    } finally {
      setIsCalculating(false);
    }
  };
  const updateQuantity = async (newQuantity) => {
    if (!costData?.id) {
      message.error('No cost data available');
      return;
    }

    setIsCalculating(true);

    try {
      const formData = new URLSearchParams();
      formData.append('new_quantity', newQuantity);

      const response = await fetch(`http://localhost:5678/update-quantity/${costData.id}`, {
        method: 'PUT',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      const result = await response.json();
      setCostData(prev => ({
        ...prev,
        total_cost: result.updated_total_cost || prev.total_cost,
        with_material_cost: result.updated_with_material_cost || prev.with_material_cost,
        cost_per_unit: (result.updated_total_cost / newQuantity) || prev.cost_per_unit
      }));
      setQuantity(newQuantity);
      message.success('Quantity updated successfully');
    } catch (error) {
      console.error('Error updating quantity:', error);
      message.error('Failed to update quantity');
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    if (analysisData && machineType) {
      calculateCost();
    }
  }, [analysisData, machineType]);

  useEffect(() => {
    if (!objUrl || !canvasRef.current) {
      setIsError(true);
      return;
    }

    let scene, camera, renderer, controls;
    let frameId = null;

    const init = () => {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf8f9fa);

      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;

      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvasRef.current,
        alpha: true
      });
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
      directionalLight.position.set(5, 5, 5);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      scene.add(directionalLight);

      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
      directionalLight2.position.set(-5, 5, -5);
      scene.add(directionalLight2);

      const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.4);
      directionalLight3.position.set(0, -5, 0);
      scene.add(directionalLight3);

      const loader = new OBJLoader();
      loader.load(
        objUrl,
        (object) => {
          const box = new THREE.Box3().setFromObject(object);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          object.position.x = -center.x;
          object.position.y = -center.y;
          object.position.z = -center.z;

          const maxDim = Math.max(size.x, size.y, size.z);
          camera.position.z = maxDim * 2.5;

          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0xb8b8b8,
                roughness: 0.25,
                metalness: 0.5,
                emissive: 0x0f0f0f,
                emissiveIntensity: 0.03
              });
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          scene.add(object);
          setIsModelLoaded(true);
        },
        undefined,
        (error) => {
          console.error('Error loading model:', error);
          setIsError(true);
        }
      );

      const handleResize = () => {
        if (!canvasRef.current) return;

        const width = canvasRef.current.clientWidth;
        const height = canvasRef.current.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener('resize', handleResize);

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener('resize', handleResize);
        if (renderer) {
          renderer.dispose();
        }
      };
    };

    init();
  }, [objUrl]);

  // Replace your handlePrintReport function with this:
  const pdfRef = useRef();

  const handleDownloadPDF = async () => {
    try {
      message.loading('Generating PDF report...', 0);

      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);

      // Load a standard font (no need for external font files)
      const font = await pdfDoc.embedFont(PDFDocument.Font.Helvetica);

      // Capture 3D Viewer section
      const viewerElement = document.querySelector('.ant-col-lg-12:first-child .ant-card');
      const viewerDataUrl = await toPng(viewerElement, {
        quality: 1,
        pixelRatio: 2,
        skipFonts: true,
      });

      // Capture Cost Report section
      const reportElement = document.querySelector('.ant-col-lg-12:last-child .ant-card');
      const reportDataUrl = await toPng(reportElement, {
        quality: 1,
        pixelRatio: 2,
        skipFonts: true,
      });

      // Add a new page for the 3D viewer (landscape)
      const viewerPage = pdfDoc.addPage([842, 595]); // A4 landscape

      // Embed the 3D viewer image
      const viewerImage = await pdfDoc.embedPng(viewerDataUrl);
      const viewerDims = viewerImage.scaleToFit(800, 400);
      viewerPage.drawImage(viewerImage, {
        x: 20,
        y: viewerPage.getHeight() - viewerDims.height - 20,
        width: viewerDims.width,
        height: viewerDims.height,
      });

      // Add a new page for the cost report (landscape)
      const reportPage = pdfDoc.addPage([842, 595]); // A4 landscape

      // Embed the cost report image
      const reportImage = await pdfDoc.embedPng(reportDataUrl);
      const reportDims = reportImage.scaleToFit(800, 500);
      reportPage.drawImage(reportImage, {
        x: 20,
        y: reportPage.getHeight() - reportDims.height - 20,
        width: reportDims.width,
        height: reportDims.height,
      });

      // Add metadata and footer
      const now = new Date();
      const formattedDate = now.toLocaleString();

      // Add footer to each page
      [viewerPage, reportPage].forEach((page, index) => {
        page.drawText(`Page ${index + 1} | Generated: ${formattedDate}`, {
          x: 50,
          y: 30,
          size: 10,
          font,
          color: rgb(0.5, 0.5, 0.5),
        });
      });

      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Cost_Estimation_Report_${now.getTime()}.pdf`;
      link.click();

      message.destroy();
      message.success('PDF report downloaded successfully');
    } catch (error) {
      console.error('PDF generation error:', error);
      message.destroy();
      message.error('Failed to generate PDF report');
    }
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value) || 1;
    setQuantity(newQuantity);
    updateQuantity(newQuantity);
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A';
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
    return `₹${numValue.toFixed(2)}`;
  };

  const formatVolume = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return parseFloat(value).toExponential(4);
  };

  return (
    <Layout style={{
      minHeight: '100vh',
      width: '100vw',
      background: theme.background,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        height: '80px',
        background: 'linear-gradient(to right, #0f172a, #111827, #0f172a)',
        padding: '0 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(6, 182, 212, 0.2)',
        borderBottom: '4px solid #06b6d4',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
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
            COST ESTIMATION
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
            {/* 3D Viewer Section */}
            <Col xs={24} lg={12} style={{ height: '100%' }}>
              <Card
                title={
                  <span style={{ color: theme.primary, fontSize: '18px', fontWeight: 600 }}>
                    3D Model Viewer
                  </span>
                }
                style={{
                  height: '100%',
                  boxShadow: theme.shadow,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: theme.cardBg,
                  border: `1px solid ${theme.borderColor}`
                }}
                bodyStyle={{
                  padding: '0',
                  height: 'calc(100% - 65px)',
                  position: 'relative',
                  background: theme.modelBg
                }}
              >
                <canvas
                  ref={canvasRef}
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'block'
                  }}
                />
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
                    background: 'rgba(255, 255, 255, 0.8)'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        border: `4px solid ${theme.primary}33`,
                        borderTop: `4px solid ${theme.primary}`,
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 16px'
                      }} />
                      <Text style={{ color: theme.primary }}>Loading 3D model...</Text>
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
                    background: 'rgba(255, 255, 255, 0.8)'
                  }}>
                    <Text style={{ color: theme.error }}>Failed to load 3D model</Text>
                  </div>
                )}
              </Card>
            </Col>

            {/* Cost Report Section */}
            <Col xs={24} lg={12} style={{ height: '100%' }}>
              <Card
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: theme.primary, fontSize: '18px', fontWeight: 600 }}>
                      Manufacturing Cost Report
                    </span>
                    <div ref={pdfRef}>
                      {/* Your existing content */}
                      <Button
                        type="primary"
                        onClick={handleDownloadPDF}
                        style={{ borderRadius: '6px', height: '40px', fontWeight: 500 }}
                      >
                        Download PDF Report
                      </Button>
                    </div>
                  </div>
                }
                style={{
                  height: '100%',
                  boxShadow: theme.shadow,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: theme.cardBg,
                  border: `1px solid ${theme.borderColor}`
                }}
                bodyStyle={{
                  background: theme.cardBg,
                  color: theme.textPrimary,
                  height: 'calc(100% - 65px)',
                  overflow: 'auto'
                }}
              >
                <div style={{ overflow: 'auto', height: '100%' }}>
                  {analysisData ? (
                    <>
                      {/* File Information */}
                      <div style={{ marginBottom: '24px' }}>
                        <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
                          File Information
                        </Title>
                        <div style={{ marginBottom: '12px' }}>
                          <Text style={{ color: theme.textSecondary }}>Filename:</Text>
                          <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
                            {costData?.filename || analysisData.filename || 'N/A'}
                          </div>
                        </div>
                      </div>

                      <Divider style={{ margin: '20px 0', borderColor: theme.borderColor }} />

                      {/* Material Information */}
                      <div style={{ marginBottom: '24px' }}>
                        <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
                          Material Information
                        </Title>
                        <Row gutter={[16, 16]}>
                          <Col span={12}>
                            <div style={{ marginBottom: '12px' }}>
                              <Text style={{ color: theme.textSecondary }}>Material:</Text>
                              <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
                                {costData?.material || analysisData.material_name || 'N/A'}
                              </div>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div style={{ marginBottom: '12px' }}>
                              <Text style={{ color: theme.textSecondary }}>Density:</Text>
                              <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
                                {analysisData.density ? `${analysisData.density} kg/m³` : 'N/A'}
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <Divider style={{ margin: '20px 0', borderColor: theme.borderColor }} />

                      {/* Model Dimensions */}
                      {/* Model Dimensions */}
                      {/* Model Dimensions */}
                      <div style={{ marginBottom: '24px' }}>
                        <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
                          Model Dimensions
                        </Title>

                        {/* Actual Dimensions Section */}
                        <div style={{
                          background: '#e6f7ff', // Light blue background
                          padding: '12px 16px',
                          borderRadius: '8px',
                          marginBottom: '16px',
                          borderLeft: `4px solid ${theme.primary}` // Blue accent border
                        }}>
                          <Text strong style={{
                            color: theme.primary,
                            fontSize: '15px',
                            marginBottom: '12px',
                            display: 'block'
                          }}>
                            ACTUAL DIMENSIONS
                          </Text>
                          <Row gutter={[16, 16]}>
                            <Col span={24}>
                              <div style={{ marginBottom: '12px' }}>
                                <Text style={{ color: theme.textSecondary }}>Volume (mm³):</Text>
                                <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
                                  {analysisData.actual_dimensions?.volume_mm3 || 'N/A'}
                                </div>
                              </div>
                            </Col>
                            <Col span={8}>
                              <div style={{ marginBottom: '12px' }}>
                                <Text style={{ color: theme.textSecondary }}>Length:</Text>
                                <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
                                  {analysisData.actual_dimensions?.length ? `${analysisData.actual_dimensions.length} mm` : 'N/A'}
                                </div>
                              </div>
                            </Col>
                            <Col span={8}>
                              <div style={{ marginBottom: '12px' }}>
                                <Text style={{ color: theme.textSecondary }}>Breadth:</Text>
                                <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
                                  {analysisData.actual_dimensions?.breadth ? `${analysisData.actual_dimensions.breadth} mm` : 'N/A'}
                                </div>
                              </div>
                            </Col>
                            <Col span={8}>
                              <div style={{ marginBottom: '12px' }}>
                                <Text style={{ color: theme.textSecondary }}>Height:</Text>
                                <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
                                  {analysisData.actual_dimensions?.height ? `${analysisData.actual_dimensions.height} mm` : 'N/A'}
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </div>

                        {/* Stock Dimensions Section */}
                        <div style={{
                          background: '#f6ffed', // Light green background
                          padding: '12px 16px',
                          borderRadius: '8px',
                          borderLeft: `4px solid ${theme.success}` // Green accent border
                        }}>
                          <Text strong style={{
                            color: theme.success,
                            fontSize: '15px',
                            marginBottom: '12px',
                            display: 'block'
                          }}>
                            STOCK DIMENSIONS
                          </Text>
                          <Row gutter={[16, 16]}>
                            <Col span={24}>
                              <div style={{ marginBottom: '12px' }}>
                                <Text style={{ color: theme.textSecondary }}>Volume (mm³):</Text>
                                <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
                                  {analysisData.stock_dimensions?.volume_mm3 || 'N/A'}
                                </div>
                              </div>
                            </Col>
                            <Col span={8}>
                              <div style={{ marginBottom: '12px' }}>
                                <Text style={{ color: theme.textSecondary }}>Length:</Text>
                                <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
                                  {analysisData.stock_dimensions?.length ? `${analysisData.stock_dimensions.length} mm` : 'N/A'}
                                </div>
                              </div>
                            </Col>
                            <Col span={8}>
                              <div style={{ marginBottom: '12px' }}>
                                <Text style={{ color: theme.textSecondary }}>Breadth:</Text>
                                <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
                                  {analysisData.stock_dimensions?.breadth ? `${analysisData.stock_dimensions.breadth} mm` : 'N/A'}
                                </div>
                              </div>
                            </Col>
                            <Col span={8}>
                              <div style={{ marginBottom: '12px' }}>
                                <Text style={{ color: theme.textSecondary }}>Height:</Text>
                                <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
                                  {analysisData.stock_dimensions?.height ? `${analysisData.stock_dimensions.height} mm` : 'N/A'}
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </div>


                      <Divider style={{ margin: '20px 0', borderColor: theme.borderColor }} />

                      {/* Manufacturing Settings */}
                      <div style={{ marginBottom: '24px' }}>
                        <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
                          Manufacturing Settings
                        </Title>
                        <Row gutter={[16, 16]}>
                          <Col span={12}>
                            <div style={{ marginBottom: '12px' }}>
                              <Text style={{ color: theme.textSecondary }}>Machine Type:</Text>
                              <Select
                                value={costData?.machine_type || machineType}
                                onChange={setMachineType}
                                style={{ width: '100%', marginTop: '4px' }}
                                loading={isCalculating}
                              >
                                {machineTypes.map(type => (
                                  <Option key={type} value={type}>{type}</Option>
                                ))}
                              </Select>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div style={{ marginBottom: '12px' }}>
                              <Text style={{ color: theme.textSecondary }}>Quantity:</Text>
                              <Input
                                type="number"
                                value={quantity}
                                onChange={handleQuantityChange}
                                style={{ marginTop: '4px', borderRadius: '6px' }}
                                min={1}
                              />
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <Divider style={{ margin: '20px 0', borderColor: theme.borderColor }} />

                      {/* Cost Summary */}
                      <div>
                        <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
                          Cost Summary
                        </Title>

                        {isCalculating ? (
                          <div style={{ textAlign: 'center', padding: '40px 0', color: theme.textSecondary }}>
                            <div style={{
                              border: `4px solid ${theme.primary}33`,
                              borderTop: `4px solid ${theme.primary}`,
                              borderRadius: '50%',
                              width: '40px',
                              height: '40px',
                              animation: 'spin 1s linear infinite',
                              margin: '0 auto 16px'
                            }} />
                            <Text style={{ color: theme.primary, fontSize: '16px' }}>
                              Calculating cost...
                            </Text>
                          </div>
                        ) : costData ? (
                          <>
                            <Row gutter={[16, 16]}>

                              <Col span={24}>
                                <div style={{
                                  padding: '16px',
                                  background: theme.lightBlue,
                                  borderRadius: '8px',
                                  border: `1px solid ${theme.primary}33`
                                }}>
                                  <Statistic
                                    title={<span style={{ color: theme.textSecondary }}>Machining Cost Per Unit</span>}
                                    value={formatCurrency(costData.cost_per_unit)}
                                    valueStyle={{ color: theme.primary, fontWeight: 600, fontSize: '20px' }}
                                  />
                                </div>
                              </Col>
                              <Col span={24}>
                                <div style={{
                                  padding: '16px',
                                  background: '#f6ffed',
                                  borderRadius: '8px',
                                  border: `1px solid ${theme.success}33`
                                }}>
                                  <Statistic
                                    title={<span style={{ color: theme.textSecondary }}>Total Machining Cost</span>}
                                    value={formatCurrency(costData.total_cost)}
                                    valueStyle={{ color: theme.success, fontWeight: 600, fontSize: '20px' }}
                                  />
                                </div>
                              </Col>
                              {costData.with_material_cost && (
                                <Col span={24}>
                                  <div style={{
                                    padding: '16px',
                                    background: '#e6f7ff',
                                    borderRadius: '8px',
                                    border: `1px solid ${theme.primary}33`
                                  }}>
                                    <Statistic
                                      title={<span style={{ color: theme.textSecondary }}>Total machining cost with material cost</span>}
                                      value={formatCurrency(costData.with_material_cost)}
                                      valueStyle={{ color: theme.primary, fontWeight: 600, fontSize: '22px' }}
                                    />
                                  </div>
                                </Col>
                              )}
                            </Row>

                            {/* Material Cost Section */}
                            <div style={{ marginTop: '24px' }}>
                              <Row gutter={[16, 16]}>
                                <Col span={24}>
                                  <Button
                                    type="primary"
                                    onClick={updateMaterialCost}
                                    style={{ width: '100%' }}
                                    loading={isCalculating}
                                  >
                                    Update Material Cost
                                  </Button>
                                </Col>
                                {costData.material_cost && (
                                  <Col span={24}>
                                    <div style={{
                                      padding: '16px',
                                      background: '#fff7e6',
                                      borderRadius: '8px',
                                      border: `1px solid ${theme.warning}33`
                                    }}>
                                      <Statistic
                                        title={<span style={{ color: theme.textSecondary }}>Material Cost</span>}
                                        value={formatCurrency(costData.material_cost)}
                                        valueStyle={{ color: theme.warning, fontWeight: 600, fontSize: '18px' }}
                                      />
                                    </div>
                                  </Col>
                                )}
                              </Row>
                            </div>
                          </>
                        ) : (
                          <div style={{ textAlign: 'center', padding: '40px 0', color: theme.textSecondary }}>
                            <Text style={{ color: theme.textSecondary, fontSize: '16px' }}>
                              No cost data available
                            </Text>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: theme.textSecondary }}>
                      <Text style={{ color: theme.textSecondary, fontSize: '16px' }}>
                        No analysis data available
                      </Text>
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}

export default ViewerPage;