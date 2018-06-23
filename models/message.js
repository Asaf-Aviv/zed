const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const MessageSchema = new Schema({
    author: {
        _id: {
            type: Schema.Types.ObjectId,
            required: true
        },
        username: {
            type: String,
            required: true
        }
    },
    to: {
        _id: Schema.Types.ObjectId,
        username: String
    },
    subject: {
        type: String,
        require: true
    },
    body: {
        type: String,
        require: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    inBookmark: {
        type: Boolean,
        default: false
    },
    read: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

module.exports = MessageSchema;