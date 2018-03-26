const express = require('express')
const router = express.Router()
const Legend = require('../models/user')

router.get('/', (req, res) => {

    Legend.find({}).then(result => {

        let usersList = []
        let sentRequests = req.user.friendRequestsSent.map(req => req.to.toString())
        let pendingRequests = req.user.friendRequests.map(req => req.requester.toString())
        let friends = req.user.friends.map(friend => friend._id.toString())

        result.map(user => {
            usersList.push({
                _id: user._id.toString(),
                username: user.username,
                profilePicture: user.profilePicture
            })
        })
        res.render('legends', {
            title:  'Legends | Legends',
            usersList,
            sentRequests,
            pendingRequests,
            friends,
        })
    })
})

router.post('/sendFriendRequest/:id', (req, res) => {

    let requestExist;

    const friendRequestSent = {
        to: req.params.id
    }

    const friendRequest = {
        requester: req.user._id,
        username: req.user.username,
        profilePicture: req.user.profilePicture
    }

    Legend.findById(req.params.id).then(result => {
        for (let request of result.friendRequests) {
            if (request.requester == req.user._id) {
                requestExist = true
                break
            }    
        }

        if (!requestExist) {

            Legend.findByIdAndUpdate(req.params.id,
                { $push: { 'friendRequests': friendRequest}},
                { safe: true, new: true }, (err, updatedUser) => {
                    if (err) console.log(err)
                })
    
            Legend.findByIdAndUpdate(req.user._id,
                { $push: { 'friendRequestsSent': friendRequestSent}},
                { safe: true, new: true }, (err, updatedUser) => {
                    if (err) console.log(err)

                    req.session.passport.user = updatedUser
                    res.send(req.params.id)
                })
            } else {
                console.log('Request already exists')
            }  
    })
})



module.exports = router