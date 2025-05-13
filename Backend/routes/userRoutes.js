const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticate = require('../middlewares/authenticate');

// Signup Route
router.post('/', async (req, res) => {
  try {
    const { username, email, password, favorites } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const user = new User({
      username,
      email,
      password,
      favorites
    });

    const savedUser = await user.save();
    res.status(201).json({ 
      id: savedUser._id, 
      username: savedUser.username 
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        favorites: user.favorites
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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