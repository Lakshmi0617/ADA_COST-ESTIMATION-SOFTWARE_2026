

//''''final correct code working for displayed modules based on the login role based which is side bar display of navbar '''''''''''//
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

// const Navbar = () => {
//   const [isManufacturingOpen, setIsManufacturingOpen] = useState(false);
//   const [openModules, setOpenModules] = useState({});
//   const [userRole, setUserRole] = useState('');
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Get user role from sessionStorage on component mount
//   useEffect(() => {
//     const userData = sessionStorage.getItem('userData');
//     if (userData) {
//       const parsedData = JSON.parse(userData);
//       setUserRole(parsedData.role);
//       console.log('User role from session:', parsedData.role);
//     }
//   }, []);

//   const toggleManufacturing = () => {
//     setIsManufacturingOpen(!isManufacturingOpen);
//     navigate('/home');
//   };

//   const toggleModule = (moduleName) => {
//     setOpenModules(prev => ({
//       ...prev,
//       [moduleName]: !prev[moduleName]
//     }));
//   };

//   const handleSubModuleClick = (subModule) => {
//     console.log(`Selected sub-module: ${subModule.name}`);
//     navigate(subModule.path);
//   };

//   // Define all modules with proper role mapping
//   const allModules = [
//     { 
//       name: 'Machining Module', 
//       roleKeys: ['Machining Module'], // Array to support multiple role names if needed
//       icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/gear.png',
//       color: '#145da0',
//       subModules: [
//         { name: 'Milling Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/wrench.png', path: '/home/machine/milling' },
//         { name: 'Turning Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/disc-sander.png', path: '/home/machine/grinding' },
//         // { name: 'Contour Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/blueprint.png', path: '/home/machine/contour' },
//         // { name: 'Drilling Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/drill.png', path: '/home/machine/drilling' }
//       ]
//     },
//     { 
//       name: 'Composites Module', 
//       roleKeys: ['Composite Module'],
//       icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/composite-material.png',
//       color: '#145da0',
//       subModules: [
//         // { name: 'Layup Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/layers.png', path: '/home/composites/layup' },
//         // { name: 'Curing Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/furnace.png', path: '/home/composites/curing' },
//         // { name: 'Trimming Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/scissors.png', path: '/home/composites/trimming' }
//       ]
//     },
//     { 
//       name: 'Sheet Metal Module', 
//       roleKeys: ['Sheet Metal Module'],
//       icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/sheet-metal.png',
//       color: '#145da0',
//       subModules: [
//         { name: 'Press Brake Forming ', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/sheet-bending-machine.png', path: '/home/sheet-metal/bending' },
//         { name: 'Rubber Pad Press ', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/laser-cutting.png', path: '/home/sheet-metal/cutting' },
//         { name: 'Stretch Forming', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/welding.png', path: '/home/sheet-metal/welding' }
//       ]
//     }
//   ];

//   // Filter modules based on user role
//   const getFilteredModules = () => {
//     if (userRole === 'admin') {
//       // Admin can see all modules
//       return allModules;
//     } else {
//       // Filter modules based on user's specific role
//       return allModules.filter(module => 
//         module.roleKeys.includes(userRole)
//       );
//     }
//   };

//   const modules = getFilteredModules();

//   // Get total module count for display
//   const getTotalModuleCount = () => {
//     return modules.length;
//   };

//   // Function to check if user has access to a specific path
//   const hasAccessToPath = (path) => {
//     if (userRole === 'admin') return true;
    
//     // Define role-based path access
//     const rolePathAccess = {
//       'Machining Module': [
//         '/home/machine/milling',
//         '/home/machine/grinding', 
//         '/home/machine/contour',
//         '/home/machine/drilling',
//         '/home/grinding' // Direct grinding access
//       ],
//       'Composite Module': [
//         '/home/composites/layup',
//         '/home/composites/curing',
//         '/home/composites/trimming'
//       ],
//       'Sheet Metal Module': [
//         '/home/sheet-metal/bending',
//         '/home/sheet-metal/cutting',
//         '/home/sheet-metal/welding'
//       ]
//     };

//     const accessiblePaths = rolePathAccess[userRole] || [];
//     return accessiblePaths.includes(path);
//   };

//   return (
//     <div 
//       className="absolute left-0 top-30 h-full shadow-2xl border-r-4 z-40"
//       style={{
//         backgroundColor: '#FFFFFF',
//         borderRightColor: '#246679'
//       }}
//     >
//       <div className="w-80 h-full overflow-y-auto">
//         {/* Navbar Header */}
//         <div 
//           className="p-4 border-b"
//           style={{
//             borderBottomColor: 'rgba(36, 102, 121, 0.3)',
//             backgroundColor: 'rgba(36, 102, 121, 0.1)'
//           }}
//         >
//           <div className="flex items-center space-x-2">
//             <div 
//               className="w-2 h-2 rounded-full animate-pulse"
//               style={{backgroundColor: '#246679'}}
//             ></div>
//             <span 
//               className="font-mono text-sm tracking-wider font-bold"
//               style={{color: '#246679'}}
//             >
//               PROJECT TREE
//             </span>
//             {/* Display user role */}
//             <div className="ml-auto">
//               <span 
//                 className="text-xs font-mono px-2 py-1 rounded"
//                 style={{
//                   backgroundColor: 'rgba(36, 102, 121, 0.2)',
//                   color: '#145da0'
//                 }}
//               >
//                 {userRole.toUpperCase()}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Manufacturing Root Directory */}
//         <div className="p-3">
//           <div
//             onClick={toggleManufacturing}
//             className="flex items-center p-2 rounded-md cursor-pointer transition-all duration-300 group border"
//             style={{
//               backgroundColor: location.pathname === '/home' ? 'rgba(36, 102, 121, 0.2)' : 'rgba(115, 182, 202, 0.1)',
//               borderColor: location.pathname === '/home' ? '#246679' : 'rgba(36, 102, 121, 0.2)',
//               boxShadow: location.pathname === '/home' ? '0 10px 15px -3px rgba(36, 102, 121, 0.2)' : 'none'
//             }}
//             onMouseEnter={(e) => {
//               if (location.pathname !== '/home') {
//                 e.target.style.backgroundColor = 'rgba(115, 182, 202, 0.2)';
//                 e.target.style.borderColor = 'rgba(36, 102, 121, 0.5)';
//               }
//             }}
//             onMouseLeave={(e) => {
//               if (location.pathname !== '/home') {
//                 e.target.style.backgroundColor = 'rgba(115, 182, 202, 0.1)';
//                 e.target.style.borderColor = 'rgba(36, 102, 121, 0.2)';
//               }
//             }}
//           >
//             <div className="flex items-center space-x-2 w-full">
//               {/* Expand/Collapse Icon */}
//               <div 
//                 className={`transition-transform duration-300 ${isManufacturingOpen ? 'rotate-90' : 'rotate-0'}`}
//                 style={{color: '#246679'}}
//               >
//                 {isManufacturingOpen ? (
//                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                 ) : (
//                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                   </svg>
//                 )}
//               </div>
              
