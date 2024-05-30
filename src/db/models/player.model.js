const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: String,
    score: Number,
})

module.exports = mongoose.model('Player', studentSchema);