const player = document.createElement("div");
player.id = "player";
const enemy = document.createElement("div");
enemy.id = "enemy";
const game = document.getElementById("game");
game.appendChild(player);
game.appendChild(enemy);

let playerX = 0;
let playerY = 0;
const playerSpeed = 32;

let enemyX = 0;
let enemyY = 0;
const enemySpeed = 2;

const maze = [
  "####################",
  "#P#   #   #        #",
  "# # # # # # # ## # #",
  "# # # # #      # # #",
  "# # # ### #  # # # #",
  "#   #   #      #   #",
  "## ## ### ###  #  ##",
  "#       #   # #    #",
  "# #### ## ### #### #",
  "#   #     #    #   #",
  "### # #  ## ## # ###",
  "#       #   #      #",
  "## ## # # # #  ### #",
  "#   # # # # #      #",
  "# # # # # # # #  ###",
  "# #   # # # # #    #",
  "# ##### # # # ## # #",
  "#       #        # #",
  "#       # #      #E#",
  "####################"
];

const tileSize = 32;

function createMaze() {
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === "#") {
        const wall = document.createElement("div");
        wall.className = "wall";
        wall.style.width = tileSize + "px";
        wall.style.height = tileSize + "px";
        wall.style.left = x * tileSize + "px";
        wall.style.top = y * tileSize + "px";
        game.appendChild(wall);
      } else if (maze[y][x] === "P") {
        playerX = x * tileSize;
        playerY = y * tileSize;
      } else if (maze[y][x] === "E") {
        enemyX = x * tileSize;
        enemyY = y * tileSize;
      }
    }
  }
}

function movePlayer(x, y) {
  const newX = playerX + x;
  const newY = playerY + y;

  if (isWalkable(newX, newY)) {
    playerX = newX;
    playerY = newY;

    player.style.left = playerX + "px";
    player.style.top = playerY + "px";
  }
}

function isWalkable(x, y) {
  const tileX = Math.floor(x / tileSize);
  const tileY = Math.floor(y / tileSize);

  if (tileX < 0 || tileX >= maze[0].length || tileY < 0 || tileY >= maze.length) {
    return false;
  }

  return maze[tileY][tileX] !== "#";
}

function moveEnemy() {
  const deltaX = playerX - enemyX;
  const deltaY = playerY - enemyY;

  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  if (distance > 0) {
    const moveX = (deltaX / distance) * enemySpeed;
    const moveY = (deltaY / distance) * enemySpeed;

    const newEnemyX = enemyX + moveX;
    const newEnemyY = enemyY + moveY;

    if (isWalkable(newEnemyX, enemyY)) {
      enemyX = newEnemyX;
    }
    if (isWalkable(enemyX, newEnemyY)) {
      enemyY = newEnemyY;
    }

    enemy.style.left = enemyX + "px";
    enemy.style.top = enemyY + "px";
  }
}

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      movePlayer(0, -playerSpeed);
      break;
    case "ArrowDown":
      movePlayer(0, playerSpeed);
      break;
    case "ArrowLeft":
      movePlayer(-playerSpeed, 0);
      break;
    case "ArrowRight":
      movePlayer(playerSpeed, 0);
      break;
  }
});

createMaze();
player.style.left = playerX + "px";
player.style.top = playerY + "px";

function gameLoop() {
  moveEnemy();

  requestAnimationFrame(gameLoop);
}

gameLoop();
