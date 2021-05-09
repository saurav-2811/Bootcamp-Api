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

    sendTokenResponse(user,200,res)
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
    sendTokenResponse(user,200,res)
})


//@desc         get me
//@route        get on /api/v1/me
//access        private
exports.getMe =asyncHandler(async(req,res,next) =>{
    let user= await User.findById(req.user.id)
    if(!user){
        return next(new ErrorResponse('user not found',404))
    }
    res.status(200).json({
        success: true,
        data: user,
    })
});

//@desc         forgetpassword
//@route        get on /api/v1/me
//access        private
exports.forgetPassword = asyncHandler(async(req,res,next) =>{
    const user=await User.findOne({email:req.body.email})
    if(!user){
        return next(new ErrorResponse('user not found',404))
    }
    const restToken= user.genResetToken();
    await user.save({validateBeforeSave:false})
    res.status(200).json({
        success: true,
        data: user,
    })
});



//get token from model,create cookie and send response
const sendTokenResponse=(user,statusCode,res)=>{
    //create token
    const token=user.getJwtToken()
    const options={
        expires:new Date(Date.now()+process.env.cookieexpire*24*60*60*1000),
        httpOnly:true
    };
   
    if(process.env.NODE_ENV==='production'){
        options.secure=true
    }
    res
    .status(statusCode)
    .cookie('token',token,options)
    .json({
        success:true,
        token
    })
}