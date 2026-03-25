// // import React, { useState, useRef, useEffect } from 'react';
// // import axios from 'axios';
// // import { useNavigate } from 'react-router-dom';
// // import {
// //   Layout, Upload, Button, Select, InputNumber, Form, Typography, message, Card, Row, Col, Spin, Tooltip, Tag, Modal, Input, Progress
// // } from 'antd';

// // const { Content } = Layout;
// // const { Title, Text, Paragraph } = Typography;
// // const { Option } = Select;
// // const { Dragger } = Upload;

// // // Updated theme colors to match navbar design
// // const theme = {
// //   textPrimary: '#000000',
// //   textSecondary: '#000000',
// //   darkGray: '#000000',
// //   softBlack: '#000000',
// //   darkNavy: '#000000',
// //   darkNavySecondary: '#73b6ca',
// //   buttonPrimary: '#246679',
// //   buttonSecondary: '#73b6ca',
// //   borderColor: '#246679',
// //   white: '#ffffff',
// //   shadow: '0 2px 12px rgba(36, 102, 121, 0.15)',
// //   glowShadow: '0 0 10px rgba(36, 102, 121, 0.2)',
// //   lightBackground: '#73b6ca',
// // };

// // function CompositesProcess() {
// //   const navigate = useNavigate();
// //   const [form] = Form.useForm();
// //   const [materialForm] = Form.useForm();
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [selectedFile, setSelectedFile] = useState(null);
// //   const [uploadStatus, setUploadStatus] = useState('idle');
// //   const fileInputRef = useRef(null);
  
// //   // Material state
// //   const [materials, setMaterials] = useState([]);
// //   const [selectedMaterialId, setSelectedMaterialId] = useState(null);
// //   const [selectedMaterialName, setSelectedMaterialName] = useState(null);
// //   const [density, setDensity] = useState(null);
  
// //   // Modal state for adding new material
// //   const [isModalVisible, setIsModalVisible] = useState(false);
// //   const [isAddingMaterial, setIsAddingMaterial] = useState(false);

// //   // Progress state for loading bar
// //   const [processingStage, setProcessingStage] = useState('');
// //   const [conversionProgress, setConversionProgress] = useState(0);

// //   // Updated API endpoints for composites
// //   const API_URL = 'http://172.18.100.156:8004';
// //   const BOUNDING_BOX_URL = 'http://172.18.100.156:8004/bounding-box/';
// //   const CALCULATE_COST_URL = 'http://172.18.100.156:8004/calculate-machining-cost/';
// //   const CONVERT_URL = 'http://172.18.100.156:5000/convert-composites';      

// //   // Customized material selection rendering
// //   const renderMaterialOption = (material) => {
// //     return (
// //       <div style={{ padding: '8px 4px' }}>
// //         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
// //           <span style={{ fontWeight: 500, color: theme.textPrimary }}>{material.label}</span>
// //           <Tag style={{ 
// //             background: theme.buttonPrimary, 
// //             color: theme.white, 
// //             border: 'none',
// //             borderRadius: '4px'
// //           }}>
// //             {material.density} kg/m³
// //           </Tag>
// //         </div>
// //         <div style={{ 
// //           fontSize: '12px', 
// //           color: theme.textPrimary,
// //           marginTop: '4px',
// //           whiteSpace: 'normal',
// //           lineHeight: '1.4'
// //         }}>
// //           {material.specification}
// //         </div>
// //       </div>
// //     );
// //   };

// //   // Fetch materials function for composites
// //   useEffect(() => {
// //     const fetchMaterials = async () => {
// //       try {
// //         const response = await axios.get(`${API_URL}/composites-materials`);
// //         console.log('Fetched composites materials:', response.data);

// //         if (response.data.success && Array.isArray(response.data.data)) {
// //           const formattedMaterials = response.data.data.map(item => ({
// //             id: item.id,
// //             value: item.material,
// //             label: item.material,
// //             specification: item.material_specification,
// //             density: item.density,
// //             material_cost: item.material_cost,
// //             searchText: `${item.material.toLowerCase()} ${item.material_specification.toLowerCase()} ${item.density}`
// //           }));
// //           setMaterials(formattedMaterials);
// //         } else {
// //           console.error('Unexpected response structure:', response.data);
// //           message.error('Failed to load materials. Please refresh the page.');
// //         }
// //       } catch (error) {
// //         console.error('Error fetching materials:', error);
// //         message.error('Failed to load materials from server.');
// //       }
// //     };

// //     fetchMaterials();
// //   }, []);

// //   // Custom search filter for the Select component
// //   const filterOption = (input, option) => {
// //     const material = materials.find(m => m.value === option.value);
// //     if (!material) return false;
// //     return material.searchText.includes(input.toLowerCase());
// //   };

// //   // Handle material selection
// //   const handleMaterialChange = (value) => {
// //     console.log('Selected material:', value);
    
// //     const selectedMaterial = materials.find(mat => mat.value === value);
// //     if (selectedMaterial) {
// //       setSelectedMaterialId(selectedMaterial.id);
// //       setSelectedMaterialName(selectedMaterial.value);
// //       setDensity(selectedMaterial.density);
      
// //       message.success(`Material selected: ${selectedMaterial.value} (Density: ${selectedMaterial.density} kg/m³)`);
// //     }
// //   };

// //   // Handle adding new material for composites
// //   const handleAddMaterial = async (values) => {
// //     setIsAddingMaterial(true);
// //     try {
// //       // Create the material data structure expected by the composites endpoint
// //       const materialData = {
// //         material: values.material,
// //         material_specification: values.material_specification,
// //         density: values.density,
// //         material_cost: values.material_cost || 0,
// //         parameters: values.parameters || [
// //           {
// //             parameter_type: "standard",
// //             layup_rate: 1.0,
// //             curing_temperature: 180,
// //             curing_time: 120
// //           }
// //         ]
// //       };

// //       const response = await axios.post(`${API_URL}/materials/`, materialData);

// //       if (response.status === 200 || response.status === 201) {
// //         message.success('Material added successfully!');
        
// //         // Refresh materials list
// //         const materialsResponse = await axios.get(`${API_URL}/composites-materials`);
// //         if (materialsResponse.data.success && Array.isArray(materialsResponse.data.data)) {
// //           const formattedMaterials = materialsResponse.data.data.map(item => ({
// //             id: item.id,
// //             value: item.material,
// //             label: item.material,
// //             specification: item.material_specification,
// //             density: item.density,
// //             material_cost: item.material_cost,
// //             searchText: `${item.material.toLowerCase()} ${item.material_specification.toLowerCase()} ${item.density}`
// //           }));
// //           setMaterials(formattedMaterials);
// //         }
        
// //         setIsModalVisible(false);
// //         materialForm.resetFields();
// //       }
// //     } catch (error) {
// //       console.error('Error adding material:', error);
// //       message.error('Failed to add material. Please try again.');
// //     } finally {
// //       setIsAddingMaterial(false);
// //     }
// //   };

// //   const beforeUpload = (file) => {
// //     const isValidFile = file.name.toLowerCase().endsWith('.step') || 
// //                        file.name.toLowerCase().endsWith('.stp') || 
// //                        file.name.toLowerCase().endsWith('.stl');
// //     if (!isValidFile) {
// //       message.error('Only STEP/STP/STL files are allowed!');
// //       return Upload.LIST_IGNORE;
// //     }
    
// //     const isLt50MB = file.size / 1024 / 1024 < 50;
// //     if (!isLt50MB) {
// //       message.error('File must be smaller than 50MB!');
// //       return Upload.LIST_IGNORE;
// //     }
    
// //     setSelectedFile(file);
// //     setUploadStatus('success');
// //     form.setFields([{ name: 'upload', errors: [] }]);
// //     return false;
// //   };

// //   const onRemoveFile = () => {
// //     setSelectedFile(null);
// //     setUploadStatus('idle');
// //   };

// //   const handleSubmit = async (values) => {
// //     if (!selectedFile) {
// //       message.error('Please upload a STEP/STP/STL file.');
// //       return;
// //     }

// //     if (!selectedMaterialId) {
// //       message.error('Please select a material.');
// //       return;
// //     }

// //     setIsLoading(true);
// //     setUploadStatus('uploading');
// //     setProcessingStage('Analyzing file...');
// //     setConversionProgress(10);

// //     try {
// //       // Step 1: Get bounding box analysis
// //       setProcessingStage('Analyzing file...');
// //       setConversionProgress(25);
      
// //       const boundingBoxFormData = new FormData();
// //       boundingBoxFormData.append('file', selectedFile);
// //       boundingBoxFormData.append('material_id', selectedMaterialId);

// //       const boundingBoxResponse = await axios.post(BOUNDING_BOX_URL, boundingBoxFormData);
// //       console.log('Bounding box result:', boundingBoxResponse.data);

// //       if (!boundingBoxResponse.data || !boundingBoxResponse.data.id) {
// //         throw new Error('Bounding box analysis failed - no data or ID returned');
// //       }

// //       const historyId = boundingBoxResponse.data.id;
// //       console.log('Got history ID from bounding box:', historyId);

// //       // Step 2: Calculate initial cost
// //       setProcessingStage('Calculating costs...');
// //       setConversionProgress(50);
      
// //       const costFormData = new FormData();
// //       costFormData.append('composites_history_id', historyId);
// //       costFormData.append('quantity', '1');

// //       const costResponse = await axios.post(CALCULATE_COST_URL, costFormData);
// //       console.log('Cost calculation result:', costResponse.data);

// //       // Step 3: Convert file for 3D rendering
// //       setProcessingStage('Converting to 3D format...');
// //       setConversionProgress(75);
      
// //       const convertFormData = new FormData();
// //       convertFormData.append('file', selectedFile);
// //       convertFormData.append('history_id', historyId);
      
// //       try {
// //         const convertResponse = await axios.post(CONVERT_URL, convertFormData);
// //         console.log('File conversion completed:', convertResponse.data);
        
// //         if (convertResponse.data.success) {
// //           console.log('All formats available:', convertResponse.data.formats_available);
// //         } else {
// //           console.warn('Conversion completed with warnings:', convertResponse.data.message);
// //         }
// //       } catch (convErr) {
// //         console.warn('Conversion warning (convert-composites):', convErr);
// //       }

