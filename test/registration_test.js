const assert = require('assert')
const Legend = require('../models/user')

describe('User Registration Tests', () => {

    it('Legit user', done => {

        const user = new Legend({
            username: 'test',
            email: 'test@gmail.com',
            password: '123123123'
        })

        user.save().then( () => {
            assert(user.isNew === false)
            done()
        })
    })
})