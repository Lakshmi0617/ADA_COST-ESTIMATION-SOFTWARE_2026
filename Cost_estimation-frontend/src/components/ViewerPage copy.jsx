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










//this below is the correct working final code'''''''''''''

// import React, { useEffect, useRef, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { Layout, Typography, Card, Row, Col, Divider, Statistic, Button, Input, Select, message, Modal } from 'antd';
// import * as THREE from 'three';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { toPng, toJpeg } from 'html-to-image';
// import jsPDF from 'jspdf';
// import { useNavigate } from 'react-router-dom';
// import { FiArrowLeft } from 'react-icons/fi';

// // Add this CSS for spinner animation (add to your component's style or global CSS)
// const spinnerStyles = `
//   @keyframes spin {
//     0% { transform: rotate(0deg); }
//     100% { transform: rotate(360deg); }
//   }
// `;


// const { Content } = Layout;
// const { Title, Text } = Typography;
// const { Option } = Select;



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
//   const navigate = useNavigate();

//   const { 
//     objUrl, 
//     analysisData
//   } = location.state || {};

//   const machineTypes = [
//     '3 Axis',
//     '4 Axis',
//     '5 Axis',
//   ];

//   const calculateCost = async () => {
//     if (!analysisData) {
//       message.error('No analysis data available');
//       return;
//     }

//     setIsCalculating(true);
    
//     try {
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


//   const updateMaterialCost = async () => {
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
//       total_cost: result.total_cost_without_material || prev.total_cost,
//       with_material_cost: result.with_material_cost || prev.with_material_cost,
//       material_cost: result.material_cost || prev.material_cost,
//       material_name: result.material_name || prev.material_name,
//       stock_mass_kg: result.stock_mass_kg || prev.stock_mass_kg,
//       material_cost_per_kg: result.material_cost_per_kg || prev.material_cost_per_kg
//     }));
//     message.success('Material cost updated successfully');
//   } catch (error) {
//     console.error('Error updating material cost:', error);
//     message.error('Failed to update material cost');
//   } finally {
//     setIsCalculating(false);
//   }
// };
//   const updateQuantity = async (newQuantity) => {
//   if (!costData?.id) {
//     message.error('No cost data available');
//     return;
//   }

//   setIsCalculating(true);
  
//   try {
//     const formData = new URLSearchParams();
//     formData.append('new_quantity', newQuantity);

//     const response = await fetch(`http://localhost:5678/update-quantity/${costData.id}`, {
//       method: 'PUT',
//       headers: {
//         'accept': 'application/json',
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       body: formData
//     });

//     if (!response.ok) {
//       throw new Error('Failed to update quantity');
//     }

//     const result = await response.json();
//     setCostData(prev => ({
//       ...prev,
//       total_cost: result.updated_total_cost || prev.total_cost,
//       with_material_cost: result.updated_with_material_cost || prev.with_material_cost,
//       cost_per_unit: (result.updated_total_cost / newQuantity) || prev.cost_per_unit
//     }));
//     setQuantity(newQuantity);
//     message.success('Quantity updated successfully');
//   } catch (error) {
//     console.error('Error updating quantity:', error);
//     message.error('Failed to update quantity');
//   } finally {
//     setIsCalculating(false);
//   }
// };

//   useEffect(() => {
//     if (analysisData && machineType) {
//       calculateCost();
//     }
//   }, [analysisData, machineType]);

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
      
//       renderer = new THREE.WebGLRenderer({ 
//         antialias: true, 
//         canvas: canvasRef.current,
//         alpha: true
//       });
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
      
//       const animate = () => {
//         frameId = requestAnimationFrame(animate);
//         controls.update();
//         renderer.render(scene, camera);
//       };
      
//       animate();
      
//       return () => {
//         cancelAnimationFrame(frameId);
//         window.removeEventListener('resize', handleResize);
//         if (renderer) {
//           renderer.dispose();
//         }
//       };
//     };
    
//     init();
//   }, [objUrl]);


//   //'''''starting of the download pdf'''''''''''''//
//  // Replace your handlePrintReport function with this:
//  const pdfRef = useRef();
  


// const handleDownloadPDF = async () => {
//   try {
//     message.loading('Generating PDF report...', 0);
    
//     // Helper function to load image as base64
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

//     // Helper function to safely convert to string
//     const safeString = (value) => {
//       if (value === null || value === undefined) return 'N/A';
//       return String(value);
//     };

//     // Load logos
//     let adaLogo = null;
//     let companyLogo = null;
    
//     try {
//       adaLogo = await loadImageAsBase64('/ADA_LOGO.jpg');
//     } catch (error) {
//       console.warn('Could not load ADA logo:', error);
//     }
    
//     try {
//       companyLogo = await loadImageAsBase64('/logo.png');
//     } catch (error) {
//       console.warn('Could not load company logo:', error);
//     }

//     // Create PDF with A4 dimensions
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const pageHeight = pdf.internal.pageSize.getHeight();
//     const margin = 20;
//     const contentWidth = pageWidth - (2 * margin);

//     // Header background - moved much closer to top
//     pdf.setFillColor(15, 23, 42);
//     pdf.rect(0, 10, pageWidth, 25, 'F');
    
//     // Add logos within the header section
//     if (adaLogo) {
//       // Position ADA logo on the left side within the header
//       pdf.addImage(adaLogo, 'JPEG', margin, 12, 20, 20);
//     }
    
//     if (companyLogo) {
//       // Position company logo on the right side within the header
//       pdf.addImage(companyLogo, 'PNG', pageWidth - margin - 20, 12, 20, 20);
//     }

//     // Header text
//     pdf.setTextColor(255, 255, 255);
//     pdf.setFontSize(20);
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('COST ESTIMATION REPORT', pageWidth / 2, 25, { align: 'center' });
    
//     let yPosition = 45;

//     // File Information
//     pdf.setTextColor(0, 0, 0);
//     pdf.setFontSize(14);
//     pdf.setFont('helvetica', 'bold');
//     pdf.text(`Filename: ${safeString(costData?.filename || analysisData?.filename || 'N/A')}`, margin, yPosition);
//     pdf.setFontSize(10);
//     pdf.setFont('helvetica', 'normal');
//     pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, yPosition, { align: 'right' });
    
//     yPosition += 15;

//     // Create main data table
//     const tableData = [];
    
//     // File and Material Information
//     if (analysisData) {
//       tableData.push(['Material', safeString(costData?.material || analysisData.material_name || 'N/A')]);
//       tableData.push(['Density', analysisData.density ? `${safeString(analysisData.density)} kg/m³` : 'N/A']);
      
//       // Actual Dimensions
//       if (analysisData.actual_dimensions) {
//         tableData.push(['', '']); // Empty row for spacing
//         tableData.push(['ACTUAL DIMENSIONS', '']);
       
//         tableData.push(['Volume (mm³)', safeString(analysisData.actual_dimensions.volume_mm3 || 'N/A')]);
//         // tableData.push(['Volume (m³)', safeString(analysisData.actual_dimensions.volume_m3 || 'N/A')]);
//       }

//   if (analysisData.actual_dimensions) {
//         tableData.push(['', '']); // Empty row for spacing
//         tableData.push(['BOUNDING BOX DIMENSIONS', '']);
       
//         tableData.push(['Length', `${safeString(analysisData.actual_dimensions.length || 'N/A')} mm`]);
//         tableData.push(['Breadth', `${safeString(analysisData.actual_dimensions.breadth || 'N/A')} mm`]);
//         tableData.push(['Height', `${safeString(analysisData.actual_dimensions.height || 'N/A')} mm`]);

//         // tableData.push(['Volume (m³)', safeString(analysisData.actual_dimensions.volume_m3 || 'N/A')]);
//       }

    
//     }

//     // Manufacturing Settings
//     tableData.push(['', '']); // Empty row for spacing
//     tableData.push(['MANUFACTURING SETTINGS', '']);
//     tableData.push(['Machine Type', safeString(costData?.machine_type || machineType)]);
//     tableData.push(['Quantity', safeString(quantity)]);

//     // Cost Information
//     if (costData) {
//       tableData.push(['', '']); // Empty row for spacing
//       tableData.push(['COST SUMMARY', '']);
//       tableData.push(['Machining Cost Per Unit', safeString(formatCurrency(costData.cost_per_unit))]);
//       tableData.push(['Total Machining Cost', safeString(formatCurrency(costData.total_cost))]);
      
//       if (costData.material_cost_per_kg) {
//         tableData.push(['Material Cost per kg', `Rs.${parseFloat(costData.material_cost_per_kg).toFixed(2)}`]);
//       }
      
//       if (costData.stock_mass_kg) {
//         tableData.push(['Stock Mass', `${parseFloat(costData.stock_mass_kg).toFixed(3)} kg`]);
//       }
      
//       if (costData.material_cost) {
//         tableData.push(['Material Cost', safeString(formatCurrency(costData.material_cost))]);
//       }
      
//       if (costData.with_material_cost) {
//         tableData.push(['Total Cost (with Material)', safeString(formatCurrency(costData.with_material_cost))]);
//       }
//     }

//     // Create table with adjusted positioning for single page
//     const startY = yPosition;
//     const rowHeight = 5; // Reduced row height for better fit
//     const col1Width = contentWidth * 0.6;
//     const col2Width = contentWidth * 0.4;

//     // Table borders and content
//     let currentY = startY;
    
//     tableData.forEach((row, index) => {
//       const [label, value] = row;
      
//       // Check if it's a section header
//       const isSectionHeader = label && !value && (label.includes('DIMENSIONS') || label.includes('SETTINGS') || label.includes('SUMMARY') || label.includes('EXTRA'));
//       const isEmptyRow = !label && !value;
      
//       if (isEmptyRow) {
//         currentY += rowHeight / 2;
//         return;
//       }

//       // Set styles for section headers
//       if (isSectionHeader) {
//         pdf.setFillColor(240, 248, 255);
//         pdf.rect(margin, currentY - 1, contentWidth, rowHeight, 'F');
//         pdf.setFont('helvetica', 'bold');
//         pdf.setFontSize(9);
//         pdf.setTextColor(24, 144, 255);
//       } else {
//         // Alternate row colors for better readability
//         if (index % 2 === 0) {
//           pdf.setFillColor(248, 248, 248);
//           pdf.rect(margin, currentY - 1, contentWidth, rowHeight, 'F');
//         }
//         pdf.setFont('helvetica', 'normal');
//         pdf.setFontSize(8);
//         pdf.setTextColor(0, 0, 0);
//       }
      
//       // Draw table borders
//       pdf.setDrawColor(200, 200, 200);
//       pdf.rect(margin, currentY - 1, contentWidth, rowHeight);
//       pdf.line(margin + col1Width, currentY - 1, margin + col1Width, currentY + rowHeight - 1);
      
//       // Add text (ensure all values are strings)
//       if (isSectionHeader) {
//         pdf.text(safeString(label), margin + contentWidth / 2, currentY + 2.5, { align: 'center' });
//       } else {
//         pdf.text(safeString(label), margin + 2, currentY + 2.5);
//         pdf.text(safeString(value), margin + col1Width + 2, currentY + 2.5);
//       }
      
//       currentY += rowHeight;
//     });

//     // Footer
//     pdf.setFontSize(8);
//     pdf.setTextColor(150, 150, 150);
//     pdf.text(`Report generated on ${new Date().toLocaleString()}`, margin, pageHeight - 10);
    
//     message.destroy();
    
//     // Show PDF preview before download
//     const previewModal = Modal.confirm({
//       title: 'PDF Preview',
//       width: '80%',
//       icon: null,
//       content: (
//         <div style={{ height: '70vh', overflow: 'hidden' }}>
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
//         // Save PDF when user clicks download
//         const filename = `Cost_Report_${analysisData?.filename?.replace(/\.[^/.]+$/, '') || 'Model'}_${new Date().getTime()}.pdf`;
//         pdf.save(filename);
//         message.success('PDF report downloaded successfully!');
//       },
//       onCancel: () => {
//         // Do nothing, just close the preview
//       }
//     });
    
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     message.destroy();
//     message.error('Failed to generate PDF report');
//   }
// };


// // //''''''''''''''''''''''end of download pdf ''''''''''''''''''
//   const handleQuantityChange = (e) => {
//     const newQuantity = parseInt(e.target.value) || 1;
//     setQuantity(newQuantity);
//     updateQuantity(newQuantity);
//   };

//   const formatCurrency = (value) => {
//     if (value === null || value === undefined) return 'N/A';
//     const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
//     return `Rs.${numValue.toFixed(2)}`;
//   };

//   const formatVolume = (value) => {
//     if (value === null || value === undefined) return 'N/A';
//     return parseFloat(value).toExponential(4);
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

//          <button 
//          onClick={() => navigate('/home')}
//          className="absolute left-4 p-1 rounded-md hover:bg-cyan-400/20 transition-colors duration-300 group"
//          title="Back to Welcome Page"
//          >
//          <FiArrowLeft className="w-10 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
//          </button>

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
//                   <span style={{ color: theme.primary, fontSize: '18px', fontWeight: 600 }}>
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
//                 <canvas 
//                   ref={canvasRef} 
//                   style={{
//                     width: '100%',
//                     height: '100%',
//                     display: 'block'
//                   }}
//                 />
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
//                     background: 'rgba(255, 255, 255, 0.8)'
//                   }}>
//                     <div style={{ textAlign: 'center' }}>
//                       <div style={{
//                         border: `4px solid ${theme.primary}33`,
//                         borderTop: `4px solid ${theme.primary}`,
//                         borderRadius: '50%',
//                         width: '40px',
//                         height: '40px',
//                         animation: 'spin 1s linear infinite',
//                         margin: '0 auto 16px'
//                       }} />
//                       <Text style={{ color: theme.primary }}>Loading 3D model...</Text>
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
//                     background: 'rgba(255, 255, 255, 0.8)'
//                   }}>
//                     <Text style={{ color: theme.error }}>Failed to load 3D model</Text>
//                   </div>
//                 )}
//               </Card>
//             </Col>

//             {/* Cost Report Section */}
//             <Col xs={24} lg={12} style={{ height: '100%' }}>
//               <Card 
//                 title={
//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <span style={{ color: theme.primary, fontSize: '18px', fontWeight: 600 }}>
//                       Manufacturing Cost Report
//                     </span>
//            <div ref={pdfRef}>
//       {/* Your existing content */}
//       <Button 
//         type="primary" 
//         onClick={handleDownloadPDF}
//         style={{ borderRadius: '6px', height: '40px', fontWeight: 500 }}
//       >
//         Download PDF Report
//       </Button>
//     </div>
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
//                         <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
//                           File Information
//                         </Title>
//                         <div style={{ marginBottom: '12px' }}>
//                           <Text style={{ color: theme.textSecondary }}>Filename:</Text>
//                           <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
//                             {costData?.filename || analysisData.filename || 'N/A'}
//                           </div>
//                         </div>
//                       </div>

//                       <Divider style={{ margin: '20px 0', borderColor: theme.borderColor }} />

//                       {/* Material Information */}
//                       <div style={{ marginBottom: '24px' }}>
//                         <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
//                           Material Information
//                         </Title>
//                         <Row gutter={[16, 16]}>
//                           <Col span={12}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text style={{ color: theme.textSecondary }}>Material:</Text>
//                               <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
//                                 {costData?.material || analysisData.material_name || 'N/A'}
//                               </div>
//                             </div>
//                           </Col>
//                           <Col span={12}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text style={{ color: theme.textSecondary }}>Density:</Text>
//                               <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
//                                 {analysisData.density ? `${analysisData.density} kg/m³` : 'N/A'}
//                               </div>
//                             </div>
//                           </Col>
//                         </Row>
//                       </div>

//                       <Divider style={{ margin: '20px 0', borderColor: theme.borderColor }} />

//                       {/* Model Dimensions */}
//                     {/* Model Dimensions */}
// {/* Model Dimensions */}
// <div style={{ marginBottom: '24px' }}>
//   <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
//     Model Dimensions
//   </Title>
  
//   {/* Actual Dimensions Section */}
//   {/* <div style={{ 
//     background: '#e6f7ff', // Light blue background
//     padding: '12px 16px',
//     borderRadius: '8px',
//     marginBottom: '16px',
//     borderLeft: `4px solid ${theme.primary}` // Blue accent border
//   }}>
//     <Text strong style={{ 
//       color: theme.primary,
//       fontSize: '15px',
//       marginBottom: '12px',
//       display: 'block'
//     }}>
//       ACTUAL DIMENSIONS
//     </Text>
//     <Row gutter={[16, 16]}>
//       <Col span={24}>
//         <div style={{ marginBottom: '12px' }}>
//           <Text style={{ color: theme.textSecondary }}>Volume (mm³):</Text>
//           <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
//             {analysisData.actual_dimensions?.volume_mm3 || 'N/A'}
//           </div>
//         </div>
//       </Col>
     
//      <Row gutter={[16, 16]}>
//    <Text strong style={{ 
//       color: theme.primary,
//       fontSize: '15px',
//       marginBottom: '12px',
//       display: 'block'
//     }}>
//       BOUNDING BOX DIMENSIONS
//     </Text>
    
// <Col span={8}>
//         <div style={{ marginBottom: '12px' }}>
//           <Text style={{ color: theme.textSecondary }}>Length:</Text>
//           <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
//             {analysisData.actual_dimensions?.length ? `${analysisData.actual_dimensions.length} mm` : 'N/A'}
//           </div>
//         </div>
//       </Col>
//       <Col span={8}>
//         <div style={{ marginBottom: '12px' }}>
//           <Text style={{ color: theme.textSecondary }}>Breadth:</Text>
//           <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
//             {analysisData.actual_dimensions?.breadth ? `${analysisData.actual_dimensions.breadth} mm` : 'N/A'}
//           </div>
//         </div>
//       </Col>
//       <Col span={8}>
//         <div style={{ marginBottom: '12px' }}>
//           <Text style={{ color: theme.textSecondary }}>Height:</Text>
//           <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
//             {analysisData.actual_dimensions?.height ? `${analysisData.actual_dimensions.height} mm` : 'N/A'}
//           </div>
//         </div>
//       </Col>

//      </Row>
      
//     </Row>
//   </div> */}


//   {/* Actual Dimensions Section */}
// <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
//   <h3 className="text-blue-600 font-semibold mb-2">ACTUAL DIMENSIONS</h3>
  
//   <div className="mb-4">
//     <span className="text-gray-600">Volume (mm³):</span>
//     <div className="font-semibold text-lg">
//       {analysisData.actual_dimensions?.volume_mm3 || 'N/A'}
//     </div>
//   </div>

//   <h4 className="text-blue-600 font-semibold mb-2">BOUNDING BOX DIMENSIONS</h4>
  
//   <div className="flex gap-8">
//     <div>
//       <span className="text-gray-600">Breadth:</span>
//       <div className="font-semibold">
//         {analysisData.actual_dimensions?.breadth ? `${analysisData.actual_dimensions.breadth} mm` : 'N/A'}
//       </div>
//     </div>
    
//     <div>
//       <span className="text-gray-600">Height:</span>
//       <div className="font-semibold">
//         {analysisData.actual_dimensions?.height ? `${analysisData.actual_dimensions.height} mm` : 'N/A'}
//       </div>
//     </div>
    
//     <div>
//       <span className="text-gray-600">Length:</span>
//       <div className="font-semibold">
//         {analysisData.actual_dimensions?.length ? `${analysisData.actual_dimensions.length} mm` : 'N/A'}
//       </div>
//     </div>
//   </div>
// </div>

