import alfy from 'alfy';
import { apiCall } from './utils/helpers.js';
import { getToday, calculate } from './utils/time.js';
import { notify } from './utils/notifications.js';
import { alfredError } from './utils/errors.js';

const vars = process.env;
const { projectId, projectName, taskId, taskName } = vars;
const input = alfy.input ? alfy.input.trim() : '';

if (!input) {
    alfy.output([{
        title: 'Enter duration and note',
        subtitle: 'Format: 2.5 note text or 2h30m note text',
        icon: { path: alfy.icon.error }
    }]);
    return;
}

const spaceIndex = input.indexOf(' ');
const durationPart = spaceIndex === -1 ? input : input.substring(0, spaceIndex);
const notePart = spaceIndex === -1 ? '' : input.substring(spaceIndex + 1).trim();

const hours = calculate(durationPart, 0);
if (hours === undefined || hours <= 0) {
    alfredError(new Error('Invalid duration format'), 'Failed to create log.');
    return;
}

const today = getToday();
const encodedNote = encodeURIComponent(notePart);
const url = `https://api.harvestapp.com/v2/time_entries?project_id=${projectId}&task_id=${taskId}&spent_date=${today}&hours=${hours}&notes=${encodedNote}`;

await apiCall(url, 'POST')
    .then(response => {
        notify('Harvest log created!', `${hours}h - ${projectName}, ${taskName}`);
    })
    .catch(error => {
        alfredError(error, 'Failed to create log.');
    });
