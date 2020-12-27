const mongoose = require('mongoose');
const Event = new mongoose.Schema({
    eventName: {
        type: String,
    },
    eventType: {
        type: String
    },
    eventStartDate: {
        type: String
    },
    eventEndDate: {
        type: String
    },
    eventStartTime: {
        type: String
    },
    eventEndTime: {
        type: String
    },
    eventBanner: {
        type: String
    },
    description: {
        type: String
    }
});

module.exports = mongoose.model('Event', Event);