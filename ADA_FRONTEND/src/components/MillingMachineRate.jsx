// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, Save, X, Edit2, Loader } from 'lucide-react';

// const MillingMachineRate = ({ onBack }) => {
//   const [machineRates, setMachineRates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editedRate, setEditedRate] = useState('');
//   const [updating, setUpdating] = useState(false);

//   useEffect(() => {
//     fetchMachineRates();
//   }, []);

//   const fetchMachineRates = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://172.18.100.156:8004/Milling_getmachine-rates/');
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch machine rates');
//       }
      
//       const data = await response.json();
      
//       // Sort data by material_id, then machine_type, then size to maintain consistent order
//       const sortedData = data.sort((a, b) => {
//         // First sort by material_id
//         if (a.material_id !== b.material_id) {
//           return a.material_id - b.material_id;
//         }
        
//         // Then sort by machine_type (5 Axis, 4 Axis, 3 Axis)
//         const machineOrder = { '5 Axis': 1, '4 Axis': 2, '3 Axis': 3 };
//         const orderA = machineOrder[a.machine_type] || 4;
//         const orderB = machineOrder[b.machine_type] || 4;
//         if (orderA !== orderB) {
//           return orderA - orderB;
//         }
        
//         // Finally sort by size (convert to numeric for comparison)
//         const getSizeValue = (size) => {
//           const parts = size.split('*').map(s => parseInt(s));
//           return parts[0] * parts[1] * parts[2]; // Calculate volume
//         };
//         return getSizeValue(a.size) - getSizeValue(b.size);
//       });
      
//       setMachineRates(sortedData);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching machine rates:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (id, currentRate) => {
//     setEditingId(id);
//     setEditedRate(currentRate.toString());
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedRate('');
//   };

//   const handleUpdate = async (row) => {
//     if (!editedRate || parseFloat(editedRate) <= 0) {
//       alert('Please enter a valid hourly rate');
//       return;
//     }

//     try {
//       setUpdating(true);
//       const response = await fetch('http://172.18.100.156:8004/Milling_machine-rates/update/', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'accept': 'application/json'
//         },
//         body: JSON.stringify({
//           material_id: row.material_id,
//           machine_type: row.machine_type,
//           hourly_rate: parseFloat(editedRate),
//           size: row.size
//         })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update hourly rate');
//       }

//       const result = await response.json();
      
//       // Sort the updated data to maintain consistent order
//       setMachineRates(prevRates => {
//         const updatedRates = prevRates.map(rate =>
//           rate.id === row.id
//             ? { ...rate, hourly_rate: parseFloat(editedRate) }
//             : rate
//         );
        
//         // Apply the same sorting logic
//         return updatedRates.sort((a, b) => {
//           if (a.material_id !== b.material_id) {
//             return a.material_id - b.material_id;
//           }
          
//           const machineOrder = { '5 Axis': 1, '4 Axis': 2, '3 Axis': 3 };
//           const orderA = machineOrder[a.machine_type] || 4;
//           const orderB = machineOrder[b.machine_type] || 4;
//           if (orderA !== orderB) {
//             return orderA - orderB;
//           }
          
//           const getSizeValue = (size) => {
//             const parts = size.split('*').map(s => parseInt(s));
//             return parts[0] * parts[1] * parts[2];
//           };
//           return getSizeValue(a.size) - getSizeValue(b.size);
//         });
//       });

