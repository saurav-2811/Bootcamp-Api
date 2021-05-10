const express = require('express');
const User= require ('../models/User')
const advancedResults=require('../middleware/advancedResults')
const {protect,authorised}= require('../middleware/auth')
const {getallUsers,getUser,createUser,updateUser,deleteUser}=require('../controller/users')
const router= express.Router()

router.use(protect)
router.use(authorised('admin'))
router.route('/').get(advancedResults(User),getallUsers).post(createUser)

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser)


module.exports=router