const express = require('express');
const {getBootcamps,getBootcamp,createBootcamps,updateBootcamps,deleteBootcamps,GetWithInRadius,bootcampPhotoUpload}=require('../controller/bootcamps')
const Bootcamp= require ('../models/Bootcamp')
const advancedResults=require('../middleware/advancedResults')

courseRouter=require('./courses')
const router = express.Router();
//used course router
router.use('/:bootcampId/courses',courseRouter)
//one way of getting thing from controller nothing way writting code in one line
router.route('/radius/:zipcode/:distance').get(GetWithInRadius)
router.route('/').get(advancedResults(Bootcamp,'courses'),getBootcamps).post(createBootcamps)
//way of writing in an otherway
router.route('/:id')
.get(getBootcamp)
.put(updateBootcamps)
.delete(deleteBootcamps)
router.route('/:id/photo').put(bootcampPhotoUpload)
module.exports = router;