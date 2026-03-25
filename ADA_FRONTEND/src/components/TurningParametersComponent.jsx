// import React from "react";
// import { ArrowLeft } from "lucide-react";

// const TurningParametersComponent = ({ onBack }) => {
//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Turning Parameters</h2>
//         <button
//           onClick={onBack}
//           className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           <span>Back to Overview</span>
//         </button>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow">
//         <p className="text-gray-700">Turning parameters setup content goes here...</p>
//       </div>
//     </div>
//   );
// };

// export default TurningParametersComponent;




//''''first working code''''''//

// import React, { useState, useEffect } from "react";
// import { ArrowLeft, Edit2, Save, X, AlertCircle } from "lucide-react";

// const TurningParametersComponent = ({ onBack }) => {
//   const [parameters, setParameters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [updating, setUpdating] = useState(false);

//   // Fetch turning parameters
//   useEffect(() => {
//     const fetchParameters = async () => {
//       try {
//         setLoading(true);

//         const response = await fetch(
//           "http://172.18.100.156:8004/turning-parameters/"
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();

//         if (Array.isArray(data)) {
//           setParameters(data);
//         } else if (data.data && Array.isArray(data.data)) {
//           setParameters(data.data);
//         } else if (data.results && Array.isArray(data.results)) {
//           setParameters(data.results);
//         } else {
//           throw new Error("Unexpected API response structure");
//         }

//         setError(null);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchParameters();
//   }, []);

//   const handleEdit = (param) => {
//     setEditingId(param.id);
//     setEditedData({ ...param });
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedData({});
//   };

//   const handleInputChange = (field, value) => {
//     setEditedData((prev) => ({
//       ...prev,
//       [field]: Number(value),
//     }));
//   };

//   const handleUpdate = async () => {
//     try {
//       setUpdating(true);

//       const response = await fetch(
//         "http://172.18.100.156:8004/turning-parameters/update/",
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(editedData),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       alert("Turning parameter updated successfully");

//       // Update local state while preserving order and other fields
//       setParameters((prev) =>
//         prev.map((p) => (p.id === editedData.id ? { ...p, ...editedData } : p))
//       );

//       setEditingId(null);
//       setEditedData({});
//     } catch (err) {
//       alert("Error updating parameter: " + err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="flex flex-col items-center space-y-3">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#246679]"></div>
//           <div className="text-gray-600">Loading parameters...</div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
//           <div className="flex items-center space-x-3 mb-3">
//             <AlertCircle className="w-6 h-6 text-red-600" />
//             <h3 className="text-lg font-semibold text-red-800">Error Loading Data</h3>
//           </div>
//           <p className="text-red-700 mb-4">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (parameters.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64">
//         <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
//         <h3 className="text-xl font-semibold text-gray-700 mb-2">No Parameters Found</h3>
//         <p className="text-gray-500">The API returned successfully but no data is available.</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Turning Efficiency</h2>
//         <button
//           onClick={onBack}
//           className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           <span>Back to Overview</span>
//         </button>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-[#246679] text-white">
//               <tr>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Material ID</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Diameter Range</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Depth</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Feed</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Speed</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Depth</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Feed</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Speed</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {parameters.map((param) => (
//                 <tr key={param.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 text-sm text-gray-700">{param.material_id}</td>
//                   <td className="px-6 py-4 text-sm text-gray-700">{param.diameter_range}</td>

//                   {[
//                     "roughing_depth_of_cut",
//                     "roughing_feed_rate",
//                     "roughing_cutting_speed",
//                     "finishing_depth_of_cut",
//                     "finishing_feed_rate",
//                     "finishing_cutting_speed",
//                   ].map((field) => (
//                     <td key={field} className="px-6 py-4 text-sm">
//                       {editingId === param.id ? (
//                         <input
//                           type="number"
//                           step="0.01"
//                           value={editedData[field]}
//                           onChange={(e) => handleInputChange(field, e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                         />
//                       ) : (
//                         <span className="text-gray-700">{param[field]}</span>
//                       )}
//                     </td>
//                   ))}

