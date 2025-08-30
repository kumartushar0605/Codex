"use client";

import React, { useState, useEffect } from 'react';
import { eventAPI } from '@/services/api';
import { registrationAPI } from '@/services/api';

import { Calendar, Plus, Trash2, Edit, Eye, Users, ArrowLeft, User, Github, Linkedin, Award, Clock, MapPin, Target } from 'lucide-react';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [currentView, setCurrentView] = useState('events'); // 'events', 'teams', 'teamDetails'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

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
    schedule: [],
    requirements: [],
    description: ''
  });

  const [scheduleItem, setScheduleItem] = useState({
    time: '',
    activity: '',
    day: 'Day 1'
  });
  const [requirementItem, setRequirementItem] = useState('');
  const [highlightItem, setHighlightItem] = useState('');

  // ✅ Fetch events from API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await eventAPI.getAllEvents();
      setEvents(res.data); // assuming backend returns { data: [...] }
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch teams for a specific event
  const fetchTeamsByEvent = async (eventId) => {
    try {
      setLoading(true);
      const res = await registrationAPI.getRegistrationsByEvent(eventId);
      setTeams(res.data);
    } catch (err) {
      console.error('Error fetching teams:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Called when viewing event details
  const handleViewEvent = async (event) => {
    setSelectedEvent(event);
    setCurrentView('teams');
    await fetchTeamsByEvent(event._id);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Helper functions for form management
  const addScheduleItem = () => {
    if (scheduleItem.time && scheduleItem.activity) {
      const newSchedule = [...eventFormData.schedule, { ...scheduleItem }];
      setEventFormData({
        ...eventFormData,
        schedule: newSchedule
      });
      setScheduleItem({ time: '', activity: '', day: 'Day 1' });
    }
  };

  const removeScheduleItem = (index) => {
    const newSchedule = eventFormData.schedule.filter((_, i) => i !== index);
    setEventFormData({ ...eventFormData, schedule: newSchedule });
  };

  const addRequirement = () => {
    if (requirementItem.trim()) {
      const newRequirements = [...eventFormData.requirements, requirementItem.trim()];
      setEventFormData({
        ...eventFormData,
        requirements: newRequirements
      });
      setRequirementItem('');
    }
  };

  const removeRequirement = (index) => {
    const newRequirements = eventFormData.requirements.filter((_, i) => i !== index);
    setEventFormData({ ...eventFormData, requirements: newRequirements });
  };

  const addHighlight = () => {
    if (highlightItem.trim()) {
      const newHighlights = [...eventFormData.highlights, highlightItem.trim()];
      setEventFormData({
        ...eventFormData,
        highlights: newHighlights
      });
      setHighlightItem('');
    }
  };

  const removeHighlight = (index) => {
    const newHighlights = eventFormData.highlights.filter((_, i) => i !== index);
    setEventFormData({ ...eventFormData, highlights: newHighlights });
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    // Mock create event
    console.log('Creating event:', eventFormData);
    setShowModal(false);
    // In real implementation, call your API here
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      console.log('Deleting event:', eventId);
      // In real implementation, call your API here
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    console.log('Updating event:', eventFormData);
    setShowModal(false);
    // In real implementation, call your API here
  };

  const openCreateModal = () => {
    resetForm();
    setEditingEvent(null);
    setShowModal(true);
  };

  const openEditModal = (event) => {
    setEventFormData({
      title: event.title,
      subtitle: event.subtitle,
      date: new Date(event.date).toISOString().split('T')[0],
      time: event.time,
      participantsLimit: event.participantsLimit || '',
      location: event.location,
      duration: event.duration,
      participants: event.participants,
      prizes: event.prizes,
      type: event.type,
      color: event.color,
      bgColor: event.bgColor,
      highlights: event.highlights || [],
      schedule: event.schedule || [],
      requirements: event.requirements || [],
      description: event.description
    });
    setEditingEvent(event);
    setShowModal(true);
  };

  const resetForm = () => {
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
      schedule: [],
      requirements: [],
      description: ''
    });
  };

//   const handleViewEvent = (event) => {
//     setSelectedEvent(event);
//     setTeams(mockTeams[event._id] || []);
//     setCurrentView('teams');
//   };

  const handleViewTeam = (team) => {
    setSelectedTeam(team);
    setCurrentView('teamDetails');
  };

  const goBack = () => {
    if (currentView === 'teamDetails') {
      setCurrentView('teams');
      setSelectedTeam(null);
    } else if (currentView === 'teams') {
      setCurrentView('events');
      setSelectedEvent(null);
      setTeams([]);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'registered': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'disqualified': return 'bg-red-600/20 text-red-400 border-red-600/30';
      case 'eliminated': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  // Events View
  const renderEventsView = () => (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-200 tracking-tight drop-shadow">Manage Events</h1>
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-600 hover:to-cyan-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 text-sm sm:text-base w-full sm:w-auto justify-center"
          onClick={openCreateModal}
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Create Event
        </button>
      </div>

      {events.length === 0 ? (
        <div className="text-center text-slate-400 py-12 sm:py-16 lg:py-20">
          <Calendar className="mx-auto mb-3 sm:mb-4 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-cyan-700/40" />
          <p className="text-base sm:text-lg">No events found. Start by creating a new event!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {events.map(event => (
            <div
              key={event._id}
              className="bg-slate-900/80 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col border-t-4 border-cyan-700 hover:scale-[1.025] hover:shadow-2xl transition-transform duration-200 group relative overflow-hidden"
              style={{ borderColor: event.color || '#3B82F6' }}
            >
              <div className="flex items-start justify-between mb-2 gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-cyan-200 group-hover:text-cyan-400 transition-colors duration-200 flex-1">{event.title}</h3>
                <span
                  className="rounded px-2 py-1 text-xs font-semibold bg-cyan-800 text-cyan-100 shadow flex-shrink-0"
                  style={{ background: event.bgColor || '#1E40AF', color: '#fff' }}
                >
                  {event.type}
                </span>
              </div>
              <p className="text-slate-300 mb-1 text-sm sm:text-base">{event.subtitle}</p>
              <p className="text-slate-400 text-xs sm:text-sm mb-2">{event.date ? new Date(event.date).toLocaleString() : ''}</p>
              <p className="text-slate-200 mb-2 text-sm sm:text-base flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {event.location}
              </p>
              <div className="flex items-center gap-2 mb-3 text-sm text-slate-400">
                <Clock className="w-4 h-4" />
                <span>{event.duration}</span>
                <Users className="w-4 h-4 ml-2" />
                <span>{mockTeams[event._id]?.length || 0} teams</span>
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
                {event.highlights?.slice(0, 2).map((h, i) => (
                  <span key={i} className="bg-cyan-900 text-cyan-200 px-2 py-1 rounded text-xs shadow">{h}</span>
                ))}
                {event.highlights?.length > 2 && (
                  <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">+{event.highlights.length - 2} more</span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                <button
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 sm:px-3 py-1 sm:py-2 rounded shadow hover:from-indigo-600 hover:to-blue-600 flex items-center gap-1 transition text-xs sm:text-sm flex-1 sm:flex-none justify-center"
                  onClick={() => handleViewEvent(event)}
                  title="View teams"
                >
                  <Users className="w-3 h-3 sm:w-4 sm:h-4" /> Teams
                </button>
                <button
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-2 sm:px-3 py-1 sm:py-2 rounded shadow hover:from-emerald-600 hover:to-green-600 flex items-center gap-1 transition text-xs sm:text-sm flex-1 sm:flex-none justify-center"
                  onClick={() => openEditModal(event)}
                  title="Edit event"
                >
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4" /> Edit
                </button>
                <button
                  className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-2 sm:px-3 py-1 sm:py-2 rounded shadow hover:from-pink-600 hover:to-red-600 flex items-center gap-1 transition text-xs sm:text-sm flex-1 sm:flex-none justify-center"
                  onClick={() => handleDeleteEvent(event._id)}
                  title="Delete event"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Teams View
  const renderTeamsView = () => (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="flex items-center gap-4 mb-6 sm:mb-8">
        <button
          onClick={goBack}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl font-medium transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-200 tracking-tight drop-shadow">
            Teams for {selectedEvent?.title}
          </h1>
          <p className="text-slate-400 text-sm">{teams.length} registered teams</p>
        </div>
      </div>

      {teams.length === 0 ? (
        <div className="text-center text-slate-400 py-12 sm:py-16 lg:py-20">
          <Users className="mx-auto mb-3 sm:mb-4 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-cyan-700/40" />
          <p className="text-base sm:text-lg">No teams registered for this event yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {teams.map(team => (
            <div
              key={team._id}
              className="bg-slate-900/80 rounded-xl shadow-xl p-6 border border-slate-700 hover:border-cyan-500/50 hover:shadow-2xl transition-all duration-200 cursor-pointer group"
              onClick={() => handleViewTeam(team)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-cyan-200 group-hover:text-cyan-400 transition-colors duration-200">
                    {team.teamName}
                  </h3>
                  <p className="text-slate-400 text-sm">Team Leader: {team.userId.name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(team.status)}`}>
                  {team.status}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>Team Size: {team.teamSize}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <User className="w-4 h-4 text-green-400" />
                  <span>{team.branch} - Year {team.year}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span>{team.experience} experience</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {team.skills.slice(0, 3).map((skill, i) => (
                    <span key={i} className="bg-blue-900/50 text-blue-200 px-2 py-1 rounded text-xs border border-blue-700/30">
                      {skill}
                    </span>
                  ))}
                  {team.skills.length > 3 && (
                    <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">
                      +{team.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                {team.description}
              </p>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Registered: {new Date(team.registrationDate).toLocaleDateString()}</span>
                <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  Click to view details →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Team Details View
  const renderTeamDetailsView = () => (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="flex items-center gap-4 mb-6 sm:mb-8">
        <button
          onClick={goBack}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl font-medium transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Teams
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-200 tracking-tight drop-shadow">
            {selectedTeam?.teamName}
          </h1>
          <p className="text-slate-400 text-sm">Team Details</p>
        </div>
      </div>

      {selectedTeam && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900/80 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 p-6 border-b border-slate-700/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedTeam.teamName}</h2>
                  <div className="flex items-center gap-4 text-slate-300">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {selectedTeam.teamSize} members
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Registered {new Date(selectedTeam.registrationDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full font-medium border text-center ${getStatusColor(selectedTeam.status)}`}>
                  {selectedTeam.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Content Grid */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Team Leader Info */}
              <div className="space-y-6">
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-600/30">
                  <h3 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Team Leader
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-slate-400">Name</label>
                      <p className="text-white font-medium">{selectedTeam.userId.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-400">Email</label>
                      <p className="text-white">{selectedTeam.userId.email}</p>
                    </div>
                    <div className="flex gap-3">
                      {selectedTeam.githubLink && (
                        <a
                          href={selectedTeam.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors text-sm"
                        >
                          <Github className="w-4 h-4" />
                          GitHub
                        </a>
                      )}
                      {selectedTeam.linkedInLink && (
                        <a
                          href={selectedTeam.linkedInLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 bg-blue-800 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors text-sm"
                        >
                          <Linkedin className="w-4 h-4" />
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Academic Info */}
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-600/30">
                  <h3 className="text-lg font-semibold text-green-300 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Academic Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-400">Branch</label>
                      <p className="text-white font-medium">{selectedTeam.branch}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-400">Year</label>
                      <p className="text-white font-medium">Year {selectedTeam.year}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-slate-400">Experience</label>
                      <p className="text-white font-medium">{selectedTeam.experience}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills & Details */}
              <div className="space-y-6">
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-600/30">
                  <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTeam.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-200 px-3 py-2 rounded-lg text-sm border border-purple-500/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-600/30">
                  <h3 className="text-lg font-semibold text-yellow-300 mb-4">Personal Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-slate-400">T-Shirt Size</label>
                      <p className="text-white">{selectedTeam.tshirtSize}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-400">Dietary Preference</label>
                      <p className="text-white">{selectedTeam.deitary}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description & Expectations */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-600/30">
                  <h3 className="text-lg font-semibold text-blue-300 mb-4">Team Description</h3>
                  <p className="text-slate-300 leading-relaxed">{selectedTeam.expectations}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Event Form Modal (same as before but keeping it for completeness)
  const renderEventModal = () => (
    showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all p-4">
        <div className="bg-gradient-to-br from-slate-900 to-black text-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl p-4 sm:p-6 lg:p-8 relative animate-fadeIn max-h-[95vh] overflow-y-auto border border-slate-700/50">
          {/* Header */}
          <div className="flex items-start justify-between mb-6 sm:mb-8 pb-4 border-b border-slate-700/50">
            <div className="flex-1 pr-4">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                {editingEvent ? 'Update the event details below' : 'Fill in the details below to create a new event'}
              </p>
            </div>
            <button
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-800 hover:bg-red-600 text-gray-400 hover:text-white transition-all duration-200 flex items-center justify-center flex-shrink-0"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form
            onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
            className="space-y-6 sm:space-y-8"
          >
            {/* Basic Information Section */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-cyan-300">Basic Information</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Event Title *</label>
                  <input 
                    type="text" 
                    placeholder="Enter event title" 
                    className="w-full px-4 py-3 bg-slate-800/50 text-white border border-slate-600 focus:ring-2 focus:ring-cyan-400 focus:border-transparent rounded-xl transition-all duration-200 placeholder-slate-400" 
                    value={eventFormData.title} 
                    onChange={e => setEventFormData({ ...eventFormData, title: e.target.value })} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Subtitle *</label>
                  <input 
                    type="text" 
                    placeholder="Enter event subtitle" 
                    className="w-full px-4 py-3 bg-slate-800/50 text-white border border-slate-600 focus:ring-2 focus:ring-cyan-400 focus:border-transparent rounded-xl transition-all duration-200 placeholder-slate-400" 
                    value={eventFormData.subtitle} 
                    onChange={e => setEventFormData({ ...eventFormData, subtitle: e.target.value })} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Date *</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 bg-slate-800/50 text-white border border-slate-600 focus:ring-2 focus:ring-cyan-400 focus:border-transparent rounded-xl transition-all duration-200" 
                    value={eventFormData.date} 
                    onChange={e => setEventFormData({ ...eventFormData, date: e.target.value })} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Time *</label>
                  <input 
                    type="time" 
                    className="w-full px-4 py-3 bg-slate-800/50 text-white border border-slate-600 focus:ring-2 focus:ring-cyan-400 focus:border-transparent rounded-xl transition-all duration-200" 
                    value={eventFormData.time} 
                    onChange={e => setEventFormData({ ...eventFormData, time: e.target.value })} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Location *</label>
                  <input 
                    type="text" 
                    placeholder="Enter event location" 
                    className="w-full px-4 py-3 bg-slate-800/50 text-white border border-slate-600 focus:ring-2 focus:ring-cyan-400 focus:border-transparent rounded-xl transition-all duration-200 placeholder-slate-400" 
                    value={eventFormData.location} 
                    onChange={e => setEventFormData({ ...eventFormData, location: e.target.value })} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Duration *</label>
                  <input 
                    type="text" 
                    placeholder="e.g., 2 hours, 1 day" 
                    className="w-full px-4 py-3 bg-slate-800/50 text-white border border-slate-600 focus:ring-2 focus:ring-cyan-400 focus:border-transparent rounded-xl transition-all duration-200 placeholder-slate-400" 
                    value={eventFormData.duration} 
                    onChange={e => setEventFormData({ ...eventFormData, duration: e.target.value })} 
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Event Details Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-purple-300">Event Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Participants Limit</label>
                  <input 
                    type="number" 
                    placeholder="Enter limit (optional)" 
                    className="w-full px-4 py-3 bg-slate-800/50 text-white border border-slate-600 focus:ring-2 focus:ring-cyan-400 focus:border-transparent rounded-xl transition-all duration-200 placeholder-slate-400" 
                    value={eventFormData.participantsLimit} 
                    onChange={e => setEventFormData({ ...eventFormData, participantsLimit: e.target.value })} 
                    min={1} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Target Participants *</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Students, Developers" 
                    className="w-full px-4 py-3 bg-slate-800/50 text-white border border-slate-600 focus:ring-2 focus:ring-cyan-400 focus:border-transparent rounded-xl transition-all duration-200 placeholder-slate-400" 
                    value={eventFormData.participants} 
                    onChange={e => setEventFormData({ ...eventFormData, participants: e.target.value })} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Prizes *</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Cash prizes, Certificates" 
                    className="w-full px-4 py-3 bg-slate-800/50 text-white border border-slate-600 focus:ring-2 focus:ring-cyan-400 focus:border-transparent rounded-xl transition-all duration-200 placeholder-slate-400" 
                    value={eventFormData.prizes} 
                    onChange={e => setEventFormData({ ...eventFormData, prizes: e.target.value })} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Event Type *</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Hackathon, Workshop" 
                    className="w-full px-4 py-3 bg-slate-800/50 text-white border border-slate-600 focus:ring-2 focus:ring-cyan-400 focus:border-transparent rounded-xl transition-all duration-200 placeholder-slate-400" 
                    value={eventFormData.type} 
                    onChange={e => setEventFormData({ ...eventFormData, type: e.target.value })} 
                    required 
                  />
                </div>
              </div>

              {/* Color Customization */}
              <div className="flex items-center gap-8 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-slate-300">Event Color:</label>
                  <input 
                    type="color" 
                    className="w-12 h-12 border-0 bg-transparent rounded-lg cursor-pointer" 
                    value={eventFormData.color} 
                    onChange={e => setEventFormData({ ...eventFormData, color: e.target.value })} 
                    title="Event Color" 
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-slate-300">Background Color:</label>
                  <input 
                    type="color" 
                    className="w-12 h-12 border-0 bg-transparent rounded-lg cursor-pointer" 
                    value={eventFormData.bgColor} 
                    onChange={e => setEventFormData({ ...eventFormData, bgColor: e.target.value })} 
                    title="Background Color" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Description *</label>
                <textarea 
                  placeholder="Provide a detailed description of the event..." 
                  className="w-full px-4 py-3 bg-slate-800/50 text-white border border-slate-600 focus:ring-2 focus:ring-cyan-400 focus:border-transparent rounded-xl transition-all duration-200 placeholder-slate-400 resize-none" 
                  rows={4}
                  value={eventFormData.description} 
                  onChange={e => setEventFormData({ ...eventFormData, description: e.target.value })} 
                  required 
                />
              </div>
            </div>

            {/* Dynamic Content Sections */}
            <div className="space-y-8">
              {/* Highlights Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-yellow-300">Highlights</h3>
                </div>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    className="flex-1 px-4 py-3 bg-slate-800/50 text-white border border-slate-600 focus:ring-2 focus:ring-cyan-400 focus:border-transparent rounded-xl transition-all duration-200 placeholder-slate-400" 
                    placeholder="Add a highlight feature..." 
                    value={highlightItem} 
                    onChange={e => setHighlightItem(e.target.value)} 
                  />
                  <button 
                    className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-orange-500 hover:to-yellow-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl" 
                    onClick={e => { e.preventDefault(); addHighlight(); }} 
                    type="button"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {eventFormData.highlights.map((h, idx) => (
                    <span key={idx} className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 text-yellow-200 px-4 py-2 rounded-xl flex items-center gap-2 text-sm border border-yellow-500/30 shadow-lg">
                      {h}
                      <button 
                        className="ml-2 text-red-400 hover:text-red-300 transition-colors duration-200" 
                        onClick={e => { e.preventDefault(); removeHighlight(idx); }} 
                        type="button" 
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Requirements Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-300">Requirements</h3>
                </div>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    className="flex-1 px-4 py-3 bg-slate-800/50 text-white border border-slate-600 focus:ring-2 focus:ring-cyan-400 focus:border-transparent rounded-xl transition-all duration-200 placeholder-slate-400" 
                    placeholder="Add a requirement..." 
                    value={requirementItem} 
                    onChange={e => setRequirementItem(e.target.value)} 
                  />
                  <button 
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-emerald-500 hover:to-green-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl" 
                    onClick={e => { e.preventDefault(); addRequirement(); }} 
                    type="button"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {eventFormData.requirements.map((r, idx) => (
                    <span key={idx} className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 text-green-200 px-4 py-2 rounded-xl flex items-center gap-2 text-sm border border-green-500/30 shadow-lg">
                      {r}
                      <button 
                        className="ml-2 text-red-400 hover:text-red-300 transition-colors duration-200" 
                        onClick={e => { e.preventDefault(); removeRequirement(idx); }} 
                        type="button" 
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Schedule Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-300">Schedule</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input 
                    type="text" 
                    className="px-4 py-3 bg-slate-800/50 text-white border border-slate-600 focus:ring-2 focus:ring-cyan-400 focus:border-transparent rounded-xl transition-all duration-200 placeholder-slate-400" 
                    placeholder="Time (e.g., 9:00 AM)" 
                    value={scheduleItem.time} 
                    onChange={e => setScheduleItem({ ...scheduleItem, time: e.target.value })} 
                  />
                  <input 
                    type="text" 
                    className="px-4 py-3 bg-slate-800/50 text-white border border-slate-600 focus:ring-2 focus:ring-cyan-400 focus:border-transparent rounded-xl transition-all duration-200 placeholder-slate-400" 
                    placeholder="Activity" 
                    value={scheduleItem.activity} 
                    onChange={e => setScheduleItem({ ...scheduleItem, activity: e.target.value })} 
                  />
                  <input 
                    type="text" 
                    className="px-4 py-3 bg-slate-800/50 text-white border border-slate-600 focus:ring-2 focus:ring-cyan-400 focus:border-transparent rounded-xl transition-all duration-200 placeholder-slate-400" 
                    placeholder="Day (e.g., Day 1)" 
                    value={scheduleItem.day} 
                    onChange={e => setScheduleItem({ ...scheduleItem, day: e.target.value })} 
                  />
                </div>
                <div className="flex justify-end">
                  <button 
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl" 
                    onClick={e => { e.preventDefault(); addScheduleItem(); }} 
                    type="button"
                  >
                    Add to Schedule
                  </button>
                </div>
                <div className="space-y-3">
                  {eventFormData.schedule.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 px-4 py-3 rounded-xl border border-blue-500/30 shadow-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-blue-200 font-medium">{s.day}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-cyan-200">{s.time}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-white">{s.activity}</span>
                      </div>
                      <button 
                        className="text-red-400 hover:text-red-300 transition-colors duration-200 p-1" 
                        onClick={e => { e.preventDefault(); removeScheduleItem(idx); }} 
                        type="button" 
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-slate-700/50">
              <button
                className="w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-purple-600 hover:via-blue-500 hover:to-cyan-500 text-white font-bold text-lg rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    {editingEvent ? 'Updating Event...' : 'Creating Event...'}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <Plus className="w-6 h-6" />
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );

  // Main render logic
  return (
    <>
      {currentView === 'events' && renderEventsView()}
      {currentView === 'teams' && renderTeamsView()}
      {currentView === 'teamDetails' && renderTeamDetailsView()}
      {renderEventModal()}
    </>
  );
};

export default EventsPage; 