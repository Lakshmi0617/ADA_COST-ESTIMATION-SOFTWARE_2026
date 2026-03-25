// import React, { useState } from 'react';

// const Navbar = () => {
//   const [isManufacturingOpen, setIsManufacturingOpen] = useState(false);
//   const [activeModule, setActiveModule] = useState('');

//   const toggleManufacturing = () => {
//     setIsManufacturingOpen(!isManufacturingOpen);
//   };

//   const handleModuleClick = (module) => {
//     setActiveModule(module);
//     console.log(`Selected module: ${module}`);
//   };

//   const modules = [
//     { name: 'Machining Module', icon: '⚙️', color: 'from-blue-500 to-cyan-500' },
//     { name: 'Composites Module', icon: '🔧', color: 'from-green-500 to-teal-500' },
//     { name: 'Sheet Metal Module', icon: '📐', color: 'from-purple-500 to-pink-500' }
//   ];

//   return (
//     <div className="fixed left-0 top-30 h-full bg-gradient-to-b from-slate-900 via-gray-900 to-slate-800 shadow-2xl border-r-4 border-cyan-400 z-40">
//       <div className="w-80 h-full overflow-y-auto">
//         {/* Navbar Header */}
//         <div className="p-4 border-b border-cyan-400/30 bg-gray-800/50">
//           <div className="flex items-center space-x-2">
//             <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//             <span className="text-cyan-400 font-mono text-sm tracking-wider">PROJECT TREE</span>
//           </div>
//         </div>

//         {/* Manufacturing Root Directory */}
//         <div className="p-3">
//           <div
//             onClick={toggleManufacturing}
//             className="flex items-center p-2 rounded-md bg-gray-800/50 hover:bg-gray-700/70 border border-cyan-400/20 hover:border-cyan-400/50 cursor-pointer transition-all duration-300 group"
//           >
//             <div className="flex items-center space-x-2 w-full">
//               {/* Expand/Collapse Icon */}
//               <div className={`text-cyan-400 transition-transform duration-300 ${
//                 isManufacturingOpen ? 'rotate-90' : 'rotate-0'
//               }`}>
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
//               <div className="w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-sm flex items-center justify-center shadow-sm">
//                 <span className="text-white text-xs">📁</span>
//               </div>
              
//               {/* Directory Name */}
//               <span 
//                 className="text-gray-200 font-bold tracking-wide group-hover:text-cyan-300 transition-colors duration-300 text-sm"
//                 style={{fontFamily: 'Times New Roman, serif'}}
//               >
//                 Manufacturing
//               </span>
//             </div>
//           </div>

//           {/* Sub-directories with Tree Lines */}
//           <div className={`overflow-hidden transition-all duration-500 ${
//             isManufacturingOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
//           }`}>
//             <div className="ml-4 mt-1 relative">
//               {/* Vertical Tree Line */}
//               <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-600"></div>
              
//               {modules.map((module, index) => (
//                 <div key={index} className="relative flex items-center">
//                   {/* Horizontal Tree Line */}
//                   <div className="absolute left-2 w-4 h-px bg-gray-600" style={{top: '50%'}}></div>
//                   {/* Corner for last item */}
//                   {index === modules.length - 1 && (
//                     <div className="absolute left-2 w-px bg-gray-600" style={{top: '50%', height: '50%', background: 'transparent'}}></div>
//                   )}
                  
//                   <div
//                     onClick={() => handleModuleClick(module.name)}
//                     className={`flex items-center space-x-2 p-2 ml-6 rounded-md cursor-pointer transition-all duration-300 border w-full ${
//                       activeModule === module.name
//                         ? 'bg-cyan-400/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-400/20'
//                         : 'bg-gray-800/30 hover:bg-gray-700/50 border-gray-600/30 hover:border-cyan-400/30 text-gray-300 hover:text-cyan-300'
//                     }`}
//                   >
//                     {/* Module Icon */}
//                     <div className={`w-5 h-5 bg-gradient-to-br ${module.color} rounded-sm flex items-center justify-center shadow-sm`}>
//                       <span className="text-white text-xs">{module.icon}</span>
//                     </div>
                    
//                     {/* Module Name */}
//                     <span 
//                       className="text-xs font-semibold tracking-wide"
//                       style={{fontFamily: 'Times New Roman, serif'}}
//                     >
//                       {module.name}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Bottom Status */}
//         <div className="absolute bottom-4 left-4 right-4">
//           <div className="bg-gray-800/80 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-3">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                 <span className="text-xs text-gray-400 font-mono">READY</span>
//               </div>
//               <span className="text-xs text-cyan-400 font-mono">3 MODULES</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;


// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

// const Navbar = () => {
//   const [isManufacturingOpen, setIsManufacturingOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const toggleManufacturing = () => {
//     setIsManufacturingOpen(!isManufacturingOpen);
//   };

//   const handleModuleClick = (module) => {
//     console.log(`Selected module: ${module}`);
    
//     // Navigate to the appropriate route based on module
//     switch (module) {
//       case 'Machining Module':
//         navigate('/home/machine');
//         break;
//       case 'Composites Module':
//         navigate('/home/composites');
//         break;
//       case 'Sheet Metal Module':
//         navigate('/home/sheet-metal');
//         break;
//       default:
//         break;
//     }
//   };

