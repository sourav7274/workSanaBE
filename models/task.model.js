const mongoose = require('mongoose');

// Task Schema
const taskSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Task name

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project', // Refers to Project model
      required: true,
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team', // Refers to Team model
      required: true,
    },

    owners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Refers to User model (owners)
        required: true,
      },
    ],

    tags: [{ type: String }], // Array of tags

    timeToComplete: {
      type: Number,
      required: true, // Number of days to complete the task
    },

    status: {
      type: String,
      enum: ['To Do', 'In Progress', 'Blocked', 'Completed'], // Enum for task status
      default: 'To Do',
    },

    createdAt: {
      type: Date,
      default: Date.now, // Automatically set creation date
    },

    updatedAt: {
      type: Date,
      default: Date.now, // Automatically update the 'updatedAt' field
    },
  },
  { timestamps: true } // Enables createdAt and updatedAt automatically
);

// Middleware to update 'updatedAt' field before saving
taskSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Task', taskSchema);
