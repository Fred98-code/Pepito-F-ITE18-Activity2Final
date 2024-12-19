import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 10;

const scene = new THREE.Scene();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

// Vibrant Blue Saturn (Adjusted Position)
const saturnGeometry = new THREE.SphereGeometry(2, 32, 32);
const saturnMaterial = new THREE.MeshStandardMaterial({
    color: 0x007bff, // Vibrant blue
    roughness: 0.7,
    metalness: 0.1,
});
const saturnMesh = new THREE.Mesh(saturnGeometry, saturnMaterial);
// Move Saturn to the center of the scene and tilt it horizontally
saturnMesh.position.set(0, -2, 0); 
saturnMesh.rotation.x = -Math.PI / 2; // Rotate 90 degrees on the X-axis
scene.add(saturnMesh);

// Scattered Vibrant Blue Dust Ring (Adjusted for Horizontal Saturn)
function createRing(radius, numParticles, opacity) {
    const ringGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);

    for (let i = 0; i < numParticles; i++) {
        const r = radius + Math.random() * 0.3;
        const angle = Math.random() * Math.PI * 2;
        const x = r * Math.cos(angle);
        const y = -2;
        const z = r * Math.sin(angle);

        positions.set([x, y, z], i * 3);
        const color = new THREE.Color(0x007bff);
        color.setHSL(0.6, 1, 0.5);
        colors.set(color.toArray(), i * 3);
    }

    ringGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    ringGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const ringMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: opacity,
    });

    return new THREE.Points(ringGeometry, ringMaterial);
}

const ring1 = createRing(2.3, 5000, 0.8); // Inner ring
const ring2 = createRing(3.0, 3000, 0.5); // Outer ring, less visible
const ring3 = createRing(3.7, 2000, 0.3); // Outermost ring, even less visible


scene.add(ring1);
scene.add(ring2);
scene.add(ring3);
// White Moons
const moonGeometry = new THREE.SphereGeometry(0.5, 32, 32); // Larger moons
const numMoons = 3;
const moons = [];
const moonOrbitalPeriods = [10, 20, 30];
const moonOrbitalRadii = [4, 5, 6];

for (let i = 0; i < numMoons; i++) {
    const moonMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff, // White
        emissive: 0xffffff, // Emissive for brightness
        emissiveIntensity: 0.8, // Increased intensity for brighter moons
        roughness: 0.2,
        metalness: 0.2,
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moons.push(moon);
    scene.add(moon);
}

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2); // Increased intensity
directionalLight.position.set(2, 5, 3);
scene.add(directionalLight);

const spotLight = new THREE.SpotLight(0xffd700, 0.7);
spotLight.position.set(-5, 5, -5);
spotLight.angle = Math.PI / 4;
spotLight.penumbra = 0.5;
scene.add(spotLight);

const ambientLight = new THREE.AmbientLight(0x444444); // Brighter ambient light
scene.add(ambientLight);

// Vibrant Stars (Golden Yellow and White)
const numStars = 1000;
const starsGeometry = new THREE.BufferGeometry();
const starPositions = new Float32Array(numStars * 3);
const starColors = new Float32Array(numStars * 3);

for (let i = 0; i < numStars; i++) {
    const x = (Math.random() - 0.5) * 200;
    const y = (Math.random() - 0.5) * 200;
    const z = (Math.random() - 0.5) * 200;

    starPositions.set([x, y, z], i * 3);

    // Randomly choose golden yellow or white color, with more saturation
    const color = Math.random() < 0.5 ? 0xffff00 : 0xffffff;
    const hue = color === 0xffff00 ? 0.15 : 0; // Adjust hue for golden yellow
    const saturation = 1; // Full saturation
    const lightness = 0.8; // Adjust lightness for brightness
    const starColor = new THREE.Color();
    starColor.setHSL(hue, saturation, lightness);
    starColors.set(starColor.toArray(), i * 3);
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
starsGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

const starMaterial = new THREE.PointsMaterial({
    size: 0.2, // Increased size
    vertexColors: true,
    transparent: true,
    opacity: 0.9, // Increased opacity
});

const starField = new THREE.Points(starsGeometry, starMaterial);
scene.add(starField);

function animate(time) {
    requestAnimationFrame(animate);
    const t = time / 1000;

    for (let i = 0; i < numMoons; i++) {
        const angle = 2 * Math.PI * (t / moonOrbitalPeriods[i]);
        const x = moonOrbitalRadii[i] * Math.cos(angle);
        const z = moonOrbitalRadii[i] * Math.sin(angle);
        moons[i].position.set(x, 0, z);
    }

    saturnMesh.rotation.y = t * 0.0001;
    renderer.render(scene, camera);
    controls.update();
}

animate();