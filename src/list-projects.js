import { apiCall } from './utils/helpers';
const alfy = require('alfy');

const url = 'https://api.harvestapp.com/v2/projects';

await apiCall(url, 'GET')
    .then(response => {
        const items = alfy.inputMatches(response.projects, 'name')
            .map(element => ({
                uid: element.id,
                title: `${element.name}, ${element.client.name}`,
                subtitle: 'View available tasks',
                variables: {
                    projectId: element.id
                },
                icon: {
                    path: 'src/icons/add.png'
                }
            }));

        alfy.output(items);
    }).catch(error => {
        const errort = [{
            title: error,
            subtitle: `SUBTITLE`,
            icon: {
                path: alfy.icon.error
            }
        }]
        alfy.output(errort);
        return;
    });
