const Movie = require("../model/movie")
const Seat = require("../model/seat")
const Theater = require("../model/theater")

const getLayoutHelper = (layout, res) => {
    let rows = layout.length
    let isles = 6
    let cols = 3
    let grid = ""
    for (let row = 0; row < rows; row++) {
        let column = ""
        for(let col = 0;col< cols;col++){
            let isle = ""
            for(let idx = 0; idx< isles; idx++){
                isle += layout[row][col*isles + idx] + " "
            }
            column += isle + "|"
            
        }
        res.write(`${column}\n`)
        
        // grid += column
        
    }
    res.send()
    return res.status(200)
}
const getMovieShowLayout = async (req, res) => {
    const {name, slot} = req.body
    let movie
    try{
        movie = await Movie.findOne({name: name})
    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
    if(!movie) return res.status(404).json({message: "Movie not found"})
    let totalSlots = movie.noOfShows
    if(slot < 0 || slot > totalSlots) return res.status(400).json({message: "Invalid slot selection"})
    let layout = movie.shows[slot-1]
    layout = getLayoutHelper(layout, res)


}

const bookATicket = async (req, res) => {
    const {movieName, slot, seatNumber, theaterName} = req.body
    await bookticketHelper(movieName, slot, seatNumber, theaterName, req, res)
    return res.status(200).json({message: "Seat booked succesfully"})
    
}

const bookTicketHelper = async (movieName, slot, seatNumber, theaterName, req, res) => {
    
    let movie, theater
    try{
        theater = await Theater.findOne({name: theaterName})
    }catch(err){
        console.log(err)
        return res.status(500).json({err})
    }
    if(!theater) return res.status(404).json({message: "Theater not found.."})
    try{
        movie = await Movie.findOne({name: movieName, theater: theater})
    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
    // console.log(movie,movieName, req.body,"------------")
    if(!movie) return res.status(404).json({message: "Movie not found.."})
    let totalSlots = movie.noOfShows
    let rows = movie.rows
    if(seatNumber < 1 || seatNumber > rows*6*3) return res.status(400).json({message: "Invalid seat number"})
    if (slot < 1 || slot > totalSlots) return res.status(400).json({message: "Invalid slot selection"})
    let seatObject
    try{
        seatObject = await Seat.findOne({movie: movieName, seatNumber: seatNumber, slot: slot})
    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
    console.log(seatObject)
    const position = seatObject.position
    const layout = movie.shows[slot-1]
    let row = position[0], col = position[1]
    if(layout[position[0]][position[1]] == 0) return res.status(400).json({message: "Seat already booked"})
    Movie.updateOne(
        { _id: movie.id },
        { $set: { [`shows.${slot-1}.${row}.${col}`]: 0 } },
        (err, result) => {
          if (err) {
            console.error(err);
          } else {
            console.log(result);
          }
        }
      );
    await movie.save()
    // console.log(movie.shows[slot-1][row][col], position)
    return 


}

const bookGroupTicket = async (req, res) => {
    const {movieName, slot, theaterName, totalTickets} = req.body
    let theater 
    try{
        theater = await Theater.findOne({name: theaterName})
    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
    if(!theater) return res.status(404).json("Theater not found")
    let movie
    try{
        movie = await Movie.findOne({name: movieName, theater: theater})
    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
    if(!movie) return res.status(404).json({message:"movie not found...."})
    const positions = await findEmptySeats(movie, slot, totalTickets)
    if(positions){
        for(let idx= 0; idx < positions.length; idx++){
            let seatNumber = positions[idx]
            await bookTicketHelper(movieName, slot, seatNumber, theaterName, req, res)
        }
        return res.status(201).json({message:"Ticket booked successfuly"})
    }
    else{
        for(let newSlot = 0; newSlot < movie.shows.length; newSlot++){
            let result = 0
            if(newSlot != slot){
                const positions = await findEmptySeats(movie, newSlot, totalTickets)
                result = newSlot
            }
            if(positions){
                return res.status(200).json({message: `No Seats found for this show. Try ${result} slot`})
            }
        }
        return res.status(404).json({message: "No vacant seats for this group size"})
    }

}

const findEmptySeats = async (movie, slot, totalTickets) => {
    const layout = movie.shows[slot-1]
    let rows = layout.length
    let cols = 3
    let isles = 6
    console.log(totalTickets, isles, movie.hall.rows)
    if(totalTickets > isles) return null
    let seatNumber = 1
    const result = []
    for(let row = 0; row < rows; row ++){
        for(let col = 0; col < cols; col++){
            for(let isle = 0; isle < isles; isle ++){
                let index
                index = isles * col + isle
                console.log("row", row, "col", col, "isle", isle)
                if(index+totalTickets<=(col+1)*isles){
                    
                    const array = layout[row].slice(index, index+totalTickets)
                    
                    if(!array.includes(0)){
                        for(let i = 0; i < totalTickets; i++){
                            result.push(seatNumber)
                            seatNumber += 1
                        }
                        return result
                    }

                }
                seatNumber += 1
            }
                
            
        }
    }
    return null
}


module.exports = {getMovieShowLayout, bookATicket, bookGroupTicket}