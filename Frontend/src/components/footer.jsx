// AppFooter.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import '../stylesheets/footerstyle.css';

export default function AppFooter() {
  return (
    <div className="footer-container">
      <Container fluid>
        <div className="footer-text">
          <p>&copy; 2023 Help Desk</p>
          <p>&copy;  helpdesk@hotmail.com</p>
          <p> +0201062127423</p>
        </div>
      </Container>
    </div>
  );
}