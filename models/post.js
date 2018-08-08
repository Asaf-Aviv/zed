const mongoose      = require('mongoose')
const Schema        = mongoose.Schema
const LikeSchema    = require('./like')
const CommentSchema = require('./comment')

const PostSchema = new Schema({
    author: {
        _id: Schema.Types.ObjectId,
        username: String
    },
    body: {
        type: String,
        required: true
    },
    comments: [ CommentSchema ],
    likeCount: {
        type: Number,
        default: 0
    },
    likes: [ LikeSchema ],
    shares: {
        type: Number,
        default: 0
    },
    created: {
        type: Date,
        default: Date.now
    },
    deleted: {
        type: Boolean,
        default: false
    }
})

module.exports = PostSchema