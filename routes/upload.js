const express = require('express');
const router  = express.Router();
const Legend  = require('../models/user');

router.post('/images', (req, res) => {
    console.log('photo recived');
    console.log(req.body);
    // req.body.numberOfPhotos = req.body.uuid.split('~')[1]
    Legend.findByIdAndUpdate(
        req.user._id,
        {
            $push : {
                images: {
                    $each: [{
                        ...req.body
                    }],
                    $position: 0
                }
            }
        },
        (err, doc) => {
            if (err) return res.status(500).send()
            res.send()
        }
    );
});

module.exports = router;