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

// @route   PUT /api/comments/:id
// @desc    Update a comment
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { content } = req.body;
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    comment.content = content;
    await comment.save();
    await comment.populate('author', 'name');
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await comment.remove();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;