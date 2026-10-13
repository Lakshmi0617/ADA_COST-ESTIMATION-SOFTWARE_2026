

// import React, { useState, useEffect } from 'react';
// import { Card, Typography, Row, Col, Statistic, Button, message, Modal } from 'antd';
// import jsPDF from 'jspdf';
// import axios from 'axios';

// const { Title, Text } = Typography;

// const CompositesCostreport = ({ 
//   analysisData, 
//   analysisId, 
//   prepregMaterial, 
//   masterToolData, 
//   rawData,
//   theme 
// }) => {
//   const [masterModelData, setMasterModelData] = useState(null);
//   const [toolCostData, setToolCostData] = useState(null);
//   const [partFabricationData, setPartFabricationData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [globalDimensions, setGlobalDimensions] = useState({
//     length: null,
//     width: null,
//     height: null
//   });

//   const API_URL = 'http://localhost:5678';

//   useEffect(() => {
//     const fetchAllData = async () => {
//       if (!analysisId) {
//         console.error('No analysis ID provided');
//         return;
//       }

//       setIsLoading(true);

//       try {
//         // Fetch master model data
//         try {
//           const masterResponse = await axios.get(
//             `${API_URL}/composites/analysis/${analysisId}/master-tool-hours/`
//           );
//           setMasterModelData(masterResponse.data);
//         } catch (error) {
//           console.warn('Master model data not available:', error.response?.data || error.message);
//         }

//         // Load analyze data from sessionStorage
//         try {
//           const storedData = sessionStorage.getItem('compositesAnalysisData');
//           if (storedData) {
//             const parsed = JSON.parse(storedData);
//             if (parsed.geometry?.global_dimensions_mm) {
//               setGlobalDimensions({
//                 length: parsed.geometry.global_dimensions_mm.length,
//                 width: parsed.geometry.global_dimensions_mm.width,
//                 height: parsed.geometry.global_dimensions_mm.height
//               });
//             }
//           }
//         } catch (error) {
//           console.warn('Error loading analyze data from sessionStorage:', error.message);
//         }

//         // Fetch tool cost data
//         try {
//           const toolResponse = await axios.get(
//             `${API_URL}/composites/analysis/${analysisId}/details/`
//           );
//           setToolCostData(toolResponse.data);
//         } catch (error) {
//           console.warn('Tool cost data not available:', error.response?.data || error.message);
//         }

//         // Fetch part fabrication data
//         try {
//           const rawResponse = await axios.get(
//             `${API_URL}/composites/analysis/${analysisId}/raw/`
//           );
//           setPartFabricationData(rawResponse.data);
//         } catch (error) {
//           console.warn('Part fabrication data not available:', error.response?.data || error.message);
//         }

//       } catch (error) {
//         console.error('Error fetching cost data:', error);
//         message.error('Failed to fetch complete cost data');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAllData();
//   }, [analysisId]);

//   const formatCurrency = (value) => {
//     if (value === null || value === undefined) return 'N/A';
//     const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
//     return `Rs.${numValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//   };

//   const formatNumber = (value, decimals = 2) => {
//     if (value === null || value === undefined) return 'N/A';
//     return typeof value === 'number' ? value.toFixed(decimals) : value;
//   };

//   const handleDownloadPDF = async () => {
//     try {
//       message.loading('Generating PDF report...', 0);

//       const safeString = (value) => {
//         if (value === null || value === undefined) return 'N/A';
//         return String(value);
//       };

//       const formatCurrencyForPDF = (value) => {
//         if (value === null || value === undefined) return 'N/A';
//         const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
//         return `Rs.${numValue.toLocaleString('en-IN', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;
//       };

//       const loadImageAsBase64 = (src) => {
//         return new Promise((resolve, reject) => {
//           const img = new Image();
//           img.crossOrigin = 'anonymous';
//           img.onload = function() {
//             const canvas = document.createElement('canvas');
//             const ctx = canvas.getContext('2d');
//             canvas.width = this.width;
//             canvas.height = this.height;
//             ctx.drawImage(this, 0, 0);
//             resolve(canvas.toDataURL('image/png'));
//           };
//           img.onerror = reject;
//           img.src = src;
//         });
//       };

//       let adaLogo = null;
//       let companyLogo = null;

//       try {
//         adaLogo = await loadImageAsBase64('/ADA_LOGO1.png');
//       } catch (error) {
//         console.warn('Could not load ADA logo:', error);
//       }

//       try {
//         companyLogo = await loadImageAsBase64('/kk.png');
//       } catch (error) {
//         console.warn('Could not load company logo:', error);
//       }

//       const pdf = new jsPDF('p', 'mm', 'a4');
//       const pageWidth = pdf.internal.pageSize.getWidth();
//       const pageHeight = pdf.internal.pageSize.getHeight();
//       const margin = 20;
//       const contentWidth = pageWidth - (2 * margin);

//       pdf.setFont('georgia', 'normal');

//       // Header
//       pdf.setFillColor(20, 93, 160);
//       pdf.rect(0, 10, pageWidth, 25, 'F');

//       if (adaLogo) {
//         pdf.addImage(adaLogo, 'JPEG', margin, 12, 20, 20);
//       }

//       if (companyLogo) {
//         pdf.setFillColor(255, 255, 255);
//         pdf.setDrawColor(200, 200, 200);
//         pdf.roundedRect(pageWidth - margin - 22, 12, 24, 18, 1, 1, 'FD');
//         pdf.addImage(companyLogo, 'PNG', pageWidth - margin - 20, 13, 20, 16);
//       }

//       pdf.setTextColor(255, 255, 255);
//       pdf.setFontSize(22);
//       pdf.setFont('georgia', 'bold');
//       pdf.text('COST ESTIMATION REPORT', pageWidth / 2, 25, { align: 'center' });

//       let yPosition = 45;

//       // File Information
//       pdf.setTextColor(0, 0, 0);
//       pdf.setFontSize(14);
//       pdf.setFont('times', 'bold');
//       pdf.text(`Filename: ${safeString(partFabricationData?.filename || analysisData?.filename || 'N/A')}`, margin, yPosition);
//       pdf.setFontSize(10);
//       pdf.setFont('times', 'normal');
//       pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, yPosition, { align: 'right' });

//       yPosition += 15;

//       // 3D Model placeholder
//       const captureIsometricView = () => {
//         return new Promise((resolve) => {
//           const handleCaptureComplete = (event) => {
//             window.removeEventListener('isometricCaptureComplete', handleCaptureComplete);
//             resolve(event.detail);
//           };

//           window.addEventListener('isometricCaptureComplete', handleCaptureComplete);
//           window.dispatchEvent(new CustomEvent('requestIsometricCapture'));

//           setTimeout(() => {
//             window.removeEventListener('isometricCaptureComplete', handleCaptureComplete);
//             console.warn('Isometric capture timeout - using fallback');
//             resolve(null);
//           }, 5000);
//         });
//       };

//       const modelScreenshot = await captureIsometricView();

//       if (modelScreenshot) {
//         const imgWidth = contentWidth * 0.6;
//         const imgHeight = imgWidth * 0.6;
//         const imgX = margin + (contentWidth - imgWidth) / 2;

//         pdf.setDrawColor(200, 200, 200);
//         pdf.setLineWidth(1);
//         pdf.rect(imgX - 2, yPosition - 2, imgWidth + 4, imgHeight + 4);

//         pdf.addImage(modelScreenshot, 'PNG', imgX, yPosition, imgWidth, imgHeight);

//         pdf.setFontSize(10);
//         pdf.setTextColor(100, 100, 100);
//         pdf.setFont('georgia', 'normal');
//         pdf.text('3D Model View', pageWidth / 2, yPosition + imgHeight + 10, { align: 'center' });

//         yPosition += imgHeight + 20;
//       } else {
//         const imgWidth = contentWidth * 0.6;
//         const imgHeight = imgWidth * 0.6;
//         const imgX = margin + (contentWidth - imgWidth) / 2;

//         pdf.setFillColor(240, 240, 240);
//         pdf.setDrawColor(200, 200, 200);
//         pdf.rect(imgX, yPosition, imgWidth, imgHeight, 'FD');

//         pdf.setFontSize(14);
//         pdf.setTextColor(150, 150, 150);
//         pdf.setFont('georgia', 'normal');
//         pdf.text('3D Model Preview', pageWidth / 2, yPosition + imgHeight / 2, { align: 'center' });
//         pdf.text('(Screenshot not available)', pageWidth / 2, yPosition + imgHeight / 2 + 10, { align: 'center' });

//         yPosition += imgHeight + 20;
//       }

//       yPosition += 1;
//       const tableData = [];

//       // MODULE header
//       tableData.push(['', '']);
//       tableData.push(['MODULE: Composites Manufacturing Process', '']);

//       // MASTER MODEL COST
//       if (masterModelData) {
//         tableData.push(['', '']);
//         tableData.push(['MASTER MODEL COST', '']);
//         tableData.push(['Volume of Composite Tool', `${formatNumber(masterModelData.volume_of_composite_tool_in_m3)} m³`]);
//         tableData.push(['Matched Volume Range', safeString(masterModelData.matched_volume_range_m3 || 'N/A')]);

