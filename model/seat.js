const mongoose = require('mongoose')

const seatSchema = new mongoose.Schema({
    seatNumber: {
        type: String, 
        required: true 
    },
    position: { 
        type: [Number], 
        required: true 
    },
    movie: {
        type: String,
        required: true
    },
    slot: {
        type: Number,
        required: true
    }
  });

module.exports = mongoose.model("Seat", seatSchema)
  