const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;

const MyCommentsSchema = new Schema({
    _id : {
        type: Schema.Types.ObjectId,
    }
});

module.exports = MyCommentsSchema;