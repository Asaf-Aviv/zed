const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../middlewares/auth');

router.get('/', auth.isNotLogged(), (req, res) => {
    res.render('login', {
        title: 'Log in | Legends'
    });
});

router.post('/',
    passport.authenticate('local', { successRedirect: '/profile',
                                     failureRedirect: '/login' }));

module.exports = router;