document.addEventListener("DOMContentLoaded", () => {
  const userPortrait = localStorage.getItem("userPortrait");
  if (userPortrait) {
    const characterImage = document.getElementById("character-image");
    characterImage.src = userPortrait;
  }
});

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileSize = 25;
const tilesX = 25;
const tilesY = 25;
canvas.width = tilesX * tileSize;
canvas.height = tilesY * tileSize;

const playerCanvas = document.getElementById("playerCanvas");
const playerCtx = playerCanvas.getContext("2d");
playerCanvas.width = tilesX * tileSize;
playerCanvas.height = tilesY * tileSize;

const playerIcon = new Image();
playerIcon.src = "./warlord-helmet.png";

const bossIcon = new Image();
bossIcon.src = "./crowned-skull.png";

const exitIcon = new Image();
exitIcon.src = "./stairs-25.png";

let player = {
  x: 0,
  y: 0,
  lastX: 0,
  lastY: 0,
  hp: 100,
  maxHp: 100,
  xp: 0,
  level: 1,
  potions: 0,
  damageMin: 2,
  damageMax: 12,
  dodge: 0,
  savedPoints: 0,
  floor: 1,
  score: 0,
  boss: 1,
};
let currentEnemy = null;
let steps = 0;
let attackMade = false;

const enemyAttributes = {
  MiniGob: { xp: 5, hp: 15, damageMin: 1, damageMax: 6 },
  WizKid: { xp: 10, hp: 15, damageMin: 2, damageMax: 8 },
  Rat: { xp: 3, hp: 5, damageMin: 1, damageMax: 4 },
  Mongrel: { xp: 15, hp: 12, damageMin: 3, damageMax: 9 },
  Goblin: { xp: 20, hp: 34, damageMin: 4, damageMax: 9 },
  "Lil' Tommy": { xp: 25, hp: 16, damageMin: 5, damageMax: 12 },
};

let boss = {
  x: 20,
  y: 20,
  xp: 100,
  hp: 100,
  damageMin: 5,
  damageMax: 15,
  defeated: false,
  direction: 0,
  lastDirection: null,
};

const enemiesList = Object.keys(enemyAttributes);
let dungeonMap = [];
let entranceX, entranceY;

function drawWall(x, y) {
  ctx.fillStyle = "black";
  ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
}

function drawPlayer() {
  playerCtx.drawImage(playerIcon, player.x * tileSize, player.y * tileSize);
}

function drawBoss() {
  if (!boss.defeated) {
    playerCtx.drawImage(bossIcon, boss.x * tileSize, boss.y * tileSize);
  }
}

function generateDungeon() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dungeonMap = Array.from({ length: tilesX }, () => Array(tilesY).fill("wall"));
  generateMaze(player.x, player.y);
  placeEntrance();
  drawDungeon();
}

function drawDungeon() {
  playerCtx.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
  for (let x = 0; x < tilesX; x++) {
    for (let y = 0; y < tilesY; y++) {
      if (dungeonMap[x][y] === "floor") {
        // drawTile(x, y, "grey");
      } else {
        drawWall(x, y);
      }
    }
  }
  // drawTile(entranceX, entranceY, "yellow");
  playerCtx.drawImage(exitIcon, entranceX * tileSize, entranceY * tileSize);
}

function generateMaze(cx, cy) {
  const directions = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];

  shuffleArray(directions);

  dungeonMap[cx][cy] = "floor";

  for (const [dx, dy] of directions) {
    const nx = cx + dx * 2;
    const ny = cy + dy * 2;
    if (
      nx >= 0 &&
      nx < tilesX &&
      ny >= 0 &&
      ny < tilesY &&
      dungeonMap[nx][ny] === "wall"
    ) {
      dungeonMap[cx + dx][cy + dy] = "floor";
      dungeonMap[nx][ny] = "floor";
      generateMaze(nx, ny);
    }
  }
}

