const router = require('express').Router();
const { mainController } = require('../controllers');

router.get('/load', async (_, res) => {
  try {
    await mainController.load();
    res.status(200).send();
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/start/:messageFrequency?', async (req, res) => {
  const { messageFrequency } = req.params;

  try {
    await mainController.start(messageFrequency);
    res.status(200).send();
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/reset', async (_, res) => {
  try {
    await mainController.reset();
    res.status(200).send();
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/:scenario/load', async (req, res) => {
  const { scenario } = req.params;

  try {
    await mainController.loadScenario(scenario);
    res.status(200).send();
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/:scenario/start/:messageFrequency?', async (req, res) => {
  const { scenario, messageFrequency } = req.params;

  try {
    await mainController.startScenario(scenario, messageFrequency);
    res.status(200).send();
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/:scenario/reset', async (req, res) => {
  const { scenario } = req.params;

  try {
    await mainController.resetScenario(scenario);
    res.status(200).send();
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/:scenario/validate/:messageFrequency?', async (req, res) => {
  const { scenario, messageFrequency } = req.params;

  try {
    const validate = await mainController.validateScenario(scenario, messageFrequency);
    res.status(200).send(validate);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/:scenario/:actuator/status', (req, res) => {
  const { scenario, actuator } = req.params;

  try {
    const device = mainController.getActuators(scenario)
      .filter((elem) => elem.topic === actuator);
    res.status(200).send(device);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
