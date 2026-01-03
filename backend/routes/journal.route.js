import express from 'express';
import {
  createJournal,
  getJournals,
  getJournal,
  updateJournal,
  deleteJournal,
} from '../controllers/journal.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createJournal);
router.get('/', protect, getJournals);
router.get('/:journalId', protect, getJournal);
router.put('/:journalId', protect, updateJournal);
router.delete('/:journalId', protect, deleteJournal);

export default router;

