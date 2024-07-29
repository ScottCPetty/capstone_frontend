import { useNavigate } from "react-router-dom";
import lilTommyImg from "../assets/lilTommy3.jpg";

const NotFound = () => {
  const navigate = useNavigate();

  const toHomeRedirect = () => {
    navigate("/");
  };

  return (
    <div className="background-container">
      <div className="section">
        <h1>404</h1>
        <h1>Page Not Found</h1>
        <img
          className="account-image"
          width={500}
          src={lilTommyImg}
          alt="Goblin"
        />
        <p>Looks like someone is lost...</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={toHomeRedirect}
        >
          Click Here to Return Home!
        </button>
      </div>
    </div>
  );
};

export default NotFound;
