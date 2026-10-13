// import React, { useState, useEffect } from "react";
// import { ArrowLeft, Edit2, Save, X, Loader } from "lucide-react";

// const TurningPercentages = ({ onBack }) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editing, setEditing] = useState(false);
//   const [editedValues, setEditedValues] = useState({
//     roughing_percentage: "",
//     finishing_percentage: ""
//   });
//   const [updating, setUpdating] = useState(false);

//   // Fetch turning percentages
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch("http://localhost:5678/turning-percentages/");
//         if (!response.ok) throw new Error("Failed to fetch turning percentages");
//         const result = await response.json();

//         if (result && result.length > 0) {
//           setData(result[0]);
//           setEditedValues({
//             roughing_percentage: result[0].roughing_percentage,
//             finishing_percentage: result[0].finishing_percentage
//           });
//         } else {
//           throw new Error("No turning percentages data found");
//         }
//         setError(null);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleEdit = () => {
//     setEditing(true);
//   };

//   const handleCancel = () => {
//     setEditing(false);
//     setEditedValues({
//       roughing_percentage: data.roughing_percentage,
//       finishing_percentage: data.finishing_percentage
//     });
//   };

//   const handleInputChange = (field, value) => {
//     setEditedValues(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleUpdate = async () => {
//     const roughing = Number(editedValues.roughing_percentage);
//     const finishing = Number(editedValues.finishing_percentage);

//     // Validation
//     if (roughing <= 0 || finishing <= 0) {
//       alert("Please enter valid percentages greater than 0");
//       return;
//     }

//     if (roughing + finishing !== 100) {
//       alert("Roughing and Finishing percentages must sum to 100%");
//       return;
//     }

//     try {
//       setUpdating(true);
//       const response = await fetch("http://localhost:5678/turning-percentages/", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           "accept": "application/json"
//         },
//         body: JSON.stringify({
//           roughing_percentage: roughing,
//           finishing_percentage: finishing
//         })
//       });

//       if (!response.ok) throw new Error("Failed to update turning percentages");
//       const result = await response.json();

//       // Update local state
//       setData(result.data);
//       setEditedValues({
//         roughing_percentage: result.data.roughing_percentage,
//         finishing_percentage: result.data.finishing_percentage
//       });
//       setEditing(false);
//       alert(result.message || "Turning percentages updated successfully");
//     } catch (err) {
//       alert("Error updating turning percentages: " + err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader className="w-8 h-8 text-[#246679] animate-spin" />
//         <span className="ml-3 text-gray-600">Loading turning percentages...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div>
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-bold text-gray-800">Turning Percentages</h2>
//           <button
//             onClick={onBack}
//             className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             <span>Back to Overview</span>
//           </button>
//         </div>
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//           <h3 className="text-red-800 font-semibold mb-2">Error Loading Data</h3>
//           <p className="text-red-600">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
//         <h2 className="text-2xl font-bold text-gray-800">Turning Percentages</h2>
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
//         {/* Table Header */}
//         <div className="bg-[#1e5767] text-white">
//           <div className="grid grid-cols-3 gap-4 px-6 py-4">
//             <div className="font-semibold">Roughing Percentage</div>
//             <div className="font-semibold">Finishing Percentage</div>
//             <div className="font-semibold text-right">Action</div>
//           </div>
//         </div>

//         {/* Table Body */}
//         <div className="divide-y divide-gray-200">
//           <div className="grid grid-cols-3 gap-4 px-6 py-4 items-center hover:bg-gray-50">
//             {/* Roughing Percentage Column */}
//             <div>
//               {editing ? (
//                 <div className="flex items-center space-x-2">
//                   <input
//                     type="number"
//                     value={editedValues.roughing_percentage}
//                     onChange={(e) => handleInputChange('roughing_percentage', e.target.value)}
//                     className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                     disabled={updating}
//                     min="0"
//                     max="100"
//                   />
//                   <span className="text-gray-600">%</span>
//                 </div>
//               ) : (
//                 <span className="text-gray-700">{data.roughing_percentage}%</span>
//               )}
//             </div>

//             {/* Finishing Percentage Column */}
//             <div>
//               {editing ? (
//                 <div className="flex items-center space-x-2">
//                   <input
//                     type="number"
//                     value={editedValues.finishing_percentage}
//                     onChange={(e) => handleInputChange('finishing_percentage', e.target.value)}
//                     className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                     disabled={updating}
//                     min="0"
//                     max="100"
//                   />
//                   <span className="text-gray-600">%</span>
//                 </div>
//               ) : (
//                 <span className="text-gray-700">{data.finishing_percentage}%</span>
//               )}
//             </div>

//             {/* Action Column */}
//             <div className="flex justify-end space-x-2">
//               {editing ? (
//                 <>
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
//                 </>
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

//       {/* Info Box */}
//       <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
//         <p className="text-sm text-gray-700">
//           <span className="font-semibold">Note:</span> Roughing and Finishing percentages must sum to 100%. These values represent the time allocation for each phase of the turning process.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default TurningPercentages;






