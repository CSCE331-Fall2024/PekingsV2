import React from 'react';
import './Sidebar.css';
/*added comment*/
function Sidebar({ onSelect }) {
    return (
        <div className="sidebar">

            <img src = "/images/pekingslogo.png" alt = "PeKing Duck Logo" className = "logo"/>

            <button onClick={() => onSelect('Inventory')}>Inventory</button>
            <button onClick={() => onSelect('Menu Items')}>Menu Items</button>
            <button onClick={() => onSelect('Employees')}>Employees</button>
            <button onClick={() => onSelect('Statistics')}>Statistics</button>
        </div>
    );
}

export default Sidebar;