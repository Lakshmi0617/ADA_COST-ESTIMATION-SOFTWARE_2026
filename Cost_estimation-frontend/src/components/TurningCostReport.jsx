// import React, { useState, useEffect, useRef } from 'react';
// import { Card, Typography, Row, Col, Button, Input, Select, message, Modal, Checkbox } from 'antd';
// import jsPDF from 'jspdf';

// const { Title, Text } = Typography;
// const { Option } = Select;

// const TurningCostReport = ({ analysisData, theme, objUrl, onCostCalculationComplete, initialCostData, onRegisterReport }) => {
//   const [quantity, setQuantity] = useState(1);
//   const [costData, setCostData] = useState(null);
//   const [isCalculating, setIsCalculating] = useState(false);
//   const [includeMaterialCost, setIncludeMaterialCost] = useState(false);
//   const [historyId, setHistoryId] = useState(null);
//   const [updatedAnalysisData, setUpdatedAnalysisData] = useState(null);

//   // Turning operations distribution
//   const [distribution, setDistribution] = useState([
//     { operation: 'turning', percent: 50 },
//     { operation: 'boring', percent: 50 },
//     { operation: 'threading', percent: 0 },
//     { operation: 'milling', percent: 0 }
//   ]);

//   const [editableStockDimensions, setEditableStockDimensions] = useState({
//     stock_diameter: null,
//     stock_length: null
//   });

//   const pdfRef = useRef();
//   const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);
//   const [pdfUrl, setPdfUrl] = useState(null);

//   const turningOperations = [
//     { value: 'turning', label: 'Turning' },
//     { value: 'boring', label: 'Boring' },
//     { value: 'threading', label: 'Threading' },
//     { value: 'milling', label: 'Milling' }
//   ];

//   // Normalize backend response keys
//   const normalizeCostData = (data) => {
//     if (!data || typeof data !== 'object') return data;
//     return {
//       ...data,
//       // per-unit machining cost
//       total_machining_cost_per_unit: data.total_machining_cost_per_unit ?? data.cost_per_unit,
//       // total machining cost for quantity
//       total_machining_cost: data.total_Machining_cost ?? data.total_machining_cost,
//       // totals
//       total_cost_without_material_cost: data.total_cost_without_material_cost ?? data.total_cost,
//       total_cost_with_material_cost: data.total_cost_with_material_cost ?? data.with_material_cost,
//       // material costs
//       Material_cost_per_unit: data.Material_cost_per_unit ?? data.Material_cost_perunit ?? data.material_cost_per_unit,
//       total_material_cost: data.total_material_cost ?? ((data.Material_cost_per_unit ?? data.Material_cost_perunit ?? 0) * (data.quantity ?? quantity ?? 1)),
//       // stock data
//       stock_volume_mm3: data.stock_volume_mm3,
//       stock_weight_kg: data.stock_weight_kg
//     };
//   };

//   // Initialize cost data from navigation state
//   useEffect(() => {
//     console.log('TurningCostReport - analysisData:', analysisData);
//     console.log('TurningCostReport - initialCostData:', initialCostData);
//     if (analysisData && initialCostData) {
//       const norm = normalizeCostData(initialCostData);
//       setCostData(norm);
//       setHistoryId(analysisData.id);
//       setUpdatedAnalysisData(analysisData);
//       if (typeof norm.quantity === 'number') setQuantity(norm.quantity);
//       console.log('TurningCostReport - cost data set:', normalizeCostData(initialCostData));
//     } else if (analysisData && !initialCostData) {
//       setUpdatedAnalysisData(analysisData);
//       // If no initial cost data, try to get the history ID from the latest record
//       fetchLatestHistoryId();
//     }
//     // Seed editable stock fields from analysis response
//     if (analysisData?.stock) {
//       setEditableStockDimensions({
//         stock_diameter: analysisData.stock.stock_diameter ?? null,
//         stock_length: analysisData.stock.stock_length ?? null,
//       });
//     } else if (analysisData) {
//       // Backward compatibility with previous keys
//       setEditableStockDimensions({
//         stock_diameter: analysisData.stock_diameter ?? null,
//         stock_length: analysisData.stock_length ?? null,
//       });
//     }
//   }, [analysisData, initialCostData]);

//   // Set initial cost data from initialCostData prop if available
//   useEffect(() => {
//     if (initialCostData && !costData) {
//       const norm = normalizeCostData(initialCostData);
//       setCostData(norm);
//       setHistoryId(analysisData?.id);
//       if (typeof norm.quantity === 'number') setQuantity(norm.quantity);
//     }
//   }, [initialCostData, costData, analysisData]);

//   // Expose report generator to parent (TurningViewerPage)
//   useEffect(() => {
//     if (typeof onRegisterReport === 'function') {
//       onRegisterReport(() => handleDownloadPDF(true));
//     }
//   }, [onRegisterReport, costData, quantity, distribution, analysisData, updatedAnalysisData]);

//   // Function to get the latest history ID - this will be called when user clicks "Get Cost"
//   const fetchLatestHistoryId = async () => {
//     try {
//       const response = await fetch('http://localhost:5678/machining-costs');
//       if (response.ok) {
//         const data = await response.json();
//         if (data && data.length > 0) {
//           const latestRecord = data[data.length - 1];
//           setHistoryId(latestRecord.history_id);
//           console.log('Found history ID from latest record:', latestRecord.history_id);
//           return latestRecord.history_id;
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching latest history ID:', error);
//       message.error('Could not find history record. Please try again.');
//     }
//     return null;
//   };

//   // Initialize editable stock dimensions when analysisData changes
//   useEffect(() => {
//     if (analysisData?.stock_dimensions) {
//       setEditableStockDimensions({
//         stock_diameter: analysisData.stock_diameter || null,
//         stock_length: analysisData.stock_length || null
//       });
//     }
//   }, [analysisData]);

//   const handleStockDimensionChange = (field, value) => {
//     setEditableStockDimensions(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const updateStockDimensions = async () => {
//     if (!historyId) {
//       message.error('No calculation history available');
//       return;
//     }

//     setIsCalculating(true);
//     try {
//       const formData = new URLSearchParams();
//       formData.append('turning_history_id', historyId);
//       formData.append('stock_diameter', editableStockDimensions.stock_diameter);
//       formData.append('stock_length', editableStockDimensions.stock_length);

//       const response = await fetch('http://localhost:5678/turning/update-stock/', {
//         method: 'PUT',
//         headers: {
//           'accept': 'application/json',
//           'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         body: formData
//       });

//       if (!response.ok) throw new Error('Failed to update stock dimensions');

//       const result = await response.json();
//       console.log('Stock update response:', result);

//       // Update cost data with all new values from response
//       setCostData(prev => ({
//         ...prev,
//         stock_diameter: result.stock_diameter ?? prev?.stock_diameter,
//         stock_length: result.stock_length ?? prev?.stock_length,
//         stock_volume_mm3: result.stock_volume_mm3 ?? prev?.stock_volume_mm3,
//         stock_weight_kg: result.stock_weight_kg ?? prev?.stock_weight_kg,
//         total_machining_cost_per_unit: result.total_machining_cost_per_unit ?? prev?.total_machining_cost_per_unit,
//         total_machining_cost: result.total_machining_cost ?? prev?.total_machining_cost,
//         total_cost_without_material_cost: result.total_cost_without_material_cost ?? prev?.total_cost_without_material_cost,
//         total_cost_with_material_cost: result.total_cost_with_material_cost ?? prev?.total_cost_with_material_cost,
//         Material_cost_per_unit: result.Material_cost_per_unit ?? prev?.Material_cost_per_unit,
//         total_material_cost: result.total_material_cost ?? prev?.total_material_cost
//       }));

//       // Update the local analysis data to reflect new stock dimensions and volume
//       setUpdatedAnalysisData(prev => ({
//         ...prev,
//         stock: {
//           ...prev?.stock,
//           stock_diameter: result.stock_diameter ?? editableStockDimensions.stock_diameter,
//           stock_length: result.stock_length ?? editableStockDimensions.stock_length,
//           stock_volume_mm3: result.stock_volume_mm3 ?? prev?.stock?.stock_volume_mm3,
//           stock_weight_kg: result.stock_weight_kg ?? prev?.stock?.stock_weight_kg
//         }
//       }));

//       message.success('Stock dimensions updated and cost recalculated');
//     } catch (error) {
//       console.error('Error updating stock dimensions:', error);
//       message.error('Failed to update stock dimensions');
//     } finally {
//       setIsCalculating(false);
//     }
//   };


//   // UI helpers for distribution
//   const addDistributionRow = () => {
//     setDistribution(prev => [...prev, { operation: 'turning', percent: 0 }]);
//   };

//   const updateDistributionRow = (index, key, value) => {
//     setDistribution(prev => prev.map((row, i) => {
//       if (i === index) {
//         return { ...row, [key]: value };
//       }
//       return row;
//     }));
//   };

//   const removeDistributionRow = (index) => {
//     if (distribution.length === 1) return;
//     setDistribution(prev => prev.filter((_, i) => i !== index));
//   };

//   // Recalculate cost with updated operation distribution - NOW USES /turning_update_machining_cost/
//   const recalculateCost = async () => {
//     let currentHistoryId = historyId;

//     // If no history ID, try to get it from latest record
//     if (!currentHistoryId) {
//       currentHistoryId = await fetchLatestHistoryId();
//       if (!currentHistoryId) {
//         message.error('No calculation history available');
//         return;
//       }
//     }

//     const total = distribution.reduce((s, d) => s + (Number(d.percent) || 0), 0);
//     if (total <= 0 || total > 100) {
//       message.error('Operation distribution must sum to 1–100%');
//       return;
//     }

//     setIsCalculating(true);
//     try {
//       const formData = new URLSearchParams();
//       formData.append('turning_history_id', currentHistoryId);
//       formData.append('turning_percentage', distribution.find(d => d.operation === 'turning')?.percent || 0);
//       formData.append('boring_percentage', distribution.find(d => d.operation === 'boring')?.percent || 0);
//       formData.append('threading_percentage', distribution.find(d => d.operation === 'threading')?.percent || 0);
//       formData.append('milling_percentage', distribution.find(d => d.operation === 'milling')?.percent || 0);

//       // Use the new endpoint: /turning_update_machining_cost/
//       const response = await fetch('http://localhost:5678/turning_update_machining_cost/', {
//         method: 'POST',
//         headers: {
//           'accept': 'application/json',
//           'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         body: formData
//       });

//       if (!response.ok) throw new Error('Failed to recalculate cost');

//       const result = await response.json();
//       console.log('Recalculate cost response:', result);

//       const norm = normalizeCostData(result);
//       setCostData(prev => ({ ...prev, ...norm }));
//       message.success('Cost recalculated successfully');
//     } catch (error) {
//       console.error('Error recalculating cost:', error);
//       message.error('Failed to recalculate cost');
//     } finally {
//       setIsCalculating(false);
//     }
//   };

//   const updateQuantity = async (newQuantity) => {
//     let currentHistoryId = historyId;

//     // If no history ID, try to get it from latest record
//     if (!currentHistoryId) {
//       currentHistoryId = await fetchLatestHistoryId();
//       if (!currentHistoryId) {
//         message.error('No calculation history available');
//         return;
//       }
//     }

//     setIsCalculating(true);

//     try {
//       const formData = new URLSearchParams();
//       formData.append('turning_history_id', currentHistoryId);
//       formData.append('quantity', newQuantity);

//       const response = await fetch(`http://localhost:5678/update-quantity`, {
//         method: 'PUT',
//         headers: {
//           'accept': 'application/json',
//           'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         body: formData
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update quantity');
//       }

//       const result = await response.json();
//       setCostData(prev => ({
//         ...prev,
//         total_machining_cost_per_unit: result.total_machining_cost_per_unit ?? prev.total_machining_cost_per_unit,
//         total_machining_cost: result.total_machining_cost ?? prev.total_machining_cost,
//         total_cost_without_material_cost: result.total_cost_without_material_cost ?? prev.total_cost_without_material_cost,
//         total_cost_with_material_cost: result.total_cost_with_material_cost ?? prev.total_cost_with_material_cost,
//         Material_cost_per_unit: result.Material_cost_per_unit ?? prev.Material_cost_per_unit,
//         total_material_cost: result.total_material_cost ?? prev.total_material_cost
//       }));
//       setQuantity(newQuantity);
//       message.success('Quantity updated successfully');
//     } catch (error) {
//       console.error('Error updating quantity:', error);
//       message.error('Failed to update quantity');
//     } finally {
//       setIsCalculating(false);
//     }
//   };

//   const handleQuantityChange = (e) => {
//     const newQuantity = parseInt(e.target.value) || 1;
//     setQuantity(newQuantity);
//     // Always update quantity when it changes
//     if (historyId) {
//       updateQuantity(newQuantity);
//     }
//   };

//   const formatCurrency = (value) => {
//     if (value === null || value === undefined) return 'N/A';
//     const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
//     return `Rs.${numValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//   };

//   const handleDownloadPDF = async (previewOnly = false) => {
//     try {
//       message.loading('Generating PDF report...', 0);

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

//       const safeString = (value) => {
//         if (value === null || value === undefined) return 'N/A';
//         return String(value);
//       };

//       const formatCurrencyForPDF = (value) => {
//         if (value === null || value === undefined) return 'N/A';
//         const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
//         return `Rs.${numValue.toLocaleString('en-IN', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;
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

//       // Set default font - GEORGIA
//       pdf.setFont('georgia', 'normal');

//       // Header background
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

//       pdf.setTextColor(0, 0, 0);
//       pdf.setFontSize(14);
//       pdf.setFont('times', 'bold');
//       pdf.text(`Filename: ${safeString(costData?.filename || analysisData?.filename || 'N/A')}`, margin, yPosition);
//       pdf.setFontSize(10);
//       pdf.setFont('times', 'normal');
//       pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, yPosition, { align: 'right' });

//       yPosition += 15;

//       // 3D Model Screenshot
//       const capture3DModelScreenshot = () => {
//         return new Promise((resolve) => {
//           requestAnimationFrame(() => {
//             try {
//               const canvases = document.querySelectorAll('canvas');
//               let targetCanvas = null;

//               canvases.forEach(canvas => {
//                 if (canvas.width > 200 && canvas.height > 200) {
//                   if (!targetCanvas || (canvas.width * canvas.height) > (targetCanvas.width * targetCanvas.height)) {
//                     targetCanvas = canvas;
//                   }
//                 }
//               });

//               if (targetCanvas && targetCanvas.width > 0 && targetCanvas.height > 0) {
//                 try {
//                   const gl = targetCanvas.getContext('webgl') || targetCanvas.getContext('experimental-webgl');
//                   if (gl) {
//                     gl.finish();
//                   }

//                   const dataURL = targetCanvas.toDataURL('image/png', 1.0);

