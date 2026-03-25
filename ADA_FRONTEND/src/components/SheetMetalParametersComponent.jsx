// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, Download, Save, X, Edit } from 'lucide-react';

// const SheetMetalParametersComponent = ({ onBack }) => {
//   const [parameters, setParameters] = useState([]);
//   const [materials, setMaterials] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isAddingNew, setIsAddingNew] = useState(false);
//   const [editingRow, setEditingRow] = useState(null);
//   const [editingData, setEditingData] = useState(null);
//   const [userRole, setUserRole] = useState('');
//   const itemsPerPage = 10;

//   const [newParameter, setNewParameter] = useState({
//     material: '',
//     length_range: '',
//     roughing_feed_rate: 0,
//     roughing_axial_depth_of_cut: 0,
//     roughing_radial_width_of_cut: 0,
//     finishing_feed_rate: 0,
//     finishing_axial_depth_of_cut: 0,
//     finishing_radial_width_of_cut: 0
//   });

//   useEffect(() => {
//     const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
//     setUserRole(userData.role || '');
//     fetchParameters();
//     fetchMaterials();
//   }, []);

//   const fetchParameters = async () => {
//     try {
//       const response = await fetch('http://172.18.100.156:8004/sheetmetal-parameters');
//       const result = await response.json();
//       if (result.success) {
//         const sortedData = [...result.data].sort((a, b) => a.id - b.id);
//         setParameters(sortedData);
//       }
//     } catch (error) {
//       console.error('Error fetching parameters:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchMaterials = async () => {
//     try {
//       const response = await fetch('http://172.18.100.156:8004/sheetmetal-materials');
//       const result = await response.json();
//       if (result.success) {
//         setMaterials(result.data);
//       }
//     } catch (error) {
//       console.error('Error fetching materials:', error);
//     }
//   };

//   const handleAddParameter = async () => {
//     try {
//       const formData = new URLSearchParams();
//       Object.keys(newParameter).forEach(key => {
//         formData.append(key, newParameter[key]);
//       });

//       const response = await fetch('http://172.18.100.156:8004/sheetmetal-parameters/add', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: formData
//       });

//       const result = await response.json();
//       if (result.success) {
//         alert('Parameter added successfully!');
//         fetchParameters();
//         setIsAddingNew(false);
//         setNewParameter({
//           material: '',
//           length_range: '',
//           roughing_feed_rate: 0,
//           roughing_axial_depth_of_cut: 0,
//           roughing_radial_width_of_cut: 0,
//           finishing_feed_rate: 0,
//           finishing_axial_depth_of_cut: 0,
//           finishing_radial_width_of_cut: 0
//         });
//       }
//     } catch (error) {
//       console.error('Error adding parameter:', error);
//       alert('Error adding parameter');
//     }
//   };

//   const handleEditClick = (param) => {
//     setEditingRow(param.id);
//     setEditingData({
//       ...param,
//       original_length_range: param.length_range
//     });
//   };

//   const handleEditChange = (field, value) => {
//     setEditingData(prev => ({
//       ...prev,
//       [field]: field === 'length_range' ? value : Number(value)
//     }));
//   };

//   const handleUpdateParameter = async () => {
//     try {
//       const formData = new URLSearchParams();
//       formData.append('material', editingData.material);
//       formData.append('old_length_range', editingData.original_length_range);
//       formData.append('new_length_range', editingData.length_range);
//       formData.append('roughing_feed_rate', editingData.roughing_feed_rate);
//       formData.append('roughing_axial_depth_of_cut', editingData.roughing_axial_depth_of_cut);
//       formData.append('roughing_radial_width_of_cut', editingData.roughing_radial_width_of_cut);
//       formData.append('finishing_feed_rate', editingData.finishing_feed_rate);
//       formData.append('finishing_axial_depth_of_cut', editingData.finishing_axial_depth_of_cut);
//       formData.append('finishing_radial_width_of_cut', editingData.finishing_radial_width_of_cut);

//       const response = await fetch('http://172.18.100.156:8004/sheetmetal-parameters/update', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: formData
//       });

//       const result = await response.json();
//       if (result.success) {
//         alert('Parameter updated successfully!');
//         fetchParameters();
//         setEditingRow(null);
//         setEditingData(null);
//       } else {
//         alert('Failed to update parameter: ' + (result.message || 'Unknown error'));
//       }
//     } catch (error) {
//       console.error('Error updating parameter:', error);
//       alert('Error updating parameter');
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingRow(null);
//     setEditingData(null);
//   };

