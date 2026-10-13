import React, { useState, useRef, useEffect } from 'react';
import { Card, Typography, Row, Col, Divider, Statistic, Button, Input, Select, message, Modal } from 'antd';
import { toPng, toJpeg } from 'html-to-image';
import { Checkbox } from 'antd';
import jsPDF from 'jspdf';

const { Title, Text } = Typography;
const { Option } = Select;

const CostReport = ({ analysisData, theme, objUrl }) => {
  const [quantity, setQuantity] = useState(1);
  const [machineType, setMachineType] = useState('5 Axis');
  const [costData, setCostData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showMaterialCost, setShowMaterialCost] = useState(false);
  const [finishedProductWeight, setFinishedProductWeight] = useState(null);
  const [stockMass, setStockMass] = useState(null);


  const pdfRef = useRef();

  const machineTypes = [
    '3 Axis',
    '4 Axis',
    '5 Axis',
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
        material_cost_per_kg: result.material_cost_per_kg || prev.material_cost_per_kg,
        finished_product_weight: result.finished_product_weight || prev.finished_product_weight,
        stock_mass: result.stock_mass || prev.stock_mass

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

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value) || 1;
    setQuantity(newQuantity);
    updateQuantity(newQuantity);
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A';
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
    return `Rs.${numValue.toFixed(2)}`;
  };

  const formatVolume = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return parseFloat(value).toExponential(4);
  };

  const handleDownloadPDF = async () => {
    try {
      message.loading('Generating PDF report...', 0);

      const loadImageAsBase64 = (src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = this.width;
            canvas.height = this.height;
            ctx.drawImage(this, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          };
          img.onerror = reject;
          img.src = src;
        });
      };

      const safeString = (value) => {
        if (value === null || value === undefined) return 'N/A';
        return String(value);
      };

      let adaLogo = null;
      let companyLogo = null;

      try {
        adaLogo = await loadImageAsBase64('/ADA_LOGO1.png');
      } catch (error) {
        console.warn('Could not load ADA logo:', error);
      }

      try {
        companyLogo = await loadImageAsBase64('/kk.png');
      } catch (error) {
        console.warn('Could not load company logo:', error);
      }

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (2 * margin);

      // Header background - using same color as download button (theme.accent)
      pdf.setFillColor(20, 93, 160); // This is the #145da0 color
      pdf.rect(0, 10, pageWidth, 25, 'F');

      if (adaLogo) {
        pdf.addImage(adaLogo, 'JPEG', margin, 12, 20, 20);
      }

      if (companyLogo) {
        // Add white background with border for company logo
        pdf.setFillColor(255, 255, 255);
        pdf.setDrawColor(200, 200, 200);
        pdf.roundedRect(pageWidth - margin - 22, 12, 24, 18, 1, 1, 'FD');
        pdf.addImage(companyLogo, 'PNG', pageWidth - margin - 20, 13, 20, 16);
      }

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('COST ESTIMATION REPORT', pageWidth / 2, 25, { align: 'center' });

      let yPosition = 45;

      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Filename: ${safeString(costData?.filename || analysisData?.filename || 'N/A')}`, margin, yPosition);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, yPosition, { align: 'right' });

      yPosition += 15;

      const tableData = [];

      if (analysisData) {
        tableData.push(['', '']); // Empty row before section
        tableData.push(['MATERIAL DATA', '']); // New section header
        tableData.push(['Material', safeString(costData?.material || analysisData.material_name || 'N/A')]);
        tableData.push(['Density', analysisData.density ? `${safeString(analysisData.density)} kg/m³` : 'N/A']);

        if (analysisData.actual_dimensions) {
          tableData.push(['', '']);
          tableData.push(['FINAL COMPONENT ACTUAL DIMENSIONS', '']);

          tableData.push(['Volume (mm³)', safeString(analysisData.actual_dimensions.volume_mm3 || 'N/A')]);
        }

        if (analysisData.actual_dimensions) {
          tableData.push(['', '']);
          tableData.push(['BOUNDING BOX DIMENSIONS', '']);

          tableData.push(['Length', `${safeString(analysisData.actual_dimensions.length || 'N/A')} mm`]);
          tableData.push(['Breadth', `${safeString(analysisData.actual_dimensions.breadth || 'N/A')} mm`]);
          tableData.push(['Height', `${safeString(analysisData.actual_dimensions.height || 'N/A')} mm`]);
        }
      }

      tableData.push(['', '']);
      tableData.push(['MANUFACTURING SETTINGS', '']);
      tableData.push(['Machine Type', safeString(costData?.machine_type || machineType)]);
      tableData.push(['Quantity', safeString(quantity)]);

      if (costData) {
        tableData.push(['', '']);
        tableData.push(['COST SUMMARY', '']);
        tableData.push(['Machining Cost Per Unit', safeString(formatCurrency(costData.cost_per_unit))]);
        tableData.push(['Total Machining Cost', safeString(formatCurrency(costData.total_cost))]);

        if (costData.material_cost_per_kg) {
          tableData.push(['Material Cost per kg', `Rs.${parseFloat(costData.material_cost_per_kg).toFixed(2)}`]);
        }

        if (costData.stock_mass_kg) {
          tableData.push(['Stock Mass', `${parseFloat(costData.stock_mass_kg).toFixed(3)} kg`]);
        }

        if (costData.material_cost) {
          tableData.push(['Material Cost', safeString(formatCurrency(costData.material_cost))]);
        }

        if (costData.with_material_cost) {
          tableData.push(['Total Cost (with Material)', safeString(formatCurrency(costData.with_material_cost))]);
        }
      }

      const startY = yPosition;
      const rowHeight = 5;
      const col1Width = contentWidth * 0.6;
      const col2Width = contentWidth * 0.4;

      let currentY = startY;

      tableData.forEach((row, index) => {
        const [label, value] = row;

        const isSectionHeader = label && !value && (label.includes('DIMENSIONS') || label.includes('SETTINGS') || label.includes('SUMMARY') || label.includes('EXTRA'));
        const isEmptyRow = !label && !value;

        if (isEmptyRow) {
          currentY += rowHeight / 2;
          return;
        }

        const getBackgroundColor = (label) => {
          if (isSectionHeader) {
            return [156, 163, 175]; // Gray-400 for headers
          }
          // Different background colors for different sections
          if (label.includes('Volume') || label.includes('Length') || label.includes('Breadth') || label.includes('Height')) {
            return [240, 247, 255]; // Light blue for dimensions
          }
          if (label.includes('Machine') || label.includes('Quantity')) {
            return [255, 247, 237]; // Light orange for manufacturing
          }
          if (label.includes('Cost') || label.includes('Mass')) {
            return [246, 255, 237]; // Light green for cost
          }
          return [248, 248, 248]; // Default light gray
        };

        const bgColor = getBackgroundColor(label);
        pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
        pdf.rect(margin, currentY - 1, contentWidth, rowHeight, 'F');

        if (isSectionHeader) {
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(9);
          pdf.setTextColor(255, 255, 255);
        } else {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(8);
          pdf.setTextColor(0, 0, 0);
        }

        pdf.setDrawColor(200, 200, 200);
        pdf.rect(margin, currentY - 1, contentWidth, rowHeight);

        // Only draw vertical line if not in Material Data section
        if (!label.includes('MATERIAL DATA') && !(['Material', 'Density'].includes(label))) {
          pdf.line(margin + col1Width, currentY - 1, margin + col1Width, currentY + rowHeight - 1);
        }

        if (isSectionHeader) {
          // Left align section headers with slight padding
          pdf.text(safeString(label), margin + 4, currentY + 2.5);
        } else {
          pdf.text(safeString(label), margin + 2, currentY + 2.5);
          // Adjust text position for Material and Density rows
          const xPos = ['Material', 'Density'].includes(label) ?
            margin + contentWidth - pdf.getStringUnitWidth(safeString(value)) * 8 - 4 : // Right align in full width
            margin + col1Width + 2; // Normal position for other rows
          pdf.text(safeString(value), xPos, currentY + 2.5);
        }

        currentY += rowHeight;
      });

      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Report generated on ${new Date().toLocaleString()}`, margin, pageHeight - 10);

      message.destroy();

      const previewModal = Modal.confirm({
        title: 'PDF Preview',
        width: '80%',
        icon: null,
        content: (
          <div style={{ height: '70vh', overflow: 'hidden' }}>
            <iframe
              src={pdf.output('bloburl')}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: '8px'
              }}
              title="PDF Preview"
            />
          </div>
        ),
        okText: 'Download PDF',
        cancelText: 'Cancel',
        onOk: () => {
          const filename = `Cost_Report_${analysisData?.filename?.replace(/\.[^/.]+$/, '') || 'Model'}_${new Date().getTime()}.pdf`;
          pdf.save(filename);
          message.success('PDF report downloaded successfully!');
        },
        onCancel: () => {
        }
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      message.destroy();
      message.error('Failed to generate PDF report');
    }
  };

  useEffect(() => {
    if (analysisData && machineType) {
      calculateCost();
    }
  }, [analysisData, machineType]);

  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: theme.primary, fontSize: '18px', fontWeight: 600 }}>
            Manufacturing Cost Report
          </span>
          <div ref={pdfRef}>
            <Button
              type="primary"
              onClick={handleDownloadPDF}
              style={{ borderRadius: '6px', height: '40px', fontWeight: 500, backgroundColor: '#246679' }}
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
            <Row gutter={[24, 0]} style={{ marginBottom: '24px' }}>
              <Col span={12}>
                <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
                  File Information
                </Title>
                <div style={{ marginBottom: '12px' }}>
                  <Text style={{ color: theme.textSecondary }}>Filename:</Text>
                  <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
                    {costData?.filename || analysisData.filename || 'N/A'}
                  </div>
                </div>
              </Col>
              <Col span={12}>
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
              </Col>
            </Row>
            {/* <Divider style={{ margin: '20px 0', borderColor: theme.borderColor }} /> */}

            {/* Material Information */}
            {/* <div style={{ marginBottom: '24px' }}>
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
            </div> */}

            {/* <Divider style={{ margin: '20px 0', borderColor: theme.borderColor }} /> */}

            {/* Model Dimensions */}
            <div style={{ marginBottom: '24px' }}>
              <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
                Model Dimensions
              </Title>

              <Row gutter={[16, 16]}>
                {/* Final Component Actual Dimensions - Left Side */}
                <Col span={12}>
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400" style={{
                    background: '#f0f9ff',
                    padding: '16px',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${theme.primary}`,
                    height: '100%'
                  }}>
                    <h3 style={{
                      color: theme.primary,
                      fontWeight: 600,
                      marginBottom: '12px',
                      fontSize: '14px'
                    }}>
                      FINAL COMPONENT ACTUAL DIMENSIONS
                    </h3>

                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ color: theme.textSecondary }}>Volume (mm³):</span>
                      <div style={{
                        fontWeight: 600,
                        fontSize: '16px',
                        color: theme.textPrimary,
                        marginTop: '4px'
                      }}>
                        {analysisData.actual_dimensions?.volume_mm3 || 'N/A'}
                      </div>
                      <span style={{ color: theme.textSecondary }}>Finished Product Weight:</span>
                      <div style={{
                        fontWeight: 600,
                        fontSize: '16px',
                        color: theme.textPrimary,
                        marginTop: '4px'
                      }}>
                        {costData?.finished_product_weight ? `${costData.finished_product_weight} kg` : 'N/A'}
                      </div>
                    </div>

                    <h4 style={{
                      color: theme.primary,
                      fontWeight: 600,
                      marginBottom: '12px',
                      fontSize: '13px'
                    }}>
                      BOUNDING BOX DIMENSIONS
                    </h4>

                    {/* Horizontal Layout for Dimensions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Length:</span>
                        <div style={{ fontWeight: 500, color: theme.textPrimary }}>
                          {analysisData.actual_dimensions?.length ? `${analysisData.actual_dimensions.length} mm` : 'N/A'}
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Breadth:</span>
                        <div style={{ fontWeight: 500, color: theme.textPrimary }}>
                          {analysisData.actual_dimensions?.breadth ? `${analysisData.actual_dimensions.breadth} mm` : 'N/A'}
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Thickness:</span>
                        <div style={{ fontWeight: 500, color: theme.textPrimary }}>
                          {analysisData.actual_dimensions?.height ? `${analysisData.actual_dimensions.height} mm` : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>

                {/* Stock Dimensions - Right Side */}
                <Col span={12}>
                  <div style={{
                    background: '#f6ffed',
                    padding: '16px',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${theme.success}`,
                    height: '100%'
                  }}>
                    <Text strong style={{
                      color: theme.success,
                      fontSize: '14px',
                      marginBottom: '12px',
                      display: 'block',
                      fontWeight: 600
                    }}>
                      STOCK DIMENSIONS
                    </Text>

                    <div style={{ marginBottom: '16px' }}>
                      <Text style={{ color: theme.textSecondary }}>Volume (mm³):</Text>
                      <div style={{
                        fontWeight: 600,
                        fontSize: '16px',
                        color: theme.textPrimary,
                        marginTop: '4px'
                      }}>
                        {analysisData.stock_dimensions?.volume_mm3 || 'N/A'}
                      </div>
                      <Text style={{ color: theme.textSecondary }}>Stock Mass:</Text>
                      <div style={{
                        fontWeight: 600,
                        fontSize: '16px',
                        color: theme.textPrimary,
                        marginTop: '4px'
                      }}>
                        {costData?.stock_mass ? `${costData.stock_mass} kg` : 'N/A'}
                      </div>
                    </div>

                    <Text strong style={{
                      color: theme.success,
                      fontSize: '13px',
                      marginBottom: '12px',
                      display: 'block',
                      fontWeight: 600
                    }}>
                      RECOMMENDED BOUNDING BOX DIMENSIONS
                    </Text>

                    {/* Horizontal Layout for Stock Dimensions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Length:</span>
                        <div style={{ fontWeight: 500, color: theme.textPrimary }}>
                          {analysisData.stock_dimensions?.length ? `${analysisData.stock_dimensions.length} mm` : 'N/A'}
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Breadth:</span>
                        <div style={{ fontWeight: 500, color: theme.textPrimary }}>
                          {analysisData.stock_dimensions?.breadth ? `${analysisData.stock_dimensions.breadth} mm` : 'N/A'}
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Thickness:</span>
                        <div style={{ fontWeight: 500, color: theme.textPrimary }}>
                          {analysisData.stock_dimensions?.height ? `${analysisData.stock_dimensions.height} mm` : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            {/* <Divider style={{ margin: '20px 0', borderColor: theme.borderColor }} /> */}

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

            {/* <Divider style={{ margin: '20px 0', borderColor: theme.borderColor }} /> */}

            {/* Cost Summary */}
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
                  {/* Main Cost Row - Machining Cost Per Unit and Total Machining Cost side by side */}
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <div style={{
                        padding: '12px',
                        background: `${theme.lightBlue}66`,
                        borderRadius: '8px',
                        border: `1px solid ${theme.primary}22`
                      }}>
                        <Statistic
                          title={<span style={{ color: theme.textSecondary }}>Machining Cost Per Unit</span>}
                          value={formatCurrency(costData.cost_per_unit)}
                          valueStyle={{ color: theme.primary, fontWeight: 600, fontSize: '18px' }}
                        />
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{
                        padding: '12px',
                        background: '#f6ffed66',
                        borderRadius: '8px',
                        border: `1px solid ${theme.success}22`
                      }}>
                        <Statistic
                          title={<span style={{ color: theme.textSecondary }}>Total Machining Cost</span>}
                          value={formatCurrency(costData.total_cost)}
                          valueStyle={{ color: theme.success, fontWeight: 600, fontSize: '18px' }}
                        />
                      </div>
                    </Col>
                  </Row>

                  {/* Material Cost Checkbox */}
                  <div style={{ marginTop: '20px', marginBottom: '16px' }}>
                    <Checkbox
                      checked={showMaterialCost}
                      onChange={(e) => {
                        setShowMaterialCost(e.target.checked);
                        if (e.target.checked) {
                          updateMaterialCost();
                        }
                      }}
                      style={{
                        fontSize: '14px',
                        color: theme.textPrimary,
                        fontWeight: 500
                      }}
                    >
                      Include Material Cost
                    </Checkbox>
                  </div>

                  {/* Material Cost Related Sections - Show only when checkbox is checked */}
                  {showMaterialCost && (
                    <Row gutter={[16, 16]}>
                      {costData.material_cost && (
                        <Col span={12}>
                          <div style={{
                            padding: '12px',
                            background: '#fff7e666',
                            borderRadius: '8px',
                            border: `1px solid ${theme.warning}22`
                          }}>
                            <Statistic
                              title={<span style={{ color: theme.textSecondary }}>Material Cost</span>}
                              value={formatCurrency(costData.material_cost)}
                              valueStyle={{ color: theme.warning, fontWeight: 600, fontSize: '16px' }}
                            />
                          </div>
                        </Col>
                      )}
                      {costData.with_material_cost && (
                        <Col span={12}>
                          <div style={{
                            padding: '12px',
                            background: '#e6f7ff66',
                            borderRadius: '8px',
                            border: `1px solid ${theme.primary}22`
                          }}>
                            <Statistic
                              title={<span style={{ color: theme.textSecondary }}>Total with Material Cost</span>}
                              value={formatCurrency(costData.with_material_cost)}
                              valueStyle={{ color: theme.primary, fontWeight: 600, fontSize: '18px' }}
                            />
                          </div>
                        </Col>
                      )}
                    </Row>
                  )}
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
  );
};

export default CostReport;




