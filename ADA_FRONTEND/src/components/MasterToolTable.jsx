// import React, { useState, useEffect, useRef } from 'react';
// import { ArrowLeft, Edit2, Save, X, Download, Upload, Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
// import * as XLSX from 'xlsx';

// // Create Master Tool Modal Component
// const CreateMasterToolModal = ({ onClose, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     epoxy_block_material_cost: '',
//     epoxy_block_density: '',
//     epoxy_block_bonding_cost: '',
//     design_cost_per_hr: '',
//     machining_cost_per_hr: '',
//     assembly_cost_per_hr: '',
//     finishing_cost_per_hr: '',
//     inspection_cost_per_hr: '',
//     frame_fabrication_cost: ''
//   });
//   const [submitting, setSubmitting] = useState(false);

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setSubmitting(true);
      
//       const payload = {
//         epoxy_block_material_cost: parseFloat(formData.epoxy_block_material_cost) || 0,
//         epoxy_block_density: parseFloat(formData.epoxy_block_density) || 0,
//         epoxy_block_bonding_cost: parseFloat(formData.epoxy_block_bonding_cost) || 0,
//         design_cost_per_hr: parseFloat(formData.design_cost_per_hr) || 0,
//         machining_cost_per_hr: parseFloat(formData.machining_cost_per_hr) || 0,
//         assembly_cost_per_hr: parseFloat(formData.assembly_cost_per_hr) || 0,
//         finishing_cost_per_hr: parseFloat(formData.finishing_cost_per_hr) || 0,
//         inspection_cost_per_hr: parseFloat(formData.inspection_cost_per_hr) || 0,
//         frame_fabrication_cost: parseFloat(formData.frame_fabrication_cost) || 0
//       };

//       const response = await fetch('http://172.18.100.156:8004/composites/master-tool-cost/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'accept': 'application/json'
//         },
//         body: JSON.stringify(payload)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || 'Failed to create master tool');
//       }

//       alert('Master Tool created successfully!');
//       onSuccess();
//       onClose();
//     } catch (err) {
//       alert('Error creating master tool: ' + err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//         <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
//           <h2 className="text-2xl font-bold text-gray-800">Create Master Tool</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           <div className="bg-blue-50 rounded-lg p-4">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Epoxy Block Information</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Material Cost (₹)
//                 </label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-2 text-gray-500">₹</span>
//                   <input
//                     type="number"
//                     step="0.01"
//                     placeholder="0.00"
//                     value={formData.epoxy_block_material_cost}
//                     onChange={(e) => handleInputChange('epoxy_block_material_cost', e.target.value)}
//                     className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Density
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   placeholder="0"
//                   value={formData.epoxy_block_density}
//                   onChange={(e) => handleInputChange('epoxy_block_density', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Bonding Cost (₹)
//                 </label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-2 text-gray-500">₹</span>
//                   <input
//                     type="number"
//                     step="0.01"
//                     placeholder="0.00"
//                     value={formData.epoxy_block_bonding_cost}
//                     onChange={(e) => handleInputChange('epoxy_block_bonding_cost', e.target.value)}
//                     className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-green-50 rounded-lg p-4">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Hourly Costs</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Design Cost per Hour (₹/hr)
//                 </label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-2 text-gray-500">₹</span>
//                   <input
//                     type="number"
//                     step="0.01"
//                     placeholder="0.00"
//                     value={formData.design_cost_per_hr}
//                     onChange={(e) => handleInputChange('design_cost_per_hr', e.target.value)}
//                     className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Machining Cost per Hour (₹/hr)
//                 </label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-2 text-gray-500">₹</span>
//                   <input
//                     type="number"
//                     step="0.01"
//                     placeholder="0.00"
//                     value={formData.machining_cost_per_hr}
//                     onChange={(e) => handleInputChange('machining_cost_per_hr', e.target.value)}
//                     className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Assembly Cost per Hour (₹/hr)
//                 </label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-2 text-gray-500">₹</span>
//                   <input
//                     type="number"
//                     step="0.01"
//                     placeholder="0.00"
//                     value={formData.assembly_cost_per_hr}
//                     onChange={(e) => handleInputChange('assembly_cost_per_hr', e.target.value)}
//                     className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Finishing Cost per Hour (₹/hr)
//                 </label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-2 text-gray-500">₹</span>
//                   <input
//                     type="number"
//                     step="0.01"
//                     placeholder="0.00"
//                     value={formData.finishing_cost_per_hr}
//                     onChange={(e) => handleInputChange('finishing_cost_per_hr', e.target.value)}
//                     className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Inspection Cost per Hour (₹/hr)
//                 </label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-2 text-gray-500">₹</span>
//                   <input
//                     type="number"
//                     step="0.01"
//                     placeholder="0.00"
//                     value={formData.inspection_cost_per_hr}
//                     onChange={(e) => handleInputChange('inspection_cost_per_hr', e.target.value)}
//                     className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-yellow-50 rounded-lg p-4">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Frame Fabrication</h3>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Frame Fabrication Cost (₹)
//               </label>
//               <div className="relative">
//                 <span className="absolute left-3 top-2 text-gray-500">₹</span>
//                 <input
//                   type="number"
//                   step="0.01"
//                   placeholder="0.00"
//                   value={formData.frame_fabrication_cost}
//                   onChange={(e) => handleInputChange('frame_fabrication_cost', e.target.value)}
//                   className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={submitting}
//               className="px-6 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200 disabled:opacity-50"
//             >
//               {submitting ? 'Creating...' : 'Create Master Tool'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // Main Master Tool Table Component
// const MasterToolTable = ({ onBack }) => {
//   const [tools, setTools] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [updating, setUpdating] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [userRole, setUserRole] = useState('');
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
//     setUserRole(userData.role || '');
//     fetchTools();
//   }, []);

