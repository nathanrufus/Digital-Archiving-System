const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const { 
    uploadDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument 
  } = require('../controllers/document.controller');

// POST /api/documents/upload
router.post(
  '/upload',
  authenticate,
  upload.single('file'),
  uploadDocument
);
  
  // GET /documents - list, filter, search
  router.get('/', authenticate, getDocuments);
  
  // GET /documents/:id - download/view
  router.get('/:id', authenticate, getDocumentById);
  
  // PATCH /documents/:id - update metadata
  router.patch('/:id', authenticate, updateDocument);
  
  // DELETE /documents/:id - soft delete
  router.delete('/:id', authenticate, deleteDocument);

module.exports = router;
