import * as THREE from 'three'
import OpenLevel from './Components/OpenLevel';
import Engine from './Engine/Engine';
import UI from './UI/UI';

class Game { 
    constructor() {
        this.renderer = new THREE.WebGLRenderer();
        this.canvas = this.renderer.domElement;
        let c = document.getElementById("c");
        c.appendChild(this.canvas);
        // c.addEventListener("click", function () {
        //     document.body.requestPointerLock();
        // });
        this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
        this.renderer.setClearColor(0xdddddd, 1);
        this.launch = this.launch.bind(this);
    }

    main() {
        Engine.inputListener.setCaster(([code, isPressed, inputs]) => {
            Engine.eventHandler.dispatch('inputListener', {
                code: code,
                isPressed: isPressed,
                inputs: inputs
            });
        });
        this.setup();
        //Engine.eventHandler.subscribe('inputListener', this.launch);
        Engine.inputListener.start();
        this.renderer.render(this.scene, this.camera);
        this.start()
    }

    /**
     * Launches the game when space bar is pressed
     * @param {Object} payload
     * @param {int} payload.code
     * @param {boolean} payload.isPressed
     * @param {boolean[]} payload.inputs
     */
    launch(payload) {
        if (payload.code === 'Space' && payload.isPressed) {
            Engine.eventHandler.unsubscribe('inputListener', this.launch);
            this.start();
        }
    }

    getScene() {
        return this.scene;
    }

    setup() {
        Engine.game = this;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.offsetWidth / this.canvas.offsetHeight, 0.1, 2000);
        //this.scene.add(this.camera);

        // Load initial level
        this.level = new OpenLevel().load(this.scene, this.camera);

        Engine.machine.addCallback(() => {
            this.renderer.render(this.scene, this.camera);
        });
    }

    start() {
        // Start/Stop controls
        Engine.eventHandler.subscribe('inputListener', (payload) => {
            if (payload.code === "Escape" && payload.isPressed) {
                Engine.machine.stop();
            }
            if (payload.code === "KeyR" && payload.isPressed) {
                this.reset();
            }
        });
        Engine.eventHandler.subscribe("gameOver", (payload) => {
            Engine.machine.stop();
            this.renderer.render(this.scene, this.camera);
        });

        Engine.machine.start();
        Engine.eventHandler.dispatch("gameStart", {});
    }

    reset() {
        Engine.clear();
        while(this.scene.children.length > 0){ 
            this.scene.remove(this.scene.children[0]); 
        }
        this.main();
    }
}

export default Game;