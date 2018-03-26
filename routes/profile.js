const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

router.get('/', auth.isLogged(), (req, res) => {
    res.render('profile', {
        title: req.user.username + " | Legends"
    })
})

module.exports = router;
