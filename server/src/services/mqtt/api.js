const mqtt = require('async-mqtt');

let mqttClient;

async function connect(amqpUrl) {
  mqttClient = await mqtt.connectAsync(amqpUrl);
}

function subscribeQueue(queueName) {
  return mqttClient.subscribe(queueName);
}

function publishMessage(queueName, message) {
  console.log(`[MQTT] Send message: ${JSON.stringify(message)}`);

  return mqttClient.publish(queueName, Buffer.from(JSON.stringify(message)));
}

function consumeMessage(handleMessage) {
  mqttClient.on('message', handleMessage);
}

function parseMessage(msg) {
  const messageString = msg.toString();
  let messageObject;
  try {
    messageObject = JSON.parse(messageString);
  } catch (e) {
    messageObject = JSON.parse(JSON.stringify(messageString));
  }
  console.log(`[MQTT] Consume a message: ${messageString}`);
  return messageObject;
}

module.exports = {
  connect,
  subscribeQueue,
  publishMessage,
  consumeMessage,
  parseMessage,
};
