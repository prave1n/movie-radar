import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearuser } from "../store/userSlice";
import { Link } from "react-router-dom";

function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler = () => {
    dispatch(clearuser());
    localStorage.removeItem("persist:root");
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/home">
            MovieRadar
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/profile">
              Profile
            </Nav.Link>
            <Nav.Link as={Link} to="/watchlist">
              Playlists
            </Nav.Link>
            <Nav.Link as={Link} to="/user/reviews">
              Reviews
            </Nav.Link>
            <Nav.Link as={Link} to="/friends">
              Friends List
            </Nav.Link>
          </Nav>
        </Container>
        <div>
          <button onClick={logoutHandler} className="btn btn-outline-light">
            Log Out
          </button>
        </div>
      </Navbar>
    </div>
  );
}

export default NavBar;