//               {/* Folder Icon */}
//               <div 
//                 className="w-5 h-5 rounded-sm flex items-center justify-center shadow-sm"
//                 style={{background: `linear-gradient(135deg, #246679, #145da0)`}}
//               >
//                 <img 
//                   src="https://img.icons8.com/ios-filled/50/d7f2f5/folder-invoices.png" 
//                   alt="folder" 
//                   className="w-3 h-3"
//                 />
//               </div>
              
//               {/* Directory Name */}
//               <span 
//                 className="font-bold tracking-wide group-hover:transition-colors duration-300 text-lg"
//                 style={{
//                   fontFamily: 'Times New Roman, serif',
//                   color: location.pathname === '/home' ? '#145da0' : '#246679',
//                   fontSize: '18px'
//                 }}
//               >
//                 Manufacturing
//               </span>
//             </div>
//           </div>

//           {/* Main Modules with Sub-modules */}
//           <div className={`overflow-hidden transition-all duration-500 ${
//             isManufacturingOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
//           }`}>
//             <div className="ml-4 mt-1 relative">
//               {/* Vertical Tree Line */}
//               <div 
//                 className="absolute left-2 top-0 bottom-0 w-px"
//                 style={{backgroundColor: '#73b6ca'}}
//               ></div>
              
//               {modules.map((module, moduleIndex) => (
//                 <div key={moduleIndex} className="relative">
//                   {/* Horizontal Tree Line for Main Module */}
//                   <div 
//                     className="absolute left-2 w-4 h-px" 
//                     style={{top: '1.5rem', backgroundColor: '#73b6ca'}}
//                   ></div>
                  
//                   {/* Main Module */}
//                   <div
//                     onClick={() => toggleModule(module.name)}
//                     className="flex items-center space-x-2 p-2 ml-6 rounded-md cursor-pointer transition-all duration-300 border"
//                     style={{
//                       backgroundColor: openModules[module.name] ? 'rgba(36, 102, 121, 0.2)' : 'rgba(115, 182, 202, 0.1)',
//                       borderColor: openModules[module.name] ? '#246679' : 'rgba(115, 182, 202, 0.3)',
//                       color: openModules[module.name] ? '#145da0' : '#246679',
//                       boxShadow: openModules[module.name] ? '0 10px 15px -3px rgba(36, 102, 121, 0.2)' : 'none'
//                     }}
//                     onMouseEnter={(e) => {
//                       if (!openModules[module.name]) {
//                         e.target.style.backgroundColor = 'rgba(115, 182, 202, 0.2)';
//                         e.target.style.borderColor = 'rgba(36, 102, 121, 0.3)';
//                         e.target.style.color = '#145da0';
//                       }
//                     }}
//                     onMouseLeave={(e) => {
//                       if (!openModules[module.name]) {
//                         e.target.style.backgroundColor = 'rgba(115, 182, 202, 0.1)';
//                         e.target.style.borderColor = 'rgba(115, 182, 202, 0.3)';
//                         e.target.style.color = '#246679';
//                       }
//                     }}
//                   >
//                     {/* Expand/Collapse Icon for Module */}
//                     <div 
//                       className={`transition-transform duration-300 ${openModules[module.name] ? 'rotate-90' : 'rotate-0'}`}
//                       style={{color: '#246679'}}
//                     >
//                       <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                       </svg>
//                     </div>

//                     {/* Module Icon */}
//                     <div 
//                       className="w-5 h-5 rounded-sm flex items-center justify-center shadow-sm"
//                       style={{backgroundColor: module.color}}
//                     >
//                       <img 
//                         src={module.icon} 
//                         alt={module.name} 
//                         className="w-3 h-3"
//                       />
//                     </div>
                    
//                     {/* Module Name */}
//                     <span 
//                       className="font-black tracking-wide"
//                       style={{
//                         fontFamily: 'Times New Roman, serif',
//                         fontSize: '16px'
//                       }}
//                     >
//                       {module.name}
//                     </span>
//                   </div>

//                   {/* Sub-modules - Only show accessible ones */}
//                   <div className={`overflow-hidden transition-all duration-500 ${
//                     openModules[module.name] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
//                   }`}>
//                     <div className="ml-8 mt-1 relative">
//                       {/* Vertical Tree Line for Sub-modules */}
//                       <div 
//                         className="absolute left-2 top-0 bottom-0 w-px"
//                         style={{backgroundColor: '#73b6ca'}}
//                       ></div>
                      
//                       {module.subModules
//                         .filter(subModule => hasAccessToPath(subModule.path)) // Filter based on access
//                         .map((subModule, subIndex) => (
//                         <div key={subIndex} className="relative flex items-center">
//                           {/* Horizontal Tree Line for Sub-module */}
//                           <div 
//                             className="absolute left-2 w-4 h-px" 
//                             style={{top: '50%', backgroundColor: '#73b6ca'}}
//                           ></div>
                          
//                           <div
//                             onClick={() => handleSubModuleClick(subModule)}
//                             className="flex items-center space-x-2 p-2 ml-6 rounded-md cursor-pointer transition-all duration-300 border w-full"
//                             style={{
//                               backgroundColor: location.pathname === subModule.path ? 'rgba(36, 102, 121, 0.2)' : 'rgba(115, 182, 202, 0.05)',
//                               borderColor: location.pathname === subModule.path ? '#246679' : 'rgba(115, 182, 202, 0.2)',
//                               color: location.pathname === subModule.path ? '#145da0' : '#246679',
//                               boxShadow: location.pathname === subModule.path ? '0 10px 15px -3px rgba(36, 102, 121, 0.2)' : 'none'
//                             }}
//                             onMouseEnter={(e) => {
//                               if (location.pathname !== subModule.path) {
//                                 e.target.style.backgroundColor = 'rgba(115, 182, 202, 0.15)';
//                                 e.target.style.borderColor = 'rgba(36, 102, 121, 0.2)';
//                                 e.target.style.color = '#145da0';
//                               }
//                             }}
//                             onMouseLeave={(e) => {
//                               if (location.pathname !== subModule.path) {
//                                 e.target.style.backgroundColor = 'rgba(115, 182, 202, 0.05)';
//                                 e.target.style.borderColor = 'rgba(115, 182, 202, 0.2)';
//                                 e.target.style.color = '#246679';
//                               }
//                             }}
//                           >
//                             {/* Sub-module Icon */}
//                             <div 
//                               className="w-4 h-4 rounded-sm flex items-center justify-center shadow-sm"
//                               style={{background: `linear-gradient(135deg, #73b6ca, #246679)`}}
//                             >
//                               <img 
//                                 src={subModule.icon} 
//                                 alt={subModule.name} 
//                                 className="w-2.5 h-2.5"
//                               />
//                             </div>
                            
