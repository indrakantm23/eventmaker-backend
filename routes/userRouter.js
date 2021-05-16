const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('./../model/users.model');

const userRouter = express.Router();
userRouter.use(bodyParser.json());

require('./../Authentication/passport')(passport);

// REGISTER USER
userRouter.route('/register').post((req, res) => {
    let email = req.body.email;
    User.findOne({email, email}).then(user => {
        if(user){
            res.status(400).json({user: 'User already exist'});
        }else{
            let user = new User(req.body);
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(user.password, salt, (err, hash) => {
                    if(err) throw err;
                    user.password = hash;
                    user.save()
                    .then(user => {
                        res.status(200).json({user: 'User created successfully'});
                    })
                    .catch(err => {
                        res.status(400).send('Failed creating user');
                    });
                });
            });
        }
    });
});


// LOGIN
userRouter.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, userData, info) => {
        if(err){ return next(err) }
        if(!userData){
            // console.log(info);
           return res.json({info, loggedIn: false})
        }
        // console.log('Logged in');
        let user = userData;
        delete user.password;
        return res.status(200).json({user: {id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, avatar: user.avatar}});
    })(req, res, next);
});

// GET ALL USER
userRouter.route('/get-users').get((req, res) => {
    User.find((err, users) => {
        if(err){ res.json({message: 'Failed to get users'}) }
        else{
            res.json({users: users})
        }
    });
});

// GET ALL BOOKINGS
userRouter.route('/get-bookings/:userId').get((req, res) => {
    User.findById(req.params.userId).then((event) => {
        res.json({bookings: event.bookings});
    });
});



module.exports = userRouter;