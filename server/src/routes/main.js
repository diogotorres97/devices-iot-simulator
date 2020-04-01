const router = require('express').Router();
const { mainController } = require('../controllers');

router.get('/:scenario/load', async (req, res) => {
  const { scenario } = req.params;

  try {
    mainController.loadScenario(scenario);
    res.status(200).send();
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/:scenario/start', async (req, res) => {
  const { scenario } = req.params;

  try {
    mainController.startScenario(scenario);
    res.status(200).send();
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/:scenario/reset', async (req, res) => {
  const { scenario } = req.params;

  try {
    mainController.resetScenario(scenario);
    res.status(200).send();
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/:scenario/:actuator/status', async (req, res) => {
  const { scenario, actuator } = req.params;

  try {
    const device = mainController.data[scenario].actuators
      .filter((elem) => elem.topic === actuator);
    res.status(200).send(device);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
