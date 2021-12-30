import { apiCall } from './utils/helpers';
import { notify } from './utils/notifications';

const vars = process.env;
const { action, goTo, taskId, taskNotes, requestMethod, taskHours } = vars;
const stopRestart = vars.stopRestart || '';

let url = `https://api.harvestapp.com/v2/time_entries/${taskId}/${stopRestart}`;

if (action === 'note') {
    const prevNote = taskNotes || '';

    // Convert any bullets.
    const newNote = process.argv[2].replace(/^(\-|\*|\–)\s?/g, (0 === prevNote.length) ? '\u2022 ' : '\u2022 ');

    // Format previous notes from new notes.
    const newFormattedNote = (0 === prevNote.length)
        ? newNote // Just use the new note without any concern for the previous (because there is none).

        // Separate notes/bullets from previous.
        : (-1 !== newNote.indexOf('\u2022'))
            ? `${prevNote}\n${newNote}` // Bullets get a single line separator \n from the previous note (bullet or otherwise).
            : `${prevNote}\n\n${newNote}`; // While all other notes get two separators \n\n from the previous.

    const note = encodeURIComponent(newFormattedNote.trim());

    url = `https://api.harvestapp.com/v2/time_entries/${taskId}?notes=${note}`;
}

if (action === 'adjust-timer') {
    url = `https://api.harvestapp.com/v2/time_entries/${taskId}?hours=${taskHours}`;
}

// bail when user is 'redirected' to other command
if (!goTo) {

    await apiCall(url, requestMethod)
        .then(response => {
            if (action === 'note') {
                notify(
                    'Harvest note updated!',
                    response.notes
                );
            }
            else if (action === 'adjust-timer') {
                notify(
                    'Harvest timer adjusted!',
                    `Hours: ${response.hours}`
                );
            }
            else if (stopRestart === 'stop') {
                notify(
                    'Harvest timer stopped!',
                    `${response.project.name}, ${response.task.name}`
                );
            }
            else if (stopRestart === 'restart') {
                notify(
                    'Harvest timer started!',
                    `${response.project.name}, ${response.task.name}`
                );
            }
            else {
                notify(
                    'Harvest timer updated!'
                );
            }
        })
        .catch(error => {
            notify(
                'Failed to update task.',
                'Check your network connection and try again.'
            );
        });
}