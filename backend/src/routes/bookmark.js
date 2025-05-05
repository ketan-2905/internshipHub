const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Internship = require('../models/Internship');
const { verifyJWT } = require('../middleware/auth');

// @route   GET /api/bookmarks
// @desc    Get user's bookmarked internships
// @access  Private
router.get('/', verifyJWT, async (req, res) => {
  try {
    // Find user and populate bookmarks
    const user = await User.findById(req.user._id).populate('bookmarks');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.bookmarks);
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/bookmarks/toggle
// @desc    Toggle internship in user's bookmarks
// @access  Private
router.post('/toggle', verifyJWT, async (req, res) => {
  try {
    const { internshipId } = req.body;
    
    if (!internshipId) {
      return res.status(400).json({ message: 'Internship ID is required' });
    }
    
    // Check if internship exists
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    
    // Find user
    const user = await User.findById(req.user._id);
    
    // Check if internship is already bookmarked
    const isBookmarked = user.bookmarks.includes(internshipId);
    
    if (isBookmarked) {
      // Remove from bookmarks
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { bookmarks: internshipId }
      });
      res.json({ message: 'Internship removed from bookmarks', isBookmarked: false });
    } else {
      // Add to bookmarks
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { bookmarks: internshipId }
      });
      res.json({ message: 'Internship added to bookmarks', isBookmarked: true });
    }
  } catch (error) {
    console.error('Toggle bookmark error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Internship not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookmarks/check/:id
// @desc    Check if an internship is bookmarked by the user
// @access  Private
// router.get('/check/:id', verifyJWT, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     const isBookmarked = user.bookmarks.includes(req.params.id);
//     res.json({ isBookmarked });
//   } catch (error) {
//     console.error('Check bookmark error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// @route   GET /api/bookmarks/ids
// @desc    Get only IDs of user's bookmarked internships
// @access  Private
router.get('/ids', verifyJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('bookmarks');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return just the array of bookmark IDs
    res.json(user.bookmarks);
  } catch (error) {
    console.error('Get bookmark IDs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;