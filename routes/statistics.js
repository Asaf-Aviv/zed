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

router.get('/:champName', (req, res) => {
    console.log('indepth request')
    Promise.all([
        zed.getChampDesc(req.params.champName),
        zed.getIndepthStats(req.params.champName, req.query.elo, req.query.position),
        zed.getItems(),
        zed.getRunesReforged(),
        zed.getSummonerSpells()
    ]).then(([champ, champStats, items, runes, summonerSpells]) => {
        if(!champStats || champStats.length === 0) return res.redirect('/statistics');
        res.render('champion_statistics', {
            title: 'janna champion Stats',
            champ,
            champStats,
            items,
            runes,
            summonerSpells,
        });
    });
});

router.get('/overall/:elo', (req, res) => {
    console.log('patch request')
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

router.get('/overall/champions/:elo', (req, res) => {
    console.log('champions request')
    Promise.all([
        zed.getAllChampionsStats(req.params.elo),
        zed.getChampionsIdsAndNames(),
    ]).then(([allChampsStats, ids]) => {
        res.send(pug.renderFile('views/partials/overall_champs.pug', {
            allChampsStats,
            ids,
        }));
    });
});

module.exports = router;