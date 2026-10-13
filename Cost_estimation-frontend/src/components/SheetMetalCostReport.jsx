// ===== AnalysisCostData.jsx =====
import React, { useState } from 'react';
import { Card, Button, Tabs, Typography, Row, Col, Input, Select, Modal, message } from 'antd';
import { DownloadOutlined, SaveOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';

const { Text, Title } = Typography;
const { Option } = Select;

const theme = {
  primary: '#246679',
  secondary: '#73b6ca',
  background: '#f0f2f5',
  cardBg: '#ffffff',
  textPrimary: '#000000',
  textSecondary: '#666666',
  borderColor: '#d9d9d9',
  shadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
};

function AnalysisCostData({
  calculationData,
  updatedCalculationData,
  stockDimensions,
  setStockDimensions,
  quantity,
  setQuantity,
  selectedMachine,
  machineRates,
  isUpdatingCost,
  isUpdatingQuantity,
  isUpdatingDimensions,
  activeModel,
  handleQuantityUpdate,
  handleUpdateDimensions,
  handleMachineChange,
  captureIsometricView,
}) {
  const displayData = updatedCalculationData || calculationData;

  const handleDimensionChange = (field, value) => {
    setStockDimensions(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const cancelEditingDimensions = () => {
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
  };

  const loadImageAsBase64 = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function() {
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

  const formatCurrencyForPDF = (value) => {
    if (value === null || value === undefined) return 'N/A';
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
    if (isNaN(numValue)) return 'N/A';
    return `Rs.${numValue.toFixed(3)}`;
  };

  const generatePdfReport = async () => {
    try {
      message.loading('Generating PDF report...', 0);

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

      pdf.setFont('georgia', 'normal');

      pdf.setFillColor(20, 93, 160);
      pdf.rect(0, 10, pageWidth, 25, 'F');
      
      if (adaLogo) {
        pdf.addImage(adaLogo, 'JPEG', margin, 12, 20, 20);
      }
      
      if (companyLogo) {
        pdf.setFillColor(255, 255, 255);
        pdf.setDrawColor(200, 200, 200);
        pdf.roundedRect(pageWidth - margin - 22, 12, 24, 18, 1, 1, 'FD');
        pdf.addImage(companyLogo, 'PNG', pageWidth - margin - 20, 13, 20, 16);
      }

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(22);
      pdf.setFont('georgia', 'bold');
      pdf.text('COST ESTIMATION REPORT', pageWidth / 2, 25, { align: 'center' });
      
      let yPosition = 45;

      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.setFont('times', 'bold');
      pdf.text(`Filename: ${safeString(displayData?.classification?.part?.filename || 'Sheet Metal Part')}`, margin, yPosition);
      pdf.setFontSize(10);
      pdf.setFont('times', 'normal');
      pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, yPosition, { align: 'right' });
      
      yPosition += 15;

      const modelScreenshot = await captureIsometricView();
 
      if (modelScreenshot) {
        const imgWidth = contentWidth * 0.6;
        const imgHeight = imgWidth * 0.6;
        const imgX = margin + (contentWidth - imgWidth) / 2;
        
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(1);
        pdf.rect(imgX - 2, yPosition - 2, imgWidth + 4, imgHeight + 4);
        
        pdf.addImage(modelScreenshot, 'PNG', imgX, yPosition, imgWidth, imgHeight);
        
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.setFont('georgia', 'normal');
        pdf.text('3D Model View', pageWidth / 2, yPosition + imgHeight + 10, { align: 'center' });
        
        yPosition += imgHeight + 20;
      } else {
        const imgWidth = contentWidth * 0.6;
        const imgHeight = imgWidth * 0.6;
        const imgX = margin + (contentWidth - imgWidth) / 2;
        
        pdf.setFillColor(240, 240, 240);
        pdf.setDrawColor(200, 200, 200);
        pdf.rect(imgX, yPosition, imgWidth, imgHeight, 'FD');
        
        pdf.setFontSize(14);
        pdf.setTextColor(150, 150, 150);
        pdf.setFont('georgia', 'normal');
        pdf.text('3D Model Preview', pageWidth / 2, yPosition + imgHeight / 2, { align: 'center' });
        pdf.text('(Screenshot not available)', pageWidth / 2, yPosition + imgHeight / 2 + 10, { align: 'center' });
        
        yPosition += imgHeight + 20;
      }

      yPosition += 1;
      const tableData = [];

      const femaleMaterialCost = (
        (stockDimensions.female_stock_length * stockDimensions.female_stock_breadth * stockDimensions.female_stock_height * 
        0.000000001) * 
        (displayData?.material?.density || 0) *
        (displayData?.material?.cost || 0)
      );

      const maleMaterialCost = (
        (stockDimensions.male_stock_length * stockDimensions.male_stock_breadth * stockDimensions.male_stock_height * 
        0.000000001) * 
        (displayData?.material?.density || 0) *
        (displayData?.material?.cost || 0)
      );

      tableData.push(['', '']);
      tableData.push(['MODULE: Sheet Metal Module', '']);
      tableData.push(['MATERIAL DATA', '']);
      tableData.push(['Material', safeString(displayData?.material?.name || 'N/A')]);
      tableData.push(['Density', displayData?.material?.density ? `${safeString(displayData.material.density)} kg/m³` : 'N/A']);
      tableData.push(['Cost per kg', displayData?.material?.cost ? `Rs.${displayData.material.cost.toFixed(3)}` : 'N/A']);
      tableData.push(['', '']);
      tableData.push(['MANUFACTURING SETTINGS', '']);
      tableData.push(['Selected Machine', safeString(selectedMachine || 'N/A')]);
      tableData.push(['Quantity', safeString(quantity)]);

      if (displayData?.classification?.female_tool) {
        tableData.push(['', '']);
        tableData.push(['FEMALE TOOL DATA', '']);
        tableData.push(['Filename', safeString(displayData.classification.female_tool.filename || 'N/A')]);
        tableData.push(['Actual Dimensions', `${displayData.classification.female_tool.actual_dimensions?.length?.toFixed(2) || '0'} × ${displayData.classification.female_tool.actual_dimensions?.breadth?.toFixed(2) || '0'} × ${displayData.classification.female_tool.actual_dimensions?.height?.toFixed(2) || '0'} mm`]);
        tableData.push(['Actual Volume', safeString(displayData.classification.female_tool.actual_dimensions?.volume_mm3?.toLocaleString() || '0') + ' mm³']);
        tableData.push(['Stock Dimensions', `${stockDimensions.female_stock_length} × ${stockDimensions.female_stock_breadth} × ${stockDimensions.female_stock_height} mm`]);
        tableData.push(['Stock Volume', safeString((stockDimensions.female_stock_length * stockDimensions.female_stock_breadth * stockDimensions.female_stock_height).toLocaleString()) + ' mm³']);
      }

      if (displayData?.classification?.male_tool) {
        tableData.push(['', '']);
        tableData.push(['MALE TOOL DATA', '']);
        tableData.push(['Filename', safeString(displayData.classification.male_tool.filename || 'N/A')]);
        tableData.push(['Actual Dimensions', `${displayData.classification.male_tool.actual_dimensions?.length?.toFixed(2) || '0'} × ${displayData.classification.male_tool.actual_dimensions?.breadth?.toFixed(2) || '0'} × ${displayData.classification.male_tool.actual_dimensions?.height?.toFixed(2) || '0'} mm`]);
        tableData.push(['Actual Volume', safeString(displayData.classification.male_tool.actual_dimensions?.volume_mm3?.toLocaleString() || '0') + ' mm³']);
        tableData.push(['Stock Dimensions', `${stockDimensions.male_stock_length} × ${stockDimensions.male_stock_breadth} × ${stockDimensions.male_stock_height} mm`]);
        tableData.push(['Stock Volume', safeString((stockDimensions.male_stock_length * stockDimensions.male_stock_breadth * stockDimensions.male_stock_height).toLocaleString()) + ' mm³']);
      }

      if (displayData?.classification?.part) {
        tableData.push(['', '']);
        tableData.push(['PART DATA', '']);
        tableData.push(['Filename', safeString(displayData.classification.part.filename || 'N/A')]);
        tableData.push(['Actual Dimensions', `${displayData.classification.part.actual_dimensions?.length?.toFixed(2) || '0'} × ${displayData.classification.part.actual_dimensions?.breadth?.toFixed(2) || '0'} × ${displayData.classification.part.actual_dimensions?.height?.toFixed(2) || '0'} mm`]);
        tableData.push(['Actual Volume', safeString(displayData.classification.part.actual_dimensions?.volume_mm3?.toLocaleString() || '0') + ' mm³']);
        tableData.push(['Mass', displayData.classification.part.actual_dimensions?.volume_m3 ? `${(displayData.classification.part.actual_dimensions.volume_m3 * (displayData?.material?.density || 0))?.toFixed(4)} kg` : 'N/A']);
      }

      if (displayData) {
        tableData.push(['', '']);
        tableData.push(['COST SUMMARY', '']);
        tableData.push(['Total Design Cost', formatCurrencyForPDF(displayData.tool_design?.total_design_cost)]);
        tableData.push([null, null]);
        tableData.push(['FEMALE TOOL COST', '']);
        tableData.push(['Material Cost', formatCurrencyForPDF(femaleMaterialCost)]);
        tableData.push(['Manufacturing Cost', formatCurrencyForPDF(displayData.classification?.female_tool?.manufacturing_cost)]);
        tableData.push(['', '']);
        tableData.push(['MALE TOOL COST', '']);
        tableData.push(['Material Cost', formatCurrencyForPDF(maleMaterialCost)]);
        tableData.push(['Manufacturing Cost', formatCurrencyForPDF(displayData.classification?.male_tool?.manufacturing_cost)]);
        tableData.push(['', '']);
        tableData.push(['PART FORMING COST', '']);
        tableData.push(['Part Forming Cost', formatCurrencyForPDF(displayData.part_forming?.part_forming_cost)]);
        tableData.push(['Part Forming Cost Per Unit', formatCurrencyForPDF(displayData.part_forming?.part_forming_cost_per_unit)]);
        tableData.push(['', '']);
        tableData.push(['TOTAL COSTS', '']);
        tableData.push(['Total Cost', formatCurrencyForPDF(displayData.total_cost)]);
        tableData.push(['Total Cost Per Unit', formatCurrencyForPDF(displayData.total_cost_per_unit)]);
      }

      const startY = yPosition;
      const rowHeight = 5;
      const col1Width = contentWidth * 0.55;
      const bottomMargin = 15;
      let currentY = startY;
      
      tableData.forEach((row) => {
        const [label, value] = row;

        const isSectionHeader = label && !value && (label.includes('DATA') || label.includes('SETTINGS') || label.includes('SUMMARY') || label.includes('COST') || label.includes('MODULE:') || label.includes('MATERIAL'));
        const isEmptyRow = !label && !value;
        const isSubSection = label && !value && (label.includes('TOOL') || label.includes('FORMING') || label.includes('TOTAL'));
        
        if (isEmptyRow) {
          currentY += rowHeight / 2;
          return;
        }

        if (currentY + rowHeight + bottomMargin > pageHeight) {
          pdf.addPage();
          currentY = margin;
        }

        const getBackgroundColor = (label) => {
          if (isSectionHeader) return [41, 128, 185];
          if (isSubSection) return [52, 152, 219];
          if (label.includes('Material') || label.includes('Density') || label.includes('Cost per kg')) return [217, 237, 247];
          if (label.includes('Machine') || label.includes('Quantity') || label.includes('Selected')) return [236, 236, 236];
          if (label.includes('Cost') || label.includes('Volume') || label.includes('Dimensions') || label.includes('Mass') || label.includes('Filename')) return [245, 245, 245];
          return [255, 255, 255];
        };

        const bgColor = getBackgroundColor(label);
        pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
        pdf.rect(margin, currentY - 1, contentWidth, rowHeight, 'F');

        if (isSectionHeader || isSubSection) {
          pdf.setFont('georgia', 'bold');
          pdf.setFontSize(isSectionHeader ? 9 : 8);
          pdf.setTextColor(255, 255, 255);
        } else {
          pdf.setFont('georgia', 'normal');
          pdf.setFontSize(8);
          pdf.setTextColor(0, 0, 0);
        }
        
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.15);
        pdf.rect(margin, currentY - 1, contentWidth, rowHeight);

        if (!isSectionHeader && !isSubSection) {
          pdf.line(margin + col1Width, currentY - 1, margin + col1Width, currentY + rowHeight - 1);
        }
        
        if (isSectionHeader || isSubSection) {
          pdf.text(safeString(label), margin + 2, currentY + 2.5);
        } else {
          let displayLabel = safeString(label);
          if (displayLabel.length > 35) {
            displayLabel = displayLabel.substring(0, 32) + '...';
          }
          pdf.text(displayLabel, margin + 2, currentY + 2.5);
          
          const isCostValue = (label.includes('Cost') || label.includes('Price')) && !label.includes('DATA') && !label.includes('SUMMARY');
          
          if (isCostValue) {
            const valueStr = safeString(value);
            pdf.text(valueStr, margin + contentWidth - 2, currentY + 2.5, { align: 'right' });
          } else {
            let displayValue = safeString(value);
            if (displayValue.length > 30) {
              displayValue = displayValue.substring(0, 28) + '..';
            }
            pdf.text(displayValue, margin + col1Width + 2, currentY + 2.5);
          }
        }
        
        currentY += rowHeight;
      });

      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.setFont('georgia', 'normal');
      pdf.text(`Report generated on ${new Date().toLocaleString()}`, margin, pageHeight - 10);
      
      message.destroy();
      
      Modal.confirm({
        title: 'PDF Preview - Cost Estimation Report',
        width: '80%',
        icon: null,
        content: (
          <div style={{ height: '70vh', overflowY: 'auto' }}>
            <iframe 
              src={pdf.output('bloburl')} 
              style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px' }}
              title="PDF Preview"
            />
          </div>
        ),
        okText: 'Download PDF',
        cancelText: 'Cancel',
        onOk: () => {
          const filename = `SheetMetal_Cost_Report_${displayData?.classification?.part?.filename?.replace(/\.[^/.]+$/, '') || 'Model'}_${new Date().getTime()}.pdf`;
          pdf.save(filename);
          message.success('PDF report downloaded successfully!');
        }
      });
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      message.destroy();
      message.error('Failed to generate PDF report');
    }
  };

  const renderToolDetails = (toolData, toolType) => {
    if (!toolData) return null;

    const currentDimensions = toolType === 'female' ? {
      length: stockDimensions.female_stock_length,
      breadth: stockDimensions.female_stock_breadth,
      height: stockDimensions.female_stock_height
    } : {
      length: stockDimensions.male_stock_length,
      breadth: stockDimensions.male_stock_breadth,
      height: stockDimensions.male_stock_height
    };

    const materialCost = (
      (currentDimensions.length * currentDimensions.breadth * currentDimensions.height * 0.000000001) * 
      (displayData?.material?.density || 0) *
      (displayData?.material?.cost || 0)
    );

    return (
      <div style={{ fontSize: '12px' }}>
        <div style={{ marginBottom: '12px' }}>
          <Text strong>Filename:</Text> {toolData.filename}
        </div>
        
        <Row gutter={8} style={{ marginBottom: '12px' }}>
          <Col span={12}>
            <div style={{ padding: '12px', background: '#e6f7ff66', border: `1px solid ${theme.primary}22`, borderRadius: '6px', height: '100%' }}>
              <Text strong style={{ display: 'block', marginBottom: '8px', color: '#0050b3', fontSize: '13px' }}>ACTUAL DIMENSIONS</Text>
              <Row gutter={8} style={{ marginBottom: '8px' }}>
                <Col span={8}>
                  <Text style={{ fontSize: '15px', display: 'block' }}>Length:</Text>
                  <Text strong style={{ fontSize: '14px' }}>{toolData.actual_dimensions?.length?.toFixed(2)} mm</Text>
                </Col>
                <Col span={8}>
                  <Text style={{ fontSize: '15px', display: 'block' }}>Breadth:</Text>
                  <Text strong style={{ fontSize: '14px' }}>{toolData.actual_dimensions?.breadth?.toFixed(2)} mm</Text>
                </Col>
                <Col span={8}>
                  <Text style={{ fontSize: '15px', display: 'block' }}>Height:</Text>
                  <Text strong style={{ fontSize: '14px' }}>{toolData.actual_dimensions?.height?.toFixed(2)} mm</Text>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={12}>
                  <Text style={{ fontSize: '15px', display: 'block' }}>Volume:</Text>
                  <Text strong style={{ fontSize: '14px' }}>{toolData.actual_dimensions?.volume_mm3?.toLocaleString()} mm³</Text>
                </Col>
                <Col span={12}>
                  <Text style={{ fontSize: '15px', display: 'block' }}>Mass:</Text>
                  <Text strong style={{ fontSize: '14px' }}>{(toolData.actual_dimensions?.volume_m3 * (displayData?.material?.density || 0))?.toFixed(4)} kg</Text>
                </Col>
              </Row>
            </div>
          </Col>

          <Col span={12}>
            <div style={{ padding: '12px', background: '#f6ffed', borderRadius: '6px', height: '100%', border: '1px solid #a7f3d0', position: 'relative' }}>
              <Text strong style={{ display: 'block', marginBottom: '8px', color: '#22c55e', fontSize: '13px' }}>STOCK DIMENSIONS</Text>
              <Row gutter={8} style={{ marginBottom: '8px' }}>
                <Col span={8}>
                  <Text style={{ fontSize: '15px', display: 'block' }}>Length:</Text>
                  <Input type="number" value={currentDimensions.length} onChange={(e) => handleDimensionChange(toolType === 'female' ? 'female_stock_length' : 'male_stock_length', e.target.value)} size="small" style={{ fontSize: '14px', fontWeight: 'bold' }} />
                </Col>
                <Col span={8}>
                  <Text style={{ fontSize: '15px', display: 'block' }}>Breadth:</Text>
                  <Input type="number" value={currentDimensions.breadth} onChange={(e) => handleDimensionChange(toolType === 'female' ? 'female_stock_breadth' : 'male_stock_breadth', e.target.value)} size="small" style={{ fontSize: '14px', fontWeight: 'bold' }} />
                </Col>
                <Col span={8}>
                  <Text style={{ fontSize: '15px', display: 'block' }}>Height:</Text>
                  <Input type="number" value={currentDimensions.height} onChange={(e) => handleDimensionChange(toolType === 'female' ? 'female_stock_height' : 'male_stock_height', e.target.value)} size="small" style={{ fontSize: '14px', fontWeight: 'bold' }} />
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={12}>
                  <Text style={{ fontSize: '15px', display: 'block' }}>Volume:</Text>
                  <Text strong style={{ fontSize: '14px' }}>{(currentDimensions.length * currentDimensions.breadth * currentDimensions.height)?.toLocaleString()} mm³</Text>
                </Col>
                <Col span={12}>
                  <Text style={{ fontSize: '15px', display: 'block' }}>Mass:</Text>
                  <Text strong style={{ fontSize: '14px' }}>{((currentDimensions.length * currentDimensions.breadth * currentDimensions.height * 0.000000001) * (displayData?.material?.density || 0))?.toFixed(4)} kg</Text>
                </Col>
              </Row>
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <Button size="small" onClick={cancelEditingDimensions}>Cancel</Button>
                <Button type="primary" size="small" icon={<SaveOutlined />} loading={isUpdatingDimensions} onClick={handleUpdateDimensions}>Update</Button>
              </div>
            </div>
          </Col>
        </Row>

        <Row gutter={8} style={{ marginBottom: '8px' }}>
          <Col span={24}>
            <div style={{ padding: '10px', background: '#fff2e666', borderRadius: '6px', marginBottom: '8px', border: `1px solid #fa8c1622` }}>
              <Text strong style={{ fontSize: '15px', color: 'black' }}>Total tool Design Cost:</Text>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>₹{displayData?.tool_design?.total_design_cost?.toFixed(2)}</div>
            </div>
          </Col>
        </Row>

        <Row gutter={8} style={{ marginBottom: '8px' }}>
          <Col span={12}>
            <div style={{ padding: '10px', background: '#e6f7ff66', borderRadius: '6px', border: `1px solid ${theme.primary}22` }}>
              <Text strong style={{ fontSize: '15px', color: 'black' }}>Manufacturing Cost:</Text>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>₹{toolData.manufacturing_cost?.toFixed(2)}</div>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ padding: '10px', background: '#e6f7ff66', borderRadius: '6px', border: `1px solid ${theme.primary}22` }}>
              <Text strong style={{ fontSize: '15px', color: 'black' }}>Material Cost:</Text>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>₹{materialCost?.toFixed(2)}</div>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <span style={{ color: theme.primary, fontSize: '16px', fontWeight: 600 }}>Analysis & Cost Data</span>
          <Button type="primary" icon={<DownloadOutlined />} onClick={generatePdfReport} style={{ background: theme.primary, borderColor: theme.primary, color: '#fff', fontWeight: 'bold', borderRadius: '6px' }}>Download PDF Report</Button>
        </div>
      }
      style={{ height: '100%', boxShadow: theme.shadow, borderRadius: '8px', background: theme.cardBg, border: `1px solid ${theme.borderColor}`, overflow: 'hidden' }}
      bodyStyle={{ padding: '1px', height: 'calc(100% - 50px)', overflow: 'auto' }}
    >
      {displayData ? (
        <div style={{ padding: '10px' }}>
          <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: `1px solid ${theme.borderColor}` }}>
            <Text style={{ fontSize: '12px', color: theme.textSecondary, fontWeight: '500' }}>MATERIAL</Text>
            <Title level={4} style={{ margin: '8px 0 0' }}>{displayData.material?.name}</Title>
            <Text style={{ fontSize: '12px', color: theme.textSecondary }}>Density: {displayData.material?.density} kg/m³</Text>
            <br />
            <Text style={{ fontSize: '12px', color: theme.textSecondary }}>Cost: ₹{displayData.material?.cost}/kg</Text>
          </div>

          <Row gutter={16} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: `1px solid ${theme.borderColor}` }}>
            <Col span={12}>
              <Text style={{ fontSize: '12px', color: theme.textSecondary, fontWeight: '500', display: 'block', marginBottom: '8px' }}>MACHINE TYPE</Text>
              {/* <Select placeholder="Select machine type" style={{ width: '100%' }} onChange={handleMachineChange} value={selectedMachine} loading={isUpdatingCost}>
                {machineRates.map((rate) => (
                  <Option key={`${rate.machine_type}-${rate.size}`} value={`${rate.machine_type}-${rate.size}`}>{rate.machine_type} - {rate.size} (₹{rate.hourly_rate}/hr)</Option>
                ))}
              </Select> */}
              <Select
  value={selectedMachine}
  onChange={handleMachineChange}
  style={{ width: '100%' }}
  placeholder="Select machine type"
  disabled={isUpdatingCost}