//   {/* Stock Dimensions Section */}
//   {/* <div style={{ 
//     background: '#f6ffed', // Light green background
//     padding: '12px 16px',
//     borderRadius: '8px',
//     borderLeft: `4px solid ${theme.success}` // Green accent border
//   }}>
//     <Text strong style={{ 
//       color: theme.success,
//       fontSize: '15px',
//       marginBottom: '12px',
//       display: 'block'
//     }}>
//       STOCK DIMENSIONS
//     </Text>
//     <Row gutter={[16, 16]}>
//       <Col span={24}>
//         <div style={{ marginBottom: '12px' }}>
//           <Text style={{ color: theme.textSecondary }}>Volume (mm³):</Text>
//           <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
//             {analysisData.stock_dimensions?.volume_mm3 || 'N/A'}
//           </div>
//         </div>
//       </Col>
//       <Col span={8}>
//         <div style={{ marginBottom: '12px' }}>
//           <Text style={{ color: theme.textSecondary }}>Length:</Text>
//           <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
//             {analysisData.stock_dimensions?.length ? `${analysisData.stock_dimensions.length} mm` : 'N/A'}
//           </div>
//         </div>
//       </Col>
//       <Col span={8}>
//         <div style={{ marginBottom: '12px' }}>
//           <Text style={{ color: theme.textSecondary }}>Breadth:</Text>
//           <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
//             {analysisData.stock_dimensions?.breadth ? `${analysisData.stock_dimensions.breadth} mm` : 'N/A'}
//           </div>
//         </div>
//       </Col>
//       <Col span={8}>
//         <div style={{ marginBottom: '12px' }}>
//           <Text style={{ color: theme.textSecondary }}>Height:</Text>
//           <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
//             {analysisData.stock_dimensions?.height ? `${analysisData.stock_dimensions.height} mm` : 'N/A'}
//           </div>
//         </div>
//       </Col>
//     </Row>
//   </div> */}
//   <div style={{ 
//     background: '#f6ffed', // Light green background
//     padding: '12px 16px',
//     borderRadius: '8px',
//     borderLeft: `4px solid ${theme.success}` // Green accent border
//   }}>
//     <Text strong style={{ 
//       color: theme.success,
//       fontSize: '15px',
//       marginBottom: '12px',
//       display: 'block'
//     }}>
//       STOCK DIMENSIONS
//     </Text>
//     <Row gutter={[16, 16]}>
//       <Col span={24}>
//         <div style={{ marginBottom: '12px' }}>
//           <Text style={{ color: theme.textSecondary }}>Volume (mm³):</Text>
//           <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
//             {analysisData.stock_dimensions?.volume_mm3 || 'N/A'}
//           </div>
//         </div>
//       </Col>
//     </Row>
    
//     {/* Recommended Bounding Box Dimensions Heading */}
//     <Text strong style={{ 
//       color: theme.success,
//       fontSize: '14px',
//       marginBottom: '12px',
//       display: 'block',
//       marginTop: '8px'
//     }}>
//       RECOMMENDED BOUNDING BOX DIMENSIONS
//     </Text>
    
//     <Row gutter={[16, 16]}>
//       <Col span={8}>
//         <div style={{ marginBottom: '12px' }}>
//           <Text style={{ color: theme.textSecondary }}>Length:</Text>
//           <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
//             {analysisData.stock_dimensions?.length ? `${analysisData.stock_dimensions.length} mm` : 'N/A'}
//           </div>
//         </div>
//       </Col>
//       <Col span={8}>
//         <div style={{ marginBottom: '12px' }}>
//           <Text style={{ color: theme.textSecondary }}>Breadth:</Text>
//           <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
//             {analysisData.stock_dimensions?.breadth ? `${analysisData.stock_dimensions.breadth} mm` : 'N/A'}
//           </div>
//         </div>
//       </Col>
//       <Col span={8}>
//         <div style={{ marginBottom: '12px' }}>
//           <Text style={{ color: theme.textSecondary }}>Height:</Text>
//           <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
//             {analysisData.stock_dimensions?.height ? `${analysisData.stock_dimensions.height} mm` : 'N/A'}
//           </div>
//         </div>
//       </Col>
//     </Row>
//   </div>
// </div>


//                       <Divider style={{ margin: '20px 0', borderColor: theme.borderColor }} />

//                       {/* Manufacturing Settings */}
//                       <div style={{ marginBottom: '24px' }}>
//                         <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
//                           Manufacturing Settings
//                         </Title>
//                         <Row gutter={[16, 16]}>
//                           <Col span={12}>
//                             <div style={{ marginBottom: '12px' }}>
//                               <Text style={{ color: theme.textSecondary }}>Machine Type:</Text>
//                               <Select
//                                 value={costData?.machine_type || machineType}
//                                 onChange={setMachineType}
//                                 style={{ width: '100%', marginTop: '4px' }}
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
//                                 onChange={handleQuantityChange}
//                                 style={{ marginTop: '4px', borderRadius: '6px' }}
//                                 min={1}
//                               />
//                             </div>
//                           </Col>
//                         </Row>
//                       </div>

//                       <Divider style={{ margin: '20px 0', borderColor: theme.borderColor }} />

//                       {/* Cost Summary */}
//                       <div>
//                         <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
//                           Cost Summary
//                         </Title>
                        
//                         {isCalculating ? (
//                           <div style={{ textAlign: 'center', padding: '40px 0', color: theme.textSecondary }}>
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
//                           <>
//                             <Row gutter={[16, 16]}>
                      
//                               <Col span={24}>
//                                 <div style={{
//                                   padding: '16px',
//                                   background: theme.lightBlue,
//                                   borderRadius: '8px',
//                                   border: `1px solid ${theme.primary}33`
//                                 }}>
//                                   <Statistic 
//                                     title={<span style={{ color: theme.textSecondary }}>Machining Cost Per Unit</span>} 
//                                     value={formatCurrency(costData.cost_per_unit)} 
//                                     valueStyle={{ color: theme.primary, fontWeight: 600, fontSize: '20px' }}
//                                   />
//                                 </div>
//                               </Col>
//                               <Col span={24}>
//                                 <div style={{
//                                   padding: '16px',
//                                   background: '#f6ffed',
//                                   borderRadius: '8px',
//                                   border: `1px solid ${theme.success}33`
//                                 }}>
//                                   <Statistic 
//                                     title={<span style={{ color: theme.textSecondary }}>Total Machining Cost</span>} 
//                                     value={formatCurrency(costData.total_cost)} 
//                                     valueStyle={{ color: theme.success, fontWeight: 600, fontSize: '20px' }}
//                                   />
//                                 </div>
//                               </Col>
//                               {costData.with_material_cost && (
//                                 <Col span={24}>
//                                   <div style={{
//                                     padding: '16px',
//                                     background: '#e6f7ff',
//                                     borderRadius: '8px',
//                                     border: `1px solid ${theme.primary}33`
//                                   }}>
//                                     <Statistic 
//                                       title={<span style={{ color: theme.textSecondary }}>Total machining cost with material cost</span>} 
//                                       value={formatCurrency(costData.with_material_cost)} 
//                                       valueStyle={{ color: theme.primary, fontWeight: 600, fontSize: '22px' }}
//                                     />
//                                   </div>
//                                 </Col>
//                               )}
//                             </Row>
                            
//                             {/* Material Cost Section */}
//                             <div style={{ marginTop: '24px' }}>
//                               <Row gutter={[16, 16]}>
//                                 <Col span={24}>
//                                   <Button 
//                                     type="primary" 
//                                     onClick={updateMaterialCost}
//                                     style={{ width: '100%' }}
//                                     loading={isCalculating}
//                                   >
//                                     Update Material Cost
//                                   </Button>
//                                 </Col>
//                                 {costData.material_cost && (
//                                   <Col span={24}>
//                                     <div style={{
//                                       padding: '16px',
//                                       background: '#fff7e6',
//                                       borderRadius: '8px',
//                                       border: `1px solid ${theme.warning}33`
//                                     }}>
//                                       <Statistic 
//                                         title={<span style={{ color: theme.textSecondary }}>Material Cost</span>} 
//                                         value={formatCurrency(costData.material_cost)} 
//                                         valueStyle={{ color: theme.warning, fontWeight: 600, fontSize: '18px' }}
//                                       />
//                                     </div>
//                                   </Col>
//                                 )}
//                               </Row>
//                             </div>
//                           </>
//                         ) : (
//                           <div style={{ textAlign: 'center', padding: '40px 0', color: theme.textSecondary }}>
//                             <Text style={{ color: theme.textSecondary, fontSize: '16px' }}>
//                               No cost data available
//                             </Text>
//                           </div>
//                         )}
//                       </div>
//                     </>
//                   ) : (
//                     <div style={{ textAlign: 'center', padding: '40px 0', color: theme.textSecondary }}>
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







//''''''this  is correct code where the calculated cost display separated as another  component


// import React, { useEffect, useRef, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { Layout, Typography, Card, Row, Col, Divider, message } from 'antd';
// import * as THREE from 'three';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { useNavigate } from 'react-router-dom';
// import { FiArrowLeft } from 'react-icons/fi';
// import CostReport from './CostReport';

// const { Content } = Layout;
// const { Title, Text } = Typography;

//   const theme = {
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
//     front: '#FF0000',    // Red for front face
//     back: '#808080',     // Gray
//     top: '#808080',      // Gray
//     bottom: '#808080',   // Gray
//     left: '#808080',     // Gray
//     right: '#808080'     // Gray
//   }
// };

// function ViewerPage() {
//   const location = useLocation();
//   const canvasRef = useRef(null);
//   const controlsRef = useRef(null);
//   const cameraRef = useRef(null);
//   const [isModelLoaded, setIsModelLoaded] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const navigate = useNavigate();

//   const { 
//     objUrl, 
//     analysisData
//   } = location.state || {};

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
//       camera.position.set(100, 100, 100); 
//       cameraRef.current = camera;
      
//       renderer = new THREE.WebGLRenderer({ 
//         antialias: true, 
//         canvas: canvasRef.current,
//         alpha: true
//       });
//       renderer.setSize(width, height);
//       renderer.shadowMap.enabled = true;
//       renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      
//       controls = new OrbitControls(camera, renderer.domElement);
//       controls.enableDamping = true;
//       controls.dampingFactor = 0.05;
//       controls.enableZoom = true;           // Enable zoom
//       controls.zoomSpeed = 1.0;            // Adjust zoom speed
//       controlsRef.current = controls;
      
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
          
//           // Set camera limits based on model size
//           controls.minDistance = maxDim * 1.5;  // Set minimum zoom distance
//           controls.maxDistance = maxDim * 4;    // Set maximum zoom distance
          
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
      
//       const animate = () => {
//         frameId = requestAnimationFrame(animate);
//         controls.update();
//         renderer.render(scene, camera);
//       };
      
//       animate();
      
//       return () => {
//         cancelAnimationFrame(frameId);
//         window.removeEventListener('resize', handleResize);
//         if (renderer) {
//           renderer.dispose();
//         }
//       };
//     };
    
//     init();
//   }, [objUrl]);

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
//         background: `linear-gradient(135deg, ${theme.headerBg}, ${theme.secondary})`,
//         padding: '0 40px', 
//         display: 'flex', 
//         alignItems: 'center', 
//         justifyContent: 'space-between',
//         boxShadow: '0 8px 32px rgba(20, 93, 160, 0.3), 0 0 0 1px rgba(20, 93, 160, 0.2)',
//         borderBottom: `4px solid ${theme.headerBg}`,
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
//           title="Back to Welcome Page"
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
//             COST ESTIMATION
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
//                 title={
//                   <span style={{ color: theme.primary, fontSize: '18px', fontWeight: 600 }}>
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
//                 <div style={{ position: 'relative', width: '100%', height: '100%' }}>
//                   <canvas 
//                     ref={canvasRef} 
//                     style={{
//                       width: '100%',
//                       height: '100%',
//                       display: 'block'
//                     }}
//                   />
                  
//                   {/* Navigation Cube */}
//                   <div style={{
//                     position: 'absolute',
//                     top: '10px',
//                     right: '10px',
//                     width: '120px',
//                     height: '120px',
//                     display: isModelLoaded ? 'block' : 'none',
//                     background: 'rgba(255,255,255,0.95)',
//                     backdropFilter: 'blur(12px)',
//                     borderRadius: '16px',
//                     boxShadow: '0 8px 32px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.05)',
//                     border: '1px solid rgba(255,255,255,0.8)',
//                     transition: 'all 0.3s ease',
//                     transform: 'translateZ(0)',
//                     WebkitFontSmoothing: 'antialiased'
//                   }}>
//                     {/* Arrow Controls */}
//                     <div style={{
//                       position: 'absolute',
//                       width: '100%',
//                       height: '100%',
//                       pointerEvents: 'none'
//                     }}>
//                       {/* Top Arrow */}
//                       <button
//                         onClick={() => {
//                           if (controlsRef.current && cameraRef.current) {
//                             const cam = cameraRef.current;
//                             const controls = controlsRef.current;
                            
//                             // Get current spherical coordinates
//                             const radius = cam.position.length();
//                             const theta = Math.atan2(cam.position.x, cam.position.z);
//                             const phi = Math.acos(cam.position.y / radius);
                            
//                             // Rotate up (decrease phi)
//                             const newPhi = Math.max(0.1, phi - Math.PI / 8);
                            
//                             // Convert back to Cartesian coordinates
//                             cam.position.x = radius * Math.sin(newPhi) * Math.sin(theta);
//                             cam.position.y = radius * Math.cos(newPhi);
//                             cam.position.z = radius * Math.sin(newPhi) * Math.cos(theta);
                            
//                             cam.lookAt(0, 0, 0);
//                             controls.update();
//                           }
//                         }}
//                         style={{
//                           position: 'absolute',
//                           top: 0,
//                           left: '50%',
//                           transform: 'translateX(-50%)',
//                           width: '24px',
//                           height: '24px',
//                           background: 'rgba(255,255,255,0.8)',
//                           border: '1px solid rgba(0,0,0,0.2)',
//                           borderRadius: '50%',
//                           cursor: 'pointer',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           pointerEvents: 'auto'
//                         }}
//                       >
//                         ↑
//                       </button>

//                       {/* Bottom Arrow */}
//                       <button
//                         onClick={() => {
//                           if (controlsRef.current && cameraRef.current) {
//                             const cam = cameraRef.current;
//                             const controls = controlsRef.current;
                            
//                             const startPos = cam.position.clone();
//                             const radius = startPos.length();
//                             const theta = Math.atan2(startPos.x, startPos.z);
//                             const phi = Math.acos(startPos.y / radius);
//                             const endPhi = Math.min(Math.PI - 0.1, phi + Math.PI / 4);
                            
//                             const duration = 1000;
//                             const start = performance.now();
                            
//                             function animate(currentTime) {
//                               const elapsed = currentTime - start;
//                               const progress = Math.min(elapsed / duration, 1);
                              
//                               // Smooth easing
//                               const easeProgress = 1 - Math.pow(1 - progress, 3);
                              
//                               const currentPhi = phi + (endPhi - phi) * easeProgress;
                              
//                               cam.position.x = radius * Math.sin(currentPhi) * Math.sin(theta);
//                               cam.position.y = radius * Math.cos(currentPhi);
//                               cam.position.z = radius * Math.sin(currentPhi) * Math.cos(theta);
                              
//                               cam.lookAt(0, 0, 0);
//                               controls.update();
                              
//                               if (progress < 1) {
//                                 requestAnimationFrame(animate);
//                               }
//                             }
                            
//                             requestAnimationFrame(animate);
//                           }
//                         }}
//                         style={{
//                           position: 'absolute',
//                           bottom: 0,
//                           left: '50%',
//                           transform: 'translateX(-50%)',
//                           width: '24px',
//                           height: '24px',
//                           background: 'rgba(255,255,255,0.8)',
//                           border: '1px solid rgba(0,0,0,0.2)',
//                           borderRadius: '50%',
//                           cursor: 'pointer',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           pointerEvents: 'auto'
//                         }}
//                       >
//                         ↓
//                       </button>

//                       {/* Left Arrow */}
//                       <button
//                         onClick={() => {
//                           if (controlsRef.current && cameraRef.current) {
//                             const cam = cameraRef.current;
//                             const controls = controlsRef.current;
                            
//                             const startPos = cam.position.clone();
//                             const radius = startPos.length();
//                             const startTheta = Math.atan2(startPos.x, startPos.z);
//                             const phi = Math.acos(startPos.y / radius);
//                             const endTheta = startTheta + Math.PI / 2;
                            
//                             const duration = 1000;
//                             const start = performance.now();
                            
//                             function animate(currentTime) {
//                               const elapsed = currentTime - start;
//                               const progress = Math.min(elapsed / duration, 1);
                              
//                               // Smooth easing
//                               const easeProgress = 1 - Math.pow(1 - progress, 3);
                              
//                               const currentTheta = startTheta + (endTheta - startTheta) * easeProgress;
                              
//                               cam.position.x = radius * Math.sin(phi) * Math.sin(currentTheta);
//                               cam.position.y = radius * Math.cos(phi);
//                               cam.position.z = radius * Math.sin(phi) * Math.cos(currentTheta);
                              
//                               cam.lookAt(0, 0, 0);
//                               controls.update();
                              
//                               if (progress < 1) {
//                                 requestAnimationFrame(animate);
//                               }
//                             }
                            
//                             requestAnimationFrame(animate);
//                           }
//                         }}
//                         style={{
//                           position: 'absolute',
//                           left: 0,
//                           top: '50%',
//                           transform: 'translateY(-50%)',
//                           width: '24px',
//                           height: '24px',
//                           background: 'rgba(255,255,255,0.8)',
//                           border: '1px solid rgba(0,0,0,0.2)',
//                           borderRadius: '50%',
//                           cursor: 'pointer',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           pointerEvents: 'auto'
//                         }}
//                       >
//                         ←
//                       </button>

//                       {/* Right Arrow */}
//                       <button
//                         onClick={() => {
//                           if (controlsRef.current && cameraRef.current) {
//                             const cam = cameraRef.current;
//                             const controls = controlsRef.current;
                            
//                             const startPos = cam.position.clone();
//                             const startRotation = controls.getAzimuthalAngle();
//                             const endRotation = startRotation - Math.PI / 2;
                            
//                             const duration = 1000;
//                             const start = performance.now();
                            
//                             function animate(currentTime) {
//                               const elapsed = currentTime - start;
//                               const progress = Math.min(elapsed / duration, 1);
                              
//                               // Smooth easing
//                               const easeProgress = 1 - Math.pow(1 - progress, 3);
                              
//                               const currentRotation = startRotation + (endRotation - startRotation) * easeProgress;
//                               const radius = startPos.length();
                              
//                               cam.position.x = radius * Math.sin(currentRotation);
//                               cam.position.z = radius * Math.cos(currentRotation);
                              
//                               cam.lookAt(0, 0, 0);
//                               controls.update();
                              
//                               if (progress < 1) {
//                                 requestAnimationFrame(animate);
//                               }
//                             }
                            
//                             requestAnimationFrame(animate);
//                           }
//                         }}
//                         style={{
//                           position: 'absolute',
//                           right: 0,
//                           top: '50%',
//                           transform: 'translateY(-50%)',
//                           width: '24px',
//                           height: '24px',
//                           background: 'rgba(255,255,255,0.8)',
//                           border: '1px solid rgba(0,0,0,0.2)',
//                           borderRadius: '50%',
//                           cursor: 'pointer',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           pointerEvents: 'auto'
//                         }}
//                       >
//                         →
//                       </button>
//                     </div>

