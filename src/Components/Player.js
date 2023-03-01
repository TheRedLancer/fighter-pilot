import * as THREE from 'three'
import Engine from '../Engine/Engine';
import Bullet from './Bullet';
import { VOXLoader, VOXMesh } from 'three/examples/jsm/loaders/VOXLoader';

export default class Player extends THREE.Object3D {
    constructor() {
        super();

        this.playerModel = new THREE.Mesh(
            new THREE.ConeGeometry(2, 5),
            new THREE.MeshNormalMaterial()
        );
        this.playerModel.rotation.x = Math.PI / 2;
        this.playerModel.scale.z = 0.5;
        this.add(this.playerModel);

        const voxLoader = new VOXLoader();
        voxLoader.load(require('../../assets/CamoStellarJet.vox'), (chunks) => {
            this.remove(this.playerModel);
            this.playerModel = new THREE.Object3D();
            for ( let i = 0; i < chunks.length; i ++ ) {
                const chunk = chunks[ i ];
                const mesh = new VOXMesh( chunk );
                mesh.scale.setScalar( 0.1 );
                this.playerModel.add( mesh );
            }
            this.add(this.playerModel);
            this.playerModel.add(this.camera);
            this.playerModel.add(this.shipLight);
            this.playerModel.add(this.shipLight.target);
            this.playerModel.add(this.cameraPosition);
            this.playerModel.add(this.cameraTarget);
        });

        this.shipLight = new THREE.SpotLight(0xFFFFFF, 1, 5, Math.PI / 3, 0, 0.1);
        this.shipLight.position.set(0, 4, -0.5);
        this.shipLight.target = new THREE.Object3D();

        this.pitchAxis = new THREE.Vector3(1, 0, 0);
        this.yawAxis = new THREE.Vector3(0, 1, 0);
        this.rollAxis = new THREE.Vector3(0, 0, 1);
        this.firePositions = [
            [new THREE.Vector3(-1.3, -0.1, 2), new THREE.Vector3(1, 0, 110).normalize()],
            [new THREE.Vector3(1.3 , -0.1, 2), new THREE.Vector3(-1, 0, 110).normalize()]
        ];

        this.cameraPosition = new THREE.Object3D()
        this.cameraPosition.position.set(0, 4, -7);
        this.cameraTarget = new THREE.Object3D()
        this.cameraTarget.position.set(this.position.x, this.position.y + 2, this.position.z + 7);
        this.playerModel.add(this.cameraPosition);
        this.playerModel.add(this.cameraTarget);

        this.currentSpeed = 0;
        this.thrustForce = 40;
        this.brakeForce = 80;
        this.cruiseSpeed = 25;
        this.maxSpeed = 50;
        this.turnSpeed = 2;

        this.pitchSpeed = 1;
        this.yawSpeed = 0.5;
        this.rollSpeed = 2;
        this.rotateSpeeds = new THREE.Vector3(this.pitchSpeed, this.yawSpeed, this.rollSpeed);
        this.maxRotation = new THREE.Vector3(
            THREE.MathUtils.DEG2RAD * 15, // maxYaw
            THREE.MathUtils.DEG2RAD * 15, // maxPitch
            THREE.MathUtils.DEG2RAD * 15  // maxRoll
        );
        
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
        this.fireDetection(delta_t);

        let [currentThrottleRaw, rotateDirectionRaw] = this.getMovementInput();
        this.processMovementInput(currentThrottleRaw, rotateDirectionRaw, delta_t);

        let newPos = new THREE.Vector3(0, 0, this.currentSpeed * delta_t);
        newPos.applyQuaternion(this.quaternion);
        this.position.add(newPos);
    }

