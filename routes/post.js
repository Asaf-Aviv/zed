const express  = require('express')
const router   = express.Router()
const Zed      = require('../models/user')
const pug      = require('pug')
const mongoose = require('mongoose')

// Edit post route
router.get('/edit/:id', (req, res) => {
    Zed.findById(req.user._id, (err, user) => {
        let post = user.posts.id(req.params.id)
        res.render('edit_post', {
            title: 'Edit | Zed',
            post,
        })
    })
})

// Edit a post
router.post('/edit/:id', (req, res) => {
    Zed.update(
        { 'posts._id': req.params.id },
        { $set: { 'posts.$.body': req.body.postBody }},
        err => {
            if (err) console.error(err)
            res.redirect('/profile')
        })
})

// Publish a post
router.post('/', (req, res) => {
    Zed.findByIdAndUpdate(
        req.user._id,
        {
            $push: {
                posts: {
                    $each: [{
                        author: {
                            username: req.user.username,
                            _id: req.user._id,
                        },
                        body: req.body.postBody
                    }],
                    $position: 0
                }
            }
        },
        err => {
            if (err) console.error(err)
            res.redirect('/profile')
        })
})

// Delete a post
router.delete('/:id', (req, res) => {
    Zed.findByIdAndUpdate(
        req.user._id, {
            $pull: {
                posts: {
                    _id: req.params.id
                }
            }
        },
        err => {
            if (err) console.error(err)
            res.send()
        })
})

// Like or Dislike a post
router.post('/like/:postId', (req, res) => {
    const postId = req.params.postId
    const userId = req.user._id

    Zed.find(
        { 'posts._id': postId },
        'posts.$',
        (err, doc) => {
            console.log(err, doc)
            if (err || !doc.length) {
                return res.status(404).send("It looks like this post has been deleted, Try refreshing the page.")
            }
            const alreadyLike = doc[0].posts[0].likes.some(like => like.from.toString() == userId)

            if (alreadyLike) {
                Zed.update(
                    { 'posts._id': postId} , 
                    {
                        $inc: { 'posts.$.likeCount' : -1},
                        $pull: { 'posts.$.likes': { from: userId }}
                    },
                    err => {
                        if (err) console.error(err)
                        res.send('-1')
                })
                
                Zed.findByIdAndUpdate(
                    userId,
                    { $pull: { myLikes: { postId, }}},
                    err => {
                        if (err) console.error(err)
                })
            } else {
                Zed.update(
                    { 'posts._id': postId},
                    {
                        $inc: { 'posts.$.likeCount' : 1 },
                        $push: {'posts.$.likes': { 
                            from: userId,
                            username: req.user.username
                        }}
                    },
                    err => {
                        if (err) console.error(err)

                        Zed.find(
                            { 'posts._id': postId },
                            (err, user) => {
                                if (connectedUsers[user[0]._id] && user[0]._id!= req.user._id.toString()) {
                                    connectedUsers[user[0]._id].map(socketId => 
                                        io.to(socketId).emit('likePost', req.user.username)
                                    )
                                }
                                res.send('1')
                            })
                    })

                    Zed.findByIdAndUpdate(
                        userId,
                        { $push: { myLikes:{ $each: [{ postId, }], $position: 0}}},
                        err => {
                            if (err) console.error(err)
                    })
            }
        })
})

// Comment
router.post('/comment/:postId', (req, res) => {
    const postId = req.params.postId
    const comment = {
        _id: mongoose.Types.ObjectId(),
        parentId: postId,
        author: {
            _id: req.user._id,
            username: req.user.username,
            // add profile picture
        },
        body: req.body.commentBody,
        likes: []
    }
    const newCommentId = comment._id

    Zed.findOneAndUpdate(
        { 'posts._id': postId },
        { $push: { 'posts.$.comments': comment }},
        { new: true },
        (err, user) => {
            console.log(err, user)
            if (err || !user) {
                console.error(err)
                return res.status(404).send('It looks like this post has been deleted, Try refreshing the page.')
            }
            if (connectedUsers[user._id] && user._id != req.user._id.toString()) {
                connectedUsers[user._id].map(socketId =>
                    io.to(socketId).emit('comment', req.user.username)
                )
            }

            Zed.findByIdAndUpdate(
                req.user._id,
                { 
                    $push: {
                        myComments: {
                            $each: [{
                                posterId: user._id,
                                postId,
                                _id: newCommentId
                            }],
                            $position: 0
                        }
                    }
                },
                err => {
                    if (err) {
                        console.error(err)
                        return res.sendStatus(404)
                    } 
                    res.send(pug.renderFile('views/partials/comment.pug', {
                        comment,
                        currentUser: req.user
                    }))
                }
            )
        })
})

// Like or Dislike a comment
router.post('/comment/like/:postId', (req, res) => {
    const postId = req.params.postId
    const commentId = req.body.commentId
    const userId = req.user._id

    Zed.findOne(
        { 'posts.comments._id': commentId },
        { 'posts.$': 1, _id: 0 },
        (err, post) => {
            if (err || !post) res.status(404).send("It looks like this comment or post has been deleted")
            
            const commentIndex = post.posts[0].comments.findIndex(c => c._id == req.body.commentId)
            const authorId = post.posts[0].comments[commentIndex].author._id
            const alreadyLike = post.posts[0].comments[commentIndex].likes.some(l => l.from == userId.toString())

            if (alreadyLike) {
                Zed.findOneAndUpdate(
                    { 'posts.comments._id': commentId }, 
                    {
                        $inc: { [`posts.$.comments.${commentIndex}.likeCount`] : -1 },
                        $pull: { [`posts.$.comments.${commentIndex}.likes`]: { from: userId }}
                    },
                    err => {
                        if (err) {
                            console.error(err)
                            res.sendStatus(404)
                        }
                })

                Zed.findByIdAndUpdate(
                    userId,
                    { $pull: { myLikes: { postId, }}},
                    err => {
                        if (err) {
                            console.error(err)
                            res.sendStatus(404)
                        }
                    }
                )
                res.send('-1')
            } else {
                Zed.findOneAndUpdate(
                    { 'posts.comments._id': commentId }, 
                    {
                        $inc: { [`posts.$.comments.${commentIndex}.likeCount`]: 1},
                        $push: { [`posts.$.comments.${commentIndex}.likes`]: { 
                            from: userId,
                            username: req.user.username
                        }}
                    },
                    err => {
                        if (err) {
                            console.error(err)
                            res.sendStatus(404)
                        }
                        if (connectedUsers[authorId] && authorId != req.user._id.toString()) {
                            connectedUsers[authorId].map(socketId => 
                                io.to(socketId).emit('likeComment', req.user.username)
                            )
                        }
                    }
                )

                Zed.findByIdAndUpdate(
                    userId,
                    { $push: { myLikes:{ $each: [{ postId, }], $position: 0 }}},
                    err => {
                        if (err) {
                            console.error(err)
                            res.sendStatus(404)
                        }
                    }
                )
                res.send('1')
            }
        })
})

// Delete a comment
router.delete('/comment/:id', (req, res) => {
    const commentId = req.params.id

    Zed.findOneAndUpdate(
        { 'posts.comments._id': commentId },
        { $pull: { 'posts.$.comments': { _id: commentId }}},
        err => {
            if (err) {
                console.error(err)
                res.sendStatus(404)
            }
        }
    )

    Zed.findByIdAndUpdate(
        req.user._id,
        { $pull: { myComments: { _id: commentId }}},
        err => {
            if (err) {
                console.error(err)
                res.sendStatus(404)
            }
        }
    )
    res.send()
})

module.exports = router