//   const modules = [
//     { name: 'Machining Module', icon: '⚙️', color: 'from-blue-500 to-cyan-500', path: '/home/machine' },
//     { name: 'Composites Module', icon: '🔧', color: 'from-green-500 to-teal-500', path: '/home/composites' },
//     { name: 'Sheet Metal Module', icon: '📐', color: 'from-purple-500 to-pink-500', path: '/home/sheet-metal' }
//   ];

//   return (
//     <div className="absolute left-0 top-30 h-full bg-gradient-to-b from-slate-900 via-gray-900 to-slate-800 shadow-2xl border-r-4 border-cyan-400 z-40">
//       <div className="w-80 h-full overflow-y-auto">
//         {/* Navbar Header */}
//         <div className="p-4 border-b border-cyan-400/30 bg-gray-800/50">
//           <div className="flex items-center space-x-2">
//             <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//             <span className="text-cyan-400 font-mono text-sm tracking-wider">PROJECT TREE</span>
//           </div>
//         </div>

//         {/* Manufacturing Root Directory */}
//         <div className="p-3">
//           <div
//             onClick={toggleManufacturing}
//             className="flex items-center p-2 rounded-md bg-gray-800/50 hover:bg-gray-700/70 border border-cyan-400/20 hover:border-cyan-400/50 cursor-pointer transition-all duration-300 group"
//           >
//             <div className="flex items-center space-x-2 w-full">
//               {/* Expand/Collapse Icon */}
//               <div className={`text-cyan-400 transition-transform duration-300 ${
//                 isManufacturingOpen ? 'rotate-90' : 'rotate-0'
//               }`}>
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
//               <div className="w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-sm flex items-center justify-center shadow-sm">
//                 <span className="text-white text-xs">📁</span>
//               </div>
              
//               {/* Directory Name */}
//               <span 
//                 className="text-gray-200 font-bold tracking-wide group-hover:text-cyan-300 transition-colors duration-300 text-sm"
//                 style={{fontFamily: 'Times New Roman, serif'}}
//               >
//                 Manufacturing
//               </span>
//             </div>
//           </div>

//           {/* Sub-directories with Tree Lines */}
//           <div className={`overflow-hidden transition-all duration-500 ${
//             isManufacturingOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
//           }`}>
//             <div className="ml-4 mt-1 relative">
//               {/* Vertical Tree Line */}
//               <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-600"></div>
              
//               {modules.map((module, index) => (
//                 <div key={index} className="relative flex items-center">
//                   {/* Horizontal Tree Line */}
//                   <div className="absolute left-2 w-4 h-px bg-gray-600" style={{top: '50%'}}></div>
//                   {/* Corner for last item */}
//                   {index === modules.length - 1 && (
//                     <div className="absolute left-2 w-px bg-gray-600" style={{top: '50%', height: '50%', background: 'transparent'}}></div>
//                   )}
                  
//                   <div
//                     onClick={() => handleModuleClick(module.name)}
//                     className={`flex items-center space-x-2 p-2 ml-6 rounded-md cursor-pointer transition-all duration-300 border w-full ${
//                       location.pathname === module.path
//                         ? 'bg-cyan-400/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-400/20'
//                         : 'bg-gray-800/30 hover:bg-gray-700/50 border-gray-600/30 hover:border-cyan-400/30 text-gray-300 hover:text-cyan-300'
//                     }`}
//                   >
//                     {/* Module Icon */}
//                     <div className={`w-5 h-5 bg-gradient-to-br ${module.color} rounded-sm flex items-center justify-center shadow-sm`}>
//                       <span className="text-white text-xs">{module.icon}</span>
//                     </div>
                    
//                     {/* Module Name */}
//                     <span 
//                       className="text-xs font-semibold tracking-wide"
//                       style={{fontFamily: 'Times New Roman, serif'}}
//                     >
//                       {module.name}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Bottom Status */}
//         <div className="absolute bottom-4 left-4 right-4">
//           <div className="bg-gray-800/80 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-3">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                 <span className="text-xs text-gray-400 font-mono">READY</span>
//               </div>
//               <span className="text-xs text-cyan-400 font-mono">3 MODULES</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;





// ''''''''''correct code''''''''''''''''//
// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

// const Navbar = () => {
//   const [isManufacturingOpen, setIsManufacturingOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const toggleManufacturing = () => {
//     setIsManufacturingOpen(!isManufacturingOpen);
    
//     // Navigate to a default route when Manufacturing folder is clicked
//     // This will hide any currently displayed module component
//     navigate('/home'); // or '/home/manufacturing' or whatever default route you want
//   };

//   const handleModuleClick = (module) => {
//     console.log(`Selected module: ${module}`);
    
//     // Navigate to the appropriate route based on module
//     switch (module) {
//       case 'Machining Module':
//         navigate('/home/machine');
//         break;
//       case 'Composites Module':
//         navigate('/home/composites');
//         break;
//       case 'Sheet Metal Module':
//         navigate('/home/sheet-metal');
//         break;
//       default:
//         break;
//     }
//   };

