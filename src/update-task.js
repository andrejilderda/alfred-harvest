import { apiCall } from "./utils/helpers";
import { notify } from "./utils/notifications";

const vars = process.env;
const { action, goTo, taskId, taskNotes, requestMethod, taskHours } = vars;
const stopRestart = vars.stopRestart || "";

let url = `https://api.harvestapp.com/v2/time_entries/${taskId}/${stopRestart}`;

if (action === "note") {
  const prevNote = taskNotes || "";
  const newNote = process.argv[2];
  const bulletRegex = /^(\*|•|-|–)\s?/g;
  const match = newNote.match(bulletRegex);

  // Convert any bullets (dash and en-dashes to '– ' and asterisks and bullets to '• ')
  const bulletChar = !match
    ? ""
    : match[0].trim() === "*" || match[0].trim() === "•"
    ? "• "
    : "– ";

  const newNoteFormatted = process.argv[2].replace(bulletRegex, bulletChar);

  // Format previous notes from new notes.
  const noteFormatted = !prevNote.length
    ? newNoteFormatted // Just use the new note without any concern for the previous (because there is none).
    : bulletChar // Check if a bullet character was used
    ? `${prevNote}\n${newNoteFormatted}` // Bullets get a single line separator \n from the previous note (bullet or otherwise).
    : `${prevNote}\n\n${newNoteFormatted}`; // While all other notes get two separators \n\n from the previous.

  const note = encodeURIComponent(noteFormatted.trim());

  url = `https://api.harvestapp.com/v2/time_entries/${taskId}?notes=${note}`;
}

if (action === "adjust-timer") {
  url = `https://api.harvestapp.com/v2/time_entries/${taskId}?hours=${taskHours}`;
}

// bail when user is 'redirected' to other command
if (!goTo) {
  await apiCall(url, requestMethod)
    .then((response) => {
      if (action === "note") {
        notify("Harvest note updated!", response.notes);
      } else if (action === "adjust-timer") {
        notify("Harvest timer adjusted!", `Hours: ${response.hours}`);
      } else if (stopRestart === "stop") {
        notify(
          "Harvest timer stopped!",
          `${response.project.name}, ${response.task.name}`
        );
      } else if (stopRestart === "restart") {
        notify(
          "Harvest timer started!",
          `${response.project.name}, ${response.task.name}`
        );
      } else {
        notify("Harvest timer updated!");
      }
    })
    .catch((error) => {
      notify(
        "Failed to update task.",
        "Check your network connection and try again."
      );
    });
}