//                   {/* Action buttons */}
//                   <td className="px-6 py-4 text-sm">
//                     {editingId === param.id ? (
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={handleUpdate}
//                           disabled={updating}
//                           className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
//                         >
//                           <Save className="w-4 h-4" />
//                           <span>{updating ? "Saving..." : "Save"}</span>
//                         </button>
//                         <button
//                           onClick={handleCancel}
//                           disabled={updating}
//                           className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
//                         >
//                           <X className="w-4 h-4" />
//                           <span>Cancel</span>
//                         </button>
//                       </div>
//                     ) : (
//                       <button
//                         onClick={() => handleEdit(param)}
//                         className="flex items-center space-x-1 px-3 py-1 bg-[#246679] text-white rounded hover:bg-[#1f5766] transition-colors duration-200"
//                       >
//                         <Edit2 className="w-4 h-4" />
//                         <span>Edit</span>
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

// export default TurningParametersComponent;






//'''update new logic based on admin role action column is displayed
// import React, { useState, useEffect } from "react";
// import { ArrowLeft, Edit2, Save, X, AlertCircle } from "lucide-react";

// const TurningParametersComponent = ({ onBack }) => {
//   const [parameters, setParameters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [updating, setUpdating] = useState(false);
//   const [userRole, setUserRole] = useState('');

//   // Fetch turning parameters
//   useEffect(() => {
//     // Get user role from sessionStorage
//     const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
//     setUserRole(userData.role || '');
    
//     const fetchParameters = async () => {
//       try {
//         setLoading(true);

//         const response = await fetch(
//           "http://172.18.100.156:8004/turning-parameters/"
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();

//         if (Array.isArray(data)) {
//           setParameters(data);
//         } else if (data.data && Array.isArray(data.data)) {
//           setParameters(data.data);
//         } else if (data.results && Array.isArray(data.results)) {
//           setParameters(data.results);
//         } else {
//           throw new Error("Unexpected API response structure");
//         }

//         setError(null);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchParameters();
//   }, []);

//   const handleEdit = (param) => {
//     setEditingId(param.id);
//     setEditedData({ ...param });
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedData({});
//   };

//   const handleInputChange = (field, value) => {
//     setEditedData((prev) => ({
//       ...prev,
//       [field]: Number(value),
//     }));
//   };

//   const handleUpdate = async () => {
//     try {
//       setUpdating(true);

//       const response = await fetch(
//         "http://172.18.100.156:8004/turning-parameters/update/",
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(editedData),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       alert("Turning parameter updated successfully");

//       // Update local state while preserving order and other fields
//       setParameters((prev) =>
//         prev.map((p) => (p.id === editedData.id ? { ...p, ...editedData } : p))
//       );

//       setEditingId(null);
//       setEditedData({});
//     } catch (err) {
//       alert("Error updating parameter: " + err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // Check if user is admin
//   const isAdmin = userRole.toLowerCase() === 'admin';

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="flex flex-col items-center space-y-3">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#246679]"></div>
//           <div className="text-gray-600">Loading parameters...</div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
//           <div className="flex items-center space-x-3 mb-3">
//             <AlertCircle className="w-6 h-6 text-red-600" />
//             <h3 className="text-lg font-semibold text-red-800">Error Loading Data</h3>
//           </div>
//           <p className="text-red-700 mb-4">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (parameters.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64">
//         <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
//         <h3 className="text-xl font-semibold text-gray-700 mb-2">No Parameters Found</h3>
//         <p className="text-gray-500">The API returned successfully but no data is available.</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Turning Efficiency</h2>
//         <button
//           onClick={onBack}
//           className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           <span>Back to Overview</span>
//         </button>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-[#246679] text-white">
//               <tr>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Material ID</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Diameter Range</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Depth</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Feed</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Speed</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Depth</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Feed</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Speed</th>
//                 {isAdmin && (
//                   <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {parameters.map((param) => (
//                 <tr key={param.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 text-sm text-gray-700">{param.material_id}</td>
//                   <td className="px-6 py-4 text-sm text-gray-700">{param.diameter_range}</td>

