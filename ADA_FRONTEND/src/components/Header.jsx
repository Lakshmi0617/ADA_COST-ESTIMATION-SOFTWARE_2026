// import React from 'react';
// import { useNavigate } from 'react-router-dom';


// const Header = () => {
//     const navigate = useNavigate();
//   return (
//     <header className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 shadow-2xl border-b-4 border-cyan-400">
      
//       <div className="container mx-auto px-8 py-3">
        
        

//         <div className="flex items-center justify-between">

//           {/* Left side - Logo */}
//           <div className="flex items-center space-x-4">
//             <div className="relative">
//               <div className="absolute inset-0 bg-cyan-400 rounded-lg blur-sm opacity-20"></div>
//               <img 
//                  src="/ADA_LOGO.jpg" 
//                 alt="ADA Logo" 
//                 className="relative h-16 w-16 rounded-lg border-2 border-cyan-400 shadow-lg hover:shadow-cyan-400/50 transition-all duration-300"
//               />
//             </div>
//             <div className="h-8 w-px bg-gradient-to-b from-transparent via-cyan-400 to-transparent"></div>
//           </div>
          
//           {/* Center - Main Heading */}
//           <div className="flex-1 text-center">
//             <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 tracking-wider" style={{fontFamily: 'Times New Roman, serif'}}>
//               COST ESTIMATION
//             </h1>
//             <div className="flex items-center justify-center mt-2">
//               <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent flex-1 max-w-xs"></div>
//               <span className="text-gray-300 text-sm font-bold mx-4 tracking-widest" style={{fontFamily: 'Times New Roman, serif'}}>SOFTWARE</span>
//               <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent flex-1 max-w-xs"></div>
//             </div>
//           </div>
          

//         </div>
        
//         {/* Bottom accent line */}
//         <div className="mt-2 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
//       </div>
//     </header>
//   );
// };

// export default Header;






//new final code after changing the new color  ''''///
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FiArrowLeft } from 'react-icons/fi';

// const Header = () => {
//     const navigate = useNavigate();
//   return (
//     <header className="shadow-2xl " style={{backgroundColor: '#145da0', borderBottomColor: '#d7f2f5'}}>
//       <div className="container mx-auto px-8 py-3">
//         <div className="flex items-center justify-between">
//           {/* Left side - Back Arrow and Logo */}
//           <div className="flex items-center">
//             {/* Back Arrow Button - positioned at absolute left */}
//             <button 
//               onClick={() => navigate('/login')}
//               className="absolute left-4 p-1 rounded-md transition-colors duration-300 group"
//               style={{
//                 ':hover': {backgroundColor: '#d7f2f5'}
//               }}
//               onMouseEnter={(e) => e.target.style.backgroundColor = '#d7f2f520'}
//               onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
//               title="Back to Welcome Page"
//             >
//               <FiArrowLeft 
//                 className="w-10 h-8 transition-colors duration-300" 
//                 style={{color: '#d7f2f5'}}
//                 onMouseEnter={(e) => e.target.style.color = '#73b6ca'}
//                 onMouseLeave={(e) => e.target.style.color = '#d7f2f5'}
//               />
//             </button>
            
//             {/* Logo with left padding to create space after arrow */}
//             <div className="flex items-center space-x-4 pl-10">
//               <div className="relative">
//                 <div className="absolute inset-0 rounded-lg blur-sm opacity-20" style={{backgroundColor: '#d7f2f5'}}></div>
//                 <img 
//                   src="/ADA_LOGO1.png" 
//                   alt="ADA Logo" 
//                   className="relative h-16 w-16 rounded-lg border-2 shadow-lg hover:shadow-lg transition-all duration-300"
//                   style={{
//                     // borderColor: '#d7f2f5',
//                           borderColor: '#FFFFFF',
//                     // boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
//                   }}
//                   onMouseEnter={(e) => e.target.style.boxShadow = `0 20px 25px -5px rgba(215, 242, 245, 0.5), 0 10px 10px -5px rgba(215, 242, 245, 0.04)`}
//                   onMouseLeave={(e) => e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'}
//                 />
//               </div>
//               <div className="h-8 w-px bg-gradient-to-b from-transparent to-transparent" style={{background: `linear-gradient(to bottom, transparent, #d7f2f5, transparent)`}}></div>
//             </div>
//           </div>
          
