import React, { useRef, useEffect } from 'react';

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const tileSize = 25;
  const tilesX = 25;
  const tilesY = 25;
  let dungeonMap = [];
  let entranceX, entranceY;
  let player = {
    x: 0,
    y: 0,
    // other player attributes
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
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

    const generateRooms = (roomCount, minSize, maxSize) => {
      for (let i = 0; i < roomCount; i++) {
        let roomWidth = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
        let roomHeight = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
        let roomX = Math.floor(Math.random() * (tilesX - roomWidth));
        let roomY = Math.floor(Math.random() * (tilesY - roomHeight));

        if (isRoomOverlapping(roomX, roomY, roomWidth, roomHeight)) {
          i--; // Retry if the room overlaps
        } else {
          for (let x = roomX; x < roomX + roomWidth; x++) {
            for (let y = roomY; y < roomY + roomHeight; y++) {
              dungeonMap[x][y] = "floor";
            }
          }
        }
      }
    };

    const isRoomOverlapping = (roomX, roomY, roomWidth, roomHeight) => {
      for (let x = roomX - 1; x < roomX + roomWidth + 1; x++) {
        for (let y = roomY - 1; y < roomY + roomHeight + 1; y++) {
          if (x >= 0 && x < tilesX && y >= 0 && y < tilesY) {
            if (dungeonMap[x][y] === "floor") {
              return true;
            }
          }
        }
      }
      return false;
    };

    const connectRooms = () => {
      const floorTiles = [];
      for (let x = 0; x < tilesX; x++) {
        for (let y = 0; y < tilesY; y++) {
          if (dungeonMap[x][y] === "floor") {
            floorTiles.push({ x, y });
          }
        }
      }

      for (let i = 0; i < floorTiles.length - 1; i++) {
        const currentTile = floorTiles[i];
        const nextTile = floorTiles[i + 1];
        if (Math.random() < 0.5) {
          digCorridor(currentTile.x, currentTile.y, nextTile.x, currentTile.y);
          digCorridor(nextTile.x, currentTile.y, nextTile.x, nextTile.y);
        } else {
          digCorridor(currentTile.x, currentTile.y, currentTile.x, nextTile.y);
          digCorridor(currentTile.x, nextTile.y, nextTile.x, nextTile.y);
        }
      }
    };

    const digCorridor = (x1, y1, x2, y2) => {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);

      for (let x = minX; x <= maxX; x++) {
        dungeonMap[x][y1] = "floor";
      }
      for (let y = minY; y <= maxY; y++) {
        dungeonMap[x2][y] = "floor";
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

    const generateDungeon = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dungeonMap = Array.from({ length: tilesX }, () => Array(tilesY).fill("wall"));
      generateRooms(8, 4, 8); // Adjusted the room count or size to fill more space
      connectRooms();
      placeEntrance();
      drawDungeon();
      drawPlayer();
    };

    generateDungeon();
  }, []);

  return <canvas ref={canvasRef} />;
};

export default GameCanvas;
