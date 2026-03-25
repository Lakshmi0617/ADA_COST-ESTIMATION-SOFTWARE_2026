// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import WelcomePage from './components/WelcomePage';
// import HomePage from './components/HomePage';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<WelcomePage />} />
//         <Route path="/home" element={<HomePage />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;



//''''correct working code
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import HomePage from './components/HomePage';
import ViewerPage from './components/ViewerPage';
import TurningViewerPage from './components/TurningViewerPage';
import LoginPage from './components/LoginPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import SheetMetalViewerPage from './components/SheetMetalViewerPage';
import CompositesViewerPage from './components/CompositesViewerPage'; // Add this import


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        {/* Use /* to allow HomePage to handle nested routes */}
        <Route path="/login" element={<LoginPage />} />
         <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/home/*" element={<HomePage />} />
        {/* <Route path="/viewer" element={<ViewerPage />} /> */}
        <Route path="/viewer/:id" element={<ViewerPage />} />
        <Route path="/turning-viewer/:id" element={<TurningViewerPage />} />
         <Route path="/sheet-metal-viewer/:id" element={<SheetMetalViewerPage />} />
            <Route path="/sheet-metal-viewer/:id" element={<SheetMetalViewerPage />} />
        {/* Add the Composites Viewer Route */}
        <Route path="/composites-viewer/:id" element={<CompositesViewerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;




// import React, { useState, useEffect } from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import WelcomePage from './components/WelcomePage';
// import LoginPage from './components/LoginPage';
// import HomePage from './components/HomePage';
// import ViewerPage from './components/ViewerPage';

// function App() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Check for stored user data on app load
//   useEffect(() => {
//     const storedUser = sessionStorage.getItem('userData');
//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (error) {
//         console.error('Error parsing stored user data:', error);
//         sessionStorage.removeItem('userData');
//       }
//     }
//     setLoading(false);
//   }, []);

//   const handleLogin = (userData) => {
//     setUser(userData);
//     sessionStorage.setItem('userData', JSON.stringify(userData));
//   };

//   const handleLogout = () => {
//     setUser(null);
//     sessionStorage.removeItem('userData');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
//       </div>
//     );
//   }

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<WelcomePage />} />
//         <Route 
//           path="/login" 
//           element={
//             user ? <Navigate to="/home" replace /> : <LoginPage onLogin={handleLogin} />
//           } 
//         />
//         <Route 
//           path="/home/*" 
//           element={
//             user ? (
//               <HomePage user={user} onLogout={handleLogout} />
//             ) : (
//               <Navigate to="/login" replace />
//             )
//           } 
//         />
//         <Route 
//           path="/viewer" 
//           element={
//             user ? (
//               <ViewerPage user={user} onLogout={handleLogout} />
//             ) : (
//               <Navigate to="/login" replace />
//             )
//           } 
//         />
//         {/* Redirect any unknown routes to welcome */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import WelcomePage from './components/WelcomePage';
// import HomePage from './components/HomePage';
// import MachineModule from './components/MachineModule';
// import SheetMetalModule from './components/SheetMetalModule';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<WelcomePage />} />
//         <Route path="/home" element={<HomePage />} />
//         <Route path="/home/machine" element={<MachineModule />} />
//         <Route path="/home/sheet-metal" element={<SheetMetalModule />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

