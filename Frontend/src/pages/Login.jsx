import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = "http://localhost:3000/api/v1/user/login";

const Login = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue(prevInput => ({
      ...prevInput,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendUrl, inputValue);
      const data = response.data;
      if (response.status === 200) {
        setMessage("Login successful!");
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("role", data.user.role);
        navigate(`/profile/${data.user._id}`);
      }
    } catch (error) {
      setMessage(`Login failed: ${error.response?.data?.message }`);
    }
  };

  return (
    <div className="form_container">
      <h2>Login Account</h2>
      <form onSubmit={handleSubmit}>
        {/* Email input */}
        <div>
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
        <div>
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
        {message && <p>{message}</p>}
        {/* Link to sign up */}
        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;