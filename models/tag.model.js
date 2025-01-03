const mongoose = require('mongoose');

// Tag Schema
const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Tag name is required
    unique: true, // Tag names must be unique
  },
});

// Export the Tag model
module.exports = mongoose.model('Tag', tagSchema);
