import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  getAllPosts,
  deletePostAdmin,
  togglePostModeration,
  deleteUser,
  getReportedPosts,
  updateReportStatus,
} from '../controllers/admin.controller.js';
import { protect } from '../middleware/auth.js';
import { isAdmin, isAdminOrStaff } from '../middleware/adminAuth.js';

const router = express.Router();

// Dashboard
router.get('/stats', protect, isAdminOrStaff, getDashboardStats);

// User management
router.get('/users', protect, isAdminOrStaff, getAllUsers);
router.put('/users/:userId/role', protect, isAdmin, updateUserRole);
router.put('/users/:userId/status', protect, isAdminOrStaff, toggleUserStatus);
router.delete('/users/:userId', protect, isAdmin, deleteUser);

// Post management
router.get('/posts', protect, isAdminOrStaff, getAllPosts);
router.delete('/posts/:postId', protect, isAdminOrStaff, deletePostAdmin);
router.put('/posts/:postId/moderate', protect, isAdminOrStaff, togglePostModeration);

// Report management
router.get('/reports', protect, isAdminOrStaff, getReportedPosts);
router.put('/reports/:postId/:reportId', protect, isAdminOrStaff, updateReportStatus);

export default router;

