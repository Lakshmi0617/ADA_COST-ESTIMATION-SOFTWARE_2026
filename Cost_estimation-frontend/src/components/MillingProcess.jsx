











// //'''''newupdated code''''''''
// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import {
//   Layout, Upload, Button, Select, InputNumber, Form, Typography, message, Card, Row, Col, Spin, Tooltip, Tag, Modal, Input
// } from 'antd';


// const { Content } = Layout;
// const { Title, Text, Paragraph } = Typography;
// const { Option } = Select;
// const { Dragger } = Upload;

// // Updated theme colors to match navbar design
// const theme = {              // main background color
//   // cardBg: '#73b6ca',                   // card background color  
//   // containerBg: '#73b6ca',              // container background
//   textPrimary: '#000000',              // black text
//   textSecondary: '#000000',            // black text secondary
//   darkGray: '#000000',                 // black for strong text
//   softBlack: '#000000',                // black muted
//   darkNavy: '#000000',                 // black for text contrast
//   darkNavySecondary: '#73b6ca',        // light blue for borders/secondary
//   buttonPrimary: '#246679',            // primary button color
//   buttonSecondary: '#73b6ca',          // secondary elements
//   borderColor: '#246679',              // border color
//   white: '#ffffff',
//   shadow: '0 2px 12px rgba(36, 102, 121, 0.15)',
//   glowShadow: '0 0 10px rgba(36, 102, 121, 0.2)',
//   lightBackground: '#73b6ca',           // light background
//     // background: '#73b6ca',   
// };

// function UploadPage() {
//   const navigate = useNavigate();
//   const [form] = Form.useForm();
//   const [materialForm] = Form.useForm();
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
//   const fileInputRef = useRef(null);

//   // Material state
//   const [materials, setMaterials] = useState([]);
//   const [selectedMaterialId, setSelectedMaterialId] = useState(null);
//   const [selectedMaterialName, setSelectedMaterialName] = useState(null);
//   const [density, setDensity] = useState(null);

//   // Modal state for adding new material
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isAddingMaterial, setIsAddingMaterial] = useState(false);

//   // Updated API endpoints
//   const API_URL = 'http://localhost:5678';
//   const ANALYZE_URL = 'http://localhost:5678/analyze-step/';
//   const CONVERT_URL = 'http://localhost:5000/convert';      

//   // Customized material selection rendering
//   const renderMaterialOption = (material) => {
//     return (
//       <div style={{ padding: '8px 4px' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//           <span style={{ fontWeight: 500, color: theme.textPrimary }}>{material.label}</span>
//           <Tag style={{ 
//             background: theme.buttonPrimary, 
//             color: theme.white, 
//             border: 'none',
//             borderRadius: '4px'
//           }}>
//             {material.density} kg/m³
//           </Tag>
//         </div>
//         <div style={{ 
//           fontSize: '12px', 
//           color: theme.textPrimary,
//           marginTop: '4px',
//           whiteSpace: 'normal',
//           lineHeight: '1.4'
//         }}>
//           {material.specification}
//         </div>
//       </div>
//     );
//   };

//   // Fetch materials function
//   useEffect(() => {
//     const fetchMaterials = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/materials`);
//         console.log('Fetched materials:', response.data);

//         if (Array.isArray(response.data)) {
//           const formattedMaterials = response.data.map(item => ({
//             id: item.id,
//             value: item.material,
//             label: item.material,
//             specification: item.material_specification,
//             density: item.density,
//             searchText: `${item.material.toLowerCase()} ${item.material_specification.toLowerCase()} ${item.density}`
//           }));
//           setMaterials(formattedMaterials);
//         } else {
//           console.error('Unexpected response structure:', response.data);
//           message.error('Failed to load materials. Please refresh the page.');
//         }
//       } catch (error) {
//         console.error('Error fetching materials:', error);
//         message.error('Failed to load materials from server.');
//       }
//     };

//     fetchMaterials();
//   }, []);

//   // Custom search filter for the Select component
//   const filterOption = (input, option) => {
//     const material = materials.find(m => m.value === option.value);
//     if (!material) return false;
//     return material.searchText.includes(input.toLowerCase());
//   };

//   // Handle material selection
//   const handleMaterialChange = (value) => {
//     console.log('Selected material:', value);

//     const selectedMaterial = materials.find(mat => mat.value === value);
//     if (selectedMaterial) {
//       setSelectedMaterialId(selectedMaterial.id);
//       setSelectedMaterialName(selectedMaterial.value);
//       setDensity(selectedMaterial.density);

//       message.success(`Material selected: ${selectedMaterial.value} (Density: ${selectedMaterial.density} kg/m³)`);
//     }
//   };

//   // Handle adding new material
//   const handleAddMaterial = async (values) => {
//     setIsAddingMaterial(true);
//     try {
//       const response = await axios.post(`${API_URL}/materials`, {
//         material: values.material,
//         material_specification: values.material_specification,
//         density: values.density,
//         mrr: values.mrr || 0,
//         material_cost: values.material_cost || 0
//       });

//       if (response.status === 200 || response.status === 201) {
//         message.success('Material added successfully!');

//         // Refresh materials list
//         const materialsResponse = await axios.get(`${API_URL}/materials`);
//         if (Array.isArray(materialsResponse.data)) {
//           const formattedMaterials = materialsResponse.data.map(item => ({
//             id: item.id,
//             value: item.material,
//             label: item.material,
//             specification: item.material_specification,
//             density: item.density,
//             searchText: `${item.material.toLowerCase()} ${item.material_specification.toLowerCase()} ${item.density}`
//           }));
//           setMaterials(formattedMaterials);
//         }

//         setIsModalVisible(false);
//         materialForm.resetFields();
//       }
//     } catch (error) {
//       console.error('Error adding material:', error);
//       message.error('Failed to add material. Please try again.');
//     } finally {
//       setIsAddingMaterial(false);
//     }
//   };

//   const beforeUpload = (file) => {
//     const isValidFile = file.name.toLowerCase().endsWith('.step') || 
//                        file.name.toLowerCase().endsWith('.stp') || 
//                        file.name.toLowerCase().endsWith('.stl');
//     if (!isValidFile) {
//       message.error('Only STEP/STP/STL files are allowed!');
//       return Upload.LIST_IGNORE;
//     }

//     const isLt50MB = file.size / 1024 / 1024 < 50;
//     if (!isLt50MB) {
//       message.error('File must be smaller than 50MB!');
//       return Upload.LIST_IGNORE;
//     }

//     setSelectedFile(file);
//     setUploadStatus('success');
//     form.setFields([{ name: 'upload', errors: [] }]);
//     return false;
//   };

//   const onRemoveFile = () => {
//     setSelectedFile(null);
//     setUploadStatus('idle');
//   };

//   const handleSubmit = async (values) => {
//     if (!selectedFile) {
//       message.error('Please upload a STEP/STP/STL file.');
//       return;
//     }

//     if (!selectedMaterialId) {
//       message.error('Please select a material.');
//       return;
//     }

//     setIsLoading(true);
//     setUploadStatus('uploading');

//     try {
//       // Step 1: Convert the file to OBJ for 3D rendering
//       const convertFormData = new FormData();
//       convertFormData.append('file', selectedFile);

//       const convertResponse = await axios.post(CONVERT_URL, convertFormData, {
//         responseType: 'blob',
//       });

//       if (convertResponse.status !== 200) {
//         throw new Error(`Conversion failed: Status ${convertResponse.status}`);
//       }

//       const objUrl = URL.createObjectURL(convertResponse.data);

//       // Step 2: Analyze the STEP file with the new endpoint
//       const analyzeFormData = new FormData();
//       analyzeFormData.append('file', selectedFile);
//       analyzeFormData.append('material_id', selectedMaterialId);
//       analyzeFormData.append('quantity', '1'); // Default quantity

//       const analyzeResponse = await axios.post(ANALYZE_URL, analyzeFormData);

//       console.log('Analysis result:', analyzeResponse.data);

//       // Step 3: Navigate to the viewer page with analysis data
//       const calculationId = analyzeResponse.data.id;
//       localStorage.setItem('currentCalculationId', calculationId);

//       navigate(`/viewer/${analyzeResponse.data.id}`, { 
//         state: { 
//           objUrl: objUrl,  // Keep as fallback
//           originalFilename: selectedFile.name,
//           materialName: selectedMaterialName,
//           quantity: 1,
//           density: density,
//           analysisData: analyzeResponse.data
//         }
//       });

//       setUploadStatus('success');
//     } catch (err) {
//       console.error('API error:', err);

//       let errorMessage = 'An error occurred during processing.';
//       if (err.response) {
//         errorMessage = `Server error: ${err.response.status}`;
//         try {
//           const errorData = err.response.data;
//           if (typeof errorData === 'object' && errorData.detail) {
//             errorMessage = errorData.detail;
//           }
//         } catch (e) {
//           // Unable to parse error data
//         }
//       } else if (err.request) {
//         errorMessage = 'No response received from the server. Is it running?';
//       } else {
//         errorMessage = err.message || errorMessage;
//       }

//       message.error(errorMessage);
//       setUploadStatus('error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const CloudUploadIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={theme.buttonPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
//       <polyline points="8 16 12 12 16 16"></polyline>
//       <line x1="12" y1="12" x2="12" y2="21"></line>
//     </svg>
//   );

//   const CheckIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//       <polyline points="22 4 12 14.01 9 11.01" />
//     </svg>
//   );

//   const PlusIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <line x1="12" y1="5" x2="12" y2="19"></line>
//       <line x1="5" y1="12" x2="19" y2="12"></line>
//     </svg>
//   );

//     const handleBackToModules = () => {
//     navigate('/home/machining');
//   };


//   return (
//     <Layout style={{ 
//       minHeight: '92vh', 
//       background: theme.background,
//       overflow: 'auto'
//     }}>
//       <Layout style={{ overflow: 'visible' }}>
//         <Content style={{ 
//           padding: '16px 32px 32px',
//           overflow: 'initial',
//           background: theme.background
//         }}>
//           <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

//             {/* Upload Section */}
//             <div style={{ marginBottom: '40px' }}>
//                   <button
//             onClick={handleBackToModules}
//             className="flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-100"
//             style={{color: '#246679'}}
//           >
//             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
//             </svg>
//             <span className="font-semibold">Back to Modules</span>
//           </button>

//               <Title level={2} style={{ 
//                 marginBottom: '4px', 
//                 color: theme.textPrimary,
//               }}>
//                 {/* Upload your file for Milling Process  */}
//               </Title>
//               <Paragraph style={{ 
//                 marginBottom: '16px', 
//                 color: theme.textPrimary,
//                 fontSize: '16px'
//               }}>
//                 {/* Upload files to get instant CNC machining quotation and unleash the magic of manufacturing */}
//               </Paragraph>

//              <Card 
//   style={{ 
//     borderRadius: '12px',
//     boxShadow: theme.glowShadow,
//     border: `2px solid ${theme.buttonPrimary}`,
//     background: theme.cardBg,
//     overflow: 'visible',
//     marginTop: '10px',
//     marginLeft: '32px',    // Add left margin only to the card
//     marginRight: '32px'    // Add right margin only to the card
//   }}
//   bodyStyle={{ padding: '0' }}
// >
//                 <div style={{ 
//                   padding: '20px 32px', 
//                   background: theme.containerBg,
//                   borderRadius: '12px 12px 0 0', 
//                   textAlign: 'center',
//                   border: `1px solid ${theme.buttonPrimary}`,
//                   boxShadow: `inset 0 0 20px rgba(36, 102, 121, 0.1)`
//                 }}>
//                   {/* STEP/STP File Upload Area */}
//                   <Dragger
//                     name="file"
//                     multiple={false}
//                     beforeUpload={beforeUpload}
//                     onRemove={onRemoveFile}
//                     fileList={selectedFile ? [selectedFile] : []}
//                     style={{ 
//                       background: 'transparent',
//                       border: `2px dashed ${theme.buttonPrimary}`,
//                       borderRadius: '12px',
//                       padding: '30px 20px',
//                       boxShadow: `0 0 15px rgba(36, 102, 121, 0.2)`
//                     }}
//                   >
//                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
//                       {uploadStatus === 'success' ? <CheckIcon /> : <CloudUploadIcon />}

//                       <Title level={4} style={{ 
//                         margin: '16px 0 8px', 
//                         textAlign: 'center', 
//                         color: theme.textPrimary,
//                       }}>
//                         {uploadStatus === 'success' ? 'File uploaded successfully!' : 'Drag and drop files to upload, or'}
//                       </Title>

//                       {uploadStatus !== 'success' && (
//                         <Button 
//                           type="primary" 
//                           size="large"
//                           style={{ 
//                             background: theme.buttonPrimary,
//                             borderColor: theme.buttonPrimary,
//                             borderRadius: '8px',
//                             height: '58px',
//                             marginTop: '8px',
//                             marginBottom: '16px',
//                             fontWeight: 500,
//                             color: theme.white,
//                             boxShadow: `0 4px 15px rgba(36, 102, 121, 0.3)`,
//                             transition: 'all 0.3s ease'
//                           }}
//                           onMouseEnter={(e) => {
//                             e.target.style.background = '#1a5661';
//                           }}
//                           onMouseLeave={(e) => {
//                             e.target.style.background = theme.buttonPrimary;
//                           }}
//                         >
//                           Browse Files
//                         </Button>
//                       )}

//                       {uploadStatus === 'success' && (
//                         <Text style={{ 
//                           marginBottom: '16px', 
//                           color: theme.textPrimary,
//                           fontSize: '14px'
//                         }}>
//                           Selected file: {selectedFile?.name}
//                         </Text>
//                       )}

//                       <Text style={{ 
//                         color: theme.textPrimary, 
//                         marginBottom: '8px',
//                         fontSize: '14px'
//                       }}>
//                         File types: STEP, IGES, STL
//                       </Text>

//                       <Text style={{ 
//                         color: theme.textPrimary, 
//                         fontSize: '12px' 
//                       }}>

//                       </Text>
//                     </div>
//                   </Dragger>
//                 </div>

