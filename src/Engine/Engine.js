import EventHandler from "./EventHandler";
import InputListener from "./InputListener";
import Machine from "./Machine";

class GameEngine {
    constructor() {
        this.eventHandler = new EventHandler()
        this.machine = new Machine();
        this.inputListener = new InputListener();
        this.game = undefined;
    }

    vector3ToString(vec) {
        return "(" + vec.x + ", " + vec.y + ", " + vec.z + ")";
    }

    clear() {
        this.eventHandler.clear();
        this.machine.clear();
        this.inputListener.clear();
    }

    detectCollisionComponents(component1, component2) {
        mesh1 = component1.getMesh();
        mesh2 = component2.getMesh();
        mesh1.geometry.computeBoundingBox(); //not needed if its already calculated
        mesh2.geometry.computeBoundingBox();
        mesh1.updateMatrixWorld();
        mesh2.updateMatrixWorld();
        
        let box1 = mesh1.geometry.boundingBox.clone();
        box1.applyMatrix4(mesh1.matrixWorld);
      
        let box2 = mesh2.geometry.boundingBox.clone();
        box2.applyMatrix4(mesh2.matrixWorld);
      
        return box1.intersectsBox(box2);
    }
}

const Engine = new GameEngine();

export default Engine;