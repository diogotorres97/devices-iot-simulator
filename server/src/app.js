const port = process.env.PORT || 3000;

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const { AMQP_URL } = require('./config/configs');
const { amqpAPI } = require('./services/amqp');

// Set up the express app
const app = express();
const routes = require('./routes/index');

app.use(cors());

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Require our routes into the application.
app.use('/', routes);

// AMQP Connection
amqpAPI.connect(AMQP_URL);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});


module.exports = app;
