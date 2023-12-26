import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/ProfileUser";
import ResetPassword from './pages/ResetPassword';
import ArticlesList from './pages/knowledgebase';
import PurchaseTicket from "./pages/PurchaseTicket"; 

function App() {
  return (
    <>
        <Routes>
          <Route path="/reset" element={<ResetPassword/>}/>
        <Route path="/user" element={<UserProfile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/purchaseticket" element={<PurchaseTicket />} />
        <Route path="/knowledgebase" element={<ArticlesList />} />

        </Routes>
    </>
  );
}

export default App;