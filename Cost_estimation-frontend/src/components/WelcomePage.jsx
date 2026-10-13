// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const WelcomePage = () => {
  // const navigate = useNavigate();

  // const handleNext = () => {
  //   navigate('/home');
  // };

//   return (
//     <div 
//       className="min-h-screen bg-cover bg-center bg-no-repeat relative"
//       style={{
//         backgroundImage: 'url(/background_image.jpg)',
//         backgroundAttachment: 'fixed'
//       }}
//     >
   
//       {/* Content */}
//       <div className="relative z-10 min-h-screen flex items-center justify-center">
//         <div className="text-center px-8 py-12">
//           {/* Logo */}
//           <div className="mb-8">
//             <div className="inline-block relative">
//               <div className="absolute inset-0 bg-cyan-400 rounded-full blur-lg opacity-30"></div>
//               <img 
//                 src="/ada_logo.png" 
//                 alt="ADA Logo" 
//                 className="relative h-32 w-32 mx-auto rounded-full border-4 border-cyan-400 shadow-2xl hover:shadow-cyan-400/50 transition-all duration-500"
//               />
//             </div>
//           </div>
          
          
//           {/* Welcome Text */}
//           <div className="mb-12">
//             <h1 
//               className="text-6xl font-black text-white"
//               style={{fontFamily: 'Times New Roman, serif'}}
//             >
//               WELCOME
//             </h1>
//             <div className="flex items-center justify-center mb-6">
//               <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent flex-1 max-w-md"></div>
//               <span className="text-white text-xl font-bold mx-6 tracking-widest" style={{fontFamily: 'Times New Roman, serif'}}>
//                 TO
//               </span>
//               <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent flex-1 max-w-md"></div>
//             </div>
//             <h2 
//               className="text-4xl font-black text-white"
//               style={{fontFamily: 'Times New Roman, serif'}}
//             >
//               COST ESTIMATION SOFTWARE
//             </h2>
//             <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
//               Professional cost estimation solution for engineering and construction projects. 
//               Get accurate, reliable estimates with our advanced calculation algorithms.
//             </p>
//           </div>
          
//           {/* Features Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
//             <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-6 hover:border-cyan-400 transition-all duration-300">
//               <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
//                 <span className="text-white text-xl font-bold">⚡</span>
//               </div>
//               <h3 className="text-cyan-400 font-bold text-lg mb-2">Fast Processing</h3>
//               <p className="text-gray-400 text-sm">Lightning-fast calculations and instant results</p>
//             </div>
            
//             <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-6 hover:border-cyan-400 transition-all duration-300">
//               <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
//                 <span className="text-white text-xl font-bold">📊</span>
//               </div>
//               <h3 className="text-cyan-400 font-bold text-lg mb-2">Accurate Analysis</h3>
//               <p className="text-gray-400 text-sm">Precise cost calculations with detailed breakdowns</p>
//             </div>
            
//             <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-6 hover:border-cyan-400 transition-all duration-300">
//               <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
//                 <span className="text-white text-xl font-bold">🔧</span>
//               </div>
//               <h3 className="text-cyan-400 font-bold text-lg mb-2">Professional Tools</h3>
//               <p className="text-gray-400 text-sm">Industry-standard tools for professional estimates</p>
//             </div>
//           </div>
          
//           {/* Next Button */}
//           <div className="flex justify-center">
//             <button
//               onClick={handleNext}
//               className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 border-2 border-cyan-400 hover:border-cyan-300"
//             >
//               <span className="relative z-10 flex items-center space-x-3">
//                 <span style={{fontFamily: 'Times New Roman, serif'}} className="tracking-wider">
//                   NEXT
//                 </span>
//                 <svg 
//                   className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" 
//                   fill="none" 
//                   stroke="currentColor" 
//                   viewBox="0 0 24 24"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                 </svg>
//               </span>
//               <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//             </button>
//           </div>
          
      
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WelcomePage;









//'''''''''''''''below is new code where added cmti logo '''''''''''''''''//

// import React from 'react';
// import { useNavigate } from 'react-router-dom';


// const WelcomePage = () => {

//     const navigate = useNavigate();

//    const handleNext = () => {
//     navigate('/home');
//   };

