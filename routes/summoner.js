const express     = require('express');
const router      = express.Router();
const zed         = require('../util/zed');

router.get('/', async (req, res) => {
    const region = req.query.region;
    const summonerName = req.query.userName.replace(/ /g, '').toLowerCase();
    let league, playerDetails;
    
    const summoner = await zed.getSummoner(summonerName, region);
    if (!summoner) return res.redirect('/');

    const [ summonerRank, match, summonerSpells ] = await Promise.all([
        zed.getSummonerLeague(summoner.id, region),
        zed.getSummonerGame(summoner.id, region),
        zed.getSummonerSpells()
    ]);

    if (summonerRank.length) {
        league = await zed.getLeague(summonerRank[0].leagueId, region);
    }
    if (match) {
        playerDetails = await Promise.all(
            match.participants.map(p => zed.getSummonerLeague(p.summonerId, region))
        )
    }
    res.render('summoner', {
        title: summoner.name + " | Summoner Profile | Zed",
        summoner,
        summonerRank: summonerRank[0],
        league,
        match,
        region,
        summonerSpells,
        playerDetails,
    });
});

module.exports = router;