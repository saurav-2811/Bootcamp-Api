const express= require ('express')
const dotenv= require('dotenv')
const colors= require('colors')
const logger = require ('morgan')
const connectDb = require ('./config/db')
const errorHandler=require('./middleware/error')
const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//connecting routes
const bootcamps = require('./routers/bootcamps')

//connect env file by giving path
dotenv.config({path:'./config/config.env'})
if(process.env.NODE_ENV==='development'){
app.use (logger('dev'))
}
//database connected
connectDb();
app.use ('/api/v1/bootcamps' ,bootcamps)
//middleware error
app.use(errorHandler)
//port on which our server will rull
const PORT=process.env.PORT || 5000
const server=app.listen(PORT, () => {
    console.log(`server is running at ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});
//process on unhandle error
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error ${err.message}`)
    //close server & exit process
    server.close(()=>process.close(1));
})