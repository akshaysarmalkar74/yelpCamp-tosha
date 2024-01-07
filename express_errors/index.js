/** @format */

const express = require('express');
const app = express();
const morgan = require('morgan');
const appError = require('./appError');

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
	// res.send('SORRY YOU NEED A PASSWORD!');
	throw new appError(401, 'password required');
	// throw new appError(401, 'Password Required');
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

app.get('/error', (req, res) => {
	chicken.fly();
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

app.get('/admin', (req, res) => {
	throw new appError(403, 'youre forbidden');
});

app.use((req, res) => {
	res.status(404).send('not found');
});

// define your own error here after the other app.use()
// app.use((err, req, res, next) => {
// 	console.log('********************');
// 	console.log('********* E R R O R ***********');
// 	console.log('********************');
// 	// res.status(500).send('oh no you got an error');
// 	console.log(err);
// 	next(err);
// });
app.use((err, req, res, next) => {
	const { status = 500, message = 'something went wrong' } = err;
	res.status(status).send(message);
});

app.listen(3000, () => {
	console.log('app is running on localhost:3000');
});
