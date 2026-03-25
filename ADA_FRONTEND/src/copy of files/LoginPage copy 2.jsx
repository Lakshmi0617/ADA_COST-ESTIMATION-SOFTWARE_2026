

//''''login is working based on the different module login credebtials only related role based module is showing 

// import { Eye, EyeOff, User, Lock, ChevronDown } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';

// const LoginPage = ({ onNavigate }) => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     role: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   // Fixed role options - removed extra space and aligned with backend expectations
//   const roleOptions = [
//     { value: 'admin', label: 'Admin' },
//     { value: 'Machining Module', label: 'Machining Module' }, // Fixed: removed extra space
//     { value: 'Composite Module', label: 'Composite Module' },
//     { value: 'Sheet Metal Module', label: 'Sheet Metal Module' }
//   ];

//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     setError('');
//   };

//   const handleRoleSelect = (role) => {
//     setFormData(prev => ({
//       ...prev,
//       role: role
//     }));
//     setIsDropdownOpen(false);
//     setError('');
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     console.log('🔍 Login attempt started');
//     console.log('📝 Form data:', formData);

//     if (!formData.username || !formData.password || !formData.role) {
//       console.log('❌ Validation failed: Missing fields');
//       setError('Please fill in all fields');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       console.log('🌐 Making API call to:', 'http://172.18.100.156:8004/login');
//       console.log('📤 Request payload:', {
//         username: formData.username,
//         password: formData.password,
//         role: formData.role
//       });

//       const response = await fetch('http://172.18.100.156:8004/login', {
//         method: 'POST',
//         headers: {
//           'accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: formData.username,
//           password: formData.password,
//           role: formData.role
//         }),
//       });

//       console.log('📥 Response status:', response.status);
//       console.log('📥 Response ok:', response.ok);

//       const data = await response.json();
//       console.log('📥 API Response data:', data);

//       if (response.ok) {
//         // Store user data in sessionStorage for role-based access
//         // Use the role returned from API, fallback to form role
//         const userData = {
//           user_id: data.user_id,
//           role: data.role || formData.role, 
//           username: formData.username,
//           message: data.message
//         };
        
//         console.log('💾 Storing userData in sessionStorage:', userData);
        
//         // Store in sessionStorage
//         sessionStorage.setItem('userData', JSON.stringify(userData));
        
//         // Verify storage
//         const storedData = sessionStorage.getItem('userData');
//         console.log('✅ Verified stored data:', JSON.parse(storedData));

//         console.log('🚀 Attempting navigation to /home');
        
//         // Navigate to home page
//         navigate('/home');

//         // Add a small delay to see if navigation is working
//         setTimeout(() => {
//           console.log('⏰ Post-navigation check - current location:', window.location.pathname);
//         }, 100);

//       } else {
//         console.log('❌ Login failed:', data.message);
//         setError(data.message || 'Login failed. Please check your credentials.');
//       }
//     } catch (error) {
//       console.error('🚨 Login error:', error);
//       console.error('🚨 Error details:', {
//         name: error.name,
//         message: error.message,
//         stack: error.stack
//       });
//       setError('Network error. Please try again. Check console for details.');
//     } finally {
//       setIsLoading(false);
//       console.log('🏁 Login process completed');
//     }
//   };

//   const handleBackToWelcome = () => {
//     navigate('/');
//   };

//   // Test function to simulate successful login (for debugging)
//   const handleTestLogin = () => {
//     console.log('🧪 Test login triggered');
//     const testUserData = {
//       user_id: 3,
//       role: 'Machining Module', // Use exact role from API response
//       username: 'Gokul',
//       message: 'Test login successful'
//     };
    
//     sessionStorage.setItem('userData', JSON.stringify(testUserData));
//     console.log('💾 Test data stored:', testUserData);
//     navigate('/home');
//   };

//   return (
//     <div 
//       className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
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
      
//       <div className="relative z-10 w-full max-w-md px-6">
//         <div 
//           className="backdrop-blur-sm rounded-2xl p-8 shadow-2xl"
//           style={{
//             backgroundColor: 'rgba(255, 255, 255, 0.95)',
//             border: '1px solid rgba(116, 182, 202, 0.3)'
//           }}
//         >
//           {/* Logo */}
//           <div className="text-center mb-8">
//             <div className="inline-block relative">
//               <div 
//                 className="absolute inset-0 rounded-full blur-lg opacity-40"
//                 style={{ backgroundColor: '#145da0' }}
//               ></div>
//               <img 
//                 src="/ADA_LOGO.jpg" 
//                 alt="ADA Logo" 
//                 className="relative h-20 w-20 mx-auto rounded-full shadow-xl"
//                 style={{ 
//                   border: '3px solid #145da0',
//                   filter: 'drop-shadow(0 4px 8px rgba(20, 93, 160, 0.3))'
//                 }}
//               />
//             </div>
//             <h1 
//               className="text-2xl font-bold mt-4 mb-2"
//               style={{ color: '#145da0', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
//             >
//               Welcome Back
//             </h1>
//             <p className="text-gray-600 text-sm">Please sign in to continue</p>
//           </div>

       

//           {/* Error Message */}
//           {error && (
//             <div 
//               className="mb-4 p-3 rounded-lg text-sm text-red-700"
//               style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
//             >
//               {error}
//             </div>
//           )}

//           {/* Login Form */}
//           <form onSubmit={handleLogin} className="space-y-6">
//             {/* Username Field */}
//             <div>
//               <label className="block text-sm font-medium mb-2" style={{ color: '#145da0' }}>
//                 Username
//               </label>
//               <div className="relative">
//                 <User 
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
//                   size={18} 
//                 />
//                 <input
//                   type="text"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleInputChange}
//                   className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200"
//                   style={{
//                     borderColor: '#e5e7eb'
//                   }}
//                   onFocus={(e) => {
//                     e.target.style.borderColor = '#145da0';
//                     e.target.style.boxShadow = '0 0 0 2px rgba(20, 93, 160, 0.2)';
//                   }}
//                   onBlur={(e) => {
//                     e.target.style.borderColor = '#e5e7eb';
//                     e.target.style.boxShadow = 'none';
//                   }}
//                   placeholder="Enter your username"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Password Field */}
//             <div>
//               <label className="block text-sm font-medium mb-2" style={{ color: '#145da0' }}>
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock 
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
//                   size={18} 
//                 />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   className="w-full pl-10 pr-12 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200"
//                   style={{
//                     borderColor: '#e5e7eb'
//                   }}
//                   onFocus={(e) => {
//                     e.target.style.borderColor = '#145da0';
//                     e.target.style.boxShadow = '0 0 0 2px rgba(20, 93, 160, 0.2)';
//                   }}
//                   onBlur={(e) => {
//                     e.target.style.borderColor = '#e5e7eb';
//                     e.target.style.boxShadow = 'none';
//                   }}
//                   placeholder="Enter your password"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//             </div>

