import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import Mood from '../models/mood.model.js';
import Journal from '../models/journal.model.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalPosts, totalMoods, totalJournals] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Mood.countDocuments(),
      Journal.countDocuments(),
    ]);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('-password')
      .lean();

    const recentPosts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.status(200).json({
      stats: {
        totalUsers,
        totalPosts,
        totalMoods,
        totalJournals,
      },
      recentUsers,
      recentPosts,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;

    let query = {};
    if (role) query.role = role;
    if (search) {
      query.email = { $regex: search, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await User.countDocuments(query);

    res.status(200).json({
      users,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'staff', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: 'User role updated successfully',
      user: userResponse,
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle user active status
export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: userResponse,
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all posts (for moderation)
export const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await Post.find()
      .populate('user', 'email anonymousName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Post.countDocuments();

    res.status(200).json({
      posts,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete post (admin)
export const deletePostAdmin = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post admin error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle post moderation status
export const togglePostModeration = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.isModerated = !post.isModerated;
    await post.save();

    res.status(200).json({
      message: `Post ${post.isModerated ? 'approved' : 'hidden'} successfully`,
      post,
    });
  } catch (error) {
    console.error('Toggle post moderation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting other admins
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    // Delete user and their data
    await Promise.all([
      User.findByIdAndDelete(userId),
      Post.deleteMany({ user: userId }),
      Mood.deleteMany({ user: userId }),
      Journal.deleteMany({ user: userId }),
    ]);

    res.status(200).json({ message: 'User and their data deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get reported posts
export const getReportedPosts = async (req, res) => {
  try {
    const { status = 'pending' } = req.query;

    // Find posts that have reports with the specified status
    const posts = await Post.find({
      'reports.status': status,
      'reports.0': { $exists: true }, // Has at least one report
    })
      .populate('user', 'email anonymousName')
      .populate('reports.user', 'email')
      .sort({ 'reports.createdAt': -1 })
      .lean();

    // Filter and format posts with their pending reports
    const reportedPosts = posts.map(post => {
      const filteredReports = post.reports.filter(r => r.status === status);
      return {
        ...post,
        reports: filteredReports,
        reportCount: filteredReports.length,
      };
    }).filter(post => post.reportCount > 0);

    res.status(200).json({ 
      posts: reportedPosts,
      total: reportedPosts.length,
    });
  } catch (error) {
    console.error('Get reported posts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update report status
export const updateReportStatus = async (req, res) => {
  try {
    const { postId, reportId } = req.params;
    const { status } = req.body;

    if (!['pending', 'reviewed', 'resolved', 'dismissed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const report = post.reports.id(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = status;
    await post.save();

    res.status(200).json({
      message: 'Report status updated successfully',
      post,
    });
  } catch (error) {
    console.error('Update report status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

