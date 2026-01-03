import express from 'express';
import {
  createPost,
  getPosts,
  getMyPosts,
  updatePost,
  deletePost,
  addComment,
  toggleReaction,
  reportPost,
} from '../controllers/post.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Post routes
router.post('/', protect, createPost);
router.get('/', getPosts);
router.get('/my-posts', protect, getMyPosts);
router.put('/:postId', protect, updatePost);
router.delete('/:postId', protect, deletePost);

// Comment routes
router.post('/:postId/comments', protect, addComment);

// Reaction routes
router.post('/:postId/reactions', protect, toggleReaction);

// Report routes
router.post('/:postId/report', protect, reportPost);

export default router;

