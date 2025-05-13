const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Simple password check
    if (user.password !== password) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authenticated' });
  }
};

module.exports = authenticate; 