// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, Download, Edit2 } from 'lucide-react';

// const SheetMetalManufacturing = ({ onBack }) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editValue, setEditValue] = useState('');
//   const [updating, setUpdating] = useState(false);
//   const [userRole, setUserRole] = useState('');

//   useEffect(() => {
//     const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
//     setUserRole(userData.role || '');
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://172.18.100.156:8004/sheetmetal-manufacturing-percentage');
//       const result = await response.json();
      
//       if (result.success) {
//         setData(result.data);
//       } else {
//         setError('Failed to fetch data');
//       }
//     } catch (err) {
//       setError('Error fetching data: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdate = async (id) => {
//     if (!editValue || editValue === '') {
//       alert('Please enter a valid percentage');
//       return;
//     }

//     try {
//       setUpdating(true);
//       const formData = new URLSearchParams();
//       formData.append('percentage_of_manufacturing_time', editValue);

//       const response = await fetch('http://172.18.100.156:8004/sheetmetal-manufacturing-percentage/update', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: formData
//       });

//       const result = await response.json();

//       if (result.success) {
//         setData(result.updated_data);
//         setEditingId(null);
//         setEditValue('');
//         alert('Manufacturing percentage updated successfully!');
//       } else {
//         alert('Failed to update: ' + (result.message || 'Unknown error'));
//       }
//     } catch (err) {
//       alert('Error updating data: ' + err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleEdit = (row) => {
//     setEditingId(row.id);
//     setEditValue(row.percentage_of_manufacturing_time);
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditValue('');
//   };

//   const exportToExcel = () => {
//     if (!data) return;