//   return (
//     <div 
//       className="min-h-screen bg-cover bg-center bg-no-repeat relative"
//       style={{
//         backgroundImage: 'url(/background_image.jpg)',
//         backgroundAttachment: 'fixed'
//       }}
//     >
//       {/* Dark overlay for better text readability */}
//       <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
//       {/* CMTI Logo - Top Right Corner */}
//       <div className="absolute top-4 right-4 z-20">
//         <div className="relative">
//           <div className="absolute inset-0 bg-cyan-400 rounded-lg blur-sm opacity-20"></div>
//           <img 
//             src="/logo.png" 
//             alt="CMTI Logo" 
//             className="relative h-24 w-32 rounded-lg border-2 border-cyan-400 shadow-lg hover:shadow-cyan-400/50 transition-all duration-300 object-contain"
//           />
//         </div>
//       </div>
   
//       {/* Content */}
//       <div className="relative z-10 min-h-screen flex items-center justify-center">
//         <div className="text-center px-8 py-12">
//           {/* Logo */}
//           <div className="mb-8">
//             <div className="inline-block relative">
//               <div className="absolute inset-0 bg-cyan-400 rounded-full blur-lg opacity-30"></div>
//               <img 
//                 src="/ADA_LOGO.jpg" 
//                 alt="ADA Logo" 
//                 className="relative h-32 w-32 mx-auto rounded-full border-4 border-cyan-400 shadow-2xl hover:shadow-cyan-400/50 transition-all duration-500"
//               />
//             </div>
//           </div>
          
          
//           {/* Welcome Text */}
//           <div className="mb-12">
//             <h1 
//               className="text-6xl font-black text-white"
//               style={{fontFamily: 'Times New Roman, serif'}}
//             >
//               WELCOME
//             </h1>
//             <div className="flex items-center justify-center mb-6">
//               <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent flex-1 max-w-md"></div>
//               <span className="text-white text-xl font-bold mx-6 tracking-widest" style={{fontFamily: 'Times New Roman, serif'}}>
//                 TO
//               </span>
//               <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent flex-1 max-w-md"></div>
//             </div>
//             <h2 
//               className="text-4xl font-black text-white"
//               style={{fontFamily: 'Times New Roman, serif'}}
//             >
//               COST ESTIMATION SOFTWARE
//             </h2>
//             <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
//               Professional cost estimation solution for engineering and construction projects. 
//               Get accurate, reliable estimates with our advanced calculation algorithms.
//             </p>
//           </div>
          
//           {/* Features Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
//             <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-6 hover:border-cyan-400 transition-all duration-300">
//               <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
//                 <span className="text-white text-xl font-bold">⚡</span>
//               </div>
//               <h3 className="text-cyan-400 font-bold text-lg mb-2">Fast Processing</h3>
//               <p className="text-gray-400 text-sm">Lightning-fast calculations and instant results</p>
//             </div>
            
//             <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-6 hover:border-cyan-400 transition-all duration-300">
//               <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
//                 <span className="text-white text-xl font-bold">📊</span>
//               </div>
//               <h3 className="text-cyan-400 font-bold text-lg mb-2">Accurate Analysis</h3>
//               <p className="text-gray-400 text-sm">Precise cost calculations with detailed breakdowns</p>
//             </div>
            
//             <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-6 hover:border-cyan-400 transition-all duration-300">
//               <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
//                 <span className="text-white text-xl font-bold">🔧</span>
//               </div>
//               <h3 className="text-cyan-400 font-bold text-lg mb-2">Professional Tools</h3>
//               <p className="text-gray-400 text-sm">Industry-standard tools for professional estimates</p>
//             </div>
//           </div>
          
//           {/* Next Button */}
//           <div className="flex justify-center">
//             <button
//               onClick={handleNext}
//               className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 border-2 border-cyan-400 hover:border-cyan-300"
//             >
//               <span className="relative z-10 flex items-center space-x-3">
//                 <span style={{fontFamily: 'Times New Roman, serif'}} className="tracking-wider">
//                   NEXT
//                 </span>
//                 <svg 
//                   className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" 
//                   fill="none" 
//                   stroke="currentColor" 
//                   viewBox="0 0 24 24"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                 </svg>
//               </span>
//               <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//             </button>
//           </div>
          
      
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WelcomePage;






// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Settings } from 'lucide-react'; // or `import { Cog } from 'lucide-react'`


// const WelcomePage = () => {
//   const navigate = useNavigate();

//   const handleNext = () => {
//     navigate('/home');
//   };

