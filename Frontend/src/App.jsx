import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

// import '../public/styles/bootstrap.min.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AgentProfile from "./pages/AgentProfile";
import Login from "./pages/Login";

function App() {
  return (
    <>
        <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/profile/:id" element={<AgentProfile />} />

      




        </Routes>
    </>
  );
}

export default App;