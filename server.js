const express= require ('express')
const dotenv= require('dotenv')
const app = express()
//connecting routes
const bootcamps = require('./routers/bootcamps')

//connect env file by giving path
dotenv.config({path:'./config/config.env'})

// app.get('/api/v1/bootcamps',(req,res) =>{
//     console.log("hello")
// })



app.use ('/api/v1/bootcamps' ,bootcamps)

//port on which our server will rull
const PORT=process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`server is running at ${process.env.NODE_ENV} mode on port ${PORT}`);
});