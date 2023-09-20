## general game controls
- press any key to progress
- press `h` to hide/unhide the dialog box

---
## [character] [property] [value]
sets a property of the characteres data. adds the character to the scene if they're not there already. supported properties include:
- `image`: filepath starting from that `characters/` directory
- `x`: float (percentage of screen width) default = 0.5
- `y`: float (percentage of screen height) default = 1
- `color`: CSS Color string, color of the characters name in the dialog box
- `animspeed`: number of seconds to complete animations (such as moving to a new position)

---

## [character?]: [dialog?]
Character speaking a line. both arguments are optional. a blank string `: [dialog]` gives no name to the speaker. The speaker does not need to be a character on the screen. you can also use just a colon `:` to set a break with no text that stops running commands and waits for input. You can also use `[character]:` to not say anything

---
## exit [character]
removes the characters image property so they are not on screen anymore. they remain in the scene to keep any other properties you've set in case they reappear in the same scene.

---
## background [path]
crossfades to a new background. filepath starts from the `backgrounds/` folded

---
## scene [file]
loads into a new scene. filepath start from the `scenes/` folder, omit the file extension
