const express = require('express');
const router = express.Router();

const { uploadDocument } = require('../controllers/document.controller');
const authenticate = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// POST /api/documents/upload
router.post(
  '/upload',
  authenticate,
  upload.single('file'),
  uploadDocument
);

module.exports = router;
