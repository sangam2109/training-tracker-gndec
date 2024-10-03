const mongoose = require('mongoose');

// Define the mentor schema
const mentorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware to update 'updatedAt' on edit
mentorSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Create and export the Mentor model
const Mentor = mongoose.model('Mentor', mentorSchema);
module.exports = Mentor;
