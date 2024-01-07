/** @format */

const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const expressError = require('../utilities/expressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas.js');

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

//routes
router.get(
	'/',
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render('campgrounds/index', { campgrounds });
	})
);

//new and create routes
router.get('/new', (req, res) => {
	res.render('campgrounds/new');
});

//show route
router.get(
	'/:id',
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id).populate(
			'reviews'
		);
		console.log(campground);
		if (!campground) {
			req.flash('error', 'cant find that campground');
			return res.redirect('/campgrounds');
		}
		res.render('campgrounds/show', { campground });
	})
);

//post route
router.post(
	'/',
	validateCampground,
	catchAsync(async (req, res, next) => {
		// if (!req.body.campground)
		// 	throw new expressError(400, 'invalid campground data');
		const campground = new Campground(req.body.campground);
		await campground.save();
		req.flash('success', 'successfully made a new campground');
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

//edit
router.get(
	'/:id/edit',
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		if (!campground) {
			req.flash('error', 'cant find that campground');
			return res.redirect('/campgrounds');
		}
		res.render('campgrounds/edit', { campground });
	})
);

router.put(
	'/:id',
	validateCampground,
	catchAsync(async (req, res) => {
		const { id } = req.params; //gives you the id
		const campground = await Campground.findByIdAndUpdate(id, {
			...req.body.campground,
		});
		req.flash('success', 'succesfully updated campground'); //find by the id that you found
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

// delete a campground
router.delete(
	'/:id',
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Campground.findByIdAndDelete(id);
		res.req('success', 'youve successfully deleted a campground');
		res.redirect('/campgrounds');
	})
);

module.exports = router;
