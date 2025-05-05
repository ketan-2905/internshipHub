const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  requirements: { type: String, required: true },
  mode: { type: String, required: true },
  stipend: { type: String, required: true },
  deadline: { type: Date, required: true },
  formLink: { type: String, required: true },
  calendarEvents: [
    {
      title: { type: String, required: true },
      date: { type: Date, required: true },
      visibility: { type: String, enum: ['public', 'private'], default: 'public' },
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Internship', internshipSchema);