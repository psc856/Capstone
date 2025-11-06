import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/userService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (username) => {
    try {
      const response = await userService.getUserProfile(username);
      const userData = response.user;
      setUser(userData);
      return userData;
    } catch (error) {
      throw new Error('User not found. Please check your username or sign up.');
    }
  };

  const register = async (userData) => {
    try {
      const response = await userService.createUser(userData);
      const newUser = response.user;
      setUser(newUser);
      return newUser;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error('Username or email already exists');
      }
      throw new Error('Failed to register. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = async (updates) => {
    if (!user) return;
    try {
      await userService.updateUserProfile(user.username, { ...updates, userId: user.userId });
      const response = await userService.getUserProfile(user.username);
      const updatedUser = response.user;
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw new Error('Failed to update user');
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    try {
      const response = await userService.getUserProfile(user.username);
      const updatedUser = response.user;
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
