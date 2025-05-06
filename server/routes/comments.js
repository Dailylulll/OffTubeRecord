const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Comment = require('../models/Comment');

// @route   GET /api/comments/:videoId
// @desc    Get comments for a video
// @access  Public
router.get('/:videoId', async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId })
      .sort({ createdAt: -1 })
      .populate('author', 'name');
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/comments
// @desc    Post a new comment
// @access  Private
router.post('/', protect, async (req, res) => {
  const { content, videoId } = req.body;
  try {
    const comment = new Comment({ content, videoId, author: req.user._id });
    const saved = await comment.save();
    await saved.populate('author', 'name');
    res.status(201).json(saved);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;