const mongoose = require('mongoose');
const env = require('dotenv');
env.config();
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URL);
};

module.exports = connectDB;
