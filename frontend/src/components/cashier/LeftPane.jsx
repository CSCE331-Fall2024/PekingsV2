import React from 'react';
import './LeftPane.css';

function LeftRect({ centerChange, addScreen , handleCancel}) {
    return (
        <div className="leftRectangle">
            <button className="logo-cash">
                <img className="logoButton" src="/images/pekingslogo.png" alt="Logo" />
            </button>
            <button className="exit">Exit</button>

            <div className="leftRect3Btns-cash">
                <button className="newOrder" onClick={addScreen}>
                    New<br/>Order
                </button>

                <button className="viewPrevious" onClick={() => centerChange('previous')}>View<br/>Previous</button>

                <button className="menuBtn" onClick={() => centerChange('menu')}>Menu</button>
            </div>
            <button className="cancelOrder" onClick={() => handleCancel()}>Cancel Order</button>
        </div>
    );
}

export default LeftRect;
