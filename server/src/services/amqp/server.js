const amqpAPI = require('./api');
const { sleep } = require('../../utils/utils');
const {
  AMQP_URL,
} = require('../../config/configs');

async function start() {
  amqpAPI.connect(AMQP_URL);
  // await sleep(1000);
}

module.exports = {
  start,
};
