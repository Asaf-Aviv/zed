
const bluebird    = require('bluebird');
const redisClient = require('redis').createClient('13824', 'redis-13824.c17.us-east-1-4.ec2.cloud.redislabs.com');
redisClient.auth(process.env.REDIS_PASSWORD , err => {
  if (err) console.error(err)
})

bluebird.promisifyAll(redisClient);

module.exports = redisClient;