//                 {/* Form Card */}
//                 <div style={{ 
//                   padding: '20px 32px', 
//                   overflow: 'visible',
//                   background: theme.cardBg
//                 }}>
//                   <Form
//                     form={form}
//                     layout="vertical"
//                     onFinish={handleSubmit}
//                     requiredMark={false}
//                     style={{ maxWidth: '800px', margin: '0 auto', overflow: 'visible' }}
//                   >
//                     <Row gutter={[24, 8]}>
//                       <Col xs={24} sm={24} md={16} style={{ overflow: 'visible' }}>
//                         <Form.Item
//                           name="material"
//                           label={
//                             <div style={{ display: 'flex', alignItems: 'center' }}>
//                               <span style={{ 
//                                 fontWeight: 500, 
//                                 color: theme.textPrimary,
//                                 fontSize: '16px'
//                               }}>
//                                 Material
//                               </span>
//                               <Tooltip title="Select a material specification from the dropdown. You can search by material type, specification code, or density.">
//                                 <span style={{ 
//                                   marginLeft: '8px',
//                                   cursor: 'help',
//                                   color: theme.buttonPrimary,
//                                   fontSize: '16px'
//                                 }}>ⓘ</span>
//                               </Tooltip>
//                             </div>
//                           }
//                           rules={[{ required: true, message: 'Please select a material' }]}
//                           style={{ marginBottom: '12px' }}
//                         >
//                           <Select 
//                             placeholder="Search by material, specification, or density..."
//                             style={{ width: '100%' }}
//                             dropdownStyle={{ 
//                               borderRadius: '8px',
//                               maxHeight: '400px',
//                               overflowY: 'auto',
//                               border: `1px solid ${theme.buttonPrimary}`,
//                               boxShadow: theme.glowShadow
//                             }}
//                             size="large"
//                             onChange={handleMaterialChange}
//                             showSearch
//                             filterOption={filterOption}
//                             optionLabelProp="label"
//                             notFoundContent={
//                               <div style={{ 
//                                 padding: '16px', 
//                                 textAlign: 'center',
//                                 color: theme.textPrimary
//                               }}>
//                                 No matching materials found
//                               </div>
//                             }
//                             dropdownRender={menu => (
//                               <div>
//                                 <div style={{ 
//                                   padding: '12px 12px 4px',
//                                   borderBottom: `1px solid ${theme.buttonPrimary}`,
//                                   fontWeight: 500,
//                                   color: theme.textPrimary,
//                                   background: theme.containerBg
//                                 }}>
//                                   Select Material 
//                                 </div>
//                                 {menu}
//                               </div>
//                             )}
//                           >
//                             {materials.map((material) => (
//                               <Option 
//                                 key={material.id} 
//                                 value={material.value}
//                                 label={material.label}
//                                 title={`${material.label} - ${material.specification} (${material.density} kg/m³)`}
//                               >
//                                 {renderMaterialOption(material)}
//                               </Option>
//                             ))}
//                           </Select>
//                         </Form.Item>
//                       </Col>
//                       <Col xs={24} sm={24} md={8} style={{ overflow: 'visible' }}>
//                         <Form.Item
//                           label={<span style={{ 
//                             fontWeight: 500, 
//                             color: theme.textPrimary,
//                             fontSize: '16px'
//                           }}>
//                             Add Material
//                           </span>}
//                           style={{ marginBottom: '12px' }}
//                         >
//                           <Button 
//                             type="primary"
//                             size="large"
//                             icon={<PlusIcon />}
//                             onClick={() => setIsModalVisible(true)}
//                             style={{ 
//                               width: '100%',
//                               background: theme.buttonPrimary,
//                               borderColor: theme.buttonPrimary,
//                               color: theme.white,
//                               fontWeight: 500,
//                               boxShadow: `0 4px 15px rgba(36, 102, 121, 0.3)`,
//                               transition: 'all 0.3s ease'
//                             }}
//                             onMouseEnter={(e) => {
//                               e.target.style.background = '#1a5661';
//                             }}
//                             onMouseLeave={(e) => {
//                               e.target.style.background = theme.buttonPrimary;
//                             }}
//                           >
//                             Add New Material
//                           </Button>
//                         </Form.Item>
//                       </Col>
//                     </Row>

//                     {/* When a material is selected, show a summary card */}
//                     {selectedMaterialId && (
//                       <div style={{ 
//                         marginTop: '16px', 
//                         marginBottom: '24px',
//                         padding: '16px',
//                         borderRadius: '8px',
//                         background: theme.containerBg,
//                         border: `1px solid ${theme.buttonPrimary}`,
//                         boxShadow: `0 0 15px rgba(36, 102, 121, 0.2)`
//                       }}>
//                         <Row gutter={[16, 8]}>
//                           <Col span={12}>
//                             <Text style={{ color: theme.textPrimary }}>Selected Material:</Text>
//                             <div style={{ 
//                               fontWeight: 500, 
//                               marginTop: '4px',
//                               color: theme.textPrimary
//                             }}>
//                               {selectedMaterialName}
//                             </div>
//                           </Col>
//                           <Col span={12}>
//                             <Text style={{ color: theme.textPrimary }}>Density:</Text>
//                             <div style={{ 
//                               fontWeight: 500, 
//                               marginTop: '4px',
//                               color: theme.textPrimary
//                             }}>
//                               {density} kg/m³
//                             </div>
//                           </Col>
//                           <Col span={24} style={{ marginTop: '8px' }}>
//                             <Text style={{ color: theme.textPrimary }}>Material Specification:</Text>
//                             <div style={{ 
//                               fontWeight: 500, 
//                               marginTop: '4px',
//                               color: theme.textPrimary
//                             }}>
//                               {materials.find(m => m.id === selectedMaterialId)?.specification || 'N/A'}
//                             </div>
//                           </Col>
//                         </Row>
//                       </div>
//                     )}

//                     <Form.Item style={{ marginTop: '16px', textAlign: 'center', marginBottom: '0' }}>
//                       <Button
//                         type="primary"
//                         htmlType="submit"
//                         loading={isLoading}
//                         disabled={isLoading || !selectedFile}
//                         size="large"
//                         style={{ 
//                           height: '48px', 
//                           padding: '0 48px',
//                           borderRadius: '8px',
//                           fontSize: '16px',
//                           background: theme.buttonPrimary,
//                           borderColor: theme.buttonPrimary,
//                           color: theme.white,
//                           fontWeight: 500,
//                           boxShadow: '0 4px 12px rgba(36, 102, 121, 0.5)',
//                           transition: 'all 0.3s ease'
//                         }}
//                         onMouseEnter={(e) => {
//                           if (!isLoading && selectedFile) {
//                             e.target.style.background = '#1a5661';
//                           }
//                         }}
//                         onMouseLeave={(e) => {
//                           if (!isLoading && selectedFile) {
//                             e.target.style.background = theme.buttonPrimary;
//                           }
//                         }}
//                       >
//                         {isLoading ? 'Analyzing...' : 'Analyze & Get Quote'}
//                       </Button>
//                     </Form.Item>
//                   </Form>
//                 </div>
//               </Card>
//             </div>
//             <div style={{ height: '16px' }}></div>
//           </div>
//         </Content>
//       </Layout>

//       {/* Add Material Modal - ENHANCED with MRR and Material Cost */}
//       <Modal
//         title={
//           <span style={{ 
//             color: theme.textPrimary, 
//             fontWeight: 600,
//             fontSize: '18px'
//           }}>
//             Add New Material
//           </span>
//         }
//         open={isModalVisible}
//         onCancel={() => {
//           setIsModalVisible(false);
//           materialForm.resetFields();
//         }}
//         footer={null}
//         width={600}
//         style={{
//           borderRadius: '12px',
//         }}
//         bodyStyle={{
//           padding: '20px',
//           background: theme.cardBg,
//           maxHeight: '70vh',
//           overflowY: 'auto'
//         }}
//       >
//         <Form
//           form={materialForm}
//           layout="vertical"
//           onFinish={handleAddMaterial}
//           style={{ marginTop: '16px' }}
//         >
//           <Row gutter={[16, 0]}>
//             <Col span={24}>
//               <Form.Item
//                 name="material"
//                 label={<span style={{ fontWeight: 500, color: theme.textPrimary }}>Material Name</span>}
//                 rules={[{ required: true, message: 'Please enter material name' }]}
//               >
//                 <Input 
//                   placeholder="e.g., Titanium Alloy"
//                   size="large"
//                   style={{ borderRadius: '6px' }}
//                 />
//               </Form.Item>
//             </Col>

//             <Col span={24}>
//               <Form.Item
//                 name="material_specification"
//                 label={<span style={{ fontWeight: 500, color: theme.textPrimary }}>Material Specification</span>}
//                 rules={[{ required: true, message: 'Please enter material specification' }]}
//               >
//                 <Input 
//                   placeholder="e.g., ASTM B348"
//                   size="large"
//                   style={{ borderRadius: '6px' }}
//                 />
//               </Form.Item>
//             </Col>

//             <Col span={12}>
//               <Form.Item
//                 name="density"
//                 label={
//                   <div style={{ display: 'flex', alignItems: 'center' }}>
//                     <span style={{ fontWeight: 500, color: theme.textPrimary }}>Density (kg/m³)</span>
//                     <Tooltip title="Material density in kilograms per cubic meter">
//                       <span style={{ 
//                         marginLeft: '4px',
//                         cursor: 'help',
//                         color: theme.buttonPrimary,
//                         fontSize: '12px'
//                       }}>ⓘ</span>
//                     </Tooltip>
//                   </div>
//                 }
//                 rules={[
//                   { required: true, message: 'Please enter density' },
//                   { type: 'number', min: 0.1, message: 'Density must be greater than 0' }
//                 ]}
//               >
//                 <InputNumber 
//                   placeholder="e.g., 7800"
//                   size="large"
//                   style={{ width: '100%', borderRadius: '6px' }}
//                   min={0.1}
//                   precision={2}
//                 />
//               </Form.Item>
//             </Col>

//             <Col span={12}>
//               <Form.Item
//                 name="mrr"
//                 label={
//                   <div style={{ display: 'flex', alignItems: 'center' }}>
//                     <span style={{ fontWeight: 500, color: theme.textPrimary }}>MRR (inch³/min)</span>
//                     <Tooltip title="Material Removal Rate in cubic millimeters per minute">
//                       <span style={{ 
//                         marginLeft: '4px',
//                         cursor: 'help',
//                         color: theme.buttonPrimary,
//                         fontSize: '12px'
//                       }}>ⓘ</span>
//                     </Tooltip>
//                   </div>
//                 }
//                 rules={[
//                   { required: true, message: 'Please enter density' },
//                   { type: 'number', min: 0, message: 'MRR must be 0 or greater' }
//                 ]}
//               >
//                 <InputNumber 
//                   placeholder="e.g., 1500"
//                   size="large"
//                   style={{ width: '100%', borderRadius: '6px' }}
//                   min={0}
//                   precision={2}
//                 />
//               </Form.Item>
//             </Col>

//             <Col span={24}>
//               <Form.Item
//                 name="material_cost"
//                 label={
//                   <div style={{ display: 'flex', alignItems: 'center' }}>
//                     <span style={{ fontWeight: 500, color: theme.textPrimary }}>Material Cost (₹/kg)</span>
//                     <Tooltip title="Cost of material per kilogram in Indian Rupees">
//                       <span style={{ 
//                         marginLeft: '4px',
//                         cursor: 'help',
//                         color: theme.buttonPrimary,
//                         fontSize: '12px'
//                       }}>ⓘ</span>
//                     </Tooltip>
//                   </div>
//                 }
//                 rules={[
//                   { required: true, message: 'Please enter density' },
//                   { type: 'number', min: 0, message: 'Material cost must be 0 or greater' }
//                 ]}
//               >
//                 <InputNumber 
//                   placeholder="e.g., 450.00"
//                   size="large"
//                   style={{ width: '100%', borderRadius: '6px' }}
//                   min={0}
//                   precision={2}
//                   formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
//                   parser={value => value.replace(/₹\s?|(,*)/g, '')}
//                 />
//               </Form.Item>
//             </Col>
//           </Row>

//           <div style={{ 
//             marginTop: '16px',
//             padding: '12px',
//             background: '#f0f8ff',
//             borderRadius: '6px',
//             border: `1px solid ${theme.buttonPrimary}20`
//           }}>
//             <Text style={{ 
//               fontSize: '12px', 
//               color: theme.textPrimary,
//               fontStyle: 'italic'
//             }}>
//               <strong>Note:</strong> MRR (Material Removal Rate) and Material Cost are mandatory fields. 
//               If not specified, default values of 0 will be used.
//             </Text>
//           </div>

//           <Form.Item style={{ textAlign: 'right', marginTop: '24px', marginBottom: '0' }}>
//             <Button 
//               onClick={() => {
//                 setIsModalVisible(false);
//                 materialForm.resetFields();
//               }}
//               style={{ 
//                 marginRight: '12px',
//                 borderRadius: '6px',
//                 height: '40px'
//               }}
//             >
//               Cancel
//             </Button>
//             <Button 
//               type="primary"
//               htmlType="submit"
//               loading={isAddingMaterial}
//               style={{
//                 background: theme.buttonPrimary,
//                 borderColor: theme.buttonPrimary,
//                 color: theme.white,
//                 fontWeight: 500,
//                 borderRadius: '6px',
//                 height: '40px',
//                 minWidth: '80px'
//               }}
//               onMouseEnter={(e) => {
//                 if (!isAddingMaterial) {
//                   e.target.style.background = '#1a5661';
//                 }
//               }}
//               onMouseLeave={(e) => {
//                 if (!isAddingMaterial) {
//                   e.target.style.background = theme.buttonPrimary;
//                 }
//               }}
//             >
//               {isAddingMaterial ? 'Adding...' : 'Add Material'}
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </Layout>
//   );
// }

// export default UploadPage;





// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import {
//   Layout, Upload, Button, Select, InputNumber, Form, Typography, message, Card, Row, Col, Spin, Tooltip, Tag, Modal, Input, Divider, Space
// } from 'antd';
// import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

// const { Content } = Layout;
// const { Title, Text, Paragraph } = Typography;
// const { Option } = Select;
// const { Dragger } = Upload;

// // Updated theme colors to match navbar design
// const theme = {
//   textPrimary: '#000000',
//   textSecondary: '#000000',
//   darkGray: '#000000',
//   softBlack: '#000000',
//   darkNavy: '#000000',
//   darkNavySecondary: '#73b6ca',
//   buttonPrimary: '#246679',
//   buttonSecondary: '#73b6ca',
//   borderColor: '#246679',
//   white: '#ffffff',
//   shadow: '0 2px 12px rgba(36, 102, 121, 0.15)',
//   glowShadow: '0 0 10px rgba(36, 102, 121, 0.2)',
//   lightBackground: '#73b6ca',
// };

// function UploadPage() {
//   const navigate = useNavigate();
//   const [form] = Form.useForm();
//   const [materialForm] = Form.useForm();
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState('idle');
//   const fileInputRef = useRef(null);

//   // Material state
//   const [materials, setMaterials] = useState([]);
//   const [selectedMaterialId, setSelectedMaterialId] = useState(null);
//   const [selectedMaterialName, setSelectedMaterialName] = useState(null);
//   const [density, setDensity] = useState(null);

//   // Modal state for adding new material
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isAddingMaterial, setIsAddingMaterial] = useState(false);

//   // Updated API endpoints
//   const API_URL = 'http://localhost:5678';
//   const MATERIALS_ENDPOINT = `${API_URL}/Milling_getmaterials/`;
//   const ADD_MATERIAL_ENDPOINT = `${API_URL}/Milling_materials/add/`;
//   const ANALYZE_URL = `${API_URL}/analyze-steptry/`;
//   const CALCULATE_URL = `${API_URL}/Milling_calculate-material-costtry/`;

//   // Customized material selection rendering
//   const renderMaterialOption = (material) => {
//     return (
//       <div style={{ padding: '8px 4px' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//           <span style={{ fontWeight: 500, color: theme.textPrimary }}>{material.label}</span>
//           <Tag style={{ 
//             background: theme.buttonPrimary, 
//             color: theme.white, 
//             border: 'none',
//             borderRadius: '4px'
//           }}>
//             {material.density} kg/m³
//           </Tag>
//         </div>
//         <div style={{ 
//           fontSize: '12px', 
//           color: theme.textPrimary,
//           marginTop: '4px',
//           whiteSpace: 'normal',
//           lineHeight: '1.4'
//         }}>
//           {material.specification}
//         </div>
//       </div>
//     );
//   };

//   // Fetch materials function with new endpoint
//   useEffect(() => {
//     const fetchMaterials = async () => {
//       try {
//         const response = await axios.get(MATERIALS_ENDPOINT);
//         console.log('Fetched materials:', response.data);

//         if (Array.isArray(response.data)) {
//           const formattedMaterials = response.data.map(item => ({
//             id: item.id,
//             value: item.material,
//             label: item.material,
//             specification: item.material_specification,
//             density: item.density,
//             materialCost: item.material_cost,
//             searchText: `${item.material.toLowerCase()} ${item.material_specification.toLowerCase()} ${item.density}`
//           }));
//           setMaterials(formattedMaterials);
//         } else {
//           console.error('Unexpected response structure:', response.data);
//           message.error('Failed to load materials. Please refresh the page.');
//         }
//       } catch (error) {
//         console.error('Error fetching materials:', error);
//         message.error('Failed to load materials from server.');
//       }
//     };

