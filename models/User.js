const mongoose =require('mongoose')
const crypto= require ('crypto')
const jwt= require ('jsonwebtoken')
require('dotenv').config({path:'../config/config.env'})
const bcrypt= require ('bcryptjs')
const UserSchema= new mongoose.Schema({
    name:{
        type: String,
        required:[true,'Please add a name']
    },
    email:{
        type: String,
        required:[true,'Please add a email'],
        unique:true,
        match:[/^\S+@\S+\.\S+/,'Please add an valid email']
    },
    role:{
        type: String,
        enum:['user','publisher','admin'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,'Please add a password'],
        minlength:6,
        select:false
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    createdAt:{
        type: Date,
        default:Date.now
    }
})
    UserSchema.pre('save',async function(next){
        if(!this.isModified('password')){
            next()
        }
        const salt=await bcrypt.genSalt(10)
        this.password=await bcrypt.hash(this.password,salt)
        next()
    })
    UserSchema.methods.getJwtToken=function(){ return jwt.sign({
       id:this._id
      }, process.env.Secret, { expiresIn: process.env.expire})
    }

    UserSchema.methods.matchpassword=async function(enteredpassword){
       return await bcrypt.compare(enteredpassword,this.password)
    }

    //generate resetPassword token
    UserSchema.methods.genResetToken= function(){ 
        const resetToken=crypto.randomBytes(20).toString('hex')
        //hash token
        this.resetPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex')
        //set token expiresIn
        this.resetPasswordExpire=Date.now()+10*60*1000
        return resetToken
    }

module.exports= mongoose.model('User',UserSchema)