import * as THREE from 'three'
import Engine from '../Engine/Engine';

export default class Bullet extends THREE.Object3D {
    /**
     * @param {THREE.Vector3} velocity 
     */
    constructor(velocity) {
        super();
        this.mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.2, 2),
            new THREE.MeshBasicMaterial({color: "black"})
        );
        this.add(this.mesh);
        this.rotateX(Math.PI / 2);

        this.name = "bullet";

        /**@type {THREE.Vector3} */
        this.velocity = velocity;
        this.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3().copy(velocity).normalize());

        this.lastPos = new THREE.Vector3().copy(this.position);

        this.update = this.update.bind(this)
        Engine.machine.addCallback(this.update);
    }

    update(delta_t) {
        if (this.inScene()) {
            this.lastPos.copy(this.position);
            this.position.add(new THREE.Vector3().copy(this.velocity).multiplyScalar(delta_t));
            this.checkForCollision(delta_t);
        } else {            
            this.destroy();
        }
    }

    checkForCollision(delta_t) {
        
        let rc = new THREE.Raycaster(this.lastPos, new THREE.Vector3().copy(this.velocity).normalize(), 0, new THREE.Vector3().subVectors(this.lastPos, this.position).length());
        const intersects = rc.intersectObjects(Engine.game.getScene().children, true);
        if (intersects.length > 0) {
            if (intersects[0].object.parent.name === "block") {
                //console.log(intersects[0])
                this.destroy();
            }
            Engine.eventHandler.dispatch("bulletCollision", intersects[0])
        }
    }

    inScene() {
        return (
            Math.abs(this.position.x) < Engine.game.level.maxX &&
            Math.abs(this.position.y) < Engine.game.level.maxY &&
            Math.abs(this.position.z) < Engine.game.level.maxZ
        )
    }

    destroy() {
        Engine.machine.removeCallback(this.update);
        this.removeFromParent();
    }
} 