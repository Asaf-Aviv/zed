const assert = require('assert')
const Legend = require('../models/user')

describe('Updating a record to a duplicate value', () => {

    let user1
    let user2

    beforeEach(done => {
        user1 = new Legend({
            username: 'test',
            email: 'test@gmail.com',
            password: '123123123',
            posts: []
        })
    
        
        user2 = new Legend({
            username: 'test1',
            email: 'test1@hotmail.com',
            password: '123123123',
            posts: []
        })
    
        user1.save().then( () => {
            user2.save().then(() => {
                done()
            })
        })
    })

    it('Dosent update username that already exists', done => {
        Legend.findOneAndUpdate({ _id : user1._id}, { username: 'test' }, { runValidators: true }, err => {
            assert.equal(err.errors.username, 'username already exists')
            done()
        })
    })

    it('Dosent update email that already exists', done => {
        Legend.findOneAndUpdate({ _id : user1._id}, { email: 'test@hotmail.com' }, { runValidators: true }, err => {
            assert.equal(err.errors.email, 'email already exists')
            done()
        })
    })
})