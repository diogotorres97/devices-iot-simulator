const fs = require('fs');
const { mqttAPI } = require('../services/mqtt');
const { sleep } = require('../utils/utils');

const MESSAGE_FREQUENCY = 1000;

const initialize = async (scenario, scenarioPath, data) => {
  load(scenarioPath, data);
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

const publish = async (scenario, data, messageFrequency) => {
  for await (const message of data.sensorsData) {
    mqttAPI.publishMessage(`${scenario}/${message.topic}`, message.payload);
    await sleep(messageFrequency || MESSAGE_FREQUENCY);
  }
};

module.exports = {
  initialize,
  publish,
};
