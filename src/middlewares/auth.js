const jwt = require('jsonwebtoken');
const User = require('../models/user');
const env = require('dotenv');
env.config();
const adminAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error('Invalid token');
    }
    const decodedMessage = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error('User does not exist');
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send('Unauthorized user! ' + error.message);
  }
};

module.exports = {
  adminAuth,
};
