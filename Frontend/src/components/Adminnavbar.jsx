import React from 'react';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../assets/dsasd.jpg';
import "../stylesheets/AppNavBar.css";

export default function AppNavBar() {
  return (
    <Navbar expand="lg" className="bg-dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={logo} alt="Logo" height="60" /> {/* Adjust the height as needed */}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="Adminnavbar" />
        <Navbar.Collapse id="Adminnavbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="bold-text">Home</Nav.Link>
            <Nav.Link as={Link} to="/signout" className="bold-text">Signout</Nav.Link>
            <NavDropdown title="Admin Work" id="AdminDD">
              <NavDropdown.Item as={Link} to="/AssignAgent" className="bold-text">Assign Agent</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/AddArticle" className="bold-text">Add Article</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/MonitorChatRoom" className="bold-text">Monitor Chat Room</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
