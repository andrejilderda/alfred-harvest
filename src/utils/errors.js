const alfy = require('alfy');

export const alfredError = (error, title) => {
    let errorTitle = title;
    let errorSubtitle;
    let goTo;

    if (error.message.includes('Unauthorized')) {
        errorTitle = 'Invalid Harvest credentials.'
        errorSubtitle = `Press 'enter' to setup your Harvest credentials and try again (press ⌘L to see complete error)`;
        goTo = 'setup';
    }

    else if (error.message.includes('could not be found in the keychain')) {
        errorTitle = 'API token could not be found in keychain';
        errorSubtitle = `Press 'enter' to setup your Harvest credentials and try again (press ⌘L to see complete error)`;
        goTo = 'setup';
    }

    else if (error.message.includes('RequestError: getaddrinfo ENOTFOUND')) {
        errorSubtitle = 'Check your network connection and try again.';
    }


    const errorMessage = [{
        title: errorTitle,
        subtitle: errorSubtitle,
        icon: {
            path: alfy.icon.error
        },
        variables: {
            goTo: `${goTo || ''}`
        },
        text: {
            largetype: error.message
        },
        valid: true
    }]
    alfy.output(errorMessage);
    return;
}