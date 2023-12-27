import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserNavbBar from '../components/UserNavbBar';
import "../stylesheets/ProfileUser.css";
import img from '../assets/avatara1.jpg';
import edit from '../assets/edit.png';
import AgentChatRooms from "../components/UserChatRooms";

import 'bootstrap/dist/css/bootstrap.min.css';

const chatbackend = "http://localhost:3000/api/v1/communication";
const ticketbackend = "http://localhost:3000/api/v1/ticket";
const userbackend = 'http://localhost:3000/api/v1/user';
const reportbackend = 'http://localhost:3000/api/v1/report';

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
  const [ratedTicketIds, setRatedTicketIds] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [showRatePopup, setShowRatePopup] = useState(false);
  const [selectedRating, setSelectedRating] = useState(1);
  const [comment, setComment] = useState('');

  const uid = localStorage.getItem("userId");

  useEffect(() => {
    axios.defaults.withCredentials = true;

    axios
      .get(`${userbackend}/${uid}`, { withCredentials: true })
      .then((response) => setUser(response.data))
      .catch((error) => {
        console.error('Error fetching user:', error);
        toast.error('Error fetching user details.');
      });

    axios.get(`${ticketbackend}/getTickets`, {
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${cookies.token}`
      }
    })
    .then(response => {
      setTickets(response.data);
      // Fetch rated tickets for the current user
      axios.get(`${reportbackend}/ratings`, { withCredentials: true })
        .then(response => {
          const ratedTickets = response.data.ratings.map(rating => rating.ticket.toString());
          setRatedTicketIds(ratedTickets);
        })
        .catch(error => {
          console.error('Error fetching rated tickets:', error);
        });
    })
    .catch(error => {
      console.error('Error fetching tickets:', error);
      toast.error("Error fetching tickets.");
    });
  }, [uid, cookies.token]);

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

    axios.put(`${userbackend}/${uid}`, dataToSend, config)
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

  const handleRateTicket = (ticket) => {
    // Check if the ticket is rated
    setSelectedTicketId(ticket._id);
    setShowRatePopup(true);

    axios.get(`${reportbackend}/checkTicketRating/${selectedTicketId}`, { withCredentials: true })
      .then(response => {
        if (response.data.rated) {
          toast.success('You have already rated this ticket');
        } else {
          setSelectedRating(1); 
          setComment(''); 
          setShowRatePopup(true);
          setshowratemessage(true);
        }
      })
      .catch(error => {
        console.error('Error checking ticket rating:', error);
        // Handle error
      });
  };

  const handleCloseRatePopup = () => {
    setShowRatePopup(false);
  };

  const handleRateSubmit = async () => {
    try {
      await axios.post('http://localhost:3000/api/v1/report/createRating', {
        ticket_id: selectedTicketId,
        rating: selectedRating,
        comment: comment
      });
     
      
      toast.success('Ticket rated successfully!');      // You can refresh the ticket list or perform other actions after rating
      setShowRatePopup(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error rating ticket:', error);
      // Handle error
    }
  };

  const handleAskForChatroom = async () => {
    try {
      // Make API request to ask for a chatroom
      await axios.post(`${chatbackend}/createRoom`);
      toast.success('Chatroom requested successfully!');
    } catch (error) {
      toast.error('Error requesting chatroom:', error);
    }
  };

  return (
    <div>
      
      <div className="randommm-top-right">
        <AgentChatRooms />
      </div>
      <ToastContainer />
      <div className="navbar-top-right">
        <UserNavbBar />
      </div>
      <div className="user-info-container">
        {user && (
          <div>
            <div className="user-image-container">
              <img src={img} alt="img" />
            </div>
           
            {editing ? (
              <>
                <div className="h4 pb-2 mb-4 text-white border-bottom border-white">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={editedUser.username}
                    onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="h4 pb-2 mb-4 text-white border-bottom border-white">
                  <label htmlFor="email">Email</label>
                  <input
                    type="text"
                    id="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="h4 pb-2 mb-4 text-white border-bottom border-white">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    value={editedUser.firstName}
                    onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="h4 pb-2 mb-4 text-white border-bottom border-white">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    value={editedUser.lastName}
                    onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="button-container">
                  <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-success" onClick={updateUser}>
                    Save
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
            <li key={ticket._id}>
               <div className="ticket-details">
                <span>Category: {ticket.category}</span>
                <span>SubCategory: {ticket.subCategory}</span>
                <span>Description: {ticket.description}</span>
                <span>Resolution: {ticket.resolution}</span>
                <span>Created At: {ticket.createdAt}</span>
                <span>Updated At: {ticket.updatedAt}</span>
                <span>Closed At: {ticket.closedAt}</span>
                <span>Status: {ticket.status}</span>
              </div>
              <br/>
             
            
           
              <div className="ticket-buttons">
                {ticket.status === 'closed' && !ratedTicketIds.includes(ticket._id) ? (
                  <div className="ticket-buttons">
                    <button onClick={() => handleRateTicket(ticket)}>Rate the Ticket</button>
                    <button onClick={() => handleAskForChatroom()}>Ask for Chatroom</button>
                  </div>
                ) : (
                  <div>
                    <button onClick={() => handleAskForChatroom()}>Ask for Chatroom</button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showRatePopup && (
        <div className="rate-popup">
          <h2>Rate the Ticket</h2>
          <label htmlFor="rating">Rating:</label>
          <select
            id="rating"
            value={selectedRating}
            onChange={(e) => setSelectedRating(parseInt(e.target.value, 10))}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <label htmlFor="comment">Comment:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          <button onClick={handleRateSubmit}>Submit</button>
          <button onClick={handleCloseRatePopup}>Cancel</button>
        </div>
      )}
           
    </div>
  );
};

export default UserProfile;