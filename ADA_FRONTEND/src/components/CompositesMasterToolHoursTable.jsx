import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit2, Save, X, Download, Search, Plus, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';

// Add Master Tool Hours Modal
const AddMasterToolHoursModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    volume_range_m3: '',
    design_hours: '',
    machining_hours: '',
    assembly_hours: '',
    finishing_hours: '',
    inspection_hours: ''
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
    
    if (!formData.volume_range_m3 || !formData.design_hours) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      
      const payload = {
        volume_range_m3: formData.volume_range_m3,
        design_hours: parseFloat(formData.design_hours),
        machining_hours: parseFloat(formData.machining_hours) || 0,
        assembly_hours: parseFloat(formData.assembly_hours) || 0,
        finishing_hours: parseFloat(formData.finishing_hours) || 0,
        inspection_hours: parseFloat(formData.inspection_hours) || 0
      };

      const response = await fetch('http://172.18.100.156:8004/composites/master-tool-hours/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add master tool hours');
      }

      alert('Master Tool Hours added successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      alert('Error adding master tool hours: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const fieldConfigs = [
    { key: 'volume_range_m3', label: 'Volume Range (m³)', type: 'text', required: true },
    { key: 'design_hours', label: 'Design Hours', type: 'number', required: true },
    { key: 'machining_hours', label: 'Machining Hours', type: 'number' },
    { key: 'assembly_hours', label: 'Assembly Hours', type: 'number' },
    { key: 'finishing_hours', label: 'Finishing Hours', type: 'number' },
    { key: 'inspection_hours', label: 'Inspection Hours', type: 'number' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Add New Master Tool Hours</h2>
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
                  placeholder={field.type === 'text' ? 'e.g., 4-10' : '0'}
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
              {submitting ? 'Adding...' : 'Add Master Tool Hours'}
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
        <h2 className="text-xl font-bold text-gray-800">Delete Master Tool Hours</h2>
      </div>
      
      <div className="px-6 py-6">
        <p className="text-gray-700 mb-4">
          Are you sure you want to delete this master tool hours record?
        </p>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>ID:</strong> {item.id}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Volume Range:</strong> {item.volume_range_m3} m³
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

// Main Master Tool Hours Table Component
const CompositesMasterToolHoursTable = ({ onBack }) => {
  const [hours, setHours] = useState([]);
  const [filteredHours, setFilteredHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [updating, setUpdating] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [deleteModal, setDeleteModal] = useState({ show: false, item: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const fieldConfigs = [
    { key: 'volume_range_m3', label: 'Volume Range (m³)', type: 'text' },
    { key: 'design_hours', label: 'Design Hours', type: 'number' },
    { key: 'machining_hours', label: 'Machining Hours', type: 'number' },
    { key: 'assembly_hours', label: 'Assembly Hours', type: 'number' },
    { key: 'finishing_hours', label: 'Finishing Hours', type: 'number' },
    { key: 'inspection_hours', label: 'Inspection Hours', type: 'number' }
  ];

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    setUserRole(userData.role || '');
    fetchHours();
  }, []);

  useEffect(() => {
    const filtered = hours.filter(hour =>
      hour.id.toString().includes(searchTerm) ||
      hour.volume_range_m3.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHours(filtered);
    setCurrentPage(1);
  }, [hours, searchTerm]);

  const fetchHours = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://172.18.100.156:8004/composites/master-tool-hours/');
      if (!response.ok) throw new Error('Failed to fetch master tool hours');
      const data = await response.json();
      const hoursList = data.data || data;
      setHours(hoursList);
      setFilteredHours(hoursList);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hour) => {
    setEditingId(hour.id);
    const editData = {};
    fieldConfigs.forEach(field => {
      editData[field.key] = hour[field.key];
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
      [field]: field === 'volume_range_m3' ? value : (value === '' ? '' : parseFloat(value))
    }));
  };

//   const handleUpdate = async () => {
//     try {
//       setUpdating(true);
      
//       const payload = {
//         ...editedData,
//         id: editingId
//       };

//       const response = await fetch('http://172.18.100.156:8004/composites/master-tool-hours/update-range/', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'accept': 'application/json'
//         },
//         body: JSON.stringify(payload)
//       });

//       if (!response.ok) throw new Error('Failed to update master tool hours');
      
//       setHours(prev => {
//         const index = prev.findIndex(m => m.id === editingId);
//         if (index !== -1) {
//           const updated = [...prev];
//           updated[index] = { ...prev[index], ...editedData };
//           return updated;
//         }
//         return prev;
//       });
      
//       setEditingId(null);
//       setEditedData({});
//       alert('Master Tool Hours updated successfully!');
//     } catch (err) {
//       alert('Error updating master tool hours: ' + err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };


// Replace the handleUpdate function with this corrected version:

const handleUpdate = async () => {
  try {
    setUpdating(true);
    
    // Find the original hour record to get the old volume_range_m3
    const originalHour = hours.find(h => h.id === editingId);
    
    if (!originalHour) {
      alert('Original record not found');
      setUpdating(false);
      return;
    }

    const payload = {
      old_volume_range_m3: originalHour.volume_range_m3,
      new_volume_range_m3: editedData.volume_range_m3,
      design_hours: editedData.design_hours,
      machining_hours: editedData.machining_hours,
      assembly_hours: editedData.assembly_hours,
      finishing_hours: editedData.finishing_hours,
      inspection_hours: editedData.inspection_hours
    };

    const response = await fetch('http://172.18.100.156:8004/composites/master-tool-hours/update-range/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to update master tool hours');
    }
    
    // Update local state
    setHours(prev => {
      const index = prev.findIndex(m => m.id === editingId);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = { 
          ...prev[index], 
          ...editedData 
        };
        return updated;
      }
      return prev;
    });
    
    setEditingId(null);
    setEditedData({});
    alert('Master Tool Hours updated successfully!');
  } catch (err) {
    alert('Error updating master tool hours: ' + err.message);
  } finally {
    setUpdating(false);
  }
};

  const handleDeleteClick = (hour) => {
    setDeleteModal({ show: true, item: hour });
  };

 // Replace the handleConfirmDelete function with this corrected version:

const handleConfirmDelete = async () => {
  if (!deleteModal.item) return;

  try {
    setIsDeleting(true);
    
    // Get the volume_range from the item to use in the URL
    const volumeRange = deleteModal.item.volume_range_m3;
    
    const response = await fetch(`http://172.18.100.156:8004/composites/master-tool-hours/${volumeRange}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to delete master tool hours');
    }

    alert('Master Tool Hours deleted successfully!');
    setDeleteModal({ show: false, item: null });
    fetchHours();
  } catch (err) {
    alert('Error deleting master tool hours: ' + err.message);
  } finally {
    setIsDeleting(false);
  }
};
  const handleCancelDelete = () => {
    setDeleteModal({ show: false, item: null });
  };

  const handleExportToExcel = () => {
    const exportData = filteredHours.map(hour => {
      const row = { id: hour.id };
      fieldConfigs.forEach(field => {
        row[field.label] = hour[field.key];
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Master Tool Hours');

    const timestamp = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `MasterToolHours_${timestamp}.xlsx`);
  };

  const isAdmin = userRole.toLowerCase() === 'admin';
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHours.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHours.length / itemsPerPage);

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
        <div className="text-gray-600">Loading master tool hours...</div>
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
        {/* <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </button> */}
        <h2 className="text-2xl font-bold text-gray-800">Composite Master Tool Hours</h2>
        <div className="flex items-center space-x-3">
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Create Master Tool Hours</span>
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
            placeholder="Search by ID or volume range..."
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
                currentItems.map((hour) => (
                  <tr key={hour.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{hour.id}</td>
                    {fieldConfigs.map(field => (
                      <td key={field.key} className="px-4 py-3 text-gray-700">
                        {isAdmin && editingId === hour.id ? (
                          <input
                            type={field.type}
                            value={editedData[field.key] || ''}
                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                          />
                        ) : (
                          <span>{hour[field.key]}</span>
                        )}
                      </td>
                    ))}
                    {isAdmin && (
                      <td className="px-4 py-3">
                        {editingId === hour.id ? (
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
                              onClick={() => handleEdit(hour)}
                              className="flex items-center space-x-1 px-3 py-1 bg-[#246679] text-white rounded hover:bg-[#1f5766] text-xs"
                            >
                              <Edit2 className="w-4 h-4" />
                              Update
                            </button>
                            <button
                              onClick={() => handleDeleteClick(hour)}
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
                    No master tool hours found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredHours.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredHours.length)} of {filteredHours.length}
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
        <AddMasterToolHoursModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchHours}
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
    </div>
  );
};

export default CompositesMasterToolHoursTable;