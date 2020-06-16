const router = require('express').Router();

/*+++++++++++++++++++++++++++++++++++++++++++++
 Routes
 ++++++++++++++++++++++++++++++++++++++++++++++*/

const main = require('./main');
const scenario = require('./scenario');


router.use('/', main);
router.use('/', scenario);


module.exports = router;
