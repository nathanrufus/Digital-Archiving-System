const express = require('express');
const router = express.Router();
const { updateUserRole } = require('../controllers/admin.controller');
const authenticate = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware');

router.patch('/users/:id/role', authenticate, allowRoles('admin'), updateUserRole);

module.exports = router;
