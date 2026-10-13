// import React, { useState, useRef, useEffect } from 'react';
// import { Card, Typography, Row, Col, Statistic, Button, Input, Select, message, Modal, Checkbox } from 'antd';
// import jsPDF from 'jspdf';

// const { Title, Text } = Typography;
// const { Option } = Select;

// const CostReport = ({ analysisData, theme, objUrl, onCostCalculationComplete, initialCostData }) => {
//   const [quantity, setQuantity] = useState(1);
//   const [machineRates, setMachineRates] = useState([]);
//   // CHANGED: Default distribution now has 3 machines with default percentages
//   const [distribution, setDistribution] = useState([
//     { machine: '3 Axis', size: '', percent: 70 },
//     { machine: '4 Axis', size: '', percent: 20 },
//     { machine: '5 Axis', size: '', percent: 10 }
//   ]);
//   const [availableSizes, setAvailableSizes] = useState({});
//   const [initialMachineInfo, setInitialMachineInfo] = useState(null);
//   const [costData, setCostData] = useState(null);
//   const [isCalculating, setIsCalculating] = useState(false);
//   const [showMaterialCost, setShowMaterialCost] = useState(false);
//   const [historyId, setHistoryId] = useState(null);
//   const [updatedAnalysisData, setUpdatedAnalysisData] = useState(null);

//   const [editableStockDimensions, setEditableStockDimensions] = useState({
//     length: null,
//     breadth: null,
//     height: null
//   });

//   const pdfRef = useRef();

//   const machineTypes = ['3 Axis', '4 Axis', '5 Axis'];

//   // Normalize backend response keys to legacy fields used in UI
//   const normalizeCostData = (data) => {
//     if (!data || typeof data !== 'object') return data;

//     console.log('Normalizing cost data:', data);

//     return {
//       ...data,
//       stock_mass: data.stock_weight_kg ?? data.stock_mass,
//       finished_product_weight: data.actual_weight ?? data.Actual_weight ?? data.finished_product_weight,
//       cost_per_unit: data.manufacturing_cost_perunit ?? data.cost_per_unit,
//       material_cost_per_unit: data.material_cost_perunit ?? data.Material_cost_perunit ?? data.material_cost_per_unit,
//       total_cost: data.manufacturing_cost_without_materialcost ?? data.Manufacturing_cost_without_materialcost ?? data.total_cost,
//       with_material_cost: data.manufacturing_cost_with_material_cost ?? data.Manufacturing_cost_with_material_cost ?? data.Manufacuring_cost_with_material_cost ?? data.with_material_cost,
//       material_cost: data.Total_material_cost ?? data.material_cost,
//       final_unit_cost: data.final_unit_cost,
//       machine_cost_breakup: data.machine_cost_breakup,
//       material: data.material_name ?? data.material,
//       filename: data.filename ?? data.filename,
//       stock_volume_mm3: data.stock_volume_mm3
//     };
//   };

//   // Seed initial cost data from parent
//   useEffect(() => {
//     if (analysisData && initialCostData) {
//       const normalized = normalizeCostData(initialCostData);
//       console.log('Setting initial cost data:', normalized);
//       setCostData(normalized);
//       setHistoryId(analysisData.id);
//       setUpdatedAnalysisData(analysisData);
//     }
//   }, [analysisData, initialCostData]);

//   // Fetch machine rates and set initial distribution based on response
//   useEffect(() => {
//     const fetchMachineRates = async () => {
//       try {
//         const response = await fetch('http://localhost:5678/Milling_getmachine-rates/');
//         if (response.ok) {
//           const data = await response.json();
//           setMachineRates(data);

//           // Build available sizes map
//           const sizesMap = {};
//           data.forEach(rate => {
//             if (!sizesMap[rate.machine_type]) {
//               sizesMap[rate.machine_type] = [];
//             }
//             if (!sizesMap[rate.machine_type].includes(rate.size)) {
//               sizesMap[rate.machine_type].push(rate.size);
//             }
//           });
//           setAvailableSizes(sizesMap);

//           // Set distribution based on initial cost data's machine_cost_breakup
//           if (initialCostData?.machine_cost_breakup) {
//             const breakupEntries = Object.entries(initialCostData.machine_cost_breakup);

//             if (breakupEntries.length > 0) {
//               // Create distribution array from machine_cost_breakup
//               const newDistribution = breakupEntries.map(([machineType, costInfo]) => {
//                 return {
//                   machine: machineType,
//                   size: costInfo.matched_machine_size || '',
//                   percent: costInfo.input_percentage || 100
//                 };
//               });

//               setDistribution(newDistribution);

//               // Store initial machine info for reference
//               const [firstMachine, firstInfo] = breakupEntries[0];
//               setInitialMachineInfo({
//                 machine: firstMachine,
//                 size: firstInfo.matched_machine_size || 'Auto-selected'
//               });
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching machine rates:', error);
//         message.error('Failed to fetch machine rates');
//       }
//     };

//     fetchMachineRates();
//   }, [initialCostData]);

//   // Initialize editable stock dimensions
//   useEffect(() => {
//     if (analysisData?.stock_dimensions) {
//       setEditableStockDimensions({
//         length: analysisData.stock_dimensions.length || null,
//         breadth: analysisData.stock_dimensions.breadth || null,
//         height: analysisData.stock_dimensions.height || null
//       });
//     }
//   }, [analysisData]);

//   const handleStockDimensionChange = (field, value) => {
//     const numValue = parseFloat(value) || null;
//     setEditableStockDimensions(prev => ({
//       ...prev,
//       [field]: numValue
//     }));
//   };

//   // Update stock dimensions with proper cost data update
//   const updateStockDimensions = async () => {
//     if (!historyId) {
//       message.warning('Please calculate cost first before updating stock dimensions');
//       return;
//     }

//     if (!editableStockDimensions.length || !editableStockDimensions.breadth || !editableStockDimensions.height) {
//       message.error('Please enter all stock dimensions');
//       return;
//     }

//     setIsCalculating(true);

//     try {
//       const formData = new FormData();
//       formData.append('history_id', historyId);
//       formData.append('stock_length', editableStockDimensions.length);
//       formData.append('stock_breadth', editableStockDimensions.breadth);
//       formData.append('stock_height', editableStockDimensions.height);

//       const response = await fetch(`http://localhost:5678/Milling_update-stock_cost/`, {
//         method: 'PUT',
//         body: formData
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update stock dimensions');
//       }

//       const result = await response.json();
//       console.log('Stock update response:', result);

//       const normalized = normalizeCostData(result);
//       console.log('Normalized stock update:', normalized);

//       setCostData(normalized);

//       setUpdatedAnalysisData(prev => ({
//         ...prev,
//         stock_dimensions: {
//           ...prev?.stock_dimensions,
//           length: editableStockDimensions.length,
//           breadth: editableStockDimensions.breadth,
//           height: editableStockDimensions.height,
//           volume_mm3: result.stock_volume_mm3
//         }
//       }));

//       message.success('Stock dimensions and costs updated successfully');
//     } catch (error) {
//       console.error('Error updating stock dimensions:', error);
//       message.error('Failed to update stock dimensions');
//     } finally {
//       setIsCalculating(false);
//     }
//   };

//   // CHANGED: Updated calculateCost to call /Milling_update-size-cost-try/ endpoint
//   const calculateCost = async () => {
//     if (!analysisData) {
//       message.error('No analysis data available');
//       return;
//     }

//     const total = distribution.reduce((s, d) => s + (Number(d.percent) || 0), 0);
//     if (total <= 0 || total > 100) {
//       message.error('Machine distribution must sum to 1–100%');
//       return;
//     }

//     // Check if all machines with percentage > 0 have a size selected
//     const hasEmptySize = distribution.some(d => d.machine && Number(d.percent) > 0 && !d.size);
//     if (hasEmptySize) {
//       message.error('Please select size for all machines with percentage > 0');
//       return;
//     }

//     setIsCalculating(true);

//     try {
//       // Build machine distribution object from the distribution array
//       const dist = distribution.reduce((acc, d) => {
//         if (d.machine && Number(d.percent) > 0) acc[d.machine] = Number(d.percent);
//         return acc;
//       }, {});

//       // Get the primary size (from the first machine with a size selected)
//       const primarySize = distribution.find(d => d.size && Number(d.percent) > 0)?.size;

//       if (!primarySize) {
//         message.error('Please select a machine size');
//         setIsCalculating(false);
//         return;
//       }

//       console.log('Sending machine distribution:', dist);
//       console.log('Using size:', primarySize);

//       const payload = {
//         history_id: analysisData.id,
//         machine_distribution: dist
//       };

//       // CHANGED: Now calling the /Milling_update-size-cost-try/ endpoint with size parameter
//       const response = await fetch(`http://localhost:5678/Milling_update-size-cost-try/?size=${encodeURIComponent(primarySize)}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });

//       if (!response.ok) throw new Error('Failed to calculate cost');

//       const result = await response.json();
//       const normalized = normalizeCostData(result);
//       console.log('Calculate cost normalized:', normalized);
//       setCostData(normalized);
//       setHistoryId(analysisData.id);
//       localStorage.setItem('currentCalculationId', analysisData.id);
//       if (onCostCalculationComplete) onCostCalculationComplete(analysisData.id);

//       // Update distribution with matched machine sizes from response
//       if (result.machine_cost_breakup) {
//         const updatedDistribution = distribution.map(row => {
//           const breakupInfo = result.machine_cost_breakup[row.machine];
//           if (breakupInfo && breakupInfo.matched_machine_size) {
//             return {
//               ...row,
//               size: breakupInfo.matched_machine_size
//             };
//           }
//           return row;
//         });
//         setDistribution(updatedDistribution);
//       }

//       message.success('Cost calculated successfully');
//     } catch (error) {
//       console.error('Error calculating cost:', error);
//       message.error('Failed to calculate cost');
//     } finally {
//       setIsCalculating(false);
//     }
//   };

//   // MODIFIED: Add new empty row instead of resetting all rows
//   const addDistributionRow = () => {
//     // Add a new empty row to the existing distribution
//     setDistribution(prev => [
//       ...prev,
//       { machine: '3 Axis', size: '', percent: 0 }
//     ]);
//   };

//   const updateDistributionRow = (index, key, value) => {
//     setDistribution(prev => prev.map((row, i) => {
//       if (i === index) {
//         const updatedRow = { ...row, [key]: value };
//         if (key === 'machine') {
//           updatedRow.size = '';
//         }
//         return updatedRow;
//       }
//       return row;
//     }));
//   };

//   const removeDistributionRow = (index) => {
//     if (distribution.length === 1) return;
//     setDistribution(prev => prev.filter((_, i) => i !== index));
//   };

//   const recalculateCost = async () => {
//     if (!historyId) {
//       message.error('No calculation history available');
//       return;
//     }

//     const total = distribution.reduce((s, d) => s + (Number(d.percent) || 0), 0);
//     if (total <= 0 || total > 100) {
//       message.error('Machine distribution must sum to 1–100%');
//       return;
//     }

//     const hasEmptySize = distribution.some(d => d.machine && Number(d.percent) > 0 && !d.size);
//     if (hasEmptySize) {
//       message.error('Please select size for all machines');
//       return;
//     }

//     setIsCalculating(true);
//     try {
//       const dist = distribution.reduce((acc, d) => {
//         if (d.machine && Number(d.percent) > 0) acc[d.machine] = Number(d.percent);
//         return acc;
//       }, {});

//       const primarySize = distribution.find(d => d.size && Number(d.percent) > 0)?.size;

//       if (!primarySize) {
//         message.error('Please select a machine size');
//         setIsCalculating(false);
//         return;
//       }

//       console.log('Recalculating with size:', primarySize);
//       console.log('Machine distribution:', dist);

//       const response = await fetch(`http://localhost:5678/Milling_update-size-cost-try/?size=${encodeURIComponent(primarySize)}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           history_id: historyId, 
//           machine_distribution: dist 
//         })
//       });

//       if (!response.ok) throw new Error('Failed to recalculate cost');

//       const result = await response.json();
//       console.log('Recalculate response:', result);

//       const normalized = normalizeCostData(result);
//       console.log('Normalized recalculate data:', normalized);

//       setCostData(normalized);

//       message.success('Cost recalculated successfully based on selected size');
//     } catch (error) {
//       console.error('Error recalculating cost:', error);
//       message.error('Failed to recalculate cost: ' + error.message);
//     } finally {
//       setIsCalculating(false);
//     }
//   };

//   const updateMaterialCost = async () => {
//     if (!costData?.id) {
//       return;
//     }

//     setIsCalculating(true);

//     try {
//       const response = await fetch(`http://localhost:5678/update-material-cost/${costData.id}`, {
//         method: 'PUT',
//         headers: {
//           'accept': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update material cost');
//       }

//       const result = await response.json();
//       setCostData(prev => ({
//         ...prev,
//         total_cost: result.total_cost_without_material || prev.total_cost,
//         with_material_cost: result.with_material_cost || prev.with_material_cost,
//         material_cost: result.material_cost || prev.material_cost,
//         material_cost_per_unit: result.material_cost_per_unit || prev.material_cost_per_unit,
//         material_cost_per_kg: result.material_cost_per_kg || prev.material_cost_per_kg,
//         material_name: result.material_name || prev.material_name,
//         stock_mass_kg: result.stock_mass_kg || prev.stock_mass_kg,
//         finished_product_weight: result.finished_product_weight || prev.finished_product_weight,
//         final_unit_cost: result.final_unit_cost || prev.final_unit_cost,
//         stock_mass: result.stock_mass || prev.stock_mass
//       }));
//       message.success('Material cost updated successfully');
//     } catch (error) {
//       console.error('Error updating material cost:', error);
//       message.error('Failed to update material cost');
//     } finally {
//       setIsCalculating(false);
//     }
//   };

//   const updateQuantity = async (newQuantity) => {
//     if (!historyId) {
//       message.error('No calculation history available');
//       return;
//     }

//     setIsCalculating(true);

