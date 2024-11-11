import React, {useState} from 'react';
import './Menu.css'

function Menu({seasonalItems, mainMenuItems, drinks, currentMenu, menuItemList}) {
    const [itemID, setItemID] = useState(1);

    const handleButtonClick = (menuItem) => () =>{
        setItemID(itemID + 1);

        // menuItemList.push(menuItem);
        menuItemList.push(
            {
                menuItemID: itemID,
                menuItem: menuItem,
                editStatus: false
            }
        )
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


    for(let i= 0; i < mainMenuItems.length; i++){
        menuItemBtns1.push(ButtonComponent(mainMenuItems[i]));
    }

    for(let i= 0; i < seasonalItems.length; i++){
        menuItemBtns2.push(ButtonComponent(seasonalItems[i]));
    }

    for(let i= 0; i < drinks.length; i++){
        menuItemBtns3.push(ButtonComponent(drinks[i]));
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