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
        if (!['Male', 'Female', 'Others'].includes(value)) {
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
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      validate: (value) => {
        if (!validator.isURL(value)) {
          throw new Error('Invalid photo URL');
        }
      },
    },
  },
  { timestamps: true }
);
userShema.index({ firstName: 1, lastName: 1 });
const User = mongoose.model('User', userShema);

module.exports = User;
