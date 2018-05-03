const express = require('express');
const router  = express.Router();
const Legend  = require('../models/user');
const auth    = require('../middlewares/auth');

router.get('/', auth.isLogged(), (req, res) => {
    Legend.find({}).then(result => {
        let usersList = [];
        let sentRequests = req.user.friendRequestsSent.map(req => req.to.toString());
        let pendingRequests = req.user.friendRequests.map(req => req.requester.toString());
        let friends = req.user.friends.map(friend => friend._id.toString());

        result.map(user => {
            usersList.push({
                _id: user._id.toString(),
                username: user.username,
                profilePicture: user.profilePicture
            });
        });
        res.render('legend_search', {
            title: 'Legends | Legends',
            usersList,
            sentRequests,
            pendingRequests,
            friends,
        });
    });
});

module.exports = router;