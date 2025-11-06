export const API_BASE_URL = 'https://9q03u53gk1.execute-api.ap-south-1.amazonaws.com/Prod';

export const API_ENDPOINTS = {
  // Users
  USERS: '/users',
  USER_BY_USERNAME: (username) => `/users/${username}`,
  USER_POSTS: (username) => `/users/${username}/posts`,
  USER_COMMENTS: (username) => `/users/${username}/comments`,
  USER_STATS: (username) => `/users/${username}/stats`,
  USER_LEVEL: (username) => `/users/${username}/level`,
  
  // Communities
  COMMUNITIES: '/communities',
  COMMUNITY_BY_NAME: (name) => `/communities/${name}`,
  JOIN_COMMUNITY: (name) => `/communities/${name}/join`,
  LEAVE_COMMUNITY: (name) => `/communities/${name}/leave`,
  DISCOVER_COMMUNITIES: '/communities/discover',
  
  // Posts
  CREATE_POST: (communityName) => `/communities/${communityName}/posts`,
  POST_BY_ID: (postId) => `/posts/${postId}`,
  COMMUNITY_POSTS: (communityName) => `/communities/${communityName}/posts`,
  SEARCH_POSTS: '/posts/search',
  TRENDING_POSTS: '/posts/trending',
  
  // Comments
  CREATE_COMMENT: (postId) => `/posts/${postId}/comments`,
  POST_COMMENTS: (postId) => `/posts/${postId}/comments`,
  COMMENT_BY_ID: (commentId) => `/comments/${commentId}`,
  
  // Voting
  VOTE_POST: (postId) => `/posts/${postId}/vote`,
  VOTE_COMMENT: (commentId) => `/comments/${commentId}/vote`,
  
  // Social
  FOLLOW_USER: (username) => `/users/${username}/follow`,
  USER_FOLLOWERS: (username) => `/users/${username}/followers`,
  USER_FOLLOWING: (username) => `/users/${username}/following`,
  SEND_MESSAGE: '/messages',
  GET_CONVERSATION: (conversationId) => `/messages/conversations/${conversationId}`,
  GET_INBOX: '/messages/inbox',
  MARK_MESSAGE_READ: (messageId) => `/messages/${messageId}/read`,
  CROSSPOST: (postId) => `/posts/${postId}/crosspost`,
  SHARE_POST: (postId) => `/posts/${postId}/share`,
  GET_FEED: '/feed',
  
  // Gamification
  AWARD_BADGE: (username) => `/users/${username}/badges`,
  GET_BADGES: (username) => `/users/${username}/badges`,
  UPDATE_STREAK: (username) => `/users/${username}/streak`,
  COMMUNITY_LEADERBOARD: (name) => `/communities/${name}/leaderboard`,
  GLOBAL_LEADERBOARD: '/leaderboard',
  CHECK_ACHIEVEMENTS: (username) => `/users/${username}/check-achievements`,
  
  // Moderation
  REPORT_POST: (postId) => `/posts/${postId}/report`,
  REPORT_COMMENT: (commentId) => `/comments/${commentId}/report`,
  HIDE_POST: (postId) => `/posts/${postId}/hide`,
  REMOVE_POST: (postId) => `/posts/${postId}/remove`,
  BAN_USER: (communityName) => `/communities/${communityName}/ban`,
  UNBAN_USER: (communityName, userId) => `/communities/${communityName}/ban/${userId}`,
  SET_MODERATOR: (communityName) => `/communities/${communityName}/moderators`,
  PENDING_REPORTS: '/reports/pending',
  UPDATE_REPORT: (reportId) => `/reports/${reportId}`,
  
  // AI Features
  AUTO_TAG: (postId) => `/posts/${postId}/auto-tag`,
  GET_SENTIMENT: (postId) => `/posts/${postId}/sentiment`,
  COMMENT_SENTIMENT: (commentId) => `/comments/${commentId}/sentiment`,
  MODERATE_IMAGE: '/media/moderate',
  GET_RECOMMENDATIONS: '/recommendations',
  ANALYZE_TOXICITY: (commentId) => `/comments/${commentId}/analyze-toxicity`,
  
  // Unique Features
  CREATE_POLL: (communityName) => `/communities/${communityName}/polls`,
  VOTE_POLL: (pollId) => `/polls/${pollId}/vote`,
  GET_POLL: (pollId) => `/polls/${pollId}`,
  CREATE_CAPSULE: (communityName) => `/communities/${communityName}/capsules`,
  OPEN_CAPSULE: (capsuleId) => `/capsules/${capsuleId}`,
  UPCOMING_CAPSULES: (communityName) => `/communities/${communityName}/capsules/upcoming`,
  CREATE_EVENT: (communityName) => `/communities/${communityName}/events`,
  RSVP_EVENT: (eventId) => `/events/${eventId}/rsvp`,
  GET_EVENT: (eventId) => `/events/${eventId}`,
  UPCOMING_EVENTS: (communityName) => `/communities/${communityName}/events/upcoming`,
  
  // Media
  PRESIGN_MEDIA: '/media/presign',
};
