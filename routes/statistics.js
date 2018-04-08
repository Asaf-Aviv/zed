const express = require('express');
const router = express.Router();
const pug = require('pug');
const zed = require('../util/zed');

router.get('/', (req, res) => {
    Promise.all([
        zed.getOverallStatistics(req.query.league),
        zed.getOverallPatch(req.query.league),
        zed.getChampionsIdsAndNames()
    ]).then(([overallStats, overallPatch, ids]) => {
        if (req.query.league) {
            res.send(pug.renderFile('views/partials/overall_patch.pug', {
                title: 'Statistics | Legends',
                overallStats,
                overallPatch,
                ids,
            }));
        } else {
            res.render('statistics', {
                title: 'Statistics | Legends',
                overallStats,
                overallPatch,
                ids,
            });
        }
    });
});

module.exports = router;