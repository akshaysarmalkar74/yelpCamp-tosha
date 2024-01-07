/** @format */

const mongoose = require('mongoose');
const { Schema } = mongoose;

// database
mongoose.connect('mongodb://localhost:27017/relationshipDB', {
	// useNewUrlParser: true,
	// useCreateIndex: true,
	// useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('database connected');
});

// product

const productSchema = new Schema({
	name: String,
	price: Number,
	season: {
		type: String,
		enum: ['spring', 'summer', 'fall', 'winter'],
	},
});

const farmSchema = new Schema({
	name: String,
	city: String,
	products: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Product',
		},
	],
});

//model
const Product = mongoose.model('Product', productSchema);
const Farm = mongoose.model('Farm', farmSchema);

// Product.insertMany([
// 	{
// 		name: 'Goddess Melon',
// 		price: 4.99,
// 		season: 'summer',
// 	},
// 	{
// 		name: 'sugar baby watermelon',
// 		price: 5.99,
// 		season: 'summer',
// 	},
// 	{
// 		name: 'asparagus',
// 		price: 2.99,
// 		season: 'spring',
// 	},
// ]);

const makeFarm = async () => {
	const farm = new Farm({ name: 'Full Belly Farms', city: 'Guinda, CA' });
	const melon = await Product.findOne({ name: 'Goddess Melon' });
	farm.products.push(melon);
	await farm.save();
	console.log(farm);
};

// makeFarm();

const addProduct = async () => {
	const farm = await Farm.findOne({ name: 'Full Belly Farms' });
	const watermelon = await Product.findOne({ name: 'sugar baby watermelon' });
	farm.products.push(watermelon);
	await farm.save();
	console.log(farm);
};

// addProduct();
Farm.findOne({
	name: 'Full Belly Farms',
})
	.populate('products')
	.then((farm) => console.log(farm));
