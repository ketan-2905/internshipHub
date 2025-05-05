const User = require('../models/User');
const bcrypt = require('bcrypt');

/**
 * Seed admin user if it doesn't exist
 */
const seedAdmin = async () => {
  try {
    // Check if admin user exists
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (!adminExists) {
      console.log('Admin user not found. Creating admin account...');
      
      // Create admin user
      const adminUser = new User({
        name: 'Ketan Gaikwad',
        email: process.env.ADMIN_EMAIL,
        password: 'ketan@D048', // Will be hashed by pre-save hook
        college: 'Dwarkadas J. Sanghvi College of Engineering',
        branch: 'Computer Science and Engineering (Data Science)',
        division: 'D1/2',
        sapId: '60009230010',
        dob: new Date('2005-05-29'),
        place: 'Bhandup',
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};

module.exports = seedAdmin;