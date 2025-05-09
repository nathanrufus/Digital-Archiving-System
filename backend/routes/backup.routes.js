const express = require('express');
const router = express.Router();
const { createBackup, restoreBackup, upload } = require('../controllers/backup.controller');
const authenticate = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware');

router.post('/', authenticate, allowRoles('admin'), createBackup);
router.post('/restore', authenticate, allowRoles('admin'), upload.single('file'), restoreBackup);

module.exports = router;
