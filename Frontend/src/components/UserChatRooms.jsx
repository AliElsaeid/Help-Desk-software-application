import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import "../stylesheets/UserChatss.css";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { useCookies } from "react-cookie";
const AgentChatRooms = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showMessages, setShowMessages] = useState(true); // Track whether to show messages
  const [ticketStatus, setTicketStatus] = useState(""); // Track ticket status
  const chatbackend = "http://localhost:3000/api/v1/communication";
  const userbackend = "http://localhost:3000/api/v1/user";
  const ticketbackend = "http://localhost:3000/api/v1/ticket"; // Add your actual ticket backend endpoint
  const [cookies] = useCookies(['token']);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    // Fetch chat rooms when the component mounts
    getChatRooms();
    
    // Clean up interval when the component unmounts or when a new room is selected
    return () => {
      clearInterval(intervalId);
    };
  }, [intervalId]);

  const getChatRooms = async () => {
    try {
      const response = await axios.get(`${chatbackend}/getChatRooms`, {
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

  const getTicketStatus = async (roomId) => {
    try {
      const response = await axios.get(`${ticketbackend}/${roomId}`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${cookies.token}`
        }
      });
      setTicketStatus(response.data.status);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMessages = async (roomId) => {
    try {
      await getTicketStatus(roomId); // Fetch ticket status when loading messages

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
  };

  const handleRoomClick = (roomId) => {
    setSelectedRoomId(roomId);
    
    clearInterval(intervalId); // Clear any existing interval
    const id = setInterval(() => loadMessages(roomId), 1000);
    setIntervalId(id);
  };

  const toggleMessages = () => {
    setSelectedRoomId(null);
    clearInterval(intervalId); // Clear interval when closing messages
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoomId) return;

    try {
      await axios.post(`${chatbackend}/sendMessage`, {
        roomID: selectedRoomId,
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
      
      <div className="container-fluid mt-4">
       
          {/* Room List Column */}
          <div className="random-list-group">
            <h2>Rooms</h2>
            {chatRooms.map((room) => (
              <div
                key={room._id}
                className={`random-item ${selectedRoomId === room._id ? 'active' : ''}`}
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
            <div className="random-messages-column">
              
              <div id="random-messages-container" className="random-card">
              <button className="btn btn-sm btn-danger" onClick={toggleMessages}>
                  Close
                </button>
                <div className="random-card-body">
                  <div className="random-overflow-auto">
                    {messages.map((message) => (
                         <div key={message._id} className="random-chat-message">
                         <div className="random-chat-message-container">
                           <div className="random-message-header">
                             <p className="random-username text-small">{message.username}:</p>
                             <p className="random-timestamp text-small text-muted">
                               {new Date(message.timestamp).toLocaleString()}
                             </p>
                           </div>
                           <p className="random-message-content text small">{message.content}</p>
                         </div>
                       </div>
                    ))}
                  </div>
                  <div className="random-border-top pt-3">
                    <form onSubmit={sendMessage}>
                      <div className="random-form-group">
                        <textarea
                          className="random-form-control"
                          rows="3"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                        ></textarea>
                      </div>
                      <button type="submit" className="random-btn random-btn-primary float-right">
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