const mongoose = require('mongoose')
const ReviewSchema=new mongoose.Schema({
    title:{
        type: String,
        trime:true,
        required:[true,"Please add title"],
        maxlength:[100,"title must not be more than 100"]
    },
    text:{
        type: String,
        required:[true,"Please add some text"],
        maxlength:[500,"description must not be more than 500"]
    },
    rating:{
        type: Number,
        min:1,
        max:10,
        required:[true,"Please add rating between 1 and 10"]        
    },
    CreatedAt:{
        type:Date,
        default:Date.now,
    },
    bootcamp:{
        type:mongoose.Schema.ObjectId,
        ref:'Bootcamp',
        required:true
    },

    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    }

    }

)


module.exports=mongoose.model("Review",ReviewSchema)