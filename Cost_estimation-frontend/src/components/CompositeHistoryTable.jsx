import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { Modal, message } from 'antd';

const CompositeHistoryTable = ({ onBack }) => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5678/composites/analysis-results/');
      if (!response.ok) throw new Error('Failed to fetch history data');
      const data = await response.json();
      setHistoryData(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateCostReport = async (analysisId, filename) => {
    let pdf = null;

    try {
      message.loading('Generating PDF report...', 0);

      // Fetch detailed cost data for the specific analysis ID
      const response = await fetch(`http://localhost:5678/composites/analysis/${analysisId}/complete-data/`);
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
          const pdfFilename = `Composite_Cost_Report_${filename?.replace(/\.[^/.]+$/, '') || 'Model'}_${new Date().getTime()}.pdf`;
          pdf.save(pdfFilename);
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
    pdf.text(`Filename: ${safeString(filename)}`, margin, yPosition);
    pdf.setFontSize(10);
    pdf.setFont('times', 'normal');
    pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, yPosition, { align: 'right' });

    yPosition += 15;

    const tableData = [];

    // MODULE header
    tableData.push(['', '']);
    tableData.push(['MODULE: Composites Manufacturing Process', '']);

    // MATERIAL INFORMATION
    if (costData.analysis_result) {
      tableData.push(['', '']);
      tableData.push(['MATERIAL INFORMATION', '']);
      tableData.push(['Material', safeString(costData.analysis_result.material || 'N/A')]);
      tableData.push(['Density', costData.analysis_result.density_kg_m3 ? `${safeString(costData.analysis_result.density_kg_m3)} kg/m³` : 'N/A']);
    }

    // MASTER MODEL COST
    if (costData.master_model_cost) {
      tableData.push(['', '']);
      tableData.push(['MASTER MODEL COST', '']);
      tableData.push(['Design Hours', costData.master_model_cost.design_hours ? `${safeString(costData.master_model_cost.design_hours)} hrs` : 'N/A']);
      tableData.push(['Machining Hours', costData.master_model_cost.machining_hours ? `${safeString(costData.master_model_cost.machining_hours)} hrs` : 'N/A']);
      tableData.push(['Assembly Hours', costData.master_model_cost.assembly_hours ? `${safeString(costData.master_model_cost.assembly_hours)} hrs` : 'N/A']);
      tableData.push(['Finishing Hours', costData.master_model_cost.finishing_hours ? `${safeString(costData.master_model_cost.finishing_hours)} hrs` : 'N/A']);
      tableData.push(['Inspection Hours', costData.master_model_cost.inspection_hours ? `${safeString(costData.master_model_cost.inspection_hours)} hrs` : 'N/A']);

      tableData.push(['Design Cost', costData.master_model_cost.design_cost ? formatCurrencyForPDF(costData.master_model_cost.design_cost) : 'N/A']);
      tableData.push(['Frame Fabrication Cost', costData.master_model_cost.frame_fabrication_cost ? formatCurrencyForPDF(costData.master_model_cost.frame_fabrication_cost) : 'N/A']);
      tableData.push(['Epoxy Block+Bonding Cost', costData.master_model_cost.epoxy_block_bonding_cost ? formatCurrencyForPDF(costData.master_model_cost.epoxy_block_bonding_cost) : 'N/A']);
      tableData.push(['Machining Cost', costData.master_model_cost.machining_cost ? formatCurrencyForPDF(costData.master_model_cost.machining_cost) : 'N/A']);
      tableData.push(['Assembly Cost', costData.master_model_cost.assembly_cost ? formatCurrencyForPDF(costData.master_model_cost.assembly_cost) : 'N/A']);
      tableData.push(['Finishing Cost', costData.master_model_cost.finishing_cost ? formatCurrencyForPDF(costData.master_model_cost.finishing_cost) : 'N/A']);
      tableData.push(['Inspection Cost', costData.master_model_cost.inspection_cost ? formatCurrencyForPDF(costData.master_model_cost.inspection_cost) : 'N/A']);
      tableData.push(['Total Master Model Cost', costData.master_model_cost.total_master_model_cost ? formatCurrencyForPDF(costData.master_model_cost.total_master_model_cost) : 'N/A']);
    }

    // STOCK DIMENSION
    if (costData.analysis_result) {
      tableData.push(['', '']);
      tableData.push(['STOCK DIMENSION', '']);
      tableData.push(['Stock Length', costData.analysis_result.stock_length_mm ? `${safeString(costData.analysis_result.stock_length_mm)} mm` : 'N/A']);
      tableData.push(['Stock Width', costData.analysis_result.stock_width_mm ? `${safeString(costData.analysis_result.stock_width_mm)} mm` : 'N/A']);
      tableData.push(['Stock Height', costData.analysis_result.stock_height_mm ? `${safeString(costData.analysis_result.stock_height_mm)} mm` : 'N/A']);
    }

    // GEOMETRIC INFORMATION
    if (costData.analysis_result) {
      tableData.push(['', '']);
      tableData.push(['GEOMETRIC INFORMATION', '']);
      tableData.push(['Geometric Thickness', costData.analysis_result.geometric_thickness_mm ? `${safeString(costData.analysis_result.geometric_thickness_mm)} mm` : 'N/A']);
      tableData.push(['Surface Area (One Ply)', costData.analysis_result.one_ply_surface_area_m2 ? `${safeString(costData.analysis_result.one_ply_surface_area_m2)} m²` : 'N/A']);
      tableData.push(['Total Surface Area', costData.analysis_result.total_surface_area_m2 ? `${safeString(costData.analysis_result.total_surface_area_m2)} m²` : 'N/A']);
      tableData.push(['Volume of Part', costData.analysis_result.volume_of_part_m3 ? `${safeString(costData.analysis_result.volume_of_part_m3)} m³` : 'N/A']);
      tableData.push(['Mass', costData.analysis_result.mass_in_kg ? `${safeString(costData.analysis_result.mass_in_kg)} kg` : 'N/A']);
    }

    // TOOL COST
    if (costData.tool_cost) {
      tableData.push(['', '']);
      tableData.push(['TOOL COST', '']);
      tableData.push(['Increased Thickness Tool', costData.tool_cost.increased_thickness_tool_mm ? `${safeString(costData.tool_cost.increased_thickness_tool_mm)} mm` : 'N/A']);
      tableData.push(['Number of Man Hours', costData.tool_cost.layup_man_hours ? `${safeString(costData.tool_cost.layup_man_hours)} hrs` : 'N/A']);
      tableData.push(['Curing Hours', costData.tool_cost.curing_hours ? `${safeString(costData.tool_cost.curing_hours)} hrs` : 'N/A']);

      tableData.push(['Dry Carbon Fabric Cost', costData.tool_cost.cost_dry_carbon_fabric ? formatCurrencyForPDF(costData.tool_cost.cost_dry_carbon_fabric) : 'N/A']);
      tableData.push(['Layup Cost', costData.tool_cost.layup_cost ? formatCurrencyForPDF(costData.tool_cost.layup_cost) : 'N/A']);
      tableData.push(['Oven Curing Cost', costData.tool_cost.oven_curing_cost ? formatCurrencyForPDF(costData.tool_cost.oven_curing_cost) : 'N/A']);
      tableData.push(['LT Inspection Cost', costData.tool_cost.lt_inspection_cost ? formatCurrencyForPDF(costData.tool_cost.lt_inspection_cost) : 'N/A']);
      tableData.push(['Trimming and Inspection Cost', costData.tool_cost.trimming_inspection_cost ? formatCurrencyForPDF(costData.tool_cost.trimming_inspection_cost) : 'N/A']);
      tableData.push(['CFC Tubes Fabrication Cost', costData.tool_cost.cost_fabrication_cfc_tubes ? formatCurrencyForPDF(costData.tool_cost.cost_fabrication_cfc_tubes) : 'N/A']);
      tableData.push(['Bonding and Riveting Cost', costData.tool_cost.cost_bonding_riveting ? formatCurrencyForPDF(costData.tool_cost.cost_bonding_riveting) : 'N/A']);
      tableData.push(['Total Tool Cost', costData.tool_cost.total_tool_cost ? formatCurrencyForPDF(costData.tool_cost.total_tool_cost) : 'N/A']);
    }

    // PART FABRICATION COST
    if (costData.final_cost) {
      tableData.push(['', '']);
      tableData.push(['PART FABRICATION COST', '']);
      tableData.push(['Extra Composite Part', costData.final_cost.extra_composite_part_kg ? `${safeString(costData.final_cost.extra_composite_part_kg)}` : 'N/A']);
      tableData.push(['Part Layup Man Hours', costData.final_cost.part_layup_man_hours ? `${safeString(costData.final_cost.part_layup_man_hours)} hrs` : 'N/A']);
      tableData.push(['Design Thickness', costData.analysis_result?.design_thickness_mm ? `${safeString(costData.analysis_result.design_thickness_mm)} mm` : 'N/A']);

      tableData.push(['Prepreg Cost', costData.final_cost.prepreg_cost ? formatCurrencyForPDF(costData.final_cost.prepreg_cost) : 'N/A']);
      tableData.push(['Part Layup Cost', costData.final_cost.part_layup_cost ? formatCurrencyForPDF(costData.final_cost.part_layup_cost) : 'N/A']);
      tableData.push(['Consumable Cost', costData.final_cost.consumable_cost ? formatCurrencyForPDF(costData.final_cost.consumable_cost) : 'N/A']);
      tableData.push(['Autoclave Curing Cost', costData.final_cost.autoclave_curing_cost ? formatCurrencyForPDF(costData.final_cost.autoclave_curing_cost) : 'N/A']);
      tableData.push(['Trimming and Inspection Cost', costData.final_cost.trimming_inspection_cost ? formatCurrencyForPDF(costData.final_cost.trimming_inspection_cost) : 'N/A']);
      tableData.push(['NDT Cost', costData.final_cost.ndt_cost ? formatCurrencyForPDF(costData.final_cost.ndt_cost) : 'N/A']);
      tableData.push(['Total Part Cost', costData.final_cost.total_part_cost ? formatCurrencyForPDF(costData.final_cost.total_part_cost) : 'N/A']);
    }

    // Final Cost Summary
    if (costData.final_cost) {
      tableData.push(['', '']);
      const totalToolAndPartCost = (costData.final_cost.total_tool_cost || 0) + (costData.final_cost.total_part_cost || 0);
      tableData.push(['Total Tool and Part Cost', formatCurrencyForPDF(totalToolAndPartCost)]);
      tableData.push(['Import and Export Cost', costData.final_cost.import_and_export_cost ? formatCurrencyForPDF(costData.final_cost.import_and_export_cost) : 'N/A']);
      tableData.push(['Contingency Cost', costData.final_cost.contingency_cost ? formatCurrencyForPDF(costData.final_cost.contingency_cost) : 'N/A']);
      tableData.push(['GST', costData.final_cost.gst_cost ? formatCurrencyForPDF(costData.final_cost.gst_cost) : 'N/A']);
      tableData.push(['TOTAL COST', costData.final_cost.total_cost ? formatCurrencyForPDF(costData.final_cost.total_cost) : 'N/A']);
    }

    // Draw table with exact styling from CostReport.jsx and multi-page support
    const startY = yPosition;
    const rowHeight = 5;
    const col1Width = contentWidth * 0.6;
    const pageBottomMargin = 30; // Space needed for footer

    let currentY = startY;
    let currentPage = 1;

    const addNewPage = () => {
      pdf.addPage();
      currentPage++;
      currentY = 45; // Reset to top content area

      // Add header for new page
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
      pdf.text('COST ESTIMATION REPORT (Cont.)', pageWidth / 2, 25, { align: 'center' });

      // Add page number
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.setFont('times', 'normal');
      pdf.text(`Page ${currentPage}`, pageWidth - margin, 35, { align: 'right' });
      pdf.text(`Filename: ${safeString(filename)}`, margin, 35);
    };

    tableData.forEach((row, index) => {
      const [label, value] = row;

      const isSectionHeader = label && !value && (
        label.includes('COST') ||
        label.includes('INFORMATION') ||
        label.includes('DIMENSION') ||
        label.includes('MODULE:')
      );
      const isEmptyRow = !label && !value;

      // Check if we need a new page before drawing this row
      if (!isEmptyRow && currentY + rowHeight > pageHeight - pageBottomMargin) {
        // Add page break before section headers if possible
        if (isSectionHeader) {
          addNewPage();
        } else {
          // Add page break and continue with current row
          addNewPage();
        }
      }

      if (isEmptyRow) {
        currentY += rowHeight / 2;
        return;
      }

      // Add page break before TOOL COST and GEOMETRIC INFORMATION sections
      if ((label === 'TOOL COST' || label === 'GEOMETRIC INFORMATION') && currentY > pageHeight - 80) {
        addNewPage();
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

    // Add footer to each page
    for (let pageNum = 1; pageNum <= currentPage; pageNum++) {
      if (pageNum > 1) {
        pdf.setPage(pageNum);
      }

      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.setFont('georgia', 'normal');
      pdf.text(`Report generated on ${new Date().toLocaleString()} - Page ${pageNum} of ${currentPage}`, margin, pageHeight - 10);
    }

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
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </button>
        <h2 className="text-2xl font-bold text-gray-800 flex-1 text-center">Composite Cost History</h2>
        <div className="w-32"></div>
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
                      {item.material || `Material ID: ${item.prepreg_material_id}` || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {item.final_cost?.total_cost
                        ? `₹${Number(item.final_cost.total_cost).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : 'N/A'
                      }
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <button
                        onClick={() => generateCostReport(item.id, item.filename)}
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

export default CompositeHistoryTable;
