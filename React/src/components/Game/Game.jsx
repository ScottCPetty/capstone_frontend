import { useEffect, useState } from "react";

const Game = () => {
  const [currentScore, setCurrentScore] = useState(0);

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
    const handleScoreUpdate = (event) => {
      setCurrentScore(event.detail.score);
    };
    window.addEventListener("scoreUpdated", handleScoreUpdate);
    return () => {
      window.removeEventListener("scoreUpdated", handleScoreUpdate);
    };
  }, []);

  return (
    <div>
      <h1>Current Score: {currentScore}</h1>
      <div id="game-container" />
    </div>
  );
};

export default Game;