//         const hours = masterModelData.hours || {};
//         tableData.push(['Design Hours', `${formatNumber(hours.design_hours || 0)} hrs`]);
//         tableData.push(['Machining Hours', `${formatNumber(hours.machining_hours || 0)} hrs`]);
//         tableData.push(['Assembly Hours', `${formatNumber(hours.assembly_hours || 0)} hrs`]);
//         tableData.push(['Finishing Hours', `${formatNumber(hours.finishing_hours || 0)} hrs`]);
//         tableData.push(['Inspection Hours', `${formatNumber(hours.inspection_hours || 0)} hrs`]);

//         tableData.push(['Design Cost', formatCurrencyForPDF(masterModelData.Design_cost)]);
//         tableData.push(['Frame Fabrication Cost', formatCurrencyForPDF(masterModelData.frame_fabrication_cost)]);
//         tableData.push(['EPOXY BLOCK Bonding Cost', formatCurrencyForPDF(masterModelData.EPOXY_BLOCK_Bonding_cost)]);
//         tableData.push(['Machining Cost', formatCurrencyForPDF(masterModelData.Machining_cost)]);
//         tableData.push(['Assembly Cost', formatCurrencyForPDF(masterModelData.Assembly_cost)]);
//         tableData.push(['Finishing Cost', formatCurrencyForPDF(masterModelData.finishing_cost)]);
//         tableData.push(['Inspection Cost', formatCurrencyForPDF(masterModelData.Inspection_cost)]);
//         tableData.push(['Total Master Model Cost', formatCurrencyForPDF(masterModelData.Total_master_model_cost)]);
//       }

//       // TOOL COST
//       if (toolCostData) {
//         tableData.push(['', '']);
//         tableData.push(['TOOL COST', '']);
//         tableData.push(['Material', safeString(toolCostData.material || 'N/A')]);
//         tableData.push(['Specification', safeString(toolCostData.spec || 'N/A')]);
//         tableData.push(['Density', `${formatNumber(toolCostData.density_kg_m3)} kg/m³`]);
//         tableData.push(['Stock Length', `${formatNumber(toolCostData.stock_length_mm)} mm`]);
//         tableData.push(['Stock Width', `${formatNumber(toolCostData.stock_width_mm)} mm`]);
//         tableData.push(['Stock Height', `${formatNumber(toolCostData.stock_height_mm)} mm`]);
//         tableData.push(['Geometric Thickness', `${formatNumber(toolCostData.geometric_thickness_mm)} mm`]);
//         tableData.push(['Surface Area (One Ply)', `${formatNumber(toolCostData.one_ply_surface_area_m2)} m²`]);
//         tableData.push(['Number of Layers', formatNumber(toolCostData.number_of_layers)]);
//         tableData.push(['Total Surface Area', `${formatNumber(toolCostData.total_surface_area_m2)} m²`]);
//         tableData.push(['Volume of Part', `${formatNumber(toolCostData.volume_of_part_m3, 5)} m³`]);
//         tableData.push(['Mass', `${formatNumber(toolCostData.mass_in_kg)} kg`]);
//         tableData.push(['Tool Stock Weight', `${formatNumber(toolCostData.tool_stock_weight_kg)} kg`]);
//         tableData.push(['Increased Thickness Tool', `${formatNumber(toolCostData.Increased_thickness_tool)} mm`]);
//         tableData.push(['Number of Man Hours', `${formatNumber(toolCostData.number_of_manhrs)} hrs`]);
//         tableData.push(['Curing Hours', `${formatNumber(toolCostData.curing_hours)} hrs`]);

//         tableData.push(['Dry Carbon Fabric Cost', formatCurrencyForPDF(toolCostData.COST_DRYCARBON_FABRIC)]);
//         tableData.push(['Layup Cost', formatCurrencyForPDF(toolCostData.layup_cost)]);
//         tableData.push(['Oven Curing Cost', formatCurrencyForPDF(toolCostData.oven_curing_cost)]);
//         tableData.push(['LT Inspection Cost', formatCurrencyForPDF(toolCostData.Lt_inspection_cost)]);
//         tableData.push(['Trimming Inspection Cost', formatCurrencyForPDF(toolCostData.Trimming_inspection_cost)]);
//         tableData.push(['CFC Tubes Fabrication Cost', formatCurrencyForPDF(toolCostData.cost_fabrication_CFC_tubes)]);
//         tableData.push(['Bonding/Riveting Cost', formatCurrencyForPDF(toolCostData.cost_bonding_reviting)]);
//         tableData.push(['Total Tool Cost', formatCurrencyForPDF(toolCostData.Total_tool_cost)]);
//       }

//       // PART FABRICATION COST
//       if (partFabricationData) {
//         tableData.push(['', '']);
//         tableData.push(['PART FABRICATION COST', '']);
//         tableData.push(['Extra Composite Part', formatNumber(partFabricationData.Extra_composite_part)]);
//         tableData.push(['Part Layup Man Hours', `${formatNumber(partFabricationData.part_layup_man_hours)} hrs`]);
//         tableData.push(['Design Thickness', `${formatNumber(partFabricationData.design_thickness_mm)} mm`]);

//         tableData.push(['Prepreg Cost', formatCurrencyForPDF(partFabricationData.preprag_cost)]);
//         tableData.push(['Part Layup Cost', formatCurrencyForPDF(partFabricationData.part_layup_cost)]);
//         tableData.push(['Consumable Cost', formatCurrencyForPDF(partFabricationData.consumable_cost)]);
//         tableData.push(['Autoclave Curing Cost', formatCurrencyForPDF(partFabricationData.autoclave_curing_cost)]);
//         tableData.push(['Trimming Inspection Cost', formatCurrencyForPDF(partFabricationData.trimming_inspection_cost)]);
//         tableData.push(['NDT Cost', formatCurrencyForPDF(partFabricationData.NDT_cost)]);
//         tableData.push(['Total Part Cost', formatCurrencyForPDF(partFabricationData.Total_part_cost)]);

//         tableData.push(['', '']);
//         tableData.push(['FINAL COST SUMMARY', '']);
//         tableData.push(['Total Tool and Part Cost', formatCurrencyForPDF(partFabricationData.Total_tool_and_part_cost)]);
//         tableData.push(['Import and Export Cost', formatCurrencyForPDF(partFabricationData.import_and_export_cost)]);
//         tableData.push(['Contingency Cost', formatCurrencyForPDF(partFabricationData.contigency_cost)]);
//         tableData.push(['GST', formatCurrencyForPDF(partFabricationData.GST)]);
//         tableData.push(['TOTAL COST', formatCurrencyForPDF(partFabricationData.Total_cost)]);
//       }

//       const startY = yPosition;
//       const rowHeight = 5;
//       const col1Width = contentWidth * 0.6;

//       let currentY = startY;

//       tableData.forEach((row) => {
//         const [label, value] = row;

//         const isSectionHeader = label && !value && (
//           label.includes('COST') || 
//           label.includes('SUMMARY') || 
//           label.includes('MODULE:')
//         );
//         const isEmptyRow = !label && !value;

//         if (isEmptyRow) {
//           currentY += rowHeight / 2;
//           return;
//         }

//         if (currentY > pageHeight - 30) {
//           pdf.addPage();
//           currentY = 20;
//         }

//         const getBackgroundColor = (label) => {
//           if (isSectionHeader) {
//             return [41, 128, 185];
//           }
//           if (label.includes('Volume') || label.includes('Thickness') || label.includes('Area') || label.includes('Mass')) {
//             return [217, 237, 247];
//           }
//           if (label.includes('Hours') || label.includes('Man')) {
//             return [236, 236, 236];
//           }
//           if (label.includes('Cost')) {
//             return [245, 245, 245];
//           }
//           return [255, 255, 255];
//         };

//         const bgColor = getBackgroundColor(label);
//         pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
//         pdf.rect(margin, currentY - 1, contentWidth, rowHeight, 'F');

//         if (isSectionHeader) {
//           pdf.setFont('georgia', 'bold');
//           pdf.setFontSize(9);
//           pdf.setTextColor(255, 255, 255);
//         } else {
//           pdf.setFont('georgia', 'normal');
//           pdf.setFontSize(8);
//           pdf.setTextColor(0, 0, 0);
//         }

//         pdf.setDrawColor(0, 0, 0);
//         pdf.setLineWidth(0.15);
//         pdf.rect(margin, currentY - 1, contentWidth, rowHeight);

//         if (!isSectionHeader) {
//           pdf.line(margin + col1Width, currentY - 1, margin + col1Width, currentY + rowHeight - 1);
//         }

//         if (isSectionHeader) {
//           pdf.text(safeString(label), margin + 4, currentY + 2.5);
//         } else {
//           pdf.text(safeString(label), margin + 2, currentY + 2.5);

//           const isCostRow = label.includes('Cost') || label.includes('TOTAL');

//           if (isCostRow && !isSectionHeader) {
//             pdf.text(safeString(value), margin + contentWidth - 2, currentY + 2.5, { align: 'right' });
//           } else {
//             pdf.text(safeString(value), margin + col1Width + 2, currentY + 2.5);
//           }
//         }

