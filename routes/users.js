const express = require('express')
const router  = express.Router()
const Legend  = require('../models/user')
const auth    = require('../middlewares/auth')

router.get('/:userName', auth.isLogged(), (req, res) => {
    console.log(req.params.userName)
    console.log('searching')
    Legend.findOne({ username: req.params.userName }).then(user => {
        if (user) {
            console.log('users found')
            user.profileViews++
            user.save()
            res.render('user_profile', {
                title: `${user.username} | Legends`,
                user,
            })
        } else {
            res.redirect('/users')
        }
    })
})

module.exports = router