import * as THREE from 'three'

class Machine {
    constructor() {
        this.running = false;
        this.callbacks = [];
        this.clock = new THREE.Clock(true);
    }

    addCallback(callback) {
        this.callbacks.push(callback);
    }

    removeCallback(callback) {
        this.callbacks = this.callbacks.filter(cb => cb != callback);
    }

    run() {
        if (!this.running) return;
        let delta_i = this.clock.getDelta();
        this.callbacks.forEach(cb => cb(delta_i));
        requestAnimationFrame(this.run.bind(this));
    }

    start() {
        //console.log("Machine: start");
        if (this.running) return;
        this.clock.start();
        this.running = true;
        this.run();
    }

    stop() {
        this.running = false;
        this.clock.stop();
    }

    clear() {
        this.callbacks = [];
        this.running = false;
        this.clock = new THREE.Clock(true);
    }
}

export default Machine;