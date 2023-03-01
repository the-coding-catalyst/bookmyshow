const express = require('express')
const app = express()
const mongoose = require('mongoose')
const hallRouter = require('./routes/hall-route')
const movieRouter = require('./routes/movie-route')
const { theaterRouter } = require('./routes/theater-route')
const ticketRouter = require('./routes/ticket-route')

mongoose.connect('mongodb+srv://ramit:ramit@cluster0.8fdlu.mongodb.net/Ticket?retryWrites=true&w=majority', (err)=>{
    if(err){
        console.log("Can't connect to DB", err)
    }else console.log("connected to db") 
})
process.env.PORT = 5000
app.use(express.json())
app.use("/movie", movieRouter)
app.use("/hall", hallRouter)
app.use("/theater", theaterRouter)
app.use("/ticket", ticketRouter)
app.listen(process.env.PORT || 5000, ()=>{console.log("Server started at port:", process.env.PORT)})