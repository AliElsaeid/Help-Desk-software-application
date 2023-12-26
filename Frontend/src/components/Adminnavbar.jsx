import React from 'react';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../assets/dsasd.jpg';
import '../stylesheets/Appnavbar.css'; // Import your CSS file
export default function AppNavBar() {
    return (
      <Navbar variant="dark" bg="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/admin">
            <img src={logo} alt="Logo" height="60" /> {/* Adjust the height as needed */}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-dark-example" />
          <Navbar.Collapse id="navbar-dark-example">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/admin" className="bold-light-text">Home</Nav.Link>
              <Nav.Link as={Link} to="/login" className="bold-light-text">Signout</Nav.Link>
              <NavDropdown title="Admin Work" id="nav-dropdown-dark-example"  menuVariant="dark">
                <NavDropdown.Item as={Link} to="/admin/AssignAgent" className="bold-text">Assign Agent</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/AddArticle" className="bold-text">Add Article</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/monitorchatroom" className="bold-text">Monitor Chat Room</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }