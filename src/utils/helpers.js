const util = require('util');
const exec = util.promisify(require('child_process').exec);
const alfy = require('alfy');

export const execute = async (command) => {
    const { stdout } = await exec(command);
    return stdout;
};

/**
 * call the Harvest API and returns a promise with the result
 *
 * @param {string} url
 * @param {string} method HTTP request method
 * @returns {promise}
 */
export const apiCall = async (url, method) => {
    // Get the Harvest account id (6 digits) that was stored
    const accountId = alfy.config.get('accountId');

    if (!accountId) throw new Error('Missing account id. Have you setup correctly?');

    const fetchApi = async (token) => {
        return alfy.fetch(url, {
            method: method,
            headers: {
                'Authorization': 'Bearer ' + token.replace(/\r?\n|\r/g, ''),
                'Harvest-Account-ID': accountId
            }
        });
    }

    // gets the Harvest API token from Apple's keychain
    const getToken = async (accountId) => {
        return execute(`security find-generic-password -a 'apitoken' -s 'com.andrejilderda.harvest' -w`);
    }

    return getToken(accountId)
        .then(token => {
            return fetchApi(token)
                .then(result => {
                    return result;
                });
        })
        .catch(error => {
            throw new Error(error);
        });
}

// pretty print JSON
export const prettyJSON = (json) => JSON.stringify(json, null, '\t');