const ErrorResponse= require('../util/errorResponse')
const asyncHandler= require('../middleware/async')
const mongoose = require('mongoose')
const Course= require ('../models/Course')
const Bootcamp= require ('../models/Bootcamp')
//@desc         will get all courses
//@route        get on /api/v1/courses/
//access        private
exports.getCourses=asyncHandler(async(req,res,next) =>{
    let query;
    if(req.params.bootcampId)
    {
        query =await Course.find({bootcamp:req.params.bootcampId})
     }
    else{
        query =await Course.find().populate({
            path:'bootcamp',
            select:'name description'
        })
    }
    const courses=query
    res.status(200).json({
        success: true,
        count:courses.length,
        data:courses
    })
})
//@desc         will get the selected courses useing id
//@route        get on /api/v1/courses/:id
//access        private
exports.getACourses=asyncHandler(async(req,res,next) =>{
    let courses= await Course.findById(req.params.id).populate({
        path:'bootcamp',
        select:'name description'
    })
    if(!courses){
        return next(
            new ErrorResponse(`no courses with the id of ${req.params.id}`,
            404)
        )}
    res.status(200).json({
        success: true,
        data:courses
    })
})
// //@desc         will update the selected course useing id
// //@route        put on /api/v1/courses/:id
// //access        private
exports.updateCourses=asyncHandler(async(req,res,next) =>{
    let courses= await Course.findOneAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        success: true,
        data:courses
    })
})
// //@desc         will create a course
// //@route        post on /api/v1/bootcamps/:id
// //access        private
exports.createCourses=asyncHandler(async(req,res,next) =>{
    req.body.bootcamp=req.params.bootcampId
    const bootcamp= await Bootcamp.findById(req.params.bootcampId)
    if(!bootcamp){
       return next(
           new ErrorResponse(`no bootcamp with the id of ${req.params.bootcampId}`,
           404)
       )}
    const course=await Course.create(req.body)
    res.status(200).json({
        success: true,
        data:course
    })
})
// //@desc         will delete the selected courses useing id
// //@route        delete on /api/v1/courses/:id
// //access        private
exports.deleteCourses=asyncHandler(async(req,res,next) =>{
    const course= await Course.findById(req.params.id)
    if(!course){
        return next(
            new ErrorResponse(`no bootcamp with the id of ${req.params.bootcampId}`,
            404)
        )
    }
    await course.remove()
    res.status(200).json({
        success: true,
 
    })
})




