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


## General Game Controls
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
- you can use the keyword `<name>` in any command to substitute it for the player's chosen name.
- you can add comments with "`//`".

---
## [character] [property] [value]
sets a property of the character's data. adds the character to the scene if they're not there. supported properties are:
- `image`: file path relative to `assets/characters` 
- `x`: float (percentage of screen width) default = 0.5
- `y`: float (percentage of screen height) default = 1
- `scale`: float (default = 1)
- `color`: CSS Color string, color of the characters name in the dialog box
- `animtime`: number of seconds to complete an animation (such as moving to a new position)

---

## [character?]: [dialog?]
Character speaking a line, both arguments are optional. 
- The speaker does not need to be a character on the screen. 
- Omitting the character argument gives no name to the speaker.  
- Omitting the dialog argument displays the character's name without them speaking. 
- Omitting both (using an empty line with a colon) sets a break with no text that pauses commands until the player clicks.

---
## exit [character]
removes the characters image property so they are not displayed on screen. Their data is not removed from the scene.

---
## background [path]
crossfades to a new background. File path relative to `assets/backgrounds/`.

---
## scene [file]
loads a new scene. File name relative to `assets/scenes/` folder, **not including file extension**.

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
play a sound effect. File path relative to `assets/audio/sounds/`.

---
## bgm [file]
fades out current music and starts a new bgm track. File path relative to `assets/audio/music/`.

---
## "[text option]" [scene name] [flag?] [amount=1?]
presents an option to the player and determines the scene to load if that option is picked, use many of these in sequence to list dialog options and their corresponding scenes to progress to.
- flag: (string) name of global flag, will be created if it doesn't exist, initializes to 0
- ammount: (float/bool) if given a float, incriments the flag value by that amount, if given a float, sets the flag to match.

---
## flag [flag_name] [value]
changes a flag in the same way as a text option without needing a player choice, useful for setting multiple flags when triggering a scene.
