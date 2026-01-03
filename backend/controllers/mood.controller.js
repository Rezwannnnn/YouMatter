import Mood from '../models/mood.model.js';
import { awardPoints, POINTS } from '../utils/achievements.js';

// Create a mood entry
export const createMood = async (req, res) => {
  try {
    const { mood, intensity, note, activities } = req.body;
    const userId = req.user.id;

    if (!mood || !intensity) {
      return res.status(400).json({ message: 'Mood and intensity are required' });
    }

    const moodEntry = new Mood({
      user: userId,
      mood,
      intensity,
      note,
      activities,
    });

    await moodEntry.save();

    // Award points for logging mood
    await awardPoints(userId, POINTS.LOG_MOOD);

    res.status(201).json({
      message: 'Mood entry created successfully',
      mood: moodEntry,
    });
  } catch (error) {
    console.error('Create mood error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's mood entries
export const getMoods = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, limit = 30 } = req.query;

    let query = { user: userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const moods = await Mood.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({ moods });
  } catch (error) {
    console.error('Get moods error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get mood analytics
export const getMoodAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const moods = await Mood.find({
      user: userId,
      date: { $gte: startDate },
    }).sort({ date: 1 }).lean();

    // Calculate streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const moodDates = moods.map(m => {
      const date = new Date(m.date);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    });

    const uniqueDates = [...new Set(moodDates)].sort((a, b) => b - a);

    for (let i = 0; i < uniqueDates.length; i++) {
      const diffDays = Math.floor((today - uniqueDates[i]) / (1000 * 60 * 60 * 24));
      
      if (i === 0 && diffDays === 0) {
        currentStreak = 1;
        tempStreak = 1;
      } else if (i === 0 && diffDays === 1) {
        currentStreak = 1;
        tempStreak = 1;
      } else if (i > 0) {
        const prevDate = uniqueDates[i - 1];
        const daysDiff = Math.floor((prevDate - uniqueDates[i]) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          tempStreak++;
          if (i === 0 || (i === 1 && Math.floor((today - uniqueDates[0]) / (1000 * 60 * 60 * 24)) <= 1)) {
            currentStreak = tempStreak;
          }
        } else {
          tempStreak = 1;
        }
      }
      
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    // Calculate mood distribution
    const moodDistribution = moods.reduce((acc, m) => {
      acc[m.mood] = (acc[m.mood] || 0) + 1;
      return acc;
    }, {});

    // Calculate average intensity
    const avgIntensity = moods.length > 0
      ? moods.reduce((sum, m) => sum + m.intensity, 0) / moods.length
      : 0;

    res.status(200).json({
      totalEntries: moods.length,
      currentStreak,
      longestStreak,
      moodDistribution,
      averageIntensity: avgIntensity.toFixed(1),
      recentMoods: moods.slice(-7),
    });
  } catch (error) {
    console.error('Get mood analytics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update mood entry
export const updateMood = async (req, res) => {
  try {
    const { moodId } = req.params;
    const { mood, intensity, note, activities } = req.body;
    const userId = req.user.id;

    const moodEntry = await Mood.findById(moodId);
    if (!moodEntry) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }

    if (moodEntry.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (mood) moodEntry.mood = mood;
    if (intensity) moodEntry.intensity = intensity;
    if (note !== undefined) moodEntry.note = note;
    if (activities) moodEntry.activities = activities;

    await moodEntry.save();

    res.status(200).json({
      message: 'Mood entry updated successfully',
      mood: moodEntry,
    });
  } catch (error) {
    console.error('Update mood error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete mood entry
export const deleteMood = async (req, res) => {
  try {
    const { moodId } = req.params;
    const userId = req.user.id;

    const moodEntry = await Mood.findById(moodId);
    if (!moodEntry) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }

    if (moodEntry.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Mood.findByIdAndDelete(moodId);

    res.status(200).json({ message: 'Mood entry deleted successfully' });
  } catch (error) {
    console.error('Delete mood error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

