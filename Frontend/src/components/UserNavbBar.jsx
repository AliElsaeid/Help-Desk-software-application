    import React from 'react';
    import { Link } from 'react-router-dom';
    import { Navbar, Container, Nav, Offcanvas } from 'react-bootstrap';
    import logo from '../assets/dsasd.jpg';

    export default function AppNavBar() {
    return (
        <>
        {[false].map((expand) => (
            <Navbar key={expand} bg="dark" variant="dark" expand={expand} className="mb-3">
            <Container fluid>
                <Link to="/:id" className="navbar-brand">
                <img src={logo} alt="Logo" height="80" />
                </Link>
                <Navbar.Offcanvas
                id={`offcanvasNavbar-expand-${expand}`}
                aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                placement="end"
                >
                
                <Offcanvas.Body>
                    <Nav className="justify-content-end flex-grow-1 pe-3">
                    <Link to="/home" className="nav-link text-dark">
                        Home
                    </Link>
                    <Link to="/login" className="nav-link text-dark">
                         Logout 
                    </Link>
                    <Link to="/aboutUs" className="nav-link text-dark">
         About Us 
        </Link>
        <Link to="/contact" className="nav-link text-dark">
         Contact 
        </Link> 
                    </Nav>
                </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
            </Navbar>
        ))}
        </>
    );
    }
