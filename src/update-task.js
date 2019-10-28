import { apiCall } from './utils.js';

const vars = process.env;
const { action, taskId, taskNotes, requestMethod, taskHours } = vars;
const stopRestart = vars.stopRestart || '';

let url = `https://api.harvestapp.com/v2/time_entries/${taskId}/${stopRestart}`;

if (action === 'note') {
    const prevNote = taskNotes || '';
    const note = encodeURIComponent(`${prevNote}${process.argv[2]}`);
    url = `https://api.harvestapp.com/v2/time_entries/${taskId}?notes=${note}`;
}

if (action === 'adjust-timer') {
    url = `https://api.harvestapp.com/v2/time_entries/${taskId}?hours=${taskHours}`;
}

apiCall(url, requestMethod);