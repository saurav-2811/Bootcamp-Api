const express = require('express');
const{getCourses,getACourses,updateCourses,createCourses,deleteCourses}= require('../controller/courses')
const Course=require('../models/Course')
const advancedResults=require ('../middleware/advancedResults')
const {protect}= require('../middleware/auth')
const router = express.Router({mergeParams:true});
router.route('/')
.get(advancedResults(Course,{
    path:'bootcamp',
    select:'name description'
}),getCourses)
.post(protect,createCourses)
router.route('/:id')
.get(getACourses)
.put(protect,updateCourses)
.delete(protect,deleteCourses)
 module.exports=router