function placeEntrance() {
  let placed = false;
  while (!placed) {
    entranceX = Math.floor(Math.random() * tilesX);
    entranceY = Math.floor(Math.random() * tilesY);
    if (dungeonMap[entranceX][entranceY] === "floor") {
      placed = true;
    }
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function increaseStat(stat) {
  if (player.savedPoints > 0) {
    if (stat === "hp") {
      player.maxHp += 5;
      player.hp += 5;
    } else if (stat === "attack") {
      player.damageMin++;
      player.damageMax++;
    } else if (stat === "dodge") {
      player.dodge += 5;
    }
    player.savedPoints--;
    updateGameInfo();
    updateStatButtons();
  }
}

function updateStatButtons() {
  const buttons = document.querySelectorAll(".increase-stat-btn");
  buttons.forEach((button) => {
    if (player.savedPoints > 0) {
      button.classList.add("show");
    } else {
      button.classList.remove("show");
    }
  });
}

function updateGameInfo() {
  document.getElementById("current-hp").innerText = player.hp;
  document.getElementById("current-hp").className = "green-text";
  document.getElementById("max-hp").innerText = player.maxHp;
  document.getElementById("current-xp").innerText = player.xp;
  document.getElementById("current-xp").className = "yellow-text";
  document.getElementById("needed-xp").innerText = player.level * 50;
  document.getElementById("current-level").innerText = player.level;
  document.getElementById("current-potions").innerText = player.potions;
  document.getElementById(
    "attack-range"
  ).innerText = `${player.damageMin}-${player.damageMax}`;
  document.getElementById("dodge-chance").innerText = `${player.dodge}%`;
  document.getElementById("current-score").innerText = player.score;

  // Update HP bar
  const hpBar = document.getElementById("hp-bar");
  const hpPercent = (player.hp / player.maxHp) * 100;
  hpBar.style.width = `${hpPercent}%`;

  updateStatButtons();
}

function updateEnemyInfo() {
  if (currentEnemy) {
    const enemyImage = document.getElementById("enemy-image");
    document.getElementById("enemy-name").innerText =
      currentEnemy.name || "Boss";
    document.getElementById("enemy-hp").innerText = currentEnemy.hp;
    if (currentEnemy === boss) {
      enemyImage.src = "./assets/player-portraits/Jester.jpg";
    } else {
      enemyImage.src = `./assets/${currentEnemy.name}.jpg`;
    }
    enemyImage.classList.add("glow-red");
    enemyImage.style.display = "block";
  } else {
    const enemyImage = document.getElementById("enemy-image");
    document.getElementById("enemy-name").innerText = "None";
    document.getElementById("enemy-hp").innerText = "N/A";
    enemyImage.src = "./assets/dungeon3.jpg";
    enemyImage.classList.remove("glow-red");
    enemyImage.style.display = "block";
  }
}

function addCombatLog(message) {
  const log = document.getElementById("log");
  const entry = document.createElement("li");
  entry.textContent = message;

  if (attackMade) {
    entry.classList.add("new-attack-entry");
  } else {
    entry.classList.add("new-entry");
  }
  log.insertBefore(entry, log.firstChild);

  // Remove 'new-entry' and 'new-attack-entry' class from previous entries
  const entries = Array.from(log.children);
  for (let i = 1; i < entries.length; i++) {
    entries[i].classList.remove("new-entry");
    entries[i].classList.remove("new-attack-entry");
  }

  // Limit the log to 100 entries
  while (log.children.length > 100) {
    log.removeChild(log.lastChild);
  }

  attackMade = false;
}

function isAdjacent(x1, y1, x2, y2) {
  return (
    (x1 === x2 && Math.abs(y1 - y2) === 1) ||
    (y1 === y2 && Math.abs(x1 - x2) === 1)
  );
}

function movePlayer(dx, dy) {
  if (currentEnemy) return;
  let newX = player.x + dx;
  let newY = player.y + dy;
  if (
    newX >= 0 &&
    newX < tilesX &&
    newY >= 0 &&
    newY < tilesY &&
    dungeonMap[newX][newY] === "floor"
  ) {
    player.x = newX;
    player.y = newY;
    steps++;
    if (newX === entranceX && newY === entranceY) {
      addCombatLog(
        "You found the entrance to the next floor! Press E to leave this floor."
      );
    }
    if (isAdjacent(newX, newY, boss.x, boss.y) && !boss.defeated) {
      addCombatLog("You encountered the boss!");
      encounterBoss();
    } else {
      checkEncounter();
    }
    if (newX !== boss.x && newY !== boss.y) moveBoss();
    drawDungeon();
    drawPlayer();
    drawBoss();
    updateGameInfo();
  }
}

function nextFloor() {
  addCombatLog("You proceeded to the next floor.");
  player.xp += 50;
  player.floor++;
  updateGameInfo();
  player.x = 0;
  player.y = 0;
  generateDungeon();
  drawPlayer();
  boss = {
    x: 20,
    y: 20,
    xp: 100,
    hp: 100,
    damageMin: 5,
    damageMax: 15,
    defeated: false,
    direction: 0,
    lastDirection: null,
  };
  drawBoss();
  levelUpCheck();
  updateScore();
}

function encounterBoss() {
  currentEnemy = boss;
  updateEnemyInfo();
  addCombatLog(`Encountered the Boss with ${boss.hp} HP!`);
}

function attackBoss() {
  if (!currentEnemy) return;
  let playerDamage =
    Math.floor(Math.random() * (player.damageMax - player.damageMin + 1)) +
    player.damageMin;
  currentEnemy.hp -= playerDamage;
  addCombatLog(`You dealt ${playerDamage} damage to the Boss.`);
  attackMade = true;

  if (currentEnemy.hp <= 0) {
    player.xp += currentEnemy.xp;
    addCombatLog(`You defeated the Boss and gained ${currentEnemy.xp} XP!`);
    currentEnemy = null;
    boss.defeated = true;
    player.boss++;
    updateEnemyInfo();
    levelUpCheck();
    return;
  }

  let enemyDamage =
    Math.floor(
      Math.random() * (currentEnemy.damageMax - currentEnemy.damageMin + 1)
    ) + currentEnemy.damageMin;
  let dodgeChance = Math.random() * 100;
  if (dodgeChance < player.dodge) {
    addCombatLog(`You dodged the Boss's attack!`);
  } else {
    player.hp -= enemyDamage;
    addCombatLog(`The Boss dealt ${enemyDamage} damage to you.`);
  }

  if (player.hp <= 0) {
    alert("Game Over!");
    resetGame();
  }
  updateGameInfo();
  updateEnemyInfo();
}

function moveBoss() {
  if (boss.defeated) return;

  const directions = [
    [0, -1], // up
    [1, 0], // right
    [0, 1], // down
    [-1, 0], // left
  ];

  let triedDirections = [];

  while (triedDirections.length < 4) {
    let [dx, dy] = directions[boss.direction];
    let newX = boss.x + dx;
    let newY = boss.y + dy;

    if (
      newX >= 0 &&
      newX < tilesX &&
      newY >= 0 &&
      newY < tilesY &&
      dungeonMap[newX][newY] === "floor" &&
      (boss.lastDirection === null ||
        boss.direction !== (boss.lastDirection + 2) % 4)
    ) {
      boss.x = newX;
      boss.y = newY;
      boss.lastDirection = boss.direction;
      return;
    } else {
      triedDirections.push(boss.direction);
      boss.direction = (boss.direction + 1) % 4;
    }
  }

  // If all directions fail, backtrack
  if (triedDirections.length >= 4) {
    boss.direction = (boss.lastDirection + 2) % 4;
    let [dx, dy] = directions[boss.direction];
    let newX = boss.x + dx;
    let newY = boss.y + dy;
    if (
      newX >= 0 &&
      newX < tilesX &&
      newY >= 0 &&
      newY < tilesY &&
      dungeonMap[newX][newY] === "floor"
    ) {
      boss.x = newX;
      boss.y = newY;
      boss.lastDirection = boss.direction;
    }
  }
}

function checkEncounter() {
  if (steps >= 7 && steps <= 12) {
    let encounterChance = Math.random();
    if (encounterChance < 0.5) {
      encounterEnemy();
    } else {
      findPotion();
    }
    steps = 0;
  }
}

function encounterEnemy() {
  if (player.x !== entranceX && player.y !== entranceY) {
    const enemyType =
      enemiesList[Math.floor(Math.random() * enemiesList.length)];
    const attributes = enemyAttributes[enemyType];
    currentEnemy = {
      name: enemyType,
      hp: attributes.hp,
      damageMin: attributes.damageMin,
      damageMax: attributes.damageMax,
      xp: attributes.xp,
    };
    updateEnemyInfo();
    addCombatLog(
      `Encountered a ${currentEnemy.name} with ${currentEnemy.hp} HP!`
    );
  }
}

function findPotion() {
  player.potions++;
  addCombatLog("You found a potion!");
  updateGameInfo();
}

function usePotion() {
  if (player.potions > 0) {
    player.hp = Math.min(player.maxHp, player.hp + 20);
    player.potions--;
    updateGameInfo();
    addCombatLog("Used a potion and restored 20 HP.");
  } else {
    addCombatLog("You don't have any potions!");
  }
}

function attackEnemy() {
  if (!currentEnemy) return;
  let playerDamage =
    Math.floor(Math.random() * (player.damageMax - player.damageMin + 1)) +
    player.damageMin;
  currentEnemy.hp -= playerDamage;
  addCombatLog(`You dealt ${playerDamage} damage to the ${currentEnemy.name}.`);
  attackMade = true;

  if (currentEnemy.hp <= 0) {
    player.xp += currentEnemy.xp;
    addCombatLog(
      `You defeated the ${currentEnemy.name} and gained ${currentEnemy.xp} XP.`
    );
    if (Math.random() < 0.1) {
      if (Math.random() < 0.5) {
        player.potions++;
        addCombatLog("The enemy dropped a potion!");
      } else {
        player.xp += 10;
        addCombatLog(
          "The enemy dropped an experience potion and you gained 10 XP."
        );
      }
    }
    levelUpCheck();
    currentEnemy = null;
    updateEnemyInfo();
    return;
  }

  let enemyDamage =
    Math.floor(
      Math.random() * (currentEnemy.damageMax - currentEnemy.damageMin + 1)
    ) + currentEnemy.damageMin;
  let dodgeChance = Math.random() * 100;
  if (dodgeChance < player.dodge) {
    addCombatLog(`You dodged the ${currentEnemy.name}'s attack!`);
  } else {
    player.hp -= enemyDamage;
    addCombatLog(
      `The ${currentEnemy.name} dealt ${enemyDamage} damage to you.`
    );
  }

  if (player.hp <= 0) {
    alert("Game Over!");
    resetGame();
  }

  updateGameInfo();
  updateEnemyInfo();
}

function levelUpCheck() {
  const requiredXp = player.level * 50;
  if (player.xp >= requiredXp) {
    player.level++;
    player.xp -= requiredXp;
    updateScore();
    player.savedPoints++;
    updateGameInfo();
    levelUpCheck();
  }
}

function updateScore() {
  player.score = player.level * player.floor * player.boss * 10;
  document.getElementById("current-score").innerText = player.score;
  const event = new CustomEvent("scoreUpdated", {
    detail: { score: player.score },
  });
  window.dispatchEvent(event);
}

function resetGame() {
  player = {
    x: 0,
    y: 0,
    hp: 100,
    maxHp: 100,
    xp: 0,
    level: 1,
    potions: 0,
    damageMin: 2,
    damageMax: 12,
    dodge: 0,
  };
  currentEnemy = null;
  steps = 0;
  generateDungeon();
  drawPlayer();
  drawBoss();
  updateGameInfo();
  updateEnemyInfo();
  document.getElementById("log").innerHTML = "";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "w" || e.code === "ArrowUp") movePlayer(0, -1);
  if (e.key === "s" || e.code === "ArrowDown") movePlayer(0, 1);
  if (e.key === "a" || e.code === "ArrowLeft") movePlayer(-1, 0);
  if (e.key === "d" || e.code === "ArrowRight") movePlayer(1, 0);
  if (e.key === "r") usePotion();
  if (e.key === "e") {
    if (player.x === entranceX && player.y === entranceY) {
      nextFloor();
    } else if (currentEnemy === boss) {
      attackBoss();
    } else {
      attackEnemy();
    }
  }
});

generateDungeon();
drawPlayer();
drawBoss();
updateGameInfo();
updateEnemyInfo();
