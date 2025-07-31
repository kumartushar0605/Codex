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
   const ADMIN_USER = process.env.NEXT_PUBLIC_ADMIN_USER || 'CodexMaster04';
  const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || 'codexbhai';

  if (regNumber === ADMIN_USER && password === ADMIN_PASS) {
    const adminData = { regNumber, role: 'admin' };
    setAdmin(adminData);
    localStorage.setItem('adminInfo', JSON.stringify(adminData));
    return { success: true };
  } else {
    return { success: false, error: 'Invalid admin credentials' };
  }
  };

  const logout = async () => {
      setAdmin(null);
      localStorage.removeItem('adminInfo');
      toast.success('Logged out successfully');
    
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