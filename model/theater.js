const mongoose = require('mongoose')

const theaterSchema = new mongoose.Schema({
    halls : [{
        type: mongoose.Types.ObjectId,
        ref: "Hall",
        required: true
    }],

    movies: [{
        type: mongoose.Types.ObjectId,
        ref: "Movie",
        required: true
    }],
    name: {
        type: String,
        required: true
    }
}
)

module.exports = mongoose.model("Theater", theaterSchema)