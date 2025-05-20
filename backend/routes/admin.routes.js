const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole } = require('../controllers/admin.controller');
const authenticate = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware');


router.get('/users', authenticate , getAllUsers);
router.patch('/users/:id/role', authenticate, updateUserRole);

module.exports = router;
