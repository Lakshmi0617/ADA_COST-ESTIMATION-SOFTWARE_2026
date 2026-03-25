

//''''''this correct one code along witha ccess contol and machine config button display 

// import React, { useState, useEffect } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import Header from './Header';
// import Navbar from './Navbar';
// import MachineModule from './MachineModule';
// import CompositesModule from './CompositesModule';
// import SheetMetalModule from './SheetMetalModule';
// import TurningProcess from './TurningProcess';
// import AccessControl from './AccessControl'; // Import the AccessControl component
// import MachineConfiguration from './MachineConfiguration';

// const HomePage = () => {
//   const [userRole, setUserRole] = useState('');
//   const [isLoading, setIsLoading] = useState(true);

//   // Get user role from sessionStorage on component mount
//   useEffect(() => {
//     const userData = sessionStorage.getItem('userData');
//     if (userData) {
//       const parsedData = JSON.parse(userData);
//       setUserRole(parsedData.role);
//       console.log('HomePage - User role:', parsedData.role);
//     }
//     setIsLoading(false);
//   }, []);

//   const WelcomeContent = () => (
//     <div className="text-center">
  
//     </div>
//   );

//   // Enhanced role-based route protection component
//   const ProtectedRoute = ({ children, moduleType }) => {
//     if (isLoading) {
//       return <div className="text-center py-8">Loading...</div>;
//     }

//     if (!userRole) {
//       return <Navigate to="/login" replace />;
//     }

//     // Admin has access to everything
//     if (userRole === 'admin') {
//       return children;
//     }

//     // Role to module mapping
//     const roleModuleAccess = {
//       'Machining Module': ['machine', 'turning'], // Machining Module can access machine routes and direct grinding
//       'Composite Module': ['composites'],
//       'Sheet Metal Module': ['sheet-metal']
//     };

//     // Check if user's role has access to this module type
//     const allowedModules = roleModuleAccess[userRole] || [];
    
//     if (allowedModules.includes(moduleType)) {
//       return children;
//     }

//     // If user doesn't have access, show access denied message
//     return (
//       <div className="text-center py-8">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
//           <div className="text-red-800 mb-2">
//             <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//             </svg>
//           </div>
//           <h3 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h3>
//           <p className="text-red-600 text-sm">
//             You don't have permission to access this module.
//           </p>
//           <p className="text-red-500 text-xs mt-2">
//             Your current role: <strong>{userRole}</strong>
//           </p>
//           <p className="text-red-500 text-xs mt-1">
//             Required access: <strong>{moduleType}</strong>
//           </p>
//         </div>
//       </div>
//     );
//   };

//   // Admin-only route protection for Access Control
//   const AdminOnlyRoute = ({ children }) => {
//     if (isLoading) {
//       return <div className="text-center py-8">Loading...</div>;
//     }

//     if (!userRole) {
//       return <Navigate to="/login" replace />;
//     }

//     if (userRole !== 'admin') {
//       return (
//         <div className="text-center py-8">
//           <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
//             <div className="text-red-800 mb-2">
//               <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <h3 className="text-lg font-semibold text-red-800 mb-2">Admin Access Required</h3>
//             <p className="text-red-600 text-sm">
//               You need administrator privileges to access this page.
//             </p>
//             <p className="text-red-500 text-xs mt-2">
//               Your current role: <strong>{userRole}</strong>
//             </p>
//           </div>
//         </div>
//       );
//     }

//     return children;
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />
//       <Navbar />
//       <main className="ml-0 px-6 py-8">
//         <Routes>
//           <Route path="/" element={<WelcomeContent />} />
          
//           {/* Access Control Route - Admin Only */}
//           <Route 
//             path="/access-control" 
//             element={
//               <AdminOnlyRoute>
//                 <AccessControl />
//               </AdminOnlyRoute>
//             } 
//           />

//           <Route 
//   path="/machine-configuration" 
//   element={
//     <AdminOnlyRoute>
//       <MachineConfiguration />
//     </AdminOnlyRoute>
//   } 
// />
          