//   const modules = [
//     { name: 'Machining Module', icon: '⚙️', color: 'from-blue-500 to-cyan-500', path: '/home/machine' },
//     { name: 'Composites Module', icon: '🔧', color: 'from-green-500 to-teal-500', path: '/home/composites' },
//     { name: 'Sheet Metal Module', icon: '📐', color: 'from-purple-500 to-pink-500', path: '/home/sheet-metal' }
//   ];

//   return (
//     <div className="absolute left-0 top-30 h-full bg-gradient-to-b from-slate-900 via-gray-900 to-slate-800 shadow-2xl border-r-4 border-cyan-400 z-40">
//       <div className="w-80 h-full overflow-y-auto">
//         {/* Navbar Header */}
//         <div className="p-4 border-b border-cyan-400/30 bg-gray-800/50">
//           <div className="flex items-center space-x-2">
//             <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//             <span className="text-cyan-400 font-mono text-sm tracking-wider">PROJECT TREE</span>
//           </div>
//         </div>

//         {/* Manufacturing Root Directory */}
//         <div className="p-3">
//           <div
//             onClick={toggleManufacturing}
//             className={`flex items-center p-2 rounded-md cursor-pointer transition-all duration-300 group border ${
//               location.pathname === '/home' 
//                 ? 'bg-cyan-400/20 border-cyan-400 shadow-lg shadow-cyan-400/20'
//                 : 'bg-gray-800/50 hover:bg-gray-700/70 border-cyan-400/20 hover:border-cyan-400/50'
//             }`}
//           >
//             <div className="flex items-center space-x-2 w-full">
//               {/* Expand/Collapse Icon */}
//               <div className={`text-cyan-400 transition-transform duration-300 ${
//                 isManufacturingOpen ? 'rotate-90' : 'rotate-0'
//               }`}>
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
//               <div className="w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-sm flex items-center justify-center shadow-sm">
//                 <span className="text-white text-xs">📁</span>
//               </div>
              
//               {/* Directory Name */}
//               <span 
//                 className={`font-bold tracking-wide group-hover:text-cyan-300 transition-colors duration-300 text-sm ${
//                   location.pathname === '/home' ? 'text-cyan-300' : 'text-gray-200'
//                 }`}
//                 style={{fontFamily: 'Times New Roman, serif'}}
//               >
//                 Manufacturing
//               </span>
//             </div>
//           </div>

//           {/* Sub-directories with Tree Lines */}
//           <div className={`overflow-hidden transition-all duration-500 ${
//             isManufacturingOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
//           }`}>
//             <div className="ml-4 mt-1 relative">
//               {/* Vertical Tree Line */}
//               <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-600"></div>
              
//               {modules.map((module, index) => (
//                 <div key={index} className="relative flex items-center">
//                   {/* Horizontal Tree Line */}
//                   <div className="absolute left-2 w-4 h-px bg-gray-600" style={{top: '50%'}}></div>
//                   {/* Corner for last item */}
//                   {index === modules.length - 1 && (
//                     <div className="absolute left-2 w-px bg-gray-600" style={{top: '50%', height: '50%', background: 'transparent'}}></div>
//                   )}
                  
//                   <div
//                     onClick={() => handleModuleClick(module.name)}
//                     className={`flex items-center space-x-2 p-2 ml-6 rounded-md cursor-pointer transition-all duration-300 border w-full ${
//                       location.pathname === module.path
//                         ? 'bg-cyan-400/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-400/20'
//                         : 'bg-gray-800/30 hover:bg-gray-700/50 border-gray-600/30 hover:border-cyan-400/30 text-gray-300 hover:text-cyan-300'
//                     }`}
//                   >
//                     {/* Module Icon */}
//                     <div className={`w-5 h-5 bg-gradient-to-br ${module.color} rounded-sm flex items-center justify-center shadow-sm`}>
//                       <span className="text-white text-xs">{module.icon}</span>
//                     </div>
                    
//                     {/* Module Name */}
//                     <span 
//                       className="text-xs font-semibold tracking-wide"
//                       style={{fontFamily: 'Times New Roman, serif'}}
//                     >
//                       {module.name}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Bottom Status */}
//         <div className="absolute bottom-4 left-4 right-4">
//           <div className="bg-gray-800/80 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-3">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                 <span className="text-xs text-gray-400 font-mono">READY</span>
//               </div>
//               <span className="text-xs text-cyan-400 font-mono">3 MODULES</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;




// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';


// const Navbar = () => {
//   const [isManufacturingOpen, setIsManufacturingOpen] = useState(false);
//   const [openModules, setOpenModules] = useState({});
//   const navigate = useNavigate();
//   const location = useLocation();

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

//   const modules = [
//     { 
//       name: 'Machining Module', 
//       icon: '⚙️', 
//       color: 'from-blue-500 to-cyan-500',
//       subModules: [
//         { name: 'Milling Process', icon: '🔧', path: '/home/machine/milling' },
//         { name: 'Grinding Process', icon: '⚡', path: '/home/machine/grinding' },
//         { name: 'Contour Process', icon: '📐', path: '/home/machine/contour' },
//         { name: 'Drilling Process', icon: '🔩', path: '/home/machine/drilling' }
//       ]
//     },
//     { 
//       name: 'Composites Module', 
//       icon: '🔧', 
//       color: 'from-green-500 to-teal-500',
//       subModules: [
//         { name: 'Layup Process', icon: '📄', path: '/home/composites/layup' },
//         { name: 'Curing Process', icon: '🔥', path: '/home/composites/curing' },
//         { name: 'Trimming Process', icon: '✂️', path: '/home/composites/trimming' }
//       ]
//     },
//     { 
//       name: 'Sheet Metal Module', 
//       icon: '📐', 
//       color: 'from-purple-500 to-pink-500',
//       subModules: [
//         { name: 'Bending Process', icon: '↩️', path: '/home/sheet-metal/bending' },
//         { name: 'Cutting Process', icon: '✂️', path: '/home/sheet-metal/cutting' },
//         { name: 'Welding Process', icon: '🔥', path: '/home/sheet-metal/welding' }
//       ]
//     }
//   ];

