const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const zed = require('../util/zed');

router.get('/', (req, res) => {
    res.render('spectate', {
        title: 'Spectate | Legends'
    });
});

router.get('/:matchId', (req, res) => {
    const matchId = req.params.matchId
    const specBat = String.raw`CD /D D:\Riot Games\League of Legends\RADS\solutions\lol_game_client_sln\releases\0.0.1.209\deploy`
    zed.makeSpecBatch().then(matchCmd => {
        fs.writeFile(`./matches/${matchId}.bat`, specBat + '\n\t' + matchCmd, err => {
            if (err) console.log(err);
            res.sendFile(`${matchId}.bat`, {root: __dirname+'/../matches'})
            // res.download(__dirname + `/../matches/${matchId}.bat`);
        });
    });
});

module.exports = router;