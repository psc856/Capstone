import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const userService = {
  // Create user
  createUser: async (userData) => {
    const response = await api.post(API_ENDPOINTS.USERS, userData);
    return response.data;
  },

  // Get user profile
  getUserProfile: async (username) => {
    const response = await api.get(API_ENDPOINTS.USER_BY_USERNAME(username));
    return response.data;
  },

  // Update user profile
  updateUserProfile: async (username, userData) => {
    const response = await api.put(API_ENDPOINTS.USER_BY_USERNAME(username), userData);
    return response.data;
  },

  // Get user posts
  getUserPosts: async (username, params = {}) => {
    const response = await api.get(API_ENDPOINTS.USER_POSTS(username), { params });
    return response.data;
  },

  // Get user comments
  getUserComments: async (username, params = {}) => {
    const response = await api.get(API_ENDPOINTS.USER_COMMENTS(username), { params });
    return response.data;
  },

  // Get user stats
  getUserStats: async (username) => {
    const response = await api.get(API_ENDPOINTS.USER_STATS(username));
    return response.data;
  },

  // Get user level
  getUserLevel: async (username) => {
    const response = await api.get(API_ENDPOINTS.USER_LEVEL(username));
    return response.data;
  },

  // Search users
  searchUsers: async (query, params = {}) => {
    const response = await api.get(API_ENDPOINTS.USERS, {
      params: { q: query, ...params },
    });
    return response.data;
  },
};
