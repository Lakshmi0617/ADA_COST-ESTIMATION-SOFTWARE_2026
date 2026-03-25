// '''''first working code 
// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, Edit2, Save, X } from 'lucide-react';

// const MillingManufacturingPercentage = ({ onBack }) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedPercentage, setEditedPercentage] = useState('');
//   const [updating, setUpdating] = useState(false);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://172.18.100.156:8004/milling-manufacturing-percentage/');
//       if (!response.ok) throw new Error('Failed to fetch manufacturing percentage');
//       const result = await response.json();
//       setData(result);
//       setEditedPercentage(result.percentage_of_manufacturing_time);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = () => {
//     setIsEditing(true);
//     setEditedPercentage(data.percentage_of_manufacturing_time);
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     setEditedPercentage(data.percentage_of_manufacturing_time);
//   };

//   const handleUpdate = async () => {
//     try {
//       setUpdating(true);
//       const response = await fetch('http://172.18.100.156:8004/milling-manufacturing-percentage/update/', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'accept': 'application/json'
//         },
//         body: JSON.stringify({
//           percentage_of_manufacturing_time: Number(editedPercentage)
//         })
//       });

//       if (!response.ok) throw new Error('Failed to update manufacturing percentage');
      
//       const result = await response.json();
      
//       setData({
//         id: result.id,
//         percentage_of_manufacturing_time: result.percentage_of_manufacturing_time
//       });
      
//       setIsEditing(false);
//       alert('Manufacturing percentage updated successfully!');
//     } catch (err) {
//       alert('Error updating manufacturing percentage: ' + err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-gray-600">Loading manufacturing percentage...</div>
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
//         <h2 className="text-2xl font-bold text-gray-800">Manufacturing Percentage Management</h2>
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
//                 <th className="px-6 py-3 text-left text-sm font-semibold">
//                   Manufacturing Time Percentage (%)
//                 </th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               <tr className="hover:bg-gray-50">
//                 {/* ID column removed */}
//                 <td className="px-6 py-4 text-sm">
//                   {isEditing ? (
//                     <div className="flex items-center space-x-2">
//                       <input
//                         type="number"
//                         min="0"
//                         max="100"
//                         value={editedPercentage}
//                         onChange={(e) => setEditedPercentage(e.target.value)}
//                         className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                       />
//                       <span className="text-gray-500">%</span>
//                     </div>
//                   ) : (
//                     <span className="text-gray-700 font-medium">
//                       {data.percentage_of_manufacturing_time}%
//                     </span>
//                   )}
//                 </td>
//                 <td className="px-6 py-4 text-sm">
//                   {isEditing ? (
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={handleUpdate}
//                         disabled={updating}
//                         className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
//                       >
//                         <Save className="w-4 h-4" />
//                         <span>{updating ? 'Saving...' : 'Save'}</span>
//                       </button>
//                       <button
//                         onClick={handleCancel}
//                         disabled={updating}
//                         className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
//                       >
//                         <X className="w-4 h-4" />
//                         <span>Cancel</span>
//                       </button>
//                     </div>
//                   ) : (
//                     <button
//                       onClick={handleEdit}
//                       className="flex items-center space-x-1 px-3 py-1 bg-[#246679] text-white rounded hover:bg-[#1f5766] transition-colors duration-200"
//                     >
//                       <Edit2 className="w-4 h-4" />
//                       <span>Update</span>
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
//         <h3 className="text-sm font-semibold text-blue-800 mb-2">
//           About Manufacturing Percentage
//         </h3>
//         <p className="text-sm text-blue-700">
//           This percentage represents the proportion of time allocated to manufacturing operations
//           in the milling process. Adjust this value to optimize your production planning and
//           scheduling.
//         </p>
//       </div> */}
//     </div>
//   );
// };

// export default MillingManufacturingPercentage;






// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, Edit2, Save, X } from 'lucide-react';

// const MillingManufacturingPercentage = ({ onBack }) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedPercentage, setEditedPercentage] = useState('');
//   const [updating, setUpdating] = useState(false);
//   const [userRole, setUserRole] = useState('');

//   useEffect(() => {
//     // Get user role from sessionStorage
//     const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
//     setUserRole(userData.role || '');
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://172.18.100.156:8004/milling-manufacturing-percentage/');
//       if (!response.ok) throw new Error('Failed to fetch manufacturing percentage');
//       const result = await response.json();
//       setData(result);
//       setEditedPercentage(result.percentage_of_manufacturing_time);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = () => {
//     setIsEditing(true);
//     setEditedPercentage(data.percentage_of_manufacturing_time);
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     setEditedPercentage(data.percentage_of_manufacturing_time);
//   };

