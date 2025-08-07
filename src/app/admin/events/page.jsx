"use client";
import React, { useState, useEffect } from 'react';
import { eventAPI } from '@/services/api';
import { Calendar, Plus, Trash2, Edit, Eye } from 'lucide-react';
import { toast } from 'react-toastify';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
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

  // Helper functions for schedule and requirements
  const addScheduleItem = () => {
    console.log('➕ Adding schedule item:', scheduleItem);
    if (scheduleItem.time && scheduleItem.activity) {
      const newSchedule = [...eventFormData.schedule, { ...scheduleItem }];
      console.log('📅 New schedule array:', newSchedule);
      setEventFormData({
        ...eventFormData,
        schedule: newSchedule
      });
      setScheduleItem({ time: '', activity: '', day: 'Day 1' });
      console.log('✅ Schedule item added successfully');
    } else {
      console.log('❌ Cannot add schedule item - missing time or activity');
    }
  };

  const removeScheduleItem = (index) => {
    const newSchedule = eventFormData.schedule.filter((_, i) => i !== index);
    setEventFormData({ ...eventFormData, schedule: newSchedule });
  };

  const addRequirement = () => {
    console.log('➕ Adding requirement:', requirementItem);
    if (requirementItem.trim()) {
      const newRequirements = [...eventFormData.requirements, requirementItem.trim()];
      console.log('📋 New requirements array:', newRequirements);
      setEventFormData({
        ...eventFormData,
        requirements: newRequirements
      });
      setRequirementItem('');
      console.log('✅ Requirement added successfully');
    } else {
      console.log('❌ Cannot add requirement - empty or whitespace only');
    }
  };

  const removeRequirement = (index) => {
    const newRequirements = eventFormData.requirements.filter((_, i) => i !== index);
    setEventFormData({ ...eventFormData, requirements: newRequirements });
  };

  const addHighlight = () => {
    console.log('➕ Adding highlight:', highlightItem);
    if (highlightItem.trim()) {
      const newHighlights = [...eventFormData.highlights, highlightItem.trim()];
      console.log('⭐ New highlights array:', newHighlights);
      setEventFormData({
        ...eventFormData,
        highlights: newHighlights
      });
      setHighlightItem('');
      console.log('✅ Highlight added successfully');
    } else {
      console.log('❌ Cannot add highlight - empty or whitespace only');
    }
  };

  const removeHighlight = (index) => {
    const newHighlights = eventFormData.highlights.filter((_, i) => i !== index);
    setEventFormData({ ...eventFormData, highlights: newHighlights });
  };

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    console.log('🔄 Fetching events...');
    try {
      setLoading(true);
      console.log('📡 Making API call to getAllEvents...');
      const response = await eventAPI.getAllEvents();
      console.log('📥 Fetch events response:', response);
      console.log('📥 Response type:', typeof response);
      console.log('📥 Response keys:', Object.keys(response));
      
      if (response.success) {
        console.log('✅ Events fetched successfully');
        console.log('📊 Events data:', response.data);
        console.log('📊 Number of events:', response.data?.length || 0);
        setEvents(response.data);
      } else {
        console.log('❌ Fetch events failed - response.success is false');
        console.log('Response details:', response);
      }
    } catch (error) {
      console.error('❌ Error fetching events:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        response: error.response?.data
      });
      toast.error('Failed to fetch events');
    } finally {
      console.log('🏁 Setting loading to false for fetchEvents');
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
     e.preventDefault();
    console.log('=== EVENT CREATION STARTED ===');
    console.log('Initial form data:', eventFormData);

     try {
      setLoading(true);
    const response = await eventAPI.createEvent(eventFormData);

    console.log("✅ Event created successfully:", response);
     setLoading(false);
     toast.success("Event created successfully!");

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
        console.log('🔄 Refreshing events list...');
        fetchEvents(); // Refresh events list


  } catch (error) {
    console.error("❌ Error creating event:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to create event. Please try again.");
    setLoading(false);
  }
  };

  const handleDeleteEvent = async (eventId) => {
  if (window.confirm('Are you sure you want to delete this event?')) {
      console.log("eventID: " + eventId);

      try {
        const response = await eventAPI.deleteEvent(eventId);

        console.log("✅ Event deleted:", response);
        toast.success("Event deleted successfully!");
        fetchEvents();
      } catch (error) {
        console.error("❌ Error deleting event:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Failed to delete event. Please try again.");
      }
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();

    if (!editingEvent) {
      toast.error('No event selected for editing');
      return;
    }

    try {
      setLoading(true);
      const response = await eventAPI.updateEvent(editingEvent._id, eventFormData);

      console.log("✅ Event updated successfully:", response);
      toast.success("Event updated successfully!");

      // Reset form and close modal
      resetForm();
      setShowModal(false);
      setEditingEvent(null);
      fetchEvents(); // Refresh events list

    } catch (error) {
      console.error("❌ Error updating event:", error.response?.data || error.message);

      if (error.response?.status === 401) {
        toast.error('Authentication required. Please login again.');
      } else {
        toast.error(error.response?.data?.message || "Failed to update event. Please try again.");
      }
    } finally {
      setLoading(false);
    }
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

  const handleViewEvent = async (eventId) => {
    try {
      const response = await eventAPI.getEvent(eventId);
      console.log("Event details:", response);
      // You can implement a view modal here or navigate to a detail page
      toast.info("Event details logged to console");
    } catch (error) {
      console.error("Error fetching event details:", error);
      toast.error("Failed to fetch event details");
    }
  };

  return (
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

      {/* Event Creation Modal */}
      {showModal && (
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
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {h}
                        <button 
                          className="ml-2 text-red-400 hover:text-red-300 transition-colors duration-200" 
                          onClick={e => { e.preventDefault(); removeHighlight(idx); }} 
                          type="button" 
                          aria-label="Remove highlight"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
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
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {r}
                        <button 
                          className="ml-2 text-red-400 hover:text-red-300 transition-colors duration-200" 
                          onClick={e => { e.preventDefault(); removeRequirement(idx); }} 
                          type="button" 
                          aria-label="Remove requirement"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
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
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-blue-200 font-medium">{s.day}</span>
                            <span className="text-slate-400 mx-2">•</span>
                            <span className="text-cyan-200">{s.time}</span>
                            <span className="text-slate-400 mx-2">•</span>
                            <span className="text-white">{s.activity}</span>
                          </div>
                        </div>
                        <button 
                          className="text-red-400 hover:text-red-300 transition-colors duration-200 p-1" 
                          onClick={e => { e.preventDefault(); removeScheduleItem(idx); }} 
                          type="button" 
                          aria-label="Remove schedule"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
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
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {editingEvent ? 'Updating Event...' : 'Creating Event...'}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      {editingEvent ? 'Update Event' : 'Create Event'}
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List of Events */}
      <div className="mt-6 sm:mt-8 lg:mt-10">
        {loading && events.length === 0 ? (
          <div className="flex justify-center items-center h-32 sm:h-40">
            <span className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-cyan-500"></span>
            <span className="ml-3 sm:ml-4 text-cyan-300 font-semibold text-sm sm:text-base">Loading events...</span>
          </div>
        ) : events.length === 0 ? (
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
                <p className="text-slate-200 mb-2 text-sm sm:text-base">{event.location}</p>
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
                  {event.highlights?.map((h, i) => (
                    <span key={i} className="bg-cyan-900 text-cyan-200 px-2 py-1 rounded text-xs shadow">{h}</span>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                  <button
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 sm:px-3 py-1 sm:py-2 rounded shadow hover:from-indigo-600 hover:to-blue-600 flex items-center gap-1 transition text-xs sm:text-sm flex-1 sm:flex-none justify-center"
                    onClick={() => handleViewEvent(event._id)}
                    title="View event details"
                  >
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">View</span>
                  </button>
                  <button
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-2 sm:px-3 py-1 sm:py-2 rounded shadow hover:from-emerald-600 hover:to-green-600 flex items-center gap-1 transition text-xs sm:text-sm flex-1 sm:flex-none justify-center"
                    onClick={() => openEditModal(event)}
                    title="Edit event"
                  >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-2 sm:px-3 py-1 sm:py-2 rounded shadow hover:from-pink-600 hover:to-red-600 flex items-center gap-1 transition text-xs sm:text-sm flex-1 sm:flex-none justify-center"
                    onClick={() => handleDeleteEvent(event._id)}
                    title="Delete event"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;