//           {/* Center - Main Heading */}
//           <div className="flex-1 text-center">
//             <h1 
//               className="text-3xl font-black tracking-wider bg-clip-text text-white" 
//               style={{
//                 fontFamily: 'Times New Roman, serif',
//                 background: `linear-gradient(to right, #d7f2f5, #73b6ca, #d7f2f5)`,
//                 WebkitBackgroundClip: 'text',
//                 WebkitTextFillColor: 'white'
//               }}
//             >
//               COST ESTIMATION
//             </h1>
//             <div className="flex items-center justify-center mt-2">
//               <div className="h-px flex-1 max-w-xs" style={{background: `linear-gradient(to right, transparent, #d7f2f5, transparent)`}}></div>
//               <span 
//                 className="text-sm font-bold mx-4 tracking-widest" 
//                 style={{fontFamily: 'Times New Roman, serif', color: '#FFFFFF'}}
//               >
//                 SOFTWARE
//               </span>
//               <div className="h-px flex-1 max-w-xs" style={{background: `linear-gradient(to right, transparent, #d7f2f5, transparent)`}}></div>
//             </div>
//           </div>
          
//           {/* Right side - PNG Logo positioned at absolute right */}
//           <div className="absolute right-4 flex items-center">
//             <div className="relative">
//               <div className="absolute inset-0 rounded-lg blur-sm opacity-20" style={{backgroundColor: '#d7f2f5'}}></div>
//               {/* <img 
//                 src="/logo.png" 
//                 alt="Company Logo" 
//                 className="relative h-16 w-20 rounded-lg border-2 shadow-lg hover:shadow-lg transition-all duration-300 object-contain"
//                 style={{
//                   borderColor: '#d7f2f5',
//                   boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
//                 }}
//                 onMouseEnter={(e) => e.target.style.boxShadow = `0 20px 25px -5px rgba(215, 242, 245, 0.5), 0 10px 10px -5px rgba(215, 242, 245, 0.04)`}
//                 onMouseLeave={(e) => e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'}
//               /> */}
//                 <img 
//                   src="/kk.png" 
//                   alt="CMTI Logo" 
//                   className="relative h-16 w-24 rounded-lg shadow-lg transition-all duration-300 object-contain bg-white p-2"
//                   style={{ 
//                     border: '2px solid rgba(20, 93, 160, 0.5)',
//                     // filter: 'drop-shadow(0 4px 8px rgba(255, 255, 255, 0.5))'
//                   }}
//                 />
//             </div>
//           </div>

//           <div className="w-6"></div>
//         </div>
        
//         {/* Bottom accent line */}
//         <div className="mt-2 h-px" style={{background: `linear-gradient(to right, transparent, rgba(215, 242, 245, 0.5), transparent)`}}></div>
//       </div>
//     </header>
//   );
// };

// export default Header;





// ''''this is the correct working code 
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FiArrowLeft } from 'react-icons/fi';

// const Header = () => {
//     const navigate = useNavigate();

//     // Logout function
//     const handleLogout = () => {
//       // Clear session storage
//       sessionStorage.removeItem('userData');
//       // Navigate to login page
//       navigate('/login');
//     };

//   return (
//     <header className="shadow-2xl " style={{backgroundColor: '#246679', borderBottomColor: '#d7f2f5'}}>
//       <div className="container mx-auto px-8 py-3">
//         <div className="flex items-center justify-between">
//           {/* Left side - Back Arrow and Logo */}
//           <div className="flex items-center">
            
            
//             {/* Logo with left padding to create space after arrow */}
//             <div className="flex items-center space-x-4 pl-10">
//               <div className="relative">
//                 <div className="absolute inset-0 rounded-lg blur-sm opacity-20" style={{backgroundColor: '#d7f2f5'}}></div>
//                 <img 
//                   src="/ADA_LOGO1.png" 
//                   alt="ADA Logo" 
//                   className="relative h-16 w-16 rounded-lg border-2 shadow-lg hover:shadow-lg transition-all duration-300"
//                   style={{
//                     // borderColor: '#d7f2f5',
//                           borderColor: '#FFFFFF',
//                     // boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
//                   }}
//                   onMouseEnter={(e) => e.target.style.boxShadow = `0 20px 25px -5px rgba(215, 242, 245, 0.5), 0 10px 10px -5px rgba(215, 242, 245, 0.04)`}
//                   onMouseLeave={(e) => e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'}
//                 />
//               </div>
//               <div className="h-8 w-px bg-gradient-to-b from-transparent to-transparent" style={{background: `linear-gradient(to bottom, transparent, #d7f2f5, transparent)`}}></div>
//             </div>
//           </div>
          
