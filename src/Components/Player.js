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

        let y = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.2, 4),
            new THREE.MeshBasicMaterial({color: "blue"})
        );
        y.position.y = 2;
        this.add(y);

        let z = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.2, 4),
            new THREE.MeshBasicMaterial({color: "red"})
        );
        z.rotateX(Math.PI / 2);
        z.position.z = 2;
        this.add(z);

        let x = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.2, 4),
            new THREE.MeshBasicMaterial({color: "green"})
        );
        x.position.x = 2;
        x.rotateZ(Math.PI / 2);
        this.add(x);



        this.cameraPosition = new THREE.Vector3(0, 8, -13);
        this.cameraTarget = new THREE.Vector3(this.position.x, this.position.y + 5, this.position.z + 5);

        this.thrustSpeed = 10;
        this.turnSpeed = 3;

        Engine.machine.addCallback(this.update.bind(this));
    }

    update(delta_t) {
        if (Engine.inputListener.isPressed('ArrowUp')) {
            let newPos = new THREE.Vector3(0, 0, this.thrustSpeed * delta_t);
            newPos.applyQuaternion(this.quaternion);
            this.position.add(newPos);
        }
        if (Engine.inputListener.isPressed('ArrowDown')) {
            let newPos = new THREE.Vector3(0, 0, -1 * this.thrustSpeed * delta_t);
            newPos.applyQuaternion(this.quaternion);
            this.position.add(newPos);
        }
        if (Engine.inputListener.isPressed('KeyA')) {
            this.rotation.y += this.turnSpeed * delta_t;
        }
        if (Engine.inputListener.isPressed('KeyD')) {
            this.rotation.y -= this.turnSpeed * delta_t;
        }
        if (Engine.inputListener.isPressed('KeyW')) {
            this.rotation.x += this.turnSpeed * delta_t;
        }
        if (Engine.inputListener.isPressed('KeyS')) {
            this.rotation.x -= this.turnSpeed * delta_t;
        }
    }
} 