//     fetchMaterials();
//   }, []);

//   // Custom search filter for the Select component
//   const filterOption = (input, option) => {
//     const material = materials.find(m => m.value === option.value);
//     if (!material) return false;
//     return material.searchText.includes(input.toLowerCase());
//   };

//   // Handle material selection
//   const handleMaterialChange = (value) => {
//     console.log('Selected material:', value);

//     const selectedMaterial = materials.find(mat => mat.value === value);
//     if (selectedMaterial) {
//       setSelectedMaterialId(selectedMaterial.id);
//       setSelectedMaterialName(selectedMaterial.value);
//       setDensity(selectedMaterial.density);

//       message.success(`Material selected: ${selectedMaterial.value} (Density: ${selectedMaterial.density} kg/m³)`);
//     }
//   };

//   // Handle adding new material with new structure
//   const handleAddMaterial = async (values) => {
//     setIsAddingMaterial(true);
//     try {
//       // Prepare the payload according to the new API structure
//       const payload = {
//         material: values.material,
//         material_specification: values.material_specification,
//         density: values.density,
//         material_cost: values.material_cost,
//         parameters: values.parameters || [],
//         machine_rates: values.machine_rates || []
//       };

//       console.log('Submitting material payload:', payload);

//       const response = await axios.post(ADD_MATERIAL_ENDPOINT, payload, {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.status === 200 || response.status === 201) {
//         message.success('Material added successfully!');

//         // Refresh materials list
//         const materialsResponse = await axios.get(MATERIALS_ENDPOINT);
//         if (Array.isArray(materialsResponse.data)) {
//           const formattedMaterials = materialsResponse.data.map(item => ({
//             id: item.id,
//             value: item.material,
//             label: item.material,
//             specification: item.material_specification,
//             density: item.density,
//             materialCost: item.material_cost,
//             searchText: `${item.material.toLowerCase()} ${item.material_specification.toLowerCase()} ${item.density}`
//           }));
//           setMaterials(formattedMaterials);
//         }

//         setIsModalVisible(false);
//         materialForm.resetFields();
//       }
//     } catch (error) {
//       console.error('Error adding material:', error);
//       const errorMsg = error.response?.data?.detail || 'Failed to add material. Please try again.';
//       message.error(errorMsg);
//     } finally {
//       setIsAddingMaterial(false);
//     }
//   };

//   const beforeUpload = (file) => {
//     const isValidFile = file.name.toLowerCase().endsWith('.step') || 
//                        file.name.toLowerCase().endsWith('.stp') || 
//                        file.name.toLowerCase().endsWith('.stl');
//     if (!isValidFile) {
//       message.error('Only STEP/STP/STL files are allowed!');
//       return Upload.LIST_IGNORE;
//     }

//     const isLt50MB = file.size / 1024 / 1024 < 50;
//     if (!isLt50MB) {
//       message.error('File must be smaller than 50MB!');
//       return Upload.LIST_IGNORE;
//     }

//     setSelectedFile(file);
//     setUploadStatus('success');
//     form.setFields([{ name: 'upload', errors: [] }]);
//     return false;
//   };

//   const onRemoveFile = () => {
//     setSelectedFile(null);
//     setUploadStatus('idle');
//   };

//   const handleSubmit = async (values) => {
//     if (!selectedFile) {
//       message.error('Please upload a STEP/STP/STL file.');
//       return;
//     }

//     if (!selectedMaterialId) {
//       message.error('Please select a material.');
//       return;
//     }

//     setIsLoading(true);
//     setUploadStatus('uploading');

//     try {
//       // Step 1: Analyze the STEP file first
//       const analyzeFormData = new FormData();
//       analyzeFormData.append('file', selectedFile);
//       analyzeFormData.append('material_id', selectedMaterialId);
//       analyzeFormData.append('quantity', '1');

//       const analyzeResponse = await axios.post(ANALYZE_URL, analyzeFormData);
//       const analysis = analyzeResponse.data;
//       console.log('Analysis result:', analysis);

//       // Step 2: Calculate costs using the returned history_id
//       // Default machine distribution: 100% on '3 Axis'
//       const calcPayload = {
//         history_id: analysis.id,
//         machine_distribution: { '3 Axis': 100 }
//       };
//       const calcResponse = await axios.post(CALCULATE_URL, calcPayload, {
//         headers: { 'Content-Type': 'application/json' }
//       });

//       // Step 3: Convert and store GLB/Draco for this milling record
//       try {
//         const convertFormData = new FormData();
//         convertFormData.append('file', selectedFile);
//         await axios.post('http://localhost:5000/convert-milling', convertFormData);
//       } catch (convErr) {
//         console.warn('Conversion warning (convert-milling):', convErr);
//       }

//       // Step 4: Navigate to the viewer page with analysis and cost data
//       const calculationId = analysis.id;
//       localStorage.setItem('currentCalculationId', calculationId);

//       navigate(`/viewer/${analysis.id}`, { 
//         state: { 
//           originalFilename: selectedFile.name,
//           materialName: selectedMaterialName,
//           quantity: 1,
//           density: density,
//           analysisData: analysis,
//           initialCostData: calcResponse.data
//         }
//       });

//       setUploadStatus('success');
//     } catch (err) {
//       console.error('API error:', err);

//       let errorMessage = 'An error occurred during processing.';
//       if (err.response) {
//         errorMessage = `Server error: ${err.response.status}`;
//         try {
//           const errorData = err.response.data;
//           if (typeof errorData === 'object' && errorData.detail) {
//             errorMessage = errorData.detail;
//           }
//         } catch (e) {
//           // Unable to parse error data
//         }
//       } else if (err.request) {
//         errorMessage = 'No response received from the server. Is it running?';
//       } else {
//         errorMessage = err.message || errorMessage;
//       }

//       message.error(errorMessage);
//       setUploadStatus('error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const CloudUploadIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={theme.buttonPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
//       <polyline points="8 16 12 12 16 16"></polyline>
//       <line x1="12" y1="12" x2="12" y2="21"></line>
//     </svg>
//   );

//   const CheckIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//       <polyline points="22 4 12 14.01 9 11.01" />
//     </svg>
//   );

//   const PlusIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <line x1="12" y1="5" x2="12" y2="19"></line>
//       <line x1="5" y1="12" x2="19" y2="12"></line>
//     </svg>
//   );

//   const handleBackToModules = () => {
//     navigate('/home/machining');
//   };

//   return (
//     <Layout style={{ 
//       minHeight: '92vh', 
//       background: theme.background,
//       overflow: 'auto'
//     }}>
//       <Layout style={{ overflow: 'visible' }}>
//         <Content style={{ 
//           padding: '16px 32px 32px',
//           overflow: 'initial',
//           background: theme.background
//         }}>
//           <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

//             {/* Upload Section */}
//             <div style={{ marginBottom: '40px' }}>
//               <button
//                 onClick={handleBackToModules}
//                 className="flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-100"
//                 style={{color: '#246679'}}
//               >
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
//                 </svg>
//                 <span className="font-semibold">Back to Modules</span>
//               </button>

//               <Title level={2} style={{ 
//                 marginBottom: '4px', 
//                 color: theme.textPrimary,
//               }}>
//               </Title>
//               <Paragraph style={{ 
//                 marginBottom: '16px', 
//                 color: theme.textPrimary,
//                 fontSize: '16px'
//               }}>
//               </Paragraph>

//               <Card 
//                 style={{ 
//                   borderRadius: '12px',
//                   boxShadow: theme.glowShadow,
//                   border: `2px solid ${theme.buttonPrimary}`,
//                   background: theme.cardBg,
//                   overflow: 'visible',
//                   marginTop: '10px',
//                   marginLeft: '32px',
//                   marginRight: '32px'
//                 }}
//                 bodyStyle={{ padding: '0' }}
//               >
//                 <div style={{ 
//                   padding: '20px 32px', 
//                   background: theme.containerBg,
//                   borderRadius: '12px 12px 0 0', 
//                   textAlign: 'center',
//                   border: `1px solid ${theme.buttonPrimary}`,
//                   boxShadow: `inset 0 0 20px rgba(36, 102, 121, 0.1)`
//                 }}>
//                   <Dragger
//                     name="file"
//                     multiple={false}
//                     beforeUpload={beforeUpload}
//                     onRemove={onRemoveFile}
//                     fileList={selectedFile ? [selectedFile] : []}
//                     style={{ 
//                       background: 'transparent',
//                       border: `2px dashed ${theme.buttonPrimary}`,
//                       borderRadius: '12px',
//                       padding: '30px 20px',
//                       boxShadow: `0 0 15px rgba(36, 102, 121, 0.2)`
//                     }}
//                   >
//                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
//                       {uploadStatus === 'success' ? <CheckIcon /> : <CloudUploadIcon />}

//                       <Title level={4} style={{ 
//                         margin: '16px 0 8px', 
//                         textAlign: 'center', 
//                         color: theme.textPrimary,
//                       }}>
//                         {uploadStatus === 'success' ? 'File uploaded successfully!' : 'Drag and drop files to upload, or'}
//                       </Title>

//                       {uploadStatus !== 'success' && (
//                         <Button 
//                           type="primary" 
//                           size="large"
//                           style={{ 
//                             background: theme.buttonPrimary,
//                             borderColor: theme.buttonPrimary,
//                             borderRadius: '8px',
//                             height: '58px',
//                             marginTop: '8px',
//                             marginBottom: '16px',
//                             fontWeight: 500,
//                             color: theme.white,
//                             boxShadow: `0 4px 15px rgba(36, 102, 121, 0.3)`,
//                             transition: 'all 0.3s ease'
//                           }}
//                           onMouseEnter={(e) => {
//                             e.target.style.background = '#1a5661';
//                           }}
//                           onMouseLeave={(e) => {
//                             e.target.style.background = theme.buttonPrimary;
//                           }}
//                         >
//                           Browse Files
//                         </Button>
//                       )}

//                       {uploadStatus === 'success' && (
//                         <Text style={{ 
//                           marginBottom: '16px', 
//                           color: theme.textPrimary,
//                           fontSize: '14px'
//                         }}>
//                           Selected file: {selectedFile?.name}
//                         </Text>
//                       )}

//                       <Text style={{ 
//                         color: theme.textPrimary, 
//                         marginBottom: '8px',
//                         fontSize: '14px'
//                       }}>
//                         File types: STEP, IGES, STL
//                       </Text>

//                       <Text style={{ 
//                         color: theme.textPrimary, 
//                         fontSize: '12px' 
//                       }}>

//                       </Text>
//                     </div>
//                   </Dragger>
//                 </div>

//                 {/* Form Card */}
//                 <div style={{ 
//                   padding: '20px 32px', 
//                   overflow: 'visible',
//                   background: theme.cardBg
//                 }}>
//                   <Form
//                     form={form}
//                     layout="vertical"
//                     onFinish={handleSubmit}
//                     requiredMark={false}
//                     style={{ maxWidth: '800px', margin: '0 auto', overflow: 'visible' }}
//                   >
//                     <Row gutter={[24, 8]}>
//                       <Col xs={24} sm={24} md={16} style={{ overflow: 'visible' }}>
//                         <Form.Item
//                           name="material"
//                           label={
//                             <div style={{ display: 'flex', alignItems: 'center' }}>
//                               <span style={{ 
//                                 fontWeight: 500, 
//                                 color: theme.textPrimary,
//                                 fontSize: '16px'
//                               }}>
//                                 Material
//                               </span>
//                               <Tooltip title="Select a material specification from the dropdown. You can search by material type, specification code, or density.">
//                                 <span style={{ 
//                                   marginLeft: '8px',
//                                   cursor: 'help',
//                                   color: theme.buttonPrimary,
//                                   fontSize: '16px'
//                                 }}>ⓘ</span>
//                               </Tooltip>
//                             </div>
//                           }
//                           rules={[{ required: true, message: 'Please select a material' }]}
//                           style={{ marginBottom: '12px' }}
//                         >
//                           <Select 
//                             placeholder="Search by material, specification, or density..."
//                             style={{ width: '100%' }}
//                             dropdownStyle={{ 
//                               borderRadius: '8px',
//                               maxHeight: '400px',
//                               overflowY: 'auto',
//                               border: `1px solid ${theme.buttonPrimary}`,
//                               boxShadow: theme.glowShadow
//                             }}
//                             size="large"
//                             onChange={handleMaterialChange}
//                             showSearch
//                             filterOption={filterOption}
//                             optionLabelProp="label"
//                             notFoundContent={
//                               <div style={{ 
//                                 padding: '16px', 
//                                 textAlign: 'center',
//                                 color: theme.textPrimary
//                               }}>
//                                 No matching materials found
//                               </div>
//                             }
//                             dropdownRender={menu => (
//                               <div>
//                                 <div style={{ 
//                                   padding: '12px 12px 4px',
//                                   borderBottom: `1px solid ${theme.buttonPrimary}`,
//                                   fontWeight: 500,
//                                   color: theme.textPrimary,
//                                   background: theme.containerBg
//                                 }}>
//                                   Select Material 
//                                 </div>
//                                 {menu}
//                               </div>
//                             )}
//                           >
//                             {materials.map((material) => (
//                               <Option 
//                                 key={material.id} 
//                                 value={material.value}
//                                 label={material.label}
//                                 title={`${material.label} - ${material.specification} (${material.density} kg/m³)`}
//                               >
//                                 {renderMaterialOption(material)}
//                               </Option>
//                             ))}
//                           </Select>
//                         </Form.Item>
//                       </Col>
//                       <Col xs={24} sm={24} md={8} style={{ overflow: 'visible' }}>
//                         <Form.Item
//                           label={<span style={{ 
//                             fontWeight: 500, 
//                             color: theme.textPrimary,
//                             fontSize: '16px'
//                           }}>
//                             Add Material
//                           </span>}
//                           style={{ marginBottom: '12px' }}
//                         >
//                           <Button 
//                             type="primary"
//                             size="large"
//                             icon={<PlusIcon />}
//                             onClick={() => setIsModalVisible(true)}
//                             style={{ 
//                               width: '100%',
//                               background: theme.buttonPrimary,
//                               borderColor: theme.buttonPrimary,
//                               color: theme.white,
//                               fontWeight: 500,
//                               boxShadow: `0 4px 15px rgba(36, 102, 121, 0.3)`,
//                               transition: 'all 0.3s ease'
//                             }}
//                             onMouseEnter={(e) => {
//                               e.target.style.background = '#1a5661';
//                             }}
//                             onMouseLeave={(e) => {
//                               e.target.style.background = theme.buttonPrimary;
//                             }}
//                           >
//                             Add New Material
//                           </Button>
//                         </Form.Item>
//                       </Col>
//                     </Row>

//                     {selectedMaterialId && (
//                       <div style={{ 
//                         marginTop: '16px', 
//                         marginBottom: '24px',
//                         padding: '16px',
//                         borderRadius: '8px',
//                         background: theme.containerBg,
//                         border: `1px solid ${theme.buttonPrimary}`,
//                         boxShadow: `0 0 15px rgba(36, 102, 121, 0.2)`
//                       }}>
//                         <Row gutter={[16, 8]}>
//                           <Col span={12}>
//                             <Text style={{ color: theme.textPrimary }}>Selected Material:</Text>
//                             <div style={{ 
//                               fontWeight: 500, 
//                               marginTop: '4px',
//                               color: theme.textPrimary
//                             }}>
//                               {selectedMaterialName}
//                             </div>
//                           </Col>
//                           <Col span={12}>
//                             <Text style={{ color: theme.textPrimary }}>Density:</Text>
//                             <div style={{ 
//                               fontWeight: 500, 
//                               marginTop: '4px',
//                               color: theme.textPrimary
//                             }}>
//                               {density} kg/m³
//                             </div>
//                           </Col>
//                           <Col span={24} style={{ marginTop: '8px' }}>
//                             <Text style={{ color: theme.textPrimary }}>Material Specification:</Text>
//                             <div style={{ 
//                               fontWeight: 500, 
//                               marginTop: '4px',
//                               color: theme.textPrimary
//                             }}>
//                               {materials.find(m => m.id === selectedMaterialId)?.specification || 'N/A'}
//                             </div>
//                           </Col>
//                         </Row>
//                       </div>
//                     )}

