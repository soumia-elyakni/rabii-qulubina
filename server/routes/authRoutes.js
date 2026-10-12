import express from 'express';
import { registerUser, loginUser, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;