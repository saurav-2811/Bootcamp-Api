const express = require('express');
const{getReviews,getReview,addReview,updateReview,deleteReview}= require('../controller/reviews')
const Review=require('../models/Review')
const advancedResults=require ('../middleware/advancedResults')
const {protect,authorised}= require('../middleware/auth')
const router = express.Router({mergeParams:true});
router.route('/')
.get(advancedResults(Review,{
    path:'bootcamp',
    select:'name description'
}),getReviews)
.post(protect,authorised('user','admin'),addReview)
router.route('/:id')
.get(getReview)
.put(protect,authorised('user','admin'),updateReview)
.delete(protect,authorised('user','admin'),deleteReview)
module.exports=router