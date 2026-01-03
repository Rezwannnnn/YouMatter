import express from 'express';
import {
  loginUser
} from '../controllers/auth.controller.js';

const router = express.Router();

// User login
router.post('/login', loginUser);

export default router;
