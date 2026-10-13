// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const AccessControl = () => {
//   const [activeTab, setActiveTab] = useState('users');
//   const [users, setUsers] = useState([]);
//   const [newUser, setNewUser] = useState({
//     username: '',
//     password: '',
//     role: 'admin'
//   });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', content: '' });
//   const navigate = useNavigate();

//   // Available roles
//   const availableRoles = [
//     'admin',
//     'Machining Module',
//     'Composite Module',
//     'Sheet Metal Module'
//   ];

//   // Sample users data (in real app, this would come from your backend)
//   useEffect(() => {
//     const sampleUsers = [
//       {
//         id: 1,
//         username: 'john_admin',
//         role: 'Admin',
//         status: 'active',
//         lastLogin: '2024-08-15',
//         createdAt: '2024-01-15'
//       },
//       {
//         id: 2,
//         username: 'jane_machining',
//         role: 'Machining Module',
//         status: 'active',
//         lastLogin: '2024-08-14',
//         createdAt: '2024-02-20'
//       },
//       {
//         id: 3,
//         username: 'bob_sheet',
//         role: 'Sheet Metal Module',
//         status: 'inactive',
//         lastLogin: '2024-08-10',
//         createdAt: '2024-03-10'
//       },
//       {
//         id: 4,
//         username: 'alice_composite',
//         role: 'Composite Module',
//         status: 'active',
//         lastLogin: '2024-08-16',
//         createdAt: '2024-04-05'
//       }
//     ];
//     setUsers(sampleUsers);
//   }, []);

//   const handleBackToHome = () => {
//     navigate('/home');
//   };

//   const handleCreateUser = async () => {
//     if (!newUser.username || !newUser.password || !newUser.role) {
//       setMessage({ type: 'error', content: 'Please fill in all fields' });
//       return;
//     }

//     setLoading(true);
//     setMessage({ type: '', content: '' });

//     try {
//       const response = await fetch('http://localhost:5678/create-user', {
//         method: 'POST',
//         headers: {
//           'accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: newUser.username,
//           password: newUser.password,
//           role: newUser.role
//         })
//       });

//       if (response.ok) {
//         const result = await response.json();
//         setMessage({ type: 'success', content: 'User created successfully!' });
        
//         // Add user to local state for immediate UI update
//         const userToAdd = {
//           id: users.length + 1,
//           username: newUser.username,
//           role: newUser.role,
//           status: 'active',
//           lastLogin: 'Never',
//           createdAt: new Date().toISOString().split('T')[0]
//         };
//         setUsers([...users, userToAdd]);
        
//         // Reset form
//         setNewUser({ username: '', password: '', role: 'Admin' });
        
//         // Switch to users tab to show the new user
//         setTimeout(() => {
//           setActiveTab('users');
//         }, 1500);
//       } else {
//         const errorData = await response.json();
//         setMessage({ type: 'error', content: errorData.message || 'Failed to create user' });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', content: 'Network error. Please try again.' });
//       console.error('Error creating user:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleToggleUserStatus = (userId) => {
//     setUsers(users.map(user => 
//       user.id === userId 
//         ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } 
//         : user
//     ));
//   };

//   const handleDeleteUser = (userId) => {
//     setUsers(users.filter(user => user.id !== userId));
//   };

//   const filteredUsers = users.filter(user =>
//     user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.role.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const getRoleColor = (role) => {
//     const colors = {
//       'Admin': '#dc2626',
//       'Machining Module': '#2563eb',
//       'Composite Module': '#059669',
//       'Sheet Metal Module': '#7c3aed'
//     };
//     return colors[role] || '#6b7280';
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
//       {/* Header */}
//       <div className="mb-8">
//         <button
//           onClick={handleBackToHome}
//           className="flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-100"
//           style={{color: '#246679'}}
//         >
//           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
//           </svg>
//           <span className="font-semibold">Back to Modules</span>
//         </button>

//         <div className="text-center">
//           <h1 
//             className="text-4xl font-bold tracking-wider mb-2"
//             style={{
//               fontFamily: 'Times New Roman, serif',
//               color: '#246679'
//             }}
//           >
//             ACCESS CONTROL
//           </h1>
//           <p className="text-gray-600 text-lg">Manage user roles and permissions</p>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="mb-8">
//         <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg max-w-md mx-auto">
//           <button
//             onClick={() => setActiveTab('create')}
//             className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
//               activeTab === 'create'
//                 ? 'bg-white text-blue-600 shadow-sm'
//                 : 'text-gray-600 hover:text-blue-600'
//             }`}
//           >
//             Create New User
//           </button>
//           <button
//             onClick={() => setActiveTab('users')}
//             className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
//               activeTab === 'users'
//                 ? 'bg-white text-blue-600 shadow-sm'
//                 : 'text-gray-600 hover:text-blue-600'
//             }`}
//           >
//             Users
//           </button>
//         </div>
//       </div>

//       {/* Create User Tab */}
//       {activeTab === 'create' && (
//         <div className="max-w-md mx-auto">
//           <div className="bg-white rounded-lg shadow-lg p-8">
//             <h2 className="text-2xl font-bold mb-6 text-center" style={{color: '#246679'}}>
//               Create New User
//             </h2>

//             {/* Message Display */}
//             {message.content && (
//               <div className={`mb-4 p-3 rounded-lg ${
//                 message.type === 'success' 
//                   ? 'bg-green-100 text-green-700 border border-green-300'
//                   : 'bg-red-100 text-red-700 border border-red-300'
//               }`}>
//                 {message.content}
//               </div>
//             )}

//             <div className="space-y-4">
//               {/* Username Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Username *
//                 </label>
//                 <input
//                   type="text"
//                   value={newUser.username}
//                   onChange={(e) => setNewUser({...newUser, username: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter username"
//                 />
//               </div>

//               {/* Password Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Password *
//                 </label>
//                 <input
//                   type="password"
//                   value={newUser.password}
//                   onChange={(e) => setNewUser({...newUser, password: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter password"
//                 />
//               </div>

//               {/* Role Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Role *
//                 </label>
//                 <select
//                   value={newUser.role}
//                   onChange={(e) => setNewUser({...newUser, role: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   {availableRoles.map(role => (
//                     <option key={role} value={role}>{role}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Create Button */}
//               <button
//                 onClick={handleCreateUser}
//                 disabled={loading}
//                 className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${
//                   loading 
//                     ? 'bg-gray-400 cursor-not-allowed' 
//                     : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 shadow-lg'
//                 }`}
//               >
//                 {loading ? (
//                   <div className="flex items-center justify-center space-x-2">
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     <span>Creating...</span>
//                   </div>
//                 ) : (
//                   'Create User'
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Users Tab */}
//       {activeTab === 'users' && (
//         <div>
//           {/* Search Bar */}
//           <div className="mb-6 max-w-md mx-auto">
//             <div className="relative">
//               <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
//               </svg>
//               <input
//                 type="text"
//                 placeholder="Search users..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           {/* Users Table */}
//           <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead style={{backgroundColor: '#246679'}}>
//                   <tr>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-white">User</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-white">Role</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-white">Last Login</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-white">Created</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {filteredUsers.map((user) => (
//                     <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
//                       {/* User Info */}
//                       <td className="px-6 py-4">
//                         <div className="flex items-center space-x-3">
//                           <div 
//                             className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
//                             style={{backgroundColor: getRoleColor(user.role)}}
//                           >
//                             {user.username.substring(0, 2).toUpperCase()}
//                           </div>
//                           <div>
//                             <div className="font-semibold text-gray-900">{user.username}</div>
//                           </div>
//                         </div>
//                       </td>

//                       {/* Role */}
//                       <td className="px-6 py-4">
//                         <select
//                           value={user.role}
//                           onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
//                           className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         >
//                           {availableRoles.map(role => (
//                             <option key={role} value={role}>{role}</option>
//                           ))}
//                         </select>
//                       </td>