//   const fetchTools = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://172.18.100.156:8004/composites/master-tool-cost/');
//       if (!response.ok) throw new Error('Failed to fetch master tool data');
//       const result = await response.json();
//       const data = result.data || [];
//       setTools(data);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (tool) => {
//     setEditingId(tool.id);
//     setEditedData({
//       epoxy_block_material_cost: tool.epoxy_block_material_cost,
//       epoxy_block_density: tool.epoxy_block_density,
//       epoxy_block_bonding_cost: tool.epoxy_block_bonding_cost,
//       design_cost_per_hr: tool.design_cost_per_hr,
//       machining_cost_per_hr: tool.machining_cost_per_hr,
//       assembly_cost_per_hr: tool.assembly_cost_per_hr,
//       finishing_cost_per_hr: tool.finishing_cost_per_hr,
//       inspection_cost_per_hr: tool.inspection_cost_per_hr,
//       frame_fabrication_cost: tool.frame_fabrication_cost
//     });
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedData({});
//   };

//   const handleInputChange = (field, value) => {
//     setEditedData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleUpdate = async () => {
//     try {
//       setUpdating(true);
      
//       const payload = {
//         epoxy_block_material_cost: parseFloat(editedData.epoxy_block_material_cost) || 0,
//         epoxy_block_density: parseFloat(editedData.epoxy_block_density) || 0,
//         epoxy_block_bonding_cost: parseFloat(editedData.epoxy_block_bonding_cost) || 0,
//         design_cost_per_hr: parseFloat(editedData.design_cost_per_hr) || 0,
//         machining_cost_per_hr: parseFloat(editedData.machining_cost_per_hr) || 0,
//         assembly_cost_per_hr: parseFloat(editedData.assembly_cost_per_hr) || 0,
//         finishing_cost_per_hr: parseFloat(editedData.finishing_cost_per_hr) || 0,
//         inspection_cost_per_hr: parseFloat(editedData.inspection_cost_per_hr) || 0,
//         frame_fabrication_cost: parseFloat(editedData.frame_fabrication_cost) || 0
//       };

//       const response = await fetch('http://172.18.100.156:8004/composites/master-tool-cost/', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'accept': 'application/json'
//         },
//         body: JSON.stringify(payload)
//       });

//       if (!response.ok) throw new Error('Failed to update master tool');
      
//       setTools(prev => {
//         const index = prev.findIndex(t => t.id === editingId);
//         if (index !== -1) {
//           const updated = [...prev];
//           updated[index] = { 
//             ...prev[index], 
//             ...payload
//           };
//           return updated;
//         }
//         return prev;
//       });
      
