import React from 'react';
import './topPane.css'

function TopPane(){
    return (
        <div className="topPane">
            <button className="memoBtn">Memo</button>
            <button className="drinksBtn">Drinks</button>
            <button className="mainMenuBtn">Main Menu</button>
            <button className="seasonalBtn">Seasonal</button>
        </div>
    );
}

export default TopPane;