//   return (
//     <div 
//       className="min-h-screen bg-cover bg-center bg-no-repeat relative"
//       style={{
//         backgroundImage: 'url(/background_image.jpg)',
//         backgroundAttachment: 'fixed',
//         fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
//       }}
//     >
//       {/* Dark overlay for better text readability */}
//       <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
//       {/* CMTI Logo - Top Right Corner */}
//       <div className="absolute top-4 right-4 z-20">
//         <div className="relative">
//           <div className="absolute inset-0 bg-cyan-400 rounded-lg blur-sm opacity-20"></div>
//           <img 
//             src="/logo.png" 
//             alt="CMTI Logo" 
//             className="relative h-24 w-32 rounded-lg border-2 border-cyan-400 shadow-lg hover:shadow-cyan-400/50 transition-all duration-300 object-contain"
//           />
//         </div>
//       </div>
   
//       {/* Content */}
//       <div className="relative z-10 min-h-screen flex items-center justify-center">
//         <div className="text-center px-8 py-12">
//           {/* Logo */}
//           <div className="mb-8">
//             <div className="inline-block relative">
//               <div className="absolute inset-0 bg-cyan-400 rounded-full blur-lg opacity-30"></div>
//               <img 
//                 src="/ADA_LOGO.jpg" 
//                 alt="ADA Logo" 
//                 className="relative h-32 w-32 mx-auto rounded-full border-4 border-cyan-400 shadow-2xl hover:shadow-cyan-400/50 transition-all duration-500"
//               />
//             </div>
//           </div>
          
//           {/* Welcome Text */}
//           <div className="mb-12">
//             <h1 
//               className="text-6xl font-black text-white"
//               style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}
//             >
//               WELCOME
//             </h1>
//             <div className="flex items-center justify-center mb-6">
//               <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent flex-1 max-w-md"></div>
//               <span className="text-white text-xl font-bold mx-6 tracking-widest" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
//                 TO
//               </span>
//               <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent flex-1 max-w-md"></div>
//             </div>
//             <h2 
//               className="text-4xl font-black text-white"
//               style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}
//             >
//               COST ESTIMATION SOFTWARE
//             </h2>
//             <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
//               Professional cost estimation solution for engineering and construction projects. 
//               Get accurate, reliable estimates with our advanced calculation algorithms.
//             </p>
//           </div>
          
//           {/* Features Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
//             <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-6 hover:border-cyan-400 transition-all duration-300">
//               <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
//                 <span className="text-white text-xl font-bold" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>⚡</span>
//               </div>
//               <h3 className="text-cyan-400 font-bold text-lg mb-2" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>Fast Processing</h3>
//               <p className="text-gray-400 text-sm" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>Lightning-fast calculations and instant results</p>
//             </div>
            
//             <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-6 hover:border-cyan-400 transition-all duration-300">
//               <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
//                 <span className="text-white text-xl font-bold" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>📊</span>
//               </div>
//               <h3 className="text-cyan-400 font-bold text-lg mb-2" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>Accurate Analysis</h3>
//               <p className="text-gray-400 text-sm" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>Precise cost calculations with detailed breakdowns</p>
//             </div>
          


// {/* 🔄 Process-Based Estimation */}
// <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-6 hover:border-cyan-400 transition-all duration-300">
//   <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
//     <img 
//      src="/processnew.png" /// Replace with your correct relative path
//       alt="Process Icon" 
//       className="w-8 h-8 object-contain" 
//     />
//   </div>
//   <h3 className="text-cyan-400 font-bold text-lg mb-2">Process-Based Estimation</h3>
//   <p className="text-gray-400 text-sm">
//     Estimate costs based on machining, composites, and sheet metal processes with detailed step-by-step analysis.
//   </p>
// </div>
// </div>


//           {/* Next Button */}
//           <div className="flex justify-center">
//             <button
//               onClick={handleNext}
//               className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 border-2 border-cyan-400 hover:border-cyan-300"
//             >
//               <span className="relative z-10 flex items-center space-x-3">
//                 <span style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}} className="tracking-wider">
//                   NEXT
//                 </span>
//                 <svg 
//                   className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" 
//                   fill="none" 
//                   stroke="currentColor" 
//                   viewBox="0 0 24 24"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                 </svg>
//               </span>
//               <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WelcomePage;




















//'''''this background color theam is different color blue color theam''''''''''

// import React from 'react';
// import { Settings } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const WelcomePage = () => {
//   // const handleNext = () => {
//   //   navigate('/home'); 
//   //   // console.log('Navigate to home');
//   // };
//   const handleNext = () => {
//   navigate('/login'); // Changed from '/home' to '/login'
// };
//   const navigate = useNavigate();

