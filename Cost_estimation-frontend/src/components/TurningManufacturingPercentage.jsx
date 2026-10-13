// import React, { useState, useEffect } from "react";
// import { ArrowLeft, Save, X, Edit2, Loader } from "lucide-react";

// const TurningManufacturingPercentage = ({ onBack }) => {
//   const [percentage, setPercentage] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editing, setEditing] = useState(false);
//   const [editedValue, setEditedValue] = useState("");
//   const [updating, setUpdating] = useState(false);

//   // Fetch current percentage
//   useEffect(() => {
//     const fetchPercentage = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch("http://localhost:5678/turning-manufacturing-percentage/");
//         if (!response.ok) throw new Error("Failed to fetch manufacturing percentage");
//         const data = await response.json();
//         if (data.data && data.data.length > 0) {
//           setPercentage(data.data[0]);
//           setEditedValue(data.data[0].percentage_of_manufacturing_time);
//         } else {
//           throw new Error("No manufacturing percentage data found");
//         }
//         setError(null);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPercentage();
//   }, []);

//   const handleEdit = () => setEditing(true);
//   const handleCancel = () => {
//     setEditing(false);
//     setEditedValue(percentage.percentage_of_manufacturing_time);
//   };

//   const handleUpdate = async () => {
//     if (editedValue === "" || Number(editedValue) <= 0) {
//       alert("Please enter a valid percentage");
//       return;
//     }

//     try {
//       setUpdating(true);
//       const response = await fetch("http://localhost:5678/turning-manufacturing-percentage/", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", "accept": "application/json" },
//         body: JSON.stringify({ percentage_of_manufacturing_time: Number(editedValue) }),
//       });

//       if (!response.ok) throw new Error("Failed to update manufacturing percentage");
//       const result = await response.json();

//       setPercentage(result.data);
//       setEditing(false);
//       alert(result.message || "Manufacturing percentage updated successfully");
//     } catch (err) {
//       alert("Error updating manufacturing percentage: " + err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader className="w-8 h-8 text-[#246679] animate-spin" />
//         <span className="ml-3 text-gray-600">Loading manufacturing percentage...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//         <h3 className="text-red-800 font-semibold mb-2">Error Loading Data</h3>
//         <p className="text-red-600">{error}</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Turning Manufacturing %</h2>
//         <button
//           onClick={onBack}
//           className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           <span>Back to Overview</span>
//         </button>
//       </div>

//       {/* Percentage Card with Table Style */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         {/* Table Header */}
//         <div className="bg-[#1e5767] text-white px-6 py-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="font-semibold">Manufacturing Percentage</div>
//             <div className="font-semibold text-right">Action</div>
//           </div>
//         </div>

//         {/* Table Body */}
//         <div className="px-6 py-4">
//           <div className="grid grid-cols-2 gap-4 items-center">
//             <div>
//               {editing ? (
//                 <div className="flex items-center space-x-2">
//                   <input
//                     type="number"
//                     value={editedValue}
//                     onChange={(e) => setEditedValue(e.target.value)}
//                     className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                     disabled={updating}
//                     placeholder="%"
//                   />
//                   <span className="text-gray-600">%</span>
//                 </div>
//               ) : (
//                 <p className="text-base text-gray-900">
//                   {percentage.percentage_of_manufacturing_time}%
//                 </p>
//               )}
//             </div>

//             <div className="flex justify-end">
//               {editing ? (
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={handleUpdate}
//                     disabled={updating}
//                     className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
//                   >
//                     <Save className="w-4 h-4" />
//                     <span>{updating ? "Saving..." : "Save"}</span>
//                   </button>
//                   <button
//                     onClick={handleCancel}
//                     disabled={updating}
//                     className="flex items-center space-x-1 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
//                   >
//                     <X className="w-4 h-4" />
//                     <span>Cancel</span>
//                   </button>
//                 </div>
//               ) : (
//                 <button
//                   onClick={handleEdit}
//                   className="flex items-center space-x-1 px-4 py-2 bg-[#1e5767] text-white rounded hover:bg-[#246679] transition-colors"
//                 >
//                   <Edit2 className="w-4 h-4" />
//                   <span>Edit</span>
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Additional Info */}
//       <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
//         <p className="text-sm text-gray-700">
//           <span className="font-semibold">Note:</span> This percentage represents the proportion of time allocated to manufacturing operations in the turning process.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default TurningManufacturingPercentage;







