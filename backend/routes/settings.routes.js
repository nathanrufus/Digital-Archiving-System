const express = require('express');
const router = express.Router();
const {
  updateSettings,
  getSettings,
  getSystemStatus
} = require('../controllers/settings.controller');

const authenticate = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware');

router.get('/', authenticate,  getSettings);
router.patch('/', authenticate,  updateSettings);
router.get('/status', authenticate,  getSystemStatus);

module.exports = router;
