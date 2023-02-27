import * as THREE from 'three'
import Engine from '../Engine/Engine';
import Bullet from './Bullet';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';

export default class Player extends THREE.Object3D {
    constructor() {
        super();
        this.mesh = new THREE.Mesh(
            new THREE.ConeGeometry(2, 8),
            new THREE.MeshStandardMaterial({color: "lightblue"})
        );
        this.mesh.scale.z = 0.5;
        this.add(this.mesh);
        const objLoader = new OBJLoader();
        const mtlLoader = new MTLLoader();

        mtlLoader.load('assets/CamoStellarJet.mtl', (mtl) => {
            mtl.preload();
            objLoader.setMaterials(mtl);
            objLoader.load('assets/CamoStellarJet.obj', (root) => {
                this.remove(this.mesh);
                this.mesh = root;
                this.add(root);
            });
        });

        this.mesh.rotation.x = Math.PI / 2;

        this.pitchAxis = new THREE.Vector3(1, 0, 0);
        this.yawAxis = new THREE.Vector3(0, 1, 0);
        this.rollAxis = new THREE.Vector3(0, 0, 1);
        this.firePosition = new THREE.Vector3(0, 0, 4);
        this.fireDirection = new THREE.Vector3(0, 0, 1);

        this.cameraPosition = new THREE.Object3D()
        this.cameraPosition.position.copy(new THREE.Vector3(0, 5, -13));
        this.add(this.cameraPosition);

        this.cameraTarget = new THREE.Object3D()
        this.cameraTarget.position.copy(new THREE.Vector3(this.position.x, this.position.y + 5, this.position.z + 5));
        this.add(this.cameraTarget);

        this.thrustSpeed = 0;
        this.maxSpeed = 20;
        this.turnSpeed = 1.5;

        this.fireCooldown = 0.5;
        this.currentFireTimer = 0;
        this.fireSpeed = 200;

        Engine.machine.addCallback(this.update.bind(this));
    }

    update(delta_t) {
        if (this.currentFireTimer > 0) {
            this.currentFireTimer -= delta_t;
        }
        if (Engine.inputListener.isPressed('ArrowUp') || Engine.inputListener.isPressed('KeyI')) {
            if (this.thrustSpeed < this.maxSpeed) {
                this.thrustSpeed += 0.1;
            }
        }
        if (Engine.inputListener.isPressed('ArrowDown') || Engine.inputListener.isPressed('KeyK')) {
            if (this.thrustSpeed > -1 * this.maxSpeed) {
                this.thrustSpeed -= 0.1;
            }
        }
        if (Math.abs(this.thrustSpeed) < 0.05) {
            this.thrustSpeed = 0;
        }
        if (Engine.inputListener.isPressed('ArrowLeft') || Engine.inputListener.isPressed('KeyJ')) {
            this.rotateOnAxis(this.yawAxis, this.turnSpeed * delta_t);
        }
        if (Engine.inputListener.isPressed('ArrowRight') || Engine.inputListener.isPressed('KeyL')) {
            this.rotateOnAxis(this.yawAxis, -1 * this.turnSpeed * delta_t);
        }
        if (Engine.inputListener.isPressed('KeyW')) {
            this.rotateOnAxis(this.pitchAxis, this.turnSpeed * delta_t);
        }
        if (Engine.inputListener.isPressed('KeyS')) {
            this.rotateOnAxis(this.pitchAxis, -1 * this.turnSpeed * delta_t);
        }
        if (Engine.inputListener.isPressed('KeyD')) {
            this.rotateOnAxis(this.rollAxis, this.turnSpeed * delta_t);
        }
        if (Engine.inputListener.isPressed('KeyA')) {
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
        let bullet = new Bullet(new THREE.Vector3().copy(this.fireDirection).applyQuaternion(this.quaternion).multiplyScalar(this.fireSpeed));
        bullet.position.copy(this.localToWorld(new THREE.Vector3().copy(this.firePosition)));
        Engine.game.getScene().add(bullet);
    }
} 