"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAPI } from '@/services/api';
import { toast } from 'react-toastify';

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

  // Check if admin is logged in on mount
  useEffect(() => {
    const adminInfo = localStorage.getItem('adminInfo');
    if (adminInfo) {
      try {
        setAdmin(JSON.parse(adminInfo));
      } catch (error) {
        console.error('Error parsing admin info:', error);
        localStorage.removeItem('adminInfo');
      }
    }
    setLoading(false);
  }, []);

    const login = async (regNumber, password) => {
    try {
      const response = await adminAPI.login(regNumber, password);

      if (response && response.success) {
        setAdmin(response.admin);
        localStorage.setItem('adminInfo', JSON.stringify(response.admin));
        return { success: true };
      } else {
        return { success: false, error: response?.message || 'Login failed' };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await adminAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAdmin(null);
      localStorage.removeItem('adminInfo');
      toast.success('Logged out successfully');
    }
  };

  const value = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!admin,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}; 