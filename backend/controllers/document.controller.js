const Document = require('../models/Document');
const fs = require('fs');
const path = require('path');


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

// GET /documents - list with filters & search
const getDocuments = async (req, res) => {
  try {
    const { tag, folder, startDate, endDate, search } = req.query;
    const query = { uploadedBy: req.user.id };

    if (tag) query.tags = tag;
    if (folder) query.folder = folder;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (search) {
        query.$text = { $search: search };
      }      

    const docs = await Document.find(query).sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve documents' });
  }
};

// GET /documents/:id - view/download
const getDocumentById = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const filePath = path.resolve(doc.path);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found on server' });

    res.download(filePath, doc.name); // triggers download
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving file' });
  }
};

// PATCH /documents/:id - update metadata
const updateDocument = async (req, res) => {
  try {
    const { tags, description, folder } = req.body;

    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    if (tags) doc.tags = tags.split(',');
    if (description) doc.description = description;
    if (folder) doc.folder = folder;

    await doc.save();
    res.json({ message: 'Document updated', document: doc });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update document' });
  }
};

// DELETE /documents/:id - soft delete
const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    doc.folder = 'Trash'; // soft delete
    await doc.save();

    res.json({ message: 'Document moved to trash' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete document' });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
};


