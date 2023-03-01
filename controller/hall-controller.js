const Hall = require("../model/hall")
const Theater = require("../model/theater")

const ifHallAlreadyExists = async (req, res) => {
    let name = req.body.name
    let hall
    try{
        hall = await Hall.findOne({name: name})
    }catch(err){
        console.log(err)
    }
    return hall
}
const addMovieHall = async (req, res) => {

    const {name, rows, theaterName} = req.body
    let hall
    let theater
    let hallExists = await ifHallAlreadyExists(req, res)
    if(hallExists) return res.status(400).json({message: "Hall already exists.."})
    try{
        theater = await Theater.findOne({name: theaterName})
    }catch(err){
        console.log(err)
        return res.status(500).json({err})
    }
    if(!theater) return res.status(400).json({message: "Theater doesn't exist..."})
    console.log(theater, "theater object")
     
    // console.log("request is here------------------")
    seats = rows*3*6
    const layout = createHallLayout(req, res)
    console.log(layout, "------------------------------")
    hall = await new Hall({name:name, rows: rows, seats: seats, movies: [], theater: theater, layout: layout})
    theater.halls.push(hall)
    await hall.save()
    return res.status(201).json({message: "Movie hall added"})
    
}

const getHallsInfo = async (req, res) => {
    let halls
    try {
        halls = await Hall.find()
    }
    catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
    return res.status(200).json(halls)
}




const getHallLayout = async (req, res) => {
    const name = req.params.name
    console.log(name, "name--------------")
    let hall 
    try{
        hall = await Hall.findOne({name:name})
    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
    const layout = hall.layout
    console.log(layout, "this is saved layout")
    let rows = hall.rows
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


const createHallLayout = (req, res) => {
    
    rows = req.body.rows
    cols = 3
    isleSize = 6
    let grid = []
    let position = 1
    for (let row = 0; row < rows; row++){
        column = []
        for(let col = 0; col < cols*isleSize; col ++){
            column.push(position)
            position += 1
        }
        grid.push(column)
        
    }
    return grid

}

module.exports = {getHallsInfo, getHallLayout, addMovieHall}