const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { signup, login, googleAuth } = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');

// Protected route for testing authentication
router.get('/protected', authenticate, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, you are authenticated!` });
});

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Save user favorites route
router.post('/favorites', authenticate, async (req, res) => {
  try {
    const { league, club, player } = req.body;
    
    if (!league || !club || !player) {
      return res.status(400).json({ 
        message: 'League, club, and player are required' 
      });
    }

    // Update user with favorites
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        favoriteLeague: league,
        favoriteClub: club,
        favoritePlayer: player
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Favorites saved successfully',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        favoriteLeague: updatedUser.favoriteLeague,
        favoriteClub: updatedUser.favoriteClub,
        favoritePlayer: updatedUser.favoritePlayer
      }
    });
  } catch (error) {
    console.error('Error saving favorites:', error);
    res.status(500).json({ message: 'Failed to save favorites' });
  }
});

// Get user favorites route
router.get('/favorites', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('favoriteLeague favoriteClub favoritePlayer');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      favoriteLeague: user.favoriteLeague,
      favoriteClub: user.favoriteClub,
      favoritePlayer: user.favoritePlayer
    });
  } catch (error) {
    console.error('Error getting favorites:', error);
    res.status(500).json({ message: 'Failed to get favorites' });
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

router.post('/google', googleAuth);

module.exports = router;