const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;

const LikeSchema = new Schema({
    _id : {
        type: Schema.Types.ObjectId,
    }
});

module.exports = LikeSchema;