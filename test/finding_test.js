const assert = require('assert')
const Legend = require('../models/user')

describe('Finding a user', () => {

    let user

    beforeEach(done => {
        user = new Legend({
            username: 'test',
            email: 'test@gmail.com',
            password: '123123123'
        })
    
        user.save().then( () => {
            done()
        })
    })

    it('Finds a user by username', done => {
        Legend.findOne({ username: 'test' }).then(result => {
            assert(result.username === 'test')
            done()
        })
    })

    it('Finds a user by email', done => {
        Legend.findOne({ email: 'test@gmail.com' }).then(result => {
            assert(result.email === 'test@gmail.com')
            done()
        })
    })

    it('Finds a user by ID', done => {
        Legend.findOne({ _id: user._id }).then(result => {
            assert(result._id.toString() === user._id.toString())
            done()
        })
    })
})