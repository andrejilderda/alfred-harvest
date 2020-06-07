import { alfredError } from './utils/errors';
import { apiCall } from './utils/helpers';
const alfy = require('alfy');

const url = 'https://api.harvestapp.com/v2/users/me/project_assignments?';

const formatOutput = element => ({
    uid: element.project.id,
    title: `${element.project.name}, ${element.client.name}`,
    subtitle: 'View available tasks',
    variables: {
        projectId: element.project.id,
        projectName: element.project.name,
        task_assignments: JSON.stringify(element.task_assignments)
    },
    icon: {
        path: 'src/icons/start-new.png'
    }
});

await apiCall(url, 'GET')
    .then(response => {
        if (response.total_pages === 1) {
            const items = alfy.inputMatches(response.project_assignments, 'project.name')
                .filter(element => element.is_active)
                .map(formatOutput);

            alfy.output(items);
        }
        // if user has over 100 projects, retrieve all pages and wait for
        // promises to be resolved
        else {
            const pageRequests = [];
            for (let i = response.page + 1; i <= response.total_pages; i++) {
                pageRequests.push(apiCall(`${url}&page=${i}`))
            }

            Promise.all(pageRequests).then(pages => {
                const projectAssignments = pages
                    .reduce((acc, page) => {
                        return [...acc, ...page.project_assignments]
                    }, [])
                    .filter(element => element.is_active)
                    .map(formatOutput);

                alfy.output(projectAssignments);
            })
        }
    })
    .catch(error => {
        alfredError(error, 'Failed to list projects.');
    });
