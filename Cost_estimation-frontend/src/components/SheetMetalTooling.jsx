import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, Edit2, Loader, Download, Plus, Search } from 'lucide-react';
import * as XLSX from 'xlsx';

const SheetMetalTooling = ({ onBack }) => {
  const [toolingData, setToolingData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
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

  const API_BASE_URL = 'http://localhost:5678';

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    setUserRole(userData.role || '');
    fetchToolingData();
  }, []);

  // Filter data based on search term
  useEffect(() => {
    const filtered = toolingData.filter(item =>
      item.type_of_tool.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.part_size.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [toolingData, searchTerm]);

  const fetchToolingData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/sheetmetal-tooling-cost`);
      if (!response.ok) throw new Error('Failed to fetch tooling data');
      const result = await response.json();

      if (result.success) {
        const sortedData = [...result.data].sort((a, b) => a.id - b.id);
        setToolingData(sortedData);
        setFilteredData(sortedData);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setEditData({
      part_size: row.part_size,
      number_of_tools: row.number_of_tools,
      design_hours: row.design_hours,
      cost_per_hour: row.cost_per_hour,
      forming_cost_percentage: row.forming_cost_percentage
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleFieldChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: ['design_hours', 'cost_per_hour', 'forming_cost_percentage'].includes(field)
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleUpdate = async () => {
    if (!editData.part_size) {
      alert('Please fill all required fields');
      return;
    }

    // Get the current row to extract type_of_tool
    const currentRow = toolingData.find(row => row.id === editingId);
    if (!currentRow) {
      alert('Error: Could not find the record to update');
      return;
    }

    try {
      setUpdating(true);
      const formData = new URLSearchParams();
      formData.append('type_of_tool', currentRow.type_of_tool);
      formData.append('part_size', editData.part_size);
      formData.append('number_of_tools', editData.number_of_tools);
      formData.append('design_hours', editData.design_hours);
      formData.append('cost_per_hour', editData.cost_per_hour);
      formData.append('forming_cost_percentage', editData.forming_cost_percentage);

      const response = await fetch(`${API_BASE_URL}/sheetmetal-tooling-cost/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'accept': 'application/json'
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update tooling cost');
      }

      const result = await response.json();
      if (result.success) {
        alert('Tooling cost updated successfully!');
        await fetchToolingData();
        setEditingId(null);
        setEditData({});
      } else {
        throw new Error(result.error || 'Update failed');
      }
    } catch (err) {
      alert(`Error updating data: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const startAddingNew = () => {
    setIsAddingNew(true);
    setNewRowData({
      part_size: '',
      type_of_tool: '',
      number_of_tools: '',
      design_hours: 0,
      cost_per_hour: 0,
      forming_cost_percentage: 0
    });
  };

  const cancelAddingNew = () => {
    setIsAddingNew(false);
    setNewRowData({});
  };

  const handleNewRowChange = (field, value) => {
    setNewRowData(prev => ({
      ...prev,
      [field]: ['design_hours', 'cost_per_hour', 'forming_cost_percentage'].includes(field)
        ? parseFloat(value) || 0
        : value
    }));
  };

  const saveNewTooling = async () => {
    if (!newRowData.part_size || !newRowData.type_of_tool || !newRowData.number_of_tools) {
      alert('Please fill all required fields');
      return;
    }

    try {
      setUpdating(true);
      const formData = new URLSearchParams();
      formData.append('part_size', newRowData.part_size);
      formData.append('type_of_tool', newRowData.type_of_tool);
      formData.append('number_of_tools', newRowData.number_of_tools);
      formData.append('design_hours', newRowData.design_hours);
      formData.append('cost_per_hour', newRowData.cost_per_hour);
      formData.append('forming_cost_percentage', newRowData.forming_cost_percentage);

      const response = await fetch(`${API_BASE_URL}/sheetmetal-tooling-cost/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'accept': 'application/json'
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add tooling cost');
      }

      const result = await response.json();
      if (result.success) {
        alert('New tooling cost added successfully!');
        await fetchToolingData();
        setIsAddingNew(false);
        setNewRowData({});
      } else {
        throw new Error(result.error || 'Add failed');
      }
    } catch (err) {
      alert(`Error adding tooling cost: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleExportToExcel = () => {
    const exportData = filteredData.map(item => ({
      'Part Size': item.part_size,
      'Type of Tool': item.type_of_tool,
      'Number of Tools': item.number_of_tools,
      'Design Hours': item.design_hours,
      'Cost Per Hour (₹)': item.cost_per_hour,
      'Forming Cost (%)': item.forming_cost_percentage
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const columnWidths = [
      { wch: 15 }, { wch: 30 }, { wch: 20 }, { wch: 15 }, { wch: 18 }, { wch: 18 }
    ];
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SheetMetal_Tooling');

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `SheetMetal_Tooling_${timestamp}.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
        <span className="ml-3 text-gray-600">Loading tooling data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error Loading Data</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchToolingData}
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
        <h2 className="text-2xl font-bold text-gray-800">Sheet Metal Tooling</h2>
        <div className="flex items-center space-x-3">
          {isAdmin && (
            <button
              onClick={startAddingNew}
              disabled={isAddingNew}
              className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>Add Tooling</span>
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
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} parameters
        </p> */}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#246679] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Part Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type of Tool</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Number of Tools</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Design Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Cost Per Hour (₹)</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Forming Cost (%)</th>
                {isAdmin && (
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* New Row Form */}
              {isAddingNew && (
                <tr className="bg-green-50 border-2 border-green-300">
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={newRowData.part_size}
                      onChange={(e) => handleNewRowChange('part_size', e.target.value)}
                      placeholder="e.g., <500"
                      className="w-full px-2 py-1.5 border border-green-400 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={newRowData.type_of_tool}
                      onChange={(e) => handleNewRowChange('type_of_tool', e.target.value)}
                      placeholder="e.g., Simple Rubber Pad"
                      className="w-full px-2 py-1.5 border border-green-400 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={newRowData.number_of_tools}
                      onChange={(e) => handleNewRowChange('number_of_tools', e.target.value)}
                      placeholder="e.g., 2 No."
                      className="w-full px-2 py-1.5 border border-green-400 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={newRowData.design_hours}
                      onChange={(e) => handleNewRowChange('design_hours', e.target.value)}
                      className="w-full px-2 py-1.5 border border-green-400 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={newRowData.cost_per_hour}
                      onChange={(e) => handleNewRowChange('cost_per_hour', e.target.value)}
                      className="w-full px-2 py-1.5 border border-green-400 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={newRowData.forming_cost_percentage}
                      onChange={(e) => handleNewRowChange('forming_cost_percentage', e.target.value)}
                      className="w-full px-2 py-1.5 border border-green-400 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={saveNewTooling}
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

              {/* Existing Data */}
              {currentItems.length > 0 ? (
                currentItems.map((row, index) => (
                  <tr
                    key={`tooling-${row.id}`}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors ${editingId === row.id ? 'bg-blue-100' : ''
                      }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingId === row.id ? (
                        <input
                          type="text"
                          value={editData.part_size}
                          onChange={(e) => handleFieldChange('part_size', e.target.value)}
                          className="w-full px-2 py-1.5 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                        />
                      ) : (
                        row.part_size
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{row.type_of_tool}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingId === row.id ? (
                        <input
                          type="text"
                          value={editData.number_of_tools}
                          onChange={(e) => handleFieldChange('number_of_tools', e.target.value)}
                          className="w-full px-2 py-1.5 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                        />
                      ) : (
                        row.number_of_tools
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingId === row.id ? (
                        <input
                          type="number"
                          value={editData.design_hours}
                          onChange={(e) => handleFieldChange('design_hours', e.target.value)}
                          className="w-24 px-2 py-1.5 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                        />
                      ) : (
                        row.design_hours
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingId === row.id ? (
                        <input
                          type="number"
                          value={editData.cost_per_hour}
                          onChange={(e) => handleFieldChange('cost_per_hour', e.target.value)}
                          className="w-24 px-2 py-1.5 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                        />
                      ) : (
                        `₹${row.cost_per_hour.toLocaleString()}`
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingId === row.id ? (
                        <input
                          type="number"
                          value={editData.forming_cost_percentage}
                          onChange={(e) => handleFieldChange('forming_cost_percentage', e.target.value)}
                          className="w-24 px-2 py-1.5 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                        />
                      ) : (
                        `${row.forming_cost_percentage}%`
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
                  <td colSpan={isAdmin ? 7 : 6} className="px-6 py-8 text-center text-gray-500">
                    No tooling data found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredData.length > itemsPerPage && (
        <div className="mt-4 flex items-center justify-between bg-white rounded-lg shadow-md px-6 py-4">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
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

            {currentPage > 1 && (
              <button
                onClick={() => paginate(currentPage - 1)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
              >
                {currentPage - 1}
              </button>
            )}

            <button className="px-4 py-2 rounded bg-[#246679] text-white font-semibold">
              {currentPage}
            </button>

            {currentPage < totalPages && (
              <button
                onClick={() => paginate(currentPage + 1)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
              >
                {currentPage + 1}
              </button>
            )}

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
            <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update tooling data.
          </p>
        </div>
      )}
    </div>
  );
};

export default SheetMetalTooling;