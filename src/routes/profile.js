const express = require('express');
const profileRouter = express.Router();
const { adminAuth } = require('../middlewares/auth');
const { validateEditData } = require('../utils/validation');

profileRouter.get('/profile/view', adminAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send('ERROR: ' + err.message);
  }
});

profileRouter.patch('/profile/edit', adminAuth, async (req, res) => {
  try {
    if (!validateEditData(req)) {
      throw new Error('Invalid edit request!!');
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, Your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send('ERROR: ' + err.message);
  }
});

module.exports = profileRouter;