//             {/* Role Dropdown */}
//             <div>
//               <label className="block text-sm font-medium mb-2" style={{ color: '#145da0' }}>
//                 Select Role
//               </label>
//               <div className="relative">
//                 <button
//                   type="button"
//                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                   className="w-full px-4 py-3 text-left rounded-lg border bg-white focus:outline-none focus:ring-2 transition-all duration-200 flex items-center justify-between"
//                   style={{
//                     borderColor: '#e5e7eb'
//                   }}
//                   onFocus={(e) => {
//                     e.target.style.borderColor = '#145da0';
//                     e.target.style.boxShadow = '0 0 0 2px rgba(20, 93, 160, 0.2)';
//                   }}
//                   onBlur={(e) => {
//                     setTimeout(() => {
//                       e.target.style.borderColor = '#e5e7eb';
//                       e.target.style.boxShadow = 'none';
//                     }, 100);
//                   }}
//                 >
//                   <span className={formData.role ? 'text-gray-900' : 'text-gray-400'}>
//                     {formData.role ? roleOptions.find(opt => opt.value === formData.role)?.label : 'Select a role'}
//                   </span>
//                   <ChevronDown 
//                     className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
//                     size={18} 
//                   />
//                 </button>
                
//                 {isDropdownOpen && (
//                   <div 
//                     className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10"
//                     style={{ borderColor: '#e5e7eb' }}
//                   >
//                     {roleOptions.map((option) => (
//                       <button
//                         key={option.value}
//                         type="button"
//                         onClick={() => handleRoleSelect(option.value)}
//                         className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
//                         style={{
//                           color: formData.role === option.value ? '#145da0' : '#374151'
//                         }}
//                         onMouseEnter={(e) => {
//                           e.target.style.backgroundColor = 'rgba(20, 93, 160, 0.1)';
//                         }}
//                         onMouseLeave={(e) => {
//                           e.target.style.backgroundColor = formData.role === option.value ? 'rgba(20, 93, 160, 0.1)' : '';
//                         }}
//                       >
//                         {option.label}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Login Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//               style={{
//                 backgroundColor: isLoading ? '#9ca3af' : '#246679',
//                 border: '2px solid #145da0'
//               }}
//               onMouseEnter={(e) => {
//                 if (!isLoading) {
//                   e.target.style.backgroundColor = '#145da0';
//                   e.target.style.transform = 'translateY(-1px)';
//                   e.target.style.boxShadow = '0 4px 12px rgba(36, 102, 121, 0.3)';
//                 }
//               }}
//               onMouseLeave={(e) => {
//                 if (!isLoading) {
//                   e.target.style.backgroundColor = '#246679';
//                   e.target.style.transform = 'translateY(0)';
//                   e.target.style.boxShadow = 'none';
//                 }
//               }}
//             >
//               {isLoading ? (
//                 <div className="flex items-center justify-center">
//                   <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
//                   Signing In...
//                 </div>
//               ) : (
//                 'Sign In'
//               )}
//             </button>
//           </form>

//           {/* Back to Welcome */}
//           <div className="mt-6 text-center">
//             <button
//               onClick={handleBackToWelcome}
//               className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
//             >
//               ← Back to Welcome
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;








// import { Eye, EyeOff, User, Lock, ChevronDown } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';

// const LoginPage = ({ onNavigate }) => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     role: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   // Fixed role options - removed extra space and aligned with backend expectations
//   const roleOptions = [
//     { value: 'admin', label: 'Admin' },
//     { value: 'Machining Module', label: 'Machining Module' }, // Fixed: removed extra space
//     { value: 'Composite Module', label: 'Composite Module' },
//     { value: 'Sheet Metal Module', label: 'Sheet Metal Module' }
//   ];

//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     setError('');
//   };

//   const handleRoleSelect = (role) => {
//     setFormData(prev => ({
//       ...prev,
//       role: role
//     }));
//     setIsDropdownOpen(false);
//     setError('');
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     console.log('🔍 Login attempt started');
//     console.log('📝 Form data:', formData);

//     if (!formData.username || !formData.password || !formData.role) {
//       console.log('❌ Validation failed: Missing fields');
//       setError('Please fill in all fields');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       console.log('🌐 Making API call to:', 'http://172.18.100.156:8004/login');
//       console.log('📤 Request payload:', {
//         username: formData.username,
//         password: formData.password,
//         role: formData.role
//       });

//       const response = await fetch('http://172.18.100.156:8004/login', {
//         method: 'POST',
//         headers: {
//           'accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: formData.username,
//           password: formData.password,
//           role: formData.role
//         }),
//       });

//       console.log('📥 Response status:', response.status);
//       console.log('📥 Response ok:', response.ok);

//       const data = await response.json();
//       console.log('📥 API Response data:', data);

//       if (response.ok) {
//         // Store user data in sessionStorage for role-based access
//         // Use the role returned from API, fallback to form role
//         const userData = {
//           user_id: data.user_id,
//           role: data.role || formData.role, 
//           username: formData.username,
//           message: data.message
//         };
        
//         console.log('💾 Storing userData in sessionStorage:', userData);
        
//         // Store in sessionStorage
//         sessionStorage.setItem('userData', JSON.stringify(userData));
        
//         // Verify storage
//         const storedData = sessionStorage.getItem('userData');
//         console.log('✅ Verified stored data:', JSON.parse(storedData));

//         console.log('🚀 Attempting navigation to /home');
        
//         // Navigate to home page
//         navigate('/home');

//         // Add a small delay to see if navigation is working
//         setTimeout(() => {
//           console.log('⏰ Post-navigation check - current location:', window.location.pathname);
//         }, 100);

//       } else {
//         console.log('❌ Login failed:', data.message);
//         setError(data.message || 'Login failed. Please check your credentials.');
//       }
//     } catch (error) {
//       console.error('🚨 Login error:', error);
//       console.error('🚨 Error details:', {
//         name: error.name,
//         message: error.message,
//         stack: error.stack
//       });
//       setError('Network error. Please try again. Check console for details.');
//     } finally {
//       setIsLoading(false);
//       console.log('🏁 Login process completed');
//     }
//   };

//   const handleBackToWelcome = () => {
//     navigate('/');
//   };

//   // Test function to simulate successful login (for debugging)
//   const handleTestLogin = () => {
//     console.log('🧪 Test login triggered');
//     const testUserData = {
//       user_id: 3,
//       role: 'Machining Module', // Use exact role from API response
//       username: 'Gokul',
//       message: 'Test login successful'
//     };
    
//     sessionStorage.setItem('userData', JSON.stringify(testUserData));
//     console.log('💾 Test data stored:', testUserData);
//     navigate('/home');
//   };

//   return (
//     <div className="min-h-screen relative">
//       {/* Background with three images in a row */}
//       <div className="absolute inset-0">
//         <div className="w-full h-full flex">
//           {/* Machining Image */}
//           <div 
//             className="flex-1 bg-cover bg-center bg-no-repeat"
//             style={{
//               backgroundImage: 'url(/machining.jpg)'
//             }}
//           ></div>
          
