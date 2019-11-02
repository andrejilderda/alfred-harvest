import { alfredError } from './utils/errors';
import { apiCall } from './utils/helpers';
const alfy = require('alfy');

const vars = process.env;
const { projectId } = vars;

const url = `https://api.harvestapp.com/v2/projects/${projectId}/task_assignments`;

await apiCall(url, 'GET')
    .then(response => {
        const items = alfy
            .inputMatches(response.task_assignments, 'task.name')
            .map(element => ({
                uid: element.id,
                title: element.task.name,
                subtitle: 'Start this task',
                variables: {
                    taskId: element.task.id,
                    taskName: element.task.name
                },
                icon: {
                    path: 'src/icons/go.png'
                }
            }));

        alfy.output(items);
    })
    .catch(error => {
        alfredError(error, 'Failed to list project tasks.');
    });