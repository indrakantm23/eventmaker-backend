const mongoose = require('mongoose');
const Event = new mongoose.Schema({
    eventName: {
        type: String,
    },
    eventMode: {
        type: String
    },
    onlineURL: {
        type: String
    },
    startDate: {
        type: String
    },
    endDate: {
        type: String
    },
    startTime: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    full_address: {
        type: String
    },
    endTime: {
        type: String
    },
    banner: {
        type: String
    },
    description: {
        type: String
    },
    entryMode: {
        type: String
    },
    avlSeats: {
        type: String
    },
    currency: {
        type: String
    },
    ticketCategory: {
        type: Array
    },
    evtLat: {
        type: Number
    },
    evtLng: {
        type: Number
    },
    organiser: {
        type: Object
    },
    posted_on: {
        type: String
    }
});

module.exports = mongoose.model('Event', Event);