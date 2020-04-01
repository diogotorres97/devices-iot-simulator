const path = require('path');

const actuatorsController = require('./actuators');
const sensorsDataController = require('./sensorsData');
const { sleep, getDirectories } = require('../utils/utils');

const DATA_PATH = path.resolve(`${__dirname}/../data`);

const data = {};


const load = () => {
  const scenarios = getScenarios();
  scenarios.forEach((scenario) => loadScenario(scenario));
};

const loadScenario = (scenario) => {
  const scenarioPath = `${DATA_PATH}/${scenario}`;
  data[scenario] = { sensorsData: [], actuators: [] };
  // Process sensors data
  sensorsDataController.initialize(scenario, scenarioPath, data[scenario]);

  // Process actuators
  actuatorsController.initialize(scenario, scenarioPath, data[scenario]);
};

const getScenarios = () => getDirectories(DATA_PATH);

const checkIfScenarioExists = (scenario) => getScenarios().includes(scenario);

const resetScenario = (scenario) => {
  // Process sensors data
  sensorsDataController.reset(scenario, data[scenario]);

  // Process actuators
  actuatorsController.reset(scenario, data[scenario]);
};

const startScenario = (scenario) => {
  // Sanity check to clear queues
  // resetScenario(scenario);

  // Start publishing Data
  sensorsDataController.publish(scenario, data[scenario]);
};

const validateScenario = (scenario) => {
  // Sanity check to clear queues
  // resetScenario(scenario);

  // Start publishing Data
  sensorsDataController.publish(scenario, data[scenario]);

  // Sleep for few seconds

  // Validate actuators final state
};

module.exports = {
  loadScenario,
  startScenario,
  resetScenario,
  data,
};
