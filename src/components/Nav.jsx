import { useAccountQuery } from "./Account/AccountSlice";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";

const Navigation = ({ loggedIn, setLoggedIn }) => {
  const navigate = useNavigate();
  const { data, isSuccess, refetch } = useAccountQuery();
  const [isAdmin, setAdmin] = useState(
    window.sessionStorage.getItem("isAdmin")
  );

  useEffect(() => {
    const fetchData = () => {
      if (isSuccess && data && loggedIn) {
        refetch();
        setAdmin(data.isAdmin);
      }
    };

    fetchData();
  }, [data, isSuccess, loggedIn, refetch]);

  const handleSignOut = () => {
    window.sessionStorage.removeItem("Token");
    window.sessionStorage.removeItem("isAdmin");
    setLoggedIn(false);
    navigate("/");
  };

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Toggle aria-controls="navbarNav" />
      <Navbar.Collapse id="navbarNav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/" className="nav-link">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/game" className="nav-link">
            Game
          </Nav.Link>
          {/* <Nav.Link as={Link} to="/reactgame" className="nav-link">
            React Game
          </Nav.Link> */}
          {isAdmin && loggedIn && (
            <Nav.Link as={Link} to="/admin" className="nav-link">
              Admin Panel
            </Nav.Link>
          )}
          {loggedIn ? (
            <>
              <Nav.Link as={Link} to="/account" className="nav-link">
                Account
              </Nav.Link>
              <Button
                variant="link"
                className="nav-link"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/login" className="nav-link">
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/registration" className="nav-link">
                Register
              </Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
