// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, Edit2, Save, X } from 'lucide-react';

// const MillingPercentages = ({ onBack }) => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [updating, setUpdating] = useState(false);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://localhost:5678/milling-percentages/');
//       if (!response.ok) throw new Error('Failed to fetch milling percentages');
//       const result = await response.json();
//       setData(result);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (item) => {
//     setEditingId(item.id);
//     setEditedData({
//       roughing_percentage: item.roughing_percentage,
//       finishing_percentage: item.finishing_percentage
//     });
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedData({});
//   };

//   const handleInputChange = (field, value) => {
//     setEditedData(prev => ({
//       ...prev,
//       [field]: Number(value)
//     }));
//   };

//   const handleUpdate = async () => {
//     try {
//       setUpdating(true);
//       const response = await fetch('http://localhost:5678/milling-percentages/update/', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'accept': 'application/json'
//         },
//         body: JSON.stringify(editedData)
//       });

//       if (!response.ok) throw new Error('Failed to update milling percentages');

//       const result = await response.json();

//       // Update local state
//       setData(prev => prev.map(item => 
//         item.id === result.id 
//           ? { 
//               id: result.id, 
//               roughing_percentage: result.roughing_percentage, 
//               finishing_percentage: result.finishing_percentage 
//             }
//           : item
//       ));

//       setEditingId(null);
//       setEditedData({});
//       alert('Milling percentages updated successfully!');
//     } catch (err) {
//       alert('Error updating milling percentages: ' + err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-gray-600">Loading milling percentages...</div>
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
//         <h2 className="text-2xl font-bold text-gray-800">Milling Percentages Management</h2>
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
//                 <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Percentage (%)</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Percentage (%)</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {data.map((item) => (
//                 <tr key={item.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 text-sm text-gray-700">{item.id}</td>
//                   <td className="px-6 py-4 text-sm">
//                     {editingId === item.id ? (
//                       <div className="flex items-center space-x-2">
//                         <input
//                           type="number"
//                           min="0"
//                           max="100"
//                           value={editedData.roughing_percentage}
//                           onChange={(e) => handleInputChange('roughing_percentage', e.target.value)}
//                           className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                         />
//                         <span className="text-gray-500">%</span>
//                       </div>
//                     ) : (
//                       <span className="text-gray-700 font-medium">{item.roughing_percentage}%</span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 text-sm">
//                     {editingId === item.id ? (
//                       <div className="flex items-center space-x-2">
//                         <input
//                           type="number"
//                           min="0"
//                           max="100"
//                           value={editedData.finishing_percentage}
//                           onChange={(e) => handleInputChange('finishing_percentage', e.target.value)}
//                           className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                         />
//                         <span className="text-gray-500">%</span>
//                       </div>
//                     ) : (
//                       <span className="text-gray-700 font-medium">{item.finishing_percentage}%</span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 text-sm">
//                     {editingId === item.id ? (
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
//                         onClick={() => handleEdit(item)}
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

//       <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
//         <h3 className="text-sm font-semibold text-blue-800 mb-2">About Milling Percentages</h3>
//         <p className="text-sm text-blue-700">
//           <strong>Roughing Percentage:</strong> The percentage of machining time allocated to roughing operations (removing bulk material).
//         </p>
//         <p className="text-sm text-blue-700 mt-2">
//           <strong>Finishing Percentage:</strong> The percentage of machining time allocated to finishing operations (achieving final surface quality and dimensions).
//         </p>
//         <p className="text-sm text-blue-600 mt-2 italic">
//           Note: The sum of roughing and finishing percentages should typically equal 100%.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default MillingPercentages;





//'''first working code'''

// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, Edit2, Save, X } from 'lucide-react';

// const MillingPercentages = ({ onBack }) => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [updating, setUpdating] = useState(false);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://localhost:5678/milling-percentages/');
//       if (!response.ok) throw new Error('Failed to fetch milling percentages');
//       const result = await response.json();
//       setData(result);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (item) => {
//     setEditingId(item.id);
//     setEditedData({
//       id: item.id, // keep id for backend update
//       roughing_percentage: item.roughing_percentage,
//       finishing_percentage: item.finishing_percentage
//     });
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedData({});
//   };

//   const handleInputChange = (field, value) => {
//     setEditedData(prev => ({
//       ...prev,
//       [field]: Number(value)
//     }));
//   };

//   const handleUpdate = async () => {
//     try {
//       setUpdating(true);
//       const response = await fetch('http://localhost:5678/milling-percentages/update/', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'accept': 'application/json'
//         },
//         body: JSON.stringify(editedData)
//       });

