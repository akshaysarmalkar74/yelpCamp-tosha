/** @format */

const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
	if (req.query.isAdmin) {
		return next();
	}
	res.send('sorry not an admin');
});
router.get('/topsecret', (req, res) => {
	res.send('this is top secret');
});

router.get('/deleteeverything', (req, res) => {
	res.send('delete everything');
});

module.exports = router;
