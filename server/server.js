// server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const commentRoutes = require('./routes/comments');
const youtubeRoutes = require('./routes/youtube');  // import YouTube routes
const historyRoutes = require('./routes/history');  // import history routes
const path = require('path');

const app = express();

// CORS setup
const cors = require('cors');
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
app.use(cors({ origin: CLIENT_URL }));
app.options('*', cors());

// Connect to database
connectDB();

// Middleware
app.use(express.json());

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve React client build static files and index.html only in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/youtube', youtubeRoutes);  // mount YouTube API endpoints
app.use('/api/history', historyRoutes);  // mount history API endpoints

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));