//         currentY += rowHeight;
//       });

//       pdf.setFontSize(8);
//       pdf.setTextColor(150, 150, 150);
//       pdf.setFont('georgia', 'normal');
//       pdf.text(`Report generated on ${new Date().toLocaleString()}`, margin, pageHeight - 10);

//       message.destroy();

//       Modal.confirm({
//         title: 'PDF Preview',
//         width: '80%',
//         icon: null,
//         content: (
//           <div style={{ height: '70vh', overflow: 'hidden' }}>
//             <iframe 
//               src={pdf.output('bloburl')} 
//               style={{ 
//                 width: '100%', 
//                 height: '100%', 
//                 border: 'none',
//                 borderRadius: '8px'
//               }}
//               title="PDF Preview"
//             />
//           </div>
//         ),
//         okText: 'Download PDF',
//         cancelText: 'Cancel',
//         onOk: () => {
//           const filename = `Composite_Cost_Report_${partFabricationData?.filename?.replace(/\.[^/.]+$/, '') || 'Model'}_${new Date().getTime()}.pdf`;
//           pdf.save(filename);
//           message.success('PDF report downloaded successfully!');
//         }
//       });

//     } catch (error) {
//       console.error('Error generating PDF:', error);
//       message.destroy();
//       message.error('Failed to generate PDF report');
//     }
//   };

//   return (
//     <Card 
//       title={
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <span style={{ color: theme.primary, fontSize: '18px', fontWeight: 600 }}>
//             Composite Cost Report
//           </span>
//           <Button 
//             type="primary" 
//             onClick={handleDownloadPDF}
//             style={{ borderRadius: '6px', height: '40px', fontWeight: 500, backgroundColor: '#246679' }}
//           >
//             Download PDF Report
//           </Button>
//         </div>
//       }
//       style={{ 
//         height: '100%', 
//         boxShadow: theme.shadow,
//         borderRadius: '8px',
//         overflow: 'hidden',
//         background: theme.cardBg,
//         border: `1px solid ${theme.borderColor}`
//       }}
//       bodyStyle={{ 
//         background: theme.cardBg,
//         color: theme.textPrimary,
//         height: 'calc(100% - 65px)',
//         overflow: 'auto',
//         padding: '16px'
//       }}
//     >
//       {isLoading ? (
//         <div style={{ textAlign: 'center', padding: '40px 0' }}>
//           <div style={{
//             border: `4px solid ${theme.primary}33`,
//             borderTop: `4px solid ${theme.primary}`,
//             borderRadius: '50%',
//             width: '48px',
//             height: '48px',
//             animation: 'spin 1s linear infinite',
//             margin: '0 auto 20px'
//           }} />
//           <Text style={{ color: theme.primary, fontSize: '16px' }}>
//             Loading cost data...
//           </Text>
//         </div>
//       ) : (
//         <>
//           {/* File Information */}
//           <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
//             <Col span={12}>
//               <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
//                 File Information
//               </Title>
//               <div style={{ marginBottom: '12px' }}>
//                 <Text style={{ color: theme.textSecondary }}>Filename:</Text>
//                 <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
//                   {partFabricationData?.filename || analysisData?.filename || 'N/A'}
//                 </div>
//               </div>
//             </Col>

//             {/* Material Information */}
//             <Col span={12}>
//               <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
//                 Material Information
//               </Title>
//               <Row gutter={[16, 16]}>
//                 <Col span={12}>
//                   <div>
//                     <Text style={{ color: theme.textSecondary }}>Material:</Text>
//                     <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
//                       {partFabricationData?.material || toolCostData?.material || 'N/A'}
//                     </div>
//                   </div>
//                 </Col>
//                 <Col span={12}>
//                   <div>
//                     <Text style={{ color: theme.textSecondary }}>Specification:</Text>
//                     <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
//                       {partFabricationData?.spec || toolCostData?.spec || 'N/A'}
//                     </div>
//                   </div>
//                 </Col>
//               </Row>
//               {/* <Row gutter={[16, 16]} style={{ marginTop: '12px' }}>
//                 <Col span={12}>
//                   <div>
//                     <Text style={{ color: theme.textSecondary }}>Density:</Text>
//                     <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
//                       {toolCostData?.density_kg_m3 ? `${toolCostData.density_kg_m3} kg/m³` : 'N/A'}
//                     </div>
//                   </div>
//                 </Col>
//                 <Col span={12}>
//                   <div>
//                     <Text style={{ color: theme.textSecondary }}>Prepreg Cost per Kg:</Text>
//                     <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
//                       {partFabricationData?.prepreg_cost_per_kg ? formatCurrency(partFabricationData.prepreg_cost_per_kg) : 'N/A'}
//                     </div>
//                   </div>
//                 </Col>
//               </Row> */}
//             </Col>
//           </Row>

//           {/* Bounding Box Dimensions */}
//           <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
//             <Col span={24}>
//               <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
//                 Bounding Box Dimensions
//               </Title>
//               <Row gutter={[16, 16]}>
//                 <Col span={8}>
//                   <Card size="small" style={{ background: `${theme.primary}11`, borderColor: theme.primary }}>
//                     <Text strong style={{ fontSize: '12px' }}>Length:</Text>
//                     <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px', marginTop: '4px' }}>
//                       {globalDimensions.length !== null 
//                         ? `${formatNumber(globalDimensions.length)} mm` 
//                         : 'N/A'}
//                     </div>
//                   </Card>
//                 </Col>
//                 <Col span={8}>
//                   <Card size="small" style={{ background: `${theme.primary}11`, borderColor: theme.primary }}>
//                     <Text strong style={{ fontSize: '12px' }}>Width:</Text>
//                     <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px', marginTop: '4px' }}>
//                       {globalDimensions.width !== null 
//                         ? `${formatNumber(globalDimensions.width)} mm` 
//                         : 'N/A'}
//                     </div>
//                   </Card>
//                 </Col>
//                 <Col span={8}>
//                   <Card size="small" style={{ background: `${theme.primary}11`, borderColor: theme.primary }}>
//                     <Text strong style={{ fontSize: '12px' }}>Height:</Text>
//                     <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px', marginTop: '4px' }}>
//                       {globalDimensions.height !== null 
//                         ? `${formatNumber(globalDimensions.height)} mm` 
//                         : 'N/A'}
//                     </div>
//                   </Card>
//                 </Col>
//               </Row>
//             </Col>
//           </Row>

//           {/* Stock Dimensions */}
//           <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
//             <Col span={24}>
//               <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
//                Manufaturing Stock Dimensions
//               </Title>
//               <Row gutter={[16, 16]}>
//                 <Col span={8}>
//                   <Card size="small" style={{ background: `${theme.primary}11`, borderColor: theme.primary }}>
//                     <Text strong style={{ fontSize: '12px' }}>Stock Width:</Text>
//                     <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px', marginTop: '4px' }}>
//                       {toolCostData?.stock_width_mm ? `${formatNumber(toolCostData.stock_width_mm)} mm` : 'N/A'}
//                     </div>
//                   </Card>
//                 </Col>
//                 <Col span={8}>
//                   <Card size="small" style={{ background: `${theme.primary}11`, borderColor: theme.primary }}>
//                     <Text strong style={{ fontSize: '12px' }}>Stock Length:</Text>
//                     <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px', marginTop: '4px' }}>
//                       {toolCostData?.stock_length_mm ? `${formatNumber(toolCostData.stock_length_mm)} mm` : 'N/A'}
//                     </div>
//                   </Card>
//                 </Col>
//                 <Col span={8}>
//                   <Card size="small" style={{ background: `${theme.primary}11`, borderColor: theme.primary }}>
//                     <Text strong style={{ fontSize: '12px' }}>Stock Height:</Text>
//                     <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px', marginTop: '4px' }}>
//                       {toolCostData?.stock_height_mm ? `${formatNumber(toolCostData.stock_height_mm)} mm` : 'N/A'}
//                     </div>
//                   </Card>
//                 </Col>
//               </Row>
//             </Col>
//           </Row>

//           {/* Design Thickness */}
//           {/* <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
//             <Col span={24}>
//               <Row gutter={[16, 16]}>
//                 <Col span={8}>
//                   <Card size="small" style={{ background: `${theme.primary}11`, borderColor: theme.primary }}>
//                     <Text strong style={{ fontSize: '12px' }}>Design Thickness:</Text>
//                     <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px', marginTop: '4px' }}>
//                       {partFabricationData?.design_thickness_mm ? `${partFabricationData.design_thickness_mm} mm` : 'N/A'}
//                     </div>
//                   </Card>
//                 </Col>
//               </Row>
//             </Col>
//           </Row> */}

