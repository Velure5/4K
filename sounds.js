const sounds = {
    eat: new Audio('sounds/eat.wav'),
    gameOver: new Audio('sounds/gameover.wav'),
    click: new Audio('sounds/click.wav')
};

// Update the playEatSound method in the Snakonator class
function playEatSound() {
    sounds.eat.currentTime = 0;
    sounds.eat.play();
} 