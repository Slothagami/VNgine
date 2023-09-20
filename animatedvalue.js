const time  = () => performance.now()/1000

class AnimatedValue {
    constructor(current_value, target, anim_time, easing="smoothstep") {
        // stop nested animations causing rediculous performance hits
        if(current_value instanceof AnimatedValue) current_value = current_value.valueOf()
        if(target instanceof AnimatedValue) target = target.valueOf()

        this.easing = AnimatedValue[easing]
        this.anim_time = anim_time
        this.current_value = current_value
        this.target = target
        this.anim_start = time()
    }

    valueOf() {
        return this.value()
    }
    toString() {
        return round(this.value()).toString()
    }

    lerp(start, end, perc) {
        return start + (end - start) * perc
    }

    static linear(x) {
        return clamp(x, 0, 1)
    }

    static smoothstep(x) {
        if(x < 0) return 0
        if(x > 1) return 1
        return 3*x**2 - 2*x**3
    }

    value() {
        let dtime = time() - this.anim_start
        return this.lerp(
            this.current_value, this.target, 
            this.easing(dtime / this.anim_time)
        )
    }
}

class NumControler extends AnimatedValue {
    constructor(element, anim_time=.5, easing="smoothstep") {
        super(
            parseFloat(element.value), 
            parseFloat(element.value), 
            anim_time, easing
        )
        this.element = element

        element.addEventListener("input", () => {
            this.current_value = this.target
            this.target = parseFloat(this.element.value)
            this.anim_start = time()
        })
    }

    value() {
        let dtime = time() - this.anim_start
        let diff = this.target - this.current_value

        // snap to value if scrubbing slider
        if(this.element.type == "range") {
            if(Math.abs(diff) <= 2*parseFloat(this.element.step)) {
                return this.target
            }
        }

        return this.lerp(
            this.current_value, this.target, 
            this.easing(dtime / this.anim_time)
        )
    }
}
