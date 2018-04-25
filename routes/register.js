const express = require('express');
const router  = express.Router();
const Legend  = require('../models/user');
const auth    = require('../middlewares/auth');

router.get('/', auth.isNotLogged(), (req, res) => {
    res.render('register', {
        title: 'Register | Legends'
    });
});

router.post('/', (req, res) => {
    req.body.lowerCaseUsername = req.body.username.toLowerCase();
    req.body.lowerCaseEmail = req.body.email.toLowerCase();
    req.body.info = {};

    if (req.body.password === req.body.confirmPassword) {
        Legend.create(req.body, (err, user) => {
            if (err) {
                console.log(err);
                res.render('register', {
                    title: 'Register | Legends',
                    err: err.errors
                });
            } else {
                req.login(user, err => {
                    if (err) console.log(err);
                    res.redirect('/profile');
                });
            }
        });
    } else {
        res.redirect('/register');
    }
});

module.exports = router;