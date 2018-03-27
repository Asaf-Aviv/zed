const assert = require('assert');
const Legend = require('../models/user');

describe('Updating a user', () => {

    let user;

    beforeEach(done => {
        user = new Legend({
            username: 'test',
            email: 'test@gmail.com',
            password: '123123123',
            posts: []
        });
    
        user.save().then(() => {
            done();
        });
    });

    it('Updates users username', done => {
        Legend.findOneAndUpdate({ username: user.username }, { username: 'test1' })
        .then( () => {
            Legend.findOne({ _id: user._id }).then(result => {
                assert(result.username === 'test1');
                done();
            });
        });
    });

    it('Updates users email', done => {
        Legend.findOneAndUpdate({ email: user.email }, { email: 'test1@gmail.com' })
        .then( () => {
            Legend.findOne({ _id: user._id }).then(result => {
                assert(result.email === 'test1@gmail.com');
                done();
            });
        });
    });
});