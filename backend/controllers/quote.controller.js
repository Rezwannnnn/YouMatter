import { getDailyQuote } from '../utils/quotes.js';

// Get daily quote
export const getDailyQuoteController = async (req, res) => {
  try {
    const quote = getDailyQuote();
    res.status(200).json({ quote });
  } catch (error) {
    console.error('Get daily quote error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

