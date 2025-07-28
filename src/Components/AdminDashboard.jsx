"use client"
import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, MessageSquare, Trophy, Settings, 
  Plus, Edit, Trash2, Eye, UserCheck, UserX, 
  Bell, Code, Award, BarChart3, Filter,
  Search, ChevronDown, X, Check, LogOut
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { eventAPI } from '@/services/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { admin, logout } = useAdmin();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  
  // Real data from backend
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@university.edu', role: 'Member', year: '3rd', status: 'Active', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@university.edu', role: 'Mentor', year: '4th', status: 'Active', joinDate: '2024-01-10' },
    { id: 3, name: 'Bob Wilson', email: 'bob@university.edu', role: 'Member', year: '2nd', status: 'Pending', joinDate: '2024-06-18' }
  ]);
  
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'New Coding Challenge Released', content: 'Weekly challenge on dynamic programming is now live!', date: '2024-06-20', pinned: true },
    { id: 2, title: 'Hackathon Registration Open', content: 'Register now for our annual hackathon!', date: '2024-06-18', pinned: false }
  ]);
  
  const [projects, setProjects] = useState([
    { id: 1, title: 'E-commerce Platform', team: 'Team Alpha', status: 'Approved', tech: 'React, Node.js', submitted: '2024-06-15' },
    { id: 2, title: 'Chat Application', team: 'Team Beta', status: 'Pending', tech: 'Socket.io, Express', submitted: '2024-06-18' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    subtitle: '',
    date: '',
    time: '',
    participantsLimit: '',
    location: '',
    duration: '',
    participants: '',
    prizes: '',
    type: '',
    color: '#3B82F6',
    bgColor: '#1E40AF',
    highlights: [],
    description: ''
  });

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getAllEvents();
      if (response.success) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.createEvent(eventFormData);
      if (response.success) {
        toast.success('Event created successfully!');
        setShowModal(false);
        setEventFormData({
          title: '',
          subtitle: '',
          date: '',
          time: '',
          participantsLimit: '',
          location: '',
          duration: '',
          participants: '',
          prizes: '',
          type: '',
          color: '#3B82F6',
          bgColor: '#1E40AF',
          highlights: [],
          description: ''
        });
        fetchEvents(); // Refresh events list
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        setLoading(true);
        const response = await eventAPI.deleteEvent(eventId);
        if (response.success) {
          toast.success('Event deleted successfully!');
          fetchEvents(); // Refresh events list
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const stats = {
    totalUsers: users.length,
    activeEvents: events.length, // All events from backend
    pendingApprovals: users.filter(u => u.status === 'Pending').length + projects.filter(p => p.status === 'Pending').length,
    totalProjects: projects.length
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setModalType('');
  };

  const handleUserAction = (userId, action) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: action === 'approve' ? 'Active' : 'Rejected' } : user
    ));
  };

  const handleProjectAction = (projectId, action) => {
    setProjects(projects.map(project => 
      project.id === projectId ? { ...project, status: action === 'approve' ? 'Approved' : 'Rejected' } : project
    ));
  };

  const togglePinAnnouncement = (id) => {
    setAnnouncements(announcements.map(ann => 
      ann.id === id ? { ...ann, pinned: !ann.pinned } : ann
    ));
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Users</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <Users className="h-12 w-12 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Active Events</p>
              <p className="text-3xl font-bold">{stats.activeEvents}</p>
            </div>
            <Calendar className="h-12 w-12 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Pending Approvals</p>
              <p className="text-3xl font-bold">{stats.pendingApprovals}</p>
            </div>
            <Bell className="h-12 w-12 text-orange-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Projects</p>
              <p className="text-3xl font-bold">{stats.totalProjects}</p>
            </div>
            <Code className="h-12 w-12 text-purple-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-xl border border-slate-600/50 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">Recent Activities</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-blue-900/40 rounded-lg">
              <UserCheck className="h-5 w-5 text-cyan-400" />
              <span className="text-sm text-gray-200">New member John Doe joined the club</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-900/40 rounded-lg">
              <Calendar className="h-5 w-5 text-green-400" />
              <span className="text-sm text-gray-200">React Workshop scheduled for July 15</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-900/40 rounded-lg">
              <Code className="h-5 w-5 text-purple-400" />
              <span className="text-sm text-gray-200">New project "Chat App" submitted for review</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => openModal('event')}
              className="w-full flex items-center space-x-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Create New Event</span>
            </button>
            <button 
              onClick={() => openModal('announcement')}
              className="w-full flex items-center space-x-3 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Post Announcement</span>
            </button>
            <button 
              onClick={() => openModal('analytics')}
              className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-pink-500/40 transition-all duration-300">
              <BarChart3 className="h-5 w-5" />
              <span>View Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button 
            onClick={() => openModal('user')}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'Admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'Mentor' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' :
                      user.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.joinDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {user.status === 'Pending' && (
                      <>
                        <button 
                          onClick={() => handleUserAction(user.id, 'approve')}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleUserAction(user.id, 'reject')}
                          className="text-red-600 hover:text-red-900"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button className="text-blue-600 hover:text-blue-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Event Management</h2>
        <button 
          onClick={() => openModal('event')}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Events</h3>
            <p className="text-gray-400">Create your first event to get started!</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {event.type}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p><span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}</p>
                <p><span className="font-medium">Time:</span> {event.time}</p>
                <p><span className="font-medium">Location:</span> {event.location}</p>
                <p><span className="font-medium">Duration:</span> {event.duration}</p>
                {event.participantsLimit && (
                  <p><span className="font-medium">Limit:</span> {event.participantsLimit}</p>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors">
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-1 bg-green-50 text-green-600 py-2 px-3 rounded-lg hover:bg-green-100 transition-colors">
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button 
                  onClick={() => handleDeleteEvent(event._id)}
                  className="flex items-center justify-center bg-red-50 text-red-600 py-2 px-3 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderAnnouncements = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Announcements</h2>
        <button 
          onClick={() => openModal('announcement')}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Announcement</span>
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className={`bg-white rounded-xl shadow-lg p-6 ${announcement.pinned ? 'border-l-4 border-yellow-400' : ''}`}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                {announcement.pinned && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pinned</span>
                )}
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => togglePinAnnouncement(announcement.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    announcement.pinned 
                      ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Bell className="h-4 w-4" />
                </button>
                <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-3">{announcement.content}</p>
            <p className="text-sm text-gray-500">Posted on {announcement.date}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Management</h2>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tech Stack</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{project.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.team}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.tech}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      project.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      project.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.submitted}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {project.status === 'Pending' && (
                      <>
                        <button 
                          onClick={() => handleProjectAction(project.id, 'approve')}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleProjectAction(project.id, 'reject')}
                          className="text-red-600 hover:text-red-900"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderModal = () => {
    if (!showModal && modalType !== 'analytics') return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl shadow-2xl max-w-md w-full p-8 text-white relative">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
              {modalType === 'event' ? 'Create New Event' :
               modalType === 'announcement' ? 'New Announcement' :
               modalType === 'user' ? 'Add New User' :
               modalType === 'analytics' ? 'Analytics Overview' : 'Modal'}
            </h3>
            <button onClick={closeModal} className="text-gray-400 hover:text-cyan-400 p-2 rounded-lg transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="space-y-6">
            {modalType === 'event' && (
              <>
                <input 
                  type="text" 
                  placeholder="Event Title" 
                  value={eventFormData.title}
                  onChange={(e) => setEventFormData({...eventFormData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors" 
                />
                <input 
                  type="text" 
                  placeholder="Event Subtitle" 
                  value={eventFormData.subtitle}
                  onChange={(e) => setEventFormData({...eventFormData, subtitle: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors" 
                />
                <input 
                  type="date" 
                  value={eventFormData.date}
                  onChange={(e) => setEventFormData({...eventFormData, date: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors" 
                />
                <input 
                  type="time" 
                  value={eventFormData.time}
                  onChange={(e) => setEventFormData({...eventFormData, time: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors" 
                />
                <input 
                  type="text" 
                  placeholder="Location" 
                  value={eventFormData.location}
                  onChange={(e) => setEventFormData({...eventFormData, location: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors" 
                />
                <input 
                  type="text" 
                  placeholder="Duration (e.g., 2 hours)" 
                  value={eventFormData.duration}
                  onChange={(e) => setEventFormData({...eventFormData, duration: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors" 
                />
                <input 
                  type="text" 
                  placeholder="Participants (e.g., 50 students)" 
                  value={eventFormData.participants}
                  onChange={(e) => setEventFormData({...eventFormData, participants: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors" 
                />
                <input 
                  type="text" 
                  placeholder="Prizes" 
                  value={eventFormData.prizes}
                  onChange={(e) => setEventFormData({...eventFormData, prizes: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors" 
                />
                <select 
                  value={eventFormData.type}
                  onChange={(e) => setEventFormData({...eventFormData, type: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                >
                  <option value="">Select Event Type</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Competition">Competition</option>
                  <option value="Webinar">Webinar</option>
                </select>
                <input 
                  type="number" 
                  placeholder="Participant Limit (optional)" 
                  value={eventFormData.participantsLimit}
                  onChange={(e) => setEventFormData({...eventFormData, participantsLimit: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors" 
                />
                <textarea 
                  placeholder="Event Description" 
                  rows="3" 
                  value={eventFormData.description}
                  onChange={(e) => setEventFormData({...eventFormData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                ></textarea>
              </>
            )}
            {modalType === 'announcement' && (
              <>
                <input type="text" placeholder="Announcement Title" className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors" />
                <textarea placeholder="Announcement Content" rows="4" className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"></textarea>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-cyan-500 focus:ring-cyan-500" />
                  <span className="text-sm text-gray-300">Pin this announcement</span>
                </label>
              </>
            )}
            {modalType === 'user' && (
              <>
                <input type="text" placeholder="Full Name" className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors" />
                <input type="email" placeholder="Email Address" className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors" />
                <select className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors">
                  <option>Member</option>
                  <option>Mentor</option>
                  <option>Admin</option>
                </select>
                <select className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors">
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>
              </>
            )}
            {modalType === 'analytics' && (
              <div className="space-y-4 text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-cyan-400 mb-2" />
                <h4 className="text-xl font-bold">Analytics Overview</h4>
                <p className="text-gray-300">Coming soon! Here you will see user growth, event participation, and more insights in a beautiful dashboard.</p>
              </div>
            )}
          </div>
          <div className="flex space-x-3 mt-8">
            <button onClick={closeModal} className="flex-1 py-3 px-4 border border-slate-600/50 text-gray-300 rounded-xl hover:bg-slate-700/50 transition-colors font-semibold">
              Cancel
            </button>
            {modalType !== 'analytics' && (
              <button 
                onClick={modalType === 'event' ? handleCreateEvent : undefined}
                disabled={loading}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  modalType === 'event' ? 'Create Event' :
                  modalType === 'announcement' ? 'Post Announcement' :
                  modalType === 'user' ? 'Add User' : 'Save'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'announcements', label: 'Announcements', icon: MessageSquare },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'challenges', label: 'Challenges', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-x-hidden flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-xl border-r border-slate-700/50 shadow-xl rounded-tr-3xl rounded-br-3xl flex flex-col">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/25">
                <span className="text-white font-black text-lg">C</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
                codex admin
              </span>
              <p className="text-xs text-gray-400 -mt-1">SOA ITER</p>
            </div>
          </div>
        </div>
        <nav className="mt-6 flex-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-all duration-300 font-medium rounded-xl mb-2 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25 border-l-4 border-cyan-400'
                    : 'text-gray-300 hover:text-cyan-400 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-xl border-b border-slate-700/50 shadow p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
              {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {admin?.fullName?.charAt(0) || 'A'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-cyan-400 font-medium block text-sm">
                    {admin?.fullName || 'Admin'}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {admin?.regNumber || 'Admin'}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
        <div className="p-6 overflow-y-auto h-full">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'events' && renderEvents()}
          {activeTab === 'announcements' && renderAnnouncements()}
          {activeTab === 'projects' && renderProjects()}
          {activeTab === 'challenges' && (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Coding Challenges</h3>
              <p className="text-gray-400">Challenge management system coming soon!</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="text-center py-12">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Settings</h3>
              <p className="text-gray-400">System settings and configuration options coming soon!</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {renderModal()}
    </div>
  );
};

export default AdminDashboard;