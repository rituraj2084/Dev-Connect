const express = require('express');
const { adminAuth } = require('../middlewares/auth');
const requestRouter = express.Router();

requestRouter.get('/send-connection-request', adminAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user.firstName + ' has sent connection request!!');
  } catch (error) {
    res.status(400).send('ERROR: ' + error.message);
  }
});

module.exports = requestRouter;
