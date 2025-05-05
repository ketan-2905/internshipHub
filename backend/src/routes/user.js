const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middleware/auth');
const { getUserStats } = require('../controllers/userController');

// @route   GET /api/user/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', verifyJWT, getUserStats);

module.exports = router;