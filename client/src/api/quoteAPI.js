const API_BASE_URL = 'http://localhost:3000/api';

const quoteAPI = {
  // Get daily quote (public)
  getDailyQuote: async () => {
    const response = await fetch(`${API_BASE_URL}/quotes/daily`);
    return response.json();
  },
};

export default quoteAPI;

