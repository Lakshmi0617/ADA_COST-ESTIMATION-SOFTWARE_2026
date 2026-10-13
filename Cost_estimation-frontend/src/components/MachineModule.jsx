// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import {
//   Layout, Upload, Button, Select, InputNumber, Form, Typography, message, Card, Row, Col, Spin, Tooltip, Tag
// } from 'antd';

// const { Content } = Layout;
// const { Title, Text, Paragraph } = Typography;
// const { Option } = Select;
// const { Dragger } = Upload;

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

// function UploadPage() {
//   const navigate = useNavigate();
//   const [form] = Form.useForm();
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
//   const fileInputRef = useRef(null);

//   // Material state
//   const [materials, setMaterials] = useState([]);
//   const [selectedMaterialId, setSelectedMaterialId] = useState(null);
//   const [selectedMaterialName, setSelectedMaterialName] = useState(null);
//   const [density, setDensity] = useState(null);

//   // API endpoints
//   const API_URL = 'http://localhost:5678';
//   const CONVERT_URL = 'http://localhost:5000/convert';

//   // Customized material selection rendering
//   const renderMaterialOption = (material) => {
//     return (
//       <div style={{ padding: '8px 4px' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//           <span style={{ fontWeight: 500 }}>{material.label}</span>
//           <Tag color={theme.primary}>{material.density} kg/m³</Tag>
//         </div>
//         <div style={{ 
//           fontSize: '12px', 
//           color: theme.textSecondary,
//           marginTop: '4px',
//           whiteSpace: 'normal',
//           lineHeight: '1.4'
//         }}>
//           {material.specification}
//         </div>
//       </div>
//     );
//   };

//   // Update the fetch materials function to create more detailed material options
//   useEffect(() => {
//     const fetchMaterials = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/materials`);
//         console.log('Fetched materials:', response.data);

//         if (Array.isArray(response.data)) {
//           // Map the response for the Select component with more detailed information
//           const formattedMaterials = response.data.map(item => ({
//             id: item.id,
//             value: item.material,
//             label: item.material,
//             specification: item.material_specification,
//             density: item.density,
//             // Create a searchText that includes all searchable data
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
//     // Get the material object from the materials array
//     const material = materials.find(m => m.value === option.value);
//     if (!material) return false;

//     // Check if the input is in any of the searchable fields
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

//       // Display success message with density
//       message.success(`Material selected: ${selectedMaterial.value} (Density: ${selectedMaterial.density} kg/m³)`);
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

//       // Step 2: Send file and parameters to the calculation endpoint
//       const calculationFormData = new FormData();
//       calculationFormData.append('file', selectedFile);
//       calculationFormData.append('material_id', selectedMaterialId);
//       calculationFormData.append('quantity', values.quantity.toString());

//       const calculationResponse = await axios.post(`${API_URL}/upload/`, calculationFormData);

//       console.log('Calculation result:', calculationResponse.data);

//       // Step 3: Navigate to the viewer page with all data
//       navigate('/viewer', { 
//         state: { 
//           objUrl: objUrl,
//           originalFilename: selectedFile.name,
//           materialName: selectedMaterialName,
//           quantity: values.quantity,
//           density: density,
//           costingData: calculationResponse.data
//         }
//       });

//       setUploadStatus('success');
//     } catch (err) {
//       console.error('API error:', err);

//       let errorMessage = 'An error occurred during processing.';
//       if (err.response) {
//         errorMessage = `Server error: ${err.response.status}`;
//         try {
//           const errorData = await err.response.data;
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
//     <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
//       <polyline points="8 16 12 12 16 16"></polyline>
//       <line x1="12" y1="12" x2="12" y2="21"></line>
//     </svg>
//   );

//   const CheckIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={theme.success} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//       <polyline points="22 4 12 14.01 9 11.01" />
//     </svg>
//   );

//   return (
//     <Layout style={{ 
//       minHeight: '92vh', 
//       background: theme.background,
//       overflow: 'auto'
//     }}>
//       {/* Main Content */}
//       <Layout style={{ overflow: 'visible' }}>
//         {/* Header - dark blue background */}

