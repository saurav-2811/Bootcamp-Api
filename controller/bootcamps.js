const asyncHandler= require('../middleware/async')
const path=require('path')
const ErrorResponse= require('../util/errorResponse')
const geocoder = require('../util/geocoder');
const Bootcamp= require('../models/Bootcamp');

//@desc         will show all the bootcamps
//@route        GET on /api/v1/bootcamps/
//access        public
exports.getBootcamps =asyncHandler(async(req,res,next) =>{
        res.status(200).json(res.advancedResults)
    });
   
//@desc         will show selected bootcamps
//@route        GET on /api/v1/bootcamps/:id
//access        public
exports.getBootcamp =asyncHandler(async(req,res,next) =>{
    let bootcamp=await Bootcamp.findById(req.params.id)
    if(!bootcamp){
            return  next(  new ErrorResponse(`no bootcamp with the id of ${req.params.id}`,
            404))
    }
        res.status(200).json({
            success: true,
            data: bootcamp
        })

});
//@desc         create bootcamps
//@route        post on /api/v1/bootcamps/
//access        private
exports.createBootcamps =asyncHandler(async(req,res,next) =>{
        //setting up user id to req.body
        req.body.user=req.user.id
        //check for published user
        const publishedBootcamp=await Bootcamp.findOne({user:req.user.id})
        //if user is not admin they can create only one bootcamp
        if(publishedBootcamp && req.user.role!=='admin'){
            return next(new ErrorResponse(`${req.user.role} has already published one Bootcamp`,404))
        }
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
        let bootcampUpdate= await Bootcamp.findById(req.params.id )
        if(bootcampUpdate.user.toString()!==req.user.id && req.user.role!=='admin'){
            return next(new ErrorResponse(`${req.user.id} is not authorised to update this bootcamp`,401))
        }
        bootcampUpdate=await Bootcamp.findById(req.params.id, req.body,{ 
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
    const bootcampDelete= await Bootcamp.findById(req.params.id)
    if(!bootcampDelete){
        return next(  new ErrorResponse(`no bootcamp with the id of ${req.params.id}`,404))
    }
    if(bootcampDelete.user.toString()!==req.user.id && req.user.role!=='admin'){
        return next(new ErrorResponse(`${req.user.id} is not authorised to delete this bootcamp`,401))
    }
    bootcampDelete.remove();
    res.status(200).json({
        success:true
    })
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

//@desc        upload photo
//@route        put on api/v1/bootcamps/:id/photo
//access        private
exports.bootcampPhotoUpload=asyncHandler(async(req,res,next) =>{
    const bootcamp= await Bootcamp.findById(req.params.id)
    if(!bootcamp){
        return next(
            new ErrorResponse(`no bootcamp with the id of ${req.params.id}`,
            404)
        )
    }
    
    if(bootcamp.user.toString()!==req.user.id && req.user.role!=='admin'){
        return next(new ErrorResponse(`${req.user.id} is not authorised to upload photo to this bootcamp`,401))
    }

    if(!req.files){
        return next(
            new ErrorResponse(`Please upload a photo`,
            404)
        )
    }
    const file=req.files.file;
    //make sure the mage is photo
    if(!file.mimetype.startsWith('image')){
        return next(
            new ErrorResponse(`Please upload an image file`,
            404)
        )     
    }
    //check file size
    if(file.size>process.env.MAX_FILE_UPLOAD){
        return next(
            new ErrorResponse(`image size should be less than 1000000`,
            404))
    }
    //creat costum file name
    file.name=`photo_${bootcamp._id}${path.parse(file.name).ext}`
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err)=>{
        if(err){
            console.log(err)
            return next(
                new ErrorResponse(`problem in uploading`,
                500))
        }
        await Bootcamp.findByIdAndUpdate(req.params.id,{photo:file.name})
        res.status(200).json({
            success: true,
            data: file.name
        })
    })

})