import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const postService = {
  // Save/unsave post
  savePost: async (postId, userId) => {
    const response = await api.post(`/posts/${postId}/save`, { userId });
    return response.data;
  },

  // Get saved posts
  getSavedPosts: async (userId) => {
    const response = await api.get('/posts/saved', { params: { userId } });
    return response.data;
  },

  // Get user feed
  getUserFeed: async (userId, params = {}) => {
    const response = await api.get(API_ENDPOINTS.GET_FEED, {
      params: { userId, ...params },
    });
    return response.data;
  },

  // Create post
  createPost: async (communityName, postData) => {
    const response = await api.post(API_ENDPOINTS.CREATE_POST(communityName), postData);
    return response.data;
  },

  // Get post by ID
  getPost: async (postId) => {
    const response = await api.get(API_ENDPOINTS.POST_BY_ID(postId));
    return response.data;
  },

  // Update post
  updatePost: async (postId, postData) => {
    const response = await api.put(API_ENDPOINTS.POST_BY_ID(postId), postData);
    return response.data;
  },

  // Delete post
  deletePost: async (postId, userId) => {
    const response = await api.delete(API_ENDPOINTS.POST_BY_ID(postId), {
      data: { userId },
    });
    return response.data;
  },

  // Get community posts
  getCommunityPosts: async (communityName, params = {}) => {
    const response = await api.get(API_ENDPOINTS.COMMUNITY_POSTS(communityName), { params });
    return response.data;
  },

  // Search posts
  searchPosts: async (query, params = {}) => {
    const response = await api.get(API_ENDPOINTS.SEARCH_POSTS, {
      params: { q: query, ...params },
    });
    return response.data;
  },

  // Get trending posts
  getTrendingPosts: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.TRENDING_POSTS, { params });
    return response.data;
  },

  // Vote on post
  votePost: async (postId, userId, voteType) => {
    const response = await api.post(API_ENDPOINTS.VOTE_POST(postId), {
      userId,
      voteType,
    });
    return response.data;
  },

  // Get user's vote on post
  getUserVote: async (postId, userId) => {
    const response = await api.get(API_ENDPOINTS.VOTE_POST(postId), {
      params: { userId },
    });
    return response.data;
  },

  // Auto-tag post (AI)
  autoTagPost: async (postId) => {
    const response = await api.post(API_ENDPOINTS.AUTO_TAG(postId));
    return response.data;
  },

  // Get post sentiment (AI)
  getPostSentiment: async (postId) => {
    const response = await api.get(API_ENDPOINTS.GET_SENTIMENT(postId));
    return response.data;
  },

  // Report post
  reportPost: async (postId, reportData) => {
    const response = await api.post(API_ENDPOINTS.REPORT_POST(postId), reportData);
    return response.data;
  },

  // Hide post
  hidePost: async (postId, userId) => {
    const response = await api.post(API_ENDPOINTS.HIDE_POST(postId), { userId });
    return response.data;
  },

  // Crosspost
  crosspostPost: async (postId, targetCommunity, userId) => {
    const response = await api.post(API_ENDPOINTS.CROSSPOST(postId), {
      targetCommunity,
      userId,
    });
    return response.data;
  },

  // Share post
  sharePost: async (postId, platform) => {
    const response = await api.post(API_ENDPOINTS.SHARE_POST(postId), { platform });
    return response.data;
  },

  // Get post media
  getPostMedia: async (postId) => {
    const response = await api.get(`/posts/${postId}/media`);
    return response.data;
  },

  // Track media view
  trackMediaView: async (postId, userId, mediaIndex, duration = 0) => {
    try {
      const response = await api.post(`/posts/${postId}/media/view`, {
        userId,
        mediaIndex,
        duration,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to track media view:', error);
      return null;
    }
  },

  // Update post media
  updatePostMedia: async (postId, userId, media) => {
    const response = await api.put(`/posts/${postId}/media`, {
      userId,
      media,
    });
    return response.data;
  },
};
