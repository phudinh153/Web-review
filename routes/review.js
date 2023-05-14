const express = require('express');
const router = express.Router({mergeParams: true});
const Area = require('../models/attraction.js');
const catchAsync = require('../utilities/catchAsync.js');
const Review = require('../models/review');
const {validateReview, isLoggedIn, checkReviewAuthor} = require('../middleware.js')
const reviews = require('../controllers/reviews.js');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.addReview))

router.delete('/:reviewId', isLoggedIn, checkReviewAuthor, catchAsync());

module.exports = router;