import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download } from 'lucide-react';

const SheetMetalHistoryTable = ({ onBack }) => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [previewFilename, setPreviewFilename] = useState('');
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5678/sheetmetal-history-details/');
      if (!response.ok) throw new Error('Failed to fetch history data');

      const data = await response.json();
      setHistoryData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateCostReport = async (historyId, filename) => {
    try {
      // Fetch detailed cost data for the specific history ID
      const response = await fetch(`http://localhost:5678/sheetmetal-history-cost/${historyId}`);
      if (!response.ok) throw new Error('Failed to fetch cost data');

      const costData = await response.json();
      setPreviewData(costData);
      setPreviewFilename(filename);

      // Generate PDF first
      await generatePDFPreview(costData, filename);

      // Then show preview modal
      setShowPreviewModal(true);
    } catch (error) {
      console.error('Error generating cost report:', error);
      alert('Failed to generate cost report');
    }
  };

  const generatePDFPreview = async (costData, filename) => {
    // Import jsPDF dynamically
    const { jsPDF } = await import('jspdf');

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

    // Display all three filenames
    const femaleFilename = safeString(costData?.filename_female || 'N/A');
    const maleFilename = safeString(costData?.filename_male || 'N/A');
    const partFilename = safeString(costData?.filename_part || 'N/A');

    pdf.text(`Female Tool: ${femaleFilename}`, margin, yPosition);
    yPosition += 8;
    pdf.text(`Male Tool: ${maleFilename}`, margin, yPosition);
    yPosition += 8;
    pdf.text(`Part: ${partFilename}`, margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont('times', 'normal');
    pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, yPosition, { align: 'right' });

    yPosition += 15;

    // Build table data - matching SheetMetalCostReport.jsx format
    const tableData = [];

    tableData.push(['', '']);
    tableData.push(['MODULE: Sheet Metal Module', '']);
    tableData.push(['MATERIAL DATA', '']);
    tableData.push(['Material', safeString(costData?.material_name || 'N/A')]);
    tableData.push(['Density', costData?.material_density ? `${safeString(costData.material_density)} kg/m³` : 'N/A']);
    tableData.push(['Cost per kg', costData?.material_cost ? `Rs.${costData.material_cost.toFixed(3)}` : 'N/A']);
    tableData.push(['', '']);
    tableData.push(['MANUFACTURING SETTINGS', '']);
    tableData.push(['Quantity', safeString(costData?.quantity || 1)]);

    // Female Tool Data - matching exact format
    if (costData?.female_tool) {
      tableData.push(['', '']);
      tableData.push(['FEMALE TOOL DATA', '']);
      tableData.push(['Filename', safeString(costData.female_tool.filename || costData.filename_female || 'N/A')]);
      tableData.push(['Actual Dimensions', `${costData.female_tool.length?.toFixed(2) || '0'} × ${costData.female_tool.breadth?.toFixed(2) || '0'} × ${costData.female_tool.height?.toFixed(2) || '0'} mm`]);
      tableData.push(['Actual Volume', safeString(costData.female_tool.volume_mm3?.toLocaleString() || '0') + ' mm³']);

      if (costData?.female_stock_dimensions) {
        tableData.push(['Stock Dimensions', `${costData.female_stock_dimensions.stock_length} × ${costData.female_stock_dimensions.stock_breadth} × ${costData.female_stock_dimensions.stock_height} mm`]);
        tableData.push(['Stock Volume', safeString(costData.female_stock_dimensions.stock_volume_mm3?.toLocaleString() || '0') + ' mm³']);
      }
    }

    // Male Tool Data - matching exact format
    if (costData?.male_tool) {
      tableData.push(['', '']);
      tableData.push(['MALE TOOL DATA', '']);
      tableData.push(['Filename', safeString(costData.male_tool.filename || costData.filename_male || 'N/A')]);
      tableData.push(['Actual Dimensions', `${costData.male_tool.length?.toFixed(2) || '0'} × ${costData.male_tool.breadth?.toFixed(2) || '0'} × ${costData.male_tool.height?.toFixed(2) || '0'} mm`]);
      tableData.push(['Actual Volume', safeString(costData.male_tool.volume_mm3?.toLocaleString() || '0') + ' mm³']);

      if (costData?.male_stock_dimensions) {
        tableData.push(['Stock Dimensions', `${costData.male_stock_dimensions.stock_length} × ${costData.male_stock_dimensions.stock_breadth} × ${costData.male_stock_dimensions.stock_height} mm`]);
        tableData.push(['Stock Volume', safeString(costData.male_stock_dimensions.stock_volume_mm3?.toLocaleString() || '0') + ' mm³']);
      }
    }

    // Part Data - matching exact format
    if (costData?.part) {
      tableData.push(['', '']);
      tableData.push(['PART DATA', '']);
      tableData.push(['Filename', safeString(costData.part.filename || costData.filename_part || 'N/A')]);
      tableData.push(['Actual Dimensions', `${costData.part.length?.toFixed(2) || '0'} × ${costData.part.breadth?.toFixed(2) || '0'} × ${costData.part.height?.toFixed(2) || '0'} mm`]);
      tableData.push(['Actual Volume', safeString(costData.part.volume_mm3?.toLocaleString() || '0') + ' mm³']);
      tableData.push(['Mass', costData.part.volume_m3 ? `${(costData.part.volume_m3 * (costData.material_density || 0))?.toFixed(4)} kg` : 'N/A']);
    }

    // Cost Summary - matching exact format
    if (costData) {
      tableData.push(['', '']);
      tableData.push(['COST SUMMARY', '']);
      tableData.push(['Total Design Cost', formatCurrencyForPDF(costData.tool_design_data?.total_design_cost)]);
      tableData.push([null, null]);
      tableData.push(['FEMALE TOOL COST', '']);
      tableData.push(['Material Cost', formatCurrencyForPDF(costData.female_total_material_cost_per_unit)]);
      tableData.push(['Manufacturing Cost', formatCurrencyForPDF(costData.female_manufacturing_cost)]);
      tableData.push(['', '']);
      tableData.push(['MALE TOOL COST', '']);
      tableData.push(['Material Cost', formatCurrencyForPDF(costData.male_total_material_cost_per_unit)]);
      tableData.push(['Manufacturing Cost', formatCurrencyForPDF(costData.male_manufacturing_cost)]);
      tableData.push(['', '']);
      tableData.push(['PART FORMING COST', '']);
      tableData.push(['Part Forming Cost', formatCurrencyForPDF(costData.part_forming_cost)]);
      tableData.push(['Part Forming Cost Per Unit', formatCurrencyForPDF(costData.part_forming_cost_per_unit)]);
      tableData.push(['', '']);
      tableData.push(['TOTAL COSTS', '']);
      tableData.push(['Total Cost', formatCurrencyForPDF(costData.total_cost)]);
      tableData.push(['Total Cost Per Unit', formatCurrencyForPDF(costData.total_cost_per_unit)]);
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

    // Create blob URL for preview
    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  };

  const generatePDFReport = async (costData, filename) => {
    // Download the PDF that was already generated for preview
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `SheetMetal_Cost_Report_${filename?.replace(/\.[^/.]+$/, '') || 'Model'}_${new Date().getTime()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const calculateTotalCost = (item) => {
    if (item.total_cost) {
      return item.total_cost;
    }
    // Fallback calculation if total cost is not available
    const materialCost = item.total_material_cost || 0;
    const femaleMfgCost = item.female_manufacturing_cost || 0;
    const maleMfgCost = item.male_manufacturing_cost || 0;
    const formingCost = item.part_forming_cost || 0;
    return materialCost + femaleMfgCost + maleMfgCost + formingCost;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading history data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-800 flex-1 text-center">Sheet Metal History</h1>
        <div className="w-32"></div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-[#246679] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Filenames
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Material Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {historyData.length > 0 ? (
                historyData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">Female:</div>
                        <div className="font-medium">{item.filename_female}</div>
                        <div className="text-xs text-gray-500">Male:</div>
                        <div className="font-medium">{item.filename_male}</div>
                        <div className="text-xs text-gray-500">Part:</div>
                        <div className="font-medium">{item.filename_part}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.material_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-semibold text-[#246679]">
                        ₹{calculateTotalCost(item).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => generateCostReport(item.id, item.filename_female)}
                        className="flex items-center space-x-2 px-3 py-2 bg-[#246679] text-white rounded-md hover:bg-[#1f5766] transition-colors duration-200"
                      >
                        <Download className="w-4 h-4" />
                        <span>Cost Report</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No history records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl">
            {/* Modal Header */}
            <div className="bg-[#246679] text-white p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">PDF Preview</h3>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  // Clean up PDF URL when closing modal
                  if (pdfUrl) {
                    URL.revokeObjectURL(pdfUrl);
                    setPdfUrl(null);
                  }
                }}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content - PDF iframe */}
            <div style={{ height: '70vh', padding: 0 }}>
              {pdfUrl && (
                <iframe
                  title="pdf"
                  src={pdfUrl}
                  style={{ border: 'none', width: '100%', height: '100%' }}
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4 border-t">
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  // Clean up PDF URL when closing modal
                  if (pdfUrl) {
                    URL.revokeObjectURL(pdfUrl);
                    setPdfUrl(null);
                  }
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  generatePDFReport(previewData, previewFilename);
                  setShowPreviewModal(false);
                  // Clean up PDF URL after download
                  if (pdfUrl) {
                    URL.revokeObjectURL(pdfUrl);
                    setPdfUrl(null);
                  }
                }}
                className="px-4 py-2 bg-[#246679] text-white rounded-md hover:bg-[#1f5766] transition-colors duration-200 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SheetMetalHistoryTable;
