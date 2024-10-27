import React from 'react';
import './cashierLeftPane.css'

const ButtonScreen = () => {
    return (
        <div className = "cashierScreen">
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
        </div>
    );
};

export default ButtonScreen;