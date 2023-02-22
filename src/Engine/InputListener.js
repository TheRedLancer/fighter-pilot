class InputListener {
    constructor(caster) {
        this.inputs = {};
        this.caster = caster || console.log;
        this.down = this.down.bind(this);
        this.up = this.up.bind(this);
    }

    setCaster(fn) {
        this.caster = fn;
    }

    isPressed(code) {
        return this.inputs[code];
    }

    down(e) {
        if (this.inputs[e.code]) return;
        this.inputs[e.code] = true;
        this.caster([e.code, true, this.inputs]);
    }

    up(e) {
        this.inputs[e.code] = false;
        this.caster([e.code, false, this.inputs]);
    }

    start() {
        window.addEventListener('keydown', this.down);
        window.addEventListener('keyup', this.up);
    }

    stop() {
        window.removeEventListener('keydown', this.down);
        window.removeEventListener('keyup', this.up);
    }

    clear() {
        this.inputs = [];
    }
}

export default InputListener;