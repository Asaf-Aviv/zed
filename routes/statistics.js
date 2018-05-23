const express = require('express');
const router  = express.Router();
const pug     = require('pug');
const zed     = require('../util/zed');
const redisClient = require('../util/redisClient');

router.get('/', (req, res) => {
    Promise.all([
        zed.getOverallPatch('platplus'),
        zed.getOverallStatistics(),
        zed.getAllChampionsStats(),
        zed.getChampionsIdsAndNames(),
    ]).then(([overallPatch, overallStats, allChampsStats, ids]) => {
        console.log(allChampsStats.length);
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
            title: `${champ.name} Statistics| Legends`,
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
    const elo = req.params.elo;
    
    redisClient.mgetAsync(`overall_statistics_${elo}`, `overall_statistics_info_${elo}`).then(async reply => {
        let overallStats;
        let overallPatch;

        if (reply[0]) {
            console.log('already cached');
            overallStats = JSON.parse(reply[0]);
            overallPatch = JSON.parse(reply[1]);
        } else {
            console.log('caching');
            overallStats = await zed.getOverallStatistics(elo);
            overallPatch = await zed.getOverallPatch(elo);
            redisClient.SET(`overall_statistics_${elo}`, JSON.stringify(overallStats), 'EX', 3600 * 12);
            redisClient.SET(`overall_statistics_info_${elo}`, JSON.stringify(overallPatch), 'EX', 3600 * 12);
        }
        const ids = await zed.getChampionsIdsAndNames()
        res.send(pug.renderFile('views/partials/overall_patch.pug', {
            overallPatch,
            overallStats,
            ids,
            ddragon: zed.ddragon
        }));
    });
});

router.get('/overall/champions/:elo', (req, res) => {
    console.log('champions request')
    const elo = req.params.elo;
    
    redisClient.getAsync(`overall_champions_${elo}`).then(async reply => {
        let allChampsStats;
        if (reply) {
            console.log('already cached');
            allChampsStats = JSON.parse(reply);
        } else {
            console.log('caching');
            allChampsStats = await zed.getAllChampionsStats(elo);
            redisClient.SET(`overall_champions_${elo}`, JSON.stringify(allChampsStats), 'EX', 3600 * 12);
        }
        const ids = await zed.getChampionsIdsAndNames();
        res.send(pug.renderFile('views/partials/overall_champs.pug', {
            allChampsStats,
            ids,
            ddragon: zed.ddragon
        }));
    });
});

module.exports = router;