//                   if (dataURL && dataURL.length > 100) {
//                     console.log('Successfully captured 3D model screenshot');
//                     resolve(dataURL);
//                   } else {
//                     console.warn('Canvas capture returned empty image');
//                     resolve(null);
//                   }
//                 } catch (captureError) {
//                   console.warn('Error capturing canvas:', captureError);
//                   resolve(null);
//                 }
//               } else {
//                 console.warn('No suitable canvas found for screenshot');
//                 resolve(null);
//               }
//             } catch (error) {
//               console.warn('Error in screenshot capture:', error);
//               resolve(null);
//             }
//           });
//         });
//       };

//       const modelScreenshot = await capture3DModelScreenshot();

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

//       // Use updated analysis data if available
//       const currentAnalysis = updatedAnalysisData || analysisData;

//       if (currentAnalysis) {
//         tableData.push(['', '']);
//         tableData.push(['MODULE: Machining Module (Turning Process)', '']);

//         tableData.push(['MATERIAL DATA', '']);
//         tableData.push(['Material', safeString(costData?.material || currentAnalysis.material?.name || 'N/A')]);
//         tableData.push(['Density', currentAnalysis.material?.density ? `${safeString(currentAnalysis.material.density)} kg/m³` : 'N/A']);

//         if (currentAnalysis.volume) {
//           tableData.push(['', '']);
//           tableData.push(['FINAL COMPONENT ACTUAL DIMENSIONS', '']);
//           tableData.push(['Volume (mm³)', safeString(currentAnalysis.volume.mm3 || 'N/A')]);
//           tableData.push(['Mass', currentAnalysis.volume.actual_mass ? `${currentAnalysis.volume.actual_mass} kg` : 'N/A']);
//         }

//         if (currentAnalysis.derived_parameters) {
//           tableData.push(['', '']);
//           tableData.push(['BOUNDING BOX DIMENSIONS', '']);

//           const diameter = currentAnalysis.derived_parameters.diameter || 'N/A';
//           const axisLength = currentAnalysis.derived_parameters.axis_length || 'N/A';
//           const dimensionsFormat = `Diameter: ${diameter} mm, Length: ${axisLength} mm`;

//           tableData.push(['Diameter × Length', dimensionsFormat]);
//         }

//         if (currentAnalysis.stock) {
//           tableData.push(['', '']);
//           tableData.push(['STOCK DIMENSIONS', '']);
//           tableData.push(['Volume (mm³)', safeString(currentAnalysis.stock.stock_volume_mm3 || 'N/A')]);
//           tableData.push(['Mass', currentAnalysis.stock.stock_weight_kg ? `${currentAnalysis.stock.stock_weight_kg} kg` : 'N/A']);

//           tableData.push(['', '']);
//           tableData.push(['RECOMMENDED BOUNDING BOX DIMENSIONS', '']);

//           const stockDiameter = editableStockDimensions.stock_diameter || currentAnalysis.stock.stock_diameter || 'N/A';
//           const stockLength = editableStockDimensions.stock_length || currentAnalysis.stock.stock_length || 'N/A';
//           const stockDimensionsFormat = `Diameter: ${stockDiameter} mm, Length: ${stockLength} mm`;

//           tableData.push(['Diameter × Length', stockDimensionsFormat]);
//         }
//       }

//       tableData.push(['', '']);
//       tableData.push(['MANUFACTURING SETTINGS', '']);
//       const distStr = distribution.map(d => `${d.operation} ${d.percent}%`).join(', ');
//       tableData.push(['Operation Distribution', safeString(distStr || 'Turning 100%')]);
//       tableData.push(['Quantity', safeString(quantity)]);

//       if (costData) {
//         tableData.push(['', '']);
//         tableData.push(['COST SUMMARY', '']);
//         if (costData.material_cost_per_kg) {
//           tableData.push(['Material Cost per kg', formatCurrencyForPDF(costData.material_cost_per_kg)]);
//         }
//         if (costData.Material_cost_per_unit) {
//           tableData.push(['Material Cost Per Unit', formatCurrencyForPDF(costData.Material_cost_per_unit)]);
//         }
//         tableData.push(['Machining Cost Per Unit', formatCurrencyForPDF(costData.total_machining_cost_per_unit)]);
//         if (costData.total_material_cost) {
//           tableData.push(['Total Material Cost For Given Quantity', formatCurrencyForPDF(costData.total_material_cost)]);
//         }
//         if (costData.total_machining_cost) {
//           tableData.push(['Total Machining Cost For Given Quantity', formatCurrencyForPDF(costData.total_machining_cost)]);
//         }
//         if (costData.total_cost_with_material_cost) {
//           tableData.push(['OverAll Total Cost (Machining+Material cost)', formatCurrencyForPDF(costData.total_cost_with_material_cost)]);
//         }
//       }

//       const startY = yPosition;
//       const rowHeight = 5;
//       const col1Width = contentWidth * 0.6;

//       let currentY = startY;

//       tableData.forEach((row, index) => {
//         const [label, value] = row;

//         const isSectionHeader = label && !value && (label.includes('DIMENSIONS') || label.includes('SETTINGS') || label.includes('SUMMARY') || label.includes('EXTRA') || label.includes('MATERIAL DATA') || label.includes('MODULE:'));
//         const isEmptyRow = !label && !value;

//         if (isEmptyRow) {
//           currentY += rowHeight / 2;
//           return;
//         }

//         // PROFESSIONAL TABLE COLORS - Standard business colors
//         const getBackgroundColor = (label) => {
//           if (isSectionHeader) {
//             return [41, 128, 185]; // Professional dark blue
//           }
//           if (label.includes('Volume') || label.includes('Diameter') || label.includes('Length')) {
//             return [217, 237, 247]; // Light blue
//           }
//           if (label.includes('Operation') || label.includes('Quantity')) {
//             return [236, 236, 236]; // Light gray
//           }
//           if (label.includes('Cost') || label.includes('Mass')) {
//             return [245, 245, 245]; // Off-white gray
//           }
//           return [255, 255, 255]; // White for regular rows
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

//         pdf.setDrawColor(0, 0, 0); // BLACK BORDER
//         pdf.setLineWidth(0.15); // REDUCED BORDER SIZE
//         pdf.rect(margin, currentY - 1, contentWidth, rowHeight);

//         if (!isSectionHeader) {
//           pdf.line(margin + col1Width, currentY - 1, margin + col1Width, currentY + rowHeight - 1);
//         }

//         if (isSectionHeader) {
//           pdf.text(safeString(label), margin + 4, currentY + 2.5);
//         } else {
//           pdf.text(safeString(label), margin + 2, currentY + 2.5);

//           const isCostSummaryRow =
//             (label.includes('Cost') || label.includes('Machining')) &&
//             label !== 'MATERIAL DATA' &&
//             label !== 'Material';

//           if (isCostSummaryRow && label !== 'COST SUMMARY') {
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

//       // Output
//       if (previewOnly) {
//         const blob = pdf.output('blob');
//         const url = URL.createObjectURL(blob);
//         setPdfUrl(url);
//         setPdfPreviewVisible(true);
//       } else {
//         const filename = `Turning_Cost_Report_${analysisData?.filename?.replace(/\.[^/.]+$/, '') || 'Model'}_${new Date().getTime()}.pdf`;
//         pdf.save(filename);
//         message.success('PDF report downloaded successfully!');
//       }
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//       message.destroy();
//       message.error('Failed to generate PDF report');
//     }
//   };

//   if (!analysisData) {
//     return (
//       <div style={{ textAlign: 'center', padding: '40px', color: theme.textSecondary }}>
//         <Text>No analysis data available</Text>
//       </div>
//     );
//   }

//   return (
//     <div style={{ 
//       height: '100%', 
//       display: 'flex', 
//       flexDirection: 'column',
//       overflow: 'hidden'
//     }}>
//       <Modal
//         open={pdfPreviewVisible}
//         title="PDF Preview"
//         onCancel={() => setPdfPreviewVisible(false)}
//         footer={[
//           <Button key="cancel" onClick={() => setPdfPreviewVisible(false)}>Cancel</Button>,
//           <Button key="download" type="primary" onClick={() => { setPdfPreviewVisible(false); handleDownloadPDF(false); }}>Download PDF</Button>
//         ]}
//         width="80%"
//         bodyStyle={{ height: '70vh', padding: 0 }}
//       >
//         {pdfUrl && (
//           <iframe title="pdf" src={pdfUrl} style={{ border: 'none', width: '100%', height: '100%' }} />
//         )}
//       </Modal>

//       {/* Scrollable container for all content */}
//       <div 
//         ref={pdfRef} 
//         style={{ 
//           height: '100%',
//           overflowY: 'auto',
//           overflowX: 'hidden',
//           padding: '8px 0',
//           paddingRight: '8px'
//         }}
//       >
//       {/* Header Card */}
//       <Card 
//         style={{ borderRadius: '8px', marginBottom: '12px', backgroundColor: 'white' }}
//         bodyStyle={{ padding: '12px 16px' }}
//       >
//         <Title level={4} style={{ margin: 0, color: '#14539b', fontWeight: 600 }}>
//           Manufacturing Cost Report
//         </Title>
//       </Card>

//       {/* File and Material Info */}
//       <Row gutter={[12, 12]}>
//         <Col xs={24} md={12}>
//           <Card style={{ borderRadius: '8px', backgroundColor: 'white' }} bodyStyle={{ padding: '12px 16px' }}>
//             <Title level={5} style={{ marginTop: 0, color: '#14539b', fontWeight: 600 }}>File Information</Title>
//             <Row>
//               <Col span={24}>
//                 <div>
//                   <Text type="secondary">Filename:</Text>
//                   <div>{analysisData.filename || 'N/A'}</div>
//                 </div>
//               </Col>
//             </Row>
//           </Card>
//         </Col>
//         <Col xs={24} md={12}>
//           <Card style={{ borderRadius: '8px', backgroundColor: 'white' }} bodyStyle={{ padding: '12px 16px' }}>
//             <Title level={5} style={{ marginTop: 0, color: '#14539b', fontWeight: 600 }}>Material Information</Title>
//             <Row>
//               <Col span={12}>
//                 <div>
//                   <Text type="secondary">Material:</Text>
//                   <div>{analysisData.material?.name || 'N/A'}</div>
//                 </div>
//               </Col>
//               <Col span={12}>
//                 <div>
//                   <Text type="secondary">Density:</Text>
//                   <div>{analysisData.material?.density || 'N/A'} kg/m³</div>
//                 </div>
//               </Col>
//             </Row>
//           </Card>
//         </Col>
//       </Row>

//       {/* Dimensions */}
//       <Row gutter={[12, 12]} style={{ marginTop: '12px' }}>
//        <Col xs={24} md={12}>
//   <div
//     style={{
//       background: '#f0f9ff',
//       padding: '16px',
//       borderRadius: '8px',
//       borderLeft: '4px solid #14539b',
//       height: '100%',
//     }}
//   >
//     {/* BOUNDING BOX FIRST */}
//     <Title
//       level={5}
//       style={{
//         color: '#14539b',
//         fontWeight: 600,
//         marginBottom: '12px',
//         fontSize: '13px',
//       }}
//     >
//       BOUNDING BOX DIMENSIONS
//     </Title>

//     <div
//       style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         gap: '12px',
//         marginBottom: '20px',
//       }}
//     >
//       <div style={{ flex: 1 }}>
//         <span style={{ color: '#6b7280', fontSize: '12px' }}>Diameter:</span>
//         <div style={{ fontWeight: 500, color: '#374151', marginTop: '4px' }}>
//           {analysisData.derived_parameters?.diameter
//             ? `${analysisData.derived_parameters.diameter} mm`
//             : 'N/A'}
//         </div>
//       </div>
//       <div style={{ flex: 1 }}>
//         <span style={{ color: '#6b7280', fontSize: '12px' }}>Length:</span>
//         <div style={{ fontWeight: 500, color: '#374151', marginTop: '4px' }}>
//           {analysisData.derived_parameters?.axis_length
//             ? `${analysisData.derived_parameters.axis_length} mm`
//             : 'N/A'}
//         </div>
//       </div>
//     </div>

//     {/* FINAL COMPONENT ACTUAL DIMENSIONS BELOW */}
//     <Title
//       level={5}
//       style={{
//         marginTop: 0,
//         color: '#14539b',
//         fontWeight: 600,
//         fontSize: '14px',
//         marginBottom: '12px',
//       }}
//     >
//       FINAL COMPONENT ACTUAL DIMENSIONS
//     </Title>

//     <Row gutter={[16, 0]}>
//       <Col span={12}>
//         <span style={{ color: '#6b7280' }}>Volume (mm³):</span>
//         <div
//           style={{
//             fontWeight: 600,
//             fontSize: '16px',
//             color: '#374151',
//             marginTop: '4px',
//           }}
//         >
//           {analysisData.volume?.mm3 ?? 'N/A'}
//         </div>
//       </Col>

//       <Col span={12}>
//         <span style={{ color: '#6b7280' }}>Mass:</span>
//         <div
//           style={{
//             fontWeight: 600,
//             fontSize: '16px',
//             color: '#374151',
//             marginTop: '4px',
//           }}
//         >
//           {analysisData.volume?.actual_mass
//             ? `${analysisData.volume.actual_mass} kg`
//             : 'N/A'}
//         </div>
//       </Col>
//     </Row>
//   </div>
// </Col>

//       <Col xs={24} md={12}>
//   <div
//     style={{
//       background: '#f6ffed',
//       padding: '16px',
//       borderRadius: '8px',
//       borderLeft: '4px solid #22c55e',
//       height: '100%',
//     }}
//   >
//     {/* RECOMMENDED STOCK DIMENSIONS FIRST */}
//     <Title
//       level={5}
//       style={{
//         color: '#22c55e',
//         fontWeight: 600,
//         marginBottom: '12px',
//         fontSize: '13px',
//       }}
//     >
//       RECOMMENDED STOCK DIMENSIONS
//     </Title>

//     <div
//       style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         gap: '12px',
//         marginBottom: '16px',
//       }}
//     >
//       <div style={{ flex: 1 }}>
//         <span style={{ color: '#6b7280', fontSize: '12px' }}>
//           Stock Diameter (mm):
//         </span>
//         <Input
//           type="number"
//           value={editableStockDimensions.stock_diameter ?? ''}
//           onChange={(e) =>
//             handleStockDimensionChange('stock_diameter', e.target.value)
//           }
//           placeholder="Diameter"
//           size="small"
//           style={{
//             marginTop: '2px',
//             fontSize: '12px',
//           }}
//           suffix="mm"
//         />
//       </div>