//                     <Form.Item style={{ marginTop: '16px', textAlign: 'center', marginBottom: '0' }}>
//                       <Button
//                         type="primary"
//                         htmlType="submit"
//                         loading={isLoading}
//                         disabled={isLoading || !selectedFile}
//                         size="large"
//                         style={{ 
//                           height: '48px', 
//                           padding: '0 48px',
//                           borderRadius: '8px',
//                           fontSize: '16px',
//                           background: theme.buttonPrimary,
//                           borderColor: theme.buttonPrimary,
//                           color: theme.white,
//                           fontWeight: 500,
//                           boxShadow: '0 4px 12px rgba(36, 102, 121, 0.5)',
//                           transition: 'all 0.3s ease'
//                         }}
//                         onMouseEnter={(e) => {
//                           if (!isLoading && selectedFile) {
//                             e.target.style.background = '#1a5661';
//                           }
//                         }}
//                         onMouseLeave={(e) => {
//                           if (!isLoading && selectedFile) {
//                             e.target.style.background = theme.buttonPrimary;
//                           }
//                         }}
//                       >
//                         {isLoading ? 'Analyzing...' : 'Analyze & Get Quote'}
//                       </Button>
//                     </Form.Item>
//                   </Form>
//                 </div>
//               </Card>
//             </div>
//             <div style={{ height: '16px' }}></div>
//           </div>
//         </Content>
//       </Layout>

//       {/* Enhanced Add Material Modal with Multiple Parameters and Machine Rates */}
//       <Modal
//         title={
//           <span style={{ 
//             color: theme.textPrimary, 
//             fontWeight: 600,
//             fontSize: '18px'
//           }}>
//             Add New Material
//           </span>
//         }
//         open={isModalVisible}
//         onCancel={() => {
//           setIsModalVisible(false);
//           materialForm.resetFields();
//         }}
//         footer={null}
//         width={800}
//         style={{
//           borderRadius: '12px',
//         }}
//         bodyStyle={{
//           padding: '20px',
//           background: theme.cardBg,
//           maxHeight: '75vh',
//           overflowY: 'auto'
//         }}
//       >
//         <Form
//           form={materialForm}
//           layout="vertical"
//           onFinish={handleAddMaterial}
//           style={{ marginTop: '16px' }}
//           initialValues={{
//             parameters: [{}],
//             machine_rates: [{}]
//           }}
//         >
//           {/* Basic Material Information */}
//           <div style={{
//             background: '#f0f8ff',
//             padding: '16px',
//             borderRadius: '8px',
//             marginBottom: '20px',
//             border: `1px solid ${theme.buttonPrimary}20`
//           }}>
//             <Title level={5} style={{ marginTop: 0, color: theme.textPrimary }}>Basic Information</Title>

//             <Row gutter={[16, 0]}>
//               <Col span={12}>
//                 <Form.Item
//                   name="material"
//                   label={<span style={{ fontWeight: 500, color: theme.textPrimary }}>Material Name</span>}
//                   rules={[{ required: true, message: 'Please enter material name' }]}
//                 >
//                   <Input 
//                     placeholder="e.g., Titanium Alloy"
//                     size="large"
//                     style={{ borderRadius: '6px' }}
//                   />
//                 </Form.Item>
//               </Col>

//               <Col span={12}>
//                 <Form.Item
//                   name="material_specification"
//                   label={<span style={{ fontWeight: 500, color: theme.textPrimary }}>Material Specification</span>}
//                   rules={[{ required: true, message: 'Please enter specification' }]}
//                 >
//                   <Input 
//                     placeholder="e.g., BSL-168-T6511"
//                     size="large"
//                     style={{ borderRadius: '6px' }}
//                   />
//                 </Form.Item>
//               </Col>

//               <Col span={12}>
//                 <Form.Item
//                   name="density"
//                   label={<span style={{ fontWeight: 500, color: theme.textPrimary }}>Density (kg/m³)</span>}
//                   rules={[
//                     { required: true, message: 'Please enter density' },
//                     { type: 'number', min: 0.1, message: 'Must be > 0' }
//                   ]}
//                 >
//                   <InputNumber 
//                     placeholder="e.g., 7800"
//                     size="large"
//                     style={{ width: '100%', borderRadius: '6px' }}
//                     min={0.1}
//                     precision={2}
//                   />
//                 </Form.Item>
//               </Col>

//               <Col span={12}>
//                 <Form.Item
//                   name="material_cost"
//                   label={<span style={{ fontWeight: 500, color: theme.textPrimary }}>Material Cost (₹/kg)</span>}
//                   rules={[
//                     { required: true, message: 'Please enter cost' },
//                     { type: 'number', min: 0, message: 'Must be ≥ 0' }
//                   ]}
//                 >
//                   <InputNumber 
//                     placeholder="e.g., 3000"
//                     size="large"
//                     style={{ width: '100%', borderRadius: '6px' }}
//                     min={0}
//                     precision={2}
//                     formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
//                     parser={value => value.replace(/₹\s?|(,*)/g, '')}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>
//           </div>

//           {/* Parameters Section */}
//           <div style={{
//             background: '#fff8f0',
//             padding: '16px',
//             borderRadius: '8px',
//             marginBottom: '20px',
//             border: `1px solid ${theme.buttonPrimary}20`
//           }}>
//             <Title level={5} style={{ marginTop: 0, color: theme.textPrimary }}>
//               Machining Parameters
//               <Tooltip title="Add machining parameters for different length ranges">
//                 <span style={{ 
//                   marginLeft: '8px',
//                   cursor: 'help',
//                   color: theme.buttonPrimary,
//                   fontSize: '14px'
//                 }}>ⓘ</span>
//               </Tooltip>
//             </Title>

//             <Form.List name="parameters">
//               {(fields, { add, remove }) => (
//                 <>
//                   {fields.map(({ key, name, ...restField }, index) => (
//                     <div 
//                       key={key}
//                       style={{
//                         background: theme.white,
//                         padding: '16px',
//                         borderRadius: '8px',
//                         marginBottom: '12px',
//                         border: `1px solid ${theme.buttonPrimary}40`,
//                         position: 'relative'
//                       }}
//                     >
//                       <div style={{ 
//                         display: 'flex', 
//                         justifyContent: 'space-between', 
//                         alignItems: 'center',
//                         marginBottom: '12px'
//                       }}>
//                         <Text strong style={{ color: theme.buttonPrimary }}>
//                           Parameter Set #{index + 1}
//                         </Text>
//                         {fields.length > 1 && (
//                           <Button
//                             type="text"
//                             danger
//                             icon={<MinusCircleOutlined />}
//                             onClick={() => remove(name)}
//                             style={{ padding: '4px 8px' }}
//                           >
//                             Remove
//                           </Button>
//                         )}
//                       </div>

//                       <Row gutter={[12, 0]}>
//                         <Col span={24}>
//                           <Form.Item
//                             {...restField}
//                             name={[name, 'length_range']}
//                             label={<span style={{ fontSize: '13px', color: theme.textPrimary }}>Length Range</span>}
//                             rules={[{ required: true, message: 'Required' }]}
//                           >
//                             <Input 
//                               placeholder="e.g., 0-100mm"
//                               size="middle"
//                             />
//                           </Form.Item>
//                         </Col>

//                         <Col span={8}>
//                           <Form.Item
//                             {...restField}
//                             name={[name, 'roughing_feed_rate']}
//                             label={<span style={{ fontSize: '13px', color: theme.textPrimary }}>Rough Feed Rate</span>}
//                             rules={[{ required: true, message: 'Required' }]}
//                           >
//                             <InputNumber 
//                               placeholder="mm/min"
//                               style={{ width: '100%' }}
//                               size="middle"
//                               min={0}
//                             />
//                           </Form.Item>
//                         </Col>

//                         <Col span={8}>
//                           <Form.Item
//                             {...restField}
//                             name={[name, 'roughing_depth_of_cut']}
//                             label={<span style={{ fontSize: '13px', color: theme.textPrimary }}>Rough DoC</span>}
//                             rules={[{ required: true, message: 'Required' }]}
//                           >
//                             <InputNumber 
//                               placeholder="mm"
//                               style={{ width: '100%' }}
//                               size="middle"
//                               min={0}
//                             />
//                           </Form.Item>
//                         </Col>

//                         <Col span={8}>
//                           <Form.Item
//                             {...restField}
//                             name={[name, 'roughing_radial_woc']}
//                             label={<span style={{ fontSize: '13px', color: theme.textPrimary }}>Rough Radial WOC</span>}
//                             rules={[{ required: true, message: 'Required' }]}
//                           >
//                             <InputNumber 
//                               placeholder="mm"
//                               style={{ width: '100%' }}
//                               size="middle"
//                               min={0}
//                             />
//                           </Form.Item>
//                         </Col>

//                         <Col span={8}>
//                           <Form.Item
//                             {...restField}
//                             name={[name, 'finishing_feed_rate']}
//                             label={<span style={{ fontSize: '13px', color: theme.textPrimary }}>Finish Feed Rate</span>}
//                             rules={[{ required: true, message: 'Required' }]}
//                           >
//                             <InputNumber 
//                               placeholder="mm/min"
//                               style={{ width: '100%' }}
//                               size="middle"
//                               min={0}
//                             />
//                           </Form.Item>
//                         </Col>

//                         <Col span={8}>
//                           <Form.Item
//                             {...restField}
//                             name={[name, 'finishing_depth_of_cut']}
//                             label={<span style={{ fontSize: '13px', color: theme.textPrimary }}>Finish DoC</span>}
//                             rules={[{ required: true, message: 'Required' }]}
//                           >
//                             <InputNumber 
//                               placeholder="mm"
//                               style={{ width: '100%' }}
//                               size="middle"
//                               min={0}
//                             />
//                           </Form.Item>
//                         </Col>

//                         <Col span={8}>
//                           <Form.Item
//                             {...restField}
//                             name={[name, 'finishing_radial_woc']}
//                             label={<span style={{ fontSize: '13px', color: theme.textPrimary }}>Finish Radial WOC</span>}
//                             rules={[{ required: true, message: 'Required' }]}
//                           >
//                             <InputNumber 
//                               placeholder="mm"
//                               style={{ width: '100%' }}
//                               size="middle"
//                               min={0}
//                             />
//                           </Form.Item>
//                         </Col>
//                       </Row>
//                     </div>
//                   ))}

//                   <Form.Item>
//                     <Button 
//                       type="dashed" 
//                       onClick={() => add()} 
//                       block 
//                       icon={<PlusOutlined />}
//                       style={{
//                         borderColor: theme.buttonPrimary,
//                         color: theme.buttonPrimary
//                       }}
//                     >
//                       Add Parameter Set
//                     </Button>
//                   </Form.Item>
//                 </>
//               )}
//             </Form.List>
//           </div>

//           {/* Machine Rates Section */}
//           <div style={{
//             background: '#f0fff4',
//             padding: '16px',
//             borderRadius: '8px',
//             marginBottom: '20px',
//             border: `1px solid ${theme.buttonPrimary}20`
//           }}>
//             <Title level={5} style={{ marginTop: 0, color: theme.textPrimary }}>
//               Machine Rates
//               <Tooltip title="Add hourly rates for different machine types and sizes">
//                 <span style={{ 
//                   marginLeft: '8px',
//                   cursor: 'help',
//                   color: theme.buttonPrimary,
//                   fontSize: '14px'
//                 }}>ⓘ</span>
//               </Tooltip>
//             </Title>

//             <Form.List name="machine_rates">
//               {(fields, { add, remove }) => (
//                 <>
//                   {fields.map(({ key, name, ...restField }, index) => (
//                     <div 
//                       key={key}
//                       style={{
//                         background: theme.white,
//                         padding: '16px',
//                         borderRadius: '8px',
//                         marginBottom: '12px',
//                         border: `1px solid ${theme.buttonPrimary}40`,
//                         position: 'relative'
//                       }}
//                     >
//                       <div style={{ 
//                         display: 'flex', 
//                         justifyContent: 'space-between', 
//                         alignItems: 'center',
//                         marginBottom: '12px'
//                       }}>
//                         <Text strong style={{ color: theme.buttonPrimary }}>
//                           Machine Rate #{index + 1}
//                         </Text>
//                         {fields.length > 1 && (
//                           <Button
//                             type="text"
//                             danger
//                             icon={<MinusCircleOutlined />}
//                             onClick={() => remove(name)}
//                             style={{ padding: '4px 8px' }}
//                           >
//                             Remove
//                           </Button>
//                         )}
//                       </div>

//                       <Row gutter={[12, 0]}>
//                         <Col span={12}>
//                           <Form.Item
//                             {...restField}
//                             name={[name, 'machine_type']}
//                             label={<span style={{ fontSize: '13px', color: theme.textPrimary }}>Machine Type</span>}
//                             rules={[{ required: true, message: 'Required' }]}
//                           >
//                             <Input 
//                               placeholder="e.g., CNC Mill"
//                               size="middle"
//                             />
//                           </Form.Item>
//                         </Col>

//                         <Col span={12}>
//                           <Form.Item
//                             {...restField}
//                             name={[name, 'size']}
//                             label={<span style={{ fontSize: '13px', color: theme.textPrimary }}>Machine Size</span>}
//                             rules={[{ required: true, message: 'Required' }]}
//                           >
//                             <Input 
//                               placeholder="e.g., 3-axis, 5-axis"
//                               size="middle"
//                             />
//                           </Form.Item>
//                         </Col>

//                         <Col span={24}>
//                           <Form.Item
//                             {...restField}
//                             name={[name, 'hourly_rate']}
//                             label={<span style={{ fontSize: '13px', color: theme.textPrimary }}>Hourly Rate (₹/hr)</span>}
//                             rules={[
//                               { required: true, message: 'Required' },
//                               { type: 'number', min: 0, message: 'Must be ≥ 0' }
//                             ]}
//                           >
//                             <InputNumber 
//                               placeholder="e.g., 1500"
//                               style={{ width: '100%' }}
//                               size="middle"
//                               min={0}
//                               precision={2}
//                               formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
//                               parser={value => value.replace(/₹\s?|(,*)/g, '')}
//                             />
//                           </Form.Item>
//                         </Col>
//                       </Row>
//                     </div>
//                   ))}

//                   <Form.Item>
//                     <Button 
//                       type="dashed" 
//                       onClick={() => add()} 
//                       block 
//                       icon={<PlusOutlined />}
//                       style={{
//                         borderColor: theme.buttonPrimary,
//                         color: theme.buttonPrimary
//                       }}
//                     >
//                       Add Machine Rate
//                     </Button>
//                   </Form.Item>
//                 </>
//               )}
//             </Form.List>
//           </div>

//           <div style={{ 
//             marginTop: '16px',
//             padding: '12px',
//             background: '#f0f8ff',
//             borderRadius: '6px',
//             border: `1px solid ${theme.buttonPrimary}20`
//           }}>
//             <Text style={{ 
//               fontSize: '12px', 
//               color: theme.textPrimary,
//               fontStyle: 'italic'
//             }}>
//               <strong>Note:</strong> All fields are required. You can add multiple parameter sets for different length ranges and multiple machine rates for various machine configurations.
//             </Text>
//           </div>

