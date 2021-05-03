const mongoose =require('mongoose')
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
        enum:['user','publisher'],
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
        const salt=await bcrypt.genSalt(10)
        this.password=await bcrypt.hash(this.password,salt)
        next()
    })
    UserSchema.methods.getJwtToken=function(){ return jwt.sign({
       id:this._id
      }, process.env.Secret, { expiresIn: process.env.expire})
    }
module.exports= mongoose.model('User',UserSchema)