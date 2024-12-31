const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const env = require('dotenv');
env.config();
const connectDB = require('./config/database');

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

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
