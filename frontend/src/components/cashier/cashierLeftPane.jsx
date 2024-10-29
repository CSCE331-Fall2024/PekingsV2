import React from 'react';
import './cashierLeftPane.css'

function LeftRect (){
    return (
        <div className="leftRectangle">
            <button className="logo">
                <img className="logoButton" src="/images/pekingslogo.png"></img>
            </button>
            <button className="exit">Exit</button>

            <button className="newOrder">New<br />Order</button>
            <button className="viewPrevious">View<br />Previous</button>
            <button className="menuBtn">Menu</button>

            <button className = "cancelOrder">Cancel Order</button>
        </div>
    );
}

export default LeftRect;