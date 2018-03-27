const assert = require('assert');
const Legend = require('../models/user');

describe('Trying to create a duplicate value in a record', () => {

    beforeEach(done => {
        const user = new Legend({
            username: 'test',
            email: 'test@gmail.com',
            password: '123123123'
        });
    
        user.save().then(() => {
            done();
        });
    });

    it('Dosent create duplicate usernames', done => {

        const dupUsername = new Legend({
            username: 'test',
            email: 'test1@gmail.com',
            password: '123123123'
        });

        dupUsername.save(err => {
            assert.equal(err.errors.username, 'username already exists');
            done();
        });
    });

    it('Dosent create duplicate email users', done => {

        const dupEmail = new Legend({
            username: 'test1',
            email: 'test@gmail.com',
            password: '123123123'
        });

        dupEmail.save(err => {
            assert.equal(err.errors.email, 'email already exists');
            done();
        });
    });

    it('Creates duplicate passwords', done => {
        const dupPass = new Legend({
            username: 'test1',
            email: 'test1@gmail.com',
            password: '123123123'
        });
        dupPass.save().then( () => {
            Legend.find({ _id: dupPass._id }).then(result => {
                assert(result !== null);
                done();
            });
        });
    });
});