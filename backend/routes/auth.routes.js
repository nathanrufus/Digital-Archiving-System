const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');

// Register
router.post('/register', register);

// Login
router.post('/login', login);

module.exports = router;