//   return (
//     <div 
//       className="min-h-screen bg-cover bg-center bg-no-repeat relative"
//       style={{
//         backgroundImage: 'url(/background_image.jpg)',
//         backgroundAttachment: 'fixed',
//         fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
//         backgroundColor: '#73b6ca'
//       }}
//     >
//       <div 
//         className="absolute inset-0"
//         style={{
//           background: 'linear-gradient(135deg, rgba(116, 182, 202, 0.3) 0%, rgba(36, 102, 121, 0.2) 50%, rgba(20, 93, 160, 0.3) 100%)'
//         }}
//       ></div>
      
   
//       <div className="relative z-10 min-h-screen flex items-center justify-center">
//         <div className="text-center px-8 py-12">
//           <div className="mb-8">
//             <div className="inline-block relative">
//               <div 
//                 className="absolute inset-0 rounded-full blur-lg opacity-40"
//                 style={{ backgroundColor: '#145da0' }}
//               ></div>
//               <img 
//                 src="/ADA_LOGO.jpg" 
//                 alt="ADA Logo" 
//                 className="relative h-32 w-32 mx-auto rounded-full shadow-2xl transition-all duration-500"
//                 style={{ 
//                   border: '4px solid #145da0',
//                   filter: 'drop-shadow(0 8px 16px rgba(20, 93, 160, 0.3))'
//                 }}
//               />
//             </div>
//           </div>
          
//           <div className="mb-12">
//             <h1 
//               // className="text-6xl font-black text-[#145da0] drop-shadow-lg"
//               className="text-6xl font-black text-[#145da0] drop-shadow-lg"
//               style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}
//             >
//               WELCOME
//             </h1>
//             <div className="flex items-center justify-center mb-6">
//               <div 
//                 className="h-px flex-1 max-w-md"
//                 style={{
//                   background: 'linear-gradient(to right, transparent, #145da0, transparent)'
//                 }}
//               ></div>
//               <span className="text-[#145da0] text-xl font-bold mx-6 tracking-widest drop-shadow-md" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
//                 TO
//               </span>
//               <div 
//                 className="h-px flex-1 max-w-md"
//                 style={{
//                   background: 'linear-gradient(to right, transparent, #145da0, transparent)'
//                 }}
//               ></div>
//             </div>
//             <h2 
//               className="text-4xl font-black text-[#145da0] drop-shadow-lg"
//               style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}
//             >
//               COST ESTIMATION SOFTWARE
//             </h2>
//             <p 
//               className="text-lg max-w-2xl mx-auto leading-relaxed mt-4 drop-shadow-md text-gray-600" 
//               style={{
//                 fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
//               }}
//             >
//               Professional cost estimation solution for engineering and construction projects. 
//               Get accurate, reliable estimates with our advanced calculation algorithms.
//             </p>
            
//             {/* Powered by CMTI Logo - Centered */}
//             <div className="mt-8 flex items-center justify-center">

//               <div className="inline-block relative">
//                 <div 
//                   className="absolute inset-0 rounded-lg"
//                   style={{ backgroundColor: '#145da0' }}
//                 ></div>
//                 <img 
//                   src="/logo.png" 
//                   alt="CMTI Logo" 
//                   className="relative h-16 w-24 rounded-lg shadow-lg transition-all duration-300 object-contain"
//                   style={{ 
//                     border: '2px solid #145da0',
//                     filter: 'drop-shadow(0 4px 8px rgba(20, 93, 160, 0.3))'
//                   }}
//                 />
//               </div>
  
//             </div>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
//             <div 
//               className="backdrop-blur-sm rounded-lg p-6 transition-all duration-300 hover:shadow-lg"
//               style={{
//                 backgroundColor: '#FFFFFF',
//                 border: `1px solid rgba(116, 182, 202, 0.3)`,
//                 transition: 'all 0.3s ease'
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.borderColor = '#145da0';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.borderColor = 'rgba(116, 182, 202, 0.3)';
//               }}
//             >
//               <div 
//                 className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto shadow-md"
//                 style={{
//                   background: 'linear-gradient(135deg, #246679 0%, #145da0 100%)'
//                 }}
//               >
//                 <span className="text-white text-xl font-bold" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>⚡</span>
//               </div>
//               <h3 
//                 className="font-bold text-lg mb-2" 
//                 style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#145da0'}}
//               >
//                 Fast Processing
//               </h3>
//               <p className="text-gray-600 text-sm" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>Lightning-fast calculations and instant results</p>
//             </div>
            
