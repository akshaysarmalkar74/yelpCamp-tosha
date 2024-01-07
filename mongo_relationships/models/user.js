/** @format */
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/relationshipDB', {
	useNewUrlParser: true,
	// useCreateIndex: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('database connected');
});

const userSchema = new mongoose.Schema({
	first: String,
	last: String,
	addresses: [
		{
			_id: { _id: false },
			street: String,
			city: String,
			state: String,
			country: String,
			zip: Number,
		},
	],
});

const User = mongoose.model('User', userSchema);

const makeUser = async () => {
	const u = new User({
		first: 'Harry2',
		last: 'Potter2',
	});
	u.addresses.push({
		street: '123 sesame street',
		city: 'new york',
		state: 'NY',
		country: 'USA',
		zip: 80601,
	});
	const res = await u.save();
	console.log(res);
};

const addAddress = async (id) => {
	const user = await User.findById(id);
	user.addresses.push({
		street: '10 elmo street',
		city: 'brighton',
		state: 'CO',
		country: 'USA',
		zip: 80601,
	});
	const res = await user.save();
	console.log(res);
};

// makeUser();
addAddress('6578f3a67967c6f0b9ae476f');
