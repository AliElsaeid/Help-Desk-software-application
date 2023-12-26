import { Link } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../stylesheets/UserProfile.css";
import logo from '../assets/dsasd.jpg'; // Make sure the path to your logo is correct

export default function AppNavBar() {
  return (
    <>
      {[false].map((expand) => (
        <Navbar key={expand} bg="white" variant="white" expand={expand} className="mb-3">
          <Container fluid>
            <Link to="/user" className="navbar-brand">
              {/* <img src={".."} alt="Logo" height="80" /> */}
            </Link>
            <div className="wisdom-section text-center text-balck">
                  <p>PROVIDING SOLUTIONS AND SUPPORT WITH CARE AND EXPERTISE.</p>
                </div>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
            
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`} className="text-black">
                 ECS, Help Desk
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Link to="/user" className="nav-link text-black">Profile</Link>
                  <Link to="/purchaseticket" className="nav-link text-black">purchase Ticket</Link>
                  <Link to="/knowledgebase" className="nav-link text-black">Knowledge Base</Link>
                  <Link to="/login" className="nav-link text-black">Sign Out</Link>

                </Nav>
                
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </>
  );
}