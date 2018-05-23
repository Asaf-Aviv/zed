
const bluebird    = require('bluebird');
const redisClient = require('redis').createClient();

bluebird.promisifyAll(redisClient);
bluebird.promisifyAll(redisClient);

module.exports = redisClient;