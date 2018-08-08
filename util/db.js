const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_ADMIN)
const db = mongoose.connection

db.on('error', console.error.bind(console, 'DB connection error:'))
db.once('open', () => {
    console.log("Conneted to DB")
})

module.exports = db
