const API_BASE_URL = 'http://localhost:3000/api';

// Get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Admin APIs
export const adminAPI = {
  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  // Get all users
  getAllUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/admin/users${queryString ? `?${queryString}` : ''}`;
    const response = await fetch(url, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ role }),
    });
    return response.json();
  },

  // Toggle user status
  toggleUserStatus: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: getAuthHeader(),
    });
    return response.json();
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return response.json();
  },

  // Get all posts
  getAllPosts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/admin/posts${queryString ? `?${queryString}` : ''}`;
    const response = await fetch(url, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  // Delete post
  deletePost: async (postId) => {
    const response = await fetch(`${API_BASE_URL}/admin/posts/${postId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return response.json();
  },

  // Toggle post moderation
  togglePostModeration: async (postId) => {
    const response = await fetch(`${API_BASE_URL}/admin/posts/${postId}/moderate`, {
      method: 'PUT',
      headers: getAuthHeader(),
    });
    return response.json();
  },

  // Get reported posts
  getReportedPosts: async (status = 'pending') => {
    const response = await fetch(`${API_BASE_URL}/admin/reports?status=${status}`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  // Update report status
  updateReportStatus: async (postId, reportId, status) => {
    const response = await fetch(`${API_BASE_URL}/admin/reports/${postId}/${reportId}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ status }),
    });
    return response.json();
  },
};

export default adminAPI;

