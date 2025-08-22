import { Car } from './car.js';
import { Environment } from './environment.js';
import { Physics } from './physics.js';
import { UI } from './ui.js';

// Game state
const gameState = {
    speed: 0,
    loading: true,
    loadingProgress: 0,
    cameraMode: 0,
    timeOfDay: 0.3,
    fogDensity: 0.02,
    weather: 0,
    isDriving: false
};

// Main Three.js variables
let scene, camera, renderer, controls;
let car, environment, physics, ui;
let clock = new THREE.Clock();

// Initialize the game
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x071c36);
    scene.fog = new THREE.FogExp2(0x0c1e3e, gameState.fogDensity);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    // Initialize modules
    environment = new Environment(scene);
    car = new Car(scene);
    physics = new Physics(car, environment, gameState);
    ui = new UI(gameState);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xfffaf0, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.far = 200;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // Add hemisphere light for more natural ambient
    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);
    scene.add(hemisphereLight);
    
    // Add orbit controls for debugging
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enabled = false;
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Add keyboard controls
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Setup UI controls
    document.getElementById('time-of-day').addEventListener('input', e => {
        gameState.timeOfDay = e.target.value / 100;
        environment.updateTimeOfDay(gameState.timeOfDay, scene);
    });
    
    document.getElementById('fog-density').addEventListener('input', e => {
        gameState.fogDensity = e.target.value / 1000;
        scene.fog.density = gameState.fogDensity;
    });
    
    document.getElementById('weather').addEventListener('input', e => {
        gameState.weather = e.target.value / 100;
        environment.updateWeather(gameState.weather);
    });
    
    // Start the animation loop
    animate();
    
    // Simulate loading process
    simulateLoading();
    
    // Add particles to background
    createParticles();
}

function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${15 + Math.random() * 10}s`;
        
        particlesContainer.appendChild(particle);
    }
}

function handleKeyDown(event) {
    switch(event.key) {
        case 'w':
        case 'W':
            physics.accelerate(1);
            break;
        case 's':
        case 'S':
            physics.accelerate(-1);
            break;
        case 'a':
        case 'A':
            physics.steer(-1);
            break;
        case 'd':
        case 'D':
            physics.steer(1);
            break;
        case ' ':
            physics.setHandbrake(true);
            break;
        case 'c':
        case 'C':
            gameState.cameraMode = (gameState.cameraMode + 1) % 3;
            controls.enabled = (gameState.cameraMode === 2);
            break;
        case 'r':
        case 'R':
            car.reset();
            physics.reset();
            break;
    }
}

function handleKeyUp(event) {
    switch(event.key) {
        case 'w':
        case 'W':
        case 's':
        case 'S':
            physics.accelerate(0);
            break;
        case 'a':
        case 'A':
        case 'd':
        case 'D':
            physics.steer(0);
            break;
        case ' ':
            physics.setHandbrake(false);
            break;
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function simulateLoading() {
    const interval = setInterval(() => {
        gameState.loadingProgress += Math.random() * 10;
        document.getElementById('progress').style.width = `${gameState.loadingProgress}%`;
        
        if (gameState.loadingProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                document.querySelector('.loading-screen').style.opacity = 0;
                setTimeout(() => {
                    gameState.loading = false;
                    document.querySelector('.loading-screen').style.display = 'none';
                }, 1000);
            }, 500);
        }
    }, 200);
}

function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    
    if (!gameState.loading) {
        // Update physics
        physics.update(delta);
        
        // Update car visuals
        car.update(delta);
        
        // Update camera position based on mode
        updateCamera(delta);
        
        // Update UI
        ui.update();
    }
    
    renderer.render(scene, camera);
}

function updateCamera(delta) {
    switch(gameState.cameraMode) {
        case 0: // Follow camera
            const targetPosition = new THREE.Vector3();
            car.mesh.getWorldPosition(targetPosition);
            
            const cameraOffset = new THREE.Vector3(
                Math.sin(car.mesh.rotation.y) * 8,
                3,
                Math.cos(car.mesh.rotation.y) * 8
            );
            
            camera.position.lerp(targetPosition.clone().add(cameraOffset), 0.1);
            camera.lookAt(targetPosition.x, targetPosition.y + 1, targetPosition.z);
            break;
            
        case 1: // First-person camera
            const fpPosition = new THREE.Vector3();
            car.mesh.getWorldPosition(fpPosition);
            fpPosition.y += 1.5;
            camera.position.lerp(fpPosition, 0.2);
            camera.rotation.y = car.mesh.rotation.y;
            break;
            
        case 2: // Orbital camera (controlled by OrbitControls)
            // Controls are handled automatically by OrbitControls
            break;
    }
}

// Start the game when the document is loaded
document.addEventListener('DOMContentLoaded', init);