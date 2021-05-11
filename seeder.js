const fs=require('fs')
const mongoose = require('mongoose')
const colors= require ('colors')
const dotenv= require ('dotenv')
//env bring in
dotenv.config({path:'./config/config.env'})
//models
const Bootcamp= require ('./models/Bootcamp')
const Course=require ('./models/Course')
const User=require ('./models/User')
const Review=require ('./models/Review')
mongoose.connect(process.env.DB_ENV,{
    useNewUrlParser: true ,
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify:false
   })
   //read json file
   const bootcamps=JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'))
    const courses=JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'))
    const users=JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`,'utf-8'))
    const reviews=JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`,'utf-8'))
   //import bootcamps
   const importData=async ()=>{
       try{
       await Bootcamp.create(bootcamps);
       await Course.create(courses);
       await User.create(users);
       await Review.create(reviews);
       console.log("data imported".green.inverse)
       process.exit()
       }
       catch(err){
           console.error(err)
       }
   }
   
   //delete bootcamps
   const deleteData=async ()=>{
    try{
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("data deleted".red.inverse)
    process.exit()
    }
    catch(err){
        console.error(err)
    }
}
if(process.argv[2] ==='-i'){
    importData()
}
else if(process.argv[2]==='-d'){
    deleteData()
}