import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download } from 'lucide-react';

const TurningHistoryTable = ({ onBack }) => {
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
      const response = await fetch('http://localhost:5678/turning-history-details/');
      if (!response.ok) throw new Error('Failed to fetch history data');
      const data = await response.json();
      setHistoryData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateCostReport = async (historyId, filename) => {
    try {
      // Fetch detailed cost data for the specific history ID
      const response = await fetch(`http://localhost:5678/turning-history-cost/${historyId}`);
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
    pdf.text(`Filename: ${safeString(costData?.filename || filename || 'N/A')}`, margin, yPosition);
    pdf.setFontSize(10);
    pdf.setFont('times', 'normal');
    pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, yPosition, { align: 'right' });

    yPosition += 15;

    // Build table data
    const tableData = [];

    tableData.push(['', '']);
    tableData.push(['MODULE: Machining Module (Turning Process)', '']);

    tableData.push(['MATERIAL DATA', '']);
    tableData.push(['Material', safeString(costData?.material_name || 'N/A')]);
    tableData.push(['Density', costData?.density ? `${safeString(costData.density)} kg/m³` : 'N/A']);

    if (costData?.volume_mm3) {
      tableData.push(['', '']);
      tableData.push(['FINAL COMPONENT ACTUAL DIMENSIONS', '']);
      tableData.push(['Volume (mm³)', safeString(costData.volume_mm3 || 'N/A')]);

      // Calculate mass using volume_m3 * density
      if (costData.volume_m3 && costData.density) {
        const calculatedMass = costData.volume_m3 * costData.density;
        tableData.push(['Mass', `${calculatedMass.toFixed(6)} kg`]);
      } else {
        tableData.push(['Mass', 'N/A']);
      }
    }

    if (costData?.diameter || costData?.axis_length) {
      tableData.push(['', '']);
      tableData.push(['BOUNDING BOX DIMENSIONS', '']);

      const diameter = costData.diameter || 'N/A';
      const axisLength = costData.axis_length || 'N/A';
      const dimensionsFormat = `Diameter: ${diameter} mm, Length: ${axisLength} mm`;

      tableData.push(['Diameter × Length', dimensionsFormat]);
    }

    if (costData?.stock_diameter || costData?.stock_length) {
      tableData.push(['', '']);
      tableData.push(['STOCK DIMENSIONS', '']);
      tableData.push(['Volume (mm³)', safeString(costData.stock_volume_mm3 || 'N/A')]);
      tableData.push(['Mass', costData.stock_weight_kg ? `${costData.stock_weight_kg} kg` : 'N/A']);

      tableData.push(['', '']);
      tableData.push(['RECOMMENDED BOUNDING BOX DIMENSIONS', '']);

      const stockDiameter = costData.stock_diameter || 'N/A';
      const stockLength = costData.stock_length || 'N/A';
      const stockDimensionsFormat = `Diameter: ${stockDiameter} mm, Length: ${stockLength} mm`;

      tableData.push(['Diameter × Length', stockDimensionsFormat]);
    }

    tableData.push(['', '']);
    tableData.push(['MANUFACTURING SETTINGS', '']);
    const distStr = [
      costData.turning_percentage && `Turning ${costData.turning_percentage}%`,
      costData.boring_percentage && `Boring ${costData.boring_percentage}%`,
      costData.threading_percentage && `Threading ${costData.threading_percentage}%`,
      costData.milling_percentage && `Milling ${costData.milling_percentage}%`
    ].filter(Boolean).join(', ') || 'Turning 100%';
    tableData.push(['Operation Distribution', safeString(distStr)]);
    tableData.push(['Quantity', safeString(costData.quantity || 1)]);

    if (costData) {
      tableData.push(['', '']);
      tableData.push(['COST SUMMARY', '']);
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
      link.download = `Turning_Cost_Report_${filename?.replace(/\.[^/.]+$/, '') || 'Model'}_${new Date().getTime()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const calculateTotalCost = (item) => {
    if (item.total_cost_with_material_cost) {
      return item.total_cost_with_material_cost;
    }
    // Fallback calculation if total cost is not available
    const materialCost = item.total_material_cost || 0;
    const machiningCost = item.total_machining_cost || 0;
    return materialCost + machiningCost;
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Turning Cost History</h2>
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Turning</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#246679] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Filename</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Material Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Total Cost</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Cost Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {historyData.length > 0 ? (
                historyData.map((item) => (
                  <tr key={item.history_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.filename || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.material_name || `Material ID: ${item.material_id}` || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {calculateTotalCost(item)
                        ? `₹${Number(calculateTotalCost(item)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : 'N/A'
                      }
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <button
                        onClick={() => generateCostReport(item.history_id, item.filename)}
                        className="inline-flex items-center justify-center p-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
                        title="Generate Cost Report"
                        disabled={!item.cost_id}
                      >
                        <Download className="w-4 h-4" />
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

export default TurningHistoryTable;
