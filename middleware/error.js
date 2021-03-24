const ErrorResponse= require('../util/errorResponse')
const errorHandler=(err,req,res,next)=>{
    //log err for dev
    console.log(err)
    //acquiring the property of err
    let error={...err}
    error.message=err.message
    if(err.name ==='CastError'){
        const message=`Bootcamp not found in database id:${err.value}`
        error= new ErrorResponse(message,404)
    }
    if(err.code === 11000){
        const message=`Bootcamp already present in database id:${err.value}`
        error= new ErrorResponse(message,404)
    }
    if(err.name === 'ValidationError'){
        const message=Object.values(err.errors).map(val=>val.message)
        error= new ErrorResponse(message,404)
    }
    res.status(error.statusCode||500).json({
        success:false,
        error: error.message||"Server error"
    })
}
module.exports = errorHandler