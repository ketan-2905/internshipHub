const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./src/routes/auth');
const internshipRoutes = require('./src/routes/internship');
const bookmarkRoutes = require('./src/routes/bookmark');
const calendarRoutes = require('./src/routes/calendar');
const uploadRoutes = require('./src/routes/upload');
const userRoutes = require('./src/routes/user');

// Import admin setup utility
const seedAdmin = require('./src/utils/seedAdmin');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Set up static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/user', userRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Seed admin user
    seedAdmin();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});