//                             {/* Sub-module Name */}
//                             <span 
//                               className="font-bold tracking-wide"
//                               style={{
//                                 fontFamily: 'Times New Roman, serif',
//                                 fontSize: '14px'
//                               }}
//                             >
//                               {subModule.name}
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Bottom Status */}
//         <div className="absolute bottom-4 left-4 right-4">
//           <div 
//             className="backdrop-blur-sm border rounded-lg p-3"
//             style={{
//               backgroundColor: 'rgba(36, 102, 121, 0.1)',
//               borderColor: 'rgba(36, 102, 121, 0.3)'
//             }}
//           >
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <div 
//                   className="w-2 h-2 rounded-full animate-pulse"
//                   style={{backgroundColor: '#246679'}}
//                 ></div>
//                 <span 
//                   className="text-xs font-mono font-bold"
//                   style={{color: '#73b6ca'}}
//                 >
//                   READY
//                 </span>
//               </div>
//               <span 
//                 className="text-xs font-mono font-bold"
//                 style={{color: '#246679'}}
//               >
//                 {getTotalModuleCount()} MODULES
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;






//'''thsi below code is displaying navbar like a card display instead of side navbar ''''//

// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

// const CardNavbar = () => {
//   const [userRole, setUserRole] = useState('');
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Get user role from sessionStorage on component mount
//   useEffect(() => {
//     const userData = sessionStorage.getItem('userData');
//     if (userData) {
//       const parsedData = JSON.parse(userData);
//       setUserRole(parsedData.role);
//       console.log('User role from session:', parsedData.role);
//     }
//   }, []);

//   // Define all modules with proper role mapping
//   const allModules = [
//     { 
//       name: 'Machining Module', 
//       roleKeys: ['Machining Module'],
//       icon: '/machining-icon-bgremoved.png',
//       backgroundImage: './newmachining.jpg',
//       color: '#145da0',
//       description: 'Advanced machining processes including milling, turning, and precision operations',
//       path: '/home/machining',
//       subModules: [
//         { 
//           name: 'Milling Process', 
//           icon: '/milling_bgremove.png', 
//           path: '/home/machine/milling',
//           backgroundImage: '/milling.jpg',
//           description: 'Precision milling operations for complex geometries'
//         },
//         { 
//           name: 'Turning Process', 
//           icon: '/turn-icon.png', 
//           path: '/home/machine/grinding',
//           backgroundImage: '/turning.jpg',
//           description: 'High-precision turning and lathe operations'
//         }
//       ]
//     },
//     { 
//       name: 'Composites Module', 
//       roleKeys: ['Composite Module'],
//       icon: '/composites-icon1.png',
//       backgroundImage: '/composite_new_image.jpg',
//       color: '#145da0',
//       description: 'Advanced composite materials processing and manufacturing',
//       path: '/home/composites',
//       subModules: []
//     },
//     { 
//       name: 'Sheet Metal Module', 
//       roleKeys: ['Sheet Metal Module'],
//       icon: '/sheet-icon1.png',
//       backgroundImage: '/sheet-metal-image.jpg',
//       color: '#145da0',
//       description: 'Comprehensive sheet metal forming and fabrication',
//       path: '/home/sheet-metal',
//       subModules: [
//         { 
//           name: 'Press Brake Forming', 
//           icon: '/pressbrake-icon.png', 
//           path: '/home/sheet-metal/bending',
//           backgroundImage: '/press-brake-forming-image.jpg',
//           description: 'Precision press brake forming operations'
//         },
//         { 
//           name: 'Rubber Pad Press', 
//           icon: '/rub_image.png', 
//           path: '/home/sheet-metal/cutting',
//           backgroundImage: '/rubber-pad-process.jpg',
//           description: 'Rubber pad press forming technology'
//         },
//         { 
//           name: 'Stretch Forming', 
//           icon: '/sheet_metal_icon-removebg-preview.png', 
//           path: '/home/sheet-metal/welding',
//           backgroundImage: '/stretch-forming-image.jpg',
//           description: 'Advanced stretch forming processes'
//         }
//       ]
//     }
//   ];

//   // Filter modules based on user role
//   const getFilteredModules = () => {
//     if (userRole === 'admin') {
//       return allModules;
//     } else {
//       return allModules.filter(module => 
//         module.roleKeys.includes(userRole)
//       );
//     }
//   };

//   // Function to check if user has access to a specific path
//   const hasAccessToPath = (path) => {
//     if (userRole === 'admin') return true;
    
//     const rolePathAccess = {
//       'Machining Module': [
//         '/home/machine/milling',
//         '/home/machine/grinding'
//       ],
//       'Composite Module': [
//         '/home/composites/layup',
//         '/home/composites/curing'
//       ],
//       'Sheet Metal Module': [
//         '/home/sheet-metal/bending',
//         '/home/sheet-metal/cutting',
//         '/home/sheet-metal/welding'
//       ]
//     };

//     const accessiblePaths = rolePathAccess[userRole] || [];
//     return accessiblePaths.includes(path);
//   };

//   const modules = getFilteredModules();

//   const handleModuleClick = (module) => {
//     console.log(`Selected module: ${module.name}`);
//     navigate(module.path);
//   };

//   const handleSubModuleClick = (subModule) => {
//     console.log(`Selected sub-module: ${subModule.name}`);
//     navigate(subModule.path);
//   };

//   const handleBackToModules = () => {
//     navigate('/home');
//   };

//   // Check if we're viewing sub-modules
//   const currentModule = modules.find(module => 
//     location.pathname.startsWith(module.path) && location.pathname !== '/home'
//   );

