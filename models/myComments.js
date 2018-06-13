const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;

const MyCommentsSchema = new Schema({
    posterId: Schema.Types.ObjectId,
    postId: Schema.Types.ObjectId,
    _id: Schema.Types.ObjectId,
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = MyCommentsSchema;