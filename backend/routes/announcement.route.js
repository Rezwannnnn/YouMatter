import express from 'express';
import {
  getActiveAnnouncements,
  createAnnouncement,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncementStatus,
} from '../controllers/announcement.controller.js';
import { protect } from '../middleware/auth.js';
import { isAdmin, isAdminOrStaff } from '../middleware/adminAuth.js';

const router = express.Router();

// Public routes
router.get('/active', getActiveAnnouncements);

// Admin routes
router.post('/', protect, isAdmin, createAnnouncement);
router.get('/all', protect, isAdminOrStaff, getAllAnnouncements);
router.put('/:announcementId', protect, isAdmin, updateAnnouncement);
router.delete('/:announcementId', protect, isAdmin, deleteAnnouncement);
router.put('/:announcementId/toggle', protect, isAdmin, toggleAnnouncementStatus);

export default router;

