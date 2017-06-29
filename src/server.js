const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const config = require('./config');
const jwt = require('jsonwebtoken');
let User = require('../models/user');
const apiRoutes = express.Router();

let app = express();

const PORTHttp = 8000;

mongoose.connect(config.database); //connect to database
app.set('secret', config.secret); //secret


//use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//morgan to log requests in the console
app.use(morgan('dev'));

apiRoutes.get('/', function(req,res) {
    "use strict";
    res.header('Access-Control-Allow-Origin', '*');
    res.send('<h1>Welcome to my API!</h1>');
});

//get ALL users
apiRoutes.get('/users', function(req,res) {
    "use strict";
    User.find({}, function (err, users) {
        res.header('Access-Control-Allow-Origin', '*');
        res.json(users);
    });
});

//register as new user

apiRoutes.post('/register', function(req,res) {
    "use strict";
    res.header('Access-Control-Allow-Origin', '*');

    User.findOne({
        name: req.body.name
    }, function(err, user) {
        if (user) {
            res.status(404).json({success: false, message: 'Please find another username'});
        } else {
            let newUser = new User({
                name: req.body.name,
                password: req.body.password,
                mobile: req.body.mobile,
                mail: req.body.mail,
                title: req.body.title
            });

            newUser.save(function(err) {
                if (err) throw err;

                res.json({success: true});
            });
        }
    });

});

//login

apiRoutes.post('/login', function(req,res) {
    "use strict";
    res.header('Access-Control-Allow-Origin', '*');

    User.findOne({
        name: req.body.name
    }, function(err,user) {

        if(err) throw err;

        if(!user) {
            res.status(404).json({success: false, message: 'User not found.'});
        } else {

            if(user.password !== req.body.password) {

                res.status(404).json({success: false, message: 'Wrong password'});

            } else {

                let token = jwt.sign(user, app.get('secret'), {
                    expiresIn: '10h'
                });

                res.json({
                    success: true,
                    message: 'You have logged in',
                    token: token
                });
            }
        }
    })
});

//delete user
apiRoutes.post('/delete', function(req,res) {
    "use strict";
    res.header('Access-Control-Allow-Origin', '*');

    User.findOneAndRemove({
        name: req.body.name
    }, function(err) {
        if(err) throw err;

        res.json({success:true, message: 'Deleted!'});
    })
});


app.use('/api', apiRoutes);

//log in with token
const httpServer = http.createServer(app);

httpServer.listen(PORTHttp);

console.log('Http happens at http://localhost:' + PORTHttp);
