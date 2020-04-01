const router = require('express').Router();

/*+++++++++++++++++++++++++++++++++++++++++++++
 Routes
 ++++++++++++++++++++++++++++++++++++++++++++++*/

const todos = require('./todos');
const todoItems = require('./todoItems');


router.use('/api/', todos);
router.use('/api/', todoItems);


module.exports = router;
