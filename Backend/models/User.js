const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address'
    ]
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters long']
  },
  favoriteLeague: {
    type: String,
    default: null
  },
  favoriteClub: {
    type: String,
    default: null
  },
  favoritePlayer: {
    type: String,
    default: null
  }
}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);