//         <Content style={{ 
//           padding: '16px 32px 32px',
//           overflow: 'initial'
//         }}>
//           <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
//             {/* Upload Section */}
//             <div style={{ marginBottom: '40px' }}>
//               <Title level={2} style={{ marginBottom: '4px', color: theme.textPrimary }}>Upload your file</Title>
//               <Paragraph style={{ marginBottom: '16px', color: theme.textSecondary }}>
//                 Upload files to get instant CNC machining quotation and unleash the magic of manufacturing
//               </Paragraph>

//               <Card 
//                 style={{ 
//                   borderRadius: '12px',
//                   boxShadow: theme.shadow,
//                   border: 'none',
//                   overflow: 'visible',
//                   marginTop: '10px'
//                 }}
//                 bodyStyle={{ padding: '0' }}
//               >
//                 <div style={{ padding: '20px 32px', background: theme.lightBlue, borderRadius: '12px 12px 0 0', textAlign: 'center' }}>
//                   {/* STEP/STP File Upload Area */}
//                   <Dragger
//                     name="file"
//                     multiple={false}
//                     beforeUpload={beforeUpload}
//                     onRemove={onRemoveFile}
//                     fileList={selectedFile ? [selectedFile] : []}
//                     style={{ 
//                       background: 'transparent',
//                       border: '2px dashed rgba(0, 102, 255, 0.3)',
//                       borderRadius: '12px',
//                       padding: '30px 20px'
//                     }}
//                   >
//                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
//                       {uploadStatus === 'success' ? <CheckIcon /> : <CloudUploadIcon />}

//                       <Title level={4} style={{ margin: '16px 0 8px', textAlign: 'center', color: theme.textPrimary }}>
//                         {uploadStatus === 'success' ? 'File uploaded successfully!' : 'Drag and drop files to upload, or'}
//                       </Title>

//                       {uploadStatus !== 'success' && (
//                         <Button 
//                           type="primary" 
//                           size="large"
//                           style={{ 
//                             background: theme.primary, 
//                             borderColor: theme.primary,
//                             borderRadius: '8px',
//                             height: '48px',
//                             marginTop: '8px',
//                             marginBottom: '16px',
//                             fontWeight: 500
//                           }}
//                         >
//                           Browse Files
//                         </Button>
//                       )}

//                       {uploadStatus === 'success' && (
//                         <Text style={{ marginBottom: '16px', color: theme.textSecondary }}>
//                           Selected file: {selectedFile?.name}
//                         </Text>
//                       )}

//                       <Text style={{ color: theme.textSecondary, marginBottom: '8px' }}>
//                         File types: STEP, STP, STL | File size: &lt; 50 MB
//                       </Text>

//                       <Text style={{ color: theme.textSecondary, fontSize: '12px' }}>
//                         All your files are entirely secured with us <a href="#" style={{ color: theme.primary }}>read our privacy guarantee</a>
//                       </Text>
//                     </div>
//                   </Dragger>
//                 </div>

