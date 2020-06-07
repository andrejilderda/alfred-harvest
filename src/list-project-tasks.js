import { alfredError } from './utils/errors';
const alfy = require('alfy');

const vars = process.env;
const { task_assignments } = vars;

try {
    const items = alfy
        .inputMatches(JSON.parse(task_assignments), 'task.name')
        .filter(element => element.is_active)
        .map(element => ({
            uid: element.id,
            title: element.task.name,
            subtitle: 'Start this task',
            variables: {
                taskId: element.task.id,
                taskName: element.task.name
            },
            icon: {
                path: 'src/icons/start.png'
            }
        }));

    alfy.output(items);
} catch (error) {
    alfredError(error, 'Failed to list project tasks.');
}