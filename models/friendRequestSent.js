const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FriendRequestSentSchema = new Schema({
    _id: false,
    to: {
        type: Schema.Types.ObjectId,
        required: true,
    }
})

module.exports = FriendRequestSentSchema