const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const Legend = require('../models/user')

router.get('/edit/:id', (req, res) => {
    Legend.findById(req.user._id, (err, user) => {
        let post = user.posts.id(req.params.id)
        res.render('edit_post', {
            title: 'Edit | Legends',
            post,
        })
    })
});

router.post('/', (req, res) => {
    Legend.findByIdAndUpdate(req.user._id, 
        { $push: { posts: { '$each': [{author: req.user.username, body: req.body.postBody}], '$position': 0 }}},
        { safe: true, new: true }, (err, updatedUser) => {
            if (err) console.log(err)

            res.redirect('/profile')
        })
});

router.post('/edit/:id', (req, res) => {
    Legend.update({ "posts._id" : req.params.id },
        { $set: { "posts.$.body": req.body.postBody }}, (err, result) => {
            if (err) console.log(err)
            res.redirect('/profile')
    })
});

router.delete('/:id', (req, res) => {
    Legend.findByIdAndUpdate(req.user._id, 
        { $pull: { posts: { _id: req.params.id}}},
        { safe: true, new: true }, (err, updatedUser) => {
            if(err) console.log(err)
            res.send()
        })
})

router.post('/like/:id', (req, res) => {
    console.log('request')
    console.log(req.params.id)
    Legend.update({ "posts._id" : req.params.id },
        { $inc: { "posts.$.likes": 1 }}, (err, result) => {
            if (err) console.log(err)
            res.send()
    })
})

module.exports = router