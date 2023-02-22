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

        let box = new Block(4, 4, 4);
        box.position.set(0, 0, 20);
        scene.add(box);

        this.player.add(camera);
        camera.position.copy(this.player.cameraPosition);
        camera.lookAt(this.player.cameraTarget);
    }
}