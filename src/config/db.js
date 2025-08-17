const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      connectTimeoutMS: 10000, // Timeout for initial connection (10 seconds)
      serverSelectionTimeoutMS: 5000, // Timeout for selecting the server (5 seconds)
      
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
