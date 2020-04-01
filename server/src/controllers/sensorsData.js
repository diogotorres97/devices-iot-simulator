const fs = require('fs');
const path = require('path');
const { amqpAPI } = require('../services/amqp');
const router = require('express').Router();

const getDirectories = (source) => fs.readdirSync(source, { withFileTypes: true }).filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);

const data = {};

const { sleep } = require('../utils/utils');

const loadData = async () => {
  await sleep(5000);
  // Data Path
  const dataPath = path.resolve(`${__dirname}/../data`);

  // Get Cenarios Directories
  const cenarioDirs = getDirectories(dataPath);
  console.log(cenarioDirs);

  // For each cenario create an object, iterate data and actuators
  cenarioDirs.forEach((cenarioDir) => {
    const cenarioPath = `${dataPath}/${cenarioDir}`;
    data[cenarioDir] = {};
    // Process sensors data
    if (!fs.existsSync(`${cenarioPath}/sensors-data`)) return;

    data[cenarioDir].sensorsData = [];
    const sensorsDataFiles = fs.readdirSync(`${cenarioPath}/sensors-data`);
    // Push each data file into array
    sensorsDataFiles.forEach((sensorDataFileName) => {
      const sensorDataFile = JSON.parse(fs.readFileSync(`${cenarioPath}/sensors-data/${sensorDataFileName}`));
      data[cenarioDir].sensorsData.push(...sensorDataFile);
    });

    // Sort array by timestamp
    data[cenarioDir].sensorsData.sort((a, b) => a.timestamp - b.timestamp);

    // Get Topics
    const topics = getTopics(cenarioDir);

    // Create Queues
    generateQueues(cenarioDir, topics);

    // Process actuators
    if (!fs.existsSync(`${cenarioPath}/actuators`)) return;
    data[cenarioDir].actuators = [];

    const actuatorsFiles = fs.readdirSync(`${cenarioPath}/actuators`);
    actuatorsFiles.forEach((actuatorsFileName) => {
      const actuatorsFile = JSON.parse(fs.readFileSync(`${cenarioPath}/actuators/${actuatorsFileName}`));
      data[cenarioDir].actuators.push(...actuatorsFile);
    });

    generateRoutes(cenarioDir, data[cenarioDir].actuators);
  });

  // Close files / dirs
  publishData('agriculture');
};

// Actuators
const generateRoutes = (cenarioDir, actuators) => {
  actuators.forEach((actuator) => {
    // Receive commands and update current actuator value
    amqpAPI.assertQueue(`${cenarioDir}/${actuator.topic}/command`);
    amqpAPI.consumeMessage(`${cenarioDir}/${actuator.topic}/command`, (message) => {
      const messageObject = amqpAPI.parseMessage(message);

      actuator.value = messageObject;
    });

    // Generate route to retrieve actuator status
    // Not needed due to generic route http
  });
};


// Sensors Data
const getTopics = (cenarioDir) => {
  let topics = data[cenarioDir].sensorsData.map((data) => data.topic);
  topics = Array.from(new Set(topics));
  return topics;
};

const generateQueues = (cenarioDir, topics) => {
  topics.forEach((topic) => amqpAPI.assertQueue(`${cenarioDir}/${topic}`));
};

const purgeQueues = (cenarioDir, topics) => {
  topics.forEach((topic) => amqpAPI.purgeQueue(`${cenarioDir}/${topic}`));
};

const publishData = (cenarioDir) => {
  data[cenarioDir].sensorsData.forEach((message) => {
    amqpAPI.publishMessage(`${cenarioDir}/${message.topic}`, message.payload);
  });
};

module.exports = {
  load: loadData,
  data,
};
