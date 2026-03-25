import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, Edit2, Loader, Download, Plus, Search } from 'lucide-react';
import * as XLSX from 'xlsx';

const SheetMetalMachineRate = ({ onBack }) => {
  const [machineRates, setMachineRates] = useState([]);
  const [filteredMachineRates, setFilteredMachineRates] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [updating, setUpdating] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newRowData, setNewRowData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  

  const API_BASE_URL = 'http://172.18.100.156:8004';

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    setUserRole(userData.role || '');
    fetchMachineRates();
    fetchMaterials();
  }, []);

  // Filter machine rates based on search term
  useEffect(() => {
    const filtered = machineRates.filter(rate =>
      rate.material.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMachineRates(filtered);
    setCurrentPage(1);
  }, [machineRates, searchTerm]);

  const fetchMachineRates = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/sheetmetal-machine-hour-rates`);
      if (!response.ok) throw new Error('Failed to fetch machine rates');
      const result = await response.json();

      if (result.success) {
        // Sort by id in ascending order
        const sortedData = [...result.data].sort((a, b) => a.id - b.id);
        setMachineRates(sortedData);
        setFilteredMachineRates(sortedData);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sheetmetal-materials`);
      if (!response.ok) throw new Error('Failed to fetch materials');
      const result = await response.json();
      if (result.success) {
        setMaterials(result.data);
      }
    } catch (err) {
      console.error('Error fetching materials:', err);
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setEditData({
      material: row.material,
      machine_type: row.machine_type,
      old_size: row.size,
      new_size: row.size,
      hourly_rate: row.hourly_rate
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleFieldChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: field === 'hourly_rate' ? parseFloat(value) : value
    }));
  };

  const handleUpdate = async () => {
    if (!editData.hourly_rate || editData.hourly_rate <= 0) {
      alert('Please enter a valid hourly rate');
      return;
    }

    try {
      setUpdating(true);
      const formData = new URLSearchParams();
      formData.append('material', editData.material);
      formData.append('machine_type', editData.machine_type);
      formData.append('old_size', editData.old_size);
      formData.append('new_size', editData.new_size);
      formData.append('hourly_rate', editData.hourly_rate);

      const response = await fetch(`${API_BASE_URL}/sheetmetal-machine-hour-rates/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'accept': 'application/json'
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update machine rate');
      }

      const result = await response.json();
      if (result.success) {
        alert('Machine rate updated successfully!');
        await fetchMachineRates();
        setEditingId(null);
        setEditData({});
      } else {
        throw new Error(result.error || 'Update failed');
      }
    } catch (err) {
      alert(`Error updating rate: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  // Add new machine rate functions
  const startAddingNew = () => {
    setIsAddingNew(true);
    setNewRowData({
      material: '',
      machine_type: '3 Axis',
      size: '',
      hourly_rate: 0
    });
  };

  const cancelAddingNew = () => {
    setIsAddingNew(false);
    setNewRowData({});
  };

  const handleNewRowChange = (field, value) => {
    setNewRowData(prev => ({
      ...prev,
      [field]: field === 'hourly_rate' 
        ? parseFloat(value) || 0
        : value
    }));
  };

  const saveNewMachineRate = async () => {
    if (!newRowData.material || !newRowData.machine_type || !newRowData.size || newRowData.hourly_rate <= 0) {
      alert('Please fill all fields with valid values');
      return;
    }

    try {
      setUpdating(true);
      const formData = new URLSearchParams();
      formData.append('material', newRowData.material);
      formData.append('machine_type', newRowData.machine_type);
      formData.append('size', newRowData.size);
      formData.append('hourly_rate', newRowData.hourly_rate);

      const response = await fetch(`${API_BASE_URL}/sheetmetal-machine-hour-rates/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'accept': 'application/json'
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add machine rate');
      }

      const result = await response.json();
      if (result.success) {
        alert('New machine rate added successfully!');
        await fetchMachineRates();
        setIsAddingNew(false);
        setNewRowData({});
      } else {
        throw new Error(result.error || 'Add failed');
      }
    } catch (err) {
      alert(`Error adding machine rate: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleExportToExcel = () => {
    const exportData = filteredMachineRates.map(rate => ({
      'ID': rate.id,
      'Material': rate.material,
      'Machine Type': rate.machine_type,
      'Size': rate.size,
      'Hourly Rate (₹)': rate.hourly_rate
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const columnWidths = [
      { wch: 8 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 18 }
    ];
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SheetMetal_Machine_Rates');

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `SheetMetal_Machine_Rates_${timestamp}.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMachineRates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMachineRates.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const isAdmin = userRole.toLowerCase() === 'admin';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-[#246679] animate-spin" />
        <span className="ml-3 text-gray-600">Loading machine rates...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error Loading Data</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchMachineRates}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
               {onBack && (
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Overview</span>
            </button>
          )}
        <h2 className="text-2xl font-bold text-gray-800">Sheet Metal Machine Rates Configuration</h2>
        <div className="flex items-center space-x-3">
          {isAdmin && (
            <button
              onClick={startAddingNew}
              disabled={isAddingNew}
              className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>Add Machine Rates</span>
            </button>
          )}
          <button
            onClick={handleExportToExcel}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Export to Excel</span>
          </button>
          {/* {onBack && (
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Overview</span>
            </button>
          )} */}
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#246679]">
          <p className="text-gray-600 text-sm">Total Records</p>
          <p className="text-2xl font-bold text-gray-800">{filteredMachineRates.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#2a7589]">
          <p className="text-gray-600 text-sm">3 Axis Machines</p>
          <p className="text-2xl font-bold text-gray-800">
            {filteredMachineRates.filter(r => r.machine_type === '3 Axis').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#2d8599]">
          <p className="text-gray-600 text-sm">4 Axis Machines</p>
          <p className="text-2xl font-bold text-gray-800">
            {filteredMachineRates.filter(r => r.machine_type === '4 Axis').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#327a8d]">
          <p className="text-gray-600 text-sm">5 Axis Machines</p>
          <p className="text-2xl font-bold text-gray-800">
            {filteredMachineRates.filter(r => r.machine_type === '5 Axis').length}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by material name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679] focus:border-transparent"
          />
        </div>
        {/* <p className="text-sm text-gray-600 mt-2">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredMachineRates.length)} of {filteredMachineRates.length} machine rates
        </p> */}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#246679] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Material</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Machine Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Hourly Rate (₹)</th>
                {isAdmin && (
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* New Row Form */}
              {isAddingNew && (
                <tr className="bg-green-50 border-2 border-green-300">
                  <td className="px-6 py-4">
                    <select
                      value={newRowData.material}
                      onChange={(e) => handleNewRowChange('material', e.target.value)}
                      className="w-full px-2 py-1.5 border border-green-400 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    >
                      <option value="">Select Material</option>
                      {materials.map(mat => (
                        <option key={mat.id} value={mat.material}>{mat.material}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={newRowData.machine_type}
                      onChange={(e) => handleNewRowChange('machine_type', e.target.value)}
                      className="w-full px-2 py-1.5 border border-green-400 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    >
                      <option value="3 Axis">3 Axis</option>
                      <option value="4 Axis">4 Axis</option>
                      <option value="5 Axis">5 Axis</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={newRowData.size}
                      onChange={(e) => handleNewRowChange('size', e.target.value)}
                      placeholder="e.g., 3000*1500*800"
                      className="w-full px-2 py-1.5 border border-green-400 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={newRowData.hourly_rate}
                      onChange={(e) => handleNewRowChange('hourly_rate', e.target.value)}
                      placeholder="Enter rate"
                      className="w-full px-2 py-1.5 border border-green-400 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={saveNewMachineRate}
                        disabled={updating}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {updating ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>Save</span>
                      </button>
                      <button
                        onClick={cancelAddingNew}
                        disabled={updating}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* Existing Machine Rates */}
              {currentItems.length > 0 ? (
                currentItems.map((row, index) => (
                  <tr
                    key={`rate-${row.id}`}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors ${
                      editingId === row.id ? 'bg-blue-100' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="font-semibold text-[#246679]">{row.material}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          row.machine_type === '5 Axis'
                            ? 'bg-green-100 text-green-800'
                            : row.machine_type === '4 Axis'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {row.machine_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {isAdmin && editingId === row.id ? (
                        <input
                          type="text"
                          value={editData.new_size}
                          onChange={(e) => handleFieldChange('new_size', e.target.value)}
                          className="w-full px-2 py-1.5 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                        />
                      ) : (
                        <span className="text-gray-900">{row.size}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {isAdmin && editingId === row.id ? (
                        <input
                          type="number"
                          value={editData.hourly_rate}
                          onChange={(e) => handleFieldChange('hourly_rate', e.target.value)}
                          className="w-32 px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#246679]"
                          disabled={updating}
                        />
                      ) : (
                        <span className="font-semibold text-gray-900">₹{row.hourly_rate.toLocaleString()}</span>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {editingId === row.id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={handleUpdate}
                              disabled={updating}
                              className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                              {updating ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              <span>Save</span>
                            </button>
                            <button
                              onClick={handleCancel}
                              disabled={updating}
                              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50"
                            >
                              <X className="w-4 h-4" />
                              <span>Cancel</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEdit(row)}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-[#246679] text-white rounded-md hover:bg-[#1f5766] transition-colors"
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
                  <td colSpan={isAdmin ? 5 : 4} className="px-6 py-8 text-center text-gray-500">
                    No machine rates found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredMachineRates.length > itemsPerPage && (
        <div className="mt-4 flex items-center justify-between bg-white rounded-lg shadow-md px-6 py-4">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredMachineRates.length)} of {filteredMachineRates.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* First page */}
            {currentPage > 2 && (
              <>
                <button
                  onClick={() => paginate(1)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
                >
                  1
                </button>
                {currentPage > 3 && <span className="px-2 text-gray-500">...</span>}
              </>
            )}
            
            {/* Previous page */}
            {currentPage > 1 && (
              <button
                onClick={() => paginate(currentPage - 1)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
              >
                {currentPage - 1}
              </button>
            )}
            
            {/* Current page */}
            <button
              className="px-4 py-2 rounded bg-[#246679] text-white font-semibold"
            >
              {currentPage}
            </button>
            
            {/* Next page */}
            {currentPage < totalPages && (
              <button
                onClick={() => paginate(currentPage + 1)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
              >
                {currentPage + 1}
              </button>
            )}
            
            {/* Last page */}
            {currentPage < totalPages - 1 && (
              <>
                {currentPage < totalPages - 2 && <span className="px-2 text-gray-500">...</span>}
                <button
                  onClick={() => paginate(totalPages)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
                >
                  {totalPages}
                </button>
              </>
            )}
            
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {!isAdmin && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update machine rates.
          </p>
        </div>
      )}
    </div>
  );
};

export default SheetMetalMachineRate;