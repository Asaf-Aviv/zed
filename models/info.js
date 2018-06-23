const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const InfoSchema = new Schema({
    _id: false,
    firstName: String,
    lastName: String,
    country: String,
    about: String,
    gender: String,
});

module.exports = InfoSchema;