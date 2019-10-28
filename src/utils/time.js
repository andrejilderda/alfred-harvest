/**
 * converts time in min/hour notation to decimal values
 *
 * @param {string} input, i.e. '1h30m'
 * @returns {float} time in decimal value, ie. 1.5
 */
export const convertMinHourToDecimal = input => {
    const regexMatches = input.toLowerCase().match(timeArithmetic);
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
* get today
* @returns {string} today's date in format '2019-10-20'
*/
export const getToday = () => {
    const d = new Date();
    const today = `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${("0" + d.getDate()).slice(-2)}`;
    return today;
}