//             <div 
//               className="backdrop-blur-sm rounded-lg p-6 transition-all duration-300 hover:shadow-lg"
//               style={{
//                 backgroundColor: '#FFFFFF',
//                 border: `1px solid rgba(116, 182, 202, 0.3)`,
//                 transition: 'all 0.3s ease'
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.borderColor = '#145da0';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.borderColor = 'rgba(116, 182, 202, 0.3)';
//               }}
//             >
//               <div 
//                 className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto shadow-md"
//                 style={{
//                   background: 'linear-gradient(135deg, #246679 0%, #145da0 100%)'
//                 }}
//               >
//                 <span className="text-white text-xl font-bold" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>📊</span>
//               </div>
//               <h3 
//                 className="font-bold text-lg mb-2" 
//                 style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#145da0'}}
//               >
//                 Accurate Analysis
//               </h3>
//               <p className="text-gray-600 text-sm" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>Precise cost calculations with detailed breakdowns</p>
//             </div>
          
//                   <div 
//               className="backdrop-blur-sm rounded-lg p-6 transition-all duration-300 hover:shadow-lg"
//               style={{
//                 backgroundColor: '#FFFFFF',
//                 border: `1px solid rgba(116, 182, 202, 0.3)`,
//                 transition: 'all 0.3s ease'
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.borderColor = '#145da0';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.borderColor = 'rgba(116, 182, 202, 0.3)';
//               }}
//             >
//               <div 
//                 className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto shadow-md"
//                 style={{
//                   background: 'linear-gradient(135deg, #246679 0%, #145da0 100%)'
//                 }}
//               >
//                 <span className="text-white text-xl font-bold" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>⚙️</span>
//               </div>
//               <h3 
//                 className="font-bold text-lg mb-2" 
//                 style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#145da0'}}
//               >
//                 Process-Based Estimation
//               </h3>
//               <p className="text-gray-600 text-sm" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
//                 Estimate costs based on machining, composites, and sheet metal processes with detailed step-by-step analysis.
//               </p>
//             </div>
//           </div>

//           <div className="flex justify-center">
//             <button
//               onClick={handleNext}
//               className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-bold text-white rounded-lg shadow-lg transform transition-all duration-300"
//               style={{
//                 backgroundColor: '#246679',
//                 border: '2px solid #145da0'
//               }}
//               onMouseEnter={(e) => {
//                 // e.currentTarget.style.backgroundColor = '#145da0';
//                 e.currentTarget.style.borderColor = '#73b6ca';
//                 e.currentTarget.style.transform = 'scale(1.05)';
//                 e.currentTarget.style.boxShadow = '0 10px 25px rgba(36, 102, 121, 0.4)';
//               }}
//               onMouseLeave={(e) => {
//                 // e.currentTarget.style.backgroundColor = '#246679';
//                 e.currentTarget.style.borderColor = '#145da0';
//                 e.currentTarget.style.transform = 'scale(1)';
//                 e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
//               }}
//             >
//               <span className="relative z-10 flex items-center space-x-3">
//                 <span style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}} className="tracking-wider">
//                   NEXT
//                 </span>
//                 <svg 
//                   className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" 
//                   fill="none" 
//                   stroke="currentColor" 
//                   viewBox="0 0 24 24"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                 </svg>
//               </span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WelcomePage;
























// import React from 'react';
// import { Settings } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const WelcomePage = () => {
//   // const handleNext = () => {
//   //   navigate('/home'); 
//   //   // console.log('Navigate to home');
//   // };
//   const handleNext = () => {
//   navigate('/login'); // Changed from '/home' to '/login'
// };
//   const navigate = useNavigate();

//   return (
//     <div 
//       className="min-h-screen bg-cover bg-center bg-no-repeat relative"
//       style={{
//         backgroundImage: 'url(/background_image.jpg)',
//         backgroundAttachment: 'fixed',
//         fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
//         backgroundColor: '#000'
//       }}
//     >
//       <div 
//         className="absolute inset-0"
//         style={{
//           backgroundColor: 'rgba(0, 0, 0, 0.5)'
//         }}
//       ></div>
      
   
//       <div className="relative z-10 min-h-screen flex items-center justify-center">
//         <div className="text-center px-8 py-12">
//           <div className="mb-8">
//             <div className="inline-block relative">
//               <div 
//                 className="absolute inset-0 rounded-full blur-lg opacity-40"
//                 style={{ backgroundColor: '#145da0' }}
//               ></div>
//               <img 
//                 src="/ADA_LOGO.jpg" 
//                 alt="ADA Logo" 
//                 className="relative h-32 w-32 mx-auto rounded-full shadow-2xl transition-all duration-500"
//                 style={{ 
//                   border: '4px solid #145da0',
//                   filter: 'drop-shadow(0 8px 16px rgba(20, 93, 160, 0.3))'
//                 }}
//               />
//             </div>
//           </div>
          