//       setEditingId(null);
//       setEditedData({});
//       alert('Master Tool updated successfully!');
//     } catch (err) {
//       alert('Error updating master tool: ' + err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleExportToExcel = () => {
//     const exportData = tools.map(tool => ({
//       'ID': tool.id,
//       'Epoxy Block Material Cost': tool.epoxy_block_material_cost,
//       'Epoxy Block Density': tool.epoxy_block_density,
//       'Epoxy Block Bonding Cost': tool.epoxy_block_bonding_cost,
//       'Design Cost per Hour': tool.design_cost_per_hr,
//       'Machining Cost per Hour': tool.machining_cost_per_hr,
//       'Assembly Cost per Hour': tool.assembly_cost_per_hr,
//       'Finishing Cost per Hour': tool.finishing_cost_per_hr,
//       'Inspection Cost per Hour': tool.inspection_cost_per_hr,
//       'Frame Fabrication Cost': tool.frame_fabrication_cost
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(exportData);
    
//     const columnWidths = [
//       { wch: 10 },
//       { wch: 25 },
//       { wch: 22 },
//       { wch: 25 },
//       { wch: 22 },
//       { wch: 25 },
//       { wch: 23 },
//       { wch: 24 },
//       { wch: 26 },
//       { wch: 25 }
//     ];
//     worksheet['!cols'] = columnWidths;

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Master Tool Cost');

//     const timestamp = new Date().toISOString().split('T')[0];
//     const filename = `Master_Tool_Cost_${timestamp}.xlsx`;

//     XLSX.writeFile(workbook, filename);
//   };

//   const handleImportExcel = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = async (e) => {
//       try {
//         setUploading(true);
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: 'array' });
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         const jsonData = XLSX.utils.sheet_to_json(worksheet);

//         for (const row of jsonData) {
//           const payload = {
//             epoxy_block_material_cost: Number(row['Epoxy Block Material Cost']) || 0,
//             epoxy_block_density: Number(row['Epoxy Block Density']) || 0,
//             epoxy_block_bonding_cost: Number(row['Epoxy Block Bonding Cost']) || 0,
//             design_cost_per_hr: Number(row['Design Cost per Hour']) || 0,
//             machining_cost_per_hr: Number(row['Machining Cost per Hour']) || 0,
//             assembly_cost_per_hr: Number(row['Assembly Cost per Hour']) || 0,
//             finishing_cost_per_hr: Number(row['Finishing Cost per Hour']) || 0,
//             inspection_cost_per_hr: Number(row['Inspection Cost per Hour']) || 0,
//             frame_fabrication_cost: Number(row['Frame Fabrication Cost']) || 0
//           };

//           await fetch('http://172.18.100.156:8004/composites/master-tool-cost/', {
//             method: 'PUT',
//             headers: {
//               'Content-Type': 'application/json',
//               'accept': 'application/json'
//             },
//             body: JSON.stringify(payload)
//           });
//         }

//         alert('Master Tool data imported successfully!');
//         fetchTools();
//       } catch (err) {
//         alert('Error importing file: ' + err.message);
//       } finally {
//         setUploading(false);
//         if (fileInputRef.current) {
//           fileInputRef.current.value = '';
//         }
//       }
//     };

//     reader.readAsArrayBuffer(file);
//   };

//   const triggerFileInput = () => {
//     fileInputRef.current?.click();
//   };