// //       // Step 4: Navigate to the viewer page with analysis data
// //       setProcessingStage('Complete!');
// //       setConversionProgress(100);
      
// //       localStorage.setItem('currentCalculationId', historyId);

// //       navigate(`/composites-viewer/${historyId}`, { 
// //         state: { 
// //           originalFilename: selectedFile.name,
// //           materialName: selectedMaterialName,
// //           quantity: 1,
// //           density: density,
// //           analysisData: boundingBoxResponse.data,
// //           initialCostData: costResponse.data
// //         }
// //       });

// //       setUploadStatus('success');
// //     } catch (err) {
// //       console.error('API error:', err);
      
// //       let errorMessage = 'An error occurred during processing.';
// //       if (err.response) {
// //         errorMessage = `Server error: ${err.response.status}`;
// //         try {
// //           const errorData = err.response.data;
// //           if (typeof errorData === 'object' && errorData.detail) {
// //             errorMessage = errorData.detail;
// //           } else if (typeof errorData === 'object' && errorData.error) {
// //             errorMessage = errorData.error;
// //           }
// //         } catch (e) {
// //           // Unable to parse error data
// //         }
// //       } else if (err.request) {
// //         errorMessage = 'No response received from the server. Is it running?';
// //       } else {
// //         errorMessage = err.message || errorMessage;
// //       }
      
// //       message.error(errorMessage);
// //       setUploadStatus('error');
// //       setConversionProgress(0);
// //     } finally {
// //       setIsLoading(false);
// //       setProcessingStage('');
// //     }
// //   };

// //   const CloudUploadIcon = () => (
// //     <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={theme.buttonPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
// //       <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
// //       <polyline points="8 16 12 12 16 16"></polyline>
// //       <line x1="12" y1="12" x2="12" y2="21"></line>
// //     </svg>
// //   );

// //   const CheckIcon = () => (
// //     <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
// //       <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
// //       <polyline points="22 4 12 14.01 9 11.01" />
// //     </svg>
// //   );

// //   const PlusIcon = () => (
// //     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
// //       <line x1="12" y1="5" x2="12" y2="19"></line>
// //       <line x1="5" y1="12" x2="19" y2="12"></line>
// //     </svg>
// //   );

// //   const handleBackToModules = () => {
// //     navigate('/home/composites');
// //   };

 
// //   return (
// //   <div style={{ 
// //     minHeight: '80vh', 
// //     background: 'transparent',
// //     overflow: 'auto'
// //   }}>
// //     <div style={{ overflow: 'visible', background: 'transparent' }}>
// //       <div style={{ 
// //         padding: '10px 32px 32px',
// //         overflow: 'initial',
// //         background: 'transparent'
// //       }}>
// //         <button
// //           onClick={handleBackToModules}
// //           className="flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg transition-all duration-300"
// //           style={{color: '#246679', background: 'transparent'}}
// //         >
// //           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
// //             <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
// //           </svg>
// //           <span className="font-semibold">Back to Modules</span>
// //         </button>
        
// //         <div style={{ maxWidth: '1200px', margin: '0 auto', background: 'transparent' }}>
         
// //           {/* Upload Section */}
// //           <div style={{ marginBottom: '40px', background: 'transparent' }}>
// //             <Title level={2} style={{ 
// //               marginBottom: '4px', 
// //               color: theme.textPrimary,
// //               background: 'transparent'
// //             }}>
// //               {/* Upload your file for Composites Process  */}
// //             </Title>
// //             <Paragraph style={{ 
// //               marginBottom: '16px', 
// //               color: theme.textPrimary,
// //               fontSize: '16px',
// //               background: 'transparent'
// //             }}>
// //               {/* Upload files to get instant composite manufacturing quotation */}
// //             </Paragraph>
            
// //             <Card 
// //               style={{ 
// //                 borderRadius: '12px',
// //                 boxShadow: theme.glowShadow,
// //                 border: `2px solid ${theme.buttonPrimary}`,
// //                 background: theme.white,
// //                 overflow: 'visible',
// //                 marginTop: '10px',
// //                 marginLeft: '32px',
// //                 marginRight: '32px'
// //               }}
// //               bodyStyle={{ padding: '0' }}
// //             >
// //               <div style={{ 
// //                 padding: '10px 32px', 
// //                 background: theme.white,
// //                 borderRadius: '12px 12px 0 0', 
// //                 textAlign: 'center',
// //                 border: `1px solid ${theme.buttonPrimary}`,
// //                 boxShadow: `inset 0 0 20px rgba(36, 102, 121, 0.1)`
// //               }}>
// //                 {/* STEP/STP File Upload Area */}
// //                 <Dragger
// //                   name="file"
// //                   multiple={false}
// //                   beforeUpload={beforeUpload}
// //                   onRemove={onRemoveFile}
// //                   fileList={selectedFile ? [selectedFile] : []}
// //                   style={{ 
// //                     background: 'transparent',
// //                     border: `2px dashed ${theme.buttonPrimary}`,
// //                     borderRadius: '12px',
// //                     padding: '10px 20px',
// //                     boxShadow: `0 0 15px rgba(36, 102, 121, 0.2)`,
                    
// //                   }}
// //                 >
// //                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
// //                     {uploadStatus === 'success' ? <CheckIcon /> : <CloudUploadIcon />}
                    
// //                     <Title level={4} style={{ 
// //                       margin: '10px 0 8px', 
// //                       textAlign: 'center', 
// //                       color: theme.textPrimary,
// //                       background: 'transparent'
// //                     }}>
// //                       {uploadStatus === 'success' ? 'File uploaded successfully!' : 'Drag and drop files to upload, or'}
// //                     </Title>
                    
// //                     {uploadStatus !== 'success' && (
// //                       <Button 
// //                         type="primary" 
// //                         size="large"
// //                         style={{ 
// //                           background: theme.buttonPrimary,
// //                           borderColor: theme.buttonPrimary,
// //                           borderRadius: '8px',
// //                           height: '30px',
// //                           marginTop: '0px',
// //                           marginBottom: '16px',
// //                           fontWeight: 500,
// //                           color: theme.white,
// //                           boxShadow: `0 4px 15px rgba(36, 102, 121, 0.3)`,
// //                           transition: 'all 0.3s ease'
// //                         }}
// //                         onMouseEnter={(e) => {
// //                           e.target.style.background = '#1a5661';
// //                         }}
// //                         onMouseLeave={(e) => {
// //                           e.target.style.background = theme.buttonPrimary;
// //                         }}
// //                       >
// //                         Browse Files
// //                       </Button>
// //                     )}
                    
// //                     {uploadStatus === 'success' && (
// //                       <Text style={{ 
// //                         marginBottom: '16px', 
// //                         color: theme.textPrimary,
// //                         fontSize: '14px',
// //                         background: 'transparent'
// //                       }}>
// //                         Selected file: {selectedFile?.name}
// //                       </Text>
// //                     )}
                    
// //                     <Text style={{ 
// //                       color: theme.textPrimary, 
// //                       marginBottom: '8px',
// //                       fontSize: '14px',
// //                       background: 'transparent'
// //                     }}>
// //                       File types: STEP
// //                     </Text>
                    
// //                     <Text style={{ 
// //                       color: theme.textPrimary, 
// //                       fontSize: '12px',
// //                       background: 'transparent'
// //                     }}>
                     
// //                     </Text>
// //                   </div>
// //                 </Dragger>
// //               </div>
              
// //               {/* Form Card */}
// //               <div style={{ 
// //                 padding: '20px 32px', 
// //                 overflow: 'visible',
// //                 background: theme.white
// //               }}>
// //                 <Form
// //                   form={form}
// //                   layout="vertical"
// //                   onFinish={handleSubmit}
// //                   requiredMark={false}
// //                   style={{ maxWidth: '800px', margin: '0 auto', overflow: 'visible' }}
// //                 >
// //                   <Row gutter={[24, 8]}>
// //                     <Col xs={24} sm={24} md={16} style={{ overflow: 'visible', background: 'transparent' }}>
// //                       <Form.Item
// //                         name="material"
// //                         label={
// //                           <div style={{ display: 'flex', alignItems: 'center', background: 'transparent' }}>
// //                             <span style={{ 
// //                               fontWeight: 500, 
// //                               color: theme.textPrimary,
// //                               fontSize: '16px',
// //                               background: 'transparent'
// //                             }}>
// //                               Material
// //                             </span>
// //                             <Tooltip title="Select a material specification from the dropdown. You can search by material type, specification code, or density.">
// //                               <span style={{ 
// //                                 marginLeft: '8px',
// //                                 cursor: 'help',
// //                                 color: theme.buttonPrimary,
// //                                 fontSize: '16px',
// //                                 background: 'transparent'
// //                               }}>ⓘ</span>
// //                             </Tooltip>
// //                           </div>
// //                         }
// //                         rules={[{ required: true, message: 'Please select a material' }]}
// //                         style={{ marginBottom: '12px', background: 'transparent' }}
// //                       >
// //                         <Select 
// //                           placeholder="Search by material, specification, or density..."
// //                           style={{ width: '100%' }}
// //                           dropdownStyle={{ 
// //                             borderRadius: '8px',
// //                             maxHeight: '400px',
// //                             overflowY: 'auto',
// //                             border: `1px solid ${theme.buttonPrimary}`,
// //                             boxShadow: theme.glowShadow
// //                           }}
// //                           size="large"
// //                           onChange={handleMaterialChange}
// //                           showSearch
// //                           filterOption={filterOption}
// //                           optionLabelProp="label"
// //                           notFoundContent={
// //                             <div style={{ 
// //                               padding: '16px', 
// //                               textAlign: 'center',
// //                               color: theme.textPrimary,
// //                               background: 'transparent'
// //                             }}>
// //                               No matching materials found
// //                             </div>
// //                           }
// //                           dropdownRender={menu => (
// //                             <div>
// //                               <div style={{ 
// //                                 padding: '12px 12px 4px',
// //                                 borderBottom: `1px solid ${theme.buttonPrimary}`,
// //                                 fontWeight: 500,
// //                                 color: theme.textPrimary,
// //                                 background: theme.white
// //                               }}>
// //                                 Select Material 
// //                               </div>
// //                               {menu}
// //                             </div>
// //                           )}
// //                         >
// //                           {materials.map((material) => (
// //                             <Option 
// //                               key={material.id} 
// //                               value={material.value}
// //                               label={material.label}
// //                               title={`${material.label} - ${material.specification} (${material.density} kg/m³)`}
// //                             >
// //                               {renderMaterialOption(material)}
// //                             </Option>
// //                           ))}
// //                         </Select>
// //                       </Form.Item>
// //                     </Col>
// //                     <Col xs={24} sm={24} md={8} style={{ overflow: 'visible', background: 'transparent' }}>
// //                       <Form.Item
// //                         label={<span style={{ 
// //                           fontWeight: 500, 
// //                           color: theme.textPrimary,
// //                           fontSize: '16px',
// //                           background: 'transparent'
// //                         }}>
// //                           Add Material
// //                         </span>}
// //                         style={{ marginBottom: '12px', background: 'transparent' }}
// //                       >
// //                         <Button 
// //                           type="primary"
// //                           size="large"
// //                           icon={<PlusIcon />}
// //                           onClick={() => setIsModalVisible(true)}
// //                           style={{ 
// //                             width: '100%',
// //                             background: theme.buttonPrimary,
// //                             borderColor: theme.buttonPrimary,
// //                             color: theme.white,
// //                             fontWeight: 500,
// //                             boxShadow: `0 4px 15px rgba(36, 102, 121, 0.3)`,
// //                             transition: 'all 0.3s ease'
// //                           }}
// //                           onMouseEnter={(e) => {
// //                             e.target.style.background = '#1a5661';
// //                           }}
// //                           onMouseLeave={(e) => {
// //                             e.target.style.background = theme.buttonPrimary;
// //                           }}
// //                         >
// //                           Add New Material
// //                         </Button>
// //                       </Form.Item>
// //                     </Col>
// //                   </Row>

