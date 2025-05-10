const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/', async (req, res) => {
  try {
    const { username, email, password, favorites } = req.body;

    const user = new User({
      username,
      email,
      password,
      favorites
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