//   const handleExportToExcel = () => {
//     const csvContent = [
//       ['Material', 'Length Range', 'Roughing Feed Rate', 'Roughing Depth of Cut', 'Roughing Radial WOC', 
//        'Finishing Feed Rate', 'Finishing Depth of Cut', 'Finishing Radial WOC'],
//       ...filteredParameters.map(p => [
//         p.material, p.length_range, p.roughing_feed_rate, p.roughing_axial_depth_of_cut,
//         p.roughing_radial_width_of_cut, p.finishing_feed_rate, p.finishing_axial_depth_of_cut,
//         p.finishing_radial_width_of_cut
//       ])
//     ].map(row => row.join(',')).join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'sheetmetal_parameters.csv';
//     a.click();
//   };

//   const filteredParameters = parameters.filter(param =>
//     param.material.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const totalPages = Math.ceil(filteredParameters.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedParameters = filteredParameters.slice(startIndex, startIndex + itemsPerPage);

//   const isAdmin = userRole.toLowerCase() === 'admin';

//   if (loading) {
//     return <div className="flex justify-center items-center h-64">Loading...</div>;
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-sm">
//       <div className="p-6 border-b border-gray-200">
//         <div className="flex justify-between items-center mb-4">
//                <button
//               onClick={onBack}
//               className="flex items-center gap-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               Back to Overview
//             </button>
//           <h2 className="text-2xl font-bold text-gray-800">Sheet Metal Parameters</h2>
//           <div className="flex gap-3">
//             {isAdmin && (
//               <button
//                 onClick={() => setIsAddingNew(true)}
//                 className="flex items-center gap-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors"
//               >
//                 <span className="text-lg">+</span>
//                 Add parameter
//               </button>
//             )}
//             <button
//               onClick={handleExportToExcel}
//               className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//             >
//               <Download className="w-4 h-4" />
//               Export to Excel
//             </button>
//             {/* <button
//               onClick={onBack}
//               className="flex items-center gap-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               Back to Overview
//             </button> */}
//           </div>
//         </div>