// //                   {/* When a material is selected, show a summary card */}
// //                   {selectedMaterialId && (
// //                     <div style={{ 
// //                       marginTop: '16px', 
// //                       marginBottom: '24px',
// //                       padding: '16px',
// //                       borderRadius: '8px',
// //                       background: theme.white,
// //                       border: `1px solid ${theme.buttonPrimary}`,
// //                       boxShadow: `0 0 15px rgba(36, 102, 121, 0.2)`
// //                     }}>
// //                       <Row gutter={[16, 8]}>
// //                         <Col span={12}>
// //                           <Text style={{ color: theme.textPrimary, background: 'transparent' }}>Selected Material:</Text>
// //                           <div style={{ 
// //                             fontWeight: 500, 
// //                             marginTop: '4px',
// //                             color: theme.textPrimary,
// //                             background: 'transparent'
// //                           }}>
// //                             {selectedMaterialName}
// //                           </div>
// //                         </Col>
// //                         <Col span={12}>
// //                           <Text style={{ color: theme.textPrimary, background: 'transparent' }}>Density:</Text>
// //                           <div style={{ 
// //                             fontWeight: 500, 
// //                             marginTop: '4px',
// //                             color: theme.textPrimary,
// //                             background: 'transparent'
// //                           }}>
// //                             {density} kg/m³
// //                           </div>
// //                         </Col>
// //                         <Col span={24} style={{ marginTop: '8px' }}>
// //                           <Text style={{ color: theme.textPrimary, background: 'transparent' }}>Material Specification:</Text>
// //                           <div style={{ 
// //                             fontWeight: 500, 
// //                             marginTop: '4px',
// //                             color: theme.textPrimary,
// //                             background: 'transparent'
// //                           }}>
// //                             {materials.find(m => m.id === selectedMaterialId)?.specification || 'N/A'}
// //                           </div>
// //                         </Col>
// //                       </Row>
// //                     </div>
// //                   )}

// //                   <Form.Item style={{ marginTop: '16px', textAlign: 'center', marginBottom: '0', background: 'transparent' }}>
// //                     <Button
// //                       type="primary"
// //                       htmlType="submit"
// //                       loading={isLoading}
// //                       disabled={isLoading || !selectedFile}
// //                       size="large"
// //                       style={{ 
// //                         height: '48px', 
// //                         padding: '0 48px',
// //                         borderRadius: '8px',
// //                         fontSize: '16px',
// //                         background: theme.buttonPrimary,
// //                         borderColor: theme.buttonPrimary,
// //                         color: theme.white,
// //                         fontWeight: 500,
// //                         boxShadow: '0 4px 12px rgba(36, 102, 121, 0.5)',
// //                         transition: 'all 0.3s ease'
// //                       }}
// //                       onMouseEnter={(e) => {
// //                         if (!isLoading && selectedFile) {
// //                           e.target.style.background = '#1a5661';
// //                         }
// //                       }}
// //                       onMouseLeave={(e) => {
// //                         if (!isLoading && selectedFile) {
// //                           e.target.style.background = theme.buttonPrimary;
// //                         }
// //                       }}
// //                     >
// //                       {isLoading ? processingStage : 'Analyze & Get Quote'}
// //                     </Button>
// //                   </Form.Item>
// //                 </Form>
// //                  {isLoading && (
// //                     <div style={{ marginTop: '16px', background: 'transparent' }}>
// //                       <Progress 
// //                         percent={conversionProgress} 
// //                         status="active"
// //                         strokeColor={{
// //                           '0%': '#246679',
// //                           '100%': '#73b6ca',
// //                         }}
// //                       />
// //                       <Text style={{ 
// //                         display: 'block', 
// //                         textAlign: 'center', 
// //                         marginTop: '8px', 
// //                         color: theme.textPrimary,
// //                         fontSize: '14px',
// //                         fontWeight: 500,
// //                         background: 'transparent'
// //                       }}>
// //                         {processingStage}
// //                       </Text>
// //                     </div>
// //                   )}
// //               </div>
// //             </Card>
// //           </div>
// //           <div style={{ height: '16px', background: 'transparent' }}></div>
// //         </div>
// //       </div>
// //     </div>

// //     {/* Add Material Modal */}
// //     <Modal
// //       title={
// //         <span style={{ 
// //           color: theme.textPrimary, 
// //           fontWeight: 600,
// //           fontSize: '18px'
// //         }}>
// //           Add New Material
// //         </span>
// //       }
// //       open={isModalVisible}
// //       onCancel={() => {
// //         setIsModalVisible(false);
// //         materialForm.resetFields();
// //       }}
// //       footer={null}
// //       width={600}
// //       style={{
// //         borderRadius: '12px',
// //       }}
// //       bodyStyle={{
// //         padding: '20px',
// //         background: theme.white,
// //         maxHeight: '70vh',
// //         overflowY: 'auto'
// //       }}
// //     >
// //       <Form
// //         form={materialForm}
// //         layout="vertical"
// //         onFinish={handleAddMaterial}
// //         style={{ marginTop: '16px' }}
// //       >
// //         <Row gutter={[16, 0]}>
// //           <Col span={24}>
// //             <Form.Item
// //               name="material"
// //               label={<span style={{ fontWeight: 500, color: theme.textPrimary }}>Material Name</span>}
// //               rules={[{ required: true, message: 'Please enter material name' }]}
// //             >
// //               <Input 
// //                 placeholder="e.g., Carbon Fiber Composite"
// //                 size="large"
// //                 style={{ borderRadius: '6px' }}
// //               />
// //             </Form.Item>
// //           </Col>

// //           <Col span={24}>
// //             <Form.Item
// //               name="material_specification"
// //               label={<span style={{ fontWeight: 500, color: theme.textPrimary }}>Material Specification</span>}
// //               rules={[{ required: true, message: 'Please enter material specification' }]}
// //             >
// //               <Input 
// //                 placeholder="e.g., AS4/3501-6"
// //                 size="large"
// //                 style={{ borderRadius: '6px' }}
// //               />
// //             </Form.Item>
// //           </Col>

// //           <Col span={12}>
// //             <Form.Item
// //               name="density"
// //               label={
// //                 <div style={{ display: 'flex', alignItems: 'center' }}>
// //                   <span style={{ fontWeight: 500, color: theme.textPrimary }}>Density (kg/m³)</span>
// //                   <Tooltip title="Material density in kilograms per cubic meter">
// //                     <span style={{ 
// //                       marginLeft: '4px',
// //                       cursor: 'help',
// //                       color: theme.buttonPrimary,
// //                       fontSize: '12px'
// //                     }}>ⓘ</span>
// //                   </Tooltip>
// //                 </div>
// //               }
// //               rules={[
// //                 { required: true, message: 'Please enter density' },
// //                 { type: 'number', min: 0.1, message: 'Density must be greater than 0' }
// //               ]}
// //             >
// //               <InputNumber 
// //                 placeholder="e.g., 1600"
// //                 size="large"
// //                 style={{ width: '100%', borderRadius: '6px' }}
// //                 min={0.1}
// //                 precision={2}
// //               />
// //             </Form.Item>
// //           </Col>

// //           <Col span={12}>
// //             <Form.Item
// //               name="material_cost"
// //               label={
// //                 <div style={{ display: 'flex', alignItems: 'center' }}>
// //                   <span style={{ fontWeight: 500, color: theme.textPrimary }}>Material Cost (₹/kg)</span>
// //                   <Tooltip title="Cost of material per kilogram in Indian Rupees">
// //                     <span style={{ 
// //                       marginLeft: '4px',
// //                       cursor: 'help',
// //                       color: theme.buttonPrimary,
// //                       fontSize: '12px'
// //                     }}>ⓘ</span>
// //                   </Tooltip>
// //                 </div>
// //               }
// //               rules={[
// //                 { required: true, message: 'Please enter material cost' },
// //                 { type: 'number', min: 0, message: 'Material cost must be 0 or greater' }
// //               ]}
// //             >
// //               <InputNumber 
// //                 placeholder="e.g., 2500.00"
// //                 size="large"
// //                 style={{ width: '100%', borderRadius: '6px' }}
// //                 min={0}
// //                 precision={2}
// //                 formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
// //                 parser={value => value.replace(/₹\s?|(,*)/g, '')}
// //               />
// //             </Form.Item>
// //           </Col>

