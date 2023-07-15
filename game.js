document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("gameCanvas");
    const context = canvas.getContext("2d");

    // Submarine properties
    const submarineWidth = 120;
    const submarineHeight = 60;
    const submarineX = 100;
    let submarineY = canvas.height / 2;

    // Movement properties
    const gravity = 2;
    const submarineJump = -60;

    let submarineImage = new Image();
    submarineImage.src = "submarine.png"; // Replace with the path to your submarine image

    // Load submarine image
    submarineImage.onload = function() {
        render();
    };

    const oceanImage = new Image();
    oceanImage.src = "ocean-background.png"; // Replace with the path to your submarine image

    // Load submarine image
    oceanImage.onload = function() {
        render();
    };

    // Pipe properties
    const pipeWidth = 80;
    const pipeHeight = 150;
    const pipeGap = 300;
    const pipeSpeed = 3;
    let pipes = [];

    const pipeImage = new Image();
    pipeImage.src = "pipesImage.png";

    // Score
    let score = 0;

    // Add event listener for submarine jumps
    document.addEventListener("keydown", function(event) {
        if (event.code === "Space") {
            submarineJumpAction();
        }
    });

    // Main game loop
    function gameLoop() {
        update();
        render();
        requestAnimationFrame(gameLoop);
    }

    // Update game state
    function update() {
        // Update submarine position
        submarineY += gravity;

        // Generate new pipe
        if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - pipeGap) {
            const pipe = {
                x: canvas.width,
                y: Math.random() * (canvas.height - pipeHeight)
            };
            pipes.push(pipe);
        }

        // Move pipes
        pipes.forEach(function(pipe) {
            pipe.x -= pipeSpeed;

            // Check collision
            if (submarineX < pipe.x + pipeWidth &&
                submarineX + submarineWidth > pipe.x &&
                submarineY < pipe.y + pipeHeight &&
                submarineY + submarineHeight > pipe.y) {
                endGame();
            }

            // Update score
            if (pipe.x + pipeWidth < submarineX && !pipe.passed) {
                score++;
                pipe.passed = true;
            }
        });

        // Remove off-screen pipes
        if (pipes.length > 0 && pipes[0].x + pipeWidth < 0) {
            pipes.shift();
        }

        // Check collision with ocean boundaries
        if (submarineY + submarineHeight > canvas.height || submarineY < 0) {
            endGame();
        }
    }

    // Render game
    function render() {
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        const oceanPattern = context.createPattern(oceanImage, "repeat");
        context.fillStyle = oceanPattern;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Render ocean background
        context.drawImage(submarineImage, submarineX, submarineY, submarineWidth, submarineHeight);      

        // Render pipes
        pipes.forEach(function(pipe) {
            context.drawImage(pipeImage, pipe.x, pipe.y, pipeWidth, pipeHeight);
        });

        // Render score
        context.fillStyle = "#000000";
        context.font = "24px Arial";
        context.fillText("Score: " + score, 10, 30);
    }

    // Submarine jump action
    function submarineJumpAction() {
        submarineY += submarineJump;
    }

    // Function to reset submarine position
    function resetGame() {
        submarineY = canvas.height / 2;
        pipes = [];
        score = 0;
    }

    // Reload the page to reset the game
    function restartGame() {
        location.reload();
    }

    // Add event listener to reset game when the page is refreshed
    window.addEventListener("beforeunload", resetGame);

    function switchToExplosionImage() {
        let explosionImage = new Image();
        explosionImage.src = "explosion.png"; // Replace with the path to your explosion image
        explosionImage.onload = function() {
            submarineImage = explosionImage;
        };
    }

    // Add event listener for game over
    function endGame() {
        switchToExplosionImage();
        alert("Game Over! Your score is: " + score);
        restartGame();
    }

    // Start the game
    gameLoop();
});
