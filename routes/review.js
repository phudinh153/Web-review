const express = require('express');
const router = express.Router({mergeParams: true});
const Area = require('../models/attraction.js');
const catchAsync = require('../utilities/catchAsync.js');
const expError = require('../utilities/expError.js');
const {reviewSchema} = require('../schemas.js');
const Review = require('../models/review')

const validateReview = (req, res, next) => {
    
    const {error}= reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new expError(msg, 400);
    } else{
        next();
    }
    
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const area = await Area.findById(req.params.id);
    const review = new Review(req.body.review);
    area.reviews.push(review);
    await review.save();
    await area.save();
    req.flash('success', 'New review created!');
    res.redirect(`/attraction/${area._id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await Area.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/attraction/${id}`);
}));

module.exports = router;