const asyncHandler= require('../middleware/async')
const ErrorResponse= require('../util/errorResponse')
const mongoose = require('mongoose')
const Course= require ('../models/Course')
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
        query =await Course.find()
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
    let courses= await Course.findById(req.params.id)
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
    let courses= await Course.create(req.body)
    res.status(200).json({
        success: true,
        data:courses
    })
})
// //@desc         will delete the selected courses useing id
// //@route        delete on /api/v1/courses/:id
// //access        private
exports.deleteCourses=asyncHandler(async(req,res,next) =>{
    let courses= await Course.findByIdAndDelete(req.params.id,req.body)
    res.status(200).json({
        success: true,
 
    })
})
