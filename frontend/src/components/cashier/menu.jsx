import React from 'react';
import './menu.css'

const ButtonComponent = (label) => {
    return (
        <button className="action-button">
            {label}
        </button>
    );
};

function Menu(){

    const menuItemBtns = [];

    for(let i=0; i<20; i++){
        menuItemBtns.push(ButtonComponent("Chicken"))
    }

    return (
      <div className="menuSquare">
          <div className="menuBox">
              {menuItemBtns}
          </div>
      </div>
    );
}

export default Menu;