//       <div style={{ flex: 1 }}>
//         <span style={{ color: '#6b7280', fontSize: '12px' }}>
//           Stock Length (mm):
//         </span>
//         <Input
//           type="number"
//           value={editableStockDimensions.stock_length ?? ''}
//           onChange={(e) =>
//             handleStockDimensionChange('stock_length', e.target.value)
//           }
//           placeholder="Length"
//           size="small"
//           style={{
//             marginTop: '2px',
//             fontSize: '12px',
//           }}
//           suffix="mm"
//         />
//       </div>
//     </div>

//     <div style={{ textAlign: 'center', marginBottom: '20px' }}>
//       <Button
//         type="primary"
//         size="small"
//         onClick={updateStockDimensions}
//         loading={isCalculating}
//         style={{
//           backgroundColor: '#22c55e',
//           borderColor: '#22c55e',
//           fontSize: '12px',
//           height: '28px',
//         }}
//       >
//         Update Dimensions
//       </Button>
//     </div>

//     {/* STOCK DIMENSIONS BELOW */}
//     <Title
//       level={5}
//       style={{
//         color: '#22c55e',
//         fontSize: '14px',
//         marginBottom: '12px',
//         display: 'block',
//         fontWeight: 600,
//       }}
//     >
//       STOCK DIMENSIONS
//     </Title>

//     <Row gutter={[16, 0]}>
//       <Col span={12}>
//         <span style={{ color: '#6b7280' }}>Volume (mm³):</span>
//         <div
//           style={{
//             fontWeight: 600,
//             fontSize: '16px',
//             color: '#374151',
//             marginTop: '4px',
//           }}
//         >
//           {(updatedAnalysisData || analysisData).stock?.stock_volume_mm3 ??
//             'N/A'}
//         </div>
//       </Col>

//       <Col span={12}>
//         <span style={{ color: '#6b7280' }}>Mass:</span>
//         <div
//           style={{
//             fontWeight: 600,
//             fontSize: '16px',
//             color: '#374151',
//             marginTop: '4px',
//           }}
//         >
//           {(updatedAnalysisData || analysisData).stock?.stock_weight_kg
//             ? `${(updatedAnalysisData || analysisData).stock.stock_weight_kg} kg`
//             : 'N/A'}
//         </div>
//       </Col>
//     </Row>
//   </div>
// </Col>

//       </Row>

//       {/* Manufacturing Settings */}
//       <Card style={{ borderRadius: '8px', marginTop: '12px', backgroundColor: 'white' }} bodyStyle={{ padding: '12px 16px' }}>
//         <Title level={5} style={{ marginTop: 0, color: '#14539b', fontWeight: 600 }}>Manufacturing Operation</Title>
//         <Row gutter={[8, 8]} align="middle">
//           <Col xs={24} md={18}>
//             {distribution.map((row, index) => (
//               <Row key={index} gutter={[8, 8]} style={{ marginBottom: '8px' }}>
//                 <Col span={12}>
//                   <Select
//                     value={row.operation}
//                     onChange={(val) => updateDistributionRow(index, 'operation', val)}
//                     style={{ width: '100%' }}
//                   >
//                     {turningOperations.map(op => (
//                       <Option key={op.value} value={op.value}>{op.label}</Option>
//                     ))}
//                   </Select>
//                 </Col>
//                 <Col span={8}>
//                   <Input
//                     type="number"
//                     min={0}
//                     max={100}
//                     value={row.percent}
//                     onChange={(e) => updateDistributionRow(index, 'percent', e.target.value)}
//                     suffix="%"
//                   />
//                 </Col>
//                 <Col span={4}>
//                   <Button danger onClick={() => removeDistributionRow(index)} disabled={distribution.length === 1}>Remove</Button>
//                 </Col>
//               </Row>
//             ))}
//             <Button 
//               onClick={addDistributionRow} 
//               style={{ marginRight: 8, backgroundColor: 'white', borderColor: '#14539b', color: '#14539b' }}
//             >
//               Add Operation
//             </Button>
//             <Button 
//               type="primary" 
//               onClick={recalculateCost} 
//               loading={isCalculating}
//               style={{ backgroundColor: '#14539b', borderColor: '#14539b' }}
//             >
//               Get Cost
//             </Button>
//           </Col>
//           <Col xs={24} md={6}>
//             <Text type="secondary">Quantity:</Text>
//             <Input 
//               type="number" 
//               value={quantity}
//               onChange={handleQuantityChange}
//               min={1}
//             />
//           </Col>
//         </Row>
//       </Card>

//       {/* Cost Summary */}
//       <Card style={{ borderRadius: '8px', marginTop: '12px', backgroundColor: 'white' }} bodyStyle={{ padding: '12px 16px' }}>
//         <Title level={5} style={{ marginTop: 0, color: '#14539b', fontWeight: 600 }}>Cost Summary</Title>
//         {isCalculating ? (
//           <div style={{ textAlign: 'center', padding: '20px', color: theme.textSecondary }}>Calculating cost...</div>
//         ) : costData ? (
//           <>
//             {/* Row 1: Machining per-unit and Total Machining - Always visible */}
//             <Row gutter={[16, 16]}>
//               <Col span={12}>
//                 <div style={{
//                   padding: '12px',
//                   background: '#f0f9ff66',
//                   borderRadius: '8px',
//                   border: '1px solid #14539b22'
//                 }}>
//                   <div style={{ textAlign: 'center' }}>
//                     <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Manufaturing Cost Per Unit</div>
//                     <div style={{ fontSize: 18, fontWeight: 600, color: '#14539b' }}>{formatCurrency(costData.total_machining_cost_per_unit)}</div>
//                   </div>
//                 </div>
//               </Col>
//               <Col span={12}>
//                 <div style={{
//                   padding: '12px',
//                   background: '#f0f9ff66',
//                   borderRadius: '8px',
//                   border: '1px solid #14539b22'
//                 }}>
//                   <div style={{ textAlign: 'center' }}>
//                     <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Total Manufaturing Cost</div>
//                     <div style={{ fontSize: 18, fontWeight: 600, color: '#14539b' }}>{formatCurrency(costData.total_machining_cost)}</div>
//                   </div>
//                 </div>
//               </Col>
//             </Row>

//             {/* Include Material Cost toggle */}
//             <div style={{ marginTop: '20px', marginBottom: '16px' }}>
//               <Checkbox 
//                 checked={includeMaterialCost} 
//                 onChange={(e) => setIncludeMaterialCost(e.target.checked)}
//                 style={{ 
//                   fontSize: '14px',
//                   color: '#374151',
//                   fontWeight: 500
//                 }}
//               >
//                 Include Material Cost
//               </Checkbox>
//             </div>

//             {/* Material costs and Total costs - Only show when checkbox is checked */}
//             {includeMaterialCost && (
//               <>
//                 {/* Row 2: Material per-unit and Total Material */}
//                 <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
//                   <Col span={12}>
//                     <div style={{
//                       padding: '12px',
//                       background: '#fff2e666',
//                       borderRadius: '8px',
//                       border: '1px solid #fa8c1622'
//                     }}>
//                       <div style={{ textAlign: 'center' }}>
//                         <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Material Cost Per Unit</div>
//                         <div style={{ fontSize: 16, fontWeight: 600, color: '#fa8c16' }}>{formatCurrency(costData.Material_cost_per_unit)}</div>
//                       </div>
//                     </div>
//                   </Col>
//                   <Col span={12}>
//                     <div style={{
//                       padding: '12px',
//                       background: '#fff2e666',
//                       borderRadius: '8px',
//                       border: '1px solid #fa8c1622'
//                     }}>
//                       <div style={{ textAlign: 'center' }}>
//                         <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Total Material Cost</div>
//                         <div style={{ fontSize: 16, fontWeight: 600, color: '#fa8c16' }}>{formatCurrency(costData.total_material_cost)}</div>
//                       </div>
//                     </div>
//                   </Col>
//                 </Row>
//                 <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
//                   <Col span={12}>
//                     <div style={{
//                       padding: '16px',
//                       background: '#f0f9ff66',
//                       borderRadius: '8px',
//                       border: '1px solid #14539b22',
//                       textAlign: 'center'
//                     }}>
//                       <div style={{ color: '#6b7280', fontSize: '16px', marginBottom: '8px' }}>Manufacturing Cost (Rs)</div>
//                       <div style={{ fontSize: 20, fontWeight: 700, color: '#14539b' }}>{formatCurrency(costData.total_cost_without_material_cost)}</div>
//                     </div>
//                   </Col>
//                   <Col span={12}>
//                     <div style={{
//                       padding: '16px',
//                       background: '#e6f7ff66',
//                       borderRadius: '8px',
//                       border: '1px solid #14539b22',
//                       textAlign: 'center'
//                     }}>
//                       <div style={{ color: '#6b7280', fontSize: '16px', marginBottom: '8px' }}>Total Cost including materials</div>
//                       <div style={{ fontSize: 20, fontWeight: 700, color: '#14539b' }}>{formatCurrency(costData.total_cost_with_material_cost)}</div>
//                     </div>
//                   </Col>
//                 </Row>
//               </>
//             )}
//           </>
//         ) : (
//           <div style={{ textAlign: 'center', padding: '20px', color: theme.textSecondary }}>
//             {initialCostData ? 'Initial cost data will be displayed here' : 'Click "Get Cost" to calculate turning operation costs'}
//           </div>
//         )}
//       </Card>
//       </div>
//     </div>
//   );
// };

// export default TurningCostReport;





//''''''this is my working code ''''''''//
// import React, { useState, useEffect, useRef } from 'react';
// import { Card, Typography, Row, Col, Button, Input, Select, message, Modal, Checkbox } from 'antd';
// import jsPDF from 'jspdf';

// const { Title, Text } = Typography;
// const { Option } = Select;

// const TurningCostReport = ({ analysisData, theme, objUrl, onCostCalculationComplete, initialCostData, onRegisterReport }) => {
//   const [quantity, setQuantity] = useState(1);
//   const [costData, setCostData] = useState(null);
//   const [isCalculating, setIsCalculating] = useState(false);
//   const [includeMaterialCost, setIncludeMaterialCost] = useState(false);
//   const [historyId, setHistoryId] = useState(null);
//   const [updatedAnalysisData, setUpdatedAnalysisData] = useState(null);
//   const [sizeOptions, setSizeOptions] = useState([]);
//   const [selectedSizes, setSelectedSizes] = useState({
//     turning: null,
//     boring: null,
//     threading: null,
//     milling: null
//   });

//   // Turning operations distribution
//   const [distribution, setDistribution] = useState([
//     { operation: 'turning', percent: 100 },
//     { operation: 'boring', percent: 0 },
//     { operation: 'threading', percent: 0 },
//     { operation: 'milling', percent: 0 }
//   ]);

//   const [editableStockDimensions, setEditableStockDimensions] = useState({
//     stock_diameter: null,
//     stock_length: null
//   });

//   const pdfRef = useRef();
//   const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);
//   const [pdfUrl, setPdfUrl] = useState(null);

//   const turningOperations = [
//     { value: 'turning', label: 'Turning' },
//     { value: 'boring', label: 'Boring' },
//     { value: 'threading', label: 'Threading' },
//     { value: 'milling', label: 'Milling' }
//   ];

//   // Fetch size options from the endpoint
//   useEffect(() => {
//     const fetchSizeOptions = async () => {
//       try {
//         const response = await fetch('http://localhost:5678/turning-machine-hour-rates/');
//         if (response.ok) {
//           const result = await response.json();
//           if (result.data) {
//             setSizeOptions(result.data);
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching size options:', error);
//       }
//     };

//     fetchSizeOptions();
//   }, []);

//   // Get unique sizes for a specific material
//   const getSizesForMaterial = (materialName) => {
//     if (!sizeOptions || !materialName) return [];

//     const filtered = sizeOptions.filter(option => 
//       option.material && option.material.toLowerCase() === materialName.toLowerCase()
//     );

//     // Remove duplicates based on diameter_condition
//     const uniqueSizes = [...new Set(filtered.map(item => item.diameter_condition))];
//     return uniqueSizes;
//   };

//   // Normalize backend response keys
//   const normalizeCostData = (data) => {
//     if (!data || typeof data !== 'object') return data;
//     return {
//       ...data,
//       // per-unit machining cost
//       total_machining_cost_per_unit: data.total_machining_cost_per_unit ?? data.cost_per_unit,
//       // total machining cost for quantity
//       total_machining_cost: data.total_Machining_cost ?? data.total_machining_cost,
//       // totals
//       total_cost_without_material_cost: data.total_cost_without_material_cost ?? data.total_cost,
//       total_cost_with_material_cost: data.total_cost_with_material_cost ?? data.with_material_cost,
//       // material costs
//       Material_cost_per_unit: data.Material_cost_per_unit ?? data.Material_cost_perunit ?? data.material_cost_per_unit,
//       total_material_cost: data.total_material_cost ?? ((data.Material_cost_per_unit ?? data.Material_cost_perunit ?? 0) * (data.quantity ?? quantity ?? 1)),
//       // stock data
//       stock_volume_mm3: data.stock_volume_mm3,
//       stock_weight_kg: data.stock_weight_kg,
//       // sizes
//       turning_size: data.turning_size,
//       boring_size: data.boring_size,
//       threading_size: data.threading_size,
//       milling_size: data.milling_size
//     };
//   };

//   // Initialize cost data from navigation state
//   useEffect(() => {
//     console.log('TurningCostReport - analysisData:', analysisData);
//     console.log('TurningCostReport - initialCostData:', initialCostData);
//     if (analysisData && initialCostData) {
//       const norm = normalizeCostData(initialCostData);
//       setCostData(norm);
//       setHistoryId(analysisData.id);
//       setUpdatedAnalysisData(analysisData);
//       if (typeof norm.quantity === 'number') setQuantity(norm.quantity);

//       // Set initial sizes from cost data
//       setSelectedSizes({
//         turning: norm.turning_size || null,
//         boring: norm.boring_size || null,
//         threading: norm.threading_size || null,
//         milling: norm.milling_size || null
//       });

//       console.log('TurningCostReport - cost data set:', normalizeCostData(initialCostData));
//     } else if (analysisData && !initialCostData) {
//       setUpdatedAnalysisData(analysisData);
//       // If no initial cost data, try to get the history ID from the latest record
//       fetchLatestHistoryId();
//     }
//     // Seed editable stock fields from analysis response
//     if (analysisData?.stock) {
//       setEditableStockDimensions({
//         stock_diameter: analysisData.stock.stock_diameter ?? null,
//         stock_length: analysisData.stock.stock_length ?? null,
//       });
//     } else if (analysisData) {
//       // Backward compatibility with previous keys
//       setEditableStockDimensions({
//         stock_diameter: analysisData.stock_diameter ?? null,
//         stock_length: analysisData.stock_length ?? null,
//       });
//     }
//   }, [analysisData, initialCostData]);

