const router = require('express').Router();

/*+++++++++++++++++++++++++++++++++++++++++++++
 Routes
 ++++++++++++++++++++++++++++++++++++++++++++++*/

const todos = require('./todos');


router.use('/api/', todos);


module.exports = router;
