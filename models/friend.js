const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const FriendSchema = new Schema({
    _id: false,
    _id: {
        type: Schema.Types.ObjectId
    }
});

module.exports = FriendSchema;