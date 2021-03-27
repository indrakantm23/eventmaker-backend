const mongoose = require('mongoose');
const User = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    avatar: {
        type: String
    },
    bookings: {
        type: Array
    }
});

module.exports = mongoose.model('User', User);