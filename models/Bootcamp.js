const mongoose = require('mongoose')
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
          formattedAdress: String,
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
module.exports= mongoose.model('Bootcamp', BootcampSchema)