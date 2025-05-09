const Document = require('../models/Document');

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { tags, description, folder } = req.body;

    const doc = new Document({
      name: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      type: req.file.mimetype,
      tags: tags ? tags.split(',') : [],
      description,
      folder,
      uploadedBy: req.user.id,
      versionHistory: [],
    });

    await doc.save();
    res.status(201).json({ message: 'Document uploaded successfully', document: doc });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Upload failed' });
  }
};

module.exports = { uploadDocument };
