const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendRequestSchema = new Schema({
    _id: false,
    requester: {
        type: Schema.Types.ObjectId
    },
    username: String,
    profilePicture: String,
    pending: {
        type: Boolean,
        default: true
    }
});

module.exports = FriendRequestSchema;