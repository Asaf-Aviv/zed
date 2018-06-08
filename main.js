require('dotenv').config();
const debug            = require('debug')('zed');
const express          = require('express');
const app              = express();
const server           = require('http').Server(app);
// Socket.io
global.io              = require('socket.io')(server);
require('./io');
// Server utils
const compression      = require('compression');
const cookieParser     = require('cookie-parser');
const _                = require('lodash');
const bodyParser       = require("body-parser");
const moment           = require('moment');
const momentDuration   = require("moment-duration-format")(moment);
const morgan           = require('morgan');
const rp               = require('request-promise');
const fs               = require('fs');
const bluebird         = require('bluebird');
const path             = require('path');
const expressValidator = require('express-validator');
const flash            = require('connect-flash');
const championIds      = require('./assets/data/champions/championIds');
const runesReforged    = require('./assets/league/data/en_US/runesReforged.json')
const runePaths        = require('./assets/league/data/en_US/runes');
const runeDesc         = require('./assets/data/runeDesc');
const leagueConstants  = require('./assets/data/leaugeConstants');
const zed              = require('./util/zed');
// Authentication utils
const session          = require('express-session');
const sharedsession    = require("express-socket.io-session");
const passport         = require('passport');
const LocalStrategy    = require('passport-local').Strategy;
// DB utils
const mongoose         = require('mongoose');
const db               = require('./util/db');
const redisClient      = require('./util/redis_client');
const Legend           = require('./models/user');
const MongoStore       = require('connect-mongo')(session);
// Routes 
const leaderboards     = require('./routes/leaderboards');
const champions        = require('./routes/champions');
const summoner         = require('./routes/summoner');
const statistics       = require('./routes/statistics');
const logout           = require('./routes/logout');
const userProfile      = require('./routes/users');
const profile          = require('./routes/profile');
const login            = require('./routes/login');
const register         = require('./routes/register');
const post             = require('./routes/post');
const legendSearch     = require('./routes/legendSearch');
const friendRequests   = require('./routes/friendRequests');
const index            = require('./routes/index');
const items            = require('./routes/items');
const message          = require('./routes/message');
const runes            = require('./routes/runes');
const spectate         = require('./routes/spectate');
const about            = require('./routes/about');
const forgot           = require('./routes/forgot');
const upload           = require('./routes/upload');

app.locals.moment = moment;
app.locals.leagueItems = zed.leagueItems;
app.locals.champInfo = zed.general_cmp_info;
app.locals._ = _;
app.locals.summonerSpells = zed.summonerSpells;
app.locals.ddragon = zed.ddragon;
app.locals.ddragonNoVer = zed.ddragonNoVer;
app.locals.cmpId = championIds;
app.locals.runePaths = runePaths;
app.locals.runeDesc = runeDesc;
app.locals.leagueConstants = leagueConstants;
app.locals.runesReforged = runesReforged;

console.log('env', process.env.NODE_ENV);

// setInterval( async () => {
//     const leagueVersion = await rp('http://ddragon.leagueoflegends.com/api/versions.json', {json:true});
//     if(leagueVersion[0] != app.locals.ddragon.slice(34)) {
//         app.locals.ddragon = app.locals.ddragon.slice(0, 34) + leagueVersion[0];
//     }
//     console.log(app.locals.ddragon);
// }, 3600000);

// MongoDB
// mongoose.set('debug', true);


// Redis
redisClient.on('connect', () => {
    console.log(`Connected to redis`);
});

redisClient.on('error', err => {
    console.log(`Error: ${err}`);
});

// logs
const accessLogStream = fs.createWriteStream(path.join(__dirname+'/logs', 'access.log'), {flags: 'a'});

app.set('view engine', 'pug');

app
.use(compression())
.use(cookieParser())
.use('/dist', express.static(path.join(__dirname, 'dist')))
.use('/public', express.static(path.join(__dirname, 'public')))
.use('/matches', express.static(path.join(__dirname, 'matches')))
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
    res.locals.historyCookie = req.cookies._hist ? JSON.parse(req.cookies._hist) : null;
    next();
})
.use(flash())
.use(morgan('combined', {stream: accessLogStream}))
.use(function(req, res, next){
    res.locals.messages = require('express-messages')(req, res);
    next();
})
// Routes
app
.use('/leaderboards', leaderboards)
.use('/champions', champions)
.use('/summoner', summoner)
.use('/profile', profile)
.use('/users', userProfile)
.use('/statistics', statistics)
.use('/register', register)
.use('/login', login)
.use('/logout', logout)
.use('/post', post)
.use('/users', legendSearch)
.use('/users', friendRequests)
.use('/items', items)
.use('/upload', upload)
.use('/runes', runes)
.use('/about', about)
.use('/forgot', forgot)
.use('/message', message)
.use('/spectate', spectate)
.use('/', index)

io.use(sharedsession(session({
    secret: 'EFK9AqwLKR932',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
})));

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

app.get('*', (req, res) => {
    res.render('404', {
        title: 'Page Not Found | Legends'
    });
});

// process.on('unhandledRejection', (reason, p) => {
//     console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
// });

// process.on('uncaughtException', err => {
//     console.log(`Caught exception: ${err}\n`);
// });

server.listen('1337', () => {
    console.log(`Listening on port 1337`);
});