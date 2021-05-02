const express = require('express')
 const {register}= require('../controller/auth')
const router=express.Router()
router.route('/register').get(register)


module.exports=router