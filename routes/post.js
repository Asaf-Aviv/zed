const express  = require('express');
const router   = express.Router();
const Post     = require('../models/post');
const Legend   = require('../models/user');
const mongoose = require('mongoose');

// Edit post route
router.get('/edit/:id', (req, res) => {
    Legend.findById(req.user._id, (err, user) => {
        let post = user.posts.id(req.params.id);
        res.render('edit_post', {
            title: 'Edit | Legends',
            post,
        });
    });
});

// Publish a post
router.post('/', (req, res) => {
    Legend.findByIdAndUpdate(
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
        {
            safe: true,
            new: true
        },
        (err, updatedUser) => {
            if (err) console.log(err);
            res.redirect('/profile');
        });
});

// Edit a post
router.post('/edit/:id', (req, res) => {
    Legend.update({
            'posts._id': req.params.id
        }, {
            $set: {
                'posts.$.body': req.body.postBody
            }
        },
        (err, result) => {
            if (err) console.log(err);
            res.redirect('/profile');
        });
});

// Delete a post
router.delete('/:id', (req, res) => {
    Legend.findByIdAndUpdate(
        req.user._id, {
            $pull: {
                posts: {
                    _id: req.params.id
                }
            }
        }, {
            safe: true,
            new: true
        },
        (err, updatedUser) => {
            if (err) console.log(err);
            res.send();
        });
});

// Like or Dislike a post
router.post('/like/:id', (req, res) => {
    Legend.find({
            'posts._id': req.params.id
        },
        'posts.$',
        (err, doc) => {
            if (err || !doc) res.status(404).send("It looks like this post has been deleted");
            const alreadyLike = doc[0].posts[0].likes.some(like => like.from.toString() == req.user._id);
            if (alreadyLike) {
                Legend.update({
                        'posts._id': req.params.id
                    }, 
                    {
                        $inc: { 'posts.$.likeCount' : -1},
                        $pull: { 'posts.$.likes': { from: req.user._id }}
                    },
                    err => {
                        if (err) console.log(err)
                        res.send('-1');
                });
                
                Legend.findByIdAndUpdate(
                    req.user._id,
                    {
                        $pull: {
                            myLikes: {
                                _id: req.params.id
                            }
                        }
                    },
                    (err, user) => {
                        if (err) console.log(err);
                });
            } else {
                Legend.update({
                        'posts._id': req.params.id
                    },
                    {
                        $inc: { 'posts.$.likeCount' : 1 },
                        $push: {'posts.$.likes': { 
                            from: req.user._id,
                            username: req.user.username
                        }}
                    },
                    err => {
                        if (err) console.log(err)
                        Legend.find({
                                'posts._id': req.params.id
                            },
                            (err, user) => {
                                if (connectedUsers[user[0]._id]) {
                                    connectedUsers[user[0]._id].map(socketId => 
                                        io.to(socketId).emit('likePost', req.user.username)
                                    )
                                }
                                res.send('1');
                            });
                    });

                    Legend.findByIdAndUpdate(
                        req.user._id,
                        {
                            $push: {
                                myLikes:{
                                    $each: [{
                                        _id: req.params.id
                                    }],
                                    $position: 0
                                }
                            }
                        },
                        (err, user) => {
                            if (err) console.log(err);
                    });
            }
        });
});

// Comment
router.post('/comment/:id', (req, res) => {
    const postId = req.params.id;

    Legend.findOneAndUpdate({
            'posts._id': postId
        },
        {
            $push: {
                'posts.$.comments': {
                    parentId: postId,
                    author: {
                        _id: req.user._id,
                        username: req.user.username,
                        // add profile picture
                    },
                    body: req.body.commentBody
                }
            }
        },
        { new: true },
        (err, user) => {
            if (err) console.log(err)
            res.send();
            if (connectedUsers[user._id]) {
                connectedUsers[user._id].map(socketId =>
                    io.to(socketId).emit('comment', req.user.username)
                )
            }

            const postIndex = user.posts.findIndex(post => post._id.toString() === req.params.id);
            const newCommentId = user.posts[postIndex].comments[user.posts[postIndex].comments.length -1]._id

            Legend.findByIdAndUpdate(
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
                    if (err) console.log(err)
                });
        });
});

// Delete a comment
router.delete('/comment/:id', (req, res) => {
    const commentId = req.params.id;

    Legend.findOneAndUpdate(
        {
            'posts.comments._id': commentId
        },
        {
            $pull: {
                'posts.$.comments': { _id: commentId }
            }
        },
        (err, doc) => {
            if (err) {
                console.log(err);
            }
        }
    );

    Legend.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {
                myComments: { _id: commentId }
            }
        },
        (err, doc) => {
            if (err) {
                console.log(err)
            }
        }
    );
    res.send();
});

module.exports = router;