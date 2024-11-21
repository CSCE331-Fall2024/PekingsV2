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
  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        autoDisplay: false
      },
      "google_translate_element"
    );
  };

  useEffect(() => {
    // Check if the Google Translate script already exists
    if (!window.googleTranslateElementInit && !document.getElementById("google_translate_script")) {
      const addScript = document.createElement("script");
      addScript.setAttribute("id", "google_translate_script");
      addScript.setAttribute(
        "src",
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      );
      document.body.appendChild(addScript);
      window.googleTranslateElementInit = googleTranslateElementInit; // Attach your initialization function
    }
  }, []);

  return (
      <div className="empty">
        <Router>
          <Navbar/>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/MenuBoard" element={<MenuBoard/>}/>
            <Route path="/Careers" element={<Career/>}/>
            <Route path="/sign-up" element={<GoogleAuth/>}/>
          </Routes>
        </Router>
      </div>
  );
};

export default App;