//     try {
//       const response = await fetch(`http://localhost:5678/milling/update-quantity/${historyId}?quantity=${newQuantity}`, {
//         method: 'PUT',
//         headers: {
//           'accept': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update quantity');
//       }

//       const result = await response.json();
//       setCostData(prev => ({
//         ...prev,
//         total_cost: result.manufacturing_cost_without_materialcost || prev.total_cost,
//         with_material_cost: result.manufacturing_cost_with_material_cost || prev.with_material_cost,
//         material_cost_per_unit: result.material_cost_perunit || prev.material_cost_per_unit,
//         material_cost: result.total_material_cost || prev.material_cost,
//         manufacturing_cost_perunit: result.manufacturing_cost_perunit || prev.manufacturing_cost_perunit
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
//     if (historyId) {
//       updateQuantity(newQuantity);
//     }
//   };

//   const formatCurrency = (value) => {
//     if (value === null || value === undefined) return 'N/A';
//     const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
//     return `Rs.${numValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//   };

//   const handleDownloadPDF = async () => {
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

//       pdf.setFont('georgia', 'normal');

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

//       const currentAnalysis = updatedAnalysisData || analysisData;

//       if (currentAnalysis) {
//         tableData.push(['', '']);
//         tableData.push(['MODULE: Machining Module (Milling Process)', '']);

//         tableData.push(['MATERIAL DATA', '']);
//         tableData.push(['Material', safeString(costData?.material || currentAnalysis.material_name || 'N/A')]);
//         tableData.push(['Density', currentAnalysis.density ? `${safeString(currentAnalysis.density)} kg/m³` : 'N/A']);

//         if (currentAnalysis.actual_dimensions) {
//           tableData.push(['', '']);
//           tableData.push(['FINAL COMPONENT ACTUAL DIMENSIONS', '']);
//           tableData.push(['Volume (mm³)', safeString(currentAnalysis.actual_dimensions.volume_mm3 || 'N/A')]);
//           tableData.push(['Mass', costData?.finished_product_weight ? `${costData.finished_product_weight} kg` : 'N/A']);
//         }

//         if (currentAnalysis.actual_dimensions) {
//           tableData.push(['', '']);
//           tableData.push(['BOUNDING BOX DIMENSIONS', '']);

//           const length = currentAnalysis.actual_dimensions.length || 'N/A';
//           const breadth = currentAnalysis.actual_dimensions.breadth || 'N/A';
//           const height = currentAnalysis.actual_dimensions.height || 'N/A';
//           const dimensionsFormat = `${length} mm × ${breadth} mm × ${height} mm`;

//           tableData.push(['Length × Breadth × Height', dimensionsFormat]);
//         }

//         if (currentAnalysis.stock_dimensions) {
//           tableData.push(['', '']);
//           tableData.push(['STOCK DIMENSIONS', '']);
//           tableData.push(['Volume (mm³)', safeString(currentAnalysis.stock_dimensions.volume_mm3 || 'N/A')]);
//           tableData.push(['Mass', costData?.stock_mass ? `${costData.stock_mass} kg` : 'N/A']);

//           tableData.push(['', '']);
//           tableData.push(['RECOMMENDED BOUNDING BOX DIMENSIONS', '']);

//           const stockLength = editableStockDimensions.length || currentAnalysis.stock_dimensions.length || 'N/A';
//           const stockBreadth = editableStockDimensions.breadth || currentAnalysis.stock_dimensions.breadth || 'N/A';
//           const stockHeight = editableStockDimensions.height || currentAnalysis.stock_dimensions.height || 'N/A';
//           const stockDimensionsFormat = `${stockLength} mm × ${stockBreadth} mm × ${stockHeight} mm`;

//           tableData.push(['Length × Breadth × Height', stockDimensionsFormat]);
//         }
//       }

//       tableData.push(['', '']);
//       tableData.push(['MANUFACTURING SETTINGS', '']);
//       const distStr = distribution.map(d => `${d.machine} (${d.size || 'N/A'}) ${d.percent}%`).join(', ');
//       tableData.push(['Machine Distribution', safeString(distStr || '3 Axis 70%, 4 Axis 20%, 5 Axis 10%')]);
//       tableData.push(['Quantity', safeString(quantity)]);

//       if (costData) {
//         tableData.push(['', '']);
//         tableData.push(['COST SUMMARY', '']);
//         if (costData.material_cost_per_kg) {
//           tableData.push(['Material Cost per kg', formatCurrencyForPDF(costData.material_cost_per_kg)]);
//         }
//         if (costData.material_cost_per_unit) {
//           tableData.push(['Material Cost Per Unit', formatCurrencyForPDF(costData.material_cost_per_unit)]);
//         }
//         tableData.push(['Machining Cost Per Unit', formatCurrencyForPDF(costData.cost_per_unit)]);
//         if (costData.material_cost) {
//           tableData.push(['Total Material Cost For Given Quantity', formatCurrencyForPDF(costData.material_cost)]);
//         }
//         if (costData.total_cost) {
//           tableData.push(['Total Machining Cost For Given Quantity', formatCurrencyForPDF(costData.total_cost)]);
//         }
//         if (costData.with_material_cost) {
//           tableData.push(['OverAll Total Cost (Machining+Material cost)', formatCurrencyForPDF(costData.with_material_cost)]);
//         }
//       }

//       const startY = yPosition;
//       const rowHeight = 5;
//       const col1Width = contentWidth * 0.6;

//       let currentY = startY;

//       tableData.forEach((row) => {
//         const [label, value] = row;

//         const isSectionHeader = label && !value && (label.includes('DIMENSIONS') || label.includes('SETTINGS') || label.includes('SUMMARY') || label.includes('EXTRA') || label.includes('MATERIAL DATA') || label.includes('MODULE:'));
//         const isEmptyRow = !label && !value;

//         if (isEmptyRow) {
//           currentY += rowHeight / 2;
//           return;
//         }

//         const getBackgroundColor = (label) => {
//           if (isSectionHeader) {
//             return [41, 128, 185];
//           }
//           if (label.includes('Volume') || label.includes('Length') || label.includes('Breadth') || label.includes('Height') || label.includes('Dimensions')) {
//             return [217, 237, 247];
//           }
//           if (label.includes('Machine') || label.includes('Quantity') || label.includes('Distribution')) {
//             return [236, 236, 236];
//           }
//           if (label.includes('Cost') || label.includes('Mass') || label.includes('Material')) {
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

//           const isCostSummaryRow = (label.includes('Cost') || label.includes('Machining')) && label !== 'MATERIAL DATA' && label !== 'Material';

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
//           const filename = `Cost_Report_${analysisData?.filename?.replace(/\.[^/.]+$/, '') || 'Model'}_${new Date().getTime()}.pdf`;
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

//   const currentAnalysis = updatedAnalysisData || analysisData;

//   return (
//     <Card 
//       title={
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <span style={{ color: theme.primary, fontSize: '18px', fontWeight: 600 }}>
//             Manufacturing Cost Report
//           </span>
//           <div ref={pdfRef}>
//             <Button 
//               type="primary" 
//               onClick={handleDownloadPDF}
//               style={{ borderRadius: '6px', height: '40px', fontWeight: 500, backgroundColor:'#246679'}}
//             >
//               Download PDF Report
//             </Button>
//           </div>
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
//         overflow: 'auto'
//       }}
//     >
//       <div style={{ overflow: 'auto', height: '100%' }}>
//         {currentAnalysis ? (
//           <>
//             <Row gutter={[24, 0]} style={{ marginBottom: '24px' }}>
//               <Col span={12}>
//                 <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
//                   File Information
//                 </Title>
//                 <div style={{ marginBottom: '12px' }}>
//                   <Text style={{ color: theme.textSecondary }}>Filename:</Text>
//                   <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
//                     {costData?.filename || currentAnalysis.filename || 'N/A'}
//                   </div>
//                 </div>
//               </Col>
//               <Col span={12}>
//                 <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
//                   Material Information
//                 </Title>
//                 <Row gutter={[16, 16]}>
//                   <Col span={12}>
//                     <div style={{ marginBottom: '12px' }}>
//                       <Text style={{ color: theme.textSecondary }}>Material:</Text>
//                       <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
//                         {costData?.material || currentAnalysis.material_name || 'N/A'}
//                       </div>
//                     </div>
//                   </Col>
//                   <Col span={12}>
//                     <div style={{ marginBottom: '12px' }}>
//                       <Text style={{ color: theme.textSecondary }}>Density:</Text>
//                       <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
//                         {currentAnalysis.density ? `${currentAnalysis.density} kg/m³` : 'N/A'}
//                       </div>
//                     </div>
//                   </Col>
//                 </Row>
//               </Col>
//             </Row>

//             <div style={{ marginBottom: '24px' }}>
//               <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
//                 Model Dimensions
//               </Title>

//               <Row gutter={[16, 16]}>
//                 <Col span={12}>
//                   <div style={{
//                     background: '#f0f9ff',
//                     padding: '16px',
//                     borderRadius: '8px',
//                     borderLeft: `4px solid ${theme.primary}`,
//                     height: '100%'
//                   }}>




//                     <h4 style={{ 
//                       color: theme.primary, 
//                       fontWeight: 600, 
//                       marginBottom: '12px',
//                       fontSize: '13px'
//                     }}>
//                       BOUNDING BOX DIMENSIONS
//                     </h4>

//                     <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
//                       <div style={{ flex: 1 }}>
//                         <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Length:</span>
//                         <div style={{ fontWeight: 500, color: theme.textPrimary }}>
//                           {currentAnalysis.actual_dimensions?.length ? `${currentAnalysis.actual_dimensions.length} mm` : 'N/A'}
//                         </div>
//                       </div>
//                       <div style={{ flex: 1 }}>
//                         <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Breadth:</span>
//                         <div style={{ fontWeight: 500, color: theme.textPrimary }}>
//                           {currentAnalysis.actual_dimensions?.breadth ? `${currentAnalysis.actual_dimensions.breadth} mm` : 'N/A'}
//                         </div>
//                       </div>
//                       <div style={{ flex: 1 }}>
//                         <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Thickness:</span>
//                         <div style={{ fontWeight: 500, color: theme.textPrimary }}>
//                           {currentAnalysis.actual_dimensions?.height ? `${currentAnalysis.actual_dimensions.height} mm` : 'N/A'}
//                         </div>
//                       </div>
//                     </div>
//                          <h3 style={{ 
//                       color: theme.primary, 
//                       fontWeight: 600, 
//                       marginBottom: '12px',
//                       fontSize: '14px',
//                       marginTop: '18px'

//                     }}>
//                       FINAL COMPONENT ACTUAL DIMENSIONS
//                     </h3>
//                     <Row gutter={[16, 0]} style={{ marginBottom: '16px' }}>
//                       <Col span={12}>
//                         <span style={{ color: theme.textSecondary }}>Volume (mm³):</span>
//                         <div style={{ 
//                           fontWeight: 600, 
//                           fontSize: '16px',
//                           color: theme.textPrimary,
//                           marginTop: '4px'
//                         }}>
//                           {currentAnalysis.actual_dimensions?.volume_mm3 || 'N/A'}
//                         </div>
//                       </Col>
//                       <Col span={12}>
//                         <span style={{ color: theme.textSecondary }}>Mass:</span>
//                         <div style={{ 
//                           fontWeight: 600, 
//                           fontSize: '16px',
//                           color: theme.textPrimary,
//                           marginTop: '4px'
//                         }}>
//                           {costData?.finished_product_weight ? `${costData.finished_product_weight} kg` : 'N/A'}
//                         </div>
//                       </Col>
//                     </Row>
//                   </div>
//                 </Col>

//                 <Col span={12}>
//                   <div style={{ 
//                     background: '#f6ffed',
//                     padding: '16px',
//                     borderRadius: '8px',
//                     borderLeft: `4px solid ${theme.success}`,
//                     height: '100%'
//                   }}>

//                     <Text strong style={{ 
//                       color: theme.success,
//                       fontSize: '13px',
//                       marginBottom: '12px',
//                       display: 'block',
//                       fontWeight: 600
//                     }}>
//                       RECOMMENDED STOCK DIMENSIONS
//                     </Text>

//                     <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
//                       <div style={{ flex: 1 }}>
//                         <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Length:</span>
//                         <Input
//                           type="number"
//                           value={editableStockDimensions.length}
//                           onChange={(e) => handleStockDimensionChange('length', e.target.value)}
//                           placeholder="Length"
//                           size="small"
//                           style={{ 
//                             marginTop: '2px',
//                             fontSize: '12px'
//                           }}
//                           suffix="mm"
//                         />
//                       </div>
//                       <div style={{ flex: 1 }}>
//                         <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Breadth:</span>
//                         <Input
//                           type="number"
//                           value={editableStockDimensions.breadth}
//                           onChange={(e) => handleStockDimensionChange('breadth', e.target.value)}
//                           placeholder="Breadth"
//                           size="small"
//                           style={{ 
//                             marginTop: '2px',
//                             fontSize: '12px'
//                           }}
//                           suffix="mm"
//                         />
//                       </div>
//                       <div style={{ flex: 1 }}>
//                         <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Thickness:</span>
//                         <Input
//                           type="number"
//                           value={editableStockDimensions.height}
//                           onChange={(e) => handleStockDimensionChange('height', e.target.value)}
//                           placeholder="Height"
//                           size="small"
//                           style={{ 
//                             marginTop: '2px',
//                             fontSize: '12px'
//                           }}
//                           suffix="mm"
//                         />
//                       </div>
//                     </div>

//                     <div style={{ textAlign: 'center', marginTop: '8px' }}>
//                       <Button
//                         type="primary"
//                         size="small"
//                         onClick={updateStockDimensions}
//                         loading={isCalculating}
//                         style={{
//                           backgroundColor: theme.success,
//                           borderColor: theme.success,
//                           fontSize: '12px',
//                           height: '28px',
//                           marginBottom: '10px'
//                         }}
//                       >
//                         Update Dimensions
//                       </Button>
//                     <div style={{ textAlign: 'left', marginBottom: '12px' }}>
//     <Text
//       strong
//       style={{
//         color: theme.success,
//         fontSize: '14px',
//         fontWeight: 600,
//       }}
//     >
//       STOCK DIMENSIONS
//     </Text>

