const express = require('express');
const { adminAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const userRouter = express.Router();

const USER_SAFE_DATA = 'firstName lastName photoUrl age gender about skills';

userRouter.get('/user/requests/received', adminAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate('fromUserId', USER_SAFE_DATA);

    res.json({
      message: 'Data fetched successfully!',
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).send('ERROR: ' + error.message);
  }
});

userRouter.get('/user/connections', adminAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: 'accepted' },
        { fromUserId: loggedInUser._id, status: 'accepted' },
      ],
    })
      .populate('fromUserId', USER_SAFE_DATA)
      .populate('toUserId', USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({
      message: 'Data fetched successfully!',
      data,
    });
  } catch (error) {
    res.status(400).send('ERROR: ' + error.message);
  }
});
module.exports = userRouter;
