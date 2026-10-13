// import React, { useState, useEffect } from "react";
// import { ArrowLeft, Edit2, Save, X } from "lucide-react";
// import axios from "axios";

// const TurningMaterials = ({ onBack }) => {
//   const [materials, setMaterials] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [updating, setUpdating] = useState(false);

//   useEffect(() => {
//     fetchMaterials();
//   }, []);

//   const fetchMaterials = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get("http://localhost:5678/turning-materials");
//       if (response.data.success) {
//         setMaterials(response.data.data);
//         setError(null);
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (material) => {
//     setEditingId(material.id);
//     setEditedData({
//       id: material.id,
//       material: material.material,
//       material_specification: material.material_specification,
//       material_cost: material.material_cost,
//     });
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedData({});
//   };

//   const handleInputChange = (value) => {
//     setEditedData(prev => ({
//       ...prev,
//       material_cost: Number(value),
//     }));
//   };
//   const handleUpdate = async () => {
//     try {
//       setUpdating(true);
//       const payload = {
//         id: editedData.id,
//         material: editedData.material,
//         material_specification: editedData.material_specification,
//         new_cost: editedData.material_cost,
//       };
//       const response = await axios.put(
//         "http://localhost:5678/materials/update-cost/",
//         payload
//       );

//       alert(response.data.message);

//       // Update the material cost locally without changing order
//       setMaterials((prevMaterials) =>
//         prevMaterials.map((m) =>
//           m.id === editedData.id ? { ...m, material_cost: editedData.material_cost } : m
//         )
//       );

//       setEditingId(null);
//       setEditedData({});
//     } catch (err) {
//       alert("Error updating material: " + err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };


//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-gray-600">Loading materials...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-red-600">Error: {error}</div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Turning Materials</h2>
//         <button
//           onClick={onBack}
//           className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           <span>Back to Overview</span>
//         </button>
//       </div>

//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-[#246679] text-white">
//               <tr>
//                 {/* <th className="px-6 py-3 text-left text-sm font-semibold">ID</th> */}
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Material</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Specification</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Density</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Material Cost (₹)</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {materials.map((material) => (
//                 <tr key={material.id} className="hover:bg-gray-50">
//                   {/* <td className="px-6 py-4 text-sm text-gray-700">{material.id}</td> */}
//                   <td className="px-6 py-4 text-sm text-gray-700">{material.material}</td>
//                   <td className="px-6 py-4 text-sm text-gray-700">{material.material_specification}</td>
//                   <td className="px-6 py-4 text-sm text-gray-700">{material.density}</td>
//                   <td className="px-6 py-4 text-sm">
//                     {editingId === material.id ? (
//                       <input
//                         type="number"
//                         value={editedData.material_cost}
//                         onChange={(e) => handleInputChange(e.target.value)}
//                         className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                       />
//                     ) : (
//                       <span className="text-gray-700">₹{material.material_cost}</span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 text-sm">
//                     {editingId === material.id ? (
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
//                         onClick={() => handleEdit(material)}
//                         className="flex items-center space-x-1 px-3 py-1 bg-[#246679] text-white rounded hover:bg-[#1f5766] transition-colors duration-200"
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

// export default TurningMaterials;








//'''updated logic based on the admin role action column is displayed
// import React, { useState, useEffect } from "react";
// import { ArrowLeft, Edit2, Save, X } from "lucide-react";
// import axios from "axios";

// const TurningMaterials = ({ onBack }) => {
//   const [materials, setMaterials] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [updating, setUpdating] = useState(false);
//   const [userRole, setUserRole] = useState('');

//   useEffect(() => {
//     // Get user role from sessionStorage
//     const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
//     setUserRole(userData.role || '');
//     fetchMaterials();
//   }, []);

//   const fetchMaterials = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get("http://localhost:5678/turning-materials");
//       if (response.data.success) {
//         setMaterials(response.data.data);
//         setError(null);
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (material) => {
//     setEditingId(material.id);
//     setEditedData({
//       id: material.id,
//       material: material.material,
//       material_specification: material.material_specification,
//       material_cost: material.material_cost,
//     });
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedData({});
//   };

//   const handleInputChange = (value) => {
//     setEditedData(prev => ({
//       ...prev,
//       material_cost: Number(value),
//     }));
//   };

//   const handleUpdate = async () => {
//     try {
//       setUpdating(true);
//       const payload = {
//         id: editedData.id,
//         material: editedData.material,
//         material_specification: editedData.material_specification,
//         new_cost: editedData.material_cost,
//       };
//       const response = await axios.put(
//         "http://localhost:5678/materials/update-cost/",
//         payload
//       );

//       alert(response.data.message);

//       // Update the material cost locally without changing order
//       setMaterials((prevMaterials) =>
//         prevMaterials.map((m) =>
//           m.id === editedData.id ? { ...m, material_cost: editedData.material_cost } : m
//         )
//       );

//       setEditingId(null);
//       setEditedData({});
//     } catch (err) {
//       alert("Error updating material: " + err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // Check if user is admin
//   const isAdmin = userRole.toLowerCase() === 'admin';

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-gray-600">Loading materials...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-red-600">Error: {error}</div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Turning Materials</h2>
//         <button
//           onClick={onBack}
//           className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           <span>Back to Overview</span>
//         </button>
//       </div>

//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-[#246679] text-white">
//               <tr>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Material</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Specification</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Density</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Material Cost (₹)</th>
//                 {isAdmin && (
//                   <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {materials.map((material) => (
//                 <tr key={material.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 text-sm text-gray-700">{material.material}</td>
//                   <td className="px-6 py-4 text-sm text-gray-700">{material.material_specification}</td>
//                   <td className="px-6 py-4 text-sm text-gray-700">{material.density}</td>
//                   <td className="px-6 py-4 text-sm">
//                     {isAdmin && editingId === material.id ? (
//                       <input
//                         type="number"
//                         value={editedData.material_cost}
//                         onChange={(e) => handleInputChange(e.target.value)}
//                         className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                       />
//                     ) : (
//                       <span className="text-gray-700">₹{material.material_cost}</span>
//                     )}
//                   </td>
//                   {isAdmin && (
//                     <td className="px-6 py-4 text-sm">
//                       {editingId === material.id ? (
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
//                           onClick={() => handleEdit(material)}
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
//             <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update material costs.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TurningMaterials;





// import React, { useState, useEffect } from "react";
// import { ArrowLeft, Edit2, Save, X } from "lucide-react";

// const TurningMaterials = ({ onBack }) => {
//   const [materials, setMaterials] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [updating, setUpdating] = useState(false);
//   const [userRole, setUserRole] = useState('');

//   useEffect(() => {
//     // Get user role from sessionStorage
//     const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
//     setUserRole(userData.role || '');
//     fetchMaterials();
//   }, []);

//   const fetchMaterials = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch("http://localhost:5678/turning-materials");
//       const data = await response.json();
//       if (data.success) {
//         // Sort by ID to maintain consistent order
//         const sortedData = [...data.data].sort((a, b) => a.id - b.id);
//         setMaterials(sortedData);
//         setError(null);
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (material) => {
//     setEditingId(material.id);
//     setEditedData({
//       id: material.id,
//       material: material.material,
//       material_specification: material.material_specification,
//       material_cost: material.material_cost,
//     });
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedData({});
//   };

//   const handleInputChange = (value) => {
//     setEditedData(prev => ({
//       ...prev,
//       material_cost: Number(value),
//     }));
//   };

//   const handleUpdate = async () => {
//     try {
//       setUpdating(true);
//       const payload = {
//         id: editedData.id,
//         material: editedData.material,
//         material_specification: editedData.material_specification,
//         new_cost: editedData.material_cost,
//       };
//       const response = await fetch(
//         "http://localhost:5678/materials/update-cost/",
//         {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const responseData = await response.json();
//       alert(responseData.message);

//       // Update the material cost locally while maintaining order - find by index
//       setMaterials((prevMaterials) => {
//         const index = prevMaterials.findIndex(m => m.id === editedData.id);
//         if (index !== -1) {
//           const updated = [...prevMaterials];
//           updated[index] = { ...updated[index], material_cost: editedData.material_cost };
//           return updated;
//         }
//         return prevMaterials;
//       });

//       setEditingId(null);
//       setEditedData({});
//     } catch (err) {
//       alert("Error updating material: " + err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // Check if user is admin
//   const isAdmin = userRole.toLowerCase() === 'admin';

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-gray-600">Loading materials...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-red-600">Error: {error}</div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Turning Materials</h2>
//         <button
//           onClick={onBack}
//           className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           <span>Back to Overview</span>
//         </button>
//       </div>

//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-[#246679] text-white">
//               <tr>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Material</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Specification</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Density</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Material Cost (₹)</th>
//                 {isAdmin && (
//                   <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {materials.map((material) => (
//                 <tr key={material.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 text-sm text-gray-700">{material.material}</td>
//                   <td className="px-6 py-4 text-sm text-gray-700">{material.material_specification}</td>
//                   <td className="px-6 py-4 text-sm text-gray-700">{material.density}</td>
//                   <td className="px-6 py-4 text-sm">
//                     {isAdmin && editingId === material.id ? (
//                       <input
//                         type="number"
//                         value={editedData.material_cost}
//                         onChange={(e) => handleInputChange(e.target.value)}
//                         className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                       />
//                     ) : (
//                       <span className="text-gray-700">₹{material.material_cost}</span>
//                     )}
//                   </td>
//                   {isAdmin && (
//                     <td className="px-6 py-4 text-sm">
//                       {editingId === material.id ? (
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
//                           onClick={() => handleEdit(material)}
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
//             <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update material costs.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TurningMaterials;








//'''''this below code added the export to excel button to download the data into  excelformatt''''''// 
// import React, { useState, useEffect } from "react";
// import { ArrowLeft, Edit2, Save, X, Download } from "lucide-react";

// const TurningMaterials = ({ onBack }) => {
//   const [materials, setMaterials] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [updating, setUpdating] = useState(false);
//   const [userRole, setUserRole] = useState('');

//   useEffect(() => {
//     // Get user role from sessionStorage
//     const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
//     setUserRole(userData.role || '');
//     fetchMaterials();
//   }, []);

//   const fetchMaterials = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch("http://localhost:5678/turning-materials");
//       const data = await response.json();
//       if (data.success) {
//         // Sort by ID to maintain consistent order
//         const sortedData = [...data.data].sort((a, b) => a.id - b.id);
//         setMaterials(sortedData);
//         setError(null);
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (material) => {
//     setEditingId(material.id);
//     setEditedData({
//       id: material.id,
//       material: material.material,
//       material_specification: material.material_specification,
//       material_cost: material.material_cost,
//     });
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedData({});
//   };

//   const handleInputChange = (value) => {
//     setEditedData(prev => ({
//       ...prev,
//       material_cost: Number(value),
//     }));
//   };

//   const handleUpdate = async () => {
//     try {
//       setUpdating(true);
//       const payload = {
//         id: editedData.id,
//         material: editedData.material,
//         material_specification: editedData.material_specification,
//         new_cost: editedData.material_cost,
//       };
//       const response = await fetch(
//         "http://localhost:5678/materials/update-cost/",
//         {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const responseData = await response.json();
//       alert(responseData.message);

//       // Update the material cost locally while maintaining order - find by index
//       setMaterials((prevMaterials) => {
//         const index = prevMaterials.findIndex(m => m.id === editedData.id);
//         if (index !== -1) {
//           const updated = [...prevMaterials];
//           updated[index] = { ...updated[index], material_cost: editedData.material_cost };
//           return updated;
//         }
//         return prevMaterials;
//       });

//       setEditingId(null);
//       setEditedData({});
//     } catch (err) {
//       alert("Error updating material: " + err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const exportToExcel = () => {
//     if (materials.length === 0) {
//       alert("No data to export");
//       return;
//     }

//     // Define headers
//     const headers = [
//       "Material",
//       "Specification",
//       "Density",
//       "Material Cost (₹)"
//     ];

//     // Create CSV content
//     let csvContent = headers.join(",") + "\n";

//     materials.forEach(material => {
//       const row = [
//         `"${material.material}"`,
//         `"${material.material_specification}"`,
//         material.density,
//         material.material_cost
//       ];
//       csvContent += row.join(",") + "\n";
//     });

//     // Create blob and download
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);

//     link.setAttribute("href", url);
//     link.setAttribute("download", `Turning_Materials_${new Date().toISOString().split('T')[0]}.csv`);
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
//         <div className="text-gray-600">Loading materials...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-red-600">Error: {error}</div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Turning Materials</h2>
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

//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-[#246679] text-white">
//               <tr>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Material</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Specification</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Density</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Material Cost (₹)</th>
//                 {isAdmin && (
//                   <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {materials.map((material) => (
//                 <tr key={material.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 text-sm text-gray-700">{material.material}</td>
//                   <td className="px-6 py-4 text-sm text-gray-700">{material.material_specification}</td>
//                   <td className="px-6 py-4 text-sm text-gray-700">{material.density}</td>
//                   <td className="px-6 py-4 text-sm">
//                     {isAdmin && editingId === material.id ? (
//                       <input
//                         type="number"
//                         value={editedData.material_cost}
//                         onChange={(e) => handleInputChange(e.target.value)}
//                         className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                       />
//                     ) : (
//                       <span className="text-gray-700">₹{material.material_cost}</span>
//                     )}
//                   </td>
//                   {isAdmin && (
//                     <td className="px-6 py-4 text-sm">
//                       {editingId === material.id ? (
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
//                           onClick={() => handleEdit(material)}
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
//             <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update material costs.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TurningMaterials;





// import React, { useState, useEffect } from "react";
// import { ArrowLeft, Edit2, Save, X, Download, Search } from "lucide-react";

// const TurningMaterials = ({ onBack }) => {
//   const [materials, setMaterials] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [updating, setUpdating] = useState(false);
//   const [userRole, setUserRole] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     // Get user role from sessionStorage
//     const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
//     setUserRole(userData.role || '');
//     fetchMaterials();
//   }, []);

//   const fetchMaterials = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch("http://localhost:5678/turning-materials");
//       const data = await response.json();
//       if (data.success) {
//         // Sort by ID to maintain consistent order
//         const sortedData = [...data.data].sort((a, b) => a.id - b.id);
//         setMaterials(sortedData);
//         setError(null);
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (material) => {
//     setEditingId(material.id);
//     setEditedData({
//       id: material.id,
//       material: material.material,
//       material_specification: material.material_specification,
//       material_cost: material.material_cost,
//     });
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedData({});
//   };

//   const handleInputChange = (value) => {
//     setEditedData(prev => ({
//       ...prev,
//       material_cost: Number(value),
//     }));
//   };

//   const handleUpdate = async () => {
//     try {
//       setUpdating(true);
//       const payload = {
//         id: editedData.id,
//         material: editedData.material,
//         material_specification: editedData.material_specification,
//         new_cost: editedData.material_cost,
//       };
//       const response = await fetch(
//         "http://localhost:5678/materials/update-cost/",
//         {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const responseData = await response.json();
//       alert(responseData.message);

//       // Update the material cost locally while maintaining order - find by index
//       setMaterials((prevMaterials) => {
//         const index = prevMaterials.findIndex(m => m.id === editedData.id);
//         if (index !== -1) {
//           const updated = [...prevMaterials];
//           updated[index] = { ...updated[index], material_cost: editedData.material_cost };
//           return updated;
//         }
//         return prevMaterials;
//       });

//       setEditingId(null);
//       setEditedData({});
//     } catch (err) {
//       alert("Error updating material: " + err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const exportToExcel = () => {
//     if (filteredMaterials.length === 0) {
//       alert("No data to export");
//       return;
//     }

//     // Define headers
//     const headers = [
//       "Material",
//       "Specification",
//       "Density",
//       "Material Cost (₹)"
//     ];

//     // Create CSV content
//     let csvContent = headers.join(",") + "\n";

//     filteredMaterials.forEach(material => {
//       const row = [
//         `"${material.material}"`,
//         `"${material.material_specification}"`,
//         material.density,
//         material.material_cost
//       ];
//       csvContent += row.join(",") + "\n";
//     });

//     // Create blob and download
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);

//     link.setAttribute("href", url);
//     link.setAttribute("download", `Turning_Materials_${new Date().toISOString().split('T')[0]}.csv`);
//     link.style.visibility = "hidden";

//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Filter materials based on search query
//   const filteredMaterials = materials.filter(material =>
//     material.material.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Check if user is admin
//   const isAdmin = userRole.toLowerCase() === 'admin';

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-gray-600">Loading materials...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-red-600">Error: {error}</div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Turning Materials</h2>
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

//       {/* Search Bar */}
//       <div className="mb-4">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//           <input
//             type="text"
//             placeholder="Search by material name ..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679] focus:border-transparent"
//           />
//         </div>
//         <p className="mt-2 text-sm text-gray-600">
//           Showing {filteredMaterials.length} of {materials.length} materials
//         </p>
//       </div>

//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-[#246679] text-white">
//               <tr>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Material</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Specification</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Density</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Material Cost (₹)</th>
//                 {isAdmin && (
//                   <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {filteredMaterials.length > 0 ? (
//                 filteredMaterials.map((material) => (
//                   <tr key={material.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 text-sm text-gray-700">{material.material}</td>
//                     <td className="px-6 py-4 text-sm text-gray-700">{material.material_specification}</td>
//                     <td className="px-6 py-4 text-sm text-gray-700">{material.density}</td>
//                     <td className="px-6 py-4 text-sm">
//                       {isAdmin && editingId === material.id ? (
//                         <input
//                           type="number"
//                           value={editedData.material_cost}
//                           onChange={(e) => handleInputChange(e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                         />
//                       ) : (
//                         <span className="text-gray-700">₹{material.material_cost}</span>
//                       )}
//                     </td>
//                     {isAdmin && (
//                       <td className="px-6 py-4 text-sm">
//                         {editingId === material.id ? (
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={handleUpdate}
//                               disabled={updating}
//                               className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
//                             >
//                               <Save className="w-4 h-4" />
//                               <span>{updating ? "Saving..." : "Save"}</span>
//                             </button>
//                             <button
//                               onClick={handleCancel}
//                               disabled={updating}
//                               className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
//                             >
//                               <X className="w-4 h-4" />
//                               <span>Cancel</span>
//                             </button>
//                           </div>
//                         ) : (
//                           <button
//                             onClick={() => handleEdit(material)}
//                             className="flex items-center space-x-1 px-3 py-1 bg-[#246679] text-white rounded hover:bg-[#1f5766] transition-colors duration-200"
//                           >
//                             <Edit2 className="w-4 h-4" />
//                             <span>Update</span>
//                           </button>
//                         )}
//                       </td>
//                     )}
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={isAdmin ? 5 : 4} className="px-6 py-8 text-center text-gray-500">
//                     No materials found matching "{searchQuery}"
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {!isAdmin && (
//         <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//           <p className="text-sm text-yellow-800">
//             <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update material costs.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TurningMaterials;




import React, { useState, useEffect } from "react";
import { ArrowLeft, Edit2, Save, X, Download, Search, Plus, Trash2 } from "lucide-react";

const TurningMaterials = ({ onBack }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [updating, setUpdating] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    material: '',
    material_specification: '',
    density: '',
    material_cost: '',
    parameters: [{
      diameter_range: '',
      roughing_depth_of_cut: '',
      roughing_feed_rate: '',
      roughing_cutting_speed: '',
      finishing_depth_of_cut: '',
      finishing_feed_rate: '',
      finishing_cutting_speed: ''
    }],
    mhr_rates: [{
      diameter_condition: '',
      turning_rate: '',
      boring_rate: '',
      threading_rate: '',
      milling_rate: ''
    }]
  });
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    setUserRole(userData.role || '');
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5678/turning-materials");
      const data = await response.json();
      if (data.success) {
        const sortedData = [...data.data].sort((a, b) => a.id - b.id);
        setMaterials(sortedData);
        setError(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (material) => {
    setEditingId(material.id);
    setEditedData({
      id: material.id,
      material: material.material,
      material_specification: material.material_specification,
      material_cost: material.material_cost,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedData({});
  };

  const handleInputChange = (value) => {
    setEditedData(prev => ({
      ...prev,
      material_cost: Number(value),
    }));
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const payload = {
        id: editedData.id,
        material: editedData.material,
        material_specification: editedData.material_specification,
        new_cost: editedData.material_cost,
      };
      const response = await fetch(
        "http://localhost:5678/materials/update-cost/",
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await response.json();
      alert(responseData.message);

      setMaterials((prevMaterials) => {
        const index = prevMaterials.findIndex(m => m.id === editedData.id);
        if (index !== -1) {
          const updated = [...prevMaterials];
          updated[index] = { ...updated[index], material_cost: editedData.material_cost };
          return updated;
        }
        return prevMaterials;
      });

      setEditingId(null);
      setEditedData({});
    } catch (err) {
      alert("Error updating material: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (material) => {
    if (!window.confirm(`Are you sure you want to delete "${material.material}" (${material.material_specification})? This will also delete all related parameters and machine hour rates.`)) {
      return;
    }

    try {
      setDeleting(material.id);
      const payload = {
        material: material.material,
        material_specification: material.material_specification,
        density: material.density,
        material_cost: material.material_cost
      };

      const response = await fetch(
        "http://localhost:5678/materials/delete/",
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        alert(responseData.message);
        setMaterials(prevMaterials => prevMaterials.filter(m => m.id !== material.id));
      } else {
        alert("Error: " + (responseData.detail || "Failed to delete material"));
      }
    } catch (err) {
      alert("Error deleting material: " + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const addParameterSet = () => {
    setNewMaterial(prev => ({
      ...prev,
      parameters: [...prev.parameters, {
        diameter_range: '',
        roughing_depth_of_cut: '',
        roughing_feed_rate: '',
        roughing_cutting_speed: '',
        finishing_depth_of_cut: '',
        finishing_feed_rate: '',
        finishing_cutting_speed: ''
      }]
    }));
  };

  const addRateSet = () => {
    setNewMaterial(prev => ({
      ...prev,
      mhr_rates: [...prev.mhr_rates, {
        diameter_condition: '',
        turning_rate: '',
        boring_rate: '',
        threading_rate: '',
        milling_rate: ''
      }]
    }));
  };

  const updateParameter = (index, field, value) => {
    setNewMaterial(prev => {
      const updated = [...prev.parameters];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, parameters: updated };
    });
  };

  const updateRate = (index, field, value) => {
    setNewMaterial(prev => {
      const updated = [...prev.mhr_rates];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, mhr_rates: updated };
    });
  };

  const removeParameterSet = (index) => {
    if (newMaterial.parameters.length > 1) {
      setNewMaterial(prev => ({
        ...prev,
        parameters: prev.parameters.filter((_, i) => i !== index)
      }));
    }
  };

  const removeRateSet = (index) => {
    if (newMaterial.mhr_rates.length > 1) {
      setNewMaterial(prev => ({
        ...prev,
        mhr_rates: prev.mhr_rates.filter((_, i) => i !== index)
      }));
    }
  };

  const handleAddMaterial = async () => {
    if (!newMaterial.material || !newMaterial.material_specification ||
      !newMaterial.density || !newMaterial.material_cost) {
      alert("Please fill in all required material fields");
      return;
    }

    try {
      setAdding(true);
      const payload = {
        material: newMaterial.material,
        material_specification: newMaterial.material_specification,
        density: parseFloat(newMaterial.density),
        material_cost: parseFloat(newMaterial.material_cost),
        parameters: newMaterial.parameters.map(p => ({
          diameter_range: p.diameter_range,
          roughing_depth_of_cut: parseFloat(p.roughing_depth_of_cut) || 0,
          roughing_feed_rate: parseFloat(p.roughing_feed_rate) || 0,
          roughing_cutting_speed: parseFloat(p.roughing_cutting_speed) || 0,
          finishing_depth_of_cut: parseFloat(p.finishing_depth_of_cut) || 0,
          finishing_feed_rate: parseFloat(p.finishing_feed_rate) || 0,
          finishing_cutting_speed: parseFloat(p.finishing_cutting_speed) || 0
        })),
        mhr_rates: newMaterial.mhr_rates.map(r => ({
          diameter_condition: r.diameter_condition,
          turning_rate: parseFloat(r.turning_rate) || 0,
          boring_rate: parseFloat(r.boring_rate) || 0,
          threading_rate: parseFloat(r.threading_rate) || 0,
          milling_rate: parseFloat(r.milling_rate) || 0
        }))
      };

      const response = await fetch(
        "http://localhost:5678/turning_create_materials/",
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        alert(responseData.message);
        await fetchMaterials();
        setNewMaterial({
          material: '',
          material_specification: '',
          density: '',
          material_cost: '',
          parameters: [{
            diameter_range: '',
            roughing_depth_of_cut: '',
            roughing_feed_rate: '',
            roughing_cutting_speed: '',
            finishing_depth_of_cut: '',
            finishing_feed_rate: '',
            finishing_cutting_speed: ''
          }],
          mhr_rates: [{
            diameter_condition: '',
            turning_rate: '',
            boring_rate: '',
            threading_rate: '',
            milling_rate: ''
          }]
        });
        setShowAddForm(false);
      } else {
        alert("Error: " + (responseData.detail || "Failed to add material"));
      }
    } catch (err) {
      alert("Error adding material: " + err.message);
    } finally {
      setAdding(false);
    }
  };

  const exportToExcel = () => {
    if (filteredMaterials.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = ["Material", "Specification", "Density", "Material Cost (₹)"];
    let csvContent = headers.join(",") + "\n";

    filteredMaterials.forEach(material => {
      const row = [
        `"${material.material}"`,
        `"${material.material_specification}"`,
        material.density,
        material.material_cost
      ];
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `Turning_Materials_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredMaterials = materials.filter(material =>
    material.material.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAdmin = userRole.toLowerCase() === 'admin';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading materials...</div>
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Turning Materials</h2>
        <div className="flex items-center space-x-3">
          {isAdmin && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"

            >
              <Plus className="w-4 h-4" />
              <span>Add Material</span>
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

      {/* Add Material Modal/Form */}
      {showAddForm && isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">Add New Material</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Material Details */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Material Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Material Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Titanium Alloy"
                      value={newMaterial.material}
                      onChange={(e) => setNewMaterial({ ...newMaterial, material: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Material Specification *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., ASTM B348"
                      value={newMaterial.material_specification}
                      onChange={(e) => setNewMaterial({ ...newMaterial, material_specification: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Density (kg/m³) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g., 7850"
                      value={newMaterial.density}
                      onChange={(e) => setNewMaterial({ ...newMaterial, density: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Material Cost (₹/kg) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g., 150"
                      value={newMaterial.material_cost}
                      onChange={(e) => setNewMaterial({ ...newMaterial, material_cost: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    />
                  </div>
                </div>
              </div>

              {/* Turning Parameters */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-semibold text-gray-700">Turning Parameters</h4>
                  <button
                    onClick={addParameterSet}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Add Parameter Set
                  </button>
                </div>
                <div className="space-y-4">
                  {newMaterial.parameters.map((param, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-700">Parameter Set {index + 1}</span>
                        {newMaterial.parameters.length > 1 && (
                          <button
                            onClick={() => removeParameterSet(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-3">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Diameter Range</label>
                          <input
                            type="text"
                            placeholder="e.g., 0-50"
                            value={param.diameter_range}
                            onChange={(e) => updateParameter(index, 'diameter_range', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#246679]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Roughing DOC</label>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="100"
                            value={param.roughing_depth_of_cut}
                            onChange={(e) => updateParameter(index, 'roughing_depth_of_cut', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#246679]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Roughing Feed</label>
                          <input
                            type="number"
                            step="0.001"
                            placeholder="0.100"
                            value={param.roughing_feed_rate}
                            onChange={(e) => updateParameter(index, 'roughing_feed_rate', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#246679]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Roughing Speed</label>
                          <input
                            type="number"
                            step="1"
                            placeholder="100"
                            value={param.roughing_cutting_speed}
                            onChange={(e) => updateParameter(index, 'roughing_cutting_speed', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#246679]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Finishing DOC</label>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="0.50"
                            value={param.finishing_depth_of_cut}
                            onChange={(e) => updateParameter(index, 'finishing_depth_of_cut', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#246679]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Finishing Feed</label>
                          <input
                            type="number"
                            step="0.001"
                            placeholder="0.050"
                            value={param.finishing_feed_rate}
                            onChange={(e) => updateParameter(index, 'finishing_feed_rate', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#246679]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Finishing Speed</label>
                          <input
                            type="number"
                            step="1"
                            placeholder="150"
                            value={param.finishing_cutting_speed}
                            onChange={(e) => updateParameter(index, 'finishing_cutting_speed', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#246679]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Machine Hour Rates */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-semibold text-gray-700">Machine Hour Rates (₹/hour)</h4>
                  <button
                    onClick={addRateSet}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Add Rate Set
                  </button>
                </div>
                <div className="space-y-4">
                  {newMaterial.mhr_rates.map((rate, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-700">Rate Set {index + 1}</span>
                        {newMaterial.mhr_rates.length > 1 && (
                          <button
                            onClick={() => removeRateSet(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-3">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Diameter Condition</label>
                          <input
                            type="text"
                            placeholder="e.g., 0-50"
                            value={rate.diameter_condition}
                            onChange={(e) => updateRate(index, 'diameter_condition', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#246679]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Turning Rate</label>
                          <input
                            type="number"
                            step="1"
                            placeholder="50"
                            value={rate.turning_rate}
                            onChange={(e) => updateRate(index, 'turning_rate', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#246679]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Boring Rate</label>
                          <input
                            type="number"
                            step="1"
                            placeholder="60"
                            value={rate.boring_rate}
                            onChange={(e) => updateRate(index, 'boring_rate', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#246679]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Threading Rate</label>
                          <input
                            type="number"
                            step="1"
                            placeholder="70"
                            value={rate.threading_rate}
                            onChange={(e) => updateRate(index, 'threading_rate', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#246679]"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Milling Rate</label>
                          <input
                            type="number"
                            step="1"
                            placeholder="80"
                            value={rate.milling_rate}
                            onChange={(e) => updateRate(index, 'milling_rate', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#246679]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> Turning Parameters and Machine Hour Rates are required for proper cost calculation based on your specific requirements.
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewMaterial({
                    material: '',
                    material_specification: '',
                    density: '',
                    material_cost: '',
                    parameters: [{
                      diameter_range: '',
                      roughing_depth_of_cut: '',
                      roughing_feed_rate: '',
                      roughing_cutting_speed: '',
                      finishing_depth_of_cut: '',
                      finishing_feed_rate: '',
                      finishing_cutting_speed: ''
                    }],
                    mhr_rates: [{
                      diameter_condition: '',
                      turning_rate: '',
                      boring_rate: '',
                      threading_rate: '',
                      milling_rate: ''
                    }]
                  });
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMaterial}
                disabled={adding}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
              >
                {adding ? "Adding..." : "Add Material"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by material name ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679] focus:border-transparent"
          />
        </div>
        {/* <p className="mt-2 text-sm text-gray-600">
          Showing {filteredMaterials.length} of {materials.length} materials
        </p> */}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#246679] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Material</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Specification</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Density</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Material Cost (₹)</th>
                {isAdmin && (
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMaterials.length > 0 ? (
                filteredMaterials.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">{material.material}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{material.material_specification}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{material.density}</td>
                    <td className="px-6 py-4 text-sm">
                      {isAdmin && editingId === material.id ? (
                        <input
                          type="number"
                          value={editedData.material_cost}
                          onChange={(e) => handleInputChange(e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                        />
                      ) : (
                        <span className="text-gray-700">₹{material.material_cost}</span>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-sm">
                        {editingId === material.id ? (
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
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(material)}
                              className="flex items-center space-x-1 px-3 py-1 bg-[#246679] text-white rounded hover:bg-[#1f5766] transition-colors duration-200"
                            >
                              <Edit2 className="w-4 h-4" />
                              <span>Update</span>
                            </button>
                            <button
                              onClick={() => handleDelete(material)}
                              disabled={deleting === material.id}
                              className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>{deleting === material.id ? "Deleting..." : "Delete"}</span>
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="px-6 py-8 text-center text-gray-500">
                    No materials found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!isAdmin && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can add, update, or delete material costs.
          </p>
        </div>
      )}
    </div>
  );
};

export default TurningMaterials;