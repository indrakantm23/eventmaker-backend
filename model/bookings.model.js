const mongoose = require('mongoose');
const Bookings = mongoose.Schema({
    userId: {
        type: String
    },
    eventId: {
        type: String
    },
    bookedOn: {
        type: String
    },
    bookingDetails: {
        type: Array
    }
});

module.exports = mongoose.model('Bookings', Bookings);