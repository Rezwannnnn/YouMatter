import express from 'express';
import { getDailyQuoteController } from '../controllers/quote.controller.js';

const router = express.Router();

// Public route
router.get('/daily', getDailyQuoteController);

export default router;

