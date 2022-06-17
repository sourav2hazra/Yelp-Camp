const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');


//HANDLING THE REVIEW MODEL
//Create Review
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

//Delete review
router.delete('/:reviewId',isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;