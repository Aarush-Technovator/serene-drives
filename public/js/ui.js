export class UI {
    constructor(gameState) {
        this.gameState = gameState;
        this.initEventListeners();
    }

    initEventListeners() {
        // Environment controls
        document.getElementById('time-of-day').addEventListener('input', e => {
            this.gameState.timeOfDay = e.target.value / 100;
        });
        
        document.getElementById('fog-density').addEventListener('input', e => {
            this.gameState.fogDensity = e.target.value / 1000;
        });
        
        document.getElementById('weather').addEventListener('input', e => {
            this.gameState.weather = e.target.value / 100;
        });
    }

    update() {
        // Update speedometer
        document.querySelector('.speed-value').textContent = Math.abs(Math.round(this.gameState.speed * 3.6));
        
        // Update other UI elements as needed
    }
}