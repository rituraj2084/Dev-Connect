const express = require('express');

const app = express();
const connectDB = require('./config/database');
const User = require('./models/user');

app.use(express.json());

app.post('/signup', async (req, res) => {
  const user = new User(req.body);
  console.log(user);
  try {
    await user.save();
    res.send('User added successfully');
  } catch (err) {
    res.status(400).send('Error while saving the data' + err.message);
  }
});

app.get('/user', async (req, res) => {
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

app.get('/feed', async (req, res) => {
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

app.delete('/user', async (req, res) => {
  const userId = req.body._id;
  try {
    await User.findByIdAndDelete(userId);
    res.send('User deleted successfully!!');
  } catch (error) {
    res.status(400).send('User could not deleted!' + error.message);
  }
});

app.patch('/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ['photoUrl', 'about', 'gender', 'age', 'skills'];
    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );
    console.log(isUpdateAllowed);
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
    console.log('Database could not be connected!');
    console.error(err);
  });
