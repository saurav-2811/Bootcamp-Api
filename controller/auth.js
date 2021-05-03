const asyncHandler= require('../middleware/async')
const ErrorResponse= require('../util/errorResponse')
const User= require('../models/User')



//@desc         registr user
//@route        post on /api/v1/auth/register
//access        public
exports.register =asyncHandler(async(req,res,next) =>{
    //taking out name,email,password,role from req.body
    const {name,email,password,role}=req.body
    const user=await User.create({
        name,email,password,role
    })

    const token=user.getJwtToken()
    res.status(200).json({
        success:true,
        token
    })
})


//@desc         login user
//@route        post on /api/v1/auth/login
//access        public
exports.login =asyncHandler(async(req,res,next) =>{
    //taking out name,email,password,role from req.body
    const {email,password}=req.body

    //validation
    if(!email||!password){
        return next(new ErrorResponse('Please provide credentials',400))
    }
    const user=await User.findOne({email}).select('+password')
    if(!user){
        return next(new ErrorResponse('invalid credentials',401))
    }
    const ismatch=await user.matchpassword(password)
    if(!ismatch){
        return next(new ErrorResponse('invalid credentials',401))
    }
    const token=user.getJwtToken()
    res.status(200).json({
        success:true,
        token,
    })
})