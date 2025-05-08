import express from 'express';
import {
  registerUser,
  loginUser,
  getUser,
  logoutUser,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 */
router.post('/register', registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 */
router.post('/login', loginUser);

/**
 * @route   GET /api/auth/user
 * @desc    Get user profile
 * @access  Private
 */
router.get('/user', protect, getUser);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (handled on frontend)
 */
router.post('/logout', logoutUser);

export default router;
