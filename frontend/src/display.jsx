import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Manager from './Manager';
import './Display.css';

function Display() {
    const [selectedSection, setSelectedSection] = useState('Inventory');
    return (

        <div className="display-container">
            <Sidebar onSelect={setSelectedSection}/>
            <Manager selectedSection={selectedSection}/>
        </div>

    );
}

export default Display;