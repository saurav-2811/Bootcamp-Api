
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


//@desc         will update the selected review useing id
//@route        put on /api/v1/reviews/:id
//access        private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`no review with the id of ${req.params.id}`, 404)
    );
  }
  console.log(req.user.role);
  const role="user"|| "admin"
  if (
    review.user.toString() !== req.user.id &&
   req.user.role !== role
  ) {
    return next(
      new ErrorResponse(
        `${req.user.id} is not authorised to update review`,
        401
      )
    );
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: review,
  });

});

//@desc         will delete the selected review useing id
//@route        delete on /api/v1/reviews/:id
//access        private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new ErrorResponse(`no review with the id of ${req.params.id}`, 404)
    );
  }
  const role="user"|| "admin"
  if (
    review.user.toString() !== req.user.id &&
    req.user.role !== role
  ) {
    return next(
      new ErrorResponse(
        `${req.user.id} is not authorised to update review`,
        401
      )
    );
  }
  await review.remove();
  res.status(200).json({
    success: true,
    data:{}
  });
});
