const mongoose   = require('mongoose')
const Schema     = mongoose.Schema

const myLikesSchema = new Schema({
    postId : Schema.Types.ObjectId
})

module.exports = myLikesSchema