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
        return res.status(400).send({ message: `Invalid request!` });
      }

      if (new mongoose.Types.ObjectId(toUserId).equals(fromUserId)) {
        return res
          .status(400)
          .send({ message: `Can't send connection request to self!` });
      }
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).send({ message: `User not found!` });
      }
      const data = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await data.save();

      res.json({
        message: `Connection request has been sent successfully!`,
        data,
      });
    } catch (error) {
      res.status(400).send('ERROR: ' + error.message);
    }
  }
);

module.exports = requestRouter;