//                   {[
//                     "roughing_depth_of_cut",
//                     "roughing_feed_rate",
//                     "roughing_cutting_speed",
//                     "finishing_depth_of_cut",
//                     "finishing_feed_rate",
//                     "finishing_cutting_speed",
//                   ].map((field) => (
//                     <td key={field} className="px-6 py-4 text-sm">
//                       {isAdmin && editingId === param.id ? (
//                         <input
//                           type="number"
//                           step="0.01"
//                           value={editedData[field]}
//                           onChange={(e) => handleInputChange(field, e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                         />
//                       ) : (
//                         <span className="text-gray-700">{param[field]}</span>
//                       )}
//                     </td>
//                   ))}

//                   {/* Action buttons */}
//                   {isAdmin && (
//                     <td className="px-6 py-4 text-sm">
//                       {editingId === param.id ? (
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={handleUpdate}
//                             disabled={updating}
//                             className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
//                           >
//                             <Save className="w-4 h-4" />
//                             <span>{updating ? "Saving..." : "Save"}</span>
//                           </button>
//                           <button
//                             onClick={handleCancel}
//                             disabled={updating}
//                             className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
//                           >
//                             <X className="w-4 h-4" />
//                             <span>Cancel</span>
//                           </button>
//                         </div>
//                       ) : (
//                         <button
//                           onClick={() => handleEdit(param)}
//                           className="flex items-center space-x-1 px-3 py-1 bg-[#246679] text-white rounded hover:bg-[#1f5766] transition-colors duration-200"
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
//             <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update turning parameters.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TurningParametersComponent;







// import React, { useState, useEffect } from "react";
// import { ArrowLeft, Edit2, Save, X, AlertCircle } from "lucide-react";

// const TurningParametersComponent = ({ onBack }) => {
//   const [parameters, setParameters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [updating, setUpdating] = useState(false);
//   const [userRole, setUserRole] = useState('');

//   // Fetch turning parameters
//   useEffect(() => {
//     // Get user role from sessionStorage
//     const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
//     setUserRole(userData.role || '');
    
//     const fetchParameters = async () => {
//       try {
//         setLoading(true);

//         const response = await fetch(
//           "http://172.18.100.156:8004/turning-parameters/"
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();

//         let parsedData = [];
//         if (Array.isArray(data)) {
//           parsedData = data;
//         } else if (data.data && Array.isArray(data.data)) {
//           parsedData = data.data;
//         } else if (data.results && Array.isArray(data.results)) {
//           parsedData = data.results;
//         } else {
//           throw new Error("Unexpected API response structure");
//         }

//         // Sort by ID to maintain consistent order
//         const sortedData = [...parsedData].sort((a, b) => a.id - b.id);
//         setParameters(sortedData);
//         setError(null);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchParameters();
//   }, []);

//   const handleEdit = (param) => {
//     setEditingId(param.id);
//     setEditedData({ ...param });
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedData({});
//   };

//   const handleInputChange = (field, value) => {
//     setEditedData((prev) => ({
//       ...prev,
//       [field]: Number(value),
//     }));
//   };

//   const handleUpdate = async () => {
//     try {
//       setUpdating(true);

//       const response = await fetch(
//         "http://172.18.100.156:8004/turning-parameters/update/",
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(editedData),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       alert("Turning parameter updated successfully");

//       // Update local state while maintaining order - find by index
//       setParameters((prev) => {
//         const index = prev.findIndex(p => p.id === editedData.id);
//         if (index !== -1) {
//           const updated = [...prev];
//           updated[index] = { ...updated[index], ...editedData };
//           return updated;
//         }
//         return prev;
//       });

