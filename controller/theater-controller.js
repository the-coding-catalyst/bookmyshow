const Theater = require("../model/theater")
const addTheater = async (req, res) => {
    const {name} = req.body
    let theater
    try{
        theater = await Theater.findOne({name:name})
    }catch(err){
        console.log(err)
        return res.status(500).json({message: "Internal Server error"})
    }
    if(theater) return res.status(400).json({message: "Theater name already in use.."})
    let newTheater = await new Theater({name: name, movies: [], halls: []})
    await newTheater.save()
    return res.status(201).json({message: "Theater added succesfully"})
}

const allTheaters = async (req, res) => {
    let result 
    try {
        result = await Theater.find()
    }catch(err){
        console.log(err)
        return res.status(500).json({message: "Internal server error"})
    }
    return res.status(200).json(result)

}


module.exports = {allTheaters, addTheater}