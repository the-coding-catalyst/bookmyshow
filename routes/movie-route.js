const express = require('express')
const { listOfMovies, addAMovie, updateMoviePrice, deleteMovie } = require('../controller/movie-controller')
const movieRouter = express.Router()


movieRouter.get("/", listOfMovies)
movieRouter.post("/add", addAMovie)
movieRouter.put("/", updateMoviePrice)
movieRouter.delete("/", deleteMovie)

module.exports = movieRouter