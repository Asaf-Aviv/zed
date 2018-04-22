const express = require('express');
const router  = express.Router();
const Legend  = require('../models/user');

router.post('/:id', (req, res) => {
    setTimeout(function(){
        console.log(req.body)
        console.log('sending message to, ' + req.params.id);
        Legend.findById(req.params.id, (err, user) => {
            if (err) console.log(err);
            console.log(user);
            res.send();
        });
    }, 5000)
});


module.exports = router;