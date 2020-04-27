const router = require('express').Router();

/*+++++++++++++++++++++++++++++++++++++++++++++
 Routes
 ++++++++++++++++++++++++++++++++++++++++++++++*/

const main = require('./main');
const scenario = require('./scenario');
const metrics = require('./metrics');


router.use('/', main);
router.use('/', scenario);
router.use('/', metrics);


module.exports = router;
