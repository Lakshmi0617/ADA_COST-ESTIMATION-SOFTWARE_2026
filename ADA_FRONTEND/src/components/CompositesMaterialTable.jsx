import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Edit2, Save, X, Download, Upload, Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import * as XLSX from 'xlsx';

// Add Material Modal Component
const AddMaterialModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    material: '',
    spec: '',
    density_kg_m3: '',
    thickness_mm: '',
    prepreg_cost_per_kg: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.material || !formData.spec) {
      alert('Please fill in Material and Specification fields');
      return;
    }

    try {
      setSubmitting(true);
      
      const payload = {
        material: formData.material,
        spec: formData.spec,
        density_kg_m3: formData.density_kg_m3 ? parseFloat(formData.density_kg_m3) : 0,
        thickness_mm: formData.thickness_mm ? parseFloat(formData.thickness_mm) : 0,
        prepreg_cost_per_kg: formData.prepreg_cost_per_kg ? parseFloat(formData.prepreg_cost_per_kg) : 0
      };

      const response = await fetch('http://172.18.100.156:8004/composites/prepregs/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add material');
      }

      alert('Material added successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      alert('Error adding material: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Add New Material</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Material Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="text-red-500">*</span> Material
                </label>
                <input
                  type="text"
                  placeholder="e.g., CARBON BD"
                  value={formData.material}
                  onChange={(e) => handleInputChange('material', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="text-red-500">*</span> Specification
                </label>
                <input
                  type="text"
                  placeholder="e.g., HEXPLY914/40%/803"
                  value={formData.spec}
                  onChange={(e) => handleInputChange('spec', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Density (kg/m³)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 1600"
                  value={formData.density_kg_m3}
                  onChange={(e) => handleInputChange('density_kg_m3', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thickness (mm)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 0.3"
                  value={formData.thickness_mm}
                  onChange={(e) => handleInputChange('thickness_mm', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prepreg Cost per kg (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.prepreg_cost_per_kg}
                    onChange={(e) => handleInputChange('prepreg_cost_per_kg', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200 disabled:opacity-50"
            >
              {submitting ? 'Adding Material...' : 'Add Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Materials Table Component
const CompositesMaterialTable = ({ onBack }) => {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    setUserRole(userData.role || '');
    fetchMaterials();
  }, []);

  useEffect(() => {
    const filtered = materials.filter(material =>
      material.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.spec.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMaterials(filtered);
    setCurrentPage(1);
  }, [materials, searchTerm]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://172.18.100.156:8004/composites/prepregs/');
      if (!response.ok) throw new Error('Failed to fetch materials');
      const result = await response.json();
      const data = result.data || [];
      const sortedData = [...data].sort((a, b) => a.id - b.id);
      setMaterials(sortedData);
      setFilteredMaterials(sortedData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (material) => {
    setEditingId(material.id);
    setEditedData({
      material: material.material,
      spec: material.spec,
      thickness_mm: material.thickness_mm,
      prepreg_cost_per_kg: material.prepreg_cost_per_kg
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedData({});
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      
      const payload = {
        material: editedData.material,
        spec: editedData.spec,
        thickness_mm: parseFloat(editedData.thickness_mm) || 0,
        prepreg_cost_per_kg: parseFloat(editedData.prepreg_cost_per_kg) || 0
      };

      const response = await fetch('http://172.18.100.156:8004/composites/prepregs/update/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to update material');
      
      setMaterials(prev => {
        const index = prev.findIndex(m => m.id === editingId);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = { 
            ...prev[index], 
            ...editedData,
            thickness_mm: parseFloat(editedData.thickness_mm) || 0,
            prepreg_cost_per_kg: parseFloat(editedData.prepreg_cost_per_kg) || 0
          };
          return updated;
        }
        return prev;
      });
      
      setEditingId(null);
      setEditedData({});
      alert('Material updated successfully!');
    } catch (err) {
      alert('Error updating material: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleExportToExcel = () => {
    const exportData = filteredMaterials.map(material => ({
      'ID': material.id,
      'Material': material.material,
      'Specification': material.spec,
      'Density (kg/m³)': material.density_kg_m3,
      'Thickness (mm)': material.thickness_mm,
      'Prepreg Cost per kg': material.prepreg_cost_per_kg
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    const columnWidths = [
      { wch: 10 },
      { wch: 20 },
      { wch: 35 },
      { wch: 18 },
      { wch: 18 },
      { wch: 20 }
    ];
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Composites Materials');

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `Composites_Materials_${timestamp}.xlsx`;

    XLSX.writeFile(workbook, filename);
  };

  const handleImportExcel = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        setUploading(true);
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Process each row and update via API
        for (const row of jsonData) {
          const payload = {
            material: row.Material,
            spec: row.Specification,
            thickness_mm: Number(row['Thickness (mm)']) || 0,
            prepreg_cost_per_kg: Number(row['Prepreg Cost per kg']) || 0
          };

          await fetch('http://172.18.100.156:8004/composites/prepregs/update/', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'accept': 'application/json'
            },
            body: JSON.stringify(payload)
          });
        }

        alert('Materials imported successfully!');
        fetchMaterials();
      } catch (err) {
        alert('Error importing file: ' + err.message);
      } finally {
        setUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const isAdmin = userRole.toLowerCase() === 'admin';

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMaterials.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading materials...</div>
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
        <h2 className="text-2xl font-bold text-gray-800">Composites Materials</h2>
        <div className="flex items-center space-x-3">
          {isAdmin && (
            <>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add Material</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportExcel}
                accept=".xlsx, .xls"
                className="hidden"
              />
              <button
                onClick={triggerFileInput}
                disabled={uploading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>{uploading ? 'Uploading...' : 'Import Excel'}</span>
              </button>
            </>
          )}
          <button
            onClick={handleExportToExcel}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Export to Excel</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by material name or specification..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679] focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#246679] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Material</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Specification</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Density (kg/m³)</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Thickness (mm)</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Prepreg Cost/kg</th>
                {isAdmin && (
                  <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {material.material}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {material.spec}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {material.density_kg_m3 || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {isAdmin && editingId === material.id ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editedData.thickness_mm}
                          onChange={(e) => handleInputChange('thickness_mm', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                        />
                      ) : (
                        <span className="text-gray-700">{material.thickness_mm || '-'}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {isAdmin && editingId === material.id ? (
                        <div className="relative">
                          <span className="absolute left-2 top-1 text-gray-500">₹</span>
                          <input
                            type="number"
                            step="0.01"
                            value={editedData.prepreg_cost_per_kg}
                            onChange={(e) => handleInputChange('prepreg_cost_per_kg', e.target.value)}
                            className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-700">₹{material.prepreg_cost_per_kg || 0}</span>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-sm">
                        {editingId === material.id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={handleUpdate}
                              disabled={updating}
                              className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                            >
                              <Save className="w-4 h-4" />
                              <span>{updating ? 'Saving...' : 'Save'}</span>
                            </button>
                            <button
                              onClick={handleCancel}
                              disabled={updating}
                              className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
                            >
                              <X className="w-4 h-4" />
                              <span>Cancel</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEdit(material)}
                            className="flex items-center space-x-1 px-3 py-1 bg-[#246679] text-white rounded hover:bg-[#1f5766] transition-colors duration-200"
                          >
                            <Edit2 className="w-4 h-4" />
                            <span>Update</span>
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-6 py-8 text-center text-gray-500">
                    No materials found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredMaterials.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredMaterials.length)} of {filteredMaterials.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && paginate(page)}
                  disabled={page === '...'}
                  className={`px-4 py-2 border rounded-lg transition-colors duration-200 ${
                    currentPage === page
                      ? 'bg-[#246679] text-white border-[#246679]'
                      : page === '...'
                      ? 'border-gray-300 cursor-default'
                      : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      {!isAdmin && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update materials.
          </p>
        </div>
      )}

      {/* Add Material Modal */}
      {showAddModal && (
        <AddMaterialModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchMaterials}
        />
      )}
    </div>
  );
};

export default CompositesMaterialTable;