//                     <div id="navigation-cube" style={{
//                       position: 'relative',
//                       width: '80px',
//                       height: '80px',
//                       margin: '20px',
//                       perspective: '1200px',
//                       transformStyle: 'preserve-3d',
//                       transform: cameraRef.current ? 
//                         `rotateX(${Math.atan2(-cameraRef.current.position.y, 
//                           Math.sqrt(cameraRef.current.position.x ** 2 + cameraRef.current.position.z ** 2))}rad) 
//                          rotateY(${Math.atan2(-cameraRef.current.position.x, -cameraRef.current.position.z)}rad)
//                          scale3d(1.1, 1.1, 1.1)` 
//                         : 'none',
//                       transition: 'transform 0.3s ease-out',
//                       transformOrigin: 'center center',
//                       animation: 'float 6s ease-in-out infinite'
//                     }}>
//                       {/* Front face */}
//                       <div
//                         onClick={() => {
//                           if (controlsRef.current && cameraRef.current) {
//                             const cam = cameraRef.current;
//                             const distance = cam.position.length();
//                             cam.position.set(0, 0, distance);
//                             cam.lookAt(0, 0, 0);
//                             controlsRef.current.update();
//                           }
//                         }}
//                         style={{
//                           position: 'absolute',
//                           width: '100%',
//                           height: '100%',
//                           background: 'linear-gradient(135deg, #ff6b6b, #ee5253)',
//                           transform: 'translateZ(40px)',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           cursor: 'pointer',
//                           borderRadius: '8px',
//                           border: '1px solid rgba(255,255,255,0.2)',
//                           boxShadow: 'inset 0 0 15px rgba(0,0,0,0.2)',
//                           transition: 'all 0.3s ease',
//                           backfaceVisibility: 'hidden',
//                           fontSize: '12px'
//                         }}
//                       >
//                         <span style={{ color: 'white', fontWeight: 'bold' }}>FRONT</span>
//                       </div>

//                       {/* Back face */}
//                       <div
//                         onClick={() => {
//                           if (controlsRef.current && cameraRef.current) {
//                             controlsRef.current.reset();
//                             const cam = cameraRef.current;
//                             cam.position.set(0, 0, -Math.abs(cam.position.z));
//                             cam.lookAt(0, 0, 0);
//                           }
//                         }}
//                         style={{
//                           position: 'absolute',
//                           width: '100%',
//                           height: '100%',
//                           background: 'linear-gradient(135deg, #a8b0bc, #8395a7)',
//                           transform: 'translateZ(-40px) rotateY(180deg)',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           cursor: 'pointer',
//                           borderRadius: '8px',
//                           border: '1px solid rgba(255,255,255,0.2)',
//                           boxShadow: 'inset 0 0 15px rgba(0,0,0,0.2)',
//                           transition: 'all 0.3s ease',
//                           backfaceVisibility: 'hidden',
//                           fontSize: '12px'
//                         }}
//                       >
//                         <span style={{ color: 'white', fontWeight: 'bold' }}>BACK</span>
//                       </div>

//                       {/* Right face */}
//                       <div
//                         onClick={() => {
//                           if (controlsRef.current && cameraRef.current) {
//                             controlsRef.current.reset();
//                             const cam = cameraRef.current;
//                             cam.position.set(Math.abs(cam.position.z), 0, 0);
//                             cam.lookAt(0, 0, 0);
//                           }
//                         }}
//                         style={{
//                           position: 'absolute',
//                           width: '100%',
//                           height: '100%',
//                           background: 'linear-gradient(135deg, #a8b0bc, #8395a7)',
//                           transform: 'translateX(40px) rotateY(90deg)',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           cursor: 'pointer',
//                           borderRadius: '8px',
//                           border: '1px solid rgba(255,255,255,0.2)',
//                           boxShadow: 'inset 0 0 15px rgba(0,0,0,0.2)',
//                           transition: 'all 0.3s ease',
//                           backfaceVisibility: 'hidden',
//                           fontSize: '12px'
//                         }}
//                       >
//                         <span style={{ color: 'white', fontWeight: 'bold' }}>RIGHT</span>
//                       </div>

//                       {/* Left face */}
//                       <div
//                         onClick={() => {
//                           if (controlsRef.current && cameraRef.current) {
//                             controlsRef.current.reset();
//                             const cam = cameraRef.current;
//                             cam.position.set(-Math.abs(cam.position.z), 0, 0);
//                             cam.lookAt(0, 0, 0);
//                           }
//                         }}
//                         style={{
//                           position: 'absolute',
//                           width: '100%',
//                           height: '100%',
//                           background: theme.cubeColors.left,
//                           transform: 'translateX(-40px) rotateY(-90deg)',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           cursor: 'pointer',
//                           borderRadius: '4px',
//                           border: '1px solid rgba(0,0,0,0.2)'
//                         }}
//                       >
//                         <span style={{ color: 'white', fontWeight: 'bold' }}>LEFT</span>
//                       </div>

//                       {/* Top face */}
//                       <div
//                         onClick={() => {
//                           if (controlsRef.current && cameraRef.current) {
//                             controlsRef.current.reset();
//                             const cam = cameraRef.current;
//                             cam.position.set(0, Math.abs(cam.position.z), 0);
//                             cam.lookAt(0, 0, 0);
//                             cam.up.set(0, 0, -1);
//                           }
//                         }}
//                         style={{
//                           position: 'absolute',
//                           width: '100%',
//                           height: '100%',
//                           background: theme.cubeColors.top,
//                           transform: 'translateY(-40px) rotateX(90deg)',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           cursor: 'pointer',
//                           borderRadius: '4px',
//                           border: '1px solid rgba(0,0,0,0.2)'
//                         }}
//                       >
//                         <span style={{ color: 'white', fontWeight: 'bold' }}>TOP</span>
//                       </div>

//                       {/* Bottom face */}
//                       <div
//                         onClick={() => {
//                           if (controlsRef.current && cameraRef.current) {
//                             controlsRef.current.reset();
//                             const cam = cameraRef.current;
//                             cam.position.set(0, -Math.abs(cam.position.z), 0);
//                             cam.lookAt(0, 0, 0);
//                             cam.up.set(0, 0, 1);
//                           }
//                         }}
//                         style={{
//                           position: 'absolute',
//                           width: '100%',
//                           height: '100%',
//                           background: theme.cubeColors.bottom,
//                           transform: 'translateY(40px) rotateX(-90deg)',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           cursor: 'pointer',
//                           borderRadius: '4px',
//                           border: '1px solid rgba(0,0,0,0.2)'
//                         }}
//                       >
//                         <span style={{ color: 'white', fontWeight: 'bold' }}>BOTTOM</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Full Screen Button */}
//                   <button
//                     onClick={() => {
//                       const elem = document.documentElement;
//                       if (!document.fullscreenElement) {
//                         elem.requestFullscreen().catch(err => {
//                           console.error(`Error attempting to enable full-screen mode: ${err.message}`);
//                         });
//                       } else {
//                         document.exitFullscreen();
//                       }
//                     }}
//                     style={{
//                       position: 'absolute',
//                       bottom: '10px',
//                       right: '10px',
//                       background: 'rgba(255,255,255,0.8)',
//                       border: 'none',
//                       borderRadius: '4px',
//                       padding: '8px',
//                       cursor: 'pointer',
//                       display: isModelLoaded ? 'flex' : 'none',
//                       alignItems: 'center',
//                       justifyContent: 'center'
//                     }}
//                     title="Toggle Full Screen"
//                   >
//                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                       <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
//                     </svg>
//                   </button>
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
//                     background: 'rgba(255, 255, 255, 0.8)'
//                   }}>
//                     <div style={{ textAlign: 'center' }}>
//                       <div style={{
//                         border: `4px solid ${theme.primary}33`,
//                         borderTop: `4px solid ${theme.primary}`,
//                         borderRadius: '50%',
//                         width: '40px',
//                         height: '40px',
//                         animation: 'spin 1s linear infinite',
//                         margin: '0 auto 16px'
//                       }} />
//                       <Text style={{ color: theme.primary }}>Loading 3D model...</Text>
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
//                     background: 'rgba(255, 255, 255, 0.8)'
//                   }}>
//                     <Text style={{ color: theme.error }}>Failed to load 3D model</Text>
//                   </div>
//                 )}
//               </Card>
//             </Col>

//             {/* Cost Report Section */}
//             <Col xs={24} lg={12} style={{ height: '100%' }}>
//               <CostReport 
//                 analysisData={analysisData} 
//                 theme={theme} 
//                 objUrl={objUrl}
//               />
//             </Col>
//           </Row>
//         </div>
//       </Content>

//       <style jsx>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </Layout>
//   );
// }

// export default ViewerPage;











// '''''new updated code using COstreport component fecthing id and passing to get endpoint to fecth the obj file to display in 3d viwer


// import React, { useEffect, useRef, useState } from 'react';
// import { useLocation, useParams } from 'react-router-dom';
// import { Layout, Typography, Card, Row, Col } from 'antd';
// import * as THREE from 'three';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { useNavigate } from 'react-router-dom';
// import { FiArrowLeft } from 'react-icons/fi';
// import CostReport from './CostReport';


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
//     front: '#B0B0B0',   // light gray
//     back: '#888888',    // medium gray
//     top: '#D3D3D3',     // lighter gray
//     bottom: '#6E6E6E',  // darker gray
//     left: '#A9A9A9',    // medium-light gray
//     right: '#505050'    // dark gray
//   }
// };

// function ViewerPage() {
//   const location = useLocation();
//   const canvasRef = useRef(null);
//   const cubeCanvasRef = useRef(null);
//   const controlsRef = useRef(null);
//   const cameraRef = useRef(null);
//   const sceneRef = useRef(null);
//   const modelRef = useRef(null);
//   const [isModelLoaded, setIsModelLoaded] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const [cubeRotation, setCubeRotation] = useState({ x: 0, y: 0 });
//   const navigate = useNavigate();
  

//   // const { objUrl, analysisData } = location.state || {};

//   const { objUrl, analysisData, costCalculationId } = location.state || {};
//   const finalCalculationId = costCalculationId || localStorage.getItem('currentCalculationId');

//   const loadModel = async () => {
//   let modelUrl = objUrl;
  
//   // Try to fetch from database if we have an ID
//   if (costCalculationId) {
//     try {
//       const response = await fetch(`http://localhost:5678/download-obj/${costCalculationId}`, {
//         method: 'GET',
//         headers: {
//           'accept': 'application/json'
//         }
//       });
      
//       if (response.ok) {
//         const blob = await response.blob();
//         modelUrl = URL.createObjectURL(blob);
//         console.log('Successfully loaded OBJ from database');
//       } else {
//         console.warn('Failed to load from database, using convert endpoint response');
//       }
//     } catch (error) {
//       console.warn('Error loading from database, using convert endpoint response:', error);
//     }
//   }
  
//   // Now load the model with the URL (either from database or convert endpoint)
//   const loader = new OBJLoader();
//   loader.load(
//     modelUrl,
//     (object) => {
//       // ... rest of your existing object loading code remains the same
//     },
//     undefined,
//     (error) => {
//       console.error('Error loading model:', error);
//       setIsError(true);
//     }
//   );
// };

// // Call loadModel instead of directly using OBJLoader
// loadModel();

//   // Create text texture for cube faces
//   const createTextTexture = (text, color = '#000000', bgColor = '#ffffff') => {
//     const canvas = document.createElement('canvas');
//     const context = canvas.getContext('2d');
//     canvas.width = 512;
//     canvas.height = 512;
    
//     // Background
//     context.fillStyle = bgColor;
//     context.fillRect(0, 0, canvas.width, canvas.height);
    
//     // Text
//     context.fillStyle = color;
//     context.font = 'bold 48px Arial';
//     context.textAlign = 'center';
//     context.textBaseline = 'middle';
//     context.fillText(text, canvas.width / 2, canvas.height / 2);
    
//     const texture = new THREE.CanvasTexture(canvas);
//     texture.needsUpdate = true;
//     return texture;
//   };

//   // Create rounded cube geometry
//   const createRoundedCubeGeometry = (size, radius, segments) => {
//     const geometry = new THREE.BoxGeometry(size, size, size, segments, segments, segments);
//     const positionAttribute = geometry.getAttribute('position');
    
//     for (let i = 0; i < positionAttribute.count; i++) {
//       const vertex = new THREE.Vector3();
//       vertex.fromBufferAttribute(positionAttribute, i);
      
//       // Apply rounding effect to corners
//       const maxCoord = Math.max(Math.abs(vertex.x), Math.abs(vertex.y), Math.abs(vertex.z));
//       const factor = (maxCoord - radius) / maxCoord;
//       vertex.multiplyScalar(Math.max(factor, 0.8));
      
//       positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
//     }
    
//     geometry.computeVertexNormals();
//     return geometry;
//   };

//   // Create a Three.js cube scene with text labels and rounded edges
//   const initCubeScene = () => {
//     if (!cubeCanvasRef.current) return null;

//     const width = 150;
//     const height = 150;

//     // Scene
//     const scene = new THREE.Scene();
//     scene.background = null;

//     // Camera
//     const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
//     camera.position.set(3, 3, 3);
//     camera.lookAt(0, 0, 0);

//     // Renderer
//     const renderer = new THREE.WebGLRenderer({
//       canvas: cubeCanvasRef.current,
//       antialias: true,
//       alpha: true
//     });
//     renderer.setSize(width, height);
//     renderer.setPixelRatio(window.devicePixelRatio);

//     // Create materials with text labels
//     const materials = [
//       new THREE.MeshBasicMaterial({ 
//         color: new THREE.Color(theme.cubeColors.right),
//         map: createTextTexture('RIGHT', '#ffffff', theme.cubeColors.right)
//       }), // Right
//       new THREE.MeshBasicMaterial({ 
//         color: new THREE.Color(theme.cubeColors.left),
//         map: createTextTexture('LEFT', '#ffffff', theme.cubeColors.left)
//       }), // Left
//       new THREE.MeshBasicMaterial({ 
//         color: new THREE.Color(theme.cubeColors.top),
//         map: createTextTexture('TOP', '#000000', theme.cubeColors.top)
//       }), // Top
//       new THREE.MeshBasicMaterial({ 
//         color: new THREE.Color(theme.cubeColors.bottom),
//         map: createTextTexture('BOTTOM', '#ffffff', theme.cubeColors.bottom)
//       }), // Bottom
//       new THREE.MeshBasicMaterial({ 
//         color: new THREE.Color(theme.cubeColors.front),
//         map: createTextTexture('FRONT', '#000000', theme.cubeColors.front)
//       }), // Front
//       new THREE.MeshBasicMaterial({ 
//         color: new THREE.Color(theme.cubeColors.back),
//         map: createTextTexture('BACK', '#ffffff', theme.cubeColors.back)
//       })  // Back
//     ];

//     // Create rounded cube
//     const cubeGeometry = createRoundedCubeGeometry(2, 0.1, 8);
//     const cube = new THREE.Mesh(cubeGeometry, materials);
//     scene.add(cube);

//     // Lighting
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
//     directionalLight.position.set(1, 1, 1);
//     scene.add(directionalLight);

//     return { scene, camera, cube, renderer };
//   };

//   // Move camera around the model (up/down/left/right)
//   const moveCamera = (direction) => {
//     if (!controlsRef.current || !cameraRef.current) return;
    
//     const controls = controlsRef.current;
//     const camera = cameraRef.current;
//     const target = controls.target;
    
//     // Get current position relative to target
//     const offset = camera.position.clone().sub(target);
//     const radius = offset.length();
    
//     // Calculate movement (15 degrees)
//     const angle = Math.PI / 12; // 15 degrees
//     let rotationAngle = 0;
    
//     // Current spherical coordinates
//     const spherical = new THREE.Spherical().setFromVector3(offset);
    
//     if (direction === 'up' || direction === 'down') {
//       // Vertical movement
//       rotationAngle = direction === 'up' ? angle : -angle;
//       spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi + rotationAngle));
//     } else if (direction === 'left' || direction === 'right') {
//       // Horizontal movement
//       rotationAngle = direction === 'left' ? angle : -angle;
//       spherical.theta += rotationAngle;
//     }
    
//     // Convert back to cartesian and add to target
//     const newPosition = new THREE.Vector3().setFromSpherical(spherical).add(target);
    
//     // Animate camera movement
//     const startPos = camera.position.clone();
//     const duration = 300;
//     const startTime = performance.now();
    
//     const animateCamera = (currentTime) => {
//       const elapsed = currentTime - startTime;
//       const progress = Math.min(elapsed / duration, 1);
      
//       // Smooth easing
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
//   };

//   useEffect(() => {
//     if (!objUrl || !canvasRef.current) {
//       setIsError(true);
//       return;
//     }

//     let scene, camera, renderer, controls;
//     let cubeScene;
//     let frameId = null;

//     const init = () => {
//       // Main scene
//       scene = new THREE.Scene();
//       sceneRef.current = scene;
      
//       const width = canvasRef.current.clientWidth;
//       const height = canvasRef.current.clientHeight;
      
//       camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
//       camera.position.set(5, 5, 5);
//       cameraRef.current = camera;
      
//       // renderer = new THREE.WebGLRenderer({ 
//       //   antialias: true, 
//       //   canvas: canvasRef.current,
//       //   alpha: true
//       // });
//         renderer = new THREE.WebGLRenderer({ 
//       antialias: true, 
//       canvas: canvasRef.current,
//       alpha: true,
//       preserveDrawingBuffer: true  // ← ADD THIS LINE
//     });
//       renderer.setPixelRatio(window.devicePixelRatio);
//       renderer.setSize(width, height);
//       renderer.shadowMap.enabled = true;
//       renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      
//       controls = new OrbitControls(camera, renderer.domElement);
//       controls.enableDamping = true;
//       controls.dampingFactor = 0.05;
//       controls.enableZoom = true;
//       controls.zoomSpeed = 2.5;  // Increase from 1.5 to 2.5 for faster zoom
//       controls.enablePan = false;
//       controls.target.set(0, 0, 0);
//       controls.autoRotate = false;
//       controls.enableRotate = true;
//       controlsRef.current = controls;
      
//       // Lighting
//       const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//       scene.add(ambientLight);
      
//       const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
//       directionalLight.position.set(5, 5, 5);
//       directionalLight.castShadow = true;
//       scene.add(directionalLight);
      
//       // Initialize cube scene
//       cubeScene = initCubeScene();
      
//       // Load model
//       const loader = new OBJLoader();
//       loader.load(
//         objUrl,
//         (object) => {
//           const box = new THREE.Box3().setFromObject(object);
//           const center = box.getCenter(new THREE.Vector3());
//           const size = box.getSize(new THREE.Vector3());
          
//           // Create a group to properly center the model
//           const modelGroup = new THREE.Group();
          
//           // Center the object within the group
//           object.position.copy(center.negate());
//           modelGroup.add(object);
          
//           const maxDim = Math.max(size.x, size.y, size.z);
//           const scale = 4 / maxDim;
//           modelGroup.scale.set(scale, scale, scale);
          
//           // Store model reference
//           modelRef.current = modelGroup;
          
//           // Set controls target to world center (0,0,0)
//           controls.target.set(0, 0, 0);
          
//           // Position camera at medium zoom distance (improved initial zoom)
//           // const distance = 4 * 1.2; // Closer initial position for medium zoom
//               const distance = 4 * 1.2; // Closer initial position for medium zoom
//           camera.position.set(distance, distance, distance);
//           camera.lookAt(0, 0, 0);
//           console.log(maxDim, distance, scale);
          
//           // Set zoom limits with better range ''''''this below three line code is previous zoom in limits which we kept '''''''''
//         //  controls.minDistance = maxDim * 0.01  // Allow MUCH closer zoom (5% of max dimension)// Minimum zoom (300% closer)
//         //   controls.maxDistance = maxDim * 3;    // Maximum zoom out
//         //   controls.update();
//         const scaledSize = maxDim * scale;
// controls.minDistance = Math.max(scaledSize * 0.08, 0.03); // Allows very close zoom, minimum 0.03 units
// controls.maxDistance = scaledSize * 6; // Good zoom out range
// console.log('Zoom limits:', { minDistance: controls.minDistance, maxDistance: controls.maxDistance, scaledSize });

// controls.update();
          
//           // Apply materials to all meshes in the object
//           object.traverse((child) => {
//             if (child instanceof THREE.Mesh) {
//               child.material = new THREE.MeshStandardMaterial({
//                 color: 0xb8b8b8,
//                 roughness: 0.25,
//                 metalness: 0.5
//               });
//               child.castShadow = true;
//               child.receiveShadow = true;
//             }
//           });
          
