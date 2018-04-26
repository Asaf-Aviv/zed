const express = require('express');
const router  = express.Router();
const Legend  = require('../models/user');

router.get('/users/:username', (req, res) => {
    // send 10 users that starts with username
});

module.exports = router;