import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import Mood from '../models/mood.model.js';
import Journal from '../models/journal.model.js';

// Badge definitions
export const BADGES = {
  FIRST_POST: {
    name: 'First Steps',
    description: 'Made your first community post',
    icon: '🌱',
    check: async (userId) => {
      const postCount = await Post.countDocuments({ user: userId });
      return postCount >= 1;
    },
  },
  COMMUNITY_CONTRIBUTOR: {
    name: 'Community Voice',
    description: 'Shared 10 posts with the community',
    icon: '💬',
    check: async (userId) => {
      const postCount = await Post.countDocuments({ user: userId });
      return postCount >= 10;
    },
  },
  MOOD_TRACKER: {
    name: 'Mood Tracker',
    description: 'Logged your mood for 7 consecutive days',
    icon: '📊',
    check: async (userId) => {
      const moods = await Mood.find({ user: userId }).sort({ date: -1 }).limit(7);
      if (moods.length < 7) return false;
      
      // Check if dates are consecutive
      for (let i = 0; i < moods.length - 1; i++) {
        const current = new Date(moods[i].date);
        const next = new Date(moods[i + 1].date);
        const diffDays = Math.floor((current - next) / (1000 * 60 * 60 * 24));
        if (diffDays !== 1) return false;
      }
      return true;
    },
  },
  JOURNAL_WRITER: {
    name: 'Reflective Writer',
    description: 'Written 7 journal entries',
    icon: '📝',
    check: async (userId) => {
      const journalCount = await Journal.countDocuments({ user: userId });
      return journalCount >= 7;
    },
  },
  SUPPORTIVE_SOUL: {
    name: 'Supportive Soul',
    description: 'Reacted to 20 community posts',
    icon: '❤️',
    check: async (userId) => {
      const posts = await Post.find({ 'reactions.user': userId });
      return posts.length >= 20;
    },
  },
  CONVERSATION_STARTER: {
    name: 'Conversation Starter',
    description: 'Commented on 15 posts',
    icon: '💭',
    check: async (userId) => {
      const posts = await Post.find({ 'comments.user': userId });
      return posts.length >= 15;
    },
  },
  WELLNESS_WARRIOR: {
    name: 'Wellness Warrior',
    description: 'Logged mood for 30 days',
    icon: '🏆',
    check: async (userId) => {
      const moodCount = await Mood.countDocuments({ user: userId });
      return moodCount >= 30;
    },
  },
  JOURNALING_MASTER: {
    name: 'Journaling Master',
    description: 'Written 30 journal entries',
    icon: '📚',
    check: async (userId) => {
      const journalCount = await Journal.countDocuments({ user: userId });
      return journalCount >= 30;
    },
  },
};

// Points for different actions
export const POINTS = {
  CREATE_POST: 10,
  RECEIVE_REACTION: 2,
  RECEIVE_COMMENT: 5,
  ADD_COMMENT: 5,
  ADD_REACTION: 3,
  LOG_MOOD: 5,
  CREATE_JOURNAL: 8,
  DAILY_LOGIN: 2,
};

// Award points to a user
export const awardPoints = async (userId, points) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    user.points = (user.points || 0) + points;
    await user.save();

    // Check and award badges after points update
    await checkAndAwardBadges(userId);

    return user.points;
  } catch (error) {
    console.error('Error awarding points:', error);
  }
};

// Check and award badges
export const checkAndAwardBadges = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const earnedBadgeNames = user.badges.map(b => b.name);

    for (const [key, badge] of Object.entries(BADGES)) {
      // Skip if user already has this badge
      if (earnedBadgeNames.includes(badge.name)) continue;

      // Check if user qualifies for this badge
      const qualifies = await badge.check(userId);
      if (qualifies) {
        user.badges.push({
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
        });
        
        // Award bonus points for earning a badge
        user.points = (user.points || 0) + 50;
      }
    }

    await user.save();
    return user.badges;
  } catch (error) {
    console.error('Error checking badges:', error);
  }
};

