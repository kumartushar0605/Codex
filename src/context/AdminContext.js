"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { adminAPI } from '@/services/api';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if admin is logged in on mount
  useEffect(() => {
    const checkAdminAuth = async () => {
      const adminInfo = localStorage.getItem('adminInfo');
      if (adminInfo) {
        try {
          const adminData = JSON.parse(adminInfo);
          setAdmin(adminData);
          console.log('Admin data loaded from localStorage:', adminData);
          
          // Only verify session when actually needed (on admin pages)
          // This prevents unnecessary API calls and false session expired messages
          const currentPath = window.location.pathname;
          console.log('Current path:', currentPath);
          
          if (currentPath.startsWith('/admin')) {
            console.log('On admin page, verifying session...');
            // Add a small delay to avoid race conditions
            setTimeout(async () => {
              try {
                const sessionResponse = await adminAPI.verifySession();
                console.log('Session verification response:', sessionResponse);
                if (!sessionResponse.success) {
                  // Backend verification failed, clear local data
                  setAdmin(null);
                  localStorage.removeItem('adminInfo');
                  toast.error('Session expired. Please login again.');
                }
              } catch (error) {
                console.error('Session verification error:', error);
                // Only clear on actual auth errors, not network issues
                if (error.response?.status === 401) {
                  setAdmin(null);
                  localStorage.removeItem('adminInfo');
                  toast.error('Session expired. Please login again.');
                }
              }
            }, 100);
          } else {
            console.log('Not on admin page, skipping session verification');
          }
        } catch (error) {
          console.error('Error parsing admin info:', error);
          // Clear corrupted data
          localStorage.removeItem('adminInfo');
        }
      } else {
        console.log('No admin info found in localStorage');
      }
      setLoading(false);
    };

    checkAdminAuth();
  }, []);

  const login = async (regNumber, password) => {
    try {
      // This will check frontend credentials first, then authenticate with backend
      const response = await adminAPI.login(regNumber, password);
      
      if (response.success) {
        const adminData = { 
          regNumber, 
          role: 'admin',
          ...response.user // Include backend user data
        };
        setAdmin(adminData);
        localStorage.setItem('adminInfo', JSON.stringify(adminData));
        toast.success('Admin login successful!');
        return { success: true };
      } else {
        // If backend authentication fails, show helpful error message
        if (response.error && response.error.includes('database')) {
          toast.error('Admin user not found in database');
        } else {
          toast.error(response.error || 'Login failed');
        }
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      // Call backend logout to clear cookies
      await adminAPI.logout();
    } catch (error) {
      console.error('Backend logout error:', error);
    }
    
    // Clear frontend state
    setAdmin(null);
    localStorage.removeItem('adminInfo');
    toast.success('Logged out successfully');
    router.push('/');
  };

  // Function to manually verify session when needed
  const verifySession = async () => {
    if (!admin) return false;
    
    try {
      const sessionResponse = await adminAPI.verifySession();
      if (!sessionResponse.success) {
        setAdmin(null);
        localStorage.removeItem('adminInfo');
        toast.error('Session expired. Please login again.');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Session verification error:', error);
      // Only clear on actual auth errors
      if (error.response?.status === 401) {
        setAdmin(null);
        localStorage.removeItem('adminInfo');
        toast.error('Session expired. Please login again.');
        return false;
      }
      // For other errors, assume session is still valid
      return true;
    }
  };

  // Function to navigate to admin routes with proper authentication
  const navigateToAdmin = async (path = '/admin') => {
    if (admin) {
      // Verify session before navigating to admin pages
      const isValid = await verifySession();
      if (isValid) {
        router.push(`${path}?admin=true`);
      } else {
        router.push('/auth');
      }
    } else {
      toast.error('Admin access required');
      router.push('/auth');
    }
  };

  const value = {
    admin,
    loading,
    login,
    logout,
    verifySession,
    navigateToAdmin,
    isAuthenticated: !!admin,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}; 