const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;
const LikeSchema = require('./like');

const PostSchema = new Schema({
    author: String,
    authorId: {
        type: Schema.Types.ObjectId
    },
    body: String,
    comments: [],
    likeCount: {
        type: Number,
        default: 0
    },
    likes: [ LikeSchema ],
    shares: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

module.exports = PostSchema;