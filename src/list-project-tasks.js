const alfy = require('alfy');

const vars = process.env;
const { projectId } = vars;

const url = `https://api.harvestapp.com/v2/projects/${projectId}/task_assignments`;
let response = await alfy.fetch(url, {
    headers: {
        'Authorization': 'Bearer 1433922.pt.ryRJ-cf9mBB2WiPr8lJHLc8ONBsw848sTWQlfL6lmFLaUrBBjOYiQsyKZgIsgaXMF0osiwlYoyEqAyedsXKrmQ',
        'Harvest-Account-ID': '853466'
    }
});

const items = alfy
    .inputMatches(response.task_assignments, 'task.name')
    .map(element => ({
        uid: element.id,
        title: element.task.name,
        subtitle: 'Start this task',
        arg: element.task.id,
        variables: {
            taskId: element.task.id
        },
        icon: {
            path: 'src/icons/go.png'
        }
    }));

alfy.output(items);