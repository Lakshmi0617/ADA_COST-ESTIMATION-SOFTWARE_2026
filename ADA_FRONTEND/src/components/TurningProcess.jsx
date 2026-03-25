



//'''''newupdated code''''''''
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

//   // Updated API endpoints for turning
//   const API_URL = 'http://172.18.100.156:8004';
//   const BOUNDING_BOX_URL = 'http://172.18.100.156:8004/bounding-box/';
//   const CALCULATE_COST_URL = 'http://172.18.100.156:8004/calculate-machining-cost/';
//   const CONVERT_URL = 'http://172.18.100.156:5000/convert-turning';      

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

//   // Fetch materials function for turning
//   useEffect(() => {
//     const fetchMaterials = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/turning-materials`);
//         console.log('Fetched turning materials:', response.data);

//         if (response.data.success && Array.isArray(response.data.data)) {
//           const formattedMaterials = response.data.data.map(item => ({
//             id: item.id,
//             value: item.material,
//             label: item.material,
//             specification: item.material_specification,
//             density: item.density,
//             material_cost: item.material_cost,
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

//   // Handle adding new material for turning
//   const handleAddMaterial = async (values) => {
//     setIsAddingMaterial(true);
//     try {
//       // Create the material data structure expected by the turning endpoint
//       const materialData = {
//         material: values.material,
//         material_specification: values.material_specification,
//         density: values.density,
//         material_cost: values.material_cost || 0,
//         parameters: values.parameters || [
//           {
//             diameter_range: "0-50",
//             roughing_depth_of_cut: 1.0,
//             roughing_feed_rate: 0.1,
//             roughing_cutting_speed: 100,
//             finishing_depth_of_cut: 0.5,
//             finishing_feed_rate: 0.05,
//             finishing_cutting_speed: 150
//           }
//         ],
//         mhr_rates: values.mhr_rates || [
//           {
//             diameter_condition: "0-50",
//             turning_rate: 50,
//             boring_rate: 60,
//             threading_rate: 70,
//             milling_rate: 80
//           }
//         ]
//       };

//       const response = await axios.post(`${API_URL}/materials/`, materialData);

//       if (response.status === 200 || response.status === 201) {
//         message.success('Material added successfully!');
        
//         // Refresh materials list
//         const materialsResponse = await axios.get(`${API_URL}/turning-materials`);
//         if (materialsResponse.data.success && Array.isArray(materialsResponse.data.data)) {
//           const formattedMaterials = materialsResponse.data.data.map(item => ({
//             id: item.id,
//             value: item.material,
//             label: item.material,
//             specification: item.material_specification,
//             density: item.density,
//             material_cost: item.material_cost,
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
//     // Step 1: Get bounding box analysis
//     const boundingBoxFormData = new FormData();
//     boundingBoxFormData.append('file', selectedFile);
//     boundingBoxFormData.append('material_id', selectedMaterialId);

//     const boundingBoxResponse = await axios.post(BOUNDING_BOX_URL, boundingBoxFormData);
//     console.log('Bounding box result:', boundingBoxResponse.data);

//     if (!boundingBoxResponse.data || !boundingBoxResponse.data.id) {
//       throw new Error('Bounding box analysis failed - no data or ID returned');
//     }

//     const historyId = boundingBoxResponse.data.id;
//     console.log('Got history ID from bounding box:', historyId);

//     // Step 2: Calculate initial machining cost with default operation distribution
//     const costFormData = new FormData();
//     costFormData.append('turning_history_id', historyId);
//     costFormData.append('turning_percentage', '50');
//     costFormData.append('boring_percentage', '50');
//     costFormData.append('threading_percentage', '0');
//     costFormData.append('milling_percentage', '0');
//     costFormData.append('quantity', '1');

//     const costResponse = await axios.post(CALCULATE_COST_URL, costFormData);
//     console.log('Cost calculation result:', costResponse.data);

//     // Step 3: Convert file for 3D rendering - UPDATED TO INCLUDE HISTORY_ID
//     const convertFormData = new FormData();
//     convertFormData.append('file', selectedFile);
//     convertFormData.append('history_id', historyId); // Add history_id here
    
//     try {
//       const convertResponse = await axios.post(CONVERT_URL, convertFormData);
//       console.log('File conversion completed:', convertResponse.data);
      
//       if (convertResponse.data.success) {
//         console.log('All formats available:', convertResponse.data.formats_available);
//       } else {
//         console.warn('Conversion completed with warnings:', convertResponse.data.message);
//       }
//     } catch (convErr) {
//       console.warn('Conversion warning (convert-turning):', convErr);
//       // Don't throw error here as conversion is not critical for main flow
//     }

//     // Step 4: Navigate to the viewer page with analysis data
//     localStorage.setItem('currentCalculationId', historyId);

//     navigate(`/turning-viewer/${historyId}`, { 
//       state: { 
//         originalFilename: selectedFile.name,
//         materialName: selectedMaterialName,
//         quantity: 1,
//         density: density,
//         analysisData: boundingBoxResponse.data,
//         initialCostData: costResponse.data
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
//         } else if (typeof errorData === 'object' && errorData.error) {
//           errorMessage = errorData.error;
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