//           {/* Composite Image */}
//           <div 
//             className="flex-1 bg-cover bg-center bg-no-repeat"
//             style={{
//               backgroundImage: 'url(/composite1.jpg)'
//             }}
//           ></div>
          
//           {/* Sheet Metal Image */}
//           <div 
//             className="flex-1 bg-cover bg-center bg-no-repeat"
//             style={{
//               backgroundImage: 'url(/sheetmetal.jpg)'
//             }}
//           ></div>
//         </div>
        
//         {/* Removed the overlay to keep background clearly visible */}
//       </div>
      
//       {/* Login Form Container - Positioned lower with clear background visibility */}
//       <div className="relative z-10 min-h-screen flex items-end justify-center pb-8">
//         <div className="w-full max-w-md px-6">
//           <div 
//             className="rounded-2xl p-8 shadow-2xl"
//             style={{
//               backgroundColor: 'rgba(255, 255, 255, 0.25)', // Slightly more opaque for readability
//               border: '1px solid rgba(255, 255, 255, 0.3)',
//               // Removed backdrop blur to keep background clear
//             }}
//           >
//             {/* Logo */}
//             <div className="text-center mb-8">
//               <div className="inline-block relative">
//                 <div 
//                   className="absolute inset-0 rounded-full blur-lg opacity-40"
//                   style={{ backgroundColor: '#145da0' }}
//                 ></div>
//                 <img 
//                   src="/ADA_LOGO.jpg" 
//                   alt="ADA Logo" 
//                   className="relative h-20 w-20 mx-auto rounded-full shadow-xl"
//                   style={{ 
//                     border: '3px solid #145da0',
//                     filter: 'drop-shadow(0 4px 8px rgba(20, 93, 160, 0.3))'
//                   }}
//                 />
//               </div>
//               <h1 
//                 className="text-2xl font-bold mt-4 mb-2 text-white drop-shadow-lg"
//                 style={{ 
//                   fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
//                   textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' // Stronger shadow for better readability
//                 }}
//               >
//                 Welcome Back
//               </h1>
//               <p className="text-white text-sm opacity-90" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
//                 Please sign in to continue
//               </p>
//             </div>

//             {/* Error Message */}
//             {error && (
//               <div 
//                 className="mb-4 p-3 rounded-lg text-sm text-red-100"
//                 style={{ 
//                   backgroundColor: 'rgba(239, 68, 68, 0.4)', 
//                   border: '1px solid rgba(239, 68, 68, 0.5)',
//                 }}
//               >
//                 {error}
//               </div>
//             )}

//             {/* Login Form */}
//             <form onSubmit={handleLogin} className="space-y-6">
//               {/* Username Field */}
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-white" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
//                   Username
//                 </label>
//                 <div className="relative">
//                   <User 
//                     className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" 
//                     size={18} 
//                   />
//                   <input
//                     type="text"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleInputChange}
//                     className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 text-gray-900"
//                     style={{
//                       backgroundColor: 'rgba(255, 255, 255, 0.95)', // Higher opacity for better readability
//                       borderColor: 'rgba(255, 255, 255, 0.4)',
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = '#145da0';
//                       e.target.style.boxShadow = '0 0 0 2px rgba(20, 93, 160, 0.2)';
//                       e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
//                       e.target.style.boxShadow = 'none';
//                       e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
//                     }}
//                     placeholder="Enter your username"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Password Field */}
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-white" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
//                   Password
//                 </label>
//                 <div className="relative">
//                   <Lock 
//                     className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" 
//                     size={18} 
//                   />
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     className="w-full pl-10 pr-12 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 text-gray-900"
//                     style={{
//                       backgroundColor: 'rgba(255, 255, 255, 0.95)',
//                       borderColor: 'rgba(255, 255, 255, 0.4)',
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = '#145da0';
//                       e.target.style.boxShadow = '0 0 0 2px rgba(20, 93, 160, 0.2)';
//                       e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
//                       e.target.style.boxShadow = 'none';
//                       e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
//                     }}
//                     placeholder="Enter your password"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 </div>
//               </div>

//               {/* Role Dropdown */}
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-white" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
//                   Select Role
//                 </label>
//                 <div className="relative">
//                   <button
//                     type="button"
//                     onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                     className="w-full px-4 py-3 text-left rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 flex items-center justify-between text-gray-900"
//                     style={{
//                       backgroundColor: 'rgba(255, 255, 255, 0.95)',
//                       borderColor: 'rgba(255, 255, 255, 0.4)',
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = '#145da0';
//                       e.target.style.boxShadow = '0 0 0 2px rgba(20, 93, 160, 0.2)';
//                       e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
//                     }}
//                     onBlur={(e) => {
//                       setTimeout(() => {
//                         e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
//                         e.target.style.boxShadow = 'none';
//                         e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
//                       }, 100);
//                     }}
//                   >
//                     <span className={formData.role ? 'text-gray-900' : 'text-gray-500'}>
//                       {formData.role ? roleOptions.find(opt => opt.value === formData.role)?.label : 'Select a role'}
//                     </span>
//                     <ChevronDown 
//                       className={`transition-transform duration-200 text-gray-500 ${isDropdownOpen ? 'rotate-180' : ''}`} 
//                       size={18} 
//                     />
//                   </button>
                  
