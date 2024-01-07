/** @format */

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');

const sessionOptions = {
	secret: 'thisisnotagoodsecret',
	resave: false,
	saveUninitialized: false,
};
app.use(session(sessionOptions));
app.use(flash());

const Product = require('./models/product');
const Farm = require('./models/farm');
const categories = ['fruit', 'vegetable', 'dairy'];

const appError = require('./appError');

mongoose.set('strictQuery', true);
mongoose
	.connect('mongodb://127.0.0.1:27017/flashDemo')
	.then(() => {
		console.log('mongo connection open');
	})
	.catch((err) => {
		console.log('mongo connection error!', err);
	});
// routes
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// express middleware
app.use(express.urlencoded({ extended: true }));

// method override
app.use(methodOverride('_method'));

//FARM ROUTES
//middleware
app.use((req, res, next) => {
	res.locals.messages = req.flash('success');
	next();
});

//routes
app.get('/farms', async (req, res) => {
	const farms = await Farm.find({});
	res.render('farms/index', { farms });
});

app.get('/farms/new', (req, res) => {
	res.render('farms/new');
});

//show page
app.get('/farms/:id', async (req, res) => {
	const farm = await Farm.findById(req.params.id).populate('products');
	res.render('farms/show', { farm });
});

//delete
app.delete('/farms/:id', async (req, res) => {
	const farm = await Farm.findByIdAndDelete(req.params.id);
	res.redirect('/farms');
});

//post
app.post('/farms', async (req, res) => {
	const farm = new Farm(req.body);
	await farm.save();
	req.flash('success', 'successfully made a new farm!!!');
	res.redirect('/farms');
});

//form
app.get('/farms/:id/products/new', async (req, res) => {
	const { id } = req.params;
	const farm = await Farm.findById(id);
	console.log(farm);
	res.render('products/new', { categories, farm });
});

app.post('/farms/:id/products', async (req, res) => {
	const { id } = req.params; // grab id
	const farm = await Farm.findById(id);
	const { name, price, category } = req.body;
	const product = new Product({ name, price, category });
	farm.products.push(product);
	product.farm = farm;
	await farm.save();
	await product.save();
	res.redirect(`/farms/${id}`);
});

//product routes

// get products
app.get('/products', async (req, res) => {
	const { category } = req.query;
	if (category) {
		const products = await Product.find({ category });
		res.render('products/index', { products, category });
	} else {
		const products = await Product.find({});
		res.render('products/index', { products, category: 'all' });
	}
});

//serve the form
app.get('/products/new', (req, res) => {
	res.render('products/new', { categories });
});

// submit the form + create new product
app.post('/products', async (req, res) => {
	const newProduct = new Product(req.body);
	await newProduct.save();
	res.redirect(`/products/${newProduct._id}`);
});

// details for a single product

app.get('/products/:id', async (req, res) => {
	const { id } = req.params;
	const product = await Product.findById(id).populate('farm', 'name');
	res.render('products/show', { product });
});

// updating an individual product / editing the selector
app.get('/products/:id/edit', async (req, res) => {
	const { id } = req.params;
	const product = await Product.findById(id);
	res.render('products/edit', { product, categories });
});

app.put('/products/:id', async (req, res) => {
	const { id } = req.params;
	const product = await Product.findByIdAndUpdate(id, req.body, {
		runValidators: true,
		new: true,
	});

	res.redirect(`/products/${product._id}`);
});

// delete remove
app.delete('/products/:id', async (req, res) => {
	const { id } = req.params;
	const deletedProduct = await Product.findByIdAndDelete(id);
	res.redirect('/products');
});

//error handler

const handleValidationError = (err) => {
	console.dir(err);
	return new appError(400, `Sorry, validation failed - ${err.message}`);
};

const handleCastError = (err) => {
	console.dir(err);
	return new appError(400, `Sorry, validation failed - ${err.message}`);
};

app.use((err, req, res, next) => {
	console.log(err);
	if (err.name === 'ValidationError') err = handleValidationError(err);
	if (err.name === 'CastError') err = handleCastError(err);

	next(err);
});

// async error handling
app.use((err, req, res, next) => {
	const { status = 500, message = 'something went wrong' } = err;
	res.status(status).send(message);
});

// port
app.listen(3000, () => {
	console.log('im working');
});
