## Control your [Harvest](https://www.getharvest.com/) timers directly from [Alfred](https://www.alfredapp.com/).

- Start, stop and adjust timers
- Delete timers
- Add/append notes
- API token is stored securely in Keychain (no password used for authenticating)
- Uses the latest Harvest API (v2)

## Installation & Setup

1. Ensure that you have [node.js](https://nodejs.org/en/) installed. You can check by running `node -v` in the Terminal.
2. Download the latest version of the workflow from the [Releases](https://github.com/andrejilderda/alfred-harvest/releases) page.
3. Open https://id.getharvest.com/developers and click on 'Create New Personal Access Token'.
4. Give the token a name, such as 'Alfred workflow', and generate it.
5. Copy the generated Account ID.
6. Open the workflow's configuration and paste the Account ID. Save the configuration.
7. Type `hvs` in Alfred and press <kbd>enter</kbd>.
8. Paste the API token and press <kbd>enter</kbd>.
9. Type `hvn` in Alfred to start your first timer.

Note: Make sure you have the [Alfred Powerpack](https://www.alfredapp.com/powerpack/) installed to use workflows.

\*The first time you run the workflow you may be prompted to grant access to the API token (which is stored in your Keychain).

_Note: In order to install workflows you need the [Alfred Powerpack](https://www.alfredapp.com/powerpack/)._

## How to use

### Start a new timer

![Start a new timer](https://user-images.githubusercontent.com/487182/68616415-48858600-04c5-11ea-921c-38d3b8d0217b.gif)

- Type <kbd>hvn</kbd> to list the available projects,
- Select a project and press <kbd>enter</kbd>,
- Select the task and press <kbd>enter</kbd>

### Toggle timer

![Toggle timer](https://user-images.githubusercontent.com/487182/68616434-4f13fd80-04c5-11ea-8379-77b7ba7919e0.gif)

- Type `hvt` to list today's timers.
- Press <kbd>enter</kbd> to stop/restart the selected task.

**Tip:** Hold <kbd>alt</kbd> to delete the selected task.

### Adjust timer

![Adjust timer](https://user-images.githubusercontent.com/487182/68617779-3bb66180-04c8-11ea-8ea8-2b35ebe934ad.gif)

- Type `hva` to list today's timers,
- Select a timer by pressing <kbd>enter</kbd>,
- Type a new time for the task in digit (`2.5`) or time (`2h30m`) format.

**Tip:** Add a `+`/`-` in front of your timer to add or subtract time, i.e. `-30m` will subtract 30 minutes from your timer.

### Add notes

![Add note](https://user-images.githubusercontent.com/487182/68617778-3bb66180-04c8-11ea-9951-ee7d23e10fdc.gif)

- Type `hvnt` to list today's timers,
- Select a timer by pressing <kbd>enter</kbd>,

**Tip:** Your newly typed note will be appended by default. If you want to overwrite the note, hold down the <kbd>alt</kbd>-key when selecting a task from the list.

## Credits & thank you’s

This workflow was inspired by Neil Renicker’s [Harvest workflow](https://github.com/tinystride/alfred-harvest) which I've used for years (but stopped working for me).

All icons (except the Harvest logo) are from Daniel Bruce’s [Entypo](http://www.entypo.com/)-pack, and are distributed under the [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)-license.
