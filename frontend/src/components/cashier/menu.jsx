import React, {useState} from 'react';
import './menu.css'

function Menu(menuItems1, menuItems2, menuItems3, {currentMenu, menuItemList}) {
    const handleButtonClick = (menuItem) => () =>{
        menuItemList.push(menuItem);
    };

    const ButtonComponent = (menuItem) => {
        return (
            <button onClick = {handleButtonClick(menuItem)} className="action-button">
                {menuItem.name}
            </button>
        );
    };

    const menuItemBtns1 = [];
    const menuItemBtns2 = [];
    const menuItemBtns3 = [];

    for(let i= 0; i < menuItems1.length; i++){
        menuItemBtns1.push(ButtonComponent(menuItems1[i]));
    }

    for(let i= 0; i < menuItems2.length; i++){
        menuItemBtns2.push(ButtonComponent(menuItems2[i]));
    }

    for(let i= 0; i < menuItems3.length; i++){
        menuItemBtns3.push(ButtonComponent(menuItems3[i]));
    }

    return (
        <div className="menuSquare">
            <div className="menuBox" style={{display: currentMenu === 'main' ? 'flex' : 'none'}}>
                {menuItemBtns1}
            </div>
            <div className="seasonal" style={{display: currentMenu === 'seasonal' ? 'flex' : 'none'}}>
                {menuItemBtns2}
            </div>
            <div className="drinks" style={{display: currentMenu === 'drinks' ? 'flex' : 'none'}}>
                {menuItemBtns3}
            </div>
            <div></div>
        </div>
    );
}

export default Menu;