//   // Main Modules View
//   if (location.pathname === '/home') {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <div className="flex items-center justify-center space-x-4 mb-4">
//             <div 
//               className="w-4 h-4 rounded-full animate-pulse"
//               style={{backgroundColor: '#246679'}}
//             />
//             <h1 
//               className="text-4xl font-bold tracking-wider"
//               style={{
//                 fontFamily: 'Times New Roman, serif',
//                 color: '#246679'
//               }}
//             >
//               MANUFACTURING MODULES
//             </h1>
//             <div className="ml-4">
//               <span 
//                 className="text-sm font-mono px-3 py-1 rounded-full"
//                 style={{
//                   backgroundColor: 'rgba(36, 102, 121, 0.2)',
//                   color: '#145da0'
//                 }}
//               >
//                 {userRole.toUpperCase()}
//               </span>
//             </div>
//           </div>
//           <p className="text-gray-600 text-lg">Select a manufacturing module to begin</p>
//         </div>

//         {/* Module Cards Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
//           {modules.map((module, index) => (
//             <div
//               key={index}
//               onClick={() => handleModuleClick(module)}
//               className="group relative overflow-hidden rounded-2xl shadow-2xl cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
//               style={{
//                 minHeight: '400px'
//               }}
//             >
//               {/* Background Image - Clearly visible */}
//               <div 
//                 className="absolute inset-0 bg-cover bg-center opacity-90 group-hover:opacity-95 transition-opacity duration-500"
//                 style={{
//                   backgroundImage: `url(${module.backgroundImage})`
//                 }}
//               />
              
//               {/* Gradient Overlay - Much lighter */}
//               <div 
//                 className="absolute inset-0 opacity-40 group-hover:opacity-30 transition-opacity duration-500"
//                 style={{
//                   background: `linear-gradient(135deg, rgba(36, 102, 121, 0.6), rgba(20, 93, 160, 0.6))`
//                 }}
//               />
              
//               {/* Card Content */}
//               <div className="relative z-10 p-8 h-full flex flex-col justify-between">
//                 {/* Module Icon */}
//                 <div className="flex justify-center mb-6">
//                   <div className="w-24 h-24 rounded-full bg-white bg-opacity-50 flex items-center justify-center shadow-2xl group-hover:bg-opacity-60 transition-all duration-500">
//                     <img 
//                       src={module.icon} 
//                       alt={module.name} 
//                       className="w-14 h-14 group-hover:scale-110 transition-transform duration-500"
//                     />
//                   </div>
//                 </div>

//                 {/* Module Title */}
//                 <div className="text-center mb-4">
//                   <h3 
//                     className="text-2xl font-bold text-white mb-2 group-hover:text-blue-100 transition-colors duration-300 drop-shadow-lg"
//                     style={{
//                       fontFamily: 'Times New Roman, serif'
//                     }}
//                   >
//                     {module.name}
//                   </h3>
//                   <p className="text-blue-100 text-sm leading-relaxed drop-shadow-md">
//                     {module.description}
//                   </p>
//                 </div>

//                 {/* Module Stats */}
//                 <div className="flex justify-between items-center text-blue-100 text-sm">
//                   <div className="flex items-center space-x-2">
//                     <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
//                     <span className="drop-shadow-md">Active</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <span className="drop-shadow-md">{module.subModules.length} Processes</span>
//                     <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Bottom Status */}
//         <div className="fixed bottom-6 left-6 right-6">
//           <div 
//             className="border rounded-xl p-4 mx-auto max-w-md"
//             style={{
//               backgroundColor: 'rgba(36, 102, 121, 0.1)',
//               borderColor: 'rgba(36, 102, 121, 0.3)'
//             }}
//           >
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <div 
//                   className="w-3 h-3 rounded-full animate-pulse"
//                   style={{backgroundColor: '#246679'}}
//                 />
//                 <span 
//                   className="text-sm font-mono font-bold"
//                   style={{color: '#73b6ca'}}
//                 >
//                   SYSTEM READY
//                 </span>
//               </div>
//               <span 
//                 className="text-sm font-mono font-bold"
//                 style={{color: '#246679'}}
//               >
//                 {modules.length} MODULES AVAILABLE
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Sub-modules View
//   if (currentModule && location.pathname === currentModule.path) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
//         {/* Header with Back Button */}
//         <div className="mb-8">
//           <button
//             onClick={handleBackToModules}
//             className="flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-100"
//             style={{color: '#246679'}}
//           >
//             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
//             </svg>
//             <span className="font-semibold">Back to Modules</span>
//           </button>

//           <div className="text-center">
//             <h1 
//               className="text-4xl font-bold tracking-wider mb-2"
//               style={{
//                 fontFamily: 'Times New Roman, serif',
//                 color: '#246679'
//               }}
//             >
//               {currentModule.name.toUpperCase()}
//             </h1>
//             <p className="text-gray-600 text-lg">Select a process to continue</p>
//           </div>
//         </div>

//         {/* Sub-module Cards Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
//           {currentModule.subModules
//             .filter(subModule => hasAccessToPath(subModule.path))
//             .map((subModule, index) => (
//             <div
//               key={index}
//               onClick={() => handleSubModuleClick(subModule)}
//               className="group relative overflow-hidden rounded-xl shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-105"
//               style={{
//                 minHeight: '300px'
//               }}
//             >
//               {/* Background Image - Clearly visible */}
//               <div 
//                 className="absolute inset-0 bg-cover bg-center opacity-90 group-hover:opacity-95 transition-opacity duration-300"
//                 style={{
//                   backgroundImage: `url(${subModule.backgroundImage})`
//                 }}
//               />
              
//               {/* Gradient Overlay - Much lighter */}
//               <div 
//                 className="absolute inset-0 opacity-40 group-hover:opacity-30 transition-opacity duration-300"
//                 style={{
//                   background: `linear-gradient(135deg, rgba(115, 182, 202, 0.5), rgba(36, 102, 121, 0.6))`
//                 }}
//               />
              
//               {/* Card Content */}
//               <div className="relative z-10 p-6 h-full flex flex-col justify-between">
//                 {/* Sub-module Icon */}
//                 <div className="flex justify-center mb-4">
//                   <div className="w-16 h-16 rounded-full bg-white bg-opacity-70 flex items-center justify-center shadow-lg group-hover:bg-opacity-80 transition-all duration-300">
//                     <img 
//                       src={subModule.icon} 
//                       alt={subModule.name} 
//                       className="w-20 h-20 group-hover:scale-110 transition-transform duration-300"
//                     />
//                   </div>
//                 </div>

