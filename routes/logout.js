const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

router.get('/', auth.isLogged(), (req, res, next) =>{
    req.logout();
    req.session.destroy( err => {
        if (err) return next(err);
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

module.exports = router;