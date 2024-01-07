/** @format */

const express = require('express');
const app = express();
const morgan = require('morgan');

//middleware morgan - must go before the routes otherwise it will not work
app.use(morgan('tiny'));

//middleware
app.use((req, res, next) => {
	req.requestTime = Date.now();
	console.log(req.method, req.path);
	return next();
});

app.use('/dogs', (req, res, next) => {
	console.log('i love dogs');
	next();
});

const verifyPassword = (req, res, next) => {
	const { password } = req.query;
	if (password === 'chickennugget') {
		next();
	}
	res.send('SORRY YOU NEED A PASSWORD!');
};
// app.use((req, res, next) => {
// 	console.log('this is my first middleware');
// 	return next();
// 	console.log(
// 		'this is my first middleware- after calling next - this will not run because you returned next'
// 	);
// });

// app.use((req, res, next) => {
// 	console.log('this is my second middleware');
// 	return next();
// });
// app.use((req, res, next) => {
// 	console.log('this is my third middleware');
// 	return next();
// });

app.get('/', (req, res) => {
	console.log(`REQUEST DATE: ${req.requestTime}`);
	res.send('home page');
});

app.get('/dogs', (req, res) => {
	console.log(`REQUEST DATE: ${req.requestTime}`);
	res.send('WOOF WOOF');
});

app.get('/secret', verifyPassword, (req, res) => {
	res.send(
		"Sometimes I wear headphones in public so I don't have to talk to anyone"
	);
});

app.use((req, res) => {
	res.status(404).send('not found');
});

app.listen(3000, () => {
	console.log('app is running on localhost:3000');
});
