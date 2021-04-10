const mongoose = require('mongoose')
const Bootcamp=require('../models/Bootcamp')
const slugify=require ('slugify')
const CourseSchema=new mongoose.Schema({
    title:{
        type: String,
        trime:true,
        required:[true,"Please add title"],
        maxlength:[100,"title must not be more than 100"]
    },
    description:{
        type: String,
        required:true,
        maxlength:[500,"description must not be more than 500"]
    },
    weeks:{
        type: String,
        required:true,         
    },
    tuition:{
        type: String,
        required:true, 
    },
    minimumSkill:{
        type:String,
        enum:[
            "beginner",
            "intermediate",
            "advance"
    ]},
    scholarshipsAvailable:{
        type:Boolean,
        default: false
    },
    CreatedAt:{
        type:Date,
        default:Date.now,
    },
    bootcamp:{
        type:mongoose.Schema.ObjectId,
        ref:'Bootcamp',
        required:true
    }

    }

)
module.exports=mongoose.model("Course",CourseSchema)