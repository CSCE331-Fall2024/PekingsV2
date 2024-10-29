// import React from 'react';
// import Navbar from './components/Navbar';
// import './app.css';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './components/pages/Home';
//
//
// const App = () => {
//   return (
//     <>
//       <Router>
//           <Navbar/>
//         <Routes>
//           <Route path="/" element={<Home />} />
//         </Routes>
//       </Router>
//     </>
//   );
// };
//
// export default App;
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Manager from './Manager';
import './App.css';

function App() {
    const [selectedSection, setSelectedSection] = useState('Inventory');
        return (

            <div className="app-container">
                <Sidebar onSelect={setSelectedSection}/>
                <Manager selectedSection={selectedSection}/>
            </div>

        );
}

export default App;