//           <Form.Item style={{ textAlign: 'right', marginTop: '24px', marginBottom: '0' }}>
//             <Space>
//               <Button 
//                 onClick={() => {
//                   setIsModalVisible(false);
//                   materialForm.resetFields();
//                 }}
//                 style={{ 
//                   borderRadius: '6px',
//                   height: '40px'
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 type="primary"
//                 htmlType="submit"
//                 loading={isAddingMaterial}
//                 style={{
//                   background: theme.buttonPrimary,
//                   borderColor: theme.buttonPrimary,
//                   color: theme.white,
//                   fontWeight: 500,
//                   borderRadius: '6px',
//                   height: '40px',
//                   minWidth: '120px'
//                 }}
//                 onMouseEnter={(e) => {
//                   if (!isAddingMaterial) {
//                     e.currentTarget.style.background = '#1a5661';
//                   }
//                 }}
//                 onMouseLeave={(e) => {
//                   if (!isAddingMaterial) {
//                     e.currentTarget.style.background = theme.buttonPrimary;
//                   }
//                 }}
//               >
//                 {isAddingMaterial ? 'Adding Material...' : 'Add Material'}
//               </Button>
//             </Space>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </Layout>
//   );
// }

// export default UploadPage;









// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import {
//   Layout, Upload, Button, Select, InputNumber, Form, Typography, message, Card, Row, Col, Spin, Tooltip, Tag, Modal, Input, Divider, Space
// } from 'antd';
// import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

// const { Content } = Layout;
// const { Title, Text, Paragraph } = Typography;
// const { Option } = Select;
// const { Dragger } = Upload;

// // Updated theme colors to match navbar design
// const theme = {
//   textPrimary: '#000000',
//   textSecondary: '#000000',
//   darkGray: '#000000',
//   softBlack: '#000000',
//   darkNavy: '#000000',
//   darkNavySecondary: '#73b6ca',
//   buttonPrimary: '#246679',
//   buttonSecondary: '#73b6ca',
//   borderColor: '#246679',
//   white: '#ffffff',
//   shadow: '0 2px 12px rgba(36, 102, 121, 0.15)',
//   glowShadow: '0 0 10px rgba(36, 102, 121, 0.2)',
//   lightBackground: '#73b6ca',
// };

// function UploadPage() {
//   const navigate = useNavigate();
//   const [form] = Form.useForm();
//   const [materialForm] = Form.useForm();
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState('idle');
//   const fileInputRef = useRef(null);

//   // Material state
//   const [materials, setMaterials] = useState([]);
//   const [selectedMaterialId, setSelectedMaterialId] = useState(null);
//   const [selectedMaterialName, setSelectedMaterialName] = useState(null);
//   const [density, setDensity] = useState(null);

//   // Modal state for adding new material
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isAddingMaterial, setIsAddingMaterial] = useState(false);

//   // Updated API endpoints
//   const API_URL = 'http://localhost:5678';
//   const MATERIALS_ENDPOINT = `${API_URL}/Milling_getmaterials/`;
//   const ADD_MATERIAL_ENDPOINT = `${API_URL}/Milling_materials/add/`;
//   const ANALYZE_URL = `${API_URL}/analyze-steptry/`;
//   const CALCULATE_URL = `${API_URL}/Milling_calculate-material-costtry/`;

//   // Customized material selection rendering
//   const renderMaterialOption = (material) => {
//     return (
//       <div style={{ padding: '8px 4px' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//           <span style={{ fontWeight: 500, color: theme.textPrimary }}>{material.label}</span>
//           <Tag style={{ 
//             background: theme.buttonPrimary, 
//             color: theme.white, 
//             border: 'none',
//             borderRadius: '4px'
//           }}>
//             {material.density} kg/m³
//           </Tag>
//         </div>
//         <div style={{ 
//           fontSize: '12px', 
//           color: theme.textPrimary,
//           marginTop: '4px',
//           whiteSpace: 'normal',
//           lineHeight: '1.4'
//         }}>
//           {material.specification}
//         </div>
//       </div>
//     );
//   };

//   // Fetch materials function with new endpoint
//   useEffect(() => {
//     const fetchMaterials = async () => {
//       try {
//         const response = await axios.get(MATERIALS_ENDPOINT);
//         console.log('Fetched materials:', response.data);

//         if (Array.isArray(response.data)) {
//           const formattedMaterials = response.data.map(item => ({
//             id: item.id,
//             value: item.material,
//             label: item.material,
//             specification: item.material_specification,
//             density: item.density,
//             materialCost: item.material_cost,
//             searchText: `${item.material.toLowerCase()} ${item.material_specification.toLowerCase()} ${item.density}`
//           }));
//           setMaterials(formattedMaterials);
//         } else {
//           console.error('Unexpected response structure:', response.data);
//           message.error('Failed to load materials. Please refresh the page.');
//         }
//       } catch (error) {
//         console.error('Error fetching materials:', error);
//         message.error('Failed to load materials from server.');
//       }
//     };

//     fetchMaterials();
//   }, []);

//   // Custom search filter for the Select component
//   const filterOption = (input, option) => {
//     const material = materials.find(m => m.value === option.value);
//     if (!material) return false;
//     return material.searchText.includes(input.toLowerCase());
//   };

//   // Handle material selection
//   const handleMaterialChange = (value) => {
//     console.log('Selected material:', value);

//     const selectedMaterial = materials.find(mat => mat.value === value);
//     if (selectedMaterial) {
//       setSelectedMaterialId(selectedMaterial.id);
//       setSelectedMaterialName(selectedMaterial.value);
//       setDensity(selectedMaterial.density);

//       message.success(`Material selected: ${selectedMaterial.value} (Density: ${selectedMaterial.density} kg/m³)`);
//     }
//   };

//   // Handle adding new material with new structure
//   const handleAddMaterial = async (values) => {
//     setIsAddingMaterial(true);
//     try {
//       // Prepare the payload according to the new API structure
//       const payload = {
//         material: values.material,
//         material_specification: values.material_specification,
//         density: values.density,
//         material_cost: values.material_cost,
//         parameters: values.parameters || [],
//         machine_rates: values.machine_rates || []
//       };

//       console.log('Submitting material payload:', payload);

//       const response = await axios.post(ADD_MATERIAL_ENDPOINT, payload, {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.status === 200 || response.status === 201) {
//         message.success('Material added successfully!');

//         // Refresh materials list
//         const materialsResponse = await axios.get(MATERIALS_ENDPOINT);
//         if (Array.isArray(materialsResponse.data)) {
//           const formattedMaterials = materialsResponse.data.map(item => ({
//             id: item.id,
//             value: item.material,
//             label: item.material,
//             specification: item.material_specification,
//             density: item.density,
//             materialCost: item.material_cost,
//             searchText: `${item.material.toLowerCase()} ${item.material_specification.toLowerCase()} ${item.density}`
//           }));
//           setMaterials(formattedMaterials);
//         }

//         setIsModalVisible(false);
//         materialForm.resetFields();
//       }
//     } catch (error) {
//       console.error('Error adding material:', error);
//       const errorMsg = error.response?.data?.detail || 'Failed to add material. Please try again.';
//       message.error(errorMsg);
//     } finally {
//       setIsAddingMaterial(false);
//     }
//   };

//   const beforeUpload = (file) => {
//     const isValidFile = file.name.toLowerCase().endsWith('.step') || 
//                        file.name.toLowerCase().endsWith('.stp') || 
//                        file.name.toLowerCase().endsWith('.stl');
//     if (!isValidFile) {
//       message.error('Only STEP/STP/STL files are allowed!');
//       return Upload.LIST_IGNORE;
//     }

//     const isLt50MB = file.size / 1024 / 1024 < 50;
//     if (!isLt50MB) {
//       message.error('File must be smaller than 50MB!');
//       return Upload.LIST_IGNORE;
//     }

//     setSelectedFile(file);
//     setUploadStatus('success');
//     form.setFields([{ name: 'upload', errors: [] }]);
//     return false;
//   };

//   const onRemoveFile = () => {
//     setSelectedFile(null);
//     setUploadStatus('idle');
//   };




//   // const handleSubmit = async (values) => {
//   //   if (!selectedFile) {
//   //     message.error('Please upload a STEP/STP/STL file.');
//   //     return;
//   //   }

//   //   if (!selectedMaterialId) {
//   //     message.error('Please select a material.');
//   //     return;
//   //   }

//   //   setIsLoading(true);
//   //   setUploadStatus('uploading');

//   //   try {
//   //     // Step 1: Analyze the STEP file first
//   //     const analyzeFormData = new FormData();
//   //     analyzeFormData.append('file', selectedFile);
//   //     analyzeFormData.append('material_id', selectedMaterialId);
//   //     analyzeFormData.append('quantity', '1');

//   //     const analyzeResponse = await axios.post(ANALYZE_URL, analyzeFormData);
//   //     const analysis = analyzeResponse.data;
//   //     console.log('Analysis result:', analysis);

//   //     // Step 2: Calculate costs using the returned history_id
//   //     // ✅ UPDATED: Changed default machine distribution to 3 Axis: 70%, 4 Axis: 20%, 5 Axis: 10%
//   //     const calcPayload = {
//   //       history_id: analysis.id,
//   //       machine_distribution: { 
//   //         '3 Axis': 70,
//   //         '4 Axis': 20,
//   //         '5 Axis': 10
//   //       }
//   //     };
//   //     const calcResponse = await axios.post(CALCULATE_URL, calcPayload, {
//   //       headers: { 'Content-Type': 'application/json' }
//   //     });

//   //     console.log('Calculation response:', calcResponse.data);

//   //     // Step 3: Convert and store GLB/Draco for this milling record
//   //     try {
//   //       const convertFormData = new FormData();
//   //       convertFormData.append('file', selectedFile);
//   //       await axios.post('http://localhost:5000/convert-milling', convertFormData);
//   //     } catch (convErr) {
//   //       console.warn('Conversion warning (convert-milling):', convErr);
//   //     }

//   //     // Step 4: Navigate to the viewer page with analysis and cost data
//   //     const calculationId = analysis.id;
//   //     localStorage.setItem('currentCalculationId', calculationId);

//   //     navigate(`/viewer/${analysis.id}`, { 
//   //       state: { 
//   //         originalFilename: selectedFile.name,
//   //         materialName: selectedMaterialName,
//   //         quantity: 1,
//   //         density: density,
//   //         analysisData: analysis,
//   //         initialCostData: calcResponse.data
//   //       }
//   //     });

//   //     setUploadStatus('success');
//   //   } catch (err) {
//   //     console.error('API error:', err);

//   //     let errorMessage = 'An error occurred during processing.';
//   //     if (err.response) {
//   //       errorMessage = `Server error: ${err.response.status}`;
//   //       try {
//   //         const errorData = err.response.data;
//   //         if (typeof errorData === 'object' && errorData.detail) {
//   //           errorMessage = errorData.detail;
//   //         }
//   //       } catch (e) {
//   //         // Unable to parse error data
//   //       }
//   //     } else if (err.request) {
//   //       errorMessage = 'No response received from the server. Is it running?';
//   //     } else {
//   //       errorMessage = err.message || errorMessage;
//   //     }

