const port = process.env.PORT || 3000;

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MQTT_URL } = require('./config/configs');
const { mqttAPI } = require('./services/mqtt');

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

(async () => {
  // MQTT Connection
  try {
    await mqttAPI.connect(MQTT_URL);
  } finally {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
  }
})();

module.exports = app;
