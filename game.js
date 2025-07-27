class Snakonator {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.gridSize = 30;
        this.snake = [];
        this.food = {};
        this.direction = 'right';
        this.score = 0;
        this.gameLoop = null;

        // Get parameters from URL with debug logging
        const urlParams = new URLSearchParams(window.location.search);
        const colorParam = urlParams.get('color');
        console.log('Color from URL:', colorParam);
        
        // Validate the color format
        const isValidColor = colorParam && /^#[0-9A-F]{6}$/i.test(colorParam);
        this.snakeColor = isValidColor ? colorParam : '#00FF00';
        console.log('Final snake color:', this.snakeColor);
        
        this.theme = urlParams.get('theme') || 'jungle';
        
        console.log('Theme from URL:', this.theme);

        this.backgroundElements = [];
        
        // Get speed from URL parameters
        this.gameSpeed = parseInt(urlParams.get('speed')) || 150;
        console.log('Game speed:', this.gameSpeed);

        // Initialize night mode
        this.initializeNightMode();

        this.initializeGame();
        this.setupEventListeners();
        this.startGame();
    }

    initializeNightMode() {
        // Check if night mode preference is stored
        const isNightMode = localStorage.getItem('nightMode') === 'true';
        if (isNightMode) {
            document.body.classList.add('night-mode');
            document.getElementById('night-mode-btn').textContent = '☀️';
        }
        
        // Add night mode toggle functionality
        document.getElementById('night-mode-btn').addEventListener('click', () => {
            const body = document.body;
            const btn = document.getElementById('night-mode-btn');
            
            if (body.classList.contains('night-mode')) {
                body.classList.remove('night-mode');
                btn.textContent = '🌙';
                localStorage.setItem('nightMode', 'false');
            } else {
                body.classList.add('night-mode');
                btn.textContent = '☀️';
                localStorage.setItem('nightMode', 'true');
            }
        });
    }

    initializeGame() {
        // Initialize snake in the middle
        this.snake = [
            { x: 5, y: 5 },
            { x: 4, y: 5 },
            { x: 3, y: 5 }
        ];
        this.direction = 'right';  // Reset direction
        this.generateFood();
        this.generateBackgroundElements();  // Regenerate background
        this.score = 0;
        document.getElementById('score-value').textContent = this.score;
    }

    setupEventListeners() {
        // Restart button
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.initializeGame();
            this.startGame();
        });

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    if (this.direction !== 'down') this.direction = 'up';
                    break;
                case 'ArrowDown':
                    if (this.direction !== 'up') this.direction = 'down';
                    break;
                case 'ArrowLeft':
                    if (this.direction !== 'right') this.direction = 'left';
                    break;
                case 'ArrowRight':
                    if (this.direction !== 'left') this.direction = 'right';
                    break;
            }
        });
    }

    generateFood() {
        const x = Math.floor(Math.random() * (this.canvas.width / this.gridSize));
        const y = Math.floor(Math.random() * (this.canvas.height / this.gridSize));
        this.food = { x, y };
    }

    generateBackgroundElements() {
        this.backgroundElements = [];
        switch(this.theme) {
            case 'jungle':
                // Add trees
                for (let i = 0; i < 8; i++) {
                    this.backgroundElements.push({
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height,
                        type: 'tree'
                    });
                }
                // Add bushes
                for (let i = 0; i < 12; i++) {
                    this.backgroundElements.push({
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height,
                        type: 'bush'
                    });
                }
                // Add rocks
                for (let i = 0; i < 5; i++) {
                    this.backgroundElements.push({
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height,
                        type: 'rock',
                        size: 5 + Math.random() * 8
                    });
                }
                break;

            case 'desert':
                // Add large cacti
                for (let i = 0; i < 5; i++) {
                    this.backgroundElements.push({
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height,
                        type: 'cactus',
                        size: 'large'
                    });
                }
                // Add small cacti
                for (let i = 0; i < 8; i++) {
                    this.backgroundElements.push({
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height,
                        type: 'cactus',
                        size: 'small'
                    });
                }
                // Add rocks
                for (let i = 0; i < 10; i++) {
                    this.backgroundElements.push({
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height,
                        type: 'rock',
                        size: 4 + Math.random() * 6
                    });
                }
                break;

            case 'moon':
                // Add large craters
                for (let i = 0; i < 6; i++) {
                    this.backgroundElements.push({
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height,
                        type: 'crater',
                        size: 20 + Math.random() * 20
                    });
                }
                // Add small craters
                for (let i = 0; i < 12; i++) {
                    this.backgroundElements.push({
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height,
                        type: 'crater',
                        size: 5 + Math.random() * 10
                    });
                }
                // Add stars
                for (let i = 0; i < 50; i++) {
                    this.backgroundElements.push({
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height,
                        type: 'star'
                    });
                }
                break;
        }
    }

    getThemeBackground() {
        switch(this.theme) {
            case 'jungle': return '#0a2806';  // Darker green
            case 'desert': return '#3d2910';  // Darker brown
            case 'moon': return '#111215';    // Darker gray
        }
    }

    drawBackgroundElements() {
        this.backgroundElements.forEach(element => {
            switch(element.type) {
                case 'tree':
                    this.drawTree(element.x, element.y);
                    break;
                case 'bush':
                    this.drawBush(element.x, element.y);
                    break;
                case 'rock':
                    this.drawRock(element.x, element.y, element.size);
                    break;
                case 'cactus':
                    if (element.size === 'large') {
                        this.drawCactus(element.x, element.y);
                    } else {
                        this.drawCactus(element.x, element.y, 0.6); // Smaller cactus
                    }
                    break;
                case 'crater':
                    this.drawCrater(element.x, element.y, element.size);
                    break;
                case 'star':
                    this.drawStar(element.x, element.y);
                    break;
            }
        });
    }

    drawTree(x, y) {
        // Draw trunk
        this.ctx.fillStyle = '#4a3728';  // Brown color for trunk
        this.ctx.fillRect(x - 8, y, 16, 40);

        // Draw tree shadow
        this.ctx.fillStyle = '#1d3f1c';  // Darker green
        this.ctx.beginPath();
        this.ctx.moveTo(x - 25, y);
        this.ctx.lineTo(x + 25, y);
        this.ctx.lineTo(x, y - 45);
        this.ctx.fill();

        // Draw main foliage
        this.ctx.fillStyle = '#2d5a27';  // Main green
        this.ctx.beginPath();
        this.ctx.moveTo(x - 20, y);
        this.ctx.lineTo(x + 20, y);
        this.ctx.lineTo(x, y - 40);
        this.ctx.fill();

        // Draw highlight foliage
        this.ctx.fillStyle = '#3d7a37';  // Lighter green for highlight
        this.ctx.beginPath();
        this.ctx.moveTo(x - 10, y - 15);
        this.ctx.lineTo(x + 10, y - 15);
        this.ctx.lineTo(x, y - 35);
        this.ctx.fill();
    }

    drawCactus(x, y, size) {
        this.ctx.fillStyle = '#7a6a3a';  // Lighter brown
        // Main body
        this.ctx.fillRect(x - 7, y - 30, 14, 60);
        // Arms
        this.ctx.fillRect(x - 20, y - 20, 13, 10);
        this.ctx.fillRect(x + 7, y - 10, 13, 10);
    }

    drawCrater(x, y, size) {
        this.ctx.fillStyle = '#2a2a2a';  // Lighter gray
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fill();
        // Add depth effect
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.beginPath();
        this.ctx.arc(x + 5, y + 5, size - 5, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawApple(x, y) {
        // Draw apple body
        this.ctx.fillStyle = '#ff0000';
        this.ctx.beginPath();
        this.ctx.arc(
            x * this.gridSize + this.gridSize/2,
            y * this.gridSize + this.gridSize/2,
            this.gridSize/2 - 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();

        // Draw apple highlight
        this.ctx.fillStyle = '#ff6666';
        this.ctx.beginPath();
        this.ctx.arc(
            x * this.gridSize + this.gridSize/3,
            y * this.gridSize + this.gridSize/3,
            this.gridSize/6,
            0,
            Math.PI * 2
        );
        this.ctx.fill();

        // Draw stem
        this.ctx.fillStyle = '#553311';
        this.ctx.fillRect(
            x * this.gridSize + this.gridSize/2 - 2,
            y * this.gridSize + 2,
            4,
            6
        );
    }

    drawSnake(segment, isHead) {
        console.log('Drawing snake with color:', this.snakeColor);
        // Shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(
            segment.x * this.gridSize + 4,
            segment.y * this.gridSize + 4,
            this.gridSize - 2,
            this.gridSize - 2
        );

        // Main body
        this.ctx.fillStyle = this.snakeColor;
        this.ctx.fillRect(
            segment.x * this.gridSize,
            segment.y * this.gridSize,
            this.gridSize - 2,
            this.gridSize - 2
        );

        // Highlight
        this.ctx.fillStyle = this.getLighterColor(this.snakeColor);
        this.ctx.fillRect(
            segment.x * this.gridSize + 2,
            segment.y * this.gridSize + 2,
            this.gridSize/3,
            this.gridSize/3
        );

        // Draw face if it's the head
        if (isHead) {
            // Eyes
            this.ctx.fillStyle = '#000';
            const eyeSize = this.gridSize/6;
            
            // Position eyes based on direction
            let leftEyeX, leftEyeY, rightEyeX, rightEyeY;
            switch(this.direction) {
                case 'right':
                    leftEyeX = segment.x * this.gridSize + this.gridSize * 0.7;
                    leftEyeY = segment.y * this.gridSize + this.gridSize * 0.3;
                    rightEyeX = segment.x * this.gridSize + this.gridSize * 0.7;
                    rightEyeY = segment.y * this.gridSize + this.gridSize * 0.7;
                    break;
                case 'left':
                    leftEyeX = segment.x * this.gridSize + this.gridSize * 0.3;
                    leftEyeY = segment.y * this.gridSize + this.gridSize * 0.3;
                    rightEyeX = segment.x * this.gridSize + this.gridSize * 0.3;
                    rightEyeY = segment.y * this.gridSize + this.gridSize * 0.7;
                    break;
                case 'up':
                    leftEyeX = segment.x * this.gridSize + this.gridSize * 0.3;
                    leftEyeY = segment.y * this.gridSize + this.gridSize * 0.3;
                    rightEyeX = segment.x * this.gridSize + this.gridSize * 0.7;
                    rightEyeY = segment.y * this.gridSize + this.gridSize * 0.3;
                    break;
                case 'down':
                    leftEyeX = segment.x * this.gridSize + this.gridSize * 0.3;
                    leftEyeY = segment.y * this.gridSize + this.gridSize * 0.7;
                    rightEyeX = segment.x * this.gridSize + this.gridSize * 0.7;
                    rightEyeY = segment.y * this.gridSize + this.gridSize * 0.7;
                    break;
            }
            
            this.ctx.beginPath();
            this.ctx.arc(leftEyeX, leftEyeY, eyeSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(rightEyeX, rightEyeY, eyeSize, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = this.getThemeBackground();
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background elements
        this.drawBackgroundElements();

        // Draw snake
        this.snake.forEach((segment, index) => {
            this.drawSnake(segment, index === 0);
        });

        // Draw food as apple
        this.drawApple(this.food.x, this.food.y);
    }

    getLighterColor(color) {
        // Helper function to create highlight color
        const r = parseInt(color.slice(1,3), 16);
        const g = parseInt(color.slice(3,5), 16);
        const b = parseInt(color.slice(5,7), 16);
        return `rgba(${Math.min(r + 50, 255)}, ${Math.min(g + 50, 255)}, ${Math.min(b + 50, 255)}, 0.8)`;
    }

    move() {
        const head = { ...this.snake[0] };

        switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Check collision with walls
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
            this.gameOver();
            return;
        }

        // Check collision with self
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        // Check if food is eaten
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            document.getElementById('score-value').textContent = this.score;
            this.generateFood();
        } else {
            this.snake.pop();
        }
    }

    gameOver() {
        clearInterval(this.gameLoop);
        alert(`Game Over! Score: ${this.score}`);
    }

    startGame() {
        clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => {
            this.move();
            this.draw();
        }, this.gameSpeed);
    }

    drawRock(x, y, size) {
        this.ctx.fillStyle = '#3a3a3a';
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add highlight
        this.ctx.fillStyle = '#4a4a4a';
        this.ctx.beginPath();
        this.ctx.arc(x - size/3, y - size/3, size/2, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawBush(x, y) {
        // Draw main bush
        this.ctx.fillStyle = '#2d5a27';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 15, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw highlights
        this.ctx.fillStyle = '#3d7a37';
        this.ctx.beginPath();
        this.ctx.arc(x - 5, y - 5, 8, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawStar(x, y) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 1, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

// Initialize game when the page loads
window.addEventListener('load', () => {
    new Snakonator();
}); 