//   const handleUpdate = async () => {
//     try {
//       setUpdating(true);
//       const response = await fetch('http://172.18.100.156:8004/milling-manufacturing-percentage/update/', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'accept': 'application/json'
//         },
//         body: JSON.stringify({
//           percentage_of_manufacturing_time: Number(editedPercentage)
//         })
//       });

//       if (!response.ok) throw new Error('Failed to update manufacturing percentage');
      
//       const result = await response.json();
      
//       setData({
//         id: result.id,
//         percentage_of_manufacturing_time: result.percentage_of_manufacturing_time
//       });
      
//       setIsEditing(false);
//       alert('Manufacturing percentage updated successfully!');
//     } catch (err) {
//       alert('Error updating manufacturing percentage: ' + err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // Check if user is admin
//   const isAdmin = userRole.toLowerCase() === 'admin';

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-gray-600">Loading manufacturing percentage...</div>
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
//         <h2 className="text-2xl font-bold text-gray-800">Manufacturing Percentage Management</h2>
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
//                 <th className="px-6 py-3 text-left text-sm font-semibold">
//                   Manufacturing Time Percentage (%)
//                 </th>
//                 {isAdmin && (
//                   <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               <tr className="hover:bg-gray-50">
//                 <td className="px-6 py-4 text-sm">
//                   {isAdmin && isEditing ? (
//                     <div className="flex items-center space-x-2">
//                       <input
//                         type="number"
//                         min="0"
//                         max="100"
//                         value={editedPercentage}
//                         onChange={(e) => setEditedPercentage(e.target.value)}
//                         className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                       />
//                       <span className="text-gray-500">%</span>
//                     </div>
//                   ) : (
//                     <span className="text-gray-700 font-medium">
//                       {data.percentage_of_manufacturing_time}%
//                     </span>
//                   )}
//                 </td>
//                 {isAdmin && (
//                   <td className="px-6 py-4 text-sm">
//                     {isEditing ? (
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={handleUpdate}
//                           disabled={updating}
//                           className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
//                         >
//                           <Save className="w-4 h-4" />
//                           <span>{updating ? 'Saving...' : 'Save'}</span>
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
//                         onClick={handleEdit}
//                         className="flex items-center space-x-1 px-3 py-1 bg-[#246679] text-white rounded hover:bg-[#1f5766] transition-colors duration-200"
//                       >
//                         <Edit2 className="w-4 h-4" />
//                         <span>Update</span>
//                       </button>
//                     )}
//                   </td>
//                 )}
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {!isAdmin && (
//         <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//           <p className="text-sm text-yellow-800">
//             <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update the manufacturing percentage.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MillingManufacturingPercentage;








//'''''this below code added the export to excel button to download the data into  excelformatt''''''// 

// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, Edit2, Save, X, Download } from 'lucide-react';
// import * as XLSX from 'xlsx';

// const MillingManufacturingPercentage = ({ onBack }) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedPercentage, setEditedPercentage] = useState('');
//   const [updating, setUpdating] = useState(false);
//   const [userRole, setUserRole] = useState('');

//   useEffect(() => {
//     // Get user role from memory (simulated)
//     const userData = { role: 'admin' }; // Replace with actual user data
//     setUserRole(userData.role || '');
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://172.18.100.156:8004/milling-manufacturing-percentage/');
//       if (!response.ok) throw new Error('Failed to fetch manufacturing percentage');
//       const result = await response.json();
//       setData(result);
//       setEditedPercentage(result.percentage_of_manufacturing_time);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = () => {
//     setIsEditing(true);
//     setEditedPercentage(data.percentage_of_manufacturing_time);
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     setEditedPercentage(data.percentage_of_manufacturing_time);
//   };

//   const handleUpdate = async () => {
//     try {
//       setUpdating(true);
//       const response = await fetch('http://172.18.100.156:8004/milling-manufacturing-percentage/update/', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'accept': 'application/json'
//         },
//         body: JSON.stringify({
//           percentage_of_manufacturing_time: Number(editedPercentage)
//         })
//       });

//       if (!response.ok) throw new Error('Failed to update manufacturing percentage');
      
//       const result = await response.json();
      
//       setData({
//         id: result.id,
//         percentage_of_manufacturing_time: result.percentage_of_manufacturing_time
//       });
      
//       setIsEditing(false);
//       alert('Manufacturing percentage updated successfully!');
//     } catch (err) {
//       alert('Error updating manufacturing percentage: ' + err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleExportToExcel = () => {
//     try {
//       if (!data) {
//         alert('No data available to export');
//         return;
//       }

//       // Prepare data for Excel
//       const excelData = [{
//         'Manufacturing Time Percentage (%)': data.percentage_of_manufacturing_time
//       }];

//       // Create worksheet
//       const ws = XLSX.utils.json_to_sheet(excelData);

//       // Set column width
//       ws['!cols'] = [
//         { wch: 35 }
//       ];

//       // Create workbook
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Manufacturing Percentage');

//       // Generate filename with current date
//       const date = new Date().toISOString().split('T')[0];
//       const filename = `Manufacturing_Percentage_${date}.xlsx`;

//       // Download file
//       XLSX.writeFile(wb, filename);
//     } catch (err) {
//       alert('Error exporting to Excel: ' + err.message);
//     }
//   };

//   const isAdmin = userRole.toLowerCase() === 'admin';

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-gray-600">Loading manufacturing percentage...</div>
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
//             <button
//             onClick={onBack}
//             className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             <span>Back to Overview</span>
//           </button>
//         <h2 className="text-2xl font-bold text-gray-800">Milling Manufacturing Percentage </h2>
//         <div className="flex items-center space-x-3">
//           <button
//             onClick={handleExportToExcel}
//             className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
//           >
//             <Download className="w-4 h-4" />
//             <span>Export to Excel</span>
//           </button>
//           {/* <button
//             onClick={onBack}
//             className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             <span>Back to Overview</span>
//           </button> */}
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-[#246679] text-white">
//               <tr>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">
//                 Percentage of Machining Time wrt manufacturing time(%) 
//                 </th>
//                 {isAdmin && (
//                   <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               <tr className="hover:bg-gray-50">
//                 <td className="px-6 py-4 text-sm">
//                   {isAdmin && isEditing ? (
//                     <div className="flex items-center space-x-2">
//                       <input
//                         type="number"
//                         min="0"
//                         max="100"
//                         value={editedPercentage}
//                         onChange={(e) => setEditedPercentage(e.target.value)}
//                         className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                       />
//                       <span className="text-gray-500">%</span>
//                     </div>
//                   ) : (
//                     <span className="text-gray-700 font-medium">
//                       {data.percentage_of_manufacturing_time}%
//                     </span>
//                   )}
//                 </td>
//                 {isAdmin && (
//                   <td className="px-6 py-4 text-sm">
//                     {isEditing ? (
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={handleUpdate}
//                           disabled={updating}
//                           className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
//                         >
//                           <Save className="w-4 h-4" />
//                           <span>{updating ? 'Saving...' : 'Save'}</span>
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
//                         onClick={handleEdit}
//                         className="flex items-center space-x-1 px-3 py-1 bg-[#246679] text-white rounded hover:bg-[#1f5766] transition-colors duration-200"
//                       >
//                         <Edit2 className="w-4 h-4" />
//                         <span>Update</span>
//                       </button>
//                     )}
//                   </td>
//                 )}
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {!isAdmin && (
//         <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//           <p className="text-sm text-yellow-800">
//             <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update the manufacturing percentage.
//           </p>
//         </div>
        
//       )}
      
//     </div>
//   );
// };

// export default MillingManufacturingPercentage;





// '''role based login action column will be hidden
// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, Edit2, Save, X, Download } from 'lucide-react';
// import * as XLSX from 'xlsx';

// const MillingManufacturingPercentage = ({ onBack }) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedPercentage, setEditedPercentage] = useState('');
//   const [updating, setUpdating] = useState(false);
//   const [userRole, setUserRole] = useState('');

//   useEffect(() => {
//     // Get user role from sessionStorage - FIXED
//     const userData = sessionStorage.getItem('userData');
//     if (userData) {
//       const parsedData = JSON.parse(userData);
//       setUserRole(parsedData.role || '');
//       console.log('User role from session:', parsedData.role);
//     }
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://172.18.100.156:8004/milling-manufacturing-percentage/');
//       if (!response.ok) throw new Error('Failed to fetch manufacturing percentage');
//       const result = await response.json();
//       setData(result);
//       setEditedPercentage(result.percentage_of_manufacturing_time);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = () => {
//     setIsEditing(true);
//     setEditedPercentage(data.percentage_of_manufacturing_time);
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     setEditedPercentage(data.percentage_of_manufacturing_time);
//   };

//   const handleUpdate = async () => {
//     try {
//       setUpdating(true);
//       const response = await fetch('http://172.18.100.156:8004/milling-manufacturing-percentage/update/', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'accept': 'application/json'
//         },
//         body: JSON.stringify({
//           percentage_of_manufacturing_time: Number(editedPercentage)
//         })
//       });

//       if (!response.ok) throw new Error('Failed to update manufacturing percentage');
      
//       const result = await response.json();
      
//       setData({
//         id: result.id,
//         percentage_of_manufacturing_time: result.percentage_of_manufacturing_time
//       });
      
//       setIsEditing(false);
//       alert('Manufacturing percentage updated successfully!');
//     } catch (err) {
//       alert('Error updating manufacturing percentage: ' + err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleExportToExcel = () => {
//     try {
//       if (!data) {
//         alert('No data available to export');
//         return;
//       }

//       const excelData = [{
//         'Manufacturing Time Percentage (%)': data.percentage_of_manufacturing_time
//       }];

//       const ws = XLSX.utils.json_to_sheet(excelData);
//       ws['!cols'] = [{ wch: 35 }];

//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Manufacturing Percentage');

//       const date = new Date().toISOString().split('T')[0];
//       const filename = `Manufacturing_Percentage_${date}.xlsx`;

//       XLSX.writeFile(wb, filename);
//     } catch (err) {
//       alert('Error exporting to Excel: ' + err.message);
//     }
//   };

//   // Check if user is admin - case insensitive
//   const isAdmin = userRole.toLowerCase() === 'admin';

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-gray-600">Loading manufacturing percentage...</div>
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
//         <button
//           onClick={onBack}
//           className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           <span>Back to Overview</span>
//         </button>
//         <h2 className="text-2xl font-bold text-gray-800">Milling Manufacturing Percentage</h2>
//         <button
//           onClick={handleExportToExcel}
//           className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
//         >
//           <Download className="w-4 h-4" />
//           <span>Export to Excel</span>
//         </button>
//       </div>

//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-[#246679] text-white">
//               <tr>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">
//                   Percentage of Machining Time wrt manufacturing time(%)
//                 </th>
//                 {isAdmin && (
//                   <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               <tr className="hover:bg-gray-50">
//                 <td className="px-6 py-4 text-sm">
//                   {isAdmin && isEditing ? (
//                     <div className="flex items-center space-x-2">
//                       <input
//                         type="number"
//                         min="0"
//                         max="100"
//                         value={editedPercentage}
//                         onChange={(e) => setEditedPercentage(e.target.value)}
//                         className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                       />
//                       <span className="text-gray-500">%</span>
//                     </div>
//                   ) : (
//                     <span className="text-gray-700 font-medium">
//                       {data.percentage_of_manufacturing_time}%
//                     </span>
//                   )}
//                 </td>
//                 {isAdmin && (
//                   <td className="px-6 py-4 text-sm">
//                     {isEditing ? (
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={handleUpdate}
//                           disabled={updating}
//                           className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
//                         >
//                           <Save className="w-4 h-4" />
//                           <span>{updating ? 'Saving...' : 'Save'}</span>
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
//                         onClick={handleEdit}
//                         className="flex items-center space-x-1 px-3 py-1 bg-[#246679] text-white rounded hover:bg-[#1f5766] transition-colors duration-200"
//                       >
//                         <Edit2 className="w-4 h-4" />
//                         <span>Update</span>
//                       </button>
//                     )}
//                   </td>
//                 )}
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {!isAdmin && (
//         <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//           <p className="text-sm text-yellow-800">
//             <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update the manufacturing percentage.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MillingManufacturingPercentage;








// /''''this is the new updated code with correction_factor filed column also displaying and updating both columns also''''''//
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit2, Save, X, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

const MillingManufacturingPercentage = ({ onBack }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    percentage_of_manufacturing_time: '',
    Correction_factor: ''
  });
  const [updating, setUpdating] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Get user role from sessionStorage
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUserRole(parsedData.role || '');
      console.log('User role from session:', parsedData.role);
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://172.18.100.156:8004/milling-manufacturing-percentage/');
      if (!response.ok) throw new Error('Failed to fetch manufacturing percentage');
      const result = await response.json();
      
      // Handle array response
      const dataItem = Array.isArray(result) ? result[0] : result;
      
      setData(dataItem);
      setEditedData({
        percentage_of_manufacturing_time: dataItem.percentage_of_manufacturing_time,
        Correction_factor: dataItem.correction_factor || dataItem.Correction_factor
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({
      percentage_of_manufacturing_time: data.percentage_of_manufacturing_time,
      Correction_factor: data.correction_factor || data.Correction_factor
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({
      percentage_of_manufacturing_time: data.percentage_of_manufacturing_time,
      Correction_factor: data.correction_factor || data.Correction_factor
    });
  };

  const handleUpdate = async () => {
    if (editedData.percentage_of_manufacturing_time === '' || Number(editedData.percentage_of_manufacturing_time) <= 0) {
      alert('Please enter a valid percentage');
      return;
    }
    if (editedData.Correction_factor === '') {
      alert('Please enter a valid correction factor');
      return;
    }

    try {
      setUpdating(true);
      
      // Create form data for x-www-form-urlencoded format
      const formData = new URLSearchParams();
      formData.append('percentage_of_manufacturing_time', Number(editedData.percentage_of_manufacturing_time));
      formData.append('Correction_factor', Number(editedData.Correction_factor));
      
      const response = await fetch('http://172.18.100.156:8004/milling-manufacturing-percentage/update/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'accept': 'application/json'
        },
        body: formData.toString()
      });

      if (!response.ok) throw new Error('Failed to update manufacturing percentage');
      
      const result = await response.json();
      
      // Handle both array and object responses
      const updatedData = Array.isArray(result) ? result[0] : result;
      
      setData({
        id: updatedData.id,
        percentage_of_manufacturing_time: updatedData.percentage_of_manufacturing_time,
        correction_factor: updatedData.correction_factor || updatedData.Correction_factor
      });
      
      setIsEditing(false);
      alert('Manufacturing percentage updated successfully!');
    } catch (err) {
      alert('Error updating manufacturing percentage: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleExportToExcel = () => {
    try {
      if (!data) {
        alert('No data available to export');
        return;
      }

      const excelData = [{
        'Manufacturing Time Percentage (%)': data.percentage_of_manufacturing_time,
        'Correction Factor': data.correction_factor
      }];

      const ws = XLSX.utils.json_to_sheet(excelData);
      ws['!cols'] = [{ wch: 35 }, { wch: 20 }];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Manufacturing Percentage');

      const date = new Date().toISOString().split('T')[0];
      const filename = `Manufacturing_Percentage_${date}.xlsx`;

      XLSX.writeFile(wb, filename);
    } catch (err) {
      alert('Error exporting to Excel: ' + err.message);
    }
  };

  // Check if user is admin - case insensitive
  const isAdmin = userRole.toLowerCase() === 'admin';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading manufacturing percentage...</div>
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Milling Manufacturing Percentage</h2>
        <button
          onClick={handleExportToExcel}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
          <Download className="w-4 h-4" />
          <span>Export to Excel</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#246679] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Percentage of Machining Time wrt manufacturing time(%)
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Correction Factor
                </th>
                {isAdmin && (
                  <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">
                  {isAdmin && isEditing ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editedData.percentage_of_manufacturing_time}
                        onChange={(e) => setEditedData({
                          ...editedData,
                          percentage_of_manufacturing_time: e.target.value
                        })}
                        className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                        disabled={updating}
                      />
                      <span className="text-gray-500">%</span>
                    </div>
                  ) : (
                    <span className="text-gray-700 font-medium">
                      {data.percentage_of_manufacturing_time}%
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  {isAdmin && isEditing ? (
                    <input
                      type="number"
                      step="0.1"
                      value={editedData.Correction_factor}
                      onChange={(e) => setEditedData({
                        ...editedData,
                        Correction_factor: e.target.value
                      })}
                      className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                      disabled={updating}
                    />
                  ) : (
                    <span className="text-gray-700 font-medium">
                      {data.correction_factor || data.Correction_factor}
                    </span>
                  )}
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 text-sm">
                    {isEditing ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleUpdate}
                          disabled={updating}
                          className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          <span>{updating ? 'Saving...' : 'Save'}</span>
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
                        onClick={handleEdit}
                        className="flex items-center space-x-1 px-3 py-1 bg-[#246679] text-white rounded hover:bg-[#1f5766] transition-colors duration-200"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Update</span>
                      </button>
                    )}
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {!isAdmin && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update the manufacturing percentage.
          </p>
        </div>
      )}
    </div>
  );
};

export default MillingManufacturingPercentage;