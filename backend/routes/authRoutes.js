import express from 'express';
import {
  registerUser,
  authUser,
  generateInvite,
  joinPartner,
  getUserProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);

// Couple specific routes
router.post('/couple/invite', protect, generateInvite);
router.post('/couple/join', protect, joinPartner);

export default router;
