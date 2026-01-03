const API_BASE_URL = 'http://localhost:3000/api';

// Get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Mood APIs
export const moodAPI = {
  // Create mood entry
  createMood: async (moodData) => {
    const response = await fetch(`${API_BASE_URL}/moods`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(moodData),
    });
    return response.json();
  },

  // Get mood entries
  getMoods: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/moods${queryString ? `?${queryString}` : ''}`;
    const response = await fetch(url, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  // Get mood analytics
  getMoodAnalytics: async (days = 30) => {
    const response = await fetch(`${API_BASE_URL}/moods/analytics?days=${days}`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  // Update mood entry
  updateMood: async (moodId, moodData) => {
    const response = await fetch(`${API_BASE_URL}/moods/${moodId}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(moodData),
    });
    return response.json();
  },

  // Delete mood entry
  deleteMood: async (moodId) => {
    const response = await fetch(`${API_BASE_URL}/moods/${moodId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return response.json();
  },
};

// Journal APIs
export const journalAPI = {
  // Create journal entry
  createJournal: async (journalData) => {
    const response = await fetch(`${API_BASE_URL}/journals`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(journalData),
    });
    return response.json();
  },

  // Get journal entries
  getJournals: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/journals${queryString ? `?${queryString}` : ''}`;
    const response = await fetch(url, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  // Get single journal
  getJournal: async (journalId) => {
    const response = await fetch(`${API_BASE_URL}/journals/${journalId}`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  // Update journal entry
  updateJournal: async (journalId, journalData) => {
    const response = await fetch(`${API_BASE_URL}/journals/${journalId}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(journalData),
    });
    return response.json();
  },

  // Delete journal entry
  deleteJournal: async (journalId) => {
    const response = await fetch(`${API_BASE_URL}/journals/${journalId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return response.json();
  },
};

export default { moodAPI, journalAPI };