//                 {/* Sub-module Title */}
//                 <div className="text-center mb-4">
//                   <h3 
//                     className="text-xl font-bold text-white mb-2 group-hover:text-blue-100 transition-colors duration-300 drop-shadow-lg"
//                     style={{
//                       fontFamily: 'Times New Roman, serif'
//                     }}
//                   >
//                     {subModule.name}
//                   </h3>
//                   <p className="text-blue-100 text-sm drop-shadow-md">
//                     {subModule.description}
//                   </p>
//                 </div>

//                 {/* Action Indicator */}
//                 <div className="flex justify-center">
//                   <div className="flex items-center space-x-2 text-blue-100 text-sm">
//                     <span className="drop-shadow-md">Start Process</span>
//                     <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // Default fallback
//   return null;
// };

// export default CardNavbar;






// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import MachineConfiguration from './MachineConfiguration';

// const CardNavbar = () => {
//   const [userRole, setUserRole] = useState('');
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Get user role from sessionStorage on component mount
//   useEffect(() => {
//     const userData = sessionStorage.getItem('userData');
//     if (userData) {
//       const parsedData = JSON.parse(userData);
//       setUserRole(parsedData.role);
//       console.log('User role from session:', parsedData.role);
//     }
//   }, []);


  

//   // Define all modules with proper role mapping
//   const allModules = [
//     { 
//       name: 'Machining Module', 
//       roleKeys: ['Machining Module'],
//       icon: '/machining-icon-bgremoved.png',
//       backgroundImage: './newmachining.jpg',
//       color: '#145da0',
//       description: 'Advanced machining processes including milling, turning, and precision operations',
//       path: '/home/machining',
//       subModules: [
//         { 
//           name: 'Milling Process', 
//           icon: '/milling_bgremove.png', 
//           path: '/home/machine/milling',
//           backgroundImage: '/milling.jpg',
//           description: 'Precision milling operations for complex geometries'
//         },
//         { 
//           name: 'Turning Process', 
//           icon: '/turn-icon.png', 
//           path: '/home/machine/grinding',
//           backgroundImage: '/turning.jpg',
//           description: 'High-precision turning and lathe operations'
//         }
//       ]
//     },
//     { 
//       name: 'Composites Module', 
//       roleKeys: ['Composite Module'],
//       icon: '/composites-icon1.png',
//       backgroundImage: '/composite_new_image.jpg',
//       color: '#145da0',
//       description: 'Advanced composite materials processing and manufacturing',
//       path: '/home/composites',
//       subModules: []
//     },
//     { 
//       name: 'Sheet Metal Module', 
//       roleKeys: ['Sheet Metal Module'],
//       icon: '/sheet-icon1.png',
//       backgroundImage: '/sheet-metal-image.jpg',
//       color: '#145da0',
//       description: 'Comprehensive sheet metal forming and fabrication',
//       path: '/home/sheet-metal',
//       subModules: [
//         { 
//           name: 'Press Brake Forming', 
//           icon: '/pressbrake-icon.png', 
//           path: '/home/sheet-metal/bending',
//           backgroundImage: '/press-brake-forming-image.jpg',
//           description: 'Precision press brake forming operations'
//         },
//         { 
//           name: 'Rubber Pad Press', 
//           icon: '/rub_image.png', 
//           path: '/home/sheet-metal/cutting',
//           backgroundImage: '/rubber-pad-process.jpg',
//           description: 'Rubber pad press forming technology'
//         },
//         { 
//           name: 'Stretch Forming', 
//           icon: '/sheet_metal_icon-removebg-preview.png', 
//           path: '/home/sheet-metal/welding',
//           backgroundImage: '/stretch-forming-image.jpg',
//           description: 'Advanced stretch forming processes'
//         }
//       ]
//     }
//   ];

//   // Filter modules based on user role
//   const getFilteredModules = () => {
//     if (userRole === 'admin') {
//       return allModules;
//     } else {
//       return allModules.filter(module => 
//         module.roleKeys.includes(userRole)
//       );
//     }
//   };

//   // Function to check if user has access to a specific path
//   const hasAccessToPath = (path) => {
//     if (userRole === 'admin') return true;
    
//     const rolePathAccess = {
//       'Machining Module': [
//         '/home/machine/milling',
//         '/home/machine/grinding'
//       ],
//       'Composite Module': [
//         '/home/composites/layup',
//         '/home/composites/curing'
//       ],
//       'Sheet Metal Module': [
//         '/home/sheet-metal/bending',
//         '/home/sheet-metal/cutting',
//         '/home/sheet-metal/welding'
//       ]
//     };

//     const accessiblePaths = rolePathAccess[userRole] || [];
//     return accessiblePaths.includes(path);
//   };

//   const modules = getFilteredModules();

//   const handleModuleClick = (module) => {
//     console.log(`Selected module: ${module.name}`);
//     navigate(module.path);
//   };

//   const handleSubModuleClick = (subModule) => {
//     console.log(`Selected sub-module: ${subModule.name}`);
//     navigate(subModule.path);
//   };

//   const handleBackToModules = () => {
//     navigate('/home');
//   };

//   const handleAccessControl = () => {
//     console.log('Navigating to Access Control');
//     navigate('/home/access-control');
//   };

//   // Check if we're viewing sub-modules
//   const currentModule = modules.find(module => 
//     location.pathname.startsWith(module.path) && location.pathname !== '/home'
//   );

//   // Check if we're on Access Control page
//   if (location.pathname === '/home/access-control') {
//     // Import and render AccessControl component here
//     // You'll need to import the AccessControl component at the top of this file
//     return null; // This will be handled by your routing system
//   }





//   //'''''Machine configuration

// const handleMachineConfiguration = () => {
//   console.log('Navigating to Machine Configuration');
//   navigate('/home/machine-configuration');
// };

// // Check if we're on Machine Configuration page (add this after the Access Control check):
// if (location.pathname === '/home/machine-configuration') {
//   return null;
// }




