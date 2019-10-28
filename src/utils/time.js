// match input in minutes/hours format, including operator.
// I.e. '1h5m', '-5h', '4m', etc.. See: https://regex101.com/r/G8Ib2V/4
// returns an array of time matches, i.e. ['3h', '-3m']
export const minHourRegex = /((\+|-)?[0-9]+(h|m))/igm;

/**
 * converts time in min/hour notation to decimal values
 *
 * @param {string} input, i.e. '1h30m'
 * @returns {float} time in decimal value, ie. 1.5
 */
export const convertMinHourToDecimal = input => {
    const regexMatches = input.toLowerCase().match(minHourRegex);
    const isNegative = input.indexOf('-') !== -1;
    let result;

    // loop over the seperate time values and add them,
    // i.e. 1h30m › ['1h', '30m'] = 1.5
    result = regexMatches.reduce((acc, timeValue) => {
        const digits = timeValue.match(/[0-9]+/);

        // convert minutes to decimal value, i.e. 30 = 0.5.
        // For hours no conversion is necessary
        const isMinutes = timeValue.includes('m');
        const decimalTime = isMinutes ? digits / 60 : digits;

        return acc + parseFloat(decimalTime);
    }, 0);

    if (isNegative) return result * -1;
    return result;
};

/**
 * calculcate the new time value based on the user's input
 *
 * @param {string} input, input in Alfred's field i.e. '+1h30m'
 * @param {string} input, i.e. '+1h30m'
 * @returns {float} calculated time, i.e. 7.30 (with '+1h30m' as input when timer was set to 6 previously)
 */
export const calculate = (input, taskHours) => {
     // current task's time
    const taskTime = parseFloat(taskHours);
    // check if the user input is either in min/hour notation or simply a (floating) number, i.e. 0.2
    const minHourFormat = input ? minHourRegex.test(input.toLowerCase()) : '';
    const isNumber = input => !isNaN(input);
    const isValid = minHourFormat || isNumber(input);
    if (!isValid) return; // bail if input is not valid

    // returns a boolean indicating the input contains a +|-
    const hasOperator = !!input.match(/^(-|\+)/);

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
* get today in a format Harvest accepts
* @returns {string} today's date in format '2019-10-20'
*/
export const getToday = () => {
    const d = new Date();
    const today = `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${("0" + d.getDate()).slice(-2)}`;
    return today;
}

/**
 * round (time) value to 2 digits
 */
export const roundTime = input => Math.round(input * 100) / 100;