import React from "react";
import lilTommyImg from "../assets/lilTommy3.jpg";

const NotFound = () => {
  return (
    <div className="background-container">
      <div className="section">
        <h1>404</h1>
        <p>Looks like someone is lost...</p>
        <img width={200} src={lilTommyImg} alt="Goblin" />
      </div>
    </div>
  );
};

export default NotFound;
