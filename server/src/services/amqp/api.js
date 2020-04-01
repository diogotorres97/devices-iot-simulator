const amqp = require('amqplib/callback_api');

let amqpConnection;
let amqpChannel;
let isConnecting = false;

function connect(amqpUrl, queuesNameArray) {
  if (isConnecting) return;
  isConnecting = true;

  amqp.connect(amqpUrl, (err, connection) => {
    isConnecting = false;

    if (err) {
      console.error('[AMQP]', err.message);
      return setTimeout(connect, 1000, amqpUrl, queuesNameArray);
    }
    connection.on('error', (err) => {
      if (err.message !== 'Connection closing') {
        console.error('[AMQP] connection error', err.message);
      }
    });
    connection.on('close', () => {
      console.error('[AMQP] reconnecting');
      return setTimeout(connect, 1000, amqpUrl, queuesNameArray);
    });
    console.log('[AMQP] connected');
    amqpConnection = connection;
    createChannel(queuesNameArray);
  });
}

function createChannel(queuesNameArray) {
  amqpConnection.createChannel((err, channel) => {
    if (closeOnErr(err)) return;
    channel.on('error', (err) => {
      console.error('[AMQP] channel error', err.message);
    });
    channel.on('close', () => {
      console.log('[AMQP] channel closed');
    });

    channel.prefetch(10);
    amqpChannel = channel;
    queuesNameArray.forEach(queueName => assertQueue(queueName));
  });
}

function assertQueue(queueName) {
  amqpChannel.assertQueue(queueName, { durable: false }, (err, _ok) => {
    if (closeOnErr(err)) return;
  });
}

function publishMessage(queueName, message) {
  amqpChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  console.log(`[AMQP] Send message: ${message}`);
}

function consumeMessage(queueName, handleMessage) {
  amqpChannel.consume(queueName, handleMessage, { noAck: true });
}

function createMessage(type, payload) {
  return {
    type,
    payload,
  };
}

function parseMessage(msg) {
  const messageString = msg.content.toString();
  const messageObject = JSON.parse(messageString);
  console.log(`[AMQP] Consume a message: ${messageString}`);
  return messageObject;
}

function closeOnErr(err) {
  if (!err) return false;
  console.error('[AMQP] error', err);
  amqpConnection.close();
  return true;
}

module.exports = {
  connect,
  publishMessage,
  consumeMessage,
  createMessage,
  parseMessage,
};
