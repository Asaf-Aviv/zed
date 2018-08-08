const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const IdeaSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Idea = mongoose.model('ideas', IdeaSchema)
module.exports = Idea