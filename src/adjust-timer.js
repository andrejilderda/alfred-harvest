const alfy = require('alfy');
import { convertMinHourToDecimal } from './utils/helpers';

const vars = process.env;
const { taskId, taskHours, taskName, taskClientName, stopRestart } = vars;

// match input in minutes/hours format, including operator.
// I.e. '1h5m', '-5h', '4m', etc.. See: https://regex101.com/r/G8Ib2V/4
// returns an array of time matches, i.e. ['3h', '-3m']
const timeArithmetic = /((\+|-)?[0-9]+(h|m))/igm;

/**
 * round (time) value to 2 digits
 */
const roundTime = input => Math.round(input * 100) / 100;


/**
 * calculcate the new time value based on the user's input
 *
 * @param {string} input, i.e. '+1h30m'
 * @returns {float} calculated time, i.e. 7.30 (with '+1h30m' as input when timer was set to 6 previously)
 */
const newTime = input => {
    const minHourFormat = input ? timeArithmetic.test(input.toLowerCase()) : '';
    // or is the user input simply (floating) number, i.e. 0.2
    const isNumber = input => !isNaN(input);
    const isValid = minHourFormat || isNumber(input);
    // bail if input is not a number nor a time in valid min/hour notation
    if (!isValid) return;

    // returns true/false if the input contains a +|-
    const hasOperator = !!input.match(/(-|\+)/);
    const taskTime = parseFloat(taskHours); // current task's time
    let output;

    // min hour notation (1h30)
    if (minHourFormat) {
        const decimalTime = convertMinHourToDecimal(input);
        if (hasOperator) output = taskTime + decimalTime; // i.e. +1h30m / -1h30m
        else output = decimalTime; // i.e. 1h30m
    }
    // decimal notation (1.5)
    else {
        const floatInput = parseFloat(input);
        if (hasOperator) output = taskTime + floatInput; // i.e. +1.5 / -1.5
        else output = floatInput; // i.e. 1.5
    }
    return output > 0 ? roundTime(output) : 0;
}

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
if (!alfy.input) {
    items = [
        {
            uuid: 'sub5min',
            title: 'Subtract 5 minutes',
            subtitle: `Adjust timer: ${taskHours} → ${newTime('-5m')}`,
            autocomplete: '-5m',
            valid: false
        },
        {
            uuid: 'sub30min',
            title: 'Subtract 30 minutes',
            subtitle: `Adjust timer: ${taskHours} → ${newTime('-30m')}`,
            autocomplete: '-30m',
            valid: false
        },
        {
            uuid: 'add5min',
            title: 'Add 5 minutes',
            subtitle: `Adjust timer: ${taskHours} → ${newTime('+5m')}`,
            autocomplete: '-5m',
            valid: false
        },
        {
            uuid: 'add30min',
            title: 'Add 30 minutes',
            subtitle: `Adjust timer: ${taskHours} → ${newTime('+30m')}`,
            autocomplete: '+30m',
            valid: false
        },

    ]
}
// has user input
else {
    items = [{
        title: `${alfredResultAction(alfy.input)} ${taskHours} → ${newTime(alfy.input)}`,
        subtitle: `${taskClientName}, ${taskName}`,
        arg: taskId,
        variables: {
            taskHours: newTime(alfy.input),
            action: 'adjust-timer',
            requestMethod: 'PATCH'
        },
        icon: {
            path: `${stopRestart === 'stop' ? 'src/icons/note-active.png' : 'src/icons/note-inactive.png'}`
        }
    }];
}

alfy.output(items);