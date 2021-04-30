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
        type: Number,
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

//statics method to get avg of course tutions
CourseSchema.statics.getAverageCost=async function(bootcampId){
    console.log('cal')
    const obj=await this.aggregate([{
        $match:{
            bootcamp:bootcampId
        }
    },
    {
        $group:{
            _id:'$bootcamp',
            averageCost:{$avg:'$tuition'}
        }
    }]);
    console.log(obj)
    try{
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
            averageCost:Math.ceil(obj[0].averageCost/10)*10
        })
    }
    catch(err){
        console.log(err)
    }
};


//call getAverageCost after save
CourseSchema.post('save' ,function(){
    this.constructor.getAverageCost(this.bootcamp)
})

//call getAverageCost before remove
CourseSchema.pre('remove' ,function(){
    this.constructor.getAverageCost(this.bootcamp)
})
module.exports=mongoose.model("Course",CourseSchema)