//           {/* Machine Module Routes - accessible by admin and Machining Module role */}
//           <Route 
//             path="/machine/*" 
//             element={
//               <ProtectedRoute moduleType="machine">
//                 <MachineModule />
//               </ProtectedRoute>
//             } 
//           />
          
//           {/* Composites Module Routes - accessible by admin and composite role */}
//           <Route 
//             path="/composites/*" 
//             element={
//               <ProtectedRoute moduleType="composites">
//                 <CompositesModule />
//               </ProtectedRoute>
//             } 
//           />
          
//           {/* Sheet Metal Module Routes - accessible by admin and sheet_metal role */}
//           <Route 
//             path="/sheet-metal/*" 
//             element={
//               <ProtectedRoute moduleType="sheet-metal">
//                 <SheetMetalModule />
//               </ProtectedRoute>
//             } 
//           />
          
//           {/* Direct Grinding Process Route - accessible by admin and Machining Module role */}
//           <Route 
//             path="/turning" 
//             element={
//               <ProtectedRoute moduleType="turning">
//                 <TurningProcess />
//               </ProtectedRoute>
//             } 
//           />

//           {/* Catch-all route for unmatched paths */}
//           <Route 
//             path="*" 
//             element={
//               <div className="text-center py-8">
//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
//                   <h3 className="text-lg font-semibold text-yellow-800 mb-2">Page Not Found</h3>
//                   <p className="text-yellow-600 text-sm">
//                     The requested page could not be found.
//                   </p>
//                 </div>
//               </div>
//             } 
//           />
//         </Routes>
//       </main>
//     </div>
//   );
// };

// export default HomePage;





// //''''updated code to make it visble this machine config button for other roles also along with admin few tabs only for other roles
// import React, { useState, useEffect } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import Header from './Header';
// import Navbar from './Navbar';
// import MachineModule from './MachineModule';
// import CompositesModule from './CompositesModule';
// import SheetMetalModule from './SheetMetalModule';
// import TurningProcess from './TurningProcess';
// import AccessControl from './AccessControl'; // Import the AccessControl component
// import MachineConfiguration from './MachineConfiguration';

// const HomePage = () => {
//   const [userRole, setUserRole] = useState('');
//   const [isLoading, setIsLoading] = useState(true);

//   // Get user role from sessionStorage on component mount
//   useEffect(() => {
//     const userData = sessionStorage.getItem('userData');
//     if (userData) {
//       const parsedData = JSON.parse(userData);
//       setUserRole(parsedData.role);
//       console.log('HomePage - User role:', parsedData.role);
//     }
//     setIsLoading(false);
//   }, []);

//   const WelcomeContent = () => (
//     <div className="text-center">
  
//     </div>
//   );

//   // Enhanced role-based route protection component
//   const ProtectedRoute = ({ children, moduleType }) => {
//     if (isLoading) {
//       return <div className="text-center py-8">Loading...</div>;
//     }

//     if (!userRole) {
//       return <Navigate to="/login" replace />;
//     }

//     // Admin has access to everything
//     if (userRole === 'admin') {
//       return children;
//     }

//     // Role to module mapping
//     const roleModuleAccess = {
//       'Machining Module': ['machine', 'turning'], // Machining Module can access machine routes and direct grinding
//       'Composite Module': ['composites'],
//       'Sheet Metal Module': ['sheet-metal']
//     };

//     // Check if user's role has access to this module type
//     const allowedModules = roleModuleAccess[userRole] || [];
    
//     if (allowedModules.includes(moduleType)) {
//       return children;
//     }

//     // If user doesn't have access, show access denied message
//     return (
//       <div className="text-center py-8">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
//           <div className="text-red-800 mb-2">
//             <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//             </svg>
//           </div>
//           <h3 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h3>
//           <p className="text-red-600 text-sm">
//             You don't have permission to access this module.
//           </p>
//           <p className="text-red-500 text-xs mt-2">
//             Your current role: <strong>{userRole}</strong>
//           </p>
//           <p className="text-red-500 text-xs mt-1">
//             Required access: <strong>{moduleType}</strong>
//           </p>
//         </div>
//       </div>
//     );
//   };

