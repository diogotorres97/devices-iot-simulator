const mqtt = require('async-mqtt');

let mqttClient;

async function connect(amqpUrl) {
  mqttClient = await mqtt.connectAsync(amqpUrl);
}

function subscribeQueue(queueName) {
  return mqttClient.subscribe(queueName);
}

function publishMessage(queueName, message) {
  console.log(`[AMQP] Send message: ${JSON.stringify(message)}`);

  return mqttClient.publish(queueName, Buffer.from(JSON.stringify(message)));
}

function consumeMessage(handleMessage) {
  mqttClient.on('message', handleMessage);
}

function parseMessage(msg) {
  const messageString = msg.toString();
  const messageObject = JSON.parse(JSON.stringify(messageString));
  console.log(`[AMQP] Consume a message: ${messageString}`);
  return messageObject;
}

module.exports = {
  connect,
  subscribeQueue,
  publishMessage,
  consumeMessage,
  parseMessage,
};
