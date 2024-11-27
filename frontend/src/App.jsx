import React, {useEffect} from 'react';
import Navbar from './components/Navbar';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Career from './components/pages/Careers';
import MenuBoard from './components/pages/MenuBoard';

import AccessibilityPanel from './components/AccessibilityPanel';
import Cashier from "./Cashier.jsx";
// import Magnifier from 'react-magnifier';

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
    <div className = "empty">
      <Router>
        <Navbar />
        <div className="app-content">
        <div id="google_translate_element"></div>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/MenuBoard" element={<MenuBoard />} />
            <Route path="/Careers" element={<Career />} />
            <Route path="/Cashier" element={<Cashier />} />
          </Routes>
        </div>
        <AccessibilityPanel/>
      </Router>
    </div>
  );
};

export default App;