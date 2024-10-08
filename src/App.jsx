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
// import ReactGame from "./components/ReactGame/ReactGame";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    window.sessionStorage.getItem("Token") ? true : false
  );

  return (
    <>
      <header className="header">
        <h1>Dungeon Delve</h1>
      </header>
      <Router>
        <Navigation loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        <Routes>
          <Route path="/" element={<Home loggedIn={loggedIn} />} />
          <Route path="/game" element={<Game loggedIn={loggedIn} />} />
          {/* <Route path="/reactgame" element={<ReactGame loggedIn={loggedIn} />} /> */}
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
          <Route
            path="/registration"
            element={<Register setLoggedIn={setLoggedIn} />}
          />
          <Route path="/account" element={<Account loggedIn={loggedIn} />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <footer className="header">
        <h4>Created by: Scott Petty, James Pope, & Patrick Williams</h4>
      </footer>
    </>
  );
}

export default App;
