const API_BASE_URL = 'http://localhost:3000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

const announcementAPI = {
  // Get active announcements (public)
  getActiveAnnouncements: async () => {
    const response = await fetch(`${API_BASE_URL}/announcements/active`);
    return response.json();
  },

  // Get all announcements (admin)
  getAllAnnouncements: async () => {
    const response = await fetch(`${API_BASE_URL}/announcements/all`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  // Create announcement (admin)
  createAnnouncement: async (title, content, type, expiresAt) => {
    const response = await fetch(`${API_BASE_URL}/announcements`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ title, content, type, expiresAt }),
    });
    return response.json();
  },

  // Update announcement (admin)
  updateAnnouncement: async (announcementId, data) => {
    const response = await fetch(`${API_BASE_URL}/announcements/${announcementId}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Delete announcement (admin)
  deleteAnnouncement: async (announcementId) => {
    const response = await fetch(`${API_BASE_URL}/announcements/${announcementId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return response.json();
  },

  // Toggle announcement status (admin)
  toggleAnnouncementStatus: async (announcementId) => {
    const response = await fetch(`${API_BASE_URL}/announcements/${announcementId}/toggle`, {
      method: 'PUT',
      headers: getAuthHeader(),
    });
    return response.json();
  },
};

export default announcementAPI;

