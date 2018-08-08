
const bluebird    = require('bluebird')
const redisClient = require('redis').createClient(process.env.REDIS_PORT, process.env.REDIS_URL)
redisClient.auth(process.env.REDIS_PASSWORD , err => {
  if (err) console.error(err)
})

bluebird.promisifyAll(redisClient)

module.exports = redisClient
