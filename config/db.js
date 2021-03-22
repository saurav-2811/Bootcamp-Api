const mongoose = require('mongoose')

const connectDb= async() =>{
   const conn=await mongoose.connect(process.env.DB_ENV,{
    useNewUrlParser: true ,
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify:false
   })
    console.log(`DBconnected:${conn.connection.host}`.underline.bold)
}
module.exports= connectDb;