import Announcement from '../models/announcement.model.js';

// Get active announcements
export const getActiveAnnouncements = async (req, res) => {
  try {
    const now = new Date();
    
    const announcements = await Announcement.find({
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: now } }
      ]
    })
      .populate('createdBy', 'email role')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.status(200).json({ announcements });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create announcement (admin only)
export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, type, expiresAt } = req.body;
    const adminId = req.user.id;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const announcement = new Announcement({
      title,
      content,
      type: type || 'announcement',
      createdBy: adminId,
      expiresAt: expiresAt || null,
    });

    await announcement.save();

    const populatedAnnouncement = await Announcement.findById(announcement._id)
      .populate('createdBy', 'email role');

    res.status(201).json({
      message: 'Announcement created successfully',
      announcement: populatedAnnouncement,
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all announcements (admin only)
export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate('createdBy', 'email role')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ announcements });
  } catch (error) {
    console.error('Get all announcements error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update announcement (admin only)
export const updateAnnouncement = async (req, res) => {
  try {
    const { announcementId } = req.params;
    const { title, content, type, isActive, expiresAt } = req.body;

    const announcement = await Announcement.findById(announcementId);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    if (title) announcement.title = title;
    if (content) announcement.content = content;
    if (type) announcement.type = type;
    if (typeof isActive === 'boolean') announcement.isActive = isActive;
    if (expiresAt !== undefined) announcement.expiresAt = expiresAt;

    await announcement.save();

    const populatedAnnouncement = await Announcement.findById(announcement._id)
      .populate('createdBy', 'email role');

    res.status(200).json({
      message: 'Announcement updated successfully',
      announcement: populatedAnnouncement,
    });
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete announcement (admin only)
export const deleteAnnouncement = async (req, res) => {
  try {
    const { announcementId } = req.params;

    const announcement = await Announcement.findById(announcementId);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    await Announcement.findByIdAndDelete(announcementId);

    res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle announcement active status (admin only)
export const toggleAnnouncementStatus = async (req, res) => {
  try {
    const { announcementId } = req.params;

    const announcement = await Announcement.findById(announcementId);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    announcement.isActive = !announcement.isActive;
    await announcement.save();

    const populatedAnnouncement = await Announcement.findById(announcement._id)
      .populate('createdBy', 'email role');

    res.status(200).json({
      message: 'Announcement status updated successfully',
      announcement: populatedAnnouncement,
    });
  } catch (error) {
    console.error('Toggle announcement status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

