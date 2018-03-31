const express = require('express');
const app = express();

// Server utils
require('dotenv').config();
const compression = require('compression');
const bodyParser = require("body-parser");
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const expressValidator = require('express-validator');
const flash = require('connect-flash');

// Authentication utils
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// DB utils
const mongoose = require('mongoose');
const Legend = require('./models/user');
const MongoStore = require('connect-mongo')(session);

// Routes 
const leaderboards = require('./routes/leaderboards');
const champions = require('./routes/champions');
const summoner = require('./routes/summoner');
const statistics = require('./routes/statistics');
const contact = require('./routes/contact');
const logout = require('./routes/logout');
const profile = require('./routes/profile');
const login = require('./routes/login');
const register = require('./routes/register');
const post = require('./routes/post');
const legendSearch = require('./routes/legendSearch');
const friendRequests = require('./routes/friendRequests');
const index = require('./routes/index');
const items = require('./routes/items');
const dbHelper = require('./routes/dbUtils');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_ADMIN);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB connection error:'));
db.once('open', () => {
    console.log("Conneted to DB");
});

// Logs
const accessLogStream = fs.createWriteStream(path.join(__dirname+'/logs', 'access.log'), {flags: 'a'});

// Compress files
// Serve Static files
// Parse incoming requests
// Use sessions
// Authentication
// Flash messages
// Routes
app
.use(compression())
.use('/public', express.static(path.join(__dirname, 'public')))
.use('/assets', express.static(path.join(__dirname, 'assets')))
.use(bodyParser.json())
.use(bodyParser.urlencoded({ extended: false }))
.use(expressValidator())
.use(session({
    secret: 'EFK9AqwLKR932',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}))
.use(passport.initialize())
.use(passport.session())
.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})
.use(flash())
.use(morgan('combined', {stream: accessLogStream}))
.use(function(req, res, next){
    res.locals.messages = require('express-messages')(req, res);
    next();
})
.use('/leaderboards', leaderboards)
.use('/champions', champions)
.use('/summoner', summoner)
.use('/profile', profile)
.use('/statistics', statistics)
.use('/contact', contact)
.use('/register', register)
.use('/login', login)
.use('/logout', logout)
.use('/post', post)
.use('/users', legendSearch)
.use('/users', friendRequests)
.use('/items', items)
.use('/', index)
.use('/', dbHelper)

passport.use(new LocalStrategy({
    usernameField: 'email'
    },
    function(email, password, done) {
        Legend.authenticate(email.toLowerCase(), password, function (err, user) {
            if(err || !user) return done(null, false);
            done(null, user);
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

// Update Session
passport.deserializeUser((user, done) => {
    Legend.findById(user._id).then(updatedUser => {
        done(null, updatedUser);
    });
});

// Setup view engine
app.set('view engine', 'pug');

app.get('*', (req, res) => {
    res.render('404', {
        title: 'Page Not Found | Legends'
    });
});

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

process.on('uncaughtException', err => {
    console.log(`Caught exception: ${err}\n`);
});

app.listen('1337', () => {
    console.log(`Listening on port 1337`);
});