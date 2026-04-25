import pool from '../config/db.js';

// @desc    Get all communities with member counts
// @route   GET /api/communities
// @access  Public
export const getCommunities = async (req, res) => {
  try {
    const [communities] = await pool.query(
      `SELECT c.*, 
       COUNT(DISTINCT cm.user_id) as memberCount
       FROM communities c
       LEFT JOIN community_members cm ON c.id = cm.community_id
       GROUP BY c.id
       ORDER BY memberCount DESC
       LIMIT 10`
    );

    res.json({ success: true, data: communities });
  } catch (error) {
    console.error('getCommunities ERROR:', error.message);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get trending hashtags
// @route   GET /api/trending/hashtags
// @access  Public
export const getTrendingHashtags = async (req, res) => {
  try {
    const [trending] = await pool.query(
      `SELECT hashtag, 
       COUNT(*) as postCount
       FROM post_hashtags
       GROUP BY hashtag
       ORDER BY postCount DESC
       LIMIT 5`
    );

    const formattedTrending = trending.map(item => ({
      id: item.hashtag,
      hashtag: item.hashtag.startsWith('#') ? item.hashtag : '#' + item.hashtag,
      postCount: item.postCount,
      trend: 'up'
    }));

    res.json({ success: true, data: formattedTrending });
  } catch (error) {
    console.error('getTrendingHashtags ERROR:', error.message);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Join a community
// @route   POST /api/communities/:id/join
// @access  Private
export const joinCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if already a member
    const [existing] = await pool.query(
      'SELECT * FROM community_members WHERE user_id = ? AND community_id = ?',
      [userId, id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Already a member' });
    }

    await pool.query(
      'INSERT INTO community_members (user_id, community_id) VALUES (?, ?)',
      [userId, id]
    );

    res.json({ success: true, message: 'Joined community successfully' });
  } catch (error) {
    console.error('joinCommunity ERROR:', error.message);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
