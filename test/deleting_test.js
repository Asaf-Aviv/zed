const assert = require('assert');
const Legend = require('../models/user');

describe('Deleting a record', () => {

    let user;

    beforeEach(done => {
        user = new Legend({
            username: 'test',
            email: 'test@gmail.com',
            password: '123123123'
        });
    
        user.save().then(() => {
            done();
        });
    });

    it('Deletes a user by username', done => {
        Legend.findOneAndRemove({ username: user.username }).then( () => {
            Legend.findOne({ username: user.username }).then(result => {
                assert(result === null);
                done();
            });
        });
    });

    it('Deletes a user by email', done => {
        Legend.findOneAndRemove({ email: user.email }).then( () => {
            Legend.findOne({ email: user.email }).then(result => {
                assert(result === null);
                done();
            });
        });
    });

    it('Deletes a user by ID', done => {
        Legend.findOneAndRemove({ _id: user._id }).then( () => {
            Legend.findOne({ _id: user._id }).then(result => {
                assert(result === null);
                done();
            });
        });
    });
});