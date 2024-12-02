import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Career from './components/pages/Careers';
import LogIn from './components/pages/LogIn';
import MenuBoard from './components/pages/MenuBoard';
import AccessibilityPanel from './components/AccessibilityPanel';
import Cashier from "./Cashier";
import Kitchen from "./Kitchen.jsx";
import Manager from "./Manager.jsx";
import Display from "./Display.jsx";

/**
 * The `App` component serves as the main application container and routing configuration.
 * Manages global application state, routing, and integration of Google Translate.
 *
 * @component
 * @returns {JSX.Element} The primary application structure with routing and global components
 *
 * @state
 * @state {boolean} isVisible - Controls visibility of Navbar and AccessibilityPanel
 * @state {boolean} isTranslateVisible - Manages Google Translate element visibility
 *
 * @methods
 * @method googleTranslateElementInit - Initializes Google Translate functionality
 *
 * @effects
 * @effect Dynamically loads Google Translate script on component mount
 *
 * @example
 * <App />
 *
 * @remarks
 * - Implements React Router for navigation
 * - Dynamically loads translation services
 * - Supports conditional rendering of global components
 * - Provides routes for Home, Menu Board, Careers, and Log In
 */

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

  const [isVisible, setIsVisible] = useState(true);
  const [isTranslateVisible, setIsTranslateVisible] = useState(true);

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
  }, [isVisible]);


  return (
      <div className = "empty">
          <Router>
              {isVisible ? (<Navbar/>) : (<div/>)}
              <div className="app-content">
                  <div id="google_translate_element"
                       style={{ display: isTranslateVisible ? 'block' : 'none' }}
                  ></div>
                  <Routes>
                  <Route path="/" element={<Home/>}/>
                      <Route path="/MenuBoard" element={<MenuBoard/>}/>
                      <Route path="/Careers" element={<Career/>}/>
                      <Route path="/sign-up" element={<LogIn
                          setNavbarVisibility={setIsVisible}
                          setIsTranslateVisible={setIsTranslateVisible}/>}/> {/* No idea where the sign-up path comes from*/}
                      <Route path="/Cashier" element={<Cashier />} />
                      <Route path="/Kitchen" element={<Kitchen />} />
                      <Route path="/Manager" element={<Display />} />
                  </Routes>
              </div>
              {isVisible ? (<AccessibilityPanel/>) : (<div/>)}
          </Router>
      </div>
);
};

export default App;