//     const handleBackToModules = () => {
//     navigate('/home/machine');
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
//                         File types: STEP
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
//                   { required: true, message: 'Please enter material cost' },
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

//             {/* Turning Parameters Section */}
//             <Col span={24}>
//               <div style={{ 
//                 marginTop: '16px', 
//                 padding: '12px', 
//                 background: '#f0f8ff',
//                 borderRadius: '6px',
//                 border: `1px solid ${theme.buttonPrimary}20`
//               }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
//                   <Text style={{ 
//                     fontWeight: 600, 
//                     color: theme.textPrimary
//                   }}>
//                     Turning Parameters
//                   </Text>
//                   <Button 
//                     type="dashed" 
//                     size="small"
//                     onClick={() => {
//                       const currentParams = materialForm.getFieldValue('parameters') || [];
//                       materialForm.setFieldsValue({
//                         parameters: [...currentParams, {
//                           diameter_range: "0-50",
//                           roughing_depth_of_cut: 1.0,
//                           roughing_feed_rate: 0.1,
//                           roughing_cutting_speed: 100,
//                           finishing_depth_of_cut: 0.5,
//                           finishing_feed_rate: 0.05,
//                           finishing_cutting_speed: 150
//                         }]
//                       });
//                     }}
//                   >
//                     + Add Parameter Set
//                   </Button>
//                 </div>
                
//                 <Form.List name="parameters" initialValue={[{
//                   diameter_range: "0-50",
//                   roughing_depth_of_cut: 1.0,
//                   roughing_feed_rate: 0.1,
//                   roughing_cutting_speed: 100,
//                   finishing_depth_of_cut: 0.5,
//                   finishing_feed_rate: 0.05,
//                   finishing_cutting_speed: 150
//                 }]}>
//                   {(fields, { add, remove }) => (
//                     <>
//                       {fields.map(({ key, name, ...restField }) => (
//                         <div key={key} style={{ 
//                           marginBottom: '16px', 
//                           padding: '12px', 
//                           background: '#ffffff',
//                           borderRadius: '6px',
//                           border: '1px solid #e8e8e8'
//                         }}>
//                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
//                             <Text strong>Parameter Set {name + 1}</Text>
//                             {fields.length > 1 && (
//                               <Button 
//                                 type="text" 
//                                 danger 
//                                 size="small"
//                                 onClick={() => remove(name)}
//                               >
//                                 Remove
//                               </Button>
//                             )}
//                           </div>
//                           <Row gutter={[8, 8]}>
//                             <Col span={8}>
//                               <Form.Item
//                                 {...restField}
//                                 name={[name, 'diameter_range']}
//                                 label="Diameter Range"
//                                 rules={[{ required: true, message: 'Required' }]}
//                               >
//                                 <Input placeholder="0-50" size="small" />
//                               </Form.Item>
//                             </Col>
//                             <Col span={8}>
//                               <Form.Item
//                                 {...restField}
//                                 name={[name, 'roughing_depth_of_cut']}
//                                 label="Roughing DOC"
//                                 rules={[{ required: true, message: 'Required' }]}
//                               >
//                                 <InputNumber placeholder="1.0" size="small" style={{ width: '100%' }} min={0} precision={2} />
//                               </Form.Item>
//                             </Col>
//                             <Col span={8}>
//                               <Form.Item
//                                 {...restField}
//                                 name={[name, 'roughing_feed_rate']}
//                                 label="Roughing Feed"
//                                 rules={[{ required: true, message: 'Required' }]}
//                               >
//                                 <InputNumber placeholder="0.1" size="small" style={{ width: '100%' }} min={0} precision={3} />
//                               </Form.Item>
//                             </Col>
//                             <Col span={8}>
//                               <Form.Item
//                                 {...restField}
//                                 name={[name, 'roughing_cutting_speed']}
//                                 label="Roughing Speed"
//                                 rules={[{ required: true, message: 'Required' }]}
//                               >
//                                 <InputNumber placeholder="100" size="small" style={{ width: '100%' }} min={0} precision={0} />
//                               </Form.Item>
//                             </Col>
//                             <Col span={8}>
//                               <Form.Item
//                                 {...restField}
//                                 name={[name, 'finishing_depth_of_cut']}
//                                 label="Finishing DOC"
//                                 rules={[{ required: true, message: 'Required' }]}
//                               >
//                                 <InputNumber placeholder="0.5" size="small" style={{ width: '100%' }} min={0} precision={2} />
//                               </Form.Item>
//                             </Col>
//                             <Col span={8}>
//                               <Form.Item
//                                 {...restField}
//                                 name={[name, 'finishing_feed_rate']}
//                                 label="Finishing Feed"
//                                 rules={[{ required: true, message: 'Required' }]}
//                               >
//                                 <InputNumber placeholder="0.05" size="small" style={{ width: '100%' }} min={0} precision={3} />
//                               </Form.Item>
//                             </Col>
//                             <Col span={8}>
//                               <Form.Item
//                                 {...restField}
//                                 name={[name, 'finishing_cutting_speed']}
//                                 label="Finishing Speed"
//                                 rules={[{ required: true, message: 'Required' }]}
//                               >
//                                 <InputNumber placeholder="150" size="small" style={{ width: '100%' }} min={0} precision={0} />
//                               </Form.Item>
//                             </Col>
//                           </Row>
//                         </div>
//                       ))}
//                     </>
//                   )}
//                 </Form.List>
//               </div>
//             </Col>

