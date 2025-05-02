// server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const commentRoutes = require('./routes/comments');
const youtubeRoutes = require('./routes/youtube');  // import YouTube routes
const path = require('path');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve React client build static files from correct path
app.use(express.static(path.join(__dirname, 'client/build')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/youtube', youtubeRoutes);  // mount YouTube API endpoints

// Always return index.html for non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));