//'''updated logic based on the admin role action column is displaed
// import React, { useState, useEffect } from "react";
// import { ArrowLeft, Edit2, Save, X, Loader } from "lucide-react";

// const TurningPercentages = ({ onBack }) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editing, setEditing] = useState(false);
//   const [editedValues, setEditedValues] = useState({
//     roughing_percentage: "",
//     finishing_percentage: ""
//   });
//   const [updating, setUpdating] = useState(false);
//   const [userRole, setUserRole] = useState('');

//   // Fetch turning percentages
//   useEffect(() => {
//     // Get user role from sessionStorage
//     const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
//     setUserRole(userData.role || '');

//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch("http://localhost:5678/turning-percentages/");
//         if (!response.ok) throw new Error("Failed to fetch turning percentages");
//         const result = await response.json();

//         if (result && result.length > 0) {
//           setData(result[0]);
//           setEditedValues({
//             roughing_percentage: result[0].roughing_percentage,
//             finishing_percentage: result[0].finishing_percentage
//           });
//         } else {
//           throw new Error("No turning percentages data found");
//         }
//         setError(null);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleEdit = () => {
//     setEditing(true);
//   };

//   const handleCancel = () => {
//     setEditing(false);
//     setEditedValues({
//       roughing_percentage: data.roughing_percentage,
//       finishing_percentage: data.finishing_percentage
//     });
//   };

//   const handleInputChange = (field, value) => {
//     setEditedValues(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleUpdate = async () => {
//     const roughing = Number(editedValues.roughing_percentage);
//     const finishing = Number(editedValues.finishing_percentage);

//     // Validation
//     if (roughing <= 0 || finishing <= 0) {
//       alert("Please enter valid percentages greater than 0");
//       return;
//     }

//     if (roughing + finishing !== 100) {
//       alert("Roughing and Finishing percentages must sum to 100%");
//       return;
//     }

//     try {
//       setUpdating(true);
//       const response = await fetch("http://localhost:5678/turning-percentages/", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           "accept": "application/json"
//         },
//         body: JSON.stringify({
//           roughing_percentage: roughing,
//           finishing_percentage: finishing
//         })
//       });

//       if (!response.ok) throw new Error("Failed to update turning percentages");
//       const result = await response.json();

//       // Update local state
//       setData(result.data);
//       setEditedValues({
//         roughing_percentage: result.data.roughing_percentage,
//         finishing_percentage: result.data.finishing_percentage
//       });
//       setEditing(false);
//       alert(result.message || "Turning percentages updated successfully");
//     } catch (err) {
//       alert("Error updating turning percentages: " + err.message);
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
//         <span className="ml-3 text-gray-600">Loading turning percentages...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div>
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-bold text-gray-800">Turning Percentages</h2>
//           <button
//             onClick={onBack}
//             className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             <span>Back to Overview</span>
//           </button>
//         </div>
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//           <h3 className="text-red-800 font-semibold mb-2">Error Loading Data</h3>
//           <p className="text-red-600">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
//         <h2 className="text-2xl font-bold text-gray-800">Turning Percentages</h2>
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
//         {/* Table Header */}
//         <div className="bg-[#1e5767] text-white">
//           <div className={`grid ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'} gap-4 px-6 py-4`}>
//             <div className="font-semibold">Roughing Percentage</div>
//             <div className="font-semibold">Finishing Percentage</div>
//             {isAdmin && (
//               <div className="font-semibold text-right">Action</div>
//             )}
//           </div>
//         </div>

//         {/* Table Body */}
//         <div className="divide-y divide-gray-200">
//           <div className={`grid ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'} gap-4 px-6 py-4 items-center hover:bg-gray-50`}>
//             {/* Roughing Percentage Column */}
//             <div>
//               {isAdmin && editing ? (
//                 <div className="flex items-center space-x-2">
//                   <input
//                     type="number"
//                     value={editedValues.roughing_percentage}
//                     onChange={(e) => handleInputChange('roughing_percentage', e.target.value)}
//                     className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                     disabled={updating}
//                     min="0"
//                     max="100"
//                   />
//                   <span className="text-gray-600">%</span>
//                 </div>
//               ) : (
//                 <span className="text-gray-700">{data.roughing_percentage}%</span>
//               )}
//             </div>

//             {/* Finishing Percentage Column */}
//             <div>
//               {isAdmin && editing ? (
//                 <div className="flex items-center space-x-2">
//                   <input
//                     type="number"
//                     value={editedValues.finishing_percentage}
//                     onChange={(e) => handleInputChange('finishing_percentage', e.target.value)}
//                     className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#246679]"
//                     disabled={updating}
//                     min="0"
//                     max="100"
//                   />
//                   <span className="text-gray-600">%</span>
//                 </div>
//               ) : (
//                 <span className="text-gray-700">{data.finishing_percentage}%</span>
//               )}
//             </div>

//             {/* Action Column */}
//             {isAdmin && (
//               <div className="flex justify-end space-x-2">
//                 {editing ? (
//                   <>
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
//                   </>
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
//             <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update turning percentages.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TurningPercentages;










//'''''this below code added the export to excel button to download the data into  excelformatt''''''// 
import React, { useState, useEffect } from "react";
import { ArrowLeft, Edit2, Save, X, Loader, Download } from "lucide-react";

