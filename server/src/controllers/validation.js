const fs = require('fs');

const initialize = (data) => {
  data.validation.forEach((actuatorValidate) => {
    const actuator = data.actuators.find((element) => element.topic === actuatorValidate.topic);
    actuator.value = actuatorValidate.initialState;
  });
};

const load = (scenarioPath, data) => {
  if (!fs.existsSync(`${scenarioPath}/validation`)) return;

  const validationFiles = fs.readdirSync(`${scenarioPath}/validation`);
  validationFiles.forEach((validationFileName) => {
    const validationFile = JSON.parse(fs.readFileSync(`${scenarioPath}/validation/${validationFileName}`));
    data.validation.push(...validationFile);
  });
};

const validate = (data) => {
  let validation = true;
  data.validation.forEach((actuatorValidate) => {
    const actuator = data.actuators.find((element) => element.topic === actuatorValidate.topic);
    if (actuator.value != actuatorValidate.finalState) {
      validation = false;
    }
  });

  return validation;
};

module.exports = {
  initialize,
  load,
  validate,
};
