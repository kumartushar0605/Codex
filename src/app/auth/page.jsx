"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, User, Code, Mail, Phone, Calendar, Users, BookOpen, Github, Linkedin, Check } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useUser } from '@/context/UserContext';
import { toast } from 'react-toastify';
import Navbar from '@/Components/Homepage/Navbar';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login: adminLogin, isAuthenticated: adminAuthenticated, loading: authLoading } = useAdmin();
  const { login: userLogin, signup: userSignup, isAuthenticated: userAuthenticated, loading: userLoading } = useUser();

  // Form data for both user and admin
  const [formData, setFormData] = useState({
    // Common fields
    fullName: '',
    email: '',
    password: '',
    regNumber: '',
    
    // User-specific fields
    phone: '',
    branch: '',
    year: '',
    experience: '',
    github: '',
    linkedin: '',
    teamName: '',
    teamSize: '',
    skills: [],
    dietary: '',
    tshirtSize: '',
    expectations: '',
    aggreeTerms: false
  });

  // Separate state for skills input display
  const [skillsInput, setSkillsInput] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (adminAuthenticated && !authLoading) {
      router.push('/admin');
    } else if (userAuthenticated && !userLoading) {
      router.push('/');
    }
  }, [adminAuthenticated, authLoading, userAuthenticated, userLoading, router]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              name === 'year' || name === 'teamSize' ? parseInt(value) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isAdmin) {
        // Admin authentication
        const result = await adminLogin(formData.regNumber, formData.password);
        
        if (result.success) {
          toast.success('Admin login successful!');
          router.push('/admin');
        } else {
          toast.error(result.error || 'Admin login failed');
        }
      } else {
        // User authentication
        if (isLogin) {
          // User login
          const result = await userLogin(formData.regNumber, formData.password);
          if (result.success) {
            toast.success('Login successful!');
            router.push('/');
          } else {
            toast.error(result.error || 'Login failed');
          }
        } else {
          // User signup validation
          if (!formData.fullName || formData.fullName.length < 3) {
            toast.error('Full name must be at least 3 characters long');
            setLoading(false);
            return;
          }
          if (!formData.email || !formData.email.includes('@')) {
            toast.error('Please enter a valid email address');
            setLoading(false);
            return;
          }
          if (!formData.password || formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            setLoading(false);
            return;
          }
          if (!formData.regNumber) {
            toast.error('Registration number is required');
            setLoading(false);
            return;
          }
          if (!formData.phone || formData.phone.length < 10) {
            toast.error('Phone number is required');
            setLoading(false);
            return;
          }
          if (!formData.branch) {
            toast.error('Please select your branch');
            setLoading(false);
            return;
          }
          if (!formData.year) {
            toast.error('Please select your year');
            setLoading(false);
            return;
          }
          if (!formData.teamName) {
            toast.error('Team name is required');
            setLoading(false);
            return;
          }
          if (!formData.teamSize) {
            toast.error('Team size is required');
            setLoading(false);
            return;
          }
          if (!formData.expectations) {
            toast.error('Please share your expectations');
            setLoading(false);
            return;
          }
          if (!formData.aggreeTerms) {
            toast.error('Please agree to the terms and conditions');
            setLoading(false);
            return;
          }

          // Send all required fields to backend
          const payload = {
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            regNumber: formData.regNumber,
            phone: Number(formData.phone),
            branch: formData.branch,
            year: Number(formData.year),
            teamName: formData.teamName,
            teamSize: Number(formData.teamSize),
            expectations: formData.expectations,
            experience: formData.experience || "",
            skills: formData.skills || [],
            dietary: formData.dietary || "",
            tshirtSize: formData.tshirtSize || "",
            github: formData.github || "",
            linkedin: formData.linkedin || "",
            aggreeTerms: formData.aggreeTerms || false
          };

          const result = await userSignup(payload);
          
          if (result.success) {
            toast.success('Registration successful!');
            router.push('/');
          } else {
            toast.error(result.error || 'Registration failed');
          }
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      const errorMessage = error.response?.data?.message || 'Authentication failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      regNumber: '',
      phone: '',
      branch: '',
      year: '',
      experience: '',
      github: '',
      linkedin: '',
      teamName: '',
      teamSize: '',
      skills: [],
      dietary: '',
      tshirtSize: '',
      expectations: '',
      aggreeTerms: false
    });
    setSkillsInput('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const toggleUserType = () => {
    setIsAdmin(!isAdmin);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      <div className="flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/25">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
              codex
            </h1>
            <p className="text-gray-400 mt-2">
              {isAdmin ? 'Admin Access' : isLogin ? 'Welcome back!' : 'Join the community'}
            </p>
          </div>

          {/* User Type Toggle */}
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-xl border border-slate-600/50 rounded-2xl shadow-2xl p-6 mb-6">
            <div className="flex bg-slate-700/50 rounded-lg p-1">
              <button
                onClick={toggleUserType}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  !isAdmin
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Users className="h-4 w-4 inline mr-2" />
                Student
              </button>
              <button
                onClick={toggleUserType}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  isAdmin
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Code className="h-4 w-4 inline mr-2" />
                Admin
              </button>
            </div>
          </div>

          {/* Auth Form */}
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-xl border border-slate-600/50 rounded-2xl shadow-2xl p-8">
            {/* Mode Toggle */}
            {!isAdmin && (
              <div className="flex bg-slate-700/50 rounded-lg p-1 mb-6">
                <button
                  onClick={toggleMode}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    isLogin
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={toggleMode}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    !isLogin
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Admin Form */}
              {isAdmin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Admin UserName
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        name="regNumber"
                        value={formData.regNumber}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        placeholder="Enter UserName"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        placeholder="Enter password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* User Form */}
              {!isAdmin && (
                <>
                  {!isLogin && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Branch
                          </label>
                          <select
                            name="branch"
                            value={formData.branch}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                            required
                          >
                            <option value="">Select Branch</option>
                            <option value="CSE">Computer Science</option>
                            <option value="IT">Information Technology</option>
                            <option value="ECE">Electronics & Communication</option>
                            <option value="EEE">Electrical & Electronics</option>
                            <option value="ME">Mechanical Engineering</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Year
                          </label>
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
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Experience Level
                        </label>
                        <select
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                        >
                          <option value="">Select Experience</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Team Name
                          </label>
                          <input
                            type="text"
                            name="teamName"
                            value={formData.teamName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                            placeholder="Enter team name"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Team Size
                          </label>
                          <input
                            type="number"
                            name="teamSize"
                            value={formData.teamSize}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                            placeholder="Team size"
                            min="1"
                            max="10"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Skills
                        </label>
                        <input
                          type="text"
                          name="skills"
                          value={skillsInput}
                          onChange={(e) => {
                            setSkillsInput(e.target.value);
                            // Convert to array and update formData
                            const skillsArray = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
                            setFormData(prev => ({ ...prev, skills: skillsArray }));
                          }}
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                          placeholder="Enter skills (comma separated)"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Dietary Preference
                          </label>
                          <select
                            name="dietary"
                            value={formData.dietary}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                          >
                            <option value="">Select Dietary Preference</option>
                            <option value="Vegetarian">Vegetarian</option>
                            <option value="Vegan">Vegan</option>
                            <option value="No Restrictions">No Restrictions</option>
                            <option value="Gluten free">Gluten Free</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            T-shirt Size
                          </label>
                          <select
                            name="tshirtSize"
                            value={formData.tshirtSize}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                          >
                            <option value="">Select T-shirt Size</option>
                            <option value="XS">XS</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            GitHub Profile
                          </label>
                          <div className="relative">
                            <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                              type="url"
                              name="github"
                              value={formData.github}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                              placeholder="GitHub URL"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            LinkedIn Profile
                          </label>
                          <div className="relative">
                            <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                              type="url"
                              name="linkedin"
                              value={formData.linkedin}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                              placeholder="LinkedIn URL"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Expectations
                        </label>
                        <textarea
                          name="expectations"
                          value={formData.expectations}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                          placeholder="What do you expect from this community?"
                          required
                        ></textarea>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="aggreeTerms"
                          checked={formData.aggreeTerms}
                          onChange={handleInputChange}
                          className="rounded text-cyan-500 focus:ring-cyan-500"
                          required
                        />
                        <span className="text-sm text-gray-300">
                          I agree to the terms and conditions
                        </span>
                      </div>
                    </>
                  )}

                  {/* Common fields for user login/signup */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Registration Number
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        name="regNumber"
                        value={formData.regNumber}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        placeholder="Enter registration number"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        placeholder="Enter password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{isAdmin ? 'Signing in...' : isLogin ? 'Signing in...' : 'Creating account...'}</span>
                  </div>
                ) : (
                  isAdmin ? 'Sign In as Admin' : isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                SOA ITER • {isAdmin ? 'Admin Panel' : 'Student Portal'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;