const express = require('express')
const router  = express.Router()
const zed     = require('../util/zed')
const pug     = require('pug')

router.get('/:summonerId', async (req, res) => {
    const [ summonerId, region ] = req.params.summonerId.split('_')
    const match = await zed.checkActiveGame(summonerId, region)

    if (!match) return res.status(404).send()

    const playerDetails = await Promise.all(
            match.participants.map(player => zed.getSummonerPosition(player.summonerId, region)))

    res.send(pug.renderFile('views/partials/match.pug', {
        match,
        playerDetails,
        leagueConstants: req.app.locals.leagueConstants,
        moment: req.app.locals.moment,
        cmpId: req.app.locals.cmpId,
        summonerSpells: req.app.locals.summonerSpells,
        runeDesc: req.app.locals.runeDesc,
        _: req.app.locals._,
        runePaths: req.app.locals.runePaths,
        ddragon: zed.ddragon,
        ddragonNoVer: zed.ddragonNoVer,
    }))
})

router.get('/isActive/:summonerId', async (req, res) => {
    const [ summonerId, region ] = req.params.summonerId.split('_')
    const match = await zed.checkActiveGame(summonerId, region)
    res.send(match ? true : false)
})

module.exports = router