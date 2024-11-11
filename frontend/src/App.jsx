import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Career from './components/pages/Careers';
import Mission from './components/pages/Mission';


const App = () => {
  return (
    <div className = "empty">
      <Router>
          <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Mission" element={<Mission />} />
          <Route path="/Careers" element={<Career />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;