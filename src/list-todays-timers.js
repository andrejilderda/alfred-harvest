import { alfredError } from './utils/errors';
import { apiCall } from './utils/helpers';
import { getToday, roundTime } from './utils/time';
const alfy = require('alfy');

const today = getToday();
const userId = alfy.config.get('userId') || '';

const url = `https://api.harvestapp.com/v2/time_entries?user_id=${userId}&from=${today}&to=${today}`;

const action = process.argv[3] || ''; // toggle|note
const actionPrefix = action === 'note' ? 'Add note: ' : '';

await apiCall(url, 'GET')
    .then(response => {
        const items = response.time_entries
            .map(element => {
                const notes = `${element.notes ? ' - ' + element.notes : ' '}`;
                const variables = {
                    action: action,
                    taskId: element.id,
                    taskTitle: element.project.name,
                    taskName: element.task.name,
                    taskNotes: element.notes ? element.notes : '',
                    taskClientName: element.client.name,
                    taskHours: element.hours,
                    stopRestart: `${element.is_running ? 'stop' : 'restart'}`,
                    requestMethod: 'PATCH'
                };

                // setup main item
                let item = {
                    title: `${actionPrefix}${element.project.name}`,
                    subtitle: `${element.client.name}, ${element.task.name} (${element.hours} hours${notes})`,
                    variables: {
                        ...variables
                    },
                    icon: {
                        path: `${element.is_running ? 'src/icons/stop.png' : 'src/icons/start.png'}`
                    },
                    mods: {}
                }

                // make sure running timers are on top
                if (element.is_running) item.uid = '0';

                if (action === 'note') {
                    item.icon = {
                        path: `${element.is_running ? 'src/icons/note-active.png' : 'src/icons/note-inactive.png'}`
                    }
                }

                // use alt-key to delete task
                if (action !== 'note') {
                    item.mods.alt = {
                        subtitle: 'Delete this task...',
                        variables: {
                            taskId: element.id,
                            requestMethod: 'DELETE'
                        },
                        icon: {
                            path: 'src/icons/remove.png'
                        }
                    };
                }
                // except for notes. Replace in stead of appending note
                else {
                    item.mods.alt = {
                        subtitle: `Overwrite note...`,
                        variables: {
                            overwriteNote: 'true',
                            ...variables,
                            taskNotes: ''
                        }
                    };
                }

                return item;
            });

        const totalTimeToday = response.time_entries.reduce((acc, entry) => {
            return acc + entry.hours;
        }, 0);

        if (!response.time_entries.length) {
            items.push({
                uid: 123456789,
                title: `No timers yet today. Start one?`,
                subtitle: `Press 'Enter' to select a new timer...`,
                autocomplete: 'hnew',
                valid: true,
                icon: { path: 'src/icons/start-new.png' },
                variables: {
                    goTo: 'newTask'
                }
            });
        }

        // total time today
        items.push({
            title: `Total: ${roundTime(totalTimeToday)}`,
            valid: false,
            icon: { path: 'src/icons/total.png' }
        });

        alfy.output(items);
    })
    .catch(error => {
        alfredError(error, `Failed to list today's timers.`);
    });