//   const isAdmin = userRole.toLowerCase() === 'admin';

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-gray-600">Loading master tool data...</div>
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
//         <h2 className="text-2xl font-bold text-gray-800">Master Tool Cost</h2>
//         <div className="flex items-center space-x-3">
//           {isAdmin && (
//             <>
//               <button
//                 onClick={() => setShowCreateModal(true)}
//                 className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
//               >
//                 <Plus className="w-4 h-4" />
//                 <span>Create Master Tool</span>
//               </button>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleImportExcel}
//                 accept=".xlsx, .xls"
//                 className="hidden"
//               />
//               <button
//                 onClick={triggerFileInput}
//                 disabled={uploading}
//                 className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
//               >
//                 <Upload className="w-4 h-4" />
//                 <span>{uploading ? 'Uploading...' : 'Import Excel'}</span>
//               </button>
//             </>
//           )}
//           <button
//             onClick={handleExportToExcel}
//             className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
//           >
//             <Download className="w-4 h-4" />
//             <span>Export to Excel</span>
//           </button>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-[#246679] text-white">
//               <tr>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Epoxy Block Material Cost</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Epoxy Block Density</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Epoxy Block Bonding Cost</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Design Cost/hr</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Machining Cost/hr</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Assembly Cost/hr</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Cost/hr</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Inspection Cost/hr</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Frame Fabrication Cost</th>
//                 {isAdmin && (
//                   <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {tools.length > 0 ? (
//                 tools.map((tool) => (
//                   <tr key={tool.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 text-sm">
//                       {isAdmin && editingId === tool.id ? (
//                         <div className="relative">
//                           <span className="absolute left-2 top-1 text-gray-500">₹</span>
//                           <input
//                             type="number"
//                             step="0.01"
//                             value={editedData.epoxy_block_material_cost}
//                             onChange={(e) => handleInputChange('epoxy_block_material_cost', e.target.value)}
//                             className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                           />
//                         </div>
//                       ) : (
//                         <span className="text-gray-700">₹{tool.epoxy_block_material_cost}</span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 text-sm">
//                       {isAdmin && editingId === tool.id ? (
//                         <input
//                           type="number"
//                           step="0.01"
//                           value={editedData.epoxy_block_density}
//                           onChange={(e) => handleInputChange('epoxy_block_density', e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                         />
//                       ) : (
//                         <span className="text-gray-700">{tool.epoxy_block_density}</span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 text-sm">
//                       {isAdmin && editingId === tool.id ? (
//                         <div className="relative">
//                           <span className="absolute left-2 top-1 text-gray-500">₹</span>
//                           <input
//                             type="number"
//                             step="0.01"
//                             value={editedData.epoxy_block_bonding_cost}
//                             onChange={(e) => handleInputChange('epoxy_block_bonding_cost', e.target.value)}
//                             className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                           />
//                         </div>
//                       ) : (
//                         <span className="text-gray-700">₹{tool.epoxy_block_bonding_cost}</span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 text-sm">
//                       {isAdmin && editingId === tool.id ? (
//                         <div className="relative">
//                           <span className="absolute left-2 top-1 text-gray-500">₹</span>
//                           <input
//                             type="number"
//                             step="0.01"
//                             value={editedData.design_cost_per_hr}
//                             onChange={(e) => handleInputChange('design_cost_per_hr', e.target.value)}
//                             className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                           />
//                         </div>
//                       ) : (
//                         <span className="text-gray-700">₹{tool.design_cost_per_hr}</span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 text-sm">
//                       {isAdmin && editingId === tool.id ? (
//                         <div className="relative">
//                           <span className="absolute left-2 top-1 text-gray-500">₹</span>
//                           <input
//                             type="number"
//                             step="0.01"
//                             value={editedData.machining_cost_per_hr}
//                             onChange={(e) => handleInputChange('machining_cost_per_hr', e.target.value)}
//                             className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                           />
//                         </div>
//                       ) : (
//                         <span className="text-gray-700">₹{tool.machining_cost_per_hr}</span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 text-sm">
//                       {isAdmin && editingId === tool.id ? (
//                         <div className="relative">
//                           <span className="absolute left-2 top-1 text-gray-500">₹</span>
//                           <input
//                             type="number"
//                             step="0.01"
//                             value={editedData.assembly_cost_per_hr}
//                             onChange={(e) => handleInputChange('assembly_cost_per_hr', e.target.value)}
//                             className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                           />
//                         </div>
//                       ) : (
//                         <span className="text-gray-700">₹{tool.assembly_cost_per_hr}</span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 text-sm">
//                       {isAdmin && editingId === tool.id ? (
//                         <div className="relative">
//                           <span className="absolute left-2 top-1 text-gray-500">₹</span>
//                           <input
//                             type="number"
//                             step="0.01"
//                             value={editedData.finishing_cost_per_hr}
//                             onChange={(e) => handleInputChange('finishing_cost_per_hr', e.target.value)}
//                             className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                           />
//                         </div>
//                       ) : (
//                         <span className="text-gray-700">₹{tool.finishing_cost_per_hr}</span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 text-sm">
//                       {isAdmin && editingId === tool.id ? (
//                         <div className="relative">
//                           <span className="absolute left-2 top-1 text-gray-500">₹</span>
//                           <input
//                             type="number"
//                             step="0.01"
//                             value={editedData.inspection_cost_per_hr}
//                             onChange={(e) => handleInputChange('inspection_cost_per_hr', e.target.value)}
//                             className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                           />
//                         </div>
//                       ) : (
//                         <span className="text-gray-700">₹{tool.inspection_cost_per_hr}</span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 text-sm">
//                       {isAdmin && editingId === tool.id ? (
//                         <div className="relative">
//                           <span className="absolute left-2 top-1 text-gray-500">₹</span>
//                           <input
//                             type="number"
//                             step="0.01"
//                             value={editedData.frame_fabrication_cost}
//                             onChange={(e) => handleInputChange('frame_fabrication_cost', e.target.value)}
//                             className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                           />
//                         </div>
//                       ) : (
//                         <span className="text-gray-700">₹{tool.frame_fabrication_cost}</span>
//                       )}
//                     </td>
//                     {isAdmin && (
//                       <td className="px-6 py-4 text-sm">
//                         {editingId === tool.id ? (
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={handleUpdate}
//                               disabled={updating}
//                               className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
//                             >
//                               <Save className="w-4 h-4" />
//                               <span>{updating ? 'Saving...' : 'Save'}</span>
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
//                             onClick={() => handleEdit(tool)}
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
//                   <td colSpan={isAdmin ? 10 : 9} className="px-6 py-8 text-center text-gray-500">
//                     No master tool data found
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
//             <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update master tool cost.
//           </p>
//         </div>
//       )}

