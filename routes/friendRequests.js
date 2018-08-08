const express = require('express')
const router  = express.Router()
const Legend  = require('../models/user')

router.post('/sendFriendRequest/:id', (req, res) => {
    let requestExist
    const senderId = req.user._id
    const receiverId = req.params.id

    Legend.findById(receiverId).then(user => {
        for (let request of user.friendRequests) {
            if (request.requester == senderId) {
                return res.status(400).send()
            }
        }
    })

    if (!requestExist) {
        const friendRequestSent = {
            to: receiverId
        }

        const friendRequest = {
            requester: senderId,
            username: req.user.username,
            profilePicture: req.user.profilePicture
        }

        Legend.findByIdAndUpdate(
            receiverId,
            { $push: { friendRequests: friendRequest }},
            { safe: true, new: true },
            err => {
                if (err) {
                    console.error(err)
                    res.status(400).send()
                }
            }
        )

        Legend.findByIdAndUpdate(
            senderId,
            { $push: { friendRequestsSent: friendRequestSent }},
            { safe: true, new: true },
            err => {
                if (err) {
                    console.log(err)
                    return res.status(400).send()
                }
                res.send(receiverId)
            }
        )
        if (connectedUsers[receiverId]) {
            connectedUsers[receiverId].map(socketId =>
                io.to(socketId).emit('friendRequest', req.user.username)
            )
        }
    }
})

router.post('/acceptFriendRequest/:id', (req, res) => {
    const accepterId = req.user._id
    const senderId = req.params.id
    console.log('accept')

    Legend.update(
        { _id: accepterId },
        { $pull: { friendRequests : { requester: senderId }}},
        err => {
            if(err) console.log(err)
    })

    Legend.update(
        { _id: senderId },
        { $pull: { friendRequestsSent : { to: accepterId }}},
        err => {
            if(err) console.log(err)
    })

    Legend.update(
        {_id: accepterId}, {
        $push : { friends : { _id: senderId }}},
        (err, doc) => {
            if(err) console.log(err)
    })

    Legend.update(
        {_id: senderId},
        { $push: { friends : { _id: accepterId }}},
        (err, doc) => {
            if(err) console.log(err)
            res.send(senderId)
    })
    
    if (connectedUsers[senderId]) {
        connectedUsers[senderId].map(socketId => 
            io.to(socketId).emit('acceptFriendRequest', req.user.username)
        )
    }
})

router.post('/declineFriendRequest/:id', (req, res) => {
    const declinerId = req.user._id
    const senderId = req.params.id

    Legend.update(
        { _id: declinerId },
        { $pull: { friendRequests : { requester: senderId }}},
        (err, doc) => {
            if(err) console.log(err)
    })

    Legend.update(
        { _id: senderId },
        { $pull: { friendRequestsSent : { to: declinerId }}},
        (err, doc) => {
            if(err) console.log(err)
            res.send(senderId)
    })
})

router.post('/cancelFriendRequest/:id', (req, res) => {
    const declinerId = req.user._id
    const senderId = req.params.id

    Legend.update(
        { _id: declinerId },
        { $pull: { friendRequestsSent : { to: senderId }}},
        (err, doc) => {
            if(err) console.log(err)
    })

    Legend.update(
        { _id: senderId },
        { $pull: { friendRequests: { requester: declinerId }}},
        (err, doc) => {
            if(err) console.log(err)
    })
    res.send(senderId)
})

// FIXME 
router.post('/removeFriend/:id', (req, res) => {
    console.log('remove')
})

module.exports = router