// //           {/* Composites Parameters Section */}
// //           <Col span={24}>
// //             <div style={{ 
// //               marginTop: '16px', 
// //               padding: '12px', 
// //               background: '#f0f8ff',
// //               borderRadius: '6px',
// //               border: `1px solid ${theme.buttonPrimary}20`
// //             }}>
// //               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
// //                 <Text style={{ 
// //                   fontWeight: 600, 
// //                   color: theme.textPrimary
// //                 }}>
// //                   Composites Parameters
// //                 </Text>
// //                 <Button 
// //                   type="dashed" 
// //                   size="small"
// //                   onClick={() => {
// //                     const currentParams = materialForm.getFieldValue('parameters') || [];
// //                     materialForm.setFieldsValue({
// //                       parameters: [...currentParams, {
// //                         parameter_type: "standard",
// //                         layup_rate: 1.0,
// //                         curing_temperature: 180,
// //                         curing_time: 120
// //                       }]
// //                     });
// //                   }}
// //                 >
// //                   + Add Parameter Set
// //                 </Button>
// //               </div>
              
// //               <Form.List name="parameters" initialValue={[{
// //                 parameter_type: "standard",
// //                 layup_rate: 1.0,
// //                 curing_temperature: 180,
// //                 curing_time: 120
// //               }]}>
// //                 {(fields, { add, remove }) => (
// //                   <>
// //                     {fields.map(({ key, name, ...restField }) => (
// //                       <div key={key} style={{ 
// //                         marginBottom: '16px', 
// //                         padding: '12px', 
// //                         background: '#ffffff',
// //                         borderRadius: '6px',
// //                         border: '1px solid #e8e8e8'
// //                       }}>
// //                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
// //                           <Text strong>Parameter Set {name + 1}</Text>
// //                           {fields.length > 1 && (
// //                             <Button 
// //                               type="text" 
// //                               danger 
// //                               size="small"
// //                               onClick={() => remove(name)}
// //                             >
// //                               Remove
// //                             </Button>
// //                           )}
// //                         </div>
// //                         <Row gutter={[8, 8]}>
// //                           <Col span={12}>
// //                             <Form.Item
// //                               {...restField}
// //                               name={[name, 'parameter_type']}
// //                               label="Parameter Type"
// //                               rules={[{ required: true, message: 'Required' }]}
// //                             >
// //                               <Input placeholder="standard" size="small" />
// //                             </Form.Item>
// //                           </Col>
// //                           <Col span={12}>
// //                             <Form.Item
// //                               {...restField}
// //                               name={[name, 'layup_rate']}
// //                               label="Layup Rate (m²/hr)"
// //                               rules={[{ required: true, message: 'Required' }]}
// //                             >
// //                               <InputNumber placeholder="1.0" size="small" style={{ width: '100%' }} min={0} precision={2} />
// //                             </Form.Item>
// //                           </Col>
// //                           <Col span={12}>
// //                             <Form.Item
// //                               {...restField}
// //                               name={[name, 'curing_temperature']}
// //                               label="Curing Temperature (°C)"
// //                               rules={[{ required: true, message: 'Required' }]}
// //                             >
// //                               <InputNumber placeholder="180" size="small" style={{ width: '100%' }} min={0} precision={0} />
// //                             </Form.Item>
// //                           </Col>
// //                           <Col span={12}>
// //                             <Form.Item
// //                               {...restField}
// //                               name={[name, 'curing_time']}
// //                               label="Curing Time (min)"
// //                               rules={[{ required: true, message: 'Required' }]}
// //                             >
// //                               <InputNumber placeholder="120" size="small" style={{ width: '100%' }} min={0} precision={0} />
// //                             </Form.Item>
// //                           </Col>
// //                         </Row>
// //                       </div>
// //                     ))}
// //                   </>
// //                 )}
// //               </Form.List>
// //             </div>
// //           </Col>
// //         </Row>

// //         <div style={{ 
// //           marginTop: '16px',
// //           padding: '12px',
// //           background: '#f0f8ff',
// //           borderRadius: '6px',
// //           border: `1px solid ${theme.buttonPrimary}20`
// //         }}>
// //           <Text style={{ 
// //             fontSize: '12px', 
// //             color: theme.textPrimary,
// //             fontStyle: 'italic'
// //           }}>
// //             <strong>Note:</strong> Composites Parameters are required for proper cost calculation. 
// //             Default values are provided but can be customized based on your specific requirements.
// //           </Text>
// //         </div>

// //         <Form.Item style={{ textAlign: 'right', marginTop: '24px', marginBottom: '0' }}>
// //           <Button 
// //             onClick={() => {
// //               setIsModalVisible(false);
// //               materialForm.resetFields();
// //             }}
// //             style={{ 
// //               marginRight: '12px',
// //               borderRadius: '6px',
// //               height: '40px'
// //             }}
// //           >
// //             Cancel
// //           </Button>
// //           <Button 
// //             type="primary"
// //             htmlType="submit"
// //             loading={isAddingMaterial}
// //             style={{
// //               background: theme.buttonPrimary,
// //               borderColor: theme.buttonPrimary,
// //               color: theme.white,
// //               fontWeight: 500,
// //               borderRadius: '6px',
// //               height: '40px',
// //               minWidth: '80px'
// //             }}
// //             onMouseEnter={(e) => {
// //               if (!isAddingMaterial) {
// //                 e.target.style.background = '#1a5661';
// //               }
// //             }}
// //             onMouseLeave={(e) => {
// //               if (!isAddingMaterial) {
// //                 e.target.style.background = theme.buttonPrimary;
// //               }
// //             }}
// //           >
// //             {isAddingMaterial ? 'Adding...' : 'Add Material'}
// //           </Button>
// //         </Form.Item>
// //       </Form>
// //     </Modal>
// //   </div>
// // );
// // }

// // export default CompositesProcess;






// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import {
//   Layout, Upload, Button, Select, InputNumber, Form, Typography, message, Card, Row, Col, Spin, Tooltip, Tag, Modal, Input, Progress
// } from 'antd';

// const { Content } = Layout;
// const { Title, Text, Paragraph } = Typography;
// const { Option } = Select;
// const { Dragger } = Upload;

// const theme = {
//   textPrimary: '#000000',
//   darkGray: '#000000',
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

// function CompositesProcess() {
//   const navigate = useNavigate();
//   const [form] = Form.useForm();
//   const [materialForm] = Form.useForm();
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState('idle');
  
//   // Material state
//   const [preprogs, setPreprogs] = useState([]);
//   const [selectedPrepregId, setSelectedPrepregId] = useState(null);
//   const [selectedPrepregData, setSelectedPrepregData] = useState(null);
//   const [density, setDensity] = useState(null);
  
//   // Modal state
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isAddingMaterial, setIsAddingMaterial] = useState(false);

//   // Progress state
//   const [processingStage, setProcessingStage] = useState('');
//   const [conversionProgress, setConversionProgress] = useState(0);

//   // API endpoints
//   const API_URL = 'http://172.18.100.156:8004';
//   const PREPROGS_URL = `${API_URL}/composites/prepregs/`;
//   const ANALYZE_URL = `${API_URL}/composites/analyze-step-with-prepreg`;
//   const MASTER_TOOL_URL = `${API_URL}/composites/analysis`;

//   // Fetch preprogs on mount
//   useEffect(() => {
//     const fetchPreprogs = async () => {
//       try {
//         const response = await axios.get(PREPROGS_URL);
//         console.log('Fetched preprogs:', response.data);

//         if (response.data && Array.isArray(response.data.data)) {
//           const formattedPreprogs = response.data.data.map(item => ({
//             id: item.id,
//             value: item.id,
//             label: item.material,
//             material: item.material,
//             spec: item.spec,
//             density_kg_m3: item.density_kg_m3,
//             thickness_mm: item.thickness_mm,
//             prepreg_cost_per_kg: item.prepreg_cost_per_kg,
//             searchText: `${item.material.toLowerCase()} ${item.spec.toLowerCase()} ${item.density_kg_m3}`
//           }));
//           setPreprogs(formattedPreprogs);
//         }
//       } catch (error) {
//         console.error('Error fetching preprogs:', error);
//         message.error('Failed to load prepreg materials from server.');
//       }
//     };

//     fetchPreprogs();
//   }, []);

//   // Custom search filter
//   const filterOption = (input, option) => {
//     const prepreg = preprogs.find(m => m.value === option.value);
//     if (!prepreg) return false;
//     return prepreg.searchText.includes(input.toLowerCase());
//   };

//   // Handle prepreg selection
//   const handlePrepregChange = (value) => {
//     console.log('Selected prepreg ID:', value);
    
//     const selectedPrepreg = preprogs.find(p => p.value === value);
//     if (selectedPrepreg) {
//       setSelectedPrepregId(selectedPrepreg.id);
//       setSelectedPrepregData(selectedPrepreg);
//       setDensity(selectedPrepreg.density_kg_m3);
      
//       message.success(`Prepreg selected: ${selectedPrepreg.material}`);
//     }
//   };

//   // Render prepreg option
//   const renderPreprogOption = (prepreg) => {
//     return (
//       <div style={{ padding: '8px 4px' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <span style={{ fontWeight: 500, color: theme.textPrimary }}>{prepreg.material}</span>
//           <Tag style={{ 
//             background: theme.buttonPrimary, 
//             color: theme.white, 
//             border: 'none',
//             borderRadius: '4px'
//           }}>
//             {prepreg.density_kg_m3} kg/m³
//           </Tag>
//         </div>
//         <div style={{ 
//           fontSize: '12px', 
//           color: theme.textPrimary,
//           marginTop: '4px',
//           whiteSpace: 'normal',
//           lineHeight: '1.4'
//         }}>
//           {prepreg.spec}
//         </div>
//         <div style={{ 
//           fontSize: '11px', 
//           color: theme.darkNavySecondary,
//           marginTop: '2px'
//         }}>
//           Thickness: {prepreg.thickness_mm} mm | Cost: ₹{prepreg.prepreg_cost_per_kg}/kg
//         </div>
//       </div>
//     );
//   };

