// app.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));

// Sample protected route
const authenticate = require('./middlewares/auth.middleware');
const allowRoles = require('./middlewares/role.middleware');

app.get('/api/admin-only', authenticate, allowRoles('admin'), (req, res) => {
  res.send('Welcome, admin user!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
