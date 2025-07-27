class ThemePreview {
    constructor() {
        this.canvas = document.getElementById('preview-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 300;
        this.canvas.height = 200;
        this.theme = 'jungle';
        this.backgroundElements = [];
        this.previewSnakeColor = '#00FF00';  // Default color
        this.previewSnake = [
            { x: 150, y: 50 },  // Head
            { x: 130, y: 50 },
            { x: 110, y: 50 },
            { x: 90, y: 50 },
            { x: 70, y: 50 }    // Tail
        ];
        
        // Initialize night mode
        this.initializeNightMode();
        
        this.setupEventListeners();
        this.generatePreview('jungle'); // Default theme
        
        // Set initial selection
        document.querySelector('.theme-btn.jungle').classList.add('selected');
        // Set initial color selection
        document.querySelector('.color-btn.green').style.border = '4px solid #ff00ff';
        // Set initial speed selection
        document.querySelector('.speed-btn.normal').classList.add('selected');
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

    setupEventListeners() {
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove previous selection
                document.querySelectorAll('.theme-btn').forEach(b => 
                    b.classList.remove('selected'));
                
                // Add selection to clicked button
                btn.classList.add('selected');
                
                // Update preview
                this.generatePreview(btn.dataset.theme);
            });
        });

        document.getElementById('play-btn').addEventListener('click', () => {
            // Get the selected color button (the one with the pink border)
            const selectedColorBtn = document.querySelector('.color-btn[style*="border: 4px solid rgb(255, 0, 255)"]');
            console.log('Selected button:', selectedColorBtn); // Debug
            console.log('All color buttons:', document.querySelectorAll('.color-btn')); // Debug
            
            let selectedColor;
            if (selectedColorBtn) {
                selectedColor = selectedColorBtn.dataset.color;
                console.log('Selected color from button:', selectedColor); // Debug
            } else {
                // If no button is selected, check which button has the pink border
                const buttons = document.querySelectorAll('.color-btn');
                for (let btn of buttons) {
                    if (window.getComputedStyle(btn).border.includes('255, 0, 255')) {
                        selectedColor = btn.dataset.color;
                        break;
                    }
                }
                selectedColor = selectedColor || '#00FF00'; // Fallback to green
            }
            
            const selectedTheme = document.querySelector('.theme-btn.selected')?.dataset.theme || 'jungle';
            
            // Get selected speed
            const selectedSpeed = document.querySelector('.speed-btn.selected')?.dataset.speed || '150';
            
            console.log('Final selected color:', selectedColor); // Debug
            console.log('URL being navigated to:', `game.html?color=${encodeURIComponent(selectedColor)}&theme=${encodeURIComponent(selectedTheme)}&speed=${encodeURIComponent(selectedSpeed)}`); // Debug
            
            // Navigate to game page with parameters including speed
            window.location.href = `game.html?color=${encodeURIComponent(selectedColor)}&theme=${encodeURIComponent(selectedTheme)}&speed=${encodeURIComponent(selectedSpeed)}`;
        });

        // Update color selection listener
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.color-btn').forEach(b => 
                    b.style.border = '4px solid #fff');
                btn.style.border = '4px solid #ff00ff';
                this.previewSnakeColor = btn.dataset.color;
                this.drawPreview();  // Redraw preview with new color
            });
        });

        // Add speed selection listener
        document.querySelectorAll('.speed-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove previous selection
                document.querySelectorAll('.speed-btn').forEach(b => 
                    b.classList.remove('selected'));
                
                // Add selection to clicked button
                btn.classList.add('selected');
            });
        });
    }

    generatePreview(theme) {
        this.theme = theme;
        this.backgroundElements = [];
        
        // Generate background elements based on theme
        switch(theme) {
            case 'jungle':
                this.generateJunglePreview();
                break;
            case 'desert':
                this.generateDesertPreview();
                break;
            case 'moon':
                this.generateMoonPreview();
                break;
        }
        
        this.drawPreview();
    }

    generateJunglePreview() {
        // Add trees
        for (let i = 0; i < 4; i++) {
            this.backgroundElements.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                type: 'tree'
            });
        }
        // Add bushes
        for (let i = 0; i < 6; i++) {
            this.backgroundElements.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                type: 'bush'
            });
        }
        // Add rocks
        for (let i = 0; i < 3; i++) {
            this.backgroundElements.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                type: 'rock',
                size: 3 + Math.random() * 5
            });
        }
    }

    generateDesertPreview() {
        // Add large cacti
        for (let i = 0; i < 3; i++) {
            this.backgroundElements.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                type: 'cactus',
                size: 'large'
            });
        }
        // Add small cacti
        for (let i = 0; i < 4; i++) {
            this.backgroundElements.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                type: 'cactus',
                size: 'small'
            });
        }
        // Add rocks
        for (let i = 0; i < 5; i++) {
            this.backgroundElements.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                type: 'rock',
                size: 2 + Math.random() * 4
            });
        }
    }

    generateMoonPreview() {
        // Add large craters
        for (let i = 0; i < 3; i++) {
            this.backgroundElements.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                type: 'crater',
                size: 15 + Math.random() * 15
            });
        }
        // Add small craters
        for (let i = 0; i < 6; i++) {
            this.backgroundElements.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                type: 'crater',
                size: 3 + Math.random() * 7
            });
        }
        // Add stars
        for (let i = 0; i < 25; i++) {
            this.backgroundElements.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                type: 'star'
            });
        }
    }

    getThemeBackground() {
        switch(this.theme) {
            case 'jungle': return '#0a2806';  // Darker green
            case 'desert': return '#3d2910';  // Darker brown
            case 'moon': return '#111215';    // Darker gray
            default: return '#000000';
        }
    }

    drawTree(x, y) {
        // Draw trunk
        this.ctx.fillStyle = '#4a3728';  // Brown color for trunk
        this.ctx.fillRect(x - 5, y, 10, 25);

        // Draw tree shadow
        this.ctx.fillStyle = '#1d3f1c';  // Darker green
        this.ctx.beginPath();
        this.ctx.moveTo(x - 15, y);
        this.ctx.lineTo(x + 15, y);
        this.ctx.lineTo(x, y - 30);
        this.ctx.fill();

        // Draw main foliage
        this.ctx.fillStyle = '#2d5a27';  // Main green
        this.ctx.beginPath();
        this.ctx.moveTo(x - 12, y);
        this.ctx.lineTo(x + 12, y);
        this.ctx.lineTo(x, y - 25);
        this.ctx.fill();

        // Draw highlight foliage
        this.ctx.fillStyle = '#3d7a37';  // Lighter green for highlight
        this.ctx.beginPath();
        this.ctx.moveTo(x - 6, y - 10);
        this.ctx.lineTo(x + 6, y - 10);
        this.ctx.lineTo(x, y - 20);
        this.ctx.fill();
    }

    drawCactus(x, y, size = 1) {
        const scale = size === 'small' ? 0.6 : 1;
        this.ctx.fillStyle = '#7a6a3a';  // Lighter brown
        // Main body
        this.ctx.fillRect(x - 5 * scale, y - 20 * scale, 10 * scale, 40 * scale);
        // Arms
        this.ctx.fillRect(x - 15 * scale, y - 15 * scale, 10 * scale, 8 * scale);
        this.ctx.fillRect(x + 5 * scale, y - 8 * scale, 10 * scale, 8 * scale);
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
        this.ctx.arc(x, y, 10, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw highlights
        this.ctx.fillStyle = '#3d7a37';
        this.ctx.beginPath();
        this.ctx.arc(x - 3, y - 3, 5, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawStar(x, y) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 1, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawCrater(x, y, size) {
        this.ctx.fillStyle = '#2a2a2a';  // Lighter gray
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fill();
        // Add depth effect
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.beginPath();
        this.ctx.arc(x + 2, y + 2, size - 2, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawPreviewSnake() {
        const blockSize = 15;  // Size of each snake segment
        
        this.previewSnake.forEach((segment, index) => {
            // Shadow
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            this.ctx.fillRect(
                segment.x + 2,
                segment.y + 2,
                blockSize,
                blockSize
            );

            // Main body
            this.ctx.fillStyle = this.previewSnakeColor;
            this.ctx.fillRect(
                segment.x,
                segment.y,
                blockSize,
                blockSize
            );

            // Highlight
            this.ctx.fillStyle = this.getLighterColor(this.previewSnakeColor);
            this.ctx.fillRect(
                segment.x + 2,
                segment.y + 2,
                blockSize/3,
                blockSize/3
            );

            // Draw eyes if it's the head
            if (index === 0) {
                this.ctx.fillStyle = '#000';
                const eyeSize = 2;
                
                // Right-facing eyes
                this.ctx.beginPath();
                this.ctx.arc(segment.x + blockSize * 0.7, segment.y + blockSize * 0.3, eyeSize, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.beginPath();
                this.ctx.arc(segment.x + blockSize * 0.7, segment.y + blockSize * 0.7, eyeSize, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
    }

    getLighterColor(color) {
        const r = parseInt(color.slice(1,3), 16);
        const g = parseInt(color.slice(3,5), 16);
        const b = parseInt(color.slice(5,7), 16);
        return `rgba(${Math.min(r + 50, 255)}, ${Math.min(g + 50, 255)}, ${Math.min(b + 50, 255)}, 0.8)`;
    }

    drawPreview() {
        // Clear canvas and draw background
        this.ctx.fillStyle = this.getThemeBackground();
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background elements
        this.drawBackgroundElements();

        // Draw preview snake
        this.drawPreviewSnake();
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
                        this.drawCactus(element.x, element.y, 'small');
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
}

// Initialize preview when page loads
window.addEventListener('load', () => {
    new ThemePreview();
}); 