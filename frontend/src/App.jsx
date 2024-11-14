import React, {useEffect, useState} from 'react';
import Navbar from './components/Navbar';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Career from './components/pages/Careers';
import LogIn from './components/pages/LogIn';
import MenuBoard from './components/pages/MenuBoard';
import { gapi } from 'gapi-script';
import GoogleAuth from "./components/login/GoogleAuth.jsx";
import Login from "./components/login/Login.jsx";


const App = () => {
  return (
    <div className = "empty">
      <Router>
          <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/MenuBoard" element={<MenuBoard />} />
          <Route path="/Careers" element={<Career />} />
          <Route path="/sign-up" element={<GoogleAuth />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;