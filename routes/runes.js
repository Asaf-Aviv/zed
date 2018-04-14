const express = require('express');
const router  = express.Router();
const zed     = require('../util/zed');

router.get('/', (req, res) => {
    zed.getItems().then(items => {
        res.render('runes', {
            title: 'Runes | Legends',
        });    
    });
});

module.exports = router;