import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Edit2 } from 'lucide-react';

const SheetMetalPercentages = ({ onBack }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({
    roughing_percentage: '',
    finishing_percentage: ''
  });
  const [updating, setUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [userRole, setUserRole] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    setUserRole(userData.role || '');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://172.18.100.156:8004/sheetmetal-percentages');
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError('Failed to fetch data');
      }
    } catch (err) {
      setError('Error fetching data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    if (!editValues.roughing_percentage || !editValues.finishing_percentage) {
      alert('Please enter valid percentages for both fields');
      return;
    }

    const total = parseFloat(editValues.roughing_percentage) + parseFloat(editValues.finishing_percentage);
    if (Math.abs(total - 100) > 0.01) {
      alert('Roughing and Finishing percentages must add up to 100%');
      return;
    }

    try {
      setUpdating(true);
      
      const formData = new URLSearchParams();
      formData.append('roughing_percentage', parseFloat(editValues.roughing_percentage));
      formData.append('finishing_percentage', parseFloat(editValues.finishing_percentage));

      const response = await fetch('http://172.18.100.156:8004/sheetmetal-percentages/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'accept': 'application/json'
        },
        body: formData.toString()
      });

      const result = await response.json();

      if (result.success) {
        await fetchData();
        setEditingId(null);
        setEditValues({ roughing_percentage: '', finishing_percentage: '' });
        alert('Sheet metal percentages updated successfully!');
      } else {
        alert('Failed to update: ' + (result.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Error updating data: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setEditValues({
      roughing_percentage: row.roughing_percentage,
      finishing_percentage: row.finishing_percentage
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({ roughing_percentage: '', finishing_percentage: '' });
  };

  const exportToExcel = () => {
    if (!data || data.length === 0) return;

    const csvContent = `ID,Roughing Percentage (%),Finishing Percentage (%)\n${data.map(row => 
      `${row.id},${row.roughing_percentage},${row.finishing_percentage}`
    ).join('\n')}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'sheetmetal_percentages.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const isAdmin = userRole.toLowerCase() === 'admin';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
           <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Overview
          </button>
        <h1 className="text-2xl font-bold text-gray-800">Sheet Metal Roughing Percentages </h1>
        <div className="flex gap-3">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export to Excel
          </button>
          {/* <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Overview
          </button> */}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#246679] text-white">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Roughing Percentage (%)</th>
              <th className="px-6 py-4 text-left font-semibold">Finishing Percentage (%)</th>
              {isAdmin && (
                <th className="px-6 py-4 text-right font-semibold">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((row) => (
              <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4">
                  {editingId === row.id && isAdmin ? (
                    <input
                      type="number"
                      value={editValues.roughing_percentage}
                      onChange={(e) => setEditValues({ ...editValues, roughing_percentage: e.target.value })}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  ) : (
                    <span className="text-gray-800">{row.roughing_percentage}%</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === row.id && isAdmin ? (
                    <input
                      type="number"
                      value={editValues.finishing_percentage}
                      onChange={(e) => setEditValues({ ...editValues, finishing_percentage: e.target.value })}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  ) : (
                    <span className="text-gray-800">{row.finishing_percentage}%</span>
                  )}
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 text-right">
                    {editingId === row.id ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleUpdate(row.id)}
                          disabled={updating}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          {updating ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={updating}
                          className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(row)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors ml-auto"
                      >
                        <Edit2 className="w-4 h-4" />
                        Update
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 py-4 border-t border-gray-200">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === index + 1
                    ? 'bg-[#246679] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Summary Info */}
      {data.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, data.length)} of {data.length} entries
        </div>
      )}

      {!isAdmin && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update sheet metal percentages.
          </p>
        </div>
      )}
    </div>
  );
};

export default SheetMetalPercentages;