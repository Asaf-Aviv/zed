const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const CommentSchema = new Schema({
    parentId: Schema.Types.ObjectId,
    author: {
        _id: Schema.Types.ObjectId,
        username: String,
        profilePic: String
    },
    body: {
        type: String,
        require: true
    },
    likeCount: {
        type: Number,
        default: 0
    },
    likes: [],
    comments: [],
    created: {
        type: Date,
        default: Date.now
    }
})

module.exports = CommentSchema