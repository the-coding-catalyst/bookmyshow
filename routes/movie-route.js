const express = require('express')
const { listOfMovies, addAMovie } = require('../controller/movie-controller')
const movieRouter = express.Router()


movieRouter.get("/", listOfMovies)
movieRouter.post("/add", addAMovie)

module.exports = movieRouter