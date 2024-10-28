import React from 'react';
import './topPane.css'

// eslint-disable-next-line react/prop-types
function TopPane({screenChange}){
    return (
        <div className="topPane">
            <button className="memoBtn" onClick={() => screenChange('memo')}>Memo</button>
            <button className="drinksBtn" onClick={() => screenChange('drinks')}>Drinks</button>
            <button className="mainMenuBtn" onClick={() => screenChange('main')}>Main Menu</button>
            <button className="seasonalBtn" onClick={() => screenChange('seasonal')}>Seasonal</button>
        </div>
    );
}

export default TopPane;