//     const csvContent = `ID,Percentage of Machining Time wrt Manufacturing Time (%)\n${data.id},${data.percentage_of_manufacturing_time}`;
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', 'sheetmetal_manufacturing_percentage.csv');
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const isAdmin = userRole.toLowerCase() === 'admin';

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-gray-600">Loading...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-red-600">{error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//             <button
//             onClick={onBack}
//             className="flex items-center gap-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Back to Overview
//           </button>
//         <h1 className="text-2xl font-bold text-gray-800">Sheet Metal Machining Time wrt manufacturing time(%) </h1>
//         <div className="flex gap-3">
//           <button
//             onClick={exportToExcel}
//             className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//           >
//             <Download className="w-4 h-4" />
//             Export to Excel
//           </button>
//           {/* <button
//             onClick={onBack}
//             className="flex items-center gap-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Back to Overview
//           </button> */}
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-[#246679] text-white">
//             <tr>
//               <th className="px-6 py-4 text-left font-semibold">
//                 Percentage of Machining Time wrt manufacturing time(%)
//               </th>
//               {isAdmin && (
//                 <th className="px-6 py-4 text-right font-semibold">Action</th>
//               )}
//             </tr>
//           </thead>
//           <tbody>
//             {data && (
//               <tr className="border-b border-gray-200 hover:bg-gray-50">
//                 <td className="px-6 py-4">
//                   {editingId === data.id && isAdmin ? (
//                     <input
//                       type="number"
//                       value={editValue}
//                       onChange={(e) => setEditValue(e.target.value)}
//                       className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                       min="0"
//                       max="100"
//                     />
//                   ) : (
//                     <span className="text-gray-800">{data.percentage_of_manufacturing_time}%</span>
//                   )}
//                 </td>
//                 {isAdmin && (
//                   <td className="px-6 py-4 text-right">
//                     {editingId === data.id ? (
//                       <div className="flex justify-end gap-2">
//                         <button
//                           onClick={() => handleUpdate(data.id)}
//                           disabled={updating}
//                           className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
//                         >
//                           {updating ? 'Saving...' : 'Save'}
//                         </button>
//                         <button
//                           onClick={handleCancel}
//                           disabled={updating}
//                           className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors disabled:opacity-50"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     ) : (
//                       <button
//                         onClick={() => handleEdit(data)}
//                         className="flex items-center gap-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors ml-auto"
//                       >
//                         <Edit2 className="w-4 h-4" />
//                         Update
//                       </button>
//                     )}
//                   </td>
//                 )}
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {!isAdmin && (
//         <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//           <p className="text-sm text-yellow-800">
//             <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update manufacturing percentages.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SheetMetalManufacturing;







import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Edit2, Save, X } from 'lucide-react';
import * as XLSX from 'xlsx';

const SheetMetalManufacturing = ({ onBack }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    percentage_of_manufacturing_time: '',
    correction_factor: ''
  });
  const [updating, setUpdating] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    setUserRole(userData.role || '');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://172.18.100.156:8004/sheetmetal-manufacturing-percentage');
      const result = await response.json();
      
      if (result.success && result.data && result.data.length > 0) {
        const dataItem = result.data[0];
        setData(dataItem);
        setEditedData({
          percentage_of_manufacturing_time: dataItem.percentage_of_manufacturing_time,
          correction_factor: dataItem.correction_factor
        });
      } else {
        setError('Failed to fetch data');
      }
    } catch (err) {
      setError('Error fetching data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({
      percentage_of_manufacturing_time: data.percentage_of_manufacturing_time,
      correction_factor: data.correction_factor
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({
      percentage_of_manufacturing_time: data.percentage_of_manufacturing_time,
      correction_factor: data.correction_factor
    });
  };

  const handleUpdate = async () => {
    if (!editedData.percentage_of_manufacturing_time || editedData.percentage_of_manufacturing_time === '') {
      alert('Please enter a valid percentage');
      return;
    }
    if (!editedData.correction_factor && editedData.correction_factor !== 0) {
      alert('Please enter a valid correction factor');
      return;
    }

    try {
      setUpdating(true);
      const formData = new URLSearchParams();
      formData.append('percentage_of_manufacturing_time', Number(editedData.percentage_of_manufacturing_time));
      formData.append('correction_factor', Number(editedData.correction_factor));

      const response = await fetch('http://172.18.100.156:8004/sheetmetal-manufacturing-percentage/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'accept': 'application/json'
        },
        body: formData.toString()
      });

      const result = await response.json();

      if (result.success) {
        setData(result.updated_data);
        setIsEditing(false);
        alert('Manufacturing percentage updated successfully!');
      } else {
        alert('Failed to update: ' + (result.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Error updating data: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const exportToExcel = () => {
    if (!data) {
      alert('No data available to export');
      return;
    }

    const excelData = [{
      'Percentage of Machining Time (%)': data.percentage_of_manufacturing_time,
      'Correction Factor': data.correction_factor
    }];

    const ws = XLSX.utils.json_to_sheet(excelData);
    ws['!cols'] = [{ wch: 35 }, { wch: 20 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet Metal Manufacturing');

    const date = new Date().toISOString().split('T')[0];
    const filename = `SheetMetal_Manufacturing_${date}.xlsx`;

    XLSX.writeFile(wb, filename);
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
        <h1 className="text-2xl font-bold text-gray-800">Sheet Metal Machining Time wrt manufacturing time(%)</h1>
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export to Excel
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#246679] text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">
                  Percentage of Machining Time wrt manufacturing time(%)
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  Correction Factor
                </th>
                {isAdmin && (
                  <th className="px-6 py-4 text-left font-semibold">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data && (
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {isEditing && isAdmin ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={editedData.percentage_of_manufacturing_time}
                          onChange={(e) => setEditedData({
                            ...editedData,
                            percentage_of_manufacturing_time: e.target.value
                          })}
                          className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                          min="0"
                          max="100"
                          disabled={updating}
                        />
                        <span className="text-gray-500">%</span>
                      </div>
                    ) : (
                      <span className="text-gray-800 font-medium">{data.percentage_of_manufacturing_time}%</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing && isAdmin ? (
                      <input
                        type="number"
                        step="0.1"
                        value={editedData.correction_factor}
                        onChange={(e) => setEditedData({
                          ...editedData,
                          correction_factor: e.target.value
                        })}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                        disabled={updating}
                      />
                    ) : (
                      <span className="text-gray-800 font-medium">{data.correction_factor}</span>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            onClick={handleUpdate}
                            disabled={updating}
                            className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                            {updating ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={handleCancel}
                            disabled={updating}
                            className="flex items-center gap-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={handleEdit}
                          className="flex items-center gap-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Update
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!isAdmin && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update manufacturing percentages.
          </p>
        </div>
      )}
    </div>
  );
};

export default SheetMetalManufacturing;