const validator = require('validator');

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error('Name is not valid!');
  } else if (!validator.isEmail(email)) {
    throw new Error('Please enter a valid email!');
  } else if (!validator.isStrongPassword(password)) {
    throw new Error('Please enter a strong password!');
  }
};

const validateEditData = (req) => {
  const allowedEditFields = [
    'firstName',
    'lastName',
    'email',
    'about',
    'photoUrl',
    'skills',
    'gender',
    'age',
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};

const validatePassword = async (req) => {
  const { password } = req.body;
  const isPasswordValid = validator.isStrongPassword(password);
  return isPasswordValid;
};
module.exports = { validateSignUpData, validateEditData, validatePassword };