//           // Add the centered group to scene at world origin
//           scene.add(modelGroup);
//           setIsModelLoaded(true);
//         },
//         undefined,
//         (error) => {
//           console.error('Error loading model:', error);
//           setIsError(true);
//         }
//       );
      
//       // Animation loop
//       const animate = () => {
//         frameId = requestAnimationFrame(animate);
        
//         // Update cube rotation and sync with main camera
//         if (cubeScene) {
//           cubeScene.cube.rotation.x = cubeRotation.x;
//           cubeScene.cube.rotation.y = cubeRotation.y;
          
//           // Sync cube camera orientation with main camera
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
      
//       // Handle resize
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
//         if (renderer) {
//           renderer.dispose();
//         }
//         if (cubeScene && cubeScene.renderer) {
//           cubeScene.renderer.dispose();
//         }
//       };
//     };
    
//     init();
//   }, [objUrl, cubeRotation]);

//   // Handle face clicks
//   const handleFaceClick = (face) => {
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
    
//     // Add target position to controls target
//     targetPosition.add(controls.target);
    
//     // Animate camera
//     const startPos = cam.position.clone();
//     const startUp = cam.up.clone();
//     const duration = 500;
//     const startTime = performance.now();
    
//     const animateCamera = (currentTime) => {
//       const elapsed = currentTime - startTime;
//       const progress = Math.min(elapsed / duration, 1);
      
//       // Smooth easing
//       const easeProgress = progress < 0.5 
//         ? 2 * progress * progress 
//         : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
//       // Interpolate position
//       cam.position.lerpVectors(startPos, targetPosition, easeProgress);
      
//       // Interpolate up vector
//       cam.up.lerpVectors(startUp, targetUp, easeProgress);
      
//       cam.lookAt(controls.target);
//       controls.update();
      
//       if (progress < 1) {
//         requestAnimationFrame(animateCamera);
//       }
//     };
    
//     requestAnimationFrame(animateCamera);
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
//         background: `linear-gradient(135deg, ${theme.headerBg}, ${theme.secondary})`,
//         padding: '0 40px', 
//         display: 'flex', 
//         alignItems: 'center', 
//         justifyContent: 'space-between',
//         boxShadow: '0 8px 32px rgba(20, 93, 160, 0.3), 0 0 0 1px rgba(20, 93, 160, 0.2)',
//         borderBottom: `4px solid ${theme.headerBg}`,
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
//           title="Back to Welcome Page"
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
//             COST ESTIMATION
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
//                 title="3D Model Viewer" 
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
//                       onMouseEnter={(e) => {
//                         e.target.style.transform = 'translateX(-50%) scale(1.1)';
//                         e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.9)';
//                       }}
//                       onMouseLeave={(e) => {
//                         e.target.style.transform = 'translateX(-50%) scale(1)';
//                         e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)';
//                       }}
//                       title="Move  Up"
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
//                         // background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.95), rgba(56, 142, 60, 0.95))',
//                         // border: '2px solid rgba(76, 175, 80, 0.3)',
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
//                       onMouseEnter={(e) => {
//                         e.target.style.transform = 'translateY(-50%) scale(1.1)';
//                         e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.9)';
//                       }}
//                       onMouseLeave={(e) => {
//                         e.target.style.transform = 'translateY(-50%) scale(1)';
//                         e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)';
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
//                       // background: 'rgba(255,255,255,0.95)',
//                       background: 'theme.modelBg', 
//                       borderRadius: '16px',
//                       // boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
//                       overflow: 'hidden',
//                       pointerEvents: 'none',
//                       border: '2px solid rgba(255,255,255,0.3)'
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
//                         // background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.95), rgba(56, 142, 60, 0.95))',
//                         // border: '2px solid rgba(76, 175, 80, 0.3)',
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
//                       onMouseEnter={(e) => {
//                         e.target.style.transform = 'translateY(-50%) scale(1.1)';
//                         e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.9)';
//                       }}
//                       onMouseLeave={(e) => {
//                         e.target.style.transform = 'translateY(-50%) scale(1)';
//                         e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)';
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
//                       onMouseEnter={(e) => {
//                         e.target.style.transform = 'translateX(-50%) scale(1.1)';
//                         e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.9)';
//                       }}
//                       onMouseLeave={(e) => {
//                         e.target.style.transform = 'translateX(-50%) scale(1)';
//                         e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)';
//                       }}
//                       title="Move Camera Down"
//                     >
//                       ↓
//                     </button>
//                   </div>

//                   {/* View Controls */}
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
                
//                 {/* Loading/Error states */}
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
//                     background: 'rgba(255, 255, 255, 0.8)'
//                   }}>
//                     <div style={{ textAlign: 'center' }}>
//                       <div style={{
//                         border: `4px solid ${theme.primary}33`,
//                         borderTop: `4px solid ${theme.primary}`,
//                         borderRadius: '50%',
//                         width: '40px',
//                         height: '40px',
//                         animation: 'spin 1s linear infinite',
//                         margin: '0 auto 16px'
//                       }} />
//                       <Text style={{ color: theme.primary }}>Loading 3D model...</Text>
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
//                     background: 'rgba(255, 255, 255, 0.8)'
//                   }}>
//                     <Text style={{ color: theme.error }}>Failed to load 3D model</Text>
//                   </div>
//                 )}
//               </Card>
//             </Col>

//             {/* Cost Report Section */}
//             <Col xs={24} lg={12} style={{ height: '100%' }}>
//               {/* <CostReport 
//                 analysisData={analysisData} 
//                 theme={theme} 
//                 objUrl={objUrl}
//               /> */}
//               <CostReport 
//   analysisData={analysisData} 
//   theme={theme} 
//   objUrl={objUrl}
//   costCalculationId={costCalculationId}  // Add this line
// />
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

// export default ViewerPage;













//'''''''this is the first working code but when i refresh the page the 3d dsiplay is erasing ''''//////////////
// import React, { useEffect, useRef, useState } from 'react';
// import { useLocation, useParams } from 'react-router-dom';
// import { Layout, Typography, Card, Row, Col } from 'antd';
// import * as THREE from 'three';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { useNavigate } from 'react-router-dom';
// import { FiArrowLeft } from 'react-icons/fi';
// import CostReport from './CostReport';

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

// function ViewerPage() {
//   const location = useLocation();
//   const params = useParams();
//   const canvasRef = useRef(null);
//   const cubeCanvasRef = useRef(null);
//   const controlsRef = useRef(null);
//   const cameraRef = useRef(null);
//   const sceneRef = useRef(null);
//   const modelRef = useRef(null);
//   const [isModelLoaded, setIsModelLoaded] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const [cubeRotation, setCubeRotation] = useState({ x: 0, y: 0 });
//   const [analysisData, setAnalysisData] = useState(null);
//   const [objUrl, setObjUrl] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   // Get calculation ID from multiple sources with better fallback
//   const getCalculationId = () => {
//     return params.id || 
//            location.state?.analysisData?.id || 
//            location.state?.costCalculationId ||
//            localStorage.getItem('currentCalculationId') ||
//            localStorage.getItem('lastCalculationId');
//   };

//   // Store calculation ID for future use
//   const storeCalculationId = (id) => {
//     if (id) {
//       localStorage.setItem('currentCalculationId', id);
//       localStorage.setItem('lastCalculationId', id);
//     }
//   };

//   // Enhanced function to persist blob data
//   const persistBlobToIndexedDB = async (calculationId, blob, filename) => {
//     try {
//       return new Promise((resolve, reject) => {
//         const request = indexedDB.open('ModelCache', 1);
        
//         request.onerror = () => reject(request.error);
        
//         request.onupgradeneeded = (event) => {
//           const db = event.target.result;
//           if (!db.objectStoreNames.contains('models')) {
//             db.createObjectStore('models', { keyPath: 'id' });
//           }
//         };
        
//         request.onsuccess = (event) => {
//           const db = event.target.result;
//           const transaction = db.transaction(['models'], 'readwrite');
//           const objectStore = transaction.objectStore('models');
          
//           objectStore.put({
//             id: calculationId,
//             blob: blob,
//             filename: filename,
//             timestamp: Date.now()
//           });
          
//           transaction.oncomplete = () => {
//             console.log('Model cached successfully');
//             resolve();
//           };
          
//           transaction.onerror = () => reject(transaction.error);
//         };
//       });
//     } catch (error) {
//       console.warn('Failed to cache model:', error);
//     }
//   };

//   // Enhanced function to retrieve blob from IndexedDB
//   const retrieveBlobFromIndexedDB = async (calculationId) => {
//     try {
//       return new Promise((resolve, reject) => {
//         const request = indexedDB.open('ModelCache', 1);
        
//         request.onerror = () => reject(request.error);
        
//         request.onsuccess = (event) => {
//           const db = event.target.result;
          
//           if (!db.objectStoreNames.contains('models')) {
//             resolve(null);
//             return;
//           }
          
//           const transaction = db.transaction(['models'], 'readonly');
//           const objectStore = transaction.objectStore('models');
//           const getRequest = objectStore.get(calculationId);
          
//           getRequest.onsuccess = () => {
//             if (getRequest.result) {
//               // Check if cache is not too old (24 hours)
//               const isExpired = Date.now() - getRequest.result.timestamp > 24 * 60 * 60 * 1000;
//               if (!isExpired) {
//                 resolve({
//                   blob: getRequest.result.blob,
//                   filename: getRequest.result.filename
//                 });
//               } else {
//                 // Remove expired cache
//                 objectStore.delete(calculationId);
//                 resolve(null);
//               }
//             } else {
//               resolve(null);
//             }
//           };
          
//           getRequest.onerror = () => resolve(null);
//         };
//       });
//     } catch (error) {
//       console.warn('Failed to retrieve cached model:', error);
//       return null;
//     }
//   };

//   // Load analysis data and OBJ file with better error handling and persistence
//   const loadModelAndData = async () => {
//     const calculationId = getCalculationId();
    
//     if (!calculationId) {
//       console.error('No calculation ID found');
//       setIsError(true);
//       setIsLoading(false);
//       return;
//     }

//     // Store the calculation ID
//     storeCalculationId(calculationId);

//     try {
//       console.log('Loading data for calculation ID:', calculationId);
//       setIsLoading(true);
      
//       let currentAnalysisData = null;
//       let currentObjUrl = null;

//       // Load analysis data if not already available
//       if (location.state?.analysisData) {
//         currentAnalysisData = location.state.analysisData;
//         setAnalysisData(currentAnalysisData);
//         console.log('Using analysis data from navigation state');
//       } else {
//         // Try to get from localStorage first
//         const storedAnalysisData = localStorage.getItem(`analysisData_${calculationId}`);
//         if (storedAnalysisData) {
//           try {
//             currentAnalysisData = JSON.parse(storedAnalysisData);
//             setAnalysisData(currentAnalysisData);
//             console.log('Using stored analysis data');
//           } catch (parseError) {
//             console.warn('Error parsing stored analysis data:', parseError);
//           }
//         }

//         // If no stored data, fetch from API
//         if (!currentAnalysisData) {
//           try {
//             const analysisResponse = await fetch(`http://localhost:5678/get-analysis/${calculationId}`, {
//               method: 'GET',
//               headers: {
//                 'accept': 'application/json'
//               }
//             });
            
//             if (analysisResponse.ok) {
//               currentAnalysisData = await analysisResponse.json();
//               setAnalysisData(currentAnalysisData);
//               // Store for future use
//               localStorage.setItem(`analysisData_${calculationId}`, JSON.stringify(currentAnalysisData));
//               console.log('Successfully loaded analysis data from database');
//             }
//           } catch (error) {
//             console.warn('Failed to load analysis data from database:', error);
//           }
//         }
//       }

//       // Load OBJ file with enhanced caching
//       if (location.state?.objUrl) {
//         currentObjUrl = location.state.objUrl;
//         setObjUrl(currentObjUrl);
//         console.log('Using OBJ URL from navigation state');
//       } else {
//         // Try to get from IndexedDB first
//         const cachedModel = await retrieveBlobFromIndexedDB(calculationId);
//         if (cachedModel && cachedModel.blob) {
//           currentObjUrl = URL.createObjectURL(cachedModel.blob);
//           setObjUrl(currentObjUrl);
//           console.log('Using cached OBJ from IndexedDB');
//         } else {
//           // Fetch from API and cache
//           try {
//             const response = await fetch(`http://localhost:5678/download-obj/${calculationId}`, {
//               method: 'GET',
//               headers: {
//                 'accept': 'application/json'
//               }
//             });
            
//             if (response.ok) {
//               const blob = await response.blob();
//               currentObjUrl = URL.createObjectURL(blob);
//               setObjUrl(currentObjUrl);
              
//               // Cache the blob for future use
//               await persistBlobToIndexedDB(calculationId, blob, `model_${calculationId}.obj`);
              
//               console.log('Successfully loaded and cached OBJ from database');
//             } else {
//               throw new Error(`Failed to download OBJ: ${response.status}`);
//             }
//           } catch (error) {
//             console.error('Error loading OBJ from database:', error);
//             setIsError(true);
//             setIsLoading(false);
//             return;
//           }
//         }
//       }

//       // Load the 3D model if we have the URL and the scene is ready
//       if (currentObjUrl && sceneRef.current) {
//         loadModel(currentObjUrl);
//       }

//     } catch (error) {
//       console.error('Error loading model and data:', error);
//       setIsError(true);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Load 3D model with better error handling
//   const loadModel = (modelUrl) => {
//     if (!modelUrl || !sceneRef.current) {
//       console.warn('Cannot load model - missing URL or scene not ready');
//       return;
//     }

//     console.log('Loading 3D model from:', modelUrl);
//     const loader = new OBJLoader();
    
//     loader.load(
//       modelUrl,
//       (object) => {
//         try {
//           // Clear existing model
//           if (modelRef.current) {
//             sceneRef.current.remove(modelRef.current);
//           }

//           const box = new THREE.Box3().setFromObject(object);
//           const center = box.getCenter(new THREE.Vector3());
//           const size = box.getSize(new THREE.Vector3());
          
//           // Create a group to properly center the model
//           const modelGroup = new THREE.Group();
          
//           // Center the object within the group
//           object.position.copy(center.negate());
//           modelGroup.add(object);
          
//           const maxDim = Math.max(size.x, size.y, size.z);
//           const scale = 4 / maxDim;
//           modelGroup.scale.set(scale, scale, scale);
          
//           // Store model reference
//           modelRef.current = modelGroup;
          
//           // Set controls target to world center (0,0,0)
//           if (controlsRef.current) {
//             controlsRef.current.target.set(0, 0, 0);
            
//             // Position camera at medium zoom distance
//             const distance = 4 * 1.2;
//             if (cameraRef.current) {
//               cameraRef.current.position.set(distance, distance, distance);
//               cameraRef.current.lookAt(0, 0, 0);
//             }
            
//             // Set zoom limits
//             const scaledSize = maxDim * scale;
//             controlsRef.current.minDistance = Math.max(scaledSize * 0.08, 0.03);
//             controlsRef.current.maxDistance = scaledSize * 6;
//             controlsRef.current.update();
//           }
          
//           // Apply materials to all meshes in the object
//           object.traverse((child) => {
//             if (child instanceof THREE.Mesh) {
//               child.material = new THREE.MeshStandardMaterial({
//               //   color: 0xb8b8b8,
//               //   roughness: 0.25,
//               //   metalness: 0.5
//               // });
//  color: 0xC8C4B7,    // Fusion 360-like light warm gray
//       roughness: 0.3,
//       metalness: 0.0,
//       transparent: false,
//       opacity: 1.0,
//       side: THREE.DoubleSide,
//       flatShading: false
// });
//               child.castShadow = true;
//               child.receiveShadow = true;
//             }
//           });
          
//           // Add the centered group to scene at world origin
//           sceneRef.current.add(modelGroup);
//           setIsModelLoaded(true);
//           setIsError(false);
//           console.log('3D model loaded successfully');
//         } catch (modelError) {
//           console.error('Error processing loaded model:', modelError);
//           setIsError(true);
//         }
//       },
//       (progress) => {
//         console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
//       },
//       (error) => {
//         console.error('Error loading model:', error);
//         setIsError(true);
//         setIsLoading(false);
//       }
//     );
//   };

//   // Create text texture for cube faces
//   const createTextTexture = (text, color = '#000000', bgColor = '#ffffff') => {
//     const canvas = document.createElement('canvas');
//     const context = canvas.getContext('2d');
//     canvas.width = 512;
//     canvas.height = 512;
    
//     // Background
//     context.fillStyle = bgColor;
//     context.fillRect(0, 0, canvas.width, canvas.height);
    
//     // Text
//     context.fillStyle = color;
//     context.font = 'bold 48px Arial';
//     context.textAlign = 'center';
//     context.textBaseline = 'middle';
//     context.fillText(text, canvas.width / 2, canvas.height / 2);
    
//     const texture = new THREE.CanvasTexture(canvas);
//     texture.needsUpdate = true;
//     return texture;
//   };

//   // Create rounded cube geometry
//   const createRoundedCubeGeometry = (size, radius, segments) => {
//     const geometry = new THREE.BoxGeometry(size, size, size, segments, segments, segments);
//     const positionAttribute = geometry.getAttribute('position');
    
//     for (let i = 0; i < positionAttribute.count; i++) {
//       const vertex = new THREE.Vector3();
//       vertex.fromBufferAttribute(positionAttribute, i);
      
//       // Apply rounding effect to corners
//       const maxCoord = Math.max(Math.abs(vertex.x), Math.abs(vertex.y), Math.abs(vertex.z));
//       const factor = (maxCoord - radius) / maxCoord;
//       vertex.multiplyScalar(Math.max(factor, 0.8));
      
//       positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
//     }
    
//     geometry.computeVertexNormals();
//     return geometry;
//   };

//   // Create a Three.js cube scene with text labels and rounded edges
//   const initCubeScene = () => {
//     if (!cubeCanvasRef.current) return null;

//     const width = 150;
//     const height = 150;

//     // Scene
//     const scene = new THREE.Scene();
//     scene.background = null;

//     // Camera
//     const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
//     camera.position.set(3, 3, 3);
//     camera.lookAt(0, 0, 0);

//     // Renderer
//     const renderer = new THREE.WebGLRenderer({
//       canvas: cubeCanvasRef.current,
//       antialias: true,
//       alpha: true
//     });
//     renderer.setSize(width, height);
//     renderer.setPixelRatio(window.devicePixelRatio);

//     // Create materials with text labels
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

//     // Create rounded cube
// // Change this line in initCubeScene():
// const cubeGeometry = createRoundedCubeGeometry(2, 0.3, 20); // Increased radius and segments
//     const cube = new THREE.Mesh(cubeGeometry, materials);
//     scene.add(cube);

//     // Lighting
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
//     directionalLight.position.set(1, 1, 1);
//     scene.add(directionalLight);

//     return { scene, camera, cube, renderer };
//   };

//   // Move camera around the model (up/down/left/right)
//   const moveCamera = (direction) => {
//     if (!controlsRef.current || !cameraRef.current) return;
    
//     const controls = controlsRef.current;
//     const camera = cameraRef.current;
//     const target = controls.target;
    
//     // Get current position relative to target
//     const offset = camera.position.clone().sub(target);
//     const radius = offset.length();
    
//     // Calculate movement (15 degrees)
//     const angle = Math.PI / 12;
//     let rotationAngle = 0;
    
//     // Current spherical coordinates
//     const spherical = new THREE.Spherical().setFromVector3(offset);
    
//     if (direction === 'up' || direction === 'down') {
//       rotationAngle = direction === 'up' ? angle : -angle;
//       spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi + rotationAngle));
//     } else if (direction === 'left' || direction === 'right') {
//       rotationAngle = direction === 'left' ? angle : -angle;
//       spherical.theta += rotationAngle;
//     }
    
