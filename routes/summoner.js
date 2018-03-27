const express = require('express');
const router = express.Router();
const zed = require('../util/zed');
const championIds = require('../assets/data/champions/championIds');

router.get('/', (req, res) => {
    const region = req.query.region;
    zed.getSummoner(req.query.userName, region).then(summoner => {
        if (!summoner) return res.redirect('/')
        zed.getLeague(summoner.id, region).then(league => {
            zed.getSummonerGame(summoner.id, region).then(match => {
                zed.getMatches(summoner.accountId, region).then(matches => {
                    zed.getMastery(summoner.id, region).then(mastery => {
                        const skins = mastery.length > 0 ? zed.getSkins(mastery[0].championId) : zed.getSkins(7);
                        const mustPlayed = [zed.getSkins(mastery[0].championId), zed.getSkins(mastery[1].championId), zed.getSkins(mastery[2].championId)];
                        const mustPlayedBG = mustPlayed.map(champ => zed.getBg(champ.name, champ.skins.length));
                        const bg = zed.getBg(skins.name, skins.skins.length);
                        res.render('summoner', {
                            title: summoner.name + " | Summoner Profile | Legends",
                            summoner,
                            league,
                            match,                            
                            championIds,
                            mustPlayed,
                            mustPlayedBG,
                            matches,
                            mastery,
                            skins,
                            bg,
                            region,
                        });
                    });
                });
            });
        });
    });
});

module.exports = router;