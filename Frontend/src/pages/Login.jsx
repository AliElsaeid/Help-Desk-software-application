import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../stylesheets/login.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const backendUrl = "http://localhost:3000/api/v1/user/login";

const Login = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({ email: "", password: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendUrl, { ...inputValue }, { withCredentials: true });
      const { status, data } = response;
      console.log('data',data)
      if (response.status === 200)  {
        setSuccessMessage("Login successful!");
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("role", data.user.role);
  
        switch (data.user.role.toLowerCase()) {
          case "user":
            navigate(`/user`);
            break;
          case "admin":
            navigate(`/admin`);
            break;
          case "agent":

            navigate(`/profile`);
            break;
          default:
            // Handle other roles or cases as needed
            break;
        }
      }
    } catch (error) {
      setErrorMessage(`Login failed: ${error.response?.data?.message}`);
    }
  };
  return (
    <div className="welcome-container">
      <h2 className="welcome-back">Welcome Back</h2>
      <div className="form_container">
        <h2>Login To Your Account</h2>
        <form onSubmit={handleSubmit}>
          {/* Email input */}
          <div className="h4 pb-2 mb-4 text-white border-bottom border-white">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={inputValue.email}
              placeholder="Enter your email"
              onChange={handleOnChange}
            />
          </div>

          {/* Password input */}
          <div className="h4 pb-2 mb-4 text-white border-bottom border-white">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={inputValue.password}
              placeholder="Enter your password"
              onChange={handleOnChange}
            />
          </div>

          {/* Submit button */}
          <button type="submit">Submit</button>

          {/* Message display */}
          <p>{successMessage}</p>
          <p>{errorMessage}</p>

          {/* Link to sign up */}
          <p>
            <br />
            Don't have an account? <Link to="/register">Sign up</Link>
            <br />
            Forgot your Password? <Link to="/reset">Reset Password</Link>
          </p>
        </form>
      
        <p className="text-white">About Us</p>
        <h6 className="about">
          ECS Help Desk, founded in 2018, is a reliable support partner for
          individuals and businesses. Committed to excellence, ECS provides
          timely and innovative solutions, earning trust for streamlined
          processes and enhanced user experiences. The commitment to guiding
          success remains central as ECS evolves.
        </h6>
      </div>
    </div>
  );
};

export default Login;