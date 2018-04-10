const express = require('express');
const router  = express.Router();
const zed     = require('../util/zed');

router.get('/', (req, res) => {
    zed.getChampionsIdsAndNames().then(champs => {
        champs = Object.values(champs).sort()
        res.render('champions', {
            title: 'Champions | Legends',
            champs,
        });
    });
});

router.get('/:champName', (req, res) => {
    zed.getChampionStats(req.params.champName).then(champStats => {
        if (champStats.length === 0) return res.redirect('/champions');
        Promise.all([
            zed.getChampDesc(champStats[0].championId),
            zed.getItems(),
            zed.getRunesReforged(),
            zed.getSummonerSpells()
        ]).then(([champ, items, runes, summonerSpells]) =>{
            res.render('champion', {
                title: `${champ.name} | Legends`,
                champStats,
                champ,
                items,
                runes,
                summonerSpells,
            });
        });
    });
});

module.exports = router;