//                   {isDropdownOpen && (
//                     <div 
//                       className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg z-10"
//                       style={{ 
//                         backgroundColor: 'rgba(255, 255, 255, 0.98)',
//                         border: '1px solid rgba(255, 255, 255, 0.4)',
//                       }}
//                     >
//                       {roleOptions.map((option) => (
//                         <button
//                           key={option.value}
//                           type="button"
//                           onClick={() => handleRoleSelect(option.value)}
//                           className="w-full px-4 py-3 text-left transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg text-gray-900"
//                           style={{
//                             color: formData.role === option.value ? '#145da0' : '#374151'
//                           }}
//                           onMouseEnter={(e) => {
//                             e.target.style.backgroundColor = 'rgba(20, 93, 160, 0.15)';
//                           }}
//                           onMouseLeave={(e) => {
//                             e.target.style.backgroundColor = formData.role === option.value ? 'rgba(20, 93, 160, 0.1)' : '';
//                           }}
//                         >
//                           {option.label}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Login Button */}
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                 style={{
//                   backgroundColor: isLoading ? 'rgba(156, 163, 175, 0.8)' : 'rgba(36, 102, 121, 0.9)',
//                   border: '2px solid rgba(20, 93, 160, 0.8)',
//                 }}
//                 onMouseEnter={(e) => {
//                   if (!isLoading) {
//                     e.target.style.backgroundColor = 'rgba(20, 93, 160, 0.9)';
//                     e.target.style.transform = 'translateY(-1px)';
//                     e.target.style.boxShadow = '0 4px 12px rgba(36, 102, 121, 0.4)';
//                   }
//                 }}
//                 onMouseLeave={(e) => {
//                   if (!isLoading) {
//                     e.target.style.backgroundColor = 'rgba(36, 102, 121, 0.9)';
//                     e.target.style.transform = 'translateY(0)';
//                     e.target.style.boxShadow = 'none';
//                   }
//                 }}
//               >
//                 {isLoading ? (
//                   <div className="flex items-center justify-center">
//                     <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
//                     Signing In...
//                   </div>
//                 ) : (
//                   'Sign In'
//                 )}
//               </button>
//             </form>

//             {/* Back to Welcome */}
//             <div className="mt-6 text-center">
//               <button
//                 onClick={handleBackToWelcome}
//                 className="text-sm text-white opacity-90 hover:opacity-100 transition-all duration-200"
//                 style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}
//               >
//                 ← Back to Welcome
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;











// import { Eye, EyeOff, User, Lock, ChevronDown } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';

// const LoginPage = ({ onNavigate }) => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     role: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   // Fixed role options - removed extra space and aligned with backend expectations
//   const roleOptions = [
//     { value: 'admin', label: 'Admin' },
//     { value: 'Machining Module', label: 'Machining Module' }, // Fixed: removed extra space
//     { value: 'Composite Module', label: 'Composite Module' },
//     { value: 'Sheet Metal Module', label: 'Sheet Metal Module' }
//   ];

//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     setError('');
//   };

//   const handleRoleSelect = (role) => {
//     setFormData(prev => ({
//       ...prev,
//       role: role
//     }));
//     setIsDropdownOpen(false);
//     setError('');
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     console.log('🔍 Login attempt started');
//     console.log('📝 Form data:', formData);

//     if (!formData.username || !formData.password || !formData.role) {
//       console.log('❌ Validation failed: Missing fields');
//       setError('Please fill in all fields');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       console.log('🌐 Making API call to:', 'http://172.18.100.156:8004/login');
//       console.log('📤 Request payload:', {
//         username: formData.username,
//         password: formData.password,
//         role: formData.role
//       });

//       const response = await fetch('http://172.18.100.156:8004/login', {
//         method: 'POST',
//         headers: {
//           'accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: formData.username,
//           password: formData.password,
//           role: formData.role
//         }),
//       });

//       console.log('📥 Response status:', response.status);
//       console.log('📥 Response ok:', response.ok);

//       const data = await response.json();
//       console.log('📥 API Response data:', data);

//       if (response.ok) {
//         // Store user data in sessionStorage for role-based access
//         // Use the role returned from API, fallback to form role
//         const userData = {
//           user_id: data.user_id,
//           role: data.role || formData.role, 
//           username: formData.username,
//           message: data.message
//         };
        
//         console.log('💾 Storing userData in sessionStorage:', userData);
        
//         // Store in sessionStorage
//         sessionStorage.setItem('userData', JSON.stringify(userData));
        
//         // Verify storage
//         const storedData = sessionStorage.getItem('userData');
//         console.log('✅ Verified stored data:', JSON.parse(storedData));

//         console.log('🚀 Attempting navigation to /home');
        
//         // Navigate to home page
//         navigate('/home');

//         // Add a small delay to see if navigation is working
//         setTimeout(() => {
//           console.log('⏰ Post-navigation check - current location:', window.location.pathname);
//         }, 100);

//       } else {
//         console.log('❌ Login failed:', data.message);
//         setError(data.message || 'Login failed. Please check your credentials.');
//       }
//     } catch (error) {
//       console.error('🚨 Login error:', error);
//       console.error('🚨 Error details:', {
//         name: error.name,
//         message: error.message,
//         stack: error.stack
//       });
//       setError('Network error. Please try again. Check console for details.');
//     } finally {
//       setIsLoading(false);
//       console.log('🏁 Login process completed');
//     }
//   };

//   const handleBackToWelcome = () => {
//     navigate('/');
//   };

//   return (
//     <div className="min-h-screen relative">
//       {/* Background with three images in a row */}
//       <div className="absolute inset-0">
//         <div className="w-full h-full flex">
//           {/* Machining Image */}
//           <div 
//             className="flex-1 bg-cover bg-center bg-no-repeat relative"
//             style={{
//               backgroundImage: 'url(/machining.jpg)'
//             }}
//           >
//             {/* Machining Process Heading */}
//             <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
//               <h2 className="text-2xl font-bold text-black bg-white bg-opacity-80 px-6 py-3 rounded-lg shadow-lg backdrop-blur-sm">
//                 Machining Process
//               </h2>
//             </div>
//             {/* Black Icon for Machining */}
          
//           </div>
          
//           {/* Composite Image */}
//           <div 
//             className="flex-1 bg-cover bg-center bg-no-repeat relative"
//             style={{
//               backgroundImage: 'url(/composite1.jpg)'
//             }}
//           >
//             {/* Composite Process Heading */}
//             <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
//               <h2 className="text-2xl font-bold text-black bg-white bg-opacity-80 px-6 py-3 rounded-lg shadow-lg backdrop-blur-sm">
//                 Composite Process
//               </h2>
//             </div>
//             {/* Black Icon for Composite */}
      
//           </div>
          
//           {/* Sheet Metal Image */}
//           <div 
//             className="flex-1 bg-cover bg-center bg-no-repeat relative"
//             style={{
//               backgroundImage: 'url(/sheetmetal.jpg)'
//             }}
//           >
//             {/* Sheet Metal Process Heading */}
//             <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
//               <h2 className="text-2xl font-bold text-black bg-white bg-opacity-80 px-6 py-3 rounded-lg shadow-lg backdrop-blur-sm">
//                 Sheet Metal Process
//               </h2>
//             </div>
        
//           </div>
//         </div>
//       </div>
      
//       {/* Login Form Container - Centered both vertically and horizontally */}
//       <div className="relative z-10 min-h-screen flex items-center justify-center ">
//         <div className="w-full max-w-md px-6">
//           <div 
//             className="rounded-2xl p-8 shadow-2xl"
//             style={{
//               backgroundColor: 'rgba(255, 255, 255, 0.25)', // Slightly more opaque for readability
//               border: '1px solid rgba(255, 255, 255, 0.3)',
//               // Removed backdrop blur to keep background clear
//             }}
//           >
//             {/* Logo */}
//             <div className="text-center mb-8">
//               <div className="inline-block relative">
//                 <div 
//                   className="absolute inset-0 rounded-full blur-lg opacity-40"
//                   style={{ backgroundColor: '#145da0' }}
//                 ></div>
//                 <img 
//                   src="/ADA_LOGO.jpg" 
//                   alt="ADA Logo" 
//                   className="relative h-20 w-20 mx-auto rounded-full shadow-xl"
//                   style={{ 
//                     border: '3px solid #145da0',
//                     filter: 'drop-shadow(0 4px 8px rgba(20, 93, 160, 0.3))'
//                   }}
//                 />
//               </div>
//               <h1 
//                 className="text-2xl font-bold mt-4 mb-2 text-white drop-shadow-lg"
//                 style={{ 
//                   fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
//                   textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' // Stronger shadow for better readability
//                 }}
//               >
//                 Welcome Back
//               </h1>
//               <p className="text-white text-sm opacity-90" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
//                 Please sign in to continue
//               </p>
//             </div>

//             {/* Error Message */}
//             {error && (
//               <div 
//                 className="mb-4 p-3 rounded-lg text-sm text-red-100"
//                 style={{ 
//                   backgroundColor: 'rgba(239, 68, 68, 0.4)', 
//                   border: '1px solid rgba(239, 68, 68, 0.5)',
//                 }}
//               >
//                 {error}
//               </div>
//             )}

//             {/* Login Form */}
//             <form onSubmit={handleLogin} className="space-y-6">
//               {/* Username Field */}
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-white" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
//                   Username
//                 </label>
//                 <div className="relative">
//                   <User 
//                     className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" 
//                     size={18} 
//                   />
//                   <input
//                     type="text"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleInputChange}
//                     className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 text-gray-900"
//                     style={{
//                       backgroundColor: 'rgba(255, 255, 255, 0.95)', // Higher opacity for better readability
//                       borderColor: 'rgba(255, 255, 255, 0.4)',
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = '#145da0';
//                       e.target.style.boxShadow = '0 0 0 2px rgba(20, 93, 160, 0.2)';
//                       e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
//                       e.target.style.boxShadow = 'none';
//                       e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
//                     }}
//                     placeholder="Enter your username"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Password Field */}
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-white" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
//                   Password
//                 </label>
//                 <div className="relative">
//                   <Lock 
//                     className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" 
//                     size={18} 
//                   />
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     className="w-full pl-10 pr-12 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 text-gray-900"
//                     style={{
//                       backgroundColor: 'rgba(255, 255, 255, 0.95)',
//                       borderColor: 'rgba(255, 255, 255, 0.4)',
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = '#145da0';
//                       e.target.style.boxShadow = '0 0 0 2px rgba(20, 93, 160, 0.2)';
//                       e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
//                       e.target.style.boxShadow = 'none';
//                       e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
//                     }}
//                     placeholder="Enter your password"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 </div>
//               </div>

//               {/* Role Dropdown */}
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-white" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
//                   Select Role
//                 </label>
//                 <div className="relative">
//                   <button
//                     type="button"
//                     onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                     className="w-full px-4 py-3 text-left rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 flex items-center justify-between text-gray-900"
//                     style={{
//                       backgroundColor: 'rgba(255, 255, 255, 0.95)',
//                       borderColor: 'rgba(255, 255, 255, 0.4)',
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = '#145da0';
//                       e.target.style.boxShadow = '0 0 0 2px rgba(20, 93, 160, 0.2)';
//                       e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
//                     }}
//                     onBlur={(e) => {
//                       setTimeout(() => {
//                         e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
//                         e.target.style.boxShadow = 'none';
//                         e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
//                       }, 100);
//                     }}
//                   >
//                     <span className={formData.role ? 'text-gray-900' : 'text-gray-500'}>
//                       {formData.role ? roleOptions.find(opt => opt.value === formData.role)?.label : 'Select a role'}
//                     </span>
//                     <ChevronDown 
//                       className={`transition-transform duration-200 text-gray-500 ${isDropdownOpen ? 'rotate-180' : ''}`} 
//                       size={18} 
//                     />
//                   </button>
                  
//                   {isDropdownOpen && (
//                     <div 
//                       className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg z-10"
//                       style={{ 
//                         backgroundColor: 'rgba(255, 255, 255, 0.98)',
//                         border: '1px solid rgba(255, 255, 255, 0.4)',
//                       }}
//                     >
//                       {roleOptions.map((option) => (
//                         <button
//                           key={option.value}
//                           type="button"
//                           onClick={() => handleRoleSelect(option.value)}
//                           className="w-full px-4 py-3 text-left transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg text-gray-900"
//                           style={{
//                             color: formData.role === option.value ? '#145da0' : '#374151'
//                           }}
//                           onMouseEnter={(e) => {
//                             e.target.style.backgroundColor = 'rgba(20, 93, 160, 0.15)';
//                           }}
//                           onMouseLeave={(e) => {
//                             e.target.style.backgroundColor = formData.role === option.value ? 'rgba(20, 93, 160, 0.1)' : '';
//                           }}
//                         >
//                           {option.label}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Login Button */}
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                 style={{
//                   backgroundColor: isLoading ? 'rgba(156, 163, 175, 0.8)' : 'rgba(36, 102, 121, 0.9)',
//                   border: '2px solid rgba(20, 93, 160, 0.8)',
//                 }}
//                 onMouseEnter={(e) => {
//                   if (!isLoading) {
//                     e.target.style.backgroundColor = 'rgba(20, 93, 160, 0.9)';
//                     e.target.style.transform = 'translateY(-1px)';
//                     e.target.style.boxShadow = '0 4px 12px rgba(36, 102, 121, 0.4)';
//                   }
//                 }}
//                 onMouseLeave={(e) => {
//                   if (!isLoading) {
//                     e.target.style.backgroundColor = 'rgba(36, 102, 121, 0.9)';
//                     e.target.style.transform = 'translateY(0)';
//                     e.target.style.boxShadow = 'none';
//                   }
//                 }}
//               >
//                 {isLoading ? (
//                   <div className="flex items-center justify-center">
//                     <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
//                     Signing In...
//                   </div>
//                 ) : (
//                   'Sign In'
//                 )}
//               </button>
//             </form>

//             {/* Back to Welcome */}
//             <div className="mt-6 text-center">
//               <button
//                 // onClick={handleBackToWelcome}
//                 className="text-sm text-white opacity-90 hover:opacity-100 transition-all duration-200"
//                 style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}
//               >
//                click on sign in to continue
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;






















// ''''''''vinod '''''''//

// import { Eye, EyeOff, User, Lock, ChevronDown } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';

// const LoginPage = ({ onNavigate }) => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     role: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   // Fixed role options - removed extra space and aligned with backend expectations
//   const roleOptions = [
//     { value: 'admin', label: 'Admin' },
//     { value: 'Machining Module', label: 'Machining Module' },
//     { value: 'Composite Module', label: 'Composite Module' },
//     { value: 'Sheet Metal Module', label: 'Sheet Metal Module' }
//   ];

//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     setError('');
//   };

//   const handleRoleSelect = (role) => {
//     setFormData(prev => ({
//       ...prev,
//       role: role
//     }));
//     setIsDropdownOpen(false);
//     setError('');
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     console.log('🔍 Login attempt started');
//     console.log('📝 Form data:', formData);

//     if (!formData.username || !formData.password || !formData.role) {
//       console.log('❌ Validation failed: Missing fields');
//       setError('Please fill in all fields');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       console.log('🌐 Making API call to:', 'http://172.18.100.156:8004/login');
//       console.log('📤 Request payload:', {
//         username: formData.username,
//         password: formData.password,
//         role: formData.role
//       });

//       const response = await fetch('http://172.18.100.156:8004/login', {
//         method: 'POST',
//         headers: {
//           'accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: formData.username,
//           password: formData.password,
//           role: formData.role
//         }),
//       });

//       console.log('📥 Response status:', response.status);
//       console.log('📥 Response ok:', response.ok);

//       const data = await response.json();
//       console.log('📥 API Response data:', data);

//       if (response.ok) {
//         // Store user data in sessionStorage for role-based access
//         const userData = {
//           user_id: data.user_id,
//           role: data.role || formData.role, 
//           username: formData.username,
//           message: data.message
//         };
        
//         console.log('💾 Storing userData in sessionStorage:', userData);
        
//         // Store in sessionStorage
//         sessionStorage.setItem('userData', JSON.stringify(userData));
        
//         // Verify storage
//         const storedData = sessionStorage.getItem('userData');
//         console.log('✅ Verified stored data:', JSON.parse(storedData));

//         console.log('🚀 Attempting navigation to /home');
        
//         // Navigate to home page
//         navigate('/home');

//         // Add a small delay to see if navigation is working
//         setTimeout(() => {
//           console.log('⏰ Post-navigation check - current location:', window.location.pathname);
//         }, 100);

//       } else {
//         console.log('❌ Login failed:', data.message);
//         setError(data.message || 'Login failed. Please check your credentials.');
//       }
//     } catch (error) {
//       console.error('🚨 Login error:', error);
//       console.error('🚨 Error details:', {
//         name: error.name,
//         message: error.message,
//         stack: error.stack
//       });
//       setError('Network error. Please try again. Check console for details.');
//     } finally {
//       setIsLoading(false);
//       console.log('🏁 Login process completed');
//     }
//   };

//   const handleBackToWelcome = () => {
//     navigate('/');
//   };

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       {/* Background with three blurred images in a row */}
//       <div className="absolute inset-0">
//         <div className="w-full h-full flex">
//           {/* Machining Image with Blur */}
//           <div 
//             className="flex-1 bg-cover bg-center bg-no-repeat relative"
//             style={{
//               backgroundImage: 'url(/machining.jpg)',
//               filter: 'blur(3px)',
//               transform: 'scale(1.1)' // Slight scale to avoid blur edges
//             }}
//           >
//             {/* Dark overlay for better contrast */}
//             <div className="absolute inset-0 bg-black bg-opacity-40"></div>
//           </div>
          
//           {/* Composite Image with Blur */}
//           <div 
//             className="flex-1 bg-cover bg-center bg-no-repeat relative"
//             style={{
//               backgroundImage: 'url(/composite1.jpg)',
//               filter: 'blur(3px)',
//               transform: 'scale(1.1)'
//             }}
//           >
//             <div className="absolute inset-0 bg-black bg-opacity-40"></div>
//           </div>
          
//           {/* Sheet Metal Image with Blur */}
//           <div 
//             className="flex-1 bg-cover bg-center bg-no-repeat relative"
//             style={{
//               backgroundImage: 'url(/sheetmetal.jpg)',
//               filter: 'blur(3px)',
//               transform: 'scale(1.1)'
//             }}
//           >
//             <div className="absolute inset-0 bg-black bg-opacity-40"></div>
//           </div>
//         </div>
//       </div>

//       {/* Process Labels - Positioned over blurred background */}
//       <div className="absolute top-0 left-0 right-0 z-5 flex">
//         <div className="flex-1 flex justify-center pt-8">
//           <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl shadow-2xl backdrop-blur-sm border border-white border-opacity-20">
//             <h2 className="text-xl font-bold text-center">Machining Process</h2>
//           </div>
//         </div>
//         <div className="flex-1 flex justify-center pt-8">
//           <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl shadow-2xl backdrop-blur-sm border border-white border-opacity-20">
//             <h2 className="text-xl font-bold text-center">Composite Process</h2>
//           </div>
//         </div>
//         <div className="flex-1 flex justify-center pt-8">
//           <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl shadow-2xl backdrop-blur-sm border border-white border-opacity-20">
//             <h2 className="text-xl font-bold text-center">Sheet Metal Process</h2>
//           </div>
//         </div>
//       </div>
      
//       {/* Login Form Container - High contrast with glassmorphism */}
//       <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
//         <div className="w-full max-w-md">
//           <div 
//             className="rounded-3xl p-8 shadow-2xl border backdrop-blur-xl"
//             style={{
//               background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
//               borderColor: 'rgba(255, 255, 255, 0.2)',
//               boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
//             }}
//           >
//             {/* Logo Section with Enhanced Styling */}
//             <div className="text-center mb-8">
//               <div className="inline-block relative mb-6">
//                 {/* Glowing effect behind logo */}
//                 <div 
//                   className="absolute inset-0 rounded-full blur-xl opacity-60 animate-pulse"
//                   style={{ backgroundColor: '#3b82f6', transform: 'scale(1.5)' }}
//                 ></div>
//                 <div 
//                   className="absolute inset-0 rounded-full blur-lg opacity-40"
//                   style={{ backgroundColor: '#1d4ed8', transform: 'scale(1.2)' }}
//                 ></div>
//                 <img 
//                   src="/ADA_LOGO.jpg" 
//                   alt="ADA Logo" 
//                   className="relative h-24 w-24 mx-auto rounded-full shadow-2xl border-4 border-white border-opacity-50"
//                   style={{ 
//                     filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))'
//                   }}
//                 />
//               </div>
//               <h1 className="text-3xl font-bold mb-3 text-white">
//                 <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent drop-shadow-lg">
//                   Welcome Back
//                 </span>
//               </h1>
//               <p className="text-blue-100 text-lg font-medium opacity-90">
//                 Please sign in to continue
//               </p>
//             </div>

//             {/* Error Message with Better Styling */}
//             {error && (
//               <div className="mb-6 p-4 rounded-xl text-sm text-red-100 bg-gradient-to-r from-red-500 to-red-600 bg-opacity-20 border border-red-400 border-opacity-30 backdrop-blur-sm">
//                 <div className="flex items-center">
//                   <div className="w-2 h-2 bg-red-300 rounded-full mr-3 animate-pulse"></div>
//                   {error}
//                 </div>
//               </div>
//             )}

//             {/* Login Form with Enhanced Styling */}
//             <form onSubmit={handleLogin} className="space-y-6">
//               {/* Username Field */}
//               <div>
//                 <label className="block text-sm font-semibold mb-3 text-blue-100">
//                   Username
//                 </label>
//                 <div className="relative">
//                   <User 
//                     className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600" 
//                     size={20} 
//                   />
//                   <input
//                     type="text"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleInputChange}
//                     className="w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:outline-none focus:ring-0 transition-all duration-300 text-gray-800 font-medium"
//                     style={{
//                       backgroundColor: 'rgba(255, 255, 255, 0.95)',
//                       borderColor: 'rgba(59, 130, 246, 0.3)',
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = '#3b82f6';
//                       e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
//                       e.target.style.transform = 'translateY(-1px)';
//                       e.target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.2)';
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)';
//                       e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
//                       e.target.style.transform = 'translateY(0)';
//                       e.target.style.boxShadow = 'none';
//                     }}
//                     placeholder="Enter your username"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Password Field */}
//               <div>
//                 <label className="block text-sm font-semibold mb-3 text-blue-100">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <Lock 
//                     className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600" 
//                     size={20} 
//                   />
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     className="w-full pl-12 pr-14 py-4 rounded-xl border-2 focus:outline-none focus:ring-0 transition-all duration-300 text-gray-800 font-medium"
//                     style={{
//                       backgroundColor: 'rgba(255, 255, 255, 0.95)',
//                       borderColor: 'rgba(59, 130, 246, 0.3)',
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = '#3b82f6';
//                       e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
//                       e.target.style.transform = 'translateY(-1px)';
//                       e.target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.2)';
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)';
//                       e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
//                       e.target.style.transform = 'translateY(0)';
//                       e.target.style.boxShadow = 'none';
//                     }}
//                     placeholder="Enter your password"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
//                   >
//                     {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                   </button>
//                 </div>
//               </div>

//               {/* Role Dropdown */}
//               <div>
//                 <label className="block text-sm font-semibold mb-3 text-blue-100">
//                   Select Role
//                 </label>
//                 <div className="relative">
//                   <button
//                     type="button"
//                     onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                     className="w-full px-4 py-4 text-left rounded-xl border-2 focus:outline-none focus:ring-0 transition-all duration-300 flex items-center justify-between text-gray-800 font-medium"
//                     style={{
//                       backgroundColor: 'rgba(255, 255, 255, 0.95)',
//                       borderColor: 'rgba(59, 130, 246, 0.3)',
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = '#3b82f6';
//                       e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
//                       e.target.style.transform = 'translateY(-1px)';
//                       e.target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.2)';
//                     }}
//                     onBlur={(e) => {
//                       setTimeout(() => {
//                         e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)';
//                         e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
//                         e.target.style.transform = 'translateY(0)';
//                         e.target.style.boxShadow = 'none';
//                       }, 100);
//                     }}
//                   >
//                     <span className={formData.role ? 'text-gray-800' : 'text-gray-500'}>
//                       {formData.role ? roleOptions.find(opt => opt.value === formData.role)?.label : 'Select a role'}
//                     </span>
//                     <ChevronDown 
//                       className={`transition-transform duration-200 text-blue-600 ${isDropdownOpen ? 'rotate-180' : ''}`} 
//                       size={20} 
//                     />
//                   </button>
                  
//                   {isDropdownOpen && (
//                     <div className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl z-20 border backdrop-blur-xl overflow-hidden"
//                       style={{ 
//                         backgroundColor: 'rgba(255, 255, 255, 0.98)',
//                         borderColor: 'rgba(59, 130, 246, 0.3)',
//                       }}
//                     >
//                       {roleOptions.map((option, index) => (
//                         <button
//                           key={option.value}
//                           type="button"
//                           onClick={() => handleRoleSelect(option.value)}
//                           className="w-full px-4 py-4 text-left transition-all duration-200 font-medium border-b border-gray-100 last:border-b-0"
//                           style={{
//                             color: formData.role === option.value ? '#3b82f6' : '#374151',
//                             backgroundColor: formData.role === option.value ? 'rgba(59, 130, 246, 0.1)' : ''
//                           }}
//                           onMouseEnter={(e) => {
//                             e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.15)';
//                             e.target.style.paddingLeft = '20px';
//                           }}
//                           onMouseLeave={(e) => {
//                             e.target.style.backgroundColor = formData.role === option.value ? 'rgba(59, 130, 246, 0.1)' : '';
//                             e.target.style.paddingLeft = '16px';
//                           }}
//                         >
//                           {option.label}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Login Button with Gradient and Animation */}
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full py-4 px-6 rounded-xl text-white font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
//                 style={{
//                   background: isLoading 
//                     ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)' 
//                     : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%)',
//                   border: '2px solid rgba(255, 255, 255, 0.2)',
//                   boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
//                 }}
//                 onMouseEnter={(e) => {
//                   if (!isLoading) {
//                     e.target.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e3a8a 100%)';
//                     e.target.style.transform = 'translateY(-2px)';
//                     e.target.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.4)';
//                   }
//                 }}
//                 onMouseLeave={(e) => {
//                   if (!isLoading) {
//                     e.target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%)';
//                     e.target.style.transform = 'translateY(0)';
//                     e.target.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.3)';
//                   }
//                 }}
//               >
//                 {isLoading ? (
//                   <div className="flex items-center justify-center">
//                     <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent mr-3"></div>
//                     Signing In...
//                   </div>
//                 ) : (
//                   <span className="relative z-10">Sign In</span>
//                 )}
//                 {/* Shine effect */}
//                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transform -skew-x-12 -translate-x-full hover:translate-x-full transition-all duration-700"></div>
//               </button>
//             </form>

//             {/* Footer Text */}
//             <div className="mt-8 text-center">
//               <p className="text-sm text-blue-200 font-medium">
//                 Click on sign in to continue
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;






























import { Eye, EyeOff, User, Lock, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LoginPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fixed role options - removed extra space and aligned with backend expectations
  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'Machining Module', label: 'Machining Module' },
    { value: 'Composite Module', label: 'Composite Module' },
    { value: 'Sheet Metal Module', label: 'Sheet Metal Module' }
  ];

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({
      ...prev,
      role: role
    }));
    setIsDropdownOpen(false);
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('🔍 Login attempt started');
    console.log('📝 Form data:', formData);

    if (!formData.username || !formData.password || !formData.role) {
      console.log('❌ Validation failed: Missing fields');
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🌐 Making API call to:', 'http://172.18.100.156:8004/login');
      console.log('📤 Request payload:', {
        username: formData.username,
        password: formData.password,
        role: formData.role
      });

      const response = await fetch('http://172.18.100.156:8004/login', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          role: formData.role
        }),
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);

      const data = await response.json();
      console.log('📥 API Response data:', data);

      if (response.ok) {
        // Store user data in sessionStorage for role-based access
        const userData = {
          user_id: data.user_id,
          role: data.role || formData.role, 
          username: formData.username,
          message: data.message
        };
        
        console.log('💾 Storing userData in sessionStorage:', userData);
        
        // Store in sessionStorage
        sessionStorage.setItem('userData', JSON.stringify(userData));
        
        // Verify storage
        const storedData = sessionStorage.getItem('userData');
        console.log('✅ Verified stored data:', JSON.parse(storedData));

        console.log('🚀 Attempting navigation to /home');
        
        // Navigate to home page
        navigate('/home');

        // Add a small delay to see if navigation is working
        setTimeout(() => {
          console.log('⏰ Post-navigation check - current location:', window.location.pathname);
        }, 100);

      } else {
        console.log('❌ Login failed:', data.message);
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('🚨 Login error:', error);
      console.error('🚨 Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      setError('Network error. Please try again. Check console for details.');
    } finally {
      setIsLoading(false);
      console.log('🏁 Login process completed');
    }
  };

  const handleBackToWelcome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with three blurred images in a row */}
      <div className="absolute inset-0">
        <div className="w-full h-full flex">
          {/* Machining Image with Blur */}
          <div 
            className="flex-1 bg-cover bg-center bg-no-repeat relative"
            style={{
              backgroundImage: 'url(/machining.jpg)',
              filter: 'blur(3px)',
              transform: 'scale(1.1)' // Slight scale to avoid blur edges
            }}
          >
            {/* Dark overlay for better contrast */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
          
          {/* Composite Image with Blur */}
          <div 
            className="flex-1 bg-cover bg-center bg-no-repeat relative"
            style={{
              backgroundImage: 'url(/composite1.jpg)',
              filter: 'blur(3px)',
              transform: 'scale(1.1)'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
          
          {/* Sheet Metal Image with Blur */}
          <div 
            className="flex-1 bg-cover bg-center bg-no-repeat relative"
            style={{
              backgroundImage: 'url(/sheetmetal.jpg)',
              filter: 'blur(3px)',
              transform: 'scale(1.1)'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
        </div>
      </div>

      {/* Process Labels - Positioned over blurred background with lighter colors */}
      <div className="absolute top-0 left-0 right-0 z-5 flex">
        <div className="flex-1 flex justify-center pt-8">
          <div className="bg-gradient-to-r from-sky-300 to-sky-400 text-gray-800 px-8 py-4 rounded-xl shadow-2xl backdrop-blur-sm border border-white border-opacity-50">
            <h2 className="text-xl font-bold text-center">Machining Process</h2>
          </div>
        </div>
        <div className="flex-1 flex justify-center pt-8">
          <div className="bg-gradient-to-r from-sky-300 to-sky-400 text-gray-800 px-8 py-4 rounded-xl shadow-2xl backdrop-blur-sm border border-white border-opacity-50">
            <h2 className="text-xl font-bold text-center">Composite Process</h2>
          </div>
        </div>
        <div className="flex-1 flex justify-center pt-8">
          <div className="bg-gradient-to-r from-sky-300 to-sky-400 text-gray-800 px-8 py-4 rounded-xl shadow-2xl backdrop-blur-sm border border-white border-opacity-50">
            <h2 className="text-xl font-bold text-center">Sheet Metal Process</h2>
          </div>
        </div>
      </div>
      
      {/* Login Form Container - High contrast with glassmorphism */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div 
            className="rounded-3xl p-8 shadow-2xl border backdrop-blur-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
            }}
          >
            {/* Logo Section with Enhanced Styling */}
            <div className="text-center mb-8">
              <div className="inline-block relative mb-6">
                {/* Glowing effect behind logo */}
                <div 
                  className="absolute inset-0 rounded-full blur-xl opacity-60 animate-pulse"
                  style={{ backgroundColor: '#3b82f6', transform: 'scale(1.5)' }}
                ></div>
                <div 
                  className="absolute inset-0 rounded-full blur-lg opacity-40"
                  style={{ backgroundColor: '#1d4ed8', transform: 'scale(1.2)' }}
                ></div>
                <img 
                  src="/ADA_LOGO.jpg" 
                  alt="ADA Logo" 
                  className="relative h-24 w-24 mx-auto rounded-full shadow-2xl border-4 border-white border-opacity-50"
                  style={{ 
                    filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))'
                  }}
                />
              </div>
              <h1 className="text-3xl font-bold mb-3 text-white">
                <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent drop-shadow-lg">
                  Welcome Back
                </span>
              </h1>
              <p className="text-blue-100 text-lg font-medium opacity-90">
                Please sign in to continue
              </p>
            </div>

            {/* Error Message with Better Styling */}
            {error && (
              <div className="mb-6 p-4 rounded-xl text-sm text-red-100 bg-gradient-to-r from-red-500 to-red-600 bg-opacity-20 border border-red-400 border-opacity-30 backdrop-blur-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-300 rounded-full mr-3 animate-pulse"></div>
                  {error}
                </div>
              </div>
            )}

            {/* Login Form with Enhanced Styling */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-blue-100">
                  Username
                </label>
                <div className="relative">
                  <User 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700 z-10" 
                    size={20} 
                  />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:outline-none focus:ring-0 transition-all duration-300 text-gray-800 font-medium"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderColor: 'rgba(59, 130, 246, 0.3)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-blue-100">
                  Password
                </label>
                <div className="relative">
                  <Lock 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700 z-10" 
                    size={20} 
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-14 py-4 rounded-xl border-2 focus:outline-none focus:ring-0 transition-all duration-300 text-gray-800 font-medium"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderColor: 'rgba(59, 130, 246, 0.3)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 transition-colors duration-200 z-10"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Role Dropdown */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-blue-100">
                  Select Role
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full px-4 py-4 text-left rounded-xl border-2 focus:outline-none focus:ring-0 transition-all duration-300 flex items-center justify-between text-gray-800 font-medium"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderColor: 'rgba(59, 130, 246, 0.3)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.2)';
                    }}
                    onBlur={(e) => {
                      setTimeout(() => {
                        e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }, 100);
                    }}
                  >
                    <span className={formData.role ? 'text-gray-800' : 'text-gray-500'}>
                      {formData.role ? roleOptions.find(opt => opt.value === formData.role)?.label : 'Select a role'}
                    </span>
                    <ChevronDown 
                      className={`transition-transform duration-200 text-blue-600 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                      size={20} 
                    />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl z-20 border backdrop-blur-xl overflow-hidden"
                      style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                        borderColor: 'rgba(59, 130, 246, 0.3)',
                      }}
                    >
                      {roleOptions.map((option, index) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleRoleSelect(option.value)}
                          className="w-full px-4 py-4 text-left transition-all duration-200 font-medium border-b border-gray-100 last:border-b-0"
                          style={{
                            color: formData.role === option.value ? '#3b82f6' : '#374151',
                            backgroundColor: formData.role === option.value ? 'rgba(59, 130, 246, 0.1)' : ''
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.15)';
                            e.target.style.paddingLeft = '20px';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = formData.role === option.value ? 'rgba(59, 130, 246, 0.1)' : '';
                            e.target.style.paddingLeft = '16px';
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Login Button with Gradient and Animation */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-xl text-white font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                style={{
                  background: isLoading 
                    ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)' 
                    : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.target.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e3a8a 100%)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.3)';
                  }
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent mr-3"></div>
                    Signing In...
                  </div>
                ) : (
                  <span className="relative z-10">Sign In</span>
                )}
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transform -skew-x-12 -translate-x-full hover:translate-x-full transition-all duration-700"></div>
              </button>
            </form>

            {/* Footer Text */}
            <div className="mt-8 text-center">
              <p className="text-sm text-blue-200 font-medium">
                Click on sign in to continue
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;