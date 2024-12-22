const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const env = require('dotenv');
env.config();
const connectDB = require('./config/database');
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validation');
const { adminAuth } = require('./middlewares/auth');

app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await user.save();
    res.send('User added successfully');
  } catch (err) {
    res.status(400).send('ERROR: ' + err.message);
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.cookie('token', token);
    res.send('Login successful!!');
  } catch (err) {
    res.status(400).send('ERROR: ' + err.message);
  }
});

app.get('/profile', adminAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send('ERROR: ' + err.message);
  }
});

app.get('/send-connection-request', adminAuth, async (req, res) => {
  try {
    res.send('Connection sent!!');
  } catch (error) {
    res.status(400).send('ERROR: ' + error.message);
  }
});

app.get('/user', adminAuth, async (req, res) => {
  try {
    const userEmail = req.body.email;
    const user = await User.find({ email: userEmail });
    if (!user.length) {
      res.status(404).send('User not found');
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send('Something went wrong!' + error.message);
  }
});

app.get('/feed', adminAuth, async (req, res) => {
  try {
    const users = await User.find({});
    if (!users.length) {
      res.status(404).send('Users not found');
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send('Something went wrong!' + error.message);
  }
});

app.delete('/user', adminAuth, async (req, res) => {
  const userId = req.body._id;
  try {
    await User.findByIdAndDelete(userId);
    res.send('User deleted successfully!!');
  } catch (error) {
    res.status(400).send('User could not deleted!' + error.message);
  }
});

app.patch('/user/:userId', adminAuth, async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ['photoUrl', 'about', 'gender', 'age', 'skills'];
    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );
    if (!isUpdateAllowed) {
      throw new Error('Update not allowed');
    }
    if (data?.skills.length > 20) {
      throw new Error('Skills cannot be more than 20');
    }
    await User.findByIdAndUpdate(userId, data, { runValidators: true });
    res.send('User data upadated successfuly!');
  } catch (error) {
    res.status(400).send('Update Failed!' + error.message);
  }
});
connectDB()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(3000, () => {
      console.log('Server is listening on port 3000');
    });
  })
  .catch((err) => {
    console.log('Database could not be connected!', err.message);
  });