//         <input
//           type="text"
//           placeholder="Search by material name..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246679] focus:border-transparent"
//         />
// {/*         
//         <p className="text-sm text-gray-600 mt-3">
//           Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredParameters.length)} of {filteredParameters.length} parameters
//         </p> */}
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead className="bg-[#246679] text-white">
//             <tr>
//               <th className="px-4 py-3 text-left text-sm font-semibold">Material</th>
//               <th className="px-4 py-3 text-left text-sm font-semibold">Length Range</th>
//               <th className="px-4 py-3 text-left text-sm font-semibold">Roughing Feed Rate</th>
//               <th className="px-4 py-3 text-left text-sm font-semibold">Roughing Depth of Cut</th>
//               <th className="px-4 py-3 text-left text-sm font-semibold">Roughing Radial WOC</th>
//               <th className="px-4 py-3 text-left text-sm font-semibold">Finishing Feed Rate</th>
//               <th className="px-4 py-3 text-left text-sm font-semibold">Finishing Depth of Cut</th>
//               <th className="px-4 py-3 text-left text-sm font-semibold">Finishing Radial WOC</th>
//               {isAdmin && (
//                 <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
//               )}
//             </tr>
//           </thead>
//           <tbody>
//             {isAdmin && isAddingNew && (
//               <tr className="bg-green-50 border-2 border-green-400">
//                 <td className="px-4 py-3">
//                   <select
//                     value={newParameter.material}
//                     onChange={(e) => setNewParameter({...newParameter, material: e.target.value})}
//                     className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
//                   >
//                     <option value="">Select Material</option>
//                     {materials.map((mat) => (
//                       <option key={mat.id} value={mat.material}>{mat.material}</option>
//                     ))}
//                   </select>
//                 </td>
//                 <td className="px-4 py-3">
//                   <input
//                     type="text"
//                     placeholder="e.g., 0-50"
//                     value={newParameter.length_range}
//                     onChange={(e) => setNewParameter({...newParameter, length_range: e.target.value})}
//                     className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
//                   />
//                 </td>
//                 <td className="px-4 py-3">
//                   <input
//                     type="number"
//                     value={newParameter.roughing_feed_rate}
//                     onChange={(e) => setNewParameter({...newParameter, roughing_feed_rate: Number(e.target.value)})}
//                     className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
//                   />
//                 </td>
//                 <td className="px-4 py-3">
//                   <input
//                     type="number"
//                     value={newParameter.roughing_axial_depth_of_cut}
//                     onChange={(e) => setNewParameter({...newParameter, roughing_axial_depth_of_cut: Number(e.target.value)})}
//                     className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
//                   />
//                 </td>
//                 <td className="px-4 py-3">
//                   <input
//                     type="number"
//                     value={newParameter.roughing_radial_width_of_cut}
//                     onChange={(e) => setNewParameter({...newParameter, roughing_radial_width_of_cut: Number(e.target.value)})}
//                     className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
//                   />
//                 </td>
//                 <td className="px-4 py-3">
//                   <input
//                     type="number"
//                     value={newParameter.finishing_feed_rate}
//                     onChange={(e) => setNewParameter({...newParameter, finishing_feed_rate: Number(e.target.value)})}
//                     className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
//                   />
//                 </td>
//                 <td className="px-4 py-3">
//                   <input
//                     type="number"
//                     value={newParameter.finishing_axial_depth_of_cut}
//                     onChange={(e) => setNewParameter({...newParameter, finishing_axial_depth_of_cut: Number(e.target.value)})}
//                     className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
//                   />
//                 </td>
//                 <td className="px-4 py-3">
//                   <input
//                     type="number"
//                     value={newParameter.finishing_radial_width_of_cut}
//                     onChange={(e) => setNewParameter({...newParameter, finishing_radial_width_of_cut: Number(e.target.value)})}
//                     className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
//                   />
//                 </td>
//                 <td className="px-4 py-3">
//                   <div className="flex gap-2">
//                     <button
//                       onClick={handleAddParameter}
//                       className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm transition-colors"
//                     >
//                       <Save className="w-3 h-3" />
//                       Save
//                     </button>
//                     <button
//                       onClick={() => setIsAddingNew(false)}
//                       className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm transition-colors"
//                     >
//                       <X className="w-3 h-3" />
//                       Cancel
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             )}

//             {paginatedParameters.map((param, index) => {
//               const isEditing = editingRow === param.id;

