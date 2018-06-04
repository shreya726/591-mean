let express = require('express');
let router = express.Router();

router.get('/:test', function(req, res, next) {
	let string = req.params.test;
  	res.send({'string': string, 'length': string.length});
});

router.post('/', function(req, res, next) {
	let string = req.body.string;
	res.json({'string': string, 'length': string.length});
});

module.exports = router;