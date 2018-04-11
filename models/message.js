const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const MessageSchema = new Schema({
    to: {
        type: Schema.Types.ObjectId,
        require: true
    },
    from: {
        type: Schema.Types.ObjectId,
        require: true
    },
    body: {
        type: String,
        require: true
    },
    date: {
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
    }
});

module.exports = MessageSchema;