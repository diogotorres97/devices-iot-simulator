const fs = require('fs');
const { mqttAPI } = require('../services/mqtt');

const initialize = async (scenario, scenarioPath, data) => {
  load(scenarioPath, data);
  await subscribeQueues(scenario, data);
};

const reset = async (scenario, data) => {
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

const subscribeQueues = async (scenario, data) => {
  for await (const actuator of data.actuators) {
    // Create commands Queue
    await mqttAPI.subscribeQueue(`${scenario}/${actuator.topic}/command`);

    // Receive commands and update current actuator value
    mqttAPI.consumeMessage((topic, message) => {
      if (topic !== `${scenario}/${actuator.topic}/command`) return;

      const messageObject = mqttAPI.parseMessage(message);
      actuator.value = messageObject;
    });
  }
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
