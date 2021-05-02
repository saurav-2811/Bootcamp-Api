const asyncHandler= require('../middleware/async')
const ErrorResponse= require('../util/errorResponse')
const User= require('../models/User')



//@desc         registr user
//@route        Get on /api/v1/auth/register
//access        public
exports.register =asyncHandler(async(req,res,next) =>{
    //taking out name,email,password,role from req.body
    const {name,email,password,role}=req.body
    const user=await User.create({
        name,email,password,role
    })
    res.status(200).json({
        success:true
    })
})