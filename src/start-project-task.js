import { apiCall, getToday } from './utils/helpers';
const alfy = require('alfy');

const vars = process.env;
const { projectId, taskId } = vars;

const today = getToday();
const url = `https://api.harvestapp.com/v2/time_entries?project_id=${projectId}&task_id=${taskId}&spent_date=${today}`;

apiCall(url, 'POST');