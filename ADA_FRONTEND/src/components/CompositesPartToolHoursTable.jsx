import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Edit2, Save, X, Download, Upload, Search, Plus, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';

// Add Part Tool Hours Modal Component
const AddPartToolHoursModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    volume_range_m3: '',
    curing_hours: '',
    trimming_inspection_hours: ''
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
    
    if (!formData.volume_range_m3 || !formData.curing_hours || !formData.trimming_inspection_hours) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      
      const payload = {
        volume_range_m3: formData.volume_range_m3,
        curing_hours: parseFloat(formData.curing_hours),
        trimming_inspection_hours: parseFloat(formData.trimming_inspection_hours)
      };

      const response = await fetch('http://172.18.100.156:8004/composites/part-tool-hours/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add part tool hours');
      }

      alert('Part tool hours added successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      alert('Error adding part tool hours: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Add Part Tool Hours</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Part Tool Hours Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="text-red-500">*</span> Volume Range (m³)
                </label>
                <input
                  type="text"
                  placeholder="e.g., 4-6"
                  value={formData.volume_range_m3}
                  onChange={(e) => handleInputChange('volume_range_m3', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="text-red-500">*</span> Curing Hours
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 0"
                  value={formData.curing_hours}
                  onChange={(e) => handleInputChange('curing_hours', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="text-red-500">*</span> Trimming & Inspection Hours
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 0"
                  value={formData.trimming_inspection_hours}
                  onChange={(e) => handleInputChange('trimming_inspection_hours', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                  required
                />
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
              {submitting ? 'Adding...' : 'Add Part Tool Hours'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmationModal = ({ partToolHours, onConfirm, onCancel, isDeleting }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Delete Part Tool Hours</h2>
      </div>
      
      <div className="px-6 py-6">
        <p className="text-gray-700 mb-4">
          Are you sure you want to delete this part tool hours entry?
        </p>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Volume Range:</strong> {partToolHours.volume_range_m3}
          </p>
          <p className="text-sm text-gray-700 mb-2">
            <strong>Curing Hours:</strong> {partToolHours.curing_hours}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Trimming & Inspection Hours:</strong> {partToolHours.trimming_inspection_hours}
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

// Main Part Tool Hours Table Component
const CompositesPartToolHoursTable = ({ onBack }) => {
  const [partToolHours, setPartToolHours] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
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
  const [itemsPerPage] = useState(10);
  const [deleteModal, setDeleteModal] = useState({ show: false, data: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    setUserRole(userData.role || '');
    fetchPartToolHours();
  }, []);

  useEffect(() => {
    const filtered = partToolHours.filter(item =>
      item.volume_range_m3.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [partToolHours, searchTerm]);

  const fetchPartToolHours = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://172.18.100.156:8004/composites/part-tool-hours/');
      if (!response.ok) throw new Error('Failed to fetch part tool hours');
      const result = await response.json();
      const sortedData = [...result.data].sort((a, b) => a.id - b.id);
      setPartToolHours(sortedData);
      setFilteredData(sortedData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditedData({
      old_volume_range_m3: item.volume_range_m3,
      new_volume_range_m3: item.volume_range_m3,
      curing_hours: item.curing_hours,
      trimming_inspection_hours: item.trimming_inspection_hours
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedData({});
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: field === 'curing_hours' || field === 'trimming_inspection_hours' ? Number(value) : value
    }));
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const response = await fetch('http://172.18.100.156:8004/composites/part-tool-hours/update-range', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(editedData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail || errorData.error || 'Failed to update part tool hours';
        throw new Error(errorMessage);
      }
      
      alert('Part tool hours updated successfully!');
      setEditingId(null);
      setEditedData({});
      fetchPartToolHours();
    } catch (err) {
      alert('Error updating part tool hours: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = (item) => {
    setDeleteModal({ show: true, data: item });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.data) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`http://172.18.100.156:8004/composites/part-tool-hours/${deleteModal.data.volume_range_m3}`, {
        method: 'DELETE',
        headers: {
          'accept': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to delete part tool hours');

      alert('Part tool hours deleted successfully!');
      setDeleteModal({ show: false, data: null });
      fetchPartToolHours();
    } catch (err) {
      alert('Error deleting part tool hours: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal({ show: false, data: null });
  };

  const handleExportToExcel = () => {
    const exportData = filteredData.map(item => ({
      'Volume Range (m³)': item.volume_range_m3,
      'Curing Hours': item.curing_hours,
      'Trimming & Inspection Hours': item.trimming_inspection_hours
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const columnWidths = [{ wch: 20 }, { wch: 15 }, { wch: 30 }];
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Part Tool Hours');

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `Part_Tool_Hours_${timestamp}.xlsx`;

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

        // Process imported data
        for (const row of jsonData) {
          const payload = {
            volume_range_m3: row['Volume Range (m³)'],
            curing_hours: Number(row['Curing Hours']),
            trimming_inspection_hours: Number(row['Trimming & Inspection Hours'])
          };

          await fetch('http://172.18.100.156:8004/composites/part-tool-hours/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'accept': 'application/json'
            },
            body: JSON.stringify(payload)
          });
        }

        alert('Part tool hours imported successfully!');
        fetchPartToolHours();
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
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
        <div className="text-gray-600">Loading part tool hours...</div>
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
        <h2 className="text-2xl font-bold text-gray-800">Composites Part Tool Hours</h2>
        <div className="flex items-center space-x-3">
          {isAdmin && (
            <>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add Part Tool Hours</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportExcel}
                accept=".xlsx, .xls"
                className="hidden"
              />
              {/* <button
                onClick={triggerFileInput}
                disabled={uploading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>{uploading ? 'Uploading...' : 'Import Excel'}</span>
              </button> */}
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
            placeholder="Search by volume range..."
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
                <th className="px-6 py-3 text-left text-sm font-semibold">Volume Range (m³)</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Curing Hours</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Trimming & Inspection Hours</th>
                {isAdmin && (
                  <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">
                      {isAdmin && editingId === item.id ? (
                        <input
                          type="text"
                          value={editedData.new_volume_range_m3}
                          onChange={(e) => handleInputChange('new_volume_range_m3', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                        />
                      ) : (
                        <span className="text-gray-700">{item.volume_range_m3}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {isAdmin && editingId === item.id ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editedData.curing_hours}
                          onChange={(e) => handleInputChange('curing_hours', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                        />
                      ) : (
                        <span className="text-gray-700">{item.curing_hours}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {isAdmin && editingId === item.id ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editedData.trimming_inspection_hours}
                          onChange={(e) => handleInputChange('trimming_inspection_hours', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                        />
                      ) : (
                        <span className="text-gray-700">{item.trimming_inspection_hours}</span>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-sm">
                        {editingId === item.id ? (
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
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="flex items-center space-x-1 px-3 py-1 bg-[#246679] text-white rounded hover:bg-[#1f5766] transition-colors duration-200"
                            >
                              <Edit2 className="w-4 h-4" />
                              <span>Update</span>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(item)}
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
                  <td colSpan={isAdmin ? 4 : 3} className="px-6 py-8 text-center text-gray-500">
                    No part tool hours found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredData.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
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
            <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can add, update, or delete part tool hours.
          </p>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <AddPartToolHoursModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchPartToolHours}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && deleteModal.data && (
        <DeleteConfirmationModal
          partToolHours={deleteModal.data}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default CompositesPartToolHoursTable;