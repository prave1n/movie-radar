import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { clearuser } from "../store/userSlice";

function NavBar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const logoutHandler = ()=>{
    
    dispatch(
      clearuser()
    )
    localStorage.removeItem("persist:root");
    navigate("/")
  }
  return (
    <div>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="">MovieRadar</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href=""></Nav.Link>
          </Nav>
        </Container>
        <button onClick={logoutHandler} style={{marginLeft:"10px"}}>LogOut</button>
      </Navbar>
    </div>
  );
}

export default NavBar;
