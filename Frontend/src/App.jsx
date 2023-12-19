import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

// import '../public/styles/bootstrap.min.css'
// import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AgentProfile from "./pages/AgentProfile";
import AdminProfile from "./pages/AdminProfile";
import Login from "./pages/Login";
import AgentChatRooms from "./pages/AgentChatRooms";
import Register from "./pages/Register";
import UserProfile from "./pages/ProfileUser";

function App() {
  return (
    <>
        <Routes>
        
        <Route path="/user" element={<UserProfile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/profile/:id" element={<AgentProfile />} />
        <Route path="/admin" element={<AdminProfile />} />


        <Route path="/profile" element={<AgentProfile />} />
        <Route path="/profile/chatRooms" element={<AgentChatRooms />} />
      




        </Routes>
    </>
  );
}

export default App;