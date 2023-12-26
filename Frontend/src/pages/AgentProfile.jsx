
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 
import "../stylesheets/Agentprofile.css";
import AgentNavbar from '../components/AgentNavbar';
import Avatar from '@mui/material/Avatar';


const userbackend = "http://localhost:3000/api/v1/user";
const ticketbackend = "http://localhost:3000/api/v1/ticket";




function TicketDetails({ ticket ,onClose }) {

  const [status, setStatus] = useState('');
  const [resolution, setResolution] = useState('');
  const [cookies] = useCookies(['token']);
  const [emailSending, setEmailSending] = useState(false);

  // Since we're not getting a single ticket detail, we no longer need an effect hook here
  // Remove the previous useEffect that fetched ticket details

  const updateTicket = () => {
    const dataToSend = {
      status: status,
      resolution: resolution
    };
console.log(ticket);
    const config = {
      headers: { 'Authorization': `Bearer ${cookies.token}` }
    };

    axios.put(`${ticketbackend}/${ticket._id}`, dataToSend, config)
    .then(response => {
      toast.success("Ticket updated successfully");
      // Use 'window.location.reload()' to reload the page after the update.
      // window.location.reload();
    })
    .catch(error => {
      console.error('Error updating ticket:', error);
      toast.error("Failed to update ticket.");
    });

  };
  const sendResolutionEmail = () => {
    setEmailSending(true); // Set state to represent email-sending progress
    const emailData = {
      userId: ticket.user,
      subject: 'Your Ticket Resolution',
      message: resolution
    };

    // Set up your headers and tokens correctly.
    const config = {
      headers: { 'Authorization': `Bearer ${cookies.token}` }
    };

    axios.post('http://localhost:3000/api/v1/communication/sendEmail', emailData, config)
      .then(response => {
        toast.success("Email sent successfully!");
        setEmailSending(false); 

      })
      .catch(error => {
        console.error('Error sending resolution email:', error);
        toast.error("Failed to send email.");
        setEmailSending(false);
      });
  };

  

  return (
    <div className="update-ticket-card">
 <button className="btn btn-sm btn-danger close-btn" onClick={onClose}>
  Close
</button>
<h2>Update Ticket: {ticket.description}</h2>
<div>
  <label>Status:</label>
  <select value={status} onChange={(e) => setStatus(e.target.value)}>
    <option value="open">Open</option>
    <option value="pending">Pending</option>
    <option value="closed">Closed</option>
  </select>
</div>
<div>
  <label>Resolution:</label>
  <textarea
    className="resolution-textarea"
    value={resolution}
    onChange={(e) => setResolution(e.target.value)}
    rows="8" /* Set the number of visible rows */
  ></textarea>
</div>
<div>
  <button className="btn btn-primary update-btn" onClick={() => updateTicket()}>
    Update Ticket
  </button>
  <button
    className="btn btn-secondary email-btn"
    onClick={sendResolutionEmail}
    disabled={emailSending}
  >
    Send Resolution Email
  </button>
</div>

</div>

   
    
  );
}
const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [cookies] = useCookies([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);


  // If you need to use the value

  const [isTicketDetailsVisible, setTicketDetailsVisible] = useState(false);

  const openTicketDetails = (ticket) => {
    setSelectedTicketId(ticket);
    setTicketDetailsVisible(true);
  };

  const closeTicketDetails = () => {
    setTicketDetailsVisible(false);
    setSelectedTicketId(null);
  };
 
  useEffect(() => {
    axios.defaults.withCredentials = true;
    const uid = localStorage.getItem("userId");

    // Fetch user details using the user ID from useParams
    axios.get(`${userbackend}/${uid}`, { withCredentials: true })
      .then(response => setUser(response.data))
      .catch(error => {
        console.error('Error fetching user:', error);
        toast.error("Error fetching user details.");
      });

    axios.get(`${ticketbackend}/getTickets`, {
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${cookies.token}`
      }
    })
    .then(response => setTickets(response.data))
    .catch(error => {
      console.error('Error fetching tickets:', error);
      toast.error("Error fetching tickets.");
    });
  }, [id, cookies.token]);

  return (
    <div>
       <div className="navbar-top-right">
        <AgentNavbar />
      </div>
      
      <ToastContainer />

      <div className="user-inf-container">
  {user && (
    <div className="user-etails">
           <Avatar className="user-avatar" alt={user.username} src={user.avatarUrl} />

      <div className="user-nfo">
        <h1>{user.username}</h1>
        <p>{user.email}</p>
      </div>
    </div>
  )}
</div>

<div className="ticket-lis-container">
  <h1>Ticket List</h1>
  <ul>
    {tickets.map((ticket) => (
            <li key={ticket._id} onClick={() => openTicketDetails(ticket)}>
            <span>Category: {ticket.category}</span>
        <span>SubCategory: {ticket.subCategory}</span>
        <span>Description: {ticket.description}</span>
        <span>Resolution: {ticket.resolution}</span>
        <span>Created At: {ticket.createdAt}</span>
        <span>Updated At: {ticket.updatedAt}</span>
        <span>Closed At: {ticket.closedAt}</span>
        <span>Status: {ticket.status}</span>
      </li>
    ))}
  </ul>
</div>
<div className="ticket-detail-view">
{isTicketDetailsVisible && (
          <TicketDetails ticket={selectedTicketId} onClose={closeTicketDetails} />
        )}
      </div>
    </div>
  );
};

export default Profile;