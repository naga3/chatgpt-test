const game = document.getElementById("game");
const player = document.getElementById("player");
const speed = 0.4;
const enemySpeed = 2;
const spawnInterval = 2000;

let startTime = Date.now(); // ゲーム開始時の時刻を記録
let elapsedTime = 0; // 経過時間（スコア）

let targetX = 0;
let targetY = 0;

// プレイヤーの初期位置を設定
currentX = (game.clientWidth / 2) - (player.offsetWidth / 2);
currentY = (game.clientHeight / 2) - (player.offsetHeight / 2);
player.style.left = currentX + "px";
player.style.top = currentY + "px";

game.addEventListener("mousemove", (event) => {
  const rect = game.getBoundingClientRect();
  targetX = event.clientX - rect.left - player.offsetWidth / 2;
  targetY = event.clientY - rect.top - player.offsetHeight / 2;
});

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function movePlayer() {
  let deltaX = targetX - currentX;
  let deltaY = targetY - currentY;
  let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  if (distance > 1) {
    let moveX = (deltaX * speed) * easeInOutQuad(speed);
    let moveY = (deltaY * speed) * easeInOutQuad(speed);
    currentX += moveX;
    currentY += moveY;
  } else {
    currentX = targetX;
    currentY = targetY;
  }

  player.style.left = currentX + "px";
  player.style.top = currentY + "px";
  requestAnimationFrame(movePlayer);
}

requestAnimationFrame(movePlayer);

const spawnDecreaseInterval = 50;
let currentSpawnInterval = spawnInterval;

function spawnEnemy() {
  const enemy = document.createElement("img");
  enemy.src = "enemy.png";
  enemy.className = "enemy";
  game.appendChild(enemy);

  const angle = Math.random() * Math.PI * 2;
  const x = (game.clientWidth / 2) + Math.cos(angle) * (game.clientWidth / 2);
  const y = (game.clientHeight / 2) + Math.sin(angle) * (game.clientHeight / 2);
  enemy.style.left = x + "px";
  enemy.style.top = y + "px";

  enemy.dataset.vx = -Math.cos(angle) * enemySpeed;
  enemy.dataset.vy = -Math.sin(angle) * enemySpeed;

  // スポーン間隔を短くする
  currentSpawnInterval = Math.max(currentSpawnInterval - spawnDecreaseInterval, 100);

  return enemy;
}

let spawnCounter = 0;

function updateSpawn() {
  spawnEnemy();

  // スポーン間隔をlog関数を使ってゆるやかに減らす
  currentSpawnInterval = Math.max(2000 / Math.log2(spawnCounter + 3), 100);

  spawnCounter++;
  setTimeout(updateSpawn, currentSpawnInterval);
}

updateSpawn();

function checkCollision(player, enemy) {
  const playerRect = player.getBoundingClientRect();
  const enemyRect = enemy.getBoundingClientRect();

  // 当たり判定の領域を狭くするためのオフセット値
  const offsetX = playerRect.width * 0.25;
  const offsetY = playerRect.height * 0.25;

  return (
    playerRect.left + offsetX < enemyRect.right &&
    playerRect.right - offsetX > enemyRect.left &&
    playerRect.top + offsetY < enemyRect.bottom &&
    playerRect.bottom - offsetY > enemyRect.top
  );
}

let isGameOver = false; // ゲームオーバーフラグを追加

function moveEnemies() {
  const enemies = document.getElementsByClassName("enemy");

  for (const enemy of enemies) {
    const x = parseFloat(enemy.style.left);
    const y = parseFloat(enemy.style.top);
    const vx = parseFloat(enemy.dataset.vx);
    const vy = parseFloat(enemy.dataset.vy);

    enemy.style.left = (x + vx) + "px";
    enemy.style.top = (y + vy) + "px";

    // 画面外に出た敵を削除
    if (x < -32 || x > game.clientWidth || y < -32 || y > game.clientHeight) {
      game.removeChild(enemy);
    }
  }

  // 敵とプレイヤーの衝突判定
  if (!isGameOver) {
    for (const enemy of enemies) {
      if (checkCollision(player, enemy)) {
        gameOver();
        break;
      }
    }
  }

  requestAnimationFrame(moveEnemies);
}

requestAnimationFrame(moveEnemies);

setInterval(spawnEnemy, spawnInterval);

function gameOver() {
  if (!isGameOver) {
    isGameOver = true;
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    alert(`Game Over\nScore: ${elapsedTime}`);
    location.reload();
  }
}
