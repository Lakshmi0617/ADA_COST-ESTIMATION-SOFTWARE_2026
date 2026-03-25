import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Upload, Download, ArrowLeft, Pencil, Trash2, X, Save } from 'lucide-react';
import * as XLSX from 'xlsx';

// Add Material Modal Component
const AddMaterialModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    material: '',
    material_specification: '',
    density: '',
    material_cost: '',
    parameters: [{
      length_range: '',
      roughing_feed_rate: '',
      roughing_axial_depth_of_cut: '',
      roughing_radial_width_of_cut: '',
      finishing_feed_rate: '',
      finishing_axial_depth_of_cut: '',
      finishing_radial_width_of_cut: ''
    }],
    machine_rates: [{
      machine_type: '',
      size: '',
      hourly_rate: ''
    }]
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleParameterChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      parameters: prev.parameters.map((param, i) => 
        i === index ? { ...param, [field]: value } : param
      )
    }));
  };

  const handleMachineRateChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      machine_rates: prev.machine_rates.map((rate, i) => 
        i === index ? { ...rate, [field]: value } : rate
      )
    }));
  };

  const addParameterSet = () => {
    setFormData(prev => ({
      ...prev,
      parameters: [...prev.parameters, {
        length_range: '',
        roughing_feed_rate: '',
        roughing_axial_depth_of_cut: '',
        roughing_radial_width_of_cut: '',
        finishing_feed_rate: '',
        finishing_axial_depth_of_cut: '',
        finishing_radial_width_of_cut: ''
      }]
    }));
  };

  const addMachineRate = () => {
    setFormData(prev => ({
      ...prev,
      machine_rates: [...prev.machine_rates, {
        machine_type: '',
        size: '',
        hourly_rate: ''
      }]
    }));
  };

  const removeParameterSet = (index) => {
    if (formData.parameters.length > 1) {
      setFormData(prev => ({
        ...prev,
        parameters: prev.parameters.filter((_, i) => i !== index)
      }));
    }
  };

  const removeMachineRate = (index) => {
    if (formData.machine_rates.length > 1) {
      setFormData(prev => ({
        ...prev,
        machine_rates: prev.machine_rates.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.material || !formData.material_specification || !formData.density || !formData.material_cost) {
      alert('Please fill in all basic information fields');
      return;
    }

    try {
      setSubmitting(true);
      
      const payload = {
        material: formData.material,
        material_specification: formData.material_specification,
        density: parseFloat(formData.density),
        material_cost: parseFloat(formData.material_cost),
        parameters: formData.parameters.map(param => ({
          length_range: param.length_range,
          roughing_feed_rate: parseFloat(param.roughing_feed_rate) || 0,
          roughing_axial_depth_of_cut: parseFloat(param.roughing_axial_depth_of_cut) || 0,
          roughing_radial_width_of_cut: parseFloat(param.roughing_radial_width_of_cut) || 0,
          finishing_feed_rate: parseFloat(param.finishing_feed_rate) || 0,
          finishing_axial_depth_of_cut: parseFloat(param.finishing_axial_depth_of_cut) || 0,
          finishing_radial_width_of_cut: parseFloat(param.finishing_radial_width_of_cut) || 0
        })),
        machine_rates: formData.machine_rates.map(rate => ({
          machine_type: rate.machine_type,
          size: rate.size,
          hourly_rate: parseFloat(rate.hourly_rate) || 0
        }))
      };

      const response = await fetch('http://172.18.100.156:8004/sheetmetal-materials/add', {
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

      const result = await response.json();
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Add New Material</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="text-red-500">*</span> Material Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Aluminium"
                  value={formData.material}
                  onChange={(e) => handleInputChange('material', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="text-red-500">*</span> Material Specification
                </label>
                <input
                  type="text"
                  placeholder="e.g., bs15"
                  value={formData.material_specification}
                  onChange={(e) => handleInputChange('material_specification', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="text-red-500">*</span> Density (kg/m³)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 2780"
                  value={formData.density}
                  onChange={(e) => handleInputChange('density', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="text-red-500">*</span> Material Cost (₹/kg)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.material_cost}
                    onChange={(e) => handleInputChange('material_cost', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Machining Parameters */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Machining Parameters</h3>
              <button
                type="button"
                onClick={addParameterSet}
                className="text-sm text-[#246679] hover:text-[#1f5766] font-medium"
              >
                + Add Parameter Set
              </button>
            </div>
            {formData.parameters.map((param, index) => (
              <div key={index} className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-700">Parameter Set #{index + 1}</h4>
                  {formData.parameters.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeParameterSet(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Length Range
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 0-100mm"
                      value={param.length_range}
                      onChange={(e) => handleParameterChange(index, 'length_range', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rough Feed Rate
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="mm/min"
                        value={param.roughing_feed_rate}
                        onChange={(e) => handleParameterChange(index, 'roughing_feed_rate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rough Axial DoC
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="mm"
                        value={param.roughing_axial_depth_of_cut}
                        onChange={(e) => handleParameterChange(index, 'roughing_axial_depth_of_cut', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rough Radial WOC
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="mm"
                        value={param.roughing_radial_width_of_cut}
                        onChange={(e) => handleParameterChange(index, 'roughing_radial_width_of_cut', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Finish Feed Rate
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="mm/min"
                        value={param.finishing_feed_rate}
                        onChange={(e) => handleParameterChange(index, 'finishing_feed_rate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Finish Axial DoC
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="mm"
                        value={param.finishing_axial_depth_of_cut}
                        onChange={(e) => handleParameterChange(index, 'finishing_axial_depth_of_cut', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Finish Radial WOC
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="mm"
                        value={param.finishing_radial_width_of_cut}
                        onChange={(e) => handleParameterChange(index, 'finishing_radial_width_of_cut', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Machine Rates */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Machine Rates</h3>
              <button
                type="button"
                onClick={addMachineRate}
                className="text-sm text-[#246679] hover:text-[#1f5766] font-medium"
              >
                + Add Machine Rate
              </button>
            </div>
            {formData.machine_rates.map((rate, index) => (
              <div key={index} className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-700">Machine Rate #{index + 1}</h4>
                  {formData.machine_rates.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMachineRate(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Machine Type
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., CNC Press"
                      value={rate.machine_type}
                      onChange={(e) => handleMachineRateChange(index, 'machine_type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Machine Size
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 2000*1000*600"
                      value={rate.size}
                      onChange={(e) => handleMachineRateChange(index, 'size', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hourly Rate (₹/hr)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">₹</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={rate.hourly_rate}
                        onChange={(e) => handleMachineRateChange(index, 'hourly_rate', e.target.value)}
                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
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

// Delete Confirmation Modal
const DeleteConfirmationModal = ({ material, onConfirm, onCancel, isDeleting }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Delete Material</h2>
      </div>
      
      <div className="px-6 py-6">
        <p className="text-gray-700 mb-4">
          Are you sure you want to delete this material? This action will also delete all associated parameters and machine rates.
        </p>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Material ID:</strong> {material.id}
          </p>
          <p className="text-sm text-gray-700 mb-2">
            <strong>Material:</strong> {material.material}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Specification:</strong> {material.material_specification}
          </p>
        </div>
        <p className="text-sm text-red-600 font-medium">
          ⚠️ This action cannot be undone!
        </p>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>{isDeleting ? 'Deleting...' : 'Delete Material'}</span>
        </button>
      </div>
    </div>
  </div>
);

// Main Materials Table Component
const SheetMetalComponent = ({ onBack }) => {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedCost, setEditedCost] = useState('');
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteModal, setDeleteModal] = useState({ show: false, material: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef(null);

  const API_BASE = 'http://172.18.100.156:8004';

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    setUserRole(userData.role || '');
    fetchMaterials();
  }, []);

  useEffect(() => {
    const filtered = materials.filter(material =>
      material.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.material_specification.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMaterials(filtered);
    setCurrentPage(1);
  }, [materials, searchTerm]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/sheetmetal-materials`);
      if (!response.ok) throw new Error('Failed to fetch materials');
      const result = await response.json();
      const sortedData = result.success ? [...result.data].sort((a, b) => a.id - b.id) : [];
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
    setEditedCost(material.material_cost.toString());
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedCost('');
  };

  const handleUpdate = async (material) => {
    try {
      setUpdating(true);
      const formData = new URLSearchParams();
      formData.append('material', material.material);
      formData.append('material_specification', material.material_specification);
      formData.append('density', material.density);
      formData.append('new_cost', editedCost);

      const response = await fetch(`${API_BASE}/sheetmetal-materials/update-cost`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to update material cost');
      
      alert('Material cost updated successfully!');
      setEditingId(null);
      setEditedCost('');
      fetchMaterials();
    } catch (err) {
      alert('Error updating material: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = (material) => {
    setDeleteModal({ show: true, material });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.material) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`${API_BASE}/sheetmetal-materials/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          material_id: deleteModal.material.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete material');
      }

      const result = await response.json();
      alert(result.message || 'Material deleted successfully!');
      setDeleteModal({ show: false, material: null });
      fetchMaterials();
    } catch (err) {
      alert('Error deleting material: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal({ show: false, material: null });
  };

  const handleExportToExcel = () => {
    const exportData = filteredMaterials.map(material => ({
      'ID': material.id,
      'Material': material.material,
      'Specification': material.material_specification,
      'Density': material.density,
      'Material Cost': material.material_cost
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const columnWidths = [
      { wch: 10 },
      { wch: 20 },
      { wch: 30 },
      { wch: 15 },
      { wch: 20 }
    ];
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SheetMetal_Materials');

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `SheetMetal_Materials_${timestamp}.xlsx`;

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

        // Process and upload data (adjust based on your bulk upload endpoint)
        alert('Import functionality - please implement bulk upload endpoint');
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

  // Pagination
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

  // if (error) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <div className="text-red-600">Error: {error}</div>
  //     </div>
  //   );
  // }

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
        <h2 className="text-2xl font-bold text-gray-800">Sheet Metal Materials </h2>
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
          {/* <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Overview</span>
          </button> */}
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
        {/* <p className="text-sm text-gray-600 mt-2">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredMaterials.length)} of {filteredMaterials.length} materials
        </p> */}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#246679] text-white">
              <tr>
                {/* <th className="px-6 py-3 text-left text-sm font-semibold">ID</th> */}
                <th className="px-6 py-3 text-left text-sm font-semibold">Material</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Specification</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Density</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Material Cost</th>
                {isAdmin && (
                  <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50">
                    {/* <td className="px-6 py-4 text-sm text-gray-700">{material.id}</td> */}
                    <td className="px-6 py-4 text-sm text-gray-700">{material.material}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{material.material_specification}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{material.density}</td>
                    <td className="px-6 py-4 text-sm">
                      {isAdmin && editingId === material.id ? (
                        <input
                          type="number"
                          value={editedCost}
                          onChange={(e) => setEditedCost(e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                        />
                      ) : (
                        <span className="text-gray-700">{material.material_cost}</span>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-sm">
                        {editingId === material.id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUpdate(material)}
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
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(material)}
                              className="flex items-center space-x-1 px-3 py-1 bg-[#246679] text-white rounded hover:bg-[#1f5766] transition-colors duration-200"
                            >
                              <Pencil className="w-4 h-4" />
                              <span>Update</span>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(material)}
                              className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete</span>
                            </button>
                          </div>
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
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Previous
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
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {!isAdmin && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update material costs.
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

      {/* Delete Confirmation Modal */}
      {deleteModal.show && deleteModal.material && (
        <DeleteConfirmationModal
          material={deleteModal.material}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default SheetMetalComponent;