//   // Handle adding new prepreg material
//   const handleAddMaterial = async (values) => {
//     setIsAddingMaterial(true);
//     try {
//       const materialData = {
//         material: values.material,
//         spec: values.spec,
//         density_kg_m3: values.density_kg_m3,
//         thickness_mm: values.thickness_mm,
//         prepreg_cost_per_kg: values.prepreg_cost_per_kg || 0
//       };

//       const response = await axios.post(`${API_URL}/composites/prepregs/`, materialData);

//       if (response.status === 200 || response.status === 201) {
//         message.success('Prepreg material added successfully!');
        
//         // Refresh materials list
//         const preprogResponse = await axios.get(PREPROGS_URL);
//         if (preprogResponse.data && Array.isArray(preprogResponse.data.data)) {
//           const formattedPreprogs = preprogResponse.data.data.map(item => ({
//             id: item.id,
//             value: item.id,
//             label: item.material,
//             material: item.material,
//             spec: item.spec,
//             density_kg_m3: item.density_kg_m3,
//             thickness_mm: item.thickness_mm,
//             prepreg_cost_per_kg: item.prepreg_cost_per_kg,
//             searchText: `${item.material.toLowerCase()} ${item.spec.toLowerCase()} ${item.density_kg_m3}`
//           }));
//           setPreprogs(formattedPreprogs);
//         }
        
//         setIsModalVisible(false);
//         materialForm.resetFields();
//       }
//     } catch (error) {
//       console.error('Error adding prepreg material:', error);
//       message.error('Failed to add prepreg material. Please try again.');
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

//     if (!selectedPrepregId) {
//       message.error('Please select a prepreg material.');
//       return;
//     }

//     setIsLoading(true);
//     setUploadStatus('uploading');
//     setProcessingStage('Uploading file...');
//     setConversionProgress(10);

//     try {
//       // Step 1: Analyze step with prepreg
//       setProcessingStage('Analyzing composite structure...');
//       setConversionProgress(25);
      
//       const analyzeFormData = new FormData();
//       analyzeFormData.append('file', selectedFile);
//       analyzeFormData.append('material_id', selectedPrepregId);

//       const analyzeResponse = await axios.post(ANALYZE_URL, analyzeFormData);
//       console.log('Analyze response:', analyzeResponse.data);

//       if (!analyzeResponse.data || !analyzeResponse.data.id) {
//         throw new Error('Analysis failed - no analysis ID returned');
//       }

//       const analysisId = analyzeResponse.data.id;
//       console.log('Got analysis ID:', analysisId);

//       // Step 2: Fetch master tool hours sequentially
//       setProcessingStage('Calculating master tool hours...');
//       setConversionProgress(50);
      
//       let masterToolData = null;
//       try {
//         const masterToolResponse = await axios.get(
//           `${MASTER_TOOL_URL}/${analysisId}/master-tool-hours/`
//         );
//         console.log('Master tool hours:', masterToolResponse.data);
//         masterToolData = masterToolResponse.data;
//       } catch (error) {
//         console.warn('Master tool hours not available yet:', error);
//       }

//       // Step 3: Fetch analysis details
//       setProcessingStage('Fetching analysis details...');
//       setConversionProgress(70);
      
//       let analysisDetails = null;
//       try {
//         const detailsResponse = await axios.get(
//           `${MASTER_TOOL_URL}/${analysisId}/details/`
//         );
//         console.log('Analysis details:', detailsResponse.data);
//         analysisDetails = detailsResponse.data;
//       } catch (error) {
//         console.warn('Analysis details not available:', error);
//         analysisDetails = analyzeResponse.data;
//       }

//       // Step 4: Fetch raw analysis data
//       setProcessingStage('Processing raw data...');
//       setConversionProgress(85);
      
//       let rawData = null;
//       try {
//         const rawResponse = await axios.get(
//           `${MASTER_TOOL_URL}/${analysisId}/raw/`
//         );
//         console.log('Raw analysis data:', rawResponse.data);
//         rawData = rawResponse.data;
//       } catch (error) {
//         console.warn('Raw data not available:', error);
//         rawData = analyzeResponse.data;
//       }

//       setProcessingStage('Complete!');
//       setConversionProgress(100);
      
//       localStorage.setItem('currentCalculationId', analysisId);

//       // Navigate to composite viewer with all collected data
//       navigate(`/composites-viewer/${analysisId}`, { 
//         state: { 
//           analysisId: analysisId,
//           originalFilename: selectedFile.name,
//           prepregMaterial: selectedPrepregData,
//           density: density,
//           analysisData: analysisDetails || analyzeResponse.data,
//           masterToolData: masterToolData,
//           rawData: rawData,
//           initialAnalysisResponse: analyzeResponse.data
//         }
//       });

//       setUploadStatus('success');
//     } catch (err) {
//       console.error('API error:', err);
      
//       let errorMessage = 'An error occurred during analysis.';
//       if (err.response) {
//         errorMessage = `Server error: ${err.response.status}`;
//         try {
//           const errorData = err.response.data;
//           if (typeof errorData === 'object' && errorData.detail) {
//             errorMessage = errorData.detail;
//           } else if (typeof errorData === 'object' && errorData.error) {
//             errorMessage = errorData.error;
//           }
//         } catch (e) {
//           // Unable to parse error
//         }
//       } else if (err.request) {
//         errorMessage = 'No response received from server. Is it running?';
//       } else {
//         errorMessage = err.message || errorMessage;
//       }
      
//       message.error(errorMessage);
//       setUploadStatus('error');
//       setConversionProgress(0);
//     } finally {
//       setIsLoading(false);
//       setProcessingStage('');
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
//     navigate('/home/composites');
//   };

//   return (
//     <div style={{ 
//       minHeight: '80vh', 
//       background: 'transparent',
//       overflow: 'auto'
//     }}>
//       <div style={{ overflow: 'visible', background: 'transparent' }}>
//         <div style={{ 
//           padding: '10px 32px 32px',
//           overflow: 'initial',
//           background: 'transparent'
//         }}>
//           <button
//             onClick={handleBackToModules}
//             className="flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg transition-all duration-300"
//             style={{color: '#246679', background: 'transparent'}}
//           >
//             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
//             </svg>
//             <span className="font-semibold">Back to Modules</span>
//           </button>
          
//           <div style={{ maxWidth: '1200px', margin: '0 auto', background: 'transparent' }}>
//             <div style={{ marginBottom: '40px', background: 'transparent' }}>
//               <Card 
//                 style={{ 
//                   borderRadius: '12px',
//                   boxShadow: theme.glowShadow,
//                   border: `2px solid ${theme.buttonPrimary}`,
//                   background: theme.white,
//                   overflow: 'visible',
//                   marginTop: '10px',
//                   marginLeft: '32px',
//                   marginRight: '32px'
//                 }}
//                 bodyStyle={{ padding: '0' }}
//               >
//                 <div style={{ 
//                   padding: '10px 32px', 
//                   background: theme.white,
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
//                       padding: '10px 20px',
//                       boxShadow: `0 0 15px rgba(36, 102, 121, 0.2)`,
//                     }}
//                   >
//                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
//                       {uploadStatus === 'success' ? <CheckIcon /> : <CloudUploadIcon />}
                      
//                       <Title level={4} style={{ 
//                         margin: '10px 0 8px', 
//                         textAlign: 'center', 
//                         color: theme.textPrimary,
//                         background: 'transparent'
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
//                             height: '30px',
//                             marginTop: '0px',
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
//                           fontSize: '14px',
//                           background: 'transparent'
//                         }}>
//                           Selected file: {selectedFile?.name}
//                         </Text>
//                       )}
                      
//                       <Text style={{ 
//                         color: theme.textPrimary, 
//                         marginBottom: '8px',
//                         fontSize: '14px',
//                         background: 'transparent'
//                       }}>
//                         File types: STEP (.step/.stp), STL (.stl)
//                       </Text>
//                     </div>
//                   </Dragger>
//                 </div>
                
//                 <div style={{ 
//                   padding: '20px 32px', 
//                   overflow: 'visible',
//                   background: theme.white
//                 }}>
//                   <Form
//                     form={form}
//                     layout="vertical"
//                     onFinish={handleSubmit}
//                     requiredMark={false}
//                     style={{ maxWidth: '800px', margin: '0 auto', overflow: 'visible' }}
//                   >
//                     <Row gutter={[24, 8]}>
//                       <Col xs={24} sm={24} md={16} style={{ overflow: 'visible', background: 'transparent' }}>
//                         <Form.Item
//                           name="prepreg"
//                           label={
//                             <div style={{ display: 'flex', alignItems: 'center', background: 'transparent' }}>
//                               <span style={{ 
//                                 fontWeight: 500, 
//                                 color: theme.textPrimary,
//                                 fontSize: '16px',
//                                 background: 'transparent'
//                               }}>
//                                 Prepreg Material
//                               </span>
//                               <Tooltip title="Select a prepreg material from the dropdown. You can search by material type or specification.">
//                                 <span style={{ 
//                                   marginLeft: '8px',
//                                   cursor: 'help',
//                                   color: theme.buttonPrimary,
//                                   fontSize: '16px',
//                                   background: 'transparent'
//                                 }}>ⓘ</span>
//                               </Tooltip>
//                             </div>
//                           }
//                           rules={[{ required: true, message: 'Please select a prepreg material' }]}
//                           style={{ marginBottom: '12px', background: 'transparent' }}
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
//                             onChange={handlePrepregChange}
//                             showSearch
//                             filterOption={filterOption}
//                             optionLabelProp="label"
//                             notFoundContent={
//                               <div style={{ 
//                                 padding: '16px', 
//                                 textAlign: 'center',
//                                 color: theme.textPrimary,
//                                 background: 'transparent'
//                               }}>
//                                 No matching prepreg materials found
//                               </div>
//                             }
//                             dropdownRender={menu => (
//                               <div>
//                                 <div style={{ 
//                                   padding: '12px 12px 4px',
//                                   borderBottom: `1px solid ${theme.buttonPrimary}`,
//                                   fontWeight: 500,
//                                   color: theme.textPrimary,
//                                   background: theme.white
//                                 }}>
//                                   Select Prepreg Material
//                                 </div>
//                                 {menu}
//                               </div>
//                             )}
//                           >
//                             {preprogs.map((prepreg) => (
//                               <Option 
//                                 key={prepreg.id} 
//                                 value={prepreg.value}
//                                 label={prepreg.label}
//                                 title={`${prepreg.material} - ${prepreg.spec}`}
//                               >
//                                 {renderPreprogOption(prepreg)}
//                               </Option>
//                             ))}
//                           </Select>
//                         </Form.Item>
//                       </Col>
//                       <Col xs={24} sm={24} md={8} style={{ overflow: 'visible', background: 'transparent' }}>
//                         <Form.Item
//                           label={<span style={{ 
//                             fontWeight: 500, 
//                             color: theme.textPrimary,
//                             fontSize: '16px',
//                             background: 'transparent'
//                           }}>
//                             Add Material
//                           </span>}
//                           style={{ marginBottom: '12px', background: 'transparent' }}
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