//               return (
//                 <tr key={param.id} className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
//                   <td className="px-4 py-3 text-sm text-gray-700">{param.material}</td>
//                   <td className="px-4 py-3 text-sm text-gray-700">
//                     {isEditing && isAdmin ? (
//                       <input
//                         type="text"
//                         value={editingData.length_range}
//                         onChange={(e) => handleEditChange('length_range', e.target.value)}
//                         className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
//                       />
//                     ) : param.length_range}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-700">
//                     {isEditing && isAdmin ? (
//                       <input
//                         type="number"
//                         value={editingData.roughing_feed_rate}
//                         onChange={(e) => handleEditChange('roughing_feed_rate', e.target.value)}
//                         className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
//                       />
//                     ) : param.roughing_feed_rate}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-700">
//                     {isEditing && isAdmin ? (
//                       <input
//                         type="number"
//                         value={editingData.roughing_axial_depth_of_cut}
//                         onChange={(e) => handleEditChange('roughing_axial_depth_of_cut', e.target.value)}
//                         className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
//                       />
//                     ) : param.roughing_axial_depth_of_cut}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-700">
//                     {isEditing && isAdmin ? (
//                       <input
//                         type="number"
//                         value={editingData.roughing_radial_width_of_cut}
//                         onChange={(e) => handleEditChange('roughing_radial_width_of_cut', e.target.value)}
//                         className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
//                       />
//                     ) : param.roughing_radial_width_of_cut}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-700">
//                     {isEditing && isAdmin ? (
//                       <input
//                         type="number"
//                         value={editingData.finishing_feed_rate}
//                         onChange={(e) => handleEditChange('finishing_feed_rate', e.target.value)}
//                         className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
//                       />
//                     ) : param.finishing_feed_rate}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-700">
//                     {isEditing && isAdmin ? (
//                       <input
//                         type="number"
//                         value={editingData.finishing_axial_depth_of_cut}
//                         onChange={(e) => handleEditChange('finishing_axial_depth_of_cut', e.target.value)}
//                         className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
//                       />
//                     ) : param.finishing_axial_depth_of_cut}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-700">
//                     {isEditing && isAdmin ? (
//                       <input
//                         type="number"
//                         value={editingData.finishing_radial_width_of_cut}
//                         onChange={(e) => handleEditChange('finishing_radial_width_of_cut', e.target.value)}
//                         className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
//                       />
//                     ) : param.finishing_radial_width_of_cut}
//                   </td>
//                   {isAdmin && (
//                     <td className="px-4 py-3">
//                       {isEditing ? (
//                         <div className="flex gap-2">
//                           <button
//                             onClick={handleUpdateParameter}
//                             className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm transition-colors"
//                           >
//                             <Save className="w-3 h-3" />
//                             Save
//                           </button>
//                           <button
//                             onClick={handleCancelEdit}
//                             className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm transition-colors"
//                           >
//                             <X className="w-3 h-3" />
//                             Cancel
//                           </button>
//                         </div>
//                       ) : (
//                         <button
//                           onClick={() => handleEditClick(param)}
//                           className="flex items-center gap-1 px-3 py-1 bg-[#246679] text-white rounded hover:bg-[#1f5766] text-sm transition-colors"
//                         >
//                           <Edit className="w-3 h-3" />
//                           Update
//                         </button>
//                       )}
//                     </td>
//                   )}
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       <div className="p-4 border-t border-gray-200 flex justify-between items-center">
//         {/* <p className="text-sm text-gray-600">
//           Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredParameters.length)} of {filteredParameters.length} entries
//         </p> */}
//         <div className="flex gap-2">
//           <button
//             onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//             disabled={currentPage === 1}
//             className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Previous
//           </button>
//           {[...Array(totalPages)].map((_, i) => (
//             <button
//               key={i + 1}
//               onClick={() => setCurrentPage(i + 1)}
//               className={`px-3 py-1 rounded ${
//                 currentPage === i + 1
//                   ? 'bg-[#246679] text-white'
//                   : 'border border-gray-300 hover:bg-gray-50'
//               }`}
//             >
//               {i + 1}
//             </button>
//           ))}
//           <button
//             onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//             disabled={currentPage === totalPages}
//             className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {!isAdmin && (
//         <div className="mx-6 mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//           <p className="text-sm text-yellow-800">
//             <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can add or update parameters.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SheetMetalParametersComponent;


import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Save, X, Edit } from 'lucide-react';

