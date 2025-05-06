const express = require('express');
const axios = require('axios');
const router = express.Router();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const testVideos = process.env.testVideos === 'true';

const sampleVideos = [
  { id: 'dQw4w9WgXcQ', title: 'Sample Video 1', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg' },
  { id: 'l482T0yNkeo', title: 'Sample Video 2', thumbnail: 'https://img.youtube.com/vi/l482T0yNkeo/0.jpg' },
  { id: '3JZ_D3ELwOQ', title: 'Sample Video 3', thumbnail: 'https://img.youtube.com/vi/3JZ_D3ELwOQ/0.jpg' }
];

// Get trending videos
router.get('/trending', async (req, res) => {
  if (testVideos) return res.json(sampleVideos);
  try {
    const { data } = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet',
        chart: 'mostPopular',
        regionCode: 'US',
        maxResults: 12,
        key: YOUTUBE_API_KEY
      }
    });
    const videos = data.items.map(item => ({
      id: item.id,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url
    }));
    res.json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch trending videos' });
  }
});

// Search for videos
router.get('/search', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: 'Missing query parameter' });
  if (testVideos) return res.json(sampleVideos);
  try {
    const { data } = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q,
        maxResults: 12,
        key: YOUTUBE_API_KEY
      }
    });
    const videos = data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url
    }));
    res.json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to search videos' });
  }
});

module.exports = router;
