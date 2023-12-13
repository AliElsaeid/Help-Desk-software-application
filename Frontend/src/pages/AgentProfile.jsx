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
  const [cookies] = useCookies(['token']);


  // If you need to use the value


  useEffect(() => {

    console.log("cookies", cookies,"token",cookies.token);
    
    // Fetch user details using the user ID from useParams
    axios.get(`${userbackend}/${id}`, { withCredentials: true })
      .then(response => setUser(response.data))
      .catch(error => {
        console.error('Error fetching user:', error);
        toast.error("Error fetching user details.");
      });

      axios.get(`${ticketbackend}/getTickets/${id}`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${cookies.token}` // Token needs to be the actual token value
        }
      })
      .then(response => setTickets(response.data))
      .catch(error => {
        console.error('Error fetching tickets:', error);
        toast.error("Error fetching tickets.");
      });
  }, [id]);

  return (
    <div>
      <ToastContainer />
      <div>
        {user && (
          <div>
            <h1>{user.username}</h1>
            <p>{user.email}</p>
          </div>
        )}
      </div>

      <div>
        <h1>Ticket List</h1>
        <ul>
          {tickets.map(ticket => (
            <li key={ticket._id}>{ticket.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;