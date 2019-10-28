import { apiCall } from './utils/helpers';
import { getToday } from './utils/time';
const alfy = require('alfy');

const today = getToday();

const url = `https://api.harvestapp.com/v2/time_entries?from=${today}&to=${today}`

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

                return ({
                    uid: element.id,
                    title: `${actionPrefix}${element.project.name}`,
                    subtitle: `${element.client.name}, ${element.task.name} (${element.hours} hours${notes})`,
                    variables: {
                        ...variables
                    },
                    icon: {
                        path: `${element.is_running ? 'src/icons/stop.png' : 'src/icons/go.png'}`
                    },
                    mods: {
                        alt: {
                            subtitle: 'Delete this task...',
                            variables: {
                                taskId: element.id,
                                requestMethod: 'DELETE'
                            }
                        }
                    }
                })
            }
            );

        const totalTimeToday = response.time_entries.reduce((acc, entry) => {
            return acc + entry.hours;
        }, 0);

        items.push({
            uid: 123456789,
            title: `Total: ${totalTimeToday}`,
            subtitle: '',
            valid: false,
            icon: { path: 'src/icons/add.png' }
        });

        alfy.output(items);
    });