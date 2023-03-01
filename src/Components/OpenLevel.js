import * as THREE from "three";
import Block from "./Block";
import Player from "./Player";

export default class OpenLevel extends THREE.Object3D {
    constructor() {
        super();
        this.maxX = 200;
        this.maxY = 400;
        this.maxZ = 200;
        this.boxes = [];
    }

    /**
     * Loads the level to the passed in scene
     * @param {THREE.Scene} scene 
     * @param {THREE.PerspectiveCamera} camera
     */
    load(scene, camera) {
        this.player = new Player();
        this.player.position.set(-190, 80, -190);
        this.player.rotateY(Math.PI / 4);
        scene.add(this.player);
 
        let blockSize = 10;

        for (let i = 0; i < 20; i++) {
            let box = new Block(blockSize);
            box.position.set(this.randomIntFromInterval(-120, 120), this.randomIntFromInterval(40, 180), this.randomIntFromInterval(-120, 120));
            scene.add(box);
        }

        let ground = new THREE.Mesh(
            new THREE.PlaneGeometry(400, 400),
            new THREE.MeshBasicMaterial({color: "green"})
        );
        ground.rotateX(- Math.PI / 2);
        scene.add(ground);

        let sun = new THREE.Mesh(
            new THREE.SphereGeometry(20, 20),
            new THREE.MeshBasicMaterial({color: "yellow"})
        )
        sun.position.set(-300, 300, 300);
        scene.add(sun);

        let light = new THREE.PointLight();
        light.position.copy(sun.position);
        scene.add(light);

        let ambient = new THREE.AmbientLight(0xFFFFFF, 0.3);
        scene.add(ambient);

        this.player.addCamera(camera);
        return this;
    }

    randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}