const path = require('path');
const fs = require('fs');

const LOGS_PATH = path.resolve(`${__dirname}/../logs`);

const CURRENT_ID = 3;
let CURRENT_TASK = 'task1'

const load = async (task) => {
  CURRENT_TASK = task;
};

const event = async (eventName) => {
    const data = `${CURRENT_ID},${CURRENT_TASK},${eventName},${new Date().toISOString()}\n`;
    await fs.writeFileSync(`${LOGS_PATH}/${CURRENT_ID}.csv`, data, {flag: 'a'}); 
};

module.exports = {
  load,
  event,
};
