/** @format */

const mongoose = require('mongoose');
const { Schema } = mongoose;

// schema
const productSchema = new Schema({
	name: {
		type: String,
		required: [true, 'name cannot be blank'],
	},
	price: {
		type: Number,
		required: true,
		min: 0,
	},
	category: {
		type: String,
		lowercase: true,
		enum: ['fruit', 'vegetable', 'dairy'],
	},
	farm: {
		type: Schema.Types.ObjectId,
		ref: 'Farm',
	},
});

// model
const Product = mongoose.model('Product', productSchema);

// export model
module.exports = Product;
