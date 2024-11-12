import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Career from './components/pages/Careers';
import MenuBoard from './components/pages/MenuBoard';


const App = () => {
  return (
    <>
      <Router>
          <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/MenuBoard" element={<MenuBoard />} />
          <Route path="/Careers" element={<Career />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;