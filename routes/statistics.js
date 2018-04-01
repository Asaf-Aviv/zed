const express = require('express');
const router = express.Router();
const zed = require('../util/zed');

router.get('/', (req, res) => {
    zed.getOverallStatistics().then(overallStats => {
        zed.getChampionsIdsAndNames().then(ids => {
            res.render('statistics', {
                title: 'Statistics | Legends',
                overallStats,
                ids,
            });
        });
    });
});

module.exports = router;