//       setEditingId(null);
//       setEditedData({});
//     } catch (err) {
//       alert("Error updating parameter: " + err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // Check if user is admin
//   const isAdmin = userRole.toLowerCase() === 'admin';

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="flex flex-col items-center space-y-3">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#246679]"></div>
//           <div className="text-gray-600">Loading parameters...</div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
//           <div className="flex items-center space-x-3 mb-3">
//             <AlertCircle className="w-6 h-6 text-red-600" />
//             <h3 className="text-lg font-semibold text-red-800">Error Loading Data</h3>
//           </div>
//           <p className="text-red-700 mb-4">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (parameters.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64">
//         <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
//         <h3 className="text-xl font-semibold text-gray-700 mb-2">No Parameters Found</h3>
//         <p className="text-gray-500">The API returned successfully but no data is available.</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Turning Efficiency</h2>
//         <button
//           onClick={onBack}
//           className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           <span>Back to Overview</span>
//         </button>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-[#246679] text-white">
//               <tr>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Material ID</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Diameter Range</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Depth</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Feed</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Speed</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Depth</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Feed</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Speed</th>
//                 {isAdmin && (
//                   <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {parameters.map((param) => (
//                 <tr key={param.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 text-sm text-gray-700">{param.material_id}</td>
//                   <td className="px-6 py-4 text-sm text-gray-700">{param.diameter_range}</td>

//                   {[
//                     "roughing_depth_of_cut",
//                     "roughing_feed_rate",
//                     "roughing_cutting_speed",
//                     "finishing_depth_of_cut",
//                     "finishing_feed_rate",
//                     "finishing_cutting_speed",
//                   ].map((field) => (
//                     <td key={field} className="px-6 py-4 text-sm">
//                       {isAdmin && editingId === param.id ? (
//                         <input
//                           type="number"
//                           step="0.01"
//                           value={editedData[field]}
//                           onChange={(e) => handleInputChange(field, e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                         />
//                       ) : (
//                         <span className="text-gray-700">{param[field]}</span>
//                       )}
//                     </td>
//                   ))}

//                   {/* Action buttons */}
//                   {isAdmin && (
//                     <td className="px-6 py-4 text-sm">
//                       {editingId === param.id ? (
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={handleUpdate}
//                             disabled={updating}
//                             className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
//                           >
//                             <Save className="w-4 h-4" />
//                             <span>{updating ? "Saving..." : "Save"}</span>
//                           </button>
//                           <button
//                             onClick={handleCancel}
//                             disabled={updating}
//                             className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
//                           >
//                             <X className="w-4 h-4" />
//                             <span>Cancel</span>
//                           </button>
//                         </div>
//                       ) : (
//                         <button
//                           onClick={() => handleEdit(param)}
//                           className="flex items-center space-x-1 px-3 py-1 bg-[#246679] text-white rounded hover:bg-[#1f5766] transition-colors duration-200"
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
//             <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update turning parameters.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TurningParametersComponent;











//'''''this below code added the export to excel button to download the data into  excelformatt''''''// 
// import React, { useState, useEffect } from "react";
// import { ArrowLeft, Edit2, Save, X, AlertCircle, Download } from "lucide-react";

// const TurningParametersComponent = ({ onBack }) => {
//   const [parameters, setParameters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [updating, setUpdating] = useState(false);
//   const [userRole, setUserRole] = useState('');

//   // Fetch turning parameters
//   useEffect(() => {
//     // Get user role from sessionStorage
//     const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
//     setUserRole(userData.role || '');
    
//     const fetchParameters = async () => {
//       try {
//         setLoading(true);

//         const response = await fetch(
//           "http://172.18.100.156:8004/turning-parameters/"
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();

//         let parsedData = [];
//         if (Array.isArray(data)) {
//           parsedData = data;
//         } else if (data.data && Array.isArray(data.data)) {
//           parsedData = data.data;
//         } else if (data.results && Array.isArray(data.results)) {
//           parsedData = data.results;
//         } else {
//           throw new Error("Unexpected API response structure");
//         }

//         // Sort by ID to maintain consistent order
//         const sortedData = [...parsedData].sort((a, b) => a.id - b.id);
//         setParameters(sortedData);
//         setError(null);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchParameters();
//   }, []);

