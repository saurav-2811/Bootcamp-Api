
const ErrorResponse = require("../util/errorResponse");
const asyncHandler = require("../middleware/async");
const mongoose = require("mongoose");
const Review = require("../models/Review");
const Bootcamp = require("../models/Bootcamp");
//@desc         will get all reviews
//@route        get on /api/v1/reviews/
//@route        get on  /api/v1/bootcamps/:bootcampId/reviews
//access        public
exports.getReviews = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
      const reviews = await Review.find({ bootcamp: req.params.bootcampId });
      res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews,
      });
    } else {
      res.status(200).json(res.advancedResults);
    }
  });

  //@desc         will get  single review
//@route        get on  /api/v1/reviews/:id
//access        public
exports.getReview = asyncHandler(async (req, res, next) => {
      const review = await (await Review.findById(req.params.id)).populate({
        path:'Bootcamp',
        select:'name description'
      })
      if(!review){
        return next(new ErrorResponse(`no reviews found with this id ${req.params.id}`,404))
      }
      res.status(200).json({
        success: true,
        count: review.length,
        data: review,
      });
   
  });

  //@desc         will create review
//@route        post on  /api/v1/bootcamps/:bootcampId/reviews
//access        public
exports.addReview = asyncHandler(async (req, res, next) => {
    req.body.bootcamp= req.params.bootcampId
    req.body.user = req.user.id
    const bootcamp= await Bootcamp.findById(req.params.bootcampId)

  if(!bootcamp){
    return next(new ErrorResponse(`no bootcamp found with this id ${req.params.id}`,404))
  }
  const review= await Review.create(req.body)
  res.status(200).json({
    success: true,
    count: review.length,
    data: review,
  });

});