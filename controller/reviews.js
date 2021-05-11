
const ErrorResponse = require("../util/errorResponse");
const asyncHandler = require("../middleware/async");
const mongoose = require("mongoose");
const Review = require("../models/Review");
const Bootcamp = require("../models/Bootcamp");
//@desc         will get all reviews
//@route        get on /api/v1/reviews/
//@route        get on  /api/v1/bootcamps/:id/reviews
//access        private
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