//   // Admin-only route protection for Access Control
//   const AdminOnlyRoute = ({ children }) => {
//     if (isLoading) {
//       return <div className="text-center py-8">Loading...</div>;
//     }

//     if (!userRole) {
//       return <Navigate to="/login" replace />;
//     }

//     if (userRole !== 'admin') {
//       return (
//         <div className="text-center py-8">
//           <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
//             <div className="text-red-800 mb-2">
//               <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <h3 className="text-lg font-semibold text-red-800 mb-2">Admin Access Required</h3>
//             <p className="text-red-600 text-sm">
//               You need administrator privileges to access this page.
//             </p>
//             <p className="text-red-500 text-xs mt-2">
//               Your current role: <strong>{userRole}</strong>
//             </p>
//           </div>
//         </div>
//       );
//     }

//     return children;
//   };

//   // General authenticated route protection (for all logged in users)
//   const AuthenticatedRoute = ({ children }) => {
//     if (isLoading) {
//       return <div className="text-center py-8">Loading...</div>;
//     }

//     if (!userRole) {
//       return <Navigate to="/login" replace />;
//     }

//     return children;
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />
//       <Navbar />
//       <main className="ml-0 px-6 py-8">
//         <Routes>
//           <Route path="/" element={<WelcomeContent />} />
          
//           {/* Access Control Route - Admin Only */}
//           <Route 
//             path="/access-control" 
//             element={
//               <AdminOnlyRoute>
//                 <AccessControl />
//               </AdminOnlyRoute>
//             } 
//           />

//           {/* Machine Configuration Route - Available to All Authenticated Users */}
//           <Route 
//             path="/machine-configuration" 
//             element={
//               <AuthenticatedRoute>
//                 <MachineConfiguration />
//               </AuthenticatedRoute>
//             } 
//           />
          
//           {/* Machine Module Routes - accessible by admin and Machining Module role */}
//           <Route 
//             path="/machine/*" 
//             element={
//               <ProtectedRoute moduleType="machine">
//                 <MachineModule />
//               </ProtectedRoute>
//             } 
//           />
          
//           {/* Composites Module Routes - accessible by admin and composite role */}
//           <Route 
//             path="/composites/*" 
//             element={
//               <ProtectedRoute moduleType="composites">
//                 <CompositesModule />
//               </ProtectedRoute>
//             } 
//           />
          
//           {/* Sheet Metal Module Routes - accessible by admin and sheet_metal role */}
//           <Route 
//             path="/sheet-metal/*" 
//             element={
//               <ProtectedRoute moduleType="sheet-metal">
//                 <SheetMetalModule />
//               </ProtectedRoute>
//             } 
//           />
          
//           {/* Direct Grinding Process Route - accessible by admin and Machining Module role */}
//           <Route 
//             path="/turning" 
//             element={
//               <ProtectedRoute moduleType="turning">
//                 <TurningProcess />
//               </ProtectedRoute>
//             } 
//           />

//           {/* Catch-all route for unmatched paths */}
//           <Route 
//             path="*" 
//             element={
//               <div className="text-center py-8">
//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
//                   <h3 className="text-lg font-semibold text-yellow-800 mb-2">Page Not Found</h3>
//                   <p className="text-yellow-600 text-sm">
//                     The requested page could not be found.
//                   </p>
//                 </div>
//               </div>
//             } 
//           />
//         </Routes>
//       </main>
//     </div>
//   );
// };

// export default HomePage;








//''''removed the scroll bar which is displaying at right side of entire page in sheet metal page 

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';
import MachineModule from './MachineModule';
import CompositesModule from './CompositesModule';
import SheetMetalModule from './SheetMetalModule';
import TurningProcess from './TurningProcess';
import AccessControl from './AccessControl';
import MachineConfiguration from './MachineConfiguration';
import CompositesProcess from './CompositesProcess';

