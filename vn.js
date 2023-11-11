var scene
window.addEventListener("load", () => {
    document.body.addEventListener("keydown", e => {
        if(e.key == "h") {
            if(scene.dialog_box.style.display == "none") {
                scene.dialog_box.style.display = "block"
            } else {
                scene.dialog_box.style.display = "none"
            }
        } 
        if(e.key == " " || e.key == "Enter") {
            scene.next()
        }
    })

    scene = new Scene()
    load_scene("intro")

    requestAnimationFrame(update)
})

function update() {
    if(scene != undefined) scene.draw()
    requestAnimationFrame(update)
}

function load_scene(name) {
    let script = document.createElement("script")
        script.src = `./assets/scenes/${name}.js`

    document.body.appendChild(script)
    script.addEventListener("load", () => {
        // scene = new Scene(SCRIPT)
        scene.actions = scene.parse_script(SCRIPT)
        scene.next()
    })
}

class Scene {
    constructor() {
        this.characters    = {"": {animtime: .5, color: "white"}} // include the protagonist as a character
        this.dialog        = document.querySelector("#text")
        this.dialog_box    = document.querySelector("#dialog")
        this.name          = document.querySelector("#name")
        this.options       = document.querySelector("#options")
        this.overlay       = document.querySelector("#overlay")
        this.target_text   = ""
        this.visible_chars = 0

        this.fade = 1

        this.bgm_audio = new Audio()
        this.bgm_audio.loop = true
    }

    draw() {
        // move characters
        Object.values(this.characters).forEach(data => {
            if(data.hasOwnProperty("image")) {
                data.image.style.left = data.x * 100 + "%"
                data.image.style.top  = data.y * 100 + "%"
                if(data.hasOwnProperty("scale")) {
                    data.image.style.height = data.scale * 100 + "%"
                }
            }
        })

        // update text
        this.visible_chars++
        this.dialog.innerText = this.target_text.substring(0, this.visible_chars)
    }

    parse_script(scene_str) {
        let lines = scene_str.split("\n")
        let actions = []
        lines.forEach(line => {
            line = line.trim()
            if(line != "") {
                let args, command
                if(line.startsWith('"')) {
                    args = [line]
                    command = "option"

                } else if(line.startsWith(">")) {
                    args = [line.replace("> ", "")]
                    command = "extend" // extend existing dialog

                } else {
                    args    = line.split(" ")
                    command = args.shift()
                }
                actions.push({ command, args })
            }
        })

        return actions
    }

    next() {
        while (!this.next_command()) {}
    }

    next_command() {
        // runs commands, and returns if the execution should stop
        let action = this.actions.shift()
        if(action == undefined) return true

        if(typeof this[action.command] == "function") {
            // if its a defined action
            return this[action.command](...action.args) || false
        } else {
            // if its a character name
            return this.character(action.command, action.args)
        }
    }

