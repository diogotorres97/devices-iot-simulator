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

router.get('/scenarios', async (_, res) => {
  try {
    const scenarios = await mainController.getScenarios();
    res.status(200).send(scenarios);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/topics', async (_, res) => {
  try {
    const scenariosInfo = await mainController.getScenariosInfo();
    res.status(200).send(scenariosInfo);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
