// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { User, ArrowLeft, Lock, Key, Eye, EyeOff } from 'lucide-react';

// const ForgotPasswordPage = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     new_password: '',
//     secret_key: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     setError('');
//     setMessage('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');
//     setMessage('');

//     console.log('🔍 Password update attempt started');
//     console.log('📝 Form data:', formData);

//     if (!formData.username || !formData.new_password || !formData.secret_key) {
//       console.log('❌ Validation failed: Missing fields');
//       setError('Please fill in all fields');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       console.log('🌐 Making API call to:', 'http://172.18.100.156:8004/admin/update-password');
//       console.log('📤 Request payload:', formData);

//       const response = await fetch('http://172.18.100.156:8004/admin/update-password', {
//         method: 'PUT',
//         headers: {
//           'accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: formData.username,
//           new_password: formData.new_password,
//           secret_key: formData.secret_key
//         }),
//       });

//       console.log('📥 Response status:', response.status);
//       console.log('📥 Response ok:', response.ok);

//       const data = await response.json();
//       console.log('📥 API Response data:', data);

//       if (response.ok) {
//         console.log('✅ Password updated successfully');
//         setMessage(data.message || 'Password updated successfully');
//         // Clear form after successful update
//         setFormData({
//           username: '',
//           new_password: '',
//           secret_key: ''
//         });
//       } else {
//         console.log('❌ Password update failed:', data.message);
//         setError(data.message || 'Failed to update password. Please try again.');
//       }
//     } catch (error) {
//       console.error('🚨 Password update error:', error);
//       console.error('🚨 Error details:', {
//         name: error.name,
//         message: error.message,
//         stack: error.stack
//       });
//       setError('Network error. Please try again. Check console for details.');
//     } finally {
//       setIsLoading(false);
//       console.log('🏁 Password update process completed');
//     }
//   };

//   const handleBackToLogin = () => {
//     navigate('/login');
//   };

//   return (
//     <div className="min-h-screen relative">
//       {/* Same background as login page */}
//       <div className="absolute inset-0">
//         <div className="w-full h-full flex">
//           {/* Machining Image */}
//           <div 
//             className="flex-1 bg-cover bg-center bg-no-repeat relative"
//             style={{
//               backgroundImage: 'url(/machining.jpg)'
//             }}
//           >
//             <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
//               <h2 className="text-2xl font-bold text-black bg-white bg-opacity-80 px-6 py-3 rounded-lg shadow-lg backdrop-blur-sm">
//                 Machining Process
//               </h2>
//             </div>
//           </div>

//           {/* Composite Image */}
//           <div 
//             className="flex-1 bg-cover bg-center bg-no-repeat relative"
//             style={{
//               backgroundImage: 'url(/composite1.jpg)'
//             }}
//           >
//             <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
//               <h2 className="text-2xl font-bold text-black bg-white bg-opacity-80 px-6 py-3 rounded-lg shadow-lg backdrop-blur-sm">
//                 Composite Process
//               </h2>
//             </div>
//           </div>

//           {/* Sheet Metal Image */}
//           <div 
//             className="flex-1 bg-cover bg-center bg-no-repeat relative"
//             style={{
//               backgroundImage: 'url(/sheetmetal.jpg)'
//             }}
//           >
//             <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
//               <h2 className="text-2xl font-bold text-black bg-white bg-opacity-80 px-6 py-3 rounded-lg shadow-lg backdrop-blur-sm">
//                 Sheet Metal Process
//               </h2>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Forgot Password Form Container */}
//       <div className="relative z-10 min-h-screen flex items-center justify-center">
//         <div className="w-full max-w-md px-6">
//           <div 
//             className="rounded-2xl p-8 shadow-2xl"
//             style={{
//               backgroundColor: 'rgba(255, 255, 255, 0.25)',
//               border: '1px solid rgba(255, 255, 255, 0.3)',
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
//                   textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
//                 }}
//               >
//                 Update Admin Password
//               </h1>
//               <p className="text-white text-sm opacity-90" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
//                 Enter username, new password and secret key
//               </p>
//             </div>

//             {/* Success Message */}
//             {message && (
//               <div 
//                 className="mb-4 p-3 rounded-lg text-sm text-green-100"
//                 style={{ 
//                   backgroundColor: 'rgba(34, 197, 94, 0.4)', 
//                   border: '1px solid rgba(34, 197, 94, 0.5)',
//                 }}
//               >
//                 {message}
//               </div>
//             )}

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

