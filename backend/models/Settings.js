const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  allowedFileTypes: {
    type: [String],
    default: ['application/pdf', 'image/jpeg', 'image/png'],
  },
  maxFileSizeMB: {
    type: Number,
    default: 10, 
  },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
