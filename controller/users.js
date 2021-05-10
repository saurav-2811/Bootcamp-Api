const asyncHandler= require('../middleware/async')
const ErrorResponse= require('../util/errorResponse')
const User= require('../models/User')
//@desc        get all user only for admin 
//@route        get on /api/v1/auth/
//access        private,admin
exports.getallUsers = asyncHandler(async(req,res,next) =>{
    res.status(200).json(res.advancedResults)
 });


 //@desc        get user by id
//@route        get on /api/v1/auth/:id
//access        private,admin
exports.getUser = asyncHandler(async(req,res,next) =>{
    const user= await User.findById(req.params.id)
    if(!user){
        return next(new ErrorResponse('user not found',404))
    }
    res.status(200).json({
        success: true,
        data:user
    })
 });


  //@desc       create user
//@route        post on /api/v1/auth/
//access        private,admin
exports.createUser = asyncHandler(async(req,res,next) =>{
    const user= await User.create(req.body)

    res.status(200).json({
        success: true,
        data:user
    })
 });
 

  //@desc       update user
//@route        put on /api/v1/auth/:id
//access        private,admin
exports.updateUser = asyncHandler(async(req,res,next) =>{
    const fieldsToUpdate={
        email:req.body.email,
        name:req.body.name,
        role:req.body.role
    }
    const user= await User.findByIdAndUpdate(req.params.id,fieldsToUpdate,{
        new: true,
        runValidators:true
    })
    if(!user){
        return next(new ErrorResponse('user not found',404))
    }
    res.status(200).json({
        success: true,
        data:user
    })
 });
 

 //@desc       delete user
//@route       delete on /api/v1/auth/:id
//access        private,admin
exports.deleteUser = asyncHandler(async(req,res,next) =>{
    const user= await User.findByIdAndDelete(req.params.id)
    if(!user){
        return next(new ErrorResponse('user not found',404))
    }
    res.status(200).json({
        success: true,
        data:{}
    })
 });