//   //     message.error(errorMessage);
//   //     setUploadStatus('error');
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   const handleSubmit = async (values) => {
//   if (!selectedFile) {
//     message.error('Please upload a STEP/STP/STL file.');
//     return;
//   }

//   if (!selectedMaterialId) {
//     message.error('Please select a material.');
//     return;
//   }

//   setIsLoading(true);
//   setUploadStatus('uploading');

//   try {
//     // Step 1: Analyze the STEP file first
//     const analyzeFormData = new FormData();
//     analyzeFormData.append('file', selectedFile);
//     analyzeFormData.append('material_id', selectedMaterialId);
//     analyzeFormData.append('quantity', '1');

//     const analyzeResponse = await axios.post(ANALYZE_URL, analyzeFormData);
//     const analysis = analyzeResponse.data;
//     console.log('Analysis result:', analysis);

//     // Step 2: Calculate costs using the returned history_id
//     // ✅ UPDATED: Changed default machine distribution to 3 Axis: 70%, 4 Axis: 20%, 5 Axis: 10%
//     const calcPayload = {
//       history_id: analysis.id,
//       machine_distribution: { 
//         '3 Axis': 70,
//         '4 Axis': 20,
//         '5 Axis': 10
//       }
//     };
//     const calcResponse = await axios.post(CALCULATE_URL, calcPayload, {
//       headers: { 'Content-Type': 'application/json' }
//     });

//     console.log('Calculation response:', calcResponse.data);

//     // Step 3: Convert and store GLB/Draco for this milling record WITH history_id
//     try {
//       const convertFormData = new FormData();
//       convertFormData.append('file', selectedFile);
//       convertFormData.append('history_id', analysis.id); // ✅ ADDED: Pass history_id

//       const convertResponse = await axios.post('http://localhost:5000/convert-milling', convertFormData);
//       console.log('Conversion response:', convertResponse.data);
//     } catch (convErr) {
//       console.warn('Conversion warning (convert-milling):', convErr);
//       // Don't fail the whole process if conversion fails
//       message.warning('File conversion had some issues, but analysis completed successfully.');
//     }

//     // Step 4: Navigate to the viewer page with analysis and cost data
//     const calculationId = analysis.id;
//     localStorage.setItem('currentCalculationId', calculationId);

//     navigate(`/viewer/${analysis.id}`, { 
//       state: { 
//         originalFilename: selectedFile.name,
//         materialName: selectedMaterialName,
//         quantity: 1,
//         density: density,
//         analysisData: analysis,
//         initialCostData: calcResponse.data
//       }
//     });

//     setUploadStatus('success');
//   } catch (err) {
//     console.error('API error:', err);

//     let errorMessage = 'An error occurred during processing.';
//     if (err.response) {
//       errorMessage = `Server error: ${err.response.status}`;
//       try {
//         const errorData = err.response.data;
//         if (typeof errorData === 'object' && errorData.detail) {
//           errorMessage = errorData.detail;
//         }
//       } catch (e) {
//         // Unable to parse error data
//       }
//     } else if (err.request) {
//       errorMessage = 'No response received from the server. Is it running?';
//     } else {
//       errorMessage = err.message || errorMessage;
//     }

//     message.error(errorMessage);
//     setUploadStatus('error');
//   } finally {
//     setIsLoading(false);
//   }
// };

//   const CloudUploadIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={theme.buttonPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
//       <polyline points="8 16 12 12 16 16"></polyline>
//       <line x1="12" y1="12" x2="12" y2="21"></line>
//     </svg>
//   );

//   const CheckIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//       <polyline points="22 4 12 14.01 9 11.01" />
//     </svg>
//   );

//   const PlusIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <line x1="12" y1="5" x2="12" y2="19"></line>
//       <line x1="5" y1="12" x2="19" y2="12"></line>
//     </svg>
//   );

//   const handleBackToModules = () => {
//     navigate('/home/machining');
//   };

//   return (
//     <Layout style={{ 
//       minHeight: '92vh', 
//       background: theme.background,
//       overflow: 'auto'
//     }}>
//       <Layout style={{ overflow: 'visible' }}>
//         <Content style={{ 
//           padding: '16px 32px 32px',
//           overflow: 'initial',
//           background: theme.background
//         }}>
//           <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

//             {/* Upload Section */}
//             <div style={{ marginBottom: '40px' }}>
//               <button
//                 onClick={handleBackToModules}
//                 className="flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-100"
//                 style={{color: '#246679'}}
//               >
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
//                 </svg>
//                 <span className="font-semibold">Back to Modules</span>
//               </button>

//               <Title level={2} style={{ 
//                 marginBottom: '4px', 
//                 color: theme.textPrimary,
//               }}>
//               </Title>
//               <Paragraph style={{ 
//                 marginBottom: '16px', 
//                 color: theme.textPrimary,
//                 fontSize: '16px'
//               }}>
//               </Paragraph>

//               <Card 
//                 style={{ 
//                   borderRadius: '12px',
//                   boxShadow: theme.glowShadow,
//                   border: `2px solid ${theme.buttonPrimary}`,
//                   background: theme.cardBg,
//                   overflow: 'visible',
//                   marginTop: '10px',
//                   marginLeft: '32px',
//                   marginRight: '32px'
//                 }}
//                 bodyStyle={{ padding: '0' }}
//               >
//                 <div style={{ 
//                   padding: '20px 32px', 
//                   background: theme.containerBg,
//                   borderRadius: '12px 12px 0 0', 
//                   textAlign: 'center',
//                   border: `1px solid ${theme.buttonPrimary}`,
//                   boxShadow: `inset 0 0 20px rgba(36, 102, 121, 0.1)`
//                 }}>
//                   <Dragger
//                     name="file"
//                     multiple={false}
//                     beforeUpload={beforeUpload}
//                     onRemove={onRemoveFile}
//                     fileList={selectedFile ? [selectedFile] : []}
//                     style={{ 
//                       background: 'transparent',
//                       border: `2px dashed ${theme.buttonPrimary}`,
//                       borderRadius: '12px',
//                       padding: '30px 20px',
//                       boxShadow: `0 0 15px rgba(36, 102, 121, 0.2)`
//                     }}
//                   >
//                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
//                       {uploadStatus === 'success' ? <CheckIcon /> : <CloudUploadIcon />}

//                       <Title level={4} style={{ 
//                         margin: '16px 0 8px', 
//                         textAlign: 'center', 
//                         color: theme.textPrimary,
//                       }}>
//                         {uploadStatus === 'success' ? 'File uploaded successfully!' : 'Drag and drop files to upload, or'}
//                       </Title>

//                       {uploadStatus !== 'success' && (
//                         <Button 
//                           type="primary" 
//                           size="large"
//                           style={{ 
//                             background: theme.buttonPrimary,
//                             borderColor: theme.buttonPrimary,
//                             borderRadius: '8px',
//                             height: '58px',
//                             marginTop: '8px',
//                             marginBottom: '16px',
//                             fontWeight: 500,
//                             color: theme.white,
//                             boxShadow: `0 4px 15px rgba(36, 102, 121, 0.3)`,
//                             transition: 'all 0.3s ease'
//                           }}
//                           onMouseEnter={(e) => {
//                             e.target.style.background = '#1a5661';
//                           }}
//                           onMouseLeave={(e) => {
//                             e.target.style.background = theme.buttonPrimary;
//                           }}
//                         >
//                           Browse Files
//                         </Button>
//                       )}

//                       {uploadStatus === 'success' && (
//                         <Text style={{ 
//                           marginBottom: '16px', 
//                           color: theme.textPrimary,
//                           fontSize: '14px'
//                         }}>
//                           Selected file: {selectedFile?.name}
//                         </Text>
//                       )}

//                       <Text style={{ 
//                         color: theme.textPrimary, 
//                         marginBottom: '8px',
//                         fontSize: '14px'
//                       }}>
//                         File types: STEP, IGES, STL
//                       </Text>

//                       <Text style={{ 
//                         color: theme.textPrimary, 
//                         fontSize: '12px' 
//                       }}>

//                       </Text>
//                     </div>
//                   </Dragger>
//                 </div>

//                 {/* Form Card */}
//                 <div style={{ 
//                   padding: '20px 32px', 
//                   overflow: 'visible',
//                   background: theme.cardBg
//                 }}>
//                   <Form
//                     form={form}
//                     layout="vertical"
//                     onFinish={handleSubmit}
//                     requiredMark={false}
//                     style={{ maxWidth: '800px', margin: '0 auto', overflow: 'visible' }}
//                   >
//                     <Row gutter={[24, 8]}>
//                       <Col xs={24} sm={24} md={16} style={{ overflow: 'visible' }}>
//                         <Form.Item
//                           name="material"
//                           label={
//                             <div style={{ display: 'flex', alignItems: 'center' }}>
//                               <span style={{ 
//                                 fontWeight: 500, 
//                                 color: theme.textPrimary,
//                                 fontSize: '16px'
//                               }}>
//                                 Material
//                               </span>
//                               <Tooltip title="Select a material specification from the dropdown. You can search by material type, specification code, or density.">
//                                 <span style={{ 
//                                   marginLeft: '8px',
//                                   cursor: 'help',
//                                   color: theme.buttonPrimary,
//                                   fontSize: '16px'
//                                 }}>ⓘ</span>
//                               </Tooltip>
//                             </div>
//                           }
//                           rules={[{ required: true, message: 'Please select a material' }]}
//                           style={{ marginBottom: '12px' }}
//                         >
//                           <Select 
//                             placeholder="Search by material, specification, or density..."
//                             style={{ width: '100%' }}
//                             dropdownStyle={{ 
//                               borderRadius: '8px',
//                               maxHeight: '400px',
//                               overflowY: 'auto',
//                               border: `1px solid ${theme.buttonPrimary}`,
//                               boxShadow: theme.glowShadow
//                             }}
//                             size="large"
//                             onChange={handleMaterialChange}
//                             showSearch
//                             filterOption={filterOption}
//                             optionLabelProp="label"
//                             notFoundContent={
//                               <div style={{ 
//                                 padding: '16px', 
//                                 textAlign: 'center',
//                                 color: theme.textPrimary
//                               }}>
//                                 No matching materials found
//                               </div>
//                             }
//                             dropdownRender={menu => (
//                               <div>
//                                 <div style={{ 
//                                   padding: '12px 12px 4px',
//                                   borderBottom: `1px solid ${theme.buttonPrimary}`,
//                                   fontWeight: 500,
//                                   color: theme.textPrimary,
//                                   background: theme.containerBg
//                                 }}>
//                                   Select Material 
//                                 </div>
//                                 {menu}
//                               </div>
//                             )}
//                           >
//                             {materials.map((material) => (
//                               <Option 
//                                 key={material.id} 
//                                 value={material.value}
//                                 label={material.label}
//                                 title={`${material.label} - ${material.specification} (${material.density} kg/m³)`}
//                               >
//                                 {renderMaterialOption(material)}
//                               </Option>
//                             ))}
//                           </Select>
//                         </Form.Item>
//                       </Col>
//                       <Col xs={24} sm={24} md={8} style={{ overflow: 'visible' }}>
//                         <Form.Item
//                           label={<span style={{ 
//                             fontWeight: 500, 
//                             color: theme.textPrimary,
//                             fontSize: '16px'
//                           }}>
//                             Add Material
//                           </span>}
//                           style={{ marginBottom: '12px' }}
//                         >
//                           <Button 
//                             type="primary"
//                             size="large"
//                             icon={<PlusIcon />}
//                             onClick={() => setIsModalVisible(true)}
//                             style={{ 
//                               width: '100%',
//                               background: theme.buttonPrimary,
//                               borderColor: theme.buttonPrimary,
//                               color: theme.white,
//                               fontWeight: 500,
//                               boxShadow: `0 4px 15px rgba(36, 102, 121, 0.3)`,
//                               transition: 'all 0.3s ease'
//                             }}
//                             onMouseEnter={(e) => {
//                               e.target.style.background = '#1a5661';
//                             }}
//                             onMouseLeave={(e) => {
//                               e.target.style.background = theme.buttonPrimary;
//                             }}
//                           >
//                             Add New Material
//                           </Button>
//                         </Form.Item>
//                       </Col>
//                     </Row>

//                     {selectedMaterialId && (
//                       <div style={{ 
//                         marginTop: '16px', 
//                         marginBottom: '24px',
//                         padding: '16px',
//                         borderRadius: '8px',
//                         background: theme.containerBg,
//                         border: `1px solid ${theme.buttonPrimary}`,
//                         boxShadow: `0 0 15px rgba(36, 102, 121, 0.2)`
//                       }}>
//                         <Row gutter={[16, 8]}>
//                           <Col span={12}>
//                             <Text style={{ color: theme.textPrimary }}>Selected Material:</Text>
//                             <div style={{ 
//                               fontWeight: 500, 
//                               marginTop: '4px',
//                               color: theme.textPrimary
//                             }}>
//                               {selectedMaterialName}
//                             </div>
//                           </Col>
//                           <Col span={12}>
//                             <Text style={{ color: theme.textPrimary }}>Density:</Text>
//                             <div style={{ 
//                               fontWeight: 500, 
//                               marginTop: '4px',
//                               color: theme.textPrimary
//                             }}>
//                               {density} kg/m³
//                             </div>
//                           </Col>
//                           <Col span={24} style={{ marginTop: '8px' }}>
//                             <Text style={{ color: theme.textPrimary }}>Material Specification:</Text>
//                             <div style={{ 
//                               fontWeight: 500, 
//                               marginTop: '4px',
//                               color: theme.textPrimary
//                             }}>
//                               {materials.find(m => m.id === selectedMaterialId)?.specification || 'N/A'}
//                             </div>
//                           </Col>
//                         </Row>
//                       </div>
//                     )}

//                     <Form.Item style={{ marginTop: '16px', textAlign: 'center', marginBottom: '0' }}>
//                       <Button
//                         type="primary"
//                         htmlType="submit"
//                         loading={isLoading}
//                         disabled={isLoading || !selectedFile}
//                         size="large"
//                         style={{ 
//                           height: '48px', 
//                           padding: '0 48px',
//                           borderRadius: '8px',
//                           fontSize: '16px',
//                           background: theme.buttonPrimary,
//                           borderColor: theme.buttonPrimary,
//                           color: theme.white,
//                           fontWeight: 500,
//                           boxShadow: '0 4px 12px rgba(36, 102, 121, 0.5)',
//                           transition: 'all 0.3s ease'
//                         }}
//                         onMouseEnter={(e) => {
//                           if (!isLoading && selectedFile) {
//                             e.target.style.background = '#1a5661';
//                           }
//                         }}
//                         onMouseLeave={(e) => {
//                           if (!isLoading && selectedFile) {
//                             e.target.style.background = theme.buttonPrimary;
//                           }
//                         }}
//                       >
//                         {isLoading ? 'Analyzing...' : 'Analyze & Get Quote'}
//                       </Button>
//                     </Form.Item>
//                   </Form>
//                 </div>
//               </Card>
//             </div>
//             <div style={{ height: '16px' }}></div>
//           </div>
//         </Content>
//       </Layout>

//       {/* Material Modal - keeping the existing modal code intact */}
//       <Modal
//         title={
//           <span style={{ 
//             color: theme.textPrimary, 
//             fontWeight: 600,
//             fontSize: '18px'
//           }}>
//             Add New Material
//           </span>
//         }
//         open={isModalVisible}
//         onCancel={() => {
//           setIsModalVisible(false);
//           materialForm.resetFields();
//         }}
//         footer={null}
//         width={800}
//         style={{
//           borderRadius: '12px',
//         }}
//         bodyStyle={{
//           padding: '20px',
//           background: theme.cardBg,
//           maxHeight: '75vh',
//           overflowY: 'auto'
//         }}
//       >
//         {/* Modal content remains the same */}
//       </Modal>
//     </Layout>
//   );
// }

// export default UploadPage;





import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Layout, Upload, Button, Select, Form, Typography, message, Card, Row, Col, Tooltip, Tag, Modal, Input, Divider, Progress
} from 'antd';
import { X, Plus, Trash2 } from 'lucide-react';
import { DeleteOutlined, UploadOutlined, FileOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Dragger } = Upload;

// Updated theme colors to match navbar design
const theme = {
  textPrimary: '#000000',
  textSecondary: '#000000',
  darkGray: '#000000',
  softBlack: '#000000',
  darkNavy: '#000000',
  darkNavySecondary: '#73b6ca',
  buttonPrimary: '#246679',
  buttonSecondary: '#73b6ca',
  borderColor: '#246679',
  white: '#ffffff',
  shadow: '0 2px 12px rgba(36, 102, 121, 0.15)',
  glowShadow: '0 0 10px rgba(36, 102, 121, 0.2)',
  lightBackground: '#73b6ca',

};