//     // Convert back to cartesian and add to target
//     const newPosition = new THREE.Vector3().setFromSpherical(spherical).add(target);
    
//     // Animate camera movement
//     const startPos = camera.position.clone();
//     const duration = 300;
//     const startTime = performance.now();
    
//     const animateCamera = (currentTime) => {
//       const elapsed = currentTime - startTime;
//       const progress = Math.min(elapsed / duration, 1);
      
//       // Smooth easing
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
//   };

//   // Clean up blob URLs and IndexedDB when component unmounts
//   useEffect(() => {
//     return () => {
//       if (objUrl && objUrl.startsWith('blob:')) {
//         URL.revokeObjectURL(objUrl);
//       }
//     };
//   }, [objUrl]);

//   // Initialize Three.js scene first, then load data
//   useEffect(() => {
//     if (!canvasRef.current) return;

//     let scene, camera, renderer, controls;
//     let cubeScene;
//     let frameId = null;

//     const init = () => {
//       // Main scene
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
//         preserveDrawingBuffer: true
//       });
//       renderer.setPixelRatio(window.devicePixelRatio);
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
      
//       // Lighting
//       const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//       scene.add(ambientLight);
      
//       const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
//       directionalLight.position.set(5, 5, 5);
//       directionalLight.castShadow = true;
//       scene.add(directionalLight);
      
//       // Initialize cube scene
//       cubeScene = initCubeScene();
      
//       // Animation loop
//       const animate = () => {
//         frameId = requestAnimationFrame(animate);
        
//         // Update cube rotation and sync with main camera
//         if (cubeScene) {
//           cubeScene.cube.rotation.x = cubeRotation.x;
//           cubeScene.cube.rotation.y = cubeRotation.y;
          
//           // Sync cube camera orientation with main camera
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
      
//       // Handle resize
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
//         if (renderer) {
//           renderer.dispose();
//         }
//         if (cubeScene && cubeScene.renderer) {
//           cubeScene.renderer.dispose();
//         }
//       };
//     };
    
//     const cleanup = init();
//     return cleanup;
//   }, []);

//   // Load model and data after scene is initialized
//   useEffect(() => {
//     if (sceneRef.current) {
//       loadModelAndData();
//     }
//   }, [sceneRef.current]);

//   // Load model when objUrl is available
//   useEffect(() => {
//     if (objUrl && sceneRef.current && !isModelLoaded) {
//       loadModel(objUrl);
//     }
//   }, [objUrl, sceneRef.current, isModelLoaded]);

//   // Handle face clicks
//   const handleFaceClick = (face) => {
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
    
//     // Add target position to controls target
//     targetPosition.add(controls.target);
    
//     // Animate camera
//     const startPos = cam.position.clone();
//     const startUp = cam.up.clone();
//     const duration = 500;
//     const startTime = performance.now();
    
//     const animateCamera = (currentTime) => {
//       const elapsed = currentTime - startTime;
//       const progress = Math.min(elapsed / duration, 1);
      
//       // Smooth easing
//       const easeProgress = progress < 0.5 
//         ? 2 * progress * progress 
//         : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
//       // Interpolate position
//       cam.position.lerpVectors(startPos, targetPosition, easeProgress);
      
//       // Interpolate up vector
//       cam.up.lerpVectors(startUp, targetUp, easeProgress);
      
//       cam.lookAt(controls.target);
//       controls.update();
      
//       if (progress < 1) {
//         requestAnimationFrame(animateCamera);
//       }
//     };
    
//     requestAnimationFrame(animateCamera);
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
//         background: `linear-gradient(135deg, ${theme.headerBg}, ${theme.secondary})`,
//         padding: '0 40px', 
//         display: 'flex', 
//         alignItems: 'center', 
//         justifyContent: 'space-between',
//         boxShadow: '0 8px 32px rgba(20, 93, 160, 0.3), 0 0 0 1px rgba(20, 93, 160, 0.2)',
//         borderBottom: `4px solid ${theme.headerBg}`,
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
//           title="Back to Welcome Page"
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
//             COST ESTIMATION
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
//                 title="3D Model Viewer" 
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
                  
//                   {/* Enhanced 3D Navigation Controls */}
//                   <div style={{
//                     position: 'absolute',
//                     top: '10px',
//                     right: '10px',
//                     width: '240px',
//                     height: '240px',
//                     display: isModelLoaded ? 'block' : 'none'
//                   }}>
//                     {/* Navigation arrows and cube - keeping existing JSX structure */}
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

//                     {/* Cube Container */}
//                     <div style={{
//                       position: 'absolute',
//                       left: '50%',
//                       top: '50%',
//                       transform: 'translate(-50%, -50%)',
//                       width: '150px',
//                       height: '150px',
//                       background: 'theme.modelBg', 
//                       borderRadius: '16px',
//                       overflow: 'hidden',
//                       pointerEvents: 'none',
//                       border: '2px solid rgba(255,255,255,0.3)'
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

//                   {/* View Controls */}
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
                
//                 {/* Loading/Error states */}
//                 {(isLoading || (!isModelLoaded && !isError)) && (
//                   <div style={{
//                     position: 'absolute',
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     bottom: 0,
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     background: 'rgba(255, 255, 255, 0.9)',
//                     zIndex: 100
//                   }}>
//                     <div style={{ textAlign: 'center' }}>
//                       <div style={{
//                         border: `4px solid ${theme.primary}33`,
//                         borderTop: `4px solid ${theme.primary}`,
//                         borderRadius: '50%',
//                         width: '40px',
//                         height: '40px',
//                         animation: 'spin 1s linear infinite',
//                         margin: '0 auto 16px'
//                       }} />
//                       <Text style={{ color: theme.primary, fontSize: '16px' }}>
//                         Loading 3D model...
//                       </Text>
//                     </div>
//                   </div>
//                 )}
//                 {isError && !isLoading && (
//                   <div style={{
//                     position: 'absolute',
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     bottom: 0,
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     background: 'rgba(255, 255, 255, 0.9)',
//                     zIndex: 100
//                   }}>
//                     <div style={{ textAlign: 'center' }}>
//                       <Text style={{ color: theme.error, fontSize: '16px' }}>
//                         Failed to load 3D model
//                       </Text>
//                       <br />
//                       <button 
//                         onClick={loadModelAndData}
//                         style={{
//                           marginTop: '16px',
//                           padding: '8px 16px',
//                           background: theme.primary,
//                           color: 'white',
//                           border: 'none',
//                           borderRadius: '4px',
//                           cursor: 'pointer'
//                         }}
//                       >
//                         Retry
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </Card>
//             </Col>

//             {/* Cost Report Section */}
//             <Col xs={24} lg={12} style={{ height: '100%' }}>
//               <CostReport 
//                 analysisData={analysisData} 
//                 theme={theme} 
//                 objUrl={objUrl}
//                 costCalculationId={getCalculationId()}
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

// export default ViewerPage;









//'''''''''02/09/2025''''''''//


// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { useLocation, useParams } from 'react-router-dom';
// import { Layout, Typography, Card, Row, Col } from 'antd';
// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'; // ✅ Changed from OBJLoader to GLTFLoader
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { useNavigate } from 'react-router-dom';
// import { FiArrowLeft } from 'react-icons/fi';
// import CostReport from './CostReport';

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

// function ViewerPage() {
//   const location = useLocation();
//   const { id } = useParams();
//   const canvasRef = useRef(null);
//   const cubeCanvasRef = useRef(null);
//   const controlsRef = useRef(null);
//   const cameraRef = useRef(null);
//   const sceneRef = useRef(null);
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
//   const [costCalculationId, setCostCalculationId] = useState(() => {
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

//   // ✅ Enhanced model loading with GLB format support
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

//     console.log('Loading GLB model from database with validated ID:', calcId);
//     setIsModelLoaded(false);
//     setIsError(false);
//     setLoadingProgress(0);
//     setLoadingMessage('Connecting to server...');
    
//     // Create new abort controller for this request
//     const abortController = new AbortController();
//     loadingAbortControllerRef.current = abortController;
    
//     try {
//       setLoadingMessage('Downloading 3D model (GLB format)...');
      
//       // ✅ Use GLB endpoint instead of OBJ
//       const response = await fetch(`http://localhost:5678/download-glb/${calcId}`, {
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
      
//       // Check content type
//       const contentType = response.headers.get('content-type');
//       console.log('Response content type:', contentType);
      
//       setLoadingMessage('Processing GLB model...');
      
//       // Get content length for progress tracking
//       const contentLength = +response.headers.get('content-length') || 0;
      
//       let arrayBuffer;
      
//       // Handle progress tracking only if we have content length and readable stream
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
            
//             const progress = Math.round((receivedLength / contentLength) * 70); // 70% for download
//             setLoadingProgress(progress);
//           }
          
//           // Convert chunks to ArrayBuffer for GLTFLoader
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
//           // Fallback to direct arrayBuffer conversion
//           arrayBuffer = await response.arrayBuffer();
//         }
//       } else {
//         // Direct arrayBuffer conversion when no progress tracking is possible
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

//   // ✅ New function to handle GLB ArrayBuffer processing
//   const loadModelFromArrayBuffer = async (arrayBuffer, calcId, abortController) => {
//     try {
//       if (abortController.signal.aborted) {
//         return;
//       }

//       setLoadingMessage('Parsing GLB model...');
//       setLoadingProgress(75);
      
//       // Validate arrayBuffer
//       if (!arrayBuffer || arrayBuffer.byteLength === 0) {
//         throw new Error('Received empty or invalid GLB model data');
//       }
      
//       console.log('GLB ArrayBuffer size:', arrayBuffer.byteLength, 'bytes');
      
//       // ✅ Load the model using GLTFLoader (much faster than OBJLoader)
//       const loader = new GLTFLoader();
      
//       // Use a Promise wrapper for better error handling
//       const loadModel = new Promise((resolve, reject) => {
//         const timeoutId = setTimeout(() => {
//           reject(new Error('GLB model loading timeout (30 seconds)'));
//         }, 30000); // 30 second timeout
        
//         // ✅ GLTFLoader.parse() works with ArrayBuffer directly
//         loader.parse(
//           arrayBuffer,
//           '', // resource path (empty for ArrayBuffer)
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
      
//       if (abortController.signal.aborted) {
//         return;
//       }
      
//       console.log('GLB model loaded successfully from database');
//       setLoadingProgress(95);
      
//       // Validate the loaded GLTF object
//       if (!gltf || !gltf.scene) {
//         throw new Error('Loaded GLB model is empty or invalid');
//       }
      
//       // Cache the GLTF for future use (clone the scene to avoid reference issues)
//       try {
//         modelCacheRef.current.set(calcId, {
//           scene: gltf.scene.clone(),
//           animations: gltf.animations,
//           userData: gltf.userData
//         });
//         console.log('GLB model cached successfully');
//       } catch (cacheError) {
//         console.warn('Failed to cache GLB model:', cacheError);
//         // Continue without caching
//       }
      
//       // ✅ Process the GLTF scene
//       processAndAddModel(gltf.scene);
      
//       setIsModelLoaded(true);
//       setLoadingProgress(100);
      
//     } catch (error) {
//       if (abortController.signal.aborted) {
//         return;
//       }
      
//       console.error('Error processing GLB ArrayBuffer:', error);
//       setIsError(true);
      
//       // Provide more specific error messages
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

//   // Handle cost calculation completion from CostReport
//   const handleCostCalculationComplete = useCallback((calculationId) => {
//     console.log('Cost calculation completed with ID:', calculationId);
    
//     // Validate the calculation ID
//     if (!calculationId || calculationId === 'undefined' || calculationId === 'null') {
//       console.error('Invalid calculation ID received:', calculationId);
//       setIsError(true);
//       setLoadingMessage('Invalid calculation ID received.');
//       return;
//     }
    
//     setCostCalculationId(calculationId);
//     localStorage.setItem('currentCalculationId', calculationId);
    
//     // Clear any existing loading timeout
//     if (loadingTimeout) {
//       clearTimeout(loadingTimeout);
//     }
    
//     // Debounce the model loading to prevent rapid successive calls
//     const timeout = setTimeout(() => {
//       loadModelFromDatabase(calculationId);
//     }, 500);
    
//     setLoadingTimeout(timeout);
//   }, [loadModelFromDatabase, loadingTimeout]);

//   // ✅ Process and add the loaded GLTF scene to the main scene (optimized)
//   const processAndAddModel = useCallback((gltfScene) => {
//     if (!sceneRef.current) return;

//     // Clear any existing model with proper cleanup
//     if (modelRef.current && sceneRef.current) {
//       sceneRef.current.remove(modelRef.current);
//       // Dispose of old geometry and materials
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

//     // Calculate bounding box and center the model
//     const box = new THREE.Box3().setFromObject(gltfScene);
//     const center = box.getCenter(new THREE.Vector3());
//     const size = box.getSize(new THREE.Vector3());
    
//     // Create a group to hold the centered model
//     const modelGroup = new THREE.Group();
//     gltfScene.position.copy(center.negate()); // Center the model
//     modelGroup.add(gltfScene);
    
//     // Scale the model to fit in the viewport
//     const maxDim = Math.max(size.x, size.y, size.z);
//     const scale = 4 / maxDim; // Adjust scale factor as needed
//     modelGroup.scale.set(scale, scale, scale);
    
//     // Store reference to the model group
//     modelRef.current = modelGroup;
    
//     // Update camera and controls
//     if (controlsRef.current) {
//       controlsRef.current.target.set(0, 0, 0);
//     }
    
//     if (cameraRef.current) {
//       const distance = 4 * 1.5; // Adjust distance as needed
//       cameraRef.current.position.set(distance, distance, distance);
//       cameraRef.current.lookAt(0, 0, 0);
      
//       if (controlsRef.current) {
//         controlsRef.current.minDistance = maxDim * 0.001;
//         controlsRef.current.maxDistance = maxDim * 1;
//         controlsRef.current.update();
//       }
//     }
    
//     // ✅ GLB models often come with their own materials, so we might not need to override them
//     // But if you want consistent styling, you can still apply a shared material
//     const applyCustomMaterial = true; // Set to true if you want to override materials
    
//     if (applyCustomMaterial) {
//       // Create a shared material to improve performance
//       const sharedMaterial = new THREE.MeshStandardMaterial({
//         color: new THREE.Color(theme.cubeColors.Top),
//         roughness: 0.6,
//         metalness: 0.4
//       });
      
//       // Apply materials to all meshes
//       gltfScene.traverse((child) => {
//         if (child instanceof THREE.Mesh) {
//           child.material = sharedMaterial;
//           // child.castShadow = true;
//           // child.receiveShadow = true;
//         }
//       });
//     } else {
//       // Just enable shadows for existing materials
//       gltfScene.traverse((child) => {
//         if (child instanceof THREE.Mesh) {
//           // child.castShadow = true;
//           // child.receiveShadow = true;
//         }
//       });
//     }
    
//     // Add the model to the scene
//     sceneRef.current.add(modelGroup);
//     console.log('GLB model added to scene successfully');
//   }, []);

//   // Create text texture for cube faces (memoized)
//   const createTextTexture = useCallback((text, color = '#000000', bgColor = '#ffffff') => {
//     const canvas = document.createElement('canvas');
//     const context = canvas.getContext('2d');
//     canvas.width = 256; // Reduced from 512 for better performance
//     canvas.height = 256;
    
//     // Background
//     context.fillStyle = bgColor;
//     context.fillRect(0, 0, canvas.width, canvas.height);
    
//     // Text
//     context.fillStyle = color;
//     context.font = 'bold 24px Arial'; // Reduced font size
//     context.textAlign = 'center';
//     context.textBaseline = 'middle';
//     context.fillText(text, canvas.width / 2, canvas.height / 2);
    
//     const texture = new THREE.CanvasTexture(canvas);
//     texture.needsUpdate = true;
//     texture.minFilter = THREE.LinearFilter; // Better performance
//     return texture;
//   }, []);

//   // Create rounded cube geometry (memoized)
//   const createRoundedCubeGeometry = useCallback((size, radius, segments) => {
//     const geometry = new THREE.BoxGeometry(size, size, size, segments, segments, segments);
//     const positionAttribute = geometry.getAttribute('position');
    
//     for (let i = 0; i < positionAttribute.count; i++) {
//       const vertex = new THREE.Vector3();
//       vertex.fromBufferAttribute(positionAttribute, i);
      
//       // Apply rounding effect to corners
//       const maxCoord = Math.max(Math.abs(vertex.x), Math.abs(vertex.y), Math.abs(vertex.z));
//       const factor = (maxCoord - radius) / maxCoord;
//       vertex.multiplyScalar(Math.max(factor, 0.8));
      
//       positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
//     }
    
//     geometry.computeVertexNormals();
//     return geometry;
//   }, []);

//   // Create a Three.js cube scene with text labels and rounded edges (memoized)
//   const initCubeScene = useCallback(() => {
//     if (!cubeCanvasRef.current) return null;

//     const width = 150;
//     const height = 150;

//     // Scene
//     const scene = new THREE.Scene();
//     scene.background = null;

//     // Camera
//     const aspect = width / height;
//     const frustumSize = 4; // Adjust this to control zoom level
//     const camera = new THREE.OrthographicCamera(
//                                                 frustumSize * aspect / -2,  // left
//                                                 frustumSize * aspect / 2,   // right
//                                                 frustumSize / 2,            // top
//                                                 frustumSize / -2,           // bottom
//                                                 0.1,                        // near
//                                                 1000                        // far
//                                                 );
//     camera.position.set(3, 3, 3);
//     camera.lookAt(0, 0, 0);

//     // Renderer
//     const renderer = new THREE.WebGLRenderer({
//       canvas: cubeCanvasRef.current,
//       antialias: false, // Disabled for better performance
//       alpha: true,
//       powerPreference: "high-performance"
//     });
//     renderer.setSize(width, height);
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio

//     // Create materials with text labels
//     const materials = [
//       new THREE.MeshBasicMaterial({ 
//         color: new THREE.Color(theme.cubeColors.right),
//         map: createTextTexture('RIGHT', '#ffffff', theme.cubeColors.right)
//       }), // Right
//       new THREE.MeshBasicMaterial({ 
//         color: new THREE.Color(theme.cubeColors.left),
//         map: createTextTexture('LEFT', '#ffffff', theme.cubeColors.left)
//       }), // Left
//       new THREE.MeshBasicMaterial({ 
//         color: new THREE.Color(theme.cubeColors.top),
//         map: createTextTexture('TOP', '#000000', theme.cubeColors.top)
//       }), // Top
//       new THREE.MeshBasicMaterial({ 
//         color: new THREE.Color(theme.cubeColors.bottom),
//         map: createTextTexture('BOTTOM', '#ffffff', theme.cubeColors.bottom)
//       }), // Bottom
//       new THREE.MeshBasicMaterial({ 
//         color: new THREE.Color(theme.cubeColors.front),
//         map: createTextTexture('FRONT', '#000000', theme.cubeColors.front)
//       }), // Front
//       new THREE.MeshBasicMaterial({ 
//         color: new THREE.Color(theme.cubeColors.back),
//         map: createTextTexture('BACK', '#ffffff', theme.cubeColors.back)
//       })  // Back
//     ];

//     // Create rounded cube
//     const cubeGeometry = createRoundedCubeGeometry(2, 0.1, 6); // Reduced segments
//     const cube = new THREE.Mesh(cubeGeometry, materials);
//     scene.add(cube);

//     // Lighting
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
//     directionalLight.position.set(1, 1, 1);
//     scene.add(directionalLight);

//     return { scene, camera, cube, renderer };
//   }, [createTextTexture, createRoundedCubeGeometry]);

//   // Move camera around the model (up/down/left/right)
//   const moveCamera = useCallback((direction) => {
//     if (!controlsRef.current || !cameraRef.current) return;
    
