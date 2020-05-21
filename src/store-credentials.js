import { notify } from './utils/notifications';
import { apiCall, execute } from './utils/helpers';
const alfy = require('alfy');

const token = process.env.token;
const accountId = process.env.account_id;

// store the Harvest account id (6 digits)
alfy.config.set('accountId', accountId);

// delete previous API token the user might have saved before
execute(`security delete-generic-password -a 'apitoken' -s 'com.andrejilderda.harvest'`);

execute(`security add-generic-password -a 'apitoken' -s 'com.andrejilderda.harvest' -w '${token}'`)
    .then(async (token) => {
        // store user id
        await apiCall('https://api.harvestapp.com/v2/users/me', 'GET')
            .then((user) => alfy.config.set('userId', user.id));

        notify(
            'All setup!',
            'Type ‘hvn’ to list projects and start a new timer.'
        );
    }).catch(error => {
        // show notice when there's already a key stored in the keychain
        // (highly unlikely since we delete previous entries)
        if (error.message.match(/already exists/)) {
            notify('Remove the previously saved Harvest API token from the Keychain and try again.');
            return;
        }
        notify(error.message);
    });