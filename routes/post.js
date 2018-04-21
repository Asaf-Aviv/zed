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
        req.user._id, {
            $push: {
                posts: {
                    $each: [{
                        author: req.user.username,
                        authorId: req.user._id,
                        body: req.body.postBody
                    }],
                    $position: 0
                }
            }
        }, {
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
            if (err || !doc) res.status(400).send("It looks like this post has been deleted");
            const alreadyLike = doc[0].posts[0].likes.some(like => like._id.toString() == req.user._id);
            console.log(alreadyLike);
            if (alreadyLike) {
                Legend.update({
                        'posts._id': req.params.id
                    }, 
                    {
                        $inc: { 'posts.$.likeCount' : -1},
                        $pull: { 'posts.$.likes': { _id: req.user._id }}
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
                        $push: {'posts.$.likes': { _id: req.user._id }}
                    },
                    err => {
                        if (err) console.log(err)
                        Legend.find({
                                'posts._id': req.params.id
                            },
                            (err, user) => {
                                io.to(connectedUsers[user[0]._id]).emit('likePost', req.user.username);
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
    Legend.findOneAndUpdate({
            'posts._id': req.params.id
        },
        {
            $push: {
                'posts.$.comments': {
                    from: {
                        _id: req.user._id,
                        username: req.user.username,
                    },
                    body: req.body.commentBody
                }
            }
        },
        { new: true },
        (err, user) => {
            if (err) console.log(err)
            res.send();
            io.to(connectedUsers[user._id]).emit('comment', req.user.username);

            const postIndex = user.posts.findIndex(post => post._id.toString() === req.params.id);
            const newCommentId = user.posts[postIndex].comments[user.posts[postIndex].comments.length -1]._id

            Legend.findByIdAndUpdate(
                req.user._id,
                { 
                    $push: {
                        myComments: {
                            $each: [{
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
    Legend.findOneAndUpdate(
        {
            'posts.comments._id': req.params.id
        },
        {
            $pull: {
                'posts.$.comments': { _id: req.params.id }
            }
        },
        (err, doc) => {
            if (err) console.log(err)
            res.send();
        }
    );

    Legend.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {
                myComments: { _id: req.params.id }
            }
        },
        (err, doc) => {
            if (err) console.log(err)
        }
    );
});

module.exports = router;