//     <Row gutter={[16, 0]} style={{ marginBottom: '16px' }}>
//                       <Col span={12}>
//                         <Text style={{ color: theme.textSecondary }}>Volume (mm³):</Text>
//                         <div style={{ 
//                           fontWeight: 600, 
//                           fontSize: '16px',
//                           color: theme.textPrimary,
//                           marginTop: '4px'
//                         }}>
//                           {currentAnalysis.stock_dimensions?.volume_mm3 || 'N/A'}
//                         </div>
//                       </Col>
//                       <Col span={12}>
//                         <Text style={{ color: theme.textSecondary }}>Mass:</Text>
//                         <div style={{ 
//                           fontWeight: 600, 
//                           fontSize: '16px',
//                           color: theme.textPrimary,
//                           marginTop: '4px'
//                         }}>
//                           {costData?.stock_mass ? `${costData.stock_mass} kg` : 'N/A'}
//                         </div>
//                       </Col>
//                     </Row>
//   </div>



//                     </div>



//                   </div>
//                 </Col>
//               </Row>
//             </div>

//             <div style={{ marginBottom: '24px' }}>
//               <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
//                 Manufacturing Operations
//               </Title>

//               <Row gutter={[16, 16]}>
//                 <Col span={16}>
//                   {distribution.map((row, index) => (
//                     <Row key={index} gutter={[8, 8]} style={{ marginBottom: '8px' }}>
//                       <Col span={6}>
//                         <Select
//                           value={row.machine}
//                           onChange={(val) => updateDistributionRow(index, 'machine', val)}
//                           style={{ width: '100%' }}
//                         >
//                           {machineTypes.map(type => (
//                             <Option key={type} value={type}>{type}</Option>
//                           ))}
//                         </Select>
//                       </Col>
//                       <Col span={6}>
//                         <Select
//                           value={row.size}
//                           onChange={(val) => updateDistributionRow(index, 'size', val)}
//                           style={{ width: '100%' }}
//                           placeholder="Select Size"
//                         >
//                           {(availableSizes[row.machine] || []).map(size => (
//                             <Option key={size} value={size}>{size}</Option>
//                           ))}
//                         </Select>
//                       </Col>
//                       <Col span={6}>
//                         <Input
//                           type="number"
//                           min={0}
//                           max={100}
//                           value={row.percent}
//                           onChange={(e) => updateDistributionRow(index, 'percent', e.target.value)}
//                           suffix="%"
//                         />
//                       </Col>
//                       <Col span={6}>
//                         <Button danger onClick={() => removeDistributionRow(index)} disabled={distribution.length === 1}>Remove</Button>
//                       </Col>
//                     </Row>
//                   ))}
//                   <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
//                     <Button onClick={addDistributionRow}>Add Operation</Button>
//                     <Button type="primary" onClick={calculateCost} loading={isCalculating}>
//                       Get Cost
//                     </Button>
//                   </div>
//                 </Col>
//                 <Col span={8}>
//   <div style={{ marginBottom: '12px' }}>
//     <Text
//       strong
//       style={{
//         color: theme.primary,       // same color as "Manufacturing Operations"
//         fontSize: '14px',           // same font size
//         fontWeight: 600,            // bold like heading
//         display: 'block',
//         marginBottom: '6px',
//         textAlign: 'left',          // move text left
//       }}
//     >
//       Quantity:
//     </Text>

//     <Input
//       type="number"
//       value={quantity}
//       onChange={handleQuantityChange}
//       style={{
//         fontSize: '14px',           // increased font size
//         borderRadius: '6px',
//         width: '60%',               // reduced width so it aligns better
//         marginRight: '0',
//       }}
//       min={1}
//     />
//   </div>
// </Col>

//               </Row>
//             </div>

//             <div>
//               <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
//                 Cost Summary
//               </Title>

//               {isCalculating ? (
//                 <div style={{ textAlign: 'center', padding: '40px 0', color: theme.textSecondary }}>
//                   <div style={{
//                     border: `4px solid ${theme.primary}33`,
//                     borderTop: `4px solid ${theme.primary}`,
//                     borderRadius: '50%',
//                     width: '40px',
//                     height: '40px',
//                     animation: 'spin 1s linear infinite',
//                     margin: '0 auto 16px'
//                   }} />
//                   <Text style={{ color: theme.primary, fontSize: '16px' }}>
//                     Calculating cost...
//                   </Text>
//                 </div>
//               ) : costData ? (
//                 <>
//                   <Row gutter={[16, 16]}>
//                     <Col span={12}>
//                       <div style={{
//                         padding: '12px',
//                         background: `${theme.lightBlue}66`,
//                         borderRadius: '8px',
//                         border: `1px solid ${theme.primary}22`
//                       }}>
//                         <Statistic 
//                           title={<span style={{ color: theme.textSecondary }}>Manufaturing Cost Per Unit</span>} 
//                           value={formatCurrency(costData.cost_per_unit)} 
//                           valueStyle={{ color: theme.primary, fontWeight: 600, fontSize: '18px' }}
//                         />
//                       </div>
//                     </Col>
//                     <Col span={12}>
//                       <div style={{
//                         padding: '12px',
//                         background: `${theme.lightBlue}66`,
//                         borderRadius: '8px',
//                         border: `1px solid ${theme.primary}22`
//                       }}>
//                         <Statistic 
//                           title={<span style={{ color: theme.textSecondary }}>Total Manufaturing Cost</span>} 
//                           value={formatCurrency(costData.total_cost)} 
//                           valueStyle={{ color: theme.primary, fontWeight: 600, fontSize: '18px' }}
//                         />
//                       </div>
//                     </Col>
//                   </Row>

//                   <div style={{ marginTop: '20px', marginBottom: '16px' }}>
//                     <Checkbox 
//                       checked={showMaterialCost}
//                       onChange={(e) => {
//                         setShowMaterialCost(e.target.checked);
//                         if (e.target.checked) {
//                           updateMaterialCost();
//                         }
//                       }}
//                       style={{ 
//                         fontSize: '14px',
//                         color: theme.textPrimary,
//                         fontWeight: 500
//                       }}
//                     >
//                       Include Material Cost
//                     </Checkbox>
//                   </div>

//                   {showMaterialCost && (
//                     <>
//                       <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
//                         {costData.material_cost_per_unit && (
//                           <Col span={12}>
//                             <div style={{
//                               padding: '12px',
//                               background: '#fff2e666',
//                               borderRadius: '8px',
//                               border: `1px solid #fa8c1622`
//                             }}>
//                               <Statistic 
//                                 title={<span style={{ color: theme.textSecondary }}>Material Cost Per Unit</span>} 
//                                 value={formatCurrency(costData.material_cost_per_unit)} 
//                                 valueStyle={{ color: '#fa8c16', fontWeight: 600, fontSize: '16px' }}
//                               />
//                             </div>
//                           </Col>
//                         )}
//                         {costData.material_cost && (
//                           <Col span={12}>
//                             <div style={{
//                               padding: '12px',
//                               background: '#fff2e666',
//                               borderRadius: '8px',
//                               border: `1px solid #fa8c1622`
//                             }}>
//                               <Statistic 
//                                 title={<span style={{ color: theme.textSecondary }}>Total Material Cost</span>} 
//                                 value={formatCurrency(costData.material_cost)} 
//                                 valueStyle={{ color: '#fa8c16', fontWeight: 600, fontSize: '16px' }}
//                               />
//                             </div>
//                           </Col>
//                         )}
//                       </Row>

//                       {(costData.final_unit_cost || costData.with_material_cost) && (
//                         <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
//                           {costData.final_unit_cost && (
//                             <Col span={12}>
//                               <div style={{
//                                 padding: '16px',
//                                 background: '#f0f9ff66',
//                                 borderRadius: '8px',
//                                 border: `1px solid ${theme.primary}22`,
//                                 textAlign: 'center'
//                               }}>
//                                 <Statistic 
//                                   title={<span style={{ color: theme.textSecondary, fontSize: '16px' }}>Total Machining cost perunit with Material cost</span>} 
//                                   value={formatCurrency(costData.final_unit_cost)} 
//                                   valueStyle={{ color: theme.primary, fontWeight: 700, fontSize: '20px' }}
//                                 />
//                               </div>
//                             </Col>
//                           )}
// {costData.with_material_cost && (
//   <Col span={12}>
//     <div style={{
//       padding: '16px',
//       background: '#e6f7ff66',
//       borderRadius: '8px',
//       border: `1px solid ${theme.primary}22`,
//       textAlign: 'center'
//     }}>
//       <Statistic 
//         title={<span style={{ color: theme.textSecondary, fontSize: '16px' }}>Total Cost (Including Material)</span>} 
//         value={formatCurrency(costData.with_material_cost)} 
//         valueStyle={{ color: theme.primary, fontWeight: 700, fontSize: '20px' }}
//       />
//     </div>
//   </Col>
// )}
// {costData.total_cost && (
//   <Col span={12}>
//     <div style={{
//       padding: '16px',
//       background: '#e6f7ff66',
//       borderRadius: '8px',
//       border: `1px solid ${theme.primary}22`,
//       textAlign: 'center'
//     }}>
//       <Statistic 
//         title={<span style={{ color: theme.textSecondary, fontSize: '16px' }}>Total Cost (Without Material)</span>} 
//         value={formatCurrency(costData.total_cost)} 
//         valueStyle={{ color: theme.primary, fontWeight: 700, fontSize: '20px' }}
//       />
//     </div>
//   </Col>
// )}
//                         </Row>
//                       )}
//                     </>
//                   )}
//                 </>
//               ) : (
//                 <div style={{ textAlign: 'center', padding: '40px 0', color: theme.textSecondary }}>
//                   <Text style={{ color: theme.textSecondary, fontSize: '16px' }}>
//                     No cost data available. Click "Get Cost" to calculate.
//                   </Text>
//                 </div>
//               )}
//             </div>
//           </>
//         ) : (
//           <div style={{ textAlign: 'center', padding: '40px 0', color: theme.textSecondary }}>
//             <Text style={{ color: theme.textSecondary, fontSize: '16px' }}>
//               No analysis data available
//             </Text>
//           </div>
//         )}
//       </div>
//     </Card>
//   );
// };

// export default CostReport;










// '''''working code december/23/2025'''''''''''''//
// import React, { useState, useRef, useEffect } from 'react';
// import { Card, Typography, Row, Col, Statistic, Button, Input, Select, message, Modal, Checkbox } from 'antd';
// import jsPDF from 'jspdf';

// const { Title, Text } = Typography;
// const { Option } = Select;

// const CostReport = ({ analysisData, theme, objUrl, onCostCalculationComplete, initialCostData }) => {
//   const [quantity, setQuantity] = useState(1);
//   const [machineRates, setMachineRates] = useState([]);
//   // CHANGED: Default distribution now has 3 machines with default percentages
//   const [distribution, setDistribution] = useState([
//     { machine: '3 Axis', size: '', percent: 70 },
//     { machine: '4 Axis', size: '', percent: 0 },
//     { machine: '5 Axis', size: '', percent: 30 }
//   ]);
//   const [availableSizes, setAvailableSizes] = useState({});
//   const [initialMachineInfo, setInitialMachineInfo] = useState(null);
//   const [costData, setCostData] = useState(null);
//   const [isCalculating, setIsCalculating] = useState(false);
//   const [showMaterialCost, setShowMaterialCost] = useState(false);
//   const [historyId, setHistoryId] = useState(null);
//   const [updatedAnalysisData, setUpdatedAnalysisData] = useState(null);

//   const [editableStockDimensions, setEditableStockDimensions] = useState({
//     length: null,
//     breadth: null,
//     height: null
//   });

//   const pdfRef = useRef();

//   const machineTypes = ['3 Axis', '4 Axis', '5 Axis'];

//   // Normalize backend response keys to legacy fields used in UI
//   const normalizeCostData = (data) => {
//     if (!data || typeof data !== 'object') return data;

//     console.log('Normalizing cost data:', data);

//     return {
//       ...data,
//       stock_mass: data.stock_weight_kg ?? data.stock_mass,
//       finished_product_weight: data.actual_weight ?? data.Actual_weight ?? data.finished_product_weight,
//       cost_per_unit: data.manufacturing_cost_perunit ?? data.cost_per_unit,
//       material_cost_per_unit: data.material_cost_perunit ?? data.Material_cost_perunit ?? data.material_cost_per_unit,
//       total_cost: data.manufacturing_cost_without_materialcost ?? data.Manufacturing_cost_without_materialcost ?? data.total_cost,
//       total_cost_per_unit_with_materials: data.total_cost_per_unit_with_materials,
//       with_material_cost: data.manufacturing_cost_with_material_cost ?? data.Manufacturing_cost_with_material_cost ?? data.Manufacuring_cost_with_material_cost ?? data.with_material_cost,
//       material_cost: data.Total_material_cost ?? data.material_cost,
//       final_unit_cost: data.final_unit_cost,
//       machine_cost_breakup: data.machine_cost_breakup,
//       material: data.material_name ?? data.material,
//       filename: data.filename ?? data.filename,
//       stock_volume_mm3: data.stock_volume_mm3
//     };
//   };

//   // Seed initial cost data from parent
//   useEffect(() => {
//     if (analysisData && initialCostData) {
//       const normalized = normalizeCostData(initialCostData);
//       console.log('Setting initial cost data:', normalized);
//       setCostData(normalized);
//       setHistoryId(analysisData.id);
//       setUpdatedAnalysisData(analysisData);
//     }
//   }, [analysisData, initialCostData]);

//   // Fetch machine rates and set initial distribution based on response
//   useEffect(() => {
//     const fetchMachineRates = async () => {
//       try {
//         const response = await fetch('http://localhost:5678/Milling_getmachine-rates/');
//         if (response.ok) {
//           const data = await response.json();
//           setMachineRates(data);

