import React, {useState} from 'react';
import './menu.css'

let menuItemList = [];
const handleButtonClick = (menuItem) => () =>{
    menuItemList.push(menuItem);
    console.log(menuItemList.length); // Action to perform
    console.log(menuItem.name);
};


const ButtonComponent = (menuItem) => {
    return (
        <button onClick = {handleButtonClick(menuItem)} className="action-button">
            {menuItem.name}
        </button>
    );
};

export let getOrderItems = () => {
    return menuItemList;
}

function Menu(menuItems) {

    const menuItemBtns = [];

    for(let i= 0; i < menuItems.length; i++){
        menuItemBtns.push(ButtonComponent(menuItems[i]));
    }

    return (
      <div className="menuSquare">
          <div className="menuBox">
              {menuItemBtns}
          </div>
          <div></div>
      </div>
    );
}

export default Menu;