//                 {/* Form Card - Update the Material Select component */}
//                 <div style={{ padding: '20px 32px', overflow: 'visible' }}>
//                   <Form
//                     form={form}
//                     layout="vertical"
//                     onFinish={handleSubmit}
//                     requiredMark={false}
//                     style={{ maxWidth: '800px', margin: '0 auto', overflow: 'visible' }}
//                   >
//                     <Row gutter={[24, 8]}>
//                       <Col xs={24} sm={24} md={12} style={{ overflow: 'visible' }}>
//                         <Form.Item
//                           name="material"
//                           label={
//                             <div style={{ display: 'flex', alignItems: 'center' }}>
//                               <span style={{ fontWeight: 500, color: theme.textPrimary }}>Material</span>
//                               <Tooltip title="Select a material specification from the dropdown. You can search by material type, specification code, or density.">
//                                 <span style={{ 
//                                   marginLeft: '8px',
//                                   cursor: 'help',
//                                   color: theme.secondary,
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
//                               overflowY: 'auto'
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
//                                 color: theme.textSecondary
//                               }}>
//                                 No matching materials found
//                               </div>
//                             }
//                             dropdownRender={menu => (
//                               <div>
//                                 <div style={{ 
//                                   padding: '12px 12px 4px',
//                                   borderBottom: `1px solid ${theme.borderColor}`,
//                                   fontWeight: 500,
//                                   color: theme.textPrimary
//                                 }}>
//                                   Select Material Specification
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
//                       <Col xs={24} sm={24} md={12} style={{ overflow: 'visible' }}>
//                         <Form.Item
//                           name="quantity"
//                           label={<span style={{ fontWeight: 500, color: theme.textPrimary }}>Quantity</span>}
//                           rules={[{ required: true, type: 'number', min: 1, message: 'Quantity must be at least 1' }]}
//                           initialValue={1}
//                           style={{ marginBottom: '12px' }}
//                         >
//                           <InputNumber 
//                             min={1} 
//                             style={{ width: '100%' }} 
//                             placeholder="Enter quantity" 
//                             size="large"
//                           />
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
//                         background: theme.lightBlue,
//                         border: `1px solid ${theme.borderColor}`
//                       }}>
//                         <Row gutter={[16, 8]}>
//                           <Col span={12}>
//                             <Text type="secondary">Selected Material:</Text>
//                             <div style={{ fontWeight: 500, marginTop: '4px' }}>
//                               {selectedMaterialName}
//                             </div>
//                           </Col>
//                           <Col span={12}>
//                             <Text type="secondary">Density:</Text>
//                             <div style={{ fontWeight: 500, marginTop: '4px' }}>
//                               {density} kg/m³
//                             </div>
//                           </Col>
//                           <Col span={24} style={{ marginTop: '8px' }}>
//                             <Text type="secondary">Material Specification:</Text>
//                             <div style={{ fontWeight: 500, marginTop: '4px' }}>
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
//                           background: theme.primary,
//                           borderColor: theme.primary,
//                           fontWeight: 500
//                         }}
//                       >
//                         {isLoading ? 'Processing...' : 'Get Instant Cost'}
//                       </Button>
//                     </Form.Item>
//                   </Form>
//                 </div>
//               </Card>
//             </div>
//             {/* Extra padding div for spacing */}
//             <div style={{ height: '16px' }}></div>
//           </div>
//         </Content>
//       </Layout>
//     </Layout>
//   );
// }

// export default UploadPage;






// correct code which is working 

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

// // Updated modern theme colors to match the new design
// const theme = {
//   background: '#f8fafc',             // light grayish blue background (Tailwind: slate-50)
//   cardBg: '#ffffff',                 // white card background
//   textPrimary: '#1e293b',            // dark text (Tailwind: slate-800)
//   textSecondary: '#475569',          // muted text (Tailwind: slate-600)
//   darkGray: '#334155',              // for strong text
//   softBlack: '#64748b',             // muted gray
//   darkNavy: '#1e293b',              // for text contrast or CTA
//   darkNavySecondary: '#cbd5e1',      // borders or light secondary
//   neonBlue: '#0ea5e9',              // sky-500 (bright blue accent)
//   neonCyan: '#22d3ee',              // cyan-400
//   skyBlue: '#38bdf8',               // sky-400
//   lightBlue: '#e0f2fe',             // light background for cards (sky-100)
//   white: '#ffffff',
//   brightGreen: '#4ade80',           // green-400
//   brightBlue: '#60a5fa',            // blue-400
//   borderColor: '#cbd5e1',           // light border (slate-300)
//   shadow: '0 2px 12px rgba(0, 0, 0, 0.05)', // light soft shadow
//   glowShadow: '0 0 10px rgba(14, 165, 233, 0.2)', // subtle blue glow
//   lightBackground: '#f1f5f9'        // soft light background (slate-100)
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

//   // API endpoints
//   const API_URL = 'http://localhost:5678';
//   const CONVERT_URL = 'http://localhost:5000/convert';

//   // Customized material selection rendering
//   const renderMaterialOption = (material) => {
//     return (
//       <div style={{ padding: '8px 4px' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//           <span style={{ fontWeight: 500, color: theme.darkGray }}>{material.label}</span>
//           <Tag style={{ 
//             background: theme.neonBlue, 
//             color: theme.darkNavy, 
//             border: 'none',
//             borderRadius: '4px'
//           }}>
//             {material.density} kg/m³
//           </Tag>
//         </div>
//         <div style={{ 
//           fontSize: '12px', 
//           color: theme.softBlack,
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
//         density: values.density
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

//       // Step 2: Send file and parameters to the calculation endpoint
//       const calculationFormData = new FormData();
//       calculationFormData.append('file', selectedFile);
//       calculationFormData.append('material_id', selectedMaterialId);
//       calculationFormData.append('quantity', '1'); // Default quantity

