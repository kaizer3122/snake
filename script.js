
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 32;
let snake = [{ x: 9 * box, y: 10 * box }];
let food = {
  x: Math.floor(Math.random() * 17 + 1) * box,
  y: Math.floor(Math.random() * 15 + 3) * box,
};
let direction = null;
let score = 0;
let frameCount = 0;
let loopStarted = false;

const retryButton = document.getElementById("retryButton");
const eatSound = document.getElementById("eatSound");

document.addEventListener("keydown", directionControl);
retryButton.addEventListener("click", () => {
  resetGame();
  loopStarted = false;
});

function directionControl(event) {
  if (event.key === "ArrowLeft" || event.key === "a") direction = "left";
  else if (event.key === "ArrowUp" || event.key === "w") direction = "up";
  else if (event.key === "ArrowRight" || event.key === "d") direction = "right";
  else if (event.key === "ArrowDown" || event.key === "s") direction = "down";
  if (!loopStarted) {
    loopStarted = true;
    drawGame();
  }
}

function resetGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = null;
  food = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box,
  };
  score = 0;
  retryButton.style.display = "none";
}

function drawGame() {
  if (!loopStarted) return;
  setTimeout(() => {
    requestAnimationFrame(drawGame);
  }, 1000 / 12); // 12 FPS for stable speed

  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw border
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, 19 * box, 19 * box);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#4CAF50" : "#8BC34A";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = "#33691E";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "#FF5722";
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 2.5, 0, Math.PI * 2);
  ctx.fill();

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "left") headX -= box;
  if (direction === "up") headY -= box;
  if (direction === "right") headX += box;
  if (direction === "down") headY += box;

  if (headX === food.x && headY === food.y) {
    score++;
    eatSound.play();
    food = {
      x: Math.floor(Math.random() * 17 + 1) * box,
      y: Math.floor(Math.random() * 15 + 3) * box,
    };
  } else {
    snake.pop();
  }

  const newHead = { x: headX, y: headY };
  if (
    headX < box ||
    headX >= 18 * box ||
    headY < 3 * box ||
    headY >= 18 * box
  ) {
    loopStarted = false;
    retryButton.style.display = "block";
    return;
  }

  snake.unshift(newHead);
}

if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
  document.getElementById("touchControls").style.display = "block";
  document.getElementById("upBtn").addEventListener("click", () => {
    if (direction !== "down") direction = "up";
    if (!loopStarted) { loopStarted = true; drawGame(); }
  });
  document.getElementById("downBtn").addEventListener("click", () => {
    if (direction !== "up") direction = "down";
    if (!loopStarted) { loopStarted = true; drawGame(); }
  });
  document.getElementById("leftBtn").addEventListener("click", () => {
    if (direction !== "right") direction = "left";
    if (!loopStarted) { loopStarted = true; drawGame(); }
  });
  document.getElementById("rightBtn").addEventListener("click", () => {
    if (direction !== "left") direction = "right";
    if (!loopStarted) { loopStarted = true; drawGame(); }
  });
}
