import './style.css'

import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { BooleanKeyframeTrack, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as POSTPROCESSING from 'postprocessing';

const IMGPATH = '';
const SEGMENTSIZE = 32;

var debug = false;

// needs a scene, a camera and a renderer
// Scene = Container
var scene = new THREE.Scene();

// Camera = Viewpoint
var camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 0.1, 5000);

var renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('bg'),
})
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setX(-10.5);
camera.position.setZ(-18);

// renderer.render(scene, camera);


// // TORUS
// // geometry can have many default shapes
// var geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// // material is material of geometry
// // MeshBasicMaterial doesnt need light
// var material = new THREE.MeshStandardMaterial({color: 0xF2792F});
// // mesh combines both geometry and material
// var torus = new THREE.Mesh(geometry, material);

// scene.add(torus);

// SPACE
var spaceTexture = new THREE.TextureLoader().load(IMGPATH + 'milky-way.jpg');

var space = new THREE.Mesh(
  new THREE.SphereGeometry(1000, SEGMENTSIZE, SEGMENTSIZE), 
  new THREE.MeshStandardMaterial({
    map: spaceTexture,
    side: THREE.DoubleSide
  })
);

// MOON
var moonTexture = new THREE.TextureLoader().load(IMGPATH + 'moon.jpg');
// depth
var moonNormalTexture = new THREE.TextureLoader().load(IMGPATH + 'moon-normal.jpg');

var moon = new THREE.Mesh(
  new THREE.SphereGeometry(1, SEGMENTSIZE, SEGMENTSIZE), 
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: moonNormalTexture
  })
)
moon.castShadow = true; 
moon.receiveShadow = true; 

moon.position.set(-5,0,-2);

// EARTH
var earthTexture = new THREE.TextureLoader().load(IMGPATH + 'earth.jpg');
var earthBumpTexture = new THREE.TextureLoader().load(IMGPATH + 'earth-bump.jpg');
var earthSpecTexture = new THREE.TextureLoader().load(IMGPATH + 'earth-specular.jpg');

var earth = new THREE.Mesh(
  new THREE.SphereGeometry(4, SEGMENTSIZE, SEGMENTSIZE),
  new THREE.MeshStandardMaterial({
    map: earthTexture, 
    bumpMap: earthBumpTexture,
    bumpScale: 0.05,
    specularMap: earthSpecTexture,
    specular: new THREE.Color('grey')
  })
)
earth.castShadow = true; 
earth.receiveShadow = true; 

var cloudsTexture = new THREE.TextureLoader().load(IMGPATH + 'earth-clouds.png');
var clouds = new THREE.Mesh(
  new THREE.SphereGeometry(4.02, SEGMENTSIZE, SEGMENTSIZE),
  new THREE.MeshPhongMaterial({
    map: cloudsTexture,
    transparent: true
  })
);

earth.position.set(-6,0,-2);
clouds.position.set(-6,0,-2);

scene.add(space, moon, earth, clouds);


// SUN
var sunLight = new THREE.DirectionalLight(0xFFFFB1, 2);
sunLight.position.set(-50,0,-37);
sunLight.castShadow = true;

var nightLight = new THREE.DirectionalLight(0xFFFFB1, 0.2);
nightLight.position.set(-5,0,10);
nightLight.castShadow = true;

var sunTexture = new THREE.TextureLoader().load(IMGPATH + 'sun.jpg');

var sun = new THREE.Mesh(
  new THREE.SphereGeometry(25, SEGMENTSIZE, SEGMENTSIZE),
  new THREE.MeshBasicMaterial({
    map: sunTexture,
  })
  // new THREE.MeshBasicMaterial({color: 0xffccaa})
);

sun.scale.setX(1.1);
sun.position.set(-75,0,-50);

scene.add(sun, sunLight, nightLight);

let godraysEffect = new POSTPROCESSING.GodRaysEffect(camera, sun, {
  resolutionScale: 1,
  density: 0.8,
  decay: 0.95,
  weight: 0.9,
  samples: 100,
  exposure: 0.25
});

let renderPass = new POSTPROCESSING.RenderPass(scene, camera);
let effectPass = new POSTPROCESSING.EffectPass(camera,godraysEffect);
effectPass.renderToScreen = true;

let composer = new POSTPROCESSING.EffectComposer(renderer);
composer.addPass(renderPass);
composer.addPass(effectPass);


// TEXT
var loader = new FontLoader();
loader.load('Open_Sans_Bold.json', function (font) {
  var textGeometry = new TextGeometry('Hi!\nWelcome to my\nfirst three.js project.\nClick and drag with\nthe mouse to look around.\nScroll to zoom!', {
    font: font,
    size: 0.3,
    height: 0.1,
  });

  var text = new THREE.Mesh(
    textGeometry, 
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
    })
  );

  scene.add(text);
  text.position.set(0,1.5,-12);
  // text.rotation.x = (-5 * Math.PI/180);
  text.rotation.y = (230 * Math.PI/180);
});   



// listen to dom events on the mouse and update camera position
var controls = new OrbitControls(camera, renderer.domElement);
controls.rotateSpeed = 0.1;
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 12;
controls.maxDistance = 40;


if (debug) {
  // like a floodlight, no need position
  var ambientLight = new THREE.AmbientLight(0xfae4b9);

  // helper to show where light is coming from
  var lightHelper1 = new THREE.PointLightHelper(sunLight);
  var lightHelper2 = new THREE.PointLightHelper(nightLight);
  // grid for 3d perspective
  var gridHelper = new THREE.GridHelper(200,50);
  scene.add(lightHelper1, gridHelper, lightHelper2);
}

function addStar() {
  var geometry = new THREE.SphereGeometry(0.1, 24, 24);
  var material = new THREE.MeshStandardMaterial({color:0xffffff});
  var star = new THREE.Mesh(geometry, material);

  // generates number between -100 to 100
  var [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x,y,z);
  scene.add(star);
}

for (let i=0; i<50; i++) {
  addStar();
}



// can pass callback function if alot to load
// var spaceTexture = new THREE.TextureLoader().load(IMGPATH + 'space.jpg');
// scene.background = spaceTexture;


// moon orbit stuff
var r = 20;
var theta = 1.9;
var dTheta = 0.75 * Math.PI / 1000;

// need to render again to see object
// instead of calling over and over again, set up infinite loop
// to call render automatically
function animate() {
  // tells browser that want to perform animation
  // recursively calls itself as an infinite loop
  requestAnimationFrame(animate);

  // since its an infinite loop, adding degrees will produce animation
  // torus.rotation.x += 0.01;
  // torus.rotation.y += 0.005;
  // torus.rotation.z += 0.01;

  space.rotation.y += 0.0001;
  moon.rotation.y += 0.0005;
  earth.rotation.y += 0.0005;
  clouds.rotation.y += 0.0015;
  sun.rotation.y += 0.0005;

  //Increment theta, and update moon x and y
  //position based off new theta value        
  theta += dTheta;
  moon.position.x = r * Math.cos(theta);
  moon.position.z = r * Math.sin(theta);

  // earth.position.x += 0.001;

  // allow to update perspective control
  controls.update();

  composer.render(0.1);
  // renderer.render(scene,camera);
}

animate();