//           {/* Center - Main Heading */}
//           <div className="flex-1 text-center">
//             <h1 
//               className="text-3xl font-black tracking-wider bg-clip-text text-white" 
//               style={{
//                 fontFamily: 'Times New Roman, serif',
//                 background: `linear-gradient(to right, #d7f2f5, #73b6ca, #d7f2f5)`,
//                 WebkitBackgroundClip: 'text',
//                 WebkitTextFillColor: 'white'
//               }}
//             >
//               COST ESTIMATION
//             </h1>
//             <div className="flex items-center justify-center mt-2">
//               <div className="h-px flex-1 max-w-xs" style={{background: `linear-gradient(to right, transparent, #d7f2f5, transparent)`}}></div>
//               <span 
//                 className="text-sm font-bold mx-4 tracking-widest" 
//                 style={{fontFamily: 'Times New Roman, serif', color: '#FFFFFF'}}
//               >
//                 SOFTWARE
//               </span>
//               <div className="h-px flex-1 max-w-xs" style={{background: `linear-gradient(to right, transparent, #d7f2f5, transparent)`}}></div>
//             </div>
//           </div>
          
//           {/* Right side - Logout Button and PNG Logo positioned at absolute right */}
//           <div className="absolute right-4 flex items-center space-x-4">
//             {/* Logout Button */}
//    <button
//   onClick={handleLogout}
//   className="flex items-center space-x-2 px-4 py-2 rounded-lg font-extrabold transition-all duration-300 
//              hover:scale-105 shadow-lg text-gray-600 bg-white  border-2"
//   style={{
//     borderColor: "rgba(20, 93, 160, 0.5)",
//     fontFamily: "Times New Roman, serif",
//     fontSize: "21px"
//   }}
// >
// <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 448 512">
//   <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"/>
// </svg>
//   <span>Logout</span>
// </button>




//             {/* CMTI Logo */}
//             <div className="relative">
//               <div className="absolute inset-0 rounded-lg blur-sm opacity-20" style={{backgroundColor: '#d7f2f5'}}></div>
//               <img 
//                 src="/kk.png" 
//                 alt="CMTI Logo" 
//                 className="relative h-16 w-24 rounded-lg shadow-lg transition-all duration-300 object-contain bg-white p-2"
//                 style={{ 
//                   border: '2px solid rgba(20, 93, 160, 0.5)',
//                   // filter: 'drop-shadow(0 4px 8px rgba(255, 255, 255, 0.5))'
//                 }}
//               />
//             </div>
//           </div>

//           <div className="w-6"></div>
//         </div>
        
//         {/* Bottom accent line */}
//         <div className="mt-2 h-px" style={{background: `linear-gradient(to right, transparent, rgba(215, 242, 245, 0.5), transparent)`}}></div>
//       </div>
//     </header>
//   );
// };

// export default Header;







