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
app.use('/api/documents', require('./routes/document.routes'));
app.use('/api/folders', require('./routes/folder.routes'));
app.use('/api/backup', require('./routes/backup.routes'));
app.use('/api/logs', require('./routes/log.routes'));


const authenticate = require('./middlewares/auth.middleware');
const allowRoles = require('./middlewares/role.middleware');


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