//           <div className="mb-12">
//             <h1 
//               // className="text-6xl font-black text-[#145da0] drop-shadow-lg"
//               className="text-6xl font-black text-white drop-shadow-lg"
//               style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}
//             >
//               WELCOME
//             </h1>
//             <div className="flex items-center justify-center mb-6">
//               <div 
//                 className="h-px flex-1 max-w-md"
//                 style={{
//                   background: 'linear-gradient(to right, transparent, #fff, transparent)'
//                 }}
//               ></div>
//               <span className="text-white text-xl font-bold mx-6 tracking-widest drop-shadow-md" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
//                 TO
//               </span>
//               <div 
//                 className="h-px flex-1 max-w-md"
//                 style={{
//                   background: 'linear-gradient(to right, transparent, #fff, transparent)'
//                 }}
//               ></div>
//             </div>
//             <h2 
//               className="text-4xl font-black text-white drop-shadow-lg"
//               style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}
//             >MANUFACTURING COST ESTIMATION SOFTWARE
//             </h2>
//             <p 
//               className="text-lg max-w-2xl mx-auto leading-relaxed mt-4 drop-shadow-md text-gray-300" 
//               style={{
//                 fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
//               }}
//             >
//               {/* Professional cost estimation solution for engineering and construction projects. 
//               Get accurate, reliable estimates with our advanced calculation algorithms. */}
//             </p>
            
//             {/* Powered by CMTI Logo - Centered */}
//             <div className="mt-8 flex items-center justify-center">

//               <div className="inline-block relative">
//                 <div 
//                   className="absolute inset-0 rounded-lg blur-md"
//                   style={{ 
//                     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                     transform: 'scale(1.05)'
//                   }}
//                 ></div>
//                 <img 
//                   src="/kk.png" 
//                   alt="CMTI Logo" 
//                   className="relative h-17 w-24 rounded-lg shadow-lg transition-all duration-300 object-contain bg-white p-2"
//                   style={{ 
//                     border: '2px solid rgba(20, 93, 160, 0.5)',
//                     // filter: 'drop-shadow(0 4px 8px rgba(255, 255, 255, 0.5))'
//                   }}
//                 />
//               </div>
  
//             </div>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
//             <div 
//               className="backdrop-blur-sm rounded-lg p-6 transition-all duration-300 hover:shadow-lg"
//               style={{
//                 backgroundColor: '#FFFFFF',
//                 border: `1px solid rgba(116, 182, 202, 0.3)`,
//                 transition: 'all 0.3s ease'
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.borderColor = '#145da0';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.borderColor = 'rgba(116, 182, 202, 0.3)';
//               }}
//             >
//               <div 
//                 className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto shadow-md"
//                 style={{
//                   background: 'linear-gradient(135deg, #246679 0%, #145da0 100%)'
//                 }}
//               >
//                 <span className="text-white text-xl font-bold" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>⚡</span>
//               </div>
//               <h3 
//                 className="font-bold text-lg mb-2" 
//                 style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#145da0'}}
//               >
//                 Fast Processing
//               </h3>
//               <p className="text-gray-600 text-sm" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>Lightning-fast calculations and instant results</p>
//             </div>
            
//             <div 
//               className="backdrop-blur-sm rounded-lg p-6 transition-all duration-300 hover:shadow-lg"
//               style={{
//                 backgroundColor: '#FFFFFF',
//                 border: `1px solid rgba(116, 182, 202, 0.3)`,
//                 transition: 'all 0.3s ease'
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.borderColor = '#145da0';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.borderColor = 'rgba(116, 182, 202, 0.3)';
//               }}
//             >
//               <div 
//                 className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto shadow-md"
//                 style={{
//                   background: 'linear-gradient(135deg, #246679 0%, #145da0 100%)'
//                 }}
//               >
//                 <span className="text-white text-xl font-bold" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>📊</span>
//               </div>
//               <h3 
//                 className="font-bold text-lg mb-2" 
//                 style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#145da0'}}
//               >
//                 Accurate Analysis
//               </h3>
//               <p className="text-gray-600 text-sm" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>Precise cost calculations with detailed breakdowns</p>
//             </div>
          
