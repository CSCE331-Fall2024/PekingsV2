import React from 'react';
import Navbar from './components/Navbar';
import './app.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';


const App = () => {
  return (
    <div className = "empty">
      <Router>
          <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;