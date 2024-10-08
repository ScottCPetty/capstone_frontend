import { useEffect, useState, useCallback } from "react";
import { useGameQuery, useScoreMutation } from "./GameSlice";

const Game = () => {
  const [currentScore, setCurrentScore] = useState(0);
  const { data: userData, refetch } = useGameQuery();
  const [updateUser] = useScoreMutation();

  const handleScoreUpdate = useCallback(
    async (event) => {
      const newScore = event.detail.score;
      setCurrentScore(newScore);
      if (userData && newScore > userData.score) {
        try {
          await updateUser({ score: newScore }).unwrap();
          // console.log("High score updated!");
          await refetch();
        } catch (error) {
          console.error("Failed to update high score:", error);
        }
      }
    },
    [userData, updateUser, refetch]
  );

  useEffect(() => {
    fetch("/game_html.html")
      .then((response) => response.text())
      .then((data) => {
        const container = document.getElementById("game-container");
        container.innerHTML = data;
        const script = document.createElement("script");
        script.src = "/game_js.js";
        script.async = true;
        container.appendChild(script);
      });
  }, []);

  useEffect(() => {
    window.addEventListener("scoreUpdated", handleScoreUpdate);
    return () => {
      window.removeEventListener("scoreUpdated", handleScoreUpdate);
    };
  }, [handleScoreUpdate]);

  return (
    <div>
      <div className="game-header">
        {userData ? (
          <h1>High Score: {userData.score}</h1>
        ) : (
          <h2>
            Log in or register to save your score and add it to the leaderboard.
          </h2>
        )}
        <h1>Current Score: {currentScore}</h1>
      </div>
      <div className="background-container">
        <div className="section" id="game-container" />
      </div>
    </div>
  );
};

export default Game;
