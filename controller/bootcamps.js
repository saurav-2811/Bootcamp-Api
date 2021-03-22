const Bootcamp= require('../models/Bootcamp')
//@desc         will show all the bootcamps
//@route        GET on /api/v1/bootcamps/
//access        public
exports.getBootcamps = async(req,res,next) =>{
    try {
        let bootcamps= await Bootcamp.find()
        res.status(200).json({
            success:true,
            count: bootcamps.length,
            data:bootcamps
        })
    } catch (err) {
        res.status(400).json({
            success:false,
            error:err
        })
    }
    res.end()
}
//@desc         will show selected bootcamps
//@route        GET on /api/v1/bootcamps/:id
//access        public
exports.getBootcamp = async(req,res,next) =>{
    try {
        let bootcamp=await Bootcamp.findById(req.params.id)
        res.status(200).json({
            success: true,
            data: bootcamp
        })
        if(!bootcamp){
                return res.status(400).json({
                    success:false,
            })
        }
    } catch (err) {
        res.status(400).json({
            success:false,
            error:err
        })
    }
    res.end()
}
//@desc         create bootcamps
//@route        post on /api/v1/bootcamps/
//access        private
exports.createBootcamps = async(req,res,next) =>{
    try {
        const bootcamp= await Bootcamp.create(req.body)
        res.status(200).json({
            success: true,
            data: bootcamp
        })
        }
         catch (err) {
         res.status(400).json({
            success:false,
            error:err
        })
    }
}
//@desc         update selected bootcamps
//@route        put on /api/v1/bootcamps/:id
//access        private
exports.updateBootcamps =async(req,res,next) =>{
    try {
        let bootcampUpdate= await Bootcamp.findByIdAndUpdate(req.params.id , req.body,{ 
            new:true,
            runValidators:true
        });
        res.status(200).json({
            success: true,
            data: bootcampUpdate,
        })
    } catch (err) {
        res.status(400).json({
            success:false,
            error:err
        })
    }
        res.end()
    } 
//@desc         will delete the selected bootcamp useing id
//@route        delete on /api/v1/bootcamps/:id
//access        private
exports.deleteBootcamps = async(req,res,next) =>{
    try{
    let bootcampDelete= await Bootcamp.findByIdAndDelete(req.params.id , req.body)
    console.log("deleted")
    } catch (err) {
    res.status(400).json({
        success:false,
        error:err
    })
}
res.end()
}