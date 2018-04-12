const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const BugSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Bug = mongoose.model('bugs', BugSchema);
module.exports = Bug;