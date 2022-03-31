import $ from 'jquery';
import * as THREE from 'three';
import { AxesHelper, BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, PMREMGenerator, Scene, UnsignedByteType, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

export default class ThreeApp {

    constructor(container) {
        this.container = container;

        this.scene = new THREE.Scene();

        this.camera = new PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 50);

        this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)

    }

    async start() {
        const envTexture = await new RGBELoader().setDataType(UnsignedByteType).loadAsync('./assets/env/royal_esplanade_1k.hdr');
        var pmremGenerator = new PMREMGenerator(this.renderer);
        pmremGenerator.compileEquirectangularShader();
        this.scene.environment = pmremGenerator.fromEquirectangular(envTexture).texture;
        envTexture.dispose();
        pmremGenerator.dispose();

        this.scene.add(new AxesHelper(10))
        const box = new Mesh(new BoxGeometry(10, 10, 10), new MeshBasicMaterial({ wireframe: true }));
        this.scene.add(box);


        $('#loader').fadeOut();
        this.animate()
        window.addEventListener('resize', this.resize.bind(this), false);
    }

    resize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
        this.orbit.update()
    }
}