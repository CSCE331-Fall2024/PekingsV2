import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Manager from './Manager';
import './Display.css';
/*comment*/

function Display({logout}) {
    const [selectedSection, setSelectedSection] = useState('Inventory');
    return (

        <div className="display-container">
            <Sidebar logout={logout} onSelect={setSelectedSection}/>
            <Manager selectedSection={selectedSection}/>
        </div>

    );
}

export default Display;