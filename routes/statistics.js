const express = require('express');
const router  = express.Router();
const pug     = require('pug');
const zed     = require('../util/zed');

router.get('/', (req, res) => {
    Promise.all([
        zed.getOverallPatch(),
        zed.getOverallStatistics(),
        zed.getAllChampionsStats(),
        zed.getChampionsIdsAndNames(),
    ]).then(([overallPatch, overallStats, allChampsStats, ids]) => {
        res.render('statistics', {
            title: 'Statistics | Legends',
            overallPatch,
            overallStats,
            allChampsStats,
            ids,
        });
    });
});

router.get('/overall/:elo', (req, res) => {
    Promise.all([
        zed.getOverallPatch(req.params.elo),
        zed.getOverallStatistics(req.params.elo),
        zed.getChampionsIdsAndNames(),
    ]).then(([overallPatch, overallStats, ids]) => {
        res.send(pug.renderFile('views/partials/overall_patch.pug', {
            overallPatch,
            overallStats,
            ids,
        }));
    });
});

module.exports = router;