//       const calculationResponse = await axios.post(`${API_URL}/upload/`, calculationFormData);

//       console.log('Calculation result:', calculationResponse.data);

//       // Step 3: Navigate to the viewer page with all data
//       navigate('/viewer', { 
//         state: { 
//           objUrl: objUrl,
//           originalFilename: selectedFile.name,
//           materialName: selectedMaterialName,
//           quantity: 1,
//           density: density,
//           costingData: calculationResponse.data
//         }
//       });

//       setUploadStatus('success');
//     } catch (err) {
//       console.error('API error:', err);

//       let errorMessage = 'An error occurred during processing.';
//       if (err.response) {
//         errorMessage = `Server error: ${err.response.status}`;
//         try {
//           const errorData = await err.response.data;
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
//     <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={theme.neonBlue} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
//       <polyline points="8 16 12 12 16 16"></polyline>
//       <line x1="12" y1="12" x2="12" y2="21"></line>
//     </svg>
//   );

//   const CheckIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={theme.brightGreen} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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

//   return (
//     <Layout style={{ 
//       minHeight: '92vh', 
//       background: theme.background,
//       overflow: 'auto'
//     }}>
//       <Layout style={{ overflow: 'visible' }}>
//         <Content style={{ 
//           padding: '16px 32px 32px',
//           overflow: 'initial'
//         }}>
//           <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
//             {/* Upload Section */}
//             <div style={{ marginBottom: '40px' }}>
//               <Title level={2} style={{ 
//                 marginBottom: '4px', 
//                 color: theme.darkGray,
//               }}>
//                 Upload your file
//               </Title>
//               <Paragraph style={{ 
//                 marginBottom: '16px', 
//                 color: theme.darkGray,
//                 fontSize: '16px'
//               }}>
//                 Upload files to get instant CNC machining quotation and unleash the magic of manufacturing
//               </Paragraph>

//               <Card 
//                 style={{ 
//                   borderRadius: '12px',
//                   boxShadow: theme.glowShadow,
//                   border: `2px solid ${theme.neonBlue}`,
//                   background: theme.cardBg,
//                   overflow: 'visible',
//                   marginTop: '10px'

//                 }}
//                 bodyStyle={{ padding: '0' }}
//               >

//               {/* <Card 
//   style={{ 
//     width: '100%', // Make it take full width of the parent container
//     minHeight: '720px', // Increase height as per your requirement
//     marginLeft: '0px', // Align to the left edge
//     borderRadius: '12px',
//     boxShadow: theme.glowShadow,
//     border: `2px solid ${theme.neonBlue}`,
//     background: theme.cardBg,
//     overflow: 'visible',
//     marginTop: '10px'
//   }}
//   bodyStyle={{ padding: '0' }}
// > */}

//                 <div style={{ 
//                   padding: '20px 32px', 
//                   background: `linear-gradient(135deg, ${theme.lightBackground} 0%, ${theme.darkNavySecondary} 100%)`,
//                   borderRadius: '12px 12px 0 0', 
//                   textAlign: 'center',
//                   border: `1px solid ${theme.neonBlue}`,
//                   boxShadow: `inset 0 0 20px rgba(0, 228, 255, 0.1)`
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
//                       border: `2px dashed ${theme.neonCyan}`,
//                       borderRadius: '12px',
//                       padding: '30px 20px',
//                       boxShadow: `0 0 15px rgba(0, 255, 255, 0.2)`
//                     }}
//                   >
//                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
//                       {uploadStatus === 'success' ? <CheckIcon /> : <CloudUploadIcon />}

//                       <Title level={4} style={{ 
//                         margin: '16px 0 8px', 
//                         textAlign: 'center', 
//                         color: theme.textPrimary,
//                         textShadow: `0 0 5px ${theme.skyBlue}`
//                       }}>
//                         {uploadStatus === 'success' ? 'File uploaded successfully!' : 'Drag and drop files to upload, or'}
//                       </Title>

//                       {uploadStatus !== 'success' && (
//                         <Button 
//                           type="primary" 
//                           size="large"
//                           style={{ 
//                             background: `linear-gradient(135deg, ${theme.neonBlue} 0%, ${theme.brightBlue} 100%)`,
//                             borderColor: theme.neonBlue,
//                             borderRadius: '8px',
//                             height: '58px',
//                             marginTop: '8px',
//                             marginBottom: '16px',
//                             fontWeight: 500,
//                             color: theme.darkNavy,
//                             boxShadow: `0 4px 15px rgba(0, 228, 255, 0.3)`,
//                             transition: 'all 0.3s ease'
//                           }}
//                         >
//                           Browse Files
//                         </Button>
//                       )}

