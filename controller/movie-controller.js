const Movie = require('../model/movie')
const Hall = require("../model/hall")
const Theater = require("../model/theater")
const Seat = require("../model/seat")


const listOfMovies = async (req, res, next) => {
    let movies
    try{
        movies = await Movie.find()
    }catch(err){
        console.log(err)
        res.status(500).json("Internal Server Error")
    }
    if(!movies) res.status(404).json({message: "No movie found"})
    return res.status(200).json({movies})
}

const addAMovie = async (req, res) => {
    const {name, price, theaterName, details,hallName, noOfShows} = req.body
    let movie
    try{
        movie = await Movie.findOne({name: name})
    }catch(err){
        return res.status(500).json("Internal Server Error")
    }
    if(movie) return res.status(400).json({message: "Movie already added..."})
    const hall = await ifHallAlreadyExists(req, res)
    const theater = await ifTheaterAlreadyExists(req, res)
    // console.log(ifHallExists, ifTheaterExists)
    if(!hall || !theater) return res.status(404).json({message: "Hall or theater not found"})
    let newMovie
    let hallLayout = hall.layout 
    const shows = []
    for(let idx=0;idx<noOfShows;idx++){
        var showLayout = [];
        for (var i = 0; i < hallLayout.length; i++)
            showLayout[i] = hallLayout[i].slice();
        shows.push(showLayout)
    }

    await saveSeatsPositions(name, noOfShows, hallLayout, res)
    
    try {
        newMovie = await new Movie({name: name, price: price, theater: theater, details: details,hall:hall, noOfShows: noOfShows, shows: shows})
        hall.movies.push(newMovie)
        theater.movies.push(newMovie) 
        hall.save()
        theater.save()
        newMovie.save()
    }catch(err){
        console.log(err)
        return res.status(500).json({message: "Internal server error"})
    }
    return res.status(201).json({message: "Movie added..."})
}

const ifHallAlreadyExists = async (req, res) => {
    
    let name = req.body.hallName
    
    let hall
    try{
        hall = await Hall.findOne({name: name})
    }catch(err){
        console.log(err)
    }
    console.log(hall, "----------------")
    return hall
}

const ifTheaterAlreadyExists = async (req, res) => {
    let name = req.body.theaterName
    let theater
    try{
        theater = await Theater.findOne({name: name})
    }catch(err){
        console.log(err)
    }
    return theater
}


const saveSeatsPositions = async(movie, slots, layout, res) => {
    
    let rows = layout.length
    let cols = layout[0].length
    const allSeats = []
    for(let slot = 0;slot<slots;slot++){
        number = 1
        for(let row = 0; row < rows; row++){
            for(let col = 0; col < cols; col++){
                const position = [row, col]
                let seat = {movie: movie, slot: slot, seatNumber: number, position: position}
                allSeats.push(seat)
                number += 1
                
            }
    }
}
    Seat.insertMany(allSeats, (err, seats) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Seats saved successfully:', seats);
        }
    });
}

module.exports = {listOfMovies, addAMovie}