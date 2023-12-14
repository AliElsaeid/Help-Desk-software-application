import "../stylesheets/Agentprofile.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Don't forget to import css

const userbackend = "http://localhost:3000/api/v1/user";
const ticketbackend = "http://localhost:3000/api/v1/ticket";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [cookie] = useCookies([]);


  // If you need to use the value


 
  useEffect(() => {
    axios.defaults.withCredentials = true;
    console.log(cookie.token);
    // Fetch user details using the user ID from useParams
    axios.get(`${userbackend}/${id}`, { withCredentials: true })
      .then(response => setUser(response.data))
      .catch(error => {
        console.error('Error fetching user:', error);
        toast.error("Error fetching user details.");
      });
      const uid = localStorage.getItem("userId");
      
    // Fetch tickets with the Authorization header
    axios.get(`${ticketbackend}/getTickets/${id}`, {
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
      <li key={ticket._id}>
        <span>Category: {ticket.category}</span>
        <span>SubCategory: {ticket.subCategory}</span>
        <span>Description: {ticket.description}</span>
        <span>Created At: {ticket.createdAt}</span>
        <span>Updated At: {ticket.updatedAt}</span>
        <span>Closed At: {ticket.closedAt}</span>
        <span>Status: {ticket.status}</span>
      </li>
    ))}
  </ul>
</div>
    </div>
  );
};

export default Profile;