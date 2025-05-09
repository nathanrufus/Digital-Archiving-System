const mongoose = require('mongoose');

const backupSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  path: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  errorMessage: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('Backup', backupSchema);