//   // Set initial cost data from initialCostData prop if available
//   useEffect(() => {
//     if (initialCostData && !costData) {
//       const norm = normalizeCostData(initialCostData);
//       setCostData(norm);
//       setHistoryId(analysisData?.id);
//       if (typeof norm.quantity === 'number') setQuantity(norm.quantity);

//       // Set initial sizes from cost data
//       setSelectedSizes({
//         turning: norm.turning_size || null,
//         boring: norm.boring_size || null,
//         threading: norm.threading_size || null,
//         milling: norm.milling_size || null
//       });
//     }
//   }, [initialCostData, costData, analysisData]);

//   // Expose report generator to parent (TurningViewerPage)
//   useEffect(() => {
//     if (typeof onRegisterReport === 'function') {
//       onRegisterReport(() => handleDownloadPDF(true));
//     }
//   }, [onRegisterReport, costData, quantity, distribution, analysisData, updatedAnalysisData]);

//   // Function to get the latest history ID - this will be called when user clicks "Get Cost"
//   const fetchLatestHistoryId = async () => {
//     try {
//       const response = await fetch('http://localhost:5678/machining-costs');
//       if (response.ok) {
//         const data = await response.json();
//         if (data && data.length > 0) {
//           const latestRecord = data[data.length - 1];
//           setHistoryId(latestRecord.history_id);
//           console.log('Found history ID from latest record:', latestRecord.history_id);
//           return latestRecord.history_id;
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching latest history ID:', error);
//       message.error('Could not find history record. Please try again.');
//     }
//     return null;
//   };

//   // Initialize editable stock dimensions when analysisData changes
//   useEffect(() => {
//     if (analysisData?.stock_dimensions) {
//       setEditableStockDimensions({
//         stock_diameter: analysisData.stock_diameter || null,
//         stock_length: analysisData.stock_length || null
//       });
//     }
//   }, [analysisData]);

//   const handleStockDimensionChange = (field, value) => {
//     setEditableStockDimensions(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const updateStockDimensions = async () => {
//     if (!historyId) {
//       message.error('No calculation history available');
//       return;
//     }

//     setIsCalculating(true);
//     try {
//       const formData = new URLSearchParams();
//       formData.append('turning_history_id', historyId);
//       formData.append('stock_diameter', editableStockDimensions.stock_diameter);
//       formData.append('stock_length', editableStockDimensions.stock_length);

//       const response = await fetch('http://localhost:5678/turning/update-stock/', {
//         method: 'PUT',
//         headers: {
//           'accept': 'application/json',
//           'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         body: formData
//       });

//       if (!response.ok) throw new Error('Failed to update stock dimensions');

//       const result = await response.json();
//       console.log('Stock update response:', result);

//       // Update cost data with all new values from response
//       setCostData(prev => ({
//         ...prev,
//         stock_diameter: result.stock_diameter ?? prev?.stock_diameter,
//         stock_length: result.stock_length ?? prev?.stock_length,
//         stock_volume_mm3: result.stock_volume_mm3 ?? prev?.stock_volume_mm3,
//         stock_weight_kg: result.stock_weight_kg ?? prev?.stock_weight_kg,
//         total_machining_cost_per_unit: result.total_machining_cost_per_unit ?? prev?.total_machining_cost_per_unit,
//         total_machining_cost: result.total_machining_cost ?? prev?.total_machining_cost,
//         total_cost_without_material_cost: result.total_cost_without_material_cost ?? prev?.total_cost_without_material_cost,
//         total_cost_with_material_cost: result.total_cost_with_material_cost ?? prev?.total_cost_with_material_cost,
//         Material_cost_per_unit: result.Material_cost_per_unit ?? prev?.Material_cost_per_unit,
//         total_material_cost: result.total_material_cost ?? prev?.total_material_cost,
//               // ADD THIS LINE:
//         total_cost_per_unit_with_materials: result.total_cost_per_unit_with_materials ?? 
//                                           result.total_cost_with_material_cost_per_unit ?? 
//                                           prev?.total_cost_per_unit_with_materials

//       }));

//       // Update the local analysis data to reflect new stock dimensions and volume
//       setUpdatedAnalysisData(prev => ({
//         ...prev,
//         stock: {
//           ...prev?.stock,
//           stock_diameter: result.stock_diameter ?? editableStockDimensions.stock_diameter,
//           stock_length: result.stock_length ?? editableStockDimensions.stock_length,
//           stock_volume_mm3: result.stock_volume_mm3 ?? prev?.stock?.stock_volume_mm3,
//           stock_weight_kg: result.stock_weight_kg ?? prev?.stock?.stock_weight_kg
//         }
//       }));

//       message.success('Stock dimensions updated and cost recalculated');
//     } catch (error) {
//       console.error('Error updating stock dimensions:', error);
//       message.error('Failed to update stock dimensions');
//     } finally {
//       setIsCalculating(false);
//     }
//   };


//   // UI helpers for distribution
//   const addDistributionRow = () => {
//     setDistribution(prev => [...prev, { operation: 'turning', percent: 0 }]);
//   };

//   const updateDistributionRow = (index, key, value) => {
//     setDistribution(prev => prev.map((row, i) => {
//       if (i === index) {
//         return { ...row, [key]: value };
//       }
//       return row;
//     }));
//   };

//   const removeDistributionRow = (index) => {
//     if (distribution.length === 1) return;
//     setDistribution(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleSizeChange = (operation, size) => {
//     setSelectedSizes(prev => ({
//       ...prev,
//       [operation]: size
//     }));
//   };

//   // Recalculate cost with updated operation distribution - NOW USES /turning_update_machining_cost/
//   const recalculateCost = async () => {
//     let currentHistoryId = historyId;

//     // If no history ID, try to get it from latest record
//     if (!currentHistoryId) {
//       currentHistoryId = await fetchLatestHistoryId();
//       if (!currentHistoryId) {
//         message.error('No calculation history available');
//         return;
//       }
//     }

//     const total = distribution.reduce((s, d) => s + (Number(d.percent) || 0), 0);
//     if (total <= 0 || total > 100) {
//       message.error('Operation distribution must sum to 1–100%');
//       return;
//     }

//     setIsCalculating(true);
//     try {
//       const formData = new URLSearchParams();
//       formData.append('turning_history_id', currentHistoryId);
//       formData.append('turning_percentage', distribution.find(d => d.operation === 'turning')?.percent || 0);
//       formData.append('boring_percentage', distribution.find(d => d.operation === 'boring')?.percent || 0);
//       formData.append('threading_percentage', distribution.find(d => d.operation === 'threading')?.percent || 0);
//       formData.append('milling_percentage', distribution.find(d => d.operation === 'milling')?.percent || 0);

//       // Add sizes to the request
//       if (selectedSizes.turning) formData.append('turning_size', selectedSizes.turning);
//       if (selectedSizes.boring) formData.append('boring_size', selectedSizes.boring);
//       if (selectedSizes.threading) formData.append('threading_size', selectedSizes.threading);
//       if (selectedSizes.milling) formData.append('milling_size', selectedSizes.milling);

//       // Use the new endpoint: /turning_update_machining_cost/
//       const response = await fetch('http://localhost:5678/turning_update_machining_cost/', {
//         method: 'POST',
//         headers: {
//           'accept': 'application/json',
//           'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         body: formData
//       });

//       if (!response.ok) throw new Error('Failed to recalculate cost');

//       const result = await response.json();
//       console.log('Recalculate cost response:', result);

//       const norm = normalizeCostData(result);
//       setCostData(prev => ({ ...prev, ...norm }));

//       // Update selected sizes from response
//       setSelectedSizes({
//         turning: norm.turning_size || selectedSizes.turning,
//         boring: norm.boring_size || selectedSizes.boring,
//         threading: norm.threading_size || selectedSizes.threading,
//         milling: norm.milling_size || selectedSizes.milling
//       });

//       message.success('Cost recalculated successfully');
//     } catch (error) {
//       console.error('Error recalculating cost:', error);
//       message.error('Failed to recalculate cost');
//     } finally {
//       setIsCalculating(false);
//     }
//   };

//   const updateQuantity = async (newQuantity) => {
//     let currentHistoryId = historyId;

//     // If no history ID, try to get it from latest record
//     if (!currentHistoryId) {
//       currentHistoryId = await fetchLatestHistoryId();
//       if (!currentHistoryId) {
//         message.error('No calculation history available');
//         return;
//       }
//     }

//     setIsCalculating(true);

//     try {
//       const formData = new URLSearchParams();
//       formData.append('turning_history_id', currentHistoryId);
//       formData.append('quantity', newQuantity);

//       const response = await fetch(`http://localhost:5678/update-quantity`, {
//         method: 'PUT',
//         headers: {
//           'accept': 'application/json',
//           'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         body: formData
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update quantity');
//       }

//       const result = await response.json();
//       setCostData(prev => ({
//         ...prev,
//         total_machining_cost_per_unit: result.total_machining_cost_per_unit ?? prev.total_machining_cost_per_unit,
//         total_machining_cost: result.total_machining_cost ?? prev.total_machining_cost,
//         total_cost_without_material_cost: result.total_cost_without_material_cost ?? prev.total_cost_without_material_cost,
//         total_cost_with_material_cost: result.total_cost_with_material_cost ?? prev.total_cost_with_material_cost,
//         Material_cost_per_unit: result.Material_cost_per_unit ?? prev.Material_cost_per_unit,
//         total_material_cost: result.total_material_cost ?? prev.total_material_cost,
//         total_cost_per_unit_with_materials: result.total_cost_per_unit_with_materials 
//       }));
//       setQuantity(newQuantity);
//       message.success('Quantity updated successfully');
//     } catch (error) {
//       console.error('Error updating quantity:', error);
//       message.error('Failed to update quantity');
//     } finally {
//       setIsCalculating(false);
//     }
//   };

//   const handleQuantityChange = (e) => {
//     const newQuantity = parseInt(e.target.value) || 1;
//     setQuantity(newQuantity);
//     // Always update quantity when it changes
//     if (historyId) {
//       updateQuantity(newQuantity);
//     }
//   };

//   const formatCurrency = (value) => {
//     if (value === null || value === undefined) return 'N/A';
//     const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
//     return `Rs.${numValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//   };

//   const handleDownloadPDF = async (previewOnly = false) => {
//     try {
//       message.loading('Generating PDF report...', 0);

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

//       const safeString = (value) => {
//         if (value === null || value === undefined) return 'N/A';
//         return String(value);
//       };

//       const formatCurrencyForPDF = (value) => {
//         if (value === null || value === undefined) return 'N/A';
//         const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
//         return `Rs.${numValue.toLocaleString('en-IN', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;
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

//       // Set default font - GEORGIA
//       pdf.setFont('georgia', 'normal');

//       // Header background
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

//       pdf.setTextColor(0, 0, 0);
//       pdf.setFontSize(14);
//       pdf.setFont('times', 'bold');
//       pdf.text(`Filename: ${safeString(costData?.filename || analysisData?.filename || 'N/A')}`, margin, yPosition);
//       pdf.setFontSize(10);
//       pdf.setFont('times', 'normal');
//       pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, yPosition, { align: 'right' });

//       yPosition += 15;


//       // 3D Model Screenshot //''commented this  below function to capture 3d  in iso just added only one line below this function 
//       // const capture3DModelScreenshot = () => {
//       //   return new Promise((resolve) => {
//       //     requestAnimationFrame(() => {
//       //       try {
//       //         const canvases = document.querySelectorAll('canvas');
//       //         let targetCanvas = null;

//       //         canvases.forEach(canvas => {
//       //           if (canvas.width > 200 && canvas.height > 200) {
//       //             if (!targetCanvas || (canvas.width * canvas.height) > (targetCanvas.width * targetCanvas.height)) {
//       //               targetCanvas = canvas;
//       //             }
//       //           }
//       //         });

//       //         if (targetCanvas && targetCanvas.width > 0 && targetCanvas.height > 0) {
//       //           try {
//       //             const gl = targetCanvas.getContext('webgl') || targetCanvas.getContext('experimental-webgl');
//       //             if (gl) {
//       //               gl.finish();
//       //             }

//       //             const dataURL = targetCanvas.toDataURL('image/png', 1.0);

//       //             if (dataURL && dataURL.length > 100) {
//       //               console.log('Successfully captured 3D model screenshot');
//       //               resolve(dataURL);
//       //             } else {
//       //               console.warn('Canvas capture returned empty image');
//       //               resolve(null);
//       //             }
//       //           } catch (captureError) {
//       //             console.warn('Error capturing canvas:', captureError);
//       //             resolve(null);
//       //           }
//       //         } else {
//       //           console.warn('No suitable canvas found for screenshot');
//       //           resolve(null);
//       //         }
//       //       } catch (error) {
//       //         console.warn('Error in screenshot capture:', error);
//       //         resolve(null);
//       //       }
//       //     });
//       //   });
//       // };

//       // const modelScreenshot = await capture3DModelScreenshot();//this before iso capturing commented line

//        const modelScreenshot = await captureIsometricView(); //after capturing 3d displaying in iso view new modified line

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

//       // Use updated analysis data if available
//       const currentAnalysis = updatedAnalysisData || analysisData;

//       if (currentAnalysis) {
//         tableData.push(['', '']);
//         tableData.push(['MODULE: Machining Module (Turning Process)', '']);

//         tableData.push(['MATERIAL DATA', '']);
//         tableData.push(['Material', safeString(costData?.material || currentAnalysis.material?.name || 'N/A')]);
//         tableData.push(['Density', currentAnalysis.material?.density ? `${safeString(currentAnalysis.material.density)} kg/m³` : 'N/A']);

//         if (currentAnalysis.volume) {
//           tableData.push(['', '']);
//           tableData.push(['FINAL COMPONENT ACTUAL DIMENSIONS', '']);
//           tableData.push(['Volume (mm³)', safeString(currentAnalysis.volume.mm3 || 'N/A')]);
//           tableData.push(['Mass', currentAnalysis.volume.actual_mass ? `${currentAnalysis.volume.actual_mass} kg` : 'N/A']);
//         }

//         if (currentAnalysis.derived_parameters) {
//           tableData.push(['', '']);
//           tableData.push(['BOUNDING BOX DIMENSIONS', '']);

//           const diameter = currentAnalysis.derived_parameters.diameter || 'N/A';
//           const axisLength = currentAnalysis.derived_parameters.axis_length || 'N/A';
//           const dimensionsFormat = `Diameter: ${diameter} mm, Length: ${axisLength} mm`;

//           tableData.push(['Diameter × Length', dimensionsFormat]);
//         }

//         if (currentAnalysis.stock) {
//           tableData.push(['', '']);
//           tableData.push(['STOCK DIMENSIONS', '']);
//           tableData.push(['Volume (mm³)', safeString(currentAnalysis.stock.stock_volume_mm3 || 'N/A')]);
//           tableData.push(['Mass', currentAnalysis.stock.stock_weight_kg ? `${currentAnalysis.stock.stock_weight_kg} kg` : 'N/A']);

