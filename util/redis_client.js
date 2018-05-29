
const bluebird    = require('bluebird');
const redisClient = require('redis').createClient();

bluebird.promisifyAll(redisClient);

module.exports = redisClient;