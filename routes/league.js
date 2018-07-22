const express = require('express');
const router  = express.Router();
const zed     = require('../util/zed');
const pug     = require('pug');

router.get('/:leagueId', async (req, res) => {
    [ leagueId, region ] = req.params.leagueId.split('_');
    
    league = await zed.getLeague(leagueId, region);

    res.send(pug.renderFile('views/partials/league.pug', {
        league,
    }));
});

module.exports = router;