const HomePage = () => {
  const [userRole, setUserRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUserRole(parsedData.role);
      console.log('HomePage - User role:', parsedData.role);
    }
    setIsLoading(false);
  }, []);

  // Hide scrollbar globally
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, []);

  const WelcomeContent = () => (
    <div className="text-center">
  
    </div>
  );

  const ProtectedRoute = ({ children, moduleType }) => {
    if (isLoading) {
      return <div className="text-center py-8">Loading...</div>;
    }

    if (!userRole) {
      return <Navigate to="/login" replace />;
    }

    if (userRole === 'admin') {
      return children;
    }

    const roleModuleAccess = {
      'Machining Module': ['machine', 'turning'],
      'Composite Module': ['composites'],
      'Sheet Metal Module': ['sheet-metal']
    };

    const allowedModules = roleModuleAccess[userRole] || [];
    
    if (allowedModules.includes(moduleType)) {
      return children;
    }

    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-red-800 mb-2">
            <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h3>
          <p className="text-red-600 text-sm">
            You don't have permission to access this module.
          </p>
          <p className="text-red-500 text-xs mt-2">
            Your current role: <strong>{userRole}</strong>
          </p>
          <p className="text-red-500 text-xs mt-1">
            Required access: <strong>{moduleType}</strong>
          </p>
        </div>
      </div>
    );
  };

  const AdminOnlyRoute = ({ children }) => {
    if (isLoading) {
      return <div className="text-center py-8">Loading...</div>;
    }

    if (!userRole) {
      return <Navigate to="/login" replace />;
    }

    if (userRole !== 'admin') {
      return (
        <div className="text-center py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <div className="text-red-800 mb-2">
              <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Admin Access Required</h3>
            <p className="text-red-600 text-sm">
              You need administrator privileges to access this page.
            </p>
            <p className="text-red-500 text-xs mt-2">
              Your current role: <strong>{userRole}</strong>
            </p>
          </div>
        </div>
      );
    }

    return children;
  };

  const AuthenticatedRoute = ({ children }) => {
    if (isLoading) {
      return <div className="text-center py-8">Loading...</div>;
    }

    if (!userRole) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      overflow: 'hidden'
    }}>
      <Header />
      <Navbar />
      <main style={{ 
        flex: 1, 
        overflow: 'hidden',
        paddingLeft: '24px',
        paddingRight: '24px',
        paddingTop: '5px'
      }}>
        <Routes>
          <Route path="/" element={<WelcomeContent />} />
          
          <Route 
            path="/access-control" 
            element={
              <AdminOnlyRoute>
                <AccessControl />
              </AdminOnlyRoute>
            } 
          />

          <Route 
            path="/machine-configuration" 
            element={
              <AuthenticatedRoute>
                <MachineConfiguration />
              </AuthenticatedRoute>
            } 
          />
          
          <Route 
            path="/machine/*" 
            element={
              <ProtectedRoute moduleType="machine">
                <MachineModule />
              </ProtectedRoute>
            } 
          />
          

          {/* // In HomePage.jsx Routes
<Route 
  path="/composites/*"  // The asterisk (*) is a wildcard
  element={
    <ProtectedRoute moduleType="composites">
      <CompositesModule />  // This component handles sub-routes
    </ProtectedRoute>
  } 
/>
Key Points:

The * (wildcard) means this route matches /composites AND anything after it
So /home/composites/layup matches this route pattern
The * captures the remaining path (/layup) and passes it to CompositesModule */}
          <Route 
            path="/composites/*" 
            element={
              <ProtectedRoute moduleType="composites">
                {/* <CompositesModule />                     */}
                <CompositesProcess/>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/sheet-metal/*" 
            element={
              <ProtectedRoute moduleType="sheet-metal">
                <SheetMetalModule />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/turning" 
            element={
              <ProtectedRoute moduleType="turning">
                <TurningProcess />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="*" 
            element={
              <div className="text-center py-8">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">Page Not Found</h3>
                  <p className="text-yellow-600 text-sm">
                    The requested page could not be found.
                  </p>
                </div>
              </div>
            } 
          />
        </Routes>
      </main>
    </div>
  );
};

export default HomePage;