//                       {uploadStatus === 'success' && (
//                         <Text style={{ 
//                           marginBottom: '16px', 
//                           color: theme.textSecondary,
//                           fontSize: '14px'
//                         }}>
//                           Selected file: {selectedFile?.name}
//                         </Text>
//                       )}

//                       <Text style={{ 
//                         color: theme.textSecondary, 
//                         marginBottom: '8px',
//                         fontSize: '14px'
//                       }}>
//                         File types: STEP, STP, STL | File size: &lt; 50 MB
//                       </Text>

//                       <Text style={{ 
//                         color: theme.textSecondary, 
//                         fontSize: '12px' 
//                       }}>
//                         All your files are entirely secured with us <a href="#" style={{ color: theme.neonCyan }}>read our privacy guarantee</a>
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
//                                 color: theme.darkGray,
//                                 fontSize: '16px'
//                               }}>
//                                 Material
//                               </span>
//                               <Tooltip title="Select a material specification from the dropdown. You can search by material type, specification code, or density.">
//                                 <span style={{ 
//                                   marginLeft: '8px',
//                                   cursor: 'help',
//                                   color: theme.brightBlue,
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
//                               border: `1px solid ${theme.neonBlue}`,
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
//                                 color: theme.softBlack
//                               }}>
//                                 No matching materials found
//                               </div>
//                             }
//                             dropdownRender={menu => (
//                               <div>
//                                 <div style={{ 
//                                   padding: '12px 12px 4px',
//                                   borderBottom: `1px solid ${theme.neonBlue}`,
//                                   fontWeight: 500,
//                                   color: theme.darkGray,
//                                   background: theme.lightBlue
//                                 }}>
//                                   Select Material Specification
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
//                             color: theme.darkGray,
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
//                               background: `linear-gradient(135deg, ${theme.neonCyan} 0%, ${theme.skyBlue} 100%)`,
//                               borderColor: theme.neonCyan,
//                               color: theme.darkNavy,
//                               fontWeight: 500,
//                               boxShadow: `0 4px 15px rgba(0, 255, 255, 0.3)`,
//                               transition: 'all 0.3s ease'
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
//                         background: `linear-gradient(135deg, ${theme.lightBackground} 0%, ${theme.darkNavySecondary} 100%)`,
//                         border: `1px solid ${theme.neonBlue}`,
//                         boxShadow: `0 0 15px rgba(0, 228, 255, 0.2)`
//                       }}>
//                         <Row gutter={[16, 8]}>
//                           <Col span={12}>
//                             <Text style={{ color: theme.textSecondary }}>Selected Material:</Text>
//                             <div style={{ 
//                               fontWeight: 500, 
//                               marginTop: '4px',
//                               color: theme.textPrimary
//                             }}>
//                               {selectedMaterialName}
//                             </div>
//                           </Col>
//                           <Col span={12}>
//                             <Text style={{ color: theme.textSecondary }}>Density:</Text>
//                             <div style={{ 
//                               fontWeight: 500, 
//                               marginTop: '4px',
//                               color: theme.textPrimary
//                             }}>
//                               {density} kg/m³
//                             </div>
//                           </Col>
//                           <Col span={24} style={{ marginTop: '8px' }}>
//                             <Text style={{ color: theme.textSecondary }}>Material Specification:</Text>
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
//                   <Button
//                   type="primary"
//                   htmlType="submit"
//                   loading={isLoading}
//                   disabled={isLoading || !selectedFile}
//              size="large"
//   style={{ 
//     height: '48px', 
//     padding: '0 48px',
//     borderRadius: '8px',
//     fontSize: '16px',
//     background: 'linear-gradient(135deg, #dbeafe 0%, #a5f3fc 100%)',  // Light blue to cyan gradient
//     borderColor: '#7dd3fc',  // Tailwind's sky-300
//     color: '#0f172a',        // Dark navy for contrast (text)
//     fontWeight: 500,
//     boxShadow: '0 4px 12px rgba(173, 216, 230, 0.5)', // soft light blue shadow
//     transition: 'all 0.3s ease'
//   }}
// >



