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
    /music
    /sounds
    /backgrounds
    /characters
    /scenes
```

# Getting Started
## Global Config
To load your game files into the engine, add a file called `config.js` to the main folder of this repository, and include the following variables as aproproate for your game
```
var player_name   = "slotha"
var assets_folder = "../example_game_assets" // absolute path or relative to root of the repo
var game_start    = "introduction" // file name of the first scene in the game, or path relative to scenes folder excluding extension
```

## Running the Game
Before you run the game, you first need to start a server. Assuming you have python installed, you can run
```
python -m http.server
```
in the root folder containing both this libary and your game files. you can then access the game (by default) by accessing `localhost:8000/VNgine/index.html` on your browser.


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
- `direction`: either `normal` or `flipped`. determines the direction the sprite is facing

---

## [character?]: [dialog?]
Character speaking a line, both arguments are optional. 
- The speaker does not need to be a character on the screen. 
- Omitting the character argument gives no name to the speaker.  
- Omitting the dialog argument displays the character's name without them speaking. 
- Omitting both (using an empty line with a colon) hides the dialog box and pauses commands until the next input. (useful for showing CGs with no text overlay)

---
## exit [character]
removes the characters image property so they are not displayed on screen. Their data is not removed from the scene.

---
## background [path]
crossfades to a new background. File path relative to `assets/backgrounds/`.

---
## fade [in/out] [time?]
fade in or out to black. `fade out` will fade to black and `fade in` will return to the scene. 
the `time` parameter determines the length of the fade in seconds, and defaults to 0.25

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
## sound [file] [volume=100?] [panning?]
play a sound effect. File path relative to `assets/sounds/`. Volume is a percentage from 0-100. Panning  is a number from `-1` to `1`, with `-1` representing fully left, `1` representing fully right, and `0` is centered.

---
## bgm [file]
fades out current music and starts a new bgm track. File path relative to `assets/music/`. volume is from 0 to 1.

---
## "[text option]" [scene name] [flag?] [amount=1?]
presents an option to the player and determines the scene to load if that option is picked, use many of these in sequence to list dialog options and their corresponding scenes to progress to.
- flag: (string) name of global flag, will be created if it doesn't exist, initializes to 0
- ammount: (float/bool) if given a float, incriments the flag value by that amount, if given a float, sets the flag to match.

---
## flag [flag_name] [value]
changes a flag in the same way as a text option without needing a player choice, useful for setting multiple flags when triggering a scene.
