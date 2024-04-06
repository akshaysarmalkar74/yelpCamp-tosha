/** @format */

const mongoose = require('mongoose');
const cities = require('./cities'); //cities
const { places, descriptors } = require('./seedHelpers'); //random descriptors places
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

//database connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

// seed logic
const seedDB = async () => {
	await Campground.deleteMany({}); //delete everything
	for (let i = 0; i < 200; i++) {
		//make 30 of them
		//random selection of city state, descriptors and places
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new Campground({
			//my user id - no one elses
			author: '65d7f33d11c9fb6d878a3bb7',
			location: `${cities[random1000].city}, ${cities[random1000].state}`, //city and state name random choosing
			title: `${sample(descriptors)} ${sample(places)}`, //descriptors and places random choosing
			images: [
				{
					url: 'https://res.cloudinary.com/dxjnynp3w/image/upload/v1710211818/yelpcamp/cnuihzqyzdvu4eqhhnsb.jpg',
					filename: 'yelpcamp/cnuihzqyzdvu4eqhhnsb',
				},
				{
					url: 'https://res.cloudinary.com/dxjnynp3w/image/upload/v1710211821/yelpcamp/orh5ibme4po598sccvp1.jpg',
					filename: 'yelpcamp/orh5ibme4po598sccvp1',
				},
			],

			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ',
			price,
			geometry: {
				type: 'Point',
				coordinates: [
					cities[random1000].longitude,
					cities[random1000].latitude,
				],
			},
		});

		await camp.save(); //save
	}
};

seedDB().then(() => {
	mongoose.connection.close();
}); //execute seedDB and close connection
