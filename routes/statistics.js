const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('statistics', {
        title: 'Statistics | Legends',
    });
});

module.exports = router;