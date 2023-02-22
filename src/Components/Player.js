import * as THREE from 'three'
import Engine from '../Engine/Engine';

export default class Player extends THREE.Object3D {
    constructor() {
        super();
        this.mesh = new THREE.Mesh(
            new THREE.ConeGeometry(2, 7),
            new THREE.MeshNormalMaterial()
        );
        this.mesh.rotation.x = Math.PI / 2;
        this.add(this.mesh);

        this.cameraPosition = new THREE.Vector3(0, 8, -13);
        this.cameraTarget = new THREE.Vector3(this.position.x, this.position.y + 5, this.position.z + 5);

        this.speed = 10;

        Engine.machine.addCallback(this.update.bind(this));
    }

    update(delta_t) {
        if (Engine.inputListener.isPressed('ArrowUp')) {
            this.position.z += this.speed * delta_t;
        }
        if (Engine.inputListener.isPressed('ArrowDown')) {
            this.position.z -= this.speed * delta_t;
        }
    }
} 