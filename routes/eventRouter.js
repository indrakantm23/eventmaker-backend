const express = require('express');
const bodyParser = require('body-parser');
const Event = require('./../model/events.model');
const mailer = require('./../mailer/sendMail');

const eventRouter = express.Router();
eventRouter.use(bodyParser.json());



// POST AN EVENT
eventRouter.route('/post-an-event').post((req, res) => {
    let event = new Event(req.body);
    event.save()
         .then(event => {
             res.json({message: 'Event created successfully'})
         })
         .catch(err => {
             res.json({message: 'Failed to create event', err})
         });
});


// GET AN EVENT
eventRouter.route('/get-an-event/:eventId').get((req, res) => {
    Event.findById(req.params.eventId).then((event) => {
        res.json({event});
    });
});

// GET ALL EVENT
eventRouter.route('/get-events').get((req, res) => {
    Event.find((err, events) => {
        if(err){ res.json({message: 'Failed to get events'}) }
        else{
            res.json({events: events})
        }
    });
});

// GET EVENTS BY CATEGORY
eventRouter.route('/category/:category').get((req, res)=> {
    Event.find((err, events) => {
        res.json({events})
    });
});

// MAIL EVENT TICKET
eventRouter.route('/confirm-booking').post((req, res) => {
    mailer.sendOnboardingMail(req.body);
    res.json({message: 'Email booked successfully, Ticket has been sent to your email address'})
});


// SEARCH EVENTS
eventRouter.route('/search/:search_key').get((req, res) => {
    let key = new RegExp(req.params.search_key, 'i');
    Event.find((err, events) => {
        if(err){
            console.log(err);
        }else{
            let arr = events.filter(a => {return a.eventName.match(key)});
            let data = arr.map(a => { return {id: a._id, eventName: a.eventName, file: a.banner, eventMode: a.eventMode, startDate: a.startDate, endDate: a.endDate, city: a.city, state: a.state, country: a.country, entryMode: a.entryMode} })
            res.json({data});
        }
    });
});



module.exports = eventRouter;