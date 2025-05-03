
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const retryButton = document.getElementById("retryButton");
const scoreElement = document.getElementById("score");

const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [{ x: 10, y: 10 }];
let direction = null;
let food = { x: 5, y: 5 };
let score = 0;
let frameCount = 0;
let gameActive = true;

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = null;
  food = { x: 5, y: 5 };
  score = 0;
  gameActive = true;
  scoreElement.textContent = "Score: 0";
  retryButton.style.display = "none";
  draw();
}

function drawCell(x, y, color, glow) {
  ctx.fillStyle = color;
  ctx.shadowColor = glow || color;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.roundRect(x * gridSize, y * gridSize, gridSize, gridSize, 6);
  ctx.fill();
  ctx.shadowBlur = 0;
}

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Animate food glow
  const glow = `hsl(${(frameCount * 3) % 360}, 100%, 60%)`;
  drawCell(food.x, food.y, "red", glow);

  for (let i = 0; i < snake.length; i++) {
    drawCell(snake[i].x, snake[i].y, i === 0 ? "#00ff88" : "#00cc66");
  }
}

function update() {
  if (!direction || !gameActive) return;

  const head = { ...snake[0] };
  if (direction === "left") head.x--;
  if (direction === "right") head.x++;
  if (direction === "up") head.y--;
  if (direction === "down") head.y++;

  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    gameOver();
    return;
  }

  // Allow pass-through on self
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    document.getElementById("eatSound").play();
    score++;
    scoreElement.textContent = "Score: " + score;
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  } else {
    snake.pop();
  }
}

function loop() {
  frameCount++;
  if (frameCount % 7 === 0) {
    update();
    draw();
  }
  requestAnimationFrame(loop);
}

function gameOver() {
  gameActive = false;
  retryButton.style.display = "block";
}

document.addEventListener("keydown", (e) => {
  if (!direction) {
    loop();
  }

  const key = e.key.toLowerCase();
  if ((key === "arrowleft" || key === "a") && direction !== "right") direction = "left";
  else if ((key === "arrowright" || key === "d") && direction !== "left") direction = "right";
  else if ((key === "arrowup" || key === "w") && direction !== "down") direction = "up";
  else if ((key === "arrowdown" || key === "s") && direction !== "up") direction = "down";
});


retryButton.addEventListener("click", () => {
  resetGame();
  loopStarted = false;
});


// Initial draw
draw();


// Show touch controls on mobile
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
  document.getElementById("touchControls").style.display = "block";

  document.getElementById("upBtn").addEventListener("click", () => {
    if (direction !== "down") direction = "up";
    if (!loopStarted) loop();
    loopStarted = true;
  });
  document.getElementById("downBtn").addEventListener("click", () => {
    if (direction !== "up") direction = "down";
    if (!loopStarted) loop();
    loopStarted = true;
  });
  document.getElementById("leftBtn").addEventListener("click", () => {
    if (direction !== "right") direction = "left";
    if (!loopStarted) loop();
    loopStarted = true;
  });
  document.getElementById("rightBtn").addEventListener("click", () => {
    if (direction !== "left") direction = "right";
    if (!loopStarted) loop();
    loopStarted = true;
  });
}

let loopStarted = false;