//       if (!response.ok) throw new Error('Failed to update milling percentages');

//       const result = await response.json();

//       // Update local state
//       setData(prev => prev.map(item => 
//         item.id === result.id 
//           ? { 
//               id: result.id, 
//               roughing_percentage: result.roughing_percentage, 
//               finishing_percentage: result.finishing_percentage 
//             }
//           : item
//       ));

//       setEditingId(null);
//       setEditedData({});
//       alert('Milling percentages updated successfully!');
//     } catch (err) {
//       alert('Error updating milling percentages: ' + err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-gray-600">Loading milling percentages...</div>
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
//         <h2 className="text-2xl font-bold text-gray-800">Milling Percentages Management</h2>
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
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Percentage (%)</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Percentage (%)</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {data.map((item) => (
//                 <tr key={item.id} className="hover:bg-gray-50">
//                   {/* Hidden ID field kept internally */}

//                   <td className="px-6 py-4 text-sm">
//                     {editingId === item.id ? (
//                       <div className="flex items-center space-x-2">
//                         <input
//                           type="number"
//                           min="0"
//                           max="100"
//                           value={editedData.roughing_percentage}
//                           onChange={(e) => handleInputChange('roughing_percentage', e.target.value)}
//                           className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                         />
//                         <span className="text-gray-500">%</span>
//                       </div>
//                     ) : (
//                       <span className="text-gray-700 font-medium">{item.roughing_percentage}%</span>
//                     )}
//                   </td>

//                   <td className="px-6 py-4 text-sm">
//                     {editingId === item.id ? (
//                       <div className="flex items-center space-x-2">
//                         <input
//                           type="number"
//                           min="0"
//                           max="100"
//                           value={editedData.finishing_percentage}
//                           onChange={(e) => handleInputChange('finishing_percentage', e.target.value)}
//                           className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                         />
//                         <span className="text-gray-500">%</span>
//                       </div>
//                     ) : (
//                       <span className="text-gray-700 font-medium">{item.finishing_percentage}%</span>
//                     )}
//                   </td>

//                   <td className="px-6 py-4 text-sm">
//                     {editingId === item.id ? (
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
//                         onClick={() => handleEdit(item)}
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

//       {/* <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
//         <h3 className="text-sm font-semibold text-blue-800 mb-2">About Milling Percentages</h3>
//         <p className="text-sm text-blue-700">
//           <strong>Roughing Percentage:</strong> The percentage of machining time allocated to roughing operations (removing bulk material).
//         </p>
//         <p className="text-sm text-blue-700 mt-2">
//           <strong>Finishing Percentage:</strong> The percentage of machining time allocated to finishing operations (achieving final surface quality and dimensions).
//         </p>
//         <p className="text-sm text-blue-600 mt-2 italic">
//           Note: The sum of roughing and finishing percentages should typically equal 100%.
//         </p>
//       </div> */}
//     </div>
//   );
// };

// export default MillingPercentages;





// ''''updated logic based on admin role action column is dispalyed 
// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, Edit2, Save, X } from 'lucide-react';

// const MillingPercentages = ({ onBack }) => {
//   const [data, setData] = useState([]);
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
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://localhost:5678/milling-percentages/');
//       if (!response.ok) throw new Error('Failed to fetch milling percentages');
//       const result = await response.json();
//       setData(result);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (item) => {
//     setEditingId(item.id);
//     setEditedData({
//       id: item.id,
//       roughing_percentage: item.roughing_percentage,
//       finishing_percentage: item.finishing_percentage
//     });
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedData({});
//   };

//   const handleInputChange = (field, value) => {
//     setEditedData(prev => ({
//       ...prev,
//       [field]: Number(value)
//     }));
//   };

//   const handleUpdate = async () => {
//     try {
//       setUpdating(true);
//       const response = await fetch('http://localhost:5678/milling-percentages/update/', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'accept': 'application/json'
//         },
//         body: JSON.stringify(editedData)
//       });

//       if (!response.ok) throw new Error('Failed to update milling percentages');

//       const result = await response.json();

//       // Update local state
//       setData(prev => prev.map(item => 
//         item.id === result.id 
//           ? { 
//               id: result.id, 
//               roughing_percentage: result.roughing_percentage, 
//               finishing_percentage: result.finishing_percentage 
//             }
//           : item
//       ));

//       setEditingId(null);
//       setEditedData({});
//       alert('Milling percentages updated successfully!');
//     } catch (err) {
//       alert('Error updating milling percentages: ' + err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // Check if user is admin
//   const isAdmin = userRole.toLowerCase() === 'admin';

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-gray-600">Loading milling percentages...</div>
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
//         <h2 className="text-2xl font-bold text-gray-800">Milling Percentages Management</h2>
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
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Percentage (%)</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Percentage (%)</th>
//                 {isAdmin && (
//                   <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {data.map((item) => (
//                 <tr key={item.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 text-sm">
//                     {isAdmin && editingId === item.id ? (
//                       <div className="flex items-center space-x-2">
//                         <input
//                           type="number"
//                           min="0"
//                           max="100"
//                           value={editedData.roughing_percentage}
//                           onChange={(e) => handleInputChange('roughing_percentage', e.target.value)}
//                           className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                         />
//                         <span className="text-gray-500">%</span>
//                       </div>
//                     ) : (
//                       <span className="text-gray-700 font-medium">{item.roughing_percentage}%</span>
//                     )}
//                   </td>

//                   <td className="px-6 py-4 text-sm">
//                     {isAdmin && editingId === item.id ? (
//                       <div className="flex items-center space-x-2">
//                         <input
//                           type="number"
//                           min="0"
//                           max="100"
//                           value={editedData.finishing_percentage}
//                           onChange={(e) => handleInputChange('finishing_percentage', e.target.value)}
//                           className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                         />
//                         <span className="text-gray-500">%</span>
//                       </div>
//                     ) : (
//                       <span className="text-gray-700 font-medium">{item.finishing_percentage}%</span>
//                     )}
//                   </td>

//                   {isAdmin && (
//                     <td className="px-6 py-4 text-sm">
//                       {editingId === item.id ? (
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={handleUpdate}
//                             disabled={updating}
//                             className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
//                           >
//                             <Save className="w-4 h-4" />
//                             <span>{updating ? 'Saving...' : 'Save'}</span>
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
//                           onClick={() => handleEdit(item)}
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
//             <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update milling percentages.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MillingPercentages;






//'''''this below code added the export to excel button to download the data into  excelformatt''''''// 
// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, Edit2, Save, X, Download } from 'lucide-react';
// import * as XLSX from 'xlsx';

// const MillingPercentages = ({ onBack }) => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
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
//       const response = await fetch('http://localhost:5678/milling-percentages/');
//       if (!response.ok) throw new Error('Failed to fetch milling percentages');
//       const result = await response.json();
//       setData(result);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (item) => {
//     setEditingId(item.id);
//     setEditedData({
//       id: item.id,
//       roughing_percentage: item.roughing_percentage,
//       finishing_percentage: item.finishing_percentage
//     });
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedData({});
//   };

//   const handleInputChange = (field, value) => {
//     setEditedData(prev => ({
//       ...prev,
//       [field]: Number(value)
//     }));
//   };

//   const handleUpdate = async () => {
//     try {
//       setUpdating(true);
//       const response = await fetch('http://localhost:5678/milling-percentages/update/', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'accept': 'application/json'
//         },
//         body: JSON.stringify(editedData)
//       });

//       if (!response.ok) throw new Error('Failed to update milling percentages');

//       const result = await response.json();

//       setData(prev => prev.map(item => 
//         item.id === result.id 
//           ? { 
//               id: result.id, 
//               roughing_percentage: result.roughing_percentage, 
//               finishing_percentage: result.finishing_percentage 
//             }
//           : item
//       ));

//       setEditingId(null);
//       setEditedData({});
//       alert('Milling percentages updated successfully!');
//     } catch (err) {
//       alert('Error updating milling percentages: ' + err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleExportToExcel = () => {
//     try {
//       // Prepare data for Excel
//       const excelData = data.map(item => ({
//         'Roughing Percentage (%)': item.roughing_percentage,
//         'Finishing Percentage (%)': item.finishing_percentage
//       }));

//       // Create worksheet
//       const ws = XLSX.utils.json_to_sheet(excelData);

//       // Set column widths
//       ws['!cols'] = [
//         { wch: 25 },
//         { wch: 25 }
//       ];

//       // Create workbook
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Milling Percentages');

//       // Generate filename with current date
//       const date = new Date().toISOString().split('T')[0];
//       const filename = `Milling_Percentages_${date}.xlsx`;

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
//         <div className="text-gray-600">Loading milling percentages...</div>
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
//           <button
//             onClick={onBack}
//             className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             <span>Back to Overview</span>
//           </button>
//         <h2 className="text-2xl font-bold text-gray-800">Milling Roughing Percentages </h2>
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
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Percentage (%)</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Percentage (%)</th>
//                 {isAdmin && (
//                   <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {data.map((item) => (
//                 <tr key={item.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 text-sm">
//                     {isAdmin && editingId === item.id ? (
//                       <div className="flex items-center space-x-2">
//                         <input
//                           type="number"
//                           min="0"
//                           max="100"
//                           value={editedData.roughing_percentage}
//                           onChange={(e) => handleInputChange('roughing_percentage', e.target.value)}
//                           className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                         />
//                         <span className="text-gray-500">%</span>
//                       </div>
//                     ) : (
//                       <span className="text-gray-700 font-medium">{item.roughing_percentage}%</span>
//                     )}
//                   </td>

//                   <td className="px-6 py-4 text-sm">
//                     {isAdmin && editingId === item.id ? (
//                       <div className="flex items-center space-x-2">
//                         <input
//                           type="number"
//                           min="0"
//                           max="100"
//                           value={editedData.finishing_percentage}
//                           onChange={(e) => handleInputChange('finishing_percentage', e.target.value)}
//                           className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                         />
//                         <span className="text-gray-500">%</span>
//                       </div>
//                     ) : (
//                       <span className="text-gray-700 font-medium">{item.finishing_percentage}%</span>
//                     )}
//                   </td>

//                   {isAdmin && (
//                     <td className="px-6 py-4 text-sm">
//                       {editingId === item.id ? (
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={handleUpdate}
//                             disabled={updating}
//                             className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
//                           >
//                             <Save className="w-4 h-4" />
//                             <span>{updating ? 'Saving...' : 'Save'}</span>
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
//                           onClick={() => handleEdit(item)}
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
//             <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update milling percentages.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MillingPercentages;







import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit2, Save, X, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

const MillingPercentages = ({ onBack }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [updating, setUpdating] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Get user role from sessionStorage - FIXED
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
      const response = await fetch('http://localhost:5678/milling-percentages/');
      if (!response.ok) throw new Error('Failed to fetch milling percentages');
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditedData({
      id: item.id,
      roughing_percentage: item.roughing_percentage,
      finishing_percentage: item.finishing_percentage
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedData({});
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: Number(value)
    }));
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const response = await fetch('http://localhost:5678/milling-percentages/update/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(editedData)
      });

      if (!response.ok) throw new Error('Failed to update milling percentages');

      const result = await response.json();

      setData(prev => prev.map(item =>
        item.id === result.id
          ? {
            id: result.id,
            roughing_percentage: result.roughing_percentage,
            finishing_percentage: result.finishing_percentage
          }
          : item
      ));

      setEditingId(null);
      setEditedData({});
      alert('Milling percentages updated successfully!');
    } catch (err) {
      alert('Error updating milling percentages: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleExportToExcel = () => {
    try {
      const excelData = data.map(item => ({
        'Roughing Percentage (%)': item.roughing_percentage,
        'Finishing Percentage (%)': item.finishing_percentage
      }));

      const ws = XLSX.utils.json_to_sheet(excelData);
      ws['!cols'] = [{ wch: 25 }, { wch: 25 }];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Milling Percentages');

      const date = new Date().toISOString().split('T')[0];
      const filename = `Milling_Percentages_${date}.xlsx`;

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
        <div className="text-gray-600">Loading milling percentages...</div>
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
        <h2 className="text-2xl font-bold text-gray-800">Milling Roughing Percentages</h2>
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
                <th className="px-6 py-3 text-left text-sm font-semibold">Roughing Percentage (%)</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Percentage (%)</th>
                {isAdmin && (
                  <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">
                    {isAdmin && editingId === item.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editedData.roughing_percentage}
                          onChange={(e) => handleInputChange('roughing_percentage', e.target.value)}
                          className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                        />
                        <span className="text-gray-500">%</span>
                      </div>
                    ) : (
                      <span className="text-gray-700 font-medium">{item.roughing_percentage}%</span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {isAdmin && editingId === item.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editedData.finishing_percentage}
                          onChange={(e) => handleInputChange('finishing_percentage', e.target.value)}
                          className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                        />
                        <span className="text-gray-500">%</span>
                      </div>
                    ) : (
                      <span className="text-gray-700 font-medium">{item.finishing_percentage}%</span>
                    )}
                  </td>

                  {isAdmin && (
                    <td className="px-6 py-4 text-sm">
                      {editingId === item.id ? (
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
                          onClick={() => handleEdit(item)}
                          className="flex items-center space-x-1 px-3 py-1 bg-[#246679] text-white rounded hover:bg-[#1f5766] transition-colors duration-200"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>Update</span>
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!isAdmin && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update milling percentages.
          </p>
        </div>
      )}
    </div>
  );
};

export default MillingPercentages;