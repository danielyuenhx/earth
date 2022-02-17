import './style.css'

import * as THREE from 'three';
import { WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'



// needs a scene, a camera and a renderer
// Scene = Container
const scene = new THREE.Scene();

// Camera = Viewpoint
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('bg'),
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);



// geometry can have many default shapes
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// material is material of geometry
// MeshBasicMaterial doesnt need light
const material = new THREE.MeshStandardMaterial({color: 0xF2792F});
// mesh combines both geometry and material
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// like a lightbulb
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5,5,5);

// like a floodlight, no need position
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// helper to show where light is coming from
const lightHelper = new THREE.PointLightHelper(pointLight);
// grid for 3d perspective
const gridHelper = new THREE.GridHelper(200,50);
// scene.add(lightHelper, gridHelper);

// listen to dom events on the mouse and update camera position
const controls = new OrbitControls(camera, renderer.domElement);


function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color:0xffffff});
  const star = new THREE.Mesh(geometry, material);

  // generates number between -100 to 100
  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x,y,z);
  scene.add(star);
}

for (let i=0; i<200; i++) {
  addStar();
}


// need to render again to see object
// instead of calling over and over again, set up infinite loop
// to call render automatically
function animate() {
  // tells browser that want to perform animation
  // recursively calls itself as an infinite loop
  requestAnimationFrame(animate);

  // since its an infinite loop, adding degrees will produce animation
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  // allow to update perspective control
  controls.update();

  renderer.render(scene,camera);
}

animate();