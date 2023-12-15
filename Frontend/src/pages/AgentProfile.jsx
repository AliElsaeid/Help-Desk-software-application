import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Don't forget to import css
import "../stylesheets/Agentprofile.css";
import AgentNavbar from '../components/AgentNavbar';

const userbackend = "http://localhost:3000/api/v1/user";
const ticketbackend = "http://localhost:3000/api/v1/ticket";
// TicketDetails component to fetch and display a single ticket's details
function TicketDetails({ ticketId }) {
  const [status, setStatus] = useState('');
  const [resolution, setResolution] = useState('');
  const [cookies] = useCookies(['token']);

  // Since we're not getting a single ticket detail, we no longer need an effect hook here
  // Remove the previous useEffect that fetched ticket details

  const updateTicket = () => {
    const dataToSend = {
      status: status,
      resolution: resolution
    };

    const config = {
      headers: { 'Authorization': `Bearer ${cookies.token}` }
    };

    axios.put(`${ticketbackend}/${ticketId}`, dataToSend, config)
    .then(response => {
      toast.success("Ticket updated successfully");
      // Use 'window.location.reload()' to reload the page after the update.
      window.location.reload();
    })
    .catch(error => {
      console.error('Error updating ticket:', error);
      toast.error("Failed to update ticket.");
    });
  };

  return (
    <div className="update-ticket-card">
      <h2>Update Ticket ID: {ticketId}</h2>
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
          value={resolution} 
          onChange={(e) => setResolution(e.target.value)}>
        </textarea>
      </div>
      <button onClick={updateTicket}>Update Ticket</button>
    </div>
  );
}
const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const [cookie] = useCookies([]);




 
  useEffect(() => {
    axios.defaults.withCredentials = true;
    console.log(cookie.token);
     const uid = localStorage.getItem("userId");
    // Fetch user details using the user ID from useParams
    axios.get(`${userbackend}/${uid}`, { withCredentials: true })
      .then(response => setUser(response.data))
      .catch(error => {
        console.error('Error fetching user:', error);
        toast.error("Error fetching user details.");
      });
     
      
    // Fetch tickets with the Authorization header
    axios.get(`${ticketbackend}/getTickets/${uid}`, {
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${cookie.token}`
      }
    })
    .then(response => setTickets(response.data))
    .catch(error => {
      console.error('Error fetching tickets:', error);
      toast.error("Error fetching tickets.");
    });
  }, [id, cookie.token]);

  return (

    <div>
       <div className="navbar-top-right">
        <AgentNavbar />
      </div>
      <ToastContainer />

      <div className="user-info-container">
  {user && (
    <div>
      <h1>{user.username}</h1>
      <p>{user.email}</p>
    </div>
  )}
</div>

<div className="ticket-list-container">
  <h1>Ticket List</h1>
  <ul>
    {tickets.map((ticket) => (
       <li key={ticket._id} onClick={() => setSelectedTicketId(ticket._id)}>
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
        {selectedTicketId && <TicketDetails ticketId={selectedTicketId} />}
      </div>
    </div>
      
  );
};

export default Profile;