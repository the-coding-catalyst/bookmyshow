const express = require('express')
const { addMovieHall, getHallLayout, getHallsInfo } = require('../controller/hall-controller')
const hallRouter = express.Router()

hallRouter.post("/add", addMovieHall)
hallRouter.get("/layout/:name", getHallLayout)
hallRouter.get("/", getHallsInfo)

module.exports = hallRouter


