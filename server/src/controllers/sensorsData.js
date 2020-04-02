const fs = require('fs');
const { amqpAPI } = require('../services/amqp');
const { sleep } = require('../utils/utils');

const MESSAGE_FREQUENCY = 1000;

const initialize = async (scenario, scenarioPath, data) => {
  load(scenarioPath, data);
  const topics = getTopics(data);
  await generateQueues(scenario, topics);
};

const reset = async (scenario, data) => {
  const topics = getTopics(data);
  await purgeQueues(scenario, topics);
};

const load = (scenarioPath, data) => {
  if (!fs.existsSync(`${scenarioPath}/sensors-data`)) return;

  const sensorsDataFiles = fs.readdirSync(`${scenarioPath}/sensors-data`);
  sensorsDataFiles.forEach((sensorDataFileName) => {
    const sensorDataFile = JSON.parse(fs.readFileSync(`${scenarioPath}/sensors-data/${sensorDataFileName}`));
    data.sensorsData.push(...sensorDataFile);
  });

  // Sort messages by timestamp
  data.sensorsData.sort((a, b) => a.payload.timestamp - b.payload.timestamp);
};

const getTopics = (data) => {
  const topics = data.sensorsData.map((message) => message.topic);
  return Array.from(new Set(topics));
};

const generateQueues = async (scenario, topics) => {
  for await (const topic of topics) {
    await amqpAPI.assertQueue(`${scenario}/${topic}`);
  }
};

const purgeQueues = async (scenario, topics) => {
  for await (const topic of topics) {
    await amqpAPI.purgeQueue(`${scenario}/${topic}`);
  }
};

const publish = async (scenario, data, messageFrequency) => {
  for await (const message of data.sensorsData) {
    amqpAPI.publishMessage(`${scenario}/${message.topic}`, message.payload);
    await sleep(messageFrequency || MESSAGE_FREQUENCY);
  }
};

module.exports = {
  initialize,
  publish,
  reset,
};