//     const controls = controlsRef.current;
//     const camera = cameraRef.current;
//     const target = controls.target;
    
//     // Get current position relative to target
//     const offset = camera.position.clone().sub(target);
//     const radius = offset.length();
    
//     // Calculate movement (15 degrees)
//     const angle = Math.PI / 12; // 15 degrees
//     let rotationAngle = 0;
    
//     // Current spherical coordinates
//     const spherical = new THREE.Spherical().setFromVector3(offset);
    
//     if (direction === 'up' || direction === 'down') {
//       // Vertical movement
//       rotationAngle = direction === 'up' ? angle : -angle;
//       spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi + rotationAngle));
//     } else if (direction === 'left' || direction === 'right') {
//       // Horizontal movement
//   rotationAngle = direction === 'left' ? angle : -angle;  // ← SWAPPED: left gets positive, right gets negative
//   spherical.theta += rotationAngle;
//     }
    
//     // Convert back to cartesian and add to target
//     const newPosition = new THREE.Vector3().setFromSpherical(spherical).add(target);
    
//     // Animate camera movement
//     const startPos = camera.position.clone();
//     const duration = 300;
//     const startTime = performance.now();
    
//     const animateCamera = (currentTime) => {
//       const elapsed = currentTime - startTime;
//       const progress = Math.min(elapsed / duration, 1);
      
//       // Smooth easing
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

//   // Initialize 3D scene only once
//   useEffect(() => {
//     if (!canvasRef.current) return;

//     let scene, camera, renderer, controls;
//     let cubeScene;
//     let frameId = null;

//     const init = () => {
//       // Main scene
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
//       renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
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
      
//       // Lighting
//       // const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//       // scene.add(ambientLight);
      
//       // const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
//       // directionalLight.position.set(5, 5, 5);
//       // // directionalLight.castShadow = true;
//       // scene.add(directionalLight);


//       const ambientLight = new THREE.AmbientLight(0xffffff, 0.9); // Increased intensity
//       scene.add(ambientLight);

//       const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x888888, 0.7);
//       scene.add(hemisphereLight);
      
//       // Initialize cube scene
//       cubeScene = initCubeScene();

//       // Only load model if we have a valid costCalculationId
//       if (costCalculationId && costCalculationId !== 'undefined' && costCalculationId !== 'null') {
//         console.log('Loading GLB model with validated calculation ID:', costCalculationId);
//         loadModelFromDatabase(costCalculationId);
//       } else {
//         console.log('No valid calculation ID available, waiting...');
//         setLoadingMessage('Waiting for calculation to complete...');
//       }
      
//       // Animation loop
//       const animate = () => {
//         frameId = requestAnimationFrame(animate);
        
//         // Update cube rotation and sync with main camera
//         if (cubeScene && cubeScene.cube) {
//           cubeScene.cube.rotation.x = cubeRotation.x;
//           cubeScene.cube.rotation.y = cubeRotation.y;
          
//           // Sync cube camera orientation with main camera
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
      
//       // Handle resize
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
//         // Cancel any ongoing loading
//         if (loadingAbortControllerRef.current) {
//           loadingAbortControllerRef.current.abort();
//         }
        
//         // Clear timeout
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

//   // Handle costCalculationId changes with validation
//   useEffect(() => {
//     if (costCalculationId && costCalculationId !== 'undefined' && costCalculationId !== 'null') {
//       localStorage.setItem('currentCalculationId', costCalculationId);
//       console.log('Updated localStorage with validated costCalculationId:', costCalculationId);
      
//       // Only reload model if scene is already initialized and we don't have a model loaded
//       if (sceneRef.current && !isModelLoaded) {
//         // Add a small delay to ensure scene is properly initialized
//         setTimeout(() => {
//           loadModelFromDatabase(costCalculationId);
//         }, 100);
//       }
//     } else {
//       localStorage.removeItem('currentCalculationId');
//       console.log('Removed invalid costCalculationId from localStorage');
//     }
//   }, [costCalculationId, isModelLoaded, loadModelFromDatabase]);

//   // Handle face clicks
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
    
//     // Add target position to controls target
//     targetPosition.add(controls.target);
    
//     // Animate camera
//     const startPos = cam.position.clone();
//     const startUp = cam.up.clone();
//     const duration = 500;
//     const startTime = performance.now();
    
//     const animateCamera = (currentTime) => {
//       const elapsed = currentTime - startTime;
//       const progress = Math.min(elapsed / duration, 1);
      
//       // Smooth easing
//       const easeProgress = progress < 0.5 
//         ? 2 * progress * progress 
//         : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
//       // Interpolate position
//       cam.position.lerpVectors(startPos, targetPosition, easeProgress);
      
//       // Interpolate up vector
//       cam.up.lerpVectors(startUp, targetUp, easeProgress);
      
//       cam.lookAt(controls.target);
//       controls.update();
      
//       if (progress < 1) {
//         requestAnimationFrame(animateCamera);
//       }
//     };
    
//     requestAnimationFrame(animateCamera);
//   }, []);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       // Cancel any ongoing loading
//       if (loadingAbortControllerRef.current) {
//         loadingAbortControllerRef.current.abort();
//       }
      
//       // Clear timeout
//       if (loadingTimeout) {
//         clearTimeout(loadingTimeout);
//       }
      
//       // Clear model cache to free memory
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
//           title="Back to Welcome Page"
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
//             COST ESTIMATION
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
//                       // background: theme.modelBg, 
//                       // borderRadius: '16px',
//                       overflow: 'hidden',
//                       pointerEvents: 'none',
//                       // border: '2px solid rgba(255,255,255,0.3)'
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

//                   {/* View Controls */}
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
//                             color: theme.textSecondary, 
//                             fontSize: '14px'
//                           }}>
//                             {loadingProgress}% complete
//                           </Text>
//                         </div>
//                       )}
                      
//                       {/* Show calculation ID status */}
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
//                       {/* Error Icon */}
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
                      
//                       {/* Action Buttons */}
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

//             {/* Cost Report Section */}
//             <Col xs={24} lg={12} style={{ height: '100%' }}>
//               <CostReport 
//                 analysisData={analysisData} 
//                 theme={theme} 
//                 onCostCalculationComplete={handleCostCalculationComplete}
//                 costCalculationId={costCalculationId}
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

// export default ViewerPage;










import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Layout, Typography, Card, Row, Col } from 'antd';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import CostReport from './CostReport';

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
  // Face highlight color - bright blue
  highlightColor: '#00aaff',
  cubeColors: {
    front: '#B0B0B0',
    back: '#888888',
    top: '#D3D3D3',
    bottom: '#6E6E6E',
    left: '#A9A9A9',
    right: '#505050'
  }
};

function ViewerPage() {
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
  
  // Face highlighting refs
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const highlightedFaceRef = useRef(null);
  const originalMaterialsRef = useRef(new Map());
  const highlightMaterialRef = useRef(null);
  
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Waiting for calculation ID...');
  const [cubeRotation, setCubeRotation] = useState({ x: 0, y: 0 });
  const [loadingProgress, setLoadingProgress] = useState(0);
  const navigate = useNavigate();
  
  // Get costCalculationId with validation
  const [costCalculationId, setCostCalculationId] = useState(() => {
    const possibleId = id || 
                      location.state?.costCalculationId || 
                      localStorage.getItem('currentCalculationId');
    
    return possibleId && possibleId !== 'undefined' && possibleId !== 'null' 
      ? possibleId 
      : null;
  });

  const { analysisData } = location.state || {};
  const [loadingTimeout, setLoadingTimeout] = useState(null);

  // Create highlight material
  const createHighlightMaterial = useCallback(() => {
    if (!highlightMaterialRef.current) {
      highlightMaterialRef.current = new THREE.MeshStandardMaterial({
        color: new THREE.Color(theme.highlightColor),
        emissive: new THREE.Color(theme.highlightColor),
        emissiveIntensity: 0.3,
        roughness: 0.4,
        metalness: 0.6,
        transparent: true,
        opacity: 0.8
      });
    }
    return highlightMaterialRef.current;
  }, []);

  // Store original materials
  const storeOriginalMaterials = useCallback((object) => {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        originalMaterialsRef.current.set(child.uuid, child.material.clone());
      }
    });
  }, []);

  // Clear face highlight
  const clearHighlight = useCallback(() => {
    if (highlightedFaceRef.current && originalMaterialsRef.current.has(highlightedFaceRef.current.uuid)) {
      const originalMaterial = originalMaterialsRef.current.get(highlightedFaceRef.current.uuid);
      highlightedFaceRef.current.material = originalMaterial;
      highlightedFaceRef.current = null;
    }
  }, []);

  // Highlight a face
  const highlightFace = useCallback((mesh) => {
    // Clear previous highlight
    clearHighlight();
    
    // Apply highlight to new face
    if (mesh instanceof THREE.Mesh) {
      highlightedFaceRef.current = mesh;
      mesh.material = createHighlightMaterial();
    }
  }, [clearHighlight, createHighlightMaterial]);

  // Handle mouse click for face selection
  const handleCanvasClick = useCallback((event) => {
    if (!canvasRef.current || !cameraRef.current || !sceneRef.current || !modelRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Update the raycaster
    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

    // Calculate objects intersecting the ray
    const intersects = raycasterRef.current.intersectObjects(modelRef.current.children, true);

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      
      // Only highlight if it's a mesh
      if (intersectedObject instanceof THREE.Mesh) {
        highlightFace(intersectedObject);
        
        // Optional: Log face information
        console.log('Face selected:', {
          uuid: intersectedObject.uuid,
          position: intersects[0].point,
          normal: intersects[0].face?.normal,
          materialName: intersectedObject.material?.name || 'unnamed'
        });
      }
    } else {
      // Click on empty space - clear highlight
      clearHighlight();
    }
  }, [highlightFace, clearHighlight]);

  // Enhanced model loading with GLB format support
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

    console.log('Loading GLB model from database with validated ID:', calcId);
    setIsModelLoaded(false);
    setIsError(false);
    setLoadingProgress(0);
    setLoadingMessage('Connecting to server...');
    
    const abortController = new AbortController();
    loadingAbortControllerRef.current = abortController;
    
    try {
      setLoadingMessage('Downloading 3D model (GLB format)...');
      
      const response = await fetch(`http://localhost:5678/download-glb/${calcId}`, {
        signal: abortController.signal,
        method: 'GET',
        headers: {
          'Accept': 'model/gltf-binary, application/octet-stream, */*',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (abortController.signal.aborted) return;
      
      if (!response.ok) {
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

  // GLB ArrayBuffer processing
  const loadModelFromArrayBuffer = async (arrayBuffer, calcId, abortController) => {
    try {
      if (abortController.signal.aborted) return;

      setLoadingMessage('Parsing GLB model...');
      setLoadingProgress(75);
      
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error('Received empty or invalid GLB model data');
      }
      
      console.log('GLB ArrayBuffer size:', arrayBuffer.byteLength, 'bytes');
      
      const loader = new GLTFLoader();
      
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

  // Handle cost calculation completion
  const handleCostCalculationComplete = useCallback((calculationId) => {
    console.log('Cost calculation completed with ID:', calculationId);
    
    if (!calculationId || calculationId === 'undefined' || calculationId === 'null') {
      console.error('Invalid calculation ID received:', calculationId);
      setIsError(true);
      setLoadingMessage('Invalid calculation ID received.');
      return;
    }
    
    setCostCalculationId(calculationId);
    localStorage.setItem('currentCalculationId', calculationId);
    
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }
    
    const timeout = setTimeout(() => {
      loadModelFromDatabase(calculationId);
    }, 500);
    
    setLoadingTimeout(timeout);
  }, [loadModelFromDatabase, loadingTimeout]);

  // Process and add the loaded GLTF scene
  const processAndAddModel = useCallback((gltfScene) => {
    if (!sceneRef.current) return;

    // Clear any existing model
    if (modelRef.current && sceneRef.current) {
      // Clear highlighting state
      clearHighlight();
      originalMaterialsRef.current.clear();
      
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

    // Calculate bounding box and center the model
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
    
    // Store original materials for highlighting
    storeOriginalMaterials(modelGroup);
    
    // Update camera and controls
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
    }
    
    if (cameraRef.current) {
      const distance = 4 * 1.5;
      cameraRef.current.position.set(distance, distance, distance);
      cameraRef.current.lookAt(0, 0, 0);
      
      if (controlsRef.current) {
        controlsRef.current.minDistance = maxDim * 0.001;
        controlsRef.current.maxDistance = maxDim * 1;
        controlsRef.current.update();
      }
    }
    
    // Apply custom materials if desired
    const applyCustomMaterial = true;
    
    if (applyCustomMaterial) {
      const sharedMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(theme.cubeColors.top),
        roughness: 0.6,
        metalness: 0.4
      });
      
      gltfScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = sharedMaterial.clone(); // Clone to allow individual highlighting
          // Store the new material as original
          originalMaterialsRef.current.set(child.uuid, child.material.clone());
        }
      });
    } else {
      gltfScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Just clone the existing material for individual highlighting
          child.material = child.material.clone();
          originalMaterialsRef.current.set(child.uuid, child.material.clone());
        }
      });
    }
    
    sceneRef.current.add(modelGroup);
    console.log('GLB model added to scene successfully');
  }, [clearHighlight, storeOriginalMaterials]);

  // Create text texture for cube faces
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

  // Create rounded cube geometry
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

  // Create cube scene
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

  // Move camera around the model
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

  // Initialize 3D scene
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
      
      // Add click event listener for face selection
      canvasRef.current.addEventListener('click', handleCanvasClick, false);
      
      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
      scene.add(ambientLight);

      const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x888888, 0.7);
      scene.add(hemisphereLight);
      
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
        
        // Remove click event listener
        if (canvasRef.current) {
          canvasRef.current.removeEventListener('click', handleCanvasClick, false);
        }
        
        // Clear highlighting state
        clearHighlight();
        originalMaterialsRef.current.clear();
        
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
  }, [costCalculationId, initCubeScene, loadModelFromDatabase, cubeRotation, loadingTimeout, handleCanvasClick, clearHighlight]);

  // Handle costCalculationId changes
  useEffect(() => {
    if (costCalculationId && costCalculationId !== 'undefined' && costCalculationId !== 'null') {
      localStorage.setItem('currentCalculationId', costCalculationId);
      console.log('Updated localStorage with validated costCalculationId:', costCalculationId);
      
      if (sceneRef.current && !isModelLoaded) {
        setTimeout(() => {
          loadModelFromDatabase(costCalculationId);
        }, 100);
      }
    } else {
      localStorage.removeItem('currentCalculationId');
      console.log('Removed invalid costCalculationId from localStorage');
    }
  }, [costCalculationId, isModelLoaded, loadModelFromDatabase]);

  // Handle face clicks
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loadingAbortControllerRef.current) {
        loadingAbortControllerRef.current.abort();
      }
      
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
      
      // Clear highlighting state
      clearHighlight();
      originalMaterialsRef.current.clear();
      
      // Dispose highlight material
      if (highlightMaterialRef.current) {
        highlightMaterialRef.current.dispose();
      }
      
      modelCacheRef.current.clear();
    };
  }, [loadingTimeout, clearHighlight]);

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
          onClick={() => navigate('/home')}
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
          title="Back to Welcome Page"
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
                title="" 
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
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <canvas 
                    ref={canvasRef} 
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'block',
                      cursor: 'pointer' // Indicate clickable canvas
                    }}
                  />
                  
                  {/* Face Selection Instructions */}
                  {isModelLoaded && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      zIndex: 5,
                      backdropFilter: 'blur(5px)'
                    }}>
                      Click on faces to highlight them in blue
                    </div>
                  )}
                  
                  {/* Clear Highlight Button */}
                  {isModelLoaded && highlightedFaceRef.current && (
                    <div style={{
                      position: 'absolute',
                      top: '50px',
                      left: '10px',
                      zIndex: 5
                    }}>
                      <button
                        onClick={clearHighlight}
                        style={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: '2px solid #ddd',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = theme.highlightColor;
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(255,255,255,0.9)';
                          e.target.style.color = 'black';
                        }}
                        title="Clear face highlight"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                  
                  {/* Enhanced 3D Navigation Controls */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '240px',
                    height: '240px',
                    display: isModelLoaded ? 'block' : 'none'
                  }}>
                    {/* Top Arrow - Move Camera Up */}
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

                    {/* Left Arrow - Move Camera Left */}
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

                    {/* Cube Container with Rounded Corners */}
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
                      
                      {/* Clickable Face Buttons */}
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
                        {/* Top */}
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
                        {/* Left */}
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
                        {/* Front */}
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
                        {/* Right */}
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
                        {/* Bottom */}
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

                    {/* Right Arrow - Move Camera Right */}
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

                    {/* Bottom Arrow - Move Camera Down */}
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

                  {/* View Controls */}
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
                
                {/* Enhanced Loading/Error states with progress */}
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
                      {/* Loading Spinner */}
                      <div style={{
                        border: `4px solid ${theme.primary}33`,
                        borderTop: `4px solid ${theme.primary}`,
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                      }} />
                      
                      {/* Progress Bar */}
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
                      
                      {/* Show calculation ID status */}
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
                
                {/* Enhanced Error State */}
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
                      {/* Error Icon */}
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
                      
                      {/* Action Buttons */}
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

            {/* Cost Report Section */}
            <Col xs={24} lg={12} style={{ height: '100%' }}>
              <CostReport 
                analysisData={analysisData} 
                theme={theme} 
                onCostCalculationComplete={handleCostCalculationComplete}
                costCalculationId={costCalculationId}
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

export default ViewerPage;

















































// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { useLocation, useParams } from 'react-router-dom';
// import { Layout, Typography, Card, Row, Col, Select, Tooltip } from 'antd';
// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { useNavigate } from 'react-router-dom';
// import { FiArrowLeft, FiEye } from 'react-icons/fi';
// import CostReport from './CostReport';

// const { Content } = Layout;
// const { Title, Text } = Typography;
// const { Option } = Select;

// const theme = {
//   primary: '#145da0',
//   secondary: '#246679',
//   success: '#52c41a',
//   warning: '#faad14',
//   error: '#f5222d',
//   background: '#f0f2f5',
//   cardBg: '#ffffff',
//   textPrimary: '#979494ec',
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
//   },
//   cadColors: {
//     primary: '#C8C8C8',
//     secondary: '#E0E0E0',
//     tertiary: '#B8B8B8',
//     edgeColor: '#4A90E2',
//     wireframeColor: '#666666',
//     hiddenEdgeColor: '#4A90E2'
//   }
// };

// const VISUAL_STYLES = {
//   shaded: {
//     name: 'Shaded',
//     description: 'Solid shaded surfaces with lighting',
//     icon: '🎨'
//   },
//   shadedWithHiddenEdges: {
//     name: 'Shaded with Hidden Edges',
//     description: 'Shaded surfaces with all edges visible',
//     icon: '📐'
//   },
//   shadedWithVisibleEdgesOnly: {
//     name: 'Shaded with Visible Edges Only',
//     description: 'Shaded surfaces with only visible edges',
//     icon: '📏'
//   },
//   wireframe: {
//     name: 'Wireframe',
//     description: 'Show only edges and lines',
//     icon: '🔗'
//   },
//   wireframeWithHiddenEdges: {
//     name: 'Wireframe with Hidden Edges',
//     description: 'Wireframe with hidden edges visible',
//     icon: '🔍'
//   },
//   wireframeWithVisibleEdgesOnly: {
//     name: 'Wireframe with Visible Edges Only',
//     description: 'Wireframe with only visible edges',
//     icon: '👁️'
//   }
// };

// function ViewerPage() {
//   const location = useLocation();
//   const { id } = useParams();
//   const canvasRef = useRef(null);
//   const cubeCanvasRef = useRef(null);
//   const controlsRef = useRef(null);
//   const cameraRef = useRef(null);
//   const sceneRef = useRef(null);
//   const modelRef = useRef(null);
//   const wireframeRef = useRef(null);
//   const edgesRef = useRef(null);
//   const loadingAbortControllerRef = useRef(null);
//   const modelCacheRef = useRef(new Map());
  
