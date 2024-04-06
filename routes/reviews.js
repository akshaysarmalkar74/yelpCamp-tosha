/** @format */
const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utilities/catchAsync');
const expressError = require('../utilities/expressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
// middleware
const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);

	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new expressError(400, msg);
	} else {
		next();
	}
};

//reviews
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// delete a review button
router.delete(
	'/:reviewId',
	isLoggedIn,
	isReviewAuthor,
	catchAsync(reviews.deleteReview)
);

module.exports = router;
