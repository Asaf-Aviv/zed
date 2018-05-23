const express     = require('express');
const router      = express.Router();
const zed         = require('../util/zed');
const redisClient = require('../util/redisClient');

router.get('/', (req, res) => {
    const region = req.query.region;

    redisClient.getAsync(`challenger_${region}`).then(async reply => {
        let LB;
        
        if (reply) {
            LB = JSON.parse(reply);
        } else {
            LB = await zed.getLeaderboards(region);
            LB.entries.sort((a, b) => b.leaguePoints - a.leaguePoints);
            redisClient.set(`challenger_${region}`, JSON.stringify(LB), 'EX', 3600);
        }

        res.render('leaderboards', {
            title: `${regionNameFix[region]} Leaderboards | Zed.gg`,
            LB,
            region: regionNameFix[region]
        });
    });
});

module.exports = router;