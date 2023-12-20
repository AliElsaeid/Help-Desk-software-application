import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Col, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../stylesheets/purchaseTicket.css";

const backendUrl = "http://localhost:3000/api/v1/tickets/create";

const PurchaseTicket = () => {
  const navigate = useNavigate();
  const [ticketDetails, setTicketDetails] = useState({
    category: "",
    priority: "",
    subCategory: "",
    description: "",
  });
  const [message, setMessage] = useState("");

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setTicketDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");

      const response = await axios.post(
        backendUrl,
        {
          ...ticketDetails,
          userId: userId,
        },
        { withCredentials: true }
      );

      const { status, data } = response;

      if (status === 201) {
        setMessage("Ticket created successfully!");
        navigate(`/success`);
      }
    } catch (error) {
      setMessage(`Ticket creation failed: ${error.response?.data?.message}`);
    }
  };

  return (
    <div className="purchase-ticket-container">
      <h2 className="purchase-ticket-header">Purchase Tickets</h2>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="category">
            <Form.Label>Ticket Category</Form.Label>
            <Form.Control
              as="select"
              name="category"
              value={ticketDetails.category}
              onChange={handleOnChange}
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Network">Network</option>
            </Form.Control>
          </Form.Group>

          <Form.Group as={Col} controlId="subCategory">
            <Form.Label>Ticket Subcategory</Form.Label>
            <Form.Control
              as="select"
              name="subCategory"
              value={ticketDetails.subCategory}
              onChange={handleOnChange}
            >
              <option value="" disabled>
                Select Subcategory
              </option>
              {ticketDetails.category === "Hardware" && (
                <>
                  <option value="Desktops">Desktops</option>
                  <option value="Laptops">Laptops</option>
                  <option value="Printers">Printers</option>
                  <option value="Servers">Servers</option>
                  <option value="Networking equipment">Networking equipment</option>
                </>
              )}
              {ticketDetails.category === "Software" && (
                <>
                  <option value="Operating system">Operating system</option>
                  <option value="Application software">Application software</option>
                  <option value="Custom software">Custom software</option>
                  <option value="Integration issues">Integration issues</option>
                </>
              )}
              {ticketDetails.category === "Network" && (
                <>
                  <option value="Email issues">Email issues</option>
                  <option value="Internet connection problems">Internet connection problems</option>
                  <option value="Website errors">Website errors</option>
                </>
              )}
            </Form.Control>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="priority">
            <Form.Label>Priority</Form.Label>
            <Form.Control
              as="select"
              name="priority"
              value={ticketDetails.priority}
              onChange={handleOnChange}
            >
              <option value="" disabled>
                Select Priority
              </option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </Form.Control>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={ticketDetails.description}
              placeholder="Enter ticket description"
              onChange={handleOnChange}
            />
          </Form.Group>
        </Row>

        <Button variant="primary" type="submit">
          Create Ticket
        </Button>

        {message && <p>{message}</p>}

        <p>
          <br />
          <Link to="/">Back to Home</Link>
        </p>
      </Form>
    </div>
  );
};

export default PurchaseTicket;
