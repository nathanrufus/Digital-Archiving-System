const Document = require('../models/Document');
const fs = require('fs');
const path = require('path');


const uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const { tags, description, folder ,device } = req.body;

    // Backup to disk
    const filename = `${Date.now()}-${req.file.originalname}`;
    const localPath = path.join(__dirname, '../uploads', filename);
    fs.writeFileSync(localPath, req.file.buffer); // Now buffer exists

    const doc = new Document({
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      content: req.file.buffer,
      path: `uploads/${filename}`,
      tags: tags ? tags.split(',') : [],
      description: description || '',
      folder: folder || 'uncategorized',
      device: device || '',
      uploadedBy: req.user.id,
      versionHistory: [],
    });
    

    await doc.save();
    res.status(201).json({ message: 'Uploaded to MongoDB and saved to disk', document: doc });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

// GET /documents - list with filters & search
const getDocuments = async (req, res) => {
  try {
    const { tag, folder, startDate, endDate, search, device } = req.query;
    
        const query = { uploadedBy: req.user.id };

    if (tag) query.tags = tag;
    if (folder) query.folder = folder;
    if (device) query.device = device;
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

    res.set({
      'Content-Type': doc.type,
      'Content-Disposition': `attachment; filename="${doc.name}"`,
    });

    res.send(doc.content); // send the actual file content
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving file' });
  }
};

// PATCH /documents/:id - update metadata
const updateDocument = async (req, res) => {
  try {
    const { tags, description, folder, device } = req.body
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    if (tags) doc.tags = tags.split(',');
    if (description) doc.description = description;
    if (folder) doc.folder = folder;
    if (device) doc.device = device;


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
// GET /documents/download/:id
const downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const filePath = path.join(__dirname, '..', doc.path);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on disk' });
    }

    res.download(filePath, doc.name); // triggers browser download
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ message: 'Failed to download document' });
  }
};


module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  downloadDocument
};


