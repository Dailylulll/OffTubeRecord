const mongoose = require('mongoose');

// set strictQuery to suppress deprecation warning
mongoose.set('strictQuery', true);

const connectDB = async () => {
  // ensure MONGO_URI is defined
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('Error: MONGO_URI is not defined in environment variables');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;