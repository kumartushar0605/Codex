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