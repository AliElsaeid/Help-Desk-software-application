import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "../stylesheets/login.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSendResetCode = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/resetPassword', { email });
      setMessage(response.data.success);
    } catch (error) {
      console.error(error);
      setMessage('Error sending reset code');
    }
  };

  const handleVerifyResetCode = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/verifyResetCode', {
        
        resetingCode: resetCode,
        newpassword: newPassword,
      });
      setMessage(response.data.success);
    } catch (error) {
      console.error(error);
      setMessage('Error verifying reset code');
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button onClick={handleSendResetCode}>Send Reset Code</button>
      </div>
      <div>
        <label>Reset Code:</label>
        <input type="text" value={resetCode} onChange={(e) => setResetCode(e.target.value)} />
      </div>
      <div>
        <label>New Password:</label>
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      </div>
      <div>
        <button onClick={handleVerifyResetCode}>Verify Reset Code</button>
      </div>
      <div>{message}</div>
    </div>
  );
};

export default ResetPassword;