const SheetMetalParametersComponent = ({ onBack }) => {
  const [parameters, setParameters] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [userRole, setUserRole] = useState('');
  const itemsPerPage = 10;

  const [newParameter, setNewParameter] = useState({
    material: '',
    length_range: '',
    roughing_feed_rate: 0,
    roughing_axial_depth_of_cut: 0,
    roughing_radial_width_of_cut: 0,
    finishing_feed_rate: 0,
    finishing_axial_depth_of_cut: 0,
    finishing_radial_width_of_cut: 0
  });

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    setUserRole(userData.role || '');
    fetchParameters();
    fetchMaterials();
  }, []);

  const fetchParameters = async () => {
    try {
      const response = await fetch('http://172.18.100.156:8004/sheetmetal-parameters');
      const result = await response.json();
      console.log('Fetched parameters:', result); // Debug log
      if (result.success) {
        const sortedData = [...result.data].sort((a, b) => a.id - b.id);
        setParameters(sortedData);
      }
    } catch (error) {
      console.error('Error fetching parameters:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await fetch('http://172.18.100.156:8004/sheetmetal-materials');
      const result = await response.json();
      if (result.success) {
        setMaterials(result.data);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  const handleAddParameter = async () => {
    try {
      const formData = new URLSearchParams();
      Object.keys(newParameter).forEach(key => {
        formData.append(key, newParameter[key]);
      });

      const response = await fetch('http://172.18.100.156:8004/sheetmetal-parameters/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail || errorData.error || 'Failed to add parameter';
        alert('Failed to add parameter: ' + errorMessage);
        return;
      }

      const result = await response.json();
      if (result.success) {
        alert('Parameter added successfully!');
        fetchParameters();
        setIsAddingNew(false);
        setNewParameter({
          material: '',
          length_range: '',
          roughing_feed_rate: 0,
          roughing_axial_depth_of_cut: 0,
          roughing_radial_width_of_cut: 0,
          finishing_feed_rate: 0,
          finishing_axial_depth_of_cut: 0,
          finishing_radial_width_of_cut: 0
        });
      } else {
        alert('Failed to add parameter: ' + (result.message || result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding parameter:', error);
      alert('Error adding parameter: ' + error.message);
    }
  };

  const handleEditClick = (param) => {
    setEditingRow(param.id);
    setEditingData({
      ...param,
      original_length_range: param.length_range
    });
  };

  const handleEditChange = (field, value) => {
    setEditingData(prev => ({
      ...prev,
      [field]: field === 'length_range' ? value : Number(value)
    }));
  };

  const handleUpdateParameter = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append('material', editingData.material);
      formData.append('old_length_range', editingData.original_length_range);
      formData.append('new_length_range', editingData.length_range);
      formData.append('roughing_feed_rate', editingData.roughing_feed_rate);
      formData.append('roughing_axial_depth_of_cut', editingData.roughing_axial_depth_of_cut);
      formData.append('roughing_radial_width_of_cut', editingData.roughing_radial_width_of_cut);
      formData.append('finishing_feed_rate', editingData.finishing_feed_rate);
      formData.append('finishing_axial_depth_of_cut', editingData.finishing_axial_depth_of_cut);
      formData.append('finishing_radial_width_of_cut', editingData.finishing_radial_width_of_cut);

      const response = await fetch('http://172.18.100.156:8004/sheetmetal-parameters/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail || errorData.error || 'Failed to update parameter';
        alert('Failed to update parameter: ' + errorMessage);
        return;
      }

      const result = await response.json();
      if (result.success) {
        alert('Parameter updated successfully!');
        fetchParameters();
        setEditingRow(null);
        setEditingData(null);
      } else {
        alert('Failed to update parameter: ' + (result.message || result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating parameter:', error);
      alert('Error updating parameter: ' + error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditingData(null);
  };

  const handleExportToExcel = () => {
    const csvContent = [
      ['Material', 'Length Range', 'Roughing Feed Rate', 'Roughing Depth of Cut', 'Roughing Radial WOC', 
       'Finishing Feed Rate', 'Finishing Depth of Cut', 'Finishing Radial WOC'],
      ...filteredParameters.map(p => [
        p.material, p.length_range, p.roughing_feed_rate, p.roughing_axial_depth_of_cut,
        p.roughing_radial_width_of_cut, p.finishing_feed_rate, p.finishing_axial_depth_of_cut,
        p.finishing_radial_width_of_cut
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sheetmetal_parameters.csv';
    a.click();
  };

  const filteredParameters = parameters.filter(param =>
    param.material.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredParameters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedParameters = filteredParameters.slice(startIndex, startIndex + itemsPerPage);

  const isAdmin = userRole.toLowerCase() === 'admin';

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Overview
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Sheet Metal Parameters</h2>
          <div className="flex gap-3">
            {isAdmin && (
              <button
                onClick={() => setIsAddingNew(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors"
              >
                <span className="text-lg">+</span>
                Add parameter
              </button>
            )}
            <button
              onClick={handleExportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export to Excel
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search by material name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246679] focus:border-transparent"
        />

       
     
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#246679] text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Material</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Length Range</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Roughing Feed Rate</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Roughing Depth of Cut</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Roughing Radial WOC</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Finishing Feed Rate</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Finishing Depth of Cut</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Finishing Radial WOC</th>
              {isAdmin && (
                <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {isAdmin && isAddingNew && (
              <tr className="bg-green-50 border-2 border-green-400">
                <td className="px-4 py-3">
                  <select
                    value={newParameter.material}
                    onChange={(e) => setNewParameter({...newParameter, material: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
                  >
                    <option value="">Select Material</option>
                    {materials.map((mat) => (
                      <option key={mat.id} value={mat.material}>{mat.material}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    placeholder="e.g., 0-50"
                    value={newParameter.length_range}
                    onChange={(e) => setNewParameter({...newParameter, length_range: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={newParameter.roughing_feed_rate}
                    onChange={(e) => setNewParameter({...newParameter, roughing_feed_rate: Number(e.target.value)})}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={newParameter.roughing_axial_depth_of_cut}
                    onChange={(e) => setNewParameter({...newParameter, roughing_axial_depth_of_cut: Number(e.target.value)})}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={newParameter.roughing_radial_width_of_cut}
                    onChange={(e) => setNewParameter({...newParameter, roughing_radial_width_of_cut: Number(e.target.value)})}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={newParameter.finishing_feed_rate}
                    onChange={(e) => setNewParameter({...newParameter, finishing_feed_rate: Number(e.target.value)})}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={newParameter.finishing_axial_depth_of_cut}
                    onChange={(e) => setNewParameter({...newParameter, finishing_axial_depth_of_cut: Number(e.target.value)})}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={newParameter.finishing_radial_width_of_cut}
                    onChange={(e) => setNewParameter({...newParameter, finishing_radial_width_of_cut: Number(e.target.value)})}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddParameter}
                      className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm transition-colors"
                    >
                      <Save className="w-3 h-3" />
                      Save
                    </button>
                    <button
                      onClick={() => setIsAddingNew(false)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm transition-colors"
                    >
                      <X className="w-3 h-3" />
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {paginatedParameters.length > 0 ? (
              paginatedParameters.map((param, index) => {
                const isEditing = editingRow === param.id;

                return (
                  <tr key={param.id} className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-4 py-3 text-sm text-gray-700">{param.material}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {isEditing && isAdmin ? (
                        <input
                          type="text"
                          value={editingData.length_range}
                          onChange={(e) => handleEditChange('length_range', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
                        />
                      ) : param.length_range}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {isEditing && isAdmin ? (
                        <input
                          type="number"
                          value={editingData.roughing_feed_rate}
                          onChange={(e) => handleEditChange('roughing_feed_rate', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
                        />
                      ) : param.roughing_feed_rate}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {isEditing && isAdmin ? (
                        <input
                          type="number"
                          value={editingData.roughing_axial_depth_of_cut}
                          onChange={(e) => handleEditChange('roughing_axial_depth_of_cut', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
                        />
                      ) : param.roughing_axial_depth_of_cut}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {isEditing && isAdmin ? (
                        <input
                          type="number"
                          value={editingData.roughing_radial_width_of_cut}
                          onChange={(e) => handleEditChange('roughing_radial_width_of_cut', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
                        />
                      ) : param.roughing_radial_width_of_cut}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {isEditing && isAdmin ? (
                        <input
                          type="number"
                          value={editingData.finishing_feed_rate}
                          onChange={(e) => handleEditChange('finishing_feed_rate', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
                        />
                      ) : param.finishing_feed_rate}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {isEditing && isAdmin ? (
                        <input
                          type="number"
                          value={editingData.finishing_axial_depth_of_cut}
                          onChange={(e) => handleEditChange('finishing_axial_depth_of_cut', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
                        />
                      ) : param.finishing_axial_depth_of_cut}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {isEditing && isAdmin ? (
                        <input
                          type="number"
                          value={editingData.finishing_radial_width_of_cut}
                          onChange={(e) => handleEditChange('finishing_radial_width_of_cut', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#246679]"
                        />
                      ) : param.finishing_radial_width_of_cut}
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <div className="flex gap-2">
                            <button
                              onClick={handleUpdateParameter}
                              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm transition-colors"
                            >
                              <Save className="w-3 h-3" />
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm transition-colors"
                            >
                              <X className="w-3 h-3" />
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEditClick(param)}
                            className="flex items-center gap-1 px-3 py-1 bg-[#246679] text-white rounded hover:bg-[#1f5766] text-sm transition-colors"
                          >
                            <Edit className="w-3 h-3" />
                            Update
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={isAdmin ? 9 : 8} className="px-4 py-8 text-center text-gray-500">
                  No parameters found{searchTerm ? ` matching "${searchTerm}"` : ''}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ONLY SHOW PAGINATION IF MORE THAN itemsPerPage */}
      {filteredParameters.length > itemsPerPage && (
        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredParameters.length)} of {filteredParameters.length} entries
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded transition-colors ${
                  currentPage === i + 1
                    ? 'bg-[#246679] text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {!isAdmin && (
        <div className="mx-6 mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can add or update parameters.
          </p>
        </div>
      )}
    </div>
  );
};

export default SheetMetalParametersComponent;