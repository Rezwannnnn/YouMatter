import express from 'express';
import {
  createMood,
  getMoods,
  getMoodAnalytics,
  updateMood,
  deleteMood,
} from '../controllers/mood.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createMood);
router.get('/', protect, getMoods);
router.get('/analytics', protect, getMoodAnalytics);
router.put('/:moodId', protect, updateMood);
router.delete('/:moodId', protect, deleteMood);

export default router;

