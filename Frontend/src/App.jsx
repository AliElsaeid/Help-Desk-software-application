import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

// import '../public/styles/bootstrap.min.css'
// import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AgentProfile from "./pages/AgentProfile";
import Login from "./pages/Login";
import AgentChatRooms from "./pages/AgentChatRooms";
import Register from "./pages/Register";
import AdminProfile from "./pages/AdminProfile";
import PurchaseTicket from "./pages/PurchaseTicket"; 
import AssignAgent from "./pages/AssignAgent"; 
import UserProfile from "./pages/ProfileUser";
import MonitorChatRoom from "./pages/MonitorChatRoom";
import AddWork from "./pages/Addwork";
import ArticlesList from './pages/knowledgebase';
import ResetPassword from './pages/ResetPassword';




function App() {
  return (
    <>
        <Routes>
        <Route path="/reset" element={<ResetPassword/>}/>
        <Route path="/user" element={<UserProfile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />


        <Route path="/profile" element={<AgentProfile />} />
        <Route path="/profile/chatRooms" element={<AgentChatRooms />} />
        <Route path="/admin" element={<AdminProfile />} />
        <Route path="/admin/monitorchatroom" element={<MonitorChatRoom />} />
        <Route path="/knowledgebase" element={<ArticlesList />} />

        <Route path="/purchaseticket" element={<PurchaseTicket />} />
        <Route path="/admin/assignagent" element={<AssignAgent />} />
        <Route path="/admin/AddArticle" element={<AddWork />} />


        </Routes>
    </>
  );
}

export default App;