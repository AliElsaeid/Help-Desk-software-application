import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserNavbBar from '../components/UserNavbBar';
import "../stylesheets/ProfileUser.css";
import "../stylesheets/UserProfile.css";
import img from '../assets/avatara1.jpg';
import edit from '../assets/edit.png';

const ticketbackend = "http://localhost:3000/api/v1/ticket";
const userbackend = 'http://localhost:3000/api/v1/user';

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: ''
  });
  
  const [cookies] = useCookies([]);
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    const uid = localStorage.getItem("userId");

    axios
      .get(`${userbackend}/${uid}`, { withCredentials: true })
      .then((response) => setUser(response.data))
      .catch((error) => {
        console.error('Error fetching user:', error);
        toast.error('Error fetching user details.');
      });

    axios.get(`${ticketbackend}/getTickets/${uid}`, {
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

  const handleEditClick = () => {
    setEditing(true);
    setEditedUser({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
  };

  const handleCancelEdit = () => {
    setEditing(false);
  };

  const updateUser = () => {
    const dataToSend = {
      username: editedUser.username,
      email: editedUser.email,
      firstName: editedUser.firstName,
      lastName: editedUser.lastName
    };

    const config = {
      headers: { 'Authorization': `Bearer ${cookies.token}` }
    };

    axios.put(`${userbackend}/${id}`, dataToSend, config)
      .then(response => {
        setUser(response.data.user);
        toast.success("User details updated successfully");
        setEditing(false);
      })
      .catch(error => {
        console.error('Error updating user:', error);
        toast.error("Failed to update user details.");
      });
  };

  return (
    <div>
      <div className="navbar-top-right">
        <UserNavbBar />
      </div>
      <ToastContainer />

      <div className="user-info-container">
        {user && (
          <div>
              <div className="user-image-container">
        <img src={img} alt="img" />
      </div>
           
            {editing ? (
              <>
                <input
                  type="text"
                  value={editedUser.username}
                  onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                />
                <input
                  type="text"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                />
                <input
                  type="text"
                  value={editedUser.firstName}
                  onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
                />
                <input
                  type="text"
                  value={editedUser.lastName}
                  onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
                />
                <div className="button-container">
               <button className="save-button" onClick={updateUser}>
      Save
    </button>
    <button className="cancel-button" onClick={handleCancelEdit}>
      Cancel
    </button>
    </div>
  </>
) : (
              <>
                <h1>{user.username}</h1>
                <p>{user.email}</p>
                <p>{user.firstName} {user.lastName}</p>
                <img
                  src={edit}
                  alt="Edit"
                  className="edit-button"
                  onClick={handleEditClick}
                />
              </>
            )}
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

export default UserProfile;