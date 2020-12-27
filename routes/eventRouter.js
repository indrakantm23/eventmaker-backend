const express = require('express');
const bodyParser = require('body-parser');
const Event = require('./../model/events.model');

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
eventRouter.route('/get-an-event:eventId').get((req, res) => {
    res.json({message: 'Success'})
});

// GET ALL EVENT
eventRouter.route('/get-events').get((req, res) => {
    Event.find((err, events) => {
        if(err){ res.json({message: 'Failed to get events'}) }
        else{
            res.json({events: events})
        }
    })
})


module.exports = eventRouter;