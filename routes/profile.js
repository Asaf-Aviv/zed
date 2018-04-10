const express = require('express');
const router  = express.Router();
const Legend  = require('../models/user');
const auth    = require('../middlewares/auth');

router.get('/', auth.isLogged(), (req, res) => {
    res.render('profile', {
        title: `${req.user.username} | Legends`
    });
});

router.get('/:legendName', (req, res) => {
    Legend.findOne({ username: req.params.legendName }).then(legend => {
        if (legend) {
            legend.profileViews++;
            legend.save();
            res.render('legend_profile', {
                title: `${legend.username} | Legends`,
                legend,
            });
        } else {
            res.redirect('/users');
        }
    });
});

module.exports = router;