//       {/* Create Master Tool Modal */}
//       {showCreateModal && (
//         <CreateMasterToolModal
//           onClose={() => setShowCreateModal(false)}
//           onSuccess={fetchTools}
//         />
//       )}
//     </div>
//   );
// };

// export default MasterToolTable;



import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Edit2, Save, X, Download, Upload, Search, Plus, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import CompositesMasterToolHoursTable from './CompositesMasterToolHoursTable';

// Create Master Tool Modal Component
const CreateMasterToolModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    epoxy_block_material_cost: '',
    epoxy_block_density: '',
    epoxy_block_bonding_cost: '',
    design_cost_per_hr: '',
    machining_cost_per_hr: '',
    assembly_cost_per_hr: '',
    finishing_cost_per_hr: '',
    inspection_cost_per_hr: '',
    frame_fabrication_cost: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      
      const payload = {
        epoxy_block_material_cost: parseFloat(formData.epoxy_block_material_cost) || 0,
        epoxy_block_density: parseFloat(formData.epoxy_block_density) || 0,
        epoxy_block_bonding_cost: parseFloat(formData.epoxy_block_bonding_cost) || 0,
        design_cost_per_hr: parseFloat(formData.design_cost_per_hr) || 0,
        machining_cost_per_hr: parseFloat(formData.machining_cost_per_hr) || 0,
        assembly_cost_per_hr: parseFloat(formData.assembly_cost_per_hr) || 0,
        finishing_cost_per_hr: parseFloat(formData.finishing_cost_per_hr) || 0,
        inspection_cost_per_hr: parseFloat(formData.inspection_cost_per_hr) || 0,
        frame_fabrication_cost: parseFloat(formData.frame_fabrication_cost) || 0
      };

      const response = await fetch('http://172.18.100.156:8004/composites/master-tool-cost/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create master tool');
      }

      alert('Master Tool created successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      alert('Error creating master tool: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Create Master Tool</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Epoxy Block Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Material Cost (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.epoxy_block_material_cost}
                    onChange={(e) => handleInputChange('epoxy_block_material_cost', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Density
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0"
                  value={formData.epoxy_block_density}
                  onChange={(e) => handleInputChange('epoxy_block_density', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bonding Cost (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.epoxy_block_bonding_cost}
                    onChange={(e) => handleInputChange('epoxy_block_bonding_cost', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Hourly Costs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Design Cost per Hour (₹/hr)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.design_cost_per_hr}
                    onChange={(e) => handleInputChange('design_cost_per_hr', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Machining Cost per Hour (₹/hr)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.machining_cost_per_hr}
                    onChange={(e) => handleInputChange('machining_cost_per_hr', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assembly Cost per Hour (₹/hr)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.assembly_cost_per_hr}
                    onChange={(e) => handleInputChange('assembly_cost_per_hr', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Finishing Cost per Hour (₹/hr)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.finishing_cost_per_hr}
                    onChange={(e) => handleInputChange('finishing_cost_per_hr', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inspection Cost per Hour (₹/hr)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.inspection_cost_per_hr}
                    onChange={(e) => handleInputChange('inspection_cost_per_hr', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Frame Fabrication</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frame Fabrication Cost (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">₹</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.frame_fabrication_cost}
                  onChange={(e) => handleInputChange('frame_fabrication_cost', e.target.value)}
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246679]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200 disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Master Tool'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Master Tool Table Component
const MasterToolTable = ({ onBack }) => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [updating, setUpdating] = useState(false);
  const [correctionFactors, setCorrectionFactors] = useState([]);
  const [editingCorrectionId, setEditingCorrectionId] = useState(null);
  const [editedCorrection, setEditedCorrection] = useState('');
  const [updatingCorrection, setUpdatingCorrection] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    setUserRole(userData.role || '');
    fetchTools();
    fetchCorrectionFactors();
  }, []);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://172.18.100.156:8004/composites/master-tool-cost/');
      if (!response.ok) throw new Error('Failed to fetch master tool data');
      const result = await response.json();
      const data = result.data || [];
      setTools(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCorrectionFactors = async () => {
    try {
      const response = await fetch('http://172.18.100.156:8004/composites/master-tool-correction-factor/');
      if (!response.ok) throw new Error('Failed to fetch correction factors');
      const data = await response.json();
      setCorrectionFactors(Array.isArray(data) ? data : []);
    } catch (err) {
      setCorrectionFactors([]);
    }
  };

  const handleEditCorrection = (row) => {
    setEditingCorrectionId(row.id);
    setEditedCorrection(row.correction);
  };

  const handleCancelCorrection = () => {
    setEditingCorrectionId(null);
    setEditedCorrection('');
  };

  const handleUpdateCorrection = async () => {
    try {
      setUpdatingCorrection(true);

      const formData = new FormData();
      formData.append('correction', editedCorrection);

      const response = await fetch('http://172.18.100.156:8004/composites/master-tool-correction-factor/update/', {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to update correction factor');
      }

      alert('Correction factor updated successfully!');
      handleCancelCorrection();
      fetchCorrectionFactors();
    } catch (err) {
      alert('Error updating correction factor: ' + err.message);
    } finally {
      setUpdatingCorrection(false);
    }
  };

  const handleEdit = (tool) => {
    setEditingId(tool.id);
    setEditedData({
      epoxy_block_material_cost: tool.epoxy_block_material_cost,
      epoxy_block_density: tool.epoxy_block_density,
      epoxy_block_bonding_cost: tool.epoxy_block_bonding_cost,
      design_cost_per_hr: tool.design_cost_per_hr,
      machining_cost_per_hr: tool.machining_cost_per_hr,
      assembly_cost_per_hr: tool.assembly_cost_per_hr,
      finishing_cost_per_hr: tool.finishing_cost_per_hr,
      inspection_cost_per_hr: tool.inspection_cost_per_hr,
      frame_fabrication_cost: tool.frame_fabrication_cost
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedData({});
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);

      const payload = {
        epoxy_block_material_cost: parseFloat(editedData.epoxy_block_material_cost) || 0,
        epoxy_block_density: parseFloat(editedData.epoxy_block_density) || 0,
        epoxy_block_bonding_cost: parseFloat(editedData.epoxy_block_bonding_cost) || 0,
        design_cost_per_hr: parseFloat(editedData.design_cost_per_hr) || 0,
        machining_cost_per_hr: parseFloat(editedData.machining_cost_per_hr) || 0,
        assembly_cost_per_hr: parseFloat(editedData.assembly_cost_per_hr) || 0,
        finishing_cost_per_hr: parseFloat(editedData.finishing_cost_per_hr) || 0,
        inspection_cost_per_hr: parseFloat(editedData.inspection_cost_per_hr) || 0,
        frame_fabrication_cost: parseFloat(editedData.frame_fabrication_cost) || 0
      };

      const response = await fetch('http://172.18.100.156:8004/composites/master-tool-cost/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to update master tool');
      
      setTools(prev => {
        const index = prev.findIndex(t => t.id === editingId);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = { 
            ...prev[index], 
            ...payload
          };
          return updated;
        }
        return prev;
      });
      
      setEditingId(null);
      setEditedData({});
      alert('Master Tool updated successfully!');
    } catch (err) {
      alert('Error updating master tool: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleExportToExcel = () => {
    const exportData = tools.map(tool => ({
      'ID': tool.id,
      'Epoxy Block Material Cost': tool.epoxy_block_material_cost,
      'Epoxy Block Density': tool.epoxy_block_density,
      'Epoxy Block Bonding Cost': tool.epoxy_block_bonding_cost,
      'Design Cost per Hour': tool.design_cost_per_hr,
      'Machining Cost per Hour': tool.machining_cost_per_hr,
      'Assembly Cost per Hour': tool.assembly_cost_per_hr,
      'Finishing Cost per Hour': tool.finishing_cost_per_hr,
      'Inspection Cost per Hour': tool.inspection_cost_per_hr,
      'Frame Fabrication Cost': tool.frame_fabrication_cost
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    const columnWidths = [
      { wch: 10 },
      { wch: 25 },
      { wch: 22 },
      { wch: 25 },
      { wch: 22 },
      { wch: 25 },
      { wch: 23 },
      { wch: 24 },
      { wch: 26 },
      { wch: 25 }
    ];
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Master Tool Cost');

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `Master_Tool_Cost_${timestamp}.xlsx`;

    XLSX.writeFile(workbook, filename);
  };

  const handleImportExcel = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        setUploading(true);
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        for (const row of jsonData) {
          const payload = {
            epoxy_block_material_cost: Number(row['Epoxy Block Material Cost']) || 0,
            epoxy_block_density: Number(row['Epoxy Block Density']) || 0,
            epoxy_block_bonding_cost: Number(row['Epoxy Block Bonding Cost']) || 0,
            design_cost_per_hr: Number(row['Design Cost per Hour']) || 0,
            machining_cost_per_hr: Number(row['Machining Cost per Hour']) || 0,
            assembly_cost_per_hr: Number(row['Assembly Cost per Hour']) || 0,
            finishing_cost_per_hr: Number(row['Finishing Cost per Hour']) || 0,
            inspection_cost_per_hr: Number(row['Inspection Cost per Hour']) || 0,
            frame_fabrication_cost: Number(row['Frame Fabrication Cost']) || 0
          };

          await fetch('http://172.18.100.156:8004/composites/master-tool-cost/', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'accept': 'application/json'
            },
            body: JSON.stringify(payload)
          });
        }

        alert('Master Tool data imported successfully!');
        fetchTools();
      } catch (err) {
        alert('Error importing file: ' + err.message);
      } finally {
        setUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const isAdmin = userRole.toLowerCase() === 'admin';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading master tool data...</div>
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
        <h2 className="text-2xl font-bold text-gray-800">Master Tool Cost</h2>
        <div className="flex items-center space-x-3">
          {isAdmin && (
            <>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Create Master Tool</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportExcel}
                accept=".xlsx, .xls"
                className="hidden"
              />
              {/* <button
                onClick={triggerFileInput}
                disabled={uploading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>{uploading ? 'Uploading...' : 'Import Excel'}</span>
              </button> */}
            </>
          )}
          <button
            onClick={handleExportToExcel}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Export to Excel</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#246679] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Epoxy Block Material Cost</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Epoxy Block Density</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Epoxy Block Bonding Cost</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Design Cost/hr</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Machining Cost/hr</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Assembly Cost/hr</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Finishing Cost/hr</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Inspection Cost/hr</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Frame Fabrication Cost</th>
                {isAdmin && (
                  <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tools.length > 0 ? (
                tools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">
                      {isAdmin && editingId === tool.id ? (
                        <div className="relative">
                          <span className="absolute left-2 top-1 text-gray-500">₹</span>
                          <input
                            type="number"
                            step="0.01"
                            value={editedData.epoxy_block_material_cost}
                            onChange={(e) => handleInputChange('epoxy_block_material_cost', e.target.value)}
                            className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-700">₹{tool.epoxy_block_material_cost}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {isAdmin && editingId === tool.id ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editedData.epoxy_block_density}
                          onChange={(e) => handleInputChange('epoxy_block_density', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                        />
                      ) : (
                        <span className="text-gray-700">{tool.epoxy_block_density}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {isAdmin && editingId === tool.id ? (
                        <div className="relative">
                          <span className="absolute left-2 top-1 text-gray-500">₹</span>
                          <input
                            type="number"
                            step="0.01"
                            value={editedData.epoxy_block_bonding_cost}
                            onChange={(e) => handleInputChange('epoxy_block_bonding_cost', e.target.value)}
                            className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-700">₹{tool.epoxy_block_bonding_cost}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {isAdmin && editingId === tool.id ? (
                        <div className="relative">
                          <span className="absolute left-2 top-1 text-gray-500">₹</span>
                          <input
                            type="number"
                            step="0.01"
                            value={editedData.design_cost_per_hr}
                            onChange={(e) => handleInputChange('design_cost_per_hr', e.target.value)}
                            className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-700">₹{tool.design_cost_per_hr}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {isAdmin && editingId === tool.id ? (
                        <div className="relative">
                          <span className="absolute left-2 top-1 text-gray-500">₹</span>
                          <input
                            type="number"
                            step="0.01"
                            value={editedData.machining_cost_per_hr}
                            onChange={(e) => handleInputChange('machining_cost_per_hr', e.target.value)}
                            className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-700">₹{tool.machining_cost_per_hr}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {isAdmin && editingId === tool.id ? (
                        <div className="relative">
                          <span className="absolute left-2 top-1 text-gray-500">₹</span>
                          <input
                            type="number"
                            step="0.01"
                            value={editedData.assembly_cost_per_hr}
                            onChange={(e) => handleInputChange('assembly_cost_per_hr', e.target.value)}
                            className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-700">₹{tool.assembly_cost_per_hr}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {isAdmin && editingId === tool.id ? (
                        <div className="relative">
                          <span className="absolute left-2 top-1 text-gray-500">₹</span>
                          <input
                            type="number"
                            step="0.01"
                            value={editedData.finishing_cost_per_hr}
                            onChange={(e) => handleInputChange('finishing_cost_per_hr', e.target.value)}
                            className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-700">₹{tool.finishing_cost_per_hr}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {isAdmin && editingId === tool.id ? (
                        <div className="relative">
                          <span className="absolute left-2 top-1 text-gray-500">₹</span>
                          <input
                            type="number"
                            step="0.01"
                            value={editedData.inspection_cost_per_hr}
                            onChange={(e) => handleInputChange('inspection_cost_per_hr', e.target.value)}
                            className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-700">₹{tool.inspection_cost_per_hr}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {isAdmin && editingId === tool.id ? (
                        <div className="relative">
                          <span className="absolute left-2 top-1 text-gray-500">₹</span>
                          <input
                            type="number"
                            step="0.01"
                            value={editedData.frame_fabrication_cost}
                            onChange={(e) => handleInputChange('frame_fabrication_cost', e.target.value)}
                            className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-700">₹{tool.frame_fabrication_cost}</span>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-sm">
                        {editingId === tool.id ? (
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
                            onClick={() => handleEdit(tool)}
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
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 10 : 9} className="px-6 py-8 text-center text-gray-500">
                    No master tool data found
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
            <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update master tool cost.
          </p>
        </div>
      )}

      {/* Master Tool Hours Table in RED section */}
      <div className="mt-8   pt-8">
        <CompositesMasterToolHoursTable onBack={onBack} />
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Correction Factor</h3>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#246679] text-white">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Correction</th>
                  {isAdmin && <th className="px-6 py-3 text-left font-semibold">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {correctionFactors.length > 0 ? (
                  correctionFactors.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-700">
                        {isAdmin && editingCorrectionId === row.id ? (
                          <input
                            type="number"
                            step="0.0001"
                            value={editedCorrection}
                            onChange={(e) => setEditedCorrection(e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#246679]"
                          />
                        ) : (
                          <span>{row.correction}</span>
                        )}
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 text-sm">
                          {editingCorrectionId === row.id ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={handleUpdateCorrection}
                                disabled={updatingCorrection}
                                className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                              >
                                <Save className="w-4 h-4" />
                                <span>{updatingCorrection ? 'Saving...' : 'Save'}</span>
                              </button>
                              <button
                                onClick={handleCancelCorrection}
                                disabled={updatingCorrection}
                                className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
                              >
                                <X className="w-4 h-4" />
                                <span>Cancel</span>
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditCorrection(row)}
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
                ) : (
                  <tr>
                    <td colSpan={isAdmin ? 2 : 1} className="px-6 py-8 text-center text-gray-500">
                      No correction factors found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Master Tool Modal */}
      {showCreateModal && (
        <CreateMasterToolModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchTools}
        />
      )}
    </div>
  );
};

export default MasterToolTable;