//                         {isLoading ? 'Processing...' : 'Get Instant Cost'}
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

//       {/* Add Material Modal */}
//       <Modal
//         title={
//           <span style={{ 
//             color: theme.darkNavy, 
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
//         width={500}
//         style={{
//           borderRadius: '12px',
//         }}
//         bodyStyle={{
//           padding: '20px',
//           background: theme.cardBg
//         }}
//       >
//         <Form
//           form={materialForm}
//           layout="vertical"
//           onFinish={handleAddMaterial}
//           style={{ marginTop: '16px' }}
//         >
//           <Form.Item
//             name="material"
//             label={<span style={{ fontWeight: 500, color: theme.darkGray }}>Material Name</span>}
//             rules={[{ required: true, message: 'Please enter material name' }]}
//           >
//             <Input 
//               placeholder="e.g., Titanium Alloy"
//               size="large"
//               style={{ borderRadius: '6px' }}
//             />
//           </Form.Item>

//           <Form.Item
//             name="material_specification"
//             label={<span style={{ fontWeight: 500, color: theme.darkGray }}>Material Specification</span>}
//             rules={[{ required: true, message: 'Please enter material specification' }]}
//           >
//             <Input 
//               placeholder="e.g., ASTM B348"
//               size="large"
//               style={{ borderRadius: '6px' }}
//             />
//           </Form.Item>

//           <Form.Item
//             name="density"
//             label={<span style={{ fontWeight: 500, color: theme.darkGray }}>Density (kg/m³)</span>}
//             rules={[
//               { required: true, message: 'Please enter density' },
//               { type: 'number', min: 0.1, message: 'Density must be greater than 0' }
//             ]}
//           >
//             <InputNumber 
//               placeholder="e.g., 7800"
//               size="large"
//               style={{ width: '100%', borderRadius: '6px' }}
//               min={0.1}
//               precision={2}
//             />
//           </Form.Item>

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
//                 background: `linear-gradient(135deg, ${theme.neonBlue} 0%, ${theme.brightBlue} 100%)`,
//                 borderColor: theme.neonBlue,
//                 color: theme.darkNavy,
//                 fontWeight: 500,
//                 borderRadius: '6px',
//                 height: '40px',
//                 minWidth: '80px'
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






// components/MachineModule.jsx

import React, { useEffect } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import MillingProcess from './MillingProcess'; // Your MillingProcess component (e.g., image_8ac954.jpg content)
import TurningProcess from './TurningProcess'; // Your GrindingProcess component

const MachineModule = () => {
  useEffect(() => {
    // Hide scrollbar for entire page
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, []);
  // const MachineWelcomeContent = () => (

  //   <div className="text-center p-6">
  //     {/* <h3 className="text-2xl font-semibold text-gray-700 mb-3">
  //       Select a Manufacturing Process
  //     </h3>
  //     <p className="text-gray-600">
  //       Choose from Milling, Grinding, or other processes in the sidebar.
  //     </p> */}
  //   </div>
  // );

  return (
    <div className="machine-module-container p-4 height: 'auto',
      overflow: 'visible',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px' ">
      <Routes>
        {/*
          The "index" route for MachineModule.
          This will render when the path is exactly /machine (because of the parent route's "/machine/*").
        */}
        {/* <Route index element={<MachineWelcomeContent />} /> */}

        {/*
          Route for Milling Process:
          This path will be relative to MachineModule's parent route (/machine).
          So, navigating to /machine/milling will render MillingProcess.
        */}
        <Route path="milling" element={<MillingProcess />} />

        {/*
          Route for Grinding Process:
          This path will be relative to MachineModule's parent route (/machine).
          So, navigating to /machine/grinding will render GrindingProcess.
        */}
        <Route path="grinding" element={<TurningProcess />} />

        {/* Add other specific process routes here, e.g., */}
        {/* <Route path="drilling" element={<div>Drilling Process Content</div>} /> */}
        {/* <Route path="contour" element={<div>Contour Process Content</div>} /> */}

        {/*
          You could use an <Outlet /> if you wanted to render common MachineModule components
          around the specific process, and the specific process would be rendered inside
          the Outlet when a child route matches.
        */}
        {/* <Outlet /> */}
      </Routes>
    </div>
  );
};

export default MachineModule;