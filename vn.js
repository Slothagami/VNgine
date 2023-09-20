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

    load_scene("1")

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
        scene = new Scene(SCRIPT)
    })
}

class Scene {
    constructor(script) {
        this.actions       = this.parse_script(script)
        this.characters    = {"": {animspeed: .5, color: "white"}} // include the protagonist as a character
        this.dialog        = document.querySelector("#text")
        this.dialog_box    = document.querySelector("#dialog")
        this.name          = document.querySelector("#name")
        this.target_text   = ""
        this.visible_chars = 0

        this.next()
    }

    draw() {
        c.clearRect(0, 0, canv.width, canv.height)

        // draw characters
        Object.values(this.characters).forEach(data => {
            if(data.hasOwnProperty("image")) {
                // scale so the height of the image matches the window
                let scale = data.image.height / canv.height
                c.drawImage(
                    data.image, 
                    canv.width  * data.x - (data.image.width/scale) /2, 
                    canv.height * data.y - canv.height,

                    data.image.width / scale,
                    data.image.height / scale
                )
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
            if(line != "") {
                let args = line.trim().split(" ")
                let command = args.shift()
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

        // if its an established action
        if(typeof this[action.command] == "function") {
            this[action.command](...action.args)
            return false
        } else {
            // if its a character name
            return this.character(action.command, action.args)
        }
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
            this.characters[name] ??= {x: .5, y: 1, color: "white"}

            if(property == "image") {
                let img = new Image()
                img.src = `./characters/${name}/${args}`
                args = img
            }

            if(/\d+(\.\d+)?/.test(args) && property != "animspeed") {
                // of the data is a number
                if(this.characters[name].hasOwnProperty(property)) {
                    args = new AnimatedValue(
                        this.characters[name][property],
                        args, this.characters[name].animspeed || .5
                    )
                }
            }

            this.characters[name][property] = args

            return false // don't stop executing
        }
    }

    // Actions 
    background(image) {
        document.body.style.backgroundImage = `url("./backgrounds/${image}")`
    }

    scene(name) {
        load_scene(name)
    }

    exit(character) {
        delete this.characters[character].image
    }
}