//   const handleEdit = (param) => {
//     setEditingId(param.id);
//     setEditedData({ ...param });
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedData({});
//   };

//   const handleInputChange = (field, value) => {
//     setEditedData((prev) => ({
//       ...prev,
//       [field]: Number(value),
//     }));
//   };

//   const handleUpdate = async () => {
//     try {
//       setUpdating(true);

//       const response = await fetch(
//         "http://172.18.100.156:8004/turning-parameters/update/",
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(editedData),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       alert("Turning parameter updated successfully");

//       // Update local state while maintaining order - find by index
//       setParameters((prev) => {
//         const index = prev.findIndex(p => p.id === editedData.id);
//         if (index !== -1) {
//           const updated = [...prev];
//           updated[index] = { ...updated[index], ...editedData };
//           return updated;
//         }
//         return prev;
//       });

//       setEditingId(null);
//       setEditedData({});
//     } catch (err) {
//       alert("Error updating parameter: " + err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const exportToExcel = () => {
//     if (parameters.length === 0) {
//       alert("No data to export");
//       return;
//     }

//     // Define headers
//     const headers = [
//       "Material ID",
//       "Diameter Range",
//       "Roughing Depth of Cut",
//       "Roughing Feed Rate",
//       "Roughing Cutting Speed",
//       "Finishing Depth of Cut",
//       "Finishing Feed Rate",
//       "Finishing Cutting Speed"
//     ];

//     // Create CSV content
//     let csvContent = headers.join(",") + "\n";

//     parameters.forEach(param => {
//       const row = [
//         param.material_id,
//         `"${param.diameter_range}"`,
//         param.roughing_depth_of_cut,
//         param.roughing_feed_rate,
//         param.roughing_cutting_speed,
//         param.finishing_depth_of_cut,
//         param.finishing_feed_rate,
//         param.finishing_cutting_speed
//       ];
//       csvContent += row.join(",") + "\n";
//     });

//     // Create blob and download
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
    
