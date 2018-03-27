const express = require('express');
const router = express.Router();
const Legend = require('../models/user');

router.post('/acceptFriendRequest/:id', (req, res) => {
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
    });

    Legend.update(
        {_id: req.user._id}, {
        $push : { friends : { _id: req.params.id }}},
        (err, doc) => {
            if(err) console.log(err);
    })

    Legend.update(
        {_id: req.params.id},
        { $push : { friends : { _id: req.user._id }}},
        (err, doc) => {
            if(err) console.log(err);
            res.send(req.params.id);
    })
})

router.post('/declineFriendRequest/:id', (req, res) => {
    Legend.update(
        { _id: req.user._id },
        { $pull: { friendRequests : { requester: req.params.id }}},
        (err, doc) => {
            if(err) console.log(err);
    })

    Legend.update(
        { _id: req.params.id },
        { $pull: { friendRequestsSent : { to: req.user._id }}},
        (err, doc) => {
            if(err) console.log(err);
            res.send(req.params.id);
    })
})

module.exports = router;