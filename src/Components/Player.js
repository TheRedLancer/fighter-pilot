import * as THREE from 'three'
import Engine from '../Engine/Engine';
import Bullet from './Bullet';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import "../../assets/CamoStellarJet.png"

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
        mtlLoader.load(require('../../assets/CamoStellarJet.mtl'), (mtl) => {
            mtl.preload();
            objLoader.setMaterials(mtl);
            objLoader.load(require('../../assets/CamoStellarJet.obj'), (root) => {
                this.remove(this.mesh);
                this.mesh = root.children[0];
                this.add(this.mesh);
            });
        });

        this.shipLight = new THREE.SpotLight(0xFFFFFF, 6, 5, Math.PI / 3, 0, 0.1);
        this.shipLight.position.set(0, 3, 0);
        this.shipLight.target = new THREE.Object3D();
        this.add(this.shipLight);
        this.add(this.shipLight.target); 

        this.pitchAxis = new THREE.Vector3(1, 0, 0);
        this.yawAxis = new THREE.Vector3(0, 1, 0);
        this.rollAxis = new THREE.Vector3(0, 0, 1);
        this.firePositions = [
            [new THREE.Vector3(-1.3, 0, 2), new THREE.Vector3(1, 0, 110).normalize()],
            [new THREE.Vector3(1.3 , 0, 2), new THREE.Vector3(-1, 0, 110).normalize()]
        ];

        this.cameraPosition = new THREE.Object3D()
        this.cameraPosition.position.copy(new THREE.Vector3(0, 4, -7));
        this.add(this.cameraPosition);
        this.cameraTarget = new THREE.Object3D()
        this.cameraTarget.position.copy(new THREE.Vector3(this.position.x, this.position.y + 2, this.position.z + 7));
        this.add(this.cameraTarget);

        this.currentSpeed = 0;
        this.thrustForce = 0.5;
        this.maxSpeed = 30;

        this.yawSpeed = 1;
        this.maxYaw = 0.2;
        this.currentYaw = 0;
        this.rollSpeed = 1;
        this.currentRoll = 0;
        this.maxRoll = 0.2;
        this.pitchSpeed = 1;
        this.currentPitch = 0;
        this.maxPitch = 0.2;
        
        this.fireDelay = 0.6;
        this.currentFireDelay = 0;
        this.fireCount = 2;
        this.currentFireCount = 0;
        this.fireBurstDelay = 0.1;
        this.currentFireBurstDelay = 0;

        this.fireSpeed = 200;

        Engine.machine.addCallback(this.update.bind(this));
    }

    update(delta_t) {
        // If we have another shot to fire,
        if (this.currentFireCount > 0) {
            // if we are ready to fire another shot
            if (this.currentFireBurstDelay < 0) {
                this.fire();
                this.currentFireCount -= 1;
                // If we have more to fire, increase burst delay
                if (this.currentFireCount > 0) {
                    this.currentFireBurstDelay = this.fireBurstDelay;
                }
            // otherwise wait to fire
            } else {
                this.currentFireBurstDelay -= delta_t;
            }
        }
        // If we have to wait before firing again
        else if (this.currentFireDelay > 0) {
            this.currentFireDelay -= delta_t;
        }
        // Controls
        let rolling = false;
        let yawing = false;
        let pitching = false;
        {
        let throttleUp = Engine.inputListener.isPressed('ArrowUp') || Engine.inputListener.isPressed('KeyI')
        if (throttleUp) {
            if (this.currentSpeed < this.maxSpeed) {
                this.currentSpeed += this.thrustForce;
            }
        }
        let throttleDown = Engine.inputListener.isPressed('ArrowDown') || Engine.inputListener.isPressed('KeyK')
        if (throttleDown) {
            if (this.currentSpeed > -1 * this.maxSpeed) {
                this.currentSpeed -= 2 * this.thrustForce;
            }
        }
        if (!throttleUp && !throttleDown && Math.abs(this.currentSpeed) < 2)  {
            this.currentSpeed = 0;
        }
        if (Engine.inputListener.isPressed('ArrowLeft') || Engine.inputListener.isPressed('KeyJ')) {
            yawing = !yawing;
            if (this.currentYaw < this.maxYaw) {
                this.currentYaw += this.yawSpeed * delta_t;
                this.mesh.rotateOnAxis(this.yawAxis, this.yawSpeed * delta_t);
            }
            this.rotateOnAxis(this.yawAxis, this.yawSpeed * delta_t);
        }
        if (Engine.inputListener.isPressed('ArrowRight') || Engine.inputListener.isPressed('KeyL')) {
            yawing = !yawing;
            if (this.currentYaw > -1 * this.maxYaw) {
                this.currentYaw += -1 * this.yawSpeed * delta_t;
                this.mesh.rotateOnAxis(this.yawAxis, -1 * this.yawSpeed * delta_t);
            }
            this.rotateOnAxis(this.yawAxis, -1 * this.yawSpeed * delta_t);
        }
        if (Engine.inputListener.isPressed('KeyW')) {
            pitching = !pitching;
            if (this.currentPitch < this.maxPitch) {
                this.currentPitch += this.pitchSpeed * delta_t;
                this.mesh.rotateOnAxis(this.pitchAxis, this.pitchSpeed * delta_t);
            }
            this.rotateOnAxis(this.pitchAxis, this.pitchSpeed * delta_t);
        }
        if (Engine.inputListener.isPressed('KeyS')) {
            pitching = !pitching;
            if (this.currentPitch > -1 * this.maxPitch) {
                this.currentPitch += -1 * this.pitchSpeed * delta_t;
                this.mesh.rotateOnAxis(this.pitchAxis, -1 * this.pitchSpeed * delta_t);
            }
            this.rotateOnAxis(this.pitchAxis, -1 * this.pitchSpeed * delta_t);
        }
        if (Engine.inputListener.isPressed('KeyD')) {
            rolling = !rolling;
            if (this.currentRoll < this.maxRoll) {
                this.currentRoll += this.rollSpeed * delta_t;
                this.mesh.rotateOnAxis(this.rollAxis, this.rollSpeed * delta_t);
            }
            this.rotateOnAxis(this.rollAxis, this.rollSpeed * delta_t);
        }
        if (Engine.inputListener.isPressed('KeyA')) {
            rolling = !rolling;
            if (this.currentRoll > -1 * this.maxRoll) {
                this.currentRoll -= this.rollSpeed * delta_t;
                this.mesh.rotateOnAxis(this.rollAxis, -1 * this.rollSpeed * delta_t);
            }
            this.rotateOnAxis(this.rollAxis, -1 * this.rollSpeed * delta_t);
        }
        if (!rolling) {
            if (this.currentRoll < 0) {
                if (-1 * this.currentRoll < this.rollSpeed * delta_t) {
                    this.mesh.rotation.set(this.currentPitch, this.currentYaw, 0);
                    this.currentRoll = 0;
                } else {
                    this.currentRoll += this.rollSpeed * delta_t;
                    this.mesh.rotateOnAxis(this.rollAxis, this.rollSpeed * delta_t);
                }
            } else if (this.currentRoll > 0) {
                if (this.currentRoll < this.rollSpeed * delta_t) {
                    this.mesh.rotation.set(this.currentPitch, this.currentYaw, 0);
                    this.currentRoll = 0;
                } else {
                    this.currentRoll += -1 * this.rollSpeed * delta_t;
                    this.mesh.rotateOnAxis(this.rollAxis, -1 * this.rollSpeed * delta_t);
                }
            }
        }
        if (!yawing) {
            if (this.currentYaw < 0) {
                if (-1 * this.currentYaw < this.yawSpeed * delta_t) {
                    this.mesh.rotation.set(this.currentPitch, 0, this.currentRoll);
                    this.currentYaw = 0;
                } else {
                    this.currentYaw += this.yawSpeed * delta_t;
                    this.mesh.rotateOnAxis(this.yawAxis, this.yawSpeed * delta_t);
                }
            } else if (this.currentYaw > 0) {
                if (this.currentYaw < this.yawSpeed * delta_t) {
                    this.mesh.rotation.set(this.currentPitch, 0, this.currentRoll);
                    this.currentYaw = 0;
                } else {
                    this.currentYaw += -1 * this.yawSpeed * delta_t;
                    this.mesh.rotateOnAxis(this.yawAxis, -1 * this.yawSpeed * delta_t);
                }
            }
        }
        if (!pitching) {
            if (this.currentPitch < 0) {
                if (-1 * this.currentPitch < this.pitchSpeed * delta_t) {
                    this.mesh.rotation.set(0, this.currentYaw, this.currentRoll);
                    this.currentPitch = 0;
                } else {
                    this.currentPitch += this.pitchSpeed * delta_t;
                    this.mesh.rotateOnAxis(this.pitchAxis, this.pitchSpeed * delta_t);
                }
            } else if (this.currentPitch > 0) {
                if (this.currentPitch < this.pitchSpeed * delta_t) {
                    this.mesh.rotation.set(0, this.currentYaw, this.currentRoll);
                    this.currentPitch = 0;
                } else {
                    this.currentPitch += -1 * this.pitchSpeed * delta_t;
                    this.mesh.rotateOnAxis(this.pitchAxis, -1 * this.pitchSpeed * delta_t);
                }
            }
        }
        // if (this.currentPitch === 0 && this.currentYaw === 0 && this.currentRoll === 0) {
        //     this.mesh.setRotationFromAxisAngle(this.rollAxis, 0);
        // }
        }
        if (Engine.inputListener.isPressed('Space') && this.currentFireDelay <= 0) {
            this.currentFireCount = this.fireCount - 1;
            this.currentFireBurstDelay = this.fireBurstDelay;
            this.currentFireDelay = this.fireDelay;
            this.fire();
        }
        let newPos = new THREE.Vector3(0, 0, this.currentSpeed * delta_t);
        newPos.applyQuaternion(this.quaternion);
        this.position.add(newPos);
    }

    fire() {
        for (const [firePos, fireDir] of this.firePositions) {
            let bullet = new Bullet(new THREE.Vector3().copy(fireDir).applyQuaternion(this.quaternion).multiplyScalar(this.fireSpeed));
            bullet.position.copy(this.localToWorld(new THREE.Vector3().copy(firePos)));
            Engine.game.getScene().add(bullet);
        }
    }
} 