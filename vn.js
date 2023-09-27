var canv, c, scene
window.addEventListener("load", () => {
    canv = document.querySelector("canvas")
    c    = canv.getContext("2d")

    resize()
    window.addEventListener("resize", resize)
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

function resize() {
    canv.width  = window.innerWidth
    canv.height = window.innerHeight
}

function load_scene(name) {
    let script = document.createElement("script")
        script.src = `./scenes/${name}.js`

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
        this.target_text   = ""
        this.visible_chars = 0

        this.bgm_audio = new Audio()
        this.bgm_audio.loop = true
    }

    draw() {
        c.clearRect(0, 0, canv.width, canv.height)

        // move characters
        Object.values(this.characters).forEach(data => {
            if(data.hasOwnProperty("image")) {
                data.image.style.left = data.x * 100 + "%"
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
                if(!line.startsWith('"')) {
                    args    = line.split(" ")
                    command = args.shift()
                } else {
                    args = [line]
                    command = "option"
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
            this[action.command](...action.args)
            return false
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
                this.characters[name] = {x: .5, y: 1, color: "white"}

                // preload images?
            }


            if(property == "image") {
                this.remove_character_img(name)

                let img = new Image()
                img.src = `./characters/${name}/${args}`
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

    remove_character_img(character) {
        if(this.characters[character].hasOwnProperty("image")) {
            // remove old image
            document.body.removeChild(this.characters[character].image)
            delete this.characters[character].image
        }
    }

    // Actions 
    background(image) {
        document.body.style.backgroundImage = `url("./backgrounds/${image}")`
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
                opbox.width = "100%"
                opbox.inset = "50% 0 unset unset"

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

            case "left":
                opbox.width = "63%"
                opbox.inset = "50% 0 unset unset"

                dbox.width  = "37%"
                dbox.height = "100vh"
                dbox.inset   = "0 63%"
                break

            case "right":
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
                dbox.width  = "100%"
                dbox.height = "80vh"
                dbox.inset  = "10% 0"
                break
        }
    }

    sound(file) {
        let sound = new Audio("./audio/sounds/" + file)
            sound.play()
    }

    bgm(file) {
        if(file == "stop" || file == "none") {
            this.bgm_audio.pause()
        }
        // TODO: perform crossfade
        this.bgm_audio.src = "./audio/music/" + file
        this.bgm_audio.currentTime = 0
        this.bgm_audio.play()
    }
}

const lerp = (a, b, p) => (b-a)*p + a


class CrossFade {
    constructor(target, start, stop, time) {
        this.target = target
        this.start  = start
        this.stop   = stop
        this.time   = time

        this.interval = 1/20
        this.progress = 0
        this.intervals = time * this.interval
        this.interval_ms = this.interval

        setTimeout(this.update, this.interval_ms, target, this)
    }
    update(target, self) {
        self.progress += self.interval
        target(lerp(self.start, self.stop, self.progress / self.intervals))

        if(self.progress <= self.intervals) {
            setTimeout(self.update, self.interval_ms, self)
        }
    }   
}