//                   <div 
//               className="backdrop-blur-sm rounded-lg p-6 transition-all duration-300 hover:shadow-lg"
//               style={{
//                 backgroundColor: '#FFFFFF',
//                 border: `1px solid rgba(116, 182, 202, 0.3)`,
//                 transition: 'all 0.3s ease'
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.borderColor = '#145da0';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.borderColor = 'rgba(116, 182, 202, 0.3)';
//               }}
//             >
//               <div 
//                 className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto shadow-md"
//                 style={{
//                   background: 'linear-gradient(135deg, #246679 0%, #145da0 100%)'
//                 }}
//               >
//                 <span className="text-white text-xl font-bold" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>⚙️</span>
//               </div>
//               <h3 
//                 className="font-bold text-lg mb-2" 
//                 style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#145da0'}}
//               >
//                 Process-Based Estimation
//               </h3>
//               <p className="text-gray-600 text-sm" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
//                 Estimate costs based on machining, composites, and sheet metal processes with detailed step-by-step analysis.
//               </p>
//             </div>
//           </div>

//           <div className="flex justify-center">
//             <button
//               onClick={handleNext}
//               className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-bold text-white rounded-lg shadow-lg transform transition-all duration-300"
//               style={{
//                 backgroundColor: 'rgba(59, 130, 246, 0.9)',
//                 border: '2px solid rgba(255, 255, 255, 0.2)',
//                 backdropFilter: 'blur(4px)'
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 1)';
//                 e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
//                 e.currentTarget.style.transform = 'scale(1.05)';
//                 e.currentTarget.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.4)';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.9)';
//                 e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
//                 e.currentTarget.style.transform = 'scale(1)';
//                 e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
//               }}
//             >
//               <span className="relative z-10 flex items-center space-x-3">
//                 <span style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}} className="tracking-wider">
//                   NEXT
//                 </span>
//                 <svg 
//                   className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" 
//                   fill="none" 
//                   stroke="currentColor" 
//                   viewBox="0 0 24 24"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                 </svg>
//               </span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WelcomePage;
















// /''''this below code where added the fetaures information related to our software instead of generic information of fetaures

import React from 'react';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  // const handleNext = () => {
  //   navigate('/home'); 
  //   // console.log('Navigate to home');
  // };
  const handleNext = () => {
  navigate('/login'); // Changed from '/home' to '/login'
};
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: 'url(/background_image.jpg)',
        backgroundAttachment: 'fixed',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        backgroundColor: '#000'
      }}
    >
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
      ></div>
      
   
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="text-center px-8 py-12">
          <div className="mb-8">
            <div className="inline-block relative">
              <div 
                className="absolute inset-0 rounded-full blur-lg opacity-40"
                style={{ backgroundColor: '#145da0' }}
              ></div>
              <img 
                src="/ADA_LOGO.jpg" 
                alt="ADA Logo" 
                className="relative h-32 w-32 mx-auto rounded-full shadow-2xl transition-all duration-500"
                style={{ 
                  border: '4px solid #145da0',
                  filter: 'drop-shadow(0 8px 16px rgba(20, 93, 160, 0.3))'
                }}
              />
            </div>
          </div>
          
          <div className="mb-12">
            <h1 
              // className="text-6xl font-black text-[#145da0] drop-shadow-lg"
              className="text-6xl font-black text-white drop-shadow-lg"
              style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}
            >
              WELCOME
            </h1>
            <div className="flex items-center justify-center mb-6">
              <div 
                className="h-px flex-1 max-w-md"
                style={{
                  background: 'linear-gradient(to right, transparent, #fff, transparent)'
                }}
              ></div>
              <span className="text-white text-xl font-bold mx-6 tracking-widest drop-shadow-md" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
                TO
              </span>
              <div 
                className="h-px flex-1 max-w-md"
                style={{
                  background: 'linear-gradient(to right, transparent, #fff, transparent)'
                }}
              ></div>
            </div>
            <h2 
              className="text-4xl font-black text-white drop-shadow-lg"
              style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}
            >MANUFACTURING COST ESTIMATION SOFTWARE
            </h2>
            <p 
              className="text-lg max-w-2xl mx-auto leading-relaxed mt-4 drop-shadow-md text-gray-300" 
              style={{
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              }}
            >
              {/* Professional cost estimation solution for engineering and construction projects. 
              Get accurate, reliable estimates with our advanced calculation algorithms. */}
            </p>
            
            {/* Powered by CMTI Logo - Centered */}
            <div className="mt-8 flex items-center justify-center">

              <div className="inline-block relative">
                <div 
                  className="absolute inset-0 rounded-lg blur-md"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    transform: 'scale(1.05)'
                  }}
                ></div>
                <img 
                  src="/kk.png" 
                  alt="CMTI Logo" 
                  className="relative h-17 w-24 rounded-lg shadow-lg transition-all duration-300 object-contain bg-white p-2"
                  style={{ 
                    border: '2px solid rgba(20, 93, 160, 0.5)',
                    // filter: 'drop-shadow(0 4px 8px rgba(255, 255, 255, 0.5))'
                  }}
                />
              </div>
  
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div 
              className="backdrop-blur-sm rounded-lg p-6 transition-all duration-300 hover:shadow-lg"
              style={{
                backgroundColor: '#FFFFFF',
                border: `1px solid rgba(116, 182, 202, 0.3)`,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#145da0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(116, 182, 202, 0.3)';
              }}
            >
           <div 
  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto shadow-md"
  style={{
    background: 'linear-gradient(135deg, #246679 0%, #145da0 100%)'
  }}
