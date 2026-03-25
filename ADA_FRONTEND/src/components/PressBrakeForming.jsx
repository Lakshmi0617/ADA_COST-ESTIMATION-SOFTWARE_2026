import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Layout, Upload, Button, Select, InputNumber, Form, Typography, message, Card, Row, Col, Spin, Tooltip, Tag, Modal, Input, Progress
} from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Dragger } = Upload;

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

function SheetMetalUploadPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [materialForm] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  const [selectedMaterialName, setSelectedMaterialName] = useState(null);
  const [density, setDensity] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({
    female: null,
    male: null,
    part: null
  });
  const [conversionProgress, setConversionProgress] = useState(0);
  const fileInputRef = useRef(null);

  const API_URL = 'http://172.18.100.156:8004';
  const ANALYZE_URL = `${API_URL}/analyze-step-files/`;
  const CONVERT_URL = `${API_URL}/convert-sheetmetal`;

  // Fetch materials
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get(`${API_URL}/sheetmetal-materials`);
        console.log('Fetched sheet metal materials:', response.data);

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

  const filterOption = (input, option) => {
    const material = materials.find(m => m.value === option.value);
    if (!material) return false;
    return material.searchText.includes(input.toLowerCase());
  };

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

  const handleAddMaterial = async (values) => {
    setIsAddingMaterial(true);
    try {
      const materialData = {
        material: values.material,
        material_specification: values.material_specification,
        density: values.density,
        material_cost: values.material_cost || 0,
      };

      const response = await axios.post(`${API_URL}/sheetmetal-materials/`, materialData);

      if (response.status === 200 || response.status === 201) {
        message.success('Material added successfully!');
        
        const materialsResponse = await axios.get(`${API_URL}/sheetmetal-materials`);
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

  const beforeUpload = (file, fileType) => {
    const isValidFile = file.name.toLowerCase().endsWith('.step') || 
                       file.name.toLowerCase().endsWith('.stp');
    if (!isValidFile) {
      message.error('Only STEP/STP files are allowed!');
      return Upload.LIST_IGNORE;
    }
    
    const isLt50MB = file.size / 1024 / 1024 < 50;
    if (!isLt50MB) {
      message.error('File must be smaller than 50MB!');
      return Upload.LIST_IGNORE;
    }
    
    setUploadedFiles(prev => ({
      ...prev,
      [fileType]: file
    }));
    
    setUploadProgress(prev => ({
      ...prev,
      [fileType]: 100
    }));
    
    message.success(`${fileType.charAt(0).toUpperCase() + fileType.slice(1)} file uploaded`);
    return false;
  };

  const handleRemoveFile = (fileType) => {
    setUploadedFiles(prev => ({
      ...prev,
      [fileType]: null
    }));
    
    setUploadProgress(prev => ({
      ...prev,
      [fileType]: 0
    }));
  };

  const handleSubmit = async (values) => {
    // Validate all three files are uploaded
    if (!uploadedFiles.female || !uploadedFiles.male || !uploadedFiles.part) {
      message.error('Please upload all three files: Female, Male, and Part');
      return;
    }

    if (!selectedMaterialId) {
      message.error('Please select a material.');
      return;
    }

    setIsLoading(true);
    setConversionProgress(0);

    try {
      // Step 1: Analyze STEP files
      const formData = new FormData();
      formData.append('files', uploadedFiles.female);
      formData.append('files', uploadedFiles.male);
      formData.append('files', uploadedFiles.part);
      formData.append('material_id', selectedMaterialId);
      formData.append('quantity', values.quantity || 1);

      setConversionProgress(20);
      console.log('Sending STEP files for analysis...');

      const analyzeResponse = await axios.post(ANALYZE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 30) / progressEvent.total) + 20;
          setConversionProgress(Math.min(progress, 50));
        }
      });

      console.log('Analysis response:', analyzeResponse.data);
      const historyId = analyzeResponse.data.history_id;
      
      if (!historyId) {
        throw new Error('No history ID returned from analysis');
      }

      setConversionProgress(50);

      // Step 2: Convert STEP files to GLB/Draco formats
      const convertFormData = new FormData();
      convertFormData.append('files', uploadedFiles.female);
      convertFormData.append('files', uploadedFiles.male);
      convertFormData.append('files', uploadedFiles.part);
      convertFormData.append('material_id', selectedMaterialId);
      convertFormData.append('quantity', values.quantity || 1);

      console.log('Converting STEP files to 3D formats...');
      setConversionProgress(60);

      const convertResponse = await axios.post(CONVERT_URL, convertFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 30) / progressEvent.total) + 60;
          setConversionProgress(Math.min(progress, 85));
        }
      });

      console.log('Conversion response:', convertResponse.data);

      if (!convertResponse.data.success) {
        throw new Error(convertResponse.data.message || 'Conversion failed');
      }

      setConversionProgress(95);

      // Step 3: Navigate to viewer
      localStorage.setItem('currentSheetMetalCalculationId', historyId);

      navigate(`/sheetmetal-viewer/${historyId}`, {
        state: {
          materialName: selectedMaterialName,
          quantity: values.quantity || 1,
          density: density,
          analysisData: analyzeResponse.data,
          conversionData: convertResponse.data
        }
      });

      setConversionProgress(100);
      message.success('Files processed successfully!');

    } catch (err) {
      console.error('API error:', err);
      
      let errorMessage = 'An error occurred during processing.';
      if (err.response) {
        errorMessage = `Server error: ${err.response.status}`;
        try {
          const errorData = err.response.data;
          if (typeof errorData === 'object' && errorData.detail) {
            errorMessage = errorData.detail;
          } else if (typeof errorData === 'object' && errorData.message) {
            errorMessage = errorData.message;
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
    } finally {
      setIsLoading(false);
      setConversionProgress(0);
    }
  };

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

  const CloudUploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={theme.buttonPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
      <polyline points="8 16 12 12 16 16"></polyline>
      <line x1="12" y1="12" x2="12" y2="21"></line>
    </svg>
  );

  const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );

  const handleBackToModules = () => {
    navigate('/home/machining');
  };

  return (
    <Layout style={{ 
      minHeight: '92vh', 
      background: theme.background,
      overflow: 'auto'
    }}>
      <Layout style={{ overflow: 'visible' }}>
        <Content style={{ 
          padding: '16px 32px 32px',
          overflow: 'initial',
          background: theme.background
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
           
            {/* Upload Section */}
            <div style={{ marginBottom: '40px' }}>
              <button
                onClick={handleBackToModules}
                className="flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-100"
                style={{color: '#246679'}}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Back to Modules</span>
              </button>
                          
              <Title level={2} style={{ 
                marginBottom: '4px', 
                color: theme.textPrimary,
              }}>
                Sheet Metal Process Configuration
              </Title>
              <Paragraph style={{ 
                marginBottom: '16px', 
                color: theme.textPrimary,
                fontSize: '16px'
              }}>
                Upload your STEP files (Female Tool, Male Tool, and Part) for 3D analysis and cost calculation
              </Paragraph>
              
             <Card 
              style={{ 
                borderRadius: '12px',
                boxShadow: theme.glowShadow,
                border: `2px solid ${theme.buttonPrimary}`,
                background: theme.lightBackground,
                overflow: 'visible',
                marginTop: '10px',
                marginLeft: '32px',
                marginRight: '32px'
              }}
              bodyStyle={{ padding: '0' }}
            >
                <div style={{ 
                  padding: '20px 32px', 
                  background: theme.lightBackground,
                  borderRadius: '12px 12px 0 0', 
                  textAlign: 'center',
                  border: `1px solid ${theme.buttonPrimary}`,
                  boxShadow: `inset 0 0 20px rgba(36, 102, 121, 0.1)`
                }}>
                  <Title level={3} style={{ color: theme.textPrimary, marginBottom: '20px' }}>
                    Upload STEP Files
                  </Title>

                  {/* Three File Upload Areas */}
                  <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    {['female', 'male', 'part'].map((fileType) => (
                      <Col xs={24} md={8} key={fileType}>
                        <div style={{
                          padding: '16px',
                          background: 'white',
                          borderRadius: '8px',
                          border: uploadedFiles[fileType] ? `2px solid #4ade80` : `2px dashed ${theme.buttonPrimary}`,
                          minHeight: '200px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}>
                          {uploadedFiles[fileType] ? (
                            <div style={{ textAlign: 'center' }}>
                              <CheckIcon />
                              <Text style={{ display: 'block', marginTop: '8px', color: '#4ade80', fontWeight: 'bold' }}>
                                {uploadedFiles[fileType].name}
                              </Text>
                              <Text style={{ display: 'block', fontSize: '12px', color: theme.textSecondary, marginTop: '4px' }}>
                                {(uploadedFiles[fileType].size / 1024 / 1024).toFixed(2)} MB
                              </Text>
                              <Button 
                                danger 
                                size="small" 
                                icon={<DeleteOutlined />}
                                onClick={() => handleRemoveFile(fileType)}
                                style={{ marginTop: '8px' }}
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <div>
                              <CloudUploadIcon />
                              <Title level={5} style={{ marginTop: '12px', textTransform: 'capitalize', color: theme.textPrimary }}>
                                {fileType} Tool
                              </Title>
                              <Text style={{ fontSize: '12px', color: theme.textSecondary }}>
                                Click to upload or drag STEP file
                              </Text>
                              <input
                                type="file"
                                accept=".step,.stp"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                  if (e.target.files[0]) {
                                    beforeUpload(e.target.files[0], fileType);
                                  }
                                }}
                                onClick={(e) => e.currentTarget.value = ''}
                              />
                              <Button 
                                type="primary"
                                size="small"
                                onClick={(e) => e.currentTarget.parentElement.querySelector('input').click()}
                                style={{ marginTop: '8px' }}
                              >
                                <UploadOutlined /> Browse
                              </Button>
                            </div>
                          )}
                        </div>
                      </Col>
                    ))}
                  </Row>

                  {uploadProgress.female > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <Progress percent={uploadProgress.female} status="active" />
                    </div>
                  )}
                </div>
                
                {/* Form Card */}
                <div style={{ 
                  padding: '20px 32px', 
                  overflow: 'visible',
                  background: theme.lightBackground
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
                              <Tooltip title="Select a material specification from the dropdown.">
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
                                label={material.label}
                              >
                                {renderMaterialOption(material)}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={24} md={8} style={{ overflow: 'visible' }}>
                        <Form.Item
                          name="quantity"
                          label={<span style={{ fontWeight: 500, color: theme.textPrimary }}>Quantity</span>}
                          initialValue={1}
                        >
                          <InputNumber 
                            min={1} 
                            style={{ width: '100%' }}
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    {selectedMaterialId && (
                      <div style={{ 
                        marginTop: '16px', 
                        marginBottom: '24px',
                        padding: '16px',
                        borderRadius: '8px',
                        background: '#ffffff',
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
                        </Row>
                      </div>
                    )}

                    <Form.Item style={{ marginTop: '16px', textAlign: 'center', marginBottom: '0' }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        disabled={isLoading || !uploadedFiles.female || !uploadedFiles.male || !uploadedFiles.part}
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
                      >
                        {isLoading ? `Processing... ${conversionProgress}%` : 'Analyze & Get Quote'}
                      </Button>
                    </Form.Item>

                    {isLoading && (
                      <div style={{ marginTop: '16px' }}>
                        <Progress 
                          percent={conversionProgress} 
                          status="active"
                          format={percent => `${percent}% Complete`}
                        />
                      </div>
                    )}
                  </Form>
                </div>
              </Card>
            </div>
            <div style={{ height: '16px' }}></div>
          </div>
        </Content>
      </Layout>

      {/* Add Material Modal */}
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
        bodyStyle={{
          padding: '20px',
          background: theme.lightBackground,
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
                  placeholder="e.g., Aluminum"
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
                  placeholder="e.g., 6061-T6"
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
                  </div>
                }
                rules={[
                  { required: true, message: 'Please enter density' },
                  { type: 'number', min: 0.1, message: 'Density must be greater than 0' }
                ]}
              >
                <InputNumber 
                  placeholder="e.g., 2700"
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
                  <span style={{ fontWeight: 500, color: theme.textPrimary }}>Material Cost (₹/kg)</span>
                }
                rules={[
                  { required: true, message: 'Please enter material cost' },
                  { type: 'number', min: 0, message: 'Material cost must be 0 or greater' }
                ]}
              >
                <InputNumber 
                  placeholder="e.g., 300.00"
                  size="large"
                  style={{ width: '100%', borderRadius: '6px' }}
                  min={0}
                  precision={2}
                />
              </Form.Item>
            </Col>
          </Row>

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
            >
              {isAddingMaterial ? 'Adding...' : 'Add Material'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default SheetMetalUploadPage;