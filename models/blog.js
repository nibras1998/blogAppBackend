const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
    imageurl:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
},{
    collection:"blogInfo"
})

module.exports = mongoose.model("blogInfo",blogSchema)