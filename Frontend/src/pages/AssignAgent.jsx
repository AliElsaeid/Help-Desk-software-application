import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import "../stylesheets/AssignAgent.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Adminnavbar from '../components/Adminnavbar';


// Define the user backend URL
const userbackend = 'http://localhost:3000/api/v1/user';

// Main component
const AssignAgent = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [cookies] = useCookies([]);
  const [role, setRole] = useState('user');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${userbackend}`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [cookies.token]);

  const UsersList = () => (
    <div className="users-list">
      <h2>Users List</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <div className="user-info">
              <p className="bold-label username">Username: {user.username}</p>
              <p>Role: {user.role}</p>
            </div>
            <button onClick={() => handleUpdateClick(user)}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );

  const UpdateRole = () => (
    <div className="update-role-container">
      <h2>Update Role</h2>
      {selectedUser && (
        <p>
          <span className="selected-user-text">Selected User:</span> {selectedUser.username}
        </p>
      )}
      <div className="role-options">
        <div className="role-circle">
          <input type="radio" id="user" name="role" value="user" onChange={() => setRole('user')} />
          <label htmlFor="user">User</label>
        </div>
        <div className="role-circle">
          <input type="radio" id="agent" name="role" value="agent" onChange={() => setRole('agent')} />
          <label htmlFor="agent">Agent</label>
        </div>
      </div>
      <button onClick={handleRoleUpdate}>Submit</button>
    </div>
  );

  const handleUpdateClick = (user) => {
    setSelectedUser(user);
  };

  const handleRoleUpdate = async () => {
    try {
      if (!selectedUser) {
        console.error('No user selected for role update');
        return;
      }

      await axios.put(
        `${userbackend}/role/${selectedUser._id}`,
        { role },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      );

      const response = await axios.get(`${userbackend}`);
      setUsers(response.data);

      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  return (
   <div>
      <div className="navbar-top-right">
      <Adminnavbar />
     </div>
    <div className="assign-agent-container">
      
      <UsersList />
      {selectedUser && <UpdateRole />}
    </div>
    </div>
  );
};

export default AssignAgent;