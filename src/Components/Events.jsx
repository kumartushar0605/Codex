'use client';

import React, { useState, useEffect } from 'react';
import { eventAPI, registrationAPI } from '@/services/api';
import { useUser } from '@/context/UserContext';
import Navbar from '@/Components/Homepage/Navbar';
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  CheckCircle,
  X,
  ArrowLeft,
  Star,
  Code,
  Zap,
  Target,
  Trophy,
  User,
  Mail,
  Phone,
  GraduationCap,
  Github,
  Linkedin,
  ExternalLink,
  Download,
  Share2,
  Loader2
} from 'lucide-react';

const EventRegistrationPage = () => {
  const { user, isAuthenticated } = useUser();
  const [events, setEvents] = useState({});
  const [eventKeys, setEventKeys] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    regNumber: '',
    branch: '',
    year: '',
    experience: '',
    github: '',
    linkedin: '',
    teamName: '',
    teamSize: '1',
    skills: [],
    dietary: '',
    tshirtSize: '',
    expectations: '',
    description: '',
    agreeTerms: false
  });

useEffect(() => {
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getAllEvents();

      const eventsArray = response.data; // <-- fix here

      const transformedEvents = {};
      const keys = [];

      eventsArray.forEach((event, index) => {
        const key = event.title.toLowerCase().replace(/\s+/g, '');
        keys.push(key);
        transformedEvents[key] = {
          ...event,
          color: getEventColor(event.type),
          bgColor: getEventBgColor(event.type),
          highlights: event.highlights || [],
          schedule: event.schedule || [],
          requirements: event.requirements || []
        };
      });

      setEvents(transformedEvents);
      setEventKeys(keys);
      if (keys.length > 0) {
        setSelectedEvent(keys[0]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchEvents();
}, []);

// Populate form with user data when user is available
useEffect(() => {
  if (user && isAuthenticated) {
    setFormData(prev => ({
      ...prev,
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phoneNumber || '',
      regNumber: user.regNumber || '',
      branch: user.branch || '',
      year: user.year || ''
    }));
  }
}, [user, isAuthenticated]);


  // Helper functions for colors based on event type
  const getEventColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'hackathon':
        return 'from-pink-500 to-rose-500';
      case 'workshop':
        return 'from-blue-500 to-indigo-500';
      case 'contest':
        return 'from-green-500 to-teal-500';
      default:
        return 'from-purple-500 to-indigo-500';
    }
  };

  const getEventBgColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'hackathon':
        return 'from-pink-500/20 to-rose-500/20';
      case 'workshop':
        return 'from-blue-500/20 to-indigo-500/20';
      case 'contest':
        return 'from-green-500/20 to-teal-500/20';
      default:
        return 'from-purple-500/20 to-indigo-500/20';
    }
  };

  const currentEvent = events[selectedEvent];

  const skillOptions = [
    'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 
    'Machine Learning', 'Data Science', 'UI/UX Design', 'Mobile Development',
    'DevOps', 'Blockchain', 'Cybersecurity', 'Cloud Computing'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const eventId = currentEvent?._id;
      
      if (!eventId) {
        throw new Error('Event ID not found');
      }

      // Map frontend field names to backend schema
      const registrationData = {
        description: formData.description || '',
        githubLink: formData.github || '',
        linkedInLink: formData.linkedin || '',
        teamName: formData.teamName || '',
        teamSize: parseInt(formData.teamSize) || 1,
        skills: formData.skills || [],
        expectations: formData.expectations || '',
        agreeTerms: formData.agreeTerms || false,
        deitary: formData.dietary || '', // Note: backend has typo 'deitary' instead of 'dietary'
        tshirtSize: formData.tshirtSize || '',
        branch: formData.branch || '',
        year: parseInt(formData.year) || 1,
        experience: formData.experience || ''
      };

      const result = await registrationAPI.registerForEvent(eventId, registrationData);
      alert('Registration submitted successfully!');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        regNumber: '',
        branch: '',
        year: '',
        experience: '',
        github: '',
        linkedin: '',
        teamName: '',
        teamSize: '1',
        skills: [],
        dietary: '',
        tshirtSize: '',
        expectations: '',
        description: '',
        agreeTerms: false
      });
    } catch (err) {
      console.error('Registration error:', err);
      alert('Failed to submit registration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-cyan-400" />
          <p className="text-gray-300">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold mb-2">Error Loading Events</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!currentEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300">No events available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Event Selection */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
            Event Registration
          </h1>
          
          <div className="flex flex-wrap gap-4">
            {eventKeys.map((key) => {
              const event = events[key];
              return (
                <button
                  key={key}
                  onClick={() => setSelectedEvent(key)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    selectedEvent === key
                      ? `bg-gradient-to-r ${event.color} text-white shadow-lg`
                      : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-slate-700/50'
                  }`}
                >
                  {event.title}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Main Event Card */}
            <div className={`bg-gradient-to-r ${currentEvent.bgColor} backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6`}>
              <div className={`inline-block px-3 py-1 bg-gradient-to-r ${currentEvent.color} rounded-full text-xs font-semibold text-white mb-4`}>
                {currentEvent.type}
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">{currentEvent.title}</h2>
              <p className="text-gray-300 mb-4">{currentEvent.subtitle}</p>
              <p className="text-gray-400 leading-relaxed">{currentEvent.description}</p>
            </div>

            {/* Event Info */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Event Details</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Calendar size={16} className="mr-3 text-cyan-400" />
                  <span className="text-gray-300">{currentEvent.date}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock size={16} className="mr-3 text-cyan-400" />
                  <span className="text-gray-300">{currentEvent.time}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin size={16} className="mr-3 text-cyan-400" />
                  <span className="text-gray-300">{currentEvent.location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users size={16} className="mr-3 text-cyan-400" />
                  <span className="text-gray-300">{currentEvent.participants}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Trophy size={16} className="mr-3 text-cyan-400" />
                  <span className="text-gray-300">{currentEvent.prizes}</span>
                </div>
              </div>
            </div>

            {/* Highlights */}
            {currentEvent.highlights && currentEvent.highlights.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Event Highlights</h3>
                <ul className="space-y-2">
                  {currentEvent.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle size={16} className="mr-3 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Schedule */}
            {currentEvent.schedule && currentEvent.schedule.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Schedule</h3>
                <div className="space-y-3">
                  {currentEvent.schedule.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-20 text-xs text-cyan-400 font-medium mr-3 mt-1">
                        {item.time}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-300">{item.activity}</p>
                        {item.day && (
                          <span className="text-xs text-gray-500">{item.day}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {currentEvent.requirements && currentEvent.requirements.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Requirements</h3>
                <ul className="space-y-2">
                  {currentEvent.requirements.map((req, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Star size={16} className="mr-3 text-yellow-400 flex-shrink-0" />
                      <span className="text-gray-300">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Registration Form</h3>
              
              {!isAuthenticated ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Login Required</h4>
                  <p className="text-gray-300 mb-6">You need to be logged in to register for events.</p>
                  <a 
                    href="/auth" 
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300"
                  >
                    Login / Sign Up
                  </a>
                </div>
              ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <User size={20} className="mr-2 text-cyan-400" />
                    Personal Information
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Registration Number *</label>
                      <input
                        type="text"
                        name="regNumber"
                        value={formData.regNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        placeholder="Enter your reg number"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <GraduationCap size={20} className="mr-2 text-cyan-400" />
                    Academic Information
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Branch *</label>
                      <select
                        name="branch"
                        value={formData.branch}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                        required
                      >
                        <option value="">Select Branch</option>
                        <option value="cse">Computer Science & Engineering</option>
                        <option value="it">Information Technology</option>
                        <option value="ece">Electronics & Communication</option>
                        <option value="eee">Electrical & Electronics</option>
                        <option value="me">Mechanical Engineering</option>
                        <option value="ce">Civil Engineering</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Year *</label>
                      <select
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                        required
                      >
                        <option value="">Select Year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                        <option value="pg">PG</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Experience Level</label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                      >
                        <option value="">Select Level</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <ExternalLink size={20} className="mr-2 text-cyan-400" />
                    Social Links (Optional)
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <Github size={16} className="mr-2" />
                        GitHub Profile
                      </label>
                      <input
                        type="url"
                        name="github"
                        value={formData.github}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <Linkedin size={16} className="mr-2" />
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>
                </div>

                {/* Team Information (for Hackathon) */}
                {currentEvent.type?.toLowerCase() === 'hackathon' && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Users size={20} className="mr-2 text-cyan-400" />
                      Team Information
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Team Name</label>
                        <input
                          type="text"
                          name="teamName"
                          value={formData.teamName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                          placeholder="Enter team name (optional)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Team Size</label>
                        <select
                          name="teamSize"
                          value={formData.teamSize}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                        >
                          <option value="1">Individual (1)</option>
                          <option value="2">Team of 2</option>
                          <option value="3">Team of 3</option>
                          <option value="4">Team of 4</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Skills */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Code size={20} className="mr-2 text-cyan-400" />
                    Skills & Technologies
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {skillOptions.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSkillToggle(skill)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          formData.skills.includes(skill)
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                            : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50 border border-slate-600/50'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Target size={20} className="mr-2 text-cyan-400" />
                    Additional Information
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">T-Shirt Size</label>
                      <select
                        name="tshirtSize"
                        value={formData.tshirtSize}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                      >
                        <option value="">Select Size</option>
                        <option value="xs">XS</option>
                        <option value="s">S</option>
                        <option value="m">M</option>
                        <option value="l">L</option>
                        <option value="xl">XL</option>
                        <option value="xxl">XXL</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Dietary Preferences</label>
                      <input
                        type="text"
                        name="dietary"
                        value={formData.dietary}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        placeholder="e.g., Vegetarian, Vegan, No nuts"
                      />
                    </div>
                      
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description (Optional)</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                      placeholder="Tell us about yourself and why you want to participate..."
                    />
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">What do you expect from this event?</label>
                    <textarea
                      name="expectations"
                      value={formData.expectations}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                      placeholder="Tell us about your expectations and goals..."
                    />
                  </div>
                </div>

                {/* Terms and Submit */}
                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500"
                      required
                    />
                    <label className="text-sm text-gray-300">
                      I agree to the{' '}
                      <a href="#" className="text-cyan-400 hover:text-cyan-300 underline">
                        terms and conditions
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-cyan-400 hover:text-cyan-300 underline">
                        privacy policy
                      </a>{' '}
                      of Codex Club.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !formData.agreeTerms}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
                      submitting || !formData.agreeTerms
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Submitting Registration...
                      </div>
                    ) : (
                      `Register for ${currentEvent.title}`
                    )}
                  </button>
                </div>
              </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default EventRegistrationPage;