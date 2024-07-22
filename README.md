# VNgine
Create visual novels easily by just writing a script and importing assets. An example script is shown below:

```
background park.png
bob image waving.png
alice image neutral.png

bob x .33
alice x .66

bob: hello, how are you today?
alice: i'm fine thank you 

scene next_scene
```


## general game controls
- press any key to progress
- press `h` to hide/unhide the dialog box
<br />
<br />
<br />

# Folder structure
```
/assets
    /audio
        /music
        /sounds
    /backgrounds
    /characters
    /scenes
```

# Commands
you can use the keyword `<name>` in any command to substitute it for the player's chosen name.

---
## [character] [property] [value]
sets a property of the character's data. adds the character to the scene if they're not there already. supported properties include:
- `image`: filepath starting from `assets/characters` 
- `x`: float (percentage of screen width) default = 0.5
- `y`: float (percentage of screen height) default = 1
- `scale`: float (default = 1)
- `color`: CSS Color string, color of the characters name in the dialog box
- `animtime`: number of seconds to complete an animation (such as moving to a new position)

---

## [character?]: [dialog?]
Character speaking a line. both arguments are optional. a blank string `: [dialog]` gives no name to the speaker. The speaker does not need to be a character on the screen. you can also use just a colon `:` to set a break with no text that stops running commands and waits for input. You can also use `[character]:` to just display the character's name without them speaking

---
## exit [character]
removes the characters image property so they are not on screen anymore. their data remains in the scene in case they reappear.

---
## background [path]
crossfades to a new background. filepath starts from the `assets/backgrounds/` folder

---
## scene [file]
loads a new scene. filepath starts from the `assets/scenes/` folder. omit the file extension

---
## dialogbox [position]
sets the dialog box position, supported values are:
- `default`, `bottom` or `normal`
- `low`
- `hidden`
- `left`
- `right`
- `bottomleft`
- `bottomright`
- `center` or `large`

---
## sound [file]
play a sound effect, filepath starts from the `assets/audio/sounds/` folder

---
## bgm [file]
fades out current music and starts a new bgm track, filepath starts from `assets/audio/music/`

---
## "[text option]" [scene name]
presents an option to the player and determines the scene to load if that option is picked, use many of these in sequence to list dialog options and their corresponding scenes to progress to.