//           // Build available sizes map
//           const sizesMap = {};
//           data.forEach(rate => {
//             if (!sizesMap[rate.machine_type]) {
//               sizesMap[rate.machine_type] = [];
//             }
//             if (!sizesMap[rate.machine_type].includes(rate.size)) {
//               sizesMap[rate.machine_type].push(rate.size);
//             }
//           });
//           setAvailableSizes(sizesMap);

//           // Set distribution based on initial cost data's machine_cost_breakup
//           if (initialCostData?.machine_cost_breakup) {
//             const breakupEntries = Object.entries(initialCostData.machine_cost_breakup);

//             if (breakupEntries.length > 0) {
//               // Create distribution array from machine_cost_breakup
//               const newDistribution = breakupEntries.map(([machineType, costInfo]) => {
//                 return {
//                   machine: machineType,
//                   size: costInfo.matched_machine_size || '',
//                   percent: costInfo.input_percentage ?? 0
//                 };
//               });

//               setDistribution(newDistribution);

//               // Store initial machine info for reference
//               const [firstMachine, firstInfo] = breakupEntries[0];
//               setInitialMachineInfo({
//                 machine: firstMachine,
//                 size: firstInfo.matched_machine_size || 'Auto-selected'
//               });
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching machine rates:', error);
//         message.error('Failed to fetch machine rates');
//       }
//     };

//     fetchMachineRates();
//   }, [initialCostData]);

//   // Initialize editable stock dimensions
//   useEffect(() => {
//     if (analysisData?.stock_dimensions) {
//       setEditableStockDimensions({
//         length: analysisData.stock_dimensions.length || null,
//         breadth: analysisData.stock_dimensions.breadth || null,
//         height: analysisData.stock_dimensions.height || null
//       });
//     }
//   }, [analysisData]);

//   const handleStockDimensionChange = (field, value) => {
//     const numValue = parseFloat(value) || null;
//     setEditableStockDimensions(prev => ({
//       ...prev,
//       [field]: numValue
//     }));
//   };

//   // Update stock dimensions with proper cost data update
//   const updateStockDimensions = async () => {
//     if (!historyId) {
//       message.warning('Please calculate cost first before updating stock dimensions');
//       return;
//     }

//     if (!editableStockDimensions.length || !editableStockDimensions.breadth || !editableStockDimensions.height) {
//       message.error('Please enter all stock dimensions');
//       return;
//     }

//     setIsCalculating(true);

//     try {
//       const formData = new FormData();
//       formData.append('history_id', historyId);
//       formData.append('stock_length', editableStockDimensions.length);
//       formData.append('stock_breadth', editableStockDimensions.breadth);
//       formData.append('stock_height', editableStockDimensions.height);

//       const response = await fetch(`http://localhost:5678/Milling_update-stock_cost/`, {
//         method: 'PUT',
//         body: formData
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update stock dimensions');
//       }

//       const result = await response.json();
//       console.log('Stock update response:', result);

//       const normalized = normalizeCostData(result);
//       console.log('Normalized stock update:', normalized);

//       setCostData(normalized);

//       setUpdatedAnalysisData(prev => ({
//         ...prev,
//         stock_dimensions: {
//           ...prev?.stock_dimensions,
//           length: editableStockDimensions.length,
//           breadth: editableStockDimensions.breadth,
//           height: editableStockDimensions.height,
//           volume_mm3: result.stock_volume_mm3
//         }
//       }));

//       message.success('Stock dimensions and costs updated successfully');
//     } catch (error) {
//       console.error('Error updating stock dimensions:', error);
//       message.error('Failed to update stock dimensions');
//     } finally {
//       setIsCalculating(false);
//     }
//   };

//   // CHANGED: Updated calculateCost to call /Milling_update-size-cost-try/ endpoint with size per machine
//   const calculateCost = async () => {
//     if (!analysisData) {
//       message.error('No analysis data available');
//       return;
//     }

//     const total = distribution.reduce((s, d) => s + (Number(d.percent) || 0), 0);
//     if (total <= 0 || total > 100) {
//       message.error('Machine distribution must sum to 1–100%');
//       return;
//     }

//     // Check if all machines with percentage > 0 have a size selected
//     const hasEmptySize = distribution.some(d => d.machine && Number(d.percent) > 0 && !d.size);
//     if (hasEmptySize) {
//       message.error('Please select size for all machines with percentage > 0');
//       return;
//     }

//     setIsCalculating(true);

//     try {
//       // Build machine distribution object with size for each machine
//       const dist = {};
//       distribution.forEach(d => {
//         if (d.machine && Number(d.percent) > 0) {
//           dist[d.machine] = {
//             size: d.size,
//             percentage: Number(d.percent)
//           };
//         }
//       });

//       console.log('Sending machine distribution:', dist);

//       const payload = {
//         history_id: analysisData.id,
//         machine_distribution: dist
//       };

//       // CHANGED: Now passing size for each machine in the distribution object
//       const response = await fetch(`http://localhost:5678/Milling_update-size-cost-try/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });

//       if (!response.ok) throw new Error('Failed to calculate cost');

//       const result = await response.json();
//       const normalized = normalizeCostData(result);
//       console.log('Calculate cost normalized:', normalized);
//       setCostData(normalized);
//       setHistoryId(analysisData.id);
//       localStorage.setItem('currentCalculationId', analysisData.id);
//       if (onCostCalculationComplete) onCostCalculationComplete(analysisData.id);

//       // Update distribution with matched machine sizes from response
//       if (result.machine_cost_breakup) {
//         const updatedDistribution = distribution.map(row => {
//           const breakupInfo = result.machine_cost_breakup[row.machine];
//           if (breakupInfo && breakupInfo.matched_machine_size) {
//             return {
//               ...row,
//               size: breakupInfo.matched_machine_size
//             };
//           }
//           return row;
//         });
//         setDistribution(updatedDistribution);
//       }

//       message.success('Cost calculated successfully');
//     } catch (error) {
//       console.error('Error calculating cost:', error);
//       message.error('Failed to calculate cost');
//     } finally {
//       setIsCalculating(false);
//     }
//   };

//   // MODIFIED: Add new empty row instead of resetting all rows
//   const addDistributionRow = () => {
//     // Add a new empty row to the existing distribution
//     setDistribution(prev => [
//       ...prev,
//       { machine: '3 Axis', size: '', percent: 0 }
//     ]);
//   };

//   const updateDistributionRow = (index, key, value) => {
//     setDistribution(prev => prev.map((row, i) => {
//       if (i === index) {
//         const updatedRow = { ...row, [key]: value };
//         if (key === 'machine') {
//           updatedRow.size = '';
//         }
//         return updatedRow;
//       }
//       return row;
//     }));
//   };

//   const removeDistributionRow = (index) => {
//     if (distribution.length === 1) return;
//     setDistribution(prev => prev.filter((_, i) => i !== index));
//   };

//   const recalculateCost = async () => {
//     if (!historyId) {
//       message.error('No calculation history available');
//       return;
//     }

//     const total = distribution.reduce((s, d) => s + (Number(d.percent) || 0), 0);
//     if (total <= 0 || total > 100) {
//       message.error('Machine distribution must sum to 1–100%');
//       return;
//     }

//     const hasEmptySize = distribution.some(d => d.machine && Number(d.percent) > 0 && !d.size);
//     if (hasEmptySize) {
//       message.error('Please select size for all machines');
//       return;
//     }

//     setIsCalculating(true);
//     try {
//       // Build machine distribution object with size for each machine
//       const dist = {};
//       distribution.forEach(d => {
//         if (d.machine && Number(d.percent) > 0) {
//           dist[d.machine] = {
//             size: d.size,
//             percentage: Number(d.percent)
//           };
//         }
//       });

//       console.log('Recalculating with distribution:', dist);

//       const response = await fetch(`http://localhost:5678/Milling_update-size-cost-try/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           history_id: historyId, 
//           machine_distribution: dist 
//         })
//       });

//       if (!response.ok) throw new Error('Failed to recalculate cost');

//       const result = await response.json();
//       console.log('Recalculate response:', result);

//       const normalized = normalizeCostData(result);
//       console.log('Normalized recalculate data:', normalized);

//       setCostData(normalized);

//       message.success('Cost recalculated successfully based on selected size');
//     } catch (error) {
//       console.error('Error recalculating cost:', error);
//       message.error('Failed to recalculate cost: ' + error.message);
//     } finally {
//       setIsCalculating(false);
//     }
//   };

//   const updateMaterialCost = async () => {
//     if (!costData?.id) {
//       return;
//     }

//     setIsCalculating(true);

//     try {
//       const response = await fetch(`http://localhost:5678/update-material-cost/${costData.id}`, {
//         method: 'PUT',
//         headers: {
//           'accept': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update material cost');
//       }

//       const result = await response.json();
//       setCostData(prev => ({
//         ...prev,
//         total_cost: result.total_cost_without_material || prev.total_cost,
//         with_material_cost: result.with_material_cost || prev.with_material_cost,
//         material_cost: result.material_cost || prev.material_cost,
//         material_cost_per_unit: result.material_cost_per_unit || prev.material_cost_per_unit,
//         material_cost_per_kg: result.material_cost_per_kg || prev.material_cost_per_kg,
//         material_name: result.material_name || prev.material_name,
//         stock_mass_kg: result.stock_mass_kg || prev.stock_mass_kg,
//         finished_product_weight: result.finished_product_weight || prev.finished_product_weight,
//         final_unit_cost: result.final_unit_cost || prev.final_unit_cost,
//         stock_mass: result.stock_mass || prev.stock_mass
//       }));
//       message.success('Material cost updated successfully');
//     } catch (error) {
//       console.error('Error updating material cost:', error);
//       message.error('Failed to update material cost');
//     } finally {
//       setIsCalculating(false);
//     }
//   };

//   const updateQuantity = async (newQuantity) => {
//     if (!historyId) {
//       message.error('No calculation history available');
//       return;
//     }

//     setIsCalculating(true);

//     try {
//       const response = await fetch(`http://localhost:5678/milling/update-quantity/${historyId}?quantity=${newQuantity}`, {
//         method: 'PUT',
//         headers: {
//           'accept': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update quantity');
//       }

//       const result = await response.json();
//       setCostData(prev => ({
//         ...prev,
//         total_cost: result.manufacturing_cost_without_materialcost || prev.total_cost,
//         with_material_cost: result.manufacturing_cost_with_material_cost || prev.with_material_cost,
//         material_cost_per_unit: result.material_cost_perunit || prev.material_cost_per_unit,
//         material_cost: result.total_material_cost || prev.material_cost,
//         manufacturing_cost_perunit: result.manufacturing_cost_perunit || prev.manufacturing_cost_perunit
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
//     if (historyId) {
//       updateQuantity(newQuantity);
//     }
//   };

//   const formatCurrency = (value) => {
//     if (value === null || value === undefined) return 'N/A';
//     const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
//     return `Rs.${numValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//   };


//   // COMPLETE captureIsometricView Function for CostReport Component
// // Add this function inside the CostReport component

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
//           window.removeEventListener('isometricCaptureComplete', handleIsometricCapture);

//           console.log('Isometric capture received successfully');
//           resolve(dataUrl);
//         }
//       };

//       // Listen for the capture completion event from ViewerPage
//       window.addEventListener('isometricCaptureComplete', handleIsometricCapture);

//       // Send request to ViewerPage to capture isometric view
//       const captureEvent = new CustomEvent('requestIsometricCapture', {
//         detail: {
//           timestamp: Date.now()
//         }
//       });

//       window.dispatchEvent(captureEvent);
//       console.log('Isometric capture request sent to ViewerPage');

//       // Timeout fallback (5 seconds)
//       const timeoutId = setTimeout(() => {
//         if (!callbackExecuted) {
//           callbackExecuted = true;
//           window.removeEventListener('isometricCaptureComplete', handleIsometricCapture);
//           console.warn('Isometric capture timeout after 5 seconds, returning null');
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

//   const handleDownloadPDF = async () => {
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

//       pdf.setFont('georgia', 'normal');

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

//       // const modelScreenshot = await capture3DModelScreenshot();  //''''this line befor iso capturing 
//       const modelScreenshot = await captureIsometricView();//''''this line captureIsometricView function to capture the ISO view of 3d display

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

//       const currentAnalysis = updatedAnalysisData || analysisData;

//       if (currentAnalysis) {
//         tableData.push(['', '']);
//         tableData.push(['MODULE: Machining Module (Milling Process)', '']);

//         tableData.push(['MATERIAL DATA', '']);
//         tableData.push(['Material', safeString(costData?.material || currentAnalysis.material_name || 'N/A')]);
//         tableData.push(['Density', currentAnalysis.density ? `${safeString(currentAnalysis.density)} kg/m³` : 'N/A']);

//         if (currentAnalysis.actual_dimensions) {
//           tableData.push(['', '']);
//           tableData.push(['FINAL COMPONENT ACTUAL DIMENSIONS', '']);
//           tableData.push(['Volume (mm³)', safeString(currentAnalysis.actual_dimensions.volume_mm3 || 'N/A')]);
//           tableData.push(['Mass', costData?.finished_product_weight ? `${costData.finished_product_weight} kg` : 'N/A']);
//         }

//         if (currentAnalysis.actual_dimensions) {
//           tableData.push(['', '']);
//           tableData.push(['BOUNDING BOX DIMENSIONS', '']);

//           const length = currentAnalysis.actual_dimensions.length || 'N/A';
//           const breadth = currentAnalysis.actual_dimensions.breadth || 'N/A';
//           const height = currentAnalysis.actual_dimensions.height || 'N/A';
//           const dimensionsFormat = `${length} mm × ${breadth} mm × ${height} mm`;

//           tableData.push(['Length × Breadth × Height', dimensionsFormat]);
//         }

//         if (currentAnalysis.stock_dimensions) {
//           tableData.push(['', '']);
//           tableData.push(['STOCK DIMENSIONS', '']);
//           tableData.push(['Volume (mm³)', safeString(currentAnalysis.stock_dimensions.volume_mm3 || 'N/A')]);
//           tableData.push(['Mass', costData?.stock_mass ? `${costData.stock_mass} kg` : 'N/A']);

