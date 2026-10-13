
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Layout, Button, Select, InputNumber, Form, Typography, message, Card, Row, Col, Modal, Input, Progress, List
// } from 'antd';
// import { DeleteOutlined, UploadOutlined, FileOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';

// const { Content } = Layout;
// const { Title, Text, Paragraph } = Typography;
// const { Option } = Select;

// const theme = {
//   textPrimary: '#000000',
//   buttonPrimary: '#246679',
//   white: '#ffffff',
//   shadow: '0 2px 12px rgba(36, 102, 121, 0.15)',
//   glowShadow: '0 0 10px rgba(36, 102, 121, 0.2)',
//   lightBackground: '#73b6ca',
// };

// // Add Material Modal Component
// const AddMaterialModal = ({ visible, onClose, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     material: '',
//     material_specification: '',
//     density: '',
//     material_cost: '',
//     parameters: [{
//       length_range: '',
//       roughing_feed_rate: '',
//       roughing_axial_depth_of_cut: '',
//       roughing_radial_width_of_cut: '',
//       finishing_feed_rate: '',
//       finishing_axial_depth_of_cut: '',
//       finishing_radial_width_of_cut: ''
//     }],
//     machine_rates: [{
//       machine_type: '',
//       size: '',
//       hourly_rate: ''
//     }]
//   });
//   const [submitting, setSubmitting] = useState(false);

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleParameterChange = (index, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       parameters: prev.parameters.map((param, i) => 
//         i === index ? { ...param, [field]: value } : param
//       )
//     }));
//   };

//   const handleMachineRateChange = (index, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       machine_rates: prev.machine_rates.map((rate, i) => 
//         i === index ? { ...rate, [field]: value } : rate
//       )
//     }));
//   };

//   const addParameterSet = () => {
//     setFormData(prev => ({
//       ...prev,
//       parameters: [...prev.parameters, {
//         length_range: '',
//         roughing_feed_rate: '',
//         roughing_axial_depth_of_cut: '',
//         roughing_radial_width_of_cut: '',
//         finishing_feed_rate: '',
//         finishing_axial_depth_of_cut: '',
//         finishing_radial_width_of_cut: ''
//       }]
//     }));
//   };

//   const addMachineRate = () => {
//     setFormData(prev => ({
//       ...prev,
//       machine_rates: [...prev.machine_rates, {
//         machine_type: '',
//         size: '',
//         hourly_rate: ''
//       }]
//     }));
//   };

//   const removeParameterSet = (index) => {
//     if (formData.parameters.length > 1) {
//       setFormData(prev => ({
//         ...prev,
//         parameters: prev.parameters.filter((_, i) => i !== index)
//       }));
//     }
//   };

//   const removeMachineRate = (index) => {
//     if (formData.machine_rates.length > 1) {
//       setFormData(prev => ({
//         ...prev,
//         machine_rates: prev.machine_rates.filter((_, i) => i !== index)
//       }));
//     }
//   };

//   const handleSubmit = async () => {
//     if (!formData.material || !formData.material_specification || !formData.density || !formData.material_cost) {
//       message.error('Please fill in all basic information fields');
//       return;
//     }

//     try {
//       setSubmitting(true);

//       const payload = {
//         material: formData.material,
//         material_specification: formData.material_specification,
//         density: parseFloat(formData.density),
//         material_cost: parseFloat(formData.material_cost),
//         parameters: formData.parameters.map(param => ({
//           length_range: param.length_range,
//           roughing_feed_rate: parseFloat(param.roughing_feed_rate) || 0,
//           roughing_axial_depth_of_cut: parseFloat(param.roughing_axial_depth_of_cut) || 0,
//           roughing_radial_width_of_cut: parseFloat(param.roughing_radial_width_of_cut) || 0,
//           finishing_feed_rate: parseFloat(param.finishing_feed_rate) || 0,
//           finishing_axial_depth_of_cut: parseFloat(param.finishing_axial_depth_of_cut) || 0,
//           finishing_radial_width_of_cut: parseFloat(param.finishing_radial_width_of_cut) || 0
//         })),
//         machine_rates: formData.machine_rates.map(rate => ({
//           machine_type: rate.machine_type,
//           size: rate.size,
//           hourly_rate: parseFloat(rate.hourly_rate) || 0
//         }))
//       };

//       const response = await fetch('http://localhost:5678/sheetmetal-materials/add', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'accept': 'application/json'
//         },
//         body: JSON.stringify(payload)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || 'Failed to add material');
//       }

//       message.success('Material added successfully!');
//       onSuccess();
//       onClose();

//       // Reset form
//       setFormData({
//         material: '',
//         material_specification: '',
//         density: '',
//         material_cost: '',
//         parameters: [{
//           length_range: '',
//           roughing_feed_rate: '',
//           roughing_axial_depth_of_cut: '',
//           roughing_radial_width_of_cut: '',
//           finishing_feed_rate: '',
//           finishing_axial_depth_of_cut: '',
//           finishing_radial_width_of_cut: ''
//         }],
//         machine_rates: [{
//           machine_type: '',
//           size: '',
//           hourly_rate: ''
//         }]
//       });
//     } catch (err) {
//       message.error('Error adding material: ' + err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <Modal
//       open={visible}
//       onCancel={onClose}
//       footer={null}
//       width={900}
//       style={{ top: 20 }}
//       bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
//     >
//       <div style={{ position: 'sticky', top: 0, background: 'white', zIndex: 1, paddingBottom: '16px', borderBottom: '1px solid #f0f0f0', marginBottom: '16px' }}>
//         <Title level={3} style={{ margin: 0 }}>Add New Material</Title>
//       </div>

//       <div style={{ marginBottom: '24px' }}>
//         {/* Basic Information */}
//         <div style={{ background: '#e6f7ff', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
//           <Title level={5}>Basic Information</Title>
//           <Row gutter={[16, 16]}>
//             <Col xs={24} md={12}>
//               <div>
//                 <Text strong><span style={{ color: 'red' }}>*</span> Material Name</Text>
//                 <Input
//                   placeholder="e.g., Aluminium"
//                   value={formData.material}
//                   onChange={(e) => handleInputChange('material', e.target.value)}
//                   style={{ marginTop: '8px' }}
//                 />
//               </div>
//             </Col>
//             <Col xs={24} md={12}>
//               <div>
//                 <Text strong><span style={{ color: 'red' }}>*</span> Material Specification</Text>
//                 <Input
//                   placeholder="e.g., bs15"
//                   value={formData.material_specification}
//                   onChange={(e) => handleInputChange('material_specification', e.target.value)}
//                   style={{ marginTop: '8px' }}
//                 />
//               </div>
//             </Col>
//             <Col xs={24} md={12}>
//               <div>
//                 <Text strong><span style={{ color: 'red' }}>*</span> Density (kg/m³)</Text>
//                 <InputNumber
//                   placeholder="e.g., 2780"
//                   value={formData.density}
//                   onChange={(value) => handleInputChange('density', value)}
//                   style={{ width: '100%', marginTop: '8px' }}
//                   step={0.01}
//                 />
//               </div>
//             </Col>
//             <Col xs={24} md={12}>
//               <div>
//                 <Text strong><span style={{ color: 'red' }}>*</span> Material Cost (₹/kg)</Text>
//                 <InputNumber
//                   placeholder="0.00"
//                   value={formData.material_cost}
//                   onChange={(value) => handleInputChange('material_cost', value)}
//                   style={{ width: '100%', marginTop: '8px' }}
//                   prefix="₹"
//                   step={0.01}
//                 />
//               </div>
//             </Col>
//           </Row>
//         </div>

//         {/* Machining Parameters */}
//         <div style={{ background: '#fffbe6', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
//             <Title level={5} style={{ margin: 0 }}>Machining Parameters</Title>
//             <Button type="link" onClick={addParameterSet} style={{ color: theme.buttonPrimary }}>
//               + Add Parameter Set
//             </Button>
//           </div>
//           {formData.parameters.map((param, index) => (
//             <div key={index} style={{ background: 'white', padding: '16px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #d9d9d9' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
//                 <Text strong>Parameter Set #{index + 1}</Text>
//                 {formData.parameters.length > 1 && (
//                   <Button
//                     type="text"
//                     danger
//                     icon={<CloseOutlined />}
//                     onClick={() => removeParameterSet(index)}
//                   />
//                 )}
//               </div>
//               <Row gutter={[12, 12]}>
//                 <Col span={24}>
//                   <Text>Length Range</Text>
//                   <Input
//                     placeholder="e.g., 0-100mm"
//                     value={param.length_range}
//                     onChange={(e) => handleParameterChange(index, 'length_range', e.target.value)}
//                     style={{ marginTop: '4px' }}
//                   />
//                 </Col>
//                 <Col xs={24} md={8}>
//                   <Text>Rough Feed Rate</Text>
//                   <InputNumber
//                     placeholder="mm/min"
//                     value={param.roughing_feed_rate}
//                     onChange={(value) => handleParameterChange(index, 'roughing_feed_rate', value)}
//                     style={{ width: '100%', marginTop: '4px' }}
//                     step={0.01}
//                   />
//                 </Col>
//                 <Col xs={24} md={8}>
//                   <Text>Rough Axial DoC</Text>
//                   <InputNumber
//                     placeholder="mm"
//                     value={param.roughing_axial_depth_of_cut}
//                     onChange={(value) => handleParameterChange(index, 'roughing_axial_depth_of_cut', value)}
//                     style={{ width: '100%', marginTop: '4px' }}
//                     step={0.01}
//                   />
//                 </Col>
//                 <Col xs={24} md={8}>
//                   <Text>Rough Radial WOC</Text>
//                   <InputNumber
//                     placeholder="mm"
//                     value={param.roughing_radial_width_of_cut}
//                     onChange={(value) => handleParameterChange(index, 'roughing_radial_width_of_cut', value)}
//                     style={{ width: '100%', marginTop: '4px' }}
//                     step={0.01}
//                   />
//                 </Col>
//                 <Col xs={24} md={8}>
//                   <Text>Finish Feed Rate</Text>
//                   <InputNumber
//                     placeholder="mm/min"
//                     value={param.finishing_feed_rate}
//                     onChange={(value) => handleParameterChange(index, 'finishing_feed_rate', value)}
//                     style={{ width: '100%', marginTop: '4px' }}
//                     step={0.01}
//                   />
//                 </Col>
//                 <Col xs={24} md={8}>
//                   <Text>Finish Axial DoC</Text>
//                   <InputNumber
//                     placeholder="mm"
//                     value={param.finishing_axial_depth_of_cut}
//                     onChange={(value) => handleParameterChange(index, 'finishing_axial_depth_of_cut', value)}
//                     style={{ width: '100%', marginTop: '4px' }}
//                     step={0.01}
//                   />
//                 </Col>
//                 <Col xs={24} md={8}>
//                   <Text>Finish Radial WOC</Text>
//                   <InputNumber
//                     placeholder="mm"
//                     value={param.finishing_radial_width_of_cut}
//                     onChange={(value) => handleParameterChange(index, 'finishing_radial_width_of_cut', value)}
//                     style={{ width: '100%', marginTop: '4px' }}
//                     step={0.01}
//                   />
//                 </Col>
//               </Row>
//             </div>
//           ))}
//         </div>

//         {/* Machine Rates */}
//         <div style={{ background: '#f6ffed', padding: '16px', borderRadius: '8px' }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
//             <Title level={5} style={{ margin: 0 }}>Machine Rates</Title>
//             <Button type="link" onClick={addMachineRate} style={{ color: theme.buttonPrimary }}>
//               + Add Machine Rate
//             </Button>
//           </div>
//           {formData.machine_rates.map((rate, index) => (
//             <div key={index} style={{ background: 'white', padding: '16px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #d9d9d9' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
//                 <Text strong>Machine Rate #{index + 1}</Text>
//                 {formData.machine_rates.length > 1 && (
//                   <Button
//                     type="text"
//                     danger
//                     icon={<CloseOutlined />}
//                     onClick={() => removeMachineRate(index)}
//                   />
//                 )}
//               </div>
//               <Row gutter={[12, 12]}>
//                 <Col xs={24} md={8}>
//                   <Text>Machine Type</Text>
//                   <Input
//                     placeholder="e.g., CNC Press"
//                     value={rate.machine_type}
//                     onChange={(e) => handleMachineRateChange(index, 'machine_type', e.target.value)}
//                     style={{ marginTop: '4px' }}
//                   />
//                 </Col>
//                 <Col xs={24} md={8}>
//                   <Text>Machine Size</Text>
//                   <Input
//                     placeholder="e.g., 2000*1000*600"
//                     value={rate.size}
//                     onChange={(e) => handleMachineRateChange(index, 'size', e.target.value)}
//                     style={{ marginTop: '4px' }}
//                   />
//                 </Col>
//                 <Col xs={24} md={8}>
//                   <Text>Hourly Rate (₹/hr)</Text>
//                   <InputNumber
//                     placeholder="0.00"
//                     value={rate.hourly_rate}
//                     onChange={(value) => handleMachineRateChange(index, 'hourly_rate', value)}
//                     style={{ width: '100%', marginTop: '4px' }}
//                     prefix="₹"
//                     step={0.01}
//                   />
//                 </Col>
//               </Row>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
//         <Button onClick={onClose}>
//           Cancel
//         </Button>
//         <Button
//           type="primary"
//           onClick={handleSubmit}
//           loading={submitting}
//           style={{ background: theme.buttonPrimary, borderColor: theme.buttonPrimary }}
//         >
//           {submitting ? 'Adding Material...' : 'Add Material'}
//         </Button>
//       </div>
//     </Modal>
//   );
// };

// function SheetMetalUploadPage() {
//   const navigate = useNavigate();
//   const [form] = Form.useForm();
//   const [isLoading, setIsLoading] = useState(false);
//   const [materials, setMaterials] = useState([]);
//   const [selectedMaterialId, setSelectedMaterialId] = useState(null);
//   const [selectedMaterialName, setSelectedMaterialName] = useState(null);
//   const [density, setDensity] = useState(null);
//   const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
//   const [processingStage, setProcessingStage] = useState('');
//   const [conversionProgress, setConversionProgress] = useState(0);
//   const [uploadedFiles, setUploadedFiles] = useState([]);

//   const ANALYZE_API_URL = 'http://localhost:5678';
//   const CONVERT_API_URL = 'http://localhost:5000';

//   useEffect(() => {
//     fetchMaterials();
//   }, []);

//   const fetchMaterials = async () => {
//     try {
//       const response = await fetch(`${ANALYZE_API_URL}/sheetmetal-materials`);
//       const data = await response.json();

//       if (data.success && Array.isArray(data.data)) {
//         const formattedMaterials = data.data.map(item => ({
//           id: item.id,
//           value: item.material,
//           label: item.material,
//           specification: item.material_specification,
//           density: item.density,
//           material_cost: item.material_cost,
//           searchText: `${item.material.toLowerCase()} ${item.material_specification.toLowerCase()} ${item.density}`
//         }));
//         setMaterials(formattedMaterials);
//       }
//     } catch (error) {
//       console.error('Error fetching materials:', error);
//       message.error('Failed to load materials');
//     }
//   };

//   const filterOption = (input, option) => {
//     const material = materials.find(m => m.value === option.value);
//     return material ? material.searchText.includes(input.toLowerCase()) : false;
//   };

//   const handleMaterialChange = (value) => {
//     const selectedMaterial = materials.find(mat => mat.value === value);
//     if (selectedMaterial) {
//       setSelectedMaterialId(selectedMaterial.id);
//       setSelectedMaterialName(selectedMaterial.value);
//       setDensity(selectedMaterial.density);
//       message.success(`Material selected: ${selectedMaterial.value}`);
//     }
//   };

//   const handleFilesChange = (e) => {
//     const files = Array.from(e.target.files);

//     if (files.length !== 3) {
//       message.error('Please select exactly 3 STEP files (Female Tool, Male Tool, Part)');
//       return;
//     }

//     const invalidFiles = files.filter(file => {
//       const isValidType = file.name.toLowerCase().endsWith('.step') || 
//                           file.name.toLowerCase().endsWith('.stp');
//       const isValidSize = file.size / 1024 / 1024 < 50;
//       return !isValidType || !isValidSize;
//     });

//     if (invalidFiles.length > 0) {
//       message.error('All files must be STEP/STP format and smaller than 50MB');
//       return;
//     }

//     setUploadedFiles(files);
//     message.success(`${files.length} files uploaded successfully`);
//   };

//   const handleRemoveFile = (index) => {
//     const newFiles = uploadedFiles.filter((_, i) => i !== index);
//     setUploadedFiles(newFiles);
//     message.info('File removed');
//   };

//   const handleClearAll = () => {
//     setUploadedFiles([]);
//     message.info('All files cleared');
//   };

//   const handleSubmit = async (values) => {
//     if (uploadedFiles.length !== 3) {
//       message.error('Please upload exactly 3 STEP files: Female, Male, and Part');
//       return;
//     }

//     if (!selectedMaterialId) {
//       message.error('Please select a material');
//       return;
//     }

//     setIsLoading(true);
//     setConversionProgress(0);

//     try {
//       setProcessingStage('Analyzing files...');
//       setConversionProgress(10);

//       const analyzeFormData = new FormData();
//       uploadedFiles.forEach(file => {
//         analyzeFormData.append('files', file);
//       });
//       analyzeFormData.append('material_id', selectedMaterialId);
//       analyzeFormData.append('quantity', values.quantity || 1);

//       console.log('Step 1: Analyzing STEP files...');
//       const analyzeResponse = await fetch(`${ANALYZE_API_URL}/analyze-step-files/`, {
//         method: 'POST',
//         body: analyzeFormData
//       });

//       if (!analyzeResponse.ok) {
//         const errorData = await analyzeResponse.json();
//         throw new Error(errorData.detail || errorData.message || 'Analysis failed');
//       }

//       const analysisData = await analyzeResponse.json();
//       console.log('Analysis successful:', analysisData);

//       if (!analysisData.history_id) {
//         throw new Error('No history ID returned from analysis');
//       }

//       const historyId = analysisData.history_id;
//       setConversionProgress(25);

//       setProcessingStage('Converting to 3D format...');
//       console.log('Step 2: Converting to GLB/Draco with history_id:', historyId);

//       const convertFormData = new FormData();
//       uploadedFiles.forEach(file => {
//         convertFormData.append('files', file);
//       });
//       convertFormData.append('history_id', historyId);

//       const convertResponse = await fetch(`${CONVERT_API_URL}/convert-sheetmetal`, {
//         method: 'POST',
//         body: convertFormData
//       });

//       if (!convertResponse.ok) {
//         const errorData = await convertResponse.json();
//         throw new Error(errorData.message || errorData.detail || 'Conversion failed');
//       }

//       const conversionData = await convertResponse.json();
//       console.log('Conversion successful:', conversionData);

//       if (!conversionData.success) {
//         throw new Error(conversionData.message || 'Conversion failed');
//       }

//       setConversionProgress(60);

//       setProcessingStage('Calculating costs...');
//       console.log('Step 3: Calculating from history...');

//       const calculateFormData = new URLSearchParams();
//       calculateFormData.append('history_id', historyId);

//       const calculateResponse = await fetch(`${ANALYZE_API_URL}/calculate-sheetmetal-from-history/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: calculateFormData
//       });

//       if (!calculateResponse.ok) {
//         const errorData = await calculateResponse.json();
//         throw new Error(errorData.detail || errorData.message || 'Calculation failed');
//       }

//       const calculationData = await calculateResponse.json();
//       console.log('Calculation successful:', calculationData);

//       if (!calculationData.calculation_id) {
//         throw new Error('No calculation ID returned');
//       }

//       setConversionProgress(100);
//       setProcessingStage('Complete!');

//       localStorage.setItem('currentSheetMetalCalculationId', calculationData.calculation_id);
//       localStorage.setItem('currentSheetMetalHistoryId', historyId);

//       message.success('Processing completed successfully!');

//       navigate(`/sheet-metal-viewer/${historyId}`, {
//         state: {
//           calculationId: calculationData.calculation_id,
//           historyId: historyId,
//           materialName: selectedMaterialName,
//           quantity: values.quantity || 1,
//           density: density,
//           analysisData: analysisData,
//           calculationData: calculationData,
//           conversionData: conversionData
//         }
//       });

//     } catch (err) {
//       console.error('Error during processing:', err);
//       message.error(err.message || 'Processing failed. Please try again.');
//       setConversionProgress(0);
//       setProcessingStage('');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const renderMaterialOption = (material) => (
//     <div style={{ padding: '8px 4px' }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//         <span style={{ fontWeight: 500 }}>{material.label}</span>
//         <span style={{ color: theme.buttonPrimary }}>
//           {material.density} kg/m³
//         </span>
//       </div>
//       <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
//         {material.specification}
//       </div>
//     </div>
//   );

//   const CloudUploadIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={theme.buttonPrimary} strokeWidth="1.5">
//       <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
//       <polyline points="8 16 12 12 16 16"></polyline>
//       <line x1="12" y1="12" x2="12" y2="21"></line>
//     </svg>
//   );

//   return (
//     <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
//       <Content style={{ padding: '32px' }}>
//         <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
//           <button
//             onClick={() => navigate('/home/sheet-metal')}
//             style={{
//               marginBottom: '24px',
//               padding: '8px 16px',
//               background: 'transparent',
//               border: 'none',
//               cursor: 'pointer',
//               color: theme.buttonPrimary,
//               fontSize: '14px',
//               fontWeight: '500'
//             }}
//           >
//             ← Back to Modules
//           </button>

//           <Title level={2} style={{ marginBottom: '8px', color: theme.textPrimary }}>
//             Sheet Metal Process Configuration
//           </Title>
//           <Paragraph style={{ marginBottom: '24px', color: '#666' }}>
//             Upload 3 STEP files (Female Tool, Male Tool, Part) for 3D analysis
//           </Paragraph>

//           <Card style={{
//             borderRadius: '12px',
//             boxShadow: theme.glowShadow,
//             border: `2px solid ${theme.buttonPrimary}`
//           }}>
//             <div style={{ textAlign: 'center', marginBottom: '32px' }}>
//               <Title level={3} style={{ color: theme.textPrimary }}>Upload STEP Files</Title>
//               <Text style={{ color: '#666' }}>Select exactly 3 STEP/STP files</Text>
//             </div>

//             <div style={{
//               padding: '40px',
//               background: 'white',
//               borderRadius: '12px',
//               border: `2px solid ${theme.buttonPrimary}`,
//               textAlign: 'center',
//               marginBottom: '32px',
//               transition: 'all 0.3s ease'
//             }}>
//               {uploadedFiles.length === 0 ? (
//                 <>
//                   <CloudUploadIcon />
//                   <Title level={4} style={{ marginTop: '16px', color: theme.textPrimary }}>
//                     Drop files here or click to browse
//                   </Title>
//                   <Text style={{ fontSize: '14px', color: '#999', display: 'block', marginTop: '8px' }}>
//                     Select 3 STEP/STP files at once (max 50MB each)
//                   </Text>
//                   <input
//                     type="file"
//                     accept=".step,.stp"
//                     multiple
//                     style={{ display: 'none' }}
//                     onChange={handleFilesChange}
//                     id="file-upload"
//                   />
//                   <Button 
//                     type="primary"
//                     size="large"
//                     icon={<UploadOutlined />}
//                     onClick={() => document.getElementById('file-upload').click()}
//                     style={{ 
//                       marginTop: '20px',
//                       background: theme.buttonPrimary,
//                       borderColor: theme.buttonPrimary
//                     }}
//                   >
//                     Select 3 Files
//                   </Button>
//                 </>
//               ) : (
//                 <>
//                   <div style={{ 
//                     display: 'flex', 
//                     alignItems: 'center', 
//                     justifyContent: 'center',
//                     marginBottom: '20px'
//                   }}>
//                     <div style={{
//                       width: '48px',
//                       height: '48px',
//                       borderRadius: '50%',
//                       background: '#52c41a',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       color: 'white',
//                       fontSize: '24px',
//                       fontWeight: 'bold'
//                     }}>
//                       ✓
//                     </div>
//                   </div>
//                   <Title level={4} style={{ color: '#52c41a', margin: '0 0 20px' }}>
//                     {uploadedFiles.length} Files Uploaded
//                   </Title>

//                   <List
//                     dataSource={uploadedFiles}
//                     renderItem={(file, index) => (
//                       <List.Item
//                         style={{
//                           padding: '12px 16px',
//                           background: 'white',
//                           borderRadius: '8px',
//                           marginBottom: '8px',
//                           border: '1px solid #d9d9d9'
//                         }}
//                         actions={[
//                           <Button 
//                             danger 
//                             size="small" 
//                             icon={<DeleteOutlined />}
//                             onClick={() => handleRemoveFile(index)}
//                           >
//                             Remove
//                           </Button>
//                         ]}
//                       >
//                         <List.Item.Meta
//                           avatar={<FileOutlined style={{ fontSize: '24px', color: theme.buttonPrimary }} />}
//                           title={file.name}
//                           description={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
//                         />
//                       </List.Item>
//                     )}
//                   />

//                   <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
//                     <Button 
//                       onClick={handleClearAll}
//                       icon={<DeleteOutlined />}
//                     >
//                       Clear All
//                     </Button>
//                     <input
//                       type="file"
//                       accept=".step,.stp"
//                       multiple
//                       style={{ display: 'none' }}
//                       onChange={handleFilesChange}
//                       id="file-reupload"
//                     />
//                     <Button 
//                       type="primary"
//                       icon={<UploadOutlined />}
//                       onClick={() => document.getElementById('file-reupload').click()}
//                       style={{
//                         background: theme.buttonPrimary,
//                         borderColor: theme.buttonPrimary
//                       }}
//                     >
//                       Choose Different Files
//                     </Button>
//                   </div>
//                 </>
//               )}
//             </div>

//             <Form
//               form={form}
//               layout="vertical"
//               onFinish={handleSubmit}
//             >
//               <Row gutter={[24, 8]}>
//                 <Col xs={24} md={20}>
//                   <Form.Item
//                     name="material"
//                     label={<span style={{ fontWeight: 500 }}>Material</span>}
//                     rules={[{ required: true, message: 'Please select a material' }]}
//                   >
//                     <Select 
//                       placeholder="Search by material, specification, or density..."
//                       size="large"
//                       onChange={handleMaterialChange}
//                       showSearch
//                       filterOption={filterOption}
//                     >
//                       {materials.map((material) => (
//                         <Option key={material.id} value={material.value}>
//                           {renderMaterialOption(material)}
//                         </Option>
//                       ))}
//                     </Select>
//                   </Form.Item>
//                 </Col>

//                 <Col xs={24} md={4}>
//                   <Form.Item label={<span style={{ fontWeight: 500 }}>Add Material</span>}>
//                     <Button
//                       type="primary"
//                       size="large"
//                       icon={<PlusOutlined />}
//                       onClick={() => setShowAddMaterialModal(true)}
//                       style={{
//                         width: '100%',
//                         background: theme.buttonPrimary,
//                         borderColor: theme.buttonPrimary
//                       }}
//                     >
//                       Add New Material
//                     </Button>
//                   </Form.Item>
//                 </Col>
//               </Row>

//               {selectedMaterialId && (
//                 <Card style={{ marginTop: '16px', marginBottom: '24px', background: '#f9f9f9' }}>
//                   <Row gutter={[16, 8]}>
//                     <Col span={12}>
//                       <Text style={{ color: '#666' }}>Selected Material:</Text>
//                       <div style={{ fontWeight: 500, marginTop: '4px' }}>
//                         {selectedMaterialName}
//                       </div>
//                     </Col>
//                     <Col span={12}>
//                       <Text style={{ color: '#666' }}>Density:</Text>
//                       <div style={{ fontWeight: 500, marginTop: '4px' }}>
//                         {density} kg/m³
//                       </div>
//                     </Col>
//                   </Row>
//                 </Card>
//               )}

//               <Form.Item style={{ textAlign: 'center', marginBottom: '0' }}>
//                 <Button
//                   type="primary"
//                   htmlType="submit"
//                   loading={isLoading}
//                   disabled={isLoading || uploadedFiles.length !== 3}
//                   size="large"
//                   style={{ 
//                     height: '48px', 
//                     padding: '0 48px',
//                     background: theme.buttonPrimary,
//                     borderColor: theme.buttonPrimary,
//                     color:theme.white
//                   }}
//                 >
//                   {isLoading ? processingStage : 'Analyze & Get Quote'}
//                 </Button>
//               </Form.Item>

//               {isLoading && (
//                 <div style={{ marginTop: '16px' }}>
//                   <Progress 
//                     percent={conversionProgress} 
//                     status="active"
//                   />
//                   <Text style={{ display: 'block', textAlign: 'center', marginTop: '8px', color: '#666' }}>
//                     {processingStage}
//                   </Text>
//                 </div>
//               )}
//             </Form>
//           </Card>
//         </div>
//       </Content>

//       {/* Add Material Modal */}
//       <AddMaterialModal
//         visible={showAddMaterialModal}
//         onClose={() => setShowAddMaterialModal(false)}
//         onSuccess={fetchMaterials}
//       />
//     </Layout>
//   );
// }

// export default SheetMetalUploadPage;


//'''new code on yesterday modified '''''//
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Layout, Button, Select, InputNumber, Form, Typography, message, Card, Row, Col, Modal, Input, Progress
// } from 'antd';
// import { DeleteOutlined, UploadOutlined, FileOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';

// const { Content } = Layout;
// const { Title, Text, Paragraph } = Typography;
// const { Option } = Select;

// const theme = {
//   textPrimary: '#000000',
//   buttonPrimary: '#246679',
//   white: '#ffffff',
//   shadow: '0 2px 12px rgba(36, 102, 121, 0.15)',
//   glowShadow: '0 0 10px rgba(36, 102, 121, 0.2)',
//   lightBackground: '#73b6ca',
// };

// const AddMaterialModal = ({ visible, onClose, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     material: '',
//     material_specification: '',
//     density: '',
//     material_cost: '',
//     parameters: [{
//       length_range: '',
//       roughing_feed_rate: '',
//       roughing_axial_depth_of_cut: '',
//       roughing_radial_width_of_cut: '',
//       finishing_feed_rate: '',
//       finishing_axial_depth_of_cut: '',
//       finishing_radial_width_of_cut: ''
//     }],
//     machine_rates: [{
//       machine_type: '',
//       size: '',
//       hourly_rate: ''
//     }]
//   });
//   const [submitting, setSubmitting] = useState(false);

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleParameterChange = (index, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       parameters: prev.parameters.map((param, i) => 
//         i === index ? { ...param, [field]: value } : param
//       )
//     }));
//   };

//   const handleMachineRateChange = (index, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       machine_rates: prev.machine_rates.map((rate, i) => 
//         i === index ? { ...rate, [field]: value } : rate
//       )
//     }));
//   };

//   const addParameterSet = () => {
//     setFormData(prev => ({
//       ...prev,
//       parameters: [...prev.parameters, {
//         length_range: '',
//         roughing_feed_rate: '',
//         roughing_axial_depth_of_cut: '',
//         roughing_radial_width_of_cut: '',
//         finishing_feed_rate: '',
//         finishing_axial_depth_of_cut: '',
//         finishing_radial_width_of_cut: ''
//       }]
//     }));
//   };

//   const addMachineRate = () => {
//     setFormData(prev => ({
//       ...prev,
//       machine_rates: [...prev.machine_rates, {
//         machine_type: '',
//         size: '',
//         hourly_rate: ''
//       }]
//     }));
//   };

//   const removeParameterSet = (index) => {
//     if (formData.parameters.length > 1) {
//       setFormData(prev => ({
//         ...prev,
//         parameters: prev.parameters.filter((_, i) => i !== index)
//       }));
//     }
//   };

//   const removeMachineRate = (index) => {
//     if (formData.machine_rates.length > 1) {
//       setFormData(prev => ({
//         ...prev,
//         machine_rates: prev.machine_rates.filter((_, i) => i !== index)
//       }));
//     }
//   };

//   const handleSubmit = async () => {
//     if (!formData.material || !formData.material_specification || !formData.density || !formData.material_cost) {
//       message.error('Please fill in all basic information fields');
//       return;
//     }

//     try {
//       setSubmitting(true);

//       const payload = {
//         material: formData.material,
//         material_specification: formData.material_specification,
//         density: parseFloat(formData.density),
//         material_cost: parseFloat(formData.material_cost),
//         parameters: formData.parameters.map(param => ({
//           length_range: param.length_range,
//           roughing_feed_rate: parseFloat(param.roughing_feed_rate) || 0,
//           roughing_axial_depth_of_cut: parseFloat(param.roughing_axial_depth_of_cut) || 0,
//           roughing_radial_width_of_cut: parseFloat(param.roughing_radial_width_of_cut) || 0,
//           finishing_feed_rate: parseFloat(param.finishing_feed_rate) || 0,
//           finishing_axial_depth_of_cut: parseFloat(param.finishing_axial_depth_of_cut) || 0,
//           finishing_radial_width_of_cut: parseFloat(param.finishing_radial_width_of_cut) || 0
//         })),
//         machine_rates: formData.machine_rates.map(rate => ({
//           machine_type: rate.machine_type,
//           size: rate.size,
//           hourly_rate: parseFloat(rate.hourly_rate) || 0
//         }))
//       };

//       const response = await fetch('http://localhost:5678/sheetmetal-materials/add', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'accept': 'application/json'
//         },
//         body: JSON.stringify(payload)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || 'Failed to add material');
//       }

//       message.success('Material added successfully!');
//       onSuccess();
//       onClose();

//       setFormData({
//         material: '',
//         material_specification: '',
//         density: '',
//         material_cost: '',
//         parameters: [{
//           length_range: '',
//           roughing_feed_rate: '',
//           roughing_axial_depth_of_cut: '',
//           roughing_radial_width_of_cut: '',
//           finishing_feed_rate: '',
//           finishing_axial_depth_of_cut: '',
//           finishing_radial_width_of_cut: ''
//         }],
//         machine_rates: [{
//           machine_type: '',
//           size: '',
//           hourly_rate: ''
//         }]
//       });
//     } catch (err) {
//       message.error('Error adding material: ' + err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <Modal
//       open={visible}
//       onCancel={onClose}
//       footer={null}
//       width={900}
//       style={{ top: 20 }}
//       bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
//     >
//       <div style={{ position: 'sticky', top: 0, background: 'white', zIndex: 1, paddingBottom: '16px', borderBottom: '1px solid #f0f0f0', marginBottom: '16px' }}>
//         <Title level={3} style={{ margin: 0 }}>Add New Material</Title>
//       </div>

//       <div style={{ marginBottom: '24px' }}>
//         <div style={{ background: '#e6f7ff', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
//           <Title level={5}>Basic Information</Title>
//           <Row gutter={[16, 16]}>
//             <Col xs={24} md={12}>
//               <div>
//                 <Text strong><span style={{ color: 'red' }}>*</span> Material Name</Text>
//                 <Input
//                   placeholder="e.g., Aluminium"
//                   value={formData.material}
//                   onChange={(e) => handleInputChange('material', e.target.value)}
//                   style={{ marginTop: '8px' }}
//                 />
//               </div>
//             </Col>
//             <Col xs={24} md={12}>
//               <div>
//                 <Text strong><span style={{ color: 'red' }}>*</span> Material Specification</Text>
//                 <Input
//                   placeholder="e.g., bs15"
//                   value={formData.material_specification}
//                   onChange={(e) => handleInputChange('material_specification', e.target.value)}
//                   style={{ marginTop: '8px' }}
//                 />
//               </div>
//             </Col>
//             <Col xs={24} md={12}>
//               <div>
//                 <Text strong><span style={{ color: 'red' }}>*</span> Density (kg/m³)</Text>
//                 <InputNumber
//                   placeholder="e.g., 2780"
//                   value={formData.density}
//                   onChange={(value) => handleInputChange('density', value)}
//                   style={{ width: '100%', marginTop: '8px' }}
//                   step={0.01}
//                 />
//               </div>
//             </Col>
//             <Col xs={24} md={12}>
//               <div>
//                 <Text strong><span style={{ color: 'red' }}>*</span> Material Cost (₹/kg)</Text>
//                 <InputNumber
//                   placeholder="0.00"
//                   value={formData.material_cost}
//                   onChange={(value) => handleInputChange('material_cost', value)}
//                   style={{ width: '100%', marginTop: '8px' }}
//                   step={0.01}
//                 />
//               </div>
//             </Col>
//           </Row>
//         </div>

//         <div style={{ background: '#fffbe6', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
//             <Title level={5} style={{ margin: 0 }}>Machining Parameters</Title>
//             <Button type="link" onClick={addParameterSet} style={{ color: theme.buttonPrimary }}>
//               + Add Parameter Set
//             </Button>
//           </div>
//           {formData.parameters.map((param, index) => (
//             <div key={index} style={{ background: 'white', padding: '16px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #d9d9d9' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
//                 <Text strong>Parameter Set #{index + 1}</Text>
//                 {formData.parameters.length > 1 && (
//                   <Button
//                     type="text"
//                     danger
//                     icon={<CloseOutlined />}
//                     onClick={() => removeParameterSet(index)}
//                   />
//                 )}
//               </div>
//               <Row gutter={[12, 12]}>
//                 <Col span={24}>
//                   <Text>Length Range</Text>
//                   <Input
//                     placeholder="e.g., 0-100mm"
//                     value={param.length_range}
//                     onChange={(e) => handleParameterChange(index, 'length_range', e.target.value)}
//                     style={{ marginTop: '4px' }}
//                   />
//                 </Col>
//                 <Col xs={24} md={8}>
//                   <Text>Rough Feed Rate</Text>
//                   <InputNumber
//                     placeholder="mm/min"
//                     value={param.roughing_feed_rate}
//                     onChange={(value) => handleParameterChange(index, 'roughing_feed_rate', value)}
//                     style={{ width: '100%', marginTop: '4px' }}
//                     step={0.01}
//                   />
//                 </Col>
//                 <Col xs={24} md={8}>
//                   <Text>Rough Axial DoC</Text>
//                   <InputNumber
//                     placeholder="mm"
//                     value={param.roughing_axial_depth_of_cut}
//                     onChange={(value) => handleParameterChange(index, 'roughing_axial_depth_of_cut', value)}
//                     style={{ width: '100%', marginTop: '4px' }}
//                     step={0.01}
//                   />
//                 </Col>
//                 <Col xs={24} md={8}>
//                   <Text>Rough Radial WOC</Text>
//                   <InputNumber
//                     placeholder="mm"
//                     value={param.roughing_radial_width_of_cut}
//                     onChange={(value) => handleParameterChange(index, 'roughing_radial_width_of_cut', value)}
//                     style={{ width: '100%', marginTop: '4px' }}
//                     step={0.01}
//                   />
//                 </Col>
//                 <Col xs={24} md={8}>
//                   <Text>Finish Feed Rate</Text>
//                   <InputNumber
//                     placeholder="mm/min"
//                     value={param.finishing_feed_rate}
//                     onChange={(value) => handleParameterChange(index, 'finishing_feed_rate', value)}
//                     style={{ width: '100%', marginTop: '4px' }}
//                     step={0.01}
//                   />
//                 </Col>
//                 <Col xs={24} md={8}>
//                   <Text>Finish Axial DoC</Text>
//                   <InputNumber
//                     placeholder="mm"
//                     value={param.finishing_axial_depth_of_cut}
//                     onChange={(value) => handleParameterChange(index, 'finishing_axial_depth_of_cut', value)}
//                     style={{ width: '100%', marginTop: '4px' }}
//                     step={0.01}
//                   />
//                 </Col>
//                 <Col xs={24} md={8}>
//                   <Text>Finish Radial WOC</Text>
//                   <InputNumber
//                     placeholder="mm"
//                     value={param.finishing_radial_width_of_cut}
//                     onChange={(value) => handleParameterChange(index, 'finishing_radial_width_of_cut', value)}
//                     style={{ width: '100%', marginTop: '4px' }}
//                     step={0.01}
//                   />
//                 </Col>
//               </Row>
//             </div>
//           ))}
//         </div>

//         <div style={{ background: '#f6ffed', padding: '16px', borderRadius: '8px' }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
//             <Title level={5} style={{ margin: 0 }}>Machine Rates</Title>
//             <Button type="link" onClick={addMachineRate} style={{ color: theme.buttonPrimary }}>
//               + Add Machine Rate
//             </Button>
//           </div>
//           {formData.machine_rates.map((rate, index) => (
//             <div key={index} style={{ background: 'white', padding: '16px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #d9d9d9' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
//                 <Text strong>Machine Rate #{index + 1}</Text>
//                 {formData.machine_rates.length > 1 && (
//                   <Button
//                     type="text"
//                     danger
//                     icon={<CloseOutlined />}
//                     onClick={() => removeMachineRate(index)}
//                   />
//                 )}
//               </div>
//               <Row gutter={[12, 12]}>
//                 <Col xs={24} md={8}>
//                   <Text>Machine Type</Text>
//                   <Input
//                     placeholder="e.g., CNC Press"
//                     value={rate.machine_type}
//                     onChange={(e) => handleMachineRateChange(index, 'machine_type', e.target.value)}
//                     style={{ marginTop: '4px' }}
//                   />
//                 </Col>
//                 <Col xs={24} md={8}>
//                   <Text>Machine Size</Text>
//                   <Input
//                     placeholder="e.g., 2000*1000*600"
//                     value={rate.size}
//                     onChange={(e) => handleMachineRateChange(index, 'size', e.target.value)}
//                     style={{ marginTop: '4px' }}
//                   />
//                 </Col>
//                 <Col xs={24} md={8}>
//                   <Text>Hourly Rate (₹/hr)</Text>
//                   <InputNumber
//                     placeholder="0.00"
//                     value={rate.hourly_rate}
//                     onChange={(value) => handleMachineRateChange(index, 'hourly_rate', value)}
//                     style={{ width: '100%', marginTop: '4px' }}
//                     step={0.01}
//                   />
//                 </Col>
//               </Row>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
//         <Button onClick={onClose}>
//           Cancel
//         </Button>
//         <Button
//           type="primary"
//           onClick={handleSubmit}
//           loading={submitting}
//           style={{ background: theme.buttonPrimary, borderColor: theme.buttonPrimary }}
//         >
//           {submitting ? 'Adding Material...' : 'Add Material'}
//         </Button>
//       </div>
//     </Modal>
//   );
// };

// function SheetMetalUploadPage() {
//   const navigate = useNavigate();
//   const [form] = Form.useForm();
//   const [isLoading, setIsLoading] = useState(false);
//   const [materials, setMaterials] = useState([]);
//   const [selectedMaterialId, setSelectedMaterialId] = useState(null);
//   const [selectedMaterialName, setSelectedMaterialName] = useState(null);
//   const [density, setDensity] = useState(null);
//   const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
//   const [processingStage, setProcessingStage] = useState('');
//   const [conversionProgress, setConversionProgress] = useState(0);
//   const [uploadedFiles, setUploadedFiles] = useState([]);

//   const ANALYZE_API_URL = 'http://localhost:5678';
//   const CONVERT_API_URL = 'http://localhost:5000';

//   useEffect(() => {
//     fetchMaterials();
//   }, []);

//   const fetchMaterials = async () => {
//     try {
//       const response = await fetch(`${ANALYZE_API_URL}/sheetmetal-materials`);
//       const data = await response.json();

//       if (data.success && Array.isArray(data.data)) {
//         const formattedMaterials = data.data.map(item => ({
//           id: item.id,
//           value: item.material,
//           label: item.material,
//           specification: item.material_specification,
//           density: item.density,
//           material_cost: item.material_cost,
//           searchText: `${item.material.toLowerCase()} ${item.material_specification.toLowerCase()} ${item.density}`
//         }));
//         setMaterials(formattedMaterials);
//       }
//     } catch (error) {
//       console.error('Error fetching materials:', error);
//       message.error('Failed to load materials');
//     }
//   };

//   const filterOption = (input, option) => {
//     const material = materials.find(m => m.value === option.value);
//     return material ? material.searchText.includes(input.toLowerCase()) : false;
//   };

//   const handleMaterialChange = (value) => {
//     const selectedMaterial = materials.find(mat => mat.value === value);
//     if (selectedMaterial) {
//       setSelectedMaterialId(selectedMaterial.id);
//       setSelectedMaterialName(selectedMaterial.value);
//       setDensity(selectedMaterial.density);
//       message.success(`Material selected: ${selectedMaterial.value}`);
//     }
//   };

//   const handleFilesChange = (e) => {
//     const files = Array.from(e.target.files);

//     if (files.length !== 3) {
//       message.error('Please select exactly 3 STEP files (Female Tool, Male Tool, Part)');
//       return;
//     }

//     const invalidFiles = files.filter(file => {
//       const isValidType = file.name.toLowerCase().endsWith('.step') || 
//                           file.name.toLowerCase().endsWith('.stp');
//       const isValidSize = file.size / 1024 / 1024 < 50;
//       return !isValidType || !isValidSize;
//     });

//     if (invalidFiles.length > 0) {
//       message.error('All files must be STEP/STP format and smaller than 50MB');
//       return;
//     }

//     setUploadedFiles(files);
//     message.success(`${files.length} files uploaded successfully`);
//   };

//   const handleRemoveFile = (index) => {
//     const newFiles = uploadedFiles.filter((_, i) => i !== index);
//     setUploadedFiles(newFiles);
//     message.info('File removed');
//   };

//   const handleClearAll = () => {
//     setUploadedFiles([]);
//     message.info('All files cleared');
//   };

//   const handleSubmit = async (values) => {
//     if (uploadedFiles.length !== 3) {
//       message.error('Please upload exactly 3 STEP files: Female, Male, and Part');
//       return;
//     }

//     if (!selectedMaterialId) {
//       message.error('Please select a material');
//       return;
//     }

//     setIsLoading(true);
//     setConversionProgress(0);

//     try {
//       setProcessingStage('Analyzing files...');
//       setConversionProgress(10);

//       const analyzeFormData = new FormData();
//       uploadedFiles.forEach(file => {
//         analyzeFormData.append('files', file);
//       });
//       analyzeFormData.append('material_id', selectedMaterialId);
//       analyzeFormData.append('quantity', values.quantity || 1);

//       const analyzeResponse = await fetch(`${ANALYZE_API_URL}/analyze-step-files/`, {
//         method: 'POST',
//         body: analyzeFormData
//       });

//       if (!analyzeResponse.ok) {
//         const errorData = await analyzeResponse.json();
//         throw new Error(errorData.detail || errorData.message || 'Analysis failed');
//       }

//       const analysisData = await analyzeResponse.json();

//       if (!analysisData.history_id) {
//         throw new Error('No history ID returned from analysis');
//       }

//       const historyId = analysisData.history_id;
//       setConversionProgress(25);

//       setProcessingStage('Converting to 3D format...');

//       const convertFormData = new FormData();
//       uploadedFiles.forEach(file => {
//         convertFormData.append('files', file);
//       });
//       convertFormData.append('history_id', historyId);

//       const convertResponse = await fetch(`${CONVERT_API_URL}/convert-sheetmetal`, {
//         method: 'POST',
//         body: convertFormData
//       });

//       if (!convertResponse.ok) {
//         const errorData = await convertResponse.json();
//         throw new Error(errorData.message || errorData.detail || 'Conversion failed');
//       }

//       const conversionData = await convertResponse.json();

//       if (!conversionData.success) {
//         throw new Error(conversionData.message || 'Conversion failed');
//       }

//       setConversionProgress(60);

//       setProcessingStage('Calculating costs...');

//       const calculateFormData = new URLSearchParams();
//       calculateFormData.append('history_id', historyId);

//       const calculateResponse = await fetch(`${ANALYZE_API_URL}/calculate-sheetmetal-from-history/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: calculateFormData
//       });

//       if (!calculateResponse.ok) {
//         const errorData = await calculateResponse.json();
//         throw new Error(errorData.detail || errorData.message || 'Calculation failed');
//       }

//       const calculationData = await calculateResponse.json();

//       if (!calculationData.calculation_id) {
//         throw new Error('No calculation ID returned');
//       }

//       setConversionProgress(100);
//       setProcessingStage('Complete!');

//       localStorage.setItem('currentSheetMetalCalculationId', calculationData.calculation_id);
//       localStorage.setItem('currentSheetMetalHistoryId', historyId);

//       message.success('Processing completed successfully!');

//       navigate(`/sheet-metal-viewer/${historyId}`, {
//         state: {
//           calculationId: calculationData.calculation_id,
//           historyId: historyId,
//           materialName: selectedMaterialName,
//           quantity: values.quantity || 1,
//           density: density,
//           analysisData: analysisData,
//           calculationData: calculationData,
//           conversionData: conversionData
//         }
//       });

//     } catch (err) {
//       console.error('Error during processing:', err);
//       message.error(err.message || 'Processing failed. Please try again.');
//       setConversionProgress(0);
//       setProcessingStage('');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const renderMaterialOption = (material) => (
//     <div style={{ padding: '8px 4px' }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <span style={{ fontWeight: 500, fontSize: '14px' }}>{material.label}</span>
//         <span style={{ color: theme.buttonPrimary, fontSize: '12px', marginLeft: '8px' }}>
//           {material.density} kg/m³
//         </span>
//       </div>
//       <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
//         {material.specification}
//       </div>
//     </div>
//   );

//   const renderSelectedMaterial = (material) => {
//     const selectedMat = materials.find(m => m.value === material);
//     if (!selectedMat) return material;

//     return (
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
//         <span style={{ fontWeight: 500 }}>{selectedMat.label}</span>
//         <span style={{ color: theme.buttonPrimary, fontSize: '13px', marginLeft: '8px' }}>
//           {selectedMat.density} kg/m³
//         </span>
//       </div>
//     );
//   };

//   const CloudUploadIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={theme.buttonPrimary} strokeWidth="1.5">
//       <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
//       <polyline points="8 16 12 12 16 16"></polyline>
//       <line x1="12" y1="12" x2="12" y2="21"></line>
//     </svg>
//   );

//   return (
//     <div style={{ 
//       display: 'flex', 
//       flexDirection: 'column', 
//       height: '100vh',
//       overflow: 'hidden'
//     }}>
//       {/* Fixed Header */}
//       <div style={{
//         padding: '24px 32px',
//         background: '#fff',
//         flexShrink: 0
//       }}>
//         <button
//           onClick={() => navigate('/home/sheet-metal')}
//           style={{
//             marginBottom: '16px',
//             background: 'transparent',
//             border: 'none',
//             cursor: 'pointer',
//             color: theme.buttonPrimary,
//             fontSize: '14px',
//             fontWeight: '500'
//           }}
//         >
//           ← Back to Modules
//         </button>
//       </div>

//       {/* Scrollable Content Area */}
//       <div style={{
//         flex: 1,
//         overflow: 'auto',
//         padding: '0px'
//       }}>
//         <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
//           <Card style={{
//             borderRadius: '12px',
//             boxShadow: theme.glowShadow,
//             border: `2px solid ${theme.buttonPrimary}`
//           }}>
//             <div style={{ textAlign: 'center', marginBottom: '24px' }}>
//               <Title level={3} style={{ color: theme.textPrimary, margin: '0 0 8px 0' }}>Upload STEP Files</Title>
//               <Text style={{ color: '#666' }}>Select exactly 3 STEP/STP files</Text>
//             </div>

//             {/* File Upload Area - COMPACT */}
//             <div style={{
//               padding: '16px',
//               background: 'white',
//               borderRadius: '12px',
//               border: `2px solid ${theme.buttonPrimary}`,
//               textAlign: 'center',
//               marginBottom: '20px',
//               transition: 'all 0.3s ease'
//             }}>
//               {uploadedFiles.length === 0 ? (
//                 <>
//             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '16px' }}>
//   <CloudUploadIcon />
// </div>
//                   <Title level={4} style={{ marginTop: '16px', color: theme.textPrimary }}>
//                     Drop files here or click to browse
//                   </Title>
//                   <Text style={{ fontSize: '14px', color: '#999', display: 'block', marginTop: '8px' }}>
//                     Select 3 STEP/STP files at once (max 50MB each)
//                   </Text>
//                   <input
//                     type="file"
//                     accept=".step,.stp"
//                     multiple
//                     style={{ display: 'none' }}
//                     onChange={handleFilesChange}
//                     id="file-upload"
//                   />
//                   <Button 
//                     type="primary"
//                     size="large"
//                     icon={<UploadOutlined />}
//                     onClick={() => document.getElementById('file-upload').click()}
//                     style={{ 
//                       marginTop: '20px',
//                       background: theme.buttonPrimary,
//                       borderColor: theme.buttonPrimary
//                     }}
//                   >
//                     Select 3 Files
//                   </Button>
//                 </>
//               ) : (
//                 <>
//                   <div style={{ 
//                     display: 'flex', 
//                     alignItems: 'center', 
//                     justifyContent: 'center',
//                     marginBottom: '8px'
//                   }}>
//                     <div style={{
//                       width: '28px',
//                       height: '28px',
//                       borderRadius: '50%',
//                       background: '#52c41a',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       color: 'white',
//                       fontSize: '16px',
//                       fontWeight: 'bold'
//                     }}>
//                       ✓
//                     </div>
//                   </div>
//                   <Title level={5} style={{ color: '#52c41a', margin: '0 0 12px' }}>
//                     {uploadedFiles.length} Files Uploaded
//                   </Title>

//                   {/* Compact Files Row */}
//                   <Row gutter={[8, 8]} style={{ marginBottom: '10px' }}>
//                     {uploadedFiles.map((file, index) => (
//                       <Col xs={24} sm={12} md={8} key={index}>
//                         <Card style={{
//                           padding: '6px 8px',
//                           border: '1px solid #d9d9d9',
//                           borderRadius: '4px',
//                           textAlign: 'center',
//                           position: 'relative',
//                           minHeight: 'auto'
//                         }}>
//                           <FileOutlined style={{ fontSize: '18px', color: theme.buttonPrimary, marginBottom: '2px', display: 'block' }} />
//                           <Text strong style={{ display: 'block', marginBottom: '2px', fontSize: '10px', wordBreak: 'break-word', lineHeight: '1.2' }}>
//                             {file.name.length > 18 ? file.name.substring(0, 18) + '...' : file.name}
//                           </Text>
//                           <Text style={{ display: 'block', color: '#999', fontSize: '9px', marginBottom: '4px' }}>
//                             {(file.size / 1024 / 1024).toFixed(2)} MB
//                           </Text>
//                           <Button 
//                             danger 
//                             size="small" 
//                             icon={<DeleteOutlined />}
//                             onClick={() => handleRemoveFile(index)}
//                             style={{ fontSize: '10px', padding: '0px 6px', height: '20px' }}
//                             block
//                           >
//                             Remove
//                           </Button>
//                         </Card>
//                       </Col>
//                     ))}
//                   </Row>

//                   <div style={{ marginTop: '12px', display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
//                     <Button 
//                       onClick={handleClearAll}
//                       icon={<DeleteOutlined />}
//                       size="small"
//                     >
//                       Clear All
//                     </Button>
//                     <input
//                       type="file"
//                       accept=".step,.stp"
//                       multiple
//                       style={{ display: 'none' }}
//                       onChange={handleFilesChange}
//                       id="file-reupload"
//                     />
//                     <Button 
//                       type="primary"
//                       icon={<UploadOutlined />}
//                       onClick={() => document.getElementById('file-reupload').click()}
//                       size="small"
//                       style={{
//                         background: theme.buttonPrimary,
//                         borderColor: theme.buttonPrimary
//                       }}
//                     >
//                       Choose Different Files
//                     </Button>
//                   </div>
//                 </>
//               )}
//             </div>

//             {/* Material Selection and Form */}
//             <Form
//               form={form}
//               layout="vertical"
//               onFinish={handleSubmit}
//             >
//               <Row gutter={[16, 8]}>
//                 <Col xs={24} md={20}>
//                   <Form.Item
//                     name="material"
//                     label={<span style={{ fontWeight: 500 }}>Material</span>}
//                     rules={[{ required: true, message: 'Please select a material' }]}
//                   >
//                     <Select 
//                       placeholder="Search by material, specification, or density..."
//                       size="large"
//                       onChange={handleMaterialChange}
//                       showSearch
//                       filterOption={filterOption}
//                       optionLabelProp="label"
//                     >
//                       {materials.map((material) => (
//                         <Option 
//                           key={material.id} 
//                           value={material.value}
//                           label={renderSelectedMaterial(material.value)}
//                         >
//                           {renderMaterialOption(material)}
//                         </Option>
//                       ))}
//                     </Select>
//                   </Form.Item>
//                 </Col>

//                 <Col xs={24} md={4}>
//                   <Form.Item label={<span style={{ fontWeight: 500 }}>Add Material</span>}>
//                     <Button
//                       type="primary"
//                       size="large"
//                       icon={<PlusOutlined />}
//                       onClick={() => setShowAddMaterialModal(true)}
//                       style={{
//                         width: '100%',
//                         background: theme.buttonPrimary,
//                         borderColor: theme.buttonPrimary
//                       }}
//                     >
//                       Add New
//                     </Button>
//                   </Form.Item>
//                 </Col>
//               </Row>

//               {selectedMaterialId && (
//                 <Card style={{ 
//                   marginTop: '8px', 
//                   marginBottom: '12px', 
//                   background: '#f9f9f9', 
//                   padding: '10px 16px',
//                   borderRadius: '6px'
//                 }}>
//                   <Row gutter={[16, 0]} align="middle">
//                     <Col span={8}>
//                       <div style={{ display: 'flex', flexDirection: 'column' }}>
//                         <Text style={{ color: '#666', fontSize: '11px', marginBottom: '2px' }}>Selected Material:</Text>
//                         <Text strong style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
//                           {selectedMaterialName}
//                         </Text>
//                       </div>
//                     </Col>
//                     <Col span={8}>
//                       <div style={{ display: 'flex', flexDirection: 'column' }}>
//                         <Text style={{ color: '#666', fontSize: '11px', marginBottom: '2px' }}>Density:</Text>
//                         <Text strong style={{ fontSize: '13px' }}>
//                           {density} kg/m³
//                         </Text>
//                       </div>
//                     </Col>
//                     <Col span={8}>
//                       <div style={{ display: 'flex', flexDirection: 'column' }}>
//                         <Text style={{ color: '#666', fontSize: '11px', marginBottom: '2px' }}>Specification:</Text>
//                         <Text strong style={{ fontSize: '13px' }}>
//                           {materials.find(m => m.id === selectedMaterialId)?.specification}
//                         </Text>
//                       </div>
//                     </Col>
//                   </Row>
//                 </Card>
//               )}

//               <Form.Item style={{ textAlign: 'center', marginBottom: '0', marginTop: '12px' }}>
//                 <Button
//                   type="primary"
//                   htmlType="submit"
//                   loading={isLoading}
//                   disabled={isLoading || uploadedFiles.length !== 3}
//                   size="large"
//                   style={{ 
//                     height: '48px', 
//                     padding: '0 48px',
//                     background: theme.buttonPrimary,
//                     borderColor: theme.buttonPrimary,
//                     color: theme.white,
//                     background: theme.buttonPrimary,
//                     borderColor: theme.buttonPrimary,
//                   }}
//                 >
//                   {isLoading ? processingStage : 'Analyze & Get Quote'}
//                 </Button>
//               </Form.Item>

//             {isLoading && (
//                               <div style={{ marginTop: '16px' }}>
//                                 <Progress 
//                                   percent={conversionProgress} 
//                                   status="active"
//                                   strokeColor={{
//                                     '0%': '#246679',
//                                     '100%': '#73b6ca',
//                                   }}
//                                 />
//                                 <Text style={{ 
//                                   display: 'block', 
//                                   textAlign: 'center', 
//                                   marginTop: '8px', 
//                                   color: theme.textPrimary,
//                                   fontSize: '14px',
//                                   fontWeight: 500
//                                 }}>
//                                   {processingStage}
//                                 </Text>
//                               </div>
//                             )}
//             </Form>
//           </Card>
//         </div>
//       </div>

//       {/* Add Material Modal */}
//       <AddMaterialModal
//         visible={showAddMaterialModal}
//         onClose={() => setShowAddMaterialModal(false)}
//         onSuccess={fetchMaterials}
//       />
//     </div>
//   );
// }

// export default SheetMetalUploadPage;
















import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout, Button, Select, InputNumber, Form, Typography, message, Card, Row, Col, Modal, Input, Progress
} from 'antd';
import { DeleteOutlined, UploadOutlined, FileOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const theme = {
  textPrimary: '#000000',
  buttonPrimary: '#246679',
  white: '#ffffff',
  shadow: '0 2px 12px rgba(36, 102, 121, 0.15)',
  glowShadow: '0 0 10px rgba(36, 102, 121, 0.2)',
  lightBackground: '#73b6ca',
};

const AddMaterialModal = ({ visible, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    material: '',
    material_specification: '',
    density: '',
    material_cost: '',
    parameters: [{
      length_range: '',
      roughing_feed_rate: '',
      roughing_axial_depth_of_cut: '',
      roughing_radial_width_of_cut: '',
      finishing_feed_rate: '',
      finishing_axial_depth_of_cut: '',
      finishing_radial_width_of_cut: ''
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
        roughing_axial_depth_of_cut: '',
        roughing_radial_width_of_cut: '',
        finishing_feed_rate: '',
        finishing_axial_depth_of_cut: '',
        finishing_radial_width_of_cut: ''
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

  const handleSubmit = async () => {
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
          roughing_axial_depth_of_cut: parseFloat(param.roughing_axial_depth_of_cut) || 0,
          roughing_radial_width_of_cut: parseFloat(param.roughing_radial_width_of_cut) || 0,
          finishing_feed_rate: parseFloat(param.finishing_feed_rate) || 0,
          finishing_axial_depth_of_cut: parseFloat(param.finishing_axial_depth_of_cut) || 0,
          finishing_radial_width_of_cut: parseFloat(param.finishing_radial_width_of_cut) || 0
        })),
        machine_rates: formData.machine_rates.map(rate => ({
          machine_type: rate.machine_type,
          size: rate.size,
          hourly_rate: parseFloat(rate.hourly_rate) || 0
        }))
      };

      const response = await fetch('http://localhost:5678/sheetmetal-materials/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add material');
      }

      message.success('Material added successfully!');
      onSuccess();
      onClose();

      setFormData({
        material: '',
        material_specification: '',
        density: '',
        material_cost: '',
        parameters: [{
          length_range: '',
          roughing_feed_rate: '',
          roughing_axial_depth_of_cut: '',
          roughing_radial_width_of_cut: '',
          finishing_feed_rate: '',
          finishing_axial_depth_of_cut: '',
          finishing_radial_width_of_cut: ''
        }],
        machine_rates: [{
          machine_type: '',
          size: '',
          hourly_rate: ''
        }]
      });
    } catch (err) {
      message.error('Error adding material: ' + err.message);
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
      bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
    >
      <div style={{ position: 'sticky', top: 0, background: 'white', zIndex: 1, paddingBottom: '16px', borderBottom: '1px solid #f0f0f0', marginBottom: '16px' }}>
        <Title level={3} style={{ margin: 0 }}>Add New Material</Title>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ background: '#e6f7ff', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <Title level={5}>Basic Information</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <div>
                <Text strong><span style={{ color: 'red' }}>*</span> Material Name</Text>
                <Input
                  placeholder="e.g., Aluminium"
                  value={formData.material}
                  onChange={(e) => handleInputChange('material', e.target.value)}
                  style={{ marginTop: '8px' }}
                />
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div>
                <Text strong><span style={{ color: 'red' }}>*</span> Material Specification</Text>
                <Input
                  placeholder="e.g., bs15"
                  value={formData.material_specification}
                  onChange={(e) => handleInputChange('material_specification', e.target.value)}
                  style={{ marginTop: '8px' }}
                />
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div>
                <Text strong><span style={{ color: 'red' }}>*</span> Density (kg/m³)</Text>
                <InputNumber
                  placeholder="e.g., 2780"
                  value={formData.density}
                  onChange={(value) => handleInputChange('density', value)}
                  style={{ width: '100%', marginTop: '8px' }}
                  step={0.01}
                />
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div>
                <Text strong><span style={{ color: 'red' }}>*</span> Material Cost (₹/kg)</Text>
                <InputNumber
                  placeholder="0.00"
                  value={formData.material_cost}
                  onChange={(value) => handleInputChange('material_cost', value)}
                  style={{ width: '100%', marginTop: '8px' }}
                  step={0.01}
                />
              </div>
            </Col>
          </Row>
        </div>

        <div style={{ background: '#fffbe6', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Title level={5} style={{ margin: 0 }}>Machining Parameters</Title>
            <Button type="link" onClick={addParameterSet} style={{ color: theme.buttonPrimary }}>
              + Add Parameter Set
            </Button>
          </div>
          {formData.parameters.map((param, index) => (
            <div key={index} style={{ background: 'white', padding: '16px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #d9d9d9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <Text strong>Parameter Set #{index + 1}</Text>
                {formData.parameters.length > 1 && (
                  <Button
                    type="text"
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => removeParameterSet(index)}
                  />
                )}
              </div>
              <Row gutter={[12, 12]}>
                <Col span={24}>
                  <Text>Length Range</Text>
                  <Input
                    placeholder="e.g., 0-100mm"
                    value={param.length_range}
                    onChange={(e) => handleParameterChange(index, 'length_range', e.target.value)}
                    style={{ marginTop: '4px' }}
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Text>Rough Feed Rate</Text>
                  <InputNumber
                    placeholder="mm/min"
                    value={param.roughing_feed_rate}
                    onChange={(value) => handleParameterChange(index, 'roughing_feed_rate', value)}
                    style={{ width: '100%', marginTop: '4px' }}
                    step={0.01}
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Text>Rough Axial DoC</Text>
                  <InputNumber
                    placeholder="mm"
                    value={param.roughing_axial_depth_of_cut}
                    onChange={(value) => handleParameterChange(index, 'roughing_axial_depth_of_cut', value)}
                    style={{ width: '100%', marginTop: '4px' }}
                    step={0.01}
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Text>Rough Radial WOC</Text>
                  <InputNumber
                    placeholder="mm"
                    value={param.roughing_radial_width_of_cut}
                    onChange={(value) => handleParameterChange(index, 'roughing_radial_width_of_cut', value)}
                    style={{ width: '100%', marginTop: '4px' }}
                    step={0.01}
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Text>Finish Feed Rate</Text>
                  <InputNumber
                    placeholder="mm/min"
                    value={param.finishing_feed_rate}
                    onChange={(value) => handleParameterChange(index, 'finishing_feed_rate', value)}
                    style={{ width: '100%', marginTop: '4px' }}
                    step={0.01}
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Text>Finish Axial DoC</Text>
                  <InputNumber
                    placeholder="mm"
                    value={param.finishing_axial_depth_of_cut}
                    onChange={(value) => handleParameterChange(index, 'finishing_axial_depth_of_cut', value)}
                    style={{ width: '100%', marginTop: '4px' }}
                    step={0.01}
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Text>Finish Radial WOC</Text>
                  <InputNumber
                    placeholder="mm"
                    value={param.finishing_radial_width_of_cut}
                    onChange={(value) => handleParameterChange(index, 'finishing_radial_width_of_cut', value)}
                    style={{ width: '100%', marginTop: '4px' }}
                    step={0.01}
                  />
                </Col>
              </Row>
            </div>
          ))}
        </div>

        <div style={{ background: '#f6ffed', padding: '16px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Title level={5} style={{ margin: 0 }}>Machine Rates</Title>
            <Button type="link" onClick={addMachineRate} style={{ color: theme.buttonPrimary }}>
              + Add Machine Rate
            </Button>
          </div>
          {formData.machine_rates.map((rate, index) => (
            <div key={index} style={{ background: 'white', padding: '16px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #d9d9d9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <Text strong>Machine Rate #{index + 1}</Text>
                {formData.machine_rates.length > 1 && (
                  <Button
                    type="text"
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => removeMachineRate(index)}
                  />
                )}
              </div>
              <Row gutter={[12, 12]}>
                <Col xs={24} md={8}>
                  <Text>Machine Type</Text>
                  <Input
                    placeholder="e.g., CNC Press"
                    value={rate.machine_type}
                    onChange={(e) => handleMachineRateChange(index, 'machine_type', e.target.value)}
                    style={{ marginTop: '4px' }}
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Text>Machine Size</Text>
                  <Input
                    placeholder="e.g., 2000*1000*600"
                    value={rate.size}
                    onChange={(e) => handleMachineRateChange(index, 'size', e.target.value)}
                    style={{ marginTop: '4px' }}
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Text>Hourly Rate (₹/hr)</Text>
                  <InputNumber
                    placeholder="0.00"
                    value={rate.hourly_rate}
                    onChange={(value) => handleMachineRateChange(index, 'hourly_rate', value)}
                    style={{ width: '100%', marginTop: '4px' }}
                    step={0.01}
                  />
                </Col>
              </Row>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={submitting}
          style={{ background: theme.buttonPrimary, borderColor: theme.buttonPrimary }}
        >
          {submitting ? 'Adding Material...' : 'Add Material'}
        </Button>
      </div>
    </Modal>
  );
};

function SheetMetalUploadPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  const [selectedMaterialName, setSelectedMaterialName] = useState(null);
  const [density, setDensity] = useState(null);
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [conversionProgress, setConversionProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const ANALYZE_API_URL = 'http://localhost:5678';
  const CONVERT_API_URL = 'http://localhost:5000';

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await fetch(`${ANALYZE_API_URL}/sheetmetal-materials`);
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        const formattedMaterials = data.data.map(item => ({
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
    } catch (error) {
      console.error('Error fetching materials:', error);
      message.error('Failed to load materials');
    }
  };

  const filterOption = (input, option) => {
    const material = materials.find(m => m.value === option.value);
    return material ? material.searchText.includes(input.toLowerCase()) : false;
  };

  const handleMaterialChange = (value) => {
    const selectedMaterial = materials.find(mat => mat.value === value);
    if (selectedMaterial) {
      setSelectedMaterialId(selectedMaterial.id);
      setSelectedMaterialName(selectedMaterial.value);
      setDensity(selectedMaterial.density);
      message.success(`Material selected: ${selectedMaterial.value}`);
    }
  };

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length < 1 || files.length > 3) {
      message.error('Please select either 1 or 3 STEP/STP/STL/IGES/IGS files');
      return;
    }

    const invalidFiles = files.filter(file => {
      const isValidType = file.name.toLowerCase().endsWith('.step') ||
        file.name.toLowerCase().endsWith('.stp') ||
        file.name.toLowerCase().endsWith('.stl') ||
        file.name.toLowerCase().endsWith('.iges') ||
        file.name.toLowerCase().endsWith('.igs');
      const isValidSize = file.size / 1024 / 1024 < 50;
      return !isValidType || !isValidSize;
    });

    if (invalidFiles.length > 0) {
      message.error('All files must be STEP/STP/STL/IGES/IGS format and smaller than 50MB');
      return;
    }

    setUploadedFiles(files);
    message.success(`${files.length} files uploaded successfully`);
  };

  const handleRemoveFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    message.info('File removed');
  };

  const handleClearAll = () => {
    setUploadedFiles([]);
    message.info('All files cleared');
  };

  const handleSubmit = async (values) => {
    if (uploadedFiles.length !== 1 && uploadedFiles.length !== 3) {
      message.error('Please upload either 1 or 3 STEP/STP/STL/IGES/IGS files');
      return;
    }

    if (!selectedMaterialId) {
      message.error('Please select a material');
      return;
    }

    setIsLoading(true);
    setConversionProgress(0);

    try {
      setProcessingStage('Analyzing files...');
      setConversionProgress(10);

      // Check if any file is IGES format
      const hasIgesFiles = uploadedFiles.some(file =>
        file.name.toLowerCase().endsWith('.iges') ||
        file.name.toLowerCase().endsWith('.igs')
      );

      const analyzeFormData = new FormData();
      uploadedFiles.forEach(file => {
        analyzeFormData.append('files', file);
      });
      analyzeFormData.append('material_id', selectedMaterialId);
      analyzeFormData.append('quantity', values.quantity || 1);

      // Route to appropriate endpoint based on file type
      let analyzeEndpoint;
      let apiUrl;

      if (hasIgesFiles) {
        analyzeEndpoint = '/analyze-iges-sheetmetal';
        apiUrl = ANALYZE_API_URL; // Use CONVERT_API_URL for IGES files
      } else {
        analyzeEndpoint = '/analyze-step-files/';
        apiUrl = ANALYZE_API_URL; // Use ANALYZE_API_URL for STEP files
      }

      const analyzeResponse = await fetch(`${apiUrl}${analyzeEndpoint}`, {
        method: 'POST',
        body: analyzeFormData
      });

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json();
        throw new Error(errorData.detail || errorData.message || 'Analysis failed');
      }

      const analysisData = await analyzeResponse.json();

      if (!analysisData.history_id) {
        throw new Error('No history ID returned from analysis');
      }

      const historyId = analysisData.history_id;
      setConversionProgress(25);

      setProcessingStage('Converting to 3D format...');

      const convertFormData = new FormData();
      uploadedFiles.forEach(file => {
        convertFormData.append('files', file);
      });
      convertFormData.append('history_id', historyId);

      const convertResponse = await fetch(`${CONVERT_API_URL}/convert-sheetmetal`, {
        method: 'POST',
        body: convertFormData
      });

      if (!convertResponse.ok) {
        const errorData = await convertResponse.json();
        throw new Error(errorData.message || errorData.detail || 'Conversion failed');
      }

      const conversionData = await convertResponse.json();

      if (!conversionData.success) {
        throw new Error(conversionData.message || 'Conversion failed');
      }

      setConversionProgress(60);

      setProcessingStage('Calculating costs...');

      const calculateFormData = new URLSearchParams();
      calculateFormData.append('history_id', historyId);

      const calculateResponse = await fetch(`${ANALYZE_API_URL}/calculate-sheetmetal-from-history/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: calculateFormData
      });

      if (!calculateResponse.ok) {
        const errorData = await calculateResponse.json();
        throw new Error(errorData.detail || errorData.message || 'Calculation failed');
      }

      const calculationData = await calculateResponse.json();

      if (!calculationData.calculation_id) {
        throw new Error('No calculation ID returned');
      }

      setConversionProgress(100);
      setProcessingStage('Complete!');

      localStorage.setItem('currentSheetMetalCalculationId', calculationData.calculation_id);
      localStorage.setItem('currentSheetMetalHistoryId', historyId);

      message.success('Processing completed successfully!');

      navigate(`/sheet-metal-viewer/${historyId}`, {
        state: {
          calculationId: calculationData.calculation_id,
          historyId: historyId,
          materialName: selectedMaterialName,
          quantity: values.quantity || 1,
          density: density,
          analysisData: analysisData,
          calculationData: calculationData,
          conversionData: conversionData
        }
      });

    } catch (err) {
      console.error('Error during processing:', err);
      message.error(err.message || 'Processing failed. Please try again.');
      setConversionProgress(0);
      setProcessingStage('');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMaterialOption = (material) => (
    <div style={{ padding: '8px 4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 500, fontSize: '14px' }}>{material.label}</span>
        <span style={{ color: theme.buttonPrimary, fontSize: '12px', marginLeft: '8px' }}>
          {material.density} kg/m³
        </span>
      </div>
      <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
        {material.specification}
      </div>
    </div>
  );

  const renderSelectedMaterial = (material) => {
    const selectedMat = materials.find(m => m.value === material);
    if (!selectedMat) return material;

    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <span style={{ fontWeight: 500 }}>{selectedMat.label}</span>
        <span style={{ color: theme.buttonPrimary, fontSize: '13px', marginLeft: '8px' }}>
          {selectedMat.density} kg/m³
        </span>
      </div>
    );
  };

  const CloudUploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={theme.buttonPrimary} strokeWidth="1.5">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
      <polyline points="8 16 12 12 16 16"></polyline>
      <line x1="12" y1="12" x2="12" y2="21"></line>
    </svg>
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Fixed Header */}
      <div style={{
        padding: '24px 32px',
        background: '#fff',
        flexShrink: 0
      }}>
        <button
          onClick={() => navigate('/home/sheet-metal')}
          style={{
            marginBottom: '16px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: theme.buttonPrimary,
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          ← Back to Modules
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '0px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Card style={{
            borderRadius: '12px',
            boxShadow: theme.glowShadow,
            border: `2px solid ${theme.buttonPrimary}`
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Title level={3} style={{ color: theme.textPrimary, margin: '0 0 8px 0' }}>Upload STEP/STL/IGES Files</Title>
              <Text style={{ color: '#666' }}>Select 1 or 3 STEP/STP/STL/IGES/IGS files</Text>
            </div>

            {/* File Upload Area - COMPACT */}
            <div style={{
              padding: '16px',
              background: 'white',
              borderRadius: '12px',
              border: `2px solid ${theme.buttonPrimary}`,
              textAlign: 'center',
              marginBottom: '20px',
              transition: 'all 0.3s ease'
            }}>
              {uploadedFiles.length === 0 ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '16px' }}>
                    <CloudUploadIcon />
                  </div>
                  <Title level={4} style={{ marginTop: '16px', color: theme.textPrimary }}>
                    Drop files here or click to browse
                  </Title>
                  <Text style={{ fontSize: '14px', color: '#999', display: 'block', marginTop: '8px' }}>
                    Select 1 or 3 STEP/STP/STL/IGES/IGS files at once (max 50MB each)
                  </Text>
                  <input
                    type="file"
                    accept=".step,.stp,.stl,.iges,.igs"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleFilesChange}
                    id="file-upload"
                  />
                  <Button
                    type="primary"
                    size="large"
                    icon={<UploadOutlined />}
                    onClick={() => document.getElementById('file-upload').click()}
                    style={{
                      marginTop: '20px',
                      background: theme.buttonPrimary,
                      borderColor: theme.buttonPrimary
                    }}
                  >
                    Select Files
                  </Button>
                </>
              ) : (
                <>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '8px'
                  }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#52c41a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}>
                      ✓
                    </div>
                  </div>
                  <Title level={5} style={{ color: '#52c41a', margin: '0 0 12px' }}>
                    {uploadedFiles.length} Files Uploaded
                  </Title>

                  {/* Compact Files Row */}
                  <Row gutter={[8, 8]} style={{ marginBottom: '10px' }}>
                    {uploadedFiles.map((file, index) => (
                      <Col xs={24} sm={12} md={8} key={index}>
                        <Card style={{
                          padding: '6px 8px',
                          border: '1px solid #d9d9d9',
                          borderRadius: '4px',
                          textAlign: 'center',
                          position: 'relative',
                          minHeight: 'auto'
                        }}>
                          <FileOutlined style={{ fontSize: '18px', color: theme.buttonPrimary, marginBottom: '2px', display: 'block' }} />
                          <Text strong style={{ display: 'block', marginBottom: '2px', fontSize: '10px', wordBreak: 'break-word', lineHeight: '1.2' }}>
                            {file.name.length > 18 ? file.name.substring(0, 18) + '...' : file.name}
                          </Text>
                          <Text style={{ display: 'block', color: '#999', fontSize: '9px', marginBottom: '4px' }}>
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </Text>
                          <Button
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemoveFile(index)}
                            style={{ fontSize: '10px', padding: '0px 6px', height: '20px' }}
                            block
                          >
                            Remove
                          </Button>
                        </Card>
                      </Col>
                    ))}
                  </Row>

                  <div style={{ marginTop: '12px', display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button
                      onClick={handleClearAll}
                      icon={<DeleteOutlined />}
                      size="small"
                    >
                      Clear All
                    </Button>
                    <input
                      type="file"
                      accept=".step,.stp,.stl,.iges,.igs"
                      multiple
                      style={{ display: 'none' }}
                      onChange={handleFilesChange}
                      id="file-reupload"
                    />
                    <Button
                      type="primary"
                      icon={<UploadOutlined />}
                      onClick={() => document.getElementById('file-reupload').click()}
                      size="small"
                      style={{
                        background: theme.buttonPrimary,
                        borderColor: theme.buttonPrimary
                      }}
                    >
                      Choose Different Files
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Material Selection and Form */}
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Row gutter={[16, 8]}>
                <Col xs={24} md={20}>
                  <Form.Item
                    name="material"
                    label={<span style={{ fontWeight: 500 }}>Material</span>}
                    rules={[{ required: true, message: 'Please select a material' }]}
                  >
                    <Select
                      placeholder="Search by material, specification, or density..."
                      size="large"
                      onChange={handleMaterialChange}
                      showSearch
                      filterOption={filterOption}
                      optionLabelProp="label"
                    >
                      {materials.map((material) => (
                        <Option
                          key={material.id}
                          value={material.value}
                          label={renderSelectedMaterial(material.value)}
                        >
                          {renderMaterialOption(material)}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={4}>
                  <Form.Item label={<span style={{ fontWeight: 500 }}>Add Material</span>}>
                    <Button
                      type="primary"
                      size="large"
                      icon={<PlusOutlined />}
                      onClick={() => setShowAddMaterialModal(true)}
                      style={{
                        width: '100%',
                        background: theme.buttonPrimary,
                        borderColor: theme.buttonPrimary
                      }}
                    >
                      Add New
                    </Button>
                  </Form.Item>
                </Col>
              </Row>

              {selectedMaterialId && (
                <Card style={{
                  marginTop: '8px',
                  marginBottom: '12px',
                  background: '#f9f9f9',
                  padding: '10px 16px',
                  borderRadius: '6px'
                }}>
                  <Row gutter={[16, 0]} align="middle">
                    <Col span={8}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text style={{ color: '#666', fontSize: '11px', marginBottom: '2px' }}>Selected Material:</Text>
                        <Text strong style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                          {selectedMaterialName}
                        </Text>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text style={{ color: '#666', fontSize: '11px', marginBottom: '2px' }}>Density:</Text>
                        <Text strong style={{ fontSize: '13px' }}>
                          {density} kg/m³
                        </Text>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text style={{ color: '#666', fontSize: '11px', marginBottom: '2px' }}>Specification:</Text>
                        <Text strong style={{ fontSize: '13px' }}>
                          {materials.find(m => m.id === selectedMaterialId)?.specification}
                        </Text>
                      </div>
                    </Col>
                  </Row>
                </Card>
              )}

              <Form.Item style={{ textAlign: 'center', marginBottom: '0', marginTop: '12px' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  disabled={isLoading || (uploadedFiles.length !== 1 && uploadedFiles.length !== 3)}
                  size="large"
                  style={{
                    height: '48px',
                    padding: '0 48px',
                    background: theme.buttonPrimary,
                    borderColor: theme.buttonPrimary,
                    color: theme.white,
                    background: theme.buttonPrimary,
                    borderColor: theme.buttonPrimary,
                  }}
                >
                  {isLoading ? processingStage : 'Analyze & Get Quote'}
                </Button>
              </Form.Item>

              {isLoading && (
                <div style={{ marginTop: '16px' }}>
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
                    fontWeight: 500
                  }}>
                    {processingStage}
                  </Text>
                </div>
              )}
            </Form>
          </Card>
        </div>
      </div>

      {/* Add Material Modal */}
      <AddMaterialModal
        visible={showAddMaterialModal}
        onClose={() => setShowAddMaterialModal(false)}
        onSuccess={fetchMaterials}
      />
    </div>
  );
}

export default SheetMetalUploadPage;