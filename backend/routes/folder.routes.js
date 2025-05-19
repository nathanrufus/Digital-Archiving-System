const express = require('express');
const router = express.Router();
const {
  createFolder,
  getFolders,
  updateFolder,
  getDocumentsInFolder,
  deleteFolder
} = require('../controllers/folder.controller');

const authenticate = require('../middlewares/auth.middleware');

router.post('/', authenticate, createFolder);
router.get('/', authenticate, getFolders);
router.patch('/:id', authenticate, updateFolder);
router.get('/:id/documents', authenticate, getDocumentsInFolder);
router.delete('/:name', authenticate, deleteFolder); 


module.exports = router;
