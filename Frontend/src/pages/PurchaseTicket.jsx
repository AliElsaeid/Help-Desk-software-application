// PurchaseTicket.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useCookies } from "react-cookie";
import "../stylesheets/Purchase.css";
import UserNavbBar from '../components/UserNavbBar';


const backendUrl = "http://localhost:3000/api/v1/ticket/create";
const articleApiUrl = "http://localhost:3000/api/v1/article";
const createRoomApiUrl = "http://localhost:3000/api/v1/communication/createRoom";

const PurchaseTicket = () => {
  const navigate = useNavigate();
  const [ticketDetails, setTicketDetails] = useState({
    category: "",
    priority: "",
    subCategory: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  const [workflow, setWorkflow] = useState("");
  const [cookies] = useCookies(['token']);
  const [selectedFixOption, setSelectedFixOption] = useState("");

  const handleFixOptionChange = (e) => {
    setSelectedFixOption(e.target.value);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setTicketDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchWorkflow = async () => {
      try {
        const response = await axios.get(`${articleApiUrl}/workflows`, {
          params: { category: ticketDetails.category },
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${cookies.token}`
          }
        });

        const { data } = response;
        const workflowContent = data.map((article) => article.content).join("\n");
        setWorkflow(workflowContent);
      } catch (error) {
        console.error("Error fetching workflow:", error);
        setWorkflow("");
      }
    };

    if (ticketDetails.category) {
      fetchWorkflow();
    }
  }, [ticketDetails.category, cookies.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedDescription = ticketDetails.description;

      if (selectedFixOption === "integratedMails") {
        updatedDescription = "Solve with integrated mails. " + updatedDescription;
      }
      const response = await axios.post(
        backendUrl,
        {
          ...ticketDetails,
          description: updatedDescription,
        },
        { withCredentials: true }
      );

      const { status, data } = response;

      if (status === 201) {
        if (selectedFixOption === "chatRooms") {
          console.log(data.ticket._id);
          const createRoomResponse = await axios.post(
            createRoomApiUrl,
            {
              ticket_id: data.ticket._id,
            },
            {
              withCredentials: true,
              headers: {
                'Authorization': `Bearer ${cookies.token}`
              }
            }
          );
        }

        setMessage("Ticket created successfully!");
        navigate(`/user`);
      }
    } catch (error) {
      setMessage(`Ticket creation failed: ${error.response?.data?.message}`);
    }
  };

  return (
    <div className="purchase-ticket-container">
      <div className="navbar-top-right">
      <UserNavbBar />
</div>
      <div className="purchase-ticket-form">
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
                <option value="hardware">Hardware</option>
                <option value="software">Software</option>
                <option value="network">Network</option>
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
                {ticketDetails.category === "hardware" && (
                  <>
                    <option value="Desktops">Desktops</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Printers">Printers</option>
                    <option value="Servers">Servers</option>
                    <option value="Networking equipment">Networking equipment</option>
                  </>
                )}
                {ticketDetails.category === "software" && (
                  <>
                    <option value="Operating system">Operating system</option>
                    <option value="Application software">Application software</option>
                    <option value="Custom software">Custom software</option>
                    <option value="Integration issues">Integration issues</option>
                  </>
                )}
                {ticketDetails.category === "network" && (
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
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
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
          <div className="form-button-group">
          <p className="fix-options-title">Fix Options:</p>
  <label>
    <input type="radio" name="fixOption" value="integratedMails" checked={selectedFixOption === "integratedMails"} onChange={handleFixOptionChange} />
    Fix with Integrated Mails
  </label>
  <label>
    <input type="radio" name="fixOption" value="chatRooms" checked={selectedFixOption === "chatRooms"} onChange={handleFixOptionChange} />
    Chat Rooms
  </label>
</div>


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
      <div className="workflow-card">
        <h3>Workflow Information</h3>
        {workflow && <p>{workflow}</p>}
      </div>
     
    </div>
  );
};

export default PurchaseTicket;