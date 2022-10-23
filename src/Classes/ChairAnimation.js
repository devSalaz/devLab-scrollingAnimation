import * as THREE from "three";
import { DoubleSide } from "three";
import ChairModel from "../assets/Models/saltoSilla.glb";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

class ChairAnimation {
  constructor() {
    this.bind();
    this.scene = null;
    this.gltfLoader = null;
    this.isModelLoaded = false;
    this.mixer = null;
    this.action = null;
    this.updateMaterials = null;
    this.clipDuration = 0;
    this.callAnimation = true;
    this.chair = null;
    this.props = {
      color: "#002dff",
      animationTime: 0,
    };
    this.otherRef = null;
    this.isLoopAnimation = false;
  }

  init(scene, gltfLoader, updateMaterials, setRandomColor, otherRef) {
    this.scene = scene;
    this.gltfLoader = gltfLoader;
    this.updateMaterials = updateMaterials;
    this.otherRef = otherRef;

    this.setRandomColor = setRandomColor;
    this.materialsCreation();
    this.loadModel();
  }

  onScrollableChange(isScrollable) {
    this.isLoopAnimation = !isScrollable;
  }

  addGsapAnimation() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(this.props, {
      scrollTrigger: {
        trigger: this.otherRef,
        toggleActions: "restart none none none",
        markers: false,
        start: "top top",
        pin: true,
        end: "+=" + window.innerHeight * 5,
        scrub: true,
        onUpdate: this.gettingPropsInfo,
      },
      animationTime: this.clipDuration,
    });
  }

  gettingPropsInfo() {
    if (this.mixer && !this.isLoopAnimation) {
      this.mixer.setTime(this.props.animationTime);
    }
  }

  materialsCreation() {
    this.materialChair = new THREE.MeshStandardMaterial({
      color: 0xcbe5ff,
      side: DoubleSide,
      roughness: 0.8,
      metalness: 0,
    });
  }

  loadModel() {
    this.gltfLoader.load(ChairModel, (glb) => {
      this.chairModel = glb.scene;
      this.chairModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.name.includes("Carpeting-blue_0")) {
            child.material = this.materialChair;
            this.chair = child;
          }
        }
      });
      this.chairModel.scale.set(5, 5, 5);
      this.chairModel.position.y = -0.5;
      this.scene.add(this.chairModel);
      this.mixer = new THREE.AnimationMixer(this.chairModel);
      this.action = this.mixer.clipAction(glb.animations[0]);
      this.clipDuration = this.mixer.clipAction(
        glb.animations[0]
      )._clip.duration;
      this.action.play();
      this.updateMaterials();
      this.isModelLoaded = true;
      this.addGsapAnimation();
    });
  }

  update(deltaTime) {
    if (this.loadModel && this.mixer) {
      if (this.isLoopAnimation) {
        this.mixer.update(deltaTime);
      }
      const animationTime = this.action.time / this.clipDuration;
      const animationTimePercentage = animationTime.toFixed(2);
      if (animationTimePercentage == 0.3 && this.callAnimation) {
        this.setRandomColor(this.materialChair);
        this.callAnimation = false;
      } else if (
        animationTimePercentage >= 0.31 ||
        animationTimePercentage <= 0.29
      ) {
        this.callAnimation = true;
      }
    }
  }

  bind() {
    this.init = this.init.bind(this);
    this.update = this.update.bind(this);
    this.materialsCreation = this.materialsCreation.bind(this);
    this.loadModel = this.loadModel.bind(this);
    this.addGsapAnimation = this.addGsapAnimation.bind(this);
    this.gettingPropsInfo = this.gettingPropsInfo.bind(this);
    this.onScrollableChange = this.onScrollableChange.bind(this);
  }
}

const _instance = new ChairAnimation();
export default _instance;
