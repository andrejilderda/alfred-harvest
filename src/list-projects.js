import { alfredError } from './utils/errors';
import { apiCall } from './utils/helpers';
const alfy = require('alfy');


const url = 'https://api.harvestapp.com/v2/users/me/project_assignments';

await apiCall(url, 'GET')
    .then(response => {
        const items = alfy.inputMatches(response.project_assignments, 'project.name')
            .filter(element => element.is_active)
            .map(element => ({
                uid: element.project.id,
                title: `${element.project.name}, ${element.client.name}`,
                subtitle: 'View available tasks',
                variables: {
                    projectId: element.project.id,
                    projectName: element.project.name
                },
                icon: {
                    path: 'src/icons/start-new.png'
                }
            }));

        alfy.output(items);

    })
    .catch(error => {
        alfredError(error, 'Failed to list projects.');
    });
