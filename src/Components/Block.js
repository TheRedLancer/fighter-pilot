import * as THREE from 'three'
import Engine from '../Engine/Engine';

export default class Block extends THREE.Object3D {
    constructor(size) {
        super();
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(size, size, size),
            new THREE.MeshStandardMaterial({color: 0x00FFFF , side: THREE.DoubleSide})
        );
        this.add(this.mesh);

        this.name = "block";

        this.rotateAxis = new THREE.Vector3().randomDirection();
        this.rotateSpeed = 0.5;

        Engine.machine.addCallback(this.update.bind(this));
        this.onBulletCollision = this.onBulletCollision.bind(this); 
        this.destroy = this.destroy.bind(this);
        Engine.eventHandler.subscribe("bulletCollision", this.onBulletCollision);
    }

    update(delta_t) {
        this.rotateOnAxis(this.rotateAxis, this.rotateSpeed * delta_t);
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