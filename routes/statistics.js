const express     = require('express')
const router      = express.Router()
const pug         = require('pug')
const zed         = require('../util/zed')
const redisClient = require('../util/redis_client')

router.get('/', (req, res) => {
    redisClient.mgetAsync(`overall_info_platplus`, `overall_platplus`, `overall_champions_platplus`).then(async reply => {
        let overallPatch
        let overallStats
        let allChampsStats

        if (reply[0]) {
            overallPatch   = JSON.parse(reply[0])
            overallStats   = JSON.parse(reply[1])
            allChampsStats = JSON.parse(reply[2])
        } else {
            overallPatch   = await zed.getOverallPatchInfo()
            overallStats   = await zed.getOverallStatistics()
            allChampsStats = await zed.getAllChampionsStats()

            redisClient.SET(`overall_platplus`, JSON.stringify(overallStats), 'EX', 3600 * 12)
            redisClient.SET(`overall_info_platplus`, JSON.stringify(overallPatch), 'EX', 3600 * 12)
            redisClient.SET(`overall_champions_platplus`, JSON.stringify(allChampsStats), 'EX', 3600 * 12)
        }
        const ids = await zed.getChampionsIdsAndNames()
        res.render('statistics', {
            title: 'Statistics | Zed',
            overallPatch,
            overallStats,
            allChampsStats,
            ids,
        })
    })
})

router.get('/:champName', (req, res) => {
    const elo       = req.query.elo
    const position  = req.query.position
    const champName = req.params.champName

    redisClient.getAsync(`statistics_${champName}_${position}_${elo}`).then(async reply => {
        let champStats

        if (reply) {
            console.log('serving from cache')
            champStats = JSON.parse(reply)
        } else {
            console.log('caching')
            champStats = await zed.getIndepthStats(champName, position, elo)
            redisClient.SET(`statistics_${champName}_${position}_${elo}`, JSON.stringify(champStats), 'EX', 3600 * 12)
        }

        if(!champStats || !champStats.length) return res.redirect('/statistics')

        const champ = await zed.getChampDesc(champName)

        res.render('champion_statistics', {
            title: `${champ.name} Statistics | Zed.gg`,
            champ,
            champStats,
        })
    })
})

router.get('/overall/:elo', (req, res) => {
    console.log('patch request')
    const elo = req.params.elo
    
    redisClient.mgetAsync(`overall_info_${elo}`, `overall_${elo}`).then(async reply => {
        let overallPatch
        let overallStats

        if (reply[0]) {
            overallPatch = JSON.parse(reply[0])
            overallStats = JSON.parse(reply[1])
        } else {
            overallPatch = await zed.getOverallPatchInfo(elo)
            overallStats = await zed.getOverallStatistics(elo)
            redisClient.SET(`overall_info_${elo}`, JSON.stringify(overallPatch), 'EX', 3600 * 12)
            redisClient.SET(`overall_${elo}`, JSON.stringify(overallStats), 'EX', 3600 * 12)
        }
        const ids = await zed.getChampionsIdsAndNames()
        res.send(pug.renderFile('views/partials/overall_patch.pug', {
            overallPatch,
            overallStats,
            ids,
            ddragon: zed.ddragon,
            _: req.app.locals._
        }))
    })
})

router.get('/overall/champions/:elo', (req, res) => {
    console.log('champions request')
    const elo = req.params.elo
    
    redisClient.getAsync(`overall_champions_${elo}`).then(async reply => {
        let allChampsStats

        if (reply) {
            allChampsStats = JSON.parse(reply)
        } else {
            allChampsStats = await zed.getAllChampionsStats(elo)
            redisClient.SET(`overall_champions_${elo}`, JSON.stringify(allChampsStats), 'EX', 3600 * 12)
        }
        const ids = await zed.getChampionsIdsAndNames()
        res.send(pug.renderFile('views/partials/overall_champs.pug', {
            allChampsStats,
            ids,
            ddragon: zed.ddragon,
            _: req.app.locals._
        }))
    })
})

module.exports = router