    option(args) {
        let regex   = /(\".+\") (.+)/
        let groups  = regex.exec(args)
        let message = groups[1]
        let scene   = groups[2]

        // create option element
        let option = document.createElement("div")
            option.className = "dialog-option"
            option.innerText = message

        option.addEventListener("click", () => {
            this.scene(scene)
        })

        this.options.appendChild(option)
    }

    character(name, args) {
        if(name.endsWith(":")) {
            // character is speaking
            name = name.replace(":","")
            let dialog = args.join(" ")

            this.name.innerText = name

            if(this.characters.hasOwnProperty(name)) {
                this.name.style.color = this.characters[name].color
            }

            this.target_text = dialog
            this.visible_chars = 0

            return true // stop executing commands and wait for input

        } else {
            // changing character data
            let property = args.shift()
            args = args.join(" ")

            if(!this.characters.hasOwnProperty(name)) {
                this.characters[name] = {x: .5, y: 0, color: "white", scale: 1}

                // preload images?
            }


            if(property == "image") {
                this.remove_character_img(name)

                let img = new Image()
                img.src = `./assets/characters/${name}/${args}`
                args = img
                img.className = "character-img"

                document.body.appendChild(img)
            }

            if(/\d+(\.\d+)?/.test(args) && property != "animtime") {
                // of the data is a number
                if(this.characters[name].hasOwnProperty(property)) {
                    args = new AnimatedValue(
                        this.characters[name][property],
                        args, this.characters[name].animtime || .5
                    )
                }
            }

            this.characters[name][property] = args

            return false // don't stop executing
        }
    }

    extend(dialog) {
        this.visible_chars = this.target_text.length
        this.target_text += "\n\n" + dialog
        return true
    }

    remove_character_img(character) {
        if(this.characters[character].hasOwnProperty("image")) {
            // remove old image
            document.body.removeChild(this.characters[character].image)
            delete this.characters[character].image
        }
    }

    // Actions 
    background(image) {
        this.cross_fade_bg(image)
        return true
    }

    scene(name) {
        this.options.innerHTML = ""
        load_scene(name)
    }

    exit(character) {
        this.remove_character_img(character)
    }

    dialogbox(position) {
        let dbox  = this.dialog_box.style
        let opbox = this.options.style

        dbox.display = "unset"
        // inset: top right bottom left

        switch(position) {
            case "default":
            case "bottom":
            case "normal":
                opbox.width = "100%"
                opbox.inset = "50% 0 auto auto"

                dbox.width  = "100%"
                dbox.height = "22vh"
                dbox.inset  = "auto auto 0 0"
                break

            case "low":
                opbox.width = "100%"
                opbox.inset = "50% 0 unset unset"

                dbox.width   = "100%"
                dbox.height  = "8vh"
                dbox.inset   = "auto auto 0 0"
                dbox.display = "flex"
                break

            case "hidden":
                dbox.display = "none"
                break

            case "right":
                opbox.width = "63%"
                opbox.inset = "50% 0 unset unset"

                dbox.width  = "37%"
                dbox.height = "100vh"
                dbox.inset   = "0 63%"
                break

            case "left":
                opbox.width = "63%"
                opbox.inset = "50% 37%"

                dbox.width  = "37%"
                dbox.height = "100vh"
                dbox.inset   = "0"
                break

            case "bottomleft":
                opbox.width = "100%"
                opbox.inset = "50% 0 unset unset"

                dbox.width  = "37%"
                dbox.height = "22vh"
                dbox.inset   = "auto auto 0 0"
                break

            case "bottomright":
                opbox.width = "100%"
                opbox.inset = "50% 0 unset unset"

                dbox.width  = "37%"
                dbox.height = "22vh"
                dbox.inset   = "auto 0 0 auto"
                break

            case "center":
            case "large":
                dbox.width  = "100%"
                dbox.height = "80vh"
                dbox.inset  = "10% 0"
                break
        }
    }

    sound(file) {
        let sound = new Audio("./assets/audio/sounds/" + file)
            sound.play()
    }

    bgm(file) {
        this.cross_fade_bgm(file)
    }

    cross_fade_bgm(new_song, time=4) {
        if(this.bgm_audio.src != "") {
            new Fade(time, perc => {
                    // fade out current track
                    this.bgm_audio.volume = 1 - perc
                }, () => {
                    // then start new track
                    setTimeout(() => {
                        this.play_track(new_song)
                        this.bgm_audio.volume = 1
                    }, 500)
                }
            )
        } else {
            this.play_track(new_song)
        }
    }

    play_track(name) {
        if(name == "none" || name == "stop") this.bgm_audio.pause()
        this.bgm_audio.src = "./assets/audio/music/" + name
        this.bgm_audio.currentTime = 0
        this.bgm_audio.play()
    }

    // other
    cross_fade_bg(new_bg, time=1) {
        if(document.body.style.backgroundImage != "") {
            new Fade(time/2, perc => {
                    // fade out current scene
                    scene.overlay.style.opacity = 100 * perc + "%"
                }, () => {
                    // switch to and fade in new scene
                    document.body.style.backgroundImage = `url("./assets/backgrounds/${new_bg}")`
                    scene.next()
                    new Fade(time/2, perc => {
                        scene.overlay.style.opacity = 100 * (1 - perc) + "%"
                    })
                }
            )
        } else {
            // first background, just fade in
            document.body.style.backgroundImage = `url("./assets/backgrounds/${new_bg}")`
            new Fade(time/2, perc => {
                scene.overlay.style.opacity = 100 * (1 - perc) + "%"
            })
        }
    }
}

const lerp = (a, b, p) => (b-a)*p + a

class Fade {
    constructor(seconds, func, onend=()=>{}, interval=24) {
        this.func = func
        this.onend = onend
        this.count = 0
        this.max_count = interval * seconds
        this.interval = 1000 / interval
        setTimeout(() => {this.update()}, this.interval)
    }

    update() {
        this.count++
        this.func(this.count / this.max_count)
        if(this.count < this.max_count) {
            setTimeout(() => {this.update()}, this.interval)
        } else {
            this.onend()
        }
    }
}
