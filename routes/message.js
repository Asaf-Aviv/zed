const express = require('express');
const router  = express.Router();
const Legend  = require('../models/user');

router.post('/:id', (req, res) => {
    console.log(req.body);
    console.log('sending message to, ' + req.params.id);
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
        res.send();
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
    });
});

router.delete('/:id', (req, res) => {
    console.log('delete request');
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