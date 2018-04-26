const express = require('express');
const router  = express.Router();
const Legend  = require('../models/user');

router.get('/:userName', (req, res) => {
    console.log(req.params.userName)
    console.log('searching')
    Legend.findOne({ username: req.params.userName }).then(user => {
        if (user) {
            console.log('users found')
            user.profileViews++;
            user.save();
            res.render('user_profile', {
                title: `${user.username} | Legends`,
                user,
            });
        } else {
            res.redirect('/users');
        }
    });
});

router.get('/:userName/photos', (req, res) => {
    Legend.findOne({ username: req.params.userName }).then(user => {
        if (user) {
            res.render('user_photos', {
                title: `${user.username} Photos | Legends`,
                user,
            });
        } else {
            res.redirect('/users');
        }
    });
});

module.exports = router;