//   return (
//     <div className="absolute left-0 top-30 h-full bg-gradient-to-b from-slate-900 via-gray-900 to-slate-800 shadow-2xl border-r-4 border-cyan-400 z-40">
//       <div className="w-80 h-full overflow-y-auto">
//         {/* Navbar Header */}
//          {/* Back Arrow Button */}

//         <div className="p-4 border-b border-cyan-400/30 bg-gray-800/50">
//           <div className="flex items-center space-x-2">
//             <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//             <span className="text-cyan-400 font-mono text-sm tracking-wider">PROJECT TREE</span>
//           </div>
//         </div>

//         {/* Manufacturing Root Directory */}
//         <div className="p-3">
//           <div
//             onClick={toggleManufacturing}
//             className={`flex items-center p-2 rounded-md cursor-pointer transition-all duration-300 group border ${
//               location.pathname === '/home' 
//                 ? 'bg-cyan-400/20 border-cyan-400 shadow-lg shadow-cyan-400/20'
//                 : 'bg-gray-800/50 hover:bg-gray-700/70 border-cyan-400/20 hover:border-cyan-400/50'
//             }`}
//           >
//             <div className="flex items-center space-x-2 w-full">
//               {/* Expand/Collapse Icon */}
//               <div className={`text-cyan-400 transition-transform duration-300 ${
//                 isManufacturingOpen ? 'rotate-90' : 'rotate-0'
//               }`}>
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
//               <div className="w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-sm flex items-center justify-center shadow-sm">
//                 <span className="text-white text-xs">📁</span>
//               </div>
              
//               {/* Directory Name */}
//               <span 
//                 className={`font-bold tracking-wide group-hover:text-cyan-300 transition-colors duration-300 text-sm ${
//                   location.pathname === '/home' ? 'text-cyan-300' : 'text-gray-200'
//                 }`}
//                 style={{fontFamily: 'Times New Roman, serif'}}
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
//               <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-600"></div>
              
//               {modules.map((module, moduleIndex) => (
//                 <div key={moduleIndex} className="relative">
//                   {/* Horizontal Tree Line for Main Module */}
//                   <div className="absolute left-2 w-4 h-px bg-gray-600" style={{top: '1.5rem'}}></div>
                  
//                   {/* Main Module */}
//                   <div
//                     onClick={() => toggleModule(module.name)}
//                     className={`flex items-center space-x-2 p-2 ml-6 rounded-md cursor-pointer transition-all duration-300 border ${
//                       openModules[module.name]
//                         ? 'bg-cyan-400/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-400/20'
//                         : 'bg-gray-800/30 hover:bg-gray-700/50 border-gray-600/30 hover:border-cyan-400/30 text-gray-300 hover:text-cyan-300'
//                     }`}
//                   >
//                     {/* Expand/Collapse Icon for Module */}
//                     <div className={`text-cyan-400 transition-transform duration-300 ${
//                       openModules[module.name] ? 'rotate-90' : 'rotate-0'
//                     }`}>
//                       <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                       </svg>
//                     </div>

//                     {/* Module Icon */}
//                     <div className={`w-5 h-5 bg-gradient-to-br ${module.color} rounded-sm flex items-center justify-center shadow-sm`}>
//                       <span className="text-white text-xs">{module.icon}</span>
//                     </div>
                    
//                     {/* Module Name */}
//                     <span 
//                       className="text-xs font-semibold tracking-wide"
//                       style={{fontFamily: 'Times New Roman, serif'}}
//                     >
//                       {module.name}
//                     </span>
//                   </div>

//                   {/* Sub-modules */}
//                   <div className={`overflow-hidden transition-all duration-500 ${
//                     openModules[module.name] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
//                   }`}>
//                     <div className="ml-8 mt-1 relative">
//                       {/* Vertical Tree Line for Sub-modules */}
//                       <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-500"></div>
                      
//                       {module.subModules.map((subModule, subIndex) => (
//                         <div key={subIndex} className="relative flex items-center">
//                           {/* Horizontal Tree Line for Sub-module */}
//                           <div className="absolute left-2 w-4 h-px bg-gray-500" style={{top: '50%'}}></div>
                          
//                           <div
//                             onClick={() => handleSubModuleClick(subModule)}
//                             className={`flex items-center space-x-2 p-2 ml-6 rounded-md cursor-pointer transition-all duration-300 border w-full ${
//                               location.pathname === subModule.path
//                                 ? 'bg-cyan-400/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-400/20'
//                                 : 'bg-gray-800/20 hover:bg-gray-700/40 border-gray-600/20 hover:border-cyan-400/20 text-gray-400 hover:text-cyan-300'
//                             }`}
//                           >
//                             {/* Sub-module Icon */}
//                             <div className="w-4 h-4 bg-gradient-to-br from-gray-600 to-gray-700 rounded-sm flex items-center justify-center shadow-sm">
//                               <span className="text-white text-xs">{subModule.icon}</span>
//                             </div>
                            
