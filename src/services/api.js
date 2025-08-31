import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://codex-website-backend.onrender.com', // Updated to match backend port
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    // Log the request for debugging
    console.log('Making request to:', config.url);
    console.log('With credentials:', config.withCredentials);
    console.log('All cookies:', document.cookie);
    
    // Try to get the accessToken from cookies manually
    const cookies = document.cookie.split(';');
    const accessTokenCookie = cookies.find(cookie => cookie.trim().startsWith('accessToken='));
    
    let tokenFound = false;
    
    if (accessTokenCookie) {
      const token = accessTokenCookie.split('=')[1];
      console.log('Found accessToken in cookies:', token ? 'Yes' : 'No');
      
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Added Authorization header from cookies');
        tokenFound = true;
      }
    }
    
    // If no cookie token, try localStorage as fallback
    if (!tokenFound) {
      const localToken = localStorage.getItem('accessToken');
      if (localToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${localToken}`;
        console.log('Added Authorization header from localStorage');
        tokenFound = true;
      }
    }
    
    // As a last resort for development, add userId as a custom header
    if (!tokenFound) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        config.headers['X-User-ID'] = userId;
        console.log('Added X-User-ID header as fallback:', userId);
      } else {
        console.log('No authentication data found');
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.log('Unauthorized - redirecting to login');
      // Optionally redirect to login page
      // window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Admin API functions
export const adminAPI = {
  // Login admin - first check frontend, then backend
  login: async (regNumber, password) => {
    // First, check frontend credentials
    const ADMIN_USER = process.env.NEXT_PUBLIC_ADMIN_USER || 'ADMIN001';
    const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || 'admin123';

    if (regNumber !== ADMIN_USER || password !== ADMIN_PASS) {
      return { success: false, error: 'Invalid admin credentials' };
    }

   

    if (regNumber !== ADMIN_USER || password !== ADMIN_PASS) {
      return { success: false, error: 'Invalid admin credentials' };
    }

  if (regNumber === ADMIN_USER && password === ADMIN_PASS) {
    return { 
      success: true, 
      user: { role: "admin", regNumber } 
    };
  } else {
    return { 
      success: false, 
      error: "Invalid admin credentials" 
    };
  }

  },

  // Logout admin
  logout: async () => {
    try {
      const response = await api.post('/api/v1/users/logout');
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Logout failed' };
    }
  },

  // Verify admin session (we'll use a protected endpoint to verify session)
  verifySession: async () => {
    try {
      // Try to access a protected endpoint to verify session
      const response = await api.get('/api/v1/announcements');
      console.log('Session verification successful');
      return { success: true };
    } catch (error) {
      console.error('Session verification error:', error);
      
      // Handle different types of errors
      if (error.response?.status === 401) {
        console.log('Session verification failed - unauthorized');
        return { success: false, error: 'Session verification failed' };
      } else if (error.response?.status === 403) {
        console.log('Session verification failed - forbidden');
        return { success: false, error: 'Access forbidden' };
      } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        console.log('Network error during session verification - assuming session is valid');
        return { success: true };
      } else if (error.response?.status >= 500) {
        console.log('Server error during session verification - assuming session is valid');
        return { success: true };
      }
      
      // For other errors (network, server issues), assume session is still valid
      console.log('Other error during session verification - assuming session is valid');
      return { success: true };
    }
  },
};

// Event API functions
export const 
eventAPI = {
  // Get all events
  getAllEvents: async () => {
    const response = await api.get('/api/v1/events');
    return response.data;
  },

  // Get single event
  getEvent: async (id) => {
    const response = await api.get(`/api/v1/events/${id}`);
    return response.data;
  },

  // Create event (admin only)
  createEvent: async (eventData) => {
    const response = await api.post('/api/v1/events', eventData);
    return response.data;
  },

  // Update event (admin only)
  updateEvent: async (id, eventData) => {
    const response = await api.patch(`/api/v1/events/${id}`, eventData);
    return response.data;
  },

  // Delete event (admin only)
  deleteEvent: async (id) => {
    const response = await api.delete(`/api/v1/events/${id}`);
    return response.data;
  },
};

// User API functions
export const userAPI = {
  // Get all users (you might need to add this endpoint to backend)
  getAllUsers: async () => {
    const response = await api.get('/api/v1/managedUsers'); // Updated to use managedUsers endpoint
    return response.data;
  },

  // Login user
  login: async (regNumber, password) => {
    console.log('Login API called with:', { regNumber, password: '***' });
    const response = await api.post('/api/v1/users/login', { regNumber, password });
    
    // Log the response to see what we get
    console.log('Full login response object:', response);
    console.log('Login response data:', response.data);
    console.log('User object from response:', response.data.user);
    console.log('User object keys:', response.data.user ? Object.keys(response.data.user) : 'user is undefined');
    console.log('User ID from response:', response.data.user?._id);
    console.log('Login response headers:', response.headers);
    console.log('Cookies after login:', document.cookie);
    
    // Since the backend sets cookies but they're not accessible due to CORS,
    // we need to manually handle the authentication
    if (response.data && response.data.user) {
      // Store user data
      localStorage.setItem('userInfo', JSON.stringify(response.data.user));
      
      // Try different possible ID field names
      const userId = response.data.user._id || response.data.user.id || response.data.user.userId;
      if (userId) {
        localStorage.setItem('userId', userId);
        console.log('Stored user ID for authentication:', userId);
      } else {
        console.error('No user ID found in response. User object:', response.data.user);
      }
    }
    
    return response.data;
  },

  // Signup user
  signup: async (userData) => {
    const response = await api.post('/api/v1/users/signUp', userData);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/api/v1/users/logout');
    
    // Clear stored tokens and user data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userId');
    console.log('Cleared all stored authentication data');
    
    return response.data;
  },
};

// Registration API functions
export const registrationAPI = {
  // Register user for event
  registerForEvent: async (eventId, userData) => {
    console.log('Registration API called with:');
    console.log('Event ID:', eventId);
    console.log('User Data:', userData);
    console.log('Cookies before request:', document.cookie);
    
    // Since cookies aren't working in development, include user ID in the request body
    // as a workaround for the authentication issue
    const userId = localStorage.getItem('userId');
    if (userId) {
      userData.userId = userId; // Add userId to request body as backup
      console.log('Added userId to request body:', userId);
    }
    
    const response = await api.post(`/api/v1/registers/registerUser/${eventId}`, userData);
    return response.data;
  },

  // Cancel registration
  cancelRegistration: async (eventId) => {
    const response = await api.patch(`/api/v1/registers/cancelRegistration/${eventId}`);
    return response.data;
  },

  // Get event registrations (admin only)
  getEventRegistrations: async (eventId) => {
    const response = await api.get(`/api/v1/registers/getRegistrations/${eventId}`);
    return response.data;
  },

  // Bulk update registration status (admin only)
  bulkUpdateRegistrationStatus: async (updateData) => {
    const response = await api.patch('/api/v1/registers/updateStatus', updateData);
    return response.data;
  },

  // Bulk delete registrations (admin only)
  bulkDeleteRegistrations: async (deleteData) => {
    const response = await api.delete('/api/v1/registers/deleteRegistrations', { data: deleteData });
    return response.data;
  },
};

// Announcement API functions
export const announcementAPI = {
  // Get all announcements
  getAllAnnouncements: async () => {
    const response = await api.get('/api/v1/announcements');
    return response.data;
  },

  // Get single announcement
  getAnnouncement: async (id) => {
    const response = await api.get(`/api/v1/announcements/${id}`);
    return response.data;
  },

  // Create announcement (admin only)
  createAnnouncement: async (announcementData) => {
    const response = await api.post('/api/v1/announcements', announcementData);
    return response.data;
  },

  // Update announcement (admin only)
  updateAnnouncement: async (id, announcementData) => {
    const response = await api.patch(`/api/v1/announcements/${id}`, announcementData);
    return response.data;
  },

  // Delete announcement (admin only)
  deleteAnnouncement: async (id) => {
    const response = await api.delete(`/api/v1/announcements/${id}`);
    return response.data;
  },
};

// Managed Users API functions
export const managedUserAPI = {
  // Get all managed users
  getAllManagedUsers: async () => {
    const response = await api.get('/api/v1/managedUsers');
    return response.data;
  },

  // Get single managed user
  getManagedUser: async (id) => {
    const response = await api.get(`/api/v1/managedUsers/${id}`);
    return response.data;
  },

  // Create managed user (admin only)
  createManagedUser: async (userData) => {
    const response = await api.post('/api/v1/managedUsers', userData);
    return response.data;
  },

  // Update managed user (admin only)
  updateManagedUser: async (id, userData) => {
    const response = await api.patch(`/api/v1/managedUsers/update/${id}`, userData);
    return response.data;
  },

  // Delete managed user (admin only)
  deleteManagedUser: async (id) => {
    const response = await api.delete(`/api/v1/managedUsers/${id}`);
    return response.data;
  },
};

// Project API functions
export const projectAPI = {
  // Get all projects
  getAllProjects: async () => {
    const response = await api.get('/api/v1/projects');
    return response.data;
  },

  // Get single project by ID
  getProjectById: async (id) => {
    const response = await api.get(`/api/v1/projects/${id}`);
    return response.data;
  },

  // Add new project with files
  addProjectWithFiles: async (formData) => {
    const response = await api.post('/api/v1/projects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Add new project (existing function for backward compatibility)
  addProject: async (projectData) => {
    // Map frontend fields to backend expected fields and validate
    const payload = {
      title: projectData.title,
      description: projectData.description,
      techStack: projectData.techStack || ["Other"], // Use actual tech stack from form
      liveLink: projectData.liveLink,
      repoLink: projectData.githubLink,
      images: [],
      videoLink: projectData.videoLink || ""
    };
    // Basic validation (backend will also validate)
    if (!payload.title || payload.title.length < 3 || payload.title.length > 100) {
      throw new Error("Title must be 3-100 characters");
    }
    if (!payload.description || payload.description.length < 10 || payload.description.length > 500) {
      throw new Error("Description must be 10-500 characters");
    }
    if (!payload.techStack || payload.techStack.length === 0) {
      throw new Error("At least one technology is required");
    }
    if (payload.liveLink && !/^https?:\/\/.+/.test(payload.liveLink)) {
      throw new Error("Invalid live link URL");
    }
    if (payload.repoLink && !/^https?:\/\/.+/.test(payload.repoLink)) {
      throw new Error("Invalid GitHub link URL");
    }
    if (payload.videoLink && !/^https?:\/\/.+/.test(payload.videoLink)) {
      throw new Error("Invalid video link URL");
    }
    const response = await api.post('/api/v1/projects', payload);
    return response.data;
  },

  // Update project by ID
  updateProject: async (id, projectData) => {
    // Map frontend fields to backend expected fields and validate
    const payload = {
      title: projectData.title,
      description: projectData.description,
      techStack: projectData.techStack || ["Other"],
      liveLink: projectData.liveLink,
      repoLink: projectData.githubLink || projectData.repoLink,
      images: projectData.images || [],
      videoLink: projectData.videoLink || ""
    };
    // Basic validation
    if (payload.title && (payload.title.length < 3 || payload.title.length > 100)) {
      throw new Error("Title must be 3-100 characters");
    }
    if (payload.description && (payload.description.length < 10 || payload.description.length > 500)) {
      throw new Error("Description must be 10-500 characters");
    }
    if (payload.liveLink && !/^https?:\/\/.+/.test(payload.liveLink)) {
      throw new Error("Invalid live link URL");
    }
    if (payload.repoLink && !/^https?:\/\/.+/.test(payload.repoLink)) {
      throw new Error("Invalid repository link URL");
    }
    const response = await api.put(`/api/v1/projects/${id}`, payload);
    return response.data;
  },

  // Delete project by ID
  deleteProject: async (id) => {
    const response = await api.delete(`/api/v1/projects/${id}`);
    return response.data;
  },
};

export default api;