    getMovementInput() {
        // Controls
        let rotateDirectionRaw = new THREE.Vector3(0, 0, 0);
        let currentThrottleRaw = 0;
        let throttleUp = Engine.inputListener.isPressed('ArrowUp') || Engine.inputListener.isPressed('KeyI')
        if (throttleUp) {
            currentThrottleRaw += 1;
        }
        let throttleDown = Engine.inputListener.isPressed('ArrowDown') || Engine.inputListener.isPressed('KeyK')
        if (throttleDown) {
            currentThrottleRaw -= 1;
        }
        if (Engine.inputListener.isPressed('ArrowLeft') || Engine.inputListener.isPressed('KeyJ')) {
            rotateDirectionRaw.x += 1;
        }
        if (Engine.inputListener.isPressed('ArrowRight') || Engine.inputListener.isPressed('KeyL')) {
            rotateDirectionRaw.x += -1;
        }
        if (Engine.inputListener.isPressed('KeyW')) {
            rotateDirectionRaw.y += -1;
        }
        if (Engine.inputListener.isPressed('KeyS')) {
            rotateDirectionRaw.y += 1;
        }
        if (Engine.inputListener.isPressed('KeyD')) {
            rotateDirectionRaw.z += 1;
        }
        if (Engine.inputListener.isPressed('KeyA')) {
            rotateDirectionRaw.z += -1;
        }
        return [currentThrottleRaw, rotateDirectionRaw]
    }

    /**
     * 
     * @param {float} throttleRaw power of throttleRaw forward
     * @param {THREE.Vector3} rotateToRaw direction to rotate towards in form (pitch, yaw, roll) 
     */
    processMovementInput(throttleRaw, rotateToRaw, delta_t) {
        //console.log(throttleRaw, this.currentSpeed);
        let totalThrust = (throttleRaw * this.thrustForce * delta_t);
        if (throttleRaw) {
            if (this.currentSpeed + totalThrust > this.maxSpeed) {
                this.currentSpeed = this.maxSpeed;
            } else if (this.currentSpeed + totalThrust < -1 * this.maxSpeed) {
                this.currentSpeed = -1 * this.maxSpeed;
            } else {
                this.currentSpeed += totalThrust;
            }
        } else if (Math.abs(this.currentSpeed) < 2)  {
            this.currentSpeed = 0;
        } else if (this.currentSpeed > this.cruiseSpeed) {
            this.currentSpeed += -1 * this.brakeForce * delta_t;
        } else if (this.currentSpeed < -1 * this.cruiseSpeed) {
            this.currentSpeed += this.brakeForce * delta_t;
        }
        let rotationRawNormal = new THREE.Vector3(0, 0, 1).cross(rotateToRaw);
        let rotationScaledNormal = new THREE.Vector3().copy(rotationRawNormal).multiply(this.rotateSpeeds);
        //console.log(rotationRawNormal, rotationScaledNormal);
        if (rotateToRaw.length() != 0) {
            this.rotateOnAxis(rotationScaledNormal, this.turnSpeed * delta_t);
            this.rotateOnAxis(new THREE.Vector3(0, 0, 1), rotateToRaw.z * this.turnSpeed * delta_t);
        }
    }

    fireDetection(delta_t) {
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
        if (Engine.inputListener.isPressed('Space') && this.currentFireDelay <= 0) {
            this.currentFireCount = this.fireCount - 1;
            this.currentFireBurstDelay = this.fireBurstDelay;
            this.currentFireDelay = this.fireDelay;
            this.fire();
        }
    }

    fire() {
        for (const [firePos, fireDir] of this.firePositions) {
            let bulletDir = new THREE.Vector3().copy(fireDir).applyEuler(this.playerModel.rotation).applyEuler(this.rotation);
            let bullet = new Bullet(bulletDir.multiplyScalar(this.fireSpeed));
            bullet.position.copy(this.playerModel.localToWorld(new THREE.Vector3().copy(firePos)));
            Engine.game.getScene().add(bullet);
        }
    }

    addCamera(camera) {
        this.camera = camera;
        this.camera.position.copy(this.cameraPosition.position);
        this.camera.lookAt(this.cameraTarget.position);
        this.add(camera);
    }
} 