//             {/* Machine Hour Rates Section */}
//             <Col span={24}>
//               <div style={{ 
//                 marginTop: '16px', 
//                 padding: '12px', 
//                 background: '#f0f8ff',
//                 borderRadius: '6px',
//                 border: `1px solid ${theme.buttonPrimary}20`
//               }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
//                   <Text style={{ 
//                     fontWeight: 600, 
//                     color: theme.textPrimary
//                   }}>
//                     Machine Hour Rates (₹/hour)
//                   </Text>
//                   <Button 
//                     type="dashed" 
//                     size="small"
//                     onClick={() => {
//                       const currentRates = materialForm.getFieldValue('mhr_rates') || [];
//                       materialForm.setFieldsValue({
//                         mhr_rates: [...currentRates, {
//                           diameter_condition: "0-50",
//                           turning_rate: 50,
//                           boring_rate: 60,
//                           threading_rate: 70,
//                           milling_rate: 80
//                         }]
//                       });
//                     }}
//                   >
//                     + Add Rate Set
//                   </Button>
//                 </div>
                
//                 <Form.List name="mhr_rates" initialValue={[{
//                   diameter_condition: "0-50",
//                   turning_rate: 50,
//                   boring_rate: 60,
//                   threading_rate: 70,
//                   milling_rate: 80
//                 }]}>
//                   {(fields, { add, remove }) => (
//                     <>
//                       {fields.map(({ key, name, ...restField }) => (
//                         <div key={key} style={{ 
//                           marginBottom: '16px', 
//                           padding: '12px', 
//                           background: '#ffffff',
//                           borderRadius: '6px',
//                           border: '1px solid #e8e8e8'
//                         }}>
//                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
//                             <Text strong>Rate Set {name + 1}</Text>
//                             {fields.length > 1 && (
//                               <Button 
//                                 type="text" 
//                                 danger 
//                                 size="small"
//                                 onClick={() => remove(name)}
//                               >
//                                 Remove
//                               </Button>
//                             )}
//                           </div>
//                           <Row gutter={[8, 8]}>
//                             <Col span={6}>
//                               <Form.Item
//                                 {...restField}
//                                 name={[name, 'diameter_condition']}
//                                 label="Diameter Condition"
//                                 rules={[{ required: true, message: 'Required' }]}
//                               >
//                                 <Input placeholder="0-50" size="small" />
//                               </Form.Item>
//                             </Col>
//                             <Col span={6}>
//                               <Form.Item
//                                 {...restField}
//                                 name={[name, 'turning_rate']}
//                                 label="Turning Rate"
//                                 rules={[{ required: true, message: 'Required' }]}
//                               >
//                                 <InputNumber placeholder="50" size="small" style={{ width: '100%' }} min={0} precision={0} />
//                               </Form.Item>
//                             </Col>
//                             <Col span={6}>
//                               <Form.Item
//                                 {...restField}
//                                 name={[name, 'boring_rate']}
//                                 label="Boring Rate"
//                                 rules={[{ required: true, message: 'Required' }]}
//                               >
//                                 <InputNumber placeholder="60" size="small" style={{ width: '100%' }} min={0} precision={0} />
//                               </Form.Item>
//                             </Col>
//                             <Col span={6}>
//                               <Form.Item
//                                 {...restField}
//                                 name={[name, 'threading_rate']}
//                                 label="Threading Rate"
//                                 rules={[{ required: true, message: 'Required' }]}
//                               >
//                                 <InputNumber placeholder="70" size="small" style={{ width: '100%' }} min={0} precision={0} />
//                               </Form.Item>
//                             </Col>
//                             <Col span={6}>
//                               <Form.Item
//                                 {...restField}
//                                 name={[name, 'milling_rate']}
//                                 label="Milling Rate"
//                                 rules={[{ required: true, message: 'Required' }]}
//                               >
//                                 <InputNumber placeholder="80" size="small" style={{ width: '100%' }} min={0} precision={0} />
//                               </Form.Item>
//                             </Col>
//                           </Row>
//                         </div>
//                       ))}
//                     </>
//                   )}
//                 </Form.List>
//               </div>
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
//               <strong>Note:</strong> Turning Parameters and Machine Hour Rates are required for proper cost calculation. 
//               Default values are provided but can be customized based on your specific requirements.
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




