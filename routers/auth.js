const express = require('express')
 const {register}= require('../controller/auth')
const router=express.Router()
router.route('/register').post(register)


module.exports=router