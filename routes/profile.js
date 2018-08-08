const express    = require('express')
const router     = express.Router()
const Legend     = require('../models/user')
const auth       = require('../middlewares/auth')

router.get('/', auth.isLogged(), (req, res) => {
    res.render('profile', {
        title: `${req.user.username} Profile | Zed`
    })
})

router.get('/inbox', auth.isLogged(), (req, res) => {
    res.render('inbox', {
        title: `${req.user.username} Inbox | Zed`
    })
})

router.get('/friends', auth.isLogged(), (req, res) => {
    Legend.findById(req.user._id, {
        friends: 1,
        },
        async (err, user) => {
            console.log(user)
            const friendsList = await Promise.all(
                user.friends.map(({ _id }) => Legend.findById(_id, {username: 1, info: 1}))
            )
            res.render('friends', {
                title: 'Friends | Zed',
                friendsList,
            })
        }
    )
})

router.get('/info', auth.isLogged(), (req, res) => {
    res.render('info', {
        title: `${req.user.username} Info | Legends`
    })
})

router.put('/info', (req, res) => {
    console.log(req.body)

    Legend.findByIdAndUpdate(
        req.user._id,
        {
            $set: { info: { ...req.body }}
        },
        (err, doc) => {
            if(err) console.log(err)
            res.send()
        }
    )
})

module.exports = router