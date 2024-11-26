import React, {useState} from 'react';
import './Menu.css'

/**
 * `Menu` component displays a dynamic list of menu items based on the selected category (main, seasonal, drinks).
 * Each item in the menu can be added to a list by clicking its corresponding button.
 * The `itemID` is incremented with each click to ensure unique IDs for each menu item added.
 *
 * @param {Object[]} seasonalItems - List of seasonal menu items with properties like `name`, `ingredients`, etc.
 * @param {Object[]} mainMenuItems - List of main menu items with properties like `name`, `ingredients`, etc.
 * @param {Object[]} drinks - List of drink items with properties like `name`, `ingredients`, etc.
 * @param {string} currentMenu - A string indicating the currently active menu. Can be 'main', 'seasonal', or 'drinks'.
 * @param {Array} menuItemList - A list where selected menu items are added, with each item having a unique `menuItemID`.
 *
 * @returns {JSX.Element} A JSX element that renders the menu with buttons for each menu item based on the `currentMenu`.
 *
 * @example
 * const seasonalItems = [
 *   { name: 'Pumpkin Spice Latte', ingredients: ['pumpkin', 'spice', 'milk'] },
 *   { name: 'Fall Salad', ingredients: ['lettuce', 'croutons', 'pumpkin'] }
 * ];
 * const mainMenuItems = [
 *   { name: 'Cheeseburger', ingredients: ['beef', 'cheese', 'lettuce'] },
 *   { name: 'Chicken Wrap', ingredients: ['chicken', 'wrap', 'lettuce'] }
 * ];
 * const drinks = [
 *   { name: 'Coke', ingredients: ['soda'] },
 *   { name: 'Water', ingredients: [] }
 * ];
 *
 * <Menu
 *   seasonalItems={seasonalItems}
 *   mainMenuItems={mainMenuItems}
 *   drinks={drinks}
 *   currentMenu='main'
 *   menuItemList={menuItemList}
 * />
 */
function Menu({ seasonalItems, mainMenuItems, drinks, currentMenu, menuItemList }) {
    const [itemID, setItemID] = useState(1);

    /**
     * Handles adding a menu item to the `menuItemList` with a unique `menuItemID`.
     * The `menuItem` object is deep cloned to prevent direct mutation.
     *
     * @param {Object} menuItem - The menu item object that was clicked.
     */
    const handleButtonClick = (menuItem) => () => {
        setItemID(itemID + 1);

        const menuItemCopy = JSON.parse(JSON.stringify(menuItem));
        menuItemList.push(
            {
                menuItemID: itemID,
                menuItem: menuItemCopy,
                editStatus: false
            }
        );
    };

    /**
     * Renders a button component for a menu item.
     *
     * @param {Object} menuItem - The menu item object to display on the button.
     * @returns {JSX.Element} The button element for the menu item.
     */
    const ButtonComponent = (menuItem) => {
        return (
            <button onClick={handleButtonClick(menuItem)} className="action-button">
                {menuItem.name}
            </button>
        );
    };

    const menuItemBtns1 = [];
    const menuItemBtns2 = [];
    const menuItemBtns3 = [];

    // Generate buttons for main menu items
    for (let i = 0; i < mainMenuItems.length; i++) {
        if (mainMenuItems[i].ingredients.length > 0) {
            menuItemBtns1.push(ButtonComponent(mainMenuItems[i]));
        }
    }

    // Generate buttons for seasonal items
    for (let i = 0; i < seasonalItems.length; i++) {
        if (seasonalItems[i].ingredients.length > 0) {
            menuItemBtns2.push(ButtonComponent(seasonalItems[i]));
        }
    }

    // Generate buttons for drinks
    for (let i = 0; i < drinks.length; i++) {
        if (drinks[i].ingredients.length > 0) {
            menuItemBtns3.push(ButtonComponent(drinks[i]));
        }
    }

    return (
        <div className="menuSquare">
            <div className="menuBox" style={{ display: currentMenu === 'main' ? 'flex' : 'none' }}>
                {menuItemBtns1}
            </div>
            <div className="seasonal" style={{ display: currentMenu === 'seasonal' ? 'flex' : 'none' }}>
                {menuItemBtns2}
            </div>
            <div className="drinks" style={{ display: currentMenu === 'drinks' ? 'flex' : 'none' }}>
                {menuItemBtns3}
            </div>
            <div></div>
        </div>
    );
}

export default Menu;