//                             {/* Sub-module Name */}
//                             <span 
//                               className="text-xs font-medium tracking-wide"
//                               style={{fontFamily: 'Times New Roman, serif'}}
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
//           <div className="bg-gray-800/80 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-3">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                 <span className="text-xs text-gray-400 font-mono">READY</span>
//               </div>
//               <span className="text-xs text-cyan-400 font-mono">3 MODULES</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;





// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

// const Navbar = () => {
//   const [isManufacturingOpen, setIsManufacturingOpen] = useState(false);
//   const [openModules, setOpenModules] = useState({});
//   const navigate = useNavigate();
//   const location = useLocation();

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

//   const modules = [
//     { 
//       name: 'Machining Module', 
//       icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/gear.png',
//       color: '#145da0',
//       subModules: [
//         { name: 'Milling Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/wrench.png', path: '/home/machine/milling' },
//         { name: 'Grinding Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/disc-sander.png', path: '/home/machine/grinding' },
//         { name: 'Contour Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/blueprint.png', path: '/home/machine/contour' },
//         { name: 'Drilling Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/drill.png', path: '/home/machine/drilling' }
//       ]
//     },
//     { 
//       name: 'Composites Module', 
//       icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/composite-material.png',
//       color: '#145da0',
//       subModules: [
//         { name: 'Layup Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/layers.png', path: '/home/composites/layup' },
//         { name: 'Curing Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/furnace.png', path: '/home/composites/curing' },
//         { name: 'Trimming Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/scissors.png', path: '/home/composites/trimming' }
//       ]
//     },
//     { 
//       name: 'Sheet Metal Module', 
//       icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/sheet-metal.png',
//       color: '#145da0',
//       subModules: [
//         { name: 'Bending Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/sheet-bending-machine.png', path: '/home/sheet-metal/bending' },
//         { name: 'Cutting Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/laser-cutting.png', path: '/home/sheet-metal/cutting' },
//         { name: 'Welding Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/welding.png', path: '/home/sheet-metal/welding' }
//       ]
//     }
//   ];

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
//                 className="font-bold tracking-wide group-hover:transition-colors duration-300 text-sm"
//                 style={{
//                   fontFamily: 'Times New Roman, serif',
//                   color: location.pathname === '/home' ? '#145da0' : '#246679'
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
//                       className="text-xs font-semibold tracking-wide"
//                       style={{fontFamily: 'Times New Roman, serif'}}
//                     >
//                       {module.name}
//                     </span>
//                   </div>

//                   {/* Sub-modules */}
//                   <div className={`overflow-hidden transition-all duration-500 ${
//                     openModules[module.name] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
//                   }`}>
//                     <div className="ml-8 mt-1 relative">
//                       {/* Vertical Tree Line for Sub-modules */}
//                       <div 
//                         className="absolute left-2 top-0 bottom-0 w-px"
//                         style={{backgroundColor: '#73b6ca'}}
//                       ></div>
                      
//                       {module.subModules.map((subModule, subIndex) => (
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
//                               className="text-xs font-medium tracking-wide"
//                               style={{fontFamily: 'Times New Roman, serif'}}
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
//                 3 MODULES
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;





//'''''''corrected color combination blue and white combination code
// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

// const Navbar = () => {
//   const [isManufacturingOpen, setIsManufacturingOpen] = useState(false);
//   const [openModules, setOpenModules] = useState({});
//   const navigate = useNavigate();
//   const location = useLocation();

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

//   const modules = [
//     { 
//       name: 'Machining Module', 
//       icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/gear.png',
//       color: '#145da0',
//       subModules: [
//         { name: 'Milling Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/wrench.png', path: '/home/machine/milling' },
//         { name: 'Grinding Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/disc-sander.png', path: '/home/machine/grinding' },
//         { name: 'Contour Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/blueprint.png', path: '/home/machine/contour' },
//         { name: 'Drilling Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/drill.png', path: '/home/machine/drilling' }
//       ]
//     },
//     { 
//       name: 'Composites Module', 
//       icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/composite-material.png',
//       color: '#145da0',
//       subModules: [
//         { name: 'Layup Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/layers.png', path: '/home/composites/layup' },
//         { name: 'Curing Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/furnace.png', path: '/home/composites/curing' },
//         { name: 'Trimming Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/scissors.png', path: '/home/composites/trimming' }
//       ]
//     },
//     { 
//       name: 'Sheet Metal Module', 
//       icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/sheet-metal.png',
//       color: '#145da0',
//       subModules: [
//         { name: 'Bending Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/sheet-bending-machine.png', path: '/home/sheet-metal/bending' },
//         { name: 'Cutting Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/laser-cutting.png', path: '/home/sheet-metal/cutting' },
//         { name: 'Welding Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/welding.png', path: '/home/sheet-metal/welding' }
//       ]
//     }
//   ];

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
                    
//                     {/* Module Name - INCREASED FONT SIZE AND BOLDNESS */}
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

