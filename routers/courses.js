const express = require('express');
const router = express.Router({mergeParams:true});
const{getCourses,getACourses,updateCourses,createCourses,deleteCourses}= require('../controller/courses')
router.route('/')
.get(getCourses)
.post(createCourses)
router.route('/:id')
.get(getACourses)
.put(updateCourses)
.delete(deleteCourses)
 module.exports=router