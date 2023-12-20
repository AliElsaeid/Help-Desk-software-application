import { Link } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';

import logo from '../assets/dsasd.jpg'; // Make sure the path to your logo is correct

export default function AppNavBar() {
  return (
    <>
      {[false].map((expand) => (
        <Navbar key={expand} bg="dark" variant="dark" expand={expand} className="mb-3">
          <Container fluid>
            <Link to="/profile" className="navbar-brand">
              <img src={logo} alt="Logo" height="80" />
            </Link>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`} className="text-dark">
                  Help Desk
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Link to="/profile" className="nav-link text-dark">Home</Link>
                  <Link to="/login" className="nav-link text-dark">Sign Out</Link>
                  <NavDropdown title="functionalties" id={`offcanvasNavbarDropdown-expand-${expand}`} className="text-dark">
                    <Link to="/profile/chatRooms" className="dropdown-item text-dark">Chat Rooms</Link>
                    <Link to="/action4" className="dropdown-item text-dark">Another action</Link>
                    <NavDropdown.Divider />
                    <Link to="/action5" className="dropdown-item text-dark">Something else here</Link>
                  </NavDropdown>
                </Nav>
               
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </>
  );
}