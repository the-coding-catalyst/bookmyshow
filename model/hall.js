const mongoose = require('mongoose')

const hallSchema = new mongoose.Schema({
    seats:{
        type: Number,
        required: true
    },
    rows: {
        type: Number,
        required: true
    },
    cols: {
        type: Number,
        required: false,
        default: 3
    },
    isles: {
        type: Number,
        required: false,
        default: 6
    },
    movies: [{
        type: mongoose.Types.ObjectId,
        ref: "Movie",
        required: true
    }],
    name: {
        type: String,
        required: true
    },
    theater: {
        type: mongoose.Types.ObjectId,
        ref: "Theater",
        required: true
    },
    layout: [[Number]]
   
}
)

module.exports = mongoose.model("Hall", hallSchema)