const mongoose = require('mongoose');
const validator = require('validator');

const userShema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate: (value) => {
        if (!validator.isStrongPassword(value)) {
          throw new Error('Weak Password');
        }
      },
    },
    age: {
      type: Number,
      min: 16,
    },
    gender: {
      type: String,
      validate: (value) => {
        if (!['male', 'female', 'others'].includes(value)) {
          throw new Error('Gender data is not valid');
        }
      },
    },
    skills: {
      type: [String],
    },
    about: {
      type: String,
      default: 'This is default about text',
    },
    photoUrl: {
      type: String,
      validate: (value) => {
        if (!validator.isURL(value)) {
          throw new Error('Invalid photo URL');
        }
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userShema);

module.exports = User;
