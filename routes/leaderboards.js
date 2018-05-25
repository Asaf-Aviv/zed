const express     = require('express');
const router      = express.Router();
const redisClient = require('../util/redisClient');
const zed         = require('../util/zed');

router.get('/', async (req, res) => {
    const region = req.query.region;
    const LB = await zed.getLeaderboards(region);

    res.render('leaderboards', {
        title: `${regionNameFix[region]} Leaderboards | Zed.gg`,
        LB,
        region: regionNameFix[region]
    });
});

module.exports = router;