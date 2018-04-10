const express = require('express');
const router  = express.Router();
const zed     = require('../util/zed');

router.get('/', (req, res) => {
    zed.getLeaderboards(req.query.region).then(LB => {
        LB.entries.sort((a, b) => {
            return b.leaguePoints - a.leaguePoints;
        });
        res.render('leaderboards', {
            title: 'EU West Leaderboards | League of Legends',
            LB,
        });
    });
});

module.exports = router;