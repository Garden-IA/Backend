const mongoose = require('mongoose');
const logger = require('./logger');
require('dotenv').config();

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error(`MongoDB connection error: ${err}`);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
