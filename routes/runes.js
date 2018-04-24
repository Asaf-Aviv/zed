const express = require('express');
const router  = express.Router();
const zed     = require('../util/zed');

router.get('/', (req, res) => {
    zed.getRunesReforged().then(runes => {
        res.render('runes', {
            title: 'Runes | Legends',
            runes,
        });    
    });
});

module.exports = router;