"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from '@/services/api';
import { toast } from 'react-toastify';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch (error) {
        console.error('Error parsing user info:', error);
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  const login = async (regNumber, password) => {
    try {
      const response = await userAPI.login(regNumber, password);
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('userInfo', JSON.stringify(response.user));
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await userAPI.signup(userData);
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('userInfo', JSON.stringify(response.user));
        return { success: true };
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || 'Signup failed';
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await userAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('userInfo');
      toast.success('Logged out successfully');
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 