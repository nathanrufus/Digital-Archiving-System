const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number },
  type: { type: String },
  tags: [{ type: String }],
  description: { type: String },
  folder: { type: String }, // optional folder label
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  versionHistory: [{
    path: String,
    uploadedAt: Date,
  }],
}, { timestamps: true });
documentSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Document', documentSchema);