//''updated new logic based on the admin role action column  is displayed
// import React, { useState, useEffect } from "react";
// import { ArrowLeft, Save, X, Edit2, Loader } from "lucide-react";

// const TurningManufacturingPercentage = ({ onBack }) => {
//   const [percentage, setPercentage] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editing, setEditing] = useState(false);
//   const [editedValue, setEditedValue] = useState("");
//   const [updating, setUpdating] = useState(false);
//   const [userRole, setUserRole] = useState('');

//   // Fetch current percentage
//   useEffect(() => {
//     // Get user role from sessionStorage
//     const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
//     setUserRole(userData.role || '');

//     const fetchPercentage = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch("http://localhost:5678/turning-manufacturing-percentage/");
//         if (!response.ok) throw new Error("Failed to fetch manufacturing percentage");
//         const data = await response.json();
//         if (data.data && data.data.length > 0) {
//           setPercentage(data.data[0]);
//           setEditedValue(data.data[0].percentage_of_manufacturing_time);
//         } else {
//           throw new Error("No manufacturing percentage data found");
//         }
//         setError(null);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPercentage();
//   }, []);

//   const handleEdit = () => setEditing(true);
//   const handleCancel = () => {
//     setEditing(false);
//     setEditedValue(percentage.percentage_of_manufacturing_time);
//   };

//   const handleUpdate = async () => {
//     if (editedValue === "" || Number(editedValue) <= 0) {
//       alert("Please enter a valid percentage");
//       return;
//     }

//     try {
//       setUpdating(true);
//       const response = await fetch("http://localhost:5678/turning-manufacturing-percentage/", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", "accept": "application/json" },
//         body: JSON.stringify({ percentage_of_manufacturing_time: Number(editedValue) }),
//       });

//       if (!response.ok) throw new Error("Failed to update manufacturing percentage");
//       const result = await response.json();

//       setPercentage(result.data);
//       setEditing(false);
//       alert(result.message || "Manufacturing percentage updated successfully");
//     } catch (err) {
//       alert("Error updating manufacturing percentage: " + err.message);
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
//         <span className="ml-3 text-gray-600">Loading manufacturing percentage...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//         <h3 className="text-red-800 font-semibold mb-2">Error Loading Data</h3>
//         <p className="text-red-600">{error}</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Turning Manufacturing %</h2>
//         <button
//           onClick={onBack}
//           className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           <span>Back to Overview</span>
//         </button>
//       </div>

//       {/* Percentage Card with Table Style */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         {/* Table Header */}
//         <div className="bg-[#1e5767] text-white px-6 py-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="font-semibold">Manufacturing Percentage</div>
//             {isAdmin && (
//               <div className="font-semibold text-right">Action</div>
//             )}
//           </div>
//         </div>

//         {/* Table Body */}
//         <div className="px-6 py-4">
//           <div className="grid grid-cols-2 gap-4 items-center">
//             <div>
//               {isAdmin && editing ? (
//                 <div className="flex items-center space-x-2">
//                   <input
//                     type="number"
//                     value={editedValue}
//                     onChange={(e) => setEditedValue(e.target.value)}
//                     className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                     disabled={updating}
//                     placeholder="%"
//                   />
//                   <span className="text-gray-600">%</span>
//                 </div>
//               ) : (
//                 <p className="text-base text-gray-900">
//                   {percentage.percentage_of_manufacturing_time}%
//                 </p>
//               )}
//             </div>

