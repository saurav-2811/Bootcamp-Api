const asyncHandler= require('../middleware/async')
const ErrorResponse= require('../util/errorResponse')
const User= require('../models/User')
const sendEmail=require ('../util/sendEmail')
const crypto=require('crypto')

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

//@desc        logout
//@route        get on /api/v1/auth/logout
//access        private
exports.logout =asyncHandler(async(req,res,next) =>{
    res.cookie("token","none",{
        expires:new Date(Date.now()+10*1000),
        httpOnly:true
    })
    res.status(200).json({
        success: true,
        data: {}
    })
});

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
//@route        post on /api/v1/auth/forgetpassword
//access        private
exports.forgetPassword = asyncHandler(async(req,res,next) =>{
    const user=await User.findOne({email:req.body.email})
    if(!user){
        return next(new ErrorResponse('user not found',404))
    }
    // debugger
    const resetToken= user.genResetToken();
    await user.save({validateBeforeSave:false})
    const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`
    const message=`you are having this mail as you or someone has requested to reset password.Please follow the url below to reset :\n\n${resetUrl}`


    try {
        await sendEmail({
            email:user.email,
            subject:'reset password link',
            message
        })
      return res.status(200).json({
          success:true,
          data:'email sent successfully'
      })  
    } catch (err) {
        console.log(err);
        user.resetPasswordToken=undefined
        user.resetPasswordExpire=undefined
        await user.save({validateBeforeSave:false})
        return next(new ErrorResponse(`email could not be sent`,500))
    }
});

//@desc         reset password
//@route        post on /api/v1/auth/resetpassword/:resettoken
//access        private
exports.resetPassword = asyncHandler(async(req,res,next) =>{
        const resetPasswordToken= crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex')
        const user=await User.findOne({resetPasswordToken,resetPasswordExpire:{$gt:Date.now()}})
        if(!user){
            return next(new ErrorResponse('invalid token',400))
        }
        //set new password
        user.password=req.body.password
        user.resetPasswordToken=undefined
        user.resetPasswordExpire=undefined
        await user.save({validateBeforeSave:true})
        res.status(200).json({
            success: true,
            data:'password has been reset successfully'
        })
});


//@desc         udate details
//@route        put on /api/v1/updatedetails
//access        private
exports.updateDetails = asyncHandler(async(req,res,next) =>{
   const filedsToUpdate= {
       email:req.body.email,
       name:req.body.name
   }
    const user= await User.findByIdAndUpdate(req.user.id,filedsToUpdate,{
        new:true,
        runValidators:true
    })
    if(!user){
        return next(new ErrorResponse('user not found',404))
    }
    res.status(200).json({
        success: true,
        data: user,
    })
});


//@desc         udate password
//@route        put on /api/v1/updatepassword
//access        private
exports.updatePassword = asyncHandler(async(req,res,next) =>{

     const user= await User.findById(req.user.id).select('+password')
     if(!user){
         return next(new ErrorResponse('user not found',404))
     }
     if(!(await user.matchpassword(req.body.currentPassword))){
        return next(new ErrorResponse('Please add valid current Password',400))
     }
     user.password=req.body.newPassword
     await user.save()
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