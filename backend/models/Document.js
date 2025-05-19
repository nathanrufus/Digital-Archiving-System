const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: String,
  type: String,
  size: Number,
  content: Buffer, // <== store file here
  tags: {
    type: [String],
    default: [], // prevent undefined errors
  },
  device: {
    type: String,
    enum: ['mobile', 'tablet', 'desktop'],
    default: '',
  }  ,
  description: String,
  folder: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  versionHistory: [Object],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', documentSchema);
