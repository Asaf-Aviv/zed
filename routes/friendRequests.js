const express = require('express');
const router  = express.Router();
const Legend  = require('../models/user');

router.post('/sendFriendRequest/:id', (req, res) => {
    let requestExist;

    Legend.findById(req.params.id).then(user => {
        for (let request of user.friendRequests) {
            if (request.requester == req.user._id) {
                requestExist = true;
                return console.log('Request already exists');
            }
        }
    });

    if (!requestExist) {

        const friendRequestSent = {
            to: req.params.id
        };

        const friendRequest = {
            requester: req.user._id,
            username: req.user.username,
            profilePicture: req.user.profilePicture
        };

        Legend.findByIdAndUpdate(
            req.params.id,
            { $push: { friendRequests: friendRequest }},
            { safe: true, new: true },
            err => {
                if (err) {
                    console.log(err);
                    return res.status(400).send();
                }
            }
        );

        Legend.findByIdAndUpdate(
            req.user._id,
            { $push: { friendRequestsSent: friendRequestSent }},
            { safe: true, new: true },
            err => {
                if (err) {
                    console.log(err);
                    return res.status(400).send();
                }
                res.send(req.params.id);
            }
        );
        io.to(connectedUsers[req.params.id]).emit('friendRequest', req.user.username);
    }
});

router.post('/acceptFriendRequest/:id', (req, res) => {
    Legend.update(
        { _id: req.user._id },
        { $pull: { friendRequests : { requester: req.params.id }}},
        err => {
            if(err) console.log(err);
    });

    Legend.update(
        { _id: req.params.id },
        { $pull: { friendRequestsSent : { to: req.user._id }}},
        err => {
            if(err) console.log(err);
    });

    Legend.update(
        {_id: req.user._id}, {
        $push : { friends : { _id: req.params.id }}},
        (err, doc) => {
            if(err) console.log(err);
    });

    Legend.update(
        {_id: req.params.id},
        { $push: { friends : { _id: req.user._id }}},
        (err, doc) => {
            if(err) console.log(err);
            res.send(req.params.id);
    });
    io.to(connectedUsers[req.params.id]).emit('acceptFriendRequest', req.user.username);
});

router.post('/declineFriendRequest/:id', (req, res) => {
    Legend.update(
        { _id: req.user._id },
        { $pull: { friendRequests : { requester: req.params.id }}},
        (err, doc) => {
            if(err) console.log(err);
    });

    Legend.update(
        { _id: req.params.id },
        { $pull: { friendRequestsSent : { to: req.user._id }}},
        (err, doc) => {
            if(err) console.log(err);
            res.send(req.params.id);
    });
});

router.post('/cancelFriendRequest/:id', (req, res) => {
    Legend.update(
        { _id: req.user._id },
        { $pull: { friendRequestsSent : { to: req.params.id }}},
        (err, doc) => {
            if(err) console.log(err);
    });

    Legend.update(
        { _id: req.params.id },
        { $pull: { friendRequests: { requester: req.user._id }}},
        (err, doc) => {
            if(err) console.log(err);
    });
    res.send(req.params.id);
});

// FIXME 
router.post('/removeFriend/:id', (req, res) => {
    console.log('remove')
    Legend.update(
        { _id: req.user._id },
        { $pull: { friendRequestsSent : { to: req.params.id }}},
        (err, doc) => {
            if(err) console.log(err);
    });

    Legend.update(
        { _id: req.params.id },
        { $pull: { friendRequests: { requester: req.user._id }}},
        (err, doc) => {
            if(err) console.log(err);
    });
    res.send(req.params.id);
});

module.exports = router;