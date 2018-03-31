const express = require('express');
const router = express.Router();
const zed = require('../util/zed');

router.get('/', (req, res) => {
    zed.getItems().then(items => {
        res.render('items', {
            title: 'Items | Legends',
            items,
        });    
    });
});

router.get('/:id', (req, res) => {
    res.render('index', {
        title: 'Items | Legends'
    });
});

module.exports = router;