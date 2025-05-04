
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20;
const rows = canvas.height / box;
const cols = canvas.width / box;

let snake;
let direction;
let food;
let score = 0;
let running = false;

const retryButton = document.getElementById("retryButton");
const scoreDisplay = document.getElementById("score");
const eatSound = document.getElementById("eatSound");

function initGame() {
  snake = [{ x: 5, y: 5 }];
  direction = { x: 1, y: 0 };
  placeFood();
  score = 0;
  scoreDisplay.textContent = "Score: 0";
  retryButton.style.display = "none";
  running = true;
  gameLoop();
}

function placeFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
    };
  } while (snake.some(s => s.x === newFood.x && s.y === newFood.y));
  food = newFood;
}

function gameLoop() {
  if (!running) return;
  setTimeout(gameLoop, 100);

  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows ||
      snake.some(s => s.x === head.x && s.y === head.y)) {
    running = false;
    retryButton.style.display = "block";
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = "Score: " + score;
    eatSound.play();
    placeFood();
  } else {
    snake.pop();
  }

  drawGame();
}

function drawGame() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#0f0";
  for (let part of snake) {
    ctx.fillRect(part.x * box, part.y * box, box, box);
  }

  ctx.fillStyle = "red";
  ctx.fillRect(food.x * box, food.y * box, box, box);
}

document.addEventListener("keydown", (e) => {
  if (!running) return;
  if (e.key === "ArrowUp" && direction.y !== 1) direction = { x: 0, y: -1 };
  else if (e.key === "ArrowDown" && direction.y !== -1) direction = { x: 0, y: 1 };
  else if (e.key === "ArrowLeft" && direction.x !== 1) direction = { x: -1, y: 0 };
  else if (e.key === "ArrowRight" && direction.x !== -1) direction = { x: 1, y: 0 };
});

retryButton.addEventListener("click", initGame);

// Mobile touch controls
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
  document.getElementById("touchControls").style.display = "block";
  document.getElementById("upBtn").addEventListener("click", () => {
    if (direction.y !== 1) direction = { x: 0, y: -1 };
  });
  document.getElementById("downBtn").addEventListener("click", () => {
    if (direction.y !== -1) direction = { x: 0, y: 1 };
  });
  document.getElementById("leftBtn").addEventListener("click", () => {
    if (direction.x !== 1) direction = { x: -1, y: 0 };
  });
  document.getElementById("rightBtn").addEventListener("click", () => {
    if (direction.x !== -1) direction = { x: 1, y: 0 };
  });
}

initGame();
