const {
//   AMQP_QUEUE_REQUEST_STOCK,
} = require('../config/configs');
const { amqpAPI } = require('../services/amqp');


const create = async (quantity, bookId, clientId) => {
  // Make a request to warehouse
  amqpAPI.publishMessage(AMQP_QUEUE_REQUEST_STOCK,
    amqpAPI.createMessage(
      messageType.requestStock,
      {
        title: book.title,
        quantity: quantity + 10,
      },
    ));
};

module.exports = {
  create,
};
