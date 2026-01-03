const API_BASE_URL = 'http://localhost:3000/api';

// Get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Post APIs
export const postAPI = {
  // Create a new post
  createPost: async (content) => {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ content }),
    });
    return response.json();
  },

  // Get all posts
  getPosts: async () => {
    const response = await fetch(`${API_BASE_URL}/posts`);
    return response.json();
  },

  // Get user's posts
  getMyPosts: async () => {
    const response = await fetch(`${API_BASE_URL}/posts/my-posts`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  // Update a post
  updatePost: async (postId, content) => {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ content }),
    });
    return response.json();
  },

  // Delete a post
  deletePost: async (postId) => {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return response.json();
  },

  // Add a comment
  addComment: async (postId, content) => {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ content }),
    });
    return response.json();
  },

  // Toggle reaction
  toggleReaction: async (postId, type) => {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/reactions`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ type }),
    });
    return response.json();
  },

  // Report post
  reportPost: async (postId, reason, description) => {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/report`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ reason, description }),
    });
    return response.json();
  },
};

// User APIs
export const userAPI = {
  // Update anonymous name
  updateAnonymousName: async (anonymousName) => {
    const response = await fetch(`${API_BASE_URL}/users/anonymous-name`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ anonymousName }),
    });
    return response.json();
  },
};

export default postAPI;

