import React, { useState } from 'react';
import Navbar from './components/Navbar';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Career from './components/pages/Careers';
import LogIn from './components/pages/LogIn';
import MenuBoard from './components/pages/MenuBoard';



const App = () => {
    const [isVisible, setIsVisible] = useState(true);
      return (
        <>
          <Router>
              {isVisible ? ( <Navbar/> ) : (<div/>) }
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/MenuBoard" element={<MenuBoard />} />
              <Route path="/Careers" element={<Career />} />
              <Route path="/sign-up" element={<LogIn setNavbarVisibility={setIsVisible}/>} /> {/* No idea where the sign-up path comes from*/}
            </Routes>
          </Router>
        </>
      );
};

export default App;