>
  {machineRates.map((rate) => {
    const key = `${rate.machine_type.trim()}-${rate.size.trim()}`;
    return (
      <Select.Option key={key} value={key}>
        {rate.machine_type} - {rate.size} (₹{rate.rate}/hr)
      </Select.Option>
    );
  })}
</Select>
            </Col>
            
            <Col span={12}>
              <Text style={{ fontSize: '12px', color: theme.textSecondary, fontWeight: '500', display: 'block', marginBottom: '8px' }}>QUANTITY</Text>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Input type="number" min={1} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} style={{ flex: 1 }} placeholder="Enter quantity" />
                <Button type="primary" loading={isUpdatingQuantity} onClick={handleQuantityUpdate} style={{ background: theme.primary, borderColor: theme.primary }}>Update</Button>
              </div>
            </Col>
          </Row>

          <Tabs defaultActiveKey="female">
            <Tabs.TabPane tab="Female Tool" key="female">
              {renderToolDetails(displayData.classification?.female_tool, 'female')}
            </Tabs.TabPane>

            <Tabs.TabPane tab="Male Tool" key="male">
              {renderToolDetails(displayData.classification?.male_tool, 'male')}
            </Tabs.TabPane>

            <Tabs.TabPane tab="Part" key="part">
              <div style={{ fontSize: '12px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <Text strong style={{ fontSize: '13px' }}>Filename:</Text> 
                  <Text style={{ fontSize: '13px' }}> {displayData.classification?.part?.filename}</Text>
                </div>
                
                <div style={{ marginTop: '25px', padding: '12px', background: '#e6f7ff66', border: `1px solid ${theme.primary}22`, borderRadius: '6px' }}>
                  <Text strong style={{ display: 'block', marginBottom: '8px', color: '#0050b3', fontSize: '13px' }}>ACTUAL DIMENSIONS</Text>
                  <Row gutter={8} style={{ marginBottom: '8px' }}>
                    <Col span={8}>
                      <Text style={{ fontSize: '15px', display: 'block' }}>Length:</Text>
                      <Text strong style={{ fontSize: '14px' }}>{displayData.classification?.part?.actual_dimensions?.length?.toFixed(2)} mm</Text>
                    </Col>
                    <Col span={8}>
                      <Text style={{ fontSize: '15px', display: 'block' }}>Breadth:</Text>
                      <Text strong style={{ fontSize: '14px' }}>{displayData.classification?.part?.actual_dimensions?.breadth?.toFixed(2)} mm</Text>
                    </Col>
                    <Col span={8}>
                      <Text style={{ fontSize: '15px', display: 'block' }}>Height:</Text>
                      <Text strong style={{ fontSize: '14px' }}>{displayData.classification?.part?.actual_dimensions?.height?.toFixed(2)} mm</Text>
                    </Col>
                  </Row>
                  
                  <Row gutter={8}>
                    <Col span={12}>
                      <Text style={{ fontSize: '15px', display: 'block' }}>Volume:</Text>
                      <Text strong style={{ fontSize: '14px' }}>{displayData.classification?.part?.actual_dimensions?.volume_mm3?.toLocaleString()} mm³</Text>
                    </Col>
                    {displayData.classification?.part?.actual_dimensions?.volume_m3 && (
                      <Col span={12}>
                        <Text style={{ fontSize: '15px', display: 'block' }}>Mass:</Text>
                        <Text strong style={{ fontSize: '14px' }}>{(displayData.classification?.part?.actual_dimensions?.volume_m3 * (displayData?.material?.density || 0))?.toFixed(4)} kg</Text>
                      </Col>
                    )}
                  </Row>
                </div>

                <Row gutter={8} style={{ marginTop: '25px' }}>
                  <Col span={12}>
                    <div style={{ padding: '10px', background: '#e6f7ff66', border: `1px solid ${theme.primary}22`, borderRadius: '6px' }}>
                      <Text strong style={{ fontSize: '15px', color: 'black' }}>Part Forming Cost:</Text>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>₹{displayData.part_forming?.part_forming_cost?.toFixed(2)}</div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ padding: '10px', background: '#e6f7ff66', border: `1px solid ${theme.primary}22`, borderRadius: '6px' }}>
                      <Text strong style={{ fontSize: '15px', color: 'black' }}>Part Forming Cost Per Unit:</Text>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>₹{displayData.part_forming?.part_forming_cost_per_unit?.toFixed(2)}</div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Tabs.TabPane>

            <Tabs.TabPane tab="Cost Breakdown" key="costs">
              <div style={{ fontSize: '12px' }}>
                <div style={{ marginBottom: '12px', padding: '12px', background: '#e6f7ff66', border: `1px solid ${theme.primary}22`, borderRadius: '6px' }}>
                  <Text strong style={{ fontSize: '15px', color: 'black' }}>Total Design Cost:</Text>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>₹{displayData.tool_design?.total_design_cost?.toFixed(2)}</div>
                </div>

                <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: `1px solid ${theme.borderColor}` }}>
                  <Text strong style={{ display: 'block', marginBottom: '8px', color: theme.primary }}>FEMALE TOOL</Text>
                  <Row gutter={8} style={{ marginBottom: '8px' }}>
                    <Col span={12}>
                      <div style={{ padding: '10px', background: '#e6f7ff66', border: `1px solid ${theme.primary}22`, borderRadius: '6px' }}>
                        <Text strong style={{ fontSize: '15px', color: 'black' }}>Material Cost:</Text>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>₹{((stockDimensions.female_stock_length * stockDimensions.female_stock_breadth * stockDimensions.female_stock_height * 0.000000001) * (displayData?.material?.density || 0) * (displayData?.material?.cost || 0))?.toFixed(2)}</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ padding: '10px', background: '#e6f7ff66', border: `1px solid ${theme.primary}22`, borderRadius: '6px' }}>
                        <Text strong style={{ fontSize: '15px', color: 'black' }}>Manufacturing Cost:</Text>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>₹{displayData.classification?.female_tool?.manufacturing_cost?.toFixed(2)}</div>
                      </div>
                    </Col>
                  </Row>
                </div>

                <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: `1px solid ${theme.borderColor}` }}>
                  <Text strong style={{ display: 'block', marginBottom: '8px', color: theme.primary }}>MALE TOOL</Text>
                  <Row gutter={8} style={{ marginBottom: '8px' }}>
                    <Col span={12}>
                      <div style={{ padding: '10px', background: '#e6f7ff66', border: `1px solid ${theme.primary}22`, borderRadius: '6px' }}>
                        <Text strong style={{ fontSize: '15px', color: 'black' }}>Material Cost:</Text>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>₹{((stockDimensions.male_stock_length * stockDimensions.male_stock_breadth * stockDimensions.male_stock_height * 0.000000001) * (displayData?.material?.density || 0) * (displayData?.material?.cost || 0))?.toFixed(2)}</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ padding: '10px', background: '#e6f7ff66', border: `1px solid ${theme.primary}22`, borderRadius: '6px' }}>
                        <Text strong style={{ fontSize: '15px', color: 'black' }}>Manufacturing Cost:</Text>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>₹{displayData.classification?.male_tool?.manufacturing_cost?.toFixed(2)}</div>
                      </div>
                    </Col>
                  </Row>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <Row gutter={8}>
                    <Col span={12}>
                      <div style={{ padding: '10px', background: '#e6f7ff66', border: `1px solid ${theme.primary}22`, borderRadius: '6px' }}>
                        <Text strong style={{ fontSize: '15px', color: 'black' }}>Part Forming Cost:</Text>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>₹{displayData.part_forming?.part_forming_cost?.toFixed(2)}</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ padding: '10px', background: '#e6f7ff66', border: `1px solid ${theme.primary}22`, borderRadius: '6px' }}>
                        <Text strong style={{ fontSize: '15px', color: 'black' }}>Part Forming Cost Per Unit:</Text>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black', marginTop: '4px' }}>₹{displayData.part_forming?.part_forming_cost_per_unit?.toFixed(2)}</div>
                      </div>
                    </Col>
                  </Row>
                </div>

                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: `2px solid ${theme.primary}` }}>
                  <Row gutter={8}>
                    <Col span={12}>
                      <div style={{ padding: '12px', background: theme.primary, borderRadius: '6px' }}>
                        <Text strong style={{ fontSize: '15px', color: 'white' }}>Total Cost:</Text>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginTop: '4px' }}>₹{displayData.total_cost?.toFixed(2)}</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ padding: '12px', background: theme.primary, borderRadius: '6px' }}>
                        <Text strong style={{ fontSize: '15px', color: 'white' }}>Total Cost Per Unit:</Text>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginTop: '4px' }}>₹{displayData.total_cost_per_unit?.toFixed(2)}</div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Tabs.TabPane>
          </Tabs>
        </div>
      ) : (
        <div style={{ padding: '16px', textAlign: 'center', color: theme.textSecondary }}>
          No calculation data available
        </div>
      )}
    </Card>
  );
}

export default AnalysisCostData;