import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Layout, Upload, Button, Select, InputNumber, Form, Typography, message, Card, Row, Col, Spin, Tooltip, Tag, Modal, Input, Progress
} from 'antd';

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

function UploadPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [materialForm] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const fileInputRef = useRef(null);
  
  // Material state
  const [materials, setMaterials] = useState([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  const [selectedMaterialName, setSelectedMaterialName] = useState(null);
  const [density, setDensity] = useState(null);
  
  // Modal state for adding new material
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);

  // Progress state for loading bar
  const [processingStage, setProcessingStage] = useState('');
  const [conversionProgress, setConversionProgress] = useState(0);

  // Updated API endpoints for turning
  const API_URL = 'http://172.18.100.156:8004';
  const BOUNDING_BOX_URL = 'http://172.18.100.156:8004/bounding-box/';
  const CALCULATE_COST_URL = 'http://172.18.100.156:8004/calculate-machining-cost/';
  const CONVERT_URL = 'http://172.18.100.156:5000/convert-turning';      

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

  // Fetch materials function for turning
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get(`${API_URL}/turning-materials`);
        console.log('Fetched turning materials:', response.data);

        if (response.data.success && Array.isArray(response.data.data)) {
          const formattedMaterials = response.data.data.map(item => ({
            id: item.id,
            value: item.material,
            label: item.material,
            specification: item.material_specification,
            density: item.density,
            material_cost: item.material_cost,
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

  // Handle adding new material for turning
  const handleAddMaterial = async (values) => {
    setIsAddingMaterial(true);
    try {
      // Create the material data structure expected by the turning endpoint
      const materialData = {
        material: values.material,
        material_specification: values.material_specification,
        density: values.density,
        material_cost: values.material_cost || 0,
        parameters: values.parameters || [
          {
            diameter_range: "0-50",
            roughing_depth_of_cut: 1.0,
            roughing_feed_rate: 0.1,
            roughing_cutting_speed: 100,
            finishing_depth_of_cut: 0.5,
            finishing_feed_rate: 0.05,
            finishing_cutting_speed: 150
          }
        ],
        mhr_rates: values.mhr_rates || [
          {
            diameter_condition: "0-50",
            turning_rate: 50,
            boring_rate: 60,
            threading_rate: 70,
            milling_rate: 80
          }
        ]
      };

      const response = await axios.post(`${API_URL}/materials/`, materialData);

      if (response.status === 200 || response.status === 201) {
        message.success('Material added successfully!');
        
        // Refresh materials list
        const materialsResponse = await axios.get(`${API_URL}/turning-materials`);
        if (materialsResponse.data.success && Array.isArray(materialsResponse.data.data)) {
          const formattedMaterials = materialsResponse.data.data.map(item => ({
            id: item.id,
            value: item.material,
            label: item.material,
            specification: item.material_specification,
            density: item.density,
            material_cost: item.material_cost,
            searchText: `${item.material.toLowerCase()} ${item.material_specification.toLowerCase()} ${item.density}`
          }));
          setMaterials(formattedMaterials);
        }
        
        setIsModalVisible(false);
        materialForm.resetFields();
      }
    } catch (error) {
      console.error('Error adding material:', error);
      message.error('Failed to add material. Please try again.');
    } finally {
      setIsAddingMaterial(false);
    }
  };

  const beforeUpload = (file) => {
    const isValidFile = file.name.toLowerCase().endsWith('.step') || 
                       file.name.toLowerCase().endsWith('.stp') || 
                       file.name.toLowerCase().endsWith('.stl');
    if (!isValidFile) {
      message.error('Only STEP/STP/STL files are allowed!');
      return Upload.LIST_IGNORE;
    }
    
    const isLt50MB = file.size / 1024 / 1024 < 50;
    if (!isLt50MB) {
      message.error('File must be smaller than 50MB!');
      return Upload.LIST_IGNORE;
    }
    
    setSelectedFile(file);
    setUploadStatus('success');
    form.setFields([{ name: 'upload', errors: [] }]);
    return false;
  };

  const onRemoveFile = () => {
    setSelectedFile(null);
    setUploadStatus('idle');
  };

  const handleSubmit = async (values) => {
    if (!selectedFile) {
      message.error('Please upload a STEP/STP/STL file.');
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
      // Step 1: Get bounding box analysis
      setProcessingStage('Analyzing file...');
      setConversionProgress(25);
      
      const boundingBoxFormData = new FormData();
      boundingBoxFormData.append('file', selectedFile);
      boundingBoxFormData.append('material_id', selectedMaterialId);

      const boundingBoxResponse = await axios.post(BOUNDING_BOX_URL, boundingBoxFormData);
      console.log('Bounding box result:', boundingBoxResponse.data);

      if (!boundingBoxResponse.data || !boundingBoxResponse.data.id) {
        throw new Error('Bounding box analysis failed - no data or ID returned');
      }

      const historyId = boundingBoxResponse.data.id;
      console.log('Got history ID from bounding box:', historyId);

      // Step 2: Calculate initial machining cost with default operation distribution
      setProcessingStage('Calculating costs...');
      setConversionProgress(50);
      
      const costFormData = new FormData();
      costFormData.append('turning_history_id', historyId);
      costFormData.append('turning_percentage', '100');
      costFormData.append('boring_percentage', '0');
      costFormData.append('threading_percentage', '0');
      costFormData.append('milling_percentage', '0');
      costFormData.append('quantity', '1');

      const costResponse = await axios.post(CALCULATE_COST_URL, costFormData);
      console.log('Cost calculation result:', costResponse.data);

      // Step 3: Convert file for 3D rendering - UPDATED TO INCLUDE HISTORY_ID
      setProcessingStage('Converting to 3D format...');
      setConversionProgress(75);
      
      const convertFormData = new FormData();
      convertFormData.append('file', selectedFile);
      convertFormData.append('history_id', historyId); // Add history_id here
      
      try {
        const convertResponse = await axios.post(CONVERT_URL, convertFormData);
        console.log('File conversion completed:', convertResponse.data);
        
        if (convertResponse.data.success) {
          console.log('All formats available:', convertResponse.data.formats_available);
        } else {
          console.warn('Conversion completed with warnings:', convertResponse.data.message);
        }
      } catch (convErr) {
        console.warn('Conversion warning (convert-turning):', convErr);
        // Don't throw error here as conversion is not critical for main flow
      }

      // Step 4: Navigate to the viewer page with analysis data
      setProcessingStage('Complete!');
      setConversionProgress(100);
      
      localStorage.setItem('currentCalculationId', historyId);

      navigate(`/turning-viewer/${historyId}`, { 
        state: { 
          originalFilename: selectedFile.name,
          materialName: selectedMaterialName,
          quantity: 1,
          density: density,
          analysisData: boundingBoxResponse.data,
          initialCostData: costResponse.data
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
          } else if (typeof errorData === 'object' && errorData.error) {
            errorMessage = errorData.error;
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

 
  return (
  <div style={{ 
    minHeight: '80vh', 
    background: 'transparent',
    overflow: 'auto'
  }}>
    <div style={{ overflow: 'visible', background: 'transparent' }}>
      <div style={{ 
        padding: '10px 32px 32px',
        overflow: 'initial',
        background: 'transparent'
      }}>
        <button
          onClick={handleBackToModules}
          className="flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg transition-all duration-300"
          style={{color: '#246679', background: 'transparent'}}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold">Back to Modules</span>
        </button>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', background: 'transparent' }}>
         
          {/* Upload Section */}
          <div style={{ marginBottom: '40px', background: 'transparent' }}>
            <Title level={2} style={{ 
              marginBottom: '4px', 
              color: theme.textPrimary,
              background: 'transparent'
            }}>
              {/* Upload your file for Milling Process  */}
            </Title>
            <Paragraph style={{ 
              marginBottom: '16px', 
              color: theme.textPrimary,
              fontSize: '16px',
              background: 'transparent'
            }}>
              {/* Upload files to get instant CNC machining quotation and unleash the magic of manufacturing */}
            </Paragraph>
            
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
                padding: '10px 32px', 
                background: theme.white,
                borderRadius: '12px 12px 0 0', 
                textAlign: 'center',
                border: `1px solid ${theme.buttonPrimary}`,
                boxShadow: `inset 0 0 20px rgba(36, 102, 121, 0.1)`
              }}>
                {/* STEP/STP File Upload Area */}
                <Dragger
                  name="file"
                  multiple={false}
                  beforeUpload={beforeUpload}
                  onRemove={onRemoveFile}
                  fileList={selectedFile ? [selectedFile] : []}
                  style={{ 
                    background: 'transparent',
                    border: `2px dashed ${theme.buttonPrimary}`,
                    borderRadius: '12px',
                    padding: '10px 20px',
                    boxShadow: `0 0 15px rgba(36, 102, 121, 0.2)`,
                    
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    {uploadStatus === 'success' ? <CheckIcon /> : <CloudUploadIcon />}
                    
                    <Title level={4} style={{ 
                      margin: '10px 0 8px', 
                      textAlign: 'center', 
                      color: theme.textPrimary,
                      background: 'transparent'
                    }}>
                      {uploadStatus === 'success' ? 'File uploaded successfully!' : 'Drag and drop files to upload, or'}
                    </Title>
                    
                    {uploadStatus !== 'success' && (
                      <Button 
                        type="primary" 
                        size="large"
                        style={{ 
                          background: theme.buttonPrimary,
                          borderColor: theme.buttonPrimary,
                          borderRadius: '8px',
                          height: '30px',
                          marginTop: '0px',
                          marginBottom: '16px',
                          fontWeight: 500,
                          color: theme.white,
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
                        Browse Files
                      </Button>
                    )}
                    
                    {uploadStatus === 'success' && (
                      <Text style={{ 
                        marginBottom: '16px', 
                        color: theme.textPrimary,
                        fontSize: '14px',
                        background: 'transparent'
                      }}>
                        Selected file: {selectedFile?.name}
                      </Text>
                    )}
                    
                    <Text style={{ 
                      color: theme.textPrimary, 
                      marginBottom: '8px',
                      fontSize: '14px',
                      background: 'transparent'
                    }}>
                      File types: STEP
                    </Text>
                    
                    <Text style={{ 
                      color: theme.textPrimary, 
                      fontSize: '12px',
                      background: 'transparent'
                    }}>
                     
                    </Text>
                  </div>
                </Dragger>
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
                    <Col xs={24} sm={24} md={16} style={{ overflow: 'visible', background: 'transparent' }}>
                      <Form.Item
                        name="material"
                        label={
                          <div style={{ display: 'flex', alignItems: 'center', background: 'transparent' }}>
                            <span style={{ 
                              fontWeight: 500, 
                              color: theme.textPrimary,
                              fontSize: '16px',
                              background: 'transparent'
                            }}>
                              Material
                            </span>
                            <Tooltip title="Select a material specification from the dropdown. You can search by material type, specification code, or density.">
                              <span style={{ 
                                marginLeft: '8px',
                                cursor: 'help',
                                color: theme.buttonPrimary,
                                fontSize: '16px',
                                background: 'transparent'
                              }}>ⓘ</span>
                            </Tooltip>
                          </div>
                        }
                        rules={[{ required: true, message: 'Please select a material' }]}
                        style={{ marginBottom: '12px', background: 'transparent' }}
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
                              color: theme.textPrimary,
                              background: 'transparent'
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
                    <Col xs={24} sm={24} md={8} style={{ overflow: 'visible', background: 'transparent' }}>
                      <Form.Item
                        label={<span style={{ 
                          fontWeight: 500, 
                          color: theme.textPrimary,
                          fontSize: '16px',
                          background: 'transparent'
                        }}>
                          Add Material
                        </span>}
                        style={{ marginBottom: '12px', background: 'transparent' }}
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

                  {/* When a material is selected, show a summary card */}
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
                          <Text style={{ color: theme.textPrimary, background: 'transparent' }}>Selected Material:</Text>
                          <div style={{ 
                            fontWeight: 500, 
                            marginTop: '4px',
                            color: theme.textPrimary,
                            background: 'transparent'
                          }}>
                            {selectedMaterialName}
                          </div>
                        </Col>
                        <Col span={12}>
                          <Text style={{ color: theme.textPrimary, background: 'transparent' }}>Density:</Text>
                          <div style={{ 
                            fontWeight: 500, 
                            marginTop: '4px',
                            color: theme.textPrimary,
                            background: 'transparent'
                          }}>
                            {density} kg/m³
                          </div>
                        </Col>
                        <Col span={24} style={{ marginTop: '8px' }}>
                          <Text style={{ color: theme.textPrimary, background: 'transparent' }}>Material Specification:</Text>
                          <div style={{ 
                            fontWeight: 500, 
                            marginTop: '4px',
                            color: theme.textPrimary,
                            background: 'transparent'
                          }}>
                            {materials.find(m => m.id === selectedMaterialId)?.specification || 'N/A'}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  )}

                  <Form.Item style={{ marginTop: '16px', textAlign: 'center', marginBottom: '0', background: 'transparent' }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isLoading}
                      disabled={isLoading || !selectedFile}
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
                        if (!isLoading && selectedFile) {
                          e.target.style.background = '#1a5661';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoading && selectedFile) {
                          e.target.style.background = theme.buttonPrimary;
                        }
                      }}
                    >
                      {isLoading ? processingStage : 'Analyze & Get Quote'}
                    </Button>
                  </Form.Item>
                </Form>
                 {isLoading && (
                    <div style={{ marginTop: '16px', background: 'transparent' }}>
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
                        background: 'transparent'
                      }}>
                        {processingStage}
                      </Text>
                    </div>
                  )}
              </div>
            </Card>
          </div>
          <div style={{ height: '16px', background: 'transparent' }}></div>
        </div>
      </div>
    </div>

    {/* Add Material Modal - ENHANCED with MRR and Material Cost */}
    <Modal
      title={
        <span style={{ 
          color: theme.textPrimary, 
          fontWeight: 600,
          fontSize: '18px'
        }}>
          Add New Material
        </span>
      }
      open={isModalVisible}
      onCancel={() => {
        setIsModalVisible(false);
        materialForm.resetFields();
      }}
      footer={null}
      width={600}
      style={{
        borderRadius: '12px',
      }}
      bodyStyle={{
        padding: '20px',
        background: theme.white,
        maxHeight: '70vh',
        overflowY: 'auto'
      }}
    >
      <Form
        form={materialForm}
        layout="vertical"
        onFinish={handleAddMaterial}
        style={{ marginTop: '16px' }}
      >
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <Form.Item
              name="material"
              label={<span style={{ fontWeight: 500, color: theme.textPrimary }}>Material Name</span>}
              rules={[{ required: true, message: 'Please enter material name' }]}
            >
              <Input 
                placeholder="e.g., Titanium Alloy"
                size="large"
                style={{ borderRadius: '6px' }}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="material_specification"
              label={<span style={{ fontWeight: 500, color: theme.textPrimary }}>Material Specification</span>}
              rules={[{ required: true, message: 'Please enter material specification' }]}
            >
              <Input 
                placeholder="e.g., ASTM B348"
                size="large"
                style={{ borderRadius: '6px' }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="density"
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontWeight: 500, color: theme.textPrimary }}>Density (kg/m³)</span>
                  <Tooltip title="Material density in kilograms per cubic meter">
                    <span style={{ 
                      marginLeft: '4px',
                      cursor: 'help',
                      color: theme.buttonPrimary,
                      fontSize: '12px'
                    }}>ⓘ</span>
                  </Tooltip>
                </div>
              }
              rules={[
                { required: true, message: 'Please enter density' },
                { type: 'number', min: 0.1, message: 'Density must be greater than 0' }
              ]}
            >
              <InputNumber 
                placeholder="e.g., 7800"
                size="large"
                style={{ width: '100%', borderRadius: '6px' }}
                min={0.1}
                precision={2}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="material_cost"
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontWeight: 500, color: theme.textPrimary }}>Material Cost (₹/kg)</span>
                  <Tooltip title="Cost of material per kilogram in Indian Rupees">
                    <span style={{ 
                      marginLeft: '4px',
                      cursor: 'help',
                      color: theme.buttonPrimary,
                      fontSize: '12px'
                    }}>ⓘ</span>
                  </Tooltip>
                </div>
              }
              rules={[
                { required: true, message: 'Please enter material cost' },
                { type: 'number', min: 0, message: 'Material cost must be 0 or greater' }
              ]}
            >
              <InputNumber 
                placeholder="e.g., 450.00"
                size="large"
                style={{ width: '100%', borderRadius: '6px' }}
                min={0}
                precision={2}
                formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/₹\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>

          {/* Turning Parameters Section */}
          <Col span={24}>
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              background: '#f0f8ff',
              borderRadius: '6px',
              border: `1px solid ${theme.buttonPrimary}20`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <Text style={{ 
                  fontWeight: 600, 
                  color: theme.textPrimary
                }}>
                  Turning Parameters
                </Text>
                <Button 
                  type="dashed" 
                  size="small"
                  onClick={() => {
                    const currentParams = materialForm.getFieldValue('parameters') || [];
                    materialForm.setFieldsValue({
                      parameters: [...currentParams, {
                        diameter_range: "0-50",
                        roughing_depth_of_cut: 1.0,
                        roughing_feed_rate: 0.1,
                        roughing_cutting_speed: 100,
                        finishing_depth_of_cut: 0.5,
                        finishing_feed_rate: 0.05,
                        finishing_cutting_speed: 150
                      }]
                    });
                  }}
                >
                  + Add Parameter Set
                </Button>
              </div>
              
              <Form.List name="parameters" initialValue={[{
                diameter_range: "0-50",
                roughing_depth_of_cut: 1.0,
                roughing_feed_rate: 0.1,
                roughing_cutting_speed: 100,
                finishing_depth_of_cut: 0.5,
                finishing_feed_rate: 0.05,
                finishing_cutting_speed: 150
              }]}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key} style={{ 
                        marginBottom: '16px', 
                        padding: '12px', 
                        background: '#ffffff',
                        borderRadius: '6px',
                        border: '1px solid #e8e8e8'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <Text strong>Parameter Set {name + 1}</Text>
                          {fields.length > 1 && (
                            <Button 
                              type="text" 
                              danger 
                              size="small"
                              onClick={() => remove(name)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        <Row gutter={[8, 8]}>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, 'diameter_range']}
                              label="Diameter Range"
                              rules={[{ required: true, message: 'Required' }]}
                            >
                              <Input placeholder="0-50" size="small" />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, 'roughing_depth_of_cut']}
                              label="Roughing DOC"
                              rules={[{ required: true, message: 'Required' }]}
                            >
                              <InputNumber placeholder="1.0" size="small" style={{ width: '100%' }} min={0} precision={2} />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, 'roughing_feed_rate']}
                              label="Roughing Feed"
                              rules={[{ required: true, message: 'Required' }]}
                            >
                              <InputNumber placeholder="0.1" size="small" style={{ width: '100%' }} min={0} precision={3} />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, 'roughing_cutting_speed']}
                              label="Roughing Speed"
                              rules={[{ required: true, message: 'Required' }]}
                            >
                              <InputNumber placeholder="100" size="small" style={{ width: '100%' }} min={0} precision={0} />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, 'finishing_depth_of_cut']}
                              label="Finishing DOC"
                              rules={[{ required: true, message: 'Required' }]}
                            >
                              <InputNumber placeholder="0.5" size="small" style={{ width: '100%' }} min={0} precision={2} />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, 'finishing_feed_rate']}
                              label="Finishing Feed"
                              rules={[{ required: true, message: 'Required' }]}
                            >
                              <InputNumber placeholder="0.05" size="small" style={{ width: '100%' }} min={0} precision={3} />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, 'finishing_cutting_speed']}
                              label="Finishing Speed"
                              rules={[{ required: true, message: 'Required' }]}
                            >
                              <InputNumber placeholder="150" size="small" style={{ width: '100%' }} min={0} precision={0} />
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </>
                )}
              </Form.List>
            </div>
          </Col>

          {/* Machine Hour Rates Section */}
          <Col span={24}>
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              background: '#f0f8ff',
              borderRadius: '6px',
              border: `1px solid ${theme.buttonPrimary}20`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <Text style={{ 
                  fontWeight: 600, 
                  color: theme.textPrimary
                }}>
                  Machine Hour Rates (₹/hour)
                </Text>
                <Button 
                  type="dashed" 
                  size="small"
                  onClick={() => {
                    const currentRates = materialForm.getFieldValue('mhr_rates') || [];
                    materialForm.setFieldsValue({
                      mhr_rates: [...currentRates, {
                        diameter_condition: "0-50",
                        turning_rate: 50,
                        boring_rate: 60,
                        threading_rate: 70,
                        milling_rate: 80
                      }]
                    });
                  }}
                >
                  + Add Rate Set
                </Button>
              </div>
              
              <Form.List name="mhr_rates" initialValue={[{
                diameter_condition: "0-50",
                turning_rate: 50,
                boring_rate: 60,
                threading_rate: 70,
                milling_rate: 80
              }]}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key} style={{ 
                        marginBottom: '16px', 
                        padding: '12px', 
                        background: '#ffffff',
                        borderRadius: '6px',
                        border: '1px solid #e8e8e8'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <Text strong>Rate Set {name + 1}</Text>
                          {fields.length > 1 && (
                            <Button 
                              type="text" 
                              danger 
                              size="small"
                              onClick={() => remove(name)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        <Row gutter={[8, 8]}>
                          <Col span={6}>
                            <Form.Item
                              {...restField}
                              name={[name, 'diameter_condition']}
                              label="Diameter Condition"
                              rules={[{ required: true, message: 'Required' }]}
                            >
                              <Input placeholder="0-50" size="small" />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item
                              {...restField}
                              name={[name, 'turning_rate']}
                              label="Turning Rate"
                              rules={[{ required: true, message: 'Required' }]}
                            >
                              <InputNumber placeholder="50" size="small" style={{ width: '100%' }} min={0} precision={0} />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item
                              {...restField}
                              name={[name, 'boring_rate']}
                              label="Boring Rate"
                              rules={[{ required: true, message: 'Required' }]}
                            >
                              <InputNumber placeholder="60" size="small" style={{ width: '100%' }} min={0} precision={0} />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item
                              {...restField}
                              name={[name, 'threading_rate']}
                              label="Threading Rate"
                              rules={[{ required: true, message: 'Required' }]}
                            >
                              <InputNumber placeholder="70" size="small" style={{ width: '100%' }} min={0} precision={0} />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item
                              {...restField}
                              name={[name, 'milling_rate']}
                              label="Milling Rate"
                              rules={[{ required: true, message: 'Required' }]}
                            >
                              <InputNumber placeholder="80" size="small" style={{ width: '100%' }} min={0} precision={0} />
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </>
                )}
              </Form.List>
            </div>
          </Col>
        </Row>

        <div style={{ 
          marginTop: '16px',
          padding: '12px',
          background: '#f0f8ff',
          borderRadius: '6px',
          border: `1px solid ${theme.buttonPrimary}20`
        }}>
          <Text style={{ 
            fontSize: '12px', 
            color: theme.textPrimary,
            fontStyle: 'italic'
          }}>
            <strong>Note:</strong> Turning Parameters and Machine Hour Rates are required for proper cost calculation. 
            Default values are provided but can be customized based on your specific requirements.
          </Text>
        </div>

        <Form.Item style={{ textAlign: 'right', marginTop: '24px', marginBottom: '0' }}>
          <Button 
            onClick={() => {
              setIsModalVisible(false);
              materialForm.resetFields();
            }}
            style={{ 
              marginRight: '12px',
              borderRadius: '6px',
              height: '40px'
            }}
          >
            Cancel
          </Button>
          <Button 
            type="primary"
            htmlType="submit"
            loading={isAddingMaterial}
            style={{
              background: theme.buttonPrimary,
              borderColor: theme.buttonPrimary,
              color: theme.white,
              fontWeight: 500,
              borderRadius: '6px',
              height: '40px',
              minWidth: '80px'
            }}
            onMouseEnter={(e) => {
              if (!isAddingMaterial) {
                e.target.style.background = '#1a5661';
              }
            }}
            onMouseLeave={(e) => {
              if (!isAddingMaterial) {
                e.target.style.background = theme.buttonPrimary;
              }
            }}
          >
            {isAddingMaterial ? 'Adding...' : 'Add Material'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  </div>
);
}

export default UploadPage;