//   // Main Modules View
//   if (location.pathname === '/home') {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <div className="flex items-center justify-center space-x-4 mb-4">
//             <div 
//               className="w-4 h-4 rounded-full animate-pulse"
//               style={{backgroundColor: '#246679'}}
//             />
//             <h1 
//               className="text-4xl font-bold tracking-wider"
//               style={{
//                 fontFamily: 'Times New Roman, serif',
//                 color: '#246679'
//               }}
//             >
//               MANUFACTURING MODULES
//             </h1>
//             <div className="ml-4">
//               <span 
//                 className="text-sm font-mono px-3 py-1 rounded-full"
//                 style={{
//                   backgroundColor: 'rgba(36, 102, 121, 0.2)',
//                   color: '#145da0'
//                 }}
//               >
//                 {userRole.toUpperCase()}
//               </span>
//             </div>
//             {/* Access Control Button - Only for Admin */}
//   {userRole === 'admin' && (
//   <div className="flex items-center space-x-2 ml-4">
//     {/* Access Control Button */}
//     <button
//       onClick={handleAccessControl}
//       className="flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
//       style={{
//         backgroundColor: '#246679',
//         color: 'white'
//       }}
//     >
//       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//         <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
//       </svg>
//       <span>Access Control</span>
//     </button>
    
//     {/* Machine Configuration Button */}
//     <button
//       onClick={handleMachineConfiguration}
//       className="flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
//       style={{
//         backgroundColor: '#246679',
//         color: 'white'
//       }}
//     >
//       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//         <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
//       </svg>
//       <span>Machine Config</span>
//     </button>
//   </div>
// )}
//           </div>
//           <p className="text-gray-600 text-lg">Select a manufacturing module to begin</p>
//         </div>

//         {/* Module Cards Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
//           {modules.map((module, index) => (
//             <div
//               key={index}
//               onClick={() => handleModuleClick(module)}
//               className="group relative overflow-hidden rounded-2xl shadow-2xl cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
//               style={{
//                 minHeight: '400px'
//               }}
//             >
//               {/* Background Image - Clearly visible */}
//               <div 
//                 className="absolute inset-0 bg-cover bg-center opacity-90 group-hover:opacity-95 transition-opacity duration-500"
//                 style={{
//                   backgroundImage: `url(${module.backgroundImage})`
//                 }}
//               />
              
//               {/* Gradient Overlay - Much lighter */}
//               <div 
//                 className="absolute inset-0 opacity-40 group-hover:opacity-30 transition-opacity duration-500"
//                 style={{
//                   background: `linear-gradient(135deg, rgba(36, 102, 121, 0.6), rgba(20, 93, 160, 0.6))`
//                 }}
//               />
              
//               {/* Card Content */}
//               <div className="relative z-10 p-8 h-full flex flex-col justify-between">
//                 {/* Module Icon */}
//                 <div className="flex justify-center mb-6">
//                   <div className="w-24 h-24 rounded-full bg-white bg-opacity-50 flex items-center justify-center shadow-2xl group-hover:bg-opacity-60 transition-all duration-500">
//                     <img 
//                       src={module.icon} 
//                       alt={module.name} 
//                       className="w-14 h-14 group-hover:scale-110 transition-transform duration-500"
//                     />
//                   </div>
//                 </div>

//                 {/* Module Title */}
//                 <div className="text-center mb-4">
//                   <h3 
//                     className="text-2xl font-bold text-white mb-2 group-hover:text-blue-100 transition-colors duration-300 drop-shadow-lg"
//                     style={{
//                       fontFamily: 'Times New Roman, serif'
//                     }}
//                   >
//                     {module.name}
//                   </h3>
//                   <p className="text-blue-100 text-sm leading-relaxed drop-shadow-md">
//                     {module.description}
//                   </p>
//                 </div>

//                 {/* Module Stats */}
//                 <div className="flex justify-between items-center text-blue-100 text-sm">
//                   <div className="flex items-center space-x-2">
//                     <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
//                     <span className="drop-shadow-md">Active</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <span className="drop-shadow-md">{module.subModules.length} Processes</span>
//                     <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Bottom Status */}
//         <div className="fixed bottom-6 left-6 right-6">
//           <div 
//             className="border rounded-xl p-4 mx-auto max-w-md"
//             style={{
//               backgroundColor: 'rgba(36, 102, 121, 0.1)',
//               borderColor: 'rgba(36, 102, 121, 0.3)'
//             }}
//           >
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <div 
//                   className="w-3 h-3 rounded-full animate-pulse"
//                   style={{backgroundColor: '#246679'}}
//                 />
//                 <span 
//                   className="text-sm font-mono font-bold"
//                   style={{color: '#73b6ca'}}
//                 >
//                   SYSTEM READY
//                 </span>
//               </div>
//               <span 
//                 className="text-sm font-mono font-bold"
//                 style={{color: '#246679'}}
//               >
//                 {modules.length} MODULES AVAILABLE
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Sub-modules View
//   if (currentModule && location.pathname === currentModule.path) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
//         {/* Header with Back Button */}
//         <div className="mb-8">
//           <button
//             onClick={handleBackToModules}
//             className="flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-100"
//             style={{color: '#246679'}}
//           >
//             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
//             </svg>
//             <span className="font-semibold">Back to Modules</span>
//           </button>

//           <div className="text-center">
//             <h1 
//               className="text-4xl font-bold tracking-wider mb-2"
//               style={{
//                 fontFamily: 'Times New Roman, serif',
//                 color: '#246679'
//               }}
//             >
//               {currentModule.name.toUpperCase()}
//             </h1>
//             <p className="text-gray-600 text-lg">Select a process to continue</p>
//           </div>
//         </div>

//         {/* Sub-module Cards Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
//           {currentModule.subModules
//             .filter(subModule => hasAccessToPath(subModule.path))
//             .map((subModule, index) => (
//             <div
//               key={index}
//               onClick={() => handleSubModuleClick(subModule)}
//               className="group relative overflow-hidden rounded-xl shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-105"
//               style={{
//                 minHeight: '300px'
//               }}
//             >
//               {/* Background Image - Clearly visible */}
//               <div 
//                 className="absolute inset-0 bg-cover bg-center opacity-90 group-hover:opacity-95 transition-opacity duration-300"
//                 style={{
//                   backgroundImage: `url(${subModule.backgroundImage})`
//                 }}
//               />
              
//               {/* Gradient Overlay - Much lighter */}
//               <div 
//                 className="absolute inset-0 opacity-40 group-hover:opacity-30 transition-opacity duration-300"
//                 style={{
//                   background: `linear-gradient(135deg, rgba(115, 182, 202, 0.5), rgba(36, 102, 121, 0.6))`
//                 }}
//               />
              
//               {/* Card Content */}
//               <div className="relative z-10 p-6 h-full flex flex-col justify-between">
//                 {/* Sub-module Icon */}
//                 <div className="flex justify-center mb-4">
//                   <div className="w-16 h-16 rounded-full bg-white bg-opacity-70 flex items-center justify-center shadow-lg group-hover:bg-opacity-80 transition-all duration-300">
//                     <img 
//                       src={subModule.icon} 
//                       alt={subModule.name} 
//                       className="w-20 h-20 group-hover:scale-110 transition-transform duration-300"
//                     />
//                   </div>
//                 </div>