//             {isAdmin && (
//               <div className="flex justify-end">
//                 {editing ? (
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={handleUpdate}
//                       disabled={updating}
//                       className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
//                     >
//                       <Save className="w-4 h-4" />
//                       <span>{updating ? "Saving..." : "Save"}</span>
//                     </button>
//                     <button
//                       onClick={handleCancel}
//                       disabled={updating}
//                       className="flex items-center space-x-1 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
//                     >
//                       <X className="w-4 h-4" />
//                       <span>Cancel</span>
//                     </button>
//                   </div>
//                 ) : (
//                   <button
//                     onClick={handleEdit}
//                     className="flex items-center space-x-1 px-4 py-2 bg-[#1e5767] text-white rounded hover:bg-[#246679] transition-colors"
//                   >
//                     <Edit2 className="w-4 h-4" />
//                     <span>Update</span>
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
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

// export default TurningManufacturingPercentage;











//'''''this below code added the export to excel button to download the data into  excelformatt''''''// 
// import React, { useState, useEffect } from "react";
// import { ArrowLeft, Save, X, Edit2, Loader, Download } from "lucide-react";

// const TurningManufacturingPercentage = ({ onBack }) => {
//   const [percentage, setPercentage] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editing, setEditing] = useState(false);
//   const [editedValue, setEditedValue] = useState("");
//   const [updating, setUpdating] = useState(false);
//   const [userRole, setUserRole] = useState('');

//   // Fetch current percentage
//   useEffect(() => {
//     // Get user role from sessionStorage
//     const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
//     setUserRole(userData.role || '');

//     const fetchPercentage = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch("http://localhost:5678/turning-manufacturing-percentage/");
//         if (!response.ok) throw new Error("Failed to fetch manufacturing percentage");
//         const data = await response.json();
//         if (data.data && data.data.length > 0) {
//           setPercentage(data.data[0]);
//           setEditedValue(data.data[0].percentage_of_manufacturing_time);
//         } else {
//           throw new Error("No manufacturing percentage data found");
//         }
//         setError(null);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPercentage();
//   }, []);

//   const handleEdit = () => setEditing(true);
//   const handleCancel = () => {
//     setEditing(false);
//     setEditedValue(percentage.percentage_of_manufacturing_time);
//   };

//   const handleUpdate = async () => {
//     if (editedValue === "" || Number(editedValue) <= 0) {
//       alert("Please enter a valid percentage");
//       return;
//     }

//     try {
//       setUpdating(true);
//       const response = await fetch("http://localhost:5678/turning-manufacturing-percentage/", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", "accept": "application/json" },
//         body: JSON.stringify({ percentage_of_manufacturing_time: Number(editedValue) }),
//       });

//       if (!response.ok) throw new Error("Failed to update manufacturing percentage");
//       const result = await response.json();

//       setPercentage(result.data);
//       setEditing(false);
//       alert(result.message || "Manufacturing percentage updated successfully");
//     } catch (err) {
//       alert("Error updating manufacturing percentage: " + err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const exportToExcel = () => {
//     if (!percentage) {
//       alert("No data to export");
//       return;
//     }

//     // Define headers
//     const headers = ["Manufacturing Percentage"];

//     // Create CSV content
//     let csvContent = headers.join(",") + "\n";
//     csvContent += percentage.percentage_of_manufacturing_time + "\n";

//     // Create blob and download
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);

//     link.setAttribute("href", url);
//     link.setAttribute("download", `Turning_Manufacturing_Percentage_${new Date().toISOString().split('T')[0]}.csv`);
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
//         <Loader className="w-8 h-8 text-[#246679] animate-spin" />
//         <span className="ml-3 text-gray-600">Loading manufacturing percentage...</span>
//       </div>
//     );
//   }