//                       {/* Status */}
//                       <td className="px-6 py-4">
//                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                           user.status === 'active' 
//                             ? 'bg-green-100 text-green-800' 
//                             : 'bg-red-100 text-red-800'
//                         }`}>
//                           {user.status}
//                         </span>
//                       </td>

//                       {/* Last Login */}
//                       <td className="px-6 py-4 text-sm text-gray-600">
//                         {user.lastLogin}
//                       </td>

//                       {/* Created */}
//                       <td className="px-6 py-4 text-sm text-gray-600">
//                         {user.createdAt}
//                       </td>

//                       {/* Actions */}
//                       <td className="px-6 py-4">
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => handleToggleUserStatus(user.id)}
//                             className={`px-3 py-1 text-xs rounded-md font-semibold transition-colors duration-200 ${
//                               user.status === 'active'
//                                 ? 'bg-red-100 text-red-700 hover:bg-red-200'
//                                 : 'bg-green-100 text-green-700 hover:bg-green-200'
//                             }`}
//                           >
//                             {user.status === 'active' ? 'Deactivate' : 'Activate'}
//                           </button>
                          
//                           <button
//                             onClick={() => handleDeleteUser(user.id)}
//                             className="px-3 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Empty State */}
//             {filteredUsers.length === 0 && (
//               <div className="text-center py-12">
//                 <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
//                 </svg>
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
//                 <p className="text-gray-500">Try adjusting your search criteria</p>
//               </div>
//             )}
//           </div>

//           {/* Users Summary */}
//           <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="bg-white rounded-lg p-4 shadow-md border-l-4" style={{borderLeftColor: '#246679'}}>
//               <div className="text-2xl font-bold" style={{color: '#246679'}}>{users.length}</div>
//               <div className="text-sm text-gray-600">Total Users</div>
//             </div>
//             <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-green-500">
//               <div className="text-2xl font-bold text-green-600">
//                 {users.filter(u => u.status === 'active').length}
//               </div>
//               <div className="text-sm text-gray-600">Active Users</div>
//             </div>
//             <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-red-500">
//               <div className="text-2xl font-bold text-red-600">
//                 {users.filter(u => u.role === 'Admin').length}
//               </div>
//               <div className="text-sm text-gray-600">Admin Users</div>
//             </div>
//             <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-blue-500">
//               <div className="text-2xl font-bold text-blue-600">
//                 {users.filter(u => u.role !== 'Admin').length}
//               </div>
//               <div className="text-sm text-gray-600">Module Users</div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   // Helper function to update user role
//   function handleUpdateUserRole(userId, newRole) {
//     setUsers(users.map(user => 
//       user.id === userId ? { ...user, role: newRole } : user
//     ));
//   }
// };

// export default AccessControl;






// import React, { useState, useEffect } from 'react';

