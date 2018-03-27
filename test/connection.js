const mongoose = require('mongoose');
const assert = require('assert');
require('dotenv').config();

mongoose.Promise = require('bluebird');

// Connect to DB before tests run
before(done => {
    mongoose.connect(process.env.MONGO_ADMIN);
    mongoose.connection.once('open', () => {
        console.log("Conneted to DB");
        done();
    }).on('error', err => {
        console.log('connection error: ', err);
    });
});

beforeEach(done => {
    // drop DB before each test
    mongoose.connection.collections.users.drop( () => {
        done();
    });
});

after(done => {
    mongoose.connection.collections.users.drop( () => {
        mongoose.disconnect();
        done()  ;
    });
});