//           tableData.push(['', '']);
//           tableData.push(['RECOMMENDED BOUNDING BOX DIMENSIONS', '']);

//           const stockDiameter = editableStockDimensions.stock_diameter || currentAnalysis.stock.stock_diameter || 'N/A';
//           const stockLength = editableStockDimensions.stock_length || currentAnalysis.stock.stock_length || 'N/A';
//           const stockDimensionsFormat = `Diameter: ${stockDiameter} mm, Length: ${stockLength} mm`;

//           tableData.push(['Diameter × Length', stockDimensionsFormat]);
//         }
//       }

//       tableData.push(['', '']);
//       tableData.push(['MANUFACTURING SETTINGS', '']);
//       const distStr = distribution.map(d => `${d.operation} ${d.percent}%`).join(', ');
//       tableData.push(['Operation Distribution', safeString(distStr || 'Turning 100%')]);
//       tableData.push(['Quantity', safeString(quantity)]);

//       if (costData) {
//         tableData.push(['', '']);
//         tableData.push(['COST SUMMARY', '']);
//         if (costData.material_cost_per_kg) {
//           tableData.push(['Material Cost per kg', formatCurrencyForPDF(costData.material_cost_per_kg)]);
//         }
//         if (costData.Material_cost_per_unit) {
//           tableData.push(['Material Cost Per Unit', formatCurrencyForPDF(costData.Material_cost_per_unit)]);
//         }
//         tableData.push(['Machining Cost Per Unit', formatCurrencyForPDF(costData.total_machining_cost_per_unit)]);
//         if (costData.total_material_cost) {
//           tableData.push(['Total Material Cost For Given Quantity', formatCurrencyForPDF(costData.total_material_cost)]);
//         }
//         if (costData.total_machining_cost) {
//           tableData.push(['Total Machining Cost For Given Quantity', formatCurrencyForPDF(costData.total_machining_cost)]);
//         }
//         if (costData.total_cost_with_material_cost) {
//           tableData.push(['OverAll Total Cost (Machining+Material cost)', formatCurrencyForPDF(costData.total_cost_with_material_cost)]);
//         }
//       }

//       const startY = yPosition;
//       const rowHeight = 5;
//       const col1Width = contentWidth * 0.6;

//       let currentY = startY;

//       tableData.forEach((row, index) => {
//         const [label, value] = row;

//         const isSectionHeader = label && !value && (label.includes('DIMENSIONS') || label.includes('SETTINGS') || label.includes('SUMMARY') || label.includes('EXTRA') || label.includes('MATERIAL DATA') || label.includes('MODULE:'));
//         const isEmptyRow = !label && !value;

//         if (isEmptyRow) {
//           currentY += rowHeight / 2;
//           return;
//         }

//         // PROFESSIONAL TABLE COLORS - Standard business colors
//         const getBackgroundColor = (label) => {
//           if (isSectionHeader) {
//             return [41, 128, 185]; // Professional dark blue
//           }
//           if (label.includes('Volume') || label.includes('Diameter') || label.includes('Length')) {
//             return [217, 237, 247]; // Light blue
//           }
//           if (label.includes('Operation') || label.includes('Quantity')) {
//             return [236, 236, 236]; // Light gray
//           }
//           if (label.includes('Cost') || label.includes('Mass')) {
//             return [245, 245, 245]; // Off-white gray
//           }
//           return [255, 255, 255]; // White for regular rows
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

//         pdf.setDrawColor(0, 0, 0); // BLACK BORDER
//         pdf.setLineWidth(0.15); // REDUCED BORDER SIZE
//         pdf.rect(margin, currentY - 1, contentWidth, rowHeight);

//         if (!isSectionHeader) {
//           pdf.line(margin + col1Width, currentY - 1, margin + col1Width, currentY + rowHeight - 1);
//         }

//         if (isSectionHeader) {
//           pdf.text(safeString(label), margin + 4, currentY + 2.5);
//         } else {
//           pdf.text(safeString(label), margin + 2, currentY + 2.5);

//           const isCostSummaryRow =
//             (label.includes('Cost') || label.includes('Machining')) &&
//             label !== 'MATERIAL DATA' &&
//             label !== 'Material';

//           if (isCostSummaryRow && label !== 'COST SUMMARY') {
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

//       // Output
//       if (previewOnly) {
//         const blob = pdf.output('blob');
//         const url = URL.createObjectURL(blob);
//         setPdfUrl(url);
//         setPdfPreviewVisible(true);
//       } else {
//         const filename = `Turning_Cost_Report_${analysisData?.filename?.replace(/\.[^/.]+$/, '') || 'Model'}_${new Date().getTime()}.pdf`;
//         pdf.save(filename);
//         message.success('PDF report downloaded successfully!');
//       }
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//       message.destroy();
//       message.error('Failed to generate PDF report');
//     }
//   };

//   if (!analysisData) {
//     return (
//       <div style={{ textAlign: 'center', padding: '40px', color: theme.textSecondary }}>
//         <Text>No analysis data available</Text>
//       </div>
//     );
//   }

// const captureIsometricView = () => {
//   return new Promise((resolve) => {
//     try {
//       // Create a custom event with a unique callback to request isometric view capture
//       let callbackExecuted = false;

//       const handleIsometricCapture = (event) => {
//         if (!callbackExecuted) {
//           callbackExecuted = true;
//           const dataUrl = event.detail;

//           // Remove the listener after receiving data
//           window.removeEventListener('turningIsometricCaptureComplete', handleIsometricCapture);

//           console.log('Turning isometric capture received successfully');
//           resolve(dataUrl);
//         }
//       };

//       // Listen for the capture completion event from TurningViewerPage
//       window.addEventListener('turningIsometricCaptureComplete', handleIsometricCapture);

//       // Send request to TurningViewerPage to capture isometric view
//       const captureEvent = new CustomEvent('requestTurningIsometricCapture', {
//         detail: {
//           timestamp: Date.now()
//         }
//       });

//       window.dispatchEvent(captureEvent);
//       console.log('Turning isometric capture request sent to TurningViewerPage');

//       // Timeout fallback (5 seconds)
//       const timeoutId = setTimeout(() => {
//         if (!callbackExecuted) {
//           callbackExecuted = true;
//           window.removeEventListener('turningIsometricCaptureComplete', handleIsometricCapture);
//           console.warn('Turning isometric capture timeout after 5 seconds, returning null');
//           resolve(null);
//         }
//       }, 5000);

//       // Store timeout ID for cleanup if needed
//       return () => clearTimeout(timeoutId);

//     } catch (error) {
//       console.error('Error in captureIsometricView:', error);
//       resolve(null);
//     }
//   });
// };

//   return (
//     <div style={{ 
//       height: '100%', 
//       display: 'flex', 
//       flexDirection: 'column',
//       overflow: 'hidden'
//     }}>
//       <Modal
//         open={pdfPreviewVisible}
//         title="PDF Preview"
//         onCancel={() => setPdfPreviewVisible(false)}
//         footer={[
//           <Button key="cancel" onClick={() => setPdfPreviewVisible(false)}>Cancel</Button>,
//           <Button key="download" type="primary" onClick={() => { setPdfPreviewVisible(false); handleDownloadPDF(false); }}>Download PDF</Button>
//         ]}
//         width="80%"
//         bodyStyle={{ height: '70vh', padding: 0 }}
//       >
//         {pdfUrl && (
//           <iframe title="pdf" src={pdfUrl} style={{ border: 'none', width: '100%', height: '100%' }} />
//         )}
//       </Modal>

//       {/* Scrollable container for all content */}
//       <div 
//         ref={pdfRef} 
//         style={{ 
//           height: '100%',
//           overflowY: 'auto',
//           overflowX: 'hidden',
//           padding: '8px 0',
//           paddingRight: '8px'
//         }}
//       >
//       {/* Header Card */}
//       {/* <Card 
//         style={{ borderRadius: '8px', marginBottom: '12px', backgroundColor: 'white' }}
//         bodyStyle={{ padding: '12px 16px' }}
//       >
//         <Title level={4} style={{ margin: 0, color: '#14539b', fontWeight: 600 }}>
//           Manufacturing Cost Report
//         </Title>
//       </Card> */}

//       {/* File and Material Info */}
//       <Row gutter={[12, 12]}>
//         <Col xs={24} md={12}>
//           <Card style={{ borderRadius: '8px', backgroundColor: 'white' }} bodyStyle={{ padding: '12px 16px' }}>
//             <Title level={5} style={{ marginTop: 0, color: '#14539b', fontWeight: 600 }}>File Information</Title>
//             <Row>
//               <Col span={24}>
//                 <div>
//                   <Text type="secondary">Filename:</Text>
//                   <div>{analysisData.filename || 'N/A'}</div>
//                 </div>
//               </Col>
//             </Row>
//           </Card>
//         </Col>
//         <Col xs={24} md={12}>
//           <Card style={{ borderRadius: '8px', backgroundColor: 'white' }} bodyStyle={{ padding: '12px 16px' }}>
//             <Title level={5} style={{ marginTop: 0, color: '#14539b', fontWeight: 600 }}>Material Information</Title>
//             <Row>
//               <Col span={12}>
//                 <div>
//                   <Text type="secondary">Material:</Text>
//                   <div>{analysisData.material?.name || 'N/A'}</div>
//                 </div>
//               </Col>
//               <Col span={12}>
//                 <div>
//                   <Text type="secondary">Density:</Text>
//                   <div>{analysisData.material?.density || 'N/A'} kg/m³</div>
//                 </div>
//               </Col>
//             </Row>
//           </Card>
//         </Col>
//       </Row>

//       {/* Dimensions */}
//       <Row gutter={[12, 12]} style={{ marginTop: '12px' }}>
//        <Col xs={24} md={12}>
//   <div
//     style={{
//       background: '#f0f9ff',
//       padding: '16px',
//       borderRadius: '8px',
//       borderLeft: '4px solid #14539b',
//       height: '100%',
//     }}
//   >
//     {/* BOUNDING BOX FIRST */}
//     <Title
//       level={5}
//       style={{
//         color: '#14539b',
//         fontWeight: 600,
//         marginBottom: '12px',
//         fontSize: '13px',
//       }}
//     >
//       BOUNDING BOX DIMENSIONS
//     </Title>

//     <div
//       style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         gap: '12px',
//         marginBottom: '20px',
//       }}
//     >
//       <div style={{ flex: 1 }}>
//         <span style={{ color: '#6b7280', fontSize: '12px' }}>Diameter:</span>
//         <div style={{ fontWeight: 500, color: '#374151', marginTop: '4px' }}>
//           {analysisData.derived_parameters?.diameter
//             ? `${analysisData.derived_parameters.diameter} mm`
//             : 'N/A'}
//         </div>
//       </div>
//       <div style={{ flex: 1 }}>
//         <span style={{ color: '#6b7280', fontSize: '12px' }}>Length:</span>
//         <div style={{ fontWeight: 500, color: '#374151', marginTop: '4px' }}>
//           {analysisData.derived_parameters?.axis_length
//             ? `${analysisData.derived_parameters.axis_length} mm`
//             : 'N/A'}
//         </div>
//       </div>
//     </div>

//     {/* FINAL COMPONENT ACTUAL DIMENSIONS BELOW */}
//     <Title
//       level={5}
//       style={{
//         marginTop: 0,
//         color: '#14539b',
//         fontWeight: 600,
//         fontSize: '14px',
//         marginBottom: '12px',
//       }}
//     >
//       FINAL COMPONENT ACTUAL DIMENSIONS
//     </Title>

//     <Row gutter={[16, 0]}>
//       <Col span={12}>
//         <span style={{ color: '#6b7280' }}>Volume (mm³):</span>
//         <div
//           style={{
//             fontWeight: 600,
//             fontSize: '16px',
//             color: '#374151',
//             marginTop: '4px',
//           }}
//         >
//           {analysisData.volume?.mm3 ?? 'N/A'}
//         </div>
//       </Col>

//       <Col span={12}>
//         <span style={{ color: '#6b7280' }}>Mass:</span>
//         <div
//           style={{
//             fontWeight: 600,
//             fontSize: '16px',
//             color: '#374151',
//             marginTop: '4px',
//           }}
//         >
//           {analysisData.volume?.actual_mass
//             ? `${analysisData.volume.actual_mass} kg`
//             : 'N/A'}
//         </div>
//       </Col>
//     </Row>
//   </div>
// </Col>

//       <Col xs={24} md={12}>
//   <div
//     style={{
//       background: '#f6ffed',
//       padding: '16px',
//       borderRadius: '8px',
//       borderLeft: '4px solid #22c55e',
//       height: '100%',
//     }}
//   >
//     {/* RECOMMENDED STOCK DIMENSIONS FIRST */}
//     <Title
//       level={5}
//       style={{
//         color: '#22c55e',
//         fontWeight: 600,
//         marginBottom: '12px',
//         fontSize: '13px',
//       }}
//     >
//       RECOMMENDED STOCK DIMENSIONS
//     </Title>

//     <div
//       style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         gap: '12px',
//         marginBottom: '16px',
//       }}
//     >
//       <div style={{ flex: 1 }}>
//         <span style={{ color: '#6b7280', fontSize: '12px' }}>
//           Stock Diameter (mm):
//         </span>
//         <Input
//           type="number"
//           value={editableStockDimensions.stock_diameter ?? ''}
//           onChange={(e) =>
//             handleStockDimensionChange('stock_diameter', e.target.value)
//           }
//           placeholder="Diameter"
//           size="small"
//           style={{
//             marginTop: '2px',
//             fontSize: '12px',
//           }}
//           suffix="mm"
//         />
//       </div>

//       <div style={{ flex: 1 }}>
//         <span style={{ color: '#6b7280', fontSize: '12px' }}>
//           Stock Length (mm):
//         </span>
//         <Input
//           type="number"
//           value={editableStockDimensions.stock_length ?? ''}
//           onChange={(e) =>
//             handleStockDimensionChange('stock_length', e.target.value)
//           }
//           placeholder="Length"
//           size="small"
//           style={{
//             marginTop: '2px',
//             fontSize: '12px',
//           }}
//           suffix="mm"
//         />
//       </div>
//     </div>

//     <div style={{ textAlign: 'center', marginBottom: '20px' }}>
//       <Button
//         type="primary"
//         size="small"
//         onClick={updateStockDimensions}
//         loading={isCalculating}
//         style={{
//           backgroundColor: '#22c55e',
//           borderColor: '#22c55e',
//           fontSize: '12px',
//           height: '28px',
//         }}
//       >
//         Update Dimensions
//       </Button>
//     </div>

//     {/* STOCK DIMENSIONS BELOW */}
//     <Title
//       level={5}
//       style={{
//         color: '#22c55e',
//         fontSize: '14px',
//         marginBottom: '12px',
//         display: 'block',
//         fontWeight: 600,
//       }}
//     >
//       STOCK DIMENSIONS
//     </Title>

