const express = require('express');
const router  = express.Router();
const Legend  = require('../models/user');

router.post('/:id', (req, res) => {
    Legend.findByIdAndUpdate(
        req.params.id, 
        {
            $push: {
                messages: {
                    $each: [{ ...req.body }],
                    $position: 0
                }
            }
        }, 
        (err, user) => {
        if (err) console.log(err);
        
        if (connectedUsers[req.params.id]) {
            connectedUsers[req.params.id].map(socketId =>
                io.to(socketId).emit('newMessage', req.user.username)
            )
        }
        Legend.findByIdAndUpdate(
            req.user._id, 
            {
                $push: {
                    messagesSent: {
                        $each: [{ ...req.body }],
                        $position: 0
                    }
                }
            }, 
            err => {
            if (err) console.log(err);
        });
        res.send();
    });
});

router.delete('/:id', (req, res) => {
    Legend.findOneAndUpdate(
    {
        _id: req.user._id, 'messages._id': req.params.id
    },
    {
        $set: {
            'messages.$.deleted': true
        }
    },
    {
        safe: true,
        new: true
    },
    err => {
        if (err) console.log(err);
        res.send();
    });
});

module.exports = router;