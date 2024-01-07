/** @format */
const mongoose = require('mongoose');
const Product = require('../models/product');
mongoose.set('strictQuery', true);
mongoose
	.connect('mongodb://127.0.0.1:27017/farmStand2')
	.then(() => {
		console.log('mongo connection open');
	})
	.catch((err) => {
		console.log('mongo connection error!', err);
	});

// make one
// const p = new Product({
// 	name: 'grapefruit',
// 	price: 1.99,
// 	category: 'fruit',
// });

// p.save()
// 	.then((p) => {
// 		console.log(p);
// 	})
// 	.catch((err) => {
// 		console.log('uh oh error', err);
// 	});

// make many products at one time using insertMany method
const seedProducts = [
	{
		name: 'eggplant',
		price: 1.0,
		category: 'vegetable',
	},
	{
		name: 'melon',
		price: 4.99,
		category: 'fruit',
	},
	{
		name: 'watermelon',
		price: 3.99,
		category: 'fruit',
	},
];

// Product.insertMany(seedProducts)
// 	.then((res) => {
// 		console.log('success', res);
// 	})
// 	.catch((err) => {
// 		console.log('uh oh error', err);
// 	});