>
  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
    {/* Top cube */}
    <path d="M12 2 L16 4 L16 8 L12 6 L8 8 L8 4 Z" />
    <path d="M12 6 L16 8 L12 10 L8 8 Z" opacity="0.7"/>
    <path d="M8 4 L8 8 L12 10 L12 6 Z" opacity="0.5"/>
    
    {/* Bottom left cube */}
    <path d="M6 12 L10 14 L10 18 L6 16 L2 18 L2 14 Z" />
    <path d="M6 16 L10 18 L6 20 L2 18 Z" opacity="0.7"/>
    <path d="M2 14 L2 18 L6 20 L6 16 Z" opacity="0.5"/>
    
    {/* Bottom right cube */}
    <path d="M18 12 L22 14 L22 18 L18 16 L14 18 L14 14 Z" />
    <path d="M18 16 L22 18 L18 20 L14 18 Z" opacity="0.7"/>
    <path d="M14 14 L14 18 L18 20 L18 16 Z" opacity="0.5"/>
    
    {/* Connection lines between cubes */}
    <line x1="10" y1="9" x2="8" y2="12" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="14" y1="9" x2="16" y2="12" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="8" y1="18" x2="16" y2="18" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
</div>
              <h3 
                className="font-bold text-lg mb-2" 
                style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#145da0'}}
              >
                Multiple Manufacturing Modules
              </h3>
              <p className="text-gray-600 text-sm" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>Machining, Sheet Metal, and Composites modules with specialized process calculations</p>
            </div>
            
            <div 
              className="backdrop-blur-sm rounded-lg p-6 transition-all duration-300 hover:shadow-lg"
              style={{
                backgroundColor: '#FFFFFF',
                border: `1px solid rgba(116, 182, 202, 0.3)`,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#145da0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(116, 182, 202, 0.3)';
              }}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto shadow-md"
                style={{
                  background: 'linear-gradient(135deg, #246679 0%, #145da0 100%)'
                }}
              >
                <span className="text-white text-xl font-bold" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>📁</span>
              </div>
              <h3 
                className="font-bold text-lg mb-2" 
                style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#145da0'}}
              >
                STEP File Analysis
              </h3>
              <p className="text-gray-600 text-sm" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>Upload and analyze 3D CAD files with automatic dimension extraction and volume calculations</p>
            </div>
          
                  <div 
              className="backdrop-blur-sm rounded-lg p-6 transition-all duration-300 hover:shadow-lg"
              style={{
                backgroundColor: '#FFFFFF',
                border: `1px solid rgba(116, 182, 202, 0.3)`,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#145da0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(116, 182, 202, 0.3)';
              }}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto shadow-md"
                style={{
                  background: 'linear-gradient(135deg, #246679 0%, #145da0 100%)'
                }}
              >
                <span className="text-white text-xl font-bold" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>⚙️</span>
              </div>
              <h3 
                className="font-bold text-lg mb-2" 
                style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#145da0'}}
              >
                Machine & Material Configuration
              </h3>
              <p className="text-gray-600 text-sm" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
                Configure machine rates, material costs, and access control with comprehensive user management system
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleNext}
              className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-bold text-white rounded-lg shadow-lg transform transition-all duration-300"
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.9)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(4px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.9)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
            >
              <span className="relative z-10 flex items-center space-x-3">
                <span style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}} className="tracking-wider">
                  NEXT
                </span>
                <svg 
                  className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;





