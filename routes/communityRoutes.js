import express from 'express';
import { getCommunities, getTrendingHashtags, joinCommunity } from '../controllers/communityController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getCommunities);
router.get('/trending/hashtags', getTrendingHashtags);

// Protected routes
router.post('/:id/join', protect, joinCommunity);

export default router;
