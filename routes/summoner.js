const express = require('express')
const router  = express.Router()
const zed     = require('../util/zed')

router.get('/', async (req, res) => {
    const region = req.query.region
    const summonerName = req.query.userName.replace(/ /g, '').toLowerCase()
    // let recentGames

    const summoner = await zed.getSummoner(summonerName, region)
    if (!summoner) return res.redirect('/')

    const [ summonerRank, matchList ] = await Promise.all([
        zed.getSummonerPosition(summoner.id, region),
        zed.getMatchList(summoner.accountId, region, 0, 10)
    ])

    const recentGames = await Promise.all(
        matchList.matches.map(game => zed.getMatchSummary(game.gameId, region))
    )

    res.render('summoner', {
        title: `${summoner.name} | Summoner Profile | Zed`,
        summoner,
        summonerRank: summonerRank[0],
        region,
        recentGames,
    })
})

module.exports = router