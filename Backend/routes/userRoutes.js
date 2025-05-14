const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { signup, login } = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');

// Protected route for testing authentication
router.get('/protected', authenticate, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, you are authenticated!` });
});

// Signup route
router.post('/', signup);

// Login route
router.post('/login', login);

// Protected Update Route
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { email, ...updateData } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get User by Username
router.get('/username/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;