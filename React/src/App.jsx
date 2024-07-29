import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Navigate,
} from "react-router-dom";
import Navigation from "./components/Nav";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Account from "./components/Account/Account";
import Admin from "./components/Admin/Admin";
import Game from "./components/Game/Game";
import NotFound from "./components/NotFound";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    window.sessionStorage.getItem("Token") ? true : false
  );

  const [isAdmin, setAdmin] = useState(false);

  return (
    <>
      <div className="header">
        <h1>Dungeon Delve</h1>
      </div>
      <Router>
        <Navigation
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
          isAdmin={isAdmin}
          setAdmin={setAdmin}
        />
        <Routes>
          <Route path="/" element={<Home loggedIn={loggedIn} />} />
          <Route path="/game" element={<Game loggedIn={loggedIn} />} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
          <Route
            path="/registration"
            element={<Register setLoggedIn={setLoggedIn} />}
          />
          <Route
            path="/:username"
            element={
              <Account
                loggedIn={loggedIn}
                setAdmin={setAdmin}
                isAdmin={isAdmin}
              />
            }
          />
          <Route path="/admin" element={<Admin isAdmin={isAdmin} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
