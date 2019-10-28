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

execute(`security add-generic-password -a '${accountId}' -s 'com.andrejilderda.harvest' -w '${token}'`)
    .then(token => {
        console.log(successMessage);
    }).catch(error => {
        // if the key already exists in keychain, we're all good
        if (error.message.match(/already exists/)) console.log(successMessage);
        console.log(error.message);
    });