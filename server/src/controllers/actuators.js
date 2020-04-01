const fs = require('fs');
const { amqpAPI } = require('../services/amqp');


const initialize = (scenario, scenarioPath, data) => {
  load(scenarioPath, data);
  generateQueues(scenario, data);
};

const reset = (scenario, data) => {
  const topics = getTopics(data);
  purgeQueues(scenario, topics);
  resetDefaultValues(data);
};

const load = (scenarioPath, data) => {
  if (!fs.existsSync(`${scenarioPath}/actuators`)) return;

  const actuatorsFiles = fs.readdirSync(`${scenarioPath}/actuators`);
  actuatorsFiles.forEach((actuatorsFileName) => {
    const actuatorsFile = JSON.parse(fs.readFileSync(`${scenarioPath}/actuators/${actuatorsFileName}`));
    data.actuators.push(...actuatorsFile);
  });
};

const generateQueues = (scenario, data) => {
  data.actuators.forEach((actuator) => {
    // Create commands Queue
    amqpAPI.assertQueue(`${scenario}/${actuator.topic}/command`);

    // Receive commands and update current actuator value
    amqpAPI.consumeMessage(`${scenario}/${actuator.topic}/command`, (message) => {
      const messageObject = amqpAPI.parseMessage(message);
      actuator.value = messageObject;
    });
  });
};

const purgeQueues = (scenario, topics) => {
  topics.forEach((topic) => amqpAPI.purgeQueue(`${scenario}/${topic}/command`));
};

const resetDefaultValues = (data) => {
  data.actuators.forEach((actuator) => actuator.value = actuator.defaultValue);
};

const getTopics = (data) => {
  const topics = data.actuators.map((device) => device.topic);
  return Array.from(new Set(topics));
};

module.exports = {
  initialize,
  reset,
};
