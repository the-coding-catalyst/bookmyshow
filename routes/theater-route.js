const express = require('express')
const { allTheaters, addTheater } = require('../controller/theater-controller')
const theaterRouter = express.Router()

theaterRouter.get("/", allTheaters)
theaterRouter.post("/add", addTheater)

module.exports = {theaterRouter}