import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const Header = () => {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Show confirmation modal
    const handleLogoutClick = () => {
      setShowLogoutModal(true);
    };

    // Confirm logout
    const confirmLogout = () => {
      // Clear session storage
      sessionStorage.removeItem('userData');
      // Navigate to login page
      navigate('/login');
    };

    // Cancel logout
    const cancelLogout = () => {
      setShowLogoutModal(false);
    };

  return (
    <header className="shadow-2xl " style={{backgroundColor: '#246679', borderBottomColor: '#d7f2f5'}}>
      <div className="container mx-auto px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Back Arrow and Logo */}
          <div className="flex items-center">
            {/* Back Arrow Button - positioned at absolute left */}
            {/* <button 
              onClick={() => navigate('/login')}
              className="absolute left-4 p-1 rounded-md transition-colors duration-300 group"
              style={{
                ':hover': {backgroundColor: '#d7f2f520'}
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#d7f2f520'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              title="Back to Welcome Page"
            >
              <FiArrowLeft 
                className="w-10 h-8 transition-colors duration-300" 
                style={{color: '#d7f2f5'}}
                onMouseEnter={(e) => e.target.style.color = '#73b6ca'}
                onMouseLeave={(e) => e.target.style.color = '#d7f2f5'}
              />
            </button> */}
            
            {/* Logo with left padding to create space after arrow */}
            <div className="flex items-center space-x-4 pl-10">
              <div className="relative">
                <div className="absolute inset-0 rounded-lg blur-sm opacity-20" style={{backgroundColor: '#d7f2f5'}}></div>
                <img 
                  src="/ADA_LOGO1.png" 
                  alt="ADA Logo" 
                  className="relative h-16 w-16 rounded-lg border-2 shadow-lg hover:shadow-lg transition-all duration-300"
                  style={{
                    // borderColor: '#d7f2f5',
                          borderColor: '#FFFFFF',
                    // boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                  }}
                  onMouseEnter={(e) => e.target.style.boxShadow = `0 20px 25px -5px rgba(215, 242, 245, 0.5), 0 10px 10px -5px rgba(215, 242, 245, 0.04)`}
                  onMouseLeave={(e) => e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'}
                />
              </div>
              <div className="h-8 w-px bg-gradient-to-b from-transparent to-transparent" style={{background: `linear-gradient(to bottom, transparent, #d7f2f5, transparent)`}}></div>
            </div>
          </div>
          
          {/* Center - Main Heading */}
          <div className="flex-1 text-center">
            <h1 
              className="text-3xl font-black tracking-wider bg-clip-text text-white" 
              style={{
                fontFamily: 'Times New Roman, serif',
                background: `linear-gradient(to right, #d7f2f5, #73b6ca, #d7f2f5)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'white'
              }}
            >
              COST ESTIMATION
            </h1>
            <div className="flex items-center justify-center mt-2">
              <div className="h-px flex-1 max-w-xs" style={{background: `linear-gradient(to right, transparent, #d7f2f5, transparent)`}}></div>
              <span 
                className="text-sm font-bold mx-4 tracking-widest" 
                style={{fontFamily: 'Times New Roman, serif', color: '#FFFFFF'}}
              >
                SOFTWARE
              </span>
              <div className="h-px flex-1 max-w-xs" style={{background: `linear-gradient(to right, transparent, #d7f2f5, transparent)`}}></div>
            </div>
          </div>
          
          {/* Right side - Logout Button and PNG Logo positioned at absolute right */}
          <div className="absolute right-4 flex items-center space-x-4">
            {/* Logout Button */}
            <button
              onClick={handleLogoutClick}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg font-extrabold transition-all duration-300 
                        hover:scale-105 shadow-lg text-gray-600 bg-white  border-2"
              style={{
                borderColor: "rgba(20, 93, 160, 0.5)",
                fontFamily: "Times New Roman, serif",
                fontSize: "21px"
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 448 512">
                <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"/>
              </svg>
              <span>Logout</span>
            </button>

            {/* CMTI Logo */}
            <div className="relative">
              <div className="absolute inset-0 rounded-lg blur-sm opacity-20" style={{backgroundColor: '#d7f2f5'}}></div>
              <img 
                src="/kk.png" 
                alt="CMTI Logo" 
                className="relative h-16 w-24 rounded-lg shadow-lg transition-all duration-300 object-contain bg-white p-2"
                style={{ 
                  border: '2px solid rgba(20, 93, 160, 0.5)',
                  // filter: 'drop-shadow(0 4px 8px rgba(255, 255, 255, 0.5))'
                }}
              />
            </div>
          </div>

          <div className="w-6"></div>
        </div>
        
        {/* Bottom accent line */}
        <div className="mt-2 h-px" style={{background: `linear-gradient(to right, transparent, rgba(215, 242, 245, 0.5), transparent)`}}></div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all">
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full p-3" style={{backgroundColor: '#fff3cd'}}>
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-2" style={{fontFamily: 'Times New Roman, serif', color: '#246679'}}>
              Confirm Logout
            </h3>
            <p className="text-gray-600 text-center mb-6" style={{fontFamily: 'Times New Roman, serif'}}>
              Are you sure you want to logout? Your session will be ended.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={cancelLogout}
                className="flex-1 px-4 py-2 rounded-lg font-bold transition-all duration-300 bg-gray-200 text-gray-700 hover:bg-gray-300"
                style={{fontFamily: 'Times New Roman, serif'}}
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2 rounded-lg font-bold transition-all duration-300 text-white hover:opacity-90"
                style={{backgroundColor: '#246679', fontFamily: 'Times New Roman, serif'}}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;