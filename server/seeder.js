const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const VideoHistory = require('./models/VideoHistory');
const Comment = require('./models/Comment');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Seed data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await VideoHistory.deleteMany();
    await Comment.deleteMany();

    // Create test user
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    // Create test video history
    const video = await VideoHistory.create({
      user: user._id,
      videoId: 'testVideoId',
      title: 'Test Video',
      thumbnail: 'http://example.com/thumbnail.jpg'
    });

    // Create test comment
    const comment = await Comment.create({
      content: 'This is a test comment',
      author: user._id,
      videoId: 'testVideoId'
    });

    console.log('Seed Data Imported');
    console.log({ user, video, comment });
    process.exit();
  } catch (error) {
    console.error(`Data import error: ${error}`);
    process.exit(1);
  }
};

// Execute
connectDB().then(importData);
