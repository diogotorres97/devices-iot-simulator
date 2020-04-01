const fs = require('fs');
const { amqpAPI } = require('../services/amqp');

const initialize = (scenario, scenarioPath, data) => {
  load(scenarioPath, data);
  const topics = getTopics(data);
  generateQueues(scenario, topics);
};

const reset = (scenario, data) => {
  const topics = getTopics(data);
  purgeQueues(scenario, topics);
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

const generateQueues = (scenario, topics) => {
  topics.forEach((topic) => amqpAPI.assertQueue(`${scenario}/${topic}`));
};

const purgeQueues = (scenario, topics) => {
  topics.forEach((topic) => amqpAPI.purgeQueue(`${scenario}/${topic}`));
};

// TODO: Add sleep between messages
const publish = (scenario, data) => {
  data.sensorsData.forEach((message) => {
    amqpAPI.publishMessage(`${scenario}/${message.topic}`, message.payload);
  });
};

module.exports = {
  initialize,
  publish,
  reset,
};
