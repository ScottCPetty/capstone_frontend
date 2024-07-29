import { useEffect, useState } from "react";
import { useAccountQuery, useUpdateUserMutation } from "./GameSlice";

const Game = () => {
  const [currentScore, setCurrentScore] = useState(0);
  const { data: userData, refetch } = useAccountQuery();
  const [updateUser] = useUpdateUserMutation();
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
      const newScore = event.detail.score;
      setCurrentScore(newScore);
    };
    window.addEventListener("scoreUpdated", handleScoreUpdate);
    return () => {
      window.removeEventListener("scoreUpdated", handleScoreUpdate);
    };
  }, []);
  useEffect(() => {
    if (userData && currentScore > userData.score) {
      console.log("Updating User Score:", {
        userId: userData.id,
        score: currentScore,
      });
      updateUser({ userId: userData.id, score: currentScore })
        .then(() => {
          // console.log('User score updated successfully');
          return refetch();
        })
        .catch((err) => console.error("Error updating user score:", err));
    }
  }, [currentScore, userData, updateUser, refetch]);
  // console.log(userData)
  return (
    <div>
      {userData ? (
        <h1>High Score: {userData.score}</h1>
      ) : (
        <h2>Log in or register to save your score and add it to the leaderboard.</h2>
      )}
      <h1>Current Score: {currentScore}</h1>
      <div id="game-container" />
    </div>
  );
};

export default Game;
