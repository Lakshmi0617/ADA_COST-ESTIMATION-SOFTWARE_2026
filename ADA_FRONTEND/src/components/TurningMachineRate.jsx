// import React, { useState, useEffect } from "react";
// import { ArrowLeft, Edit2, Save, X, AlertCircle, Loader } from "lucide-react";

// const TurningMachineRate = ({ onBack }) => {
//   const [rates, setRates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [updating, setUpdating] = useState(false);

//   // Fetch machine rates
//   useEffect(() => {
//     fetchRates();
//   }, []);

//   const fetchRates = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch("http://172.18.100.156:8004/turning-machine-hour-rates/");
//       if (!response.ok) throw new Error(`Failed to fetch rates, status: ${response.status}`);
//       const data = await response.json();

//       if (data.data && Array.isArray(data.data)) {
//         // ✅ Sort by material_id before setting
//         const sorted = data.data.sort((a, b) => a.material_id - b.material_id);
//         setRates(sorted);
//       } else {
//         throw new Error("Unexpected API response structure");
//       }
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (rate) => {
//     setEditingId(rate.id);
//     setEditedData({ ...rate });
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
//       const {
//         material_id,
//         diameter_condition,
//         turning_rate,
//         boring_rate,
//         threading_rate,
//         milling_rate,
//       } = editedData;

//       const url = `http://172.18.100.156:8004/turning-machine-hour-rate/${material_id}/${encodeURIComponent(
//         diameter_condition
//       )}`;

//       const response = await fetch(url, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ turning_rate, boring_rate, threading_rate, milling_rate }),
//       });

//       if (!response.ok)
//         throw new Error(`Failed to update rate, status: ${response.status}`);
//       const result = await response.json();

//       // ✅ Update local state but preserve order by sorting again by material_id
//       setRates((prev) =>
//         prev
//           .map((r) => (r.id === editedData.id ? { ...r, ...editedData } : r))
//           .sort((a, b) => a.material_id - b.material_id)
//       );

//       setEditingId(null);
//       setEditedData({});
//       alert(result.message || "Machine rate updated successfully");
//     } catch (err) {
//       alert("Error updating machine rate: " + err.message);
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
//       <div className="flex items-center justify-center h-64">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
//           <div className="flex items-center space-x-3 mb-3">
//             <AlertCircle className="w-6 h-6 text-red-600" />
//             <h3 className="text-lg font-semibold text-red-800">Error Loading Data</h3>
//           </div>
//           <p className="text-red-700 mb-4">{error}</p>
//           <button
//             onClick={fetchRates}
//             className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Turning Machine Rates</h2>
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
//                 <th className="px-6 py-3 text-left text-sm font-semibold">
//                   Diameter Condition
//                 </th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Turning Rate</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Boring Rate</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Threading Rate</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Milling Rate</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {rates.map((rate, index) => (
//                 <tr
//                   key={rate.id || `${rate.material_id}-${rate.diameter_condition}-${index}`}
//                   className={`${
//                     index % 2 === 0 ? "bg-white" : "bg-gray-50"
//                   } hover:bg-blue-50 transition-colors`}
//                 >
//                   <td className="px-6 py-4 text-sm text-gray-700">{rate.material_id}</td>
//                   <td className="px-6 py-4 text-sm text-gray-700">
//                     {rate.diameter_condition}
//                   </td>

//                   {["turning_rate", "boring_rate", "threading_rate", "milling_rate"].map(
//                     (field) => (
//                       <td key={field} className="px-6 py-4 text-sm">
//                         {editingId === rate.id ? (
//                           <input
//                             type="number"
//                             step="1"
//                             value={editedData[field]}
//                             onChange={(e) =>
//                               handleInputChange(field, e.target.value)
//                             }
//                             className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                           />
//                         ) : (
//                           <span className="text-gray-700">{rate[field]}</span>
//                         )}
//                       </td>
//                     )
//                   )}

//                   <td className="px-6 py-4 text-sm">
//                     {editingId === rate.id ? (
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={handleUpdate}
//                           disabled={updating}
//                           className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
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
//                           className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
//                         >
//                           <X className="w-4 h-4" />
//                           <span>Cancel</span>
//                         </button>
//                       </div>
//                     ) : (
//                       <button
//                         onClick={() => handleEdit(rate)}
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

// export default TurningMachineRate;







//'''updated logi based on admin role action column is dislayed
// import React, { useState, useEffect } from "react";
// import { ArrowLeft, Edit2, Save, X, AlertCircle, Loader } from "lucide-react";

// const TurningMachineRate = ({ onBack }) => {
//   const [rates, setRates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [updating, setUpdating] = useState(false);
//   const [userRole, setUserRole] = useState('');

//   // Fetch machine rates
//   useEffect(() => {
//     // Get user role from sessionStorage
//     const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
//     setUserRole(userData.role || '');
//     fetchRates();
//   }, []);

//   const fetchRates = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch("http://172.18.100.156:8004/turning-machine-hour-rates/");
//       if (!response.ok) throw new Error(`Failed to fetch rates, status: ${response.status}`);
//       const data = await response.json();

//       if (data.data && Array.isArray(data.data)) {
//         // Sort by material_id before setting
//         const sorted = data.data.sort((a, b) => a.material_id - b.material_id);
//         setRates(sorted);
//       } else {
//         throw new Error("Unexpected API response structure");
//       }
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (rate) => {
//     setEditingId(rate.id);
//     setEditedData({ ...rate });
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
//       const {
//         material_id,
//         diameter_condition,
//         turning_rate,
//         boring_rate,
//         threading_rate,
//         milling_rate,
//       } = editedData;

//       const url = `http://172.18.100.156:8004/turning-machine-hour-rate/${material_id}/${encodeURIComponent(
//         diameter_condition
//       )}`;

//       const response = await fetch(url, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ turning_rate, boring_rate, threading_rate, milling_rate }),
//       });

//       if (!response.ok)
//         throw new Error(`Failed to update rate, status: ${response.status}`);
//       const result = await response.json();

//       // Update local state but preserve order by sorting again by material_id
//       setRates((prev) =>
//         prev
//           .map((r) => (r.id === editedData.id ? { ...r, ...editedData } : r))
//           .sort((a, b) => a.material_id - b.material_id)
//       );

//       setEditingId(null);
//       setEditedData({});
//       alert(result.message || "Machine rate updated successfully");
//     } catch (err) {
//       alert("Error updating machine rate: " + err.message);
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
//       <div className="flex items-center justify-center h-64">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
//           <div className="flex items-center space-x-3 mb-3">
//             <AlertCircle className="w-6 h-6 text-red-600" />
//             <h3 className="text-lg font-semibold text-red-800">Error Loading Data</h3>
//           </div>
//           <p className="text-red-700 mb-4">{error}</p>
//           <button
//             onClick={fetchRates}
//             className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Turning Machine Rates</h2>
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
//                 <th className="px-6 py-3 text-left text-sm font-semibold">
//                   Diameter Condition
//                 </th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Turning Rate</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Boring Rate</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Threading Rate</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Milling Rate</th>
//                 {isAdmin && (
//                   <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {rates.map((rate, index) => (
//                 <tr
//                   key={rate.id || `${rate.material_id}-${rate.diameter_condition}-${index}`}
//                   className={`${
//                     index % 2 === 0 ? "bg-white" : "bg-gray-50"
//                   } hover:bg-blue-50 transition-colors`}
//                 >
//                   <td className="px-6 py-4 text-sm text-gray-700">{rate.material_id}</td>
//                   <td className="px-6 py-4 text-sm text-gray-700">
//                     {rate.diameter_condition}
//                   </td>

//                   {["turning_rate", "boring_rate", "threading_rate", "milling_rate"].map(
//                     (field) => (
//                       <td key={field} className="px-6 py-4 text-sm">
//                         {isAdmin && editingId === rate.id ? (
//                           <input
//                             type="number"
//                             step="1"
//                             value={editedData[field]}
//                             onChange={(e) =>
//                               handleInputChange(field, e.target.value)
//                             }
//                             className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                           />
//                         ) : (
//                           <span className="text-gray-700">{rate[field]}</span>
//                         )}
//                       </td>
//                     )
//                   )}

//                   {isAdmin && (
//                     <td className="px-6 py-4 text-sm">
//                       {editingId === rate.id ? (
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={handleUpdate}
//                             disabled={updating}
//                             className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
//                           >
//                             {updating ? (
//                               <Loader className="w-4 h-4 animate-spin" />
//                             ) : (
//                               <Save className="w-4 h-4" />
//                             )}
//                             <span>Save</span>
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
//                           onClick={() => handleEdit(rate)}
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
//             <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update turning machine rates.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TurningMachineRate;





//'''reolved after update button is clicked and updated data if i click back to overview the poistion of row is which is changing its poistion is resolved 

// import React, { useState, useEffect } from "react";
// import { ArrowLeft, Edit2, Save, X, AlertCircle, Loader } from "lucide-react";

// const TurningMachineRate = ({ onBack }) => {
//   const [rates, setRates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [updating, setUpdating] = useState(false);
//   const [userRole, setUserRole] = useState('');

//   // Fetch machine rates
//   useEffect(() => {
//     // Get user role from sessionStorage
//     const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
//     setUserRole(userData.role || '');
//     fetchRates();
//   }, []);

//   const fetchRates = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch("http://172.18.100.156:8004/turning-machine-hour-rates/");
//       if (!response.ok) throw new Error(`Failed to fetch rates, status: ${response.status}`);
//       const data = await response.json();

//       if (data.data && Array.isArray(data.data)) {
//         // Sort by ID to maintain consistent order
//         const sorted = [...data.data].sort((a, b) => a.id - b.id);
//         setRates(sorted);
//       } else {
//         throw new Error("Unexpected API response structure");
//       }
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (rate) => {
//     setEditingId(rate.id);
//     setEditedData({ ...rate });
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
//       const {
//         material_id,
//         diameter_condition,
//         turning_rate,
//         boring_rate,
//         threading_rate,
//         milling_rate,
//       } = editedData;

//       const url = `http://172.18.100.156:8004/turning-machine-hour-rate/${material_id}/${encodeURIComponent(
//         diameter_condition
//       )}`;

//       const response = await fetch(url, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ turning_rate, boring_rate, threading_rate, milling_rate }),
//       });

//       if (!response.ok)
//         throw new Error(`Failed to update rate, status: ${response.status}`);
//       const result = await response.json();

//       // Update local state while maintaining order - find by index
//       setRates((prev) => {
//         const index = prev.findIndex(r => r.id === editedData.id);
//         if (index !== -1) {
//           const updated = [...prev];
//           updated[index] = { ...updated[index], ...editedData };
//           return updated;
//         }
//         return prev;
//       });

//       setEditingId(null);
//       setEditedData({});
//       alert(result.message || "Machine rate updated successfully");
//     } catch (err) {
//       alert("Error updating machine rate: " + err.message);
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
//       <div className="flex items-center justify-center h-64">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
//           <div className="flex items-center space-x-3 mb-3">
//             <AlertCircle className="w-6 h-6 text-red-600" />
//             <h3 className="text-lg font-semibold text-red-800">Error Loading Data</h3>
//           </div>
//           <p className="text-red-700 mb-4">{error}</p>
//           <button
//             onClick={fetchRates}
//             className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Turning Machine Rates</h2>
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
//                 <th className="px-6 py-3 text-left text-sm font-semibold">
//                   Diameter Condition
//                 </th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Turning Rate</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Boring Rate</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Threading Rate</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Milling Rate</th>
//                 {isAdmin && (
//                   <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {rates.map((rate, index) => (
//                 <tr
//                   key={rate.id || `${rate.material_id}-${rate.diameter_condition}-${index}`}
//                   className={`${
//                     index % 2 === 0 ? "bg-white" : "bg-gray-50"
//                   } hover:bg-blue-50 transition-colors`}
//                 >
//                   <td className="px-6 py-4 text-sm text-gray-700">{rate.material_id}</td>
//                   <td className="px-6 py-4 text-sm text-gray-700">
//                     {rate.diameter_condition}
//                   </td>

//                   {["turning_rate", "boring_rate", "threading_rate", "milling_rate"].map(
//                     (field) => (
//                       <td key={field} className="px-6 py-4 text-sm">
//                         {isAdmin && editingId === rate.id ? (
//                           <input
//                             type="number"
//                             step="1"
//                             value={editedData[field]}
//                             onChange={(e) =>
//                               handleInputChange(field, e.target.value)
//                             }
//                             className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                           />
//                         ) : (
//                           <span className="text-gray-700">{rate[field]}</span>
//                         )}
//                       </td>
//                     )
//                   )}

//                   {isAdmin && (
//                     <td className="px-6 py-4 text-sm">
//                       {editingId === rate.id ? (
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={handleUpdate}
//                             disabled={updating}
//                             className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
//                           >
//                             {updating ? (
//                               <Loader className="w-4 h-4 animate-spin" />
//                             ) : (
//                               <Save className="w-4 h-4" />
//                             )}
//                             <span>Save</span>
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
//                           onClick={() => handleEdit(rate)}
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
//             <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update turning machine rates.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TurningMachineRate;










//'''''this below code added the export to excel button to download the data into  excelformatt''''''// 

// import React, { useState, useEffect } from "react";
// import { ArrowLeft, Edit2, Save, X, AlertCircle, Loader, Download } from "lucide-react";
// import * as XLSX from 'xlsx';

// const TurningMachineRate = ({ onBack }) => {
//   const [rates, setRates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [updating, setUpdating] = useState(false);
//   const [userRole, setUserRole] = useState('');

//   useEffect(() => {
//     const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
//     setUserRole(userData.role || '');
//     fetchRates();
//   }, []);

//   const fetchRates = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch("http://172.18.100.156:8004/turning-machine-hour-rates/");
//       if (!response.ok) throw new Error(`Failed to fetch rates, status: ${response.status}`);
//       const data = await response.json();

//       if (data.data && Array.isArray(data.data)) {
//         const sorted = [...data.data].sort((a, b) => a.id - b.id);
//         setRates(sorted);
//       } else {
//         throw new Error("Unexpected API response structure");
//       }
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (rate) => {
//     setEditingId(rate.id);
//     setEditedData({ ...rate });
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
//       const {
//         material_id,
//         diameter_condition,
//         turning_rate,
//         boring_rate,
//         threading_rate,
//         milling_rate,
//       } = editedData;

//       const url = `http://172.18.100.156:8004/turning-machine-hour-rate/${material_id}/${encodeURIComponent(
//         diameter_condition
//       )}`;

//       const response = await fetch(url, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ turning_rate, boring_rate, threading_rate, milling_rate }),
//       });

//       if (!response.ok)
//         throw new Error(`Failed to update rate, status: ${response.status}`);
//       const result = await response.json();

//       setRates((prev) => {
//         const index = prev.findIndex(r => r.id === editedData.id);
//         if (index !== -1) {
//           const updated = [...prev];
//           updated[index] = { ...updated[index], ...editedData };
//           return updated;
//         }
//         return prev;
//       });

//       setEditingId(null);
//       setEditedData({});
//       alert(result.message || "Machine rate updated successfully");
//     } catch (err) {
//       alert("Error updating machine rate: " + err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleExportToExcel = () => {
//     const exportData = rates.map(rate => ({
//       'Material ID': rate.material_id,
//       'Diameter Condition': rate.diameter_condition,
//       'Turning Rate': rate.turning_rate,
//       'Boring Rate': rate.boring_rate,
//       'Threading Rate': rate.threading_rate,
//       'Milling Rate': rate.milling_rate
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(exportData);
    
//     const columnWidths = [
//       { wch: 15 },
//       { wch: 20 },
//       { wch: 15 },
//       { wch: 15 },
//       { wch: 15 },
//       { wch: 15 }
//     ];
//     worksheet['!cols'] = columnWidths;

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Machine Rates');

//     const timestamp = new Date().toISOString().split('T')[0];
//     const filename = `Turning_Machine_Rates_${timestamp}.xlsx`;

//     XLSX.writeFile(workbook, filename);
//   };

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
//       <div className="flex items-center justify-center h-64">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
//           <div className="flex items-center space-x-3 mb-3">
//             <AlertCircle className="w-6 h-6 text-red-600" />
//             <h3 className="text-lg font-semibold text-red-800">Error Loading Data</h3>
//           </div>
//           <p className="text-red-700 mb-4">{error}</p>
//           <button
//             onClick={fetchRates}
//             className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Turning Machine Rates</h2>
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

//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-[#246679] text-white">
//               <tr>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Material ID</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Diameter Condition</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Turning Rate</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Boring Rate</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Threading Rate</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Milling Rate</th>
//                 {isAdmin && (
//                   <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {rates.map((rate, index) => (
//                 <tr
//                   key={rate.id || `${rate.material_id}-${rate.diameter_condition}-${index}`}
//                   className={`${
//                     index % 2 === 0 ? "bg-white" : "bg-gray-50"
//                   } hover:bg-blue-50 transition-colors`}
//                 >
//                   <td className="px-6 py-4 text-sm text-gray-700">{rate.material_id}</td>
//                   <td className="px-6 py-4 text-sm text-gray-700">{rate.diameter_condition}</td>

//                   {["turning_rate", "boring_rate", "threading_rate", "milling_rate"].map((field) => (
//                     <td key={field} className="px-6 py-4 text-sm">
//                       {isAdmin && editingId === rate.id ? (
//                         <input
//                           type="number"
//                           step="1"
//                           value={editedData[field]}
//                           onChange={(e) => handleInputChange(field, e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                         />
//                       ) : (
//                         <span className="text-gray-700">{rate[field]}</span>
//                       )}
//                     </td>
//                   ))}

//                   {isAdmin && (
//                     <td className="px-6 py-4 text-sm">
//                       {editingId === rate.id ? (
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={handleUpdate}
//                             disabled={updating}
//                             className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
//                           >
//                             {updating ? (
//                               <Loader className="w-4 h-4 animate-spin" />
//                             ) : (
//                               <Save className="w-4 h-4" />
//                             )}
//                             <span>Save</span>
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
//                           onClick={() => handleEdit(rate)}
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
//             <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update turning machine rates.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TurningMachineRate;






import React, { useState, useEffect } from "react";
import { ArrowLeft, Edit2, Save, X, AlertCircle, Download, RefreshCw, Search, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import * as XLSX from 'xlsx';

const TurningMachineRate = ({ onBack }) => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [updating, setUpdating] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newRate, setNewRate] = useState({
    material_id: '',
    diameter_condition: '',
    turning_rate: 0,
    boring_rate: 0,
    threading_rate: 0,
    milling_rate: 0
  });
  const [materials, setMaterials] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    setUserRole(userData.role || '');
    fetchMaterials();
    fetchRates();
  }, []);

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

  const fetchRates = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://172.18.100.156:8004/turning-machine-hour-rates/");
      if (!response.ok) throw new Error(`Failed to fetch rates, status: ${response.status}`);
      const data = await response.json();

      if (data.data && Array.isArray(data.data)) {
        const sorted = [...data.data].sort((a, b) => a.id - b.id);
        setRates(sorted);
      } else {
        throw new Error("Unexpected API response structure");
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRates();
    setRefreshing(false);
  };

  const handleEdit = (rate) => {
    setEditingId(rate.id);
    setEditedData({ 
      ...rate,
      old_diameter_condition: rate.diameter_condition,
      new_diameter_condition: rate.diameter_condition
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedData({});
  };

  const handleInputChange = (field, value) => {
    if (field === 'diameter_condition') {
      setEditedData((prev) => ({
        ...prev,
        new_diameter_condition: value,
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
        old_diameter_condition: editedData.old_diameter_condition,
        new_diameter_condition: editedData.new_diameter_condition,
        turning_rate: editedData.turning_rate,
        boring_rate: editedData.boring_rate,
        threading_rate: editedData.threading_rate,
        milling_rate: editedData.milling_rate
      };

      const response = await fetch(
        "http://172.18.100.156:8004/turning-machine-hour-rate/update/",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to update rate, status: ${response.status}`);
      }

      alert("Machine rate updated successfully");
      await fetchRates();

      setEditingId(null);
      setEditedData({});
    } catch (err) {
      alert("Error updating machine rate: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewRate({
      material_id: '',
      diameter_condition: '',
      turning_rate: 0,
      boring_rate: 0,
      threading_rate: 0,
      milling_rate: 0
    });
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
    setNewRate({
      material_id: '',
      diameter_condition: '',
      turning_rate: 0,
      boring_rate: 0,
      threading_rate: 0,
      milling_rate: 0
    });
  };

  const handleNewRateChange = (field, value) => {
    setNewRate((prev) => ({
      ...prev,
      [field]: field === 'material_id' || field === 'diameter_condition' ? value : Number(value),
    }));
  };

  const handleSaveNew = async () => {
    if (!newRate.material_id || !newRate.diameter_condition) {
      alert("Please select material and enter diameter condition");
      return;
    }

    try {
      setUpdating(true);

      const response = await fetch(
        "http://172.18.100.156:8004/turning-machine-hour-rate/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newRate),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      alert("New machine rate added successfully");
      await fetchRates();

      setIsAddingNew(false);
      setNewRate({
        material_id: '',
        diameter_condition: '',
        turning_rate: 0,
        boring_rate: 0,
        threading_rate: 0,
        milling_rate: 0
      });
    } catch (err) {
      alert("Error adding rate: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleExportToExcel = () => {
    if (rates.length === 0) {
      alert("No data to export");
      return;
    }

    const exportData = rates.map(rate => ({
      'Material': rate.material || rate.material_id,
      'Diameter Condition': rate.diameter_condition,
      'Turning Rate': rate.turning_rate,
      'Boring Rate': rate.boring_rate,
      'Threading Rate': rate.threading_rate,
      'Milling Rate': rate.milling_rate
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    const columnWidths = [
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 }
    ];
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Machine Rates');

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `Turning_Machine_Rates_${timestamp}.xlsx`;

    XLSX.writeFile(workbook, filename);
  };

  // Filter rates based on search term
  const filteredRates = rates.filter(rate => 
    rate.material?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredRates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredRates.slice(startIndex, endIndex);

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
          <div className="text-gray-600">Loading machine rates...</div>
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
            onClick={fetchRates}
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
        <h2 className="text-2xl font-bold text-gray-800">Turning Machine Rates</h2>
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
         Add Machine Rates
          </button>
        )}
          <button
            onClick={handleExportToExcel}
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
         Add Machine Rates
          </button>
        )} */}
      </div>

      {/* Pagination Info */}
      {/* <div className="mb-3 text-sm text-gray-600">
        Showing {startIndex + 1} to {Math.min(endIndex, filteredRates.length)} of {filteredRates.length} entries
      </div> */}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#246679] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Material</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Diameter Condition</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Turning Rate</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Boring Rate</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Threading Rate</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Milling Rate</th>
                {isAdmin && (
                  <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* New Rate Row */}
              {isAddingNew && (
                <tr className="bg-green-50">
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={newRate.material_id}
                      onChange={(e) => handleNewRateChange('material_id', e.target.value)}
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
                      value={newRate.diameter_condition}
                      onChange={(e) => handleNewRateChange('diameter_condition', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    />
                  </td>
                  {["turning_rate", "boring_rate", "threading_rate", "milling_rate"].map((field) => (
                    <td key={field} className="px-6 py-4 text-sm">
                      <input
                        type="number"
                        step="1"
                        value={newRate[field]}
                        onChange={(e) => handleNewRateChange(field, e.target.value)}
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

              {/* Existing Rates */}
              {currentItems.length === 0 && !isAddingNew ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="px-6 py-8 text-center text-gray-500">
                    No rates found matching "{searchTerm}"
                  </td>
                </tr>
              ) : (
                currentItems.map((rate, index) => (
                  <tr
                    key={rate.id || `${rate.material_id}-${rate.diameter_condition}-${index}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                      {rate.material || rate.material_id}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {isAdmin && editingId === rate.id ? (
                        <input
                          type="text"
                          value={editedData.new_diameter_condition}
                          onChange={(e) => handleInputChange('diameter_condition', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                        />
                      ) : (
                        <span className="text-gray-700">{rate.diameter_condition}</span>
                      )}
                    </td>

                    {["turning_rate", "boring_rate", "threading_rate", "milling_rate"].map((field) => (
                      <td key={field} className="px-6 py-4 text-sm">
                        {isAdmin && editingId === rate.id ? (
                          <input
                            type="number"
                            step="1"
                            value={editedData[field]}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                          />
                        ) : (
                          <span className="text-gray-700">{rate[field]}</span>
                        )}
                      </td>
                    ))}

                    {isAdmin && (
                      <td className="px-6 py-4 text-sm">
                        {editingId === rate.id ? (
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
                            onClick={() => handleEdit(rate)}
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
      {filteredRates.length > itemsPerPage && (
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
            <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update turning machine rates.
          </p>
        </div>
      )}
    </div>
  );
};

export default TurningMachineRate;