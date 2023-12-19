import "../stylesheets/Adminprofile.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Don't forget to import css
import Adminnavbar from '../components/Adminnavbar';

const userbackend = "http://localhost:3000/api/v1/user";
const ticketbackend = "http://localhost:3000/api/v1/ticket";
const appbackend="http://localhost:3000/api/v1/appearance";

function TicketDetails({ ticketId, onClose }){
  const [status, setStatus] = useState('');
  const [resolution, setResolution] = useState('');
  const [cookies] = useCookies([]);

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
       <button onClick={onClose}>Close</button>
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
const AdminProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [cookies] = useCookies([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const closeTicketDetails = () => setSelectedTicketId(null);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [textColor, setTextColor] = useState('#000000');



  // If you need to use the value


 
  useEffect(() => {
    axios.defaults.withCredentials = true;
    const uid = localStorage.getItem("userId");
    axios.get(`${appbackend}/appearance`)
    .then((response) => {
      const settings = response.data;
      setBackgroundColor(settings.backgroundColor);
      setTextColor(settings.textColor);
      // Apply the current appearance settings to the document body
      document.body.style.background = settings.backgroundColor;
      document.body.style.color = settings.textColor;
    })
    .catch((error) => {
      console.error('Error fetching appearance settings:', error);
    });


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
  const updateAppearance = async () => {
    try {
      const response = await axios.put(`${appbackend}/appearance`, {
        backgroundColor,
        textColor
      }, {
        headers: { 'Authorization': `Bearer ${cookies.token}` }
      });
      toast.success('Appearance settings updated successfully');
      // Apply the updated appearance settings to the document body
      document.body.style.background = backgroundColor;
      document.body.style.color = textColor;
    } catch (error) {
      console.error('Error updating appearance settings:', error);
      toast.error('Failed to update appearance settings.');
    }
  };


  return (
    <div>

      
      <div className="navbar-top">
      <Adminnavbar/>
    </div>
      

      <div className="user-inf-container">
  {user && (
    <div>
      <h1>{user.username}</h1>
      <p>{user.email}</p>
    </div>
  )}
</div>

<div className="ticket-lis-container">
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
{selectedTicketId && <TicketDetails ticketId={selectedTicketId} onClose={closeTicketDetails} />}
      </div>
<div className="appearance-settings">
      <h2>Appearance Settings</h2>
      <div>
        <label>Background Color:</label>
        <select
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
        >
          <option value="#FFFFFF">White</option>
          <option value="#000000">Black</option>
          <option value="#008000">Green</option>
          <option value="#800080">Purple</option>
          <option value="#fe016d">pink</option>

          {/* Add more color options as needed */}
        </select>
      </div>
      <div>
        <label>Text Color:</label>
        <select
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
        >
          <option value="#FFFFFF">White</option>
          <option value="#000000">Black</option>
          <option value="#008000">Green</option>
          <option value="#800080">Purple</option>
          <option value="#fe016d">pink</option>
          {/* Add more color options as needed */}
        </select>
      </div>
      <button onClick={updateAppearance}>Update Appearance</button>
    </div>
    </div>
    
  );
};

export default AdminProfile;