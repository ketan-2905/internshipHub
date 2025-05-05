const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const { verifyJWT, requireAdmin } = require('../middleware/auth');

// @route   GET /api/internships
// @desc    Get all internships
// @access  Public
router.get('/', async (req, res) => {
  try {
    const internships = await Internship.find().sort({ deadline: 1 });
    res.json(internships);
  } catch (error) {
    console.error('Get internships error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/internships/recent
// @desc    Get recent internships
// @access  Private
router.get('/recent', verifyJWT, async (req, res) => {
  try {
    const internships = await Internship.find()
      .sort({ deadline: 1 })
      .limit(5);
    res.json(internships);
  } catch (error) {
    console.error('Get recent internships error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/internships/:id
// @desc    Get internship by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    
    res.json(internship);
  } catch (error) {
    console.error('Get internship error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Internship not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/internships
// @desc    Create a new internship
// @access  Admin only
router.post('/', verifyJWT, requireAdmin, async (req, res) => {
  try {
    const { 
      company, 
      role, 
      requirements, 
      mode, 
      stipend, 
      deadline, 
      formLink,
      calendarEvents 
    } = req.body;

    const newInternship = new Internship({
      company,
      role,
      requirements,
      mode,
      stipend,
      deadline,
      formLink,
      calendarEvents: calendarEvents || []
    });

    const internship = await newInternship.save();
    res.status(201).json(internship);
  } catch (error) {
    console.error('Create internship error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/internships/:id
// @desc    Update an internship
// @access  Admin only
router.put('/:id', verifyJWT, requireAdmin, async (req, res) => {
  try {
    const { 
      company, 
      role, 
      requirements, 
      mode, 
      stipend, 
      deadline, 
      formLink,
      calendarEvents 
    } = req.body;

    // Build internship object
    const internshipFields = {};
    if (company) internshipFields.company = company;
    if (role) internshipFields.role = role;
    if (requirements) internshipFields.requirements = requirements;
    if (mode) internshipFields.mode = mode;
    if (stipend) internshipFields.stipend = stipend;
    if (deadline) internshipFields.deadline = deadline;
    if (formLink) internshipFields.formLink = formLink;
    if (calendarEvents) internshipFields.calendarEvents = calendarEvents;

    // Update internship
    let internship = await Internship.findById(req.params.id);
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    internship = await Internship.findByIdAndUpdate(
      req.params.id,
      { $set: internshipFields },
      { new: true }
    );

    res.json(internship);
  } catch (error) {
    console.error('Update internship error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Internship not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/internships/:id
// @desc    Delete an internship
// @access  Admin only
router.delete('/:id', verifyJWT, requireAdmin, async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    await internship.deleteOne();
    res.json({ message: 'Internship removed' });
  } catch (error) {
    console.error('Delete internship error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Internship not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;