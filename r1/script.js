class WhackAMoleGame {
    constructor() {
        this.score = 0;
        this.timeRemaining = 30;
        this.gameActive = false;
        this.moleVisible = false;
        this.currentMole = null;
        this.moleTimers = [];
        this.scoreDisplay = document.getElementById('score');
        this.timerDisplay = document.getElementById('timer');
        this.startBtn = document.getElementById('startBtn');
        this.gameOverModal = document.getElementById('gameOverModal');
        this.finalScoreDisplay = document.getElementById('finalScore');
        this.restartBtn = document.getElementById('restartBtn');
        this.holes = document.querySelectorAll('.hole');
        this.initEventListeners();
    }
    initEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.restartBtn.addEventListener('click', () => this.startGame());
        this.holes.forEach(hole => {
            hole.addEventListener('click', (e) => this.handleHoleClick(e));
        });
    }
    startGame() {
        this.score = 0;
        this.timeRemaining = 30;
        this.gameActive = true;
        this.moleVisible = false;
        this.currentMole = null;
        this.clearAllMoles();
        this.clearAllTimers();
        this.updateScore();
        this.updateTimer();
        this.startBtn.disabled = true;
        this.gameOverModal.classList.remove('show');
        this.startTimer();
        this.startMoleSpawner();
    }
    startTimer() {
        const timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimer();
            if (this.timeRemaining <= 0) {
                clearInterval(timerInterval);
                this.endGame();
            }
        }, 1000);
        this.moleTimers.push(timerInterval);
    }
    startMoleSpawner() {
        const spawnMole = () => {
            if (!this.gameActive) return;
            this.showRandomMole();
            const nextSpawnDelay = Math.random() * 600 + 400;
            const spawnTimer = setTimeout(spawnMole, nextSpawnDelay);
            this.moleTimers.push(spawnTimer);
        };
        spawnMole();
    }
    showRandomMole() {
        if (!this.gameActive) return;
        if (this.currentMole) {
            this.currentMole.innerHTML = '';
        }
        const randomIndex = Math.floor(Math.random() * this.holes.length);
        const hole = this.holes[randomIndex];
        const mole = document.createElement('div');
        mole.className = 'mole';
        hole.innerHTML = '';
        hole.appendChild(mole);
        this.currentMole = hole;
        this.moleVisible = true;
        const hideTimer = setTimeout(() => {
            if (this.moleVisible && this.currentMole === hole) {
                hole.innerHTML = '';
                this.moleVisible = false;
                this.currentMole = null;
            }
        }, 800);
        this.moleTimers.push(hideTimer);
    }
    handleHoleClick(event) {
        if (!this.gameActive) return;
        const hole = event.currentTarget;
        if (hole.querySelector('.mole')) {
            hole.innerHTML = '';
            this.moleVisible = false;
            this.currentMole = null;
            this.score += 10;
            this.updateScore();
            this.showHitAnimation(hole);
        }
    }
    showHitAnimation(hole) {
        hole.style.animation = 'none';
        setTimeout(() => {
            hole.style.animation = '';
        }, 10);
    }
    updateScore() {
        this.scoreDisplay.textContent = this.score;
    }
    updateTimer() {
        this.timerDisplay.textContent = this.timeRemaining;
    }
    endGame() {
        this.gameActive = false;
        this.clearAllMoles();
        this.clearAllTimers();
        this.finalScoreDisplay.textContent = this.score;
        this.gameOverModal.classList.add('show');
        this.startBtn.disabled = false;
    }
    clearAllMoles() {
        this.holes.forEach(hole => {
            hole.innerHTML = '';
        });
        this.moleVisible = false;
        this.currentMole = null;
    }
    clearAllTimers() {
        this.moleTimers.forEach(timer => {
            clearTimeout(timer);
            clearInterval(timer);
        });
        this.moleTimers = [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WhackAMoleGame();
});