//           {/* Geometry and Weight Information */}
//           <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
//             <Col span={24}>
//               <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
//                 Geometry and Weight Information
//               </Title>
//               <Row gutter={[16, 16]}>
//                 <Col span={8}>
//                   <Card size="small" style={{ background: `${theme.primary}11`, borderColor: theme.primary }}>
//                     <Text strong style={{ fontSize: '12px' }}>Total Surface Area:</Text>
//                     <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px', marginTop: '4px' }}>
//                       {partFabricationData?.total_surface_area_m2 ? `${formatNumber(partFabricationData.total_surface_area_m2)} m²` : 'N/A'}
//                     </div>
//                   </Card>
//                 </Col>
//                 <Col span={8}>
//                   <Card size="small" style={{ background: `${theme.primary}11`, borderColor: theme.primary }}>
//                     <Text strong style={{ fontSize: '12px' }}>Volume of Part:</Text>
//                     <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px', marginTop: '4px' }}>
//                       {partFabricationData?.volume_of_part_m3 ? `${formatNumber(partFabricationData.volume_of_part_m3, 7)} m³` : 'N/A'}
//                     </div>
//                   </Card>
//                 </Col>
//                 <Col span={8}>
//                   <Card size="small" style={{ background: `${theme.primary}11`, borderColor: theme.primary }}>
//                     <Text strong style={{ fontSize: '12px' }}>Mass:</Text>
//                     <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px', marginTop: '4px' }}>
//                       {partFabricationData?.mass_in_kg ? `${formatNumber(partFabricationData.mass_in_kg)} kg` : 'N/A'}
//                     </div>
//                   </Card>
//                 </Col>
//                 {/* <Col span={12}>
//                   <Card size="small" style={{ background: `${theme.primary}11`, borderColor: theme.primary }}>
//                     <Text strong style={{ fontSize: '12px' }}>Volume of Composite Tool:</Text>
//                     <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px', marginTop: '4px' }}>
//                       {partFabricationData?.volume_of_composite_tool_in_m3 ? `${formatNumber(partFabricationData.volume_of_composite_tool_in_m3, 7)} m³` : 'N/A'}
//                     </div>
//                   </Card>
//                 </Col>
//                 <Col span={12}>
//                   <Card size="small" style={{ background: `${theme.primary}11`, borderColor: theme.primary }}>
//                     <Text strong style={{ fontSize: '12px' }}>Tool Stock Weight:</Text>
//                     <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px', marginTop: '4px' }}>
//                       {toolCostData?.tool_stock_weight_kg ? `${formatNumber(toolCostData.tool_stock_weight_kg)} kg` : 'N/A'}
//                     </div>
//                   </Card>
//                 </Col> */}
//               </Row>
//             </Col>
//           </Row>

//           {/* COST SUMMARY - All highlighted costs */}
//           <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
//             <Col span={24}>
//               <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
//                 Cost Summary
//               </Title>
//               <Row gutter={[16, 16]}>
//                 {/* Total Master Model Cost */}
//                 <Col span={12}>
//                   <Card 
//                     size="small" 
//                     style={{ 
//                       background: theme.primary + '22', 
//                       borderColor: theme.primary,
//                       borderWidth: '2px'
//                     }}
//                   >
//                     <Statistic 
//                       title={<span style={{ fontSize: '13px', fontWeight: 600 }}>Total Master Model Cost</span>}
//                       value={formatCurrency(masterModelData?.Total_master_model_cost)}
//                       valueStyle={{ color: theme.primary, fontWeight: 'bold', fontSize: '18px' }}
//                     />
//                   </Card>
//                 </Col>

//                 {/* Total Tool Cost */}
//                 <Col span={12}>
//                   <Card 
//                     size="small" 
//                     style={{ 
//                       background: theme.primary + '22', 
//                       borderColor: theme.primary,
//                       borderWidth: '2px'
//                     }}
//                   >
//                     <Statistic 
//                       title={<span style={{ fontSize: '13px', fontWeight: 600 }}>Total Tool Cost</span>}
//                       value={formatCurrency(toolCostData?.Total_tool_cost)}
//                       valueStyle={{ color: theme.primary, fontWeight: 'bold', fontSize: '18px' }}
//                     />
//                   </Card>
//                 </Col>

//                 {/* Total Part Cost */}
//                 <Col span={12}>
//                   <Card 
//                     size="small" 
//                     style={{ 
//                       background: theme.success + '22', 
//                       borderColor: theme.success,
//                       borderWidth: '2px'
//                     }}
//                   >
//                     <Statistic 
//                       title={<span style={{ fontSize: '13px', fontWeight: 600 }}>Total Part Cost</span>}
//                       value={formatCurrency(partFabricationData?.Total_part_cost)}
//                       valueStyle={{ color: theme.success, fontWeight: 'bold', fontSize: '18px' }}
//                     />
//                   </Card>
//                 </Col>

//                 {/* TOTAL COST (Final) */}
//                 <Col span={12}>
//                   <Card 
//                     size="small" 
//                     style={{ 
//                       background: theme.primary + '33', 
//                       borderColor: theme.primary,
//                       borderWidth: '3px'
//                     }}
//                   >
//                     <Statistic 
//                       title={<span style={{ fontSize: '14px', fontWeight: 600 }}>TOTAL COST</span>}
//                       value={formatCurrency(partFabricationData?.Total_cost)}
//                       valueStyle={{ color: theme.primary, fontWeight: 'bold', fontSize: '20px' }}
//                     />
//                   </Card>
//                 </Col>
//               </Row>
//             </Col>
//           </Row>

//           {/* Timestamp */}
//           {partFabricationData?.created_at && (
//             <div style={{ marginTop: '16px', textAlign: 'right' }}>
//               <Text type="secondary" style={{ fontSize: '12px' }}>
//                 Created: {new Date(partFabricationData.created_at).toLocaleString()}
//               </Text>
//             </div>
//           )}
//         </>
//       )}

//       <style jsx global>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </Card>
//   );
// };

// export default CompositesCostreport;






import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Statistic, Button, message, Modal, Input } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import axios from 'axios';

const { Title, Text } = Typography;

