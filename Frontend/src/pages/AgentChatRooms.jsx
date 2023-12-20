// AgentChatRooms.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AgentNavbar from '../components/AgentNavbar';
import "../stylesheets/AgentChats.css";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { useCookies } from "react-cookie";



const AgentChatRooms = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatbackend = "http://localhost:3000/api/v1/communication";
  const uid = localStorage.getItem("userId");
  const userbackend = "http://localhost:3000/api/v1/user";
  const [cookies] = useCookies(['token']);

  useEffect(() => {
    // Fetch chat rooms when the component mounts
    getChatRooms();
    
  }, []); // Make sure this effect runs only once

  const getChatRooms = async () => {
    try {
      const response = await axios.get(`${chatbackend}/getChatRooms/${uid}`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${cookies.token}`
        }
      });
      setChatRooms(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMessages = useCallback(async (roomId) => {
    try {
      const messagesResponse = await axios.get(`${chatbackend}/getChatMessages/${roomId}`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${cookies.token}`
        }
      });
      const messagesWithUsernamesPromises = messagesResponse.data.map(async (message) => {
        const userResponse = await axios.get(`${userbackend}/${message.sender}`);
        return { ...message, username: userResponse.data.username };
      });
      
      const messagesWithUsernames = await Promise.all(messagesWithUsernamesPromises);
      setMessages(messagesWithUsernames);
    } catch (error) {
      console.log(error);
    }
  }, [cookies.token]);

  const handleRoomClick = (roomId) => {
    setSelectedRoomId(roomId);
    loadMessages(roomId);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post(`${chatbackend}/sendMessage`, {
        roomID: selectedRoomId,
        userId: uid,
        content: newMessage,
      }, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${cookies.token}`
        }
      });
      setNewMessage('');
      loadMessages(selectedRoomId); // Refresh messages after sending
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="navbar-top-right">
        <AgentNavbar />
      </div>
      <div className="container-fluid mt-4">
       
          {/* Room List Column */}
          <div className="list-group">
            <h2>Rooms</h2>
            {chatRooms.map((room) => (
              <div
                key={room._id}
                className={`list-group-item ${selectedRoomId === room._id ? 'active' : ''}`}
                onClick={() => handleRoomClick(room._id)}
              >
                <strong>{room.roomName}</strong>
                <p>{room.description}</p>
                <small>Created on: {new Date(room.createdAt).toLocaleDateString()}</small>
              </div>
            ))}
          </div>

          {/* Messages Column */}
          {selectedRoomId && (
            <div className="messages-column">
              
              <div id="messages-container" className="card">
                <div className="card-body">
                  <div className="overflow-auto">
                    {messages.map((message) => (
                         <div key={message._id} className="chat-message">
                         <div className="chat-message-container">
                           <div className="message-header">
                             <p className="username text-small">{message.username}:</p>
                             <p className="timestamp text-small text-muted">
                               {new Date(message.timestamp).toLocaleString()}
                             </p>
                           </div>
                           <p className="message-content text small">{message.content}</p>
                         </div>
                       </div>
                    ))}
                  </div>
                  <div className="border-top pt-3">
                    <form onSubmit={sendMessage}>
                      <div className="form-group">
                        <textarea
                          className="form-control"
                          rows="3"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                        ></textarea>
                      </div>
                      <button type="submit" className="btn btn-primary float-right">
                        Send
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        
      </div>
    </div>
  );
};

export default AgentChatRooms;