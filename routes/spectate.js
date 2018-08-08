const express = require('express')
const router  = express.Router()
const fs      = require('fs')
const zed     = require('../util/zed')

router.get('/:matchId', (req, res) => {
    res.sendFile(`${req.params.matchId}`, {root: __dirname + '/../matches/'})
})

router.post('/:matchId', (req, res) => {
    zed.makeSpecBatch(req.body).then(matchCmd => {
        fs.writeFile(`./matches/zed_spectate_${req.params.matchId}.bat`, matchCmd, err => {
            if (err) console.log(err)
            res.send(`zed_spectate_${req.params.matchId}.bat`)
        })
    })
})

module.exports = router