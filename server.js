const express= require ('express')
const path= require ('path')
const dotenv= require('dotenv')
const colors= require('colors')
const cors= require('cors')
const mongoSanitize= require('express-mongo-sanitize')
const helmet=require ('helmet')
const xss= require('xss-clean')
const  rateLimit= require ('express-rate-limit')
const hpp= require ('hpp')
const fileupload=require ('express-fileupload')
const logger = require ('morgan')
const cookieParser= require ('cookie-parser')
const connectDb = require ('./config/db')
const errorHandler=require('./middleware/error')
const app = express()
app.use(express.urlencoded({ extended: true }));
//body parser
app.use(express.json());
app.use(cookieParser())
//connecting routes
const bootcamps = require('./routers/bootcamps')
const courses= require('./routers/courses')
const auth= require ('./routers/auth')
const users= require ('./routers/users')
const reviews= require ('./routers/reviews')
//connect env file by giving path
dotenv.config({path:'./config/config.env'})
//database connected
connectDb();
if(process.env.NODE_ENV==='development'){
app.use (logger('dev'))
}
//file uploading
app.use(fileupload())
//sanitize data
app.use(mongoSanitize())
//set security headers
app.use(helmet())
//prevent cliet side scripting
app.use(xss())
//limit request acc minutes
const limiter=rateLimit({
    windowMs:10*60*1000,
    max:100
})
app.use(limiter)
//prevent http params pollutions
app.use(hpp())
//enabling cors
app.use(cors())
//set static folder
app.use(express.static(path.join(__dirname,'public')))
app.use ('/api/v1/bootcamps' ,bootcamps)
app.use ('/api/v1/courses' ,courses)
app.use ('/api/v1/auth' ,auth)
app.use ('/api/v1/users' ,users)
app.use ('/api/v1/reviews' ,reviews)
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