const alfy = require('alfy');
import * as time from './utils/time';

const vars = process.env;
const { taskId, taskHours, taskName, taskClientName, stopRestart } = vars;

/**
 * returns 'Set timer:'/'Adjust timer:'
 *
 * @param {*} input
 * @returns
 */
const alfredResultAction = (input) => {
    const hasOperator = input.match(/(-|\+)/);
    if (!hasOperator) return 'Set timer:';
    return 'Adjust timer:';
}

let items;

// empty state
if (!alfy.input || time.calculate(alfy.input) === undefined) {
    items = [
        {
            uuid: 'sub5min',
            title: 'Subtract 5 minutes',
            subtitle: `Adjust timer: ${taskHours} → ${time.calculate('-5m', taskHours)}`,
            autocomplete: '-5m',
            valid: false
        },
        {
            uuid: 'sub30min',
            title: 'Subtract 30 minutes',
            subtitle: `Adjust timer: ${taskHours} → ${time.calculate('-30m', taskHours)}`,
            autocomplete: '-30m',
            valid: false
        },
        {
            uuid: 'add5min',
            title: 'Add 5 minutes',
            subtitle: `Adjust timer: ${taskHours} → ${time.calculate('+5m', taskHours)}`,
            autocomplete: '-5m',
            valid: false
        },
        {
            uuid: 'add30min',
            title: 'Add 30 minutes',
            subtitle: `Adjust timer: ${taskHours} → ${time.calculate('+30m', taskHours)}`,
            autocomplete: '+30m',
            valid: false
        },

    ]
}
// has user input
else {
    items = [{
        title: `${alfredResultAction(alfy.input)} ${taskHours} → ${time.calculate(alfy.input, taskHours)}`,
        subtitle: `${taskClientName}, ${taskName}`,
        arg: taskId,
        variables: {
            taskHours: time.calculate(alfy.input, taskHours),
            action: 'adjust-timer',
            requestMethod: 'PATCH'
        },
        icon: {
            path: `${stopRestart === 'stop' ? 'src/icons/note-active.png' : 'src/icons/note-inactive.png'}`
        }
    }];
}

alfy.output(items);