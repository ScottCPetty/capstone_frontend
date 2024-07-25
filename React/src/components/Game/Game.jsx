import { useEffect } from "react";

const Game = () => {
  useEffect(() => {
    fetch("/game.html")
      .then((response) => response.text())
      .then((data) => {
        const container = document.getElementById("game-container");
        container.innerHTML = data;

        const script = document.createElement("script");
        script.src = "/game.js";
        script.async = true;
        container.appendChild(script);

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/game.css";
        document.head.appendChild(link);
      });
  }, []);

  return <div id="game-container" />;
};

export default Game;