//     <Row gutter={[16, 0]}>
//       <Col span={12}>
//         <span style={{ color: '#6b7280' }}>Volume (mm³):</span>
//         <div
//           style={{
//             fontWeight: 600,
//             fontSize: '16px',
//             color: '#374151',
//             marginTop: '4px',
//           }}
//         >
//           {(updatedAnalysisData || analysisData).stock?.stock_volume_mm3 ??
//             'N/A'}
//         </div>
//       </Col>

//       <Col span={12}>
//         <span style={{ color: '#6b7280' }}>Mass:</span>
//         <div
//           style={{
//             fontWeight: 600,
//             fontSize: '16px',
//             color: '#374151',
//             marginTop: '4px',
//           }}
//         >
//           {(updatedAnalysisData || analysisData).stock?.stock_weight_kg
//             ? `${(updatedAnalysisData || analysisData).stock.stock_weight_kg} kg`
//             : 'N/A'}
//         </div>
//       </Col>
//     </Row>
//   </div>
// </Col>

//       </Row>

//       {/* Manufacturing Settings */}
//       <Card style={{ borderRadius: '8px', marginTop: '12px', backgroundColor: 'white' }} bodyStyle={{ padding: '12px 16px' }}>
//         <Title level={5} style={{ marginTop: 0, color: '#14539b', fontWeight: 600 }}>Manufacturing Operation</Title>
//         <Row gutter={[8, 8]} align="middle">
//           <Col xs={24} md={18}>
//             {distribution.map((row, index) => (
//               <Row key={index} gutter={[8, 8]} style={{ marginBottom: '8px' }} align="middle">
//                 <Col span={8}>
//                   <Select
//                     value={row.operation}
//                     onChange={(val) => updateDistributionRow(index, 'operation', val)}
//                     style={{ width: '100%' }}
//                   >
//                     {turningOperations.map(op => (
//                       <Option key={op.value} value={op.value}>{op.label}</Option>
//                     ))}
//                   </Select>
//                 </Col>
//                 <Col span={6}>
//                   <Input
//                     type="number"
//                     min={0}
//                     max={100}
//                     value={row.percent}
//                     onChange={(e) => updateDistributionRow(index, 'percent', e.target.value)}
//                     suffix="%"
//                   />
//                 </Col>
//                 <Col span={7}>
//                   <Select
//                     placeholder="Select Size"
//                     value={selectedSizes[row.operation]}
//                     onChange={(val) => handleSizeChange(row.operation, val)}
//                     style={{ width: '100%' }}
//                   >
//                     {getSizesForMaterial(analysisData.material?.name).map(size => (
//                       <Option key={size} value={size}>{size}</Option>
//                     ))}
//                   </Select>
//                 </Col>
//                 <Col span={3}>
//                   <Button danger onClick={() => removeDistributionRow(index)} disabled={distribution.length === 1} size="small">Remove</Button>
//                 </Col>
//               </Row>
//             ))}
//             <Button 
//               onClick={addDistributionRow} 
//               style={{ marginRight: 8, backgroundColor: 'white', borderColor: '#14539b', color: '#14539b' }}
//             >
//               Add Operation
//             </Button>
//             <Button 
//               type="primary" 
//               onClick={recalculateCost} 
//               loading={isCalculating}
//               style={{ backgroundColor: '#14539b', borderColor: '#14539b' }}
//             >
//               Get Cost
//             </Button>
//           </Col>
//           <Col xs={24} md={6}>
//             <Text type="secondary">Quantity:</Text>
//             <Input 
//               type="number" 
//               value={quantity}
//               onChange={handleQuantityChange}
//               min={1}
//             />
//           </Col>
//         </Row>
//       </Card>

//       {/* Cost Summary */}
//       <Card style={{ borderRadius: '8px', marginTop: '12px', backgroundColor: 'white' }} bodyStyle={{ padding: '12px 16px' }}>
//         <Title level={5} style={{ marginTop: 0, color: '#14539b', fontWeight: 600 }}>Cost Summary</Title>
//         {isCalculating ? (
//           <div style={{ textAlign: 'center', padding: '20px', color: theme.textSecondary }}>Calculating cost...</div>
//         ) : costData ? (
//           <>
//             {/* Row 1: Machining per-unit and Total Machining - Always visible */}
//             <Row gutter={[16, 16]}>
//               <Col span={12}>
//                 <div style={{
//                   padding: '12px',
//                   background: '#f0f9ff66',
//                   borderRadius: '8px',
//                   border: '1px solid #14539b22'
//                 }}>
//                   <div style={{ textAlign: 'center' }}>
//                     <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Manufaturing Cost Per Unit</div>
//                     <div style={{ fontSize: 18, fontWeight: 600, color: '#14539b' }}>{formatCurrency(costData.total_machining_cost_per_unit)}</div>
//                   </div>
//                 </div>
//               </Col>
//               <Col span={12}>
//                 <div style={{
//                   padding: '12px',
//                   background: '#f0f9ff66',
//                   borderRadius: '8px',
//                   border: '1px solid #14539b22'
//                 }}>
//                   <div style={{ textAlign: 'center' }}>
//                     <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Total Manufaturing Cost</div>
//                     <div style={{ fontSize: 18, fontWeight: 600, color: '#14539b' }}>{formatCurrency(costData.total_machining_cost)}</div>
//                   </div>
//                 </div>
//               </Col>
//             </Row>

//             {/* Include Material Cost toggle */}
//             <div style={{ marginTop: '20px', marginBottom: '16px' }}>
//               <Checkbox 
//                 checked={includeMaterialCost} 
//                 onChange={(e) => setIncludeMaterialCost(e.target.checked)}
//                 style={{ 
//                   fontSize: '14px',
//                   color: '#374151',
//                   fontWeight: 500
//                 }}
//               >
//                 Include Material Cost
//               </Checkbox>
//             </div>

//             {/* Material costs and Total costs - Only show when checkbox is checked */}
//             {includeMaterialCost && (
//               <>
//                 {/* Row 2: Material per-unit and Total Material */}
//                 <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
//                   <Col span={12}>
//                     <div style={{
//                       padding: '12px',
//                       background: '#fff2e666',
//                       borderRadius: '8px',
//                       border: '1px solid #fa8c1622'
//                     }}>
//                       <div style={{ textAlign: 'center' }}>
//                         <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Material Cost Per Unit</div>
//                         <div style={{ fontSize: 16, fontWeight: 600, color: '#fa8c16' }}>{formatCurrency(costData.Material_cost_per_unit)}</div>
//                       </div>
//                     </div>
//                   </Col>
//                   <Col span={12}>
//                     <div style={{
//                       padding: '12px',
//                       background: '#fff2e666',
//                       borderRadius: '8px',
//                       border: '1px solid #fa8c1622'
//                     }}>
//                       <div style={{ textAlign: 'center' }}>
//                         <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Total Material Cost</div>
//                         <div style={{ fontSize: 16, fontWeight: 600, color: '#fa8c16' }}>{formatCurrency(costData.total_material_cost)}</div>
//                       </div>
//                     </div>
//                   </Col>
//                 </Row>
//                 <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>


//                              <Col span={12}>
//     <div style={{
//       padding: '16px',
//       background: '#e6f7ff66',
//       borderRadius: '8px',
//       border: '1px solid #14539b22',
//       textAlign: 'center'
//     }}>
//       <div style={{ color: '#6b7280', fontSize: '16px', marginBottom: '8px' }}>Total Cost per unit (Including Materials )</div>
//       <div style={{ fontSize: 20, fontWeight: 700, color: '#14539b' }}>{formatCurrency(costData.total_cost_per_unit_with_materials)}</div>
//     </div>
//   </Col>

//    <Col span={12}>
//                     <div style={{
//                       padding: '16px',
//                       background: '#e6f7ff66',
//                       borderRadius: '8px',
//                       border: '1px solid #14539b22',
//                       textAlign: 'center'
//                     }}>
//                       <div style={{ color: '#6b7280', fontSize: '16px', marginBottom: '8px' }}>Total Cost (Including Materials )</div>
//                       <div style={{ fontSize: 20, fontWeight: 700, color: '#14539b' }}>{formatCurrency(costData.total_cost_with_material_cost)}</div>
//                     </div>
//                   </Col>
//                 </Row>
//               </>
//             )}
//           </>
//         ) : (
//           <div style={{ textAlign: 'center', padding: '20px', color: theme.textSecondary }}>
//             {initialCostData ? 'Initial cost data will be displayed here' : 'Click "Get Cost" to calculate turning operation costs'}
//           </div>
//         )}
//       </Card>
//       </div>
//     </div>
//   );
// };

// export default TurningCostReport;





// ''''gokul update code to update the Dia dropdown december/24/2025 '''''//




import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Row, Col, Button, Input, Select, message, Modal, Checkbox } from 'antd';
import jsPDF from 'jspdf';

const { Title, Text } = Typography;
const { Option } = Select;

