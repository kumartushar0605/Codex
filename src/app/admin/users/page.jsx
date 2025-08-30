"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Search, Edit, Trash2, Users, Plus, X, CheckCircle, AlertCircle } from "lucide-react";
import { useAdmin } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';
import { managedUserAPI } from '@/services/api';

const UsersPage = () => {
  const { isAuthenticated: adminAuthenticated, loading: adminLoading } = useAdmin();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [creatingUser, setCreatingUser] = useState(false);
  const [form, setForm] = useState({ 
    name: "", 
    github: "", 
    linkedin: "", 
    twitter: "", 
    role: "", 
    skill: "" 
  });
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.skill.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Extract GitHub username from URL and generate profile picture URL
  const extractGithubUsername = (githubUrl) => {
    if (!githubUrl) return "";
    
    // Remove trailing slash if exists
    const cleanUrl = githubUrl.replace(/\/$/, '');
    
    // Extract username from various GitHub URL formats
    const patterns = [
      /github\.com\/([^\/\?#]+)/,  // https://github.com/username
      /^([^\/\?#]+)$/              // just username
    ];
    
    for (const pattern of patterns) {
      const match = cleanUrl.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return "";
  };

  const generateGithubDP = (githubUrl) => {
    const username = extractGithubUsername(githubUrl);
    return username ? `https://github.com/${username}.png` : "";
  };

  // Admin authentication check
  useEffect(() => {
    if (!adminLoading && !adminAuthenticated) {
      router.push('/unauthorized');
    }
  }, [adminAuthenticated, adminLoading, router]);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  // Show loading while checking admin authentication
  if (adminLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render anything (will redirect)
  if (!adminAuthenticated) {
    return null;
  }

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await managedUserAPI.getAllManagedUsers();
      setUsers(result.data);
      showNotification("Users loaded successfully!");
    } catch (err) {
      console.error("Error fetching users:", err);
      showNotification("Error loading users", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) return;
    
    try {
      await managedUserAPI.deleteManagedUser(id);
      fetchUsers();
      showNotification(`${userName} deleted successfully!`);
    } catch (err) {
      console.error("Error deleting user:", err);
      showNotification("Error deleting user", "error");
    }
  };

  const handleCreateClick = () => {
    setCreatingUser(true);
    setEditingUser(null);
    setForm({ 
      name: "", 
      github: "", 
      linkedin: "", 
      twitter: "", 
      role: "", 
      skill: "" 
    });
  };

  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setCreatingUser(false);
    setForm({ 
      name: user.name, 
      github: user.github, 
      linkedin: user.linkedin, 
      twitter: user.twitter, 
      role: user.role, 
      skill: user.skill 
    });
  };

  const handleCancelForm = () => {
    setEditingUser(null);
    setCreatingUser(false);
    setForm({ 
      name: "", 
      github: "", 
      linkedin: "", 
      twitter: "", 
      role: "", 
      skill: "" 
    });
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const requiredFields = ['name', 'github', 'linkedin', 'twitter', 'role', 'skill'];
    const emptyFields = requiredFields.filter(field => !form[field].trim());
    
    if (emptyFields.length > 0) {
      showNotification("Please fill in all fields", "error");
      return false;
    }

    // Validate GitHub URL format
    const githubUsername = extractGithubUsername(form.github);
    if (!githubUsername) {
      showNotification("Please enter a valid GitHub URL or username", "error");
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      const userData = {
        ...form,
        githubDP: generateGithubDP(form.github)
      };

      await managedUserAPI.createManagedUser(userData);
      setCreatingUser(false);
      setForm({ 
        name: "", 
        github: "", 
        linkedin: "", 
        twitter: "", 
        role: "", 
        skill: "" 
      });
      fetchUsers();
      showNotification("User created successfully!");
    } catch (err) {
      console.error("Error creating user:", err);
      showNotification(err.response?.data?.message || "Error creating user", "error");
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      const userData = {
        ...form,
        githubDP: generateGithubDP(form.github)
      };

      await managedUserAPI.updateManagedUser(editingUser, userData);
      setEditingUser(null);
      setForm({ 
        name: "", 
        github: "", 
        linkedin: "", 
        twitter: "", 
        role: "", 
        skill: "" 
      });
      fetchUsers();
      showNotification("User updated successfully!");
    } catch (err) {
      console.error("Error updating user:", err);
      showNotification(err.response?.data?.message || "Error updating user", "error");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const formatUrl = (url) => {
    if (!url) return "#";
    return url.startsWith('http') ? url : `https://${url}`;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6 lg:p-8">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === "error" 
            ? "bg-red-500/90 text-white" 
            : "bg-green-500/90 text-white"
        }`}>
          {notification.type === "error" ? (
            <AlertCircle className="h-5 w-5" />
          ) : (
            <CheckCircle className="h-5 w-5" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Users className="h-8 w-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">User Management</h1>
              <p className="text-slate-400 text-sm">Manage your team members and their information</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Search Bar */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by name, role, or skill..."
                className="pl-10 pr-10 py-3 w-full bg-slate-800/50 backdrop-blur-sm text-white border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-slate-400 text-sm transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Create User Button */}
            <button
              onClick={handleCreateClick}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg whitespace-nowrap"
            >
              <Plus className="h-5 w-5" />
              Create User
            </button>
          </div>
        </div>

        {/* Search Results Info */}
        {searchTerm && (
          <div className="mb-4 text-slate-300 text-sm">
            Found {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} matching "{searchTerm}"
          </div>
        )}

        {/* Create/Edit Form */}
        {(creatingUser || editingUser) && (
          <div className="mb-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-semibold">
                {creatingUser ? "Create New User" : "Edit User"}
              </h2>
              <button
                onClick={handleCancelForm}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* GitHub Profile Preview */}
            {form.github && (
              <div className="mb-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                <div className="flex items-center gap-3">
                  <img 
                    src={generateGithubDP(form.github)} 
                    alt="GitHub Profile" 
                    className="w-12 h-12 rounded-full bg-slate-600"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";
                    }}
                  />
                  <div>
                    <p className="text-slate-300 text-sm font-medium">Profile Picture Preview</p>
                    <p className="text-slate-400 text-xs">{generateGithubDP(form.github)}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-slate-300 text-sm font-medium">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="Enter full name..."
                  className="w-full p-3 rounded-lg bg-slate-700/50 text-white placeholder-slate-400 border border-slate-600/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 text-sm font-medium">
                  GitHub <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="github"
                  value={form.github}
                  onChange={handleFormChange}
                  placeholder="GitHub URL or username..."
                  className="w-full p-3 rounded-lg bg-slate-700/50 text-white placeholder-slate-400 border border-slate-600/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                />
                <p className="text-xs text-slate-400">
                  Enter GitHub URL (https://github.com/username) or just username
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 text-sm font-medium">
                  LinkedIn <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="linkedin"
                  value={form.linkedin}
                  onChange={handleFormChange}
                  placeholder="LinkedIn profile URL..."
                  className="w-full p-3 rounded-lg bg-slate-700/50 text-white placeholder-slate-400 border border-slate-600/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 text-sm font-medium">
                  Twitter <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="twitter"
                  value={form.twitter}
                  onChange={handleFormChange}
                  placeholder="Twitter profile URL..."
                  className="w-full p-3 rounded-lg bg-slate-700/50 text-white placeholder-slate-400 border border-slate-600/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 text-sm font-medium">
                  Role <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="role"
                  value={form.role}
                  onChange={handleFormChange}
                  placeholder="Job role/position..."
                  className="w-full p-3 rounded-lg bg-slate-700/50 text-white placeholder-slate-400 border border-slate-600/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 text-sm font-medium">
                  Skill <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="skill"
                  value={form.skill}
                  onChange={handleFormChange}
                  placeholder="Primary skill/expertise..."
                  className="w-full p-3 rounded-lg bg-slate-700/50 text-white placeholder-slate-400 border border-slate-600/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={creatingUser ? handleCreate : handleUpdate}
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-200 font-medium"
              >
                {creatingUser ? "Create User" : "Update User"}
              </button>
              <button
                onClick={handleCancelForm}
                className="flex-1 bg-slate-600 text-white px-6 py-3 rounded-lg hover:bg-slate-500 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Users Table/Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            <span className="ml-3 text-slate-300">Loading users...</span>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-hidden bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-xl">
              <table className="min-w-full divide-y divide-slate-700/50">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">GitHub</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Social</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Skill</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-700/30 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={user.githubDP} 
                            alt={user.name}
                            className="w-10 h-10 rounded-full bg-slate-600"
                            onError={(e) => {
                              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";
                            }}
                          />
                          <span className="text-white font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a 
                          href={formatUrl(user.github)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 underline transition-colors duration-200"
                        >
                          GitHub Profile
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <a 
                            href={formatUrl(user.linkedin)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-xs underline transition-colors"
                          >
                            LinkedIn
                          </a>
                          <a 
                            href={formatUrl(user.twitter)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sky-400 hover:text-sky-300 text-xs underline transition-colors"
                          >
                            Twitter
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                          {user.skill}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200 p-1"
                            title="Edit User"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => deleteUser(user._id, user.name)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-200 p-1"
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {filteredUsers.map((user) => (
                <div key={user._id} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.githubDP} 
                        alt={user.name}
                        className="w-12 h-12 rounded-full bg-slate-600"
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";
                        }}
                      />
                      <h3 className="text-white font-semibold text-lg">{user.name}</h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200 p-2 hover:bg-blue-500/10 rounded-lg"
                        title="Edit User"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => deleteUser(user._id, user.name)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-200 p-2 hover:bg-red-500/10 rounded-lg"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-3">
                      <a 
                        href={formatUrl(user.github)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 underline transition-colors duration-200 text-sm"
                      >
                        GitHub
                      </a>
                      <a 
                        href={formatUrl(user.linkedin)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200 text-sm"
                      >
                        LinkedIn
                      </a>
                      <a 
                        href={formatUrl(user.twitter)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sky-400 hover:text-sky-300 underline transition-colors duration-200 text-sm"
                      >
                        Twitter
                      </a>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {user.role}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                        {user.skill}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results Message */}
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-slate-300 text-lg font-medium mb-2">
                  {searchTerm ? "No users found" : "No users available"}
                </h3>
                <p className="text-slate-400 mb-4">
                  {searchTerm 
                    ? `No users match your search for "${searchTerm}"`
                    : "Get started by adding some users to your team."
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="text-purple-400 hover:text-purple-300 underline transition-colors"
                    >
                      Clear search
                    </button>
                  )}
                  {!searchTerm && (
                    <button
                      onClick={handleCreateClick}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg"
                    >
                      <Plus className="h-5 w-5" />
                      Create Your First User
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UsersPage;