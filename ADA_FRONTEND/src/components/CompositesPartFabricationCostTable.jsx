import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit2, Save, X, Download, Search, Plus, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import CompositesPartFabricationHours from './CompositesPartFabricationHours';
import CompositesPartFabricationLayupHours from './CompositesPartFabricationLayupHours';

// Add Part Fabrication Cost Modal
const AddPartFabricationCostModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    extra_prepreg_weight_percent: '',
    consumable_cost_percent: '',
    layup_cost_per_hr: '',
    autoclave_curing_cost_per_hr: '',
    trimming_inspection_cost_per_hr: '',
    ndts_cost_per_hr: ''
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
    
    if (!formData.extra_prepreg_weight_percent || !formData.layup_cost_per_hr) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      
      const payload = {
        extra_prepreg_weight_percent: parseFloat(formData.extra_prepreg_weight_percent),
        consumable_cost_percent: parseFloat(formData.consumable_cost_percent) || 0,
        layup_cost_per_hr: parseFloat(formData.layup_cost_per_hr),
        autoclave_curing_cost_per_hr: parseFloat(formData.autoclave_curing_cost_per_hr) || 0,
        trimming_inspection_cost_per_hr: parseFloat(formData.trimming_inspection_cost_per_hr) || 0,
        ndts_cost_per_hr: parseFloat(formData.ndts_cost_per_hr) || 0
      };

      const response = await fetch('http://172.18.100.156:8004/composites/part-fabrication-cost/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add part fabrication cost');
      }

      alert('Part Fabrication Cost added successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      alert('Error adding part fabrication cost: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const fieldConfigs = [
    { key: 'extra_prepreg_weight_percent', label: 'Extra Prepreg Weight (%)', type: 'number', required: true },
    { key: 'consumable_cost_percent', label: 'Consumable Cost (%)', type: 'number' },
    { key: 'layup_cost_per_hr', label: 'Layup Cost (₹/hr)', type: 'number', required: true },
    { key: 'autoclave_curing_cost_per_hr', label: 'Autoclave Curing Cost (₹/hr)', type: 'number' },
    { key: 'trimming_inspection_cost_per_hr', label: 'Trimming Inspection Cost (₹/hr)', type: 'number' },
    { key: 'ndts_cost_per_hr', label: 'NDTS Cost (₹/hr)', type: 'number' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Add New Part Fabrication Cost</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fieldConfigs.map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.required && <span className="text-red-500">*</span>} {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder="0"
                  value={formData[field.key]}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                  required={field.required}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200 disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add Part Fabrication Cost'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmationModal = ({ item, onConfirm, onCancel, isDeleting }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Delete Part Fabrication Cost</h2>
      </div>
      
      <div className="px-6 py-6">
        <p className="text-gray-700 mb-4">
          Are you sure you want to delete this part fabrication cost record?
        </p>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>ID:</strong> {item.id}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Layup Cost:</strong> ₹{item.layup_cost_per_hr}/hr
          </p>
        </div>
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
          <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
        </button>
      </div>
    </div>
  </div>
);

// Main Part Fabrication Cost Table Component
const CompositesPartFabricationCostTable = ({ onBack }) => {
  const [costs, setCosts] = useState([]);
  const [filteredCosts, setFilteredCosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [updating, setUpdating] = useState(false);
  const [correctionFactors, setCorrectionFactors] = useState([]);
  const [editingCorrectionId, setEditingCorrectionId] = useState(null);
  const [editedCorrection, setEditedCorrection] = useState('');
  const [updatingCorrection, setUpdatingCorrection] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [deleteModal, setDeleteModal] = useState({ show: false, item: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const fieldConfigs = [
    { key: 'extra_prepreg_weight_percent', label: 'Extra Prepreg Weight (%)', type: 'number' },
    { key: 'consumable_cost_percent', label: 'Consumable Cost (%)', type: 'number' },
    { key: 'layup_cost_per_hr', label: 'Layup Cost (₹/hr)', type: 'number' },
    { key: 'autoclave_curing_cost_per_hr', label: 'Autoclave Curing (₹/hr)', type: 'number' },
    { key: 'trimming_inspection_cost_per_hr', label: 'Trimming Inspection (₹/hr)', type: 'number' },
    { key: 'ndts_cost_per_hr', label: 'NDTS Cost (₹/hr)', type: 'number' }
  ];

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    setUserRole(userData.role || '');
    fetchCosts();
    fetchCorrectionFactors();
  }, []);

  useEffect(() => {
    const filtered = costs.filter(cost =>
      cost.id.toString().includes(searchTerm) ||
      cost.layup_cost_per_hr.toString().includes(searchTerm)
    );
    setFilteredCosts(filtered);
    setCurrentPage(1);
  }, [costs, searchTerm]);

  const fetchCosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://172.18.100.156:8004/composites/part-fabrication-cost/');
      if (!response.ok) throw new Error('Failed to fetch part fabrication costs');
      const data = await response.json();
      const costsList = data.data || data;
      setCosts(costsList);
      setFilteredCosts(costsList);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCorrectionFactors = async () => {
    try {
      const response = await fetch('http://172.18.100.156:8004/composites/part-fabrication-correction-factor/');
      if (!response.ok) throw new Error('Failed to fetch correction factors');
      const data = await response.json();
      setCorrectionFactors(Array.isArray(data) ? data : []);
    } catch (err) {
      setCorrectionFactors([]);
    }
  };

  const handleEdit = (cost) => {
    setEditingId(cost.id);
    const editData = {};
    fieldConfigs.forEach(field => {
      editData[field.key] = cost[field.key];
    });
    setEditedData(editData);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedData({});
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value === '' ? '' : parseFloat(value)
    }));
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      
      const payload = {
        ...editedData,
        id: editingId
      };

      const response = await fetch('http://172.18.100.156:8004/composites/part-fabrication-cost/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to update part fabrication cost');
      
      setCosts(prev => {
        const index = prev.findIndex(m => m.id === editingId);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = { ...prev[index], ...editedData };
          return updated;
        }
        return prev;
      });
      
      setEditingId(null);
      setEditedData({});
      alert('Part Fabrication Cost updated successfully!');
    } catch (err) {
      alert('Error updating part fabrication cost: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = (cost) => {
    setDeleteModal({ show: true, item: cost });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.item) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`http://172.18.100.156:8004/composites/part-fabrication-cost/${deleteModal.item.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to delete part fabrication cost');

      alert('Part Fabrication Cost deleted successfully!');
      setDeleteModal({ show: false, item: null });
      fetchCosts();
    } catch (err) {
      alert('Error deleting part fabrication cost: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal({ show: false, item: null });
  };

  const handleExportToExcel = () => {
    const exportData = filteredCosts.map(cost => {
      const row = { id: cost.id };
      fieldConfigs.forEach(field => {
        row[field.label] = cost[field.key];
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Part Fabrication Costs');

    const timestamp = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `PartFabricationCost_${timestamp}.xlsx`);
  };

  const handleEditCorrection = (row) => {
    setEditingCorrectionId(row.id);
    setEditedCorrection(row.correction);
  };

  const handleCancelCorrection = () => {
    setEditingCorrectionId(null);
    setEditedCorrection('');
  };

  const handleUpdateCorrection = async () => {
    try {
      setUpdatingCorrection(true);

      const formData = new FormData();
      formData.append('correction', editedCorrection);

      const response = await fetch('http://172.18.100.156:8004/composites/part-fabrication-correction-factor/update/', {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to update correction factor');
      }

      alert('Correction factor updated successfully!');
      handleCancelCorrection();
      fetchCorrectionFactors();
    } catch (err) {
      alert('Error updating correction factor: ' + err.message);
    } finally {
      setUpdatingCorrection(false);
    }
  };

  const isAdmin = userRole.toLowerCase() === 'admin';
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCosts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCosts.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
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
        <div className="text-gray-600">Loading part fabrication costs...</div>
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
        <h2 className="text-2xl font-bold text-gray-800">Composite Part Fabrication Cost</h2>
        <div className="flex items-center space-x-3">
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Create Part Fabrication</span>
            </button>
          )}
          <button
            onClick={handleExportToExcel}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID or cost..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#246679] text-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">ID</th>
                {fieldConfigs.map(field => (
                  <th key={field.key} className="px-4 py-3 text-left font-semibold whitespace-nowrap">{field.label}</th>
                ))}
                {isAdmin && <th className="px-4 py-3 text-left font-semibold">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((cost) => (
                  <tr key={cost.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{cost.id}</td>
                    {fieldConfigs.map(field => (
                      <td key={field.key} className="px-4 py-3 text-gray-700">
                        {isAdmin && editingId === cost.id ? (
                          <input
                            type={field.type}
                            value={editedData[field.key] || ''}
                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                          />
                        ) : (
                          <span>{cost[field.key]}</span>
                        )}
                      </td>
                    ))}
                    {isAdmin && (
                      <td className="px-4 py-3">
                        {editingId === cost.id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={handleUpdate}
                              disabled={updating}
                              className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                            >
                              <Save className="w-4 h-4" />
                              Save
                            </button>
                            <button
                              onClick={handleCancel}
                              disabled={updating}
                              className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(cost)}
                              className="flex items-center space-x-1 px-3 py-1 bg-[#246679] text-white rounded hover:bg-[#1f5766] text-xs"
                            >
                              <Edit2 className="w-4 h-4" />
                              Update
                            </button>
                            <button
                              onClick={() => handleDeleteClick(cost)}
                              className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={fieldConfigs.length + (isAdmin ? 2 : 1)} className="px-4 py-8 text-center text-gray-500">
                    No part fabrication costs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredCosts.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCosts.length)} of {filteredCosts.length}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && paginate(page)}
                  disabled={page === '...'}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-[#246679] text-white border-[#246679]'
                      : page === '...'
                      ? 'border-gray-300 cursor-default'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {!isAdmin && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can edit.
          </p>
        </div>
      )}

      {showAddModal && (
        <AddPartFabricationCostModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchCosts}
        />
      )}

      {deleteModal.show && deleteModal.item && (
        <DeleteConfirmationModal
          item={deleteModal.item}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isDeleting={isDeleting}
        />
      )}

      {/* Part Fabrication Hours Table */}
      <div className="mt-8 pt-8">
        <CompositesPartFabricationHours onBack={onBack} />
      </div>

      {/* Part Fabrication Layup Hours Table */}
      <div className="mt-8 pt-8">
        <CompositesPartFabricationLayupHours onBack={onBack} />
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Correction Factor</h3>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#246679] text-white">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Correction</th>
                  {isAdmin && <th className="px-6 py-3 text-left font-semibold">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {correctionFactors.length > 0 ? (
                  correctionFactors.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-700">
                        {isAdmin && editingCorrectionId === row.id ? (
                          <input
                            type="number"
                            step="0.0001"
                            value={editedCorrection}
                            onChange={(e) => setEditedCorrection(e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                          />
                        ) : (
                          <span>{row.correction}</span>
                        )}
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 text-sm">
                          {editingCorrectionId === row.id ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={handleUpdateCorrection}
                                disabled={updatingCorrection}
                                className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                              >
                                <Save className="w-4 h-4" />
                                <span>{updatingCorrection ? 'Saving...' : 'Save'}</span>
                              </button>
                              <button
                                onClick={handleCancelCorrection}
                                disabled={updatingCorrection}
                                className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
                              >
                                <X className="w-4 h-4" />
                                <span>Cancel</span>
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditCorrection(row)}
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
                    <td colSpan={isAdmin ? 2 : 1} className="px-6 py-8 text-center text-gray-500">
                      No correction factors found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompositesPartFabricationCostTable;