const util = require('util');
const exec = util.promisify(require('child_process').exec);
const alfy = require('alfy');

const token = process.env.token;
const accountId = process.env.account_id;

// store the Harvest account id (6 digits)
alfy.config.set('accountId', accountId);

const execute = async (command) => {
    const { stdout, stderr } = await exec(command);
    return stdout;
};

const successMessage = 'All set!';

// delete previous API token the user might have saved before
execute(`security delete-generic-password -a 'apitoken' -s 'com.andrejilderda.harvest'`);

execute(`security add-generic-password -a 'apitoken' -s 'com.andrejilderda.harvest' -w '${token}'`)
    .then(token => {
        console.log(successMessage);
    }).catch(error => {
    });