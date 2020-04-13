const path = require('path');

const actuatorsController = require('./actuators');
const sensorsDataController = require('./sensorsData');
const validationController = require('./validation');

const { sleep, getDirectories } = require('../utils/utils');

const DATA_PATH = path.resolve(`${__dirname}/../data`);

const data = {};

const load = async () => {
  const scenarios = getScenarios();
  await Promise.all(scenarios.map((scenario) => loadScenario(scenario)));
};

const start = async (messageFrequency) => {
  const scenarios = getScenarios();
  await Promise.all(scenarios.map((scenario) => startScenario(scenario, messageFrequency)));
};

const reset = async () => {
  const scenarios = getScenarios();
  await Promise.all(scenarios.map((scenario) => resetScenario(scenario)));
};

const loadScenario = async (scenario) => {
  const scenarioPath = `${DATA_PATH}/${scenario}`;
  scenario = scenario.replace(/\d+/g, '');
  data[scenario] = { sensorsData: [], actuators: [], validation: [] };

  await Promise.all([
    // Process sensors data
    sensorsDataController.initialize(scenario, scenarioPath, data[scenario]),

    // Process actuators
    actuatorsController.initialize(scenario, scenarioPath, data[scenario]),

    // Process actuators initial and expected final state
    validationController.load(scenarioPath, data[scenario]),
  ]);
};

const getScenarios = () => getDirectories(DATA_PATH);

const checkIfScenarioExists = (scenario) => getScenarios().includes(scenario);

const resetScenario = async (scenario) => {
  scenario = scenario.replace(/\d+/g, '');
  await Promise.all([
    // Process actuators
    actuatorsController.reset(scenario, data[scenario]),
  ]);
};

const startScenario = async (scenario, messageFrequency) => {
  scenario = scenario.replace(/\d+/g, '');
  await resetScenario(scenario);

  // Start publishing Data
  await sensorsDataController.publish(scenario, data[scenario], messageFrequency);
};

const validateScenario = async (scenario, messageFrequency) => {
  scenario = scenario.replace(/\d+/g, '');
  await resetScenario(scenario);

  // Initiate validation state
  validationController.initialize(data[scenario]);

  // Start publishing Data
  await sensorsDataController.publish(scenario, data[scenario], messageFrequency);

  // Sleep for few seconds
  await sleep(5000);

  // Validate actuators final state
  return validationController.validate(data[scenario]);
};

const getActuators = (scenario) => data[scenario].actuators;

const getsensorsData = (scenario) => data[scenario].sensorsData;

const getScenariosInfo = () => {
  const result = {};
  const scenarios = getScenarios();
  scenarios.forEach((scenario) => {
    result[scenario] = getScenarioInfo(scenario);
  });

  return result;
};

const getScenarioInfo = (scenario) => ({
  actuatorsQueues: actuatorsController.getTopics(data[scenario]),
  sensorsQueues: sensorsDataController.getTopics(data[scenario]),
});


module.exports = {
  load,
  start,
  reset,
  getScenarios,
  getScenariosInfo,
  getScenarioInfo,
  checkIfScenarioExists,
  loadScenario,
  startScenario,
  resetScenario,
  validateScenario,
  getActuators,
  getsensorsData,
};