//                   {/* Sub-modules */}
//                   <div className={`overflow-hidden transition-all duration-500 ${
//                     openModules[module.name] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
//                   }`}>
//                     <div className="ml-8 mt-1 relative">
//                       {/* Vertical Tree Line for Sub-modules */}
//                       <div 
//                         className="absolute left-2 top-0 bottom-0 w-px"
//                         style={{backgroundColor: '#73b6ca'}}
//                       ></div>
                      
//                       {module.subModules.map((subModule, subIndex) => (
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
                            
//                             {/* Sub-module Name - INCREASED FONT SIZE AND BOLDNESS */}
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
//                 3 MODULES
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;










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

//   // Define all modules
//   const allModules = [
//     { 
//       name: 'Machining Module', 
//       roleKey: 'Machining Module',
//       icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/gear.png',
//       color: '#145da0',
//       subModules: [
//         { name: 'Milling Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/wrench.png', path: '/home/machine/milling' },
//         { name: 'Grinding Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/disc-sander.png', path: '/home/machine/grinding' },
//         { name: 'Contour Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/blueprint.png', path: '/home/machine/contour' },
//         { name: 'Drilling Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/drill.png', path: '/home/machine/drilling' }
//       ]
//     },
//     { 
//       name: 'Composites Module', 
//       roleKey: 'composite',
//       icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/composite-material.png',
//       color: '#145da0',
//       subModules: [
//         { name: 'Layup Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/layers.png', path: '/home/composites/layup' },
//         { name: 'Curing Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/furnace.png', path: '/home/composites/curing' },
//         { name: 'Trimming Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/scissors.png', path: '/home/composites/trimming' }
//       ]
//     },
//     { 
//       name: 'Sheet Metal Module', 
//       roleKey: 'sheet_metal',
//       icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/sheet-metal.png',
//       color: '#145da0',
//       subModules: [
//         { name: 'Bending Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/sheet-bending-machine.png', path: '/home/sheet-metal/bending' },
//         { name: 'Cutting Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/laser-cutting.png', path: '/home/sheet-metal/cutting' },
//         { name: 'Welding Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/welding.png', path: '/home/sheet-metal/welding' }
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
//       return allModules.filter(module => module.roleKey === userRole);
//     }
//   };

//   const modules = getFilteredModules();

//   // Get total module count for display
//   const getTotalModuleCount = () => {
//     return modules.length;
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
                    
//                     {/* Module Name - INCREASED FONT SIZE AND BOLDNESS */}
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

//                   {/* Sub-modules */}
//                   <div className={`overflow-hidden transition-all duration-500 ${
//                     openModules[module.name] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
//                   }`}>
//                     <div className="ml-8 mt-1 relative">
//                       {/* Vertical Tree Line for Sub-modules */}
//                       <div 
//                         className="absolute left-2 top-0 bottom-0 w-px"
//                         style={{backgroundColor: '#73b6ca'}}
//                       ></div>
                      
//                       {module.subModules.map((subModule, subIndex) => (
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
                            
//                             {/* Sub-module Name - INCREASED FONT SIZE AND BOLDNESS */}
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




