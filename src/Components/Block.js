import * as THREE from 'three'
import Engine from '../Engine/Engine';

export default class Block extends THREE.Object3D {
    constructor(size) {
        super();
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(size, size, size),
            new THREE.MeshStandardMaterial({color: "grey", side: THREE.DoubleSide})
        );
        this.add(this.mesh);

        this.name = "block";

        //Engine.machine.addCallback(this.update);
        this.onBulletCollision = this.onBulletCollision.bind(this); 
        this.destroy = this.destroy.bind(this);
        Engine.eventHandler.subscribe("bulletCollision", this.onBulletCollision);
    }

    update(delta_t) {
        
    }

    onBulletCollision(payload) {
        if (payload.object == this.mesh) {
            Engine.eventHandler.dispatch("blockHit", {block: this});
            this.destroy();
        }
    }

    destroy() {
        Engine.eventHandler.unsubscribe("bulletCollision", this.onBulletCollision);
        this.removeFromParent();
    }
} 