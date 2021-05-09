const express = require('express')
const {protect}= require('../middleware/auth')
 const {register,login,getMe,forgetPassword}= require('../controller/auth')
const router=express.Router()
router.route('/register').post(register)
router.route('/login').post(login)
router.route('/me').get(protect,getMe)
router.route('/forgetpassword').post(forgetPassword)
module.exports=router