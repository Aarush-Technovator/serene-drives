export class Car {
    constructor(scene) {
        this.scene = scene;
        this.mesh = new THREE.Group();
        this.wheels = [];
        this.createCar();
        scene.add(this.mesh);
    }

    createCar() {
        // Car body
        const bodyGeometry = new THREE.BoxGeometry(3, 1, 6);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x3568d4 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1;
        body.castShadow = true;
        body.receiveShadow = true;
        this.mesh.add(body);

        // Car roof
        const roofGeometry = new THREE.BoxGeometry(2.5, 1, 2.5);
        const roofMaterial = new THREE.MeshPhongMaterial({ color: 0x3568d4 });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 2.2;
        roof.position.z = -0.5;
        roof.castShadow = true;
        roof.receiveShadow = true;
        this.mesh.add(roof);

        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
        const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });

        for (let i = 0; i < 4; i++) {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            
            if (i % 2 === 0) {
                wheel.position.x = 1.5;
            } else {
                wheel.position.x = -1.5;
            }
            
            if (i < 2) {
                wheel.position.z = 2;
            } else {
                wheel.position.z = -2;
            }
            
            wheel.position.y = 0.5;
            wheel.castShadow = true;
            this.mesh.add(wheel);
            this.wheels.push(wheel);
        }

        // Windshield
        const windshieldGeometry = new THREE.PlaneGeometry(2, 1);
        const windshieldMaterial = new THREE.MeshPhongMaterial({
            color: 0xa0d0ff,
            transparent: true,
            opacity: 0.5
        });
        const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
        windshield.position.y = 1.8;
        windshield.position.z = 0.5;
        windshield.rotation.x = Math.PI / 6;
        this.mesh.add(windshield);

        // Headlights
        const headlightGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const headlightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffcc });

        const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        leftHeadlight.position.set(1, 0.8, 3);
        this.mesh.add(leftHeadlight);

        const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        rightHeadlight.position.set(-1, 0.8, 3);
        this.mesh.add(rightHeadlight);

        // Position the car
        this.mesh.position.set(0, 2, 0);
    }

    update(delta) {
        // Rotate wheels based on speed
        const rotationSpeed = 2 * delta;
        this.wheels.forEach(wheel => {
            wheel.rotation.x += rotationSpeed;
        });
    }

    reset() {
        this.mesh.position.set(0, 2, 0);
        this.mesh.rotation.set(0, 0, 0);
    }
}