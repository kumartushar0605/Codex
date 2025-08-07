"use client";
import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Check, X } from 'lucide-react';

const UsersPage = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@university.edu', role: 'Member', year: '3rd', status: 'Active', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@university.edu', role: 'Mentor', year: '4th', status: 'Active', joinDate: '2024-01-10' },
    { id: 3, name: 'Bob Wilson', email: 'bob@university.edu', role: 'Member', year: '2nd', status: 'Pending', joinDate: '2024-06-18' }
  ]);

  const handleUserAction = (userId, action) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, status: action === 'approve' ? 'Active' : 'Rejected' } : user
    ));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-200 tracking-tight drop-shadow">User Management</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 sm:py-3 bg-slate-800/50 text-white border border-slate-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 placeholder-slate-400 text-sm sm:text-base w-full sm:w-64"
            />
          </div>
          <button
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-600 hover:to-cyan-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold shadow-lg transition-all duration-200 text-sm sm:text-base justify-center"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Add User</span>
          </button>
        </div>
      </div>
      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-4">
        {users.map((user) => (
          <div key={user.id} className="bg-slate-900/80 rounded-xl p-4 border border-slate-700/50">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-bold text-cyan-200">{user.name}</h3>
                <p className="text-slate-400 text-sm">{user.email}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                user.role === 'Admin' ? 'bg-red-100 text-red-800' :
                user.role === 'Mentor' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {user.role}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div>
                <span className="text-slate-400">Year:</span>
                <span className="text-white ml-2">{user.year}</span>
              </div>
              <div>
                <span className="text-slate-400">Status:</span>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  user.status === 'Active' ? 'bg-green-100 text-green-800' :
                  user.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {user.status}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400">Joined:</span>
                <span className="text-white ml-2">{user.joinDate}</span>
              </div>
            </div>
            <div className="flex gap-2">
              {user.status === 'Pending' && (
                <>
                  <button
                    onClick={() => handleUserAction(user.id, 'approve')}
                    className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1 text-sm"
                  >
                    <Check className="h-3 w-3" /> Approve
                  </button>
                  <button
                    onClick={() => handleUserAction(user.id, 'reject')}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-1 text-sm"
                  >
                    <X className="h-3 w-3" /> Reject
                  </button>
                </>
              )}
              <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 text-sm">
                <Edit className="h-3 w-3" /> Edit
              </button>
              <button className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-1 text-sm">
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block bg-slate-900/80 rounded-xl shadow-lg overflow-hidden border border-slate-700/50">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">User</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Role</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Year</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Join Date</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-slate-900/40 divide-y divide-slate-700/50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-cyan-200">{user.name}</div>
                      <div className="text-sm text-slate-400">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'Admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'Mentor' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-slate-300">{user.year}</td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' :
                      user.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-slate-300">{user.joinDate}</td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-1 lg:gap-2">
                      {user.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleUserAction(user.id, 'approve')}
                            className="text-green-400 hover:text-green-300 bg-green-600/20 hover:bg-green-600/30 p-1 lg:p-2 rounded transition-colors"
                            title="Approve user"
                          >
                            <Check className="h-3 w-3 lg:h-4 lg:w-4" />
                          </button>
                          <button
                            onClick={() => handleUserAction(user.id, 'reject')}
                            className="text-red-400 hover:text-red-300 bg-red-600/20 hover:bg-red-600/30 p-1 lg:p-2 rounded transition-colors"
                            title="Reject user"
                          >
                            <X className="h-3 w-3 lg:h-4 lg:w-4" />
                          </button>
                        </>
                      )}
                      <button
                        className="text-blue-400 hover:text-blue-300 bg-blue-600/20 hover:bg-blue-600/30 p-1 lg:p-2 rounded transition-colors"
                        title="Edit user"
                      >
                        <Edit className="h-3 w-3 lg:h-4 lg:w-4" />
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300 bg-red-600/20 hover:bg-red-600/30 p-1 lg:p-2 rounded transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="h-3 w-3 lg:h-4 lg:w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;