//           tableData.push(['', '']);
//           tableData.push(['RECOMMENDED BOUNDING BOX DIMENSIONS', '']);

//           const stockLength = editableStockDimensions.length || currentAnalysis.stock_dimensions.length || 'N/A';
//           const stockBreadth = editableStockDimensions.breadth || currentAnalysis.stock_dimensions.breadth || 'N/A';
//           const stockHeight = editableStockDimensions.height || currentAnalysis.stock_dimensions.height || 'N/A';
//           const stockDimensionsFormat = `${stockLength} mm × ${stockBreadth} mm × ${stockHeight} mm`;

//           tableData.push(['Length × Breadth × Height', stockDimensionsFormat]);
//         }
//       }

//       // tableData.push(['', '']);
//       // tableData.push(['MANUFACTURING SETTINGS', '']);
//       // const distStr = distribution.map(d => `${d.machine} (${d.size || 'N/A'}) ${d.percent}%`).join(', ');
//       // tableData.push(['Machine Distribution', safeString(distStr || '3 Axis 70%, 4 Axis 20%, 5 Axis 10%')]);
//       // tableData.push(['Quantity', safeString(quantity)]);
//       tableData.push(['', '']);
// tableData.push(['MANUFACTURING SETTINGS', '']);
// // Split each machine into separate rows to prevent overflow
// distribution.forEach((d, idx) => {
//   const machineStr = `${d.machine} (${d.size || 'N/A'}) - ${d.percent}%`;
//   tableData.push([idx === 0 ? 'Machine Distribution' : '', safeString(machineStr)]);
// });
// tableData.push(['Quantity', safeString(quantity)]);

//       if (costData) {
//         tableData.push(['', '']);
//         tableData.push(['COST SUMMARY', '']);
//         if (costData.material_cost_per_kg) {
//           tableData.push(['Material Cost per kg', formatCurrencyForPDF(costData.material_cost_per_kg)]);
//         }
//         if (costData.material_cost_per_unit) {
//           tableData.push(['Material Cost Per Unit', formatCurrencyForPDF(costData.material_cost_per_unit)]);
//         }
//         tableData.push(['Machining Cost Per Unit', formatCurrencyForPDF(costData.cost_per_unit)]);
//         if (costData.material_cost) {
//           tableData.push(['Total Material Cost For Given Quantity', formatCurrencyForPDF(costData.material_cost)]);
//         }
//         if (costData.total_cost) {
//           tableData.push(['Total Machining Cost For Given Quantity', formatCurrencyForPDF(costData.total_cost)]);
//         }
//         if (costData.with_material_cost) {
//           tableData.push(['OverAll Total Cost (Machining+Material cost)', formatCurrencyForPDF(costData.with_material_cost)]);
//         }
//       }

//       const startY = yPosition;
//       const rowHeight = 5;
//       const col1Width = contentWidth * 0.6;

//       let currentY = startY;

//       tableData.forEach((row) => {
//         const [label, value] = row;

//         const isSectionHeader = label && !value && (label.includes('DIMENSIONS') || label.includes('SETTINGS') || label.includes('SUMMARY') || label.includes('EXTRA') || label.includes('MATERIAL DATA') || label.includes('MODULE:'));
//         const isEmptyRow = !label && !value;

//         if (isEmptyRow) {
//           currentY += rowHeight / 2;
//           return;
//         }

//         const getBackgroundColor = (label) => {
//           if (isSectionHeader) {
//             return [41, 128, 185];
//           }
//           if (label.includes('Volume') || label.includes('Length') || label.includes('Breadth') || label.includes('Height') || label.includes('Dimensions')) {
//             return [217, 237, 247];
//           }
//           if (label.includes('Machine') || label.includes('Quantity') || label.includes('Distribution')) {
//             return [236, 236, 236];
//           }
//           if (label.includes('Cost') || label.includes('Mass') || label.includes('Material')) {
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

//           const isCostSummaryRow = (label.includes('Cost') || label.includes('Machining')) && label !== 'MATERIAL DATA' && label !== 'Material';

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
//           const filename = `Cost_Report_${analysisData?.filename?.replace(/\.[^/.]+$/, '') || 'Model'}_${new Date().getTime()}.pdf`;
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

//   const currentAnalysis = updatedAnalysisData || analysisData;

//   return (
//     <Card 
//       title={
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <span style={{ color: theme.primary, fontSize: '18px', fontWeight: 600 }}>
//             Manufacturing Cost Report
//           </span>
//           <div ref={pdfRef}>
//             <Button 
//               type="primary" 
//               onClick={handleDownloadPDF}
//               style={{ borderRadius: '6px', height: '40px', fontWeight: 500, backgroundColor:'#246679'}}
//             >
//               Download PDF Report
//             </Button>
//           </div>
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
//         overflow: 'auto'
//       }}
//     >
//       <div style={{ overflow: 'auto', height: '100%' }}>
//         {currentAnalysis ? (
//           <>
//             <Row gutter={[24, 0]} style={{ marginBottom: '24px' }}>
//               <Col span={12}>
//                 <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
//                   File Information
//                 </Title>
//                 <div style={{ marginBottom: '12px' }}>
//                   <Text style={{ color: theme.textSecondary }}>Filename:</Text>
//                   <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
//                     {costData?.filename || currentAnalysis.filename || 'N/A'}
//                   </div>
//                 </div>
//               </Col>
//               <Col span={12}>
//                 <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
//                   Material Information
//                 </Title>
//                 <Row gutter={[16, 16]}>
//                   <Col span={12}>
//                     <div style={{ marginBottom: '12px' }}>
//                       <Text style={{ color: theme.textSecondary }}>Material:</Text>
//                       <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
//                         {costData?.material || currentAnalysis.material_name || 'N/A'}
//                       </div>
//                     </div>
//                   </Col>
//                   <Col span={12}>
//                     <div style={{ marginBottom: '12px' }}>
//                       <Text style={{ color: theme.textSecondary }}>Density:</Text>
//                       <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
//                         {currentAnalysis.density ? `${currentAnalysis.density} kg/m³` : 'N/A'}
//                       </div>
//                     </div>
//                   </Col>
//                 </Row>
//               </Col>
//             </Row>

//             <div style={{ marginBottom: '24px' }}>
//               <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
//                 Model Dimensions
//               </Title>

//               <Row gutter={[16, 16]}>
//                 <Col span={12}>
//                   <div style={{
//                     background: '#f0f9ff',
//                     padding: '16px',
//                     borderRadius: '8px',
//                     borderLeft: `4px solid ${theme.primary}`,
//                     height: '100%'
//                   }}>




//                     <h4 style={{ 
//                       color: theme.primary, 
//                       fontWeight: 600, 
//                       marginBottom: '12px',
//                       fontSize: '13px'
//                     }}>
//                       BOUNDING BOX DIMENSIONS
//                     </h4>

//                     <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
//                       <div style={{ flex: 1 }}>
//                         <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Length:</span>
//                         <div style={{ fontWeight: 500, color: theme.textPrimary }}>
//                           {currentAnalysis.actual_dimensions?.length ? `${currentAnalysis.actual_dimensions.length} mm` : 'N/A'}
//                         </div>
//                       </div>
//                       <div style={{ flex: 1 }}>
//                         <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Breadth:</span>
//                         <div style={{ fontWeight: 500, color: theme.textPrimary }}>
//                           {currentAnalysis.actual_dimensions?.breadth ? `${currentAnalysis.actual_dimensions.breadth} mm` : 'N/A'}
//                         </div>
//                       </div>
//                       <div style={{ flex: 1 }}>
//                         <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Thickness:</span>
//                         <div style={{ fontWeight: 500, color: theme.textPrimary }}>
//                           {currentAnalysis.actual_dimensions?.height ? `${currentAnalysis.actual_dimensions.height} mm` : 'N/A'}
//                         </div>
//                       </div>
//                     </div>
//                          <h3 style={{ 
//                       color: theme.primary, 
//                       fontWeight: 600, 
//                       marginBottom: '12px',
//                       fontSize: '14px',
//                       marginTop: '18px'

//                     }}>
//                       FINAL COMPONENT ACTUAL DIMENSIONS
//                     </h3>
//                     <Row gutter={[16, 0]} style={{ marginBottom: '16px' }}>
//                       <Col span={12}>
//                         <span style={{ color: theme.textSecondary }}>Volume (mm³):</span>
//                         <div style={{ 
//                           fontWeight: 600, 
//                           fontSize: '16px',
//                           color: theme.textPrimary,
//                           marginTop: '4px'
//                         }}>
//                           {currentAnalysis.actual_dimensions?.volume_mm3 || 'N/A'}
//                         </div>
//                       </Col>
//                       <Col span={12}>
//                         <span style={{ color: theme.textSecondary }}>Mass:</span>
//                         <div style={{ 
//                           fontWeight: 600, 
//                           fontSize: '16px',
//                           color: theme.textPrimary,
//                           marginTop: '4px'
//                         }}>
//                           {costData?.finished_product_weight ? `${costData.finished_product_weight} kg` : 'N/A'}
//                         </div>
//                       </Col>
//                     </Row>
//                   </div>
//                 </Col>

//                 <Col span={12}>
//                   <div style={{ 
//                     background: '#f6ffed',
//                     padding: '16px',
//                     borderRadius: '8px',
//                     borderLeft: `4px solid ${theme.success}`,
//                     height: '100%'
//                   }}>

//                     <Text strong style={{ 
//                       color: theme.success,
//                       fontSize: '13px',
//                       marginBottom: '12px',
//                       display: 'block',
//                       fontWeight: 600
//                     }}>
//                       RECOMMENDED STOCK DIMENSIONS
//                     </Text>

//                     <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
//                       <div style={{ flex: 1 }}>
//                         <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Length:</span>
//                         <Input
//                           type="number"
//                           value={editableStockDimensions.length}
//                           onChange={(e) => handleStockDimensionChange('length', e.target.value)}
//                           placeholder="Length"
//                           size="small"
//                           style={{ 
//                             marginTop: '2px',
//                             fontSize: '12px'
//                           }}
//                           suffix="mm"
//                         />
//                       </div>
//                       <div style={{ flex: 1 }}>
//                         <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Breadth:</span>
//                         <Input
//                           type="number"
//                           value={editableStockDimensions.breadth}
//                           onChange={(e) => handleStockDimensionChange('breadth', e.target.value)}
//                           placeholder="Breadth"
//                           size="small"
//                           style={{ 
//                             marginTop: '2px',
//                             fontSize: '12px'
//                           }}
//                           suffix="mm"
//                         />
//                       </div>
//                       <div style={{ flex: 1 }}>
//                         <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Thickness:</span>
//                         <Input
//                           type="number"
//                           value={editableStockDimensions.height}
//                           onChange={(e) => handleStockDimensionChange('height', e.target.value)}
//                           placeholder="Height"
//                           size="small"
//                           style={{ 
//                             marginTop: '2px',
//                             fontSize: '12px'
//                           }}
//                           suffix="mm"
//                         />
//                       </div>
//                     </div>

//                     <div style={{ textAlign: 'center', marginTop: '8px' }}>
//                       <Button
//                         type="primary"
//                         size="small"
//                         onClick={updateStockDimensions}
//                         loading={isCalculating}
//                         style={{
//                           backgroundColor: theme.success,
//                           borderColor: theme.success,
//                           fontSize: '12px',
//                           height: '28px',
//                           marginBottom: '10px'
//                         }}
//                       >
//                         Update Dimensions
//                       </Button>
//                     <div style={{ textAlign: 'left', marginBottom: '12px' }}>
//     <Text
//       strong
//       style={{
//         color: theme.success,
//         fontSize: '14px',
//         fontWeight: 600,
//       }}
//     >
//       STOCK DIMENSIONS
//     </Text>

//     <Row gutter={[16, 0]} style={{ marginBottom: '16px' }}>
//                       <Col span={12}>
//                         <Text style={{ color: theme.textSecondary }}>Volume (mm³):</Text>
//                         <div style={{ 
//                           fontWeight: 600, 
//                           fontSize: '16px',
//                           color: theme.textPrimary,
//                           marginTop: '4px'
//                         }}>
//                           {currentAnalysis.stock_dimensions?.volume_mm3 || 'N/A'}
//                         </div>
//                       </Col>
//                       <Col span={12}>
//                         <Text style={{ color: theme.textSecondary }}>Mass:</Text>
//                         <div style={{ 
//                           fontWeight: 600, 
//                           fontSize: '16px',
//                           color: theme.textPrimary,
//                           marginTop: '4px'
//                         }}>
//                           {costData?.stock_mass ? `${costData.stock_mass} kg` : 'N/A'}
//                         </div>
//                       </Col>
//                     </Row>
//   </div>



//                     </div>



//                   </div>
//                 </Col>
//               </Row>
//             </div>

//             <div style={{ marginBottom: '24px' }}>
//               <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
//                 Manufacturing Operations
//               </Title>