//   // if (error) {
//   //   return (
//   //     <div>
//   //       <div className="flex items-center justify-between mb-6">
//   //           <button
//   //           onClick={onBack}
//   //           className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
//   //         >
//   //           <ArrowLeft className="w-4 h-4" />
//   //           <span>Back to Overview</span>
//   //         </button>
//   //         <h2 className="text-2xl font-bold text-gray-800">Turning Manufacturing %</h2>

//   //       </div>
//   //       <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//   //         <h3 className="text-red-800 font-semibold mb-2">Error Loading Data</h3>
//   //         <p className="text-red-600">{error}</p>
//   //         <button
//   //           onClick={() => window.location.reload()}
//   //           className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//   //         >
//   //           Retry
//   //         </button>
//   //       </div>
//   //     </div>
//   //   );
//   // }

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//              <button
//             onClick={onBack}
//             className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             <span>Back to Overview</span>
//           </button>
//         <h2 className="text-2xl font-bold text-gray-800">Turning Machining Time wrt manufacturing time(%)</h2>
//         <div className="flex items-center space-x-3">
//           <button
//             onClick={exportToExcel}
//             className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
//           >
//             <Download className="w-4 h-4" />
//             <span>Export to Excel</span>
//           </button>

//         </div>
//       </div>

//       {/* Percentage Card with Table Style */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         {/* Table Header */}
//         <div className="bg-[#1e5767] text-white px-6 py-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="font-semibold">Percentage of Machining Time wrt manufacturing time(%)</div>
//             {isAdmin && (
//               <div className="font-semibold text-right">Action</div>
//             )}
//           </div>
//         </div>

//         {/* Table Body */}
//         <div className="px-6 py-4">
//           <div className="grid grid-cols-2 gap-4 items-center">
//             <div>
//               {isAdmin && editing ? (
//                 <div className="flex items-center space-x-2">
//                   <input
//                     type="number"
//                     value={editedValue}
//                     onChange={(e) => setEditedValue(e.target.value)}
//                     className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                     disabled={updating}
//                     placeholder="%"
//                   />
//                   <span className="text-gray-600">%</span>
//                 </div>
//               ) : (
//                 <p className="text-base text-gray-900">
//                   {percentage.percentage_of_manufacturing_time}%
//                 </p>
//               )}
//             </div>

//             {isAdmin && (
//               <div className="flex justify-end">
//                 {editing ? (
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={handleUpdate}
//                       disabled={updating}
//                       className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
//                     >
//                       <Save className="w-4 h-4" />
//                       <span>{updating ? "Saving..." : "Save"}</span>
//                     </button>
//                     <button
//                       onClick={handleCancel}
//                       disabled={updating}
//                       className="flex items-center space-x-1 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
//                     >
//                       <X className="w-4 h-4" />
//                       <span>Cancel</span>
//                     </button>
//                   </div>
//                 ) : (
//                   <button
//                     onClick={handleEdit}
//                     className="flex items-center space-x-1 px-4 py-2 bg-[#1e5767] text-white rounded hover:bg-[#246679] transition-colors"
//                   >
//                     <Edit2 className="w-4 h-4" />
//                     <span>Update</span>
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
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

// export default TurningManufacturingPercentage;








import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, X, Edit2, Loader, Download } from "lucide-react";
import * as XLSX from 'xlsx';