//                 {/* Sub-module Title */}
//                 <div className="text-center mb-4">
//                   <h3 
//                     className="text-xl font-bold text-white mb-2 group-hover:text-blue-100 transition-colors duration-300 drop-shadow-lg"
//                     style={{
//                       fontFamily: 'Times New Roman, serif'
//                     }}
//                   >
//                     {subModule.name}
//                   </h3>
//                   <p className="text-blue-100 text-sm drop-shadow-md">
//                     {subModule.description}
//                   </p>
//                 </div>

//                 {/* Action Indicator */}
//                 <div className="flex justify-center">
//                   <div className="flex items-center space-x-2 text-blue-100 text-sm">
//                     <span className="drop-shadow-md">Start Process</span>
//                     <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // Default fallback
//   return null;
// };

// export default CardNavbar;









import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// import MachineConfiguration from './MachineConfiguration';


const CardNavbar = () => {
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Get user role from sessionStorage on component mount
  useEffect(() => {
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUserRole(parsedData.role);
      console.log('User role from session:', parsedData.role);
    }
  }, []);

  // Define all modules with proper role mapping
  const allModules = [
    { 
      name: 'Machining Module', 
      roleKeys: ['Machining Module'],
      icon: '/machining-icon-bgremoved.png',
      backgroundImage: './newmachining.jpg',
      color: '#145da0',
      description: 'Advanced machining processes including milling, turning, and precision operations',
      path: '/home/machine',
      subModules: [
        { 
          name: 'Milling Process', 
          icon: '/milling_bgremove.png', 
          path: '/home/machine/milling',
          backgroundImage: '/milling.jpg',
          description: 'Precision milling operations for complex geometries'
        },
        { 
          name: 'Turning Process', 
          icon: '/turn-icon.png', 
          path: '/home/machine/grinding',
          backgroundImage: '/turning.jpg',
          description: 'High-precision turning and lathe operations'
        }
      ]
    },
 
    // { 
    //   name: 'Sheet Metal Module', 
    //   roleKeys: ['Sheet Metal Module'],
    //   icon: '/sheet-icon1.png',
    //   backgroundImage: '/sheet-metal-image.jpg',
    //   color: '#145da0',
    //   description: 'Comprehensive sheet metal forming and fabrication',
    //   path: '/home/sheet-metal',
    //   subModules: [
    //     { 
    //       name: 'Press Brake Forming', 
    //       icon: '/pressbrake-icon.png', 
    //       path: '/home/sheet-metal/bending',
    //       backgroundImage: '/press-brake-forming-image.jpg',
    //       description: 'Precision press brake forming operations'
    //     },
    //     { 
    //       name: 'Rubber Pad Press', 
    //       icon: '/rub_image.png', 
    //       path: '/home/sheet-metal/cutting',
    //       backgroundImage: '/rubber-pad-process.jpg',
    //       description: 'Rubber pad press forming technology'
    //     },
    //     { 
    //       name: 'Stretch Forming', 
    //       icon: '/sheet_metal_icon-removebg-preview.png', 
    //       path: '/home/sheet-metal/welding',
    //       backgroundImage: '/stretch-forming-image.jpg',
    //       description: 'Advanced stretch forming processes'
    //     }
    //   ]
    // },

    { 
  name: 'Sheet Metal Module', 
  roleKeys: ['Sheet Metal Module'],
  icon: '/sheet-icon1.png',
  backgroundImage: '/sheet-metal-image.jpg',
  color: '#145da0',
  description: 'Comprehensive sheet metal forming and fabrication',
  path: '/home/sheet-metal',
  subModules: [
    { 
      name: 'Sheet Metal Analysis', 
      icon: '/sheet-icon1.png', 
      path: '/home/sheet-metal/upload',
      backgroundImage: '/sheet-metal-image.jpg',
      description: 'Upload STEP files for 3D analysis and cost estimation'
    }
  ]
},
       { 
      name: 'Composites Module', 
      roleKeys: ['Composite Module'],
      icon: '/composites-icon1.png',
      backgroundImage: '/composite_new_image.jpg',
      color: '#145da0',
      description: 'Advanced composite materials processing and manufacturing',
      path: '/home/composites',
      subModules: [
                { 
          name: 'Composite Process', 
          icon: '/composites-icon1.png', 
          path: '/home/composites/layup',
          backgroundImage: '/composite_new_image.jpg',
          description: 'Upload STEP files for 3D analysis and cost estimation'
        },

      ]
    },
  ];

  // Filter modules based on user role
  const getFilteredModules = () => {
    if (userRole === 'admin') {
      return allModules;
    } else {
      return allModules.filter(module => 
        module.roleKeys.includes(userRole)
      );
    }
  };

  // Function to check if user has access to a specific path
  const hasAccessToPath = (path) => {
    if (userRole === 'admin') return true;
    
    const rolePathAccess = {
      'Machining Module': [
        '/home/machine/milling',
        '/home/machine/grinding'
      ],
    
      'Sheet Metal Module': [
        '/home/sheet-metal/upload', 
        '/home/sheet-metal/bending',
        '/home/sheet-metal/cutting',
        '/home/sheet-metal/welding'
      ],
        'Composite Module': [
        '/home/composites/layup',
        '/home/composites/curing'
      ],
    };

    const accessiblePaths = rolePathAccess[userRole] || [];
    return accessiblePaths.includes(path);
  };

  const modules = getFilteredModules();

  const handleModuleClick = (module) => {
    console.log(`Selected module: ${module.name}`);
    navigate(module.path);
  };

  const handleSubModuleClick = (subModule) => {
    console.log(`Selected sub-module: ${subModule.name}`);
    navigate(subModule.path);
  };

  const handleBackToModules = () => {
    navigate('/home');
  };

  const handleAccessControl = () => {
    console.log('Navigating to Access Control');
    navigate('/home/access-control');
  };

  // Machine configuration handler
  const handleMachineConfiguration = () => {
    console.log('Navigating to Machine Configuration');
    navigate('/home/machine-configuration');
  };
  

  // Check if we're viewing sub-modules
  const currentModule = modules.find(module => 
    location.pathname.startsWith(module.path) && location.pathname !== '/home'
  );

  // Check if we're on Access Control page
  if (location.pathname === '/home/access-control') {
    return null; // This will be handled by your routing system
  }

  // Check if we're on Machine Configuration page
  if (location.pathname === '/home/machine-configuration') {
    return null;
  }

  // Main Modules View
  if (location.pathname === '/home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div 
              className="w-4 h-4 rounded-full animate-pulse"
              style={{backgroundColor: '#246679'}}
            />
            <h1 
              className="text-4xl font-bold tracking-wider"
              style={{
                fontFamily: 'Times New Roman, serif',
                color: '#246679'
              }}
            >
              MANUFACTURING MODULES
            </h1>
            <div className="ml-4">
              <span 
                className="text-sm font-mono px-3 py-1 rounded-full"
                style={{
                  backgroundColor: 'rgba(36, 102, 121, 0.2)',
                  color: '#145da0'
                }}
              >
                {userRole.toUpperCase()}
              </span>
            </div>
            
            {/* Configuration Buttons */}
            <div className="flex items-center space-x-2 ml-4">
              {/* Access Control Button - Only for Admin */}
              {userRole === 'admin' && (
                <button
                  onClick={handleAccessControl}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                  style={{
                    backgroundColor: '#246679',
                    color: 'white'
                  }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Access Control</span>
                </button>
              )}
              
              {/* Machine Configuration Button - For All Users */}
              <button
                onClick={handleMachineConfiguration}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                style={{
                  backgroundColor: '#246679',
                  color: 'white'
                }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                <span>Machine Config</span>
              </button>
            </div>
          </div>
          {/* <p className="text-gray-600 text-lg">Select a manufacturing module to begin</p> */}
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {modules.map((module, index) => (
            <div
              key={index}
              onClick={() => handleModuleClick(module)}
              className="group relative overflow-hidden rounded-2xl shadow-2xl cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              style={{
                minHeight: '400px'
              }}
            >
              {/* Background Image - Clearly visible */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-90 group-hover:opacity-95 transition-opacity duration-500"
                style={{
                  backgroundImage: `url(${module.backgroundImage})`
                }}
              />
              
              {/* Gradient Overlay - Much lighter */}
              <div 
                className="absolute inset-0 opacity-40 group-hover:opacity-30 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, rgba(36, 102, 121, 0.6), rgba(20, 93, 160, 0.6))`
                }}
              />
              
              {/* Card Content */}
              <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                {/* Module Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-white bg-opacity-50 flex items-center justify-center shadow-2xl group-hover:bg-opacity-60 transition-all duration-500">
                    <img 
                      src={module.icon} 
                      alt={module.name} 
                      className="w-14 h-14 group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Module Title */}
                <div className="text-center mb-4">
                  <h3 
                    className="text-2xl font-bold text-white mb-2 group-hover:text-blue-100 transition-colors duration-300 drop-shadow-lg"
                    style={{
                      fontFamily: 'Times New Roman, serif'
                    }}
                  >
                    {module.name}
                  </h3>
                  <p className="text-blue-100 text-sm leading-relaxed drop-shadow-md">
                    {module.description}
                  </p>
                </div>

                {/* Module Stats */}
                <div className="flex justify-between items-center text-blue-100 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="drop-shadow-md">Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="drop-shadow-md">{module.subModules.length} Processes</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Status */}
      {/* Bottom Status */}
<div className="fixed bottom-6 left-6 right-6">
  <div 
    className="border rounded-xl p-4 mx-auto max-w-md"
    style={{
      backgroundColor: 'rgba(36, 102, 121, 0.1)',
      borderColor: 'rgba(36, 102, 121, 0.3)'
    }}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div 
          className="w-3 h-3 rounded-full animate-pulse"
          style={{backgroundColor: '#246679'}}
        />
        <span 
          className="text-sm font-mono font-bold"
          style={{color: '#73b6ca'}}
        >
          SYSTEM READY
        </span>
      </div>
      <span 
        className="text-sm font-mono font-bold"
        style={{color: '#246679'}}
      >
        {modules.length} {modules.length === 1 ? 'MODULE' : 'MODULES'} AVAILABLE
      </span>
    </div>
  </div>
</div>
      </div>
    );
  }

  // Sub-modules View
  if (currentModule && location.pathname === currentModule.path) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        {/* Header with Back Button */}
        <div className="mb-8">
          <button
            onClick={handleBackToModules}
            className="flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-100"
            style={{color: '#246679'}}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">Back to Modules</span>
          </button>

          <div className="text-center">
            <h1 
              className="text-4xl font-bold tracking-wider mb-2"
              style={{
                fontFamily: 'Times New Roman, serif',
                color: '#246679'
              }}
            >
              {currentModule.name.toUpperCase()}
            </h1>
            <p className="text-gray-600 text-lg">Select a process to continue</p>
          </div>
        </div>

        {/* Sub-module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {currentModule.subModules
            .filter(subModule => hasAccessToPath(subModule.path))
            .map((subModule, index) => (
            <div
              key={index}
              onClick={() => handleSubModuleClick(subModule)}
              className="group relative overflow-hidden rounded-xl shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-105"
              style={{
                minHeight: '300px'
              }}
            >
              {/* Background Image - Clearly visible */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-90 group-hover:opacity-95 transition-opacity duration-300"
                style={{
                  backgroundImage: `url(${subModule.backgroundImage})`
                }}
              />
              
              {/* Gradient Overlay - Much lighter */}
              <div 
                className="absolute inset-0 opacity-40 group-hover:opacity-30 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, rgba(115, 182, 202, 0.5), rgba(36, 102, 121, 0.6))`
                }}
              />
              
              {/* Card Content */}
              <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                {/* Sub-module Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-white bg-opacity-70 flex items-center justify-center shadow-lg group-hover:bg-opacity-80 transition-all duration-300">
                    <img 
                      src={subModule.icon} 
                      alt={subModule.name} 
                      className="w-20 h-20 group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Sub-module Title */}
                <div className="text-center mb-4">
                  <h3 
                    className="text-xl font-bold text-white mb-2 group-hover:text-blue-100 transition-colors duration-300 drop-shadow-lg"
                    style={{
                      fontFamily: 'Times New Roman, serif'
                    }}
                  >
                    {subModule.name}
                  </h3>
                  <p className="text-blue-100 text-sm drop-shadow-md">
                    {subModule.description}
                  </p>
                </div>

                {/* Action Indicator */}
                <div className="flex justify-center">
                  <div className="flex items-center space-x-2 text-blue-100 text-sm">
                    <span className="drop-shadow-md">Start Process</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default fallback
  return null;
};

export default CardNavbar;

