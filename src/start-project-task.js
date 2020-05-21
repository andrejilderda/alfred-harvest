import { apiCall } from './utils/helpers';
import { getToday } from './utils/time';
import { notify } from './utils/notifications';
const alfy = require('alfy');

const vars = process.env;
const { projectId, projectName, taskId, taskName } = vars;

const today = getToday();

const url = `https://api.harvestapp.com/v2/time_entries?project_id=${projectId}&task_id=${taskId}&spent_date=${today}`;

await apiCall(url, 'POST')
    .then(response => {
        if (response.is_running) {
            notify(
                'Harvest timer started!',
                `${projectName}, ${taskName}`
            );
        }
    })
    .catch(error => {
        if (error.message.includes('RequestError: getaddrinfo ENOTFOUND')) {
            notify(
                'Failed to start Harvest timer.',
                'Check your network connection and try again.'
            );
        }

        notify(error.message);
    });