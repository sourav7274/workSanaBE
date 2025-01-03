const mongoose = require('mongoose');

// Project Schema
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Project name is required
    unique: true, // Project names must be unique
  },
  description: {
    type: String, // Optional field for project details
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set creation date
  },
});

// Export the Project model
module.exports = mongoose.model('Project', projectSchema);
