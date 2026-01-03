import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import { awardPoints, POINTS } from '../utils/achievements.js';

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Post content is required' });
    }

    // Get user's anonymous name
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const post = new Post({
      user: userId,
      anonymousName: user.anonymousName,
      content: content.trim(),
    });

    await post.save();

    // Award points for creating a post
    await awardPoints(userId, POINTS.CREATE_POST);

    // Get updated user data
    const updatedUser = await User.findById(userId).select('-password');

    res.status(201).json({
      message: 'Post created successfully',
      post,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isModerated: true })
      .populate('user', 'points badges')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ posts });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's own posts
export const getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ posts });
  } catch (error) {
    console.error('Get my posts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a post
export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Post content is required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns the post
    if (post.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    post.content = content.trim();
    await post.save();

    res.status(200).json({
      message: 'Post updated successfully',
      post,
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns the post
    if (post.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add a comment to a post
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Get user's anonymous name
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    post.comments.push({
      user: userId,
      anonymousName: user.anonymousName,
      content: content.trim(),
    });

    await post.save();

    // Award points to commenter
    await awardPoints(userId, POINTS.ADD_COMMENT);
    
    // Award points to post owner for receiving a comment
    if (post.user.toString() !== userId) {
      await awardPoints(post.user, POINTS.RECEIVE_COMMENT);
    }

    // Get updated user data
    const updatedUser = await User.findById(userId).select('-password');

    res.status(201).json({
      message: 'Comment added successfully',
      post,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add/Remove reaction to a post
export const toggleReaction = async (req, res) => {
  try {
    const { postId } = req.params;
    const { type } = req.body;
    const userId = req.user.id;

    if (!['heart', 'support', 'hug', 'star'].includes(type)) {
      return res.status(400).json({ message: 'Invalid reaction type' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user already reacted
    const existingReactionIndex = post.reactions.findIndex(
      (r) => r.user.toString() === userId
    );

    let isAddingReaction = false;

    if (existingReactionIndex > -1) {
      // If same reaction, remove it (toggle off)
      if (post.reactions[existingReactionIndex].type === type) {
        post.reactions.splice(existingReactionIndex, 1);
      } else {
        // If different reaction, update it
        post.reactions[existingReactionIndex].type = type;
      }
    } else {
      // Add new reaction
      post.reactions.push({ user: userId, type });
      isAddingReaction = true;
    }

    await post.save();

    // Award points only when adding a new reaction
    if (isAddingReaction) {
      await awardPoints(userId, POINTS.ADD_REACTION);
      
      // Award points to post owner for receiving a reaction
      if (post.user.toString() !== userId) {
        await awardPoints(post.user, POINTS.RECEIVE_REACTION);
      }
    }

    // Get updated user data
    const updatedUser = await User.findById(userId).select('-password');

    res.status(200).json({
      message: 'Reaction updated successfully',
      post,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Toggle reaction error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Report a post
export const reportPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { reason, description } = req.body;
    const userId = req.user.id;

    if (!reason) {
      return res.status(400).json({ message: 'Report reason is required' });
    }

    if (!['spam', 'harassment', 'inappropriate', 'misinformation', 'other'].includes(reason)) {
      return res.status(400).json({ message: 'Invalid report reason' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user already reported this post
    const existingReport = post.reports.find(
      (r) => r.user.toString() === userId && r.status === 'pending'
    );

    if (existingReport) {
      return res.status(400).json({ message: 'You have already reported this post' });
    }

    // Add report
    post.reports.push({
      user: userId,
      reason,
      description: description || '',
      status: 'pending',
    });

    await post.save();

    res.status(200).json({
      message: 'Post reported successfully. Our team will review it.',
      post,
    });
  } catch (error) {
    console.error('Report post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

