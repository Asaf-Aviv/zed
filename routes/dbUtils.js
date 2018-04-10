const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose');
const Legend   = require('../models/user');

router.get('/makeUsers', (req, res) => {
    makeDummyUsers();
    res.send();
});

router.get('/clearDB', (req, res) => {
    clearDB();
    res.send();
});

function clearDB() {
    mongoose.connection.collections.users.drop();
}

function makeDummyUsers() {
    let user;
    for (let i = 1; i < 6; i++) {
        user = new Legend({
            username: 'test'+i,
            email: 'test'+i+'@gmail.com',
            password: '123123123'
        }).save();
    }
}

module.exports = router;