//                     {selectedPrepregId && (
//                       <div style={{ 
//                         marginTop: '16px', 
//                         marginBottom: '24px',
//                         padding: '16px',
//                         borderRadius: '8px',
//                         background: theme.white,
//                         border: `1px solid ${theme.buttonPrimary}`,
//                         boxShadow: `0 0 15px rgba(36, 102, 121, 0.2)`
//                       }}>
//                         <Row gutter={[16, 8]}>
//                           <Col span={12}>
//                             <Text style={{ color: theme.textPrimary, background: 'transparent' }}>Selected Material:</Text>
//                             <div style={{ 
//                               fontWeight: 500, 
//                               marginTop: '4px',
//                               color: theme.textPrimary,
//                               background: 'transparent'
//                             }}>
//                               {selectedPrepregData?.material}
//                             </div>
//                           </Col>
//                           <Col span={12}>
//                             <Text style={{ color: theme.textPrimary, background: 'transparent' }}>Density:</Text>
//                             <div style={{ 
//                               fontWeight: 500, 
//                               marginTop: '4px',
//                               color: theme.textPrimary,
//                               background: 'transparent'
//                             }}>
//                               {density} kg/m³
//                             </div>
//                           </Col>
//                           <Col span={24} style={{ marginTop: '8px' }}>
//                             <Text style={{ color: theme.textPrimary, background: 'transparent' }}>Specification:</Text>
//                             <div style={{ 
//                               fontWeight: 500, 
//                               marginTop: '4px',
//                               color: theme.textPrimary,
//                               background: 'transparent'
//                             }}>
//                               {selectedPrepregData?.spec || 'N/A'}
//                             </div>
//                           </Col>
//                         </Row>
//                       </div>
//                     )}

//                     <Form.Item style={{ marginTop: '16px', textAlign: 'center', marginBottom: '0', background: 'transparent' }}>
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
//                         {isLoading ? processingStage : 'Analyze & Get Quote'}
//                       </Button>
//                     </Form.Item>
//                   </Form>
                  
//                   {isLoading && (
//                     <div style={{ marginTop: '16px', background: 'transparent' }}>
//                       <Progress 
//                         percent={conversionProgress} 
//                         status="active"
//                         strokeColor={{
//                           '0%': '#246679',
//                           '100%': '#73b6ca',
//                         }}
//                       />
//                       <Text style={{ 
//                         display: 'block', 
//                         textAlign: 'center', 
//                         marginTop: '8px', 
//                         color: theme.textPrimary,
//                         fontSize: '14px',
//                         fontWeight: 500,
//                         background: 'transparent'
//                       }}>
//                         {processingStage}
//                       </Text>
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Add Prepreg Material Modal */}
//       <Modal
//         title={
//           <span style={{ 
//             color: theme.textPrimary, 
//             fontWeight: 600,
//             fontSize: '18px'
//           }}>
//             Add New Prepreg Material
//           </span>
//         }
//         open={isModalVisible}
//         onCancel={() => {
//           setIsModalVisible(false);
//           materialForm.resetFields();
//         }}
//         footer={null}
//         width={600}
//         bodyStyle={{
//           padding: '20px',
//           background: theme.white,
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
//                   placeholder="e.g., CARBON BD"
//                   size="large"
//                   style={{ borderRadius: '6px' }}
//                 />
//               </Form.Item>
//             </Col>

//             <Col span={24}>
//               <Form.Item
//                 name="spec"
//                 label={<span style={{ fontWeight: 500, color: theme.textPrimary }}>Specification</span>}
//                 rules={[{ required: true, message: 'Please enter material specification' }]}
//               >
//                 <Input 
//                   placeholder="e.g., HEXPLY914/40%/803"
//                   size="large"
//                   style={{ borderRadius: '6px' }}
//                 />
//               </Form.Item>
//             </Col>

//             <Col span={12}>
//               <Form.Item
//                 name="density_kg_m3"
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
//                   placeholder="e.g., 1600"
//                   size="large"
//                   style={{ width: '100%', borderRadius: '6px' }}
//                   min={0.1}
//                   precision={2}
//                 />
//               </Form.Item>
//             </Col>

//             <Col span={12}>
//               <Form.Item
//                 name="thickness_mm"
//                 label={
//                   <div style={{ display: 'flex', alignItems: 'center' }}>
//                     <span style={{ fontWeight: 500, color: theme.textPrimary }}>Thickness (mm)</span>
//                     <Tooltip title="Thickness of the prepreg material in millimeters">
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
//                   { required: true, message: 'Please enter thickness' },
//                   { type: 'number', min: 0.1, message: 'Thickness must be greater than 0' }
//                 ]}
//               >
//                 <InputNumber 
//                   placeholder="e.g., 0.3"
//                   size="large"
//                   style={{ width: '100%', borderRadius: '6px' }}
//                   min={0.1}
//                   precision={2}
//                 />
//               </Form.Item>
//             </Col>

//             <Col span={12}>
//               <Form.Item
//                 name="prepreg_cost_per_kg"
//                 label={
//                   <div style={{ display: 'flex', alignItems: 'center' }}>
//                     <span style={{ fontWeight: 500, color: theme.textPrimary }}>Cost (₹/kg)</span>
//                     <Tooltip title="Cost of prepreg material per kilogram in Indian Rupees">
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
//                   { required: true, message: 'Please enter prepreg cost' },
//                   { type: 'number', min: 0, message: 'Cost must be 0 or greater' }
//                 ]}
//               >
//                 <InputNumber 
//                   placeholder="e.g., 30000"
//                   size="large"
//                   style={{ width: '100%', borderRadius: '6px' }}
//                   min={0}
//                   precision={2}
//                   formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
//                   parser={value => value.replace(/₹\s?|(,*)/g, '')}
//                 />
//               </Form.Item>
//             </Col>

//             <Col span={12}>
//               <Form.Item
//                 name="id"
//                 label={
//                   <span style={{ fontWeight: 500, color: theme.textPrimary }}>Material ID (Optional)</span>
//                 }
//               >
//                 <InputNumber 
//                   placeholder="Auto-generated"
//                   size="large"
//                   style={{ width: '100%', borderRadius: '6px' }}
//                   min={1}
//                   disabled
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
//               <strong>Note:</strong> All fields are required. Prepreg materials are used for composite manufacturing cost calculations.
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
//     </div>
//   );
// }

// export default CompositesProcess;







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

const theme = {
  textPrimary: '#000000',
  darkGray: '#000000',
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

function CompositesProcess() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [materialForm] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle');
  
  // Material state
  const [preprogs, setPreprogs] = useState([]);
  const [selectedPrepregId, setSelectedPrepregId] = useState(null);
  const [selectedPrepregData, setSelectedPrepregData] = useState(null);
  const [density, setDensity] = useState(null);
  
  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);

  // Progress state
  const [processingStage, setProcessingStage] = useState('');
  const [conversionProgress, setConversionProgress] = useState(0);

  // API endpoints
  const API_URL = 'http://172.18.100.156:8004';
  const PREPROGS_URL = `${API_URL}/composites/prepregs/`;
  const ANALYZE_URL = `${API_URL}/composites/analyze-step-with-prepreg`;
  const MASTER_TOOL_URL = `${API_URL}/composites/analysis`;
