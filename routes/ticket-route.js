const express = require('express')
const { getMovieShowLayout, bookATicket, bookGroupTicket } = require('../controller/ticket-controller')
const ticketRouter = express.Router()

ticketRouter.post("/layout/", getMovieShowLayout)
ticketRouter.post("/book", bookATicket)
ticketRouter.post("/group", bookGroupTicket)
module.exports = ticketRouter