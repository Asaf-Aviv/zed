const express = require('express');
const router  = express.Router();
const zed     = require('../util/zed');

router.get('/', (req, res) => {
    zed.getLeaderboards(req.query.region).then(LB => {
        LB.entries.sort((a, b) => {
            return b.leaguePoints - a.leaguePoints;
        });
        res.render('leaderboards', {
            title: `${regionNameFix[req.query.region]}  Leaderboards | League of Legends`,
            LB,
            region: regionNameFix[req.query.region]
        });
    });
});

module.exports = router;