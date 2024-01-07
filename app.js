/** @format */

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

const expressError = require('./utilities/expressError');

// method override
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('database connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//parse the body for the form
app.use(express.urlencoded({ extended: true }));

//method override
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
	secret: 'thisshouldbeabettersecret',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};
app.use(session(sessionConfig));

//flash

app.use(flash());

app.use((req, res, next) => {
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new expressError(400, msg);
	} else {
		next();
	}
};

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

//routes
app.get('/', (req, res) => {
	res.render('home');
});

// error handling
app.all('*', (req, res, next) => {
	next(new expressError(404, 'page not found'));
});

app.use((err, req, res, next) => {
	const { status = 500 } = err;
	if (!err.message) err.message = 'something is wrong';
	res.status(status).render('error', { err });
});

app.listen(3000, () => {
	console.log('im working');
});
