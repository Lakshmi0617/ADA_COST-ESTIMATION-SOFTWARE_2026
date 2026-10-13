import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { Modal, message } from 'antd';

const MillingHistoryTable = ({ onBack }) => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5678/milling-costs/');
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

  const generateCostReport = async (millingHistoryId, filename) => {
    let pdf = null;

    try {
      message.loading('Generating PDF report...', 0);

      // Fetch detailed cost data for the specific history ID
      const response = await fetch(`http://localhost:5678/milling-history-cost/${millingHistoryId}`);
      if (!response.ok) throw new Error('Failed to fetch cost details');
      const costData = await response.json();

      // Generate PDF first
      pdf = await generatePDFReport(costData, filename);

      message.destroy();

      // Show iframe preview modal like CostReport.jsx
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
          const filename = `Milling_Cost_Report_${filename?.replace(/\.[^/.]+$/, '') || 'Model'}_${new Date().getTime()}.pdf`;
          pdf.save(filename);
          message.success('PDF report downloaded successfully!');
        }
      });

    } catch (err) {
      console.error('Error generating report:', err);
      message.destroy();
      message.error('Failed to generate PDF report');
    }
  };

  const generatePDFReport = async (costData, filename) => {
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
    pdf.text(`Filename: ${safeString(filename)}`, margin, yPosition);
    pdf.setFontSize(10);
    pdf.setFont('times', 'normal');
    pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, yPosition, { align: 'right' });

    yPosition += 15;

    const tableData = [];

    tableData.push(['', '']);
    tableData.push(['MODULE: Machining Module (Milling Process)', '']);

    tableData.push(['MATERIAL DATA', '']);
    tableData.push(['Material', safeString(costData.material_name || 'N/A')]);
    tableData.push(['Density', costData.density ? `${safeString(costData.density)} kg/m³` : 'N/A']);

    if (costData.actual_length || costData.actual_breadth || costData.actual_height) {
      tableData.push(['', '']);
      tableData.push(['FINAL COMPONENT ACTUAL DIMENSIONS', '']);
      tableData.push(['Volume (mm³)', safeString(costData.actual_volume_mm3 || 'N/A')]);
      tableData.push(['Mass', costData.actual_weight ? `${costData.actual_weight} kg` : 'N/A']);
    }

    if (costData.actual_length || costData.actual_breadth || costData.actual_height) {
      tableData.push(['', '']);
      tableData.push(['BOUNDING BOX DIMENSIONS', '']);

      const length = costData.actual_length || 'N/A';
      const breadth = costData.actual_breadth || 'N/A';
      const height = costData.actual_height || 'N/A';
      const dimensionsFormat = `${length} mm × ${breadth} mm × ${height} mm`;

      tableData.push(['Length × Breadth × Height', dimensionsFormat]);
    }

    if (costData.stock_length || costData.stock_breadth || costData.stock_height) {
      tableData.push(['', '']);
      tableData.push(['STOCK DIMENSIONS', '']);
      tableData.push(['Volume (mm³)', safeString(costData.stock_volume_mm3 || 'N/A')]);
      tableData.push(['Mass', costData.stock_weight_kg ? `${costData.stock_weight_kg} kg` : 'N/A']);

      tableData.push(['', '']);
      tableData.push(['RECOMMENDED BOUNDING BOX DIMENSIONS', '']);

      const stockLength = costData.stock_length || 'N/A';
      const stockBreadth = costData.stock_breadth || 'N/A';
      const stockHeight = costData.stock_height || 'N/A';
      const stockDimensionsFormat = `${stockLength} mm × ${stockBreadth} mm × ${stockHeight} mm`;

      tableData.push(['Length × Breadth × Height', stockDimensionsFormat]);
    }

    tableData.push(['', '']);
    tableData.push(['MANUFACTURING SETTINGS', '']);
    tableData.push(['Quantity', safeString(costData.quantity || 'N/A')]);

    // Machine Distribution from machine_cost_breakup
    if (costData.machine_cost_breakup) {
      tableData.push(['', '']);
      tableData.push(['MACHINE DISTRIBUTION', '']);

      if (typeof costData.machine_cost_breakup === 'object') {
        Object.entries(costData.machine_cost_breakup).forEach(([machineType, details]) => {
          if (details && typeof details === 'object') {
            const percentage = details.input_percentage || 0;
            const size = details.matched_machine_size || 'N/A';
            const distributionText = `${machineType} (${size}) - ${percentage}%`;
            tableData.push([distributionText, formatCurrencyForPDF(details.calculated_cost || 0)]);
          }
        });
      }
    }

    if (costData.manufacturing_cost_perunit || costData.material_cost_perunit || costData.Total_material_cost) {
      tableData.push(['', '']);
      tableData.push(['COST SUMMARY', '']);
      if (costData.material_cost_perunit) {
        tableData.push(['Material Cost Per Unit', formatCurrencyForPDF(costData.material_cost_perunit)]);
      }
      tableData.push(['Machining Cost Per Unit', formatCurrencyForPDF(costData.manufacturing_cost_perunit)]);
      if (costData.Total_material_cost) {
        tableData.push(['Total Material Cost For Given Quantity', formatCurrencyForPDF(costData.Total_material_cost)]);
      }
      if (costData.manufacturing_cost_without_materialcost) {
        tableData.push(['Total Machining Cost For Given Quantity', formatCurrencyForPDF(costData.manufacturing_cost_without_materialcost)]);
      }
      if (costData.manufacturing_cost_with_material_cost) {
        tableData.push(['OverAll Total Cost (Machining+Material cost)', formatCurrencyForPDF(costData.manufacturing_cost_with_material_cost)]);
      }
    }

    const startY = yPosition;
    const rowHeight = 5;
    const col1Width = contentWidth * 0.6;

    let currentY = startY;

    tableData.forEach((row) => {
      const [label, value] = row;

      const isSectionHeader = label && !value && (label.includes('DIMENSIONS') || label.includes('SETTINGS') || label.includes('SUMMARY') || label.includes('MATERIAL DATA') || label.includes('MODULE:') || label.includes('DISTRIBUTION'));
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

    return pdf;
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
        <h2 className="text-2xl font-bold text-gray-800">Milling Cost History</h2>
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
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
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.filename || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.material_name || `Material ID: ${item.material_id}` || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {item.manufacturing_cost_with_material_cost
                        ? `₹${Number(item.manufacturing_cost_with_material_cost).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : 'N/A'
                      }
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <button
                        onClick={() => generateCostReport(item.milling_history_id, item.filename)}
                        className="inline-flex items-center justify-center p-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
                        title="Generate Cost Report"
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
    </div>
  );
};

export default MillingHistoryTable;
