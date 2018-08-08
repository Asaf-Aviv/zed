const express = require('express')
const router  = express.Router()
const Legend  = require('../models/user')

router.post('/:receiverId', (req, res) => {
    const receiverId = req.params.receiverId
    const senderId = req.user._id

    if (senderId == receiverId) return res.sendStatus(400)
    
    const message = {
        author: {
            _id: senderId,
            username: req.user.username,
            profilePicture: req.user.profilePicture
        },
        to: {
            _id: receiverId,
            username: req.body.username
        },
        subject: req.body.subject,
        body: req.body.body
    }

    Legend.findByIdAndUpdate(
        receiverId, 
        {
            $push: {
                messages: {
                    $each: [ message ],
                    $position: 0
                }
            }
        }, 
        (err, user) => {
        if (err) console.log(err)
        
        if (connectedUsers[receiverId]) {
            connectedUsers[receiverId].map(socketId =>
                io.to(socketId).emit('newMessage', req.user.username)
            )
        }
        Legend.findByIdAndUpdate(
            senderId, 
            {
                $push: {
                    messages: {
                        $each: [ message ],
                        $position: 0
                    }
                }
            },
            err => {
            if (err) console.log(err)
        })
        res.send()
    })
})

router.patch('/bookmark/:msgId', async (req, res) => {
    const msgId = req.params.msgId
    const userId = req.user._id

    const doc = await Legend.findOne({ _id: userId, 'messages._id': msgId }, 'messages.$')
    
    const isInBookmark = doc.messages[0].inBookmark
    console.log(isInBookmark)

    Legend.findOneAndUpdate(
        {
            _id: userId, 'messages._id': req.params.msgId
        },
        {
            $set: {
                'messages.$.inBookmark': !isInBookmark
            }
        },
        err => {
            if (err) res.sendStatus(404)
            res.send(!isInBookmark)
        })
})

router.delete('/:msgId', (req, res) => {
    Legend.findOneAndUpdate(
    {
        _id: req.user._id, 'messages._id': req.params.msgId
    },
    {
        $set: {
            'messages.$.isDeleted': true
        }
    },
    err => {
        if (err) console.log(err)
        res.send()
    })
})

module.exports = router