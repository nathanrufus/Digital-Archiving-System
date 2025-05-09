const express = require('express');
const router = express.Router();
const {
  updateSettings,
  getSettings,
  getSystemStatus
} = require('../controllers/settings.controller');

const authenticate = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware');

router.get('/', authenticate, allowRoles('admin'), getSettings);
router.patch('/', authenticate, allowRoles('admin'), updateSettings);
router.get('/status', authenticate, allowRoles('admin'), getSystemStatus);

module.exports = router;
