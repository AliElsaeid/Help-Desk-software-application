import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../stylesheets/resetPassword.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1);
  const [isSaveDisabled, setSaveDisabled] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if email, resetCode, and newPassword are not empty
    const isFormValid = email && resetCode && newPassword;
    setSaveDisabled(!isFormValid);
  }, [email, resetCode, newPassword]);

  const handleSendResetCode = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/user/resetPassword', { email });
      setMessage(response.data.success);
      setStep(2);
    } catch (error) {
      console.error(error);
      setMessage('Error sending reset code');
    }
  };

  const handleVerifyResetCode = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/user/verifyResetCode', {
        email: email, 
        resetingCode: resetCode,
        
      });
       setMessage("verified");
       navigate('/login');

      setStep(3);
    } catch (error) {
      console.error(error);
      setMessage('Error verifying reset code');
    }
  };

  const handleSavePassword = async () => {
    try {
      // Add logic to save the password
      setMessage('Password saved successfully');
      setStep(4);
      navigate('/login');
    } catch (error) {
      console.error(error);
      setMessage('Error saving password');
    }
  };

  return (
    <div className="welcome-container">
    <h2 className="welcome-back">Reset Password</h2>
    <br/>
    <br/>
    <br/>
    <div>

      {/* Step 1: Email Entry */}
      {step === 1 && (
        <div>
         <div class="h4 pb-2 mb-4 text-white border-bottom border-white">
          <label>Email</label>
          <br/>
          <input placeholder="Enter your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button onClick={handleSendResetCode}>Send Reset Code</button>
        </div>
        

      )}

      {/* Step 2: Reset Code Entry */}
      {step === 2 && (
        <div>
       <div class="h4 pb-2 mb-4 text-white border-bottom border-white">
          <label>Reset Code</label>
          <br/>
          <input
            placeholder="Enter verification code"
            type="text"
            value={resetCode}
            onChange={(e) => setResetCode(parseInt(e.target.value))}
            
          />
          </div>
          <button onClick={handleVerifyResetCode}>Verify Reset Code</button>
        </div>
      )}

      {/* Step 3: New Password Entry */}
      {step === 3 && (
        <div>
                 <div className="h4 pb-2 mb-4 text-white border-bottom border-white">

          <label>New Password</label>
          <br/>
          <input placeholder="Enter your password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <button onClick={handleSavePassword} disabled={isSaveDisabled}>
            Save Password
          </button>
        </div>
      )}

      {/* Display success or error message */}
      <div className="responsive-message">{message}</div>
    </div>
    </div>

  );
};

export default ResetPassword;