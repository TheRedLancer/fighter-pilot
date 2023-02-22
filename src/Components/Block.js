import * as THREE from 'three'
import Engine from '../Engine/Engine';

export default class Block extends THREE.Object3D {
    constructor(x, y, z) {
        super();
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(x, y, z),
            new THREE.MeshBasicMaterial({color: "blue"})
        );
        this.add(this.mesh);

        this.name = "block";

        Engine.machine.addCallback(this.update);
    }

    update(delta_t) {
        
    }
} 