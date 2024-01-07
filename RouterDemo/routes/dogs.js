/** @format */

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.send('all dogs');
});
router.get('/:id', (req, res) => {
	res.send('get a dogs');
});
router.get('/:id/edit', (req, res) => {
	res.send('edit a dogs');
});

module.exports = router;
