const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const Internship = require('../models/Internship');
const { verifyJWT, requireAdmin } = require('../middleware/auth');

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['.xlsx', '.xls', '.csv'];
  const extname = path.extname(file.originalname).toLowerCase();
  
  if (allowedFileTypes.includes(extname)) {
    cb(null, true);
  } else {
    cb(new Error('Only Excel and CSV files are allowed'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @route   POST /api/upload/excel
// @desc    Upload internships from Excel file
// @access  Admin only
router.post('/excel', verifyJWT, requireAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    // Read Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    if (data.length === 0) {
      return res.status(400).json({ message: 'Excel file is empty' });
    }

    // Process and save internships
    const internships = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      try {
        // Validate required fields
        if (!row.company || !row.role || !row.requirements || !row.mode || 
            !row.stipend || !row.deadline || !row.formLink) {
          errors.push(`Row ${i + 1}: Missing required fields`);
          continue;
        }

        // Create internship object
        const internship = new Internship({
          company: row.company,
          role: row.role,
          requirements: row.requirements,
          mode: row.mode,
          stipend: row.stipend,
          deadline: new Date(row.deadline),
          formLink: row.formLink,
          calendarEvents: []
        });

        // Add calendar events if provided
        if (row.eventTitle && row.eventDate) {
          internship.calendarEvents.push({
            title: row.eventTitle,
            date: new Date(row.eventDate),
            visibility: row.eventVisibility || 'public'
          });
        }

        await internship.save();
        internships.push(internship);
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error.message}`);
      }
    }

    res.status(201).json({ 
      message: `Successfully imported ${internships.length} internships`,
      errors: errors.length > 0 ? errors : undefined,
      totalRows: data.length,
      successCount: internships.length,
      errorCount: errors.length
    });
  } catch (error) {
    console.error('Excel upload error:', error);
    res.status(500).json({ message: 'Server error during file upload' });
  }
});

module.exports = router;