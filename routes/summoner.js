const express     = require('express');
const router      = express.Router();
const zed         = require('../util/zed');

router.get('/', async (req, res) => {
    const region = req.query.region;
    const summonerName = req.query.userName.replace(/ /g, '').toLowerCase();
    let playerDetails;
    
    const summoner = await zed.getSummoner(summonerName, region);
    if (!summoner) return res.redirect('/');

    const [ summonerRank, match, matchList, summonerSpells ] = await Promise.all([
        zed.getSummonerPosition(summoner.id, region),
        zed.checkActiveGame(summoner.id, region),
        zed.getMatchList(summoner.accountId, region, 0, 10)
    ]);

    const recentGames = await Promise.all(
        matchList.matches.map(game => zed.getMatchSummary(game.gameId, region))
    );

    console.log(recentGames);

    const league = summonerRank.length ? await zed.getLeague(summonerRank[0].leagueId, region): null;

    if (match) {
        playerDetails = await Promise.all(
            match.participants.map(player => zed.getSummonerPosition(player.summonerId, region))
        )
    }
    res.render('summoner', {
        title: summoner.name + " | Summoner Profile | Zed",
        summoner,
        summonerRank: summonerRank[0],
        league,
        match,
        region,
        playerDetails,
        recentGames,
    });
});

module.exports = router;