export class Physics {
    constructor(car, environment, gameState) {
        this.car = car;
        this.environment = environment;
        this.gameState = gameState;
        this.speed = 0;
        this.acceleration = 0;
        this.steering = 0;
        this.handbrake = false;
        this.maxSpeed = 0.3;
        this.accelerationRate = 0.001;
        this.decelerationRate = 0.002;
        this.steeringRate = 0.03;
    }

    accelerate(direction) {
        this.acceleration = direction;
    }

    steer(direction) {
        this.steering = direction;
    }

    setHandbrake(value) {
        this.handbrake = value;
    }

    update(delta) {
        // Apply acceleration
        if (this.acceleration !== 0) {
            this.speed += this.acceleration * this.accelerationRate * delta * 60;
            
            // Limit speed
            if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
            if (this.speed < -this.maxSpeed / 2) this.speed = -this.maxSpeed / 2;
        } else {
            // Apply deceleration when not accelerating
            if (this.speed > 0) {
                this.speed -= this.decelerationRate * delta * 60;
                if (this.speed < 0) this.speed = 0;
            } else if (this.speed < 0) {
                this.speed += this.decelerationRate * delta * 60;
                if (this.speed > 0) this.speed = 0;
            }
        }

        // Apply handbrake deceleration
        if (this.handbrake && this.speed !== 0) {
            if (this.speed > 0) {
                this.speed -= this.decelerationRate * 3 * delta * 60;
                if (this.speed < 0) this.speed = 0;
            } else {
                this.speed += this.decelerationRate * 3 * delta * 60;
                if (this.speed > 0) this.speed = 0;
            }
        }

        // Move car
        this.car.mesh.translateZ(this.speed * delta * 60);

        // Apply steering if moving
        if (Math.abs(this.speed) > 0.01) {
            this.car.mesh.rotation.y += this.steering * this.steeringRate * (this.speed / this.maxSpeed) * delta * 60;
        }

        // Update game state
        this.gameState.speed = this.speed * 100;
    }

    reset() {
        this.speed = 0;
        this.acceleration = 0;
        this.steering = 0;
        this.handbrake = false;
    }
}