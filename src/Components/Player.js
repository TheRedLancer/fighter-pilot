import * as THREE from 'three'
import Engine from '../Engine/Engine';

export default class Player extends THREE.Object3D {
    constructor() {
        super();
        this.mesh = new THREE.Mesh(
            new THREE.ConeGeometry(2, 8),
            new THREE.MeshNormalMaterial()
        );
        this.add(this.mesh);

        this.mesh.rotation.x = Math.PI / 2;

        this.pitchAxis = new THREE.Vector3(1, 0, 0);
        this.yawAxis = new THREE.Vector3(0, 1, 0);
        this.rollAxis = new THREE.Vector3(0, 0, 1);
        this.firePosition = new THREE.Vector3(0, 0, 4);
        this.fireDirection = new THREE.Vector3(0, 0, 1);
        this.firePosSphere = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshNormalMaterial());
        this.firePosSphere.position.copy(this.firePosition);
        this.add(this.firePosSphere);

        this.cameraPosition = new THREE.Vector3(0, 8, -15);
        this.cameraTarget = new THREE.Vector3(this.position.x, this.position.y + 5, this.position.z + 5);

        this.thrustSpeed = 0;
        this.turnSpeed = 1.5;

        this.fireCooldown = 0.5;
        this.currentFireTimer = 0;

        Engine.machine.addCallback(this.update.bind(this));
    }

    update(delta_t) {
        if (this.currentFireTimer > 0) {
            this.currentFireTimer -= delta_t;
        }
        if (Engine.inputListener.isPressed('ArrowUp')) {
            if (this.thrustSpeed < 10) {
                this.thrustSpeed += 0.1;
            }
        }
        if (Engine.inputListener.isPressed('ArrowDown')) {
            if (this.thrustSpeed > -10) {
                this.thrustSpeed -= 0.1;
            }
        }
        if (Math.abs(this.thrustSpeed) < 0.05) {
            this.thrustSpeed = 0;
        }
        if (Engine.inputListener.isPressed('KeyA')) {
            this.rotateOnAxis(this.yawAxis, this.turnSpeed * delta_t);
        }
        if (Engine.inputListener.isPressed('KeyD')) {
            this.rotateOnAxis(this.yawAxis, -1 * this.turnSpeed * delta_t);
        }
        if (Engine.inputListener.isPressed('KeyW')) {
            this.rotateOnAxis(this.pitchAxis, this.turnSpeed * delta_t);
        }
        if (Engine.inputListener.isPressed('KeyS')) {
            this.rotateOnAxis(this.pitchAxis, -1 * this.turnSpeed * delta_t);
        }
        if (Engine.inputListener.isPressed('ArrowRight')) {
            this.rotateOnAxis(this.rollAxis, this.turnSpeed * delta_t);
        }
        if (Engine.inputListener.isPressed('ArrowLeft')) {
            this.rotateOnAxis(this.rollAxis, -1 * this.turnSpeed * delta_t);
        }
        if (Engine.inputListener.isPressed('Space') && this.currentFireTimer <= 0) {
            this.fire();
            this.currentFireTimer = this.fireCooldown;
        }
        let newPos = new THREE.Vector3(0, 0, this.thrustSpeed * delta_t);
        newPos.applyQuaternion(this.quaternion);
        this.position.add(newPos);
    }

    fire() {
        console.log("Fire!");
        let rc = new THREE.Raycaster(this.localToWorld(new THREE.Vector3().copy(this.firePosition)), new THREE.Vector3().copy(this.fireDirection).applyQuaternion(this.quaternion));
        console.log(this.firePosition, new THREE.Vector3().copy(this.fireDirection).applyQuaternion(this.quaternion));
        const intersects = rc.intersectObjects(Engine.game.getScene().children, true);
        if (intersects.length > 0) {
            console.log(intersects);
        }
        for (let i = 0; i < intersects.length; i ++) {
            if (intersects[i].object.parent.name === "block") {
                intersects[i].object.material.color.set(0xff0000);
            }
        }
    }
} 