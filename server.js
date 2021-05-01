const express= require ('express')
const path= require ('path')
const dotenv= require('dotenv')
const colors= require('colors')
const fileupload=require ('express-fileupload')
const logger = require ('morgan')
const connectDb = require ('./config/db')
const errorHandler=require('./middleware/error')
const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//connecting routes
const bootcamps = require('./routers/bootcamps')
const courses= require('./routers/courses')

//connect env file by giving path
dotenv.config({path:'./config/config.env'})
//database connected
connectDb();
if(process.env.NODE_ENV==='development'){
app.use (logger('dev'))
}
//file uploading
app.use(fileupload())
//set static folder
app.use(express.static(path.join(__dirname,'public')))
app.use ('/api/v1/bootcamps' ,bootcamps)
app.use ('/api/v1/courses' ,courses)
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