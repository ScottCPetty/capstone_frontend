import { useRef, useEffect } from "react";

const ReactGame = () => {
  const canvasRef = useRef(null);
  const tileSize = 25;
  const tilesX = 25;
  const tilesY = 25;
  let dungeonMap = [];
  let entranceX, entranceY;
  let player = {
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
    savedPoints: 0,
    floorsPassed: 0,
    score: 0,
  };

  const enemyAttributes = {
    MiniGob: { xp: 5, hp: 15, damageMin: 1, damageMax: 6 },
    WizKid: { xp: 10, hp: 15, damageMin: 2, damageMax: 8 },
    Rat: { xp: 3, hp: 5, damageMin: 1, damageMax: 4 },
    Mongrel: { xp: 15, hp: 12, damageMin: 3, damageMax: 9 },
    Goblin: { xp: 20, hp: 34, damageMin: 4, damageMax: 9 },
    "Lil' Tommy": { xp: 25, hp: 16, damageMin: 5, damageMax: 12 },
  };

  const enemiesList = Object.keys(enemyAttributes);

  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = tilesX * tileSize;
    canvas.height = tilesY * tileSize;

    const drawTile = (x, y, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    };

    const drawWall = (x, y) => {
      ctx.fillStyle = "black";
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    };

    const drawPlayer = () => {
      drawTile(player.x, player.y, "blue");
    };

    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };

    const generateMaze = (cx, cy) => {
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
    };

    const placeEntrance = () => {
      let placed = false;
      while (!placed) {
        entranceX = Math.floor(Math.random() * tilesX);
        entranceY = Math.floor(Math.random() * tilesY);
        if (dungeonMap[entranceX][entranceY] === "floor") {
          placed = true;
        }
      }
    };

    const generateDungeon = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dungeonMap = Array.from({ length: tilesX }, () =>
        Array(tilesY).fill("wall")
      );
      generateMaze(player.x, player.y);
      placeEntrance();
      drawDungeon();
    };

    const drawDungeon = () => {
      for (let x = 0; x < tilesX; x++) {
        for (let y = 0; y < tilesY; y++) {
          if (dungeonMap[x][y] === "floor") {
            drawTile(x, y, "grey");
          } else {
            drawWall(x, y);
          }
        }
      }
      drawTile(entranceX, entranceY, "yellow"); // Entrance to the next floor
    };

    generateDungeon();
  }, []);

  return (
    <div className="background-container">
      <div className="section">
        <canvas ref={canvasRef} style={{ border: "1px solid black" }} />{" "}
        <div id="sidebar">
          <div id="stats-window" style={{ border: "1px solid black" }}>
            <h3>Stats</h3>
            <div id="hp-bar">
            </div>
            <p>HP:</p>
            <p>Potions:</p>
            <p>XP:</p>
            <p>Level:</p>
            <p>Saved Points:</p>
            <p>Score:</p>
            <p>Attack:</p>
            <p>Dodge Chance:</p>
          </div>
          <div id="combat-log" style={{ border: "1px solid black" }}>
            <h3>Combat Log</h3>
            <ul id="log"></ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactGame;
