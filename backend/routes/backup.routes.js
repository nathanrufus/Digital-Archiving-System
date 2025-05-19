const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const controller = require('../controllers/backup.controller');

// Backup operations
router.post('/', auth, controller.createBackup);                    // POST /api/backup
router.post('/cancel', auth, controller.cancelBackupRequest);       // POST /api/backup/cancel
router.get('/info', auth, controller.restoreBackup);                // GET  /api/backup/info
router.get('/logs', auth, controller.getBackupLogs);                // GET  /api/backup/logs

// Restore operations
router.post('/restore', auth, controller.upload.single('file'), controller.restoreBackup); // POST /api/backup/restore
router.get('/restore/info', auth, controller.getRestoreInfo);                              // GET  /api/backup/restore/info

// Folder/category management
router.patch('/folders/:oldName', auth, controller.renameFolder);       // PATCH /api/backup/folders/:oldName
router.delete('/folders/:name', auth, controller.deleteFolder);         // DELETE /api/backup/folders/:name
router.patch('/categories/:oldTag', auth, controller.renameCategory);   // PATCH /api/backup/categories/:oldTag
router.delete('/categories/:tag', auth, controller.deleteCategory);     // DELETE /api/backup/categories/:tag

module.exports = router;
