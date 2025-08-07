import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', // Updated to match backend port
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

// // Response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Handle unauthorized access
//       window.location.href = '/auth';
//     }
//     return Promise.reject(error);
//   }
// );

// Admin API functions
export const adminAPI = {
  // Login admin
  login: async (regNumber, password) => {
    const response = await api.post('/api/v1/users/login', { regNumber, password });
    return response.data;
  },

  // Logout admin
  logout: async () => {
    const response = await api.post('/api/v1/users/logout');
    return response.data;
  },

  // Signup admin (if needed)
  signup: async (adminData) => {
    const response = await api.post('/api/v1/users/signUp', adminData);
    return response.data;
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
    const response = await api.post('/api/v1/users/login', { regNumber, password });
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
    return response.data;
  },
};

// Registration API functions
export const registrationAPI = {
  // Register user for event
  registerForEvent: async (eventId, userData) => {
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

  // Delete managed user (admin only)
  deleteManagedUser: async (id) => {
    const response = await api.delete(`/api/v1/managedUsers/${id}`);
    return response.data;
  },
};

export default api;