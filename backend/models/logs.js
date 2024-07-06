const mongoose = require('mongoose');

const logEntrySchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    user: {
        type: String,
        required: true,
    },
    logMessage: {
        type: String,
        required: true
    }
});

// Middleware to ensure only the latest 200 entries are kept
logEntrySchema.pre('save', async function (next) {
    try {
        const count = await mongoose.models.LogEntry.countDocuments();
        if (count >= 200) {
            // Find and delete the oldest entry
            const oldestEntry = await mongoose.models.LogEntry.findOne().sort({ timestamp: 1 });

            if (oldestEntry) {
                await oldestEntry.deleteOne();
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});

const LogEntry = mongoose.model('LogEntry', logEntrySchema);

module.exports = LogEntry;