const BASE_URL = 'http://172.18.100.156:5000';


  // Fetch preprogs on mount
  useEffect(() => {
    const fetchPreprogs = async () => {
      try {
        const response = await axios.get(PREPROGS_URL);
        console.log('Fetched preprogs:', response.data);
        

        if (response.data && Array.isArray(response.data.data)) {
          const formattedPreprogs = response.data.data.map(item => ({
            id: item.id,
            value: item.id,
            label: item.material,
            material: item.material,
            spec: item.spec,
            density_kg_m3: item.density_kg_m3,
            thickness_mm: item.thickness_mm,
            prepreg_cost_per_kg: item.prepreg_cost_per_kg,
            searchText: `${item.material.toLowerCase()} ${item.spec.toLowerCase()} ${item.density_kg_m3}`
          }));
          setPreprogs(formattedPreprogs);
        }
      } catch (error) {
        console.error('Error fetching preprogs:', error);
        message.error('Failed to load prepreg materials from server.');
      }
    };

    fetchPreprogs();
  }, []);

  // Custom search filter
  const filterOption = (input, option) => {
    const prepreg = preprogs.find(m => m.value === option.value);
    if (!prepreg) return false;
    return prepreg.searchText.includes(input.toLowerCase());
  };

  // Handle prepreg selection
  const handlePrepregChange = (value) => {
    console.log('Selected prepreg ID:', value);
    
    const selectedPrepreg = preprogs.find(p => p.value === value);
    if (selectedPrepreg) {
      setSelectedPrepregId(selectedPrepreg.id);
      setSelectedPrepregData(selectedPrepreg);
      setDensity(selectedPrepreg.density_kg_m3);
      
      message.success(`Prepreg selected: ${selectedPrepreg.material}`);
    }
  };

  // Render prepreg option
  const renderPreprogOption = (prepreg) => {
    return (
      <div style={{ padding: '8px 4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 500, color: theme.textPrimary }}>{prepreg.material}</span>
          <Tag style={{ 
            background: theme.buttonPrimary, 
            color: theme.white, 
            border: 'none',
            borderRadius: '4px'
          }}>
            {prepreg.density_kg_m3} kg/m³
          </Tag>
        </div>
        <div style={{ 
          fontSize: '12px', 
          color: theme.textPrimary,
          marginTop: '4px',
          whiteSpace: 'normal',
          lineHeight: '1.4'
        }}>
          {prepreg.spec}
        </div>
        <div style={{ 
          fontSize: '11px', 
          color: theme.darkNavySecondary,
          marginTop: '2px'
        }}>
          Thickness: {prepreg.thickness_mm} mm | Cost: ₹{prepreg.prepreg_cost_per_kg}/kg
        </div>
      </div>
    );
  };

  // Handle adding new prepreg material
  const handleAddMaterial = async (values) => {
    setIsAddingMaterial(true);
    try {
      const materialData = {
        material: values.material,
        spec: values.spec,
        density_kg_m3: values.density_kg_m3,
        thickness_mm: values.thickness_mm,
        prepreg_cost_per_kg: values.prepreg_cost_per_kg || 0
      };

      const response = await axios.post(`${API_URL}/composites/prepregs/`, materialData);

      if (response.status === 200 || response.status === 201) {
        message.success('Prepreg material added successfully!');
        
        // Refresh materials list
        const preprogResponse = await axios.get(PREPROGS_URL);
        if (preprogResponse.data && Array.isArray(preprogResponse.data.data)) {
          const formattedPreprogs = preprogResponse.data.data.map(item => ({
            id: item.id,
            value: item.id,
            label: item.material,
            material: item.material,
            spec: item.spec,
            density_kg_m3: item.density_kg_m3,
            thickness_mm: item.thickness_mm,
            prepreg_cost_per_kg: item.prepreg_cost_per_kg,
            searchText: `${item.material.toLowerCase()} ${item.spec.toLowerCase()} ${item.density_kg_m3}`
          }));
          setPreprogs(formattedPreprogs);
        }
        
        setIsModalVisible(false);
        materialForm.resetFields();
      }
    } catch (error) {
      console.error('Error adding prepreg material:', error);
      message.error('Failed to add prepreg material. Please try again.');
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



// const handleSubmit = async (values) => {
//     if (!selectedFile) {
//       message.error('Please upload a STEP/STP/STL file.');
//       return;
//     }

//     if (!selectedPrepregId) {
//       message.error('Please select a prepreg material.');
//       return;
//     }

//     setIsLoading(true);
//     setUploadStatus('uploading');
//     setProcessingStage('Uploading file...');
//     setConversionProgress(10);

//     let analysisId = null;

//     try {
//       // Step 1: Analyze step with prepreg
//       setProcessingStage('Analyzing composite structure...');
//       setConversionProgress(25);
      
//       const analyzeFormData = new FormData();
//       analyzeFormData.append('file', selectedFile);
//       analyzeFormData.append('material_id', selectedPrepregId);

//       console.log('Sending analyze request with material_id:', selectedPrepregId);
//       const analyzeResponse = await axios.post(ANALYZE_URL, analyzeFormData);
//       console.log('Full analyze response:', analyzeResponse);
//       console.log('Analyze response data:', analyzeResponse.data);

//       // Extract the analysis ID from different possible response structures
//       let responseData = analyzeResponse.data;
      
//       // Check if response is wrapped in a data property
//       if (responseData.data) {
//         responseData = responseData.data;
//       }
      
//       // Check if response is an array
//       if (Array.isArray(responseData)) {
//         if (responseData.length === 0) {
//           throw new Error('Empty response array from analysis endpoint');
//         }
//         responseData = responseData[0];
//       }

//       // Extract analysis_id (checking multiple possible field names)
//       analysisId = responseData.analysis_id || responseData.id || responseData.analysisId;

//       if (!analysisId) {
//         console.error('Invalid response structure:', {
//           original: analyzeResponse.data,
//           processed: responseData
//         });
//         throw new Error('Analysis failed - no analysis ID found in response');
//       }

//       console.log('Successfully extracted analysis ID:', analysisId);

//       // Store the ID immediately
//       localStorage.setItem('currentCalculationId', analysisId);

//       // Step 2: Fetch master tool hours sequentially
//       setProcessingStage('Calculating master tool hours...');
//       setConversionProgress(50);
      
//       let masterToolData = null;
//       try {
//         console.log(`Fetching master tool hours for analysis ID: ${analysisId}`);
//         const masterToolResponse = await axios.get(
//           `${MASTER_TOOL_URL}/${analysisId}/master-tool-hours/`
//         );
//         console.log('Master tool hours response:', masterToolResponse.data);
//         masterToolData = masterToolResponse.data;
//       } catch (error) {
//         console.warn('Master tool hours not available:', error.response?.data || error.message);
//         // Continue without master tool data
//       }

//       // Step 3: Fetch analysis details
//       setProcessingStage('Fetching analysis details...');
//       setConversionProgress(70);
      
//       let analysisDetails = null;
//       try {
//         console.log(`Fetching analysis details for analysis ID: ${analysisId}`);
//         const detailsResponse = await axios.get(
//           `${MASTER_TOOL_URL}/${analysisId}/details/`
//         );
//         console.log('Analysis details response:', detailsResponse.data);
//         analysisDetails = detailsResponse.data;
//       } catch (error) {
//         console.warn('Analysis details not available:', error.response?.data || error.message);
//         analysisDetails = responseData;
//       }

//       // Step 4: Fetch raw analysis data
//       setProcessingStage('Processing raw data...');
//       setConversionProgress(85);
      
//       let rawData = null;
//       try {
//         console.log(`Fetching raw data for analysis ID: ${analysisId}`);
//         const rawResponse = await axios.get(
//           `${MASTER_TOOL_URL}/${analysisId}/raw/`
//         );
//         console.log('Raw analysis data response:', rawResponse.data);
//         rawData = rawResponse.data;
//       } catch (error) {
//         console.warn('Raw data not available:', error.response?.data || error.message);
//         rawData = responseData;
//       }

//       setProcessingStage('Complete!');
//       setConversionProgress(100);

//       // Prepare all state data to pass to viewer
//       const stateData = {
//         analysisId: analysisId,
//         originalFilename: selectedFile.name,
//         prepregMaterial: selectedPrepregData,
//         density: density,
//         analysisData: analysisDetails || responseData,
//         masterToolData: masterToolData,
//         rawData: rawData,
//         initialAnalysisResponse: responseData
//       };

//       console.log('Navigation state prepared:', stateData);

//       // Add a small delay to ensure state is ready
//       await new Promise(resolve => setTimeout(resolve, 500));

//       // Navigate to composite viewer page with state
//       navigate(`/composites-viewer/${analysisId}`, { 
//         state: stateData,
//         replace: false
//       });

//       message.success('Analysis completed successfully!');
//       setUploadStatus('success');
//     } catch (err) {
//       console.error('API error:', err);
//       console.error('Error response:', err.response?.data);
      
//       let errorMessage = 'An error occurred during analysis.';
//       if (err.response) {
//         errorMessage = `Server error: ${err.response.status}`;
//         try {
//           const errorData = err.response.data;
//           if (typeof errorData === 'object' && errorData.detail) {
//             errorMessage = errorData.detail;
//           } else if (typeof errorData === 'object' && errorData.error) {
//             errorMessage = errorData.error;
//           } else if (typeof errorData === 'string') {
//             errorMessage = errorData;
//           }
//         } catch (e) {
//           console.error('Error parsing error response:', e);
//         }
//       } else if (err.request) {
//         errorMessage = 'No response received from server. Please check if the server is running.';
//       } else {
//         errorMessage = err.message || errorMessage;
//       }
      
//       message.error(errorMessage);
//       setUploadStatus('error');
//       setConversionProgress(0);
//     } finally {
//       setIsLoading(false);
//       setProcessingStage('');
//     }
//   };


// CompositesProcess.jsx - Updated handleSubmit function

const handleSubmit = async (values) => {
  if (!selectedFile) {
    message.error('Please upload a STEP/STP/STL file.');
    return;
  }

  if (!selectedPrepregId) {
    message.error('Please select a prepreg material.');
    return;
  }

  setIsLoading(true);
  setUploadStatus('uploading');
  setProcessingStage('Uploading file...');
  setConversionProgress(10);

  let analysisId = null;

  try {
    // ============================================================
    // STEP 1: Analyze step with prepreg - GET ANALYSIS_ID FIRST
    // ============================================================
    setProcessingStage('Analyzing composite file...');
    setConversionProgress(25);
    
    const analyzeFormData = new FormData();
    analyzeFormData.append('file', selectedFile);
    analyzeFormData.append('material_id', selectedPrepregId);

    console.log('📤 Sending ANALYZE request with material_id:', selectedPrepregId);
    
    let analyzeResponse;
    try {
      analyzeResponse = await axios.post(ANALYZE_URL, analyzeFormData, {
        timeout: 60000 // 60 second timeout for analysis
      });
    } catch (analyzeError) {
      console.error('❌ ANALYZE endpoint failed:', analyzeError);
      throw new Error(`Analysis failed: ${analyzeError.response?.data?.error || analyzeError.message}`);
    }

    console.log('✅ ANALYZE response received:', analyzeResponse.data);

    // ============================================================
    // EXTRACT ANALYSIS_ID FROM RESPONSE
    // ============================================================
    let responseData = analyzeResponse.data;
    
    // Check if response is wrapped in a data property
    if (responseData.data) {
      responseData = responseData.data;
    }
    
    // Check if response is an array
    if (Array.isArray(responseData)) {
      if (responseData.length === 0) {
        throw new Error('Empty response array from analysis endpoint');
      }
      responseData = responseData[0];
    }

    // Extract analysis_id (checking multiple possible field names)
    analysisId = responseData.analysis_id || responseData.id || responseData.analysisId;

    if (!analysisId) {
      console.error('❌ No analysis ID in response:', {
        original: analyzeResponse.data,
        processed: responseData
      });
      throw new Error('Analysis failed - no analysis ID found in response');
    }

    console.log('✅ Analysis ID extracted:', analysisId);
    localStorage.setItem('currentCalculationId', analysisId);

    // ============================================================
    // STEP 2: Convert STEP file to GLB using analysis_id
    // ============================================================
    setProcessingStage('Converting 3D model to GLB format...');
    setConversionProgress(40);
    
    console.log('📤 Triggering STEP file conversion with analysis_id:', analysisId);
    
    const conversionFormData = new FormData();
    conversionFormData.append('file', selectedFile);
    conversionFormData.append('analysis_id', analysisId);
    
    let conversionSuccess = false;
    let conversionError = null;

    try {
      const conversionResponse = await axios.post(
        `${BASE_URL}/convert-composites`,
        conversionFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 120000 // 2 minute timeout for conversion
        }
      );
      
      console.log('✅ CONVERSION response received:', conversionResponse.data);
      
      if (conversionResponse.data.success) {
        conversionSuccess = true;
        console.log('✅ STEP file conversion SUCCESSFUL');
        message.success('3D model conversion completed successfully');
      } else {
        console.warn('⚠️ Conversion returned success=false');
        conversionError = conversionResponse.data.error || 'Conversion failed';
      }
    } catch (conversionErr) {
      conversionError = conversionErr.message;
      console.warn('⚠️ Conversion endpoint error (non-blocking):', {
        message: conversionErr.message,
        status: conversionErr.response?.status,
        data: conversionErr.response?.data
      });
      message.warning('3D model conversion is still processing. You can continue.');
      // Do NOT throw - continue with analysis data even if conversion hasn't completed yet
    }

    // ============================================================
    // STEP 3: Fetch master tool hours
    // ============================================================
    setProcessingStage('Calculating master tool hours...');
    setConversionProgress(55);
    
    let masterToolData = null;
    try {
      console.log(`📥 Fetching master tool hours for analysis_id: ${analysisId}`);
      const masterToolResponse = await axios.get(
        `${MASTER_TOOL_URL}/${analysisId}/master-tool-hours/`,
        { timeout: 30000 }
      );
      console.log('✅ Master tool hours response:', masterToolResponse.data);
      masterToolData = masterToolResponse.data;
    } catch (error) {
      console.warn('⚠️ Master tool hours not available:', error.response?.data || error.message);
      // Continue without master tool data
    }

    // ============================================================
    // STEP 4: Fetch analysis details
    // ============================================================
    setProcessingStage('Fetching analysis details...');
    setConversionProgress(70);
    
    let analysisDetails = null;
    try {
      console.log(`📥 Fetching analysis details for analysis_id: ${analysisId}`);
      const detailsResponse = await axios.get(
        `${MASTER_TOOL_URL}/${analysisId}/details/`,
        { timeout: 30000 }
      );
      console.log('✅ Analysis details response:', detailsResponse.data);
      analysisDetails = detailsResponse.data;
    } catch (error) {
      console.warn('⚠️ Analysis details not available:', error.response?.data || error.message);
      analysisDetails = responseData;
    }

    // ============================================================
    // STEP 5: Fetch raw analysis data
    // ============================================================
    setProcessingStage('Processing raw data...');
    setConversionProgress(85);
    
    let rawData = null;
    try {
      console.log(`📥 Fetching raw data for analysis_id: ${analysisId}`);
      const rawResponse = await axios.get(
        `${MASTER_TOOL_URL}/${analysisId}/raw/`,
        { timeout: 30000 }
      );
      console.log('✅ Raw analysis data response:', rawResponse.data);
      rawData = rawResponse.data;
    } catch (error) {
      console.warn('⚠️ Raw data not available:', error.response?.data || error.message);
      rawData = responseData;
    }

    // ============================================================
    // READY TO NAVIGATE
    // ============================================================
    setProcessingStage('Complete!');
    setConversionProgress(100);

    // Store data in sessionStorage to avoid History API cloning issues
    sessionStorage.setItem('compositesAnalysisData', JSON.stringify({
      analysisId: analysisId,
      originalFilename: selectedFile.name,
      prepregMaterial: selectedPrepregData ? {
        id: selectedPrepregData.id,
        material: selectedPrepregData.material,
        spec: selectedPrepregData.spec,
        density_kg_m3: selectedPrepregData.density_kg_m3,
        thickness_mm: selectedPrepregData.thickness_mm,
        prepreg_cost_per_kg: selectedPrepregData.prepreg_cost_per_kg
      } : null,
      density: density,
      analysisData: analysisDetails || responseData,
      masterToolData: masterToolData,
      rawData: rawData,
      conversionSuccess: conversionSuccess,
      conversionError: conversionError ? String(conversionError) : null,
      geometry: responseData?.geometry || analysisDetails?.geometry || null
    }));

    console.log('✅ Analysis data stored in sessionStorage');

    // Add a small delay to ensure state is ready
    await new Promise(resolve => setTimeout(resolve, 500));

    // Navigate with minimal state (only analysisId)
    navigate(`/composites-viewer/${analysisId}`, { 
      state: { analysisId: analysisId },
      replace: false
    });

    message.success('Analysis completed successfully! Opening 3D viewer...');
    setUploadStatus('success');

  } catch (err) {
    console.error('❌ Fatal error:', err);
    console.error('❌ Error response:', err.response?.data);
    
    let errorMessage = 'An error occurred during analysis.';
    
    if (err.response) {
      errorMessage = `Server error: ${err.response.status}`;
      try {
        const errorData = err.response.data;
        if (typeof errorData === 'object' && errorData.detail) {
          errorMessage = errorData.detail;
        } else if (typeof errorData === 'object' && errorData.error) {
          errorMessage = errorData.error;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } catch (e) {
        console.error('Error parsing error response:', e);
      }
    } else if (err.request) {
      errorMessage = 'No response received from server. Please check if the server is running.';
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
    navigate('/home/composites');
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
            <div style={{ marginBottom: '40px', background: 'transparent' }}>
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
                        File types: STEP (.step/.stp), STL (.stl)
                      </Text>
                    </div>
                  </Dragger>
                </div>
                
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
                          name="prepreg"
                          label={
                            <div style={{ display: 'flex', alignItems: 'center', background: 'transparent' }}>
                              <span style={{ 
                                fontWeight: 500, 
                                color: theme.textPrimary,
                                fontSize: '16px',
                                background: 'transparent'
                              }}>
                                Prepreg Material
                              </span>
                              <Tooltip title="Select a prepreg material from the dropdown. You can search by material type or specification.">
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
                          rules={[{ required: true, message: 'Please select a prepreg material' }]}
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
                            onChange={handlePrepregChange}
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
                                No matching prepreg materials found
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
                                  Select Prepreg Material
                                </div>
                                {menu}
                              </div>
                            )}
                          >
                            {preprogs.map((prepreg) => (
                              <Option 
                                key={prepreg.id} 
                                value={prepreg.value}
                                label={prepreg.label}
                                title={`${prepreg.material} - ${prepreg.spec}`}
                              >
                                {renderPreprogOption(prepreg)}
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

                    {selectedPrepregId && (
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
                              {selectedPrepregData?.material}
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
                            <Text style={{ color: theme.textPrimary, background: 'transparent' }}>Specification:</Text>
                            <div style={{ 
                              fontWeight: 500, 
                              marginTop: '4px',
                              color: theme.textPrimary,
                              background: 'transparent'
                            }}>
                              {selectedPrepregData?.spec || 'N/A'}
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
          </div>
        </div>
      </div>

      {/* Add Prepreg Material Modal */}
      <Modal
        title={
          <span style={{ 
            color: theme.textPrimary, 
            fontWeight: 600,
            fontSize: '18px'
          }}>
            Add New Prepreg Material
          </span>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          materialForm.resetFields();
        }}
        footer={null}
        width={600}
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
                  placeholder="e.g., CARBON BD"
                  size="large"
                  style={{ borderRadius: '6px' }}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="spec"
                label={<span style={{ fontWeight: 500, color: theme.textPrimary }}>Specification</span>}
                rules={[{ required: true, message: 'Please enter material specification' }]}
              >
                <Input 
                  placeholder="e.g., HEXPLY914/40%/803"
                  size="large"
                  style={{ borderRadius: '6px' }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="density_kg_m3"
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontWeight: 500, color: theme.textPrimary }}>Density (kg/m³)</span>
                  </div>
                }
                rules={[
                  { required: true, message: 'Please enter density' },
                  { type: 'number', min: 0.1, message: 'Density must be greater than 0' }
                ]}
              >
                <InputNumber 
                  placeholder="e.g., 1600"
                  size="large"
                  style={{ width: '100%', borderRadius: '6px' }}
                  min={0.1}
                  precision={2}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="thickness_mm"
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontWeight: 500, color: theme.textPrimary }}>Thickness (mm)</span>
                  </div>
                }
                rules={[
                  { required: true, message: 'Please enter thickness' },
                  { type: 'number', min: 0.1, message: 'Thickness must be greater than 0' }
                ]}
              >
                <InputNumber 
                  placeholder="e.g., 0.3"
                  size="large"
                  style={{ width: '100%', borderRadius: '6px' }}
                  min={0.1}
                  precision={2}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="prepreg_cost_per_kg"
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontWeight: 500, color: theme.textPrimary }}>Cost (₹/kg)</span>
                  </div>
                }
                rules={[
                  { required: true, message: 'Please enter prepreg cost' },
                  { type: 'number', min: 0, message: 'Cost must be 0 or greater' }
                ]}
              >
                <InputNumber 
                  placeholder="e.g., 30000"
                  size="large"
                  style={{ width: '100%', borderRadius: '6px' }}
                  min={0}
                  precision={2}
                  formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/₹\s?|(,*)/g, '')}
                />
              </Form.Item>
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
              <strong>Note:</strong> All fields are required. Prepreg materials are used for composite manufacturing cost calculations.
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

export default CompositesProcess;