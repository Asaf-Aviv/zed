const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const MatchSchema = new Schema({
    gameId: { type: [ Number ], unique: true, index: true }}, {strict: false})

// MatchSchema.index({ 'gameId': 1 }, { name: 'gameId' })
const Match = mongoose.model('matches', MatchSchema)
module.exports = Match