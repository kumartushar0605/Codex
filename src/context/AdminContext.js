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

  // Check if admin is logged in on mount and verify with backend
  useEffect(() => {
    const checkAdminAuth = async () => {
      const adminInfo = localStorage.getItem('adminInfo');
      if (adminInfo) {
        try {
          const adminData = JSON.parse(adminInfo);
          setAdmin(adminData);
          
          // Verify with backend
          const sessionResponse = await adminAPI.verifySession();
          if (!sessionResponse.success) {
            // Backend verification failed, clear local data
            setAdmin(null);
            localStorage.removeItem('adminInfo');
            toast.error('Session expired. Please login again.');
          }
        } catch (error) {
          console.error('Error checking admin auth:', error);
          setAdmin(null);
          localStorage.removeItem('adminInfo');
        }
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

  // Function to navigate to admin routes with proper authentication
  const navigateToAdmin = (path = '/admin') => {
    if (admin) {
      router.push(`${path}?admin=true`);
    } else {
      toast.error('Admin access required');
      router.push('/');
    }
  };

  const value = {
    admin,
    loading,
    login,
    logout,
    navigateToAdmin,
    isAuthenticated: !!admin,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}; 