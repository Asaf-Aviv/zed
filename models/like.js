const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;

const LikeSchema = new Schema({
    from : {
        type: Schema.Types.ObjectId,
    },
    username: String,
    // add profile pic
});

module.exports = LikeSchema;