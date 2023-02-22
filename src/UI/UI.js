import * as THREE from 'three'
import { Font } from 'three/examples/jsm/loaders/FontLoader';

class UI extends THREE.Object3D {
    constructor(width, height) {
        super();
        this.font = new Font(require('../droid_sans_mono_regular.typeface.json'));
    }
}

export default UI;