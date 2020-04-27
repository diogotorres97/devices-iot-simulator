const router = require('express').Router();
const { metricsController } = require('../controllers');

router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    await metricsController.setUserId(userId);
    res.status(200).send();
  } catch (error) {
    res.status(400).send(error.message);
  }
});


router.get('/task/:task', async (req, res) => {
  const { task } = req.params;

  try {
    await metricsController.setTask(task);
    res.status(200).send();
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/event/:eventName', async (req, res) => {
  const { eventName } = req.params;

  try {
    await metricsController.event(eventName);
    res.status(200).send();
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
