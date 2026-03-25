// import React, { useState, useEffect } from 'react';
// import { Edit2, Save, X, Loader } from 'lucide-react';

// const MillingParametersComponent = () => {
//   const [parameters, setParameters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editData, setEditData] = useState({});
//   const [updating, setUpdating] = useState(false);

//   const API_BASE_URL = 'http://172.18.100.156:8004';

//   // Fetch all parameters
//   useEffect(() => {
//     fetchParameters();
//   }, []);

//   const fetchParameters = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_BASE_URL}/milling-parameters/`);
//       if (!response.ok) throw new Error('Failed to fetch parameters');
//       const data = await response.json();
//       setParameters(data);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching parameters:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const startEditing = (param) => {
//     setEditingId(param.id);
//     setEditData({ ...param });
//   };

//   const cancelEditing = () => {
//     setEditingId(null);
//     setEditData({});
//   };

//   const handleFieldChange = (field, value) => {
//     setEditData(prev => ({
//       ...prev,
//       [field]: field === 'material_id' || field.includes('_') ? Number(value) : value
//     }));
//   };

//   const saveChanges = async () => {
//     try {
//       setUpdating(true);
//       const updatePayload = {
//         material_id: editData.material_id,
//         length_range: editData.length_range,
//         roughing_feed_rate: editData.roughing_feed_rate,
//         roughing_depth_of_cut: editData.roughing_depth_of_cut,
//         roughing_radial_woc: editData.roughing_radial_woc,
//         finishing_feed_rate: editData.finishing_feed_rate,
//         finishing_depth_of_cut: editData.finishing_depth_of_cut,
//         finishing_radial_woc: editData.finishing_radial_woc
//       };

//       const response = await fetch(`${API_BASE_URL}/milling-parameters/update/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'accept': 'application/json'
//         },
//         body: JSON.stringify(updatePayload)
//       });

//       if (!response.ok) throw new Error('Failed to update parameters');
      
//       const result = await response.json();
      
//       // Update local state
//       setParameters(prev =>
//         prev.map(p => p.id === result.id ? result : p)
//       );
      
//       setEditingId(null);
//       setEditData({});
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//       console.error('Error updating parameters:', err);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader className="w-8 h-8 text-[#246679] animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Milling Parameters</h2>
      
//       {error && (
//         <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
//           {error}
//         </div>
//       )}

//       <div className="bg-white rounded-lg shadow-md overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="bg-[#246679] text-white">
//               <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Material ID</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Length Range</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Feed Rate</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Depth of Cut</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Radial WOC</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Feed Rate</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Depth of Cut</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Radial WOC</th>
//               <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {parameters.map((param, idx) => (
//               <tr
//                 key={param.id}
//                 className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
//                   editingId === param.id ? 'bg-blue-50' : ''
//                 } ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
//               >
//                 <td className="px-6 py-4 text-sm text-gray-900">{param.id}</td>
//                 <td className="px-6 py-4 text-sm text-gray-900">{param.material_id}</td>
//                 <td className="px-6 py-4 text-sm text-gray-900">{param.length_range}</td>
                
//                 {/* Editable Fields */}
//                 {[
//                   'roughing_feed_rate',
//                   'roughing_depth_of_cut',
//                   'roughing_radial_woc',
//                   'finishing_feed_rate',
//                   'finishing_depth_of_cut',
//                   'finishing_radial_woc'
//                 ].map(field => (
//                   <td key={field} className="px-6 py-4 text-sm">
//                     {editingId === param.id ? (
//                       <input
//                         type="number"
//                         step="0.1"
//                         value={editData[field]}
//                         onChange={(e) => handleFieldChange(field, e.target.value)}
//                         className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:border-[#246679] focus:ring-1 focus:ring-[#246679]"
//                       />
//                     ) : (
//                       <span className="text-gray-900">{param[field]}</span>
//                     )}
//                   </td>
//                 ))}