const CompositesCostreport = ({
  analysisData,
  analysisId,
  prepregMaterial,
  masterToolData,
  rawData,
  theme
}) => {
  const [masterModelData, setMasterModelData] = useState(null);
  const [toolCostData, setToolCostData] = useState(null);
  const [partFabricationData, setPartFabricationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [globalDimensions, setGlobalDimensions] = useState({
    length: null,
    width: null,
    height: null
  });

  // New state for editable stock dimensions
  const [stockDimensions, setStockDimensions] = useState({
    stock_length_mm: null,
    stock_width_mm: null,
    stock_height_mm: null
  });
  const [isEditingStock, setIsEditingStock] = useState(false);
  const [isSavingStock, setIsSavingStock] = useState(false);

  // New state for quantity
  const [quantity, setQuantity] = useState(1);
  const [isEditingQuantity, setIsEditingQuantity] = useState(false);
  const [isSavingQuantity, setIsSavingQuantity] = useState(false);

  // New state for editable geometry
  const [isEditingGeometry, setIsEditingGeometry] = useState(false);
  const [isSavingGeometry, setIsSavingGeometry] = useState(false);
  const [geometryInputs, setGeometryInputs] = useState({
    geometric_thickness_mm: null,
    one_ply_surface_area_m2: null
  });

  // New state for dynamic cost data
  const [dynamicCostData, setDynamicCostData] = useState({
    total_master_tool_cost: null,
    total_tool_cost: null,
    total_part_cost: null,
    total_cost: null,
    total_cost_per_unit: null,
    total_tool_and_part_cost: null
  });

  const API_URL = 'http://localhost:5678';

  useEffect(() => {
    const fetchAllData = async () => {
      if (!analysisId) {
        console.error('No analysis ID provided');
        return;
      }

      setIsLoading(true);

      let fetchedMasterModelData = null;

      try {
        // Fetch master model data
        try {
          const masterResponse = await axios.get(
            `${API_URL}/composites/analysis/${analysisId}/master-tool-hours/`
          );
          setMasterModelData(masterResponse.data);
          fetchedMasterModelData = masterResponse.data;
        } catch (error) {
          console.warn('Master model data not available:', error.response?.data || error.message);
        }

        // Load analyze data from sessionStorage
        try {
          const storedData = sessionStorage.getItem('compositesAnalysisData');
          if (storedData) {
            const parsed = JSON.parse(storedData);
            if (parsed.geometry?.global_dimensions_mm) {
              setGlobalDimensions({
                length: parsed.geometry.global_dimensions_mm.length,
                width: parsed.geometry.global_dimensions_mm.width,
                height: parsed.geometry.global_dimensions_mm.height
              });
            }
          }
        } catch (error) {
          console.warn('Error loading analyze data from sessionStorage:', error.message);
        }

        // Fetch tool cost data
        try {
          const toolResponse = await axios.get(
            `${API_URL}/composites/analysis/${analysisId}/details/`
          );
          setToolCostData(toolResponse.data);

          // Initialize stock dimensions from fetched data
          setStockDimensions({
            stock_length_mm: toolResponse.data.stock_length_mm,
            stock_width_mm: toolResponse.data.stock_width_mm,
            stock_height_mm: toolResponse.data.stock_height_mm
          });

          // Initialize dynamic cost data
          setDynamicCostData({
            total_master_tool_cost: fetchedMasterModelData?.Total_master_model_cost ?? null,
            total_tool_cost: toolResponse.data.Total_tool_cost ?? toolResponse.data.total_tool_cost ?? null,
            total_part_cost: toolResponse.data.total_part_cost ?? toolResponse.data.Total_part_cost ?? null,
            total_cost: toolResponse.data.total_cost ?? toolResponse.data.Total_cost ?? null,
            total_cost_per_unit: toolResponse.data.total_cost_per_unit ?? toolResponse.data.Total_cost_per_unit ?? toolResponse.data.cost_per_unit ?? null,
            total_tool_and_part_cost: toolResponse.data.total_tool_and_part_cost ?? toolResponse.data.Total_tool_and_part_cost ?? null
          });
        } catch (error) {
          console.warn('Tool cost data not available:', error.response?.data || error.message);
        }

        // Fetch part fabrication data
        try {
          const rawResponse = await axios.get(
            `${API_URL}/composites/analysis/${analysisId}/raw/`
          );
          setPartFabricationData(rawResponse.data);

          setDynamicCostData(prev => ({
            ...prev,
            total_cost_per_unit:
              rawResponse.data.total_cost_per_unit ??
              rawResponse.data.Total_cost_per_unit ??
              rawResponse.data.cost_per_unit ??
              prev.total_cost_per_unit
          }));

          // Update quantity from fetched data
          if (rawResponse.data.quantity) {
            setQuantity(rawResponse.data.quantity);
          }
        } catch (error) {
          console.warn('Part fabrication data not available:', error.response?.data || error.message);
        }

      } catch (error) {
        console.error('Error fetching cost data:', error);
        message.error('Failed to fetch complete cost data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [analysisId]);

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A';
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
    return `Rs.${numValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined) return 'N/A';
    return typeof value === 'number' ? value.toFixed(decimals) : value;
  };

  const handleStockDimensionChange = (field, value) => {
    const numValue = parseFloat(value) || 0;
    setStockDimensions(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleUpdateStock = async () => {
    if (!analysisId) {
      message.error('Analysis ID is missing');
      return;
    }

    // Validate all stock dimensions are filled
    if (!stockDimensions.stock_length_mm || !stockDimensions.stock_width_mm || !stockDimensions.stock_height_mm) {
      message.error('Please fill all stock dimensions');
      return;
    }

    setIsSavingStock(true);
    message.loading('Updating stock dimensions...', 0);

    try {
      const response = await axios.post(
        `${API_URL}/composites/analysis/${analysisId}/recalculate-with-stock`,
        {
          stock_length_mm: stockDimensions.stock_length_mm,
          stock_width_mm: stockDimensions.stock_width_mm,
          stock_height_mm: stockDimensions.stock_height_mm
        }
      );

      // Update dynamic cost data from response
      setDynamicCostData({
        total_master_tool_cost: response.data.total_master_tool_cost ?? response.data.Total_master_tool_cost ?? dynamicCostData.total_master_tool_cost,
        total_tool_cost: response.data.total_tool_cost ?? response.data.Total_tool_cost ?? dynamicCostData.total_tool_cost,
        total_part_cost: dynamicCostData.total_part_cost,
        total_cost: response.data.total_cost ?? response.data.Total_cost ?? dynamicCostData.total_cost,
        total_cost_per_unit: response.data.total_cost_per_unit ?? response.data.Total_cost_per_unit ?? dynamicCostData.total_cost_per_unit,
        total_tool_and_part_cost: response.data.total_tool_and_part_cost ?? response.data.Total_tool_and_part_cost ?? dynamicCostData.total_tool_and_part_cost
      });

      // Update tool cost data
      setToolCostData(prev => ({
        ...prev,
        stock_length_mm: response.data.stock_override_mm.stock_length_mm,
        stock_width_mm: response.data.stock_override_mm.stock_width_mm,
        stock_height_mm: response.data.stock_override_mm.stock_height_mm,
        Total_tool_cost: response.data.total_tool_cost,
        tool_stock_weight_kg: response.data.tool_stock_weight_kg
      }));

      setIsEditingStock(false);
      message.destroy();
      message.success('Stock dimensions updated successfully!');
    } catch (error) {
      console.error('Error updating stock dimensions:', error);
      message.destroy();
      message.error(error.response?.data?.detail || 'Failed to update stock dimensions');
    } finally {
      setIsSavingStock(false);
    }
  };

  const handleGeometryChange = (field, value) => {
    const numValue = parseFloat(value);
    setGeometryInputs(prev => ({
      ...prev,
      [field]: Number.isFinite(numValue) ? numValue : null
    }));
  };

  const handleStartEditGeometry = () => {
    setGeometryInputs({
      geometric_thickness_mm: toolCostData?.geometric_thickness_mm ?? null,
      one_ply_surface_area_m2: toolCostData?.one_ply_surface_area_m2 ?? null
    });
    setIsEditingGeometry(true);
  };

  const refreshCompositeCostData = async () => {
    if (!analysisId) return;

    try {
      const [masterResponse, toolResponse, rawResponse] = await Promise.all([
        axios.get(`${API_URL}/composites/analysis/${analysisId}/master-tool-hours/`).catch(() => null),
        axios.get(`${API_URL}/composites/analysis/${analysisId}/details/`).catch(() => null),
        axios.get(`${API_URL}/composites/analysis/${analysisId}/raw/`).catch(() => null)
      ]);

      if (masterResponse?.data) {
        setMasterModelData(masterResponse.data);
      }

      if (toolResponse?.data) {
        setToolCostData(toolResponse.data);

        setStockDimensions({
          stock_length_mm: toolResponse.data.stock_length_mm,
          stock_width_mm: toolResponse.data.stock_width_mm,
          stock_height_mm: toolResponse.data.stock_height_mm
        });

        setDynamicCostData(prev => ({
          ...prev,
          total_master_tool_cost:
            masterResponse?.data?.Total_master_model_cost ??
            masterResponse?.data?.total_master_model_cost ??
            prev.total_master_tool_cost,
          total_tool_cost:
            toolResponse.data.Total_tool_cost ??
            toolResponse.data.total_tool_cost ??
            prev.total_tool_cost
        }));
      }

      if (rawResponse?.data) {
        setPartFabricationData(rawResponse.data);

        if (rawResponse.data.quantity) {
          setQuantity(rawResponse.data.quantity);
        }

        setDynamicCostData(prev => ({
          ...prev,
          total_part_cost: rawResponse.data.Total_part_cost ?? rawResponse.data.total_part_cost ?? prev.total_part_cost,
          total_cost: rawResponse.data.Total_cost ?? rawResponse.data.total_cost ?? prev.total_cost,
          total_cost_per_unit: rawResponse.data.total_cost_per_unit ?? rawResponse.data.Total_cost_per_unit ?? prev.total_cost_per_unit,
          total_tool_and_part_cost: rawResponse.data.Total_tool_and_part_cost ?? rawResponse.data.total_tool_and_part_cost ?? prev.total_tool_and_part_cost
        }));
      }
    } catch (e) {
      console.warn('Error refreshing composite cost data:', e);
    }
  };

  const handleUpdateGeometry = async () => {
    if (!analysisId) {
      message.error('Analysis ID is missing');
      return;
    }

    if (!geometryInputs.geometric_thickness_mm || !geometryInputs.one_ply_surface_area_m2) {
      message.error('Please fill geometric thickness and one ply surface area');
      return;
    }

    setIsSavingGeometry(true);
    message.loading('Updating geometry and recalculating costs...', 0);

    try {
      const body = new URLSearchParams();
      body.append('geometric_thickness_mm', String(geometryInputs.geometric_thickness_mm));
      body.append('one_ply_surface_area_m2', String(geometryInputs.one_ply_surface_area_m2));

      await axios.put(
        `${API_URL}/composites/analysis/${analysisId}/update-geometry/`,
        body,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      await refreshCompositeCostData();

      setIsEditingGeometry(false);
      message.destroy();
      message.success('Geometry updated and costs recalculated successfully!');
    } catch (error) {
      console.error('Error updating geometry:', error);
      message.destroy();
      message.error(error.response?.data?.detail || 'Failed to update geometry');
    } finally {
      setIsSavingGeometry(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleUpdateQuantity = async () => {
    if (!analysisId) {
      message.error('Analysis ID is missing');
      return;
    }

    setIsSavingQuantity(true);
    message.loading('Updating quantity and costs...', 0);

    try {
      const response = await axios.post(
        `${API_URL}/composites/analysis/${analysisId}/quantity/`,
        {
          quantity: quantity
        }
      );

      // Update dynamic cost data from response
      setDynamicCostData({
        total_master_tool_cost: dynamicCostData.total_master_tool_cost,
        total_tool_cost: response.data.total_tool_cost ?? response.data.Total_tool_cost ?? dynamicCostData.total_tool_cost,
        total_part_cost: response.data.total_part_cost ?? response.data.Total_part_cost ?? dynamicCostData.total_part_cost,
        total_cost: response.data.total_cost ?? response.data.Total_cost ?? dynamicCostData.total_cost,
        total_cost_per_unit: response.data.total_cost_per_unit ?? response.data.Total_cost_per_unit ?? dynamicCostData.total_cost_per_unit,
        total_tool_and_part_cost: response.data.total_tool_cost + response.data.total_part_cost
      });

      // Update part fabrication data
      setPartFabricationData(prev => ({
        ...prev,
        quantity: response.data.quantity,
        total_part_cost: response.data.total_part_cost,
        Total_part_cost: response.data.total_part_cost,
        Total_cost: response.data.total_cost,
        preprag_cost: response.data.prepreg_cost,
        part_layup_cost: response.data.part_layup_cost,
        consumable_cost: response.data.consumable_cost,
        autoclave_curing_cost: response.data.autoclave_curing_cost,
        trimming_inspection_cost: response.data.trimming_inspection_cost,
        NDT_cost: response.data.ndt_cost,
        import_and_export_cost: response.data.import_and_export_cost,
        contigency_cost: response.data.contingency_cost,
        GST: response.data.gst_cost
      }));

      setIsEditingQuantity(false);
      message.destroy();
      message.success('Quantity and costs updated successfully!');
    } catch (error) {
      console.error('Error updating quantity:', error);
      message.destroy();
      message.error(error.response?.data?.detail || 'Failed to update quantity');
    } finally {
      setIsSavingQuantity(false);
    }
  };



  const handleDownloadPDF = async () => {
    try {
      message.loading('Generating PDF report...', 0);

      const safeString = (value) => {
        if (value === null || value === undefined) return 'N/A';
        return String(value);
      };

      const formatCurrencyForPDF = (value) => {
        if (value === null || value === undefined) return 'N/A';
        const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
        return `Rs.${numValue.toLocaleString('en-IN', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;
      };

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

      // Header
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

      // File Information
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.setFont('times', 'bold');
      pdf.text(`Filename: ${safeString(partFabricationData?.filename || analysisData?.filename || 'N/A')}`, margin, yPosition);
      pdf.setFontSize(10);
      pdf.setFont('times', 'normal');
      pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, yPosition, { align: 'right' });

      yPosition += 15;

      // 3D Model placeholder
      const captureIsometricView = () => {
        return new Promise((resolve) => {
          const handleCaptureComplete = (event) => {
            window.removeEventListener('isometricCaptureComplete', handleCaptureComplete);
            resolve(event.detail);
          };

          window.addEventListener('isometricCaptureComplete', handleCaptureComplete);
          window.dispatchEvent(new CustomEvent('requestIsometricCapture'));

          setTimeout(() => {
            window.removeEventListener('isometricCaptureComplete', handleCaptureComplete);
            console.warn('Isometric capture timeout - using fallback');
            resolve(null);
          }, 5000);
        });
      };

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

      // MODULE header
      tableData.push(['', '']);
      tableData.push(['MODULE: Composites Manufacturing Process', '']);

      // MATERIAL INFORMATION
      if (toolCostData) {
        tableData.push(['', '']);
        tableData.push(['MATERIAL INFORMATION', '']);
        tableData.push(['Material', safeString(toolCostData.material || 'N/A')]);
        tableData.push(['Density', `${formatNumber(toolCostData.density_kg_m3)} kg/m³`]);
      }

      // MASTER MODEL COST
      if (masterModelData) {
        tableData.push(['', '']);
        tableData.push(['MASTER MODEL COST', '']);

        const hours = masterModelData.hours || {};
        tableData.push(['Design Hours', `${formatNumber(hours.design_hours || 0)} hrs`]);
        tableData.push(['Machining Hours', `${formatNumber(hours.machining_hours || 0)} hrs`]);
        tableData.push(['Assembly Hours', `${formatNumber(hours.assembly_hours || 0)} hrs`]);
        tableData.push(['Finishing Hours', `${formatNumber(hours.finishing_hours || 0)} hrs`]);
        tableData.push(['Inspection Hours', `${formatNumber(hours.inspection_hours || 0)} hrs`]);

        tableData.push(['Design Cost', formatCurrencyForPDF(masterModelData.Design_cost)]);
        tableData.push(['Frame Fabrication Cost', formatCurrencyForPDF(masterModelData.frame_fabrication_cost)]);
        tableData.push(['Epoxy Block+Bonding Cost', formatCurrencyForPDF(masterModelData.EPOXY_BLOCK_Bonding_cost)]);
        tableData.push(['Machining Cost', formatCurrencyForPDF(masterModelData.Machining_cost)]);
        tableData.push(['Assembly Cost', formatCurrencyForPDF(masterModelData.Assembly_cost)]);
        tableData.push(['Finishing Cost', formatCurrencyForPDF(masterModelData.finishing_cost)]);
        tableData.push(['Inspection Cost', formatCurrencyForPDF(masterModelData.Inspection_cost)]);
        tableData.push(['Total Master Model Cost', formatCurrencyForPDF(masterModelData.Total_master_model_cost)]);
      }



      // STOCK DIMENSION
      if (toolCostData) {
        tableData.push(['', '']);
        tableData.push(['STOCK DIMENSION', '']);
        tableData.push(['Stock Length', `${formatNumber(toolCostData.stock_length_mm)} mm`]);
        tableData.push(['Stock Width', `${formatNumber(toolCostData.stock_width_mm)} mm`]);
        tableData.push(['Stock Height', `${formatNumber(toolCostData.stock_height_mm)} mm`]);
      }

      // GEOMETRIC INFORMATION
      if (toolCostData) {
        tableData.push(['', '']);
        tableData.push(['GEOMETRIC INFORMATION', '']);
        tableData.push(['Geometric Thickness', `${formatNumber(toolCostData.geometric_thickness_mm)} mm`]);
        tableData.push(['Surface Area (One Ply)', `${formatNumber(toolCostData.one_ply_surface_area_m2)} m²`]);
        tableData.push(['Total Surface Area', `${formatNumber(toolCostData.total_surface_area_m2)} m²`]);
        tableData.push(['Volume of Part', `${formatNumber(toolCostData.volume_of_part_m3, 5)} m³`]);
        tableData.push(['Mass', `${formatNumber(toolCostData.mass_in_kg)} kg`]);
      }

      // TOOL COST (reorganized)
      if (toolCostData) {
        tableData.push(['', '']);
        tableData.push(['TOOL COST', '']);
        tableData.push(['Increased Thickness Tool', `${formatNumber(toolCostData.Increased_thickness_tool)} mm`]);
        tableData.push(['Number of Man Hours', `${formatNumber(toolCostData.number_of_manhrs)} hrs`]);
        tableData.push(['Curing Hours', `${formatNumber(toolCostData.curing_hours)} hrs`]);

        tableData.push(['Dry Carbon Fabric Cost', formatCurrencyForPDF(toolCostData.COST_DRYCARBON_FABRIC)]);
        tableData.push(['Layup Cost', formatCurrencyForPDF(toolCostData.layup_cost)]);
        tableData.push(['Oven Curing Cost', formatCurrencyForPDF(toolCostData.oven_curing_cost)]);
        tableData.push(['LT Inspection Cost', formatCurrencyForPDF(toolCostData.Lt_inspection_cost)]);
        tableData.push(['Trimming and Inspection Cost', formatCurrencyForPDF(toolCostData.Trimming_inspection_cost)]);
        tableData.push(['CFC Tubes Fabrication Cost', formatCurrencyForPDF(toolCostData.cost_fabrication_CFC_tubes)]);
        tableData.push(['Bonding and Riveting Cost', formatCurrencyForPDF(toolCostData.cost_bonding_reviting)]);
        tableData.push(['Total Tool Cost', formatCurrencyForPDF(toolCostData.Total_tool_cost)]);
      }

      // PART FABRICATION COST
      if (partFabricationData) {
        tableData.push(['', '']);
        tableData.push(['PART FABRICATION COST', '']);
        tableData.push(['Extra Composite Part', formatNumber(partFabricationData.Extra_composite_part)]);
        tableData.push(['Part Layup Man Hours', `${formatNumber(partFabricationData.part_layup_man_hours)} hrs`]);
        tableData.push(['Design Thickness', `${formatNumber(partFabricationData.design_thickness_mm)} mm`]);

        tableData.push(['Prepreg Cost', formatCurrencyForPDF(partFabricationData.preprag_cost)]);
        tableData.push(['Part Layup Cost', formatCurrencyForPDF(partFabricationData.part_layup_cost)]);
        tableData.push(['Consumable Cost', formatCurrencyForPDF(partFabricationData.consumable_cost)]);
        tableData.push(['Autoclave Curing Cost', formatCurrencyForPDF(partFabricationData.autoclave_curing_cost)]);
        tableData.push(['Trimming and Inspection Cost', formatCurrencyForPDF(partFabricationData.trimming_inspection_cost)]);
        tableData.push(['NDT Cost', formatCurrencyForPDF(partFabricationData.NDT_cost)]);
        tableData.push(['Total Part Cost', formatCurrencyForPDF(partFabricationData.Total_part_cost)]);
      }

      // Final Cost Summary (now merged into TOOL COST section above)
      if (partFabricationData) {
        tableData.push(['', '']);
        tableData.push(['Total Tool and Part Cost', formatCurrencyForPDF(partFabricationData.Total_tool_and_part_cost)]);
        tableData.push(['Import and Export Cost', formatCurrencyForPDF(partFabricationData.import_and_export_cost)]);
        tableData.push(['Contingency Cost', formatCurrencyForPDF(partFabricationData.contigency_cost)]);
        tableData.push(['GST', formatCurrencyForPDF(partFabricationData.GST)]);
        tableData.push(['TOTAL COST', formatCurrencyForPDF(partFabricationData.Total_cost)]);
      }

      const startY = yPosition;
      const rowHeight = 5;
      const col1Width = contentWidth * 0.6;

      let currentY = startY;

      tableData.forEach((row) => {
        const [label, value] = row;

        const isSectionHeader = label && !value && (
          label.includes('COST') ||
          label.includes('INFORMATION') ||
          label.includes('DIMENSION') ||
          label.includes('MODULE:')
        );
        const isEmptyRow = !label && !value;

        if (isEmptyRow) {
          currentY += rowHeight / 2;
          return;
        }

        // Add page break before TOOL COST and GEOMETRIC INFORMATION sections
        if ((label === 'TOOL COST' || label === 'GEOMETRIC INFORMATION') && currentY > pageHeight - 80) {
          pdf.addPage();
          currentY = 20;
        }

        if (currentY > pageHeight - 30) {
          pdf.addPage();
          currentY = 20;
        }

        const getBackgroundColor = (label) => {
          if (isSectionHeader) {
            return [41, 128, 185];
          }
          // Remove blue background for Geometric Thickness, Surface Area, Volume, Mass and Increased Thickness Tool
          if (label.includes('Increased Thickness Tool')) {
            return [255, 255, 255];
          }
          if (label.includes('Hours') || label.includes('Man')) {
            return [236, 236, 236];
          }
          if (label.includes('Cost')) {
            return [245, 245, 245];
          }
          return [255, 255, 255];
        };

        const bgColor = getBackgroundColor(label);
        pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
        pdf.rect(margin, currentY - 1, contentWidth, rowHeight, 'F');

        if (isSectionHeader) {
          pdf.setFont('georgia', 'bold');
          pdf.setFontSize(9);
          pdf.setTextColor(255, 255, 255);
        } else {
          pdf.setFont('georgia', 'normal');
          pdf.setFontSize(8);
          pdf.setTextColor(0, 0, 0);
        }

        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.15);
        pdf.rect(margin, currentY - 1, contentWidth, rowHeight);

        if (!isSectionHeader) {
          pdf.line(margin + col1Width, currentY - 1, margin + col1Width, currentY + rowHeight - 1);
        }

        if (isSectionHeader) {
          pdf.text(safeString(label), margin + 4, currentY + 2.5);
        } else {
          pdf.text(safeString(label), margin + 2, currentY + 2.5);

          const isCostRow = label.includes('Cost') || label.includes('TOTAL');

          if (isCostRow && !isSectionHeader) {
            pdf.text(safeString(value), margin + contentWidth - 2, currentY + 2.5, { align: 'right' });
          } else {
            pdf.text(safeString(value), margin + col1Width + 2, currentY + 2.5);
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
          const filename = `Composite_Cost_Report_${partFabricationData?.filename?.replace(/\.[^/.]+$/, '') || 'Model'}_${new Date().getTime()}.pdf`;
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

  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: theme.primary, fontSize: '18px', fontWeight: 600 }}>
            Composite Cost Report
          </span>
          <Button
            type="primary"
            onClick={handleDownloadPDF}
            style={{ borderRadius: '6px', height: '40px', fontWeight: 500, backgroundColor: '#246679' }}
          >
            Download PDF Report
          </Button>
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
        overflow: 'auto',
        padding: '16px'
      }}
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{
            border: `4px solid ${theme.primary}33`,
            borderTop: `4px solid ${theme.primary}`,
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <Text style={{ color: theme.primary, fontSize: '16px' }}>
            Loading cost data...
          </Text>
        </div>
      ) : (
        <>
          {/* File Information */}
          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            <Col span={12}>
              <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
                File Information
              </Title>
              <div style={{ marginBottom: '12px' }}>
                <Text style={{ color: theme.textSecondary }}>Filename:</Text>
                <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
                  {partFabricationData?.filename || analysisData?.filename || 'N/A'}
                </div>
              </div>
            </Col>

            {/* Material Information */}
            <Col span={12}>
              <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
                Material Information
              </Title>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div>
                    <Text style={{ color: theme.textSecondary }}>Material:</Text>
                    <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
                      {partFabricationData?.material || toolCostData?.material || 'N/A'}
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <Text style={{ color: theme.textSecondary }}>Specification:</Text>
                    <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
                      {partFabricationData?.spec || toolCostData?.spec || 'N/A'}
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>

          <div style={{ marginBottom: '24px' }}>
            <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
              Model Dimensions
            </Title>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div style={{
                  background: '#f0f9ff',
                  padding: '16px',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${theme.primary}`,
                  height: '100%'
                }}>
                  <h4 style={{
                    color: theme.primary,
                    fontWeight: 600,
                    marginBottom: '12px',
                    fontSize: '13px'
                  }}>
                    BOUNDING BOX DIMENSIONS
                  </h4>

                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Length:</span>
                      <div style={{ fontWeight: 500, color: theme.textPrimary }}>
                        {globalDimensions.length !== null ? `${formatNumber(globalDimensions.length)} mm` : 'N/A'}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Width:</span>
                      <div style={{ fontWeight: 500, color: theme.textPrimary }}>
                        {globalDimensions.width !== null ? `${formatNumber(globalDimensions.width)} mm` : 'N/A'}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Height:</span>
                      <div style={{ fontWeight: 500, color: theme.textPrimary }}>
                        {globalDimensions.height !== null ? `${formatNumber(globalDimensions.height)} mm` : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>

              <Col span={12}>
                <div style={{
                  background: '#f6ffed',
                  padding: '16px',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${theme.success}`,
                  height: '100%'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong style={{
                      color: theme.success,
                      fontSize: '13px',
                      marginBottom: '12px',
                      display: 'block',
                      fontWeight: 600
                    }}>
                      MANUFACTURING STOCK DIMENSIONS
                    </Text>

                    {!isEditingStock && (
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => setIsEditingStock(true)}
                        style={{ backgroundColor: theme.success, borderColor: theme.success, marginBottom: '12px' }}
                      >
                        Edit
                      </Button>
                    )}
                  </div>

                  {isEditingStock ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Length:</span>
                          <Input
                            type="number"
                            value={stockDimensions.stock_length_mm}
                            onChange={(e) => handleStockDimensionChange('stock_length_mm', e.target.value)}
                            placeholder="Length"
                            size="small"
                            style={{ marginTop: '2px', fontSize: '12px' }}
                            suffix="mm"
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Width:</span>
                          <Input
                            type="number"
                            value={stockDimensions.stock_width_mm}
                            onChange={(e) => handleStockDimensionChange('stock_width_mm', e.target.value)}
                            placeholder="Width"
                            size="small"
                            style={{ marginTop: '2px', fontSize: '12px' }}
                            suffix="mm"
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Height:</span>
                          <Input
                            type="number"
                            value={stockDimensions.stock_height_mm}
                            onChange={(e) => handleStockDimensionChange('stock_height_mm', e.target.value)}
                            placeholder="Height"
                            size="small"
                            style={{ marginTop: '2px', fontSize: '12px' }}
                            suffix="mm"
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                          type="primary"
                          size="small"
                          onClick={handleUpdateStock}
                          loading={isSavingStock}
                          style={{ backgroundColor: theme.success, borderColor: theme.success, fontSize: '12px', height: '28px' }}
                        >
                          Update Dimensions
                        </Button>
                        <Button
                          size="small"
                          onClick={() => setIsEditingStock(false)}
                          style={{ fontSize: '12px', height: '28px' }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Length:</span>
                        <div style={{ fontWeight: 500, color: theme.textPrimary }}>
                          {toolCostData?.stock_length_mm ? `${formatNumber(toolCostData.stock_length_mm)} mm` : 'N/A'}
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Width:</span>
                        <div style={{ fontWeight: 500, color: theme.textPrimary }}>
                          {toolCostData?.stock_width_mm ? `${formatNumber(toolCostData.stock_width_mm)} mm` : 'N/A'}
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Height:</span>
                        <div style={{ fontWeight: 500, color: theme.textPrimary }}>
                          {toolCostData?.stock_height_mm ? `${formatNumber(toolCostData.stock_height_mm)} mm` : 'N/A'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
              Geometry & Quantity
            </Title>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div style={{
                  background: '#f0f9ff',
                  padding: '16px',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${theme.primary}`,
                  height: '100%'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong style={{
                      color: theme.primary,
                      fontSize: '13px',
                      marginBottom: '12px',
                      display: 'block',
                      fontWeight: 600
                    }}>
                      GEOMETRY
                    </Text>

                    {!isEditingGeometry && (
                      <Button
                        type="primary"
                        size="small"
                        onClick={handleStartEditGeometry}
                        style={{ backgroundColor: theme.primary, borderColor: theme.primary, marginBottom: '12px' }}
                      >
                        Edit
                      </Button>
                    )}
                  </div>

                  {isEditingGeometry ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Geometric Thickness (mm):</span>
                          <Input
                            type="number"
                            value={geometryInputs.geometric_thickness_mm}
                            onChange={(e) => handleGeometryChange('geometric_thickness_mm', e.target.value)}
                            placeholder="Geometric Thickness"
                            size="small"
                            style={{ marginTop: '2px', fontSize: '12px' }}
                            step="0.01"
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <span style={{ color: theme.textSecondary, fontSize: '12px' }}>One Ply Surface Area (m²):</span>
                          <Input
                            type="number"
                            value={geometryInputs.one_ply_surface_area_m2}
                            onChange={(e) => handleGeometryChange('one_ply_surface_area_m2', e.target.value)}
                            placeholder="One Ply Surface Area"
                            size="small"
                            style={{ marginTop: '2px', fontSize: '12px' }}
                            step="0.01"
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                          type="primary"
                          size="small"
                          loading={isSavingGeometry}
                          onClick={handleUpdateGeometry}
                          style={{ backgroundColor: theme.primary, borderColor: theme.primary, fontSize: '12px', height: '28px' }}
                        >
                          Update
                        </Button>
                        <Button
                          size="small"
                          onClick={() => setIsEditingGeometry(false)}
                          style={{ fontSize: '12px', height: '28px' }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Geometric Thickness:</span>
                        <div style={{ fontWeight: 500, color: theme.textPrimary }}>
                          {toolCostData?.geometric_thickness_mm ? `${formatNumber(toolCostData.geometric_thickness_mm)} mm` : 'N/A'}
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ color: theme.textSecondary, fontSize: '12px' }}>One Ply Surface Area:</span>
                        <div style={{ fontWeight: 500, color: theme.textPrimary }}>
                          {toolCostData?.one_ply_surface_area_m2 ? `${formatNumber(toolCostData.one_ply_surface_area_m2)} m²` : 'N/A'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Col>

              <Col span={12}>
                <div style={{
                  background: '#f6ffed',
                  padding: '16px',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${theme.success}`,
                  height: '100%'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong style={{
                      color: theme.success,
                      fontSize: '13px',
                      marginBottom: '12px',
                      display: 'block',
                      fontWeight: 600
                    }}>
                      QUANTITY
                    </Text>

                    {!isEditingQuantity && (
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => setIsEditingQuantity(true)}
                        style={{ backgroundColor: theme.success, borderColor: theme.success, marginBottom: '12px' }}
                      >
                        Edit
                      </Button>
                    )}
                  </div>

                  {isEditingQuantity ? (
                    <>
                      <div>
                        <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Quantity:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                          <Button
                            type="primary"
                            shape="circle"
                            icon={<MinusOutlined />}
                            size="small"
                            onClick={() => handleQuantityChange(quantity - 1)}
                            disabled={quantity <= 1}
                            style={{ backgroundColor: theme.success, borderColor: theme.success }}
                          />
                          <Input
                            type="number"
                            value={quantity}
                            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                            placeholder="Quantity"
                            size="small"
                            style={{ width: '90px', textAlign: 'center', fontSize: '12px' }}
                            min="1"
                          />
                          <Button
                            type="primary"
                            shape="circle"
                            icon={<PlusOutlined />}
                            size="small"
                            onClick={() => handleQuantityChange(quantity + 1)}
                            style={{ backgroundColor: theme.success, borderColor: theme.success }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <Button
                          type="primary"
                          size="small"
                          loading={isSavingQuantity}
                          onClick={handleUpdateQuantity}
                          style={{ backgroundColor: theme.success, borderColor: theme.success, fontSize: '12px', height: '28px' }}
                        >
                          Update
                        </Button>
                        <Button
                          size="small"
                          onClick={() => setIsEditingQuantity(false)}
                          style={{ fontSize: '12px', height: '28px' }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div>
                      <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Quantity:</span>
                      <div style={{ fontWeight: 500, color: theme.textPrimary }}>
                        {quantity}
                      </div>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </div>

          {/* Weight Information - UPDATED */}
          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            <Col span={24}>
              <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
                Weight Information
              </Title>

              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card size="small" style={{ background: `${theme.primary}11`, borderColor: theme.primary }}>
                    <Text strong style={{ fontSize: '12px' }}>Total Surface Area:</Text>
                    <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px', marginTop: '4px' }}>
                      {toolCostData?.total_surface_area_m2 ? `${formatNumber(toolCostData.total_surface_area_m2)} m²` : 'N/A'}
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" style={{ background: `${theme.primary}11`, borderColor: theme.primary }}>
                    <Text strong style={{ fontSize: '12px' }}>Volume of Part:</Text>
                    <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px', marginTop: '4px' }}>
                      {toolCostData?.volume_of_part_m3 ? `${formatNumber(toolCostData.volume_of_part_m3, 7)} m³` : 'N/A'}
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" style={{ background: `${theme.primary}11`, borderColor: theme.primary }}>
                    <Text strong style={{ fontSize: '12px' }}>Mass:</Text>
                    <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px', marginTop: '4px' }}>
                      {toolCostData?.mass_in_kg ? `${formatNumber(toolCostData.mass_in_kg)} kg` : 'N/A'}
                    </div>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* COST SUMMARY - All highlighted costs */}
          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            <Col span={24}>
              <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
                Cost Summary
              </Title>
              <Row gutter={[16, 16]}>
                {/* Total Master Model Cost */}
                <Col span={12}>
                  <Card
                    size="small"
                    style={{
                      background: theme.primary + '22',
                      borderColor: theme.primary,
                      borderWidth: '2px'
                    }}
                  >
                    <Statistic
                      title={<span style={{ fontSize: '13px', fontWeight: 600 }}>Total Master Model Cost</span>}
                      value={formatCurrency(dynamicCostData.total_master_tool_cost || masterModelData?.Total_master_model_cost)}
                      valueStyle={{ color: theme.primary, fontWeight: 'bold', fontSize: '18px' }}
                    />
                  </Card>
                </Col>

                {/* Total Tool Cost */}
                <Col span={12}>
                  <Card
                    size="small"
                    style={{
                      background: theme.primary + '22',
                      borderColor: theme.primary,
                      borderWidth: '2px'
                    }}
                  >
                    <Statistic
                      title={<span style={{ fontSize: '13px', fontWeight: 600 }}>Total Tool Cost</span>}
                      value={formatCurrency(dynamicCostData.total_tool_cost || toolCostData?.Total_tool_cost)}
                      valueStyle={{ color: theme.primary, fontWeight: 'bold', fontSize: '18px' }}
                    />
                  </Card>
                </Col>

                {/* Total Part Cost */}
                <Col span={12}>
                  <Card
                    size="small"
                    style={{
                      background: theme.success + '22',
                      borderColor: theme.success,
                      borderWidth: '2px'
                    }}
                  >
                    <Statistic
                      title={<span style={{ fontSize: '13px', fontWeight: 600 }}>Total Part Cost</span>}
                      value={formatCurrency(dynamicCostData.total_part_cost || partFabricationData?.Total_part_cost)}
                      valueStyle={{ color: theme.success, fontWeight: 'bold', fontSize: '18px' }}
                    />
                  </Card>
                </Col>

                {/* Cost Per Unit */}
                <Col span={12}>
                  <Card
                    size="small"
                    style={{
                      background: theme.warning + '22',
                      borderColor: theme.warning,
                      borderWidth: '2px'
                    }}
                  >
                    <Statistic
                      title={<span style={{ fontSize: '13px', fontWeight: 600 }}>Cost Per Unit</span>}
                      value={formatCurrency(
                        dynamicCostData.total_cost_per_unit ??
                        partFabricationData?.total_cost_per_unit ??
                        partFabricationData?.Total_cost_per_unit ??
                        partFabricationData?.cost_per_unit ??
                        toolCostData?.total_cost_per_unit ??
                        toolCostData?.Total_cost_per_unit ??
                        toolCostData?.cost_per_unit
                      )}
                      valueStyle={{ color: theme.warning, fontWeight: 'bold', fontSize: '18px' }}
                    />
                  </Card>
                </Col>

                {/* TOTAL COST (Final) */}
                <Col span={24}>
                  <Card
                    size="small"
                    style={{
                      background: theme.primary + '33',
                      borderColor: theme.primary,
                      borderWidth: '3px'
                    }}
                  >
                    <Statistic
                      title={<span style={{ fontSize: '14px', fontWeight: 600 }}>TOTAL COST</span>}
                      value={formatCurrency(dynamicCostData.total_cost || partFabricationData?.Total_cost)}
                      valueStyle={{ color: theme.primary, fontWeight: 'bold', fontSize: '20px' }}
                    />
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Timestamp */}
          {partFabricationData?.created_at && (
            <div style={{ marginTop: '16px', textAlign: 'right' }}>
              {/* <Text type="secondary" style={{ fontSize: '12px' }}>
                Created: {new Date(partFabricationData.created_at).toLocaleString()}
              </Text> */}
            </div>
          )}
        </>
      )}

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Card>
  );
};

export default CompositesCostreport;