const TurningCostReport = ({ analysisData, theme, objUrl, onCostCalculationComplete, initialCostData, onRegisterReport }) => {
  const [quantity, setQuantity] = useState(1);
  const [costData, setCostData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [includeMaterialCost, setIncludeMaterialCost] = useState(false);
  const [historyId, setHistoryId] = useState(null);
  const [updatedAnalysisData, setUpdatedAnalysisData] = useState(null);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({
    turning: null,
    boring: null,
    threading: null,
    milling: null
  });

  // Turning operations distribution
  const [distribution, setDistribution] = useState([
    { operation: 'turning', percent: 100 },
    { operation: 'boring', percent: 0 },
    { operation: 'threading', percent: 0 },
    { operation: 'milling', percent: 0 }
  ]);

  const [editableStockDimensions, setEditableStockDimensions] = useState({
    stock_diameter: null,
    stock_length: null
  });

  const pdfRef = useRef();
  const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const turningOperations = [
    { value: 'turning', label: 'Turning' },
    { value: 'boring', label: 'Boring' },
    { value: 'threading', label: 'Threading' },
    { value: 'milling', label: 'Milling' }
  ];

  // Fetch size options from the endpoint
  useEffect(() => {
    const fetchSizeOptions = async () => {
      try {
        const response = await fetch('http://localhost:5678/turning-machine-hour-rates/');
        if (response.ok) {
          const result = await response.json();
          if (result.data) {
            setSizeOptions(result.data);
          }
        }
      } catch (error) {
        console.error('Error fetching size options:', error);
      }
    };

    fetchSizeOptions();
  }, []);

  // Get unique sizes for a specific material
  const getSizesForMaterial = (materialName) => {
    if (!sizeOptions || !materialName) return [];

    const filtered = sizeOptions.filter(option =>
      option.material && option.material.toLowerCase() === materialName.toLowerCase()
    );

    // Remove duplicates based on diameter_condition
    const uniqueSizes = [...new Set(filtered.map(item => item.diameter_condition))];
    return uniqueSizes;
  };

  // Normalize backend response keys
  const normalizeCostData = (data) => {
    if (!data || typeof data !== 'object') return data;
    return {
      ...data,
      // per-unit machining cost
      total_machining_cost_per_unit: data.total_machining_cost_per_unit ?? data.cost_per_unit,
      // total machining cost for quantity
      total_machining_cost: data.total_Machining_cost ?? data.total_machining_cost,
      // totals
      total_cost_without_material_cost: data.total_cost_without_material_cost ?? data.total_cost,
      total_cost_with_material_cost: data.total_cost_with_material_cost ?? data.with_material_cost,
      // material costs
      Material_cost_per_unit: data.Material_cost_per_unit ?? data.Material_cost_perunit ?? data.material_cost_per_unit,
      total_material_cost: data.total_material_cost ?? ((data.Material_cost_per_unit ?? data.Material_cost_perunit ?? 0) * (data.quantity ?? quantity ?? 1)),
      // stock data
      stock_volume_mm3: data.stock_volume_mm3,
      stock_weight_kg: data.stock_weight_kg,
      // sizes
      turning_size: data.turning_size,
      boring_size: data.boring_size,
      threading_size: data.threading_size,
      milling_size: data.milling_size
    };
  };

  // Initialize cost data from navigation state
  useEffect(() => {
    console.log('TurningCostReport - analysisData:', analysisData);
    console.log('TurningCostReport - initialCostData:', initialCostData);
    if (analysisData && initialCostData) {
      const norm = normalizeCostData(initialCostData);
      setCostData(norm);
      setHistoryId(analysisData.id);
      setUpdatedAnalysisData(analysisData);
      if (typeof norm.quantity === 'number') setQuantity(norm.quantity);

      // Set initial sizes from cost data
      setSelectedSizes({
        turning: norm.turning_size || null,
        boring: norm.boring_size || null,
        threading: norm.threading_size || null,
        milling: norm.milling_size || null
      });

      console.log('TurningCostReport - cost data set:', normalizeCostData(initialCostData));
    } else if (analysisData && !initialCostData) {
      setUpdatedAnalysisData(analysisData);
      // If no initial cost data, try to get the history ID from the latest record
      fetchLatestHistoryId();
    }
    // Seed editable stock fields from analysis response
    if (analysisData?.stock) {
      setEditableStockDimensions({
        stock_diameter: analysisData.stock.stock_diameter ?? null,
        stock_length: analysisData.stock.stock_length ?? null,
      });
    } else if (analysisData) {
      // Backward compatibility with previous keys
      setEditableStockDimensions({
        stock_diameter: analysisData.stock_diameter ?? null,
        stock_length: analysisData.stock_length ?? null,
      });
    }
  }, [analysisData, initialCostData]);

  // Set initial cost data from initialCostData prop if available
  useEffect(() => {
    if (initialCostData && !costData) {
      const norm = normalizeCostData(initialCostData);
      setCostData(norm);
      setHistoryId(analysisData?.id);
      if (typeof norm.quantity === 'number') setQuantity(norm.quantity);

      // Set initial sizes from cost data
      setSelectedSizes({
        turning: norm.turning_size || null,
        boring: norm.boring_size || null,
        threading: norm.threading_size || null,
        milling: norm.milling_size || null
      });
    }
  }, [initialCostData, costData, analysisData]);

  // Expose report generator to parent (TurningViewerPage)
  useEffect(() => {
    if (typeof onRegisterReport === 'function') {
      onRegisterReport(() => handleDownloadPDF(true));
    }
  }, [onRegisterReport, costData, quantity, distribution, analysisData, updatedAnalysisData]);

  // Function to get the latest history ID - this will be called when user clicks "Get Cost"
  const fetchLatestHistoryId = async () => {
    try {
      const response = await fetch('http://localhost:5678/machining-costs');
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const latestRecord = data[data.length - 1];
          setHistoryId(latestRecord.history_id);
          console.log('Found history ID from latest record:', latestRecord.history_id);
          return latestRecord.history_id;
        }
      }
    } catch (error) {
      console.error('Error fetching latest history ID:', error);
      message.error('Could not find history record. Please try again.');
    }
    return null;
  };

  // Initialize editable stock dimensions when analysisData changes
  useEffect(() => {
    if (analysisData?.stock_dimensions) {
      setEditableStockDimensions({
        stock_diameter: analysisData.stock_diameter || null,
        stock_length: analysisData.stock_length || null
      });
    }
  }, [analysisData]);

  const handleStockDimensionChange = (field, value) => {
    setEditableStockDimensions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateStockDimensions = async () => {
    if (!historyId) {
      message.error('No calculation history available');
      return;
    }

    setIsCalculating(true);
    try {
      const formData = new URLSearchParams();
      formData.append('turning_history_id', historyId);
      formData.append('stock_diameter', editableStockDimensions.stock_diameter);
      formData.append('stock_length', editableStockDimensions.stock_length);

      const response = await fetch('http://localhost:5678/turning/update-stock/', {
        method: 'PUT',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to update stock dimensions');

      const result = await response.json();
      console.log('Stock update response:', result);

      // Extract the diameter condition from response
      const newDiameterCondition = result['selected_rate.diameter_condition'];

      // Update cost data with all new values from response
      setCostData(prev => ({
        ...prev,
        stock_diameter: result.stock_diameter ?? prev?.stock_diameter,
        stock_length: result.stock_length ?? prev?.stock_length,
        stock_volume_mm3: result.stock_volume_mm3 ?? prev?.stock_volume_mm3,
        stock_weight_kg: result.stock_weight_kg ?? prev?.stock_weight_kg,
        total_machining_cost_per_unit: result.total_machining_cost_per_unit ?? prev?.total_machining_cost_per_unit,
        total_machining_cost: result.total_machining_cost ?? prev?.total_machining_cost,
        total_cost_without_material_cost: result.total_cost_without_material_cost ?? prev?.total_cost_without_material_cost,
        total_cost_with_material_cost: result.total_cost_with_material_cost ?? prev?.total_cost_with_material_cost,
        Material_cost_per_unit: result.Material_cost_per_unit ?? prev?.Material_cost_per_unit,
        total_material_cost: result.total_material_cost ?? prev?.total_material_cost,
        total_cost_per_unit_with_materials: result.total_cost_per_unit_with_materials ??
          result.total_cost_with_material_cost_per_unit ??
          prev?.total_cost_per_unit_with_materials
      }));

      // Update all diameter conditions in selectedSizes if a new condition is returned
      if (newDiameterCondition) {
        setSelectedSizes(prev => ({
          turning: newDiameterCondition,
          boring: newDiameterCondition,
          threading: newDiameterCondition,
          milling: newDiameterCondition
        }));
      }

      // Update the local analysis data to reflect new stock dimensions and volume
      setUpdatedAnalysisData(prev => ({
        ...prev,
        stock: {
          ...prev?.stock,
          stock_diameter: result.stock_diameter ?? editableStockDimensions.stock_diameter,
          stock_length: result.stock_length ?? editableStockDimensions.stock_length,
          stock_volume_mm3: result.stock_volume_mm3 ?? prev?.stock?.stock_volume_mm3,
          stock_weight_kg: result.stock_weight_kg ?? prev?.stock?.stock_weight_kg
        }
      }));

      message.success('Stock dimensions updated and cost recalculated');
    } catch (error) {
      console.error('Error updating stock dimensions:', error);
      message.error('Failed to update stock dimensions');
    } finally {
      setIsCalculating(false);
    }
  };


  // UI helpers for distribution
  const addDistributionRow = () => {
    setDistribution(prev => [...prev, { operation: 'turning', percent: 0 }]);
  };

  const updateDistributionRow = (index, key, value) => {
    setDistribution(prev => prev.map((row, i) => {
      if (i === index) {
        return { ...row, [key]: value };
      }
      return row;
    }));
  };

  const removeDistributionRow = (index) => {
    if (distribution.length === 1) return;
    setDistribution(prev => prev.filter((_, i) => i !== index));
  };

  const handleSizeChange = (operation, size) => {
    setSelectedSizes(prev => ({
      ...prev,
      [operation]: size
    }));
  };

  // Recalculate cost with updated operation distribution - NOW USES /turning_update_machining_cost/
  const recalculateCost = async () => {
    let currentHistoryId = historyId;

    // If no history ID, try to get it from latest record
    if (!currentHistoryId) {
      currentHistoryId = await fetchLatestHistoryId();
      if (!currentHistoryId) {
        message.error('No calculation history available');
        return;
      }
    }

    const total = distribution.reduce((s, d) => s + (Number(d.percent) || 0), 0);
    if (total <= 0 || total > 100) {
      message.error('Operation distribution must sum to 1–100%');
      return;
    }

    setIsCalculating(true);
    try {
      const formData = new URLSearchParams();
      formData.append('turning_history_id', currentHistoryId);
      formData.append('turning_percentage', distribution.find(d => d.operation === 'turning')?.percent || 0);
      formData.append('boring_percentage', distribution.find(d => d.operation === 'boring')?.percent || 0);
      formData.append('threading_percentage', distribution.find(d => d.operation === 'threading')?.percent || 0);
      formData.append('milling_percentage', distribution.find(d => d.operation === 'milling')?.percent || 0);

      // Add sizes to the request
      if (selectedSizes.turning) formData.append('turning_size', selectedSizes.turning);
      if (selectedSizes.boring) formData.append('boring_size', selectedSizes.boring);
      if (selectedSizes.threading) formData.append('threading_size', selectedSizes.threading);
      if (selectedSizes.milling) formData.append('milling_size', selectedSizes.milling);

      // Use the new endpoint: /turning_update_machining_cost/
      const response = await fetch('http://localhost:5678/turning_update_machining_cost/', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to recalculate cost');

      const result = await response.json();
      console.log('Recalculate cost response:', result);

      const norm = normalizeCostData(result);
      setCostData(prev => ({ ...prev, ...norm }));

      // Update selected sizes from response
      setSelectedSizes({
        turning: norm.turning_size || selectedSizes.turning,
        boring: norm.boring_size || selectedSizes.boring,
        threading: norm.threading_size || selectedSizes.threading,
        milling: norm.milling_size || selectedSizes.milling
      });

      message.success('Cost recalculated successfully');
    } catch (error) {
      console.error('Error recalculating cost:', error);
      message.error('Failed to recalculate cost');
    } finally {
      setIsCalculating(false);
    }
  };

  const updateQuantity = async (newQuantity) => {
    let currentHistoryId = historyId;

    // If no history ID, try to get it from latest record
    if (!currentHistoryId) {
      currentHistoryId = await fetchLatestHistoryId();
      if (!currentHistoryId) {
        message.error('No calculation history available');
        return;
      }
    }

    setIsCalculating(true);

    try {
      const formData = new URLSearchParams();
      formData.append('turning_history_id', currentHistoryId);
      formData.append('quantity', newQuantity);

      const response = await fetch(`http://localhost:5678/update-quantity`, {
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
        total_machining_cost_per_unit: result.total_machining_cost_per_unit ?? prev.total_machining_cost_per_unit,
        total_machining_cost: result.total_machining_cost ?? prev.total_machining_cost,
        total_cost_without_material_cost: result.total_cost_without_material_cost ?? prev.total_cost_without_material_cost,
        total_cost_with_material_cost: result.total_cost_with_material_cost ?? prev.total_cost_with_material_cost,
        Material_cost_per_unit: result.Material_cost_per_unit ?? prev.Material_cost_per_unit,
        total_material_cost: result.total_material_cost ?? prev.total_material_cost,
        total_cost_per_unit_with_materials: result.total_cost_per_unit_with_materials
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
    // Always update quantity when it changes
    if (historyId) {
      updateQuantity(newQuantity);
    }
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A';
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
    return `Rs.${numValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleDownloadPDF = async (previewOnly = false) => {
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

      const formatCurrencyForPDF = (value) => {
        if (value === null || value === undefined) return 'N/A';
        const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
        return `Rs.${numValue.toLocaleString('en-IN', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;
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

      // Set default font - GEORGIA
      pdf.setFont('georgia', 'normal');

      // Header background
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
      pdf.text(`Filename: ${safeString(costData?.filename || analysisData?.filename || 'N/A')}`, margin, yPosition);
      pdf.setFontSize(10);
      pdf.setFont('times', 'normal');
      pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, yPosition, { align: 'right' });

      yPosition += 15;



      const modelScreenshot = await captureIsometricView(); //after capturing 3d displaying in iso view new modified line

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

      // Use updated analysis data if available
      const currentAnalysis = updatedAnalysisData || analysisData;

      if (currentAnalysis) {
        tableData.push(['', '']);
        tableData.push(['MODULE: Machining Module (Turning Process)', '']);

        tableData.push(['MATERIAL DATA', '']);
        tableData.push(['Material', safeString(costData?.material || currentAnalysis.material?.name || 'N/A')]);
        tableData.push(['Density', currentAnalysis.material?.density ? `${safeString(currentAnalysis.material.density)} kg/m³` : 'N/A']);

        if (currentAnalysis.volume) {
          tableData.push(['', '']);
          tableData.push(['FINAL COMPONENT ACTUAL DIMENSIONS', '']);
          tableData.push(['Volume (mm³)', safeString(currentAnalysis.volume.mm3 || 'N/A')]);
          tableData.push(['Mass', currentAnalysis.volume.actual_mass ? `${currentAnalysis.volume.actual_mass} kg` : 'N/A']);
        }

        if (currentAnalysis.derived_parameters) {
          tableData.push(['', '']);
          tableData.push(['BOUNDING BOX DIMENSIONS', '']);

          const diameter = currentAnalysis.derived_parameters.diameter || 'N/A';
          const axisLength = currentAnalysis.derived_parameters.axis_length || 'N/A';
          const dimensionsFormat = `Diameter: ${diameter} mm, Length: ${axisLength} mm`;

          tableData.push(['Diameter × Length', dimensionsFormat]);
        }

        if (currentAnalysis.stock) {
          tableData.push(['', '']);
          tableData.push(['STOCK DIMENSIONS', '']);
          tableData.push(['Volume (mm³)', safeString(currentAnalysis.stock.stock_volume_mm3 || 'N/A')]);
          tableData.push(['Mass', currentAnalysis.stock.stock_weight_kg ? `${currentAnalysis.stock.stock_weight_kg} kg` : 'N/A']);

          tableData.push(['', '']);
          tableData.push(['RECOMMENDED BOUNDING BOX DIMENSIONS', '']);

          const stockDiameter = editableStockDimensions.stock_diameter || currentAnalysis.stock.stock_diameter || 'N/A';
          const stockLength = editableStockDimensions.stock_length || currentAnalysis.stock.stock_length || 'N/A';
          const stockDimensionsFormat = `Diameter: ${stockDiameter} mm, Length: ${stockLength} mm`;

          tableData.push(['Diameter × Length', stockDimensionsFormat]);
        }
      }

      tableData.push(['', '']);
      tableData.push(['MANUFACTURING SETTINGS', '']);
      const distStr = distribution.map(d => `${d.operation} ${d.percent}%`).join(', ');
      tableData.push(['Operation Distribution', safeString(distStr || 'Turning 100%')]);
      tableData.push(['Quantity', safeString(quantity)]);

      if (costData) {
        tableData.push(['', '']);
        tableData.push(['COST SUMMARY', '']);
        if (costData.material_cost_per_kg) {
          tableData.push(['Material Cost per kg', formatCurrencyForPDF(costData.material_cost_per_kg)]);
        }
        if (costData.Material_cost_per_unit) {
          tableData.push(['Material Cost Per Unit', formatCurrencyForPDF(costData.Material_cost_per_unit)]);
        }
        tableData.push(['Machining Cost Per Unit', formatCurrencyForPDF(costData.total_machining_cost_per_unit)]);
        if (costData.total_material_cost) {
          tableData.push(['Total Material Cost For Given Quantity', formatCurrencyForPDF(costData.total_material_cost)]);
        }
        if (costData.total_machining_cost) {
          tableData.push(['Total Machining Cost For Given Quantity', formatCurrencyForPDF(costData.total_machining_cost)]);
        }
        if (costData.total_cost_with_material_cost) {
          tableData.push(['OverAll Total Cost (Machining+Material cost)', formatCurrencyForPDF(costData.total_cost_with_material_cost)]);
        }
      }

      const startY = yPosition;
      const rowHeight = 5;
      const col1Width = contentWidth * 0.6;

      let currentY = startY;

      tableData.forEach((row, index) => {
        const [label, value] = row;

        const isSectionHeader = label && !value && (label.includes('DIMENSIONS') || label.includes('SETTINGS') || label.includes('SUMMARY') || label.includes('EXTRA') || label.includes('MATERIAL DATA') || label.includes('MODULE:'));
        const isEmptyRow = !label && !value;

        if (isEmptyRow) {
          currentY += rowHeight / 2;
          return;
        }

        // PROFESSIONAL TABLE COLORS - Standard business colors
        const getBackgroundColor = (label) => {
          if (isSectionHeader) {
            return [41, 128, 185]; // Professional dark blue
          }
          if (label.includes('Volume') || label.includes('Diameter') || label.includes('Length')) {
            return [217, 237, 247]; // Light blue
          }
          if (label.includes('Operation') || label.includes('Quantity')) {
            return [236, 236, 236]; // Light gray
          }
          if (label.includes('Cost') || label.includes('Mass')) {
            return [245, 245, 245]; // Off-white gray
          }
          return [255, 255, 255]; // White for regular rows
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

        pdf.setDrawColor(0, 0, 0); // BLACK BORDER
        pdf.setLineWidth(0.15); // REDUCED BORDER SIZE
        pdf.rect(margin, currentY - 1, contentWidth, rowHeight);

        if (!isSectionHeader) {
          pdf.line(margin + col1Width, currentY - 1, margin + col1Width, currentY + rowHeight - 1);
        }

        if (isSectionHeader) {
          pdf.text(safeString(label), margin + 4, currentY + 2.5);
        } else {
          pdf.text(safeString(label), margin + 2, currentY + 2.5);

          const isCostSummaryRow =
            (label.includes('Cost') || label.includes('Machining')) &&
            label !== 'MATERIAL DATA' &&
            label !== 'Material';

          if (isCostSummaryRow && label !== 'COST SUMMARY') {
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

      // Output
      if (previewOnly) {
        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setPdfPreviewVisible(true);
      } else {
        const filename = `Turning_Cost_Report_${analysisData?.filename?.replace(/\.[^/.]+$/, '') || 'Model'}_${new Date().getTime()}.pdf`;
        pdf.save(filename);
        message.success('PDF report downloaded successfully!');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      message.destroy();
      message.error('Failed to generate PDF report');
    }
  };

  if (!analysisData) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: theme.textSecondary }}>
        <Text>No analysis data available</Text>
      </div>
    );
  }

  const captureIsometricView = () => {
    return new Promise((resolve) => {
      try {
        // Create a custom event with a unique callback to request isometric view capture
        let callbackExecuted = false;

        const handleIsometricCapture = (event) => {
          if (!callbackExecuted) {
            callbackExecuted = true;
            const dataUrl = event.detail;

            // Remove the listener after receiving data
            window.removeEventListener('turningIsometricCaptureComplete', handleIsometricCapture);

            console.log('Turning isometric capture received successfully');
            resolve(dataUrl);
          }
        };

        // Listen for the capture completion event from TurningViewerPage
        window.addEventListener('turningIsometricCaptureComplete', handleIsometricCapture);

        // Send request to TurningViewerPage to capture isometric view
        const captureEvent = new CustomEvent('requestTurningIsometricCapture', {
          detail: {
            timestamp: Date.now()
          }
        });

        window.dispatchEvent(captureEvent);
        console.log('Turning isometric capture request sent to TurningViewerPage');

        // Timeout fallback (5 seconds)
        const timeoutId = setTimeout(() => {
          if (!callbackExecuted) {
            callbackExecuted = true;
            window.removeEventListener('turningIsometricCaptureComplete', handleIsometricCapture);
            console.warn('Turning isometric capture timeout after 5 seconds, returning null');
            resolve(null);
          }
        }, 5000);

        // Store timeout ID for cleanup if needed
        return () => clearTimeout(timeoutId);

      } catch (error) {
        console.error('Error in captureIsometricView:', error);
        resolve(null);
      }
    });
  };

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <Modal
        open={pdfPreviewVisible}
        title="PDF Preview"
        onCancel={() => setPdfPreviewVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setPdfPreviewVisible(false)}>Cancel</Button>,
          <Button key="download" type="primary" onClick={() => { setPdfPreviewVisible(false); handleDownloadPDF(false); }}>Download PDF</Button>
        ]}
        width="80%"
        bodyStyle={{ height: '70vh', padding: 0 }}
      >
        {pdfUrl && (
          <iframe title="pdf" src={pdfUrl} style={{ border: 'none', width: '100%', height: '100%' }} />
        )}
      </Modal>

      {/* Scrollable container for all content */}
      <div
        ref={pdfRef}
        style={{
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '8px 0',
          paddingRight: '8px'
        }}
      >
        {/* Header Card */}
        {/* <Card 
        style={{ borderRadius: '8px', marginBottom: '12px', backgroundColor: 'white' }}
        bodyStyle={{ padding: '12px 16px' }}
      >
        <Title level={4} style={{ margin: 0, color: '#14539b', fontWeight: 600 }}>
          Manufacturing Cost Report
        </Title>
      </Card> */}

        {/* File and Material Info */}
        <Row gutter={[12, 12]}>
          <Col xs={24} md={12}>
            <Card style={{ borderRadius: '8px', backgroundColor: 'white' }} bodyStyle={{ padding: '12px 16px' }}>
              <Title level={5} style={{ marginTop: 0, color: '#14539b', fontWeight: 600 }}>File Information</Title>
              <Row>
                <Col span={24}>
                  <div>
                    <Text type="secondary">Filename:</Text>
                    <div>{analysisData.filename || 'N/A'}</div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card style={{ borderRadius: '8px', backgroundColor: 'white' }} bodyStyle={{ padding: '12px 16px' }}>
              <Title level={5} style={{ marginTop: 0, color: '#14539b', fontWeight: 600 }}>Material Information</Title>
              <Row>
                <Col span={12}>
                  <div>
                    <Text type="secondary">Material:</Text>
                    <div>{analysisData.material?.name || 'N/A'}</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <Text type="secondary">Density:</Text>
                    <div>{analysisData.material?.density || 'N/A'} kg/m³</div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Dimensions */}
        <Row gutter={[12, 12]} style={{ marginTop: '12px' }}>
          <Col xs={24} md={12}>
            <div
              style={{
                background: '#f0f9ff',
                padding: '16px',
                borderRadius: '8px',
                borderLeft: '4px solid #14539b',
                height: '100%',
              }}
            >
              {/* BOUNDING BOX FIRST */}
              <Title
                level={5}
                style={{
                  color: '#14539b',
                  fontWeight: 600,
                  marginBottom: '12px',
                  fontSize: '13px',
                }}
              >
                BOUNDING BOX DIMENSIONS
              </Title>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '12px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <span style={{ color: '#6b7280', fontSize: '12px' }}>Diameter:</span>
                  <div style={{ fontWeight: 500, color: '#374151', marginTop: '4px' }}>
                    {analysisData.derived_parameters?.diameter
                      ? `${analysisData.derived_parameters.diameter} mm`
                      : 'N/A'}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ color: '#6b7280', fontSize: '12px' }}>Length:</span>
                  <div style={{ fontWeight: 500, color: '#374151', marginTop: '4px' }}>
                    {analysisData.derived_parameters?.axis_length
                      ? `${analysisData.derived_parameters.axis_length} mm`
                      : 'N/A'}
                  </div>
                </div>
              </div>

              {/* FINAL COMPONENT ACTUAL DIMENSIONS BELOW */}
              <Title
                level={5}
                style={{
                  marginTop: 0,
                  color: '#14539b',
                  fontWeight: 600,
                  fontSize: '14px',
                  marginBottom: '12px',
                }}
              >
                FINAL COMPONENT ACTUAL DIMENSIONS
              </Title>

              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <span style={{ color: '#6b7280' }}>Volume (mm³):</span>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: '16px',
                      color: '#374151',
                      marginTop: '4px',
                    }}
                  >
                    {analysisData.volume?.mm3 ?? 'N/A'}
                  </div>
                </Col>

                <Col span={12}>
                  <span style={{ color: '#6b7280' }}>Mass:</span>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: '16px',
                      color: '#374151',
                      marginTop: '4px',
                    }}
                  >
                    {analysisData.volume?.actual_mass
                      ? `${analysisData.volume.actual_mass} kg`
                      : 'N/A'}
                  </div>
                </Col>
              </Row>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div
              style={{
                background: '#f6ffed',
                padding: '16px',
                borderRadius: '8px',
                borderLeft: '4px solid #22c55e',
                height: '100%',
              }}
            >
              {/* RECOMMENDED STOCK DIMENSIONS FIRST */}
              <Title
                level={5}
                style={{
                  color: '#22c55e',
                  fontWeight: 600,
                  marginBottom: '12px',
                  fontSize: '13px',
                }}
              >
                RECOMMENDED STOCK DIMENSIONS
              </Title>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <span style={{ color: '#6b7280', fontSize: '12px' }}>
                    Stock Diameter (mm):
                  </span>
                  <Input
                    type="number"
                    value={editableStockDimensions.stock_diameter ?? ''}
                    onChange={(e) =>
                      handleStockDimensionChange('stock_diameter', e.target.value)
                    }
                    placeholder="Diameter"
                    size="small"
                    style={{
                      marginTop: '2px',
                      fontSize: '12px',
                    }}
                    suffix="mm"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <span style={{ color: '#6b7280', fontSize: '12px' }}>
                    Stock Length (mm):
                  </span>
                  <Input
                    type="number"
                    value={editableStockDimensions.stock_length ?? ''}
                    onChange={(e) =>
                      handleStockDimensionChange('stock_length', e.target.value)
                    }
                    placeholder="Length"
                    size="small"
                    style={{
                      marginTop: '2px',
                      fontSize: '12px',
                    }}
                    suffix="mm"
                  />
                </div>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Button
                  type="primary"
                  size="small"
                  onClick={updateStockDimensions}
                  loading={isCalculating}
                  style={{
                    backgroundColor: '#22c55e',
                    borderColor: '#22c55e',
                    fontSize: '12px',
                    height: '28px',
                  }}
                >
                  Update Dimensions
                </Button>
              </div>

              {/* STOCK DIMENSIONS BELOW */}
              <Title
                level={5}
                style={{
                  color: '#22c55e',
                  fontSize: '14px',
                  marginBottom: '12px',
                  display: 'block',
                  fontWeight: 600,
                }}
              >
                STOCK DIMENSIONS
              </Title>

              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <span style={{ color: '#6b7280' }}>Volume (mm³):</span>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: '16px',
                      color: '#374151',
                      marginTop: '4px',
                    }}
                  >
                    {(updatedAnalysisData || analysisData).stock?.stock_volume_mm3 ??
                      'N/A'}
                  </div>
                </Col>

                <Col span={12}>
                  <span style={{ color: '#6b7280' }}>Mass:</span>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: '16px',
                      color: '#374151',
                      marginTop: '4px',
                    }}
                  >
                    {(updatedAnalysisData || analysisData).stock?.stock_weight_kg
                      ? `${(updatedAnalysisData || analysisData).stock.stock_weight_kg} kg`
                      : 'N/A'}
                  </div>
                </Col>
              </Row>
            </div>
          </Col>

        </Row>

        {/* Manufacturing Settings */}
        <Card style={{ borderRadius: '8px', marginTop: '12px', backgroundColor: 'white' }} bodyStyle={{ padding: '12px 16px' }}>
          <Title level={5} style={{ marginTop: 0, color: '#14539b', fontWeight: 600 }}>Manufacturing Operation</Title>
          <Row gutter={[8, 8]} align="middle">
            <Col xs={24} md={18}>
              {distribution.map((row, index) => (
                <Row key={index} gutter={[8, 8]} style={{ marginBottom: '8px' }} align="middle">
                  <Col span={8}>
                    <Select
                      value={row.operation}
                      onChange={(val) => updateDistributionRow(index, 'operation', val)}
                      style={{ width: '100%' }}
                    >
                      {turningOperations.map(op => (
                        <Option key={op.value} value={op.value}>{op.label}</Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={6}>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={row.percent}
                      onChange={(e) => updateDistributionRow(index, 'percent', e.target.value)}
                      suffix="%"
                    />
                  </Col>
                  <Col span={7}>
                    <Select
                      placeholder="Select Size"
                      value={selectedSizes[row.operation]}
                      onChange={(val) => handleSizeChange(row.operation, val)}
                      style={{ width: '100%' }}
                    >
                      {getSizesForMaterial(analysisData.material?.name).map(size => (
                        <Option key={size} value={size}>{size}</Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={3}>
                    <Button danger onClick={() => removeDistributionRow(index)} disabled={distribution.length === 1} size="small">Remove</Button>
                  </Col>
                </Row>
              ))}
              <Button
                onClick={addDistributionRow}
                style={{ marginRight: 8, backgroundColor: 'white', borderColor: '#14539b', color: '#14539b' }}
              >
                Add Operation
              </Button>
              <Button
                type="primary"
                onClick={recalculateCost}
                loading={isCalculating}
                style={{ backgroundColor: '#14539b', borderColor: '#14539b' }}
              >
                Get Cost
              </Button>
            </Col>
            <Col xs={24} md={6}>
              <Text type="secondary">Quantity:</Text>
              <Input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min={1}
              />
            </Col>
          </Row>
        </Card>

        {/* Cost Summary */}
        <Card style={{ borderRadius: '8px', marginTop: '12px', backgroundColor: 'white' }} bodyStyle={{ padding: '12px 16px' }}>
          <Title level={5} style={{ marginTop: 0, color: '#14539b', fontWeight: 600 }}>Cost Summary</Title>
          {isCalculating ? (
            <div style={{ textAlign: 'center', padding: '20px', color: theme.textSecondary }}>Calculating cost...</div>
          ) : costData ? (
            <>
              {/* Row 1: Machining per-unit and Total Machining - Always visible */}
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div style={{
                    padding: '12px',
                    background: '#f0f9ff66',
                    borderRadius: '8px',
                    border: '1px solid #14539b22'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Manufaturing Cost Per Unit</div>
                      <div style={{ fontSize: 18, fontWeight: 600, color: '#14539b' }}>{formatCurrency(costData.total_machining_cost_per_unit)}</div>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{
                    padding: '12px',
                    background: '#f0f9ff66',
                    borderRadius: '8px',
                    border: '1px solid #14539b22'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Total Manufaturing Cost</div>
                      <div style={{ fontSize: 18, fontWeight: 600, color: '#14539b' }}>{formatCurrency(costData.total_machining_cost)}</div>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Include Material Cost toggle */}
              <div style={{ marginTop: '20px', marginBottom: '16px' }}>
                <Checkbox
                  checked={includeMaterialCost}
                  onChange={(e) => setIncludeMaterialCost(e.target.checked)}
                  style={{
                    fontSize: '14px',
                    color: '#374151',
                    fontWeight: 500
                  }}
                >
                  Include Material Cost
                </Checkbox>
              </div>

              {/* Material costs and Total costs - Only show when checkbox is checked */}
              {includeMaterialCost && (
                <>
                  {/* Row 2: Material per-unit and Total Material */}
                  <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                    <Col span={12}>
                      <div style={{
                        padding: '12px',
                        background: '#fff2e666',
                        borderRadius: '8px',
                        border: '1px solid #fa8c1622'
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Material Cost Per Unit</div>
                          <div style={{ fontSize: 16, fontWeight: 600, color: '#fa8c16' }}>{formatCurrency(costData.Material_cost_per_unit)}</div>
                        </div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{
                        padding: '12px',
                        background: '#fff2e666',
                        borderRadius: '8px',
                        border: '1px solid #fa8c1622'
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Total Material Cost</div>
                          <div style={{ fontSize: 16, fontWeight: 600, color: '#fa8c16' }}>{formatCurrency(costData.total_material_cost)}</div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>


                    <Col span={12}>
                      <div style={{
                        padding: '16px',
                        background: '#e6f7ff66',
                        borderRadius: '8px',
                        border: '1px solid #14539b22',
                        textAlign: 'center'
                      }}>
                        <div style={{ color: '#6b7280', fontSize: '16px', marginBottom: '8px' }}>Total Cost per unit (Including Materials )</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: '#14539b' }}>{formatCurrency(costData.total_cost_per_unit_with_materials)}</div>
                      </div>
                    </Col>

                    <Col span={12}>
                      <div style={{
                        padding: '16px',
                        background: '#e6f7ff66',
                        borderRadius: '8px',
                        border: '1px solid #14539b22',
                        textAlign: 'center'
                      }}>
                        <div style={{ color: '#6b7280', fontSize: '16px', marginBottom: '8px' }}>Total Cost (Including Materials )</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: '#14539b' }}>{formatCurrency(costData.total_cost_with_material_cost)}</div>
                      </div>
                    </Col>
                  </Row>
                </>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: theme.textSecondary }}>
              {initialCostData ? 'Initial cost data will be displayed here' : 'Click "Get Cost" to calculate turning operation costs'}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TurningCostReport;
