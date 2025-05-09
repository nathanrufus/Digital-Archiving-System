const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/log.controller');
const authenticate = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware');

// Admin-only access
router.get('/', authenticate, allowRoles('admin'), getLogs);

module.exports = router;
