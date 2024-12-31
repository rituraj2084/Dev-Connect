const express = require('express');
const { adminAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const { default: mongoose } = require('mongoose');
const requestRouter = express.Router();

requestRouter.post(
  '/request/:status/:toUserId',
  adminAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ['interested', 'ignored'];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .send({ message: 'Invalid status type: ' + status });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res.status(400).send({ message: `Request already sent!` });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).send({ message: `User not found!` });
      }
      const data = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await data.save();

      res.json({
        message: `${req.user.firstName} ${status} ${toUser.firstName}`,
        data,
      });
    } catch (error) {
      res.status(400).send('ERROR: ' + error.message);
    }
  }
);

requestRouter.post(
  '/request/review/:status/:requestId',
  adminAuth,
  async (req, res) => {
    try {
      const { requestId, status } = req.params;
      const loggedInUser = req.user;
      const allowedStatus = ['accepted', 'rejected'];
      // console.log(loggedInUser);
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: 'Inavalid status type: ' + status });
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: 'interested',
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: 'Connection request not found!' });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: 'Connection request ' + status, data });
    } catch (error) {
      res.status(400).send('ERROR: ' + error.message);
    }
  }
);

module.exports = requestRouter;
