import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import Stats from "stats.js";

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

const plusButton = document.getElementById("plus");
const minusButton = document.getElementById("minus");
const preLoader = document.getElementById("pre-loader");
const trianglesHtml = document.getElementById("triangles");
const load = document.getElementById("load");

let clonedModel1;
let clonedModel2;
let clonedModel3;

let model1Loaded = false;
let model2Loaded = false;
let model3Loaded = false;

function updatePreloaderVisibility() {
  preLoader.classList.toggle(
    "hidden",
    model1Loaded && model2Loaded && model3Loaded
  );
  preLoader.classList.toggle(
    "pre-loader",
    !(model1Loaded && model2Loaded && model3Loaded)
  );
}

let nextModelPosition = 0;

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(
  "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
  // "/draco/"
);

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load(
  "https://todor3d.com/portfolio/dubai-map/models/Dubai_Im_piece_1.glb",
  // "/models/Dubai_Im_piece_1.glb",

  (gltf) => {
    const model = gltf.scene.clone();
    scene.add(model);
    nextModelPosition += 20;
    clonedModel1 = model.clone();
    model1Loaded = true;
  },
  (p) => {
    console.log((p.loaded / 2886900) * 100);

    load.innerText = `${(p.loaded / 2886900) * 100}%`;
  }
);

gltfLoader.load(
  "https://todor3d.com/portfolio/dubai-map/models/Dubai_Im_piece_2.glb",
  // "/models/Dubai_Im_piece_2.glb",

  (gltf) => {
    const model = gltf.scene.clone();
    scene.add(model);
    nextModelPosition += 20;
    clonedModel2 = model.clone();
    model2Loaded = true;
  },
  (p) => {
    console.log((p.loaded / 3043028) * 100);
    load.innerText = `${(p.loaded / 3043028) * 100}%`;
  }
);

gltfLoader.load(
  "https://todor3d.com/portfolio/dubai-map/models/Dubai_Im.glb",
  // "/models/Dubai_Im.glb",

  (gltf) => {
    const model = gltf.scene.clone();
    scene.add(model);
    nextModelPosition += 20;
    clonedModel3 = model.clone();
    model3Loaded = true;
  },
  (p) => {
    console.log((p.loaded / 5644236) * 100);

    load.innerText = `${(p.loaded / 5644236) * 100}%`;
  }
);

function loadModel() {
  const newModel = [
    clonedModel1.clone(),
    clonedModel2.clone(),
    clonedModel3.clone(),
  ];
  newModel.forEach((model) => {
    model.position.x = nextModelPosition;
    scene.add(model);
  });
  nextModelPosition += 20;
}

function formatNumber(num) {
  return (num / 1000000).toFixed(1) + "M".toString();
}

function removeLastModel() {
  if (scene.children.length > 3) {
    const Model1 = scene.children[scene.children.length - 1];
    const Model2 = scene.children[scene.children.length - 2];
    const Model3 = scene.children[scene.children.length - 3];
    scene.remove(Model1);
    scene.remove(Model2);
    scene.remove(Model3);
    nextModelPosition -= 20;
  }
}

plusButton.addEventListener("click", loadModel);
minusButton.addEventListener("click", removeLastModel);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
scene.add(directionalLight);

directionalLight.intensity = 3;

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight1.position.set(1, 2, 2);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight2.position.set(-1, -2, -2);
scene.add(directionalLight2);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("orientationchange", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1400
);

camera.position.x = 1;
camera.position.y = 6;
camera.position.z = 6;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

let triangles = 0;

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const tick = () => {
  stats.begin();

  controls.update();
  updatePreloaderVisibility();

  if (scene.children.length) {
    triangles = renderer.info.render.triangles;
    trianglesHtml.textContent = `${formatNumber(triangles)} Triangles rendered`;
  }

  renderer.render(scene, camera);

  stats.end();

  window.requestAnimationFrame(tick);
};

tick();
