const express = require('express');
const router  = express.Router();
const Legend  = require('../models/user');
const auth    = require('../middlewares/auth');

router.get('/', auth.isLogged(), (req, res) => {
    res.render('profile', {
        title: `${req.user.username} | Legends`
    });
});

router.get('/messages', auth.isLogged(), (req, res) => {
    res.render('messages', {
        title: `${req.user.username} messages | Legends`
    });
});

router.get('/friends', auth.isLogged(), (req, res) => {
    Legend.find({ _id: req.user._id }, {friends: 1, _id: 0}).then(user => {
        console.log(user[0].friends)
    });
    res.render('friends', {
        title: `Friends | Legends`
    });
});

module.exports = router;