//''''final correct code working for displayed modules based on the login role based '''''''''''//
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isManufacturingOpen, setIsManufacturingOpen] = useState(false);
  const [openModules, setOpenModules] = useState({});
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

  const toggleManufacturing = () => {
    setIsManufacturingOpen(!isManufacturingOpen);
    navigate('/home');
  };

  const toggleModule = (moduleName) => {
    setOpenModules(prev => ({
      ...prev,
      [moduleName]: !prev[moduleName]
    }));
  };

  const handleSubModuleClick = (subModule) => {
    console.log(`Selected sub-module: ${subModule.name}`);
    navigate(subModule.path);
  };

  // Define all modules with proper role mapping
  const allModules = [
    { 
      name: 'Machining Module', 
      roleKeys: ['Machining Module'], // Array to support multiple role names if needed
      icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/gear.png',
      color: '#145da0',
      subModules: [
        { name: 'Milling Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/wrench.png', path: '/home/machine/milling' },
        { name: 'Turning Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/disc-sander.png', path: '/home/machine/grinding' },
        // { name: 'Contour Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/blueprint.png', path: '/home/machine/contour' },
        // { name: 'Drilling Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/drill.png', path: '/home/machine/drilling' }
      ]
    },
    { 
      name: 'Composites Module', 
      roleKeys: ['Composite Module'],
      icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/composite-material.png',
      color: '#145da0',
      subModules: [
        { name: 'Layup Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/layers.png', path: '/home/composites/layup' },
        { name: 'Curing Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/furnace.png', path: '/home/composites/curing' },
        { name: 'Trimming Process', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/scissors.png', path: '/home/composites/trimming' }
      ]
    },
    { 
      name: 'Sheet Metal Module', 
      roleKeys: ['Sheet Metal Module'],
      icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/sheet-metal.png',
      color: '#145da0',
      subModules: [
        { name: 'Press Brake Forming ', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/sheet-bending-machine.png', path: '/home/sheet-metal/bending' },
        { name: 'Rubber Pad Press ', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/laser-cutting.png', path: '/home/sheet-metal/cutting' },
        { name: 'Stretch Forming', icon: 'https://img.icons8.com/ios-filled/50/d7f2f5/welding.png', path: '/home/sheet-metal/welding' }
      ]
    }
  ];

  // Filter modules based on user role
  const getFilteredModules = () => {
    if (userRole === 'admin') {
      // Admin can see all modules
      return allModules;
    } else {
      // Filter modules based on user's specific role
      return allModules.filter(module => 
        module.roleKeys.includes(userRole)
      );
    }
  };

  const modules = getFilteredModules();

  // Get total module count for display
  const getTotalModuleCount = () => {
    return modules.length;
  };

  // Function to check if user has access to a specific path
  const hasAccessToPath = (path) => {
    if (userRole === 'admin') return true;
    
    // Define role-based path access
    const rolePathAccess = {
      'Machining Module': [
        '/home/machine/milling',
        '/home/machine/grinding', 
        '/home/machine/contour',
        '/home/machine/drilling',
        '/home/grinding' // Direct grinding access
      ],
      'Composite Module': [
        '/home/composites/layup',
        '/home/composites/curing',
        '/home/composites/trimming'
      ],
      'Sheet Metal Module': [
        '/home/sheet-metal/bending',
        '/home/sheet-metal/cutting',
        '/home/sheet-metal/welding'
      ]
    };

    const accessiblePaths = rolePathAccess[userRole] || [];
    return accessiblePaths.includes(path);
  };

  return (
    <div 
      className="absolute left-0 top-30 h-full shadow-2xl border-r-4 z-40"
      style={{
        backgroundColor: '#FFFFFF',
        borderRightColor: '#246679'
      }}
    >
      <div className="w-80 h-full overflow-y-auto">
        {/* Navbar Header */}
        <div 
          className="p-4 border-b"
          style={{
            borderBottomColor: 'rgba(36, 102, 121, 0.3)',
            backgroundColor: 'rgba(36, 102, 121, 0.1)'
          }}
        >
          <div className="flex items-center space-x-2">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{backgroundColor: '#246679'}}
            ></div>
            <span 
              className="font-mono text-sm tracking-wider font-bold"
              style={{color: '#246679'}}
            >
              PROJECT TREE
            </span>
            {/* Display user role */}
            <div className="ml-auto">
              <span 
                className="text-xs font-mono px-2 py-1 rounded"
                style={{
                  backgroundColor: 'rgba(36, 102, 121, 0.2)',
                  color: '#145da0'
                }}
              >
                {userRole.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Manufacturing Root Directory */}
        <div className="p-3">
          <div
            onClick={toggleManufacturing}
            className="flex items-center p-2 rounded-md cursor-pointer transition-all duration-300 group border"
            style={{
              backgroundColor: location.pathname === '/home' ? 'rgba(36, 102, 121, 0.2)' : 'rgba(115, 182, 202, 0.1)',
              borderColor: location.pathname === '/home' ? '#246679' : 'rgba(36, 102, 121, 0.2)',
              boxShadow: location.pathname === '/home' ? '0 10px 15px -3px rgba(36, 102, 121, 0.2)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== '/home') {
                e.target.style.backgroundColor = 'rgba(115, 182, 202, 0.2)';
                e.target.style.borderColor = 'rgba(36, 102, 121, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== '/home') {
                e.target.style.backgroundColor = 'rgba(115, 182, 202, 0.1)';
                e.target.style.borderColor = 'rgba(36, 102, 121, 0.2)';
              }
            }}
          >
            <div className="flex items-center space-x-2 w-full">
              {/* Expand/Collapse Icon */}
              <div 
                className={`transition-transform duration-300 ${isManufacturingOpen ? 'rotate-90' : 'rotate-0'}`}
                style={{color: '#246679'}}
              >
                {isManufacturingOpen ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              
              {/* Folder Icon */}
              <div 
                className="w-5 h-5 rounded-sm flex items-center justify-center shadow-sm"
                style={{background: `linear-gradient(135deg, #246679, #145da0)`}}
              >
                <img 
                  src="https://img.icons8.com/ios-filled/50/d7f2f5/folder-invoices.png" 
                  alt="folder" 
                  className="w-3 h-3"
                />
              </div>
              
              {/* Directory Name */}
              <span 
                className="font-bold tracking-wide group-hover:transition-colors duration-300 text-lg"
                style={{
                  fontFamily: 'Times New Roman, serif',
                  color: location.pathname === '/home' ? '#145da0' : '#246679',
                  fontSize: '18px'
                }}
              >
                Manufacturing
              </span>
            </div>
          </div>

          {/* Main Modules with Sub-modules */}
          <div className={`overflow-hidden transition-all duration-500 ${
            isManufacturingOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="ml-4 mt-1 relative">
              {/* Vertical Tree Line */}
              <div 
                className="absolute left-2 top-0 bottom-0 w-px"
                style={{backgroundColor: '#73b6ca'}}
              ></div>
              
              {modules.map((module, moduleIndex) => (
                <div key={moduleIndex} className="relative">
                  {/* Horizontal Tree Line for Main Module */}
                  <div 
                    className="absolute left-2 w-4 h-px" 
                    style={{top: '1.5rem', backgroundColor: '#73b6ca'}}
                  ></div>
                  
                  {/* Main Module */}
                  <div
                    onClick={() => toggleModule(module.name)}
                    className="flex items-center space-x-2 p-2 ml-6 rounded-md cursor-pointer transition-all duration-300 border"
                    style={{
                      backgroundColor: openModules[module.name] ? 'rgba(36, 102, 121, 0.2)' : 'rgba(115, 182, 202, 0.1)',
                      borderColor: openModules[module.name] ? '#246679' : 'rgba(115, 182, 202, 0.3)',
                      color: openModules[module.name] ? '#145da0' : '#246679',
                      boxShadow: openModules[module.name] ? '0 10px 15px -3px rgba(36, 102, 121, 0.2)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!openModules[module.name]) {
                        e.target.style.backgroundColor = 'rgba(115, 182, 202, 0.2)';
                        e.target.style.borderColor = 'rgba(36, 102, 121, 0.3)';
                        e.target.style.color = '#145da0';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!openModules[module.name]) {
                        e.target.style.backgroundColor = 'rgba(115, 182, 202, 0.1)';
                        e.target.style.borderColor = 'rgba(115, 182, 202, 0.3)';
                        e.target.style.color = '#246679';
                      }
                    }}
                  >
                    {/* Expand/Collapse Icon for Module */}
                    <div 
                      className={`transition-transform duration-300 ${openModules[module.name] ? 'rotate-90' : 'rotate-0'}`}
                      style={{color: '#246679'}}
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>

                    {/* Module Icon */}
                    <div 
                      className="w-5 h-5 rounded-sm flex items-center justify-center shadow-sm"
                      style={{backgroundColor: module.color}}
                    >
                      <img 
                        src={module.icon} 
                        alt={module.name} 
                        className="w-3 h-3"
                      />
                    </div>
                    
                    {/* Module Name */}
                    <span 
                      className="font-black tracking-wide"
                      style={{
                        fontFamily: 'Times New Roman, serif',
                        fontSize: '16px'
                      }}
                    >
                      {module.name}
                    </span>
                  </div>

                  {/* Sub-modules - Only show accessible ones */}
                  <div className={`overflow-hidden transition-all duration-500 ${
                    openModules[module.name] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="ml-8 mt-1 relative">
                      {/* Vertical Tree Line for Sub-modules */}
                      <div 
                        className="absolute left-2 top-0 bottom-0 w-px"
                        style={{backgroundColor: '#73b6ca'}}
                      ></div>
                      
                      {module.subModules
                        .filter(subModule => hasAccessToPath(subModule.path)) // Filter based on access
                        .map((subModule, subIndex) => (
                        <div key={subIndex} className="relative flex items-center">
                          {/* Horizontal Tree Line for Sub-module */}
                          <div 
                            className="absolute left-2 w-4 h-px" 
                            style={{top: '50%', backgroundColor: '#73b6ca'}}
                          ></div>
                          
                          <div
                            onClick={() => handleSubModuleClick(subModule)}
                            className="flex items-center space-x-2 p-2 ml-6 rounded-md cursor-pointer transition-all duration-300 border w-full"
                            style={{
                              backgroundColor: location.pathname === subModule.path ? 'rgba(36, 102, 121, 0.2)' : 'rgba(115, 182, 202, 0.05)',
                              borderColor: location.pathname === subModule.path ? '#246679' : 'rgba(115, 182, 202, 0.2)',
                              color: location.pathname === subModule.path ? '#145da0' : '#246679',
                              boxShadow: location.pathname === subModule.path ? '0 10px 15px -3px rgba(36, 102, 121, 0.2)' : 'none'
                            }}
                            onMouseEnter={(e) => {
                              if (location.pathname !== subModule.path) {
                                e.target.style.backgroundColor = 'rgba(115, 182, 202, 0.15)';
                                e.target.style.borderColor = 'rgba(36, 102, 121, 0.2)';
                                e.target.style.color = '#145da0';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (location.pathname !== subModule.path) {
                                e.target.style.backgroundColor = 'rgba(115, 182, 202, 0.05)';
                                e.target.style.borderColor = 'rgba(115, 182, 202, 0.2)';
                                e.target.style.color = '#246679';
                              }
                            }}
                          >
                            {/* Sub-module Icon */}
                            <div 
                              className="w-4 h-4 rounded-sm flex items-center justify-center shadow-sm"
                              style={{background: `linear-gradient(135deg, #73b6ca, #246679)`}}
                            >
                              <img 
                                src={subModule.icon} 
                                alt={subModule.name} 
                                className="w-2.5 h-2.5"
                              />
                            </div>
                            
                            {/* Sub-module Name */}
                            <span 
                              className="font-bold tracking-wide"
                              style={{
                                fontFamily: 'Times New Roman, serif',
                                fontSize: '14px'
                              }}
                            >
                              {subModule.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="absolute bottom-4 left-4 right-4">
          <div 
            className="backdrop-blur-sm border rounded-lg p-3"
            style={{
              backgroundColor: 'rgba(36, 102, 121, 0.1)',
              borderColor: 'rgba(36, 102, 121, 0.3)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{backgroundColor: '#246679'}}
                ></div>
                <span 
                  className="text-xs font-mono font-bold"
                  style={{color: '#73b6ca'}}
                >
                  READY
                </span>
              </div>
              <span 
                className="text-xs font-mono font-bold"
                style={{color: '#246679'}}
              >
                {getTotalModuleCount()} MODULES
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;