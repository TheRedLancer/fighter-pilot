import * as THREE from "three";
import Block from "./Block";
import Player from "./Player";

export default class OpenLevel extends THREE.Object3D {
    constructor() {
        super();
    }

    /**
     * Loads the level to the passed in scene
     * @param {THREE.Scene} scene 
     * @param {THREE.PerspectiveCamera} camera
     */
    load(scene, camera) {
        this.player = new Player();
        scene.add(this.player);

        let box1 = new Block(4, 4, 4);
        box1.position.set(0, 0, 20);
        scene.add(box1);

        let box2 = new Block(4, 4, 4);
        box2.position.set(20, 0, 0);
        scene.add(box2);

        let box3 = new Block(4, 4, 4);
        box3.position.set(-20, 0, 0);
        scene.add(box3);

        let box4 = new Block(4, 4, 4);
        box4.position.set(0, 0, -20);
        scene.add(box4);

        this.player.add(camera);
        camera.position.copy(this.player.cameraPosition);
        camera.lookAt(this.player.cameraTarget);
    }
}