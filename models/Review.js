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
ReviewSchema.index({bootcamp:1,user:1},{unique:true})


//statics method to get avg of course tutions
ReviewSchema.statics.getAverageRating=async function(bootcampId){
    const obj=await this.aggregate([{
        $match:{
            bootcamp:bootcampId
        }
    },
    {
        $group:{
            _id:'$bootcamp',
            averageRating:{$avg:'$rating'}
        }
    }]);
    try{
        if(obj[0]){
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
            averageRating:obj[0].averageRating
        },{ 
            new:true,
            runValidators:true
        })}
        else{
            await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
                averageRating:undefined
            },{ 
                new:true,
                runValidators:true
            })
            }
        }
    
    catch(err){
        console.log(err)
    }
};


//call getAverageCost after save
ReviewSchema.post('save' ,function(){
    this.constructor.getAverageRating(this.bootcamp)
})

//call getAverageCost before remove
ReviewSchema.pre('remove' ,function(){
    this.constructor.getAverageRating(this.bootcamp)
})

module.exports=mongoose.model("Review",ReviewSchema)