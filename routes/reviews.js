/** @format */
const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utilities/catchAsync');
const expressError = require('../utilities/expressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { reviewSchema } = require('../schemas.js');

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

const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new expressError(400, msg);
	} else {
		next();
	}
};

// delete a review button
router.delete(
	'/:reviewId',
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;
		await Campground.findByIdAndUpdate(id, {
			$pull: { reviews: reviewId },
		});
		await Review.findByIdAndDelete(reviewId);
		req.flash('success', 'youve successfully deleted a review');
		res.redirect(`/campgrounds/${id}`);
	})
);

//reviews
router.post(
	'/',
	validateReview,
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		const review = new Review(req.body.review);
		campground.reviews.push(review);
		await review.save();
		await campground.save();
		req.flash('success', 'successfully added a review');
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

module.exports = router;
