import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import NX from "../assets/HDRIS/01-indoor/nx.png";
import PX from "../assets/HDRIS/01-indoor/px.png";
import NY from "../assets/HDRIS/01-indoor/ny.png";
import PY from "../assets/HDRIS/01-indoor/py.png";
import NZ from "../assets/HDRIS/01-indoor/nz.png";
import PZ from "../assets/HDRIS/01-indoor/pz.png";

import ChairAnimation from "./ChairAnimation";

class MainThreeScene {
  constructor() {
    this.camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.clock = new THREE.Clock();
    this.previousTime = 0;
    this.isInitialized = false;
    this.gltfLoader = new GLTFLoader();
    this.environmentMap = null;
    this.cubeTextureLoader = new THREE.CubeTextureLoader();
    this.debugObject = {
      envMapIntensity: 1.5,
      color: 0xcbe5ff,
    };
    this.threeContainerRef = null;
    this.otherRef = null;
    this.buttonRef = null;
    this.bind();
  }

  init(threeContainerRef, otherRef, buttonRef) {
    if (!this.isInitialized) {
      this.threeContainerRef = threeContainerRef;
      this.otherRef = otherRef;
      this.buttonRef = buttonRef;
      this.camera.position.set(0, 0, 15);
      this.camera.lookAt(0, 0, 0);
      this.scene.add(this.camera);
      threeContainerRef.appendChild(this.renderer.domElement);
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      this.rendererConfig();
      this.addingIlumination();
      this.addModels();
      window.addEventListener("resize", this.resizeCanvas);
      const canvas = document.querySelector("canvas");
      this.controls = new OrbitControls(this.camera, canvas);
      this.controls.target.set(0, 0.75, 0);
      this.controls.minDistance = 5;
      this.controls.maxDistance = 20;
      this.controls.enableDamping = true;
      this.controls.enableZoom = false;
      this.update();
      this.isInitialized = true;
    }
  }

  scrollableHandlerChange(isScrollable) {
    if (isScrollable) {
      document.body.style.overflowY = "scroll";
    } else {
      document.body.style.overflowY = "hidden";
    }

    ChairAnimation.onScrollableChange(isScrollable);
  }

  addingIlumination() {
    this.ambientLight = new THREE.AmbientLight(this.debugObject.color, 3.1);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(
      this.debugObject.color,
      20
    );

    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.set(1024, 1024);
    this.directionalLight.shadow.camera.far = 15;
    this.directionalLight.shadow.camera.left = -7;
    this.directionalLight.shadow.camera.top = 7;
    this.directionalLight.shadow.camera.right = 7;
    this.directionalLight.shadow.camera.bottom = -7;
    this.directionalLight.position.set(-5, 5, 0);
    this.scene.add(this.directionalLight);
    this.renderer.physicallyCorrectLights = true;
  }

  setRandomColor(material) {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    this.threeContainerRef.style.backgroundColor = `#${randomColor}50`;
    this.buttonRef.style.backgroundColor = `#${randomColor}40`;
    const hexColor = `0x${randomColor}`;
    this.directionalLight.color.setHex(hexColor);
    this.ambientLight.color.setHex(hexColor);
    material.color.setHex(hexColor);
  }

  rendererConfig() {
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.environmentMap = this.cubeTextureLoader.load([PX, NX, PY, NY, PZ, NZ]);
    this.environmentMap.encoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.CineonToneMapping;
    this.renderer.toneMappingExposure = 0.5;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  addModels() {
    ChairAnimation.init(
      this.scene,
      this.gltfLoader,
      this.updateMaterials,
      this.setRandomColor,
      this.otherRef
    );
  }

  resizeCanvas() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  updateMaterials() {
    this.scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        child.material.envMap = this.environmentMap;
        child.material.envMapIntensity = this.debugObject.envMapIntensity;
      }
    });
  }

  update() {
    this.time = this.clock.getElapsedTime();
    this.deltaTime = this.time - this.previousTime;
    this.previousTime = this.time;
    this.renderer.render(this.scene, this.camera);

    // Update controls
    this.controls.update();

    //Update Classes
    ChairAnimation.update(this.deltaTime);

    requestAnimationFrame(this.update.bind(this));
  }

  bind() {
    this.init = this.init.bind(this);
    this.update = this.update.bind(this);
    this.resizeCanvas = this.resizeCanvas.bind(this);
    this.addingIlumination = this.addingIlumination.bind(this);
    this.rendererConfig = this.rendererConfig.bind(this);
    this.addModels = this.addModels.bind(this);
    this.updateMaterials = this.updateMaterials.bind(this);
    this.setRandomColor = this.setRandomColor.bind(this);
    this.scrollableHandlerChange = this.scrollableHandlerChange.bind(this);
  }
}

const _instance = new MainThreeScene();
export default _instance;