//                 {/* Action Buttons */}
//                 <td className="px-6 py-4 text-center">
//                   {editingId === param.id ? (
//                     <div className="flex gap-2 justify-center">
//                       <button
//                         onClick={saveChanges}
//                         disabled={updating}
//                         className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         <Save className="w-4 h-4" />
//                         {updating ? 'Saving...' : 'Save'}
//                       </button>
//                       <button
//                         onClick={cancelEditing}
//                         disabled={updating}
//                         className="inline-flex items-center gap-1 px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         <X className="w-4 h-4" />
//                         Cancel
//                       </button>
//                     </div>
//                   ) : (
//                     <button
//                       onClick={() => startEditing(param)}
//                       className="inline-flex items-center gap-1 px-3 py-1 bg-[#246679] hover:bg-[#1f4d66] text-white rounded text-sm font-medium transition-colors"
//                     >
//                       <Edit2 className="w-4 h-4" />
//                       Update
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {parameters.length === 0 && (
//         <div className="text-center py-8 text-gray-500">
//           No milling parameters found
//         </div>
//       )}
//     </div>
//   );
// };

// export default MillingParametersComponent;








// //'''first woking code 
// import React, { useState, useEffect } from 'react';
// import { Edit2, Save, X, Loader, ArrowLeft } from 'lucide-react';

// const MillingParametersComponent = ({ onBack }) => {
//   const [parameters, setParameters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editData, setEditData] = useState({});
//   const [updating, setUpdating] = useState(false);

//   const API_BASE_URL = 'http://172.18.100.156:8004';

//   // Fetch all parameters
//   useEffect(() => {
//     fetchParameters();
//   }, []);

//   const fetchParameters = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_BASE_URL}/milling-parameters/`);
//       if (!response.ok) throw new Error('Failed to fetch parameters');
//       const data = await response.json();
//       setParameters(data);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching parameters:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const startEditing = (param) => {
//     setEditingId(param.id);
//     setEditData({ ...param });
//   };

//   const cancelEditing = () => {
//     setEditingId(null);
//     setEditData({});
//   };

//   const handleFieldChange = (field, value) => {
//     setEditData(prev => ({
//       ...prev,
//       [field]: field === 'material_id' || field.includes('_') ? Number(value) : value
//     }));
//   };

//   const saveChanges = async () => {
//     try {
//       setUpdating(true);
//       const updatePayload = {
//         material_id: editData.material_id,
//         length_range: editData.length_range,
//         roughing_feed_rate: editData.roughing_feed_rate,
//         roughing_depth_of_cut: editData.roughing_depth_of_cut,
//         roughing_radial_woc: editData.roughing_radial_woc,
//         finishing_feed_rate: editData.finishing_feed_rate,
//         finishing_depth_of_cut: editData.finishing_depth_of_cut,
//         finishing_radial_woc: editData.finishing_radial_woc
//       };

//       const response = await fetch(`${API_BASE_URL}/milling-parameters/update/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'accept': 'application/json'
//         },
//         body: JSON.stringify(updatePayload)
//       });

//       if (!response.ok) throw new Error('Failed to update parameters');
      
//       const result = await response.json();
      
//       // Update local state
//       setParameters(prev =>
//         prev.map(p => p.id === result.id ? result : p)
//       );
      
//       setEditingId(null);
//       setEditData({});
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//       console.error('Error updating parameters:', err);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader className="w-8 h-8 text-[#246679] animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Milling Parameters</h2>
//         {onBack && (
//           <button
//             onClick={onBack}
//             className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             <span>Back to Overview</span>
//           </button>
//         )}
//       </div>
      
//       {error && (
//         <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
//           {error}
//         </div>
//       )}

//       <div className="bg-white rounded-lg shadow-md overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="bg-[#246679] text-white">
//               {/* ID column removed */}
//               <th className="px-6 py-3 text-left text-sm font-semibold">Material ID</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Length Range</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Feed Rate</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Depth of Cut</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Radial WOC</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Feed Rate</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Depth of Cut</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Radial WOC</th>
//               <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {parameters.map((param, idx) => (
//               <tr
//                 key={param.id}
//                 className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
//                   editingId === param.id ? 'bg-blue-50' : ''
//                 } ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
//               >
//                 {/* ID column removed */}
//                 <td className="px-6 py-4 text-sm text-gray-900">{param.material_id}</td>
//                 <td className="px-6 py-4 text-sm text-gray-900">{param.length_range}</td>
                
//                 {/* Editable Fields */}
//                 {[
//                   'roughing_feed_rate',
//                   'roughing_depth_of_cut',
//                   'roughing_radial_woc',
//                   'finishing_feed_rate',
//                   'finishing_depth_of_cut',
//                   'finishing_radial_woc'
//                 ].map(field => (
//                   <td key={field} className="px-6 py-4 text-sm">
//                     {editingId === param.id ? (
//                       <input
//                         type="number"
//                         step="0.1"
//                         value={editData[field]}
//                         onChange={(e) => handleFieldChange(field, e.target.value)}
//                         className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:border-[#246679] focus:ring-1 focus:ring-[#246679]"
//                       />
//                     ) : (
//                       <span className="text-gray-900">{param[field]}</span>
//                     )}
//                   </td>
//                 ))}

//                 {/* Action Buttons */}
//                 <td className="px-6 py-4 text-center">
//                   {editingId === param.id ? (
//                     <div className="flex gap-2 justify-center">
//                       <button
//                         onClick={saveChanges}
//                         disabled={updating}
//                         className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         <Save className="w-4 h-4" />
//                         {updating ? 'Saving...' : 'Save'}
//                       </button>
//                       <button
//                         onClick={cancelEditing}
//                         disabled={updating}
//                         className="inline-flex items-center gap-1 px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         <X className="w-4 h-4" />
//                         Cancel
//                       </button>
//                     </div>
//                   ) : (
//                     <button
//                       onClick={() => startEditing(param)}
//                       className="inline-flex items-center gap-1 px-3 py-1 bg-[#246679] hover:bg-[#1f4d66] text-white rounded text-sm font-medium transition-colors"
//                     >
//                       <Edit2 className="w-4 h-4" />
//                       Update
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {parameters.length === 0 && (
//         <div className="text-center py-8 text-gray-500">
//           No milling parameters found
//         </div>
//       )}
//     </div>
//   );
// };

// export default MillingParametersComponent;








//'''update logi based on adminrole action column is displayed 
// import React, { useState, useEffect } from 'react';
// import { Edit2, Save, X, Loader, ArrowLeft } from 'lucide-react';

// const MillingParametersComponent = ({ onBack }) => {
//   const [parameters, setParameters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editData, setEditData] = useState({});
//   const [updating, setUpdating] = useState(false);
//   const [userRole, setUserRole] = useState('');

//   const API_BASE_URL = 'http://172.18.100.156:8004';

//   // Fetch all parameters
//   useEffect(() => {
//     // Get user role from sessionStorage
//     const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
//     setUserRole(userData.role || '');
//     fetchParameters();
//   }, []);

//   const fetchParameters = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_BASE_URL}/milling-parameters/`);
//       if (!response.ok) throw new Error('Failed to fetch parameters');
//       const data = await response.json();
//       setParameters(data);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching parameters:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const startEditing = (param) => {
//     setEditingId(param.id);
//     setEditData({ ...param });
//   };

//   const cancelEditing = () => {
//     setEditingId(null);
//     setEditData({});
//   };

//   const handleFieldChange = (field, value) => {
//     setEditData(prev => ({
//       ...prev,
//       [field]: field === 'material_id' || field.includes('_') ? Number(value) : value
//     }));
//   };

//   const saveChanges = async () => {
//     try {
//       setUpdating(true);
//       const updatePayload = {
//         material_id: editData.material_id,
//         length_range: editData.length_range,
//         roughing_feed_rate: editData.roughing_feed_rate,
//         roughing_depth_of_cut: editData.roughing_depth_of_cut,
//         roughing_radial_woc: editData.roughing_radial_woc,
//         finishing_feed_rate: editData.finishing_feed_rate,
//         finishing_depth_of_cut: editData.finishing_depth_of_cut,
//         finishing_radial_woc: editData.finishing_radial_woc
//       };

//       const response = await fetch(`${API_BASE_URL}/milling-parameters/update/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'accept': 'application/json'
//         },
//         body: JSON.stringify(updatePayload)
//       });

//       if (!response.ok) throw new Error('Failed to update parameters');
      
//       const result = await response.json();
      
//       // Update local state
//       setParameters(prev =>
//         prev.map(p => p.id === result.id ? result : p)
//       );
      
//       setEditingId(null);
//       setEditData({});
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//       console.error('Error updating parameters:', err);
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
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Milling Parameters</h2>
//         {onBack && (
//           <button
//             onClick={onBack}
//             className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             <span>Back to Overview</span>
//           </button>
//         )}
//       </div>
      
//       {error && (
//         <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
//           {error}
//         </div>
//       )}

//       <div className="bg-white rounded-lg shadow-md overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="bg-[#246679] text-white">
//               <th className="px-6 py-3 text-left text-sm font-semibold">Material ID</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Length Range</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Feed Rate</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Depth of Cut</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Radial WOC</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Feed Rate</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Depth of Cut</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Radial WOC</th>
//               {isAdmin && (
//                 <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
//               )}
//             </tr>
//           </thead>
//           <tbody>
//             {parameters.map((param, idx) => (
//               <tr
//                 key={param.id}
//                 className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
//                   editingId === param.id ? 'bg-blue-50' : ''
//                 } ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
//               >
//                 <td className="px-6 py-4 text-sm text-gray-900">{param.material_id}</td>
//                 <td className="px-6 py-4 text-sm text-gray-900">{param.length_range}</td>
                
//                 {/* Editable Fields */}
//                 {[
//                   'roughing_feed_rate',
//                   'roughing_depth_of_cut',
//                   'roughing_radial_woc',
//                   'finishing_feed_rate',
//                   'finishing_depth_of_cut',
//                   'finishing_radial_woc'
//                 ].map(field => (
//                   <td key={field} className="px-6 py-4 text-sm">
//                     {isAdmin && editingId === param.id ? (
//                       <input
//                         type="number"
//                         step="0.1"
//                         value={editData[field]}
//                         onChange={(e) => handleFieldChange(field, e.target.value)}
//                         className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:border-[#246679] focus:ring-1 focus:ring-[#246679]"
//                       />
//                     ) : (
//                       <span className="text-gray-900">{param[field]}</span>
//                     )}
//                   </td>
//                 ))}

//                 {/* Action Buttons */}
//                 {isAdmin && (
//                   <td className="px-6 py-4 text-center">
//                     {editingId === param.id ? (
//                       <div className="flex gap-2 justify-center">
//                         <button
//                           onClick={saveChanges}
//                           disabled={updating}
//                           className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           <Save className="w-4 h-4" />
//                           {updating ? 'Saving...' : 'Save'}
//                         </button>
//                         <button
//                           onClick={cancelEditing}
//                           disabled={updating}
//                           className="inline-flex items-center gap-1 px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           <X className="w-4 h-4" />
//                           Cancel
//                         </button>
//                       </div>
//                     ) : (
//                       <button
//                         onClick={() => startEditing(param)}
//                         className="inline-flex items-center gap-1 px-3 py-1 bg-[#246679] hover:bg-[#1f4d66] text-white rounded text-sm font-medium transition-colors"
//                       >
//                         <Edit2 className="w-4 h-4" />
//                         Update
//                       </button>
//                     )}
//                   </td>
//                 )}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {parameters.length === 0 && (
//         <div className="text-center py-8 text-gray-500">
//           No milling parameters found
//         </div>
//       )}

//       {!isAdmin && (
//         <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//           <p className="text-sm text-yellow-800">
//             <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update milling parameters.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MillingParametersComponent;







// '''after updateing where row is changing the position so in this below code it is resolved
// import React, { useState, useEffect } from 'react';
// import { Edit2, Save, X, Loader, ArrowLeft } from 'lucide-react';

// const MillingParametersComponent = ({ onBack }) => {
//   const [parameters, setParameters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editData, setEditData] = useState({});
//   const [updating, setUpdating] = useState(false);
//   const [userRole, setUserRole] = useState('');

//   const API_BASE_URL = 'http://172.18.100.156:8004';

//   // Fetch all parameters
//   useEffect(() => {
//     // Get user role from sessionStorage
//     const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
//     setUserRole(userData.role || '');
//     fetchParameters();
//   }, []);

//   const fetchParameters = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_BASE_URL}/milling-parameters/`);
//       if (!response.ok) throw new Error('Failed to fetch parameters');
//       const data = await response.json();
//       // Sort by ID to maintain consistent order
//       const sortedData = [...data].sort((a, b) => a.id - b.id);
//       setParameters(sortedData);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching parameters:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const startEditing = (param) => {
//     setEditingId(param.id);
//     setEditData({ ...param });
//   };

//   const cancelEditing = () => {
//     setEditingId(null);
//     setEditData({});
//   };

//   const handleFieldChange = (field, value) => {
//     setEditData(prev => ({
//       ...prev,
//       [field]: field === 'material_id' || field.includes('_') ? Number(value) : value
//     }));
//   };

//   const saveChanges = async () => {
//     try {
//       setUpdating(true);
//       const updatePayload = {
//         material_id: editData.material_id,
//         length_range: editData.length_range,
//         roughing_feed_rate: editData.roughing_feed_rate,
//         roughing_depth_of_cut: editData.roughing_depth_of_cut,
//         roughing_radial_woc: editData.roughing_radial_woc,
//         finishing_feed_rate: editData.finishing_feed_rate,
//         finishing_depth_of_cut: editData.finishing_depth_of_cut,
//         finishing_radial_woc: editData.finishing_radial_woc
//       };

//       const response = await fetch(`${API_BASE_URL}/milling-parameters/update/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'accept': 'application/json'
//         },
//         body: JSON.stringify(updatePayload)
//       });

//       if (!response.ok) throw new Error('Failed to update parameters');
      
//       const result = await response.json();
      
//       // Update local state while maintaining the original order
//       setParameters(prev => {
//         const index = prev.findIndex(p => p.id === editingId);
//         if (index !== -1) {
//           const updated = [...prev];
//           updated[index] = result;
//           return updated;
//         }
//         return prev;
//       });
      
//       setEditingId(null);
//       setEditData({});
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//       console.error('Error updating parameters:', err);
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
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Milling Parameters</h2>
//         {onBack && (
//           <button
//             onClick={onBack}
//             className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             <span>Back to Overview</span>
//           </button>
//         )}
//       </div>
      
//       {error && (
//         <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
//           {error}
//         </div>
//       )}

//       <div className="bg-white rounded-lg shadow-md overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="bg-[#246679] text-white">
//               <th className="px-6 py-3 text-left text-sm font-semibold">Material ID</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Length Range</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Feed Rate</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Depth of Cut</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Radial WOC</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Feed Rate</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Depth of Cut</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Radial WOC</th>
//               {isAdmin && (
//                 <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
//               )}
//             </tr>
//           </thead>
//           <tbody>
//             {parameters.map((param, idx) => (
//               <tr
//                 key={param.id}
//                 className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
//                   editingId === param.id ? 'bg-blue-50' : ''
//                 } ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
//               >
//                 <td className="px-6 py-4 text-sm text-gray-900">{param.material_id}</td>
//                 <td className="px-6 py-4 text-sm text-gray-900">{param.length_range}</td>
                
//                 {/* Editable Fields */}
//                 {[
//                   'roughing_feed_rate',
//                   'roughing_depth_of_cut',
//                   'roughing_radial_woc',
//                   'finishing_feed_rate',
//                   'finishing_depth_of_cut',
//                   'finishing_radial_woc'
//                 ].map(field => (
//                   <td key={field} className="px-6 py-4 text-sm">
//                     {isAdmin && editingId === param.id ? (
//                       <input
//                         type="number"
//                         step="0.1"
//                         value={editData[field]}
//                         onChange={(e) => handleFieldChange(field, e.target.value)}
//                         className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:border-[#246679] focus:ring-1 focus:ring-[#246679]"
//                       />
//                     ) : (
//                       <span className="text-gray-900">{param[field]}</span>
//                     )}
//                   </td>
//                 ))}

//                 {/* Action Buttons */}
//                 {isAdmin && (
//                   <td className="px-6 py-4 text-center">
//                     {editingId === param.id ? (
//                       <div className="flex gap-2 justify-center">
//                         <button
//                           onClick={saveChanges}
//                           disabled={updating}
//                           className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           <Save className="w-4 h-4" />
//                           {updating ? 'Saving...' : 'Save'}
//                         </button>
//                         <button
//                           onClick={cancelEditing}
//                           disabled={updating}
//                           className="inline-flex items-center gap-1 px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           <X className="w-4 h-4" />
//                           Cancel
//                         </button>
//                       </div>
//                     ) : (
//                       <button
//                         onClick={() => startEditing(param)}
//                         className="inline-flex items-center gap-1 px-3 py-1 bg-[#246679] hover:bg-[#1f4d66] text-white rounded text-sm font-medium transition-colors"
//                       >
//                         <Edit2 className="w-4 h-4" />
//                         Update
//                       </button>
//                     )}
//                   </td>
//                 )}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {parameters.length === 0 && (
//         <div className="text-center py-8 text-gray-500">
//           No milling parameters found
//         </div>
//       )}

//       {!isAdmin && (
//         <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//           <p className="text-sm text-yellow-800">
//             <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update milling parameters.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MillingParametersComponent;





//'''''this below code added the export to excel button to download the data into  excelformatt''''''// 

// import React, { useState, useEffect } from 'react';
// import { Edit2, Save, X, Loader, ArrowLeft, Download } from 'lucide-react';
// import * as XLSX from 'xlsx';

// const MillingParametersComponent = ({ onBack }) => {
//   const [parameters, setParameters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editData, setEditData] = useState({});
//   const [updating, setUpdating] = useState(false);
//   const [userRole, setUserRole] = useState('');

//   const API_BASE_URL = 'http://172.18.100.156:8004';

//   // Fetch all parameters
//   useEffect(() => {
//     // Get user role from sessionStorage
//     const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
//     setUserRole(userData.role || '');
//     fetchParameters();
//   }, []);

//   const fetchParameters = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_BASE_URL}/milling-parameters/`);
//       if (!response.ok) throw new Error('Failed to fetch parameters');
//       const data = await response.json();
//       // Sort by ID to maintain consistent order
//       const sortedData = [...data].sort((a, b) => a.id - b.id);
//       setParameters(sortedData);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching parameters:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const startEditing = (param) => {
//     setEditingId(param.id);
//     setEditData({ ...param });
//   };

//   const cancelEditing = () => {
//     setEditingId(null);
//     setEditData({});
//   };

//   const handleFieldChange = (field, value) => {
//     setEditData(prev => ({
//       ...prev,
//       [field]: field === 'material_id' || field.includes('_') ? Number(value) : value
//     }));
//   };

//   const saveChanges = async () => {
//     try {
//       setUpdating(true);
//       const updatePayload = {
//         material_id: editData.material_id,
//         length_range: editData.length_range,
//         roughing_feed_rate: editData.roughing_feed_rate,
//         roughing_depth_of_cut: editData.roughing_depth_of_cut,
//         roughing_radial_woc: editData.roughing_radial_woc,
//         finishing_feed_rate: editData.finishing_feed_rate,
//         finishing_depth_of_cut: editData.finishing_depth_of_cut,
//         finishing_radial_woc: editData.finishing_radial_woc
//       };

//       const response = await fetch(`${API_BASE_URL}/milling-parameters/update/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'accept': 'application/json'
//         },
//         body: JSON.stringify(updatePayload)
//       });

//       if (!response.ok) throw new Error('Failed to update parameters');
      
//       const result = await response.json();
      
//       // Update local state while maintaining the original order
//       setParameters(prev => {
//         const index = prev.findIndex(p => p.id === editingId);
//         if (index !== -1) {
//           const updated = [...prev];
//           updated[index] = result;
//           return updated;
//         }
//         return prev;
//       });
      
//       setEditingId(null);
//       setEditData({});
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//       console.error('Error updating parameters:', err);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleExportToExcel = () => {
//     // Prepare data for export
//     const exportData = parameters.map(param => ({
//       'ID': param.id,
//       'Material ID': param.material_id,
//       'Length Range': param.length_range,
//       'Roughing Feed Rate': param.roughing_feed_rate,
//       'Roughing Depth of Cut': param.roughing_depth_of_cut,
//       'Roughing Radial WOC': param.roughing_radial_woc,
//       'Finishing Feed Rate': param.finishing_feed_rate,
//       'Finishing Depth of Cut': param.finishing_depth_of_cut,
//       'Finishing Radial WOC': param.finishing_radial_woc
//     }));

//     // Create worksheet
//     const worksheet = XLSX.utils.json_to_sheet(exportData);
    
//     // Set column widths
//     const columnWidths = [
//       { wch: 8 },   // ID
//       { wch: 12 },  // Material ID
//       { wch: 15 },  // Length Range
//       { wch: 22 },  // Roughing Feed Rate
//       { wch: 25 },  // Roughing Depth of Cut
//       { wch: 22 },  // Roughing Radial WOC
//       { wch: 22 },  // Finishing Feed Rate
//       { wch: 25 },  // Finishing Depth of Cut
//       { wch: 22 }   // Finishing Radial WOC
//     ];
//     worksheet['!cols'] = columnWidths;

//     // Create workbook
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Milling Parameters');

//     // Generate filename with timestamp
//     const timestamp = new Date().toISOString().split('T')[0];
//     const filename = `Milling_Parameters_${timestamp}.xlsx`;

//     // Download file
//     XLSX.writeFile(workbook, filename);
//   };

//   // Check if user is admin
//   const isAdmin = userRole.toLowerCase() === 'admin';

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader className="w-8 h-8 text-[#246679] animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Milling Parameters</h2>
//         <div className="flex items-center space-x-3">
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
      
//       {error && (
//         <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
//           {error}
//         </div>
//       )}

//       <div className="bg-white rounded-lg shadow-md overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="bg-[#246679] text-white">
//               <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Material ID</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Length Range</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Feed Rate</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Depth of Cut</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Radial WOC</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Feed Rate</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Depth of Cut</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Radial WOC</th>
//               {isAdmin && (
//                 <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
//               )}
//             </tr>
//           </thead>
//           <tbody>
//             {parameters.map((param, idx) => (
//               <tr
//                 key={param.id}
//                 className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
//                   editingId === param.id ? 'bg-blue-50' : ''
//                 } ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
//               >
//                 <td className="px-6 py-4 text-sm text-gray-900">{param.id}</td>
//                 <td className="px-6 py-4 text-sm text-gray-900">{param.material_id}</td>
//                 <td className="px-6 py-4 text-sm text-gray-900">{param.length_range}</td>
                
//                 {/* Editable Fields */}
//                 {[
//                   'roughing_feed_rate',
//                   'roughing_depth_of_cut',
//                   'roughing_radial_woc',
//                   'finishing_feed_rate',
//                   'finishing_depth_of_cut',
//                   'finishing_radial_woc'
//                 ].map(field => (
//                   <td key={field} className="px-6 py-4 text-sm">
//                     {isAdmin && editingId === param.id ? (
//                       <input
//                         type="number"
//                         step="0.1"
//                         value={editData[field]}
//                         onChange={(e) => handleFieldChange(field, e.target.value)}
//                         className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:border-[#246679] focus:ring-1 focus:ring-[#246679]"
//                       />
//                     ) : (
//                       <span className="text-gray-900">{param[field]}</span>
//                     )}
//                   </td>
//                 ))}

//                 {/* Action Buttons */}
//                 {isAdmin && (
//                   <td className="px-6 py-4 text-center">
//                     {editingId === param.id ? (
//                       <div className="flex gap-2 justify-center">
//                         <button
//                           onClick={saveChanges}
//                           disabled={updating}
//                           className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           <Save className="w-4 h-4" />
//                           {updating ? 'Saving...' : 'Save'}
//                         </button>
//                         <button
//                           onClick={cancelEditing}
//                           disabled={updating}
//                           className="inline-flex items-center gap-1 px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           <X className="w-4 h-4" />
//                           Cancel
//                         </button>
//                       </div>
//                     ) : (
//                       <button
//                         onClick={() => startEditing(param)}
//                         className="inline-flex items-center gap-1 px-3 py-1 bg-[#246679] hover:bg-[#1f4d66] text-white rounded text-sm font-medium transition-colors"
//                       >
//                         <Edit2 className="w-4 h-4" />
//                         Update
//                       </button>
//                     )}
//                   </td>
//                 )}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {parameters.length === 0 && (
//         <div className="text-center py-8 text-gray-500">
//           No milling parameters found
//         </div>
//       )}

//       {!isAdmin && (
//         <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//           <p className="text-sm text-yellow-800">
//             <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update milling parameters.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MillingParametersComponent;








// import React, { useState, useEffect } from 'react';
// import { Edit2, Save, X, Loader, ArrowLeft, Download, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
// import * as XLSX from 'xlsx';

// const MillingParametersComponent = ({ onBack }) => {
//   const [parameters, setParameters] = useState([]);
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
//   const [itemsPerPage] = useState(10);

//   const API_BASE_URL = 'http://172.18.100.156:8004';

//   // Fetch all parameters and materials
//   useEffect(() => {
//     const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
//     setUserRole(userData.role || '');
//     fetchParameters();
//     fetchMaterials();
//   }, []);

//   const fetchParameters = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_BASE_URL}/milling-parameters/`);
//       if (!response.ok) throw new Error('Failed to fetch parameters');
//       const data = await response.json();
//       const sortedData = [...data].sort((a, b) => a.id - b.id);
//       setParameters(sortedData);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching parameters:', err);
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

//   const startEditing = (param) => {
//     setEditingId(param.id);
//     setEditData({
//       material: param.material,
//       material_id: param.material_id,
//       old_length_range: param.length_range,
//       new_length_range: param.length_range,
//       roughing_feed_rate: param.roughing_feed_rate,
//       roughing_depth_of_cut: param.roughing_depth_of_cut,
//       roughing_radial_woc: param.roughing_radial_woc,
//       finishing_feed_rate: param.finishing_feed_rate,
//       finishing_depth_of_cut: param.finishing_depth_of_cut,
//       finishing_radial_woc: param.finishing_radial_woc
//     });
//   };

//   const cancelEditing = () => {
//     setEditingId(null);
//     setEditData({});
//   };

//   const handleFieldChange = (field, value) => {
//     setEditData(prev => ({
//       ...prev,
//       [field]: field === 'new_length_range' ? value : Number(value)
//     }));
//   };

//   const saveChanges = async () => {
//     try {
//       setUpdating(true);
//       const updatePayload = {
//         material: editData.material,
//         old_length_range: editData.old_length_range,
//         new_length_range: editData.new_length_range,
//         roughing_feed_rate: editData.roughing_feed_rate,
//         roughing_depth_of_cut: editData.roughing_depth_of_cut,
//         roughing_radial_woc: editData.roughing_radial_woc,
//         finishing_feed_rate: editData.finishing_feed_rate,
//         finishing_depth_of_cut: editData.finishing_depth_of_cut,
//         finishing_radial_woc: editData.finishing_radial_woc
//       };

//       const response = await fetch(`${API_BASE_URL}/milling-parameters/update/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'accept': 'application/json'
//         },
//         body: JSON.stringify(updatePayload)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || 'Failed to update parameters');
//       }

//       await fetchParameters();
//       setEditingId(null);
//       setEditData({});
//       setError(null);
//       alert('Milling parameters updated successfully!');
//     } catch (err) {
//       setError(err.message);
//       console.error('Error updating parameters:', err);
//       alert(`Error: ${err.message}`);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // Add new parameter functions
//   const startAddingNew = () => {
//     setIsAddingNew(true);
//     setNewRowData({
//       material_id: '',
//       length_range: '',
//       roughing_feed_rate: 0,
//       roughing_depth_of_cut: 0,
//       roughing_radial_woc: 0,
//       finishing_feed_rate: 0,
//       finishing_depth_of_cut: 0,
//       finishing_radial_woc: 0
//     });
//   };

//   const cancelAddingNew = () => {
//     setIsAddingNew(false);
//     setNewRowData({});
//   };

//   const handleNewRowChange = (field, value) => {
//     setNewRowData(prev => ({
//       ...prev,
//       [field]: field === 'material_id' || field === 'length_range' ? value : Number(value)
//     }));
//   };

//   const saveNewParameter = async () => {
//     try {
//       if (!newRowData.material_id || !newRowData.length_range) {
//         alert('Please select a material and enter a length range');
//         return;
//       }

//       setUpdating(true);
//       const response = await fetch(`${API_BASE_URL}/milling-parameters/add/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'accept': 'application/json'
//         },
//         body: JSON.stringify(newRowData)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || 'Failed to add parameters');
//       }

//       await fetchParameters();
//       setIsAddingNew(false);
//       setNewRowData({});
//       setError(null);
//       alert('New milling parameters added successfully!');
//     } catch (err) {
//       setError(err.message);
//       console.error('Error adding parameters:', err);
//       alert(`Error: ${err.message}`);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleExportToExcel = () => {
//     const exportData = parameters.map(param => ({
//       'ID': param.id,
//       'Material': param.material,
//       'Length Range': param.length_range,
//       'Roughing Feed Rate': param.roughing_feed_rate,
//       'Roughing Depth of Cut': param.roughing_depth_of_cut,
//       'Roughing Radial WOC': param.roughing_radial_woc,
//       'Finishing Feed Rate': param.finishing_feed_rate,
//       'Finishing Depth of Cut': param.finishing_depth_of_cut,
//       'Finishing Radial WOC': param.finishing_radial_woc
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const columnWidths = [
//       { wch: 8 }, { wch: 20 }, { wch: 15 }, { wch: 22 },
//       { wch: 25 }, { wch: 22 }, { wch: 22 }, { wch: 25 }, { wch: 22 }
//     ];
//     worksheet['!cols'] = columnWidths;

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Milling Parameters');

//     const timestamp = new Date().toISOString().split('T')[0];
//     const filename = `Milling_Parameters_${timestamp}.xlsx`;
//     XLSX.writeFile(workbook, filename);
//   };

//   // Pagination calculations
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = parameters.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(parameters.length / itemsPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   const isAdmin = userRole.toLowerCase() === 'admin';

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader className="w-8 h-8 text-[#246679] animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Milling Parameters</h2>
//         <div className="flex items-center space-x-3">
//           {isAdmin && (
//             <button
//               onClick={startAddingNew}
//               disabled={isAddingNew}
//               className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            
//             >
//               <Plus className="w-4 h-4" />
//               <span>Add parameter</span>
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
      
//       {error && (
//         <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
//           {error}
//         </div>
//       )}

//       <div className="bg-white rounded-lg shadow-md overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="bg-[#246679] text-white">
//               <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Material</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Length Range</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Feed Rate</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Depth of Cut</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Radial WOC</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Feed Rate</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Depth of Cut</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Radial WOC</th>
//               {isAdmin && (
//                 <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
//               )}
//             </tr>
//           </thead>
//           <tbody>
//             {/* New Row Form */}
//             {isAddingNew && (
//               <tr className="bg-green-50 border-2 border-green-300">
//                 <td className="px-6 py-4 text-sm text-gray-500">New</td>
//                 <td className="px-6 py-4 text-sm">
//                   <select
//                     value={newRowData.material_id}
//                     onChange={(e) => handleNewRowChange('material_id', e.target.value)}
//                     className="w-full px-2 py-1 border border-green-400 rounded focus:outline-none focus:border-[#246679] focus:ring-1 focus:ring-[#246679]"
//                   >
//                     <option value="">Select Material</option>
//                     {materials.map(mat => (
//                       <option key={mat.id} value={mat.id}>
//                         {mat.material}
//                       </option>
//                     ))}
//                   </select>
//                 </td>
//                 <td className="px-6 py-4 text-sm">
//                   <input
//                     type="text"
//                     value={newRowData.length_range}
//                     onChange={(e) => handleNewRowChange('length_range', e.target.value)}
//                     placeholder="e.g., 0-50"
//                     className="w-full px-2 py-1 border border-green-400 rounded focus:outline-none focus:border-[#246679] focus:ring-1 focus:ring-[#246679]"
//                   />
//                 </td>
//                 {[
//                   'roughing_feed_rate',
//                   'roughing_depth_of_cut',
//                   'roughing_radial_woc',
//                   'finishing_feed_rate',
//                   'finishing_depth_of_cut',
//                   'finishing_radial_woc'
//                 ].map(field => (
//                   <td key={field} className="px-6 py-4 text-sm">
//                     <input
//                       type="number"
//                       step="0.1"
//                       value={newRowData[field]}
//                       onChange={(e) => handleNewRowChange(field, e.target.value)}
//                       className="w-full px-2 py-1 border border-green-400 rounded focus:outline-none focus:border-[#246679] focus:ring-1 focus:ring-[#246679]"
//                     />
//                   </td>
//                 ))}
//                 <td className="px-6 py-4 text-center">
//                   <div className="flex gap-2 justify-center">
//                     <button
//                       onClick={saveNewParameter}
//                       disabled={updating}
//                       className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-medium transition-colors disabled:opacity-50"
//                     >
//                       <Save className="w-4 h-4" />
//                       {updating ? 'Saving...' : 'Save'}
//                     </button>
//                     <button
//                       onClick={cancelAddingNew}
//                       disabled={updating}
//                       className="inline-flex items-center gap-1 px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm font-medium transition-colors"
//                     >
//                       <X className="w-4 h-4" />
//                       Cancel
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             )}

//             {/* Existing Parameters */}
//             {currentItems.map((param, idx) => (
//               <tr
//                 key={param.id}
//                 className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
//                   editingId === param.id ? 'bg-blue-50' : ''
//                 } ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
//               >
//                 <td className="px-6 py-4 text-sm text-gray-900">{param.id}</td>
                
//                 <td className="px-6 py-4 text-sm">
//                   <span className="font-semibold text-[#246679]">{param.material}</span>
//                 </td>
                
//                 <td className="px-6 py-4 text-sm">
//                   {isAdmin && editingId === param.id ? (
//                     <input
//                       type="text"
//                       value={editData.new_length_range}
//                       onChange={(e) => handleFieldChange('new_length_range', e.target.value)}
//                       className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:border-[#246679] focus:ring-1 focus:ring-[#246679]"
//                       placeholder="e.g., 0-50, 51-100, >101"
//                     />
//                   ) : (
//                     <span className="text-gray-900">{param.length_range}</span>
//                   )}
//                 </td>
                
//                 {[
//                   'roughing_feed_rate',
//                   'roughing_depth_of_cut',
//                   'roughing_radial_woc',
//                   'finishing_feed_rate',
//                   'finishing_depth_of_cut',
//                   'finishing_radial_woc'
//                 ].map(field => (
//                   <td key={field} className="px-6 py-4 text-sm">
//                     {isAdmin && editingId === param.id ? (
//                       <input
//                         type="number"
//                         step="0.1"
//                         value={editData[field]}
//                         onChange={(e) => handleFieldChange(field, e.target.value)}
//                         className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:border-[#246679] focus:ring-1 focus:ring-[#246679]"
//                       />
//                     ) : (
//                       <span className="text-gray-900">{param[field]}</span>
//                     )}
//                   </td>
//                 ))}

//                 {isAdmin && (
//                   <td className="px-6 py-4 text-center">
//                     {editingId === param.id ? (
//                       <div className="flex gap-2 justify-center">
//                         <button
//                           onClick={saveChanges}
//                           disabled={updating}
//                           className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-medium transition-colors disabled:opacity-50"
//                         >
//                           <Save className="w-4 h-4" />
//                           {updating ? 'Saving...' : 'Save'}
//                         </button>
//                         <button
//                           onClick={cancelEditing}
//                           disabled={updating}
//                           className="inline-flex items-center gap-1 px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm font-medium transition-colors"
//                         >
//                           <X className="w-4 h-4" />
//                           Cancel
//                         </button>
//                       </div>
//                     ) : (
//                       <button
//                         onClick={() => startEditing(param)}
//                         className="inline-flex items-center gap-1 px-3 py-1 bg-[#246679] hover:bg-[#1f4d66] text-white rounded text-sm font-medium transition-colors"
//                       >
//                         <Edit2 className="w-4 h-4" />
//                         Update
//                       </button>
//                     )}
//                   </td>
//                 )}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="mt-4 flex items-center justify-between">
//           <div className="text-sm text-gray-600">
//             Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, parameters.length)} of {parameters.length} entries
//           </div>
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={() => paginate(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               <ChevronLeft className="w-5 h-5" />
//             </button>
//             {[...Array(totalPages)].map((_, index) => (
//               <button
//                 key={index + 1}
//                 onClick={() => paginate(index + 1)}
//                 className={`px-3 py-1 rounded transition-colors ${
//                   currentPage === index + 1
//                     ? 'bg-[#246679] text-white'
//                     : 'bg-gray-200 hover:bg-gray-300'
//                 }`}
//               >
//                 {index + 1}
//               </button>
//             ))}
//             <button
//               onClick={() => paginate(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               <ChevronRight className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       )}

//       {parameters.length === 0 && (
//         <div className="text-center py-8 text-gray-500">
//           No milling parameters found
//         </div>
//       )}

//       {!isAdmin && (
//         <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//           <p className="text-sm text-yellow-800">
//             <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update milling parameters.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MillingParametersComponent;



import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, Loader, ArrowLeft, Download, Plus, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import * as XLSX from 'xlsx';

const MillingParametersComponent = ({ onBack }) => {
  const [parameters, setParameters] = useState([]);
  const [filteredParameters, setFilteredParameters] = useState([]);
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

  // Fetch all parameters and materials
  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    setUserRole(userData.role || '');
    fetchParameters();
    fetchMaterials();
  }, []);

  // Filter parameters based on search term
  useEffect(() => {
    const filtered = parameters.filter(param =>
      param.material.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredParameters(filtered);
    setCurrentPage(1);
  }, [parameters, searchTerm]);

  const fetchParameters = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/milling-parameters/`);
      if (!response.ok) throw new Error('Failed to fetch parameters');
      const data = await response.json();
      const sortedData = [...data].sort((a, b) => a.id - b.id);
      setParameters(sortedData);
      setFilteredParameters(sortedData);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching parameters:', err);
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

  const startEditing = (param) => {
    setEditingId(param.id);
    setEditData({
      material: param.material,
      material_id: param.material_id,
      old_length_range: param.length_range,
      new_length_range: param.length_range,
      roughing_feed_rate: param.roughing_feed_rate,
      roughing_depth_of_cut: param.roughing_depth_of_cut,
      roughing_radial_woc: param.roughing_radial_woc,
      finishing_feed_rate: param.finishing_feed_rate,
      finishing_depth_of_cut: param.finishing_depth_of_cut,
      finishing_radial_woc: param.finishing_radial_woc
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleFieldChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: field === 'new_length_range' ? value : Number(value)
    }));
  };

  const saveChanges = async () => {
    try {
      setUpdating(true);
      const updatePayload = {
        material: editData.material,
        old_length_range: editData.old_length_range,
        new_length_range: editData.new_length_range,
        roughing_feed_rate: editData.roughing_feed_rate,
        roughing_depth_of_cut: editData.roughing_depth_of_cut,
        roughing_radial_woc: editData.roughing_radial_woc,
        finishing_feed_rate: editData.finishing_feed_rate,
        finishing_depth_of_cut: editData.finishing_depth_of_cut,
        finishing_radial_woc: editData.finishing_radial_woc
      };

      const response = await fetch(`${API_BASE_URL}/milling-parameters/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update parameters');
      }

      await fetchParameters();
      setEditingId(null);
      setEditData({});
      setError(null);
      alert('Milling parameters updated successfully!');
    } catch (err) {
      setError(err.message);
      console.error('Error updating parameters:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  // Add new parameter functions
  const startAddingNew = () => {
    setIsAddingNew(true);
    setNewRowData({
      material_id: '',
      length_range: '',
      roughing_feed_rate: 0,
      roughing_depth_of_cut: 0,
      roughing_radial_woc: 0,
      finishing_feed_rate: 0,
      finishing_depth_of_cut: 0,
      finishing_radial_woc: 0
    });
  };

  const cancelAddingNew = () => {
    setIsAddingNew(false);
    setNewRowData({});
  };

  const handleNewRowChange = (field, value) => {
    setNewRowData(prev => ({
      ...prev,
      [field]: field === 'material_id' || field === 'length_range' ? value : Number(value)
    }));
  };

  const saveNewParameter = async () => {
    try {
      if (!newRowData.material_id || !newRowData.length_range) {
        alert('Please select a material and enter a length range');
        return;
      }

      setUpdating(true);
      const response = await fetch(`${API_BASE_URL}/milling-parameters/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(newRowData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add parameters');
      }

      await fetchParameters();
      setIsAddingNew(false);
      setNewRowData({});
      setError(null);
      alert('New milling parameters added successfully!');
    } catch (err) {
      setError(err.message);
      console.error('Error adding parameters:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleExportToExcel = () => {
    const exportData = filteredParameters.map(param => ({
      'ID': param.id,
      'Material': param.material,
      'Length Range': param.length_range,
      'Roughing Feed Rate': param.roughing_feed_rate,
      'Roughing Depth of Cut': param.roughing_depth_of_cut,
      'Roughing Radial WOC': param.roughing_radial_woc,
      'Finishing Feed Rate': param.finishing_feed_rate,
      'Finishing Depth of Cut': param.finishing_depth_of_cut,
      'Finishing Radial WOC': param.finishing_radial_woc
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const columnWidths = [
      { wch: 8 }, { wch: 20 }, { wch: 15 }, { wch: 22 },
      { wch: 25 }, { wch: 22 }, { wch: 22 }, { wch: 25 }, { wch: 22 }
    ];
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Milling Parameters');

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `Milling_Parameters_${timestamp}.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredParameters.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredParameters.length / itemsPerPage);

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

  const isAdmin = userRole.toLowerCase() === 'admin';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-[#246679] animate-spin" />
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
        <h2 className="text-2xl font-bold text-gray-800">Milling Parameters </h2>
        <div className="flex items-center space-x-3">
          {isAdmin && (
            <button
              onClick={startAddingNew}
              disabled={isAddingNew}
              className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>Add parameter</span>
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
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

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
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredParameters.length)} of {filteredParameters.length} parameters
        </p> */}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#246679] text-white">
              <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Material</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Length Range</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Feed Rate</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Depth of Cut</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Radial WOC</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Feed Rate</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Depth of Cut</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Radial WOC</th>
              {isAdmin && (
                <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {/* New Row Form */}
            {isAddingNew && (
              <tr className="bg-green-50 border-2 border-green-300">
                <td className="px-6 py-4 text-sm text-gray-500">New</td>
                <td className="px-6 py-4 text-sm">
                  <select
                    value={newRowData.material_id}
                    onChange={(e) => handleNewRowChange('material_id', e.target.value)}
                    className="w-full px-2 py-1 border border-green-400 rounded focus:outline-none focus:border-[#246679] focus:ring-1 focus:ring-[#246679]"
                  >
                    <option value="">Select Material</option>
                    {materials.map(mat => (
                      <option key={mat.id} value={mat.id}>
                        {mat.material}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-sm">
                  <input
                    type="text"
                    value={newRowData.length_range}
                    onChange={(e) => handleNewRowChange('length_range', e.target.value)}
                    placeholder="e.g., 0-50"
                    className="w-full px-2 py-1 border border-green-400 rounded focus:outline-none focus:border-[#246679] focus:ring-1 focus:ring-[#246679]"
                  />
                </td>
                {[
                  'roughing_feed_rate',
                  'roughing_depth_of_cut',
                  'roughing_radial_woc',
                  'finishing_feed_rate',
                  'finishing_depth_of_cut',
                  'finishing_radial_woc'
                ].map(field => (
                  <td key={field} className="px-6 py-4 text-sm">
                    <input
                      type="number"
                      step="0.1"
                      value={newRowData[field]}
                      onChange={(e) => handleNewRowChange(field, e.target.value)}
                      className="w-full px-2 py-1 border border-green-400 rounded focus:outline-none focus:border-[#246679] focus:ring-1 focus:ring-[#246679]"
                    />
                  </td>
                ))}
                <td className="px-6 py-4 text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={saveNewParameter}
                      disabled={updating}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {updating ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={cancelAddingNew}
                      disabled={updating}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm font-medium transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {/* Existing Parameters */}
            {currentItems.map((param, idx) => (
              <tr
                key={param.id}
                className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                  editingId === param.id ? 'bg-blue-50' : ''
                } ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="px-6 py-4 text-sm text-gray-900">{param.id}</td>
                
                <td className="px-6 py-4 text-sm">
                  <span className="font-semibold text-[#246679]">{param.material}</span>
                </td>
                
                <td className="px-6 py-4 text-sm">
                  {isAdmin && editingId === param.id ? (
                    <input
                      type="text"
                      value={editData.new_length_range}
                      onChange={(e) => handleFieldChange('new_length_range', e.target.value)}
                      className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:border-[#246679] focus:ring-1 focus:ring-[#246679]"
                      placeholder="e.g., 0-50, 51-100, >101"
                    />
                  ) : (
                    <span className="text-gray-900">{param.length_range}</span>
                  )}
                </td>
                
                {[
                  'roughing_feed_rate',
                  'roughing_depth_of_cut',
                  'roughing_radial_woc',
                  'finishing_feed_rate',
                  'finishing_depth_of_cut',
                  'finishing_radial_woc'
                ].map(field => (
                  <td key={field} className="px-6 py-4 text-sm">
                    {isAdmin && editingId === param.id ? (
                      <input
                        type="number"
                        step="0.1"
                        value={editData[field]}
                        onChange={(e) => handleFieldChange(field, e.target.value)}
                        className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:border-[#246679] focus:ring-1 focus:ring-[#246679]"
                      />
                    ) : (
                      <span className="text-gray-900">{param[field]}</span>
                    )}
                  </td>
                ))}

                {isAdmin && (
                  <td className="px-6 py-4 text-center">
                    {editingId === param.id ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={saveChanges}
                          disabled={updating}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          {updating ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={cancelEditing}
                          disabled={updating}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm font-medium transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditing(param)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#246679] hover:bg-[#1f4d66] text-white rounded text-sm font-medium transition-colors"
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
      </div>

      {/* Pagination */}
      {filteredParameters.length > itemsPerPage && (
        <div className="mt-4 px-6 py-4 bg-white rounded-lg shadow-md flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredParameters.length)} of {filteredParameters.length} entries
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

      {filteredParameters.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No milling parameters found matching "{searchTerm}"
        </div>
      )}

      {!isAdmin && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update milling parameters.
          </p>
        </div>
      )}
    </div>
  );
};

export default MillingParametersComponent;