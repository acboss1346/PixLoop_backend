import express from 'express';
import { registerUser, loginUser, getMe, toggleNotifications } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/notifications-settings', protect, toggleNotifications);

export default router;
