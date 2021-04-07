const asyncHandler= require('../middleware/async')
const ErrorResponse= require('../util/errorResponse')
const geocoder = require('../util/geocoder');
const Bootcamp= require('../models/Bootcamp');
//@desc         will show all the bootcamps
//@route        GET on /api/v1/bootcamps/
//access        public
exports.getBootcamps =asyncHandler(async(req,res,next) =>{
    let query;
    //copy query using spread operator
    let reqQuery={...req.query};
    let removeFields=['select','sort'];
    removeFields.forEach(param=> delete reqQuery[param]);
    let queryStr=JSON.stringify(reqQuery);
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>`$${match}`);
    query=Bootcamp.find(JSON.parse(queryStr));
    if(req.query.select){
        const fields= req.query.select.split(',').join(" ");
        query=query.select(fields)
    }
    if(req.query.sort){
        const sortBy= req.query.sort.split(',').join(" ");
        query=query.sort(sortBy)
    }
    else{
        query=query.sort('-createdAt')
    }
    let bootcamps=await query;
        res.status(200).json({
            success:true,
            count: bootcamps.length,
            data:bootcamps
        })
    });
   
//@desc         will show selected bootcamps
//@route        GET on /api/v1/bootcamps/:id
//access        public
exports.getBootcamp =asyncHandler(async(req,res,next) =>{
        let bootcamp=await Bootcamp.findById(req.params.id)
        res.status(200).json({
            success: true,
            data: bootcamp
        })
        if(!bootcamp){
                return  next(err)
        }

});
//@desc         create bootcamps
//@route        post on /api/v1/bootcamps/
//access        private
exports.createBootcamps =asyncHandler(async(req,res,next) =>{
        const bootcamp= await Bootcamp.create(req.body)
        res.status(200).json({
            success: true,
            data: bootcamp
        })
});
//@desc         update selected bootcamps
//@route        put on /api/v1/bootcamps/:id
//access        private
exports.updateBootcamps =asyncHandler(async(req,res,next) =>{
        let bootcampUpdate= await Bootcamp.findByIdAndUpdate(req.params.id , req.body,{ 
            new:true,
            runValidators:true
        });
        res.status(200).json({
            success: true,
            data: bootcampUpdate,
        })
    });
//@desc         will delete the selected bootcamp useing id
//@route        delete on /api/v1/bootcamps/:id
//access        private
exports.deleteBootcamps = asyncHandler(async(req,res,next) =>{
    let bootcampDelete= await Bootcamp.findByIdAndDelete(req.params.id , req.body)
    console.log("deleted")
    res.redirect('/api/v1/bootcamps')
});
//@desc         will get bootcamp within radius
//@route        get on /api/v1/bootcamps/radius/:zipcode/:distance
//access        private
exports.GetWithInRadius = asyncHandler(async(req,res,next) =>{
    const {zipcode,distance}=req.params;
   //get latitude and logintude from geocoder
   const loc =await geocoder.geocode(zipcode);
   const lat=loc[0].latitude;
   const lng=loc[0].longitude;
   //calc GetWithInRadius
   const radius = distance / 3963;

   const bootcamps = await Bootcamp.find({
     location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
   });
 
   res.status(200).json({
     success: true,
     count: bootcamps.length,
     data: bootcamps
   });
});
