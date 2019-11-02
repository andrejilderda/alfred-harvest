const alfy = require('alfy');

export const alfredError = (error, title) => {
    let errorTitle = title;
    let errorSubtitle;

    if (error.message.includes('Unauthorized')) {
        errorTitle = 'Invalid Harvest credentials.'
        errorSubtitle = 'Setup your Harvest credentials and try again (press ⌘L to see error)';
    }

    if (error.message.includes('RequestError: getaddrinfo ENOTFOUND')) {
        errorSubtitle = 'Check your network connection and try again.';
    }

    const errorMessage = [{
        title: errorTitle,
        subtitle: errorSubtitle,
        icon: {
            path: alfy.icon.error
        },
        variables: {
            goTo: 'setup'
        },
        text: {
            largetype: error.message
        },
        valid: true
    }]
    alfy.output(errorMessage);
    return;
}