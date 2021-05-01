const express = require('express');
const{getCourses,getACourses,updateCourses,createCourses,deleteCourses}= require('../controller/courses')
const Course=require('../models/Course')
const advancedResults=require ('../middleware/advancedResults')
const router = express.Router({mergeParams:true});
router.route('/')
.get(advancedResults(Course,{
    path:'bootcamp',
    select:'name description'
}),getCourses)
.post(createCourses)
router.route('/:id')
.get(getACourses)
.put(updateCourses)
.delete(deleteCourses)
 module.exports=router