const asyncHandler= require('../middleware/async')
const ErrorResponse= require('../util/errorResponse')




//@desc         registr user
//@route        Get on /api/v1/auth/register
//access        public
exports.register =asyncHandler(async(req,res,next) =>{
    res.status(200).json({
        success:true
    })
})