//   const [isModelLoaded, setIsModelLoaded] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const [loadingMessage, setLoadingMessage] = useState('Waiting for calculation ID...');
//   const [cubeRotation, setCubeRotation] = useState({ x: 0, y: 0 });
//   const [loadingProgress, setLoadingProgress] = useState(0);
//   const [visualStyle, setVisualStyle] = useState('shaded');
//   const [originalMaterials, setOriginalMaterials] = useState(new Map());
//   const navigate = useNavigate();
  
//   const [costCalculationId, setCostCalculationId] = useState(() => {
//     const possibleId = id || 
//                       location.state?.costCalculationId || 
//                       localStorage.getItem('currentCalculationId');
    
//     return possibleId && possibleId !== 'undefined' && possibleId !== 'null' 
//       ? possibleId 
//       : null;
//   });

//   const { analysisData } = location.state || {};
//   const [loadingTimeout, setLoadingTimeout] = useState(null);

//   const createCADMaterial = useCallback((colorType = 'primary', options = {}) => {
//     const baseColors = {
//       primary: new THREE.Color(theme.cadColors.primary),
//       secondary: new THREE.Color(theme.cadColors.secondary),
//       tertiary: new THREE.Color(theme.cadColors.tertiary)
//     };
    
//     return new THREE.MeshStandardMaterial({
//       color: baseColors[colorType] || baseColors.primary,
//       roughness: options.roughness || 0.3,
//       metalness: options.metalness || 0.1,
//       transparent: options.transparent || false,
//       opacity: options.opacity || 1.0,
//       side: THREE.DoubleSide,
//       flatShading: false,
//       ...options
//     });
//   }, []);

//   const applyVisualStyle = useCallback((model, style) => {
//     if (!model) return;

//     if (wireframeRef.current) {
//       sceneRef.current.remove(wireframeRef.current);
//       wireframeRef.current = null;
//     }
//     if (edgesRef.current) {
//       sceneRef.current.remove(edgesRef.current);
//       edgesRef.current = null;
//     }

//     if (originalMaterials.size === 0) {
//       model.traverse((child) => {
//         if (child instanceof THREE.Mesh && child.material) {
//           originalMaterials.set(child.uuid, child.material.clone());
//         }
//       });
//       setOriginalMaterials(new Map(originalMaterials));
//     }

//     switch (style) {
//       case 'shaded':
//         model.traverse((child) => {
//           if (child instanceof THREE.Mesh) {
//             child.material = createCADMaterial('primary', {
//               roughness: 0.4,
//               metalness: 0.2
//             });
//             child.visible = true;
//           }
//         });
//         break;

//       case 'shadedWithHiddenEdges':
//         model.traverse((child) => {
//           if (child instanceof THREE.Mesh) {
//             child.material = createCADMaterial('primary', {
//               roughness: 0.4,
//               metalness: 0.2
//             });
//             child.visible = true;
//           }
//         });
//         addEdgesToModel(model, false);
//         break;

//       case 'shadedWithVisibleEdgesOnly':
//         model.traverse((child) => {
//           if (child instanceof THREE.Mesh) {
//             child.material = createCADMaterial('primary', {
//               roughness: 0.4,
//               metalness: 0.2
//             });
//             child.visible = true;
//           }
//         });
//         addEdgesToModel(model, true);
//         break;

//       case 'wireframe':
//         model.traverse((child) => {
//           if (child instanceof THREE.Mesh) {
//             child.material = new THREE.MeshBasicMaterial({
//               color: new THREE.Color(theme.cadColors.wireframeColor),
//               wireframe: true,
//               transparent: true,
//               opacity: 0.8
//             });
//             child.visible = true;
//           }
//         });
//         break;

//       case 'wireframeWithHiddenEdges':
//         model.traverse((child) => {
//           if (child instanceof THREE.Mesh) {
//             child.material = new THREE.MeshBasicMaterial({
//               color: new THREE.Color(theme.cadColors.wireframeColor),
//               wireframe: true,
//               transparent: true,
//               opacity: 0.6
//             });
//             child.visible = true;
//           }
//         });
//         addEdgesToModel(model, false);
//         break;

//       case 'wireframeWithVisibleEdgesOnly':
//         model.traverse((child) => {
//           if (child instanceof THREE.Mesh) {
//             child.material = new THREE.MeshBasicMaterial({
//               color: new THREE.Color(theme.cadColors.wireframeColor),
//               wireframe: true,
//               transparent: true,
//               opacity: 0.6
//             });
//             child.visible = true;
//           }
//         });
//         addEdgesToModel(model, true);
//         break;

//       default:
//         break;
//     }
//   }, [originalMaterials, createCADMaterial]);
  

//   const addEdgesToModel = useCallback((model, visibleOnly = false) => {
//     const edgesGroup = new THREE.Group();
    
//     model.traverse((child) => {
//       if (child instanceof THREE.Mesh && child.geometry) {
//         try {
//           const edges = new THREE.EdgesGeometry(child.geometry, visibleOnly ? 30 : 1);
          
//           const edgeMaterial = new THREE.LineBasicMaterial({
//             color: visibleOnly ? theme.cadColors.edgeColor : theme.cadColors.hiddenEdgeColor,
//             transparent: true,
//             opacity: visibleOnly ? 1.0 : 0.6,
//             linewidth: visibleOnly ? 2 : 1
//           });
          
//           const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
          
//           // Apply the same transformation as the parent mesh
//           edgeLines.position.copy(child.position);
//           edgeLines.rotation.copy(child.rotation);
//           edgeLines.scale.copy(child.scale);
          
//           // Add to the group instead of directly to the scene
//           edgesGroup.add(edgeLines);
//         } catch (error) {
//           console.warn('Error creating edges for mesh:', error);
//         }
//       }
//     });
    
//     if (edgesGroup.children.length > 0) {
//       // Apply the model's transformation to the edges group
//       edgesGroup.position.copy(model.position);
//       edgesGroup.rotation.copy(model.rotation);
//       edgesGroup.scale.copy(model.scale);
      
//       sceneRef.current.add(edgesGroup);
//       edgesRef.current = edgesGroup;
//     }
//   }, []);

//   const handleVisualStyleChange = useCallback((newStyle) => {
//     setVisualStyle(newStyle);
//     if (modelRef.current) {
//       applyVisualStyle(modelRef.current, newStyle);
//     }
//   }, [applyVisualStyle]);

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

//     console.log('Loading GLB model from database with validated ID:', calcId);
//     setIsModelLoaded(false);
//     setIsError(false);
//     setLoadingProgress(0);
//     setLoadingMessage('Connecting to server...');
    
//     const abortController = new AbortController();
//     loadingAbortControllerRef.current = abortController;
    
//     try {
//       setLoadingMessage('Downloading 3D model (GLB format)...');
      
//       const response = await fetch(`http://localhost:5678/download-glb/${calcId}`, {
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
      
//       if (abortController.signal.aborted) {
//         return;
//       }
      
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

//   const loadModelFromArrayBuffer = async (arrayBuffer, calcId, abortController) => {
//     try {
//       if (abortController.signal.aborted) {
//         return;
//       }

//       setLoadingMessage('Parsing GLB model...');
//       setLoadingProgress(75);
      
//       if (!arrayBuffer || arrayBuffer.byteLength === 0) {
//         throw new Error('Received empty or invalid GLB model data');
//       }
      
//       console.log('GLB ArrayBuffer size:', arrayBuffer.byteLength, 'bytes');
      
//       const loader = new GLTFLoader();
      
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
      
//       if (abortController.signal.aborted) {
//         return;
//       }
      
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
//       if (abortController.signal.aborted) {
//         return;
//       }
      
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
//     localStorage.setItem('currentCalculationId', calculationId);
    
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

//     // Clear any existing model with proper cleanup
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

//     // Clear wireframe and edges
//     if (wireframeRef.current) {
//       sceneRef.current.remove(wireframeRef.current);
//       wireframeRef.current = null;
//     }
//     if (edgesRef.current) {
//       sceneRef.current.remove(edgesRef.current);
//       edgesRef.current = null;
//     }

//     // Calculate bounding box and get model dimensions
//     const box = new THREE.Box3().setFromObject(gltfScene);
//     const center = box.getCenter(new THREE.Vector3());
//     const size = box.getSize(new THREE.Vector3());
    
//     console.log('Model bounding box:', {
//       center: center,
//       size: size,
//       min: box.min,
//       max: box.max
//     });
    
//     // Create model group and center the model properly
//     const modelGroup = new THREE.Group();
    
//     // Move the model to origin by negating its center
//     gltfScene.position.copy(center.multiplyScalar(-1));
//     modelGroup.add(gltfScene);
    
//     // Calculate appropriate scale to fit model in viewport
//     const maxDim = Math.max(size.x, size.y, size.z);
    
//     // Use a more conservative scale factor to ensure model fits in view
//     const targetSize = 2; // Reduced from 4 to 2 for better fitting
//     const scale = maxDim > 0 ? targetSize / maxDim : 1;
    
//     console.log('Model scaling:', {
//       maxDim: maxDim,
//       scale: scale,
//       targetSize: targetSize
//     });
    
//     modelGroup.scale.set(scale, scale, scale);
    
//     // Position the group at the origin
//     modelGroup.position.set(0, 0, 0);
    
//     modelRef.current = modelGroup;
    
//     // Update camera position based on model size
//     if (cameraRef.current && controlsRef.current) {
//       const scaledSize = targetSize; // Since we scaled the model to targetSize
      
//       // Calculate optimal camera distance
//       const fov = cameraRef.current.fov * (Math.PI / 180); // Convert to radians
//       const distance = Math.max(
//         scaledSize / (2 * Math.tan(fov / 2)), // Distance to fit height
//         scaledSize / (2 * Math.tan(fov / 2) * cameraRef.current.aspect), // Distance to fit width
//         scaledSize * 2 // Minimum comfortable distance
//       );
      
//       console.log('Camera positioning:', {
//         fov: cameraRef.current.fov,
//         distance: distance,
//         scaledSize: scaledSize
//       });
      
//       // Set camera position
//       cameraRef.current.position.set(distance, distance, distance);
//       cameraRef.current.lookAt(0, 0, 0);
      
//       // Update controls
//       controlsRef.current.target.set(0, 0, 0);
//       controlsRef.current.minDistance = scaledSize * 0.5; // Allow closer inspection
//       controlsRef.current.maxDistance = scaledSize * 10; // Allow zooming out further
//       controlsRef.current.update();
//     }
    
//     // Store original materials and apply CAD-style materials
//     const newOriginalMaterials = new Map();
//     gltfScene.traverse((child) => {
//       if (child instanceof THREE.Mesh && child.material) {
//         // Store the original material
//         newOriginalMaterials.set(child.uuid, child.material.clone());
//         // Replace with light CAD-style material immediately
//         child.material = createCADMaterial('primary', {
//           roughness: 0.4,
//           metalness: 0.2
//         });
//       }
//     });
//     setOriginalMaterials(newOriginalMaterials);
    
//     // Add the model to the scene
//     sceneRef.current.add(modelGroup);
    
//     // Apply current visual style
//     applyVisualStyle(modelGroup, visualStyle);
    
//     console.log('GLB model added to scene successfully with fixed positioning');
//   }, [visualStyle, applyVisualStyle, createCADMaterial]);

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

//     const width = 130; // Reduced from 150
//     const height = 130; // Reduced from 150

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
    
//     // Calculate current position relative to target
//     const offset = camera.position.clone().sub(target);
//     const radius = offset.length();
    
//     // Convert to spherical coordinates for easier manipulation
//     const spherical = new THREE.Spherical().setFromVector3(offset);
    
//     // Define rotation step (in radians)
//     const rotationStep = Math.PI / 12; // 15 degrees
    
//     // Apply rotation based on direction
//     switch (direction) {
//       case 'up':
//         spherical.phi = Math.max(0.1, spherical.phi - rotationStep);
//         break;
//       case 'down':
//         spherical.phi = Math.min(Math.PI - 0.1, spherical.phi + rotationStep);
//         break;
//       case 'left':
//         spherical.theta += rotationStep;
//         break;
//       case 'right':
//         spherical.theta -= rotationStep;
//         break;
//     }
    
//     // Convert back to Cartesian coordinates
//     const newPosition = new THREE.Vector3().setFromSpherical(spherical).add(target);
    
//     // Animate camera movement
//     const startPos = camera.position.clone();
//     const duration = 300;
//     const startTime = performance.now();
    
//     const animateCamera = (currentTime) => {
//       const elapsed = currentTime - startTime;
//       const progress = Math.min(elapsed / duration, 1);
      
//       // Use easing function for smooth animation
//       const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      
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
//     if (!controlsRef.current || !cameraRef.current || !modelRef.current) return;
    
//     const camera = cameraRef.current;
//     const controls = controlsRef.current;
//     const target = controls.target;
    
//     // Calculate model size to determine appropriate distance
//     const box = new THREE.Box3().setFromObject(modelRef.current);
//     const size = box.getSize(new THREE.Vector3());
//     const maxDim = Math.max(size.x, size.y, size.z);
    
//     // Calculate optimal distance based on camera FOV and model size
//     const fov = camera.fov * (Math.PI / 180);
//     const distance = Math.max(
//       maxDim / (2 * Math.tan(fov / 2)) * 1.5, // Add 50% margin
//       maxDim * 2 // Minimum distance
//     );
    
//     let targetPosition = new THREE.Vector3();
//     let targetUp = new THREE.Vector3(0, 1, 0);
    
//     // Define view positions
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
//         // Standard isometric view (45° rotation)
//         targetPosition.set(distance * 0.707, distance * 0.707, distance * 0.707);
//         break;
//       default:
//         return;
//     }
    
//     // Add target offset
//     targetPosition.add(target);
    
//     // Animate camera to new position
//     const startPos = camera.position.clone();
//     const startUp = camera.up.clone();
//     const duration = 500;
//     const startTime = performance.now();
    
//     const animateCamera = (currentTime) => {
//       const elapsed = currentTime - startTime;
//       const progress = Math.min(elapsed / duration, 1);
      
//       // Use smooth easing
//       const easeProgress = 1 - Math.pow(1 - progress, 3);
      
//       camera.position.lerpVectors(startPos, targetPosition, easeProgress);
//       camera.up.lerpVectors(startUp, targetUp, easeProgress);
      
//       camera.lookAt(target);
//       controls.update();
      
//       if (progress < 1) {
//         requestAnimationFrame(animateCamera);
//       }
//     };
    
//     requestAnimationFrame(animateCamera);
//   }, []);

//   // Initialize 3D scene
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
//         antialias: true, 
//         canvas: canvasRef.current,
//         alpha: false,
//         preserveDrawingBuffer: true,
//         powerPreference: "high-performance"
//       });
//       renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//       renderer.setSize(width, height);
//       renderer.shadowMap.enabled = true;
//       renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//       renderer.outputColorSpace = THREE.SRGBColorSpace;
      
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
      
//       // Enhanced lighting for CAD-style visualization
//       const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//       scene.add(ambientLight);

//       const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xf0f0f0, 0.4);
//       scene.add(hemisphereLight);
      
//       // Add multiple directional lights for even illumination
//       const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
//       directionalLight1.position.set(5, 5, 5);
//       directionalLight1.castShadow = true;
//       scene.add(directionalLight1);
      
//       const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
//       directionalLight2.position.set(-5, 5, -5);
//       scene.add(directionalLight2);
      
//       const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.2);
//       directionalLight3.position.set(0, -5, 5);
//       scene.add(directionalLight3);
      
//       // Initialize cube scene
//       cubeScene = initCubeScene();

//       // Only load model if we have a valid costCalculationId
//       if (costCalculationId && costCalculationId !== 'undefined' && costCalculationId !== 'null') {
//         console.log('Loading GLB model with validated calculation ID:', costCalculationId);
//         loadModelFromDatabase(costCalculationId);
//       } else {
//         console.log('No valid calculation ID available, waiting...');
//         setLoadingMessage('Waiting for calculation to complete...');
//       }
      
//       // Animation loop
//       const animate = () => {
//         frameId = requestAnimationFrame(animate);
        
//         // Update cube rotation and sync with main camera
//         if (cubeScene && cubeScene.cube) {
//           cubeScene.cube.rotation.x = cubeRotation.x;
//           cubeScene.cube.rotation.y = cubeRotation.y;
          
//           // Sync cube camera orientation with main camera
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
      
//       // Handle resize
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
//         // Cancel any ongoing loading
//         if (loadingAbortControllerRef.current) {
//           loadingAbortControllerRef.current.abort();
//         }
        
//         // Clear timeout
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

//   // Handle costCalculationId changes with validation
//   useEffect(() => {
//     if (costCalculationId && costCalculationId !== 'undefined' && costCalculationId !== 'null') {
//       localStorage.setItem('currentCalculationId', costCalculationId);
//       console.log('Updated localStorage with validated costCalculationId:', costCalculationId);
      
//       if (sceneRef.current && !isModelLoaded) {
//         setTimeout(() => {
//           loadModelFromDatabase(costCalculationId);
//         }, 100);
//       }
//     } else {
//       localStorage.removeItem('currentCalculationId');
//       console.log('Removed invalid costCalculationId from localStorage');
//     }
//   }, [costCalculationId, isModelLoaded, loadModelFromDatabase]);

//   // Cleanup on unmount
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
//           title="Back to Welcome Page"
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
//             COST ESTIMATION
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
//                 title="3D Model Viewer (GLB Format)" 
//                 extra={
//                   // Visual Style Selector
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//                     <Text style={{ color: theme.textSecondary, fontSize: '14px' }}>
//                       <FiEye style={{ marginRight: '4px' }} />
//                       Visual Style:
//                     </Text>
//                     <Select
//                       value={visualStyle}
//                       onChange={handleVisualStyleChange}
//                       style={{ minWidth: '200px' }}
//                       size="small"
//                       disabled={!isModelLoaded}
//                       dropdownStyle={{
//                         borderRadius: '8px',
//                         boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
//                       }}
//                     >
//                       {Object.entries(VISUAL_STYLES).map(([key, config]) => (
//                         <Option key={key} value={key}>
//                           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                             <span>{config.icon}</span>
//                             <div>
//                               <div style={{ fontWeight: 500 }}>{config.name}</div>
//                               <div style={{ fontSize: '12px', color: theme.textSecondary }}>
//                                 {config.description}
//                               </div>
//                             </div>
//                           </div>
//                         </Option>
//                       ))}
//                     </Select>
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
//                   padding: '0', 
//                   height: 'calc(100% - 65px)', 
//                   position: 'relative',
//                   background: '#f8f9fa'
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
                  
//                   {/* Enhanced 3D Navigation Controls - Fixed positioning */}
//                   <div style={{
//                     position: 'absolute',
//                     top: '16px',
//                     right: '16px',
//                     width: '220px',
//                     height: '220px',
//                     display: isModelLoaded ? 'block' : 'none',
//                     zIndex: 10
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
//                         width: '32px',
//                         height: '32px',
//                         cursor: 'pointer',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         boxShadow: '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
//                         fontSize: '14px',
//                         fontWeight: 'bold',
//                         color: '#145da0',
//                         zIndex: 11,
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
//                         left: '15px',
//                         top: '50%',
//                         transform: 'translateY(-50%)',
//                         background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
//                         border: '2px solid rgba(20, 93, 160, 0.3)',
//                         borderRadius: '50%',
//                         width: '32px',
//                         height: '32px',
//                         cursor: 'pointer',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         boxShadow: '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
//                         fontSize: '14px',
//                         fontWeight: 'bold',
//                         color: '#145da0',
//                         zIndex: 11,
//                         transition: 'all 0.2s ease',
//                         backdropFilter: 'blur(10px)'
//                       }}
//                       title="Move Camera Left"
//                     >
//                       ←
//                     </button>

