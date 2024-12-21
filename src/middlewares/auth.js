const adminAuth = (req, res, next) => {
  const token = 'xyz';
  const isAuthenticated = token === 'xyzad';
  if (!isAuthenticated) {
    res.status(401).send('Not authenticated!');
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
};
