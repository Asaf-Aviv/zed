const express = require('express');
const router  = express.Router();
const Legend  = require('../models/user');

router.post('/photos', (req, res) => {
    console.log('photo recived');
    console.log(req.body);
});

module.exports = router;