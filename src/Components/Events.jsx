'use client';

import React, { useState } from 'react';
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
  Share2
} from 'lucide-react';

const EventRegistrationPage = () => {
  const [selectedEvent, setSelectedEvent] = useState('hackathon');
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
    agreeTerms: false
  });

  const events = {
    hackathon: {
      title: 'HackSOA 2025',
      subtitle: '48-Hour Innovation Challenge',
      date: 'July 15-16, 2025',
      time: '9:00 AM - 6:00 PM',
      location: 'ITER Campus, Bhubaneswar',
      duration: '48 Hours',
      participants: '200+ Expected',
      prizes: '₹50,000+ Prize Pool',
      type: 'Hackathon',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'from-pink-500/20 to-rose-500/20',
      description: 'Join the most anticipated hackathon of the year! Build innovative solutions, collaborate with brilliant minds, and compete for amazing prizes.',
      highlights: [
        'Industry mentors and judges',
        'Free meals and accommodation',
        'Networking opportunities',
        'Certificate for all participants',
        'Exciting prizes and goodies'
      ],
      schedule: [
        { time: '9:00 AM', activity: 'Registration & Welcome', day: 'Day 1' },
        { time: '10:00 AM', activity: 'Opening Ceremony', day: 'Day 1' },
        { time: '11:00 AM', activity: 'Hacking Begins!', day: 'Day 1' },
        { time: '1:00 PM', activity: 'Lunch Break', day: 'Day 1' },
        { time: '6:00 PM', activity: 'Dinner & Networking', day: 'Day 1' },
        { time: '9:00 AM', activity: 'Breakfast', day: 'Day 2' },
        { time: '2:00 PM', activity: 'Submission Deadline', day: 'Day 2' },
        { time: '3:00 PM', activity: 'Presentations', day: 'Day 2' },
        { time: '5:00 PM', activity: 'Results & Closing', day: 'Day 2' }
      ],
      requirements: [
        'Laptop with necessary software',
        'Valid student ID',
        'Basic programming knowledge',
        'Enthusiasm to learn and build!'
      ]
    },
    workshop: {
      title: 'Web Development Workshop',
      subtitle: 'Master Modern Web Technologies',
      date: 'June 28, 2025',
      time: '2:00 PM - 5:00 PM',
      location: 'Computer Lab 1, ITER',
      duration: '3 Hours',
      participants: '50+ Expected',
      prizes: 'Certificate of Completion',
      type: 'Workshop',
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'from-blue-500/20 to-indigo-500/20',
      description: 'Learn modern web development with React, Node.js, and build your first full-stack application.',
      highlights: [
        'Hands-on coding experience',
        'Industry best practices',
        'Project-based learning',
        'Take-home resources',
        'Q&A with experts'
      ],
      schedule: [
        { time: '2:00 PM', activity: 'Introduction to Modern Web Dev', day: 'Day 1' },
        { time: '2:30 PM', activity: 'React Fundamentals', day: 'Day 1' },
        { time: '3:30 PM', activity: 'Break', day: 'Day 1' },
        { time: '3:45 PM', activity: 'Backend with Node.js', day: 'Day 1' },
        { time: '4:30 PM', activity: 'Building Your First App', day: 'Day 1' },
        { time: '5:00 PM', activity: 'Q&A & Wrap-up', day: 'Day 1' }
      ],
      requirements: [
        'Laptop with code editor',
        'Basic HTML/CSS knowledge',
        'Node.js installed',
        'Enthusiasm to learn!'
      ]
    },
    contest: {
      title: 'Competitive Programming Contest',
      subtitle: 'Test Your Algorithmic Skills',
      date: 'June 22, 2025',
      time: '10:00 AM - 2:00 PM',
      location: 'Online Platform',
      duration: '4 Hours',
      participants: '100+ Expected',
      prizes: '₹15,000 Prize Pool',
      type: 'Contest',
      color: 'from-green-500 to-teal-500',
      bgColor: 'from-green-500/20 to-teal-500/20',
      description: 'Challenge yourself with algorithmic problems and compete with the best coders from various colleges.',
      highlights: [
        'Multiple difficulty levels',
        'Real-time leaderboard',
        'Editorial solutions',
        'Certificates for top performers',
        'Recognition on social media'
      ],
      schedule: [
        { time: '10:00 AM', activity: 'Contest Begins', day: 'Day 1' },
        { time: '10:15 AM', activity: 'Problem Statement Release', day: 'Day 1' },
        { time: '12:00 PM', activity: 'Mid-contest Update', day: 'Day 1' },
        { time: '2:00 PM', activity: 'Contest Ends', day: 'Day 1' },
        { time: '2:30 PM', activity: 'Results Announcement', day: 'Day 1' },
        { time: '3:00 PM', activity: 'Editorial Discussion', day: 'Day 1' }
      ],
      requirements: [
        'Stable internet connection',
        'Programming language knowledge',
        'Problem-solving mindset',
        'Competitive spirit!'
      ]
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Registration data:', formData);
    alert('Registration submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-sm">C</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
                  codex
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <Share2 size={20} />
              </button>
              <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <Download size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Selection */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
            Event Registration
          </h1>
          
          <div className="flex flex-wrap gap-4">
            {Object.entries(events).map(([key, event]) => (
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
            ))}
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

            {/* Schedule */}
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

            {/* Requirements */}
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
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Registration Form</h3>
              
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
                {selectedEvent === 'hackathon' && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Users size={20} className="mr-2 text-cyan-400" />
                      Team Information
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
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
                      <label className="block text-sm font-medium text-gray-300 mb-2">Dietary Restrictions</label>
                      <select
                        name="dietary"
                        value={formData.dietary}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                      >
                        <option value="">No Restrictions</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                        <option value="gluten-free">Gluten Free</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
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
                  </div>
                  </form>
                  </div>
                  </div>
                  </div>
                  </div>

                  </div>
  )
}
export default EventRegistrationPage