//             {/* Password Update Form */}
//             <form onSubmit={handleSubmit} className="space-y-6">
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
//                     placeholder="Enter username"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* New Password Field */}
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-white" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
//                   New Password
//                 </label>
//                 <div className="relative">
//                   <Lock 
//                     className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" 
//                     size={18} 
//                   />
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="new_password"
//                     value={formData.new_password}
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
//                     placeholder="Enter new password"
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

//               {/* Secret Key Field */}
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-white" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
//                   Secret Key
//                 </label>
//                 <div className="relative">
//                   <Key 
//                     className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" 
//                     size={18} 
//                   />
//                   <input
//                     type="text"
//                     name="secret_key"
//                     value={formData.secret_key}
//                     onChange={handleInputChange}
//                     className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 text-gray-900"
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
//                     placeholder="Enter secret key"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Update Password Button */}
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
//                     Updating...
//                   </div>
//                 ) : (
//                   'Update Password'
//                 )}
//               </button>
//             </form>

//             {/* Back to Login */}
//             <div className="mt-6 text-center">
//               <button
//                 onClick={handleBackToLogin}
//                 className="inline-flex items-center text-sm text-white opacity-90 hover:opacity-100 transition-all duration-200"
//                 style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}
//               >
//                 <ArrowLeft size={16} className="mr-2" />
//                 Back to Login
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPasswordPage;




import React, { useState } from 'react';
import { User, ArrowLeft, Lock, Key, Eye, EyeOff } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    new_password: '',
    secret_key: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    if (!formData.username || !formData.new_password || !formData.secret_key) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://172.18.100.156:8004/admin/update-password', {
        method: 'PUT',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          new_password: formData.new_password,
          secret_key: formData.secret_key
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Password updated successfully');
        setFormData({
          username: '',
          new_password: '',
          secret_key: ''
        });
      } else {
        setError(data.message || 'Failed to update password. Please try again.');
      }
    } catch (error) {
      console.error('Password update error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    // Replace with your navigation logic
    window.history.back();
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with three images with slight blur - Same as Login */}
      <div className="absolute inset-0">
        <div className="w-full h-full flex">
          <div 
            className="flex-1 bg-cover bg-center bg-no-repeat filter blur-[2px]"
            style={{ backgroundImage: 'url(/machining.jpg)' }}
          ></div>
          <div 
            className="flex-1 bg-cover bg-center bg-no-repeat filter blur-[2px]"
            style={{ backgroundImage: 'url(/composite1.jpg)' }}
          ></div>
          <div 
            className="flex-1 bg-cover bg-center bg-no-repeat filter blur-[2px]"
            style={{ backgroundImage: 'url(/sheetmetal.jpg)' }}
          ></div>
        </div>
      </div>

      {/* Semi-transparent overlay for better contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Forgot Password Form Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div 
            className="rounded-2xl p-8 shadow-2xl border border-white border-opacity-20"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-block relative">
                <div className="absolute inset-0 rounded-full bg-blue-800 blur-lg opacity-40"></div>
                <img 
                  src="/ADA_LOGO.jpg" 
                  alt="ADA Logo" 
                  className="relative h-20 w-20 mx-auto rounded-full shadow-xl border-2 border-blue-800"
                />
              </div>
              <h1 className="text-2xl font-bold mt-4 mb-2 text-gray-800">
                Reset Password
              </h1>
              <p className="text-gray-600 text-sm">
                Enter username, new password and secret key
              </p>
            </div>

            {/* Success Message */}
            {message && (
              <div className="mb-4 p-3 rounded-lg text-sm text-white bg-green-500 bg-opacity-90">
                {message}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-lg text-sm text-white bg-red-500 bg-opacity-90">
                {error}
              </div>
            )}

            {/* Password Update Form */}
            <div className="space-y-6">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              {/* New Password Field */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Secret Key Field */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Secret Key
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    name="secret_key"
                    value={formData.secret_key}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900"
                    placeholder="Enter secret key"
                    required
                  />
                </div>
              </div>

              {/* Update Password Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: '#246679',
                  '&:hover': { backgroundColor: '#1e5a6b' }
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1e5a6b'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#246679'}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <button
                onClick={handleBackToLogin}
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-all duration-200"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;