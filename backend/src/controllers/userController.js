const User = require('../models/User');

// @desc    Get user statistics
// @route   GET /api/user/stats
// @access  Private
exports.getUserStats = async (req, res) => {
  try {
    // Get user with populated bookmarks
    const user = await User.findById(req.user._id).populate('bookmarks');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // For now, we only have bookmarked stats
    // In a real application, you would track applied and selected internships as well
    const stats = {
      bookmarked: user.bookmarks.length,
      applied: 0,  // Placeholder for future implementation
      selected: 0  // Placeholder for future implementation
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};