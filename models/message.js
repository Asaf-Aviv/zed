const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const MessageSchema = new Schema({
    from: {
        type: Schema.Types.ObjectId,
        require: true
    },
    to: {
        type: Schema.Types.ObjectId,
        require: true
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
    inTrash: {
        type: Boolean,
        default: false
    },
    new: {
        type: Boolean,
        default: true
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

module.exports = MessageSchema;