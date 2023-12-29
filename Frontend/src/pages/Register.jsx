import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../stylesheets/register.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const Signup = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
    firstName: "",
    lastName: ""
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const backend_url = "http://localhost:3000/api/v1/user"; // Remove "/register" from the URL
  const { email, password, username, firstName, lastName } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prevInputValue) => ({
      ...prevInputValue,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backend_url}/register`,
        {
          email,
          password,
          username,
          firstName,
          lastName,
        },
        { withCredentials: true }
      );

      const { status, data } = response;
      if (status === 201) {
        setSuccessMessage("SignUp successfully");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setErrorMessage(error.response.data.message || "An error occurred");
    }
    setInputValue({
      email: "",
      password: "",
      username: "",
      firstName: "",
      lastName: "",
    });
  };


  return (
    <div className="welcome-container">
    <h2 className="welcome-back">Welcome</h2>
    <div className="signup-container">

  <h2>Create Account</h2>
  <form onSubmit={handleSubmit}>
    <div className="form-group">
    <div className="h4 pb-2 mb-4 text-white border-bottom border-white">

      <label htmlFor="email">Email</label>
      <br/>
      <input
        type="email"
        name="email"
        value={email}
        placeholder="Enter your email"
        onChange={handleOnChange}
      />
    </div>
    </div>
    <div className="form-group">
    <div className="h4 pb-2 mb-4 text-white border-bottom border-white">

      <label htmlFor="username">Username</label>
      <input
        type="text"
        name="username"
        value={username}
        placeholder="Enter your username"
        onChange={handleOnChange}
      />
    </div>
    </div>
    <div className="form-group">
    <div className="h4 pb-2 mb-4 text-white border-bottom border-white">

      <label htmlFor="firstName">First Name</label>
      <input
        type="text"
        name="firstName"
        value={firstName}
        placeholder="Enter your first name"
        onChange={handleOnChange}
      />
    </div>
    </div>
    <div className="form-group">
    <div className="h4 pb-2 mb-4 text-white border-bottom border-white">
      <label htmlFor="lastName">Last Name</label>
      <input
        type="text"
        name="lastName"
        value={lastName}
        placeholder="Enter your last name"
        onChange={handleOnChange}
      />
          </div>

    </div>
    <div className="form-group">
    <div className="h4 pb-2 mb-4 text-white border-bottom border-white">

      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        value={password}
        placeholder="Enter your password"
        onChange={handleOnChange}
      />
    </div>
    </div>

    <button type="submit">Submit</button>
    <span className="messages">
      {errorMessage} {successMessage}
    </span>
    <span className="login-link">
      Already have an account? <Link to={"/login"}>Login</Link>
    </span>
  </form>
  
  <p className="text-white">About Us</p>
      <h6 className="about">ECS Help Desk, founded in 2018, is a reliable support partner for individuals and businesses. Committed to excellence,
       ECS provides timely and innovative solutions,
       earning trust for streamlined processes and enhanced user experiences.
        The commitment to guiding success remains central as ECS evolves.</h6>
</div>
</div>
  );
};

export default Signup;