const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    timings: [{
        type: Date,
        required: true
    }],
    details: [{
        type: String,
        required: true
    }],
    price: {
        type: Number,
        required: true
    },
    theater: {
        type: mongoose.Types.ObjectId,
        ref: "Theater",
        required: true
    },
    hall: {
        type: mongoose.Types.ObjectId,
        ref: "Theater",
        required: true
    },
    shows: [[[Number]]],
    noOfShows: {type: Number, required: true},
    seats: {
        
    }
})

module.exports = mongoose.model("Movie", movieSchema)