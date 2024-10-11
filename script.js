document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const scoreBoard = document.getElementById('scoreBoard');
    let score = 0;

    const ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 30,
        color: '#ff5733',
        speedX: 0,
        speedY: 0,
        rotation: 0, 
        rotationSpeed: 0, 
        moving: false
    };

    function getRandomSpeed(min, max) {
        return Math.random() * (max - min) + min;
    }

    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const clickX = (event.clientX - rect.left) * scaleX;
        const clickY = (event.clientY - rect.top) * scaleY;

        const distance = Math.sqrt((clickX - ball.x) ** 2 + (clickY - ball.y) ** 2);
        if (distance <= ball.radius) {
            const angle = Math.random() * 2 * Math.PI; 
            const speed = getRandomSpeed(3, 6); 
            ball.speedX = speed * Math.cos(angle);
            ball.speedY = speed * Math.sin(angle);
            ball.rotationSpeed = getRandomSpeed(-5, 5); 
            ball.moving = true;
            score += 1;
            updateScore();
        }
    });

    function updateScore() {
        scoreBoard.textContent = `Score: ${score}`;
    }

    function drawBall() {
        ctx.save();
        ctx.translate(ball.x, ball.y);
        ctx.rotate(ball.rotation * Math.PI / 180);
        ctx.beginPath();
        ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(ball.radius, 0);
        ctx.stroke();
        ctx.restore();
    }

    function updateBall() {
        if (ball.moving) {
            ball.x += ball.speedX;
            ball.y += ball.speedY;
            ball.rotation += ball.rotationSpeed;

            // Collision with right wall
            if (ball.x + ball.radius >= canvas.width) {
                ball.x = canvas.width - ball.radius;
                ball.speedX = -ball.speedX; 
            }

            // Collision with left wall
            if (ball.x - ball.radius <= 0) {
                ball.x = ball.radius; 
                ball.speedX = -ball.speedX; 
            }

            // Collision with top wall
            if (ball.y - ball.radius <= 0) {
                ball.y = ball.radius; 
                ball.speedY = -ball.speedY; 
            }

            // Collision with bottom wall
            if (ball.y + ball.radius >= canvas.height) {
                ball.y = canvas.height - ball.radius; 
                ball.speedY = -ball.speedY; 
            }

            const speedThreshold = 0.1;
            if (Math.abs(ball.speedX) < speedThreshold && Math.abs(ball.speedY) < speedThreshold) {
                ball.speedX = 0;
                ball.speedY = 0;
                ball.rotationSpeed = 0;
                ball.moving = false;
            }
        }
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function gameLoop() {
        clearCanvas();
        updateBall();
        drawBall();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
