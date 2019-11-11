export const notify = (...message) => {
    // will be split by Alfred's var splitter and send to notification output
    console.log(message.join(';'));
}