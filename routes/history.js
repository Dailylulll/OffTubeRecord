const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const VideoHistory = require('../models/VideoHistory');
const Comment = require('../models/Comment');
const axios = require('axios');
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Record a video view
router.post('/video', protect, async (req, res) => {
  const { videoId } = req.body;
  try {
    // fetch video details from YouTube API
    const { data } = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet',
        id: videoId,
        key: YOUTUBE_API_KEY
      }
    });
    const item = data.items[0];
    const title = item.snippet.title;
    const thumbnail = item.snippet.thumbnails.medium.url;
    const entry = new VideoHistory({ user: req.user._id, videoId, title, thumbnail });
    const saved = await entry.save();
    res.json(saved);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get video history for user
router.get('/videos', protect, async (req, res) => {
  try {
    const history = await VideoHistory.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get comment history for user
router.get('/comments', protect, async (req, res) => {
  try {
    // fetch user comments
    const comments = await Comment.find({ author: req.user._id }).sort({ createdAt: -1 });
    // get unique video IDs
    const videoIds = [...new Set(comments.map(c => c.videoId))];
    // fetch video details
    const { data } = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: { part: 'snippet', id: videoIds.join(','), key: YOUTUBE_API_KEY }
    });
    // map id to title
    const titleMap = {};
    data.items.forEach(item => { titleMap[item.id] = item.snippet.title; });
    // enrich comments with title
    const enriched = comments.map(c => ({
      _id: c._id,
      content: c.content,
      videoId: c.videoId,
      title: titleMap[c.videoId] || '',
      createdAt: c.createdAt
    }));
    res.json(enriched);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;