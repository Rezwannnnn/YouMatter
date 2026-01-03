import Journal from '../models/journal.model.js';
import { awardPoints, POINTS } from '../utils/achievements.js';

// Create a journal entry
export const createJournal = async (req, res) => {
  try {
    const { title, content, mood, tags } = req.body;
    const userId = req.user.id;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const journal = new Journal({
      user: userId,
      title,
      content,
      mood,
      tags,
    });

    await journal.save();

    // Award points for creating a journal entry
    await awardPoints(userId, POINTS.CREATE_JOURNAL);

    res.status(201).json({
      message: 'Journal entry created successfully',
      journal,
    });
  } catch (error) {
    console.error('Create journal error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's journal entries
export const getJournals = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search, mood, limit = 20, page = 1 } = req.query;

    let query = { user: userId };

    if (search) {
      query.$text = { $search: search };
    }

    if (mood) {
      query.mood = mood;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const journals = await Journal.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Journal.countDocuments(query);

    res.status(200).json({
      journals,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error('Get journals error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single journal entry
export const getJournal = async (req, res) => {
  try {
    const { journalId } = req.params;
    const userId = req.user.id;

    const journal = await Journal.findById(journalId);
    
    if (!journal) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    if (journal.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json({ journal });
  } catch (error) {
    console.error('Get journal error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update journal entry
export const updateJournal = async (req, res) => {
  try {
    const { journalId } = req.params;
    const { title, content, mood, tags } = req.body;
    const userId = req.user.id;

    const journal = await Journal.findById(journalId);
    
    if (!journal) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    if (journal.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (title) journal.title = title;
    if (content) journal.content = content;
    if (mood !== undefined) journal.mood = mood;
    if (tags) journal.tags = tags;

    await journal.save();

    res.status(200).json({
      message: 'Journal entry updated successfully',
      journal,
    });
  } catch (error) {
    console.error('Update journal error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete journal entry
export const deleteJournal = async (req, res) => {
  try {
    const { journalId } = req.params;
    const userId = req.user.id;

    const journal = await Journal.findById(journalId);
    
    if (!journal) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    if (journal.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Journal.findByIdAndDelete(journalId);

    res.status(200).json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    console.error('Delete journal error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

