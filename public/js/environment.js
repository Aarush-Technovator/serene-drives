export class Environment {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.createEnvironment();
        scene.add(this.group);
    }

    createEnvironment() {
        // Create ground
        const groundGeometry = new THREE.PlaneGeometry(500, 500);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2c4c2c,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.group.add(ground);

        // Add some hills
        const hillGeometry = new THREE.SphereGeometry(80, 32, 32);
        const hillMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x1c3c1c,
            roughness: 0.9,
            metalness: 0.1
        });

        for (let i = 0; i < 5; i++) {
            const hill = new THREE.Mesh(hillGeometry, hillMaterial);
            hill.position.set(
                Math.random() * 300 - 150,
                -30,
                Math.random() * 300 - 150
            );
            hill.scale.set(
                1,
                Math.random() * 0.5 + 0.3,
                1
            );
            hill.castShadow = true;
            hill.receiveShadow = true;
            this.group.add(hill);
        }

        // Add trees
        const treeTrunkGeometry = new THREE.CylinderGeometry(0.5, 1, 5, 8);
        const treeTrunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3520 });
        const treeCrownGeometry = new THREE.SphereGeometry(4, 8, 6);
        const treeCrownMaterial = new THREE.MeshStandardMaterial({ color: 0x2c5c2c });

        for (let i = 0; i < 100; i++) {
            const tree = new THREE.Group();
            
            const trunk = new THREE.Mesh(treeTrunkGeometry, treeTrunkMaterial);
            trunk.position.y = 2.5;
            trunk.castShadow = true;
            trunk.receiveShadow = true;
            
            const crown = new THREE.Mesh(treeCrownGeometry, treeCrownMaterial);
            crown.position.y = 6;
            crown.castShadow = true;
            crown.receiveShadow = true;
            
            tree.add(trunk, crown);
            
            tree.position.set(
                Math.random() * 400 - 200,
                0,
                Math.random() * 400 - 200
            );
            
            this.group.add(tree);
        }

        // Add a lake
        const lakeGeometry = new THREE.CircleGeometry(30, 32);
        const lakeMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a5c7a,
            roughness: 0.1,
            metalness: 0.9
        });
        const lake = new THREE.Mesh(lakeGeometry, lakeMaterial);
        lake.position.set(50, 0.1, -80);
        lake.rotation.x = -Math.PI / 2;
        this.group.add(lake);
    }

    updateTimeOfDay(time, scene) {
        // Update lighting based on time of day
        const directionalLight = scene.children.find(child => child instanceof THREE.DirectionalLight);
        const ambientLight = scene.children.find(child => child instanceof THREE.AmbientLight);
        const hemisphereLight = scene.children.find(child => child instanceof THREE.HemisphereLight);

        if (directionalLight) {
            directionalLight.intensity = 0.3 + time * 0.7;
            
            // Change light color based on time of day
            if (time < 0.3) {
                // Dawn/dusk - orange tint
                directionalLight.color.setHSL(0.09, 0.9, 0.6);
            } else if (time > 0.7) {
                // Midday - white light
                directionalLight.color.setHSL(0.1, 0.2, 0.9);
            } else {
                // Day - yellowish white
                directionalLight.color.setHSL(0.12, 0.5, 0.8);
            }
        }

        if (ambientLight) {
            ambientLight.intensity = 0.1 + time * 0.4;
        }

        if (hemisphereLight) {
            hemisphereLight.intensity = 0.3 + time * 0.5;
        }

        // Update sky color
        if (time < 0.3) {
            // Night to dawn
            scene.background = new THREE.Color(0x071c36);
            scene.fog.color = new THREE.Color(0x0c1e3e);
        } else if (time < 0.6) {
            // Day
            scene.background = new THREE.Color(0x87ceeb);
            scene.fog.color = new THREE.Color(0x87ceeb);
        } else {
            // Dusk to night
            scene.background = new THREE.Color(0x364982);
            scene.fog.color = new THREE.Color(0x364982);
        }
    }

    updateWeather(weather) {
        // This would be implemented to change weather effects
        console.log("Weather updated to:", weather);
    }
}