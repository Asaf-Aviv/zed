const assert = require('assert')
const Legend = require('../models/user')

describe('Updating user posts', () => {

    let user
    
    beforeEach(done => {
        user = new Legend({
            username: 'test',
            email: 'test@gmail.com',
            password: '123123123',
            posts: [{body: 'My First Post'}]
        })
        user.save().then(() => {
            done()
        })
    })

    it('Adding a post', done => {
        Legend.findByIdAndUpdate(user._id, 
            { $push: { posts: { author: user.username, body: 'My Second Post' }}},
            { safe: true, new: true }, (err, updatedUser) => {
                assert(updatedUser.posts.length === 2)
                done()
            })
    })

    it('Deleting a post', done => {
        Legend.findByIdAndUpdate(user._id, 
            { $pull: { posts: { _id: user.posts[0]._id}}},
            { safe: true, new: true }, (err, updatedUser) => {
                assert(updatedUser.posts.length === 0)
                done()
            })
    })
})