// const AccessControl = () => {
//   const [activeTab, setActiveTab] = useState('users');
//   const [users, setUsers] = useState([]);
//   const [newUser, setNewUser] = useState({
//     username: '',
//     password: '',
//     role: 'admin'
//   });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [message, setMessage] = useState({ type: '', content: '' });
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [passwordFormData, setPasswordFormData] = useState({
//     username: '',
//     role: '',
//     new_password: '',
//     secret_key: ''
//   });
//   const [deleteFormData, setDeleteFormData] = useState({
//     username: '',
//     role: ''
//   });
//   const [passwordLoading, setPasswordLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   // Available roles
//   const availableRoles = [
//     'admin',
//     'Machining Module',
//     'Composite Module',
//     'Sheet Metal Module'
//   ];

//   // Fetch users from backend
//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     setFetchLoading(true);
//     try {
//       const response = await fetch('http://localhost:5678/users');
//       if (response.ok) {
//         const userData = await response.json();
//         setUsers(userData);
//       } else {
//         setMessage({ type: 'error', content: 'Failed to fetch users' });
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       setMessage({ type: 'error', content: 'Network error while fetching users' });
//     } finally {
//       setFetchLoading(false);
//     }
//   };

//   const handleBackToHome = () => {
//     // Replace with your navigation logic
//     window.history.back();
//   };

//   const handleCreateUser = async () => {
//     if (!newUser.username || !newUser.password || !newUser.role) {
//       setMessage({ type: 'error', content: 'Please fill in all fields' });
//       return;
//     }

//     setLoading(true);
//     setMessage({ type: '', content: '' });

//     try {
//       const response = await fetch('http://localhost:5678/create-user', {
//         method: 'POST',
//         headers: {
//           'accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: newUser.username,
//           password: newUser.password,
//           role: newUser.role
//         })
//       });

//       if (response.ok) {
//         const result = await response.json();
//         setMessage({ type: 'success', content: 'User created successfully!' });
        
//         // Reset form
//         setNewUser({ username: '', password: '', role: 'admin' });
        
//         // Refresh users list
//         await fetchUsers();
        
//         // Switch to users tab to show the new user
//         setTimeout(() => {
//           setActiveTab('users');
//         }, 1500);
//       } else {
//         const errorData = await response.json();
//         setMessage({ type: 'error', content: errorData.message || 'Failed to create user' });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', content: 'Network error. Please try again.' });
//       console.error('Error creating user:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateUser = (user) => {
//     setSelectedUser(user);
//     setPasswordFormData({
//       username: user.username,
//       role: user.role,
//       new_password: '',
//       secret_key: ''
//     });
//     setShowPasswordModal(true);
//     setMessage({ type: '', content: '' });
//   };

//   const handlePasswordUpdate = async () => {
//     if (!passwordFormData.new_password) {
//       setMessage({ type: 'error', content: 'Please enter a new password' });
//       return;
//     }

//     if (selectedUser.role === 'admin' && !passwordFormData.secret_key) {
//       setMessage({ type: 'error', content: 'Secret key is required for admin users' });
//       return;
//     }

//     setPasswordLoading(true);
//     setMessage({ type: '', content: '' });

//     try {
//       let response;
      
//       if (selectedUser.role === 'admin') {
//         // Use admin endpoint for admin users
//         response = await fetch('http://localhost:5678/admin/update-password', {
//           method: 'PUT',
//           headers: {
//             'accept': 'application/json',
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             username: passwordFormData.username,
//             new_password: passwordFormData.new_password,
//             secret_key: passwordFormData.secret_key
//           }),
//         });
//       } else {
//         // Use regular endpoint for other role users
//         response = await fetch('http://localhost:5678/update-password', {
//           method: 'PUT',
//           headers: {
//             'accept': 'application/json',
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             username: passwordFormData.username,
//             role: passwordFormData.role,
//             new_password: passwordFormData.new_password
//           }),
//         });
//       }

//       const data = await response.json();

//       if (response.ok) {
//         setMessage({ type: 'success', content: data.message || 'Password updated successfully' });
//         setShowPasswordModal(false);
//         setPasswordFormData({
//           username: '',
//           role: '',
//           new_password: '',
//           secret_key: ''
//         });
//       } else {
//         setMessage({ type: 'error', content: data.message || 'Failed to update password. Please try again.' });
//       }
//     } catch (error) {
//       console.error('Password update error:', error);
//       setMessage({ type: 'error', content: 'Network error. Please try again.' });
//     } finally {
//       setPasswordLoading(false);
//     }
//   };

//   const closePasswordModal = () => {
//     setShowPasswordModal(false);
//     setSelectedUser(null);
//     setPasswordFormData({
//       username: '',
//       role: '',
//       new_password: '',
//       secret_key: ''
//     });
//     setMessage({ type: '', content: '' });
//   };

//   const handleDeleteUser = async (user) => {
//     setSelectedUser(user);
//     setDeleteFormData({
//       username: user.username,
//       role: user.role
//     });
//     setShowDeleteModal(true);
//     setMessage({ type: '', content: '' });
//   };

//   const confirmDeleteUser = async () => {
//     setDeleteLoading(true);
//     setMessage({ type: '', content: '' });

//     try {
//       const response = await fetch('http://localhost:5678/users/delete', {
//         method: 'DELETE',
//         headers: {
//           'accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: deleteFormData.username,
//           role: deleteFormData.role
//         })
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage({ type: 'success', content: data.message || 'User deleted successfully!' });
//         setShowDeleteModal(false);
//         setDeleteFormData({ username: '', role: '' });
//         await fetchUsers(); // Refresh the users list
//       } else {
//         setMessage({ type: 'error', content: data.message || 'Failed to delete user' });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', content: 'Network error. Please try again.' });
//       console.error('Error deleting user:', error);
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   const closeDeleteModal = () => {
//     setShowDeleteModal(false);
//     setSelectedUser(null);
//     setDeleteFormData({ username: '', role: '' });
//     setMessage({ type: '', content: '' });
//   };

//   const startEditUser = (user) => {
//     handleUpdateUser(user);
//   };

//   const cancelEdit = () => {
//     // Not needed anymore since we're using modal
//   };

//   const filteredUsers = users.filter(user =>
//     user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.role.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const getRoleColor = (role) => {
//     const colors = {
//       'admin': '#dc2626',
//       'Machining Module': '#2563eb',
//       'Composite Module': '#059669',
//       'Sheet Metal Module': '#7c3aed'
//     };
//     return colors[role] || '#6b7280';
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
//       {/* Header */}
//       <div className="mb-8">
//         <button
//           onClick={handleBackToHome}
//           className="flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-100"
//           style={{color: '#246679'}}
//         >
//           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
//           </svg>
//           <span className="font-semibold">Back to Modules</span>
//         </button>

//         <div className="text-center">
//           <h1 
//             className="text-4xl font-bold tracking-wider mb-2"
//             style={{
//               fontFamily: 'Times New Roman, serif',
//               color: '#246679'
//             }}
//           >
//             ACCESS CONTROL
//           </h1>
//           <p className="text-gray-600 text-lg">Manage user roles and permissions</p>
//         </div>
//       </div>

//       {/* Message Display */}
//       {message.content && (
//         <div className={`mb-6 max-w-md mx-auto p-3 rounded-lg ${
//           message.type === 'success' 
//             ? 'bg-green-100 text-green-700 border border-green-300'
//             : 'bg-red-100 text-red-700 border border-red-300'
//         }`}>
//           {message.content}
//         </div>
//       )}

//       {/* Tabs */}
//       <div className="mb-8">
//         <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg max-w-md mx-auto">
//           <button
//             onClick={() => setActiveTab('create')}
//             className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
//               activeTab === 'create'
//                 ? 'bg-white text-blue-600 shadow-sm'
//                 : 'text-gray-600 hover:text-blue-600'
//             }`}
//           >
//             Create New User
//           </button>
//           <button
//             onClick={() => setActiveTab('users')}
//             className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
//               activeTab === 'users'
//                 ? 'bg-white text-blue-600 shadow-sm'
//                 : 'text-gray-600 hover:text-blue-600'
//             }`}
//           >
//             Users
//           </button>
//         </div>
//       </div>

//       {/* Create User Tab */}
//       {activeTab === 'create' && (
//         <div className="max-w-md mx-auto">
//           <div className="bg-white rounded-lg shadow-lg p-8">
//             <h2 className="text-2xl font-bold mb-6 text-center" style={{color: '#246679'}}>
//               Create New User
//             </h2>

//             <div className="space-y-4">
//               {/* Username Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Username *
//                 </label>
//                 <input
//                   type="text"
//                   value={newUser.username}
//                   onChange={(e) => setNewUser({...newUser, username: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter username"
//                 />
//               </div>

//               {/* Password Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Password *
//                 </label>
//                 <input
//                   type="password"
//                   value={newUser.password}
//                   onChange={(e) => setNewUser({...newUser, password: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter password"
//                 />
//               </div>

//               {/* Role Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Role *
//                 </label>
//                 <select
//                   value={newUser.role}
//                   onChange={(e) => setNewUser({...newUser, role: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   {availableRoles.map(role => (
//                     <option key={role} value={role}>{role}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Create Button */}
//           <button
//   onClick={handleCreateUser}
//   disabled={loading}
//   className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${
//     loading 
//       ? 'bg-gray-400 cursor-not-allowed' 
//       : 'bg-[#246679] hover:bg-[#246679] hover:scale-105 shadow-lg'
//   }`}
// >
//   {loading ? (
//     <div className="flex items-center justify-center space-x-2">
//       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//       <span>Creating...</span>
//     </div>
//   ) : (
//     'Create User'
//   )}
// </button>

//             </div>
//           </div>
//         </div>
//       )}

//       {/* Users Tab */}
//       {activeTab === 'users' && (
//         <div>
//           {/* Search Bar */}
//           <div className="mb-6 max-w-md mx-auto">
//             <div className="relative">
//               <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
//               </svg>
//               <input
//                 type="text"
//                 placeholder="Search users..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           {/* Users Table */}
//           <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//             <div className="overflow-x-auto">
//               {fetchLoading ? (
//                 <div className="flex items-center justify-center py-12">
//                   <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                   <span className="ml-3 text-gray-600">Loading users...</span>
//                 </div>
//               ) : (
//                 <table className="w-full">
//                   <thead style={{backgroundColor: '#246679'}}>
//                     <tr>
//                       <th className="px-6 py-4 text-left text-sm font-semibold text-white">Username</th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold text-white">Role</th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {filteredUsers.map((user) => (
//                       <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
//                         {/* Username */}
//                         <td className="px-6 py-4">
//                           <div className="flex items-center space-x-3">
//                             <div 
//                               className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
//                               style={{backgroundColor: getRoleColor(user.role)}}
//                             >
//                               {user.username.substring(0, 2).toUpperCase()}
//                             </div>
//                             <div>
//                               <div className="font-semibold text-gray-900">{user.username}</div>
//                             </div>
//                           </div>
//                         </td>

//                         {/* Role - No background color */}
//                         <td className="px-6 py-4">
//                           <span className="text-gray-900 font-medium">
//                             {user.role}
//                           </span>
//                         </td>

//                         {/* Actions */}
//                         <td className="px-6 py-4">
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => startEditUser(user)}
//                               className="px-3 py-1 text-xs text-white rounded-md hover:opacity-90 transition-all duration-200"
//                               style={{backgroundColor: '#246679'}}
//                             >
//                               Update
//                             </button>
//                             <button
//                               onClick={() => handleDeleteUser(user)}
//                               className="px-3 py-1 text-xs text-white rounded-md hover:opacity-90 transition-all duration-200"
//                               style={{backgroundColor: '#dc2626'}}
//                             >
//                               Delete
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>

//             {/* Empty State */}
//             {!fetchLoading && filteredUsers.length === 0 && (
//               <div className="text-center py-12">
//                 <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
//                 </svg>
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
//                 <p className="text-gray-500">Try adjusting your search criteria</p>
//               </div>
//             )}
//           </div>

//           {/* Users Summary */}
//           {!fetchLoading && users.length > 0 && (
//             <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="bg-white rounded-lg p-4 shadow-md border-l-4" style={{borderLeftColor: '#246679'}}>
//                 <div className="text-2xl font-bold" style={{color: '#246679'}}>{users.length}</div>
//                 <div className="text-sm text-gray-600">Total Users</div>
//               </div>
//               <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-red-500">
//                 <div className="text-2xl font-bold text-red-600">
//                   {users.filter(u => u.role === 'admin').length}
//                 </div>
//                 <div className="text-sm text-gray-600">Admin Users</div>
//               </div>
//               <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-blue-500">
//                 <div className="text-2xl font-bold text-blue-600">
//                   {users.filter(u => u.role === 'Machining Module').length}
//                 </div>
//                 <div className="text-sm text-gray-600">Machining Module</div>
//               </div>
//               <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-green-500">
//                 <div className="text-2xl font-bold text-green-600">
//                   {users.filter(u => u.role === 'Composite Module' || u.role === 'Sheet Metal Module').length}
//                 </div>
//                 <div className="text-sm text-gray-600">Other Modules</div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Password Update Modal */}
//       {showPasswordModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
//             <h2 className="text-xl font-bold mb-4" style={{color: '#246679'}}>
//               Update Password for {selectedUser?.username}
//             </h2>

//             <div className="space-y-4">
//               {/* Username (Read-only) */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Username
//                 </label>
//                 <input
//                   type="text"
//                   value={passwordFormData.username}
//                   disabled
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
//                 />
//               </div>

//               {/* Role (Read-only) */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Role
//                 </label>
//                 <input
//                   type="text"
//                   value={passwordFormData.role}
//                   disabled
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
//                 />
//               </div>

//               {/* New Password */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   New Password *
//                 </label>
//                 <input
//                   type="password"
//                   value={passwordFormData.new_password}
//                   onChange={(e) => setPasswordFormData({...passwordFormData, new_password: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter new password"
//                 />
//               </div>

//               {/* Secret Key (Only for admin users) */}
//               {selectedUser?.role === 'admin' && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Secret Key *
//                   </label>
//                   <input
//                     type="password"
//                     value={passwordFormData.secret_key}
//                     onChange={(e) => setPasswordFormData({...passwordFormData, secret_key: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Enter admin secret key"
//                   />
//                 </div>
//               )}
//             </div>

//             {/* Modal Actions */}
//             <div className="flex space-x-3 mt-6">
//           <button
//   onClick={handlePasswordUpdate}
//   disabled={passwordLoading}
//   className={`flex-1 py-2 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${
//     passwordLoading 
//       ? 'bg-gray-400 cursor-not-allowed' 
//       : 'bg-[#246679] hover:bg-[#246679]'
//   }`}
// >
//   {passwordLoading ? (
//     <div className="flex items-center justify-center space-x-2">
//       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//       <span>Updating...</span>
//     </div>
//   ) : (
//     'Update Password'
//   )}
// </button>

              
//               <button
//                 onClick={closePasswordModal}
//                 disabled={passwordLoading}
//                 className="flex-1 py-2 px-4 rounded-lg font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-all duration-300"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete User Modal */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
//             <h2 className="text-xl font-bold mb-4" style={{color: '#246679'}}>
//               Delete User
//             </h2>
            
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to delete this user? This action cannot be undone.
//             </p>

//             <div className="space-y-4">
//               {/* Username (Read-only) */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Username
//                 </label>
//                 <input
//                   type="text"
//                   value={deleteFormData.username}
//                   disabled
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
//                 />
//               </div>

//               {/* Role (Read-only) */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Role
//                 </label>
//                 <input
//                   type="text"
//                   value={deleteFormData.role}
//                   disabled
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
//                 />
//               </div>
//             </div>

//             {/* Modal Actions */}
//             <div className="flex space-x-3 mt-6">
//               <button
//                 onClick={confirmDeleteUser}
//                 disabled={deleteLoading}
//                 className={`flex-1 py-2 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${
//                   deleteLoading 
//                     ? 'bg-gray-400 cursor-not-allowed' 
//                     : 'bg-red-600 hover:bg-red-700'
//                 }`}
//               >
//                 {deleteLoading ? (
//                   <div className="flex items-center justify-center space-x-2">
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     <span>Deleting...</span>
//                   </div>
//                 ) : (
//                   'Delete User'
//                 )}
//               </button>
              
//               <button
//                 onClick={closeDeleteModal}
//                 disabled={deleteLoading}
//                 className="flex-1 py-2 px-4 rounded-lg font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-all duration-300"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AccessControl;




















//'''updated new code with reduced table width ''''''//
import React, { useState, useEffect } from 'react';

const AccessControl = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'admin'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [passwordFormData, setPasswordFormData] = useState({
    username: '',
    role: '',
    new_password: '',
    secret_key: ''
  });
  const [deleteFormData, setDeleteFormData] = useState({
    username: '',
    role: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Available roles
  const availableRoles = [
    'admin',
    'Machining Module',
    'Composite Module',
    'Sheet Metal Module'
  ];

  // Fetch users from backend
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setFetchLoading(true);
    try {
      const response = await fetch('http://localhost:5678/users');
      if (response.ok) {
        const userData = await response.json();
        setUsers(userData);
      } else {
        setMessage({ type: 'error', content: 'Failed to fetch users' });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage({ type: 'error', content: 'Network error while fetching users' });
    } finally {
      setFetchLoading(false);
    }
  };

  const handleBackToHome = () => {
    // Replace with your navigation logic
    window.history.back();
  };

  const handleCreateUser = async () => {
    if (!newUser.username || !newUser.password || !newUser.role) {
      setMessage({ type: 'error', content: 'Please fill in all fields' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      const response = await fetch('http://localhost:5678/create-user', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newUser.username,
          password: newUser.password,
          role: newUser.role
        })
      });

      if (response.ok) {
        const result = await response.json();
        setMessage({ type: 'success', content: 'User created successfully!' });
        
        // Reset form
        setNewUser({ username: '', password: '', role: 'admin' });
        
        // Refresh users list
        await fetchUsers();
        
        // Switch to users tab to show the new user
        setTimeout(() => {
          setActiveTab('users');
        }, 1500);
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', content: errorData.message || 'Failed to create user' });
      }
    } catch (error) {
      setMessage({ type: 'error', content: 'Network error. Please try again.' });
      console.error('Error creating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = (user) => {
    setSelectedUser(user);
    setPasswordFormData({
      username: user.username,
      role: user.role,
      new_password: '',
      secret_key: ''
    });
    setShowPasswordModal(true);
    setMessage({ type: '', content: '' });
  };

  const handlePasswordUpdate = async () => {
    if (!passwordFormData.new_password) {
      setMessage({ type: 'error', content: 'Please enter a new password' });
      return;
    }

    if (selectedUser.role === 'admin' && !passwordFormData.secret_key) {
      setMessage({ type: 'error', content: 'Secret key is required for admin users' });
      return;
    }

    setPasswordLoading(true);
    setMessage({ type: '', content: '' });

    try {
      let response;
      
      if (selectedUser.role === 'admin') {
        // Use admin endpoint for admin users
        response = await fetch('http://localhost:5678/admin/update-password', {
          method: 'PUT',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: passwordFormData.username,
            new_password: passwordFormData.new_password,
            secret_key: passwordFormData.secret_key
          }),
        });
      } else {
        // Use regular endpoint for other role users
        response = await fetch('http://localhost:5678/update-password', {
          method: 'PUT',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: passwordFormData.username,
            role: passwordFormData.role,
            new_password: passwordFormData.new_password
          }),
        });
      }

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', content: data.message || 'Password updated successfully' });
        setShowPasswordModal(false);
        setPasswordFormData({
          username: '',
          role: '',
          new_password: '',
          secret_key: ''
        });
      } else {
        setMessage({ type: 'error', content: data.message || 'Failed to update password. Please try again.' });
      }
    } catch (error) {
      console.error('Password update error:', error);
      setMessage({ type: 'error', content: 'Network error. Please try again.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setSelectedUser(null);
    setPasswordFormData({
      username: '',
      role: '',
      new_password: '',
      secret_key: ''
    });
    setMessage({ type: '', content: '' });
  };

  const handleDeleteUser = async (user) => {
    setSelectedUser(user);
    setDeleteFormData({
      username: user.username,
      role: user.role
    });
    setShowDeleteModal(true);
    setMessage({ type: '', content: '' });
  };

  const confirmDeleteUser = async () => {
    setDeleteLoading(true);
    setMessage({ type: '', content: '' });

    try {
      const response = await fetch('http://localhost:5678/users/delete', {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: deleteFormData.username,
          role: deleteFormData.role
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', content: data.message || 'User deleted successfully!' });
        setShowDeleteModal(false);
        setDeleteFormData({ username: '', role: '' });
        await fetchUsers(); // Refresh the users list
      } else {
        setMessage({ type: 'error', content: data.message || 'Failed to delete user' });
      }
    } catch (error) {
      setMessage({ type: 'error', content: 'Network error. Please try again.' });
      console.error('Error deleting user:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
    setDeleteFormData({ username: '', role: '' });
    setMessage({ type: '', content: '' });
  };

  const startEditUser = (user) => {
    handleUpdateUser(user);
  };

  const cancelEdit = () => {
    // Not needed anymore since we're using modal
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role) => {
    const colors = {
      'admin': '#dc2626',
      'Machining Module': '#2563eb',
      'Composite Module': '#059669',
      'Sheet Metal Module': '#7c3aed'
    };
    return colors[role] || '#6b7280';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleBackToHome}
          className="flex items-center space-x-2 mb-4 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-100"
          style={{color: '#246679'}}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold">Back to Modules</span>
        </button>

        <div className="text-center">
          <h1 
            className="text-3xl font-bold tracking-wider mb-2"
            style={{
              fontFamily: 'Times New Roman, serif',
              color: '#246679'
            }}
          >
            ACCESS CONTROL
          </h1>
          <p className="text-gray-600">Manage user roles and permissions</p>
        </div>
      </div>

      {/* Message Display */}
      {message.content && (
        <div className={`mb-4 max-w-sm mx-auto p-2 rounded-lg text-sm ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-red-100 text-red-700 border border-red-300'
        }`}>
          {message.content}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg max-w-sm mx-auto">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
              activeTab === 'create'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Create New User
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
              activeTab === 'users'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Users
          </button>
        </div>
      </div>

      {/* Create User Tab */}
      {activeTab === 'create' && (
        <div className="max-w-sm mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-center" style={{color: '#246679'}}>
              Create New User
            </h2>

            <div className="space-y-3">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Enter username"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Enter password"
                />
              </div>

              {/* Role Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {availableRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreateUser}
                disabled={loading}
                className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition-all duration-300 text-sm ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#246679] hover:bg-[#246679] hover:scale-105 shadow-lg'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  'Create User'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="max-w-6xl mx-auto">
          {/* Users Summary - Compact Cards */}
          {!fetchLoading && users.length > 0 && (
            <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white rounded-lg p-3 shadow-md border-l-4" style={{borderLeftColor: '#246679'}}>
                <div className="text-xl font-bold" style={{color: '#246679'}}>{users.length}</div>
                <div className="text-xs text-gray-600">Total Users</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-md border-l-4 border-red-500">
                <div className="text-xl font-bold text-red-600">
                  {users.filter(u => u.role === 'admin').length}
                </div>
                <div className="text-xs text-gray-600">Admin Users</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-md border-l-4 border-blue-500">
                <div className="text-xl font-bold text-blue-600">
                  {users.filter(u => u.role === 'Machining Module').length}
                </div>
                <div className="text-xs text-gray-600">Machining Module</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-md border-l-4 border-green-500">
                <div className="text-xl font-bold text-green-600">
                  {users.filter(u => u.role === 'Composite Module' || u.role === 'Sheet Metal Module').length}
                </div>
                <div className="text-xs text-gray-600">Other Modules</div>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative max-w-sm mx-auto">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Users Table - Compact Version */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              {fetchLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-3 text-gray-600 text-sm">Loading users...</span>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead style={{backgroundColor: '#246679'}}>
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-white">Username</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-white">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                        {/* Username */}
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs"
                              style={{backgroundColor: getRoleColor(user.role)}}
                            >
                              {user.username.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 text-sm">{user.username}</div>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-4 py-3">
                          <span className="text-gray-900 font-medium text-sm">
                            {user.role}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex space-x-1">
                            <button
                              onClick={() => startEditUser(user)}
                              className="px-2 py-1 text-xs text-white rounded-md hover:opacity-90 transition-all duration-200"
                              style={{backgroundColor: '#246679'}}
                            >
                              Update
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="px-2 py-1 text-xs text-white rounded-md hover:opacity-90 transition-all duration-200"
                              style={{backgroundColor: '#dc2626'}}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Empty State */}
            {!fetchLoading && filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Password Update Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-5 w-full max-w-sm mx-4">
            <h2 className="text-lg font-bold mb-4" style={{color: '#246679'}}>
              Update Password for {selectedUser?.username}
            </h2>

            <div className="space-y-3">
              {/* Username (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={passwordFormData.username}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-sm"
                />
              </div>

              {/* Role (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={passwordFormData.role}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-sm"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password *
                </label>
                <input
                  type="password"
                  value={passwordFormData.new_password}
                  onChange={(e) => setPasswordFormData({...passwordFormData, new_password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Enter new password"
                />
              </div>

              {/* Secret Key (Only for admin users) */}
              {selectedUser?.role === 'admin' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Secret Key *
                  </label>
                  <input
                    type="password"
                    value={passwordFormData.secret_key}
                    onChange={(e) => setPasswordFormData({...passwordFormData, secret_key: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Enter admin secret key"
                  />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex space-x-2 mt-5">
              <button
                onClick={handlePasswordUpdate}
                disabled={passwordLoading}
                className={`flex-1 py-2 px-3 rounded-lg font-semibold text-white transition-all duration-300 text-sm ${
                  passwordLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#246679] hover:bg-[#246679]'
                }`}
              >
                {passwordLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  'Update Password'
                )}
              </button>
              
              <button
                onClick={closePasswordModal}
                disabled={passwordLoading}
                className="flex-1 py-2 px-3 rounded-lg font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-all duration-300 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-5 w-full max-w-sm mx-4">
            <h2 className="text-lg font-bold mb-4" style={{color: '#246679'}}>
              Delete User
            </h2>
            
            <p className="text-gray-600 mb-4 text-sm">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>

            <div className="space-y-3">
              {/* Username (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={deleteFormData.username}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-sm"
                />
              </div>

              {/* Role (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={deleteFormData.role}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-sm"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex space-x-2 mt-5">
              <button
                onClick={confirmDeleteUser}
                disabled={deleteLoading}
                className={`flex-1 py-2 px-3 rounded-lg font-semibold text-white transition-all duration-300 text-sm ${
                  deleteLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {deleteLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </div>
                ) : (
                  'Delete User'
                )}
              </button>
              
              <button
                onClick={closeDeleteModal}
                disabled={deleteLoading}
                className="flex-1 py-2 px-3 rounded-lg font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-all duration-300 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessControl;




























// import React, { useState, useEffect } from 'react';

// const AccessControl = () => {
//   const [activeTab, setActiveTab] = useState('users');
//   const [users, setUsers] = useState([]);
//   const [newUser, setNewUser] = useState({
//     username: '',
//     password: '',
//     role: 'admin'
//   });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [message, setMessage] = useState({ type: '', content: '' });
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [passwordFormData, setPasswordFormData] = useState({
//     username: '',
//     role: '',
//     new_password: '',
//     secret_key: ''
//   });
//   const [deleteFormData, setDeleteFormData] = useState({
//     username: '',
//     role: ''
//   });
//   const [passwordLoading, setPasswordLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   // Configuration tab states
//   const [configData, setConfigData] = useState({
//     machine_type: '',
//     rates: [{ volume_limit: '', hourly_rate: '' }]
//   });
//   const [configLoading, setConfigLoading] = useState(false);

//   // Available roles
//   const availableRoles = [
//     'admin',
//     'Machining Module',
//     'Composite Module',
//     'Sheet Metal Module'
//   ];

//   // Fetch users from backend
//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     setFetchLoading(true);
//     try {
//       const response = await fetch('http://localhost:5678/users', {
//         method: 'GET',
//         headers: {
//           'accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//       });
//       if (response.ok) {
//         const userData = await response.json();
//         setUsers(userData);
//       } else {
//         setMessage({ type: 'error', content: 'Failed to fetch users' });
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       setMessage({ type: 'error', content: 'Network error while fetching users' });
//     } finally {
//       setFetchLoading(false);
//     }
//   };

//   const handleBackToHome = () => {
//     // Replace with your navigation logic
//     window.history.back();
//   };

//   const handleCreateUser = async () => {
//     if (!newUser.username || !newUser.password || !newUser.role) {
//       setMessage({ type: 'error', content: 'Please fill in all fields' });
//       return;
//     }

//     setLoading(true);
//     setMessage({ type: '', content: '' });

//     try {
//       const response = await fetch('http://localhost:5678/create-user', {
//         method: 'POST',
//         headers: {
//           'accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: newUser.username,
//           password: newUser.password,
//           role: newUser.role
//         })
//       });

//       if (response.ok) {
//         const result = await response.json();
//         setMessage({ type: 'success', content: 'User created successfully!' });
        
//         // Reset form
//         setNewUser({ username: '', password: '', role: 'admin' });
        
//         // Refresh users list
//         await fetchUsers();
        
//         // Switch to users tab to show the new user
//         setTimeout(() => {
//           setActiveTab('users');
//         }, 1500);
//       } else {
//         const errorData = await response.json();
//         setMessage({ type: 'error', content: errorData.message || 'Failed to create user' });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', content: 'Network error. Please try again.' });
//       console.error('Error creating user:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateUser = (user) => {
//     setSelectedUser(user);
//     setPasswordFormData({
//       username: user.username,
//       role: user.role,
//       new_password: '',
//       secret_key: ''
//     });
//     setShowPasswordModal(true);
//     setMessage({ type: '', content: '' });
//   };

//   const handlePasswordUpdate = async () => {
//     if (!passwordFormData.new_password) {
//       setMessage({ type: 'error', content: 'Please enter a new password' });
//       return;
//     }

//     if (selectedUser.role === 'admin' && !passwordFormData.secret_key) {
//       setMessage({ type: 'error', content: 'Secret key is required for admin users' });
//       return;
//     }

//     setPasswordLoading(true);
//     setMessage({ type: '', content: '' });

//     try {
//       let response;
      
//       if (selectedUser.role === 'admin') {
//         // Use admin endpoint for admin users
//         response = await fetch('http://localhost:5678/admin/update-password', {
//           method: 'PUT',
//           headers: {
//             'accept': 'application/json',
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             username: passwordFormData.username,
//             new_password: passwordFormData.new_password,
//             secret_key: passwordFormData.secret_key
//           }),
//         });
//       } else {
//         // Use regular endpoint for other role users
//         response = await fetch('http://localhost:5678/update-password', {
//           method: 'PUT',
//           headers: {
//             'accept': 'application/json',
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             username: passwordFormData.username,
//             role: passwordFormData.role,
//             new_password: passwordFormData.new_password
//           }),
//         });
//       }

//       const data = await response.json();

//       if (response.ok) {
//         setMessage({ type: 'success', content: data.message || 'Password updated successfully' });
//         setShowPasswordModal(false);
//         setPasswordFormData({
//           username: '',
//           role: '',
//           new_password: '',
//           secret_key: ''
//         });
//       } else {
//         setMessage({ type: 'error', content: data.message || 'Failed to update password. Please try again.' });
//       }
//     } catch (error) {
//       console.error('Password update error:', error);
//       setMessage({ type: 'error', content: 'Network error. Please try again.' });
//     } finally {
//       setPasswordLoading(false);
//     }
//   };

//   const closePasswordModal = () => {
//     setShowPasswordModal(false);
//     setSelectedUser(null);
//     setPasswordFormData({
//       username: '',
//       role: '',
//       new_password: '',
//       secret_key: ''
//     });
//     setMessage({ type: '', content: '' });
//   };

//   const handleDeleteUser = async (user) => {
//     setSelectedUser(user);
//     setDeleteFormData({
//       username: user.username,
//       role: user.role
//     });
//     setShowDeleteModal(true);
//     setMessage({ type: '', content: '' });
//   };

//   const confirmDeleteUser = async () => {
//     setDeleteLoading(true);
//     setMessage({ type: '', content: '' });

//     try {
//       const response = await fetch('http://localhost:5678/users/delete', {
//         method: 'DELETE',
//         headers: {
//           'accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: deleteFormData.username,
//           role: deleteFormData.role
//         })
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage({ type: 'success', content: data.message || 'User deleted successfully!' });
//         setShowDeleteModal(false);
//         setDeleteFormData({ username: '', role: '' });
//         await fetchUsers(); // Refresh the users list
//       } else {
//         setMessage({ type: 'error', content: data.message || 'Failed to delete user' });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', content: 'Network error. Please try again.' });
//       console.error('Error deleting user:', error);
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   const closeDeleteModal = () => {
//     setShowDeleteModal(false);
//     setSelectedUser(null);
//     setDeleteFormData({ username: '', role: '' });
//     setMessage({ type: '', content: '' });
//   };

//   const startEditUser = (user) => {
//     handleUpdateUser(user);
//   };

//   const cancelEdit = () => {
//     // Not needed anymore since we're using modal
//   };

//   // Configuration tab handlers
//   const handleConfigSubmit = async () => {
//     if (!configData.machine_type) {
//       setMessage({ type: 'error', content: 'Please enter machine type' });
//       return;
//     }

//     // Validate rates
//     for (let i = 0; i < configData.rates.length; i++) {
//       const rate = configData.rates[i];
//       if (!rate.volume_limit || !rate.hourly_rate) {
//         setMessage({ type: 'error', content: 'Please fill in all volume limits and hourly rates' });
//         return;
//       }
      
//       const volumeLimit = parseFloat(rate.volume_limit);
//       const hourlyRate = parseFloat(rate.hourly_rate);
      
//       if (isNaN(volumeLimit) || volumeLimit < 0) {
//         setMessage({ type: 'error', content: 'Volume limit must be a valid non-negative number' });
//         return;
//       }
      
//       if (isNaN(hourlyRate) || hourlyRate < 0) {
//         setMessage({ type: 'error', content: 'Hourly rate must be a valid non-negative number' });
//         return;
//       }
//     }

//     setConfigLoading(true);
//     setMessage({ type: '', content: '' });

//     // Convert string values to numbers for API call
//     const configPayload = {
//       machine_type: configData.machine_type,
//       rates: configData.rates.map(rate => ({
//         volume_limit: parseFloat(rate.volume_limit),
//         hourly_rate: parseFloat(rate.hourly_rate)
//       }))
//     };

//     try {
//       // Based on your screenshot, the correct endpoint with trailing slash works
//       const response = await fetch('http://localhost:5678/machine-rates/', {
//         method: 'POST',
//         headers: {
//           'accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(configPayload)
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage({ type: 'success', content: 'Machine rates configured successfully!' });
//         // Reset form
//         setConfigData({
//           machine_type: '',
//           rates: [{ volume_limit: '', hourly_rate: '' }]
//         });
//       } else {
//         // If we get here, show the specific error from the API
//         setMessage({ 
//           type: 'error', 
//           content: data.detail || data.message || `Failed to configure machine rates. Error: ${response.status} ${response.statusText}` 
//         });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', content: 'Network error. Please check your connection and try again.' });
//       console.error('Error configuring machine rates:', error);
//     } finally {
//       setConfigLoading(false);
//     }
//   };

//   const addRate = () => {
//     setConfigData({
//       ...configData,
//       rates: [...configData.rates, { volume_limit: '', hourly_rate: '' }]
//     });
//   };

//   const removeRate = (index) => {
//     if (configData.rates.length > 1) {
//       const newRates = configData.rates.filter((_, i) => i !== index);
//       setConfigData({ ...configData, rates: newRates });
//     }
//   };

//   const updateRate = (index, field, value) => {
//     const newRates = [...configData.rates];
//     newRates[index] = { ...newRates[index], [field]: value };
//     setConfigData({ ...configData, rates: newRates });
//   };

//   const filteredUsers = users.filter(user =>
//     user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.role.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const getRoleColor = (role) => {
//     const colors = {
//       'admin': '#dc2626',
//       'Machining Module': '#2563eb',
//       'Composite Module': '#059669',
//       'Sheet Metal Module': '#7c3aed'
//     };
//     return colors[role] || '#6b7280';
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
//       {/* Header */}
//       <div className="mb-6">
//         <button
//           onClick={handleBackToHome}
//           className="flex items-center space-x-2 mb-4 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-100"
//           style={{color: '#246679'}}
//         >
//           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
//           </svg>
//           <span className="font-semibold">Back to Modules</span>
//         </button>

//         <div className="text-center">
//           <h1 
//             className="text-3xl font-bold tracking-wider mb-2"
//             style={{
//               fontFamily: 'Times New Roman, serif',
//               color: '#246679'
//             }}
//           >
//             ACCESS CONTROL
//           </h1>
//           <p className="text-gray-600">Manage user roles and permissions</p>
//         </div>
//       </div>

//       {/* Message Display */}
//       {message.content && (
//         <div className={`mb-4 max-w-sm mx-auto p-2 rounded-lg text-sm ${
//           message.type === 'success' 
//             ? 'bg-green-100 text-green-700 border border-green-300'
//             : 'bg-red-100 text-red-700 border border-red-300'
//         }`}>
//           {message.content}
//         </div>
//       )}

//       {/* Tabs */}
//       <div className="mb-6">
//         <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg max-w-md mx-auto">
//           <button
//             onClick={() => setActiveTab('create')}
//             className={`flex-1 px-3 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${
//               activeTab === 'create'
//                 ? 'bg-white text-blue-600 shadow-sm'
//                 : 'text-gray-600 hover:text-blue-600'
//             }`}
//           >
//             Create New User
//           </button>
//           <button
//             onClick={() => setActiveTab('users')}
//             className={`flex-1 px-3 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${
//               activeTab === 'users'
//                 ? 'bg-white text-blue-600 shadow-sm'
//                 : 'text-gray-600 hover:text-blue-600'
//             }`}
//           >
//             Users
//           </button>
//           <button
//             onClick={() => setActiveTab('configuration')}
//             className={`flex-1 px-3 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${
//               activeTab === 'configuration'
//                 ? 'bg-white text-blue-600 shadow-sm'
//                 : 'text-gray-600 hover:text-blue-600'
//             }`}
//           >
//             Configuration
//           </button>
//         </div>
//       </div>

//       {/* Create User Tab */}
//       {activeTab === 'create' && (
//         <div className="max-w-sm mx-auto">
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             <h2 className="text-xl font-bold mb-4 text-center" style={{color: '#246679'}}>
//               Create New User
//             </h2>

//             <div className="space-y-3">
//               {/* Username Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Username *
//                 </label>
//                 <input
//                   type="text"
//                   value={newUser.username}
//                   onChange={(e) => setNewUser({...newUser, username: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                   placeholder="Enter username"
//                 />
//               </div>

//               {/* Password Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Password *
//                 </label>
//                 <input
//                   type="password"
//                   value={newUser.password}
//                   onChange={(e) => setNewUser({...newUser, password: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                   placeholder="Enter password"
//                 />
//               </div>

//               {/* Role Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Role *
//                 </label>
//                 <select
//                   value={newUser.role}
//                   onChange={(e) => setNewUser({...newUser, role: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                 >
//                   {availableRoles.map(role => (
//                     <option key={role} value={role}>{role}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Create Button */}
//               <button
//                 onClick={handleCreateUser}
//                 disabled={loading}
//                 className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition-all duration-300 text-sm ${
//                   loading 
//                     ? 'bg-gray-400 cursor-not-allowed' 
//                     : 'bg-[#246679] hover:bg-[#246679] hover:scale-105 shadow-lg'
//                 }`}
//               >
//                 {loading ? (
//                   <div className="flex items-center justify-center space-x-2">
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     <span>Creating...</span>
//                   </div>
//                 ) : (
//                   'Create User'
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Configuration Tab */}
//       {activeTab === 'configuration' && (
//         <div className="max-w-lg mx-auto">
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             <h2 className="text-xl font-bold mb-4 text-center" style={{color: '#246679'}}>
//               Machine Rates Configuration
//             </h2>

//             <div className="space-y-4">
//               {/* Machine Type Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Machine Type *
//                 </label>
//                 <input
//                   type="text"
//                   value={configData.machine_type}
//                   onChange={(e) => setConfigData({...configData, machine_type: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                   placeholder="Enter machine type"
//                 />
//               </div>

//               {/* Rates Section */}
//               <div>
//                 <div className="flex items-center justify-between mb-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Rates *
//                   </label>
//                   <button
//                     onClick={addRate}
//                     className="px-3 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 transition-colors duration-200"
//                   >
//                     + Add Rate
//                   </button>
//                 </div>

//                 <div className="space-y-3">
//                   {configData.rates.map((rate, index) => (
//                     <div key={index} className="border border-gray-200 rounded-lg p-3">
//                       <div className="flex items-center justify-between mb-2">
//                         <span className="text-sm font-medium text-gray-700">Rate {index + 1}</span>
//                         {configData.rates.length > 1 && (
//                           <button
//                             onClick={() => removeRate(index)}
//                             className="px-2 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors duration-200"
//                           >
//                             Remove
//                           </button>
//                         )}
//                       </div>
                      
//                       <div className="grid grid-cols-2 gap-3">
//                         <div>
//                           <label className="block text-xs font-medium text-gray-600 mb-1">
//                             Volume Limit
//                           </label>
//                           <input
//                             type="text"
//                             value={rate.volume_limit}
//                             onChange={(e) => updateRate(index, 'volume_limit', e.target.value)}
//                             className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             placeholder="Enter volume limit"
//                           />
//                         </div>
                        
//                         <div>
//                           <label className="block text-xs font-medium text-gray-600 mb-1">
//                             Hourly Rate
//                           </label>
//                           <input
//                             type="text"
//                             value={rate.hourly_rate}
//                             onChange={(e) => updateRate(index, 'hourly_rate', e.target.value)}
//                             className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             placeholder="Enter hourly rate"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <button
//                 onClick={handleConfigSubmit}
//                 disabled={configLoading}
//                 className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition-all duration-300 text-sm ${
//                   configLoading 
//                     ? 'bg-gray-400 cursor-not-allowed' 
//                     : 'bg-[#246679] hover:bg-[#246679] hover:scale-105 shadow-lg'
//                 }`}
//               >
//                 {configLoading ? (
//                   <div className="flex items-center justify-center space-x-2">
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     <span>Configuring...</span>
//                   </div>
//                 ) : (
//                   'Save Configuration'
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Users Tab */}
//       {activeTab === 'users' && (
//         <div className="max-w-6xl mx-auto">
//           {/* Users Summary - Compact Cards */}
//           {!fetchLoading && users.length > 0 && (
//             <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
//               <div className="bg-white rounded-lg p-3 shadow-md border-l-4" style={{borderLeftColor: '#246679'}}>
//                 <div className="text-xl font-bold" style={{color: '#246679'}}>{users.length}</div>
//                 <div className="text-xs text-gray-600">Total Users</div>
//               </div>
//               <div className="bg-white rounded-lg p-3 shadow-md border-l-4 border-red-500">
//                 <div className="text-xl font-bold text-red-600">
//                   {users.filter(u => u.role === 'admin').length}
//                 </div>
//                 <div className="text-xs text-gray-600">Admin Users</div>
//               </div>
//               <div className="bg-white rounded-lg p-3 shadow-md border-l-4 border-blue-500">
//                 <div className="text-xl font-bold text-blue-600">
//                   {users.filter(u => u.role === 'Machining Module').length}
//                 </div>
//                 <div className="text-xs text-gray-600">Machining Module</div>
//               </div>
//               <div className="bg-white rounded-lg p-3 shadow-md border-l-4 border-green-500">
//                 <div className="text-xl font-bold text-green-600">
//                   {users.filter(u => u.role === 'Composite Module' || u.role === 'Sheet Metal Module').length}
//                 </div>
//                 <div className="text-xs text-gray-600">Other Modules</div>
//               </div>
//             </div>
//           )}

//           {/* Search Bar */}
//           <div className="mb-4">
//             <div className="relative max-w-sm mx-auto">
//               <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
//               </svg>
//               <input
//                 type="text"
//                 placeholder="Search users..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//               />
//             </div>
//           </div>

//           {/* Users Table - Compact Version */}
//           <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//             <div className="overflow-x-auto">
//               {fetchLoading ? (
//                 <div className="flex items-center justify-center py-8">
//                   <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                   <span className="ml-3 text-gray-600 text-sm">Loading users...</span>
//                 </div>
//               ) : (
//                 <table className="w-full text-sm">
//                   <thead style={{backgroundColor: '#246679'}}>
//                     <tr>
//                       <th className="px-4 py-3 text-left text-sm font-semibold text-white">Username</th>
//                       <th className="px-4 py-3 text-left text-sm font-semibold text-white">Role</th>
//                       <th className="px-4 py-3 text-left text-sm font-semibold text-white">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {filteredUsers.map((user) => (
//                       <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
//                         {/* Username */}
//                         <td className="px-4 py-3">
//                           <div className="flex items-center space-x-2">
//                             <div 
//                               className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs"
//                               style={{backgroundColor: getRoleColor(user.role)}}
//                             >
//                               {user.username.substring(0, 2).toUpperCase()}
//                             </div>
//                             <div>
//                               <div className="font-semibold text-gray-900 text-sm">{user.username}</div>
//                             </div>
//                           </div>
//                         </td>

//                         {/* Role */}
//                         <td className="px-4 py-3">
//                           <span className="text-gray-900 font-medium text-sm">
//                             {user.role}
//                           </span>
//                         </td>

//                         {/* Actions */}
//                         <td className="px-4 py-3">
//                           <div className="flex space-x-1">
//                             <button
//                               onClick={() => startEditUser(user)}
//                               className="px-2 py-1 text-xs text-white rounded-md hover:opacity-90 transition-all duration-200"
//                               style={{backgroundColor: '#246679'}}
//                             >
//                               Update
//                             </button>
//                             <button
//                               onClick={() => handleDeleteUser(user)}
//                               className="px-2 py-1 text-xs text-white rounded-md hover:opacity-90 transition-all duration-200"
//                               style={{backgroundColor: '#dc2626'}}
//                             >
//                               Delete
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>

//             {/* Empty State */}
//             {!fetchLoading && filteredUsers.length === 0 && (
//               <div className="text-center py-8">
//                 <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
//                 </svg>
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
//                 <p className="text-gray-500 text-sm">Try adjusting your search criteria</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Password Update Modal */}
//       {showPasswordModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-xl p-5 w-full max-w-sm mx-4">
//             <h2 className="text-lg font-bold mb-4" style={{color: '#246679'}}>
//               Update Password for {selectedUser?.username}
//             </h2>

//             <div className="space-y-3">
//               {/* Username (Read-only) */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Username
//                 </label>
//                 <input
//                   type="text"
//                   value={passwordFormData.username}
//                   disabled
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-sm"
//                 />
//               </div>

//               {/* Role (Read-only) */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Role
//                 </label>
//                 <input
//                   type="text"
//                   value={passwordFormData.role}
//                   disabled
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-sm"
//                 />
//               </div>

//               {/* New Password */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   New Password *
//                 </label>
//                 <input
//                   type="password"
//                   value={passwordFormData.new_password}
//                   onChange={(e) => setPasswordFormData({...passwordFormData, new_password: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                   placeholder="Enter new password"
//                 />
//               </div>

//               {/* Secret Key (Only for admin users) */}
//               {selectedUser?.role === 'admin' && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Secret Key *
//                   </label>
//                   <input
//                     type="password"
//                     value={passwordFormData.secret_key}
//                     onChange={(e) => setPasswordFormData({...passwordFormData, secret_key: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                     placeholder="Enter admin secret key"
//                   />
//                 </div>
//               )}
//             </div>

//             {/* Modal Actions */}
//             <div className="flex space-x-2 mt-5">
//               <button
//                 onClick={handlePasswordUpdate}
//                 disabled={passwordLoading}
//                 className={`flex-1 py-2 px-3 rounded-lg font-semibold text-white transition-all duration-300 text-sm ${
//                   passwordLoading 
//                     ? 'bg-gray-400 cursor-not-allowed' 
//                     : 'bg-[#246679] hover:bg-[#246679]'
//                 }`}
//               >
//                 {passwordLoading ? (
//                   <div className="flex items-center justify-center space-x-2">
//                     <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     <span>Updating...</span>
//                   </div>
//                 ) : (
//                   'Update Password'
//                 )}
//               </button>
              
//               <button
//                 onClick={closePasswordModal}
//                 disabled={passwordLoading}
//                 className="flex-1 py-2 px-3 rounded-lg font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-all duration-300 text-sm"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete User Modal */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-xl p-5 w-full max-w-sm mx-4">
//             <h2 className="text-lg font-bold mb-4" style={{color: '#246679'}}>
//               Delete User
//             </h2>
            
//             <p className="text-gray-600 mb-4 text-sm">
//               Are you sure you want to delete this user? This action cannot be undone.
//             </p>

//             <div className="space-y-3">
//               {/* Username (Read-only) */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Username
//                 </label>
//                 <input
//                   type="text"
//                   value={deleteFormData.username}
//                   disabled
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-sm"
//                 />
//               </div>

//               {/* Role (Read-only) */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Role
//                 </label>
//                 <input
//                   type="text"
//                   value={deleteFormData.role}
//                   disabled
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-sm"
//                 />
//               </div>
//             </div>

//             {/* Modal Actions */}
//             <div className="flex space-x-2 mt-5">
//               <button
//                 onClick={confirmDeleteUser}
//                 disabled={deleteLoading}
//                 className={`flex-1 py-2 px-3 rounded-lg font-semibold text-white transition-all duration-300 text-sm ${
//                   deleteLoading 
//                     ? 'bg-gray-400 cursor-not-allowed' 
//                     : 'bg-red-600 hover:bg-red-700'
//                 }`}
//               >
//                 {deleteLoading ? (
//                   <div className="flex items-center justify-center space-x-2">
//                     <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     <span>Deleting...</span>
//                   </div>
//                 ) : (
//                   'Delete User'
//                 )}
//               </button>
              
//               <button
//                 onClick={closeDeleteModal}
//                 disabled={deleteLoading}
//                 className="flex-1 py-2 px-3 rounded-lg font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-all duration-300 text-sm"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AccessControl;