const TurningManufacturingPercentage = ({ onBack }) => {
  const [percentage, setPercentage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    percentage_of_manufacturing_time: "",
    Correction_factor: ""
  });
  const [updating, setUpdating] = useState(false);
  const [userRole, setUserRole] = useState('');

  // Fetch current percentage
  useEffect(() => {
    // Get user role from sessionStorage
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    setUserRole(userData.role || '');

    const fetchPercentage = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5678/turning-manufacturing-percentage/");
        if (!response.ok) throw new Error("Failed to fetch manufacturing percentage");
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setPercentage(data.data[0]);
          setEditedData({
            percentage_of_manufacturing_time: data.data[0].percentage_of_manufacturing_time,
            Correction_factor: data.data[0].Correction_factor
          });
        } else {
          throw new Error("No manufacturing percentage data found");
        }
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPercentage();
  }, []);

  const handleEdit = () => {
    setEditing(true);
    setEditedData({
      percentage_of_manufacturing_time: percentage.percentage_of_manufacturing_time,
      Correction_factor: percentage.Correction_factor
    });
  };

  const handleCancel = () => {
    setEditing(false);
    setEditedData({
      percentage_of_manufacturing_time: percentage.percentage_of_manufacturing_time,
      Correction_factor: percentage.Correction_factor
    });
  };

  const handleUpdate = async () => {
    if (editedData.percentage_of_manufacturing_time === "" || Number(editedData.percentage_of_manufacturing_time) <= 0) {
      alert("Please enter a valid percentage");
      return;
    }
    if (editedData.Correction_factor === "") {
      alert("Please enter a valid correction factor");
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch("http://localhost:5678/turning-manufacturing-percentage/", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "accept": "application/json" },
        body: JSON.stringify({
          percentage_of_manufacturing_time: Number(editedData.percentage_of_manufacturing_time),
          Correction_factor: Number(editedData.Correction_factor)
        }),
      });

      if (!response.ok) throw new Error("Failed to update manufacturing percentage");
      const result = await response.json();

      // Handle both direct object and nested data response
      const updatedData = result.data || result;
      setPercentage(updatedData);
      setEditing(false);
      alert(result.message || "Manufacturing percentage updated successfully");
    } catch (err) {
      alert("Error updating manufacturing percentage: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const exportToExcel = () => {
    if (!percentage) {
      alert("No data to export");
      return;
    }

    const excelData = [{
      'Percentage of Machining Time (%)': percentage.percentage_of_manufacturing_time,
      'Correction Factor': percentage.Correction_factor
    }];

    const ws = XLSX.utils.json_to_sheet(excelData);
    ws['!cols'] = [{ wch: 35 }, { wch: 20 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Manufacturing Percentage');

    const date = new Date().toISOString().split('T')[0];
    const filename = `Turning_Manufacturing_Percentage_${date}.xlsx`;

    XLSX.writeFile(wb, filename);
  };

  // Check if user is admin
  const isAdmin = userRole.toLowerCase() === 'admin';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-[#246679] animate-spin" />
        <span className="ml-3 text-gray-600">Loading manufacturing percentage...</span>
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Turning Machining Time wrt manufacturing time(%)</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportToExcel}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Export to Excel</span>
          </button>
        </div>
      </div>

      {/* Manufacturing Data Table */}
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
                  {isAdmin && editing ? (
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
                        className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#246679]"
                        disabled={updating}
                        placeholder="%"
                      />
                      <span className="text-gray-600">%</span>
                    </div>
                  ) : (
                    <p className="text-base text-gray-900 font-medium">
                      {percentage.percentage_of_manufacturing_time}%
                    </p>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  {isAdmin && editing ? (
                    <input
                      type="number"
                      step="0.1"
                      value={editedData.Correction_factor}
                      onChange={(e) => setEditedData({
                        ...editedData,
                        Correction_factor: e.target.value
                      })}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#246679]"
                      disabled={updating}
                      placeholder="0.0"
                    />
                  ) : (
                    <p className="text-base text-gray-900 font-medium">
                      {percentage.Correction_factor}
                    </p>
                  )}
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 text-sm">
                    {editing ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleUpdate}
                          disabled={updating}
                          className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          <span>{updating ? "Saving..." : "Save"}</span>
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={updating}
                          className="flex items-center space-x-1 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleEdit}
                        className="flex items-center space-x-1 px-4 py-2 bg-[#1e5767] text-white rounded hover:bg-[#246679] transition-colors"
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

export default TurningManufacturingPercentage;