import { useEffect } from "react";

const Game = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/game.css";
    document.head.appendChild(link);

    fetch("/game.html")
      .then((response) => response.text())
      .then((data) => {
        const container = document.getElementById("game-container");
        container.innerHTML = data;

        // Dynamically load the JS file
        const script = document.createElement("script");
        script.src = "/game.js";
        script.async = true;
        container.appendChild(script);
      });
  }, []);

  return <div id="game-container" />;
};

export default Game;
