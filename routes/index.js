const express = require('express');
const router  = express.Router();
const Contact = require('../models/contact');
const Idea = require('../models/idea');
const Bug = require('../models/bug');

router.get('/', (req, res) => {
    res.status(200).render('index', {
        title: 'Home | Legends'
    });
});

router.post('/contact', (req, res) => {
    console.log(req.body);
    new Contact({...req.body}).save(err => {
        if (err) res.status(400).json('Something went wrong :/ Please try again.');
        else res.send('Thanks for contacting us ! :)');
    });
});

router.post('/feedback', (req, res) => {
    if (req.body.feedback === 'idea') {
        new Idea({message: req.body.message}).save(err => {
            console.log(err.message.split('Path')[1])
            if (err) res.status(400).json('Something went wrong :/ Please try again.');
            else res.send('Thanks for your awesome idea !');
        });
    } else {
        new Bug({message: req.body.message}).save(err => {
            if (err) res.status(400).json('Something went wrong :/ Please try again.');
            else res.send('Thanks for reporting a bug ! :)');
        });
    }
});

module.exports = router;