const mongoose = require('mongoose');

// Team Schema
const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Team name is required
    unique: true, // Team names must be unique
  },
  description: {
    type: String, // Optional description for the team
  },
});

// Export the Team model
module.exports = mongoose.model('Team', teamSchema);