const TurningPercentages = ({ onBack }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedValues, setEditedValues] = useState({
    roughing_percentage: "",
    finishing_percentage: ""
  });
  const [updating, setUpdating] = useState(false);
  const [userRole, setUserRole] = useState('');

  // Fetch turning percentages
  useEffect(() => {
    // Get user role from sessionStorage
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    setUserRole(userData.role || '');

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5678/turning-percentages/");
        if (!response.ok) throw new Error("Failed to fetch turning percentages");
        const result = await response.json();

        if (result && result.length > 0) {
          setData(result[0]);
          setEditedValues({
            roughing_percentage: result[0].roughing_percentage,
            finishing_percentage: result[0].finishing_percentage
          });
        } else {
          throw new Error("No turning percentages data found");
        }
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditedValues({
      roughing_percentage: data.roughing_percentage,
      finishing_percentage: data.finishing_percentage
    });
  };

  const handleInputChange = (field, value) => {
    setEditedValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdate = async () => {
    const roughing = Number(editedValues.roughing_percentage);
    const finishing = Number(editedValues.finishing_percentage);

    // Validation
    if (roughing <= 0 || finishing <= 0) {
      alert("Please enter valid percentages greater than 0");
      return;
    }

    if (roughing + finishing !== 100) {
      alert("Roughing and Finishing percentages must sum to 100%");
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch("http://localhost:5678/turning-percentages/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json"
        },
        body: JSON.stringify({
          roughing_percentage: roughing,
          finishing_percentage: finishing
        })
      });

      if (!response.ok) throw new Error("Failed to update turning percentages");
      const result = await response.json();

      // Update local state
      setData(result.data);
      setEditedValues({
        roughing_percentage: result.data.roughing_percentage,
        finishing_percentage: result.data.finishing_percentage
      });
      setEditing(false);
      alert(result.message || "Turning percentages updated successfully");
    } catch (err) {
      alert("Error updating turning percentages: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const exportToExcel = () => {
    if (!data) {
      alert("No data to export");
      return;
    }

    // Define headers
    const headers = [
      "Roughing Percentage",
      "Finishing Percentage"
    ];

    // Create CSV content
    let csvContent = headers.join(",") + "\n";

    const row = [
      data.roughing_percentage,
      data.finishing_percentage
    ];
    csvContent += row.join(",") + "\n";

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `Turning_Percentages_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Check if user is admin
  const isAdmin = userRole.toLowerCase() === 'admin';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-[#246679] animate-spin" />
        <span className="ml-3 text-gray-600">Loading turning percentages...</span>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div>
  //       <div className="flex items-center justify-between mb-6">
  //         <h2 className="text-2xl font-bold text-gray-800">Turning Percentages</h2>
  //         <button
  //           onClick={onBack}
  //           className="flex items-center space-x-2 px-4 py-2 bg-[#246679] text-white rounded-lg hover:bg-[#1f5766] transition-colors duration-200"
  //         >
  //           <ArrowLeft className="w-4 h-4" />
  //           <span>Back to Overview</span>
  //         </button>
  //       </div>
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
  //     </div>
  //   );
  // }

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
        <h2 className="text-2xl font-bold text-gray-800">Turning Roughing Percentages</h2>
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

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Table Header */}
        <div className="bg-[#1e5767] text-white">
          <div className={`grid ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'} gap-4 px-6 py-4`}>
            <div className="font-semibold">Roughing Percentage</div>
            <div className="font-semibold">Finishing Percentage</div>
            {isAdmin && (
              <div className="font-semibold text-right">Action</div>
            )}
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          <div className={`grid ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'} gap-4 px-6 py-4 items-center hover:bg-gray-50`}>
            {/* Roughing Percentage Column */}
            <div>
              {isAdmin && editing ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={editedValues.roughing_percentage}
                    onChange={(e) => handleInputChange('roughing_percentage', e.target.value)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    disabled={updating}
                    min="0"
                    max="100"
                  />
                  <span className="text-gray-600">%</span>
                </div>
              ) : (
                <span className="text-gray-700">{data.roughing_percentage}%</span>
              )}
            </div>

            {/* Finishing Percentage Column */}
            <div>
              {isAdmin && editing ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={editedValues.finishing_percentage}
                    onChange={(e) => handleInputChange('finishing_percentage', e.target.value)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#246679]"
                    disabled={updating}
                    min="0"
                    max="100"
                  />
                  <span className="text-gray-600">%</span>
                </div>
              ) : (
                <span className="text-gray-700">{data.finishing_percentage}%</span>
              )}
            </div>

            {/* Action Column */}
            {isAdmin && (
              <div className="flex justify-end space-x-2">
                {editing ? (
                  <>
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
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="flex items-center space-x-1 px-4 py-2 bg-[#1e5767] text-white rounded hover:bg-[#246679] transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Update</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {!isAdmin && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> You are viewing this data in read-only mode. Only Admin users can update turning percentages.
          </p>
        </div>
      )}
    </div>
  );
};

export default TurningPercentages;