// Add Material Modal Component
const AddMaterialModal = ({ visible, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    material: '',
    material_specification: '',
    density: '',
    material_cost: '',
    parameters: [{
      length_range: '',
      roughing_feed_rate: '',
      roughing_depth_of_cut: '',
      roughing_radial_woc: '',
      finishing_feed_rate: '',
      finishing_depth_of_cut: '',
      finishing_radial_woc: ''
    }],
    machine_rates: [{
      machine_type: '',
      size: '',
      hourly_rate: ''
    }]
  });
  const [submitting, setSubmitting] = useState(false);


  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleParameterChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      parameters: prev.parameters.map((param, i) =>
        i === index ? { ...param, [field]: value } : param
      )
    }));
  };

  const handleMachineRateChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      machine_rates: prev.machine_rates.map((rate, i) =>
        i === index ? { ...rate, [field]: value } : rate
      )
    }));
  };

  const addParameterSet = () => {
    setFormData(prev => ({
      ...prev,
      parameters: [...prev.parameters, {
        length_range: '',
        roughing_feed_rate: '',
        roughing_depth_of_cut: '',
        roughing_radial_woc: '',
        finishing_feed_rate: '',
        finishing_depth_of_cut: '',
        finishing_radial_woc: ''
      }]
    }));
  };

  const addMachineRate = () => {
    setFormData(prev => ({
      ...prev,
      machine_rates: [...prev.machine_rates, {
        machine_type: '',
        size: '',
        hourly_rate: ''
      }]
    }));
  };

  const removeParameterSet = (index) => {
    if (formData.parameters.length > 1) {
      setFormData(prev => ({
        ...prev,
        parameters: prev.parameters.filter((_, i) => i !== index)
      }));
    }
  };

  const removeMachineRate = (index) => {
    if (formData.machine_rates.length > 1) {
      setFormData(prev => ({
        ...prev,
        machine_rates: prev.machine_rates.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.material || !formData.material_specification || !formData.density || !formData.material_cost) {
      message.error('Please fill in all basic information fields');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        material: formData.material,
        material_specification: formData.material_specification,
        density: parseFloat(formData.density),
        material_cost: parseFloat(formData.material_cost),
        parameters: formData.parameters.map(param => ({
          length_range: param.length_range,
          roughing_feed_rate: parseFloat(param.roughing_feed_rate) || 0,
          roughing_depth_of_cut: parseFloat(param.roughing_depth_of_cut) || 0,
          roughing_radial_woc: parseFloat(param.roughing_radial_woc) || 0,
          finishing_feed_rate: parseFloat(param.finishing_feed_rate) || 0,
          finishing_depth_of_cut: parseFloat(param.finishing_depth_of_cut) || 0,
          finishing_radial_woc: parseFloat(param.finishing_radial_woc) || 0
        })),
        machine_rates: formData.machine_rates.map(rate => ({
          machine_type: rate.machine_type,
          size: rate.size,
          hourly_rate: parseFloat(rate.hourly_rate) || 0
        }))
      };

      const response = await axios.post('http://localhost:5678/Milling_materials/add/', payload, {
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      });

      if (response.status === 200 || response.status === 201) {
        message.success('Material added successfully!');
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          material: '',
          material_specification: '',
          density: '',
          material_cost: '',
          parameters: [{
            length_range: '',
            roughing_feed_rate: '',
            roughing_depth_of_cut: '',
            roughing_radial_woc: '',
            finishing_feed_rate: '',
            finishing_depth_of_cut: '',
            finishing_radial_woc: ''
          }],
          machine_rates: [{
            machine_type: '',
            size: '',
            hourly_rate: ''
          }]
        });
      }
    } catch (err) {
      console.error('Error adding material:', err);
      const errorMsg = err.response?.data?.detail || 'Failed to add material. Please try again.';
      message.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      style={{ top: 20 }}
      bodyStyle={{
        maxHeight: 'calc(100vh - 200px)',
        overflowY: 'auto',
        padding: 0
      }}
    >
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
        <h2 className="text-2xl font-bold text-gray-800">Add New Material</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="text-red-500">*</span> Material Name
              </label>
              <input
                type="text"
                placeholder="e.g., Titanium Alloy"
                value={formData.material}
                onChange={(e) => handleInputChange('material', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="text-red-500">*</span> Material Specification
              </label>
              <input
                type="text"
                placeholder="e.g., BSL-168-TG511"
                value={formData.material_specification}
                onChange={(e) => handleInputChange('material_specification', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="text-red-500">*</span> Density (kg/m³)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g., 7800"
                value={formData.density}
                onChange={(e) => handleInputChange('density', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="text-red-500">*</span> Material Cost (₹/kg)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">₹</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.material_cost}
                  onChange={(e) => handleInputChange('material_cost', e.target.value)}
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Machining Parameters */}
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Machining Parameters</h3>
            <button
              type="button"
              onClick={addParameterSet}
              className="text-sm text-[#246679] hover:text-[#1f5766] font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Parameter Set
            </button>
          </div>
          {formData.parameters.map((param, index) => (
            <div key={index} className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-700">Parameter Set #{index + 1}</h4>
                {formData.parameters.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParameterSet(index)}
                    className="text-red-600 hover:text-red-700"
                  >

                  </button>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Length Range
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 0-100mm"
                    value={param.length_range}
                    onChange={(e) => handleParameterChange(index, 'length_range', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rough Feed Rate
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="mm/min"
                      value={param.roughing_feed_rate}
                      onChange={(e) => handleParameterChange(index, 'roughing_feed_rate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rough DoC
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="mm"
                      value={param.roughing_depth_of_cut}
                      onChange={(e) => handleParameterChange(index, 'roughing_depth_of_cut', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rough Radial WOC
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="mm"
                      value={param.roughing_radial_woc}
                      onChange={(e) => handleParameterChange(index, 'roughing_radial_woc', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Finish Feed Rate
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="mm/min"
                      value={param.finishing_feed_rate}
                      onChange={(e) => handleParameterChange(index, 'finishing_feed_rate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Finish DoC
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="mm"
                      value={param.finishing_depth_of_cut}
                      onChange={(e) => handleParameterChange(index, 'finishing_depth_of_cut', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Finish Radial WOC
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="mm"
                      value={param.finishing_radial_woc}
                      onChange={(e) => handleParameterChange(index, 'finishing_radial_woc', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Machine Rates */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Machine Rates</h3>
            <button
              type="button"
              onClick={addMachineRate}
              className="text-sm text-[#246679] hover:text-[#1f5766] font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Machine Rate
            </button>
          </div>
          {formData.machine_rates.map((rate, index) => (
            <div key={index} className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-700">Machine Rate #{index + 1}</h4>
                {formData.machine_rates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMachineRate(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Machine Type
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 5 Axis"
                    value={rate.machine_type}
                    onChange={(e) => handleMachineRateChange(index, 'machine_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Machine Size
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 3000*1500*800"
                    value={rate.size}
                    onChange={(e) => handleMachineRateChange(index, 'size', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hourly Rate (₹/hr)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={rate.hourly_rate}
                      onChange={(e) => handleMachineRateChange(index, 'hourly_rate', e.target.value)}
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200 disabled:opacity-50"
          >
            {submitting ? 'Adding Material...' : 'Add Material'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

function UploadPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [batchFiles, setBatchFiles] = useState([]);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  // Material state
  const [materials, setMaterials] = useState([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  const [selectedMaterialName, setSelectedMaterialName] = useState(null);
  const [density, setDensity] = useState(null);

  // Modal state for adding new material
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [processingStage, setProcessingStage] = useState('');
  const [conversionProgress, setConversionProgress] = useState(0);

  // Updated API endpoints
  const API_URL = 'http://localhost:5678';
  const MATERIALS_ENDPOINT = `${API_URL}/Milling_getmaterials/`;
  const ANALYZE_URL = `${API_URL}/analyze-steptry/`;
  const CALCULATE_URL = `${API_URL}/Milling_calculate-material-costtry/`;

  // Customized material selection rendering
  const renderMaterialOption = (material) => {
    return (
      <div style={{ padding: '8px 4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 500, color: theme.textPrimary }}>{material.label}</span>
          <Tag style={{
            background: theme.buttonPrimary,
            color: theme.white,
            border: 'none',
            borderRadius: '4px'
          }}>
            {material.density} kg/m³
          </Tag>
        </div>
        <div style={{
          fontSize: '12px',
          color: theme.textPrimary,
          marginTop: '4px',
          whiteSpace: 'normal',
          lineHeight: '1.4'
        }}>
          {material.specification}
        </div>
      </div>
    );
  };

  // Fetch materials function
  const fetchMaterials = async () => {
    try {
      const response = await axios.get(MATERIALS_ENDPOINT);
      console.log('Fetched materials:', response.data);

      if (Array.isArray(response.data)) {
        const formattedMaterials = response.data.map(item => ({
          id: item.id,
          value: item.material,
          label: item.material,
          specification: item.material_specification,
          density: item.density,
          materialCost: item.material_cost,
          searchText: `${item.material.toLowerCase()} ${item.material_specification.toLowerCase()} ${item.density}`
        }));
        setMaterials(formattedMaterials);
      } else {
        console.error('Unexpected response structure:', response.data);
        message.error('Failed to load materials. Please refresh the page.');
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
      message.error('Failed to load materials from server.');
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Custom search filter for the Select component
  const filterOption = (input, option) => {
    const material = materials.find(m => m.value === option.value);
    if (!material) return false;
    return material.searchText.includes(input.toLowerCase());
  };

  // Handle material selection
  const handleMaterialChange = (value) => {
    console.log('Selected material:', value);

    const selectedMaterial = materials.find(mat => mat.value === value);
    if (selectedMaterial) {
      setSelectedMaterialId(selectedMaterial.id);
      setSelectedMaterialName(selectedMaterial.value);
      setDensity(selectedMaterial.density);

      message.success(`Material selected: ${selectedMaterial.value} (Density: ${selectedMaterial.density} kg/m³)`);
    }
  };

  const isValidCadFile = (filename) => {
    const lower = (filename || '').toLowerCase();
    return (
      lower.endsWith('.step') ||
      lower.endsWith('.stp') ||
      lower.endsWith('.iges') ||
      lower.endsWith('.igs') ||
      lower.endsWith('.stl')
    );
  };

  const handleFolderUpload = (e) => {
    const rawFiles = Array.from(e.target.files || []);
    if (rawFiles.length === 0) return;

    const validFiles = rawFiles.filter(f => isValidCadFile(f.name));
    if (validFiles.length === 0) {
      message.warning('No valid STEP/STP/IGES/STL files found in the selected folder.');
      e.target.value = '';
      return;
    }

    const newBatchItems = validFiles.map((file, index) => {
      const relPath = file.webkitRelativePath || file.name;
      const parts = relPath.split('/');
      const folderName = parts.length > 1 ? parts[0] : 'Uploaded_Folder';
      return {
        key: `${Date.now()}_${index}_${file.name}`,
        file: file,
        name: file.name,
        folderName: folderName,
        relativePath: relPath,
        size: file.size
      };
    });

    setBatchFiles(prev => [...prev, ...newBatchItems]);
    setIsBatchMode(true);
    setSelectedFile(null);
    setUploadStatus('success');

    const folderCount = new Set(newBatchItems.map(item => item.folderName)).size;
    message.success(`Added ${newBatchItems.length} CAD files from ${folderCount} folder(s). Total batch: ${batchFiles.length + newBatchItems.length} files.`);
    e.target.value = '';
  };

  const handleMultipleFilesBrowse = (e) => {
    const rawFiles = Array.from(e.target.files || []);
    if (rawFiles.length === 0) return;

    const validFiles = rawFiles.filter(f => isValidCadFile(f.name));
    if (validFiles.length === 0) {
      message.error('No supported STEP/STP/IGES/STL files selected.');
      e.target.value = '';
      return;
    }

    if (validFiles.length === 1 && !isBatchMode && batchFiles.length === 0) {
      const file = validFiles[0];
      if (file.size / 1024 / 1024 > 50) {
        message.error('File must be smaller than 50MB!');
        return;
      }
      setSelectedFile(file);
      setIsBatchMode(false);
      setBatchFiles([]);
      setUploadStatus('success');
      form.setFields([{ name: 'upload', errors: [] }]);
    } else {
      const newItems = validFiles.map((file, idx) => ({
        key: `${Date.now()}_${idx}_${file.name}`,
        file: file,
        name: file.name,
        folderName: 'Selected_Files',
        relativePath: file.name,
        size: file.size
      }));
      setBatchFiles(prev => [...prev, ...newItems]);
      setIsBatchMode(true);
      setSelectedFile(null);
      setUploadStatus('success');
      message.success(`Added ${newItems.length} CAD files to batch.`);
    }
    e.target.value = '';
  };

  const handleDropCustom = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const items = e.dataTransfer.items;
    if (!items || items.length === 0) return;

    const extractedFiles = [];

    const traverseFileTree = async (item, path = '') => {
      return new Promise((resolve) => {
        if (item.isFile) {
          item.file((file) => {
            if (isValidCadFile(file.name)) {
              file.customRelativePath = path ? `${path}/${file.name}` : file.name;
              file.customFolderName = path.split('/')[0] || 'Dropped_Files';
              extractedFiles.push(file);
            }
            resolve();
          }, () => resolve());
        } else if (item.isDirectory) {
          const dirReader = item.createReader();
          const readEntries = () => {
            dirReader.readEntries(async (entries) => {
              if (entries.length === 0) {
                resolve();
              } else {
                const currentPath = path ? `${path}/${item.name}` : item.name;
                for (const entry of entries) {
                  await traverseFileTree(entry, currentPath);
                }
                readEntries();
              }
            }, () => resolve());
          };
          readEntries();
        } else {
          resolve();
        }
      });
    };

    const promises = [];
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (it.webkitGetAsEntry) {
        const entry = it.webkitGetAsEntry();
        if (entry) promises.push(traverseFileTree(entry));
      } else if (it.kind === 'file') {
        const file = it.getAsFile();
        if (file && isValidCadFile(file.name)) {
          file.customRelativePath = file.name;
          file.customFolderName = 'Root';
          extractedFiles.push(file);
        }
      }
    }

    await Promise.all(promises);

    if (extractedFiles.length === 0) {
      message.error('No supported CAD files (.step, .stp, .iges, .igs, .stl) found.');
      return;
    }

    if (extractedFiles.length === 1 && !isBatchMode && batchFiles.length === 0) {
      const file = extractedFiles[0];
      if (file.size / 1024 / 1024 > 50) {
        message.error('File must be smaller than 50MB!');
        return;
      }
      setSelectedFile(file);
      setIsBatchMode(false);
      setBatchFiles([]);
      setUploadStatus('success');
      form.setFields([{ name: 'upload', errors: [] }]);
      message.success(`Selected file: ${file.name}`);
    } else {
      const newItems = extractedFiles.map((file, idx) => ({
        key: `${Date.now()}_${idx}_${file.name}`,
        file: file,
        name: file.name,
        folderName: file.customFolderName || 'Dropped_Folder',
        relativePath: file.customRelativePath || file.name,
        size: file.size
      }));
      setBatchFiles(prev => [...prev, ...newItems]);
      setIsBatchMode(true);
      setSelectedFile(null);
      setUploadStatus('success');
      const uniqueFolders = new Set(newItems.map(it => it.folderName)).size;
      message.success(`Added ${newItems.length} CAD files across ${uniqueFolders} folder(s). Total batch: ${batchFiles.length + newItems.length} files.`);
    }
  };

  const beforeUpload = (file) => {
    if (!isValidCadFile(file.name)) {
      message.error('Only STEP/STP/IGES/IGS/STL files are allowed!');
      return Upload.LIST_IGNORE;
    }

    const isLt50MB = file.size / 1024 / 1024 < 50;
    if (!isLt50MB) {
      message.error('File must be smaller than 50MB!');
      return Upload.LIST_IGNORE;
    }

    setSelectedFile(file);
    setIsBatchMode(false);
    setBatchFiles([]);
    setUploadStatus('success');
    form.setFields([{ name: 'upload', errors: [] }]);
    return false;
  };

  const onRemoveFile = () => {
    setSelectedFile(null);
    setBatchFiles([]);
    setIsBatchMode(false);
    setUploadStatus('idle');
  };

  const handleSubmit = async (values) => {
    // Case 1: Batch Process (Multiple folders/files uploaded)
    if (isBatchMode && batchFiles.length > 0) {
      if (!selectedMaterialId) {
        message.error('Please select a material.');
        return;
      }

      const payload = {
        files: batchFiles,
        materialId: selectedMaterialId,
        materialName: selectedMaterialName,
        density: density,
        materialSpecification: materials.find(m => m.id === selectedMaterialId)?.specification || ''
      };

      window.__BATCH_PROCESS_STORE__ = payload;
      navigate('/batchprocess', { state: payload });
      return;
    }

    // Case 2: Single File Mode
    if (!selectedFile) {
      message.error('Please upload a STEP/STP/IGES/IGS/STL file or folder.');
      return;
    }

    if (!selectedMaterialId) {
      message.error('Please select a material.');
      return;
    }

    setIsLoading(true);
    setUploadStatus('uploading');
    setProcessingStage('Analyzing file...');
    setConversionProgress(10);

    try {
      // Step 1: Determine file type and route to appropriate endpoint
      setProcessingStage('Analyzing file...');
      setConversionProgress(25);

      const isIgesFile = selectedFile.name.toLowerCase().endsWith('.iges') ||
        selectedFile.name.toLowerCase().endsWith('.igs');
      const isStlFile = selectedFile.name.toLowerCase().endsWith('.stl');

      let analyzeResponse;
      const cleanFileName = selectedFile.name;
      if (isIgesFile) {
        // Route IGES files to Flask endpoint
        const IGES_ANALYZE_URL = 'http://localhost:5678/analyze-iges-milling';
        const analyzeFormData = new FormData();
        analyzeFormData.append('file', selectedFile, cleanFileName);
        analyzeFormData.append('material_id', selectedMaterialId);
        analyzeFormData.append('quantity', '1');
        analyzeResponse = await axios.post(IGES_ANALYZE_URL, analyzeFormData);
      } else if (isStlFile) {
        // Route STL files to new STL endpoint
        const STL_ANALYZE_URL = 'http://localhost:5678/analyze-stl/';
        const analyzeFormData = new FormData();
        analyzeFormData.append('file', selectedFile, cleanFileName);
        analyzeFormData.append('material_id', selectedMaterialId);
        analyzeFormData.append('quantity', '1');
        analyzeResponse = await axios.post(STL_ANALYZE_URL, analyzeFormData);
      } else {
        // Route STEP files to FastAPI endpoint
        const analyzeFormData = new FormData();
        analyzeFormData.append('file', selectedFile, cleanFileName);
        analyzeFormData.append('material_id', selectedMaterialId);
        analyzeFormData.append('quantity', '1');
        analyzeResponse = await axios.post(ANALYZE_URL, analyzeFormData);
      }

      const analysis = analyzeResponse.data;
      console.log('Analysis result:', analysis);

      // Step 2: Calculate costs using the returned history_id
      setProcessingStage('Calculating costs...');
      setConversionProgress(50);

      const calcPayload = {
        history_id: analysis.id,
        machine_distribution: {
          '3 Axis': 70,
          '4 Axis': 0,
          '5 Axis': 30
        }
      };
      const calcResponse = await axios.post(CALCULATE_URL, calcPayload, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('Calculation response:', calcResponse.data);

      // Step 3: Convert and store GLB/Draco for this milling record WITH history_id
      setProcessingStage('Converting to 3D format...');
      setConversionProgress(75);

      try {
        const convertFormData = new FormData();
        convertFormData.append('file', selectedFile);
        convertFormData.append('history_id', analysis.id);

        const convertResponse = await axios.post('http://localhost:5000/convert-milling', convertFormData);
        console.log('Conversion response:', convertResponse.data);
      } catch (convErr) {
        console.warn('Conversion warning (convert-milling):', convErr);
        message.warning('File conversion had some issues, but analysis completed successfully.');
      }

      // Step 4: Navigate to the viewer page with analysis and cost data
      setProcessingStage('Complete!');
      setConversionProgress(100);

      const calculationId = analysis.id;
      localStorage.setItem('currentCalculationId', calculationId);

      navigate(`/viewer/${analysis.id}`, {
        state: {
          originalFilename: selectedFile.name,
          materialName: selectedMaterialName,
          quantity: 1,
          density: density,
          analysisData: analysis,
          initialCostData: calcResponse.data
        }
      });

      setUploadStatus('success');
    } catch (err) {
      console.error('API error:', err);

      let errorMessage = 'An error occurred during processing.';
      if (err.response) {
        errorMessage = `Server error: ${err.response.status}`;
        try {
          const errorData = err.response.data;
          if (typeof errorData === 'object' && errorData.detail) {
            errorMessage = errorData.detail;
          }
        } catch (e) {
          // Unable to parse error data
        }
      } else if (err.request) {
        errorMessage = 'No response received from the server. Is it running?';
      } else {
        errorMessage = err.message || errorMessage;
      }

      message.error(errorMessage);
      setUploadStatus('error');
      setConversionProgress(0);
    } finally {
      setIsLoading(false);
      setProcessingStage('');
    }
  };

  const CloudUploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={theme.buttonPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
      <polyline points="8 16 12 12 16 16"></polyline>
      <line x1="12" y1="12" x2="12" y2="21"></line>
    </svg>
  );

  const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );

  const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );

  const handleBackToModules = () => {
    navigate('/home/machine');
  };

  useEffect(() => {
    // Debug: Find what element has the background color
    console.log('=== DEBUG: Checking background colors ===');

    // Check all parent elements
    let current = document.querySelector('.ant-layout');
    let level = 0;

    while (current && level < 10) {
      const style = window.getComputedStyle(current);
      const bgColor = style.backgroundColor;
      console.log(`Level ${level}: ${current.tagName}.${current.className} - Background: ${bgColor}`);

      if (bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        console.log('FOUND COLORED BACKGROUND AT:', current);
        // Try to remove it
        current.style.background = 'transparent';
        current.style.backgroundColor = 'transparent';
      }

      current = current.parentElement;
      level++;
    }

    // Also check body and html
    console.log('Body background:', window.getComputedStyle(document.body).backgroundColor);
    console.log('HTML background:', window.getComputedStyle(document.documentElement).backgroundColor);
  }, []);


  return (
    <div style={{ background: 'transparent', minHeight: '70vh' }}>
      <button
        onClick={handleBackToModules}
        className="flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg transition-all duration-300"
        style={{ color: '#246679', background: 'transparent' }}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        <span className="font-semibold">Back to Modules</span>
      </button>

      <div style={{
        padding: '0px 32px 32px',
        overflow: 'initial',
        background: 'transparent'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Upload Section */}
          <div style={{ marginBottom: '40px' }}>
            <Card
              style={{
                borderRadius: '12px',
                boxShadow: theme.glowShadow,
                border: `2px solid ${theme.buttonPrimary}`,
                background: theme.white,
                overflow: 'visible',
                marginTop: '10px',
                marginLeft: '32px',
                marginRight: '32px'
              }}
              bodyStyle={{ padding: '0' }}
            >
              <div style={{
                padding: '20px 32px',
                background: theme.white,
                borderRadius: '12px 12px 0 0',
                textAlign: 'center',
                border: `1px solid ${theme.buttonPrimary}`,
                boxShadow: `inset 0 0 20px rgba(36, 102, 121, 0.1)`
              }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept=".step,.stp,.iges,.igs,.stl"
                  style={{ display: 'none' }}
                  onChange={handleMultipleFilesBrowse}
                />
                <input
                  type="file"
                  ref={folderInputRef}
                  webkitdirectory=""
                  directory=""
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleFolderUpload}
                />

                <div
                  onDrop={handleDropCustom}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  style={{
                    background: 'transparent',
                    border: `2px dashed ${theme.buttonPrimary}`,
                    borderRadius: '12px',
                    padding: '20px 24px',
                    boxShadow: `0 0 15px rgba(36, 102, 121, 0.2)`
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    {uploadStatus === 'success' ? <CheckIcon /> : <CloudUploadIcon />}

                    <Title level={4} style={{
                      margin: '8px 0 6px',
                      textAlign: 'center',
                      color: theme.textPrimary,
                    }}>
                      {isBatchMode && batchFiles.length > 0
                        ? 'Batch Folders Uploaded Successfully!'
                        : (selectedFile ? 'File uploaded successfully!' : 'Drag and drop files or folders to upload, or')}
                    </Title>

                    {/* Batch Mode Overview */}
                    {isBatchMode && batchFiles.length > 0 && (
                      <div style={{ margin: '8px 0 16px', textAlign: 'center', width: '100%', maxWidth: '700px' }}>
                        <Text style={{ display: 'block', color: theme.buttonPrimary, fontWeight: 600, fontSize: '15px', marginBottom: '8px' }}>
                          📁 {new Set(batchFiles.map(b => b.folderName)).size} Folder(s) &bull; {batchFiles.length} CAD Files Total
                        </Text>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', maxHeight: '100px', overflowY: 'auto', padding: '6px' }}>
                          {[...new Set(batchFiles.map(b => b.folderName))].map((fName) => {
                            const count = batchFiles.filter(b => b.folderName === fName).length;
                            return (
                              <Tag
                                key={fName}
                                color="cyan"
                                style={{
                                  borderRadius: '6px',
                                  padding: '4px 8px',
                                  fontSize: '12px',
                                  fontWeight: 500,
                                  border: `1px solid ${theme.buttonPrimary}`
                                }}
                              >
                                📁 {fName} ({count} file{count > 1 ? 's' : ''})
                              </Tag>
                            );
                          })}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '12px' }}>
                          <Button
                            size="middle"
                            onClick={() => folderInputRef.current?.click()}
                            style={{
                              borderColor: theme.buttonPrimary,
                              color: theme.buttonPrimary,
                              borderRadius: '6px'
                            }}
                          >
                            + Add More Folders
                          </Button>
                          <Button
                            size="middle"
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                              borderColor: theme.buttonPrimary,
                              color: theme.buttonPrimary,
                              borderRadius: '6px'
                            }}
                          >
                            + Add Files
                          </Button>
                          <Button
                            size="middle"
                            danger
                            onClick={onRemoveFile}
                            style={{ borderRadius: '6px' }}
                          >
                            Clear All
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Single File Mode */}
                    {!isBatchMode && selectedFile && (
                      <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                        <Text style={{
                          display: 'block',
                          color: theme.textPrimary,
                          fontSize: '14px',
                          fontWeight: 500,
                          marginBottom: '8px'
                        }}>
                          Selected file: {selectedFile?.name}
                        </Text>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                          <Button
                            size="small"
                            onClick={() => folderInputRef.current?.click()}
                            style={{ borderColor: theme.buttonPrimary, color: theme.buttonPrimary }}
                          >
                            Switch to Folder Upload
                          </Button>
                          <Button
                            size="small"
                            danger
                            onClick={onRemoveFile}
                          >
                            Remove File
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Idle State with Dual Browse Buttons */}
                    {uploadStatus !== 'success' && (
                      <div style={{ display: 'flex', gap: '12px', marginTop: '6px', marginBottom: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Button
                          type="primary"
                          size="large"
                          onClick={() => fileInputRef.current?.click()}
                          style={{
                            background: theme.buttonPrimary,
                            borderColor: theme.buttonPrimary,
                            borderRadius: '8px',
                            height: '36px',
                            fontWeight: 500,
                            color: theme.white,
                            boxShadow: `0 4px 15px rgba(36, 102, 121, 0.3)`
                          }}
                        >
                          Browse Files
                        </Button>
                        <Button
                          size="large"
                          onClick={() => folderInputRef.current?.click()}
                          style={{
                            borderColor: theme.buttonPrimary,
                            color: theme.buttonPrimary,
                            borderRadius: '8px',
                            height: '36px',
                            fontWeight: 600,
                            boxShadow: `0 2px 8px rgba(36, 102, 121, 0.15)`
                          }}
                        >
                          📁 Browse Folders
                        </Button>
                      </div>
                    )}

                    <Text style={{
                      color: theme.textSecondary,
                      fontSize: '13px'
                    }}>
                      File types: STEP, IGES, STL &bull; Multiple folders, nested subfolders & drag-and-drop supported
                    </Text>
                  </div>
                </div>
              </div>

              {/* Form Card */}
              <div style={{
                padding: '20px 32px',
                overflow: 'visible',
                background: theme.white
              }}>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  requiredMark={false}
                  style={{ maxWidth: '800px', margin: '0 auto', overflow: 'visible' }}
                >
                  <Row gutter={[24, 8]}>
                    <Col xs={24} sm={24} md={16} style={{ overflow: 'visible' }}>
                      <Form.Item
                        name="material"
                        label={
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{
                              fontWeight: 500,
                              color: theme.textPrimary,
                              fontSize: '16px'
                            }}>
                              Material
                            </span>
                            <Tooltip title="Select a material specification from the dropdown. You can search by material type, specification code, or density.">
                              <span style={{
                                marginLeft: '8px',
                                cursor: 'help',
                                color: theme.buttonPrimary,
                                fontSize: '16px'
                              }}>ⓘ</span>
                            </Tooltip>
                          </div>
                        }
                        rules={[{ required: true, message: 'Please select a material' }]}
                        style={{ marginBottom: '12px' }}
                      >
                        <Select
                          placeholder="Search by material, specification, or density..."
                          style={{ width: '100%' }}
                          dropdownStyle={{
                            borderRadius: '8px',
                            maxHeight: '400px',
                            overflowY: 'auto',
                            border: `1px solid ${theme.buttonPrimary}`,
                            boxShadow: theme.glowShadow
                          }}
                          size="large"
                          onChange={handleMaterialChange}
                          showSearch
                          filterOption={filterOption}
                          optionLabelProp="label"
                          notFoundContent={
                            <div style={{
                              padding: '16px',
                              textAlign: 'center',
                              color: theme.textPrimary
                            }}>
                              No matching materials found
                            </div>
                          }
                          dropdownRender={menu => (
                            <div>
                              <div style={{
                                padding: '12px 12px 4px',
                                borderBottom: `1px solid ${theme.buttonPrimary}`,
                                fontWeight: 500,
                                color: theme.textPrimary,
                                background: theme.white
                              }}>
                                Select Material
                              </div>
                              {menu}
                            </div>
                          )}
                        >
                          {materials.map((material) => (
                            <Option
                              key={material.id}
                              value={material.value}
                              label={material.label}
                              title={`${material.label} - ${material.specification} (${material.density} kg/m³)`}
                            >
                              {renderMaterialOption(material)}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8} style={{ overflow: 'visible' }}>
                      <Form.Item
                        label={<span style={{
                          fontWeight: 500,
                          color: theme.textPrimary,
                          fontSize: '16px'
                        }}>
                          Add Material
                        </span>}
                        style={{ marginBottom: '12px' }}
                      >
                        <Button
                          type="primary"
                          size="large"
                          icon={<PlusIcon />}
                          onClick={() => setIsModalVisible(true)}
                          style={{
                            width: '100%',
                            background: theme.buttonPrimary,
                            borderColor: theme.buttonPrimary,
                            color: theme.white,
                            fontWeight: 500,
                            boxShadow: `0 4px 15px rgba(36, 102, 121, 0.3)`,
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#1a5661';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = theme.buttonPrimary;
                          }}
                        >
                          Add New Material
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>

                  {selectedMaterialId && (
                    <div style={{
                      marginTop: '16px',
                      marginBottom: '24px',
                      padding: '16px',
                      borderRadius: '8px',
                      background: theme.white,
                      border: `1px solid ${theme.buttonPrimary}`,
                      boxShadow: `0 0 15px rgba(36, 102, 121, 0.2)`
                    }}>
                      <Row gutter={[16, 8]}>
                        <Col span={12}>
                          <Text style={{ color: theme.textPrimary }}>Selected Material:</Text>
                          <div style={{
                            fontWeight: 500,
                            marginTop: '4px',
                            color: theme.textPrimary
                          }}>
                            {selectedMaterialName}
                          </div>
                        </Col>
                        <Col span={12}>
                          <Text style={{ color: theme.textPrimary }}>Density:</Text>
                          <div style={{
                            fontWeight: 500,
                            marginTop: '4px',
                            color: theme.textPrimary
                          }}>
                            {density} kg/m³
                          </div>
                        </Col>
                        <Col span={24} style={{ marginTop: '8px' }}>
                          <Text style={{ color: theme.textPrimary }}>Material Specification:</Text>
                          <div style={{
                            fontWeight: 500,
                            marginTop: '4px',
                            color: theme.textPrimary
                          }}>
                            {materials.find(m => m.id === selectedMaterialId)?.specification || 'N/A'}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  )}

                  <Form.Item style={{ marginTop: '16px', textAlign: 'center', marginBottom: '0' }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isLoading}
                      disabled={isLoading || (!selectedFile && batchFiles.length === 0)}
                      size="large"
                      style={{
                        height: '48px',
                        padding: '0 48px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        background: theme.buttonPrimary,
                        borderColor: theme.buttonPrimary,
                        color: theme.white,
                        fontWeight: 500,
                        boxShadow: '0 4px 12px rgba(36, 102, 121, 0.5)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading && (selectedFile || batchFiles.length > 0)) {
                          e.target.style.background = '#1a5661';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoading && (selectedFile || batchFiles.length > 0)) {
                          e.target.style.background = theme.buttonPrimary;
                        }
                      }}
                    >
                      {isLoading
                        ? processingStage
                        : (isBatchMode && batchFiles.length > 0
                            ? `Analyze & Get Quote (${batchFiles.length} files)`
                            : 'Analyze & Get Quote')}
                    </Button>
                  </Form.Item>
                </Form>
                {isLoading && (
                  <div style={{ marginTop: '16px', width: '95%', marginLeft: 'auto', marginRight: 'auto' }}>
                    <Progress
                      percent={conversionProgress}
                      status="active"
                      strokeColor={{
                        '0%': '#246679',
                        '100%': '#73b6ca',
                      }}
                    />
                    <Text style={{
                      display: 'block',
                      textAlign: 'center',
                      marginTop: '8px',
                      color: theme.textPrimary,
                      fontSize: '14px',
                      fontWeight: 500,
                    }}>
                      {processingStage}
                    </Text>
                  </div>
                )}
              </div>
            </Card>
          </div>
          <div style={{ height: '16px' }}></div>
        </div>
      </div>

      {/* Add Material Modal */}
      <AddMaterialModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={fetchMaterials}
      />
    </div>
  );
}

export default UploadPage;