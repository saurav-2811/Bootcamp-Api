const mongoose = require('mongoose')
const slugify= require ('slugify')
const geocoder= require ('../util/geocoder')

//new schema
const BootcampSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'Please add a name'],
        unique: true,
        trime: true,
        maxlength: [50,'name can not be more than 50 characters']
    },
    slug:String,
    description:{
        type: String,
        required: [true,'Please add a description'],
        maxlength: [500,'description can not be more than 500 characters']
    },
    website:{
        type:String,
        match:[/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'please enter a valid url with http or https']
    },
    email:{
    type: String,
    match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    'Please enter valid email'
    ]
    },
    phone:{
        type: Number,
        maxlength:[20,'Please enter valid phone no..']
    },
    address:{
      type:String,
      required:true,
      maxlength: [200,'address length must not more than 200']
    },
    location: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
        //   required: true
        },
        coordinates: {
            type: [Number],
            // required: true,
            index: '2dsphere'
          },
          formattedAddress: String,
          street: String,
          city : String,
          state: String,
          Zipcode : String,
          country : String
    },
    career :{
        type: [String],
        required :true,
        enum :[
            'Web-development',
            'mobile-development',
            'UX/UI',
            'data science',
            'bussiness',
            'other'
        ]
    },
    averageRating:{
        type:Number,
        min:[1,'Rating must be atleast one'],
        max:[10,'Rating must not be more than 10']
    },
    averageCost: Number,
    photo:{
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
      },
      jobAssistance: {
        type: Boolean,
        default: false
      },
      jobGuarantee: {
        type: Boolean,
        default: false
      },
      acceptGi: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
});
BootcampSchema.pre('save',function(next){
  this.slug=slugify(this.name,{lower:true})
  next()
});
BootcampSchema.pre('save',async function(next){
  const loc= await geocoder.geocode(this.address)
  this.location={
    type:'point',
    coordinates: [loc[0].longitude,loc[0].latitude],
    formattedAddress:loc[0].formattedAddress,
    street:loc[0].streetName,
    city:loc[0].city,
    state:loc[0].stateCode,
    Zipcode:loc[0].zipcode,
    country:loc[0].countryCode
  }
  //dont save address after getting formatted in db
  this.address=undefined
  next()
})
module.exports= mongoose.model('Bootcamp', BootcampSchema)