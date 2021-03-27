const express = require('express');
const bodyParser = require('body-parser');
const Bookings = require('./../model/bookings.model');

const bookingRouter = express.Router();
bookingRouter.use(bodyParser.json());


// GET ALL BOOKINGS
bookingRouter.route('/get-bookings/:userId').get((req, res) => {
    Bookings.find((err, data) => {
        if(err){ res.json({message: 'Failed to get events'}) }
        else{
            let bookingData = data.filter(el => el.userId == req.params.userId);
            res.json({bookingData})
        }
    });
});

// SAVE A BOOKING
bookingRouter.route('/save-a-booking').post((req, res) => {
    let booking = new Bookings(req.body);
    booking.save()
         .then(data => {
             res.json({message: 'Event booked successfully'})
         })
         .catch(err => {
             res.json({message: 'Failed to book event', err})
         });
});


module.exports = bookingRouter;