import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const communityService = {
  // Create community
  createCommunity: async (communityData) => {
    const response = await api.post(API_ENDPOINTS.COMMUNITIES, communityData);
    return response.data;
  },

  // Get all communities
  getAllCommunities: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.COMMUNITIES, { params });
    return response.data;
  },

  // Get community by name
  getCommunity: async (name) => {
    const response = await api.get(API_ENDPOINTS.COMMUNITY_BY_NAME(name));
    return response.data;
  },

  // Join community
  joinCommunity: async (name, userId) => {
    const response = await api.post(API_ENDPOINTS.JOIN_COMMUNITY(name), { userId });
    return response.data;
  },

  // Leave community
  leaveCommunity: async (name, userId) => {
    const response = await api.post(API_ENDPOINTS.LEAVE_COMMUNITY(name), { userId });
    return response.data;
  },

  // Discover communities
  discoverCommunities: async (userId) => {
    const response = await api.get(API_ENDPOINTS.DISCOVER_COMMUNITIES, {
      params: { userId },
    });
    return response.data;
  },

  // Get community leaderboard
  getCommunityLeaderboard: async (name, params = {}) => {
    const response = await api.get(API_ENDPOINTS.COMMUNITY_LEADERBOARD(name), { params });
    return response.data;
  },

  // Search communities
  searchCommunities: async (query, params = {}) => {
    const response = await api.get(API_ENDPOINTS.COMMUNITIES, {
      params: { q: query, ...params },
    });
    return response.data;
  },
};
