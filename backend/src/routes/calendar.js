const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const { verifyJWT } = require('../middleware/auth');

// @route   GET /api/calendar/public
// @desc    Get all public calendar events (deadlines)
// @access  Public
router.get('/public', async (req, res) => {
  try {
    // Get all internships
    const internships = await Internship.find();
    
    // Extract deadline events
    const events = internships.map(internship => ({
      id: internship._id,
      title: `${internship.role} at ${internship.company} - Deadline`,
      date: internship.deadline,
      type: 'deadline',
      internshipId: internship._id
    }));
    
    // Add public calendar events
    internships.forEach(internship => {
      if (internship.calendarEvents && internship.calendarEvents.length > 0) {
        const publicEvents = internship.calendarEvents
          .filter(event => event.visibility === 'public')
          .map(event => ({
            id: event._id,
            title: event.title,
            date: event.date,
            type: 'event',
            internshipId: internship._id
          }));
        
        events.push(...publicEvents);
      }
    });
    
    res.json(events);
  } catch (error) {
    console.error('Get public calendar error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/calendar/private
// @desc    Get private calendar events for logged-in user
// @access  Private
router.get('/private', verifyJWT, async (req, res) => {
  try {
    // Get all internships
    const internships = await Internship.find();
    
    // Extract all events (public and private)
    const events = [];
    
    // Add deadline events
    internships.forEach(internship => {
      // Add deadline event
      events.push({
        id: internship._id,
        title: `${internship.role} at ${internship.company} - Deadline`,
        date: internship.deadline,
        type: 'deadline',
        internshipId: internship._id
      });
      
      // Add all calendar events (both public and private)
      if (internship.calendarEvents && internship.calendarEvents.length > 0) {
        const allEvents = internship.calendarEvents.map(event => ({
          id: event._id,
          title: event.title,
          date: event.date,
          type: 'event',
          visibility: event.visibility,
          internshipId: internship._id
        }));
        
        events.push(...allEvents);
      }
    });
    
    res.json(events);
  } catch (error) {
    console.error('Get private calendar error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/calendar/events/:id
// @desc    Add a calendar event to an internship
// @access  Private (Admin only)
router.post('/events/:id', verifyJWT, async (req, res) => {
  try {
    const { title, date, visibility } = req.body;
    
    if (!title || !date) {
      return res.status(400).json({ message: 'Title and date are required' });
    }
    
    const internship = await Internship.findById(req.params.id);
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    
    const newEvent = {
      title,
      date,
      visibility: visibility || 'public'
    };
    
    internship.calendarEvents.push(newEvent);
    await internship.save();
    
    res.status(201).json(internship);
  } catch (error) {
    console.error('Add calendar event error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Internship not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;