const router = require('express').Router();
const { sensorsDataController } = require('../controllers');

router.get('/:cenario/:actuator/status', async (req, res) => {
  const { cenario, actuator } = req.params;

  try {
    const device = sensorsDataController.data[cenario].actuators.filter((elem) => elem.topic == actuator);
    res.status(200).send(device);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
