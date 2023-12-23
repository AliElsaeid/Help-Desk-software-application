import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const userBackend = 'http://localhost:3000/api/v1/user';

const AssignAgent = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [cookies] = useCookies([]);
  const [role, setRole] = useState('user'); // Initialize role state with a default value

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${userBackend}`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [cookies.token]); // Include cookies.token in the dependency array to fetch users on token changes

  const handleUpdateClick = (user) => {
    setSelectedUser(user);
  };

  const handleRoleUpdate = async () => {
    try {
      if (!selectedUser) {
        console.error('No user selected for role update');
        return;
      }

      // Send a request to update the role of the selected user
      await axios.put(
        `${userBackend}/role/${selectedUser._id}`,
        { role },  // Ensure role is a string
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies.token}`,
          },
        }
      );

      // Refresh the list of users after the role is updated
      const response = await axios.get(`${userBackend}`);
      setUsers(response.data);

      // Clear the selected user
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  return (
    <div className="assign-agent-container">
      <div className="users-list">
        <h2>All Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {user.username} - {user.role}
              <button onClick={() => handleUpdateClick(user)}>Update</button>
            </li>
          ))}
        </ul>
      </div>

      {selectedUser && (
        <div className="update-role-container">
          <h2>Update Role</h2>
          <p>Selected User: {selectedUser.username}</p>
          <select onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="agent">Agent</option>
          </select>
          <button onClick={handleRoleUpdate}>Submit</button>
        </div>
      )}

      {/* Notification Popup */}
      <div className="notification" id="notification">
        Role updated successfully!
      </div>
    </div>
  );
};

export default AssignAgent;
