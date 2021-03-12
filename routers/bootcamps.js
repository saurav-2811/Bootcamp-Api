const express = require('express');
const router = express.Router();
const {getBootcamps,getBootcamp,createBootcamps,updateBootcamps,deleteBootcamps}=require('../controller/bootcamps')
//one way of getting thing from controller nothing way writting code in one line
router.route('/').get(getBootcamps).post(createBootcamps)
//way of writing in an otherway
router.route('/:id')
.get(getBootcamp)
.put(updateBootcamps)
.delete(deleteBootcamps)

module.exports = router;