//       setEditingId(null);
//       setEditedRate('');
//       alert('Hourly rate updated successfully!');
//     } catch (err) {
//       alert(`Error updating rate: ${err.message}`);
//       console.error('Error updating machine rate:', err);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader className="w-8 h-8 text-[#246679] animate-spin" />
//         <span className="ml-3 text-gray-600">Loading machine rates...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//         <h3 className="text-red-800 font-semibold mb-2">Error Loading Data</h3>
//         <p className="text-red-600">{error}</p>
//         <button
//           onClick={fetchMachineRates}
//           className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={onBack}
//             className="flex items-center space-x-2 text-[#246679] hover:text-[#1f5766] transition-colors"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             <span className="font-medium">Back</span>
//           </button>
//           <h2 className="text-2xl font-bold text-gray-800">Machine Rates Configuration</h2>
//         </div>
//         <button
//           onClick={fetchMachineRates}
//           className="px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors"
//         >
//           Refresh Data
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#246679]">
//           <p className="text-gray-600 text-sm">Total Records</p>
//           <p className="text-2xl font-bold text-gray-800">{machineRates.length}</p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#2a7589]">
//           <p className="text-gray-600 text-sm">3 Axis Machines</p>
//           <p className="text-2xl font-bold text-gray-800">
//             {machineRates.filter(r => r.machine_type === '3 Axis').length}
//           </p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#2d8599]">
//           <p className="text-gray-600 text-sm">4 Axis Machines</p>
//           <p className="text-2xl font-bold text-gray-800">
//             {machineRates.filter(r => r.machine_type === '4 Axis').length}
//           </p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#327a8d]">
//           <p className="text-gray-600 text-sm">5 Axis Machines</p>
//           <p className="text-2xl font-bold text-gray-800">
//             {machineRates.filter(r => r.machine_type === '5 Axis').length}
//           </p>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-[#246679] text-white">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                   Material ID
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                   Machine Type
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                   Size
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                   Hourly Rate (₹)
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {machineRates.map((row, index) => (
//                 <tr
//                   key={`rate-${row.id}`}
//                   className={`${
//                     index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
//                   } hover:bg-blue-50 transition-colors`}
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {row.material_id}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                       row.machine_type === '5 Axis' ? 'bg-green-100 text-green-800' :
//                       row.machine_type === '4 Axis' ? 'bg-blue-100 text-blue-800' :
//                       'bg-purple-100 text-purple-800'
//                     }`}>
//                       {row.machine_type}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {row.size}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     {editingId === row.id ? (
//                       <input
//                         type="number"
//                         value={editedRate}
//                         onChange={(e) => setEditedRate(e.target.value)}
//                         className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                         placeholder="Enter rate"
//                         disabled={updating}
//                       />
//                     ) : (
//                       <span className="font-semibold text-gray-900">
//                         ₹{row.hourly_rate.toLocaleString()}
//                       </span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     {editingId === row.id ? (
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => handleUpdate(row)}
//                           disabled={updating}
//                           className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           {updating ? (
//                             <Loader className="w-4 h-4 animate-spin" />
//                           ) : (
//                             <Save className="w-4 h-4" />
//                           )}
//                           <span>Save</span>
//                         </button>
//                         <button
//                           onClick={handleCancel}
//                           disabled={updating}
//                           className="flex items-center space-x-1 px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           <X className="w-4 h-4" />
//                           <span>Cancel</span>
//                         </button>
//                       </div>
//                     ) : (
//                       <button
//                         onClick={() => handleEdit(row.id, row.hourly_rate)}
//                         className="flex items-center space-x-1 px-3 py-1.5 bg-[#246679] text-white rounded-md hover:bg-[#1f5766] transition-colors"
//                       >
//                         <Edit2 className="w-4 h-4" />
//                         <span>Update</span>
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MillingMachineRate;




//''''this is the first working code which is updated one '''''
// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, Save, X, Edit2, Loader } from 'lucide-react';

// const MillingMachineRate = ({ onBack }) => {
//   const [machineRates, setMachineRates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editedRate, setEditedRate] = useState('');
//   const [updating, setUpdating] = useState(false);

//   useEffect(() => {
//     fetchMachineRates();
//   }, []);

//   const fetchMachineRates = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://172.18.100.156:8004/Milling_getmachine-rates/');
//       if (!response.ok) throw new Error('Failed to fetch machine rates');
//       const data = await response.json();

//       // Sort by material_id, machine_type, size
//       const sortedData = data.sort((a, b) => {
//         if (a.material_id !== b.material_id) return a.material_id - b.material_id;
//         const order = { '5 Axis': 1, '4 Axis': 2, '3 Axis': 3 };
//         const orderA = order[a.machine_type] || 4;
//         const orderB = order[b.machine_type] || 4;
//         if (orderA !== orderB) return orderA - orderB;
//         const getSizeValue = (s) => s.split('*').map(Number).reduce((a, b) => a * b);
//         return getSizeValue(a.size) - getSizeValue(b.size);
//       });

//       setMachineRates(sortedData);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (id, currentRate) => {
//     setEditingId(id);
//     setEditedRate(currentRate.toString());
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedRate('');
//   };

//   const handleUpdate = async (row) => {
//     if (!editedRate || parseFloat(editedRate) <= 0) {
//       alert('Please enter a valid hourly rate');
//       return;
//     }

//     try {
//       setUpdating(true);
//       const response = await fetch('http://172.18.100.156:8004/Milling_machine-rates/update/', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'accept': 'application/json'
//         },
//         body: JSON.stringify({
//           material_id: row.material_id,
//           machine_type: row.machine_type,
//           hourly_rate: parseFloat(editedRate),
//           size: row.size
//         })
//       });

//       if (!response.ok) throw new Error('Failed to update hourly rate');
//       const result = await response.json();

//       // Update sorted state
//       setMachineRates(prev =>
//         prev
//           .map(r => (r.id === row.id ? { ...r, hourly_rate: parseFloat(editedRate) } : r))
//           .sort((a, b) => {
//             if (a.material_id !== b.material_id) return a.material_id - b.material_id;
//             const order = { '5 Axis': 1, '4 Axis': 2, '3 Axis': 3 };
//             const orderA = order[a.machine_type] || 4;
//             const orderB = order[b.machine_type] || 4;
//             if (orderA !== orderB) return orderA - orderB;
//             const getSizeValue = (s) => s.split('*').map(Number).reduce((a, b) => a * b);
//             return getSizeValue(a.size) - getSizeValue(b.size);
//           })
//       );

//       setEditingId(null);
//       setEditedRate('');
//       alert('Hourly rate updated successfully!');
//     } catch (err) {
//       alert(`Error updating rate: ${err.message}`);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader className="w-8 h-8 text-[#246679] animate-spin" />
//         <span className="ml-3 text-gray-600">Loading machine rates...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//         <h3 className="text-red-800 font-semibold mb-2">Error Loading Data</h3>
//         <p className="text-red-600">{error}</p>
//         <button
//           onClick={fetchMachineRates}
//           className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* ✅ Header section with title and right-aligned Back button */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Machine Rates Configuration</h2>
//         <button
//           onClick={onBack}
//           className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           <span>Back to Overview</span>
//         </button>
//       </div>

//       {/* Info cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#246679]">
//           <p className="text-gray-600 text-sm">Total Records</p>
//           <p className="text-2xl font-bold text-gray-800">{machineRates.length}</p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#2a7589]">
//           <p className="text-gray-600 text-sm">3 Axis Machines</p>
//           <p className="text-2xl font-bold text-gray-800">
//             {machineRates.filter(r => r.machine_type === '3 Axis').length}
//           </p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#2d8599]">
//           <p className="text-gray-600 text-sm">4 Axis Machines</p>
//           <p className="text-2xl font-bold text-gray-800">
//             {machineRates.filter(r => r.machine_type === '4 Axis').length}
//           </p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#327a8d]">
//           <p className="text-gray-600 text-sm">5 Axis Machines</p>
//           <p className="text-2xl font-bold text-gray-800">
//             {machineRates.filter(r => r.machine_type === '5 Axis').length}
//           </p>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-[#246679] text-white">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                   Material ID
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                   Machine Type
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                   Size
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                   Hourly Rate (₹)
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {machineRates.map((row, index) => (
//                 <tr
//                   key={`rate-${row.id}`}
//                   className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.material_id}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                         row.machine_type === '5 Axis'
//                           ? 'bg-green-100 text-green-800'
//                           : row.machine_type === '4 Axis'
//                           ? 'bg-blue-100 text-blue-800'
//                           : 'bg-purple-100 text-purple-800'
//                       }`}
//                     >
//                       {row.machine_type}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.size}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     {editingId === row.id ? (
//                       <input
//                         type="number"
//                         value={editedRate}
//                         onChange={(e) => setEditedRate(e.target.value)}
//                         className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                         placeholder="Enter rate"
//                         disabled={updating}
//                       />
//                     ) : (
//                       <span className="font-semibold text-gray-900">₹{row.hourly_rate.toLocaleString()}</span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     {editingId === row.id ? (
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => handleUpdate(row)}
//                           disabled={updating}
//                           className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
//                         >
//                           {updating ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
//                           <span>Save</span>
//                         </button>
//                         <button
//                           onClick={handleCancel}
//                           disabled={updating}
//                           className="flex items-center space-x-1 px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50"
//                         >
//                           <X className="w-4 h-4" />
//                           <span>Cancel</span>
//                         </button>
//                       </div>
//                     ) : (
//                       <button
//                         onClick={() => handleEdit(row.id, row.hourly_rate)}
//                         className="flex items-center space-x-1 px-3 py-1.5 bg-[#246679] text-white rounded-md hover:bg-[#1f5766] transition-colors"
//                       >
//                         <Edit2 className="w-4 h-4" />
//                         <span>Update</span>
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MillingMachineRate;






// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, Save, X, Edit2, Loader } from 'lucide-react';

// const MillingMachineRate = ({ onBack }) => {
//   const [machineRates, setMachineRates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editedRate, setEditedRate] = useState('');
//   const [updating, setUpdating] = useState(false);
//   const [userRole, setUserRole] = useState('');

//   useEffect(() => {
//     // Get user role from sessionStorage
//     const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
//     setUserRole(userData.role || '');
//     fetchMachineRates();
//   }, []);

//   const fetchMachineRates = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://172.18.100.156:8004/Milling_getmachine-rates/');
//       if (!response.ok) throw new Error('Failed to fetch machine rates');
//       const data = await response.json();

//       // Sort by material_id, machine_type, size
//       const sortedData = data.sort((a, b) => {
//         if (a.material_id !== b.material_id) return a.material_id - b.material_id;
//         const order = { '5 Axis': 1, '4 Axis': 2, '3 Axis': 3 };
//         const orderA = order[a.machine_type] || 4;
//         const orderB = order[b.machine_type] || 4;
//         if (orderA !== orderB) return orderA - orderB;
//         const getSizeValue = (s) => s.split('*').map(Number).reduce((a, b) => a * b);
//         return getSizeValue(a.size) - getSizeValue(b.size);
//       });

//       setMachineRates(sortedData);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (id, currentRate) => {
//     setEditingId(id);
//     setEditedRate(currentRate.toString());
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedRate('');
//   };

//   const handleUpdate = async (row) => {
//     if (!editedRate || parseFloat(editedRate) <= 0) {
//       alert('Please enter a valid hourly rate');
//       return;
//     }

//     try {
//       setUpdating(true);
//       const response = await fetch('http://172.18.100.156:8004/Milling_machine-rates/update/', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'accept': 'application/json'
//         },
//         body: JSON.stringify({
//           material_id: row.material_id,
//           machine_type: row.machine_type,
//           hourly_rate: parseFloat(editedRate),
//           size: row.size
//         })
//       });

//       if (!response.ok) throw new Error('Failed to update hourly rate');
//       const result = await response.json();

//       // Update sorted state
//       setMachineRates(prev =>
//         prev
//           .map(r => (r.id === row.id ? { ...r, hourly_rate: parseFloat(editedRate) } : r))
//           .sort((a, b) => {
//             if (a.material_id !== b.material_id) return a.material_id - b.material_id;
//             const order = { '5 Axis': 1, '4 Axis': 2, '3 Axis': 3 };
//             const orderA = order[a.machine_type] || 4;
//             const orderB = order[b.machine_type] || 4;
//             if (orderA !== orderB) return orderA - orderB;
//             const getSizeValue = (s) => s.split('*').map(Number).reduce((a, b) => a * b);
//             return getSizeValue(a.size) - getSizeValue(b.size);
//           })
//       );

//       setEditingId(null);
//       setEditedRate('');
//       alert('Hourly rate updated successfully!');
//     } catch (err) {
//       alert(`Error updating rate: ${err.message}`);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // Check if user is admin
//   const isAdmin = userRole.toLowerCase() === 'admin';

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader className="w-8 h-8 text-[#246679] animate-spin" />
//         <span className="ml-3 text-gray-600">Loading machine rates...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//         <h3 className="text-red-800 font-semibold mb-2">Error Loading Data</h3>
//         <p className="text-red-600">{error}</p>
//         <button
//           onClick={fetchMachineRates}
//           className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Machine Rates Configuration</h2>
//         <button
//           onClick={onBack}
//           className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           <span>Back to Overview</span>
//         </button>
//       </div>

//       {/* Info cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#246679]">
//           <p className="text-gray-600 text-sm">Total Records</p>
//           <p className="text-2xl font-bold text-gray-800">{machineRates.length}</p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#2a7589]">
//           <p className="text-gray-600 text-sm">3 Axis Machines</p>
//           <p className="text-2xl font-bold text-gray-800">
//             {machineRates.filter(r => r.machine_type === '3 Axis').length}
//           </p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#2d8599]">
//           <p className="text-gray-600 text-sm">4 Axis Machines</p>
//           <p className="text-2xl font-bold text-gray-800">
//             {machineRates.filter(r => r.machine_type === '4 Axis').length}
//           </p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#327a8d]">
//           <p className="text-gray-600 text-sm">5 Axis Machines</p>
//           <p className="text-2xl font-bold text-gray-800">
//             {machineRates.filter(r => r.machine_type === '5 Axis').length}
//           </p>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-[#246679] text-white">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                   Material ID
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                   Machine Type
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                   Size
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                   Hourly Rate (₹)
//                 </th>
//                 {isAdmin && (
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                     Action
//                   </th>
//                 )}
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {machineRates.map((row, index) => (
//                 <tr
//                   key={`rate-${row.id}`}
//                   className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.material_id}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                         row.machine_type === '5 Axis'
//                           ? 'bg-green-100 text-green-800'
//                           : row.machine_type === '4 Axis'
//                           ? 'bg-blue-100 text-blue-800'
//                           : 'bg-purple-100 text-purple-800'
//                       }`}
//                     >
//                       {row.machine_type}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.size}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     {isAdmin && editingId === row.id ? (
//                       <input
//                         type="number"
//                         value={editedRate}
//                         onChange={(e) => setEditedRate(e.target.value)}
//                         className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                         placeholder="Enter rate"
//                         disabled={updating}
//                       />
//                     ) : (
//                       <span className="font-semibold text-gray-900">₹{row.hourly_rate.toLocaleString()}</span>
//                     )}
//                   </td>
//                   {isAdmin && (
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       {editingId === row.id ? (
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => handleUpdate(row)}
//                             disabled={updating}
//                             className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
//                           >
//                             {updating ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
//                             <span>Save</span>
//                           </button>
//                           <button
//                             onClick={handleCancel}
//                             disabled={updating}
//                             className="flex items-center space-x-1 px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50"
//                           >
//                             <X className="w-4 h-4" />
//                             <span>Cancel</span>
//                           </button>
//                         </div>
//                       ) : (
//                         <button
//                           onClick={() => handleEdit(row.id, row.hourly_rate)}
//                           className="flex items-center space-x-1 px-3 py-1.5 bg-[#246679] text-white rounded-md hover:bg-[#1f5766] transition-colors"
//                         >
//                           <Edit2 className="w-4 h-4" />
//                           <span>Update</span>
//                         </button>
//                       )}
//                     </td>
//                   )}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {!isAdmin && (
//         <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//           <p className="text-sm text-yellow-800">
//             <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update machine rates.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MillingMachineRate;










//'''''this below code added the export to excel button to download the data into  excelformatt''''''// 
// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, Save, X, Edit2, Loader, Download } from 'lucide-react';
// import * as XLSX from 'xlsx';

// const MillingMachineRate = ({ onBack }) => {
//   const [machineRates, setMachineRates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editedRate, setEditedRate] = useState('');
//   const [updating, setUpdating] = useState(false);
//   const [userRole, setUserRole] = useState('');

//   useEffect(() => {
//     // Get user role from sessionStorage
//     const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
//     setUserRole(userData.role || '');
//     fetchMachineRates();
//   }, []);

//   const fetchMachineRates = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://172.18.100.156:8004/Milling_getmachine-rates/');
//       if (!response.ok) throw new Error('Failed to fetch machine rates');
//       const data = await response.json();

//       // Sort by material_id, machine_type, size
//       const sortedData = data.sort((a, b) => {
//         if (a.material_id !== b.material_id) return a.material_id - b.material_id;
//         const order = { '5 Axis': 1, '4 Axis': 2, '3 Axis': 3 };
//         const orderA = order[a.machine_type] || 4;
//         const orderB = order[b.machine_type] || 4;
//         if (orderA !== orderB) return orderA - orderB;
//         const getSizeValue = (s) => s.split('*').map(Number).reduce((a, b) => a * b);
//         return getSizeValue(a.size) - getSizeValue(b.size);
//       });

//       setMachineRates(sortedData);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (id, currentRate) => {
//     setEditingId(id);
//     setEditedRate(currentRate.toString());
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedRate('');
//   };

//   const handleUpdate = async (row) => {
//     if (!editedRate || parseFloat(editedRate) <= 0) {
//       alert('Please enter a valid hourly rate');
//       return;
//     }

//     try {
//       setUpdating(true);
//       const response = await fetch('http://172.18.100.156:8004/Milling_machine-rates/update/', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'accept': 'application/json'
//         },
//         body: JSON.stringify({
//           material_id: row.material_id,
//           machine_type: row.machine_type,
//           hourly_rate: parseFloat(editedRate),
//           size: row.size
//         })
//       });

//       if (!response.ok) throw new Error('Failed to update hourly rate');
//       const result = await response.json();

//       // Update sorted state
//       setMachineRates(prev =>
//         prev
//           .map(r => (r.id === row.id ? { ...r, hourly_rate: parseFloat(editedRate) } : r))
//           .sort((a, b) => {
//             if (a.material_id !== b.material_id) return a.material_id - b.material_id;
//             const order = { '5 Axis': 1, '4 Axis': 2, '3 Axis': 3 };
//             const orderA = order[a.machine_type] || 4;
//             const orderB = order[b.machine_type] || 4;
//             if (orderA !== orderB) return orderA - orderB;
//             const getSizeValue = (s) => s.split('*').map(Number).reduce((a, b) => a * b);
//             return getSizeValue(a.size) - getSizeValue(b.size);
//           })
//       );

//       setEditingId(null);
//       setEditedRate('');
//       alert('Hourly rate updated successfully!');
//     } catch (err) {
//       alert(`Error updating rate: ${err.message}`);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleExportToExcel = () => {
//     // Prepare data for export
//     const exportData = machineRates.map(rate => ({
//       'ID': rate.id,
//       'Material ID': rate.material_id,
//       'Machine Type': rate.machine_type,
//       'Size': rate.size,
//       'Hourly Rate (₹)': rate.hourly_rate
//     }));

//     // Create worksheet
//     const worksheet = XLSX.utils.json_to_sheet(exportData);
    
//     // Set column widths
//     const columnWidths = [
//       { wch: 8 },   // ID
//       { wch: 12 },  // Material ID
//       { wch: 15 },  // Machine Type
//       { wch: 15 },  // Size
//       { wch: 18 }   // Hourly Rate
//     ];
//     worksheet['!cols'] = columnWidths;

//     // Create workbook
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Machine Rates');

//     // Generate filename with timestamp
//     const timestamp = new Date().toISOString().split('T')[0];
//     const filename = `Machine_Rates_${timestamp}.xlsx`;

//     // Download file
//     XLSX.writeFile(workbook, filename);
//   };

//   // Check if user is admin
//   const isAdmin = userRole.toLowerCase() === 'admin';

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader className="w-8 h-8 text-[#246679] animate-spin" />
//         <span className="ml-3 text-gray-600">Loading machine rates...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//         <h3 className="text-red-800 font-semibold mb-2">Error Loading Data</h3>
//         <p className="text-red-600">{error}</p>
//         <button
//           onClick={fetchMachineRates}
//           className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Machine Rates Configuration</h2>
//         <div className="flex items-center space-x-3">
//           <button
//             onClick={handleExportToExcel}
//             className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
//           >
//             <Download className="w-4 h-4" />
//             <span>Export to Excel</span>
//           </button>
//           <button
//             onClick={onBack}
//             className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             <span>Back to Overview</span>
//           </button>
//         </div>
//       </div>

//       {/* Info cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#246679]">
//           <p className="text-gray-600 text-sm">Total Records</p>
//           <p className="text-2xl font-bold text-gray-800">{machineRates.length}</p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#2a7589]">
//           <p className="text-gray-600 text-sm">3 Axis Machines</p>
//           <p className="text-2xl font-bold text-gray-800">
//             {machineRates.filter(r => r.machine_type === '3 Axis').length}
//           </p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#2d8599]">
//           <p className="text-gray-600 text-sm">4 Axis Machines</p>
//           <p className="text-2xl font-bold text-gray-800">
//             {machineRates.filter(r => r.machine_type === '4 Axis').length}
//           </p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#327a8d]">
//           <p className="text-gray-600 text-sm">5 Axis Machines</p>
//           <p className="text-2xl font-bold text-gray-800">
//             {machineRates.filter(r => r.machine_type === '5 Axis').length}
//           </p>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-[#246679] text-white">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                   ID
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                   Material ID
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                   Machine Type
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                   Size
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                   Hourly Rate (₹)
//                 </th>
//                 {isAdmin && (
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                     Action
//                   </th>
//                 )}
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {machineRates.map((row, index) => (
//                 <tr
//                   key={`rate-${row.id}`}
//                   className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.id}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.material_id}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                         row.machine_type === '5 Axis'
//                           ? 'bg-green-100 text-green-800'
//                           : row.machine_type === '4 Axis'
//                           ? 'bg-blue-100 text-blue-800'
//                           : 'bg-purple-100 text-purple-800'
//                       }`}
//                     >
//                       {row.machine_type}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.size}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     {isAdmin && editingId === row.id ? (
//                       <input
//                         type="number"
//                         value={editedRate}
//                         onChange={(e) => setEditedRate(e.target.value)}
//                         className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                         placeholder="Enter rate"
//                         disabled={updating}
//                       />
//                     ) : (
//                       <span className="font-semibold text-gray-900">₹{row.hourly_rate.toLocaleString()}</span>
//                     )}
//                   </td>
//                   {isAdmin && (
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       {editingId === row.id ? (
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => handleUpdate(row)}
//                             disabled={updating}
//                             className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
//                           >
//                             {updating ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
//                             <span>Save</span>
//                           </button>
//                           <button
//                             onClick={handleCancel}
//                             disabled={updating}
//                             className="flex items-center space-x-1 px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50"
//                           >
//                             <X className="w-4 h-4" />
//                             <span>Cancel</span>
//                           </button>
//                         </div>
//                       ) : (
//                         <button
//                           onClick={() => handleEdit(row.id, row.hourly_rate)}
//                           className="flex items-center space-x-1 px-3 py-1.5 bg-[#246679] text-white rounded-md hover:bg-[#1f5766] transition-colors"
//                         >
//                           <Edit2 className="w-4 h-4" />
//                           <span>Update</span>
//                         </button>
//                       )}
//                     </td>
//                   )}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {!isAdmin && (
//         <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//           <p className="text-sm text-yellow-800">
//             <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update machine rates.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MillingMachineRate;





// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, Save, X, Edit2, Loader, Download, Plus } from 'lucide-react';
// import * as XLSX from 'xlsx';

// const MillingMachineRate = ({ onBack }) => {
//   const [machineRates, setMachineRates] = useState([]);
//   const [materials, setMaterials] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editData, setEditData] = useState({});
//   const [updating, setUpdating] = useState(false);
//   const [userRole, setUserRole] = useState('');
//   const [isAddingNew, setIsAddingNew] = useState(false);
//   const [newRowData, setNewRowData] = useState({});
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(5);

//   const API_BASE_URL = 'http://172.18.100.156:8004';

//   useEffect(() => {
//     const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
//     setUserRole(userData.role || '');
//     fetchMachineRates();
//     fetchMaterials();
//   }, []);

//   const fetchMachineRates = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_BASE_URL}/Milling_getmachine-rates/`);
//       if (!response.ok) throw new Error('Failed to fetch machine rates');
//       const data = await response.json();

//       // Sort by material, machine_type, size
//       const sortedData = data.sort((a, b) => {
//         if (a.material !== b.material) return a.material.localeCompare(b.material);
//         const order = { '5 Axis': 1, '4 Axis': 2, '3 Axis': 3 };
//         const orderA = order[a.machine_type] || 4;
//         const orderB = order[b.machine_type] || 4;
//         if (orderA !== orderB) return orderA - orderB;
//         const getSizeValue = (s) => s.split('*').map(Number).reduce((a, b) => a * b);
//         return getSizeValue(a.size) - getSizeValue(b.size);
//       });

//       setMachineRates(sortedData);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchMaterials = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/Milling_getmaterials/`);
//       if (!response.ok) throw new Error('Failed to fetch materials');
//       const data = await response.json();
//       setMaterials(data);
//     } catch (err) {
//       console.error('Error fetching materials:', err);
//     }
//   };

//   const handleEdit = (row) => {
//     setEditingId(row.id);
//     setEditData({
//       material: row.material,
//       machine_type: row.machine_type,
//       old_size: row.size,
//       new_size: row.size,
//       hourly_rate: row.hourly_rate
//     });
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditData({});
//   };

//   const handleFieldChange = (field, value) => {
//     setEditData(prev => ({
//       ...prev,
//       [field]: field === 'hourly_rate' ? parseFloat(value) : value
//     }));
//   };

//   const handleUpdate = async () => {
//     if (!editData.hourly_rate || editData.hourly_rate <= 0) {
//       alert('Please enter a valid hourly rate');
//       return;
//     }

//     try {
//       setUpdating(true);
//       const updatePayload = {
//         material: editData.material,
//         machine_type: editData.machine_type,
//         old_size: editData.old_size,
//         new_size: editData.new_size,
//         hourly_rate: editData.hourly_rate
//       };

//       const response = await fetch(`${API_BASE_URL}/Milling_machine-rates/update/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'accept': 'application/json'
//         },
//         body: JSON.stringify(updatePayload)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || 'Failed to update machine rate');
//       }

//       await fetchMachineRates();
//       setEditingId(null);
//       setEditData({});
//       alert('Machine rate updated successfully!');
//     } catch (err) {
//       alert(`Error updating rate: ${err.message}`);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // Add new machine rate functions
//   const startAddingNew = () => {
//     setIsAddingNew(true);
//     setNewRowData({
//       material_id: '',
//       machine_type: '3 Axis',
//       size: '',
//       hourly_rate: 0
//     });
//   };

//   const cancelAddingNew = () => {
//     setIsAddingNew(false);
//     setNewRowData({});
//   };

//   const handleNewRowChange = (field, value) => {
//     setNewRowData(prev => ({
//       ...prev,
//       [field]: field === 'material_id' || field === 'machine_type' || field === 'size' 
//         ? value 
//         : parseFloat(value) || 0
//     }));
//   };

//   const saveNewMachineRate = async () => {
//     if (!newRowData.material_id || !newRowData.machine_type || !newRowData.size || newRowData.hourly_rate <= 0) {
//       alert('Please fill all fields with valid values');
//       return;
//     }

//     try {
//       setUpdating(true);
//       const response = await fetch(`${API_BASE_URL}/Milling_machine-rates/add/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'accept': 'application/json'
//         },
//         body: JSON.stringify(newRowData)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || 'Failed to add machine rate');
//       }

//       await fetchMachineRates();
//       setIsAddingNew(false);
//       setNewRowData({});
//       alert('New machine rate added successfully!');
//     } catch (err) {
//       alert(`Error adding machine rate: ${err.message}`);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleExportToExcel = () => {
//     const exportData = machineRates.map(rate => ({
//       'ID': rate.id,
//       'Material': rate.material,
//       'Machine Type': rate.machine_type,
//       'Size': rate.size,
//       'Hourly Rate (₹)': rate.hourly_rate
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const columnWidths = [
//       { wch: 8 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 18 }
//     ];
//     worksheet['!cols'] = columnWidths;

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Machine Rates');

//     const timestamp = new Date().toISOString().split('T')[0];
//     const filename = `Machine_Rates_${timestamp}.xlsx`;
//     XLSX.writeFile(workbook, filename);
//   };

//   // Pagination calculations
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = machineRates.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(machineRates.length / itemsPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   const isAdmin = userRole.toLowerCase() === 'admin';

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader className="w-8 h-8 text-[#246679] animate-spin" />
//         <span className="ml-3 text-gray-600">Loading machine rates...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//         <h3 className="text-red-800 font-semibold mb-2">Error Loading Data</h3>
//         <p className="text-red-600">{error}</p>
//         <button
//           onClick={fetchMachineRates}
//           className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Machine Rates Configuration</h2>
//         <div className="flex items-center space-x-3">
//           {isAdmin && (
//             <button
//               onClick={startAddingNew}
//               disabled={isAddingNew}
//               className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            
//             >
//               <Plus className="w-4 h-4" />
//               <span>Add Machine Rates</span>
//             </button>
//           )}
//           <button
//             onClick={handleExportToExcel}
//             className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
//           >
//             <Download className="w-4 h-4" />
//             <span>Export to Excel</span>
//           </button>
//           {onBack && (
//             <button
//               onClick={onBack}
//               className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               <span>Back to Overview</span>
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Info cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#246679]">
//           <p className="text-gray-600 text-sm">Total Records</p>
//           <p className="text-2xl font-bold text-gray-800">{machineRates.length}</p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#2a7589]">
//           <p className="text-gray-600 text-sm">3 Axis Machines</p>
//           <p className="text-2xl font-bold text-gray-800">
//             {machineRates.filter(r => r.machine_type === '3 Axis').length}
//           </p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#2d8599]">
//           <p className="text-gray-600 text-sm">4 Axis Machines</p>
//           <p className="text-2xl font-bold text-gray-800">
//             {machineRates.filter(r => r.machine_type === '4 Axis').length}
//           </p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#327a8d]">
//           <p className="text-gray-600 text-sm">5 Axis Machines</p>
//           <p className="text-2xl font-bold text-gray-800">
//             {machineRates.filter(r => r.machine_type === '5 Axis').length}
//           </p>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-[#246679] text-white">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Material</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Machine Type</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Size</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Hourly Rate (₹)</th>
//                 {isAdmin && (
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {/* New Row Form */}
//               {isAddingNew && (
//                 <tr className="bg-green-50 border-2 border-green-300">
//                   <td className="px-6 py-4">
//                     <select
//                       value={newRowData.material_id}
//                       onChange={(e) => handleNewRowChange('material_id', e.target.value)}
//                       className="w-full px-2 py-1.5 border border-green-400 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                     >
//                       <option value="">Select Material</option>
//                       {materials.map(mat => (
//                         <option key={mat.id} value={mat.id}>{mat.material}</option>
//                       ))}
//                     </select>
//                   </td>
//                   <td className="px-6 py-4">
//                     <select
//                       value={newRowData.machine_type}
//                       onChange={(e) => handleNewRowChange('machine_type', e.target.value)}
//                       className="w-full px-2 py-1.5 border border-green-400 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                     >
//                       <option value="3 Axis">3 Axis</option>
//                       <option value="4 Axis">4 Axis</option>
//                       <option value="5 Axis">5 Axis</option>
//                     </select>
//                   </td>
//                   <td className="px-6 py-4">
//                     <input
//                       type="text"
//                       value={newRowData.size}
//                       onChange={(e) => handleNewRowChange('size', e.target.value)}
//                       placeholder="e.g., 500*500*300"
//                       className="w-full px-2 py-1.5 border border-green-400 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                     />
//                   </td>
//                   <td className="px-6 py-4">
//                     <input
//                       type="number"
//                       value={newRowData.hourly_rate}
//                       onChange={(e) => handleNewRowChange('hourly_rate', e.target.value)}
//                       placeholder="Enter rate"
//                       className="w-full px-2 py-1.5 border border-green-400 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                     />
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={saveNewMachineRate}
//                         disabled={updating}
//                         className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
//                       >
//                         {updating ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
//                         <span>Save</span>
//                       </button>
//                       <button
//                         onClick={cancelAddingNew}
//                         disabled={updating}
//                         className="flex items-center space-x-1 px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
//                       >
//                         <X className="w-4 h-4" />
//                         <span>Cancel</span>
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               )}

//               {/* Existing Machine Rates */}
//               {currentItems.map((row, index) => (
//                 <tr
//                   key={`rate-${row.id}`}
//                   className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors ${
//                     editingId === row.id ? 'bg-blue-100' : ''
//                   }`}
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     <span className="font-semibold text-[#246679]">{row.material}</span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                         row.machine_type === '5 Axis'
//                           ? 'bg-green-100 text-green-800'
//                           : row.machine_type === '4 Axis'
//                           ? 'bg-blue-100 text-blue-800'
//                           : 'bg-purple-100 text-purple-800'
//                       }`}
//                     >
//                       {row.machine_type}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     {isAdmin && editingId === row.id ? (
//                       <input
//                         type="text"
//                         value={editData.new_size}
//                         onChange={(e) => handleFieldChange('new_size', e.target.value)}
//                         className="w-full px-2 py-1.5 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                       />
//                     ) : (
//                       <span className="text-gray-900">{row.size}</span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     {isAdmin && editingId === row.id ? (
//                       <input
//                         type="number"
//                         value={editData.hourly_rate}
//                         onChange={(e) => handleFieldChange('hourly_rate', e.target.value)}
//                         className="w-32 px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                         disabled={updating}
//                       />
//                     ) : (
//                       <span className="font-semibold text-gray-900">₹{row.hourly_rate.toLocaleString()}</span>
//                     )}
//                   </td>
//                   {isAdmin && (
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       {editingId === row.id ? (
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={handleUpdate}
//                             disabled={updating}
//                             className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
//                           >
//                             {updating ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
//                             <span>Save</span>
//                           </button>
//                           <button
//                             onClick={handleCancel}
//                             disabled={updating}
//                             className="flex items-center space-x-1 px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50"
//                           >
//                             <X className="w-4 h-4" />
//                             <span>Cancel</span>
//                           </button>
//                         </div>
//                       ) : (
//                         <button
//                           onClick={() => handleEdit(row)}
//                           className="flex items-center space-x-1 px-3 py-1.5 bg-[#246679] text-white rounded-md hover:bg-[#1f5766] transition-colors"
//                         >
//                           <Edit2 className="w-4 h-4" />
//                           <span>Update</span>
//                         </button>
//                       )}
//                     </td>
//                   )}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//     {totalPages > 1 && (
//         <div className="mt-4 flex items-center justify-between bg-white rounded-lg shadow-md px-6 py-4">
//           <div className="text-sm text-gray-600">
//             Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, machineRates.length)} of {machineRates.length} entries
//           </div>
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={() => paginate(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//             </button>
            
//             {/* First page */}
//             {currentPage > 2 && (
//               <>
//                 <button
//                   onClick={() => paginate(1)}
//                   className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
//                 >
//                   1
//                 </button>
//                 {currentPage > 3 && <span className="px-2 text-gray-500">...</span>}
//               </>
//             )}
            
//             {/* Previous page */}
//             {currentPage > 1 && (
//               <button
//                 onClick={() => paginate(currentPage - 1)}
//                 className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
//               >
//                 {currentPage - 1}
//               </button>
//             )}
            
//             {/* Current page */}
//             <button
//               className="px-4 py-2 rounded bg-[#246679] text-white font-semibold"
//             >
//               {currentPage}
//             </button>
            
//             {/* Next page */}
//             {currentPage < totalPages && (
//               <button
//                 onClick={() => paginate(currentPage + 1)}
//                 className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
//               >
//                 {currentPage + 1}
//               </button>
//             )}
            
//             {/* Last page */}
//             {currentPage < totalPages - 1 && (
//               <>
//                 {currentPage < totalPages - 2 && <span className="px-2 text-gray-500">...</span>}
//                 <button
//                   onClick={() => paginate(totalPages)}
//                   className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
//                 >
//                   {totalPages}
//                 </button>
//               </>
//             )}
            
//             <button
//               onClick={() => paginate(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       )}

//       {!isAdmin && (
//         <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//           <p className="text-sm text-yellow-800">
//             <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update machine rates.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MillingMachineRate;






import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, Edit2, Loader, Download, Plus, Search } from 'lucide-react';
import * as XLSX from 'xlsx';

const MillingMachineRate = ({ onBack }) => {
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
      const response = await fetch(`${API_BASE_URL}/Milling_getmachine-rates/`);
      if (!response.ok) throw new Error('Failed to fetch machine rates');
      const data = await response.json();

      // Sort by material, machine_type, size
      const sortedData = data.sort((a, b) => {
        if (a.material !== b.material) return a.material.localeCompare(b.material);
        const order = { '5 Axis': 1, '4 Axis': 2, '3 Axis': 3 };
        const orderA = order[a.machine_type] || 4;
        const orderB = order[b.machine_type] || 4;
        if (orderA !== orderB) return orderA - orderB;
        const getSizeValue = (s) => s.split('*').map(Number).reduce((a, b) => a * b);
        return getSizeValue(a.size) - getSizeValue(b.size);
      });

      setMachineRates(sortedData);
      setFilteredMachineRates(sortedData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Milling_getmaterials/`);
      if (!response.ok) throw new Error('Failed to fetch materials');
      const data = await response.json();
      setMaterials(data);
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
      const updatePayload = {
        material: editData.material,
        machine_type: editData.machine_type,
        old_size: editData.old_size,
        new_size: editData.new_size,
        hourly_rate: editData.hourly_rate
      };

      const response = await fetch(`${API_BASE_URL}/Milling_machine-rates/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update machine rate');
      }

      await fetchMachineRates();
      setEditingId(null);
      setEditData({});
      alert('Machine rate updated successfully!');
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
      material_id: '',
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
      [field]: field === 'material_id' || field === 'machine_type' || field === 'size' 
        ? value 
        : parseFloat(value) || 0
    }));
  };

  const saveNewMachineRate = async () => {
    if (!newRowData.material_id || !newRowData.machine_type || !newRowData.size || newRowData.hourly_rate <= 0) {
      alert('Please fill all fields with valid values');
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch(`${API_BASE_URL}/Milling_machine-rates/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(newRowData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add machine rate');
      }

      await fetchMachineRates();
      setIsAddingNew(false);
      setNewRowData({});
      alert('New machine rate added successfully!');
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Machine Rates');

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `Machine_Rates_${timestamp}.xlsx`;
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
        <h2 className="text-2xl font-bold text-gray-800">Milling Machine Rates Configuration</h2>
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
                      value={newRowData.material_id}
                      onChange={(e) => handleNewRowChange('material_id', e.target.value)}
                      className="w-full px-2 py-1.5 border border-green-400 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    >
                      <option value="">Select Material</option>
                      {materials.map(mat => (
                        <option key={mat.id} value={mat.id}>{mat.material}</option>
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
                      placeholder="e.g., 500*500*300"
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

export default MillingMachineRate;