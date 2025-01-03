const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // User's name is required
  },
  email: {
    type: String,
    required: true, // Email is required
    unique: true, // Email must be unique
  },
  password:{
    type: String,
    required: true
  }
});

// Export the User model
module.exports = mongoose.model('User', userSchema);