//     link.setAttribute("href", url);
//     link.setAttribute("download", `Turning_Parameters_${new Date().toISOString().split('T')[0]}.csv`);
//     link.style.visibility = "hidden";
    
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Check if user is admin
//   const isAdmin = userRole.toLowerCase() === 'admin';

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="flex flex-col items-center space-y-3">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#246679]"></div>
//           <div className="text-gray-600">Loading parameters...</div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
//           <div className="flex items-center space-x-3 mb-3">
//             <AlertCircle className="w-6 h-6 text-red-600" />
//             <h3 className="text-lg font-semibold text-red-800">Error Loading Data</h3>
//           </div>
//           <p className="text-red-700 mb-4">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (parameters.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64">
//         <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
//         <h3 className="text-xl font-semibold text-gray-700 mb-2">No Parameters Found</h3>
//         <p className="text-gray-500">The API returned successfully but no data is available.</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Turning Efficiency</h2>
//         <div className="flex items-center space-x-3">
//           <button
//             onClick={exportToExcel}
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

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-[#246679] text-white">
//               <tr>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Material ID</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Diameter Range</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Depth</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Feed</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Speed</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Depth</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Feed</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Speed</th>
//                 {isAdmin && (
//                   <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {parameters.map((param) => (
//                 <tr key={param.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 text-sm text-gray-700">{param.material_id}</td>
//                   <td className="px-6 py-4 text-sm text-gray-700">{param.diameter_range}</td>

//                   {[
//                     "roughing_depth_of_cut",
//                     "roughing_feed_rate",
//                     "roughing_cutting_speed",
//                     "finishing_depth_of_cut",
//                     "finishing_feed_rate",
//                     "finishing_cutting_speed",
//                   ].map((field) => (
//                     <td key={field} className="px-6 py-4 text-sm">
//                       {isAdmin && editingId === param.id ? (
//                         <input
//                           type="number"
//                           step="0.01"
//                           value={editedData[field]}
//                           onChange={(e) => handleInputChange(field, e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                         />
//                       ) : (
//                         <span className="text-gray-700">{param[field]}</span>
//                       )}
//                     </td>
//                   ))}

//                   {/* Action buttons */}
//                   {isAdmin && (
//                     <td className="px-6 py-4 text-sm">
//                       {editingId === param.id ? (
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={handleUpdate}
//                             disabled={updating}
//                             className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
//                           >
//                             <Save className="w-4 h-4" />
//                             <span>{updating ? "Saving..." : "Save"}</span>
//                           </button>
//                           <button
//                             onClick={handleCancel}
//                             disabled={updating}
//                             className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
//                           >
//                             <X className="w-4 h-4" />
//                             <span>Cancel</span>
//                           </button>
//                         </div>
//                       ) : (
//                         <button
//                           onClick={() => handleEdit(param)}
//                           className="flex items-center space-x-1 px-3 py-1 bg-[#246679] text-white rounded hover:bg-[#1f5766] transition-colors duration-200"
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
//             <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update turning parameters.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TurningParametersComponent;




import React, { useState, useEffect } from "react";
import { ArrowLeft, Edit2, Save, X, AlertCircle, Download, Plus, Search, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

const TurningParametersComponent = ({ onBack }) => {
  const [parameters, setParameters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [updating, setUpdating] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newParameter, setNewParameter] = useState({
    material_id: '',
    diameter_range: '',
    roughing_depth_of_cut: 0,
    roughing_feed_rate: 0,
    roughing_cutting_speed: 0,
    finishing_depth_of_cut: 0,
    finishing_feed_rate: 0,
    finishing_cutting_speed: 0
  });
  const [materials, setMaterials] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const itemsPerPage = 10;

  // Fetch materials for dropdown
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch("http://172.18.100.156:8004/turning-materials/");
        if (response.ok) {
          const data = await response.json();
          setMaterials(Array.isArray(data) ? data : data.data || []);
        }
      } catch (err) {
        console.error("Error fetching materials:", err);
      }
    };
    fetchMaterials();
  }, []);

  // Fetch turning parameters
  const fetchParameters = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://172.18.100.156:8004/turning-parameters/"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      let parsedData = [];
      if (Array.isArray(data)) {
        parsedData = data;
      } else if (data.data && Array.isArray(data.data)) {
        parsedData = data.data;
      } else if (data.results && Array.isArray(data.results)) {
        parsedData = data.results;
      } else {
        throw new Error("Unexpected API response structure");
      }

      const sortedData = [...parsedData].sort((a, b) => a.id - b.id);
      setParameters(sortedData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    setUserRole(userData.role || '');
    fetchParameters();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchParameters();
    setRefreshing(false);
  };

  const handleEdit = (param) => {
    setEditingId(param.id);
    setEditedData({ 
      ...param,
      old_diameter_range: param.diameter_range,
      new_diameter_range: param.diameter_range
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedData({});
  };

  const handleInputChange = (field, value) => {
    if (field === 'diameter_range') {
      setEditedData((prev) => ({
        ...prev,
        new_diameter_range: value,
      }));
    } else {
      setEditedData((prev) => ({
        ...prev,
        [field]: Number(value),
      }));
    }
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);

      const updatePayload = {
        material: editedData.material,
        old_diameter_range: editedData.old_diameter_range,
        new_diameter_range: editedData.new_diameter_range,
        roughing_depth_of_cut: editedData.roughing_depth_of_cut,
        roughing_feed_rate: editedData.roughing_feed_rate,
        roughing_cutting_speed: editedData.roughing_cutting_speed,
        finishing_depth_of_cut: editedData.finishing_depth_of_cut,
        finishing_feed_rate: editedData.finishing_feed_rate,
        finishing_cutting_speed: editedData.finishing_cutting_speed
      };

      const response = await fetch(
        "http://172.18.100.156:8004/turning-parameters/update/",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatePayload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      alert("Turning parameter updated successfully");

      // Refresh the list
      await fetchParameters();

      setEditingId(null);
      setEditedData({});
    } catch (err) {
      alert("Error updating parameter: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewParameter({
      material_id: '',
      diameter_range: '',
      roughing_depth_of_cut: 0,
      roughing_feed_rate: 0,
      roughing_cutting_speed: 0,
      finishing_depth_of_cut: 0,
      finishing_feed_rate: 0,
      finishing_cutting_speed: 0
    });
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
    setNewParameter({
      material_id: '',
      diameter_range: '',
      roughing_depth_of_cut: 0,
      roughing_feed_rate: 0,
      roughing_cutting_speed: 0,
      finishing_depth_of_cut: 0,
      finishing_feed_rate: 0,
      finishing_cutting_speed: 0
    });
  };

  const handleNewParameterChange = (field, value) => {
    setNewParameter((prev) => ({
      ...prev,
      [field]: field === 'material_id' || field === 'diameter_range' ? value : Number(value),
    }));
  };

  const handleSaveNew = async () => {
    if (!newParameter.material_id || !newParameter.diameter_range) {
      alert("Please select material and enter diameter range");
      return;
    }

    try {
      setUpdating(true);

      const response = await fetch(
        "http://172.18.100.156:8004/turning-parameters/add/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newParameter),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      alert("New turning parameter added successfully");

      // Refresh the parameters list
      await fetchParameters();

      setIsAddingNew(false);
      setNewParameter({
        material_id: '',
        diameter_range: '',
        roughing_depth_of_cut: 0,
        roughing_feed_rate: 0,
        roughing_cutting_speed: 0,
        finishing_depth_of_cut: 0,
        finishing_feed_rate: 0,
        finishing_cutting_speed: 0
      });
    } catch (err) {
      alert("Error adding parameter: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const exportToExcel = () => {
    if (parameters.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = [
      "Material",
      "Diameter Range",
      "Roughing Depth of Cut",
      "Roughing Feed Rate",
      "Roughing Cutting Speed",
      "Finishing Depth of Cut",
      "Finishing Feed Rate",
      "Finishing Cutting Speed"
    ];

    let csvContent = headers.join(",") + "\n";

    parameters.forEach(param => {
      const row = [
        `"${param.material || ''}"`,
        `"${param.diameter_range}"`,
        param.roughing_depth_of_cut,
        param.roughing_feed_rate,
        param.roughing_cutting_speed,
        param.finishing_depth_of_cut,
        param.finishing_feed_rate,
        param.finishing_cutting_speed
      ];
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `Turning_Parameters_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter parameters based on search term
  const filteredParameters = parameters.filter(param => 
    param.material?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredParameters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredParameters.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const isAdmin = userRole.toLowerCase() === 'admin';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#246679]"></div>
          <div className="text-gray-600">Loading parameters...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center space-x-3 mb-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-800">Error Loading Data</h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
            <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Overview</span>
          </button>
        <h2 className="text-2xl font-bold text-gray-800">Turning Parameters</h2>
        <div className="flex items-center space-x-3">
          {/* <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button> */}
          {isAdmin && (
          <button
            onClick={handleAddNew}
            disabled={isAddingNew}
            className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            
          >
            <Plus className="w-4 h-4" />
            <span>Add Parameter</span>
          </button>
        )}
          <button
            onClick={exportToExcel}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Export to Excel</span>
          </button>
      
          {/* <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Overview</span>
          </button> */}
        </div>
      </div>

      {/* Search Bar and Add Button */}
      <div className="flex items-center justify-between mb-4 space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by material..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
          />
        </div>
        {/* {isAdmin && (
          <button
            onClick={handleAddNew}
            disabled={isAddingNew}
            className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            
          >
            <Plus className="w-4 h-4" />
            <span>Add Parameter</span>
          </button>
        )} */}
      </div>

      {/* Pagination Info */}
      {/* <div className="mb-3 text-sm text-gray-600">
        Showing {startIndex + 1} to {Math.min(endIndex, filteredParameters.length)} of {filteredParameters.length} entries
      </div> */}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#246679] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Material</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Diameter Range</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Depth</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Feed</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Speed</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Depth</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Feed</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Speed</th>
                {isAdmin && (
                  <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* New Parameter Row */}
              {isAddingNew && (
                <tr className="bg-green-50">
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={newParameter.material_id}
                      onChange={(e) => handleNewParameterChange('material_id', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    >
                      <option value="">Select Material</option>
                      {materials.map(mat => (
                        <option key={mat.id} value={mat.id}>{mat.material}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <input
                      type="text"
                      placeholder="e.g., 0-50"
                      value={newParameter.diameter_range}
                      onChange={(e) => handleNewParameterChange('diameter_range', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    />
                  </td>
                  {[
                    "roughing_depth_of_cut",
                    "roughing_feed_rate",
                    "roughing_cutting_speed",
                    "finishing_depth_of_cut",
                    "finishing_feed_rate",
                    "finishing_cutting_speed",
                  ].map((field) => (
                    <td key={field} className="px-6 py-4 text-sm">
                      <input
                        type="number"
                        step="0.01"
                        value={newParameter[field]}
                        onChange={(e) => handleNewParameterChange(field, e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                      />
                    </td>
                  ))}
                  <td className="px-6 py-4 text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveNew}
                        disabled={updating}
                        className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>{updating ? "Saving..." : "Save"}</span>
                      </button>
                      <button
                        onClick={handleCancelNew}
                        disabled={updating}
                        className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* Existing Parameters */}
              {currentItems.length === 0 && !isAddingNew ? (
                <tr>
                  <td colSpan={isAdmin ? 9 : 8} className="px-6 py-8 text-center text-gray-500">
                    No parameters found matching "{searchTerm}"
                  </td>
                </tr>
              ) : (
                currentItems.map((param) => (
                  <tr key={param.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{param.material || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">
                      {isAdmin && editingId === param.id ? (
                        <input
                          type="text"
                          value={editedData.new_diameter_range}
                          onChange={(e) => handleInputChange('diameter_range', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                        />
                      ) : (
                        <span className="text-gray-700">{param.diameter_range}</span>
                      )}
                    </td>

                    {[
                      "roughing_depth_of_cut",
                      "roughing_feed_rate",
                      "roughing_cutting_speed",
                      "finishing_depth_of_cut",
                      "finishing_feed_rate",
                      "finishing_cutting_speed",
                    ].map((field) => (
                      <td key={field} className="px-6 py-4 text-sm">
                        {isAdmin && editingId === param.id ? (
                          <input
                            type="number"
                            step="0.01"
                            value={editedData[field]}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                          />
                        ) : (
                          <span className="text-gray-700">{param[field]}</span>
                        )}
                      </td>
                    ))}

                    {isAdmin && (
                      <td className="px-6 py-4 text-sm">
                        {editingId === param.id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={handleUpdate}
                              disabled={updating}
                              className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                            >
                              <Save className="w-4 h-4" />
                              <span>{updating ? "Saving..." : "Save"}</span>
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
                          <button
                            onClick={() => handleEdit(param)}
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
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {filteredParameters.length > itemsPerPage && (
        <div className="flex items-center justify-between mt-4 px-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center space-x-1 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            {currentPage > 2 && (
              <>
                <button
                  onClick={() => handlePageChange(1)}
                  className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  1
                </button>
                {currentPage > 3 && <span className="text-gray-500">...</span>}
              </>
            )}
            
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => 
                page === currentPage || 
                page === currentPage - 1 || 
                page === currentPage + 1
              )
              .map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                    currentPage === page
                      ? 'bg-[#246679] text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}

            {currentPage < totalPages - 1 && (
              <>
                {currentPage < totalPages - 2 && <span className="text-gray-500">...</span>}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center space-x-1 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {!isAdmin && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update turning parameters.
          </p>
        </div>
      )}
    </div>
  );
};

export default TurningParametersComponent;