//                     {/* Cube Container with Rounded Corners - Smaller size */}
//                     <div style={{
//                       position: 'absolute',
//                       left: '50%',
//                       top: '50%',
//                       transform: 'translate(-50%, -50%)',
//                       width: '130px',
//                       height: '130px',
//                       background: theme.modelBg, 
//                       borderRadius: '12px',
//                       overflow: 'hidden',
//                       pointerEvents: 'none',
//                       border: '2px solid rgba(255,255,255,0.3)'
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
//                         right: '15px',
//                         top: '50%',
//                         transform: 'translateY(-50%)',
//                         background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))',
//                         border: '2px solid rgba(20, 93, 160, 0.3)',
//                         borderRadius: '50%',
//                         width: '32px',
//                         height: '32px',
//                         cursor: 'pointer',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         boxShadow: '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
//                         fontSize: '14px',
//                         fontWeight: 'bold',
//                         color: '#145da0',
//                         zIndex: 11,
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
//                         width: '32px',
//                         height: '32px',
//                         cursor: 'pointer',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         boxShadow: '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
//                         fontSize: '14px',
//                         fontWeight: 'bold',
//                         color: '#145da0',
//                         zIndex: 11,
//                         transition: 'all 0.2s ease',
//                         backdropFilter: 'blur(10px)'
//                       }}
//                       title="Move Camera Down"
//                     >
//                       ↓
//                     </button>
//                   </div>

//                   {/* View Controls */}
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

//                   {/* Visual Style Information Panel - FIXED POSITIONING */}
//                   {isModelLoaded && (
//                     <div style={{
//                       position: 'absolute',
//                       top: '16px',
//                       left: '16px',
//                       background: 'rgba(255,255,255,0.95)',
//                       backdropFilter: 'blur(10px)',
//                       padding: '12px 16px',
//                       borderRadius: '8px',
//                       border: '1px solid rgba(20, 93, 160, 0.2)',
//                       boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
//                       maxWidth: '200px',
//                       zIndex: 5,
//                       pointerEvents: 'none'
//                     }}>
//                       <div style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '8px',
//                         marginBottom: '4px'
//                       }}>
//                         <span style={{ fontSize: '16px' }}>
//                           {VISUAL_STYLES[visualStyle].icon}
//                         </span>
//                         <Text style={{ 
//                           fontWeight: 600, 
//                           color: theme.textPrimary,
//                           fontSize: '13px'
//                         }}>
//                           {VISUAL_STYLES[visualStyle].name}
//                         </Text>
//                       </div>
//                       <Text style={{ 
//                         color: theme.textSecondary, 
//                         fontSize: '11px',
//                         lineHeight: '1.4'
//                       }}>
//                         {VISUAL_STYLES[visualStyle].description}
//                       </Text>
//                     </div>
//                   )}
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
//                             Waiting for cost calculation to complete...
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

//             {/* Cost Report Section */}
//             <Col xs={24} lg={12} style={{ height: '100%' }}>
//               <CostReport 
//                 analysisData={analysisData} 
//                 theme={theme} 
//                 onCostCalculationComplete={handleCostCalculationComplete}
//                 costCalculationId={costCalculationId}
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
        
//         /* Enhanced hover effects for visual style dropdown */
//         .ant-select-dropdown .ant-select-item {
//           padding: 8px 12px !important;
//         }
        
//         .ant-select-dropdown .ant-select-item:hover {
//           background-color: rgba(20, 93, 160, 0.08) !important;
//         }
        
//         .ant-select-dropdown .ant-select-item-option-selected {
//           background-color: rgba(20, 93, 160, 0.15) !important;
//           font-weight: 600 !important;
//         }
        
//         /* Custom scrollbar for dropdown */
//         .ant-select-dropdown {
//           scrollbar-width: thin;
//           scrollbar-color: rgba(20, 93, 160, 0.3) transparent;
//         }
        
//         .ant-select-dropdown::-webkit-scrollbar {
//           width: 6px;
//         }
        
//         .ant-select-dropdown::-webkit-scrollbar-track {
//           background: transparent;
//         }
        
//         .ant-select-dropdown::-webkit-scrollbar-thumb {
//           background-color: rgba(20, 93, 160, 0.3);
//           border-radius: 3px;
//         }
        
//         .ant-select-dropdown::-webkit-scrollbar-thumb:hover {
//           background-color: rgba(20, 93, 160, 0.5);
//         }
//       `}</style>
//     </Layout>
//   );
// }

// export default ViewerPage;






//''''this below code is to hight the particular part region but in this whole object is highlighting




// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { useLocation, useParams } from 'react-router-dom';
// import { Layout, Typography, Card, Row, Col } from 'antd';
// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { useNavigate } from 'react-router-dom';
// import { FiArrowLeft } from 'react-icons/fi';
// import CostReport from './CostReport';

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
//   },
//   // Highlighting colors
//   highlightColor: '#0080ff',
//   highlightEmissive: '#004080'
// };

// function ViewerPage() {
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
  
//   // Mouse interaction refs
//   const raycasterRef = useRef(new THREE.Raycaster());
//   const mouseRef = useRef(new THREE.Vector2());
//   const hoveredObjectRef = useRef(null);
//   const originalMaterialsRef = useRef(new Map());
//   const highlightMaterialRef = useRef(null);
  
//   const [isModelLoaded, setIsModelLoaded] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const [loadingMessage, setLoadingMessage] = useState('Waiting for calculation ID...');
//   const [cubeRotation, setCubeRotation] = useState({ x: 0, y: 0 });
//   const [loadingProgress, setLoadingProgress] = useState(0);
//   const [hoveredPart, setHoveredPart] = useState(null);
//   const navigate = useNavigate();
  
//   // Get costCalculationId with validation
//   const [costCalculationId, setCostCalculationId] = useState(() => {
//     const possibleId = id || 
//                       location.state?.costCalculationId || 
//                       localStorage.getItem('currentCalculationId');
    
//     return possibleId && possibleId !== 'undefined' && possibleId !== 'null' 
//       ? possibleId 
//       : null;
//   });

//   const { analysisData } = location.state || {};
//   const [loadingTimeout, setLoadingTimeout] = useState(null);

//   // Create highlight material
//   const createHighlightMaterial = useCallback(() => {
//     if (!highlightMaterialRef.current) {
//       highlightMaterialRef.current = new THREE.MeshStandardMaterial({
//         color: new THREE.Color(theme.highlightColor),
//         emissive: new THREE.Color(theme.highlightEmissive),
//         emissiveIntensity: 0.3,
//         roughness: 0.4,
//         metalness: 0.6,
//         transparent: true,
//         opacity: 0.9
//       });
//     }
//     return highlightMaterialRef.current;
//   }, []);

//   // Store original materials and prepare for highlighting
//   const storeOriginalMaterials = useCallback((object) => {
//     object.traverse((child) => {
//       if (child instanceof THREE.Mesh && child.material) {
//         // Store original material
//         originalMaterialsRef.current.set(child.uuid, child.material);
        
//         // Make object interactive
//         child.userData.interactive = true;
//         child.userData.originalColor = child.material.color ? child.material.color.clone() : new THREE.Color(0x888888);
//       }
//     });
//   }, []);

//   // Highlight object
//   const highlightObject = useCallback((object) => {
//     if (object && object.material && originalMaterialsRef.current.has(object.uuid)) {
//       object.material = createHighlightMaterial();
//     }
//   }, [createHighlightMaterial]);

//   // Restore original material
//   const restoreOriginalMaterial = useCallback((object) => {
//     if (object && originalMaterialsRef.current.has(object.uuid)) {
//       object.material = originalMaterialsRef.current.get(object.uuid);
//     }
//   }, []);

//   // Handle mouse move for highlighting
//   const handleMouseMove = useCallback((event) => {
//     if (!canvasRef.current || !sceneRef.current || !cameraRef.current || !isModelLoaded) return;

//     const rect = canvasRef.current.getBoundingClientRect();
//     const mouse = mouseRef.current;
    
//     // Calculate mouse position in normalized device coordinates (-1 to +1)
//     mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
//     mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

//     // Update raycaster
//     const raycaster = raycasterRef.current;
//     raycaster.setFromCamera(mouse, cameraRef.current);

//     // Find intersections with interactive objects
//     const intersectableObjects = [];
//     if (modelRef.current) {
//       modelRef.current.traverse((child) => {
//         if (child instanceof THREE.Mesh && child.userData.interactive) {
//           intersectableObjects.push(child);
//         }
//       });
//     }

//     const intersects = raycaster.intersectObjects(intersectableObjects);
    
//     // Handle highlighting
//     if (intersects.length > 0) {
//       const newHoveredObject = intersects[0].object;
      
//       // If we're hovering over a different object
//       if (hoveredObjectRef.current !== newHoveredObject) {
//         // Restore previous object
//         if (hoveredObjectRef.current) {
//           restoreOriginalMaterial(hoveredObjectRef.current);
//         }
        
//         // Highlight new object
//         hoveredObjectRef.current = newHoveredObject;
//         highlightObject(newHoveredObject);
        
//         // Update cursor and part info
//         canvasRef.current.style.cursor = 'pointer';
//         setHoveredPart({
//           name: newHoveredObject.name || 'Part',
//           uuid: newHoveredObject.uuid,
//           position: intersects[0].point
//         });
//       }
//     } else {
//       // No intersection - restore previous object and clear hover
//       if (hoveredObjectRef.current) {
//         restoreOriginalMaterial(hoveredObjectRef.current);
//         hoveredObjectRef.current = null;
//         canvasRef.current.style.cursor = 'default';
//         setHoveredPart(null);
//       }
//     }
//   }, [isModelLoaded, highlightObject, restoreOriginalMaterial]);

//   // Handle mouse click for selection
//   const handleMouseClick = useCallback((event) => {
//     if (!canvasRef.current || !sceneRef.current || !cameraRef.current || !isModelLoaded) return;

//     const rect = canvasRef.current.getBoundingClientRect();
//     const mouse = mouseRef.current;
    
//     mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
//     mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

//     const raycaster = raycasterRef.current;
//     raycaster.setFromCamera(mouse, cameraRef.current);

//     const intersectableObjects = [];
//     if (modelRef.current) {
//       modelRef.current.traverse((child) => {
//         if (child instanceof THREE.Mesh && child.userData.interactive) {
//           intersectableObjects.push(child);
//         }
//       });
//     }

//     const intersects = raycaster.intersectObjects(intersectableObjects);
    
//     if (intersects.length > 0) {
//       const clickedObject = intersects[0].object;
//       console.log('Clicked on part:', clickedObject.name || 'Unnamed Part');
//       console.log('Part UUID:', clickedObject.uuid);
//       console.log('Intersection point:', intersects[0].point);
      
//       // You can add more click handling logic here
//       // For example, showing part details in a popup, selecting for further operations, etc.
//     }
//   }, [isModelLoaded]);

//   // Enhanced model loading with GLB format support
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

//     console.log('Loading GLB model from database with validated ID:', calcId);
//     setIsModelLoaded(false);
//     setIsError(false);
//     setLoadingProgress(0);
//     setLoadingMessage('Connecting to server...');
    
//     const abortController = new AbortController();
//     loadingAbortControllerRef.current = abortController;
    
//     try {
//       setLoadingMessage('Downloading 3D model (GLB format)...');
      
//       const response = await fetch(`http://localhost:5678/download-glb/${calcId}`, {
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
      
//       if (abortController.signal.aborted) {
//         return;
//       }
      
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

//   // Load model from ArrayBuffer
//   const loadModelFromArrayBuffer = async (arrayBuffer, calcId, abortController) => {
//     try {
//       if (abortController.signal.aborted) {
//         return;
//       }

//       setLoadingMessage('Parsing GLB model...');
//       setLoadingProgress(75);
      
//       if (!arrayBuffer || arrayBuffer.byteLength === 0) {
//         throw new Error('Received empty or invalid GLB model data');
//       }
      
//       console.log('GLB ArrayBuffer size:', arrayBuffer.byteLength, 'bytes');
      
//       const loader = new GLTFLoader();
      
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
      
//       if (abortController.signal.aborted) {
//         return;
//       }
      
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
//       if (abortController.signal.aborted) {
//         return;
//       }
      
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

//   // Handle cost calculation completion
//   const handleCostCalculationComplete = useCallback((calculationId) => {
//     console.log('Cost calculation completed with ID:', calculationId);
    
//     if (!calculationId || calculationId === 'undefined' || calculationId === 'null') {
//       console.error('Invalid calculation ID received:', calculationId);
//       setIsError(true);
//       setLoadingMessage('Invalid calculation ID received.');
//       return;
//     }
    
//     setCostCalculationId(calculationId);
//     localStorage.setItem('currentCalculationId', calculationId);
    
//     if (loadingTimeout) {
//       clearTimeout(loadingTimeout);
//     }
    
//     const timeout = setTimeout(() => {
//       loadModelFromDatabase(calculationId);
//     }, 500);
    
//     setLoadingTimeout(timeout);
//   }, [loadModelFromDatabase, loadingTimeout]);

//   // Process and add the loaded GLTF scene with interactive setup
//   const processAndAddModel = useCallback((gltfScene) => {
//     if (!sceneRef.current) return;

//     // Clear any existing model with proper cleanup
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

//     // Clear previous materials cache
//     originalMaterialsRef.current.clear();
//     hoveredObjectRef.current = null;

//     // Calculate bounding box and center the model
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
    
//     // Update camera and controls
//     if (controlsRef.current) {
//       controlsRef.current.target.set(0, 0, 0);
//     }
    
//     if (cameraRef.current) {
//       const distance = 4 * 1.5;
//       cameraRef.current.position.set(distance, distance, distance);
//       cameraRef.current.lookAt(0, 0, 0);
      
//       if (controlsRef.current) {
//         controlsRef.current.minDistance = maxDim * 0.001;
//         controlsRef.current.maxDistance = maxDim * 1;
//         controlsRef.current.update();
//       }
//     }
    
//     // Apply materials and setup interactivity
//     const sharedMaterial = new THREE.MeshStandardMaterial({
//       color: new THREE.Color(theme.cubeColors.top),
//       roughness: 0.6,
//       metalness: 0.4
//     });
    
//     // Process each mesh for interactivity
//     let partIndex = 0;
//     gltfScene.traverse((child) => {
//       if (child instanceof THREE.Mesh) {
//         // Apply material
//         child.material = sharedMaterial.clone(); // Clone to allow individual highlighting
        
//         // Setup interactivity
//         child.userData.interactive = true;
//         child.userData.partIndex = partIndex++;
//         child.name = child.name || `Part_${child.userData.partIndex}`;
        
//         // Store raycast-friendly geometry
//         if (child.geometry) {
//           child.geometry.computeBoundingSphere();
//           child.geometry.computeBoundingBox();
//         }
//       }
//     });
    
//     // Store original materials after setup
//     storeOriginalMaterials(gltfScene);
    
//     // Add the model to the scene
//     sceneRef.current.add(modelGroup);
//     console.log('GLB model added to scene with interactive highlighting');
//   }, [storeOriginalMaterials]);

//   // Create text texture for cube faces (memoized)
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

//   // Create rounded cube geometry (memoized)
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

//   // Create cube scene with text labels
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

//   // Move camera around the model
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

//   // Initialize 3D scene
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

//       // Add mouse event listeners for interaction
//       canvasRef.current.addEventListener('mousemove', handleMouseMove);
//       canvasRef.current.addEventListener('click', handleMouseClick);

//       if (costCalculationId && costCalculationId !== 'undefined' && costCalculationId !== 'null') {
//         console.log('Loading GLB model with validated calculation ID:', costCalculationId);
//         loadModelFromDatabase(costCalculationId);
//       } else {
//         console.log('No valid calculation ID available, waiting...');
//         setLoadingMessage('Waiting for calculation to complete...');
//       }
      
//       const animate = () => {
//         frameId = requestAnimationFrame(animate);
        
//         // Update cube rotation and sync with main camera
//         if (cubeScene && cubeScene.cube) {
//           cubeScene.cube.rotation.x = cubeRotation.x;
//           cubeScene.cube.rotation.y = cubeRotation.y;
          
//           // Sync cube camera orientation with main camera
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
      
//       // Handle resize
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
//         // Cancel any ongoing loading
//         if (loadingAbortControllerRef.current) {
//           loadingAbortControllerRef.current.abort();
//         }
        
//         // Clear timeout
//         if (loadingTimeout) {
//           clearTimeout(loadingTimeout);
//         }
        
//         // Remove mouse event listeners
//         if (canvasRef.current) {
//           canvasRef.current.removeEventListener('mousemove', handleMouseMove);
//           canvasRef.current.removeEventListener('click', handleMouseClick);
//         }
        
//         // Clear highlighting references
//         if (hoveredObjectRef.current) {
//           restoreOriginalMaterial(hoveredObjectRef.current);
//           hoveredObjectRef.current = null;
//         }
//         originalMaterialsRef.current.clear();
        
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
//   }, [costCalculationId, initCubeScene, loadModelFromDatabase, cubeRotation, loadingTimeout, handleMouseMove, handleMouseClick, restoreOriginalMaterial]);

//   // Handle costCalculationId changes with validation
//   useEffect(() => {
//     if (costCalculationId && costCalculationId !== 'undefined' && costCalculationId !== 'null') {
//       localStorage.setItem('currentCalculationId', costCalculationId);
//       console.log('Updated localStorage with validated costCalculationId:', costCalculationId);
      
//       if (sceneRef.current && !isModelLoaded) {
//         setTimeout(() => {
//           loadModelFromDatabase(costCalculationId);
//         }, 100);
//       }
//     } else {
//       localStorage.removeItem('currentCalculationId');
//       console.log('Removed invalid costCalculationId from localStorage');
//     }
//   }, [costCalculationId, isModelLoaded, loadModelFromDatabase]);

//   // Handle face clicks
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

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (loadingAbortControllerRef.current) {
//         loadingAbortControllerRef.current.abort();
//       }
      
//       if (loadingTimeout) {
//         clearTimeout(loadingTimeout);
//       }
      
//       // Clear highlighting
//       if (hoveredObjectRef.current) {
//         restoreOriginalMaterial(hoveredObjectRef.current);
//       }
//       originalMaterialsRef.current.clear();
//       modelCacheRef.current.clear();
//     };
//   }, [loadingTimeout, restoreOriginalMaterial]);

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
//           title="Back to Welcome Page"
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
//             COST ESTIMATION
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
                  
//                   {/* Part Information Tooltip */}
//                   {hoveredPart && (
//                     <div style={{
//                       position: 'absolute',
//                       top: '10px',
//                       left: '10px',
//                       background: 'rgba(0, 0, 0, 0.8)',
//                       color: 'white',
//                       padding: '8px 12px',
//                       borderRadius: '6px',
//                       fontSize: '12px',
//                       fontFamily: 'monospace',
//                       backdropFilter: 'blur(5px)',
//                       border: '1px solid rgba(255, 255, 255, 0.2)',
//                       zIndex: 100
//                     }}>
//                       <div>Part: {hoveredPart.name}</div>
//                       <div>ID: {hoveredPart.uuid.substring(0, 8)}...</div>
//                       {hoveredPart.faceIndex !== undefined && (
//                         <div>Face: {hoveredPart.faceIndex}</div>
//                       )}
//                     </div>
//                   )}
                  
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
//                       pointerEvents: 'none',
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

//                   {/* View Controls */}
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

//             {/* Cost Report Section */}
//             <Col xs={24} lg={12} style={{ height: '100%' }}>
//               <CostReport 
//                 analysisData={analysisData} 
//                 theme={theme} 
//                 onCostCalculationComplete={handleCostCalculationComplete}
//                 costCalculationId={costCalculationId}
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

// export default ViewerPage;