//               <Row gutter={[16, 16]}>
//                 <Col span={16}>
//                   {distribution.map((row, index) => (
//                     <Row key={index} gutter={[8, 8]} style={{ marginBottom: '8px' }}>
//                       <Col span={6}>
//                         <Select
//                           value={row.machine}
//                           onChange={(val) => updateDistributionRow(index, 'machine', val)}
//                           style={{ width: '100%' }}
//                         >
//                           {machineTypes.map(type => (
//                             <Option key={type} value={type}>{type}</Option>
//                           ))}
//                         </Select>
//                       </Col>
//                       <Col span={6}>
//                         <Select
//                           value={row.size}
//                           onChange={(val) => updateDistributionRow(index, 'size', val)}
//                           style={{ width: '100%' }}
//                           placeholder="Select Size"
//                         >
//                           {(availableSizes[row.machine] || []).map(size => (
//                             <Option key={size} value={size}>{size}</Option>
//                           ))}
//                         </Select>
//                       </Col>
//                       <Col span={6}>
//                         <Input
//                           type="number"
//                           min={0}
//                           max={100}
//                           value={row.percent}
//                           onChange={(e) => updateDistributionRow(index, 'percent', e.target.value)}
//                           suffix="%"
//                         />
//                       </Col>
//                       <Col span={6}>
//                         <Button danger onClick={() => removeDistributionRow(index)} disabled={distribution.length === 1}>Remove</Button>
//                       </Col>
//                     </Row>
//                   ))}
//                   <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
//                     <Button onClick={addDistributionRow}>Add Operation</Button>
//                     <Button type="primary" onClick={calculateCost} loading={isCalculating}>
//                       Get Cost
//                     </Button>
//                   </div>
//                 </Col>
//                 <Col span={8}>
//   <div style={{ marginBottom: '12px' }}>
//     <Text
//       strong
//       style={{
//         color: theme.primary,       // same color as "Manufacturing Operations"
//         fontSize: '14px',           // same font size
//         fontWeight: 600,            // bold like heading
//         display: 'block',
//         marginBottom: '6px',
//         textAlign: 'left',          // move text left
//       }}
//     >
//       Quantity:
//     </Text>

//     <Input
//       type="number"
//       value={quantity}
//       onChange={handleQuantityChange}
//       style={{
//         fontSize: '14px',           // increased font size
//         borderRadius: '6px',
//         width: '60%',               // reduced width so it aligns better
//         marginRight: '0',
//       }}
//       min={1}
//     />
//   </div>
// </Col>

//               </Row>
//             </div>

//             <div>
//               <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
//                 Cost Summary
//               </Title>

//               {isCalculating ? (
//                 <div style={{ textAlign: 'center', padding: '40px 0', color: theme.textSecondary }}>
//                   <div style={{
//                     border: `4px solid ${theme.primary}33`,
//                     borderTop: `4px solid ${theme.primary}`,
//                     borderRadius: '50%',
//                     width: '40px',
//                     height: '40px',
//                     animation: 'spin 1s linear infinite',
//                     margin: '0 auto 16px'
//                   }} />
//                   <Text style={{ color: theme.primary, fontSize: '16px' }}>
//                     Calculating cost...
//                   </Text>
//                 </div>
//               ) : costData ? (
//                 <>
//                   <Row gutter={[16, 16]}>
//                     <Col span={12}>
//                       <div style={{
//                         padding: '12px',
//                         background: `${theme.lightBlue}66`,
//                         borderRadius: '8px',
//                         border: `1px solid ${theme.primary}22`
//                       }}>
//                         <Statistic 
//                           title={<span style={{ color: theme.textSecondary }}>Manufaturing Cost Per Unit</span>} 
//                           value={formatCurrency(costData.cost_per_unit)} 
//                           valueStyle={{ color: theme.primary, fontWeight: 600, fontSize: '18px' }}
//                         />
//                       </div>
//                     </Col>
//                     <Col span={12}>
//                       <div style={{
//                         padding: '12px',
//                         background: `${theme.lightBlue}66`,
//                         borderRadius: '8px',
//                         border: `1px solid ${theme.primary}22`
//                       }}>
//                         <Statistic 
//                           title={<span style={{ color: theme.textSecondary }}>Total Manufaturing Cost</span>} 
//                           value={formatCurrency(costData.total_cost)} 
//                           valueStyle={{ color: theme.primary, fontWeight: 600, fontSize: '18px' }}
//                         />
//                       </div>
//                     </Col>
//                   </Row>

//                   <div style={{ marginTop: '20px', marginBottom: '16px' }}>
//                     <Checkbox 
//                       checked={showMaterialCost}
//                       onChange={(e) => {
//                         setShowMaterialCost(e.target.checked);
//                         if (e.target.checked) {
//                           updateMaterialCost();
//                         }
//                       }}
//                       style={{ 
//                         fontSize: '14px',
//                         color: theme.textPrimary,
//                         fontWeight: 500
//                       }}
//                     >
//                       Include Material Cost
//                     </Checkbox>
//                   </div>

//                   {showMaterialCost && (
//                     <>
//                       <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
//                         {costData.material_cost_per_unit && (
//                           <Col span={12}>
//                             <div style={{
//                               padding: '12px',
//                               background: '#fff2e666',
//                               borderRadius: '8px',
//                               border: `1px solid #fa8c1622`
//                             }}>
//                               <Statistic 
//                                 title={<span style={{ color: theme.textSecondary }}>Material Cost Per Unit</span>} 
//                                 value={formatCurrency(costData.material_cost_per_unit)} 
//                                 valueStyle={{ color: '#fa8c16', fontWeight: 600, fontSize: '16px' }}
//                               />
//                             </div>
//                           </Col>
//                         )}
//                         {costData.material_cost && (
//                           <Col span={12}>
//                             <div style={{
//                               padding: '12px',
//                               background: '#fff2e666',
//                               borderRadius: '8px',
//                               border: `1px solid #fa8c1622`
//                             }}>
//                               <Statistic 
//                                 title={<span style={{ color: theme.textSecondary }}>Total Material Cost</span>} 
//                                 value={formatCurrency(costData.material_cost)} 
//                                 valueStyle={{ color: '#fa8c16', fontWeight: 600, fontSize: '16px' }}
//                               />
//                             </div>
//                           </Col>
//                         )}
//                       </Row>

//                       {(costData.final_unit_cost || costData.with_material_cost) && (
//                         <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
//                           {costData.final_unit_cost && (
//                             <Col span={12}>
//                               <div style={{
//                                 padding: '16px',
//                                 background: '#f0f9ff66',
//                                 borderRadius: '8px',
//                                 border: `1px solid ${theme.primary}22`,
//                                 textAlign: 'center'
//                               }}>
//                                 <Statistic 
//                                   title={<span style={{ color: theme.textSecondary, fontSize: '16px' }}>Total Machining cost perunit with Material cost</span>} 
//                                   value={formatCurrency(costData.final_unit_cost)} 
//                                   valueStyle={{ color: theme.primary, fontWeight: 700, fontSize: '20px' }}
//                                 />
//                               </div>
//                             </Col>
//                           )}
//                           {/* {costData.total_cost_per_unit_with_materials && (
//                          <Col span={12}>
//                           <div style={{
//                           padding: '16px',
//                           background: '#e6f7ff66',
//                           borderRadius: '8px',
//                           border: `1px solid ${theme.primary}22`,
//                           textAlign: 'center'
//                          }}>
//                           <Statistic 
//                           title={<span style={{ color: theme.textSecondary, fontSize: '16px' }}>Total Cost Per Unit (Including Material)</span>} 
//                           value={formatCurrency(costData.total_cost_per_unit_with_materials)} 
//                           valueStyle={{ color: theme.primary, fontWeight: 700, fontSize: '20px' }}
//                           />
//                          </div>
//                           </Col>
//                           )} */}


//                                {costData.total_cost_per_unit_with_materials && (
//                          <Col span={12}>
//                           <div style={{
//                           padding: '16px',
//                           background: '#e6f7ff66',
//                           borderRadius: '8px',
//                           border: `1px solid ${theme.primary}22`,
//                           textAlign: 'center'
//                          }}>
//                           <Statistic 
//                           title={<span style={{ color: theme.textSecondary, fontSize: '16px' }}>Total Cost Per Unit (Including Material)</span>} 
//                           value={formatCurrency(costData.total_cost_per_unit_with_materials)} 
//                           valueStyle={{ color: theme.primary, fontWeight: 700, fontSize: '20px' }}
//                           />
//                          </div>
//                           </Col>
//                           )}

//                                    {costData.with_material_cost && (
//                             <Col span={12}>
//                               <div style={{
//                                 padding: '16px',
//                                 background: '#e6f7ff66',
//                                 borderRadius: '8px',
//                                 border: `1px solid ${theme.primary}22`,
//                                 textAlign: 'center'
//                               }}>
//                                 <Statistic 
//                                   title={<span style={{ color: theme.textSecondary, fontSize: '16px' }}>Total Cost (Including Material Cost)</span>} 
//                                   value={formatCurrency(costData.with_material_cost)} 
//                                   valueStyle={{ color: theme.primary, fontWeight: 700, fontSize: '20px' }}
//                                 />
//                               </div>
//                             </Col>
//                           )}

//                           {/* {costData.total_cost && (
//                             <Col span={12}>
//                               <div style={{
//                                 padding: '16px',
//                                 background: '#e6f7ff66',
//                                 borderRadius: '8px',
//                                 border: `1px solid ${theme.primary}22`,
//                                 textAlign: 'center'
//                               }}>
//                                 <Statistic 
//                                   title={<span style={{ color: theme.textSecondary, fontSize: '16px' }}>Total Cost (Excluding Material Cost)</span>} 
//                                   value={formatCurrency(costData.total_cost)} 
//                                   valueStyle={{ color: theme.primary, fontWeight: 700, fontSize: '20px' }}
//                                 />
//                               </div>
//                             </Col>
//                           )} */}

//                         </Row>
//                       )}
//                     </>
//                   )}
//                 </>
//               ) : (
//                 <div style={{ textAlign: 'center', padding: '40px 0', color: theme.textSecondary }}>
//                   <Text style={{ color: theme.textSecondary, fontSize: '16px' }}>
//                     No cost data available. Click "Get Cost" to calculate.
//                   </Text>
//                 </div>
//               )}
//             </div>
//           </>
//         ) : (
//           <div style={{ textAlign: 'center', padding: '40px 0', color: theme.textSecondary }}>
//             <Text style={{ color: theme.textSecondary, fontSize: '16px' }}>
//               No analysis data available
//             </Text>
//           </div>
//         )}
//       </div>
//     </Card>
//   );
// };

// export default CostReport;





//'''''gokul updated code to display size fecthed from response when update dismation button clicked from that response showing list of size''''//

import React, { useState, useRef, useEffect } from 'react';
import { Card, Typography, Row, Col, Statistic, Button, Input, Select, message, Modal, Checkbox } from 'antd';
import jsPDF from 'jspdf';

const { Title, Text } = Typography;
const { Option } = Select;

