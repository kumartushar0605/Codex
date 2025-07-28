import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', // Update this with your backend port
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});



// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    // You can add auth headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Admin API functions
export const adminAPI = {
  // Login admin
  login: async (regNumber, password) => {
    const response = await api.post('/api/admin/login', { regNumber, password });
    return response.data;
  },

  // Logout admin
  logout: async () => {
    const response = await api.post('/api/admin/logout');
    return response.data;
  },

  // Signup admin (if needed)
  signup: async (adminData) => {
    const response = await api.post('/api/admin/signup', adminData);
    return response.data;
  },
};

// Event API functions
export const eventAPI = {
  // Get all events
  getAllEvents: async () => {
    const response = await api.get('/api/event/events');
    return response.data;
  },

  // Get single event
  getEvent: async (id) => {
    const response = await api.get(`/api/event/events/${id}`);
    return response.data;
  },

  // Create event (admin only)
  createEvent: async (eventData) => {
    const response = await api.post('/api/event/events', eventData);
    return response.data;
  },

  // Update event (admin only)
  updateEvent: async (id, eventData) => {
    const response = await api.patch(`/api/event/events/${id}`, eventData);
    return response.data;
  },

  // Delete event (admin only)
  deleteEvent: async (id) => {
    const response = await api.delete(`/api/event/events/${id}`);
    return response.data;
  },
};

// User API functions
export const userAPI = {
  // Get all users (you might need to add this endpoint to backend)
  getAllUsers: async () => {
    const response = await api.get('/auth/users'); // This endpoint might not exist yet
    return response.data;
  },

  // Login user
  login: async (regNumber, password) => {
    const response = await api.post('/auth/login', { regNumber, password });
    return response.data;
  },

  // Signup user
  signup: async (userData) => {
    const response = await api.post('/auth/signUp', userData);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

export default api; 