"use client";
import React, { useState, useEffect } from 'react';
import { Bell, Plus, Edit, Trash2, Calendar, X } from 'lucide-react';
import { announcementAPI } from '@/services/api';
import { toast } from 'react-toastify';
import { useAdmin } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';

const AnnouncementsPage = () => {
  console.log('🎯 AnnouncementsPage component is rendering');
  const { isAuthenticated: adminAuthenticated, loading: adminLoading } = useAdmin();
  const router = useRouter();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: '',
    priority: 'medium'
  });

  // Admin authentication check
  useEffect(() => {
    if (!adminLoading && !adminAuthenticated) {
      router.push('/');
    }
  }, [adminAuthenticated, adminLoading, router]);

  // Fetch announcements on component mount
  useEffect(() => {
    if (adminAuthenticated) {
      console.log('🚀 useEffect triggered - fetching announcements');
      fetchAnnouncements();
    }
  }, [adminAuthenticated]);

  const fetchAnnouncements = async () => {
    console.log('📡 fetchAnnouncements called');
    try {
      setLoading(true);
      console.log('📡 Making API call to getAllAnnouncements...');
      const response = await announcementAPI.getAllAnnouncements();
      console.log('📥 Announcements response:', response);
      if (response.success) {
        console.log('✅ Announcements fetched successfully:', response.data);
        setAnnouncements(response.data);
      } else {
        console.log('❌ Response success is false:', response);
      }
    } catch (error) {
      console.error('❌ Error fetching announcements:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      // Handle authentication errors specifically
      if (error.response?.status === 401) {
        console.log('🔒 Authentication error - user needs to login');
        toast.error('Please login to access announcements');
      } else if (error.response?.status === 400) {
        // Don't show error for "no announcements exist"
        console.log('📭 No announcements exist yet');
        setAnnouncements([]);
      } else {
        toast.error('Failed to fetch announcements');
      }
    } finally {
      console.log('🏁 Setting loading to false');
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await announcementAPI.createAnnouncement(formData);
      console.log('Create announcement response:', response);
      if (response.success) {
        toast.success('Announcement created successfully!');
        setShowModal(false);
        resetForm();
        fetchAnnouncements();
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error(error.response?.data?.message || 'Failed to create announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await announcementAPI.updateAnnouncement(editingAnnouncement._id, formData);
      console.log('Update announcement response:', response);
      if (response.success) {
        toast.success('Announcement updated successfully!');
        setShowModal(false);
        setEditingAnnouncement(null);
        resetForm();
        fetchAnnouncements();
      }
    } catch (error) {
      console.error('Error updating announcement:', error);
      toast.error(error.response?.data?.message || 'Failed to update announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        const response = await announcementAPI.deleteAnnouncement(announcementId);
        console.log('Delete announcement response:', response);
        if (response.success) {
          toast.success('Announcement deleted successfully!');
          fetchAnnouncements();
        }
      } catch (error) {
        console.error('Error deleting announcement:', error);
        toast.error(error.response?.data?.message || 'Failed to delete announcement');
      }
    }
  };

  const openCreateModal = () => {
    resetForm();
    setEditingAnnouncement(null);
    setShowModal(true);
  };

  const openEditModal = (announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      date: new Date(announcement.date).toISOString().split('T')[0],
      priority: announcement.priority
    });
    setEditingAnnouncement(announcement);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      date: '',
      priority: 'medium'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-200 tracking-tight drop-shadow">Manage Announcements</h1>
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-600 hover:to-cyan-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 text-sm sm:text-base w-full sm:w-auto justify-center"
          onClick={openCreateModal}
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Create Announcement
        </button>
      </div>

      {/* Announcement Creation/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all p-4">
          <div className="bg-gradient-to-br from-slate-900 to-black text-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl p-4 sm:p-6 lg:p-8 relative animate-fadeIn max-h-[95vh] overflow-y-auto border border-slate-700/50">
            {/* Header */}
            <div className="flex items-start justify-between mb-6 sm:mb-8 pb-4 border-b border-slate-700/50">
              <div className="flex-1 pr-4">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
                  {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">Fill in the details below</p>
              </div>
              <button
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-800 hover:bg-red-600 text-gray-400 hover:text-white transition-all duration-200 flex items-center justify-center flex-shrink-0"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <form
              onSubmit={editingAnnouncement ? handleUpdateAnnouncement : handleCreateAnnouncement}
              className="space-y-4 sm:space-y-6"
            >
              {/* Title */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-slate-300">Title *</label>
                <input
                  type="text"
                  placeholder="Enter announcement title"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 text-white border border-slate-600 focus:ring-2 focus:ring-cyan-400 focus:border-transparent rounded-lg sm:rounded-xl transition-all duration-200 placeholder-slate-400 text-sm sm:text-base"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-slate-300">Date *</label>
                <input
                  type="date"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 text-white border border-slate-600 focus:ring-2 focus:ring-cyan-400 focus:border-transparent rounded-lg sm:rounded-xl transition-all duration-200 text-sm sm:text-base"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-slate-300">Priority *</label>
                <select
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 text-white border border-slate-600 focus:ring-2 focus:ring-cyan-400 focus:border-transparent rounded-lg sm:rounded-xl transition-all duration-200 text-sm sm:text-base"
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: e.target.value })}
                  required
                >
                  <option value="low">🟢 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🔴 High Priority</option>
                </select>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-slate-300">Content *</label>
                <textarea
                  placeholder="Enter announcement content..."
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 text-white border border-slate-600 focus:ring-2 focus:ring-cyan-400 focus:border-transparent rounded-lg sm:rounded-xl transition-all duration-200 placeholder-slate-400 resize-none text-sm sm:text-base"
                  rows={4}
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4 sm:pt-6 border-t border-slate-700/50">
                <button
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-purple-600 hover:via-blue-500 hover:to-cyan-500 text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                      <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {editingAnnouncement ? 'Updating...' : 'Creating...'}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                      <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span className="hidden sm:inline">{editingAnnouncement ? 'Update Announcement' : 'Create Announcement'}</span>
                      <span className="sm:hidden">{editingAnnouncement ? 'Update' : 'Create'}</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List of Announcements */}
      <div className="mt-6 sm:mt-8 lg:mt-10">
        {loading && announcements.length === 0 ? (
          <div className="flex justify-center items-center h-32 sm:h-40">
            <span className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-cyan-500"></span>
            <span className="ml-3 sm:ml-4 text-cyan-300 font-semibold text-sm sm:text-base">Loading announcements...</span>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center text-slate-400 py-12 sm:py-16 lg:py-20">
            <Bell className="mx-auto mb-3 sm:mb-4 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-cyan-700/40" />
            <p className="text-base sm:text-lg">No announcements found. Start by creating a new announcement!</p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {announcements.map(announcement => (
              <div
                key={announcement._id}
                className="bg-slate-900/80 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border border-slate-700/50 hover:shadow-2xl transition-all duration-200 group relative overflow-hidden"
              >
                {/* Priority indicator */}
                <div className="absolute top-0 right-0 w-1 sm:w-2 h-full bg-gradient-to-b from-transparent via-current to-transparent opacity-20"
                     style={{
                       color: announcement.priority === 'high' ? '#ef4444' :
                              announcement.priority === 'medium' ? '#f59e0b' : '#10b981'
                     }}>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-cyan-200 group-hover:text-cyan-400 transition-colors duration-200">
                        {announcement.title}
                      </h3>
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(announcement.priority)} self-start`}>
                        {getPriorityIcon(announcement.priority)} {announcement.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-300 mb-3 leading-relaxed text-sm sm:text-base">{announcement.content}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{new Date(announcement.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Created: {new Date(announcement.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:ml-4 self-start">
                    <button
                      className="p-1 sm:p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all duration-200 border border-blue-500/30"
                      onClick={() => openEditModal(announcement)}
                      title="Edit announcement"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      className="p-1 sm:p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all duration-200 border border-red-500/30"
                      onClick={() => handleDeleteAnnouncement(announcement._id)}
                      title="Delete announcement"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;