const CostReport = ({ analysisData, theme, objUrl, onCostCalculationComplete, initialCostData }) => {
  const [quantity, setQuantity] = useState(1);
  const [machineRates, setMachineRates] = useState([]);
  const [distribution, setDistribution] = useState([
    { machine: '3 Axis', size: '', percent: 70 },
    { machine: '4 Axis', size: '', percent: 0 },
    { machine: '5 Axis', size: '', percent: 30 }
  ]);
  const [availableSizes, setAvailableSizes] = useState({});
  const [initialMachineInfo, setInitialMachineInfo] = useState(null);
  const [costData, setCostData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showMaterialCost, setShowMaterialCost] = useState(false);
  const [historyId, setHistoryId] = useState(null);
  const [updatedAnalysisData, setUpdatedAnalysisData] = useState(null);

  const [editableStockDimensions, setEditableStockDimensions] = useState({
    length: null,
    breadth: null,
    height: null
  });

  const pdfRef = useRef();

  const machineTypes = ['3 Axis', '4 Axis', '5 Axis'];

  const normalizeCostData = (data) => {
    if (!data || typeof data !== 'object') return data;

    console.log('Normalizing cost data:', data);

    return {
      ...data,
      stock_mass: data.stock_weight_kg ?? data.stock_mass,
      finished_product_weight: data.actual_weight ?? data.Actual_weight ?? data.finished_product_weight,
      cost_per_unit: data.manufacturing_cost_perunit ?? data.cost_per_unit,
      material_cost_per_unit: data.material_cost_perunit ?? data.Material_cost_perunit ?? data.material_cost_per_unit,
      total_cost: data.manufacturing_cost_without_materialcost ?? data.Manufacturing_cost_without_materialcost ?? data.total_cost,
      total_cost_per_unit_with_materials: data.total_cost_per_unit_with_materials,
      with_material_cost: data.manufacturing_cost_with_material_cost ?? data.Manufacturing_cost_with_material_cost ?? data.Manufacuring_cost_with_material_cost ?? data.with_material_cost,
      material_cost: data.Total_material_cost ?? data.material_cost,
      final_unit_cost: data.final_unit_cost,
      machine_cost_breakup: data.machine_cost_breakup,
      material: data.material_name ?? data.material,
      filename: data.filename ?? data.filename,
      stock_volume_mm3: data.stock_volume_mm3
    };
  };

  useEffect(() => {
    if (analysisData && initialCostData) {
      const normalized = normalizeCostData(initialCostData);
      console.log('Setting initial cost data:', normalized);
      setCostData(normalized);
      setHistoryId(analysisData.id);
      setUpdatedAnalysisData(analysisData);
    }
  }, [analysisData, initialCostData]);

  useEffect(() => {
    const fetchMachineRates = async () => {
      try {
        const response = await fetch('http://localhost:5678/Milling_getmachine-rates/');
        if (response.ok) {
          const data = await response.json();
          setMachineRates(data);

          const sizesMap = {};
          data.forEach(rate => {
            if (!sizesMap[rate.machine_type]) {
              sizesMap[rate.machine_type] = [];
            }
            if (!sizesMap[rate.machine_type].includes(rate.size)) {
              sizesMap[rate.machine_type].push(rate.size);
            }
          });
          setAvailableSizes(sizesMap);

          if (initialCostData?.machine_cost_breakup) {
            const breakupEntries = Object.entries(initialCostData.machine_cost_breakup);

            if (breakupEntries.length > 0) {
              const newDistribution = breakupEntries.map(([machineType, costInfo]) => {
                return {
                  machine: machineType,
                  size: costInfo.matched_machine_size || '',
                  percent: costInfo.input_percentage ?? 0
                };
              });

              setDistribution(newDistribution);

              const [firstMachine, firstInfo] = breakupEntries[0];
              setInitialMachineInfo({
                machine: firstMachine,
                size: firstInfo.matched_machine_size || 'Auto-selected'
              });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching machine rates:', error);
        message.error('Failed to fetch machine rates');
      }
    };

    fetchMachineRates();
  }, [initialCostData]);

  useEffect(() => {
    if (analysisData?.stock_dimensions) {
      setEditableStockDimensions({
        length: analysisData.stock_dimensions.length || null,
        breadth: analysisData.stock_dimensions.breadth || null,
        height: analysisData.stock_dimensions.height || null
      });
    }
  }, [analysisData]);

  const handleStockDimensionChange = (field, value) => {
    const numValue = parseFloat(value) || null;
    setEditableStockDimensions(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const updateStockDimensions = async () => {
    if (!historyId) {
      message.warning('Please calculate cost first before updating stock dimensions');
      return;
    }

    if (!editableStockDimensions.length || !editableStockDimensions.breadth || !editableStockDimensions.height) {
      message.error('Please enter all stock dimensions');
      return;
    }

    setIsCalculating(true);

    try {
      const formData = new FormData();
      formData.append('history_id', historyId);
      formData.append('stock_length', editableStockDimensions.length);
      formData.append('stock_breadth', editableStockDimensions.breadth);
      formData.append('stock_height', editableStockDimensions.height);

      const response = await fetch(`http://localhost:5678/Milling_update-stock_cost/`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to update stock dimensions');
      }

      const result = await response.json();
      console.log('Stock update response:', result);

      const normalized = normalizeCostData(result);
      console.log('Normalized stock update:', normalized);

      setCostData(normalized);

      setUpdatedAnalysisData(prev => ({
        ...prev,
        stock_dimensions: {
          ...prev?.stock_dimensions,
          length: editableStockDimensions.length,
          breadth: editableStockDimensions.breadth,
          height: editableStockDimensions.height,
          volume_mm3: result.stock_volume_mm3
        }
      }));

      // UPDATE distribution with machine sizes from response
      if (result.machine_cost_breakup) {
        const updatedDistribution = distribution.map(row => {
          const breakupInfo = result.machine_cost_breakup[row.machine];
          if (breakupInfo && breakupInfo.matched_machine_size) {
            return {
              ...row,
              size: breakupInfo.matched_machine_size
            };
          }
          return row;
        });
        setDistribution(updatedDistribution);
        console.log('Distribution updated with matched sizes:', updatedDistribution);
      }

      message.success('Stock dimensions and costs updated successfully');
    } catch (error) {
      console.error('Error updating stock dimensions:', error);
      message.error('Failed to update stock dimensions');
    } finally {
      setIsCalculating(false);
    }
  };

  const calculateCost = async () => {
    if (!analysisData) {
      message.error('No analysis data available');
      return;
    }

    const total = distribution.reduce((s, d) => s + (Number(d.percent) || 0), 0);
    if (total <= 0 || total > 100) {
      message.error('Machine distribution must sum to 1–100%');
      return;
    }

    const hasEmptySize = distribution.some(d => d.machine && Number(d.percent) > 0 && !d.size);
    if (hasEmptySize) {
      message.error('Please select size for all machines with percentage > 0');
      return;
    }

    setIsCalculating(true);

    try {
      const dist = {};
      distribution.forEach(d => {
        if (d.machine && Number(d.percent) > 0) {
          dist[d.machine] = {
            size: d.size,
            percentage: Number(d.percent)
          };
        }
      });

      console.log('Sending machine distribution:', dist);

      const payload = {
        history_id: analysisData.id,
        machine_distribution: dist
      };

      const response = await fetch(`http://localhost:5678/Milling_update-size-cost-try/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to calculate cost');

      const result = await response.json();
      const normalized = normalizeCostData(result);
      console.log('Calculate cost normalized:', normalized);
      setCostData(normalized);
      setHistoryId(analysisData.id);
      localStorage.setItem('currentCalculationId', analysisData.id);
      if (onCostCalculationComplete) onCostCalculationComplete(analysisData.id);

      // UPDATE distribution with matched machine sizes from response
      if (result.machine_cost_breakup) {
        const updatedDistribution = distribution.map(row => {
          const breakupInfo = result.machine_cost_breakup[row.machine];
          if (breakupInfo && breakupInfo.matched_machine_size) {
            return {
              ...row,
              size: breakupInfo.matched_machine_size
            };
          }
          return row;
        });
        setDistribution(updatedDistribution);
        console.log('Distribution updated after cost calculation:', updatedDistribution);
      }

      message.success('Cost calculated successfully');
    } catch (error) {
      console.error('Error calculating cost:', error);
      message.error('Failed to calculate cost');
    } finally {
      setIsCalculating(false);
    }
  };

  const addDistributionRow = () => {
    setDistribution(prev => [
      ...prev,
      { machine: '3 Axis', size: '', percent: 0 }
    ]);
  };

  const updateDistributionRow = (index, key, value) => {
    setDistribution(prev => prev.map((row, i) => {
      if (i === index) {
        const updatedRow = { ...row, [key]: value };
        if (key === 'machine') {
          updatedRow.size = '';
        }
        return updatedRow;
      }
      return row;
    }));
  };

  const removeDistributionRow = (index) => {
    if (distribution.length === 1) return;
    setDistribution(prev => prev.filter((_, i) => i !== index));
  };

  const recalculateCost = async () => {
    if (!historyId) {
      message.error('No calculation history available');
      return;
    }

    const total = distribution.reduce((s, d) => s + (Number(d.percent) || 0), 0);
    if (total <= 0 || total > 100) {
      message.error('Machine distribution must sum to 1–100%');
      return;
    }

    const hasEmptySize = distribution.some(d => d.machine && Number(d.percent) > 0 && !d.size);
    if (hasEmptySize) {
      message.error('Please select size for all machines');
      return;
    }

    setIsCalculating(true);
    try {
      const dist = {};
      distribution.forEach(d => {
        if (d.machine && Number(d.percent) > 0) {
          dist[d.machine] = {
            size: d.size,
            percentage: Number(d.percent)
          };
        }
      });

      console.log('Recalculating with distribution:', dist);

      const response = await fetch(`http://localhost:5678/Milling_update-size-cost-try/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history_id: historyId,
          machine_distribution: dist
        })
      });

      if (!response.ok) throw new Error('Failed to recalculate cost');

      const result = await response.json();
      console.log('Recalculate response:', result);

      const normalized = normalizeCostData(result);
      console.log('Normalized recalculate data:', normalized);

      setCostData(normalized);

      // UPDATE distribution with machine sizes from response
      if (result.machine_cost_breakup) {
        const updatedDistribution = distribution.map(row => {
          const breakupInfo = result.machine_cost_breakup[row.machine];
          if (breakupInfo && breakupInfo.matched_machine_size) {
            return {
              ...row,
              size: breakupInfo.matched_machine_size
            };
          }
          return row;
        });
        setDistribution(updatedDistribution);
        console.log('Distribution updated after recalculation:', updatedDistribution);
      }

      message.success('Cost recalculated successfully based on selected size');
    } catch (error) {
      console.error('Error recalculating cost:', error);
      message.error('Failed to recalculate cost: ' + error.message);
    } finally {
      setIsCalculating(false);
    }
  };

  const updateMaterialCost = async () => {
    if (!costData?.id) {
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
        material_cost_per_unit: result.material_cost_per_unit || prev.material_cost_per_unit,
        material_cost_per_kg: result.material_cost_per_kg || prev.material_cost_per_kg,
        material_name: result.material_name || prev.material_name,
        stock_mass_kg: result.stock_mass_kg || prev.stock_mass_kg,
        finished_product_weight: result.finished_product_weight || prev.finished_product_weight,
        final_unit_cost: result.final_unit_cost || prev.final_unit_cost,
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
    if (!historyId) {
      message.error('No calculation history available');
      return;
    }

    setIsCalculating(true);

    try {
      const response = await fetch(`http://localhost:5678/milling/update-quantity/${historyId}?quantity=${newQuantity}`, {
        method: 'PUT',
        headers: {
          'accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      const result = await response.json();
      setCostData(prev => ({
        ...prev,
        total_cost: result.manufacturing_cost_without_materialcost || prev.total_cost,
        with_material_cost: result.manufacturing_cost_with_material_cost || prev.with_material_cost,
        material_cost_per_unit: result.material_cost_perunit || prev.material_cost_per_unit,
        material_cost: result.total_material_cost || prev.material_cost,
        manufacturing_cost_perunit: result.manufacturing_cost_perunit || prev.manufacturing_cost_perunit
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
    if (historyId) {
      updateQuantity(newQuantity);
    }
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A';
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
    return `Rs.${numValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const captureIsometricView = () => {
    return new Promise((resolve) => {
      try {
        let callbackExecuted = false;

        const handleIsometricCapture = (event) => {
          if (!callbackExecuted) {
            callbackExecuted = true;
            const dataUrl = event.detail;

            window.removeEventListener('isometricCaptureComplete', handleIsometricCapture);

            console.log('Isometric capture received successfully');
            resolve(dataUrl);
          }
        };

        window.addEventListener('isometricCaptureComplete', handleIsometricCapture);

        const captureEvent = new CustomEvent('requestIsometricCapture', {
          detail: {
            timestamp: Date.now()
          }
        });

        window.dispatchEvent(captureEvent);
        console.log('Isometric capture request sent to ViewerPage');

        const timeoutId = setTimeout(() => {
          if (!callbackExecuted) {
            callbackExecuted = true;
            window.removeEventListener('isometricCaptureComplete', handleIsometricCapture);
            console.warn('Isometric capture timeout after 5 seconds, returning null');
            resolve(null);
          }
        }, 5000);

        return () => clearTimeout(timeoutId);

      } catch (error) {
        console.error('Error in captureIsometricView:', error);
        resolve(null);
      }
    });
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
      pdf.text(`Filename: ${safeString(costData?.filename || analysisData?.filename || 'N/A')}`, margin, yPosition);
      pdf.setFontSize(10);
      pdf.setFont('times', 'normal');
      pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, yPosition, { align: 'right' });

      yPosition += 15;

      const capture3DModelScreenshot = () => {
        return new Promise((resolve) => {
          requestAnimationFrame(() => {
            try {
              const canvases = document.querySelectorAll('canvas');
              let targetCanvas = null;

              canvases.forEach(canvas => {
                if (canvas.width > 200 && canvas.height > 200) {
                  if (!targetCanvas || (canvas.width * canvas.height) > (targetCanvas.width * targetCanvas.height)) {
                    targetCanvas = canvas;
                  }
                }
              });

              if (targetCanvas && targetCanvas.width > 0 && targetCanvas.height > 0) {
                try {
                  const gl = targetCanvas.getContext('webgl') || targetCanvas.getContext('experimental-webgl');
                  if (gl) {
                    gl.finish();
                  }

                  const dataURL = targetCanvas.toDataURL('image/png', 1.0);

                  if (dataURL && dataURL.length > 100) {
                    console.log('Successfully captured 3D model screenshot');
                    resolve(dataURL);
                  } else {
                    console.warn('Canvas capture returned empty image');
                    resolve(null);
                  }
                } catch (captureError) {
                  console.warn('Error capturing canvas:', captureError);
                  resolve(null);
                }
              } else {
                console.warn('No suitable canvas found for screenshot');
                resolve(null);
              }
            } catch (error) {
              console.warn('Error in screenshot capture:', error);
              resolve(null);
            }
          });
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

      const currentAnalysis = updatedAnalysisData || analysisData;

      if (currentAnalysis) {
        tableData.push(['', '']);
        tableData.push(['MODULE: Machining Module (Milling Process)', '']);

        tableData.push(['MATERIAL DATA', '']);
        tableData.push(['Material', safeString(costData?.material || currentAnalysis.material_name || 'N/A')]);
        tableData.push(['Density', currentAnalysis.density ? `${safeString(currentAnalysis.density)} kg/m³` : 'N/A']);

        if (currentAnalysis.actual_dimensions) {
          tableData.push(['', '']);
          tableData.push(['FINAL COMPONENT ACTUAL DIMENSIONS', '']);
          tableData.push(['Volume (mm³)', safeString(currentAnalysis.actual_dimensions.volume_mm3 || 'N/A')]);
          tableData.push(['Mass', costData?.finished_product_weight ? `${costData.finished_product_weight} kg` : 'N/A']);
        }

        if (currentAnalysis.actual_dimensions) {
          tableData.push(['', '']);
          tableData.push(['BOUNDING BOX DIMENSIONS', '']);

          const length = currentAnalysis.actual_dimensions.length || 'N/A';
          const breadth = currentAnalysis.actual_dimensions.breadth || 'N/A';
          const height = currentAnalysis.actual_dimensions.height || 'N/A';
          const dimensionsFormat = `${length} mm × ${breadth} mm × ${height} mm`;

          tableData.push(['Length × Breadth × Height', dimensionsFormat]);
        }

        if (currentAnalysis.stock_dimensions) {
          tableData.push(['', '']);
          tableData.push(['STOCK DIMENSIONS', '']);
          tableData.push(['Volume (mm³)', safeString(currentAnalysis.stock_dimensions.volume_mm3 || 'N/A')]);
          tableData.push(['Mass', costData?.stock_mass ? `${costData.stock_mass} kg` : 'N/A']);

          tableData.push(['', '']);
          tableData.push(['RECOMMENDED BOUNDING BOX DIMENSIONS', '']);

          const stockLength = editableStockDimensions.length || currentAnalysis.stock_dimensions.length || 'N/A';
          const stockBreadth = editableStockDimensions.breadth || currentAnalysis.stock_dimensions.breadth || 'N/A';
          const stockHeight = editableStockDimensions.height || currentAnalysis.stock_dimensions.height || 'N/A';
          const stockDimensionsFormat = `${stockLength} mm × ${stockBreadth} mm × ${stockHeight} mm`;

          tableData.push(['Length × Breadth × Height', stockDimensionsFormat]);
        }
      }

      tableData.push(['', '']);
      tableData.push(['MANUFACTURING SETTINGS', '']);
      distribution.forEach((d, idx) => {
        const machineStr = `${d.machine} (${d.size || 'N/A'}) - ${d.percent}%`;
        tableData.push([idx === 0 ? 'Machine Distribution' : '', safeString(machineStr)]);
      });
      tableData.push(['Quantity', safeString(quantity)]);

      if (costData) {
        tableData.push(['', '']);
        tableData.push(['COST SUMMARY', '']);
        if (costData.material_cost_per_kg) {
          tableData.push(['Material Cost per kg', formatCurrencyForPDF(costData.material_cost_per_kg)]);
        }
        if (costData.material_cost_per_unit) {
          tableData.push(['Material Cost Per Unit', formatCurrencyForPDF(costData.material_cost_per_unit)]);
        }
        tableData.push(['Machining Cost Per Unit', formatCurrencyForPDF(costData.cost_per_unit)]);
        if (costData.material_cost) {
          tableData.push(['Total Material Cost For Given Quantity', formatCurrencyForPDF(costData.material_cost)]);
        }
        if (costData.total_cost) {
          tableData.push(['Total Machining Cost For Given Quantity', formatCurrencyForPDF(costData.total_cost)]);
        }
        if (costData.with_material_cost) {
          tableData.push(['OverAll Total Cost (Machining+Material cost)', formatCurrencyForPDF(costData.with_material_cost)]);
        }
      }

      const startY = yPosition;
      const rowHeight = 5;
      const col1Width = contentWidth * 0.6;

      let currentY = startY;

      tableData.forEach((row) => {
        const [label, value] = row;

        const isSectionHeader = label && !value && (label.includes('DIMENSIONS') || label.includes('SETTINGS') || label.includes('SUMMARY') || label.includes('EXTRA') || label.includes('MATERIAL DATA') || label.includes('MODULE:'));
        const isEmptyRow = !label && !value;

        if (isEmptyRow) {
          currentY += rowHeight / 2;
          return;
        }

        const getBackgroundColor = (label) => {
          if (isSectionHeader) {
            return [41, 128, 185];
          }
          if (label.includes('Volume') || label.includes('Length') || label.includes('Breadth') || label.includes('Height') || label.includes('Dimensions')) {
            return [217, 237, 247];
          }
          if (label.includes('Machine') || label.includes('Quantity') || label.includes('Distribution')) {
            return [236, 236, 236];
          }
          if (label.includes('Cost') || label.includes('Mass') || label.includes('Material')) {
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

          const isCostSummaryRow = (label.includes('Cost') || label.includes('Machining')) && label !== 'MATERIAL DATA' && label !== 'Material';

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
          const filename = `Cost_Report_${analysisData?.filename?.replace(/\.[^/.]+$/, '') || 'Model'}_${new Date().getTime()}.pdf`;
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

  const currentAnalysis = updatedAnalysisData || analysisData;

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
        {currentAnalysis ? (
          <>
            <Row gutter={[24, 0]} style={{ marginBottom: '24px' }}>
              <Col span={12}>
                <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
                  File Information
                </Title>
                <div style={{ marginBottom: '12px' }}>
                  <Text style={{ color: theme.textSecondary }}>Filename:</Text>
                  <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
                    {costData?.filename || currentAnalysis.filename || 'N/A'}
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
                        {costData?.material || currentAnalysis.material_name || 'N/A'}
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ marginBottom: '12px' }}>
                      <Text style={{ color: theme.textSecondary }}>Density:</Text>
                      <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: '14px' }}>
                        {currentAnalysis.density ? `${currentAnalysis.density} kg/m³` : 'N/A'}
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
                          {currentAnalysis.actual_dimensions?.length ? `${currentAnalysis.actual_dimensions.length} mm` : 'N/A'}
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Breadth:</span>
                        <div style={{ fontWeight: 500, color: theme.textPrimary }}>
                          {currentAnalysis.actual_dimensions?.breadth ? `${currentAnalysis.actual_dimensions.breadth} mm` : 'N/A'}
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Thickness:</span>
                        <div style={{ fontWeight: 500, color: theme.textPrimary }}>
                          {currentAnalysis.actual_dimensions?.height ? `${currentAnalysis.actual_dimensions.height} mm` : 'N/A'}
                        </div>
                      </div>
                    </div>
                    <h3 style={{
                      color: theme.primary,
                      fontWeight: 600,
                      marginBottom: '12px',
                      fontSize: '14px',
                      marginTop: '18px'
                    }}>
                      FINAL COMPONENT ACTUAL DIMENSIONS
                    </h3>
                    <Row gutter={[16, 0]} style={{ marginBottom: '16px' }}>
                      <Col span={12}>
                        <span style={{ color: theme.textSecondary }}>Volume (mm³):</span>
                        <div style={{
                          fontWeight: 600,
                          fontSize: '16px',
                          color: theme.textPrimary,
                          marginTop: '4px'
                        }}>
                          {currentAnalysis.actual_dimensions?.volume_mm3 || 'N/A'}
                        </div>
                      </Col>
                      <Col span={12}>
                        <span style={{ color: theme.textSecondary }}>Mass:</span>
                        <div style={{
                          fontWeight: 600,
                          fontSize: '16px',
                          color: theme.textPrimary,
                          marginTop: '4px'
                        }}>
                          {costData?.finished_product_weight ? `${costData.finished_product_weight} kg` : 'N/A'}
                        </div>
                      </Col>
                    </Row>
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
                    <Text strong style={{
                      color: theme.success,
                      fontSize: '13px',
                      marginBottom: '12px',
                      display: 'block',
                      fontWeight: 600
                    }}>
                      RECOMMENDED STOCK DIMENSIONS
                    </Text>

                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Length:</span>
                        <Input
                          type="number"
                          value={editableStockDimensions.length}
                          onChange={(e) => handleStockDimensionChange('length', e.target.value)}
                          placeholder="Length"
                          size="small"
                          style={{
                            marginTop: '2px',
                            fontSize: '12px'
                          }}
                          suffix="mm"
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Breadth:</span>
                        <Input
                          type="number"
                          value={editableStockDimensions.breadth}
                          onChange={(e) => handleStockDimensionChange('breadth', e.target.value)}
                          placeholder="Breadth"
                          size="small"
                          style={{
                            marginTop: '2px',
                            fontSize: '12px'
                          }}
                          suffix="mm"
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Thickness:</span>
                        <Input
                          type="number"
                          value={editableStockDimensions.height}
                          onChange={(e) => handleStockDimensionChange('height', e.target.value)}
                          placeholder="Height"
                          size="small"
                          style={{
                            marginTop: '2px',
                            fontSize: '12px'
                          }}
                          suffix="mm"
                        />
                      </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '8px' }}>
                      <Button
                        type="primary"
                        size="small"
                        onClick={updateStockDimensions}
                        loading={isCalculating}
                        style={{
                          backgroundColor: theme.success,
                          borderColor: theme.success,
                          fontSize: '12px',
                          height: '28px',
                          marginBottom: '10px'
                        }}
                      >
                        Update Dimensions
                      </Button>
                      <div style={{ textAlign: 'left', marginBottom: '12px' }}>
                        <Text
                          strong
                          style={{
                            color: theme.success,
                            fontSize: '14px',
                            fontWeight: 600,
                          }}
                        >
                          STOCK DIMENSIONS
                        </Text>

                        <Row gutter={[16, 0]} style={{ marginBottom: '16px' }}>
                          <Col span={12}>
                            <Text style={{ color: theme.textSecondary }}>Volume (mm³):</Text>
                            <div style={{
                              fontWeight: 600,
                              fontSize: '16px',
                              color: theme.textPrimary,
                              marginTop: '4px'
                            }}>
                              {currentAnalysis.stock_dimensions?.volume_mm3 || 'N/A'}
                            </div>
                          </Col>
                          <Col span={12}>
                            <Text style={{ color: theme.textSecondary }}>Mass:</Text>
                            <div style={{
                              fontWeight: 600,
                              fontSize: '16px',
                              color: theme.textPrimary,
                              marginTop: '4px'
                            }}>
                              {costData?.stock_mass ? `${costData.stock_mass} kg` : 'N/A'}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <Title level={5} style={{ color: theme.primary, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
                Manufacturing Operations
              </Title>

              <Row gutter={[16, 16]}>
                <Col span={16}>
                  {distribution.map((row, index) => (
                    <Row key={index} gutter={[8, 8]} style={{ marginBottom: '8px' }}>
                      <Col span={6}>
                        <Select
                          value={row.machine}
                          onChange={(val) => updateDistributionRow(index, 'machine', val)}
                          style={{ width: '100%' }}
                        >
                          {machineTypes.map(type => (
                            <Option key={type} value={type}>{type}</Option>
                          ))}
                        </Select>
                      </Col>
                      <Col span={6}>
                        <Select
                          value={row.size}
                          onChange={(val) => updateDistributionRow(index, 'size', val)}
                          style={{ width: '100%' }}
                          placeholder="Select Size"
                        >
                          {(availableSizes[row.machine] || []).map(size => (
                            <Option key={size} value={size}>{size}</Option>
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
                      <Col span={6}>
                        <Button danger onClick={() => removeDistributionRow(index)} disabled={distribution.length === 1}>Remove</Button>
                      </Col>
                    </Row>
                  ))}
                  <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                    <Button onClick={addDistributionRow}>Add Operation</Button>
                    <Button type="primary" onClick={calculateCost} loading={isCalculating}>
                      Get Cost
                    </Button>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ marginBottom: '12px' }}>
                    <Text
                      strong
                      style={{
                        color: theme.primary,
                        fontSize: '14px',
                        fontWeight: 600,
                        display: 'block',
                        marginBottom: '6px',
                        textAlign: 'left',
                      }}
                    >
                      Quantity:
                    </Text>

                    <Input
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      style={{
                        fontSize: '14px',
                        borderRadius: '6px',
                        width: '60%',
                        marginRight: '0',
                      }}
                      min={1}
                    />
                  </div>
                </Col>
              </Row>
            </div>

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
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <div style={{
                        padding: '12px',
                        background: `${theme.lightBlue}66`,
                        borderRadius: '8px',
                        border: `1px solid ${theme.primary}22`
                      }}>
                        <Statistic
                          title={<span style={{ color: theme.textSecondary }}>Manufaturing Cost Per Unit</span>}
                          value={formatCurrency(costData.cost_per_unit)}
                          valueStyle={{ color: theme.primary, fontWeight: 600, fontSize: '18px' }}
                        />
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{
                        padding: '12px',
                        background: `${theme.lightBlue}66`,
                        borderRadius: '8px',
                        border: `1px solid ${theme.primary}22`
                      }}>
                        <Statistic
                          title={<span style={{ color: theme.textSecondary }}>Total Manufaturing Cost</span>}
                          value={formatCurrency(costData.total_cost)}
                          valueStyle={{ color: theme.primary, fontWeight: 600, fontSize: '18px' }}
                        />
                      </div>
                    </Col>
                  </Row>

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

                  {showMaterialCost && (
                    <>
                      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                        {costData.material_cost_per_unit && (
                          <Col span={12}>
                            <div style={{
                              padding: '12px',
                              background: '#fff2e666',
                              borderRadius: '8px',
                              border: `1px solid #fa8c1622`
                            }}>
                              <Statistic
                                title={<span style={{ color: theme.textSecondary }}>Material Cost Per Unit</span>}
                                value={formatCurrency(costData.material_cost_per_unit)}
                                valueStyle={{ color: '#fa8c16', fontWeight: 600, fontSize: '16px' }}
                              />
                            </div>
                          </Col>
                        )}
                        {costData.material_cost && (
                          <Col span={12}>
                            <div style={{
                              padding: '12px',
                              background: '#fff2e666',
                              borderRadius: '8px',
                              border: `1px solid #fa8c1622`
                            }}>
                              <Statistic
                                title={<span style={{ color: theme.textSecondary }}>Total Material Cost</span>}
                                value={formatCurrency(costData.material_cost)}
                                valueStyle={{ color: '#fa8c16', fontWeight: 600, fontSize: '16px' }}
                              />
                            </div>
                          </Col>
                        )}
                      </Row>

                      {(costData.final_unit_cost || costData.with_material_cost) && (
                        <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                          {costData.final_unit_cost && (
                            <Col span={12}>
                              <div style={{
                                padding: '16px',
                                background: '#f0f9ff66',
                                borderRadius: '8px',
                                border: `1px solid ${theme.primary}22`,
                                textAlign: 'center'
                              }}>
                                <Statistic
                                  title={<span style={{ color: theme.textSecondary, fontSize: '16px' }}>Total Machining cost perunit with Material cost</span>}
                                  value={formatCurrency(costData.final_unit_cost)}
                                  valueStyle={{ color: theme.primary, fontWeight: 700, fontSize: '20px' }}
                                />
                              </div>
                            </Col>
                          )}
                          {costData.total_cost_per_unit_with_materials && (
                            <Col span={12}>
                              <div style={{
                                padding: '16px',
                                background: '#e6f7ff66',
                                borderRadius: '8px',
                                border: `1px solid ${theme.primary}22`,
                                textAlign: 'center'
                              }}>
                                <Statistic
                                  title={<span style={{ color: theme.textSecondary, fontSize: '16px' }}>Total Cost Per Unit (Including Material)</span>}
                                  value={formatCurrency(costData.total_cost_per_unit_with_materials)}
                                  valueStyle={{ color: theme.primary, fontWeight: 700, fontSize: '20px' }}
                                />
                              </div>
                            </Col>
                          )}
                          {costData.with_material_cost && (
                            <Col span={12}>
                              <div style={{
                                padding: '16px',
                                background: '#e6f7ff66',
                                borderRadius: '8px',
                                border: `1px solid ${theme.primary}22`,
                                textAlign: 'center'
                              }}>
                                <Statistic
                                  title={<span style={{ color: theme.textSecondary, fontSize: '16px' }}>Total Cost (Including Material Cost)</span>}
                                  value={formatCurrency(costData.with_material_cost)}
                                  valueStyle={{ color: theme.primary, fontWeight: 700, fontSize: '20px' }}
                                />
                              </div>
                            </Col>
                          )}
                        </Row>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: theme.textSecondary }}>
                  <Text style={{ color: theme.textSecondary, fontSize: '16px' }}>
                    No cost data available. Click "Get Cost" to calculate.
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

export default CostReport